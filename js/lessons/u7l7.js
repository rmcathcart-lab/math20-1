/* Math 20-1 · Unit 7 · Lesson 7 — Reciprocal Functions of Quadratic Functions (outcome RF11 on every part)
 * Assignment 7 (m201book unit7/u7_l07.tex, Questions 1–18) and the Lesson 7 Extra Practice (u7_ep07.tex: A1–A5,
 * B1–B5, C1–C3; extra ids start with E). Every part is a generator: the booklet question's idea, form and difficulty
 * with new numbers (the lesson's example functions and the booklet's own functions are left out). Calculator allowed;
 * answers exact where the booklet's are (fractions, radicals, points).
 *
 * Answers are typed: asymptotes as equations "x = 2, x = -4, y = 0" (or none); points "(3, -1)" and sets of points
 * "(3 ± √2, 1), (3, -1)" (or none); turning-point type as a word; domains "{x | x ≠ 2, x ≠ 4, x ∈ ℝ}" (± allowed,
 * radicals allowed; {x | x ∈ ℝ}); ranges and intervals in set notation, inequalities or interval notation (K.set);
 * f(x) in vertex form (checked for the form a(x − p)² + q) and in general form (expanded); a table of reciprocals with
 * "undefined" at the zeros. Sketches become what the sketch shows (asymptotes, turning point, invariant points) or a
 * choose-the-graph question (Q4(b), Extra A5(b)); "explain" items (Q10(a)(b), Q12) become multiple choice of
 * explanations; "describe a strategy" (Q7(a)) asks for the vertex of f, its first step.
 * Recognised mistakes (u7l7- codes): asymptote signs, the constant term, a double zero counted twice, y = 0 left out;
 * the vertex of f given as the turning point, maximum and minimum switched; the y-intercept of f; table values of f,
 * 0 for undefined; invariant points on only one of y = ±1 or at the zeros; domain with the vertex / wrong signs / all
 * real numbers; range of f, one branch left out, the inequality the wrong way, 0 included; working backwards without
 * the reciprocal, a wrong; the intervals of f for its reciprocal, an interval across an asymptote.
 * Levels: LIM BEG EMG PRG ADV MAS. Mastery: Q11(b), Q18, Extra C1–C3.
 *
 * The kit HW.u7k78 (below) is shared with js/lessons/u7l8.js (the Unit 7 review). Its small tools, answer readers and
 * checkers are copied from the Unit 7 assessment kit (js/lessons/u7test.js, which loads after the lessons); its codes
 * are registered for u7l7- and u7l8-, so the review can also call HW.u7assess builders (lazily) with u7l8- codes. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, KP = K.P, P = HW.poly, ex = HW.ex, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
  if (!K.set || !K.point || !K.pairs || !HW.graph || !K.poly) throw new Error('js/lessons/u7l7.js needs js/relfn.js, js/lines.js and js/poly.js');
  var LID = 'u7l7', CP = 'u7l7-';

  /* ======================================================================================================
   * Codes. BASE is the Unit 7 assessment list (u7test.js), so HW.u7assess builders can run with these prefixes.
   * ====================================================================================================== */
  var BASE = {
    // AN1
    'abs-bracket': ['Treated the absolute value bars as brackets (kept a negative value)', 'n'], 'abs-split': ['Split or merged the bars over a sum or difference', 'b'],
    'abs-minus': ['Made a negative sign outside the bars positive', 's'], 'dist-neg': ['Distance given as a negative number', 's'], 'dist-sub': ['Distance: subtracted the sizes of the numbers', 'b'],
    'net-total': ['Net change and total distance mixed up', 'b'], 'net-sign': ['Final position: change applied with the wrong sign', 's'],
    'simp-sign': ['Used |x| = x when x < 0 (or −x when x > 0)', 'b'], 'simp-case': ['Simplified for a different interval', 'b'], 'ab-other': ['Kept the value that breaks the sign condition', 's'], 'ab-a': ['Gave a instead of b', 'n'],
    // RF2 graphs
    'v-sign': ['Vertex / zero: solved ax + b = 0 with the wrong sign', 's'], 'v-yint': ['Gave the y-intercept point as the vertex', 'n'], 'yint-neg': ['y-intercept of |f| left negative', 'b'], 'yint-x': ['Gave the x-intercept as the y-intercept', 'n'],
    'pt-neg': ['Point on |f|: kept the negative y-value', 'n'], 'pt-xchg': ['Point: changed the x-coordinate', 'n'], 'pt-one': ['Gave only one of the two possible points', 'b'],
    'pw-swap': ['Piecewise: the two pieces on the wrong sides (inequality not reversed)', 'b'], 'pw-bound': ['Piecewise: wrong boundary', 'b'], 'pw-bsign': ['Piecewise: boundary (zero) with the wrong sign', 's'], 'pw-neg': ['Piecewise: took the opposite of only one term', 's'],
    'inv-sign': ['Invariant points with the wrong signs', 's'], 'inv-yint': ['Gave the y-intercept as an invariant point', 'b'], 'inv-vertex': ['Gave the vertex as an invariant point', 'n'], 'inv-none': ['Said there are no invariant points', 'n'], 'inv-extra': ['Listed invariant points where the graph does not meet the x-axis', 'n'],
    'rng-f': ['Gave the range of f instead of |f|', 'n'], 'rng-zero': ['Range y ≥ 0 for a graph that never reaches the x-axis', 'b'], 'rng-q': ['Range from the vertex for a graph that crosses the x-axis', 'b'], 'vtx-noreflect': ['Used the vertex of f without reflecting it', 'b'],
    'back-sign': ['Working backwards: the value with the wrong sign', 'b'], 'back-other': ['Working backwards: gave the reflection (the other possible f)', 's'], 'back-a': ['Working backwards: wrong stretch factor a', 'b'], 'back-slope': ['Working backwards: slope as run over rise', 'b'],
    // RF2 equations
    'one-case': ['Solved only one case (A = c or A = −c)', 'b'], 'no-iso': ['Split into cases before isolating the absolute value', 'n'], 'neg-abs': ['Solved |A| = a negative number', 'n'],
    'extr': ['Kept an extraneous root', 'b'], 'rej-valid': ['Rejected a root that checks', 's'], 'nosol-claim': ['Said “no solution” when there is one', 'n'], 'sol-missing': ['Missed a solution', 'b'], 'neg-one': ['Second case: changed the sign of only one term', 'b'],
    'cnt-hump': ['Number of solutions: the line touches the top of the hump (3)', 'b'], 'cnt-two': ['Number of solutions: missed the reflected hump (4)', 'b'], 'cnt-four': ['Number of solutions: counted the hump when the line is above it', 'b'], 'cnt-zero': ['Number of solutions when k = 0', 'b'], 'cnt-neg': ['Number of solutions when k < 0', 'n'],
    'wd-d': ['Equation from solutions: used the whole distance, not half', 'b'], 'wd-a': ['Equation from solutions: wrong centre', 'b'], 'k-dir': ['Values of k: inequality the wrong way', 'n'], 'k-end': ['Values of k: included the boundary', 's'],
    // RF11
    'asy-sign': ['Vertical asymptote with the wrong sign', 's'], 'asy-const': ['Vertical asymptote at the constant term', 'n'], 'asy-noh': ['Left out the horizontal asymptote y = 0', 's'], 'asy-xy': ['Wrote the vertical asymptote as y = …', 'b'],
    'asy-two': ['Two vertical asymptotes for a double zero', 'b'], 'asy-none': ['Said there are no vertical asymptotes', 'n'], 'asy-extra': ['Vertical asymptotes where f has no zeros', 'n'], 'asy-hz': ['Horizontal asymptote other than y = 0', 'b'],
    'yint-same': ['Gave the y-intercept of f, not of its reciprocal', 'n'], 'rinv-one': ['Gave only the invariant points on one of y = 1, y = −1', 'b'], 'rinv-zero': ['Used the zeros (y = 0) as invariant points', 'n'], 'rinv-swap': ['Invariant points: y = 1 and y = −1 mixed up', 'b'],
    'rpt-neg': ['Reciprocal point: changed the sign', 'n'], 'rpt-same': ['Reciprocal point: kept the y-value', 'n'], 'rpt-x': ['Reciprocal point: took the reciprocal of x', 'n'],
    'turn-type': ['Turning point: maximum and minimum switched', 's'], 'turn-q': ['Turning point: used the vertex of f (no reciprocal)', 'b'],
    'rr-f': ['Gave the range of f, not of its reciprocal', 'n'], 'rr-branch': ['Range of the reciprocal: left out one part', 'b'], 'rr-dir': ['Range of the reciprocal: the inequality the wrong way at 1/q', 'b'], 'rr-end': ['Range of the reciprocal: 0 included, or 1/q included or excluded wrongly', 's'],
    'rl-point': ['Used the reciprocal’s y-value as a value of f', 'b'], 'rl-slope': ['Linear f: wrong slope', 'b'], 'rb-vertex': ['Used the turning point as the vertex of f (no reciprocal)', 'b'], 'rb-a': ['Quadratic f: wrong a (stretch or sign)', 'b'],
    'k-sign': ['Parameter with the wrong sign', 's'], 'k-half': ['Parameter: forgot the factor 2 in the discriminant / perfect square', 'b'], 'k-vertex': ['Parameter: used the turning point’s y-value without the reciprocal', 'b'],
    // format nudges
    'exact': ['Rounded instead of exact (format)', ''], 'pts-fmt': ['Points not written as (x, y) (format)', ''], 'asy-fmt': ['Asymptotes not written as equations (format)', ''], 'type-word': ['Turning point type not stated (format)', '']
  };
  var OWN = {
    'va-count': ['Number of vertical asymptotes wrong', 's'], 'tab-f': ['Table: gave f(x) instead of its reciprocal', 'b'], 'tab-zero': ['Table: wrote 0 where 1/0 is undefined', 's'],
    'tab-undef': ['Table: wrote undefined where the reciprocal exists', 's'], 'tab-sign': ['Table: reciprocal with the wrong sign', 's'],
    'dom-sign': ['Domain: excluded values with the wrong signs', 's'], 'dom-vertex': ['Domain: excluded the vertex instead of the zeros', 'b'], 'dom-all': ['Domain: all real numbers (zeros of f not excluded)', 'b'],
    'dom-extra': ['Domain: excluded values where f has no zeros', 'b'], 'dom-one': ['Domain: left out an excluded value', 's'],
    'vf-form': ['Not written in vertex form (format)', ''], 'cond': ['Kept the value that breaks the given condition', 's'], 'yint-recip': ['Gave the reciprocal’s y-intercept as f(0)', 'b'],
    'int-f': ['Intervals: gave the intervals for f, not its reciprocal', 'n'], 'int-asy': ['Intervals: ran an interval across a vertical asymptote', 's'], 'int-swap': ['Intervals: increasing and decreasing swapped', 'b'],
    'k-two': ['Values of k: discriminant inequality the wrong way', 'b'], 'k-val': ['Values of k: wrong boundary value', 'b'], 'inv-count': ['Number of invariant points wrong', 'b'],
    'abs-turn': ['|1/f|: turning point not reflected', 'b'], 'abs-rng': ['|1/f|: range from the reflected turning point only', 's'], 'f-val': ['Value of f instead of its reciprocal (or the reverse)', 's'],
    'sum-one': ['Sum: used only one case', 'b'], 'prod-all': ['Product: used all the solutions', 's'], 'round-tenth': ['Rounded to the wrong place', ''],
    'tol-one': ['Tolerance: gave only one length', 'b'], 'tol-sum': ['Tolerance: added instead of subtracting (or the reverse)', 'b']
  };
  (function () {
    var codes = {}, part = {};
    [BASE, OWN].forEach(function (L) { Object.keys(L).forEach(function (k) { ['u7l7-', 'u7l8-'].forEach(function (cp) { codes[cp + k] = L[k][0]; if (L[k][1]) part[cp + k] = L[k][1]; }); }); });
    HW.addCodes(codes); HW.addPartial(part);
  })();

  /* ======================================================================================================
   * Small tools (as in u7test.js)
   * ====================================================================================================== */
  function gcd(a, b) { return ex.gcd(Math.abs(a), Math.abs(b)); }
  function pickWhere(gen, test) { for (var i = 0; i < 8000; i++) { var o = gen(); if (o && test(o)) return o; } throw new Error('u7k78: no instance found'); }
  function nz(r, lo, hi) { return (r.chance(0.5) ? -1 : 1) * r.int(lo, hi); }
  function toR(x) { if (Array.isArray(x)) return ex.norm(x[0], x[1]); for (var q = 1; q <= 2000; q++) { var p = x * q; if (Math.abs(p - Math.round(p)) < 1e-9) return ex.norm(Math.round(p), q); } return null; }
  function rv(x) { return Array.isArray(x) ? x[0] / x[1] : x; }
  function rt(x) { var f = toR(x); return f ? ex.texRat(f) : String(+rv(x).toFixed(6)); }
  function dt(x) { return String(+rv(x).toFixed(6)); }
  function rneg(x) { var f = toR(x); return [-f[0], f[1]]; }
  function sgT(x) { return (rv(x) < 0 ? '-' : '+') + rt(Math.abs(rv(x))); }
  function coefT(a) { var v = rv(a); return v === 1 ? '' : v === -1 ? '-' : rt(a); }
  function has(arr, x) { return arr.some(function (y) { return Math.abs(x - y) < 1e-9 * Math.max(1, Math.abs(x)); }); }
  function uniqNums(a) { var out = []; a.forEach(function (x) { if (!has(out, x)) out.push(x); }); return out; }
  function sameSet(A, B) { A = uniqNums(A); B = uniqNums(B); return A.length === B.length && A.every(function (x) { return has(B, x); }); }
  function isSq(n) { if (n < 0) return false; var s = Math.round(Math.sqrt(n)); return s * s === n; }
  function A(s) { return '\\left\\lvert ' + s + '\\right\\rvert '; }
  function M(c, e) { return e ? P.mono(toR(c), { x: e }) : P.num(toR(c)); }
  function lin(a, b) { return P.add(M(a, 1), M(b, 0)); }
  function quad(a, b, c) { return P.add(M(a, 2), M(b, 1), M(c, 0)); }
  function tx(p) { return P.tex(p); }
  function linT(a, b, cf) { return cf && rv(a) < 0 && rv(b) !== 0 ? P.seq([M(b, 0), M(a, 1)]) : tx(lin(a, b)); }
  function vtxT(a, p, q) { var s = coefT(a) + (rv(p) === 0 ? 'x^{2}' : '(x' + sgT(-rv(p)) + ')^{2}'); return s + (rv(q) === 0 ? '' : sgT(q)); }
  function pt(x, y) { return '(' + (x && x.tex ? x.tex : rt(x)) + ',\\ ' + (y && y.tex ? y.tex : rt(y)) + ')'; }
  function ptsT(list) { return list.length ? list.map(function (p) { return p[2] || pt(p[0], p[1]); }).join(',\\ ') : '\\text{none}'; }
  function rootsT(vals, v) { return vals.length ? vals.map(function (x) { return (v || 'x') + '=' + (x.tex || rt(x)); }).join(',\\ ') : '\\text{no solution}'; }
  function valOf(x) { return x && x.tex ? x.v : rv(x); }
  function fp(x) { var f = toR(x); return f[1] === 1 ? String(f[0]) : (f[0] < 0 ? '−' : '') + Math.abs(f[0]) + '/' + f[1]; }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  /* roots of A x² + B x + C = 0 (integers) as [{ v, tex }] — exact, radicals in simplest form */
  function qroots(Aq, Bq, Cq) {
    var D = Bq * Bq - 4 * Aq * Cq;
    if (D < 0) return [];
    if (isSq(D)) { var s = Math.round(Math.sqrt(D)); return uniqNums([(-Bq - s) / (2 * Aq), (-Bq + s) / (2 * Aq)]).sort(function (a, b) { return a - b; }).map(function (v) { return { v: v, tex: rt(toR(v)) }; }); }
    var k = 1, m = D; for (var f = 2; f * f <= m; f++) while (m % (f * f) === 0) { m /= f * f; k *= f; }
    var den = 2 * Aq, g = gcd(gcd(Bq, k), den); if (den < 0) g = -g;
    var c0 = -Bq / g, c1 = k / g, d = den / g, rad = (c1 === 1 ? '' : c1) + '\\sqrt{' + m + '}';
    function one(sgn) { var top = (c0 === 0 ? (sgn < 0 ? '-' : '') : c0 + (sgn < 0 ? '-' : '+')) + rad; return { v: (c0 + sgn * c1 * Math.sqrt(m)) / d, tex: d === 1 ? top : '\\frac{' + top + '}{' + d + '}' }; }
    return [one(-1), one(1)].sort(function (a, b) { return a.v - b.v; });
  }
  function lcmD(list) { var L = 1; list.forEach(function (x) { var f = toR(x); if (!f) throw new Error('u7k78: not a simple rational ' + x); L = L * f[1] / gcd(L, f[1]); }); return L; }
  function zerosOf(a, b, c) { var L = lcmD([a, b, c]); return qroots(Math.round(rv(a) * L), Math.round(rv(b) * L), Math.round(rv(c) * L)); }
  /* √x for a positive rational x, in simplest form */
  function sqrtT(x) {
    var f = toR(x), n = f[0] * f[1], d = f[1], k = 1, m = n;
    for (var i = 2; i * i <= m; i++) while (m % (i * i) === 0) { m /= i * i; k *= i; }
    var g = gcd(k, d); k /= g; d /= g;
    if (m === 1) return rt(toR(k / d));
    var top = (k === 1 ? '' : k) + '\\sqrt{' + m + '}';
    return d === 1 ? top : '\\frac{' + top + '}{' + d + '}';
  }

  /* graphs */
  function G(o) { return HW.graph(Object.assign({ x: [-6, 6], y: [-6, 6], labels: 2, max: 300, aria: 'graph' }, o)); }
  function mini(o) { return HW.graph(Object.assign({ x: [-6, 6], y: [-6, 6], labels: 2, max: 165, aria: 'graph' }, o)); }
  function crv(f, o) { return Object.assign({ f: f, start: 'arrow', end: 'arrow' }, o || {}); }
  /* branches of y = 1/f(x) between the zeros of f (zs sorted numbers) */
  function recFns(f, zs, xr) { var cuts = [xr[0]].concat(zs).concat([xr[1]]), out = []; for (var i = 0; i + 1 < cuts.length; i++) out.push(crv(function (x) { return 1 / f(x); }, { from: cuts[i] + (i ? 1e-3 : 0), to: cuts[i + 1] - (i + 2 < cuts.length ? 1e-3 : 0) })); return out; }
  /* an x-window around the given x-values, always showing the y-axis, at least 9 units wide */
  function win(xs, pad) {
    pad = pad == null ? 2 : pad;
    var lo = Math.floor(Math.min.apply(null, xs.concat([-1])) - pad), hi = Math.ceil(Math.max.apply(null, xs.concat([1])) + pad);
    while (hi - lo < 9) { lo--; if (hi - lo < 9) hi++; }
    return [lo, hi];
  }

  /* ======================================================================================================
   * Answer readers and checkers (as in u7test.js)
   * ====================================================================================================== */
  function plainLow(s) { return String(s == null ? '' : s).replace(/\\text\{([^}]*)\}|\\mathrm\{([^}]*)\}/g, function (m, a, b) { return a || b || ''; }).replace(/\\left|\\right|\\[,;:! ]|~/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase(); }
  function isNone(s) { var l = plainLow(s); return /^(no( real)? (solutions?|roots?)|no solution|none|no invariant points?|no( vertical)? asymptotes?|no turning points?|∅|\\emptyset|\\varnothing|\{ ?\}|\\\{ ?\\\})$/.test(l); }
  function splitTop(s) { var out = [], d = 0, cur = ''; for (var i = 0; i < s.length; i++) { var c = s.charAt(i); if (c === '{' || c === '(' || c === '[') d++; else if (c === '}' || c === ')' || c === ']') d--; if (c === ',' && d === 0) { out.push(cur); cur = ''; } else cur += c; } out.push(cur); return out; }
  function prep(resp) { return String(resp == null ? '' : resp).replace(/\\left|\\right/g, '').replace(/\\text\{\s*(or|and)\s*\}/gi, ',').replace(/(^|[^a-z\\])(or|and)(?![a-z])/gi, '$1,').replace(/;/g, ',').replace(/\\(quad|qquad)(?![a-zA-Z])|\\[ ,;:!]|~/g, ' '); }
  function numVal(s) { s = String(s).trim().replace(/^\+/, ''); if (!s) return null; var r = ex.parse(s); if (!r.ok) return null; var v = ex.value(r.ast); return isFinite(v) ? v : null; }
  function readVals(resp, v) {
    var s = prep(resp);
    if (!s.trim()) return { empty: true };
    var out = [], dec = false, pieces = splitTop(s);
    for (var i = 0; i < pieces.length; i++) {
      var p = pieces[i].trim().replace(/\\approx|≈|\\doteq/g, '='); if (!p) continue;
      var m = /^([a-zA-Z])\s*=\s*([\s\S]*)$/.exec(p); if (m) { if (v && m[1] !== v) return { letter: m[1] }; p = m[2].trim(); }
      if (!p || /=/.test(p)) return { bad: true };
      if (!/sqrt|√/.test(p) && (/\\times|\\cdot|[×*+]/.test(p) || /[0-9a-zA-Z})]\s*[-−]/.test(p))) return { unsimp: true };
      var alts = /\\pm|±/.test(p) ? [p.replace(/\\pm|±/g, '+'), p.replace(/\\pm|±/g, '-')] : [p];
      for (var j = 0; j < alts.length; j++) { var val = numVal(alts[j]); if (val == null) return { bad: true }; out.push(val); }
      if (/\d\.\d/.test(p)) dec = true;
    }
    return out.length ? { vals: out, dec: dec } : { empty: true };
  }
  function closeTo(a, b, round) { return Math.abs(a - b) < 1e-9 * Math.max(1, Math.abs(b)) || (round && Math.abs(a - b) <= (round === true ? 0.0051 : round)); }
  function matchVals(Aa, T, round) { return Aa.length === T.length && T.every(function (b) { return Aa.some(function (a) { return closeTo(a, b, round); }); }); }
  /* solutions of an equation (or values of a variable). vals: numbers, [p,q] or { v, tex }; o.extr: extraneous roots;
     o.wrongs: [{ vals, code, hint }]; o.round: true (to the hundredth) or a tolerance; o.v the variable */
  function rootsPart(cp, prompt, vals, o, sol, hints, text) {
    o = o || {};
    var v = o.v || 'x', T = uniqNums(vals.map(valOf)), extr = uniqNums((o.extr || []).map(valOf)).filter(function (e) { return !has(T, e); }), round = o.round || false;
    var wrongs = (o.wrongs || []).map(function (w) { return { vals: uniqNums(w.vals.map(valOf)), orig: w.vals, none: !w.vals.length, code: w.code, hint: w.hint }; }).filter(function (w) { return !(w.none ? !T.length : sameSet(w.vals, T)); });
    var extrHint = o.extrHint || 'Check every answer in the <b>original</b> equation: ' + (extr.length ? t(v + '=' + rt(toR(extr[0]) || extr[0])) + ' makes the side without bars negative, so it is extraneous' : 'one of yours does not check') + '.';
    var check = function (resp) {
      if (isNone(resp)) { if (!T.length) return ok(); var wn = wrongs.filter(function (w) { return w.none; })[0]; return wrong(wn ? wn.code : cp + 'nosol-claim', wn ? wn.hint : o.noneHint || 'There is a solution: solve both cases, then check each answer in the original equation.'); }
      var L = readVals(resp, v);
      if (L.empty) return form('empty', 'Type your answer first.');
      if (L.letter) return form('sol-letter', 'Use the variable ' + t(v) + ' here (you wrote ' + t(L.letter + '=') + ').');
      if (L.unsimp) return form('simplify', 'Simplify each solution to a single number (no ' + t('\\times') + ', + or − between numbers).');
      if (L.bad) return form('unreadable', 'Write each solution separated by commas, e.g. ' + t(v + '=3,\\ ' + v + '=-5') + (o.noNone ? '.' : ' (or: no solution).'));
      var Aa = uniqNums(L.vals);
      if (T.length && matchVals(Aa, T, round)) return ok();
      if (!round && L.dec && T.length && Aa.length === T.length && T.every(function (b) { return Aa.some(function (a) { return Math.abs(a - b) < 0.006; }); })) return form(cp + 'exact', 'Those are rounded decimals. Give the <b>exact</b> values (fractions or radicals).');
      for (var i = 0; i < wrongs.length; i++) if (!wrongs[i].none && matchVals(Aa, wrongs[i].vals, round)) return wrong(wrongs[i].code, wrongs[i].hint);
      if (!T.length) { if (extr.length && Aa.every(function (a) { return extr.some(function (e) { return closeTo(a, e, round); }); })) return wrong(cp + 'extr', extrHint + ' There is no solution.'); return wrong('value', 'Substitute your value into the original equation: it does not check.'); }
      var extra = Aa.filter(function (a) { return !T.some(function (b) { return closeTo(a, b, round); }); }), miss = T.filter(function (b) { return !Aa.some(function (a) { return closeTo(a, b, round); }); });
      if (extra.length && !miss.length && extr.length && extra.every(function (a) { return extr.some(function (e) { return closeTo(a, e, round); }); })) return wrong(cp + 'extr', extrHint);
      if (miss.length && !extra.length) return wrong(cp + (o.rejValid && extr.length ? 'rej-valid' : 'sol-missing'), o.rejValid && extr.length ? 'Check the solution you rejected again: it makes both sides equal, so keep it.' : o.missHint || 'Correct so far, but there ' + (miss.length === 1 ? 'is another solution' : 'are more solutions') + '. Solve <b>both</b> cases: the expression inside the bars equals the other side, or its opposite.');
      return wrong('value', null);
    };
    var keyTex = o.keyTex || rootsT(vals, v);
    var part = KP.math(prompt, check, keyTex, sol, hints, text, { keys: 'u7sol', vars: [v], placeholder: o.placeholder || 'e.g. ' + v + ' = 3, ' + v + ' = -5' + (o.noNone ? '' : '   (or: no solution)') });
    var bad = [];
    function setT(arr) { return rootsT(arr.map(function (x) { return x && x.tex ? x : toR(x) || x; }), v); }
    if (extr.length) bad.push(setT(T.concat(extr)));
    wrongs.forEach(function (w) { bad.push(w.none ? '\\text{no solution}' : setT(w.orig)); });
    if (T.length) bad.push('\\text{no solution}');
    part.bad = bad.filter(function (b, i, arr) { return arr.indexOf(b) === i && b !== keyTex; });
    if (o.answer) part.answer = o.answer;
    return part;
  }

  /* a set of points (or "none"); ± inside a point gives two points */
  function expandPm(s) { return String(s).replace(/\(([^()]*?)(\\pm|±)([^()]*?)\)/g, function (m, a, pm, b) { return '(' + a + '+' + b + '), (' + a + '-' + b + ')'; }); }
  function ptsCheck(cp, pairs, wrongs, o) {
    o = o || {};
    var base = pairs.length ? K.pairs(pairs.map(function (p) { return [valOf(p[0]), valOf(p[1])]; })) : null;
    var same = function (L) { return L.length === pairs.length && L.every(function (q) { return pairs.some(function (p) { return Math.abs(valOf(p[0]) - valOf(q[0])) < 1e-9 && Math.abs(valOf(p[1]) - valOf(q[1])) < 1e-9; }); }); };
    var W = (wrongs || []).filter(function (w) { return w.pairs && !same(w.pairs); })
      .map(function (w) { return { c: w.pairs.length ? K.pairs(w.pairs.map(function (p) { return [valOf(p[0]), valOf(p[1])]; })) : null, none: !w.pairs.length, code: w.code, hint: w.hint }; });
    return function (resp) {
      var s = String(resp == null ? '' : resp).replace(/\\left|\\right/g, '').replace(/\\[ ,;:!]|~/g, ' ');
      if (!s.trim()) return form('empty', 'Type your answer first.');
      if (isNone(s)) { if (!pairs.length) return ok(); var wn = W.filter(function (w) { return w.none; })[0]; return wrong(wn ? wn.code : cp + (o.noneCode || 'inv-none'), wn ? wn.hint : o.noneHint || 'There are some: look for the points that are on both graphs.'); }
      if (!/\(/.test(s)) return form(cp + 'pts-fmt', 'Give each one as a point ' + t('(x,\\ y)') + ', separated by commas' + (o.noneOk !== false ? ' (or write none)' : '') + '.');
      s = expandPm(s);
      if (!pairs.length) { for (var j = 0; j < W.length; j++) if (W[j].c && W[j].c(s).v === 'correct') return wrong(W[j].code, W[j].hint); return wrong(cp + (o.extraCode || 'inv-extra'), o.extraHint || 'There are none here.'); }
      var res = base(s);
      if (res.v === 'correct' || res.v === 'form') return res;
      for (var i = 0; i < W.length; i++) if (W[i].c && W[i].c(s).v === 'correct') return wrong(W[i].code, W[i].hint);
      return res;
    };
  }
  function ptsPart(cp, prompt, pairs, wrongs, sol, hints, text, o) {
    o = o || {};
    var keyTex = ptsT(pairs), part = KP.math(prompt, ptsCheck(cp, pairs, wrongs, o), keyTex, sol, hints, text, { keys: 'u7pts', placeholder: 'e.g. (1, 0), (5, 0)' + (o.noneOk !== false ? '   (or: none)' : '') });
    part.bad = ptsBad(pairs, wrongs, o).filter(function (b) { return b !== keyTex; });
    return part;
  }
  function ptsBad(pairs, wrongs, o) {
    var same = function (L) { return L.length === pairs.length && L.every(function (q) { return pairs.some(function (p) { return Math.abs(valOf(p[0]) - valOf(q[0])) < 1e-9 && Math.abs(valOf(p[1]) - valOf(q[1])) < 1e-9; }); }); };
    return (wrongs || []).filter(function (w) { return !same(w.pairs); }).map(function (w) { return ptsT(w.pairs); }).concat(pairs.length && (!o || o.noneOk !== false) ? ['\\text{none}'] : []).filter(function (b, i, arr) { return arr.indexOf(b) === i; });
  }

  /* asymptotes "x = 2, y = 0" (or none). T = { xs: [...], hz: true when y = 0 must be listed } */
  function readAsy(resp) {
    var s = prep(resp);
    if (!s.trim()) return { empty: true };
    if (isNone(s)) return { none: true };
    var xs = [], ys = [], bare = false, last = null, pieces = splitTop(s);
    for (var i = 0; i < pieces.length; i++) {
      var p = pieces[i].trim(); if (!p) continue;
      var m = /^([xy])\s*=\s*([\s\S]+)$/.exec(p), vals, body;
      if (m) { last = m[1]; body = m[2]; } else { if (!last) return { bad: true }; bare = true; body = p; }
      vals = /\\pm|±/.test(body) ? [body.replace(/\\pm|±/g, '+'), body.replace(/\\pm|±/g, '-')] : [body];
      for (var j = 0; j < vals.length; j++) { var v = numVal(vals[j]); if (v == null) return { bad: true }; (last === 'x' ? xs : ys).push(v); }
    }
    return { xs: uniqNums(xs), ys: uniqNums(ys), bare: bare };
  }
  function asyCheck(cp, T, o) {
    o = o || {};
    var W = (o.wrongs || []).filter(function (w) { return !sameSet(w.xs, T.xs); });
    return function (resp) {
      var L = readAsy(resp);
      if (L.empty) return form('empty', 'Type your answer first.');
      if (L.bad) return form(cp + 'asy-fmt', 'Write each asymptote as an equation, e.g. ' + t('x=3') + (T.hz ? ', ' + t('y=0') : '') + ' (or write none).');
      if (L.none) { if (!T.xs.length && !T.hz) return ok(); return wrong(cp + 'asy-none', T.xs.length ? 'There ' + (T.xs.length === 1 ? 'is a vertical asymptote' : 'are vertical asymptotes') + ': one at each zero of ' + t('f') + '. Solve ' + t('f(x)=0') + '.' : 'Every reciprocal function has the horizontal asymptote ' + t('y=0') + '.'); }
      if (L.bare) return form(cp + 'asy-fmt', 'Write each asymptote as its own equation, e.g. ' + t('x=2,\\ x=-3') + '.');
      var xsOK = sameSet(L.xs, T.xs), ysOK = T.hz ? sameSet(L.ys, [0]) : (!L.ys.length || sameSet(L.ys, [0]));
      if (xsOK && ysOK) return ok();
      if (L.ys.some(function (y) { return y !== 0; }) && !L.xs.length && sameSet(L.ys, T.xs)) return wrong(cp + 'asy-xy', 'A vertical asymptote is a vertical line, ' + t('x=a') + ', not ' + t('y=a') + '.');
      for (var i = 0; i < W.length; i++) if (sameSet(L.xs, W[i].xs)) return wrong(W[i].code, W[i].hint);
      if (xsOK && L.ys.some(function (y) { return y !== 0; })) return wrong(cp + 'asy-hz', 'The vertical ' + (T.xs.length === 1 ? 'asymptote is' : 'asymptotes are') + ' right. The horizontal asymptote of ' + t('y=\\frac{1}{f(x)}') + ' is ' + t('y=0') + ': the reciprocal is never 0, but it gets close to 0 where ' + t('|f(x)|') + ' is large.');
      if (xsOK && T.hz && !L.ys.length) return wrong(cp + 'asy-noh', (T.xs.length ? 'The vertical asymptotes are right. ' : '') + 'A reciprocal function also has the horizontal asymptote ' + t('y=0') + ': list it too.');
      if (T.xs.length && L.xs.length === T.xs.length && sameSet(L.xs, T.xs.map(function (x) { return -x; }))) return wrong(cp + 'asy-sign', 'Check the sign: the vertical asymptotes are where ' + t('f(x)=0') + '. Solve that equation.');
      if (!T.xs.length && L.xs.length) return wrong(cp + 'asy-extra', t('f') + ' has no zeros, so ' + t('\\frac{1}{f(x)}') + ' is defined everywhere: no vertical asymptotes.');
      if (T.xs.length && L.xs.length < T.xs.length && L.xs.every(function (x) { return has(T.xs, x); })) return wrong('value', 'Correct so far: there is another vertical asymptote. ' + t('f') + ' has ' + T.xs.length + ' zeros.');
      return wrong('value', null);
    };
  }
  function asyT(xs, hz) { var a = xs.map(function (x) { return 'x=' + (x.tex || rt(x)); }); if (hz) a.push('y=0'); return a.length ? a.join(',\\ ') : '\\text{none}'; }
  function asyPart(cp, prompt, T, o, sol, hints, text) {
    o = o || {};
    var keyTex = asyT(T.xsT || T.xs, T.hz), part = KP.math(prompt, asyCheck(cp, T, o), keyTex, sol, hints, text, { keys: 'u7asy', placeholder: T.hz ? 'e.g. x = 3, y = 0' : 'e.g. x = 3, x = -1   (or: none)' });
    var bad = (o.wrongs || []).map(function (w) { return asyT(w.xs, T.hz); });
    if (T.hz) bad.push(asyT(T.xsT || T.xs, false));
    if (T.xs.length) bad.push('\\text{none}');
    part.bad = bad.filter(function (b, i, arr) { return arr.indexOf(b) === i && b !== keyTex; });
    return part;
  }

  /* an exact number (fractions, radicals); a rounded decimal near it is a format nudge when exact is asked */
  function valChk(cp, target, wr, o) {
    o = o || {};
    var T = rv(target), W = (wr || []).filter(function (w) { return Math.abs(rv(w.v) - T) > 1e-9; });
    var base = K.value(Array.isArray(target) ? target : T, { diag: function (v) { for (var i = 0; i < W.length; i++) if (Math.abs(v - rv(W[i].v)) < 1e-9 * Math.max(1, Math.abs(v))) return { code: W[i].code, hint: W[i].hint }; return null; } });
    var check = function (resp) { var res = base(resp); if (res.v === 'wrong' && res.code === 'value' && o.exact !== false) { var a = K.read(resp); if (!a.res && /\d\.\d/.test(String(resp)) && Math.abs(a.val - T) < 0.006 && Math.abs(a.val - T) > 1e-9) return form(cp + 'exact', 'That is a rounded decimal. Give the <b>exact</b> value.'); } return res; };
    return { check: check, W: W };
  }
  function valPart(cp, prompt, target, wr, sol, hints, text, o) {
    o = o || {};
    var vc = valChk(cp, target, wr, o), keyTex = o.keyTex || rt(target);
    var part = KP.math(prompt, vc.check, keyTex, sol, hints, text, { keys: o.keys || 'fraction', before: o.before, after: o.after });
    part.bad = vc.W.map(function (w) { return w.tex || rt(w.v); }).filter(function (b, i, arr) { return arr.indexOf(b) === i && b !== keyTex; });
    return part;
  }
  function pointChk(cp, target, wr) {
    var T = [valOf(target[0]), valOf(target[1])], W = (wr || []).filter(function (w) { return !(Math.abs(valOf(w.p[0]) - T[0]) < 1e-9 && Math.abs(valOf(w.p[1]) - T[1]) < 1e-9); });
    return { W: W, check: K.point(target.map(function (c) { return Array.isArray(c) ? c : toR(valOf(c)) || valOf(c); }), { wrong: W.map(function (w) { return { is: w.p.map(function (c) { return toR(valOf(c)) || valOf(c); }), code: w.code, hint: w.hint }; }), noBrackets: false }) };
  }
  function pointPart(cp, prompt, target, wr, sol, hints, text) {
    var pc = pointChk(cp, target, wr), keyTex = pt(target[0], target[1]);
    var part = KP.math(prompt, pc.check, keyTex, sol, hints, text, { keys: 'u7pts', placeholder: 'e.g. (3, -2)' });
    part.bad = pc.W.map(function (w) { return pt(w.p[0], w.p[1]); }).filter(function (b, i, arr) { return arr.indexOf(b) === i && b !== keyTex; });
    return part;
  }
  /* several labelled boxes; check(resp[]) decides, with each box's own result for the default */
  function fieldsPart(prompt, fields, checkers, keys, answer, sol, hints, text, bad, combine) {
    var base = K.fields(checkers, { labels: fields.map(function (f) { return f.name || f.label; }) });
    return { prompt: prompt, input: { type: 'fields', fields: fields }, check: function (resp) { resp = resp || []; var c = combine ? combine(resp) : null; return c || base(resp); }, key: keys, answer: answer, solution: sol, hints: hints || [], text: text, bad: bad || [] };
  }
  function polyIs(target) { var c = K.poly(target, { expanded: false }); return function (s) { var r = c(s); return r.v === 'correct'; }; }
  function withBad(p, wr) { p.bad = (wr || []).map(function (w) { return tx(w.is); }).filter(function (b, i, arr) { return arr.indexOf(b) === i && b !== p.key; }); return p; }
  function mc(r, prompt, opts, sol, hints, text, keep) { return KP.mc(r, prompt, opts, sol, hints, text, keep); }

  /* ======================================================================================================
   * New for Lessons 7–8: quadratic objects, domains, ranges, turning points, vertex form
   * ====================================================================================================== */
  function mkQ(a, b, c) {
    var av = rv(a), bv = rv(b), cv = rv(c), p = -bv / (2 * av), q = cv - bv * bv / (4 * av);
    if (Math.abs(p) < 1e-12) p = 0; if (Math.abs(q) < 1e-12) q = 0;
    var Q = { a: toR(av), b: toR(bv), c: toR(cv), av: av, bv: bv, cv: cv, p: p, q: q, poly: quad(av, bv, cv) };
    Q.f = function (x) { return av * x * x + bv * x + cv; };
    Q.zs = zerosOf(av, bv, cv); Q.zv = Q.zs.map(function (z) { return z.v; });
    Q.tex = tx(Q.poly); Q.vtex = vtxT(toR(av), toR(p), toR(q));
    return Q;
  }
  function mkV(a, p, q) { var av = rv(a), pv = rv(p), qv = rv(q); return mkQ(av, -2 * av * pv, av * pv * pv + qv); }
  /* "p ± d" for the two zeros (radicals), or null */
  function pmTex(Q) {
    if (Q.zs.length !== 2) return null;
    var irr = /sqrt/.test(Q.zs[0].tex); if (!irr && Q.p !== 0) return null;
    var d2 = -Q.q / Q.av; return (Q.p === 0 ? '' : rt(toR(Q.p))) + '\\pm ' + sqrtT(d2);
  }
  function zerosList(Q) { var pm = pmTex(Q); return pm ? 'x=' + pm : Q.zs.map(function (z) { return 'x=' + z.tex; }).join(',\\ '); }
  function S(v, c) { return '\\{' + v + '\\mid ' + c + ',\\ ' + v + '\\in\\mathbb{R}\\}'; }
  function domTex(Q) { if (!Q.zs.length) return '\\{x\\mid x\\in\\mathbb{R}\\}'; var pm = pmTex(Q); return S('x', pm ? 'x\\ne ' + pm : Q.zs.map(function (z) { return 'x\\ne ' + z.tex; }).join(',\\ ')); }
  /* a domain "all real numbers except …" typed in set notation or as conditions x ≠ a (± allowed) */
  function domRead(resp) {
    var s = String(resp == null ? '' : resp).replace(/\\left|\\right|\\big[lr]?|\\Big[lr]?/g, '').replace(/\\[ ,;:!]|~/g, ' ').replace(/\\lbrace|\\\{|\\rbrace|\\\}/g, ' ');
    s = s.replace(/\\text\{\s*all real numbers\s*\}|all real numbers/gi, '@R').replace(/\\text\{\s*(and|or)\s*\}|\band\b/gi, ',').replace(/;/g, ',');
    s = s.replace(/^\s*(\\text\{\s*domain\s*\}|domain|d)\s*[:=]\s*/i, '').replace(/^\s*x\s*(\\mid|\||\\vert)\s*/, '').trim();
    if (!s) return { empty: true };
    var vals = [], all = false, last = false, pieces = splitTop(s);
    for (var i = 0; i < pieces.length; i++) {
      var p = pieces[i].trim(); if (!p) continue;
      if (/^x\s*(\\in|∈)\s*/.test(p) || /^(@R|\\mathbb\s*\{?R\}?|\\R|ℝ|R)$/.test(p)) { all = true; continue; }
      var m = /^x\s*(\\neq|\\ne|≠|!=)\s*([\s\S]+)$/.exec(p), body;
      if (m) { body = m[2]; last = true; } else if (last) body = p; else return { bad: true };
      var alts = /\\pm|±/.test(body) ? [body.replace(/\\pm|±/g, '+'), body.replace(/\\pm|±/g, '-')] : [body];
      for (var j = 0; j < alts.length; j++) { var v = numVal(alts[j]); if (v == null) return { bad: true }; vals.push(v); }
    }
    if (!vals.length) return all ? { all: true } : { bad: true };
    return { vals: uniqNums(vals) };
  }
  function domChk(cp, Q) {
    var T = Q.zv, rational = Q.zs.every(function (z) { return !/sqrt/.test(z.tex); }), alt = rational ? K.set(Q.zs.length ? S('x', Q.zs.map(function (z) { return 'x\\ne ' + z.tex; }).join(',\\ ')) : domTex(Q), { v: 'x', tag: false }) : null;
    return function (resp) {
      var L = domRead(resp);
      if (L.empty) return form('empty', 'Type your answer first.');
      if (L.bad) { if (alt) { var r2 = alt(resp); if (r2.v === 'correct') return r2; } return form('unreadable', 'Write the domain like ' + t('\\{x\\mid x\\ne 2,\\ x\\ne -3,\\ x\\in\\mathbb{R}\\}') + ' (or ' + t('\\{x\\mid x\\in\\mathbb{R}\\}') + ').'); }
      if (L.all) return T.length ? wrong(cp + 'dom-all', t('f') + ' has ' + (T.length === 1 ? 'a zero' : 'zeros') + ': there ' + t('\\frac{1}{f(x)}') + ' is undefined (a vertical asymptote), so ' + (T.length === 1 ? 'it is' : 'they are') + ' not in the domain.') : ok();
      if (sameSet(L.vals, T)) return ok();
      if (!T.length) return wrong(cp + 'dom-extra', t('f') + ' has no zeros, so ' + t('\\frac{1}{f(x)}') + ' is defined for every real number.');
      if (sameSet(L.vals, T.map(function (x) { return -x; }))) return wrong(cp + 'dom-sign', 'Check the signs: the values left out are the zeros of ' + t('f') + '. Solve ' + t('f(x)=0') + ' again.');
      if (sameSet(L.vals, [Q.p])) return wrong(cp + 'dom-vertex', 'The reciprocal is undefined where ' + t('f(x)=0') + ', not at the vertex.');
      if (L.vals.length < T.length && L.vals.every(function (x) { return has(T, x); })) return wrong(cp + 'dom-one', 'Correct so far: ' + t('f') + ' has another zero, and the reciprocal is undefined there too.');
      return wrong('value', 'The domain is every real number except the zeros of ' + t('f') + '.');
    };
  }
  /* the range of y = 1/f(x) from a and the vertex value q */
  function rangeInfo(cp, av, qv) {
    var wr = [], target, why, Sy = function (c) { return S('y', c); };
    if (qv === 0) {
      target = av > 0 ? Sy('y>0') : Sy('y<0');
      wr.push({ is: av > 0 ? Sy('y\\ge 0') : Sy('y\\le 0'), code: cp + 'rr-end', hint: 'The reciprocal is never 0 (' + t('y=0') + ' is an asymptote).' });
      wr.push({ is: av > 0 ? Sy('y<0') : Sy('y>0'), code: cp + 'rpt-neg', hint: 'The reciprocal has the same sign as ' + t('f(x)') + '.' });
      why = av > 0 ? t('f(x)\\ge 0') + ', and it is 0 only at the zero (an asymptote), so ' + t('\\frac{1}{f(x)}>0') : t('f(x)\\le 0') + ', and it is 0 only at the zero (an asymptote), so ' + t('\\frac{1}{f(x)}<0');
      return { target: target, wr: wr, why: why, fR: av > 0 ? Sy('y\\ge 0') : Sy('y\\le 0') };
    }
    var iq = rt(toR(1 / qv)), qT = rt(toR(qv));
    if (av > 0 && qv > 0) { target = Sy('0<y\\le ' + iq); wr.push({ is: Sy('y\\ge ' + iq), code: cp + 'rr-dir', hint: 'Where ' + t('f') + ' is large its reciprocal is small: ' + t('f(x)\\ge ' + qT) + ' gives ' + t('0<\\frac{1}{f(x)}\\le ' + iq) + '.' }, { is: Sy('0\\le y\\le ' + iq), code: cp + 'rr-end', hint: 'The reciprocal is never 0 (' + t('y=0') + ' is an asymptote).' }); why = t('f(x)\\ge ' + qT) + ', all positive, so ' + t('0<\\frac{1}{f(x)}\\le ' + iq); }
    else if (av > 0) { target = Sy('y\\le ' + iq + '\\text{ or }y>0'); wr.push({ is: Sy(iq + '\\le y<0'), code: cp + 'rr-dir', hint: 'Between the zeros ' + t(qT + '\\le f(x)<0') + ', so ' + t('\\frac{1}{f(x)}\\le ' + iq) + ' (small negatives have large negative reciprocals).' }, { is: Sy('y\\le ' + iq), code: cp + 'rr-branch', hint: 'Outside the zeros ' + t('f(x)>0') + ', so the reciprocal also takes every positive value.' }, { is: Sy('y>0'), code: cp + 'rr-branch', hint: 'Between the zeros ' + t('f') + ' is negative, so the reciprocal has negative values too.' }); why = t(qT + '\\le f(x)<0') + ' gives ' + t('\\frac{1}{f(x)}\\le ' + iq) + ', and ' + t('f(x)>0') + ' gives ' + t('\\frac{1}{f(x)}>0'); }
    else if (qv > 0) { target = Sy('y<0\\text{ or }y\\ge ' + iq); wr.push({ is: Sy('0<y\\le ' + iq), code: cp + 'rr-dir', hint: 'Between the zeros ' + t('0<f(x)\\le ' + qT) + ', so ' + t('\\frac{1}{f(x)}\\ge ' + iq) + '.' }, { is: Sy('y\\ge ' + iq), code: cp + 'rr-branch', hint: 'Outside the zeros ' + t('f(x)<0') + ', so the reciprocal also takes every negative value.' }, { is: Sy('y<0'), code: cp + 'rr-branch', hint: 'Between the zeros ' + t('f') + ' is positive, so the reciprocal has positive values too.' }); why = t('0<f(x)\\le ' + qT) + ' gives ' + t('\\frac{1}{f(x)}\\ge ' + iq) + ', and ' + t('f(x)<0') + ' gives ' + t('\\frac{1}{f(x)}<0'); }
    else { target = Sy(iq + '\\le y<0'); wr.push({ is: Sy('y\\le ' + iq), code: cp + 'rr-dir', hint: t('f(x)\\le ' + qT) + ' (all negative) gives ' + t(iq + '\\le\\frac{1}{f(x)}<0') + '.' }, { is: Sy(iq + '\\le y\\le 0'), code: cp + 'rr-end', hint: 'The reciprocal is never 0 (' + t('y=0') + ' is an asymptote).' }); why = t('f(x)\\le ' + qT) + ', all negative, so ' + t(iq + '\\le\\frac{1}{f(x)}<0'); }
    var fR = av > 0 ? Sy('y\\ge ' + qT) : Sy('y\\le ' + qT);
    wr.push({ is: fR, code: cp + 'rr-f', hint: 'That is the range of ' + t('y=f(x)') + '. Take the reciprocal of each part of it.' });
    return { target: target, wr: wr, why: why, fR: fR };
  }
  function typeChk(cp, type, av) {
    return function (v) {
      var l = plainLow(v), why = 'Check the type: ' + t('f') + ' opens ' + (av > 0 ? 'up' : 'down') + ', so its vertex is a ' + (av > 0 ? 'minimum' : 'maximum') + '; the reciprocal switches it.';
      if (/max/.test(l) && !/min/.test(l)) return type === 'maximum' ? ok() : wrong(cp + 'turn-type', why);
      if (/min/.test(l) && !/max/.test(l)) return type === 'minimum' ? ok() : wrong(cp + 'turn-type', why);
      if (!l) return form('empty', 'Type maximum or minimum.');
      return form(cp + 'type-word', 'Type <b>maximum</b> or <b>minimum</b>.');
    };
  }
  /* f(x) in vertex form a(x − p)² + q (the right function, x appearing once, squared) */
  function vformChk(cp, T) {
    var eq = K.poly(T, { expanded: false });
    return function (resp) {
      var r = eq(resp); if (r.v !== 'correct') return r;
      var s = String(resp == null ? '' : resp).replace(/\\left|\\right|\s|\\[,;:! ]/g, '');
      if ((s.match(/x/g) || []).length === 1 && /\^\{?2\}?/.test(s) && !/x\^\{?2\}?[+-]?\d*\.?\d*x/.test(s)) return ok();
      return form(cp + 'vf-form', 'That is the right function. Now write it in vertex form, ' + t('a(x-p)^{2}+q') + '.');
    };
  }

  /* ---------- field specs (one labelled box each), combined with combo() ---------- */
  function combo(prompt, specs, hints, text, combine, sol) {
    var keys = specs.map(function (s) { return s.k; }), bad = [];
    specs.forEach(function (s, i) { (s.bad || []).forEach(function (b) { if (b === s.k) return; var row = keys.slice(); row[i] = b; bad.push(row); }); });
    return fieldsPart(prompt, specs.map(function (s) { return s.f; }), specs.map(function (s) { return s.c; }), keys, specs.map(function (s) { return s.a; }).join('; '), sol || specs.map(function (s) { return s.s; }).filter(Boolean).join('<br>'), hints, text, bad, combine);
  }
  function sAsy(cp, Q, hz, o) {
    o = o || {};
    var xs = Q.zv, wr = [];
    if (o.wrongs) wr = wr.concat(o.wrongs);
    var c = asyCheck(cp, { xs: xs, hz: hz }, { wrongs: wr }), k = asyT(Q.zs, hz);
    var bad = wr.map(function (w) { return asyT(w.xs, hz); });
    if (hz) bad.push(asyT(Q.zs, false)); if (xs.length) bad.push('\\text{none}');
    if (xs.length && !sameSet(xs, xs.map(function (x) { return -x; }))) bad.push(asyT(xs.map(function (x) { return -x; }), hz));
    return { f: { label: hz ? 'Asymptotes' : 'Vertical asymptotes', mode: 'math', keys: 'u7asy', placeholder: hz ? 'e.g. x = 3, y = 0' : 'e.g. x = 3   (or: none)' }, c: c, k: k, a: t(k),
      s: (o.why || '') + (xs.length ? (o.why ? 'v' : 'V') + 'ertical asymptote' + (xs.length > 1 ? 's' : '') + ' at the zero' + (xs.length > 1 ? 's' : '') + ' of ' + t('f') + ': ' + t(asyT(Q.zs, false)) : t('f') + ' has no zeros: no vertical asymptote') + (hz ? '; horizontal asymptote ' + t('y=0') : '') + '.', bad: bad };
  }
  function sCount(cp, Q) {
    var n = Q.zs.length;
    return { f: { label: 'Number of vertical asymptotes', name: 'number', mode: 'math', keys: 'fraction', placeholder: '0, 1 or 2' }, c: K.value(n), k: String(n), a: String(n) + ' vertical asymptote' + (n === 1 ? '' : 's'), s: '', bad: [String(n === 2 ? 1 : 2)] };
  }
  function sTP(cp, Q) {
    if (Q.q === 0) {
      return { f: { label: 'Turning point', mode: 'math', keys: 'u7pts', placeholder: '(x, y)   (or: none)' }, k: '\\text{none}', a: 'no turning point',
        c: function (resp) { if (isNone(resp)) return ok(); if (!String(resp || '').trim()) return form('empty', 'Type your answer first.'); return wrong(cp + 'turn-q', 'The vertex of ' + t('f') + ' is on the ' + t('x') + '-axis: it is a zero, so there is a vertical asymptote ' + t('x=' + rt(toR(Q.p))) + ' there and no turning point.'); },
        s: 'The vertex ' + t(pt(toR(Q.p), 0)) + ' is a zero of ' + t('f') + ': a vertical asymptote, so there is no turning point.', bad: [pt(toR(Q.p), 0)] };
    }
    var tp = [toR(Q.p), toR(1 / Q.q)], wr = [{ p: [toR(Q.p), toR(Q.q)], code: cp + 'turn-q', hint: 'That is the vertex of ' + t('f') + '. The reciprocal’s turning point has ' + t('y=\\frac{1}{q}') + '.' }, { p: [toR(-Q.p), toR(1 / Q.q)], code: cp + 'pt-xchg', hint: 'The turning point has the same ' + t('x') + '-value as the vertex of ' + t('f') + '.' }, { p: [toR(Q.p), toR(-1 / Q.q)], code: cp + 'rpt-neg', hint: 'A reciprocal keeps the sign: ' + t('\\frac{1}{' + rt(toR(Q.q)) + '}') + '.' }];
    var pc = pointChk(cp, tp, wr), type = Q.av > 0 ? 'maximum' : 'minimum';
    return { f: { label: 'Turning point', mode: 'math', keys: 'u7pts', placeholder: '(x, y)' }, c: pc.check, k: pt(tp[0], tp[1]), a: t(pt(tp[0], tp[1])), bad: pc.W.map(function (w) { return pt(w.p[0], w.p[1]); }),
      s: 'Vertex of ' + t('f') + ': ' + t(pt(toR(Q.p), toR(Q.q))) + ', a ' + (Q.av > 0 ? 'minimum' : 'maximum') + ' (' + t('a' + (Q.av > 0 ? '>' : '<') + '0') + '). The reciprocal has the turning point ' + t('\\left(' + rt(toR(Q.p)) + ',\\ \\frac{1}{' + rt(toR(Q.q)) + '}\\right)=' + pt(tp[0], tp[1])) + ', a <b>' + type + '</b> point.' };
  }
  function sType(cp, Q) {
    var type = Q.av > 0 ? 'maximum' : 'minimum';
    return { f: { label: 'Type (maximum or minimum)', name: 'type', mode: 'text', wide: true, placeholder: 'maximum or minimum' }, c: typeChk(cp, type, Q.av), k: type, a: 'a ' + type + ' point', s: '', bad: [type === 'maximum' ? 'minimum' : 'maximum'] };
  }
  function sDom(cp, Q) {
    var k = domTex(Q), bad = [];
    if (Q.zs.length) bad.push('\\{x\\mid x\\in\\mathbb{R}\\}'); else bad.push(S('x', 'x\\ne ' + rt(toR(Q.p))));
    if (Q.zs.length && !sameSet(Q.zv, Q.zv.map(function (x) { return -x; }))) bad.push(S('x', Q.zv.map(function (x) { return 'x\\ne ' + rt(-x); }).join(',\\ ')));
    return { f: { label: 'Domain', mode: 'math', keys: 'set', vars: ['x'], placeholder: 'e.g. {x | x ≠ 2, x ∈ R}' }, c: domChk(cp, Q), k: k, a: 'domain ' + t(k),
      s: 'Domain: every real number except the zeros of ' + t('f') + ': ' + t(k) + '.', bad: bad };
  }
  function sRng(cp, Q) {
    var R = rangeInfo(cp, Q.av, Q.q);
    return { f: { label: 'Range', mode: 'math', keys: 'set', vars: ['y'], placeholder: 'e.g. {y | y > 0, y ∈ R}' }, c: K.set(R.target, { v: 'y', wrong: R.wr }), k: R.target, a: 'range ' + t(R.target),
      s: 'Range: ' + R.why + ': ' + t(R.target) + '.', bad: R.wr.map(function (w) { return w.is; }) };
  }
  function sYint(cp, Q) {
    var c = Q.cv;
    var vc = valChk(cp, toR(1 / c), [{ v: toR(c), code: cp + 'yint-same', hint: 'That is the ' + t('y') + '-intercept of ' + t('f') + '. The reciprocal’s is its reciprocal.' }, { v: toR(-1 / c), code: cp + 'rpt-neg', hint: 'A number and its reciprocal have the same sign.' }]);
    return { f: { label: t('y') + '-intercept', name: 'y-intercept', mode: 'math', keys: 'fraction', placeholder: 'a number' }, c: vc.check, k: rt(toR(1 / c)), a: t('y') + '-intercept ' + t(rt(toR(1 / c))),
      s: t('f(0)=' + rt(toR(c))) + ', so the ' + t('y') + '-intercept of the reciprocal is ' + t('\\frac{1}{' + rt(toR(c)) + '}=' + rt(toR(1 / c))) + '.', bad: vc.W.map(function (w) { return rt(w.v); }) };
  }
  /* the invariant points of y = f(x) and y = 1/f(x) */
  function invData(cp, Q) {
    var up = zerosOf(Q.av, Q.bv, Q.cv - 1), dn = zerosOf(Q.av, Q.bv, Q.cv + 1);
    var pairs = up.map(function (x) { return [x, 1, '(' + x.tex + ',\\ 1)']; }).concat(dn.map(function (x) { return [x, -1, '(' + x.tex + ',\\ -1)']; }));
    var wr = [];
    if (up.length && dn.length) { wr.push({ pairs: up.map(function (x) { return [x.v, 1]; }), code: cp + 'rinv-one', hint: 'Also solve ' + t('f(x)=-1') + ': ' + t('\\frac{1}{-1}=-1') + '.' }); wr.push({ pairs: dn.map(function (x) { return [x.v, -1]; }), code: cp + 'rinv-one', hint: 'Also solve ' + t('f(x)=1') + '.' }); }
    if (up.length && dn.length) wr.push({ pairs: up.map(function (x) { return [x.v, -1]; }).concat(dn.map(function (x) { return [x.v, 1]; })), code: cp + 'rinv-swap', hint: 'The solutions of ' + t('f(x)=1') + ' give points with ' + t('y=1') + '; those of ' + t('f(x)=-1') + ' give ' + t('y=-1') + '.' });
    if (Q.zs.length) wr.push({ pairs: Q.zs.map(function (x) { return [x.v, 0]; }), code: cp + 'rinv-zero', hint: 'Where ' + t('f(x)=0') + ' the reciprocal is undefined: those are asymptotes. Invariant points are where ' + t('f(x)=\\pm 1') + '.' });
    var fT = Q.tex, cs = function (cst, yv, rs) { return t(fT + '=' + yv) + ': ' + t(tx(quad(Q.av, Q.bv, cst)) + '=0') + (rs.length ? ', ' + t('x=' + (rs.length === 2 && /sqrt/.test(rs[0].tex) ? pmOf(rs) : rs.map(function (x) { return x.tex; }).join(',\\ '))) : ': no real roots') + '.'; };
    var sol = cs(Q.cv - 1, 1, up) + '<br>' + cs(Q.cv + 1, -1, dn) + '<br>Invariant points: ' + t(ptsT(pairs)) + '.';
    return { pairs: pairs, wr: wr, sol: sol, up: up, dn: dn };
  }
  function pmOf(rs) { var m = (rs[0].v + rs[1].v) / 2, d = (rs[1].v - rs[0].v) / 2, d2 = toR(d * d); var mt = Math.abs(m) < 1e-12 ? '' : rt(toR(m)); return d2 ? mt + '\\pm ' + sqrtT(d2) : rs.map(function (x) { return x.tex; }).join(',\\ '); }
  function sInv(cp, Q) {
    var D = invData(cp, Q);
    return { f: { label: 'Invariant points', mode: 'math', keys: 'u7pts', placeholder: 'e.g. (2, 1), (4, -1)   (or: none)' }, c: ptsCheck(cp, D.pairs, D.wr, { extraHint: t('f(x)') + ' is never ' + t('1') + ' or ' + t('-1') + ': there are no invariant points.' }), k: ptsT(D.pairs), a: 'invariant points ' + t(ptsT(D.pairs)), s: D.sol, bad: ptsBad(D.pairs, D.wr) };
  }
  function invPart(cp, Q, prompt, text) {
    var D = invData(cp, Q);
    return ptsPart(cp, prompt, D.pairs, D.wr, D.sol, ['Invariant points are where ' + t('f(x)=1') + ' or ' + t('f(x)=-1') + ' (a number equal to its own reciprocal).', 'Solve each quadratic equation; the quadratic formula gives exact radicals.'], text || 'invariant points of y = 1/f(x)', { noneOk: !!(D.up.length + D.dn.length === 0), extraHint: t('f(x)') + ' is never ' + t('1') + ' or ' + t('-1') + ': there are no invariant points.' });
  }
  var HINT_TP = ['The turning point of ' + t('y=\\frac{1}{f(x)}') + ' is ' + t('\\left(p,\\ \\frac{1}{q}\\right)') + ', where ' + t('(p,\\ q)') + ' is the vertex of ' + t('f') + '.', 'Where ' + t('f') + ' is smallest its reciprocal is largest (on the same side of the axis): a minimum of ' + t('f') + ' becomes a maximum.'];
  var HINT_DR = ['Domain: every real number except the zeros of ' + t('f') + ' (the vertical asymptotes).', 'Range: start from the range of ' + t('f') + ' and take the reciprocal of each part; the reciprocal keeps the sign and is never 0.'];
  var HINT_ASY = ['The vertical asymptotes of ' + t('y=\\frac{1}{f(x)}') + ' are at the zeros of ' + t('f') + ': factor, use the quadratic formula, or count them with the discriminant.', 'Every reciprocal function has the horizontal asymptote ' + t('y=0') + '.'];
  /* the turning point and its type as one part */
  function tpPart(cp, Q, prompt, text) {
    var a = sTP(cp, Q), b = sType(cp, Q);
    return combo(prompt, [a, b], HINT_TP, text || 'turning point of y = 1/f(x)', function (resp) { var r1 = a.c(resp[0] || ''); if (r1.v === 'correct') { var r2 = b.c(resp[1] || ''); if (r2.v === 'wrong') return r2; } return null; }, a.s);
  }
  /* graph of f with the guide lines y = ±1 */
  function fGraph(Q, xs, o) {
    o = o || {};
    var xr = o.x || win(xs.concat(Q.zv).concat([Q.p]), 2.5), yr = o.y || [-6, 6];
    return G({ x: xr, y: yr, fns: [crv(Q.f)], hline: [1, -1], max: o.max || 280, aria: 'the graph of the parabola y = f(x), with the guide lines y = 1 and y = −1' });
  }
  function recGraph(Q, xr, yr, o) {
    o = o || {};
    return (o.mini ? mini : G)({ x: xr, y: yr || [-5, 5], fns: recFns(Q.f, Q.zv, xr), vline: Q.zv, points: o.points, max: o.max || (o.mini ? 165 : 280), aria: o.aria || 'the graph of y = 1/f(x) with ' + Q.zv.length + ' vertical asymptote' + (Q.zv.length === 1 ? '' : 's') });
  }
  /* back from the reciprocal: vertex form + general form boxes */
  function sVform(cp, T, wr) {
    var c = vformChk(cp, T.poly), W = (wr || []).filter(function (w) { return !P.eq(w.is, T.poly); });
    var cc = function (resp) { var r = c(resp); if (r.v === 'correct' || r.v === 'form') return r; var rd = K.read(resp); if (!rd.res) { var rr = P.read(rd.ast); if (rr.ok) for (var i = 0; i < W.length; i++) if (P.eq(rr.p, W[i].is)) return wrong(W[i].code, W[i].hint); } return r; };
    return { f: { label: 'Vertex form: ' + t('f(x)='), name: 'vertex form', mode: 'math', keys: 'poly', vars: ['x'] }, c: cc, k: T.vtex, a: t('f(x)=' + T.vtex), s: '', bad: W.map(function (w) { return tx(w.is); }).concat([T.tex]) };
  }
  function sGform(cp, T, wr) {
    var W = (wr || []).filter(function (w) { return !P.eq(w.is, T.poly); });
    return { f: { label: 'General form: ' + t('f(x)='), name: 'general form', mode: 'math', keys: 'poly', vars: ['x'] }, c: K.poly(T.poly, { wrong: W }), k: T.tex, a: t('f(x)=' + T.tex), s: '', bad: W.map(function (w) { return tx(w.is); }) };
  }
  var HINT_BACK = ['The turning point ' + t('(p,\\ k)') + ' of the reciprocal comes from the vertex ' + t('\\left(p,\\ \\frac{1}{k}\\right)') + ' of ' + t('f') + '; vertical asymptotes are the zeros of ' + t('f') + '; a ' + t('y') + '-intercept ' + t('\\frac{1}{c}') + ' means ' + t('f(0)=c') + '.', 'Write ' + t('f(x)=a(x-p)^{2}+q') + ' and use a zero or another point to find ' + t('a') + '.'];
  /* a quadratic from its vertex form, for working backwards; wrong a (sign) and the vertex without the reciprocal */
  function backWrongs(cp, T, k, viaPt, cond) {
    var wr = [], p = T.p, q = T.q;
    wr.push({ is: mkV(-T.av, p, q).poly, code: cp + 'rb-a', hint: 'Check ' + t('a') + ': use ' + viaPt + ' again (and the direction the parabola opens).' });
    if (cond && Math.abs(rv(k) - q) > 1e-9 && Math.abs(cond[0] - p) > 1e-9) { var aw = toR((cond[1] - rv(k)) / ((cond[0] - p) * (cond[0] - p))); if (aw && aw[1] <= 50 && Math.abs(rv(aw)) < 50 && rv(aw) !== 0) wr.push({ is: mkV(aw, p, rv(k)).poly, code: cp + 'rb-vertex', hint: 'The vertex of ' + t('f') + ' has ' + t('y') + '-coordinate ' + t('\\frac{1}{' + rt(k) + '}=' + rt(toR(q))) + ': take the reciprocal of the turning point’s ' + t('y') + '-value.' }); }
    return wr;
  }


  /* the booklet's and the examples' functions — never generated */
  var AVOID = ['x^{2}-2x-3', 'x^{2}+3x-10', 'x^{2}-10x+25', '3x^{2}+2', '2x^{2}+5x-3', 'x^{2}-2x+4', 'x^{2}-7', 'x^{2}-4x+3', '\\frac{1}{2}x^{2}+2x+5', '-x^{2}+4x', 'x^{2}+x',
    'x^{2}-6x+8', 'x^{2}+x-12', '4x^{2}-12x+9', 'x^{2}-2x+7', '-3x^{2}+5x+2', 'x^{2}-5', 'x^{2}-4x', 'x^{2}+2x-8', 'x^{2}-3', '\\frac{1}{2}x^{2}+x-\\frac{3}{2}', '2x^{2}-12x+20', 'x^{2}-2x-6', 'x^{2}+4x+7', 'x^{2}+2x-3', 'x^{2}-6x+9', 'x^{2}+6x+10', 'x^{2}-4x+5', 'x^{2}-x-6', 'x^{2}+6x+9',
    'x^{2}-9x+20', '9x^{2}+6x+1', '-x^{2}-3', '2x^{2}+7x-4', 'x^{2}-8x+12', '-3x^{2}', '-x^{2}+9', 'x^{2}+2x', 'x^{2}-2x+2', 'x^{2}-4x-5', '-x^{2}+8x-7', '2x^{2}+4x+6', '-2x^{2}-4x+6',
    'x^{2}+4x+3', 'x^{2}-9', '2x^{2}+4x+7', '-x^{2}+6x-5', '-x^{2}+4x-9', 'x^{2}-6x+5', 'x^{2}-2x-7', '-x^{2}-2x+3', '\\frac{1}{3}x^{2}+\\frac{2}{3}x-\\frac{8}{3}', 'x^{2}-1', '4-x^{2}', '-x^{2}+4', 'x^{2}+1', '2x^{2}-8x+8'];
  function fresh(Q) { return AVOID.indexOf(Q.tex) < 0; }

  /* ---------- question builders shared with the review ---------- */
  /* vertical asymptotes: the number and the equations (L7 Ex 2, #2, EP07 A1) */
  function vaPart(r, cp, kind) {
    var Q, why;
    if (kind === 'two') { var z = pickWhere(function () { return { r1: r.int(-7, 6), w: r.int(1, 9) }; }, function (s) { var q = mkQ(1, -(2 * s.r1 + s.w), s.r1 * (s.r1 + s.w)); return s.r1 !== 0 && s.r1 + s.w !== 0 && s.r1 + s.w <= 8 && fresh(q); }); Q = mkQ(1, -(2 * z.r1 + z.w), z.r1 * (z.r1 + z.w)); why = t('f(x)=(x' + sgT(-z.r1) + ')(x' + sgT(-(z.r1 + z.w)) + ')') + ': two zeros. '; }
    else if (kind === 'twoA' || kind === 'twoNeg') {
      var neg = kind === 'twoNeg', z2 = pickWhere(function () { return { m: r.pick([2, 3, 4, 5]), n: nz(r, 1, 7), s: nz(r, 1, 6) }; }, function (s) { var Pp = P.mul(lin(s.m, -s.n), lin(1, -s.s)); if (neg) Pp = P.neg(Pp); return gcd(s.m, s.n) === 1 && AVOID.indexOf(tx(Pp)) < 0 && Math.abs(rv(P.constant(Pp))) <= 30; });
      var Pp = P.mul(lin(z2.m, -z2.n), lin(1, -z2.s)); if (neg) Pp = P.neg(Pp);
      Q = mkQ(P.coef(Pp, { x: 2 }), P.coef(Pp, { x: 1 }), P.constant(Pp)); why = t('f(x)=' + (neg ? '-(' : '(') + tx(lin(z2.m, -z2.n)) + ')(' + tx(lin(1, -z2.s)) + ')' + (neg ? '' : '')) + ': zeros ' + t(rt(toR([z2.n, z2.m]))) + ' and ' + t(z2.s) + '. ';
      if (neg) why = t('f(x)=-(' + tx(P.neg(Pp)) + ')=-(' + tx(lin(z2.m, -z2.n)) + ')(' + tx(lin(1, -z2.s)) + ')') + ': zeros ' + t(rt(toR([z2.n, z2.m]))) + ' and ' + t(z2.s) + '. ';
    } else if (kind === 'sq') {
      var z3 = pickWhere(function () { return { m: r.pick([1, 2, 2, 3, 3, 4, 5]), n: nz(r, 1, 7) }; }, function (s) { var Pp = P.mul(lin(s.m, -s.n), lin(s.m, -s.n)); return gcd(s.m, s.n) === 1 && AVOID.indexOf(tx(Pp)) < 0 && Math.abs(rv(P.constant(Pp))) <= 50; });
      var Pq = P.mul(lin(z3.m, -z3.n), lin(z3.m, -z3.n)); Q = mkQ(P.coef(Pq, { x: 2 }), P.coef(Pq, { x: 1 }), P.constant(Pq)); why = t('f(x)=(' + tx(lin(z3.m, -z3.n)) + ')^{2}') + ': one zero (a double root). ';
    } else if (kind === 'noneD') {
      var z4 = pickWhere(function () { return { b: nz(r, 1, 8), c: r.int(2, 30) }; }, function (s) { return s.b * s.b - 4 * s.c < 0 && fresh(mkQ(1, s.b, s.c)); }); Q = mkQ(1, z4.b, z4.c); why = t('b^{2}-4ac=' + z4.b * z4.b + '-' + 4 * z4.c + '=' + (z4.b * z4.b - 4 * z4.c) + '<0') + ': no zeros. ';
    } else if (kind === 'noneV') {
      var z5 = pickWhere(function () { return { a: r.pick([1, 2, 3, [1, 2]]), p: nz(r, 1, 5), q: r.int(1, 6) }; }, function (s) { return fresh(mkV(s.a, s.p, s.q)); }); Q = mkV(z5.a, z5.p, z5.q); Q.show = vtxT(toR(z5.a), z5.p, z5.q); why = 'It opens up from the vertex ' + t(pt(z5.p, z5.q)) + ' above the ' + t('x') + '-axis: no zeros. ';
    } else if (kind === 'noneNeg') {
      var z6 = pickWhere(function () { return { a: r.pick([1, 1, 2, 3, 4]), c: r.int(1, 9) }; }, function (s) { return fresh(mkQ(-s.a, 0, -s.c)); }); Q = mkQ(-z6.a, 0, -z6.c); why = t('f(x)=' + Q.tex + '\\le -' + z6.c) + ' for every ' + t('x') + ': no zeros. ';
    } else { // rad: x² − n
      var n = pickWhere(function () { return r.int(2, 30); }, function (x) { return !isSq(x) && fresh(mkQ(1, 0, -x)); }); Q = mkQ(1, 0, -n); why = t('x^{2}=' + n) + ', ' + t('x=\\pm ' + sqrtT(n)) + ': two zeros. ';
    }
    var ftex = Q.show || Q.tex, wr = [];
    if (kind === 'sq') wr.push({ xs: [Q.zv[0], -Q.zv[0]], code: cp + 'asy-two', hint: 'A perfect square has only one zero, so there is one vertical asymptote.' });
    if (kind === 'noneV') wr.push({ xs: [Q.p], code: cp + 'asy-extra', hint: 'At the vertex ' + t('f') + ' is not 0. ' + t('f') + ' has no zeros, so there is no vertical asymptote.' });
    if (kind === 'noneD' && Q.bv) wr.push({ xs: [Q.p], code: cp + 'asy-extra', hint: 'At the vertex ' + t('f') + ' is not 0. ' + t('f') + ' has no zeros, so there is no vertical asymptote.' });
    if (kind === 'two' && Q.cv) wr.push({ xs: [Q.cv], code: cp + 'asy-const', hint: 'The vertical asymptotes are at the zeros of ' + t('f') + ', not at its constant term. Factor ' + t('f(x)') + '.' });
    var a = sCount(cp, Q), b = sAsy(cp, Q, false, { wrongs: wr });
    var n2 = Q.zs.length;
    return combo('Let ' + t('f(x)=' + ftex) + '. State the number of vertical asymptotes of the graph of ' + t('y=\\dfrac{1}{f(x)}') + ' and their equations (or write none).', [a, b], HINT_ASY, 'vertical asymptotes of y = 1/f(x), f quadratic',
      function (resp) { var r2 = b.c(resp[1] || ''), r1 = a.c(resp[0] || ''); if (r2.v === 'correct' && r1.v === 'wrong') return wrong(cp + 'va-count', 'Your equations are right: count them. There ' + (n2 === 1 ? 'is 1 vertical asymptote' : 'are ' + n2 + ' vertical asymptotes') + '.'); return null; },
      why + (n2 ? (n2 === 1 ? 'One vertical asymptote: ' : 'Two vertical asymptotes: ') + t(asyT(Q.zs, false)) : 'No vertical asymptotes') + '.');
  }
  /* turning point, type, domain and range (L7 Ex 3, #3, EP07 A2, A4) */
  function tpdrPart(cp, Q, show, parts, text) {
    var specs = [], ftex = show || Q.tex;
    if (parts.indexOf('tp') >= 0) { specs.push(sTP(cp, Q)); if (Q.q !== 0) specs.push(sType(cp, Q)); }
    if (parts.indexOf('d') >= 0) specs.push(sDom(cp, Q));
    if (parts.indexOf('r') >= 0) specs.push(sRng(cp, Q));
    var ask = [];
    if (parts.indexOf('tp') >= 0) ask.push('the turning point of the graph of ' + t('y=\\dfrac{1}{f(x)}') + ' and whether it is a maximum or a minimum');
    if (parts.indexOf('d') >= 0 || parts.indexOf('r') >= 0) ask.push('the ' + (parts.indexOf('d') >= 0 && parts.indexOf('r') >= 0 ? 'domain and range' : parts.indexOf('d') >= 0 ? 'domain' : 'range') + ' of ' + t('y=\\dfrac{1}{f(x)}'));
    var zw = Q.zs.length ? 'Zeros of ' + t('f') + ': ' + t(zerosList(Q)) + '.' : t('f') + ' has no zeros.';
    var sol = specs.map(function (s) { return s.s; }).filter(Boolean);
    if (parts.indexOf('d') >= 0) sol.splice(sol.length - (parts.indexOf('r') >= 0 ? 2 : 1), 0, zw);
    var tpI = specs.indexOf(specs.filter(function (s) { return s.f.name === 'type'; })[0]);
    return combo('Let ' + t('f(x)=' + ftex) + '. State ' + ask.join(', and ') + '.', specs, (parts.indexOf('tp') >= 0 ? HINT_TP.slice(0, 1) : []).concat(HINT_DR), text,
      tpI > 0 ? function (resp) { if (specs[0].c(resp[0] || '').v === 'correct') { var r2 = specs[tpI].c(resp[tpI] || ''); if (r2.v === 'wrong') return r2; } return null; } : null, sol.join('<br>'));
  }
  /* f from the vertical asymptotes and the turning point of y = 1/f(x) (L7 Ex 6a, #7, EP07 B2, EP08 C3) */
  function asyTurnSpec(r, o) {
    o = o || {};
    return pickWhere(function () { return { r1: r.int(-6, 3), m: r.pick(o.ms || [1, 2, 2, 3]), a: toR(r.pick(o.as || [1, 2, [1, 2], [1, 3], [1, 4], -1, -2, [-1, 2], [-1, 3]])) }; }, function (z) {
      var s1 = z.r1 + 2 * z.m, q = -rv(z.a) * z.m * z.m; z.s1 = s1; z.p = z.r1 + z.m; z.q = q; z.T = mkV(z.a, z.p, q);
      var c = z.T.cv; z.c = c;
      return s1 <= 6 && z.r1 !== 0 && s1 !== 0 && toR(1 / q) && toR(1 / q)[1] <= 20 && Math.abs(q) !== 1 && fresh(z.T) && (!o.sign || o.sign * rv(z.a) > 0) && !(z.r1 === -3 && s1 === 1) && !(z.r1 === -4 && s1 === 2) && !(z.r1 === 1 && s1 === 7) && !(z.r1 === 0 && s1 === 4);
    });
  }
  function asyTurnStem(z) { return 'The graph of ' + t('y=g(x)') + ', where ' + t('g(x)=\\dfrac{1}{f(x)}') + ' and ' + t('f') + ' is a quadratic function, has the vertical asymptotes ' + t('x=' + z.r1) + ' and ' + t('x=' + z.s1) + ' and a ' + (z.q < 0 ? 'maximum' : 'minimum') + ' point ' + t('\\left(' + z.p + ',\\ ' + rt(toR(1 / z.q)) + '\\right)') + '.'; }
  function asyTurnGraph(z) { var xr = win([z.r1, z.s1], 2.2); return G({ x: xr, y: [-4, 4], fns: recFns(z.T.f, [z.r1, z.s1], xr), vline: [z.r1, z.s1], points: [{ x: z.p, y: 1 / z.q, label: '(' + z.p + ', ' + fp(1 / z.q) + ')' }], max: 280, aria: 'the graph of y = g(x): three branches beside two vertical asymptotes, with a turning point marked on the middle branch' }); }
  function asyTurnSol(z) {
    var T = z.T;
    return 'The asymptotes give the zeros ' + t(z.r1) + ' and ' + t(z.s1) + ' of ' + t('f') + '. The ' + (z.q < 0 ? 'maximum' : 'minimum') + ' point ' + t('\\left(' + z.p + ',\\ ' + rt(toR(1 / z.q)) + '\\right)') + ' gives the vertex ' + t('\\left(' + z.p + ',\\ \\frac{1}{' + rt(toR(1 / z.q)) + '}\\right)=' + pt(z.p, toR(z.q))) + ', a ' + (z.q < 0 ? 'minimum' : 'maximum') + ' of ' + t('f') + '.<br>' +
      t('f(x)=a(x' + sgT(-z.p) + ')^{2}' + sgT(toR(z.q))) + '; ' + t('f(' + z.s1 + ')=0') + ': ' + t(z.m * z.m + 'a' + sgT(toR(z.q)) + '=0') + ', ' + t('a=' + rt(z.a)) + '.<br>' + t('f(x)=' + T.vtex + '=' + T.tex);
  }
  /* f from the turning point and the y-intercept of y = 1/f(x) (L7 Ex 6b, #8, #18, L8 #11) */
  function turnYSpec(r, o) {
    o = o || {};
    return pickWhere(function () { return { a: toR(r.pick(o.as || [1, 2, 3, [1, 2], -1, -2, [-1, 2]])), p: nz(r, 1, 4), q: r.pick(o.qs || [2, 3, 4, 5, 6, 8, 10, -2, -3, -4, -5]) }; }, function (z) {
      z.T = mkV(z.a, z.p, z.q); var c = z.T.cv; z.c = c;
      return Number.isInteger(c) && c !== 0 && Math.abs(c) <= 40 && Math.abs(c) !== 1 && rv(z.a) * z.q > 0 && fresh(z.T) && (!o.test || o.test(z));
    });
  }
  function turnYSol(z, kT, cT) {
    var T = z.T, typ = rv(z.a) > 0 ? 'maximum' : 'minimum';
    return 'A ' + typ + ' of the reciprocal comes from a ' + (rv(z.a) > 0 ? 'minimum' : 'maximum') + ' of ' + t('f') + ': vertex ' + t('\\left(' + z.p + ',\\ \\frac{1}{' + kT + '}\\right)=' + pt(z.p, z.q)) + '. The ' + t('y') + '-intercept gives ' + t('f(0)=\\frac{1}{' + cT + '}=' + z.c) + '.<br>' +
      t('f(x)=a(x' + sgT(-z.p) + ')^{2}' + sgT(z.q)) + ': ' + t(z.c + '=' + z.p * z.p + 'a' + sgT(z.q)) + ', ' + t('a=' + rt(z.a)) + '.<br>' + t('f(x)=' + T.vtex + '=' + T.tex);
  }
  /* one parabola with two zeros for the full analysis (L7 #5, EP07 B1, L8 #10): f = (x − r)(x − s), s − r = 2m */
  function fullSpec(r, o) {
    o = o || {};
    return pickWhere(function () { return { r1: r.int(-8, 5), m: r.pick(o.ms || [2, 3]), a: o.a || 1 }; }, function (z) { var s1 = z.r1 + 2 * z.m; z.s1 = s1; z.Q = mkQ(z.a, -z.a * (z.r1 + s1), z.a * z.r1 * s1); return s1 <= 9 && z.r1 * s1 !== 0 && fresh(z.Q) && Math.abs(z.Q.cv) <= 40; });
  }
  function fullWhy(z) { var Q = z.Q; return t('f(x)=' + Q.tex + '=' + (Q.av < 0 ? '-' : '') + '(x' + sgT(-z.r1) + ')(x' + sgT(-z.s1) + ')') + '. '; }

  HW.u7k78 = {
    gcd: gcd, pickWhere: pickWhere, nz: nz, toR: toR, rv: rv, rt: rt, dt: dt, rneg: rneg, sgT: sgT, coefT: coefT, has: has, uniqNums: uniqNums, sameSet: sameSet, isSq: isSq, A: A, M: M, lin: lin, quad: quad, tx: tx, linT: linT, vtxT: vtxT,
    pt: pt, ptsT: ptsT, rootsT: rootsT, valOf: valOf, cap: cap, fp: fp, qroots: qroots, zerosOf: zerosOf, sqrtT: sqrtT, G: G, mini: mini, crv: crv, recFns: recFns, win: win,
    plainLow: plainLow, isNone: isNone, splitTop: splitTop, prep: prep, numVal: numVal, readVals: readVals, closeTo: closeTo, matchVals: matchVals, rootsPart: rootsPart, expandPm: expandPm, ptsCheck: ptsCheck, ptsPart: ptsPart, ptsBad: ptsBad,
    readAsy: readAsy, asyCheck: asyCheck, asyT: asyT, asyPart: asyPart, valChk: valChk, valPart: valPart, pointChk: pointChk, pointPart: pointPart, fieldsPart: fieldsPart, polyIs: polyIs, withBad: withBad, mc: mc,
    mkQ: mkQ, mkV: mkV, pmTex: pmTex, zerosList: zerosList, S: S, domTex: domTex, domRead: domRead, domChk: domChk, rangeInfo: rangeInfo, typeChk: typeChk, vformChk: vformChk,
    combo: combo, sAsy: sAsy, sCount: sCount, sTP: sTP, sType: sType, sDom: sDom, sRng: sRng, sYint: sYint, invData: invData, sInv: sInv, invPart: invPart, tpPart: tpPart, fGraph: fGraph, recGraph: recGraph,
    sVform: sVform, sGform: sGform, backWrongs: backWrongs, AVOID: AVOID, fresh: fresh, vaPart: vaPart, tpdrPart: tpdrPart, asyTurnSpec: asyTurnSpec, asyTurnStem: asyTurnStem, asyTurnGraph: asyTurnGraph, asyTurnSol: asyTurnSol,
    turnYSpec: turnYSpec, turnYSol: turnYSol, fullSpec: fullSpec, fullWhy: fullWhy, HINT_TP: HINT_TP, HINT_DR: HINT_DR, HINT_ASY: HINT_ASY, HINT_BACK: HINT_BACK
  };

  /* a keypad for the table of reciprocals (numbers, fractions and "undefined") */
  var W = HW.widgets;
  if (W && W.KEYSETS && !W.KEYSETS.u7tab) {
    var dk = function (n) { return { label: String(n), tex: String(n), plain: String(n) }; };
    W.KEYSETS.u7tab = function () { return [[dk(7), dk(8), dk(9), { label: '<sup>a</sup>⁄<sub>b</sub>', tex: '\\frac{#@}{#?}', plain: '/', title: 'Fraction' }, { label: '⌫', fn: 'del', title: 'Delete' }], [dk(4), dk(5), dk(6), { label: '−', tex: '-', plain: '-' }, { label: 'clear', fn: 'clear' }], [dk(1), dk(2), dk(3), { label: '.', tex: '.', plain: '.' }, { label: '◀', fn: 'left', title: 'Move left' }, { label: '▶', fn: 'right', title: 'Move right (out of a box)' }], [dk(0), { label: 'undefined', tex: '\\text{undefined}', plain: 'undefined', wide: true }, { label: 'Check ↵', fn: 'enter', wide: true }]]; };
    if (W.KEYHELP) W.KEYHELP.u7tab = ['Type the reciprocal as a fraction (e.g. ' + HW.k('\\frac{1}{8}') + '), or press <b>undefined</b> where ' + HW.k('f(x)=0') + '.', 'Type e.g. <code>1/8</code>, <code>-1</code> or <code>undefined</code>.'];
  }

  /* ======================================================================================================
   * Lesson 7 parts
   * ====================================================================================================== */
  var REC = t('y=\\dfrac{1}{f(x)}');
  function isUndef(resp) { var l = plainLow(resp).replace(/[^a-z∅]/g, ''); return /^(undef|und|dne|none|error|na|ud|∅)/.test(l); }
  function tabChk(cp, fv) {
    if (fv === 0) return function (resp) {
      if (isUndef(resp)) return ok(); if (!String(resp == null ? '' : resp).trim()) return form('empty', 'Fill in this box.');
      return numVal(resp) === 0 ? wrong(cp + 'tab-zero', 'Here ' + t('f(x)=0') + ', and ' + t('\\frac{1}{0}') + ' is undefined: press <b>undefined</b>.') : wrong('value', 'Here ' + t('f(x)=0') + ', so the reciprocal is undefined (a vertical asymptote).');
    };
    var base = K.value(toR(1 / fv), { diag: function (v) { if (Math.abs(v - fv) < 1e-9) return { code: cp + 'tab-f', hint: 'That is ' + t('f(x)') + '. The table asks for its reciprocal, ' + t('\\frac{1}{' + fv + '}') + '.' }; if (Math.abs(v + 1 / fv) < 1e-9) return { code: cp + 'tab-sign', hint: 'A reciprocal keeps the sign of the number.' }; return null; } });
    return function (resp) { if (isUndef(resp)) return wrong(cp + 'tab-undef', 'Here ' + t('f(x)=' + fv) + ', not 0, so the reciprocal is defined: ' + t('\\frac{1}{' + fv + '}') + '.'); return base(resp); };
  }
  function tabPart(cp, s) {
    var Q = s.Q, fields = [], checks = [], keys = [];
    s.xs.forEach(function (x) { var fv = Q.f(x); fields.push({ label: t('x=' + x), name: 'x = ' + x, mode: 'math', keys: 'u7tab', placeholder: '1/f(x)' }); checks.push(tabChk(cp, fv)); keys.push(fv === 0 ? '\\text{undefined}' : rt(toR(1 / fv))); });
    var table = HW.valueTable([[t('x')].concat(s.xs), [t('f(x)')].concat(s.xs.map(function (x) { return Q.f(x); }))]);
    var bad = [];
    s.xs.forEach(function (x, i) { var fv = Q.f(x), row = keys.slice(); if (fv === 0) { row[i] = '0'; bad.push(row); } else if (Math.abs(fv) !== 1) { row[i] = String(fv); bad.push(row); } });
    var zs = s.xs.filter(function (x) { return Q.f(x) === 0; });
    return fieldsPart('Complete the table: give ' + t('\\dfrac{1}{f(x)}') + ' for each value of ' + t('x') + ' (exact values; press <b>undefined</b> where it does not exist).' + table, fields, checks, keys,
      s.xs.map(function (x, i) { return t('x=' + x) + ': ' + t(keys[i]); }).join(', '),
      'Take the reciprocal of each value of ' + t('f(x)') + ': ' + s.xs.filter(function (x) { return Q.f(x) !== 0; }).map(function (x) { var fv = Q.f(x); return t('x=' + x) + ': ' + t('\\frac{1}{' + fv + '}' + (fv < 0 ? '=' + rt(toR(1 / fv)) : '')); }).join(', ') + '.<br>At ' + zs.map(function (x) { return t('x=' + x); }).join(' and ') + ', ' + t('f(x)=0') + ' and ' + t('\\frac{1}{0}') + ' is undefined: the reciprocal has vertical asymptotes there.',
      ['The reciprocal of ' + t('f(x)') + ' is ' + t('\\frac{1}{f(x)}') + '; it has the same sign.', 'Where ' + t('f(x)=0') + ' the reciprocal is undefined.'], 'table of values of y = 1/f(x)', bad);
  }
  function q1Shared(r) {
    var s = pickWhere(function () { return { p: r.int(-5, 6), q: r.pick([-1, -4]) }; }, function (z) { z.Q = mkV(1, z.p, z.q); return z.p !== 0 && fresh(z.Q) && !(z.p === 3 && z.q === -1); });
    s.xs = [-3, -2, -1, 0, 1, 2, 3].map(function (d) { return s.p + d; });
    return s;
  }
  /* the graph of f and of its reciprocal: MC (L7 #4b) */
  function sqMC(r, cp) {
    var z = pickWhere(function () { return { a: r.pick([1, 2, -1, -2, [1, 2], [-1, 2]]), p: nz(r, 1, 3) }; }, function (s) { s.Q = mkV(toR(s.a), s.p, 0); return fresh(s.Q) && !(s.p === -1 && rv(s.a) === 0.5) && !(s.p === -2 && rv(s.a) === -1); });
    var Q = z.Q, av = rv(z.a), p = z.p, xr = win([p, -p], 2), f = Q.f;
    var gs = {
      ok: mini({ x: xr, y: [-5, 5], fns: recFns(f, [p], xr), vline: [p], aria: 'two branches on the same side of the x-axis beside one vertical asymptote' }),
      neg: mini({ x: xr, y: [-5, 5], fns: recFns(function (x) { return -f(x); }, [p], xr), vline: [p], aria: 'two branches on the same side of the x-axis beside one vertical asymptote' }),
      odd: mini({ x: xr, y: [-5, 5], fns: recFns(function (x) { return av * (x - p); }, [p], xr), vline: [p], aria: 'two branches on opposite sides of the x-axis beside one vertical asymptote' }),
      mirror: mini({ x: xr, y: [-5, 5], fns: recFns(function (x) { return f(-x); }, [-p], xr), vline: [-p], aria: 'two branches on the same side of the x-axis beside one vertical asymptote' })
    };
    var side = av > 0 ? 'above' : 'below';
    var whys = { neg: 'The reciprocal has the same sign as ' + t('f(x)') + ': ' + t('f') + ' is ' + side + ' the ' + t('x') + '-axis, so both branches are ' + side + ' it too.', odd: t('f') + ' does not change sign at its zero (the parabola only touches the axis), so the two branches are on the <b>same</b> side of the ' + t('x') + '-axis.', mirror: 'The vertical asymptote is at the zero of ' + t('f') + ', ' + t('x=' + p) + '.' };
    var opts = ['ok', 'neg', 'odd', 'mirror'].map(function (k) { return { html: gs[k], right: k === 'ok', why: whys[k], code: 'u7l7-' + k }; });
    var pr = mc(r, 'The graph of ' + t('y=f(x)') + ', where ' + t('f(x)=' + Q.vtex) + ', is shown. Which graph is ' + REC + '?' + fGraph(Q, [p, -p], { x: xr, y: [-5, 5] }), opts,
      'The vertex ' + t(pt(p, 0)) + ' is the only zero of ' + t('f') + ': one vertical asymptote ' + t('x=' + p) + ', and no turning point. ' + t('f') + ' is ' + side + ' the ' + t('x') + '-axis everywhere else, so both branches are ' + side + ' it, heading to ' + (av > 0 ? t('+\\infty') : t('-\\infty')) + ' beside the asymptote and toward ' + t('y=0') + ' far from it. They pass through the invariant points where ' + t('f(x)=' + (av > 0 ? '1' : '-1')) + '.',
      ['The reciprocal has the same sign as ' + t('f(x)') + '.', 'A zero of ' + t('f') + ' gives a vertical asymptote.'], 'graph of y = 1/f(x) when f has one zero');
    pr.input.columns = 2;
    return pr;
  }
  /* MC graph: f = (x − p)² + 1 (EP07 A5b) */
  function oneMC(r, cp) {
    var p = pickWhere(function () { return nz(r, 1, 3); }, function (x) { return x !== 1; }), Q = mkV(1, p, 1), xr = win([p], 2.5);
    var gs = {
      ok: mini({ x: xr, y: [-3, 3], fns: [crv(function (x) { return 1 / Q.f(x); })], aria: 'one unbroken curve above the x-axis with a maximum point' }),
      asy: mini({ x: xr, y: [-3, 3], fns: recFns(function (x) { return (x - p) * (x - p); }, [p], xr), vline: [p], aria: 'two branches above the x-axis beside a vertical asymptote' }),
      neg: mini({ x: xr, y: [-3, 3], fns: [crv(function (x) { return -1 / Q.f(x); })], aria: 'one unbroken curve below the x-axis with a minimum point' }),
      half: mini({ x: xr, y: [-3, 3], fns: [crv(function (x) { return 1 / (Q.f(x) + 1); })], aria: 'one unbroken curve above the x-axis with a lower maximum point' })
    };
    var whys = { asy: t('f') + ' has no zeros (its vertex ' + t(pt(p, 1)) + ' is above the axis), so there is no vertical asymptote.', neg: 'The reciprocal has the same sign as ' + t('f(x)') + ', which is always positive.', half: 'The turning point is ' + t('\\left(' + p + ',\\ \\frac{1}{1}\\right)=' + pt(p, 1)) + ': the vertex is an invariant point, so the maximum is at height 1.' };
    var opts = ['ok', 'asy', 'neg', 'half'].map(function (k) { return { html: gs[k], right: k === 'ok', why: whys[k], code: 'u7l7-' + k }; });
    var pr = mc(r, 'The graph of ' + t('y=f(x)') + ', where ' + t('f(x)=' + Q.tex) + ', is shown. Which graph is ' + REC + '?' + fGraph(Q, [p], { x: xr, y: [-2, 6] }), opts,
      t('f(x)=' + Q.vtex + '\\ge 1') + ': no zeros, so no vertical asymptote, and the reciprocal is positive. The vertex ' + t(pt(p, 1)) + ' becomes the maximum point ' + t(pt(p, 1)) + ' (an invariant point, the only one), and the curve approaches ' + t('y=0') + ' on both sides. ' + t('y') + '-intercept ' + t('\\frac{1}{' + Q.cv + '}') + '.',
      ['No zeros: one unbroken curve.', 'The vertex ' + t('(p,\\ q)') + ' gives the turning point ' + t('\\left(p,\\ \\frac{1}{q}\\right)') + '.'], 'graph of y = 1/f(x) when f has no zeros');
    pr.input.columns = 2;
    return pr;
  }
  /* the y-intercept of y = 1/f(x) as one part */
  function yintPart(cp, Q, prompt) { var s = sYint(cp, Q), p = KP.math(prompt, s.c, s.k, s.s, ['The ' + t('y') + '-intercept of ' + t('y=\\frac{1}{f(x)}') + ' is the reciprocal of ' + t('f(0)') + '.'], 'y-intercept of y = 1/f(x)', { keys: 'fraction' }); p.bad = s.bad; return p; }
  function asyOnly(cp, Q, prompt, why) { var s = sAsy(cp, Q, true, { why: why }), p = KP.math(prompt, s.c, s.k, s.s, HINT_ASY, 'asymptotes of y = 1/f(x)', { keys: 'u7asy', placeholder: 'e.g. x = 3, y = 0' }); p.bad = s.bad; return p; }
  /* vertex form + general form from the turning point and y-intercept (L7 #8) */
  function turnYPart(r, cp, o) {
    o = o || {};
    var z = turnYSpec(r, o), typ = rv(z.a) > 0 ? 'maximum' : 'minimum', kT = rt(toR(1 / z.q)), cT = rt(toR(1 / z.c));
    var wr = backWrongs(cp, z.T, toR(1 / z.q), 'the ' + t('y') + '-intercept, ' + t('f(0)=' + z.c), [0, z.c]);
    var prompt = 'The graph of ' + REC + ', where ' + t('f') + ' is a quadratic function, has a ' + typ + ' point ' + t('\\left(' + z.p + ',\\ ' + kT + '\\right)') + ' and a ' + t('y') + '-intercept of ' + t(cT) + '. Determine ' + t('f(x)') + ' in vertex form and in general form.';
    return combo(prompt, [sVform(cp, z.T, wr), sGform(cp, z.T, wr)], HINT_BACK, 'a quadratic f from its reciprocal', null, turnYSol(z, kT, cT));
  }
  /* intervals where f and its reciprocal increase / decrease (L7 #11) */
  function setAnd(tgt, opt) { var c = K.set(tgt, opt); return function (resp) { return c(String(resp == null ? '' : resp).replace(/\\text\{\s*and\s*\}|\band\b/gi, '\\text{ or }')); }; }
  function q11Shared(r) {
    return pickWhere(function () { return { m: r.pick([1, 2, 3]), p: nz(r, 1, 4), up: r.chance(0.6) }; }, function (z) { z.Q = mkV(z.up ? 1 : -1, z.p, z.up ? -z.m * z.m : z.m * z.m); z.r1 = z.p - z.m; z.s1 = z.p + z.m; return fresh(z.Q) && z.r1 !== 0 && z.s1 !== 0; });
  }
  function ivSet(c) { return S('x', c); }
  function q11a(r, s) {
    var p = s.p, dec = s.up ? ivSet('x<' + p) : ivSet('x>' + p), inc = s.up ? ivSet('x>' + p) : ivSet('x<' + p);
    var f1 = { f: { label: t('f') + ' is decreasing for', name: 'decreasing', mode: 'math', keys: 'set', vars: ['x'] }, c: setAnd(dec, { v: 'x', tag: false, wrong: [{ is: inc, code: CP + 'int-swap', hint: 'Check the direction: the parabola opens ' + (s.up ? 'up, so it falls to the left of its vertex' : 'down, so it falls to the right of its vertex') + '.' }] }), k: dec, a: 'decreasing ' + t(dec), bad: [inc] };
    var f2 = { f: { label: t('f') + ' is increasing for', name: 'increasing', mode: 'math', keys: 'set', vars: ['x'] }, c: setAnd(inc, { v: 'x', tag: false, wrong: [{ is: dec, code: CP + 'int-swap', hint: 'Check the direction: the parabola opens ' + (s.up ? 'up, so it rises to the right of its vertex' : 'down, so it rises to the left of its vertex') + '.' }] }), k: inc, a: 'increasing ' + t(inc), bad: [dec] };
    return combo('State the intervals on which ' + t('f') + ' is decreasing and on which it is increasing.', [f1, f2], ['The parabola changes direction at its vertex ' + t('x=' + p) + '.'], 'intervals of increase of a parabola', null,
      t('f(x)=' + s.Q.vtex) + ' opens ' + (s.up ? 'up' : 'down') + ' with vertex ' + t(pt(p, s.Q.q)) + ': decreasing for ' + t(s.up ? 'x<' + p : 'x>' + p) + ', increasing for ' + t(s.up ? 'x>' + p : 'x<' + p) + '.');
  }
  function q11b(r, s) {
    var p = s.p, r1 = s.r1, s1 = s.s1, left = ivSet('x<' + r1 + '\\text{ or }' + r1 + '<x<' + p), right = ivSet(p + '<x<' + s1 + '\\text{ or }x>' + s1);
    var inc = s.up ? left : right, dec = s.up ? right : left, mergedL = ivSet('x<' + p), mergedR = ivSet('x>' + p);
    var incM = s.up ? mergedL : mergedR, decM = s.up ? mergedR : mergedL;
    var w = function (other, merged, fiv) { return [{ is: merged, code: CP + 'int-asy', hint: 'The reciprocal is undefined at ' + t('x=' + (s.up ? (merged === mergedL ? r1 : s1) : (merged === mergedL ? r1 : s1))) + ' (a vertical asymptote): leave it out, so the interval splits in two.' }, { is: other, code: CP + 'int-swap', hint: 'Where ' + t('f') + ' increases, its reciprocal decreases, and the other way around.' }, { is: fiv, code: CP + 'int-f', hint: 'Those are the intervals for ' + t('f') + '. The reciprocal does the opposite: where ' + t('f') + ' increases, ' + t('\\frac{1}{f}') + ' decreases.' }]; };
    var wi = w(dec, incM, s.up ? mergedR : mergedL).filter(function (x) { return x.is !== inc; }), wd = w(inc, decM, s.up ? mergedL : mergedR).filter(function (x) { return x.is !== dec; });
    var f1 = { f: { label: REC + ' is increasing for', name: 'increasing', mode: 'math', keys: 'set', vars: ['x'] }, c: setAnd(inc, { v: 'x', tag: false, wrong: wi }), k: inc, a: 'increasing ' + t(inc), bad: wi.map(function (x) { return x.is; }) };
    var f2 = { f: { label: REC + ' is decreasing for', name: 'decreasing', mode: 'math', keys: 'set', vars: ['x'] }, c: setAnd(dec, { v: 'x', tag: false, wrong: wd }), k: dec, a: 'decreasing ' + t(dec), bad: wd.map(function (x) { return x.is; }) };
    return combo('State the intervals on which ' + REC + ' is increasing and on which it is decreasing. (Remember the asymptotes.)', [f1, f2], ['Where ' + t('f') + ' increases, ' + t('\\frac{1}{f}') + ' decreases, and where ' + t('f') + ' decreases, ' + t('\\frac{1}{f}') + ' increases.', 'The zeros of ' + t('f') + ' are vertical asymptotes: the reciprocal is not defined there, so an interval cannot run across one.'], 'intervals of increase of y = 1/f(x)', null,
      'Zeros of ' + t('f') + ': ' + t('(x' + sgT(-p) + ')^{2}=' + s.m * s.m) + ', ' + t('x=' + r1) + ' or ' + t('x=' + s1) + ' (vertical asymptotes).<br>' + t('f') + ' ' + (s.up ? 'decreases' : 'increases') + ' for ' + t('x<' + p) + ' and ' + (s.up ? 'increases' : 'decreases') + ' for ' + t('x>' + p) + ', so the reciprocal ' + (s.up ? 'increases' : 'decreases') + ' for ' + t('x<' + r1) + ' and ' + t(r1 + '<x<' + p) + ', and ' + (s.up ? 'decreases' : 'increases') + ' for ' + t(p + '<x<' + s1) + ' and ' + t('x>' + s1) + '.');
  }
  /* Q13: three statements; which are true? */
  function stmtMC(r, cp) {
    var z = pickWhere(function () { return { p: nz(r, 1, 5), q: -r.int(2, 9) }; }, function (s) { return fresh(mkV(1, s.p, s.q)) && !(s.p === 2 && s.q === -5); });
    var combos = [[1, 1, 0], [1, 0, 1], [0, 1, 1], [1, 1, 1]], pickC = r.int(0, 3), tr = combos[pickC], qT = rt(toR(1 / z.q)), ft = vtxT(1, z.p, z.q);
    var S1 = tr[0] ? 'If ' + t('f') + ' has exactly one ' + t('x') + '-intercept, the reciprocal graph has exactly one vertical asymptote.' : r.pick(['If ' + t('f') + ' has exactly one ' + t('x') + '-intercept, the reciprocal graph has two vertical asymptotes.', 'If ' + t('f') + ' has no ' + t('x') + '-intercepts, the reciprocal graph has no horizontal asymptote.']);
    var S2 = tr[1] ? 'If ' + t('f(x)=' + ft) + ', the reciprocal graph has a maximum point at ' + t('\\left(' + z.p + ',\\ ' + qT + '\\right)') + '.' : r.chance(0.5) ? 'If ' + t('f(x)=' + ft) + ', the reciprocal graph has a minimum point at ' + t('\\left(' + z.p + ',\\ ' + qT + '\\right)') + '.' : 'If ' + t('f(x)=' + ft) + ', the reciprocal graph has a maximum point at ' + t(pt(z.p, z.q)) + '.';
    var S3 = tr[2] ? 'The reciprocal graph never meets the ' + t('x') + '-axis.' : 'The reciprocal graph meets the ' + t('x') + '-axis wherever ' + t('f') + ' has a zero.';
    var labels = ['1 and 2 only', '1 and 3 only', '2 and 3 only', '1, 2 and 3'];
    var why = ['Statement 1 ' + (tr[0] ? 'is true: one zero gives one vertical asymptote.' : 'is false: one zero gives exactly one vertical asymptote, and every reciprocal graph has the horizontal asymptote ' + t('y=0') + '.'),
      'Statement 2 ' + (tr[1] ? 'is true: ' + t('a>0') + ', so the minimum of ' + t('f') + ' becomes the maximum point ' + t('\\left(' + z.p + ',\\ ' + qT + '\\right)') + '.' : 'is false: ' + t('a>0') + ', so the vertex ' + t(pt(z.p, z.q)) + ' (a minimum of ' + t('f') + ') becomes the <b>maximum</b> point ' + t('\\left(' + z.p + ',\\ ' + qT + '\\right)') + '.'),
      'Statement 3 ' + (tr[2] ? 'is true: ' + t('\\frac{1}{f(x)}\\ne 0') + ' (the ' + t('x') + '-axis is the horizontal asymptote).' : 'is false: ' + t('\\frac{1}{f(x)}') + ' is never 0; at a zero of ' + t('f') + ' it has a vertical asymptote.')];
    var opts = labels.map(function (l, i) { return { html: l, right: i === pickC, why: 'Test each statement on its own. ' + why.filter(function (w, j) { return combos[i][j] !== tr[j]; })[0], code: 'u7l7-st' + i }; });
    return mc(r, 'A student makes these statements about ' + REC + ', where ' + t('f') + ' is a quadratic function.<br>Statement 1: ' + S1 + '<br>Statement 2: ' + S2 + '<br>Statement 3: ' + S3 + '<br>The true statements are', opts, why.join('<br>'),
      ['Test each statement on its own.', 'Zeros give vertical asymptotes; the vertex ' + t('(p,\\ q)') + ' gives ' + t('\\left(p,\\ \\frac{1}{q}\\right)') + ' with the type switched; the reciprocal is never 0.'], 'true statements about y = 1/f(x)', true);
  }
  /* Q14: which f fits the asymptotes and the y-intercept? */
  function couldMC(r, cp) {
    var z = pickWhere(function () { return { r1: nz(r, 1, 5), s1: nz(r, 1, 6), k: r.pick([1, 1, -1, 2, -2]) }; }, function (s) { return s.r1 < s.s1 && s.r1 !== -s.s1 && Math.abs(s.k * s.r1 * s.s1) <= 30 && !(s.r1 === -2 && s.s1 === 3 && s.k === 1); });
    var base = P.mul(lin(1, -z.r1), lin(1, -z.s1)), F = function (k, P0) { return P.scale(P0, k); }, c = z.k * z.r1 * z.s1;
    var right = F(z.k, base), swapZ = F(z.k, P.mul(lin(1, z.r1), lin(1, z.s1))), negF = F(-z.k, base), dbl = F(2 * z.k, base);
    var opts = [{ html: t(tx(right)), right: true }, { html: t(tx(swapZ)), why: 'Its zeros are ' + t(-z.r1) + ' and ' + t(-z.s1) + ': the asymptotes would be ' + t('x=' + -z.r1) + ' and ' + t('x=' + -z.s1) + '.', code: 'u7l7-zsign' },
      { html: t(tx(negF)), why: 'Its zeros fit, but ' + t('f(0)=' + -c) + ', so the reciprocal’s ' + t('y') + '-intercept would be ' + t(rt(toR(-1 / c))) + '.', code: 'u7l7-ysign' }, { html: t(tx(dbl)), why: 'Its zeros fit, but ' + t('f(0)=' + 2 * c) + ', so the reciprocal’s ' + t('y') + '-intercept would be ' + t(rt(toR(1 / (2 * c)))) + '.', code: 'u7l7-ydbl' }];
    return mc(r, 'The graph of ' + REC + ' has the vertical asymptotes ' + t('x=' + z.r1) + ' and ' + t('x=' + z.s1) + ' and a ' + t('y') + '-intercept of ' + t(rt(toR(1 / c))) + '. The function ' + t('f(x)') + ' could be', opts,
      t(tx(right) + '=' + (z.k === 1 ? '' : z.k === -1 ? '-' : z.k) + '(x' + sgT(-z.r1) + ')(x' + sgT(-z.s1) + ')') + ' has the zeros ' + t(z.r1) + ' and ' + t(z.s1) + ', and ' + t('f(0)=' + c) + ' gives the ' + t('y') + '-intercept ' + t(rt(toR(1 / c))) + '.',
      ['The asymptotes are the zeros of ' + t('f') + '.', 'Check ' + t('f(0)') + ' for each choice: the reciprocal’s ' + t('y') + '-intercept is ' + t('\\frac{1}{f(0)}') + '.'], 'f from the asymptotes and y-intercept of its reciprocal');
  }
  /* Q15 / L8 #19: the range of y = 1/f(x) from the range of f */
  function rangeMC(r, cp, o) {
    o = o || {};
    var z = pickWhere(function () { return { up: r.chance(0.5), q: r.pick(o.qs || [2, 3, 4, 5, 8, 10, -2, -4, -5, -3]) }; }, function (s) { return !(s.up === false && s.q === 4) && !(s.up && s.q === 2 && !o.allow2); });
    var av = z.up ? 1 : -1, R = rangeInfo(cp, av, z.q), iq = rt(toR(1 / z.q));
    var cand = z.q > 0 ? [S('y', 'y<0\\text{ or }y\\ge ' + iq), S('y', '0<y\\le ' + iq), S('y', 'y\\le ' + iq + ',\\ y\\ne 0'), S('y', 'y\\ge ' + iq)] : [S('y', 'y\\le ' + iq + '\\text{ or }y>0'), S('y', iq + '\\le y<0'), S('y', 'y\\ge ' + iq + ',\\ y\\ne 0'), S('y', 'y\\le ' + iq)];
    if (cand.indexOf(R.target) < 0) cand[3] = R.target;
    var opts = cand.map(function (c) { return { html: t(c), right: c === R.target, why: c === R.target ? null : 'Take the reciprocal of each part of the range of ' + t('f') + ': ' + R.why + '.', code: 'u7l7-r' + cand.indexOf(c) }; });
    return mc(r, 'The range of the quadratic function ' + t('y=f(x)') + ' is ' + t(R.fR) + '. The range of ' + REC + ' is', opts, R.why + ': ' + t(R.target) + '.',
      ['Split the range of ' + t('f') + ' into its positive and negative parts and take reciprocals of each.', 'Small numbers near 0 have large reciprocals; large numbers have reciprocals near 0.'], 'range of y = 1/f(x) from the range of f');
  }
  /* Q16: how many invariant points? */
  function invCountMC(r, cp) {
    var z = pickWhere(function () { return { h: nz(r, 1, 4), k: r.pick([1, 1, 2, 3, -1, -2, 0, -4]) }; }, function (s) { s.Q = mkV(1, s.h, s.k); return fresh(s.Q); });
    var D = invData(cp, z.Q), n = D.pairs.length, choices = [0, 1, 2, 3, 4].filter(function (x) { return x !== n; });
    choices = r.shuffle(choices).slice(0, 3).concat([n]).sort(function (a, b) { return a - b; });
    var opts = choices.map(function (c) { return { html: t(c), right: c === n, why: 'Solve ' + t('f(x)=1') + ' and ' + t('f(x)=-1') + ' and count the real solutions: ' + t('f(x)=' + z.Q.vtex) + '.', code: 'u7l7-n' + c }; });
    return mc(r, 'The number of invariant points of the graphs of ' + t('f(x)=' + z.Q.tex) + ' and ' + REC + ' is', opts, t('f(x)=' + z.Q.vtex) + '.<br>' + D.sol + '<br>That is <b>' + n + '</b>.',
      ['Invariant points are where ' + t('f(x)=1') + ' or ' + t('f(x)=-1') + '.', 'Write ' + t('f') + ' in vertex form: its least value tells you which of those equations have solutions.'], 'number of invariant points', true);
  }

  function Pt(id, level, make) { return { id: id, level: level, make: make }; }
  var QUESTIONS = [
    { num: '1', shared: q1Shared, stem: function (s) { return 'Let ' + t('f(x)=' + s.Q.tex) + '. Its graph is shown, with the guide lines ' + t('y=\\pm 1') + '.' + fGraph(s.Q, s.xs, { x: win(s.xs, 0.5), y: [-5, 9] }); }, parts: [
      Pt('1a', 'BEG', function (r, s) { return tabPart(CP, s); }),
      Pt('1b', 'EMG', function (r, s) { var Q = s.Q; return combo('State the equations of the asymptotes and the coordinates of the turning point of ' + REC + ', and whether it is a maximum or a minimum.', [sAsy(CP, Q, true, { why: t('f(x)=(x' + sgT(-Q.zv[0]) + ')(x' + sgT(-Q.zv[1]) + ')') + ': ' }), sTP(CP, Q), sType(CP, Q)], HINT_ASY.concat(HINT_TP.slice(0, 1)), 'asymptotes and turning point of y = 1/f(x)', null, sAsy(CP, Q, true, { why: t('f(x)=(x' + sgT(-Q.zv[0]) + ')(x' + sgT(-Q.zv[1]) + ')') + ': ' }).s + '<br>' + t('f(x)=' + Q.vtex) + '. ' + sTP(CP, Q).s); }),
      Pt('1c', 'PRG', function (r, s) { return invPart(CP, s.Q, 'State the exact coordinates of the invariant points of the graphs of ' + t('y=f(x)') + ' and ' + REC + '.'); })] },
    { num: '2', stem: 'State the number of vertical asymptotes of the graph of ' + REC + ' and their equations.', parts: [
      Pt('2a', 'BEG', function (r) { return vaPart(r, CP, 'two'); }), Pt('2b', 'EMG', function (r) { return vaPart(r, CP, 'sq'); }), Pt('2c', 'EMG', function (r) { return vaPart(r, CP, 'noneD'); }),
      Pt('2d', 'PRG', function (r) { return vaPart(r, CP, 'twoNeg'); }), Pt('2e', 'EMG', function (r) { return vaPart(r, CP, 'rad'); }), Pt('2f', 'BEG', function (r) { return vaPart(r, CP, 'noneV'); })] },
    { num: '3', stem: 'For each function, state the turning point of ' + REC + ', whether it is a maximum or a minimum, and the domain and range of ' + REC + '.', parts: [
      Pt('3a', 'PRG', function (r) { var z = pickWhere(function () { return { p: nz(r, 1, 5), q: r.int(2, 9) }; }, function (s) { s.Q = mkV(1, s.p, s.q); return fresh(s.Q) && !(s.p === 1 && s.q === 5) && !(s.p === 2 && s.q === 4); }); return tpdrPart(CP, z.Q, z.Q.vtex, ['tp', 'd', 'r'], 'turning point, domain and range of y = 1/f(x)'); }),
      Pt('3b', 'ADV', function (r) { var z = pickWhere(function () { return { p: nz(r, 1, 5), q: r.pick([2, 3, 5, 6, 7, 8]) }; }, function (s) { s.Q = mkV(-1, s.p, s.q); return fresh(s.Q) && !(s.p === -2 && s.q === 2) && !(s.p === -1 && s.q === 2); }); return tpdrPart(CP, z.Q, z.Q.vtex, ['tp', 'd', 'r'], 'turning point, domain and range of y = 1/f(x)'); }),
      Pt('3c', 'ADV', function (r) { var z = pickWhere(function () { var aq = r.pick([[2, -0.5], [8, -0.5], [2, -2], [0.5, -2], [4, -1], [0.5, -0.5], [3, -3], [0.5, -8], [2, -8]]); return { a: aq[0], q: aq[1], p: nz(r, 1, 5) }; }, function (s) { s.Q = mkV(s.a, s.p, s.q); return fresh(s.Q) && !(s.p === 4 && s.a === 2 && s.q === -0.5) && !(s.p === 3 && s.a === 2 && s.q === -8); }); return tpdrPart(CP, z.Q, z.Q.vtex, ['tp', 'd', 'r'], 'turning point, domain and range of y = 1/f(x)'); }),
      Pt('3d', 'PRG', function (r) { var z = pickWhere(function () { return { a: toR(r.pick([[-1, 2], -2, -1, -3, [-1, 4]])), p: r.chance(0.4) ? 0 : nz(r, 1, 5), q: r.pick([-2, -3, -4, -5, -6, -8]) }; }, function (s) { s.Q = mkV(s.a, s.p, s.q); return fresh(s.Q) && !(s.p === 0 && s.q === -4 && rv(s.a) === -0.5) && !(s.p === -4 && s.q === -3); }); return tpdrPart(CP, z.Q, z.Q.vtex, ['tp', 'd', 'r'], 'turning point, domain and range of y = 1/f(x)'); })] },
    { num: '4', stem: 'The graph of ' + t('y=f(x)') + ' is shown, with the guide lines ' + t('y=\\pm 1') + '.', parts: [
      Pt('4a', 'PRG', function (r) {
        var z = pickWhere(function () { return { r1: r.int(-6, 4), m: r.pick([1, 2]) }; }, function (s) { s.Q = mkQ(1, -(2 * s.r1 + 2 * s.m), s.r1 * (s.r1 + 2 * s.m)); return fresh(s.Q) && s.r1 + 2 * s.m <= 6; }), Q = z.Q;
        return combo('Let ' + t('f(x)=' + Q.tex) + '.' + fGraph(Q, [], { y: [-5, 5] }) + 'For the graph of ' + REC + ', state the equations of the asymptotes and the coordinates of the turning point, and whether it is a maximum or a minimum.', [sAsy(CP, Q, true), sTP(CP, Q), sType(CP, Q)], HINT_ASY.concat(HINT_TP.slice(0, 1)), 'asymptotes and turning point from the graph of f');
      }),
      Pt('4b', 'PRG', function (r) { return sqMC(r, CP); }),
      Pt('4c', 'PRG', function (r) {
        var z = pickWhere(function () { var up = r.chance(0.4); return { a: up ? r.pick([1, [1, 2], 2]) : r.pick([-1, -2, [-1, 2]]), p: nz(r, 1, 4), k: r.int(1, 3) }; }, function (s) { s.Q = mkV(toR(s.a), s.p, (rv(s.a) > 0 ? 1 : -1) * s.k); return fresh(s.Q) && !(s.p === 2 && s.k === 1 && rv(s.a) === -1) && !(s.p === 1 && rv(s.a) === 0.5 && s.k === 2) && Math.abs(s.Q.cv) <= 20; }), Q = z.Q;
        return combo('Let ' + t('f(x)=' + Q.vtex) + '.' + fGraph(Q, [Q.p], { y: Q.av > 0 ? [-2, 7] : [-7, 2] }) + 'For the graph of ' + REC + ', state the equations of the asymptotes, the turning point and whether it is a maximum or a minimum, and the ' + t('y') + '-intercept.', [sAsy(CP, Q, true, { why: (Q.av > 0 ? 'The parabola opens up from a vertex above' : 'The parabola opens down from a vertex below') + ' the ' + t('x') + '-axis. ' }), sTP(CP, Q), sType(CP, Q), sYint(CP, Q)], HINT_ASY.concat(HINT_TP.slice(0, 1)), 'features of y = 1/f(x) when f has no zeros');
      })] },
    { num: '5', shared: function (r) { return fullSpec(r, { ms: [2, 3] }); }, stem: function (z) { return 'Let ' + t('f(x)=' + z.Q.tex) + '. For ' + REC + ', determine:'; }, parts: [
      Pt('5a', 'BEG', function (r, z) { return asyOnly(CP, z.Q, 'the equations of the asymptotes', fullWhy(z)); }),
      Pt('5b', 'BEG', function (r, z) { return yintPart(CP, z.Q, 'the ' + t('y') + '-intercept'); }),
      Pt('5c', 'EMG', function (r, z) { return tpPart(CP, z.Q, 'the turning point and its type'); }),
      Pt('5d', 'PRG', function (r, z) { return invPart(CP, z.Q, 'the invariant points (exact values)'); }),
      Pt('5e', 'PRG', function (r, z) { return combo('the domain and range', [sDom(CP, z.Q), sRng(CP, z.Q)], HINT_DR, 'domain and range of y = 1/f(x)'); })] },
    { num: '6', shared: function (r) { return { n: r.pick([2, 4, 5, 6, 8, 10, 11, 15, 17]) }; }, stem: function (s) { return 'Let ' + t('f(x)=x^{2}-' + s.n) + '.'; }, parts: [
      Pt('6a', 'LIM', function (r, s) { var n = s.n; return mc(r, 'The equation of the reciprocal function is', [{ html: t('y=\\dfrac{1}{x^{2}-' + n + '}'), right: true }, { html: t('y=\\dfrac{1}{x^{2}}-' + n), why: 'The reciprocal of the <b>whole</b> function: ' + t('\\frac{1}{x^{2}-' + n + '}') + '.', code: 'u7l7-part' }, { html: t('y=-x^{2}+' + n), why: 'That is the opposite of ' + t('f') + ' (a reflection), not its reciprocal.', code: 'u7l7-opp' }, { html: t('y=\\sqrt{x+' + n + '}'), why: 'That undoes ' + t('f') + ' (its inverse). The reciprocal is ' + t('\\frac{1}{f(x)}') + '.', code: 'u7l7-inv' }], 'The reciprocal function is ' + t('y=\\frac{1}{f(x)}=\\frac{1}{x^{2}-' + n + '}') + '.', ['The reciprocal of a number ' + t('a') + ' is ' + t('\\frac{1}{a}') + '.'], 'equation of the reciprocal function'); }),
      Pt('6b', 'EMG', function (r, s) { var Q = mkQ(1, 0, -s.n); return asyOnly(CP, Q, 'Use a graphing calculator to sketch ' + t('y=f(x)') + ' and its reciprocal (' + t('Y_1=X^{2}-' + s.n) + ', ' + t('Y_2=1/Y_1') + '). State the equations of the asymptotes of the reciprocal graph (exact values).', t('x^{2}-' + s.n + '=0') + ', ' + t('x=\\pm ' + sqrtT(s.n)) + '. '); }),
      Pt('6c', 'PRG', function (r, s) { return invPart(CP, mkQ(1, 0, -s.n), 'Determine the exact coordinates of the four invariant points.'); })] },
    { num: '7', shared: function (r) { return asyTurnSpec(r); }, stem: function (z) { return asyTurnStem(z) + asyTurnGraph(z); }, parts: [
      Pt('7a', 'EMG', function (r, z) { var k = toR(1 / z.q); return pointPart(CP, 'A strategy for sketching ' + t('y=f(x)') + ': the asymptotes give the zeros of ' + t('f') + ', and the turning point gives its vertex. State the coordinates of the vertex of ' + t('f') + '.', [z.p, toR(z.q)], [{ p: [z.p, k], code: CP + 'rb-vertex', hint: 'That is the turning point of the reciprocal. The vertex of ' + t('f') + ' has the reciprocal ' + t('y') + '-value: ' + t('\\frac{1}{' + rt(k) + '}') + '.' }, { p: [z.p, toR(-z.q)], code: CP + 'rpt-neg', hint: 'A reciprocal keeps the sign.' }], 'The turning point ' + t('\\left(' + z.p + ',\\ ' + rt(k) + '\\right)') + ' of the reciprocal comes from the vertex ' + t('\\left(' + z.p + ',\\ \\frac{1}{' + rt(k) + '}\\right)=' + pt(z.p, toR(z.q))) + ' of ' + t('f') + ', a ' + (z.q < 0 ? 'minimum' : 'maximum') + '. Draw the parabola through it and the zeros ' + t(z.r1) + ' and ' + t(z.s1) + '.', ['A point ' + t('(x,\\ k)') + ' on the reciprocal matches ' + t('\\left(x,\\ \\frac{1}{k}\\right)') + ' on ' + t('f') + '.'], 'vertex of f from its reciprocal'); }),
      Pt('7b', 'ADV', function (r, z) { var wr = backWrongs(CP, z.T, toR(1 / z.q), 'a zero, ' + t('f(' + z.s1 + ')=0'), [z.s1, 0]); return combo('Write ' + t('f(x)') + ' in vertex form and in general form.', [sVform(CP, z.T, wr), sGform(CP, z.T, wr)], HINT_BACK, 'a quadratic f from its reciprocal', null, asyTurnSol(z)); }),
      Pt('7c', 'PRG', function (r, z) { var c = z.T.cv; return valPart(CP, 'State the ' + t('y') + '-intercept of ' + t('y=g(x)') + '.', toR(1 / c), [{ v: toR(c), code: CP + 'yint-same', hint: 'That is ' + t('f(0)') + '. The graph of ' + t('g') + ' has ' + t('g(0)=\\frac{1}{f(0)}') + '.' }, { v: toR(-1 / c), code: CP + 'rpt-neg', hint: 'A reciprocal keeps the sign.' }], t('f(0)=' + z.T.vtex.replace(/x/g, '(0)') + '=' + rt(toR(c))) + ', so ' + t('g(0)=\\frac{1}{f(0)}=' + rt(toR(1 / c))) + '.', ['Find ' + t('f(0)') + ' from your equation, then take its reciprocal.'], 'y-intercept of y = 1/f(x)'); })] },
    { num: '8', parts: [Pt('8', 'ADV', function (r) { return turnYPart(r, CP, { as: [1, 2, 3, [1, 2]], qs: [2, 3, 4, 5, 6, 8, 10] }); })] },
    { num: '9', parts: [
      Pt('9a', 'LIM', function (r) { var x = nz(r, 1, 9), y = pickWhere(function () { return nz(r, 2, 9); }, function () { return true; }); return pointPart(CP, 'The point ' + t(pt(x, y)) + ' is on ' + t('y=f(x)') + '. State the matching point on ' + REC + '.', [x, toR(1 / y)], [{ p: [x, y], code: CP + 'rpt-same', hint: 'The ' + t('y') + '-value becomes its reciprocal.' }, { p: [x, toR(-1 / y)], code: CP + 'rpt-neg', hint: 'A number and its reciprocal have the same sign.' }, { p: [toR(1 / x), y], code: CP + 'rpt-x', hint: 'The ' + t('x') + '-value stays; the ' + t('y') + '-value becomes its reciprocal.' }], t('\\left(' + x + ',\\ \\frac{1}{' + y + '}\\right)=' + pt(x, toR(1 / y))) + '.', ['A point ' + t('(x,\\ y)') + ' on ' + t('y=f(x)') + ' matches ' + t('\\left(x,\\ \\frac{1}{y}\\right)') + ' on the reciprocal.'], 'matching points'); }),
      Pt('9b', 'BEG', function (r) { var x = nz(r, 1, 9), d = r.pick([0.125, -0.125, 0.2, -0.2, 0.25, -0.25, 0.1, -0.1, 0.05, 0.04, -0.5]), y = 1 / d, p0 = pointPart(CP, 'The point ' + t('(' + x + ',\\ ' + dt(d) + ')') + ' is on ' + REC + '. State the matching point on ' + t('y=f(x)') + '.', [x, y], [{ p: [x, d], code: CP + 'rpt-same', hint: 'The ' + t('y') + '-value becomes its reciprocal: ' + t('\\frac{1}{' + dt(d) + '}') + '.' }, { p: [x, -y], code: CP + 'rpt-neg', hint: 'A number and its reciprocal have the same sign.' }], t('\\left(' + x + ',\\ \\frac{1}{' + dt(d) + '}\\right)=' + pt(x, y)) + '.', ['The conversion works both ways: ' + t('(x,\\ k)') + ' on the reciprocal matches ' + t('\\left(x,\\ \\frac{1}{k}\\right)') + ' on ' + t('f') + '.'], 'matching points'); return p0; }),
      Pt('9c', 'BEG', function (r) { var x = nz(r, 1, 9), y = r.pick([1, -1]); return mc(r, 'The point ' + t(pt(x, y)) + ' is on ' + t('y=f(x)') + '. What can you say about it?', [{ html: 'It is an invariant point: ' + t(pt(x, y)) + ' is also on ' + REC + '.', right: true }, { html: t(pt(x, -y)) + ' is on ' + REC + '.', why: t('\\frac{1}{' + y + '}=' + y) + ': the reciprocal keeps the sign.', code: 'u7l7-flip' }, { html: t('x=' + x) + ' is a vertical asymptote of ' + REC + '.', why: 'Vertical asymptotes are where ' + t('f(x)=0') + '; here ' + t('f(' + x + ')=' + y) + '.', code: 'u7l7-va' }, { html: REC + ' has a turning point at ' + t(pt(x, y)) + '.', why: 'Not necessarily: only the vertex of ' + t('f') + ' gives a turning point.', code: 'u7l7-turn' }], t('\\frac{1}{' + y + '}=' + y) + ', so the point ' + t(pt(x, y)) + ' is on both graphs: an invariant point.', ['Which numbers are their own reciprocals?'], 'invariant points'); }),
      Pt('9d', 'PRG', function (r) {
        var z = pickWhere(function () { return { u: r.int(1, 7), v: -r.int(1, 7), k: r.int(2, 20), pos: r.chance(0.7) }; }, function (s) { s.b = -(s.u + s.v); s.c = s.u * s.v + s.k; s.Q = mkQ(1, s.b, s.c); return s.u !== -s.v && s.c !== 0 && fresh(s.Q) && Math.abs(s.c) <= 25 && !(s.b === -2 && s.c === -6); });
        var good = z.pos ? z.u : z.v, other = z.pos ? z.v : z.u, ft = z.Q.tex.replace(/x/g, 'a');
        return valPart(CP, 'Let ' + t('f(x)=' + z.Q.tex) + '. The point ' + t('\\left(a,\\ \\frac{1}{' + z.k + '}\\right)') + ', with ' + t(z.pos ? 'a>0' : 'a<0') + ', is on ' + REC + '. Determine ' + t('a') + '.', good, [{ v: other, code: CP + 'cond', hint: 'That value solves the equation, but the question says ' + t(z.pos ? 'a>0' : 'a<0') + '.' }],
          t('f(a)=' + z.k) + ': ' + t(tx(quad(1, z.b, z.c - z.k)).replace(/x/g, 'a') + '=0') + ', ' + t('(a' + sgT(-z.u) + ')(a' + sgT(-z.v) + ')=0') + ', so ' + t('a=' + z.u) + ' or ' + t('a=' + z.v) + '. Since ' + t(z.pos ? 'a>0' : 'a<0') + ', ' + t('a=' + good) + '.',
          ['To find where the reciprocal equals ' + t('\\frac{1}{' + z.k + '}') + ', solve ' + t('f(a)=' + z.k) + '.', 'Write the equation in standard form and factor it.'], 'a point on y = 1/f(x) from its y-value', { exact: false, before: 'a=' });
      })] },
    { num: '10', shared: function (r) { return pickWhere(function () { return { h: nz(r, 1, 4), k: r.int(2, 6) }; }, function (s) { s.Q = mkV(1, s.h, s.k); return fresh(s.Q); }); }, stem: function (s) { return 'Let ' + t('f(x)=' + s.Q.tex) + '.'; }, parts: [
      Pt('10a', 'EMG', function (r, s) { var Q = s.Q, D = Q.bv * Q.bv - 4 * Q.cv; return mc(r, 'Which statement explains why the graph of ' + REC + ' has no vertical asymptotes?', [{ html: t('b^{2}-4ac=' + D + '<0') + ', so ' + t('f') + ' has no zeros.', right: true }, { html: 'The leading coefficient of ' + t('f') + ' is positive.', why: 'Many parabolas that open up have zeros. What matters is whether ' + t('f(x)=0') + ' has solutions.', code: 'u7l7-lead' }, { html: t('f(0)=' + Q.cv) + ' is not zero.', why: 'That only shows ' + t('x=0') + ' is not a zero. Check every ' + t('x') + ': use the discriminant or the vertex.', code: 'u7l7-f0' }, { html: 'Every reciprocal graph has the horizontal asymptote ' + t('y=0') + '.', why: 'True, but it says nothing about vertical asymptotes: those are at the zeros of ' + t('f') + '.', code: 'u7l7-hz' }], t('b^{2}-4ac=' + Q.bv * Q.bv + '-' + 4 * Q.cv + '=' + D + '<0') + ', so ' + t('f') + ' has no zeros. (Or: ' + t('f(x)=' + Q.vtex) + ' opens up from a vertex above the axis.)', ['Vertical asymptotes are at the zeros of ' + t('f') + '.'], 'why there are no vertical asymptotes'); }),
      Pt('10b', 'EMG', function (r, s) { var Q = s.Q; return mc(r, 'Which statement explains why the graph of ' + REC + ' has no points in quadrants 3 and 4?', [{ html: t('f(x)\\ge ' + s.k + '>0') + ' for every ' + t('x') + ', and ' + t('\\frac{1}{f(x)}') + ' has the same sign as ' + t('f(x)') + '.', right: true }, { html: 'The graph has no vertical asymptotes.', why: 'A graph without asymptotes can still be below the axis. Look at the sign of ' + t('f(x)') + '.', code: 'u7l7-noasy' }, { html: 'The ' + t('y') + '-intercept, ' + t('\\frac{1}{' + Q.cv + '}') + ', is positive.', why: 'One point above the axis does not show that every point is. Look at the least value of ' + t('f') + '.', code: 'u7l7-yi' }, { html: 'The horizontal asymptote is ' + t('y=0') + '.', why: 'Every reciprocal graph has that asymptote, and many have points below the axis.', code: 'u7l7-hz2' }], t('f(x)=' + Q.vtex + '\\ge ' + s.k + '>0') + ' for every ' + t('x') + ', and the reciprocal has the same sign, so ' + t('\\frac{1}{f(x)}>0') + ': the graph is entirely above the ' + t('x') + '-axis.', ['Quadrants 3 and 4 are below the ' + t('x') + '-axis.'], 'why the reciprocal is above the axis'); }),
      Pt('10c', 'PRG', function (r, s) { var Q = s.Q, mv = valChk(CP, toR(1 / s.k), [{ v: s.k, code: CP + 'turn-q', hint: 'That is the least value of ' + t('f') + '. The greatest value of its reciprocal is ' + t('\\frac{1}{' + s.k + '}') + '.' }]); var mx = { f: { label: 'Maximum value', name: 'maximum value', mode: 'math', keys: 'fraction' }, c: mv.check, k: rt(toR(1 / s.k)), a: 'maximum value ' + t(rt(toR(1 / s.k))), s: 'Maximum value ' + t('\\frac{1}{' + s.k + '}') + ' at ' + t('x=' + s.h) + '.', bad: [String(s.k)] }; return combo('State the maximum value and the range of ' + REC + ', and its invariant points (or write none).', [mx, sRng(CP, Q), sInv(CP, Q)], ['The least value of ' + t('f') + ' gives the greatest value of its reciprocal.', 'Invariant points need ' + t('f(x)=1') + ' or ' + t('f(x)=-1') + '.'], 'maximum, range and invariant points', null, mx.s + '<br>' + sRng(CP, Q).s + '<br>No invariant points: ' + t('f(x)\\ge ' + s.k) + ' is never ' + t('1') + ' or ' + t('-1') + '.'); })] },
    { num: '11', shared: q11Shared, stem: function (s) { return 'Let ' + t('f(x)=' + s.Q.vtex) + '.'; }, parts: [Pt('11a', 'EMG', q11a), Pt('11b', 'MAS', q11b)] },
    { num: '12', parts: [
      Pt('12a', 'EMG', function (r) {
        var z = pickWhere(function () { return { m: r.pick([1, 1, 2, 3]), n: nz(r, 1, 6) }; }, function (s) { return gcd(s.m, s.n) === 1 && AVOID.indexOf(tx(P.mul(lin(s.m, -s.n), lin(s.m, -s.n)))) < 0; });
        var Pp = P.mul(lin(z.m, -z.n), lin(z.m, -z.n)), h = toR([z.n, z.m]), nm = r.pick(['Liam', 'Noor', 'Eli', 'Sana']);
        return mc(r, nm + ' says: “A quadratic has two zeros, so the graph of ' + t('y=\\dfrac{1}{' + tx(Pp) + '}') + ' has two vertical asymptotes.” Which statement explains the error?', [{ html: t(tx(Pp) + '=(' + tx(lin(z.m, -z.n)) + ')^{2}') + ' has only one zero (a double root), so there is one vertical asymptote, ' + t('x=' + rt(h)) + '.', right: true }, { html: 'It has no zeros, so there are no vertical asymptotes.', why: 'It has a zero: ' + t('x=' + rt(h)) + ' makes it 0.', code: 'u7l7-nozero' }, { html: nm + ' is right: the asymptotes are ' + t('x=' + rt(h)) + ' and ' + t('x=' + rt(rneg(h))) + '.', why: 'Substitute ' + t('x=' + rt(rneg(h))) + ': the quadratic is not 0 there.', code: 'u7l7-pm' }, { html: 'The vertical asymptotes are at ' + t('x=\\pm\\sqrt{' + rt(toR(z.n * z.n)) + '}') + '.', why: 'Factor the trinomial: it is a perfect square.', code: 'u7l7-root' }],
          t(tx(Pp) + '=(' + tx(lin(z.m, -z.n)) + ')^{2}') + ' has only one zero, ' + t('x=' + rt(h)) + ' (a double root), so there is one vertical asymptote. A quadratic can have two, one or no zeros.', ['Factor the denominator.'], 'one vertical asymptote for a perfect square');
      }),
      Pt('12b', 'PRG', function (r) {
        var z = pickWhere(function () { return { h: nz(r, 1, 5), up: r.chance(0.6) }; }, function (s) { s.Q = mkV(s.up ? 1 : -1, s.h, s.up ? 1 : -1); return fresh(s.Q); });
        var Q = z.Q, y = z.up ? 1 : -1, claim = z.up ? 'minimum' : 'maximum', truth = z.up ? 'maximum' : 'minimum', nm = r.pick(['Maya', 'Owen', 'Priya', 'Jonah']);
        return mc(r, nm + ' says: “The vertex of ' + t('f(x)=' + Q.tex) + ' is ' + t(pt(z.h, y)) + ', so the graph of ' + REC + ' has a ' + claim + ' point at ' + t(pt(z.h, y)) + '.” Which statement explains the error?', [{ html: t(pt(z.h, y)) + ' is an invariant point, but it is a <b>' + truth + '</b> of the reciprocal: ' + t(z.up ? 'f(x)\\ge 1' : 'f(x)\\le -1') + ' gives ' + t(z.up ? '\\frac{1}{f(x)}\\le 1' : '\\frac{1}{f(x)}\\ge -1') + '.', right: true }, { html: 'The turning point of the reciprocal is ' + t(pt(-z.h, y)) + '.', why: 'The turning point keeps the vertex’s ' + t('x') + '-value.', code: 'u7l7-xs' }, { html: 'The reciprocal has no turning point, because the vertex is an invariant point.', why: 'An invariant vertex is still the turning point: ' + t('\\left(' + z.h + ',\\ \\frac{1}{' + y + '}\\right)=' + pt(z.h, y)) + '.', code: 'u7l7-noturn' }, { html: 'There is no error: a ' + claim + ' of ' + t('f') + ' is a ' + claim + ' of its reciprocal.', why: 'Where ' + t('f') + ' is ' + (z.up ? 'smallest' : 'largest') + ', its reciprocal is ' + (z.up ? 'largest' : 'smallest') + ': the type switches.', code: 'u7l7-same' }],
          t('f(x)=' + Q.vtex) + ' opens ' + (z.up ? 'up' : 'down') + ', so ' + t(pt(z.h, y)) + ' is the ' + claim + ' of ' + t('f') + '. Its reciprocal ' + t(pt(z.h, y)) + ' is an invariant point, but it is a <b>' + truth + '</b> point of the reciprocal graph.', ['The vertex ' + t('(p,\\ q)') + ' gives the turning point ' + t('\\left(p,\\ \\frac{1}{q}\\right)') + ' with the type switched.'], 'type of the turning point');
      })] },
    { num: '13', section: 'Multiple choice and numerical response', parts: [Pt('13', 'PRG', function (r) { return stmtMC(r, CP); })] },
    { num: '14', parts: [Pt('14', 'PRG', function (r) { return couldMC(r, CP); })] },
    { num: '15', parts: [Pt('15', 'PRG', function (r) { return rangeMC(r, CP); })] },
    { num: '16', parts: [Pt('16', 'PRG', function (r) { return invCountMC(r, CP); })] },
    { num: '17', parts: [Pt('17', 'ADV', function (r) {
      var z = pickWhere(function () { return { m: r.pick([1, 1, 1, 2, 3]), n: r.int(2, 9) }; }, function (s) { return !(s.m === 1 && s.n === 3) && gcd(s.m, s.n) === 1; }), k = 2 * z.m * z.n, lead = z.m === 1 ? 'x^{2}' : z.m * z.m + 'x^{2}';
      return KP.nr('The graph of ' + t('y=\\dfrac{1}{' + lead + '+kx+' + z.n * z.n + '}') + ', where ' + t('k>0') + ', has exactly one vertical asymptote. The value of ' + t('k') + ' is ____.', k, function (v) { if (v === z.m * z.n) return { code: CP + 'k-half', hint: 'One zero means a perfect square: ' + t('(' + (z.m === 1 ? '' : z.m) + 'x+' + z.n + ')^{2}') + ' has middle term ' + t(k + 'x') + ' (or use ' + t('k^{2}-4ac=0') + ').' }; if (v === z.n * z.n) return { code: CP + 'k-half', hint: 'Use the discriminant: ' + t('k^{2}-4(' + z.m * z.m + ')(' + z.n * z.n + ')=0') + '.' }; return null; },
        'One vertical asymptote means exactly one zero: ' + t('b^{2}-4ac=k^{2}-4(' + z.m * z.m + ')(' + z.n * z.n + ')=0') + ', ' + t('k^{2}=' + k * k) + ', ' + t('k=\\pm ' + k) + '. Since ' + t('k>0') + ', ' + t('k=' + k) + ' (the asymptote is ' + t('x=' + rt(toR([-z.n, z.m]))) + ').', ['The vertical asymptotes are at the zeros of the quadratic.', 'Exactly one zero: the discriminant is 0.'], 'k for one vertical asymptote');
    })] },
    { num: '18', parts: [Pt('18', 'MAS', function (r) {
      var z = pickWhere(function () { return { a: r.pick([1, 2, 3, [1, 2]]), p: nz(r, 1, 3), q: r.pick([2, 4, 5, 8, 10]), x0: r.int(-3, 4) }; }, function (s) { s.T = mkV(toR(s.a), s.p, s.q); s.c = s.T.cv; var cR = toR(1 / s.c); return Number.isInteger(s.c) && [2, 4, 5, 8, 10, 16, 20, 25, 40, 50].indexOf(s.c) >= 0 && s.x0 !== 0 && s.x0 !== s.p && Number.isInteger(s.T.f(s.x0)) && !(s.p === 1 && s.q === 4 && rv(s.a) === 1 && s.x0 === 3) && cR; });
      var fx = z.T.f(z.x0), kT = dt(1 / z.q), cT = dt(1 / z.c);
      return KP.nr('The graph of ' + REC + ', where ' + t('f') + ' is a quadratic function, has a maximum point ' + t('(' + z.p + ',\\ ' + kT + ')') + ' and a ' + t('y') + '-intercept of ' + t(cT) + '. The value of ' + t('f(' + z.x0 + ')') + ' is ____.', fx, function (v) { if (Math.abs(v - 1 / fx) < 1e-9) return { code: CP + 'f-val', hint: 'That is the value of the reciprocal. The question asks for ' + t('f(' + z.x0 + ')') + '.' }; return null; },
        'Vertex of ' + t('f') + ': ' + t('\\left(' + z.p + ',\\ \\frac{1}{' + kT + '}\\right)=' + pt(z.p, z.q)) + '; ' + t('f(0)=\\frac{1}{' + cT + '}=' + z.c) + '.<br>' + t('f(x)=a(x' + sgT(-z.p) + ')^{2}+' + z.q) + ': ' + t(z.c + '=' + z.p * z.p + 'a+' + z.q) + ', ' + t('a=' + rt(toR(z.a))) + '.<br>' + t('f(' + z.x0 + ')=' + coefT(toR(z.a)) + '(' + (z.x0 - z.p) + ')^{2}+' + z.q + '=' + fx),
        ['Take the reciprocals: the turning point gives the vertex of ' + t('f') + ' and the ' + t('y') + '-intercept gives ' + t('f(0)') + '.', 'Find ' + t('a') + ', then substitute.'], 'a value of f from its reciprocal');
    })] }
  ];

  /* ======================================================================================================
   * Lesson 7 Extra Practice
   * ====================================================================================================== */
  function decPt(r, cp, fwd) {
    var x = nz(r, 1, 9), list = fwd ? [0.5, -0.5, 0.25, -0.25, 0.2, -0.2, 0.125, 0.1] : [10, -10, 4, -4, 5, 8, 20, -5], g = r.pick(list), w = 1 / g;
    var p0 = pointPart(cp, 'The point ' + t('(' + x + ',\\ ' + dt(g) + ')') + ' is on ' + (fwd ? t('y=f(x)') : REC) + '. State the matching point on ' + (fwd ? REC : t('y=f(x)')) + '.', [x, w], [{ p: [x, g], code: cp + 'rpt-same', hint: 'The ' + t('y') + '-value becomes its reciprocal.' }, { p: [x, -w], code: cp + 'rpt-neg', hint: 'A number and its reciprocal have the same sign.' }, { p: [toR(1 / x), g], code: cp + 'rpt-x', hint: 'The ' + t('x') + '-value stays; the ' + t('y') + '-value becomes its reciprocal.' }],
      t('\\frac{1}{' + dt(g) + '}=' + dt(w)) + ': ' + t('(' + x + ',\\ ' + dt(w) + ')') + '.', ['A point ' + t('(x,\\ y)') + ' matches ' + t('\\left(x,\\ \\frac{1}{y}\\right)') + ' on the other graph.'], 'matching points');
    p0.key = '(' + x + ', ' + dt(w) + ')';
    return p0;
  }
  function a5Shared(r) { return pickWhere(function () { return { p: nz(r, 1, 5) }; }, function (s) { s.Q = mkV(1, s.p, -1); return fresh(s.Q); }); }
  var EXTRA = [
    { num: '1', section: 'A. Skills', stem: 'State the number of vertical asymptotes of the graph of ' + REC + ' and their equations.', parts: [
      Pt('E1a', 'BEG', function (r) { return vaPart(r, CP, 'two'); }), Pt('E1b', 'EMG', function (r) { return vaPart(r, CP, 'sq'); }), Pt('E1c', 'BEG', function (r) { return vaPart(r, CP, 'noneNeg'); }), Pt('E1d', 'PRG', function (r) { return vaPart(r, CP, 'twoA'); })] },
    { num: '2', stem: 'State the turning point of ' + REC + ' and whether it is a maximum or a minimum.', parts: [
      Pt('E2a', 'BEG', function (r) { var z = pickWhere(function () { return { p: nz(r, 1, 5), q: r.int(2, 9) }; }, function (s) { s.Q = mkV(1, s.p, s.q); return fresh(s.Q) && !(s.p === -3 && s.q === 4); }); return tpPart(CP, z.Q, 'Let ' + t('f(x)=' + z.Q.vtex) + '. State the turning point of ' + REC + ' and its type.'); }),
      Pt('E2b', 'EMG', function (r) { var z = pickWhere(function () { return { a: r.pick([-2, -3, [-1, 2], -4]), p: nz(r, 1, 5), q: -r.pick([2, 3, 4, 5, 6, 8, 10]) }; }, function (s) { s.Q = mkV(toR(s.a), s.p, s.q); return fresh(s.Q) && !(s.p === 1 && s.q === -5); }); return tpPart(CP, z.Q, 'Let ' + t('f(x)=' + z.Q.vtex) + '. State the turning point of ' + REC + ' and its type.'); }),
      Pt('E2c', 'PRG', function (r) { var z = fullSpec(r, { ms: [1, 2, 3] }); return tpPart(CP, z.Q, 'Let ' + t('f(x)=' + z.Q.tex) + '. State the turning point of ' + REC + ' and its type.'); })] },
    { num: '3', parts: [
      Pt('E3a', 'LIM', function (r) { return decPt(r, CP, true); }),
      Pt('E3b', 'BEG', function (r) { var x = nz(r, 1, 9), y = r.pick([1, -1]); return pointPart(CP, 'The point ' + t(pt(x, y)) + ' is on ' + t('y=f(x)') + '. State the matching point on ' + REC + '.', [x, y], [{ p: [x, -y], code: CP + 'rpt-neg', hint: t('\\frac{1}{' + y + '}=' + y) + ': the reciprocal keeps the sign.' }, { p: [toR(1 / x), y], code: CP + 'rpt-x', hint: 'The ' + t('x') + '-value stays.' }], t('\\frac{1}{' + y + '}=' + y) + ': the point is ' + t(pt(x, y)) + ' itself, an invariant point.', ['Which numbers are their own reciprocals?'], 'invariant points'); }),
      Pt('E3c', 'BEG', function (r) { return decPt(r, CP, false); })] },
    { num: '4', stem: 'State the domain and range of ' + REC + '.', parts: [
      Pt('E4a', 'PRG', function (r) { var z = pickWhere(function () { return { p: nz(r, 1, 5), q: r.int(2, 9) }; }, function (s) { s.Q = mkV(1, s.p, s.q); return fresh(s.Q) && !(s.p === 2 && s.q === 5); }); return tpdrPart(CP, z.Q, z.Q.vtex, ['d', 'r'], 'domain and range of y = 1/f(x)'); }),
      Pt('E4b', 'PRG', function (r) { var z = pickWhere(function () { return { a: r.pick([-2, -4, -5, [-1, 2], -1]), p: r.chance(0.5) ? 0 : nz(r, 1, 4), up: r.chance(0.3) }; }, function (s) { s.Q = mkV(toR(s.up ? -rv(s.a) : s.a), s.p, 0); return fresh(s.Q); }); return tpdrPart(CP, z.Q, z.Q.vtex, ['d', 'r'], 'domain and range of y = 1/f(x)'); }),
      Pt('E4c', 'ADV', function (r) { var n = pickWhere(function () { return r.int(2, 8); }, function (x) { return x !== 3; }), Q = mkQ(-1, 0, n * n); return tpdrPart(CP, Q, n * n + '-x^{2}', ['d', 'r'], 'domain and range of y = 1/f(x)'); })] },
    { num: '5', stem: 'The graph of ' + t('y=f(x)') + ' is shown, with the guide lines ' + t('y=\\pm 1') + '.', parts: [
      Pt('E5a', 'PRG', function (r) { var z = a5Shared(r), Q = z.Q; return combo('Let ' + t('f(x)=' + Q.tex) + '.' + fGraph(Q, [], { y: [-3, 6] }) + 'For the graph of ' + REC + ', state the equations of the asymptotes and the exact invariant points.', [sAsy(CP, Q, true), sInv(CP, Q)], HINT_ASY.slice(0, 1).concat(['Invariant points are where ' + t('f(x)=\\pm 1') + ': here the vertex is one of them.']), 'asymptotes and invariant points'); }),
      Pt('E5b', 'PRG', function (r) { return oneMC(r, CP); })] },
    { num: '6', section: 'B. Applying', shared: function (r) { return fullSpec(r, { ms: [2, 3] }); }, stem: function (z) { return 'Let ' + t('f(x)=' + z.Q.tex) + '. For ' + REC + ', determine:'; }, parts: [
      Pt('E6a', 'EMG', function (r, z) { return combo('the asymptotes and the ' + t('y') + '-intercept', [sAsy(CP, z.Q, true, { why: fullWhy(z) }), sYint(CP, z.Q)], HINT_ASY, 'asymptotes and y-intercept of y = 1/f(x)'); }),
      Pt('E6b', 'PRG', function (r, z) { var a = sTP(CP, z.Q), b = sType(CP, z.Q), c = sInv(CP, z.Q); return combo('the turning point and its type, and the exact invariant points', [a, b, c], HINT_TP.slice(0, 1).concat(['Invariant points: solve ' + t('f(x)=1') + ' and ' + t('f(x)=-1') + '.']), 'turning point and invariant points', function (resp) { if (a.c(resp[0] || '').v === 'correct') { var r2 = b.c(resp[1] || ''); if (r2.v === 'wrong') return r2; } return null; }, t('f(x)=' + z.Q.vtex) + '. ' + a.s + '<br>' + c.s); }),
      Pt('E6c', 'PRG', function (r, z) { return combo('the domain and range', [sDom(CP, z.Q), sRng(CP, z.Q)], HINT_DR, 'domain and range of y = 1/f(x)'); })] },
    { num: '7', parts: [Pt('E7', 'ADV', function (r) {
      var z = asyTurnSpec(r, { sign: -1, as: [-1, -2, [-1, 2], [-1, 3], [-1, 4]] }), c = z.c, wr = backWrongs(CP, z.T, toR(1 / z.q), 'a zero', [z.s1, 0]);
      var yi = valChk(CP, toR(1 / c), [{ v: toR(c), code: CP + 'yint-same', hint: 'That is ' + t('f(0)') + '. The reciprocal’s ' + t('y') + '-intercept is ' + t('\\frac{1}{f(0)}') + '.' }]);
      var g = sGform(CP, z.T, wr); g.f.label = t('f(x)=');
      return combo('The graph of ' + REC + ', where ' + t('f') + ' is a quadratic function, has the vertical asymptotes ' + t('x=' + z.r1) + ' and ' + t('x=' + z.s1) + ' and a minimum point ' + t('\\left(' + z.p + ',\\ ' + rt(toR(1 / z.q)) + '\\right)') + '. Determine ' + t('f(x)') + ' in general form, and state the ' + t('y') + '-intercept of the reciprocal graph.',
        [g, { f: { label: t('y') + '-intercept of ' + REC, name: 'y-intercept', mode: 'math', keys: 'fraction' }, c: yi.check, k: rt(toR(1 / c)), a: t('y') + '-intercept ' + t(rt(toR(1 / c))), bad: [rt(toR(c))] }], HINT_BACK, 'a quadratic f from its reciprocal', null, asyTurnSol(z) + '<br>' + t('f(0)=' + rt(toR(c))) + ': the reciprocal’s ' + t('y') + '-intercept is ' + t(rt(toR(1 / c))) + '.');
    })] },
    { num: '8', parts: [Pt('E8', 'ADV', function (r) {
      var z = pickWhere(function () { return { a: r.pick([1, 2, 3, [1, 2]]), p: nz(r, 1, 4), q: r.pick([2, 3, 4, 5, 6]), d: nz(r, 1, 3) }; }, function (s) { s.T = mkV(toR(s.a), s.p, s.q); s.x1 = s.p + s.d; s.v = s.T.f(s.x1); return s.x1 !== 0 && Number.isInteger(s.v) && fresh(s.T) && !(s.p === -1 && s.q === 4 && rv(s.a) === 2); });
      var wr = backWrongs(CP, z.T, toR(1 / z.q), t('f(' + z.x1 + ')=' + z.v), [z.x1, z.v]);
      var p0 = KP.poly('The graph of ' + REC + ', where ' + t('f') + ' is a quadratic function, has a maximum point ' + t('\\left(' + z.p + ',\\ ' + rt(toR(1 / z.q)) + '\\right)') + ' and passes through ' + t('\\left(' + z.x1 + ',\\ ' + rt(toR(1 / z.v)) + '\\right)') + '. Determine ' + t('f(x)') + ' in general form.', z.T.poly, { wrong: wr },
        'Vertex of ' + t('f') + ': ' + t(pt(z.p, z.q)) + ', a minimum; the point gives ' + t('f(' + z.x1 + ')=' + z.v) + '.<br>' + t('f(x)=a(x' + sgT(-z.p) + ')^{2}+' + z.q) + ': ' + t(z.v + '=' + z.d * z.d + 'a+' + z.q) + ', ' + t('a=' + rt(toR(z.a))) + '.<br>' + t('f(x)=' + z.T.vtex + '=' + z.T.tex), HINT_BACK, 'a quadratic f from its reciprocal', { before: 'f(x)=' });
      return withBad(p0, wr);
    })] },
    { num: '9', parts: [Pt('E9', 'EMG', function (r) {
      var h = nz(r, 1, 4), b = -2 * h, sq = h * h, two = pickWhere(function () { return sq - r.int(1, 8); }, function (c) { return c !== 0 && isSq(b * b - 4 * c); }), none = sq + r.int(1, 6);
      var Qs = { one: mkQ(1, b, sq), two: mkQ(1, b, two), none: mkQ(1, b, none), neg: mkQ(-1, -b, 0) };
      var opts = [{ html: t(Qs.none.tex), right: true }, { html: t(Qs.one.tex), why: t(Qs.one.tex + '=(x' + sgT(-h) + ')^{2}') + ' has one zero: one vertical asymptote.', code: 'u7l7-one' }, { html: t(Qs.two.tex), why: 'Its discriminant is ' + t(b * b - 4 * two) + ', positive: two zeros, two asymptotes.', code: 'u7l7-two' }, { html: t(Qs.neg.tex), why: t(Qs.neg.tex + '=-x(x' + sgT(b) + ')') + ' has two zeros.', code: 'u7l7-neg' }];
      return mc(r, 'For which function does the graph of ' + REC + ' have no vertical asymptotes?', opts, t(Qs.none.tex) + ': ' + t('b^{2}-4ac=' + b * b + '-' + 4 * none + '=' + (b * b - 4 * none) + '<0') + ', so no zeros and no vertical asymptotes.', ['No vertical asymptotes means no zeros: a negative discriminant.'], 'which reciprocal has no vertical asymptotes');
    })] },
    { num: '10', parts: [Pt('E10', 'ADV', function (r) {
      var h = pickWhere(function () { return nz(r, 1, 5); }, function (x) { return x !== 3; }), q = r.pick([2, 4, 5, 10]), k = h * h + q;
      return KP.nr('The graph of ' + t('y=\\dfrac{1}{x^{2}' + sgT(-2 * h) + 'x+k}') + ' has no vertical asymptotes and its maximum value is ' + t(dt(1 / q)) + '. The value of ' + t('k') + ' is ____.', k, function (v) { if (Math.abs(v - (h * h + 1 / q)) < 1e-9) return { code: CP + 'k-vertex', hint: 'The vertex value of the quadratic is the reciprocal of ' + t(dt(1 / q)) + ', that is ' + t(q) + '.' }; if (v === q - h * h) return { code: CP + 'k-sign', hint: 'Complete the square: ' + t('x^{2}' + sgT(-2 * h) + 'x+k=(x' + sgT(-h) + ')^{2}+k-' + h * h) + '.' }; return null; },
        t('x^{2}' + sgT(-2 * h) + 'x+k=(x' + sgT(-h) + ')^{2}+k-' + h * h) + '. The maximum of the reciprocal is ' + t('\\frac{1}{k-' + h * h + '}=' + dt(1 / q)) + ', so ' + t('k-' + h * h + '=' + q) + ' and ' + t('k=' + k) + '.', ['Complete the square: the vertex value of the quadratic is the reciprocal of the maximum value.'], 'k from the maximum value');
    })] },
    { num: '11', section: 'C. Stretch', parts: [Pt('E11', 'MAS', function (r) {
      var b = nz(r, 1, 8), bd = toR([b * b, 4]), bT = rt(bd), fT = 'x^{2}' + sgT(b) + 'x+k';
      var mk = function (op, wr) { var tg = '\\{k\\mid k' + op + bT + '\\}'; return K.set(tg, { v: 'k', tag: false, wrong: wr || [] }); };
      var two = '\\{k\\mid k<' + bT + '\\}', none = '\\{k\\mid k>' + bT + '\\}';
      var f1 = { f: { label: 'Two vertical asymptotes when', name: 'two', mode: 'math', keys: 'set', vars: ['k'] }, c: mk('<', [{ is: none, code: CP + 'k-two', hint: 'Two zeros need ' + t('b^{2}-4ac>0') + ': ' + t(b * b + '-4k>0') + ', so ' + t('k<' + bT) + '.' }]), k: two, a: t('k<' + bT), bad: [none] };
      var f2 = { f: { label: 'One vertical asymptote when ' + t('k='), name: 'one', mode: 'math', keys: 'fraction' }, c: K.value(bd, { diag: function (v) { if (Math.abs(v - Math.abs(b) / 2) < 1e-9 && Math.abs(b) !== 2) return { code: CP + 'k-val', hint: 'Use the discriminant: ' + t(b * b + '-4k=0') + '.' }; if (Math.abs(v - b * b) < 1e-9) return { code: CP + 'k-val', hint: 'Divide by 4: ' + t(b * b + '-4k=0') + '.' }; return null; } }), k: bT, a: t('k=' + bT), bad: [String(b * b)] };
      var f3 = { f: { label: 'No vertical asymptotes when', name: 'none', mode: 'math', keys: 'set', vars: ['k'] }, c: mk('>', [{ is: two, code: CP + 'k-two', hint: 'No zeros need ' + t('b^{2}-4ac<0') + ': ' + t(b * b + '-4k<0') + ', so ' + t('k>' + bT) + '.' }]), k: none, a: t('k>' + bT), bad: [two] };
      return combo('For which values of ' + t('k') + ' does the graph of ' + t('y=\\dfrac{1}{' + fT + '}') + ' have two vertical asymptotes, one, or none?', [f1, f2, f3], ['The number of vertical asymptotes is the number of zeros of the quadratic: use the discriminant ' + t('b^{2}-4ac') + '.'], 'number of asymptotes from a parameter', null,
        t('b^{2}-4ac=' + b * b + '-4k') + '. Two zeros: ' + t(b * b + '-4k>0') + ', ' + t('k<' + bT) + '. One: ' + t('k=' + bT) + ' (the asymptote ' + t('x=' + rt(toR([-b, 2]))) + '). None: ' + t('k>' + bT) + '.');
    })] },
    { num: '12', parts: [Pt('E12', 'MAS', function (r) {
      var z = pickWhere(function () { return { r1: nz(r, 1, 5), s1: nz(r, 1, 6), a: r.pick([1, -1, 2, -2, 3, -3, [1, 2], [-1, 2]]) }; }, function (s) { s.c = rv(s.a) * s.r1 * s.s1; s.T = mkQ(toR(s.a), -rv(s.a) * (s.r1 + s.s1), s.c); return s.r1 < s.s1 && Number.isInteger(s.c) && s.c !== 0 && Math.abs(s.c) <= 30 && Math.abs(s.c) !== 1 && fresh(s.T) && !(s.r1 === -3 && s.s1 === 1); });
      var T = z.T, g = sGform(CP, T, [{ is: P.scale(T.poly, -1), code: CP + 'rb-a', hint: 'Use the ' + t('y') + '-intercept: ' + t('f(0)=' + z.c) + '.' }]); g.f.label = t('f(x)=');
      var a = sTP(CP, T), b = sType(CP, T);
      return combo('The graph of ' + REC + ', where ' + t('f(x)=ax^{2}+bx+c') + ', has the vertical asymptotes ' + t('x=' + z.r1) + ' and ' + t('x=' + z.s1) + ' and a ' + t('y') + '-intercept of ' + t(rt(toR(1 / z.c))) + '. Determine ' + t('f(x)') + ' and the turning point of the reciprocal graph.', [g, a, b], HINT_BACK.slice(0, 1).concat(['Write ' + t('f(x)=a(x-r)(x-s)') + ' and use ' + t('f(0)') + ' to find ' + t('a') + '. The vertex is halfway between the zeros.']), 'f and the turning point from the asymptotes and y-intercept', null,
        t('f(x)=a(x' + sgT(-z.r1) + ')(x' + sgT(-z.s1) + ')') + '; ' + t('f(0)=' + z.r1 * z.s1 + 'a=' + z.c) + ', so ' + t('a=' + rt(toR(z.a))) + ': ' + t('f(x)=' + T.tex) + '.<br>Vertex: ' + t('x=' + rt(toR(T.p))) + ', ' + t('f(' + rt(toR(T.p)) + ')=' + rt(toR(T.q))) + '. ' + a.s);
    })] },
    { num: '13', parts: [Pt('E13', 'MAS', function (r) {
      var z = fullSpec(r, { ms: [1, 2, 3] }), Q = z.Q, mn = [toR(Q.p), toR(-1 / Q.q)];
      var pc = pointChk(CP, mn, [{ p: [toR(Q.p), toR(1 / Q.q)], code: CP + 'abs-turn', hint: 'That is the turning point of ' + REC + '. The bars reflect it in the ' + t('x') + '-axis.' }, { p: [toR(Q.p), toR(-Q.q)], code: CP + 'turn-q', hint: 'Use the reciprocal: the turning point of ' + REC + ' is ' + t('\\left(' + rt(toR(Q.p)) + ',\\ \\frac{1}{' + rt(toR(Q.q)) + '}\\right)') + '.' }]);
      var rgT = S('y', 'y>0'), rg = K.set(rgT, { v: 'y', wrong: [{ is: S('y', 'y\\ge ' + rt(toR(-1 / Q.q))), code: CP + 'abs-rng', hint: 'The reflected middle branch gives ' + t('y\\ge ' + rt(toR(-1 / Q.q))) + ', but the outer branches take every positive value.' }, { is: S('y', 'y\\ge 0'), code: CP + 'rr-end', hint: 'The graph never reaches 0 (' + t('y=0') + ' is an asymptote).' }, { is: S('y', 'y\\le ' + rt(toR(1 / Q.q)) + '\\text{ or }y>0'), code: CP + 'rr-f', hint: 'That is the range of ' + REC + '. The bars make every value positive.' }] });
      return combo('Let ' + t('f(x)=' + Q.tex) + '. The graph of ' + t('y=\\left\\lvert\\dfrac{1}{f(x)}\\right\\rvert') + ' is the graph of ' + REC + ' with the branches below the ' + t('x') + '-axis reflected in it. State its local minimum point and its range.',
        [{ f: { label: 'Local minimum point', name: 'local minimum', mode: 'math', keys: 'u7pts' }, c: pc.check, k: pt(mn[0], mn[1]), a: 'local minimum ' + t(pt(mn[0], mn[1])), bad: pc.W.map(function (w) { return pt(w.p[0], w.p[1]); }) }, { f: { label: 'Range', mode: 'math', keys: 'set', vars: ['y'] }, c: rg, k: rgT, a: 'range ' + t(rgT), bad: [S('y', 'y\\ge ' + rt(toR(-1 / Q.q))), S('y', 'y\\ge 0')] }],
        ['First find the turning point of ' + REC + ': ' + t('\\left(p,\\ \\frac{1}{q}\\right)') + '.', 'The bars reflect the part below the ' + t('x') + '-axis: a local maximum below the axis becomes a local minimum above it.'], 'the absolute value of a reciprocal', null,
        t('f(x)=' + Q.vtex) + ': the reciprocal has the local maximum ' + t(pt(toR(Q.p), toR(1 / Q.q))) + ' on its middle branch, which is below the axis (for ' + t(z.r1 + '<x<' + z.s1) + '). The bars reflect that branch: local minimum ' + t(pt(mn[0], mn[1])) + '. The outer branches stay. Range ' + t(rgT) + ' (the reflected part gives ' + t('y\\ge ' + rt(mn[1])) + ', the outer branches every ' + t('y>0') + ').');
    })] }
  ];

  /* the Lesson 7 builders the review (u7l8.js) reuses */
  Object.assign(HW.u7k78, { REC: REC, tabPart: tabPart, sqMC: sqMC, oneMC: oneMC, yintPart: yintPart, asyOnly: asyOnly, turnYPart: turnYPart, stmtMC: stmtMC, couldMC: couldMC, rangeMC: rangeMC, invCountMC: invCountMC, decPt: decPt, isUndef: isUndef });

  HW.defineLesson({ id: LID, unit: 7, num: '7', title: 'Reciprocal Functions of Quadratic Functions', outcome: 'RF11', calc: true, questions: QUESTIONS, extra: EXTRA });
})(window);
