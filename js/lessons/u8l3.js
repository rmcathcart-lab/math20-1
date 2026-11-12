/* Math 20-1 · Unit 8 · Lesson 3 — Problems Involving Systems (outcome RF6 on every part)
 * Assignment 3 (m201book unit8/u8_l03.tex, Questions 1–17) and the Lesson 3 Extra Practice (u8_ep03.tex, A1–A4, B1–B6,
 * C1–C3). Every part is a generator: the booklet question's idea, form and difficulty with new numbers (contexts vary a
 * little); the lesson's example numbers and the booklet question's own numbers are left out. Calculator allowed: answers
 * are exact where the booklet's are, and rounded where the question asks (to the hundredth or tenth).
 * Answer formats: solutions of a system as ordered pairs in any order ("(5, 6), (-6, 17)"), checked by HW.u8assess
 * (js/lessons/u8test.js, read lazily inside the generators); values of a constant as an inequality ("c > 8", set notation
 * or intervals, HW.sets); dimensions, times, heights and profits as labelled number boxes; break-even values as a list.
 * Conversions: Q4(a) "write a system that could be graphed" → multiple choice of four systems (the area model with both
 * widths, one width, four sides, or the rope as the area); Q8(b) "during what interval … explain" → multiple choice of
 * intervals; Q11 "show … tangent" → the point of contact (the discriminant step is in the worked solution); EP C2's
 * "explain what the point with y = 0 means" → multiple choice. Numerical response stays numerical response (4 boxes).
 * Recognised mistakes: a missed second pair or a pair the context rules out (negative numbers), (y, x) pairs, the
 * horizontal distance for the distance up the slope, the path's highest point for the greatest height above the slope,
 * the quantity for the profit, revenue for profit, the sign of the tangent constant, the inequality for k the wrong way
 * or including the tangent value, q for the cliff height, the negative root for the landing time.
 * Levels: LIM BEG EMG PRG ADV MAS. Mastery: Q12(b) (a model from two data points: cliff and landing time), Extra C1
 * (one root twice the other), C2(a) (two jets), C3 (a circle and a parabola).
 * This file also defines HW.u8k34, the small kit shared with js/lessons/u8l4.js (loaded after it). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, KP = K.P, P = HW.poly, ex = HW.ex, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
  var LID = 'u8l3', CP = 'u8l3-';

  /* ======================================================================================================
   * HW.u8k34 — helpers for Lessons 3 and 4 of Unit 8 (p83)
   * ====================================================================================================== */
  var U = HW.u8k34 = HW.u8k34 || {};
  /* the Unit 8 assessment kit (js/lessons/u8test.js loads after the lessons, so only call this inside make/check) */
  function A() { var a = HW.u8assess; if (!a) throw new Error('u8l3/u8l4 need js/lessons/u8test.js (HW.u8assess)'); return a; }
  function pickWhere(gen, okf) { for (var i = 0; i < 9000; i++) { var o = gen(); if (o && okf(o)) return o; } throw new Error('u8k34: no instance found'); }
  function nz(r, lo, hi) { return (r.chance(0.5) ? -1 : 1) * r.int(lo, hi); }
  function cl(x) { var y = Math.round(x * 1e9) / 1e9; return y === 0 ? 0 : y; }
  function isInt(x) { return Math.abs(x - Math.round(x)) < 1e-9; }
  function rd(x, dp) { return K.roundTo(x, dp); }
  function fx(x, dp) { return rd(x, dp).toFixed(dp); }
  function nT(x) { return HW.fmt(cl(x)); }
  function nK(x) { return String(cl(x)); }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var q = a % b; a = b; b = q; } return a; }
  function toFr(x) { for (var q = 1; q <= 400; q++) { var p = Math.round(x * q); if (Math.abs(p / q - x) < 1e-9) return [p, q]; } return null; }
  function term(f) { var q = f[1]; while (q % 2 === 0) q /= 2; while (q % 5 === 0) q /= 5; return q === 1; }
  function fr(p, q) { return ex.texRat(ex.norm(p, q == null ? 1 : q)); }
  /* a number: as a fraction (vF) or as a decimal when it terminates (vD) */
  function vF(x) { var f = toFr(x); return f && f[1] !== 1 ? fr(f[0], f[1]) : nT(x); }
  function vD(x) { var f = toFr(x); return !f || f[1] === 1 || term(f) ? nT(x) : fr(f[0], f[1]); }
  function par(x, f) { var s = (f || vD)(x); return x < 0 ? '(' + s + ')' : s; }
  function M(c, v, e) { var cc = toFr(c) || c; if (!e) return P.num(cc); var o = {}; o[v] = e; return P.mono(cc, o); }
  /* a polynomial from [[coef, exponent], …] in one variable; its LaTeX with decimals (ptx) or fractions (ptf) */
  function poly(list, v) { return P.add.apply(null, list.map(function (c) { return M(c[0], v || 'x', c[1]); })); }
  function ptx(p) { var s = P.tex(p, { dec: true }); return s === '' ? '0' : s; }
  function ptf(p) { var s = P.tex(p); return s === '' ? '0' : s; }
  function qx(a, b, c, v) { return ptx(poly([[a, 2], [b, 1], [c, 0]], v)); }
  function lx(m, b, v) { return ptx(poly([[m, 1], [b, 0]], v)); }
  function lf(m, b, v) { return ptf(poly([[m, 1], [b, 0]], v)); }
  function ptT(x, y, f) { return '(' + (f || vD)(x) + ',\\ ' + (f || vD)(y) + ')'; }
  /* (v − r) with the sign written out; v alone when r = 0 */
  function brk(v, r) { return Math.abs(r) < 1e-12 ? v : '(' + v + (r > 0 ? '-' + vD(r) : '+' + vD(-r)) + ')'; }
  /* "+ 5" / "- 5" after another term */
  function sg(c) { return c < 0 ? '-' + vD(-c) : '+' + vD(c); }
  /* candidates [[value, code, hint]] → a diagnosis function (dp: also match the value rounded to dp places) */
  function diag(list, dp) {
    return function (v) {
      for (var i = 0; i < (list || []).length; i++) {
        var c = list[i]; if (!c || !isFinite(c[0])) continue;
        if (Math.abs(v - c[0]) < 1e-9 || (dp != null && Math.abs(v - rd(c[0], dp)) < 1e-9)) return { code: c[1], hint: c[2] };
      }
      return null;
    };
  }
  function badOf(list, ans, dp) {
    var out = [];
    (list || []).forEach(function (c) {
      if (!c || !isFinite(c[0])) return;
      var x = dp != null ? rd(c[0], dp) : cl(c[0]);
      if (Math.abs(x - (dp != null ? rd(ans, dp) : ans)) < 1e-9) return;
      out.push(dp != null ? x.toFixed(dp) : String(x));
    });
    return out;
  }
  function numChk(ans, list, o) { return K.number(ans, diag(list), o); }
  function apxChk(x, dp, list) { return K.approx(x, dp, { diag: diag(list, dp) }); }
  /* one exact number: o = { cands, sol, hints, text, after, before, nr, unit } */
  function numP(prompt, ans, o) {
    o = o || {};
    return { prompt: prompt, input: { type: 'number', after: o.after, before: o.before, nr: !!o.nr }, check: numChk(ans, o.cands, { nr: !!o.nr }), key: nK(ans),
      answer: t((o.pre || '') + nT(ans) + (o.unit ? '\\text{ ' + o.unit + '}' : '')), solution: o.sol, hints: o.hints || [], text: o.text, bad: badOf(o.cands, ans).concat(o.bad || []) };
  }
  /* one rounded number */
  function apxP(prompt, x, dp, o) {
    o = o || {};
    return { prompt: prompt, input: { type: 'number', after: o.after, before: o.before, nr: !!o.nr }, check: K.approx(x, dp, { diag: diag(o.cands, dp), nr: !!o.nr }), key: fx(x, dp),
      answer: t((o.pre || '') + fx(x, dp) + (o.unit ? '\\text{ ' + o.unit + '}' : '')), solution: o.sol, hints: o.hints || [], text: o.text, bad: badOf(o.cands, x, dp).concat(o.bad || []) };
  }
  /* labelled boxes: specs = [{ label, name, chk, key, ans (LaTeX), math, keys, vars, after, before, placeholder }] */
  function fieldsP(prompt, specs, o) {
    o = o || {};
    var fields = specs.map(function (s) { return { label: s.label, name: s.name || s.label, after: s.after, before: s.before, mode: s.math ? 'math' : undefined, keys: s.math ? (s.keys || 'u8pairs') : undefined, vars: s.vars, placeholder: s.placeholder }; });
    return { prompt: prompt, input: { type: 'fields', fields: fields }, check: K.fields(specs.map(function (s) { return s.chk; }), { labels: specs.map(function (s) { return s.name || s.label; }) }),
      key: specs.map(function (s) { return s.key; }), answer: specs.map(function (s) { return (s.label ? s.label + ' ' : '') + (s.ansHtml || t(s.ans)); }).join('<br>'),
      solution: o.sol, hints: o.hints || [], text: o.text, bad: o.bad };
  }
  function mcP(r, prompt, opts, sol, hints, text, keep) {
    var seen = {}, out = [];
    opts.forEach(function (op) { var k = op.html.replace(/\s/g, ''); if (seen[k] && !op.right) return; seen[k] = 1; out.push(op); });
    return KP.mc(r, prompt, out, sol, hints || [], text, keep);
  }
  /* a checker for ordered pairs (HW.u8assess): pts = [{ x, y, xt, yt }] */
  function withT(pts) { return pts.map(function (p) { return { x: p.x, y: p.y, xt: p.xt || vD(p.x), yt: p.yt || vD(p.y) }; }); }
  function pairsChk(cp, pts, o) { return A().pairsPart(cp, '', withT(pts), o || {}).check; }
  function pairsP(cp, prompt, pts, o, sol, hints, text) { return A().pairsPart(cp, prompt, withT(pts), o || {}, sol, hints, text); }
  /* register codes with partial-credit decisions: map = { code: [label, 's'|'b'|'n'|''] } */
  function codes(map) {
    var c = {}, p = {};
    Object.keys(map).forEach(function (k) { if (!HW.CODES || !HW.CODES[k]) c[k] = map[k][0]; if (map[k][1]) p[k] = map[k][1]; });
    HW.addCodes(c); HW.addPartial(p);
  }
  /* the codes HW.u8assess's checkers give, under a lesson's own prefix */
  var ASSESS = {
    'nosol-claim': ['Said “no solution” when the graphs meet', 'n'], 'none-missed': ['Gave solutions for a system with none', 'n'],
    'inf-claim': ['Said “infinitely many” for different graphs', 'n'], 'inf-missed': ['Missed that the equations are the same graph', 'n'],
    'sys-y': ['Right x-values, wrong y-values', 's'], 'sys-missing': ['Missed a solution of the system', 'b'], 'sys-extra': ['An extra pair that is not a solution', 'b'], 'pair-flip': ['Ordered pairs written (y, x)', 's'],
    'k-dir': ['Values of the constant: inequality the wrong way', 'b'], 'k-incl': ['Values of the constant: included the tangent value', 's'], 'k-tangent': ['Gave only the tangent value of the constant', 'b'],
    'reg-side': ['Inequality the wrong way (wrong side shaded)', 'b'], 'reg-strict': ['Solid/dashed boundary wrong (≤ vs <)', 's'], 'reg-rev': ['Did not reverse the sign when dividing by a negative', 'b'],
    'reg-bound': ['Wrong boundary', 'n'], 'reg-slope': ['Boundary line: slope as run over rise', 'n'],
    'ineq-incl': ['Endpoint included/excluded wrong', 's'], 'ineq-side': ['Inequality the wrong way', 'b'], 'ineq-rev': ['Multiplied or divided by a negative without reversing the sign', 'b'],
    'ineq-roots': ['Endpoint with the wrong sign', 'b'], 'ineq-and': ['Joined two pieces with “and”', 'b'], 'ineq-none': ['Said “no solution” when there are solutions', 'n'],
    'ineq-claim': ['Gave solutions when there are none', 'n'], 'ineq-all': ['Said all real numbers', 'n'], 'ineq-half': ['Gave only one of the two intervals', 'b']
  };
  function assessCodes(cp) { var m = {}; Object.keys(ASSESS).forEach(function (k) { m[cp + k] = ASSESS[k]; }); codes(m); }
  U.A = A; U.pickWhere = pickWhere; U.nz = nz; U.cl = cl; U.isInt = isInt; U.rd = rd; U.fx = fx; U.nT = nT; U.nK = nK; U.gcd = gcd; U.toFr = toFr; U.fr = fr;
  U.vF = vF; U.vD = vD; U.par = par; U.M = M; U.poly = poly; U.ptx = ptx; U.ptf = ptf; U.qx = qx; U.lx = lx; U.lf = lf; U.ptT = ptT; U.brk = brk; U.sg = sg;
  U.diag = diag; U.badOf = badOf; U.numChk = numChk; U.apxChk = apxChk; U.numP = numP; U.apxP = apxP; U.fieldsP = fieldsP; U.mcP = mcP; U.pairsChk = pairsChk; U.pairsP = pairsP;
  U.codes = codes; U.assessCodes = assessCodes;

  /* ======================================================================================================
   * Codes
   * ====================================================================================================== */
  assessCodes(CP);
  codes({
    'u8l3-neg-keep': ['Kept a solution the context rules out (not positive)', 'b'], 'u8l3-order': ['Boxes in the wrong order (format)', ''],
    'u8l3-dims': ['Rectangle: wrong dimensions', 'n'], 'u8l3-perim': ['Rectangle: used the whole perimeter as l + w', 'b'],
    'u8l3-model': ['Area model: wrong system', 'n'], 'u8l3-shore': ['Length along the wall: 30 − x instead of 30 − 2x', 'b'],
    'u8l3-origin': ['Gave the launch point as the landing point', 'b'], 'u8l3-dist-x': ['Distance up the slope: gave the horizontal distance', 'b'],
    'u8l3-gap-max': ['Greatest height above the slope: gave the path’s maximum height', 'b'], 'u8l3-gap-x': ['Greatest height above the slope: gave where it happens, not the height', 's'],
    'u8l3-be-x': ['Maximum profit: gave the quantity, not the profit', 's'], 'u8l3-be-rev': ['Maximum profit: used the revenue, not R − C', 'b'], 'u8l3-be-qty': ['Maximum profit: wrong quantity', 'b'],
    'u8l3-ht': ['Same height: right times, heights mixed up', 's'], 'u8l3-k-sign': ['Tangent constant: sign slip', 'b'], 'u8l3-tan-pt': ['Tangent: right constant, wrong point', 's'],
    'u8l3-pq-q': ['Model from data: right p, wrong q', 's'], 'u8l3-cliff': ['Starting height: gave q (the maximum) instead of h(0)', 'b'],
    'u8l3-pq-root': ['Landing time: wrong root of (t − p)² = q/5', 'b'], 'u8l3-k-ratio': ['Roots in a ratio: wrong constant', 'n']
  });

  /* ======================================================================================================
   * Generators
   * ====================================================================================================== */
  var HSYS = ['Let the unknowns be ' + t('x') + ' and ' + t('y') + '. Each condition gives one equation.', 'Solve the linear equation for one variable, substitute into the other, and solve the quadratic. Check each solution in the original conditions.'];

  /* Q1 — two numbers: x + y = S and x² − y = T (or x − y = D and x² + y = T) */
  function numPairs(r, opt) {
    opt = opt || {};
    var kind = opt.kind || r.pick(['minus', 'minus', 'diff']);
    var s = pickWhere(function () { return { x1: r.int(2, 9), S: r.int(5, 16), D: r.int(1, 9) }; }, function (z) {
      if (kind === 'minus') return z.x1 * z.x1 + z.x1 - z.S > 0 && !(z.S === 11 && z.x1 === 5) && z.S !== 15;
      return z.x1 * z.x1 + z.x1 - z.D > 0 && z.D !== 4;
    });
    var x1 = s.x1, x2 = -1 - x1, n = x1 * (x1 + 1), pts, prompt, sol;
    if (kind === 'minus') {
      var T = n - s.S; pts = [[x1, s.S - x1], [x2, s.S - x2]];
      prompt = 'The sum of two numbers is ' + t(s.S) + '. The square of the first number minus the second number is ' + t(T) + '. Write a system and determine both possible pairs of numbers.';
      sol = t('x+y=' + s.S) + ' and ' + t('x^{2}-y=' + T) + '.<br>' + t('y=' + s.S + '-x') + ': ' + t('x^{2}-(' + s.S + '-x)=' + T) + ', so ' + t('x^{2}+x-' + n + '=0') + ' and ' + t(brk('x', x2) + brk('x', x1) + '=0') + '.';
    } else {
      var T2 = n - s.D; pts = [[x1, x1 - s.D], [x2, x2 - s.D]];
      prompt = 'The first of two numbers minus the second is ' + t(s.D) + '. The square of the first number plus the second number is ' + t(T2) + '. Write a system and determine both possible pairs of numbers.';
      sol = t('x-y=' + s.D) + ' and ' + t('x^{2}+y=' + T2) + '.<br>' + t('y=x-' + s.D) + ': ' + t('x^{2}+x-' + s.D + '=' + T2) + ', so ' + t('x^{2}+x-' + n + '=0') + ' and ' + t(brk('x', x2) + brk('x', x1) + '=0') + '.';
    }
    sol += '<br>' + t('x=' + x1) + ', ' + t('y=' + pts[0][1]) + ' or ' + t('x=' + x2) + ', ' + t('y=' + pts[1][1]) + '. Both pairs check in both conditions.';
    return pairsP(CP, prompt + ' Write each pair as (first number, second number).', pts.map(function (p) { return { x: p[0], y: p[1] }; }),
      { wrongs: [{ pts: [pts[0]], code: CP + 'sys-missing', hint: 'The quadratic has two roots: the negative root gives a second pair that also works. Check it.' }] }, sol, HSYS, 'two numbers from a system');
  }

  /* Q2 — difference d and product of two positive numbers */
  function diffProd(r) {
    var s = pickWhere(function () { return { y: r.int(3, 15), d: r.int(2, 9) }; }, function (z) { return !(z.y === 7 && z.d === 3) && z.y * (z.y + z.d) <= 300; });
    var y = s.y, x = y + s.d, Pr = x * y;
    var sol = t('x-y=' + s.d) + ', ' + t('xy=' + Pr) + '. ' + t('x=y+' + s.d) + ': ' + t('y(y+' + s.d + ')=' + Pr) + ', so ' + t('y^{2}+' + s.d + 'y-' + Pr + '=0') + ' and ' + t('(y+' + x + ')(y-' + y + ')=0') + '.<br>' +
      t('y=' + y) + ' (' + t('y=-' + x) + ' is rejected: not positive), so ' + t('x=' + x) + '. The numbers are ' + t(x) + ' and ' + t(y) + '.';
    var chk = function (resp) {
      resp = resp || [];
      var a = HW.parse.number(resp[0] == null ? '' : resp[0]), b = HW.parse.number(resp[1] == null ? '' : resp[1]);
      if (!a.ok || !b.ok) return form(a.code === 'empty' || b.code === 'empty' ? 'empty' : 'notnumber', 'Type one number in each box.');
      var A0 = a.value, B0 = b.value, eq = function (u, v) { return Math.abs(u - v) < 1e-9; };
      if (eq(A0, x) && eq(B0, y)) return ok();
      if (eq(A0, y) && eq(B0, x)) return form(CP + 'order', 'Right numbers — put the larger one in the first box.');
      if ((eq(A0, -y) && eq(B0, -x)) || (eq(A0, -x) && eq(B0, -y))) return wrong(CP + 'neg-keep', 'Those numbers satisfy both conditions, but the question says the numbers are <b>positive</b>: use the other root.');
      if (eq(A0 - B0, s.d)) return wrong('value', 'The difference is right, but check the product: ' + t(nT(A0) + '\\times ' + nT(B0) + '=' + nT(A0 * B0)) + '.');
      return wrong('value', 'Let the numbers be ' + t('x') + ' and ' + t('y') + ': ' + t('x-y=' + s.d) + ' and ' + t('xy=' + Pr) + '. Substitute and solve.');
    };
    return { prompt: 'The difference of two positive numbers is ' + t(s.d) + ' and their product is ' + t(Pr) + '. Determine the numbers.', input: { type: 'fields', fields: [{ label: 'Larger number:', name: 'Larger' }, { label: 'Smaller number:', name: 'Smaller' }] },
      check: chk, key: [String(x), String(y)], answer: t(x) + ' and ' + t(y), solution: sol, hints: ['Write one equation for the difference and one for the product.', 'Substitute ' + t('x=y+' + s.d) + ' into the product and solve the quadratic; the numbers must be positive.'], text: 'difference and product',
      bad: [[String(-y), String(-x)], [String(y), String(x + 1)]] };
  }

  /* Q3 / EP A2 — a rectangle from its perimeter and diagonal ('pd') or its area and perimeter ('ap') */
  var TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41], [12, 35, 37], [6, 8, 10]];
  function rect(r, mode) {
    var w, l, prompt, sol, unit, cands = [];
    if (mode === 'pd') {
      var s = pickWhere(function () { return { tr: r.pick(TRIPLES), g: r.int(1, 5) }; }, function (z) { return z.tr[2] * z.g <= 75 && !(z.tr[0] === 8 && z.g === 1); });
      w = s.tr[0] * s.g; l = s.tr[1] * s.g; var d = s.tr[2] * s.g, half = w + l, Pm = 2 * half; unit = 'cm';
      prompt = 'A rectangle has a perimeter of ' + t(Pm) + ' cm and a diagonal of ' + t(d) + ' cm. Write a system and determine the dimensions of the rectangle.';
      sol = t('2l+2w=' + Pm + '\\Rightarrow l+w=' + half) + '; Pythagoras: ' + t('l^{2}+w^{2}=' + d + '^{2}=' + d * d) + '.<br>' + t('l=' + half + '-w') + ': ' + t('(' + half + '-w)^{2}+w^{2}=' + d * d) + ', so ' +
        t('2w^{2}-' + 2 * half + 'w+' + (half * half - d * d) + '=0') + ' and ' + t('w^{2}-' + half + 'w+' + (half * half - d * d) / 2 + '=0') + ': ' + t('(w-' + w + ')(w-' + l + ')=0') + '.<br>The rectangle is ' + t(w) + ' cm by ' + t(l) + ' cm.';
    } else {
      var z2 = pickWhere(function () { return { w: r.int(3, 14), l: r.int(5, 24), u: r.pick(['dm', 'cm', 'm']) }; }, function (z) { return z.l > z.w + 1 && !(z.w === 7 && z.l === 12) && z.w * z.l <= 240; });
      w = z2.w; l = z2.l; unit = z2.u; var Ar = w * l, Pr = 2 * (w + l);
      var obj = { dm: 'tablecloth', cm: 'photo print', m: 'garden plot' }[unit];
      prompt = 'A rectangular ' + obj + ' has an area of ' + t(Ar + '\\text{ ' + unit + '}^{2}') + ' and a perimeter of ' + t(Pr) + ' ' + unit + '. Determine its dimensions.';
      sol = t('l+w=' + (w + l)) + ' and ' + t('lw=' + Ar) + '. ' + t('w(' + (w + l) + '-w)=' + Ar) + ', so ' + t('w^{2}-' + (w + l) + 'w+' + Ar + '=0') + ' and ' + t('(w-' + w + ')(w-' + l + ')=0') + '.<br>The ' + obj + ' is ' + t(w) + ' ' + unit + ' by ' + t(l) + ' ' + unit + '.';
      // l + w = P (not halved): w² − Pw + A = 0
      var D2 = Pr * Pr - 4 * Ar; if (D2 > 0 && isInt(Math.sqrt(D2))) cands.push([(Pr - Math.sqrt(D2)) / 2, (Pr + Math.sqrt(D2)) / 2]);
    }
    var chk = function (resp) {
      resp = resp || [];
      var a = HW.parse.number(resp[0] == null ? '' : resp[0]), b = HW.parse.number(resp[1] == null ? '' : resp[1]);
      if (!a.ok || !b.ok) return form(a.code === 'empty' || b.code === 'empty' ? 'empty' : 'notnumber', 'Type one number in each box (no units).');
      var p = a.value, q = b.value, eq = function (u, v) { return Math.abs(u - v) < 1e-9; };
      if (eq(p, w) && eq(q, l)) return ok();
      if (eq(p, l) && eq(q, w)) return form(CP + 'order', 'Right dimensions — put the shorter side in the first box.');
      for (var i = 0; i < cands.length; i++) if (eq(p, cands[i][0]) && eq(q, cands[i][1])) return wrong(CP + 'perim', 'The perimeter is ' + t('2l+2w') + ': halve it to get ' + t('l+w') + '.');
      if (eq(p, w) || eq(q, l) || eq(p, l) || eq(q, w)) return wrong(CP + 'dims', 'One side is right. The other comes from the same quadratic: substitute it back to check.');
      return wrong(CP + 'dims', 'Write ' + t('l+w') + ' from the perimeter (half of it) and a second equation from the ' + (mode === 'pd' ? 'diagonal (Pythagoras)' : 'area') + ', then substitute.');
    };
    return { prompt: prompt, input: { type: 'fields', fields: [{ label: 'Shorter side:', name: 'Shorter side', after: unit }, { label: 'Longer side:', name: 'Longer side', after: unit }] },
      check: chk, key: [String(w), String(l)], answer: t(w + '\\text{ ' + unit + '}') + ' by ' + t(l + '\\text{ ' + unit + '}'), solution: sol,
      hints: ['Use ' + t('l') + ' and ' + t('w') + '. The perimeter gives ' + t('l+w') + ' (half the perimeter); the ' + (mode === 'pd' ? 'diagonal gives ' + t('l^{2}+w^{2}=d^{2}') : 'area gives ' + t('lw') + '.'), 'Solve ' + t('l+w') + ' for ' + t('l') + ', substitute, and factor.'],
      text: mode === 'pd' ? 'rectangle: perimeter and diagonal' : 'rectangle: area and perimeter', bad: [[String(w), String(l + 1)], [String(w + 1), String(l)]] };
  }

  /* Q4 — three-sided enclosure: rope R, area A */
  var ENCL = [
    { what: 'A rectangular swimming area at a beach is roped off on three sides, with the shoreline as the fourth side.', mat: 'rope', from: 'out from the shore', along: 'along the shore' },
    { what: 'A rectangular garden is fenced on three sides, with the wall of a barn as the fourth side.', mat: 'fencing', from: 'out from the barn', along: 'along the barn' },
    { what: 'A rectangular patio is edged on three sides with a border, with the back of a house as the fourth side.', mat: 'border', from: 'out from the house', along: 'along the house' }];
  function enclShared(r) {
    return pickWhere(function () { return { R: 2 * r.int(10, 30), A: 2 * r.int(15, 200), c: r.int(0, ENCL.length - 1) }; }, function (z) {
      var D = z.R * z.R - 8 * z.A; if (D <= 0 || isInt(Math.sqrt(D)) || z.A < z.R * z.R / 20) return false;
      if ((z.R === 30 && z.A === 90) || (z.R === 20 && (z.A === 48 || z.A === 60))) return false;
      var xs = [(z.R - Math.sqrt(D)) / 4, (z.R + Math.sqrt(D)) / 4];
      return xs.every(function (x) { var L = z.R - 2 * x, f1 = (x * 100) % 1, f2 = (L * 100) % 1; return Math.abs(f1 - 0.5) > 0.04 && Math.abs(f2 - 0.5) > 0.04 && rd(z.R - 2 * rd(x, 2), 2) === rd(L, 2) && L > 0.5; });
    });
  }
  function enclStem(o) { var c = ENCL[o.c]; return c.what + ' There is ' + t(o.R) + ' m of ' + c.mat + ', and the area must be ' + t(o.A + '\\text{ m}^{2}') + '. Let ' + t('x') + ' be the width measured ' + c.from + '.'; }
  function enclA(r, o) {
    var R = o.R, Ar = o.A, sys = function (f, g) { return t('y=' + f) + ' and ' + t('y=' + g); };
    return mcP(r, 'Which linear–quadratic system could be graphed to solve the problem?', [
      { html: sys(R + 'x-2x^{2}', Ar), right: true },
      { html: sys(R + 'x-x^{2}', Ar), why: 'There are <b>two</b> widths of ' + t('x') + ', so the third side is ' + t(R + '-2x') + ': the area is ' + t('x(' + R + '-2x)') + '.' },
      { html: sys(vD(R / 2) + 'x-x^{2}', Ar), why: 'That uses a perimeter of ' + t(R) + ' around all four sides. Only three sides use ' + ENCL[o.c].mat + '.' },
      { html: sys(R + 'x-2x^{2}', R), why: t('y') + ' is the area, so the line is ' + t('y=' + Ar) + ', not the length of ' + ENCL[o.c].mat + '.' }],
      'The side ' + ENCL[o.c].along + ' is ' + t(R + '-2x') + ', so the area is ' + t('A=x(' + R + '-2x)=' + R + 'x-2x^{2}') + '. Graph ' + t('y=' + R + 'x-2x^{2}') + ' and ' + t('y=' + Ar) + ' and find where they meet.',
      ['Draw the rectangle: two sides of length ' + t('x') + ' and one side along the wall.', 'Area = width × length; the area must equal the required value.'], 'enclosure: the system');
  }
  function enclB(r, o) {
    var R = o.R, Ar = o.A, D = R * R - 8 * Ar, x1 = (R - Math.sqrt(D)) / 4, x2 = (R + Math.sqrt(D)) / 4, c = ENCL[o.c];
    var lenC = function (x) { return [[R - x, CP + 'shore', 'There are two widths: the side ' + c.along + ' is ' + t(R + '-2x') + '.']]; };
    var spec = function (lab, x, isLen) { var v = isLen ? R - 2 * x : x; return { label: lab, name: lab.replace(/:$/, ''), after: 'm', chk: apxChk(v, 2, isLen ? lenC(x) : []), key: fx(v, 2), ans: fx(v, 2) + '\\text{ m}' }; };
    var sol = t(R + 'x-2x^{2}=' + Ar + '\\Rightarrow 2x^{2}-' + R + 'x+' + Ar + '=0') + '.<br>' + t('x=\\dfrac{' + R + '\\pm\\sqrt{' + R * R + '-' + 8 * Ar + '}}{4}=\\dfrac{' + R + '\\pm\\sqrt{' + D + '}}{4}') + ', so ' + t('x\\approx ' + fx(x1, 2)) + ' or ' + t('x\\approx ' + fx(x2, 2)) + '.<br>' +
      t(fx(x1, 2)) + ' m out by ' + t(R + '-2(' + fx(x1, 3) + ')\\approx ' + fx(R - 2 * x1, 2)) + ' m ' + c.along + ', or ' + t(fx(x2, 2)) + ' m out by ' + t(fx(R - 2 * x2, 2)) + ' m ' + c.along + '.';
    var p = fieldsP('Determine the possible dimensions, to the nearest hundredth of a metre.', [spec('Smaller width ' + t('x') + ':', x1), spec('Its length ' + c.along + ':', x1, true), spec('Larger width ' + t('x') + ':', x2), spec('Its length ' + c.along + ':', x2, true)],
      { sol: sol, hints: ['Set ' + t(R + 'x-2x^{2}=' + Ar) + ' and use the quadratic formula (it does not factor).', 'The side ' + c.along + ' is ' + t(R + '-2x') + ' for each width.'], text: 'enclosure: dimensions' });
    p.bad = [[fx(x1, 2), fx(R - x1, 2), fx(x2, 2), fx(R - x2, 2)], [fx(x1, 2), fx(R - 2 * x1, 2), fx(x2, 2), fx(R - x2, 2)]];
    return p;
  }

  /* Q5 / EP B1 — a launched object and a slope: y = −ax² + bx and y = mx */
  var LAUNCH = [{ o: 'water balloon', v: 'launched', s: 'slope' }, { o: 'paintball', v: 'fired', s: 'slope' }, { o: 'snowball', v: 'thrown', s: 'ramp' }, { o: 'stone', v: 'tossed', s: 'hillside' }, { o: 'beanbag', v: 'tossed', s: 'ramp' }];
  function launchShared(r, excl) {
    return pickWhere(function () { return { a: r.pick([0.02, 0.025, 0.04, 0.05, 0.08, 0.1, 0.125, 0.2, 0.25]), m: r.pick([0.25, 0.4, 0.5, 0.6, 0.75, 0.8, 1, 1.2, 1.5]), X: r.int(8, 40), c: r.int(0, LAUNCH.length - 1) }; }, function (z) {
      var b = z.m + z.a * z.X, Y = z.m * z.X, g = z.a * z.X * z.X / 4, hm = b * b / (4 * z.a);
      if (!isInt(b * 100) || !isInt(Y * 100) || !isInt(g * 100) || b > 4 || hm > 90 || g < 1) return false;
      if ((z.a === 0.04 && z.m === 0.6 && z.X === 25) || (z.a === 0.05 && z.m === 0.5 && z.X === 30) || (z.a === 0.1 && z.m === 1 && z.X === 20)) return false;
      var dd = Math.hypot(z.X, Y) * 10 % 1; if (Math.abs(dd - 0.5) < 0.04) return false;
      return !(excl && excl(z));
    });
  }
  function launchStem(o) { var L = LAUNCH[o.c], b = o.m + o.a * o.X; return 'A ' + L.o + ' is ' + L.v + ' from the bottom of a ' + L.s + '. Its path is ' + t('y=' + qx(-o.a, b, 0)) + ' and the ' + L.s + ' is the line ' + t('y=' + lx(o.m, 0)) + ' (metres, with the starting point at the origin).'; }
  function landSol(o) { var b = o.m + o.a * o.X, d = b - o.m; return t(qx(-o.a, b, 0) + '=' + lx(o.m, 0) + '\\Rightarrow ' + qx(-o.a, d, 0) + '=0\\Rightarrow ' + nT(-o.a) + 'x(x-' + o.X + ')=0') + ': ' + t('x=0') + ' (the start) or ' + t('x=' + o.X) + ', and ' + t('y=' + nT(o.m) + '(' + o.X + ')=' + nT(o.m * o.X)) + '.'; }
  function landPart(r, o) {
    var Y = cl(o.m * o.X);
    return pairsP(CP, 'Where does the ' + LAUNCH[o.c].o + ' land on the ' + LAUNCH[o.c].s + '? Give the point.', [{ x: o.X, y: Y }],
      { wrongs: [{ pts: [[0, 0], [o.X, Y]], code: CP + 'origin', hint: t('(0,\\ 0)') + ' is where it starts. Give only the point where it lands.' }, { pts: [[0, 0]], code: CP + 'origin', hint: t('(0,\\ 0)') + ' is where it starts. The other root is where it lands.' }] },
      landSol(o) + ' It lands at ' + t(ptT(o.X, Y)) + '.', ['Set the two expressions for ' + t('y') + ' equal and factor out ' + t('x') + '.', 'One root is the starting point; the other is where it lands. Find its ' + t('y') + ' from the line.'], 'landing point on a slope');
  }
  function upSlope(r, o) {
    var Y = o.m * o.X, d = Math.hypot(o.X, Y);
    return apxP('How far up the ' + LAUNCH[o.c].s + ' (along it, from the start) does it land, to the nearest tenth of a metre?', d, 1, { after: 'm', unit: 'm', cands: [[o.X, CP + 'dist-x', t(o.X) + ' m is the horizontal distance. Along the ' + LAUNCH[o.c].s + ', use the distance formula from ' + t('(0,\\ 0)') + ' to the landing point.'], [Y, CP + 'dist-x', 'That is the height. Use the distance formula from ' + t('(0,\\ 0)') + ' to the landing point.']],
      sol: t('d=\\sqrt{' + o.X + '^{2}+' + nT(Y) + '^{2}}=\\sqrt{' + nT(o.X * o.X + Y * Y) + '}\\approx ' + fx(d, 1)) + ' m', hints: ['The landing point is ' + t(ptT(o.X, Y)) + '. Use the distance formula from the origin.'], text: 'distance up the slope' });
  }
  function gapMax(r, o) {
    var b = o.m + o.a * o.X, d = b - o.m, g = o.a * o.X * o.X / 4, hm = b * b / (4 * o.a);
    return numP('What is the greatest vertical height of the ' + LAUNCH[o.c].o + ' above the ' + LAUNCH[o.c].s + '?', g, { after: 'm', unit: 'm', cands: [[hm, CP + 'gap-max', 'That is the highest point of the path above the <b>ground level</b> of the start. The height above the ' + LAUNCH[o.c].s + ' is the gap ' + t('(' + qx(-o.a, b, 0) + ')-' + lx(o.m, 0)) + '.'], [o.X / 2, CP + 'gap-x', 'That is where the gap is greatest. Substitute it into the gap to find the height.']],
      sol: 'Vertical gap ' + t('=(' + qx(-o.a, b, 0) + ')-' + lx(o.m, 0) + '=' + qx(-o.a, d, 0)) + '.<br>Maximum at ' + t('x=-\\dfrac{' + nT(d) + '}{2(' + nT(-o.a) + ')}=' + nT(o.X / 2)) + ': ' + t(nT(-o.a) + '(' + nT(o.X / 2) + ')^{2}+' + nT(d) + '(' + nT(o.X / 2) + ')=' + nT(g)) + ' m.',
      hints: ['The vertical height above the ' + LAUNCH[o.c].s + ' is (path) − (line): a parabola.', 'Its maximum is at the vertex, halfway between its two zeros.'], text: 'greatest height above the slope' });
  }

  /* Q6 — arch y = −ax² + H and beam y = mx + c */
  function archShared(r) {
    return pickWhere(function () { return { a: r.pick([0.1, 0.2, 0.25, 0.5]), H: r.int(6, 12), m: r.pick([0.25, 0.4, 0.5, 0.75, 1, -0.25, -0.4, -0.5, -0.75, -1]), c: r.int(2, 11) }; }, function (z) {
      if (z.c >= z.H || (z.a === 0.2 && z.H === 8 && z.m === 0.5 && z.c === 5)) return false;
      var D = z.m * z.m + 4 * z.a * (z.H - z.c), xs = [(-z.m - Math.sqrt(D)) / (2 * z.a), (-z.m + Math.sqrt(D)) / (2 * z.a)];
      var pts = xs.map(function (x) { return [x, z.m * x + z.c]; });
      if (pts.some(function (p) { return p[1] < 0.3 || isInt(p[0] * 100); })) return false;
      var good = pts.every(function (p) { var f1 = (Math.abs(p[0]) * 100) % 1, f2 = (Math.abs(p[1]) * 100) % 1; return Math.abs(f1 - 0.5) > 0.06 && Math.abs(f2 - 0.5) > 0.06 && Math.abs(rd(z.m * rd(p[0], 2) + z.c, 2) - rd(p[1], 2)) < 1e-9 && Math.abs(rd(-z.a * rd(p[0], 2) * rd(p[0], 2) + z.H, 2) - rd(p[1], 2)) < 0.0101; });
      if (!good) return false;
      var L = Math.hypot(pts[1][0] - pts[0][0], pts[1][1] - pts[0][1]), Lr = Math.hypot(rd(pts[1][0], 2) - rd(pts[0][0], 2), rd(pts[1][1], 2) - rd(pts[0][1], 2));
      return rd(L, 1) === rd(Lr, 1) && Math.abs((L * 10) % 1 - 0.5) > 0.06;
    });
  }
  function archPts(o) { var D = o.m * o.m + 4 * o.a * (o.H - o.c); return [(-o.m - Math.sqrt(D)) / (2 * o.a), (-o.m + Math.sqrt(D)) / (2 * o.a)].map(function (x) { return [x, o.m * x + o.c]; }); }
  function archA(r, o) {
    var pts = archPts(o), bb = o.m / o.a, cc = (o.c - o.H) / o.a;
    var sol = t('-' + nT(o.a) + 'x^{2}+' + o.H + '=' + lx(o.m, o.c) + '\\Rightarrow ' + qx(-o.a, -o.m, o.H - o.c) + '=0') + '; divide by ' + t(nT(-o.a)) + ': ' + t(qx(1, bb, cc) + '=0') + '.<br>' +
      t('x=\\dfrac{' + nT(-bb) + '\\pm\\sqrt{' + nT(bb * bb) + '-4(' + nT(cc) + ')}}{2}') + ', so ' + t('x\\approx ' + fx(pts[0][0], 2)) + ' or ' + t('x\\approx ' + fx(pts[1][0], 2)) + '.<br>Points ' + t('\\approx(' + fx(pts[0][0], 2) + ',\\ ' + fx(pts[0][1], 2) + ')') + ' and ' + t('(' + fx(pts[1][0], 2) + ',\\ ' + fx(pts[1][1], 2) + ')') + '.';
    return pairsP(CP, 'Use a graphing calculator (<i>intersect</i>) or the quadratic formula to determine where the beam meets the arch, to the nearest hundredth.', pts.map(function (p) { return { x: p[0], y: p[1], xt: fx(p[0], 2), yt: fx(p[1], 2) }; }), { dp: 2 }, sol,
      ['Set ' + t('-' + nT(o.a) + 'x^{2}+' + o.H + '=' + lx(o.m, o.c)) + ' and rearrange to ' + t('ax^{2}+bx+c=0') + '.', 'Use the quadratic formula; find each ' + t('y') + ' from the line.'], 'arch and beam: points');
  }
  function archB(r, o) {
    var pts = archPts(o), dx = pts[1][0] - pts[0][0], dy = pts[1][1] - pts[0][1], L = Math.hypot(dx, dy);
    return apxP('Determine the length of the beam, to the nearest tenth of a metre.', L, 1, { after: 'm', unit: 'm', cands: [[Math.abs(dx), CP + 'dist-x', 'That is only the horizontal distance between the ends. Use the distance formula.']],
      sol: t('\\sqrt{(' + fx(pts[1][0], 3) + '-' + par(rd(pts[0][0], 3)) + ')^{2}+(' + fx(pts[1][1], 3) + '-' + par(rd(pts[0][1], 3)) + ')^{2}}=\\sqrt{' + fx(Math.abs(dx), 3) + '^{2}+' + fx(Math.abs(dy), 3) + '^{2}}\\approx ' + fx(L, 1)) + ' m',
      hints: ['The beam runs between the two points you found. Use the distance formula.'], text: 'arch and beam: length' });
  }

  /* Q7 — break-even with a linear cost, and the maximum profit */
  var GOODS = ['custom skateboards', 'handmade birdhouses', 'printed hoodies', 'wooden phone stands', 'custom guitar picks'];
  function beShared(r) {
    return pickWhere(function () { return { a: r.pick([0.5, 1, 2, 0.25]), x1: r.int(3, 12), gap: 2 * r.int(4, 25), m: r.int(5, 20), g: r.int(0, GOODS.length - 1) }; }, function (z) {
      var x2 = z.x1 + z.gap, f = z.a * z.x1 * x2, b = z.m + z.a * (z.x1 + x2), Pm = z.a * (z.gap / 2) * (z.gap / 2);
      return isInt(z.a * z.x1 * x2) && isInt(b * 100) && isInt(Pm) && Pm >= 20 && x2 <= 70 && f <= 5000 && !(z.a === 0.5 && z.x1 === 6 && x2 === 50) && !(z.a === 1 && z.x1 === 2 && x2 === 14);
    });
  }
  function beVals(o) { var x2 = o.x1 + o.gap; return { x2: x2, f: o.a * o.x1 * x2, b: o.m + o.a * (o.x1 + x2), xm: o.x1 + o.gap / 2, Pm: o.a * (o.gap / 2) * (o.gap / 2) }; }
  function beStem(o) { var v = beVals(o); return 'A small business sells ' + t('x') + ' ' + GOODS[o.g] + ' per month. Its revenue is ' + t('R=' + qx(-o.a, v.b, 0)) + ' and its cost is ' + t('C=' + lx(o.m, v.f)) + ', both in dollars.'; }
  function beA(r, o) {
    var v = beVals(o), d = v.b - o.m;
    var sol = t(qx(-o.a, v.b, 0) + '=' + lx(o.m, v.f) + '\\Rightarrow ' + qx(-o.a, d, -v.f) + '=0') + (o.a !== 1 ? '; divide by ' + t(nT(-o.a)) + ': ' + t(qx(1, -(o.x1 + v.x2), o.x1 * v.x2) + '=0') : ', so ' + t(qx(1, -(o.x1 + v.x2), o.x1 * v.x2) + '=0')) + '.<br>' +
      t('(x-' + o.x1 + ')(x-' + v.x2 + ')=0') + ': it breaks even at ' + t(o.x1) + ' and at ' + t(v.x2) + ' ' + GOODS[o.g] + '.';
    var p = KP.valueSet('Determine the break-even quantities.', [o.x1, v.x2], { v: 'x' }, sol, ['It breaks even when ' + t('R=C') + ': set the expressions equal.', 'Collect the terms on one side, divide by the leading coefficient and factor.'], 'break-even quantities');
    p.bad = ['x=' + (-o.x1) + ',\\ x=' + (-v.x2), 'x=' + o.x1];
    return p;
  }
  function beB(r, o) {
    var v = beVals(o), d = v.b - o.m, Rx = -o.a * v.xm * v.xm + v.b * v.xm, Rmax = v.b * v.b / (4 * o.a);
    var sol = t('P=R-C=' + qx(-o.a, d, -v.f)) + '; the vertex is at ' + t('x=-\\dfrac{' + nT(d) + '}{2(' + nT(-o.a) + ')}=' + v.xm) + ' (halfway between the break-even values).<br>' +
      t('P=' + nT(-o.a) + '(' + v.xm + ')^{2}+' + nT(d) + '(' + v.xm + ')-' + nT(v.f) + '=' + nT(v.Pm)) + '. The maximum profit is ' + t('\\$' + nT(v.Pm)) + ', from ' + t(v.xm) + ' ' + GOODS[o.g] + '.';
    return fieldsP('Determine the maximum profit and the number of ' + GOODS[o.g] + ' that gives it.', [
      { label: 'Number sold:', name: 'Number', chk: numChk(v.xm, [[v.Pm, CP + 'be-qty', 'That is the profit. How many items give it?'], [v.b / (2 * o.a), CP + 'be-qty', 'That is where the <b>revenue</b> is greatest. Use the profit ' + t('P=R-C') + '.']]), key: String(v.xm), ans: nK(v.xm) },
      { label: 'Maximum profit:', name: 'Profit', before: '$', chk: numChk(v.Pm, [[v.xm, CP + 'be-x', 'That is the number sold. Substitute it into ' + t('P=R-C') + ' to get the profit.'], [Rx, CP + 'be-rev', 'That is the revenue at the vertex. Profit is ' + t('R-C') + ': subtract the cost.'], [Rmax, CP + 'be-rev', 'That is the greatest revenue. Use the profit ' + t('P=R-C') + '.']]), key: nK(v.Pm), ans: '\\$' + nT(v.Pm) }],
      { sol: sol, hints: ['Profit is ' + t('P=R-C') + ': a parabola that opens down.', 'Its maximum is at the vertex, halfway between the break-even values.'], text: 'maximum profit', bad: [[String(v.xm), nK(Rx)], [nK(v.Pm), String(v.xm)]] });
  }

  /* Q8 — a ball and a drone: −5t² + vt + h0 and pt² + qt + c meet at t1 and t2 */
  function droneShared(r) {
    return pickWhere(function () { return { p: r.int(1, 3), v: r.int(15, 30), h0: r.int(1, 6), t1: r.int(1, 4), dt: r.int(1, 3) }; }, function (z) {
      var t2 = z.t1 + z.dt, k = 5 + z.p, q = z.v - k * (z.t1 + t2), c = z.h0 + k * z.t1 * t2, ball = function (s) { return -5 * s * s + z.v * s + z.h0; }, dr = function (s) { return z.p * s * s + q * s + c; };
      if (t2 > 5 || ball(t2) < 5 || ball(z.t1) < 5 || (z.p === 1 && z.v === 25 && z.h0 === 2 && z.t1 === 2 && t2 === 3)) return false;
      for (var s = 0; s <= t2 + 1; s += 0.25) if (dr(s) < 1) return false;
      return true;
    });
  }
  function droneV(o) { var t2 = o.t1 + o.dt, k = 5 + o.p; return { t2: t2, k: k, q: o.v - k * (o.t1 + t2), c: o.h0 + k * o.t1 * t2, H1: -5 * o.t1 * o.t1 + o.v * o.t1 + o.h0, H2: -5 * t2 * t2 + o.v * t2 + o.h0 }; }
  function droneStem(o) { var v = droneV(o); return 'A drone hovers and dips over a field while a ball is kicked straight up beside it. Their heights in metres after ' + t('t') + ' seconds are ball: ' + t('h=' + qx(-5, o.v, o.h0, 't')) + ' and drone: ' + t('h=' + qx(o.p, v.q, v.c, 't')) + '.'; }
  function droneA(r, o) {
    var v = droneV(o), S = o.t1 + v.t2, Pp = o.t1 * v.t2;
    var sol = t(qx(-5, o.v, o.h0, 't') + '=' + qx(o.p, v.q, v.c, 't') + '\\Rightarrow 0=' + qx(v.k, v.q - o.v, v.c - o.h0, 't')) + '; divide by ' + t(v.k) + ': ' + t('t^{2}-' + S + 't+' + Pp + '=0') + ', ' + t('(t-' + o.t1 + ')(t-' + v.t2 + ')=0') + '.<br>' +
      'At ' + t(o.t1) + ' s both are ' + t(nT(v.H1)) + ' m high, and at ' + t(v.t2) + ' s both are ' + t(nT(v.H2)) + ' m high (check each in both equations).';
    var tChk = K.valueSet([o.t1, v.t2], { v: 't' });
    return fieldsP('At what times are the ball and the drone at the same height, and what are those heights?', [
      { label: 'Times:', name: 'Times', math: true, keys: 'solutions', vars: ['t'], placeholder: 'e.g. t = 1, t = 4', chk: tChk, key: 't=' + o.t1 + ',\\ t=' + v.t2, ans: 't=' + o.t1 + '\\text{ s and }t=' + v.t2 + '\\text{ s}' },
      { label: 'Height at the earlier time:', name: 'Earlier height', after: 'm', chk: numChk(v.H1, v.H1 !== v.H2 ? [[v.H2, CP + 'ht', 'That is the height at the <b>later</b> time.']] : []), key: nK(v.H1), ans: nT(v.H1) + '\\text{ m}' },
      { label: 'Height at the later time:', name: 'Later height', after: 'm', chk: numChk(v.H2, v.H1 !== v.H2 ? [[v.H1, CP + 'ht', 'That is the height at the <b>earlier</b> time.']] : []), key: nK(v.H2), ans: nT(v.H2) + '\\text{ m}' }],
      { sol: sol, hints: ['Set the two heights equal and collect everything on one side.', 'Divide by the common factor and factor. Substitute each time into either equation for the height.'], text: 'ball and drone: same height', bad: [['t=' + (-o.t1) + ',\\ t=' + (-v.t2), nK(v.H1), nK(v.H2)], ['t=' + o.t1 + ',\\ t=' + v.t2, nK(v.H1 + 1), nK(v.H2)]] });
  }
  function droneB(r, o) {
    var v = droneV(o), tm = (o.t1 + v.t2) / 2, bm = -5 * tm * tm + o.v * tm + o.h0, dm = o.p * tm * tm + v.q * tm + v.c;
    return mcP(r, 'During what time interval is the ball higher than the drone?', [
      { html: 'Between ' + t(o.t1) + ' s and ' + t(v.t2) + ' s', right: true },
      { html: 'Before ' + t(o.t1) + ' s and after ' + t(v.t2) + ' s', why: 'Test a time between them, e.g. ' + t('t=' + nT(tm)) + ': ball ' + t(nT(bm)) + ' m, drone ' + t(nT(dm)) + ' m.' },
      { html: 'Only after ' + t(v.t2) + ' s', why: 'Test a time after ' + t(v.t2) + ' s in both equations: the drone is higher there.' },
      { html: 'For the first ' + t(o.t1) + ' s', why: 'At ' + t('t=0') + ' the ball is ' + t(o.h0) + ' m high and the drone ' + t(v.c) + ' m: the drone is higher.' }],
      'The heights are equal at ' + t(o.t1) + ' s and ' + t(v.t2) + ' s. Test ' + t('t=' + nT(tm)) + ': ball ' + t(nT(bm)) + ' m, drone ' + t(nT(dm)) + ' m, so the ball is higher between them; outside that interval the drone is higher (at ' + t('t=0') + ': ' + t(o.h0) + ' m vs ' + t(v.c) + ' m).',
      ['The graphs cross at the two times you found. Test one time in each interval.'], 'which is higher: interval', true);
  }

  /* Q9 / EP A4 / Q16 — the k for which y = mx + k is tangent to y = x² + bx + c, and the point */
  function tanShared(r, o) {
    o = o || {};
    return pickWhere(function () { return { m: o.neg ? -r.int(1, 6) : o.pos ? r.int(1, 8) : nz(r, 1, 7), b: r.int(-6, 6), c: r.int(-6, 12) }; }, function (z) {
      var d = z.b - z.m; if (d === 0 || d % 2 || Math.abs(d) > 10) return false;
      var k = z.c - d * d / 4; if (o.kpos && (k <= 0 || k > 999)) return false; if (Math.abs(k) > 40 || k === 0) return false;
      var ex0 = [[2, -4, 3], [-2, 4, 1], [6, 2, 9]]; return !ex0.some(function (e) { return e[0] === z.m && e[1] === z.b && e[2] === z.c; }) && !(o.excl && o.excl(z));
    });
  }
  function tanV(z) { var d = z.b - z.m, k = z.c - d * d / 4, x0 = -d / 2; return { d: d, k: k, x0: x0, y0: z.m * x0 + k }; }
  function tanSol(z) {
    var v = tanV(z), cT = '(' + z.c + '-k)';
    return t(qx(1, z.b, z.c) + '=' + (z.m === 1 ? '' : z.m === -1 ? '-' : z.m) + 'x+k\\Rightarrow ' + ptx(poly([[1, 2], [v.d, 1]])) + '+' + cT + '=0') + '.<br>Tangent: one solution, so ' + t('b^{2}-4ac=0') + ': ' +
      t(par(v.d) + '^{2}-4(1)' + cT + '=0\\Rightarrow ' + (v.d * v.d - 4 * z.c) + '+4k=0') + ', so ' + t('k=' + vD(v.k)) + '.';
  }
  function tanPart(r, z) {
    var v = tanV(z), cT = 'x^{2}' + (v.d > 0 ? '+' : '-') + (Math.abs(v.d) === 1 ? '' : Math.abs(v.d)) + 'x+' + nT(v.d * v.d / 4);
    var sol = tanSol(z) + '<br>' + t(cT + '=0\\Rightarrow ' + brk('x', v.x0) + '^{2}=0') + ', ' + t('x=' + v.x0) + ', ' + t('y=' + (z.m === 1 ? '' : z.m === -1 ? '-' : z.m) + par(v.x0) + sg(v.k) + '=' + nT(v.y0)) + '. Point of tangency ' + t(ptT(v.x0, v.y0)) + '.';
    var kChk = numChk(v.k, [[-v.k, CP + 'k-sign', 'Check the sign: solve ' + t((v.d * v.d - 4 * z.c) + '+4k=0') + ' carefully.'], [z.c + v.d * v.d / 4, CP + 'k-sign', 'Check the sign: the constant term is ' + t('(' + z.c + '-k)') + '.']]);
    var pChk = pairsChk(CP, [{ x: v.x0, y: v.y0 }], { wrongs: [{ pts: [[-v.x0, z.m * -v.x0 + v.k]], code: CP + 'tan-pt', hint: 'Solve the perfect square for ' + t('x') + ' carefully: ' + t(brk('x', v.x0) + '^{2}=0') + '.' }] });
    var chk = function (resp) {
      resp = resp || [];
      var a = kChk(resp[0] == null ? '' : resp[0]); if (a.v !== 'correct') return a.v === 'form' ? a : wrong(a.code === 'value' ? 'value' : a.code, '<b>k:</b> ' + (a.hint || 'Substitute, then set the discriminant equal to 0 and solve for ' + t('k') + '.'));
      var b = pChk(resp[1] == null ? '' : resp[1]); if (b.v === 'correct') return ok();
      return b.v === 'form' ? { v: 'form', code: b.code, hint: '<b>Point:</b> ' + b.hint } : wrong(b.code === 'value' ? CP + 'tan-pt' : b.code, '<b>Point:</b> ' + (b.hint || 'Put ' + t('k') + ' back, solve the perfect square for ' + t('x') + ', then find ' + t('y') + '.'));
    };
    return { prompt: 'Determine the value of ' + t('k') + ' for which the line ' + t('y=' + (z.m === 1 ? '' : z.m === -1 ? '-' : z.m) + 'x+k') + ' is tangent to the parabola ' + t('y=' + qx(1, z.b, z.c)) + ', and state the point of tangency.',
      input: { type: 'fields', fields: [{ label: t('k='), name: 'k' }, { label: 'Point of tangency:', name: 'Point', mode: 'math', keys: 'u8pairs', placeholder: 'e.g. (3, 0)' }] },
      check: chk, key: [nK(v.k), ptT(v.x0, v.y0)], answer: t('k=' + nT(v.k)) + '; point ' + t(ptT(v.x0, v.y0)), solution: sol,
      hints: ['Substitute the line into the parabola and write the quadratic in standard form; its constant term contains ' + t('k') + '.', 'A tangent meets the parabola once: set ' + t('b^{2}-4ac=0') + ' and solve for ' + t('k') + '.'], text: 'tangent line: k and the point',
      bad: [[nK(-v.k), ptT(v.x0, v.y0)], [nK(v.k), ptT(-v.x0, z.m * -v.x0 + v.k)]] };
  }

  /* Q10 — values of c for no (or two) solutions of y = x² + bx + c and y = mx + q */
  function cVals(r) {
    var want = r.chance(0.7) ? 'none' : 'two';
    var z = pickWhere(function () { return { b: r.int(-6, 6), m: nz(r, 1, 6), q: r.int(-6, 6) }; }, function (s) { var d = s.b - s.m; return d !== 0 && d % 2 === 0 && Math.abs(d) <= 10 && !(s.b === -2 && s.m === 4 && s.q === -1); });
    var d = z.b - z.m, k0 = z.q + d * d / 4, S = A().SET, T = want === 'none' ? S.above(k0, false) : S.below(k0, false), cq = '(c' + (z.q ? (z.q > 0 ? '-' + z.q : '+' + (-z.q)) : '') + ')';
    var sol = t(qx(1, z.b, 0) + '+c=' + lx(z.m, z.q) + '\\Rightarrow ' + ptx(poly([[1, 2], [d, 1]])) + '+' + cq + '=0') + '.<br>' + t('b^{2}-4ac=' + par(d) + '^{2}-4(1)' + cq + '=' + (d * d + 4 * z.q) + '-4c') + '.<br>' +
      (want === 'none' ? 'No solution: ' + t((d * d + 4 * z.q) + '-4c<0\\Rightarrow c>' + vD(k0)) : 'Two solutions: ' + t((d * d + 4 * z.q) + '-4c>0\\Rightarrow c<' + vD(k0))) + '.';
    var wr = [{ parts: want === 'none' ? S.below(k0, false) : S.above(k0, false), code: CP + 'k-dir', hint: (want === 'none' ? 'No solution needs a <b>negative</b> discriminant' : 'Two solutions need a <b>positive</b> discriminant') + '. Dividing by ' + t('-4') + ' reverses the sign.' },
      { parts: want === 'none' ? S.above(k0, true) : S.below(k0, true), code: CP + 'k-incl', hint: 'At ' + t('c=' + vD(k0)) + ' the discriminant is ' + t('0') + ': the line is tangent (one solution), so that value is not included.' },
      { parts: S.pt(k0), code: CP + 'k-tangent', hint: 'That value makes the line tangent (one solution). Write the inequality for ' + (want === 'none' ? 'no solution' : 'two solutions') + '.' }];
    return A().setPart(CP, 'For what values of ' + t('c') + ' does the system ' + t('y=' + qx(1, z.b, 0) + '+c') + ' and ' + t('y=' + lx(z.m, z.q)) + ' have ' + (want === 'none' ? '<b>no</b> solution' : '<b>two</b> solutions') + '? Write an inequality.', T, { v: 'c', wrongs: wr }, sol,
      ['Substitute and write one quadratic in standard form; its constant term contains ' + t('c') + '.', (want === 'none' ? 'No solution: ' + t('b^{2}-4ac<0') : 'Two solutions: ' + t('b^{2}-4ac>0')) + '. Solve for ' + t('c') + '.'], 'values of c');
  }

  /* Q11 — a line tangent to x² + y² = r² */
  function circTan(r) {
    var z = pickWhere(function () { return { k: nz(r, 1, 3), q: nz(r, 1, 3) }; }, function (s) { return !(s.k === -2 && s.q === -2); });
    var k = z.k, q = z.q, p = k * q, R2 = p * p + q * q, m = -k, b = (k * k + 1) * q;
    var A2 = 1 + m * m, B2 = 2 * m * b, C2 = b * b - R2, g = gcd(gcd(A2, B2), C2);
    var sol = t('x^{2}+(' + lx(m, b) + ')^{2}=' + R2 + '\\Rightarrow ' + qx(A2, B2, b * b) + '=' + R2 + '\\Rightarrow ' + qx(A2, B2, C2) + '=0') + (g > 1 ? '; divide by ' + t(g) + ': ' + t(qx(A2 / g, B2 / g, C2 / g) + '=0') : '') + '.<br>' +
      t('b^{2}-4ac=' + par(B2 / g) + '^{2}-4(' + A2 / g + ')(' + C2 / g + ')=0') + ': exactly one solution, so the line is tangent.<br>' + t(brk('x', p) + '^{2}=0\\Rightarrow x=' + p) + ', ' + t('y=' + (m === 1 ? '' : m === -1 ? '-' : m) + par(p) + sg(b) + '=' + q) + '. Point of contact ' + t(ptT(p, q)) + '.';
    return pairsP(CP, 'Show algebraically that the line ' + t('y=' + lx(m, b)) + ' is tangent to the circle ' + t('x^{2}+y^{2}=' + R2) + ', and determine the point of contact.', [{ x: p, y: q }],
      { wrongs: [{ pts: [[-p, -q]], code: 'value', hint: 'Check the signs: substitute your point into the line.' }] }, sol,
      ['Substitute the line into the circle and simplify to ' + t('ax^{2}+bx+c=0') + '.', 'Tangent means one solution: the discriminant is ' + t('0') + ' and the quadratic is a perfect square.'], 'tangent to a circle');
  }

  /* Q12 / EP B4 — h = −5(t − p)² + q from two data points */
  function pqShared(r, excl) {
    return pickWhere(function () { return { p: r.pick([1.5, 2, 2.5, 3, 3.5, 4]), H0: r.int(5, 40), t1: r.pick([0.5, 1, 1, 1.5, 2]), gap: r.int(2, 5) }; }, function (z) {
      var q = 5 * z.p * z.p + z.H0, t2 = z.t1 + z.gap, h1 = q - 5 * (z.t1 - z.p) * (z.t1 - z.p), h2 = q - 5 * (t2 - z.p) * (t2 - z.p), T = z.p + Math.sqrt(q / 5);
      if (h2 < 3 || z.t1 === z.p || t2 === z.p || Math.abs(Math.abs(z.t1 - z.p) - Math.abs(t2 - z.p)) < 1e-9 || isInt(T * 100) || Math.abs((T * 100) % 1 - 0.5) < 0.05) return false;
      if ((z.p === 2.5 && q === 46.25) || (z.p === 3 && (q === 50 || q === 60))) return false;
      return !(excl && excl(z));
    });
  }
  function pqV(o) { var q = 5 * o.p * o.p + o.H0, t2 = o.t1 + o.gap; return { q: q, t2: t2, h1: q - 5 * (o.t1 - o.p) * (o.t1 - o.p), h2: q - 5 * (t2 - o.p) * (t2 - o.p), T: o.p + Math.sqrt(q / 5) }; }
  function pqSolA(o) {
    var v = pqV(o), lhs = v.h2 - v.h1, cst = -5 * (v.t2 * v.t2 - o.t1 * o.t1), cp = 10 * (v.t2 - o.t1);
    return t(nT(v.h1) + '=-5(' + nT(o.t1) + '-p)^{2}+q') + ' and ' + t(nT(v.h2) + '=-5(' + nT(v.t2) + '-p)^{2}+q') + '.<br>Subtract the first from the second (' + t('q') + ' and the ' + t('p^{2}') + ' terms cancel): ' +
      t(nT(lhs) + '=-5(' + nT(v.t2) + '-p)^{2}+5(' + nT(o.t1) + '-p)^{2}=' + nT(cst) + '+' + nT(cp) + 'p') + ', so ' + t('p=' + nT(o.p)) + '.<br>' + t('q=' + nT(v.h1) + '+5(' + nT(o.t1) + '-' + nT(o.p) + ')^{2}=' + nT(v.q)) + '.';
  }
  function pqSolB(o) {
    var v = pqV(o);
    return 'Start: ' + t('h(0)=-5(' + nT(o.p) + ')^{2}+' + nT(v.q) + '=' + nT(o.H0)) + ' m.<br>Ground: ' + t('-5(t-' + nT(o.p) + ')^{2}+' + nT(v.q) + '=0\\Rightarrow (t-' + nT(o.p) + ')^{2}=' + nT(v.q / 5)) + ', so ' + t('t=' + nT(o.p) + '+\\sqrt{' + nT(v.q / 5) + '}\\approx ' + fx(v.T, 2)) + ' s (' + t(nT(o.p) + '-\\sqrt{' + nT(v.q / 5) + '}') + ' is before the throw, rejected).';
  }
  function pqSpecs(o) {
    var v = pqV(o);
    return {
      p: { label: t('p='), name: 'p', chk: numChk(o.p, []), key: nK(o.p), ans: nT(o.p) },
      q: { label: t('q='), name: 'q', chk: numChk(v.q, [[v.h1 - 5 * (o.t1 - o.p) * (o.t1 - o.p), CP + 'pq-q', 'Solve for ' + t('q') + ': ' + t('q=h+5(t-p)^{2}') + ' (add, don’t subtract).'], [v.h1, CP + 'pq-q', 'Substitute ' + t('p') + ' into one equation and solve for ' + t('q') + '.']]), key: nK(v.q), ans: nT(v.q) },
      h0: { label: 'Starting height:', name: 'Starting height', after: 'm', chk: numChk(o.H0, [[v.q, CP + 'cliff', t('q') + ' is the maximum height. The start is at ' + t('t=0') + ': find ' + t('h(0)') + '.']]), key: nK(o.H0), ans: nT(o.H0) + '\\text{ m}' },
      T: { label: 'Lands after:', name: 'Landing time', after: 's', chk: apxChk(v.T, 2, [[o.p - Math.sqrt(v.q / 5), CP + 'pq-root', 'That root is before the throw. Use ' + t('t=p+\\sqrt{q/5}') + '.'], [Math.sqrt(v.q / 5), CP + 'pq-root', 'That is ' + t('t-p') + '. Add ' + t('p') + '.']]), key: fx(v.T, 2), ans: fx(v.T, 2) + '\\text{ s}' }
    };
  }
  var HPQ = ['Substitute each data point into ' + t('h=-5(t-p)^{2}+q') + ': two equations in ' + t('p') + ' and ' + t('q') + '.', 'Subtract them: ' + t('q') + ' and the ' + t('p^{2}') + ' terms cancel, leaving a linear equation in ' + t('p') + '.'];

  /* Q13 — the number of solutions of y = x² + bx + c and y = mx + k (multiple choice) */
  function countMC(r) {
    var want = r.pick(['none', 'one', 'two']);
    var z = pickWhere(function () { return { b: r.int(-8, 8), m: nz(r, 1, 5), j: r.int(1, 9), k: r.int(-8, 8) }; }, function (s) { var d = s.b - s.m; return d % 2 === 0 && d !== 0 && Math.abs(d) <= 10 && !(s.b === -6 && s.m === 2); });
    var d = z.b - z.m, e = want === 'one' ? d * d / 4 : want === 'two' ? d * d / 4 - z.j : d * d / 4 + z.j, c = z.k + e, D = d * d - 4 * e;
    var sol = t(qx(1, z.b, c) + '=' + lx(z.m, z.k) + '\\Rightarrow ' + qx(1, d, e) + '=0') + ', ' + t('b^{2}-4ac=' + par(d) + '^{2}-4(1)(' + e + ')=' + D) + (D > 0 ? ' > 0: two solutions.' : D === 0 ? ': one solution (the line is tangent at ' + t(ptT(-d / 2, z.m * (-d / 2) + z.k)) + ').' : ' < 0: no solution.');
    var opts = [{ html: 'no solution', right: want === 'none' }, { html: 'one solution', right: want === 'one' }, { html: 'two solutions', right: want === 'two' }, { html: 'infinitely many solutions', right: false, why: 'A line and a parabola can never be the same graph, so they share at most two points.' }];
    opts.forEach(function (op) { if (!op.right && !op.why) op.why = 'Substitute and work out the discriminant: ' + t('b^{2}-4ac=' + D) + '.'; });
    return mcP(r, '<i>(Multiple Choice)</i> The system ' + t('y=' + qx(1, z.b, c)) + ' and ' + t('y=' + lx(z.m, z.k)) + ' has', opts, sol, ['Substitute to get one quadratic equation and look at its discriminant.'], 'number of solutions', true);
  }

  /* Q14 — the model of a rectangle: length d more than width, area A (multiple choice) */
  var RECT = [['deck', 'm'], ['vegetable garden', 'm'], ['poster', 'cm'], ['rug', 'dm'], ['solar panel', 'dm']];
  function modelMC(r) {
    var z = pickWhere(function () { return { w: r.int(3, 14), d: r.int(2, 9), c: r.int(0, RECT.length - 1) }; }, function (s) { return !(s.w === 8 && s.d === 4); });
    var Ar = z.w * (z.w + z.d), u = RECT[z.c][1], sys = function (a, b) { return t(a) + ', ' + t(b); };
    return mcP(r, '<i>(Multiple Choice)</i> The length of a rectangular ' + RECT[z.c][0] + ' is ' + t(z.d) + ' ' + u + ' more than its width, and its area is ' + t(Ar + '\\text{ ' + u + '}^{2}') + '. A system that models the ' + RECT[z.c][0] + ' is', [
      { html: sys('l=w+' + z.d, 'lw=' + Ar), right: true },
      { html: sys('l+w=' + z.d, 'lw=' + Ar), why: '“' + z.d + ' more than the width” is a difference: ' + t('l=w+' + z.d) + '.' },
      { html: sys('w=l+' + z.d, 'l+w=' + Ar), why: 'The length is the longer side, and the area is a product ' + t('lw') + ', not a sum.' },
      { html: sys('l=w+' + z.d, '2l+2w=' + Ar), why: t('2l+2w') + ' is the perimeter. The area is ' + t('lw') + '.' }],
      t('l=w+' + z.d) + ' and ' + t('lw=' + Ar) + '. (Solving: ' + t('w(w+' + z.d + ')=' + Ar) + ', so ' + t('w=' + z.w) + ': the ' + RECT[z.c][0] + ' is ' + t(z.w) + ' ' + u + ' by ' + t(z.w + z.d) + ' ' + u + '.)',
      ['“More than” gives a sum on one side: ' + t('l=w+\\ldots') + '. Area is length × width.'], 'MC: model a rectangle');
  }

  /* Q15 — break-even values (multiple choice) */
  function beMC(r) {
    var z = pickWhere(function () { return { x1: r.int(1, 12), x2: r.int(4, 30), m: r.int(2, 10) }; }, function (s) {
      if (s.x1 >= s.x2 || (s.x1 === 2 && s.x2 === 14)) return false;
      var f = s.x1 * s.x2, others = 0; for (var u = 1; u * u <= f; u++) if (f % u === 0 && u !== s.x1 && u !== s.x2) others++; return others >= 2 && f <= 200;
    });
    var f = z.x1 * z.x2, b = z.m + z.x1 + z.x2, prs = [];
    for (var u = 1; u * u <= f; u++) if (f % u === 0 && u !== z.x1 && u !== z.x2) prs.push([u, f / u]);
    var o = r.shuffle(prs).slice(0, 2), pr = function (a, c) { return t(a) + ' and ' + t(c); };
    return mcP(r, '<i>(Multiple Choice)</i> A revenue is ' + t('R=-x^{2}+' + b + 'x') + ' and a cost is ' + t('C=' + lx(z.m, f)) + '. The break-even values of ' + t('x') + ' are', [
      { html: pr(z.x1, z.x2), right: true },
      { html: pr(-z.x1, -z.x2), why: 'Check the signs: ' + t('(x-' + z.x1 + ')(x-' + z.x2 + ')=0') + ' gives positive roots.' },
      { html: pr(o[0][0], o[0][1]), why: 'Those multiply to ' + t(f) + ' but add to ' + t(o[0][0] + o[0][1]) + ', not ' + t(z.x1 + z.x2) + '.' },
      { html: pr(o[1][0], o[1][1]), why: 'Those multiply to ' + t(f) + ' but add to ' + t(o[1][0] + o[1][1]) + ', not ' + t(z.x1 + z.x2) + '.' }],
      t('-x^{2}+' + b + 'x=' + lx(z.m, f) + '\\Rightarrow -x^{2}+' + (z.x1 + z.x2) + 'x-' + f + '=0\\Rightarrow x^{2}-' + (z.x1 + z.x2) + 'x+' + f + '=0\\Rightarrow (x-' + z.x1 + ')(x-' + z.x2 + ')=0') + '.',
      ['Set ' + t('R=C') + ' and factor.'], 'MC: break-even');
  }

  /* Q17 / EP A3 — two objects thrown at the same moment (the t² terms cancel) */
  function ballsShared(r, excl) {
    return pickWhere(function () { return { ts: r.pick([1, 1.5, 2, 2.5, 3, 4]), dv: r.int(3, 15), v2: r.int(15, 35) }; }, function (z) {
      var h0 = z.dv * z.ts, v1 = z.v2 + z.dv, H = -5 * z.ts * z.ts + v1 * z.ts;
      return isInt(h0) && h0 >= 6 && h0 <= 60 && H > 5 && String(cl(H)).length <= 4 && -5 * z.ts * z.ts + z.v2 * z.ts + h0 > 5 && !(excl && excl(z));
    });
  }
  function ballsV(o) { var h0 = o.dv * o.ts, v1 = o.v2 + o.dv; return { h0: h0, v1: v1, H: -5 * o.ts * o.ts + v1 * o.ts }; }
  function ballsSol(o) { var v = ballsV(o); return t('-5t^{2}+' + v.v1 + 't=-5t^{2}+' + o.v2 + 't+' + v.h0) + ': the ' + t('-5t^{2}') + ' terms cancel, so ' + t(o.dv + 't=' + v.h0) + ' and ' + t('t=' + nT(o.ts)) + ' s.<br>' + t('h=-5(' + nT(o.ts) + ')^{2}+' + v.v1 + '(' + nT(o.ts) + ')=' + nT(v.H)) + ' m (check with the other: ' + t('-5(' + nT(o.ts) + ')^{2}+' + o.v2 + '(' + nT(o.ts) + ')+' + v.h0 + '=' + nT(v.H)) + ' ✓).'; }

  /* EP A1 — sum S, the larger is c more than the square of the smaller */
  function sqPairs(r) {
    var z = pickWhere(function () { return { x1: r.int(1, 8), c: r.int(1, 9) }; }, function (s) {
      var x2 = -1 - s.x1, S = s.x1 + s.x1 * s.x1 + s.c; return S <= 80 && s.x1 * s.x1 + s.c > s.x1 && x2 * x2 + s.c > x2 && !(s.x1 === 2 && s.c === 3);
    });
    var x1 = z.x1, x2 = -1 - x1, S = x1 + x1 * x1 + z.c, n = S - z.c, pts = [[x1, x1 * x1 + z.c], [x2, x2 * x2 + z.c]];
    var sol = 'Smaller ' + t('x') + ', larger ' + t('y') + ': ' + t('x+y=' + S) + ', ' + t('y=x^{2}+' + z.c) + '.<br>' + t('x+x^{2}+' + z.c + '=' + S + '\\Rightarrow x^{2}+x-' + n + '=0\\Rightarrow ' + brk('x', x2) + brk('x', x1) + '=0') + '.<br>' +
      t('x=' + x1) + ', ' + t('y=' + pts[0][1]) + ' or ' + t('x=' + x2) + ', ' + t('y=' + pts[1][1]) + ' (in both pairs ' + t('y') + ' is the larger).';
    return pairsP(CP, 'The sum of two numbers is ' + t(S) + ', and the larger number is ' + t(z.c) + ' more than the square of the smaller number. Write a system and determine both possible pairs. Write each pair as (smaller, larger).', pts.map(function (p) { return { x: p[0], y: p[1] }; }),
      { wrongs: [{ pts: [pts[0]], code: CP + 'sys-missing', hint: 'The quadratic has two roots: the negative root gives a second pair that also works.' }] }, sol, HSYS, 'two numbers: sum and square');
  }

  /* EP B2 — a line through two lattice points of x² + y² = r² */
  function lattice(R) { var out = []; for (var x = -R; x <= R; x++) { var y2 = R * R - x * x, y = Math.round(Math.sqrt(y2)); if (y * y === y2) { out.push([x, y]); if (y) out.push([x, -y]); } } return out; }
  function sprinkler(r) {
    var z = pickWhere(function () { var R = r.pick([5, 10, 13, 15, 17, 25]), L = lattice(R); return { R: R, P1: r.pick(L), P2: r.pick(L) }; }, function (s) {
      var a = s.P2[1] - s.P1[1], b = -(s.P2[0] - s.P1[0]); if (!b || !a) return false;
      var c = a * s.P1[0] + b * s.P1[1]; if (!c) return false;
      if (s.R === 10 && ((s.P1[0] === -8 && s.P2[0] === 6) || (s.P1[0] === 6 && s.P2[0] === -8))) return false;
      var g = gcd(gcd(a, b), c); return Math.abs(a / g) <= 7 && Math.abs(b / g) <= 7 && Math.abs((Math.hypot(a, b) * 10) % 1 - 0.5) > 0.05;
    });
    var a = z.P2[1] - z.P1[1], b = -(z.P2[0] - z.P1[0]), c = a * z.P1[0] + b * z.P1[1], g = gcd(gcd(a, b), c); a /= g; b /= g; c /= g; if (a < 0) { a = -a; b = -b; c = -c; }
    var lineT = ptf(P.add(M(a, 'x', 1), M(b, 'y', 1))) + '=' + c;
    var Ld = Math.hypot(z.P2[0] - z.P1[0], z.P2[1] - z.P1[1]), pts = [z.P1, z.P2].sort(function (u, v) { return u[0] - v[0]; });
    // y = (c − ax)/b: (a² + b²)x² − 2ac x + (c² − b²R²) = 0
    var A2 = a * a + b * b, B2 = -2 * a * c, C2 = c * c - b * b * z.R * z.R, gg = gcd(gcd(A2, B2), C2);
    var yT = Math.abs(b) === 1 ? 'y=' + (b === 1 ? lf(-a, c) : lf(a, -c)) : 'y=\\dfrac{' + c + '-' + (a === 1 ? '' : a) + 'x}{' + b + '}';
    var sol = t(yT) + '. Substitute into ' + t('x^{2}+y^{2}=' + z.R * z.R) + (Math.abs(b) === 1 ? '' : ' (multiply by ' + t(b * b) + ')') + ': ' + t(qx(A2 / gg, B2 / gg, C2 / gg) + '=0') + (gg > 1 ? ' (divided by ' + t(gg) + ')' : '') + ', so ' + t('x=' + pts[0][0]) + ' or ' + t('x=' + pts[1][0]) + '.<br>' +
      'Points ' + t(ptT(pts[0][0], pts[0][1])) + ' and ' + t(ptT(pts[1][0], pts[1][1])) + '. Wet length ' + t('=\\sqrt{' + (pts[1][0] - pts[0][0]) + '^{2}+' + par(pts[1][1] - pts[0][1]) + '^{2}}=\\sqrt{' + Ld * Ld + '}\\approx ' + fx(Ld, 1)) + ' m.';
    var pChk = pairsChk(CP, pts.map(function (p) { return { x: p[0], y: p[1] }; }));
    return fieldsP('A lawn sprinkler at the origin waters every point within ' + t(z.R) + ' m, the region inside ' + t('x^{2}+y^{2}=' + z.R * z.R) + '. A straight garden path runs along the line ' + t(lineT) + '. Determine where the path enters and leaves the watered region, and the length of path that gets wet, to the nearest tenth of a metre.', [
      { label: 'Points:', name: 'Points', math: true, keys: 'u8pairs', placeholder: 'e.g. (0, 6), (6, 0)', chk: pChk, key: ptT(pts[0][0], pts[0][1]) + ',\\ ' + ptT(pts[1][0], pts[1][1]), ans: ptT(pts[0][0], pts[0][1]) + '\\text{ and }' + ptT(pts[1][0], pts[1][1]) },
      { label: 'Wet length:', name: 'Length', after: 'm', chk: apxChk(Ld, 1, [[Math.abs(pts[1][0] - pts[0][0]), CP + 'dist-x', 'Use the distance formula between the two points, not only the change in ' + t('x') + '.']]), key: fx(Ld, 1), ans: fx(Ld, 1) + '\\text{ m}' }],
      { sol: sol, hints: ['Solve the line for ' + t('y') + ' and substitute into the circle.', 'The two roots give the points; the wet length is the distance between them.'], text: 'sprinkler and path', bad: [[ptT(pts[0][0], pts[0][1]), fx(Ld + 1, 1)], [ptT(pts[0][0], pts[0][1]), fx(Ld, 1)]] });
  }

  /* EP B3 — bakery: quadratic revenue and quadratic cost */
  function bakeShared(r) {
    return pickWhere(function () { return { a: r.int(1, 4), c2: r.int(1, 2), x1: r.int(1, 6), gap: 2 * r.int(2, 6), m: r.int(4, 12) }; }, function (z) { var x2 = z.x1 + z.gap; return x2 <= 16 && !(z.a === 3 && z.c2 === 1 && z.x1 === 2 && x2 === 8); });
  }
  function bakeV(o) { var A0 = o.a + o.c2, x2 = o.x1 + o.gap; return { A0: A0, x2: x2, f: A0 * o.x1 * x2, b: o.m + A0 * (o.x1 + x2), xm: o.x1 + o.gap / 2, Pm: A0 * (o.gap / 2) * (o.gap / 2) }; }
  function bakeStem(o) { var v = bakeV(o); return 'A bakery’s daily revenue and cost for ' + t('x') + ' hundred loaves are ' + t('R=' + qx(-o.a, v.b, 0)) + ' and ' + t('C=' + qx(o.c2, o.m, v.f)) + ' (in hundreds of dollars).'; }

  /* EP B5 — values of c with no intersection (multiple choice) */
  function noIntMC(r) {
    var z = pickWhere(function () { return { m: nz(r, 1, 4), b: r.int(-6, 7), e: r.int(-5, 8) }; }, function (s) { var d = s.b - s.m; return d % 2 === 0 && d !== 0 && !(s.m === 1 && s.b === 3 && s.e === 2) && s.e - d * d / 4 !== 0; });
    var d = z.b - z.m, k0 = z.e - d * d / 4, ce = '(' + z.e + '-c)';
    return mcP(r, '<i>(Multiple Choice)</i> The line ' + t('y=' + (z.m === 1 ? '' : z.m === -1 ? '-' : z.m) + 'x+c') + ' does <b>not</b> intersect the parabola ' + t('y=' + qx(1, z.b, z.e)) + ' when', [
      { html: t('c<' + vD(k0)), right: true }, { html: t('c>' + vD(k0)), why: 'That gives two points of intersection: a larger ' + t('c') + ' raises the line into the parabola.' },
      { html: t('c<' + vD(-k0)), why: 'Check the sign when you solve for ' + t('c') + '.' }, { html: t('c=' + vD(k0)), why: 'That value makes the line tangent (one point).' }],
      t(qx(1, d, 0) + '+' + ce + '=0') + '; no solution when ' + t(par(d) + '^{2}-4' + ce + '<0\\Rightarrow ' + (d * d - 4 * z.e) + '+4c<0\\Rightarrow c<' + vD(k0)) + '. (' + t('c=' + vD(k0)) + ' gives a tangent; ' + t('c>' + vD(k0)) + ' gives two points.)',
      ['Substitute and find the discriminant in terms of ' + t('c') + '. No intersection: ' + t('b^{2}-4ac<0') + '.'], 'MC: no intersection');
  }

  /* EP C1 — one root twice the other */
  function twiceRoot(r) {
    var z = pickWhere(function () { return { a: nz(r, 1, 5), m: nz(r, 1, 6), c: r.int(-5, 25) }; }, function (s) { var b = s.m - 3 * s.a; return Math.abs(b) <= 14 && s.c !== 2 * s.a * s.a && !(s.a === 4 && s.m === 4 && s.c === 20); });
    var a = z.a, b = z.m - 3 * a, k = z.c - 2 * a * a, pts = [[a, z.m * a + k], [2 * a, 2 * z.m * a + k]], d = b - z.m;
    var sol = t(qx(1, d, 0) + '+(' + z.c + '-k)=0') + ' has roots ' + t('x=a') + ' and ' + t('x=2a') + ':<br>' + t('a^{2}' + sg(d) + 'a' + sg(z.c) + '-k=0') + ' and ' + t('4a^{2}' + sg(2 * d) + 'a' + sg(z.c) + '-k=0') + '. Subtract: ' + t('3a^{2}' + sg(d) + 'a=0\\Rightarrow 3a(a' + sg(d / 3) + ')=0') + '.<br>' +
      t('a=0') + ' would make both roots ' + t('0') + ' (not two solutions), so ' + t('a=' + a) + ': roots ' + t(a) + ' and ' + t(2 * a) + ', and ' + t(a * a + d * a + z.c + '-k=0\\Rightarrow k=' + k) + '.<br>Solutions ' + t(ptT(pts[0][0], pts[0][1])) + ' and ' + t(ptT(pts[1][0], pts[1][1])) + '.';
    var kChk = numChk(k, [[z.c + 2 * a * a, CP + 'k-ratio', 'Check the sign of ' + t('k') + ': the constant term is ' + t('(' + z.c + '-k)') + ' and equals the product of the roots.']]), pChk = pairsChk(CP, pts.map(function (p) { return { x: p[0], y: p[1] }; }));
    return fieldsP('The system ' + t('y=' + qx(1, b, z.c)) + ' and ' + t('y=' + (z.m === 1 ? '' : z.m === -1 ? '-' : z.m) + 'x+k') + ' has two solutions, and the ' + t('x') + '-coordinate of one is twice the ' + t('x') + '-coordinate of the other. Determine ' + t('k') + ' and both solutions.', [
      { label: t('k='), name: 'k', chk: kChk, key: String(k), ans: String(k) },
      { label: 'Solutions:', name: 'Solutions', math: true, keys: 'u8pairs', placeholder: 'e.g. (4, 4), (8, 20)', chk: pChk, key: ptT(pts[0][0], pts[0][1]) + ',\\ ' + ptT(pts[1][0], pts[1][1]), ans: ptT(pts[0][0], pts[0][1]) + '\\text{ and }' + ptT(pts[1][0], pts[1][1]) }],
      { sol: sol, hints: ['Substitute: the quadratic in ' + t('x') + ' has roots ' + t('a') + ' and ' + t('2a') + '.', 'Write the equation for each root and subtract: ' + t('k') + ' cancels. (Or use: the roots add to ' + t(-d) + ', so ' + t('3a=' + (-d)) + '.)'], text: 'one root twice the other', bad: [[String(-k), ptT(pts[0][0], pts[0][1]) + ',\\ ' + ptT(pts[1][0], pts[1][1])], [String(k), ptT(pts[0][0], pts[0][1])]] });
  }

  /* EP C2 — two fountain jets landing at the same spot */
  function jetsShared(r) {
    return pickWhere(function () { return { a1: r.pick([0.25, 0.5, 0.5, 1]), a2: r.pick([1, 1.5, 2, 2.5]), X: r.int(6, 16), x1: r.int(2, 12) }; }, function (z) {
      if (z.a2 <= z.a1 || z.x1 > z.X - 2 || (z.a1 === 0.5 && z.a2 === 1 && z.X === 8 && z.x1 === 4)) return false;
      var b2 = z.a1 * z.X + (z.a2 - z.a1) * (z.x1 + z.X), c2 = (z.a2 - z.a1) * z.x1 * z.X, y1 = z.a1 * z.x1 * (z.X - z.x1);
      return isInt(z.a1 * z.X * 100) && isInt(b2 * 100) && isInt(c2 * 100) && c2 <= 80 && y1 <= 40;
    });
  }
  function jetsV(o) { var b1 = o.a1 * o.X, b2 = b1 + (o.a2 - o.a1) * (o.x1 + o.X), c2 = (o.a2 - o.a1) * o.x1 * o.X; return { b1: b1, b2: b2, c2: c2, y1: o.a1 * o.x1 * (o.X - o.x1), s: (o.a2 - o.a1) * o.x1 / o.a2 }; }
  function jetsStem(o) { var v = jetsV(o); return 'Two water jets in a fountain follow the paths ' + t('y=' + qx(-o.a1, v.b1, 0)) + ' and ' + t('y=' + qx(-o.a2, v.b2, -v.c2)) + ' (metres; the first jet’s nozzle is at the origin).'; }

  /* EP C3 — x² + y² = R and y = x² − d */
  function circPar(r) {
    var z = pickWhere(function () { return { x0: r.int(1, 5), y0: r.int(-4, 8) }; }, function (s) {
      var d = s.x0 * s.x0 - s.y0, R = s.x0 * s.x0 + s.y0 * s.y0, yy = -1 - s.y0, xx2 = yy + d;
      if (!d || R > 100 || R < 4 || s.y0 === 0 || s.y0 === -1 || (s.x0 === 3 && s.y0 === 4)) return false;
      return xx2 < 0 || xx2 === 0 || isInt(Math.sqrt(xx2));
    });
    var x0 = z.x0, y0 = z.y0, d = x0 * x0 - y0, R = x0 * x0 + y0 * y0, yy = -1 - y0, xx2 = yy + d, pts = [{ x: -x0, y: y0 }, { x: x0, y: y0 }];
    if (xx2 === 0) pts.push({ x: 0, y: yy }); else if (xx2 > 0) { var sx = Math.sqrt(xx2), sq = isInt(sx); pts.push({ x: -sx, y: yy, xt: sq ? nT(-sx) : '-\\sqrt{' + xx2 + '}' }, { x: sx, y: yy, xt: sq ? nT(sx) : '\\sqrt{' + xx2 + '}' }); }
    var parT = 'y=x^{2}' + sg(-d), ys = [Math.min(y0, yy), Math.max(y0, yy)];
    var sol = 'From the parabola, ' + t('x^{2}=y' + sg(d)) + '. Substitute: ' + t('(y' + sg(d) + ')+y^{2}=' + R + '\\Rightarrow y^{2}+y' + sg(d - R) + '=0\\Rightarrow ' + brk('y', ys[0]) + brk('y', ys[1]) + '=0') + '.<br>' +
      [y0, yy].map(function (yv) { var q = yv + d; return t('y=' + yv) + ': ' + t('x^{2}=' + q) + (q < 0 ? ', no real ' + t('x') + ' (rejected)' : q === 0 ? ', ' + t('x=0') : ', ' + t('x=\\pm ' + Math.sqrt(q))); }).join('; ') + '.<br>Solutions ' + pts.map(function (p) { return t(ptT(p.x, p.y)); }).join(', ') + '.';
    return pairsP(CP, 'Solve the system ' + t('x^{2}+y^{2}=' + R) + ' and ' + t(parT) + ' algebraically. (Hint: substitute ' + t('x^{2}=y' + sg(d)) + '.)', pts,
      {}, sol,
      ['Replace ' + t('x^{2}') + ' in the circle with ' + t('y' + sg(d)) + ': you get a quadratic in ' + t('y') + '.', 'For each ' + t('y') + ', solve ' + t('x^{2}=y' + sg(d)) + ': it may give two, one or no values of ' + t('x') + '.'], 'circle and parabola');
  }

  /* ======================================================================================================
   * Questions
   * ====================================================================================================== */
  var QUESTIONS = [
    { num: '1', parts: [{ id: 'q1', level: 'BEG', make: function (r) { return numPairs(r); } }] },
    { num: '2', parts: [{ id: 'q2', level: 'EMG', make: function (r) { return diffProd(r); } }] },
    { num: '3', parts: [{ id: 'q3', level: 'PRG', make: function (r) { return rect(r, 'pd'); } }] },
    { num: '4', shared: enclShared, stem: enclStem, parts: [
      { id: 'q4a', level: 'EMG', make: function (r, o) { return enclA(r, o); } },
      { id: 'q4b', level: 'ADV', make: function (r, o) { return enclB(r, o); } }] },
    { num: '5', shared: function (r) { return launchShared(r); }, stem: launchStem, parts: [
      { id: 'q5a', level: 'EMG', make: function (r, o) { return landPart(r, o); } },
      { id: 'q5b', level: 'PRG', make: function (r, o) { return upSlope(r, o); } },
      { id: 'q5c', level: 'ADV', make: function (r, o) { return gapMax(r, o); } }] },
    { num: '6', shared: archShared, stem: function (o) { return 'A parabolic arch over a walkway has the equation ' + t('y=-' + nT(o.a) + 'x^{2}+' + o.H) + ', with the ground along the ' + t('x') + '-axis (metres). A straight support beam lies along the line ' + t('y=' + lx(o.m, o.c)) + ' and is attached to the arch at both ends.'; }, parts: [
      { id: 'q6a', level: 'PRG', make: function (r, o) { return archA(r, o); } },
      { id: 'q6b', level: 'ADV', make: function (r, o) { return archB(r, o); } }] },
    { num: '7', shared: beShared, stem: beStem, parts: [
      { id: 'q7a', level: 'PRG', make: function (r, o) { return beA(r, o); } },
      { id: 'q7b', level: 'ADV', make: function (r, o) { return beB(r, o); } }] },
    { num: '8', shared: droneShared, stem: droneStem, parts: [
      { id: 'q8a', level: 'PRG', make: function (r, o) { return droneA(r, o); } },
      { id: 'q8b', level: 'PRG', make: function (r, o) { return droneB(r, o); } }] },
    { num: '9', parts: [{ id: 'q9', level: 'PRG', make: function (r) { return tanPart(r, tanShared(r, {})); } }] },
    { num: '10', parts: [{ id: 'q10', level: 'PRG', make: function (r) { return cVals(r); } }] },
    { num: '11', parts: [{ id: 'q11', level: 'ADV', make: function (r) { return circTan(r); } }] },
    { num: '12', shared: function (r) { return pqShared(r); }, stem: function (o) { var v = pqV(o); return 'An arrow is shot upward from the top of a cliff. Its height above the beach after ' + t('t') + ' seconds is ' + t('h=-5(t-p)^{2}+q') + ' metres. After ' + t(nT(o.t1)) + ' s it is ' + t(nT(v.h1)) + ' m high and after ' + t(nT(v.t2)) + ' s it is ' + t(nT(v.h2)) + ' m high.'; }, parts: [
      { id: 'q12a', level: 'ADV', make: function (r, o) { var S = pqSpecs(o); return fieldsP('Write and solve a system to determine ' + t('p') + ' and ' + t('q') + '.', [S.p, S.q], { sol: pqSolA(o), hints: HPQ, text: 'model from two data points', bad: [[nK(o.p), nK(pqV(o).h1)], [nK(o.p + 1), nK(pqV(o).q)]] }); } },
      { id: 'q12b', level: 'MAS', make: function (r, o) { var S = pqSpecs(o), v = pqV(o); return fieldsP('How high is the cliff, and when does the arrow land on the beach (to the nearest hundredth of a second)?', [Object.assign({}, S.h0, { label: 'Cliff height:', name: 'Cliff' }), S.T], { sol: pqSolB(o), hints: ['The cliff top is where the arrow starts: ' + t('t=0') + '.', 'It lands when ' + t('h=0') + ': solve ' + t('(t-p)^{2}=\\dfrac{q}{5}') + ' and keep the root after the throw.'], text: 'cliff height and landing time', bad: [[nK(v.q), fx(v.T, 2)], [nK(o.H0), fx(o.p - Math.sqrt(v.q / 5), 2)]] }); } }] },
    { num: '13', parts: [{ id: 'q13', level: 'EMG', make: function (r) { return countMC(r); } }] },
    { num: '14', parts: [{ id: 'q14', level: 'BEG', make: function (r) { return modelMC(r); } }] },
    { num: '15', parts: [{ id: 'q15', level: 'EMG', make: function (r) { return beMC(r); } }] },
    { num: '16', parts: [{ id: 'q16', level: 'PRG', make: function (r) {
      var z = tanShared(r, { kpos: true, excl: function (s) { return s.m === 2 && s.b === -4; } }), v = tanV(z);
      return numP('<i>(Numerical Response)</i> The line ' + t('y=' + (z.m === 1 ? '' : z.m === -1 ? '-' : z.m) + 'x+k') + ' is tangent to the parabola ' + t('y=' + qx(1, z.b, z.c)) + '. The value of ' + t('k') + ' is ______.', v.k, { nr: true,
        cands: [[z.c + v.d * v.d / 4, CP + 'k-sign', 'Check the sign: the constant term is ' + t('(' + z.c + '-k)') + '.']], sol: tanSol(z), hints: ['Substitute; a tangent gives one solution, so ' + t('b^{2}-4ac=0') + '.'], text: 'NR: tangent constant' });
    } }] },
    { num: '17', parts: [{ id: 'q17', level: 'PRG', make: function (r) {
      var o = ballsShared(r, function (z) { return (z.ts === 3 && z.dv === 10 && z.v2 === 25) || (z.ts === 1.5 && z.dv === 10) || (z.ts === 2 && z.dv === 4 && z.v2 === 18); }), v = ballsV(o);
      return numP('<i>(Numerical Response)</i> Two fireworks are launched at the same moment. One rises from the ground with height ' + t('h=-5t^{2}+' + v.v1 + 't') + ', the other from a ' + t(v.h0) + ' m roof with height ' + t('h=-5t^{2}+' + o.v2 + 't+' + v.h0) + ' (metres, ' + t('t') + ' in seconds). The height, in metres, at which they are level with each other is ______.', v.H, { nr: true,
        cands: [[o.ts, CP + 'ht', 'That is the time. Substitute it into either height equation.']], sol: ballsSol(o), hints: ['Set the heights equal: the ' + t('-5t^{2}') + ' terms cancel.', 'Solve for ' + t('t') + ', then find the height.'], text: 'NR: fireworks level' });
    } }] }
  ];

  var EXTRA = [
    { num: '1', section: 'A. Skills', parts: [{ id: 'e1', level: 'BEG', make: function (r) { return sqPairs(r); } }] },
    { num: '2', parts: [{ id: 'e2', level: 'BEG', make: function (r) { return rect(r, 'ap'); } }] },
    { num: '3', parts: [{ id: 'e3', level: 'EMG', make: function (r) {
      var o = ballsShared(r, function (z) { return (z.ts === 2 && z.dv === 4 && z.v2 === 22) || (z.ts === 1.5 && z.dv === 10 && z.v2 === 20); }), v = ballsV(o), ctx = r.pick([['from the ground', 'from a ' + v.h0 + ' m balcony', 'balls'], ['from a beach', 'from the top of a ' + v.h0 + ' m sea wall', 'stones']]);
      return fieldsP('Two ' + ctx[2] + ' are thrown upward at the same moment, one ' + ctx[0] + ' and one ' + ctx[1] + '. Their heights in metres after ' + t('t') + ' seconds are ' + t('h=-5t^{2}+' + v.v1 + 't') + ' and ' + t('h=-5t^{2}+' + o.v2 + 't+' + v.h0) + '. When are they at the same height, and what is that height?', [
        { label: 'Time:', name: 'Time', after: 's', chk: numChk(o.ts, o.ts === 1 ? [] : [[o.dv / v.h0, 'value', 'Solve ' + t(o.dv + 't=' + v.h0) + ': divide by ' + t(o.dv) + '.']]), key: nK(o.ts), ans: nT(o.ts) + '\\text{ s}' },
        { label: 'Height:', name: 'Height', after: 'm', chk: numChk(v.H, [[o.ts, CP + 'ht', 'That is the time. Substitute it into either equation.']]), key: nK(v.H), ans: nT(v.H) + '\\text{ m}' }],
        { sol: ballsSol(o), hints: ['Set the heights equal: the ' + t('-5t^{2}') + ' terms cancel.', 'Solve for ' + t('t') + ', then substitute into either equation.'], text: 'two balls: same height', bad: [[nK(o.ts), nK(v.H + 5)], [nK(o.ts + 1), nK(v.H)]] });
    } }] },
    { num: '4', parts: [{ id: 'e4', level: 'PRG', make: function (r) { return tanPart(r, tanShared(r, { neg: true })); } }] },
    { num: '5', section: 'B. Applying', parts: [{ id: 'e5', level: 'PRG', make: function (r) {
      var o = launchShared(r), Y = cl(o.m * o.X), d = Math.hypot(o.X, Y), L = LAUNCH[o.c];
      return fieldsP(launchStem(o) + ' Where does it land, and how far up the ' + L.s + ' is that, to the nearest tenth of a metre?', [
        { label: 'Landing point:', name: 'Landing point', math: true, keys: 'u8pairs', placeholder: 'e.g. (20, 20)', chk: pairsChk(CP, [{ x: o.X, y: Y }], { wrongs: [{ pts: [[0, 0], [o.X, Y]], code: CP + 'origin', hint: t('(0,\\ 0)') + ' is where it starts. Give only the landing point.' }] }), key: ptT(o.X, Y), ans: ptT(o.X, Y) },
        { label: 'Distance up the ' + L.s + ':', name: 'Distance', after: 'm', chk: apxChk(d, 1, [[o.X, CP + 'dist-x', 'That is the horizontal distance. Use the distance formula from the origin.']]), key: fx(d, 1), ans: fx(d, 1) + '\\text{ m}' }],
        { sol: landSol(o) + '<br>It lands at ' + t(ptT(o.X, Y)) + ', ' + t('\\sqrt{' + o.X + '^{2}+' + nT(Y) + '^{2}}\\approx ' + fx(d, 1)) + ' m up the ' + L.s + '.', hints: ['Set the expressions equal and factor out ' + t('x') + '.', 'Use the distance formula from the origin to the landing point.'], text: 'landing point and distance', bad: [[ptT(o.X, Y), fx(o.X, 1)], ['(0,\\ 0)', fx(d, 1)]] });
    } }] },
    { num: '6', parts: [{ id: 'e6', level: 'ADV', make: function (r) { return sprinkler(r); } }] },
    { num: '7', shared: bakeShared, stem: bakeStem, parts: [
      { id: 'e7a', level: 'PRG', make: function (r, o) {
        var v = bakeV(o), d = v.b - o.m;
        var p = KP.valueSet('Determine the break-even quantities (in hundreds of loaves).', [o.x1, v.x2], { v: 'x' }, t(qx(-o.a, v.b, 0) + '=' + qx(o.c2, o.m, v.f) + '\\Rightarrow ' + qx(v.A0, -d, v.f) + '=0') + '; divide by ' + t(v.A0) + ': ' + t(qx(1, -(o.x1 + v.x2), o.x1 * v.x2) + '=0') + ', ' + t('(x-' + o.x1 + ')(x-' + v.x2 + ')=0') + ': ' + t(o.x1 * 100) + ' and ' + t(v.x2 * 100) + ' loaves.',
          ['Set ' + t('R=C') + ' and collect all the terms on one side.', 'Divide by the common factor and factor.'], 'bakery: break-even');
        p.bad = ['x=' + (-o.x1) + ',\\ x=' + (-v.x2), 'x=' + o.x1 * 100 + ',\\ x=' + v.x2 * 100];
        return p;
      } },
      { id: 'e7b', level: 'ADV', make: function (r, o) {
        var v = bakeV(o), d = v.b - o.m;
        return numP('Determine the maximum profit (in hundreds of dollars).', v.Pm, { cands: [[v.xm, CP + 'be-x', 'That is the number of hundreds of loaves. Substitute it into ' + t('P=R-C') + '.'], [-o.a * v.xm * v.xm + v.b * v.xm, CP + 'be-rev', 'That is the revenue. Profit is ' + t('R-C') + '.']],
          sol: t('P=R-C=' + qx(-v.A0, d, -v.f)) + ', vertex at ' + t('x=' + v.xm) + ': ' + t('P=' + nT(-v.A0) + '(' + v.xm + ')^{2}+' + d + '(' + v.xm + ')-' + v.f + '=' + v.Pm) + '. A profit of ' + t(v.Pm) + ' hundred dollars (' + t('\\$' + v.Pm * 100) + ') at ' + t(v.xm * 100) + ' loaves.',
          hints: ['Profit is ' + t('P=R-C') + '; its maximum is at the vertex, halfway between the break-even values.'], text: 'bakery: maximum profit' });
      } }] },
    { num: '8', parts: [{ id: 'e8', level: 'ADV', make: function (r) {
      var o = pqShared(r, function (z) { return z.p === 2.5; }), v = pqV(o), S = pqSpecs(o);
      return fieldsP('A ball’s height is ' + t('h=-5(t-p)^{2}+q') + ' metres after ' + t('t') + ' seconds. After ' + t(nT(o.t1)) + ' s it is ' + t(nT(v.h1)) + ' m high and after ' + t(nT(v.t2)) + ' s it is ' + t(nT(v.h2)) + ' m high. Determine ' + t('p') + ' and ' + t('q') + ', the starting height, and the time the ball lands, to the nearest hundredth of a second.', [S.p, S.q, S.h0, S.T],
        { sol: pqSolA(o) + '<br>' + pqSolB(o), hints: HPQ.concat(['Start: ' + t('h(0)') + '. Lands: ' + t('h=0') + '.']), text: 'ball: model, start and landing', bad: [[nK(o.p), nK(v.h1), nK(o.H0), fx(v.T, 2)], [nK(o.p), nK(v.q), nK(v.q), fx(v.T, 2)]] });
    } }] },
    { num: '9', parts: [{ id: 'e9', level: 'PRG', make: function (r) { return noIntMC(r); } }] },
    { num: '10', parts: [{ id: 'e10', level: 'PRG', make: function (r) {
      var z = pickWhere(function () { return { x: r.int(3, 40), d: r.int(1, 6) }; }, function (s) { return !(s.x === 10 && s.d === 2) && s.x * (s.x + s.d) <= 9999; });
      var x = z.x, y = x + z.d, S = x * x + y * y, Pr = x * y, n = (S - z.d * z.d) / 2;
      return numP('<i>(Numerical Response)</i> Two positive integers differ by ' + t(z.d) + ' and the sum of their squares is ' + t(nT(S)) + '. The product of the two integers is ______.', Pr, { nr: true, cands: [[x + y, 'value', 'The question asks for the <b>product</b>, not the sum.'], [x, 'value', 'That is one of the integers. Multiply the two.']],
        sol: t('x^{2}+(x+' + z.d + ')^{2}=' + S + '\\Rightarrow 2x^{2}+' + 2 * z.d + 'x-' + 2 * n + '=0\\Rightarrow x^{2}+' + z.d + 'x-' + n + '=0\\Rightarrow (x+' + y + ')(x-' + x + ')=0') + '.<br>' + t('x=' + x) + ': the integers are ' + t(x) + ' and ' + t(y) + ', with product ' + t(Pr) + '.',
        hints: ['Let the integers be ' + t('x') + ' and ' + t('x+' + z.d) + '.', 'Expand, simplify and factor; keep the positive root.'], text: 'NR: product of two integers' });
    } }] },
    { num: '11', section: 'C. Stretch', parts: [{ id: 'e11', level: 'MAS', make: function (r) { return twiceRoot(r); } }] },
    { num: '12', shared: jetsShared, stem: jetsStem, parts: [
      { id: 'e12a', level: 'MAS', make: function (r, o) {
        var v = jetsV(o), x2 = o.X, k = o.a2 - o.a1, dB = v.b2 - v.b1;
        var sol = t(qx(-o.a1, v.b1, 0) + '=' + qx(-o.a2, v.b2, -v.c2) + '\\Rightarrow ' + qx(k, -dB, v.c2) + '=0') + (k !== 1 ? '; divide by ' + t(nT(k)) + ': ' + t(qx(1, -(o.x1 + x2), o.x1 * x2) + '=0') : '') + ', ' + t('(x-' + o.x1 + ')(x-' + x2 + ')=0') + '.<br>' +
          t('x=' + o.x1) + ': ' + t('y=' + nT(v.y1)) + '; ' + t('x=' + x2) + ': ' + t('y=0') + '. The jets cross at ' + t(ptT(o.x1, v.y1)) + ' and ' + t(ptT(x2, 0)) + '.';
        return pairsP(CP, 'Determine where the jets cross.', [{ x: o.x1, y: v.y1 }, { x: x2, y: 0 }], {}, sol, ['Set the two expressions equal and collect the terms on one side.', 'Factor; find each ' + t('y') + ' from either path.'], 'two jets: crossing points');
      } },
      { id: 'e12b', level: 'PRG', make: function (r, o) {
        var v = jetsV(o);
        return mcP(r, 'What does the crossing point with ' + t('y=0') + ' mean?', [
          { html: 'Both jets land on the ground at the same spot, ' + t(o.X) + ' m from the first nozzle.', right: true },
          { html: 'It is where the second jet leaves its nozzle.', why: 'The second jet leaves the ground at ' + t('x=' + vD(v.s)) + ' (its other zero); it comes back down at ' + t('x=' + o.X) + '.' },
          { html: 'It is where the jets reach their greatest heights.', why: 'At ' + t('y=0') + ' a jet is at ground level, not at its highest point.' },
          { html: 'Nothing: a height of 0 is not a real solution.', why: 'A height of 0 is ground level: a real point where water lands.' }],
          'At ' + t(ptT(o.X, 0)) + ' both paths are at height ' + t('0') + ': the jets cross ' + t(nT(v.y1)) + ' m up at ' + t('x=' + o.x1) + ', and both land on the ground at the same spot, ' + t(o.X) + ' m from the first nozzle.', ['A height ' + t('y=0') + ' is ground level.'], 'two jets: meaning');
      } }] },
    { num: '13', parts: [{ id: 'e13', level: 'MAS', make: function (r) { return circPar(r); } }] }
  ];

  HW.defineLesson({ id: LID, unit: 8, num: '3', title: 'Problems Involving Systems', outcome: 'RF6', calc: true, questions: QUESTIONS, extra: EXTRA });
})(window);
