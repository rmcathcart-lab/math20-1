/* Math 20-1 · Unit 3 · Lesson 2 — Trigonometric Ratios from a Point on the Terminal Arm (outcome T2 on every part)
 * Assignment 2 (m201book unit3/u3_l02.tex, Questions 1–17) and the Lesson 2 Extra Practice (u3_ep02.tex, A1–A4, B1–B6,
 * C1–C3). Every part is a generator: the booklet question's idea, form and difficulty with new points and contexts (the
 * lesson's example points and the booklet question's own point are left out). On-screen calculator allowed (Unit 3,
 * Degree mode); angles to the rounding stated (nearest tenth, or nearest degree for numerical response).
 * Uses the Unit 3 point kit from u3l1.js (HW.u3l1kit: sketches, exact-value checker, keypads), so u3l1.js loads first.
 *
 * Exact answers (r, sin θ, cos θ, tan θ) are typed with the keypad (√, fraction, −, undef.): the value must be exact and
 * in simplest form (radical simplified, fraction reduced); where the booklet asks for rational denominators an answer
 * like −1/√5 gets a nudge to rationalize (−√5/5); elsewhere both are fine. "Undefined" is an answer where x = 0.
 * Recognised mistakes: r with the squares subtracted / the legs added / no square root, r negative, the ratios swapped
 * (cos for sin, …), a ratio upside down, the sign of a ratio (with the coordinate that decides it), a value given for an
 * undefined tan, tan⁻¹(y/x) with the signs left in (an angle from −90° to 90°), the reference angle given as θ, θ placed
 * in the wrong quadrant, |x| and |y| swapped in tan⁻¹, Radian mode, 0° or 360° left out of a list.
 * Conversions: "why is r never negative" / "which ratios are equal" / "explain Sam's error" / Extra B4 / Extra C3(a)
 * → multiple choice of explanations; "write the ratio as the same ratio of θR" → multiple choice (wrong sign, measured to
 * the y-axis); "positive or negative?" → a two-choice question per part; Extra B3 (signs) → a table.
 * Levels: LIM BEG EMG PRG ADV MAS. Mastery: 12(c), Extra C1(a). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, B = K.P, ex = HW.ex, F = HW.fmt, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
  var LID = 'u3l2', U = HW.u3l1kit;
  if (!U) throw new Error('u3l2.js needs u3l1.js (HW.u3l1kit) loaded first');
  var D = U.D, quad = U.quad, refOf = U.refOf, fromRef = U.fromRef, angOf = U.angOf, gcd = U.gcd, pickWhere = function (g, f) { return U.pickWhere(g, f, LID); };
  var TR = HW.trig;
  function rd(x, dp) { return K.roundTo(x, dp); }
  function fx(x, dp) { return rd(x, dp).toFixed(dp); }
  function sq(v) { return v < 0 ? '(' + v + ')^{2}' : v + '^{2}'; }

  U.addCodes({
    'u3l2-r-sub': 'r: subtracted the squares', 'u3l2-r-add': 'r: added the coordinates', 'u3l2-r-noroot': 'r: forgot the square root', 'u3l2-r-neg': 'r given as negative',
    'u3l2-swap': 'Used the wrong ratio (e.g. cos for sin)', 'u3l2-r': 'Ratio with a wrong r', 'u3l2-def-swap': 'Definitions of the ratios mixed up', 'u3l2-raw': 'θ: tan⁻¹(y/x) with the signs left in',
    'u3l2-ref-only': 'θ: gave the reference angle', 'u3l2-place': 'θ: placed in the wrong quadrant', 'u3l2-swap-xy': 'θ: tan⁻¹(x/y) instead of tan⁻¹(y/x)', 'u3l2-radian': 'Calculator in Radian mode',
    'u3l2-0-360': 'Left out 0° or 360°', 'u3l2-k-sign': 'Missing coordinate: wrong sign for the quadrant', 'u3l2-k-sub': 'Missing coordinate: subtracted instead of using squares', 'u3l2-mc': 'Chose a wrong statement', 'u3l2-sign': 'Wrong sign of a ratio'
  });
  HW.addPartial({ 'u3l2-r-sub': 'b', 'u3l2-r-add': 'b', 'u3l2-r-noroot': 's', 'u3l2-r-neg': 's', 'u3l2-swap': 'b', 'u3l2-r': 'b', 'u3l2-def-swap': 'b', 'u3l2-raw': 'b', 'u3l2-ref-only': 's',
    'u3l2-place': 'b', 'u3l2-swap-xy': 'b', 'u3l2-radian': 's', 'u3l2-0-360': 's', 'u3l2-k-sign': 's', 'u3l2-k-sub': 'b' });

  /* ---------------- points ---------------- */
  /* the lesson's example points and the booklet's own points (assignment and extra practice) */
  var EXP = ['-20,21', '4,-6', '-3,-3', '7,24', '-9,40', '-5,-12', '6,-3', '0,-7', '3,4', '-3,4', '-3,-4', '3,-4', '5,2', '-4,5', '-6,-1', '3,-5', '-12,-5',
    '-7,24', '9,-12', '-2,-10', '5,5', '-1,3', '0,-4', '40,9', '-21,20', '12,-35', '-3,-6', '2,-3', '-1,1', '-3,0', '-5,2', '-3,-8', '4,-1', '5,12', '-5,12', '7,3', '-4,9', '-5,-8', '6,-11', '0,-6',
    '-2,5', '-18,24', '4,-7', '0,-3', '-20,-21', '-8,-6', '-10,24', '3,-3', '-1,-7', '6,0', '35,12', '-16,-30', '4,-2', '2,5', '-8,3', '-1,-4', '10,-7', '30,-16', '-7,3', '-2,-6', '-7,7'];
  function okPt(x, y, excl) { var k = x + ',' + y; return EXP.indexOf(k) < 0 && (excl || []).indexOf(k) < 0; }
  var TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [12, 35, 37], [9, 40, 41], [28, 45, 53], [11, 60, 61], [33, 56, 65], [16, 63, 65], [48, 55, 73], [13, 84, 85], [36, 77, 85], [39, 80, 89], [65, 72, 97]];
  function sgnQ(q) { return [q === 1 || q === 4 ? 1 : -1, q <= 2 ? 1 : -1]; }
  /* a point on a Pythagorean triple in quadrant q; o.list: triples to use; o.k: [lo, hi] scale */
  function triPt(r, q, o) {
    o = o || {};
    return pickWhere(function () { var tr = r.pick(o.list || TRIPLES), k = o.k ? r.int(o.k[0], o.k[1]) : 1, sw = r.chance(0.5), s = sgnQ(q); return [s[0] * k * (sw ? tr[1] : tr[0]), s[1] * k * (sw ? tr[0] : tr[1])]; },
      function (p) { return okPt(p[0], p[1], o.excl) && (!o.max || Math.max(Math.abs(p[0]), Math.abs(p[1])) <= o.max); });
  }
  /* x² + y² = k²m with m square-free */
  function rParts(x, y) { var N = x * x + y * y, f = ex.nthFactor(N, 2); return { N: N, k: f, m: N / (f * f) }; }
  /* a point whose r is not whole (o.kMin: r = k√m with k ≥ kMin) */
  function radPt(r, q, lo, hi, o) {
    o = o || {}; var s = sgnQ(q);
    return pickWhere(function () { return [s[0] * r.int(lo, hi), s[1] * r.int(lo, hi)]; }, function (p) { var z = rParts(p[0], p[1]); return z.m > 1 && Math.abs(p[0]) !== Math.abs(p[1]) && z.k >= (o.kMin || 1) && (o.kMax == null || z.k <= o.kMax) && okPt(p[0], p[1], o.excl); });
  }
  /* exact r, sin, cos, tan of (x, y) */
  function rats(x, y) {
    var z = rParts(x, y), k = z.k, m = z.m;
    return { k: k, m: m, N: z.N, r: U.X(k, m), sin: U.X([y, k * m], m), cos: U.X([x, k * m], m), tan: x === 0 ? U.UNDEF : U.X([y, x], 1), rv: Math.sqrt(z.N) };
  }
  function rTex(x, y) { var z = rParts(x, y); return z.m === 1 ? String(z.k) : (z.k === 1 ? '' : z.k) + '\\sqrt{' + z.m + '}'; }
  function rSol(x, y) {
    var z = rParts(x, y), s = 'r=\\sqrt{' + sq(x) + '+' + sq(y) + '}=\\sqrt{' + (x * x) + '+' + (y * y) + '}=\\sqrt{' + z.N + '}';
    if (z.m === 1) s += '=' + z.k; else if (z.k > 1) s += '=\\sqrt{' + (z.k * z.k) + '\\cdot ' + z.m + '}=' + z.k + '\\sqrt{' + z.m + '}';
    return t(s);
  }
  /* one ratio's working: sin θ = y/r = … */
  var FNT = { sin: '\\sin\\theta', cos: '\\cos\\theta', tan: '\\tan\\theta' };
  function ratSol(fn, x, y) {
    var R = rats(x, y), T = R[fn];
    if (fn === 'tan') { if (x === 0) return t('\\tan\\theta=\\frac{' + y + '}{0}') + ' is undefined'; return t('\\tan\\theta=\\frac{y}{x}=\\frac{' + y + '}{' + x + '}' + (U.xtex(T) === '\\frac{' + y + '}{' + x + '}' ? '' : '=' + U.xtex(T))); }
    var num = fn === 'sin' ? y : x, rt = rTex(x, y), s = FNT[fn] + '=\\frac{' + (fn === 'sin' ? 'y' : 'x') + '}{r}=\\frac{' + num + '}{' + rt + '}';
    if (R.m > 1 && num !== 0 && gcd(num, R.k) > 1) s += '=' + U.xtexDen(num, R.k, R.m);
    var fin = U.xtex(T); if (s.slice(-fin.length - 1) !== '=' + fin && '\\frac{' + num + '}{' + rt + '}' !== fin) s += '=' + fin;
    return t(s);
  }
  var SIGNH = { sin: 'Check the sign: ' + t('\\sin\\theta=\\frac{y}{r}') + ' has the sign of ' + t('y') + ' (' + t('r') + ' is always positive).',
    cos: 'Check the sign: ' + t('\\cos\\theta=\\frac{x}{r}') + ' has the sign of ' + t('x') + ' (' + t('r') + ' is always positive).',
    tan: 'Check the sign: ' + t('\\tan\\theta=\\frac{y}{x}') + ' is positive when ' + t('x') + ' and ' + t('y') + ' have the same sign, negative when they don’t.' };
  /* typical wrong values of a ratio */
  function ratCands(fn, x, y) {
    var rv = Math.sqrt(x * x + y * y), rs = Math.sqrt(Math.abs(x * x - y * y)), ra = Math.abs(x) + Math.abs(y), N = x * x + y * y, c = [];
    var top = fn === 'sin' ? y : fn === 'cos' ? x : null;
    if (fn !== 'sin') c.push([y / rv, LID + '-swap', 'That is ' + t('\\sin\\theta=\\frac{y}{r}') + '. ' + (fn === 'cos' ? t('\\cos\\theta=\\frac{x}{r}') : t('\\tan\\theta=\\frac{y}{x}')) + '.']);
    if (fn !== 'cos') c.push([x / rv, LID + '-swap', 'That is ' + t('\\cos\\theta=\\frac{x}{r}') + '. ' + (fn === 'sin' ? t('\\sin\\theta=\\frac{y}{r}') : t('\\tan\\theta=\\frac{y}{x}')) + '.']);
    if (fn !== 'tan' && x !== 0) c.push([y / x, LID + '-swap', 'That is ' + t('\\tan\\theta=\\frac{y}{x}') + '. ' + (fn === 'sin' ? t('\\sin\\theta=\\frac{y}{r}') : t('\\cos\\theta=\\frac{x}{r}')) + '.']);
    if (fn === 'tan' && y !== 0) c.push([x / y, LID + '-swap', 'Upside down: ' + t('\\tan\\theta=\\frac{y}{x}') + ' (the y-coordinate on top).']);
    if (top != null && top !== 0) {
      if (rs > 0) c.push([top / rs, LID + '-r', 'Check ' + t('r') + ': ' + t('r=\\sqrt{x^2+y^2}') + ' — <b>add</b> the squares.']);
      c.push([top / ra, LID + '-r', 'Check ' + t('r') + ': ' + t('r=\\sqrt{x^2+y^2}') + ', not ' + t('|x|+|y|') + '.']);
      c.push([top / N, LID + '-r', 'Check ' + t('r') + ': it is the <b>square root</b> of ' + t('x^2+y^2') + '.']);
    }
    return c;
  }
  function ratCheck(fn, x, y, rat) { var R = rats(x, y); return U.exact(R[fn], { rat: rat, cands: ratCands(fn, x, y), signHint: SIGNH[fn] }); }
  function rCands(x, y) { var N = x * x + y * y, c = []; var d = Math.abs(x * x - y * y); if (d) c.push([Math.sqrt(d), LID + '-r-sub', 'Add the squares: ' + t('r=\\sqrt{x^2+y^2}') + '. (A negative coordinate squared is positive.)']); c.push([Math.abs(x) + Math.abs(y), LID + '-r-add', t('r') + ' is not ' + t('|x|+|y|') + ': use ' + t('r=\\sqrt{x^2+y^2}') + '.']); c.push([N, LID + '-r-noroot', 'That is ' + t('r^2=x^2+y^2') + '. Take the square root.']); c.push([-Math.sqrt(N), LID + '-r-neg', t('r') + ' is a distance, so it is always positive.']); return c; }
  /* a box for r */
  function rSpec(x, y, o) { o = o || {}; var R = rats(x, y); return { label: t('r'), name: 'r', before: '=', math: true, after: o.after || '', check: U.exact(R.r, { cands: rCands(x, y), signHint: t('r') + ' is a distance, so it is always positive.' }), key: U.xtex(R.r), ansTex: U.xtex(R.r) + (o.unitTex || '') }; }
  function ratSpec(fn, x, y, rat, lab) { var R = rats(x, y); return { label: lab || t(FNT[fn]), name: fn + ' θ', before: '=', math: true, after: '', check: ratCheck(fn, x, y, rat), key: U.xtex(R[fn]), ansTex: U.xtex(R[fn]) }; }
  function ptSketch(x, y, o) { o = o || {}; return U.sketch({ pt: [x, y], ptLabel: o.label || '(' + x + ', ' + y + ')', drop: x !== 0 && y !== 0, legs: o.legs === false ? null : { r: 'r' }, rot: o.rot === false ? null : { to: angOf(x, y) }, w: o.w || 200 }); }
  var H_R = ['Drop a perpendicular to the x-axis: the legs are ' + t('|x|') + ' and ' + t('|y|') + ', the hypotenuse is ' + t('r') + '. So ' + t('r=\\sqrt{x^2+y^2}') + '.', 'Simplify the radical: take out the largest perfect-square factor.'];
  var H_RAT = ['First find ' + t('r=\\sqrt{x^2+y^2}') + '.', t('\\sin\\theta=\\frac{y}{r}') + ', ' + t('\\cos\\theta=\\frac{x}{r}') + ', ' + t('\\tan\\theta=\\frac{y}{x}') + '. Keep the signs of ' + t('x') + ' and ' + t('y') + '.'];
  var H_RATR = H_RAT.concat(['Rationalize: ' + t('\\frac{a}{\\sqrt{m}}=\\frac{a\\sqrt{m}}{m}') + '.']);
  function rPart(prompt, x, y, o) {
    o = o || {}; var R = rats(x, y);
    return { prompt: prompt, input: { type: 'math', keys: U.KS, before: t('r=') }, check: U.exact(R.r, { cands: rCands(x, y), signHint: t('r') + ' is a distance, so it is always positive.' }), key: U.xtex(R.r), answer: t('r=' + U.xtex(R.r)),
      solution: ptSketch(x, y, { rot: false }) + rSol(x, y), hints: H_R, text: o.text || 'exact distance r', bad: U.badTex(rCands(x, y), R.r) };
  }
  function ratiosPart(prompt, x, y, o) {
    o = o || {}; var fns = o.fns || ['sin', 'cos', 'tan'], specs = [];
    if (o.withR) specs.push(rSpec(x, y));
    fns.forEach(function (fn) { specs.push(ratSpec(fn, x, y, !!o.rat)); });
    return U.fieldsP(prompt, specs, { sol: (o.sketch === false ? '' : ptSketch(x, y)) + rSol(x, y) + '<br>' + fns.map(function (fn) { return ratSol(fn, x, y); }).join('<br>'), hints: o.rat ? H_RATR : H_RAT, text: o.text || 'exact ratios from a point' });
  }
  /* θ (0 ≤ θ < 360) to dp places from (x, y), with the usual wrong answers */
  function thAlts(x, y) {
    var th = angOf(x, y), q = quad(th), alts = [];
    if (!q) { [0, 90, 180, 270, 360].forEach(function (b) { alts.push({ v: b, code: LID + '-place', hint: 'The point is on ' + U.axisName(th) + '. ' + t('0^\\circ') + ': positive x-axis, ' + t('90^\\circ') + ': positive y-axis, ' + t('180^\\circ') + ': negative x-axis, ' + t('270^\\circ') + ': negative y-axis.' }); }); return alts; }
    var ax = Math.abs(x), ay = Math.abs(y), R = TR.atan(ay / ax), S = TR.atan(ax / ay), Rr = Math.atan(ay / ax);
    alts.push({ v: TR.atan(y / x), code: LID + '-raw', hint: 'The calculator’s ' + t('\\tan^{-1}') + ' only gives angles from ' + t('-90^\\circ') + ' to ' + t('90^\\circ') + '. Find ' + t('\\theta_R=\\tan^{-1}\\left(\\frac{|y|}{|x|}\\right)') + ', then place ' + t('\\theta') + ' in quadrant ' + q + '.' });
    if (q !== 1) alts.push({ v: R, code: LID + '-ref-only', hint: 'That is the reference angle ' + t('\\theta_R') + '. The point is in quadrant ' + q + ', so ' + t(U.FROM_F[q - 1]) + '.' });
    [2, 3, 4].forEach(function (k) { if (k !== q) alts.push({ v: fromRef(R, k), code: LID + '-place', hint: 'Check the quadrant: ' + t('(' + x + ',\\ ' + y + ')') + ' is in quadrant ' + q + ', so ' + t(U.FROM_F[q - 1]) + '.' }); });
    alts.push({ v: fromRef(S, q), code: LID + '-swap-xy', hint: t('\\tan\\theta=\\frac{y}{x}') + ': put ' + t('|y|') + ' on top, ' + t('\\theta_R=\\tan^{-1}\\left(\\frac{' + ay + '}{' + ax + '}\\right)') + '.' });
    alts.push({ v: S, code: LID + '-swap-xy', hint: t('\\tan\\theta=\\frac{y}{x}') + ': put ' + t('|y|') + ' on top.' });
    alts.push({ v: Rr, code: LID + '-radian', hint: 'Your calculator is in <b>Radian</b> mode. Switch to Degree mode ([MODE], DEGREE) and try again.' });
    if (q !== 1) alts.push({ v: fromRef(Rr, q), code: LID + '-radian', hint: 'Your calculator is in <b>Radian</b> mode. Switch to Degree mode ([MODE], DEGREE) and try again.' });
    return alts;
  }
  function thSol(x, y, dp) {
    var th = angOf(x, y), q = quad(th);
    if (!q) return 'The point is on ' + U.axisName(th) + ': ' + t('\\theta=' + D(Math.round(th))) + '.';
    var ax = Math.abs(x), ay = Math.abs(y), R = TR.atan(ay / ax), Rt = fx(R, dp), tt = fx(th, dp);
    if (q === 1) return 'Quadrant 1: ' + t('\\theta=\\tan^{-1}\\left(\\frac{' + ay + '}{' + ax + '}\\right)\\approx ' + D(tt)) + '.';
    return 'Quadrant ' + q + ', ' + t('\\theta_R=\\tan^{-1}\\left(\\frac{' + ay + '}{' + ax + '}\\right)\\approx ' + D(Rt)) + '; ' + t(['', '', '\\theta=180^\\circ-' + D(Rt), '\\theta=180^\\circ+' + D(Rt), '\\theta=360^\\circ-' + D(Rt)][q] + (q ? '=' + D(tt) : '')) + '.';
  }
  var H_TH = ['Plot the point and decide its quadrant. Calculator in <b>Degree</b> mode.', t('\\theta_R=\\tan^{-1}\\left(\\frac{|y|}{|x|}\\right)') + '. Then Q1: ' + t(U.FROM_F[0]) + '; Q2: ' + t(U.FROM_F[1]) + '; Q3: ' + t(U.FROM_F[2]) + '; Q4: ' + t(U.FROM_F[3]) + '.'];
  function thPart(prompt, x, y, o) {
    o = o || {}; var dp = o.dp == null ? 1 : o.dp, th = angOf(x, y);
    var p = K.P.near(prompt, th, dp, { unit: '°', before: o.nr ? undefined : t('\\theta='), nr: o.nr, alts: thAlts(x, y) }, (o.sketch === false ? '' : ptSketch(x, y)) + thSol(x, y, dp) + (o.nr && dp === 0 ? ' To the nearest degree: ' + t(D(fx(th, 0))) + '.' : ''), H_TH, o.text || 'θ from a point');
    p.bad = thAlts(x, y).filter(function (a) { return isFinite(a.v) && Math.abs(rd(a.v, dp) - rd(th, dp)) > 1e-9 && (!o.nr || fx(a.v, dp).length <= 4); }).map(function (a) { return fx(a.v, dp); });
    return p;
  }
  function thSpec(lab, x, y, dp) { var th = angOf(x, y); return { label: lab, name: lab.replace(/\\\(|\\\)/g, ''), before: '\\(\\approx\\)', check: K.near(th, dp, { alts: thAlts(x, y) }), key: fx(th, dp), ansTex: D(fx(th, dp)) }; }
  /* "write the ratio as the same ratio of θR" */
  var FN = { sin: '\\sin', cos: '\\cos', tan: '\\tan' }, SG = { sin: [1, 1, -1, -1], cos: [1, -1, -1, 1], tan: [1, -1, 1, -1] };
  function refRatioMC(r, fn, a) {
    var R = refOf(a), q = quad(a), s = SG[fn][q - 1], T = function (sg, ang) { return (sg < 0 ? '-' : '') + FN[fn] + ' ' + D(ang); };
    var why = fn === 'sin' ? (s > 0 ? t('y>0') : t('y<0')) : fn === 'cos' ? (s > 0 ? t('x>0') : t('x<0')) : (s > 0 ? t('x') + ' and ' + t('y') + ' have the same sign' : t('x') + ' and ' + t('y') + ' have opposite signs');
    return U.mcP(r, 'Write ' + t(FN[fn] + ' ' + D(a)) + ' as the same ratio of its reference angle, with the correct sign.', [
      { html: t(T(s, R)), right: true },
      { html: t(T(-s, R)), why: 'Right reference angle, wrong sign. In quadrant ' + q + ', ' + why + '.', code: 'sign' },
      { html: t(T(s, 90 - R)), why: 'The reference angle is measured to the <b>x-axis</b>: ' + U.refStep(a).replace(/^Quadrant \d: /, ''), code: 'yaxis' },
      { html: t(T(-s, 90 - R)), why: 'Find the reference angle (to the x-axis) and the sign from the quadrant.', code: 'both' }],
      U.angSketch(a, { ref: true }) + 'Quadrant ' + q + ', ' + t('\\theta_R=' + D(R)) + ', ' + why + ': ' + t(FN[fn] + ' ' + D(a) + '=' + T(s, R)) + '.', ['Sketch the angle: find ' + t('\\theta_R') + ', then decide the sign from the quadrant (' + t('\\sin') + ' follows ' + t('y') + ', ' + t('\\cos') + ' follows ' + t('x') + ', ' + t('\\tan') + ' follows ' + t('\\frac{y}{x}') + ').'], 'same ratio of θR, with sign', true);
  }
  function refAng(r, q, lo, hi, excl) { return pickWhere(function () { return fromRef(r.int(lo, hi), q); }, function (a) { return refOf(a) !== 45 && [250, 130, 310, 165, 233].concat(excl || []).indexOf(a) < 0; }); }
  /* positive or negative? */
  function signMC(r, fn, x, y) {
    var v = fn === 'sin' ? y : fn === 'cos' ? x : y / x, pos = v > 0;
    var reason = fn === 'sin' ? (y > 0 ? t('y>0') : t('y<0')) + ' and ' + t('r>0') : fn === 'cos' ? (x > 0 ? t('x>0') : t('x<0')) + ' and ' + t('r>0') : t('\\frac{' + y + '}{' + x + '}') + ': ' + ((x > 0) === (y > 0) ? 'same signs' : 'opposite signs');
    var p = U.mcP(r, t(FN[fn] + '\\theta') + ', for the point ' + t('(' + x + ',\\ ' + y + ')') + ': positive or negative?', [{ html: '<b>Positive</b>', right: pos, why: pos ? null : SIGNH[fn] }, { html: '<b>Negative</b>', right: !pos, why: pos ? SIGNH[fn] : null }],
      (pos ? 'Positive' : 'Negative') + ' (' + reason + ').', [SIGNH[fn].replace(/^Check the sign: /, '')], 'sign of a ratio', true, 2);
    p.tries = 1; return p;
  }
  /* "for which angles is …" */
  function setAngles(prompt, vals, fnTex, o) {
    o = o || {};
    var diag = function (resp) {
      var has = function (v) { return resp.indexOf(v) >= 0; };
      if (vals.indexOf(0) >= 0 && vals.indexOf(360) >= 0 && (has(0) !== has(360)) && U.sameSet(resp.concat([has(0) ? 360 : 0]), vals)) return { code: LID + '-0-360', hint: t('0^\\circ') + ' and ' + t('360^\\circ') + ' are on the same arm, and both are in ' + t('0^\\circ\\le\\theta\\le 360^\\circ') + ': list both.' };
      return null;
    };
    return U.setP(prompt, vals, { diag: diag, sol: o.sol, hints: ['Use the points ' + t('(1,0),\\ (0,1),\\ (-1,0),\\ (0,-1)') + ' on the axes (' + t('r=1') + ').'], text: o.text || 'angles where a ratio has a value', bad: [vals.length > 1 ? vals.slice(1) : [vals[0] === 90 ? 270 : 90]] });
  }
  var AXV = { 0: { x: 1, y: 0 }, 90: { x: 0, y: 1 }, 180: { x: -1, y: 0 }, 270: { x: 0, y: -1 }, 360: { x: 1, y: 0 } };
  function axVal(fn, b) { var p = AXV[b]; return fn === 'sin' ? p.y : fn === 'cos' ? p.x : p.x === 0 ? 'u' : 0; }
  function axSol(b) { var p = AXV[b]; return 'At ' + t(D(b)) + ' use ' + t('(' + p.x + ',\\ ' + p.y + ')') + ', ' + t('r=1') + ': ' + t('\\sin ' + D(b) + '=' + p.y) + ', ' + t('\\cos ' + D(b) + '=' + p.x) + ', ' + (p.x === 0 ? t('\\tan ' + D(b)) + ' is undefined' : t('\\tan ' + D(b) + '=0')) + '.'; }
  function quadValPart(prompt, fn, b) {
    var v = axVal(fn, b), T = v === 'u' ? U.UNDEF : U.X(v, 1), p0 = AXV[b];
    var cands = [];
    if (fn !== 'sin') cands.push([p0.y, LID + '-swap', 'That is ' + t('\\sin ' + D(b)) + ' (the y-coordinate of ' + t('(' + p0.x + ',\\ ' + p0.y + ')') + ').']);
    if (fn !== 'cos') cands.push([p0.x, LID + '-swap', 'That is ' + t('\\cos ' + D(b)) + ' (the x-coordinate of ' + t('(' + p0.x + ',\\ ' + p0.y + ')') + ').']);
    var p = { prompt: prompt, input: { type: 'math', keys: U.KS }, check: U.exact(T, { cands: cands, undefHint: 'At ' + t(D(b)) + ', ' + t('x=0') + ': ' + t('\\tan\\theta=\\frac{y}{0}') + ' is undefined.' }), key: U.xtex(T), answer: v === 'u' ? 'undefined' : t(String(v)), solution: axSol(b), hints: ['Use the point on the terminal arm with ' + t('r=1') + ': ' + t('(1,0)') + ' at ' + t('0^\\circ') + ', ' + t('(0,1)') + ' at ' + t('90^\\circ') + ', ' + t('(-1,0)') + ' at ' + t('180^\\circ') + ', ' + t('(0,-1)') + ' at ' + t('270^\\circ') + '.'], text: 'ratio of a quadrantal angle', bad: U.badTex(cands, T) };
    return p;
  }
  var CTX = [{ who: 'A surveyor sets up a coordinate grid with the origin at a survey marker', obj: 'A tree stands', thing: 'tree', from: 'marker', u: 'm' },
    { who: 'A park ranger sets up a coordinate grid with the origin at a trailhead sign', obj: 'A campsite is', thing: 'campsite', from: 'sign', u: 'm' },
    { who: 'A drone pilot sets up a coordinate grid with the origin at the launch pad', obj: 'The drone hovers', thing: 'drone', from: 'launch pad', u: 'm' },
    { who: 'An archaeologist sets up a coordinate grid with the origin at a corner stake', obj: 'A fossil is found', thing: 'fossil', from: 'stake', u: 'm' }];

  var QUESTIONS = [
    { num: '1', stem: 'Determine the exact distance ' + t('r') + ' from the origin to each point. Write radicals in simplest form.', parts: [
      { id: '1a', level: 'BEG', make: function (r) { var p = triPt(r, 2, { list: TRIPLES.slice(1, 9) }); return rPart('The point ' + t(U.ptTex(p[0], p[1])) + '.', p[0], p[1], { text: 'r: whole number (Pythagorean triple)' }); } },
      { id: '1b', level: 'BEG', make: function (r) { var p = triPt(r, 4, { list: [[3, 4, 5], [5, 12, 13]], k: [2, 5] }); return rPart('The point ' + t(U.ptTex(p[0], p[1])) + '.', p[0], p[1], { text: 'r: whole number (multiple of a triple)' }); } },
      { id: '1c', level: 'EMG', make: function (r) { var p = radPt(r, 3, 1, 12, { kMin: 2 }); return rPart('The point ' + t(U.ptTex(p[0], p[1])) + '.', p[0], p[1], { text: 'r: mixed radical' }); } },
      { id: '1d', level: 'BEG', make: function (r) { var q = r.pick([1, 2, 3, 4]), k = pickWhere(function () { return r.int(2, 9); }, function (v) { return okPt(sgnQ(q)[0] * v, sgnQ(q)[1] * v); }), x = sgnQ(q)[0] * k, y = sgnQ(q)[1] * k; return rPart('The point ' + t(U.ptTex(x, y)) + '.', x, y, { text: 'r: equal legs (k√2)' }); } },
      { id: '1e', level: 'BEG', make: function (r) { var p = radPt(r, r.pick([2, 4]), 1, 5, { kMax: 1 }); return rPart('The point ' + t(U.ptTex(p[0], p[1])) + '.', p[0], p[1], { text: 'r: entire radical' }); } },
      { id: '1f', level: 'LIM', make: function (r) { var p = pickWhere(function () { var k = r.int(1, 12); return r.pick([[0, -k], [0, k], [-k, 0], [k, 0]]); }, function (p) { return okPt(p[0], p[1]); }); return rPart('The point ' + t(U.ptTex(p[0], p[1])) + '.', p[0], p[1], { text: 'r: point on an axis' }); } }] },
    { num: '2', stem: 'The point ' + t('P(x,\\ y)') + ' is on the terminal arm of ' + t('\\theta') + ', and ' + t('r') + ' is the distance from the origin to ' + t('P') + '.', parts: [
      { id: '2a', level: 'LIM', make: function () {
        var envs = [{ x: 3, y: 4, r: 5 }, { x: -2.3, y: 1.7, r: 2.9 }, { x: 1.1, y: -3.7, r: 4.3 }], FX = { sin: function (e) { return e.y / e.r; }, cos: function (e) { return e.x / e.r; }, tan: function (e) { return e.y / e.x; } }, KEY = { sin: '\\frac{y}{r}', cos: '\\frac{x}{r}', tan: '\\frac{y}{x}' };
        var chk = function (fn) {
          return function (resp) {
            var s = String(resp == null ? '' : resp); if (s.indexOf('=') >= 0) s = s.slice(s.lastIndexOf('=') + 1);
            var p = ex.parse(s); if (!p.ok) return form('unreadable', 'Write a fraction using ' + t('x') + ', ' + t('y') + ' and ' + t('r') + ', e.g. ' + t('\\frac{x}{y}') + '.');
            var vs = Object.keys(ex.shape(p.ast).vars); if (vs.some(function (v) { return 'xyr'.indexOf(v) < 0; })) return form('var', 'Use only the letters ' + t('x') + ', ' + t('y') + ' and ' + t('r') + '.');
            var is = function (g) { return envs.every(function (e) { return ex.eq(ex.value(p.ast, e), g(e)); }); };
            if (is(FX[fn])) return ok();
            for (var o in FX) if (o !== fn && is(FX[o])) return wrong(LID + '-def-swap', 'That is ' + t('\\' + o + '\\theta=' + KEY[o]) + '.');
            if (is(function (e) { return 1 / FX[fn](e); })) return wrong('flip', 'Upside down: which value goes on top?');
            return wrong('value', null);
          };
        };
        return U.fieldsP('Write ' + t('\\sin\\theta') + ', ' + t('\\cos\\theta') + ' and ' + t('\\tan\\theta') + ' in terms of ' + t('x') + ', ' + t('y') + ' and ' + t('r') + '.', ['sin', 'cos', 'tan'].map(function (fn) { return { label: t(FNT[fn]), name: fn + ' θ', before: '=', math: true, keys: U.KV, vars: ['x', 'y', 'r'], after: '', check: chk(fn), key: KEY[fn], ansTex: KEY[fn] }; }),
          { sol: t('\\sin\\theta=\\frac{y}{r}') + ', ' + t('\\cos\\theta=\\frac{x}{r}') + ', ' + t('\\tan\\theta=\\frac{y}{x}\\ (x\\ne 0)') + '.', hints: ['In quadrant 1 these are SOH CAH TOA: ' + t('y') + ' is opposite ' + t('\\theta') + ', ' + t('x') + ' is adjacent, ' + t('r') + ' is the hypotenuse.'], text: 'definitions in x, y, r', bad: [['\\frac{x}{r}', '\\frac{y}{r}', '\\frac{y}{x}']] });
      } },
      { id: '2b', level: 'BEG', make: function (r) {
        return U.mcP(r, 'Why is ' + t('r') + ' never negative, even when ' + t('x') + ' and ' + t('y') + ' are both negative?', [
          { html: t('r') + ' is a distance: ' + t('r=\\sqrt{x^2+y^2}') + ' squares ' + t('x') + ' and ' + t('y') + ' before adding, so it is always positive.', right: true },
          { html: t('r') + ' is negative in quadrant 3, where ' + t('x') + ' and ' + t('y') + ' are both negative.', why: t('r=\\sqrt{x^2+y^2}') + ': the squares are positive, and a square root is positive.' },
          { html: t('r') + ' has the same sign as ' + t('x') + '.', why: t('r') + ' is the length of the terminal arm from the origin to ' + t('P') + ': a length is never negative.' },
          { html: t('r') + ' is positive only because we use absolute values: ' + t('r=|x|+|y|') + '.', why: t('r') + ' is not ' + t('|x|+|y|') + ': it is ' + t('\\sqrt{x^2+y^2}') + '.' }],
          t('r') + ' is a distance (a length), and ' + t('r=\\sqrt{x^2+y^2}') + ' squares ' + t('x') + ' and ' + t('y') + ' before adding, so it is always positive.', [], 'why r > 0');
      } }] },
    { num: '3', parts: [
      { id: '3', level: 'BEG', make: function (r) { var p = triPt(r, 1, { list: TRIPLES.slice(1, 11), excl: ['24,7', '9,40'] }); return ratiosPart('The point ' + t(U.ptTex(p[0], p[1])) + ' is on the terminal arm of ' + t('\\theta') + '. Determine ' + t('r') + ' and the exact values of the three primary trigonometric ratios.', p[0], p[1], { withR: true, text: 'r and three ratios (quadrant 1)' }); } }] },
    { num: '4', stem: 'Each point is on the terminal arm of ' + t('\\theta') + '. Determine the exact values of ' + t('\\sin\\theta') + ', ' + t('\\cos\\theta') + ' and ' + t('\\tan\\theta') + ' (rational denominators).', parts: [
      { id: '4a', level: 'EMG', make: function (r) { var p = triPt(r, 2, { list: TRIPLES.slice(2, 12) }); return ratiosPart('The point ' + t(U.ptTex(p[0], p[1])) + '.', p[0], p[1], { rat: true, text: 'three ratios (Q2 triple)' }); } },
      { id: '4b', level: 'EMG', make: function (r) { var p = triPt(r, 4, { list: TRIPLES.slice(2, 12) }); return ratiosPart('The point ' + t(U.ptTex(p[0], p[1])) + '.', p[0], p[1], { rat: true, text: 'three ratios (Q4 triple)' }); } },
      { id: '4c', level: 'PRG', make: function (r) { var p = radPt(r, 3, 2, 12, { kMin: 2 }); return ratiosPart('The point ' + t(U.ptTex(p[0], p[1])) + '.', p[0], p[1], { rat: true, text: 'three ratios, r a mixed radical' }); } },
      { id: '4d', level: 'PRG', make: function (r) { var p = radPt(r, 4, 1, 6, { kMax: 1 }); return ratiosPart('The point ' + t(U.ptTex(p[0], p[1])) + '.', p[0], p[1], { rat: true, text: 'three ratios, r an entire radical' }); } },
      { id: '4e', level: 'PRG', make: function (r) { var q = r.pick([2, 3, 4]), k = pickWhere(function () { return r.int(1, 5); }, function (v) { return okPt(sgnQ(q)[0] * v, sgnQ(q)[1] * v); }), x = sgnQ(q)[0] * k, y = sgnQ(q)[1] * k; return ratiosPart('The point ' + t(U.ptTex(x, y)) + '.', x, y, { rat: true, text: 'three ratios, equal legs' }); } }] },
    { num: '5', stem: 'Each point is on the terminal arm of a quadrantal angle ' + t('\\theta') + '. State ' + t('\\theta') + ' and the values of ' + t('\\sin\\theta') + ', ' + t('\\cos\\theta') + ' and ' + t('\\tan\\theta') + '.', parts: [
      { id: '5a', level: 'EMG', make: function (r) { var p = pickWhere(function () { var k = r.int(2, 12); return [-k, 0]; }, function (p) { return okPt(p[0], p[1]); }); return quadPtPart(r, p[0], p[1]); } },
      { id: '5b', level: 'EMG', make: function (r) { var v = r.pick([1.5, 3.5, 4.5, 0.5, 6.5, 2, 5, 8]) * r.pick([1, -1]); return quadPtPart(r, 0, v); } }] },
    { num: '6', stem: 'For which angle(s) from ' + t('0^\\circ') + ' to ' + t('360^\\circ') + ' is each statement true?', parts: [
      { id: '6a', level: 'EMG', make: function (r) { var o = r.pick([['\\tan\\theta\\text{ is undefined}', [90, 270]], ['\\cos\\theta=0', [90, 270]]]); return setAngles(t(o[0]), o[1], o[0], { sol: o[0].indexOf('tan') >= 0 ? t('\\tan\\theta=\\frac{y}{x}') + ' is undefined when ' + t('x=0') + ': on the y-axis, ' + t('90^\\circ') + ' and ' + t('270^\\circ') + '.' : t('\\cos\\theta=\\frac{x}{r}=0') + ' when ' + t('x=0') + ': on the y-axis, ' + t('90^\\circ') + ' and ' + t('270^\\circ') + '.' }); } },
      { id: '6b', level: 'EMG', make: function (r) { var o = r.pick([['\\sin\\theta=0', 'y'], ['\\tan\\theta=0', 'y']]); return setAngles(t(o[0]), [0, 180, 360], o[0], { sol: t(o[0]) + ' when ' + t('y=0') + ': on the x-axis, ' + t('0^\\circ') + ', ' + t('180^\\circ') + ' and ' + t('360^\\circ') + '.' }); } },
      { id: '6c', level: 'EMG', make: function (r) { var o = r.pick([['\\cos\\theta=-1', [180], '(-1,\\ 0)'], ['\\sin\\theta=1', [90], '(0,\\ 1)'], ['\\sin\\theta=-1', [270], '(0,\\ -1)'], ['\\cos\\theta=1', [0, 360], '(1,\\ 0)']]); return setAngles(t(o[0]), o[1], o[0], { sol: t(o[0]) + ' at the point ' + t(o[2]) + ' (' + t('r=1') + '): ' + t(o[1].map(D).join(',\\ ')) + '.' }); } }] },
    { num: '7', stem: 'Without calculating, decide whether each ratio is positive or negative.', shared: function (r) { var q = r.pick([2, 4]), s = sgnQ(q); return { p: pickWhere(function () { return [s[0] * r.int(1, 9), s[1] * r.int(1, 9)]; }, function (p) { return okPt(p[0], p[1]); }) }; }, parts: [
      { id: '7a', level: 'BEG', make: function (r, s) { return signMC(r, 'sin', s.p[0], s.p[1]); } },
      { id: '7b', level: 'BEG', make: function (r, s) { return signMC(r, 'cos', s.p[0], s.p[1]); } },
      { id: '7c', level: 'BEG', make: function (r) { var q = r.pick([2, 3, 4]), sg = sgnQ(q), p = pickWhere(function () { return [sg[0] * r.int(1, 9), sg[1] * r.int(1, 9)]; }, function (p) { return okPt(p[0], p[1]); }); return signMC(r, 'tan', p[0], p[1]); } },
      { id: '7d', level: 'BEG', make: function (r) { var q = r.pick([2, 3, 4]), sg = sgnQ(q), p = pickWhere(function () { return [sg[0] * r.int(1, 9), sg[1] * r.int(1, 9)]; }, function (p) { return okPt(p[0], p[1]); }); return signMC(r, 'cos', p[0], p[1]); } }] },
    { num: '8', shared: function (r) { var p = triPt(r, 1, { list: TRIPLES.slice(0, 6), excl: ['5,12', '12,5'] }); return { a: p[0], b: p[1], ax: r.pick(['y', 'x']) }; },
      stem: function (s) { var bx = s.ax === 'y' ? -s.a : s.a, by = s.ax === 'x' ? -s.b : s.b; return 'The point ' + t('A(' + s.a + ',\\ ' + s.b + ')') + ' is on the terminal arm of an angle ' + t('\\alpha') + ', and its reflection in the ' + t(s.ax) + '-axis, ' + t('B(' + bx + ',\\ ' + by + ')') + ', is on the terminal arm of an angle ' + t('\\beta') + '.'; }, parts: [
      { id: '8a', level: 'PRG', make: function (r, s) {
        var bx = s.ax === 'y' ? -s.a : s.a, by = s.ax === 'x' ? -s.b : s.b, specs = [];
        ['sin', 'cos', 'tan'].forEach(function (fn) { specs.push(ratSpec(fn, s.a, s.b, false, t('\\' + fn + '\\alpha'))); });
        ['sin', 'cos', 'tan'].forEach(function (fn) { specs.push(ratSpec(fn, bx, by, false, t('\\' + fn + '\\beta'))); });
        ['sin α', 'cos α', 'tan α', 'sin β', 'cos β', 'tan β'].forEach(function (nm, i) { specs[i].name = nm; });
        return U.fieldsP('Determine the exact values of the three ratios for ' + t('\\alpha') + ' and for ' + t('\\beta') + '.', specs, { sol: U.sketch({ pts: [{ xy: [s.a, s.b], label: 'A' }, { xy: [bx, by], label: 'B' }], ptArms: true, w: 200 }) + t('r=' + rats(s.a, s.b).k) + ' for both.<br>' + t('\\alpha') + ': ' + ['sin', 'cos', 'tan'].map(function (fn) { return t('\\' + fn + '\\alpha=' + U.xtex(rats(s.a, s.b)[fn])); }).join(', ') + '<br>' + t('\\beta') + ': ' + ['sin', 'cos', 'tan'].map(function (fn) { return t('\\' + fn + '\\beta=' + U.xtex(rats(bx, by)[fn])); }).join(', '), hints: H_RAT, text: 'ratios of a point and its reflection' });
      } },
      { id: '8b', level: 'PRG', make: function (r, s) {
        var y = s.ax === 'y', same = y ? 'sines' : 'cosines', opp = y ? 'cosines and tangents' : 'sines and tangents', keepC = y ? t('y') : t('x'), chC = y ? t('x') : t('y');
        return U.mcP(r, 'Which ratios of ' + t('\\alpha') + ' and ' + t('\\beta') + ' are equal, and which are opposites? Why?', [
          { html: 'The ' + same + ' are equal and the ' + opp + ' are opposites: the reflection changes the sign of ' + chC + ' only.', right: true },
          { html: 'The ' + (y ? 'cosines' : 'sines') + ' are equal and the ' + (y ? 'sines and tangents' : 'cosines and tangents') + ' are opposites: the reflection changes the sign of ' + keepC + ' only.', why: 'Reflecting in the ' + t(s.ax) + '-axis changes the sign of ' + chC + ' and keeps ' + keepC + '.' },
          { html: 'All three are equal: the reference triangle is the same size.', why: 'Same size, but one coordinate changes sign — so some ratios change sign.' },
          { html: 'All three are opposites: the point moves to another quadrant.', why: 'Only the ratios that use ' + chC + ' change sign.' }],
          'Reflecting in the ' + t(s.ax) + '-axis keeps ' + keepC + ' and changes the sign of ' + chC + '. ' + (y ? t('\\sin=\\frac{y}{r}') + ' stays the same; ' + t('\\cos=\\frac{x}{r}') + ' and ' + t('\\tan=\\frac{y}{x}') : t('\\cos=\\frac{x}{r}') + ' stays the same; ' + t('\\sin=\\frac{y}{r}') + ' and ' + t('\\tan=\\frac{y}{x}')) + ' change sign.', ['Which coordinate changes sign in the reflection?'], 'which ratios are equal / opposite');
      } },
      { id: '8c', level: 'ADV', make: function (r, s) {
        var bx = s.ax === 'y' ? -s.a : s.a, by = s.ax === 'x' ? -s.b : s.b, al = angOf(s.a, s.b), be = angOf(bx, by);
        return U.fieldsP('Determine ' + t('\\alpha') + ' and ' + t('\\beta') + ' to the nearest tenth of a degree.', [thSpec(t('\\alpha'), s.a, s.b, 1), thSpec(t('\\beta'), bx, by, 1)],
          { sol: t('\\alpha=\\tan^{-1}\\left(\\frac{' + s.b + '}{' + s.a + '}\\right)\\approx ' + D(fx(al, 1))) + '; &nbsp;' + t('\\beta') + ' is in quadrant ' + quad(be) + ' with the same reference angle: ' + t('\\beta=' + (quad(be) === 2 ? '180^\\circ-' + D(fx(al, 1)) : '360^\\circ-' + D(fx(al, 1))) + '=' + D(fx(be, 1))) + '.', hints: H_TH, text: 'α and β to the nearest tenth' });
      } }] },
    { num: '9', stem: 'Write each ratio as the same ratio of its reference angle, with the correct sign.', parts: [['sin', 3, [215]], ['cos', 2, [110]], ['tan', 4, [290]], ['cos', 4, [345]], ['tan', 3, [200]], ['sin', 2, [99]]].map(function (z, i) {
      return { id: '9' + 'abcdef'[i], level: 'PRG', make: function (r) { return refRatioMC(r, z[0], refAng(r, z[1], 5, 85, z[2])); } };
    }) },
    { num: '10', stem: 'Each point is on the terminal arm of ' + t('\\theta') + ', ' + t('0^\\circ\\le\\theta<360^\\circ') + '. Determine ' + t('\\theta') + ' to the nearest tenth of a degree.', parts: [
      { id: '10a', level: 'EMG', make: function (r) { var p = radPt(r, 1, 1, 9); return thPart('The point ' + t(U.ptTex(p[0], p[1])) + '.', p[0], p[1], { text: 'θ from a point (Q1)' }); } },
      { id: '10b', level: 'PRG', make: function (r) { var p = radPt(r, 2, 1, 12); return thPart('The point ' + t(U.ptTex(p[0], p[1])) + '.', p[0], p[1], { text: 'θ from a point (Q2)' }); } },
      { id: '10c', level: 'PRG', make: function (r) { var p = radPt(r, 3, 1, 12); return thPart('The point ' + t(U.ptTex(p[0], p[1])) + '.', p[0], p[1], { text: 'θ from a point (Q3)' }); } },
      { id: '10d', level: 'PRG', make: function (r) { var p = radPt(r, 4, 1, 12); return thPart('The point ' + t(U.ptTex(p[0], p[1])) + '.', p[0], p[1], { text: 'θ from a point (Q4)' }); } },
      { id: '10e', level: 'EMG', make: function (r) { var p = pickWhere(function () { var k = r.int(2, 12); return r.pick([[0, -k], [0, k], [-k, 0]]); }, function (p) { return okPt(p[0], p[1]); }); return thPart('The point ' + t(U.ptTex(p[0], p[1])) + '.', p[0], p[1], { text: 'θ from a point on an axis' }); } }] },
    { num: '11', shared: function (r) { return { p: radPt(r, 2, 1, 9) }; },
      stem: function (s) { var x = s.p[0], y = s.p[1]; return 'To find ' + t('\\theta') + ' for the point ' + t('P(' + x + ',\\ ' + y + ')') + ', Sam entered ' + t('\\tan^{-1}\\left(\\frac{' + y + '}{' + x + '}\\right)') + ' and wrote ' + t('\\theta=' + D(fx(TR.atan(y / x), 1))) + '.'; }, parts: [
      { id: '11a', level: 'ADV', make: function (r, s) {
        var x = s.p[0], y = s.p[1], raw = fx(TR.atan(y / x), 1), R = fx(TR.atan(Math.abs(y / x)), 1);
        return U.mcP(r, 'Why is this not the answer?', [
          { html: t('P') + ' is in quadrant 2, so ' + t('\\theta') + ' is between ' + t('90^\\circ') + ' and ' + t('180^\\circ') + '; the calculator’s ' + t('\\tan^{-1}') + ' only gives angles from ' + t('-90^\\circ') + ' to ' + t('90^\\circ') + '.', right: true },
          { html: 'A negative angle is fine: ' + t('\\theta=' + D(raw)) + ' is clockwise, so it is the answer.', why: 'The question asks for ' + t('0^\\circ\\le\\theta<360^\\circ') + ', and ' + t(D(raw)) + ' doesn’t even end in the right quadrant: it ends in quadrant 4.' },
          { html: 'Sam should add ' + t('360^\\circ') + ': ' + t('\\theta=' + D(fx(360 + TR.atan(y / x), 1))) + '.', why: 'That angle ends in quadrant 4, but ' + t('P') + ' is in quadrant 2.' },
          { html: 'Sam’s calculator was in Radian mode.', why: 'In Radian mode the answer would be about ' + t(fx(Math.atan(y / x), 2)) + '. The problem is the quadrant.' }],
          t('P') + ' is in quadrant 2. The calculator only returns angles from ' + t('-90^\\circ') + ' to ' + t('90^\\circ') + '. Use the reference angle: ' + t('\\theta_R=\\tan^{-1}\\left(\\frac{' + y + '}{' + (-x) + '}\\right)\\approx ' + D(R)) + ', so ' + t('\\theta=180^\\circ-' + D(R) + '=' + D(fx(angOf(x, y), 1))) + '.', ['Plot ' + t('P') + ': which quadrant is it in? Which angles does ' + t('\\tan^{-1}') + ' give?'], 'explain: tan⁻¹ with signs');
      } },
      { id: '11b', level: 'PRG', make: function (r, s) { return thPart('Find the correct ' + t('\\theta') + ' to the nearest tenth.', s.p[0], s.p[1], { text: 'correct θ after the tan⁻¹ error' }); } }] },
    { num: '12', shared: function (r) { var q = r.pick([2, 3, 4]); return { c: r.pick(CTX), p: triPt(r, q, { list: [[3, 4, 5], [5, 12, 13], [8, 15, 17]], k: [2, 6], max: 60, excl: ['-24,18', '-18,24'] }) }; },
      stem: function (s) { return s.c.who + ', the positive ' + t('x') + '-axis pointing east and the positive ' + t('y') + '-axis pointing north (units: metres). ' + s.c.obj + ' at ' + t(U.ptTex(s.p[0], s.p[1])) + '.'; }, parts: [
      { id: '12a', level: 'EMG', make: function (r, s) {
        var x = s.p[0], y = s.p[1], R = rats(x, y);
        return U.numP('Sketch the situation and determine the distance from the ' + s.c.from + ' to the ' + s.c.thing + '.', R.k, { deg: false, after: 'm', cands: rCands(x, y).filter(function (c) { return c[0] > 0; }).map(function (c) { return [Math.round(c[0] * 1e6) / 1e6, c[1], c[2]]; }),
          sol: ptSketch(x, y, { rot: false }) + rSol(x, y) + ' m (' + (y > 0 ? 'north' : 'south') + (x > 0 ? 'east' : 'west') + ' of the ' + s.c.from + ', quadrant ' + quad(angOf(x, y)) + ').', hints: H_R, text: 'context: distance r' });
      } },
      { id: '12b', level: 'PRG', make: function (r, s) { var x = s.p[0], y = s.p[1]; return U.fieldsP('Determine the exact values of ' + t('\\sin\\theta') + ' and ' + t('\\cos\\theta') + ', where ' + t('\\theta') + ' is the rotation angle from east to the ' + s.c.thing + '.', [ratSpec('sin', x, y, false), ratSpec('cos', x, y, false)], { sol: ratSol('sin', x, y) + ', &nbsp;' + ratSol('cos', x, y), hints: H_RAT.concat(['Reduce the fractions.']), text: 'context: exact sin and cos' }); } },
      { id: '12c', level: 'MAS', make: function (r, s) { return thPart('Determine ' + t('\\theta') + ' to the nearest tenth of a degree.', s.p[0], s.p[1], { sketch: false, text: 'context: θ to the nearest tenth' }); } }] },
    { num: '13', parts: [
      { id: '13', level: 'PRG', make: function (r) {
        var fn = r.pick(['cos', 'sin']), p = pickWhere(function () { return radPt(r, 4, 1, 9, { kMax: 1 }); }, function (p) { return Math.abs(p[1] * p[1] - p[0] * p[0]) > 1 && !ex.simplest(Math.abs(p[1] * p[1] - p[0] * p[0]), 2) === false; });
        var x = p[0], y = p[1], R = rats(x, y), m = R.m, top = fn === 'cos' ? x : y, other = fn === 'cos' ? y : x, d = Math.abs(y * y - x * x);
        return U.mcP(r, '<i>(Multiple Choice)</i> The point ' + t(U.ptTex(x, y)) + ' is on the terminal arm of an angle ' + t('A') + '. The exact value of ' + t('\\' + fn + ' A') + ' is', [
          { html: t(U.xtex(R[fn])), right: true }, { html: t(U.xtex(R[fn === 'cos' ? 'sin' : 'cos'])), why: 'That is ' + t(fn === 'cos' ? '\\sin A=\\frac{y}{r}' : '\\cos A=\\frac{x}{r}') + '.' },
          { html: t(U.xtex(U.X([top, d], d))), why: 'Check ' + t('r') + ': ' + t('r=\\sqrt{x^2+y^2}') + ' — add the squares.' }, { html: t(U.xtex(U.X(fn === 'cos' ? [x, y] : [y, x], 1))), why: 'That is ' + t(fn === 'cos' ? '\\frac{x}{y}' : '\\frac{y}{x}') + ': the ratio needs ' + t('r') + ' in the denominator.' }],
          t('r=\\sqrt{' + (x * x) + '+' + (y * y) + '}=\\sqrt{' + m + '}') + ', so ' + t('\\' + fn + ' A=\\frac{' + top + '}{\\sqrt{' + m + '}}=' + U.xtex(R[fn])) + '.', H_RATR, 'MC: exact ratio');
      } }] },
    { num: '14', parts: [
      { id: '14', level: 'EMG', make: function (r) {
        var p = pickWhere(function () { var k = r.int(2, 9); return r.pick([[0, -k], [0, k], [-k, 0], [k, 0]]); }, function (p) { return okPt(p[0], p[1]); }), b = Math.round(angOf(p[0], p[1]));
        var vals = { sin: axVal('sin', b), cos: axVal('cos', b), tan: axVal('tan', b) }, all = [];
        ['sin', 'cos', 'tan'].forEach(function (fn) { (fn === 'tan' ? [0, 'u'] : [0, 1, -1]).forEach(function (v) { all.push({ fn: fn, v: v, html: v === 'u' ? t('\\tan\\theta') + ' is undefined' : t('\\' + fn + '\\theta=' + v), right: vals[fn] === v }); }); });
        var trues = all.filter(function (s) { return s.right; }), falses = r.shuffle(all.filter(function (s) { return !s.right; }));
        var tv = [vals.sin, vals.cos, vals.tan]; falses.sort(function (a, c) { return (tv.indexOf(c.v) >= 0) - (tv.indexOf(a.v) >= 0); });
        var tr = r.pick(trues), opts = [{ html: tr.html, right: true }].concat(falses.slice(0, 3).map(function (s) { return { html: s.html, why: 'At ' + t('\\theta=' + D(b)) + ': ' + (s.fn === 'tan' ? (vals.tan === 'u' ? t('x=0') + ', so ' + t('\\tan\\theta') + ' is undefined' : t('\\tan\\theta=0')) : t('\\' + s.fn + '\\theta=' + vals[s.fn])) + '.' }; }));
        return U.mcP(r, '<i>(Multiple Choice)</i> The point ' + t(U.ptTex(p[0], p[1])) + ' is on the terminal arm of ' + t('\\theta') + '. Which statement is true?', opts, 'The point is on ' + U.axisName(b) + ', so ' + t('\\theta=' + D(b)) + ', ' + t('r=' + Math.abs(p[0] + p[1])) + '. ' + axSol(b), ['Find ' + t('r') + ', then use ' + t('\\sin\\theta=\\frac{y}{r}') + ', ' + t('\\cos\\theta=\\frac{x}{r}') + ', ' + t('\\tan\\theta=\\frac{y}{x}') + '.'], 'MC: quadrantal ratios');
      } }] },
    { num: '15', parts: [
      { id: '15', level: 'PRG', make: function (r) {
        var pair = r.pick([['tan', 'cos'], ['sin', 'cos'], ['sin', 'tan'], ['cos', 'tan']]), q = r.pick([1, 2, 3, 4]), a = pickWhere(function () { return [r.int(2, 9), r.int(2, 9)]; }, function (z) { return z[0] !== z[1] && !(z[0] === 3 && z[1] === 5); });
        var sg = function (fn, k) { return SG[fn][k - 1] > 0; }, cond = function (fn) { return t('\\' + fn + '\\theta') + ' is ' + (sg(fn, q) ? 'positive' : 'negative'); };
        if (pair[0] === 'tan' && pair[1] === 'cos' && q === 3) q = r.pick([1, 2, 4]); // the booklet's own case
        var pts = [1, 2, 3, 4].map(function (k) { var s = sgnQ(k); return { k: k, x: s[0] * a[0], y: s[1] * a[1] }; });
        return U.mcP(r, '<i>(Multiple Choice)</i> For which point on the terminal arm is ' + cond(pair[0]) + ' and ' + cond(pair[1]) + '?', pts.map(function (p) {
          var bad = pair.filter(function (fn) { return sg(fn, p.k) !== sg(fn, q); });
          return p.k === q ? { html: t('(' + p.x + ',\\ ' + p.y + ')'), right: true } : { html: t('(' + p.x + ',\\ ' + p.y + ')'), why: 'For this point ' + bad.map(function (fn) { return t('\\' + fn + '\\theta') + ' is ' + (sg(fn, p.k) ? 'positive' : 'negative'); }).join(' and ') + '.' };
        }), cond(pair[0]).replace(' is ', ' ') + ' and ' + cond(pair[1]).replace(' is ', ' ') + ': quadrant ' + q + ', so ' + t('(' + pts[q - 1].x + ',\\ ' + pts[q - 1].y + ')') + '.', ['Use the signs: ' + t('\\sin') + ' follows ' + t('y') + ', ' + t('\\cos') + ' follows ' + t('x') + ', ' + t('\\tan=\\frac{y}{x}') + ' is positive when the signs match.'], 'MC: point from the signs of two ratios', true);
      } }] },
    { num: '16', parts: [
      { id: '16', level: 'PRG', make: function (r) {
        var p = pickWhere(function () { return r.chance(0.5) ? triPt(r, r.pick([2, 3, 4]), { list: TRIPLES.slice(0, 6), max: 40 }) : radPt(r, r.pick([2, 3, 4]), 2, 25); }, function (p) { var th = angOf(p[0], p[1]), f = th - Math.floor(th); return Math.abs(f - 0.5) > 0.06 && !(p[0] === -20 && p[1] === -21); });
        return thPart('<i>(Numerical Response)</i> The point ' + t(U.ptTex(p[0], p[1])) + ' is on the terminal arm of ' + t('\\theta') + ', ' + t('0^\\circ\\le\\theta<360^\\circ') + '. To the nearest degree, ' + t('\\theta=') + ' ______' + t('^\\circ') + '.', p[0], p[1], { dp: 0, nr: true, text: 'NR: θ to the nearest degree' });
      } }] },
    { num: '17', parts: [
      { id: '17', level: 'PRG', make: function (r) {
        var c = r.pick([{ fn: 'tan', q: 3 }, { fn: 'tan', q: 3 }, { fn: 'sin', q: 2 }, { fn: 'cos', q: 4 }]);
        var p = pickWhere(function () { return c.fn === 'tan' ? radPt(r, c.q, 2, 12) : triPt(r, c.q, { list: TRIPLES.slice(0, 5), k: [1, 3], max: 45 }); }, function (p) {
          var R = rats(p[0], p[1]), v = U.xval(R[c.fn]), f = v * 100 - Math.floor(v * 100); return v > 0 && v < 10 && Math.abs(f - 0.5) > 0.05 && !(p[0] === -8 && p[1] === -6); });
        var x = p[0], y = p[1], R = rats(x, y), v = U.xval(R[c.fn]);
        var alts = ratCands(c.fn, x, y).map(function (z) { return { v: Math.abs(z[0]), code: z[1], hint: z[2] }; });
        var pp = K.P.near('<i>(Numerical Response)</i> The point ' + t(U.ptTex(x, y)) + ' is on the terminal arm of ' + t('\\theta') + '. To the nearest hundredth, ' + t(FNT[c.fn] + '=') + ' ______.', v, 2, { nr: true, alts: alts },
          ratSol(c.fn, x, y) + (c.fn === 'tan' ? '' : ' (' + rSol(x, y) + ')') + t('\\approx ' + fx(v, 2)), H_RAT, 'NR: a ratio to the nearest hundredth');
        pp.bad = alts.filter(function (a) { return Math.abs(rd(a.v, 2) - rd(v, 2)) > 1e-9 && fx(a.v, 2).length <= 4; }).map(function (a) { return fx(a.v, 2); });
        return pp;
      } }] }
  ];
  /* Q5: a point on an axis — θ, then the three values */
  function quadPtPart(r, x, y) {
    var b = Math.round(angOf(x, y)), rr = Math.abs(x + y), sv = function (n) { return String(n).replace('.', '.'); };
    var specs = [{ label: t('\\theta'), name: 'θ', before: '=', ans: b, cands: [0, 90, 180, 270, 360].filter(function (v) { return v !== b; }).map(function (v) { return [v, LID + '-place', 'The point is on ' + U.axisName(b) + '.']; }) }];
    ['sin', 'cos', 'tan'].forEach(function (fn) {
      var v = axVal(fn, b), T = v === 'u' ? U.UNDEF : U.X(v, 1), cands = [];
      if (fn !== 'sin') cands.push([AXV[b].y, LID + '-swap', 'That is ' + t('\\sin\\theta=\\frac{y}{r}') + '.']);
      if (fn !== 'cos') cands.push([AXV[b].x, LID + '-swap', 'That is ' + t('\\cos\\theta=\\frac{x}{r}') + '.']);
      cands.push([fn === 'sin' ? y : fn === 'cos' ? x : NaN, LID + '-r', 'Divide by ' + t('r=' + sv(rr)) + ': ' + (fn === 'sin' ? t('\\sin\\theta=\\frac{y}{r}') : t('\\cos\\theta=\\frac{x}{r}')) + '.']);
      specs.push({ label: t(FNT[fn]), name: fn + ' θ', before: '=', math: true, after: '', check: U.exact(T, { cands: cands, undefHint: t('x=0') + ' here, so ' + t('\\tan\\theta=\\frac{y}{0}') + ' is undefined.' }), key: U.xtex(T), ansTex: U.xtex(T) });
    });
    var yT = String(y), xT = String(x);
    var sol = U.sketch({ pt: [x, y], ptLabel: '(' + x + ', ' + y + ')', rot: { to: b }, w: 190 }) + 'The point is on ' + U.axisName(b) + ', so ' + t('\\theta=' + D(b)) + ' and ' + t('r=' + sv(rr)) + '.<br>' +
      t('\\sin\\theta=\\frac{' + yT + '}{' + sv(rr) + '}=' + axVal('sin', b)) + ', &nbsp;' + t('\\cos\\theta=\\frac{' + xT + '}{' + sv(rr) + '}=' + axVal('cos', b)) + ', &nbsp;' + (x === 0 ? t('\\tan\\theta=\\frac{' + yT + '}{0}') + ' is undefined (' + t('x=0') + ')' : t('\\tan\\theta=\\frac{0}{' + xT + '}=0')) + '.';
    return U.fieldsP('The point ' + t(U.ptTex(x, y)) + '.', specs, { sol: sol, hints: ['Which axis is the point on? Then ' + t('r') + ' is the distance along that axis.', 'Dividing by 0 is undefined.'], text: 'quadrantal point: θ and the three ratios' });
  }

  var EXTRA = [
    { num: 'A1', section: 'A. Skills', stem: 'Determine the exact distance ' + t('r') + ' from the origin to each point.', parts: [
      { id: 'A1a', level: 'BEG', make: function (r) { var p = triPt(r, 2, { list: [[5, 12, 13], [3, 4, 5], [8, 15, 17]], k: [2, 3], max: 50 }); return rPart('The point ' + t(U.ptTex(p[0], p[1])) + '.', p[0], p[1]); } },
      { id: 'A1b', level: 'BEG', make: function (r) { var q = r.pick([2, 3, 4]), k = pickWhere(function () { return r.int(2, 9); }, function (v) { return okPt(sgnQ(q)[0] * v, sgnQ(q)[1] * v); }), x = sgnQ(q)[0] * k, y = sgnQ(q)[1] * k; return rPart('The point ' + t(U.ptTex(x, y)) + '.', x, y); } },
      { id: 'A1c', level: 'EMG', make: function (r) { var p = radPt(r, 3, 1, 9, { kMin: 2 }); return rPart('The point ' + t(U.ptTex(p[0], p[1])) + '.', p[0], p[1]); } },
      { id: 'A1d', level: 'LIM', make: function (r) { var p = pickWhere(function () { var k = r.int(1, 15); return r.pick([[k, 0], [0, -k], [-k, 0], [0, k]]); }, function (p) { return okPt(p[0], p[1]); }); return rPart('The point ' + t(U.ptTex(p[0], p[1])) + '.', p[0], p[1]); } }] },
    { num: 'A2', stem: 'Each point is on the terminal arm of ' + t('\\theta') + '. Determine the exact values of ' + t('\\sin\\theta') + ', ' + t('\\cos\\theta') + ' and ' + t('\\tan\\theta') + ' (rational denominators).', parts: [
      { id: 'A2a', level: 'EMG', make: function (r) { var p = triPt(r, 1, { list: TRIPLES.slice(1, 12) }); return ratiosPart('The point ' + t(U.ptTex(p[0], p[1])) + '.', p[0], p[1], { rat: true }); } },
      { id: 'A2b', level: 'PRG', make: function (r) { var p = triPt(r, 3, { list: [[8, 15, 17], [5, 12, 13], [3, 4, 5], [7, 24, 25]], k: [2, 3], max: 50 }); return ratiosPart('The point ' + t(U.ptTex(p[0], p[1])) + '.', p[0], p[1], { rat: true, text: 'three ratios (reduce)' }); } },
      { id: 'A2c', level: 'PRG', make: function (r) { var p = radPt(r, 4, 2, 10, { kMin: 2 }); return ratiosPart('The point ' + t(U.ptTex(p[0], p[1])) + '.', p[0], p[1], { rat: true }); } }] },
    { num: 'A3', stem: 'State each value. Write “undefined” where it applies.', parts: [
      { id: 'A3a', level: 'BEG', make: function (r) { var b = r.pick([90, 270]); return quadValPart(t('\\sin ' + D(b)), 'sin', b); } },
      { id: 'A3b', level: 'BEG', make: function (r) { var b = r.pick([0, 180, 360]); return quadValPart(t('\\cos ' + D(b)), 'cos', b); } },
      { id: 'A3c', level: 'BEG', make: function (r) { var b = r.pick([90, 270]); return quadValPart(t('\\tan ' + D(b)), 'tan', b); } },
      { id: 'A3d', level: 'BEG', make: function (r) { var b = r.pick([0, 180, 360]); return quadValPart(t('\\tan ' + D(b)), 'tan', b); } },
      { id: 'A3e', level: 'BEG', make: function (r) { var b = r.pick([90, 270]); return quadValPart(t('\\cos ' + D(b)), 'cos', b); } }] },
    { num: 'A4', stem: 'Each point is on the terminal arm of ' + t('\\theta') + ', ' + t('0^\\circ\\le\\theta<360^\\circ') + '. Determine ' + t('\\theta') + ' to the nearest tenth of a degree.', parts: [1, 2, 3, 4].map(function (q, i) {
      return { id: 'A4' + 'abcd'[i], level: q === 1 ? 'EMG' : 'PRG', make: function (r) { var p = radPt(r, q, 1, 10); return thPart('The point ' + t(U.ptTex(p[0], p[1])) + '.', p[0], p[1]); } };
    }) },
    { num: 'B1', section: 'B. Applying', stem: 'Write each ratio as the same ratio of its reference angle, with the correct sign.', parts: [['cos', 3, [200]], ['sin', 4, [305]], ['tan', 2, [135]], ['sin', 2, [170]]].map(function (z, i) {
      return { id: 'B1' + 'abcd'[i], level: 'PRG', make: function (r) { return refRatioMC(r, z[0], refAng(r, z[1], 5, 85, z[2])); } };
    }) },
    { num: 'B2', shared: function (r) { return { p: triPt(r, r.pick([2, 3, 4]), { list: [[8, 15, 17], [3, 4, 5], [5, 12, 13], [7, 24, 25]], k: [2, 3], max: 60, excl: ['30,-16'] }), what: r.pick([['A ship', 'port', 'ship'], ['A plane', 'airport', 'plane'], ['A weather balloon', 'launch site', 'balloon']]) }; },
      stem: function (s) { return s.what[0] + ' is at ' + t(U.ptTex(s.p[0], s.p[1])) + ' on a map grid with the ' + s.what[1] + ' at the origin, east along the positive ' + t('x') + '-axis and north along the positive ' + t('y') + '-axis (units: km).'; }, parts: [
      { id: 'B2a', level: 'EMG', make: function (r, s) { var x = s.p[0], y = s.p[1]; return U.numP('How far is the ' + s.what[2] + ' from the ' + s.what[1] + '?', rats(x, y).k, { deg: false, after: 'km', cands: rCands(x, y).filter(function (c) { return c[0] > 0; }), sol: rSol(x, y) + ' km', hints: H_R, text: 'context: distance' }); } },
      { id: 'B2b', level: 'PRG', make: function (r, s) { var x = s.p[0], y = s.p[1]; return U.fieldsP('Determine the exact values of ' + t('\\sin\\theta') + ' and ' + t('\\cos\\theta') + ', where ' + t('\\theta') + ' is the rotation angle from east to the ' + s.what[2] + '.', [ratSpec('sin', x, y, false), ratSpec('cos', x, y, false)], { sol: ratSol('sin', x, y) + ', &nbsp;' + ratSol('cos', x, y), hints: H_RAT, text: 'context: exact sin and cos' }); } },
      { id: 'B2c', level: 'ADV', make: function (r, s) { return thPart('Determine ' + t('\\theta') + ' to the nearest tenth of a degree.', s.p[0], s.p[1], { text: 'context: θ' }); } }] },
    { num: 'B3', parts: [
      { id: 'B3', level: 'EMG', make: function (r) {
        var q = r.pick([2, 3, 4]), s = sgnQ(q), p = pickWhere(function () { return [s[0] * r.int(1, 9), s[1] * r.int(1, 9)]; }, function (p) { return okPt(p[0], p[1]); }), x = p[0], y = p[1];
        var want = { sin: y > 0 ? 'p' : 'n', cos: x > 0 ? 'p' : 'n', tan: (x > 0) === (y > 0) ? 'p' : 'n' };
        return B.grid('Without calculating any values, state the sign of each ratio when ' + t(U.ptTex(x, y)) + ' is on the terminal arm.', [{ id: 'sin', html: t('\\sin\\theta') }, { id: 'cos', html: t('\\cos\\theta') }, { id: 'tan', html: t('\\tan\\theta') }], [{ id: 'p', html: 'positive' }, { id: 'n', html: 'negative' }], want,
          { why: function (row) { return { code: LID + '-sign', hint: SIGNH[row].replace(/^Check the sign: /, '') }; } },
          t('\\sin\\theta' + (want.sin === 'p' ? '>0' : '<0')) + ' (' + t(y > 0 ? 'y>0' : 'y<0') + '), &nbsp;' + t('\\cos\\theta' + (want.cos === 'p' ? '>0' : '<0')) + ' (' + t(x > 0 ? 'x>0' : 'x<0') + '), &nbsp;' + t('\\tan\\theta' + (want.tan === 'p' ? '>0' : '<0')) + ' (' + (want.tan === 'p' ? 'same signs' : 'opposite signs') + ').', [SIGNH.sin.replace(/^Check the sign: /, ''), SIGNH.cos.replace(/^Check the sign: /, ''), SIGNH.tan.replace(/^Check the sign: /, '')], 'signs of the three ratios');
      } }] },
    { num: 'B4', parts: [
      { id: 'B4', level: 'ADV', make: function (r) {
        var p = triPt(r, 3, { list: [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]], excl: ['-3,-4'] }), x = p[0], y = p[1], R = rats(x, y), fn = r.pick(['sin', 'cos']), top = fn === 'sin' ? y : x, c = R.k;
        return U.mcP(r, 'For the point ' + t(U.ptTex(x, y)) + ', a student wrote ' + t('r=-' + c) + ' and ' + t('\\' + fn + '\\theta=\\frac{' + top + '}{-' + c + '}=\\frac{' + (-top) + '}{' + c + '}') + '. Which explains the error and corrects it?', [
          { html: t('r') + ' is a distance, so ' + t('r=' + c) + ' (never ' + t('-' + c) + '); ' + t('\\' + fn + '\\theta=-\\frac{' + (-top) + '}{' + c + '}') + '.', right: true },
          { html: t('r=-' + c) + ' is right in quadrant 3, so ' + t('\\' + fn + '\\theta=\\frac{' + (-top) + '}{' + c + '}') + '.', why: t('r=\\sqrt{x^2+y^2}') + ' is never negative.' },
          { html: t('r=' + c) + ', and ' + t('\\' + fn + '\\theta=\\frac{' + (-top) + '}{' + c + '}') + '.', why: 'Right ' + t('r') + ', but keep the sign of ' + t(fn === 'sin' ? 'y' : 'x') + ': it is negative in quadrant 3.' },
          { html: t('r=-' + c) + ', and ' + t('\\' + fn + '\\theta=-\\frac{' + (-top) + '}{' + c + '}') + '.', why: 'The ratio is right, but ' + t('r') + ' is a distance: ' + t('r=' + c) + '.' }],
          t('r=\\sqrt{' + (x * x) + '+' + (y * y) + '}=' + c) + ', never ' + t('-' + c) + '. Then ' + t('\\' + fn + '\\theta=\\frac{' + top + '}{' + c + '}=-\\frac{' + (-top) + '}{' + c + '}') + ' (negative, as ' + t(fn === 'sin' ? 'y<0' : 'x<0') + ').', H_RAT, 'explain: r taken as negative');
      } }] },
    { num: 'B5', parts: [
      { id: 'B5', level: 'PRG', make: function (r) {
        var q = r.pick([2, 3, 4]), fn = r.pick(['sin', 'cos']), p = radPt(r, q, 2, 9, { kMin: 2 }), x = p[0], y = p[1], R = rats(x, y), T = R[fn], neg = U.X([-T.c[0], T.c[1]], T.m);
        var oth = R[fn === 'sin' ? 'cos' : 'sin'];
        var opts = [{ html: t(U.xtex(T)), right: true }, { html: t(U.xtex(neg)), why: SIGNH[fn] }, { html: t(U.xtex(oth)), why: 'That is ' + t(fn === 'sin' ? '\\cos\\theta=\\frac{x}{r}' : '\\sin\\theta=\\frac{y}{r}') + '.' }, { html: t(U.xtex(R.tan)), why: 'That is ' + t('\\tan\\theta=\\frac{y}{x}') + '.' }];
        return U.mcP(r, '<i>(Multiple Choice)</i> The point ' + t(U.ptTex(x, y)) + ' is on the terminal arm of ' + t('\\theta') + '. The exact value of ' + t(FNT[fn]) + ' is', opts, rSol(x, y) + ', ' + ratSol(fn, x, y) + '.', H_RATR, 'MC: exact ratio, r a mixed radical');
      } }] },
    { num: 'B6', parts: [
      { id: 'B6', level: 'EMG', make: function (r) {
        var q = r.pick([2, 3, 4]), k = pickWhere(function () { return r.int(2, 12); }, function (v) { return v !== 7 && okPt(sgnQ(q)[0] * v, sgnQ(q)[1] * v); }), x = sgnQ(q)[0] * k, y = sgnQ(q)[1] * k, ans = fromRef(45, q);
        return U.numP('<i>(Numerical Response)</i> The point ' + t(U.ptTex(x, y)) + ' is on the terminal arm of ' + t('\\theta') + ', ' + t('0^\\circ\\le\\theta<360^\\circ') + '. The value of ' + t('\\theta') + ' is ______' + t('^\\circ') + '.', ans, { nr: true,
          cands: [[45, LID + '-ref-only', 'That is the reference angle. The point is in quadrant ' + q + '.'], [-45, LID + '-raw', 'The calculator’s ' + t('\\tan^{-1}') + ' only gives angles from ' + t('-90^\\circ') + ' to ' + t('90^\\circ') + '.']].concat([2, 3, 4].filter(function (j) { return j !== q; }).map(function (j) { return [fromRef(45, j), LID + '-place', 'Check the quadrant of ' + t(U.ptTex(x, y)) + '.']; })),
          sol: ptSketch(x, y) + 'Quadrant ' + q + ', equal legs so ' + t('\\theta_R=45^\\circ') + '; ' + U.fromStep(45, q) + '.', hints: ['Equal legs: the reference triangle is isosceles, so ' + t('\\theta_R=45^\\circ') + '.'], text: 'NR: θ with equal legs' });
      } }] },
    { num: 'C1', section: 'C. Stretch', shared: function (r) {
        return pickWhere(function () { var c = r.pick([{ s: -1, k: 3 }, { s: -1, k: 4 }, { s: -1, k: -2 }, { s: -1, k: -3 }, { s: 1, k: -2 }, { s: 1, k: -3 }, { s: 1, k: -4 }, { s: -1, k: 2 }]); return c; }, function (c) { return !(c.s === -1 && c.k === 2); });
      },
      stem: function (c) { return 'The point ' + t('(a,\\ ' + (c.k === -1 ? '-' : c.k) + 'a)') + ', with ' + t(c.s < 0 ? 'a<0' : 'a>0') + ', is on the terminal arm of ' + t('\\theta') + '.'; }, parts: [
      { id: 'C1a', level: 'MAS', make: function (r, c) {
        var M = 1 + c.k * c.k, x = c.s, y = c.s * c.k, R = rats(x, y), ka = c.k + 'a';
        var sol = t('r=\\sqrt{a^2+' + (c.k * c.k) + 'a^2}=\\sqrt{' + M + 'a^2}=' + (c.s < 0 ? '-a' : 'a') + '\\sqrt{' + M + '}') + (c.s < 0 ? ' (since ' + t('a<0') + ', ' + t('\\sqrt{a^2}=-a') + ')' : '') + '.<br>' +
          t('\\sin\\theta=\\frac{' + ka + '}{' + (c.s < 0 ? '-a' : 'a') + '\\sqrt{' + M + '}}=' + U.xtex(R.sin)) + ', &nbsp;' + t('\\cos\\theta=\\frac{a}{' + (c.s < 0 ? '-a' : 'a') + '\\sqrt{' + M + '}}=' + U.xtex(R.cos)) + ', &nbsp;' + t('\\tan\\theta=\\frac{' + ka + '}{a}=' + c.k) + '.';
        return U.fieldsP('Determine the exact values of ' + t('\\sin\\theta') + ', ' + t('\\cos\\theta') + ' and ' + t('\\tan\\theta') + '.', ['sin', 'cos', 'tan'].map(function (fn) { return ratSpec(fn, x, y, false); }), { sol: sol, hints: ['Pick any value of ' + t('a') + ' with the right sign (e.g. ' + t('a=' + c.s) + ') to see the quadrant.', t('\\sqrt{a^2}=|a|') + ': if ' + t('a<0') + ', that is ' + t('-a') + '.'], text: 'ratios from (a, ka)' });
      } },
      { id: 'C1b', level: 'ADV', make: function (r, c) { return thPart('Determine ' + t('\\theta') + ' to the nearest tenth of a degree.', c.s, c.s * c.k, { sketch: false, text: 'θ from (a, ka)' }); } }] },
    { num: 'C2', shared: function (r) {
        return pickWhere(function () { var tr = r.pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10]]), sw = r.chance(0.5), q = r.pick([2, 3, 4]), un = r.pick(['x', 'y']), s = sgnQ(q), X = s[0] * (sw ? tr[1] : tr[0]), Y = s[1] * (sw ? tr[0] : tr[1]); return { x: X, y: Y, rr: tr[2], q: q, un: un }; },
          function (z) { return !(z.un === 'x' && z.y === 4 && z.rr === 5 && z.q === 2) && okPt(z.x, z.y); });
      },
      stem: function (z) { return 'The point ' + t(z.un === 'x' ? '(k,\\ ' + z.y + ')' : '(' + z.x + ',\\ k)') + ' is on the terminal arm of ' + t('\\theta') + ', where ' + t('r=' + z.rr) + ' and ' + t('\\theta') + ' terminates in quadrant ' + z.q + '.'; }, parts: [
      { id: 'C2a', level: 'ADV', make: function (r, z) {
        var k = z.un === 'x' ? z.x : z.y, kn = z.un === 'x' ? z.y : z.x;
        return U.numP('Determine ' + t('k') + '.', k, { deg: false, before: t('k='), cands: [[-k, LID + '-k-sign', t('k^2=' + (k * k)) + ' gives ' + t('k=\\pm ' + Math.abs(k)) + '. In quadrant ' + z.q + ', ' + t(z.un) + ' is ' + (k < 0 ? 'negative' : 'positive') + '.'], [z.rr - Math.abs(kn), LID + '-k-sub', 'Use ' + t('x^2+y^2=r^2') + ': ' + t('k^2+' + (kn * kn) + '=' + (z.rr * z.rr)) + '.'], [-(z.rr - Math.abs(kn)), LID + '-k-sub', 'Use ' + t('x^2+y^2=r^2') + '.']],
          sol: t('k^2+' + sq(kn) + '=' + z.rr + '^2\\Rightarrow k^2=' + (z.rr * z.rr) + '-' + (kn * kn) + '=' + (k * k) + '\\Rightarrow k=\\pm ' + Math.abs(k)) + '; in quadrant ' + z.q + ', ' + t(z.un + (k < 0 ? '<0' : '>0')) + ', so ' + t('k=' + k) + '.', hints: ['Use ' + t('x^2+y^2=r^2') + ' and solve for ' + t('k') + '.', 'Two square roots: the quadrant decides the sign.'], text: 'missing coordinate from r and quadrant' });
      } },
      { id: 'C2b', level: 'ADV', make: function (r, z) { return U.fieldsP('Determine the exact values of the three ratios.', ['sin', 'cos', 'tan'].map(function (fn) { return ratSpec(fn, z.x, z.y, false); }), { sol: 'With ' + t('(' + z.x + ',\\ ' + z.y + ')') + ' and ' + t('r=' + z.rr) + ': ' + ['sin', 'cos', 'tan'].map(function (fn) { return ratSol(fn, z.x, z.y); }).join(', &nbsp;'), hints: H_RAT, text: 'ratios once k is known' }); } },
      { id: 'C2c', level: 'ADV', make: function (r, z) { return thPart('Determine ' + t('\\theta') + ' to the nearest tenth of a degree.', z.x, z.y, { text: 'θ once k is known' }); } }] },
    { num: 'C3', shared: function (r) { return { p: triPt(r, r.pick([2, 3, 4]), { list: TRIPLES.slice(1, 9), excl: ['-20,21'] }) }; }, parts: [
      { id: 'C3a', level: 'ADV', make: function (r) {
        return U.mcP(r, 'Use ' + t('x^2+y^2=r^2') + ' to show that ' + t('(\\sin\\theta)^2+(\\cos\\theta)^2=1') + ' for every angle ' + t('\\theta') + '. Which argument is correct?', [
          { html: t('(\\sin\\theta)^2+(\\cos\\theta)^2=\\frac{y^2}{r^2}+\\frac{x^2}{r^2}=\\frac{x^2+y^2}{r^2}=\\frac{r^2}{r^2}=1'), right: true },
          { html: t('(\\sin\\theta)^2+(\\cos\\theta)^2=\\frac{y}{r}+\\frac{x}{r}=\\frac{x+y}{r}=1'), why: 'The ratios are squared, and ' + t('x+y') + ' is not ' + t('r') + '.' },
          { html: 'Check one angle: ' + t('(\\sin 30^\\circ)^2+(\\cos 30^\\circ)^2=1') + ', so it is always true.', why: 'One example doesn’t show it for <b>every</b> angle. Write the ratios with ' + t('x') + ', ' + t('y') + ' and ' + t('r') + '.' },
          { html: t('\\frac{y^2}{x^2}+\\frac{x^2}{r^2}=\\frac{r^2}{r^2}=1'), why: t('\\sin\\theta=\\frac{y}{r}') + ', not ' + t('\\frac{y}{x}') + '.' }],
          t('(\\sin\\theta)^2+(\\cos\\theta)^2=\\frac{y^2}{r^2}+\\frac{x^2}{r^2}=\\frac{x^2+y^2}{r^2}=\\frac{r^2}{r^2}=1') + '.', ['Write ' + t('\\sin\\theta') + ' and ' + t('\\cos\\theta') + ' with ' + t('x') + ', ' + t('y') + ' and ' + t('r') + ', square them and add.'], 'show: sin² + cos² = 1');
      } },
      { id: 'C3b', level: 'PRG', make: function (r, s) {
        var x = s.p[0], y = s.p[1], R = rats(x, y);
        return U.fieldsP('Check it with the point ' + t(U.ptTex(x, y)) + ': state ' + t('\\sin\\theta') + ' and ' + t('\\cos\\theta') + '.', [ratSpec('sin', x, y, false), ratSpec('cos', x, y, false)],
          { sol: t('r=' + R.k) + '; ' + t('\\left(' + U.xtex(R.sin) + '\\right)^2+\\left(' + U.xtex(R.cos) + '\\right)^2=\\frac{' + (y * y) + '+' + (x * x) + '}{' + R.N + '}=1') + ' ✓', hints: H_RAT, text: 'check sin² + cos² = 1 with a point' });
      } }] }
  ];

  HW.defineLesson({ id: 'u3l2', unit: 3, num: 2, title: 'Trigonometric Ratios from a Point on the Terminal Arm', outcome: 'T2', questions: QUESTIONS, extra: EXTRA });
})(window);
