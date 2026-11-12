/* Math 20-1 · Unit 7 · Lesson 3 — Graphing Absolute Value Functions of Quadratic Functions (outcome RF2 on every part)
 * Assignment 3 (m201book unit7/u7_l03.tex, Questions 1–17) and the Lesson 3 Extra Practice (u7_ep03.tex, A1–A4, B5–B9,
 * C10–C12). Every part is a generator: the booklet question's idea, form and difficulty with new numbers (the lesson's
 * example numbers and the booklet question's own numbers are left out). Calculator allowed; answers stay exact.
 * Conversions: "sketch the graph of y = |f(x)|" -> multiple choice between graphs (the right one, f itself, −|f| and
 * −f or a mirror image), or the features a sketch shows (invariant points, the vertex of the graph, the y-intercept,
 * the range) in labelled boxes; "complete the table" -> number boxes; "explain why" and "describe one more graph" ->
 * multiple choice; true/false stays true/false (the correction is in the worked solution); numerical response -> a
 * number box. Piecewise forms: the two zeros and the expression on each side (or one expression when one piece does).
 * Recognised mistakes: invariant points with the wrong signs, the y-intercept or the vertex given as an invariant point,
 * "none" when the parabola crosses, the vertex not reflected (or reflected when it is above the axis), a negative
 * y-intercept, the range of f, y ≥ 0 for a parabola that never reaches the axis, the range from the vertex for one that
 * crosses, piecewise pieces swapped / only the x² term negated / zeros with the wrong sign, the other possible f,
 * a wrong stretch factor, hundreds of dollars left as hundreds, the hump of the W miscounted.
 * Levels: LIM BEG EMG PRG ADV MAS. Mastery: Q9(c), Q11(d), Q17, Extra C10, C11, C12.
 *
 * ============================================================================================================
 * HW.u7k34 — a small kit for Lessons 3 and 4 (defined here; js/lessons/u7l4.js reuses it, so this file loads first)
 * ============================================================================================================
 *   Codes: registered for 'u7l3-' and 'u7l4-' (inv-*, vtx-*, rng-*, pw-*, back-*, cnt-*, one-case, extr, …).
 *   Tools: U.toR, U.rv, U.rt (exact tex), U.nt (decimal for halves/quarters, else a fraction), U.sgT, U.A (|…| tex),
 *          U.lin, U.quad, U.tx (poly tex), U.pt, U.pickWhere, U.nz, U.has, U.uniqNums, U.sameSet, U.isSq, U.qroots,
 *          U.excl(o, list) (o differs from each listed object on some key), U.G / U.mini (HW.graph), U.crv.
 *   Readers / checkers: U.readVals, U.rootsChk(cp, vals, o) / U.rootsPart(cp, prompt, vals, o, sol, hints, text)
 *          (solutions with "no solution", extraneous roots, ± and rounding), U.ptsChk / U.ptsPart (sets of points or
 *          none), U.valPart, U.fieldsPart, U.setT(cond, v), U.numVal.
 *   Quadratics: U.QV(a, p, q) -> { av, a, p, q, f, poly, zeros, kind: cross | touch | above | below, … };
 *          U.QR(a, r, s) (from the zeros). U.featPart, U.piecePart, U.graphMC (Lesson 3 builders).
 *   Keypads: 'u7sol', 'u7pts' (registered by js/lessons/u7test.js), 'set', 'poly', 'fraction'.
 */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, KP = K.P, P = HW.poly, ex = HW.ex, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
  if (!K.set || !K.point || !HW.graph || !K.poly) throw new Error('js/lessons/u7l3.js needs js/relfn.js, js/lines.js and js/poly.js');
  var LID = 'u7l3', CP = 'u7l3-', OUT = 'RF2';

  /* ======================================================================================================
   * Codes (s = small: keeps 2/3, b = big: keeps 1/3, n = none; '' = a format nudge)
   * ====================================================================================================== */
  var BASE = {
    'inv-sign': ['Invariant points with the wrong signs', 's'], 'inv-yint': ['Gave the y-intercept as an invariant point', 'b'], 'inv-vertex': ['Gave the vertex as an invariant point', 'n'],
    'inv-none': ['Said there are no invariant points', 'n'], 'inv-extra': ['Listed invariant points where the graph does not meet the x-axis', 'n'], 'inv-miss': ['Missed an invariant point', 'b'],
    'vtx-noreflect': ['Used the vertex of f without reflecting it', 'b'], 'vtx-reflect': ['Reflected a vertex that is above the x-axis', 'b'], 'vtx-x': ['Vertex: wrong x-coordinate', 'b'],
    'yint-neg': ['y-intercept of |f| left negative', 'b'], 'yint-x': ['Gave an x-intercept as the y-intercept', 'n'],
    'rng-f': ['Gave the range of f instead of |f|', 'n'], 'rng-zero': ['Range y ≥ 0 for a graph that never reaches the x-axis', 'b'], 'rng-q': ['Range from the vertex for a graph that crosses the x-axis', 'b'],
    'rng-end': ['Range on an interval: wrong greatest value', 'b'], 'dom': ['Domain changed by the absolute value', 'b'],
    'pw-swap': ['Piecewise: the two pieces on the wrong sides', 'b'], 'pw-bsign': ['Piecewise: zeros with the wrong signs', 's'], 'pw-neg': ['Piecewise: took the opposite of only one term', 's'],
    'pw-bound': ['Piecewise: zeros in the wrong boxes', 's'], 'pw-one': ['One piece: kept f where f(x) < 0 (or used −f where f(x) > 0)', 'b'],
    'tab-abs': ['Table: kept a negative value of |g(x)|', 'b'], 'tab-sub': ['Table: substitution slip (−x² for (−x)²)', 's'],
    'pt-neg': ['Point on |f|: kept the negative y-value', 'n'], 'pt-xchg': ['Point on |f|: changed the x-coordinate', 'n'], 'pt-swap': ['Point: swapped the coordinates', 'n'],
    'back-other': ['Working backwards: gave the reflection (the other possible f)', 's'], 'back-a': ['Working backwards: wrong stretch factor a', 'b'], 'back-sign': ['Working backwards: the value with the wrong sign', 'b'],
    'back-one': ['Working backwards: gave only one of the two possible functions', 'b'],
    'cnt-hump': ['Number of intersections: the line touches the top of the hump (3)', 'b'], 'cnt-two': ['Number of intersections: missed the reflected hump (4)', 'b'], 'cnt-four': ['Number of intersections: counted the hump when the line is above it', 'b'],
    'cnt-zero': ['Number of intersections when k = 0', 'b'], 'cnt-neg': ['Number of intersections when k < 0', 'n'],
    'unit-hund': ['Left the answer in hundreds of dollars', 's'], 'loss-end': ['Greatest loss from the wrong end of the domain', 'b'], 'arc-top': ['Used the top of the arc for the greatest value on the interval', 'b'],
    'ball-one': ['Times: only above (or only below) the cliff top', 'b'], 'ball-out': ['Times: kept a time outside the domain', 's'],
    // Lesson 4
    'one-case': ['Solved only one case (A = c or A = −c)', 'b'], 'no-iso': ['Split into cases before isolating the absolute value', 'n'], 'neg-abs': ['Solved |A| = a negative number', 'n'],
    'extr': ['Kept an extraneous root', 'b'], 'rej-valid': ['Rejected a root that checks', 's'], 'nosol-claim': ['Said “no solution” when there is one', 'n'], 'sol-missing': ['Missed a solution', 'b'],
    'neg-one': ['Second case: changed the sign of only one term', 'b'], 'case-sub': ['Kept a case answer that is not in its subdomain', 'b'], 'case-zero': ['Cases: wrong value where the inside is 0', 's'],
    'ext-list': ['Extraneous roots: listed a valid root (or missed an extraneous one)', 's'], 'wd-d': ['Equation from solutions: used the whole distance, not half', 'b'], 'wd-a': ['Equation from solutions: wrong centre', 'b'],
    'k-dir': ['Values of k: inequality the wrong way', 'n'], 'k-end': ['Values of k: included (or left out) the boundary', 's'], 'k-swap': ['Values of the parameter: cases mixed up', 'b'],
    'clock': ['Clock times: converted minutes after midnight wrongly', 's'], 'fr-half': ['Fraction coefficient: multiplied instead of dividing', 'b'], 'dist-ratio': ['Distance condition the wrong way round', 'b'],
    // format nudges
    'exact': ['Rounded instead of exact (format)', ''], 'pts-fmt': ['Points not written as (x, y) (format)', '']
  };
  (function () {
    var codes = {}, part = {};
    Object.keys(BASE).forEach(function (k) { ['u7l3-', 'u7l4-'].forEach(function (cp) { codes[cp + k] = BASE[k][0]; if (BASE[k][1]) part[cp + k] = BASE[k][1]; }); });
    HW.addCodes(codes); HW.addPartial(part);
  })();

  /* ======================================================================================================
   * Small tools
   * ====================================================================================================== */
  var U = HW.u7k34 = {};
  function gcd(a, b) { return ex.gcd(Math.abs(a), Math.abs(b)); }
  function pickWhere(gen, test) { for (var i = 0; i < 8000; i++) { var o = gen(); if (o && test(o)) return o; } throw new Error('u7k34: no instance found'); }
  function nz(r, lo, hi) { return (r.chance(0.5) ? -1 : 1) * r.int(lo, hi); }
  function toR(x) { if (Array.isArray(x)) return ex.norm(x[0], x[1]); for (var q = 1; q <= 2000; q++) { var p = x * q; if (Math.abs(p - Math.round(p)) < 1e-9) return ex.norm(Math.round(p), q); } return null; }
  function rv(x) { return Array.isArray(x) ? x[0] / x[1] : x; }
  function rt(x) { var f = toR(x); return f ? ex.texRat(f) : String(+rv(x).toFixed(6)); }
  function nt(x) { var f = toR(x); if (!f) return String(+rv(x).toFixed(6)); return [1, 2, 4, 5, 8, 10, 20].indexOf(Math.abs(f[1])) >= 0 ? String(+(f[0] / f[1]).toFixed(6)) : ex.texRat(f); }
  function sgT(x) { return (rv(x) < 0 ? '-' : '+') + nt(Math.abs(rv(x))); }
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
  function txAsc(p) { return P.tex(p, { order: 'asc' }); }
  function pt(x, y) { return '(' + nt(x) + ',\\ ' + nt(y) + ')'; }
  function ptsT(list) { return list.length ? list.map(function (p) { return p[2] || pt(p[0], p[1]); }).join(',\\ ') : '\\text{none}'; }
  function excl(o, list) { return list.every(function (e) { return Object.keys(e).some(function (k) { return Math.abs(rv(o[k]) - rv(e[k])) > 1e-9; }); }); }
  function setT(cond, v) { v = v || 'y'; return '\\{' + v + '\\mid ' + cond + ',\\ ' + v + '\\in\\mathbb{R}\\}'; }
  function vtxT(a, p, q) { var s = coefT(a) + (rv(p) === 0 ? 'x^{2}' : '(x' + sgT(-rv(p)) + ')^{2}'); return s + (rv(q) === 0 ? '' : sgT(q)); }
  function facT(a, r, s) { function f(z) { return z === 0 ? 'x' : '(x' + sgT(-z) + ')'; } return coefT(a) + f(r) + (r === s ? '^{2}' : f(s)); }
  /* roots of A x² + B x + C = 0 (integers) as [{ v, tex }] — exact, radicals in simplest form */
  function qroots(Aq, Bq, Cq) {
    var D = Bq * Bq - 4 * Aq * Cq;
    if (D < 0) return [];
    if (isSq(D)) { var s = Math.round(Math.sqrt(D)); return uniqNums([(-Bq - s) / (2 * Aq), (-Bq + s) / (2 * Aq)]).sort(function (a, b) { return a - b; }).map(function (v) { return { v: v, tex: rt(v) }; }); }
    var k = 1, m = D; for (var f = 2; f * f <= m; f++) while (m % (f * f) === 0) { m /= f * f; k *= f; }
    var den = 2 * Aq, g = gcd(gcd(Bq, k), den); if (den < 0) g = -g;
    var c0 = -Bq / g, c1 = k / g, d = den / g, rad = (c1 === 1 ? '' : c1) + '\\sqrt{' + m + '}';
    function one(sgn) { var top = (c0 === 0 ? (sgn < 0 ? '-' : '') : c0 + (sgn < 0 ? '-' : '+')) + rad; return { v: (c0 + sgn * c1 * Math.sqrt(m)) / d, tex: d === 1 ? top : '\\frac{' + top + '}{' + d + '}' }; }
    return [one(-1), one(1)].sort(function (a, b) { return a.v - b.v; });
  }
  function G(o) { return HW.graph(Object.assign({ x: [-6, 6], y: [-6, 6], labels: 2, max: 300, aria: 'graph' }, o)); }
  function mini(o) { return HW.graph(Object.assign({ x: [-6, 6], y: [-6, 6], labels: 2, max: 170, aria: 'graph' }, o)); }
  function crv(f, o) { return Object.assign({ f: f, start: 'arrow', end: 'arrow' }, o || {}); }

  /* ======================================================================================================
   * Answer readers and checkers
   * ====================================================================================================== */
  function plainLow(s) { return String(s == null ? '' : s).replace(/\\text\{([^}]*)\}|\\mathrm\{([^}]*)\}/g, function (m, a, b) { return a || b || ''; }).replace(/\\left|\\right|\\[,;:! ]|~/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase(); }
  function isNone(s) { var l = plainLow(s); return /^(no( real)? (solutions?|roots?)|no solution|none|no invariant points?|∅|\\emptyset|\\varnothing|\{ ?\}|\\\{ ?\\\})$/.test(l); }
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
  function valOf(x) { return x && x.tex ? x.v : rv(x); }
  function closeTo(a, b, round) { return Math.abs(a - b) < 1e-9 * Math.max(1, Math.abs(b)) || (round && Math.abs(a - b) <= 0.0051); }
  function matchVals(Aa, T, round) { return Aa.length === T.length && T.every(function (b) { return Aa.some(function (a) { return closeTo(a, b, round); }); }); }
  function rootsT(vals, v) { return vals.length ? vals.map(function (x) { return (v || 'x') + '=' + (x && x.tex ? x.tex : rt(x)); }).join(',\\ ') : '\\text{no solution}'; }
  /* solutions of an equation. vals: the solutions (numbers, [p,q] or { v, tex }); o.extr: extraneous roots; o.wrongs:
     [{ vals, code, hint }] ([] = "no solution"); o.round: decimals to the hundredth accepted too; o.v the variable;
     o.plain: a bare list of values (no "x =") is the expected form */
  function rootsChk(cp, vals, o) {
    o = o || {};
    var v = o.v || 'x', T = uniqNums(vals.map(valOf)), extr = uniqNums((o.extr || []).map(valOf)).filter(function (e) { return !has(T, e); }), round = !!o.round;
    var wrongs = (o.wrongs || []).map(function (w) { return { vals: uniqNums(w.vals.map(valOf)), none: !w.vals.length, code: w.code, hint: w.hint }; }).filter(function (w) { return !(w.none ? !T.length : sameSet(w.vals, T)); });
    var extrHint = o.extrHint || 'Check every answer in the <b>original</b> equation: ' + (extr.length ? t(v + '=' + nt(extr[0])) + ' makes the side without bars negative, so it is extraneous' : 'one of yours does not check') + '.';
    return function (resp) {
      if (isNone(resp)) { if (!T.length) return ok(); var wn = wrongs.filter(function (w) { return w.none; })[0]; return wrong(wn ? wn.code : cp + 'nosol-claim', wn ? wn.hint : o.noneHint || 'There is a solution: solve both cases, then check each answer in the original equation.'); }
      var L = readVals(resp, v);
      if (L.empty) return form('empty', 'Type your answer first.');
      if (L.letter) return form('sol-letter', 'Use the variable ' + t(v) + ' here (you wrote ' + t(L.letter + '=') + ').');
      if (L.unsimp) return form('simplify', 'Simplify each value to a single number (no ' + t('\\times') + ', + or − between numbers).');
      if (L.bad) return form('unreadable', 'Write the values separated by commas, e.g. ' + t(v + '=3,\\ ' + v + '=-5') + (o.noNone ? '.' : ' (or: no solution).'));
      var Aa = uniqNums(L.vals);
      if (T.length && matchVals(Aa, T, round)) return ok();
      if (!round && L.dec && T.length && Aa.length === T.length && T.every(function (b) { return Aa.some(function (a) { return Math.abs(a - b) < 0.006; }); })) return form(cp + 'exact', 'Those are rounded decimals. Give the <b>exact</b> values (fractions or radicals).');
      for (var i = 0; i < wrongs.length; i++) if (!wrongs[i].none && matchVals(Aa, wrongs[i].vals, round)) return wrong(wrongs[i].code, wrongs[i].hint);
      if (!T.length) { if (extr.length && Aa.every(function (a) { return extr.some(function (e) { return closeTo(a, e, round); }); })) return wrong(cp + (o.extrCode || 'extr'), extrHint + ' There is no solution.'); return wrong('value', 'Substitute your value into the original equation: it does not check.'); }
      var extra = Aa.filter(function (a) { return !T.some(function (b) { return closeTo(a, b, round); }); }), miss = T.filter(function (b) { return !Aa.some(function (a) { return closeTo(a, b, round); }); });
      if (extra.length && !miss.length && extr.length && extra.every(function (a) { return extr.some(function (e) { return closeTo(a, e, round); }); })) return wrong(cp + (o.extrCode || 'extr'), extrHint);
      if (miss.length && !extra.length) return wrong(cp + (o.rejValid && extr.length ? 'rej-valid' : 'sol-missing'), o.rejValid && extr.length ? 'Check the value you rejected again: it makes both sides equal, so keep it.' : o.missHint || 'Correct so far, but there ' + (miss.length === 1 ? 'is another value' : 'are more values') + '. Solve <b>both</b> cases: the expression inside the bars equals the other side, or its opposite.');
      return wrong('value', null);
    };
  }
  function rootsPart(cp, prompt, vals, o, sol, hints, text) {
    o = o || {};
    var v = o.v || 'x', T = uniqNums(vals.map(valOf)), extr = uniqNums((o.extr || []).map(valOf)).filter(function (e) { return !has(T, e); });
    var keyTex = o.keyTex || rootsT(vals, v);
    var part = KP.math(prompt, rootsChk(cp, vals, o), keyTex, sol, hints, text, { keys: 'u7sol', vars: [v], placeholder: o.placeholder || 'e.g. ' + v + ' = 3, ' + v + ' = -5' + (o.noNone ? '' : '   (or: no solution)') });
    var bad = [];
    if (extr.length) bad.push(rootsT(T.concat(extr), v));
    (o.wrongs || []).forEach(function (w) { bad.push(w.vals.length ? rootsT(w.vals, v) : '\\text{no solution}'); });
    if (T.length && !o.noNone) bad.push('\\text{no solution}');
    part.bad = bad.filter(function (b, i, arr) { return arr.indexOf(b) === i && b !== keyTex && !(T.length && b === rootsT(vals, v)); });
    if (o.answer) part.answer = o.answer;
    return part;
  }

  /* sets of points (or "none"). pairs: [[x, y]] (numbers, or [x, y, tex]); o.wrongs [{ pairs, code, hint }]; o.tol:
     decimals within tol accepted (read from a graph) */
  function expandPm(s) { return String(s).replace(/\(([^()]*?)(\\pm|±)([^()]*?)\)/g, function (m, a, pm, b) { return '(' + a + '+' + b + '), (' + a + '-' + b + ')'; }); }
  function readPts(resp) {
    var s = String(resp == null ? '' : resp).replace(/\\left|\\right/g, '').replace(/\\[ ,;:!]|~/g, ' ').trim();
    if (!s) return { empty: true };
    if (isNone(s)) return { none: true };
    if (!/\(/.test(s)) return { nofmt: true };
    s = expandPm(s);
    var re = /\(([^()]*)\)/g, m, out = [];
    while ((m = re.exec(s))) { var xy = splitTop(m[1]); if (xy.length !== 2) return { bad: true }; var a = numVal(xy[0]), b = numVal(xy[1]); if (a == null || b == null) return { bad: true }; out.push([a, b]); }
    if (!out.length || s.replace(re, '').replace(/\\text\{\s*(and|or)\s*\}|\b(and|or)\b|[,\s]/g, '').length) return { bad: true };
    return { pts: out, dec: /\d\.\d/.test(s) };
  }
  function samePts(L, T, tol) { tol = tol || 1e-9; var near = function (p, q) { return Math.abs(p[0] - rv(q[0])) <= tol && Math.abs(p[1] - rv(q[1])) <= tol; }; var Lu = []; L.forEach(function (p) { if (!Lu.some(function (q) { return near(p, q); })) Lu.push(p); }); return Lu.length === T.length && T.every(function (q) { return Lu.some(function (p) { return near(p, q); }); }); }
  function ptsChk(cp, pairs, o) {
    o = o || {};
    var W = (o.wrongs || []).filter(function (w) { return !(w.pairs.length === pairs.length && samePts(pairs.map(function (p) { return [rv(p[0]), rv(p[1])]; }), w.pairs)); });
    return function (resp) {
      var L = readPts(resp);
      if (L.empty) return form('empty', 'Type your answer first.');
      if (L.none) { if (!pairs.length) return ok(); var wn = W.filter(function (w) { return !w.pairs.length; })[0]; return wrong(wn ? wn.code : cp + (o.noneCode || 'inv-none'), wn ? wn.hint : o.noneHint || 'There are some: the parabola meets the ' + t('x') + '-axis. Find its zeros.'); }
      if (L.nofmt) return form(cp + 'pts-fmt', 'Give each one as a point ' + t('(x,\\ y)') + ', separated by commas (or write none).');
      if (L.bad) return form('unreadable', 'Write points in brackets separated by commas, e.g. ' + t('(1,\\ 0),\\ (5,\\ 0)') + ' (or write none).');
      if (!pairs.length) { for (var j = 0; j < W.length; j++) if (W[j].pairs.length && samePts(L.pts, W[j].pairs)) return wrong(W[j].code, W[j].hint); return wrong(cp + (o.extraCode || 'inv-extra'), o.extraHint || 'There are none here: this graph never meets the ' + t('x') + '-axis.'); }
      if (samePts(L.pts, pairs)) return ok();
      if (o.tol && samePts(L.pts, pairs, o.tol)) return ok();
      if (!o.tol && L.dec && samePts(L.pts, pairs, 0.006)) return form(cp + 'exact', 'Those are rounded decimals. Give the <b>exact</b> points.');
      for (var i = 0; i < W.length; i++) if (W[i].pairs.length && samePts(L.pts, W[i].pairs)) return wrong(W[i].code, W[i].hint);
      var inT = function (p) { return pairs.some(function (q) { return Math.abs(p[0] - rv(q[0])) <= (o.tol || 1e-9) && Math.abs(p[1] - rv(q[1])) <= (o.tol || 1e-9); }); };
      if (L.pts.every(inT) && L.pts.length < pairs.length) return wrong(cp + 'inv-miss', 'Correct so far, but there is another one.');
      if (L.pts.some(function (p) { return Math.abs(p[1]) > 1e-9; }) && o.onAxis) return wrong('value', 'Invariant points of ' + t('y=|f(x)|') + ' are on the ' + t('x') + '-axis: their ' + t('y') + '-coordinate is 0.');
      return wrong('value', null);
    };
  }
  function ptsPart(cp, prompt, pairs, o, sol, hints, text) {
    o = o || {};
    var keyTex = ptsT(pairs), part = KP.math(prompt, ptsChk(cp, pairs, o), keyTex, sol, hints, text, { keys: 'u7pts', placeholder: 'e.g. (1, 0), (5, 0)   (or: none)' });
    part.bad = (o.wrongs || []).map(function (w) { return ptsT(w.pairs); }).concat(pairs.length ? ['\\text{none}'] : []).filter(function (b, i, arr) { return arr.indexOf(b) === i && b !== keyTex; });
    return part;
  }
  /* an exact number; wr [{ v, code, hint }] */
  function valChk(cp, target, wr, o) {
    o = o || {};
    var T = rv(target), W = (wr || []).filter(function (w) { return Math.abs(rv(w.v) - T) > 1e-9; });
    var base = K.value(Array.isArray(target) ? target : T, { diag: function (v) { for (var i = 0; i < W.length; i++) if (Math.abs(v - rv(W[i].v)) < 1e-9 * Math.max(1, Math.abs(v))) return { code: W[i].code, hint: W[i].hint }; return null; } });
    return function (resp) { var res = base(resp); if (res.v === 'wrong' && res.code === 'value' && o.exact !== false) { var a = K.read(resp); if (!a.res && /\d\.\d/.test(String(resp)) && Math.abs(a.val - T) < 0.006 && Math.abs(a.val - T) > 1e-9) return form(cp + 'exact', 'That is a rounded decimal. Give the <b>exact</b> value.'); } return res; };
  }
  function valPart(cp, prompt, target, wr, sol, hints, text, o) {
    o = o || {};
    var keyTex = o.keyTex || nt(target), part = KP.math(prompt, valChk(cp, target, wr, o), keyTex, sol, hints, text, { keys: o.keys || 'fraction', before: o.before, after: o.after });
    part.bad = (wr || []).filter(function (w) { return Math.abs(rv(w.v) - rv(target)) > 1e-9; }).map(function (w) { return nt(w.v); }).filter(function (b, i, arr) { return arr.indexOf(b) === i && b !== keyTex; });
    return part;
  }
  function numChk(ans, wr) { return K.number(ans, function (v) { for (var i = 0; i < (wr || []).length; i++) if (Math.abs(v - wr[i].v) < 1e-9) return { code: wr[i].code, hint: wr[i].hint }; return null; }); }
  function pointChk(target, wr) { return K.point(target.map(function (c) { return toR(c) || c; }), { wrong: (wr || []).filter(function (w) { return !(Math.abs(rv(w.p[0]) - rv(target[0])) < 1e-9 && Math.abs(rv(w.p[1]) - rv(target[1])) < 1e-9); }).map(function (w) { return { is: w.p.map(function (c) { return toR(c) || c; }), code: w.code, hint: w.hint }; }) }); }
  /* several labelled boxes; combine(resp[]) may decide first (null = each box's own checker) */
  function fieldsPart(prompt, fields, checkers, keys, answer, sol, hints, text, bad, combine) {
    var base = K.fields(checkers, { labels: fields.map(function (f) { return f.name || f.label; }) });
    return { prompt: prompt, input: { type: 'fields', fields: fields }, check: function (resp) { resp = resp || []; var c = combine ? combine(resp) : null; return c || base(resp); }, key: keys, answer: answer, solution: sol, hints: hints || [], text: text,
      bad: (bad || []).filter(function (b) { return b.join('|') !== keys.join('|'); }) };
  }
  function polyIs(target) { var c = K.poly(target, { expanded: false }); return function (s) { return c(s).v === 'correct'; }; }
  function mcPart(r, prompt, opts, sol, hints, text, cols) {
    var seen = {}, list = opts.filter(function (o) { if (seen[o.html]) return false; seen[o.html] = 1; return true; });
    var p = KP.mc(r, prompt, list, sol, hints, text); if (cols) p.input.columns = cols; return p;
  }

  /* ======================================================================================================
   * Quadratics f(x) = a(x − p)² + q and the graph of y = |f(x)|
   * ====================================================================================================== */
  function QV(a, p, q) {
    var av = rv(a), aR = toR(a), Q = { a: aR, av: av, p: p, q: q, up: av > 0 };
    Q.f = function (x) { return av * (x - p) * (x - p) + q; };
    Q.g = function (x) { return Math.abs(Q.f(x)); };
    Q.poly = P.add(P.scale(P.mul(lin(1, -p), lin(1, -p)), aR), M(q, 0));
    var d = -q / av, zs = [];
    if (Math.abs(d) < 1e-12) zs = [{ v: p, tex: nt(p) }];
    else if (d > 0) {
      var s = Math.sqrt(d), sr = toR(s);
      if (sr && sr[1] <= 12 && Math.abs(sr[0] * sr[0] / (sr[1] * sr[1]) - d) < 1e-9) zs = [{ v: p - s, tex: nt(p - s) }, { v: p + s, tex: nt(p + s) }];
      else { var n = Math.round(d), k = 1, m = n; for (var f = 2; f * f <= m; f++) while (m % (f * f) === 0) { m /= f * f; k *= f; } var rad = (k === 1 ? '' : k) + '\\sqrt{' + m + '}'; zs = [{ v: p - s, tex: (p === 0 ? '-' : nt(p) + '-') + rad }, { v: p + s, tex: (p === 0 ? '' : nt(p) + '+') + rad }]; }
    }
    Q.zeros = zs; Q.inv = zs.map(function (z) { return [z.v, 0, '(' + z.tex + ',\\ 0)']; });
    Q.kind = zs.length === 2 ? 'cross' : zs.length === 1 ? 'touch' : q > 0 ? 'above' : 'below';
    Q.y0 = Q.f(0); Q.yint = Math.abs(Q.y0); Q.vtx = [p, Math.abs(q)];
    Q.range = Q.kind === 'above' ? setT('y\\ge ' + nt(q)) : Q.kind === 'below' ? setT('y\\ge ' + nt(-q)) : setT('y\\ge 0');
    Q.fRange = Q.up ? setT('y\\ge ' + nt(q)) : setT('y\\le ' + nt(q));
    Q.vT = vtxT(aR, p, q); Q.gT = tx(Q.poly);
    return Q;
  }
  function QR(a, r, s) { var p = (r + s) / 2, q = rv(a) * (p - r) * (p - s), Q = QV(a, p, q); Q.r = r; Q.s = s; Q.fT = facT(toR(a), r, s); return Q; }
  U.QV = QV; U.QR = QR;

  /* a graph window around the parabola (or its absolute value) */
  function win(Q, o) {
    o = o || {};
    var xs = [Q.p - 4, Q.p + 4].concat(Q.zeros.map(function (z) { return z.v; })), lo = Math.floor(Math.min.apply(null, xs)) - 1, hi = Math.ceil(Math.max.apply(null, xs)) + 1;
    if (hi - lo < 10) { var e = Math.ceil((10 - (hi - lo)) / 2); lo -= e; hi += e; }
    var Y = Math.max(6, Math.ceil(Math.abs(Q.q)) + 2, o.ymin || 0); if (Y > 6 && Y % 2) Y++;
    return { x: [lo, hi], y: o.abs ? [-2, Y] : [-Y, Y], labels: Math.max(hi - lo, 2 * Y) > 16 ? 4 : 2 };
  }
  function fGraph(Q, o) { o = o || {}; var w = win(Q, o); return G({ x: w.x, y: w.y, labels: w.labels, max: o.max || 280, fns: [crv(Q.f)], points: o.noVertex ? [] : [{ x: Q.p, y: Q.q, label: '(' + fmt(Q.p) + ', ' + fmt(Q.q) + ')' }], aria: 'the graph of a parabola' }); }
  function wGraph(Q, o) { o = o || {}; var w = win(Q, { abs: true }); var pts = (o.pts || []).map(function (p) { return { x: p[0], y: p[1], label: '(' + fmt(p[0]) + ', ' + fmt(p[1]) + ')' }; }); return G({ x: w.x, y: w.y, labels: w.labels, max: o.max || 280, fns: [crv(Q.g)], points: pts, aria: 'the graph of y = |f(x)|' }); }
  function fmt(x) { var s = String(+(+x).toFixed(4)); return s.charAt(0) === '-' ? '−' + s.slice(1) : s; }

  /* words */
  function opens(Q) { return Q.up ? 'up' : 'down'; }
  function featSol(Q, name) {
    name = name || 'f';
    var s = t(name + '(x)') + ' opens ' + opens(Q) + ' with vertex ' + t(pt(Q.p, Q.q)) + '. ';
    if (Q.kind === 'cross') s += 'Zeros ' + Q.zeros.map(function (z) { return t(z.tex); }).join(' and ') + ': invariant points ' + t(ptsT(Q.inv)) + '. ' + (Q.up ? 'The arc between the zeros is below the axis and is reflected: the vertex ' + t(pt(Q.p, Q.q)) + ' moves to ' + t(pt(Q.p, -Q.q)) + '.' : 'The two arms outside the zeros are below the axis and are reflected; the vertex ' + t(pt(Q.p, Q.q)) + ' stays.');
    else if (Q.kind === 'touch') s += 'The vertex is on the ' + t('x') + '-axis: one invariant point, ' + t(ptsT(Q.inv)) + '. ' + (Q.up ? 'Nothing is below the axis, so nothing changes.' : 'Everything else is below the axis and is reflected, giving the parabola ' + t('y=' + vtxT(toR(-Q.av), Q.p, 0)) + '.');
    else if (Q.kind === 'above') s += 'It is entirely above the ' + t('x') + '-axis: nothing changes, and there are no invariant points.';
    else s += 'It is entirely below the ' + t('x') + '-axis: the whole parabola is reflected, the vertex moves to ' + t(pt(Q.p, -Q.q)) + ' and it opens up. No invariant points.';
    return s;
  }
  function rangeWhy(Q) { return Q.kind === 'cross' || Q.kind === 'touch' ? 'The graph reaches the ' + t('x') + '-axis and has no negative values: range ' + t(Q.range) + '.' : 'The graph never reaches the ' + t('x') + '-axis; its least value is at the vertex ' + t(pt(Q.vtx[0], Q.vtx[1])) + ': range ' + t(Q.range) + '.'; }
  function yintWhy(Q) { return t('y') + '-intercept ' + t(A(nt(Q.y0)) + '=' + nt(Q.yint)) + '.'; }

  /* the wrong-answer lists for the features */
  function invWrongs(cp, Q) {
    var wr = [];
    if (Q.zeros.length && Q.zeros.some(function (z) { return Math.abs(z.v) > 1e-9; }) && !sameSet(Q.zeros.map(function (z) { return -z.v; }), Q.zeros.map(function (z) { return z.v; }))) wr.push({ pairs: Q.zeros.map(function (z) { return [-z.v, 0]; }), code: cp + 'inv-sign', hint: 'Check the signs of the zeros: from ' + t('(x-a)=0') + ', ' + t('x=a') + '.' });
    if (Math.abs(Q.y0) > 1e-9) wr.push({ pairs: Q.inv.map(function (z) { return [z[0], 0]; }).concat([[0, Q.yint]]), code: cp + 'inv-yint', hint: 'Invariant points are the points that do not move: those on the ' + t('x') + '-axis, the zeros of ' + t('f') + '. The ' + t('y') + '-intercept is not one of them.' });
    if (Math.abs(Q.q) > 1e-9) wr.push({ pairs: [[Q.p, Math.abs(Q.q)]], code: cp + 'inv-vertex', hint: 'The vertex is not on the ' + t('x') + '-axis. Invariant points are where ' + t('f(x)=0') + '.' });
    return wr;
  }
  function vtxWrongs(cp, Q) {
    var wr = [];
    if (Q.q < 0) wr.push({ p: [Q.p, Q.q], code: cp + 'vtx-noreflect', hint: 'The vertex of ' + t('f') + ' is below the ' + t('x') + '-axis, so it is reflected: ' + t('(x,\\ y)\\to(x,\\ -y)') + '.' });
    if (Q.q > 0) wr.push({ p: [Q.p, -Q.q], code: cp + 'vtx-reflect', hint: 'The vertex is above the ' + t('x') + '-axis, so it stays where it is. Only the parts below the axis are reflected.' });
    if (Q.p !== 0) wr.push({ p: [-Q.p, Math.abs(Q.q)], code: cp + 'vtx-x', hint: 'Reflecting in the ' + t('x') + '-axis does not change ' + t('x') + '-values. Check the sign of ' + t('p') + ' in ' + t('(x-p)^{2}') + '.' });
    return wr;
  }
  function rngWrongs(cp, Q) {
    var wr = [];
    if (Q.fRange !== Q.range) wr.push({ is: Q.fRange, code: cp + 'rng-f', hint: 'That is the range of ' + t('y=f(x)') + '. The graph of ' + t('y=|f(x)|') + ' has no negative ' + t('y') + '-values.' });
    if (Q.kind === 'above' || Q.kind === 'below') wr.push({ is: setT('y\\ge 0'), code: cp + 'rng-zero', hint: 'This parabola never reaches the ' + t('x') + '-axis, so ' + t('|f(x)|') + ' is never 0. Its least value comes from the vertex.' });
    if (Q.kind === 'cross') wr.push({ is: setT('y\\ge ' + nt(Math.abs(Q.q))), code: cp + 'rng-q', hint: 'This parabola crosses the ' + t('x') + '-axis, so ' + t('|f(x)|') + ' reaches 0 at the invariant points.' });
    if (Q.kind === 'below') wr.push({ is: setT('y\\ge ' + nt(Q.q)), code: cp + 'vtx-noreflect', hint: 'The whole parabola is below the axis and is reflected: the vertex ' + t(pt(Q.p, Q.q)) + ' moves to ' + t(pt(Q.p, -Q.q)) + '.' });
    return wr.filter(function (w) { return w.is !== Q.range; });
  }

  /* labelled boxes for the features of y = |f(x)|. want: list of 'inv' 'vtx' 'yint' 'rng' 'dom' */
  function featPart(cp, prompt, Q, want, o) {
    o = o || {};
    var keys0 = want.indexOf('rng') >= 0 || want.indexOf('dom') >= 0 ? 'set' : 'u7pts';
    var fields = [], checks = [], keys = [], bad = [], ans = [];
    want.forEach(function (w, i) {
      if (w === 'inv') {
        var iw = invWrongs(cp, Q);
        fields.push({ label: 'Invariant points', name: 'invariant points', mode: 'math', keys: keys0, none: keys0 === 'set', placeholder: '(x, 0), …   or none' });
        checks.push(ptsChk(cp, Q.inv, { wrongs: iw, tol: o.tol, onAxis: true })); keys.push(ptsT(Q.inv)); ans.push('invariant points ' + t(ptsT(Q.inv)));
        iw.forEach(function (x) { bad.push([i, ptsT(x.pairs)]); }); if (Q.inv.length) bad.push([i, '\\text{none}']);
      } else if (w === 'vtx') {
        var vw = vtxWrongs(cp, Q);
        fields.push({ label: o.vtxLabel || 'Vertex of the graph of ' + t('y=|f(x)|'), name: 'vertex', mode: 'math', keys: keys0, placeholder: '(x, y)' });
        checks.push(pointChk(Q.vtx, vw)); keys.push(pt(Q.vtx[0], Q.vtx[1])); ans.push('vertex ' + t(pt(Q.vtx[0], Q.vtx[1])));
        vw.forEach(function (x) { bad.push([i, pt(x.p[0], x.p[1])]); });
      } else if (w === 'yint') {
        var yw = []; if (Q.y0 < 0) yw.push({ v: Q.y0, code: cp + 'yint-neg', hint: 'At ' + t('x=0') + ', ' + t('f(0)=' + nt(Q.y0)) + ', and the absolute value makes it positive.' });
        Q.zeros.forEach(function (z) { if (Math.abs(z.v) > 1e-9 && Math.abs(Math.abs(z.v) - Q.yint) > 1e-9 && toR(z.v)) yw.push({ v: z.v, code: cp + 'yint-x', hint: 'That is an ' + t('x') + '-intercept. The ' + t('y') + '-intercept is the value at ' + t('x=0') + '.' }); });
        fields.push({ label: t('y') + '-intercept', name: 'y-intercept', mode: 'math', keys: keys0, placeholder: 'a number' });
        checks.push(valChk(cp, Q.yint, yw)); keys.push(nt(Q.yint)); ans.push(t('y') + '-intercept ' + t(nt(Q.yint)));
        yw.forEach(function (x) { bad.push([i, nt(x.v)]); });
      } else if (w === 'rng') {
        var rw = rngWrongs(cp, Q);
        fields.push({ label: 'Range of ' + t('y=|f(x)|'), name: 'range', mode: 'math', keys: keys0, vars: ['y'], placeholder: '{y | y >= 0, y in R}' });
        checks.push(K.set(Q.range, { v: 'y', wrong: rw })); keys.push(Q.range); ans.push('range ' + t(Q.range));
        rw.forEach(function (x) { bad.push([i, x.is]); });
      } else if (w === 'dom') {
        fields.push({ label: 'Domain of ' + t('y=|f(x)|'), name: 'domain', mode: 'math', keys: keys0, vars: ['x'], placeholder: '{x | x in R}' });
        checks.push(K.set('\\{x\\mid x\\in\\mathbb{R}\\}', { v: 'x' })); keys.push('\\{x\\mid x\\in\\mathbb{R}\\}'); ans.push('domain ' + t('\\{x\\mid x\\in\\mathbb{R}\\}'));
      }
    });
    var bads = bad.map(function (b) { var k = keys.slice(); k[b[0]] = b[1]; return k; });
    return fieldsPart(prompt, fields, checks, keys, ans.join('; '), o.sol || featSol(Q) + (want.indexOf('yint') >= 0 ? ' ' + yintWhy(Q) : '') + (want.indexOf('rng') >= 0 ? ' ' + rangeWhy(Q) : ''),
      o.hints || ['Find the vertex and the direction of opening: does the parabola cross the ' + t('x') + '-axis, touch it, or miss it?', 'Points on the ' + t('x') + '-axis do not move (invariant points); parts below the axis are reflected, ' + t('(x,\\ y)\\to(x,\\ -y)') + '.'], o.text || 'features of y = |f(x)|, f quadratic', bads);
  }
  U.featPart = featPart;

  /* piecewise form of y = |f(x)| (two distinct zeros r < s). ftex: how f is written in the prompt */
  function piecePart(cp, prompt, Q, o) {
    o = o || {};
    var f = Q.poly, up = Q.up, Eo = up ? f : P.neg(f), Ei = P.neg(Eo), isO = polyIs(Eo), isI = polyIs(Ei);
    var lead = P.coef(f, { x: 2 }), negLead = P.add(f, P.scale(M(1, 2), [-2 * lead[0], lead[1]])); // only the x² term negated
    var r0 = Q.zeros[0].v, s0 = Q.zeros[1].v;
    var fields = [{ label: 'Smaller zero of ' + t('f') + ': ' + t('r='), name: 'r', mode: 'math', keys: 'poly', vars: ['x'] }, { label: 'Larger zero: ' + t('s='), name: 's', mode: 'math', keys: 'poly', vars: ['x'] },
      { label: (up ? 'For ' + t('x\\le r') + ' or ' + t('x\\ge s') : 'For ' + t('x<r') + ' or ' + t('x>s')) + ': ' + t('y='), name: 'outer piece', mode: 'math', keys: 'poly', vars: ['x'] },
      { label: (up ? 'For ' + t('r<x<s') : 'For ' + t('r\\le x\\le s')) + ': ' + t('y='), name: 'middle piece', mode: 'math', keys: 'poly', vars: ['x'] }];
    var keys = [nt(r0), nt(s0), tx(Eo), tx(Ei)];
    var combine = function (resp) {
      var a = numVal(resp[0]), b = numVal(resp[1]); if (a == null || b == null || !String(resp[2] || '').trim() || !String(resp[3] || '').trim()) return null;
      var zOK = has([a], r0) && has([b], s0), zSwap = has([a], s0) && has([b], r0), zNeg = sameSet([a, b], [-r0, -s0]) && !sameSet([a, b], [r0, s0]);
      if ((zOK || zSwap) && isI(resp[2]) && isO(resp[3])) return wrong(cp + 'pw-swap', 'Your two pieces are swapped. ' + (up ? 'The parabola opens up, so it is below the axis <b>between</b> its zeros: that is where the piece is ' + t('-f(x)') + '.' : 'The parabola opens down, so it is below the axis <b>outside</b> its zeros: that is where the piece is ' + t('-f(x)') + '.'));
      if (zNeg && isO(resp[2]) && isI(resp[3])) return wrong(cp + 'pw-bsign', 'The pieces are right. Check the zeros: solve ' + t('f(x)=0') + ' again.');
      if ((zOK || zSwap) && (up ? isO(resp[2]) && polyIs(negLead)(resp[3]) : isI(resp[3]) && polyIs(negLead)(resp[2]))) return wrong(cp + 'pw-neg', 'The ' + (up ? 'middle' : 'outer') + ' piece is the opposite of the <b>whole</b> expression: change the sign of every term.');
      if (zSwap && isO(resp[2]) && isI(resp[3])) return wrong(cp + 'pw-bound', 'Put the smaller zero in the first box.');
      return null;
    };
    var bad = [[keys[0], keys[1], keys[3], keys[2]], [nt(-s0), nt(-r0), keys[2], keys[3]], (up ? [keys[0], keys[1], keys[2], tx(negLead)] : [keys[0], keys[1], tx(negLead), keys[3]])];
    if (sameSet([-r0, -s0], [r0, s0])) bad.splice(1, 1);
    var cases = up ? 'y=\\begin{cases}' + tx(Eo) + ', & x\\le ' + nt(r0) + '\\text{ or }x\\ge ' + nt(s0) + '\\\\ ' + tx(Ei) + ', & ' + nt(r0) + '<x<' + nt(s0) + '\\end{cases}'
      : 'y=\\begin{cases}' + tx(Ei) + ', & ' + nt(r0) + '\\le x\\le ' + nt(s0) + '\\\\ ' + tx(Eo) + ', & x<' + nt(r0) + '\\text{ or }x>' + nt(s0) + '\\end{cases}';
    return fieldsPart(prompt + ' Let ' + t('r<s') + ' be the zeros of ' + t('f') + '.', fields, [K.value(r0), K.value(s0), K.poly(Eo, { expanded: false }), K.poly(Ei, { expanded: false })], keys, t(cases),
      (o.fac ? t(o.ftex + '=' + o.fac) + ': ' : '') + 'zeros ' + t(nt(r0)) + ' and ' + t(nt(s0)) + '. It opens ' + (up ? 'up, so ' + t('f(x)<0') + ' between the zeros' : 'down, so ' + t('f(x)<0') + ' outside the zeros') + ', and there ' + t('|f(x)|=-f(x)') + ' (change every sign).<br>' + t(cases),
      ['Find the zeros, then decide where the parabola is below the ' + t('x') + '-axis (the direction of opening tells you).', 'Where ' + t('f(x)\\ge 0') + ' the piece is ' + t('f(x)') + '; where ' + t('f(x)<0') + ' it is ' + t('-f(x)') + ', with every sign changed.'], o.text || 'piecewise form of y = |f(x)|, f quadratic', bad, combine);
  }
  U.piecePart = piecePart;
  /* one piece: f(x) ≥ 0 everywhere (y = f) or f(x) < 0 everywhere (y = −f) */
  function onePiecePart(cp, prompt, Q, ftex, o) {
    o = o || {};
    var T = Q.kind === 'below' ? P.neg(Q.poly) : Q.poly, other = P.neg(T);
    var why = Q.kind === 'below' ? t(ftex + '=' + Q.vT) + ': the parabola opens down with vertex ' + t(pt(Q.p, Q.q)) + ', so ' + t(ftex + '<0') + ' for every ' + t('x') + ' and ' + t('|f(x)|=-f(x)') + '.<br>One piece: ' + t('y=' + tx(T)) + ', ' + t('x\\in\\mathbb{R}') + '.'
      : t(ftex + '=' + Q.vT) + (Q.kind === 'touch' ? ' is a perfect square, so it is never negative' : ': the parabola opens up with vertex ' + t(pt(Q.p, Q.q)) + ', so ' + t(ftex + '\\ge ' + nt(Q.q) + '>0')) + ' for every ' + t('x') + '.<br>One piece: ' + t('y=' + tx(T)) + ', ' + t('x\\in\\mathbb{R}') + '.';
    var p = KP.poly(prompt + ' (Decide first whether ' + t(ftex) + ' changes sign.)', T, { expanded: false, before: 'y=', wrong: [{ is: other, code: cp + 'pw-one', hint: Q.kind === 'below' ? t(ftex) + ' is negative for every ' + t('x') + ', so the bars change every sign: ' + t('|f(x)|=-f(x)') + '.' : t(ftex) + ' is never negative, so the bars change nothing: ' + t('|f(x)|=f(x)') + '.' }] }, why,
      ['Complete the square (or use the discriminant) to see whether the parabola ever crosses the ' + t('x') + '-axis.', 'If ' + t('f(x)') + ' never changes sign, one expression works for every ' + t('x') + '.'], o.text || 'one-piece form of y = |f(x)|');
    p.bad = [tx(other)];
    return p;
  }
  /* "which graph is y = |f(x)|?" — the right graph, f itself, −|f|, −f, a mirror image or the vertex moved without reflecting */
  function graphMC(r, cp, Q, prompt, o) {
    o = o || {};
    var w = win(Q), opt = function (fn, aria) { return mini({ x: w.x, y: w.y, labels: w.labels, fns: [crv(fn)], aria: aria }); };
    var cand = {
      ok: { f: Q.g, why: null },
      same: { f: Q.f, why: 'Nothing has been reflected. The parts of the parabola below the ' + t('x') + '-axis must be reflected upward: ' + t('y=|f(x)|') + ' is never negative.' },
      neg: { f: function (x) { return -Q.g(x); }, why: 'The graph of ' + t('y=|f(x)|') + ' is never below the ' + t('x') + '-axis: the parts above the axis stay, and only the parts below it are reflected upward.' },
      whole: { f: function (x) { return -Q.f(x); }, why: 'Only the parts <b>below</b> the ' + t('x') + '-axis are reflected; the parts above it stay.' },
      mirror: { f: function (x) { return Q.g(-x); }, why: 'Reflecting in the ' + t('x') + '-axis does not change ' + t('x') + '-values: the invariant points and the vertex keep their ' + t('x') + '-coordinates.' },
      shift: { f: function (x) { return Q.f(x) - 2 * Q.q; }, why: 'The vertex moves to ' + t(pt(Q.p, -Q.q)) + ', but the whole parabola is reflected, so it opens the other way too.' }
    };
    var order = o.order || (Q.kind === 'below' ? ['ok', 'same', 'shift', 'mirror'] : ['ok', 'same', 'neg', 'whole', 'mirror']);
    var xs = []; for (var x = w.x[0]; x <= w.x[1]; x += 0.5) xs.push(x);
    var keep = [];
    order.forEach(function (k) { var c = cand[k]; if (keep.some(function (j) { return xs.every(function (x) { return Math.abs(cand[j].f(x) - c.f(x)) < 1e-6; }); })) return; keep.push(k); });
    keep = keep.slice(0, 4);
    var opts = keep.map(function (k) { return { html: opt(cand[k].f, k === 'ok' ? 'the right graph' : 'a graph'), right: k === 'ok', why: cand[k].why, code: k }; });
    var p = KP.mc(r, prompt, opts, o.sol || featSol(Q), o.hints || ['Points on the ' + t('x') + '-axis do not move.', 'Where ' + t('f(x)<0') + ' the graph is reflected upward; where ' + t('f(x)\\ge 0') + ' it stays.'], o.text || 'graph of y = |f(x)|, f quadratic');
    p.input.columns = 2;
    return p;
  }
  U.graphMC = graphMC;

  /* exports */
  Object.assign(U, { toR: toR, rv: rv, rt: rt, nt: nt, sgT: sgT, coefT: coefT, A: A, M: M, lin: lin, quad: quad, tx: tx, txAsc: txAsc, pt: pt, ptsT: ptsT, pickWhere: pickWhere, nz: nz, has: has,
    uniqNums: uniqNums, sameSet: sameSet, isSq: isSq, qroots: qroots, excl: excl, G: G, mini: mini, crv: crv, readVals: readVals, rootsChk: rootsChk, rootsPart: rootsPart, rootsT: rootsT,
    ptsChk: ptsChk, ptsPart: ptsPart, valChk: valChk, valPart: valPart, numChk: numChk, pointChk: pointChk, fieldsPart: fieldsPart, polyIs: polyIs, mcPart: mcPart, setT: setT, numVal: numVal,
    isNone: isNone, gcd: gcd, fmt: fmt });

  /* ======================================================================================================
   * Generators shared by several booklet items
   * ====================================================================================================== */
  /* a quadratic with integer zeros r < s, a = ±1 (or given list), vertex integer when evenW */
  function rootSpec(r, o) {
    o = o || {};
    return pickWhere(function () { var r1 = r.int(o.lo == null ? -6 : o.lo, o.hi == null ? 4 : o.hi), w = r.int(o.wmin || 2, o.wmax || 8); return { a: r.pick(o.as || [1]), r: r1, s: r1 + w }; },
      function (z) { var c = rv(z.a) * z.r * z.s, b = -rv(z.a) * (z.r + z.s); return (o.c0 || c !== 0) && Math.abs(c) <= (o.cmax || 30) && Number.isInteger(c) && Number.isInteger(b) && z.s <= (o.smax || 8) && (!o.evenW || (z.s - z.r) % 2 === 0) && excl(z, o.ex || []); });
  }
  var HFEAT = ['Find the vertex and the direction of opening: does the parabola cross the ' + t('x') + '-axis, touch it, or miss it?', 'Points on the ' + t('x') + '-axis do not move; parts below the axis are reflected, ' + t('(x,\\ y)\\to(x,\\ -y)') + '.'];

  /* Q1 / from a graph: kinds irr, down, upHalf, below, touch, downWide */
  function fromGraph(kind) {
    return function (r) {
      var Q, eqShown = false;
      if (kind === 'irr') { var s1 = pickWhere(function () { return { p: nz(r, 1, 3), n: r.pick([2, 3, 5, 6, 7]) }; }, function (z) { return excl(z, [{ p: 2, n: 5 }]); }); Q = QV(1, s1.p, -s1.n); eqShown = true; }
      else if (kind === 'down') { var s2 = pickWhere(function () { return { a: r.pick([-1, -0.5, -2]), w: r.int(1, 3), p: r.int(-3, 3) }; }, function (z) { var q = -z.a * z.w * z.w; return q >= 1 && q <= 6 && excl(z, [{ a: -0.5, w: 3, p: -1 }, { a: -1, w: 2, p: -1 }]); }); Q = QV(s2.a, s2.p, -s2.a * s2.w * s2.w); }
      else if (kind === 'upHalf') { var s3 = pickWhere(function () { return { a: r.pick([2, 0.5]), w: r.pick([0.5, 1, 1.5, 2, 3]), p: r.int(-4, 3) }; }, function (z) { var q = z.a * z.w * z.w; return q <= 5 && q >= 0.5 && (z.w % 1 !== 0 || z.a === 0.5) && excl(z, [{ a: 2, w: 1.5, p: -3 }]); }); Q = QV(s3.a, s3.p, -s3.a * s3.w * s3.w); }
      else if (kind === 'below') { var s4 = pickWhere(function () { return { a: r.pick([-1, -2, -0.5]), q: -r.int(1, 3), p: nz(r, 1, 3) }; }, function (z) { return excl(z, [{ a: -1, p: -1, q: -2 }, { a: -1, p: 1, q: -2 }]); }); Q = QV(s4.a, s4.p, s4.q); }
      else if (kind === 'touch') { var s5 = pickWhere(function () { return { a: r.pick([1, 2, 0.5]), p: nz(r, 1, 4) }; }, function (z) { return excl(z, [{ a: 1, p: 3 }]); }); Q = QV(s5.a, s5.p, 0); }
      else { var s6 = pickWhere(function () { return { a: r.pick([-0.25, -0.5]), w: r.pick([2, 3, 4]), p: r.int(-2, 2) }; }, function (z) { var q = -z.a * z.w * z.w; return q >= 1 && q <= 5 && excl(z, [{ a: -0.25, w: 2, p: 0 }]); }); Q = QV(s6.a, s6.p, -s6.a * s6.w * s6.w); }
      var prompt = 'The graph of ' + t('y=f(x)') + ' is shown' + (eqShown ? ': ' + t('f(x)=' + Q.vT) : '') + '. Picture (or sketch) the graph of ' + t('y=|f(x)|') + '. State its invariant points' + (eqShown ? ' (exact, or to the nearest tenth)' : '') + ' and its vertex.' + fGraph(Q);
      return featPart(CP, prompt, Q, ['inv', 'vtx'], { tol: eqShown ? 0.051 : null, text: 'invariant points and vertex of |f| from a graph' });
    };
  }

  /* ======================================================================================================
   * The assignment
   * ====================================================================================================== */
  function Pt(id, level, make) { return { id: id, level: level, outcome: OUT, make: make }; }
  var QUESTIONS = [
    { num: '1', parts: [Pt('1a', 'EMG', fromGraph('irr')), Pt('1b', 'BEG', fromGraph('down')), Pt('1c', 'BEG', fromGraph('upHalf')), Pt('1d', 'BEG', fromGraph('below')), Pt('1e', 'EMG', fromGraph('touch')), Pt('1f', 'BEG', fromGraph('downWide'))] },

    { num: '2', shared: function (r) { return pickWhere(function () { return { a: r.pick([-1, -1, 1]), r: r.int(-6, 1) }; }, function (z) { return excl(z, [{ a: -1, r: -4 }, { a: 1, r: -1 }]) && z.r + 4 <= 5; }); },
      stem: function (o) { var Q = QR(o.a, o.r, o.r + 4); return 'Consider ' + t('g(x)=' + Q.gT) + '.'; },
      parts: [
        Pt('2a', 'BEG', function (r, o) {
          var Q = QR(o.a, o.r, o.r + 4), xs = []; for (var x = o.r - 1; x <= o.r + 5; x++) xs.push(x);
          var fields = [], checks = [], keys = [];
          xs.forEach(function (x) { var v = Q.f(x); fields.push({ label: t('g(' + x + ')='), name: 'g(' + x + ')' }); checks.push(numChk(v, x !== 0 ? [{ v: Q.f(x) - 2 * o.a * x * x, code: CP + 'tab-sub', hint: 'Square first: ' + t('(' + x + ')^{2}=' + x * x) + ', then multiply by ' + t(o.a) + '.' }] : [])); keys.push(String(v)); });
          xs.forEach(function (x) { var v = Q.f(x); fields.push({ label: t(A('g(' + x + ')') + '='), name: '|g(' + x + ')|' }); checks.push(numChk(Math.abs(v), v < 0 ? [{ v: v, code: CP + 'tab-abs', hint: 'An absolute value is never negative: ' + t(A(v) + '=' + Math.abs(v)) + '.' }] : [])); keys.push(String(Math.abs(v))); });
          var bad1 = keys.slice(); xs.forEach(function (x, i) { if (Q.f(x) < 0) bad1[7 + i] = String(Q.f(x)); });
          var x0 = xs[0];
          return fieldsPart('Complete the table of values: ' + t('g(x)') + ' and ' + t('|g(x)|') + ' for ' + t('x=' + xs[0]) + ' to ' + t(xs[6]) + '.', fields, checks, keys,
            HW.valueTable([['x'].concat(xs), ['g(x)'].concat(xs.map(Q.f)), ['|g(x)|'].concat(xs.map(Q.g))]),
            'Substitute each value, e.g. ' + t('g(' + x0 + ')=' + tx(Q.poly).replace(/x/g, '(' + x0 + ')') + '=' + Q.f(x0)) + '. Then ' + t('|g(x)|') + ' is the same number without its sign.' + HW.valueTable([['x'].concat(xs), ['g(x)'].concat(xs.map(Q.f)), ['|g(x)|'].concat(xs.map(Q.g))]),
            ['Square first, then multiply by the coefficient: ' + t('-(' + x0 + ')^{2}') + ' is negative.', 'The bottom row is the absolute value of the middle row.'], 'table of values for g and |g|', [bad1]);
        }),
        Pt('2b', 'BEG', function (r, o) { var Q = QR(o.a, o.r, o.r + 4); return graphMC(r, CP, Q, 'Which graph is ' + t('y=|g(x)|') + '?', { sol: featSol(Q, 'g') }); }),
        Pt('2c', 'PRG', function (r, o) {
          var Q = QR(o.a, o.r, o.r + 4), D = '\\{x\\mid x\\in\\mathbb{R}\\}';
          var fields = [{ label: 'Domain of ' + t('y=g(x)'), name: 'domain of g', mode: 'math', keys: 'set', vars: ['x', 'y'] }, { label: 'Range of ' + t('y=g(x)'), name: 'range of g', mode: 'math', keys: 'set', vars: ['x', 'y'] },
            { label: 'Domain of ' + t('y=|g(x)|'), name: 'domain of |g|', mode: 'math', keys: 'set', vars: ['x', 'y'] }, { label: 'Range of ' + t('y=|g(x)|'), name: 'range of |g|', mode: 'math', keys: 'set', vars: ['x', 'y'] }];
          var keys = [D, Q.fRange, D, Q.range];
          return fieldsPart('State the domain and range of ' + t('y=g(x)') + ' and of ' + t('y=|g(x)|') + '.', fields,
            [K.set(D, { v: 'x' }), K.set(Q.fRange, { v: 'y', other: D, wrong: [{ is: Q.range, code: CP + 'rng-f', hint: 'That is the range of ' + t('|g|') + '. ' + t('g') + ' itself has negative values.' }] }), K.set(D, { v: 'x', wrong: [{ is: setT('x\\ge 0', 'x'), code: CP + 'dom', hint: 'Reflecting in the ' + t('x') + '-axis changes no ' + t('x') + '-values: the domain stays the same.' }] }),
              K.set(Q.range, { v: 'y', other: D, wrong: [{ is: Q.fRange, code: CP + 'rng-f', hint: 'That is the range of ' + t('g') + '. ' + t('|g(x)|') + ' is never negative, and it is 0 at the zeros.' }] })],
            keys, t('g') + ': domain ' + t(D) + ', range ' + t(Q.fRange) + '; ' + t('|g|') + ': domain ' + t(D) + ', range ' + t(Q.range),
            t('g') + ' has vertex ' + t(pt(Q.p, Q.q)) + ' and opens ' + opens(Q) + ': range ' + t(Q.fRange) + '. ' + t('y=|g(x)|') + ' has the same domain (no ' + t('x') + '-value changes); it has no negative values and is 0 at the zeros: range ' + t(Q.range) + '.',
            ['Reflecting in the ' + t('x') + '-axis does not change any ' + t('x') + '-values.', 'Use the vertex of ' + t('g') + ' for its range; ' + t('|g|') + ' reaches 0 at the invariant points.'], 'domain and range of g and |g|', [[D, Q.range, D, Q.range], [D, Q.fRange, D, Q.fRange]]);
        })] },

    { num: '3', parts: [
      Pt('3a', 'BEG', function (r) { var z = rootSpec(r, { evenW: true, ex: [{ r: -1, s: 5 }, { r: 1, s: 5 }, { r: -1, s: 3 }, { r: -4, s: 2 }] }), Q = QR(1, z.r, z.s); return featPart(CP, 'Sketch the graph of ' + t('y=' + A(Q.gT)) + '. State its invariant points and its vertex.', Q, ['inv', 'vtx'], { sol: t(Q.gT + '=' + Q.fT) + '. ' + featSol(Q) + wGraph(Q, { pts: Q.inv.concat([Q.vtx]) }) }); }),
      Pt('3b', 'PRG', function (r) { var z = pickWhere(function () { return { a: r.pick([-2, -1, -0.5, -3]), w: r.int(1, 4), p: nz(r, 1, 4) }; }, function (z) { var q = -z.a * z.w * z.w; return q >= 2 && q <= 12 && Number.isInteger(q) && excl(z, [{ a: -2, p: 1, w: 2 }, { a: -0.5, p: -2, w: 4 }]); }); var Q = QV(z.a, z.p, -z.a * z.w * z.w); return featPart(CP, 'Sketch the graph of ' + t('y=' + A(Q.vT)) + '. State its invariant points and its vertex.', Q, ['inv', 'vtx'], { sol: 'Zeros: ' + t('(x' + sgT(-Q.p) + ')^{2}=' + (z.w * z.w)) + ', so ' + t('x=' + nt(Q.p) + '\\pm ' + z.w) + '. ' + featSol(Q) + wGraph(Q, { pts: Q.inv.concat([Q.vtx]) }) }); }),
      Pt('3c', 'BEG', function (r) { var z = pickWhere(function () { return { a: r.pick([1, 2, 0.5]), q: r.int(1, 5), p: nz(r, 1, 4) }; }, function (z) { return excl(z, [{ a: 1, p: -3, q: 2 }, { a: 2, p: 3, q: 1 }]); }); var Q = QV(z.a, z.p, z.q); return featPart(CP, 'Sketch the graph of ' + t('y=' + A(Q.vT)) + '. State its invariant points and its vertex.', Q, ['inv', 'vtx'], { sol: featSol(Q) + ' The graph is ' + t('y=' + Q.vT) + '.' + wGraph(Q, { pts: [Q.vtx] }) }); })] },

    { num: '4', parts: [
      Pt('4a', 'PRG', function (r) { var z = rootSpec(r, { lo: -6, hi: 6, wmin: 2, wmax: 7, smax: 9, ex: [{ r: 3, s: 7 }, { r: -4, s: 2 }, { r: 1, s: 5 }, { r: -1, s: 3 }, { r: 2, s: 5 }] }), Q = QR(1, z.r, z.s); return featPart(CP, 'For ' + t('y=' + A(Q.gT)) + ', state the invariant points, the ' + t('y') + '-intercept, the vertex of the graph and the range. Do not graph.', Q, ['inv', 'yint', 'vtx', 'rng'], { sol: t(Q.gT + '=' + Q.fT) + ': invariant points ' + t(ptsT(Q.inv)) + '. ' + yintWhy(Q) + ' Axis ' + t('x=' + nt(Q.p)) + ', ' + t('f(' + nt(Q.p) + ')=' + nt(Q.q)) + ': vertex ' + t(pt(Q.p, -Q.q)) + '. ' + rangeWhy(Q) }); }),
      Pt('4b', 'PRG', function (r) { var z = pickWhere(function () { var a = r.pick([[-1, 3], [-1, 2], -2, -3]), p = a[1] === 3 ? r.pick([-6, -3, 3, 6]) : a[1] === 2 ? r.pick([-4, -2, 2, 4]) : nz(r, 1, 3); return { a: rv(a), p: p, q: -r.int(1, 5) }; }, function (z) { return excl(z, [{ a: -1 / 3, p: 6, q: -1 }, { a: -3, p: -1, q: -6 }]); }); var Q = QV(z.a, z.p, z.q); return featPart(CP, 'For ' + t('y=' + A(Q.vT)) + ', state the invariant points (if any), the ' + t('y') + '-intercept, the vertex of the graph and the range. Do not graph.', Q, ['inv', 'yint', 'vtx', 'rng']); }),
      Pt('4c', 'PRG', function (r) { var z = pickWhere(function () { return { a: r.pick([2, 3, -2, 4]), k: nz(r, 1, 4) }; }, function (z) { return excl(z, [{ a: 3, k: 2 }]); }); var Q = QR(z.a, Math.min(0, -z.k), Math.max(0, -z.k)); return featPart(CP, 'For ' + t('y=' + A(Q.gT)) + ', state the invariant points, the ' + t('y') + '-intercept, the vertex of the graph and the range. Do not graph.', Q, ['inv', 'yint', 'vtx', 'rng'], { sol: t(Q.gT + '=' + Q.fT) + ': invariant points ' + t(ptsT(Q.inv)) + '. ' + yintWhy(Q) + ' Axis ' + t('x=' + nt(Q.p)) + ', ' + t('f(' + nt(Q.p) + ')=' + nt(Q.q)) + ': vertex ' + t(pt(Q.p, Math.abs(Q.q))) + '. ' + rangeWhy(Q) }); }),
      Pt('4d', 'PRG', function (r) { var z = pickWhere(function () { return { w: r.int(1, 3), p: nz(r, 1, 5) }; }, function (z) { return excl(z, [{ p: -4, w: 1 }, { p: 2, w: 3 }]); }); var Q = QV(-1, z.p, z.w * z.w); return featPart(CP, 'For ' + t('y=' + A(Q.vT)) + ', state the invariant points, the ' + t('y') + '-intercept, the vertex of the graph and the range. Do not graph.', Q, ['inv', 'yint', 'vtx', 'rng'], { sol: 'Zeros: ' + t('x' + sgT(-Q.p) + '=\\pm ' + z.w) + ': invariant points ' + t(ptsT(Q.inv)) + '. ' + yintWhy(Q) + ' Opens down from ' + t(pt(Q.p, Q.q)) + ': the vertex stays, the arms are reflected. ' + rangeWhy(Q) }); })] },

    { num: '5', parts: [Pt('5', 'PRG', function (r) {
      var z = rootSpec(r, { as: [2, 3, 2], lo: -4, hi: 2, wmin: 2, wmax: 6, evenW: true, cmax: 40, ex: [{ a: 2, r: -1, s: 3 }] }), Q = QR(z.a, z.r, z.s), D = '\\{x\\mid x\\in\\mathbb{R}\\}';
      var K0 = 'set', V = ['x', 'y'];
      var fields = [{ label: 'Domain (both)', name: 'domain', mode: 'math', keys: K0, vars: V }, { label: 'Range of ' + t('y=f(x)'), name: 'range of f', mode: 'math', keys: K0, vars: V }, { label: 'Range of ' + t('y=|f(x)|'), name: 'range of |f|', mode: 'math', keys: K0, vars: V },
        { label: t('x') + '-intercepts (both)', name: 'x-intercepts', mode: 'math', keys: K0, vars: V, placeholder: 'e.g. -2, 5' }, { label: t('y') + '-intercept of ' + t('f'), name: 'y-intercept of f', mode: 'math', keys: K0, vars: V }, { label: t('y') + '-intercept of ' + t('|f|'), name: 'y-intercept of |f|', mode: 'math', keys: K0, vars: V },
        { label: 'Vertex of ' + t('y=f(x)'), name: 'vertex of f', mode: 'math', keys: K0, vars: V }, { label: 'Vertex of the middle arc of ' + t('y=|f(x)|'), name: 'vertex of the arc', mode: 'math', keys: K0, vars: V }];
      var keys = [D, Q.fRange, Q.range, nt(z.r) + ',\\ ' + nt(z.s), nt(Q.y0), nt(Q.yint), pt(Q.p, Q.q), pt(Q.p, -Q.q)];
      var checks = [K.set(D, { v: 'x' }), K.set(Q.fRange, { v: 'y', wrong: [{ is: Q.range, code: CP + 'rng-f', hint: 'That is the range of ' + t('|f|') + '.' }] }), K.set(Q.range, { v: 'y', wrong: rngWrongs(CP, Q) }),
        rootsChk(CP, [z.r, z.s], { noNone: true, wrongs: [{ vals: [-z.r, -z.s], code: CP + 'inv-sign', hint: 'Solve ' + t(Q.fT + '=0') + ' again: the signs.' }] }), valChk(CP, Q.y0, [{ v: -Q.y0, code: 'sign', hint: t('f(0)') + ' is the constant term.' }]),
        valChk(CP, Q.yint, [{ v: Q.y0, code: CP + 'yint-neg', hint: 'The absolute value of ' + t(nt(Q.y0)) + ' is positive.' }]), pointChk([Q.p, Q.q], [{ p: [Q.p, -Q.q], code: 'sign', hint: t('f(' + nt(Q.p) + ')') + ' is negative.' }]), pointChk([Q.p, -Q.q], vtxWrongs(CP, Q))];
      return fieldsPart('Let ' + t('f(x)=' + Q.gT) + '. Compare ' + t('y=f(x)') + ' and ' + t('y=|f(x)|') + '.', fields, checks, keys, 'domain ' + t(D) + '; ranges ' + t(Q.fRange) + ' and ' + t(Q.range) + '; ' + t('x') + '-intercepts ' + t(keys[3]) + '; ' + t('y') + '-intercepts ' + t(keys[4]) + ' and ' + t(keys[5]) + '; vertices ' + t(keys[6]) + ' (a minimum) and ' + t(keys[7]) + ' (the highest point of the middle arc)',
        t(Q.gT + '=' + Q.fT) + '; axis ' + t('x=' + nt(Q.p)) + ', ' + t('f(' + nt(Q.p) + ')=' + nt(Q.q)) + '.' + HW.valueTable([['', 'y = f(x)', 'y = |f(x)|'], ['Domain', D, D], ['Range', Q.fRange, Q.range], ['x-intercepts', keys[3], keys[3]], ['y-intercept', keys[4], keys[5]], ['Vertex', keys[6] + '\\text{, a minimum}', keys[7] + '\\text{, top of the middle arc}']]),
        ['Factor ' + t('f') + ' to find the zeros; the axis is halfway between them.', 'The absolute value keeps every ' + t('x') + '-value and makes negative ' + t('y') + '-values positive.'], 'f and |f| compared', [[D, Q.range, Q.range, keys[3], keys[4], keys[5], keys[6], keys[7]], [D, Q.fRange, Q.range, keys[3], keys[4], keys[4], keys[6], keys[6]]]);
    })] },

    { num: '6', parts: [
      Pt('6a', 'PRG', function (r) { var z = rootSpec(r, { lo: -6, hi: 4, wmin: 3, wmax: 9, smax: 7, ex: [{ r: -2, s: 5 }, { r: -3, s: 4 }] }), Q = QR(1, z.r, z.s); return piecePart(CP, 'Write ' + t('y=' + A(Q.gT)) + ' in piecewise form, without absolute value symbols.', Q, { ftex: Q.gT, fac: Q.fT }); }),
      Pt('6b', 'PRG', function (r) { var z = pickWhere(function () { return { m: r.int(2, 7), k: r.int(1, 4) }; }, function (z) { return z.m !== z.k && excl(z, [{ m: 5, k: 2 }, { m: 4, k: 2 }, { m: 16, k: 2 }]) && gcd(z.m, z.k) === 1; }); var Q = QR(-z.k * z.k, -z.m / z.k, z.m / z.k), ft = txAsc(Q.poly); return piecePart(CP, 'Write ' + t('y=' + A(ft)) + ' in piecewise form, without absolute value symbols.', Q, { ftex: ft, fac: '(' + z.m + '-' + (z.k === 1 ? '' : z.k) + 'x)(' + z.m + '+' + (z.k === 1 ? '' : z.k) + 'x)' }); }),
      Pt('6c', 'EMG', function (r) { var h = pickWhere(function () { return nz(r, 1, 6); }, function (h) { return h !== 4; }), Q = QV(1, -h, 0); return onePiecePart(CP, 'Write ' + t('y=' + A(Q.gT)) + ' without absolute value symbols.', Q, Q.gT); }),
      Pt('6d', 'PRG', function (r) { var z = pickWhere(function () { return { h: nz(r, 1, 4), k: r.int(1, 6) }; }, function (z) { return excl(z, [{ h: 2, k: 3 }]); }), Q = QV(-1, z.h, -z.k); return onePiecePart(CP, 'Write ' + t('y=' + A(Q.gT)) + ' without absolute value symbols.', Q, Q.gT); })] },

    { num: '7', parts: [Pt('7', 'EMG', function (r) {
      var z = pickWhere(function () { return { h: nz(r, 1, 5), k: r.int(1, 9) }; }, function (z) { return excl(z, [{ h: 1, k: 4 }, { h: 2, k: 3 }]); }), Q = QV(1, -z.h, z.k), ft = Q.gT;
      return mcPart(r, 'Why can ' + t('y=' + A(ft)) + ' be written without absolute value symbols as a single piece?', [
        { html: t(ft + '=' + Q.vT) + ', so ' + t(ft + '\\ge ' + z.k + '>0') + ' for every ' + t('x') + '.', right: true },
        { html: 'The parabola opens up, so ' + t(ft) + ' is never negative.', why: 'Opening up is not enough: ' + t('x^{2}-4') + ' opens up and is negative between its zeros. What matters is where the vertex is.' },
        { html: 'The constant term ' + t(Q.y0) + ' is positive, so ' + t(ft) + ' is positive.', why: 'A positive constant only means the ' + t('y') + '-intercept is positive. Check the vertex.' },
        { html: 'Its graph has two invariant points, so the bars change nothing.', why: 'Complete the square: ' + t(ft + '=' + Q.vT) + '. Does it ever reach 0?' }],
        'Complete the square: ' + t(ft + '=' + Q.vT) + '. The parabola opens up with vertex ' + t(pt(Q.p, Q.q)) + ', so ' + t(ft + '\\ge ' + z.k + '>0') + ' for every ' + t('x') + ' and ' + t(A(ft) + '=' + ft) + '.', ['Complete the square to find the vertex.', 'An expression that is positive for every ' + t('x') + ' is its own absolute value.'], 'why one piece is enough');
    })] },

    { num: '8', parts: [
      Pt('8a', 'EMG', function (r) {
        var n = pickWhere(function () { return r.int(2, 9); }, function (n) { return n !== 7 && n !== 5; }), kind = r.pick(['ge', 'ge', 'zero', 'mid']), cond = { ge: 'x\\ge ' + n, zero: 'x\\ge 0', mid: '-' + n + '\\le x\\le ' + n }[kind], truth = kind === 'ge';
        return KP.tf(r, 'True or false? ' + t(A('x^{2}-' + n * n) + '=x^{2}-' + n * n) + ' if ' + t(cond) + '.', truth, truth ? 'For ' + t('x\\ge ' + n) + ', ' + t('x^{2}\\ge ' + n * n) + ', so ' + t('x^{2}-' + n * n + '\\ge 0') + '.' : 'Test a value: ' + t('x=' + (kind === 'zero' ? 1 : 0)) + ' gives ' + t('x^{2}-' + n * n + '<0') + ', and then the bars change the sign.',
          truth ? 'True: for ' + t('x\\ge ' + n) + ', ' + t('x^{2}\\ge ' + n * n) + ', so the expression is not negative. (It is also true for ' + t('x\\le -' + n) + '.)' : 'False: for ' + t('-' + n + '<x<' + n) + ', ' + t('x^{2}-' + n * n + '<0') + ' and ' + t(A('x^{2}-' + n * n) + '=' + n * n + '-x^{2}') + '. Correct: ' + t(A('x^{2}-' + n * n) + '=x^{2}-' + n * n) + ' if ' + t('x\\le -' + n) + ' or ' + t('x\\ge ' + n) + '.',
          ['|A| = A exactly when A ≥ 0.', 'Where is ' + t('x^{2}-' + n * n) + ' negative? Between its zeros.'], 'true or false: |x² − n²|');
      }),
      Pt('8b', 'PRG', function (r) {
        var k = pickWhere(function () { return r.int(2, 9); }, function (k) { return k !== 4; }), kind = r.pick(['neg', 'neg', 'in', 'big']), cond = { neg: 'x<0', in: '0\\le x\\le ' + k, big: 'x>' + k }[kind], truth = kind === 'in';
        return KP.tf(r, 'True or false? ' + t(A('x^{2}-' + k + 'x') + '=' + k + 'x-x^{2}') + ' if ' + t(cond) + '.', truth, truth ? 'For ' + t('0\\le x\\le ' + k) + ', ' + t('x^{2}-' + k + 'x=x(x-' + k + ')\\le 0') + ', so the bars change the sign.' : 'Test a value: ' + t('x=' + (kind === 'neg' ? -1 : k + 1)) + ' gives ' + t(A('x^{2}-' + k + 'x') + '=' + (kind === 'neg' ? 1 + k : (k + 1) * (k + 1) - k * (k + 1))) + ', but ' + t(k + 'x-x^{2}') + ' is negative there.',
          truth ? 'True: ' + t('x^{2}-' + k + 'x=x(x-' + k + ')') + ' is negative (or 0) between its zeros 0 and ' + t(k) + ', so ' + t(A('x^{2}-' + k + 'x') + '=-(x^{2}-' + k + 'x)=' + k + 'x-x^{2}') + '.' : 'False: ' + t('x=' + (kind === 'neg' ? -1 : k + 1)) + ' gives ' + t(A('x^{2}-' + k + 'x') + '=' + (kind === 'neg' ? 1 + k : k + 1)) + ' but ' + t(k + 'x-x^{2}=' + (kind === 'neg' ? -(1 + k) : -(k + 1))) + '. It holds for ' + t('0\\le x\\le ' + k) + '.',
          ['Factor: ' + t('x^{2}-' + k + 'x=x(x-' + k + ')') + '. Where is it negative?', 'Test one value from the interval.'], 'true or false: |x² − kx|');
      }),
      Pt('8c', 'PRG', function (r) {
        var z = pickWhere(function () { return { b: r.int(1, 6), c: r.int(2, 15) }; }, function (z) { return excl(z, [{ b: 2, c: 8 }]); }), kind = r.pick(['opp', 'opp', 'mir', 'c']), truth = kind === 'opp';
        var f1 = 'x^{2}-' + (z.b === 1 ? '' : z.b) + 'x-' + z.c, f2 = { opp: z.c + '+' + (z.b === 1 ? '' : z.b) + 'x-x^{2}', mir: 'x^{2}+' + (z.b === 1 ? '' : z.b) + 'x-' + z.c, c: 'x^{2}-' + (z.b === 1 ? '' : z.b) + 'x+' + z.c }[kind];
        return KP.tf(r, 'True or false? The graphs of ' + t('y=' + A(f1)) + ' and ' + t('y=' + A(f2)) + ' are the same.', truth, truth ? t(f2 + '=-(' + f1 + ')') + ', and opposites have equal absolute values.' : 'Try ' + t('x=' + (kind === 'mir' ? 1 : 0)) + ' in both.',
          truth ? 'True: ' + t(f2 + '=-(' + f1 + ')') + ', and a number and its opposite have the same absolute value.' : 'False: ' + t(f2) + ' is not ' + t(f1) + ' or its opposite. At ' + t('x=' + (kind === 'mir' ? 1 : 0)) + ': ' + t(A(f1) + '=' + Math.abs((kind === 'mir' ? 1 : 0) - z.b * (kind === 'mir' ? 1 : 0) - z.c)) + ' but ' + t(A(f2) + '=' + Math.abs(kind === 'mir' ? 1 + z.b - z.c : z.c)) + '.',
          ['Is one expression the opposite of the other?', '|−A| = |A|.'], 'true or false: same graph');
      }),
      Pt('8d', 'EMG', function (r) {
        var kind = r.pick(['two', 'two', 'most', 'least']), truth = kind === 'most', s = { two: 'always has two invariant points', most: 'has at most two invariant points', least: 'always has at least one invariant point' }[kind];
        return KP.tf(r, 'True or false? If ' + t('f') + ' is a quadratic function, the graph of ' + t('y=|f(x)|') + ' ' + s + '.', truth, truth ? 'A parabola meets the ' + t('x') + '-axis at most twice, and only those points are invariant.' : 'Think of a parabola that never meets the ' + t('x') + '-axis, like ' + t('f(x)=x^{2}+1') + (kind === 'two' ? ', or one that only touches it.' : '.'),
          (truth ? 'True' : 'False') + ': the invariant points are the zeros of ' + t('f') + ', so there can be 0 (no zeros, e.g. ' + t('x^{2}+1') + '), 1 (the vertex on the axis, e.g. ' + t('(x-2)^{2}') + ') or 2.', ['How many times can a parabola meet the ' + t('x') + '-axis?'], 'true or false: invariant points');
      })] },

    { num: '9', shared: function (r) { return pickWhere(function () { return { r: r.int(-5, 2), w: r.pick([2, 4, 6]), a: r.pick([1, 1, 0.5, 2]) }; }, function (z) { var h = z.a * z.w * z.w / 4; return z.r + z.w <= 6 && h >= 1 && h <= 9 && excl(z, [{ r: 1, w: 4, a: 1 }]); }); },
      stem: function (o) { var Q = QR(o.a, o.r, o.r + o.w); return 'The graph of ' + t('y=|f(x)|') + ' is shown.' + wGraph(Q, { pts: Q.inv.concat([Q.vtx]) }); },
      parts: [
        Pt('9a', 'ADV', function (r, o) {
          var Q = QR(o.a, o.r, o.r + o.w), h = -Q.q, F1 = QV(o.a, Q.p, -h).poly, F2 = QV(-o.a, Q.p, h).poly, k1 = vtxT(toR(o.a), Q.p, -h), k2 = vtxT(toR(-o.a), Q.p, h), i1 = polyIs(F1), i2 = polyIs(F2);
          var Fb = o.a !== 1 ? QV(1, Q.p, -h).poly : QV(2, Q.p, -h).poly;
          var fields = [{ label: 'Opens up: ' + t('f(x)='), name: 'f opening up', mode: 'math', keys: 'poly', vars: ['x'] }, { label: 'Opens down: ' + t('f(x)='), name: 'f opening down', mode: 'math', keys: 'poly', vars: ['x'] }];
          return fieldsPart('' + t('f') + ' is a quadratic function. Write the two possible equations of ' + t('f') + ' in vertex form.', fields, [K.poly(F1, { expanded: false, wrong: [{ is: F2, code: CP + 'back-other', hint: 'That one opens down. The one that opens up has its vertex below the axis.' }, { is: Fb, code: CP + 'back-a', hint: 'Use a zero to find ' + t('a') + ': ' + t('a(' + nt(o.r) + sgT(-Q.p) + ')^{2}-' + nt(h) + '=0') + '.' }] }), K.poly(F2, { expanded: false, wrong: [{ is: F1, code: CP + 'back-other', hint: 'That one opens up.' }] })],
            [k1, k2], t('f(x)=' + k1) + ' or ' + t('f(x)=' + k2),
            'Invariant points ' + t(ptsT(Q.inv)) + '; middle arc vertex ' + t(pt(Q.p, h)) + '.<br>Opens up: the middle arc was reflected, so the vertex of ' + t('f') + ' is ' + t(pt(Q.p, -h)) + ': ' + t('f(x)=a(x' + sgT(-Q.p) + ')^{2}-' + nt(h)) + ' through ' + t(pt(o.r, 0)) + ': ' + t('a(' + nt((o.r - Q.p) * (o.r - Q.p)) + ')=' + nt(h)) + ', ' + t('a=' + nt(o.a)) + '.<br>Opens down: ' + t('f(x)=' + k2) + ' (the reflection).',
            ['The invariant points are the zeros of ' + t('f') + '; the axis is halfway between them.', 'If ' + t('f') + ' opens up, the arc between the zeros was below the axis: its vertex is the arc vertex reflected.'], 'the two quadratics with this |f|', [[k2, k1], [k1, k1]],
            function (resp) { if (i2(resp[0]) && i1(resp[1])) return wrong(CP + 'back-other', 'Your two equations are in the wrong boxes: the one with a positive ' + t('a') + ' opens up.'); return null; });
        }),
        Pt('9b', 'PRG', function (r, o) { var Q = QR(o.a, o.r, o.r + o.w); return piecePart(CP, 'Write ' + t('y=|f(x)|') + ' in piecewise form, using the equation of ' + t('f') + ' that opens up, ' + t('f(x)=' + Q.vT) + '.', Q, { text: 'piecewise form from the W' }); }),
        Pt('9c', 'MAS', function (r, o) {
          var Q = QR(o.a, o.r, o.r + o.w), g = Q.g, r0 = o.r, s0 = o.r + o.w, w = win(Q), pat = r.pick([[-1, 1, 1], [1, 1, -1], [-1, -1, 1], [1, -1, -1]]);
          var sig = function (x) { return x < r0 ? pat[0] : x <= s0 ? pat[1] : pat[2]; }, wy = [-Math.max(6, Math.ceil(-Q.q) + 2), Math.max(6, Math.ceil(-Q.q) + 2)];
          var gr = function (fn) { return mini({ x: w.x, y: wy, labels: w.labels, fns: [crv(fn)], aria: 'a graph' }); };
          var words = function (s) { return s > 0 ? 'above' : 'below'; };
          return mcPart(r, 'Now suppose ' + t('f') + ' is any continuous function, not necessarily quadratic. Which graph of ' + t('y=f(x)') + ' also gives this graph of ' + t('y=|f(x)|') + '?', [
            { html: gr(function (x) { return sig(x) * g(x); }), right: true },
            { html: gr(function (x) { return 2 * Q.f(x); }), why: 'Take the absolute value of this graph: its middle arc would reach ' + t(nt(-2 * Q.q)) + ', not ' + t(nt(-Q.q)) + '.' },
            { html: gr(function (x) { return g(x) - 1; }), why: 'This graph crosses the ' + t('x') + '-axis at different points, so its absolute value has different invariant points.' },
            { html: gr(function (x) { return g(x - 1); }), why: 'This graph is shifted: its absolute value touches the ' + t('x') + '-axis at different points.' }],
            'On each of the three intervals (' + t('x<' + r0) + ', ' + t(r0 + '<x<' + s0) + ', ' + t('x>' + s0) + ') the graph can be kept or reflected: ' + t('|f(x)|') + ' is the same either way. The right graph is ' + words(pat[0]) + ' the axis for ' + t('x<' + r0) + ', ' + words(pat[1]) + ' it between the zeros and ' + words(pat[2]) + ' it for ' + t('x>' + s0) + '.',
            ['Take the absolute value of each graph in your head: reflect every part below the axis.', 'Which one becomes exactly the W shown?'], 'another f with the same |f|', 2);
        })] },

    { num: '10', shared: function (r) { return pickWhere(function () { return { r: r.int(-6, 0), w: r.pick([4, 6, 8]), a: r.pick([1, 1, 2, 0.5]) }; }, function (z) { var h = z.a * z.w * z.w / 4, c = z.a * z.r * (z.r + z.w); return z.r + z.w > 0 && z.r + z.w <= 6 && h <= 16 && c !== 0 && Number.isInteger(c) && excl(z, [{ r: -4, w: 6, a: 1 }]); }); },
      stem: function (o) { var Q = QR(o.a, o.r, o.r + o.w); return 'A quadratic function ' + t('h') + ' has range ' + t(setT('y\\ge ' + nt(Q.q))) + ', ' + t('x') + '-intercepts ' + t(o.r) + ' and ' + t(o.r + o.w) + ', and ' + t('y') + '-intercept ' + t(nt(Q.y0)) + '.'; },
      parts: [
        Pt('10a', 'PRG', function (r, o) { var Q = QR(o.a, o.r, o.r + o.w); return graphMC(r, CP, Q, 'Which graph is ' + t('y=|h(x)|') + '?', { sol: 'The range starts at ' + t(nt(Q.q)) + ', so ' + t('h') + ' opens up with its minimum ' + t(nt(Q.q)) + ' on the axis halfway between the zeros, ' + t('x=' + nt(Q.p)) + '. The arc between the zeros is reflected: its vertex is ' + t(pt(Q.p, -Q.q)) + '; the ' + t('y') + '-intercept of ' + t('|h|') + ' is ' + t(nt(Q.yint)) + '.' }); }),
        Pt('10b', 'ADV', function (r, o) { var Q = QR(o.a, o.r, o.r + o.w); return featPart(CP, 'State the range of ' + t('y=|h(x)|') + ' and the coordinates of the vertex of its middle arc.', Q, ['rng', 'vtx'], { vtxLabel: 'Vertex of the middle arc', sol: 'The axis is halfway between the zeros: ' + t('x=' + nt(Q.p)) + ', so the vertex of ' + t('h') + ' is ' + t(pt(Q.p, Q.q)) + ', reflected to ' + t(pt(Q.p, -Q.q)) + '. ' + t('|h|') + ' reaches 0 at the zeros: range ' + t(Q.range) + '.', text: 'range and arc vertex of |h| from facts about h' }); }),
        Pt('10c', 'ADV', function (r, o) {
          var Q = QR(o.a, o.r, o.r + o.w), wr = [{ is: P.neg(Q.poly), code: CP + 'back-sign', hint: t('h') + ' has a minimum (its range is ' + t('y\\ge ' + nt(Q.q)) + '), so it opens up: ' + t('a>0') + '.' }];
          if (o.a !== 1) wr.push({ is: P.mul(lin(1, -o.r), lin(1, -o.r - o.w)), code: CP + 'back-a', hint: 'Use the ' + t('y') + '-intercept to find ' + t('a') + ': ' + t('h(0)=a(' + (-o.r) + ')(' + (-o.r - o.w) + ')=' + nt(Q.y0)) + '.' });
          var p = KP.poly('Write an equation for ' + t('h') + '.', Q.poly, { expanded: false, before: 'h(x)=', wrong: wr }, t('h(x)=a(x' + sgT(-o.r) + ')(x' + sgT(-o.r - o.w) + ')') + '; ' + t('h(0)=a(' + (-o.r) + ')(' + (-o.r - o.w) + ')=' + nt(Q.y0)) + ', so ' + t('a=' + nt(o.a)) + ': ' + t('h(x)=' + Q.fT) + ' (or ' + t(Q.vT) + ').',
            ['Use the zeros: ' + t('h(x)=a(x-r)(x-s)') + '.', 'The ' + t('y') + '-intercept gives ' + t('a') + '.'], 'equation of h from its intercepts');
          p.bad = wr.map(function (w) { return tx(w.is); });
          return p;
        })] },

    { num: '11', shared: function (r) { return { p: pickWhere(function () { return nz(r, 1, 5); }, function (p) { return p !== -2; }), m: r.int(2, 9), n: r.int(1, 9), k: r.int(1, 8) }; },
      stem: function (o) { return 'Consider ' + t('f(x)=' + vtxT(1, o.p, 0) + '+q') + '.'; },
      parts: [
        Pt('11a', 'PRG', function (r, o) { var T = setT('q\\ge 0', 'q'); var p = KP.set('For which values of ' + t('q') + ' is the graph of ' + t('y=|f(x)|') + ' identical to the graph of ' + t('y=f(x)') + '?', T, { v: 'q', wrong: [{ is: setT('q>0', 'q'), code: CP + 'k-end', hint: 'When ' + t('q=0') + ' the vertex is on the axis and nothing is below it: the graphs are still identical.' }, { is: setT('q\\le 0', 'q'), code: CP + 'k-dir', hint: 'If ' + t('q<0') + ' the vertex is below the axis, and that part is reflected.' }] },
          'The graphs are identical when no part of ' + t('y=f(x)') + ' is below the ' + t('x') + '-axis. It opens up, so its vertex ' + t('(' + o.p + ',\\ q)') + ' must be on or above the axis: ' + t('q\\ge 0') + '.', ['When does ' + t('|f(x)|=f(x)') + ' for every ' + t('x') + '?', 'Look at the vertex.'], 'q for |f| = f'); p.bad = [setT('q>0', 'q'), setT('q\\le 0', 'q')]; return p; }),
        Pt('11b', 'ADV', function (r, o) { return valPart(CP, 'Determine ' + t('q') + ' if the range of ' + t('y=|f(x)|') + ' is ' + t(setT('y\\ge ' + o.m)) + '.', o.m, [{ v: -o.m, code: CP + 'back-sign', hint: 'The least value is ' + t(o.m) + ', not 0, so the parabola never reaches the axis. It opens up, so it is entirely above it: nothing is reflected.' }],
          'The least value is ' + t(o.m) + ', not 0, so ' + t('f') + ' never reaches the ' + t('x') + '-axis. It opens up, so it lies entirely above the axis and its vertex is ' + t('(' + o.p + ',\\ ' + o.m + ')') + ': ' + t('q=' + o.m) + '.', ['A range starting above 0 means the graph never meets the ' + t('x') + '-axis.'], 'q from the range of |f|', { exact: false }); }),
        Pt('11c', 'PRG', function (r, o) {
          var T = setT('y\\ge 0'), fields = [{ label: 'Range of ' + t('y=|f(x)|'), name: 'range', mode: 'math', keys: 'set', vars: ['y'] }, { label: 'Number of invariant points', name: 'number of invariant points' }];
          return fieldsPart('Let ' + t('q=-' + o.n) + '. State the range of ' + t('y=|f(x)|') + ' and the number of invariant points.', fields, [K.set(T, { v: 'y', wrong: [{ is: setT('y\\ge ' + o.n), code: CP + 'rng-q', hint: 'The vertex ' + t('(' + o.p + ',\\ -' + o.n + ')') + ' is below the axis and the parabola opens up: it crosses the axis, so ' + t('|f(x)|') + ' reaches 0.' }, { is: setT('y\\ge -' + o.n), code: CP + 'rng-f', hint: 'That is the range of ' + t('f') + '.' }] }), numChk(2, [{ v: 0, code: CP + 'inv-none', hint: 'The parabola crosses the ' + t('x') + '-axis.' }, { v: 1, code: CP + 'inv-miss', hint: 'A parabola that crosses the axis meets it twice.' }])],
            [T, '2'], 'range ' + t(T) + '; 2 invariant points', 'The vertex ' + t('(' + o.p + ',\\ -' + o.n + ')') + ' is below the axis and the parabola opens up, so it crosses the axis twice: range ' + t(T) + ', two invariant points.', ['Where is the vertex? Which way does the parabola open?'], 'range and invariant points for q < 0', [[setT('y\\ge ' + o.n), '2'], [T, '0']]);
        }),
        Pt('11d', 'MAS', function (r, o) { return valPart(CP, 'Let ' + t('g(x)=-' + vtxT(1, o.p, 0) + '+k') + '. The range of ' + t('y=|g(x)|') + ' is ' + t(setT('y\\ge ' + o.k)) + '. Determine ' + t('k') + '.', -o.k, [{ v: o.k, code: CP + 'back-sign', hint: 'If ' + t('k=' + o.k) + ', ' + t('g') + ' opens down from a vertex above the axis and crosses it, so ' + t('|g|') + ' would reach 0.' }],
          t('g') + ' opens down, and the least value of ' + t('|g|') + ' is ' + t(o.k) + ', not 0, so ' + t('g') + ' never reaches the axis: it is entirely below it, with vertex ' + t('(' + o.p + ',\\ -' + o.k + ')') + ' reflected to ' + t('(' + o.p + ',\\ ' + o.k + ')') + '. ' + t('k=-' + o.k) + '.', ['A parabola that opens down and never meets the axis is entirely below it.'], 'k from the range of |g|', { exact: false }); })] },

    { num: '12', shared: function (r) { return pickWhere(function () { var a = r.int(2, 5), w = r.pick([4, 6, 8]); return { r: a, s: a + w, X: a + w + r.int(1, 3) }; }, function (z) { return excl(z, [{ r: 4, s: 10, X: 12 }]); }); },
      stem: function (o) { return 'A small business models its monthly profit by ' + t('P(x)=' + tx(P.neg(P.mul(lin(1, -o.r), lin(1, -o.s))))) + ', where ' + t('P') + ' is in hundreds of dollars and ' + t('x') + ' is the number of workshops it runs, ' + t('0\\le x\\le ' + o.X) + '. A negative profit is a loss; the size of the profit or loss is ' + t('|P(x)|') + '.'; },
      parts: [
        Pt('12a', 'PRG', function (r, o) { return rootsPart(CP, 'For which values of ' + t('x') + ' is ' + t('|P(x)|=0') + '?', [o.r, o.s], { noNone: true, wrongs: [{ vals: [-o.r, -o.s], code: CP + 'inv-sign', hint: 'Factor: ' + t('-(x-' + o.r + ')(x-' + o.s + ')=0') + '. Check the signs.' }] }, t('P(x)=-(x-' + o.r + ')(x-' + o.s + ')=0') + ': ' + t('x=' + o.r) + ' and ' + t('x=' + o.s) + ' (break even).', ['|P(x)| = 0 exactly when P(x) = 0.', 'Factor out −1, then factor the trinomial.'], 'break-even points'); }),
        Pt('12b', 'PRG', function (r, o) {
          var f = function (x) { return -(x - o.r) * (x - o.s); }, M0 = Math.max(o.r * o.s, (o.X - o.r) * (o.X - o.s)), Y = Math.ceil((M0 + 2) / 10) * 10;
          var gr = function (fn) { return mini({ x: [-1, o.X + 1], y: [-Y, Y], unitX: 14, unitY: 14 * (o.X + 2) / (2 * Y), labelsX: 2, labelsY: 10, gridY: 5, fns: [{ f: fn, from: 0, to: o.X, start: 'closed', end: 'closed' }], aria: 'a graph on 0 ≤ x ≤ ' + o.X }); };
          return mcPart(r, 'Which graph is ' + t('y=|P(x)|') + ' for ' + t('0\\le x\\le ' + o.X) + '?', [
            { html: gr(function (x) { return Math.abs(f(x)); }), right: true }, { html: gr(f), why: 'That is ' + t('y=P(x)') + ': the losses (below the axis) are not reflected.' },
            { html: gr(function (x) { return -Math.abs(f(x)); }), why: t('|P(x)|') + ' is never negative.' }, { html: gr(function (x) { return -f(x); }), why: 'Only the part below the axis is reflected; the profits stay where they are.' }],
            t('P') + ' is negative for ' + t('x<' + o.r) + ' and ' + t('x>' + o.s) + ' (losses): those parts are reflected upward. The hump between the break-even points stays, with its top at ' + t('(' + (o.r + o.s) / 2 + ',\\ ' + ((o.s - o.r) * (o.s - o.r) / 4) + ')') + '.', ['Reflect the losses (the parts below the axis) upward.'], 'graph of |P| on an interval', 2);
        }),
        Pt('12c', 'ADV', function (r, o) {
          var top = (o.s - o.r) * (o.s - o.r) / 4, L0 = o.r * o.s, LX = (o.X - o.r) * (o.X - o.s), loss = Math.max(L0, LX), other = Math.min(L0, LX), M0 = Math.max(top, loss), T = setT('0\\le y\\le ' + M0);
          var fields = [{ label: 'Greatest profit ($)', name: 'greatest profit' }, { label: 'Greatest loss ($)', name: 'greatest loss' }, { label: 'Range of ' + t('y=|P(x)|'), name: 'range', mode: 'math', keys: 'set', vars: ['y'] }];
          var mny = function (x) { return '\\$' + HW.fmt(x * 100); };
          return fieldsPart('State the greatest profit, the greatest loss (in dollars), and the range of ' + t('y=|P(x)|') + ' for ' + t('0\\le x\\le ' + o.X) + '.', fields,
            [numChk(top * 100, [{ v: top, code: CP + 'unit-hund', hint: t('P') + ' is in <b>hundreds</b> of dollars: multiply by 100.' }]), numChk(loss * 100, [{ v: loss, code: CP + 'unit-hund', hint: t('P') + ' is in <b>hundreds</b> of dollars: multiply by 100.' }, { v: other * 100, code: CP + 'loss-end', hint: 'Compare the losses at both ends of the domain, ' + t('x=0') + ' and ' + t('x=' + o.X) + '.' }]),
              K.set(T, { v: 'y', wrong: [{ is: setT('0\\le y\\le ' + top), code: CP + 'arc-top', hint: 'The top of the hump is not the greatest value of ' + t('|P|') + ' here: look at the ends of the domain.' }, { is: setT('y\\ge 0'), code: CP + 'rng-end', hint: 'The domain is ' + t('0\\le x\\le ' + o.X) + ', so the range has a greatest value.' }] })],
            [String(top * 100), String(loss * 100), T], 'greatest profit ' + t(mny(top)) + ' (' + t(String((o.r + o.s) / 2)) + ' workshops); greatest loss ' + t(mny(loss)) + '; range ' + t(T),
            'Vertex ' + t('(' + (o.r + o.s) / 2 + ',\\ ' + top + ')') + ': greatest profit ' + t(mny(top)) + ' at ' + t((o.r + o.s) / 2) + ' workshops.<br>' + t('P(0)=' + (-L0)) + ', ' + t('P(' + o.X + ')=' + (-LX)) + ': greatest loss ' + t(mny(loss)) + ' at ' + t('x=' + (L0 >= LX ? 0 : o.X)) + '.<br>Range ' + t(T) + '.',
            ['The greatest profit is at the vertex; the greatest loss is at an end of the domain.', 'Remember the units: hundreds of dollars.'], 'profit and loss with |P|', [[String(top), String(loss), T], [String(top * 100), String(loss * 100), setT('0\\le y\\le ' + top)]]);
        })] },

    { num: '13', parts: [Pt('13', 'PRG', function (r) {
      var z = pickWhere(function () { var r1 = r.int(-4, 1), w = r.pick([4, 6]), x0 = r.int(-6, 6); return { r: r1, s: r1 + w, x0: x0, y0: -r.int(3, 12) }; }, function (z) {
        if (z.x0 === z.r || z.x0 === z.s || z.x0 === 0 || z.x0 === -z.y0 || !excl(z, [{ r: -1, s: 5, x0: -3, y0: -10 }])) return false;
        var a = z.y0 / ((z.x0 - z.r) * (z.x0 - z.s)), g = function (x) { return Math.abs(a * (x - z.r) * (x - z.s)); }, on = function (x, y) { return y >= 0 && Math.abs(g(x) - y) < 1e-9; };
        return !on(-z.x0, z.y0) && !on(-z.y0, z.x0) && !on(-z.x0, -z.y0);
      });
      var X = z.x0, Y = z.y0, ok0 = '(' + X + ',\\ ' + (-Y) + ')';
      return mcPart(r, 'The graph of ' + t('y=f(x)') + ', a parabola, passes through ' + t('(' + X + ',\\ ' + Y + ')') + ' and has ' + t('x') + '-intercepts ' + t(z.r) + ' and ' + t(z.s) + '. Which point must be on the graph of ' + t('y=|f(x)|') + '?', [
        { html: t(ok0), right: true }, { html: t('(' + (-X) + ',\\ ' + Y + ')'), why: 'Reflecting in the ' + t('x') + '-axis keeps the ' + t('x') + '-value and changes the sign of the ' + t('y') + '-value.' },
        { html: t('(' + (-Y) + ',\\ ' + X + ')'), why: 'The coordinates are swapped. Keep ' + t('x') + ' and take the absolute value of ' + t('y') + '.' }, { html: t('(' + (-X) + ',\\ ' + (-Y) + ')'), why: 'The ' + t('x') + '-value does not change.' }],
        'The point is below the axis, so it is reflected: the ' + t('x') + '-value stays and the ' + t('y') + '-value becomes ' + t(A(Y) + '=' + (-Y)) + '. ' + t(ok0) + '.', ['Reflection in the ' + t('x') + '-axis: ' + t('(x,\\ y)\\to(x,\\ -y)') + '.'], 'a point on |f|');
    })] },

    { num: '14', parts: [Pt('14', 'PRG', function (r) {
      var z = pickWhere(function () { return { a: r.pick([-2, -3, -1, -0.5, 2, 3]), p: nz(r, 1, 6), q: r.int(1, 9) }; }, function (z) { return excl(z, [{ a: -2, p: 3, q: 4 }, { a: -3, p: -1, q: 6 }]); }), below = z.a < 0, Q = QV(z.a, z.p, below ? -z.q : z.q);
      return mcPart(r, 'The range of ' + t('y=' + A(Q.vT)) + ' is', [
        { html: t(setT('y\\ge ' + z.q)), right: true }, { html: t(setT('y\\ge 0')), why: 'This parabola never reaches the ' + t('x') + '-axis (vertex ' + t(pt(Q.p, Q.q)) + ', opening ' + opens(Q) + '), so ' + t('|f(x)|') + ' is never 0.' },
        { html: t(below ? setT('y\\le -' + z.q) : setT('y\\le ' + z.q)), why: below ? 'That is the range of the parabola itself. Its absolute value has no negative values.' : 'The parabola opens up: its values go up from the vertex.' }, { html: t(setT('y\\ge -' + z.q)), why: 'An absolute value is never negative, and this graph never reaches 0.' }],
        below ? 'The parabola opens down with vertex ' + t(pt(Q.p, Q.q)) + ', so it is entirely below the axis. Reflected, its vertex is ' + t(pt(Q.p, -Q.q)) + ' and it opens up: range ' + t(setT('y\\ge ' + z.q)) + '.' : 'The parabola opens up with vertex ' + t(pt(Q.p, Q.q)) + ' above the axis, so nothing changes: range ' + t(setT('y\\ge ' + z.q)) + '.', ['Is the parabola entirely above, entirely below, or crossing the axis?'], 'range of |a(x − p)² + q|');
    })] },

    { num: '15', parts: [Pt('15', 'ADV', function (r) {
      var h = nz(r, 1, 5), k = r.int(2, 9), c = r.int(2, 9);
      var F = [
        { html: 'If a quadratic ' + t('y=f(x)') + ' has no ' + t('x') + '-intercepts, then ' + t('y=|f(x)|') + ' has the same graph as ' + t('y=f(x)') + '.', sol: 'A parabola with no ' + t('x') + '-intercepts that opens down is entirely below the axis, and its whole graph is reflected (e.g. ' + t('f(x)=-x^{2}-1') + ').' },
        { html: 'If ' + t('f') + ' is quadratic, the range of ' + t('y=|f(x)|') + ' is always ' + t(setT('y\\ge 0')) + '.', sol: 'A parabola that never meets the axis gives a range that starts above 0 (e.g. ' + t('|x^{2}+' + k + '|') + ' has range ' + t('y\\ge ' + k) + ').' },
        { html: 'If a quadratic ' + t('y=f(x)') + ' has vertex ' + t('(' + h + ',\\ -' + k + ')') + ' and opens down, then the range of ' + t('y=|f(x)|') + ' is ' + t(setT('y\\ge 0')) + '.', sol: 'That parabola is entirely below the axis: reflected, its range is ' + t(setT('y\\ge ' + k)) + '.' }];
      var Tr = [
        { html: 'If ' + t('y=f(x)') + ' has ' + t('y') + '-intercept ' + t(-c) + ', then ' + t('y=|f(x)|') + ' has ' + t('y') + '-intercept ' + t(c) + '.' },
        { html: 'If a quadratic ' + t('y=f(x)') + ' has vertex ' + t('(' + h + ',\\ -' + k + ')') + ' and opens up, then ' + t('y=|f(x)|') + ' has the point ' + t('(' + h + ',\\ ' + k + ')') + '.' },
        { html: 'The domain of ' + t('y=|f(x)|') + ' is the same as the domain of ' + t('y=f(x)') + '.' },
        { html: 'The invariant points of ' + t('y=|f(x)|') + ' are the ' + t('x') + '-intercepts of ' + t('y=f(x)') + '.' }];
      var fz = r.pick(F), trs = r.sample(Tr, 3);
      return mcPart(r, 'Which statement is <b>false</b>?', [{ html: fz.html, right: true }].concat(trs.map(function (s) { return { html: s.html, why: 'That one is true. Look for a counterexample to each statement.' }; })),
        'This one is false: ' + fz.sol + ' The other three are true.', ['Test each statement with a parabola that opens down and never meets the axis.'], 'which statement is false');
    })] },

    { num: '16', parts: [Pt('16', 'PRG', function (r) {
      var z = rootSpec(r, { evenW: true, lo: -6, hi: 3, wmin: 4, wmax: 10, smax: 8, cmax: 40, ex: [{ r: -3, s: 5 }, { r: -4, s: 2 }, { r: 1, s: 5 }] }), Q = QR(1, z.r, z.s), v = -Q.q;
      return KP.nr('The graph of ' + t('y=' + A(Q.gT)) + ' has a middle arc between its invariant points. The ' + t('y') + '-coordinate of the vertex of this arc is ____.', v, function (x) { return x === -v ? { code: CP + 'vtx-noreflect', hint: 'The vertex of the parabola is below the axis; the arc is reflected, so its top is positive.' } : x === Math.abs(Q.y0) && Math.abs(Q.y0) !== v ? { code: 'value', hint: 'That is the ' + t('y') + '-intercept. Find the vertex: the axis is halfway between the zeros.' } : null; },
        t(Q.gT + '=' + Q.fT) + ': axis ' + t('x=' + Q.p) + ', ' + t('f(' + Q.p + ')=' + Q.q) + ', reflected to ' + t(pt(Q.p, v)) + '. The answer is ' + t(v) + '.', ['Factor to find the zeros; the axis of symmetry is halfway between them.'], 'NR: top of the middle arc');
    })] },

    { num: '17', parts: [Pt('17', 'MAS', function (r) {
      var z = rootSpec(r, { evenW: true, lo: -5, hi: 4, wmin: 2, wmax: 8, smax: 8, cmax: 40, ex: [{ r: 2, s: 6 }, { r: 1, s: 5 }] }), Q = QR(1, z.r, z.s), v = -Q.q;
      return KP.nr('The horizontal line ' + t('y=k') + ' meets the graph of ' + t('y=' + A(Q.gT)) + ' at exactly three points. The value of ' + t('k') + ' is ____.', v, function (x) { return x === -v ? { code: CP + 'vtx-noreflect', hint: 'The vertex ' + t(pt(Q.p, Q.q)) + ' is reflected to ' + t(pt(Q.p, v)) + '.' } : x === 0 ? { code: CP + 'cnt-zero', hint: t('y=0') + ' meets the graph only at the two invariant points.' } : null; },
        t(Q.gT + '=' + Q.fT) + ': vertex ' + t(pt(Q.p, Q.q)) + ' reflects to ' + t(pt(Q.p, v)) + '. The line ' + t('y=' + v) + ' touches the top of the middle arc once and crosses each outer arm once: three points. ' + t('k=' + v) + '.', ['Picture the W: two outer arms and a middle arc.', 'A horizontal line meets the W three times only at the height of the top of the arc.'], 'NR: the line meeting the W three times');
    })] }
  ];

  /* ======================================================================================================
   * Extra practice
   * ====================================================================================================== */
  var EXTRA = [
    { num: 'A1', section: 'A. Skills', parts: [
      Pt('eA1a', 'BEG', function (r) { var z = pickWhere(function () { return { a: r.pick([1, 1, 2, 0.5]), p: nz(r, 1, 4), w: r.pick([1, 2]) }; }, function (z) { return z.a * z.w * z.w <= 5 && excl(z, [{ a: 1, p: -2, w: 1 }]); }), Q = QV(z.a, z.p, -z.a * z.w * z.w); return graphMC(r, CP, Q, 'The graph of ' + t('y=f(x)') + ' is shown. Which graph is ' + t('y=|f(x)|') + '?' + fGraph(Q, { max: 240 })); }),
      Pt('eA1b', 'BEG', function (r) { var z = pickWhere(function () { return { a: r.pick([-0.5, -1, -2]), p: nz(r, 1, 3), q: -r.int(1, 3) }; }, function (z) { return excl(z, [{ a: -0.5, p: 2, q: -1 }]); }), Q = QV(z.a, z.p, z.q); return graphMC(r, CP, Q, 'The graph of ' + t('y=f(x)') + ' is shown. Which graph is ' + t('y=|f(x)|') + '?' + fGraph(Q, { max: 240 })); }),
      Pt('eA1c', 'PRG', function (r) { var z = rootSpec(r, { as: [-1], lo: -4, hi: 1, wmin: 2, wmax: 4, smax: 4, evenW: true, ex: [{ r: -1, s: 3 }] }), Q = QR(-1, z.r, z.s); return graphMC(r, CP, Q, 'The graph of ' + t('y=' + Q.gT) + ' is shown. Which graph is ' + t('y=' + A(Q.gT)) + '?' + fGraph(Q, { max: 240 })); })] },
    { num: 'A2', parts: [
      Pt('eA2a', 'BEG', function (r) { var z = rootSpec(r, { evenW: true, lo: -5, hi: 2, wmin: 2, wmax: 6, smax: 5, ex: [{ r: -3, s: 1 }, { r: -1, s: 3 }] }), Q = QR(1, z.r, z.s); return featPart(CP, 'Sketch the graph of ' + t('y=' + A(Q.gT)) + '. State its invariant points, its vertex and its ' + t('y') + '-intercept.', Q, ['inv', 'vtx', 'yint'], { sol: t(Q.gT + '=' + Q.fT) + '. ' + featSol(Q) + ' ' + yintWhy(Q) + wGraph(Q, { pts: Q.inv.concat([Q.vtx]) }) }); }),
      Pt('eA2b', 'PRG', function (r) { var z = pickWhere(function () { return { w: r.int(1, 3), p: nz(r, 1, 5), k: r.int(1, 2) }; }, function (z) { return excl(z, [{ p: 3, w: 1, k: 1 }]); }); var Q = QV(-z.k, z.p, z.k * z.w * z.w); return featPart(CP, 'Sketch the graph of ' + t('y=' + A(Q.vT)) + '. State its invariant points, its vertex and its ' + t('y') + '-intercept.', Q, ['inv', 'vtx', 'yint'], { sol: featSol(Q) + ' ' + yintWhy(Q) + wGraph(Q, { pts: Q.inv.concat([Q.vtx]) }) }); })] },
    { num: 'A3', parts: [
      Pt('eA3a', 'PRG', function (r) { var z = rootSpec(r, { lo: -6, hi: 6, wmin: 1, wmax: 5, smax: 8, ex: [{ r: 2, s: 5 }, { r: 3, s: 7 }] }), Q = QR(1, z.r, z.s); return featPart(CP, 'For ' + t('y=' + A(Q.gT)) + ', state the invariant points (if any), the ' + t('y') + '-intercept, the vertex of the graph and the range.', Q, ['inv', 'yint', 'vtx', 'rng'], { sol: t(Q.gT + '=' + Q.fT) + ': invariant points ' + t(ptsT(Q.inv)) + '. ' + yintWhy(Q) + ' ' + t('f(' + nt(Q.p) + ')=' + nt(Q.q)) + ': vertex ' + t(pt(Q.p, -Q.q)) + '. ' + rangeWhy(Q) }); }),
      Pt('eA3b', 'PRG', function (r) { var z = pickWhere(function () { return { a: r.pick([2, 3, 4, 0.5]), p: nz(r, 1, 4), q: r.int(1, 6) }; }, function (z) { return excl(z, [{ a: 4, p: -1, q: 3 }, { a: 2, p: 3, q: 1 }]); }); var Q = QV(z.a, z.p, z.q); return featPart(CP, 'For ' + t('y=' + A(Q.vT)) + ', state the invariant points (if any), the ' + t('y') + '-intercept, the vertex of the graph and the range.', Q, ['inv', 'yint', 'vtx', 'rng']); }),
      Pt('eA3c', 'PRG', function (r) { var z = pickWhere(function () { return { a: r.pick([-1, -2, -1]), p: nz(r, 1, 6), q: -r.int(1, 6) }; }, function (z) { return excl(z, [{ a: -1, p: 5, q: -2 }, { a: -1, p: 1, q: -2 }]); }); var Q = QV(z.a, z.p, z.q); return featPart(CP, 'For ' + t('y=' + A(Q.vT)) + ', state the invariant points (if any), the ' + t('y') + '-intercept, the vertex of the graph and the range.', Q, ['inv', 'yint', 'vtx', 'rng']); })] },
    { num: 'A4', parts: [
      Pt('eA4a', 'PRG', function (r) { var z = rootSpec(r, { lo: -7, hi: 3, wmin: 3, wmax: 10, smax: 6, cmax: 36, ex: [{ r: -5, s: 4 }, { r: -2, s: 5 }, { r: -3, s: 4 }] }), Q = QR(1, z.r, z.s); return piecePart(CP, 'Write ' + t('y=' + A(Q.gT)) + ' in piecewise form, without absolute value symbols.', Q, { ftex: Q.gT, fac: Q.fT }); }),
      Pt('eA4b', 'PRG', function (r) { var k = pickWhere(function () { return r.int(2, 12); }, function (k) { return k !== 9; }), Q = QR(-1, 0, k), ft = txAsc(Q.poly); return piecePart(CP, 'Write ' + t('y=' + A(ft)) + ' in piecewise form, without absolute value symbols.', Q, { ftex: ft, fac: 'x(' + k + '-x)' }); }),
      Pt('eA4c', 'EMG', function (r) { var z = pickWhere(function () { return { a: r.pick([1, 2, 3, 5]), c: r.int(1, 9) }; }, function (z) { return excl(z, [{ a: 2, c: 3 }]); }), Q = QV(z.a, 0, z.c); return onePiecePart(CP, 'Write ' + t('y=' + A(Q.gT)) + ' without absolute value symbols.', Q, Q.gT); })] },
    { num: 'B5', section: 'B. Applying', parts: [Pt('eB5', 'ADV', function (r) {
      var z = pickWhere(function () { var r1 = r.int(-5, 1), w = r.pick([2, 4, 6]); return { r: r1, w: w, a: r.pick([0.5, 1, 2, 0.25]) }; }, function (z) { var h = z.a * z.w * z.w / 4; return z.r + z.w <= 5 && h >= 1 && h <= 9 && excl(z, [{ r: -3, w: 4, a: 0.5 }]); });
      var Q = QR(z.a, z.r, z.r + z.w), F1 = Q.poly, F2 = P.neg(Q.poly), aT = nt(z.a), k1 = facT(toR(z.a), z.r, z.r + z.w), k2 = facT(toR(-z.a), z.r, z.r + z.w), i1 = polyIs(F1), i2 = polyIs(F2);
      var base = P.mul(lin(1, -z.r), lin(1, -z.r - z.w)), wa = z.a === 1 ? P.scale(base, 2) : base;
      var c1 = K.poly(F1, { expanded: false }), c2 = K.poly(F2, { expanded: false });
      var fields = [{ label: t('f(x)='), name: 'first f', mode: 'math', keys: 'poly', vars: ['x'] }, { label: 'or ' + t('f(x)='), name: 'second f', mode: 'math', keys: 'poly', vars: ['x'] }];
      return fieldsPart('The graph of ' + t('y=|f(x)|') + ' is shown, where ' + t('f') + ' is a quadratic function. Write the two possible equations of ' + t('f') + ' in factored form.' + wGraph(Q, { pts: Q.inv.concat([Q.vtx]) }), fields, [c1, c2], [k1, k2], t('f(x)=' + k1) + ' or ' + t('f(x)=' + k2),
        'Invariant points ' + t(ptsT(Q.inv)) + '; middle arc vertex ' + t(pt(Q.p, -Q.q)) + '.<br>' + t('f(x)=a' + facT(1, z.r, z.r + z.w)) + ' with ' + t('f(' + nt(Q.p) + ')=a(' + nt(Q.p - z.r) + ')(' + nt(Q.p - z.r - z.w) + ')=' + nt(-(z.w * z.w) / 4) + 'a') + '.<br>' + t(nt(-(z.w * z.w) / 4) + 'a=\\pm ' + nt(-Q.q)) + ', so ' + t('a=\\pm ' + aT) + ': ' + t('f(x)=' + k1) + ' or ' + t('f(x)=' + k2) + '.',
        ['The invariant points are the zeros: ' + t('f(x)=a(x-r)(x-s)') + '.', 'At the axis, ' + t('|f|') + ' equals the height of the arc: that gives ' + t('a') + ' up to its sign.'], 'two quadratics from the W', [[k1, k1], [tx(wa), tx(P.neg(wa))]],
        function (resp) {
          var a1 = i1(resp[0]), a2 = i2(resp[0]), b1 = i1(resp[1]), b2 = i2(resp[1]);
          if ((a1 && b2) || (a2 && b1)) return ok();
          if ((a1 || a2) && (b1 || b2)) return wrong(CP + 'back-one', 'You gave the same function twice. The other one opens the other way: change the sign of ' + t('a') + '.');
          if ((a1 || a2) && !String(resp[1] || '').trim()) return null;
          if (polyIs(wa)(resp[0]) || polyIs(P.neg(wa))(resp[0]) || polyIs(wa)(resp[1]) || polyIs(P.neg(wa))(resp[1])) return wrong(CP + 'back-a', 'Use the top of the arc to find ' + t('a') + ': at ' + t('x=' + nt(Q.p)) + ', ' + t('|f(x)|=' + nt(-Q.q)) + '.');
          if (a1 || a2) return wrong('value', '<b>first f:</b> right. <b>second f:</b> the other one has the same zeros and opens the other way.');
          if (b1 || b2) return wrong('value', '<b>second f:</b> right. <b>first f:</b> the other one has the same zeros and opens the other way.');
          return wrong('value', null);
        });
    })] },
    { num: 'B6', parts: [Pt('eB6', 'ADV', function (r) {
      var z = pickWhere(function () { return { a: r.pick([0.5, 1, 2, 0.25]), p: nz(r, 1, 4), w: r.int(1, 5) }; }, function (z) { var m = z.a * z.w * z.w, c = z.a * z.p * z.p - m; return Number.isInteger(m) && m >= 2 && m <= 16 && Number.isInteger(c) && c !== 0 && Math.abs(c) <= 20 && Math.abs(z.p) !== z.w && excl(z, [{ a: 0.5, p: 2, w: 4 }]); });
      var m = z.a * z.w * z.w, Q = QV(z.a, z.p, -m), c = Q.y0;
      return featPart(CP, 'A quadratic function ' + t('g') + ' opens up, has vertex ' + t(pt(z.p, -m)) + ' and passes through ' + t('(0,\\ ' + nt(c) + ')') + '. Without graphing, state the invariant points, the ' + t('y') + '-intercept, the vertex of the middle arc and the range of ' + t('y=|g(x)|') + '.', Q, ['inv', 'yint', 'vtx', 'rng'], { vtxLabel: 'Vertex of the middle arc',
        sol: t('g(x)=a(x' + sgT(-z.p) + ')^{2}-' + m) + ': ' + t('g(0)=' + (z.p * z.p) + 'a-' + m + '=' + nt(c)) + ', so ' + t('a=' + nt(z.a)) + '.<br>Zeros: ' + t(nt(z.a) + '(x' + sgT(-z.p) + ')^{2}=' + m + '\\Rightarrow (x' + sgT(-z.p) + ')^{2}=' + (z.w * z.w)) + ', ' + t('x=' + nt(z.p - z.w)) + ' or ' + t(nt(z.p + z.w)) + '. Invariant points ' + t(ptsT(Q.inv)) + '.<br>' + yintWhy(Q) + ' Middle arc vertex ' + t(pt(z.p, m)) + '; range ' + t(Q.range) + '.', text: 'features of |g| from the vertex and a point' });
    })] },
    { num: 'B7', shared: function (r) { return pickWhere(function () { var b = r.pick([10, 20, 15]); return { b: b, T: b / 5 + r.int(1, 2), Dk: r.pick(['top', 'low', 'mid']) }; }, function (z) { return excl(z, [{ b: 10, T: 3 }]); }); },
      stem: function (o) { return 'A ball is thrown upward from the edge of a cliff. Its height relative to the cliff top is ' + t('h(t)=-5t^{2}+' + o.b + 't') + ' metres after ' + t('t') + ' seconds, ' + t('0\\le t\\le ' + o.T) + ' (negative values are below the cliff top). Its distance from the level of the cliff top is ' + t('d(t)=|h(t)|') + '.'; },
      parts: [
        Pt('eB7a', 'PRG', function (r, o) { return rootsPart(CP, 'At what times is ' + t('d(t)=0') + '?', [0, o.b / 5], { v: 't', noNone: true, wrongs: [{ vals: [o.b / 5], code: CP + 'sol-missing', hint: 'The ball also starts at the level of the cliff top: ' + t('t=0') + '.' }] }, t('-5t(t-' + o.b / 5 + ')=0') + ': ' + t('t=0') + ' s and ' + t('t=' + o.b / 5) + ' s.', ['d(t) = 0 exactly when h(t) = 0. Factor out −5t.'], 'times at the cliff-top level'); }),
        Pt('eB7b', 'ADV', function (r, o) {
          var tp = o.b / 10, top = o.b * o.b / 20, hT = -5 * o.T * o.T + o.b * o.T, Mx = Math.max(top, -hT), T = setT('0\\le d\\le ' + nt(Mx), 'd');
          var p = KP.set('State the range of ' + t('d') + ' for ' + t('0\\le t\\le ' + o.T) + '.', T, { v: 'd', wrong: [{ is: setT('0\\le d\\le ' + nt(top), 'd'), code: CP + 'arc-top', hint: 'The top of the throw is not the greatest distance: check the end of the domain, ' + t('t=' + o.T) + '.' }, { is: setT(nt(hT) + '\\le d\\le ' + nt(top), 'd'), code: CP + 'rng-f', hint: 'That is the range of ' + t('h') + '. A distance is never negative.' }, { is: setT('d\\ge 0', 'd'), code: CP + 'rng-end', hint: 'The domain is ' + t('0\\le t\\le ' + o.T) + ', so there is a greatest distance.' }] },
            'Vertex ' + t('(' + nt(tp) + ',\\ ' + nt(top) + ')') + '; ' + t('h(' + o.T + ')=' + nt(hT)) + ', so ' + t('d(' + o.T + ')=' + nt(-hT)) + '. ' + t('d') + ' is 0 at ' + t('t=0') + ': range ' + t(T) + '.', ['Find the top of the throw (the vertex) and the value at the end of the domain.'], 'range of d on an interval');
          p.bad = [setT('0\\le d\\le ' + nt(top), 'd'), setT('d\\ge 0', 'd')]; return p;
        }),
        Pt('eB7c', 'ADV', function (r, o) {
          var top = o.b * o.b / 20, hT = -5 * o.T * o.T + o.b * o.T, D = o.Dk === 'top' && Number.isInteger(top) ? top : o.Dk === 'low' ? r.int(1, Math.floor(top) - 1) : Math.min(-hT - 1, Math.floor(top) + r.int(1, 6));
          if (D < 1) D = 1;
          var up = qroots(5, -o.b, D).filter(function (x) { return x.v >= -1e-9 && x.v <= o.T + 1e-9; }), dn = qroots(5, -o.b, -D).filter(function (x) { return x.v >= -1e-9 && x.v <= o.T + 1e-9; });
          var allR = qroots(5, -o.b, -D), out = allR.filter(function (x) { return x.v < -1e-9 || x.v > o.T + 1e-9; });
          var all = up.concat(dn).sort(function (a, b) { return a.v - b.v; });
          var wr = []; if (up.length && dn.length) { wr.push({ vals: up, code: CP + 'ball-one', hint: 'The ball is also ' + t(D) + ' m <b>below</b> the cliff top: solve ' + t('h(t)=-' + D) + ' too.' }); wr.push({ vals: dn, code: CP + 'ball-one', hint: 'The ball is also ' + t(D) + ' m <b>above</b> the cliff top: solve ' + t('h(t)=' + D) + ' too.' }); }
          if (out.length) wr.push({ vals: all.concat(out), code: CP + 'ball-out', hint: 'Keep only the times in the domain ' + t('0\\le t\\le ' + o.T) + '.' });
          var fmt2 = function (x) { return x.v.toFixed(2); };
          var sol = t('h=' + D) + ': ' + t('5t^{2}-' + o.b + 't+' + D + '=0') + (up.length ? ', ' + up.map(function (x) { return t('t=' + x.tex + (Math.abs(x.v - Math.round(x.v * 100) / 100) > 1e-9 ? '\\approx ' + fmt2(x) : '')); }).join(', ') : ': no real solution (the ball never goes that high)') + '.<br>' + t('h=-' + D) + ': ' + t('5t^{2}-' + o.b + 't-' + D + '=0') + ', ' + allR.map(function (x) { return t('t=' + x.tex + '\\approx ' + fmt2(x)); }).join(', ') + (out.length ? '; only ' + dn.map(function (x) { return t(fmt2(x)); }).join(', ') + ' is in the domain' : '') + '.<br>At ' + all.map(function (x) { return t(fmt2(x)); }).join(', ') + ' s.';
          return rootsPart(CP, 'At what times is the ball ' + t(D) + ' m from the level of the cliff top? Round to the nearest hundredth if needed.', all, { v: 't', round: true, noNone: true, wrongs: wr, keyTex: all.map(function (x) { return 't=' + x.tex; }).join(',\\ '), answer: t(all.map(function (x) { return 't' + (Math.abs(x.v - Math.round(x.v * 100) / 100) > 1e-9 ? '\\approx ' : '=') + fmt2(x); }).join(',\\ ')) + ' s' }, sol,
            ['Solve ' + t('|h(t)|=' + D) + ': ' + t('h(t)=' + D) + ' or ' + t('h(t)=-' + D) + '.', 'Use the quadratic formula (or a graphing calculator); keep only the times in the domain.'], 'times at a given distance');
        })] },
    { num: 'B8', parts: [Pt('eB8', 'PRG', function (r) {
      var h = nz(r, 1, 4), k = r.int(1, 4), r1 = r.int(-4, 1), w = r.int(2, 5), q = r.int(1, 6);
      var none = '-x^{2}' + (2 * h > 0 ? '+' : '') + (2 * h) + 'x-' + (h * h + k), touch = tx(QV(1, h, 0).poly), cross = tx(QR(1, r1, r1 + w).poly), cross2 = '-x^{2}' + (q > 0 ? '+' : '') + q + 'x';
      return mcPart(r, 'Which function’s graph has <b>no</b> invariant points?', [
        { html: t('y=' + A(none)), right: true }, { html: t('y=' + A(touch)), why: 'This parabola touches the ' + t('x') + '-axis at its vertex: one invariant point.' },
        { html: t('y=' + A(cross)), why: 'This one factors: it crosses the axis twice.' }, { html: t('y=' + A(cross2)), why: t('x(' + q + '-x)') + ' has zeros 0 and ' + t(q) + '.' }],
        t(none + '=-(x' + sgT(-h) + ')^{2}-' + k + '<0') + ' for every ' + t('x') + ', so that parabola never meets the axis. (The perfect square touches at ' + t('(' + h + ',\\ 0)') + '; the other two cross twice.)', ['Invariant points are the zeros of the expression inside the bars.', 'Complete the square for each.'], 'no invariant points');
    })] },
    { num: 'B9', parts: [Pt('eB9', 'PRG', function (r) {
      var z = rootSpec(r, { as: [2, 3], evenW: true, lo: -4, hi: 3, wmin: 2, wmax: 6, smax: 6, cmax: 60, ex: [{ a: 2, r: 1, s: 5 }] }), Q = QR(z.a, z.r, z.s), v = -Q.q;
      return KP.nr('The ' + t('y') + '-coordinate of the vertex of the middle arc of the graph of ' + t('y=' + A(Q.gT)) + ' is ____.', v, function (x) { return x === -v ? { code: CP + 'vtx-noreflect', hint: 'The arc between the zeros is reflected, so its top is positive.' } : x === v / z.a ? { code: CP + 'back-a', hint: 'Keep the factor ' + t(z.a) + ': ' + t(Q.gT + '=' + Q.fT) + '.' } : null; },
        t(Q.fT) + ': axis ' + t('x=' + Q.p) + ', ' + t('f(' + Q.p + ')=' + Q.q) + ', reflected to ' + t(pt(Q.p, v)) + '.', ['Factor; the axis is halfway between the zeros.'], 'NR: arc vertex of |ax² + bx + c|');
    })] },
    { num: 'C10', section: 'C. Stretch', parts: [Pt('eC10', 'MAS', function (r) {
      var z = rootSpec(r, { evenW: true, lo: -5, hi: 4, wmin: 2, wmax: 6, smax: 7, cmax: 40, ex: [{ r: 1, s: 5 }, { r: 2, s: 6 }] }), Q = QR(1, z.r, z.s), h = -Q.q;
      var fields = [{ label: t('k<0') + ':', name: 'k < 0' }, { label: t('k=0') + ':', name: 'k = 0' }, { label: t('0<k<' + h) + ':', name: '0 < k < ' + h }, { label: t('k=' + h) + ':', name: 'k = ' + h }, { label: t('k>' + h) + ':', name: 'k > ' + h }];
      var keys = ['0', '2', '4', '3', '2'];
      return fieldsPart('How many times does the line ' + t('y=k') + ' meet the graph of ' + t('y=' + A(Q.gT)) + '? Answer for every value of ' + t('k') + '.', fields,
        [numChk(0, [{ v: 2, code: CP + 'cnt-neg', hint: 'The graph is never below the ' + t('x') + '-axis.' }]), numChk(2, [{ v: 1, code: CP + 'cnt-zero', hint: t('y=0') + ' meets the graph at both invariant points.' }]), numChk(4, [{ v: 2, code: CP + 'cnt-two', hint: 'The line also crosses the reflected middle arc twice.' }]), numChk(3, [{ v: 4, code: CP + 'cnt-hump', hint: 'At the height of the top of the arc the line just touches it once.' }, { v: 2, code: CP + 'cnt-hump', hint: 'It also touches the top of the middle arc.' }]), numChk(2, [{ v: 4, code: CP + 'cnt-four', hint: 'Above the top of the arc the line meets only the two outer arms.' }])],
        keys, t('k<0') + ': 0; ' + t('k=0') + ': 2; ' + t('0<k<' + h) + ': 4; ' + t('k=' + h) + ': 3; ' + t('k>' + h) + ': 2',
        t(Q.gT + '=' + Q.fT) + ': middle arc vertex ' + t(pt(Q.p, h)) + '.<br>' + t('k<0') + ': none; ' + t('k=0') + ': two (the invariant points); ' + t('0<k<' + h) + ': four; ' + t('k=' + h) + ': three; ' + t('k>' + h) + ': two.', ['Sketch the W: find the zeros and the top of the middle arc.', 'Slide a horizontal line up from below the axis and count.'], 'number of intersections with y = k', [['0', '2', '2', '3', '2'], ['0', '2', '4', '4', '2']]);
    })] },
    { num: 'C11', parts: [Pt('eC11', 'MAS', function (r) {
      var h = nz(r, 1, 5), sq = vtxT(1, h, 0), sqn = vtxT(-1, h, 0);
      return mcPart(r, 'Can the graph of ' + t('y=|f(x)|') + ', where ' + t('f') + ' is quadratic, have exactly one invariant point? Choose the correct answer.', [
        { html: 'Yes: for example ' + t('f(x)=' + sq) + ' and ' + t('f(x)=' + sqn) + '; both give the graph ' + t('y=' + sq) + ', with invariant point ' + t('(' + h + ',\\ 0)') + '.', right: true },
        { html: 'No: a parabola crosses the ' + t('x') + '-axis twice or not at all.', why: 'A parabola can also <b>touch</b> the axis at its vertex.' },
        { html: 'Yes: for example ' + t('f(x)=' + sq + '-1') + ' and ' + t('f(x)=' + sqn + '+1') + '.', why: 'Each of those crosses the axis twice: ' + t('(x' + sgT(-h) + ')^{2}=1') + ' has two solutions.' },
        { html: 'Yes: for example ' + t('f(x)=' + sq + '+1') + ' and ' + t('f(x)=' + sqn + '-1') + '.', why: 'Those never meet the axis: no invariant points.' }],
        'Yes, when the vertex is on the ' + t('x') + '-axis. ' + t('f(x)=' + sq) + ': nothing changes. ' + t('f(x)=' + sqn) + ': the whole parabola (except the vertex) is below the axis and is reflected, giving the same graph ' + t('y=' + sq) + '. The invariant point is ' + t('(' + h + ',\\ 0)') + ' in both.', ['Invariant points are the zeros of ' + t('f') + '. When does a quadratic have exactly one zero?'], 'exactly one invariant point');
    })] },
    { num: 'C12', shared: function (r) { return pickWhere(function () { var r1 = r.int(-6, -1), s1 = r.int(1, 8); return { r: r1, s: s1, a: r.pick([-0.5, -1, -2, -0.25]) }; }, function (z) { var m = z.a * z.r * z.s; return z.s - z.r >= 3 && Number.isInteger(m) && m >= 2 && m <= 24 && Number.isInteger(z.a * (z.r + z.s)) && excl(z, [{ r: -2, s: 6, a: -0.5 }]); }); },
      stem: function (o) { return t('f') + ' is a quadratic function that opens down. The graph of ' + t('y=|f(x)|') + ' has invariant points ' + t('(' + o.r + ',\\ 0)') + ' and ' + t('(' + o.s + ',\\ 0)') + ' and ' + t('y') + '-intercept ' + t(nt(o.a * o.r * o.s)) + '.'; },
      parts: [
        Pt('eC12a', 'MAS', function (r, o) {
          var Q = QR(o.a, o.r, o.s), m = o.a * o.r * o.s, wr = [{ is: P.neg(Q.poly), code: CP + 'back-other', hint: 'That one opens up. ' + t('f') + ' opens down, so ' + t('a<0') + '.' }];
          if (o.a !== -1) wr.push({ is: P.neg(P.mul(lin(1, -o.r), lin(1, -o.s))), code: CP + 'back-a', hint: 'Use the ' + t('y') + '-intercept: ' + t('|f(0)|=|' + (o.r * o.s) + 'a|=' + m) + '.' });
          var p = KP.poly('Determine ' + t('f(x)') + '.', Q.poly, { expanded: false, before: 'f(x)=', wrong: wr },
            t('f(x)=a(x' + sgT(-o.r) + ')(x' + sgT(-o.s) + ')') + ', ' + t('a<0') + '. ' + t('|f(0)|=|' + (o.r * o.s) + 'a|=' + m) + ', so ' + t('a=\\pm ' + nt(-o.a)) + '; opens down: ' + t('a=' + nt(o.a)) + '.<br>' + t('f(x)=' + Q.fT + '=' + Q.gT) + '.', ['The invariant points are the zeros of ' + t('f') + '.', 'The ' + t('y') + '-intercept of ' + t('|f|') + ' is ' + t('|f(0)|') + '.'], 'f from the invariant points and |f(0)|');
          p.bad = wr.map(function (w) { return tx(w.is); }); return p;
        }),
        Pt('eC12b', 'MAS', function (r, o) { var Q = QR(o.a, o.r, o.s); return piecePart(CP, 'Write ' + t('y=|f(x)|') + ' in piecewise form, where ' + t('f(x)=' + Q.gT) + '.', Q, { text: 'piecewise form of |f| (working backwards)' }); })] }
  ];

  HW.defineLesson({ id: LID, unit: 7, num: '3', title: 'Graphing Absolute Value Functions of Quadratic Functions', outcome: OUT, calc: true, questions: QUESTIONS, extra: EXTRA });
})(window);
