/* Math 20-1 · Unit 7 · Lesson 5 — Solving Absolute Value Equations (Quadratic) (outcome RF2)
 * Assignment 5 (u7_l05.tex, Questions 1–17) and the Lesson 5 Extra Practice (u7_ep05.tex, A1–A3, B1–B6, C1–C3).
 * Every part is a generator: the booklet question's idea, form and difficulty with new numbers (the lesson's example
 * numbers and the booklet question's own numbers are left out). Calculator allowed; answers exact where the booklet asks.
 *
 * Solutions are typed as "x = 2, x = -1 ± √3" (any order, ± allowed) or "no solution" (the u7sol keypad of the Unit 7
 * test, js/lessons/u7test.js). Recognised mistakes (codes u7l5-…): only one case solved, splitting before isolating,
 * solving |A| = a negative number, keeping an extraneous root (or rejecting one that checks), "no solution" when there
 * is one, a missed solution, the second case with the sign of only one term changed, rounded instead of exact, and the
 * counting mistakes (the line through the top of the reflected hump, above it, k = 0, k < 0).
 * Conversions: "use the graph" (#4a) → the two solutions read exactly and the other two estimated to the tenth (±0.15);
 * "explain with a sketch" (#5, C1) → the numbers / the values of k (the sketch is in the worked solution); "identify the
 * error" (#8) → MC on the error, then the correct solution; "describe the window and method" (#11, B3) → the solutions
 * to the tenth, then one exact value; clock times (#12b) → the first time typed as h:mm a.m./p.m.; "which have 26 °C"
 * (#12c) → MC; "nearest unit" (B4b) → the four production levels in units.
 * Stretch (Lesson 5 §4, equations with two absolute values, beyond the course outcome — the Unit 7 test leaves it out):
 * assignment #9, #10, #17 and Extra A3, C2, C3 are levelled ADV/MAS and tagged outcome EXT (never count toward a level
 * or a coin). The three assignment ones are moved into the (optional) extra practice, under "Stretch", keeping their
 * booklet numbers 9, 10, 17, so they are not required.
 * Levels: LIM BEG EMG PRG ADV MAS. Mastery: 6b, 7b, 12b, C1.
 *
 * This file also holds HW.u7k56, the kit used by u7l6.js (so this file loads first): the answer readers and checkers
 * for solutions, points, asymptotes and values (adapted from the Unit 7 assessment kit HW.u7assess in u7test.js, copied
 * because u7test.js loads after the lessons), exact quadratic solving with worked steps, graph helpers and two keypads
 * (u7k56set: set notation with ≠, u7k56rec: reciprocal values with "undefined"). The u7sol / u7pts / u7asy keypads are
 * the test's (looked up when a question is drawn, after every script has loaded). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, KP = K.P, P = HW.poly, ex = HW.ex, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
  if (!K.set || !K.point || !K.pairs || !HW.graph || !P) throw new Error('js/lessons/u7l5.js needs js/relfn.js, js/lines.js and js/poly.js');

  /* ======================================================================================================
   * Codes (both lessons): [label, partial credit s = keeps 2/3, b = keeps 1/3, n = none, '' = a format nudge]
   * ====================================================================================================== */
  var BASE = {
    'one-case': ['Solved only one case (A = k or A = −k)', 'b'], 'no-iso': ['Split into cases before isolating the absolute value', 'n'],
    'neg-abs': ['Solved |A| = a negative number', 'n'], 'extr': ['Kept an extraneous root', 'b'], 'rej-valid': ['Rejected a root that checks', 's'],
    'nosol-claim': ['Said “no solution” when there is one', 'n'], 'sol-missing': ['Missed a solution', 'b'], 'neg-one': ['Second case: changed the sign of only one term', 'b'],
    'cnt-hump': ['Number of solutions: the line touches the top of the hump (3)', 'b'], 'cnt-two': ['Number of solutions: missed the reflected hump (4)', 'b'],
    'cnt-four': ['Number of solutions: counted the hump when the line is above it', 'b'], 'cnt-zero': ['Number of solutions when k = 0', 'b'], 'cnt-neg': ['Number of solutions when k < 0', 'n'],
    'asy-sign': ['Vertical asymptote with the wrong sign', 's'], 'asy-const': ['Vertical asymptote at the constant term', 'n'], 'asy-noh': ['Left out the horizontal asymptote y = 0', 's'],
    'asy-xy': ['Wrote the vertical asymptote as y = …', 'b'], 'asy-hz': ['Horizontal asymptote other than y = 0', 'b'], 'asy-none': ['Said there is no asymptote', 'n'], 'asy-extra': ['An asymptote that is not there', 'n'],
    'yint-same': ['Gave the y-intercept of f, not of its reciprocal', 'n'], 'rinv-one': ['Gave only the invariant point on one of y = 1, y = −1', 'b'],
    'rinv-zero': ['Used the zero (y = 0) as an invariant point', 'n'], 'rinv-swap': ['Invariant points: y = 1 and y = −1 mixed up', 'b'], 'inv-none': ['Said there are no invariant points', 'n'], 'inv-extra': ['Listed points that are not there', 'n'],
    'rpt-neg': ['Reciprocal: changed the sign', 'n'], 'rpt-same': ['Reciprocal: kept the y-value', 'n'], 'rpt-x': ['Reciprocal: took the reciprocal of x', 'n'], 'rpt-zero': ['Reciprocal of 0 given a value (it is undefined)', 'n'],
    'rl-point': ['Used the reciprocal’s y-value as a value of f', 'b'], 'rl-slope': ['Linear f: wrong slope', 'b'], 'rl-sign': ['Linear f: the zero with the wrong sign', 'b'], 'k-sign': ['Parameter with the wrong sign', 's'],
    'dom-y': ['Domain: excluded the y-intercept or used y', 'b'], 'dom-sign': ['Domain: excluded value with the wrong sign', 's'], 'rng-x': ['Range: excluded the asymptote x-value instead of 0', 'b'],
    'side': ['Positive part on the wrong side of the asymptote', 'b'], 'branch': ['Branches rise / fall the wrong way', 'b'],
    'exact': ['Rounded instead of exact (format)', ''], 'pts-fmt': ['Points not written as (x, y) (format)', ''], 'asy-fmt': ['Asymptotes not written as equations (format)', ''], 'word': ['Word answer not recognised (format)', '']
  };
  var LOCAL = {
    'u7l5-graph-read': ['Graph: an estimate is too far from the graph', 's'], 'u7l5-k-q': ['k for three solutions: used the vertex y-value (not its absolute value)', 'b'],
    'u7l5-k-zero': ['k for three solutions: used k = 0', 'n'], 'u7l5-mc-err': ['Picked the wrong error in the student’s work', 'n'], 'u7l5-clock': ['Clock time wrong', 'b'],
    'u7l5-clock-h': ['Clock time: hours and minutes mixed up (decimal hours read as minutes)', 's'], 'u7l5-clock-ap': ['Clock time: a.m. / p.m. wrong', 's'], 'u7l5-clock-fmt': ['Clock time not written as h:mm a.m./p.m. (format)', ''],
    'u7l5-units': ['Gave hundreds of units instead of units', 's'], 'u7l5-sum': ['Sum: left out solutions', 'b'], 'u7l5-k-end': ['Values of k: boundary included or left out', 's'],
    'u7l5-k-dir': ['Values of k: the inequality the wrong way', 'b'], 'u7l5-sub-int': ['Subdomains: kept a root outside its interval', 'b'],
    'u7l6-mc': ['Picked a wrong statement', 'n'], 'u7l6-undef': ['Reciprocal of 0: say undefined', 'n'], 'u7l6-yes-no': ['Is the point on the graph? Wrong decision', 's']
  };
  (function () {
    var codes = {}, part = {};
    Object.keys(BASE).forEach(function (k) { ['u7l5-', 'u7l6-'].forEach(function (cp) { codes[cp + k] = BASE[k][0]; if (BASE[k][1]) part[cp + k] = BASE[k][1]; }); });
    Object.keys(LOCAL).forEach(function (k) { codes[k] = LOCAL[k][0]; if (LOCAL[k][1]) part[k] = LOCAL[k][1]; });
    HW.addCodes(codes); HW.addPartial(part);
  })();

  /* ======================================================================================================
   * Small tools
   * ====================================================================================================== */
  function gcd(a, b) { return ex.gcd(Math.abs(a), Math.abs(b)); }
  function pickWhere(gen, test) { for (var i = 0; i < 20000; i++) { var o = gen(); if (o && test(o)) return o; } throw new Error('u7l5–6 practice: no instance found'); }
  function nz(r, lo, hi) { return (r.chance(0.5) ? -1 : 1) * r.int(lo, hi); }
  function toR(x) { if (Array.isArray(x)) return ex.norm(x[0], x[1]); if (typeof x !== 'number' || !isFinite(x)) return null; for (var q = 1; q <= 2000; q++) { var p = x * q; if (Math.abs(p - Math.round(p)) < 1e-9) return ex.norm(Math.round(p), q); } return null; }
  function rv(x) { return Array.isArray(x) ? x[0] / x[1] : x && x.tex ? x.v : x; }
  function rt(x) { if (x && x.tex) return x.tex; var f = toR(x); if (f) return ex.texRat(f); var v = Number(rv(x)); return isFinite(v) ? String(+v.toFixed(6)) : String(x); }
  function dt(x) { var v = Number(rv(x)); return isFinite(v) ? String(+v.toFixed(6)) : String(x); }
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
  function polyT(a, b, c, v) { var s = tx(quad(a, b, c)); return v && v !== 'x' ? s.replace(/x/g, v) : s; }
  function linT(a, b, v) { var s = tx(lin(a, b)); return v && v !== 'x' ? s.replace(/x/g, v) : s; }
  function paren(x) { return rv(x) < 0 ? '(' + rt(x) + ')' : rt(x); }
  function byVal(a, b) { return rv(a) - rv(b); }

  /* roots of a x² + b x + c = 0 (integers): exact, sorted, as { v, tex }; pm: the ± form of a pair */
  function qroots(a, b, c) {
    if (a < 0) { a = -a; b = -b; c = -c; }
    var D = b * b - 4 * a * c;
    if (a === 0) { var x0 = toR([-c, b]); return { D: null, roots: [{ v: rv(x0), tex: rt(x0) }] }; }
    if (D < 0) return { D: D, roots: [] };
    if (isSq(D)) { var s = Math.round(Math.sqrt(D)), rr = uniqNums([(-b - s) / (2 * a), (-b + s) / (2 * a)]).sort(function (p, q) { return p - q; }); return { D: D, roots: rr.map(function (v) { return { v: v, tex: rt(toR(v)), r: toR(v) }; }), rational: true }; }
    var k = 1, m = D; for (var f = 2; f * f <= m; f++) while (m % (f * f) === 0) { m /= f * f; k *= f; }
    var den = 2 * a, g = gcd(gcd(b, k), den), c0 = -b / g, c1 = k / g, d = den / g, rad = (c1 === 1 ? '' : c1) + '\\sqrt{' + m + '}';
    function one(sg) { var top = (c0 === 0 ? (sg < 0 ? '-' : '') : c0 + (sg < 0 ? '-' : '+')) + rad; return { v: (c0 + sg * c1 * Math.sqrt(m)) / d, tex: d === 1 ? top : '\\frac{' + top + '}{' + d + '}' }; }
    var topPm = (c0 === 0 ? '' : c0) + '\\pm ' + rad;
    return { D: D, roots: [one(-1), one(1)], pm: d === 1 ? topPm : '\\frac{' + topPm + '}{' + d + '}' };
  }
  /* one quadratic case, worked: "x² − 2x − 8 = 0, (x − 4)(x + 2) = 0, so x = 4 or x = −2" */
  function facOf(r0, v) { var f = toR(r0), p = f[0], q = f[1]; if (p === 0) return { tex: v, q: 1 }; return { tex: '(' + (q === 1 ? '' : q) + v + sgT(-p) + ')', q: q }; }
  function solveQ(a, b, c, v, o) {
    o = o || {}; v = v || 'x';
    if (a < 0) { a = -a; b = -b; c = -c; }
    var Q = qroots(a, b, c), eq = polyT(a, b, c, v) + '=0', R = Q.roots, txt;
    if (a === 0) txt = t(eq) + ', so ' + t(v + '=' + R[0].tex);
    else if (b === 0) {
      var sq = toR([-c, a]), sqT = t(v + '^{2}=' + rt(sq));
      txt = t(eq) + ', ' + sqT + (rv(sq) < 0 ? ': no real roots' : rv(sq) === 0 ? ', so ' + t(v + '=0') : ', so ' + t(v + '=' + (Q.rational ? '\\pm ' + rt(Math.abs(R[0].v)) : Q.pm)));
    }
    else if (Q.D < 0) txt = t(eq) + ': ' + t('b^{2}-4ac=' + Q.D + '<0') + ', no real roots';
    else if (Q.rational) {
      var F = R.map(function (x) { return facOf(x.v, v); }), g;
      if (Q.D === 0) { g = a / (F[0].q * F[0].q); txt = t(eq) + ', ' + t((g === 1 ? '' : g) + (F[0].tex === v ? v : F[0].tex) + '^{2}=0') + ', so ' + t(v + '=' + R[0].tex) + ' (a double root)'; }
      else { g = a / (F[0].q * F[1].q); var ft = F.map(function (f) { return f.tex; }); if (ft[1] === v) ft.reverse(); txt = t(eq) + ', ' + t((g === 1 ? '' : g) + ft.join('') + '=0') + ', so ' + R.map(function (x) { return t(v + '=' + x.tex); }).join(' or '); }
    } else {
      var num = (b === 0 ? '' : String(-b)) + '\\pm\\sqrt{' + Q.D + '}';
      txt = t(eq) + ', ' + t(v + '=\\frac{' + num + '}{' + 2 * a + '}=' + Q.pm) + (o.dec ? ' ' + t('\\approx ' + R.map(function (x) { return x.v.toFixed(o.dec); }).join(',\\ ')) : '');
    }
    return { roots: R, text: txt };
  }
  /* |a x² + b x + c| = k (k after isolating): the cases worked, and every root */
  function absK(a, b, c, k, v, o) {
    o = o || {}; v = v || 'x';
    var inner = o.innerT || polyT(a, b, c, v), out = { c1: [], c2: [] };
    if (k < 0) { out.text = t(A(inner) + '=' + k) + ': an absolute value is never negative, so there is <b>no solution</b>.'; out.vals = []; return out; }
    if (k === 0) { var z = solveQ(a, b, c, v, o); out.c1 = z.roots; out.vals = z.roots; out.text = 'An absolute value is 0 only when the inside is 0: ' + z.text + '.'; return out; }
    var s1 = solveQ(a, b, c - k, v, o), s2 = solveQ(a, b, c + k, v, o);
    out.c1 = s1.roots; out.c2 = s2.roots;
    out.text = 'Case 1: ' + t(inner + '=' + k) + ', so ' + s1.text + '.<br>Case 2: ' + t(inner + '=-' + k) + ', so ' + s2.text + '.';
    var all = s1.roots.concat(s2.roots), seen = [];
    out.vals = all.filter(function (x) { if (has(seen, x.v)) return false; seen.push(x.v); return true; }).sort(byVal);
    return out;
  }
  function solsT(vals, v, dp) { v = v || 'x'; return vals.length ? vals.map(function (x) { return v + (dp != null ? '\\approx ' + rv(x).toFixed(dp) : '=' + rt(x)); }).join(',\\ ') : '\\text{no solution}'; }

  /* ======================================================================================================
   * Answer readers and checkers (adapted from HW.u7assess)
   * ====================================================================================================== */
  function plainLow(s) { return String(s == null ? '' : s).replace(/\\text\{([^}]*)\}|\\mathrm\{([^}]*)\}/g, function (m, a, b) { return a || b || ''; }).replace(/\\left|\\right|\\[,;:! ]|~/g, ' ').replace(/[{}\\]/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase(); }
  function isNone(s) { var l = plainLow(s); return /^(no( real)? (solutions?|roots?)|no solution|none|no invariant points?|no( vertical)? asymptotes?|∅|emptyset|varnothing|\{ ?\}|)$/.test(l) && l !== ''; }
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
  function closeTo(a, b, tol) { return Math.abs(a - b) < 1e-9 * Math.max(1, Math.abs(b)) || (tol && Math.abs(a - b) <= tol); }
  function matchVals(Aa, T, tol) { return Aa.length === T.length && T.every(function (b) { return Aa.some(function (a) { return closeTo(a, b, tol); }); }); }
  /* solutions of an equation: vals (numbers, [p,q] or { v, tex }); o.extr extraneous roots; o.wrongs [{ vals, code, hint }];
     o.dp: decimals to that place accepted (and exact values); o.tol: a custom tolerance; o.v the variable */
  function rootsCheck(cp, vals, o) {
    o = o || {};
    var v = o.v || 'x', T = uniqNums(vals.map(rv)), extr = uniqNums((o.extr || []).map(rv)).filter(function (e) { return !has(T, e); }), tol = o.tol || (o.dp != null ? 0.5 * Math.pow(10, -o.dp) + 1e-9 : 0);
    var wrongs = (o.wrongs || []).map(function (w) { return { vals: uniqNums(w.vals.map(rv)), none: !w.vals.length, code: w.code, hint: w.hint }; }).filter(function (w) { return !(w.none ? !T.length : sameSet(w.vals, T)); });
    var extrHint = o.extrHint || 'Check every answer in the <b>original</b> equation: ' + (extr.length ? t(v + '=' + rt(toR(extr[0]) || extr[0])) + ' makes the side without bars negative, so it is extraneous' : 'one of yours does not check') + '.';
    return function (resp) {
      if (isNone(resp)) { if (!T.length) return ok(); var wn = wrongs.filter(function (w) { return w.none; })[0]; return wrong(wn ? wn.code : cp + 'nosol-claim', wn ? wn.hint : o.noneHint || 'There is a solution: solve both cases, then check each answer in the original equation.'); }
      var L = readVals(resp, v);
      if (L.empty) return form('empty', 'Type your answer first.');
      if (L.letter) return form('sol-letter', 'Use the variable ' + t(v) + ' here (you wrote ' + t(L.letter + '=') + ').');
      if (L.unsimp) return form('simplify', 'Simplify each solution to a single number (no ' + t('\\times') + ', + or − between numbers).');
      if (L.bad) return form('unreadable', 'Write the solutions separated by commas, e.g. ' + t(v + '=3,\\ ' + v + '=-5') + ' (or: no solution).');
      var Aa = uniqNums(L.vals);
      if (T.length && matchVals(Aa, T, tol)) return ok();
      if (!tol && L.dec && T.length && Aa.length === T.length && T.every(function (b) { return Aa.some(function (a) { return Math.abs(a - b) < 0.006; }); })) return form(cp + 'exact', 'Those are rounded decimals. Give the <b>exact</b> values (fractions or radicals).');
      if (tol && o.dp != null && T.length && Aa.length === T.length && T.every(function (b) { return Aa.some(function (a) { return Math.abs(a - b) < 0.06; }); })) return form('places', 'Almost: round each solution to the ' + (o.dp === 1 ? 'nearest tenth' : 'nearest hundredth') + ' (look at the next digit).');
      for (var i = 0; i < wrongs.length; i++) if (!wrongs[i].none && matchVals(Aa, wrongs[i].vals, tol)) return wrong(wrongs[i].code, wrongs[i].hint);
      if (!T.length) { if (extr.length && Aa.every(function (a) { return extr.some(function (e) { return closeTo(a, e, tol); }); })) return wrong(cp + 'extr', extrHint + ' There is no solution.'); return wrong('value', 'Substitute your value into the original equation: it does not check.'); }
      var extra = Aa.filter(function (a) { return !T.some(function (b) { return closeTo(a, b, tol); }); }), miss = T.filter(function (b) { return !Aa.some(function (a) { return closeTo(a, b, tol); }); });
      if (extra.length && !miss.length && extr.length && extra.every(function (a) { return extr.some(function (e) { return closeTo(a, e, tol); }); })) return wrong(cp + 'extr', extrHint);
      if (miss.length && !extra.length) return wrong(cp + (o.rejValid && extr.length ? 'rej-valid' : 'sol-missing'), o.rejValid && extr.length ? 'Check the solution you rejected again: it makes both sides equal, so keep it.' : o.missHint || 'Correct so far, but there ' + (miss.length === 1 ? 'is another solution' : 'are more solutions') + '. Solve <b>both</b> cases: the expression inside the bars equals the other side, or its opposite.');
      return wrong('value', null);
    };
  }
  function rootsBad(vals, o, keyTex) {
    o = o || {}; var v = o.v || 'x', T = vals.map(rv), bad = [];
    var set = function (arr) { return solsT(arr.map(function (x) { return x && x.tex ? x : toR(rv(x)) || x; }), v); };
    if ((o.extr || []).length) bad.push(set(vals.concat(o.extr)));
    (o.wrongs || []).forEach(function (w) { if (!(w.vals.length ? sameSet(w.vals.map(rv), T) : !T.length)) bad.push(w.vals.length ? set(w.vals) : '\\text{no solution}'); });
    if (T.length) bad.push('\\text{no solution}');
    return bad.filter(function (b, i, arr) { return arr.indexOf(b) === i && b !== keyTex; });
  }
  function rootsPart(cp, prompt, vals, o, sol, hints, text) {
    o = o || {}; var v = o.v || 'x';
    vals = vals.slice().sort(byVal);
    var keyTex = o.keyTex || (o.dp != null && !o.keyExact ? solsT(vals, v, o.dp) : solsT(vals, v));
    var part = KP.math(prompt, rootsCheck(cp, vals, o), keyTex, sol, hints, text, { keys: 'u7sol', vars: [v], before: o.before, placeholder: 'e.g. ' + v + ' = 3, ' + v + ' = -5   (or: no solution)' });
    part.bad = rootsBad(vals, o, keyTex);
    if (o.answer) part.answer = o.answer;
    return part;
  }

  /* points */
  function expandPm(s) { return String(s).replace(/\(([^()]*?)(\\pm|±)([^()]*?)\)/g, function (m, a, pm, b) { return '(' + a + '+' + b + '), (' + a + '-' + b + ')'; }); }
  function samePts(L, pairs) { return L.length === pairs.length && L.every(function (q) { return pairs.some(function (p) { return Math.abs(rv(p[0]) - rv(q[0])) < 1e-9 && Math.abs(rv(p[1]) - rv(q[1])) < 1e-9; }); }); }
  function ptsCheck(cp, pairs, wrongs, o) {
    o = o || {};
    var base = pairs.length ? K.pairs(pairs.map(function (p) { return [rv(p[0]), rv(p[1])]; })) : null;
    var W = (wrongs || []).filter(function (w) { return w.pairs && !samePts(w.pairs, pairs); })
      .map(function (w) { return { c: w.pairs.length ? K.pairs(w.pairs.map(function (p) { return [rv(p[0]), rv(p[1])]; })) : null, none: !w.pairs.length, code: w.code, hint: w.hint }; });
    return function (resp) {
      var s = String(resp == null ? '' : resp).replace(/\\left|\\right/g, '').replace(/\\[ ,;:!]|~/g, ' ');
      if (!s.trim()) return form('empty', 'Type your answer first.');
      if (isNone(s)) { if (!pairs.length) return ok(); var wn = W.filter(function (w) { return w.none; })[0]; return wrong(wn ? wn.code : cp + 'inv-none', wn ? wn.hint : o.noneHint || 'There are some: look for the points that are on both graphs.'); }
      if (!/\(/.test(s)) return form(cp + 'pts-fmt', 'Give each one as a point ' + t('(x,\\ y)') + ', separated by commas.');
      s = expandPm(s);
      if (!pairs.length) { for (var j = 0; j < W.length; j++) if (W[j].c && W[j].c(s).v === 'correct') return wrong(W[j].code, W[j].hint); return wrong(cp + 'inv-extra', o.extraHint || 'There are none here.'); }
      var res = base(s);
      if (res.v === 'correct' || res.v === 'form') return res;
      for (var i = 0; i < W.length; i++) if (W[i].c && W[i].c(s).v === 'correct') return wrong(W[i].code, W[i].hint);
      return res;
    };
  }
  function pt(x, y) { return '(' + rt(x) + ',\\ ' + rt(y) + ')'; }
  function ptsT(list) { return list.length ? list.map(function (p) { return pt(p[0], p[1]); }).join(',\\ ') : '\\text{none}'; }
  function ptsPart(cp, prompt, pairs, wrongs, sol, hints, text, o) {
    o = o || {};
    var keyTex = ptsT(pairs), part = KP.math(prompt, ptsCheck(cp, pairs, wrongs, o), keyTex, sol, hints, text, { keys: 'u7pts', placeholder: 'e.g. (1, 0), (5, 0)' });
    part.bad = (wrongs || []).filter(function (w) { return !samePts(w.pairs, pairs); }).map(function (w) { return ptsT(w.pairs); }).concat(pairs.length ? ['\\text{none}'] : []).filter(function (b, i, arr) { return arr.indexOf(b) === i && b !== keyTex; });
    return part;
  }
  function pointChk(cp, target, wr) {
    var T = [rv(target[0]), rv(target[1])], W = (wr || []).filter(function (w) { return !(Math.abs(rv(w.p[0]) - T[0]) < 1e-9 && Math.abs(rv(w.p[1]) - T[1]) < 1e-9); });
    return { W: W, check: K.point(target.map(function (c) { return toR(rv(c)) || rv(c); }), { wrong: W.map(function (w) { return { is: w.p.map(function (c) { return toR(rv(c)) || rv(c); }), code: w.code, hint: w.hint }; }) }) };
  }
  function pointPart(cp, prompt, target, wr, sol, hints, text) {
    var pc = pointChk(cp, target, wr), keyTex = pt(target[0], target[1]);
    var part = KP.math(prompt, pc.check, keyTex, sol, hints, text, { keys: 'u7pts', placeholder: 'e.g. (3, -2)' });
    part.bad = pc.W.map(function (w) { return pt(w.p[0], w.p[1]); }).filter(function (b, i, arr) { return arr.indexOf(b) === i && b !== keyTex; });
    return part;
  }

  /* asymptotes "x = 2, y = 0". T = { xs: [...], hz: true when y = 0 must be listed } */
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
      if (L.bad) return form(cp + 'asy-fmt', 'Write each asymptote as an equation, e.g. ' + t('x=3') + (T.hz ? ', ' + t('y=0') : '') + '.');
      if (L.none) return wrong(cp + 'asy-none', 'There is a vertical asymptote where ' + t('f(x)=0') + '.');
      if (L.bare) return form(cp + 'asy-fmt', 'Write each asymptote as its own equation, e.g. ' + t('x=2,\\ y=0') + '.');
      var xsOK = sameSet(L.xs, T.xs), ysOK = T.hz ? sameSet(L.ys, [0]) : (!L.ys.length || sameSet(L.ys, [0]));
      if (xsOK && ysOK) return ok();
      if (L.ys.some(function (y) { return y !== 0; }) && !L.xs.length && sameSet(L.ys, T.xs)) return wrong(cp + 'asy-xy', 'A vertical asymptote is a vertical line, ' + t('x=a') + ', not ' + t('y=a') + '.');
      for (var i = 0; i < W.length; i++) if (sameSet(L.xs, W[i].xs)) return wrong(W[i].code, W[i].hint);
      if (xsOK && L.ys.some(function (y) { return y !== 0; })) return wrong(cp + 'asy-hz', 'The vertical asymptote is right. The horizontal asymptote of ' + t('y=\\frac{1}{f(x)}') + ' is ' + t('y=0') + ': the reciprocal is never 0, but it gets close to 0 where ' + t('|f(x)|') + ' is large.');
      if (xsOK && T.hz && !L.ys.length) return wrong(cp + 'asy-noh', 'The vertical asymptote is right. A reciprocal function also has the horizontal asymptote ' + t('y=0') + ': list it too.');
      if (T.xs.length && L.xs.length === T.xs.length && sameSet(L.xs, T.xs.map(function (x) { return -x; }))) return wrong(cp + 'asy-sign', 'Check the sign: the vertical asymptote is where ' + t('f(x)=0') + '. Solve that equation.');
      return wrong('value', null);
    };
  }
  function asyT(xs, hz) { var a = xs.map(function (x) { return 'x=' + rt(x); }); if (hz) a.push('y=0'); return a.join(',\\ '); }
  function asyPart(cp, prompt, T, o, sol, hints, text) {
    o = o || {};
    var keyTex = asyT(T.xs, T.hz), part = KP.math(prompt, asyCheck(cp, T, o), keyTex, sol, hints, text, { keys: 'u7asy', placeholder: T.hz ? 'e.g. x = 3, y = 0' : 'e.g. x = 3' });
    var bad = (o.wrongs || []).map(function (w) { return asyT(w.xs, T.hz); });
    if (T.hz) bad.push(asyT(T.xs, false));
    bad.push(asyT(T.xs.map(function (x) { return -x; }), T.hz));
    part.bad = bad.filter(function (b, i, arr) { return arr.indexOf(b) === i && b !== keyTex; });
    return part;
  }
  /* an exact number; a rounded decimal near it is a format nudge when exact is asked */
  function valCheck(cp, target, wr, o) {
    o = o || {};
    var T = rv(target), W = (wr || []).filter(function (w) { return Math.abs(rv(w.v) - T) > 1e-9; });
    var base = K.value(T, { diag: function (v) { for (var i = 0; i < W.length; i++) if (Math.abs(v - rv(W[i].v)) < 1e-9 * Math.max(1, Math.abs(v))) return { code: W[i].code, hint: W[i].hint }; return o.diag ? o.diag(v) : null; } });
    return { W: W, check: function (resp) { if (o.undef && /undef/.test(plainLow(resp))) return wrong(cp + 'value', 'It is defined here: work out the value.'); var res = base(resp); if (res.v === 'wrong' && res.code === 'value' && o.exact !== false) { var a = K.read(resp); if (!a.res && /\d\.\d/.test(String(resp)) && Math.abs(a.val - T) < 0.006 && Math.abs(a.val - T) > 1e-9) return form(cp + 'exact', 'That is a rounded decimal. Give the <b>exact</b> value.'); } return res; } };
  }
  function valPart(cp, prompt, target, wr, sol, hints, text, o) {
    o = o || {};
    var vc = valCheck(cp, target, wr, o), keyTex = o.keyTex || rt(target);
    var part = KP.math(prompt, vc.check, keyTex, sol, hints, text, { keys: o.keys || 'fraction', before: o.before, after: o.after });
    part.bad = vc.W.map(function (w) { return w.tex || rt(w.v); }).filter(function (b, i, arr) { return arr.indexOf(b) === i && b !== keyTex; });
    return part;
  }
  function fieldsPart(prompt, fields, checkers, keys, answer, sol, hints, text, bad, combine) {
    var base = K.fields(checkers, { labels: fields.map(function (f) { return f.name || f.label; }) });
    return { prompt: prompt, input: { type: 'fields', fields: fields }, check: function (resp) { resp = resp || []; var c = combine ? combine(resp) : null; return c || base(resp); }, key: keys, answer: answer, solution: sol, hints: hints || [], text: text, bad: bad || [] };
  }
  /* MC with distinct options (by html) */
  function mc(r, prompt, opts, sol, hints, text, cols) {
    var seen = {}, list = opts.filter(function (o) { if (seen[o.html]) return false; seen[o.html] = 1; return true; });
    var p = KP.mc(r, prompt, list, sol, hints, text);
    if (cols) p.input.columns = cols;
    return p;
  }

  /* graphs */
  function G(o) { return HW.graph(Object.assign({ x: [-6, 6], y: [-6, 6], labels: 2, max: 300, aria: 'graph' }, o)); }
  function crv(f, o) { return Object.assign({ f: f, start: 'arrow', end: 'arrow' }, o || {}); }
  function recFns(f, zs, xr) { var cuts = [xr[0]].concat(zs).concat([xr[1]]), out = []; for (var i = 0; i + 1 < cuts.length; i++) out.push(crv(function (x) { return 1 / f(x); }, { from: cuts[i] + (i ? 1e-3 : 0), to: cuts[i + 1] - (i + 2 < cuts.length ? 1e-3 : 0) })); return out; }

  /* keypads: set notation with ≠ (domain and range of a reciprocal), and reciprocal values with "undefined" */
  var W = HW.widgets;
  if (W && W.KEYSETS) {
    var d = function (n) { return { label: String(n), tex: String(n), plain: String(n) }; };
    var KY = { del: { label: '⌫', fn: 'del', title: 'Delete' }, clear: { label: 'clear', fn: 'clear' }, left: { label: '◀', fn: 'left', title: 'Move left' }, right: { label: '▶', fn: 'right', title: 'Move right (out of a box)' }, enter: { label: 'Check ↵', fn: 'enter', wide: true },
      minus: { label: '−', tex: '-', plain: '-' }, dot: { label: '.', tex: '.', plain: '.' }, frac: { label: '<sup>a</sup>⁄<sub>b</sub>', tex: '\\frac{#@}{#?}', plain: '/', title: 'Fraction' }, ne: { label: '≠', tex: '\\ne ', plain: ' != ', title: 'is not equal to' } };
    W.KEYSETS.u7k56set = function (opt) {
      var rows = (typeof W.KEYSETS.set === 'function' ? W.KEYSETS.set(opt) : W.KEYSETS.set).map(function (r) { return r.slice(); });
      rows[0].splice(rows[0].length - 1, 0, KY.ne);
      return rows;
    };
    W.KEYSETS.u7k56rec = function () { return [[d(7), d(8), d(9), KY.frac, KY.del], [d(4), d(5), d(6), KY.minus, KY.clear], [d(1), d(2), d(3), KY.dot, KY.left, KY.right], [d(0), { label: 'undefined', tex: '\\text{undefined}', plain: 'undefined' }, KY.enter]]; };
    if (W.KEYHELP) {
      W.KEYHELP.u7k56set = ['Use <b>{ }</b>, <b>|</b>, <b>≠</b> and <b>∈ ℝ</b>, e.g. ' + HW.k('\\{x\\mid x\\ne 3,\\ x\\in\\mathbb{R}\\}') + '. Press <b>▶</b> to step out of the braces.', 'Type e.g. <code>{x | x != 3, x in R}</code>.'];
      W.KEYHELP.u7k56rec = ['Type each value as a fraction, an integer or a decimal; use the <b>undefined</b> key where there is no value.', 'Type e.g. <code>-1/4</code>, <code>0.5</code> or <code>undefined</code>.'];
    }
  }

  HW.u7k56 = {
    gcd: gcd, pickWhere: pickWhere, nz: nz, toR: toR, rv: rv, rt: rt, dt: dt, sgT: sgT, coefT: coefT, has: has, uniqNums: uniqNums, sameSet: sameSet, isSq: isSq, A: A,
    M: M, lin: lin, quad: quad, tx: tx, polyT: polyT, linT: linT, paren: paren, byVal: byVal, qroots: qroots, solveQ: solveQ, absK: absK, solsT: solsT,
    plainLow: plainLow, isNone: isNone, readVals: readVals, numVal: numVal, rootsCheck: rootsCheck, rootsBad: rootsBad, rootsPart: rootsPart,
    ptsCheck: ptsCheck, ptsPart: ptsPart, pt: pt, ptsT: ptsT, pointChk: pointChk, pointPart: pointPart, asyCheck: asyCheck, asyT: asyT, asyPart: asyPart,
    valCheck: valCheck, valPart: valPart, fieldsPart: fieldsPart, mc: mc, G: G, crv: crv, recFns: recFns
  };

  /* ======================================================================================================
   * Lesson 5
   * ====================================================================================================== */
  var LID = 'u7l5', CP = 'u7l5-', OUT = 'RF2';
  var H_CASES = ['Isolate the absolute value, then solve ' + t('f(x)=k') + ' and ' + t('f(x)=-k') + '.', 'Each case is a quadratic equation in standard form: factor it, or use the quadratic formula. A case may have no real roots.'];
  /* the standard wrong answers for |f| = k (k > 0) */
  function kWrongs(S, inner, k) {
    var w = [];
    if (S.c2.length) w.push({ vals: S.c1, code: CP + 'one-case', hint: 'Solve the second case too: ' + t(inner + '=-' + k) + '.' });
    if (S.c1.length && S.c2.length) w.push({ vals: S.c2, code: CP + 'one-case', hint: 'Solve the first case too: ' + t(inner + '=' + k) + '.' });
    if (k > 0) w.push({ vals: [], code: CP + 'nosol-claim', hint: 'The absolute value equals a positive number: solve both cases (at least one has real roots).' });
    return w;
  }
  function kPart(prompt, a, b, c, k, o) {
    o = o || {};
    var inner = o.innerT || polyT(a, b, c), S = absK(a, b, c, k, 'x', o), w = (o.wrongs || []).concat(kWrongs(S, inner, k));
    if (k < 0) { var both = absK(a, b, c, -k); if (both.vals.length) w.push({ vals: both.vals, code: CP + 'neg-abs', hint: 'After isolating, the absolute value equals a negative number. An absolute value is never negative: no solution.' }); }
    var sol = (o.pre || '') + S.text + '<br>Solutions: ' + t(solsT(S.vals)) + (S.vals.length ? ' (' + S.vals.length + ' solution' + (S.vals.length === 1 ? '' : 's') + ')' : '') + '.' + (o.post || '');
    return rootsPart(CP, prompt, S.vals, { wrongs: w }, sol, o.hints || H_CASES, o.text || 'solving |f(x)| = k');
  }
  function notEx(list) { return function (key) { return list.indexOf(key) < 0; }; }

  /* #1a: |x² − n| = k, two solutions (the second case has no real roots) */
  function q1a(r) {
    var s = pickWhere(function () { return { u: r.int(2, 9), n: r.int(2, 30) }; }, function (z) { z.k = z.u * z.u - z.n; return z.k > z.n && notEx(['7,9'])(z.n + ',' + z.k); });
    return kPart('Solve algebraically: ' + t(A('x^{2}-' + s.n) + '=' + s.k) + '.', 1, 0, -s.n, s.k);
  }
  /* #1b: |x² + bx| = k, two solutions */
  function q1b(r) {
    var s = pickWhere(function () { return { b: nz(r, 1, 9), k: r.int(2, 30) }; }, function (z) { return isSq(z.b * z.b + 4 * z.k) && z.b * z.b - 4 * z.k < 0 && notEx(['-3,4', '2,3'])(z.b + ',' + z.k); });
    return kPart('Solve algebraically: ' + t(A(polyT(1, s.b, 0)) + '=' + s.k) + '.', 1, s.b, 0, s.k);
  }
  /* #1c: |x² + bx| = k, four solutions */
  function fourInt(r, o) { // f(x) = x² + bx + c with |f| = k having four integer solutions: f − k = (x − p)(x − q), f + k = (x − u)(x − w)
    o = o || {};
    return pickWhere(function () { return { S: r.int(-7, 7), p: r.int(-8, 8), u: r.int(-8, 8) }; }, function (z) {
      var q = z.S - z.p, w = z.S - z.u, d2 = z.u * w - z.p * q; if (d2 <= 0 || d2 % 2) return false;
      z.k = d2 / 2; z.b = -z.S; z.c = z.p * q + z.k;
      var all = uniqNums([z.p, q, z.u, w]); if (all.length !== 4 || z.k > 15 || Math.abs(z.c) > 20 || z.b === 0) return false;
      if (o.c0 != null && (z.c === 0) !== o.c0) return false;
      return (o.not || []).indexOf(z.b + ',' + z.c + ',' + z.k) < 0;
    });
  }
  function q1c(r) {
    var s = fourInt(r, { not: ['5,0,6', '-5,0,6', '2,-4,4'] });
    return kPart('Solve algebraically: ' + t(A(polyT(1, s.b, s.c)) + '=' + s.k) + '.', 1, s.b, s.c, s.k);
  }
  /* #1d: |x² + bx + c| = 0 */
  function q1d(r) {
    var s = pickWhere(function () { return { p: r.int(-8, 8), q: r.int(-8, 8) }; }, function (z) { return z.p < z.q && z.p * z.q !== 0 && !(z.p === 2 && z.q === 6); });
    var b = -(s.p + s.q), c = s.p * s.q, inner = polyT(1, b, c);
    return kPart('Solve algebraically: ' + t(A(inner) + '=0') + '.', 1, b, c, 0, { wrongs: [{ vals: [-s.p, -s.q], code: 'sol-sign', hint: 'Check the signs: if ' + t('x' + sgT(-s.p) + '=0') + ' then ' + t('x=' + s.p) + '.' }] });
  }
  /* #1e: |x² + n| = k with k < n: no solution */
  function q1e(r) {
    var s = pickWhere(function () { return { n: r.int(3, 20), k: r.int(1, 19) }; }, function (z) { return z.k < z.n && notEx(['9,5', '4,2'])(z.n + ',' + z.k); });
    var w = s.n - s.k > 0 && isSq(s.n - s.k) ? [{ vals: [-Math.sqrt(s.n - s.k), Math.sqrt(s.n - s.k)], code: CP + 'neg-one', hint: 'Case 1: ' + t('x^{2}+' + s.n + '=' + s.k) + ' gives ' + t('x^{2}=' + (s.k - s.n)) + ': a square is never negative.' }] : [];
    return kPart('Solve algebraically: ' + t(A('x^{2}+' + s.n) + '=' + s.k) + '.', 1, 0, s.n, s.k, { wrongs: w, post: ' (In fact ' + t('x^{2}+' + s.n + '\\ge ' + s.n) + ' for every ' + t('x') + ', so it can never equal ' + t(s.k) + '.)' });
  }
  /* #1f: |quadratic| = negative */
  function q1f(r) {
    var s = pickWhere(function () { return { b: nz(r, 1, 9), c: r.int(-12, 12), k: -r.int(1, 9) }; }, function (z) { return !(z.b === -4 && z.c === 0 && z.k === -3); });
    return kPart('Solve algebraically: ' + t(A(polyT(1, s.b, s.c)) + '=' + s.k) + '.', 1, s.b, s.c, s.k, { hints: ['Look at the right side before you start.', 'An absolute value is a distance: it is never negative.'] });
  }
  /* #2a: m|x² + bx| + d = e */
  function q2a(r) {
    var s = pickWhere(function () { return { m: r.int(2, 5), b: nz(r, 1, 8), k: r.int(1, 12), d: nz(r, 1, 9) }; }, function (z) { var D2 = z.b * z.b - 4 * z.k; return isSq(z.b * z.b + 4 * z.k) && (D2 < 0 || isSq(D2)) && !(z.m === 3 && z.b === -2 && z.k === 3) && !(z.m === 2 && z.b === -5); });
    var inner = polyT(1, s.b, 0), e = s.m * s.k + s.d, eq = s.m + A(inner) + sgT(s.d) + '=' + e;
    var wv = absK(1, s.b, 0, e - s.d).vals;
    return kPart('Isolate the absolute value, then solve: ' + t(eq) + '.', 1, s.b, 0, s.k, { pre: 'Isolate: ' + t(s.m + A(inner) + '=' + (e - s.d)) + ', so ' + t(A(inner) + '=' + s.k) + '.<br>', wrongs: wv.length ? [{ vals: wv, code: CP + 'no-iso', hint: 'Divide by ' + t(s.m) + ' too: ' + t(A(inner) + '=' + s.k) + '.' }] : [] });
  }
  /* #2b: d − m|x² − n| = e */
  function q2b(r) {
    var s = pickWhere(function () { return { m: r.pick([1, 1, 2, 3]), n: r.int(1, 20), u: r.int(2, 7), d: r.int(2, 30) }; }, function (z) { z.k = z.u * z.u - z.n; z.e = z.d - z.m * z.k; return z.k > 0 && (z.n - z.k < 0 || isSq(z.n - z.k)) && !(z.m === 1 && z.n === 1 && z.k === 3 && z.d === 5); });
    var inner = 'x^{2}-' + s.n, eq = s.d + '-' + (s.m === 1 ? '' : s.m) + A(inner) + '=' + s.e;
    var wv = absK(1, 0, -s.n, (s.e - s.d) / s.m).vals;
    return kPart('Isolate the absolute value, then solve: ' + t(eq) + '.', 1, 0, -s.n, s.k, { pre: 'Isolate: ' + t('-' + (s.m === 1 ? '' : s.m) + A(inner) + '=' + (s.e - s.d)) + ', so ' + t(A(inner) + '=' + s.k) + '.<br>', wrongs: [{ vals: wv, code: CP + 'neg-abs', hint: 'Divide by ' + t(-s.m) + ': the minus sign goes too, so ' + t(A(inner) + '=' + s.k) + ', a positive number.' }] });
  }
  /* #2c: (1/m)|x² + 2hx + c| = j, three solutions */
  function q2c(r) {
    var s = pickWhere(function () { return { h: nz(r, 1, 5), mj: r.pick([[2, 1], [3, 1], [2, 2], [2, 3], [3, 2], [2, 4]]) }; }, function (z) { z.m = z.mj[0]; z.j = z.mj[1]; z.k = z.m * z.j; return !(z.h === 1 && z.k === 2); });
    var b = 2 * s.h, c = s.h * s.h - s.k, inner = polyT(1, b, c);
    return kPart('Isolate the absolute value, then solve: ' + t('\\frac{1}{' + s.m + '}' + A(inner) + '=' + s.j) + '.', 1, b, c, s.k, { pre: 'Multiply by ' + t(s.m) + ': ' + t(A(inner) + '=' + s.k) + '.<br>' });
  }
  /* #3: exact and to the nearest hundredth (two boxes) */
  function exactAndRound(prompt, a, b, c, k, sol, wr) {
    var S = absK(a, b, c, k, 'x', { dec: 2 }), inner = polyT(a, b, c), w = kWrongs(S, inner, k).concat(wr || []);
    var fields = [{ label: 'Exact', name: 'exact', mode: 'math', keys: 'u7sol', vars: ['x'], placeholder: 'e.g. x = 1 ± √3, x = 2' }, { label: 'To the nearest hundredth', name: 'nearest hundredth', mode: 'math', keys: 'u7sol', vars: ['x'], placeholder: 'e.g. x = -0.73, x = 2.73' }];
    var keys = [solsT(S.vals), solsT(S.vals, 'x', 2)];
    var c1 = rootsCheck(CP, S.vals, { wrongs: w }), c2 = rootsCheck(CP, S.vals, { wrongs: w, dp: 2 });
    return fieldsPart(prompt, fields, [c1, c2], keys, t(keys[0]) + '<br>' + t(keys[1]), S.text + '<br>Exact: ' + t(keys[0]) + '.<br>To the nearest hundredth: ' + t(keys[1]) + '.',
      H_CASES.concat(['Round only at the end: use the exact values on your calculator.']), 'exact and rounded solutions', [[solsT(S.c1), solsT(S.c1, 'x', 2)], [keys[1], keys[1]]].filter(function (bb) { return bb.join('|') !== keys.join('|'); }));
  }
  function q3a(r) {
    var s = pickWhere(function () { return { p: nz(r, 1, 4), c: r.int(-9, 9), k: r.int(1, 6) }; }, function (z) { var d1 = z.p * z.p - z.c + z.k, d2 = z.p * z.p - z.c - z.k; return d1 > 0 && d2 > 0 && !isSq(d1) && !isSq(d2) && !(z.p === 1 && z.c === -4 && z.k === 2) && !(z.p === 1 && z.c === -3); });
    return exactAndRound('Solve ' + t(A(polyT(1, -2 * s.p, s.c)) + '=' + s.k) + '. Give exact answers, then answers to the nearest hundredth.', 1, -2 * s.p, s.c, s.k);
  }
  function q3b(r) {
    var s = pickWhere(function () { return { a: r.pick([2, 3]), b: nz(r, 1, 5), c: r.int(-8, 4), k: r.int(1, 5) }; }, function (z) {
      var D1 = z.b * z.b - 4 * z.a * (z.c - z.k), D2 = z.b * z.b - 4 * z.a * (z.c + z.k);
      return D1 > 0 && D2 > 0 && (isSq(D1) !== isSq(D2)) && !(z.a === 2 && z.b === -1 && z.c === -4 && z.k === 2) && gcd(gcd(z.a, z.b), z.c) === 1;
    });
    return exactAndRound('Solve ' + t(A(polyT(s.a, s.b, s.c)) + '=' + s.k) + '. Give exact answers, then answers to the nearest hundredth.', s.a, s.b, s.c, s.k);
  }
  function q3c(r) {
    var s = pickWhere(function () { return { p: nz(r, 1, 5), c: r.int(-9, 12), k: r.int(1, 6) }; }, function (z) { var d1 = z.p * z.p - z.c + z.k, d2 = z.p * z.p - z.c - z.k; return d1 > 0 && d2 > 0 && isSq(d1) !== isSq(d2) && !(z.p === -3 && z.c === 4 && z.k === 1); });
    return exactAndRound('Solve ' + t(A(polyT(1, -2 * s.p, s.c)) + '=' + s.k) + '. Give exact answers, then answers to the nearest hundredth.', 1, -2 * s.p, s.c, s.k);
  }

  /* #4: the graph of y = |f(x)|; f = (x − p)² − w², the line y = k with k = w² − m² */
  function q4Shared(r) {
    return pickWhere(function () { return { p: r.int(-2, 2), w: r.int(2, 4), m: r.int(1, 3) }; }, function (z) { z.k = z.w * z.w - z.m * z.m; return z.m < z.w && !isSq(2 * z.w * z.w - z.m * z.m) && !(z.p === -1 && z.w === 2 && z.m === 1) && !(z.p === 1 && z.w === 2); });
  }
  function q4Info(s) { var b = -2 * s.p, c = s.p * s.p - s.w * s.w; return { b: b, c: c, inner: polyT(1, b, c), S: absK(1, b, c, s.k) }; }
  function q4Graph(s, line) {
    var I = q4Info(s), out = Math.sqrt(s.w * s.w + s.k) + 0.6, xr = [Math.floor(s.p - out) - 1, Math.ceil(s.p + out) + 1], top = Math.max(s.w * s.w, s.k) + 2;
    return G({ x: xr, y: [-1, top], labels: 1, labelsY: top > 11 ? 2 : 1, max: 320, fns: [crv(function (x) { return Math.abs(x * x + I.b * x + I.c); }, { from: s.p - out, to: s.p + out })], hline: line ? [s.k] : [], aria: 'the graph of y = |' + I.inner + '|, a W shape' });
  }
  function q4stem(s) { var I = q4Info(s); return 'The graph of ' + t('y=' + A(I.inner)) + ' is shown.' + q4Graph(s); }
  function q4a(r, s) {
    var I = q4Info(s), ex2 = I.S.c2, est = I.S.c1, keyTex = ex2.map(function (x) { return 'x=' + x.tex; }).concat(est.map(function (x) { return 'x\\approx ' + x.v.toFixed(1); })).join(',\\ ');
    var check = function (resp) {
      if (isNone(resp)) return wrong(CP + 'nosol-claim', 'Draw the line ' + t('y=' + s.k) + ': it meets the graph four times.');
      var L = readVals(resp, 'x');
      if (L.empty) return form('empty', 'Type your answer first.');
      if (L.letter || L.bad || L.unsimp) return form('unreadable', 'Write the four solutions separated by commas, e.g. ' + t('x=-2,\\ x=0,\\ x\\approx 1.6') + '.');
      var Aa = uniqNums(L.vals), exOK = ex2.every(function (e) { return has(Aa, e.v); }), others = Aa.filter(function (a) { return !ex2.some(function (e) { return Math.abs(a - e.v) < 1e-9; }); });
      var estOK = others.length === 2 && est.every(function (e) { return others.some(function (a) { return Math.abs(a - e.v) <= 0.15; }); });
      if (exOK && estOK && Aa.length === 4) return ok();
      if (exOK && others.length === 0) return wrong(CP + 'sol-missing', 'Those two are exact. The line also meets the two outer arms: estimate where.');
      if (exOK && others.length === 2 && est.every(function (e) { return others.some(function (a) { return Math.abs(a - e.v) <= 0.6; }); })) return wrong(CP + 'graph-read', 'Close: estimate the outer two more carefully (to the nearest tenth), where the line crosses the arms.');
      if (!exOK && Aa.length === 4 && est.every(function (e) { return Aa.some(function (a) { return Math.abs(a - e.v) <= 0.15; }); })) return wrong(CP + 'graph-read', 'The outer two are fine. The line passes exactly through two grid points on the middle hump: read those exactly.');
      if (Aa.length < 4) return wrong(CP + 'sol-missing', 'The line ' + t('y=' + s.k) + ' meets the graph four times.');
      return wrong('value', null);
    };
    var p = KP.math('Use the graph to solve ' + t(A(I.inner) + '=' + s.k) + ': give the two solutions you can read exactly, and estimate the other two to the nearest tenth.', check, keyTex,
      'Draw the line ' + t('y=' + s.k) + '.' + q4Graph(s, true) + 'It passes through ' + ex2.map(function (x) { return t(pt(x.v, s.k)); }).join(' and ') + ' exactly (on the reflected hump), and meets the outer arms near ' + est.map(function (x) { return t('x\\approx ' + x.v.toFixed(1)); }).join(' and ') + '.',
      ['Draw the horizontal line ' + t('y=' + s.k) + ' across the graph.', 'Two of the intersection points are on grid points; the other two are between grid lines.'], 'solving |f(x)| = k from a graph', { keys: 'u7sol', vars: ['x'], placeholder: 'e.g. x = -2, x = 0, x ≈ 1.6, x ≈ -3.6' });
    p.bad = [ex2.map(function (x) { return 'x=' + x.tex; }).join(',\\ '), est.map(function (x) { return 'x=' + x.v.toFixed(1); }).join(',\\ ')];
    return p;
  }
  function q4b(r, s) {
    var I = q4Info(s);
    return rootsPart(CP, 'Solve ' + t(A(I.inner) + '=' + s.k) + ' algebraically to confirm. Give exact answers.', I.S.vals, { wrongs: kWrongs(I.S, I.inner, s.k) }, I.S.text + '<br>Solutions: ' + t(solsT(I.S.vals)) + '.', H_CASES, 'solving |f(x)| = k exactly');
  }

  /* #5: the number of solutions of |f(x)| = k; f has zeros p ± w and vertex (p, −w²) */
  function q5Shared(r) { return pickWhere(function () { return { p: nz(r, 1, 4), w: r.int(2, 5) }; }, function (z) { return !(z.p === 2 && z.w === 3) && !(z.p === 3 && z.w === 2) && !(z.p === 1 && z.w === 2); }); }
  function q5Q(s) { return { b: -2 * s.p, c: s.p * s.p - s.w * s.w, r1: s.p - s.w, s1: s.p + s.w, hump: s.w * s.w }; }
  function q5stem(s) { var Q = q5Q(s); return 'The parabola ' + t('y=' + polyT(1, Q.b, Q.c)) + ' has zeros ' + t(Q.r1) + ' and ' + t(Q.s1) + ' and vertex ' + t(pt(s.p, -Q.hump)) + '. State the number of solutions of ' + t(A(polyT(1, Q.b, Q.c)) + '=k') + ' for each value of ' + t('k') + '.'; }
  function countPart(r, s, kind) {
    var Q = q5Q(s), hump = Q.hump, inner = polyT(1, Q.b, Q.c);
    var k = kind === 'between' ? r.int(1, hump - 1) : kind === 'top' ? hump : kind === 'above' ? hump + r.int(1, 8) : kind === 'zero' ? 0 : -r.int(1, 9);
    var n = { between: 4, top: 3, above: 2, zero: 2, neg: 0 }[kind];
    var diag = function (v) {
      if (kind === 'top' && (v === 4 || v === 2)) return { code: CP + 'cnt-hump', hint: 'The reflected hump reaches exactly ' + t('y=' + hump) + ': the line touches its top once, and crosses each outer arm once.' };
      if (kind === 'between' && (v === 2 || v === 3)) return { code: CP + 'cnt-two', hint: 'The line also crosses the reflected hump (it reaches ' + t('y=' + hump) + ') twice.' };
      if (kind === 'above' && (v === 4 || v === 3)) return { code: CP + 'cnt-four', hint: 'The reflected hump only reaches ' + t('y=' + hump) + ', so the line ' + t('y=' + k) + ' passes above it.' };
      if (kind === 'zero' && v !== 2) return { code: CP + 'cnt-zero', hint: t('|f(x)|=0') + ' exactly at the zeros of ' + t('f') + '.' };
      if (kind === 'neg' && v !== 0) return { code: CP + 'cnt-neg', hint: 'An absolute value is never negative.' };
      return null;
    };
    var yr = [Math.min(-1, k - 1), Math.max(hump, k) + 2], xr = [Q.r1 - 2, Q.s1 + 2];
    var fig = G({ x: xr, y: yr, labelsX: xr[1] - xr[0] > 12 ? 2 : 1, labelsY: yr[1] - yr[0] > 24 ? 5 : yr[1] - yr[0] > 12 ? 2 : 1, gridY: yr[1] - yr[0] > 24 ? 5 : 1, unitX: 240 / (xr[1] - xr[0]), unitY: 220 / (yr[1] - yr[0]), max: 280, fns: [crv(function (x) { return Math.abs(x * x + Q.b * x + Q.c); }, { from: Q.r1 - 1.6, to: Q.s1 + 1.6 })], hline: [k], aria: 'the W-shaped graph of y = |f(x)| and the line y = ' + k });
    var why = { between: 'between 0 and ' + t(hump) + ': it crosses both outer arms and the hump twice', top: 'touches the top of the hump and crosses each outer arm', above: 'is above the hump: it meets only the two outer arms', zero: 'is the ' + t('x') + '-axis: the graph touches it at the two zeros', neg: 'is below the ' + t('x') + '-axis: it misses the graph' }[kind];
    var p = KP.number(t('k=' + k), n, diag,
      'The graph of ' + t('y=' + A(inner)) + ' is a W with zeros ' + t(Q.r1) + ' and ' + t(Q.s1) + ' and the top of the reflected hump at ' + t(pt(s.p, hump)) + '.' + fig + 'The line ' + t('y=' + k) + ' ' + why + ': <b>' + n + '</b> solution' + (n === 1 ? '' : 's') + '.',
      ['Sketch ' + t('y=' + A(inner)) + ': reflect the part of the parabola below the ' + t('x') + '-axis. The vertex ' + t(pt(s.p, -hump)) + ' becomes ' + t(pt(s.p, hump)) + '.', 'Count where the horizontal line ' + t('y=' + k) + ' meets the W.'], 'number of solutions of |f(x)| = k');
    p.bad = [4, 3, 2, 0, 1].filter(function (v) { return v !== n && diag(v); }).map(String);
    return p;
  }

  /* #6: k for exactly three solutions, then solve */
  function q6Shared(r) { return pickWhere(function () { return { p: nz(r, 1, 5), q: -r.int(2, 20) }; }, function (z) { return !(z.p === -1 && z.q === -9) && !(z.p === 1 && z.q === -4) && !(z.p === 2 && z.q === -4); }); }
  function q6Info(s) { var b = -2 * s.p, c = s.p * s.p + s.q; return { b: b, c: c, inner: polyT(1, b, c), k: -s.q }; }
  function q6stem(s) { return 'Consider ' + t(A(q6Info(s).inner) + '=k') + '.'; }
  function q6a(r, s) {
    var I = q6Info(s);
    var p = KP.number('For what value of ' + t('k') + ' does the equation have exactly three solutions?', I.k, function (v) { if (v === s.q) return { code: CP + 'k-q', hint: 'The vertex of the parabola is below the axis; after the reflection the top of the hump is at ' + t('y=' + (-s.q)) + '.' }; if (v === 0) return { code: CP + 'k-zero', hint: 'When ' + t('k=0') + ' the solutions are the two zeros only.' }; return null; },
      'Complete the square: ' + t(I.inner + '=(x' + sgT(-s.p) + ')^{2}' + sgT(s.q)) + '. The vertex is ' + t(pt(s.p, s.q)) + ', so the reflected hump has its top at ' + t(pt(s.p, -s.q)) + '. The line ' + t('y=' + I.k) + ' touches the top and crosses each outer arm: three solutions, so ' + t('k=' + I.k) + '.',
      ['Three solutions: the line ' + t('y=k') + ' touches the top of the reflected hump.', 'Find the vertex: complete the square (or use ' + t('x=-\\frac{b}{2a}') + ').'], 'k for three solutions');
    p.bad = [String(s.q), '0'];
    return p;
  }
  function q6b(r, s) {
    var I = q6Info(s), S = absK(1, I.b, I.c, I.k);
    return rootsPart(CP, 'Solve the equation for that value of ' + t('k') + '. Give exact answers.', S.vals, { wrongs: kWrongs(S, I.inner, I.k) }, t(A(I.inner) + '=' + I.k) + '.<br>' + S.text + '<br>Solutions: ' + t(solsT(S.vals)) + ' (three: the double root is the top of the hump).', H_CASES, 'solving at the top of the hump');
  }

  /* #7: |A| = B, extraneous roots */
  function nT(v) { var f = toR(v); return f && f[1] <= 100 ? ex.texRat(f) : '\\approx ' + v.toFixed(2); }
  function chkLine(L, R, x, v) { var l = L(rv(x)), rr = R(rv(x)); return t((v || 'x') + '=' + rt(x)) + ': ' + (Math.abs(l - rr) < 1e-9 ? 'left side ' + t(nT(l)) + ', right side ' + t(nT(rr)) + ' ✓' : 'the right side is ' + t(nT(rr)) + ', negative, so it is extraneous'); }
  function extrPart(prompt, vals, extr, sol, hints, text, wr) {
    return rootsPart(CP, prompt, vals, { extr: extr, rejValid: true, wrongs: (wr || []).concat([{ vals: [], code: CP + 'nosol-claim', hint: vals.length ? 'Check again: ' + t('x=' + rt(vals[0])) + ' makes both sides equal.' : '' }]) }, sol, hints || ['Solve ' + t('A=B') + ' and ' + t('A=-B') + ' (negate the whole right side).', 'Check every root in the original equation: the side without bars cannot be negative.'], text);
  }
  function q7a(r) {
    var s = pickWhere(function () { return { m: r.int(1, 3), u: r.int(2, 9) }; }, function (z) { return z.u > z.m && !(z.m === 1 && z.u === 3) && !(z.m === 3 && z.u === 4) && z.u * (z.u - z.m) <= 66; });
    var n = s.u * (s.u - s.m), mx = s.m === 1 ? 'x' : s.m + 'x', inner = 'x^{2}-' + n;
    var c1 = solveQ(1, -s.m, -n), c2 = solveQ(1, s.m, -n), all = c1.roots.concat(c2.roots).map(function (x) { return x.v; });
    var vals = all.filter(function (x) { return x >= 0; }).sort(function (a, b) { return a - b; }), extr = all.filter(function (x) { return x < 0; });
    var L = function (x) { return Math.abs(x * x - n); }, R = function (x) { return s.m * x; };
    return extrPart('Solve and check: ' + t(A(inner) + '=' + mx) + '. Reject any extraneous solutions.', vals, extr,
      'Case 1: ' + t(inner + '=' + mx) + ', so ' + c1.text + '.<br>Case 2: ' + t(inner + '=-' + mx) + ', so ' + c2.text + '.<br>The right side ' + t(mx) + ' must be ' + t('\\ge 0') + ': check each root.<br>' + all.slice().sort(function (a, b) { return a - b; }).map(function (x) { return chkLine(L, R, x); }).join('<br>') + '<br>Solutions: ' + t(solsT(vals)) + '.', null, '|x² − n| = mx with extraneous roots');
  }
  function q7b(r) {
    var s = pickWhere(function () { return { b: r.int(2, 7), u: r.int(1, 13), g: r.pick([1, 1, -1]) }; }, function (z) { z.w = 2 * z.b - z.u; z.d = z.u * z.w; return z.w > 0 && z.u < z.w && !isSq(z.d) && z.d <= 40 && !(z.b === 2 && z.d === 3); });
    var gb = s.g * s.b, inner = polyT(1, -gb, 0), rhs = linT(gb, -s.d), L = function (x) { return Math.abs(x * x - gb * x); }, R = function (x) { return gb * x - s.d; };
    var c1 = solveQ(1, -2 * gb, s.d), c2 = solveQ(1, 0, -s.d), all = c1.roots.concat(c2.roots);
    var vals = all.filter(function (x) { return R(x.v) >= -1e-9; }).sort(byVal), extr = all.filter(function (x) { return R(x.v) < -1e-9; });
    return extrPart('Solve and check: ' + t(A(inner) + '=' + rhs) + '. Reject any extraneous solutions. Give exact answers.', vals, extr,
      'Case 1: ' + t(inner + '=' + rhs) + ', so ' + c1.text + '.<br>Case 2: ' + t(inner + '=-(' + rhs + ')') + ', so ' + c2.text + '.<br>Need ' + t(rhs + '\\ge 0') + ', that is ' + t('x' + (s.g > 0 ? '\\ge ' : '\\le ') + rt(toR([s.d, gb]))) + '.<br>' + all.slice().sort(byVal).map(function (x) { return chkLine(L, R, x); }).join('<br>') + '<br>Solutions: ' + t(solsT(vals)) + '.', null, '|x² − bx| = bx − d with extraneous roots',
      [{ vals: c1.roots, code: CP + 'one-case', hint: 'Solve the second case too: ' + t(inner + '=-(' + rhs + ')') + '.' }]);
  }
  function q7c(r) {
    var s = pickWhere(function () { return { a: nz(r, 1, 7), e: nz(r, 1, 7) }; }, function (z) { return Math.abs(z.a - z.e) >= 2 && !(z.a === 4 && z.e === 2); });
    var inner = linT(1, -s.a), rhs = polyT(1, -(s.a + s.e), s.a * s.e), L = function (x) { return Math.abs(x - s.a); }, R = function (x) { return (x - s.a) * (x - s.e); };
    var c1 = solveQ(1, -(s.a + s.e + 1), s.a * s.e + s.a), c2 = solveQ(1, -(s.a + s.e - 1), s.a * s.e - s.a), all = uniqNums(c1.roots.concat(c2.roots).map(function (x) { return x.v; })).sort(function (a, b) { return a - b; });
    var vals = all.filter(function (x) { return R(x) >= -1e-9; }), extr = all.filter(function (x) { return R(x) < -1e-9; });
    return extrPart('Solve and check: ' + t(A(inner) + '=' + rhs) + '. Reject any extraneous solutions.', vals, extr,
      'Case 1: ' + t(inner + '=' + rhs) + ', so ' + c1.text + '.<br>Case 2: ' + t('-(' + inner + ')=' + rhs) + ', so ' + c2.text + '.<br>' + all.map(function (x) { return chkLine(L, R, x); }).join('<br>') + '<br>Solutions: ' + t(solsT(vals)) + '.', null, '|x − a| = quadratic with extraneous roots');
  }
  function q7d(r) {
    var s = pickWhere(function () { return { a: r.pick([2, 3, 4, -2, -3]), b: r.int(-9, 9), c: r.pick([1, 1, 2, -1]), d: r.int(-9, 9) }; }, function (z) {
      if (Math.abs(z.a) === Math.abs(z.c) || z.b === 0) return false;
      var x1 = (z.d - z.b) / (z.a - z.c), x2 = (-z.d - z.b) / (z.a + z.c), f1 = toR(x1), f2 = toR(x2);
      if (!f1 || !f2 || f1[1] > 5 || f2[1] > 5 || Math.abs(x1 - x2) < 1e-9 || Math.abs(x1) > 12 || Math.abs(x2) > 12) return false;
      z.x1 = f1; z.x2 = f2;
      return z.c * x1 + z.d < -1e-9 && z.c * x2 + z.d < -1e-9 && !(z.a === 2 && z.b === 3 && z.c === 1 && z.d === 1);
    });
    var inner = linT(s.a, s.b), rhs = linT(s.c, s.d), L = function (x) { return Math.abs(s.a * x + s.b); }, R = function (x) { return s.c * x + s.d; };
    return extrPart('Solve and check: ' + t(A(inner) + '=' + rhs) + '. Reject any extraneous solutions.', [], [s.x1, s.x2],
      'Case 1: ' + t(inner + '=' + rhs) + ', so ' + t('x=' + rt(s.x1)) + '.<br>Case 2: ' + t(inner + '=-(' + rhs + ')') + ', so ' + t('x=' + rt(s.x2)) + '.<br>' + [s.x1, s.x2].map(function (x) { return chkLine(L, R, x); }).join('<br>') + '<br>Both are extraneous: <b>no solution</b>.', null, '|ax + b| = cx + d, no solution');
  }

  /* #8: a student's work on |x² − n| = x + d (did not check) */
  function q8Shared(r) {
    return pickWhere(function () { return { u: r.int(2, 7), d: r.int(1, 6) }; }, function (z) {
      z.n = z.u * (z.u - 1) - z.d; if (z.n <= z.d || (z.u === 3 && z.d === 1)) return false;
      var c2 = qroots(1, 1, -(z.n - z.d)); if (c2.roots.length < 2) return false;
      var all = [z.u, 1 - z.u].concat(c2.roots.map(function (x) { return x.v; })); z.valid = all.filter(function (x) { return x + z.d >= -1e-9; }); z.extr = all.filter(function (x) { return x + z.d < -1e-9; });
      z.c2 = c2.roots; return z.extr.length >= 1 && z.valid.length >= 1 && !c2.rational;
    });
  }
  function q8stem(s) { var all = [s.u, 1 - s.u].map(String).concat(s.c2.map(function (x) { return x.tex; })); return 'A student solved ' + t(A('x^{2}-' + s.n) + '=x+' + s.d) + ' and wrote: “' + t('x=' + all.join(',\\ ')) + '.”'; }
  function q8a(r, s) {
    return mc(r, 'Identify the error.', [
      { html: 'The student did not check the roots: some make the right side ' + t('x+' + s.d) + ' negative, so they are extraneous.', right: true },
      { html: 'The second case should be ' + t('x^{2}-' + s.n + '=-x+' + s.d) + '.', why: 'Both cases are right: the second negates the whole right side, ' + t('-(x+' + s.d + ')') + '. Check the roots.', code: 'neg' },
      { html: 'The second case should have been solved by factoring, not the quadratic formula.', why: 'It does not factor; the formula is right. Check the roots.', code: 'fac' },
      { html: 'Only the first case should be solved, because the right side contains ' + t('x') + '.', why: 'Both cases are needed. The extra step is to check the roots.', code: 'one' }
    ], 'The cases are right: ' + t('x^{2}-x-' + (s.n + s.d) + '=0') + ' gives ' + t(s.u) + ' and ' + t(1 - s.u) + ', and ' + t('x^{2}+x-' + (s.n - s.d) + '=0') + ' gives ' + t(qroots(1, 1, -(s.n - s.d)).pm) + '. But the right side ' + t('x+' + s.d) + ' must be ' + t('\\ge 0') + ' (' + t('x\\ge -' + s.d) + '), and the student did not check.', ['Look at each root: is the right side ' + t('x+' + s.d) + ' positive there?'], 'error: did not check');
  }
  function q8b(r, s) {
    var vals = s.valid.map(function (x) { var q = s.c2.filter(function (c) { return Math.abs(c.v - x) < 1e-9; })[0]; return q || x; }), extr = s.extr;
    var L = function (x) { return Math.abs(x * x - s.n); }, R = function (x) { return x + s.d; };
    return extrPart('Give the correct solution.', vals, extr, 'Need ' + t('x+' + s.d + '\\ge 0') + ', that is ' + t('x\\ge -' + s.d) + '.<br>' + [s.u, 1 - s.u].concat(s.c2).sort(byVal).map(function (x) { return x.tex ? t('x=' + x.tex + '\\approx ' + x.v.toFixed(2)) + (x.v + s.d >= 0 ? ' ✓' : ': ' + t('x+' + s.d + '<0') + ', extraneous') : chkLine(L, R, x); }).join('<br>') + '<br>Solutions: ' + t(solsT(vals)) + '.', ['Keep only the roots that make ' + t('x+' + s.d) + ' non-negative.'], 'rejecting extraneous roots');
  }

  /* #11 / B3: a graphing calculator, to the nearest tenth, then one exact value */
  function calcShared(r, half) {
    return pickWhere(function () { return { b: half ? -r.int(1, 4) : nz(r, 1, 5), c: r.int(-6, 4), k: r.int(1, 6) }; }, function (z) {
      var A2 = half ? 1 : 1, B2 = half ? 2 * z.b : z.b, C2 = half ? 2 * z.c : z.c, K2 = half ? 2 * z.k : z.k;
      var D1 = B2 * B2 - 4 * (C2 - K2), D2 = B2 * B2 - 4 * (C2 + K2);
      z.B2 = B2; z.C2 = C2; z.K2 = K2;
      return D1 > 0 && D2 > 0 && !isSq(D1) && !isSq(D2) && !(half && z.b === -2 && z.c === -3 && z.k === 4) && !(!half && z.b === -5 && z.c === 2 && z.k === 3) && !(!half && z.b === -2 && z.c === -3);
    });
  }
  function calcInner(s, half) { return half ? '0.5x^{2}' + (s.b ? (Math.abs(s.b) === 1 ? (s.b < 0 ? '-' : '+') : sgT(s.b)) + 'x' : '') + (s.c ? sgT(s.c) : '') : polyT(1, s.b, s.c); }
  function calcA(r, s, half) {
    var inner = calcInner(s, half), S = absK(1, s.B2, s.C2, s.K2, 'x', { dec: 1, innerT: half ? 'x^{2}' + sgT(s.B2) + 'x' + (s.C2 ? sgT(s.C2) : '') : null });
    var lo = Math.floor(S.vals[0].v) - 2, hi = Math.ceil(S.vals[S.vals.length - 1].v) + 2;
    var plain = inner.replace(/\^\{2\}/g, '^2').replace(/x/g, 'X');
    var sol = '<code>Y1 = abs(' + plain + ')</code>, <code>Y2 = ' + s.k + '</code>; a window such as ' + t(lo + '\\le x\\le ' + hi) + ', ' + t('-2\\le y\\le ' + (s.k + 6)) + ' shows all four intersections; use <b>intersect</b> at each.<br>' + t(solsT(S.vals, 'x', 1)) + '.';
    return rootsPart(CP, 'Use a graphing calculator to solve the equation. Give the solutions to the nearest tenth.', S.vals, { dp: 1, wrongs: kWrongs(S, inner, s.k) }, sol,
      ['Enter ' + t('Y_1') + ' = abs( … ) (MATH ▸ NUM) and ' + t('Y_2=' + s.k) + ', then use intersect at each crossing.', 'Make the window wide enough to show the whole W and the line: there are four crossings.'], 'solving |f(x)| = k with a graphing calculator');
  }
  function calcB(r, s, half, all) {
    var inner = calcInner(s, half), S = absK(1, s.B2, s.C2, s.K2);
    if (all) return rootsPart(CP, 'Now give the exact solutions.', S.vals, { wrongs: kWrongs(S, inner, s.k) }, S.text + '<br>' + t(solsT(S.vals)) + ' (they match the calculator: ' + t(solsT(S.vals, 'x', 2)) + ').', H_CASES, 'exact solutions after the calculator');
    var big = S.vals[S.vals.length - 1], caseK = S.c1.some(function (x) { return Math.abs(x.v - big.v) < 1e-9; }) ? 1 : 2;
    var A2 = 'x^{2}' + sgT(s.B2) + 'x' + sgT(caseK === 1 ? s.C2 - s.K2 : s.C2 + s.K2);
    return rootsPart(CP, 'Confirm the largest solution with the quadratic formula: give its exact value.', [big], { wrongs: [{ vals: [S.vals[0]], code: 'value', hint: 'That is the smallest solution. Take the + sign.' }] },
      t(inner + '=' + (caseK === 1 ? '' : '-') + s.k) + (half ? ' (multiply by 2)' : '') + ': ' + t(A2 + '=0') + ', ' + t('x=' + qroots(1, s.B2, caseK === 1 ? s.C2 - s.K2 : s.C2 + s.K2).pm) + '.<br>The largest is ' + t('x=' + big.tex + '\\approx ' + big.v.toFixed(2)) + ', which matches the calculator.',
      ['The largest solution comes from the case whose roots are farthest out: ' + t(inner + '=' + s.k) + '.', half ? 'Multiply the equation by 2 first so the coefficients are integers.' : 'Write the case in standard form and use the quadratic formula.'], 'the exact largest solution');
  }

  /* #12: greenhouse; T = −0.5t² + bt + c, ideal I, band d */
  function q12Shared(r) {
    return pickWhere(function () { return { b: r.int(5, 7), c: r.int(6, 14), I: r.int(20, 30), d: r.int(1, 4), start: r.pick([6, 7]) }; }, function (z) {
      var top = z.c + z.b * z.b / 2, e1 = z.b * z.b - 2 * (z.I + z.d - z.c), e2 = z.b * z.b - 2 * (z.I - z.d - z.c);
      if (!(z.I + z.d < top - 0.5 && z.I - z.d >= z.c + 1)) return false;
      if (!(e1 > 0 && e2 > 0 && isSq(e1) !== isSq(e2))) return false;
      return !(z.b === 6 && z.c === 10 && z.I === 24 && z.d === 2);
    });
  }
  function q12Info(s) {
    var tt = '-0.5t^{2}+' + s.b + 't+' + s.c, inner = '-0.5t^{2}+' + s.b + 't' + sgT(s.c - s.I);
    var up = solveQ(1, -2 * s.b, 2 * (s.I + s.d - s.c), 't'), dn = solveQ(1, -2 * s.b, 2 * (s.I - s.d - s.c), 't');
    var all = up.roots.concat(dn.roots).sort(byVal);
    return { tt: tt, inner: inner, up: up, dn: dn, all: all };
  }
  function q12stem(s) { return 'The temperature in a greenhouse ' + t('t') + ' hours after ' + s.start + ':00 a.m. is ' + t('T=' + q12Info(s).tt) + ' degrees Celsius, ' + t('0\\le t\\le ' + 2 * s.b) + '. The ideal temperature is ' + t(s.I + '\\,^\\circ\\mathrm{C}') + '.'; }
  function q12a(r, s) {
    var I = q12Info(s);
    var sol = t(A('T-' + s.I) + '=' + s.d) + ', so ' + t(A(I.inner) + '=' + s.d) + '.<br>Case 1: ' + t(I.inner + '=' + s.d) + '; multiply by ' + t('-2') + ': ' + I.up.text + '.<br>Case 2: ' + t(I.inner + '=-' + s.d) + '; multiply by ' + t('-2') + ': ' + I.dn.text + '.<br>' + t(solsT(I.all, 't')) + ' (all in ' + t('0\\le t\\le ' + 2 * s.b) + ').';
    return rootsPart(CP, 'Write an absolute value equation for the times when the temperature is exactly ' + t(s.d + '\\,^\\circ\\mathrm{C}') + ' away from ideal, and solve it. Give exact values of ' + t('t') + '.', I.all, { v: 't', wrongs: [{ vals: I.up.roots, code: CP + 'one-case', hint: 'The temperature is also ' + t(s.d + '\\,^\\circ') + ' <b>below</b> ideal at some times: ' + t('T-' + s.I + '=-' + s.d) + '.' }, { vals: I.dn.roots, code: CP + 'one-case', hint: 'The temperature is also ' + t(s.d + '\\,^\\circ') + ' <b>above</b> ideal at some times: ' + t('T-' + s.I + '=' + s.d) + '.' }] }, sol,
      ['The distance between ' + t('T') + ' and ' + t(s.I) + ' is ' + t('|T-' + s.I + '|') + '.', 'Multiply each case by ' + t('-2') + ' to clear the decimal, then factor or use the quadratic formula.'], 'an absolute value problem: greenhouse');
  }
  function clockOf(s, tv) { var mins = Math.round(tv * 60), tot = s.start * 60 + mins, h = Math.floor(tot / 60), m = tot % 60, ap = h >= 12 ? 'p.m.' : 'a.m.', h12 = h % 12 === 0 ? 12 : h % 12; return { tot: tot, txt: h12 + ':' + (m < 10 ? '0' : '') + m + ' ' + ap, h: h, m: m }; }
  function readClock(resp) {
    var s = plainLow(resp).replace(/\s+/g, ' '), m = /^(\d{1,2})\s*[:h]\s*(\d{2})\s*(a\.?\s*m\.?|p\.?\s*m\.?)?$/.exec(s.trim());
    if (!m) return null;
    var h = +m[1], mi = +m[2], ap = m[3] ? m[3].charAt(0) : null;
    if (mi > 59 || h > 23) return null;
    if (ap) { if (h > 12 || h === 0) return null; h = h % 12 + (ap === 'p' ? 12 : 0); }
    return { tot: h * 60 + mi, ap: !!ap };
  }
  function q12b(r, s) {
    var I = q12Info(s), first = I.all[0], C = clockOf(s, first.v), hrs = Math.floor(first.v), mi = Math.round((first.v - hrs) * 60);
    var check = function (resp) {
      var c = readClock(resp);
      if (!c) return form(CP + 'clock-fmt', 'Write the time as h:mm with a.m. or p.m., e.g. 9:05 a.m.');
      if (c.tot === C.tot) return ok();
      if (!c.ap && (c.tot + 720) % 1440 === C.tot) return form(CP + 'clock-fmt', 'Add a.m. or p.m.');
      if (Math.abs(c.tot - C.tot) === 720) return wrong(CP + 'clock-ap', 'Check a.m. or p.m.: count the hours from ' + s.start + ':00 a.m.');
      var decMin = Math.round((first.v - hrs) * 100);
      if (c.tot === s.start * 60 + hrs * 60 + decMin) return wrong(CP + 'clock-h', 'The decimal part of ' + t(first.v.toFixed(3)) + ' h is a fraction of an hour: multiply it by 60 to get minutes.');
      if (Math.abs(c.tot - C.tot) === 1) return wrong(CP + 'clock', 'Round to the nearest minute: ' + t('0.' + first.v.toFixed(4).split('.')[1] + '\\times 60') + '.');
      return wrong(CP + 'clock', 'Add the time ' + t('t') + ' (in hours and minutes) to ' + s.start + ':00 a.m.');
    };
    var p = { prompt: 'At what clock time, to the nearest minute, is the temperature first exactly ' + t(s.d + '\\,^\\circ\\mathrm{C}') + ' from ideal?', input: { type: 'fields', fields: [{ label: 'Clock time', name: 'time', mode: 'text', wide: true, placeholder: 'e.g. 9:05 a.m.' }] }, check: function (resp) { return check(Array.isArray(resp) ? resp[0] : resp); }, key: [C.txt], answer: C.txt,
      solution: 'The first time is ' + t('t=' + first.tex + '\\approx ' + first.v.toFixed(3)) + ' h ' + (mi ? '= ' + hrs + ' h ' + t('(0.' + first.v.toFixed(3).split('.')[1] + '\\times 60\\approx ' + mi + ')') + ' min' : '') + ' after ' + s.start + ':00 a.m.: <b>' + C.txt + '</b>.', hints: ['The smallest ' + t('t') + ' from part (a) is in hours after ' + s.start + ':00 a.m.', 'Multiply the decimal part by 60 to get minutes.'], text: 'clock time from t' };
    var wrongAp = clockOf(s, first.v + 12).txt;
    p.bad = [[wrongAp], [s.start + hrs + ':' + (Math.round((first.v - hrs) * 100) < 10 ? '0' : '') + Math.round((first.v - hrs) * 100) + ' a.m.']].filter(function (b) { return b[0] !== C.txt; });
    return p;
  }
  function q12c(r, s) {
    var I = q12Info(s), hot = s.I + s.d, cl = function (L) { return L.map(function (x) { return clockOf(s, x.v).txt; }).join(' and '); };
    return mc(r, 'At which of these times is the temperature ' + t(hot + '\\,^\\circ\\mathrm{C}') + '?', [
      { html: cl(I.up.roots) + ' only', right: true },
      { html: cl(I.dn.roots) + ' only', why: 'At those times ' + t('T-' + s.I + '=-' + s.d) + ': the temperature is ' + t((s.I - s.d) + '\\,^\\circ') + '.', code: 'low' },
      { html: 'all four times', why: 'Only one case has ' + t('T=' + hot) + '; at the other two times ' + t('T=' + (s.I - s.d)) + '.', code: 'all' },
      { html: cl([I.all[0], I.all[1]]) + ' only', why: 'The first two times are in different cases: one is ' + t(s.d + '\\,^\\circ') + ' below ideal and one is ' + t(s.d + '\\,^\\circ') + ' above.', code: 'ends' }
    ], t('T=' + hot) + ' means ' + t('T-' + s.I + '=' + s.d) + ' (Case 1): ' + I.up.roots.map(function (x) { return t('t=' + x.tex); }).join(' and ') + ', that is ' + cl(I.up.roots) + '. At the other two times ' + t('T=' + (s.I - s.d) + '\\,^\\circ\\mathrm{C}') + '.', ['Which case gives ' + t('T=' + hot) + '?'], 'which case gives which temperature');
  }

  /* #13 / B5: MC number of solutions */
  function mcCount(r) {
    var s = pickWhere(function () { return { p: nz(r, 1, 4), w: r.int(2, 4), kind: r.pick(['top', 'top', 'between', 'above']) }; }, function (z) { return !(z.p === -2 && z.w === 3) && !(z.p === 1 && z.w === 2); });
    var b = -2 * s.p, c = s.p * s.p - s.w * s.w, hump = s.w * s.w, k = s.kind === 'top' ? hump : s.kind === 'between' ? r.int(1, hump - 1) : hump + r.int(1, 6), n = { top: 3, between: 4, above: 2 }[s.kind], inner = polyT(1, b, c);
    var why = { 4: 'The line would have to cross the hump twice: it is ' + (s.kind === 'top' ? 'only touching its top' : 'above it') + '.', 2: 'The line also meets the reflected hump (its top is ' + t(pt(s.p, hump)) + ').', 3: 'Three solutions only when the line touches the top of the hump, at ' + t('y=' + hump) + '.', 0: 'The line ' + t('y=' + k) + ' is above the ' + t('x') + '-axis: it meets the outer arms at least.' };
    return mc(r, 'How many solutions does ' + t(A(inner) + '=' + k) + ' have?', [0, 2, 3, 4].map(function (v) { return { html: t(v), right: v === n, why: v === n ? null : why[v], code: 'n' + v }; }),
      t(inner + '=(x' + sgT(-s.p) + ')^{2}-' + hump) + ', so the reflected hump has its top at ' + t(pt(s.p, hump)) + '. The line ' + t('y=' + k) + ' ' + { top: 'touches the top', between: 'crosses the hump twice and each outer arm once', above: 'passes above the hump and meets the two outer arms' }[s.kind] + ': <b>' + n + '</b> solutions.', ['Complete the square to find the vertex.', 'Compare ' + t('k') + ' with the height of the reflected hump.'], 'number of solutions (MC)', 4);
  }
  /* #14: MC the solution of |x² − ax| = m(x − a) */
  function q14(r) {
    var s = pickWhere(function () { return { a: r.int(-3, 5), m: r.pick([1, 2, 3]) }; }, function (z) { return z.a !== 0 && z.a !== z.m && z.a !== -z.m && !(z.a === 1 && z.m === 1) && [z.m, -z.m].some(function (x) { return x < z.a; }); });
    var inner = polyT(1, -s.a, 0), rhs = s.m === 1 ? linT(1, -s.a) : s.m + '(' + linT(1, -s.a) + ')';
    var all = uniqNums([s.a, s.m, -s.m]).sort(function (x, y) { return x - y; }), vals = all.filter(function (x) { return s.m * (x - s.a) >= 0; }), extr = all.filter(function (x) { return s.m * (x - s.a) < 0; });
    var setH = function (L) { return L.length ? L.map(function (x) { return t('x=' + x); }).join(' or ') : 'no real solution'; };
    var opts = [{ html: setH(vals) + (vals.length === 1 ? ' only' : ''), right: true }, { html: setH(all), why: 'Check each root: the right side ' + t(rhs) + ' must not be negative.', code: 'nocheck' }];
    if (extr.length) opts.push({ html: setH(extr), why: 'Those make the right side negative: they are the extraneous ones.', code: 'swap' });
    opts.push({ html: 'no real solution', why: 'Check ' + t('x=' + s.a) + ': both sides are 0.', code: 'none' });
    if (opts.length < 4) opts.push({ html: setH([s.a, -s.a].sort(function (x, y) { return x - y; })), why: 'Solve both cases by factoring: ' + t('(x' + sgT(-s.a) + ')(x' + sgT(-s.m) + ')=0') + ' and ' + t('(x' + sgT(-s.a) + ')(x' + sgT(s.m) + ')=0') + '.', code: 'pm' });
    return mc(r, 'The solution of ' + t(A(inner) + '=' + rhs) + ' is', opts,
      'Case 1: ' + t(inner + '=' + rhs) + ', ' + t('(x' + sgT(-s.a) + ')(x' + sgT(-s.m) + ')=0') + ', ' + t('x=' + s.a + '\\text{ or }' + s.m) + '.<br>Case 2: ' + t(inner + '=-' + (s.m === 1 ? '(' + rhs + ')' : rhs)) + ', ' + t('(x' + sgT(-s.a) + ')(x' + sgT(s.m) + ')=0') + ', ' + t('x=' + s.a + '\\text{ or }' + (-s.m)) + '.<br>The right side must be ' + t('\\ge 0') + ', so ' + t('x\\ge ' + s.a) + ': ' + setH(vals) + '.', ['Factor each case: ' + t('x') + ' is a common factor on the left.', 'Check each root in the original equation.'], 'solution with extraneous roots (MC)');
  }
  /* #15: MC which equation has no real solution */
  function q15(r) {
    var s = pickWhere(function () { return { n: r.int(2, 6), c: r.int(1, 6), e: r.int(2, 9), k: r.int(1, 8), m: r.int(5, 20), j: r.int(1, 19) }; }, function (z) { return z.k < z.e && z.j < z.m && !(z.e === 3 && z.k === 2); });
    var opts = [
      { html: t(A('x^{2}+' + s.e) + '=' + s.k), right: true },
      { html: t(A('x^{2}-' + s.n * s.n) + '=0'), why: t('x=\\pm ' + s.n) + ' (the inside is 0).', code: 'zero' },
      { html: t(A('x^{2}+' + s.c) + '=' + s.c), why: t('x=0') + ' works: ' + t('|0+' + s.c + '|=' + s.c) + '.', code: 'equal' },
      { html: t(A('x^{2}-' + s.m) + '=' + s.j), why: t('x^{2}=' + (s.m + s.j)) + ' gives two solutions (and maybe more).', code: 'minus' }
    ];
    return mc(r, 'Which equation has no real solution?', opts, t('x^{2}+' + s.e + '\\ge ' + s.e + '>' + s.k) + ' for every ' + t('x') + ', and ' + t('x^{2}+' + s.e + '=-' + s.k) + ' has no real roots: no solution.', ['For each equation, try the two cases.', 'How small can ' + t('x^{2}+c') + ' be?'], 'which has no solution (MC)', 2);
  }
  /* #16: NR largest solution to the hundredth */
  function q16(r) {
    var s = pickWhere(function () { return { b: nz(r, 1, 6), c: r.int(-6, 6), k: r.int(2, 9) }; }, function (z) { var D1 = z.b * z.b - 4 * (z.c - z.k), D2 = z.b * z.b - 4 * (z.c + z.k); return D1 > 0 && !isSq(D1) && D2 < 0 && (-z.b + Math.sqrt(D1)) / 2 > 0.005 && !(z.b === 3 && z.c === -2 && z.k === 5); });
    var S = absK(1, s.b, s.c, s.k, 'x', { dec: 2 }), big = S.vals[S.vals.length - 1];
    var p = KP.approx('The largest solution of ' + t(A(polyT(1, s.b, s.c)) + '=' + s.k) + ', to the nearest hundredth, is ____.', big.v, 2, { nr: true }, S.text + '<br>The largest solution is ' + t(big.tex + '\\approx ' + big.v.toFixed(2)) + '.', H_CASES, 'largest solution (NR)');
    p.bad = [S.vals[0].v.toFixed(2)];
    return p;
  }

  /* ---------- stretch: two absolute values (Lesson 5 §4) ---------- */
  function twoAbsCases(Aq, Bq, Cq, Ap, Bp, Cp) { // |Aq x² + Bq x + Cq| = |Ap x² + Bp x + Cp|
    var c1 = solveQ(Aq - Ap, Bq - Bp, Cq - Cp), c2 = solveQ(Aq + Ap, Bq + Bp, Cq + Cp), L = polyT(Aq, Bq, Cq), R = polyT(Ap, Bp, Cp);
    var all = c1.roots.concat(c2.roots), seen = [], vals = all.filter(function (x) { if (has(seen, x.v)) return false; seen.push(x.v); return true; }).sort(byVal);
    var text = t(L + '=' + R) + ', so ' + c1.text + '.<br>' + t(L + '=-(' + R + ')') + ', so ' + c2.text + '.';
    return { vals: vals, c1: c1.roots, c2: c2.roots, text: text, eq: A(L) + '=' + A(R) };
  }
  var H_TWO = ['Two numbers have the same absolute value when they are equal or opposites: solve ' + t('A=B') + ' and ' + t('A=-B') + '.', 'Both sides are never negative, so no root is extraneous.'];
  function twoPart(prompt, T, text) {
    var w = []; if (T.c2.length && T.c1.length) { w.push({ vals: T.c1, code: CP + 'one-case', hint: 'Solve the second case too: ' + t('A=-B') + '.' }); w.push({ vals: T.c2, code: CP + 'one-case', hint: 'Solve the first case too: ' + t('A=B') + '.' }); }
    return rootsPart(CP, prompt, T.vals, { wrongs: w }, T.text + '<br>Solutions: ' + t(solsT(T.vals)) + '.', H_TWO, text);
  }
  function s9a(r) { // |ax + b| = |cx + d|
    var s = pickWhere(function () { return { a: nz(r, 1, 3), b: nz(r, 1, 7), c: nz(r, 1, 4), d: nz(r, 1, 7) }; }, function (z) { return Math.abs(z.a) !== Math.abs(z.c) && toR([z.d - z.b, z.a - z.c])[1] <= 5 && toR([-z.d - z.b, z.a + z.c])[1] <= 5 && !(z.a === 1 && z.b === -4 && z.c === 3 && z.d === 2) && !(z.a === 1 && z.b === 5 && z.c === 2 && z.d === -1) && !(z.a === 2 && z.b === 5 && z.c === 1 && z.d === -1); });
    return twoPart('Solve ' + t(twoAbsCases(0, s.a, s.b, 0, s.c, s.d).eq) + '.', twoAbsCases(0, s.a, s.b, 0, s.c, s.d), '|A| = |B|, linear');
  }
  function s9b(r, exactAsk) { // |x² + bx| = |cx + d|
    var s = pickWhere(function () { return { b: nz(r, 1, 5), c: nz(r, 1, 3), d: r.int(-6, 6) }; }, function (z) {
      var T = twoAbsCases(1, z.b, 0, 0, z.c, z.d); z.T = T;
      if (T.vals.length < 2) return false; if (!exactAsk && !T.vals.every(function (x) { return Number.isInteger(x.v); })) return false;
      return !(z.b === -2 && z.c === 1 && z.d === 4) && !(z.b === -4 && z.c === 2 && z.d === -5) && !(z.b === 0);
    });
    return twoPart('Solve ' + t(s.T.eq) + '.' + (exactAsk ? ' Give exact answers.' : ''), s.T, '|quadratic| = |linear|');
  }
  function s9c(r) { // |x² − n| = |x² + bx|
    var s = pickWhere(function () { return { n: r.int(1, 12), b: nz(r, 1, 6) }; }, function (z) { var T = twoAbsCases(1, 0, -z.n, 1, z.b, 0); z.T = T; return T.vals.length >= 2 && T.vals.every(function (x) { var f = toR(x.v); return f && f[1] <= 4; }) && !(z.n === 4 && z.b === -2); });
    return twoPart('Solve ' + t(s.T.eq) + '.', s.T, '|quadratic| = |quadratic|');
  }
  function s17(r) {
    var s = pickWhere(function () { return { c1: nz(r, 1, 6), b2: nz(r, 1, 6), c2: r.int(-6, 6) }; }, function (z) { var T = twoAbsCases(1, 0, z.c1, 1, z.b2, z.c2); z.T = T; return T.vals.length >= 2 && !Number.isInteger(T.vals[T.vals.length - 1].v) && T.vals[T.vals.length - 1].v > 0.005 && T.vals[T.vals.length - 1].v < 9.99 && !(z.c1 === -3 && z.b2 === -4 && z.c2 === 1); });
    var big = s.T.vals[s.T.vals.length - 1];
    var p = KP.approx('The largest solution of ' + t(s.T.eq) + ', to the nearest hundredth, is ____.', big.v, 2, { nr: true }, s.T.text + '<br>Solutions ' + t(solsT(s.T.vals)) + '; the largest is ' + t(big.tex + '\\approx ' + big.v.toFixed(2)) + '.', H_TWO, 'largest solution of |A| = |B| (NR)');
    p.bad = [s.T.vals[0].v.toFixed(2)];
    return p;
  }
  /* subdomains: s1|a1 x + b1| + s2|a2 x + b2| = RHS, where RHS is k (a number) or x² (quad) */
  function subdom(s1, a1, b1, s2, a2, b2, rhsQuad, k) {
    var z1 = -b1 / a1, z2 = -b2 / a2, bs = uniqNums([z1, z2]).sort(function (p, q) { return p - q; }), ivs = [];
    ivs.push({ lo: -Infinity, hi: bs[0] }); if (bs.length > 1) ivs.push({ lo: bs[0], hi: bs[1] }); ivs.push({ lo: bs[bs.length - 1], hi: Infinity });
    var sols = [], lines = [], ok2 = true;
    var ivT = function (iv) { return iv.lo === -Infinity ? 'x<' + rt(iv.hi) : iv.hi === Infinity ? 'x\\ge ' + rt(iv.lo) : rt(iv.lo) + '\\le x<' + rt(iv.hi); };
    var inIv = function (x, iv) { return x >= iv.lo - 1e-9 && x < iv.hi - 1e-9; };
    ivs.forEach(function (iv) {
      var mid = iv.lo === -Infinity ? iv.hi - 1 : iv.hi === Infinity ? iv.lo + 1 : (iv.lo + iv.hi) / 2;
      var g1 = a1 * mid + b1 >= 0 ? 1 : -1, g2 = a2 * mid + b2 >= 0 ? 1 : -1;
      var al = s1 * g1 * a1 + s2 * g2 * a2, be = s1 * g1 * b1 + s2 * g2 * b2;
      var lhs = (s1 * g1 < 0 ? '-' : '') + '(' + linT(a1, b1) + ')' + (s2 * g2 < 0 ? '-' : '+') + '(' + linT(a2, b2) + ')', txt = t(ivT(iv)) + ': ' + t(lhs + '=' + (rhsQuad ? 'x^{2}' : k));
      if (!rhsQuad) {
        if (al === 0) { if (be === k) ok2 = false; txt += ', so ' + t(be + '=' + k) + ': false, no solution here.'; }
        else { var x = toR([k - be, al]), xv = rv(x); txt += ', so ' + t((al === 1 ? '' : al === -1 ? '-' : al) + 'x' + (be ? sgT(be) : '') + '=' + k) + ', ' + t('x=' + rt(x)) + (inIv(xv, iv) ? ' ✓ (in the interval)' : ' (not in the interval, reject)') + '.'; if (inIv(xv, iv)) sols.push({ v: xv, tex: rt(x), iv: iv }); else sols.push({ v: xv, tex: rt(x), out: true }); }
      } else {
        var S = solveQ(1, -al, -be); txt += ', so ' + S.text;
        var keep = S.roots.filter(function (x) { return inIv(x.v, iv); }), rej = S.roots.filter(function (x) { return !inIv(x.v, iv); });
        txt += (S.roots.length ? '. ' + (keep.length ? keep.map(function (x) { return t('x=' + x.tex); }).join(', ') + ' in the interval ✓' : '') + (rej.length ? (keep.length ? '; ' : '') + rej.map(function (x) { return t(x.tex); }).join(', ') + ' not in the interval (reject)' : '') : '') + '.';
        keep.forEach(function (x) { sols.push({ v: x.v, tex: x.tex, iv: iv }); }); rej.forEach(function (x) { sols.push({ v: x.v, tex: x.tex, out: true }); });
      }
      lines.push(txt);
    });
    var good = sols.filter(function (x) { return !x.out; }), bad = sols.filter(function (x) { return x.out; });
    return { ok: ok2, vals: good.sort(byVal), out: bad, text: 'Boundaries (where the insides are 0): ' + bs.map(function (b) { return t(rt(b)); }).join(' and ') + '.<br>' + lines.join('<br>') };
  }
  function subPart(prompt, S, text) {
    var w = S.out.length ? [{ vals: S.vals.concat(S.out), code: CP + 'sub-int', hint: 'Keep only the roots that lie in the interval they came from.' }] : [];
    return rootsPart(CP, prompt, S.vals, { wrongs: w.concat([{ vals: [], code: CP + 'nosol-claim', hint: 'Solve on each interval: at least one root lies in its interval.' }]) }, S.text + '<br>Solutions: ' + t(solsT(S.vals)) + '.',
      ['Mark where each expression inside the bars is 0: these split the number line into intervals.', 'On each interval write each absolute value as ' + t('A') + ' or ' + t('-A') + ', solve, and keep only roots in that interval.'], text);
  }
  function s10a(r) { // |x − p| + |x − q| = k
    var s = pickWhere(function () { return { p: r.int(-6, 3), w: r.int(2, 8), e: r.int(1, 4) }; }, function (z) { z.q = z.p + z.w; z.k = z.w + 2 * z.e; return !(z.p === -2 && z.q === 4) && !(z.p === -1 && z.q === 3); });
    var S = subdom(1, 1, -s.p, 1, 1, -s.q, false, s.k);
    return subPart('Solve using subdomains: ' + t(A(linT(1, -s.p)) + '+' + A(linT(1, -s.q)) + '=' + s.k) + '.', S, '|x − p| + |x − q| = k');
  }
  function s10b(r) { // |ax + b| − |x + c| = k
    var s = pickWhere(function () { return { a: r.pick([2, 3]), b: nz(r, 1, 5), c: nz(r, 1, 4), k: r.int(-2, 4) }; }, function (z) { var S = subdom(1, z.a, z.b, -1, 1, z.c, false, z.k); z.S = S; return S.ok && S.vals.length >= 2 && S.out.length >= 1 && S.vals.every(function (x) { return toR(x.v)[1] <= 4; }) && !(z.a === 2 && z.b === -1 && z.c === 1 && z.k === 1); });
    return subPart('Solve using subdomains: ' + t(A(linT(s.a, s.b)) + '-' + A(linT(1, s.c)) + '=' + s.k) + '.', s.S, '|ax + b| − |x + c| = k');
  }
  function c3(r) { // |x + a| + |x − b| = x²
    var s = pickWhere(function () { return { a: r.int(1, 3), b: r.int(1, 4) }; }, function (z) { var S = subdom(1, 1, z.a, 1, 1, -z.b, true); z.S = S; return S.vals.length >= 1 && !(z.a === 1 && z.b === 3); });
    return subPart('Solve using subdomains: ' + t(A(linT(1, s.a)) + '+' + A(linT(1, -s.b)) + '=x^{2}') + '. Give exact answers.', s.S, '|x + a| + |x − b| = x²');
  }

  /* ---------- Extra practice ---------- */
  function epA1a(r) { // |x² − n| = k, four solutions with radicals
    var s = pickWhere(function () { return { u: r.int(3, 6), k: r.int(1, 20) }; }, function (z) { z.n = z.u * z.u - z.k; return z.n > z.k && !isSq(z.n - z.k) && !(z.n === 12 && z.k === 4) && !(z.n === 10); });
    return kPart('Solve algebraically: ' + t(A('x^{2}-' + s.n) + '=' + s.k) + '.', 1, 0, -s.n, s.k);
  }
  function epA1c(r) { // |x² + bx + c| = k with four integer solutions
    var s = fourInt(r, { c0: false, not: ['-1,-6,6', '2,-4,4'] });
    return kPart('Solve algebraically: ' + t(A(polyT(1, s.b, s.c)) + '=' + s.k) + '.', 1, s.b, s.c, s.k);
  }
  function epA1d(r) { var s = { a: r.pick([4, 9, 2, 3]), n: r.int(1, 25), k: -r.int(1, 9) }; if (s.a === 4 && s.n === 9 && s.k === -1) s.k = -2; return kPart('Solve algebraically: ' + t(A(polyT(s.a, 0, -s.n)) + '=' + s.k) + '.', s.a, 0, -s.n, s.k, { hints: ['Look at the right side first.', 'An absolute value cannot equal a negative number.'] }); }
  function epA2(r) { // m|x² + 2hx| + d = e with a perfect square case: three exact solutions
    var s = pickWhere(function () { return { h: nz(r, 1, 4), m: r.pick([2, 3]), d: nz(r, 1, 9) }; }, function (z) { z.k = z.h * z.h; return !(z.h === -2 && z.m === 2 && z.d === -5); });
    var inner = polyT(1, 2 * s.h, 0), e = s.m * s.k + s.d, eq = s.m + A(inner) + sgT(s.d) + '=' + e;
    return kPart('Solve ' + t(eq) + '. Give exact answers.', 1, 2 * s.h, 0, s.k, { pre: 'Isolate: ' + t(s.m + A(inner) + '=' + (e - s.d)) + ', so ' + t(A(inner) + '=' + s.k) + '.<br>' });
  }
  function epB1a(r) { // |x² + bx + c| = x − p where x − p is a factor: all valid
    var s = pickWhere(function () { return { p: r.int(-4, 4), q: r.int(-5, 6) }; }, function (z) { z.c1 = qroots(1, -(z.p + z.q + 1), z.p * z.q + z.p); z.c2 = qroots(1, -(z.p + z.q - 1), z.p * z.q - z.p); var all = z.c1.roots.concat(z.c2.roots); z.all = all; return z.p !== z.q && z.q - z.p >= 2 && all.every(function (x) { return x.rational && true || Number.isInteger(x.v); }) && all.every(function (x) { return Number.isInteger(x.v); }) && !(z.p === -1 && z.q === 4); });
    var inner = polyT(1, -(s.p + s.q), s.p * s.q), rhs = linT(1, -s.p), R = function (x) { return x - s.p; }, L = function (x) { return Math.abs((x - s.p) * (x - s.q)); };
    var all = uniqNums(s.all.map(function (x) { return x.v; })).sort(function (a, b) { return a - b; }), vals = all.filter(function (x) { return R(x) >= -1e-9; }), extr = all.filter(function (x) { return R(x) < -1e-9; });
    var c1 = solveQ(1, -(s.p + s.q + 1), s.p * s.q + s.p), c2 = solveQ(1, -(s.p + s.q - 1), s.p * s.q - s.p);
    return extrPart('Solve and check: ' + t(A(inner) + '=' + rhs) + '.', vals, extr, 'Case 1: ' + t(inner + '=' + rhs) + ', so ' + c1.text + '.<br>Case 2: ' + t(inner + '=-(' + rhs + ')') + ', so ' + c2.text + '.<br>' + all.map(function (x) { return chkLine(L, R, x); }).join('<br>') + '<br>Solutions: ' + t(solsT(vals)) + '.', null, '|quadratic| = linear');
  }
  function epB1b(r) { // |x + a| = x² − n with extraneous root
    var s = pickWhere(function () { return { a: nz(r, 1, 5), u: r.int(2, 5) }; }, function (z) { z.n = z.u * z.u; var c1 = qroots(1, -1, -z.n - z.a), c2 = qroots(1, 1, a2(z)); function a2(q) { return q.a - q.n; } z.c1 = c1; z.c2 = c2; var all = c1.roots.concat(c2.roots); return all.length >= 3 && all.every(function (x) { return Number.isInteger(x.v); }) && all.some(function (x) { return x.v * x.v - z.n < 0; }) && !(z.a === 3 && z.u === 3); });
    var inner = linT(1, s.a), rhs = 'x^{2}-' + s.n, R = function (x) { return x * x - s.n; }, L = function (x) { return Math.abs(x + s.a); };
    var all = uniqNums(s.c1.roots.concat(s.c2.roots).map(function (x) { return x.v; })).sort(function (a, b) { return a - b; }), vals = all.filter(function (x) { return R(x) >= -1e-9; }), extr = all.filter(function (x) { return R(x) < -1e-9; });
    var c1 = solveQ(1, -1, -s.n - s.a), c2 = solveQ(1, 1, s.a - s.n);
    return extrPart('Solve and check: ' + t(A(inner) + '=' + rhs) + '.', vals, extr, 'Case 1: ' + t(inner + '=' + rhs) + ', so ' + c1.text + '.<br>Case 2: ' + t('-(' + inner + ')=' + rhs) + ', so ' + c2.text + '.<br>' + all.map(function (x) { return chkLine(L, R, x); }).join('<br>') + '<br>Solutions: ' + t(solsT(vals)) + '.', null, '|x + a| = x² − n');
  }
  function epB2(r) { // |x² − n²| = m(x + n): a double root, everything checks
    var s = pickWhere(function () { return { n: r.int(1, 4), m: r.pick([1, 2, 3]) }; }, function (z) { return !(z.n === 1 && z.m === 2) && z.m !== 2 * z.n; });
    var inner = 'x^{2}-' + s.n * s.n, rhs = (s.m === 1 ? '' : s.m) + 'x+' + s.m * s.n, R = function (x) { return s.m * (x + s.n); }, L = function (x) { return Math.abs(x * x - s.n * s.n); };
    var c1 = solveQ(1, -s.m, -s.n * s.n - s.m * s.n), c2 = solveQ(1, s.m, s.m * s.n - s.n * s.n), all = uniqNums(c1.roots.concat(c2.roots).map(function (x) { return x.v; })).sort(function (a, b) { return a - b; });
    var vals = all.filter(function (x) { return R(x) >= -1e-9; }), extr = all.filter(function (x) { return R(x) < -1e-9; });
    return extrPart('Solve ' + t(A(inner) + '=' + rhs) + ' and check.', vals, extr, 'Case 1: ' + t(inner + '=' + rhs) + ', so ' + c1.text + '.<br>Case 2: ' + t(inner + '=-(' + rhs + ')') + ', so ' + c2.text + '.<br>' + all.map(function (x) { return chkLine(L, R, x); }).join('<br>') + '<br>Solutions: ' + t(solsT(vals)) + '.', null, '|x² − n²| = m(x + n)');
  }
  function epB4Shared(r) {
    return pickWhere(function () { return { a: r.pick([2, 2, 3]), h: r.int(5, 8), T: r.pick([20, 30, 40, 50]), d: r.pick([5, 10, 15, 20]) }; }, function (z) {
      // P = −a(x − h)² + top; |P − T| = d; one case factors, the other has radicals
      z.top = z.T + z.d + z.a * r.pick([1, 4]);
      var m1 = (z.top - z.T - z.d) / z.a, m2 = (z.top - z.T + z.d) / z.a;
      if (!Number.isInteger(m1 * 1) || m1 <= 0 || m2 <= 0) return false;
      if (!(isSq(m1) && !isSq(Math.round(m2 * 1e6) / 1e6)) || !Number.isInteger(m2)) return false;
      z.m1 = m1; z.m2 = m2; return z.h + Math.sqrt(m2) <= 2 * z.h && z.h - Math.sqrt(m2) >= 0 && !(z.a === 2 && z.h === 6 && z.T === 20 && z.d === 10) && (z.T - z.d) > 0;
    });
  }
  function epB4Info(s) { var b = 2 * s.a * s.h, c = s.top - s.a * s.h * s.h; return { b: b, c: c, P: polyT(-s.a, b, c), inner: polyT(-s.a, b, c - s.T), up: solveQ(1, -2 * s.h, s.h * s.h - s.m1), dn: solveQ(1, -2 * s.h, s.h * s.h - s.m2) }; }
  function epB4stem(s) { var I = epB4Info(s); return 'A company’s monthly profit is ' + t('P=' + I.P) + ' thousand dollars when it makes ' + t('x') + ' hundred units, ' + t('0\\le x\\le ' + 2 * s.h) + '. Its target profit is ' + t('\\$' + s.T) + ' thousand.'; }
  function epB4a(r, s) {
    var I = epB4Info(s), all = I.up.roots.concat(I.dn.roots).sort(byVal);
    return rootsPart(CP, 'For which production levels ' + t('x') + ' is the profit exactly ' + t('\\$' + s.d) + ' thousand away from the target? Give exact answers.', all, { wrongs: [{ vals: I.up.roots, code: CP + 'one-case', hint: 'The profit can also be ' + t('\\$' + s.d) + ' thousand <b>below</b> the target.' }, { vals: I.dn.roots, code: CP + 'one-case', hint: 'The profit can also be ' + t('\\$' + s.d) + ' thousand <b>above</b> the target.' }] },
      t(A('P-' + s.T) + '=' + s.d) + ', so ' + t(A(I.inner) + '=' + s.d) + '.<br>Case 1 (profit ' + t('\\$' + (s.T + s.d)) + ' thousand): divide by ' + t(-s.a) + ': ' + I.up.text + '.<br>Case 2 (profit ' + t('\\$' + (s.T - s.d)) + ' thousand): divide by ' + t(-s.a) + ': ' + I.dn.text + '.<br>' + t(solsT(all)) + '.',
      ['The distance between ' + t('P') + ' and the target ' + t(s.T) + ' is ' + t('|P-' + s.T + '|') + '.', 'Divide each case by ' + t(-s.a) + ' to make the leading coefficient 1.'], 'an absolute value problem: profit');
  }
  function epB4b(r, s) {
    var I = epB4Info(s), all = I.up.roots.concat(I.dn.roots).sort(byVal), units = all.map(function (x) { return Math.round(x.v * 100); });
    var check = function (resp) {
      var L = readVals(resp, 'x'); if (L.empty) return form('empty', 'Type your answer first.'); if (L.bad || L.unsimp || L.letter) return form('unreadable', 'Write the numbers of units separated by commas, e.g. 268, 500.');
      var Aa = uniqNums(L.vals);
      if (matchVals(Aa, units, 0.5)) return ok();
      if (matchVals(Aa, all.map(function (x) { return x.v; }), 0.006)) return wrong(CP + 'units', 'Those are in hundreds of units: multiply by 100.');
      if (Aa.length < 4) return wrong(CP + 'sol-missing', 'There are four production levels.');
      return wrong('value', null);
    };
    var p = KP.math('State the four production levels to the nearest unit.', check, units.join(',\\ '), all.map(function (x) { return t(x.tex + '\\approx ' + x.v.toFixed(2)) + ' hundred'; }).join(', ') + ': about ' + units.join(', ') + ' units.', ['' + t('x') + ' is in hundreds of units: multiply by 100 and round.'], 'production levels in units', { keys: 'u7sol', vars: ['x'], placeholder: 'e.g. 268, 500, 700, 932' });
    p.bad = [all.map(function (x) { return x.v.toFixed(2); }).join(',\\ ')];
    return p;
  }
  function epB6(r) { // NR the sum of all solutions
    var s = pickWhere(function () { return { b: -r.int(3, 9), c: r.int(2, 14), k: r.int(1, 14) }; }, function (z) { var D1 = z.b * z.b - 4 * (z.c - z.k), D2 = z.b * z.b - 4 * (z.c + z.k); return D1 > 0 && D2 > 0 && isSq(D1) && isSq(D2) && !(z.b === -7 && z.c === 6 && z.k === 6); });
    var S = absK(1, s.b, s.c, s.k), sum = S.vals.reduce(function (a, x) { return a + x.v; }, 0);
    var p = KP.nr('The sum of all the solutions of ' + t(A(polyT(1, s.b, s.c)) + '=' + s.k) + ' is ____.', Math.round(sum), function (v) { if (Math.abs(v - (-s.b)) < 1e-9 && S.vals.length === 4) return { code: CP + 'sum', hint: 'That is the sum for one case only: add the roots of both cases.' }; return null; }, S.text + '<br>Sum ' + t('=' + S.vals.map(function (x) { return paren(x.v); }).join('+') + '=' + Math.round(sum)) + '.', H_CASES, 'sum of the solutions (NR)');
    p.bad = [String(-s.b)];
    return p;
  }
  /* C1: values of k for |x² − n| = k with four / three / two solutions */
  function c1Shared(r) { return pickWhere(function () { return { n: r.int(2, 16) }; }, function (z) { return z.n !== 4; }); }
  function c1stem(s) { return 'Consider ' + t(A('x^{2}-' + s.n) + '=k') + '. The graph of ' + t('y=' + A('x^{2}-' + s.n)) + ' is a W with zeros ' + t('\\pm\\sqrt{' + s.n + '}') + ' (' + t('\\approx \\pm ' + Math.sqrt(s.n).toFixed(2)) + ') and the top of its reflected hump at ' + t(pt(0, s.n)) + '.'; }
  function c1Fig(s) { var w = Math.sqrt(s.n), xr = [-Math.ceil(Math.sqrt(2 * s.n)) - 1, Math.ceil(Math.sqrt(2 * s.n)) + 1]; return G({ x: xr, y: [-1, s.n + 3], labels: s.n > 10 ? 2 : 1, max: 240, fns: [crv(function (x) { return Math.abs(x * x - s.n); }, { from: -Math.sqrt(2 * s.n + 2), to: Math.sqrt(2 * s.n + 2) })], hline: [s.n], aria: 'the W-shaped graph of y = |x² − ' + s.n + '|' }); }
  function c1a(r, s) {
    var tgt = '\\{k\\mid 0<k<' + s.n + ',\\ k\\in\\mathbb{R}\\}';
    var p = KP.set('For which values of ' + t('k') + ' are there exactly <b>four</b> solutions?', tgt, { v: 'k', tag: false, wrong: [{ is: '\\{k\\mid 0\\le k<' + s.n + '\\}', code: CP + 'k-end', hint: 'At ' + t('k=0') + ' there are only two solutions (the zeros).' }, { is: '\\{k\\mid 0<k\\le ' + s.n + '\\}', code: CP + 'k-end', hint: 'At ' + t('k=' + s.n) + ' the line touches the top of the hump: three solutions.' }, { is: '\\{k\\mid k>' + s.n + '\\}', code: CP + 'k-dir', hint: 'Above the hump the line meets only the outer arms.' }] },
      'The line ' + t('y=k') + ' crosses both outer arms and the hump twice when it is between the ' + t('x') + '-axis and the top of the hump.' + c1Fig(s) + t('0<k<' + s.n) + '.', ['Sketch the W and slide a horizontal line ' + t('y=k') + ' up from ' + t('y=0') + '.', 'Four crossings while the line is below the top of the hump, ' + t('y=' + s.n) + '.'], 'values of k for four solutions');
    p.bad = ['\\{k\\mid 0\\le k<' + s.n + '\\}', '\\{k\\mid k>' + s.n + '\\}'];
    p.input.keys = 'u7k56set';
    return p;
  }
  function c1b(r, s) {
    var T = absK(1, 0, -s.n, s.n), rt2 = qroots(1, 0, -2 * s.n);
    var fields = [{ label: t('k='), name: 'k', mode: 'math', keys: 'u7sol', vars: ['x'] }, { label: 'Solutions', name: 'solutions', mode: 'math', keys: 'u7sol', vars: ['x'], placeholder: 'e.g. x = 0, x = ±√2' }];
    var kC = valCheck(CP, s.n, [{ v: -s.n, code: CP + 'k-q', hint: 'The hump’s top is at ' + t('y=' + s.n) + '.' }, { v: 0, code: CP + 'k-zero', hint: 'At ' + t('k=0') + ' there are only the two zeros.' }]).check;
    var keys = [String(s.n), solsT(T.vals)];
    return fieldsPart('For which value of ' + t('k') + ' are there exactly <b>three</b> solutions? Give that value and the three solutions (exact).', fields, [kC, rootsCheck(CP, T.vals, { wrongs: kWrongs(T, 'x^{2}-' + s.n, s.n) })], keys, t('k=' + s.n) + ': ' + t(keys[1]),
      'The line ' + t('y=' + s.n) + ' touches the top of the hump: ' + t('k=' + s.n) + '.<br>' + T.text + '<br>' + t(solsT(T.vals)) + '.', ['Three solutions: the line touches the top of the reflected hump.'], 'k for three solutions and the solutions', [[String(-s.n), keys[1]]]);
  }
  function c1c(r, s) {
    var tgt = '\\{k\\mid k=0\\text{ or }k>' + s.n + ',\\ k\\in\\mathbb{R}\\}';
    var p = KP.set('For which values of ' + t('k') + ' are there exactly <b>two</b> solutions?', tgt, { v: 'k', tag: false, wrong: [{ is: '\\{k\\mid k>' + s.n + '\\}', code: CP + 'k-end', hint: 'There is one more value: at ' + t('k=0') + ' the solutions are the two zeros.' }, { is: '\\{k\\mid k\\ge ' + s.n + '\\}', code: CP + 'k-end', hint: 'At ' + t('k=' + s.n) + ' there are three solutions; and do not forget ' + t('k=0') + '.' }, { is: '\\{k\\mid k=0\\text{ or }k\\ge ' + s.n + '\\}', code: CP + 'k-end', hint: 'At ' + t('k=' + s.n) + ' the line touches the hump: three solutions.' }] },
      'Two solutions when the line meets only the outer arms (' + t('k>' + s.n) + ') or is the ' + t('x') + '-axis (' + t('k=0') + ': the zeros).' + c1Fig(s) + t('k=0') + ' or ' + t('k>' + s.n) + '.', ['Slide the line ' + t('y=k') + ' up from below the ' + t('x') + '-axis and count the crossings each time.', 'Write the answer as ' + t('k=0') + ' or an inequality.'], 'values of k for two solutions');
    p.bad = ['\\{k\\mid k>' + s.n + '\\}', '\\{k\\mid k\\ge ' + s.n + '\\}'];
    p.input.keys = 'u7k56set';
    return p;
  }

  function Pt(id, level, make, o) { return Object.assign({ id: id, level: level, make: make }, o || {}); }
  var EXT = { outcome: 'EXT' };
  var QUESTIONS = [
    { num: '1', stem: 'Solve algebraically.', parts: [Pt('1a', 'BEG', q1a), Pt('1b', 'BEG', q1b), Pt('1c', 'EMG', q1c), Pt('1d', 'BEG', q1d), Pt('1e', 'BEG', q1e), Pt('1f', 'LIM', q1f)] },
    { num: '2', stem: 'Isolate the absolute value, then solve.', parts: [Pt('2a', 'EMG', q2a), Pt('2b', 'EMG', q2b), Pt('2c', 'PRG', q2c)] },
    { num: '3', stem: 'Solve. Give exact answers, then answers to the nearest hundredth.', parts: [Pt('3a', 'PRG', q3a), Pt('3b', 'ADV', q3b), Pt('3c', 'PRG', q3c)] },
    { num: '4', shared: q4Shared, stem: q4stem, parts: [Pt('4a', 'EMG', q4a), Pt('4b', 'PRG', q4b)] },
    { num: '5', shared: q5Shared, stem: q5stem, parts: ['neg', 'zero', 'between', 'top', 'above'].map(function (kind, i) { return Pt('5' + 'abcde'.charAt(i), ['BEG', 'BEG', 'EMG', 'PRG', 'EMG'][i], function (r, s) { return countPart(r, s, kind); }); }) },
    { num: '6', shared: q6Shared, stem: q6stem, parts: [Pt('6a', 'ADV', q6a), Pt('6b', 'MAS', q6b)] },
    { num: '7', stem: 'Solve and check. Reject any extraneous solutions.', parts: [Pt('7a', 'PRG', q7a), Pt('7b', 'MAS', q7b), Pt('7c', 'ADV', q7c), Pt('7d', 'PRG', q7d)] },
    { num: '8', shared: q8Shared, stem: q8stem, parts: [Pt('8a', 'PRG', q8a), Pt('8b', 'ADV', q8b)] },
    { num: '11', shared: function (r) { return calcShared(r, true); }, stem: function (s) { return 'Consider ' + t(A(calcInner(s, true)) + '=' + s.k) + '.'; }, parts: [Pt('11a', 'PRG', function (r, s) { return calcA(r, s, true); }), Pt('11b', 'ADV', function (r, s) { return calcB(r, s, true); })] },
    { num: '12', shared: q12Shared, stem: q12stem, parts: [Pt('12a', 'ADV', q12a), Pt('12b', 'MAS', q12b), Pt('12c', 'PRG', q12c)] },
    { num: '13', parts: [Pt('13', 'PRG', mcCount)] },
    { num: '14', parts: [Pt('14', 'PRG', q14)] },
    { num: '15', parts: [Pt('15', 'EMG', q15)] },
    { num: '16', parts: [Pt('16', 'PRG', q16)] }
  ];
  var EXTRA = [
    { num: 'A1', section: 'A. Skills', stem: 'Solve algebraically.', parts: [Pt('A1a', 'BEG', epA1a), Pt('A1b', 'BEG', q1b), Pt('A1c', 'EMG', epA1c), Pt('A1d', 'LIM', epA1d)] },
    { num: 'A2', parts: [Pt('A2', 'PRG', epA2)] },
    { num: 'A3', parts: [Pt('A3', 'ADV', s9a, EXT)] },
    { num: 'B1', section: 'B. Applying', stem: 'Solve and check.', parts: [Pt('B1a', 'ADV', epB1a), Pt('B1b', 'ADV', epB1b)] },
    { num: 'B2', parts: [Pt('B2', 'PRG', epB2)] },
    { num: 'B3', shared: function (r) { return calcShared(r, false); }, stem: function (s) { return 'Consider ' + t(A(calcInner(s, false)) + '=' + s.k) + '.'; }, parts: [Pt('B3a', 'PRG', function (r, s) { return calcA(r, s, false); }), Pt('B3b', 'ADV', function (r, s) { return calcB(r, s, false, true); })] },
    { num: 'B4', shared: epB4Shared, stem: epB4stem, parts: [Pt('B4a', 'ADV', epB4a), Pt('B4b', 'ADV', epB4b)] },
    { num: 'B5', parts: [Pt('B5', 'PRG', mcCount)] },
    { num: 'B6', parts: [Pt('B6', 'PRG', epB6)] },
    { num: 'C1', section: 'C. Stretch', shared: c1Shared, stem: c1stem, parts: [Pt('C1a', 'MAS', c1a), Pt('C1b', 'ADV', c1b), Pt('C1c', 'MAS', c1c)] },
    { num: 'C2', parts: [Pt('C2', 'MAS', function (r) { return s9b(r, true); }, EXT)] },
    { num: 'C3', parts: [Pt('C3', 'MAS', c3, EXT)] },
    // assignment #9, #10, #17: equations with two absolute values (beyond the course) — optional
    { num: '9', section: 'Stretch · Assignment 9, 10, 17: two absolute values (beyond the course, optional)', stem: 'Solve.', parts: [Pt('9a', 'ADV', s9a, EXT), Pt('9b', 'ADV', function (r) { return s9b(r, false); }, EXT), Pt('9c', 'MAS', s9c, EXT)] },
    { num: '10', stem: 'Solve using subdomains.', parts: [Pt('10a', 'MAS', s10a, EXT), Pt('10b', 'MAS', s10b, EXT)] },
    { num: '17', parts: [Pt('17', 'MAS', s17, EXT)] }
  ];

  HW.defineLesson({ id: LID, unit: 7, num: '5', title: 'Solving Absolute Value Equations (Quadratic)', outcome: OUT, calc: true, questions: QUESTIONS, extra: EXTRA });
})(window);
