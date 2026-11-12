/* Math 20-1 · Unit 6 · Lesson 9 — Problems Involving Rational Equations (work, motion, numbers) (outcome AN6 on every part)
 * Assignment 9 (m201book unit6/u6_l09.tex, Questions 1–17) and the Lesson 9 Extra Practice (u6_ep09.tex, A1–A4, B1–B6,
 * C1–C4). Every part is a generator: the booklet question's idea, form and difficulty with new numbers (and often a new
 * context); the lesson's example numbers and the booklet question's own numbers are left out. Calculator allowed.
 * Answers: numbers in boxes (speeds, times, the current, numbers of games), several boxes when the booklet asks for
 * several quantities ("each speed and the time"); "to the nearest tenth" → rounded boxes; a number problem with two
 * answers → the roots "n = …, n = …" (both kept when both work, the non-integer one rejected when integers are asked);
 * "write an expression" and the table's time column → expression boxes checked by value (any equivalent form).
 * Multiple choice stays multiple choice; numerical response → a 4-character box.
 * Recognised mistakes (codes u6l9-…): the other quantity given (the other speed, the faster trip's time, the ground speed
 * for the airspeed, the other machine), the inadmissible root kept (negative speed or time, a return speed below 0),
 * times added / averaged / subtracted in work problems, the drain added instead of subtracted, the head start ignored or
 * the total time given for "how much longer", time = distance × speed or speed ÷ distance, c² for c, the integer
 * rounding of a "how many in a row" answer (7.5 → 7 instead of 8), an arithmetic-mean shortcut for an average speed,
 * numbers in each other's boxes.
 * Levels: LIM BEG EMG PRG ADV MAS. Mastery: 1(b) (both pairs, with negatives), 6 (quadratic formula, to the tenth),
 * Extra C1 (a round trip by air), C4 (a round trip to the tenth).
 *
 * ============================================================================================================
 * HW.p69 — the Lesson 9 problem kit (the Unit 6 Review, u6l10.js, uses it lazily: inside its generators only)
 * ============================================================================================================
 *   P9.codes(cp)                 registers this kit's codes under a prefix ('u6l9-', 'u6l10-')
 *   P9.boxesN(prompt, specs, …)  several number boxes: specs [{ label, ans, dp?, diag?, after? }] (swap detected)
 *   P9.exprCheck(fn, vars, dl)   an expression in vars checked by value: fn(env) → number; dl [{ f, code, hint }]
 *   Builders (r, cp, o) → part: recipSum, recipPair, fracProb, sameTime, fasterShared + fasterTable / fasterSolve,
 *   slowerHome, runWalk, currentRound, windSame, boatSame, workTogether, workOther, workFaster, headStart, crewB, drain,
 *   winsRow, avgSpeed, modelMC, fracJobMC, pipesMC, exprPart, consecInts, windTimeMC, returnSlower, planeRound,
 *   roundTenths, recipMinus, busFaster. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, KP = K.P, ex = HW.ex, t = K.t, ok = K.ok, wrong = K.wrong, F = HW.fmt;
  var LID = 'u6l9', CP = LID + '-';

  /* ======================================================================================================
   * Codes
   * ====================================================================================================== */
  var KC = {
    'other': ['Gave the other quantity, not the one asked for', 's'], 'neg': ['Kept the inadmissible root (a negative speed, time or number)', 's'],
    'w-add': ['Work rate: added the times', 'n'], 'w-avg': ['Work rate: averaged the times', 'n'], 'w-sub': ['Work rate: subtracted the times', 'n'],
    'drain': ['Drain: added its rate instead of subtracting', 'b'], 'head': ['Ignored the time worked alone first', 'b'], 'total': ['Gave the total time, not the time still needed', 's'],
    'mult': ['Time written as distance × speed', 'n'], 'flip': ['Time written as speed ÷ distance', 'n'], 'sign': ['Current or wind on the wrong side (+ for −)', 'b'],
    'ground': ['Gave a ground speed for the airspeed', 's'], 'sq': ['Gave c² instead of c', 's'], 'round': ['Whole number: rounded down instead of up', 's'],
    'raw': ['Gave the non-integer root; the answer must be a whole number', 's'], 'mean': ['Average speed: used the arithmetic mean of the speeds', 'n'],
    'newfrac': ['Gave the new fraction, not the original', 'b'], 'num': ['Gave one number of the fraction, not the fraction', 'b'],
    'min': ['Minutes not changed to hours', 'b'], 'int': ['Kept a root that is not an integer', 's'],
    // the Unit 6 assessment kit's codes used here (roots of a number problem)
    'eq-extr': ['Kept an extraneous root (an NPV)', 'b'], 'eq-rejvalid': ['Rejected a root that checks', 's'], 'eq-nosol': ['Said “no solution” when there is one', 'n'],
    'eq-missing': ['Found only one of the two roots', 's'], 'eq-sign': ['Root(s) with the wrong sign', 's'], 'eq-oneterm': ['Did not multiply every term by the LCD', 'n']
  };
  var MCC = { 'model': 'MC: equation set up with the speeds or times the wrong way', 'job': 'MC: fraction of the job (rate × time) wrong', 'pipes': 'MC: combined time (added or averaged the times)', 'wind': 'MC: time with a headwind or tailwind wrong' };
  function codes(cp) {
    var c = {}, p = {};
    Object.keys(KC).forEach(function (k) { c[cp + k] = KC[k][0]; p[cp + k] = KC[k][1]; });
    Object.keys(MCC).forEach(function (k) { c['mc-' + cp + k] = MCC[k]; p['mc-' + cp + k] = 'n'; });
    HW.addCodes(c); HW.addPartial(p);
  }
  codes(CP); codes('u6l10-'); // the Unit 6 Review (u6l10.js) uses this kit too

  /* ======================================================================================================
   * Small tools
   * ====================================================================================================== */
  function gcd(a, b) { return ex.gcd(Math.abs(a), Math.abs(b)); }
  function lcm(a, b) { return Math.abs(a) / gcd(a, b) * Math.abs(b); }
  function pickWhere(gen, test) { for (var i = 0; i < 20000; i++) { var o = gen(); if (o && test(o)) return o; } throw new Error('u6l9 problems: no instance found'); }
  function nice(x, q) { q = q || 1; return Math.abs(x * q - Math.round(x * q)) < 1e-9; }
  function n(x) { return t(F(x)); }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function rat(x) { for (var q = 1; q <= 60; q++) if (nice(x, q)) return ex.norm(Math.round(x * q), q); return [x, 1]; }
  function fr(p, q) { return ex.texRat(ex.norm(p, q == null ? 1 : q)); }
  function rx(x) { return ex.texRat(rat(x)); }               // 2.5 → \frac{5}{2}
  function dec(x) { return String(F(Math.round(x * 1e6) / 1e6)); } // 2.5 → 2.5
  function lt(v, c) { return c === 0 ? v : v + (c > 0 ? '+' : '-') + F(Math.abs(c)); } // s+5, s-3
  function fac(v, r) { return '(' + lt(v, -r) + ')'; }            // root r → (v − r)
  function coefT(c, first) { return c === 1 ? (first ? '' : '+') : c === -1 ? '-' : (c > 0 && !first ? '+' : '') + F(c); }
  function pt(cs, v) { // cs: coefficients, highest degree first
    var d = cs.length - 1, out = '';
    cs.forEach(function (c, i) {
      var e = d - i; if (c === 0) return;
      var first = out === '';
      if (e === 0) out += (c > 0 && !first ? '+' : c < 0 ? '-' : '') + F(Math.abs(c));
      else out += coefT(c, first) + v + (e > 1 ? '^{' + e + '}' : '');
    });
    return out || '0';
  }
  function hText(h) { // hours as words
    var H = Math.floor(h + 1e-9), m = Math.round((h - H) * 60);
    if (!H) return m + ' minutes';
    return H + (H === 1 ? ' hour' : ' hours') + (m ? ' ' + m + ' minutes' : '');
  }
  function hmT(h) { var H = Math.floor(h + 1e-9), m = Math.round((h - H) * 60); return H ? H + ' h' + (m ? ' ' + m + ' min' : '') : m + ' min'; }
  var TIMES = { 1: '', 2: 'twice', 3: 'three times', 4: 'four times', 5: 'five times', 6: 'six times', 7: 'seven times', 8: 'eight times', 9: 'nine times', 10: 'ten times', 12: 'twelve times' };
  function timesW(k) { return TIMES[k] != null ? TIMES[k] : k + ' times'; }
  function isqrt(x) { var s = Math.round(Math.sqrt(x)); return s * s === x ? s : -1; }
  /* a·v² + b·v + c with integer roots r1, r2 (a = 1): (v − r1)(v − r2) */
  function facT(v, r1, r2) { return r1 === r2 ? fac(v, r1) + '^{2}' : fac(v, r1) + fac(v, r2); }

  /* several number boxes; swapped answers are recognised */
  function boxesN(prompt, specs, sol, hints, text) {
    var fields = specs.map(function (s) { return { label: s.label, name: s.name || s.label.replace(/<[^>]*>|\\\(|\\\)|:$/g, ''), after: s.after, before: s.before }; });
    var checks = specs.map(function (s) { return s.dp != null ? K.approx(s.ans, s.dp, { diag: s.diag }) : K.number(s.ans, s.diag); });
    var keys = specs.map(function (s) { return s.dp != null ? K.roundTo(s.ans, s.dp).toFixed(s.dp) : String(s.ans); });
    var labels = fields.map(function (f) { return f.name; });
    var all = K.fields(checks, { labels: labels });
    var check = function (resp) {
      resp = resp || [];
      for (var i = 0; i < checks.length; i++) for (var j = i + 1; j < checks.length; j++) {
        if (keys[i] === keys[j]) continue;
        if (checks[i](resp[i] == null ? '' : resp[i]).v !== 'correct' && checks[i](resp[j] == null ? '' : resp[j]).v === 'correct' && checks[j](resp[i] == null ? '' : resp[i]).v === 'correct')
          return wrong('swap-answer', 'Right numbers, but in each other’s boxes: check which is the <b>' + labels[i].toLowerCase() + '</b> and which is the <b>' + labels[j].toLowerCase() + '</b>.');
      }
      return all(resp);
    };
    var p = { prompt: prompt, input: { type: 'fields', fields: fields }, check: check, key: keys,
      answer: specs.map(function (s, i) { return s.label + ' ' + t(F(Number(keys[i]))) + (s.after ? ' ' + s.after : ''); }).join(', '), solution: sol, hints: hints || [], text: text };
    var bad = [];
    if (keys.length >= 2 && keys[0] !== keys[1]) { var sw = keys.slice(); sw[0] = keys[1]; sw[1] = keys[0]; bad.push(sw); }
    specs.forEach(function (s, i) { (s.bad || []).forEach(function (b) { if (String(b) === keys[i]) return; var w = keys.slice(); w[i] = String(b); bad.push(w); }); });
    p.bad = bad;
    return p;
  }
  /* an expression in vars checked by value at several points */
  var PTS = [7.31, 11.93, 23.71, 41.13, 5.37, 17.29];
  function exprCheck(fn, vars, dl) {
    function envs() { return PTS.map(function (x, i) { var e = {}; vars.forEach(function (v, j) { e[v] = PTS[(i + 2 * j) % PTS.length] + 0.7 * j; }); return e; }); }
    var E = envs(), T = E.map(fn);
    function same(a, b) { return a.every(function (x, i) { return isFinite(x) && isFinite(b[i]) && Math.abs(x - b[i]) <= 1e-7 * Math.max(1, Math.abs(b[i])); }); }
    return function (resp) {
      var a = K.read(resp); if (a.res) return a.res;
      var used = {}; (function w(x) { if (!x || typeof x !== 'object') return; if (x.t === 'var') used[x.n] = 1; ['a', 'b', 'n'].forEach(function (k) { if (x[k] && typeof x[k] === 'object') w(x[k]); }); })(a.ast);
      var extra = Object.keys(used).filter(function (v) { return vars.indexOf(v) < 0; });
      if (extra.length) return wrong('value', 'Use the letter ' + vars.map(function (v) { return t(v); }).join(' and ') + ' (you wrote ' + t(extra[0]) + ').');
      var sv = E.map(function (e) { return ex.value(a.ast, e); });
      if (same(sv, T)) return ok();
      for (var i = 0; i < (dl || []).length; i++) if (same(sv, E.map(dl[i].f))) return wrong(dl[i].code, dl[i].hint);
      return wrong('value', null);
    };
  }
  function exprBox(label, key, fn, vars, dl, after) { return { label: label, name: label.replace(/<[^>]*>|\\\(|\\\)|:$/g, ''), mode: 'math', keys: 'u6rat', vars: vars, check: exprCheck(fn, vars, dl), key: key, after: after }; }
  function exprFields(prompt, specs, sol, hints, text) {
    var fields = specs.map(function (s) { return { label: s.label, name: s.name, mode: 'math', keys: 'u6rat', vars: s.vars, after: s.after, placeholder: 'e.g. 60/(s+5)' }; });
    var p = KP.fields(prompt, fields, specs.map(function (s) { return s.check; }), specs.map(function (s) { return s.key; }), specs.map(function (s) { return s.label + ' ' + t(s.key); }).join(', '), sol, hints, text);
    p.bad = specs.map(function (s, i) { return (s.badKeys || []).map(function (b) { var w = specs.map(function (z) { return z.key; }); w[i] = b; return w; }); }).reduce(function (a, b) { return a.concat(b); }, []);
    return p;
  }
  function mcPart(r, prompt, opts, sol, hints, text) {
    var seen = {}; opts.forEach(function (o) { if (seen[o.html]) throw new Error('u6l9 mc: two options read the same'); seen[o.html] = 1; });
    return KP.mc(r, prompt, opts, sol, hints, text);
  }
  function A6() { var A = HW.u6assess; if (!A) throw new Error('u6l9.js needs js/lessons/u6test.js (HW.u6assess)'); return A; }

  var P9 = HW.p69 = { codes: codes, boxesN: boxesN, exprCheck: exprCheck, exprBox: exprBox, exprFields: exprFields, mcPart: mcPart, gcd: gcd, lcm: lcm, pickWhere: pickWhere, nice: nice,
    rat: rat, fr: fr, rx: rx, lt: lt, fac: fac, facT: facT, pt: pt, hText: hText, hmT: hmT, timesW: timesW, cap: cap, n: n };

  var H_D = 'Time ' + t('=\\frac{\\text{distance}}{\\text{speed}}') + '. Make a table: a row for each trip, columns distance, speed and time.';

  /* ======================================================================================================
   * Numbers
   * ====================================================================================================== */
  /* the sum (or difference) of a number and its reciprocal: two roots, both valid (#1a) */
  P9.recipSum = function (r, cp, o) {
    o = o || {};
    var kind = o.kind || (r.chance(0.7) ? 'sum' : 'diff');
    var s = pickWhere(function () { return { a: r.int(1, 7), b: r.int(2, 9) }; }, function (z) { return z.a < z.b && gcd(z.a, z.b) === 1 && !(z.a === 2 && z.b === 5) && !(z.a === 2 && z.b === 3) && z.a * z.b <= 42; });
    var a = s.a, b = s.b, D = a * b, N = kind === 'sum' ? a * a + b * b : b * b - a * a, roots, sol;
    if (kind === 'sum') {
      roots = [ex.norm(a, b), ex.norm(b, a)];
      sol = t('n+\\frac{1}{n}=\\frac{' + N + '}{' + D + '}') + ', ' + t('n\\ne 0') + '. Multiply by ' + t(D + 'n') + ': ' + t(D + 'n^{2}+' + D + '=' + N + 'n') + ', so ' + t(pt([D, -N, D], 'n') + '=0') + '.<br>' +
        t('(' + lt(b + 'n', -a).replace(/^1n/, 'n') + ')(' + lt((a === 1 ? '' : a) + 'n', -b) + ')=0') + ': ' + t('n=' + fr(a, b)) + ' or ' + t('n=' + fr(b, a)) + '. Both work (neither is ' + t(0) + ').';
    } else {
      roots = [ex.norm(b, a), ex.norm(-a, b)];
      sol = t('n-\\frac{1}{n}=\\frac{' + N + '}{' + D + '}') + ', ' + t('n\\ne 0') + '. Multiply by ' + t(D + 'n') + ': ' + t(D + 'n^{2}-' + D + '=' + N + 'n') + ', so ' + t(pt([D, -N, -D], 'n') + '=0') + '.<br>' +
        t('(' + lt((a === 1 ? '' : a) + 'n', -b) + ')(' + lt(b + 'n', a) + ')=0') + ': ' + t('n=' + fr(b, a)) + ' or ' + t('n=' + fr(-a, b)) + '. Both work.';
    }
    var p = A6().rootsPart(cp, (kind === 'sum' ? 'The sum of a number and its reciprocal is ' : 'A number minus its reciprocal is ') + t('\\frac{' + N + '}{' + D + '}') + '. Determine the number. (Give every possibility.)', roots, { v: 'n', bothValid: true }, sol,
      ['Let the number be ' + t('n') + ' (' + t('n\\ne 0') + '); its reciprocal is ' + t('\\frac{1}{n}') + '.', 'Multiply every term by the LCD ' + t(D + 'n') + ', write the quadratic in standard form and factor. Check both roots.'], 'a number and its reciprocal');
    p.bad.push('n=' + ex.texRat(roots[0]));
    return p;
  };
  /* two numbers that differ by k: the reciprocals' difference (#1b) — both pairs */
  P9.recipPair = function (r, cp) {
    var s = pickWhere(function () { return { n0: r.int(2, 12), k: r.int(2, 9) }; }, function (z) { return !(z.n0 === 4 && z.k === 6) && z.n0 !== z.k; });
    var n0 = s.n0, k = s.k, Pp = n0 * (n0 + k), q = ex.norm(k, Pp), c = q[0], d = q[1], n2 = -(n0 + k);
    var sol = 'Smaller number ' + t('n') + ', larger ' + t('n+' + k) + ': ' + t('\\frac{1}{n}-\\frac{1}{n+' + k + '}=\\frac{' + c + '}{' + d + '}') + ', ' + t('n\\ne 0,\\ -' + k) + '.<br>' +
      'Multiply by ' + t((d === 1 ? '' : d) + 'n(n+' + k + ')') + ': ' + t(d + '(n+' + k + ')-' + d + 'n=' + (c === 1 ? '' : c) + 'n(n+' + k + ')') + ', so ' + t(F(d * k) + '=' + (c === 1 ? '' : c) + 'n^{2}+' + (c * k) + 'n') + (c === 1 ? '' : ' and ' + t(F(d * k / c) + '=n^{2}+' + k + 'n')) + '.<br>' +
      t(pt([1, k, -Pp], 'n') + '=0') + ', ' + t(facT('n', n0, n2) + '=0') + ': ' + t('n=' + n0) + ' or ' + t('n=' + n2) + '.<br>' +
      'Both work: the numbers are ' + t(n0) + ' and ' + t(n0 + k) + ', or ' + t(n2) + ' and ' + t(n2 + k) + '.';
    var p = A6().rootsPart(cp, 'One number is ' + t(k) + ' more than another. The reciprocal of the smaller number minus the reciprocal of the larger number is ' + t('\\frac{' + c + '}{' + d + '}') + '. Determine the <b>smaller</b> number. (Give every possibility.)', [n0, n2], { v: 'n', bothValid: true,
      wrongs: [{ vals: [n0 + k, n2 + k], code: cp + 'other', hint: 'Those are the <b>larger</b> numbers. The question asks for the smaller one of each pair.' }, { vals: [n0], code: cp + 'eq-rejvalid', hint: 'The negative root works too: check ' + t('\\frac{1}{' + n2 + '}-\\frac{1}{' + (n2 + k) + '}') + '. Nothing says the numbers are positive.' }] }, sol,
      ['Let the smaller number be ' + t('n') + '; the larger is ' + t('n+' + k) + '.', 'Multiply by the LCD, solve the quadratic and check <b>both</b> roots: a negative number can work.'], 'reciprocals of two numbers');
    return p;
  };
  /* a fraction: numerator k less than the denominator; numerator multiplied, denominator increased (#2) */
  P9.fracProb = function (r, cp) {
    var MW = { 2: 'doubled', 3: 'tripled', 4: 'multiplied by ' + t(4), 5: 'multiplied by ' + t(5) };
    var s = pickWhere(function () { return { d: r.int(5, 20), k: r.int(1, 9), m: r.pick([2, 2, 3, 3, 4]), j: r.int(1, 12) }; }, function (z) {
      var N = z.d - z.k; if (N < 1 || gcd(N, z.d) !== 1) return false;
      var q = ex.norm(z.m * N, z.d + z.j); z.p = q[0]; z.q = q[1];
      return z.m * z.q !== z.p && !(z.d === 9 && z.k === 4 && z.m === 3 && z.j === 6) && !(z.d === 17 && z.k === 5) && z.q <= 12 && z.p <= 20;
    });
    var N = s.d - s.k, lhs = s.m * s.q - s.p, rhs = s.m * s.q * s.k + s.p * s.j, newT = s.q === 1 ? String(s.p) : fr(s.p, s.q);
    var eqT = '\\frac{' + s.m + '(d-' + s.k + ')}{d+' + s.j + '}=' + newT;
    var sol = 'Denominator ' + t('d') + ', numerator ' + t('d-' + s.k) + ': ' + t(eqT) + ', ' + t('d\\ne -' + s.j) + '.<br>' +
      (s.q === 1 ? t(s.m + '(d-' + s.k + ')=' + (s.p === 1 ? 'd+' + s.j : s.p + '(d+' + s.j + ')')) : 'Cross-multiply: ' + t(s.q + '\\cdot ' + s.m + '(d-' + s.k + ')=' + s.p + '(d+' + s.j + ')')) + ', so ' + t(pt([s.m * s.q, -s.m * s.q * s.k], 'd') + '=' + pt([s.p, s.p * s.j], 'd')) + (lhs === 1 ? '' : ' and ' + t(pt([lhs, 0], 'd') + '=' + F(rhs))) + ', ' + t('d=' + s.d) + '.<br>' +
      'The fraction is ' + t('\\frac{' + N + '}{' + s.d + '}') + '. Check: ' + t('\\frac{' + s.m * N + '}{' + (s.d + s.j) + '}=' + newT) + ' ✓';
    var nf = ex.norm(s.m * N, s.d + s.j);
    var p = KP.math('The numerator of a fraction is ' + t(s.k) + ' less than its denominator. If the numerator is ' + MW[s.m] + ' and the denominator is increased by ' + t(s.j) + ', the new fraction is equal to ' + t(newT) + '. Determine the original fraction.',
      K.fraction([N, s.d], { diag: function (v) { if (Math.abs(v - s.d) < 1e-9 || Math.abs(v - N) < 1e-9) return { code: cp + 'num', hint: 'That is one number of the fraction. Write the whole fraction ' + t('\\frac{\\text{numerator}}{\\text{denominator}}') + '.' }; if (Math.abs(v - nf[0] / nf[1]) < 1e-9) return { code: cp + 'newfrac', hint: 'That is the <b>new</b> fraction. The question asks for the original one.' }; return null; } }),
      '\\frac{' + N + '}{' + s.d + '}', sol, ['Let the denominator be ' + t('d') + '; the numerator is ' + t('d-' + s.k) + '.', 'Write the new fraction, set it equal to ' + t(newT) + ' and solve.'], 'a fraction problem', { keys: 'u6num' });
    p.bad = [String(s.d), '\\frac{' + s.m * N + '}{' + (s.d + s.j) + '}'];
    return p;
  };

  /* ======================================================================================================
   * Distance, speed and time
   * ====================================================================================================== */
  var SAME = [
    { a: 'A train', b: 'a car', fa: 'train', sl: 'car', s: [50, 90], k: [10, 45], st: 5, T: [1.5, 2, 2.5, 3, 4] },
    { a: 'A car', b: 'a cyclist', fa: 'car', sl: 'cyclist', s: [15, 30], k: [30, 60], st: 1, T: [1.5, 2, 2.5, 3] },
    { a: 'A motorboat', b: 'a canoe', fa: 'motorboat', sl: 'canoe', s: [4, 9], k: [10, 25], st: 1, T: [1.5, 2, 2.5, 3, 4] },
    { a: 'A jet', b: 'a propeller plane', fa: 'jet', sl: 'propeller plane', s: [25, 45], k: [20, 40], st: 10, T: [1.5, 2, 2.5, 3] },
    { a: 'A cyclist', b: 'a walker', fa: 'cyclist', sl: 'walker', s: [4, 7], k: [6, 15], st: 1, T: [1.5, 2, 2.5, 3] }];
  /* the same time (#3, EP A3) */
  P9.sameTime = function (r, cp, o) {
    o = o || {};
    var C = o.ctx != null ? SAME[o.ctx] : r.pick(SAME);
    var z = pickWhere(function () { var sp = C.st === 10 ? 10 * r.int(C.s[0], C.s[1]) : C.st * r.int(Math.ceil(C.s[0] / C.st), Math.floor(C.s[1] / C.st)); return { s: sp, k: C.st === 10 ? 10 * r.int(C.k[0], C.k[1]) : C.st * r.int(Math.ceil(C.k[0] / C.st), Math.floor(C.k[1] / C.st)), T: r.pick(C.T) }; }, function (z) {
      return nice(z.s * z.T) && nice((z.s + z.k) * z.T) && !(z.s === 70 && z.k === 30) && !(z.s === 12 && z.k === 15) && !(z.s === 6 && z.k === 10) && !(z.s === 60 && z.k === 12) && z.k !== z.s;
    });
    var s = z.s, k = z.k, T = z.T, d1 = (s + k) * T, d2 = s * T;
    var sol = cap(C.sl) + ' ' + t('s') + ', ' + C.fa + ' ' + t('s+' + k) + ' (km/h). The same time: ' + t('\\frac{' + F(d1) + '}{s+' + k + '}=\\frac{' + F(d2) + '}{s}') + ', ' + t('s\\ne 0,\\ -' + k) + '.<br>' +
      'Cross-multiply: ' + t(F(d1) + 's=' + F(d2) + '(s+' + k + ')') + ', so ' + t(F(d1 - d2) + 's=' + F(d2 * k)) + ' and ' + t('s=' + F(s)) + '.<br>' +
      cap(C.sl) + ' ' + n(s) + ' km/h, ' + C.fa + ' ' + n(s + k) + ' km/h; each takes ' + t('\\frac{' + F(d2) + '}{' + F(s) + '}=' + dec(T)) + ' h.';
    var specs = [{ label: cap(C.sl) + ':', ans: s, after: 'km/h' }, { label: cap(C.fa) + ':', ans: s + k, after: 'km/h' }];
    if (!o.noTime) specs.push({ label: 'Time:', ans: T, after: 'h', diag: function (v) { if (Math.abs(v - d1 / d2) < 1e-9) return { code: 'value', hint: 'Time is distance ÷ speed for one of the trips, e.g. ' + t('\\frac{' + F(d2) + '}{s}') + '.' }; return null; } });
    return boxesN(C.a + ' travels ' + n(d1) + ' km in the same time that ' + C.b + ' travels ' + n(d2) + ' km. The ' + C.fa + '’s average speed is ' + n(k) + ' km/h greater than the ' + C.sl + '’s. Determine ' + (o.noTime ? 'both speeds.' : 'each average speed and the time taken.'), specs, sol,
      [H_D + ' Let the slower speed be ' + t('s') + '.', 'The times are equal: one fraction on each side, then cross-multiply.'], 'the same time');
  };
  /* "if she went k km/h faster, the trip would take h less": shared numbers (#4, L10 #22–23, EP10 #17) */
  P9.fasterShared = function (r, o) {
    o = o || {};
    var kind = o.kind || 'cycle';
    return pickWhere(function () {
      if (kind === 'cycle') { var w = r.pick([['Priya', 'she', 'her'], ['Jonah', 'he', 'his'], ['Aiyana', 'she', 'her'], ['Mateo', 'he', 'his'], ['Grace', 'she', 'her']]); return { s: r.int(8, 30), k: r.int(2, 8), h: r.pick([1, 1, 0.5, 2]), who: w[0], she: w[1], her: w[2], verb: 'cycles', kind: kind }; }
      var d = r.pick([['Sara', 'she', 'her'], ['Devon', 'he', 'his'], ['Mrs. Patel', 'she', 'her'], ['Marc', 'he', 'his'], ['Leah', 'she', 'her']]);
      return { s: 5 * r.int(10, 20), k: 5 * r.int(1, 6), h: r.pick([0.5, 0.5, 1, 0.75]), who: d[0], she: d[1], her: d[2], verb: 'drives', kind: kind };
    }, function (z) {
      z.D = z.h * z.s * (z.s + z.k) / z.k;
      return nice(z.D) && z.D >= 20 && z.D <= 600 && nice(z.D / z.s, 4) && nice(z.D / (z.s + z.k), 4) && !(z.D === 60 && z.k === 5 && z.h === 1) && !(z.D === 150 && z.k === 25) && !(z.D === 280 && z.k === 10) && !(z.D === 160 && z.k === 20) && !(z.D === 180 && z.k === 15) && !(o.not && o.not(z));
    });
  };
  function fasterEq(z) { var h = rat(z.h); return { h: h, eqT: '\\frac{' + F(z.D) + '}{s}-\\frac{' + F(z.D) + '}{s+' + z.k + '}=' + ex.texRat(h), C: z.D * z.k / z.h }; }
  P9.fasterSol = function (z) {
    var E = fasterEq(z), h = E.h, mul = (h[1] === 1 ? '' : h[1]) + 's(s+' + z.k + ')', neg = -(z.s + z.k);
    return 'Actual speed ' + t('s') + ', faster ' + t('s+' + z.k) + '. The actual trip takes ' + hText(z.h) + ' longer: ' + t(E.eqT) + ', ' + t('s\\ne 0,\\ -' + z.k) + '.<br>' +
      'Multiply by ' + t(mul) + ': ' + t(F(h[1] * z.D) + '(s+' + z.k + ')-' + F(h[1] * z.D) + 's=' + (h[0] === 1 ? '' : h[0]) + 's(s+' + z.k + ')') + ', so ' + t(F(h[1] * z.D * z.k) + '=' + pt([h[0], h[0] * z.k, 0], 's')) + (h[0] === 1 ? '' : ' and ' + t(F(E.C) + '=' + pt([1, z.k, 0], 's'))) + '.<br>' +
      t(pt([1, z.k, -E.C], 's') + '=0') + ', ' + t(facT('s', z.s, neg) + '=0') + ': ' + t('s=' + F(z.s)) + ' (reject ' + t('s=' + F(neg)) + ': a speed is positive).';
  }
  P9.fasterTable = function (r, cp, z, o) {
    o = o || {};
    var D = z.D, k = z.k, dl = function (fs) { return [
      { f: function (e) { return D * fs(e); }, code: cp + 'mult', hint: 'Time is distance <b>divided by</b> speed, not multiplied.' },
      { f: function (e) { return fs(e) / D; }, code: cp + 'flip', hint: 'Upside down: time ' + t('=\\frac{\\text{distance}}{\\text{speed}}') + '.' }]; };
    var f1 = function (e) { return e.s; }, f2 = function (e) { return e.s + k; };
    var b1 = { label: o.l1 || 'Time, actual:', name: o.n1 || 'Time (actual)', vars: ['s'], key: '\\frac{' + F(D) + '}{s}', check: exprCheck(function (e) { return D / e.s; }, ['s'], dl(f1)), after: 'h', badKeys: [F(D) + 's'] };
    var b2 = { label: o.l2 || 'Time, faster:', name: o.n2 || 'Time (faster)', vars: ['s'], key: '\\frac{' + F(D) + '}{s+' + k + '}', check: exprCheck(function (e) { return D / (e.s + k); }, ['s'], dl(f2).concat([{ f: function (e) { return D / (e.s - k); }, code: cp + 'sign', hint: 'The faster speed is ' + t('s+' + k) + '.' }])), after: 'h', badKeys: ['\\frac{' + F(D) + '}{s-' + k + '}'] };
    return exprFields(o.prompt || ('Complete the time column of the table, using ' + t('s') + ' for the actual speed (km/h).<br>' + t('\\begin{array}{|l|c|c|c|}\\hline & \\text{Distance (km)} & \\text{Speed (km/h)} & \\text{Time (h)}\\\\\\hline \\text{Actual} & ' + F(D) + ' & s & ?\\\\\\hline \\text{Faster} & ' + F(D) + ' & s+' + k + ' & ?\\\\\\hline\\end{array}')),
      [b1, b2], 'Time ' + t('=\\frac{\\text{distance}}{\\text{speed}}') + ': actual ' + t('\\frac{' + F(D) + '}{s}') + ' h, faster ' + t('\\frac{' + F(D) + '}{s+' + k + '}') + ' h.', [H_D], 'times in a table');
  };
  P9.fasterSolve = function (r, cp, z, o) {
    o = o || {};
    var neg = -(z.s + z.k), T = z.D / z.s, Tf = z.D / (z.s + z.k);
    return boxesN(o.prompt || 'Write an equation and determine ' + z.her + ' actual speed and time.', [
      { label: 'Speed:', ans: z.s, after: 'km/h', diag: function (v) { if (v === neg) return { code: cp + 'neg', hint: 'Reject the negative root: ' + t('s=' + neg) + ' is not a speed.' }; if (v === z.s + z.k) return { code: cp + 'other', hint: 'That is the faster speed. Give the actual speed ' + t('s') + '.' }; return null; }, bad: [z.s + z.k] },
      { label: 'Time:', ans: T, after: 'h', diag: function (v) { if (Math.abs(v - Tf) < 1e-9) return { code: cp + 'other', hint: 'That is the time for the faster trip.' }; return null; }, bad: [Tf] }],
      P9.fasterSol(z) + '<br>Actual speed ' + n(z.s) + ' km/h for ' + t('\\frac{' + F(z.D) + '}{' + F(z.s) + '}=' + dec(T)) + ' h (the faster trip would take ' + dec(Tf) + ' h).',
      ['The actual time minus the faster time is ' + hText(z.h) + (z.h < 1 ? ' (in hours: ' + t(rx(z.h)) + ')' : '') + '.', 'Multiply by the LCD, solve the quadratic and reject the negative root.'], 'a time saved: a quadratic');
  };
  /* the trip home is slower and takes longer (#5) */
  P9.slowerHome = function (r, cp) {
    var C = r.pick([['A family drives', 'to a lake', 'On the way home, in heavy traffic, they average'], ['A trucker drives', 'to a depot', 'On the way back, in a snowstorm, she averages'], ['Mr. Okafor drives', 'to a conference', 'On the way home, in construction zones, he averages']]);
    var z = pickWhere(function () { return { s: 5 * r.int(12, 22), k: 5 * r.int(1, 5), h: r.pick([0.5, 0.5, 1, 0.75]) }; }, function (z) {
      z.D = z.h * z.s * (z.s - z.k) / z.k;
      return nice(z.D) && z.D >= 60 && z.D <= 600 && nice(z.D / z.s, 4) && nice(z.D / (z.s - z.k), 4) && !(z.D === 225 && z.k === 15) && !(z.D === 540 && z.k === 30) && !(z.D === 280 && z.k === 10);
    });
    var D = z.D, s = z.s, k = z.k, h = rat(z.h), Cc = D * k / z.h, neg = -(s - k), T1 = D / s, T2 = D / (s - k);
    var sol = 'Going ' + t('s') + ', home ' + t('s-' + k) + '. The trip home takes ' + hText(z.h) + ' longer: ' + t('\\frac{' + F(D) + '}{s-' + k + '}-\\frac{' + F(D) + '}{s}=' + ex.texRat(h)) + ', ' + t('s\\ne 0,\\ ' + k) + '.<br>' +
      'Multiply by ' + t((h[1] === 1 ? '' : h[1]) + 's(s-' + k + ')') + ': ' + t(F(h[1] * D) + 's-' + F(h[1] * D) + '(s-' + k + ')=' + (h[0] === 1 ? '' : h[0]) + 's(s-' + k + ')') + ', so ' + t(F(h[1] * D * k) + '=' + pt([h[0], -h[0] * k, 0], 's')) + '.<br>' +
      t(pt([1, -k, -Cc], 's') + '=0') + ', ' + t(facT('s', s, neg) + '=0') + ': ' + t('s=' + s) + ' (reject ' + t('s=' + neg) + ').<br>' +
      'Going: ' + n(s) + ' km/h for ' + dec(T1) + ' h. Home: ' + n(s - k) + ' km/h for ' + dec(T2) + ' h.';
    return boxesN(C[0] + ' ' + n(D) + ' km ' + C[1] + '. ' + C[2] + ' ' + n(k) + ' km/h less and the trip takes ' + hText(z.h) + ' longer. Determine the average speed and the time for each direction.', [
      { label: 'Going, speed:', name: 'Speed going', ans: s, after: 'km/h', diag: function (v) { if (v === neg) return { code: cp + 'neg', hint: 'Reject the negative root: a speed is positive.' }; if (v === s - k) return { code: cp + 'other', hint: 'That is the speed home. Going is the faster direction.' }; return null; }, bad: [s - k] },
      { label: 'Going, time:', name: 'Time going', ans: T1, after: 'h', bad: [T2] },
      { label: 'Home, speed:', name: 'Speed home', ans: s - k, after: 'km/h' },
      { label: 'Home, time:', name: 'Time home', ans: T2, after: 'h' }], sol,
      [H_D + ' Let the speed going be ' + t('s') + '; home is ' + t('s-' + k) + '.', 'The slower trip’s time minus the faster trip’s time is ' + hText(z.h) + ' (' + t(ex.texRat(h)) + ' h). Multiply by the LCD and solve the quadratic.'], 'a slower return: a quadratic');
  };
  /* runs, then walks: total time; to the nearest tenth (#6) */
  P9.runWalk = function (r, cp) {
    var who = r.pick(['Noah', 'Ella', 'Sam', 'Lucia']), pr = who === 'Ella' || who === 'Lucia' ? 'Her' : 'His';
    var z = pickWhere(function () { return { d1: r.int(5, 15), d2: r.int(1, 5), k: r.int(3, 6), T: r.pick([1.5, 2, 2.5, 3]) }; }, function (z) {
      var q = rat(z.T); z.a = q[0]; z.q = q[1];
      z.B = z.a * z.k - z.q * (z.d1 + z.d2); z.Cc = -z.q * z.d2 * z.k; z.disc = z.B * z.B - 4 * z.a * z.Cc;
      if (isqrt(z.disc) >= 0) return false;
      z.w = (-z.B + Math.sqrt(z.disc)) / (2 * z.a);
      var f = z.w * 10 - Math.floor(z.w * 10);
      return z.w >= 2.5 && z.w <= 7 && Math.abs(f - 0.5) > 0.06 && !(z.d1 === 12 && z.d2 === 3 && z.k === 4) && z.d1 / (z.w + z.k) > 0.3;
    });
    var g = gcd(gcd(z.a, z.B), z.Cc), A = z.a / g, B = z.B / g, C2 = z.Cc / g, Dd = B * B - 4 * A * C2, w = z.w;
    var sol = 'Walking ' + t('w') + ', running ' + t('w+' + z.k) + ' (km/h): ' + t('\\frac{' + z.d1 + '}{w+' + z.k + '}+\\frac{' + z.d2 + '}{w}=' + rx(z.T)) + ', ' + t('w\\ne 0,\\ -' + z.k) + '.<br>' +
      'Multiply by ' + t((z.q === 1 ? '' : z.q) + 'w(w+' + z.k + ')') + ': ' + t((z.q * z.d1) + 'w+' + (z.q * z.d2) + '(w+' + z.k + ')=' + (z.a === 1 ? '' : z.a) + 'w(w+' + z.k + ')') + ', so ' + t(pt([A, B, C2], 'w') + '=0') + '.<br>' +
      'It does not factor: ' + t('w=\\frac{' + (-B) + '\\pm\\sqrt{' + Dd + '}}{' + 2 * A + '}') + '; ' + t('w\\approx ' + K.roundTo(w, 2).toFixed(2)) + ' (the other root is negative).<br>' +
      'Walking about ' + t(K.roundTo(w, 1).toFixed(1)) + ' km/h, running about ' + t(K.roundTo(w + z.k, 1).toFixed(1)) + ' km/h.';
    var negR = (-B - Math.sqrt(Dd)) / (2 * A);
    return boxesN(who + ' runs ' + n(z.d1) + ' km and then walks ' + n(z.d2) + ' km. ' + pr + ' running speed is ' + n(z.k) + ' km/h greater than ' + pr.toLowerCase() + ' walking speed, and the whole route takes ' + dec(z.T) + ' h. Determine ' + pr.toLowerCase() + ' walking and running speeds, to the nearest tenth of a km/h.', [
      { label: 'Walking:', ans: w, dp: 1, after: 'km/h', diag: function (v) { if (Math.abs(v - K.roundTo(negR, 1)) < 1e-9 || Math.abs(v + K.roundTo(negR, 1)) < 1e-9) return { code: cp + 'neg', hint: 'That comes from the negative root. Use the positive root.' }; return null; } },
      { label: 'Running:', ans: w + z.k, dp: 1, after: 'km/h' }], sol,
      [H_D + ' Let the walking speed be ' + t('w') + '. Add the two times.', 'Multiply by the LCD; the quadratic does not factor, so use the quadratic formula and keep the positive root.'], 'run and walk: the quadratic formula');
  };
  /* down a river and back: the current (#7, EP B2) */
  P9.currentRound = function (r, cp, o) {
    o = o || {};
    var jet = o.jet != null ? o.jet : r.chance(0.3);
    var z = pickWhere(function () { return jet ? { b: r.int(20, 40), c: r.int(2, 9), d: 2 * r.int(10, 30) } : { b: r.int(5, 12), c: r.int(2, 5), d: r.int(4, 30) }; }, function (z) {
      z.T = 2 * z.b * z.d / (z.b * z.b - z.c * z.c);
      return z.c < z.b / 2 && nice(z.T, 4) && z.T <= 9 && z.T >= 1 && !(z.b === 6 && z.c === 2 && z.d === 12) && !(z.b === 30 && z.c === 6 && z.d === 36);
    });
    var b = z.b, c = z.c, d = z.d, q = rat(z.T), a = q[0], qq = q[1], two = 2 * qq * b * d, ab2 = a * b * b;
    var sol = 'Current ' + t('c') + ': downstream ' + t(b + '+c') + ', upstream ' + t(b + '-c') + '. ' + t('\\frac{' + d + '}{' + b + '+c}+\\frac{' + d + '}{' + b + '-c}=' + ex.texRat(q)) + ', ' + t('c\\ne\\pm ' + b) + '.<br>' +
      'Multiply by ' + t((qq === 1 ? '' : qq) + '(' + b + '+c)(' + b + '-c)') + ': ' + t((qq * d) + '(' + b + '-c)+' + (qq * d) + '(' + b + '+c)=' + (a === 1 ? '' : a) + '(' + b * b + '-c^{2})') + ', so ' + t(F(two) + '=' + F(ab2) + (a === 1 ? '-c^{2}' : '-' + a + 'c^{2}')) + ' and ' + t('c^{2}=' + c * c) + '.<br>' +
      t('c=' + c) + ' km/h (reject ' + t('c=-' + c) + '). Check: ' + t('\\frac{' + d + '}{' + (b + c) + '}+\\frac{' + d + '}{' + (b - c) + '}=' + dec(z.T)) + ' ✓';
    var p = KP.number((jet ? 'A jet boat travels at ' + n(b) + ' km/h in still water. It goes ' + n(d) + ' km up a river and ' + n(d) + ' km back in ' + dec(z.T) + ' h.' : 'A canoeist who paddles at ' + n(b) + ' km/h in still water goes ' + n(d) + ' km downstream and returns to the start in a total of ' + dec(z.T) + ' h.') + ' Determine the speed of the current.', c,
      function (v) { if (v === -c) return { code: cp + 'neg', hint: 'Reject the negative root: the current’s speed is positive.' }; if (v === c * c) return { code: cp + 'sq', hint: 'That is ' + t('c^{2}') + '. Take the square root.' }; if (v === b + c || v === b - c) return { code: cp + 'other', hint: 'That is the boat’s speed with or against the current. The question asks for the current ' + t('c') + '.' }; return null; },
      sol, ['Downstream the speed is ' + t(b + '+c') + '; upstream ' + t(b + '-c') + '. Add the two times.', 'Multiply by the LCD: the ' + t('c') + ' terms cancel and you are left with ' + t('c^{2}') + '.'], 'a current: a round trip', { after: 'km/h' });
    p.bad = [String(c * c), String(b - c)].filter(function (x) { return x !== String(c); });
    return p;
  };
  /* a tailwind and a headwind, the same time (#8; o.nr: the airspeed only, numerical response) */
  P9.windSame = function (r, cp, o) {
    o = o || {};
    var z = pickWhere(function () { return { s: 10 * r.int(12, 45), w: 10 * r.int(2, 7), T: r.pick([1.5, 2, 2.5, 3, 4]) }; }, function (z) {
      return z.w < z.s / 3 && nice((z.s + z.w) * z.T) && nice((z.s - z.w) * z.T) && !(z.s === 195) && !(z.s === 400 && z.w === 50) && (z.s + z.w) * z.T <= 2000;
    });
    var s = z.s, w = z.w, dT = (s + w) * z.T, dH = (s - w) * z.T;
    var sol = 'Airspeed ' + t('s') + ': with the tailwind ' + t('s+' + w) + ', into the headwind ' + t('s-' + w) + '. The same time: ' + t('\\frac{' + F(dT) + '}{s+' + w + '}=\\frac{' + F(dH) + '}{s-' + w + '}') + ', ' + t('s\\ne\\pm ' + w) + '.<br>' +
      'Cross-multiply: ' + t(F(dT) + '(s-' + w + ')=' + F(dH) + '(s+' + w + ')') + ', so ' + t(F(dT) + 's-' + F(dT * w) + '=' + F(dH) + 's+' + F(dH * w)) + ', ' + t(F(dT - dH) + 's=' + F((dT + dH) * w)) + ' and ' + t('s=' + F(s)) + ' km/h.<br>' +
      'Each flight takes ' + t('\\frac{' + F(dT) + '}{' + F(s + w) + '}=' + dec(z.T)) + ' h.';
    var diag = function (v) { if (v === s + w || v === s - w) return { code: cp + 'ground', hint: 'That is a ground speed (with or against the wind). The airspeed is the speed in still air, ' + t('s') + '.' }; return null; };
    var prompt = 'With a ' + n(w) + ' km/h tailwind, a small plane flies ' + n(dT) + ' km in the same time it flies ' + n(dH) + ' km into the same wind (a headwind). ';
    var hints = ['With the wind the speed is ' + t('s+' + w) + '; against it ' + t('s-' + w) + '.', 'The times ' + t('\\frac{\\text{distance}}{\\text{speed}}') + ' are equal: cross-multiply.'];
    if (o.nr) { var p = KP.nr('<i>(Numerical Response)</i> ' + prompt + 'The plane’s airspeed, in km/h, is ________.', s, diag, sol, hints, 'NR: airspeed'); p.bad = [String(s + w)]; return p; }
    return boxesN(prompt + 'Determine the plane’s airspeed (its speed in still air) and the time for each flight.', [{ label: 'Airspeed:', ans: s, after: 'km/h', diag: diag, bad: [s + w] }, { label: 'Time:', ans: z.T, after: 'h' }], sol, hints, 'wind: the same time');
  };
  /* downstream and upstream, the same time: the current and the time (L10 #21) */
  P9.boatSame = function (r, cp) {
    var z = pickWhere(function () { return { b: r.int(10, 30), c: r.int(1, 8), T: r.pick([1, 1.5, 2, 2.5, 3]) }; }, function (z) { return z.c < z.b / 3 && nice((z.b + z.c) * z.T) && nice((z.b - z.c) * z.T) && !(z.b === 20 && z.c === 4); });
    var b = z.b, c = z.c, dD = (b + c) * z.T, dU = (b - c) * z.T;
    var sol = t('\\frac{' + F(dD) + '}{' + b + '+c}=\\frac{' + F(dU) + '}{' + b + '-c}') + ', ' + t('c\\ne\\pm ' + b) + '. Cross-multiply: ' + t(F(dD) + '(' + b + '-c)=' + F(dU) + '(' + b + '+c)') + ', so ' + t(F(dD * b) + '-' + F(dD) + 'c=' + F(dU * b) + '+' + F(dU) + 'c') + ' and ' + t(F((dD - dU) * b) + '=' + F(dD + dU) + 'c') + ': ' + t('c=' + c) + '.<br>' +
      'Current ' + n(c) + ' km/h; each trip takes ' + t('\\frac{' + F(dD) + '}{' + (b + c) + '}=' + dec(z.T)) + ' h.';
    return boxesN('A boat that travels at ' + n(b) + ' km/h in still water goes ' + n(dD) + ' km downstream in the same time it goes ' + n(dU) + ' km upstream. Determine the speed of the current and the time for each trip.', [
      { label: 'Current:', ans: c, after: 'km/h', diag: function (v) { if (v === b + c || v === b - c) return { code: cp + 'other', hint: 'That is the boat’s speed with or against the current. The current is ' + t('c') + '.' }; return null; }, bad: [b + c] },
      { label: 'Time:', ans: z.T, after: 'h' }], sol,
      ['Downstream ' + t(b + '+c') + ', upstream ' + t(b + '-c') + '. The times are equal.', 'Cross-multiply and solve for ' + t('c') + '; then time = distance ÷ speed.'], 'current: the same time');
  };

  /* ======================================================================================================
   * Work rate
   * ====================================================================================================== */
  var WORK = [
    { a: 'One printer', b: 'another printer', job: 'print the yearbooks', u: 'min', m: true },
    { a: 'One garden hose', b: 'a second hose', job: 'fill a pond', u: 'min', m: true },
    { a: 'Ana', b: 'Ben', job: 'mow a lawn', u: 'min', m: true },
    { a: 'Ali', b: 'Sam', job: 'tile a floor', u: 'h' },
    { a: 'One crew', b: 'a second crew', job: 'paint a house', u: 'h' },
    { a: 'Kai', b: 'Mo', job: 'wash the team’s jerseys', u: 'h' },
    { a: 'One pump', b: 'a second pump', job: 'drain a pool', u: 'h' }];
  function togetherPair(r, u, avoid, q) {
    return pickWhere(function () { return u === 'min' ? { a: r.int(10, 90), b: r.int(12, 120) } : { a: r.int(2, 24), b: r.int(3, 30) }; }, function (z) {
      z.t = z.a * z.b / (z.a + z.b); if (q && !nice(z.t)) { if (!nice(z.t, q)) return false; } else if (!nice(z.t)) return false;
      var bad = [[30, 45], [4, 6], [3, 6], [40, 60], [30, 60], [6, 12]].concat(avoid || []);
      return z.a < z.b && z.t >= 1.5 && !bad.some(function (p) { return p[0] === z.a && p[1] === z.b; });
    });
  }
  /* together (#9a, EP A4; o.nr: numerical response) */
  P9.workTogether = function (r, cp, o) {
    o = o || {};
    var C = o.ctx != null ? WORK[o.ctx] : r.pick(WORK), z = togetherPair(r, C.u), u = C.u === 'min' ? 'min' : 'h', L = lcm(z.a, z.b);
    var sol = t('\\frac{t}{' + z.a + '}+\\frac{t}{' + z.b + '}=1') + '. Multiply by ' + t(L) + ': ' + t((L / z.a === 1 ? '' : L / z.a) + 't+' + (L / z.b === 1 ? '' : L / z.b) + 't=' + L) + ', so ' + t((L / z.a + L / z.b) + 't=' + L) + ' and ' + t('t=' + z.t) + ' ' + u + '.';
    var diag = function (v) { if (v === z.a + z.b) return { code: cp + 'w-add', hint: 'Working together is <b>faster</b> than either one alone. Add the parts of the job: ' + t('\\frac{t}{' + z.a + '}+\\frac{t}{' + z.b + '}=1') + '.' }; if (v === (z.a + z.b) / 2) return { code: cp + 'w-avg', hint: 'Do not average the times: together takes less time than the faster one alone.' }; return null; };
    var hints = ['In ' + t('t') + ' ' + u + ' the first does ' + t('\\frac{t}{' + z.a + '}') + ' of the job and the second ' + t('\\frac{t}{' + z.b + '}') + '.', 'Together they do one whole job: the parts add to ' + t(1) + '.'];
    var p;
    if (o.nr) p = KP.nr('<i>(Numerical Response)</i> ' + C.a + ' can ' + C.job + ' in ' + n(z.a) + ' ' + u + ' and ' + C.b + ' can do it in ' + n(z.b) + ' ' + u + '. Working together, the number of ' + (u === 'min' ? 'minutes' : 'hours') + ' to ' + C.job + ' is ________.', z.t, diag, sol, hints, 'NR: work together');
    else p = KP.number(C.a + ' can ' + C.job + ' in ' + n(z.a) + ' ' + u + ' and ' + C.b + ' can do it in ' + n(z.b) + ' ' + u + '. How long will the job take working together?', z.t, diag, sol, hints, 'work rate: together', { after: u });
    p.bad = [String(z.a + z.b)];
    return p;
  };
  /* one alone and together given: the other (#9b, L10 #24 with o.min: the together time in h and min) */
  P9.workOther = function (r, cp, o) {
    o = o || {};
    var C = o.ctx != null ? WORK[o.ctx] : r.pick(o.min ? [WORK[3], WORK[5], WORK[4], WORK[6]] : WORK), u = C.u === 'min' ? 'min' : 'h';
    var z = pickWhere(function () { return o.min ? { a: r.int(2, 9), tt: r.int(6, 50) / 10 } : u === 'min' ? { a: r.int(10, 60), tt: r.int(5, 50) } : { a: r.int(3, 20), tt: r.int(2, 12) }; }, function (z) {
      z.x = z.a * z.tt / (z.a - z.tt);
      return z.tt < z.a && nice(z.x) && z.x <= (u === 'min' ? 150 : 40) && z.x !== z.a && (!o.min || (!nice(z.tt) && nice(z.tt * 60) && z.tt > 1)) && !(z.a === 6 && z.tt === 4) && !(z.a === 3 && z.tt === 2) && !(z.a === 3 && Math.abs(z.tt - 1.2) < 1e-9);
    });
    var tt = z.tt, a = z.a, x = z.x, tq = rat(tt), tT = o.min ? dec(tt) : String(tt);
    var sol = (o.min ? hmT(tt) + ' ' + t('=' + dec(tt)) + ' h. ' : '') + 'The other alone: ' + t('x') + ' ' + u + ', ' + t('x\\ne 0') + '. ' + t('\\frac{' + tT + '}{' + a + '}+\\frac{' + tT + '}{x}=1') + '.<br>' +
      t('\\frac{' + tT + '}{x}=1-' + fr(tq[0], tq[1] * a) + '=' + fr(tq[1] * a - tq[0], tq[1] * a)) + ', so ' + t('x=' + F(x)) + ' ' + u + '.';
    var two = C.b.indexOf('second') >= 0 || C.b.indexOf('another') >= 0;
    var prompt = o.min ? C.a + ' can ' + C.job + ' in ' + n(a) + ' h. With ' + C.b + ' helping, the job takes ' + hmT(tt) + '. How long would ' + C.b + ' take alone?'
      : two ? 'Working together, two ' + (C.a.split(' ').pop() + 's').replace('hoses', 'hoses') + ' can ' + C.job + ' in ' + n(tt) + ' ' + u + '. One of them alone needs ' + n(a) + ' ' + u + '. How long would the other need alone?'
      : 'Working together, ' + C.a + ' and ' + C.b + ' can ' + C.job + ' in ' + n(tt) + ' ' + u + '. ' + C.a + ' alone needs ' + n(a) + ' ' + u + '. How long would ' + C.b + ' need alone?';
    var p = KP.number(prompt, x, function (v) {
      if (Math.abs(v - (a - tt)) < 1e-9) return { code: cp + 'w-sub', hint: 'Times do not subtract. In ' + t(tT) + ' ' + u + ' the first does ' + t('\\frac{' + tT + '}{' + a + '}') + ' of the job; the other does the rest, ' + t('\\frac{' + tT + '}{x}') + '.' };
      if (v === a) return { code: cp + 'other', hint: 'That is the first one’s time. Find the other’s.' };
      if (o.min) { var bad = Math.floor(tt) + Math.round((tt - Math.floor(tt)) * 60) / 100, xb = a * bad / (a - bad); if (Math.abs(v - K.roundTo(xb, 2)) < 0.01) return { code: cp + 'min', hint: hmT(tt) + ' is not ' + bad + ' h: change the minutes to hours, ' + t(Math.round((tt - Math.floor(tt)) * 60) + '\\text{ min}=\\frac{' + Math.round((tt - Math.floor(tt)) * 60) + '}{60}\\text{ h}') + '.' }; }
      return null;
    }, sol, ['Let ' + t('x') + ' be the time alone. In ' + t(tT) + ' ' + u + ' each does ' + t('\\frac{' + tT + '}{\\text{its time}}') + ' of the job.' + (o.min ? ' First change ' + hmT(tt) + ' to hours.' : ''), 'The two parts add to the whole job, ' + t(1) + '.'], 'work rate: the other time', { after: u });
    p.bad = [String(K.roundTo(a - tt, 6)), String(a)];
    return p;
  };
  /* one is h faster (or slower); together T: each alone (#10, EP B3, L10 #25 (o.nr), EP10 #18 (o.crew)) */
  var FAST = {
    machine: { p: function (h, T) { return 'A new machine can package an order ' + n(h) + ' h faster than an old machine. Using both machines, the order takes ' + T + '. How long does each machine take alone?'; }, f: 'New machine:', s: 'Old machine:', u: 'h', fv: 'new machine', sv: 'old machine' },
    pipe: { p: function (h, T) { return 'A small pipe takes ' + n(h) + ' h longer than a large pipe to fill a tank. Together they fill it in ' + T + '. How long does each pipe take alone?'; }, f: 'Large pipe:', s: 'Small pipe:', u: 'h', fv: 'large pipe', sv: 'small pipe' },
    crew: { p: function (h, T) { return 'Working alone, Crew B takes ' + n(h) + ' days longer than Crew A to frame a house. Working together, the crews take ' + T + '. Determine how long each crew takes alone.'; }, f: 'Crew A:', s: 'Crew B:', u: 'days', fv: 'Crew A', sv: 'Crew B' },
    pump: { f: 'Faster pump:', s: 'Slower pump:', u: 'h', fv: 'faster pump', sv: 'slower pump' },
    plow: { p: function (h, T) { return 'Working alone, one snow plow takes ' + n(h) + ' h longer than another to clear a parking lot. Together they clear it in ' + T + '. How long does each take alone?'; }, f: 'Faster plow:', s: 'Slower plow:', u: 'h', fv: 'faster plow', sv: 'slower plow' }
  };
  P9.workFaster = function (r, cp, o) {
    o = o || {};
    var C = FAST[o.nr ? 'pump' : o.ctx || r.pick(['machine', 'pipe', 'plow'])], days = C.u === 'days';
    var z = pickWhere(function () { return days ? { x: r.int(4, 40), h: r.int(2, 20) } : { x: r.int(2, 24), h: r.int(1, 16) }; }, function (z) {
      z.T = z.x * (z.x + z.h) / (2 * z.x + z.h);
      var bad = [[3, 3], [6, 6], [9, 9], [10, 5], [8, 4], [20, 10], [5, 2]];
      return nice(z.T, days || o.nr ? 1 : 10) && z.T >= 1.5 && !bad.some(function (p) { return p[0] === z.x && p[1] === z.h; }) && z.x + z.h <= (days ? 60 : 36);
    });
    var x = z.x, h = z.h, T = z.T, q = rat(T), a = q[0], qq = q[1], neg = -T * h / x, u = C.u, c1 = a * h / x, Tt = dec(T), g1 = gcd(qq, c1);
    var Tw = days ? n(T) + ' days' : nice(T, 2) ? n(T) + ' h' : hmT(T);
    var sol = (nice(T, 2) || days ? '' : hmT(T) + ' ' + t('=' + Tt) + ' h. ') + cap(C.fv) + ' alone ' + t('x') + ' ' + u + ', ' + C.sv + ' ' + t('x+' + h) + ': ' + t('\\frac{' + Tt + '}{x}+\\frac{' + Tt + '}{x+' + h + '}=1') + ', ' + t('x\\ne 0,\\ -' + h) + '.<br>' +
      'Multiply by ' + t((qq === 1 ? '' : qq) + 'x(x+' + h + ')') + ': ' + t(F(a) + '(x+' + h + ')+' + F(a) + 'x=' + (qq === 1 ? '' : qq) + 'x(x+' + h + ')') + ', so ' + t(pt([qq, qq * h - 2 * a, -a * h], 'x') + '=0') + '.<br>' +
      t((g1 > 1 ? g1 : '') + fac('x', x) + (qq === 1 ? fac('x', neg) : '(' + lt((qq / g1 === 1 ? '' : qq / g1) + 'x', c1 / g1) + ')') + '=0') + ': ' + t('x=' + x) + ' (reject ' + t('x=' + ex.texRat(rat(neg))) + ': a time cannot be negative).<br>' +
      cap(C.fv) + ' ' + n(x) + ' ' + u + ', ' + C.sv + ' ' + n(x + h) + ' ' + u + '. Check: ' + t('\\frac{' + Tt + '}{' + x + '}+\\frac{' + Tt + '}{' + (x + h) + '}=1') + ' ✓';
    var hints = ['Let the faster one take ' + t('x') + ' ' + u + '; the slower takes ' + t('x+' + h) + '. In ' + Tw + ' each does ' + t('\\frac{' + Tt + '}{\\text{its time}}') + ' of the job.', 'The parts add to ' + t(1) + '. Multiply by the LCD, solve the quadratic and reject the negative root.'];
    var dn = function (v) { if (Math.abs(v - neg) < 1e-9 || (Math.abs(v + neg) < 1e-9 && -neg !== x + h)) return { code: cp + 'neg', hint: 'That comes from the negative root: reject it.' }; return null; };
    if (o.nr) {
      var p = KP.nr('<i>(Numerical Response)</i> One pump takes ' + n(h) + ' h less than a second pump to drain a pond. Together they drain it in ' + n(T) + ' h. The number of hours the faster pump takes alone is ________.', x,
        function (v) { if (v === x + h) return { code: cp + 'other', hint: 'That is the slower pump. The question asks for the faster one.' }; return dn(v); }, sol, hints, 'NR: one is faster');
      p.bad = [String(x + h)]; return p;
    }
    return boxesN(C.p(h, Tw), [{ label: C.f, ans: x, after: u, diag: dn }, { label: C.s, ans: x + h, after: u }], sol, hints, 'work rate: a quadratic');
  };
  /* one works alone first, then both (#11a) */
  P9.headStart = function (r, cp) {
    var C = r.pick([['Ali', 'Sam', 'tile a floor'], ['Dana', 'Eli', 'paint a fence'], ['Rosa', 'Tom', 'stain a deck'], ['Kim', 'Raj', 'shovel the driveway']]);
    var z = pickWhere(function () { return { a: r.int(4, 20), b: r.int(3, 20), w: r.int(1, 10) }; }, function (z) {
      z.t = z.b * (z.a - z.w) / (z.a + z.b);
      return z.w < z.a - 1 && z.a !== z.b && nice(z.t, 2) && z.t >= 1 && !(z.a === 9 && z.b === 6 && z.w === 4) && !(z.a === 10 && z.b === 15 && z.w === 5);
    });
    var a = z.a, b = z.b, w = z.w, tt = z.t, L = lcm(a, b), ca = L / a, cb = L / b;
    var sol = 'Together for ' + t('t') + ' more hours: ' + C[0] + ' works ' + t(w + '+t') + ' hours, ' + C[1] + ' ' + t('t') + ' hours. ' + t('\\frac{' + w + '+t}{' + a + '}+\\frac{t}{' + b + '}=1') + '.<br>' +
      'Multiply by ' + t(L) + ': ' + t((ca === 1 ? '' : ca) + '(' + w + '+t)+' + (cb === 1 ? '' : cb) + 't=' + L) + ', so ' + t(ca * w + '+' + (ca + cb) + 't=' + L) + ' and ' + t('t=' + dec(tt)) + ' h more (the job takes ' + dec(w + tt) + ' h in all).';
    var p = KP.number(C[0] + ' can ' + C[2] + ' in ' + n(a) + ' h and ' + C[1] + ' can do it in ' + n(b) + ' h. ' + C[0] + ' works alone for ' + n(w) + ' h and then ' + C[1] + ' joins. How much longer does the job take?', tt,
      function (v) { if (Math.abs(v - (w + tt)) < 1e-9) return { code: cp + 'total', hint: 'That is the time for the whole job. The question asks how much <b>longer</b>, after the first ' + t(w) + ' h.' }; if (Math.abs(v - a * b / (a + b)) < 1e-9) return { code: cp + 'head', hint: 'That is the time for the whole job together. ' + C[0] + ' has already done ' + t('\\frac{' + w + '}{' + a + '}') + ' of it.' }; if (v === a - w) return { code: cp + 'other', hint: 'That is how long ' + C[0] + ' would need to finish alone. ' + C[1] + ' helps.' }; return null; },
      sol, ['Each part is ' + t('\\frac{\\text{time that person works}}{\\text{time that person needs alone}}') + '. ' + C[0] + ' works ' + t(w + '+t') + ' hours.', 'The parts add to ' + t(1) + '. Multiply by the LCD.'], 'work: a head start', { after: 'h' });
    p.bad = [String(K.roundTo(w + tt, 6)), String(a - w)].filter(function (x) { return x !== String(tt); });
    return p;
  };
  /* Crew A works alone first, then both: Crew B alone (EP C2) */
  P9.crewB = function (r, cp) {
    var z = pickWhere(function () { return { a: r.int(6, 30), w: r.int(1, 8), u: r.int(2, 12) }; }, function (z) { z.x = z.u * z.a / (z.a - z.w - z.u); return z.a - z.w - z.u > 0 && nice(z.x) && z.x <= 60 && z.x !== z.a && !(z.a === 12 && z.w === 3 && z.u === 5); });
    var a = z.a, w = z.w, u = z.u, x = z.x, A1 = w + u, rest = ex.norm(a - A1, a);
    var sol = 'Crew A works ' + t(w + '+' + u + '=' + A1) + ' days, Crew B ' + t(u) + ' days. ' + t('\\frac{' + A1 + '}{' + a + '}+\\frac{' + u + '}{x}=1') + ', ' + t('x\\ne 0') + '.<br>' + t('\\frac{' + u + '}{x}=' + ex.texRat(rest)) + ', so ' + t('x=' + x) + ' days.';
    var p = KP.number('Crew A can pave a parking lot in ' + n(a) + ' days. Crew A works alone for ' + n(w) + ' days, then Crew B joins, and together they finish in ' + n(u) + ' more days. How long would Crew B take alone?', x,
      function (v) { var x2 = u * a / (a - u); if (Math.abs(v - x2) < 1e-9) return { code: cp + 'head', hint: 'Crew A worked ' + t(w + '+' + u) + ' days, not ' + t(u) + ': count its first ' + t(w) + ' days too.' }; return null; },
      sol, ['Crew A works ' + t(w) + ' days alone plus ' + t(u) + ' together. Each part is ' + t('\\frac{\\text{days worked}}{\\text{days needed alone}}') + '.', 'The parts add to ' + t(1) + '.'], 'work: Crew B alone', { after: 'days' });
    return p;
  };
  /* a drain left open (#11b) */
  P9.drain = function (r, cp) {
    var C = r.pick([[function (f, e, u) { return 'A hot tub fills in ' + n(f) + ' ' + u + ' with the drain closed and empties in ' + n(e) + ' ' + u + ' with the tap off.'; }, 'min'],
      [function (f, e, u) { return 'An inlet pipe fills a pool in ' + n(f) + ' ' + u + ' and the drain empties it in ' + n(e) + ' ' + u + '.'; }, 'h'],
      [function (f, e, u) { return 'A tap fills a laundry tub in ' + n(f) + ' ' + u + ' and the open drain empties it in ' + n(e) + ' ' + u + '.'; }, 'min']]);
    var z = pickWhere(function () { return C[1] === 'min' ? { f: r.int(4, 40), e: r.int(6, 90) } : { f: r.int(3, 16), e: r.int(4, 30) }; }, function (z) { z.t = z.f * z.e / (z.e - z.f); return z.e > z.f && nice(z.t) && z.t <= (C[1] === 'min' ? 240 : 60) && !(z.f === 30 && z.e === 45) && !(z.f === 8 && z.e === 12); });
    var f = z.f, e = z.e, L = lcm(f, e), u = C[1];
    var prompt = C[0](f, e, u) + ' How long does it take to fill if the drain is left open by mistake?';
    var sol = 'The drain undoes the work, so its part subtracts: ' + t('\\frac{t}{' + f + '}-\\frac{t}{' + e + '}=1') + '. Multiply by ' + t(L) + ': ' + t((L / f === 1 ? '' : L / f) + 't-' + (L / e === 1 ? '' : L / e) + 't=' + L) + ', so ' + t('t=' + z.t) + ' ' + u + '.';
    var p = KP.number(prompt, z.t, function (v) { if (Math.abs(v - f * e / (f + e)) < 1e-9) return { code: cp + 'drain', hint: 'The drain <b>empties</b> the tub: subtract its part, ' + t('\\frac{t}{' + f + '}-\\frac{t}{' + e + '}=1') + '.' }; if (v === e - f) return { code: cp + 'w-sub', hint: 'Times do not subtract. Subtract the parts of the job done: ' + t('\\frac{t}{' + f + '}-\\frac{t}{' + e + '}=1') + '.' }; return null; },
      sol, ['In ' + t('t') + ' ' + u + ' the tap fills ' + t('\\frac{t}{' + f + '}') + ' and the drain empties ' + t('\\frac{t}{' + e + '}') + '.', 'Filled minus emptied is one whole job: the parts give ' + t(1) + '.'], 'work: a drain open', { after: u });
    p.bad = [String(e - f)];
    return p;
  };

  /* ======================================================================================================
   * Other rational models
   * ====================================================================================================== */
  /* wins in a row to reach at least p% (#12); o.bat: hits in a row to an exact average (L10 #27); o.mix: antifreeze added (EP C3) */
  P9.winsRow = function (r, cp, o) {
    o = o || {};
    if (o.mix) {
      var m = pickWhere(function () { return { V: 5 * r.int(4, 16), p: 5 * r.int(2, 8), q: 5 * r.int(3, 12) }; }, function (z) { z.x = z.V * (z.q - z.p) / (100 - z.q); return z.q > z.p && z.q < 100 && nice(z.x, 2) && z.x > 0 && z.x <= 60 && nice(z.V * z.p / 100, 2) && !(z.V === 40 && z.p === 25 && z.q === 40); });
      var A0 = m.V * m.p / 100;
      return KP.number('A ' + n(m.V) + ' L tank of coolant is ' + n(m.p) + '% antifreeze. How many litres of pure antifreeze must be added to make the mixture ' + n(m.q) + '% antifreeze?', m.x,
        function (v) { var w1 = m.V * (m.q - m.p) / 100; if (Math.abs(v - w1) < 1e-9) return { code: cp + 'head', hint: 'Adding antifreeze also increases the total volume: ' + t('\\frac{' + dec(A0) + '+x}{' + m.V + '+x}=' + dec(m.q / 100)) + '.' }; return null; },
        'Antifreeze now: ' + t(dec(m.p / 100) + '(' + m.V + ')=' + dec(A0)) + ' L. ' + t('\\frac{' + dec(A0) + '+x}{' + m.V + '+x}=' + dec(m.q / 100)) + ', ' + t('x\\ne -' + m.V) + '.<br>' +
        t(dec(A0) + '+x=' + dec(m.q * m.V / 100) + '+' + dec(m.q / 100) + 'x') + ', so ' + t(dec(1 - m.q / 100) + 'x=' + dec(m.q * m.V / 100 - A0)) + ' and ' + t('x=' + dec(m.x)) + ' L. Check: ' + t('\\frac{' + dec(A0 + m.x) + '}{' + dec(m.V + m.x) + '}=' + dec(m.q / 100)) + ' ✓',
        ['Pure antifreeze adds to the antifreeze <b>and</b> to the total: ' + t('\\frac{\\text{antifreeze}+x}{\\text{total}+x}') + '.', 'Set it equal to the new percent as a decimal and solve.'], 'a mixture', { after: 'L' });
    }
    if (o.bat) {
      var b = pickWhere(function () { return { h: r.int(8, 40), ab: r.int(30, 120), a: r.pick([0.3, 0.35, 0.4, 0.375, 0.45]) }; }, function (z) { z.x = (z.a * z.ab - z.h) / (1 - z.a); return nice(z.x) && z.x >= 2 && z.x <= 40 && z.h / z.ab < z.a - 0.03 && !(z.h === 18 && z.ab === 60); });
      var aT = b.a.toFixed(3).replace(/^0/, '');
      return KP.number('A baseball player has ' + n(b.h) + ' hits in ' + n(b.ab) + ' at-bats. How many hits in a row would raise her batting average (' + t('\\frac{\\text{hits}}{\\text{at-bats}}') + ') to ' + aT + '?', b.x, null,
        t('\\frac{' + b.h + '+x}{' + b.ab + '+x}=' + b.a) + ', ' + t('x\\ne -' + b.ab) + '. ' + t(b.h + '+x=' + dec(b.a * b.ab) + '+' + b.a + 'x') + ', so ' + t(dec(1 - b.a) + 'x=' + dec(b.a * b.ab - b.h)) + ' and ' + t('x=' + b.x) + ' hits. Check: ' + t('\\frac{' + (b.h + b.x) + '}{' + (b.ab + b.x) + '}=' + b.a) + ' ✓',
        ['Each hit in a row adds ' + t(1) + ' to the hits <b>and</b> to the at-bats.', 'Set ' + t('\\frac{' + b.h + '+x}{' + b.ab + '+x}') + ' equal to the average and solve.'], 'a batting average', { after: 'hits' });
    }
    var C = r.pick([['A hockey team', 'games', 'win', 'winning percentage'], ['A soccer team', 'games', 'win', 'winning percentage'], ['A basketball player', 'free throws', 'make', 'success rate']]);
    var z = pickWhere(function () { return { w: r.int(3, 20), g: r.int(10, 40), p: r.pick([55, 60, 65, 70, 75, 80]) }; }, function (z) {
      z.xs = (z.p * z.g - 100 * z.w) / (100 - z.p); z.N = Math.ceil(z.xs - 1e-9);
      return z.w < z.g && 100 * z.w / z.g < z.p - 5 && z.xs > 1 && !nice(z.xs) && z.N <= 40 && !(z.w === 9 && z.g === 20) && !(z.w === 14 && z.g === 25) && Math.abs(z.xs - Math.round(z.xs)) > 0.02;
    });
    var N = z.N, pd = z.p / 100, pc1 = 100 * (z.w + N - 1) / (z.g + N - 1), pc2 = 100 * (z.w + N) / (z.g + N), made = C[0].indexOf('player') >= 0 ? 'made ' + z.w + ' of her first ' + z.g + ' ' + C[1] : 'won ' + z.w + ' of its first ' + z.g + ' ' + C[1];
    var xsT = K.roundTo(z.xs, 2);
    var sol = t('\\frac{' + z.w + '+x}{' + z.g + '+x}=' + pd) + ', ' + t('x\\ne -' + z.g) + '. ' + t(z.w + '+x=' + dec(pd * z.g) + '+' + pd + 'x') + ', so ' + t(dec(1 - pd) + 'x=' + dec(pd * z.g - z.w)) + ' and ' + t('x\\approx ' + xsT) + '.<br>' +
      'The number must be a whole number: after ' + t(N - 1) + ' the rate is ' + t('\\frac{' + (z.w + N - 1) + '}{' + (z.g + N - 1) + '}\\approx ' + K.roundTo(pc1, 1) + '\\%') + ' (not enough); after ' + t(N) + ' it is ' + t('\\frac{' + (z.w + N) + '}{' + (z.g + N) + '}\\approx ' + K.roundTo(pc2, 1) + '\\%') + '. The answer is ' + t(N) + ' in a row.';
    var p = KP.number(C[0] + ' has ' + made + ' this season. How many ' + C[1] + ' in a row must it ' + C[2] + ' to raise its ' + C[3] + ' to at least ' + n(z.p) + '%?', N,
      function (v) { if (v === N - 1) return { code: cp + 'round', hint: 'Check it: after ' + t(N - 1) + ' the rate is only ' + t(K.roundTo(pc1, 1) + '\\%') + '. “At least” means round <b>up</b>.' }; if (Math.abs(v - z.xs) < 0.06) return { code: cp + 'raw', hint: 'You cannot ' + C[2] + ' part of one: the answer is a whole number. Which whole number first reaches ' + t(z.p + '\\%') + '?' }; return null; },
      sol, ['Each one in a row adds ' + t(1) + ' to the top <b>and</b> to the bottom: ' + t('\\frac{' + z.w + '+x}{' + z.g + '+x}') + '.', 'Solve with the percent as a decimal; the answer must be a whole number, so check the whole numbers next to your root.'], 'in a row: a whole number', { after: C[1] });
    if (C[0].indexOf('player') >= 0) p.prompt = p.prompt.replace('must it make', 'must she make').replace('raise its', 'raise her');
    p.bad = [String(N - 1), String(xsT)];
    return p;
  };
  /* average speed for a round trip 2ab/(a + b) (#13) */
  P9.avgSpeed = function (r, cp) {
    var who = r.pick(['Zoe', 'Liam', 'Ms. Grant', 'Aditya']);
    var z = pickWhere(function () { return { a: 5 * r.int(8, 18), v: 5 * r.int(9, 22) }; }, function (z) { z.b = z.a * z.v / (2 * z.a - z.v); return z.v > z.a && 2 * z.a > z.v && nice(z.b) && z.b <= 130 && !(z.a === 60 && z.v === 75); });
    var a = z.a, v = z.v, b = z.b;
    var sol = t('\\frac{2(' + a + ')b}{' + a + '+b}=' + v) + ', ' + t('b\\ne -' + a) + '. ' + t(2 * a + 'b=' + v + '(' + a + '+b)') + ', so ' + t(2 * a + 'b=' + F(v * a) + '+' + v + 'b') + ', ' + t((2 * a - v) + 'b=' + F(v * a)) + ' and ' + t('b=' + b) + ' km/h.';
    var p = KP.number('If you drive a distance at speed ' + t('a') + ' and return the same distance at speed ' + t('b') + ', your average speed for the round trip is ' + t('\\dfrac{2ab}{a+b}') + '. ' + who + ' drives to a city at ' + n(a) + ' km/h in heavy traffic. How fast must ' + (who === 'Liam' || who === 'Aditya' ? 'he' : 'she') + ' drive home to average ' + n(v) + ' km/h for the round trip?', b,
      function (x) { if (x === 2 * v - a) return { code: cp + 'mean', hint: 'The average speed is not the mean of the two speeds (the slow leg takes longer). Use the formula: ' + t('\\frac{2(' + a + ')b}{' + a + '+b}=' + v) + '.' }; return null; },
      sol, ['Substitute ' + t('a=' + a) + ' and set the formula equal to ' + t(v) + '.', 'Multiply both sides by ' + t(a + '+b') + ' and solve for ' + t('b') + '.'], 'a formula with a rational expression', { after: 'km/h' });
    p.bad = [String(2 * v - a)];
    return p;
  };

  /* ======================================================================================================
   * Multiple choice
   * ====================================================================================================== */
  P9.modelMC = function (r, cp) {
    var nm = r.pick([['Liam', 'Noor', 'his'], ['Ava', 'Ben', 'her'], ['Kofi', 'Mei', 'his'], ['Hana', 'Raj', 'her']]);
    var z = pickWhere(function () { return { s: 10 * r.int(4, 10), d: 2 * r.int(3, 10), T: r.pick([2, 3, 4, 2.5]) }; }, function (z) { return nice(z.s * z.T) && nice((z.s + z.d) * z.T) && !(z.s * z.T === 200 && z.d === 12); });
    var d1 = z.s * z.T, d2 = (z.s + z.d) * z.T, k = z.d;
    return mcPart(r, nm[0] + ' drives ' + n(d1) + ' km in the same time that ' + nm[1] + ' drives ' + n(d2) + ' km. ' + nm[1] + '’s average speed is ' + n(k) + ' km/h greater than ' + nm[0] + '’s. If ' + nm[0] + '’s average speed is ' + t('s') + ' km/h, an equation that can be used to determine ' + t('s') + ' is', [
      { html: t('\\dfrac{' + F(d1) + '}{s}=\\dfrac{' + F(d2) + '}{s+' + k + '}'), right: true },
      { html: t('\\dfrac{' + F(d1) + '}{s+' + k + '}=\\dfrac{' + F(d2) + '}{s}'), why: 'That gives ' + nm[0] + ' the faster speed. ' + nm[0] + ' is slower: ' + nm[2] + ' speed is ' + t('s') + '.', code: cp + 'model' },
      { html: t(F(d1) + 's=' + F(d2) + '(s+' + k + ')'), why: 'Time is distance <b>divided</b> by speed, not multiplied.', code: cp + 'model' },
      { html: t('\\dfrac{' + F(d1) + '}{s}+\\dfrac{' + F(d2) + '}{s+' + k + '}=' + k), why: 'The times are <b>equal</b>: nothing is added.', code: cp + 'model' }],
      'The times ' + t('\\frac{\\text{distance}}{\\text{speed}}') + ' are equal: ' + nm[0] + ' ' + t('\\frac{' + F(d1) + '}{s}') + ', ' + nm[1] + ' ' + t('\\frac{' + F(d2) + '}{s+' + k + '}') + '. (Solving gives ' + t('s=' + z.s) + ' km/h.)',
      ['Time ' + t('=\\frac{\\text{distance}}{\\text{speed}}') + '. Who is faster?', 'The two times are equal.'], 'MC: model a same-time problem');
  };
  /* the fraction of a job done (#15); o.together: two people for 1 h (L10 #26) */
  P9.fracJobMC = function (r, cp, o) {
    o = o || {};
    if (o.together) {
      var nm = r.pick([['Lee', 'Pat'], ['Ivy', 'Omar'], ['Jo', 'Sven'], ['Mia', 'Theo']]);
      var z = pickWhere(function () { return { a: r.int(2, 9), b: r.int(3, 12) }; }, function (q) { if (q.a >= q.b || (q.a === 4 && q.b === 6)) return false; var c = ex.norm(q.a + q.b, q.a * q.b); return c[0] < c[1]; });
      var a = z.a, b = z.b, rt = ex.norm(a + b, a * b);
      var opts = [{ html: t(ex.texRat(rt)) + ' of the job', right: true, v: rt[0] / rt[1] },
        { html: t(fr(1, a + b)) + ' of the job', why: 'That adds the times. Add the <b>rates</b>: ' + t('\\frac{1}{' + a + '}+\\frac{1}{' + b + '}') + '.', code: cp + 'job', v: 1 / (a + b) },
        { html: t(fr(2, a + b)) + ' of the job', why: 'Fractions are not added straight across. Use a common denominator: ' + t('\\frac{1}{' + a + '}+\\frac{1}{' + b + '}') + '.', code: cp + 'job', v: 2 / (a + b) },
        { html: t(fr(1, a * b)) + ' of the job', why: 'That multiplies the rates. Each person’s part <b>adds</b>.', code: cp + 'job', v: 1 / (a * b) }];
      var uniq = []; opts = opts.filter(function (x) { if (uniq.some(function (u) { return Math.abs(u - x.v) < 1e-12; })) return false; uniq.push(x.v); return true; });
      if (opts.length < 4) opts.push({ html: t(fr(1, Math.max(a, b))) + ' of the job', why: 'That is only one person’s part.', code: cp + 'job' });
      return mcPart(r, nm[0] + ' can do a job in ' + n(a) + ' h and ' + nm[1] + ' can do it in ' + n(b) + ' h. Working together for ' + t(1) + ' h, they complete', opts.map(function (x) { return { html: x.html, right: x.right, why: x.why, code: x.code }; }),
        'In ' + t(1) + ' h: ' + t('\\frac{1}{' + a + '}+\\frac{1}{' + b + '}=\\frac{' + b + '}{' + a * b + '}+\\frac{' + a + '}{' + a * b + '}=' + ex.texRat(rt)) + ' of the job.', ['In one hour each person does ' + t('\\frac{1}{\\text{their time}}') + ' of the job.'], 'MC: the part done together');
    }
    var who = r.pick(['Pat', 'Jordan', 'Riley', 'Sam']), k = pickWhere(function () { return r.int(2, 9); }, function (x) { return x !== 3; });
    return mcPart(r, who + ' can do a job alone in ' + t('x') + ' hours. The fraction of the job ' + who + ' completes in ' + n(k) + ' hours is', [
      { html: t('\\dfrac{' + k + '}{x}'), right: true },
      { html: t('\\dfrac{x}{' + k + '}'), why: 'Upside down. ' + who + '’s rate is ' + t('\\frac{1}{x}') + ' of the job per hour.', code: cp + 'job' },
      { html: t(k + 'x'), why: 'The rate is ' + t('\\frac{1}{x}') + ' of the job per hour, not ' + t('x') + '.', code: cp + 'job' },
      { html: t('\\dfrac{1}{' + k + 'x}'), why: 'Multiply the rate by the time: ' + t(k + '\\times\\frac{1}{x}') + '.', code: cp + 'job' }],
      who + '’s rate is ' + t('\\frac{1}{x}') + ' of the job per hour, so in ' + t(k) + ' h ' + who + ' does ' + t(k + '\\times\\frac{1}{x}=\\frac{' + k + '}{x}') + '.', ['Part done ' + t('=') + ' rate ' + t('\\times') + ' time.'], 'MC: the part of a job');
  };
  P9.pipesMC = function (r, cp) {
    var z = togetherPair(r, 'h', [[3, 6]], 10), a = z.a, b = z.b, tt = z.t;
    var vals = [[tt, true], [(a + b) / 2, false, 'That averages the times. Together must be <b>faster</b> than either pipe alone.'], [a + b, false, 'That adds the times. Together must be faster than either pipe alone.'], [a / 2, false, 'That would be two pipes each as fast as the first. Use ' + t('\\frac{t}{' + a + '}+\\frac{t}{' + b + '}=1') + '.']];
    var seen = []; vals = vals.filter(function (v) { if (seen.indexOf(v[0]) >= 0) return false; seen.push(v[0]); return true; });
    if (vals.length < 4) vals.push([b, false, 'That is the slower pipe alone.']);
    return mcPart(r, 'One pipe fills a tank in ' + n(a) + ' h and a second pipe fills it in ' + n(b) + ' h. With both pipes open, the tank fills in', vals.map(function (v) { return { html: t(dec(v[0])) + ' h', right: v[1], why: v[2], code: cp + 'pipes' }; }),
      t('\\frac{t}{' + a + '}+\\frac{t}{' + b + '}=1') + ', so ' + t('t=\\frac{' + a + '\\cdot ' + b + '}{' + a + '+' + b + '}=' + tt) + ' h. (Together must be faster than either pipe alone.)', ['In ' + t('t') + ' hours each pipe fills ' + t('\\frac{t}{\\text{its time}}') + ' of the tank.'], 'MC: two pipes');
  };
  P9.windTimeMC = function (r, cp) {
    var head = r.chance(0.65), z = pickWhere(function () { return { D: 50 * r.int(4, 30), w: 5 * r.int(2, 12) }; }, function (q) { return !(q.D === 600 && q.w === 25); });
    var D = F(z.D), w = z.w, sg = head ? '-' : '+', op = head ? '+' : '-';
    return mcPart(r, 'A plane with airspeed ' + t('s') + ' km/h flies ' + t(D) + ' km ' + (head ? 'into a ' + w + ' km/h headwind' : 'with a ' + w + ' km/h tailwind') + '. The time for the flight, in hours, is', [
      { html: t('\\dfrac{' + D + '}{s' + op + w + '}'), why: head ? 'A headwind <b>slows</b> the plane: its speed is ' + t('s-' + w) + '.' : 'A tailwind <b>speeds up</b> the plane: its speed is ' + t('s+' + w) + '.', code: cp + 'wind' },
      { html: t('\\dfrac{s' + sg + w + '}{' + D + '}'), why: 'Upside down: time ' + t('=\\frac{\\text{distance}}{\\text{speed}}') + '.', code: cp + 'wind' },
      { html: t(D + '(s' + sg + w + ')'), why: 'Time is distance <b>divided</b> by speed.', code: cp + 'wind' },
      { html: t('\\dfrac{' + D + '}{s' + sg + w + '}'), right: true }],
      (head ? 'A headwind slows the plane to ' + t('s-' + w) : 'A tailwind speeds the plane up to ' + t('s+' + w)) + ' km/h, and time ' + t('=\\frac{\\text{distance}}{\\text{speed}}') + '.', ['Which way does the wind change the speed? Time ' + t('=\\frac{\\text{distance}}{\\text{speed}}') + '.'], 'MC: time with a wind');
  };

  /* ======================================================================================================
   * Expressions (EP A1)
   * ====================================================================================================== */
  P9.exprPart = function (r, cp, kind) {
    var key, fn, vars, dl = [], prompt, sol, hints;
    if (kind === 'a') {
      var D = r.pick([60, 80, 120, 150, 180, 200, 240, 250, 300, 320]), k = r.pick([5, 10, 15, 20, 25]), up = r.chance(0.6);
      if (D === 150 && k === 10 && up) D = 160;
      key = '\\frac{' + D + '}{s' + (up ? '+' : '-') + k + '}'; vars = ['s']; fn = function (e) { return D / (e.s + (up ? k : -k)); };
      dl = [{ f: function (e) { return D * (e.s + (up ? k : -k)); }, code: cp + 'mult', hint: 'Time is distance <b>divided by</b> speed.' }, { f: function (e) { return (e.s + (up ? k : -k)) / D; }, code: cp + 'flip', hint: 'Upside down: time ' + t('=\\frac{\\text{distance}}{\\text{speed}}') + '.' }, { f: function (e) { return D / e.s + (up ? k : -k); }, code: cp + 'flip', hint: 'Divide by the whole speed: put ' + t('s' + (up ? '+' : '-') + k) + ' in brackets as the denominator.' }];
      prompt = 'Write an expression for the time, in hours, to drive ' + n(D) + ' km at ' + t('(s' + (up ? '+' : '-') + k + ')') + ' km/h.';
      sol = 'Time ' + t('=\\frac{\\text{distance}}{\\text{speed}}=' + key) + ' hours.'; hints = ['Time ' + t('=\\frac{\\text{distance}}{\\text{speed}}') + '.'];
    } else if (kind === 'b') {
      var c = r.int(2, 9), which = r.pick(['up', 'down', 'head', 'tail']), plus = which === 'down' || which === 'tail';
      if (c === 3 && which === 'up') c = 4;
      key = 's' + (plus ? '+' : '-') + c; vars = ['s']; fn = function (e) { return e.s + (plus ? c : -c); };
      dl = [{ f: function (e) { return e.s + (plus ? -c : c); }, code: cp + 'sign', hint: (which === 'up' ? 'Upstream the current works against the boat' : which === 'down' ? 'Downstream the current carries the boat along' : which === 'head' ? 'A headwind works against the plane' : 'A tailwind pushes the plane along') + ': ' + (plus ? 'add' : 'subtract') + ' it.' }];
      prompt = which === 'up' || which === 'down' ? 'Write an expression for the ' + (which === 'up' ? 'upstream' : 'downstream') + ' speed of a boat with still-water speed ' + t('s') + ' km/h in a ' + n(c) + ' km/h current.'
        : 'Write an expression for the speed of a plane with airspeed ' + t('s') + ' km/h flying ' + (which === 'head' ? 'into a ' + c + ' km/h headwind' : 'with a ' + c + ' km/h tailwind') + '.';
      sol = (plus ? 'The current or wind adds to the speed: ' : 'The current or wind subtracts from the speed: ') + t(key) + ' km/h.'; hints = ['Downstream or with a tailwind: add. Upstream or into a headwind: subtract.'];
    } else if (kind === 'c') {
      var h = r.int(2, 9); if (h === 4) h = 5;
      key = '\\frac{' + h + '}{x}'; vars = ['x']; fn = function (e) { return h / e.x; };
      dl = [{ f: function (e) { return e.x / h; }, code: cp + 'flip', hint: 'Upside down: the rate is ' + t('\\frac{1}{x}') + ' of the job per hour.' }, { f: function (e) { return h * e.x; }, code: cp + 'mult', hint: 'The rate is ' + t('\\frac{1}{x}') + ' of the job per hour, not ' + t('x') + '.' }];
      prompt = 'Write an expression for the fraction of a job done in ' + n(h) + ' h by a worker who needs ' + t('x') + ' h to do the job alone.';
      sol = 'Rate ' + t('\\frac{1}{x}') + ' of the job per hour, so in ' + t(h) + ' h: ' + t(h + '\\times\\frac{1}{x}=' + key) + '.'; hints = ['Part done ' + t('=') + ' rate ' + t('\\times') + ' time, and the rate is ' + t('\\frac{1}{x}') + '.'];
    } else {
      var ph = r.pick([['the sum of a number and its reciprocal', 'n+\\frac{1}{n}', function (e) { return e.n + 1 / e.n; }],
        ['a number minus three times its reciprocal', 'n-\\frac{3}{n}', function (e) { return e.n - 3 / e.n; }],
        ['the sum of twice a number and its reciprocal', '2n+\\frac{1}{n}', function (e) { return 2 * e.n + 1 / e.n; }],
        ['the sum of the reciprocals of two consecutive integers (the smaller is ' + t('n') + ')', '\\frac{1}{n}+\\frac{1}{n+1}', function (e) { return 1 / e.n + 1 / (e.n + 1); }],
        ['the difference of a number and four times its reciprocal', 'n-\\frac{4}{n}', function (e) { return e.n - 4 / e.n; }]]);
      key = ph[1]; vars = ['n']; fn = ph[2];
      prompt = 'Write an expression for ' + ph[0] + '. Use ' + t('n') + ' for the number.';
      sol = 'The reciprocal of ' + t('n') + ' is ' + t('\\frac{1}{n}') + ' (' + t('n\\ne 0') + '): ' + t(key) + '.'; hints = ['The reciprocal of ' + t('n') + ' is ' + t('\\frac{1}{n}') + '.'];
      dl = [{ f: function (e) { return 1 / fn(e); }, code: 'value', hint: 'The reciprocal applies to the number only: ' + t('\\frac{1}{n}') + '.' }];
    }
    var p = KP.math(prompt, exprCheck(fn, vars, dl), key, sol, hints, 'write an expression', { keys: 'u6rat', vars: vars, placeholder: 'e.g. 60/(s+5)' });
    p.bad = kind === 'b' ? [key.indexOf('+') >= 0 ? key.replace('+', '-') : key.replace('-', '+')] : kind === 'c' ? ['\\frac{x}{' + key.match(/\d+/)[0] + '}'] : [];
    return p;
  };

  /* ======================================================================================================
   * More (extra practice)
   * ====================================================================================================== */
  /* consecutive even or odd integers: the sum of the reciprocals (EP B4) */
  P9.consecInts = function (r, cp) {
    var odd = r.chance(0.45);
    var z = pickWhere(function () { return { n0: odd ? 2 * r.int(1, 8) + 1 : 2 * r.int(1, 8) }; }, function (z) {
      var q = ex.norm(2 * z.n0 + 2, z.n0 * (z.n0 + 2)); z.p = q[0]; z.q = q[1]; z.r2 = -2 * z.q / (z.p * z.n0);
      return !(odd ? z.n0 === 5 : z.n0 === 4) && !nice(z.r2);
    });
    var n0 = z.n0, p = z.p, q = z.q, w = odd ? 'odd' : 'even', B = 2 * p - 2 * q, C2 = -2 * q, m = -C2 / n0;
    var sol = 'Let the integers be ' + t('n') + ' and ' + t('n+2') + '; ' + t('n\\ne 0,\\ -2') + '. ' + t('\\frac{1}{n}+\\frac{1}{n+2}=\\frac{' + p + '}{' + q + '}') + '.<br>' +
      'Multiply by ' + t(q + 'n(n+2)') + ': ' + t(q + '(n+2)+' + q + 'n=' + (p === 1 ? '' : p) + 'n(n+2)') + ', so ' + t(pt([p, B, C2], 'n') + '=0') + ' and ' + t(fac('n', n0) + '(' + lt((p === 1 ? '' : p) + 'n', m) + ')=0') + '.<br>' +
      t('n=' + n0) + ' (' + t('n=' + ex.texRat(ex.norm(-m, p))) + ' is not an integer: reject). The integers are ' + t(n0) + ' and ' + t(n0 + 2) + '.';
    return boxesN('The sum of the reciprocals of two consecutive ' + w + ' integers is ' + t('\\frac{' + p + '}{' + q + '}') + '. Determine the integers.', [
      { label: 'Smaller:', ans: n0, diag: function (v) { if (Math.abs(v - z.r2) < 0.01) return { code: cp + 'int', hint: 'That root is not an integer: reject it.' }; return null; } }, { label: 'Larger:', ans: n0 + 2 }], sol,
      ['Consecutive ' + w + ' integers are ' + t('n') + ' and ' + t('n+2') + '.', 'Multiply by the LCD and solve the quadratic. Reject a root that is not an integer.'], 'consecutive integers');
  };
  /* a return trip k km/h slower; the round trip takes T: the speed going (EP B6, numerical response) */
  P9.returnSlower = function (r, cp) {
    var who = r.pick(['Jess', 'Owen', 'Talia', 'Marco']);
    var z = pickWhere(function () { return { s: r.int(8, 30), k: r.int(2, 8), D: r.int(10, 60) }; }, function (z) {
      z.T = z.D / z.s + z.D / (z.s - z.k); z.s1 = z.D * z.k / (z.T * z.s);
      return z.s > z.k + 2 && nice(z.T, 4) && z.T <= 10 && z.s1 < z.k && !(z.D === 45 && z.s === 18 && z.k === 3);
    });
    var q = rat(z.T), a = q[0], qq = q[1], B = -(a * z.k + 2 * qq * z.D), Cc = qq * z.D * z.k, g = gcd(gcd(a, B), Cc), A2 = a / g, B2 = B / g, C2 = Cc / g;
    var sol = 'Going ' + t('s') + ', returning ' + t('s-' + z.k) + ': ' + t('\\frac{' + z.D + '}{s}+\\frac{' + z.D + '}{s-' + z.k + '}=' + ex.texRat(q)) + ', ' + t('s\\ne 0,\\ ' + z.k) + '.<br>' +
      'Multiply by ' + t((qq === 1 ? '' : qq) + 's(s-' + z.k + ')') + ': ' + t((qq * z.D) + '(s-' + z.k + ')+' + (qq * z.D) + 's=' + (a === 1 ? '' : a) + 's(s-' + z.k + ')') + ', so ' + t(pt([A2, B2, C2], 's') + '=0') + ', ' + t(fac('s', z.s) + '(' + lt((A2 === 1 ? '' : A2) + 's', -C2 / z.s) + ')=0') + '.<br>' +
      t('s=' + ex.texRat(ex.norm(C2 / z.s, A2))) + ' makes the return speed negative (inadmissible), so ' + t('s=' + z.s) + ' km/h.';
    var p = KP.nr('<i>(Numerical Response)</i> ' + who + ' cycles ' + n(z.D) + ' km to a lake and returns at a speed ' + n(z.k) + ' km/h slower. The round trip takes ' + dec(z.T) + ' h of cycling. The speed going to the lake, in km/h, is ________.', z.s,
      function (v) { if (v === z.s - z.k) return { code: cp + 'other', hint: 'That is the return speed. The question asks for the speed going.' }; return null; }, sol,
      ['Add the two times: ' + t('\\frac{' + z.D + '}{s}+\\frac{' + z.D + '}{s-' + z.k + '}') + '.', 'Solve the quadratic and reject the root that makes the return speed negative.'], 'NR: a slower return');
    p.bad = [String(z.s - z.k)];
    return p;
  };
  /* into a headwind and back with a tailwind: the airspeed (EP C1) */
  P9.planeRound = function (r, cp) {
    var z = pickWhere(function () { return { s: 10 * r.int(12, 50), w: 10 * r.int(2, 8), D: 100 * r.int(3, 20) }; }, function (z) {
      z.T = 2 * z.D * z.s / (z.s * z.s - z.w * z.w);
      return z.w < z.s / 3 && (z.w * z.w) % z.s === 0 && nice(z.T, 4) && z.T <= 20 && !(z.D === 1200 && z.s === 200 && z.w === 40);
    });
    var s = z.s, w = z.w, D = z.D, q = rat(z.T), m = w * w / s;
    var sol = t('\\frac{' + F(D) + '}{s-' + w + '}+\\frac{' + F(D) + '}{s+' + w + '}=' + ex.texRat(q)) + ', ' + t('s\\ne\\pm ' + w) + '.<br>' +
      'Multiply by ' + t((q[1] === 1 ? '' : q[1]) + '(s-' + w + ')(s+' + w + ')') + ': ' + t(F(q[1] * D) + '(s+' + w + ')+' + F(q[1] * D) + '(s-' + w + ')=' + (q[0] === 1 ? '' : q[0]) + '(s^{2}-' + F(w * w) + ')') + ', so ' + t(F(2 * q[1] * D) + 's=' + (q[0] === 1 ? '' : q[0]) + 's^{2}-' + F(q[0] * w * w)) + '.<br>' +
      t(pt([1, -(s - m), -s * m], 's') + '=0') + ', ' + t(facT('s', s, -m) + '=0') + ': airspeed ' + t('s=' + s) + ' km/h (reject ' + t('-' + m) + '). Check: ' + t('\\frac{' + F(D) + '}{' + (s - w) + '}+\\frac{' + F(D) + '}{' + (s + w) + '}=' + dec(z.T)) + ' ✓';
    var p = KP.number('A plane flies ' + n(D) + ' km into a ' + n(w) + ' km/h headwind and then returns with the same wind as a tailwind. The two flights take ' + dec(z.T) + ' h in total. Determine the plane’s airspeed.', s,
      function (v) { if (v === s + w || v === s - w) return { code: cp + 'ground', hint: 'That is a ground speed. The airspeed is the speed in still air.' }; if (v === -m || v === m) return { code: cp + 'neg', hint: 'Reject the negative root.' }; return null; }, sol,
      ['Into the headwind ' + t('s-' + w) + ', with the tailwind ' + t('s+' + w) + '. Add the two times.', 'Multiply by the LCD and solve the quadratic; reject the negative root.'], 'a round trip by air', { after: 'km/h' });
    p.bad = [String(s + w)];
    return p;
  };
  /* a round trip k km/h faster coming back; total T; to the nearest tenth (EP C4) */
  P9.roundTenths = function (r, cp) {
    var who = r.pick(['Owen', 'Bea', 'Felix', 'Nadia']), pr = who === 'Bea' || who === 'Nadia' ? 'her' : 'his';
    var z = pickWhere(function () { return { D: r.int(10, 60), k: r.int(2, 8), T: r.pick([2, 2.5, 3, 3.5, 4]) }; }, function (z) {
      var q = rat(z.T); z.a = q[0]; z.q = q[1]; z.B = z.a * z.k - 2 * z.q * z.D; z.Cc = -z.q * z.D * z.k; z.disc = z.B * z.B - 4 * z.a * z.Cc;
      if (isqrt(z.disc) >= 0) return false;
      z.s = (-z.B + Math.sqrt(z.disc)) / (2 * z.a); var f = z.s * 10 - Math.floor(z.s * 10);
      return z.s >= 6 && z.s <= 35 && Math.abs(f - 0.5) > 0.06 && !(z.D === 30 && z.k === 5 && z.T === 3);
    });
    var g = gcd(gcd(z.a, z.B), z.Cc), A = z.a / g, B = z.B / g, C2 = z.Cc / g, Dd = B * B - 4 * A * C2;
    var sol = 'Going ' + t('s') + ', returning ' + t('s+' + z.k) + ': ' + t('\\frac{' + z.D + '}{s}+\\frac{' + z.D + '}{s+' + z.k + '}=' + rx(z.T)) + ', ' + t('s\\ne 0,\\ -' + z.k) + '.<br>' +
      'Multiply by ' + t((z.q === 1 ? '' : z.q) + 's(s+' + z.k + ')') + ': ' + t((z.q * z.D) + '(s+' + z.k + ')+' + (z.q * z.D) + 's=' + (z.a === 1 ? '' : z.a) + 's(s+' + z.k + ')') + ', so ' + t(pt([A, B, C2], 's') + '=0') + '.<br>' +
      t('s=\\frac{' + (-B) + '\\pm\\sqrt{' + Dd + '}}{' + 2 * A + '}') + '; the positive root is ' + t('s\\approx ' + K.roundTo(z.s, 2).toFixed(2)) + '.<br>Going about ' + t(K.roundTo(z.s, 1).toFixed(1)) + ' km/h, returning about ' + t(K.roundTo(z.s + z.k, 1).toFixed(1)) + ' km/h.';
    return boxesN(who + ' cycles ' + n(z.D) + ' km to a friend’s house and returns ' + n(z.k) + ' km/h faster. Each way is the same route, and the round trip takes ' + dec(z.T) + ' h of riding. Determine ' + pr + ' speed each way, to the nearest tenth of a km/h.', [
      { label: 'Going:', ans: z.s, dp: 1, after: 'km/h' }, { label: 'Returning:', ans: z.s + z.k, dp: 1, after: 'km/h' }], sol,
      ['Add the two times and set the sum equal to ' + t(rx(z.T)) + '.', 'The quadratic does not factor: use the quadratic formula and keep the positive root.'], 'a round trip: the quadratic formula');
  };
  /* a number minus k times its reciprocal is b: both roots (EP A2, L10 #20); o.pos: a positive number c more than d times its reciprocal (EP10 #12, NR) */
  P9.recipMinus = function (r, cp, o) {
    o = o || {};
    if (o.pos) {
      var q = pickWhere(function () { return { n1: r.int(2, 12), n2: -r.int(1, 9) }; }, function (z) { var c = z.n1 + z.n2, d = -z.n1 * z.n2; return c > 0 && d > 1 && !(z.n1 === 5 && z.n2 === -2) && !(z.n1 === 3 && z.n2 === -2); });
      var c = q.n1 + q.n2, d = -q.n1 * q.n2;
      var p = KP.nr('<i>(Numerical Response)</i> A positive number is ' + n(c) + ' more than ' + timesW(d) + ' its reciprocal. The number is ________.', q.n1,
        function (v) { if (v === -q.n2) return { code: cp + 'neg', hint: 'The number is positive: that comes from the negative root ' + t(q.n2) + '. Check your factoring.' }; return null; },
        t('n=' + c + '+\\frac{' + d + '}{n}') + ', ' + t('n\\ne 0') + '. Multiply by ' + t('n') + ': ' + t('n^{2}=' + (c === 1 ? '' : c) + 'n+' + d) + ', so ' + t(pt([1, -c, -d], 'n') + '=0') + ' and ' + t(facT('n', q.n1, q.n2) + '=0') + '.<br>The positive number is ' + t(q.n1) + ' (reject ' + t(q.n2) + '). Check: ' + t(c + '+\\frac{' + d + '}{' + q.n1 + '}=' + q.n1) + ' ✓',
        ['Let the number be ' + t('n') + '. “' + cap(timesW(d)) + ' its reciprocal” is ' + t('\\frac{' + d + '}{n}') + '.', 'Multiply by ' + t('n') + ', solve the quadratic and keep the positive root.'], 'NR: a number and its reciprocal');
      p.bad = [String(-q.n2)].filter(function (b) { return b !== String(q.n1); });
      return p;
    }
    var s = pickWhere(function () { return { r1: r.int(2, 12), r2: -r.int(1, 10) }; }, function (z) {
      var b = z.r1 + z.r2, k = -z.r1 * z.r2; return b !== 0 && k > 1 && k <= 60 && !(k === 15 && b === 2) && !(k === 6 && b === 1) && !(k === 12 && b === 1) && (TIMES[k] != null || k <= 30);
    });
    var b = s.r1 + s.r2, k = s.r1 * -s.r2;
    var sol = t('n-\\frac{' + k + '}{n}=' + b) + ', ' + t('n\\ne 0') + '. Multiply by ' + t('n') + ': ' + t('n^{2}-' + k + '=' + (b === 1 ? '' : b === -1 ? '-' : b) + 'n') + ', so ' + t(pt([1, -b, -k], 'n') + '=0') + ' and ' + t(facT('n', s.r1, s.r2) + '=0') + '.<br>' +
      'The number is ' + t(s.r1) + ' or ' + t(s.r2) + ' (both check: ' + t(s.r1 + '-\\frac{' + k + '}{' + s.r1 + '}=' + b) + ', ' + t('(' + s.r2 + ')-\\frac{' + k + '}{' + s.r2 + '}=' + b) + ').';
    return A6().rootsPart(cp, (o.diff ? 'The difference between a number and ' : 'A number minus ') + timesW(k) + ' its reciprocal is ' + n(b) + '. Determine the number. (Give every possibility.)', [s.r1, s.r2], { v: 'n', bothValid: true }, sol,
      ['Let the number be ' + t('n') + '. ' + cap(timesW(k)) + ' its reciprocal is ' + t('\\frac{' + k + '}{n}') + '.', 'Multiply every term by ' + t('n') + ', solve the quadratic and check both roots.'], 'a number and its reciprocal');
  };
  /* a car makes a trip h hours faster than a bus (EP B1) */
  P9.busFaster = function (r, cp) {
    var C = r.pick([['A car', 'a bus', 'car', 'bus'], ['A train', 'a bus', 'train', 'bus'], ['A van', 'a truck', 'van', 'truck']]);
    var z = pickWhere(function () { return { s: 5 * r.int(8, 18), k: 5 * r.int(2, 6), h: r.pick([1, 1, 0.5]) }; }, function (z) { z.D = z.h * z.s * (z.s + z.k) / z.k; return nice(z.D) && z.D <= 600 && z.D >= 60 && nice(z.D / z.s, 4) && !(z.D === 180 && z.k === 15); });
    var s = z.s, k = z.k, D = z.D, h = rat(z.h), Cc = D * k / z.h, neg = -(s + k);
    var sol = cap(C[3]) + ' ' + t('s') + ', ' + C[2] + ' ' + t('s+' + k) + ': ' + t('\\frac{' + F(D) + '}{s}-\\frac{' + F(D) + '}{s+' + k + '}=' + ex.texRat(h)) + ', ' + t('s\\ne 0,\\ -' + k) + '.<br>' +
      'Multiply by ' + t((h[1] === 1 ? '' : h[1]) + 's(s+' + k + ')') + ': ' + t(F(h[1] * D) + '(s+' + k + ')-' + F(h[1] * D) + 's=' + (h[0] === 1 ? '' : h[0]) + 's(s+' + k + ')') + ', so ' + t(pt([1, k, -Cc], 's') + '=0') + ', ' + t(facT('s', s, neg) + '=0') + '.<br>' +
      cap(C[3]) + ' ' + n(s) + ' km/h (' + dec(D / s) + ' h), ' + C[2] + ' ' + n(s + k) + ' km/h (' + dec(D / (s + k)) + ' h).';
    return boxesN(C[0] + ' makes a ' + n(D) + ' km trip ' + hText(z.h) + ' faster than ' + C[1] + ', because its average speed is ' + n(k) + ' km/h greater. Determine the speed of each.', [
      { label: cap(C[3]) + ':', ans: s, after: 'km/h', diag: function (v) { if (v === -neg) return { code: cp + 'neg', hint: 'That comes from the negative root.' }; return null; } }, { label: cap(C[2]) + ':', ans: s + k, after: 'km/h' }], sol,
      [H_D + ' Let the slower speed be ' + t('s') + '.', 'Slower time minus faster time is ' + hText(z.h) + '. Multiply by the LCD and solve the quadratic.'], 'a faster trip: a quadratic');
  };

  /* ======================================================================================================
   * The lesson
   * ====================================================================================================== */
  function mk(fn, o) { return function (r) { return fn(r, CP, o); }; }
  var QUESTIONS = [
    { num: '1', section: 'Number problems', parts: [
      { id: '1a', level: 'PRG', make: mk(P9.recipSum) },
      { id: '1b', level: 'MAS', make: mk(P9.recipPair) }] },
    { num: '2', parts: [{ id: '2', level: 'PRG', make: mk(P9.fracProb) }] },
    { num: '3', section: 'Distance, speed and time', parts: [{ id: '3', level: 'BEG', make: function (r) { return P9.sameTime(r, CP, { ctx: r.pick([0, 1, 2, 3]) }); } }] },
    { num: '4', shared: function (r) { return P9.fasterShared(r, { kind: 'cycle' }); }, stem: function (z) { return z.who + ' ' + z.verb + ' ' + n(z.D) + ' km. If ' + z.she + ' rode ' + n(z.k) + ' km/h faster, the trip would take ' + hText(z.h) + ' less.'; }, parts: [
      { id: '4a', level: 'EMG', make: function (r, z) { return P9.fasterTable(r, CP, z); } },
      { id: '4b', level: 'ADV', make: function (r, z) { return P9.fasterSolve(r, CP, z); } }] },
    { num: '5', parts: [{ id: '5', level: 'ADV', make: mk(P9.slowerHome) }] },
    { num: '6', parts: [{ id: '6', level: 'MAS', make: mk(P9.runWalk) }] },
    { num: '7', section: 'Current and wind', parts: [{ id: '7', level: 'ADV', make: function (r) { return P9.currentRound(r, CP, { jet: false }); } }] },
    { num: '8', parts: [{ id: '8', level: 'PRG', make: mk(P9.windSame) }] },
    { num: '9', section: 'Work rate', parts: [
      { id: '9a', level: 'BEG', make: mk(P9.workTogether) },
      { id: '9b', level: 'EMG', make: mk(P9.workOther) }] },
    { num: '10', parts: [{ id: '10', level: 'ADV', make: function (r) { return P9.workFaster(r, CP, { ctx: 'machine' }); } }] },
    { num: '11', parts: [
      { id: '11a', level: 'PRG', make: mk(P9.headStart) },
      { id: '11b', level: 'PRG', make: mk(P9.drain) }] },
    { num: '12', section: 'Other rational models', parts: [{ id: '12', level: 'ADV', make: mk(P9.winsRow) }] },
    { num: '13', parts: [{ id: '13', level: 'PRG', make: mk(P9.avgSpeed) }] },
    { num: '14', section: 'Multiple choice and numerical response', parts: [{ id: '14', level: 'EMG', make: mk(P9.modelMC) }] },
    { num: '15', parts: [{ id: '15', level: 'BEG', make: mk(P9.fracJobMC) }] },
    { num: '16', parts: [{ id: '16', level: 'EMG', make: mk(P9.pipesMC) }] },
    { num: '17', parts: [{ id: '17', level: 'EMG', make: function (r) { return P9.workTogether(r, CP, { nr: true, ctx: r.pick([0, 1, 2]) }); } }] }
  ];
  var EXTRA = [
    { num: 'A1', section: 'A. Skills', stem: 'Write an expression for each quantity.', parts: [
      { id: 'A1a', level: 'LIM', make: function (r) { return P9.exprPart(r, CP, 'a'); } },
      { id: 'A1b', level: 'LIM', make: function (r) { return P9.exprPart(r, CP, 'b'); } },
      { id: 'A1c', level: 'BEG', make: function (r) { return P9.exprPart(r, CP, 'c'); } },
      { id: 'A1d', level: 'BEG', make: function (r) { return P9.exprPart(r, CP, 'd'); } }] },
    { num: 'A2', parts: [{ id: 'A2', level: 'PRG', make: mk(P9.recipMinus) }] },
    { num: 'A3', parts: [{ id: 'A3', level: 'BEG', make: function (r) { return P9.sameTime(r, CP, { ctx: 4, noTime: true }); } }] },
    { num: 'A4', parts: [{ id: 'A4', level: 'BEG', make: function (r) { return P9.workTogether(r, CP, { ctx: r.pick([2, 3, 5]) }); } }] },
    { num: 'B1', section: 'B. Applying', parts: [{ id: 'B1', level: 'PRG', make: mk(P9.busFaster) }] },
    { num: 'B2', parts: [{ id: 'B2', level: 'ADV', make: function (r) { return P9.currentRound(r, CP, { jet: true }); } }] },
    { num: 'B3', parts: [{ id: 'B3', level: 'ADV', make: function (r) { return P9.workFaster(r, CP, { ctx: 'pipe' }); } }] },
    { num: 'B4', parts: [{ id: 'B4', level: 'PRG', make: mk(P9.consecInts) }] },
    { num: 'B5', parts: [{ id: 'B5', level: 'EMG', make: mk(P9.windTimeMC) }] },
    { num: 'B6', parts: [{ id: 'B6', level: 'ADV', make: mk(P9.returnSlower) }] },
    { num: 'C1', section: 'C. Stretch', parts: [{ id: 'C1', level: 'MAS', make: mk(P9.planeRound) }] },
    { num: 'C2', parts: [{ id: 'C2', level: 'ADV', make: mk(P9.crewB) }] },
    { num: 'C3', parts: [{ id: 'C3', level: 'ADV', make: function (r) { return P9.winsRow(r, CP, { mix: true }); } }] },
    { num: 'C4', parts: [{ id: 'C4', level: 'MAS', make: mk(P9.roundTenths) }] }
  ];

  HW.defineLesson({ id: LID, unit: 6, num: '9', title: 'Problems Involving Rational Equations (work, motion, numbers)', outcome: 'AN6', calc: true, questions: QUESTIONS, extra: EXTRA });
})(window);
