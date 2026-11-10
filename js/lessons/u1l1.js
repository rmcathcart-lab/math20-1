/* Math 20-1 · Unit 1 · Lesson 1 — Patterns, Sequences and the General Term (outcome RF9 on every part)
 * Assignment 1 (u1_l01.tex, Questions 1–14) and the Lesson 1 Extra Practice (u1_ep01.tex, A1–A4, B1–B7, C1–C2).
 * Every part is a generator: the booklet question's idea, form and difficulty with new numbers (the lesson's example
 * numbers and the booklet's own numbers are left out where that is easy). On-screen calculator allowed (Unit 1).
 *
 * This file also holds the sequence kit shared by Lessons 1–3 (HW.seqKit13: term values, the "classify" box,
 * the rule box, the arithmetic general-term checker, sequence graphs and tile drawings). u1l2.js and u1l3.js need it,
 * so this file must load first.
 *
 * Conversions: "draw Figure 4" → pick the right picture (multiple choice); "explain" → multiple choice of reasons;
 * "classify, state d or r" → one box: tap d = or r = and type the value, or tap neither; "describe the rule using only
 * addition or multiplication" → a rule box (+ 7, × 1/3); "finite or infinite" → a table of choices.
 * Levels: LIM BEG EMG PRG ADV MAS. Mastery: Extra C1 (three expressions in an arithmetic sequence). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, B = K.P, ex = HW.ex, F = HW.fmt, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, P = HW.poly;

  /* ============================== the sequence kit (Lessons 1–3) ============================== */
  var S = HW.seqKit13 = {};
  function cl(x) { return Math.round(x * 1e9) / 1e9; }
  function same(a, b) { return Math.abs(a - b) < 1e-9 * Math.max(1, Math.abs(a), Math.abs(b)); }
  function isInt(x) { return Math.abs(x - Math.round(x)) < 1e-9; }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var r = a % b; a = b; b = r; } return a; }
  function range(a, b) { var o = []; for (var i = a; i <= b; i++) o.push(i); return o; }
  function pickWhere(gen, okf, lid) { for (var i = 0; i < 5000; i++) { var o = gen(); if (okf(o)) return o; } throw new Error((lid || 'u1') + ': no valid numbers'); }
  /* x as an exact fraction [p, q] (denominators up to 5000) */
  function fr(x) { if (isInt(x)) return [Math.round(x), 1]; for (var q = 2; q <= 5000; q++) { var p = Math.round(x * q); if (Math.abs(p / q - x) < 1e-9) { var g = gcd(p, q); return [p / g, q / g]; } } return null; }
  function terminates(x) { var f = fr(x); if (!f) return false; var q = f[1]; while (q % 2 === 0) q /= 2; while (q % 5 === 0) q /= 5; return q === 1; }
  function decPlaces(x) { var s = String(cl(x)); return (s.split('.')[1] || '').length; }
  /* LaTeX of a value: integers and short decimals as they are; other values (or frac = true) as fractions */
  function vT(x, frac) {
    x = cl(x); if (isInt(x)) return F(Math.round(x));
    if (!frac && terminates(x) && decPlaces(x) <= 4) return F(x);
    var f = fr(x); if (!f) return F(x);
    return (f[0] < 0 ? '-' : '') + '\\frac{' + Math.abs(f[0]) + '}{' + f[1] + '}';
  }
  /* a value that follows an operation: brackets around negatives */
  function vP(x, frac) { x = cl(x); return x < 0 ? '\\left(' + vT(x, frac) + '\\right)' : vT(x, frac); }
  function needsFrac(x, frac) { x = cl(x); return !isInt(x) && (frac || !terminates(x) || decPlaces(x) > 4); }
  function vKey(x, frac) { x = cl(x); if (isInt(x)) return String(Math.round(x)); if (!needsFrac(x, frac)) return String(x); var f = fr(x); if (!f) return String(x); return (f[0] < 0 ? '-' : '') + '\\frac{' + Math.abs(f[0]) + '}{' + f[1] + '}'; }
  /* "+ 3" / "- 3" for writing a sum */
  function sgn(x, frac) { x = cl(x); return x < 0 ? '-' + vT(-x, frac) : '+' + vT(x, frac); }
  function seqTex(list, o) { o = o || {}; return list.map(function (x) { return vT(x, o.frac); }).join(',\\ ') + (o.inf === false ? '' : ',\\ \\dots'); }
  S.cl = cl; S.same = same; S.isInt = isInt; S.gcd = gcd; S.range = range; S.pickWhere = pickWhere; S.fr = fr; S.terminates = terminates;
  S.vT = vT; S.vP = vP; S.vKey = vKey; S.sgn = sgn; S.seqTex = seqTex; S.needsFrac = needsFrac;
  S.arith = function (t1, d, n) { var o = []; for (var i = 0; i < n; i++) o.push(cl(t1 + i * d)); return o; };
  S.geom = function (t1, r, n) { var o = []; for (var i = 0; i < n; i++) o.push(cl(t1 * Math.pow(r, i))); return o; };
  S.tsub = function (k) { return 't_{' + k + '}'; };

  var CODES = {
    'u1l1-cls-type': 'Arithmetic and geometric mixed up', 'u1l1-cls-neither': 'Called it neither (it has a common difference or ratio)',
    'u1l1-cls-not-neither': 'Gave d or r for a sequence that is neither', 'u1l1-d-sign': 'Common difference with the wrong sign (subtracted backwards)',
    'u1l1-r-flip': 'Common ratio upside down (divided backwards)', 'u1l1-r-sign': 'Common ratio with the wrong sign',
    'u1l1-shift': 'Gave the term from the next or previous position', 'u1l1-n0': 'Started the positions at n = 0',
    'u1l1-gt-n': 'General term: used n steps instead of n − 1', 'u1l1-gt-swap': 'General term: t₁ and d swapped',
    'u1l1-gt-dsign': 'General term: wrong sign of d', 'u1l1-gt-expand': 'General term: slip expanding (n − 1)d',
    'u1l1-rule-type': 'Rule: added instead of multiplied (or the reverse)', 'u1l1-rule-sign': 'Rule: wrong sign',
    'u1l1-exp-n1': 'Used the exponent n − 1 where the formula has n', 'u1l1-alt-sign': 'Alternating sign the wrong way round',
    'u1l1-no-alt': 'Dropped the alternating sign', 'u1l1-solve-step': 'Solving for n: stopped before dividing',
    'u1l1-solve-sign': 'Solving for n: sign slip moving the constant', 'u1l1-add-not-mult': 'Added instead of multiplying',
    'u1l1-sq-coef': 'Squared the coefficient as well', 'u1l1-sq-double': 'Doubled n instead of squaring it',
    'u1l1-exp-off': 'Exponent off by one (position n has exponent n − 1)', 'u1l1-recur-order': 'Recursive rule: did the steps in the wrong order',
    'u1l1-gave-value': 'Gave the term instead of its position', 'u1l1-eq-wrong': 'Set the wrong two differences equal'
  };
  HW.addCodes(CODES);
  HW.addPartial({ 'u1l1-d-sign': 's', 'u1l1-r-flip': 'b', 'u1l1-r-sign': 's', 'u1l1-shift': 's', 'u1l1-n0': 'b', 'u1l1-gt-n': 'b', 'u1l1-gt-swap': 'n',
    'u1l1-gt-dsign': 's', 'u1l1-gt-expand': 's', 'u1l1-rule-sign': 's', 'u1l1-exp-n1': 'b', 'u1l1-alt-sign': 's', 'u1l1-no-alt': 'b', 'u1l1-solve-step': 'b',
    'u1l1-solve-sign': 's', 'u1l1-sq-coef': 'b', 'u1l1-sq-double': 'n', 'u1l1-exp-off': 's', 'u1l1-recur-order': 'b', 'u1l1-gave-value': 'b', 'u1l1-eq-wrong': 'b',
    'u1l1-cls-type': 'n', 'u1l1-cls-neither': 'n', 'u1l1-cls-not-neither': 'n', 'u1l1-rule-type': 'n', 'u1l1-add-not-mult': 'n' });

  /* ---- keypads (browser only): the classify box and the rule box ---- */
  var W = HW.widgets;
  if (W && W.KEYSETS) {
    var dg = function (n) { return { label: String(n), tex: String(n), plain: String(n) }; };
    var KK = { del: { label: '⌫', fn: 'del', title: 'Delete' }, clear: { label: 'clear', fn: 'clear' }, left: { label: '◀', fn: 'left', title: 'Move left' }, right: { label: '▶', fn: 'right', title: 'Move right (out of a box)' },
      enter: { label: 'Check ↵', fn: 'enter', wide: true }, frac: { label: '<sup>a</sup>⁄<sub>b</sub>', tex: '\\frac{#@}{#?}', plain: '/', title: 'Fraction' },
      neg: { label: '−', tex: '-', plain: '-' }, dot: { label: '.', tex: '.', plain: '.' } };
    W.KEYSETS.u1cls = [[dg(7), dg(8), dg(9), { label: '<i>d</i> =', tex: 'd=', plain: 'd=', title: 'Arithmetic: common difference' }, KK.del],
      [dg(4), dg(5), dg(6), { label: '<i>r</i> =', tex: 'r=', plain: 'r=', title: 'Geometric: common ratio' }, KK.clear],
      [dg(1), dg(2), dg(3), KK.frac, KK.left, KK.right],
      [dg(0), KK.dot, KK.neg, { label: 'neither', tex: '\\text{neither}', plain: 'neither', title: 'Neither arithmetic nor geometric' }, KK.enter]];
    W.KEYSETS.u1rule = [[dg(7), dg(8), dg(9), { label: '+ add', tex: '+', plain: '+', title: 'Add' }, KK.del],
      [dg(4), dg(5), dg(6), { label: '× multiply', tex: '\\times', plain: ' × ', title: 'Multiply' }, KK.clear],
      [dg(1), dg(2), dg(3), KK.frac, KK.left, KK.right], [dg(0), KK.dot, KK.neg, KK.enter]];
    if (W.KEYHELP) {
      W.KEYHELP.u1cls = ['Arithmetic: tap <b>d =</b> and type the common difference. Geometric: tap <b>r =</b> and type the common ratio (use <b><sup>a</sup>⁄<sub>b</sub></b> for a fraction). Otherwise tap <b>neither</b>.', 'Type e.g. <code>d = -7</code>, <code>r = 1/2</code> or <code>neither</code>.'];
      W.KEYHELP.u1rule = ['Rule: tap <b>+</b> or <b>×</b>, then the number (e.g. + 7, × ⅓, × (−5)). Type the terms in the other boxes.', 'Rule: type e.g. <code>+7</code> or <code>×1/3</code> (or <code>*1/3</code>).'];
    }
  }

  /* ---- one value (integer, decimal or fraction); cands = [[value, code, hint]] for known wrong values ---- */
  function diagOf(cands, target) {
    return function (v) { for (var i = 0; i < (cands || []).length; i++) { var c = cands[i]; if (c && isFinite(c[0]) && !same(c[0], target) && same(v, c[0])) return { code: c[1], hint: c[2] }; } return null; };
  }
  function valCheck(x, cands) {
    x = cl(x); var fx = fr(x); if (fx) x = fx[0] / fx[1];
    var inner = K.value(fx || x, { only: 'fraction', diag: diagOf(cands, x) });
    return function (resp) {
      var s = String(resp == null ? '' : resp);
      if (/^\s*(\\text\{\s*none\s*\}|none)\s*$/i.test(s)) return wrong('value', null);
      var r = inner(resp);
      if (r.v === 'wrong' && r.code === 'value') {
        var p = HW.parse.number(s);
        if (p.ok && !terminates(x) && Math.abs(p.value - x) < 0.006) return form('decimal-rounded', 'Close — but that decimal is rounded. Give the exact value as a fraction (use the fraction key).');
      }
      return r;
    };
  }
  S.valCheck = valCheck; S.diagOf = diagOf;
  /* field specs for B.fields: a value box, a general-term box, a "position or none" box */
  S.fNum = function (lab, x, cands, o) { o = o || {}; return { lab: lab, label: lab ? t(lab + '=') : '', name: lab ? t(lab) : o.name, chk: valCheck(x, cands), key: vKey(x, o.frac), ans: vT(x, o.frac), frac: needsFrac(x, o.frac), cands: cands, x: x, before: o.before, after: o.after }; };
  S.fPoly = function (lab, target, o) {
    o = o || {}; var T = P.lift ? P.lift(target) : (typeof target === 'string' ? P.parse(target) : target);
    var tex = o.keyTex || P.tex(T, { dec: true, var: o.var || 'n' });
    return { lab: lab, label: lab ? t(lab + '=') : '', name: lab ? t(lab) : o.name, chk: polyChk(T, o), key: tex, ans: tex, poly: true, vars: P.vars(T).concat(o.vars || []), before: o.before, after: o.after };
  };
  S.fPos = function (lab, n, cands) { // a position, or "none" when the number is not a term
    var base = n == null ? null : valCheck(n, cands);
    return { lab: lab, label: lab ? t(lab) : '', name: lab ? t(lab) : '', none: true, key: n == null ? 'none' : String(n), ans: n == null ? '\\text{not a term}' : 'n=' + n,
      chk: function (resp) {
        var s = String(resp == null ? '' : resp).replace(/\\text\{\s*([^{}]*)\}/g, '$1').trim(), isNone = /^(none|no|not\s*a\s*term)$/i.test(s.replace(/\\[,;: ]/g, ' ').trim());
        if (!s) return form('empty', 'Type the position, or press <b>none</b> if it is not a term.');
        if (n == null) { if (isNone) return ok(); var p = HW.parse.number(s); if (p.ok && !isInt(p.value)) return wrong('u1l1-not-natural', 'You found ' + t('n=' + F(cl(p.value))) + ' — that is not a natural number, so there is no such position. Press <b>none</b>.'); return wrong('value', 'Solve for ' + t('n') + ': if ' + t('n') + ' is not a natural number, the number is not a term (press <b>none</b>).'); }
        if (isNone) return wrong('value', 'Solve for ' + t('n') + ' — here it comes out as a natural number, so it is a term.');
        var q = HW.parse.number(s.replace(/^n\s*=\s*/, '')); if (q.ok && !isInt(q.value)) return wrong('u1l1-not-natural', 'A position must be a natural number. Check your solving.');
        return base(s.replace(/^n\s*=\s*/, ''));
      } };
  };
  HW.addCodes({ 'u1l1-not-natural': 'Gave a position that is not a natural number' });
  /* a part from field specs. o.keys forces the keypad. */
  S.fieldsPart = function (prompt, specs, sol, hints, text, o) {
    o = o || {};
    var anyPoly = specs.some(function (s) { return s.poly; }), anyFrac = specs.some(function (s) { return s.frac || s.none; });
    var keys = o.keys || (anyPoly ? 'poly' : anyFrac ? 'fraction' : null);
    var vars = []; specs.forEach(function (s) { (s.vars || []).forEach(function (v) { if (vars.indexOf(v) < 0) vars.push(v); }); });
    if (keys === 'poly' && !vars.length) vars = ['n'];
    var fields = specs.map(function (s) { return { label: s.label, name: s.name, mode: keys ? 'math' : 'number', keys: keys || undefined, vars: keys === 'poly' ? vars : undefined, none: s.none, before: s.before, after: s.after }; });
    var answer = o.answer || specs.map(function (s) { return s.lab ? t(s.lab + (s.none ? ':\\ ' : '=') + s.ans) : t(s.ans); }).join(', &nbsp;');
    var p = B.fields(prompt, fields, specs.map(function (s) { return s.chk; }), specs.map(function (s) { return s.key; }), answer, sol, hints, text);
    var bad = [];
    specs.forEach(function (s, i) { (s.cands || []).slice(0, 2).forEach(function (c) { if (c && isFinite(c[0]) && !same(c[0], s.x)) { var b = p.key.slice(); b[i] = vKey(c[0], true); bad.push(b); } }); });
    p.bad = bad.slice(0, 4);
    return p;
  };
  /* one value in a number box (or a fraction box when it needs one) */
  S.numPart = function (prompt, x, cands, sol, hints, text, o) {
    o = o || {}; x = cl(x);
    var frac = needsFrac(x, o.frac), inp = frac || o.math ? { type: 'math', keys: 'fraction', before: o.before, after: o.after } : { type: 'number', before: o.before, after: o.after };
    var bad = (cands || []).filter(function (c) { return c && isFinite(c[0]) && !same(c[0], x); }).slice(0, 4).map(function (c) { return vKey(c[0], true); });
    return { prompt: prompt, input: inp, check: valCheck(x, cands), key: vKey(x, o.frac), answer: t((o.ansPre || '') + vT(x, o.frac) + (o.ansPost || '')), solution: sol, hints: hints || [], text: text, bad: bad };
  };
  S.mc = function (r, prompt, opts, sol, hints, text, keep) {
    var seen = {}; opts = opts.filter(function (o) { if (seen[o.html]) return false; seen[o.html] = 1; return true; });
    return B.mc(r, prompt, opts, sol, hints, text, keep);
  };

  /* ---- the general term of an arithmetic sequence: t_n = dn + (t1 − d), expanded and simplified ---- */
  function rq(x) { var f = fr(cl(x)); if (!f) throw new Error('u1 kit: not a fraction ' + x); return f; }
  S.rq = rq;
  S.lin = function (m, b, v) { var o = {}; o[v || 'n'] = 1; return P.add(P.mono(rq(m), o), P.num(rq(b))); };
  function stripLhs(resp) {
    var s = String(resp == null ? '' : resp);
    var m = /^\s*(?:[A-Za-z](?:_\{?\s*[A-Za-z0-9]+\s*\}?)?(?:\\left)?\s*(?:\(\s*[a-z]\s*(?:\\right)?\))?)\s*=\s*/.exec(s);
    return m && !/^\s*[A-Za-z]\s*=\s*$/.test(s) ? s.slice(m[0].length) : s;
  }
  S.stripLhs = stripLhs;
  function polyChk(T, o) { var c = K.poly(T, o || {}); return function (resp) { return c(stripLhs(resp)); }; }
  S.polyChk = polyChk;
  /* classic wrong general terms for t1, d (any letter v) */
  S.gtWrongs = function (t1, d, v) {
    v = v || 'n'; var L = S.lin;
    var w = [{ is: L(d, t1, v), code: 'u1l1-gt-n', hint: 'Check ' + t('t_1') + ' in your formula: with ' + t(v + '=1') + ' it should give ' + t(vT(t1)) + '. It takes ' + t(v + '-1') + ' steps (not ' + t(v) + ') to get from ' + t('t_1') + ' to ' + t('t_' + v) + ': ' + t('t_' + v + '=t_1+(' + v + '-1)d') + '.' },
      { is: L(t1, d - t1, v), code: 'u1l1-gt-swap', hint: 'You swapped ' + t('t_1') + ' and ' + t('d') + '. The common difference ' + t('d=' + vT(d)) + ' multiplies ' + t('(' + v + '-1)') + '; the first term ' + t(vT(t1)) + ' is added on.' },
      { is: L(-d, t1 + d, v), code: 'u1l1-gt-dsign', hint: 'Check the sign of ' + t('d') + ': it is the next term minus the term before, ' + t('d=' + vT(d)) + '.' },
      { is: L(d, t1 + d, v), code: 'u1l1-gt-expand', hint: 'Expanding ' + t('(' + v + '-1)' + vP(d)) + ' gives ' + t(vT(d) + v + sgn(-d)) + ' — the ' + t('-1') + ' multiplies ' + t('d') + ' too.' },
      { is: L(d, t1 - 1, v), code: 'u1l1-gt-expand', hint: 'Expanding ' + t('(' + v + '-1)' + vP(d)) + ': the ' + t('-1') + ' is multiplied by ' + t(vT(d)) + ', giving ' + t(sgn(-d)) + ' (not ' + t('-1') + ').' }];
    return w.filter(function (x) { return !P.eq(x.is, L(d, t1 - d, v)); });
  };
  /* the working: t_n = t1 + (n − 1)(d) = t1 + dn − d = dn + (t1 − d) */
  S.gtSteps = function (t1, d, v, lhs) {
    v = v || 'n'; lhs = lhs || 't_' + v; var T = S.lin(d, t1 - d, v), d0 = cl(d);
    return lhs + '=' + vT(t1) + '+(' + v + '-1)' + vP(d0) + '=' + vT(t1) + sgn(d0) + v + sgn(-d0) + '=' + P.tex(T, { dec: true, var: v });
  };
  S.gtTex = function (t1, d, v) { return P.tex(S.lin(d, t1 - d, v), { dec: true, var: v || 'n' }); };
  S.gtSpec = function (lab, t1, d, o) { o = o || {}; var v = o.v || 'n'; return S.fPoly(lab, S.lin(d, t1 - d, v), { wrong: S.gtWrongs(t1, d, v).concat(o.wrong || []), var: v }); };
  S.gtPart = function (prompt, t1, d, sol, hints, text, o) {
    o = o || {}; var v = o.v || 'n', lhs = o.lhs || 't_' + v, T = S.lin(d, t1 - d, v), tex = P.tex(T, { dec: true, var: v });
    var wr = S.gtWrongs(t1, d, v).concat(o.wrong || []);
    return { prompt: prompt, input: { type: 'math', keys: 'poly', vars: [v], before: t(lhs + '=') }, check: polyChk(T, { wrong: wr }), key: tex, answer: t(lhs + '=' + tex),
      solution: sol || t(S.gtSteps(t1, d, v, lhs)), hints: hints || S.HGT, text: text, bad: wr.slice(0, 3).map(function (w) { return P.tex(w.is, { dec: true, var: v }); }) };
  };
  S.HGT = ['Find ' + t('t_1') + ' and ' + t('d') + ', then substitute into ' + t('t_n=t_1+(n-1)d') + '.', 'Expand ' + t('(n-1)d') + ' and collect the numbers, so the answer looks like ' + t('t_n=dn+b') + '.'];

  /* ---- classify: "d = 3", "r = 1/2" or "neither" in one box ---- */
  function readCls(resp) {
    var s = String(resp == null ? '' : resp).replace(/\\left|\\right/g, '').replace(/\\(text|mathrm|operatorname|textrm)\{([^{}]*)\}/g, ' $2 ').replace(/\\[,;:! ]|\\quad|~/g, ' ').replace(/\s+/g, ' ').trim();
    var low = s.toLowerCase();
    if (!low) return { empty: true };
    if (/neither|none/.test(low)) return { kind: 'neither' };
    if (/both/.test(low)) return { kind: 'both' };
    var word = /arith/.test(low) ? 'arith' : /geom/.test(low) ? 'geom' : null;
    s = s.replace(/arithmetic|geometric|arith\.?|geom\.?/ig, '').replace(/^[\s,:;]+/, '').trim();
    var m = /^([dDrR])\s*(?:=|:)\s*(.*)$/.exec(s);
    if (m) return { kind: m[1].toLowerCase() === 'd' ? 'arith' : 'geom', val: m[2].trim(), word: word };
    if (!s) return { kind: word, val: null, word: word };
    return { kind: null, val: s, word: word };
  }
  S.readCls = readCls;
  function diffsOf(a) { var o = []; for (var i = 1; i < a.length; i++) o.push(cl(a[i] - a[i - 1])); return o; }
  function ratsOf(a) { var o = []; for (var i = 1; i < a.length; i++) o.push(a[i - 1] === 0 ? NaN : cl(a[i] / a[i - 1])); return o; }
  function allSame(a) { return a.every(function (x) { return isFinite(x) && same(x, a[0]); }); }
  S.diffsOf = diffsOf; S.ratsOf = ratsOf; S.allSame = allSame;
  /* the classification working, from the terms shown */
  /* ratios as fractions, unless the terms are written as decimals */
  function decCtx(terms, frac) { return !frac && terms.some(function (x) { return !isInt(x) && terminates(x); }); }
  function ratT(x, dc) { return isFinite(x) ? vT(x, !dc) : '—'; }
  S.decCtx = decCtx; S.ratT = ratT;
  S.clsSol = function (terms, kind, val, frac) {
    var dc = decCtx(terms, frac), dfs = diffsOf(terms), rts = ratsOf(terms), dT = dfs.map(function (x) { return vT(x, frac); }).join(',\\ '), rT = rts.map(function (x) { return ratT(x, dc); }).join(',\\ ');
    if (kind === 'arith') return 'Differences (each term minus the one before): ' + t(dT) + ' — all equal. Arithmetic, ' + t('d=' + vT(val, frac)) + '.';
    if (kind === 'geom') return 'Ratios (each term divided by the one before): ' + t(rT) + ' — all equal. Geometric, ' + t('r=' + ratT(val, dc)) + '.';
    return 'Differences ' + t(dT) + ' are not all equal, and ratios ' + t(rT) + ' are not all equal. Neither.';
  };
  S.HCLS = ['Subtract each term from the next one: if every difference is the same, it is arithmetic and that difference is ' + t('d') + '.', 'Divide each term by the one before it: if every ratio is the same, it is geometric and that ratio is ' + t('r') + '.'];
  /* kind: 'arith' (val = d), 'geom' (val = r), 'neither'. terms = what the prompt shows (numbers). */
  S.clsCheck = function (terms, kind, val) {
    var dfs = diffsOf(terms), rts = ratsOf(terms);
    var dc = decCtx(terms), dShow = t(dfs.slice(0, 3).map(function (x) { return vT(x); }).join(',\\ ')), rShow = t(rts.slice(0, 3).map(function (x) { return ratT(x, dc); }).join(',\\ '));
    return function (resp) {
      var c = readCls(resp);
      if (c.empty) return form('empty', 'Tap <b>d =</b> or <b>r =</b> and type the value, or tap <b>neither</b>.');
      if (c.kind === 'both') return wrong(kind === 'neither' ? 'u1l1-cls-not-neither' : 'u1l1-cls-type', 'Only a constant sequence is both. Check the differences (' + dShow + ') and the ratios (' + rShow + ').');
      if (c.kind === 'neither') return kind === 'neither' ? ok() : wrong('u1l1-cls-neither', kind === 'arith' ? 'Check the differences again: ' + dShow + ' — they are all the same.' : 'Check the ratios again: ' + rShow + ' — they are all the same.');
      if (c.val == null || c.val === '') return form('u1l1-cls-value', c.kind === 'arith' ? 'State the common difference too: ' + t('d=\\ ?') : c.kind === 'geom' ? 'State the common ratio too: ' + t('r=\\ ?') : 'Tap <b>d =</b> or <b>r =</b> and type the value, or tap <b>neither</b>.');
      if (kind === 'neither') return wrong('u1l1-cls-not-neither', 'Check: the differences are ' + dShow + ' and the ratios are ' + rShow + ' — neither stays the same, so there is no common difference or ratio.');
      var pv = ex.parse(c.val); if (!pv.ok) return form('unreadable', 'Write the value after the equals sign, e.g. ' + t('d=-7') + ' or ' + t('r=\\frac{1}{2}') + '.');
      var v = ex.value(pv.ast);
      if (!c.kind) return same(v, val) ? form('u1l1-cls-letter', 'Right number — now say which kind of sequence it is: write ' + (kind === 'arith' ? t('d=') : t('r=')) + ' in front (tap the key).') : wrong('value', null);
      if (c.kind !== kind) return wrong('u1l1-cls-type', kind === 'arith' ? 'Each term is the previous term <b>plus</b> the same number (differences ' + dShow + '), so it is arithmetic: give ' + t('d') + '.' : 'Each term is the previous term <b>times</b> the same number (ratios ' + rShow + '), so it is geometric: give ' + t('r') + '.');
      var cands = kind === 'arith' ? [[-val, 'u1l1-d-sign', 'Check the sign: ' + t('d') + ' is each term <b>minus the one before it</b>, ' + t('t_2-t_1') + '.']] : [[1 / val, 'u1l1-r-flip', 'Your ratio is upside down: ' + t('r') + ' is each term <b>divided by the one before it</b>, ' + t('\\frac{t_2}{t_1}') + '.'], [-val, 'u1l1-r-sign', 'Check the sign of ' + t('r') + ': do the terms alternate in sign?']];
      return valCheck(val, cands)(c.val);
    };
  };
  HW.addCodes({ 'u1l1-fin': 'Finite / infinite mixed up' });
  HW.addCodes({ 'u1l1-cls-value': 'Classified without stating d or r', 'u1l1-cls-letter': 'Gave d or r without saying which' });
  S.clsKey = function (kind, val) { return kind === 'neither' ? '\\text{neither}' : (kind === 'arith' ? 'd=' : 'r=') + vKey(val, true); };
  S.clsAns = function (kind, val, frac, dc) { return kind === 'neither' ? 'Neither' : kind === 'arith' ? 'Arithmetic, ' + t('d=' + vT(val, frac)) : 'Geometric, ' + t('r=' + ratT(val, dc)); };
  S.clsPart = function (prompt, terms, kind, val, text, o) {
    o = o || {};
    var badK = kind === 'neither' ? ['d=1', 'r=2'] : kind === 'arith' ? ['\\text{neither}', 'r=' + vKey(val, true), 'd=' + vKey(-val, true)] : ['\\text{neither}', 'd=' + vKey(val, true), 'r=' + vKey(1 / val, true)];
    return { prompt: prompt, input: { type: 'math', keys: 'u1cls', placeholder: 'e.g. d = 3' }, check: S.clsCheck(terms, kind, val), key: S.clsKey(kind, val), answer: S.clsAns(kind, val, o.frac, decCtx(terms, o.frac)),
      solution: o.sol || S.clsSol(terms, kind, val, o.frac), hints: o.hints || S.HCLS, text: text, bad: badK.filter(function (b) { return b !== S.clsKey(kind, val) && !(kind === 'arith' && val === 0); }), good: o.good };
  };

  /* ---- the rule box: "+ 7", "× 1/3" (kind 'add' | 'mul') ---- */
  S.ruleCheck = function (kind, val) {
    return function (resp) {
      var s = String(resp == null ? '' : resp).replace(/\\left|\\right/g, '').replace(/\\text\{([^{}]*)\}/g, ' $1 ').replace(/\\[,;:! ]|~/g, ' ').trim();
      if (!s) return form('empty', 'Write the rule: ' + t('+') + ' or ' + t('\\times') + ' and a number.');
      var low = s.toLowerCase(), k = null, rest = s;
      var w = /^(add|plus|multiply\s*by|multiply|times|subtract|minus|divide\s*by|divide)\s*/i.exec(s);
      if (w) { var wd = w[1].toLowerCase(); k = /add|plus/.test(wd) ? 'add' : /mult|times/.test(wd) ? 'mul' : /sub|minus/.test(wd) ? 'sub' : 'div'; rest = s.slice(w[0].length); }
      else if (/^\+/.test(s)) { k = 'add'; rest = s.slice(1); }
      else if (/^(\\times|\\cdot|×|\*|·)/.test(s)) { k = 'mul'; rest = s.replace(/^(\\times|\\cdot|×|\*|·)/, ''); }
      else if (/^(\\div|÷|\/)/.test(s)) { k = 'div'; rest = s.replace(/^(\\div|÷|\/)/, ''); }
      else if (/^-/.test(s)) { k = 'add'; rest = s; }
      if (!k) return form('u1l1-rule-op', 'Start the rule with ' + t('+') + ' (add) or ' + t('\\times') + ' (multiply), e.g. ' + t('+7') + ' or ' + t('\\times\\frac{1}{3}') + '.');
      var pv = ex.parse(rest.trim()); if (!pv.ok) return form('unreadable', 'Write the number after the ' + t('+') + ' or ' + t('\\times') + ' sign.');
      var v = ex.value(pv.ast);
      if (k === 'sub') { k = 'add'; v = -v; }
      if (k === 'div') { if (kind === 'mul' && same(1 / v, val)) return form('u1l1-rule-div', 'Right idea — but use only multiplication: dividing by ' + t(F(cl(v))) + ' is multiplying by ' + t(vT(1 / v, true)) + '.'); return wrong(kind === 'mul' ? 'value' : 'u1l1-rule-type', kind === 'add' ? 'The terms change by the same <b>amount</b> each time: the rule adds.' : null); }
      if (k !== kind) return wrong('u1l1-rule-type', kind === 'add' ? 'The differences between terms are all the same, so the rule <b>adds</b> a number.' : 'The differences change, but each term is the same <b>multiple</b> of the one before: the rule multiplies.');
      if (same(v, val)) { var vt = valCheck(val)(rest.trim().replace(/^\((.*)\)$/, '$1')); return vt.v === 'form' ? vt : ok(); }
      if (same(v, -val)) return wrong('u1l1-rule-sign', 'Check the sign of the number in your rule.');
      if (kind === 'mul' && same(v, 1 / val)) return wrong('u1l1-r-flip', 'Upside down: the multiplier is each term divided by the one <b>before</b> it.');
      return wrong('value', null);
    };
  };
  HW.addCodes({ 'u1l1-rule-op': 'Rule without + or ×', 'u1l1-rule-div': 'Rule written as a division' });
  S.ruleKey = function (kind, val) { return (kind === 'add' ? '+' : '\\times') + (val < 0 ? '\\left(' + vKey(val, true) + '\\right)' : vKey(val, true)); };
  S.ruleTex = function (kind, val, frac) { return (kind === 'add' ? '+' : '\\times') + vP(val, frac || kind === 'mul'); };
  S.fRule = function (kind, val) { return { lab: '\\text{rule}', label: 'Rule:', name: 'Rule', chk: S.ruleCheck(kind, val), key: S.ruleKey(kind, val), ans: S.ruleTex(kind, val), x: NaN }; };

  /* ---- drawings ---- */
  /* points (n, t_n) of a sequence on a first-quadrant grid. o: { ymax, ymin, step, name, max } */
  S.graph = function (pts, o) {
    o = o || {};
    var ys = pts.map(function (p) { return p[1]; }), lo = o.ymin != null ? o.ymin : Math.min(0, Math.min.apply(null, ys)), hiRaw = Math.max.apply(null, ys.concat([1]));
    /* grid lines through every point when possible (so the terms can be read), labels every few lines */
    var span0 = hiRaw - lo, step = o.step || [20, 10, 5, 4, 3, 2, 1].filter(function (g) { return span0 / g >= 5 && span0 / g <= 30 && ys.every(function (y) { return isInt(y / g); }); })[0] || (span0 <= 30 ? 1 : span0 <= 60 ? 2 : 5);
    var hi = o.ymax || Math.ceil((hiRaw + 0.01) / step) * step; lo = Math.floor(lo / step) * step;
    var lab = step; while ((hi - lo) / lab > 8) lab += step;
    var nx = o.nmax || Math.max.apply(null, pts.map(function (p) { return p[0]; })) + 1;
    return HW.graph({ x: [0, nx], y: [lo, hi], grid: 1, gridY: step, labels: 1, labelsX: 1, labelsY: lab, unitX: 30, unitY: 190 / (hi - lo), xName: o.xName || 'n', yName: o.yName || 'tₙ',
      points: pts.map(function (p) { return { x: p[0], y: p[1], color: o.color }; }), max: o.max || 260, aria: o.aria || 'graph of a sequence' });
  };
  /* tile pictures: figs = [{ cells: [[x, y], …], label }] */
  S.tiles = function (figs, o) {
    o = o || {}; var u = o.u || 12, gap = o.gap || 22, items = [], H = 0;
    figs.forEach(function (f) {
      var xs = f.cells.map(function (c) { return c[0]; }), ys = f.cells.map(function (c) { return c[1]; });
      var mx = Math.min.apply(null, xs), Mx = Math.max.apply(null, xs), my = Math.min.apply(null, ys), My = Math.max.apply(null, ys);
      var w = (Mx - mx + 1) * u, h = (My - my + 1) * u; H = Math.max(H, h); items.push({ f: f, mx: mx, my: my, w: Math.max(w, 52), cw: w, h: h });
    });
    var x0 = 6, s = '';
    items.forEach(function (it) {
      var off = x0 + (it.w - it.cw) / 2;
      it.f.cells.forEach(function (c) { s += '<rect x="' + (off + (c[0] - it.mx) * u) + '" y="' + (6 + H - (c[1] - it.my + 1) * u) + '" width="' + u + '" height="' + u + '" fill="' + (o.fill || '#e8edf6') + '" stroke="#2b3340" stroke-width="1.1"/>'; });
      if (it.f.label) s += '<text x="' + (x0 + it.w / 2) + '" y="' + (H + 24) + '" font-size="12" text-anchor="middle" fill="#2b3340">' + it.f.label + '</text>';
      x0 += it.w + gap;
    });
    var Wd = x0 - gap + 6, Ht = H + (figs.some(function (f) { return f.label; }) ? 32 : 12);
    return '<svg class="fig-svg" viewBox="0 0 ' + Wd + ' ' + Ht + '" style="max-width:' + Math.min(o.max || 520, Wd * 1.25) + 'px" role="img" aria-label="' + (o.aria || 'tile pattern') + '">' + s + '</svg>';
  };
  S.ord = function (n) { var m = n % 100, k = n % 10; return n + (m >= 11 && m <= 13 ? 'th' : k === 1 ? 'st' : k === 2 ? 'nd' : k === 3 ? 'rd' : 'th'); };
  S.fig = function (svg) { return '<div class="fig">' + svg + '</div>'; };

  /* ---- solving t_n = V for n ---- */
  S.solveSol = function (gtTex, V, a, b, n) { // a n + b = V
    var r = cl((V - b) / a);
    return t(gtTex + '=' + vT(V)) + ' &nbsp;⇒&nbsp; ' + t(vT(a) + 'n=' + vT(cl(V - b))) + ' &nbsp;⇒&nbsp; ' + t('n=' + (isInt(r) ? vT(r) : '\\frac{' + vT(cl(V - b)) + '}{' + vT(a) + '}\\approx ' + F(Math.round(r * 100) / 100)));
  };
  S.HTERM = ['Substitute the position for ' + t('n') + ' in the formula.', 'Positions start at ' + t('n=1') + '.'];

  /* ============================== Lesson 1 ============================== */
  var LID = 'u1l1', vs = S;
  var tsub = S.tsub;
  function termSpecs(f, from, to, cands, frac) {
    var out = []; for (var k = from; k <= to; k++) out.push(S.fNum(tsub(k), f(k), (cands ? cands(k) : []), { frac: frac })); return out;
  }
  function n0c(f) { return function (k) { return [[f(k - 1), 'u1l1-n0', 'Positions start at ' + t('n=1') + ': ' + t('t_' + k) + ' uses ' + t('n=' + k) + '.'], [f(k + 1), 'u1l1-shift', 'That is ' + t('t_{' + (k + 1) + '}') + '. Substitute ' + t('n=' + k) + '.']]; }; }
  function figLabel(n) { return 'Figure ' + n; }

  /* Q1 tile figures: 'L' (corner + two arms, d = 2) or 'T' (a bar and a stem, d = 3) */
  function lCells(h, v) { var c = [[0, 0]]; for (var i = 1; i <= h; i++) c.push([i, 0]); for (var j = 1; j <= v; j++) c.push([0, j]); return c; }
  function tCells(k, stem) { var c = []; for (var i = -k; i <= k; i++) c.push([i, stem]); for (var j = 0; j < stem; j++) c.push([0, j]); return c; }
  function q1fig(o, n) { return o.fam === 'L' ? lCells(o.h + n - 1, o.v + n - 1) : tCells(o.a + n - 1, o.a + n - 1); }
  function q1count(o, n) { return q1fig(o, n).length; }

  /* Q3 / Extra A1 classify generators (each returns { terms, kind, val, frac, fin }) */
  var EXCL = function (list, a) { return list.some(function (b) { return b.every(function (x, i) { return same(x, a[i]); }); }); };
  var CL = {
    arithUp: function (r, ex0) { return pickWhere(function () { var t1 = r.int(-6, 25), d = r.int(2, 11); return { t1: t1, d: d }; }, function (z) { return z.t1 !== 0 && !EXCL(ex0, [z.t1, z.d]); }); },
    arithDown: function (r, ex0) { return pickWhere(function () { return { t1: r.int(25, 80), d: -r.int(3, 12) }; }, function (z) { return !EXCL(ex0, [z.t1, z.d]) && z.t1 + 3 * z.d !== 0; }); },
    geomInt: function (r, ex0) { return pickWhere(function () { return { t1: r.int(2, 8), d: r.int(2, 5) }; }, function (z) { return !EXCL(ex0, [z.t1, z.d]) && z.t1 * Math.pow(z.d, 3) <= 1500; }); },
    geomNeg: function (r, ex0) { return pickWhere(function () { return { t1: r.pick([1, -1]) * r.int(1, 6), d: -r.int(2, 5) }; }, function (z) { return !EXCL(ex0, [z.t1, z.d]) && Math.abs(z.t1 * Math.pow(z.d, 3)) <= 1500; }); }
  };
  function clsArith(o, n, frac) { var terms = S.arith(o.t1, o.d, n || 4); return { terms: terms, kind: 'arith', val: o.d, frac: frac }; }
  function clsGeom(o, n) { var terms = S.geom(o.t1, o.d, n || 4); return { terms: terms, kind: 'geom', val: o.d }; }
  function clsPrompt(c, lab) { return (lab ? '(' + lab + ') ' : '') + t(seqTex(c.terms, { frac: c.frac, inf: !c.fin })); }
  function clsMake(lab, gen, text) { return function (r) { var c = gen(r); return S.clsPart(clsPrompt(c, lab), c.terms, c.kind, c.val, text, { frac: c.frac }); }; }

  var QUESTIONS = [
    /* ---------------- Q1: tile pattern ---------------- */
    { num: '1', shared: function (r) {
        if (r.chance(0.5)) return pickWhere(function () { return { fam: 'L', h: r.int(1, 3), v: r.int(1, 3) }; }, function (z) { return !(z.h === 1 && z.v === 1); });
        return { fam: 'T', a: r.int(1, 2) };
      },
      stem: function (o) {
        var c = [1, 2, 3].map(function (n) { return q1count(o, n); });
        return 'Square tiles are arranged in growing ' + (o.fam === 'L' ? '“L”' : '“T”') + ' shapes. Figure 1 uses ' + t(c[0]) + ' tiles, Figure 2 uses ' + t(c[1]) + ' tiles and Figure 3 uses ' + t(c[2]) + ' tiles.' +
          S.fig(S.tiles([1, 2, 3].map(function (n) { return { cells: q1fig(o, n), label: figLabel(n) }; })));
      },
      parts: [
        { id: '1a', sub: 'a', level: 'BEG', make: function (r, o) {
          var right = q1fig(o, 4), five = q1fig(o, 5), one, two;
          if (o.fam === 'L') { one = lCells(o.h + 4, o.v + 2); two = lCells(o.h + 3, o.v + 3).concat([[1, 1]]); }
          else { one = tCells(o.a + 3, o.a + 2); two = tCells(o.a + 2, o.a + 4); }
          var pic = function (c) { return S.tiles([{ cells: c }], { u: 9, max: 140 }); };
          return S.mc(r, 'Which picture shows Figure 4?', [
            { html: pic(right), right: true },
            { html: pic(five), why: 'That figure has ' + t(five.length) + ' tiles — it is two steps past Figure 3 (Figure 5). Each figure adds ' + t(o.fam === 'L' ? 2 : 3) + ' tiles.' },
            { html: pic(one), why: 'Compare with Figure 3: ' + (o.fam === 'L' ? 'each arm grows by one tile, not just one arm.' : 'the bar grows by one tile on each side and the stem by one tile.') },
            { html: pic(two), why: 'Count the tiles: Figure 4 should have ' + t(right.length) + ', and keep the same shape as the others.' }],
            'From one figure to the next, ' + (o.fam === 'L' ? 'each arm of the L gets one more tile (2 more tiles in all)' : 'each side of the bar and the stem get one more tile (3 more tiles in all)') + '. Figure 4 has ' + t(q1count(o, 3) + '+' + (o.fam === 'L' ? 2 : 3) + '=' + right.length) + ' tiles.',
            ['Look at what changes from Figure 2 to Figure 3, then make the same change once more.'], 'pick Figure 4');
        } },
        { id: '1b', sub: 'b', level: 'BEG', make: function (r, o) {
          var f = function (n) { return q1count(o, n); }, d = f(2) - f(1);
          return S.fieldsPart('Complete the table.' + HW.valueTable([['\\text{Figure, }n', 1, 2, 3, 4, 5], ['\\text{Tiles, }t_n', f(1), f(2), f(3), '?', '?']]),
            [S.fNum('t_4', f(4), [[f(3) + 1, 'u1l1-shift', 'Each figure adds ' + t(d) + ' tiles, not 1.'], [f(3) * 2, 'u1l1-add-not-mult', 'The pattern adds the same number of tiles each time — it doesn’t double.']]), S.fNum('t_5', f(5), [[f(4) + 1, 'u1l1-shift', 'Each figure adds ' + t(d) + ' tiles.']])],
            'Each figure has ' + t(d) + ' more tiles than the one before: ' + t('t_4=' + f(3) + '+' + d + '=' + f(4)) + ', ' + t('t_5=' + f(4) + '+' + d + '=' + f(5)) + '.', ['Find how many tiles are added from one figure to the next.'], 'tile table t4, t5');
        } },
        { id: '1c', sub: 'c', level: 'BEG', make: function (r, o) {
          var d = q1count(o, 2) - q1count(o, 1);
          return S.numPart('Describe how to get each term from the previous term: add ______ tiles.', d, [[q1count(o, 1), 'u1l1-gave-value', 'That is the first term. How many tiles are <b>added</b> each time?']], 'Each figure adds ' + t(d) + ' tiles: add ' + t(d) + ' to the previous term (' + t(seqTex([1, 2, 3].map(function (n) { return q1count(o, n); }))) + ').', ['Subtract: Figure 2 minus Figure 1.'], 'add d tiles', { before: 'add', after: 'tiles' });
        } },
        { id: '1d', sub: 'd', level: 'EMG', make: function (r, o) {
          var d = q1count(o, 2) - q1count(o, 1);
          return S.mc(r, 'Is the sequence arithmetic, geometric or neither? Is it a linear or a non-linear function?', [
            { html: 'Arithmetic (' + t('d=' + d) + '), so it is linear', right: true },
            { html: 'Arithmetic (' + t('d=' + d) + '), so it is non-linear', why: 'Adding the same amount each step makes the points ' + t('(n,\\ t_n)') + ' lie on a straight line: linear.' },
            { html: 'Geometric, so it is non-linear', why: 'Each term is the previous term <b>plus</b> ' + t(d) + ', not times a number.' },
            { html: 'Neither, so it is non-linear', why: 'The differences are all ' + t(d) + ': there is a common difference.' }],
            'The differences are all ' + t(d) + ', so it is arithmetic. An arithmetic sequence adds the same amount each step, so its points lie on a line: a linear function.', ['Arithmetic sequences are linear; geometric ones (with ' + t('r\\ne 1') + ') are not.'], 'arithmetic & linear');
        } }] },
    /* ---------------- Q2: cutting paper ---------------- */
    { num: '2', shared: function (r) { return pickWhere(function () { var k = r.pick([2, 3, 4]); return { k: k, N: k === 2 ? r.int(7, 12) : k === 3 ? r.int(6, 9) : r.int(5, 8) }; }, function (z) { return !(z.k === 2 && z.N === 10); }); },
      stem: function (o) { var w = o.k === 2 ? 'in half' : o.k === 3 ? 'into three equal pieces' : 'into four equal pieces'; return 'A sheet of paper is cut ' + w + ', then each piece is cut ' + w + ' again, and so on. After 1 cut there are ' + t(o.k) + ' pieces, after 2 cuts there are ' + t(o.k * o.k) + ' pieces.'; },
      parts: [
        { id: '2a', sub: 'a', level: 'BEG', make: function (r, o) {
          var f = function (n) { return Math.pow(o.k, n); };
          return S.fieldsPart('Write the number of pieces after 1, 2, 3, 4 and 5 cuts.', termSpecs(f, 1, 5, function (n) { return [[o.k * n, 'u1l1-add-not-mult', 'Each cut splits <b>every</b> piece into ' + t(o.k) + ', so the number of pieces is multiplied by ' + t(o.k) + '.']]; }),
            'Each cut multiplies the number of pieces by ' + t(o.k) + ': ' + t(seqTex([1, 2, 3, 4, 5].map(f), { inf: false })) + '.', ['Every piece becomes ' + t(o.k) + ' pieces.'], 'paper pieces 1–5 cuts');
        } },
        { id: '2b', sub: 'b', level: 'BEG', make: function (r, o) {
          var terms = [1, 2, 3, 4, 5].map(function (n) { return Math.pow(o.k, n); });
          return S.clsPart('Is the sequence arithmetic, geometric or neither? State ' + t('d') + ' or ' + t('r') + '.', terms, 'geom', o.k, 'paper: classify');
        } },
        { id: '2c', sub: 'c', level: 'EMG', make: function (r, o) {
          var A = Math.pow(o.k, o.N);
          return S.numPart('How many pieces are there after ' + t(o.N) + ' cuts?', A, [[Math.pow(o.k, o.N - 1), 'u1l1-exp-off', 'That is after ' + t(o.N - 1) + ' cuts. Keep multiplying until you reach ' + t(o.N) + ' cuts.'], [o.k * o.N, 'u1l1-add-not-mult', 'The pieces are multiplied by ' + t(o.k) + ' each cut, not increased by ' + t(o.k) + '.'], [Math.pow(o.k, o.N + 1), 'u1l1-exp-off', 'One cut too many.']],
            'Keep multiplying by ' + t(o.k) + ': after ' + t(o.N) + ' cuts there are ' + t(o.k + '^{' + o.N + '}=' + F(A)) + ' pieces.', ['After ' + t('n') + ' cuts there are ' + t(o.k + '^{n}') + ' pieces.'], 'pieces after N cuts');
        } }] },
    /* ---------------- Q3: classify nine sequences ---------------- */
    { num: '3', stem: 'Classify each sequence as arithmetic, geometric or neither. If it is arithmetic, state ' + t('d') + '; if it is geometric, state ' + t('r') + '.', parts: [
      { id: '3a', sub: 'a', level: 'BEG', make: clsMake('a', function (r) { return clsArith(CL.arithUp(r, [[11, 3], [5, 4]])); }, 'classify: arithmetic up') },
      { id: '3b', sub: 'b', level: 'BEG', make: clsMake('b', function (r) { return clsGeom(CL.geomInt(r, [[5, 3], [3, 2]])); }, 'classify: geometric') },
      { id: '3c', sub: 'c', level: 'EMG', make: clsMake('c', function (r) {
        var o = pickWhere(function () { return { a: r.int(1, 12), k: r.int(1, 5), s: r.pick([1, 2]) }; }, function (z) { return !(z.a === 2 && z.k === 2 && z.s === 1) && !(z.a === 1 && z.k === 2 && z.s === 1); });
        var terms = [o.a]; for (var i = 0; i < 3; i++) terms.push(terms[i] + o.k + i * o.s);
        return { terms: terms, kind: 'neither' };
      }, 'classify: neither (growing differences)') },
      { id: '3d', sub: 'd', level: 'BEG', make: clsMake('d', function (r) { return clsArith(CL.arithDown(r, [[30, -9], [40, -7]])); }, 'classify: arithmetic down') },
      { id: '3e', sub: 'e', level: 'EMG', make: clsMake('e', function (r) { return clsGeom(CL.geomNeg(r, [[-4, -2], [2, -3]])); }, 'classify: geometric, negative r') },
      { id: '3f', sub: 'f', level: 'EMG', make: clsMake('f', function (r) {
        var kind = r.pick(['sq+', 'sq2', 'prime', 'cube']), terms;
        if (kind === 'sq+') { var c = r.int(1, 6); terms = [1, 2, 3, 4, 5].map(function (n) { return n * n + c; }); }
        else if (kind === 'sq2') { var m = r.pick([2, 3]); terms = [1, 2, 3, 4, 5].map(function (n) { return m * n * n; }); }
        else if (kind === 'prime') terms = r.pick([[2, 3, 5, 7, 11], [3, 5, 7, 11, 13], [5, 7, 11, 13, 17]]);
        else terms = [1, 8, 27, 64, 125];
        return { terms: terms, kind: 'neither', fin: true };
      }, 'classify: neither (squares, primes, cubes)') },
      { id: '3g', sub: 'g', level: 'EMG', make: clsMake('g', function (r) {
        var o = pickWhere(function () { var q = r.pick([2, 2, 3, 4]); return { q: q, A: Math.pow(q, 3) * r.int(1, q === 2 ? 30 : q === 3 ? 8 : 4) }; }, function (z) { return !(z.q === 2 && z.A === 200) && !(z.q === 4 && z.A === 64) && z.A >= 24 && z.A <= 1000; });
        return { terms: S.geom(o.A, 1 / o.q, 4), kind: 'geom', val: 1 / o.q };
      }, 'classify: geometric, fraction r') },
      { id: '3h', sub: 'h', level: 'PRG', make: clsMake('h', function (r) {
        var o = pickWhere(function () { var q = r.pick([2, 3, 4]); return { q: q, a: r.int(-9, -1), b: r.pick([1, 1, 2, 3]) }; }, function (z) { return gcd(z.b, z.q) === 1 && gcd(Math.abs(z.a), z.q) === 1 && !(z.q === 2 && z.a === -3 && z.b === 1); });
        return { terms: S.arith(o.a / o.q, o.b / o.q, 4), kind: 'arith', val: o.b / o.q, frac: true };
      }, 'classify: arithmetic, fractions') },
      { id: '3i', sub: 'i', level: 'PRG', make: clsMake('i', function (r) {
        var b = r.pick([1.2, 1.3, 1.5, 0.9, 0.8, 0.7]);
        return { terms: [b, cl(b * b), cl(b * b * b)], kind: 'geom', val: b };
      }, 'classify: geometric, decimal r') }] },
    /* ---------------- Q4: finite or infinite ---------------- */
    { num: '4', parts: [
      { id: '4', level: 'BEG', make: function (r) {
        var rows = [], want = {};
        var mk = [
          function () { var a = r.int(1, 9), d = r.int(2, 6), n = r.int(8, 15); return { tex: seqTex(S.arith(a, d, 3), { inf: true }).replace(/\\dots$/, '\\dots,\\ ' + (a + (n - 1) * d)), fin: true, why: 'It has a last term, ' + t(a + (n - 1) * d) + '.' }; },
          function () { var a = r.int(2, 6), q = r.pick([2, 3]); return { tex: seqTex(S.geom(a, q, 4)), fin: false, why: 'It ends with three dots and no last term.' }; },
          function () { var a = r.int(10, 40), d = -r.int(2, 5); return { tex: seqTex(S.arith(a, d, 5), { inf: false }), fin: true, why: 'It stops at ' + t(a + 4 * d) + ' — no dots.' }; },
          function () { var a = r.int(1, 9); return { tex: seqTex([a, -a, a, -a]), fin: false, why: 'The dots show it goes on forever.' }; },
          function () { var a = r.int(1, 5); return { tex: seqTex([1, 2, 3, 4].map(function (n) { return n * n + a; })), fin: false, why: 'The dots show it goes on forever.' }; },
          function () { var a = r.int(2, 5), q = 2, n = r.int(6, 9); return { tex: seqTex(S.geom(a, q, 3)).replace(/\\dots$/, '\\dots,\\ ' + F(a * Math.pow(q, n - 1))), fin: true, why: 'It has a last term, ' + t(F(a * Math.pow(q, n - 1))) + '.' }; }];
        var pick = r.sample(range(0, mk.length - 1), 4); if (!pick.some(function (i) { return [0, 2, 5].indexOf(i) >= 0; })) pick[0] = 0; if (!pick.some(function (i) { return [1, 3, 4].indexOf(i) >= 0; })) pick[3] = 1;
        var items = pick.map(function (i) { return mk[i](); }), why = {};
        items.forEach(function (it, i) { var id = 'abcd'[i]; rows.push({ id: id, html: '(' + id + ') ' + t(it.tex) }); want[id] = it.fin ? 'fin' : 'inf'; why[id] = it.why; });
        return B.grid('State whether each sequence is finite or infinite.', rows, [{ id: 'fin', html: 'Finite' }, { id: 'inf', html: 'Infinite' }], want, { why: function (id) { return { code: 'u1l1-fin', hint: '(' + id + ') ' + why[id] }; } },
          items.map(function (it, i) { return '(' + 'abcd'[i] + ') ' + (it.fin ? '<b>finite</b>' : '<b>infinite</b>') + ': ' + it.why; }).join('<br>'), ['A finite sequence has a last term. Three dots at the end with no last term mean it goes on forever.'], 'finite or infinite');
      } }] },
    /* ---------------- Q5: next two terms and the rule ---------------- */
    { num: '5', stem: 'Write the next two terms of each sequence, and describe the rule using only addition or multiplication.', parts: [
      { id: '5a', sub: 'a', level: 'BEG', make: function (r) { var o = pickWhere(function () { return { a: r.int(2, 20), d: r.int(3, 12) }; }, function (z) { return !(z.a === 9 && z.d === 7); }); return rulePart('a', S.arith(o.a, o.d, 6), 'add', o.d); } },
      { id: '5b', sub: 'b', level: 'EMG', make: function (r) { var o = pickWhere(function () { var q = r.pick([2, 3]); return { q: q, A: Math.pow(q, r.int(4, q === 2 ? 7 : 5)) * (q === 2 ? r.pick([1, 3]) : 1) }; }, function (z) { return z.A !== 81 && z.A <= 600; }); return rulePart('b', S.geom(o.A, 1 / o.q, 6), 'mul', 1 / o.q); } },
      { id: '5c', sub: 'c', level: 'EMG', make: function (r) { var o = pickWhere(function () { return { a: r.pick([1, -1]) * r.int(1, 5), q: -r.int(2, 6) }; }, function (z) { return !(z.a === -2 && z.q === -5) && Math.abs(z.a * Math.pow(z.q, 4)) <= 20000; }); return rulePart('c', S.geom(o.a, o.q, 5), 'mul', o.q, 3); } },
      { id: '5d', sub: 'd', level: 'EMG', make: function (r) { var o = pickWhere(function () { return { a: r.int(30, 90) / 10, d: -r.pick([75, 125, 150, 175, 225, 25]) / 100 }; }, function (z) { return !(z.a === 4.5 && z.d === -1.25); }); return rulePart('d', S.arith(o.a, o.d, 6), 'add', o.d); } },
      { id: '5e', sub: 'e', level: 'PRG', make: function (r) { var o = pickWhere(function () { var q = r.pick([3, 4, 5]); return { p: r.int(1, q - 1), q: q, m: r.pick([2, 3]) }; }, function (z) { return gcd(z.p, z.q) === 1 && !(z.p === 2 && z.q === 3 && z.m === 3) && z.q % z.m !== 0; }); return rulePart('e', S.geom(o.p / o.q, o.m, 6), 'mul', o.m, 4, true); } },
      { id: '5f', sub: 'f', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(1, 5), b: r.int(1, 6) }; }, function (z) { return !(z.a === 1 && z.b === 1) && !(z.a === 2 && z.b === 3) && z.b !== 2 * z.a; });
        var s = [o.a, o.b]; for (var i = 2; i < 7; i++) s.push(s[i - 1] + s[i - 2]);
        return S.fieldsPart('(f) ' + t(seqTex(s.slice(0, 5))) + ' &nbsp; Write the next two terms.', [S.fNum(tsub(6), s[5], [[s[4] + (s[4] - s[3]), 'u1l1-shift', 'The differences aren’t constant here. Look at how each term relates to the <b>two</b> terms before it.']]), S.fNum(tsub(7), s[6], [])],
          'Each term is the sum of the two terms before it (like the Fibonacci sequence): ' + t(s[3] + '+' + s[4] + '=' + s[5]) + ', ' + t(s[4] + '+' + s[5] + '=' + s[6]) + '. The rule: <b>add the two previous terms</b>.', ['Neither adding one number nor multiplying by one number works. Try adding two neighbouring terms.'], 'next two: Fibonacci-like');
      } }] },
    /* ---------------- Q6: first four terms from the general term ---------------- */
    { num: '6', stem: 'For each general term, write the first four terms.', parts: [
      { id: '6a', sub: 'a', level: 'BEG', make: function (r) { var o = pickWhere(function () { return { a: r.int(2, 9), b: r.int(-9, 12) }; }, function (z) { return z.b !== 0 && !(z.a === 6 && z.b === 1) && !(z.a === 5 && z.b === -3) && !(z.a === 4 && z.b === 7); }); return gtTerms('a', 't_n=' + o.a + 'n' + sgn(o.b), function (n) { return o.a * n + o.b; }, function (n) { return o.a + '(' + n + ')' + sgn(o.b); }); } },
      { id: '6b', sub: 'b', level: 'BEG', make: function (r) { var o = pickWhere(function () { return { c: r.int(12, 45), a: r.int(2, 7) }; }, function (z) { return !(z.c === 20 && z.a === 3) && !(z.c === 50 && z.a === 4); }); return gtTerms('b', 't_n=' + o.c + '-' + o.a + 'n', function (n) { return o.c - o.a * n; }, function (n) { return o.c + '-' + o.a + '(' + n + ')'; }); } },
      { id: '6c', sub: 'c', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { A: r.int(2, 6), q: r.int(2, 5) }; }, function (z) { return !(z.A === 2 && z.q === 5) && !(z.A === 3 && z.q === 2); });
        var f = function (n) { return o.A * Math.pow(o.q, n - 1); };
        return gtTerms('c', 't_n=' + o.A + '(' + o.q + ')^{n-1}', f, function (n) { return o.A + '(' + o.q + ')^{' + (n - 1) + '}'; }, function (k) { return [[o.A * Math.pow(o.q, k), 'u1l1-exp-off', 'The exponent is ' + t('n-1') + ': for ' + t('t_' + k) + ' it is ' + t(k - 1) + '.'], [Math.pow(o.A * o.q, k - 1), 'u1l1-exp-off', 'Only the ' + t(o.q) + ' is raised to the power — work out the power first, then multiply by ' + t(o.A) + '.']]; });
      } },
      { id: '6d', sub: 'd', level: 'BEG', make: function (r) {
        var o = pickWhere(function () { return { a: r.pick([1, 1, 2, 3]), c: r.pick([1, -1]) * r.int(1, 7) }; }, function (z) { return !(z.a === 1 && z.c === 1) && !(z.a === 2 && z.c === -1) && !(z.a === 3 && z.c === -1); });
        var f = function (n) { return o.a * n * n + o.c; };
        return gtTerms('d', 't_n=' + (o.a === 1 ? '' : o.a) + 'n^{2}' + sgn(o.c), f, function (n) { return (o.a === 1 ? '' : o.a) + '(' + n + ')^{2}' + sgn(o.c); }, function (k) { return [[2 * o.a * k + o.c, 'u1l1-sq-double', t('n^{2}') + ' means ' + t('n\\times n') + ', not ' + t('2n') + '.'], [o.a * o.a * k * k + o.c, 'u1l1-sq-coef', 'Square only ' + t('n') + ', then multiply by ' + t(o.a) + '.']]; });
      } },
      { id: '6e', sub: 'e', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { var q = r.pick([2, 2, 3]); return { q: q, A: q === 2 ? r.pick([32, 48, 80, 96, 112, 128, 160]) : r.pick([81, 162, 243]) }; }, function (z) { return !(z.q === 2 && z.A === 64); });
        var f = function (n) { return o.A / Math.pow(o.q, n); };
        return gtTerms('e', 't_n=' + o.A + '\\left(\\frac{1}{' + o.q + '}\\right)^{n}', f, function (n) { return o.A + '\\left(\\frac{1}{' + o.q + '}\\right)^{' + n + '}'; }, function (k) { return [[o.A / Math.pow(o.q, k - 1), 'u1l1-exp-n1', 'This formula has the exponent ' + t('n') + ' (not ' + t('n-1') + '): ' + t('t_' + k) + ' uses the power ' + t(k) + '.']]; });
      } },
      { id: '6f', sub: 'f', level: 'PRG', make: function (r) {
        var kind = r.pick(['kn', 'n+c', 'np1']), k = r.int(2, 5), c = r.int(1, 4), f, tex, sub;
        if (kind === 'kn') { f = function (n) { return Math.pow(-1, n) * k * n; }; tex = 't_n=(-1)^{n}\\cdot ' + k + 'n'; sub = function (n) { return '(-1)^{' + n + '}\\cdot ' + k + '(' + n + ')'; }; }
        else if (kind === 'n+c') { f = function (n) { return Math.pow(-1, n) * (n + c); }; tex = 't_n=(-1)^{n}(n+' + c + ')'; sub = function (n) { return '(-1)^{' + n + '}(' + n + '+' + c + ')'; }; }
        else { f = function (n) { return Math.pow(-1, n + 1) * k * n; }; tex = 't_n=(-1)^{n+1}\\cdot ' + k + 'n'; sub = function (n) { return '(-1)^{' + (n + 1) + '}\\cdot ' + k + '(' + n + ')'; }; }
        return gtTerms('f', tex, f, sub, function (n) { return [[-f(n), 'u1l1-alt-sign', 'Check the sign: ' + t('(-1)^{\\text{even}}=1') + ' and ' + t('(-1)^{\\text{odd}}=-1') + '.'], [Math.abs(f(n)), 'u1l1-no-alt', 'Don’t drop the ' + t('(-1)') + ' power: it makes every other term negative.']]; });
      } }] },
    /* ---------------- Q7: t_n = an + b ---------------- */
    { num: '7', shared: function (r) {
        var o = pickWhere(function () { return { a: r.int(3, 9), b: r.int(-6, 15), N: r.int(18, 45), m: r.int(22, 48), j: 0 }; }, function (z) { return z.b !== 0 && !(z.a === 4 && z.b === 7) && !(z.a === 5 && z.b === -3) && z.N !== 25 && z.m !== z.N; });
        o.j = r.int(1, o.a - 1); return o;
      },
      stem: function (o) { return 'A sequence has general term ' + t('t_n=' + o.a + 'n' + sgn(o.b)) + '.'; },
      parts: [
        { id: '7a', sub: 'a', level: 'BEG', make: function (r, o) {
          var v = o.a * o.N + o.b;
          return S.numPart('Determine ' + t(tsub(o.N)) + '.', v, [[o.a * o.N, 'value', 'Don’t forget the ' + t(sgn(o.b)) + '.'], [o.a * (o.N - 1) + o.b, 'u1l1-shift', 'Substitute ' + t('n=' + o.N) + ' itself — the formula already gives the term in position ' + t('n') + '.'], [o.a + o.N * o.b, 'value', 'The ' + t('n') + ' is multiplied by ' + t(o.a) + '.']],
            t(tsub(o.N) + '=' + o.a + '(' + o.N + ')' + sgn(o.b) + '=' + F(v)), S.HTERM, 't_N from t_n = an + b');
        } },
        { id: '7b', sub: 'b', level: 'EMG', make: function (r, o) {
          var V = o.a * o.m + o.b;
          return S.numPart('Which term has the value ' + t(F(V)) + '? Give its position ' + t('n') + '.', o.m, [[V - o.b, 'u1l1-solve-step', 'You found ' + t(o.a + 'n') + ' — now divide by ' + t(o.a) + ' to get ' + t('n') + '.'], [(V + o.b) / o.a, 'u1l1-solve-sign', 'Undo the ' + t(sgn(o.b)) + ' first: ' + (o.b > 0 ? 'subtract ' : 'add ') + t(Math.abs(o.b)) + ' from both sides.'], [o.a * V + o.b, 'u1l1-gave-value', 'That substitutes ' + t(F(V)) + ' for ' + t('n') + '. Set the formula <b>equal</b> to ' + t(F(V)) + ' and solve for ' + t('n') + '.']],
            S.solveSol(o.a + 'n' + sgn(o.b), V, o.a, o.b) + '. It is ' + t(tsub(o.m)) + '.', ['Set ' + t(o.a + 'n' + sgn(o.b) + '=' + F(V)) + ' and solve for ' + t('n') + '.'], 'which term has value V', { before: 'n =' });
        } },
        { id: '7c', sub: 'c', level: 'PRG', make: function (r, o) {
          var W0 = o.a * o.m + o.b + o.j, nn = (W0 - o.b) / o.a;
          return S.mc(r, 'Explain why ' + t(F(W0)) + ' is not a term of the sequence.', [
            { html: 'Solving ' + t(o.a + 'n' + sgn(o.b) + '=' + F(W0)) + ' gives ' + t('n\\approx ' + F(Math.round(nn * 100) / 100)) + ', which is not a natural number.', right: true },
            { html: t(F(W0)) + ' is not a multiple of ' + t(o.a) + '.', why: 'The terms aren’t multiples of ' + t(o.a) + ' either (' + t('t_1=' + (o.a + o.b)) + '). Set the formula equal to ' + t(F(W0)) + ' and solve for ' + t('n') + '.' },
            { html: 'The terms only go up to ' + t(tsub(o.m)) + '.', why: 'The sequence goes on forever. Solve for ' + t('n') + ' and look at the kind of number you get.' },
            { html: 'Solving gives a negative value of ' + t('n') + '.', why: 'Solve it: ' + t('n\\approx ' + F(Math.round(nn * 100) / 100)) + ' is positive — but is it a natural number?' }],
            S.solveSol(o.a + 'n' + sgn(o.b), W0, o.a, o.b) + '. That is not a natural number, so no position gives ' + t(F(W0)) + ': it is not a term (it falls between ' + t(tsub(o.m) + '=' + F(W0 - o.j)) + ' and ' + t(tsub(o.m + 1) + '=' + F(W0 - o.j + o.a)) + ').', ['Set the formula equal to the number and solve for ' + t('n') + '.'], 'why W is not a term');
        } }] },
    /* ---------------- Q8: two graphs ---------------- */
    { num: '8', shared: function (r) {
        var A = pickWhere(function () { return { t1: r.int(10, 20), d: -r.int(2, 4) }; }, function (z) { return z.t1 + 4 * z.d >= 1 && !(z.t1 === 15 && z.d === -3); });
        var G = r.pick([[32, 1 / 2], [48, 1 / 2], [81, 1 / 3], [2, 2], [3, 2], [64, 1 / 2]]);
        var arithFirst = r.chance(0.5);
        return { A: A, G: { t1: G[0], r: G[1] }, nA: arithFirst ? 'P' : 'Q', nG: arithFirst ? 'Q' : 'P' };
      },
      stem: function (o) {
        var a = S.arith(o.A.t1, o.A.d, 5), g = S.geom(o.G.t1, o.G.r, 5);
        var gA = '<div class="fig-cap">Sequence ' + o.nA + '</div>' + S.graph(a.map(function (y, i) { return [i + 1, y]; })), gG = '<div class="fig-cap">Sequence ' + o.nG + '</div>' + S.graph(g.map(function (y, i) { return [i + 1, y]; }));
        var first = o.nA === 'P' ? [gA, gG] : [gG, gA];
        return 'The points ' + t('(n,\\ t_n)') + ' of two sequences are graphed below.<div class="fig" style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center"><div>' + first[0] + '</div><div>' + first[1] + '</div></div>';
      },
      parts: [
        { id: '8a', sub: 'a', level: 'EMG', make: function (r, o) {
          return S.mc(r, 'Which sequence is arithmetic? How can you tell from the graph?', [
            { html: 'Sequence ' + o.nA + ': its points lie on a straight line (it changes by ' + t(Math.abs(o.A.d)) + ' each step).', right: true },
            { html: 'Sequence ' + o.nG + ': its points lie on a smooth curve.', why: 'A curve means the change is <b>not</b> the same each step. Arithmetic sequences change by the same amount, so their points line up.' },
            { html: 'Sequence ' + o.nG + ': its terms are always positive.', why: 'Being positive doesn’t decide it. Look for points on a straight line (the same change each step).' },
            { html: 'Sequence ' + o.nA + ': its first term is the largest.', why: 'Right sequence, wrong reason: what makes it arithmetic is the same change every step, so the points lie on a line.' }],
            'Sequence ' + o.nA + ' changes by ' + t(o.A.d) + ' every step, so its points lie on a line: arithmetic. Sequence ' + o.nG + '’s points curve.', ['Arithmetic: the same change each step, so the points lie on a straight line.'], 'which graph is arithmetic');
        } },
        { id: '8b', sub: 'b', level: 'EMG', make: function (r, o) {
          var a = S.arith(o.A.t1, o.A.d, 5), g = S.geom(o.G.t1, o.G.r, 5);
          return S.fieldsPart('Read the first five terms of each sequence from its graph. State ' + t('d') + ' for the arithmetic sequence and ' + t('r') + ' for the geometric sequence.',
            [S.fNum('\\text{' + o.nA + ': }d', o.A.d, [[-o.A.d, 'u1l1-d-sign', 'The terms go down, so ' + t('d') + ' is negative.']]), S.fNum('\\text{' + o.nG + ': }r', o.G.r, [[1 / o.G.r, 'u1l1-r-flip', 'Divide each term by the one <b>before</b> it.'], [cl(g[1] - g[0]), 'u1l1-cls-type', 'That is a difference. A geometric sequence has a common <b>ratio</b>: divide.']], { frac: true })],
            o.nA + ': ' + t(seqTex(a, { inf: false })) + ', ' + t('d=' + a[1] + '-' + vP(a[0]) + '=' + o.A.d) + '.<br>' + o.nG + ': ' + t(seqTex(g, { inf: false, frac: true })) + ', ' + t('r=\\frac{' + vT(g[1]) + '}{' + vT(g[0]) + '}=' + vT(o.G.r, true)) + '.', S.HCLS, 'd and r from graphs');
        } },
        { id: '8c', sub: 'c', level: 'PRG', make: function (r, o) {
          var a7 = o.A.t1 + 6 * o.A.d, g7 = o.G.t1 * Math.pow(o.G.r, 6);
          return S.fieldsPart('Determine ' + t('t_7') + ' for each sequence.', [
            S.fNum('\\text{' + o.nA + ': }t_7', a7, [[o.A.t1 + 5 * o.A.d, 'u1l1-shift', 'That is ' + t('t_6') + '. Go one more step.'], [o.A.t1 + 7 * o.A.d, 'u1l1-shift', 'That is ' + t('t_8') + '.']]),
            S.fNum('\\text{' + o.nG + ': }t_7', g7, [[o.G.t1 * Math.pow(o.G.r, 5), 'u1l1-shift', 'That is ' + t('t_6') + '. Multiply once more.'], [o.G.t1 * Math.pow(o.G.r, 7), 'u1l1-shift', 'That is ' + t('t_8') + '.']], { frac: true })],
            o.nA + ': keep adding ' + t(vP(o.A.d)) + ': ' + t('t_5=' + (o.A.t1 + 4 * o.A.d) + ',\\ t_6=' + (o.A.t1 + 5 * o.A.d) + ',\\ t_7=' + a7) + '.<br>' + o.nG + ': keep multiplying by ' + t(vT(o.G.r, true)) + ': ' + t('t_6=' + vT(o.G.t1 * Math.pow(o.G.r, 5), true) + ',\\ t_7=' + vT(g7, true)) + '.', ['Continue each pattern two more steps past ' + t('t_5') + '.'], 't7 from graphs');
        } },
        { id: '8d', sub: 'd', level: 'EMG', make: function (r) {
          return S.mc(r, 'Why are the points not joined with a line or curve?', [
            { html: 'The domain is the natural numbers (the positions ' + t('1,\\ 2,\\ 3,\\ \\dots') + '): there is no term between ' + t('t_1') + ' and ' + t('t_2') + '.', right: true },
            { html: 'Joining them would make the graph harder to read.', why: 'It’s about the meaning: is there a term at ' + t('n=1.5') + '?' },
            { html: 'Only arithmetic sequences can be joined.', why: 'No sequence is joined — there are no positions between the natural numbers.' },
            { html: 'The terms might not be whole numbers.', why: 'Terms can be fractions; it’s the <b>positions</b> that are only natural numbers.' }],
            'A sequence is a function whose domain is the natural numbers. There is no term at ' + t('n=1.5') + ', so the graph is separate points.', ['Is there a term in position ' + t('1.5') + '?'], 'why points are not joined');
        } }] },
    /* ---------------- Q9: theatre seats ---------------- */
    { num: '9', shared: function (r) { return pickWhere(function () { return { s: r.int(12, 30), k: r.int(1, 4), L: r.int(15, 32), R: r.int(4, 9) }; }, function (z) { return !(z.s === 18 && z.k === 2 && z.L === 22) && z.R < z.L; }); },
      stem: function (o) { return 'Seats in a theatre: row 1 has ' + t(o.s) + ' seats and each row after that has ' + t(o.k) + ' more seat' + (o.k > 1 ? 's' : '') + ' than the row in front of it. The last row is row ' + t(o.L) + '.'; },
      parts: [
        { id: '9a', sub: 'a', level: 'BEG', make: function (r, o) {
          return S.mc(r, 'Is the sequence of seats per row finite or infinite? Arithmetic or geometric?', [
            { html: 'Finite and arithmetic', right: true }, { html: 'Infinite and arithmetic', why: 'It stops at row ' + t(o.L) + ': it has a last term.' },
            { html: 'Finite and geometric', why: 'Each row has ' + t(o.k) + ' <b>more</b> seats — the same amount is added, not multiplied.' }, { html: 'Infinite and geometric', why: 'The theatre ends at row ' + t(o.L) + ', and the rows grow by adding ' + t(o.k) + '.' }],
            'Finite: it stops at row ' + t(o.L) + '. Arithmetic: each row adds ' + t(o.k) + ' seats, ' + t('d=' + o.k) + '.', ['Does it have a last term? Is the same amount added or multiplied?'], 'theatre: finite arithmetic', true);
        } },
        { id: '9b', sub: 'b', level: 'EMG', make: function (r, o) {
          var aR = o.s + (o.R - 1) * o.k, aL = o.s + (o.L - 1) * o.k, nn = 'Row ' + o.R + ' is ' + t(o.R - 1) + ' steps after row 1.';
          return S.fieldsPart('How many seats are in row ' + t(o.R) + '? in row ' + t(o.L) + '?', [
            S.fNum('\\text{row ' + o.R + '}', aR, [[o.s + o.R * o.k, 'u1l1-gt-n', 'From row 1 to row ' + t(o.R) + ' is only ' + t(o.R - 1) + ' steps.'], [o.s + (o.R - 2) * o.k, 'u1l1-shift', 'One step short.']]),
            S.fNum('\\text{row ' + o.L + '}', aL, [[o.s + o.L * o.k, 'u1l1-gt-n', 'From row 1 to row ' + t(o.L) + ' is ' + t(o.L - 1) + ' steps of ' + t(o.k) + '.']])],
            'Row ' + t(o.R) + ': ' + t(o.s + '+' + (o.R - 1) + '(' + o.k + ')=' + aR) + '. &nbsp; Row ' + t(o.L) + ': ' + t(o.s + '+' + (o.L - 1) + '(' + o.k + ')=' + aL) + '.', ['Row ' + t('n') + ' is ' + t('n-1') + ' steps after row 1: add ' + t(o.k) + ' that many times.'], 'theatre rows');
        } }] },
    /* ---------------- Q10: a recursive rule ---------------- */
    { num: '10', shared: function (r) { return pickWhere(function () { return { a: r.int(2, 7), m: r.int(2, 4), c: r.pick([1, 2, 3, 4, 5, -1, -2, -3]) }; }, function (z) { var x = z.a; for (var i = 0; i < 4; i++) x = x * z.m - z.c; return !(z.a === 4 && z.m === 3 && z.c === 2) && z.a * (z.m - 1) !== z.c && Math.abs(x) <= 9000 && x > 0; }); },
      stem: function (o) { return 'The first term of a sequence is ' + t(o.a) + ' and each term after that is found with the rule “multiply the previous term by ' + t(o.m) + ', then ' + (o.c > 0 ? 'subtract ' : 'add ') + t(Math.abs(o.c)) + '.”'; },
      parts: [
        { id: '10a', sub: 'a', level: 'EMG', make: function (r, o) {
          var s = [o.a]; for (var i = 1; i < 5; i++) s.push(s[i - 1] * o.m - o.c);
          var specs = []; for (var k = 2; k <= 5; k++) specs.push(S.fNum(tsub(k), s[k - 1], [[(s[k - 2] - o.c) * o.m, 'u1l1-recur-order', 'Do the steps in order: multiply first, then ' + (o.c > 0 ? 'subtract' : 'add') + '.'], [s[k - 2] * o.m, 'value', 'After multiplying, ' + (o.c > 0 ? 'subtract ' : 'add ') + t(Math.abs(o.c)) + '.']]));
          return S.fieldsPart('Write the first five terms (' + t('t_1=' + o.a) + ').', specs, s.slice(1).map(function (v, i) { return t(s[i] + '\\times ' + o.m + (o.c > 0 ? '-' : '+') + Math.abs(o.c) + '=' + F(v)); }).join(', ') + '. The sequence is ' + t(seqTex(s)) + '.', ['Apply the rule to each term to get the next one.'], 'recursive rule terms');
        } },
        { id: '10b', sub: 'b', level: 'PRG', make: function (r, o) {
          var s = [o.a]; for (var i = 1; i < 4; i++) s.push(s[i - 1] * o.m - o.c);
          var dT = S.diffsOf(s).map(function (x) { return F(x); }).join(',\\ '), rT = S.ratsOf(s).map(function (x) { return vT(Math.round(x * 100) / 100); }).join(',\\ ');
          return S.mc(r, 'Is this sequence arithmetic, geometric or neither? Explain.', [
            { html: 'Neither: the differences ' + t(dT) + ' are not equal, and the ratios ' + t('\\approx ' + rT) + ' are not equal.', right: true },
            { html: 'Geometric with ' + t('r=' + o.m) + ', because each term is multiplied by ' + t(o.m) + '.', why: 'The rule also ' + (o.c > 0 ? 'subtracts' : 'adds') + ' ' + t(Math.abs(o.c)) + ', so the ratios aren’t all ' + t(o.m) + ': check ' + t('\\frac{' + s[1] + '}{' + s[0] + '}') + '.' },
            { html: 'Arithmetic with ' + t('d=' + (-o.c)) + ', because the same number is ' + (o.c > 0 ? 'subtracted' : 'added') + ' each time.', why: 'The term is multiplied first, so the differences change: ' + t(dT) + '.' },
            { html: 'Geometric with ' + t('r=' + (o.m - o.c)) + '.', why: 'Check the ratios: ' + t('\\frac{' + s[1] + '}{' + s[0] + '}') + ' and ' + t('\\frac{' + s[2] + '}{' + s[1] + '}') + ' are not equal.' }],
            'Differences: ' + t(dT) + ' (not equal). Ratios: ' + t(S.ratsOf(s).map(function (x) { return vT(x, true); }).join(',\\ ')) + ' (not equal). So it is neither.', S.HCLS, 'recursive: neither');
        } }] },
    /* ---------------- Q11–Q14: multiple choice and numerical response ---------------- */
    { num: '11', parts: [
      { id: '11', level: 'BEG', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(2, 6), q: r.int(2, 4) }; }, function (z) { return !(z.a === 3 && z.q === 3); });
        var g = S.geom(o.a, o.q, 4), d = g[1] - g[0];
        return S.mc(r, '<i>(Multiple Choice)</i> Which sequence is geometric?', [
          { html: t(seqTex(g)), right: true },
          { html: t(seqTex(S.arith(o.a, o.a, 4))), why: 'Each term adds ' + t(o.a) + ': that is arithmetic.' },
          { html: t(seqTex(S.arith(o.a, d, 4))), why: 'The differences are all ' + t(d) + ' — arithmetic. The ratios ' + t('\\frac{' + (o.a + d) + '}{' + o.a + '}') + ', ' + t('\\frac{' + (o.a + 2 * d) + '}{' + (o.a + d) + '}') + ' are not equal.' },
          { html: t(seqTex([o.a, o.a + 1, o.a + 3, o.a + 6])), why: 'The differences grow (1, 2, 3), and the ratios aren’t equal: neither.' }],
          'In ' + t(seqTex(g)) + ' each term is ' + t(o.q) + ' times the previous term: geometric with ' + t('r=' + o.q) + '.', S.HCLS, 'MC which is geometric');
      } }] },
    { num: '12', parts: [
      { id: '12', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { A: r.int(30, 140), k: r.int(3, 9) }; }, function (z) { return z.A % z.k !== 0 && !(z.A === 50 && z.k === 4); });
        var m = Math.floor(o.A / o.k);
        return S.mc(r, '<i>(Multiple Choice)</i> The general term of a sequence is ' + t('t_n=' + o.A + '-' + o.k + 'n') + '. The first negative term is', [
          { html: t(tsub(m + 1)), right: true }, { html: t(tsub(m)), why: t(tsub(m) + '=' + (o.A - o.k * m)) + ' is still positive.' },
          { html: t(tsub(m + 2)), why: 'Check the term before it: ' + t(tsub(m + 1) + '=' + (o.A - o.k * (m + 1))) + ' is already negative.' }, { html: t(tsub(o.A)), why: 'Solve ' + t(o.A + '-' + o.k + 'n<0') + ' for ' + t('n') + '.' }],
          t(o.A + '-' + o.k + 'n<0\\Rightarrow ' + o.k + 'n>' + o.A + '\\Rightarrow n>' + F(Math.round(o.A / o.k * 100) / 100)) + ', so the first negative term is ' + t(tsub(m + 1) + '=' + (o.A - o.k * (m + 1))) + ' (' + t(tsub(m) + '=' + (o.A - o.k * m)) + ').', ['Solve ' + t(o.A + '-' + o.k + 'n<0') + ', then take the first natural number that works.'], 'MC first negative term');
      } }] },
    { num: '13', parts: [
      { id: '13', level: 'EMG', make: function (r) {
        var k = r.pick([9, 10, 11, 13, 14, 15]), f = [1, 1]; while (f.length < 17) f.push(f[f.length - 1] + f[f.length - 2]);
        return S.mc(r, '<i>(Multiple Choice)</i> In the Fibonacci sequence ' + t('1,\\ 1,\\ 2,\\ 3,\\ 5,\\ 8,\\ \\dots') + ', the value of ' + t(tsub(k)) + ' is', [
          { html: t(F(f[k - 1])), right: true }, { html: t(F(f[k - 2])), why: 'That is ' + t(tsub(k - 1)) + '. Count the positions carefully from ' + t('t_1=1') + '.' },
          { html: t(F(f[k])), why: 'That is ' + t(tsub(k + 1)) + '.' }, { html: t(k), why: 'The value of a term isn’t its position: list the terms up to ' + t(tsub(k)) + '.' }],
          'Add the two previous terms each time: ' + t(f.slice(0, k).map(function (x) { return F(x); }).join(',\\ ')) + '. So ' + t(tsub(k) + '=' + F(f[k - 1])) + '.', ['Write the terms out, numbering them as you go.'], 'MC Fibonacci term');
      } }] },
    { num: '14', parts: [
      { id: '14', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(2, 4), b: r.pick([1, -1]) * r.int(1, 9), k: r.int(6, 15) }; }, function (z) { var v = z.a * z.k * z.k - z.b * z.k; return !(z.a === 3 && z.b === 1 && z.k === 11) && v > 0 && v <= 9999; });
        var v = o.a * o.k * o.k - o.b * o.k, gtx = 't_n=' + o.a + 'n^{2}' + (o.b > 0 ? '-' : '+') + Math.abs(o.b) + 'n';
        var p = S.numPart('<i>(Numerical Response)</i> A sequence has general term ' + t(gtx) + '. The value of ' + t(tsub(o.k)) + ' is ______.', v,
          [[o.a * o.a * o.k * o.k - o.b * o.k, 'u1l1-sq-coef', 'Square only ' + t('n') + ': ' + t(o.a + '(' + o.k + ')^{2}=' + o.a + '(' + o.k * o.k + ')') + '.'], [o.a * 2 * o.k - o.b * o.k, 'u1l1-sq-double', t('n^{2}') + ' is ' + t('n\\times n') + ', not ' + t('2n') + '.'], [o.a * o.k * o.k + o.b * o.k, 'sign', 'Check the sign of the ' + t('n') + ' term.']],
          t(tsub(o.k) + '=' + o.a + '(' + o.k + ')^{2}' + (o.b > 0 ? '-' : '+') + Math.abs(o.b) + '(' + o.k + ')=' + o.a + '(' + o.k * o.k + ')' + (o.b > 0 ? '-' : '+') + Math.abs(o.b * o.k) + '=' + v), S.HTERM, 'NR t_k of a quadratic sequence');
        p.input.nr = true; return p;
      } }] }
  ];
  /* "next two terms + rule" part (Q5) */
  function rulePart(lab, terms, kind, val, shown, frac) {
    shown = shown || 4;
    var nx = terms.slice(shown, shown + 2), last = terms[shown - 1];
    var specs = [S.fRule(kind, val), S.fNum(tsub(shown + 1), nx[0], kind === 'add' ? [[last - val, 'u1l1-d-sign', 'The terms go ' + (val > 0 ? 'up' : 'down') + ' by ' + t(vT(Math.abs(val))) + ' each time.']] : [[last / val, 'u1l1-r-flip', 'Multiply by ' + t(vT(val, true)) + ' — don’t divide.']], { frac: frac }), S.fNum(tsub(shown + 2), nx[1], [], { frac: frac })];
    var how = kind === 'add' ? 'Each term is the previous term plus ' + t(vP(val)) + ': ' + t(vT(last, frac) + sgn(val) + '=' + vT(nx[0], frac)) + ', ' + t(vT(nx[0], frac) + sgn(val) + '=' + vT(nx[1], frac)) + '. Rule: add ' + t(vT(val)) + '.'
      : 'Each term is the previous term times ' + t(vP(val, true)) + ': ' + t(vT(last, frac) + '\\times ' + vP(val, true) + '=' + vT(nx[0], frac)) + ', ' + t(vT(nx[0], frac) + '\\times ' + vP(val, true) + '=' + vT(nx[1], frac)) + '. Rule: multiply by ' + t(vT(val, true)) + '.';
    return S.fieldsPart('(' + lab + ') ' + t(seqTex(terms.slice(0, shown), { frac: frac })), specs, how, ['Check the differences first. If they aren’t equal, check the ratios.', 'Write a subtraction as adding a negative, and a division as multiplying by a fraction.'], 'next two + rule (' + lab + ')', { keys: 'u1rule' });
  }
  /* "first four (five) terms from t_n" part */
  function gtTerms(lab, tex, f, subTex, extra, count, frac) {
    count = count || 4;
    var specs = []; for (var k = 1; k <= count; k++) specs.push(S.fNum(tsub(k), f(k), n0c(f)(k).concat(extra ? extra(k) : []), { frac: frac }));
    var sol = range(1, count).map(function (k) { return t(tsub(k) + '=' + subTex(k) + '=' + vT(f(k), frac)); }).join('<br>');
    return S.fieldsPart('(' + lab + ') ' + t(tex), specs, sol, S.HTERM, 'first terms of ' + tex);
  }
  S.gtTerms = gtTerms; S.rulePart = rulePart; S.n0c = n0c;

  /* ======================= Extra Practice 1 ======================= */
  var EXTRA = [
    { num: 'A1', section: 'A. Skills', stem: 'Classify each sequence as arithmetic, geometric or neither. State ' + t('d') + ' or ' + t('r') + ' when there is one.', parts: [
      { id: 'eA1a', sub: 'a', level: 'BEG', make: clsMake('a', function (r) { return clsArith(CL.arithUp(r, [[3, 7], [11, 3]])); }, 'EP classify: arithmetic up') },
      { id: 'eA1b', sub: 'b', level: 'BEG', make: clsMake('b', function (r) { return clsGeom(CL.geomInt(r, [[6, 4], [5, 3]])); }, 'EP classify: geometric') },
      { id: 'eA1c', sub: 'c', level: 'BEG', make: clsMake('c', function (r) { return clsArith(CL.arithDown(r, [[50, -6], [30, -9]])); }, 'EP classify: arithmetic down') },
      { id: 'eA1d', sub: 'd', level: 'EMG', make: clsMake('d', function (r) { var c = r.int(1, 4), m = r.pick([1, 2]); return { terms: [1, 2, 3, 4].map(function (n) { return m * n * n * n + c; }), kind: 'neither' }; }, 'EP classify: neither (cubes)') },
      { id: 'eA1e', sub: 'e', level: 'EMG', make: clsMake('e', function (r) { return clsGeom(CL.geomNeg(r, [[-1, -5], [-4, -2]])); }, 'EP classify: geometric, negative r') },
      { id: 'eA1f', sub: 'f', level: 'PRG', make: clsMake('f', function (r) {
        var o = pickWhere(function () { var q = r.pick([2, 3]); return { q: q, m: r.int(2, 22) }; }, function (z) { return z.m % z.q !== 0 && !(z.q === 3 && z.m === 10); });
        var A = o.q * o.q * o.m; return { terms: S.geom(A, 1 / o.q, 4), kind: 'geom', val: 1 / o.q, frac: true };
      }, 'EP classify: geometric, fraction term') },
      { id: 'eA1g', sub: 'g', level: 'EMG', make: clsMake('g', function (r) { var o = pickWhere(function () { return { t1: r.int(5, 60) / 10, d: r.pick([0.3, 0.4, 0.5, 0.6, 0.7, 1.5, 2.5]) }; }, function (z) { return !(z.t1 === 2.4 && z.d === 0.5); }); return clsArith(o); }, 'EP classify: arithmetic decimals') },
      { id: 'eA1h', sub: 'h', level: 'PRG', make: clsMake('h', function (r) { var o = pickWhere(function () { return { b: r.pick([2, 3]), c: r.int(-1, 5) }; }, function (z) { return !(z.b === 2 && z.c === 1) && z.c !== 0; }); return { terms: [1, 2, 3, 4, 5].map(function (n) { return Math.pow(o.b, n) + o.c; }), kind: 'neither' }; }, 'EP classify: neither (powers plus a constant)') },
      { id: 'eA1i', sub: 'i', level: 'PRG', make: clsMake('i', function (r) { var o = pickWhere(function () { var q = r.pick([2, 3]); return { q: q, k: r.pick([2, 3]) }; }, function (z) { return !(z.q === 2 && z.k === 2); }); return { terms: S.geom(1 / Math.pow(o.q, o.k), o.q, 4), kind: 'geom', val: o.q, frac: true }; }, 'EP classify: geometric from a fraction') }] },
    { num: 'A2', stem: 'Write the next three terms of each sequence.', parts: [
      { id: 'eA2a', sub: 'a', level: 'BEG', make: function (r) { var o = pickWhere(function () { return { a: -r.int(3, 15), d: r.int(3, 9) }; }, function (z) { return !(z.a === -7 && z.d === 5); }); return next3('a', S.arith(o.a, o.d, 7), 'add', o.d); } },
      { id: 'eA2b', sub: 'b', level: 'EMG', make: function (r) { var o = pickWhere(function () { return { A: r.int(2, 9) * 1000 }; }, function (z) { return z.A !== 1000; }); return next3('b', S.geom(o.A, 0.1, 6), 'mul', 0.1, 3); } },
      { id: 'eA2c', sub: 'c', level: 'EMG', make: function (r) { var o = pickWhere(function () { return { a: r.int(2, 7), q: -r.int(2, 3) }; }, function (z) { return !(z.a === 5 && z.q === -2); }); return next3('c', S.geom(o.a, o.q, 6), 'mul', o.q, 3); } },
      { id: 'eA2d', sub: 'd', level: 'EMG', make: function (r) { var o = pickWhere(function () { return { a: r.int(1, 5), b: r.int(2, 7) }; }, function (z) { return !(z.a === 2 && z.b === 3) && !(z.a === 1 && z.b === 1) && z.b !== 2 * z.a; }); var s = [o.a, o.b]; for (var i = 2; i < 8; i++) s.push(s[i - 1] + s[i - 2]); return next3('d', s, 'fib', null, 5); } },
      { id: 'eA2e', sub: 'e', level: 'EMG', make: function (r) { var o = pickWhere(function () { return { a: r.int(8, 20), d: -r.pick([0.5, 1.5, 2.5, 3.5]) }; }, function (z) { return !(z.a === 12 && z.d === -2.5); }); return next3('e', S.arith(o.a, o.d, 6), 'add', o.d, 3); } },
      { id: 'eA2f', sub: 'f', level: 'PRG', make: function (r) { var o = pickWhere(function () { var q = r.pick([2, 3, 4, 5]); return { p: r.int(1, q + 3), q: q, m: r.pick([2, 3]) }; }, function (z) { return gcd(z.p, z.q) === 1 && z.p % z.q !== 0 && !(z.p === 3 && z.q === 4 && z.m === 2) && z.q % z.m !== 0; }); return next3('f', S.geom(o.p / o.q, o.m, 6), 'mul', o.m, 3, true); } }] },
    { num: 'A3', stem: 'Write the first five terms of the sequence with the given general term.', parts: [
      { id: 'eA3a', sub: 'a', level: 'BEG', make: function (r) { var o = pickWhere(function () { return { a: r.int(3, 11), b: -r.int(1, 9) }; }, function (z) { return !(z.a === 9 && z.b === -4) && !(z.a === 5 && z.b === -3); }); return gtTerms('a', 't_n=' + o.a + 'n' + sgn(o.b), function (n) { return o.a * n + o.b; }, function (n) { return o.a + '(' + n + ')' + sgn(o.b); }, null, 5); } },
      { id: 'eA3b', sub: 'b', level: 'BEG', make: function (r) { var o = pickWhere(function () { return { c: r.int(10, 40), a: r.int(2, 6) }; }, function (z) { return !(z.c === 15 && z.a === 2); }); return gtTerms('b', 't_n=' + o.c + '-' + o.a + 'n', function (n) { return o.c - o.a * n; }, function (n) { return o.c + '-' + o.a + '(' + n + ')'; }, null, 5); } },
      { id: 'eA3c', sub: 'c', level: 'EMG', make: function (r) { var o = pickWhere(function () { return { A: r.int(2, 6), q: r.pick([2, 3]) }; }, function (z) { return !(z.A === 4 && z.q === 3) && !(z.A === 3 && z.q === 2); }); return gtTerms('c', 't_n=' + o.A + '(' + o.q + ')^{n-1}', function (n) { return o.A * Math.pow(o.q, n - 1); }, function (n) { return o.A + '(' + o.q + ')^{' + (n - 1) + '}'; }, function (k) { return [[o.A * Math.pow(o.q, k), 'u1l1-exp-off', 'The exponent is ' + t('n-1') + '.']]; }, 5); } },
      { id: 'eA3d', sub: 'd', level: 'EMG', make: function (r) { var o = pickWhere(function () { return { a: r.pick([2, 3]), c: r.pick([1, -1]) * r.int(1, 5) }; }, function (z) { return !(z.a === 2 && z.c === -1); }); return gtTerms('d', 't_n=' + o.a + 'n^{2}' + sgn(o.c), function (n) { return o.a * n * n + o.c; }, function (n) { return o.a + '(' + n + ')^{2}' + sgn(o.c); }, function (k) { return [[o.a * o.a * k * k + o.c, 'u1l1-sq-coef', 'Square only ' + t('n') + ', then multiply by ' + t(o.a) + '.'], [2 * o.a * k + o.c, 'u1l1-sq-double', t('n^{2}') + ' is ' + t('n\\times n') + '.']]; }, 5); } },
      { id: 'eA3e', sub: 'e', level: 'PRG', make: function (r) { var A = r.pick([40, 60, 80, 120, 200, 240, 320]); return gtTerms('e', 't_n=' + A + '(0.5)^{n-1}', function (n) { return A * Math.pow(0.5, n - 1); }, function (n) { return A + '(0.5)^{' + (n - 1) + '}'; }, function (k) { return [[A * Math.pow(0.5, k), 'u1l1-exp-off', 'The exponent is ' + t('n-1') + ': ' + t('t_1=' + A + '(0.5)^{0}=' + A) + '.']]; }, 5); } },
      { id: 'eA3f', sub: 'f', level: 'PRG', make: function (r) {
        var forms = [{ tex: '\\dfrac{n}{n+2}', f: function (n) { return n / (n + 2); }, s: function (n) { return '\\frac{' + n + '}{' + n + '+2}'; } }, { tex: '\\dfrac{n+1}{n+2}', f: function (n) { return (n + 1) / (n + 2); }, s: function (n) { return '\\frac{' + n + '+1}{' + n + '+2}'; } },
          { tex: '\\dfrac{n}{2n+1}', f: function (n) { return n / (2 * n + 1); }, s: function (n) { return '\\frac{' + n + '}{2(' + n + ')+1}'; } }, { tex: '\\dfrac{2n-1}{n+1}', f: function (n) { return (2 * n - 1) / (n + 1); }, s: function (n) { return '\\frac{2(' + n + ')-1}{' + n + '+1}'; } }];
        var o = r.pick(forms);
        return gtTerms('f', 't_n=' + o.tex, o.f, o.s, null, 5, true);
      } }] },
    { num: 'A4', parts: [
      { id: 'eA4', level: 'BEG', make: function (r) {
        var a = r.int(1, 6) * 2, d = r.pick([2, 3, 4]), last = a + d * r.int(20, 45), b = r.int(1, 9), c = r.int(2, 6), q = r.pick([2, 3]);
        var items = [{ tex: seqTex(S.arith(a, d, 3)).replace(/\\dots$/, '\\dots,\\ ' + last), fin: true, why: 'It has a last term, ' + t(last) + '.' }, { tex: seqTex([b, -b, b, -b]), fin: false, why: 'The dots with no last term mean it never ends.' }, { tex: seqTex(S.geom(c, q, 5), { inf: false }), fin: true, why: 'It stops at ' + t(F(c * Math.pow(q, 4))) + '.' }];
        items = r.shuffle(items);
        var rows = items.map(function (it, i) { return { id: 'abc'[i], html: '(' + 'abc'[i] + ') ' + t(it.tex) }; }), want = {}, why = {};
        items.forEach(function (it, i) { want['abc'[i]] = it.fin ? 'fin' : 'inf'; why['abc'[i]] = it.why; });
        return B.grid('State whether each sequence is finite or infinite.', rows, [{ id: 'fin', html: 'Finite' }, { id: 'inf', html: 'Infinite' }], want, { why: function (id) { return { code: 'u1l1-fin', hint: '(' + id + ') ' + why[id] }; } },
          items.map(function (it, i) { return '(' + 'abc'[i] + ') ' + (it.fin ? '<b>finite</b>' : '<b>infinite</b>') + ': ' + it.why; }).join('<br>'), ['Finite: it has a last term. Infinite: it ends with dots.'], 'EP finite or infinite');
      } }] },
    /* ---------------- B. Applying ---------------- */
    { num: 'B1', section: 'B. Applying', shared: function (r) { var o = pickWhere(function () { return { a: r.int(3, 9), b: r.int(3, 20), N: r.int(30, 50), m: r.int(15, 30), isT: r.chance(0.3) }; }, function (z) { return !(z.a === 7 && z.b === 12) && !(z.a === 4 && z.b === 7); }); o.j = r.int(1, o.a - 1); o.m2 = o.m + r.int(3, 8); return o; },
      stem: function (o) { return 'A sequence has general term ' + t('t_n=' + o.a + 'n+' + o.b) + '.'; },
      parts: [
        { id: 'eB1a', sub: 'a', level: 'BEG', make: function (r, o) { var v = o.a * o.N + o.b; return S.numPart('Determine ' + t(tsub(o.N)) + '.', v, [[o.a * o.N, 'value', 'Add the ' + t(o.b) + '.']], t(tsub(o.N) + '=' + o.a + '(' + o.N + ')+' + o.b + '=' + v), S.HTERM, 'EP t_N'); } },
        { id: 'eB1b', sub: 'b', level: 'EMG', make: function (r, o) { var V = o.a * o.m + o.b; return S.numPart('Which term is equal to ' + t(V) + '? Give its position ' + t('n') + '.', o.m, [[V - o.b, 'u1l1-solve-step', 'Now divide by ' + t(o.a) + '.'], [(V + o.b) / o.a, 'u1l1-solve-sign', 'Subtract ' + t(o.b) + ' from both sides first.']], S.solveSol(o.a + 'n+' + o.b, V, o.a, o.b) + ': it is ' + t(tsub(o.m)) + '.', ['Set the formula equal to ' + t(V) + ' and solve.'], 'EP which term', { before: 'n =' }); } },
        { id: 'eB1c', sub: 'c', level: 'PRG', make: function (r, o) {
          var W0 = o.isT ? o.a * o.m2 + o.b : o.a * o.m2 + o.b + o.j, nn = (W0 - o.b) / o.a, nT = isInt(nn) ? F(nn) : F(Math.round(nn * 10) / 10);
          var opts = o.isT ? [
            { html: 'Yes: ' + t(o.a + 'n+' + o.b + '=' + W0) + ' gives ' + t('n=' + nT) + ', so it is ' + t(tsub(nn)) + '.', right: true },
            { html: 'No: ' + t(W0) + ' is not a multiple of ' + t(o.a) + '.', why: 'Solve ' + t(o.a + 'n+' + o.b + '=' + W0) + ' — what do you get for ' + t('n') + '?' },
            { html: 'Yes: it is ' + t(tsub(nn + 1)) + '.', why: 'Check: ' + t(tsub(nn + 1) + '=' + (o.a * (nn + 1) + o.b)) + '.' },
            { html: 'No: solving gives ' + t('n=' + F((W0 + o.b) / o.a)) + '.', why: 'Subtract ' + t(o.b) + ' (don’t add it) before dividing by ' + t(o.a) + '.' }] : [
            { html: 'No: ' + t(o.a + 'n+' + o.b + '=' + W0) + ' gives ' + t('n\\approx ' + nT) + ', not a natural number.', right: true },
            { html: 'Yes: it is ' + t(tsub(Math.ceil(nn))) + '.', why: 'Check: ' + t(tsub(Math.ceil(nn)) + '=' + (o.a * Math.ceil(nn) + o.b)) + ', not ' + t(W0) + '. Rounding ' + t('n') + ' changes the term.' },
            { html: 'Yes: it is ' + t(tsub(Math.floor(nn))) + '.', why: 'Check: ' + t(tsub(Math.floor(nn)) + '=' + (o.a * Math.floor(nn) + o.b)) + '.' },
            { html: 'No: the terms only go up to ' + t(tsub(o.m)) + '.', why: 'The sequence goes on forever. Solve for ' + t('n') + '.' }];
          return S.mc(r, 'Is ' + t(W0) + ' a term? Explain.', opts, S.solveSol(o.a + 'n+' + o.b, W0, o.a, o.b) + (o.isT ? '. Yes: ' + t(W0 + '=' + tsub(nn)) + '.' : '. Not a natural number, so ' + t(W0) + ' is not a term.'), ['Solve for ' + t('n') + '. Is it a natural number?'], 'EP is W a term');
        } }] },
    { num: 'B2', parts: [
      { id: 'eB2', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { A: r.int(2, 7), q: r.pick([2, 2, 3]), m: r.int(5, 10) }; }, function (z) { var v = z.A * Math.pow(z.q, z.m - 1); return !(z.A === 3 && z.q === 2 && z.m === 8) && v <= 60000 && v >= 100; });
        var V = o.A * Math.pow(o.q, o.m - 1), list = S.geom(o.A, o.q, o.m);
        return S.numPart('A sequence has general term ' + t('t_n=' + o.A + '(' + o.q + ')^{n-1}') + '. Which term is equal to ' + t(F(V)) + '? Give its position ' + t('n') + '.', o.m, [[o.m - 1, 'u1l1-exp-off', 'That is the exponent. The exponent is ' + t('n-1') + ', so ' + t('n') + ' is one more.'], [o.m + 1, 'u1l1-exp-off', 'Count again: ' + t('t_1=' + o.A) + '.']],
          'Write the terms: ' + t(list.map(function (x) { return F(x); }).join(',\\ ')) + '. It is ' + t(tsub(o.m)) + '. (Check: ' + t(o.A + '(' + o.q + ')^{' + (o.m - 1) + '}=' + o.A + '(' + F(Math.pow(o.q, o.m - 1)) + ')=' + F(V)) + '.)', ['List the terms by multiplying by ' + t(o.q) + ', counting positions as you go.'], 'EP which term (geometric)', { before: 'n =' });
      } }] },
    { num: 'B3', shared: function (r) { var c = r.pick([[2, 3, 162], [2, 3, 243], [3, 4, 256], [1, 2, 64], [1, 2, 96], [1, 2, 160], [3, 5, 625], [4, 5, 625]]); return { p: c[0], q: c[1], H: c[2] }; },
      stem: function (o) { return 'A ball is dropped from ' + t(o.H) + '&nbsp;cm. Each bounce reaches ' + t('\\frac{' + o.p + '}{' + o.q + '}') + ' of the height of the bounce before.'; },
      parts: [
        { id: 'eB3a', sub: 'a', level: 'EMG', make: function (r, o) {
          var rr = o.p / o.q, f = function (n) { return o.H * Math.pow(rr, n); };
          var specs = [1, 2, 3, 4].map(function (k) { return S.fNum('\\text{bounce ' + k + '}', f(k), [[f(k - 1), 'u1l1-shift', 'The drop height isn’t a bounce: the first bounce is ' + t('\\frac{' + o.p + '}{' + o.q + '}') + ' of ' + t(o.H) + '.'], [o.H - k * o.H * (1 - rr), 'u1l1-add-not-mult', 'Each bounce is a fraction <b>of the one before</b> — multiply by ' + t('\\frac{' + o.p + '}{' + o.q + '}') + ' each time.']], { after: 'cm' }); });
          return S.fieldsPart('Write the heights of the first four bounces.', specs, 'Multiply by ' + t('\\frac{' + o.p + '}{' + o.q + '}') + ' each time: ' + t([1, 2, 3, 4].map(function (k) { return vT(f(k)); }).join(',\\ ')) + ' (cm).', ['The first bounce is ' + t('\\frac{' + o.p + '}{' + o.q + '}\\times ' + o.H) + '.'], 'EP bounce heights');
        } },
        { id: 'eB3b', sub: 'b', level: 'BEG', make: function (r, o) {
          return S.mc(r, 'Is the sequence arithmetic or geometric? Is it a linear or non-linear function?', [
            { html: 'Geometric (' + t('r=\\frac{' + o.p + '}{' + o.q + '}') + '), non-linear', right: true }, { html: 'Geometric, linear', why: 'Multiplying each step makes the points curve: non-linear.' },
            { html: 'Arithmetic, linear', why: 'The heights drop by different amounts each bounce; they are multiplied by the same fraction.' }, { html: 'Arithmetic, non-linear', why: 'The common ratio makes it geometric.' }],
            'Each height is ' + t('\\frac{' + o.p + '}{' + o.q + '}') + ' times the one before: geometric, so the points curve (non-linear).', S.HCLS, 'EP bounce: geometric non-linear');
        } }] },
    { num: 'B4', shared: function (r) { return pickWhere(function () { return { J: 5 * r.int(6, 24), M: 5 * r.int(4, 14), m: r.int(8, 24) }; }, function (z) { return !(z.J === 60 && z.M === 35) && z.J !== z.M; }); },
      stem: function (o) { return 'A gym membership costs \\$' + o.J + ' to join plus \\$' + o.M + ' per month. The total paid after ' + t('n') + ' months forms a sequence.'; },
      parts: [
        { id: 'eB4a', sub: 'a', level: 'BEG', make: function (r, o) { return S.fieldsPart('Write the first four terms.', termSpecs(function (n) { return o.M * n + o.J; }, 1, 4, function (k) { return [[o.M * (k - 1) + o.J, 'u1l1-n0', t('t_1') + ' is the total after 1 month: the joining fee plus one month.'], [o.M * k, 'value', 'Include the joining fee.']]; }), t(seqTex(S.arith(o.M + o.J, o.M, 4))) + ' (dollars): \\$' + o.J + ' + \\$' + o.M + ' for each month.', ['After 1 month: joining fee + one month.'], 'EP gym terms'); } },
        { id: 'eB4b', sub: 'b', level: 'EMG', make: function (r, o) { return S.gtPart('Write a general term ' + t('t_n') + '.', o.M + o.J, o.M, t(S.gtSteps(o.M + o.J, o.M)) + ' (' + t(o.M + 'n') + ' for the months plus the ' + t(o.J) + ' joining fee).', null, 'EP gym general term'); } },
        { id: 'eB4c', sub: 'c', level: 'PRG', make: function (r, o) { var T = o.M * o.m + o.J; return S.numPart('After how many months has a member paid \\$' + F(T) + ' in total?', o.m, [[T / o.M, 'value', 'Subtract the joining fee first.'], [o.m + 1, 'u1l1-shift', 'Check: ' + t(o.M + '(' + (o.m + 1) + ')+' + o.J + '=' + (o.M * (o.m + 1) + o.J)) + '.']], S.solveSol(o.M + 'n+' + o.J, T, o.M, o.J) + ' months.', ['Set ' + t(o.M + 'n+' + o.J + '=' + T) + ' and solve.'], 'EP gym months', { after: 'months' }); } }] },
    { num: 'B5', shared: function (r) {
        if (r.chance(0.6)) return pickWhere(function () { return { lin: true, a: r.int(1, 9), d: r.int(2, 7) }; }, function (z) { return !(z.a === 4 && z.d === 3); });
        var k = r.pick(['sq', 'dbl']), c = r.int(1, 4); return { lin: false, k: k, c: c };
      },
      stem: function (o) { var pts = [1, 2, 3, 4].map(function (n) { return [n, q5val(o, n)]; }); return 'The points ' + pts.map(function (p) { return t('(' + p[0] + ',\\ ' + p[1] + ')'); }).join(', ') + ' are the first four terms of a sequence.'; },
      parts: [
        { id: 'eB5a', sub: 'a', level: 'EMG', make: function (r, o) {
          var s = [1, 2, 3, 4].map(function (n) { return q5val(o, n); }), dT = S.diffsOf(s).join(',\\ ');
          return S.mc(r, 'Without graphing, do the points lie on a line?', [
            { html: 'Yes: the terms change by the same amount each step (' + t(dT) + ').', right: o.lin, why: o.lin ? null : 'Check the differences: ' + t(dT) + ' — not all the same.' },
            { html: 'No: the terms change by different amounts each step (' + t(dT) + ').', right: !o.lin, why: o.lin ? 'Check the differences: ' + t(dT) + ' — all the same.' : null },
            { html: 'Yes: every term is bigger than the one before.', why: 'Increasing isn’t enough: the points lie on a line only if they increase by the <b>same</b> amount each step.' },
            { html: 'No: the points are not joined.', why: 'They aren’t joined, but they can still lie along a line. Check the differences.' }],
            'Differences: ' + t(dT) + '. ' + (o.lin ? 'All equal: arithmetic, so the points lie on a line.' : 'Not equal, so the points do not lie on a line.'), ['Points ' + t('(n,\\ t_n)') + ' lie on a line exactly when the sequence is arithmetic.'], 'EP points on a line?', true);
        } },
        { id: 'eB5b', sub: 'b', level: 'EMG', make: function (r, o) {
          var v = q5val(o, 10), s = [1, 2, 3, 4].map(function (n) { return q5val(o, n); });
          return S.numPart('State the sequence’s ' + t('t_{10}') + '.', v, o.lin ? [[o.a + 10 * o.d, 'u1l1-gt-n', 'From ' + t('t_1') + ' to ' + t('t_{10}') + ' is 9 steps.'], [o.a + 8 * o.d, 'u1l1-shift', 'That is ' + t('t_9') + '.']] : [],
            o.lin ? 'The terms go up by ' + t(o.d) + ': ' + t('t_{10}=' + o.a + '+9(' + o.d + ')=' + v) + '.' : (o.k === 'sq' ? 'The terms are ' + t('n^{2}+' + o.c) + ': ' + s.join(', ') + ', so ' + t('t_{10}=10^{2}+' + o.c + '=' + v) + '.' : 'The terms are ' + t('2^{n}+' + o.c) + ': ' + s.join(', ') + ', so ' + t('t_{10}=2^{10}+' + o.c + '=' + F(v)) + '.'),
            ['Find the pattern in the terms ' + t(s.join(',\\ ')) + ', then continue it.'], 'EP t10 from points');
        } }] },
    { num: 'B6', parts: [
      { id: 'eB6', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { t1: r.int(4, 16), d: -r.int(2, 6) }; }, function (z) { return !(z.t1 === 8 && z.d === -3) && z.t1 + z.d !== 0; });
        var s = S.arith(o.t1, o.d, 4), k = -o.d;
        return S.mc(r, '<i>(Multiple Choice)</i> Which general term gives the sequence ' + t(seqTex(s)) + '?', [
          { html: t('t_n=' + (o.t1 + k) + '-' + k + 'n'), right: true },
          { html: t('t_n=' + o.t1 + '-' + k + 'n'), why: 'Check ' + t('t_1') + ': ' + t(o.t1 + '-' + k + '=' + (o.t1 - k)) + ', not ' + t(o.t1) + '.' },
          { html: t('t_n=' + k + 'n' + sgn(o.t1 - k)), why: 'The terms go <b>down</b> by ' + t(k) + ', so the ' + t('n') + ' term is ' + t('-' + k + 'n') + '.' },
          { html: t('t_n=' + o.t1 + '(' + o.d + ')^{n-1}'), why: 'That is geometric: ' + t(o.t1 + '(' + o.d + ')=' + (o.t1 * o.d)) + '. Here the same amount is subtracted each time.' }],
          'Test ' + t('t_n=' + (o.t1 + k) + '-' + k + 'n') + ': ' + t('t_1=' + (o.t1 + k) + '-' + k + '=' + o.t1) + ', ' + t('t_2=' + s[1]) + ', ' + t('t_3=' + s[2]) + ' ✓', ['Substitute ' + t('n=1') + ' and ' + t('n=2') + ' into each choice.'], 'EP MC which general term');
      } }] },
    { num: 'B7', parts: [
      { id: 'eB7', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(1, 5), m: r.pick([2, 2, 3]), c: r.pick([1, 2, 3, -1]), k: r.int(5, 7) }; }, function (z) { var x = z.a; for (var i = 1; i < z.k; i++) x = x * z.m + z.c; return !(z.a === 2 && z.m === 2 && z.c === 1 && z.k === 6) && x > 0 && x <= 9999 && z.a * (z.m - 1) + z.c !== 0; });
        var s = [o.a]; for (var i = 1; i < o.k; i++) s.push(s[i - 1] * o.m + o.c);
        var p = S.numPart('<i>(Numerical Response)</i> The first term of a sequence is ' + t(o.a) + ' and each term after that is the previous term times ' + t(o.m) + ' ' + (o.c > 0 ? 'plus ' : 'minus ') + t(Math.abs(o.c)) + '. The value of ' + t(tsub(o.k)) + ' is ______.', s[o.k - 1], [[s[o.k - 2], 'u1l1-shift', 'That is ' + t(tsub(o.k - 1)) + '.'], [s[o.k - 2] * o.m + o.c * o.m, 'u1l1-recur-order', 'Multiply first, then ' + (o.c > 0 ? 'add.' : 'subtract.')]],
          t(s.map(function (x) { return F(x); }).join(',\\ ')), ['Apply the rule one term at a time, numbering the terms.'], 'EP NR recursive');
        p.input.nr = true; return p;
      } }] },
    /* ---------------- C. Stretch ---------------- */
    { num: 'C1', section: 'C. Stretch', shared: function (r) { return c1nums(r, [[1, 1, 2, 3, 4, 1], [1, -4, 2, 1, 5, -2], [4, 1, 3, 6, 1, 9], [2, 1, 5, -2, 6, 3]]); },
      stem: function (o) { return 'The terms ' + t(linX(o.a1, o.b1)) + ', ' + t(linX(o.a2, o.b2)) + ' and ' + t(linX(o.a3, o.b3)) + ' are three consecutive terms of an arithmetic sequence.'; },
      parts: [
        { id: 'eC1a', sub: 'a', level: 'MAS', make: function (r, o) {
          var L = linX(o.a2 - o.a1, o.b2 - o.b1), Rr = linX(o.a3 - o.a2, o.b3 - o.b2);
          return S.numPart('Determine ' + t('x') + '.', o.x, [[-o.x, 'sign', 'Check the signs when you collect the ' + t('x') + ' terms.']],
            'The two differences are equal: ' + t('(' + linX(o.a2, o.b2) + ')-(' + linX(o.a1, o.b1) + ')=(' + linX(o.a3, o.b3) + ')-(' + linX(o.a2, o.b2) + ')') + '<br>' + t(L + '=' + Rr) + ' &nbsp;⇒&nbsp; ' + t('x=' + o.x) + '.', ['In an arithmetic sequence, ' + t('t_2-t_1=t_3-t_2') + '.', 'Subtract carefully: put each expression in brackets.'], 'EP stretch: x in arithmetic terms', { before: 'x =' });
        } },
        { id: 'eC1b', sub: 'b', level: 'MAS', make: function (r, o) {
          var T = [o.a1 * o.x + o.b1, o.a2 * o.x + o.b2, o.a3 * o.x + o.b3];
          return S.fieldsPart('State the three terms.', [S.fNum('t_1', T[0], []), S.fNum('t_2', T[1], []), S.fNum('t_3', T[2], [])],
            'With ' + t('x=' + o.x) + ': ' + t(o.a1 + '(' + o.x + ')' + sgn(o.b1) + '=' + T[0]) + ', ' + t(o.a2 + '(' + o.x + ')' + sgn(o.b2) + '=' + T[1]) + ', ' + t(o.a3 + '(' + o.x + ')' + sgn(o.b3) + '=' + T[2]) + '. Check: the difference is ' + t(T[1] - T[0]) + ' both times.', ['Find ' + t('x') + ' first (set the two differences equal), then substitute.'], 'EP stretch: the three terms');
        } }] },
    { num: 'C2', shared: function (r) { return pickWhere(function () { return { a: r.int(1, 5), b: r.int(2, 7) }; }, function (z) { return z.b > z.a && !(z.a === 1 && z.b === 3); }); },
      stem: function (o) { return 'A sequence starts ' + t('t_1=' + o.a) + ', ' + t('t_2=' + o.b) + ', and each term after that is the sum of the two terms before it.'; },
      parts: [
        { id: 'eC2a', sub: 'a', level: 'PRG', make: function (r, o) {
          var s = [o.a, o.b]; for (var i = 2; i < 8; i++) s.push(s[i - 1] + s[i - 2]);
          return S.fieldsPart('Write the first eight terms.', termSpecs(function (n) { return s[n - 1]; }, 3, 8, function (k) { return [[s[k - 2] + (s[k - 2] - s[k - 3]), 'value', 'Add the two terms <b>just before</b> it: ' + t(tsub(k) + '=' + tsub(k - 2) + '+' + tsub(k - 1)) + '.']]; }),
            t(s.join(',\\ ')) + ' (each term is the sum of the two before it).', ['Add the two terms before each new one.'], 'EP stretch: Fibonacci-like terms');
        } },
        { id: 'eC2b', sub: 'b', level: 'EMG', make: function (r, o) {
          var s = [o.a, o.b]; for (var i = 2; i < 6; i++) s.push(s[i - 1] + s[i - 2]);
          var dT = S.diffsOf(s.slice(0, 5)).join(',\\ ');
          return S.mc(r, 'Is the sequence arithmetic, geometric or neither?', [
            { html: 'Neither', right: true }, { html: 'Arithmetic', why: 'The differences are ' + t(dT) + ' — not all the same.' },
            { html: 'Geometric', why: 'The ratios ' + t('\\frac{' + s[1] + '}{' + s[0] + '},\\ \\frac{' + s[2] + '}{' + s[1] + '},\\ \\dots') + ' are not all the same.' }, { html: 'Both', why: 'Only a constant sequence is both.' }],
            'Differences ' + t(dT) + ' are not equal, and the ratios are not equal: neither (it is built like the Fibonacci sequence).', S.HCLS, 'EP stretch: neither', true);
        } }] }
  ];
  /* Extra A2: next three terms */
  function next3(lab, terms, kind, val, shown, frac) {
    shown = shown || 4;
    var nx = terms.slice(shown, shown + 3), last = terms[shown - 1];
    var specs = nx.map(function (x, i) { return S.fNum(tsub(shown + 1 + i), x, i === 0 && kind === 'add' ? [[last - val, 'u1l1-d-sign', 'The terms go ' + (val > 0 ? 'up' : 'down') + ' by ' + t(vT(Math.abs(val))) + '.']] : i === 0 && kind === 'mul' ? [[last / val, 'u1l1-r-flip', 'Multiply by ' + t(vT(val, true)) + '.']] : [], { frac: frac }); });
    var how = kind === 'add' ? 'Add ' + t(vP(val)) + ' each time: ' : kind === 'mul' ? 'Multiply by ' + t(vP(val, true)) + ' each time: ' : 'Add the two previous terms each time: ';
    return S.fieldsPart('(' + lab + ') ' + t(seqTex(terms.slice(0, shown), { frac: frac })), specs, how + t(nx.map(function (x) { return vT(x, frac); }).join(',\\ ')) + '.', ['Check the differences; if they aren’t equal, check the ratios.', kind === 'fib' ? 'Try adding two neighbouring terms.' : 'Use the same rule three times.'], 'next three (' + lab + ')');
  }
  function q5val(o, n) { return o.lin ? o.a + (n - 1) * o.d : o.k === 'sq' ? n * n + o.c : Math.pow(2, n) + o.c; }
  /* three linear expressions in x that are consecutive arithmetic terms at x = x0 */
  function linX(a, b, v) { v = v || 'x'; return (a === 0 ? '' : (a === 1 ? '' : a === -1 ? '-' : a) + v) + (b === 0 ? (a === 0 ? '0' : '') : a === 0 ? vT(b) : sgn(b)); }
  function tidy(s) { return s.replace(/^1x/, 'x').replace(/^-1x/, '-x').replace(/([+-])1x/g, '$1x').replace(/^0x\+?/, '').replace(/\+-/g, '-'); }
  function c1nums(r, exclude) {
    return pickWhere(function () {
      var a = r.sample([1, 2, 3, 4, 5, 6], 3);
      var x = r.pick([-3, -2, 2, 3, 4, 5, 6, 7]), T1 = r.int(-8, 15), d = r.pick([-6, -5, -4, -3, 3, 4, 5, 6, 7, 8, 9]);
      return { a1: a[0], a2: a[1], a3: a[2], x: x, b1: T1 - a[0] * x, b2: T1 + d - a[1] * x, b3: T1 + 2 * d - a[2] * x };
    }, function (z) {
      return z.a1 - 2 * z.a2 + z.a3 !== 0 && [z.b1, z.b2, z.b3].every(function (b) { return b !== 0 && Math.abs(b) <= 20; }) &&
        !exclude.some(function (e) { return e[0] === z.a1 && e[1] === z.b1 && e[2] === z.a2 && e[3] === z.b2 && e[4] === z.a3 && e[5] === z.b3; });
    });
  }
  S.c1nums = c1nums; S.linX = linX; S.tidy = tidy;

  HW.defineLesson({ id: LID, unit: 1, num: '1', title: 'Patterns, Sequences and the General Term', outcome: 'RF9', questions: QUESTIONS, extra: EXTRA });
})(window);
