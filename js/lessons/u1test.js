/* Math 20-1 · Unit 1 Test (RF9, RF10) — Sequences and Series. Also holds the Unit 1 assessment kit HW.u1kit (answer
 * checkers and question builders) that js/exits/u1.js uses for the exit slips, so load this file before it.
 * Written in test mode from Ryan's Math 20-1 booklet (unit1/u1_l01–u1_l09.tex and u1_ep01–u1_ep09.tex; Lesson 9's
 * assignment and extra practice are the practice tests that set the style and difficulty). One 75-minute class,
 * scientific calculator allowed. Two outcomes, as the booklet tags them: RF9 (arithmetic sequences and series,
 * Lessons 1–4) and RF10 (geometric sequences and series, Lessons 5–8). 22 questions / 35 parts:
 * Beginning 8 questions / 13 parts (RF9 6, RF10 7), Progressing 8 / 15 (RF9 8, RF10 7), Mastery 6 / 7 (RF9 3, RF10 4).
 * Every part is a generator (new numbers for each student; never the booklet's own numbers), with the key built from
 * the generated values, a worked solution in the booklet's method, hints, and `bad` answers with u1t- codes
 * (labels and partial-credit decisions in the kit below).
 *
 * How each box is pitched:
 *   Beginning  — each lesson's core skill as first taught: classify a sequence (MC) and evaluate a term from a formula
 *                (L1); a term of an arithmetic sequence from its first terms (L2); d from two terms (L3); an
 *                arithmetic sum from the first and last terms and from t1, d, n (L4); r and the general term of a
 *                geometric sequence (L5); growth factors for a percent increase and decrease (L6); a geometric sum
 *                from t1, r, n (L7); a sum to infinity, and which series converges (MC) (L8).
 *   Progressing — the typical assignment question: the general term in simplest form and "is V a term?" (L1–L2,
 *                "none" possible); the number of terms and arithmetic means (L2); a salary with a yearly raise and
 *                the first year it passes an amount (L3); an arithmetic sum up to a last term and a term from a
 *                formula for S_n (L4); the general term from two terms and the number of terms (L5); compound
 *                interest and a bounce height, rounded (L6); a geometric sum up to a last term and a term from S_n
 *                (L7); a repeating decimal as a fraction (L8).
 *   Mastery    — the hardest assignment / extra-practice items: three expressions as consecutive arithmetic terms
 *                (x and d, L2 #12); the number of terms for a given sum (a quadratic, L4 #6); straight-line
 *                depreciation from two later years — the first year below an amount (L3 Ex, EP03); the two possible
 *                values of a later term when the gap between known terms is even (L5 #10); the total distance of a
 *                bouncing ball at its kth landing (L7 #13); a series with a variable ratio — where it converges and
 *                the x that gives a stated sum (L8 #13, L9 #24).
 * Coverage: L1 Q1, Q9b · L2 Q2, Q9a, Q10, Q17 · L3 Q3, Q11, Q19 · L4 Q4, Q12, Q18 · L5 Q5, Q13, Q20 · L6 Q6, Q14 ·
 *           L7 Q7, Q15, Q21 · L8 Q8, Q16, Q22 · L9 (review) the whole test is in its style (Q2, Q10, Q12a, Q13, Q14a,
 *           Q21 follow its practice-test items).
 * Answers: numbers as exact values (fractions or exact decimals) unless the question names a rounding; general terms
 * as any expression in n equal to the key at n = 1…8 ("simplest form" for an arithmetic sequence means expanded:
 * t_n = 4n − 1, a bracket left in is a format nudge); "is it a term" and "no sum" take the word none (the none key);
 * two-box answers (x and d, the two possible terms, the bounds of x) take one wrong box as a smaller mistake.
 * Conversions to online: "explain why not a term" → type none; "show the work" items → the final value;
 * "convergent or divergent?" → MC of four series; the double inequality → two boxes around "< x <". */
