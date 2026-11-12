/* Math 20-1 · Unit 5 · Lesson 5 — Writing a Quadratic Equation from Its Vertex and a Point (outcome RF3 on every part)
 * Assignment 5 (m201book unit5/u5_l05.tex, Questions 1–17) and the Lesson 5 Extra Practice (u5_ep05.tex, A1–A4, B1–B6,
 * C1–C3). Every part is a generator: the booklet question's idea, form and difficulty with new numbers (contexts vary a
 * little); the lesson's example parabolas and the booklet's own are left out. Calculator lesson: a stays an exact fraction
 * where the booklet keeps one, and x-intercepts / heights are rounded where the booklet says so.
 *
 * Uses the Unit 5 kit HW.u5k34 (js/lessons/u5l3.js) only lazily (inside generators and checkers), so the load order of the
 * lesson files doesn't matter. This file also defines the small kit HW.p55, used by u5l6.js (also lazily):
 *   exPart(prompt, fn, key, o)   an expression answer in one variable (o.v, o.lhs, o.vertex {a, p, q}: vertex form
 *                                required, o.cands [[fn, code, hint, tex]], o.wrap(check), o.keys)
 *   vfPart(prompt, a, p, q, o)   a vertex-form answer y = a(x − p)² + q (o.aw [[a, code, hint]]: wrong values of a; o.fw
 *                                [[a, p, q, code, hint]]: other wrong parabolas; o.frac (default true): fractions in the key)
 *   genPart(prompt, coefs, wr, o)  a general-form answer (K.poly, the poly keypad); wr [[coefs, code, hint]]
 *   genWrongs(a, p, q)           the classic slips expanding a(x − p)² + q
 *   P(x), eqy(tex, v), nz, sgn, arch(o) (an arch / tunnel / cable sketch as SVG)
 * Recognised mistakes (codes u5l5-…): (x − p) not squared when solving for a, a inverted (d²/k), p substituted with the
 * wrong sign, q moved with the wrong sign, the point on the axis not used as the vertex, zeros' signs reversed in
 * factored form, a from the half-width, "d m from an end" used as x = d, half the width given as the width, a landing
 * point found by symmetry when the start is above the ground, the distance from the vertex given instead of from the
 * start, the mirror point reflected in the x-axis, the arch checked only at its centre; plus u5l3's sign-of-p, wrong q /
 * wrong a, range and x-intercept codes.
 * Conversions: graph questions draw the graph as SVG from the actual function (integer points marked); "will the truck fit?
 * explain" → multiple choice of verdicts with the height; numerical response → a number box (4 characters).
 * Levels: LIM BEG EMG PRG ADV MAS. Mastery: 8, Extra C1, C3(b). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, B = K.P, t = K.t;
  var LID = 'u5l5';
  var Z = null;
  function z() { if (!Z) { Z = HW.u5k34; if (!Z) throw new Error('u5l5.js needs HW.u5k34 (js/lessons/u5l3.js)'); } return Z; }
  function cl(x) { return Math.round(x * 1e9) / 1e9; }
  function same(a, b) { return Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b)); }
  function pickWhere(gen, okf) { for (var i = 0; i < 20000; i++) { var o = gen(); if (okf(o)) return o; } throw new Error(LID + ': no valid numbers'); }
  function nz(r, a, b) { return pickWhere(function () { return r.int(a, b); }, function (x) { return x !== 0; }); }
  function sgn(r) { return r.chance(0.5) ? 1 : -1; }
  function vT(x) { return z().vT(x); }
  function rT(x) { return z().rT(x); }
  function sT(x, f) { return z().sT(x, f); }
  function aTex(a, f) { return z().aTex(a, f); }
  function vfTex(a, p, q, v, f) { return z().vfTex(a, p, q, v || 'x', f == null ? true : f); }
  function polyTex(c, v, f) { return z().polyTex(c, v || 'x', f == null ? true : f); }
  function ptTex(x, y) { return z().ptTex(x, y); }
  function par(a, p, q) { return function (x) { return a * (x - p) * (x - p) + q; }; }
  function P(x) { return x < 0 ? '(' + vT(x) + ')' : vT(x); }
  function eqy(tex, v) { return t((v || 'y') + '=' + tex); }
  function isInt(x) { return Math.abs(x - Math.round(x)) < 1e-9; }
  function terminates(x, places) { var m = Math.pow(10, places || 2); return Math.abs(x * m - Math.round(x * m)) < 1e-7; }

  /* =========================== the kit (HW.p55) =========================== */
  var P5 = HW.p55 = {};
  P5.exPart = function (prompt, fn, key, o) {
    o = o || {};
    var v = o.v || 'x', lhs = o.lhs == null ? 'y=' : o.lhs;
    var cands = (o.cands || []).filter(function (c) { return c && !z().eqFn(c[0], fn); });
    var chk = z().exprChk(fn, { v: v, vertex: o.vertex, cands: cands });
    if (o.wrap) chk = o.wrap(chk);
    return { prompt: prompt, input: { type: 'math', keys: o.keys || 'u5k34', vars: [v], before: lhs ? t(lhs) : undefined, placeholder: o.placeholder }, check: chk, key: key, answer: t(lhs + key),
      solution: o.sol, hints: o.hints || [], text: o.text, bad: cands.filter(function (c) { return c[3]; }).map(function (c) { return c[3]; }).concat(o.bad || []), good: o.good, outcome: o.outcome };
  };
  P5.vfCands = function (a, p, q, o) {
    o = o || {}; var out = [];
    (o.aw || []).forEach(function (w) { if (w && isFinite(w[0]) && !same(w[0], 0) && !same(w[0], a)) out.push([par(w[0], p, q), w[1], w[2], vfTex(w[0], p, q)]); });
    (o.fw || []).forEach(function (w) { if (w && [w[0], w[1], w[2]].every(isFinite) && !same(w[0], 0)) out.push([par(w[0], w[1], w[2]), w[3], w[4], vfTex(w[0], w[1], w[2])]); });
    return out;
  };
  P5.vfPart = function (prompt, a, p, q, o) {
    o = o || {};
    return P5.exPart(prompt, par(a, p, q), vfTex(a, p, q, 'x', o.frac), { vertex: { a: a, p: p, q: q }, cands: P5.vfCands(a, p, q, o), sol: o.sol, hints: o.hints, text: o.text, bad: o.bad, outcome: o.outcome });
  };
  P5.genPart = function (prompt, coefs, wr, o) {
    o = o || {};
    var target = polyTex(coefs), w = (wr || []).filter(function (x) { return !(same(x[0][0], coefs[0]) && same(x[0][1], coefs[1]) && same(x[0][2], coefs[2])); }).map(function (x) { return { is: polyTex(x[0]), code: x[1], hint: x[2] }; });
    var p = B.math(prompt, K.poly(target, { wrong: w }), target, o.sol, o.hints || [], o.text, { keys: 'poly', vars: ['x'], before: t('y=') });
    p.answer = t('y=' + target); p.bad = w.map(function (x) { return x.is; }); return p;
  };
  /* the classic slips expanding a(x − p)² + q */
  P5.genWrongs = function (a, p, q) {
    var c = [a, cl(-2 * a * p), cl(a * p * p + q)];
    return [[[a, 0, cl(a * p * p + q)], LID + '-sq-mid', 'The square has a middle term: ' + t('(' + z().binTex('x', p) + ')^{2}=' + polyTex([1, cl(-2 * p), cl(p * p)])) + '.'],
      [[a, cl(-2 * p), cl(p * p + q)], LID + '-dist', 'Multiply <b>every</b> term of the expanded square by ' + t(vT(a)) + '.'],
      [[a, c[1], cl(a * p * p)], LID + '-q-add', 'Don’t forget to add ' + t('q=' + vT(q)) + ' at the end.'],
      [[a, -c[1], c[2]], LID + '-mid-sign', 'Check the sign of the middle term: ' + t('(x-p)^{2}=x^{2}-2px+p^{2}') + '.']];
  };
  P5.genSol = function (a, p, q) {
    var sq = polyTex([1, cl(-2 * p), cl(p * p)]);
    return eqy(aTex(a, true) + '(' + sq + ')' + sT(q)) + '<br>' + eqy(polyTex([a, cl(-2 * a * p), cl(a * p * p + q)]));
  };
  /* wrong values of a when solving y1 = a(x1 − p)² + q */
  P5.aWrong = function (p, q, x1, y1) {
    var d = cl(x1 - p), k = cl(y1 - q), out = [];
    if (Math.abs(d) !== 1) out.push([cl(k / d), LID + '-nosq', 'Square the bracket: ' + t('(' + vT(x1) + sT(-p) + ')^{2}=' + vT(d) + '^{2}=' + vT(cl(d * d))) + '.']);
    if (!same(Math.abs(k), d * d)) out.push([cl(d * d / k), LID + '-inv', 'Solve ' + t(vT(k) + '=' + vT(cl(d * d)) + 'a') + ' by dividing both sides by ' + t(vT(cl(d * d))) + '.']);
    if (!same(p, 0) && !same(x1 + p, 0) && !same((x1 + p) * (x1 + p), d * d)) out.push([cl(k / ((x1 + p) * (x1 + p))), LID + '-p-sub', 'Substitute carefully: the bracket is ' + t('(x-p)') + ' with ' + t('p=' + vT(p)) + ', so it is ' + t('(' + vT(x1) + sT(-p) + ')=' + vT(d)) + '.']);
    if (!same(q, 0)) out.push([cl((y1 + q) / (d * d)), LID + '-q-move', 'Move ' + t('q') + ' to the other side by subtracting it: ' + t(vT(y1) + sT(-q) + '=' + vT(k)) + '.']);
    return out;
  };
  /* "y1 = a(x1 − p)² + q, …, a = …" */
  P5.aSol = function (p, q, x1, y1, a) {
    var d = cl(x1 - p), k = cl(y1 - q);
    var br = same(p, 0) ? '(' + vT(x1) + ')' : '(' + vT(x1) + sT(-p) + ')';
    return t(vT(y1) + '=a' + br + '^{2}' + sT(q)) + '<br>' + t(vT(k) + '=' + vT(cl(d * d)) + 'a') + ', so ' + t('a=' + rT(a));
  };
  /* an arch / tunnel / cable sketch. o: { w, h, origin: 'mid' | 'left', wLab, hLab, cable (opens up, towers) } */
  P5.arch = function (o) {
    var W = 260, H = 150, x0 = 40, x1 = 220, yb = 122, yt = 30, s = '', N = 40, pts = [];
    for (var i = 0; i <= N; i++) { var u = i / N, X = x0 + u * (x1 - x0), Y = o.cable ? yt + (yb - 30 - yt) * (1 - Math.pow(2 * u - 1, 2)) : yb - (yb - yt) * (1 - Math.pow(2 * u - 1, 2)); pts.push(X.toFixed(1) + ',' + Y.toFixed(1)); }
    var ox = o.origin === 'left' ? x0 : (x0 + x1) / 2;
    s += '<line x1="' + (x0 - 18) + '" y1="' + yb + '" x2="' + (x1 + 22) + '" y2="' + yb + '" stroke="#2b3340" stroke-width="1.5"/>';
    if (o.origin) s += '<line x1="' + ox + '" y1="' + (yb + 8) + '" x2="' + ox + '" y2="' + (yt - 16) + '" stroke="#2b3340" stroke-width="1.2" stroke-dasharray="' + (o.origin === 'mid' && !o.cable ? '0' : '0') + '"/><text x="' + (ox + 5) + '" y="' + (yt - 8) + '" font-size="12" font-style="italic" fill="#2b3340">y</text><text x="' + (x1 + 16) + '" y="' + (yb - 5) + '" font-size="12" font-style="italic" fill="#2b3340">x</text>';
    if (o.cable) { s += '<line x1="' + x0 + '" y1="' + yb + '" x2="' + x0 + '" y2="' + (yt - 6) + '" stroke="#6a7182" stroke-width="4"/><line x1="' + x1 + '" y1="' + yb + '" x2="' + x1 + '" y2="' + (yt - 6) + '" stroke="#6a7182" stroke-width="4"/>'; }
    s += '<polyline points="' + pts.join(' ') + '" fill="none" stroke="#2b55a0" stroke-width="2.6"/>';
    var mx = (x0 + x1) / 2, my = o.cable ? yb - 30 : yt;
    s += '<line x1="' + (mx + (o.origin === 'mid' ? 0 : 0)) + '" y1="' + yb + '" x2="' + mx + '" y2="' + my + '" stroke="#b0442f" stroke-width="1.3" stroke-dasharray="5 3"/>';
    if (o.hLab) s += '<text x="' + (mx + 6) + '" y="' + ((yb + my) / 2 + 4) + '" font-size="12" fill="#b0442f">' + o.hLab + '</text>';
    if (o.wLab) s += '<text x="' + mx + '" y="' + (yb + 22) + '" font-size="12" text-anchor="middle" fill="#2b3340">' + o.wLab + '</text><line x1="' + x0 + '" y1="' + (yb + 10) + '" x2="' + x1 + '" y2="' + (yb + 10) + '" stroke="#6a7182" stroke-width="1"/>';
    if (o.tLab) s += '<text x="' + (x1 + 6) + '" y="' + ((yb + yt) / 2) + '" font-size="12" fill="#2b3340">' + o.tLab + '</text>';
    return '<div class="fig"><svg class="fig-svg" viewBox="0 0 ' + W + ' ' + H + '" style="max-width:' + W + 'px" role="img" aria-label="' + (o.aria || 'sketch of a parabolic arch') + '"><rect x="0" y="0" width="' + W + '" height="' + H + '" fill="#fff"/>' + s + '</svg></div>';
  };
  /* the graph of a(x − p)² + q in a window that fits the marked points */
  P5.graphFig = function (a, p, q, marks) {
    var pts = [[p, q]].concat(marks), W0 = z().win(pts, 1, 1);
    var room = a > 0 ? W0.y[1] - q : q - W0.y[0], D = Math.sqrt(room / Math.abs(a));
    return z().fig({ x: W0.x, y: W0.y, l: 2, fns: [{ f: par(a, p, q), from: Math.max(W0.x[0], p - D), to: Math.min(W0.x[1], p + D) }], points: pts.map(function (P0) { return { x: P0[0], y: P0[1] }; }), max: 290, aria: 'graph of a parabola with marked points' });
  };
  P5.P = P; P5.eqy = eqy; P5.nz = nz; P5.sgn = sgn; P5.par = par; P5.cl = cl; P5.same = same; P5.pickWhere = pickWhere; P5.isInt = isInt; P5.terminates = terminates;

  var CODES = {
    'u5l5-nosq': 'Solving for a: didn’t square (x − p)', 'u5l5-inv': 'Solving for a: inverted (divided the wrong way)', 'u5l5-p-sub': 'Solving for a: substituted with the wrong sign of p',
    'u5l5-q-move': 'Solving for a: moved q with the wrong sign', 'u5l5-sq-mid': 'Expanded the square without its middle term', 'u5l5-dist': 'Didn’t multiply a through every term',
    'u5l5-q-add': 'Left off q when expanding', 'u5l5-mid-sign': 'Middle term with the wrong sign', 'u5l5-vertex-pt': 'Didn’t use the point on the axis as the vertex', 'u5l5-zero-sign': 'Factored form: zeros’ signs reversed',
    'u5l5-end': 'Used “d m from an end” as x = d', 'u5l5-width-half': 'Gave half the width', 'u5l5-sym': 'Assumed it lands at twice the vertex distance (start above the ground)',
    'u5l5-from-vertex': 'Gave the distance from the vertex, not from the start', 'u5l5-mirror-x': 'Mirror point reflected in the x-axis', 'u5l5-centre': 'Checked the height only at the centre',
    'u5l5-sys': 'Two points: wrong a or q', 'u5l5-yint-q': 'Gave q as the y-intercept', 'u5l5-mc': 'Multiple choice: classic slip', 'u5l5-axis-k': 'Symmetric point: used the wrong axis'
  };
  HW.addCodes(CODES);
  HW.addPartial({ 'u5l5-nosq': 'b', 'u5l5-inv': 'b', 'u5l5-p-sub': 's', 'u5l5-q-move': 's', 'u5l5-sq-mid': 'b', 'u5l5-dist': 'b', 'u5l5-q-add': 's', 'u5l5-mid-sign': 's', 'u5l5-vertex-pt': 'b',
    'u5l5-zero-sign': 's', 'u5l5-end': 'b', 'u5l5-width-half': 's', 'u5l5-sym': 'b', 'u5l5-from-vertex': 's', 'u5l5-mirror-x': 'b', 'u5l5-centre': 'b', 'u5l5-sys': 'b', 'u5l5-yint-q': 'n', 'u5l5-axis-k': 'b' });

  /* the lesson's examples and the booklet's own parabolas [a, p, q] */
  var AVL = [[3, 3, -5], [-2, -4, 6], [1 / 3, 6, 1], [-3 / 8, -1, 0], [-0.5, -3, 6], [1, -1, -6], [2, 4, -12], [2, -3, 0], [-1 / 8, 12, 18], [-1 / 8, 0, 18], [-0.12, 10, 14], [-1.5, 2, 13.5], [-0.75, 4, 3],
    [3, 2, -1], [2, -5, 2], [-2, 4, 7], [1 / 3, 0, -3], [-0.25, -2, 0], [0.5, 6, -1], [-0.5, -3, 5], [-2, 1, 4], [0.5, -2, -3], [-2, -1, 8], [0.5, 3, -6], [-2, -4, 7], [3, 1, -7], [2, -1, -8], [0.5, 4, -8], [-0.4, -1, 6.4],
    [-3, 2, 0], [-1 / 40, 0, 10], [-1 / 120, 60, 30], [-0.5, 2, 3.2], [2, -2, -5], [0.25, 4, -9], [-0.5, 1, 4.5], [5, 1, 3], [-3, -6, -2], [0.25, 5, 0], [-2 / 3, 0, 7], [3, -2, -5], [-2, 4, 18], [2, -1, -4], [-1, 2, 9],
    [1, -3, -2], [-3 / 8, 4, 6], [-1 / 25, 15, 9], [-3, -1, 4], [-2, 2, 12], [1, 2, 1], [1, 1, -16], [0.0045, 0, 5]];
  function AV(a, p, q) { return !AVL.some(function (L) { return same(L[0], a) && same(L[1], p) && same(L[2], q); }); }
  var HVP = ['Write ' + t('y=a(x-p)^{2}+q') + ' with the vertex for ' + t('p') + ' and ' + t('q') + ', substitute the point for ' + t('x') + ' and ' + t('y') + ', then solve for ' + t('a') + '.', 'Keep ' + t('x') + ' and ' + t('y') + ' as letters in your final equation; leave ' + t('a') + ' as an exact fraction if it isn’t a whole number.'];
  var HFAC = ['Factored form: ' + t('y=a(x-r)(x-s)') + ' with the zeros ' + t('r') + ' and ' + t('s') + '. Substitute a point that isn’t a zero to find ' + t('a') + '.', 'The axis is halfway between the zeros, ' + t('x=\\frac{r+s}{2}') + '; substitute it to find the vertex.'];
  function frac2(x) { return rT(x); }

  /* a vertex, a point, and a with given properties. s: { aSet, frac, sign, p0, q0, yint, dset, aMax } */
  function vpGen(r, s) {
    return pickWhere(function () {
      var p = s.p0 ? 0 : nz(r, -7, 7), q = s.q0 ? 0 : nz(r, -9, 9), d = s.yint ? -p : r.pick(s.dset || [-3, -2, -1, 1, 2, 3]), a;
      if (s.frac) a = cl(nz(r, -12, 12) / (d * d)); else a = r.pick(s.aSet);
      return { a: a, p: p, q: q, d: d, x1: p + d, y1: cl(a * d * d + q) };
    }, function (o) {
      if (o.d === 0 || !AV(o.a, o.p, o.q) || Math.abs(o.y1) > 30) return false;
      if (s.sign && Math.sign(o.a) !== s.sign) return false;
      if (s.frac && (isInt(o.a) || Math.abs(o.a) > (s.aMax || 3) || z().toFrac(o.a)[1] > 16)) return false;
      if (!s.yint && o.x1 === 0) return false;
      return true;
    });
  }
  function vpStem(o, yint) { return 'vertex ' + t(ptTex(o.p, o.q)) + ', ' + (yint ? t('y') + '-intercept ' + t(vT(o.y1)) : 'passing through ' + t(ptTex(o.x1, o.y1))); }
  function vpQ(o, pre, yint, text, lvl) {
    return P5.vfPart((pre || '') + 'A parabola has ' + vpStem(o, yint) + '. Write its equation in vertex form.', o.a, o.p, o.q, { aw: P5.aWrong(o.p, o.q, o.x1, o.y1), fw: same(o.p, 0) ? [] : [[o.a, -o.p, o.q, 'u5l3-p-sign', 'Check the sign inside the bracket: the vertex is at ' + t('x=' + vT(o.p)) + ', so the bracket is ' + t('(' + z().binTex('x', o.p) + ')') + '.']],
      sol: (yint ? 'The ' + t('y') + '-intercept is the point ' + t(ptTex(0, o.y1)) + '.<br>' : '') + eqy('a' + (same(o.p, 0) ? 'x^{2}' : '(' + z().binTex('x', o.p) + ')^{2}') + sT(o.q)) + '<br>' + P5.aSol(o.p, o.q, o.x1, o.y1, o.a) + '<br>' + eqy(vfTex(o.a, o.p, o.q)),
      hints: HVP.concat(yint ? ['A ' + t('y') + '-intercept of ' + t('k') + ' is the point ' + t('(0,\\ k)') + '.'] : []), text: text });
  }

  /* factored form k(x − r)(x − s) */
  function facT(k, r, s) { return z().ffTex(k, [1, -r], [1, -s], 'x', true); }
  function facFields(k, r, s, o) {
    o = o || {};
    var h = cl((r + s) / 2), v = cl(k * (h - r) * (h - s)), w = [];
    if (r !== 0 || s !== 0) w.push({ is: facT(k, -r, -s), code: LID + '-zero-sign', hint: 'The zeros are ' + t(vT(r)) + ' and ' + t(vT(s)) + ': the factors are ' + t('(x-r)(x-s)') + ', so a zero of ' + t(vT(r < 0 ? r : s)) + ' gives ' + t('(' + z().binTex('x', r < 0 ? r : s) + ')') + '.' });
    if (!same(Math.abs(k), 1)) w.push({ is: facT(cl(1 / k), r, s), code: LID + '-inv', hint: 'Solve for ' + t('a') + ' by dividing by the product of the brackets.' });
    w.push({ is: facT(-k, r, s), code: 'sign', hint: 'Check the sign of ' + t('a') + ': substitute the point to check.' });
    return [{ label: 'Factored form', before: t('y='), fac: { target: facT(k, r, s), opt: { wrong: w } } },
      { label: 'Vertex', pt: [h, v], cands: [[[h, -v], 'sign', 'Multiply by ' + t('a=' + vT(k)) + ' too (check the sign).'], [[-h, v], 'u5l3-p-sign', 'The axis is halfway between the zeros: ' + t('x=\\frac{' + vT(r) + '+' + P(s) + '}{2}') + '.']] }];
  }
  function facSol(k, r, s, x0, y0) {
    var h = cl((r + s) / 2), v = cl(k * (h - r) * (h - s)), br = function (x) { return '(' + (r === 0 ? vT(x) : vT(x) + sT(-r)) + ')(' + vT(x) + sT(-s) + ')'; };
    var prod = cl((x0 - r) * (x0 - s));
    return eqy('a' + (r === 0 ? 'x' : '(' + z().binTex('x', r) + ')') + '(' + z().binTex('x', s) + ')') + '<br>' + t(vT(y0) + '=a' + br(x0) + '=' + vT(prod) + 'a') + ', so ' + t('a=' + rT(k)) + ': ' + eqy(facT(k, r, s)) +
      '<br>Axis ' + t('x=\\frac{' + vT(r) + '+' + P(s) + '}{2}=' + vT(h)) + '; ' + t('y=' + aTex(k, true) + '(' + vT(cl(h - r)) + ')(' + vT(cl(h - s)) + ')=' + rT(v)) + ': vertex ' + t('\\left(' + rT(h) + ',\\ ' + rT(v) + '\\right)') + '.';
  }

  var QUESTIONS = [
    { num: '1', shared: function (r) {
      return pickWhere(function () { var a = r.pick([2, 3, 4, -2, -3, -4]), p = nz(r, -5, 5), q = -Math.sign(a) * r.int(1, 12), d = r.pick([-3, -2, -1, 1, 2, 3]); return { a: a, p: p, q: q, d: d, x1: p + d, y1: a * d * d + q }; },
        function (o) { return AV(o.a, o.p, o.q) && Math.abs(o.y1) <= 40 && o.x1 !== 0 && z().radParts(-o.q / o.a).f !== 1 && Math.abs(o.a * o.p * o.p + o.q) <= 99; });
    },
      stem: function (o) { return 'A parabola has vertex ' + t(ptTex(o.p, o.q)) + ' and passes through the point ' + t(ptTex(o.x1, o.y1)) + '.'; },
      parts: [
        { id: '1a', level: 'BEG', make: function (r, o) { return P5.vfPart('Write its equation in vertex form.', o.a, o.p, o.q, { aw: P5.aWrong(o.p, o.q, o.x1, o.y1), sol: P5.aSol(o.p, o.q, o.x1, o.y1, o.a) + '<br>' + eqy(vfTex(o.a, o.p, o.q)), hints: HVP, text: 'vertex + point: vertex form' }); } },
        { id: '1b', level: 'EMG', make: function (r, o) { return P5.genPart('Write its equation in general form. (Its vertex form is ' + eqy(vfTex(o.a, o.p, o.q)) + '.)', [o.a, -2 * o.a * o.p, o.a * o.p * o.p + o.q], P5.genWrongs(o.a, o.p, o.q), { sol: P5.genSol(o.a, o.p, o.q), hints: ['Expand the square first: ' + t('(x-p)^{2}=x^{2}-2px+p^{2}') + '. Then multiply every term by ' + t('a') + ' and add ' + t('q') + '.'], text: 'vertex + point: general form' }); } },
        { id: '1c', level: 'PRG', make: function (r, o) {
          var c = o.a * o.p * o.p + o.q, m = -o.q / o.a, R = z().vfRoots(o.a, o.p, o.q);
          return z().fields('Determine the ' + t('x') + '- and ' + t('y') + '-intercepts of the graph of ' + eqy(vfTex(o.a, o.p, o.q)) + '. Give the ' + t('x') + '-intercepts to the nearest hundredth.', [
            { label: t('y') + '-intercept', name: 'y-intercept', ans: c, cands: [[o.q, LID + '-yint-q', t('q') + ' is the ' + t('y') + '-value of the vertex. The ' + t('y') + '-intercept is the value at ' + t('x=0') + ' (the constant ' + t('c') + ' in general form).'], [o.a * (-o.p) + o.q, 'u5l3-yint-nosq', 'Square the bracket: ' + t('(0' + sT(-o.p) + ')^{2}=' + o.p * o.p) + '.']] },
            { label: t('x\\approx'), name: 'Smaller x-intercept', dp: 2, ans: R[0] }, { label: 'and ' + t('x\\approx'), name: 'Larger x-intercept', dp: 2, ans: R[1] }],
            { swap: [[1, 2]], sol: t('y') + '-intercept: ' + t('y=' + vfTex(o.a, o.p, o.q).replace(/x/g, '(0)') + '=' + c) + '.<br>' + t(aTex(o.a) + '(' + z().binTex('x', o.p) + ')^{2}=' + (-o.q)) + ', so ' + t('(' + z().binTex('x', o.p) + ')^{2}=' + rT(m)) + ' and ' + t('x=' + o.p + '\\pm\\sqrt{' + rT(m) + '}') + '.<br>' + t('x\\approx ' + R[0].toFixed(2)) + ' and ' + t('x\\approx ' + R[1].toFixed(2)) + ' (check with the calculator’s zero feature).', hints: ['The ' + t('y') + '-intercept is where ' + t('x=0') + '.', 'For the ' + t('x') + '-intercepts set ' + t('y=0') + ', isolate the square and take the square root of both sides (' + t('\\pm') + ').'], text: 'intercepts, x to the nearest hundredth' });
        } }] },

    { num: '2', stem: 'Write an equation in vertex form for the parabola with the given vertex that passes through the given point.', parts: [
      { id: '2a', level: 'BEG', make: function (r) { return vpQ(vpGen(r, { aSet: [2, 3, 4, 5], dset: [-2, -1, 1, 2] }), '', false, 'vertex + point, a > 0 whole'); } },
      { id: '2b', level: 'BEG', make: function (r) { return vpQ(vpGen(r, { aSet: [-2, -3, -4], dset: [-3, -2, 2, 3] }), '', false, 'vertex + point, a < 0 whole'); } },
      { id: '2c', level: 'EMG', make: function (r) { return vpQ(vpGen(r, { frac: true, p0: true, sign: 1, dset: [-6, -4, -3, 3, 4, 6] }), '', false, 'vertex on the y-axis, a a fraction'); } },
      { id: '2d', level: 'EMG', make: function (r) { return vpQ(vpGen(r, { frac: true, q0: true, sign: -1, dset: [-4, -3, -2, 2, 3, 4] }), '', false, 'vertex on the x-axis, a a fraction'); } },
      { id: '2e', level: 'PRG', make: function (r) { return vpQ(vpGen(r, { frac: true, yint: true, aMax: 2 }), '', true, 'vertex + y-intercept, a a fraction'); } },
      { id: '2f', level: 'EMG', make: function (r) { return vpQ(vpGen(r, { frac: true, sign: -1, dset: [-4, -2, 2, 4] }), '', false, 'vertex + point, a a negative fraction'); } }] },

    { num: '3', stem: 'Write an equation of the form ' + t('y=a(x-p)^{2}+q') + ' for each graph. The marked points have integer coordinates.', parts: [
      { id: '3a', level: 'EMG', make: function (r) { return graphQ(r, [-3, -2, 2, 3], [-2, -1, 1, 2], false); } },
      { id: '3b', level: 'PRG', make: function (r) { return graphQ(r, [0.5, -0.5, 0.25, -0.25, 1 / 3, -1 / 3], null, true); } }] },

    { num: '4', shared: function (r) {
      return pickWhere(function () { var a = r.pick([-1, -2, -3, 1, 2, 3, -0.5, 0.5]), d = r.pick(a === 0.5 || a === -0.5 ? [-2, 2] : [-3, -2, -1, 1, 2, 3]); return { a: a, p: nz(r, -5, 5), d: d, q: -a * d * d }; },
        function (o) { return AV(o.a, o.p, o.q) && Math.abs(o.q) <= 18 && o.p + o.d !== 0 && o.p - o.d !== 0 && Math.abs(o.a * o.p * o.p + o.q) <= 60; });
    },
      stem: function (o) { return 'The graph of a quadratic function has its vertex at ' + t(ptTex(o.p, o.q)) + ', and one of its ' + t('x') + '-intercepts is ' + t(vT(o.p + o.d)) + '.'; },
      parts: [
        { id: '4a', level: 'PRG', make: function (r, o) {
          var r0 = o.p + o.d, gc = [o.a, -2 * o.a * o.p, o.a * o.p * o.p + o.q];
          return z().fields('Determine the equation in vertex form and in general form.', [
            { label: 'Vertex form', before: t('y='), expr: { fn: par(o.a, o.p, o.q), key: vfTex(o.a, o.p, o.q), vertex: { a: o.a, p: o.p, q: o.q }, cands: P5.vfCands(o.a, o.p, o.q, { aw: P5.aWrong(o.p, o.q, r0, 0) }) } },
            { label: 'General form', before: t('y='), poly: { target: polyTex(gc), opt: { wrong: P5.genWrongs(o.a, o.p, o.q).map(function (w) { return { is: polyTex(w[0]), code: w[1], hint: w[2] }; }) } } }],
            { sol: 'The ' + t('x') + '-intercept is the point ' + t(ptTex(r0, 0)) + '.<br>' + P5.aSol(o.p, o.q, r0, 0, o.a) + '<br>' + eqy(vfTex(o.a, o.p, o.q)) + '<br>' + P5.genSol(o.a, o.p, o.q), hints: ['An ' + t('x') + '-intercept of ' + t('r') + ' is the point ' + t('(r,\\ 0)') + ': substitute it to find ' + t('a') + '.'].concat(HVP.slice(0, 1)), text: 'vertex + x-intercept: both forms' });
        } },
        { id: '4b', level: 'EMG', make: function (r, o) {
          var r0 = o.p + o.d, other = o.p - o.d;
          return z().fields('State the other ' + t('x') + '-intercept, the equation of the axis of symmetry, the domain and the range.', [
            { label: 'Other ' + t('x') + '-intercept', name: 'Other x-intercept', ans: other, cands: [[-r0, 'u5l3-mirror', 'Reflect in the axis of symmetry ' + t('x=' + vT(o.p)) + ', not in the ' + t('y') + '-axis.'], [r0, 'value', 'That is the one you were given. The other one is the same distance on the other side of the axis.'], [o.p + 2 * o.d, LID + '-axis-k', t(vT(r0)) + ' is ' + Math.abs(o.d) + ' units from the axis ' + t('x=' + vT(o.p)) + ', so the other intercept is ' + Math.abs(o.d) + ' units on the <b>other</b> side.']] },
            { label: 'Axis of symmetry', axis: o.p, q: o.q }, { label: 'Domain', dom: true, opt: { range: z().rangeTex(o.q, o.a > 0) } }, { label: 'Range', range: [o.q, o.a > 0], opt: { p: o.p } }],
            { sol: 'Other ' + t('x') + '-intercept: ' + t('2p-r=2(' + vT(o.p) + ')-' + P(r0) + '=' + vT(other)) + '. Axis ' + t('x=' + vT(o.p)) + '.<br>Domain ' + t(z().DOM) + '; range ' + t(z().rangeTex(o.q, o.a > 0)) + ' (it opens ' + (o.a > 0 ? 'up, minimum ' : 'down, maximum ') + t(vT(o.q)) + ').', hints: ['The axis is halfway between the ' + t('x') + '-intercepts: the other one is ' + t('2p-r') + '.', 'The range starts at the vertex’s ' + t('y') + '-value.'], text: 'other x-intercept, axis, domain, range' });
        } }] },

    { num: '5', shared: function (r) {
      return pickWhere(function () { var a = r.pick([0.5, -0.5, 2, -2, 1 / 3, 3, -3]), d = r.pick(a === 0.5 || a === -0.5 ? [-2, 2] : a === 1 / 3 ? [-3, 3] : [-2, -1, 1, 2]), p = nz(r, -5, 5), q = -Math.sign(a) * r.int(1, 12); return { a: a, p: p, q: q, d: d, x1: p + d, y1: cl(a * d * d + q) }; },
        function (o) { var rp = z().radParts(-o.q / o.a); return AV(o.a, o.p, o.q) && rp.f !== 1 && isInt(o.y1) && o.x1 !== 0 && Math.abs(o.y1) <= 30 && z().toFrac(-o.q / o.a)[1] <= 3 && Math.abs(o.a * o.p * o.p + o.q) <= 60; });
    },
      stem: function (o) { return 'A parabola has vertex ' + t(ptTex(o.p, o.q)) + ' and passes through ' + t(ptTex(o.x1, o.y1)) + '.'; },
      parts: [
        { id: '5a', level: 'PRG', make: function (r, o) { return P5.vfPart('Determine its equation.', o.a, o.p, o.q, { aw: P5.aWrong(o.p, o.q, o.x1, o.y1), sol: P5.aSol(o.p, o.q, o.x1, o.y1, o.a) + '<br>' + eqy(vfTex(o.a, o.p, o.q)), hints: HVP, text: 'vertex + point: equation' }); } },
        { id: '5b', level: 'ADV', make: function (r, o) {
          var m = cl(-o.q / o.a), R = z().vfRoots(o.a, o.p, o.q), c = cl(o.a * o.p * o.p + o.q), rp = z().radParts(m);
          return z().fields('For ' + eqy(vfTex(o.a, o.p, o.q)) + ', determine the ' + t('x') + '-intercepts as exact values and to the nearest hundredth, and the ' + t('y') + '-intercept.', [
            { label: 'Exact', roots: { vals: R, irr: true, pm: [o.p, m], cands: z().vfCands(o.a, o.p, o.q) } }, { label: t('x\\approx'), name: 'Smaller x-intercept', dp: 2, ans: R[0] }, { label: 'and ' + t('x\\approx'), name: 'Larger x-intercept', dp: 2, ans: R[1] },
            { label: t('y') + '-intercept', name: 'y-intercept', ans: c, cands: [[o.q, LID + '-yint-q', t('q') + ' is the vertex’s ' + t('y') + '-value. Put ' + t('x=0') + '.'], [cl(o.a * -o.p + o.q), 'u5l3-yint-nosq', 'Square the bracket: ' + t('(0' + sT(-o.p) + ')^{2}=' + o.p * o.p) + '.']] }],
            { swap: [[1, 2]], sol: t(vfTex(o.a, o.p, o.q) + '=0') + '<br>' + t('(' + z().binTex('x', o.p) + ')^{2}=' + rT(m)) + '<br>' + t('x=' + vT(o.p) + '\\pm\\sqrt{' + rT(m) + '}' + (rp.k !== 1 || rp.w !== 1 ? '=' + vT(o.p) + '\\pm ' + z().radTex(rp) : '')) + ', about ' + t(R[0].toFixed(2)) + ' and ' + t(R[1].toFixed(2)) + '.<br>' + t('y') + '-intercept: ' + t(aTex(o.a, true) + '(' + vT(cl(o.p * o.p)) + ')' + sT(o.q) + '=' + rT(c)) + '.', hints: ['Set ' + t('y=0') + ', isolate the square, then take the square root of both sides (' + t('\\pm') + ').', 'Simplest radical form: ' + t('\\sqrt{12}=2\\sqrt{3}') + '; no fraction under the root.'], text: 'exact and rounded x-intercepts, y-intercept' });
        } }] },

    { num: '6', parts: [
      { id: '6', level: 'BEG', make: function (r) {
        var o = pickWhere(function () { return { x: nz(r, -8, 8), y: nz(r, -12, 12) }; }, function (o) { return !(o.x === 4 && o.y === -3); });
        return z().fields('The point ' + t(ptTex(o.x, o.y)) + ' is on the graph of ' + eqy('ax^{2}+q') + '. Name another point on the graph without finding ' + t('a') + ' or ' + t('q') + '.', [{ label: 'Point', pt: [-o.x, o.y], cands: [[[o.x, -o.y], LID + '-mirror-x', 'The parabola is symmetric about its axis, the <b>vertical</b> line ' + t('x=0') + ' (the ' + t('y') + '-axis): the mirror point is at the same height.'], [[-o.x, -o.y], LID + '-mirror-x', 'The mirror point is at the same height: keep the ' + t('y') + '-coordinate.']] }],
          { sol: 'Here ' + t('p=0') + ', so the axis of symmetry is the ' + t('y') + '-axis, ' + t('x=0') + '. Points at the same height are the same distance on each side of it: ' + t(ptTex(-o.x, o.y)) + ' is on the graph.', hints: ['Where is the axis of symmetry of ' + t('y=ax^{2}+q') + '? Reflect the point in it.'], text: 'mirror point on y = ax² + q' });
      } }] },

    { num: '7', parts: [
      { id: '7', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { var h = nz(r, -6, 6), k = nz(r, -9, 9), a = r.pick([-3, -2, -1, 1, 2, 3, 0.5, -0.5]), d = r.pick([-3, -2, 2, 3]); return { h: h, k: k, a: a, d: d, x2: h + d, y2: a * d * d + k }; },
          function (o) { return AV(o.a, o.h, o.k) && isInt(o.y2) && Math.abs(o.y2) <= 30 && !(o.h === -4 && o.k === 7); });
        var wa = cl((o.k - o.y2) / (o.d * o.d));
        return P5.vfPart('A parabola has axis of symmetry ' + t('x=' + o.h) + ' and passes through ' + t(ptTex(o.h, o.k)) + ' and ' + t(ptTex(o.x2, o.y2)) + '. Write its equation in vertex form.', o.a, o.h, o.k, { aw: P5.aWrong(o.h, o.k, o.x2, o.y2), fw: [[wa, o.x2, o.y2, LID + '-vertex-pt', 'The point ' + t(ptTex(o.h, o.k)) + ' is <b>on the axis</b> ' + t('x=' + o.h) + ', so it is the vertex.']],
          sol: 'The point ' + t(ptTex(o.h, o.k)) + ' is on the axis, so it is the vertex: ' + eqy('a(' + z().binTex('x', o.h) + ')^{2}' + sT(o.k)) + '.<br>' + P5.aSol(o.h, o.k, o.x2, o.y2, o.a) + '<br>' + eqy(vfTex(o.a, o.h, o.k)), hints: ['A point whose ' + t('x') + '-coordinate equals ' + t('p') + ' is the vertex.'].concat(HVP.slice(0, 1)), text: 'point on the axis is the vertex' });
      } }] },

    { num: '8', parts: [
      { id: '8', level: 'MAS', make: function (r) {
        var o = pickWhere(function () { var a = r.pick([-3, -2, -1, 1, 2, 3, 0.5, -0.5]), p = nz(r, -5, 5), d1 = nz(r, -3, 3), d2 = nz(r, -4, 4); return { a: a, p: p, q: nz(r, -10, 10), d1: d1, d2: d2 }; },
          function (o) { var y1 = o.a * o.d1 * o.d1 + o.q, y2 = o.a * o.d2 * o.d2 + o.q; return AV(o.a, o.p, o.q) && o.d1 * o.d1 !== o.d2 * o.d2 && o.d1 < o.d2 && isInt(y1) && isInt(y2) && Math.abs(y1) <= 30 && Math.abs(y2) <= 40 && !(o.p === 1 && o.q === -7); });
        var x1 = o.p + o.d1, x2 = o.p + o.d2, y1 = o.a * o.d1 * o.d1 + o.q, y2 = o.a * o.d2 * o.d2 + o.q, D1 = o.d1 * o.d1, D2 = o.d2 * o.d2, up = o.a > 0;
        var wq = cl(y1 + o.a * D1);
        return z().fields('A parabola has axis of symmetry ' + t('x=' + o.p) + ' and passes through ' + t(ptTex(x1, y1)) + ' and ' + t(ptTex(x2, y2)) + '. Write its equation in vertex form and state its range.', [
          { label: 'Vertex form', before: t('y='), expr: { fn: par(o.a, o.p, o.q), key: vfTex(o.a, o.p, o.q), vertex: { a: o.a, p: o.p, q: o.q }, cands: P5.vfCands(o.a, o.p, o.q, { fw: [[o.a, o.p, wq, LID + '-sys', 'Your ' + t('a') + ' is right. Find ' + t('q') + ' by substituting back: ' + t(vT(y1) + '=' + D1 + '(' + vT(o.a) + ')+q') + '.'], [-o.a, o.p, cl(y1 + o.a * D1), LID + '-sys', 'Subtract the equations carefully (keep the order the same on both sides).']] }) } },
          { label: 'Range', range: [o.q, up], opt: { p: o.p } }],
          { sol: eqy('a(' + z().binTex('x', o.p) + ')^{2}+q') + '.<br>' + t(ptTex(x1, y1)) + ': ' + t(vT(y1) + '=' + D1 + 'a+q') + '; ' + t(ptTex(x2, y2)) + ': ' + t(vT(y2) + '=' + D2 + 'a+q') + '.<br>Subtract: ' + t(vT(y2 - y1) + '=' + (D2 - D1) + 'a') + ', so ' + t('a=' + rT(o.a)) + '; then ' + t('q=' + vT(y1) + '-' + D1 + '(' + vT(o.a) + ')=' + vT(o.q)) + '.<br>' + eqy(vfTex(o.a, o.p, o.q)) + '; ' + t('a' + (up ? '>' : '<') + '0') + ', so the ' + (up ? 'minimum' : 'maximum') + ' is ' + t(vT(o.q)) + ': range ' + t(z().rangeTex(o.q, up)) + '.',
            hints: ['With ' + t('p') + ' known, write ' + t('y=a(x-p)^{2}+q') + ' and substitute each point: two equations in ' + t('a') + ' and ' + t('q') + '.', 'Subtract the two equations to eliminate ' + t('q') + '.'], text: 'axis + two points: solve for a and q' });
      } }] },

    { num: '9', stem: 'Write each equation in factored form, and determine the vertex.', parts: [
      { id: '9a', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { var rr = nz(r, -7, 4), w = r.pick([2, 4, 6]); return { r: rr, s: rr + w, k: r.pick([-3, -2, -1, 1, 2, 3]) }; }, function (o) { return o.s !== 0 && !(o.r === -3 && o.s === 1) && Math.abs(o.k * Math.pow((o.s - o.r) / 2, 2)) <= 30; });
        var h = (o.r + o.s) / 2, y0 = o.k * (h - o.r) * (h - o.s);
        return z().fields('zeros ' + t(o.r) + ' and ' + t(o.s) + ', passing through ' + t(ptTex(h, y0)), facFields(o.k, o.r, o.s), { sol: facSol(o.k, o.r, o.s, h, y0) + '<br>(The given point is on the axis: it is the vertex.)', hints: HFAC, text: 'zeros + point: factored form, vertex' });
      } },
      { id: '9b', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { var s = r.pick([-10, -8, -6, -4, 4, 6, 8, 10]), x0 = nz(r, -4, 12), pr = x0 * (x0 - s), y0 = nz(r, -15, 15); return { s: s, x0: x0, y0: y0, k: cl(y0 / pr) }; },
          function (o) { return o.x0 !== o.s && o.x0 * 2 !== o.s && !isInt(o.k) && z().toFrac(o.k)[1] <= 6 && Math.abs(o.k) < 3 && !(o.s === 8 && o.k === 0.5); });
        return z().fields('zeros ' + t(0) + ' and ' + t(o.s) + ', passing through ' + t(ptTex(o.x0, o.y0)), facFields(o.k, 0, o.s), { sol: facSol(o.k, 0, o.s, o.x0, o.y0), hints: HFAC.concat(['A zero of ' + t('0') + ' gives the factor ' + t('(x-0)=x') + '.']), text: 'zero at 0 + point: factored form, vertex' });
      } },
      { id: '9c', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { var rr = -r.int(1, 8), s = r.int(1, 8), c = nz(r, -12, 12); return { r: rr, s: s, c: c, k: cl(c / (rr * s)) }; },
          function (o) { return !isInt(o.k) && z().toFrac(o.k)[1] <= 12 && (o.r + o.s) !== 0 && !(o.r === -5 && o.s === 3) && Math.abs(o.k) < 3; });
        return z().fields('zeros ' + t(o.r) + ' and ' + t(o.s) + ', ' + t('y') + '-intercept ' + t(o.c), facFields(o.k, o.r, o.s), { sol: 'The ' + t('y') + '-intercept is the point ' + t(ptTex(0, o.c)) + '.<br>' + facSol(o.k, o.r, o.s, 0, o.c), hints: HFAC, text: 'zeros + y-intercept: factored form, vertex' });
      } }] },

    { num: '10', parts: [
      { id: '10', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { var rr = nz(r, -4, 4), a = nz(r, -4, 4); return { r: rr, a: a, k: a * rr * rr }; }, function (o) { return Math.abs(o.k) <= 40 && AV(o.a, o.r, 0) && Math.abs(o.r) >= 1 && !(o.r === 2 && o.k === -12); });
        var gc = [o.a, -2 * o.a * o.r, o.a * o.r * o.r];
        return z().fields('The graph of a quadratic function touches the ' + t('x') + '-axis only at ' + t('x=' + o.r) + ', and its ' + t('y') + '-intercept is ' + t(o.k) + '. Determine its equation in vertex form and in general form.', [
          { label: 'Vertex form', before: t('y='), expr: { fn: par(o.a, o.r, 0), key: vfTex(o.a, o.r, 0), vertex: { a: o.a, p: o.r, q: 0 }, cands: P5.vfCands(o.a, o.r, 0, { aw: P5.aWrong(o.r, 0, 0, o.k) }) } },
          { label: 'General form', before: t('y='), poly: { target: polyTex(gc), opt: { wrong: P5.genWrongs(o.a, o.r, 0).slice(0, 2).concat([P5.genWrongs(o.a, o.r, 0)[3]]).map(function (w) { return { is: polyTex(w[0]), code: w[1], hint: w[2] }; }) } } }],
          { sol: 'It only touches the ' + t('x') + '-axis at ' + t('x=' + o.r) + ', so the vertex is ' + t(ptTex(o.r, 0)) + ': ' + eqy('a(' + z().binTex('x', o.r) + ')^{2}') + '.<br>' + P5.aSol(o.r, 0, 0, o.k, o.a) + '<br>' + eqy(vfTex(o.a, o.r, 0) + '=' + polyTex(gc)), hints: ['A graph that only touches the ' + t('x') + '-axis at ' + t('r') + ' has its vertex at ' + t('(r,\\ 0)') + ': ' + t('y=a(x-r)^{2}') + '.', 'The ' + t('y') + '-intercept ' + t('k') + ' is the point ' + t('(0,\\ k)') + '.'], text: 'touches the x-axis: both forms' });
      } }] },

    { num: '11', shared: function (r) {
      return pickWhere(function () { var s = r.pick([10, 12, 15, 16, 18, 20, 24, 25, 30]), H = r.int(6, 20); return { s: s, H: H, d: r.int(2, s - 2), u: r.int(2, s - 2), what: r.pick(['A road bridge', 'A footbridge', 'A railway bridge']) }; },
        function (o) { var hc = o.H - o.H * o.u * o.u / (o.s * o.s); return !(o.s === 20 && o.H === 10) && terminates(hc, 2) && hc > 0.5 && o.d !== o.s - o.u && o.u !== o.s - o.d && !isInt(o.H / (o.s * o.s) * 1000) === false && terminates(o.H / (o.s * o.s), 4); });
    },
      stem: function (o) { return o.what + ' is supported by a parabolic arch that spans ' + t(2 * o.s) + ' m at its base and rises to ' + t(o.H) + ' m at its centre.' + P5.arch({ origin: 'mid', wLab: 2 * o.s + ' m', hLab: o.H + ' m' }); },
      parts: [
        { id: '11a', level: 'PRG', make: function (r, o) { var a = cl(-o.H / (o.s * o.s)); return P5.vfPart('Place the origin on the base, directly below the top of the arch. Determine the equation of the arch.', a, 0, o.H, { frac: false, aw: P5.aWrong(0, o.H, o.s, 0).concat([[cl(-o.H / (4 * o.s * o.s)), LID + '-width-half', 'The arch spans ' + 2 * o.s + ' m, so the zeros are ' + t('\\pm ' + o.s) + ', not ' + t('\\pm ' + 2 * o.s) + '.']]), sol: 'Vertex ' + t(ptTex(0, o.H)) + ', zero ' + t(ptTex(o.s, 0)) + ': ' + t('0=' + o.s * o.s + 'a+' + o.H) + ', so ' + t('a=-\\frac{' + o.H + '}{' + o.s * o.s + '}=' + vT(a)) + '.<br>' + eqy(vfTex(a, 0, o.H, 'x', false)), hints: ['The top of the arch is the vertex ' + t('(0,\\ ' + o.H + ')') + '; each end of the base is a zero, half the span from the centre.'], text: 'arch: equation (origin under the top)' }); } },
        { id: '11b', level: 'PRG', make: function (r, o) { var a = -o.H / (o.s * o.s), x = o.s - o.d, y = a * x * x + o.H; return z().apx('The arch is ' + eqy(vfTex(cl(a), 0, o.H, 'x', false)) + '. How high is it ' + t(o.d) + ' m in from one end of the base? Answer to the nearest tenth of a metre.', y, 1, { after: 'm', unit: 'm', cands: [[a * o.d * o.d + o.H, LID + '-end', 'The origin is under the top, so the ends are at ' + t('x=\\pm ' + o.s) + ': ' + o.d + ' m in from an end is ' + t('x=' + o.s + '-' + o.d + '=' + x) + '.']], sol: t('x=' + o.s + '-' + o.d + '=' + x) + ': ' + t('y=' + vT(cl(a)) + '(' + x + ')^{2}+' + o.H + '\\approx ' + K.roundTo(y, 1).toFixed(1)) + ' m', hints: ['Where is a point ' + o.d + ' m in from the end, measured from the centre?'], text: 'arch: height near an end' }); } },
        { id: '11c', level: 'ADV', make: function (r, o) { var a = -o.H / (o.s * o.s), hc = cl(o.H + a * o.u * o.u); return z().num('The arch is ' + eqy(vfTex(cl(a), 0, o.H, 'x', false)) + '. How wide is the arch at a height of ' + t(vT(hc)) + ' m?', 2 * o.u, { after: 'm', unit: 'm', cands: [[o.u, LID + '-width-half', 'Solving gives ' + t('x=\\pm ' + o.u) + ': the width is the distance between them.']], sol: t(vT(hc) + '=' + vT(cl(a)) + 'x^{2}+' + o.H) + ', so ' + t('x^{2}=' + o.u * o.u) + ' and ' + t('x=\\pm ' + o.u) + '. It is ' + t(2 * o.u) + ' m wide there.', hints: ['Set ' + t('y=' + vT(hc)) + ' and solve for ' + t('x') + ' (two values).'], text: 'arch: width at a height' }); } }] },

    { num: '12', shared: function (r) {
      return pickWhere(function () { var X = r.pick([40, 45, 50, 55, 70, 75, 80, 90]), H = r.int(12, 40); return { X: X, H: H, D: X + 5 * r.int(1, X / 5 - 1), what: r.pick(['golf ball', 'baseball', 'football']) }; },
        function (o) { return o.D < 2 * o.X && o.D !== o.X; });
    },
      stem: function (o) { return 'A ' + o.what + ' is hit from the ground. Its path is a parabola that reaches a greatest height of ' + t(o.H) + ' m at a horizontal distance of ' + t(o.X) + ' m from where it was hit.'; },
      parts: [
        { id: '12a', level: 'PRG', make: function (r, o) { var a = cl(-o.H / (o.X * o.X)); return P5.vfPart('Using the starting point as the origin, determine the equation of the path.', a, o.X, o.H, { aw: P5.aWrong(o.X, o.H, 0, 0), sol: 'Vertex ' + t(ptTex(o.X, o.H)) + ', point ' + t('(0,\\ 0)') + ': ' + t('0=' + o.X * o.X + 'a+' + o.H) + ', so ' + t('a=' + rT(a)) + '.<br>' + eqy(vfTex(a, o.X, o.H)), hints: ['The highest point is the vertex; the origin ' + t('(0,\\ 0)') + ' is on the path.'], text: 'ball: equation from the origin' }); } },
        { id: '12b', level: 'PRG', make: function (r, o) { var a = -o.H / (o.X * o.X), y = a * Math.pow(o.D - o.X, 2) + o.H; return z().apx('The path is ' + eqy(vfTex(cl(a), o.X, o.H)) + '. How high is the ball when it is ' + t(o.D) + ' m away horizontally? Answer to the nearest tenth.', y, 1, { after: 'm', unit: 'm', cands: [[a * o.D * o.D + o.H, LID + '-p-sub', 'Substitute into the bracket: ' + t('(' + o.D + '-' + o.X + ')^{2}') + '.']], sol: t('y=' + rT(cl(a)) + '(' + o.D + '-' + o.X + ')^{2}+' + o.H + '=' + rT(cl(a)) + '(' + (o.D - o.X) * (o.D - o.X) + ')+' + o.H + '\\approx ' + K.roundTo(y, 1).toFixed(1)) + ' m', hints: ['Substitute ' + t('x=' + o.D) + '.'], text: 'ball: height at a distance' }); } },
        { id: '12c', level: 'EMG', make: function (r, o) { return z().num('How far away horizontally does it land?', 2 * o.X, { after: 'm', unit: 'm', cands: [[o.X, 'u5l3-half', 'That is where it is highest. It lands as far again past the vertex.']], sol: 'By symmetry, the other zero is ' + t('2(' + o.X + ')-0=' + 2 * o.X) + ' m from the start.', hints: ['The path is symmetric about the vertex, and it starts at the zero ' + t('x=0') + '.'], text: 'ball: landing distance' }); } }] },

    { num: '13', shared: function (r) {
      return pickWhere(function () { var h0 = r.pick([0.8, 1, 1.2, 1.5, 1.6, 2]), rise = r.pick([1, 1.5, 2, 2.5, 3, 3.5]), X = r.pick([1, 1.5, 2, 2.5, 3]); return { h0: h0, H: cl(h0 + rise), X: X, a: cl(-rise / (X * X)) }; },
        function (o) { return terminates(o.a, 4) && !(o.h0 === 1.2 && o.H === 3.2 && o.X === 2) && Math.abs(o.a) <= 4; });
    },
      stem: function (o) { return 'The jet of water from a fountain leaves a nozzle ' + t(vT(o.h0)) + ' m above the ground. It reaches its greatest height, ' + t(vT(o.H)) + ' m, at a horizontal distance of ' + t(vT(o.X)) + ' m from the nozzle. Use the ground below the nozzle as the origin.'; },
      parts: [
        { id: '13a', level: 'PRG', make: function (r, o) { return P5.vfPart('Determine the equation of the jet.', o.a, o.X, o.H, { frac: false, aw: P5.aWrong(o.X, o.H, 0, o.h0), fw: [[cl(-o.H / (o.X * o.X)), o.X, o.H, LID + '-sym', 'The jet starts at ' + t(ptTex(0, o.h0)) + ', not at the origin.']], sol: 'Vertex ' + t(ptTex(o.X, o.H)) + ', point ' + t(ptTex(0, o.h0)) + ': ' + t(vT(o.h0) + '=' + vT(cl(o.X * o.X)) + 'a+' + vT(o.H)) + ', so ' + t('a=' + vT(o.a)) + '.<br>' + eqy(vfTex(o.a, o.X, o.H, 'x', false)), hints: ['The nozzle is the point ' + t('(0,\\ ' + vT(o.h0) + ')') + '; the highest point is the vertex.'], text: 'fountain: equation' }); } },
        { id: '13b', level: 'ADV', make: function (r, o) {
          var m = -o.H / o.a, s = Math.sqrt(m), x = o.X + s;
          return z().apx('The jet is ' + eqy(vfTex(o.a, o.X, o.H, 'x', false)) + '. How far from the nozzle (horizontally) does the water hit the ground? Answer to the nearest hundredth of a metre.', x, 2, { after: 'm', unit: 'm', cands: [[o.X - s, 'u5l3-neg-root', 'That zero is behind the nozzle. Use the other one.'], [2 * o.X, LID + '-sym', 'The jet starts above the ground, so it doesn’t land at ' + t('2p') + '. Solve ' + t('y=0') + '.'], [s, LID + '-from-vertex', 'That is the distance past the vertex. Add the ' + t(vT(o.X)) + ' m to the vertex.']],
            sol: t('0=' + vfTex(o.a, o.X, o.H, 'x', false)) + '<br>' + t('(x-' + vT(o.X) + ')^{2}=\\frac{' + vT(o.H) + '}{' + vT(-o.a) + '}' + (isInt(m) || terminates(m, 3) ? '=' + vT(cl(m)) : '\\approx ' + m.toFixed(3))) + ', so ' + t('x=' + vT(o.X) + '\\pm\\sqrt{' + (terminates(m, 3) ? vT(cl(m)) : m.toFixed(3)) + '}') + '.<br>' + t('x\\approx ' + x.toFixed(2)) + ' (reject ' + t('x\\approx ' + (o.X - s).toFixed(2)) + ', behind the nozzle). The water lands about ' + t(x.toFixed(2)) + ' m away.', hints: ['Set ' + t('y=0') + ' and solve with square roots; keep the root that makes sense.'], text: 'fountain: landing distance' });
        } }] },

    { num: '14', parts: [
      { id: '14', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { var h = r.pick([-3, -2, -1, 1, 2, 3]), a = r.pick([1, 2, 3]), m = nz(r, -9, 9); return { h: h, a: a, m: m, y0: a * h * h + m, x: r.pick([1, -1]) }; },
          function (o) { return !(o.h === -2 && o.m === -5 && o.a === 2) && o.x !== o.h && o.x !== 2 * o.h; });
        var k = o.a * Math.pow(o.x - o.h, 2) + o.m, kA = o.a * Math.pow(o.x + o.h, 2) + o.m, aB = (o.h * o.h) / (o.y0 - o.m), kB = aB * Math.pow(o.x - o.h, 2) + o.m, aD = (o.y0 - o.m) / Math.abs(o.h), kD = aD * Math.pow(o.x - o.h, 2) + o.m;
        return z().mc(r, 'A quadratic function has a minimum value of ' + t(o.m) + ' at ' + t('x=' + o.h) + ', and its graph passes through ' + t(ptTex(0, o.y0)) + ' and ' + t(ptTex(o.x, 'k').replace('k', 'k')) + '. The value of ' + t('k') + ' is', [
          { html: t(rT(cl(k))), right: true }, { html: t(rT(cl(kA))), why: 'The vertex is at ' + t('x=' + o.h) + ': the bracket is ' + t('(' + z().binTex('x', o.h) + ')') + '.', code: 'u5l3-p-sign' },
          { html: t(rT(cl(kB))), why: 'Solve ' + t(vT(o.y0 - o.m) + '=' + o.h * o.h + 'a') + ' by dividing by ' + t(o.h * o.h) + '.', code: LID + '-inv' }, { html: t(rT(cl(kD))), why: 'Square the bracket when you substitute ' + t('(0,\\ ' + o.y0 + ')') + ': ' + t('(0' + sT(-o.h) + ')^{2}=' + o.h * o.h) + '.', code: LID + '-nosq' }],
          eqy('a(' + z().binTex('x', o.h) + ')^{2}' + sT(o.m)) + '; ' + t(o.y0 + '=' + o.h * o.h + 'a' + sT(o.m) + '\\Rightarrow a=' + o.a) + '.<br>' + t('k=' + o.a + '(' + o.x + sT(-o.h) + ')^{2}' + sT(o.m) + '=' + k) + '.', ['The minimum value and where it occurs give the vertex. Use ' + t('(0,\\ ' + o.y0 + ')') + ' to find ' + t('a') + ', then substitute ' + t('x=' + o.x) + '.'], 'MC: k from the vertex and a point');
      } }] },

    { num: '15', parts: [
      { id: '15', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { var rr = -r.int(1, 6), s = r.int(1, 7), x0 = r.int(rr + 1, s - 1), k = r.pick([-0.5, 0.5, -2, 2, -1 / 3, 1 / 3, -1.5, 3]); return { r: rr, s: s, x0: x0, k: k, y0: cl(k * (x0 - rr) * (x0 - s)) }; },
          function (o) { return isInt(o.y0) && o.y0 !== 0 && Math.abs(o.y0) <= 30 && !same(Math.abs(o.k), 1) && !(o.r === -2 && o.s === 4 && o.x0 === 2) && o.r + o.s !== 0; });
        var F = function (k, rr, s) { return eqy(facT(k, rr, s)); };
        return z().mc(r, 'A parabola has ' + t('x') + '-intercepts ' + t(o.r) + ' and ' + t(o.s) + ' and passes through ' + t(ptTex(o.x0, o.y0)) + '. Its equation is', [
          { html: F(o.k, o.r, o.s), right: true }, { html: F(o.k, -o.r, -o.s), why: 'A zero of ' + t(o.r) + ' gives the factor ' + t('(' + z().binTex('x', o.r) + ')') + '.', code: LID + '-zero-sign' },
          { html: F(cl(1 / o.k), o.r, o.s), why: 'Solve for ' + t('a') + ' by dividing by the product of the brackets, ' + t(vT(cl((o.x0 - o.r) * (o.x0 - o.s)))) + '.', code: LID + '-inv' }, { html: F(-o.k, o.r, o.s), why: 'Check by substituting ' + t('x=' + o.x0) + ': this one gives ' + t('y=' + vT(-o.y0)) + '.', code: 'sign' }],
          eqy('a(' + z().binTex('x', o.r) + ')(' + z().binTex('x', o.s) + ')') + '; ' + t(vT(o.y0) + '=a(' + o.x0 + sT(-o.r) + ')(' + o.x0 + sT(-o.s) + ')=' + vT(cl((o.x0 - o.r) * (o.x0 - o.s))) + 'a') + ', so ' + t('a=' + rT(o.k)) + '.', HFAC.slice(0, 1), 'MC: factored form from zeros and a point');
      } }] },

    { num: '16', parts: [
      { id: '16', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { var p = nz(r, -6, 8), d = nz(r, -7, 7), q = -r.int(2, 20); return { p: p, q: q, d: d, a: -q / (d * d) }; },
          function (o) { return Math.abs(o.d) >= 2 && o.a >= 0.1 && o.a < 10 && !(o.p === 4 && o.q === -9) && !isInt(o.a); });
        var x1 = o.p + o.d;
        return z().apx('<i>(Numerical Response)</i> A parabola has vertex ' + t(ptTex(o.p, o.q)) + ' and passes through ' + t(ptTex(x1, 0)) + '. When its equation is written as ' + t('y=a(x-p)^{2}+q') + ', the value of ' + t('a') + ', to the nearest hundredth, is ______.', o.a, 2, { nr: true, cands: [[o.d * o.d / -o.q, LID + '-inv', 'Solve ' + t(vT(-o.q) + '=' + o.d * o.d + 'a') + ' by dividing by ' + t(o.d * o.d) + '.'], [Math.abs(o.q / o.d), LID + '-nosq', 'Square the bracket: ' + t('(' + x1 + sT(-o.p) + ')^{2}=' + o.d * o.d) + '.']],
          sol: t('0=a(' + x1 + sT(-o.p) + ')^{2}' + sT(o.q) + '\\Rightarrow ' + o.d * o.d + 'a=' + (-o.q) + '\\Rightarrow a=\\frac{' + (-o.q) + '}{' + o.d * o.d + '}\\approx ' + K.roundTo(o.a, 2).toFixed(2)) + '.', hints: HVP.slice(0, 1), text: 'NR: a to the nearest hundredth' });
      } }] },

    { num: '17', parts: [
      { id: '17', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { var p = r.int(-30, 40) / 10, x1 = r.int(-50, 30) / 10; return { p: p, x1: x1, y: nz(r, -9, 9), k: cl(2 * p - x1) }; },
          function (o) { return o.k > 0 && o.k < 100 && Math.abs(o.x1 - o.p) >= 1 && !isInt(o.p) && !isInt(o.x1) && o.k !== o.x1 && !(o.p === 1.5 && o.x1 === -2.3); });
        return z().apx('<i>(Numerical Response)</i> The points ' + t(ptTex(o.x1, o.y)) + ' and ' + t('(k,\\ ' + o.y + ')') + ', ' + t('k\\ne ' + vT(o.x1)) + ', are on the graph of ' + eqy('a(x' + sT(-o.p) + ')^{2}+q') + '. The value of ' + t('k') + ', to the nearest tenth, is ______.', o.k, 1, { nr: true, cands: [[-o.x1, LID + '-axis-k', 'Reflect in the axis ' + t('x=' + vT(o.p)) + ', not in the ' + t('y') + '-axis.'], [o.p + o.x1, LID + '-axis-k', 'Find how far ' + t(vT(o.x1)) + ' is from the axis, then go the same distance past it: ' + t('k=2p-x_1') + '.'], [2 * o.p + o.x1, LID + '-axis-k', 'Check the signs in ' + t('k=2p-x_1') + '.']],
          sol: 'The points are at the same height, so they are symmetric about the axis ' + t('x=' + vT(o.p)) + '. ' + t(vT(o.x1)) + ' is ' + t(vT(cl(Math.abs(o.p - o.x1)))) + ' to the ' + (o.x1 < o.p ? 'left' : 'right') + ', so ' + t('k=2(' + vT(o.p) + ')-' + P(o.x1) + '=' + vT(o.k)) + '.', hints: ['Points at the same height are the same distance from the axis ' + t('x=p') + ' on opposite sides.'], text: 'NR: symmetric point' });
      } }] }
  ];

  /* Question 3 and Extra A4: read the vertex and a lattice point from the graph */
  function graphPts(r, aSet, dSet) {
    return pickWhere(function () {
      var a = r.pick(aSet), den = z().toFrac(Math.abs(a))[1], d = dSet ? r.pick(dSet) : sgn(r) * den * r.pick(den === 2 ? [1, 2] : [1]);
      return { a: a, p: nz(r, -4, 4), q: nz(r, -5, 5), d: d };
    }, function (o) { var y1 = o.a * o.d * o.d + o.q; return AV(o.a, o.p, o.q) && isInt(y1) && Math.abs(y1) <= 9 && Math.abs(y1 - o.q) >= 1 && Math.abs(o.p + o.d) <= 7 && Math.abs(o.d) >= 1; });
  }
  function graphQ(r, aSet, dSet, two) {
    var o = graphPts(r, aSet, dSet), x1 = o.p + o.d, y1 = cl(o.a * o.d * o.d + o.q), marks = [[x1, y1]];
    if (two) { var den = z().toFrac(Math.abs(o.a))[1], d2 = -Math.sign(o.d) * den, y2 = cl(o.a * d2 * d2 + o.q); if (Math.abs(y2) <= 9 && d2 !== -o.d) marks.push([o.p + d2, y2]); }
    return P5.vfPart('The graph of a quadratic function is shown.' + P5.graphFig(o.a, o.p, o.q, marks), o.a, o.p, o.q, { aw: P5.aWrong(o.p, o.q, x1, y1), fw: same(o.p, 0) ? [] : [[o.a, -o.p, o.q, 'u5l3-p-sign', 'Read the vertex carefully: it is at ' + t('x=' + o.p) + ', so the bracket is ' + t('(' + z().binTex('x', o.p) + ')') + '.']],
      sol: 'Vertex ' + t(ptTex(o.p, o.q)) + ', point ' + t(ptTex(x1, y1)) + ':<br>' + P5.aSol(o.p, o.q, x1, y1, o.a) + '<br>' + eqy(vfTex(o.a, o.p, o.q)), hints: ['Read the vertex and another marked point (a point where the curve crosses grid lines exactly).'].concat(HVP.slice(0, 1)), text: 'equation from a graph' + (two ? ' (a fraction)' : '') });
  }

  var EXTRA = [
    { num: 'A1', section: 'A. Skills', stem: 'Write an equation in vertex form for the parabola with the given vertex that passes through the given point.', parts: [
      { id: 'eA1a', level: 'BEG', make: function (r) { return vpQ(vpGen(r, { aSet: [2, 3, 4, 5, 6], dset: [-1, 1] }), '', false, 'vertex + point (d = ±1)'); } },
      { id: 'eA1b', level: 'BEG', make: function (r) { return vpQ(vpGen(r, { aSet: [-2, -3, -4, -5], dset: [-2, 2] }), '', false, 'vertex + point, a < 0'); } },
      { id: 'eA1c', level: 'EMG', make: function (r) { return vpQ(vpGen(r, { frac: true, q0: true, sign: 1, dset: [-4, -3, -2, 2, 3, 4] }), '', false, 'vertex on the x-axis'); } },
      { id: 'eA1d', level: 'EMG', make: function (r) { return vpQ(vpGen(r, { frac: true, p0: true, sign: -1, dset: [-3, -2, 2, 3] }), '', false, 'vertex on the y-axis'); } }] },
    { num: 'A2', parts: [
      { id: 'eA2', level: 'EMG', make: function (r) {
        var o = vpGen(r, { aSet: [2, 3, -2, -3, 4, -1], yint: true }), gc = [o.a, -2 * o.a * o.p, o.a * o.p * o.p + o.q];
        return z().fields('A parabola has vertex ' + t(ptTex(o.p, o.q)) + ' and ' + t('y') + '-intercept ' + t(o.y1) + '. Write its equation in vertex form and in general form.', [
          { label: 'Vertex form', before: t('y='), expr: { fn: par(o.a, o.p, o.q), key: vfTex(o.a, o.p, o.q), vertex: { a: o.a, p: o.p, q: o.q }, cands: P5.vfCands(o.a, o.p, o.q, { aw: P5.aWrong(o.p, o.q, 0, o.y1) }) } },
          { label: 'General form', before: t('y='), poly: { target: polyTex(gc), opt: { wrong: P5.genWrongs(o.a, o.p, o.q).map(function (w) { return { is: polyTex(w[0]), code: w[1], hint: w[2] }; }) } } }],
          { sol: P5.aSol(o.p, o.q, 0, o.y1, o.a) + '<br>' + eqy(vfTex(o.a, o.p, o.q)) + '<br>' + P5.genSol(o.a, o.p, o.q), hints: ['The ' + t('y') + '-intercept ' + t(o.y1) + ' is the point ' + t('(0,\\ ' + o.y1 + ')') + '.'].concat(HVP.slice(0, 1)), text: 'vertex + y-intercept: both forms' });
      } }] },
    { num: 'A3', parts: [
      { id: 'eA3', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { var rr = nz(r, -6, 5), w = r.pick([2, 4, 6, 8]), k = r.pick([-3, -2, -1, 1, 2, 3]), x0 = r.int(rr - 2, rr + w + 2); return { r: rr, s: rr + w, k: k, x0: x0 }; },
          function (o) { var y0 = o.k * (o.x0 - o.r) * (o.x0 - o.s); return o.s !== 0 && o.x0 !== o.r && o.x0 !== o.s && 2 * o.x0 !== o.r + o.s && Math.abs(y0) <= 40 && !(o.r === 1 && o.s === 7) && Math.abs(o.k * Math.pow((o.s - o.r) / 2, 2)) <= 40; });
        var y0 = o.k * (o.x0 - o.r) * (o.x0 - o.s);
        return z().fields('A parabola has zeros ' + t(o.r) + ' and ' + t(o.s) + ' and passes through ' + t(ptTex(o.x0, y0)) + '. Write its equation in factored form and state its vertex.', facFields(o.k, o.r, o.s), { sol: facSol(o.k, o.r, o.s, o.x0, y0), hints: HFAC, text: 'zeros + point: factored form, vertex' });
      } }] },
    { num: 'A4', parts: [
      { id: 'eA4', level: 'PRG', make: function (r) {
        var o = graphPts(r, [2, -2, 1, -1, 3], [-2, -1, 1, 2]), x1 = o.p + o.d, y1 = o.a * o.d * o.d + o.q, c = o.a * o.p * o.p + o.q, up = o.a > 0;
        return z().fields('Write the equation of the parabola shown in vertex form, then state its range and its ' + t('y') + '-intercept. The marked points have integer coordinates.' + P5.graphFig(o.a, o.p, o.q, [[x1, y1]]), [
          { label: 'Vertex form', before: t('y='), expr: { fn: par(o.a, o.p, o.q), key: vfTex(o.a, o.p, o.q), vertex: { a: o.a, p: o.p, q: o.q }, cands: P5.vfCands(o.a, o.p, o.q, { aw: P5.aWrong(o.p, o.q, x1, y1) }) } },
          { label: 'Range', range: [o.q, up], opt: { p: o.p } },
          { label: t('y') + '-intercept', name: 'y-intercept', ans: c, cands: [[o.q, LID + '-yint-q', t('q') + ' is the vertex’s ' + t('y') + '-value. Put ' + t('x=0') + '.']] }],
          { sol: 'Vertex ' + t(ptTex(o.p, o.q)) + ', point ' + t(ptTex(x1, y1)) + ': ' + P5.aSol(o.p, o.q, x1, y1, o.a) + '<br>' + eqy(vfTex(o.a, o.p, o.q)) + '<br>Range ' + t(z().rangeTex(o.q, up)) + '; ' + t('y') + '-intercept ' + t(aTex(o.a) + '(' + o.p * o.p + ')' + sT(o.q) + '=' + c) + '.', hints: ['Read the vertex and the other marked point, then find ' + t('a') + '.'], text: 'graph: vertex form, range, y-intercept' });
      } }] },

    { num: 'B1', section: 'B. Applying', shared: function (r) {
      return pickWhere(function () { var a = r.pick([-1, -2, -3, 1, 2, -0.5]), d = r.pick(a === -0.5 ? [-2, 2] : [-3, -2, -1, 1, 2, 3]); return { a: a, p: nz(r, -5, 5), d: d, q: -a * d * d }; },
        function (o) { return AV(o.a, o.p, o.q) && Math.abs(o.q) <= 18 && o.p + o.d !== 0 && o.p - o.d !== 0 && Math.abs(o.a * o.p * o.p + o.q) <= 60; });
    },
      stem: function (o) { return 'A quadratic function has vertex ' + t(ptTex(o.p, o.q)) + ', and one ' + t('x') + '-intercept is ' + t(o.p + o.d) + '.'; },
      parts: [
        { id: 'eB1a', level: 'PRG', make: function (r, o) {
          var r0 = o.p + o.d, gc = [o.a, -2 * o.a * o.p, o.a * o.p * o.p + o.q];
          return z().fields('Determine its equation in vertex form and in general form.', [
            { label: 'Vertex form', before: t('y='), expr: { fn: par(o.a, o.p, o.q), key: vfTex(o.a, o.p, o.q), vertex: { a: o.a, p: o.p, q: o.q }, cands: P5.vfCands(o.a, o.p, o.q, { aw: P5.aWrong(o.p, o.q, r0, 0) }) } },
            { label: 'General form', before: t('y='), poly: { target: polyTex(gc), opt: { wrong: P5.genWrongs(o.a, o.p, o.q).map(function (w) { return { is: polyTex(w[0]), code: w[1], hint: w[2] }; }) } } }],
            { sol: P5.aSol(o.p, o.q, r0, 0, o.a) + '<br>' + eqy(vfTex(o.a, o.p, o.q)) + '<br>' + P5.genSol(o.a, o.p, o.q), hints: ['The ' + t('x') + '-intercept is the point ' + t('(' + r0 + ',\\ 0)') + '.'].concat(HVP.slice(0, 1)), text: 'vertex + x-intercept: both forms' });
        } },
        { id: 'eB1b', level: 'EMG', make: function (r, o) {
          var r0 = o.p + o.d, other = o.p - o.d;
          return z().fields('State the other ' + t('x') + '-intercept and the range.', [
            { label: 'Other ' + t('x') + '-intercept', name: 'Other x-intercept', ans: other, cands: [[-r0, 'u5l3-mirror', 'Reflect in the axis ' + t('x=' + o.p) + ', not the ' + t('y') + '-axis.'], [o.p + 2 * o.d, LID + '-axis-k', 'Go the same distance on the <b>other</b> side of the axis.']] },
            { label: 'Range', range: [o.q, o.a > 0], opt: { p: o.p } }],
            { sol: 'Other intercept ' + t('2(' + o.p + ')-' + P(r0) + '=' + other) + '. Range ' + t(z().rangeTex(o.q, o.a > 0)) + '.', hints: ['The axis ' + t('x=' + o.p) + ' is halfway between the ' + t('x') + '-intercepts.'], text: 'other x-intercept and range' });
        } }] },
    { num: 'B2', parts: [
      { id: 'eB2', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { var a = r.pick([1, 2, -1, -2, 3, 0.5]), p = nz(r, -5, 5), d1 = r.pick([-2, -1, 1, 2]), d2 = r.pick([2, 3, 4, -3, -4]); return { a: a, p: p, q: nz(r, -9, 9), d1: d1, d2: d2 }; },
          function (o) { var y1 = o.a * o.d1 * o.d1 + o.q, y2 = o.a * o.d2 * o.d2 + o.q; return AV(o.a, o.p, o.q) && o.d1 * o.d1 < o.d2 * o.d2 && isInt(y1) && isInt(y2) && Math.abs(y2) <= 40 && !(o.p === -3 && o.a === 1 && o.q === -2); });
        var x1 = o.p + o.d1, x2 = o.p + o.d2, y1 = o.a * o.d1 * o.d1 + o.q, y2 = o.a * o.d2 * o.d2 + o.q, D1 = o.d1 * o.d1, D2 = o.d2 * o.d2, up = o.a > 0;
        return z().fields('The graph of ' + eqy('a(' + z().binTex('x', o.p) + ')^{2}+q') + ' passes through ' + t(ptTex(x1, y1)) + ' and ' + t(ptTex(x2, y2)) + '. Determine ' + t('a') + ' and ' + t('q') + ', and state the minimum or maximum value.', [
          { label: t('a='), name: 'a', ans: o.a, cands: [[-o.a, LID + '-sys', 'Subtract the equations carefully, keeping the same order on both sides.'], [cl(1 / o.a), LID + '-inv', 'Divide by the coefficient of ' + t('a') + '.']] },
          { label: t('q='), name: 'q', ans: o.q, cands: [[cl(y1 + o.a * D1), LID + '-sys', 'Substitute back: ' + t(y1 + '=' + D1 + 'a+q') + ', so ' + t('q=' + y1 + '-' + D1 + 'a') + '.']] },
          { label: 'Max or min?', mm: up ? 'min' : 'max' }, { label: 'Value', ans: o.q, cands: [[o.p, 'u5l3-mm-p', 'The value is the vertex’s ' + t('y') + '-coordinate, ' + t('q') + '.']] }],
          { sol: t(vT(y1) + '=' + D1 + 'a+q') + ' and ' + t(vT(y2) + '=' + D2 + 'a+q') + '. Subtract: ' + t(vT(y2 - y1) + '=' + (D2 - D1) + 'a') + ', so ' + t('a=' + rT(o.a)) + '; ' + t('q=' + vT(o.q)) + '.<br>' + eqy(vfTex(o.a, o.p, o.q)) + ' has a ' + (up ? 'minimum' : 'maximum') + ' value of ' + t(vT(o.q)) + '.', hints: ['Substitute each point: two equations in ' + t('a') + ' and ' + t('q') + '. Subtract to eliminate ' + t('q') + '.'], text: 'two points: a, q and the max/min' });
      } }] },
    { num: 'B3', shared: function (r) {
      return pickWhere(function () { var W = r.pick([6, 8, 10, 12, 16]), H = r.pick([4, 5, 6, 7, 8, 9]), w = r.pick([2, 2.4, 2.5, 3, 3.5, 4]), x = w / 2, ht = H - H * x * x / (W * W / 4); return { W: W, H: H, w: w, ht: ht, h: cl(Math.floor(ht * 10) / 10 + r.pick([-0.3, -0.2, 0.2, 0.3])) }; },
        function (o) { return o.w < o.W * 0.6 && o.ht > 2 && o.h > 1 && !(o.W === 8 && o.H === 6) && Math.abs(o.h - o.ht) > 0.05 && o.h < o.H; });
    },
      stem: function (o) { return 'The entrance to a tunnel is a parabola ' + t(o.W) + ' m wide at the road and ' + t(o.H) + ' m high at its centre.'; },
      parts: [
        { id: 'eB3a', level: 'PRG', make: function (r, o) { var p = o.W / 2, a = cl(-o.H / (p * p)); return P5.vfPart('With the origin at the left edge of the road, determine the equation of the entrance.', a, p, o.H, { aw: P5.aWrong(p, o.H, 0, 0).concat([[cl(-o.H / (o.W * o.W)), LID + '-width-half', 'From the edge to the centre is half the width, ' + t(p) + ' m.']]), fw: [[a, 0, o.H, 'value', 'With the origin at the left edge, the vertex is at the centre, ' + t(ptTex(p, o.H)) + '.']], sol: 'Zeros ' + t(0) + ' and ' + t(o.W) + ', vertex ' + t(ptTex(p, o.H)) + ': ' + t('0=' + p * p + 'a+' + o.H) + ', so ' + t('a=' + rT(a)) + '.<br>' + eqy(vfTex(a, p, o.H)), hints: ['The vertex is halfway along the road, at the top; the left edge ' + t('(0,\\ 0)') + ' is on the parabola.'], text: 'tunnel: equation (origin at the edge)' }); } },
        { id: 'eB3b', level: 'ADV', make: function (r, o) {
          var p = o.W / 2, a = -o.H / (p * p), x = o.w / 2, fits = o.ht > o.h, f2 = function (v) { return t(K.roundTo(v, 2).toFixed(2)); };
          var wrongX = a * Math.pow(o.w / 2 - p, 2) + o.H, hAtW = a * o.w * o.w + o.H;
          return z().mc(r, 'A truck ' + t(vT(o.w)) + ' m wide and ' + t(vT(o.h)) + ' m tall drives through the centre of the tunnel (' + eqy(vfTex(cl(a), p, o.H)) + '). Will it fit?', [
            { html: (fits ? '<b>Yes</b>: ' : '<b>No</b>: ') + 'at the truck’s edges the opening is about ' + f2(o.ht) + ' m high, ' + (fits ? 'more' : 'less') + ' than ' + t(vT(o.h)) + ' m.', right: true },
            { html: (!fits ? '<b>Yes</b>: ' : '<b>No</b>: ') + 'at the truck’s edges the opening is about ' + f2(hAtW) + ' m high.', why: 'The truck is centred, so each edge is ' + t(vT(x)) + ' m from the centre (half its width), at ' + t('x=' + vT(p - x)) + ' or ' + t('x=' + vT(p + x)) + '.', code: LID + '-end' },
            { html: '<b>Yes</b>: the tunnel is ' + t(o.H) + ' m high, more than ' + t(vT(o.h)) + ' m.', why: 'The roof is lower at the truck’s edges than at the centre: check the height there.', code: LID + '-centre' },
            { html: (wrongX > o.h ? '<b>Yes</b>: ' : '<b>No</b>: ') + 'at ' + t('x=' + vT(x)) + ' the opening is about ' + f2(wrongX) + ' m high.', why: 'With the origin at the left edge, the truck’s edges are at ' + t('x=' + vT(p - x)) + ' and ' + t('x=' + vT(p + x)) + '.', code: LID + '-end' }],
            'The edges are ' + t(vT(x)) + ' m from the centre: ' + t('x=' + vT(p - x)) + '.<br>' + t('y=' + rT(cl(a)) + '(' + vT(x) + ')^{2}+' + o.H + '\\approx ' + K.roundTo(o.ht, 2).toFixed(2)) + ' m, ' + (fits ? 'more' : 'less') + ' than ' + t(vT(o.h)) + ' m: ' + (fits ? 'it fits.' : 'it doesn’t fit.'), ['Find the height of the opening above each edge of the truck.'], 'tunnel: will the truck fit?');
        } }] },
    { num: 'B4', shared: function (r) {
      return pickWhere(function () { var X = r.pick([10, 12, 15, 18, 20, 25]), H = r.int(4, 14); return { X: X, H: H, D: X + r.int(2, X - 2) }; }, function (o) { return !(o.X === 15 && o.H === 9); });
    },
      stem: function (o) { return 'A soccer ball is kicked from the ground and follows a parabolic path. It reaches a greatest height of ' + t(o.H) + ' m at a horizontal distance of ' + t(o.X) + ' m. Use the kicking point as the origin.'; },
      parts: [
        { id: 'eB4a', level: 'PRG', make: function (r, o) { var a = cl(-o.H / (o.X * o.X)); return P5.vfPart('Determine the equation of the path.', a, o.X, o.H, { aw: P5.aWrong(o.X, o.H, 0, 0), sol: 'Vertex ' + t(ptTex(o.X, o.H)) + ', point ' + t('(0,\\ 0)') + ': ' + t('0=' + o.X * o.X + 'a+' + o.H) + ', so ' + t('a=' + rT(a)) + '.<br>' + eqy(vfTex(a, o.X, o.H)), hints: ['The highest point is the vertex; the kicking point ' + t('(0,\\ 0)') + ' is on the path.'], text: 'soccer: equation' }); } },
        { id: 'eB4b', level: 'PRG', make: function (r, o) { var a = -o.H / (o.X * o.X), y = a * Math.pow(o.D - o.X, 2) + o.H; return z().apx('Using ' + eqy(vfTex(cl(a), o.X, o.H)) + ', how high is the ball at a horizontal distance of ' + t(o.D) + ' m? Answer to the nearest tenth of a metre.', y, 1, { after: 'm', unit: 'm', cands: [[a * o.D * o.D + o.H, LID + '-p-sub', 'Substitute into the bracket: ' + t('(' + o.D + '-' + o.X + ')^{2}') + '.']], sol: t('y=' + rT(cl(a)) + '(' + (o.D - o.X) + ')^{2}+' + o.H + '\\approx ' + K.roundTo(y, 1).toFixed(1)) + ' m', hints: ['Substitute ' + t('x=' + o.D) + '.'], text: 'soccer: height' }); } },
        { id: 'eB4c', level: 'EMG', make: function (r, o) { return z().num('Where does the ball land?', 2 * o.X, { after: 'm from the kicking point', unit: 'm', cands: [[o.X, 'u5l3-half', 'That is where it is highest.']], sol: 'By symmetry it lands ' + t('2(' + o.X + ')=' + 2 * o.X) + ' m away.', hints: ['Use symmetry: it starts at the zero ' + t('x=0') + '.'], text: 'soccer: landing' }); } }] },
    { num: 'B5', parts: [
      { id: 'eB5', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { var p = nz(r, -4, 4), q = nz(r, -8, 8), a = r.pick([-3, -2, 2, 3, -4, 4]); return { p: p, q: q, a: a, c: a * p * p + q }; }, function (o) { return AV(o.a, o.p, o.q) && Math.abs(o.c) <= 40 && !(o.p === -1 && o.q === 4) && o.c !== o.q; });
        var aD = cl((o.c - o.q) / Math.abs(o.p)), E = function (a, p, q) { return eqy(vfTex(a, p, q)); };
        return z().mc(r, 'A parabola has vertex ' + t(ptTex(o.p, o.q)) + ' and ' + t('y') + '-intercept ' + t(o.c) + '. Its equation is', [
          { html: E(o.a, o.p, o.q), right: true }, { html: E(o.a, -o.p, o.q), why: 'This one has vertex ' + t(ptTex(-o.p, o.q)) + '.', code: 'u5l3-p-sign' },
          { html: E(-o.a, o.p, -o.q), why: 'This one has vertex ' + t(ptTex(o.p, -o.q)) + '.', code: 'u5l3-q-sign' }, { html: same(aD, o.a) ? E(cl(o.a / 2), o.p, o.q) : E(aD, o.p, o.q), why: 'Check its ' + t('y') + '-intercept: put ' + t('x=0') + '.', code: LID + '-nosq' }],
          t(o.c + '=a(0' + sT(-o.p) + ')^{2}' + sT(o.q) + '\\Rightarrow a=' + o.a) + '.', HVP.slice(0, 1), 'MC: vertex + y-intercept');
      } }] },
    { num: 'B6', parts: [
      { id: 'eB6', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { var p = r.int(1, 6), Q = r.int(4, 20), c = r.int(-6, Q - 1); return { p: p, Q: Q, c: c, a: (c - Q) / (p * p) }; }, function (o) { var x = o.p + Math.sqrt(-o.Q / o.a); return isInt(o.a * 4) && x < 100 && !isInt(cl(x)) && !(o.p === 2 && o.Q === 12 && o.c === 4); });
        var m = -o.Q / o.a, x = o.p + Math.sqrt(m);
        return z().apx('<i>(Numerical Response)</i> A parabola has vertex ' + t(ptTex(o.p, o.Q)) + ' and passes through ' + t(ptTex(0, o.c)) + '. Its positive ' + t('x') + '-intercept, to the nearest tenth, is ______.', x, 1, { nr: true, cands: [[Math.sqrt(m), LID + '-from-vertex', 'That is the distance from the vertex: add ' + t('p=' + o.p) + '.'], [o.p - Math.sqrt(m), 'u5l3-neg-root', 'That is the other intercept.']],
          sol: t(o.c + '=' + o.p * o.p + 'a+' + o.Q + '\\Rightarrow a=' + rT(o.a)) + '. ' + t('0=' + vfTex(o.a, o.p, o.Q) + '\\Rightarrow (x-' + o.p + ')^{2}=' + rT(cl(m))) + ', so ' + t('x=' + o.p + '+\\sqrt{' + rT(cl(m)) + '}\\approx ' + K.roundTo(x, 1).toFixed(1)) + '.', hints: HVP.slice(0, 1).concat(['Then set ' + t('y=0') + ' and solve with square roots.']), text: 'NR: positive x-intercept' });
      } }] },

    { num: 'C1', section: 'C. Stretch', parts: [
      { id: 'eC1', level: 'MAS', make: function (r) {
        var o = pickWhere(function () { var a = r.pick([1, 2, -1, -2, 3, 0.5]), h = nz(r, -4, 5), w = r.int(1, 3); return { a: a, h: h, q: nz(r, -8, 8), w: w, d3: r.pick([-4, -3, 3, 4]) }; },
          function (o) { var y = o.a * o.w * o.w + o.q, y3 = o.a * o.d3 * o.d3 + o.q; return AV(o.a, o.h, o.q) && o.d3 * o.d3 !== o.w * o.w && isInt(y) && isInt(y3) && Math.abs(y3) <= 40 && !(o.h === 2 && o.q === 1 && o.a === 1); });
        var x1 = o.h - o.w, x2 = o.h + o.w, y = o.a * o.w * o.w + o.q, x3 = o.h + o.d3, y3 = o.a * o.d3 * o.d3 + o.q;
        return P5.vfPart('A parabola passes through ' + t(ptTex(x1, y)) + ', ' + t(ptTex(x2, y)) + ' and ' + t(ptTex(x3, y3)) + '. Determine its equation in vertex form.', o.a, o.h, o.q, { fw: [[o.a, -o.h, o.q, 'u5l3-p-sign', 'The axis is halfway between ' + t(x1) + ' and ' + t(x2) + ': ' + t('x=' + o.h) + '.'], [cl((y3 - y) / (o.d3 * o.d3)), o.h, y, LID + '-vertex-pt', t('y=' + y) + ' isn’t the vertex’s value: the vertex is between the two points at that height. Use two unknowns, ' + t('a') + ' and ' + t('q') + '.']],
          sol: t(ptTex(x1, y)) + ' and ' + t(ptTex(x2, y)) + ' are at the same height, so the axis is ' + t('x=\\frac{' + x1 + '+' + P(x2) + '}{2}=' + o.h) + '.<br>' + eqy('a(' + z().binTex('x', o.h) + ')^{2}+q') + ': ' + t(y + '=' + o.w * o.w + 'a+q') + ' and ' + t(y3 + '=' + o.d3 * o.d3 + 'a+q') + ', so ' + t('a=' + rT(o.a)) + ', ' + t('q=' + o.q) + '.<br>' + eqy(vfTex(o.a, o.h, o.q)), hints: ['Two of the points are at the same height: find the axis first.', 'Then write ' + t('y=a(x-p)^{2}+q') + ' and use two points to get two equations.'], text: 'three points: vertex form' });
      } }] },
    { num: 'C2', parts: [
      { id: 'eC2', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { var p = nz(r, -5, 5), h = r.int(1, 5), k = r.pick([1, 2, -1, -2, 0.5, 3]); return { p: p, h: h, k: k, q: -k * h * h }; }, function (o) { return !(o.p === 1 && o.q === -16) && o.p - o.h !== 0 && o.p + o.h !== 0 && Math.abs(o.q) <= 40; });
        var rr = o.p - o.h, s = o.p + o.h, w = [{ is: facT(o.k, -rr, -s), code: LID + '-zero-sign', hint: 'A zero of ' + t(rr) + ' gives the factor ' + t('(' + z().binTex('x', rr) + ')') + '.' }, { is: facT(cl(o.k / 4), o.p - 2 * o.h, o.p + 2 * o.h), code: LID + '-width-half', hint: 'The zeros are ' + t(2 * o.h) + ' apart, so each is ' + t(o.h) + ' from the axis.' }];
        return z().fields('A parabola has vertex ' + t(ptTex(o.p, o.q)) + ', and its two ' + t('x') + '-intercepts are ' + t(2 * o.h) + ' units apart. Determine its equation in factored form.', [{ label: 'Factored form', before: t('y='), fac: { target: facT(o.k, rr, s), opt: { wrong: w } } }],
          { sol: 'The zeros are ' + t(o.h) + ' units on each side of ' + t('x=' + o.p) + ': ' + t(rr) + ' and ' + t(s) + '.<br>' + eqy('a(' + z().binTex('x', rr) + ')(' + z().binTex('x', s) + ')') + '; ' + t(o.q + '=a(' + o.h + ')(' + (-o.h) + ')\\Rightarrow a=' + rT(o.k)) + '.<br>' + eqy(facT(o.k, rr, s)), hints: ['The axis is halfway between the zeros, so each zero is half the distance from it.'], text: 'vertex + distance between zeros: factored form' });
      } }] },
    { num: 'C3', shared: function (r) {
      return pickWhere(function () { var T = r.pick([100, 120, 160, 200, 240, 300]), Hh = r.pick([30, 40, 45, 50, 60, 80]), L = r.int(2, 9); return { T: T, H: Hh, L: L, d: 10 * r.int(1, T / 20 - 1) }; },
        function (o) { var a = (o.H - o.L) / (o.T * o.T / 4); return terminates(a, 6) && !(o.T === 200 && o.H === 50 && o.L === 5); });
    },
      stem: function (o) { return 'The main cable of a suspension bridge hangs in a parabola between two towers ' + t(o.T) + ' m apart. The cable is attached ' + t(o.H) + ' m above the road at each tower, and its lowest point is ' + t(o.L) + ' m above the road, halfway between the towers. Use the road below the lowest point as the origin.' + P5.arch({ cable: true, origin: 'mid', wLab: o.T + ' m', hLab: o.L + ' m', tLab: o.H + ' m' }); },
      parts: [
        { id: 'eC3a', level: 'ADV', make: function (r, o) { var s = o.T / 2, a = cl((o.H - o.L) / (s * s)); return P5.vfPart('Determine the equation of the cable.', a, 0, o.L, { frac: false, aw: P5.aWrong(0, o.L, s, o.H).concat([[cl((o.H - o.L) / (o.T * o.T)), LID + '-width-half', 'Each tower is half the distance, ' + t(s) + ' m, from the lowest point.']]), sol: 'Vertex ' + t(ptTex(0, o.L)) + ', point ' + t(ptTex(s, o.H)) + ': ' + t(o.H + '=' + s * s + 'a+' + o.L) + ', so ' + t('a=' + vT(a)) + '.<br>' + eqy(vfTex(a, 0, o.L, 'x', false)), hints: ['The lowest point is the vertex ' + t('(0,\\ ' + o.L + ')') + '; the top of a tower is ' + t('(' + s + ',\\ ' + o.H + ')') + '.'], text: 'suspension cable: equation' }); } },
        { id: 'eC3b', level: 'MAS', make: function (r, o) { var s = o.T / 2, a = (o.H - o.L) / (s * s), x = s - o.d, y = a * x * x + o.L; return z().apx('The cable is ' + eqy(vfTex(cl(a), 0, o.L, 'x', false)) + '. How high is the cable ' + t(o.d) + ' m from a tower? Answer to the nearest tenth of a metre.', y, 1, { after: 'm', unit: 'm', cands: [[a * o.d * o.d + o.L, LID + '-end', 'The origin is below the lowest point: ' + o.d + ' m from a tower is ' + t('x=' + s + '-' + o.d + '=' + x) + '.']], sol: t('x=' + s + '-' + o.d + '=' + x) + ': ' + t('y=' + vT(cl(a)) + '(' + x + ')^{2}+' + o.L + '\\approx ' + K.roundTo(y, 1).toFixed(1)) + ' m.', hints: ['How far from the centre is a point ' + o.d + ' m from a tower?'], text: 'suspension cable: height near a tower' }); } }] }
  ];

  HW.defineLesson({ id: LID, unit: 5, num: '5', title: 'Writing a Quadratic Equation from Its Vertex and a Point', outcome: 'RF3', calc: true, questions: QUESTIONS, extra: EXTRA });
})(window);
