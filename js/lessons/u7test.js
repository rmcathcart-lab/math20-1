/* Math 20-1 · Unit 7 Test (AN1, RF2, RF11) — Absolute Value and Reciprocal Functions: the absolute value of a real
 * number (evaluating, ordering, distance, simplifying), graphs of y = |f(x)| for linear and quadratic f (vertex,
 * invariant points, range, piecewise form, working backwards), absolute value equations (|A| = c after isolating,
 * |A| = B by cases with extraneous roots, the absolute value of a quadratic, the number of solutions, problems), and
 * reciprocal functions y = 1/f(x) of linear and quadratic f (asymptotes, invariant points, the turning point, domain and
 * range, matching graphs, working backwards). Written from Ryan's Unit 7 booklet (m201book/unit7: Lessons 1–8, their
 * assignments and extra practice; Lesson 8's assignment and EP08 are the practice tests that set the style and
 * difficulty). There is no older test for this course. One class (about 75 minutes by tests/short_report.js),
 * calculator allowed (answers exact where exactness is the skill: fractions, radicals, points); three outcomes, each with
 * Beginning, Progressing and Mastery boxes; 16 questions / 26 parts. Solving absolute value equations is RF2 (the
 * course plan and js/catalog.js list AN1, RF2 and RF11 for the unit; RF2's achievement indicators include solving
 * absolute value equations graphically and algebraically):
 *   AN1  (absolute value of real numbers, L1)                Beginning 1 question / 2 parts, Progressing 1 / 2, Mastery 1 / 1
 *   RF2  (|f(x)| graphs and absolute value equations, L2–L5) Beginning 2 / 4,                Progressing 3 / 5, Mastery 3 / 3
 *   RF11 (reciprocal functions, L6–L7)                       Beginning 1 / 3,                Progressing 2 / 4, Mastery 2 / 2
 *
 * How each box is pitched:
 *   Beginning  — each lesson's core skill as first taught: evaluating an expression with absolute values (order of
 *                operations, a minus sign outside the bars, nested bars) and the distance between two numbers (L1 Ex 1–2,
 *                Ex 6, #1–2, #8); recognising the graph of y = |f(x)| from the graph of a line (MC: only the part below
 *                the axis is reflected) and the invariant points of y = |x² + bx + c| (L2 Ex 2, #2, L3 Ex 2, #1); solving
 *                |A| = c after isolating the absolute value, with "no solution" possible, and |x² − n| = k or
 *                |x² + bx + c| = k (L4 Ex 1, Ex 4, #1, #5, L5 Ex 2, #1); the asymptotes and y-intercept of y = 1/(ax + b),
 *                its invariant points, and the vertical asymptotes of y = 1/f(x) for a quadratic f (two, one or none)
 *                (L6 Ex 4–5, #4, L7 Ex 2, #2).
 *   Progressing — the typical assignment question: ordering expressions with absolute values and a trip's net change
 *                and total distance (L1 Ex 4, Ex 7, #5, #10); the piecewise form of y = |ax + b| (the sign reversal
 *                when a < 0) and of y = |ax² + bx + c| (L2 Ex 5, #6, L3 Ex 5, #6); the range of y = |a(x − p)² + q|
 *                (crossing, entirely above, entirely below) (L3 Ex 4, #4); |ax + b| = cx + d by cases with extraneous
 *                roots (L4 Ex 6–7, #7–8); |x² + bx + c| = k with two, three or four solutions (L5 Ex 2, #1–2); the graph
 *                of y = 1/f(x) from the graph of a line (MC: the branches keep the sign of f) and a linear f from the
 *                reciprocal's asymptote and a point (L6 Ex 7–8, #7–8, #12); the turning point of y = 1/f(x) and its type,
 *                and the range of y = 1/f(x) (L7 Ex 3, #3, #13).
 *   Mastery    — the hardest assignment / extra-practice items: simplifying without bars for x < 0 or on an interval,
 *                and a < 0 < b from |a| and |a − b| (L1 #13, EP01 C1–C3); working backwards from a graph of y = |f(x)|
 *                (k from the range, the three-intersection line, f from the W graph or the V graph) (L2 #10, L3 Ex 7,
 *                #9–11, #18); |A| = B with a quadratic and extraneous roots (L5 Ex 4, #7, L8 #7b, EP08 C2); a problem
 *                (a number and its distance from h, a drone's height within a band) (L4 Ex 8c, #13, L5 Ex 6, #11); f
 *                from the reciprocal's turning point and y-intercept (or its asymptotes and turning point), and the
 *                parameter that gives one asymptote or a given turning point (L7 Ex 6, #7–8, #18–19, L8 #11, EP08 #14).
 * Coverage: L1 Q1, Q5, Q11 · L2 Q2, Q6, Q12 · L3 Q2, Q7, Q12 · L4 Q3, Q8, Q14 · L5 Q3, Q8, Q13, Q14 · L6 Q4, Q9 ·
 *           L7 Q4, Q10, Q15, Q16 · L8 (review) numbers and styles throughout (Q3, Q8, Q10, Q13, Q15).
 * Short version (def.short): Q1a, Q2a, Q3a, Q4ac (Beginning: AN1 1, RF2 2, RF11 2 parts), Q5a, Q7b, Q8a, Q9a, Q10a
 * (Progressing: AN1 1, RF2 2, RF11 2), Q11, Q13, Q15 (Mastery: 1 each) — 12 questions / 13 parts, about half the
 * working time (~38 of ~77 min by tests/short_report.js); every outcome keeps all three boxes.
 * Not used: sketching on a grid (the online version asks for what a sketch shows: the vertex, invariant points,
 * asymptotes, turning point, domain and range, and one MC graph match per graph type); "describe a strategy" and
 * "explain" items (their checkable step is asked instead); numerical-response boxes; two-absolute-value equations
 * (|A| = |B|, |A| + |B| = k: a workbook extension, Lesson 5 §4, beyond the course).
 *
 * Answers are typed. Numbers and exact values (fractions, radicals) through K.value; points "(x, y)" (K.point); sets of
 * points "(1, 0), (5, 0)" or "none" (K.pairs, ± allowed); solutions "x = a, x = b" (± allowed, any order) or "no
 * solution"; asymptotes as equations "x = 2, y = 0" (or "none"); domain and range through K.set (set notation, an
 * inequality or interval notation); expressions and functions as polynomials in any equivalent form (K.poly); piecewise
 * forms as labelled boxes (the boundary and the expression on each side). Every part has `bad` answers with u7t- codes;
 * partial credit (one recognized mistake keeps 2/3 or 1/3) is decided below.
 *
 * The question builders are the Unit 7 assessment kit HW.u7assess (below); js/exits/u7.js uses them with u7x- codes, so
 * this file loads first. Nothing here depends on the practice files (js/lessons/u7l*.js) or on other units' files. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, KP = K.P, P = HW.poly, ex = HW.ex, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
  if (!K.set || !K.point || !K.pairs || !HW.graph || !K.poly) throw new Error('js/lessons/u7test.js needs js/relfn.js, js/lines.js and js/poly.js');

  /* ======================================================================================================
   * Codes: one list, registered for both the test (u7t-) and the exit slips (u7x-), with partial-credit decisions
   * (s = small: keeps 2/3, b = big: keeps 1/3, n = none). Format nudges (v: 'form') only need labels.
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
  (function () {
    var codes = {}, part = {};
    Object.keys(BASE).forEach(function (k) { ['u7t-', 'u7x-'].forEach(function (cp) { codes[cp + k] = BASE[k][0]; if (BASE[k][1]) part[cp + k] = BASE[k][1]; }); });
    HW.addCodes(codes); HW.addPartial(part);
  })();

  /* ======================================================================================================
   * Small tools
   * ====================================================================================================== */
  function gcd(a, b) { return ex.gcd(Math.abs(a), Math.abs(b)); }
  function pickWhere(gen, test) { for (var i = 0; i < 8000; i++) { var o = gen(); if (o && test(o)) return o; } throw new Error('u7 assessments: no instance found'); }
  function nz(r, lo, hi) { return (r.chance(0.5) ? -1 : 1) * r.int(lo, hi); }
  function toR(x) { if (Array.isArray(x)) return ex.norm(x[0], x[1]); for (var q = 1; q <= 2000; q++) { var p = x * q; if (Math.abs(p - Math.round(p)) < 1e-9) return ex.norm(Math.round(p), q); } return null; }
  function rv(x) { return Array.isArray(x) ? x[0] / x[1] : x; }
  function rt(x) { var f = toR(x); return f ? ex.texRat(f) : String(+rv(x).toFixed(6)); }      // exact: integers and fractions
  function dt(x) { return String(+rv(x).toFixed(6)); }                                             // as a decimal (contexts)
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
  /* ax + b written constant first when a < 0 (6 − 3x rather than −3x + 6), if asked */
  function linT(a, b, cf) { return cf && rv(a) < 0 && rv(b) !== 0 ? P.seq([M(b, 0), M(a, 1)]) : tx(lin(a, b)); }
  function vtxT(a, p, q) { var s = coefT(a) + (rv(p) === 0 ? 'x^{2}' : '(x' + sgT(-rv(p)) + ')^{2}'); return s + (rv(q) === 0 ? '' : sgT(q)); }
  function pt(x, y) { return '(' + rt(x) + ',\\ ' + rt(y) + ')'; }
  function ptsT(list) { return list.length ? list.map(function (p) { return p[2] || pt(p[0], p[1]); }).join(',\\ ') : '\\text{none}'; }
  function rootsT(vals, v) { return vals.length ? vals.map(function (x) { return (v || 'x') + '=' + (x.tex || rt(x)); }).join(',\\ ') : '\\text{no solution}'; }
  function valOf(x) { return x && x.tex ? x.v : rv(x); }
  function evalP(p, x) { return P.at(p, { x: x }); }
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
  function rootsPmT(Aq, Bq, Cq) { var rs = qroots(Aq, Bq, Cq); return rs.map(function (x) { return x.tex; }); }

  /* graphs */
  function G(o) { return HW.graph(Object.assign({ x: [-6, 6], y: [-6, 6], labels: 2, max: 300, aria: 'graph' }, o)); }
  function mini(o) { return HW.graph(Object.assign({ x: [-6, 6], y: [-6, 6], labels: 2, max: 165, aria: 'graph' }, o)); }
  function crv(f, o) { return Object.assign({ f: f, start: 'arrow', end: 'arrow' }, o || {}); }
  /* branches of y = 1/f(x) between the zeros of f (zs sorted) */
  function recFns(f, zs, xr) { var cuts = [xr[0]].concat(zs).concat([xr[1]]), out = []; for (var i = 0; i + 1 < cuts.length; i++) out.push(crv(function (x) { return 1 / f(x); }, { from: cuts[i] + (i ? 1e-3 : 0), to: cuts[i + 1] - (i + 2 < cuts.length ? 1e-3 : 0) })); return out; }

  /* ======================================================================================================
   * Answer readers and checkers
   * ====================================================================================================== */
  function plainLow(s) { return String(s == null ? '' : s).replace(/\\text\{([^}]*)\}|\\mathrm\{([^}]*)\}/g, function (m, a, b) { return a || b || ''; }).replace(/\\left|\\right|\\[,;:! ]|~/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase(); }
  function isNone(s) { var l = plainLow(s); return /^(no( real)? (solutions?|roots?)|no solution|none|no invariant points?|no( vertical)? asymptotes?|∅|\\emptyset|\\varnothing|\{ ?\}|\\\{ ?\\\})$/.test(l); }
  function splitTop(s) { var out = [], d = 0, cur = ''; for (var i = 0; i < s.length; i++) { var c = s.charAt(i); if (c === '{' || c === '(' || c === '[') d++; else if (c === '}' || c === ')' || c === ']') d--; if (c === ',' && d === 0) { out.push(cur); cur = ''; } else cur += c; } out.push(cur); return out; }
  function prep(resp) { return String(resp == null ? '' : resp).replace(/\\left|\\right/g, '').replace(/\\text\{\s*(or|and)\s*\}/gi, ',').replace(/(^|[^a-z\\])(or|and)(?![a-z])/gi, '$1,').replace(/;/g, ',').replace(/\\(quad|qquad)(?![a-zA-Z])|\\[ ,;:!]|~/g, ' '); }
  function numVal(s) { s = String(s).trim().replace(/^\+/, ''); if (!s) return null; var r = ex.parse(s); if (!r.ok) return null; var v = ex.value(r.ast); return isFinite(v) ? v : null; }
  /* "x = 2, x = -3", "x = 1 ± √6", "-1, 0, 2" -> { vals } */
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
  function closeTo(a, b, round) { return Math.abs(a - b) < 1e-9 * Math.max(1, Math.abs(b)) || (round && Math.abs(a - b) <= 0.0051); }
  function matchVals(Aa, T, round) { return Aa.length === T.length && T.every(function (b) { return Aa.some(function (a) { return closeTo(a, b, round); }); }); }
  /* solutions of an equation. vals: the solutions (numbers, [p,q] or { v, tex }); o.extr: extraneous roots; o.wrongs:
     [{ vals, code, hint }]; o.round: decimals to the hundredth are accepted (exact values too); o.v the variable */
  function rootsPart(cp, prompt, vals, o, sol, hints, text) {
    o = o || {};
    var v = o.v || 'x', T = uniqNums(vals.map(valOf)), extr = uniqNums((o.extr || []).map(valOf)).filter(function (e) { return !has(T, e); }), round = !!o.round;
    var wrongs = (o.wrongs || []).map(function (w) { return { vals: uniqNums(w.vals.map(valOf)), orig: w.vals, none: !w.vals.length, code: w.code, hint: w.hint }; }).filter(function (w) { return !(w.none ? !T.length : sameSet(w.vals, T)); });
    var extrHint = o.extrHint || 'Check every answer in the <b>original</b> equation: ' + (extr.length ? t(v + '=' + rt(toR(extr[0]) || extr[0])) + ' makes the side without bars negative, so it is extraneous' : 'one of yours does not check') + '.';
    var check = function (resp) {
      if (isNone(resp)) { if (!T.length) return ok(); var wn = wrongs.filter(function (w) { return w.none; })[0]; return wrong(wn ? wn.code : cp + 'nosol-claim', wn ? wn.hint : o.noneHint || 'There is a solution: solve both cases, then check each answer in the original equation.'); }
      var L = readVals(resp, v);
      if (L.empty) return form('empty', 'Type your answer first.');
      if (L.letter) return form('sol-letter', 'Use the variable ' + t(v) + ' here (you wrote ' + t(L.letter + '=') + ').');
      if (L.unsimp) return form('simplify', 'Simplify each solution to a single number (no ' + t('\\times') + ', + or − between numbers).');
      if (L.bad) return form('unreadable', 'Write each solution separated by commas, e.g. ' + t(v + '=3,\\ ' + v + '=-5') + ' (or: no solution).');
      var Aa = uniqNums(L.vals);
      if (T.length && matchVals(Aa, T, round)) return ok();
      if (!round && L.dec && T.length && Aa.length === T.length && T.every(function (b) { return Aa.some(function (a) { return Math.abs(a - b) < 0.006; }); })) return form(cp + 'exact', 'Those are rounded decimals. Give the <b>exact</b> values (fractions or radicals).');
      for (var i = 0; i < wrongs.length; i++) if (!wrongs[i].none && matchVals(Aa, wrongs[i].vals, round)) return wrong(wrongs[i].code, wrongs[i].hint);
      if (!T.length) { if (extr.length && Aa.every(function (a) { return extr.some(function (e) { return closeTo(a, e, round); }); })) return wrong(cp + 'extr', extrHint + ' There is no solution.'); return wrong('value', 'Substitute your value into the original equation: it does not check.'); }
      var extra = Aa.filter(function (a) { return !T.some(function (b) { return closeTo(a, b, round); }); }), miss = T.filter(function (b) { return !Aa.some(function (a) { return closeTo(a, b, round); }); });
      if (extra.length && !miss.length && extr.length && extra.every(function (a) { return extr.some(function (e) { return closeTo(a, e, round); }); })) return wrong(cp + 'extr', extrHint);
      if (miss.length && !extra.length) return wrong(cp + (o.rejValid && extr.length ? 'rej-valid' : 'sol-missing'), o.rejValid && extr.length ? 'Check the solution you rejected again: it makes both sides equal, so keep it.' : 'Correct so far, but there ' + (miss.length === 1 ? 'is another solution' : 'are more solutions') + '. Solve <b>both</b> cases: the expression inside the bars equals the other side, or its opposite.');
      return wrong('value', null);
    };
    var keyTex = o.keyTex || rootsT(vals, v);
    var part = KP.math(prompt, check, keyTex, sol, hints, text, { keys: 'u7sol', vars: [v], placeholder: 'e.g. ' + v + ' = 3, ' + v + ' = -5   (or: no solution)' });
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
    var base = pairs.length ? K.pairs(pairs.map(function (p) { return [rv(p[0]), rv(p[1])]; })) : null;
    var W = (wrongs || []).filter(function (w) { return w.pairs && !(w.pairs.length === pairs.length && w.pairs.every(function (q) { return pairs.some(function (p) { return Math.abs(rv(p[0]) - rv(q[0])) < 1e-9 && Math.abs(rv(p[1]) - rv(q[1])) < 1e-9; }); })); })
      .map(function (w) { return { c: w.pairs.length ? K.pairs(w.pairs.map(function (p) { return [rv(p[0]), rv(p[1])]; })) : null, none: !w.pairs.length, code: w.code, hint: w.hint }; });
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
    var same = function (L) { return L.length === pairs.length && L.every(function (q) { return pairs.some(function (p) { return Math.abs(rv(p[0]) - rv(q[0])) < 1e-9 && Math.abs(rv(p[1]) - rv(q[1])) < 1e-9; }); }); };
    part.bad = (wrongs || []).filter(function (w) { return !same(w.pairs); }).map(function (w) { return ptsT(w.pairs); }).concat(pairs.length && o.noneOk !== false ? ['\\text{none}'] : []).filter(function (b, i, arr) { return arr.indexOf(b) === i && b !== keyTex; });
    return part;
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
      if (L.none) { if (!T.xs.length && !T.hz) return ok(); return wrong(cp + 'asy-none', T.xs.length ? 'There ' + (T.xs.length === 1 ? 'is a vertical asymptote' : 'are vertical asymptotes') + ': one at each zero of the denominator. Solve ' + t('f(x)=0') + '.' : 'Every reciprocal function has the horizontal asymptote ' + t('y=0') + '.'); }
      if (L.bare) return form(cp + 'asy-fmt', 'Write each asymptote as its own equation, e.g. ' + t('x=2,\\ x=-3') + '.');
      var xsOK = sameSet(L.xs, T.xs), ysOK = T.hz ? sameSet(L.ys, [0]) : (!L.ys.length || sameSet(L.ys, [0]));
      if (xsOK && ysOK) return ok();
      if (L.ys.some(function (y) { return y !== 0; }) && !L.xs.length && sameSet(L.ys, T.xs)) return wrong(cp + 'asy-xy', 'A vertical asymptote is a vertical line, ' + t('x=a') + ', not ' + t('y=a') + '.');
      for (var i = 0; i < W.length; i++) if (sameSet(L.xs, W[i].xs)) return wrong(W[i].code, W[i].hint);
      if (xsOK && L.ys.some(function (y) { return y !== 0; })) return wrong(cp + 'asy-hz', 'The vertical ' + (T.xs.length === 1 ? 'asymptote is' : 'asymptotes are') + ' right. The horizontal asymptote of ' + t('y=\\frac{1}{f(x)}') + ' is ' + t('y=0') + ': the reciprocal is never 0, but it gets close to 0 where ' + t('|f(x)|') + ' is large.');
      if (xsOK && T.hz && !L.ys.length) return wrong(cp + 'asy-noh', 'The vertical asymptote is right. A reciprocal function also has the horizontal asymptote ' + t('y=0') + ': list it too.');
      if (T.xs.length && L.xs.length === T.xs.length && sameSet(L.xs, T.xs.map(function (x) { return -x; }))) return wrong(cp + 'asy-sign', 'Check the sign: the vertical asymptote is where ' + t('f(x)=0') + '. Solve that equation.');
      if (!T.xs.length && L.xs.length) return wrong(cp + 'asy-extra', t('f') + ' has no zeros, so ' + t('\\frac{1}{f(x)}') + ' is defined everywhere: no vertical asymptotes.');
      return wrong('value', null);
    };
  }
  function asyT(xs, hz) { var a = xs.map(function (x) { return 'x=' + (x.tex || rt(x)); }); if (hz) a.push('y=0'); return a.length ? a.join(',\\ ') : '\\text{none}'; }
  function asyPart(cp, prompt, T, o, sol, hints, text) {
    o = o || {};
    var keyTex = asyT(T.xsT || T.xs, T.hz), part = KP.math(prompt, asyCheck(cp, T, o), keyTex, sol, hints, text, { keys: 'u7asy', placeholder: T.hz ? 'e.g. x = 3, y = 0' : 'e.g. x = 3, x = -1   (or: none)' });
    var bad = (o.wrongs || []).map(function (w) { return asyT(w.xs, T.hz); });
    if (T.hz) bad.push(asyT(T.xs, false));
    if (T.xs.length) bad.push('\\text{none}');
    part.bad = bad.filter(function (b, i, arr) { return arr.indexOf(b) === i && b !== keyTex; });
    return part;
  }

  /* an exact number (fractions, radicals); a rounded decimal near it is a format nudge when exact is asked */
  function valPart(cp, prompt, target, wr, sol, hints, text, o) {
    o = o || {};
    var T = rv(target), W = (wr || []).filter(function (w) { return Math.abs(rv(w.v) - T) > 1e-9; });
    var base = K.value(Array.isArray(target) ? target : T, { diag: function (v) { for (var i = 0; i < W.length; i++) if (Math.abs(v - rv(W[i].v)) < 1e-9 * Math.max(1, Math.abs(v))) return { code: W[i].code, hint: W[i].hint }; return null; } });
    var check = function (resp) { var res = base(resp); if (res.v === 'wrong' && res.code === 'value' && o.exact !== false) { var a = K.read(resp); if (!a.res && /\d\.\d/.test(String(resp)) && Math.abs(a.val - T) < 0.006 && Math.abs(a.val - T) > 1e-9) return form(cp + 'exact', 'That is a rounded decimal. Give the <b>exact</b> value.'); } return res; };
    var keyTex = o.keyTex || rt(target);
    var part = KP.math(prompt, check, keyTex, sol, hints, text, { keys: o.keys || 'fraction', before: o.before, after: o.after });
    part.bad = W.map(function (w) { return w.tex || rt(w.v); }).filter(function (b, i, arr) { return arr.indexOf(b) === i && b !== keyTex; });
    return part;
  }
  function pointChk(cp, target, wr) {
    var T = [rv(target[0]), rv(target[1])], W = (wr || []).filter(function (w) { return !(Math.abs(rv(w.p[0]) - T[0]) < 1e-9 && Math.abs(rv(w.p[1]) - T[1]) < 1e-9); });
    return { W: W, check: K.point(target.map(function (c) { return Array.isArray(c) ? c : toR(c) || c; }), { wrong: W.map(function (w) { return { is: w.p.map(function (c) { return toR(c) || c; }), code: w.code, hint: w.hint }; }), noBrackets: false }) };
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

  /* ======================================================================================================
   * AN1 — the absolute value of real numbers (Lesson 1)
   * ====================================================================================================== */
  var B = {};
  B.evalAbs = function (r, cp, o) {
    o = o || {};
    var kind = r.pick(o.kinds || ['k', 'minus', 'nest', 'sq', 'prod']), e, val, wr = [], steps;
    if (kind === 'k') {
      var s = pickWhere(function () { return { k: r.int(2, 5), a: r.int(-9, 8), b: r.int(2, 12), c: nz(r, 2, 12), sg: r.pick([1, -1]) }; }, function (z) { return z.a - z.b < 0 && z.a !== 0 && z.c < 0 || (z.a - z.b < 0 && z.a !== 0 && r.chance(0.3)); });
      e = s.k + A(s.a + '-' + s.b) + (s.sg > 0 ? '+' : '-') + A(s.c); val = s.k * Math.abs(s.a - s.b) + s.sg * Math.abs(s.c);
      wr.push({ v: s.k * (s.a - s.b) + s.sg * s.c, code: cp + 'abs-bracket', hint: 'Simplify inside the bars, then take the absolute value: ' + t(A(s.a - s.b) + '=' + Math.abs(s.a - s.b)) + '. The bars make a value non-negative.' });
      steps = t(s.k + A(s.a - s.b) + (s.sg > 0 ? '+' : '-') + A(s.c) + '=' + s.k + '(' + Math.abs(s.a - s.b) + ')' + (s.sg > 0 ? '+' : '-') + Math.abs(s.c) + '=' + val);
    } else if (kind === 'minus') {
      var m = r.int(2, 12), a = r.int(-8, 6), b = pickWhere(function () { return r.int(-6, 12); }, function (x) { return x !== a && a - x < 0; });
      e = '-' + A('-' + m) + '+' + A(a + sgT(-b)); val = -m + Math.abs(a - b);
      wr.push({ v: m + Math.abs(a - b), code: cp + 'abs-minus', hint: 'The negative sign is <b>outside</b> the bars: ' + t('-' + A('-' + m) + '=-(' + m + ')=-' + m) + '.' });
      wr.push({ v: m + (a - b), code: cp + 'abs-bracket', hint: 'Absolute value bars are not brackets: ' + t(A(a - b) + '=' + Math.abs(a - b)) + ', and ' + t('-' + A('-' + m) + '=-' + m) + '.' });
      steps = t('-' + A('-' + m) + '+' + A(a - b) + '=-' + m + '+' + Math.abs(a - b) + '=' + val);
    } else if (kind === 'nest') {
      var s2 = pickWhere(function () { return { a: nz(r, 2, 9), b: nz(r, 3, 15) }; }, function (z) { return Math.abs(z.a) < Math.abs(z.b) && z.a * z.b < 0; });
      e = '\\bigl\\lvert\\,' + A(s2.a) + '-' + A(s2.b) + '\\,\\bigr\\rvert '; val = Math.abs(Math.abs(s2.a) - Math.abs(s2.b));
      wr.push({ v: Math.abs(s2.a) - Math.abs(s2.b), code: cp + 'abs-bracket', hint: 'Work from the inside out: ' + t(A(s2.a) + '-' + A(s2.b) + '=' + (Math.abs(s2.a) - Math.abs(s2.b))) + ', and then the outer bars make it positive.' });
      wr.push({ v: Math.abs(s2.a - s2.b), code: cp + 'abs-split', hint: 'Take each inner absolute value first: ' + t(A(s2.a) + '=' + Math.abs(s2.a)) + ' and ' + t(A(s2.b) + '=' + Math.abs(s2.b)) + '. Bars cannot be merged over a difference.' });
      steps = t('\\bigl\\lvert\\,' + A(s2.a) + '-' + A(s2.b) + '\\,\\bigr\\rvert=' + A(Math.abs(s2.a) + '-' + Math.abs(s2.b)) + '=' + A(Math.abs(s2.a) - Math.abs(s2.b)) + '=' + val);
    } else if (kind === 'sq') {
      var k = r.int(2, 4), a3 = r.int(-3, 4), b3 = pickWhere(function () { return r.int(2, 9); }, function (x) { return a3 - x < 0; }), c3 = r.int(2, 4);
      e = '-' + k + A(a3 + '-' + b3) + '+' + A('-' + c3) + '^{2}'; val = -k * Math.abs(a3 - b3) + c3 * c3;
      wr.push({ v: k * Math.abs(a3 - b3) + c3 * c3, code: cp + 'abs-minus', hint: 'The ' + t('-' + k) + ' multiplies the absolute value, so that term is negative: ' + t('-' + k + A(a3 - b3) + '=-' + k * Math.abs(a3 - b3)) + '.' });
      wr.push({ v: -k * (a3 - b3) + c3 * c3, code: cp + 'abs-bracket', hint: 'Take the absolute value inside the first bars: ' + t(A(a3 - b3) + '=' + Math.abs(a3 - b3)) + '.' });
      steps = t('-' + k + A(a3 - b3) + '+' + c3 + '^{2}=-' + k + '(' + Math.abs(a3 - b3) + ')+' + c3 * c3 + '=' + val);
    } else if (kind === 'prod') {
      var s4 = pickWhere(function () { return { a: r.int(2, 7), b: r.int(2, 7), c: r.int(1, 15) }; }, function (z) { return -z.a * z.b + z.c < 0; });
      e = A('(-' + s4.a + ')(' + s4.b + ')+' + s4.c); val = Math.abs(-s4.a * s4.b + s4.c);
      wr.push({ v: -s4.a * s4.b + s4.c, code: cp + 'abs-bracket', hint: 'You simplified inside the bars correctly. Now take the absolute value: it is never negative.' });
      wr.push({ v: s4.a * s4.b + s4.c, code: cp + 'abs-split', hint: 'Simplify inside the bars first: ' + t('(-' + s4.a + ')(' + s4.b + ')+' + s4.c + '=' + (-s4.a * s4.b + s4.c)) + ', then take the absolute value.' });
      steps = t(A(-s4.a * s4.b + '+' + s4.c) + '=' + A(-s4.a * s4.b + s4.c) + '=' + val);
    } else { // roots
      var n = r.int(2, 6), p2 = r.int(2, 6), q2 = pickWhere(function () { return r.int(3, 12); }, function (x) { return x > p2; });
      e = A('\\sqrt[3]{-' + n * n * n + '}') + '-' + A('\\sqrt{' + p2 * p2 + '}-\\sqrt{' + q2 * q2 + '}'); val = n - (q2 - p2);
      wr.push({ v: -n - (p2 - q2), code: cp + 'abs-bracket', hint: t('\\sqrt[3]{-' + n * n * n + '}=-' + n) + ', and its absolute value is ' + t(n) + '; likewise ' + t(A(p2 + '-' + q2) + '=' + (q2 - p2)) + '.' });
      wr.push({ v: n + (q2 - p2), code: cp + 'abs-minus', hint: 'The second absolute value is subtracted: ' + t('-' + A(p2 - q2) + '=-' + (q2 - p2)) + '.' });
      steps = t(A('-' + n) + '-' + A(p2 + '-' + q2) + '=' + n + '-' + (q2 - p2) + '=' + val);
    }
    var W = wr.filter(function (w) { return w.v !== val; });
    var p = KP.number('Evaluate ' + t(e) + '.', val, function (v) { for (var i = 0; i < W.length; i++) if (v === W[i].v) return { code: W[i].code, hint: W[i].hint }; return null; },
      'Simplify inside each pair of bars, take the absolute value, then finish with the order of operations:<br>' + steps + '.',
      ['Absolute value bars are grouping symbols: simplify inside them first, then take the absolute value.', 'A negative sign outside the bars stays: ' + t('-\\lvert -6\\rvert=-6') + '.'], 'evaluating absolute values');
    p.bad = W.map(function (w) { return String(w.v); });
    return p;
  };

  /* an expression with absolute values evaluated for given values (L1 Ex 3e–h, #4) */
  B.evalVar = function (r, cp) {
    var kind = r.pick(['lin', 'diff', 'sq', 'neg', 'frac', 'two']), a = -r.int(2, 6), e, val, wr = [], sub, at;
    if (kind === 'lin') {
      var s = pickWhere(function () { return { m: nz(r, 2, 5), n: r.int(-9, 9) }; }, function (z) { return z.m * a + z.n < 0 && z.n !== 0; });
      e = A(tx(lin(s.m, s.n))); val = Math.abs(s.m * a + s.n); sub = A(s.m + '(' + a + ')' + sgT(s.n)) + '=' + A(s.m * a + s.n);
      wr.push({ v: s.m * a + s.n, code: cp + 'abs-bracket', hint: 'You found the value inside the bars. Now take its absolute value.' });
    } else if (kind === 'diff') {
      var n = r.int(2, 8); e = A('x') + '-' + A('x-' + n); val = Math.abs(a) - Math.abs(a - n); sub = A(a) + '-' + A(a - n);
      wr.push({ v: n, code: cp + 'abs-bracket', hint: 'Evaluate each absolute value separately: ' + t(A(a) + '=' + Math.abs(a)) + ' and ' + t(A(a - n) + '=' + Math.abs(a - n)) + '.' });
      wr.push({ v: Math.abs(a) + Math.abs(a - n), code: cp + 'abs-minus', hint: 'The second absolute value is subtracted.' });
    } else if (kind === 'sq') {
      var n2 = pickWhere(function () { return r.int(5, 40); }, function (x) { return a * a - x < 0; }); e = A('x^{2}-' + n2); val = n2 - a * a; sub = A(a * a + '-' + n2);
      wr.push({ v: a * a - n2, code: cp + 'abs-bracket', hint: 'You found the value inside the bars. Now take its absolute value.' });
      wr.push({ v: Math.abs(-a * a - n2), code: cp + 'abs-split', hint: t('(' + a + ')^{2}=' + a * a) + ': a negative number squared is positive.' });
    } else if (kind === 'neg') {
      var k = r.int(2, 5), n3 = pickWhere(function () { return r.int(-4, 4); }, function (x) { return a + x < 0 && x !== 0; }); e = '-' + k + A(tx(lin(1, n3))); val = -k * Math.abs(a + n3); sub = '-' + k + A(a + sgT(n3));
      wr.push({ v: k * Math.abs(a + n3), code: cp + 'abs-minus', hint: 'The ' + t('-' + k) + ' is outside the bars, so the answer is negative.' });
      wr.push({ v: -k * (a + n3), code: cp + 'abs-bracket', hint: 'Take the absolute value of ' + t(a + n3) + ' before multiplying by ' + t('-' + k) + '.' });
    } else if (kind === 'frac') {
      var b = pickWhere(function () { return r.int(1, 9); }, function (x) { return a + x !== 0 && gcd(a + x, a) !== Math.abs(a); }); e = '\\dfrac{' + A('x+y') + '}{x}'; val = [Math.abs(a + b), a]; sub = '\\frac{' + A(a + '+' + b) + '}{' + a + '}=\\frac{' + Math.abs(a + b) + '}{' + a + '}';
      wr.push({ v: [Math.abs(a + b), -a], code: cp + 'abs-minus', hint: 'Only the numerator is inside the bars; the denominator ' + t(a) + ' stays negative.' });
      wr.push({ v: [a + b, a], code: cp + 'abs-bracket', hint: 'Take the absolute value of the numerator: ' + t(A(a + b) + '=' + Math.abs(a + b)) + '.' });
      at = t('x=' + a) + ' and ' + t('y=' + b);
    } else {
      a = -r.int(2, 4); var kk = r.int(3, 5), b2 = pickWhere(function () { return r.int(2, 9); }, function (x) { return a * a - kk * x < 0; }); e = A('x^{2}-' + kk + 'y'); val = kk * b2 - a * a; sub = A(a * a + '-' + kk * b2);
      wr.push({ v: a * a - kk * b2, code: cp + 'abs-bracket', hint: 'You found the value inside the bars. Now take its absolute value.' });
      at = t('x=' + a) + ' and ' + t('y=' + b2);
    }
    return valPart(cp, 'Evaluate ' + t(e) + ' for ' + (at || t('x=' + a)) + '.', val, wr, 'Substitute, simplify inside the bars, take the absolute value, then finish: ' + t(sub + '=' + rt(val)) + '.',
      ['Substitute in brackets: ' + t('x=(' + a + ')') + '.', 'Simplify inside the bars before taking the absolute value; anything outside the bars (a sign, a coefficient, a denominator) is applied afterwards.'], 'evaluating with absolute values', { exact: false });
  };

  /* the distance between two numbers (L1 Ex 5, #8, EP01 A2) */
  B.distance = function (r, cp, o) {
    o = o || {};
    var kind = r.pick(o.kinds || ['int', 'dec', 'frac', 'rad']), a, b, aT, bT, val, wr = [], valT, sol;
    if (kind === 'int') {
      a = -r.int(3, 18); b = r.chance(0.7) ? r.int(2, 16) : -r.int(1, 2) + a + -r.int(2, 9) * -1; if (b === a) b = a + 7;
      aT = String(a); bT = String(b); val = Math.abs(a - b); valT = String(val);
      wr.push({ v: a - b, code: cp + 'dist-neg', hint: 'A distance is never negative: take the absolute value of the difference.' });
      wr.push({ v: Math.abs(Math.abs(a) - Math.abs(b)), code: cp + 'dist-sub', hint: 'Subtract the numbers themselves (with their signs), then take the absolute value: ' + t(A(a + sgT(-b))) + '.' });
      sol = t(A(aT + '-' + (b < 0 ? '(' + b + ')' : b)) + '=' + A(a - b) + '=' + val);
    } else if (kind === 'dec') {
      var A1 = -r.pick([r.int(11, 95) * 10, r.int(3, 39) * 25]), B1 = r.chance(0.6) ? r.int(5, 60) * 10 : -r.int(2, 20) * 25; if (A1 === B1) B1 += 130;
      a = A1 / 100; b = B1 / 100; aT = dt(a); bT = dt(b); val = Math.abs(A1 - B1) / 100; valT = dt(val);
      wr.push({ v: (A1 - B1) / 100, code: cp + 'dist-neg', hint: 'A distance is never negative: take the absolute value of the difference.' });
      wr.push({ v: Math.abs(Math.abs(A1) - Math.abs(B1)) / 100, code: cp + 'dist-sub', hint: 'Subtract the numbers themselves (with their signs), then take the absolute value.' });
      sol = t(A(aT + '-' + (b < 0 ? '(' + bT + ')' : bT)) + '=' + A(dt((A1 - B1) / 100)) + '=' + valT);
    } else if (kind === 'frac') {
      var s = pickWhere(function () { return { p1: r.int(1, 7), q1: r.pick([2, 3, 4, 5, 6]), p2: r.int(1, 9), q2: r.pick([2, 3, 4, 5, 6]) }; }, function (z) { return gcd(z.p1, z.q1) === 1 && gcd(z.p2, z.q2) === 1 && z.q1 !== z.q2 && z.q1 > 1 && z.q2 > 1; });
      a = [-s.p1, s.q1]; b = [s.p2, s.q2]; aT = rt(a); bT = rt(b); val = ex.norm(s.p2 * s.q1 + s.p1 * s.q2, s.q1 * s.q2); valT = rt(val);
      wr.push({ v: ex.norm(-(s.p2 * s.q1 + s.p1 * s.q2), s.q1 * s.q2), code: cp + 'dist-neg', hint: 'A distance is never negative: take the absolute value of the difference.' });
      wr.push({ v: ex.norm(Math.abs(s.p2 * s.q1 - s.p1 * s.q2), s.q1 * s.q2), code: cp + 'dist-sub', hint: 'Subtract with the signs: ' + t(aT + '-' + bT) + '. Subtracting a positive from a negative moves further from 0.' });
      sol = t(A(aT + '-' + bT) + '=' + A(rt(ex.norm(-(s.p2 * s.q1 + s.p1 * s.q2), s.q1 * s.q2))) + '=' + valT);
    } else {
      var n = r.pick([2, 3, 5, 6, 7]), k = r.int(1, 5), m = r.int(1, 4), entire = r.chance(0.5) && m > 1;
      a = k * Math.sqrt(n); b = -m * Math.sqrt(n); aT = (k === 1 ? '' : k) + '\\sqrt{' + n + '}'; bT = entire ? '-\\sqrt{' + m * m * n + '}' : '-' + (m === 1 ? '' : m) + '\\sqrt{' + n + '}';
      val = (k + m) * Math.sqrt(n); valT = (k + m) + '\\sqrt{' + n + '}';
      if (k !== m) wr.push({ v: Math.abs(k - m) * Math.sqrt(n), tex: (Math.abs(k - m) === 1 ? '' : Math.abs(k - m)) + '\\sqrt{' + n + '}', code: cp + 'dist-sub', hint: 'Subtract with the signs: ' + t(aT + '-(' + bT + ')') + ' adds the two sizes.' });
      wr.push({ v: -(k + m) * Math.sqrt(n), tex: '-' + valT, code: cp + 'dist-neg', hint: 'A distance is never negative: take the absolute value of the difference.' });
      sol = (entire ? t(bT + '=-' + (m === 1 ? '' : m) + '\\sqrt{' + n + '}') + '. ' : '') + t(A(aT + '-(' + (entire ? '-' + m + '\\sqrt{' + n + '}' : bT) + ')') + '=' + A(valT) + '=' + valT);
    }
    return valPart(cp, 'Determine the distance between ' + t(aT) + ' and ' + t(bT) + ' on a number line. Give an exact answer.', val, wr, 'The distance between ' + t('a') + ' and ' + t('b') + ' is ' + t('|a-b|') + ':<br>' + sol + '.',
      ['The distance between two numbers is the absolute value of their difference, ' + t('|a-b|') + ' (either order).', 'Keep the signs when you subtract; a distance is never negative.'], 'distance between two numbers', { keyTex: valT, keys: kind === 'rad' ? 'radical' : 'fraction' });
  };

  /* order expressions with absolute values (L1 Ex 4, #5, EP01 A3) */
  B.order = function (r, cp) {
    var c = r.int(3, 5);
    function item(kind) {
      if (kind === 'dec') { var d = (c * 10 + r.int(-6, 6)) / 10; return { tex: A('-' + dt(d)), val: d, why: t(A('-' + dt(d)) + '=' + dt(d)) }; }
      if (kind === 'negabs') { var n = r.int(1, c + 1); return { tex: '-' + A('-' + n), val: -n, why: t('-' + A('-' + n) + '=-' + n) }; }
      if (kind === 'diff') { var m = r.int(-3, 3), w = c + r.int(0, 1); return { tex: A(m + '-' + (m + w)), val: w, why: t(A(m - (m + w)) + '=' + w) }; }
      if (kind === 'root') { var k = pickWhere(function () { return r.int((c - 1) * (c - 1) + 1, (c + 1) * (c + 1) - 1); }, function (x) { return !isSq(x); }); return { tex: A('-\\sqrt{' + k + '}'), val: Math.sqrt(k), why: t(A('-\\sqrt{' + k + '}') + '=\\sqrt{' + k + '}\\approx ' + dt(Math.round(Math.sqrt(k) * 100) / 100)) }; }
      if (kind === 'negdec') { var d2 = r.int(2, 19) / 10; return { tex: '-' + A(dt(d2)), val: -d2, why: t('-' + A(dt(d2)) + '=-' + dt(d2)) }; }
      if (kind === 'frac') { var q = r.pick([3, 6, 7]), p = pickWhere(function () { return c * q + r.int(-q + 1, q - 1); }, function (x) { return gcd(x, q) === 1; }); return { tex: A('-\\dfrac{' + p + '}{' + q + '}'), val: p / q, why: t(A('-\\frac{' + p + '}{' + q + '}') + '=\\frac{' + p + '}{' + q + '}\\approx ' + dt(Math.round(p / q * 100) / 100)) }; }
      var k2 = pickWhere(function () { return r.int(2, 30); }, function (x) { return !isSq(x) && Math.sqrt(x) < c + 2; }), m2 = Math.ceil(Math.sqrt(k2)) + r.int(0, 2); return { tex: A('\\sqrt{' + k2 + '}-' + m2), val: m2 - Math.sqrt(k2), why: t(A('\\sqrt{' + k2 + '}-' + m2) + '=' + m2 + '-\\sqrt{' + k2 + '}\\approx ' + dt(Math.round((m2 - Math.sqrt(k2)) * 100) / 100)) };
    }
    var items = pickWhere(function () { return r.shuffle(['dec', 'negabs', 'diff', 'root', 'negdec', 'frac', 'rdiff']).slice(0, 5).map(item); }, function (L) { var v = L.map(function (x) { return x.val; }).sort(function (x, y) { return x - y; }); for (var i = 1; i < v.length; i++) if (v[i] - v[i - 1] < 0.05) return false; return L.filter(function (x) { return x.val > 0; }).length >= 3; });
    items.sort(function (x, y) { return x.val - y.val; }); items.forEach(function (x, i) { x.id = 'e' + i; });
    var p = KP.order(r, 'Arrange in order from least to greatest.', items, { first: 'least', last: 'greatest' },
      'Evaluate each one: ' + items.map(function (x) { return x.why; }).join(', ') + '.<br>Least to greatest: ' + items.map(function (x) { return t(x.tex); }).join(' &lt; ') + '.',
      ['Evaluate each expression first (a decimal approximation is fine for ordering).', 'A negative sign outside the bars makes the value negative: ' + t('-\\lvert -5\\rvert=-5') + '.'], 'ordering absolute values');
    p.bad = [items.map(function (x) { return x.id; }).reverse()];
    return p;
  };

  /* net change and total distance (L1 Ex 7b, #10, EP01 B1) */
  B.trip = function (r, cp) {
    var kind = r.pick(['lift', 'stock']), fields, keys, vals, sol, prompt, unit;
    if (kind === 'lift') {
      var s = pickWhere(function () { return { f0: r.int(6, 18), ch: [r.int(3, 12), -r.int(5, 15), r.int(2, 9), -r.int(3, 12)].map(function (x, i) { return i % 2 ? x : x; }) }; }, function (z) { var f = z.f0; for (var i = 0; i < 4; i++) { f += z.ch[i]; if (f < 1) return false; } return f !== z.f0; });
      s.ch = r.shuffle(s.ch); var fin = s.f0, ok1 = true; s.ch.forEach(function (c) { fin += c; if (fin < 1) ok1 = false; }); if (!ok1) s.ch.sort(function (x, y) { return y - x; });
      fin = s.f0 + s.ch.reduce(function (x, y) { return x + y; }, 0);
      var tot = s.ch.reduce(function (x, y) { return x + Math.abs(y); }, 0), net = fin - s.f0;
      prompt = 'An elevator starts on floor ' + t(s.f0) + '. Its next four trips are ' + s.ch.map(function (c) { return t((c > 0 ? '+' : '') + c); }).join(', ') + ' floors (up is positive). On which floor does it finish, and how many floors does it travel in all?';
      fields = [{ label: 'It finishes on floor', mode: 'math', keys: 'fraction' }, { label: 'Floors travelled in all', mode: 'math', keys: 'fraction' }];
      vals = [fin, tot]; keys = [String(fin), String(tot)];
      sol = 'Net change: ' + t(s.ch.map(function (c, i) { return (i && c > 0 ? '+' : '') + c; }).join('') + '=' + net) + ', so it finishes on floor ' + t(s.f0 + sgT(net) + '=' + fin) + '.<br>Total distance: ' + t(s.ch.map(function (c) { return A(c); }).join('+') + '=' + tot) + ' floors (the net change keeps the signs; the total adds the absolute values).';
      var wrongFin = s.f0 - net, wrongTot = Math.abs(net);
      var bad = [[String(fin), String(wrongTot)], [String(wrongFin), String(tot)]];
      return fieldsPart(prompt, fields, [K.value(fin), K.value(tot)], keys, 'floor ' + t(fin) + '; ' + t(tot) + ' floors', sol,
        ['The final floor uses the <b>net</b> change: add the trips with their signs.', 'The total distance adds the <b>sizes</b> of the trips: their absolute values.'], 'net change and total distance', bad,
        function (resp) {
          var a = numVal(resp[0]), b = numVal(resp[1]); if (a == null || b == null) return null;
          if (a === fin && b === wrongTot && wrongTot !== tot) return wrong(cp + 'net-total', 'The final floor is right. For the total distance, add the absolute values of the trips: going down counts as distance too.');
          if (a === wrongFin && wrongFin !== fin) return wrong(cp + 'net-sign', 'Add the trips to the starting floor with their signs: down trips are negative.');
          if (a === tot && b === fin) return wrong(cp + 'net-total', 'Your answers are in each other’s boxes.');
          return null;
        });
    }
    var ch = pickWhere(function () { return [r.int(5, 160), -r.int(20, 220), -r.int(5, 120), r.int(5, 90), r.int(20, 180)]; }, function (c) { var n = c.reduce(function (x, y) { return x + y; }, 0); return n !== 0 && Math.abs(n) >= 5; });
    ch = r.shuffle(ch);
    var netC = ch.reduce(function (x, y) { return x + y; }, 0), totC = ch.reduce(function (x, y) { return x + Math.abs(y); }, 0);
    function money(cents) { return (cents < 0 ? '-' : '') + '\\$' + (Math.abs(cents) / 100).toFixed(2); }
    prompt = 'A stock’s closing price changed by ' + ch.map(function (c) { return t((c > 0 ? '+' : '') + money(c)); }).join(', ') + ' over five days. Determine the net change in the price and the total amount the price moved (up or down), in dollars.';
    fields = [{ label: 'Net change ($)', mode: 'math', keys: 'fraction' }, { label: 'Total movement ($)', mode: 'math', keys: 'fraction' }];
    keys = [(netC / 100).toFixed(2), (totC / 100).toFixed(2)];
    sol = 'Net change: add the changes with their signs: ' + t(money(netC)) + ' (' + (netC > 0 ? 'up' : 'down') + ').<br>Total movement: add their absolute values: ' + t(money(totC)) + '.';
    return fieldsPart(prompt, fields, [K.value(netC / 100), K.value(totC / 100)], keys, 'net ' + t(money(netC)) + '; total ' + t(money(totC)), sol,
      ['The net change keeps the signs.', 'The total movement adds the sizes of the changes (their absolute values).'], 'net change and total movement', [[keys[0], (Math.abs(netC) / 100).toFixed(2)], [keys[1], keys[0]]],
      function (resp) {
        var a = numVal(resp[0]), b = numVal(resp[1]); if (a == null || b == null) return null;
        if (Math.abs(a - totC / 100) < 1e-9 && Math.abs(b - netC / 100) < 1e-9) return wrong(cp + 'net-total', 'Your answers are in each other’s boxes.');
        if (Math.abs(a - netC / 100) < 1e-9 && Math.abs(b - Math.abs(netC) / 100) < 1e-9 && Math.abs(netC) !== totC) return wrong(cp + 'net-total', 'The net change is right. The total movement adds the absolute values of the changes: a drop counts as movement too.');
        return null;
      });
  };

  /* simplify without absolute value symbols (L1 #13, EP01 B3, C1–C3) */
  B.simplify = function (r, cp, o) {
    o = o || {};
    var kind = r.pick(o.kinds || ['lin', 'two', 'two', 'ab']);
    if (kind === 'ab') {
      var s = pickWhere(function () { return { m: r.int(3, 19) / 2, n: r.int(8, 25) / 2 }; }, function (z) { return z.n > z.m + 1 && (z.m % 1 || z.n % 1); });
      var b = s.n - s.m, other = -s.m - s.n;
      return valPart(cp, 'The numbers ' + t('a') + ' and ' + t('b') + ' satisfy ' + t('a<0<b') + ', ' + t('|a|=' + dt(s.m)) + ' and ' + t('|a-b|=' + dt(s.n)) + '. Determine ' + t('b') + '.', b,
        [{ v: other, code: cp + 'ab-other', hint: 'That number is ' + t(dt(s.n)) + ' units from ' + t('a') + ', but it is negative, and ' + t('b>0') + '.' }, { v: -s.m, code: cp + 'ab-a', hint: 'That is ' + t('a') + '. Now find the number ' + t(dt(s.n)) + ' units from it.' }, { v: s.n, code: cp + 'simp-case', hint: t('|a-b|') + ' is the distance between ' + t('a') + ' and ' + t('b') + ', not ' + t('b') + ' itself.' }],
        t('a<0') + ' and ' + t('|a|=' + dt(s.m)) + ', so ' + t('a=-' + dt(s.m)) + '.<br>' + t('b') + ' is ' + t(dt(s.n)) + ' units from ' + t('-' + dt(s.m)) + ': ' + t('b=' + dt(b)) + ' or ' + t('b=' + dt(other)) + '. Since ' + t('b>0') + ', ' + t('b=' + dt(b)) + '.',
        ['A negative number with absolute value ' + t(dt(s.m)) + ' is ' + t('-' + dt(s.m)) + '.', t('|a-b|') + ' is the distance between ' + t('a') + ' and ' + t('b') + ': there are two numbers at that distance from ' + t('a') + '.'], 'a and b from absolute values', { exact: false, keyTex: dt(b) });
    }
    var target, prompt, wr = [], sol;
    if (kind === 'lin') {
      var form1 = r.pick(['mx-abs', 'abs+mx', 'kx/x', 'sqrt', 'half']), m = nz(r, 2, 6), k = r.int(2, 6);
      if (form1 === 'mx-abs') { prompt = t(m + 'x-|x|'); target = M(m + 1, 1); wr.push({ is: M(m - 1, 1), code: cp + 'simp-sign', hint: 'For ' + t('x<0') + ', ' + t('|x|=-x') + ', so ' + t('-|x|=+x') + '.' }); sol = t('x<0') + ', so ' + t('|x|=-x') + ': ' + t(m + 'x-(-x)=' + tx(target)); }
      else if (form1 === 'abs+mx') { prompt = t('|x|' + sgT(m) + 'x'); target = M(m - 1, 1); wr.push({ is: M(m + 1, 1), code: cp + 'simp-sign', hint: 'For ' + t('x<0') + ', ' + t('|x|=-x') + '.' }); sol = t('x<0') + ', so ' + t('|x|=-x') + ': ' + t('-x' + sgT(m) + 'x=' + tx(target)); }
      else if (form1 === 'kx/x') { prompt = t('\\dfrac{|' + k + 'x|}{x}'); target = P.num(-k); wr.push({ is: P.num(k), code: cp + 'simp-sign', hint: 'For ' + t('x<0') + ', ' + t('|' + k + 'x|=' + k + '|x|=-' + k + 'x') + '.' }); sol = t('|' + k + 'x|=' + k + '|x|=-' + k + 'x') + ' for ' + t('x<0') + ': ' + t('\\frac{-' + k + 'x}{x}=-' + k); }
      else if (form1 === 'sqrt') { prompt = t('\\sqrt{x^{2}}' + sgT(m) + 'x'); target = M(m - 1, 1); wr.push({ is: M(m + 1, 1), code: cp + 'simp-sign', hint: t('\\sqrt{x^{2}}=|x|') + ', and for ' + t('x<0') + ' that is ' + t('-x') + '.' }); sol = t('\\sqrt{x^{2}}=|x|=-x') + ' for ' + t('x<0') + ': ' + t('-x' + sgT(m) + 'x=' + tx(target)); }
      else { prompt = t('\\dfrac{x+|x|}{2}'); target = P.num(0); wr.push({ is: P.parse('x'), code: cp + 'simp-sign', hint: 'For ' + t('x<0') + ', ' + t('|x|=-x') + ', so the numerator is ' + t('x+(-x)') + '.' }); sol = t('\\frac{x+(-x)}{2}=0') + ' for ' + t('x<0'); }
      prompt = 'Simplify ' + prompt + ' for ' + t('x<0') + ', without absolute value symbols.';
      return withBad(KP.poly(prompt, target, { wrong: wr }, sol + '.', ['Use the definition: for ' + t('x<0') + ', ' + t('|x|=-x') + ' (a positive number).', 'Replace each absolute value, then collect like terms.'], 'simplifying without absolute value'), wr);
    }
    var s2 = pickWhere(function () { return { a: r.int(-6, 3), w: r.int(2, 8) }; }, function (z) { return z.a !== 0 && z.a + z.w !== 0; }), a = s2.a, b = s2.a + s2.w, iv = r.pick(['lo', 'mid', 'hi']);
    var E = { lo: P.add(M(-2, 1), M(a + b, 0)), mid: P.num(b - a), hi: P.add(M(2, 1), M(-a - b, 0)) };
    target = E[iv];
    var ivT = { lo: t('x<' + a), mid: t(a + '\\le x\\le ' + b), hi: t('x>' + b) };
    ['lo', 'mid', 'hi'].forEach(function (k2) { if (k2 !== iv) wr.push({ is: E[k2], code: cp + 'simp-case', hint: 'That is the simplified form on a different interval. On ' + ivT[iv] + ', check the sign of each expression inside the bars.' }); });
    if (iv === 'mid') wr.push({ is: P.add(M(2, 1), M(-a - b, 0)), code: cp + 'simp-sign', hint: 'On this interval ' + t(tx(lin(1, -b))) + ' is negative, so ' + t(A(tx(lin(1, -b))) + '=-(' + tx(lin(1, -b)) + ')') + '.' });
    var e1 = tx(lin(1, -a)), e2 = tx(lin(1, -b));
    var signs = { lo: ['-', '-'], mid: ['+', '-'], hi: ['+', '+'] }[iv];
    sol = 'On ' + ivT[iv] + ': ' + t(e1) + (signs[0] === '+' ? ' \\(\\ge 0\\)' : ' \\(<0\\)') + ' and ' + t(e2) + (signs[1] === '+' ? ' \\(>0\\)' : ' \\(\\le 0\\)') + '.<br>' + t(A(e1) + '+' + A(e2) + '=' + (signs[0] === '+' ? '(' + e1 + ')' : '-(' + e1 + ')') + (signs[1] === '+' ? '+(' + e2 + ')' : '-(' + e2 + ')') + '=' + tx(target));
    var p = KP.poly('Simplify ' + t(A(e1) + '+' + A(e2)) + ' without absolute value symbols when ' + ivT[iv] + '.', target, { wrong: wr }, sol + '.',
      ['On the interval, decide whether each expression inside the bars is positive or negative (test a value of ' + t('x') + ' in it).', 'Replace ' + t('|A|') + ' by ' + t('A') + ' if ' + t('A\\ge 0') + ' and by ' + t('-A') + ' if ' + t('A<0') + ', then collect like terms.'], 'simplifying without absolute value');
    return withBad(p, wr);
  };
  function withBad(p, wr) { p.bad = (wr || []).map(function (w) { return tx(w.is); }).filter(function (b, i, arr) { return arr.indexOf(b) === i && b !== p.key; }); return p; }

  /* ======================================================================================================
   * RF2 — graphs of y = |f(x)| (Lessons 2–3)
   * ====================================================================================================== */
  /* a line f(x) = ax + b with zero h (integer, or half when a is even), b ≠ 0 */
  function linSpec(r, o) {
    o = o || {};
    return pickWhere(function () { var a = r.pick(o.as || [1, -1, 2, -2, 3, -3, 4, -4, 5, -5, [1, 2], [-1, 2], [1, 3], [-1, 3]]), h = o.hs ? r.pick(o.hs) : r.int(-6, 6) + (r.chance(0.25) ? 0.5 : 0); return { a: toR(a), h: h }; },
      function (z) { var b = -rv(z.a) * z.h; return z.h !== 0 && Math.abs(b - Math.round(b)) < 1e-9 && b !== 0 && Math.abs(b) <= (o.bmax || 15); });
  }
  function linOf(s) { var b = Math.round(-rv(s.a) * s.h); return { a: s.a, b: b, h: s.h, p: lin(s.a, b) }; }

  /* the vertex and the y-intercept of y = |ax + b| (L2 Ex 4, #4) */
  B.linFeat = function (r, cp) {
    var L = linOf(linSpec(r)), cf = rv(L.a) < 0 && r.chance(0.6), f = linT(L.a, L.b, cf), yi = Math.abs(L.b);
    var V = [L.h, 0], vc = pointChk(cp, V, [{ p: [-L.h, 0], code: cp + 'v-sign', hint: 'Solve ' + t(f + '=0') + ' for ' + t('x') + ' carefully: the vertex is at the zero of the line.' }, { p: [0, yi], code: cp + 'v-yint', hint: 'That is the ' + t('y') + '-intercept. The vertex of the V is where the line crosses the ' + t('x') + '-axis: solve ' + t(f + '=0') + '.' }]);
    var yc = K.value(yi, { diag: function (v) { if (v === L.b && L.b < 0) return { code: cp + 'yint-neg', hint: 'At ' + t('x=0') + ', ' + t(A(f) + '=' + A(L.b) + '=' + yi) + ': the graph of ' + t('y=|f(x)|') + ' is never below the ' + t('x') + '-axis.' }; if (Math.abs(v - L.h) < 1e-9) return { code: cp + 'yint-x', hint: 'That is the ' + t('x') + '-coordinate of the vertex. The ' + t('y') + '-intercept is the value at ' + t('x=0') + '.' }; return null; } });
    var fields = [{ label: 'Vertex', mode: 'math', keys: 'u7pts', placeholder: '(x, y)' }, { label: t('y') + '-intercept', name: 'y-intercept', mode: 'math', keys: 'u7pts', placeholder: 'a number' }];
    var bad = [[pt(-L.h, 0), String(yi)], [pt(L.h, 0), String(L.b)]].filter(function (b) { return !(b[0] === pt(L.h, 0) && b[1] === String(yi)); });
    return fieldsPart('For ' + t('y=' + A(f)) + ', state the coordinates of the vertex and the ' + t('y') + '-intercept.', fields, [vc.check, yc], [pt(L.h, 0), String(yi)], 'vertex ' + t(pt(L.h, 0)) + ', ' + t('y') + '-intercept ' + t(yi),
      'Vertex (the zero of the line, an invariant point): ' + t(f + '=0') + ' gives ' + t('x=' + rt(L.h)) + ', so ' + t(pt(L.h, 0)) + '.<br>' + t('y') + '-intercept: ' + t(A(L.b) + '=' + yi) + '.',
      ['The V has its vertex where the line crosses the ' + t('x') + '-axis: solve ' + t(f + '=0') + '.', 'The ' + t('y') + '-intercept of ' + t('y=|ax+b|') + ' is ' + t('|b|') + '.'], 'vertex and y-intercept of y = |ax + b|', bad);
  };

  /* a point on y = f(x) and y = |f(x)| (L2 Ex 6a–b, #9, L3 #13) */
  B.absPoint = function (r, cp) {
    var x = nz(r, 1, 9), y = nz(r, 2, 12);
    if (r.chance(0.6)) {
      if (y > 0 && r.chance(0.7)) y = -y;
      return pointPart(cp, 'The point ' + t(pt(x, y)) + ' is on the graph of ' + t('y=f(x)') + '. State the matching point on the graph of ' + t('y=|f(x)|') + '.', [x, Math.abs(y)],
        [{ p: [x, y], code: cp + 'pt-neg', hint: 'Each ' + t('y') + '-value of ' + t('y=|f(x)|') + ' is the absolute value of the ' + t('y') + '-value of ' + t('f') + ': ' + t(A(y) + '=' + Math.abs(y)) + '.' }, { p: [-x, Math.abs(y)], code: cp + 'pt-xchg', hint: 'The ' + t('x') + '-value does not change: only the ' + t('y') + '-value becomes its absolute value.' }],
        'The ' + t('x') + '-value stays and the ' + t('y') + '-value becomes ' + t(A(y) + '=' + Math.abs(y)) + ': ' + t(pt(x, Math.abs(y))) + (y > 0 ? ' (above the axis, so it does not move)' : '') + '.', ['A point ' + t('(x,\\ y)') + ' on ' + t('y=f(x)') + ' becomes ' + t('(x,\\ |y|)') + '.', 'Points above the ' + t('x') + '-axis do not move; points below it are reflected.'], 'a point on y = |f(x)|');
    }
    y = Math.abs(y);
    return ptsPart(cp, 'The point ' + t(pt(x, y)) + ' is on the graph of ' + t('y=|g(x)|') + '. State the possible points with ' + t('x=' + x) + ' on the graph of ' + t('y=g(x)') + '.', [[x, y], [x, -y]],
      [{ pairs: [[x, y]], code: cp + 'pt-one', hint: 'Both ' + t('g(' + x + ')=' + y) + ' and ' + t('g(' + x + ')=-' + y) + ' give ' + t('|g(' + x + ')|=' + y) + '.' }, { pairs: [[x, -y]], code: cp + 'pt-one', hint: 'Both ' + t('g(' + x + ')=' + y) + ' and ' + t('g(' + x + ')=-' + y) + ' give ' + t('|g(' + x + ')|=' + y) + '.' }, { pairs: [[x, y], [-x, y]], code: cp + 'pt-xchg', hint: 'The ' + t('x') + '-value stays ' + t(x) + '.' }],
      t('|g(' + x + ')|=' + y) + ' means ' + t('g(' + x + ')=' + y) + ' or ' + t('g(' + x + ')=-' + y) + ': the points ' + t(pt(x, y)) + ' and ' + t(pt(x, -y)) + '.', ['Two numbers have absolute value ' + t(y) + '.', 'The ' + t('x') + '-value stays the same.'], 'points on y = g(x) from y = |g(x)|', { noneOk: false, noneHint: 'There are two such points.' });
  };

  /* which graph is y = |f(x)|? (L2 Ex 2, #2, L8 Ex 2) — MC: recognising which part is reflected */
  B.linMatch = function (r, cp) {
    var L = linOf(linSpec(r, { as: [1, -1, 2, -2, [1, 2], [-1, 2]], hs: [-4, -3, -2, -1, 1, 2, 3, 4], bmax: 5 })), a = rv(L.a), b = L.b;
    var f = function (x) { return a * x + b; };
    var gs = {
      ok: mini({ fns: [crv(function (x) { return Math.abs(f(x)); })], aria: 'a V shape with its vertex on the x-axis' }),
      neg: mini({ fns: [crv(function (x) { return -Math.abs(f(x)); })], aria: 'an upside-down V with its vertex on the x-axis' }),
      whole: mini({ fns: [crv(function (x) { return -f(x); })], aria: 'a straight line' }),
      mirror: mini({ fns: [crv(function (x) { return Math.abs(f(-x)); })], aria: 'a V shape with its vertex on the x-axis' })
    };
    var whys = { neg: 'The graph of ' + t('y=|f(x)|') + ' is never below the ' + t('x') + '-axis: keep the part of the line above the axis and reflect the part below it upward.', whole: 'Only the part of the line <b>below</b> the ' + t('x') + '-axis is reflected; the part above it stays.', mirror: 'Check the vertex: it must be the ' + t('x') + '-intercept of ' + t('y=f(x)') + ', ' + t(pt(L.h, 0)) + ', an invariant point.' };
    var opts = ['ok', 'neg', 'whole', 'mirror'].map(function (k) { return { html: gs[k], right: k === 'ok', why: whys[k], code: k }; });
    var p = KP.mc(r, 'The graph of ' + t('y=f(x)') + ' is shown. Which graph is ' + t('y=|f(x)|') + '?' + G({ fns: [crv(f)], max: 260, aria: 'the graph of a line' }), opts,
      'Keep the part of the line on or above the ' + t('x') + '-axis and reflect the part below it in the ' + t('x') + '-axis. The result is a V with its vertex at the ' + t('x') + '-intercept ' + t(pt(L.h, 0)) + ' (the invariant point), never below the axis.',
      ['Points on the ' + t('x') + '-axis do not move.', 'Where ' + t('f(x)<0') + ' the graph is reflected upward; where ' + t('f(x)\\ge 0') + ' it stays.'], 'graph of y = |f(x)| from a line');
    p.input.columns = 2;
    return p;
  };

  /* the piecewise form of y = |ax + b| (L2 Ex 5, #6, L8 #3) */
  B.linPiece = function (r, cp) {
    var L = linOf(linSpec(r, { as: [1, 2, 3, 4, -1, -2, -3, -4, -5, [1, 2], [-1, 2], [1, 3]] })), cf = rv(L.a) < 0 && r.chance(0.7), f = linT(L.a, L.b, cf);
    var pos = rv(L.a) > 0, E1 = pos ? L.p : P.neg(L.p), E2 = P.neg(E1), h = L.h;
    var fields = [{ label: 'The pieces meet at ' + t('x='), name: 'boundary', mode: 'math', keys: 'poly', vars: ['x'] }, { label: 'For ' + t('x\\ge') + ' that value: ' + t('y='), name: 'piece for x ≥', mode: 'math', keys: 'poly', vars: ['x'] }, { label: 'For ' + t('x<') + ' that value: ' + t('y='), name: 'piece for x <', mode: 'math', keys: 'poly', vars: ['x'] }];
    var kChk = K.value(toR(h)), e1Chk = K.poly(E1, { expanded: false }), e2Chk = K.poly(E2, { expanded: false });
    var isE1 = polyIs(E1), isE2 = polyIs(E2);
    var negOne = P.add(M(P.coef(E2, { x: 1 }), 1), P.num(P.constant(E1))); // the opposite of the x term only
    var keys = [rt(h), tx(E1), tx(E2)];
    var combine = function (resp) {
      var k = numVal(resp[0]); if (k == null) return null;
      var kOK = Math.abs(k - h) < 1e-9, s1 = String(resp[1] || ''), s2 = String(resp[2] || '');
      if (!s1.trim() || !s2.trim()) return null;
      if (kOK && isE2(s1) && isE1(s2)) return wrong(cp + 'pw-swap', 'Your two pieces are on the wrong sides. Solve ' + t(f + '\\ge 0') + ' for ' + t('x') + ': ' + (pos ? '' : 'dividing by a negative number reverses the inequality, so ') + 'the expression itself is the piece where ' + t(f + '\\ge 0') + '.');
      if (Math.abs(k + h) < 1e-9 && ((isE1(s1) && isE2(s2)) || (isE2(s1) && isE1(s2)))) return wrong(cp + 'pw-bsign', 'The pieces meet at the zero of ' + t(f) + ': solve ' + t(f + '=0') + ' again (check the sign).');
      if (kOK && isE1(s1) && polyIs(negOne)(s2)) return wrong(cp + 'pw-neg', 'The second piece is the opposite of the <b>whole</b> expression: ' + t('-(' + tx(E1) + ')=' + tx(E2)) + '.');
      if (!kOK && isE1(s1) && isE2(s2)) return wrong(cp + 'pw-bound', 'The pieces are right. They meet where ' + t(f + '=0') + '.');
      return null;
    };
    var bad = [[keys[0], keys[2], keys[1]], [rt(-h), keys[1], keys[2]], [keys[0], keys[1], tx(negOne)]].filter(function (b) { return b.join('|') !== keys.join('|'); });
    if (Math.abs(h) < 1e-9) bad.splice(1, 1);
    var ineq = pos ? t(f + '\\ge 0') + ' gives ' + t('x\\ge ' + rt(h)) : t(f + '\\ge 0') + ' gives ' + t(tx(M(L.a, 1)) + '\\ge ' + rt(-L.b)) + ', so ' + t('x\\le ' + rt(h)) + ' (dividing by a negative reverses the sign)';
    var cases = 'y=\\begin{cases}' + tx(E1) + ', & x\\ge ' + rt(h) + '\\\\ ' + tx(E2) + ', & x<' + rt(h) + '\\end{cases}';
    return fieldsPart('Write ' + t('y=' + A(f)) + ' in piecewise form: give the value of ' + t('x') + ' where the two pieces meet, and the expression for ' + t('y') + ' on each side.', fields, [kChk, e1Chk, e2Chk], keys, t(cases),
      ineq + '. Where ' + t(f + '\\ge 0') + ' the bars change nothing; elsewhere ' + t('y=-(' + f + ')') + '.<br>' + t(cases),
      ['Solve ' + t(f + '\\ge 0') + ' for ' + t('x') + '. Dividing by a negative number reverses the inequality sign.', 'Where the expression inside is negative, the piece is its opposite: change the sign of <b>every</b> term.'], 'piecewise form of y = |ax + b|', bad, combine);
  };

  /* working backwards with a V (L2 Ex 6c, #8, #10, #18) */
  B.linBack = function (r, cp) {
    var kind = r.pick(['slopeVertex', 'through', 'graph']);
    if (kind === 'slopeVertex') {
      var m = nz(r, 2, 5), h = nz(r, 1, 6), yi = Math.abs(-m * h);
      return valPart(cp, 'A line ' + t('y=g(x)') + ' has slope ' + t(m) + ', and the vertex of the graph of ' + t('y=|g(x)|') + ' is ' + t(pt(h, 0)) + '. Determine the ' + t('y') + '-intercept of ' + t('y=|g(x)|') + '.', yi,
        [{ v: -m * h, code: cp + 'yint-neg', hint: 'That is the ' + t('y') + '-intercept of ' + t('g') + '. The graph of ' + t('y=|g(x)|') + ' is never below the axis.' }, { v: h, code: cp + 'yint-x', hint: 'That is the ' + t('x') + '-coordinate of the vertex. Write the line: ' + t('g(x)=' + m + '(x' + sgT(-h) + ')') + ', then find ' + t('|g(0)|') + '.' }],
        'The vertex of ' + t('y=|g(x)|') + ' is the zero of ' + t('g') + ': ' + t('g(x)=' + m + '(x' + sgT(-h) + ')=' + tx(lin(m, -m * h))) + '.<br>' + t('g(0)=' + (-m * h)) + ', so the ' + t('y') + '-intercept of ' + t('y=|g(x)|') + ' is ' + t(A(-m * h) + '=' + yi) + '.',
        ['The vertex of the V is the ' + t('x') + '-intercept of the line: ' + t('g(' + h + ')=0') + '.', 'Write ' + t('g(x)=m(x-h)') + ', then take the absolute value of ' + t('g(0)') + '.'], 'y-intercept of y = |g(x)| from the vertex', { exact: false });
    }
    if (kind === 'through') {
      var s = pickWhere(function () { return { m: nz(r, 2, 4), x1: nz(r, 1, 5), y1: nz(r, 1, 9) }; }, function (z) { var hh = z.x1 - z.y1 / z.m; return hh !== 0 && Math.abs(hh) <= 8 && z.y1 % z.m !== 0 && Math.abs(z.x1 + z.y1 / z.m - hh) > 1e-9; });
      var hh = toR(s.x1 - s.y1 / s.m);
      return valPart(cp, 'A line ' + t('y=f(x)') + ' has slope ' + t(s.m) + ' and passes through ' + t(pt(s.x1, s.y1)) + '. Determine the ' + t('x') + '-coordinate of the point where the graph of ' + t('y=|f(x)|') + ' touches the ' + t('x') + '-axis.', hh,
        [{ v: s.x1 + s.y1 / s.m, code: cp + 'v-sign', hint: 'Solve ' + t('f(x)=0') + ' again: ' + t(s.y1 + sgT(s.m) + '(x' + sgT(-s.x1) + ')=0') + '.' }, { v: s.y1 - s.m * s.x1, code: cp + 'yint-x', hint: 'That is the ' + t('y') + '-intercept of ' + t('f') + '. The graph of ' + t('y=|f(x)|') + ' touches the ' + t('x') + '-axis at the zero of ' + t('f') + '.' }],
        t('f(x)=' + s.y1 + sgT(s.m) + '(x' + sgT(-s.x1) + ')=' + tx(lin(s.m, s.y1 - s.m * s.x1))) + '. The graph of ' + t('y=|f(x)|') + ' touches the axis at the zero of ' + t('f') + ': ' + t(tx(lin(s.m, s.y1 - s.m * s.x1)) + '=0') + ', ' + t('x=' + rt(hh)) + '.',
        ['Write the equation of the line through the point with that slope.', 'The vertex of ' + t('y=|f(x)|') + ' is the zero of ' + t('f') + '.'], 'vertex of y = |f(x)| from a line');
    }
    var g = pickWhere(function () { return { h: r.int(-4, 3), run: r.pick([1, 2, 3]), rise: r.pick([1, 2, 3, 4]) }; }, function (z) { return gcd(z.run, z.rise) === 1 && z.run !== z.rise && z.h + 2 * z.run <= 6 && 2 * z.rise <= 6 && z.h !== 0; });
    var mm = toR([g.rise, g.run]), T = lin(mm, rneg(ex.norm(g.rise * g.h, g.run))), x2 = g.h + 2 * g.run, y2 = 2 * g.rise;
    var svg = G({ fns: [crv(function (x) { return Math.abs(g.rise / g.run * (x - g.h)); })], points: [{ x: g.h, y: 0, label: pt(g.h, 0).replace(/\\ /g, ' ') }, { x: x2, y: y2, label: '(' + x2 + ', ' + y2 + ')' }], max: 280, aria: 'a V-shaped graph with its vertex on the x-axis and a marked point on its right arm' });
    var wr = [{ is: P.neg(T), code: cp + 'back-other', hint: 'That line gives the same V, but its slope is negative. The question asks for the line with a positive slope.' }, { is: lin(toR([g.run, g.rise]), -g.run * g.h / g.rise), code: cp + 'back-slope', hint: 'Slope is rise over run: from ' + t(pt(g.h, 0)) + ' to ' + t(pt(x2, y2)) + ' the rise is ' + t(y2) + ' and the run is ' + t(x2 - g.h) + '.' }];
    var p = KP.poly('The graph of ' + t('y=|f(x)|') + ' is shown, where ' + t('f') + ' is a linear function with a <b>positive</b> slope. Write the equation of ' + t('f(x)') + '.' + svg, T, { wrong: wr, expanded: false },
      'The vertex ' + t(pt(g.h, 0)) + ' is the zero of ' + t('f') + ', and the right arm is part of the line itself (it has the positive slope): slope ' + t('\\frac{' + y2 + '-0}{' + x2 + '-(' + g.h + ')}=' + rt(mm)) + '.<br>' + t('f(x)=' + rt(mm) + '(x' + sgT(-g.h) + ')=' + tx(T)) + '. (Its reflection ' + t('y=' + tx(P.neg(T))) + ' gives the same V.)',
      ['The vertex of the V is the ' + t('x') + '-intercept of the line.', 'The arm with a positive slope is part of the line: find its slope from the two marked points.'], 'a linear f from the graph of y = |f(x)|', { before: 'f(x)=' });
    return withBad(p, wr);
  };

  /* f(x) = a(x − r)(x − s) */
  function quadSpec(r, o) {
    o = o || {};
    return pickWhere(function () { var r1 = r.int(-6, 4), w = r.int(o.wmin || 2, o.wmax || 7), a = r.pick(o.as || [1, 1, 1, -1, -1, 2, -2]); return { r1: r1, s1: r1 + w, a: a }; },
      function (z) { var b = -z.a * (z.r1 + z.s1), c = z.a * z.r1 * z.s1; return z.s1 <= 7 && Math.abs(c) <= (o.cmax || 30) && (o.c0 || c !== 0) && Number.isInteger(b) && Number.isInteger(c) && (!o.evenW || (z.s1 - z.r1) % 2 === 0); });
  }
  function quadOf(s) { var a = s.a, b = -a * (s.r1 + s.s1), c = a * s.r1 * s.s1, p = (s.r1 + s.s1) / 2, q = a * (p - s.r1) * (p - s.s1); return { a: a, b: b, c: c, r1: s.r1, s1: s.s1, p: p, q: q, poly: quad(a, b, c), f: function (x) { return a * (x - s.r1) * (x - s.s1); } }; }

  /* the invariant points of y = |f(x)|, f quadratic (L3 Ex 2, Ex 4, #1, #4) */
  B.quadInv = function (r, cp, o) {
    o = o || {};
    var kind = r.pick(o.kinds || ['gen', 'gen', 'gen', 'none', 'touch']), f, pairs, wr = [], sol, ftex;
    if (kind === 'gen') {
      var Q = quadOf(quadSpec(r, { as: [1, 1, -1] })); ftex = tx(Q.poly); pairs = [[Q.r1, 0], [Q.s1, 0]];
      wr.push({ pairs: [[-Q.r1, 0], [-Q.s1, 0]], code: cp + 'inv-sign', hint: 'Solve ' + t(ftex + '=0') + ' again: from ' + t('(x-a)=0') + ', ' + t('x=a') + '.' });
      if (Q.c !== 0) wr.push({ pairs: [[Q.r1, 0], [Q.s1, 0], [0, Math.abs(Q.c)]], code: cp + 'inv-yint', hint: 'The ' + t('y') + '-intercept moves if it is below the axis (or is not on the axis at all). Invariant points are on the ' + t('x') + '-axis: the zeros of ' + t('f') + '.' });
      wr.push({ pairs: [[Q.p, Math.abs(Q.q)]], code: cp + 'inv-vertex', hint: 'The vertex of ' + t('f') + ' is reflected, so it moves. The invariant points are where ' + t('f(x)=0') + '.' });
      sol = t(ftex + '=' + (Q.a < 0 ? '-' : '') + '(x' + sgT(-Q.r1) + ')(x' + sgT(-Q.s1) + ')') + ': zeros ' + t(Q.r1) + ' and ' + t(Q.s1) + '. Points on the ' + t('x') + '-axis do not move: ' + t(ptsT(pairs)) + '.';
    } else if (kind === 'touch') {
      var p0 = nz(r, 1, 5), aa = r.pick([1, 2, 3]); ftex = r.chance(0.5) ? vtxT(aa, p0, 0) : tx(quad(aa, -2 * aa * p0, aa * p0 * p0)); pairs = [[p0, 0]];
      wr.push({ pairs: [[-p0, 0]], code: cp + 'inv-sign', hint: 'Solve ' + t(ftex + '=0') + ' again.' }, { pairs: [], code: cp + 'inv-none', hint: 'The parabola touches the ' + t('x') + '-axis at its vertex: that point is on both graphs.' }, { pairs: [[p0, 0], [-p0, 0]], code: cp + 'inv-extra', hint: 'A perfect square ' + t('(x-p)^{2}') + ' has only one zero.' });
      sol = (/\(/.test(ftex) ? t(ftex) : t(ftex + '=' + (aa === 1 ? '' : aa) + '(x' + sgT(-p0) + ')^{2}')) + ' is never negative and touches the axis at ' + t('x=' + p0) + ': the graph does not change, and the one invariant point is ' + t(pt(p0, 0)) + '.';
    } else {
      var pq = pickWhere(function () { return { a: r.pick([1, 2, -1, -2, [1, 2], [-1, 2]]), p: nz(r, 1, 5), q: r.int(1, 8) }; }, function () { return true; }), sgn = rv(pq.a) > 0 ? 1 : -1;
      ftex = vtxT(pq.a, pq.p, sgn * pq.q); pairs = [];
      wr.push({ pairs: [[pq.p, pq.q]], code: cp + 'inv-vertex', hint: 'The vertex is not on the ' + t('x') + '-axis. Invariant points of ' + t('y=|f(x)|') + ' are the zeros of ' + t('f') + ', and this parabola has none.' }, { pairs: [[pq.p, sgn * pq.q]], code: cp + 'inv-vertex', hint: 'The vertex is not on the ' + t('x') + '-axis. Invariant points of ' + t('y=|f(x)|') + ' are the zeros of ' + t('f') + ', and this parabola has none.' }, { pairs: [[0, Math.abs(rv(pq.a) * pq.p * pq.p + sgn * pq.q)]], code: cp + 'inv-yint', hint: 'Invariant points are on the ' + t('x') + '-axis (the zeros of ' + t('f') + ').' });
      sol = 'The vertex ' + t(pt(pq.p, sgn * pq.q)) + ' is ' + (sgn > 0 ? 'above' : 'below') + ' the ' + t('x') + '-axis and the parabola opens ' + (sgn > 0 ? 'up' : 'down') + ', so it never meets the axis: ' + (sgn > 0 ? 'the graph does not change' : 'the whole graph is reflected') + ', and there are <b>no invariant points</b>.';
    }
    return ptsPart(cp, 'State the invariant points of the graphs of ' + t('y=f(x)') + ' and ' + t('y=|f(x)|') + ' for ' + t('f(x)=' + ftex) + ' (or write none).', pairs, wr, sol,
      ['Invariant points do not move when the part below the ' + t('x') + '-axis is reflected: they are on the ' + t('x') + '-axis.', 'Find the zeros of ' + t('f') + ' (factor, or look at the vertex and the direction of opening).'], 'invariant points of y = |f(x)|',
      { noneHint: 'This parabola meets the ' + t('x') + '-axis, and those points do not move.', extraHint: 'This parabola never meets the ' + t('x') + '-axis, so there are none.' });
  };

  /* the range of y = |a(x − p)² + q| (L3 Ex 4, #4, #14, L8 #5) */
  B.quadRange = function (r, cp) {
    var s = pickWhere(function () { return { a: r.pick([1, -1, 2, -2, 3, -3, [1, 2], [-1, 2], [-1, 3]]), p: nz(r, 1, 6), q: nz(r, 1, 9), kind: r.pick(['cross', 'above', 'below']) }; }, function () { return true; });
    var av = rv(s.a), q;
    if (s.kind === 'cross') q = (av > 0 ? -1 : 1) * Math.abs(s.q); else if (s.kind === 'above') { s.a = toR(Math.abs(av)); av = Math.abs(av); q = Math.abs(s.q); } else { s.a = toR(-Math.abs(av)); av = -Math.abs(av); q = -Math.abs(s.q); }
    var ftex = vtxT(s.a, s.p, q), setT = function (cond) { return '\\{y\\mid ' + cond + ',\\ y\\in\\mathbb{R}\\}'; };
    var target = s.kind === 'cross' ? setT('y\\ge 0') : s.kind === 'above' ? setT('y\\ge ' + q) : setT('y\\ge ' + (-q));
    var fRange = av > 0 ? setT('y\\ge ' + q) : setT('y\\le ' + q), wr = [];
    if (fRange !== target) wr.push({ is: fRange, code: cp + 'rng-f', hint: 'That is the range of ' + t('y=f(x)') + '. The graph of ' + t('y=|f(x)|') + ' has no negative ' + t('y') + '-values.' });
    if (s.kind !== 'cross') wr.push({ is: setT('y\\ge 0'), code: cp + 'rng-zero', hint: 'This parabola never reaches the ' + t('x') + '-axis (vertex ' + t(pt(s.p, q)) + ', opening ' + (av > 0 ? 'up' : 'down') + '), so ' + t('|f(x)|') + ' is never 0. Its least value comes from the vertex.' });
    else wr.push({ is: setT('y\\ge ' + Math.abs(q)), code: cp + 'rng-q', hint: 'This parabola crosses the ' + t('x') + '-axis (vertex ' + t(pt(s.p, q)) + ', opening ' + (av > 0 ? 'up' : 'down') + '), so ' + t('|f(x)|') + ' reaches 0 at the invariant points.' });
    if (s.kind === 'below') wr.push({ is: setT('y\\ge ' + q), code: cp + 'vtx-noreflect', hint: 'The whole parabola is below the axis and is reflected: the vertex ' + t(pt(s.p, q)) + ' moves to ' + t(pt(s.p, -q)) + '.' });
    var why = s.kind === 'cross' ? 'The vertex ' + t(pt(s.p, q)) + ' is ' + (q < 0 ? 'below' : 'above') + ' the axis and the parabola opens ' + (av > 0 ? 'up' : 'down') + ', so it crosses the ' + t('x') + '-axis. ' + t('|f(x)|') + ' reaches 0 at the invariant points and has no negative values.'
      : s.kind === 'above' ? 'The parabola opens up from the vertex ' + t(pt(s.p, q)) + ' above the axis: it is never below the axis, so nothing changes.' : 'The parabola opens down from the vertex ' + t(pt(s.p, q)) + ' below the axis: all of it is reflected, the vertex moves to ' + t(pt(s.p, -q)) + ' and the graph opens up.';
    var p = KP.set('State the range of ' + t('y=' + A(ftex)) + '.', target, { v: 'y', wrong: wr }, why + '<br>Range: ' + t(target) + '.',
      ['Decide whether the parabola crosses the ' + t('x') + '-axis: look at the vertex and the direction of opening.', 'Reflecting changes negative ' + t('y') + '-values into positive ones; a parabola that never reaches the axis keeps a least value above 0.'], 'range of y = |f(x)|, f quadratic');
    p.bad = wr.map(function (w) { return w.is; });
    return p;
  };

  /* the piecewise form of y = |ax² + bx + c| (L3 Ex 5, #6, L8 #3c) */
  B.quadPiece = function (r, cp) {
    var Q = quadOf(quadSpec(r, { as: [1, 1, -1, -1, 2, -2, -4], cmax: 36 })), f = Q.poly, ftex = Q.b === 0 && Q.a < 0 ? P.seq([M(Q.c, 0), M(Q.a, 2)]) : tx(f);
    var up = Q.a > 0, Eo = up ? f : P.neg(f), Ei = P.neg(Eo), isO = polyIs(Eo), isI = polyIs(Ei);
    var negLead = P.add(M(-Q.a, 2), M(Q.b, 1), M(Q.c, 0)); // −f with only the x² term's sign changed (the piece that should be −f)
    var fields = [{ label: 'Smaller zero of ' + t('f') + ': ' + t('r='), name: 'r', mode: 'math', keys: 'poly', vars: ['x'] }, { label: 'Larger zero: ' + t('s='), name: 's', mode: 'math', keys: 'poly', vars: ['x'] },
      { label: 'For ' + t('x\\le r') + ' or ' + t('x\\ge s') + ': ' + t('y='), name: 'outer piece', mode: 'math', keys: 'poly', vars: ['x'] }, { label: 'For ' + t('r<x<s') + ': ' + t('y='), name: 'middle piece', mode: 'math', keys: 'poly', vars: ['x'] }];
    var keys = [String(Q.r1), String(Q.s1), tx(Eo), tx(Ei)];
    var combine = function (resp) {
      var a = numVal(resp[0]), b = numVal(resp[1]); if (a == null || b == null || !String(resp[2] || '').trim() || !String(resp[3] || '').trim()) return null;
      var zOK = a === Q.r1 && b === Q.s1, zSwap = a === Q.s1 && b === Q.r1, zNeg = sameSet([a, b], [-Q.r1, -Q.s1]) && !sameSet([a, b], [Q.r1, Q.s1]);
      if ((zOK || zSwap) && isI(resp[2]) && isO(resp[3])) return wrong(cp + 'pw-swap', 'Your two pieces are swapped. ' + (up ? 'The parabola opens up, so it is below the axis <b>between</b> its zeros: that is where the piece is ' + t('-f(x)') + '.' : 'The parabola opens down, so it is below the axis <b>outside</b> its zeros: that is where the piece is ' + t('-f(x)') + '.'));
      if (zNeg && isO(resp[2]) && isI(resp[3])) return wrong(cp + 'pw-bsign', 'The pieces are right. Check the zeros: solve ' + t(ftex + '=0') + ' again.');
      if ((zOK || zSwap) && (up ? isO(resp[2]) && polyIs(negLead)(resp[3]) : isI(resp[3]) && polyIs(negLead)(resp[2]))) return wrong(cp + 'pw-neg', 'The ' + (up ? 'middle' : 'outer') + ' piece is the opposite of the <b>whole</b> expression: change the sign of every term.');
      if (zSwap && isO(resp[2]) && isI(resp[3])) return wrong(cp + 'pw-bound', 'Put the smaller zero in the first box.');
      return null;
    };
    var bad = [[keys[0], keys[1], keys[3], keys[2]], [String(-Q.s1), String(-Q.r1), keys[2], keys[3]], (up ? [keys[0], keys[1], keys[2], tx(negLead)] : [keys[0], keys[1], tx(negLead), keys[3]])].filter(function (b) { return b.join('|') !== keys.join('|'); });
    if (sameSet([-Q.r1, -Q.s1], [Q.r1, Q.s1])) bad.splice(1, 1);
    var cases = 'y=\\begin{cases}' + tx(Eo) + ', & x\\le ' + Q.r1 + '\\text{ or }x\\ge ' + Q.s1 + '\\\\ ' + tx(Ei) + ', & ' + Q.r1 + '<x<' + Q.s1 + '\\end{cases}';
    var fac = (Q.a === 1 ? '' : Q.a === -1 ? '-' : Q.a) + '(x' + sgT(-Q.r1) + ')(x' + sgT(-Q.s1) + ')';
    return fieldsPart('Write ' + t('y=' + A(ftex)) + ' in piecewise form, without absolute value symbols. Let ' + t('r<s') + ' be the zeros of ' + t('f(x)=' + ftex) + '.', fields, [K.value(Q.r1), K.value(Q.s1), K.poly(Eo, { expanded: false }), K.poly(Ei, { expanded: false })], keys, t(cases),
      t(ftex + '=' + fac) + ': zeros ' + t(Q.r1) + ' and ' + t(Q.s1) + '. It opens ' + (up ? 'up, so ' + t('f(x)<0') + ' between the zeros' : 'down, so ' + t('f(x)<0') + ' outside the zeros') + ', and there ' + t('|f(x)|=-f(x)') + '.<br>' + t(cases),
      ['Find the zeros, then decide where the parabola is below the ' + t('x') + '-axis (the direction of opening tells you).', 'Where ' + t('f(x)\\ge 0') + ' the piece is ' + t('f(x)') + '; where ' + t('f(x)<0') + ' it is ' + t('-f(x)') + ', with every sign changed.'], 'piecewise form of y = |f(x)|, f quadratic', bad, combine);
  };

  /* working backwards with a W (L3 Ex 7, #9–11, #18) */
  B.quadBack = function (r, cp, o) {
    o = o || {};
    var kind = r.pick(o.kinds || ['range', 'three', 'graph', 'arc']);
    if (kind === 'range') {
      var a = r.pick([-1, -2, -3, 1, 2, 3, [1, 2], [-1, 2]]), p = nz(r, 1, 5), m = r.int(2, 9), k = rv(a) > 0 ? m : -m;
      return valPart(cp, 'Let ' + t('g(x)=' + vtxT(a, p, 0).replace(/\^\{2\}$/, '^{2}') + '+k') + '. The range of ' + t('y=|g(x)|') + ' is ' + t('\\{y\\mid y\\ge ' + m + ',\\ y\\in\\mathbb{R}\\}') + '. Determine ' + t('k') + '.', k,
        [{ v: -k, code: cp + 'back-sign', hint: 'The least value is ' + t(m) + ', not 0, so ' + t('g') + ' never reaches the ' + t('x') + '-axis. It opens ' + (rv(a) > 0 ? 'up' : 'down') + ', so it lies entirely ' + (rv(a) > 0 ? 'above' : 'below') + ' the axis.' }],
        'A least value of ' + t(m) + ' (not 0) means ' + t('g') + ' never reaches the ' + t('x') + '-axis. ' + t('g') + ' opens ' + (rv(a) > 0 ? 'up, so it is entirely above the axis and nothing is reflected: the vertex is ' + t(pt(p, m)) : 'down, so it is entirely below the axis and its vertex ' + t('(' + p + ',\\ k)') + ' is reflected to ' + t(pt(p, m))) + '.<br>' + t('k=' + k) + '.',
        ['A range starting above 0 means the parabola never meets the ' + t('x') + '-axis.', 'Use the direction of opening: is the parabola entirely above or entirely below the axis?'], 'k from the range of y = |g(x)|', { exact: false });
    }
    if (kind === 'three') {
      var Q = quadOf(quadSpec(r, { as: [1], evenW: true, wmax: 8, cmax: 40 }));
      return valPart(cp, 'The horizontal line ' + t('y=k') + ' meets the graph of ' + t('y=' + A(tx(Q.poly))) + ' at exactly three points. Determine ' + t('k') + '.', -Q.q,
        [{ v: Q.q, code: cp + 'vtx-noreflect', hint: 'The vertex ' + t(pt(Q.p, Q.q)) + ' is reflected to ' + t(pt(Q.p, -Q.q)) + '; the line ' + t('y=k') + ' must touch the top of that hump.' }, { v: Math.abs(Q.c), code: cp + 'back-sign', hint: 'That is the height of the ' + t('y') + '-intercept. Three points happen when the line just touches the top of the reflected hump.' }],
        t(tx(Q.poly) + '=(x' + sgT(-Q.r1) + ')(x' + sgT(-Q.s1) + ')') + ': axis ' + t('x=' + Q.p) + ', ' + t('f(' + Q.p + ')=' + Q.q) + '. The vertex ' + t(pt(Q.p, Q.q)) + ' reflects to ' + t(pt(Q.p, -Q.q)) + '. The line ' + t('y=' + (-Q.q)) + ' touches the top of the middle arc once and crosses each outer arm once: three points. ' + t('k=' + (-Q.q)) + '.',
        ['Picture the W: two outer arms and a middle arc (the reflected part).', 'A horizontal line meets the W three times only at the height of the top of the middle arc.'], 'the line meeting a W three times', { exact: false });
    }
    if (kind === 'arc') {
      var Q2 = quadOf(quadSpec(r, { as: [1, -1, 2, -2], evenW: true, cmax: 40 })), c = Q2.c;
      return pointPart(cp, 'A quadratic function ' + t('h') + ' has ' + t('x') + '-intercepts ' + t(Q2.r1) + ' and ' + t(Q2.s1) + ' and ' + t('y') + '-intercept ' + t(c) + '. State the coordinates of the vertex of the middle arc of the graph of ' + t('y=|h(x)|') + '.', [Q2.p, Math.abs(Q2.q)],
        [{ p: [Q2.p, Q2.q], code: cp + 'vtx-noreflect', hint: 'That is the vertex of ' + t('h') + '. Between the zeros ' + t('h') + ' is ' + (Q2.q < 0 ? 'below' : 'above') + ' the axis' + (Q2.q < 0 ? ', so that arc is reflected.' : '.') }, { p: [-Q2.p, Math.abs(Q2.q)], code: cp + 'pt-xchg', hint: 'The axis of symmetry is halfway between the zeros.' }],
        'The axis is halfway between the zeros: ' + t('x=' + rt(Q2.p)) + '. ' + t('h(x)=a(x' + sgT(-Q2.r1) + ')(x' + sgT(-Q2.s1) + ')') + ' and ' + t('h(0)=' + c) + ': ' + t('a(' + (-Q2.r1) + ')(' + (-Q2.s1) + ')=' + c) + ', so ' + t('a=' + rt(Q2.a)) + '.<br>' + t('h(' + rt(Q2.p) + ')=' + rt(Q2.q)) + (Q2.q < 0 ? ', reflected to ' + t(rt(-Q2.q)) : ' (above the axis, it stays)') + ': the middle arc has its vertex at ' + t(pt(Q2.p, Math.abs(Q2.q))) + '.',
        ['Write ' + t('h(x)=a(x-r)(x-s)') + ' and use the ' + t('y') + '-intercept to find ' + t('a') + '.', 'Find the vertex of ' + t('h') + ' (halfway between the zeros), then take the absolute value of its ' + t('y') + '-coordinate.'], 'vertex of the middle arc of y = |h(x)|');
    }
    var s = pickWhere(function () { return { r1: r.int(-5, 1), w: r.pick([2, 4, 6]), a: r.pick([1, 1, [1, 2], 2, [1, 4]]) }; }, function (z) { var hh = rv(z.a) * (z.w / 2) * (z.w / 2); return z.r1 + z.w <= 5 && hh <= 9 && hh >= 1; });
    var r1 = s.r1, s1 = s.r1 + s.w, pp = (r1 + s1) / 2, top = rv(s.a) * (s.w / 2) * (s.w / 2), up = r.chance(0.5);
    var Tp = P.scale(P.mul(lin(1, -r1), lin(1, -s1)), toR(up ? s.a : rneg(s.a)));
    var svg = G({ x: [-7, 7], y: [-2, 10], labels: 2, fns: [crv(function (x) { return Math.abs(rv(s.a) * (x - r1) * (x - s1)); })], points: [{ x: r1, y: 0, label: '(' + r1 + ', 0)' }, { x: s1, y: 0, label: '(' + s1 + ', 0)' }, { x: pp, y: top, label: '(' + pp + ', ' + dt(top) + ')' }], max: 300, aria: 'a W-shaped graph touching the x-axis at two points, with a middle arc' });
    var wr = [{ is: P.neg(Tp), code: cp + 'back-other', hint: 'That parabola gives the same graph of ' + t('y=|f(x)|') + ', but it opens the other way. Check which direction the question asks for.' }];
    if (rv(s.a) !== 1) wr.push({ is: P.scale(P.mul(lin(1, -r1), lin(1, -s1)), up ? 1 : -1), code: cp + 'back-a', hint: 'Use the vertex of the arc to find ' + t('a') + ': at ' + t('x=' + pp) + ', ' + t('|f(x)|=' + dt(top)) + '.' });
    var p2 = KP.poly('The graph of ' + t('y=|f(x)|') + ' is shown, where ' + t('f') + ' is a quadratic function that opens <b>' + (up ? 'up' : 'down') + '</b>. Write an equation for ' + t('f(x)') + '.' + svg, Tp, { wrong: wr, expanded: false },
      'The invariant points ' + t(pt(r1, 0)) + ' and ' + t(pt(s1, 0)) + ' are the zeros of ' + t('f') + ': ' + t('f(x)=a(x' + sgT(-r1) + ')(x' + sgT(-s1) + ')') + '. ' + (up ? 'It opens up, so the middle arc was reflected and the vertex of ' + t('f') + ' is ' + t('(' + pp + ',\\ -' + dt(top) + ')') : 'It opens down, so the middle arc is part of ' + t('f') + ' itself and its vertex is ' + t('(' + pp + ',\\ ' + dt(top) + ')')) + '.<br>' + t('a(' + (pp - r1) + ')(' + (pp - s1) + ')=' + (up ? '-' : '') + dt(top)) + ', so ' + t('a=' + rt(up ? s.a : rneg(s.a))) + ': ' + t('f(x)=' + tx(Tp)) + '.',
      ['The invariant points are the zeros of ' + t('f') + ': write ' + t('f(x)=a(x-r)(x-s)') + '.', 'If ' + t('f') + ' opens up, its vertex is below the axis: the top of the middle arc reflected.'], 'quadratic f from the graph of y = |f(x)|', { before: 'f(x)=' });
    return withBad(p2, wr);
  };

  /* ======================================================================================================
   * RF2 — absolute value equations (Lessons 4–5)
   * ====================================================================================================== */
  function linTx(a, b) { return tx(lin(a, b)); }
  /* |ax + b| = c, after isolating (L4 Ex 1, Ex 4, #1, #5) */
  B.absConst = function (r, cp, o) {
    o = o || {};
    var mode = r.pick(o.modes || ['plain', 'iso', 'iso', 'none']);
    var s = pickWhere(function () { return { a: nz(r, 1, 5), b: nz(r, 1, 9), c: r.int(1, 14) }; }, function (z) { return gcd(z.a, z.b) === 1 || Math.abs(z.a) === 1; });
    var a = s.a, b = s.b, inner = linT(a, b, r.chance(0.3)), eq, c = s.c, k = 1, d = 0, e, steps = '';
    if (mode === 'plain') { eq = A(inner) + '=' + c; }
    else {
      k = r.pick([2, 3, 4, 5, -2, -3]); d = nz(r, 1, 12);
      if (mode === 'none') { c = -r.int(1, 6); } else if (r.chance(0.12)) c = 0;
      e = k * c + d;
      eq = k + A(inner) + sgT(d) + '=' + e;
      if (r.chance(0.3) && k < 0) eq = d + '-' + (-k) + A(inner) + '=' + e;
      steps = t(k + A(inner) + '=' + (e - d)) + ', so ' + t(A(inner) + '=' + c) + '.<br>';
    }
    var vals = c < 0 ? [] : c === 0 ? [toR([-b, a])] : uniqNums([(c - b) / a, (-c - b) / a]).sort(function (x, y) { return x - y; }).map(function (x) { return toR(x); });
    var wr = [];
    if (c > 0) wr.push({ vals: [toR([c - b, a])], code: cp + 'one-case', hint: 'There is a second case: ' + t(inner + '=-' + c) + '.' });
    if (c < 0) wr.push({ vals: uniqNums([(c - b) / a, (-c - b) / a]).map(toR), code: cp + 'neg-abs', hint: 'After isolating, ' + t(A(inner) + '=' + c) + ': an absolute value is never negative, so there is no solution.' });
    if (mode !== 'plain' && k !== 1) { var w1 = ((e - d) / k - b) / a, w2 = ((-e - d) / k - b) / a; var wv = uniqNums([w1, w2]); if (!sameSet(wv, vals.map(rv))) wr.push({ vals: wv.map(toR), code: cp + 'no-iso', hint: 'Isolate the absolute value <b>before</b> splitting into two cases: ' + t(A(inner) + '=' + c) + '.' }); }
    if (c > 0) wr.push({ vals: [], code: cp + 'nosol-claim', hint: 'The absolute value equals a positive number, so there are two solutions.' });
    var sol = steps + (c < 0 ? t(A(inner) + '=' + c) + ': an absolute value is never negative, so there is <b>no solution</b>.' : c === 0 ? t(inner + '=0') + ', so ' + t('x=' + rt(vals[0])) + ' (one solution).' : t(inner + '=' + c) + ' or ' + t(inner + '=-' + c) + ', so ' + vals.map(function (x) { return t('x=' + rt(x)); }).join(' or ') + '.');
    return rootsPart(cp, 'Solve ' + t(eq) + '.', vals, { wrongs: wr }, sol,
      ['Isolate the absolute value first: undo what is done outside the bars.', t('|A|=c') + ': two solutions if ' + t('c>0') + ' (' + t('A=c') + ' or ' + t('A=-c') + '), one if ' + t('c=0') + ', none if ' + t('c<0') + '.'], 'solving |A| = c');
  };

  /* |ax + b| = cx + d by cases, checking for extraneous roots (L4 Ex 5–7, #7–9, L8 Ex 3c) */
  B.absLin = function (r, cp, o) {
    o = o || {};
    var s = pickWhere(function () { return { a: nz(r, 1, 5), b: r.int(-10, 10), c: nz(r, 1, 4), d: r.int(-10, 10), view: r.pick(['std', 'std', 'iso', 'coef']) }; }, function (z) {
      if (Math.abs(z.a) === Math.abs(z.c) || (z.b === 0 && z.d === 0)) return false;
      var x1 = (z.d - z.b) / (z.a - z.c), x2 = (-z.d - z.b) / (z.a + z.c), f1 = toR(x1), f2 = toR(x2);
      if (!f1 || !f2 || f1[1] > 5 || f2[1] > 5 || Math.abs(x1 - x2) < 1e-9 || Math.abs(x1) > 15 || Math.abs(x2) > 15) return false;
      var v1 = z.c * x1 + z.d >= -1e-9, v2 = z.c * x2 + z.d >= -1e-9, n = (v1 ? 1 : 0) + (v2 ? 1 : 0);
      z.x1 = f1; z.x2 = f2; z.v1 = v1; z.v2 = v2; z.n = n;
      if (z.view === 'coef' && (z.b % z.a !== 0 || Math.abs(z.a) === 1)) return false;
      if (Math.abs(z.c * x1 + z.d) < 1e-9 && Math.abs(z.c * x2 + z.d) < 1e-9) return false;
      return (o.counts || [1, 1, 1, 2, 2, 0]).indexOf(n) >= 0 && r.chance(n === 0 ? 0.5 : 1);
    });
    var inner = linT(s.a, s.b, r.chance(0.3)), rhs = linTx(s.c, s.d), eq;
    if (s.view === 'iso') eq = A(inner) + (s.c > 0 ? '-' + (s.c === 1 ? '' : s.c) : '+' + (s.c === -1 ? '' : -s.c)) + 'x=' + s.d;
    else if (s.view === 'coef') { var kk = Math.abs(s.a), h = -s.b / s.a; inner = tx(lin(1, -h)); eq = kk + A(inner) + '=' + rhs; }
    else eq = A(inner) + '=' + rhs;
    var vals = [], extr = [];
    [[s.x1, s.v1], [s.x2, s.v2]].forEach(function (z) { (z[1] ? vals : extr).push(z[0]); });
    vals.sort(function (x, y) { return rv(x) - rv(y); });
    var wr = [], xn = toR((s.d - s.b) / (-s.a - s.c)); // sign slip in case 2: −ax + b = cx + d
    function chk(x) { var L = Math.abs(s.a * rv(x) + s.b), R = s.c * rv(x) + s.d; return 'Check ' + t('x=' + rt(x)) + ': left side ' + t(rt(toR(L))) + ', right side ' + t(rt(toR(R))) + (Math.abs(L - R) < 1e-9 ? ' ✓' : ': the right side is negative, so ' + t('x=' + rt(x)) + ' is extraneous') + '.'; }
    if (xn && !has(vals.map(rv), rv(xn)) && !has(extr.map(rv), rv(xn))) wr.push({ vals: vals.length ? [vals[0], xn] : [xn], code: cp + 'neg-one', hint: 'In the second case the <b>whole</b> right side is negated: ' + t(tx(lin(s.a, s.b)) + '=-(' + rhs + ')') + '.' });
    var iso = s.view === 'iso' ? 'Isolate: ' + t(A(inner) + '=' + rhs) + '.<br>' : s.view === 'coef' ? t(Math.abs(s.a) + A(inner) + '=' + A(tx(lin(s.a, s.b)))) + ', so the equation is ' + t(A(tx(lin(s.a, s.b))) + '=' + rhs) + '.<br>' : '';
    var Lt = tx(lin(s.a, s.b));
    var sol = iso + 'Case 1: ' + t(Lt + '=' + rhs) + ', so ' + t('x=' + rt(s.x1)) + '.<br>Case 2: ' + t(Lt + '=-(' + rhs + ')') + ', so ' + t('x=' + rt(s.x2)) + '.<br>' + chk(s.x1) + '<br>' + chk(s.x2) + '<br>' + (vals.length ? 'Solution: ' + vals.map(function (x) { return t('x=' + rt(x)); }).join(' or ') + (extr.length ? ' (' + extr.map(function (x) { return t(rt(x)); }).join(', ') + ' extraneous)' : '') : 'Both are extraneous: <b>no solution</b>.') + '.';
    return rootsPart(cp, 'Solve and verify: ' + t(eq) + '. Give only the solutions that check (or write no solution).', vals, { extr: extr, wrongs: wr, rejValid: true, noneHint: 'Check again: ' + (vals.length ? t('x=' + rt(vals[0])) + ' makes both sides equal.' : '') }, sol,
      ['Isolate the absolute value, then solve ' + t('A=B') + ' and ' + t('A=-B') + ' (negate the whole right side).', 'Substitute each answer into the original equation: the side without bars must not be negative.'], 'solving |ax + b| = cx + d');
  };

  /* |x² + bx + c| = k, or |x² − n| = k (L5 Ex 1–2, #1–2, L8 #7a) */
  B.absQuadK = function (r, cp, o) {
    o = o || {};
    var mode = r.pick(o.modes || ['gen', 'gen', 'sq', 'iso']), s, ftex, k, c1 = [], c2 = [], eq, A2, B2, C2, steps;
    if (mode === 'sq') {
      s = pickWhere(function () { return { n: r.int(2, 45), k: r.int(1, 36) }; }, function (z) { return isSq(z.n + z.k) && (isSq(z.n - z.k) || z.n - z.k < 0) && z.n !== z.k && (z.n - z.k > 0 || r.chance(0.6)); });
      ftex = 'x^{2}-' + s.n; k = s.k; A2 = 1; B2 = 0; C2 = -s.n;
      var u = Math.sqrt(s.n + s.k); c1 = [-u, u]; if (s.n - s.k > 0) { var w = Math.sqrt(s.n - s.k); c2 = [-w, w]; } else if (s.n - s.k === 0) c2 = [0];
      steps = 'Case 1: ' + t('x^{2}-' + s.n + '=' + k) + ', ' + t('x^{2}=' + (s.n + k)) + ', ' + t('x=\\pm ' + u) + '.<br>Case 2: ' + t('x^{2}-' + s.n + '=-' + k) + ', ' + t('x^{2}=' + (s.n - k)) + (s.n - k > 0 ? ', ' + t('x=\\pm ' + Math.sqrt(s.n - k)) : s.n - k === 0 ? ', ' + t('x=0') : ': no real roots') + '.';
    } else {
      s = pickWhere(function () { return { r1: r.int(-7, 3), w: r.int(1, 8), k: r.int(1, 16) }; }, function (z) { var w2 = z.w * z.w, D1 = w2 + 4 * z.k, D2 = w2 - 4 * z.k; return isSq(D1) && (isSq(D2) || (D2 < 0 && r.chance(0.3))) && z.r1 + z.w <= 7 && Math.abs(z.r1 * (z.r1 + z.w)) <= 30 && z.r1 * (z.r1 + z.w) !== 0 && (z.r1 + z.r1 + z.w) !== 0; });
      var r1 = s.r1, s1 = s.r1 + s.w, bb = -(r1 + s1), cc = r1 * s1; k = s.k; A2 = 1; B2 = bb; C2 = cc; ftex = tx(quad(1, bb, cc));
      c1 = qroots(1, bb, cc - k).map(function (x) { return x.v; }); c2 = qroots(1, bb, cc + k).map(function (x) { return x.v; });
      var fct = function (cst) { var rs = qroots(1, bb, cst); return rs.length === 0 ? ': no real roots (' + t('b^{2}-4ac<0') + ')' : rs.length === 1 || Math.abs(rs[0].v - rs[1].v) < 1e-9 ? ', ' + t('(x' + sgT(-rs[0].v) + ')^{2}=0') + ', ' + t('x=' + rs[0].tex) : ', ' + t('(x' + sgT(-rs[0].v) + ')(x' + sgT(-rs[1].v) + ')=0') + ', ' + t('x=' + rs[0].tex) + ' or ' + t('x=' + rs[1].tex); };
      steps = 'Case 1: ' + t(ftex + '=' + k) + ', ' + t(tx(quad(1, bb, cc - k)) + '=0') + fct(cc - k) + '.<br>Case 2: ' + t(ftex + '=-' + k) + ', ' + t(tx(quad(1, bb, cc + k)) + '=0') + fct(cc + k) + '.';
    }
    eq = A(ftex) + '=' + k; var pre = '';
    if (mode === 'iso') { var m = r.pick([2, 3, 4]), d = nz(r, 1, 9); eq = m + A(ftex) + sgT(d) + '=' + (m * k + d); pre = 'Isolate: ' + t(m + A(ftex) + '=' + m * k) + ', so ' + t(A(ftex) + '=' + k) + '.<br>'; }
    var vals = uniqNums(c1.concat(c2)).sort(function (x, y) { return x - y; });
    var wr = [];
    if (c2.length) wr.push({ vals: c1, code: cp + 'one-case', hint: 'Solve the second case too: ' + t(ftex + '=-' + k) + '.' });
    if (c2.length && c1.length) wr.push({ vals: c2, code: cp + 'one-case', hint: 'Solve the first case too: ' + t(ftex + '=' + k) + '.' });
    wr.push({ vals: [], code: cp + 'nosol-claim', hint: 'The absolute value equals a positive number: solve both cases.' });
    return rootsPart(cp, 'Solve ' + t(eq) + '.', vals.map(function (x) { return toR(x); }), { wrongs: wr }, pre + steps + '<br>Solutions: ' + rootsT(vals.map(toR)) + ' (' + vals.length + ' solution' + (vals.length === 1 ? '' : 's') + ').',
      ['Isolate the absolute value, then solve ' + t('f(x)=' + k) + ' and ' + t('f(x)=-' + k) + '.', 'Each case is a quadratic equation: factor it (a case may have no real roots). The right side is a positive constant, so no root is extraneous.'], 'solving |f(x)| = k, f quadratic');
  };

  /* the number of solutions of |f(x)| = k (L5 Ex 3–4, #5–6, L8 #23) */
  B.absCount = function (r, cp) {
    var Q = quadOf(quadSpec(r, { as: [1], evenW: true, wmax: 8, cmax: 40 })), hump = -Q.q, kind = r.pick(['between', 'top', 'above', 'zero', 'neg', 'between', 'top']);
    var k = kind === 'between' ? r.int(1, hump - 1) : kind === 'top' ? hump : kind === 'above' ? hump + r.int(1, 6) : kind === 'zero' ? 0 : -r.int(1, 6);
    if (kind === 'between' && hump < 2) { kind = 'top'; k = hump; }
    var n = { between: 4, top: 3, above: 2, zero: 2, neg: 0 }[kind];
    var diag = function (v) {
      if (kind === 'top' && (v === 4 || v === 2)) return { code: cp + 'cnt-hump', hint: 'The reflected hump reaches exactly ' + t('y=' + hump) + ': the line touches its top once, and crosses each outer arm once.' };
      if (kind === 'between' && v === 2) return { code: cp + 'cnt-two', hint: 'The line also crosses the reflected hump (it reaches ' + t('y=' + hump) + ') twice.' };
      if (kind === 'above' && (v === 4 || v === 3)) return { code: cp + 'cnt-four', hint: 'The reflected hump only reaches ' + t('y=' + hump) + ', so the line ' + t('y=' + k) + ' passes above it.' };
      if (kind === 'zero' && v !== 2) return { code: cp + 'cnt-zero', hint: t('|f(x)|=0') + ' exactly at the zeros of ' + t('f') + '.' };
      if (kind === 'neg' && v !== 0) return { code: cp + 'cnt-neg', hint: 'An absolute value is never negative.' };
      return null;
    };
    var p = KP.number('Let ' + t('f(x)=' + tx(Q.poly)) + '. How many solutions does ' + t(A(tx(Q.poly)) + '=' + k) + ' have?', n, diag,
      t(tx(Q.poly) + '=(x' + sgT(-Q.p) + ')^{2}' + sgT(Q.q)) + ': zeros ' + t(Q.r1) + ' and ' + t(Q.s1) + ', vertex ' + t(pt(Q.p, Q.q)) + '. The graph of ' + t('y=|f(x)|') + ' is a W whose middle hump reaches ' + t(pt(Q.p, hump)) + '.<br>' + ({ between: 'The line ' + t('y=' + k) + ' is between 0 and ' + t(hump) + ': it crosses both outer arms and the hump twice: <b>4</b> solutions.', top: 'The line ' + t('y=' + k) + ' touches the top of the hump and crosses each outer arm: <b>3</b> solutions.', above: 'The line ' + t('y=' + k) + ' is above the hump: it meets only the two outer arms: <b>2</b> solutions.', zero: t('|f(x)|=0') + ' at the zeros only: <b>2</b> solutions.', neg: 'An absolute value is never negative: <b>0</b> solutions.' })[kind],
      ['Sketch ' + t('y=|f(x)|') + ': find the zeros and the vertex, and reflect the part below the axis.', 'Count where the horizontal line ' + t('y=' + k) + ' meets the W.'], 'number of solutions of |f(x)| = k');
    p.bad = [4, 3, 2, 0, 1].filter(function (v) { return v !== n && diag(v); }).map(String);
    return p;
  };

  /* |A| = B with a quadratic: extraneous roots (L5 Ex 4, #7–8, L8 Ex 4b, #7b, EP08 C2) */
  B.absQuadVar = function (r, cp) {
    var s = pickWhere(function () { return { u1: r.int(-6, 6), u2: r.int(-6, 6), v1: r.int(-6, 6), v2: r.int(-6, 6), view: r.pick(['quadAbs', 'quadAbs', 'linAbs']) }; }, function (z) {
      var S = z.u1 + z.u2 + z.v1 + z.v2, Pq = z.u1 * z.u2 + z.v1 * z.v2, m2 = z.u1 + z.u2 - z.v1 - z.v2, d2 = z.v1 * z.v2 - z.u1 * z.u2;
      if (S % 2 || Pq % 2 || m2 % 2 || d2 % 2 || m2 === 0) return false;
      var all = uniqNums([z.u1, z.u2, z.v1, z.v2]); if (all.length < 3) return false;
      z.m = m2 / 2; z.d = d2 / 2; z.b = -S / 2; z.c = Pq / 2;
      if (Math.abs(z.m) > 5 || Math.abs(z.d) > 12 || Math.abs(z.b) > 8 || Math.abs(z.c) > 20) return false;
      var Bf = function (x) { return z.m * x + z.d; }, Af = function (x) { return x * x + z.b * x + z.c; };
      var test = z.view === 'quadAbs' ? Bf : Af;
      z.valid = all.filter(function (x) { return test(x) >= 0; }); z.extr = all.filter(function (x) { return test(x) < 0; });
      return z.valid.length >= 1 && z.extr.length >= 1;
    });
    var Atex = tx(quad(1, s.b, s.c)), Btex = tx(lin(s.m, s.d)), eq = s.view === 'quadAbs' ? A(Atex) + '=' + Btex : A(Btex) + '=' + Atex;
    var vals = s.valid.slice().sort(function (x, y) { return x - y; }), extr = s.extr;
    var inA = s.view === 'quadAbs' ? Atex : Btex, other = s.view === 'quadAbs' ? Btex : Atex;
    var fac = function (x1, x2) { return x1 === x2 ? '(x' + sgT(-x1) + ')^{2}' : '(x' + sgT(-x1) + ')(x' + sgT(-x2) + ')'; };
    var c1 = tx(P.sub(quad(1, s.b, s.c), lin(s.m, s.d))), c2 = tx(P.add(quad(1, s.b, s.c), lin(s.m, s.d)));
    var test = s.view === 'quadAbs' ? function (x) { return s.m * x + s.d; } : function (x) { return x * x + s.b * x + s.c; };
    var chk = uniqNums([s.u1, s.u2, s.v1, s.v2]).sort(function (x, y) { return x - y; }).map(function (x) { var R0 = test(x); return t('x=' + x) + ': ' + t(other) + ' is ' + t(R0) + (R0 >= 0 ? ' ✓' : ' (negative: extraneous)'); }).join('<br>');
    var sol = 'Case 1: ' + t(inA + '=' + other) + ', so ' + t(c1 + '=0') + ', ' + t(fac(s.u1, s.u2) + '=0') + '.<br>Case 2: ' + t(inA + '=-(' + other + ')') + ', so ' + t(c2 + '=0') + ', ' + t(fac(s.v1, s.v2) + '=0') + '.<br>Check (the side without bars, ' + t(other) + ', must not be negative):<br>' + chk + '<br>Solution: ' + vals.map(function (x) { return t('x=' + x); }).join(' or ') + '.';
    return rootsPart(cp, 'Solve and verify: ' + t(eq) + '. Reject any extraneous solutions.', vals, { extr: extr, rejValid: true, wrongs: [{ vals: [], code: cp + 'nosol-claim', hint: 'Check each root again: ' + t('x=' + vals[0]) + ' makes both sides equal.' }] }, sol,
      ['Solve ' + t('A=B') + ' and ' + t('A=-B') + ': each case is a quadratic equation (factor it).', 'Check every root in the original equation: the side without the bars cannot be negative.'], 'solving |A| = B with a quadratic');
  };

  /* problems (L4 Ex 8, #10–13, L5 Ex 6, #11, L8 #2c) */
  B.absWord = function (r, cp, o) {
    o = o || {};
    var kind = r.pick(o.kinds || ['dist', 'drone']);
    if (kind === 'dist') {
      var s = pickWhere(function () { return { h: nz(r, 2, 12), m: r.pick([2, 3, 4, 5]) }; }, function () { return true; });
      var mv = rv(s.m), x1 = s.h / (1 - mv), x2 = s.h / (1 + mv), good = mv * x1 >= 0 ? x1 : x2, bad = good === x1 ? x2 : x1;
      var times = { 2: 'twice', 3: 'three times', 4: 'four times', 5: 'five times' }[mv];
      var eq = A('x' + sgT(-s.h)) + '=' + mv + 'x';
      var chk = function (x) { return t(A(rt(toR(x)) + sgT(-s.h)) + '=' + rt(toR(Math.abs(x - s.h)))) + ' and ' + t(rt(s.m) + '\\times' + (x < 0 ? '(' + rt(toR(x)) + ')' : rt(toR(x))) + '=' + rt(toR(mv * x))) + (mv * x >= 0 ? ' ✓' : ' ✗ (a distance cannot be negative)'); };
      return valPart(cp, 'The distance between a number and ' + t(s.h) + ' is ' + times + ' the number. Write an absolute value equation and solve it to determine the number.', toR(good),
        [{ v: bad, code: cp + 'extr', hint: 'Check it: ' + t(rt(s.m) + 'x') + ' would be negative there, and a distance is never negative. It is extraneous.' }],
        'Let the number be ' + t('x') + ': ' + t(eq) + '.<br>' + t('x' + sgT(-s.h) + '=' + rt(s.m) + 'x') + ' gives ' + t('x=' + rt(toR(x1))) + '; ' + t('-(x' + sgT(-s.h) + ')=' + rt(s.m) + 'x') + ' gives ' + t('x=' + rt(toR(x2))) + '.<br>Check ' + t('x=' + rt(toR(x1))) + ': ' + chk(x1) + '<br>Check ' + t('x=' + rt(toR(x2))) + ': ' + chk(x2) + '<br>The number is ' + t(rt(toR(good))) + '.',
        ['The distance between ' + t('x') + ' and ' + t(s.h) + ' is ' + t(A('x' + sgT(-s.h))) + '.', 'Solve both cases, then check each answer: the right side must not be negative.'], 'an absolute value equation from words');
    }
    var z = pickWhere(function () { return { b: r.pick([6, 8, 10, 12]), H: r.int(5, 30), d: r.int(1, 6) }; }, function (q) { var top = q.b * q.b / 4; return q.H + q.d < top && q.H - q.d > 0 && !(isSq(top - q.H - q.d) && isSq(top - q.H + q.d)); });
    var hb = z.b / 2, top = hb * hb, r1 = qroots(1, -z.b, z.H + z.d), r2 = qroots(1, -z.b, z.H - z.d), all = r1.concat(r2).sort(function (x, y) { return x.v - y.v; });
    var ht = '-t^{2}+' + z.b + 't';
    var sol = 'The distance between the height and ' + t(z.H) + ' m is ' + t(A(ht + '-' + z.H)) + ', so solve ' + t(A(ht + '-' + z.H) + '=' + z.d) + '.<br>Case 1: ' + t(ht + '-' + z.H + '=' + z.d) + ', so ' + t('t^{2}-' + z.b + 't+' + (z.H + z.d) + '=0') + ': ' + t('t=' + hb + '\\pm\\sqrt{' + (top - z.H - z.d) + '}') + '.<br>Case 2: ' + t(ht + '-' + z.H + '=-' + z.d) + ', so ' + t('t^{2}-' + z.b + 't+' + (z.H - z.d) + '=0') + ': ' + t('t=' + hb + '\\pm\\sqrt{' + (top - z.H + z.d) + '}') + '.<br>' + t('t\\approx ' + all.map(function (x) { return x.v.toFixed(2); }).join(',\\ ')) + ' s (all between 0 and ' + z.b + ').';
    var part = rootsPart(cp, 'A drone rises and then lands. Its height is ' + t('h=' + ht) + ' metres after ' + t('t') + ' seconds, ' + t('0\\le t\\le ' + z.b) + '. Write an absolute value equation for the times when the drone is exactly ' + t(z.d) + ' m from a height of ' + t(z.H) + ' m, and solve it. Give the times to the nearest hundredth of a second.', all, { v: 't', round: true,
      wrongs: [{ vals: r1, code: cp + 'one-case', hint: 'There is a second case: the drone is ' + t(z.d) + ' m <b>below</b> ' + t(z.H) + ' m too, ' + t(ht + '-' + z.H + '=-' + z.d) + '.' }, { vals: r2, code: cp + 'one-case', hint: 'There is a second case: the drone is ' + t(z.d) + ' m <b>above</b> ' + t(z.H) + ' m too, ' + t(ht + '-' + z.H + '=' + z.d) + '.' }, { vals: [], code: cp + 'nosol-claim', hint: 'The drone passes through both heights on the way up and on the way down.' }],
      keyTex: all.map(function (x) { return 't=' + x.tex; }).join(',\\ '), answer: t(all.map(function (x) { return 't\\approx ' + x.v.toFixed(2); }).join(',\\ ')) + ' s' }, sol,
      ['The distance between the height ' + t('h') + ' and ' + t(z.H) + ' is ' + t('|h-' + z.H + '|') + '.', 'Solve both cases with the quadratic formula (or a graphing calculator) and round to the hundredth.'], 'an absolute value problem with a quadratic');
    return part;
  };

  /* an equation |x − a| = d from its solutions (L4 Ex 8b, #12) */
  B.fromSol = function (r, cp) {
    var s = pickWhere(function () { return { m: r.int(-15, 6), w: r.int(2, 18) }; }, function (z) { return z.m + z.w !== -z.m; });
    var m = s.m, n = s.m + s.w, a = (m + n) / 2, d = (n - m) / 2;
    var fields = [{ label: t('a='), name: 'a', mode: 'math', keys: 'fraction' }, { label: t('d='), name: 'd', mode: 'math', keys: 'fraction' }];
    var keys = [dt(a), dt(d)];
    return fieldsPart('The equation ' + t('|x-a|=d') + ' has the solutions ' + t(m) + ' and ' + t(n) + '. Determine ' + t('a') + ' and ' + t('d') + '.', fields, [K.value(a), K.value(d)], keys, t('a=' + dt(a)) + ', ' + t('d=' + dt(d)) + ': ' + t(A('x' + sgT(-a)) + '=' + dt(d)),
      t('a') + ' is the midpoint: ' + t('\\frac{' + m + '+' + (n < 0 ? '(' + n + ')' : n) + '}{2}=' + dt(a)) + '; ' + t('d') + ' is half the distance: ' + t('\\frac{' + n + '-(' + m + ')}{2}=' + dt(d)) + '.<br>' + t(A('x' + sgT(-a)) + '=' + dt(d)) + '. Check: ' + t(A(m + sgT(-a)) + '=' + dt(d)) + ' ✓',
      [t('|x-a|=d') + ' means ' + t('x') + ' is ' + t('d') + ' units from ' + t('a') + ': the two solutions are ' + t('a-d') + ' and ' + t('a+d') + '.', 'So ' + t('a') + ' is halfway between the solutions.'], 'an equation from its solutions', [[dt(a), dt(n - m)], [dt(-a), dt(d)]].filter(function (b) { return b.join() !== keys.join(); }),
      function (resp) {
        var x = numVal(resp[0]), y = numVal(resp[1]); if (x == null || y == null) return null;
        if (Math.abs(x - a) < 1e-9 && Math.abs(y - (n - m)) < 1e-9) return wrong(cp + 'wd-d', t('a') + ' is right. ' + t('d') + ' is the distance from the midpoint to each solution: half the distance between them.');
        if (Math.abs(x + a) < 1e-9 && a !== 0 && Math.abs(y - d) < 1e-9) return wrong(cp + 'wd-a', 'Check the sign of ' + t('a') + ': it is the midpoint of the solutions.');
        return null;
      });
  };

  /* the values of k for which an equation has no solution (L4 #14) */
  B.absKnone = function (r, cp) {
    var a = nz(r, 1, 4), b = nz(r, 1, 9), d = nz(r, 1, 12), m = r.pick([1, 2, 3]), inner = tx(lin(a, b)), flip = r.chance(0.4);
    var eq = flip ? 'k-' + (m === 1 ? '' : m) + A(inner) + '=' + d : (m === 1 ? '' : m) + A(inner) + '+k=' + d;
    var tgt = flip ? '\\{k\\mid k<' + d + ',\\ k\\in\\mathbb{R}\\}' : '\\{k\\mid k>' + d + ',\\ k\\in\\mathbb{R}\\}';
    var wr = flip ? [{ is: '\\{k\\mid k>' + d + '\\}', code: cp + 'k-dir', hint: 'Isolate: ' + t((m === 1 ? '' : m) + A(inner) + '=k-' + (d < 0 ? '(' + d + ')' : d)) + '. No solution when the right side is negative.' }, { is: '\\{k\\mid k\\le ' + d + '\\}', code: cp + 'k-end', hint: 'When ' + t('k=' + d) + ' the absolute value equals 0: one solution.' }]
      : [{ is: '\\{k\\mid k<' + d + '\\}', code: cp + 'k-dir', hint: 'Isolate: ' + t((m === 1 ? '' : m) + A(inner) + '=' + d + '-k') + '. No solution when the right side is negative.' }, { is: '\\{k\\mid k\\ge ' + d + '\\}', code: cp + 'k-end', hint: 'When ' + t('k=' + d) + ' the absolute value equals 0: one solution.' }];
    var p = KP.set('For which values of ' + t('k') + ' does ' + t(eq) + ' have no solution?', tgt, { v: 'k', tag: false, wrong: wr },
      'Isolate the absolute value: ' + t((m === 1 ? '' : m) + A(inner) + '=' + (flip ? 'k-' + (d < 0 ? '(' + d + ')' : d) : d + '-k')) + '. An absolute value is never negative, so there is no solution when ' + t(flip ? 'k-' + (d < 0 ? '(' + d + ')' : d) + '<0' : d + '-k<0') + ': ' + t(flip ? 'k<' + d : 'k>' + d) + '.',
      ['Isolate the absolute value: the other side is an expression in ' + t('k') + '.', 'There is no solution exactly when that side is negative (when it is 0 there is one solution).'], 'values of k with no solution');
    p.bad = wr.map(function (w) { return w.is; });
    return p;
  };

  /* ======================================================================================================
   * RF11 — reciprocal functions (Lessons 6–7)
   * ====================================================================================================== */
  function recLinSpec(r) { return pickWhere(function () { return { a: toR(r.pick([1, -1, 2, -2, 3, -3, 4, -4, 5, [1, 2], [-1, 2]])), b: nz(r, 1, 9) }; }, function (z) { var h = -z.b / rv(z.a); return Math.abs(h) <= 9 && toR(h)[1] <= 5; }); }

  /* the asymptotes and the y-intercept of y = 1/(ax + b) (L6 Ex 4–5, #3–4, L8 Ex 5a) */
  B.recLinFeat = function (r, cp) {
    var s = recLinSpec(r), cf = rv(s.a) < 0 && r.chance(0.5), den = linT(s.a, s.b, cf), h = toR(-s.b / rv(s.a)), yi = toR([1, s.b]);
    var aC = asyCheck(cp, { xs: [rv(h)], hz: true }, { wrongs: [{ xs: [-s.b], code: cp + 'asy-const', hint: 'The vertical asymptote is where the denominator is 0: solve ' + t(den + '=0') + '.' }] });
    var yC = K.value(yi, { diag: function (v) { if (Math.abs(v - s.b) < 1e-9) return { code: cp + 'yint-same', hint: 'That is the ' + t('y') + '-intercept of the line. The reciprocal’s is ' + t('\\frac{1}{' + s.b + '}') + '.' }; if (Math.abs(v + 1 / s.b) < 1e-9) return { code: cp + 'rpt-neg', hint: 'A number and its reciprocal have the same sign.' }; return null; } });
    var fields = [{ label: 'Asymptotes', mode: 'math', keys: 'u7asy', placeholder: 'e.g. x = 3, y = 0' }, { label: t('y') + '-intercept', name: 'y-intercept', mode: 'math', keys: 'u7asy', placeholder: 'a number' }];
    var keys = [asyT([h], true), rt(yi)];
    var bad = [[asyT([toR(-rv(h))], true), keys[1]], [asyT([h], false), keys[1]], [keys[0], String(s.b)], [asyT([-s.b], true), keys[1]]].filter(function (b) { return b.join('|') !== keys.join('|'); });
    return fieldsPart('For ' + t('y=\\dfrac{1}{' + den + '}') + ', state the equations of the asymptotes and the ' + t('y') + '-intercept.', fields, [aC, yC], keys, t(keys[0]) + '; ' + t('y') + '-intercept ' + t(keys[1]),
      'Vertical asymptote at the zero of the denominator: ' + t(den + '=0') + ', ' + t('x=' + rt(h)) + '. Horizontal asymptote ' + t('y=0') + ' (the reciprocal is never 0).<br>' + t('y') + '-intercept: the reciprocal of ' + t(s.b) + ', ' + t(rt(yi)) + '.',
      ['The vertical asymptote is at the ' + t('x') + '-intercept of the line ' + t('y=' + den) + '.', 'The ' + t('y') + '-intercept of the reciprocal is the reciprocal of the line’s ' + t('y') + '-intercept.'], 'asymptotes and y-intercept of y = 1/(ax + b)', bad);
  };

  /* the invariant points of y = 1/(ax + b) (L6 Ex 2, Ex 4–5, #4, L8 #9) */
  B.recLinInv = function (r, cp) {
    var s = pickWhere(function () { return recLinSpec(r); }, function (z) { return Math.abs(rv(z.a)) !== 1 || true; }), cf = rv(s.a) < 0 && r.chance(0.5), den = linT(s.a, s.b, cf), av = rv(s.a);
    var x1 = toR((1 - s.b) / av), x2 = toR((-1 - s.b) / av), h = toR(-s.b / av);
    var pairs = [[x1, 1], [x2, -1]];
    return ptsPart(cp, 'State the invariant points of the graphs of ' + t('y=' + den) + ' and ' + t('y=\\dfrac{1}{' + den + '}') + '.', pairs,
      [{ pairs: [[x1, 1]], code: cp + 'rinv-one', hint: 'There is another: where the line meets ' + t('y=-1') + ' (since ' + t('\\frac{1}{-1}=-1') + ').' }, { pairs: [[x2, -1]], code: cp + 'rinv-one', hint: 'There is another: where the line meets ' + t('y=1') + '.' }, { pairs: [[h, 0]], code: cp + 'rinv-zero', hint: 'Where the line is 0, the reciprocal is undefined (an asymptote). Invariant points are where ' + t('f(x)=1') + ' or ' + t('f(x)=-1') + '.' }, { pairs: [[x1, -1], [x2, 1]], code: cp + 'rinv-swap', hint: 'Substitute each ' + t('x') + ' back into the line to see which ' + t('y') + '-value it gives.' }],
      t(den + '=1') + ' gives ' + t('x=' + rt(x1)) + '; ' + t(den + '=-1') + ' gives ' + t('x=' + rt(x2)) + '.<br>Invariant points: ' + t(ptsT(pairs)) + '.',
      ['A number equal to its own reciprocal is ' + t('1') + ' or ' + t('-1') + '.', 'Solve ' + t(den + '=1') + ' and ' + t(den + '=-1') + '.'], 'invariant points of y = 1/(ax + b)', { noneOk: false, noneHint: 'A non-horizontal line meets both ' + t('y=1') + ' and ' + t('y=-1') + '.' });
  };

  /* matching points on y = f(x) and y = 1/f(x) (L6 Ex 6, #6, L7 Ex 7, #9, EP08 #10) */
  B.recPoint = function (r, cp) {
    var x = nz(r, 1, 8), fwd = r.chance(0.5), y = r.pick([2, 4, 5, 8, 10, -2, -4, -5, -8, -10, 0.5, -0.5, 0.25, -0.25, 0.2]), Y = 1 / y;
    var given = fwd ? y : Y, want = fwd ? Y : y, gT = dt(given), wT = Math.abs(want) < 1 && Number.isInteger(1 / want) ? (r.chance(0.5) ? dt(want) : rt(toR(want))) : dt(want);
    var wr = [{ p: [x, -want], code: cp + 'rpt-neg', hint: 'A number and its reciprocal have the <b>same</b> sign.' }, { p: [x, given], code: cp + 'rpt-same', hint: 'The ' + t('y') + '-value becomes its reciprocal: ' + t('\\frac{1}{' + gT + '}') + '.' }, { p: [toR(1 / x), given], code: cp + 'rpt-x', hint: 'The ' + t('x') + '-value stays; the ' + t('y') + '-value becomes its reciprocal.' }];
    if (Math.abs(given) === 1) wr = [];
    var part = pointPart(cp, 'The point ' + t('(' + x + ',\\ ' + gT + ')') + ' is on the graph of ' + (fwd ? t('y=f(x)') : t('y=\\dfrac{1}{f(x)}')) + '. State the matching point on the graph of ' + (fwd ? t('y=\\dfrac{1}{f(x)}') : t('y=f(x)')) + '.', [x, toR(want)], wr,
      'The ' + t('x') + '-value stays and the ' + t('y') + '-value becomes its reciprocal: ' + t('\\frac{1}{' + gT + '}=' + wT) + '. The point is ' + t('(' + x + ',\\ ' + wT + ')') + '.',
      ['A point ' + t('(x,\\ y)') + ' on one graph matches ' + t('\\left(x,\\ \\frac{1}{y}\\right)') + ' on the other.', 'The reciprocal of a decimal: ' + t('\\frac{1}{0.25}=4') + '.'], 'matching points on y = f(x) and y = 1/f(x)');
    part.key = '(' + x + ', ' + dt(want) + ')';
    return part;
  };

  /* which graph is y = 1/f(x)? (L6 Ex 8, #3) — MC */
  B.recMatch = function (r, cp) {
    var s = pickWhere(function () { return { a: r.pick([1, -1, 2, -2, 0.5, -0.5]), h: r.pick([-3, -2, -1, 1, 2, 3]) }; }, function (z) { return Math.abs(z.a * z.h) <= 5; });
    var a = s.a, h = s.h, f = function (x) { return a * (x - h); }, xr = [-6, 6];
    var gs = {
      ok: mini({ fns: recFns(f, [h], xr), vline: [h], aria: 'two branches beside a vertical asymptote' }),
      neg: mini({ fns: recFns(function (x) { return -f(x); }, [h], xr), vline: [h], aria: 'two branches beside a vertical asymptote' }),
      mirror: mini({ fns: recFns(function (x) { return f(-x); }, [-h], xr), vline: [-h], aria: 'two branches beside a vertical asymptote' }),
      abs: mini({ fns: recFns(function (x) { return Math.abs(f(x)); }, [h], xr), vline: [h], aria: 'two branches above the x-axis beside a vertical asymptote' })
    };
    var whys = { neg: 'A reciprocal has the same sign as ' + t('f(x)') + ': where the line is above the ' + t('x') + '-axis, so is ' + t('y=\\frac{1}{f(x)}') + '.', mirror: 'The vertical asymptote is at the ' + t('x') + '-intercept of the line, ' + t('x=' + h) + '.', abs: 'Where the line is below the ' + t('x') + '-axis, its reciprocal is negative too: one branch must be below the axis.' };
    var opts = ['ok', 'neg', 'mirror', 'abs'].map(function (k) { return { html: gs[k], right: k === 'ok', why: whys[k], code: k }; });
    var p = KP.mc(r, 'The graph of ' + t('y=f(x)') + ' is shown. Which graph is ' + t('y=\\dfrac{1}{f(x)}') + '?' + G({ fns: [crv(f)], hline: [1, -1], max: 260, aria: 'the graph of a line with the guide lines y = 1 and y = −1' }), opts,
      'The vertical asymptote is at the ' + t('x') + '-intercept of the line, ' + t('x=' + h) + ', and the horizontal asymptote is ' + t('y=0') + '. Each branch is on the same side of the ' + t('x') + '-axis as the line, passes through the invariant points on ' + t('y=\\pm 1') + ', and ' + (a > 0 ? 'falls' : 'rises') + ' where the line ' + (a > 0 ? 'rises' : 'falls') + '.',
      ['The reciprocal has the same sign as ' + t('f(x)') + '.', 'Where ' + t('f(x)=0') + ' the reciprocal has a vertical asymptote.'], 'graph of y = 1/f(x) from a line');
    p.input.columns = 2;
    return p;
  };

  /* a linear f from features of y = 1/f(x) (L6 Ex 7b, #7–8, #11, #14) */
  B.recLinBack = function (r, cp) {
    var kind = r.pick(['vaPoint', 'inv', 'yint']), T, wr = [], prompt, sol;
    if (kind === 'vaPoint') {
      var s = pickWhere(function () { return { h: nz(r, 1, 6), m: r.pick([1, 2, 3, 4, -1, -2, -3, [1, 2], [-1, 2]]), dx: r.pick([1, 2, 3, -1, -2]) }; }, function (z) { var fv = rv(z.m) * z.dx; return [2, 4, 5, 8, -2, -4, -5, -8, 0.5, -0.5, 10, -10].indexOf(fv) >= 0; });
      var x1 = s.h + s.dx, fv = rv(s.m) * s.dx, yv = 1 / fv; T = P.scale(lin(1, -s.h), toR(s.m));
      prompt = 'The graph of ' + t('y=\\dfrac{1}{f(x)}') + ', where ' + t('f') + ' is linear, has the vertical asymptote ' + t('x=' + s.h) + ' and passes through ' + t('(' + x1 + ',\\ ' + dt(yv) + ')') + '. Determine ' + t('f(x)') + '.';
      var mw = toR(yv / s.dx); wr.push({ is: P.scale(lin(1, -s.h), mw), code: cp + 'rl-point', hint: 'On ' + t('y=f(x)') + ' the point is ' + t('(' + x1 + ',\\ ' + dt(fv) + ')') + ': take the reciprocal of ' + t(dt(yv)) + '.' });
      sol = t('f(' + s.h + ')=0') + ' (the asymptote is at the zero of ' + t('f') + ') and ' + t('f(' + x1 + ')=\\frac{1}{' + dt(yv) + '}=' + dt(fv)) + '.<br>Slope ' + t('\\frac{' + dt(fv) + '-0}{' + x1 + '-(' + s.h + ')}=' + rt(s.m)) + ': ' + t('f(x)=' + rt(s.m) + '(x' + sgT(-s.h) + ')=' + tx(T)) + '.';
    } else if (kind === 'inv') {
      var s2 = pickWhere(function () { return { x1: r.int(-6, 5), w: nz(r, 1, 4) }; }, function (z) { return z.x1 + z.w <= 7 && z.x1 + z.w >= -7; });
      var x2 = s2.x1 + s2.w, mm = toR([-2, s2.w]); T = lin(mm, rv(mm) * -s2.x1 + 1); var hh = toR((s2.x1 + x2) / 2);
      prompt = 'The invariant points of the graphs of ' + t('y=f(x)') + ' and ' + t('y=\\dfrac{1}{f(x)}') + ', where ' + t('f') + ' is linear, are ' + t(pt(s2.x1, 1)) + ' and ' + t(pt(x2, -1)) + '. Determine ' + t('f(x)') + '.';
      wr.push({ is: lin(toR([2, s2.w]), -2 * s2.x1 / s2.w + 1), code: cp + 'rl-slope', hint: 'Slope ' + t('=\\frac{-1-1}{' + x2 + '-(' + s2.x1 + ')}') + '.' });
      sol = 'Both points are on the line ' + t('y=f(x)') + ': slope ' + t('\\frac{-1-1}{' + x2 + '-(' + s2.x1 + ')}=' + rt(mm)) + ', so ' + t('f(x)=' + tx(T)) + '. (Its zero, ' + t('x=' + rt(hh)) + ', is midway between the invariant points: the vertical asymptote.)';
    } else {
      var s3 = pickWhere(function () { return { h: nz(r, 1, 6), b: nz(r, 1, 6) }; }, function (z) { return z.b % z.h === 0 || (2 * z.b) % z.h === 0 || true; });
      var mm3 = toR([-s3.b, s3.h]); T = lin(mm3, s3.b);
      prompt = 'The graph of ' + t('y=\\dfrac{1}{f(x)}') + ', where ' + t('f') + ' is linear, has the vertical asymptote ' + t('x=' + s3.h) + ' and the ' + t('y') + '-intercept ' + t(rt(toR([1, s3.b]))) + '. Determine ' + t('f(x)') + '.';
      wr.push({ is: lin(toR([-1, s3.b * s3.h]), toR([1, s3.b])), code: cp + 'rl-point', hint: 'The line’s ' + t('y') + '-intercept is the reciprocal of ' + t(rt(toR([1, s3.b]))) + ', that is ' + t(s3.b) + '.' });
      sol = 'The line passes through ' + t(pt(s3.h, 0)) + ' (its zero) and ' + t(pt(0, s3.b)) + ' (the reciprocal of ' + t(rt(toR([1, s3.b]))) + '). Slope ' + t('\\frac{' + s3.b + '-0}{0-(' + s3.h + ')}=' + rt(mm3)) + ': ' + t('f(x)=' + tx(T)) + '.';
    }
    var p = KP.poly(prompt, T, { wrong: wr, expanded: false }, sol, ['The vertical asymptote of ' + t('y=\\frac{1}{f(x)}') + ' is at the zero of ' + t('f') + '; an invariant point is on both graphs; a point ' + t('(x,\\ k)') + ' on the reciprocal gives ' + t('\\left(x,\\ \\frac{1}{k}\\right)') + ' on the line.', 'Find two points on the line, then its slope and equation.'], 'a linear f from its reciprocal', { before: 'f(x)=' });
    return withBad(p, wr);
  };

  /* the vertical asymptotes of y = 1/f(x), f quadratic (L7 Ex 2, #2, L8 #20, EP08 #8) */
  B.recQuadVA = function (r, cp, o) {
    o = o || {};
    var kind = r.pick(o.kinds || ['two', 'twoA', 'sq', 'one', 'none']), ftex, xs, xsT, wr = [], sol;
    if (kind === 'two') { var Q = quadOf(quadSpec(r, { as: [1, 1, -1] })); ftex = tx(Q.poly); xs = [Q.r1, Q.s1]; sol = t(ftex + '=' + (Q.a < 0 ? '-' : '') + '(x' + sgT(-Q.r1) + ')(x' + sgT(-Q.s1) + ')') + ': two zeros, so two vertical asymptotes.'; }
    else if (kind === 'twoA') {
      var z = pickWhere(function () { return { m: r.pick([2, 3]), n: nz(r, 1, 5), s: nz(r, 1, 5) }; }, function (q) { return gcd(q.m, q.n) === 1; });
      var Pp = P.mul(lin(z.m, -z.n), lin(1, -z.s)); ftex = tx(Pp); xs = [toR([z.n, z.m]), z.s]; sol = t(ftex + '=(' + tx(lin(z.m, -z.n)) + ')(' + tx(lin(1, -z.s)) + ')') + ': zeros ' + t(rt(xs[0])) + ' and ' + t(z.s) + '.';
    } else if (kind === 'sq') { var n = r.int(1, 7), m2 = r.pick([1, 1, 4, 9]); ftex = (m2 === 1 ? '' : m2) + 'x^{2}-' + n * n; xs = [toR([-n, Math.sqrt(m2)]), toR([n, Math.sqrt(m2)])]; sol = t(ftex + '=0') + ' gives ' + t('x^{2}=' + rt(toR([n * n, m2]))) + ', ' + t('x=\\pm ' + rt(toR([n, Math.sqrt(m2)]))) + '.'; }
    else if (kind === 'one') {
      var z2 = pickWhere(function () { return { m: r.pick([1, 1, 2, 3]), n: nz(r, 1, 6) }; }, function (q) { return gcd(q.m, q.n) === 1; });
      ftex = tx(P.mul(lin(z2.m, -z2.n), lin(z2.m, -z2.n))); xs = [toR([z2.n, z2.m])]; sol = t(ftex + '=(' + tx(lin(z2.m, -z2.n)) + ')^{2}') + ': one zero (a double root), so one vertical asymptote.';
      wr.push({ xs: [rv(xs[0]), -rv(xs[0])], code: cp + 'asy-two', hint: 'A perfect square ' + t('(' + tx(lin(z2.m, -z2.n)) + ')^{2}') + ' has only one zero.' });
    } else {
      var z3 = pickWhere(function () { return { b: r.int(-6, 6), c: r.int(1, 20), vf: r.chance(0.4), a: r.pick([1, 2, -1, -3]), p: nz(r, 1, 4), q: r.int(1, 6) }; }, function (q) { return q.b * q.b - 4 * q.c < 0; });
      if (z3.vf) { ftex = vtxT(z3.a, z3.p, z3.a > 0 ? z3.q : -z3.q); sol = 'The parabola opens ' + (z3.a > 0 ? 'up from a vertex above' : 'down from a vertex below') + ' the ' + t('x') + '-axis: no zeros, so no vertical asymptotes.'; wr.push({ xs: [z3.p], code: cp + 'asy-extra', hint: 'At the vertex ' + t('f') + ' is not 0. ' + t('f') + ' has no zeros, so there is no vertical asymptote.' }); }
      else { ftex = tx(quad(1, z3.b, z3.c)); sol = t('b^{2}-4ac=' + (z3.b * z3.b) + '-' + 4 * z3.c + '=' + (z3.b * z3.b - 4 * z3.c) + '<0') + ': no zeros, so no vertical asymptotes.'; if (z3.b) wr.push({ xs: [-z3.b / 2], code: cp + 'asy-extra', hint: 'At the vertex ' + t('f') + ' is not 0. ' + t('f') + ' has no zeros, so there is no vertical asymptote.' }); }
      xs = [];
    }
    var xv = xs.map(rv);
    if (xv.length && !sameSet(xv, xv.map(function (x) { return -x; }))) wr.push({ xs: xv.map(function (x) { return -x; }), code: cp + 'asy-sign', hint: 'Solve ' + t('f(x)=0') + ' again: the asymptotes are at the zeros.' });
    var T = { xs: xv, hz: false, xsT: xs.map(function (x) { return toR(rv(x)); }) };
    return asyPart(cp, 'Let ' + t('f(x)=' + ftex) + '. State the equations of the vertical asymptotes of the graph of ' + t('y=\\dfrac{1}{f(x)}') + ' (or write none).', T, { wrongs: wr }, sol + (xs.length ? '<br>' + t(asyT(T.xsT, false)) : ''),
      ['The vertical asymptotes are at the zeros of ' + t('f') + ': factor, or use the discriminant.', 'A quadratic has two, one or no real zeros.'], 'vertical asymptotes of y = 1/f(x), f quadratic');
  };

  /* f(x) = a(x − p)² + q with 1/q a short decimal or a simple fraction */
  function recVtx(r) { return pickWhere(function () { return { a: toR(r.pick([1, -1, 2, -2, 3, [1, 2], [-1, 2], -3])), p: nz(r, 1, 5), q: r.pick([2, 3, 4, 5, 8, 10, -2, -3, -4, -5, -8, -10, [1, 2], [-1, 2], [1, 4]]) }; }, function () { return true; }); }

  /* the turning point of y = 1/f(x) and its type (L7 Ex 3, #3, L8 Ex 5b, EP08 #9) */
  B.recQuadTurn = function (r, cp) {
    var s = recVtx(r), av = rv(s.a), qv = rv(s.q), tp = [s.p, toR(1 / qv)], type = av > 0 ? 'maximum' : 'minimum', other = av > 0 ? 'minimum' : 'maximum';
    var gen = r.chance(0.45) && av === 1 && Number.isInteger(qv), ftex = gen ? tx(quad(1, -2 * s.p, s.p * s.p + qv)) : vtxT(s.a, s.p, s.q);
    var pc = pointChk(cp, tp, [{ p: [s.p, qv], code: cp + 'turn-q', hint: 'That is the vertex of ' + t('f') + '. The reciprocal’s turning point has ' + t('y=\\frac{1}{q}') + '.' }, { p: [-s.p, toR(1 / qv)], code: cp + 'pt-xchg', hint: 'The turning point has the same ' + t('x') + '-value as the vertex of ' + t('f') + '.' }, { p: [s.p, toR(-1 / qv)], code: cp + 'rpt-neg', hint: 'A reciprocal keeps the sign: ' + t('\\frac{1}{' + rt(s.q) + '}') + '.' }]);
    var typeChk = function (v) { var l = plainLow(v); if (/max/.test(l) && !/min/.test(l)) return type === 'maximum' ? ok() : wrong(cp + 'turn-type', 'Check the type: ' + t('f') + ' opens ' + (av > 0 ? 'up' : 'down') + ', so its vertex is a ' + (av > 0 ? 'minimum' : 'maximum') + '; the reciprocal switches it.'); if (/min/.test(l) && !/max/.test(l)) return type === 'minimum' ? ok() : wrong(cp + 'turn-type', 'Check the type: ' + t('f') + ' opens ' + (av > 0 ? 'up' : 'down') + ', so its vertex is a ' + (av > 0 ? 'minimum' : 'maximum') + '; the reciprocal switches it.'); return form(cp + 'type-word', 'Type <b>maximum</b> or <b>minimum</b>.'); };
    var fields = [{ label: 'Turning point', mode: 'math', keys: 'u7pts', placeholder: '(x, y)' }, { label: 'Type (maximum or minimum)', name: 'type', mode: 'text', wide: true, placeholder: 'maximum or minimum' }];
    var keys = [pt(tp[0], tp[1]), type];
    var vf = gen ? t(ftex + '=(x' + sgT(-s.p) + ')^{2}' + sgT(s.q)) + ': ' : '';
    return fieldsPart('Let ' + t('f(x)=' + ftex) + '. State the coordinates of the turning point of the graph of ' + t('y=\\dfrac{1}{f(x)}') + ', and whether it is a maximum or a minimum point.', fields, [pc.check, typeChk], keys, t(keys[0]) + ', a ' + type + ' point',
      vf + 'the vertex of ' + t('f') + ' is ' + t(pt(s.p, s.q)) + ', a ' + other + ' (' + t('a' + (av > 0 ? '>' : '<') + '0') + '). The reciprocal has its turning point at ' + t('\\left(' + s.p + ',\\ \\frac{1}{' + rt(s.q) + '}\\right)=' + pt(tp[0], tp[1])) + ', and the type is switched: a <b>' + type + '</b> point.',
      ['The turning point of ' + t('y=\\frac{1}{f(x)}') + ' is ' + t('\\left(p,\\ \\frac{1}{q}\\right)') + ' where ' + t('(p,\\ q)') + ' is the vertex of ' + t('f') + '.', 'Where ' + t('f') + ' is smallest its reciprocal is largest (on the same side of the axis): a minimum of ' + t('f') + ' becomes a maximum.'], 'turning point of y = 1/f(x)',
      [[keys[0], other], [pt(s.p, s.q), type]], function (resp) { var a1 = pc.check(resp[0]); if (a1.v === 'correct' && /max|min/.test(plainLow(resp[1])) && typeChk(resp[1]).v === 'wrong') return typeChk(resp[1]); return null; });
  };

  /* the range of y = 1/f(x), f quadratic (L7 Ex 3, #3, #13, L8 #12, #19) */
  B.recQuadRange = function (r, cp) {
    var s = recVtx(r), av = rv(s.a), qv = rv(s.q), iq = rt(toR(1 / qv)), byRange = r.chance(0.4), S = function (c) { return '\\{y\\mid ' + c + ',\\ y\\in\\mathbb{R}\\}'; };
    var target, wr = [], why;
    if (av > 0 && qv > 0) { target = S('0<y\\le ' + iq); wr.push({ is: S('y\\ge ' + iq), code: cp + 'rr-dir', hint: 'Where ' + t('f') + ' is large its reciprocal is small: ' + t('f(x)\\ge ' + rt(s.q)) + ' gives ' + t('0<\\frac{1}{f(x)}\\le ' + iq) + '.' }, { is: S('0\\le y\\le ' + iq), code: cp + 'rr-end', hint: 'The reciprocal is never 0 (' + t('y=0') + ' is an asymptote).' }); why = t('f(x)\\ge ' + rt(s.q)) + ', all positive, so ' + t('0<\\frac{1}{f(x)}\\le ' + iq); }
    else if (av > 0) { target = S('y\\le ' + iq + '\\text{ or }y>0'); wr.push({ is: S(iq + '\\le y<0'), code: cp + 'rr-dir', hint: 'Between the zeros ' + t(rt(s.q) + '\\le f(x)<0') + ', so ' + t('\\frac{1}{f(x)}\\le ' + iq) + ' (dividing by small negatives gives large negatives).' }, { is: S('y\\le ' + iq), code: cp + 'rr-branch', hint: 'Outside the zeros ' + t('f(x)>0') + ', so the reciprocal also takes every positive value.' }, { is: S('y>0'), code: cp + 'rr-branch', hint: 'Between the zeros ' + t('f') + ' is negative, so the reciprocal has negative values too.' }); why = t(rt(s.q) + '\\le f(x)<0') + ' gives ' + t('\\frac{1}{f(x)}\\le ' + iq) + ', and ' + t('f(x)>0') + ' gives ' + t('\\frac{1}{f(x)}>0'); }
    else if (qv > 0) { target = S('y<0\\text{ or }y\\ge ' + iq); wr.push({ is: S('0<y\\le ' + iq), code: cp + 'rr-dir', hint: 'Between the zeros ' + t('0<f(x)\\le ' + rt(s.q)) + ', so ' + t('\\frac{1}{f(x)}\\ge ' + iq) + '.' }, { is: S('y\\ge ' + iq), code: cp + 'rr-branch', hint: 'Outside the zeros ' + t('f(x)<0') + ', so the reciprocal also takes every negative value.' }, { is: S('y<0'), code: cp + 'rr-branch', hint: 'Between the zeros ' + t('f') + ' is positive, so the reciprocal has positive values too.' }); why = t('0<f(x)\\le ' + rt(s.q)) + ' gives ' + t('\\frac{1}{f(x)}\\ge ' + iq) + ', and ' + t('f(x)<0') + ' gives ' + t('\\frac{1}{f(x)}<0'); }
    else { target = S(iq + '\\le y<0'); wr.push({ is: S('y\\le ' + iq), code: cp + 'rr-dir', hint: t('f(x)\\le ' + rt(s.q)) + ' (all negative) gives ' + t(iq + '\\le\\frac{1}{f(x)}<0') + '.' }, { is: S(iq + '\\le y\\le 0'), code: cp + 'rr-end', hint: 'The reciprocal is never 0 (' + t('y=0') + ' is an asymptote).' }); why = t('f(x)\\le ' + rt(s.q)) + ', all negative, so ' + t(iq + '\\le\\frac{1}{f(x)}<0'); }
    var fR = av > 0 ? S('y\\ge ' + rt(s.q)) : S('y\\le ' + rt(s.q));
    wr.push({ is: fR, code: cp + 'rr-f', hint: 'That is the range of ' + t('y=f(x)') + '. Take the reciprocal of each part of it.' });
    var stem = byRange ? 'The range of the quadratic function ' + t('y=f(x)') + ' is ' + t(fR) + '. State the range of ' + t('y=\\dfrac{1}{f(x)}') + '.' : 'Let ' + t('f(x)=' + vtxT(s.a, s.p, s.q)) + '. State the range of ' + t('y=\\dfrac{1}{f(x)}') + '.';
    var p = KP.set(stem, target, { v: 'y', wrong: wr }, (byRange ? '' : 'The range of ' + t('f') + ' is ' + t(fR) + '. ') + why + '.<br>Range: ' + t(target) + '.',
      ['Start from the range of ' + t('f') + ' and take the reciprocal of each part; the reciprocal keeps the sign and is never 0.', 'Large values give reciprocals near 0; values near 0 give large reciprocals.'], 'range of y = 1/f(x)');
    p.bad = wr.map(function (w) { return w.is; });
    return p;
  };

  /* the exact invariant points of y = 1/f(x), f quadratic (L7 Ex 1e, #1c, #6, L8 #10) */
  B.recQuadInv = function (r, cp) {
    var s = pickWhere(function () { return { b: r.int(-6, 6), c: r.int(-9, 9) }; }, function (z) { var D1 = z.b * z.b - 4 * (z.c - 1), D2 = z.b * z.b - 4 * (z.c + 1); return D1 >= 0 && (D1 > 0 || D2 > 0) && z.c !== 0 && (z.b !== 0 || r.chance(0.4)) && !(isSq(D1) && isSq(D2)) && (D2 !== 0 || r.chance(0.5)); });
    var ftex = tx(quad(1, s.b, s.c)), up = qroots(1, s.b, s.c - 1), dn = qroots(1, s.b, s.c + 1);
    var pairs = up.map(function (x) { return [x.v, 1, '(' + x.tex + ',\\ 1)']; }).concat(dn.map(function (x) { return [x.v, -1, '(' + x.tex + ',\\ -1)']; }));
    var zs = qroots(1, s.b, s.c), wr = [];
    if (up.length && dn.length) { wr.push({ pairs: up.map(function (x) { return [x.v, 1]; }), code: cp + 'rinv-one', hint: 'Also solve ' + t('f(x)=-1') + ': ' + t('\\frac{1}{-1}=-1') + '.' }); wr.push({ pairs: dn.map(function (x) { return [x.v, -1]; }), code: cp + 'rinv-one', hint: 'Also solve ' + t('f(x)=1') + '.' }); }
    if (zs.length) wr.push({ pairs: zs.map(function (x) { return [x.v, 0]; }), code: cp + 'rinv-zero', hint: 'Where ' + t('f(x)=0') + ' the reciprocal is undefined: those are asymptotes. Invariant points are where ' + t('f(x)=\\pm 1') + '.' });
    var cs = function (cst, yv, rs) { return t(ftex + '=' + yv) + ': ' + t(tx(quad(1, s.b, cst)) + '=0') + (rs.length ? ', ' + t('x=' + rs.map(function (x) { return x.tex; }).join(',\\ ')) : ': no real roots'); };
    var part = ptsPart(cp, 'Let ' + t('f(x)=' + ftex) + '. Determine the exact coordinates of the invariant points of the graphs of ' + t('y=f(x)') + ' and ' + t('y=\\dfrac{1}{f(x)}') + '.', pairs, wr,
      cs(s.c - 1, 1, up) + '.<br>' + cs(s.c + 1, -1, dn) + '.<br>Invariant points: ' + t(ptsT(pairs)) + '.',
      ['Invariant points are where ' + t('f(x)=1') + ' or ' + t('f(x)=-1') + '.', 'Solve each quadratic (the quadratic formula gives exact radicals).'], 'invariant points of y = 1/f(x), f quadratic', { noneOk: false, noneHint: 'Solve ' + t('f(x)=1') + ' and ' + t('f(x)=-1') + ': at least one has real roots.' });
    return part;
  };

  /* a quadratic f from features of y = 1/f(x) (L7 Ex 6, #7–8, L8 Ex 6d, #11, EP08 C3) */
  B.recQuadBack = function (r, cp, o) {
    o = o || {};
    var kind = r.pick(o.kinds || ['turnY', 'turnY', 'asyTurn']), T, wr = [], prompt, sol;
    if (kind === 'turnY') {
      var s = pickWhere(function () { return { a: r.pick([1, 2, 3, -1, -2, [1, 2], [-1, 2]]), p: nz(r, 1, 4), q: r.pick([2, 3, 4, 5, -2, -3, -4, -5]) }; }, function (z) { var c = rv(z.a) * z.p * z.p + z.q; return Number.isInteger(c) && c !== 0 && Math.abs(c) <= 30 && Math.abs(c) !== 1 && (rv(z.a) * z.q > 0 || r.chance(0.3)); });
      var av = rv(s.a), c = av * s.p * s.p + s.q, typ = av > 0 ? 'maximum' : 'minimum', iq = 1 / s.q, iqT = r.chance(0.5) && [2, 4, 5, -2, -4, -5].indexOf(s.q) >= 0 ? dt(iq) : rt(toR(iq));
      T = P.add(P.scale(P.mul(lin(1, -s.p), lin(1, -s.p)), toR(s.a)), P.num(s.q));
      prompt = 'The graph of ' + t('y=\\dfrac{1}{f(x)}') + ', where ' + t('f') + ' is a quadratic function, has a ' + typ + ' point ' + t('(' + s.p + ',\\ ' + iqT + ')') + ' and the ' + t('y') + '-intercept ' + t(rt(toR([1, c]))) + '. Determine ' + t('f(x)') + '.';
      var aw = toR((1 / c - iq) / (s.p * s.p)); if (aw) wr.push({ is: P.add(P.scale(P.mul(lin(1, -s.p), lin(1, -s.p)), aw), P.num(toR(iq))), code: cp + 'rb-vertex', hint: 'The vertex of ' + t('f') + ' is ' + t('(' + s.p + ',\\ \\frac{1}{' + iqT + '})=' + pt(s.p, s.q)) + ', and ' + t('f(0)=' + c) + ': take the reciprocals.' });
      wr.push({ is: P.add(P.scale(P.mul(lin(1, -s.p), lin(1, -s.p)), rneg(s.a)), P.num(s.q)), code: cp + 'rb-a', hint: 'Use ' + t('f(0)=' + c) + ' to find ' + t('a') + ' again.' });
      sol = 'A ' + typ + ' of the reciprocal comes from a ' + (av > 0 ? 'minimum' : 'maximum') + ' of ' + t('f') + ': vertex ' + t('\\left(' + s.p + ',\\ \\frac{1}{' + iqT + '}\\right)=' + pt(s.p, s.q)) + '. The ' + t('y') + '-intercept gives ' + t('f(0)=' + c) + '.<br>' + t('f(x)=a(x' + sgT(-s.p) + ')^{2}' + sgT(s.q)) + ': ' + t(c + '=' + s.p * s.p + 'a' + sgT(s.q)) + ', ' + t('a=' + rt(s.a)) + '.<br>' + t('f(x)=' + vtxT(s.a, s.p, s.q) + '=' + tx(T)) + '.';
    } else {
      var z = pickWhere(function () { return { r1: r.int(-5, 2), w: r.pick([2, 4, 6]), a: r.pick([1, -1, 2, -2, [1, 2], [-1, 2]]) }; }, function (q) { var pv = rv(q.a) * (-(q.w / 2) * (q.w / 2)); return q.r1 + q.w <= 6 && [1, 2, 4, 5, 8, 9, 16, 18, -1, -2, -4, -5, -8, -9, -16, -18].indexOf(pv) >= 0 && Math.abs(pv) !== 1; });
      var s1 = z.r1 + z.w, pp = z.r1 + z.w / 2, fv = rv(z.a) * (pp - z.r1) * (pp - s1), k = 1 / fv, kT = [2, 4, 5, 8, -2, -4, -5, -8].indexOf(fv) >= 0 && r.chance(0.5) ? dt(k) : rt(toR(k)), typ2 = fv < 0 ? 'maximum' : 'minimum';
      T = P.scale(P.mul(lin(1, -z.r1), lin(1, -s1)), toR(z.a));
      prompt = 'The graph of ' + t('y=\\dfrac{1}{f(x)}') + ', where ' + t('f') + ' is a quadratic function, has the vertical asymptotes ' + t('x=' + z.r1) + ' and ' + t('x=' + s1) + ' and a ' + typ2 + ' point ' + t('(' + pp + ',\\ ' + kT + ')') + '. Determine ' + t('f(x)') + '.';
      var aw2 = toR(k / ((pp - z.r1) * (pp - s1))); if (aw2) wr.push({ is: P.scale(P.mul(lin(1, -z.r1), lin(1, -s1)), aw2), code: cp + 'rb-vertex', hint: 'The vertex of ' + t('f') + ' has ' + t('y') + '-coordinate ' + t('\\frac{1}{' + kT + '}=' + rt(toR(fv))) + ', not ' + t(kT) + '.' });
      wr.push({ is: P.scale(P.mul(lin(1, -z.r1), lin(1, -s1)), rneg(z.a)), code: cp + 'rb-a', hint: 'Check the sign of ' + t('a') + ': ' + t('f(' + pp + ')') + ' must be ' + t(rt(toR(fv))) + '.' });
      sol = 'The asymptotes are the zeros of ' + t('f') + ': ' + t('f(x)=a(x' + sgT(-z.r1) + ')(x' + sgT(-s1) + ')') + '. The turning point gives the vertex of ' + t('f') + ': ' + t('\\left(' + pp + ',\\ \\frac{1}{' + kT + '}\\right)=' + pt(pp, toR(fv))) + '.<br>' + t('a(' + (pp - z.r1) + ')(' + (pp - s1) + ')=' + rt(toR(fv))) + ', so ' + t('a=' + rt(z.a)) + ': ' + t('f(x)=' + tx(T)) + '.';
    }
    var p = KP.poly(prompt, T, { wrong: wr, expanded: false }, sol, ['The turning point ' + t('(p,\\ k)') + ' of the reciprocal comes from the vertex ' + t('\\left(p,\\ \\frac{1}{k}\\right)') + ' of ' + t('f') + '; vertical asymptotes are zeros of ' + t('f') + '; a ' + t('y') + '-intercept ' + t('\\frac{1}{c}') + ' means ' + t('f(0)=c') + '.', 'Write ' + t('f') + ' in vertex or factored form and use the other fact to find ' + t('a') + '.'], 'a quadratic f from its reciprocal', { before: 'f(x)=' });
    return withBad(p, wr);
  };

  /* a parameter from the reciprocal's features (L7 #18, EP08 #14, L8 #26) */
  B.recQuadK = function (r, cp) {
    var kind = r.pick(['maxk', 'onek', 'aval']);
    if (kind === 'maxk') {
      var p = nz(r, 1, 5), q = r.pick([2, 4, 5, 10, -2, -4, -5, -10]), k = p * p + q;
      return valPart(cp, 'The graph of ' + t('y=\\dfrac{1}{x^{2}' + sgT(-2 * p) + 'x+k}') + ' has a maximum point ' + t('(' + p + ',\\ ' + dt(1 / q) + ')') + '. Determine ' + t('k') + '.', k,
        [{ v: p * p + 1 / q, code: cp + 'k-vertex', hint: 'The vertex of ' + t('f') + ' has ' + t('y') + '-coordinate ' + t('\\frac{1}{' + dt(1 / q) + '}=' + q) + '.' }, { v: q - p * p, code: cp + 'k-sign', hint: 'Complete the square: ' + t('x^{2}' + sgT(-2 * p) + 'x+k=(x' + sgT(-p) + ')^{2}+k-' + p * p) + '.' }],
        'The maximum point of the reciprocal comes from the vertex of ' + t('f(x)=x^{2}' + sgT(-2 * p) + 'x+k') + ': ' + t('\\left(' + p + ',\\ \\frac{1}{' + dt(1 / q) + '}\\right)=' + pt(p, q)) + '.<br>' + t('f(' + p + ')=' + p * p + sgT(-2 * p * p) + '+k=k-' + p * p) + ', so ' + t('k-' + p * p + '=' + q) + ' and ' + t('k=' + k) + '.',
        ['The turning point of the reciprocal is ' + t('\\left(p,\\ \\frac{1}{q}\\right)') + ' where ' + t('(p,\\ q)') + ' is the vertex of the quadratic.', 'Find ' + t('f(' + p + ')') + ' in terms of ' + t('k') + '.'], 'k from the turning point of y = 1/f(x)', { exact: false });
    }
    if (kind === 'onek') {
      var n = r.int(2, 8), c = n * n;
      return valPart(cp, 'The graph of ' + t('y=\\dfrac{1}{x^{2}+kx+' + c + '}') + ', where ' + t('k>0') + ', has exactly one vertical asymptote. Determine ' + t('k') + '.', 2 * n,
        [{ v: n, code: cp + 'k-half', hint: 'One zero means a perfect square: ' + t('(x+' + n + ')^{2}=x^{2}+' + 2 * n + 'x+' + c) + ' (or ' + t('k^{2}-4(' + c + ')=0') + ').' }, { v: -2 * n, code: cp + 'k-sign', hint: t('k>0') + '.' }, { v: c, code: cp + 'k-half', hint: 'Use the discriminant: ' + t('k^{2}-4(1)(' + c + ')=0') + '.' }],
        'One vertical asymptote means ' + t('f') + ' has exactly one zero: ' + t('b^{2}-4ac=k^{2}-' + 4 * c + '=0') + ', so ' + t('k=\\pm ' + 2 * n) + '. Since ' + t('k>0') + ', ' + t('k=' + 2 * n) + ' (the asymptote is ' + t('x=-' + n) + ').',
        ['The vertical asymptotes are at the zeros of the quadratic.', 'Exactly one zero: the discriminant is 0.'], 'k for one vertical asymptote', { exact: false });
    }
    var s = pickWhere(function () { return { b: nz(r, 1, 6), a1: r.int(-7, 6) }; }, function (z) { var a2 = -z.b - z.a1, n = -z.a1 * a2; return a2 !== z.a1 && n >= 2 && n <= 30; });
    var a2 = -s.b - s.a1, nn = -s.a1 * a2, vals = [s.a1, a2].sort(function (x, y) { return x - y; });
    var wrongR = qroots(1, s.b, nn);
    return rootsPart(cp, 'Let ' + t('f(x)=' + tx(quad(1, s.b, 0))) + '. The point ' + t('\\left(a,\\ \\frac{1}{' + nn + '}\\right)') + ' is on the graph of ' + t('y=\\dfrac{1}{f(x)}') + '. Determine the possible values of ' + t('a') + '.', vals,
      { v: 'a', wrongs: wrongR.length ? [{ vals: wrongR, code: cp + 'rpt-neg', hint: 'Solve ' + t('f(a)=' + nn) + ': the reciprocal of ' + t('\\frac{1}{' + nn + '}') + ' is ' + t(nn) + '.' }] : [] },
      t('\\frac{1}{f(a)}=\\frac{1}{' + nn + '}') + ', so ' + t('f(a)=' + nn) + ': ' + t(tx(quad(1, s.b, -nn)).replace(/x/g, 'a') + '=0') + ', ' + t('(a' + sgT(-vals[0]) + ')(a' + sgT(-vals[1]) + ')=0') + ', ' + t('a=' + vals[0]) + ' or ' + t('a=' + vals[1]) + '.',
      ['To find where the reciprocal equals ' + t('k') + ', solve ' + t('f(x)=\\frac{1}{k}') + '.', 'Write the quadratic equation in standard form and factor it.'], 'points on y = 1/f(x) from a y-value');
  };

  HW.u7assess = { B: B, rootsPart: rootsPart };

  /* keypads: solutions with "no solution", points with √ and "none", asymptote equations */
  var W = HW.widgets;
  if (W && W.KEYSETS) {
    var d = function (n) { return { label: String(n), tex: String(n), plain: String(n) }; };
    var KY = { del: { label: '⌫', fn: 'del', title: 'Delete' }, clear: { label: 'clear', fn: 'clear' }, left: { label: '◀', fn: 'left', title: 'Move left' }, right: { label: '▶', fn: 'right', title: 'Move right (out of a box)' }, enter: { label: 'Check ↵', fn: 'enter', wide: true },
      minus: { label: '−', tex: '-', plain: '-' }, plus: { label: '+', tex: '+', plain: '+' }, dot: { label: '.', tex: '.', plain: '.' }, comma: { label: ',', tex: ',', plain: ', ' }, frac: { label: '<sup>a</sup>⁄<sub>b</sub>', tex: '\\frac{#@}{#?}', plain: '/', title: 'Fraction' },
      sqrt: { label: '√', tex: '\\sqrt{#0}', plain: 'sqrt(' }, pm: { label: '±', tex: '\\pm ', plain: '±' }, par: { label: '( )', tex: '\\left(#0\\right)', plain: '(', title: 'A point: type x, y inside' } };
    W.KEYSETS.u7sol = function (opt) {
      var v = (opt && opt.vars && opt.vars[0]) || 'x';
      return [[d(7), d(8), d(9), KY.frac, KY.del], [d(4), d(5), d(6), KY.sqrt, KY.clear], [d(1), d(2), d(3), KY.minus, KY.left, KY.right], [d(0), KY.dot, { label: '<i>' + v + '</i> =', tex: v + '=', plain: v + ' = ' }, KY.comma, KY.pm, KY.plus], [{ label: 'no solution', tex: '\\text{no solution}', plain: 'no solution' }, KY.enter]];
    };
    W.KEYSETS.u7pts = function () { return [[d(7), d(8), d(9), KY.par, KY.del], [d(4), d(5), d(6), KY.frac, KY.clear], [d(1), d(2), d(3), KY.minus, KY.left, KY.right], [d(0), KY.dot, KY.comma, KY.sqrt, KY.pm, KY.plus], [{ label: 'none', tex: '\\text{none}', plain: 'none' }, KY.enter]]; };
    W.KEYSETS.u7asy = function () { return [[d(7), d(8), d(9), KY.frac, KY.del], [d(4), d(5), d(6), KY.sqrt, KY.clear], [d(1), d(2), d(3), KY.minus, KY.left, KY.right], [d(0), KY.dot, { label: '<i>x</i> =', tex: 'x=', plain: 'x = ' }, { label: '<i>y</i> =', tex: 'y=', plain: 'y = ' }, KY.comma, KY.pm], [{ label: 'none', tex: '\\text{none}', plain: 'none' }, KY.enter]]; };
    if (W.KEYHELP) {
      W.KEYHELP.u7sol = ['Separate solutions with a comma, e.g. ' + HW.k('x=3,\\ x=-5') + '; use <b>±</b> for a pair, or the <b>no solution</b> key.', 'Type e.g. <code>x = 3, x = -5</code> or <code>no solution</code>.'];
      W.KEYHELP.u7pts = ['Press <b>( )</b> for each point, type <i>x</i> <b>,</b> <i>y</i> inside, press <b>▶</b> to step out, then a comma before the next point (or the <b>none</b> key).', 'Type e.g. <code>(1, 0), (5, 0)</code> or <code>none</code>.'];
      W.KEYHELP.u7asy = ['Write each asymptote as an equation, separated by commas, e.g. ' + HW.k('x=2,\\ y=0') + ' (or the <b>none</b> key).', 'Type e.g. <code>x = 2, y = 0</code>.'];
    }
  }

  /* ======================================================================================================
   * The unit test
   * ====================================================================================================== */
  var CP = 'u7t-';
  function mk(fn, o) { return function (r) { return fn(r, CP, o); }; }
  function Pt(id, outcome, level, make) { return { id: id, outcome: outcome, level: level, make: make }; }
  var QUESTIONS = [
    // ---------------- Beginning ----------------
    { num: '1', outcome: 'AN1', lesson: 'L1', stem: 'Absolute value.', parts: [Pt('1a', 'AN1', 'BEG', mk(B.evalAbs)), Pt('1b', 'AN1', 'BEG', mk(B.distance, { kinds: ['int', 'dec', 'frac'] }))] },
    { num: '2', outcome: 'RF2', lesson: 'L2, L3', stem: 'Graphs of y = |f(x)|.', parts: [Pt('2a', 'RF2', 'BEG', mk(B.linMatch)), Pt('2b', 'RF2', 'BEG', mk(B.quadInv))] },
    { num: '3', outcome: 'RF2', lesson: 'L4, L5', stem: 'Solve.', parts: [Pt('3a', 'RF2', 'BEG', mk(B.absConst, { modes: ['iso', 'iso', 'none'] })), Pt('3b', 'RF2', 'BEG', mk(B.absQuadK, { modes: ['sq'] }))] },
    { num: '4', outcome: 'RF11', lesson: 'L6, L7', stem: 'Reciprocal functions.', parts: [Pt('4a', 'RF11', 'BEG', mk(B.recLinFeat)), Pt('4b', 'RF11', 'BEG', mk(B.recLinInv)), Pt('4c', 'RF11', 'BEG', mk(B.recQuadVA))] },
    // ---------------- Progressing ----------------
    { num: '5', outcome: 'AN1', lesson: 'L1', stem: 'Absolute value.', parts: [Pt('5a', 'AN1', 'PRG', mk(B.order)), Pt('5b', 'AN1', 'PRG', mk(B.trip))] },
    { num: '6', outcome: 'RF2', lesson: 'L2', stem: 'Piecewise form.', parts: [Pt('6', 'RF2', 'PRG', mk(B.linPiece))] },
    { num: '7', outcome: 'RF2', lesson: 'L3', stem: 'The absolute value of a quadratic function.', parts: [Pt('7a', 'RF2', 'PRG', mk(B.quadPiece)), Pt('7b', 'RF2', 'PRG', mk(B.quadRange))] },
    { num: '8', outcome: 'RF2', lesson: 'L4, L5', stem: 'Solve.', parts: [Pt('8a', 'RF2', 'PRG', mk(B.absLin)), Pt('8b', 'RF2', 'PRG', mk(B.absQuadK, { modes: ['gen', 'gen', 'iso'] }))] },
    { num: '9', outcome: 'RF11', lesson: 'L6', stem: 'Reciprocals of linear functions.', parts: [Pt('9a', 'RF11', 'PRG', mk(B.recMatch)), Pt('9b', 'RF11', 'PRG', mk(B.recLinBack))] },
    { num: '10', outcome: 'RF11', lesson: 'L7', stem: 'Reciprocals of quadratic functions.', parts: [Pt('10a', 'RF11', 'PRG', mk(B.recQuadTurn)), Pt('10b', 'RF11', 'PRG', mk(B.recQuadRange))] },
    // ---------------- Mastery ----------------
    { num: '11', outcome: 'AN1', lesson: 'L1', stem: 'Without absolute value symbols.', parts: [Pt('11', 'AN1', 'MAS', mk(B.simplify))] },
    { num: '12', outcome: 'RF2', lesson: 'L2, L3', stem: 'Working backwards.', parts: [Pt('12', 'RF2', 'MAS', function (r) { return r.chance(0.3) ? B.linBack(r, CP) : B.quadBack(r, CP); })] },
    { num: '13', outcome: 'RF2', lesson: 'L5', stem: 'A variable on both sides.', parts: [Pt('13', 'RF2', 'MAS', mk(B.absQuadVar))] },
    { num: '14', outcome: 'RF2', lesson: 'L4, L5', stem: 'A problem.', parts: [Pt('14', 'RF2', 'MAS', mk(B.absWord))] },
    { num: '15', outcome: 'RF11', lesson: 'L7', stem: 'Working backwards.', parts: [Pt('15', 'RF11', 'MAS', mk(B.recQuadBack))] },
    { num: '16', outcome: 'RF11', lesson: 'L7', stem: 'A parameter.', parts: [Pt('16', 'RF11', 'MAS', mk(B.recQuadK))] }
  ];

  HW.defineTest({
    id: 'u7test', unit: 7, title: 'Unit 7 Test', outcome: 'RF2', calc: true,
    blurb: 'The Unit 7 outcomes-based test on AN1 (absolute value of real numbers), RF2 (graphs of y = |f(x)| for linear and quadratic f, and absolute value equations) and RF11 (reciprocal functions of linear and quadratic f) — in Beginning, Progressing and Mastery boxes. Calculator allowed; answers exact where exactness is the skill.',
    // Short version (~half the time): evaluating, the graph of |f| from a line, |A| = c, the reciprocal's asymptotes and
    // vertical asymptotes at Beginning; ordering, the range of |quadratic|, |ax + b| = cx + d, the reciprocal graph from a
    // line, the turning point at Progressing; simplifying, |A| = B with a quadratic, f from the reciprocal at Mastery.
    short: ['1a', '2a', '3a', '4ac', '5a', '7b', '8a', '9a', '10a', '11', '13', '15'],
    questions: QUESTIONS
  });
})(window);