(function (root) {
  'use strict';
  var HW = root.HW, ex = HW.ex, K = HW.kit, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, F = HW.fmt;

  /* =====================================================================================================
   * The kit: HW.u1kit (shared with js/exits/u1.js)
   * ===================================================================================================== */
  var S = HW.u1kit = {};

  /* ---- wrong-answer codes, registered for the test (u1t-) and the exit slips (u1x-); value = [label, partial] ---- */
  var CODE = {
    'n-step': ['Used n steps instead of n − 1', 'b'], 'no-t1': ['Left out the first term', 'n'], 'd-sign': ['Common difference with the wrong sign', 's'],
    'd-nodiv': ['Did not divide the change by the number of steps', 'b'], 'd-steps': ['Counted the positions instead of the steps between them', 's'],
    'swap-td': ['Swapped t₁ and d in the general term', 'n'], 'a2-t1': ['Used a known later term as t₁', 'b'],
    'pos-off1': ['Position off by one (found n − 1)', 's'], 'not-natural': ['Gave a position that is not a natural number', 'b'], 'said-none': ['Said “none” when there is an answer', 'n'],
    'gave-num': ['Gave a number when there is no such term / no sum', 'n'], 'nt-plus1': ['Number of terms: forgot to add 1', 's'],
    'means-steps': ['Means: divided by the number of means instead of the number of steps', 's'], 'means-terms': ['Means: divided by the number of terms instead of steps', 's'],
    'ctx-n': ['Off by one period (value after n vs n − 1 steps)', 's'], 'ctx-below': ['Gave the last value on the wrong side of the target', 's'],
    'si-no-p': ['Simple interest: gave only the interest earned', 'b'], 'si-compound': ['Used compound growth for simple interest', 'n'],
    'sum-half': ['Sum: forgot to halve (n/2)', 'b'], 'sum-n': ['Sum: used nd instead of (n − 1)d', 'b'], 'sum-term': ['Gave the last term instead of the sum', 'n'],
    'sum-count': ['Sum: wrong number of terms', 's'], 'sn-is-sum': ['Gave Sₙ instead of tₙ', 'n'], 'sn-next': ['Found the next term (Sₙ₊₁ − Sₙ)', 's'],
    'quad-root': ['Kept the wrong root of the quadratic', 'n'], 'rows-from-p': ['Counted the rows from a later row', 'b'],
    'neg-last': ['Gave the last positive term instead of the first negative', 's'],
    'dep-last': ['Gave the last year above the amount', 's'], 'dep-index': ['Mixed up the term number and the number of years', 's'],
    'r-flip': ['Common ratio upside down', 'b'], 'r-diff': ['Gave a difference instead of the ratio', 'n'], 'r-sign': ['Common ratio with the wrong sign', 's'],
    'rn': ['Used rⁿ instead of rⁿ⁻¹', 'b'], 'mult-first': ['Multiplied t₁ by r before applying the exponent', 'b'], 'g-arith': ['Wrote an arithmetic general term', 'n'],
    'g-swap': ['Swapped t₁ and r in the general term', 'b'], 'g2-t1': ['Used a known later term as t₁', 'b'], 'g-noroot': ['Did not take the root to find r', 'n'],
    'gn-off1': ['Number of terms off by one', 's'], 'g-one-sign': ['Gave only one of the two possible values', 'b'], 'g-negpow': ['Negative ratio raised to a power without brackets', 's'],
    'gf-rate': ['Growth factor: gave the rate, not 1 ± rate', 'b'], 'gf-sign': ['Growth factor: increase and decrease mixed up', 'n'], 'gf-pct': ['Growth factor written as a percent', 'b'],
    'keep-lose': ['Used the part lost instead of the part kept', 'n'], 'ci-n1': ['Compound growth: one period too few or too many', 's'], 'ci-simple': ['Used a fixed amount each period instead of a percent', 'n'],
    'bounce-pos': ['Bounce number and term number mixed up', 's'], 'hl-periods': ['Did not convert the time into periods', 'b'], 'hl-linear': ['Multiplied instead of using a power', 'n'],
    'gs-n1': ['Geometric sum: one term too few or too many', 's'], 'gs-divr': ['Geometric sum: divided by r instead of r − 1', 'b'], 'gs-term': ['Gave a term instead of the sum', 'n'],
    'gs2-nor': ['Geometric sum: used tₙ instead of r·tₙ', 'b'], 'gs-den-sign': ['Geometric sum: sign slip in the denominator', 's'],
    'ball-down': ['Bouncing ball: counted only one direction', 'b'], 'ball-extra-rise': ['Bouncing ball: one rise too many', 's'], 'ball-drop2': ['Bouncing ball: counted the drop twice', 's'],
    'ball-inf': ['Gave the sum to infinity instead of a partial sum', 'n'], 'ice-noI': ['Left out the starting amount', 'b'],
    'inf-sign': ['Sum to infinity: used 1 + r', 'b'], 'inf-r': ['Sum to infinity: divided by r', 'n'], 'inf-mult': ['Sum to infinity: multiplied instead of dividing', 'n'], 'inf-1mr': ['Gave 1 − r instead of r', 'b'],
    'int-b': ['Convergence: did not move the constant across', 'b'], 'int-a': ['Convergence: did not divide by the coefficient', 'b'], 'int-gave-r': ['Gave r instead of x', 'b'],
    'rep-term': ['Repeating decimal treated as terminating', 'n'], 'rep-r': ['Repeating decimal: wrong ratio for the block', 'b'], 'rep-nonrep': ['Repeating decimal: mixed up the repeating and non-repeating digits', 'b'],
    'one-box': ['One box wrong (the rest right)', 's'], 'x-as-d': ['Gave x or a term instead of d / r', 'b'], 'cls-wrong': ['Wrong sequence type', 'n']
  };
  ['u1t-', 'u1x-'].forEach(function (pre) {
    var c = {}, pr = {}; Object.keys(CODE).forEach(function (k) { c[pre + k] = CODE[k][0]; pr[pre + k] = CODE[k][1]; });
    HW.addCodes(c); HW.addPartial(pr);
  });
  HW.addCodes({ 'u1-simplify': 'General term not simplified', 'u1-exact': 'Rounded decimal instead of the exact value', 'u1-var': 'Used a letter other than n', 'u1-no-n': 'General term without n' });

  /* ---- numbers and LaTeX ---- */
  function cl(x) { return Math.round(x * 1e9) / 1e9; }
  function near(a, b) { return Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b)); }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var c = a % b; a = b; b = c; } return a; }
  function range(a, b) { var o = []; for (var i = a; i <= b; i++) o.push(i); return o; }
  function nz(a, b) { return range(a, b).filter(function (x) { return x !== 0; }); }
  function isInt(x) { return Math.abs(x - Math.round(x)) < 1e-9; }
  function find(gen, test) { for (var i = 0; i < 4000; i++) { var v = gen(); if (v != null && test(v)) return v; } throw new Error('u1: no valid numbers'); }
  function toFr(x) { for (var q = 1; q <= 20000; q++) { var p = Math.round(x * q); if (Math.abs(p - x * q) < 1e-7 * Math.max(1, Math.abs(x * q))) { var g = gcd(p, q) || 1; return [p / g, q / g]; } } return null; }
  function frT(p, q) { if (q < 0) { p = -p; q = -q; } var g = gcd(p, q) || 1; p /= g; q /= g; if (q === 1) return F(p); return (p < 0 ? '-' : '') + '\\frac{' + F(Math.abs(p)) + '}{' + F(q) + '}'; }
  function termDec(q) { while (q % 2 === 0) q /= 2; while (q % 5 === 0) q /= 5; return q === 1; }
  /* TeX of a value: a whole number or terminating decimal as a decimal, anything else as a fraction (asFrac: always a fraction) */
  function vT(x, asFrac) { x = cl(x); if (isInt(x)) return F(Math.round(x)); var f = toFr(x); if (!f) return F(x); if (!asFrac && termDec(f[1]) && f[1] <= 10000) return F(x); return frT(f[0], f[1]); }
  function vP(x, asFrac) { var s = vT(x, asFrac); return x < 0 ? '\\left(' + s + '\\right)' : s; }   // in brackets when negative
  function kT(x) { x = cl(x); if (isInt(x)) return String(Math.round(x)); var f = toFr(x); if (f && termDec(f[1]) && f[1] <= 10000) return String(x); return f ? (f[0] < 0 ? '-' : '') + '\\frac{' + Math.abs(f[0]) + '}{' + f[1] + '}' : String(x); } // plain key text
  function seqT(arr, more) { return arr.map(function (x) { return vT(x); }).join(',\\ ') + (more === false ? '' : ',\\ \\dots'); }
  function serT(arr, more) { var s = vT(arr[0]); for (var i = 1; i < arr.length; i++) s += (arr[i] < 0 ? '-' + vT(-arr[i]) : '+' + vT(arr[i])); return s + (more === false ? '' : '+\\cdots'); }
  function money(x) { return '\\$' + F(K.roundTo(x, 2).toFixed(2)); }
  function dollars(x) { x = cl(x); return '\\$' + (isInt(x) ? F(Math.round(x)) : F(K.roundTo(x, 2).toFixed(2))); }
  function plusT(x) { return x < 0 ? '-' + vT(-x) : '+' + vT(x); }   // "+ 5" / "- 5" after another term
  function cT(c, v) { c = cl(c); return c === 0 ? '' : c === 1 ? '+' + v : c === -1 ? '-' + v : plusT(c) + v; }   // "+3n", "-n", "" after another term
  function linT(m, b, v) { v = v || 'n'; var s = m === 1 ? v : m === -1 ? '-' + v : vT(m) + v; if (cl(b) !== 0) s += plusT(b); return s; } // mn + b
  function geoT(t1, r) { var a = vT(t1, true), rr = vT(r, true); return (a === '1' ? '' : a === '-1' ? '-' : a) + (r < 0 || /frac/.test(rr) ? '\\left(' + rr + '\\right)' : '(' + rr + ')') + '^{n-1}'; }
  S.cl = cl; S.near = near; S.gcd = gcd; S.range = range; S.nz = nz; S.isInt = isInt; S.find = find; S.toFr = toFr; S.frT = frT; S.vT = vT; S.vP = vP; S.kT = kT;
  S.cT = cT; S.seqT = seqT; S.serT = serT; S.money = money; S.dollars = dollars; S.plusT = plusT; S.linT = linT; S.geoT = geoT;

  /* ---- reading answers ---- */
  var NONE_RE = /^(none|nosum|nosuch\w*|no|nope|notaterm|not|noterm|nosolution|diverg\w*|divergent|dne|doesnotexist|undefined|infinity|∞|nosumtoinfinity|impossible)$/;
  function words(s) { return String(s).replace(/\\text\{([^}]*)\}|\\mathrm\{([^}]*)\}/g, '$1$2').replace(/\\infty/g, '∞').replace(/[\s.!,'’]/g, '').toLowerCase(); }
  function strip(resp) {
    var s = String(resp == null ? '' : resp).replace(/\\left|\\right/g, '').replace(/\\approx|≈/g, '=').trim();
    var i = s.lastIndexOf('='); if (i >= 0) s = s.slice(i + 1);
    return s.replace(/^\s*\\?\$\s*/, '').replace(/^\s*(\\text\{\s*)?(year|day|week|minute|hour|row)s?\s*\}?\s*/i, '').trim();
  }
  function readNum(resp) {
    var s = strip(resp);
    if (!s) return { res: form('empty', 'Type your answer first.') };
    if (NONE_RE.test(words(s))) return { none: true };
    var pn = HW.parse.number(s); if (pn.ok) return { v: pn.value, dec: /\./.test(s) };
    var r0 = K.number(0)(s); if (r0.v === 'form' && r0.code === 'units') return { res: r0 };
    var a = K.read(s); if (a.res) return { res: a.res };
    if (!isFinite(a.val)) return { res: form('notnumber', 'Enter a single number.') };
    return { v: a.val, dec: !!ex.shape(a.ast).decimals };
  }
  S.readNum = readNum; S.strip = strip; S.words = words;
  /* one exact number; alts = [[value, code, hint, tolerance?], …]; opt.int: a whole number is wanted */
  function numChk(target, alts, opt) {
    opt = opt || {}; var T = cl(target), fr = toFr(T), exactDec = isInt(T) || (fr && termDec(fr[1]));
    var L = (alts || []).filter(function (w) { return w && w[0] != null && isFinite(w[0]) && !near(w[0], T); });
    return function (resp) {
      var n = readNum(resp); if (n.res) return n.res;
      if (n.none) return opt.noneHint ? wrong(opt.noneCode || 'value', opt.noneHint) : form('notnumber', 'This one has a numerical answer — type a number.');
      if (near(n.v, T)) return ok();
      for (var i = 0; i < L.length; i++) if (L[i][3] ? Math.abs(n.v - L[i][0]) < L[i][3] : near(n.v, L[i][0])) return wrong(L[i][1], L[i][2]);
      if (!exactDec && n.dec && Math.abs(n.v - T) < 0.006 * Math.max(1, Math.abs(T))) return form('u1-exact', 'That is a rounded decimal — give the <b>exact</b> value (as a fraction).');
      return wrong('value', null);
    };
  }
  function badOf(target, alts) {
    var seen = [];
    return (alts || []).filter(function (w) { if (!w || w[0] == null || !isFinite(w[0]) || near(w[0], target) || seen.some(function (x) { return near(x, w[0]); })) return false; seen.push(w[0]); return true; })
      .slice(0, 4).map(function (w) { return w[3] ? String(K.roundTo(w[0], 2)) : kT(w[0]); });
  }
  /* a number part (math box with the fraction keypad); inp: { before, after, ansPre, ansTex, unit } */
  function numPart(prompt, target, alts, sol, hints, text, inp) {
    inp = inp || {};
    var p = P.math(prompt, numChk(target, alts, inp), kT(target), sol, hints, text, { keys: 'fraction', before: inp.before, after: inp.after, placeholder: inp.placeholder || 'a number' });
    p.answer = t((inp.ansPre || '') + (inp.ansTex || vT(target))) + (inp.unit ? ' ' + inp.unit : '');
    p.bad = badOf(target, alts);
    return p;
  }
  /* a rounded number (number box); alts are compared after rounding */
  function apxPart(prompt, x, dp, alts, sol, hints, text, inp) {
    inp = inp || {};
    var want = K.roundTo(x, dp), L = (alts || []).filter(function (w) { return w && isFinite(w[0]) && Math.abs(K.roundTo(w[0], dp) - want) > 1e-9; });
    var diag = function (v) { for (var i = 0; i < L.length; i++) if (Math.abs(v - K.roundTo(L[i][0], dp)) < 1e-9 || Math.abs(v - L[i][0]) < Math.pow(10, -dp) / 2) return { code: L[i][1], hint: L[i][2] }; return null; };
    var p = P.approx(prompt, x, dp, { diag: diag, before: inp.before, after: inp.after }, sol, hints, text);
    p.answer = t((inp.ansPre || '') + (inp.money ? '\\$' : '') + F(want.toFixed(Math.max(dp, 0)))) + (inp.unit ? ' ' + inp.unit : '');
    p.bad = L.map(function (w) { return K.roundTo(w[0], dp).toFixed(Math.max(dp, 0)); }).filter(function (b, i, a) { return a.indexOf(b) === i; }).slice(0, 4);
    return p;
  }
  S.numChk = numChk; S.numPart = numPart; S.apxPart = apxPart; S.badOf = badOf;

  /* ---- a general term in n: f(n) gives the right value; opt.lin: "simplest form" (expanded, like terms collected);
     opt.dl = [[g(n), code, hint, tex], …] known wrong terms ---- */
  var NS = [1, 2, 3, 4, 5, 6, 7, 8];
  function varsOf(a, acc) { if (!a || typeof a !== 'object') return acc; if (a.t === 'var') acc[a.n] = 1; ['a', 'b', 'n'].forEach(function (k) { if (a[k]) varsOf(a[k], acc); }); return acc; }
  function sameFn(ast, g) { return NS.every(function (n) { var a = ex.value(ast, { n: n }), b = g(n); return isFinite(a) && isFinite(b) && (ex.eq(a, b, 1e-9) || Math.abs(a - b) < 1e-9); }); }
  function termChk(f, opt) {
    opt = opt || {};
    return function (resp) {
      var s = strip(resp); if (!s) return form('empty', 'Type the general term first.');
      if (!/n/.test(s) && NONE_RE.test(words(s))) return form('u1-no-n', 'Write the general term as an expression in ' + t('n') + '.');
      var a = K.read(s); if (a.res) return a.res;
      var vs = Object.keys(varsOf(a.ast, {})), other = vs.filter(function (v) { return v !== 'n'; });
      if (other.length) return form('u1-var', 'Write the general term with the letter ' + t('n') + ' (the position), e.g. ' + t('t_n=4n-1') + '.');
      if (!vs.length) return form('u1-no-n', 'The general term gives every term from its position, so it must contain ' + t('n') + ', e.g. ' + t('t_n=4n-1') + '.');
      if (sameFn(a.ast, f)) {
        if (opt.lin) { var pr = HW.poly.read(a.ast), fi = pr.ok ? HW.poly.formIssue(a.ast) : { code: 'brackets' }; if (fi) return form('u1-simplify', 'Right — now write it in <b>simplest form</b>: expand the bracket and collect like terms, e.g. ' + t('t_n=4n-1') + '.'); }
        return ok();
      }
      var dl = opt.dl || [];
      for (var i = 0; i < dl.length; i++) if (dl[i] && sameFn(a.ast, dl[i][0])) return wrong(dl[i][1], dl[i][2]);
      var v1 = ex.value(a.ast, { n: 1 });
      if (isFinite(v1) && near(v1, f(1))) return wrong('value', 'Your formula gives the right first term, but not the right ' + (opt.geo ? 'ratio' : 'difference') + ' — check ' + t('t_2') + ' and ' + t('t_3') + '.');
      return wrong('value', null);
    };
  }
  function termPart(prompt, keyTex, f, opt, sol, hints, text) {
    opt = opt || {}; var nm = opt.name || 't_n';
    var p = P.math(prompt, termChk(f, opt), keyTex, sol, hints, text, { keys: 'poly', vars: ['n'], before: t(nm + '='), placeholder: opt.placeholder || (opt.geo ? 'e.g. 5(3)^(n-1)' : 'e.g. 4n - 1') });
    p.answer = t(nm + '=' + keyTex);
    p.bad = (opt.dl || []).filter(function (d) { return d && d[3] && NS.some(function (n) { return !near(d[0](n), f(n)); }); }).map(function (d) { return d[3]; }).slice(0, 4);
    return p;
  }
  S.termChk = termChk; S.termPart = termPart;

  /* ---- a number or "none" (one math box with a none key): target null means the answer is none ---- */
  function noneChk(target, alts, opt) {
    opt = opt || {};
    var inner = target == null ? null : numChk(target, alts, { noneHint: opt.saidNoneHint, noneCode: opt.saidNoneCode });
    return function (resp) {
      if (target != null) return inner(resp);
      var n = readNum(resp); if (n.res) return n.res;
      if (n.none) return ok();
      var L = alts || [];
      for (var i = 0; i < L.length; i++) if (L[i] && L[i][0] != null && near(n.v, L[i][0])) return wrong(L[i][1], L[i][2]);
      return wrong(opt.numCode || 'value', opt.numHint || null);
    };
  }
  function nonePart(prompt, target, alts, opt, sol, hints, text) {
    opt = opt || {};
    var f = [{ name: opt.name || 'Answer', label: opt.label || '', before: opt.before, after: opt.after, mode: 'math', keys: 'fraction', none: true, placeholder: opt.placeholder || 'a number, or none' }];
    var p = P.fields(prompt, f, [noneChk(target, alts, opt)], [target == null ? 'none' : kT(target)], target == null ? '<b>none</b>' + (opt.noneAns ? ' — ' + opt.noneAns : '') : t((opt.ansPre || '') + vT(target)), sol, hints, text);
    p.bad = (target == null ? (alts || []).filter(function (w) { return w && w[0] != null; }).map(function (w) { return [kT(w[0])]; }) : [['none']].concat(badOf(target, alts).map(function (b) { return [b]; }))).slice(0, 4);
    return p;
  }
  S.noneChk = noneChk; S.nonePart = nonePart;

  /* ---- several boxes: one plain wrong box (the rest right) is code <cp>one-box; a diagnosed box keeps its code ---- */
  function boxesChk(checkers, labels, cp, anyOrder) {
    return function (resp) {
      resp = resp || [];
      var rs = checkers.map(function (c, i) { return c(resp[i] == null ? '' : resp[i]); });
      if (anyOrder && checkers.length === 2 && !rs.every(function (r) { return r.v === 'correct'; })) { // the two values may be in either order
        var sw = [checkers[0](resp[1] == null ? '' : resp[1]), checkers[1](resp[0] == null ? '' : resp[0])];
        if (sw.filter(function (r) { return r.v === 'correct'; }).length > rs.filter(function (r) { return r.v === 'correct'; }).length) rs = sw;
      }
      var bad = rs.map(function (r, i) { return r.v === 'correct' ? null : { r: r, i: i }; }).filter(Boolean);
      if (!bad.length) return ok();
      var forms = bad.filter(function (b) { return b.r.v === 'form'; });
      var wr = bad.filter(function (b) { return b.r.v === 'wrong'; });
      if (!wr.length) return { v: 'form', code: forms[0].r.code, hint: '<b>' + labels[forms[0].i] + ':</b> ' + (forms[0].r.hint || 'Check this one again.') };
      var w0 = wr[0], hint = '<b>' + labels[w0.i] + ':</b> ' + (w0.r.hint || 'Check this one again.');
      if (wr.length === 1 && !forms.length && checkers.length >= 2 && (w0.r.code === 'value' || !w0.r.code)) return wrong(cp + 'one-box', hint);
      return wrong(w0.r.code || 'value', hint);
    };
  }
  /* boxes: [{ name, label, before, after, check, key, none }] */
  function boxesPart(prompt, boxes, answer, sol, hints, text, cp, o) {
    o = o || {};
    var fields = boxes.map(function (b) { return { name: b.name, label: b.label || '', before: b.before, after: b.after, mode: 'math', keys: b.keys || 'fraction', none: !!b.none, placeholder: b.placeholder || 'a number' }; });
    var p = P.fields(prompt, fields, boxes.map(function (b) { return b.check; }), boxes.map(function (b) { return b.key; }), answer, sol, hints, text);
    p.check = boxesChk(boxes.map(function (b) { return b.check; }), boxes.map(function (b) { return b.name; }), cp, o.anyOrder);
    return p;
  }
  S.boxesChk = boxesChk; S.boxesPart = boxesPart;

  /* ---- exact rationals [p, q] for geometric work ---- */
  var Q = S.Q = {
    n: function (p, q) { q = q == null ? 1 : q; if (q < 0) { p = -p; q = -q; } var g = gcd(p, q) || 1; return [p / g, q / g]; },
    mul: function (a, b) { return Q.n(a[0] * b[0], a[1] * b[1]); },
    pow: function (a, k) { var p = 1, q = 1; for (var i = 0; i < Math.abs(k); i++) { p *= a[0]; q *= a[1]; } return k < 0 ? Q.n(q, p) : Q.n(p, q); },
    v: function (a) { return a[0] / a[1]; },
    t: function (a) { return frT(a[0], a[1]); }
  };
  function mcPart(r, prompt, opts, sol, hints, text, keepOrder) { return P.mc(r, prompt, opts, sol, hints, text, keepOrder); }
  S.mc = mcPart;

  /* =====================================================================================================
   * Question builders (cp = code prefix: 'u1t-' for the test, 'u1x-' for the exit slips). Each returns one part.
   * ===================================================================================================== */
  var Bd = S.build = {};
  var HA = ['Arithmetic: ' + t('t_n=t_1+(n-1)d') + '. The term in position ' + t('n') + ' is ' + t('n-1') + ' steps after ' + t('t_1') + '.'];

  /* L1: classify a sequence (MC) */
  Bd.classify = function (r, cp) {
    var kind = r.pick(['ar', 'ar', 'ge', 'ge', 'ne', 'ne']), a, sub = '';
    if (kind === 'ar') { var t1 = r.int(-25, 40), d = r.chance(0.25) ? r.pick([-2.5, -1.5, 0.5, 1.5, 2.5, 0.75, -0.75]) : r.pick(nz(-12, 13)); a = [0, 1, 2, 3].map(function (i) { return cl(t1 + i * d); }); }
    else if (kind === 'ge') { var g = r.pick([[r.pick([2, 3, 5, -2, -4, 7]), 2], [r.pick([2, 4, -1, 5]), 3], [r.pick([1, 2, -3]), 4], [r.pick([3, -2, 1]), -3], [r.pick([1, -1, 2]), -2], [r.pick([64, 96, 160, 320, 48, -128]), 0.5], [r.pick([81, 162, 243, -54]), 1 / 3], [r.pick([2, 4, -3]), 5]]); a = [0, 1, 2, 3].map(function (i) { return cl(g[0] * Math.pow(g[1], i)); }); }
    else {
      sub = r.pick(['sq', 'tri', 'ma', 'fib']);
      if (sub === 'sq') { var c = r.int(-3, 5); a = [1, 2, 3, 4, 5].map(function (n) { return n * n + c; }); }
      else if (sub === 'tri') { var s0 = r.int(1, 12), k = r.int(1, 4); a = [s0]; for (var i = 0; i < 4; i++) a.push(a[i] + k + i); }
      else if (sub === 'ma') { var m = r.pick([2, 3]), ad = r.pick([-2, -1, 1, 2]), x0 = r.int(2, 5); a = [x0]; for (var j = 0; j < 3; j++) a.push(a[j] * m + ad); }
      else { var f1 = r.int(1, 4), f2 = r.int(f1 + 1, 7); a = [f1, f2]; for (var q = 0; q < 3; q++) a.push(a[q] + a[q + 1]); }
    }
    var diffs = a.slice(1).map(function (x, i) { return cl(x - a[i]); }), rats = a.slice(1).map(function (x, i) { return a[i] === 0 ? NaN : cl(x / a[i]); });
    var dT = diffs.map(function (x) { return vT(x); }).join(',\\ '), rT = rats.slice(0, 3).map(function (x) { return isFinite(x) ? vT(x, true) : '\\text{—}'; }).join(',\\ ');
    var ans = kind === 'ar' ? 'Arithmetic' : kind === 'ge' ? 'Geometric' : 'Neither';
    var expl = kind === 'ar' ? 'Differences: ' + t(dT) + ' — all equal. Arithmetic, ' + t('d=' + vT(diffs[0])) + '.' : kind === 'ge' ? 'Ratios: ' + t(rT) + ' — all equal. Geometric, ' + t('r=' + vT(rats[0], true)) + '.' : 'Differences ' + t(dT) + ' are not all equal, and ratios ' + t(rT) + ' are not all equal: <b>neither</b>.' + (sub === 'fib' ? ' (Each term is the sum of the two before it.)' : sub === 'sq' ? ' (Square numbers plus a constant.)' : '');
    var opts = ['Arithmetic', 'Geometric', 'Neither'].map(function (k) {
      return { html: k, right: k === ans, code: k.toLowerCase(), why: k === ans ? null : k === 'Arithmetic' ? 'Arithmetic needs the <b>same difference</b> every time; the differences are ' + t(dT) + '. ' + (kind === 'ge' ? 'Try dividing instead.' : '') : k === 'Geometric' ? 'Geometric needs the <b>same ratio</b> every time; the ratios are ' + t(rT) + '.' : 'Check again: ' + expl };
    });
    return mcPart(r, 'Classify the sequence ' + t(seqT(a)) + '.', opts, expl, ['Subtract each term from the next: are the differences all equal (arithmetic)?', 'Divide each term by the one before it: are the ratios all equal (geometric)?'], 'classify: ' + kind + (sub ? '/' + sub : ''), true);
  };
  /* L1: a term from a formula */
  Bd.termFromFormula = function (r, cp) {
    var quad = r.chance(0.35), k = r.int(12, 40), A, Bc, val, ftex, dl, sol;
    if (!quad) {
      A = r.pick(nz(-9, 9).filter(function (x) { return Math.abs(x) >= 2; })); Bc = r.pick(nz(-15, 30));
      ftex = r.chance(0.5) || A > 0 ? linT(A, Bc) : vT(Bc) + plusT(A) + 'n';
      val = A * k + Bc;
      dl = [[A * k, cp + 'no-t1', 'Substitute ' + t('n=' + k) + ' into the <b>whole</b> formula, including the ' + t(vT(Bc)) + '.'], [A + Bc * k, 'value', 'Multiply ' + t('n') + ' by its own coefficient, ' + t(vT(A)) + '.'], [A * (k - 1) + Bc, cp + 'n-step', 'The formula already gives the term from its position: substitute ' + t('n=' + k) + ' itself (not ' + t(k - 1) + ').']];
      sol = t('t_{' + k + '}=' + vT(A) + '(' + k + ')' + plusT(Bc) + '=' + F(A * k) + plusT(Bc) + '=' + F(val));
    } else {
      A = r.int(2, 5); Bc = r.pick(nz(-6, 6)); k = r.int(8, 15);
      ftex = A + 'n^{2}' + (Bc === 1 ? '+n' : Bc === -1 ? '-n' : plusT(Bc) + 'n');
      val = A * k * k + Bc * k;
      dl = [[A * 2 * k + Bc * k, 'value', t('n^{2}') + ' means ' + t('n\\times n') + ', not ' + t('2n') + '.'], [Math.pow(A * k, 2) + Bc * k, 'value', 'Square ' + t('n') + ' first, then multiply by ' + t(A) + ' (order of operations).'], [A * k * k, cp + 'no-t1', 'Include every term of the formula.']];
      sol = t('t_{' + k + '}=' + A + '(' + k + ')^{2}' + (Bc < 0 ? '-' : '+') + (Math.abs(Bc) === 1 ? '' : Math.abs(Bc)) + '(' + k + ')=' + F(A * k * k) + plusT(Bc * k) + '=' + F(val));
    }
    return numPart('A sequence has general term ' + t('t_n=' + ftex) + '. Determine ' + t('t_{' + k + '}') + '.', val, dl, sol, ['Substitute the position ' + t('n=' + k) + ' into the formula.', 'Follow the order of operations: powers, then multiplication, then addition and subtraction.'], 'term from a formula', { before: t('t_{' + k + '}='), ansPre: 't_{' + k + '}=' });
  };
  /* L1/L2: is V a term? which one (or none). o.formula: give t_n = mn + b instead of the first terms */
  Bd.isTerm = function (r, cp, o) {
    o = o || {};
    var s = find(function () { var d = r.pick(nz(-9, 9).filter(function (x) { return Math.abs(x) >= 2; })), t1 = r.int(-20, 40); return { d: d, t1: t1, k: r.int(22, 60), yes: r.chance(0.55), off: r.int(1, Math.abs(d) - 1) }; }, function (s) { return true; });
    var d = s.d, t1 = s.t1, k = s.k, tk = t1 + (k - 1) * d, V = s.yes ? tk : tk + Math.sign(d) * s.off, b = t1 - d, nV = (V - b) / d;
    var given = o.formula ? 'A sequence has general term ' + t('t_n=' + linT(d, b)) + '.' : 'Consider the arithmetic sequence ' + t(seqT([t1, t1 + d, t1 + 2 * d, t1 + 3 * d])) + '.';
    var gt = o.formula ? '' : t('t_n=' + t1 + '+(n-1)(' + d + ')=' + linT(d, b)) + '<br>';
    var sol = gt + t(linT(d, b) + '=' + V) + ' gives ' + t(d + 'n=' + F(V - b)) + ', so ' + t('n=' + (s.yes ? k : vT(cl(nV)))) + '.<br>' + (s.yes ? 'That is a natural number: ' + t(F(V) + '=t_{' + k + '}') + '.' : 'That is not a natural number, so ' + t(F(V)) + ' is <b>not</b> a term: <b>none</b>.');
    var alts = s.yes ? [[k - 1, cp + 'pos-off1', 'Check your position: ' + t('t_1') + ' is in position 1, so ' + t('t_n=t_1+(n-1)d') + '. Substitute your answer to check.'], [k + 1, cp + 'pos-off1', 'Check by substituting your position into the general term.']]
      : [[Math.round(nV), cp + 'not-natural', 'Solving gives ' + t('n=' + vT(cl(nV))) + ', which is not a natural number — positions are ' + t('1,\\ 2,\\ 3,\\ \\dots') + ', so ' + t(F(V)) + ' is not a term.'], [Math.floor(nV), cp + 'not-natural', 'Solving gives ' + t('n=' + vT(cl(nV))) + ': not a natural number, so ' + t(F(V)) + ' is not a term.'], [Math.ceil(nV), cp + 'not-natural', 'Solving gives ' + t('n=' + vT(cl(nV))) + ': not a natural number, so ' + t(F(V)) + ' is not a term.']];
    var p = nonePart(given + ' Is ' + t(F(V)) + ' a term of the sequence? If it is, give its position ' + t('n') + '. If it is not, press <b>none</b>.', s.yes ? k : null, alts,
      { name: 'Position', before: t('n='), saidNoneCode: cp + 'said-none', saidNoneHint: 'Solve ' + t('t_n=' + F(V)) + ' for ' + t('n') + ': if the answer is a natural number, it is a term.', numCode: cp + 'gave-num', numHint: 'Solve ' + t('t_n=' + F(V)) + ' for ' + t('n') + ': the answer must be a natural number for ' + t(F(V)) + ' to be a term.', ansPre: 'n=', noneAns: 'not a term' },
      sol, ['Write the general term, set it equal to ' + t(F(V)) + ', and solve for ' + t('n') + '.', 'A number is a term only when ' + t('n') + ' is a natural number (1, 2, 3, …).'], 'is it a term: ' + (s.yes ? 'yes' : 'no'));
    return p;
  };
  /* L1: the first negative term of t_n = A - Bn (two boxes: position and value) */
  Bd.firstNeg = function (r, cp) {
    var s = find(function () { var B = r.int(3, 9), m = r.int(8, 24); return { B: B, A: B * m + r.int(1, B - 1) }; }, function (s) { return s.A % s.B !== 0; });
    var A = s.A, Bc = s.B, n0 = Math.floor(A / Bc) + 1, v0 = A - Bc * n0, last = A - Bc * (n0 - 1);
    var hint = 'Solve ' + t(A + '-' + Bc + 'n<0') + ': ' + t('n>' + vT(cl(A / Bc))) + '. The first natural number above that is the position of the first negative term.';
    var nC = numChk(n0, [[n0 - 1, cp + 'neg-last', 'Position ' + t(n0 - 1) + ' still gives a positive term (' + t(last) + '). ' + hint]]);
    var vC = numChk(v0, [[last, cp + 'neg-last', 'That term is still positive — the first negative term is one step later.'], [Bc * n0 - A, 'value', 'Check the sign: the term is negative.']]);
    var p = boxesPart('A sequence has general term ' + t('t_n=' + A + '-' + Bc + 'n') + '. Determine the <b>first negative term</b>: its position ' + t('n') + ' and its value.',
      [{ name: 'Position n', label: 'Position:', before: t('n='), check: nC, key: String(n0) }, { name: 'Value', label: 'Value:', before: t('t_{n}='), check: vC, key: String(v0) }],
      t('n=' + n0) + ', ' + t('t_{' + n0 + '}=' + v0), t(A + '-' + Bc + 'n<0\\Rightarrow ' + Bc + 'n>' + A + '\\Rightarrow n>' + vT(cl(A / Bc))) + ', so ' + t('n=' + n0) + '.<br>' + t('t_{' + n0 + '}=' + A + '-' + Bc + '(' + n0 + ')=' + v0) + ' (and ' + t('t_{' + (n0 - 1) + '}=' + last) + ' is still positive).',
      [hint, 'Check the terms on both sides: ' + t('t_{n-1}') + ' should be positive (or 0) and ' + t('t_n') + ' negative.'], 'first negative term', cp);
    p.bad = [[String(n0 - 1), String(last)], [String(n0), String(-v0)]];
    return p;
  };

  /* L2: a term of an arithmetic sequence from its first terms */
  Bd.arithTk = function (r, cp) {
    var t1 = r.int(-25, 40), d = r.chance(0.25) ? r.pick([-3.5, -2.5, 1.5, 2.5, 4.5, 0.5]) : r.pick(nz(-12, 13).filter(function (x) { return Math.abs(x) >= 2; })), k = r.int(18, 48), v = cl(t1 + (k - 1) * d);
    return numPart('Determine ' + t('t_{' + k + '}') + ' for the arithmetic sequence ' + t(seqT([t1, cl(t1 + d), cl(t1 + 2 * d)])) + '.', v,
      [[cl(t1 + k * d), cp + 'n-step', 'From ' + t('t_1') + ' to ' + t('t_{' + k + '}') + ' is ' + t(k - 1) + ' steps, not ' + t(k) + ': ' + t('t_{' + k + '}=t_1+(' + k + '-1)d') + '.'], [cl((k - 1) * d), cp + 'no-t1', 'Start from the first term: ' + t('t_{' + k + '}=t_1+(n-1)d') + '.'], [cl(t1 - (k - 1) * d), cp + 'd-sign', 'Check the sign of ' + t('d') + ': ' + t('d=t_2-t_1=' + vT(d)) + '.']],
      t('t_1=' + vT(t1)) + ', ' + t('d=' + vT(cl(t1 + d)) + '-' + vP(t1) + '=' + vT(d)) + '.<br>' + t('t_{' + k + '}=' + vT(t1) + '+(' + k + '-1)' + vP(d) + '=' + vT(t1) + plusT(cl((k - 1) * d)) + '=' + vT(v)),
      ['Find ' + t('d') + ' by subtracting: ' + t('d=t_2-t_1') + '.', HA[0]], 'arithmetic term', { before: t('t_{' + k + '}='), ansPre: 't_{' + k + '}=' });
  };
  /* L2: general term in simplest form (o.given: the first terms; default) */
  Bd.arithGT = function (r, cp) {
    var t1 = r.int(-20, 45), d = r.chance(0.2) ? r.pick([-2.5, 1.5, 2.5, 0.5, -1.5]) : r.pick(nz(-11, 12).filter(function (x) { return Math.abs(x) >= 2; })), b = cl(t1 - d);
    var f = function (n) { return t1 + (n - 1) * d; };
    return termPart('Determine the general term, in simplest form, of the arithmetic sequence ' + t(seqT([t1, cl(t1 + d), cl(t1 + 2 * d), cl(t1 + 3 * d)])) + '.', linT(d, b), f,
      { lin: true, dl: [[function (n) { return t1 + n * d; }, cp + 'n-step', 'Check: your formula gives ' + t('t_1=' + vT(cl(t1 + d))) + ', not ' + t(vT(t1)) + '. Use ' + t('n-1') + ' steps: ' + t('t_n=t_1+(n-1)d') + '.', linT(d, t1)],
        [function (n) { return d + (n - 1) * t1; }, cp + 'swap-td', 'In ' + t('t_n=t_1+(n-1)d') + ', the first term stands alone and ' + t('d') + ' multiplies ' + t('(n-1)') + '.', linT(t1, cl(d - t1))],
        [function (n) { return t1 - (n - 1) * d; }, cp + 'd-sign', 'Check the sign of ' + t('d') + ': ' + t('d=t_2-t_1') + '.', linT(-d, cl(t1 + d))]] },
      t('t_1=' + vT(t1)) + ', ' + t('d=' + vT(d)) + '.<br>' + t('t_n=' + vT(t1) + '+(n-1)' + vP(d) + '=' + vT(t1) + plusT(d) + 'n' + plusT(-d) + '=' + linT(d, b)),
      [HA[0], 'Expand the bracket and collect the numbers: ' + t('t_1+(n-1)d=dn+(t_1-d)') + '.'], 'arithmetic general term');
  };
  /* L2: the number of terms in a finite arithmetic sequence */
  Bd.numTerms = function (r, cp) {
    var t1, d, n;
    if (r.chance(0.3)) { t1 = r.pick([2.5, 1.25, 4, -3.5, 0.75]); d = r.pick([0.75, 1.25, 0.5, 1.5, -0.5]); } else { t1 = r.int(-30, 40); d = r.pick(nz(-12, 13).filter(function (x) { return Math.abs(x) >= 2; })); }
    n = r.int(20, 70); var L = cl(t1 + (n - 1) * d);
    return numPart('How many terms are in the sequence ' + t(seqT([t1, cl(t1 + d), cl(t1 + 2 * d)], false) + ',\\ \\dots,\\ ' + vT(L)) + '?', n,
      [[n - 1, cp + 'nt-plus1', 'Your answer is the number of <b>steps</b> from the first term to the last. Add the first term itself: ' + t('n=\\frac{t_n-t_1}{d}+1') + '.'], [n + 1, cp + 'nt-plus1', 'Check: ' + t('t_n=t_1+(n-1)d') + ' should give the last term.']],
      t(vT(L) + '=' + vT(t1) + '+(n-1)' + vP(d)) + ', so ' + t('n-1=\\frac{' + vT(cl(L - t1)) + '}{' + vT(d) + '}=' + (n - 1)) + ' and ' + t('n=' + n) + '.',
      ['Set the last term equal to ' + t('t_1+(n-1)d') + ' and solve for ' + t('n') + '.', 'Or: ' + t('n=\\frac{t_n-t_1}{d}+1') + '.'], 'number of terms', { before: t('n='), ansPre: 'n=', int: true });
  };
  /* L2: k arithmetic means between A and B -> d */
  Bd.means = function (r, cp) {
    var s = find(function () { var k = r.int(3, 9), d = r.chance(0.4) ? r.pick([2.5, -1.5, 3.5, -2.5, 6.5, 0.5]) : r.pick(nz(-9, 9)), A = r.int(-20, 30); return { k: k, d: d, A: A, B: cl(A + (k + 1) * d) }; }, function (s) { return Math.abs(s.d) >= 0.5; });
    var k = s.k, d = s.d, A = s.A, Bv = s.B;
    return numPart(t(k) + ' arithmetic means are inserted between ' + t(vT(A)) + ' and ' + t(vT(Bv)) + '. Determine the common difference of the resulting sequence.', d,
      [[cl((Bv - A) / k), cp + 'means-steps', 'With ' + t(k) + ' means and the two given numbers there are ' + t(k + 2) + ' terms, so there are ' + t(k + 1) + ' steps of ' + t('d') + ', not ' + t(k) + '.'], [cl((Bv - A) / (k + 2)), cp + 'means-terms', 'Divide by the number of <b>steps</b> between the first and last term (' + t(k + 1) + '), not the number of terms.']],
      t(k) + ' means + 2 ends = ' + t(k + 2) + ' terms: ' + t('t_1=' + vT(A)) + ', ' + t('t_{' + (k + 2) + '}=' + vT(Bv)) + '.<br>' + t(vT(Bv) + '=' + vT(A) + '+' + (k + 1) + 'd\\Rightarrow d=\\frac{' + vT(cl(Bv - A)) + '}{' + (k + 1) + '}=' + vT(d)),
      ['Count the terms: the means plus the two given numbers.', 'The number of steps of ' + t('d') + ' is one less than the number of terms.'], 'arithmetic means', { before: t('d='), ansPre: 'd=' });
  };
  /* L2: three expressions are consecutive terms of an arithmetic sequence -> x and d */
  Bd.exprArith = function (r, cp) {
    var s = find(function () {
      var x = r.pick(nz(-6, 9)), c = r.shuffle([1, 2, 3, 4, 5, 6]).slice(0, 3), T1 = r.int(-12, 15), d = r.pick(nz(-9, 10));
      var T = [T1, T1 + d, T1 + 2 * d], k = T.map(function (v, i) { return v - c[i] * x; });
      return { x: x, c: c, k: k, d: d, T: T };
    }, function (s) { return 2 * s.c[1] - s.c[0] - s.c[2] !== 0 && s.k.every(function (v) { return v !== 0 && Math.abs(v) <= 20; }) && Math.abs(s.d) >= 2 && s.d !== s.x; });
    var x = s.x, c = s.c, kk = s.k, d = s.d, T = s.T, E = c.map(function (ci, i) { return (ci === 1 ? '' : ci) + 'x' + plusT(kk[i]); });
    var lhsx = c[1] - c[0], lhsk = kk[1] - kk[0], rhsx = c[2] - c[1], rhsk = kk[2] - kk[1];
    var xC = numChk(x, []), dC = numChk(d, [[x, cp + 'x-as-d', 'That is ' + t('x') + '. Substitute it into the expressions to get the terms, then subtract consecutive terms.'], [T[1], cp + 'x-as-d', 'That is a term. The common difference is the difference between consecutive terms.'], [-d, cp + 'd-sign', 'Subtract in order: ' + t('d=t_2-t_1') + '.']]);
    var p = boxesPart('The expressions ' + t(E[0]) + ', ' + t(E[1]) + ' and ' + t(E[2]) + ' are consecutive terms of an arithmetic sequence. Determine the value of ' + t('x') + ' and the common difference.',
      [{ name: 'x', label: '', before: t('x='), check: xC, key: String(x) }, { name: 'Common difference', label: '', before: t('d='), check: dC, key: String(d) }],
      t('x=' + x) + ', ' + t('d=' + d) + ' (terms ' + t(seqT(T, false)) + ')',
      'The differences are equal: ' + t('(' + E[1] + ')-(' + E[0] + ')=(' + E[2] + ')-(' + E[1] + ')') + '<br>' + t(linT(lhsx, lhsk, 'x') + '=' + linT(rhsx, rhsk, 'x')) + ', so ' + t('x=' + x) + '.<br>Terms: ' + t(seqT(T, false)) + ', so ' + t('d=' + d) + '.',
      ['Consecutive terms have the same difference: ' + t('t_2-t_1=t_3-t_2') + '. Write that with the expressions and solve for ' + t('x') + '.', 'Substitute ' + t('x') + ' into the expressions to find the terms, then subtract.'], 'three expressions, arithmetic', cp);
    p.bad = [[String(x), String(x)], [String(x), String(T[1])], [String(-x), String(d)]];
    return p;
  };

  /* L3: d from two terms */
  Bd.dFromTwo = function (r, cp) {
    var s = find(function () { var p = r.int(2, 9), g = r.int(3, 14), d = r.chance(0.3) ? r.pick([2.5, -1.5, 3.5, -2.5, 0.5, -0.5]) : r.pick(nz(-9, 9)), t1 = r.int(-20, 30); return { p: p, q: p + g, d: d, t1: t1 }; }, function (s) { return Math.abs(s.d) >= 0.5; });
    var p = s.p, q = s.q, d = s.d, tp = cl(s.t1 + (p - 1) * d), tq = cl(s.t1 + (q - 1) * d);
    return numPart('An arithmetic sequence has ' + t('t_{' + p + '}=' + vT(tp)) + ' and ' + t('t_{' + q + '}=' + vT(tq)) + '. Determine the common difference.', d,
      [[cl(tq - tp), cp + 'd-nodiv', 'That is the change over ' + t(q - p) + ' steps. Divide by the number of steps: ' + t('d=\\frac{t_q-t_p}{q-p}') + '.'], [cl((tq - tp) / (q - p + 1)), cp + 'd-steps', 'From position ' + t(p) + ' to position ' + t(q) + ' is ' + t(q + '-' + p + '=' + (q - p)) + ' steps.'], [-d, cp + 'd-sign', 'Subtract in the same order on the top and the bottom: ' + t('\\frac{t_{' + q + '}-t_{' + p + '}}{' + q + '-' + p + '}') + '.']],
      'From ' + t('t_{' + p + '}') + ' to ' + t('t_{' + q + '}') + ' is ' + t(q - p) + ' steps.<br>' + t('d=\\frac{' + vT(tq) + '-' + vP(tp) + '}{' + q + '-' + p + '}=\\frac{' + vT(cl(tq - tp)) + '}{' + (q - p) + '}=' + vT(d)),
      ['Count the steps between the two positions: ' + t(q + '-' + p) + '.', t('d=\\dfrac{\\text{change in the terms}}{\\text{change in the positions}}')], 'd from two terms', { before: t('d='), ansPre: 'd=' });
  };
  /* L3: general term from two terms */
  Bd.gtFromTwo = function (r, cp) {
    var s = find(function () { var p = r.int(2, 8), g = r.int(3, 12), d = r.chance(0.25) ? r.pick([2.5, -1.5, 0.5, 3.5]) : r.pick(nz(-8, 9).filter(function (x) { return Math.abs(x) >= 2; })), t1 = r.int(-15, 30); return { p: p, q: p + g, d: d, t1: t1 }; }, function (s) { return true; });
    var p = s.p, q = s.q, d = s.d, t1 = s.t1, tp = cl(t1 + (p - 1) * d), tq = cl(t1 + (q - 1) * d), b = cl(t1 - d);
    return termPart('An arithmetic sequence has ' + t('t_{' + p + '}=' + vT(tp)) + ' and ' + t('t_{' + q + '}=' + vT(tq)) + '. Determine the general term in simplest form.', linT(d, b), function (n) { return t1 + (n - 1) * d; },
      { lin: true, dl: [[function (n) { return tp + (n - 1) * d; }, cp + 'a2-t1', t('t_{' + p + '}') + ' is not the first term. Find ' + t('t_1') + ' first: ' + t('t_{' + p + '}=t_1+' + (p - 1) + 'd') + '.', linT(d, cl(tp - d))],
        [function (n) { return t1 + n * d; }, cp + 'n-step', 'Use ' + t('n-1') + ' steps: ' + t('t_n=t_1+(n-1)d') + ' — check that your formula gives ' + t('t_{' + p + '}=' + vT(tp)) + '.', linT(d, t1)],
        [function (n) { return t1 + (n - 1) * (tq - tp); }, cp + 'd-nodiv', 'Divide the change by the number of steps (' + t(q - p) + ') to get ' + t('d') + '.', null]] },
      t('d=\\frac{' + vT(tq) + '-' + vP(tp) + '}{' + (q - p) + '}=' + vT(d)) + '. ' + t(vT(tp) + '=t_1+' + (p - 1) + vP(d)) + ', so ' + t('t_1=' + vT(t1)) + '.<br>' + t('t_n=' + vT(t1) + '+(n-1)' + vP(d) + '=' + linT(d, b)),
      ['First find ' + t('d') + ' (change in the terms ÷ number of steps), then ' + t('t_1') + ' from either known term.', HA[0] + ' Expand to simplest form.'], 'general term from two terms');
  };
  /* L3: simple interest — value after k years */
  Bd.simpleInterest = function (r, cp) {
    var s = find(function () { return { P: r.int(20, 90) * 100, rate: r.pick([2.5, 3, 3.25, 3.5, 3.75, 4, 4.25, 4.5, 5, 2.75]), k: r.int(6, 20) }; }, function (s) { return isInt(s.P * s.rate) && isInt(s.P * s.rate / 100 * 100); });
    var I = cl(s.P * s.rate / 100), v = cl(s.P + s.k * I), who = r.pick(['Leah', 'Marco', 'Priya', 'Jonah', 'Amira', 'Theo']);
    return numPart(who + ' invests ' + t(dollars(s.P)) + ' at ' + t(s.rate + '\\%') + ' <b>simple</b> interest per year. What is the investment worth after ' + t(s.k) + ' years?', v,
      [[cl(s.P + (s.k - 1) * I), cp + 'ctx-n', 'After ' + t(s.k) + ' years the interest has been paid ' + t(s.k) + ' times: ' + t(dollars(s.P) + '+' + s.k + '(' + dollars(I) + ')') + '.'], [cl(s.k * I), cp + 'si-no-p', 'That is the interest earned. The investment is worth the principal plus the interest.'], [cl(s.P * Math.pow(1 + s.rate / 100, s.k)), cp + 'si-compound', 'Simple interest is paid only on the principal, so it is the <b>same amount</b> every year (arithmetic growth), not a percent of the growing balance.', 0.01]],
      'Interest each year: ' + t(dollars(s.P) + '\\times ' + vT(s.rate / 100) + '=' + dollars(I)) + '.<br>After ' + t(s.k) + ' years: ' + t(dollars(s.P) + '+' + s.k + '(' + dollars(I) + ')=' + dollars(v)) + '.',
      ['Simple interest: interest per year = principal × annual rate, the same every year.', 'Value after ' + t('k') + ' years = principal + ' + t('k') + ' × (interest per year).'], 'simple interest', { before: t('\\$'), ansTex: dollars(v) });
  };
  /* L3: salary with a raise — salary in year k, and the first year above X (two separate parts share s) */
  Bd.salaryShared = function (r) { return { S0: r.int(80, 104) * 500, R: r.int(24, 48) * 50, k: r.int(7, 15), who: r.pick(['An engineer', 'A nurse', 'A pilot', 'An electrician', 'A teacher']) }; };
  Bd.salaryStem = function (s) { return s.who + '’s salary is ' + t(dollars(s.S0)) + ' in year 1, with a raise of ' + t(dollars(s.R)) + ' at the start of each year after that.'; };
  Bd.salaryK = function (r, cp, s) {
    var v = s.S0 + (s.k - 1) * s.R;
    return numPart('What is the salary in year ' + t(s.k) + '?', v,
      [[s.S0 + s.k * s.R, cp + 'ctx-n', 'Year 1 has no raise yet, so year ' + t(s.k) + ' has had ' + t(s.k - 1) + ' raises: ' + t('t_{' + s.k + '}=t_1+(' + s.k + '-1)d') + '.'], [(s.k - 1) * s.R, cp + 'no-t1', 'Start from the year-1 salary.']],
      t('t_1=' + F(s.S0)) + ', ' + t('d=' + F(s.R)) + ': ' + t('t_{' + s.k + '}=' + F(s.S0) + '+' + (s.k - 1) + '(' + F(s.R) + ')=' + dollars(v)),
      ['Let ' + t('t_1') + ' be the salary in year 1; each raise adds ' + t('d') + '.', HA[0]], 'salary in year k', { before: t('\\$'), ansTex: dollars(v) });
  };
  Bd.salaryFirst = function (r, cp, s) {
    var m = r.int(s.k + 2, s.k + 10), X = find(function () { return (s.S0 + (m - 1) * s.R) + r.int(1, Math.floor(s.R / 50) - 1) * 50; }, function (X) { return X % 500 === 0 || X % 250 === 0 || true; });
    var q = (X - s.S0) / s.R, n = Math.floor(q) + 2, below = n - 1;
    return numPart('In which year is the salary first more than ' + t(dollars(X)) + '?', n,
      [[below, cp + 'ctx-below', 'In year ' + t(below) + ' the salary is ' + t(dollars(s.S0 + (below - 1) * s.R)) + ', which is not more than ' + t(dollars(X)) + '. Check the year after.'], [n + 1, cp + 'ctx-n', 'Check year ' + t(n) + ': ' + t(F(s.S0) + '+' + (n - 1) + '(' + F(s.R) + ')=' + F(s.S0 + (n - 1) * s.R)) + '.']],
      t(F(s.S0) + '+' + F(s.R) + '(n-1)>' + F(X) + '\\Rightarrow n-1>' + vT(K.roundTo(q, 2)) + (isInt(q * 100) ? '' : '\\ldots')) + ', so ' + t('n-1=' + (n - 1)) + ' and ' + t('n=' + n) + '.<br>Year ' + t(n) + ': ' + t(dollars(s.S0 + (n - 1) * s.R)) + ' (year ' + t(n - 1) + ': ' + t(dollars(s.S0 + (n - 2) * s.R)) + ').',
      ['Write the inequality ' + t('t_1+(n-1)d>' + F(X)) + ' and solve for ' + t('n') + '.', 'Round up to the next natural number, then check the years on both sides.'], 'first year above', { before: 'Year', ansPre: '\\text{Year }', int: true });
  };
  /* L3: row p has a seats, row q has b seats, the last row has L seats -> number of rows */
  Bd.rowsFromTwo = function (r, cp) {
    var s = find(function () { var d = r.int(2, 4), t1 = r.int(14, 32), p = r.int(3, 7), q = p + r.int(5, 10), N = q + r.int(5, 14); return { d: d, t1: t1, p: p, q: q, N: N }; }, function () { return true; });
    var d = s.d, t1 = s.t1, p = s.p, q = s.q, N = s.N, a = t1 + (p - 1) * d, b = t1 + (q - 1) * d, L = t1 + (N - 1) * d;
    return numPart('In a concert hall, each row has the same number of extra seats as the row in front of it. Row ' + t(p) + ' has ' + t(a) + ' seats and row ' + t(q) + ' has ' + t(b) + ' seats. The last row has ' + t(L) + ' seats. How many rows are there?', N,
      [[N - 1, cp + 'nt-plus1', 'Check: with ' + t(N - 1) + ' rows the last row would be ' + t('t_{' + (N - 1) + '}=' + (L - d)) + '. Count the first row too: ' + t('n=\\frac{t_n-t_1}{d}+1') + '.'], [(L - a) / d + 1, cp + 'rows-from-p', 'That counts the rows starting from row ' + t(p) + '. Find the seats in row 1 first.'], [(L - a) / d + p, 'value', 'Find ' + t('t_1') + ' and use ' + t('t_n=t_1+(n-1)d') + '.']],
      t('d=\\frac{' + b + '-' + a + '}{' + q + '-' + p + '}=' + d) + ', ' + t('t_1=' + a + '-' + (p - 1) + '(' + d + ')=' + t1) + '.<br>' + t(L + '=' + t1 + '+' + d + '(n-1)\\Rightarrow n-1=' + (N - 1)) + ', so there are ' + t(N) + ' rows.',
      ['Find ' + t('d') + ' from the two rows, then the seats in row 1.', 'Then solve ' + t(L + '=t_1+(n-1)d') + ' for ' + t('n') + '.'], 'rows from two rows', { before: t('n='), ansPre: 'n=', int: true, unit: 'rows' });
  };
  /* L3: straight-line depreciation from two later years -> first year below X */
  Bd.depYear = function (r, cp) {
    var s = find(function () { var P0 = r.int(60, 160) * 1000, d = r.int(30, 95) * 100, Y0 = r.int(2012, 2020), a = r.int(2, 4), b = a + r.int(3, 6), X = r.int(8, 40) * 1000; return { P0: P0, d: d, Y0: Y0, Y1: Y0 + a, Y2: Y0 + b, X: X }; },
      function (s) { var q = (s.P0 - s.X) / s.d; return !isInt(q) && q > (s.Y2 - s.Y0) + 2 && q < 30 && s.P0 - (Math.floor(q) + 1) * s.d >= 0; });
    var P0 = s.P0, d = s.d, Y0 = s.Y0, Y1 = s.Y1, Y2 = s.Y2, X = s.X, V1 = P0 - (Y1 - Y0) * d, V2 = P0 - (Y2 - Y0) * d, q = (P0 - X) / d, k = Math.floor(q) + 1, Y = Y0 + k;
    var item = r.pick(['A food truck', 'A delivery van', 'A tractor', 'A piece of factory equipment', 'A boat']);
    return numPart(item + ' was bought new in ' + Y0 + '. It loses the same amount of value every year. In ' + Y1 + ' it was worth ' + t(dollars(V1)) + ', and in ' + Y2 + ' it was worth ' + t(dollars(V2)) + '. In what year will it first be worth less than ' + t(dollars(X)) + '?', Y,
      [[Y - 1, cp + 'dep-last', 'In ' + (Y - 1) + ' it is still worth ' + t(dollars(P0 - (k - 1) * d)) + ', which is not less than ' + t(dollars(X)) + '.'], [Y + 1, cp + 'dep-index', 'Careful with the positions: if ' + t('t_1') + ' is the value in ' + Y0 + ', then ' + t('t_n') + ' is the value in the year ' + t(Y0 + '+(n-1)') + '.']],
      Y1 + ' is ' + t('t_{' + (Y1 - Y0 + 1) + '}') + ' and ' + Y2 + ' is ' + t('t_{' + (Y2 - Y0 + 1) + '}') + ' (with ' + t('t_1') + ' the value in ' + Y0 + '): ' + t('d=\\frac{' + F(V2) + '-' + F(V1) + '}{' + (Y2 - Y1) + '}=-' + F(d)) + '.<br>' +
      'Purchase price: ' + t('t_1=' + F(V1) + '+' + (Y1 - Y0) + '(' + F(d) + ')=' + F(P0)) + '.<br>' + t(F(P0) + '-' + F(d) + '(n-1)<' + F(X) + '\\Rightarrow n-1>' + vT(K.roundTo(q, 2))) + (isInt(q * 100) ? '' : '…') + ', so ' + t('n-1=' + k) + ': the year ' + t(Y0 + '+' + k + '=' + Y) + ' (worth ' + t(dollars(P0 - k * d)) + '; in ' + (Y - 1) + ' it is ' + t(dollars(P0 - (k - 1) * d)) + ').',
      ['Number the years: ' + t('t_1') + ' is the value in ' + Y0 + ', so ' + Y1 + ' is ' + t('t_{' + (Y1 - Y0 + 1) + '}') + '. Find ' + t('d') + ' from the two known years.', 'Find the purchase price, then solve ' + t('t_n<' + F(X)) + ' and turn the position back into a year.'], 'depreciation: first year below', { before: 'Year', ansTex: String(Y), int: true });
  };

  /* L4: S_n from the first and last terms */
  Bd.arithSnEnds = function (r, cp) {
    var n = r.int(12, 40), t1 = r.int(-30, 25), tn = r.int(-40, 120);
    var v = cl(n / 2 * (t1 + tn));
    return numPart('An arithmetic series has ' + t(n) + ' terms. Its first term is ' + t(t1) + ' and its last term is ' + t(tn) + '. Determine ' + t('S_{' + n + '}') + '.', v,
      [[n * (t1 + tn), cp + 'sum-half', 'Use ' + t('S_n=\\frac{n}{2}(t_1+t_n)') + ': each pair adds to ' + t('t_1+t_n') + ', and there are ' + t('\\frac{n}{2}') + ' pairs.'], [cl((t1 + tn) / 2), cp + 'sum-term', 'That is the average term. Multiply it by the number of terms.'], [cl(n / 2 * (tn - t1)), 'value', 'Add the first and last terms (don’t subtract): ' + t('S_n=\\frac{n}{2}(t_1+t_n)') + '.']],
      t('S_{' + n + '}=\\frac{' + n + '}{2}(' + t1 + plusT(tn) + ')=' + vT(n / 2) + '(' + (t1 + tn) + ')=' + vT(v)),
      ['When the first and last terms are known: ' + t('S_n=\\dfrac{n}{2}(t_1+t_n)') + '.'], 'arithmetic sum from the ends', { before: t('S_{' + n + '}='), ansPre: 'S_{' + n + '}=' });
  };
  /* L4: S_n from t1, d, n */
  Bd.arithSn = function (r, cp) {
    var t1 = r.chance(0.2) ? r.pick([1.8, 2.5, -4.5, 0.5]) : r.int(-25, 30), d = r.chance(0.2) ? r.pick([0.5, 1.5, 2.5, -1.5]) : r.pick(nz(-8, 9)), n = r.int(15, 40), v = cl(n / 2 * (2 * t1 + (n - 1) * d));
    return numPart('Determine the sum of the first ' + t(n) + ' terms of the arithmetic series ' + t(serT([t1, cl(t1 + d), cl(t1 + 2 * d)])) + '.', v,
      [[cl(n / 2 * (2 * t1 + n * d)), cp + 'sum-n', 'In ' + t('S_n=\\frac{n}{2}[2t_1+(n-1)d]') + ' the bracket has ' + t('(n-1)d') + ': ' + t('(' + n + '-1)d') + '.'], [cl(n * (2 * t1 + (n - 1) * d)), cp + 'sum-half', 'Don’t forget the ' + t('\\frac{n}{2}') + ' in front.'], [cl(t1 + (n - 1) * d), cp + 'sum-term', 'That is ' + t('t_{' + n + '}') + ', the last term. The question asks for the <b>sum</b> of the terms.']],
      t('t_1=' + vT(t1)) + ', ' + t('d=' + vT(d)) + ', ' + t('n=' + n) + '.<br>' + t('S_{' + n + '}=\\frac{' + n + '}{2}\\left[2' + vP(t1) + '+' + (n - 1) + vP(d) + '\\right]=' + vT(n / 2) + '(' + vT(cl(2 * t1 + (n - 1) * d)) + ')=' + vT(v)),
      ['Use ' + t('S_n=\\dfrac{n}{2}\\left[2t_1+(n-1)d\\right]') + '.', 'Find ' + t('d') + ' by subtracting the first term from the second.'], 'arithmetic sum from t1, d', { before: t('S_{' + n + '}='), ansPre: 'S_{' + n + '}=' });
  };
  /* L4: a + ... + L (find n first) */
  Bd.arithSumToL = function (r, cp) {
    var t1 = r.int(-30, 70), d = r.pick(nz(-9, 10).filter(function (x) { return Math.abs(x) >= 2; })), n = r.int(14, 40), L = t1 + (n - 1) * d, v = cl(n / 2 * (t1 + L));
    return numPart('Determine the sum ' + t(serT([t1, t1 + d, t1 + 2 * d], false) + '+\\cdots' + (L < 0 ? '+(' + L + ')' : '+' + L)) + '.', v,
      [[cl((n - 1) / 2 * (t1 + L)), cp + 'sum-count', 'Check the number of terms: ' + t('n=\\frac{t_n-t_1}{d}+1=' + n) + '.'], [cl((n + 1) / 2 * (t1 + L)), cp + 'sum-count', 'Check the number of terms: ' + t('n=\\frac{t_n-t_1}{d}+1') + '.'], [n * (t1 + L), cp + 'sum-half', 'Use ' + t('S_n=\\frac{n}{2}(t_1+t_n)') + ' — don’t forget to halve.']],
      t('t_1=' + t1) + ', ' + t('d=' + d) + ', ' + t('t_n=' + L) + '. Find ' + t('n') + ' first: ' + t(L + '=' + t1 + '+(n-1)(' + d + ')\\Rightarrow n-1=' + (n - 1) + '\\Rightarrow n=' + n) + '.<br>' + t('S_{' + n + '}=\\frac{' + n + '}{2}(' + t1 + plusT(L) + ')=' + vT(v)),
      ['Find the number of terms first with ' + t('t_n=t_1+(n-1)d') + '.', 'Then ' + t('S_n=\\dfrac{n}{2}(t_1+t_n)') + '.'], 'arithmetic sum to a last term', { before: t('S='), ansPre: 'S=' });
  };
  /* L4: S_n = An^2 + Bn -> t_k */
  Bd.snToTk = function (r, cp) {
    var A = r.int(1, 6), Bc = r.pick(nz(-7, 7)), k = r.int(8, 25), Sf = function (n) { return A * n * n + Bc * n; }, v = Sf(k) - Sf(k - 1);
    var ST = A + 'n^{2}' + (Bc === 1 ? '+n' : Bc === -1 ? '-n' : plusT(Bc) + 'n');
    return numPart('The sum of the first ' + t('n') + ' terms of an arithmetic series is ' + t('S_n=' + ST) + '. Determine ' + t('t_{' + k + '}') + '.', v,
      [[Sf(k), cp + 'sn-is-sum', 'That is ' + t('S_{' + k + '}') + ', the sum of the first ' + t(k) + ' terms. One term is the difference of two sums: ' + t('t_{' + k + '}=S_{' + k + '}-S_{' + (k - 1) + '}') + '.'], [Sf(k + 1) - Sf(k), cp + 'sn-next', 'That is ' + t('S_{' + (k + 1) + '}-S_{' + k + '}=t_{' + (k + 1) + '}') + '. Use ' + t('S_{' + k + '}-S_{' + (k - 1) + '}') + '.'], [Sf(k - 1), cp + 'sn-is-sum', 'Subtract: ' + t('t_{' + k + '}=S_{' + k + '}-S_{' + (k - 1) + '}') + '.']],
      t('S_{' + k + '}=' + A + '(' + k + ')^{2}' + plusT(Bc) + '(' + k + ')=' + Sf(k)) + ', ' + t('S_{' + (k - 1) + '}=' + Sf(k - 1)) + '.<br>' + t('t_{' + k + '}=' + Sf(k) + '-' + vP(Sf(k - 1)) + '=' + v) + '. (Check: ' + t('t_1=S_1=' + Sf(1)) + ', ' + t('d=' + 2 * A) + ', ' + t(Sf(1) + '+' + (k - 1) + '(' + 2 * A + ')=' + v) + '.)',
      ['Each partial sum is the one before plus one more term.', t('t_n=S_n-S_{n-1}') + ' (and ' + t('t_1=S_1') + ').'], 'term from a sum formula', { before: t('t_{' + k + '}='), ansPre: 't_{' + k + '}=' });
  };
  /* L4: how many terms give the sum S (a quadratic) */
  Bd.arithNForSum = function (r, cp) {
    var s = find(function () { var a = r.int(2, 18), d = r.int(1, 4) * (r.chance(0.8) ? 1 : 2), n = r.int(10, 26); return { a: a, d: d, n: n }; }, function (s) { var S = s.n * (2 * s.a + (s.n - 1) * s.d) / 2; return isInt(S); });
    var a = s.a, d = s.d, n = s.n, Sv = n * (2 * a + (n - 1) * d) / 2, other = -2 * Sv / (d * n);
    var qa = d, qb = 2 * a - d, qc = -2 * Sv, g = gcd(gcd(qa, qb), qc) || 1;
    return numPart('How many terms of the arithmetic series ' + t(serT([a, a + d, a + 2 * d])) + ' must be added to give a sum of ' + t(F(Sv)) + '?', n,
      [[Math.abs(other), cp + 'quad-root', 'The quadratic has a negative root, ' + t(vT(other)) + ', which is rejected (' + t('n') + ' must be a natural number). Use the positive root.'], [n - 1, cp + 'gn-off1', 'Check: ' + t('S_{' + (n - 1) + '}=' + F((n - 1) * (2 * a + (n - 2) * d) / 2)) + '.'], [n + 1, cp + 'gn-off1', 'Check: ' + t('S_{' + (n + 1) + '}=' + F((n + 1) * (2 * a + n * d) / 2)) + '.']],
      t(F(Sv) + '=\\frac{n}{2}\\left[2(' + a + ')+(n-1)(' + d + ')\\right]=\\frac{n}{2}(' + linT(d, 2 * a - d) + ')') + '<br>' + t(linT(qa / g, 0).replace(/n$/, 'n^{2}') + cT(qb / g, 'n') + plusT(qc / g) + '=0') + '<br>' + t('(n-' + n + ')(' + linT(qa / g, cl(-qc / g / n)) + ')=0') + ', so ' + t('n=' + n) + ' (the negative root is rejected).',
      ['Substitute ' + t('t_1') + ', ' + t('d') + ' and ' + t('S_n') + ' into ' + t('S_n=\\dfrac{n}{2}\\left[2t_1+(n-1)d\\right]') + '. It becomes a quadratic in ' + t('n') + '.', 'Move everything to one side and factor (or use a calculator table of ' + t('S_n') + '). Reject a negative root.'], 'terms needed for a sum', { before: t('n='), ansPre: 'n=', int: true });
  };
  /* L4: rows p and q given, N rows -> total seats */
  Bd.arithTwoTermsSum = function (r, cp) {
    var d = r.int(1, 4), t1 = r.int(12, 30), p = r.int(4, 8), q = p + r.int(6, 10), N = q + r.int(4, 12), a = t1 + (p - 1) * d, b = t1 + (q - 1) * d, tN = t1 + (N - 1) * d, v = N * (t1 + tN) / 2;
    return numPart('The rows of seats in a theatre form an arithmetic sequence. Row ' + t(p) + ' has ' + t(a) + ' seats, row ' + t(q) + ' has ' + t(b) + ' seats, and there are ' + t(N) + ' rows. How many seats are in the theatre?', v,
      [[N * (a + a + (N - 1) * d) / 2, cp + 'a2-t1', 'Row ' + t(p) + ' is not row 1. Find the seats in row 1 first: ' + t('t_1=t_{' + p + '}-' + (p - 1) + 'd') + '.'], [N * (t1 + tN), cp + 'sum-half', 'Halve: ' + t('S_n=\\frac{n}{2}(t_1+t_n)') + '.'], [tN, cp + 'sum-term', 'That is the number of seats in the last row. The question asks for all the seats.']],
      t('d=\\frac{' + b + '-' + a + '}{' + (q - p) + '}=' + d) + ', ' + t('t_1=' + a + '-' + (p - 1) + '(' + d + ')=' + t1) + ', ' + t('t_{' + N + '}=' + t1 + '+' + (N - 1) + '(' + d + ')=' + tN) + '.<br>' + t('S_{' + N + '}=\\frac{' + N + '}{2}(' + t1 + '+' + tN + ')=' + F(v)) + ' seats.',
      ['Find ' + t('d') + ' and the seats in row 1 from the two rows given.', 'All the seats is a sum: ' + t('S_n=\\dfrac{n}{2}(t_1+t_n)') + '.'], 'two rows, total seats', { ansTex: F(v), unit: 'seats', after: 'seats' });
  };
  /* L4/L9: stacked cans: bottom row a, d fewer each row, top row L -> total */
  Bd.cansTotal = function (r, cp) {
    var d = r.int(1, 3), L = r.int(2, 8), n = r.int(8, 18), a = L + (n - 1) * d, v = n * (a + L) / 2;
    return numPart('Cans in a store display are stacked in rows. The bottom row has ' + t(a) + ' cans, each row has ' + t(d) + ' fewer can' + (d > 1 ? 's' : '') + ' than the row below it, and the top row has ' + t(L) + ' cans. How many cans are in the display?', v,
      [[(n - 1) * (a + L) / 2, cp + 'nt-plus1', 'Count the rows again: ' + t('n=\\frac{t_n-t_1}{d}+1') + ' — the bottom row counts too.'], [n * (a + L), cp + 'sum-half', 'Halve: ' + t('S_n=\\frac{n}{2}(t_1+t_n)') + '.'], [n, cp + 'sum-term', 'That is the number of rows. Now add up the cans in all the rows.']],
      t('t_1=' + a) + ', ' + t('d=-' + d) + ', ' + t('t_n=' + L) + ': ' + t(L + '=' + a + '-' + d + '(n-1)\\Rightarrow n=' + n) + ' rows.<br>' + t('S_{' + n + '}=\\frac{' + n + '}{2}(' + a + '+' + L + ')=' + F(v)) + ' cans.',
      ['First find the number of rows with ' + t('t_n=t_1+(n-1)d') + ' (here ' + t('d') + ' is negative).', 'The total is a sum: ' + t('S_n=\\dfrac{n}{2}(t_1+t_n)') + '.'], 'stacked cans', { ansTex: F(v), unit: 'cans', after: 'cans' });
  };

  /* ---------- geometric ---------- */
  var GE = [[3, 2], [5, 2], [-2, 3], [4, 3], [2, 5], [-1, 4], [7, 2], [3, -2], [-5, 2], [2, -3], [1, -4], [6, 3], [-3, 2], [96, 0.5], [160, 0.5], [243, 1 / 3], [-128, 0.5], [256, 0.25], [64, -0.5], [162, -1 / 3], [48, 0.5]];
  var HG = ['Geometric: ' + t('t_n=t_1r^{n-1}') + ' — the exponent on ' + t('r') + ' is one less than the position.'];
  function rTex(rv) { return vT(rv, true); }
  /* L5: r of a geometric sequence */
  Bd.geoR = function (r, cp, s) {
    var t1 = s.t1, rv = s.r, a = [t1, cl(t1 * rv), cl(t1 * rv * rv)];
    return numPart('State the common ratio ' + t('r') + '.', rv,
      [[cl(1 / rv), cp + 'r-flip', 'Divide each term by the term <b>before</b> it: ' + t('r=\\frac{t_2}{t_1}') + '.'], [cl(a[1] - a[0]), cp + 'r-diff', 'That is a difference. A geometric sequence multiplies: ' + t('r=\\frac{t_2}{t_1}') + '.'], [-rv, cp + 'r-sign', 'Check the signs of the terms: ' + (rv < 0 ? 'they alternate, so ' + t('r') + ' is negative.' : 'they don’t alternate, so ' + t('r') + ' is positive.')]],
      t('r=\\frac{t_2}{t_1}=\\frac{' + vT(a[1]) + '}{' + vT(a[0]) + '}=' + rTex(rv)) + ' (and ' + t('\\frac{t_3}{t_2}=' + rTex(rv)) + ').', ['Divide any term by the one before it.'], 'common ratio', { before: t('r='), ansPre: 'r=', ansTex: rTex(rv) });
  };
  Bd.geoShared = function (r) { var g = r.pick(GE); return { t1: g[0] * (Math.abs(g[0]) > 40 ? r.pick([1, -1]) : r.pick([1, 2, 3, -1])), r: g[1] }; };
  Bd.geoStem = function (s) { return 'Consider the geometric sequence ' + t(seqT([s.t1, cl(s.t1 * s.r), cl(s.t1 * s.r * s.r), cl(s.t1 * s.r * s.r * s.r)])) + '.'; };
  /* L5: the general term of a geometric sequence (s: {t1, r}); prompt prefix optional */
  Bd.geoGT = function (r, cp, s, withSeq) {
    var t1 = s.t1, rv = s.r, f = function (n) { return t1 * Math.pow(rv, n - 1); };
    var a = [t1, cl(t1 * rv), cl(t1 * rv * rv), cl(t1 * rv * rv * rv)], key = geoT(t1, rv);
    return termPart((withSeq ? 'Write the general term of the geometric sequence ' + t(seqT(a)) + '.' : 'Write the general term ' + t('t_n') + '.'), key, f,
      { geo: true, dl: [[function (n) { return t1 * Math.pow(rv, n); }, cp + 'rn', 'Check ' + t('t_1') + ': your formula gives ' + t(vT(cl(t1 * rv))) + '. The exponent is ' + t('n-1') + ', not ' + t('n') + '.', vT(t1, true) + '(' + rTex(rv) + ')^{n}'],
        [function (n) { return Math.pow(t1 * rv, n - 1); }, cp + 'mult-first', 'Don’t multiply ' + t('t_1') + ' by ' + t('r') + ' first: the exponent applies only to ' + t('r') + '. Your formula gives ' + t('t_1=1') + '.', '(' + vT(cl(t1 * rv)) + ')^{n-1}'],
        [function (n) { return rv * Math.pow(t1, n - 1); }, cp + 'g-swap', 'In ' + t('t_n=t_1r^{n-1}') + ', ' + t('t_1') + ' is in front and ' + t('r') + ' is raised to the power.', null],
        [function (n) { return t1 + (n - 1) * (a[1] - a[0]); }, cp + 'g-arith', 'This sequence is geometric (it multiplies), so use ' + t('t_n=t_1r^{n-1}') + '.', linT(cl(a[1] - a[0]), cl(2 * t1 - a[1]))]] },
      t('t_1=' + vT(t1)) + ', ' + t('r=\\frac{' + vT(a[1]) + '}{' + vT(a[0]) + '}=' + rTex(rv)) + '.<br>' + t('t_n=' + key),
      HG.concat(['Leave it in the form ' + t('t_1r^{n-1}') + ' (do not multiply ' + t('t_1') + ' and ' + t('r') + ').']), 'geometric general term');
  };
  /* L5: exact value of t_k */
  Bd.geoTk = function (r, cp) {
    var g = r.pick([[160, [1, 2]], [96, [1, 2]], [4, [3, 1]], [2, [-3, 1]], [3, [2, 1]], [-5, [2, 1]], [1, [-2, 1]], [243, [1, 3]], [5, [-2, 1]], [7, [3, 1]], [64, [-1, 2]], [2, [3, 1]], [[2, 3], [-3, 1]], [[1, 2], [2, 1]]]);
    var t1 = Array.isArray(g[0]) ? g[0] : [g[0], 1], rr = g[1], k = r.int(7, Math.abs(rr[0]) >= 3 ? 10 : 13), tk = Q.mul(t1, Q.pow(rr, k - 1)), val = Q.v(tk);
    var a = [0, 1, 2].map(function (i) { return Q.v(Q.mul(t1, Q.pow(rr, i))); });
    var wrongN = Q.v(Q.mul(t1, Q.pow(rr, k))), negp = rr[0] < 0 ? -Math.abs(val) * Math.sign(t1[0]) : null;
    return numPart('Determine the exact value of ' + t('t_{' + k + '}') + ' for the geometric sequence ' + t(a.map(function (x) { return vT(x, true); }).join(',\\ ') + ',\\ \\dots') + '.', val,
      [[wrongN, cp + 'rn', 'The exponent on ' + t('r') + ' is one less than the position: ' + t('t_{' + k + '}=t_1r^{' + (k - 1) + '}') + '.'], [Q.v(Q.mul(t1, Q.pow(rr, k - 2))), cp + 'rn', 'Check the exponent: ' + t('t_{' + k + '}=t_1r^{' + k + '-1}') + '.'], negp != null && !near(negp, val) ? [negp, cp + 'g-negpow', 'Keep the negative ratio in brackets: ' + t('(' + Q.t(rr) + ')^{' + (k - 1) + '}') + (k % 2 ? ' is positive' : ' is negative') + '.'] : null],
      t('r=' + Q.t(rr)) + ': ' + t('t_{' + k + '}=' + Q.t(t1) + '\\left(' + Q.t(rr) + '\\right)^{' + (k - 1) + '}=' + Q.t(t1) + '\\left(' + Q.t(Q.pow(rr, k - 1)) + '\\right)=' + Q.t(tk)),
      HG.concat(['Give the exact value: a whole number or a fraction (no rounding).']), 'geometric term, exact', { before: t('t_{' + k + '}='), ansPre: 't_{' + k + '}=', ansTex: Q.t(tk) });
  };
  /* L5: number of terms of a finite geometric sequence */
  Bd.geoNumTerms = function (r, cp) {
    var g = r.pick([[5, 3], [3, 2], [-3, -2], [2, 3], [4, 2], [7, 2], [2, -3], [4096, 0.25], [1215, 1 / 3], [-2, 2], [0.75, 2], [1 / 16, 2], [6, 4], [3, 5], [1458, 1 / 3], [640, 0.5]]);
    var t1 = g[0], rv = g[1], maxN = Math.abs(rv) >= 4 ? 7 : Math.abs(rv) === 3 || Math.abs(rv) === 1 / 3 ? 9 : 13, n = r.int(6, maxN), L = cl(t1 * Math.pow(rv, n - 1));
    var a = [t1, cl(t1 * rv), cl(t1 * rv * rv)].map(function (x) { return vT(x, true); });
    return numPart('How many terms are in the geometric sequence ' + t(a.join(',\\ ') + ',\\ \\dots,\\ ' + vT(L, true)) + '?', n,
      [[n - 1, cp + 'gn-off1', 'Your answer is the exponent ' + t('n-1') + '. The number of terms is one more: ' + t('n') + '.'], [n + 1, cp + 'gn-off1', 'Check: ' + t('t_n=t_1r^{n-1}') + ' should give the last term.']],
      t('t_1=' + vT(t1, true)) + ', ' + t('r=' + rTex(rv)) + ': ' + t(vT(t1, true) + '\\left(' + rTex(rv) + '\\right)^{n-1}=' + vT(L, true)) + '<br>' + t('\\left(' + rTex(rv) + '\\right)^{n-1}=' + vT(cl(Math.pow(rv, n - 1)), true) + '=\\left(' + rTex(rv) + '\\right)^{' + (n - 1) + '}') + ', so ' + t('n-1=' + (n - 1)) + ' and ' + t('n=' + n) + '.',
      ['Set ' + t('t_1r^{n-1}') + ' equal to the last term and divide both sides by ' + t('t_1') + '.', 'Write both sides as powers of ' + t('r') + ' (or use a calculator table) and compare exponents.'], 'geometric number of terms', { before: t('n='), ansPre: 'n=', int: true });
  };
  /* L5: two terms with an odd gap -> general term */
  Bd.geoGTFromTwo = function (r, cp) {
    var g = r.pick([[2, -3], [5, 2], [3, 2], [-2, 3], [320, 0.5], [4, -2], [1, 3], [-3, -2], [7, 2], [2, 3], [1458, 1 / 3], [256, -0.5]]);
    var t1 = g[0] * (Math.abs(g[0]) > 40 ? r.pick([1, -1]) : r.pick([1, 2, -1])), rv = g[1], p = r.int(2, 3), q = p + 3, tp = cl(t1 * Math.pow(rv, p - 1)), tq = cl(t1 * Math.pow(rv, q - 1)), f = function (n) { return t1 * Math.pow(rv, n - 1); }, key = geoT(t1, rv);
    return termPart('In a geometric sequence, ' + t('t_{' + p + '}=' + vT(tp, true)) + ' and ' + t('t_{' + q + '}=' + vT(tq, true)) + '. Determine the general term.', key, f,
      { geo: true, dl: [[function (n) { return tp * Math.pow(rv, n - 1); }, cp + 'g2-t1', t('t_{' + p + '}') + ' is not the first term: ' + t('t_1=\\frac{t_{' + p + '}}{r^{' + (p - 1) + '}}') + '.', vT(tp, true) + '(' + rTex(rv) + ')^{n-1}'],
        [function (n) { return t1 * Math.pow(rv, n); }, cp + 'rn', 'The exponent is ' + t('n-1') + ': check that your formula gives ' + t('t_{' + p + '}=' + vT(tp, true)) + '.', null],
        [function (n) { return (tp / Math.pow(tq / tp, p - 1)) * Math.pow(tq / tp, n - 1); }, cp + 'g-noroot', 'Dividing the terms gives ' + t('r^{3}=' + vT(cl(tq / tp), true)) + ', so take the <b>cube root</b> to find ' + t('r') + '.', null]] },
      t('\\frac{t_1r^{' + (q - 1) + '}}{t_1r^{' + (p - 1) + '}}=\\frac{' + vT(tq, true) + '}{' + vT(tp, true) + '}\\Rightarrow r^{3}=' + vT(cl(Math.pow(rv, 3)), true) + '\\Rightarrow r=' + rTex(rv)) + '<br>' + t('t_1\\left(' + rTex(rv) + '\\right)' + (p === 2 ? '' : '^{' + (p - 1) + '}') + '=' + vT(tp, true) + '\\Rightarrow t_1=' + vT(t1, true)) + ', so ' + t('t_n=' + key) + '.',
      ['Write both terms with ' + t('t_n=t_1r^{n-1}') + ' and divide them: ' + t('t_1') + ' cancels, leaving a power of ' + t('r') + '.', 'Then substitute ' + t('r') + ' back to find ' + t('t_1') + '.'], 'geometric general term from two terms');
  };
  /* L5: even gap -> the two possible values of t_k (either order) */
  Bd.geoTwoValues = function (r, cp) {
    var s = find(function () { var m = r.pick([2, 3, 5, 0.5, 4, 1 / 3]), tp = r.pick(nz(-12, 12)) * (m < 1 ? 81 : 1), p = r.int(2, 4), gap = r.pick([2, 2, 4]), k = p + gap + r.pick([1, 3]); return { m: m, tp: tp, p: p, q: p + gap, k: k }; },
      function (s) { var v = Math.abs(s.tp * Math.pow(s.m, s.k - s.p)); return Math.abs(s.tp * Math.pow(s.m, s.q - s.p)) < 1e6 && v < 1e7 && (isInt(v) || isInt(v * 81)); });
    var m = s.m, tp = s.tp, p = s.p, q = s.q, k = s.k, tq = cl(tp * Math.pow(m, q - p)), v = cl(tp * Math.pow(m, k - p)), gap = q - p;
    var c1 = numChk(v, []), c2 = numChk(-v, []);
    var p0 = boxesPart('In a geometric sequence, ' + t('t_{' + p + '}=' + vT(tp, true)) + ' and ' + t('t_{' + q + '}=' + vT(tq, true)) + '. Determine the <b>two</b> possible values of ' + t('t_{' + k + '}') + '.',
      [{ name: 'One value', label: '', before: t('t_{' + k + '}='), check: c1, key: kT(v) }, { name: 'The other value', label: 'or', before: t('t_{' + k + '}='), check: c2, key: kT(-v) }],
      t('t_{' + k + '}=' + vT(v, true)) + ' or ' + t('t_{' + k + '}=' + vT(-v, true)),
      t('\\frac{t_{' + q + '}}{t_{' + p + '}}=r^{' + gap + '}=' + vT(cl(Math.pow(m, gap)), true)) + ', an even power, so ' + t('r=' + rTex(m)) + ' or ' + t('r=-' + rTex(m)) + '.<br>' + t('t_{' + k + '}=t_{' + p + '}r^{' + (k - p) + '}') + ': ' + t(vT(tp, true) + '\\left(' + rTex(m) + '\\right)^{' + (k - p) + '}=' + vT(v, true)) + ' or ' + t(vT(tp, true) + '\\left(-' + rTex(m) + '\\right)^{' + (k - p) + '}=' + vT(-v, true)) + '.',
      ['Divide the two terms: ' + t('\\frac{t_{' + q + '}}{t_{' + p + '}}=r^{' + gap + '}') + '. An even power has two real roots.', 'From ' + t('t_{' + p + '}') + ' to ' + t('t_{' + k + '}') + ' is ' + t(k - p) + ' steps of ' + t('r') + ': ' + t('t_{' + k + '}=t_{' + p + '}r^{' + (k - p) + '}') + '.'], 'two possible terms', cp, { anyOrder: true });
    var inner = p0.check;
    p0.check = function (resp) {
      resp = resp || []; var a = readNum(resp[0]), b = readNum(resp[1]);
      if (a.v != null && b.v != null && near(Math.abs(a.v), Math.abs(v)) && near(a.v, b.v)) return wrong(cp + 'g-one-sign', 'You gave the same value twice. With ' + t('r=' + rTex(m)) + ' and ' + t('r=-' + rTex(m)) + ', the two values of ' + t('t_{' + k + '}') + ' have opposite signs.');
      if ((a.v != null && near(Math.abs(a.v), Math.abs(v)) && (b.none || b.res && b.res.code === 'empty')) || (b.v != null && near(Math.abs(b.v), Math.abs(v)) && (a.none || a.res && a.res.code === 'empty'))) return wrong(cp + 'g-one-sign', t('r^{' + gap + '}=' + vT(cl(Math.pow(m, gap)), true)) + ' has two real roots, ' + t('\\pm' + rTex(m)) + ': there is a second value.');
      return inner(resp);
    };
    p0.bad = [[kT(v), kT(v)], [kT(v), 'none'], [kT(cl(tp * Math.pow(m, k - p + 1))), kT(-cl(tp * Math.pow(m, k - p + 1)))]];
    p0.good = [[kT(-v), kT(v)]];
    return p0;
  };
  /* L5: three expressions x+a, x+b, x+c consecutive geometric -> x and r */
  Bd.exprGeo = function (r, cp) {
    var s = find(function () { var x = r.pick(nz(-6, 12)), T1 = r.pick(nz(-6, 8)), rv = r.pick([2, 3, -2, 2, 3]), T = [T1, T1 * rv, T1 * rv * rv]; return { x: x, T: T, rv: rv, a: T.map(function (v) { return v - x; }) }; },
      function (s) { return s.a.every(function (v) { return v !== 0 && Math.abs(v) <= 30; }) && Math.abs(s.T[0]) >= 1; });
    var x = s.x, T = s.T, rv = s.rv, a = s.a, E = a.map(function (v) { return 'x' + plusT(v); });
    var lin = 2 * a[1] - a[0] - a[2], cst = a[1] * a[1] - a[0] * a[2];
    var xC = numChk(x, []), rC = numChk(rv, [[cl(1 / rv), cp + 'r-flip', t('r=\\frac{t_2}{t_1}') + ': divide by the term before.'], [T[1] - T[0], cp + 'r-diff', 'That is a difference: ' + t('r=\\frac{t_2}{t_1}') + '.'], [x, cp + 'x-as-d', 'That is ' + t('x') + '. Find the terms, then divide.']]);
    var p = boxesPart('The expressions ' + t(E[0]) + ', ' + t(E[1]) + ' and ' + t(E[2]) + ' are consecutive terms of a geometric sequence. Determine the value of ' + t('x') + ' and the common ratio.',
      [{ name: 'x', before: t('x='), check: xC, key: String(x) }, { name: 'Common ratio', before: t('r='), check: rC, key: String(rv) }],
      t('x=' + x) + ', ' + t('r=' + rv) + ' (terms ' + t(seqT(T, false)) + ')',
      'The ratios are equal, so ' + t('b^{2}=ac') + ': ' + t('(' + E[1] + ')^{2}=(' + E[0] + ')(' + E[2] + ')') + '<br>' + t('x^{2}' + cT(2 * a[1], 'x') + plusT(a[1] * a[1]) + '=x^{2}' + cT(a[0] + a[2], 'x') + plusT(a[0] * a[2])) + '<br>' + t(linT(lin, 0, 'x') + '=' + (-cst)) + ', so ' + t('x=' + x) + '. Terms: ' + t(seqT(T, false)) + ', ' + t('r=' + rv) + '.',
      ['Consecutive geometric terms ' + t('a,\\ b,\\ c') + ' have equal ratios: ' + t('\\frac{b}{a}=\\frac{c}{b}') + ', so ' + t('b^{2}=ac') + '.', 'Expand both sides: the ' + t('x^{2}') + ' terms cancel and a linear equation is left.'], 'three expressions, geometric', cp);
    p.bad = [[String(x), String(T[1] - T[0])], [String(-x), String(rv)]];
    return p;
  };
  /* L9: two terms (gap 3) -> t1 to the nearest tenth */
  Bd.geoT1Round = function (r, cp) {
    var s = find(function () { var rv = r.pick([1.5, 2.5, 1.2, 0.5, -1.5, 0.8]), p = r.int(3, 4), tp = r.int(6, 40); return { rv: rv, p: p, tp: tp }; }, function (s) { var t1 = s.tp / Math.pow(s.rv, s.p - 1); return !isInt(K.roundTo(t1, 4)); });
    var rv = s.rv, p = s.p, q = p + 3, tp = s.tp, tq = cl(tp * Math.pow(rv, 3)), t1 = tp / Math.pow(rv, p - 1);
    return apxPart('In a geometric sequence, ' + t('t_{' + p + '}=' + vT(tp)) + ' and ' + t('t_{' + q + '}=' + vT(tq)) + '. Determine the first term, to the nearest tenth.', t1, 1,
      [[tp / Math.pow(rv, p), cp + 'g2-t1', 'From ' + t('t_1') + ' to ' + t('t_{' + p + '}') + ' is ' + t(p - 1) + ' steps: ' + t('t_1=\\frac{t_{' + p + '}}{r^{' + (p - 1) + '}}') + '.'], [tp / Math.pow(rv, p - 2), cp + 'g2-t1', 'Check the exponent: ' + t('t_{' + p + '}=t_1r^{' + (p - 1) + '}') + '.'], [tp / Math.pow(tq / tp, p - 1), cp + 'g-noroot', 'Dividing gives ' + t('r^{3}') + ' — take the cube root to find ' + t('r') + '.']],
      t('r^{3}=\\frac{' + vT(tq) + '}{' + vT(tp) + '}=' + vT(cl(Math.pow(rv, 3))) + '\\Rightarrow r=' + vT(rv)) + '<br>' + t('t_1=\\frac{' + vT(tp) + '}{' + vP(rv) + '^{' + (p - 1) + '}}\\approx ' + vT(K.roundTo(t1, 1))),
      ['Divide the two terms: the gap is 3 steps, so you get ' + t('r^{3}') + '.', t('t_1=\\dfrac{t_{' + p + '}}{r^{' + (p - 1) + '}}') + '.'], 'geometric first term, rounded', { before: t('t_1=') });
  };

  /* L6: growth factor. o.kind: 'up' | 'down' | 'any' */
  Bd.gfactor = function (r, cp, o) {
    o = o || {}; var kind = o.kind || r.pick(['up', 'down', 'rebound', 'frac']), pr, ans, alts, sol, what;
    if (kind === 'any') kind = r.pick(['up', 'down', 'rebound', 'frac']);
    if (kind === 'up') {
      var pu = r.pick([1.5, 2.5, 2.75, 3.2, 4.5, 6, 7, 8, 12, 15, 0.8]), wu = r.pick(['A town’s population grows by ' + pu + '\\% per year.', 'A salary increases by ' + pu + '\\% per year.', 'A herd of elk grows by ' + pu + '\\% each year.', 'An investment earns ' + pu + '\\% per year, compounded annually.']);
      what = wu; ans = cl(1 + pu / 100);
      alts = [[pu / 100, cp + 'gf-rate', 'The quantity keeps all of itself (1) and gains ' + t(pu + '\\%') + ': ' + t('r=1+' + vT(pu / 100)) + '.'], [cl(1 - pu / 100), cp + 'gf-sign', 'It <b>increases</b>, so ' + t('r') + ' is greater than 1: ' + t('r=1+' + vT(pu / 100)) + '.'], [pu, cp + 'gf-pct', 'Write the factor as a decimal: ' + t(pu + '\\%=' + vT(pu / 100)) + ', so ' + t('r=1+' + vT(pu / 100)) + '.'], [cl(100 + pu), cp + 'gf-pct', 'As a decimal, not a percent: ' + t('r=1+' + vT(pu / 100)) + '.']];
      sol = t('r=1+\\frac{' + pu + '}{100}=1+' + vT(pu / 100) + '=' + vT(ans));
    } else if (kind === 'down') {
      var pd = r.pick([3, 4, 5, 8, 12, 13, 15, 17, 18, 22, 25, 28, 35, 2.5]), wd = r.pick(['A car depreciates by ' + pd + '\\% per year.', 'A laptop loses ' + pd + '\\% of its value each year.', 'A magazine loses ' + pd + '\\% of its subscribers each year.', 'Each pass through a filter removes ' + pd + '\\% of the contaminant that is left.']);
      what = wd; ans = cl(1 - pd / 100);
      alts = [[pd / 100, cp + 'gf-rate', 'That is the part that is <b>lost</b>. Each period it keeps ' + t('1-' + vT(pd / 100)) + '.'], [cl(1 + pd / 100), cp + 'gf-sign', 'It <b>decreases</b>, so ' + t('r') + ' is between 0 and 1: ' + t('r=1-' + vT(pd / 100)) + '.'], [100 - pd, cp + 'gf-pct', 'Write the factor as a decimal, not a percent.'], [-pd / 100, cp + 'gf-sign', 'A growth factor is positive: it keeps ' + t('1-' + vT(pd / 100)) + ' of the value.']];
      sol = t('r=1-\\frac{' + pd + '}{100}=1-' + vT(pd / 100) + '=' + vT(ans));
    } else if (kind === 'rebound') {
      var pf = r.pick([55, 60, 65, 70, 75, 80, 85, 45]);
      what = r.pick(['A ball rebounds to ' + pf + '\\% of its previous height on each bounce.', 'Each swing of a pendulum is ' + pf + '\\% as long as the swing before.']); ans = pf / 100;
      alts = [[cl(1 - pf / 100), cp + 'keep-lose', 'It <b>keeps</b> ' + t(pf + '\\%') + ' each time, so ' + t('r=' + vT(pf / 100)) + '.'], [cl(1 + pf / 100), cp + 'gf-sign', 'It gets smaller, so ' + t('r<1') + '.'], [pf, cp + 'gf-pct', 'As a decimal: ' + t(pf + '\\%=' + vT(pf / 100)) + '.']];
      sol = t('r=' + pf + '\\%=' + vT(ans)) + ' (it keeps ' + t(pf + '\\%') + ' of the height each time).';
    } else {
      var fr = r.pick([[1, 3], [1, 4], [1, 5], [2, 5], [1, 8], [3, 10]]), lose = r.chance(0.6), keep = Q.n(fr[1] - fr[0], fr[1]), word = { '1/3': 'one-third', '1/4': 'one-quarter', '1/5': 'one-fifth', '2/5': 'two-fifths', '1/8': 'one-eighth', '3/10': 'three-tenths' }[fr[0] + '/' + fr[1]];
      what = lose ? r.pick(['An object loses ' + word + ' of its temperature above room temperature each minute.', 'A swing’s arc gets shorter by ' + word + ' with each swing.', 'A tank loses ' + word + ' of the water left in it each hour.']) : 'A ball rebounds to ' + t(Q.t(keep)) + ' of its previous height.';
      ans = Q.v(keep);
      alts = [[fr[0] / fr[1], cp + 'keep-lose', 'Losing ' + t(Q.t(fr)) + ' means it <b>keeps</b> ' + t('1-' + Q.t(fr) + '=' + Q.t(keep)) + '.'], [cl(1 + fr[0] / fr[1]), cp + 'gf-sign', 'It gets smaller each time, so ' + t('r<1') + '.']];
      sol = lose ? 'It loses ' + t(Q.t(fr)) + ', so it keeps ' + t('1-' + Q.t(fr) + '=' + Q.t(keep)) + ': ' + t('r=' + Q.t(keep)) + '.' : t('r=' + Q.t(keep)) + ' (the fraction it keeps).';
      if (!lose) alts = [[fr[0] / fr[1], cp + 'keep-lose', 'It keeps ' + t(Q.t(keep)) + ' of its height, so ' + t('r=' + Q.t(keep)) + '.']];
    }
    return numPart(what.replace(/(\d+(\.\d+)?)\\%/g, function (m0) { return t(m0); }) + ' State the growth factor ' + t('r') + '.', ans, alts, sol,
      ['Increase by ' + t('p\\%') + ': ' + t('r=1+\\frac{p}{100}') + '. Decrease by ' + t('p\\%') + ': ' + t('r=1-\\frac{p}{100}') + '.', 'The growth factor is the part that is <b>kept</b> each period (as a decimal or a fraction).'], 'growth factor: ' + kind, { before: t('r='), ansPre: 'r=', ansTex: kind === 'frac' ? Q.t(keep) : vT(ans) });
  };
  /* L6: compound interest, value after n years (nearest cent) */
  Bd.compound = function (r, cp) {
    var Pp = r.int(20, 95) * 100, i = r.pick([2.5, 2.9, 3.25, 3.8, 4, 4.25, 4.5, 5.5, 6, 3.6]), n = r.int(5, 15), v = Pp * Math.pow(1 + i / 100, n), who = r.pick(['Lena', 'Raj', 'Mei', 'Owen', 'Sofia', 'Kai']);
    return apxPart(who + ' invests ' + t(dollars(Pp)) + ' at ' + t(i + '\\%') + ' per year, compounded annually. Determine the value of the investment after ' + t(n) + ' years, to the nearest cent.', v, 2,
      [[Pp * Math.pow(1 + i / 100, n - 1), cp + 'ci-n1', 'After ' + t(n) + ' years the principal has been multiplied by ' + t(vT(1 + i / 100)) + ' ' + t(n) + ' times: ' + t('A=P(1+i)^{' + n + '}') + '.'], [Pp * Math.pow(1 + i / 100, n + 1), cp + 'ci-n1', 'Use ' + t('A=P(1+i)^{n}') + ' with ' + t('n=' + n) + '.'], [Pp * (1 + n * i / 100), cp + 'ci-simple', 'Compound interest is paid on the growing balance, so multiply by ' + t('1+i') + ' each year: ' + t('A=P(1+i)^{n}') + '.'], [Pp * Math.pow(1 + i, n), 'value', 'Write the rate as a decimal: ' + t(i + '\\%=' + vT(i / 100)) + '.']],
      t('r=1+' + vT(i / 100) + '=' + vT(1 + i / 100)) + '<br>' + t('A=' + F(Pp) + '(' + vT(1 + i / 100) + ')^{' + n + '}\\approx ' + money(v)),
      ['Compound interest: ' + t('A=P(1+i)^{n}') + ', with ' + t('i') + ' as a decimal.', 'Keep the unrounded value in your calculator and round only at the end.'], 'compound interest', { before: t('\\$'), money: true });
  };
  /* L6: depreciation by a percent, value after n years (nearest dollar) */
  Bd.decayValue = function (r, cp) {
    var Pp = r.int(12, 60) * 1000, pd = r.pick([8, 12, 13, 15, 17, 18, 20, 22, 25]), n = r.int(4, 10), rr = 1 - pd / 100, v = Pp * Math.pow(rr, n), item = r.pick(['A snowmobile', 'A car', 'A motorcycle', 'A boat', 'A truck']);
    return apxPart(item + ' is worth ' + t(dollars(Pp)) + ' when it is bought. It depreciates by ' + t(pd + '\\%') + ' per year. What is it worth ' + t(n) + ' years after it is bought, to the nearest dollar?', v, 0,
      [[Pp * Math.pow(rr, n - 1), cp + 'ci-n1', t(dollars(Pp)) + ' is the value at time 0, so after ' + t(n) + ' years it has been multiplied by ' + t(vT(rr)) + ' ' + t(n) + ' times.'], [Pp * Math.pow(pd / 100, n), cp + 'keep-lose', 'Each year it <b>keeps</b> ' + t((100 - pd) + '\\%') + ' of its value: ' + t('r=' + vT(rr)) + '.'], [Pp * (1 - n * pd / 100), cp + 'ci-simple', 'It loses ' + t(pd + '\\%') + ' of its <b>current</b> value each year, so multiply by ' + t(vT(rr)) + ' each year.'], [Pp * Math.pow(1 + pd / 100, n), cp + 'gf-sign', 'It loses value, so ' + t('r=1-' + vT(pd / 100)) + '.']],
      t('r=1-' + vT(pd / 100) + '=' + vT(rr)) + '. Value after ' + t(n) + ' years: ' + t(F(Pp) + '(' + vT(rr) + ')^{' + n + '}\\approx \\$' + F(Math.round(v))),
      ['Value after ' + t('n') + ' periods ' + t('=Pr^{n}') + ', where ' + t('P') + ' is the value at time 0.', 'Decrease by ' + t('p\\%') + ': ' + t('r=1-\\frac{p}{100}') + '.'], 'depreciation value', { before: t('\\$'), money: true });
  };
  /* L6: ball height of the kth bounce (nearest cm) */
  Bd.bounceK = function (r, cp) {
    var h = r.pick([8, 9, 10, 12, 15, 16, 18, 20, 25]), pf = r.pick([55, 60, 65, 70, 75, 80, 85]), k = r.int(4, 8), rr = pf / 100, v = h * Math.pow(rr, k);
    return apxPart('A ball is dropped from a height of ' + t(h) + ' m. Each bounce reaches ' + t(pf + '\\%') + ' of the height of the bounce before. Determine the height of the ' + ord(k) + ' bounce, in metres, to the nearest centimetre.', v, 2,
      [[h * Math.pow(rr, k - 1), cp + 'bounce-pos', 'The first bounce is already ' + t(vT(h) + '(' + vT(rr) + ')') + ', so the ' + ord(k) + ' bounce is ' + t(vT(h) + '(' + vT(rr) + ')^{' + k + '}') + ' (with ' + t('t_1=' + h) + ' it is ' + t('t_{' + (k + 1) + '}') + ').'], [h * Math.pow(1 - rr, k), cp + 'keep-lose', 'Each bounce keeps ' + t(pf + '\\%') + ' of the height: ' + t('r=' + vT(rr)) + '.'], [h * Math.pow(rr, k + 1), cp + 'bounce-pos', 'Count again: after ' + t(k) + ' bounces the height has been multiplied by ' + t(vT(rr)) + ' ' + t(k) + ' times.']],
      t('r=' + vT(rr)) + '. With ' + t('t_1=' + h) + ' (the drop, no bounces yet), the ' + ord(k) + ' bounce is ' + t('t_{' + (k + 1) + '}') + ':<br>' + t('t_{' + (k + 1) + '}=' + h + '(' + vT(rr) + ')^{' + k + '}\\approx ' + vT(K.roundTo(v, 2))) + ' m.',
      ['The height of the ' + ord(k) + ' bounce is the drop height times ' + t('r') + ', ' + t(k) + ' times.', 'If ' + t('t_1') + ' is the drop height, the ' + t('k') + 'th bounce is ' + t('t_{k+1}') + '.'], 'bounce height', { after: 'm' });
  };
  function ord(k) { return k + (k % 100 >= 11 && k % 100 <= 13 ? 'th' : k % 10 === 1 ? 'st' : k % 10 === 2 ? 'nd' : k % 10 === 3 ? 'rd' : 'th'); }
  S.ord = ord;
  /* L6: doubling or half-life with a period */
  Bd.halfLife = function (r, cp) {
    if (r.chance(0.5)) {
      var N0 = r.pick([40, 50, 75, 120, 150, 200, 250, 300]), T = r.pick([15, 20, 30, 40]), H = r.pick([2, 3, 4, 5]) * (T === 40 ? 2 : 1), n = H * 60 / T, v = N0 * Math.pow(2, n);
      if (!isInt(n) || n > 14) { T = 30; H = 3; n = 6; v = N0 * 64; }
      return numPart('A culture starts with ' + t(N0) + ' bacteria, and the number doubles every ' + t(T) + ' minutes. How many bacteria are there after ' + t(H) + ' hours?', v,
        [[N0 * Math.pow(2, H), cp + 'hl-periods', 'Count the doublings: ' + t(H) + ' hours is ' + t(H * 60) + ' minutes, which is ' + t('\\frac{' + H * 60 + '}{' + T + '}=' + n) + ' doubling periods.'], [N0 * 2 * n, cp + 'hl-linear', 'Doubling ' + t(n) + ' times multiplies by ' + t('2^{' + n + '}') + ', not by ' + t('2\\times ' + n) + '.'], [N0 * Math.pow(2, n - 1), cp + 'ci-n1', t(N0) + ' is the amount at time 0: after ' + t(n) + ' doublings it is ' + t(N0 + '(2)^{' + n + '}') + '.']],
        t(H) + ' h ' + t('=' + H * 60) + ' min, so ' + t('n=\\frac{' + H * 60 + '}{' + T + '}=' + n) + ' doublings.<br>' + t(N0 + '(2)^{' + n + '}=' + N0 + '(' + F(Math.pow(2, n)) + ')=' + F(v)) + ' bacteria.',
        ['Number of periods ' + t('=\\dfrac{\\text{total time}}{\\text{length of one period}}') + ' (in the same units).', 'Amount ' + t('=Pr^{n}') + ' with ' + t('r=2') + '.'], 'doubling', { ansTex: F(v) });
    }
    var A0 = r.pick([64, 80, 96, 120, 160, 200, 240, 320]), hl = r.pick([5, 6, 8, 12]), np = r.int(3, 8), tot = hl * np, inDays = tot % 24 === 0 && r.chance(0.6), A = A0 * Math.pow(0.5, np);
    var tt = inDays ? t(tot / 24) + ' day' + (tot / 24 > 1 ? 's' : '') : t(tot) + ' hours', iso = r.pick(['a medical isotope', 'a radioactive tracer', 'iodine-131 (in a lab model)']);
    return numPart('A hospital receives ' + t(A0) + ' mg of ' + iso + ' whose half-life is ' + t(hl) + ' hours. How much is left after ' + tt + '?', A,
      [[A0 * Math.pow(0.5, tot), cp + 'hl-periods', 'Count the half-lives: ' + (inDays ? t(tot / 24) + ' days is ' + t(tot) + ' hours, and ' : '') + t('\\frac{' + tot + '}{' + hl + '}=' + np) + ' half-lives.'], [A0 / (2 * np), cp + 'hl-linear', 'Halving ' + t(np) + ' times multiplies by ' + t('\\left(\\frac{1}{2}\\right)^{' + np + '}') + '.'], [A0 * Math.pow(0.5, np - 1), cp + 'ci-n1', 'After ' + t(np) + ' half-lives it has been halved ' + t(np) + ' times.'], inDays ? [A0 * Math.pow(0.5, tot / 24), cp + 'hl-periods', 'The half-life is in hours: change the days into hours first.'] : null],
      (inDays ? t(tot / 24) + ' day' + (tot / 24 > 1 ? 's' : '') + ' ' + t('=' + tot) + ' h, so ' : '') + t('n=\\frac{' + tot + '}{' + hl + '}=' + np) + ' half-lives.<br>' + t(A0 + '\\left(\\frac{1}{2}\\right)^{' + np + '}=\\frac{' + A0 + '}{' + Math.pow(2, np) + '}=' + vT(A)) + ' mg.',
      ['Number of half-lives ' + t('=\\dfrac{\\text{total time}}{\\text{half-life}}') + ' (in the same units).', 'Amount left ' + t('=P\\left(\\frac{1}{2}\\right)^{n}') + '.'], 'half-life', { after: 'mg', unit: 'mg' });
  };
  /* L6: the first full year past a target (calculator table) */
  Bd.firstPast = function (r, cp) {
    var s = find(function () {
      if (r.chance(0.5)) { var N = r.int(30, 90) * 100, pd = r.pick([2.5, 3, 4, 5, 6, 8]), X = r.int(Math.round(N * 0.35 / 100), Math.round(N * 0.8 / 100)) * 100; return { up: false, N: N, rr: 1 - pd / 100, p: pd, X: X }; }
      var Pp = r.int(10, 60) * 100, i = r.pick([3.5, 4, 4.5, 5, 5.5, 6, 7, 8]); return { up: true, N: Pp, rr: 1 + i / 100, p: i, X: 2 * Pp };
    }, function (s) { var n = Math.log(s.X / s.N) / Math.log(s.rr); return n > 3 && n < 30 && Math.abs(n - Math.round(n)) > 0.05; });
    var N = s.N, rr = s.rr, X = s.X, n = Math.ceil(Math.log(X / N) / Math.log(rr) - 1e-12), prev = N * Math.pow(rr, n - 1), cur = N * Math.pow(rr, n);
    var prompt = s.up ? t(dollars(N)) + ' is invested at ' + t(s.p + '\\%') + ' per year, compounded annually. How many full years does it take for the investment to double?' : 'A town has ' + t(F(N)) + ' people, and its population is falling by ' + t(s.p + '\\%') + ' per year. After how many full years does the population first fall below ' + t(F(X)) + '?';
    var lin = s.up ? Math.ceil(1 / (s.p / 100) - 1e-12) : Math.ceil((N - X) / (N * s.p / 100) - 1e-12);
    return numPart(prompt, n,
      [[n - 1, cp + 'dep-last', 'After ' + t(n - 1) + ' years it is ' + t(vT(K.roundTo(prev, 2))) + (s.up ? ', not yet double.' : ', not yet below ' + t(F(X)) + '.')], [lin, cp + 'ci-simple', 'That treats the change as the same amount every year. It changes by ' + t(s.p + '\\%') + ' of the <b>current</b> amount: use a table of ' + t(vT(N) + '(' + vT(rr) + ')^{n}') + '.']],
      'After ' + t('n') + ' years: ' + t(F(N) + '(' + vT(rr) + ')^{n}') + '. Table: ' + t('n=' + (n - 1)) + ' gives ' + t('\\approx ' + vT(K.roundTo(prev, 2))) + '; ' + t('n=' + n) + ' gives ' + t('\\approx ' + vT(K.roundTo(cur, 2))) + '.<br>' + (s.up ? 'It first doubles after ' + t(n) + ' years.' : 'It first falls below ' + t(F(X)) + ' after ' + t(n) + ' years.'),
      ['Make a calculator table of ' + t('Y_1=' + vT(N) + '(' + vT(rr) + ')^{X}') + ' (or try values of ' + t('n') + ').', 'Find the first whole number of years that passes the target, and check the year before it.'], s.up ? 'doubling time' : 'first year below', { before: t('n='), ansPre: 'n=', int: true, after: 'years', unit: 'years' });
  };

  /* L7: S_n of a geometric series from t1, r, n */
  Bd.geoSn = function (r, cp) {
    var s = find(function () { var g = r.pick([[2, 3], [7, 3], [5, 2], [3, 2], [2, -3], [4, -2], [1, -4], [6, 2], [3, 4], [2, 5], [-3, 2], [5, -2]]); return { t1: g[0], rv: g[1], n: r.int(5, 10) }; }, function (s) { return Math.abs(s.t1 * Math.pow(s.rv, s.n)) < 3e6; });
    var t1 = s.t1, rv = s.rv, n = s.n, v = t1 * (Math.pow(rv, n) - 1) / (rv - 1), a = [t1, t1 * rv, t1 * rv * rv];
    var alts = [[t1 * (Math.pow(rv, n - 1) - 1) / (rv - 1), cp + 'gs-n1', 'The exponent in the sum formula is ' + t('n') + ' itself: ' + t('S_n=\\frac{t_1(r^{n}-1)}{r-1}') + '.'], [t1 * (Math.pow(rv, n) - 1) / rv, cp + 'gs-divr', 'Divide by ' + t('r-1') + ', not ' + t('r') + '.'], [t1 * Math.pow(rv, n - 1), cp + 'gs-term', 'That is ' + t('t_{' + n + '}') + ', the last term. Add all ' + t(n) + ' terms with ' + t('S_n=\\frac{t_1(r^{n}-1)}{r-1}') + '.']];
    if (rv < 0 && n % 2 === 0) alts.push([t1 * (-Math.pow(-rv, n) - 1) / (rv - 1), cp + 'g-negpow', 'Put the negative ratio in brackets: ' + t('(' + rv + ')^{' + n + '}=' + F(Math.pow(rv, n))) + ', not ' + t(rv + '^{' + n + '}') + '.']);
    return numPart('Determine the sum of the first ' + t(n) + ' terms of the geometric series ' + t(serT(a)) + '.', v, alts,
      t('t_1=' + t1) + ', ' + t('r=' + rv) + ', ' + t('n=' + n) + '.<br>' + t('S_{' + n + '}=\\frac{' + t1 + '\\left(' + vP(rv) + '^{' + n + '}-1\\right)}{' + vP(rv) + '-1}=\\frac{' + t1 + '(' + F(Math.pow(rv, n) - 1) + ')}{' + (rv - 1) + '}=' + F(v)),
      ['Find ' + t('r') + ' by dividing a term by the one before it.', 'Use ' + t('S_n=\\dfrac{t_1(r^{n}-1)}{r-1}') + '; put a negative ' + t('r') + ' in brackets.'], 'geometric sum from t1, r, n', { before: t('S_{' + n + '}='), ansPre: 'S_{' + n + '}=' });
  };
  /* L7: a + ... + L (second formula), exact */
  Bd.geoSumToL = function (r, cp) {
    var g = r.pick([[5, 2], [3, 4], [-2, -3], [2187, 1 / 3], [1458, -1 / 3], [0.2, 3], [7, 2], [4, 3], [1, -2], [3, -2], [1024, 0.5], [6, 3]]);
    var t1 = g[0], rv = g[1], n = r.int(6, Math.abs(rv) >= 3 || Math.abs(rv) === 1 / 3 ? 8 : 11), L = cl(t1 * Math.pow(rv, n - 1)), v = cl((rv * L - t1) / (rv - 1));
    var a = [t1, cl(t1 * rv), cl(t1 * rv * rv)];
    return numPart('Determine the sum of the geometric series ' + t(serT(a, false) + '+\\cdots' + (L < 0 ? '-' + vT(-L) : '+' + vT(L))) + '.', v,
      [[cl((L - t1) / (rv - 1)), cp + 'gs2-nor', 'The second sum formula multiplies the last term by ' + t('r') + ': ' + t('S_n=\\frac{rt_n-t_1}{r-1}') + '.'], [cl((rv * L - t1) / (1 - rv)), cp + 'gs-den-sign', 'Check the denominator: ' + t('r-1=' + vT(rv, true) + '-1') + '.'], [cl(v - L), cp + 'gs-n1', 'Include the last term ' + t(vT(L)) + ' in the sum.'], [L, cp + 'gs-term', 'That is the last term. Add all the terms.']],
      t('t_1=' + vT(t1)) + ', ' + t('r=' + rTex(rv)) + ', ' + t('t_n=' + vT(L)) + '.<br>' + t('S_n=\\frac{rt_n-t_1}{r-1}=\\frac{\\left(' + rTex(rv) + '\\right)\\left(' + vT(L) + '\\right)-' + vP(t1) + '}{' + vP(rv, true) + '-1}=' + vT(v)),
      ['When the last term is known: ' + t('S_n=\\dfrac{rt_n-t_1}{r-1}') + '.', 'Or find ' + t('n') + ' first with ' + t('t_n=t_1r^{n-1}') + ', then use ' + t('S_n=\\dfrac{t_1(r^{n}-1)}{r-1}') + '.'], 'geometric sum to a last term', { before: t('S='), ansPre: 'S=' });
  };
  /* L7: S_n = A(B^n - 1) -> t_k */
  Bd.geoSnToTk = function (r, cp) {
    var A = r.pick([2, 3, 4, 5, 6, 1]), Bb = r.pick([2, 3, 4, 5]), k = r.int(5, Bb >= 4 ? 7 : 9), Sf = function (n) { return A * (Math.pow(Bb, n) - 1); }, v = Sf(k) - Sf(k - 1);
    return numPart('The sum of the first ' + t('n') + ' terms of a series is ' + t('S_n=' + (A === 1 ? '' : A) + '\\left(' + Bb + '^{n}-1\\right)') + '. Determine ' + t('t_{' + k + '}') + '.', v,
      [[Sf(k), cp + 'sn-is-sum', 'That is ' + t('S_{' + k + '}') + '. The ' + ord(k) + ' term alone is ' + t('S_{' + k + '}-S_{' + (k - 1) + '}') + '.'], [Sf(k + 1) - Sf(k), cp + 'sn-next', 'That is ' + t('t_{' + (k + 1) + '}=S_{' + (k + 1) + '}-S_{' + k + '}') + '.'], [Sf(k - 1), cp + 'sn-is-sum', 'Subtract: ' + t('t_{' + k + '}=S_{' + k + '}-S_{' + (k - 1) + '}') + '.']],
      t('t_{' + k + '}=S_{' + k + '}-S_{' + (k - 1) + '}=' + F(Sf(k)) + '-' + F(Sf(k - 1)) + '=' + F(v)) + '.<br>(Check: ' + t('t_1=S_1=' + Sf(1)) + ', ' + t('r=' + Bb) + ', ' + t(Sf(1) + '(' + Bb + ')^{' + (k - 1) + '}=' + F(v)) + '.)',
      ['One term is the difference of two partial sums.', t('t_n=S_n-S_{n-1}') + '.'], 'term from a geometric sum formula', { before: t('t_{' + k + '}='), ansPre: 't_{' + k + '}=' });
  };
  /* L7: how many terms of t1 + t1 r + ... add to S */
  Bd.geoNForSum = function (r, cp) {
    var s = find(function () { var g = r.pick([[4, 5], [7, 2], [3, 3], [-4, 3], [5, 2], [2, 3], [3, 5], [6, 2], [1, 4], [2, 4]]); return { t1: g[0], rv: g[1], n: r.int(5, 10) }; }, function (s) { return Math.abs(s.t1 * Math.pow(s.rv, s.n)) < 2e6; });
    var t1 = s.t1, rv = s.rv, n = s.n, Sv = t1 * (Math.pow(rv, n) - 1) / (rv - 1);
    return numPart('How many terms of the geometric series ' + t(serT([t1, t1 * rv, t1 * rv * rv])) + ' add to ' + t(F(Sv)) + '?', n,
      [[n - 1, cp + 'gn-off1', 'Check: ' + t('S_{' + (n - 1) + '}=' + F(t1 * (Math.pow(rv, n - 1) - 1) / (rv - 1))) + '.'], [n + 1, cp + 'gn-off1', 'Check: ' + t('S_{' + (n + 1) + '}=' + F(t1 * (Math.pow(rv, n + 1) - 1) / (rv - 1))) + '.']],
      t('\\frac{' + t1 + '(' + rv + '^{n}-1)}{' + (rv - 1) + '}=' + F(Sv) + '\\Rightarrow ' + rv + '^{n}-1=' + F(Math.pow(rv, n) - 1) + '\\Rightarrow ' + rv + '^{n}=' + F(Math.pow(rv, n))) + '. Trial: ' + t(rv + '^{' + n + '}=' + F(Math.pow(rv, n))) + ', so ' + t('n=' + n) + '.',
      ['Substitute into ' + t('S_n=\\dfrac{t_1(r^{n}-1)}{r-1}') + ' and isolate the power ' + t('r^{n}') + '.', 'Find the exponent by trial or with a calculator table.'], 'geometric terms for a sum', { before: t('n='), ansPre: 'n=', int: true });
  };
  /* L7: ball total vertical distance when it hits the ground the kth time (nearest hundredth) */
  Bd.ballTotal = function (r, cp) {
    var h = r.pick([4, 5, 6, 8, 9, 10, 12, 15, 16, 20]), f = r.pick([0.6, 0.75, 0.8, 0.7, 0.65, 2 / 3, 0.5]), k = r.int(4, 8);
    var fT = f === 2 / 3 ? '\\frac{2}{3}' : vT(f), fW = f === 2 / 3 ? t('\\frac{2}{3}') : t(Math.round(f * 100) + '\\%');
    var down = h * (1 - Math.pow(f, k)) / (1 - f), up = h * f * (1 - Math.pow(f, k - 1)) / (1 - f), tot = down + up;
    return apxPart('A ball is dropped from a height of ' + t(h) + ' m. Each bounce reaches ' + fW + ' of the height before. Determine the total vertical distance the ball has travelled when it hits the ground for the ' + ord(k) + ' time, to the nearest hundredth of a metre.', tot, 2,
      [[down, cp + 'ball-down', 'That is only the distance travelled <b>down</b>. The ball also travels up between landings.'], [down + h * f * (1 - Math.pow(f, k)) / (1 - f), cp + 'ball-extra-rise', 'When it lands for the ' + ord(k) + ' time it has fallen ' + t(k) + ' times but risen only ' + t(k - 1) + ' times.'], [2 * down, cp + 'ball-drop2', 'The first drop is travelled only once (down): the rises start with the first bounce, ' + t(vT(cl(h * f))) + ' m.'], [h * (1 + f) / (1 - f), cp + 'ball-inf', 'That is the total if it bounces forever. Add only ' + t(k) + ' falls and ' + t(k - 1) + ' rises.']],
      'Falls (' + t(k) + ' terms, ' + t('t_1=' + h) + '): ' + t('\\frac{' + h + '\\left(1-' + fT + '^{' + k + '}\\right)}{1-' + fT + '}\\approx ' + vT(K.roundTo(down, 4))) + '<br>Rises (' + t(k - 1) + ' terms, ' + t('t_1=' + vT(cl(h * f))) + '): ' + t('\\frac{' + vT(cl(h * f)) + '\\left(1-' + fT + '^{' + (k - 1) + '}\\right)}{1-' + fT + '}\\approx ' + vT(K.roundTo(up, 4))) + '<br>Total ' + t('\\approx ' + vT(K.roundTo(tot, 2))) + ' m.',
      ['At the ' + ord(k) + ' landing the ball has fallen ' + t(k) + ' times (starting with the drop) and risen ' + t(k - 1) + ' times (starting with the first bounce).', 'Find the two geometric sums separately and add them.'], 'bouncing ball, partial total', { after: 'm' });
  };

  /* L8: S∞ of a convergent series */
  Bd.infSum = function (r, cp) {
    var g = r.pick([[45, [1, 3]], [54, [1, 3]], [40, [3, 4]], [20, [-1, 4]], [12, [1, 2]], [36, [-1, 2]], [24, [2, 3]], [100, [-1, 4]], [64, [1, 4]], [30, [-2, 3]], [50, [2, 5]], [18, [1, 3]], [120, [1, 4]], [28, [-3, 4]], [90, [2, 5]], [16, [-1, 3]]]);
    var t1 = g[0] * r.pick([1, 2, 3, -1]), rr = g[1], rv = Q.v(rr), v = t1 / (1 - rv), a = [t1, cl(t1 * rv), cl(t1 * rv * rv)];
    return numPart('Determine the sum to infinity of the geometric series ' + t(a.map(function (x, i) { return i === 0 ? vT(x, true) : x < 0 ? '-' + vT(-x, true) : '+' + vT(x, true); }).join('') + '+\\cdots') + '.', v,
      [[t1 / (1 + rv), cp + 'inf-sign', t('S_\\infty=\\frac{t_1}{1-r}') + ': subtract ' + t('r') + (rv < 0 ? ' — with ' + t('r=' + Q.t(rr)) + ' that gives ' + t('1-(' + Q.t(rr) + ')') + '.' : '.')], [t1 / rv, cp + 'inf-r', 'Divide by ' + t('1-r') + ', not by ' + t('r') + '.'], [t1 * (1 - rv), cp + 'inf-mult', 'Divide ' + t('t_1') + ' by ' + t('1-r') + ' (don’t multiply).']],
      t('r=' + Q.t(rr)) + ', which is between ' + t('-1') + ' and ' + t('1') + ', so the series converges.<br>' + t('S_\\infty=\\frac{' + t1 + '}{1-' + (rv < 0 ? '\\left(' + Q.t(rr) + '\\right)' : Q.t(rr)) + '}=\\frac{' + t1 + '}{' + Q.t(Q.n(rr[1] - rr[0], rr[1])) + '}=' + vT(v, !isInt(v * 100))),
      ['Find ' + t('r') + ' by dividing a term by the one before it.', 'If ' + t('-1<r<1') + ': ' + t('S_\\infty=\\dfrac{t_1}{1-r}') + '.'], 'sum to infinity', { before: t('S_\\infty='), ansPre: 'S_\\infty=', ansTex: vT(v, !isInt(v * 100)) });
  };
  /* L8: which series is convergent (MC) */
  Bd.whichConv = function (r, cp) {
    var conv = r.pick([[12, -0.75], [20, 0.4], [9, -2 / 3], [50, 0.8], [6, -0.5], [100, -0.9], [40, 0.25]]);
    var dist = r.shuffle([[2, 1.5, 'r=1.5', 'its terms grow'], [5, -1, 'r=-1', 'the partial sums jump between two values'], [0.1, 2, 'r=2', 'the terms keep doubling, even though they start small'], [0.006, 10, 'r=10', 'the terms grow, even though they start tiny'], [4, 1, 'r=1', 'every term is the same, so the sums grow without limit'], [3, -1.5, 'r=-1.5', 'the terms grow in size']]).slice(0, 3);
    function sT(t1, rv) { var a = [t1, cl(t1 * rv), cl(t1 * rv * rv)]; return t(a.map(function (x, i) { return i === 0 ? vT(x) : x < 0 ? '-' + vT(-x) : '+' + vT(x); }).join('') + '+\\cdots'); }
    var opts = [{ html: sT(conv[0], conv[1]), right: true, code: 'conv' }].concat(dist.map(function (d, i) { return { html: sT(d[0], d[1]), right: false, code: 'div' + i, why: 'That series has ' + t(d[2]) + ': ' + d[3] + '. It converges only when ' + t('-1<r<1') + '.' }; }));
    return mcPart(r, 'Which infinite geometric series is <b>convergent</b>?', opts, 'The convergent one has ' + t('r=' + vT(conv[1], true)) + ', between ' + t('-1') + ' and ' + t('1') + '. The others have ' + dist.map(function (d) { return t(d[2]); }).join(', ') + ': divergent.',
      ['Find ' + t('r') + ' for each series.', 'A geometric series converges only when ' + t('-1<r<1') + ' — how big the first terms are doesn’t matter.'], 'which converges');
  };
  /* L8: r and S∞ (or none) for a series (two boxes) */
  Bd.infClassify = function (r, cp) {
    var conv = r.chance(0.6), g = conv ? r.pick([[54, [1, 3]], [7, [-1, 2]], [200, [4, 5]], [-24, [3, 4]], [100, [-9, 10]], [80, [1, 4]], [45, [2, 3]]]) : r.pick([[0.2, [3, 1]], [6, [1, 1]], [8, [-1, 1]], [0.81, [10, 9]], [2, [5, 2]], [3, [-2, 1]], [4, [3, 2]]]);
    var t1 = g[0] * (Math.abs(g[0]) >= 50 ? r.pick([1, -1]) : r.pick([1, 2, 3, -1])), rr = g[1], rv = Q.v(rr), a = [t1, cl(t1 * rv), cl(t1 * rv * rv)], Sv = conv ? t1 / (1 - rv) : null;
    var rC = numChk(rv, [[cl(1 / rv), cp + 'r-flip', t('r=\\frac{t_2}{t_1}') + '.'], [cl(a[1] - a[0]), cp + 'r-diff', 'Divide, don’t subtract: ' + t('r=\\frac{t_2}{t_1}') + '.']]);
    var sC = noneChk(Sv, conv ? [[t1 / (1 + rv), cp + 'inf-sign', t('S_\\infty=\\frac{t_1}{1-r}') + '.'], [t1 / rv, cp + 'inf-r', 'Divide by ' + t('1-r') + '.']] : [[t1 / (1 - rv), cp + 'gave-num', 'The formula only works when ' + t('-1<r<1') + '. Here ' + t('r=' + Q.t(rr)) + ', so the series diverges: press <b>none</b>.']],
      { saidNoneCode: cp + 'said-none', saidNoneHint: t('r=' + Q.t(rr)) + ' is between ' + t('-1') + ' and ' + t('1') + ', so the series converges and has a sum.', numCode: cp + 'gave-num', numHint: 'With ' + t('r=' + Q.t(rr)) + ' the series diverges (it has no sum to infinity): press <b>none</b>.' });
    var p = boxesPart('Consider the infinite geometric series ' + t(a.map(function (x, i) { return i === 0 ? vT(x, true) : x < 0 ? '-' + vT(-x, true) : '+' + vT(x, true); }).join('') + '+\\cdots') + '. State ' + t('r') + ', then give ' + t('S_\\infty') + ' if it exists. If the series is divergent, press <b>none</b>.',
      [{ name: 'Common ratio', before: t('r='), check: rC, key: Q.t(rr) }, { name: 'Sum to infinity', before: t('S_\\infty='), check: sC, key: conv ? kT(Sv) : 'none', none: true, placeholder: 'a number, or none' }],
      t('r=' + Q.t(rr)) + ', ' + (conv ? t('S_\\infty=' + vT(Sv, !isInt(Sv * 100))) : 'divergent: <b>none</b>'),
      t('r=\\frac{' + vT(a[1], true) + '}{' + vT(a[0], true) + '}=' + Q.t(rr)) + '. ' + (conv ? 'It is between ' + t('-1') + ' and ' + t('1') + ': convergent. ' + t('S_\\infty=\\frac{' + vT(t1) + '}{1-' + vP(rv, true) + '}=' + vT(Sv, !isInt(Sv * 100))) : (Math.abs(rv) === 1 ? t('r=' + Q.t(rr)) + ': the partial sums ' + (rv === 1 ? 'grow without limit' : 'keep jumping') + '. ' : t('|r|>1') + ': the terms grow. ') + 'Divergent — no sum to infinity.'),
      ['Find ' + t('r') + ' by dividing a term by the one before it.', 'Convergent only if ' + t('-1<r<1') + '; then ' + t('S_\\infty=\\dfrac{t_1}{1-r}') + '.'], 'convergent or divergent', cp);
    p.bad = [[Q.t(rr), conv ? 'none' : isFinite(t1 / (1 - rv)) ? kT(t1 / (1 - rv)) : kT(t1)], [kT(cl(a[1] - a[0])), conv ? kT(Sv) : 'none']];
    return p;
  };
  /* L8: repeating decimal -> fraction in lowest terms */
  Bd.repDec = function (r, cp) {
    var kind = r.pick(['two', 'two', 'three', 'mixed1', 'mixed2', 'whole']), tex, fr, alts = [], sol;
    function red(p, q) { return Q.n(p, q); }
    if (kind === 'two') { var ab = find(function () { return r.int(10, 98); }, function (x) { return x % 11 !== 0; }); fr = red(ab, 99); tex = '0.\\overline{' + (ab < 10 ? '0' + ab : ab) + '}'; alts = [[ab / 100, cp + 'rep-term', 'The digits repeat forever, so it is an infinite series: ' + t('0.' + ab + '+0.00' + ab + '+\\cdots') + ' with ' + t('r=0.01') + '.'], [ab / 90, cp + 'rep-r', 'A 2-digit block moves 2 places each time: ' + t('r=0.01') + ', so divide by ' + t('0.99') + '.']]; sol = t('0.' + ab + '+0.00' + ab + '+\\cdots') + ': ' + t('t_1=0.' + ab) + ', ' + t('r=0.01') + '.<br>' + t('S_\\infty=\\frac{0.' + ab + '}{0.99}=\\frac{' + ab + '}{99}' + (Q.t(fr) === '\\frac{' + ab + '}{99}' ? '' : '=' + Q.t(fr))); }
    else if (kind === 'three') { var abc = find(function () { return r.int(101, 989); }, function (x) { return x % 111 !== 0 && x % 10 !== 0; }); fr = red(abc, 999); tex = '0.\\overline{' + abc + '}'; alts = [[abc / 1000, cp + 'rep-term', 'It repeats forever: use ' + t('r=0.001') + '.'], [abc / 990, cp + 'rep-r', 'A 3-digit block: ' + t('r=0.001') + ', so divide by ' + t('0.999') + '.']]; sol = t('t_1=0.' + abc) + ', ' + t('r=0.001') + ': ' + t('S_\\infty=\\frac{0.' + abc + '}{0.999}=\\frac{' + abc + '}{999}' + (Q.t(fr) === '\\frac{' + abc + '}{999}' ? '' : '=' + Q.t(fr))); }
    else if (kind === 'mixed1') { var a1 = r.int(1, 9), b1 = find(function () { return r.int(1, 8); }, function (x) { return x !== a1; }); fr = red(9 * a1 + b1, 90); tex = '0.' + a1 + '\\overline{' + b1 + '}'; alts = [[(10 * a1 + b1) / 99, cp + 'rep-nonrep', 'Only the ' + t(b1) + ' repeats. Keep ' + t('0.' + a1) + ' separate and add it at the end.'], [b1 / 9, cp + 'rep-nonrep', 'Add the non-repeating part ' + t('0.' + a1) + ' too.'], [(10 * a1 + b1) / 100, cp + 'rep-term', 'The ' + t(b1) + ' repeats forever: ' + t('0.0' + b1 + '+0.00' + b1 + '+\\cdots') + ' is an infinite series.']]; sol = t('0.' + a1 + '+(0.0' + b1 + '+0.00' + b1 + '+\\cdots)') + ': ' + t('\\frac{0.0' + b1 + '}{0.9}=\\frac{' + b1 + '}{90}') + '.<br>' + t('\\frac{' + a1 + '}{10}+\\frac{' + b1 + '}{90}=\\frac{' + 9 * a1 + '}{90}+\\frac{' + b1 + '}{90}=\\frac{' + (9 * a1 + b1) + '}{90}' + (Q.t(fr) === '\\frac{' + (9 * a1 + b1) + '}{90}' ? '' : '=' + Q.t(fr))); }
    else if (kind === 'mixed2') { var a2 = r.int(1, 9), bc = find(function () { return r.int(10, 98); }, function (x) { return x % 11 !== 0; }); fr = red(99 * a2 + bc, 990); tex = '0.' + a2 + '\\overline{' + bc + '}'; alts = [[(100 * a2 + bc) / 999, cp + 'rep-nonrep', 'Only ' + t(bc) + ' repeats. Keep ' + t('0.' + a2) + ' separate.'], [bc / 99, cp + 'rep-nonrep', 'Add the non-repeating part ' + t('0.' + a2) + '.'], [a2 / 10 + bc / 900, cp + 'rep-r', 'A 2-digit block moves 2 places each time: ' + t('r=0.01') + '.']]; sol = t('0.' + a2 + '+(0.0' + bc + '+0.000' + bc + '+\\cdots)') + ': ' + t('t_1=0.0' + bc) + ', ' + t('r=0.01') + ', ' + t('\\frac{0.0' + bc + '}{0.99}=\\frac{' + bc + '}{990}') + '.<br>' + t('\\frac{' + a2 + '}{10}+\\frac{' + bc + '}{990}=\\frac{' + (99 * a2 + bc) + '}{990}' + (Q.t(fr) === '\\frac{' + (99 * a2 + bc) + '}{990}' ? '' : '=' + Q.t(fr))); }
    else { var w = r.int(1, 5), d1 = r.int(1, 8); fr = red(9 * w + d1, 9); tex = w + '.\\overline{' + d1 + '}'; alts = [[w + d1 / 10, cp + 'rep-term', 'The ' + t(d1) + ' repeats forever: ' + t('0.' + d1 + '+0.0' + d1 + '+\\cdots') + '.'], [d1 / 9, cp + 'rep-nonrep', 'Add the whole number ' + t(w) + ' too.']]; sol = t(w + '+(0.' + d1 + '+0.0' + d1 + '+\\cdots)=' + w + '+\\frac{0.' + d1 + '}{0.9}=' + w + '+\\frac{' + d1 + '}{9}=' + Q.t(fr)); }
    var T = Q.v(fr), L = alts.filter(function (w2) { return !near(w2[0], T); });
    var chk = K.fraction(fr, { diag: function (v) { for (var i = 0; i < L.length; i++) if (near(v, L[i][0])) return { code: L[i][1], hint: L[i][2] }; return null; } });
    var p = P.math('Use an infinite geometric series to write ' + t(tex) + ' as a fraction in lowest terms.', chk, Q.t(fr), sol, ['Split the decimal into its repeating blocks: each block is the one before moved one block-length right, so ' + t('r=0.1') + ' for a 1-digit block, ' + t('r=0.01') + ' for a 2-digit block, …', 'Keep any digits that don’t repeat separate, and add them at the end. Reduce the fraction.'], 'repeating decimal: ' + kind, { keys: 'fraction', placeholder: 'a fraction' });
    p.answer = t(tex + '=' + Q.t(fr));
    p.bad = L.map(function (w2) { var f2 = toFr(w2[0]); return f2 ? '\\frac{' + f2[0] + '}{' + f2[1] + '}' : String(w2[0]); }).slice(0, 3);
    return p;
  };
  /* L8: the missing t1 or r of an infinite series (r may be impossible -> none) */
  Bd.infMissing = function (r, cp) {
    if (r.chance(0.45)) {
      var g = r.pick([[60, 0.35], [-45, -0.5], [20, 2 / 3], [80, 0.25], [150, 0.4], [36, -1 / 3], [75, 0.6], [24, -0.25]]), Sv = g[0] * r.pick([1, 2, 3, -1]), rv = g[1], t1 = cl(Sv * (1 - rv)), rT2 = vT(rv);
      return numPart('An infinite geometric series has ' + t('S_\\infty=' + Sv) + ' and ' + t('r=' + rT2) + '. Determine ' + t('t_1') + '.', t1,
        [[cl(Sv * (1 + rv)), cp + 'inf-sign', t('S_\\infty=\\frac{t_1}{1-r}') + ', so ' + t('t_1=S_\\infty(1-r)') + (rv < 0 ? ' — and ' + t('1-(' + rT2 + ')=' + vT(cl(1 - rv), true)) : '') + '.'], [cl(Sv / (1 - rv)), cp + 'inf-mult', 'Solve for ' + t('t_1') + ': multiply both sides by ' + t('1-r') + '.'], [cl(Sv * rv), cp + 'inf-r', t('t_1=S_\\infty(1-r)') + '.']],
        t(Sv + '=\\frac{t_1}{1-' + vP(rv, true) + '}') + ', so ' + t('t_1=' + Sv + '\\left(1-' + vP(rv, true) + '\\right)=' + Sv + '\\left(' + vT(cl(1 - rv), true) + '\\right)=' + vT(t1, true)),
        ['Substitute into ' + t('S_\\infty=\\dfrac{t_1}{1-r}') + ' and solve for ' + t('t_1') + '.'], 'infinite series: find t1', { before: t('t_1='), ansPre: 't_1=', ansTex: vT(t1) });
    }
    var h = r.pick([[9, 12], [30, 20], [12, 8], [21, 30], [18, 24], [36, 48], [14, 7], [10, 4], [40, 16], [25, 20]]), hm = r.pick([1, 2, 3]), a1 = h[0] * hm, S2 = h[1] * hm, rv2 = cl(1 - a1 / S2), okR = rv2 > -1 && rv2 < 1;
    var opt = { name: 'Common ratio', before: t('r='), saidNoneCode: cp + 'said-none', saidNoneHint: 'Solve ' + t(S2 + '=\\frac{' + a1 + '}{1-r}') + ' for ' + t('r') + ': the value is between ' + t('-1') + ' and ' + t('1') + ', so the series exists.', numCode: cp + 'gave-num', numHint: 'Solving gives ' + t('r=' + vT(rv2, true)) + ', which is not between ' + t('-1') + ' and ' + t('1') + ': the series would diverge, so no such series exists. Press <b>none</b>.', ansPre: 'r=', noneAns: 'no such series' };
    return nonePart('An infinite geometric series has ' + t('t_1=' + a1) + ' and ' + t('S_\\infty=' + S2) + '. Determine ' + t('r') + '. If no such series exists, press <b>none</b>.', okR ? rv2 : null,
      okR ? [[cl(a1 / S2), cp + 'inf-1mr', 'That is ' + t('1-r') + '. Now solve for ' + t('r') + '.'], [cl(a1 / S2 - 1), cp + 'inf-sign', t('1-r=\\frac{' + a1 + '}{' + S2 + '}') + ', so ' + t('r=1-\\frac{' + a1 + '}{' + S2 + '}') + '.']] : [[rv2, cp + 'gave-num', 'Solving gives ' + t('r=' + vT(rv2, true)) + ' — but a series with that ratio diverges, so it has no sum. No such series exists.'], [cl(a1 / S2), cp + 'inf-1mr', t('1-r=' + vT(cl(a1 / S2), true)) + ', so ' + t('r=' + vT(rv2, true)) + ' — not between ' + t('-1') + ' and ' + t('1') + '.']], opt,
      t(S2 + '=\\frac{' + a1 + '}{1-r}\\Rightarrow 1-r=\\frac{' + a1 + '}{' + S2 + '}=' + vT(cl(a1 / S2), true) + '\\Rightarrow r=' + vT(rv2, true)) + '.<br>' + (okR ? 'It is between ' + t('-1') + ' and ' + t('1') + ', so it is valid: ' + t('r=' + vT(rv2, true)) + '.' : 'But ' + t('r=' + vT(rv2, true)) + ' is not between ' + t('-1') + ' and ' + t('1') + ', so the series would diverge: no such series exists (<b>none</b>).'),
      ['Substitute into ' + t('S_\\infty=\\dfrac{t_1}{1-r}') + ' and solve for ' + t('r') + '.', 'A sum to infinity exists only if ' + t('-1<r<1') + ' — check your ' + t('r') + '.'], 'infinite series: find r' + (okR ? '' : ' (none)'));
  };
  /* L8: ball bouncing forever (nearest hundredth) */
  Bd.ballForever = function (r, cp) {
    var h = r.pick([3, 4, 5, 6, 8, 9, 10, 12, 15, 18, 20]), f = r.pick([0.6, 0.75, 0.8, 2 / 3, 0.5, 0.7, 0.4, 0.9]), fT = f === 2 / 3 ? '\\frac{2}{3}' : vT(f), fW = f === 2 / 3 ? t('\\frac{2}{3}') : t(Math.round(f * 100) + '\\%');
    var down = h / (1 - f), up = h * f / (1 - f), tot = down + up;
    return apxPart('A ball is dropped from a height of ' + t(h) + ' m. After each bounce it rises to ' + fW + ' of the height it fell from. If it keeps bouncing forever, what total vertical distance does it travel? Round to the nearest hundredth of a metre if needed.', tot, 2,
      [[down, cp + 'ball-down', 'That is only the distance down. Add the distance up: the rises start with the first bounce, ' + t(vT(cl(h * f))) + ' m.'], [up, cp + 'ball-down', 'That is only the distance up. Add the distance down (starting with the drop).'], [2 * down, cp + 'ball-drop2', 'The drop of ' + t(h) + ' m is travelled only once: the rises start with the first bounce.']],
      'Down: ' + t(h + '+' + vT(cl(h * f)) + '+\\cdots') + ', ' + t('S_\\infty=\\frac{' + h + '}{1-' + fT + '}\\approx ' + vT(K.roundTo(down, 4))) + '<br>Up: ' + t(vT(cl(h * f)) + '+\\cdots') + ', ' + t('S_\\infty=\\frac{' + vT(cl(h * f)) + '}{1-' + fT + '}\\approx ' + vT(K.roundTo(up, 4))) + '<br>Total ' + t('\\approx ' + vT(K.roundTo(tot, 2))) + ' m.',
      ['The ball travels down and up. Write one series for the drops (starting with ' + t(h) + ' m) and one for the rises (starting with the first bounce).', 'Each is an infinite geometric series with ' + t('r=' + fT) + ': ' + t('S_\\infty=\\dfrac{t_1}{1-r}') + '.'], 'bouncing ball forever', { after: 'm' });
  };
  /* L8: variable ratio — the shared series, the bounds of x, and the x that gives S∞ = V */
  Bd.varShared = function (r) {
    return find(function () {
      var form1 = r.chance(0.6), m = form1 ? r.pick([2, 3, 4, 5]) : r.pick([2, 3, 4, 5]), b = form1 ? r.pick([-3, -2, -1, 1, 2, 3]) : 0, t1 = r.int(1, 5), r0 = r.pick([[1, 2], [1, 4], [1, 3], [2, 3], [3, 4], [-1, 2], [1, 5], [2, 5], [-1, 3]]);
      var x0 = form1 ? (Q.v(r0) - b) / m : Q.v(r0) * m, one = Q.n(r0[1] - r0[0], r0[1]), t1b = t1 * one[0], V = cl(t1b / Q.v(one));
      return { form1: form1, m: m, b: b, t1: t1b, r0: r0, x0: cl(x0), V: V };
    }, function (s) { return s.t1 <= 15 && isInt(s.V * 4) && Math.abs(s.V) < 200 && toFr(s.x0) && toFr(s.x0)[1] <= 30; });
  };
  function varRT(s) { return s.form1 ? (s.m + 'x' + plusT(s.b)) : '\\frac{x}{' + s.m + '}'; }
  function cx(a, b, v) { var f = Q.n(a, b); return f[1] === 1 ? (f[0] === 1 ? '' : f[0]) + v : '\\frac{' + (f[0] === 1 ? '' : f[0]) + v + '}{' + f[1] + '}'; }   // (a/b)·v as the booklet writes it: 3x, \frac{3x}{2}
  Bd.varStem = function (s) {
    var rt = varRT(s), terms = s.form1 ? (s.t1 === 1 ? '1+(' + rt + ')+(' + rt + ')^{2}' : s.t1 + '+' + s.t1 + '(' + rt + ')+' + s.t1 + '(' + rt + ')^{2}') : s.t1 + '+' + cx(s.t1, s.m, 'x') + '+' + cx(s.t1, s.m * s.m, 'x^{2}');
    return 'Consider the infinite geometric series ' + t(terms + '+\\cdots') + '.';
  };
  Bd.varBounds = function (r, cp, s) {
    var lo = s.form1 ? (-1 - s.b) / s.m : -s.m, hi = s.form1 ? (1 - s.b) / s.m : s.m, rt = varRT(s);
    var loC = numChk(lo, s.form1 ? [[-1 / s.m, cp + 'int-b', 'Subtract ' + t(vT(s.b)) + ' from all three parts first, then divide by ' + t(s.m) + '.'], [-1 - s.b, cp + 'int-a', 'Divide all three parts by ' + t(s.m) + '.']] : [[-1 / s.m, cp + 'int-a', 'Multiply all three parts by ' + t(s.m) + ' (don’t divide).']]);
    var hiC = numChk(hi, s.form1 ? [[1 / s.m, cp + 'int-b', 'Subtract ' + t(vT(s.b)) + ' from all three parts first.'], [1 - s.b, cp + 'int-a', 'Divide all three parts by ' + t(s.m) + '.']] : [[1 / s.m, cp + 'int-a', 'Multiply all three parts by ' + t(s.m) + '.']]);
    var p = boxesPart('For what values of ' + t('x') + ' does the series converge? Give the two bounds.',
      [{ name: 'Lower bound', label: '', after: t('<x'), check: loC, key: kT(lo) }, { name: 'Upper bound', label: '', before: t('x<'), check: hiC, key: kT(hi) }],
      t(vT(lo, true) + '<x<' + vT(hi, true)),
      t('r=' + rt) + '. Converges when ' + t('-1<' + rt + '<1') + (s.form1 ? ': ' + t('' + (-1 - s.b) + '<' + s.m + 'x<' + (1 - s.b)) + ', so ' : ': multiply by ' + t(s.m) + ', ') + t(vT(lo, true) + '<x<' + vT(hi, true)) + '.',
      ['Find ' + t('r') + ' (divide the second term by the first): it is an expression in ' + t('x') + '.', 'Solve the double inequality ' + t('-1<r<1') + ' by doing the same thing to all three parts.'], 'convergence interval', cp);
    p.bad = s.form1 ? [[kT(-1 / s.m), kT(1 / s.m)], [kT(-1 - s.b), kT(1 - s.b)]] : [[kT(-1 / s.m), kT(1 / s.m)]];
    return p;
  };
  Bd.varX = function (r, cp, s) {
    var rt = varRT(s), r0 = Q.v(s.r0), x0 = s.x0, wrongR = s.t1 / s.V - 1, xw = s.form1 ? (wrongR - s.b) / s.m : wrongR * s.m;
    return numPart('Determine the value of ' + t('x') + ' for which ' + t('S_\\infty=' + vT(s.V, true)) + '.', x0,
      [[r0, cp + 'int-gave-r', 'That is the value of ' + t('r') + '. Now solve ' + t(rt + '=' + Q.t(s.r0)) + ' for ' + t('x') + '.'], [cl(xw), cp + 'inf-sign', t('1-r=\\frac{t_1}{S_\\infty}') + ', so ' + t('r=1-\\frac{t_1}{S_\\infty}') + '.']],
      t(vT(s.V, true) + '=\\frac{' + s.t1 + '}{1-r}\\Rightarrow 1-r=' + vT(cl(s.t1 / s.V), true) + '\\Rightarrow r=' + Q.t(s.r0)) + '<br>' + t(rt + '=' + Q.t(s.r0)) + ', so ' + t('x=' + vT(x0, true)) + '. (Check: ' + t('r=' + Q.t(s.r0)) + ' is between ' + t('-1') + ' and ' + t('1') + '.)',
      ['Use ' + t('S_\\infty=\\dfrac{t_1}{1-r}') + ' to find ' + t('r') + ' first.', 'Then set your expression for ' + t('r') + ' equal to that value and solve for ' + t('x') + '.'], 'variable ratio: x for a sum', { before: t('x='), ansPre: 'x=', ansTex: vT(x0, true) });
  };
  /* L9: ice thickness: start I, grows g in week 1, then f of the week before -> after k weeks (nearest hundredth) */
  Bd.iceK = function (r, cp) {
    var I = r.int(4, 12), g = r.pick([4, 5, 6, 8, 3]), f = r.pick([0.8, 0.75, 0.6, 0.7, 0.9]), k = r.int(4, 9), Sk = g * (1 - Math.pow(f, k)) / (1 - f), v = I + Sk;
    return apxPart('On December 1 the ice on a lake is ' + t(I) + ' cm thick. In the first week the ice gets ' + t(g) + ' cm thicker, and each week after that it thickens by ' + t(Math.round(f * 100) + '\\%') + ' of the previous week’s increase. How thick is the ice after ' + t(k) + ' weeks, to the nearest hundredth of a centimetre?', v, 2,
      [[Sk, cp + 'ice-noI', 'That is how much it has thickened. Add the ' + t(I) + ' cm it started with.'], [I + g * Math.pow(f, k - 1), cp + 'gs-term', 'That adds only the week-' + k + ' increase. Add the increases of all ' + t(k) + ' weeks (a geometric series).'], [I + g / (1 - f), cp + 'ball-inf', 'That is the thickness it approaches if the pattern goes on forever. Add only ' + t(k) + ' weeks.'], [I + g * (1 - Math.pow(f, k - 1)) / (1 - f), cp + 'gs-n1', 'Add the increases of all ' + t(k) + ' weeks.']],
      'Increases: ' + t(g + '+' + vT(cl(g * f)) + '+\\cdots') + ' (' + t('t_1=' + g) + ', ' + t('r=' + vT(f)) + ').<br>' + t('S_{' + k + '}=\\frac{' + g + '\\left(1-' + vT(f) + '^{' + k + '}\\right)}{1-' + vT(f) + '}\\approx ' + vT(K.roundTo(Sk, 4))) + '<br>Thickness ' + t('=' + I + '+S_{' + k + '}\\approx ' + vT(K.roundTo(v, 2))) + ' cm.',
      ['The weekly increases form a geometric series: ' + t('t_1=' + g) + ', ' + t('r=' + vT(f)) + '.', 'Thickness = starting thickness + the sum of the increases.'], 'ice thickness', { after: 'cm' });
  };

  /* every builder's `bad` answers are checked against its own key checker: a "wrong" answer that happens to be right for
     these numbers (e.g. t1 = d) is dropped */
  Object.keys(Bd).forEach(function (k) {
    var f0 = Bd[k];
    Bd[k] = function () {
      var p = f0.apply(null, arguments);
      if (p && typeof p.check === 'function' && p.bad) p.bad = p.bad.filter(function (b) { var res = p.check(b); return !(res && res.v === 'correct'); });
      return p;
    };
  });

  /* =====================================================================================================
   * The Unit 1 Test
   * ===================================================================================================== */
  var CP = 'u1t-', Bt = Bd;
  function one(num, outcome, level, fn) { return { num: String(num), outcome: outcome, parts: [{ id: String(num), outcome: outcome, level: level, make: function (r) { return fn(r, CP); } }] }; }
  function pt(id, outcome, level, fn) { return { id: id, outcome: outcome, level: level, make: function (r, s) { return fn(r, CP, s); } }; }
  var QUESTIONS = [
    /* ---------------- Beginning ---------------- */
    { num: '1', outcome: 'RF9', parts: [pt('1a', 'RF9', 'BEG', Bt.classify), pt('1b', 'RF9', 'BEG', Bt.termFromFormula)] },
    one(2, 'RF9', 'BEG', Bt.arithTk),
    one(3, 'RF9', 'BEG', Bt.dFromTwo),
    { num: '4', outcome: 'RF9', parts: [pt('4a', 'RF9', 'BEG', Bt.arithSnEnds), pt('4b', 'RF9', 'BEG', Bt.arithSn)] },
    { num: '5', outcome: 'RF10', shared: Bt.geoShared, stem: Bt.geoStem, parts: [pt('5a', 'RF10', 'BEG', Bt.geoR), pt('5b', 'RF10', 'BEG', Bt.geoGT)] },
    { num: '6', outcome: 'RF10', parts: [pt('6a', 'RF10', 'BEG', function (r, cp) { return Bt.gfactor(r, cp, { kind: 'up' }); }), pt('6b', 'RF10', 'BEG', function (r, cp) { return Bt.gfactor(r, cp, { kind: r.pick(['down', 'down', 'rebound', 'frac']) }); })] },
    one(7, 'RF10', 'BEG', Bt.geoSn),
    { num: '8', outcome: 'RF10', parts: [pt('8a', 'RF10', 'BEG', Bt.infSum), pt('8b', 'RF10', 'BEG', Bt.whichConv)] },
    /* ---------------- Progressing ---------------- */
    { num: '9', outcome: 'RF9', parts: [pt('9a', 'RF9', 'PRG', Bt.arithGT), pt('9b', 'RF9', 'PRG', function (r, cp) { return Bt.isTerm(r, cp, {}); })] },
    { num: '10', outcome: 'RF9', parts: [pt('10a', 'RF9', 'PRG', Bt.numTerms), pt('10b', 'RF9', 'PRG', Bt.means)] },
    { num: '11', outcome: 'RF9', shared: Bt.salaryShared, stem: Bt.salaryStem, parts: [pt('11a', 'RF9', 'PRG', Bt.salaryK), pt('11b', 'RF9', 'PRG', Bt.salaryFirst)] },
    { num: '12', outcome: 'RF9', parts: [pt('12a', 'RF9', 'PRG', Bt.arithSumToL), pt('12b', 'RF9', 'PRG', Bt.snToTk)] },
    { num: '13', outcome: 'RF10', parts: [pt('13a', 'RF10', 'PRG', Bt.geoGTFromTwo), pt('13b', 'RF10', 'PRG', Bt.geoNumTerms)] },
    { num: '14', outcome: 'RF10', parts: [pt('14a', 'RF10', 'PRG', Bt.compound), pt('14b', 'RF10', 'PRG', Bt.bounceK)] },
    { num: '15', outcome: 'RF10', parts: [pt('15a', 'RF10', 'PRG', Bt.geoSumToL), pt('15b', 'RF10', 'PRG', Bt.geoSnToTk)] },
    one(16, 'RF10', 'PRG', Bt.repDec),
    /* ---------------- Mastery ---------------- */
    one(17, 'RF9', 'MAS', Bt.exprArith),
    one(18, 'RF9', 'MAS', Bt.arithNForSum),
    one(19, 'RF9', 'MAS', Bt.depYear),
    one(20, 'RF10', 'MAS', Bt.geoTwoValues),
    one(21, 'RF10', 'MAS', Bt.ballTotal),
    { num: '22', outcome: 'RF10', shared: Bt.varShared, stem: Bt.varStem, parts: [pt('22a', 'RF10', 'MAS', Bt.varBounds), pt('22b', 'RF10', 'MAS', Bt.varX)] }
  ];

  HW.defineTest({
    id: 'u1test', unit: 1, title: 'Unit 1 Test', calc: true,
    blurb: 'The Unit 1 outcomes-based test on RF9 (arithmetic sequences and series) and RF10 (geometric sequences and series): classifying sequences, general terms, terms and number of terms, two known terms, arithmetic and geometric sums, growth and decay, sums to infinity and repeating decimals — in Beginning, Progressing and Mastery boxes. Scientific calculator allowed.',
    // Short version (~half, 14 questions / 18 parts): every outcome keeps its three boxes. Beginning: the formula term,
    // d from two terms, an arithmetic sum, r and the geometric general term, a sum to infinity; Progressing: general
    // term + is it a term, the salary, the arithmetic sum to a last term, the geometric general term from two terms,
    // compound interest and a bounce, the geometric sum to a last term, the repeating decimal; Mastery: the terms
    // needed for a sum (RF9) and the bouncing ball (RF10).
    short: ['1b', '3', '4b', '5', '8a', '9', '11', '12a', '13a', '14', '15a', '16', '18', '21'],
    questions: QUESTIONS
  });
})(window);
