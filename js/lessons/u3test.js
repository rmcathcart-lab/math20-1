/* Math 20-1 · Unit 3 Test (T1, T2, T3) — Trigonometry. Also holds the Unit 3 assessment kit HW.u3tkit (answer checkers,
 * figures and question builders) that js/exits/u3.js uses for the exit slips, so load this file before it.
 * Written in test mode from Ryan's Math 20-1 booklet (m201book/unit3/u3_l01–u3_l09.tex and u3_ep01–u3_ep09.tex; Lesson 9's
 * assignment and EP09 are the practice tests that set the style and difficulty). There is no older test for this course.
 * One 75-minute class, calculator allowed (Degree mode) throughout; the exact-value parts ask for exact answers ("exact
 * value" / "exactly"), which a calculator's decimals don't give. Outcomes as the booklet's lessons use them: T1 (angles in
 * standard position: L1 and the exact angle work of L4), T2 (the ratios from 0° to 360°: L2, L3 and the exact values of
 * L4), T3 (the sine law, the cosine law and the ambiguous case: L5–L8).
 * 19 questions / 27 parts (~76 min by tests/short_report.js): Beginning 6 questions / 10 parts (T1 2, T2 5, T3 3),
 * Progressing 8 / 12 (T1 2, T2 5, T3 5), Mastery 5 / 5 (T1 1, T2 2, T3 2).
 * Every part is a generator (new numbers for each student; the booklet's own numbers are avoided where they could come
 * up), with the key built from the generated values, a worked solution in the booklet's method, hints, and `bad`
 * answers with u3t- codes (labels and partial-credit decisions in the kit below).
 *
 * How each box is pitched:
 *   Beginning  — each lesson's core skill as first taught: the reference angle of an angle and the angle from its
 *                reference angle and quadrant (L1); r and one exact ratio from a point (L2); the other angle with the
 *                same sine / cosine / tangent (L3); two exact values, one possibly quadrantal or undefined (L4); a side by
 *                the sine law with a full pair given and a side by the cosine law (SAS), on figures drawn to scale
 *                (L5, L6); the number of triangles from SSA information (L7).
 *   Progressing — the typical assignment question: the three other angles with the same reference angle (L1) and an
 *                exact angle from a point with radical coordinates (L4); the exact sin, cos and tan of a point in
 *                Quadrants II–IV and θ to the tenth (L2); the other two exact ratios from one ratio and a sign condition
 *                (L3); a·trig θ + b = c to the tenth (possibly in a smaller interval or with no solution) and an
 *                equation solved exactly (L3, L4); one-triangle SSA: an angle by the sine law, then the third side (L5);
 *                the largest angle from three sides, often obtuse (L6); every possible angle in an SSA case (L7); the
 *                distance after two legs on bearings (L8).
 *   Mastery    — the hardest assignment / extra-practice items: two angles with the same reference angle from their sum
 *                or difference (L1 EP C2); (k, y) with a given r and quadrant: k and θ (L2 EP C2); a squared equation
 *                solved exactly, four solutions (L4 #8); both triangles of an ambiguous case: the two lengths of the
 *                third side (L7 #8, L9 #13); a quadrilateral split by a diagonal (cosine law, then sine law) (L8 #8, L9 #15).
 * Cut from the first draft (Ryan, too long): the clockwise rotation and the same-reference-angle MC (L1), the reflected
 * point, the quadrant-from-signs MC, the solve-to-the-tenth part (kept as a·trig θ + b = c), the exact expression, the
 * area ½ab sin C, a second "how many triangles", the rotation between two points, the radical given ratio and the two
 * angles of elevation. Their builders stay in the kit (the exit slips use most of them).
 * Coverage: L1 Q1, Q7a, Q15 · L2 Q2, Q8, Q16 · L3 Q3, Q9, Q10a · L4 Q4, Q7b, Q10b, Q17 · L5 Q5a, Q11 · L6 Q5b, Q12, Q19 ·
 *           L7 Q6, Q13, Q18 · L8 Q14, Q19 · L9 (review) the test is written in its style (Q1, Q4, Q8, Q10, Q11, Q14 and
 *           Q19 follow its practice-test items).
 * Short version (def.short): about half the working time, every outcome keeps its Beginning / Progressing / Mastery boxes
 * (see the defineTest call; checked with node tests/short_report.js).
 * Answers: angles in degrees (the ° is optional); "all solutions" as a list of angles in any order, or "no solution";
 * exact values as fractions with radicals and a rational denominator (a decimal, an unsimplified radical, a radical in
 * the denominator or an unreduced fraction is "right value, wrong form", 2/3), or "undefined"; rounded answers to the
 * place the question names (sides to the tenth, angles to the degree unless it says otherwise), with an answer built on
 * an intermediate value rounded to the answer's own place also accepted; the number of triangles as 0, 1 or 2. Several
 * boxes in one part: one wrong box (the rest right) keeps 2/3 unless its mistake is a bigger one.
 * Conversions to online: "sketch" → the sketch is in the worked solution; "explain / identify the error" → the corrected
 * answer; "solve the triangle" → the asked measures; "both triangles" → the two values as a list. */
(function (root) {
  'use strict';
  var HW = root.HW, ex = HW.ex, K = HW.kit, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, F = HW.fmt;

  /* =====================================================================================================
   * The kit: HW.u3tkit (shared with js/exits/u3.js)
   * ===================================================================================================== */
  var S = HW.u3tkit = {};

  /* ---- wrong-answer codes, registered for the test (u3t-) and the exit slips (u3x-); value = [label, partial] ---- */
  var CODE = {
    'ref-yaxis': ['Reference angle measured to the y-axis', 'b'], 'ref-formula': ['Reference angle: used the rule for another quadrant', 'b'],
    'ref-theta': ['Gave the angle itself as the reference angle', 'n'], 'place': ['Placed the reference angle in the wrong quadrant', 'b'],
    'place-ref': ['Gave the reference angle instead of the rotation angle', 'n'], 'cot-sign': ['Clockwise rotation: dropped the minus sign', 'n'],
    'cot-turn': ['More than one turn: did not subtract 360°', 'n'], 'same-incl': ['Listed the given angle among the other three', 's'],
    'refl-axis': ['Reflection: used the angle for another reflection', 'b'], 'ab-swap': ['A and B swapped', 's'], 'ab-x': ['Gave the reference angle instead of the angle', 'b'],
    'ab-one': ['One of A and B wrong', 's'], 'ex-ang-ref': ['Exact angle: 30° and 60° mixed up', 'b'], 'rot-dir': ['Rotation measured the other way round', 'b'],
    'rot-one': ['Gave one point’s angle, not the rotation', 'n'],
    'r-noroot': ['r: forgot the square root (gave r²)', 'b'], 'r-sum': ['r: added the coordinates', 'n'], 'r-sub': ['r: subtracted the squares', 'n'],
    'xy': ['Mixed up x and y (sin = y/r, cos = x/r)', 'b'], 'tan-flip': ['tan written as x/y', 'b'], 'sign': ['Wrong sign (CAST)', 'b'], 'r-ratio': ['Used r in a tangent / a coordinate in place of r', 'n'],
    'theta-raw': ['Gave the calculator angle tan⁻¹(y/x) without placing it', 'b'], 'theta-ref': ['Gave the reference angle instead of θ', 'b'],
    'theta-quad': ['θ placed in the wrong quadrant', 'b'], 'radian': ['Calculator in radian mode', 's'],
    'undef-zero': ['Said 0 for an undefined ratio', 'b'], 'undef': ['Missed that the ratio is undefined', 'b'], 'not-undef': ['Said “undefined” for a ratio with a value', 'n'],
    'missing': ['Missed a solution', 'b'], 'quad': ['Solutions in the wrong quadrants (CAST)', 'b'], 'refsol': ['Gave the reference angle as a solution', 'b'],
    'range': ['Angle outside 0°–360° (negative calculator angle)', 'b'], 'interval': ['Kept a solution outside the interval', 's'], 'said-none': ['Said “no solution” when there are solutions', 'n'],
    'none': ['Gave solutions when there is no solution', 'n'], 'isolate': ['Sign slip isolating the ratio', 's'], 'nodiv': ['Did not divide by the coefficient', 'b'],
    'sq-pm': ['Squared equation: took only the positive root (two solutions, not four)', 'b'], 'ex-ref': ['Exact value of the wrong special angle (30° and 60° mixed up)', 'b'],
    'other-same': ['Gave the given angle, not the other one', 'n'], 'other-quad': ['The other angle in the wrong quadrant', 'b'],
    'k-sign': ['Coordinate with the wrong sign for the quadrant', 's'], 'sum-same': ['Used the given angles instead of the other ones', 'n'],
    'pair': ['Sine law: side and angle that are not opposite each other', 'b'], 'flip': ['Sine law: proportion upside down', 'b'],
    'third': ['Did not find the third angle first (used a given angle)', 'b'], 'supp': ['Gave the supplement of the angle', 'b'],
    'cos-noroot': ['Cosine law: forgot the square root', 'b'], 'cos-order': ['Cosine law: subtracted 2bc before multiplying by cos', 'b'], 'cos-plus': ['Cosine law: added the 2bc cos A term', 'b'],
    'cos-abs': ['Cosine law: dropped the negative cosine (acute instead of obtuse)', 'b'], 'cos-opp': ['Cosine law: found the angle opposite another side', 'b'],
    'amb-count': ['Wrong number of triangles', 'n'], 'amb-one': ['Ambiguous case: gave only one triangle', 'b'], 'amb-extra': ['Ambiguous case: kept an angle that does not fit', 'b'],
    'area-half': ['Area: forgot the ½', 'b'], 'area-cos': ['Area: used cos instead of sin', 'n'], 'bear-angle': ['Bearings: wrong angle in the triangle', 'b'],
    'bear-back': ['Gave the bearing from the start, not the return bearing', 'b'], 'hike-time': ['Used the speeds, not the distances', 'b'],
    'elev-hyp': ['Gave the slant distance instead of the height', 'b'], 'elev-angle': ['Two angles of elevation: wrong angle in the oblique triangle', 'b'],
    'quad-diag': ['Quadrilateral: wrong side or angle in the second triangle', 'b'], 'h-bound': ['Ambiguous case: wrong bound (h = b sin A, b)', 'b'],
    'one-box': ['One box wrong (the rest right)', 's'], 'para-same': ['Parallelogram: used the same angle for both diagonals', 'b'], 'circ-central': ['Gave the central angle, not the inscribed angle', 'b'],
    'clock-angle': ['Clock: wrong angle between the hands', 'b'], 'ab-pair': ['Ambiguous case: only one of the two lengths right', 'b']
  };
  ['u3t-', 'u3x-'].forEach(function (pre) {
    var c = {}, pr = {}; Object.keys(CODE).forEach(function (k) { c[pre + k] = CODE[k][0]; pr[pre + k] = CODE[k][1]; });
    HW.addCodes(c); HW.addPartial(pr);
  });
  // "right value, wrong form" results (2/3 in test mode) and input problems (no credit): labels for the dashboard
  HW.addCodes({ 'u3k-rationalize': 'Radical left in the denominator', 'u3k-dec-exact': 'Exact value written as a decimal', 'u3k-rad-frac': 'Fraction left under a radical',
    'u3k-ang-unreadable': 'Angles not written as a list', 'u3k-dup': 'Listed an angle twice', 'u3k-round': 'Not rounded as asked' });

  /* ---------------- numbers, angles, LaTeX ---------------- */
  var RAD = Math.PI / 180;
  function sinD(d) { return Math.sin(d * RAD); } function cosD(d) { return Math.cos(d * RAD); } function tanD(d) { return Math.tan(d * RAD); }
  function asinD(v) { return Math.asin(v) / RAD; } function acosD(v) { return Math.acos(v) / RAD; } function atanD(v) { return Math.atan(v) / RAD; }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var c = a % b; a = b; b = c; } return a; }
  function rd(x, dp) { return K.roundTo(x, dp); }
  function fx(x, dp) { return rd(x, dp).toFixed(Math.max(0, dp)); }
  function find(gen, test, tag) { for (var i = 0; i < 6000; i++) { var v = gen(); if (v != null && test(v)) return v; } throw new Error('u3 kit: no valid numbers' + (tag ? ' (' + tag + ')' : '')); }
  function safe(x, dp, m) { var s = Math.abs(x) * Math.pow(10, dp), f = s - Math.floor(s); return Math.abs(f - 0.5) > (m == null ? 0.08 : m); }
  function range(a, b) { var o = []; for (var i = a; i <= b; i++) o.push(i); return o; }
  function sq(x) { return x * x; }
  function isSq(n) { var s = Math.round(Math.sqrt(n)); return s * s === n; }
  function dg(x) { return x + '^\\circ'; }
  function dgs(x) { return x + '°'; }
  function norm(a) { a = a % 360; if (a < 0) a += 360; return a; }
  function quad(a) { a = norm(a); if (Math.abs(a % 90) < 1e-9) return 0; return Math.floor(a / 90) + 1; }
  function refOf(a) { a = norm(a); var q = quad(a); return q === 1 ? a : q === 2 ? 180 - a : q === 3 ? a - 180 : q === 4 ? 360 - a : (a === 90 || a === 270 ? 90 : 0); }
  function place(rf, q) { return q === 1 ? rf : q === 2 ? 180 - rf : q === 3 ? 180 + rf : 360 - rf; }
  var ROM = ['', 'I', 'II', 'III', 'IV'];
  var SG = { sin: [0, 1, 1, -1, -1], cos: [0, 1, -1, -1, 1], tan: [0, 1, -1, 1, -1] };
  function sgn(fn, q) { return SG[fn][q]; }
  function quadsFor(fn, s) { return [1, 2, 3, 4].filter(function (q) { return SG[fn][q] === s; }); }
  function quadsTex(qs) { return qs.map(function (q) { return ROM[q]; }).join(qs.length === 2 ? ' and ' : ', '); }
  function castWhy(q) { return ['', 'all three ratios are positive (A)', 'only sin is positive (S)', 'only tan is positive (T)', 'only cos is positive (C)'][q]; }
  function refRule(q) { return q === 1 ? '\\theta_R=\\theta' : q === 2 ? '\\theta_R=180^\\circ-\\theta' : q === 3 ? '\\theta_R=\\theta-180^\\circ' : '\\theta_R=360^\\circ-\\theta'; }
  function refTex(a) { var q = quad(a), r = refOf(a); if (q === 1) return '\\theta_R=' + dg(a); return '\\theta_R=' + (q === 2 ? dg(180) + '-' + dg(a) : q === 3 ? dg(a) + '-' + dg(180) : dg(360) + '-' + dg(a)) + '=' + dg(r); }
  function placeTex(q, rs) { return q === 1 ? dg(rs) : q === 2 ? dg(180) + '-' + dg(rs) : q === 3 ? dg(180) + '+' + dg(rs) : dg(360) + '-' + dg(rs); }
  function placeRule(q) { return q === 1 ? '\\theta_R' : q === 2 ? '180^\\circ-\\theta_R' : q === 3 ? '180^\\circ+\\theta_R' : '360^\\circ-\\theta_R'; }
  function between(q) { return ['', t('0^\\circ<\\theta<90^\\circ'), t('90^\\circ<\\theta<180^\\circ'), t('180^\\circ<\\theta<270^\\circ'), t('270^\\circ<\\theta<360^\\circ')][q]; }
  /* a random reference angle (not 30°, 45°, 60°) and an angle in a quadrant */
  function randRef(r, lo, hi) { return find(function () { return r.int(lo || 4, hi || 86); }, function (x) { return [30, 45, 60].indexOf(x) < 0; }); }
  function angleIn(r, q, avoid) { return find(function () { return place(randRef(r), q); }, function (a) { return (avoid || []).indexOf(a) < 0; }); }
  // booklet values (lesson examples, assignment, extra practice) left out of the angle pools
  var AVOID_ANG = [160, 245, 335, 205, 118, 289, 47, 215, 128, 341, 251, 140, 285, 25, 236, 302, 99, 64, 165, 344, 101, 258, 12, 189, 271, 158, 147, 316, 203, 72, 119, 227, 112, 199, 89, 301, 91, 179, 152, 212, 299, 76, 263, 98, 264, 349, 132, 214, 297, 168, 302, 117, 233, 161, 52, 230, 314];
  S.sinD = sinD; S.cosD = cosD; S.tanD = tanD; S.asinD = asinD; S.acosD = acosD; S.atanD = atanD; S.rd = rd; S.fx = fx; S.find = find; S.safe = safe; S.range = range;
  S.dg = dg; S.norm = norm; S.quad = quad; S.refOf = refOf; S.place = place; S.ROM = ROM; S.quadsFor = quadsFor; S.sgn = sgn;

  /* ---------------- exact values p√m/q ---------------- */
  function spec(p, q, m) {
    q = q == null ? 1 : q; m = m == null ? 1 : m;
    if (p === 0 || m === 0) return { p: 0, q: 1, m: 1 };
    var f = ex.nthFactor(m, 2); if (f > 1) { p *= f; m /= f * f; }
    if (q < 0) { p = -p; q = -q; }
    var g = gcd(p, q) || 1; return { p: p / g, q: q / g, m: m };
  }
  function sval(s) { return s === 'undef' ? NaN : s.p * Math.sqrt(s.m) / s.q; }
  function stex(s) {
    if (s === 'undef') return '\\text{undefined}';
    if (s.p === 0) return '0';
    var neg = s.p < 0, p = Math.abs(s.p), rad = s.m > 1 ? '\\sqrt{' + s.m + '}' : '', top = (p === 1 && rad ? '' : String(p)) + rad;
    return (neg ? '-' : '') + (s.q === 1 ? top : '\\frac{' + top + '}{' + s.q + '}');
  }
  function sneg(s) { return s === 'undef' ? s : { p: -s.p, q: s.q, m: s.m }; }
  function smul(a, b) { return spec(a.p * b.p, a.q * b.q * 1, a.m * b.m); }
  function sadd(a, b) { if (a.p === 0) return b; if (b.p === 0) return a; if (a.m !== b.m) return null; return spec(a.p * b.q + b.p * a.q, a.q * b.q, a.m); }
  function ssq(a) { return spec(a.p * a.p * a.m, a.q * a.q, 1); }
  function sdiv(a, b) { // (pa√ma/qa) / (pb√mb/qb) = pa qb √(ma mb) / (qa pb mb)
    return spec(a.p * b.q, a.q * b.p * b.m, a.m * b.m);
  }
  var BASE = { sin: { 30: [1, 2, 1], 45: [1, 2, 2], 60: [1, 2, 3] }, cos: { 30: [1, 2, 3], 45: [1, 2, 2], 60: [1, 2, 1] }, tan: { 30: [1, 3, 3], 45: [1, 1, 1], 60: [1, 1, 3] } };
  function exact(fn, a) {
    a = norm(a);
    if (a % 90 === 0) { var Pt = { 0: [1, 0], 90: [0, 1], 180: [-1, 0], 270: [0, -1] }[a]; if (fn === 'sin') return spec(Pt[1]); if (fn === 'cos') return spec(Pt[0]); return Pt[0] === 0 ? 'undef' : spec(Pt[1] / Pt[0]); }
    var b = BASE[fn][refOf(a)]; if (!b) throw new Error('u3 kit: no exact value for ' + fn + ' ' + a);
    return spec(sgn(fn, quad(a)) * b[0], b[1], b[2]);
  }
  /* a coordinate c√m (sign in c) */
  function qty(c, m) { return { c: c, m: m || 1 }; }
  function qroot(N, s) { var f = ex.nthFactor(N, 2); return { c: (s < 0 ? -1 : 1) * f, m: N / (f * f) }; }
  function qsq(a) { return a.c * a.c * a.m; }
  function qtex(a) { if (a.m === 1) return String(a.c); var c = Math.abs(a.c); return (a.c < 0 ? '-' : '') + (c === 1 ? '' : c) + '\\sqrt{' + a.m + '}'; }
  function qplain(a) { if (a.m === 1) return String(a.c).replace('-', '−'); var c = Math.abs(a.c); return (a.c < 0 ? '−' : '') + (c === 1 ? '' : c) + '√' + a.m; }
  function qval(a) { return a.c * Math.sqrt(a.m); }
  function qratio(u, v) { return spec(u.c, v.c * v.m, u.m * v.m); } // (cu√mu)/(cv√mv)
  function rawFrac(u, v) { return '\\frac{' + qtex(u) + '}{' + qtex(v) + '}'; }
  S.spec = spec; S.sval = sval; S.stex = stex; S.exact = exact; S.qty = qty; S.qroot = qroot; S.qtex = qtex; S.qratio = qratio;

  /* ---------------- reading answers ---------------- */
  function plainOf(resp) {
    return String(resp == null ? '' : resp).replace(/\\left|\\right/g, '').replace(/\\(?:text|mathrm|textrm|operatorname)\{([^{}]*)\}/g, ' $1 ')
      .replace(/\\[,;:! ]|\\quad|\\qquad|~/g, ' ').replace(/\s+/g, ' ').trim();
  }
  var UNDEF = /^(undefined|undef|und|not ?defined|does ?not ?exist|dne)$/i;
  function isUndef(resp) { return UNDEF.test(plainOf(resp).replace(/[.\s]+$/, '').trim()); }
  /* a number typed with ° or "θ =" in front: the number (or null) */
  function degNum(resp) {
    var s = plainOf(resp).replace(/−|–/g, '-').replace(/^\s*(\\theta(_\{?R\}?)?|θ_?R?|[A-Za-z](_\{?\w\}?)?|\\angle\s*[A-Za-z]+)\s*(=|\\approx|≈)\s*/, '').replace(/\^\{?\s*\\circ\s*\}?|\\circ|\\degree|°|\s*degrees?\s*$/g, '').replace(/\^\{\s*\}/g, '').trim();
    var p = HW.parse.number(s); return p.ok ? p.value : null;
  }
  /* a list of numbers (angles in degrees, or lengths): { vals, decs } | { none } | { empty } | { bad } */
  function readList(resp, unitRe) {
    var s = plainOf(resp).replace(/\{,\}/g, ',').replace(/−|–/g, '-');
    var low = s.toLowerCase().replace(/\\/g, '');
    if (!s) return { empty: true };
    if (/no ?solutions?|none|varnothing|emptyset|∅|no ?triangles?/.test(low) && !/\d/.test(low)) return { none: true };
    if (/^\s*\\?\{\s*\\?\}\s*$/.test(s)) return { none: true };
    s = s.replace(/\^\{?\s*\\circ\s*\}?|\\circ|\\degree|°|\^\{\s*\}/g, ' ').replace(/\\theta|θ|\\angle|∠|\b[A-Za-z]_?\{?\d?\}?\s*(=|\\approx|≈)|=|\\approx|≈/g, ' ')
      .replace(/\\\{|\\\}|[{}]/g, ' ').replace(/\bor\b|\band\b|&|\\lor/gi, ',').replace(/-\s+/g, '-').replace(/\s*\.\s*(?=\d)/g, '.');
    if (unitRe) s = s.replace(unitRe, ' ');
    var bits = s.split(/[,;\s]+/).filter(Boolean), vals = [], decs = [];
    if (!bits.length) return { empty: true };
    for (var i = 0; i < bits.length; i++) {
      if (!/^-?(\d+(\.\d*)?|\.\d+)$/.test(bits[i])) return { bad: true };
      vals.push(Number(bits[i])); decs.push((bits[i].split('.')[1] || '').length);
    }
    return { vals: vals, decs: decs };
  }
  S.plainOf = plainOf; S.isUndef = isUndef; S.degNum = degNum; S.readList = readList;

  /* ---------------- checkers ---------------- */
  /* an exact value. want: spec | number | 'undef'. opt: { rational (default true), alts: [{ v (number|'undef'), code, hint }], signCode, signHint, decOk } */
  function walk(a, f) { if (!a || typeof a !== 'object') return; f(a); ['a', 'b', 'n'].forEach(function (k) { if (a[k] && typeof a[k] === 'object') walk(a[k], f); }); }
  function hasRoot(a) { var h = false; walk(a, function (x) { if (x.t === 'root') h = true; }); return h; }
  function rootInDen(a) { var h = false; walk(a, function (x) { if (x.t === 'div' && hasRoot(x.b)) h = true; }); return h; }
  function notSimplest(a) { var h = null; walk(a, function (x) { if (x.t === 'root') { var r = ex.rat(x.a); if (r && r[1] !== 1) h = 'frac'; else if (r && r[0] > 0 && ex.nthFactor(r[0], 2) > 1) h = r[0]; } }); return h; }
  function unreduced(a) {
    var h = false;
    walk(a, function (x) { if (x.t !== 'div') return; var num = ex.radical(x.a), den = ex.rat(x.b); if (num && den && den[1] === 1 && num.k[1] === 1 && Math.abs(den[0]) > 1 && gcd(num.k[0], den[0]) > 1) h = true; if (num && den && den[1] === 1 && Math.abs(den[0]) === 1) h = true; });
    return h;
  }
  function exactChk(want, cp, opt) {
    opt = opt || {};
    var rational = opt.rational !== false, W = want === 'undef' ? NaN : typeof want === 'number' ? want : sval(want), wm = want && want.m > 1;
    var alts = (opt.alts || []).filter(function (a) { return a && (a.v === 'undef' || (isFinite(a.v) && !(isFinite(W) && Math.abs(a.v - W) < 1e-9))); });
    return function (resp) {
      var und = isUndef(resp);
      if (want === 'undef') {
        if (und) return ok();
        var a0 = K.read(resp); if (a0.res) return a0.res;
        if (Math.abs(a0.val) < 1e-12) return wrong(cp + 'undef-zero', t('\\tan\\theta=\\frac{y}{x}') + ', and ' + t('x=0') + ' here: dividing by zero is <b>undefined</b>. (A ratio is ' + t('0') + ' when its numerator is ' + t('0') + '.)');
        return wrong(cp + 'undef', 'The terminal arm is on the ' + t('y') + '-axis, so ' + t('x=0') + ' and ' + t('\\tan\\theta=\\frac{y}{x}') + ' divides by zero: it is <b>undefined</b>.');
      }
      if (und) {
        for (var j = 0; j < alts.length; j++) if (alts[j].v === 'undef') return wrong(alts[j].code, alts[j].hint);
        return wrong(cp + 'not-undef', W === 0 ? 'The ratio is ' + t('0') + ' here (its numerator is ' + t('0') + '). A ratio is undefined only when it divides by ' + t('0') + '.' : 'This ratio has a value: it is undefined only when it divides by ' + t('0') + ' (' + t('\\tan\\theta') + ' with ' + t('x=0') + ').');
      }
      var a = K.read(resp); if (a.res) return a.res;
      var sh = ex.shape(a.ast);
      if (Object.keys(sh.vars).length) return form('var', 'Give a number (fractions and radicals), with no letters.');
      if (!isFinite(a.val)) return wrong('value', null);
      if (Math.abs(a.val - W) < 1e-9 * Math.max(1, Math.abs(W))) {
        if (sh.decimals && !opt.decOk) return form('u3k-dec-exact', 'Right value — now write it exactly, as a fraction' + (hasRoot(a.ast) || wm ? ' with radicals' : '') + ' (no decimals).');
        var ns = notSimplest(a.ast);
        if (ns === 'frac') return form('u3k-rad-frac', 'Right value — now simplify: leave no fraction under the radical (' + t('\\sqrt{\\frac{a}{b}}=\\frac{\\sqrt{a}}{\\sqrt{b}}') + ', then rationalize).');
        if (ns) return form('not-simplest', 'Right value — now simplify the radical: ' + t('\\sqrt{' + ns + '}') + ' has a perfect-square factor.');
        if (rational && rootInDen(a.ast)) return form('u3k-rationalize', 'Right value — now rationalize the denominator: multiply the top and bottom by the radical, e.g. ' + t('\\frac{2}{\\sqrt{5}}=\\frac{2\\sqrt{5}}{5}') + '.');
        if (unreduced(a.ast) || (ex.plainFraction(a.ast) && gcd(ex.plainFraction(a.ast)[0], ex.plainFraction(a.ast)[1]) > 1)) return form('lowest', 'Right value — now reduce the fraction to lowest terms.');
        if (sh.pow) return form('simplify', 'Right value — now work out the power.');
        return ok();
      }
      if (sh.decimals && Math.abs(a.val - W) < 0.006 * Math.max(1, Math.abs(W))) return form('decimal', 'That’s a decimal approximation. Give the <b>exact</b> value: a fraction' + (wm ? ' with a radical' : '') + ', no decimals.');
      for (var i = 0; i < alts.length; i++) if (alts[i].v !== 'undef' && Math.abs(a.val - alts[i].v) < 1e-9 * Math.max(1, Math.abs(alts[i].v))) return wrong(alts[i].code, alts[i].hint);
      if (W !== 0 && Math.abs(a.val + W) < 1e-9 * Math.max(1, Math.abs(W))) return wrong(opt.signCode || cp + 'sign', opt.signHint || 'Check the sign: use the signs of ' + t('x') + ' and ' + t('y') + ' in that quadrant (CAST).');
      return wrong('value', null);
    };
  }
  function altTex(v) { return v === 'undef' ? '\\text{undefined}' : typeof v === 'number' ? (Math.abs(v - Math.round(v)) < 1e-9 ? String(Math.round(v)) : null) : stex(v); }
  /* an exact-value part (keys: 'u3texact', or 'u3texactU' with an "undefined" key) */
  function exactPart(prompt, want, cp, opt, sol, hints, text) {
    opt = opt || {};
    var altSpecs = opt.altSpecs || [], alts = (opt.alts || []).concat(altSpecs.map(function (a) { return { v: a.s === 'undef' ? 'undef' : sval(a.s), code: a.code, hint: a.hint }; }));
    var p = P.math(prompt, exactChk(want, cp, { rational: opt.rational, alts: alts, signCode: opt.signCode, signHint: opt.signHint }), stex(want), sol, hints, text, { keys: opt.undef ? 'u3texactU' : 'u3texact', before: opt.before, placeholder: opt.undef ? 'e.g. -sqrt(3)/2 or undefined' : 'e.g. -2sqrt(5)/5' });
    p.answer = t((opt.ansPre || '') + stex(want));
    var bad = altSpecs.map(function (a) { return a.s === 'undef' ? '\\text{undefined}' : stex(a.s); });
    if (want !== 'undef' && sval(want) !== 0) bad.push(stex(sneg(want)));
    p.bad = bad.filter(function (b, i, arr) { return b !== p.key && arr.indexOf(b) === i && p.check(b).v !== 'correct'; });
    return p;
  }
  /* one angle in degrees in a number box (whole degrees, exact): alts [{ v, code, hint }] */
  function degChk(ans, alts) {
    var L = (alts || []).filter(function (a) { return isFinite(a.v) && Math.abs(a.v - ans) > 1e-9; });
    return function (resp) {
      if (!plainOf(resp)) return form('empty', 'Type your answer first.');
      var v = degNum(resp); if (v == null) return form('notnumber', 'Enter a single angle in degrees.');
      if (Math.abs(v - ans) < 1e-9) return ok();
      for (var i = 0; i < L.length; i++) if (Math.abs(v - L[i].v) < 1e-9) return wrong(L[i].code, L[i].hint);
      return wrong('value', null);
    };
  }
  function degPart(prompt, ans, alts, sol, hints, text, o) {
    o = o || {};
    var p = { prompt: prompt, input: { type: 'number', after: '°', before: o.before }, check: degChk(ans, alts), key: String(ans), answer: t((o.ansPre || '') + dg(ans)), solution: sol, hints: hints || [], text: text };
    p.bad = (alts || []).map(function (a) { return String(a.v); }).filter(function (b, i, arr) { return b !== p.key && arr.indexOf(b) === i && p.check(b).v !== 'correct'; });
    return p;
  }
  /* a list of angles (or lengths), any order. sols: values; opt: { dp (0, 1) | exact, what: 'angle'|'length', unit, fn, ref, quads,
     all (every solution when the interval is smaller), interval (tex), altSets [{ sols, code, hint }], also [[values]] (accepted),
     missingHint, noneHint, saidNoneHint, valueHint } */
  function listChk(sols, cp, opt) {
    opt = opt || {};
    var exact = !!opt.exact, dp = exact ? 0 : opt.dp == null ? 1 : opt.dp, len = opt.what === 'length';
    var tol = exact ? 1e-6 : dp >= 1 ? 1.01 * Math.pow(10, -dp) : 0.6 + 1e-9;
    var place0 = dp === 1 ? 'tenth' : dp === 0 ? (len ? 'whole number' : 'degree') : dp + ' decimal places';
    var fnN = opt.fn, quads = opt.quads || [], noun = len ? 'length' : 'angle';
    function near(v, x, tl) { return Math.abs(v - x) <= (tl || tol); }
    function inSet(v, set, tl) { for (var i = 0; i < set.length; i++) if (near(v, set[i], tl)) return i; return -1; }
    function matches(vals, set, tl) { if (vals.length !== set.length) return false; var used = {}; return vals.every(function (v) { for (var i = 0; i < set.length; i++) if (!used[i] && near(v, set[i], tl)) { used[i] = 1; return true; } return false; }); }
    var refPl = opt.ref == null ? [] : [1, 2, 3, 4].map(function (q) { return place(opt.ref, q); });
    var radPl = opt.ref == null || exact || len ? [] : [1, 2, 3, 4].map(function (q) { return place(opt.ref * RAD, q); });
    var unitRe = len ? /\s*(cm|mm|km|m)\b/g : null;
    return function (resp) {
      var p = readList(resp, unitRe);
      if (p.empty) return form('empty', 'Type the ' + noun + (sols.length === 1 ? '' : 's') + (len ? '' : ' in degrees') + (sols.length > 1 ? ', separated by commas' : '') + (len ? '.' : ' — or press <b>no solution</b>.'));
      if (p.bad) return form('u3k-ang-unreadable', 'Type just the ' + noun + 's' + (len ? '' : ' in degrees') + ', separated by commas, e.g. ' + t(len ? '12.4,\\ 2.9' : exact ? '30,\\ 150' : '24.8,\\ 155.2') + (len ? '.' : ' (or press <b>no solution</b>).'));
      if (p.none) return sols.length ? wrong(cp + 'said-none', opt.saidNoneHint || 'There are solutions: ' + (fnN && fnN !== 'tan' ? 'the value is between ' + t('-1') + ' and ' + t('1') + ', so ' : '') + 'find the reference angle and place it in the quadrants where the ratio has this sign.') : ok();
      if (!sols.length) return wrong(cp + 'none', opt.noneHint || 'Check the value first: ' + (fnN === 'tan' ? 'tangent can be any number.' : t('\\sin\\theta') + ' and ' + t('\\cos\\theta') + ' are always between ' + t('-1') + ' and ' + t('1') + '.'));
      var vals = p.vals;
      for (var d = 0; d < vals.length; d++) for (var e = d + 1; e < vals.length; e++) if (Math.abs(vals[d] - vals[e]) < 1e-9) return form('u3k-dup', 'You listed ' + t(len ? String(vals[d]) : dg(vals[d])) + ' twice. List each ' + noun + ' once.');
      if (matches(vals, sols)) { if (!exact && p.decs.some(function (dd) { return dd > dp; })) return form('round', 'Right — now round each ' + noun + ' to the nearest ' + place0 + '.'); return ok(); }
      for (var a0 = 0; a0 < (opt.also || []).length; a0++) if (matches(vals, opt.also[a0], 1e-6 + 0.5 * Math.pow(10, -dp))) return ok();
      if (!exact && vals.length === sols.length && vals.every(function (v) { return inSet(v, sols, dp >= 1 ? 0.6 : 1.6) >= 0; })) return form('round', 'Close — give each ' + noun + ' to the nearest ' + place0 + ' (keep the full calculator value until the end).');
      var alts = opt.altSets || [];
      for (var k = 0; k < alts.length; k++) { var as = alts[k].sols; if (matches(vals, as) && !matches(as, sols)) return wrong(alts[k].code, alts[k].hint); }
      var hit = vals.map(function (v) { return inSet(v, sols); }), bad = vals.filter(function (v, i) { return hit[i] < 0; });
      if (!bad.length) return wrong(cp + (len ? 'amb-one' : 'missing'), opt.missingHint || ('There ' + (sols.length - vals.length === 1 ? 'is another solution' : 'are ' + (sols.length - vals.length) + ' more solutions') + (fnN && quads.length === 2 ? ': ' + t('\\' + fnN + '\\theta') + ' has this sign in two quadrants, ' + quadsTex(quads) + '. Place ' + t('\\theta_R') + ' in both.' : '.')));
      var u = bad[0];
      if (!len && (u < 0 || u >= 360)) return wrong(cp + 'range', 'Give angles from ' + t('0^\\circ') + ' to ' + t('360^\\circ') + '. ' + (u < 0 && fnN ? 'A negative calculator angle isn’t the reference angle: use the <b>positive</b> value to find ' + t('\\theta_R') + ', then place it in the quadrants.' : ''));
      if (opt.all && inSet(u, opt.all) >= 0) return wrong(cp + 'interval', t(dg(exact ? String(Math.round(u)) : fx(u, dp))) + ' solves the equation, but it isn’t in the interval ' + t(opt.interval || '') + '. Keep only the solutions in the interval.');
      if (radPl.length && inSet(u, radPl) >= 0) return wrong(cp + 'radian', 'Your calculator is in <b>radian</b> mode. Switch it to <b>degree</b> mode (TI-84: MODE → DEGREE) and try again.');
      if (opt.ref != null && near(u, opt.ref) && inSet(opt.ref, sols) < 0) return wrong(cp + 'refsol', t(dg(exact ? String(opt.ref) : fx(opt.ref, dp))) + ' is the reference angle ' + t('\\theta_R') + ', not a solution here' + (fnN && quads.length ? ': ' + t('\\' + fnN + '\\theta') + ' is ' + (sgn(fnN, quads[0]) > 0 ? 'positive' : 'negative') + ', so ' + t('\\theta') + ' is in Quadrants ' + quadsTex(quads) : '') + '. Place ' + t('\\theta_R') + ' in those quadrants.');
      if (refPl.length && inSet(u, refPl) >= 0) return wrong(cp + 'quad', 'Check the quadrants with CAST' + (fnN && quads.length ? ': ' + t('\\' + fnN + '\\theta') + ' is ' + (sgn(fnN, quads[0]) > 0 ? 'positive' : 'negative') + ' in Quadrants ' + quadsTex(quads) + '. ' + quads.map(function (q) { return ROM[q] + ': ' + t(q === 1 ? '\\theta_R' : q === 2 ? '180^\\circ-\\theta_R' : q === 3 ? '180^\\circ+\\theta_R' : '360^\\circ-\\theta_R'); }).join(', ') + '.' : '.'));
      return wrong('value', opt.valueHint || null);
    };
  }
  function listKey(sols, dp, exact) { return sols.length ? sols.map(function (x) { return exact ? String(Math.round(x)) : fx(x, dp); }).join(', ') : '\\text{no solution}'; }
  function listTex(sols, dp, exact, unit) { return sols.length ? sols.map(function (x) { var v = exact ? String(Math.round(x)) : fx(x, dp); return unit ? F(v) + '\\text{ ' + unit + '}' : dg(v); }).join(',\\ ') : '\\text{no solution}'; }
  function listPart(prompt, sols, cp, opt, sol, hints, text) {
    opt = opt || {};
    var dp = opt.exact ? 0 : opt.dp == null ? 1 : opt.dp, len = opt.what === 'length';
    var p = { prompt: prompt, input: { type: 'math', keys: len ? 'u3tlen' : 'u3tang', before: opt.before, placeholder: len ? 'e.g. 12.4, 2.9' : opt.exact ? 'e.g. 30, 150 or no solution' : 'e.g. 24.8, 155.2 or no solution' }, check: listChk(sols, cp, opt), key: listKey(sols, dp, opt.exact), answer: t(listTex(sols, dp, opt.exact, len ? opt.unit : null)), solution: sol, hints: hints || [], text: text };
    var bad = (opt.altSets || []).map(function (a) { return listKey(a.sols, dp, opt.exact); });
    if (sols.length > 1) bad.push(listKey(sols.slice(0, 1), dp, opt.exact));
    if (opt.ref != null && !len) bad.push(listKey([opt.ref], dp, opt.exact));
    if (sols.length) bad.push('\\text{no solution}');
    p.bad = bad.filter(function (b, i, arr) { return b !== p.key && arr.indexOf(b) === i && p.check(b).v !== 'correct'; });
    return p;
  }
  /* rounded answers (from Math 10C Unit 9): a typed unit is ignored; `also` values are accepted (built on an intermediate
     value rounded to the answer's own place) */
  function unitWrap(check) {
    return function (resp) {
      var s = String(resp == null ? '' : resp), bare = s.replace(/\\text\{[^}]*\}|\\mathrm\{[^}]*\}/g, '').replace(/\^?\{?\\circ\}?|°|\s*(cm²|m²|cm\^2|m\^2|cm|mm|km|m|km\/h|units|degrees?)\s*$/gi, '').trim();
      if (bare !== s.trim() && HW.parse.number(bare).ok) return check(bare);
      return check(resp);
    };
  }
  function bareNum(resp) { var s = String(resp == null ? '' : resp), bare = s.replace(/\\text\{[^}]*\}|\\mathrm\{[^}]*\}/g, '').replace(/\^?\{?\\circ\}?|°|\s*(cm²|m²|cm|mm|km|m|km\/h|units|degrees?)\s*$/gi, '').trim(), p = HW.parse.number(bare); return p.ok ? p.value : null; }
  function alsoWrap(check, also, dp) {
    var acc = (also || []).filter(function (v) { return isFinite(v); }).map(function (v) { return rd(v, dp); });
    if (!acc.length) return check;
    return function (resp) { var v = bareNum(resp); if (v != null && acc.some(function (a) { return Math.abs(v - a) < 1e-9; })) return ok(); return check(resp); };
  }
  function cleanAlts(x, dp, alts) { return (alts || []).filter(function (a) { return a && isFinite(a.v) && Math.abs(rd(a.v, dp) - rd(x, dp)) > 1e-9; }); }
  function badOf(x, dp, alts) { var seen = {}, out = []; seen[fx(x, dp)] = 1; cleanAlts(x, dp, alts).forEach(function (a) { var s = fx(a.v, dp); if (!seen[s]) { seen[s] = 1; out.push(s); } }); return out; }
  /* o = { unit, alts, diag, before, also } */
  function nearPart(prompt, x, dp, o, sol, hints, text) {
    o = o || {};
    var alts = cleanAlts(x, dp, o.alts);
    var p = K.P.near(prompt, x, dp, { unit: o.unit, alts: alts, diag: o.diag, before: o.before }, sol, hints, text);
    p.check = alsoWrap(unitWrap(p.check), o.also, dp);
    if (o.unit === '°') p.answer = t((o.ansPre || '') + fx(x, dp) + '^\\circ');
    else if (o.ansPre) p.answer = t(o.ansPre + F(fx(x, dp))) + (o.unit ? ' ' + o.unit : '');
    p.bad = badOf(x, dp, alts).filter(function (b) { return p.check(b).v !== 'correct'; });
    return p;
  }
  /* a rounded-value checker for a box in fieldsPart */
  function nearChk(x, dp, alts, also) { return alsoWrap(unitWrap(K.near(x, dp, { alts: cleanAlts(x, dp, alts) })), also, dp); }
  /* several boxes: b = { label, before, after, mode ('math'), keys, check, key, show, bad: [strings] }.
     One wrong box (the rest right) with no recognised mistake is the code one-box; two or more wrong boxes keep a code only
     when they share it. */
  function fieldsPart(prompt, boxes, cp, sol, hints, text) {
    var fields = boxes.map(function (b) { return { label: b.label, before: b.before, after: b.after, mode: b.mode, keys: b.keys, wide: b.wide, placeholder: b.placeholder }; });
    var keys = boxes.map(function (b) { return b.key; });
    var labels = boxes.map(function (b) { return b.label || b.before || ''; });
    var check = function (resp) {
      resp = resp || [];
      var res = boxes.map(function (b, i) { return b.check(resp[i] == null ? '' : resp[i]); });
      var wr = [], fm = null;
      res.forEach(function (r, i) { if (r.v === 'wrong') wr.push(i); else if (r.v === 'form' && !fm) fm = { i: i, r: r }; });
      function lab(i) { return labels[i] ? '<b>' + labels[i] + '</b> ' : ''; }
      if (!wr.length) { if (fm) return { v: 'form', code: fm.r.code, hint: lab(fm.i) + (fm.r.hint || 'Check this box.') }; return ok(); }
      var r0 = res[wr[0]], hint = lab(wr[0]) + (r0.hint || 'Check this one again.');
      if (wr.length === 1) { var empty = boxes.some(function (b, i) { return res[i].v === 'form' && (res[i].code === 'empty'); }); return wrong(r0.code && r0.code !== 'value' ? r0.code : empty ? 'value' : cp + 'one-box', hint); }
      var same = wr.every(function (i) { return res[i].code === r0.code; });
      return wrong(same ? r0.code : 'value', hint);
    };
    var ans = boxes.map(function (b, i) { return (b.label ? b.label + ' ' : b.before ? b.before + ' ' : '') + (b.show || t(keys[i])) + (b.after && b.after !== '°' && !b.show ? ' ' + b.after : ''); }).join('<br>');
    var p = P.fields(prompt, fields, boxes.map(function (b) { return b.check; }), keys, ans, sol, hints, text);
    p.check = check;
    p.bad = [];
    boxes.forEach(function (b, i) { (b.bad || []).slice(0, 3).forEach(function (s) { var k = keys.slice(); k[i] = s; p.bad.push(k); }); });
    p.bad = p.bad.filter(function (k) { return check(k).v !== 'correct'; });
    return p;
  }
  function exactBox(label, want, cp, opt) {
    opt = opt || {};
    var altSpecs = opt.altSpecs || [], alts = altSpecs.map(function (a) { return { v: a.s === 'undef' ? 'undef' : sval(a.s), code: a.code, hint: a.hint }; });
    var chk = exactChk(want, cp, { alts: alts, rational: opt.rational });
    var bad = altSpecs.map(function (a) { return a.s === 'undef' ? '\\text{undefined}' : stex(a.s); }).filter(function (b) { return chk(b).v !== 'correct'; });
    return { label: label, mode: 'math', keys: opt.undef ? 'u3texactU' : 'u3texact', placeholder: opt.undef ? 'e.g. -sqrt(3)/2 or undefined' : 'e.g. -2sqrt(5)/5', check: chk, key: stex(want), show: t(stex(want)), bad: bad };
  }
  function degBox(label, ans, alts) { var chk = degChk(ans, alts); return { label: label, after: '°', check: chk, key: String(ans), show: t(dg(ans)), bad: (alts || []).map(function (a) { return String(a.v); }).filter(function (b) { return chk(b).v !== 'correct'; }) }; }
  function nearBox(label, x, dp, alts, unit, also) { var chk = nearChk(x, dp, alts, also); return { label: label, after: unit, check: chk, key: fx(x, dp), show: unit === '°' ? t(fx(x, dp) + '^\\circ') : t(F(fx(x, dp))) + (unit ? ' ' + unit : ''), bad: badOf(x, dp, alts).filter(function (b) { return chk(b).v !== 'correct'; }) }; }
  function intBox(label, ans, alts) { var chk = K.number(ans, function (v) { for (var i = 0; i < (alts || []).length; i++) if (Math.abs(v - alts[i].v) < 1e-9) return { code: alts[i].code, hint: alts[i].hint }; return null; }); return { label: label, check: chk, key: String(ans), show: t(ans), bad: (alts || []).map(function (a) { return String(a.v); }).filter(function (b) { return chk(b).v !== 'correct'; }) }; }
  function mcPart(r, prompt, opts, sol, hints, text, keepOrder) {
    var seen = {}, list = opts.filter(function (o) { if (seen[o.html]) return false; seen[o.html] = 1; return true; });
    return P.mc(r, prompt, list, sol, hints, text, keepOrder);
  }
  S.exactChk = exactChk; S.exactPart = exactPart; S.degChk = degChk; S.degPart = degPart; S.listChk = listChk; S.listPart = listPart; S.nearPart = nearPart; S.nearChk = nearChk;
  S.fieldsPart = fieldsPart; S.exactBox = exactBox; S.degBox = degBox; S.nearBox = nearBox; S.intBox = intBox; S.mcPart = mcPart;

  /* ---------------- keypads (browser only) ---------------- */
  var W = HW.widgets;
  if (W && W.KEYSETS) {
    var kd = function (n) { return { label: String(n), tex: String(n), plain: String(n) }; };
    var KK = { del: { label: '⌫', fn: 'del', title: 'Delete' }, clear: { label: 'clear', fn: 'clear' }, left: { label: '◀', fn: 'left', title: 'Move left' }, right: { label: '▶', fn: 'right', title: 'Move right (out of a box)' },
      enter: { label: 'Check ↵', fn: 'enter', wide: true }, sqrt: { label: '√', tex: '\\sqrt{#0}', plain: 'sqrt(', title: 'Square root' }, frac: { label: '<sup>a</sup>⁄<sub>b</sub>', tex: '\\frac{#@}{#?}', plain: '/', title: 'Fraction' },
      minus: { label: '−', tex: '-', plain: '-' }, dot: { label: '.', tex: '.', plain: '.' }, comma: { label: ',', tex: ',', plain: ', ', title: 'Next value' },
      degk: { label: '°', tex: '^{\\circ}', plain: '°', title: 'Degrees (optional)' }, none: { label: 'no solution', tex: '\\text{no solution}', plain: 'no solution', title: 'The equation has no solution', wide: true },
      undef: { label: 'undefined', tex: '\\text{undefined}', plain: 'undefined', title: 'The ratio is undefined (divides by zero)' } };
    W.KEYSETS.u3tang = [[kd(7), kd(8), kd(9), KK.degk, KK.del], [kd(4), kd(5), kd(6), KK.comma, KK.clear], [kd(1), kd(2), kd(3), KK.minus, KK.left, KK.right], [kd(0), KK.dot, KK.none, KK.enter]];
    W.KEYSETS.u3tlen = [[kd(7), kd(8), kd(9), KK.del], [kd(4), kd(5), kd(6), KK.comma, KK.clear], [kd(1), kd(2), kd(3), KK.left, KK.right], [kd(0), KK.dot, KK.enter]];
    W.KEYSETS.u3texact = [[kd(7), kd(8), kd(9), KK.sqrt, KK.del], [kd(4), kd(5), kd(6), KK.frac, KK.clear], [kd(1), kd(2), kd(3), KK.minus, KK.left, KK.right], [kd(0), KK.enter]];
    W.KEYSETS.u3texactU = [[kd(7), kd(8), kd(9), KK.sqrt, KK.del], [kd(4), kd(5), kd(6), KK.frac, KK.clear], [kd(1), kd(2), kd(3), KK.minus, KK.left, KK.right], [kd(0), KK.undef, KK.enter]];
    if (W.KEYHELP) {
      W.KEYHELP.u3tang = ['Type each angle in degrees with a comma between them, e.g. ' + HW.k('24.8,\\ 155.2') + ' (the ° is optional). Press <b>no solution</b> if there is none.', 'Type e.g. <code>24.8, 155.2</code> or <code>no solution</code>.'];
      W.KEYHELP.u3tlen = ['Type each length with a comma between them, e.g. ' + HW.k('12.4,\\ 2.9') + '.', 'Type e.g. <code>12.4, 2.9</code>.'];
      W.KEYHELP.u3texact = ['Use <b><sup>a</sup>⁄<sub>b</sub></b> for a fraction and <b>√</b> for a root, e.g. ' + HW.k('-\\frac{2\\sqrt{5}}{5}') + '. Press <b>▶</b> to step out of a box.', 'Type e.g. <code>-2sqrt(5)/5</code> or <code>-21/29</code>.'];
      W.KEYHELP.u3texactU = ['Use <b><sup>a</sup>⁄<sub>b</sub></b> and <b>√</b>, e.g. ' + HW.k('-\\frac{\\sqrt{3}}{2}') + ', or press <b>undefined</b>. Press <b>▶</b> to step out of a box.', 'Type e.g. <code>-sqrt(3)/2</code>, or <code>undefined</code>.'];
    }
  }

  /* ---------------- figures ---------------- */
  var INK = '#2b3340', COL = '#2b55a0', ANS = '#b23a48', GRID = '#e3e7ee';
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function txt(x, y, s, o) {
    o = o || {}; var it = /^[A-Za-zθ]$/.test(String(s)) ? ' font-style="italic"' : '';
    return '<text x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" font-size="' + (o.size || 13) + '" text-anchor="' + (o.anchor || 'middle') + '" dominant-baseline="central" fill="' + (o.color || INK) + '"' + it + ' paint-order="stroke" stroke="#fff" stroke-width="3" stroke-linejoin="round">' + esc(s).replace(/-/g, '−') + '</text>';
  }
  function ln(x1, y1, x2, y2, col, w, dash) { return '<line x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) + '" stroke="' + col + '" stroke-width="' + w + '"' + (dash ? ' stroke-dasharray="' + dash + '"' : '') + ' stroke-linecap="round"/>'; }
  function head(x, y, ux, uy, col, s) { s = s || 6; var nx = -uy, ny = ux; return '<polygon points="' + [x + ux * s, y + uy * s, x - ux * s * 0.6 + nx * s * 0.6, y - uy * s * 0.6 + ny * s * 0.6, x - ux * s * 0.6 - nx * s * 0.6, y - uy * s * 0.6 - ny * s * 0.6].map(function (v) { return v.toFixed(1); }).join(' ') + '" fill="' + col + '"/>'; }
  /* An angle in standard position on coordinate axes (drawn by hand: HW.graph has no rotation arcs).
     o = { theta (degrees) | pt: [x, y] (a point on the terminal arm), ptLabel, grid, arc (rotation arrow, default true),
           ref (the reference angle, dashed), refLabel, thetaLabel, tri (the drop from the point to the x-axis), width, aria } */
  function angleFig(o) {
    o = o || {};
    var Wd = o.width || 190, c = Wd / 2, pt = o.pt, th = o.theta != null ? o.theta : norm(Math.atan2(pt[1], pt[0]) / RAD);
    var R = pt ? Math.max(Math.abs(pt[0]), Math.abs(pt[1]), 1) * 1.3 : 1, sc = (c - 16) / R, s = '';
    function X(x) { return c + x * sc; } function Y(y) { return c - y * sc; }
    if (o.grid && pt && R <= 14) { for (var i = -Math.floor(R); i <= Math.floor(R); i++) { if (!i) continue; s += ln(X(i), Y(-R), X(i), Y(R), GRID, 1) + ln(X(-R), Y(i), X(R), Y(i), GRID, 1); } }
    s += ln(X(-R), c, X(R) + 4, c, INK, 1.4) + head(X(R) + 4, c, 1, 0, INK, 5) + ln(c, Y(-R), c, Y(R) - 4, INK, 1.4) + head(c, Y(R) - 4, 0, -1, INK, 5);
    s += txt(X(R) - 2, c + 11, 'x', { size: 12 }) + txt(c + 10, Y(R) + 2, 'y', { size: 12 });
    var ux = Math.cos(th * RAD), uy = -Math.sin(th * RAD), Lpx = pt ? Math.min(c - 8, Math.hypot(pt[0], pt[1]) * sc * 1.18) : (c - 14);
    s += ln(c, c, c + ux * Lpx, c + uy * Lpx, o.armColor || COL, 2.4);
    var q = quad(th);
    if (o.ref && q) {
      var px = pt ? X(pt[0]) : c + ux * Lpx * 0.8, py = pt ? Y(pt[1]) : c + uy * Lpx * 0.8;
      if (o.tri !== false) s += ln(px, py, px, c, '#6a7182', 1.3, '4 3');
      var a1 = q === 1 ? 0 : q === 2 ? th : q === 3 ? 180 : th, a2 = q === 1 ? th : q === 2 ? 180 : q === 3 ? th : 360, rr = Math.min(42, Lpx * 0.5);
      s += '<path d="M' + (c + rr * Math.cos(a1 * RAD)).toFixed(1) + ' ' + (c - rr * Math.sin(a1 * RAD)).toFixed(1) + ' A' + rr + ' ' + rr + ' 0 0 0 ' + (c + rr * Math.cos(a2 * RAD)).toFixed(1) + ' ' + (c - rr * Math.sin(a2 * RAD)).toFixed(1) + '" fill="none" stroke="' + ANS + '" stroke-width="1.8" stroke-dasharray="4 3"/>';
      if (o.refLabel) { var am = (a1 + a2) / 2, lr = rr + 14; s += txt(c + lr * Math.cos(am * RAD), c - lr * Math.sin(am * RAD), o.refLabel, { color: ANS, size: 12 }); }
    }
    if (o.arc !== false && th > 0.5) {
      var r0 = 15, e = Math.min(th, 359.5), large = e > 180 ? 1 : 0, ex0 = c + r0 * Math.cos(e * RAD), ey0 = c - r0 * Math.sin(e * RAD);
      s += '<path d="M' + (c + r0) + ' ' + c + ' A' + r0 + ' ' + r0 + ' 0 ' + large + ' 0 ' + ex0.toFixed(1) + ' ' + ey0.toFixed(1) + '" fill="none" stroke="' + INK + '" stroke-width="1.4"/>';
      s += head(ex0, ey0, -Math.sin(e * RAD), -Math.cos(e * RAD), INK, 4);
      if (o.thetaLabel !== false) { var hm = e / 2, hr = r0 + 9; s += txt(c + hr * Math.cos(hm * RAD), c - hr * Math.sin(hm * RAD), o.thetaLabel || 'θ', { size: 12 }); }
    }
    if (pt) {
      var Px = X(pt[0]), Py = Y(pt[1]);
      s += '<circle cx="' + Px.toFixed(1) + '" cy="' + Py.toFixed(1) + '" r="3.6" fill="' + INK + '"/>';
      if (o.ptLabel) { var lw = String(o.ptLabel).length * 3.4 + 4; s += txt(Math.min(Wd - lw, Math.max(lw, Px)), Py + (pt[1] >= 0 ? -12 : 13), o.ptLabel, { size: 12 }); }
    }
    return '<div class="fig"><svg class="fig-svg" viewBox="0 0 ' + Wd + ' ' + Wd + '" width="100%" style="max-width:' + Wd + 'px" role="img" aria-label="' + esc(o.aria || 'angle in standard position') + '">' + s + '</svg></div>';
  }
  S.angleFig = angleFig;
  /* triangles, drawn to scale with HW.fig. T = { N: [three vertex letters], A: { X: angle at X }, s: { X: side opposite X } } */
  var TRIS = [['A', 'B', 'C'], ['D', 'E', 'F'], ['P', 'Q', 'R'], ['J', 'K', 'L'], ['L', 'M', 'N'], ['R', 'S', 'T'], ['X', 'Y', 'Z'], ['K', 'L', 'M'], ['S', 'T', 'U'], ['G', 'H', 'K'], ['D', 'E', 'G']];
  function names3(r, noH) { return find(function () { return r.pick(TRIS).slice(); }, function (N) { return !noH || N.indexOf('H') < 0; }); }
  function others(N, X) { return N.filter(function (v) { return v !== X; }); }
  function sideNm(N, X) { return others(N, X).join(''); }
  function lc(X) { return X.toLowerCase(); }
  function triAngles(N, angs, X, len) { var k = len / sinD(angs[X]), s = {}; N.forEach(function (v) { s[v] = k * sinD(angs[v]); }); return { N: N, A: angs, s: s }; }
  function triSides(N, sides) { var A = {}; N.forEach(function (v) { var o = others(N, v); A[v] = acosD((sq(sides[o[0]]) + sq(sides[o[1]]) - sq(sides[v])) / (2 * sides[o[0]] * sides[o[1]])); }); return { N: N, A: A, s: sides }; }
  /* o = { top: vertex drawn at the top (the base is the side opposite it), flip, sides: { X: label of the side opposite X }, angles: { X: label }, width } */
  function triFig(T, o) {
    o = o || {};
    var N = T.N, top = o.top || N[2], base = others(N, top); if (o.swap) base.reverse();
    var U = base[0], V = base[1], fl = o.flip ? -1 : 1, pts = {};
    pts[U] = [0, 0]; pts[V] = [fl * T.s[top], 0]; pts[top] = [fl * T.s[V] * cosD(T.A[U]), T.s[V] * sinD(T.A[U])];
    var sd = o.sides || {}, segs = [[U, V, sd[top]], [V, top, sd[U]], [top, U, sd[V]]].map(function (q) { return q[2] == null || q[2] === '' ? [q[0], q[1]] : q; });
    var angs = []; N.forEach(function (v) { var lab = o.angles && o.angles[v]; if (lab) { var ot = others(N, v); angs.push([v, ot[0], ot[1], lab]); } });
    return '<div class="fig">' + HW.fig({ pts: pts, segs: segs, angles: angs, names: true, width: o.width || 300, height: o.height || 230, aria: o.aria || 'triangle ' + N.join('') }) + '</div>';
  }
  /* a reasonable view of a triangle: the base is the longest side, so the top vertex sits above it */
  function topOf(T) { // the base: the longest side, unless that makes the drawing very flat (height ÷ width)
    var N = T.N, best = N[0], bs = -1;
    N.forEach(function (v) {
      var o = others(N, v), base = T.s[v], h = T.s[o[1]] * sinD(T.A[o[0]]), x3 = T.s[o[1]] * cosD(T.A[o[0]]), w = Math.max(base, x3) - Math.min(0, x3);
      var sc = Math.min(h / w, 0.35) + 0.25 * base / Math.max(T.s[N[0]], T.s[N[1]], T.s[N[2]]);
      if (sc > bs) { bs = sc; best = v; }
    });
    return best;
  }
  S.triFig = triFig; S.names3 = names3; S.others = others; S.sideNm = sideNm; S.lc = lc; S.triAngles = triAngles; S.triSides = triSides; S.topOf = topOf;
  var UNITS = ['cm', 'cm', 'm', 'm', 'km', 'mm'];
  function lenT(x, u, dp) { return t(F(fx(x, dp == null ? 1 : dp)) + '\\text{ ' + u + '}'); }
  function lenS(x, u, dp) { return fx(x, dp == null ? 1 : dp) + ' ' + u; }
  function angT(v, X) { return t('\\angle ' + v + '=' + dg(X)); }

  /* =====================================================================================================
   * Question builders: B.name(r, cp, shared?, opt?) → a part. cp = 'u3t-' (test) or 'u3x-' (exit slips).
   * ===================================================================================================== */
  var B = S.build = {};
  var HREF = ['The reference angle is the acute angle between the terminal arm and the <b>' + t('x') + '-axis</b> (never the ' + t('y') + '-axis).', 'Quadrant II: ' + t('180^\\circ-\\theta') + ' · Quadrant III: ' + t('\\theta-180^\\circ') + ' · Quadrant IV: ' + t('360^\\circ-\\theta') + '.'];
  var HPLACE = ['Sketch the reference angle in the quadrant given, measured from the ' + t('x') + '-axis.', 'Quadrant I: ' + t('\\theta_R') + ' · II: ' + t('180^\\circ-\\theta_R') + ' · III: ' + t('180^\\circ+\\theta_R') + ' · IV: ' + t('360^\\circ-\\theta_R') + '.'];
  function sketchFor(a, refL) { return angleFig({ theta: a, ref: quad(a) > 0, refLabel: refL, width: 160 }); }

  /* ---------- T1 · Lesson 1 ---------- */
  B.refAngle = function (r, cp) {
    var q = r.pick([2, 2, 3, 3, 4, 4, 1]), a = angleIn(r, q, AVOID_ANG), rf = refOf(a);
    var alts = [], ya = q === 1 ? 90 - a : q === 2 ? a - 90 : q === 3 ? 270 - a : a - 270;
    if (ya !== rf) alts.push({ v: ya, code: cp + 'ref-yaxis', hint: 'That is the angle to the ' + t('y') + '-axis. The reference angle is always measured to the <b>' + t('x') + '-axis</b>.' });
    [180 - a, a - 180, 360 - a].forEach(function (v) { if (v > 0 && v !== rf && v !== ya) alts.push({ v: v, code: cp + 'ref-formula', hint: t(dg(a)) + ' is in Quadrant ' + ROM[q] + ' (' + between(q) + '): use ' + t(refRule(q)) + '.' }); });
    if (q !== 1) alts.push({ v: a, code: cp + 'ref-theta', hint: 'A reference angle is <b>acute</b> (between ' + t('0^\\circ') + ' and ' + t('90^\\circ') + '): measure from the terminal arm to the nearest part of the ' + t('x') + '-axis.' });
    return degPart('Determine the reference angle ' + t('\\theta_R') + ' of ' + t(dg(a)) + '.', rf, alts,
      t(dg(a)) + ' is in Quadrant ' + ROM[q] + ' (' + between(q) + '), so ' + t(refTex(a)) + '.' + sketchFor(a, dgs(rf)), HREF, 'reference angle', { before: t('\\theta_R=') });
  };
  B.fromRef = function (r, cp) {
    var axis = r.chance(0.12), rf, q, a, where;
    if (axis) { var c = r.pick([[0, 'the negative ' + t('x') + '-axis', 180], [90, 'the negative ' + t('y') + '-axis', 270], [90, 'the positive ' + t('y') + '-axis', 90]]); rf = c[0]; where = c[1]; a = c[2]; q = 0; }
    else { q = r.pick([2, 3, 4, 2, 3, 4, 1]); rf = randRef(r, 3, 87); a = place(rf, q); if (AVOID_ANG.indexOf(a) >= 0) { rf = rf + (rf < 80 ? 2 : -2); a = place(rf, q); } where = 'Quadrant ' + ROM[q]; }
    var alts = [];
    if (q) [1, 2, 3, 4].forEach(function (k) { if (k !== q) alts.push({ v: place(rf, k), code: k === 1 ? cp + 'place-ref' : cp + 'place', hint: k === 1 ? t(dg(rf)) + ' is the reference angle. The rotation angle is measured from the positive ' + t('x') + '-axis to the terminal arm in Quadrant ' + ROM[q] + '.' : 'That angle is in Quadrant ' + ROM[k] + '. In Quadrant ' + ROM[q] + ': ' + t('\\theta=' + placeRule(q)) + '.' }); });
    return degPart('An angle ' + t('\\theta') + ' in standard position, ' + t('0^\\circ\\le\\theta\\le 360^\\circ') + ', has a reference angle of ' + t(dg(rf)) + ', and its terminal arm lies in ' + where + '. Determine ' + t('\\theta') + '.', a, alts,
      (q ? 'Quadrant ' + ROM[q] + ': ' + t('\\theta=' + placeTex(q, rf) + (q === 1 ? '' : '=' + dg(a))) + '.' : 'The terminal arm is on an axis: ' + t('\\theta=' + dg(a)) + ' (' + t('\\theta_R=' + dg(rf)) + ').') + sketchFor(a, q ? dgs(rf) : null), HPLACE, 'angle from its reference angle', { before: t('\\theta=') });
  };
  B.coterminal = function (r, cp) {
    var neg = r.chance(0.55), k, a, alts = [], pr, sol;
    if (neg) {
      k = find(function () { return r.int(15, 345); }, function (v) { return v % 90 !== 0 && [45, 135, 200, 310, 90].indexOf(v) < 0; }); a = 360 - k;
      alts.push({ v: k, code: cp + 'cot-sign', hint: 'A clockwise rotation of ' + t(dg(k)) + ' ends on the same arm as ' + t(dg(360) + '-' + dg(k)) + ' (counterclockwise).' });
      pr = 'Sketch a rotation of ' + t(dg(-k)) + ' (that is, ' + t(dg(k)) + ' clockwise). State the angle from ' + t('0^\\circ') + ' to ' + t('360^\\circ') + ' that has the same terminal arm.';
      sol = 'Turning ' + t(dg(k)) + ' clockwise stops on the same arm as ' + t(dg(360) + '-' + dg(k) + '=' + dg(a)) + '.';
    } else {
      a = find(function () { return r.int(5, 355); }, function (v) { return v % 90 !== 0 && [30, 60, 240].indexOf(v) < 0; }); k = 360 + a;
      alts.push({ v: k - 180, code: cp + 'cot-turn', hint: 'One full turn is ' + t('360^\\circ') + ': subtract ' + t('360^\\circ') + ', not ' + t('180^\\circ') + '.' });
      pr = 'Sketch a counterclockwise rotation of ' + t(dg(k)) + '. State the angle from ' + t('0^\\circ') + ' to ' + t('360^\\circ') + ' that has the same terminal arm.';
      sol = 'One full turn is ' + t('360^\\circ') + '; the extra ' + t(dg(k) + '-' + dg(360) + '=' + dg(a)) + ' stops in Quadrant ' + ROM[quad(a)] + '. Same arm as ' + t(dg(a)) + '.';
    }
    return degPart(pr, a, alts, sol + sketchFor(a), ['Clockwise is negative: subtract the turn from ' + t('360^\\circ') + '.', 'More than ' + t('360^\\circ') + ': take off one full turn.'], 'same terminal arm');
  };
  B.sameRefMC = function (r, cp) {
    var s = find(function () { var q = r.pick([1, 2, 3, 4]), rf = randRef(r, 8, 82); return { q: q, rf: rf, a: place(rf, q), y: 90 - rf }; }, function (o) { return Math.abs(o.y - o.rf) >= 8 && AVOID_ANG.indexOf(o.a) < 0; });
    var qs = r.shuffle([1, 2, 3, 4].filter(function (k) { return k !== s.q; })), right = place(s.rf, qs[0]);
    var wrongQ = r.shuffle([1, 2, 3, 4].filter(function (k) { return k !== quad(right); })).slice(0, 3);
    var opts = [{ html: t(dg(right)), right: true }].concat(wrongQ.map(function (k) { var v = place(s.y, k); return { html: t(dg(v)), why: t(dg(v)) + ' has a reference angle of ' + t(dg(s.y)) + ' — the angle to the ' + t('y') + '-axis. ' + t(dg(s.a)) + ' has ' + t(refTex(s.a)) + '.', code: 'y' + k }; }));
    return mcPart(r, 'Which angle has the same reference angle as ' + t(dg(s.a)) + '?', opts,
      t(refTex(s.a)) + '. ' + t(dg(right)) + ' is in Quadrant ' + ROM[quad(right)] + ' and has ' + t(refTex(right)) + ' too. (The other choices have a reference angle of ' + t(dg(s.y)) + ', from measuring to the ' + t('y') + '-axis.)', HREF, 'same reference angle');
  };
  B.sameRef = function (r, cp) {
    var q = r.pick([2, 3, 4, 1]), a = angleIn(r, q, AVOID_ANG), rf = refOf(a), all = [1, 2, 3, 4].map(function (k) { return place(rf, k); }), sols = all.filter(function (v) { return v !== a; }).sort(function (x, y) { return x - y; });
    var ya = 90 - rf, ysets = [1, 2, 3, 4].map(function (k) { return place(ya, k); }).filter(function (v) { return v !== a; });
    return listPart('Determine the three other angles from ' + t('0^\\circ') + ' to ' + t('360^\\circ') + ' that have the same reference angle as ' + t(dg(a)) + '.', sols, cp,
      { exact: true, altSets: [{ sols: all, code: cp + 'same-incl', hint: t(dg(a)) + ' is the given angle: list only the <b>other three</b>.' }, { sols: ysets.slice(0, 3), code: cp + 'ref-yaxis', hint: 'First find ' + t('\\theta_R') + ' to the <b>' + t('x') + '-axis</b>: ' + t(refTex(a)) + '.' }], missingHint: 'Give all three: one in each of the other quadrants.' },
      'Quadrant ' + ROM[q] + ', so ' + t(refTex(a)) + '. The four angles with this reference angle: ' + [1, 2, 3, 4].map(function (k) { return 'Q' + ROM[k] + ' ' + t(placeTex(k, rf) + (k === 1 ? '' : '=' + dg(place(rf, k)))); }).join('; ') + '. The other three: ' + t(listTex(sols, 0, true)) + '.',
      ['Find the reference angle first.', 'Then place it in each of the other three quadrants: ' + t('\\theta_R') + ', ' + t('180^\\circ-\\theta_R') + ', ' + t('180^\\circ+\\theta_R') + ', ' + t('360^\\circ-\\theta_R') + '.'], 'angles with the same reference angle');
  };
  B.reflect = function (r, cp) {
    var s = find(function () { return { a: r.int(1, 9), b: r.int(1, 9) }; }, function (o) { var al = Math.round(atanD(o.b / o.a)); return o.a !== o.b && al >= 8 && al <= 82 && [30, 45, 60].indexOf(al) < 0 && !(o.a === 3 && o.b === 5) && !(o.a === 2 && o.b === 6) && !(o.a === 8 && o.b === 3); });
    var al = Math.round(atanD(s.b / s.a)), kind = r.pick(['y', 'x', 'o']), qq = { y: 2, x: 4, o: 3 }[kind], ans = place(al, qq);
    var img = kind === 'y' ? [-s.a, s.b] : kind === 'x' ? [s.a, -s.b] : [-s.a, -s.b], wh = { y: 'the ' + t('y') + '-axis', x: 'the ' + t('x') + '-axis', o: 'both axes (through the origin)' }[kind];
    var alts = [2, 3, 4].filter(function (k) { return k !== qq; }).map(function (k) { return { v: place(al, k), code: cp + 'refl-axis', hint: 'The image ' + t('(' + img[0] + ',\\ ' + img[1] + ')') + ' is in Quadrant ' + ROM[qq] + ': ' + t('\\theta=' + placeTex(qq, al)) + '.' }; });
    alts.push({ v: al, code: cp + 'place-ref', hint: 'The image is in Quadrant ' + ROM[qq] + ', not Quadrant I: place the reference angle ' + t(dg(al)) + ' there.' });
    return degPart('The point ' + t('P(' + s.a + ',\\ ' + s.b + ')') + ' is on the terminal arm of an angle of ' + t(dg(al)) + ' (to the nearest degree). ' + t('P') + ' is reflected in ' + wh + '. State the rotation angle, from ' + t('0^\\circ') + ' to ' + t('360^\\circ') + ', whose terminal arm passes through the image.', ans, alts,
      'The image is ' + t('(' + img[0] + ',\\ ' + img[1] + ')') + ', in Quadrant ' + ROM[qq] + '. The reflection keeps the reference angle ' + t(dg(al)) + ', so ' + t('\\theta=' + placeTex(qq, al) + '=' + dg(ans)) + '.' + angleFig({ pt: img, ptLabel: '(' + img[0] + ', ' + img[1] + ')', ref: true, refLabel: dgs(al), width: 170, grid: true }),
      ['Write the image point first: reflecting in the ' + t('y') + '-axis changes the sign of ' + t('x') + ', in the ' + t('x') + '-axis the sign of ' + t('y') + ', in both axes both signs.', 'The reference angle stays ' + t(dg(al)) + ': place it in the image’s quadrant.'], 'angle through a reflected point');
  };
  B.sumAB = function (r, cp) {
    var c = r.pick([[2, 4, 'sum'], [1, 3, 'sum'], [2, 3, 'diff'], [1, 4, 'diff'], [3, 4, 'diff'], [1, 2, 'diff'], [2, 4, 'sum']]);
    var qa = c[0], qb = c[1], x = find(function () { return r.int(8, 82); }, function (v) { return v !== 45 && !(qa === 2 && qb === 4 && v === 70); });
    var A = place(x, qa), Bv = place(x, qb), val = c[2] === 'sum' ? A + Bv : Bv - A, rel = c[2] === 'sum' ? 'A+B=' + dg(val) : 'B-A=' + dg(val);
    function expr(q) { return q === 1 ? 'x' : q === 2 ? '180^\\circ-x' : q === 3 ? '180^\\circ+x' : '360^\\circ-x'; }
    function k0(q) { return q === 1 ? 0 : q === 4 ? 360 : 180; } function s0(q) { return q === 2 || q === 4 ? -1 : 1; }
    var cst = c[2] === 'sum' ? k0(qa) + k0(qb) : k0(qb) - k0(qa), cx = c[2] === 'sum' ? s0(qa) + s0(qb) : s0(qb) - s0(qa);
    var lhs = (cst ? cst + '^\\circ' : '') + (cx === 2 ? '+2x' : cx === -2 ? '-2x' : '');
    var sol = 'Let the reference angle be ' + t('x') + '. Then ' + t('A=' + expr(qa)) + ' and ' + t('B=' + expr(qb)) + '. ' + t((c[2] === 'sum' ? 'A+B' : 'B-A') + '=' + lhs + '=' + dg(val)) + ', so ' + t((cx > 0 ? '2x=' + dg(val) + (cst ? '-' + dg(cst) : '') : '2x=' + dg(cst) + '-' + dg(val)) + '=' + dg(2 * x)) + ' and ' + t('x=' + dg(x)) + '. So ' + t('A=' + dg(A)) + ' and ' + t('B=' + dg(Bv)) + '.';
    var p = fieldsPart('Angle ' + t('A') + ' terminates in Quadrant ' + ROM[qa] + ' and angle ' + t('B') + ' terminates in Quadrant ' + ROM[qb] + '. They have the same reference angle, and ' + t(rel) + '. Determine ' + t('A') + ' and ' + t('B') + '.',
      [degBox(t('A='), A, [{ v: Bv, code: cp + 'ab-swap', hint: 'That is ' + t('B') + ': ' + t('A') + ' is the angle in Quadrant ' + ROM[qa] + '.' }, { v: x, code: cp + 'ab-x', hint: t(dg(x)) + ' is the reference angle. ' + t('A=' + expr(qa)) + '.' }]),
        degBox(t('B='), Bv, [{ v: A, code: cp + 'ab-swap', hint: 'That is ' + t('A') + ': ' + t('B') + ' is the angle in Quadrant ' + ROM[qb] + '.' }, { v: x, code: cp + 'ab-x', hint: t(dg(x)) + ' is the reference angle. ' + t('B=' + expr(qb)) + '.' }])], cp, sol,
      ['Call the reference angle ' + t('x') + ' and write ' + t('A') + ' and ' + t('B') + ' in terms of ' + t('x') + ' (Quadrant II: ' + t('180^\\circ-x') + ', III: ' + t('180^\\circ+x') + ', IV: ' + t('360^\\circ-x') + ').', 'Substitute into the given equation and solve for ' + t('x') + '.'], 'two angles with the same reference angle');
    p.bad.push([String(Bv), String(A)]);
    return p;
  };

  /* ---------- T1 · Lesson 4 (exact angles) ---------- */
  function radCoord(rf, k, q) { // a point at distance 2k (30°/60°) or k√2 (45°) with reference angle rf in quadrant q
    var sx = q === 1 || q === 4 ? 1 : -1, sy = q <= 2 ? 1 : -1;
    if (rf === 45) return [qty(sx * k), qty(sy * k)];
    return rf === 30 ? [qty(sx * k, 3), qty(sy * k)] : [qty(sx * k), qty(sy * k, 3)];
  }
  function ptTex(p) { return '\\left(' + qtex(p[0]) + ',\\ ' + qtex(p[1]) + '\\right)'; }
  B.exactAngle = function (r, cp) {
    var s = find(function () { return { rf: r.pick([30, 45, 60, 30, 60]), q: r.pick([2, 3, 4, 2, 3, 4, 1]), k: r.int(1, 9) }; }, function (o) { return !(o.rf === 60 && o.q === 2 && o.k === 5) && !(o.rf === 45 && o.k > 8) && !(o.rf === 30 && o.q === 3 && o.k === 2); });
    var pt = radCoord(s.rf, s.k, s.q), a = place(s.rf, s.q), oth = s.rf === 30 ? 60 : s.rf === 60 ? 30 : null;
    var alts = [{ v: s.rf, code: cp + 'place-ref', hint: t(dg(s.rf)) + ' is the reference angle; the point is in Quadrant ' + ROM[s.q] + '.' }];
    if (oth) alts.push({ v: place(oth, s.q), code: cp + 'ex-ang-ref', hint: 'Check the reference angle: ' + t('\\tan\\theta_R=\\frac{|y|}{|x|}=' + stex(qratio(qty(Math.abs(pt[1].c), pt[1].m), qty(Math.abs(pt[0].c), pt[0].m)))) + ', and ' + t('\\tan ' + dg(s.rf) + '=' + stex(qratio(qty(Math.abs(pt[1].c), pt[1].m), qty(Math.abs(pt[0].c), pt[0].m)))) + '.' });
    [1, 2, 3, 4].forEach(function (k) { if (k !== s.q && k !== 1) alts.push({ v: place(s.rf, k), code: cp + 'place', hint: 'The point ' + t(ptTex(pt)) + ' is in Quadrant ' + ROM[s.q] + ' (look at the signs of ' + t('x') + ' and ' + t('y') + ').' }); });
    var tn = qratio(pt[1], pt[0]);
    return degPart('The point ' + t(ptTex(pt)) + ' is on the terminal arm of an angle ' + t('\\theta') + ' in standard position. Determine ' + t('\\theta') + ' exactly, ' + t('0^\\circ\\le\\theta<360^\\circ') + '.', a, alts,
      'Quadrant ' + ROM[s.q] + ' (' + t('x' + (pt[0].c > 0 ? '>' : '<') + '0') + ', ' + t('y' + (pt[1].c > 0 ? '>' : '<') + '0') + '). ' + t('\\tan\\theta=\\frac{y}{x}=' + rawFrac(pt[1], pt[0]) + '=' + stex(tn)) + ', and ' + t('\\tan ' + dg(s.rf) + '=' + stex(spec(Math.abs(tn.p), tn.q, tn.m))) + ', so ' + t('\\theta_R=' + dg(s.rf)) + '. ' + t('\\theta=' + placeTex(s.q, s.rf) + (s.q === 1 ? '' : '=' + dg(a))) + '.',
      ['Find the quadrant from the signs, then ' + t('\\tan\\theta_R=\\frac{|y|}{|x|}') + '.', 'Special values: ' + t('\\tan 30^\\circ=\\frac{\\sqrt{3}}{3}') + ', ' + t('\\tan 45^\\circ=1') + ', ' + t('\\tan 60^\\circ=\\sqrt{3}') + '.'], 'exact angle from a point');
  };
  B.rotate = function (r, cp) {
    var s = find(function () {
      var fam = r.chance(0.7) ? 'r3' : 'r2', refs = fam === 'r3' ? [30, 60] : [45];
      var a1 = place(r.pick(refs), r.int(1, 4)), a2 = place(r.pick(refs), r.int(1, 4));
      return { fam: fam, a1: a1, a2: a2, k: fam === 'r3' ? r.int(1, 4) : r.int(2, 7) };
    }, function (o) { var d = norm(o.a2 - o.a1); return d > 0 && d !== 180 && !(o.a1 === 60 && o.a2 === 330) && !(o.a1 === 150 && o.a2 === 300); });
    function pt(a) { return radCoord(refOf(a), s.k, quad(a)); }
    var P1 = pt(s.a1), P2 = pt(s.a2), d = norm(s.a2 - s.a1), R = s.fam === 'r3' ? String(2 * s.k) : s.k + '\\sqrt{2}';
    var alts = [{ v: 360 - d, code: cp + 'rot-dir', hint: 'That is the clockwise rotation. Counterclockwise from ' + t('P') + ' to ' + t('Q') + ': ' + t(dg(s.a2) + '-' + dg(s.a1)) + (s.a2 < s.a1 ? ' (add ' + t('360^\\circ') + ' if it is negative)' : '') + '.' },
      { v: s.a2, code: cp + 'rot-one', hint: t(dg(s.a2)) + ' is the angle of ' + t('Q') + ' alone. Find the angle of ' + t('P') + ' too, and subtract.' }, { v: s.a1, code: cp + 'rot-one', hint: 'That is the angle of ' + t('P') + '. Find the angle of ' + t('Q') + ' too, and subtract.' }];
    function line(nm, p, a) { var tn = qratio(p[1], p[0]); return t(nm) + ': Quadrant ' + ROM[quad(a)] + ', ' + t('\\tan\\theta=' + stex(tn)) + ', ' + t('\\theta_R=' + dg(refOf(a))) + ', angle ' + t(dg(a)) + '.'; }
    return degPart('A point moves counterclockwise around a circle centred at the origin, from ' + t('P' + ptTex(P1)) + ' to ' + t('Q' + ptTex(P2)) + '. Determine exactly the angle through which it rotates.', d, alts,
      line('P', P1, s.a1) + ' ' + line('Q', P2, s.a2) + ' Rotation: ' + t(dg(s.a2) + '-' + dg(s.a1) + (s.a2 < s.a1 ? '+' + dg(360) : '') + '=' + dg(d)) + ' (the circle has radius ' + t(R) + ').',
      ['Find the angle in standard position of each point (quadrant, then ' + t('\\tan\\theta_R=\\frac{|y|}{|x|}') + ').', 'Counterclockwise from ' + t('P') + ' to ' + t('Q') + ': subtract (add ' + t('360^\\circ') + ' if the result is negative).'], 'rotation between two points');
  };

  /* ---------- T2 · Lesson 2 (a point on the terminal arm) ---------- */
  var TRIP = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41], [12, 35, 37], [6, 8, 10], [28, 45, 53], [11, 60, 61], [33, 56, 65], [16, 63, 65]];
  var AVOID_PT = ['-20,21', '4,-6', '-3,-3', '7,24', '-9,40', '-5,-12', '6,-3', '-12,-5', '-7,24', '9,-12', '-2,-10', '5,5', '-1,3', '40,9', '-21,20', '12,-35', '-3,-6', '2,-3', '-1,1', '-18,24', '4,-7', '-20,-21', '-8,-6', '5,2', '-4,5', '-6,-1', '3,-5', '7,3', '-4,9', '-5,-8', '6,-11', '-2,5', '-10,24', '3,-3', '-1,-7', '35,12', '-16,-30', '4,-2', '2,5', '-8,3', '-1,-4', '10,-7', '30,-16', '-7,3', '-3,-4', '-2,-6', '-7,7', '-1,-3', '-4,-9', '12,-5', '3,4', '-3,4', '5,12'];
  /* a point on the terminal arm: o = { quads, triple (true | false | null = either), noEqual } */
  B.ptShared = function (r, o) {
    o = o || {};
    return find(function () {
      var q = r.pick(o.quads || [2, 3, 4]), sx = q === 1 || q === 4 ? 1 : -1, sy = q <= 2 ? 1 : -1, x, y;
      var trip = o.triple == null ? r.chance(0.55) : o.triple;
      if (trip) { var T = r.pick(TRIP), sw = r.chance(0.5); x = sw ? T[1] : T[0]; y = sw ? T[0] : T[1]; }
      else { x = r.int(1, 9); y = r.int(1, 9); }
      return { x: sx * x, y: sy * y, q: q, trip: trip };
    }, function (s) { var N = s.x * s.x + s.y * s.y; return AVOID_PT.indexOf(s.x + ',' + s.y) < 0 && (s.trip || !isSq(N)) && Math.abs(s.x) !== Math.abs(s.y) && N <= 4500; });
  };
  function rOf(s) { return qroot(s.x * s.x + s.y * s.y, 1); }
  function ptStem(s) { return 'The point ' + t('P(' + s.x + ',\\ ' + s.y + ')') + ' is on the terminal arm of an angle ' + t('\\theta') + ' in standard position.'; }
  function rLine(s) { var N = s.x * s.x + s.y * s.y, R = rOf(s); return t('r=\\sqrt{' + (s.x < 0 ? '(' + s.x + ')' : s.x) + '^{2}+' + (s.y < 0 ? '(' + s.y + ')' : s.y) + '^{2}}=\\sqrt{' + N + '}' + (R.m === 1 ? '=' + R.c : R.c > 1 ? '=' + qtex(R) : '')); }
  B.rDist = function (r, cp, s) {
    s = s || B.ptShared(r, { quads: [2, 3, 4], triple: r.chance(0.4) });
    var N = s.x * s.x + s.y * s.y, R = rOf(s), want = spec(R.c, 1, R.m);
    var alts = [{ v: N, code: cp + 'r-noroot', hint: t('x^{2}+y^{2}=r^{2}') + ': take the square root to get ' + t('r') + '.' }, { v: Math.abs(s.x) + Math.abs(s.y), code: cp + 'r-sum', hint: t('r') + ' is the hypotenuse of the reference triangle: ' + t('r=\\sqrt{x^{2}+y^{2}}') + '.' }];
    if (s.x * s.x !== s.y * s.y) alts.push({ v: Math.sqrt(Math.abs(s.x * s.x - s.y * s.y)), code: cp + 'r-sub', hint: 'Add the squares: ' + t('r^{2}=x^{2}+y^{2}') + ' (a negative coordinate squared is positive).' });
    return exactPart((s.given ? '' : ptStem(s) + ' ') + 'Determine the exact distance ' + t('r') + ' from the origin to ' + t('P') + '. Write a radical in simplest form.', want, cp, { alts: alts, ansPre: 'r=', before: t('r=') }, rLine(s) + '.' + (s.given ? '' : angleFig({ pt: [s.x, s.y], ptLabel: 'P(' + s.x + ', ' + s.y + ')', ref: false, width: 170 })),
      [t('r=\\sqrt{x^{2}+y^{2}}') + ' (it is a distance, so ' + t('r>0') + ').', 'Simplify the radical: take out the largest perfect-square factor.'], 'r from a point');
  };
  function ratioAlts(s, fn, cp) {
    var R = rOf(s), X = qty(s.x), Y = qty(s.y), out = [];
    if (fn === 'sin') { out.push({ s: qratio(X, R), code: cp + 'xy', hint: t('\\sin\\theta=\\frac{y}{r}') + ' (you used ' + t('x') + ').' }); out.push({ s: qratio(Y, X), code: cp + 'r-ratio', hint: t('\\sin\\theta=\\frac{y}{r}') + ', not ' + t('\\frac{y}{x}') + '.' }); }
    if (fn === 'cos') { out.push({ s: qratio(Y, R), code: cp + 'xy', hint: t('\\cos\\theta=\\frac{x}{r}') + ' (you used ' + t('y') + ').' }); out.push({ s: qratio(X, Y), code: cp + 'tan-flip', hint: t('\\cos\\theta=\\frac{x}{r}') + '.' }); }
    if (fn === 'tan') { out.push({ s: qratio(X, Y), code: cp + 'tan-flip', hint: t('\\tan\\theta=\\frac{y}{x}') + ' (not ' + t('\\frac{x}{y}') + ').' }); out.push({ s: qratio(Y, R), code: cp + 'r-ratio', hint: t('\\tan\\theta=\\frac{y}{x}') + ': no ' + t('r') + ' in a tangent.' }); }
    return out;
  }
  function ratioSpec(s, fn) { var R = rOf(s), X = qty(s.x), Y = qty(s.y); return fn === 'sin' ? qratio(Y, R) : fn === 'cos' ? qratio(X, R) : qratio(Y, X); }
  function ratioLine(s, fn) { var R = rOf(s), X = qty(s.x), Y = qty(s.y), w = ratioSpec(s, fn), raw = fn === 'sin' ? rawFrac(Y, R) : fn === 'cos' ? rawFrac(X, R) : rawFrac(Y, X); return t('\\' + fn + '\\theta=' + (fn === 'sin' ? '\\frac{y}{r}' : fn === 'cos' ? '\\frac{x}{r}' : '\\frac{y}{x}') + '=' + raw + (raw === stex(w) ? '' : '=' + stex(w))); }
  B.oneRatio = function (r, cp, s, o) {
    var fn = (o && o.fn) || r.pick(['sin', 'cos']);
    return exactPart('Determine the exact value of ' + t('\\' + fn + '\\theta') + ', with a rational denominator.', ratioSpec(s, fn), cp, { altSpecs: ratioAlts(s, fn, cp), ansPre: '\\' + fn + '\\theta=', before: t('\\' + fn + '\\theta=') },
      rLine(s) + '. ' + ratioLine(s, fn) + '.' + (rOf(s).m > 1 ? ' (Rationalized: multiply the top and bottom by ' + t('\\sqrt{' + rOf(s).m + '}') + '.)' : ''),
      [t('\\sin\\theta=\\frac{y}{r}') + ', ' + t('\\cos\\theta=\\frac{x}{r}') + ', ' + t('\\tan\\theta=\\frac{y}{x}') + '; ' + t('r') + ' is always positive.', 'Keep the sign of the coordinate; rationalize a radical denominator.'], 'an exact ratio from a point');
  };
  B.ratios = function (r, cp, s) {
    s = s || B.ptShared(r);
    var boxes = ['sin', 'cos', 'tan'].map(function (fn) { return exactBox(t('\\' + fn + '\\theta='), ratioSpec(s, fn), cp, { altSpecs: ratioAlts(s, fn, cp).concat([{ s: sneg(ratioSpec(s, fn)), code: cp + 'sign', hint: 'Check the sign: in Quadrant ' + ROM[s.q] + ', ' + castWhy(s.q) + '.' }]) }); });
    return fieldsPart((s.given ? '' : ptStem(s) + ' ') + 'Determine the exact values of ' + t('\\sin\\theta') + ', ' + t('\\cos\\theta') + ' and ' + t('\\tan\\theta') + ', with rational denominators.', boxes, cp,
      rLine(s) + '.<br>' + ['sin', 'cos', 'tan'].map(function (fn) { return ratioLine(s, fn); }).join('<br>') + '<br>Quadrant ' + ROM[s.q] + ': ' + castWhy(s.q) + '.' + angleFig({ pt: [s.x, s.y], ptLabel: 'P(' + s.x + ', ' + s.y + ')', ref: true, width: 170 }),
      ['Find ' + t('r=\\sqrt{x^{2}+y^{2}}') + ' first.', t('\\sin\\theta=\\frac{y}{r}') + ', ' + t('\\cos\\theta=\\frac{x}{r}') + ', ' + t('\\tan\\theta=\\frac{y}{x}') + ', with the signs of ' + t('x') + ' and ' + t('y') + '.'], 'the three ratios from a point');
  };
  B.thetaPt = function (r, cp, s) {
    s = s || B.ptShared(r);
    var rf = atanD(Math.abs(s.y) / Math.abs(s.x)), th = place(rf, s.q), raw = atanD(s.y / s.x);
    var alts = [{ v: raw, code: cp + 'theta-raw', hint: t('\\tan^{-1}\\left(\\frac{y}{x}\\right)') + ' with the signs left in only gives angles from ' + t('-90^\\circ') + ' to ' + t('90^\\circ') + '. Find ' + t('\\theta_R=\\tan^{-1}\\frac{|y|}{|x|}') + ', then place it in Quadrant ' + ROM[s.q] + '.' },
      { v: rf, code: cp + 'theta-ref', hint: 'That is the reference angle. ' + t('P') + ' is in Quadrant ' + ROM[s.q] + ': ' + t('\\theta=' + placeRule(s.q)) + '.' },
      { v: raw + 180, code: cp + 'theta-quad', hint: 'Check the quadrant of ' + t('P') + ' (signs of ' + t('x') + ' and ' + t('y') + ').' }, { v: raw + 360, code: cp + 'theta-quad', hint: 'Check the quadrant of ' + t('P') + '.' }];
    [1, 2, 3, 4].forEach(function (k) { if (k !== s.q && k !== 1) alts.push({ v: place(rf, k), code: cp + 'theta-quad', hint: t('P(' + s.x + ',\\ ' + s.y + ')') + ' is in Quadrant ' + ROM[s.q] + ': ' + t('\\theta=' + placeRule(s.q)) + '.' }); });
    alts.push({ v: place(Math.atan(Math.abs(s.y) / Math.abs(s.x)), s.q), code: cp + 'radian', hint: 'Your calculator is in <b>radian</b> mode. Switch it to <b>degree</b> mode and redo it.' });
    var rS = fx(rf, 1);
    return nearPart((s.given ? '' : ptStem(s) + ' ') + 'Determine ' + t('\\theta') + ', ' + t('0^\\circ\\le\\theta<360^\\circ') + ', to the nearest tenth of a degree.', th, 1, { unit: '°', alts: alts, before: t('\\theta\\approx'), also: [place(rd(rf, 1), s.q)], ansPre: '\\theta\\approx ' },
      'Quadrant ' + ROM[s.q] + '. ' + t('\\theta_R=\\tan^{-1}\\left(\\frac{' + Math.abs(s.y) + '}{' + Math.abs(s.x) + '}\\right)\\approx ' + dg(rS)) + ', so ' + t('\\theta' + (s.q === 1 ? '\\approx ' + dg(fx(th, 1)) : '=' + placeTex(s.q, rS) + '\\approx ' + dg(fx(th, 1)))) + '.' + angleFig({ pt: [s.x, s.y], ptLabel: 'P(' + s.x + ', ' + s.y + ')', ref: true, refLabel: 'θR', width: 170 }),
      ['Plot ' + t('P') + ' and find its quadrant.', t('\\theta_R=\\tan^{-1}\\left(\\frac{|y|}{|x|}\\right)') + ' (Degree mode), then place it: II ' + t('180^\\circ-\\theta_R') + ', III ' + t('180^\\circ+\\theta_R') + ', IV ' + t('360^\\circ-\\theta_R') + '.'], 'θ from a point');
  };
  B.kFind = function (r, cp) {
    var s = find(function () {
      var T = r.pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41], [12, 35, 37], [6, 8, 10]]), sw = r.chance(0.5), q = r.pick([2, 3, 4]), unk = r.pick(['x', 'y']);
      var X = (q === 1 || q === 4 ? 1 : -1) * (sw ? T[1] : T[0]), Y = (q <= 2 ? 1 : -1) * (sw ? T[0] : T[1]);
      return { X: X, Y: Y, R: T[2], q: q, unk: unk };
    }, function (o) { return !(o.R === 5 && o.Y === 4 && o.q === 2); });
    var kv = s.unk === 'x' ? s.X : s.Y, known = s.unk === 'x' ? s.Y : s.X, ptT = s.unk === 'x' ? '(k,\\ ' + s.Y + ')' : '(' + s.X + ',\\ k)';
    var rf = atanD(Math.abs(s.Y) / Math.abs(s.X)), th = place(rf, s.q);
    var kbox = intBox(t('k='), kv, [{ v: -kv, code: cp + 'k-sign', hint: 'In Quadrant ' + ROM[s.q] + ', ' + t(s.unk) + ' is ' + (kv > 0 ? 'positive' : 'negative') + ', so ' + t('k=' + kv) + ' (not ' + t(-kv) + ').' }]);
    var tAlts = [{ v: rf, code: cp + 'theta-ref', hint: 'That is the reference angle; place it in Quadrant ' + ROM[s.q] + '.' }];
    [2, 3, 4].forEach(function (k) { if (k !== s.q) tAlts.push({ v: place(rf, k), code: cp + 'theta-quad', hint: 'The angle is in Quadrant ' + ROM[s.q] + ': ' + t('\\theta=' + placeRule(s.q)) + '.' }); });
    var tbox = nearBox(t('\\theta\\approx'), th, 1, tAlts, '°', [place(rd(rf, 1), s.q)]);
    var sol = t('k^{2}+' + (known < 0 ? '(' + known + ')' : known) + '^{2}=' + s.R + '^{2}') + ', so ' + t('k^{2}=' + (s.R * s.R) + '-' + (known * known) + '=' + (kv * kv)) + ' and ' + t('k=\\pm' + Math.abs(kv)) + '. In Quadrant ' + ROM[s.q] + ', ' + t(s.unk + (kv > 0 ? '>0' : '<0')) + ', so ' + t('k=' + kv) + '. ' + t('\\theta_R=\\tan^{-1}\\left(\\frac{' + Math.abs(s.Y) + '}{' + Math.abs(s.X) + '}\\right)\\approx ' + dg(fx(rf, 1))) + ', ' + t('\\theta=' + placeTex(s.q, fx(rf, 1)) + '\\approx ' + dg(fx(th, 1))) + '.';
    var p = fieldsPart('The point ' + t(ptT) + ' is on the terminal arm of an angle ' + t('\\theta') + ' in standard position, where ' + t('r=' + s.R) + ' and ' + t('\\theta') + ' terminates in Quadrant ' + ROM[s.q] + '. Determine ' + t('k') + ', and ' + t('\\theta') + ' to the nearest tenth of a degree.', [kbox, tbox], cp, sol,
      [t('x^{2}+y^{2}=r^{2}') + ' gives ' + t('k^{2}') + ', so two values ' + t('\\pm') + ': keep the one with the right sign for Quadrant ' + ROM[s.q] + '.', 'Then ' + t('\\theta_R=\\tan^{-1}\\left(\\frac{|y|}{|x|}\\right)') + ' and place it in the quadrant.'], 'a missing coordinate from r');
    return p;
  };
  B.quadrantal = function (r, cp) {
    var c = r.pick([[0, 1, 90], [-1, 0, 180], [0, -1, 270], [1, 0, 0]]), k = r.pick([2, 3, 4, 5, 6, 7, 8, 9, 1.5, 2.5, 3.5]), x = c[0] * k, y = c[1] * k, th = c[2] === 0 ? 0 : c[2];
    var vals = { sin: exact('sin', th), cos: exact('cos', th), tan: exact('tan', th) };
    var boxes = [degBox(t('\\theta='), th === 0 ? 360 : th, []), exactBox(t('\\sin\\theta='), vals.sin, cp, { undef: true }), exactBox(t('\\cos\\theta='), vals.cos, cp, { undef: true }), exactBox(t('\\tan\\theta='), vals.tan, cp, { undef: true, altSpecs: vals.tan === 'undef' ? [{ s: spec(0), code: cp + 'undef-zero', hint: t('\\frac{y}{0}') + ' is undefined, not ' + t('0') + '.' }] : [] })];
    if (th === 0) { boxes[0] = { label: t('\\theta='), after: '°', check: function (resp) { var v = degNum(resp); if (v === 0 || v === 360) return ok(); return v == null ? form('notnumber', 'Enter an angle in degrees.') : wrong('value', null); }, key: '0', show: t('0^\\circ') + ' (or ' + t('360^\\circ') + ')', bad: ['90', '180'] }; }
    var xs = String(x), ys = String(y);
    return fieldsPart('The point ' + t('(' + xs + ',\\ ' + ys + ')') + ' is on the terminal arm of a quadrantal angle ' + t('\\theta') + ', ' + t('0^\\circ\\le\\theta<360^\\circ') + '. State ' + t('\\theta') + ' and the values of ' + t('\\sin\\theta') + ', ' + t('\\cos\\theta') + ' and ' + t('\\tan\\theta') + '.', boxes, cp,
      'The point is on the ' + (c[0] ? (c[0] > 0 ? 'positive' : 'negative') + ' ' + t('x') : (c[1] > 0 ? 'positive' : 'negative') + ' ' + t('y')) + '-axis, so ' + t('\\theta=' + dg(th)) + ' and ' + t('r=' + k) + '. ' + t('\\sin\\theta=\\frac{' + ys + '}{' + k + '}=' + stex(vals.sin)) + ', ' + t('\\cos\\theta=\\frac{' + xs + '}{' + k + '}=' + stex(vals.cos)) + ', ' + t('\\tan\\theta=\\frac{' + ys + '}{' + xs + '}') + (vals.tan === 'undef' ? ' is undefined (' + t('x=0') + ').' : t('=' + stex(vals.tan)) + '.'),
      ['On an axis one coordinate is ' + t('0') + ', and ' + t('r') + ' is the other one’s size.', 'Dividing by ' + t('0') + ' is undefined.'], 'quadrantal angle');
  };

  /* ---------- T2 · Lesson 3 (CAST) ---------- */
  B.quadSigns = function (r, cp) {
    var q = r.int(1, 4), fns = r.shuffle(['sin', 'cos', 'tan']).slice(0, 2);
    var cond = fns.map(function (fn) { return '\\' + fn + '\\theta' + (sgn(fn, q) > 0 ? '>0' : '<0'); });
    var opts = [1, 2, 3, 4].map(function (k) { return { html: 'Quadrant ' + ROM[k], right: k === q, code: 'q' + k, why: k === q ? null : 'In Quadrant ' + ROM[k] + ', ' + castWhy(k) + ': check both conditions.' }; });
    return mcPart(r, 'In which quadrant does the terminal arm of ' + t('\\theta') + ' lie if ' + t(cond[0]) + ' and ' + t(cond[1]) + '?', opts,
      fns.map(function (fn) { var qs = quadsFor(fn, sgn(fn, q)); return t(cond[fns.indexOf(fn)]) + ': Quadrants ' + quadsTex(qs); }).join('; ') + '. Both are true only in Quadrant ' + ROM[q] + ' (' + castWhy(q) + ').',
      ['CAST: from Quadrant I counterclockwise, All, Sine, Tangent, Cosine are positive.', 'Find the quadrants for each condition and take the one they share.'], 'quadrant from the signs', true);
  };
  B.otherAngle = function (r, cp) {
    var fn = r.pick(['sin', 'cos', 'tan']), q = r.int(1, 4), a = angleIn(r, q, AVOID_ANG), rf = refOf(a), s = sgn(fn, q), qs = quadsFor(fn, s), q2 = qs[0] === q ? qs[1] : qs[0], b = place(rf, q2);
    var alts = [{ v: a, code: cp + 'other-same', hint: 'That is the given angle. The question asks for the <b>other</b> angle with the same ' + fn + '.' }];
    [1, 2, 3, 4].forEach(function (k) { if (k !== q && k !== q2) alts.push({ v: place(rf, k), code: cp + 'other-quad', hint: t('\\' + fn + ' ' + dg(a)) + ' is ' + (s > 0 ? 'positive' : 'negative') + ', and ' + fn + ' is ' + (s > 0 ? 'positive' : 'negative') + ' in Quadrants ' + quadsTex(qs) + ': the other angle is in Quadrant ' + ROM[q2] + '.' }); });
    alts.push({ v: rf, code: cp + 'place-ref', hint: t(dg(rf)) + ' is the reference angle. Place it in Quadrant ' + ROM[q2] + '.' });
    return degPart('Determine the other angle ' + t('\\theta') + ', ' + t('0^\\circ\\le\\theta<360^\\circ') + ', with ' + t('\\' + fn + '\\theta=\\' + fn + ' ' + dg(a)) + '.', b, alts.filter(function (x) { return x.v !== b; }),
      t(dg(a)) + ' is in Quadrant ' + ROM[q] + ' with ' + t(refTex(a)) + '; ' + fn + ' is ' + (s > 0 ? 'positive' : 'negative') + ' there. ' + fn + ' is ' + (s > 0 ? 'positive' : 'negative') + ' in Quadrants ' + quadsTex(qs) + ', so the other angle is in Quadrant ' + ROM[q2] + ': ' + t('\\theta=' + placeTex(q2, rf) + (q2 === 1 ? '' : '=' + dg(b))) + '.',
      ['Same reference angle, and the other quadrant where ' + fn + ' has the same sign (CAST).'], 'the other angle with the same ratio');
  };
  /* the other two ratios from one: o = { rad: a radical in the given ratio (L3 #7) } */
  B.otherRatios = function (r, cp, s0, o) {
    o = o || {};
    var s = find(function () {
      var q = r.int(1, 4), sx = q === 1 || q === 4 ? 1 : -1, sy = q <= 2 ? 1 : -1, fn = r.pick(o.rad ? ['sin', 'cos'] : ['sin', 'cos', 'tan']), X, Y, R;
      if (o.rad) { // fn = √a / b (a not a square), the third coordinate a radical too (or a whole number)
        var bb = r.int(3, 9), aa = r.int(2, bb * bb - 1);
        if (isSq(aa) || gcd(qroot(aa, 1).c, bb) > 1) return null;
        var rest = bb * bb - aa, A = qroot(aa, 1), C = isSq(rest) ? qty(Math.round(Math.sqrt(rest))) : qroot(rest, 1);
        if (fn === 'sin') { Y = qty(sy * A.c, A.m); X = qty(sx * C.c, C.m); } else { X = qty(sx * A.c, A.m); Y = qty(sy * C.c, C.m); }
        R = qty(bb);
      } else if (r.chance(0.8)) { var T = r.pick(TRIP.slice(0, 7)), sw = r.chance(0.5); X = qty(sx * (sw ? T[1] : T[0])); Y = qty(sy * (sw ? T[0] : T[1])); R = qty(T[2]); }
      else { var bx = r.int(1, 9), by = r.int(1, 9), N = bx * bx + by * by; if (isSq(N)) return null; X = qty(sx * bx); Y = qty(sy * by); R = qroot(N, 1); if (fn !== 'tan') fn = 'tan'; }
      return { q: q, fn: fn, X: X, Y: Y, R: R };
    }, function (s) { return s.R.m === 1 || s.fn === 'tan'; });
    var giv = s.fn === 'sin' ? qratio(s.Y, s.R) : s.fn === 'cos' ? qratio(s.X, s.R) : qratio(s.Y, s.X);
    var cond, useInt = r.chance(0.35);
    var other = ['sin', 'cos', 'tan'].filter(function (f) { return f !== s.fn; }), givS = sgn(s.fn, s.q), qs = quadsFor(s.fn, givS);
    var cf = other.filter(function (f) { return qs.some(function (k) { return sgn(f, k) !== sgn(f, s.q); }); })[0] || other[0];
    if (useInt) cond = s.q === 1 ? '0^\\circ<\\theta<90^\\circ' : s.q === 2 ? '90^\\circ<\\theta<180^\\circ' : s.q === 3 ? '180^\\circ<\\theta<270^\\circ' : '270^\\circ<\\theta<360^\\circ';
    else cond = '\\' + cf + '\\theta' + (sgn(cf, s.q) > 0 ? '>0' : '<0');
    var asked = other, want = { sin: qratio(s.Y, s.R), cos: qratio(s.X, s.R), tan: qratio(s.Y, s.X) };
    var missing = s.fn === 'sin' ? 'x' : s.fn === 'cos' ? 'y' : 'r', mq = missing === 'x' ? s.X : missing === 'y' ? s.Y : s.R;
    var flipS = { x: { c: -s.X.c, m: s.X.m }, y: { c: -s.Y.c, m: s.Y.m } };
    var boxes = asked.map(function (f) {
      var alts = [];
      if (missing !== 'r') { var X2 = missing === 'x' ? flipS.x : s.X, Y2 = missing === 'y' ? flipS.y : s.Y; var w2 = f === 'sin' ? qratio(Y2, s.R) : f === 'cos' ? qratio(X2, s.R) : qratio(Y2, X2); if (sval(w2) !== sval(want[f])) alts.push({ s: w2, code: cp + 'sign', hint: 'Check the sign of ' + t(missing) + ': in Quadrant ' + ROM[s.q] + ', ' + t(missing + (mq.c > 0 ? '>0' : '<0')) + '.' }); }
      if (f === 'tan') alts.push({ s: qratio(s.X, s.Y), code: cp + 'tan-flip', hint: t('\\tan\\theta=\\frac{y}{x}') + '.' });
      if (f === 'sin') alts.push({ s: qratio(s.X, s.R), code: cp + 'xy', hint: t('\\sin\\theta=\\frac{y}{r}') + '.' });
      if (f === 'cos') alts.push({ s: qratio(s.Y, s.R), code: cp + 'xy', hint: t('\\cos\\theta=\\frac{x}{r}') + '.' });
      alts.push({ s: sneg(want[f]), code: cp + 'sign', hint: 'Check the sign with CAST: in Quadrant ' + ROM[s.q] + ', ' + castWhy(s.q) + '.' });
      return exactBox(t('\\' + f + '\\theta='), want[f], cp, { altSpecs: alts });
    });
    var giveTex = s.fn === 'sin' ? '\\frac{y}{r}=' + rawFrac(s.Y, s.R) : s.fn === 'cos' ? '\\frac{x}{r}=' + rawFrac(s.X, s.R) : '\\frac{y}{x}=' + rawFrac(s.Y, s.X);
    var known = s.fn === 'sin' ? [['y', s.Y], ['r', s.R]] : s.fn === 'cos' ? [['x', s.X], ['r', s.R]] : [['x', s.X], ['y', s.Y]];
    var findL = missing === 'r' ? t('r=\\sqrt{x^{2}+y^{2}}=\\sqrt{' + qsq(s.X) + '+' + qsq(s.Y) + '}=' + qtex(s.R)) : t(missing + '^{2}=r^{2}-' + (missing === 'x' ? 'y' : 'x') + '^{2}=' + qsq(s.R) + '-' + qsq(missing === 'x' ? s.Y : s.X) + '=' + qsq(mq)) + ', so ' + t(missing + '=' + qtex(mq)) + ' (' + (mq.c > 0 ? 'positive' : 'negative') + ' in Quadrant ' + ROM[s.q] + ')';
    var sol = t('\\' + s.fn + '\\theta') + ' is ' + (givS > 0 ? 'positive' : 'negative') + ' and ' + t(cond) + ': Quadrant ' + ROM[s.q] + '. ' + t('\\' + s.fn + '\\theta=' + giveTex) + ': ' + known.map(function (k) { return t(k[0] + '=' + qtex(k[1])); }).join(', ') + '. ' + findL + '.<br>' + asked.map(function (f) { var raw = f === 'sin' ? rawFrac(s.Y, s.R) : f === 'cos' ? rawFrac(s.X, s.R) : rawFrac(s.Y, s.X); return t('\\' + f + '\\theta=' + raw + (raw === stex(want[f]) ? '' : '=' + stex(want[f]))); }).join(', ') + '.';
    return fieldsPart('Given ' + t('\\' + s.fn + '\\theta=' + stex(giv)) + ' and ' + t(cond) + ', determine the exact values of ' + t('\\' + asked[0] + '\\theta') + ' and ' + t('\\' + asked[1] + '\\theta') + ', with rational denominators.', boxes, cp, sol,
      ['Use the signs (CAST) to find the quadrant; ' + t('r') + ' is always positive.', 'Read two of ' + t('x') + ', ' + t('y') + ', ' + t('r') + ' from the given ratio, find the third with ' + t('x^{2}+y^{2}=r^{2}') + ', and give it the sign for that quadrant.'], 'the other ratios from one');
  };
  function decT(v) { return F(String(v)); }
  /* fn θ = a to the tenth (a two-decimal value) */
  B.solveCalc = function (r, cp) {
    var fn = r.pick(['sin', 'cos', 'tan']), a = find(function () { var v = fn === 'tan' ? r.int(15, 650) / 100 : r.int(8, 96) / 100; return (r.chance(0.55) ? -1 : 1) * v; }, function (v) { return [0.42, -0.73, 0.8, 0.35, -0.27, -0.91, -0.6, 0.24, -0.64, 0.215, 0.9, -0.15, 0.55, 0.7].indexOf(v) < 0 && Math.abs(v) !== 0.5; });
    return solveFor(r, cp, fn, a, decT(a), null, 'Solve ' + t('\\' + fn + '\\theta=' + decT(a)) + ' for ' + t('0^\\circ\\le\\theta<360^\\circ') + ', to the nearest tenth of a degree.');
  };
  function solveFor(r, cp, fn, a, aTex, intv, prompt, pre, extraAlts) {
    var none = fn !== 'tan' && Math.abs(a) > 1 + 1e-12, rf = none ? null : (fn === 'sin' ? asinD : fn === 'cos' ? acosD : atanD)(Math.abs(a));
    var s = a > 0 ? 1 : -1, quads = none ? [] : quadsFor(fn, s), all = none ? [] : quads.map(function (q) { return place(rf, q); }).sort(function (x, y) { return x - y; });
    var sols = intv ? all.filter(function (v) { return v >= intv[0] - 1e-9 && (intv[2] ? v <= intv[1] + 1e-9 : v < intv[1] - 1e-9); }) : all;
    var lines = (pre || []).slice();
    if (none) lines.push(t(aTex + (a > 1 ? '>1' : '<-1')) + ', and ' + (fn === 'sin' ? 'sine' : 'cosine') + ' is never ' + (a > 1 ? 'greater than ' + t('1') : 'less than ' + t('-1')) + '. <b>No solution.</b>');
    else {
      var absT = aTex.replace(/^-/, ''), rS = fx(rf, 2);
      lines.push((s > 0 ? 'Positive' : 'Negative') + ' ' + fn + ': Quadrants ' + quadsTex(quads) + '. ' + t('\\theta_R=\\' + fn + '^{-1}\\left(' + absT + '\\right)\\approx ' + dg(rS)) + '.');
      lines.push(quads.map(function (q) { return ROM[q] + ': ' + t('\\theta\\approx ' + (q === 1 ? '' : placeTex(q, rS) + '\\approx ') + dg(fx(place(rf, q), 1))); }).join(' &nbsp; '));
      if (intv) lines.push('In ' + t(intv[3]) + ': ' + (sols.length ? t(listTex(sols, 1)) : 'none') + '.');
    }
    var altSets = (extraAlts || []).slice();
    if (!none && intv) altSets.push({ sols: all, code: cp + 'interval', hint: 'Keep only the solutions in ' + t(intv[3]) + '.' });
    return listPart(prompt, sols, cp, { dp: 1, fn: fn, ref: rf, quads: quads, all: intv ? all : null, interval: intv ? intv[3] : null, altSets: altSets, also: none ? [] : [quads.map(function (q) { return place(rd(rf, 1), q); }).filter(function (v) { return !intv || sols.some(function (w) { return Math.abs(w - v) < 0.2; }); })] },
      lines.join('<br>'), ['Use the sign of the value and CAST to find the quadrants (usually two).', 'Find ' + t('\\theta_R') + ' with the inverse key on the <b>positive</b> value (Degree mode), then place it in each quadrant: II ' + t('180^\\circ-\\theta_R') + ', III ' + t('180^\\circ+\\theta_R') + ', IV ' + t('360^\\circ-\\theta_R') + '.'], 'solve a trigonometric equation');
  }
  /* a·fn θ + b = c (isolate first); o = { interval: true (a smaller interval), none: allow no solution } */
  B.solveLinear = function (r, cp, s0, o) {
    o = o || {};
    var s = find(function () {
      var fn = r.pick(['sin', 'cos', 'tan']), A = r.pick([2, 3, 4, 5, 6, 7, 8, 9, -2, -3]), b = r.pick(range(-9, 9).filter(function (x) { return x; })), c = r.int(-9, 9);
      return { fn: fn, A: A, b: b, c: c, v: (c - b) / A };
    }, function (s) { var av = Math.abs(s.v); if (s.v === 0 || Math.abs(av - 1) < 1e-9 || Math.abs(av - 0.5) < 1e-9) return false; if (s.fn === 'tan') return av <= 6 && av >= 0.1; return o.none ? (av < 1 ? av >= 0.08 : r.chance(0.25) && av < 3) : av < 0.97 && av >= 0.08; });
    var g = gcd(Math.abs(s.c - s.b), Math.abs(s.A)), num = (s.c - s.b) / g, den = s.A / g; if (den < 0) { num = -num; den = -den; }
    var vT = den === 1 ? String(num) : (num < 0 ? '-' : '') + '\\frac{' + Math.abs(num) + '}{' + den + '}', eq = (s.A === 1 ? '' : s.A === -1 ? '-' : s.A) + '\\' + s.fn + '\\theta' + (s.b > 0 ? '+' + s.b : s.b) + '=' + s.c;
    var intv = null;
    if (o.interval) intv = r.pick([[0, 180, true, '0^\\circ\\le\\theta\\le 180^\\circ'], [90, 270, true, '90^\\circ\\le\\theta\\le 270^\\circ'], [180, 360, false, '180^\\circ\\le\\theta<360^\\circ'], [0, 90, true, '0^\\circ\\le\\theta\\le 90^\\circ'], [270, 360, false, '270^\\circ\\le\\theta<360^\\circ']]);
    var pre = [t(eq) + ' → ' + t(s.A + '\\' + s.fn + '\\theta=' + s.c + (s.b > 0 ? '-' + s.b : '+' + (-s.b)) + '=' + (s.c - s.b)) + ' → ' + t('\\' + s.fn + '\\theta=' + vT) + (den === 1 ? '' : ' ' + t('\\approx ' + fx(s.v, 4))) + '.'];
    var alt = [], vIso = (s.c + s.b) / s.A;
    if (s.fn === 'tan' || Math.abs(vIso) < 1) { var rfI = (s.fn === 'sin' ? asinD : s.fn === 'cos' ? acosD : atanD)(Math.abs(vIso)); if (vIso !== 0) alt.push({ sols: quadsFor(s.fn, vIso > 0 ? 1 : -1).map(function (q) { return place(rfI, q); }), code: cp + 'isolate', hint: 'Check the first step: ' + t(s.b > 0 ? 'subtract ' + s.b : 'add ' + (-s.b)) + ' on both sides, then divide by ' + t(s.A) + '.' }); }
    var vN = s.c - s.b; if (Math.abs(vN) < 1 && vN !== 0 && Math.abs(s.A) !== 1) { var rfN = (s.fn === 'sin' ? asinD : s.fn === 'cos' ? acosD : atanD)(Math.abs(vN)); alt.push({ sols: quadsFor(s.fn, vN > 0 ? 1 : -1).map(function (q) { return place(rfN, q); }), code: cp + 'nodiv', hint: 'Divide by ' + t(s.A) + ' too: ' + t('\\' + s.fn + '\\theta=' + vT) + '.' }); }
    if (intv) alt = alt.map(function (a0) { return { sols: a0.sols.filter(function (v) { return v >= intv[0] - 1e-9 && (intv[2] ? v <= intv[1] + 1e-9 : v < intv[1]); }), code: a0.code, hint: a0.hint }; }).filter(function (a0) { return a0.sols.length; });
    var p = solveFor(r, cp, s.fn, s.v, vT, intv, 'Solve ' + t(eq) + ' for ' + t(intv ? intv[3] : '0^\\circ\\le\\theta<360^\\circ') + ', to the nearest tenth of a degree.', pre, alt);
    return p;
  };
  B.sumOther = function (r, cp) { // cos A = cos α (A ≠ α) and sin B = sin β (B ≠ β): A + B
    var f1 = r.pick(['cos', 'sin', 'tan']), f2 = r.pick(['sin', 'cos', 'tan'].filter(function (f) { return f !== f1; }));
    function other(fn, a) { var q = quad(a), qs = quadsFor(fn, sgn(fn, q)), q2 = qs[0] === q ? qs[1] : qs[0]; return place(refOf(a), q2); }
    var al = angleIn(r, r.int(1, 4), AVOID_ANG), be = angleIn(r, r.int(1, 4), AVOID_ANG), A = other(f1, al), Bv = other(f2, be), ans = A + Bv;
    var alts = [{ v: al + be, code: cp + 'sum-same', hint: t('A') + ' and ' + t('B') + ' are the <b>other</b> angles: ' + t('A\\ne ' + dg(al)) + ' and ' + t('B\\ne ' + dg(be)) + '.' }];
    [[A, be], [al, Bv]].forEach(function (pr) { if (pr[0] + pr[1] !== ans) alts.push({ v: pr[0] + pr[1], code: cp + 'other-same', hint: 'Find the other angle for <b>both</b> equations.' }); });
    function ln0(fn, a, X, nm) { var q = quad(a), s0 = sgn(fn, q), qs = quadsFor(fn, s0), q2 = qs[0] === q ? qs[1] : qs[0]; return t('\\' + fn + ' ' + dg(a)) + ' is ' + (s0 > 0 ? 'positive' : 'negative') + ' (Quadrant ' + ROM[q] + ', ' + t(refTex(a)) + '), so ' + t(nm) + ' is in Quadrant ' + ROM[q2] + ': ' + t(nm + '=' + placeTex(q2, refOf(a)) + (q2 === 1 ? '' : '=' + dg(X))) + '.'; }
    return degPart('Angles ' + t('A') + ' and ' + t('B') + ' are between ' + t('0^\\circ') + ' and ' + t('360^\\circ') + ', with ' + t('\\' + f1 + ' A=\\' + f1 + ' ' + dg(al)) + ' (' + t('A\\ne ' + dg(al)) + ') and ' + t('\\' + f2 + ' B=\\' + f2 + ' ' + dg(be)) + ' (' + t('B\\ne ' + dg(be)) + '). Determine ' + t('A+B') + '.', ans, alts,
      ln0(f1, al, A, 'A') + '<br>' + ln0(f2, be, Bv, 'B') + '<br>' + t('A+B=' + dg(A) + '+' + dg(Bv) + '=' + dg(ans)) + '.',
      ['Each angle has the same reference angle as the given one, in the other quadrant where that ratio has the same sign (CAST).'], 'other angles with the same ratio');
  };

  /* ---------- T2 · Lesson 4 (exact values) ---------- */
  var SPECIAL = [30, 45, 60, 120, 135, 150, 210, 225, 240, 300, 315, 330];
  B.exactVal = function (r, cp, s0, o) {
    o = o || {};
    var quadral = o.quadrantal || (o.mix && r.chance(o.quadP || 0.3)), fn = r.pick(['sin', 'cos', 'tan']), a;
    if (quadral) a = r.pick([0, 90, 180, 270, 360]); else a = find(function () { return r.pick(SPECIAL); }, function (v) { return quad(v) !== 1 || r.chance(0.15); });
    var want = exact(fn, a), alts = [];
    if (!quadral) { var rf = refOf(a); if (rf !== 45) { var oth = rf === 30 ? 60 : 30, b = BASE[fn][oth], w2 = spec(sgn(fn, quad(a)) * b[0], b[1], b[2]); alts.push({ s: w2, code: cp + 'ex-ref', hint: 'Check the reference angle: ' + t(refTex(a)) + ', and ' + t('\\' + fn + ' ' + dg(rf) + '=' + stex(spec(BASE[fn][rf][0], BASE[fn][rf][1], BASE[fn][rf][2]))) + '.' }); } }
    else if (want === 'undef') alts.push({ s: spec(0), code: cp + 'undef-zero', hint: 'At ' + t(dg(a)) + ' the point is ' + t('(0,\\ ' + (a === 90 ? 1 : -1) + ')') + ': ' + t('\\tan\\theta=\\frac{y}{x}') + ' divides by zero, so it is undefined.' });
    else if (fn === 'tan') alts.push({ s: 'undef', code: cp + 'not-undef', hint: t('\\tan ' + dg(a) + '=\\frac{0}{' + (a === 180 ? -1 : 1) + '}=0') + '.' });
    var sol;
    if (quadral) { var Pt = { 0: [1, 0], 90: [0, 1], 180: [-1, 0], 270: [0, -1], 360: [1, 0] }[a]; sol = 'At ' + t(dg(a)) + ' use the point ' + t('(' + Pt[0] + ',\\ ' + Pt[1] + ')') + ' with ' + t('r=1') + ': ' + t('\\' + fn + ' ' + dg(a) + '=' + (fn === 'sin' ? '\\frac{y}{r}' : fn === 'cos' ? '\\frac{x}{r}' : '\\frac{y}{x}') + (want === 'undef' ? '=\\frac{' + Pt[1] + '}{0}' : '=' + stex(want))) + (want === 'undef' ? ', which is <b>undefined</b>.' : '.'); }
    else { var q = quad(a), rf2 = refOf(a), s0 = sgn(fn, q); sol = (q === 1 ? '' : 'Quadrant ' + ROM[q] + ', ' + t(refTex(a)) + '; ' + fn + ' is ' + (s0 > 0 ? 'positive' : 'negative') + ' there. ') + t('\\' + fn + ' ' + dg(a) + '=' + (q === 1 ? '' : (s0 < 0 ? '-' : '') + '\\' + fn + ' ' + dg(rf2) + '=') + stex(want)) + '.'; }
    return exactPart((o.noPre ? '' : 'Determine the exact value of ') + t('\\' + fn + ' ' + dg(a)) + (o.noPre ? '' : '.'), want, cp, { altSpecs: alts, undef: true, signHint: 'Check the sign with CAST for the quadrant of ' + t(dg(a)) + '.' }, sol + (quadral ? '' : sketchFor(a, dgs(refOf(a)))),
      ['Quadrant and reference angle first; the special triangles give ' + t('\\theta_R') + '’s value; CAST gives the sign.', 'Special triangles: 1, 1, ' + t('\\sqrt{2}') + ' and 1, ' + t('\\sqrt{3}') + ', 2.'], 'exact value');
  };
  function evT(fn, a) { return '\\' + fn + ' ' + dg(a); }
  B.exactExpr = function (r, cp) {
    var s = find(function () {
      var kind = r.pick(['prod', 'prod', 'sq', 'sum', 'ksq']), f1 = r.pick(['sin', 'cos', 'tan']), f2 = r.pick(['sin', 'cos', 'tan']), a1 = r.pick(SPECIAL.concat([90, 180, 270])), a2 = r.pick(SPECIAL.concat([180]));
      var v1 = exact(f1, a1), v2 = exact(f2, a2); if (v1 === 'undef' || v2 === 'undef' || v1.p === 0 || v2.p === 0) return null;
      var val, tex, k = 1, steps;
      if (kind === 'prod') { k = r.pick([1, 2, 4, 6, 8]); val = smul(spec(k), smul(v1, v2)); tex = (k === 1 ? '' : k) + evT(f1, a1) + evT(f2, a2).replace('\\', '\\,\\'); steps = (k === 1 ? '' : k) + '\\left(' + stex(v1) + '\\right)\\left(' + stex(v2) + '\\right)'; }
      else if (kind === 'sq') { var pm = r.chance(0.5) ? 1 : -1; val = sadd(ssq(v1), pm > 0 ? ssq(v2) : sneg(ssq(v2))); tex = '\\' + f1 + '^{2} ' + dg(a1) + (pm > 0 ? '+' : '-') + '\\' + f2 + '^{2} ' + dg(a2); steps = '\\left(' + stex(v1) + '\\right)^{2}' + (pm > 0 ? '+' : '-') + '\\left(' + stex(v2) + '\\right)^{2}'; }
      else if (kind === 'sum') { val = sadd(v1, v2); tex = evT(f1, a1) + '+' + evT(f2, a2); steps = stex(v1) + (v2.p < 0 ? '' : '+') + stex(v2); }
      else { k = r.pick([2, 4, 6, 8, 12]); if (v2.m !== 1) return null; val = sadd(smul(spec(k), ssq(v1)), sneg(v2)); tex = k + '\\' + f1 + '^{2} ' + dg(a1) + '-' + evT(f2, a2); steps = k + '\\left(' + stex(v1) + '\\right)^{2}-' + (v2.p < 0 ? '\\left(' + stex(v2) + '\\right)' : stex(v2)); }
      if (!val) return null;
      return { kind: kind, tex: tex, val: val, steps: steps, v1: v1, v2: v2, f1: f1, f2: f2, a1: a1, a2: a2 };
    }, function (s) { return Math.abs(sval(s.val)) <= 12 && s.val.p !== 0 && !(s.tex === '\\cos 60^\\circ+\\sin 30^\\circ'); });
    var alts = [];
    if (s.kind === 'prod' || s.kind === 'sum') alts.push({ s: sneg(s.val), code: cp + 'sign', hint: 'Check the sign of each value with CAST.' });
    return exactPart('Determine the exact value of ' + t(s.tex) + '.', s.val, cp, { altSpecs: alts.filter(function (a) { return sval(a.s) !== sval(s.val); }) },
      t(evT(s.f1, s.a1) + '=' + stex(s.v1)) + ' and ' + t(evT(s.f2, s.a2) + '=' + stex(s.v2)) + '. So ' + t(s.tex + '=' + s.steps + '=' + stex(s.val)) + '.',
      ['Find each exact value first (quadrant, reference angle, CAST sign).', 'Substitute with brackets, then simplify.'], 'exact expression');
  };
  /* exact equations: o = { sq: a squared equation (four solutions) } */
  var EQV = { sin: [[1, 2, 1], [1, 2, 2], [1, 2, 3]], cos: [[1, 2, 1], [1, 2, 2], [1, 2, 3]], tan: [[1, 3, 3], [1, 1, 1], [1, 1, 3]] };
  function refFor(fn, v) { var rr = null; [30, 45, 60].forEach(function (k) { var b = BASE[fn][k]; if (b[0] === v[0] && b[1] === v[1] && b[2] === v[2]) rr = k; }); return rr; }
  B.solveExact = function (r, cp, s0, o) {
    o = o || {};
    var fn = r.pick(['sin', 'cos', 'tan']), v = r.pick(EQV[fn]), rf = refFor(fn, v), sg0 = r.chance(0.55) ? -1 : 1, eq, iso, sols, quads, lines = [];
    var vs = spec(v[0], v[1], v[2]);
    if (o.sq) {
      var sq2 = ssq(vs); // fn² θ = p/q
      var mult = r.pick([1, 2]), A = sq2.q * mult, C = sq2.p * mult; // A fn² θ = C, or A fn² θ − C = 0
      eq = r.chance(0.5) ? (A === 1 ? '' : A) + '\\' + fn + '^{2}\\theta=' + C : (A === 1 ? '' : A) + '\\' + fn + '^{2}\\theta-' + C + '=0';
      if (['4\\cos^{2}\\theta=1', '2\\sin^{2}\\theta-1=0', '3\\tan^{2}\\theta=1', '4\\sin^{2}\\theta-3=0', '2\\cos^{2}\\theta=1', '\\tan^{2}\\theta=3', '\\tan^{2}\\theta-3=0'].indexOf(eq) >= 0) { mult = 3; A = sq2.q * 3; C = sq2.p * 3; eq = A + '\\' + fn + '^{2}\\theta-' + C + '=0'; }
      quads = [1, 2, 3, 4]; sols = quads.map(function (q) { return place(rf, q); });
      lines.push(t('\\' + fn + '^{2}\\theta=\\frac{' + C + '}{' + A + '}=' + stex(sq2)) + ', so ' + t('\\' + fn + '\\theta=\\pm' + stex(vs)) + ' (both signs!). ' + t('\\' + fn + ' ' + dg(rf) + '=' + stex(vs)) + ', so ' + t('\\theta_R=' + dg(rf)) + ' in all four quadrants: ' + t(listTex(sols, 0, true)) + '.');
      var half = quadsFor(fn, 1).map(function (q) { return place(rf, q); });
      return listPart('Solve ' + t(eq) + ' exactly for ' + t('0^\\circ\\le\\theta<360^\\circ') + '.', sols, cp, { exact: true, fn: fn, ref: rf, quads: quads, altSets: [{ sols: half, code: cp + 'sq-pm', hint: 'Taking the square root gives <b>two</b> values: ' + t('\\' + fn + '\\theta=\\pm' + stex(vs)) + '. Solve both.' }, { sols: quadsFor(fn, -1).map(function (q) { return place(rf, q); }), code: cp + 'sq-pm', hint: t('\\' + fn + '\\theta=\\pm' + stex(vs)) + ': solve both signs.' }], missingHint: t('\\' + fn + '\\theta=\\pm' + stex(vs)) + ' — with both signs there are four solutions.' },
        lines.join('<br>'), ['Isolate ' + t('\\' + fn + '^{2}\\theta') + ', then take the square root: ' + t('\\pm') + '!', 'Each sign gives two angles with the same reference angle.'], 'squared trig equation (exact)');
    }
    // k·fn θ + c = 0 forms
    var forms = [];
    if (fn !== 'tan' && v[1] === 2 && v[2] === 1) forms = [['2', '1']];            // ±1/2: 2 fn θ ∓ 1 = 0
    else if (fn !== 'tan' && v[2] === 2) forms = [['2', '\\sqrt{2}'], ['\\sqrt{2}', '1']]; // ±√2/2
    else if (fn !== 'tan' && v[2] === 3) forms = [['2', '\\sqrt{3}']];           // ±√3/2
    else if (fn === 'tan' && v[1] === 3) forms = [['3', '\\sqrt{3}'], ['\\sqrt{3}', '1']]; // ±√3/3
    else if (fn === 'tan' && v[2] === 1) forms = [['', '1'], ['4', '4'], ['3', '3']];   // ±1
    else forms = [['', '\\sqrt{3}'], ['\\sqrt{3}', '3']];                        // ±√3
    var fm = r.pick(forms), kk = fm[0], cc = fm[1], style = r.int(0, 2);
    if (style === 0) eq = kk + '\\' + fn + '\\theta' + (sg0 > 0 ? '-' : '+') + cc + '=0';
    else if (style === 1) eq = kk + '\\' + fn + '\\theta=' + (sg0 > 0 ? '' : '-') + cc;
    else { var d0 = r.int(1, 7), rhs = /^\d+$/.test(cc) ? String(d0 + sg0 * Number(cc)) : d0 + (sg0 > 0 ? '+' : '-') + cc; eq = kk + '\\' + fn + '\\theta+' + d0 + '=' + rhs; }
    quads = quadsFor(fn, sg0); sols = quads.map(function (q) { return place(rf, q); }).sort(function (x, y) { return x - y; });
    var isoT = '\\' + fn + '\\theta=' + (sg0 < 0 ? '-' : '') + (/^\d+$/.test(kk) && /^\d+$/.test(cc) && Number(cc) % Number(kk) === 0 ? String(Number(cc) / Number(kk)) : kk ? '\\frac{' + cc + '}{' + kk + '}' : cc);
    var valT = (sg0 < 0 ? '-' : '') + stex(vs);
    lines.push(t(eq) + ' → ' + t(isoT) + (isoT.replace(/^\\\w+\\theta=/, '') === valT ? '' : t('=' + valT)) + '.');
    lines.push((sg0 > 0 ? 'Positive' : 'Negative') + ' ' + fn + ': Quadrants ' + quadsTex(quads) + '. ' + t('\\' + fn + ' ' + dg(rf) + '=' + stex(vs)) + ', so ' + t('\\theta_R=' + dg(rf)) + '.');
    lines.push(t('\\theta=' + sols.map(function (x) { return dg(x); }).join('\\text{ or }')) + '.');
    var altSets = [{ sols: quadsFor(fn, -sg0).map(function (q) { return place(rf, q); }), code: cp + 'quad', hint: 'Check the sign of ' + t('\\' + fn + '\\theta') + ' after isolating it: it is ' + (sg0 > 0 ? 'positive' : 'negative') + ', so Quadrants ' + quadsTex(quads) + '.' }];
    if (rf !== 45) altSets.push({ sols: quads.map(function (q) { return place(rf === 30 ? 60 : 30, q); }), code: cp + 'ex-ref', hint: 'Check the reference angle: ' + t('\\' + fn + ' ' + dg(rf) + '=' + stex(vs)) + '.' });
    return listPart('Solve ' + t(eq) + ' exactly for ' + t('0^\\circ\\le\\theta<360^\\circ') + '.', sols, cp, { exact: true, fn: fn, ref: rf, quads: quads, altSets: altSets }, lines.join('<br>'),
      ['Isolate the ratio (rationalize if needed) and compare with the special values.', 'The sign and CAST give the two quadrants; place ' + t('\\theta_R') + ' in each.'], 'solve exactly');
  };

  /* ---------- T3 · Lessons 5–8 (oblique triangles) ---------- */
  var HSL = ['The sine law pairs each side with the angle <b>opposite</b> it: ' + t('\\frac{a}{\\sin A}=\\frac{b}{\\sin B}=\\frac{c}{\\sin C}') + '.', 'Use the full pair (a known side and its opposite angle) with the unknown, then solve. Degree mode.'];
  var HCL = ['Cosine law: ' + t('a^{2}=b^{2}+c^{2}-2bc\\cos A') + ' (the angle is between the two known sides).', 'Work out ' + t('b^{2}+c^{2}') + ' and ' + t('2bc\\cos A') + ', subtract, then take the square root.'];
  function triTex(N) { return '\\triangle ' + N.join(''); }
  function angGen(r, lo, hi) { return r.int(lo, hi); }
  /* sine law, a side. o = { third: the known side is opposite the angle you must find first } */
  B.sineSide = function (r, cp, s0, o) {
    o = o || {};
    var N = names3(r), u = r.pick(UNITS);
    var s = find(function () { var X = r.int(25, 110), Y = r.int(22, 160 - X), Z = 180 - X - Y; return { X: X, Y: Y, Z: Z, len: r.int(60, 400) / 10 }; }, function (s) { return s.Z >= 18 && s.Y >= 18 && Math.abs(s.X - s.Y) >= 4; });
    var perm = r.shuffle(N.slice()), V1 = perm[0], V2 = perm[1], V3 = perm[2], angs = {};
    // V1 = vertex opposite the known side, V2 = vertex opposite the unknown side
    angs[V1] = s.X; angs[V2] = s.Y; angs[V3] = s.Z;
    var T = triAngles(N, angs, V1, s.len), x = T.s[V2];
    var givenA = o.third ? [V2, V3] : [V1, V2];
    var lab = {}; lab[V1] = lenS(s.len, u); lab[V2] = lc(V2);
    var al = {}; givenA.forEach(function (v) { al[v] = dgs(angs[v]); });
    var fig = triFig(T, { top: topOf(T), flip: r.chance(0.5), sides: lab, angles: al });
    var alts = [{ v: s.len * sinD(angs[V1]) / sinD(angs[V2]), code: cp + 'flip', hint: 'Check the proportion: ' + t('\\frac{' + lc(V2) + '}{\\sin ' + V2 + '}=\\frac{' + F(fx(s.len, 1)) + '}{\\sin ' + V1 + '}') + ', so ' + t(lc(V2) + '=\\frac{' + F(fx(s.len, 1)) + '\\sin ' + V2 + '}{\\sin ' + V1 + '}') + '.' },
      { v: s.len * sinD(angs[V3]) / sinD(angs[V1]), code: cp + 'pair', hint: 'Side ' + t(lc(V2)) + ' is opposite ' + t('\\angle ' + V2) + ': use ' + t('\\sin ' + V2) + '.' },
      { v: s.len * sinD(angs[V2]) / sinD(angs[V3]), code: o.third ? cp + 'third' : cp + 'pair', hint: o.third ? 'The known side is opposite ' + t('\\angle ' + V1) + ', which is not given: find it first, ' + t('\\angle ' + V1 + '=180^\\circ-' + dg(angs[V2]) + '-' + dg(angs[V3])) + '.' : 'The known side ' + t(F(fx(s.len, 1))) + ' is opposite ' + t('\\angle ' + V1) + ': pair it with ' + t('\\sin ' + V1) + '.' },
      { v: s.len * Math.sin(angs[V2]) / Math.sin(angs[V1]), code: cp + 'radian', hint: 'Radian mode: switch your calculator to <b>degree</b> mode.' }];
    var pre = o.third ? t('\\angle ' + V1 + '=180^\\circ-' + dg(angs[V2]) + '-' + dg(angs[V3]) + '=' + dg(angs[V1])) + ' (opposite the known side). ' : '';
    return nearPart('In ' + t(triTex(N)) + ', ' + givenA.map(function (v) { return angT(v, angs[v]); }).join(', ') + ' and ' + t(sideNm(N, V1) + '=' + F(fx(s.len, 1))) + ' ' + u + '. Determine the length of side ' + t(lc(V2)) + ' (' + t(sideNm(N, V2)) + '), to the nearest tenth of a ' + unitName(u) + '.' + fig, x, 1, { unit: u, alts: alts, before: t(lc(V2) + '\\approx') },
      pre + t('\\frac{' + lc(V2) + '}{\\sin ' + dg(angs[V2]) + '}=\\frac{' + F(fx(s.len, 1)) + '}{\\sin ' + dg(angs[V1]) + '}') + ', so ' + t(lc(V2) + '=\\frac{' + F(fx(s.len, 1)) + '\\sin ' + dg(angs[V2]) + '}{\\sin ' + dg(angs[V1]) + '}\\approx ' + F(fx(x, 1))) + ' ' + u + '.', HSL, 'sine law: a side');
  };
  function unitName(u) { return { cm: 'centimetre', m: 'metre', km: 'kilometre', mm: 'millimetre' }[u] || u; }
  /* SSA with one triangle: the angle opposite the shorter given side (or the given angle obtuse). Shared: { N, A, a, b, ... } */
  B.ssaOneShared = function (r) {
    var N = names3(r, true), u = r.pick(UNITS);
    return find(function () {
      var obt = r.chance(0.3), A = obt ? r.int(95, 135) : r.int(35, 80), Bt = obt ? r.int(15, 170 - A) : r.int(15, A - 6), a = r.int(80, 400) / 10;
      var b = rd(a * sinD(Bt) / sinD(A), 1), Bx = asinD(b * sinD(A) / a), C = 180 - A - Bx;
      return { N: N, u: u, A: A, a: a, b: b, B: Bx, C: C, c: a * sinD(C) / sinD(A), obt: obt };
    }, function (s) { return s.b > 1 && s.C >= 12 && s.B >= 12 && safe(s.B, 0) && safe(s.C, 0) && safe(s.c, 1) && s.a - s.b >= 0.8; });
  };
  function ssaStem(s) { var N = s.N; return 'In ' + t(triTex(N)) + ', ' + angT(N[0], s.A) + ', ' + t(lc(N[0]) + '=' + F(fx(s.a, 1))) + ' ' + s.u + ' and ' + t(lc(N[1]) + '=' + F(fx(s.b, 1))) + ' ' + s.u + '.'; }
  function ssaFig(s, show) { var N = s.N, angs = {}, sides = {}; angs[N[0]] = s.A; angs[N[1]] = s.B; angs[N[2]] = s.C; sides[N[0]] = s.a; sides[N[1]] = s.b; sides[N[2]] = s.c; var T = { N: N, A: angs, s: sides }; var lab = {}; lab[N[0]] = lenS(s.a, s.u); lab[N[1]] = lenS(s.b, s.u); var al = {}; al[N[0]] = dgs(s.A); if (show) al[N[1]] = show; return triFig(T, { top: topOf(T), flip: false, sides: lab, angles: al }); }
  B.ssaAngle = function (r, cp, s, o) {
    o = o || {}; s = s || B.ssaOneShared(r);
    var N = s.N, Bn = N[1], An = N[0], sv = s.b * sinD(s.A) / s.a, fl = s.a * sinD(s.A) / s.b;
    var alts = [{ v: 180 - s.B, code: cp + 'supp', hint: (s.obt ? t('\\angle ' + An) + ' is obtuse, so ' : 'The given angle is opposite the longer side, so ') + t('\\angle ' + Bn) + ' must be acute: only one triangle.' }, { v: s.C, code: cp + 'third', hint: 'That is ' + t('\\angle ' + N[2]) + '. The question asks for ' + t('\\angle ' + Bn) + ' (opposite ' + t(lc(Bn)) + ').' },
      { v: asinD(Math.sin(s.A) * s.b / s.a), code: cp + 'radian', hint: 'Radian mode: switch your calculator to <b>degree</b> mode.' }];
    if (fl < 1) alts.push({ v: asinD(fl), code: cp + 'flip', hint: 'Check the proportion: ' + t('\\sin ' + Bn + '=\\frac{' + lc(Bn) + '\\sin ' + An + '}{' + lc(An) + '}') + '.' });
    var why = s.obt ? t('\\angle ' + An) + ' is obtuse, and a triangle has only one obtuse angle, so ' + t('\\angle ' + Bn) + ' is acute.' : t(lc(An) + '>' + lc(Bn)) + ': the given angle is opposite the longer side, so ' + t('\\angle ' + Bn) + ' is acute (one triangle).';
    return nearPart((o.stem === false ? '' : ssaStem(s) + ' ') + 'Determine ' + t('\\angle ' + Bn) + ' to the nearest degree.' + (o.stem === false || o.noFig ? '' : ssaFig(s)), s.B, 0, { unit: '°', alts: alts, before: t('\\angle ' + Bn + '\\approx'), ansPre: '\\angle ' + Bn + '\\approx ' },
      why + ' ' + t('\\frac{\\sin ' + Bn + '}{' + F(fx(s.b, 1)) + '}=\\frac{\\sin ' + dg(s.A) + '}{' + F(fx(s.a, 1)) + '}') + ', so ' + t('\\sin ' + Bn + '=\\frac{' + F(fx(s.b, 1)) + '\\sin ' + dg(s.A) + '}{' + F(fx(s.a, 1)) + '}\\approx ' + fx(sv, 4)) + ' and ' + t('\\angle ' + Bn + '\\approx ' + dg(fx(s.B, 0))) + '.',
      ['Pair ' + t(lc(An)) + ' with ' + t('\\angle ' + An) + ' and ' + t(lc(Bn)) + ' with ' + t('\\angle ' + Bn) + '; solve for ' + t('\\sin ' + Bn) + ', then use ' + t('\\sin^{-1}') + '.', 'Only one triangle: the angle you find is acute.'], 'sine law: an angle');
  };
  B.ssaSide = function (r, cp, s) {
    var N = s.N, Cn = N[2], An = N[0], Bn = N[1], Br = rd(s.B, 0), Cr = 180 - s.A - Br, cAlso = s.a * sinD(Cr) / sinD(s.A), cAlso1 = s.a * sinD(180 - s.A - rd(s.B, 1)) / sinD(s.A);
    var alts = [{ v: s.a * sinD(s.B) / sinD(s.A), code: cp + 'pair', hint: 'That is ' + t(lc(Bn)) + '. Side ' + t(lc(Cn)) + ' is opposite ' + t('\\angle ' + Cn) + ': find ' + t('\\angle ' + Cn + '=180^\\circ-\\angle ' + An + '-\\angle ' + Bn) + ' first.' }, { v: s.a * sinD(s.B) / sinD(s.C), code: cp + 'flip', hint: 'Use the full pair ' + t(lc(An)) + ', ' + t('\\angle ' + An) + ': ' + t(lc(Cn) + '=\\frac{' + lc(An) + '\\sin ' + Cn + '}{\\sin ' + An + '}') + '.' }];
    return nearPart('Determine side ' + t(lc(Cn)) + ' to the nearest tenth of a ' + unitName(s.u) + '.', s.c, 1, { unit: s.u, alts: alts, before: t(lc(Cn) + '\\approx'), also: [cAlso, cAlso1] },
      t('\\angle ' + Cn + '\\approx 180^\\circ-' + dg(s.A) + '-' + dg(fx(s.B, 1)) + '=' + dg(fx(s.C, 1))) + '. ' + t(lc(Cn) + '=\\frac{' + F(fx(s.a, 1)) + '\\sin ' + dg(fx(s.C, 1)) + '}{\\sin ' + dg(s.A) + '}\\approx ' + F(fx(s.c, 1))) + ' ' + s.u + '. (Keep the unrounded angle in the calculator.)',
      ['Find the third angle (the angles add to ' + t('180^\\circ') + ').', 'Then use the sine law with the full pair ' + t(lc(An)) + ', ' + t('\\angle ' + An) + '.'], 'the third side');
  };
  /* cosine law, a side (SAS) */
  B.cosSide = function (r, cp, s0, o) {
    o = o || {};
    var N = names3(r), u = r.pick(UNITS), V = r.pick(N), oth = others(N, V);
    var s = find(function () { return { A: r.int(25, 125), b: r.int(40, 300) / 10, c: r.int(40, 300) / 10 }; }, function (s) { var a2 = s.b * s.b + s.c * s.c - 2 * s.b * s.c * cosD(s.A); return [35, 104, 21, 76, 53, 112, 68, 45, 37].indexOf(s.A) < 0 && Math.abs(s.b - s.c) > 1 && safe(Math.sqrt(a2), 1) && Math.sqrt(a2) > 2; });
    var a = Math.sqrt(s.b * s.b + s.c * s.c - 2 * s.b * s.c * cosD(s.A)), sides = {}; sides[V] = a; sides[oth[0]] = s.b; sides[oth[1]] = s.c;
    var T = triSides(N, sides), lab = {}; lab[V] = lc(V); lab[oth[0]] = lenS(s.b, u); lab[oth[1]] = lenS(s.c, u); var al = {}; al[V] = dgs(s.A);
    var B2 = s.b * s.b + s.c * s.c, C2 = 2 * s.b * s.c * cosD(s.A);
    var alts = [{ v: B2 - C2, code: cp + 'cos-noroot', hint: 'That is ' + t(lc(V) + '^{2}') + ': take the square root.' }, { v: Math.sqrt(Math.max(0, B2 + C2)), code: cp + 'cos-plus', hint: 'The cosine law <b>subtracts</b> ' + t('2bc\\cos A') + '.' },
      { v: (B2 - 2 * s.b * s.c) * cosD(s.A) > 0 ? Math.sqrt((B2 - 2 * s.b * s.c) * cosD(s.A)) : NaN, code: cp + 'cos-order', hint: 'Order of operations: multiply ' + t('2bc') + ' by ' + t('\\cos A') + ' <b>before</b> subtracting.' }, { v: Math.sqrt(Math.max(0, B2 - 2 * s.b * s.c * Math.cos(s.A))), code: cp + 'radian', hint: 'Radian mode: switch your calculator to <b>degree</b> mode.' }];
    return nearPart((o.ctx || ('In ' + t(triTex(N)) + ', ' + angT(V, s.A) + ', ' + t(lc(oth[0]) + '=' + F(fx(s.b, 1))) + ' ' + u + ' and ' + t(lc(oth[1]) + '=' + F(fx(s.c, 1))) + ' ' + u + '. Determine side ' + t(lc(V)) + ', to the nearest tenth of a ' + unitName(u) + '.')) + triFig(T, { top: topOf(T), flip: r.chance(0.5), sides: lab, angles: al }), a, 1, { unit: u, alts: alts, before: t(lc(V) + '\\approx') },
      t(lc(V) + '^{2}=' + F(fx(s.b, 1)) + '^{2}+' + F(fx(s.c, 1)) + '^{2}-2(' + F(fx(s.b, 1)) + ')(' + F(fx(s.c, 1)) + ')\\cos ' + dg(s.A) + '\\approx ' + F(fx(a * a, 2))) + ', so ' + t(lc(V) + '\\approx ' + F(fx(a, 1))) + ' ' + u + '.', HCL, 'cosine law: a side');
  };
  /* cosine law, an angle (SSS): o = { largest } */
  B.cosAngle = function (r, cp, s0, o) {
    o = o || {};
    var N = names3(r), u = r.pick(UNITS);
    var s = find(function () { var a = r.int(4, 30), b = r.int(4, 30), c = r.int(4, 30); return [a, b, c].sort(function (x, y) { return x - y; }); },
      function (v) { if (v[0] + v[1] <= v[2] + 2) return false; if (v[0] === v[1] || v[1] === v[2]) return false; var ang = acosD((v[0] * v[0] + v[1] * v[1] - v[2] * v[2]) / (2 * v[0] * v[1])); return safe(ang, 0) && (!o.largest || ang > 70) && ang < 165 && [ '8,11,16', '17,25,30', '42,57,68', '12,14,9', '6,8,12', '8,13,15', '9,11,6', '4,7,12'].indexOf(v.join(',')) < 0; });
    var perm = r.shuffle(N.slice()), sides = {}; sides[perm[0]] = s[0]; sides[perm[1]] = s[1]; sides[perm[2]] = s[2];
    var T = triSides(N, sides), want = o.largest ? perm[2] : r.pick(perm), oth = others(N, want), th = T.A[want];
    var ca = (sq(sides[oth[0]]) + sq(sides[oth[1]]) - sq(sides[want])) / (2 * sides[oth[0]] * sides[oth[1]]);
    var alts = others(N, want).map(function (v) { return { v: T.A[v], code: cp + 'cos-opp', hint: 'That is the angle opposite ' + t(sides[v]) + '. ' + t('\\angle ' + want) + ' is opposite the side ' + t(sides[want]) + ' ' + u + ': it goes last in ' + t('\\cos ' + want + '=\\frac{' + lc(oth[0]) + '^{2}+' + lc(oth[1]) + '^{2}-' + lc(want) + '^{2}}{2' + lc(oth[0]) + lc(oth[1]) + '}') + '.' }; });
    if (th > 90) alts.push({ v: 180 - th, code: cp + 'cos-abs', hint: 'The cosine is negative, so the angle is <b>obtuse</b>: use ' + t('\\cos^{-1}') + ' of the negative value.' });
    alts.push({ v: Math.acos(Math.max(-1, Math.min(1, ca))) , code: cp + 'radian', hint: 'Radian mode: switch your calculator to <b>degree</b> mode.' });
    var lab = {}; N.forEach(function (v) { lab[v] = s.indexOf(sides[v]) >= 0 ? sides[v] + ' ' + u : ''; }); var al = {}; al[want] = o.largest ? null : 'θ';
    var prompt = o.largest ? 'A triangle has sides of ' + t(s[0]) + ' ' + u + ', ' + t(s[1]) + ' ' + u + ' and ' + t(s[2]) + ' ' + u + '. Determine the measure of its largest angle, to the nearest degree.' : 'In ' + t(triTex(N)) + ', ' + N.map(function (v) { return t(lc(v) + '=' + sides[v]) + ' ' + u; }).join(', ') + '. Determine ' + t('\\angle ' + want) + ' to the nearest degree.';
    if (!o.largest) prompt += triFig(T, { top: topOf(T), flip: r.chance(0.5), sides: lab, angles: al });
    var w0 = sides[oth[0]], w1 = sides[oth[1]], wv = sides[want];
    return nearPart(prompt, th, 0, { unit: '°', alts: alts, before: o.largest ? null : t('\\angle ' + want + '\\approx'), ansPre: o.largest ? '' : '\\angle ' + want + '\\approx ' },
      (o.largest ? 'The largest angle is opposite the longest side, ' + t(wv) + ' ' + u + '. ' : '') + t('\\cos\\theta=\\frac{' + w0 + '^{2}+' + w1 + '^{2}-' + wv + '^{2}}{2(' + w0 + ')(' + w1 + ')}=\\frac{' + (w0 * w0 + w1 * w1 - wv * wv) + '}{' + (2 * w0 * w1) + '}\\approx ' + fx(ca, 4)) + ', so ' + t('\\theta\\approx ' + dg(fx(th, 0))) + (th > 90 ? ' (a negative cosine: obtuse).' : '.'),
      ['Cosine law for an angle: ' + t('\\cos A=\\frac{b^{2}+c^{2}-a^{2}}{2bc}') + ', with ' + t('a') + ' the side <b>opposite</b> the angle.', o.largest ? 'The largest angle is opposite the longest side.' : 'A negative cosine means an obtuse angle — that’s fine.'], 'cosine law: an angle');
  };
  /* SSA: how many triangles */
  B.countTri = function (r, cp, s0, o) {
    var N = names3(r, true), u = r.pick(UNITS), An = N[0], Bn = N[1];
    var s = find(function () {
      var kind = r.pick(['two', 'two', 'none', 'one', 'onebig', 'obtnone', 'obtone', 'right']), A, b, a;
      if (kind === 'right') { A = 30; b = r.int(3, 12) * 2; a = b / 2; }
      else if (kind === 'obtnone' || kind === 'obtone') { A = r.int(95, 140); b = r.int(5, 20); a = kind === 'obtone' ? b + r.int(1, 8) : r.int(2, b); }
      else { A = r.int(25, 72); b = r.int(6, 24); var h = b * sinD(A); a = kind === 'two' ? rd(h + (b - h) * (0.15 + 0.7 * r.next()), 1) : kind === 'none' ? rd(h * (0.45 + 0.45 * r.next()), 1) : kind === 'one' ? b + r.int(1, 8) : b; }
      return { kind: kind, A: A, a: a, b: b, h: b * sinD(A) };
    }, function (s) { if (s.a <= 0.5) return false; if (s.kind === 'two' || s.kind === 'none') return Math.abs(s.a - s.h) >= 0.4 && s.b - s.a >= 0.4; return true; });
    var n = s.kind === 'two' ? 2 : s.kind === 'none' || s.kind === 'obtnone' ? 0 : 1;
    var hT = t('h=' + lc(Bn) + '\\sin ' + An + '=' + F(fx(s.b, 1).replace(/\.0$/, '')) + '\\sin ' + dg(s.A) + '\\approx ' + F(fx(s.h, 2)));
    var why = s.A > 90 ? t('\\angle ' + An) + ' is obtuse: one triangle if ' + t(lc(An) + '>' + lc(Bn)) + ', none if ' + t(lc(An) + '\\le ' + lc(Bn)) + '. Here ' + t(lc(An) + '=' + s.a) + (s.a > s.b ? ' > ' : ' ≤ ') + t(lc(Bn) + '=' + s.b) + ': <b>' + n + '</b>.'
      : hT + '. ' + (n === 2 ? t('h<' + lc(An) + '<' + lc(Bn)) + ' (' + t(F(fx(s.h, 2)) + '<' + s.a + '<' + s.b) + '): the swinging side meets the base twice — <b>2</b> triangles.' : n === 0 ? t(lc(An) + '<h') + ': side ' + t(lc(An)) + ' is too short to reach — <b>0</b> triangles.' : s.kind === 'right' ? t(lc(An) + '=h') + ': exactly one (right) triangle — <b>1</b>.' : t(lc(An) + '\\ge ' + lc(Bn)) + ': <b>1</b> triangle.');
    var diag = function (v) { if (v === n) return null; if (n === 2 && v === 1) return { code: cp + 'amb-one', hint: 'Compare ' + t(lc(An)) + ' with the height ' + t('h=' + lc(Bn) + '\\sin ' + An) + ' <b>and</b> with ' + t(lc(Bn)) + ': ' + t('h<' + lc(An) + '<' + lc(Bn)) + ' gives two triangles.' }; return { code: cp + 'amb-count', hint: 'Find the height ' + t('h=' + lc(Bn) + '\\sin ' + An) + ' and compare: ' + t(lc(An) + '<h') + ': 0; ' + t(lc(An) + '=h') + ' or ' + t(lc(An) + '\\ge ' + lc(Bn)) + ': 1; ' + t('h<' + lc(An) + '<' + lc(Bn)) + ': 2 (for an acute angle).' }; };
    return { prompt: 'In ' + t(triTex(N)) + ', ' + angT(An, s.A) + ', ' + t(lc(An) + '=' + F(String(s.a))) + ' ' + u + ' and ' + t(lc(Bn) + '=' + F(String(s.b))) + ' ' + u + '. How many triangles are possible: 0, 1 or 2?', input: { type: 'number' }, check: K.number(n, diag), key: String(n), answer: t(n),
      solution: why, hints: ['SSA: side ' + t(lc(An)) + ' (opposite ' + t('\\angle ' + An) + ') swings from the end of side ' + t(lc(Bn)) + '.', 'Acute ' + t('\\angle ' + An) + ': compare ' + t(lc(An)) + ' with ' + t('h=' + lc(Bn) + '\\sin ' + An) + ' and with ' + t(lc(Bn)) + '. Obtuse: compare ' + t(lc(An)) + ' with ' + t(lc(Bn)) + '.'], text: 'number of triangles', bad: [0, 1, 2].filter(function (v) { return v !== n; }).map(String) };
  };
  /* SSA two triangles (o.mix: sometimes only one). shared s */
  B.ambShared = function (r, o) {
    o = o || {};
    var N = names3(r, true), u = r.pick(UNITS);
    return find(function () {
      var one = o.mix && r.chance(0.3), A = r.int(24, 66), b = r.int(70, 260) / 10, h = b * sinD(A), a = one ? rd(b + 0.5 + r.next() * b * 0.6, 1) : rd(h + (b - h) * (0.2 + 0.6 * r.next()), 1);
      var sB = b * sinD(A) / a, B1 = asinD(sB), B2 = 180 - B1, C1 = 180 - A - B1, C2 = 180 - A - B2;
      return { N: N, u: u, A: A, a: a, b: b, h: h, B1: B1, B2: B2, C1: C1, C2: C2, two: C2 > 0.5, c1: a * sinD(C1) / sinD(A), c2: C2 > 0 ? a * sinD(C2) / sinD(A) : null };
    }, function (s) { return safe(s.B1, 0) && safe(s.B2, 0) && (!s.two || (s.C2 >= 6 && safe(s.c1, 1) && safe(s.c2, 1) && s.b - s.a >= 0.5 && s.a - s.h >= 0.5)) && (s.two || o.mix); });
  };
  function ambStem(s) { var N = s.N; return 'In ' + t(triTex(N)) + ', ' + angT(N[0], s.A) + ', ' + t(lc(N[0]) + '=' + F(fx(s.a, 1))) + ' ' + s.u + ' and ' + t(lc(N[1]) + '=' + F(fx(s.b, 1))) + ' ' + s.u + '.'; }
  function ambSol(s) {
    var N = s.N, An = N[0], Bn = N[1], Cn = N[2], sv = s.b * sinD(s.A) / s.a;
    var L = [s.two ? t('h=' + F(fx(s.b, 1)) + '\\sin ' + dg(s.A) + '\\approx ' + F(fx(s.h, 2))) + ' and ' + t(F(fx(s.h, 2)) + '<' + F(fx(s.a, 1)) + '<' + F(fx(s.b, 1))) + ': two triangles.' : t(lc(An) + '\\ge ' + lc(Bn)) + ': one triangle.'];
    L.push(t('\\sin ' + Bn + '=\\frac{' + F(fx(s.b, 1)) + '\\sin ' + dg(s.A) + '}{' + F(fx(s.a, 1)) + '}\\approx ' + fx(sv, 4)) + ', so ' + t('\\angle ' + Bn + '\\approx ' + dg(fx(s.B1, 1))) + ' or ' + t('180^\\circ-' + dg(fx(s.B1, 1)) + '=' + dg(fx(s.B2, 1))) + (s.two ? ' (' + t(dg(s.A) + '+' + dg(fx(s.B2, 1)) + '<180^\\circ') + ', so both work).' : ', but ' + t(dg(s.A) + '+' + dg(fx(s.B2, 1)) + '>180^\\circ') + ': rejected.'));
    return L;
  }
  B.ambAngles = function (r, cp, s) {
    var N = s.N, Bn = N[1], sols = s.two ? [s.B1, s.B2] : [s.B1], fl = s.a * sinD(s.A) / s.b;
    var altSets = [];
    if (!s.two) altSets.push({ sols: [s.B1, s.B2], code: cp + 'amb-extra', hint: 'Check the angle sum: ' + t(dg(s.A) + '+' + dg(fx(s.B2, 0)) + '>180^\\circ') + ', so the obtuse angle doesn’t fit. (' + t(lc(N[0]) + '\\ge ' + lc(N[1])) + ': one triangle.)' });
    if (fl < 1) altSets.push({ sols: [asinD(fl), 180 - asinD(fl)], code: cp + 'flip', hint: 'Check the proportion: ' + t('\\sin ' + Bn + '=\\frac{' + lc(Bn) + '\\sin ' + N[0] + '}{' + lc(N[0]) + '}') + '.' }, { sols: [asinD(fl)], code: cp + 'flip', hint: 'Check the proportion: ' + t('\\sin ' + Bn + '=\\frac{' + lc(Bn) + '\\sin ' + N[0] + '}{' + lc(N[0]) + '}') + '.' });
    return listPart(ambStem(s) + ' Determine all possible measures of ' + t('\\angle ' + Bn) + ', to the nearest degree.', sols, cp, { dp: 0, altSets: altSets, missingHint: s.two ? 'There are <b>two</b> triangles here (' + t('h<' + lc(N[0]) + '<' + lc(N[1])) + '): the obtuse angle ' + t('180^\\circ-\\angle ' + Bn) + ' works too.' : null },
      ambSol(s).join('<br>') + '<br>' + t('\\angle ' + Bn + '\\approx ' + listTex(sols, 0)) + '.',
      ['Find ' + t('\\sin ' + Bn) + ' with the sine law.', 'The acute angle and its supplement have the same sine: check whether the obtuse one fits (' + t('\\angle ' + N[0] + '+\\angle ' + Bn + '<180^\\circ') + ').'], 'ambiguous case: all angles');
  };
  B.ambSides = function (r, cp, s) {
    var N = s.N, Cn = N[2], sols = [s.c1, s.c2].sort(function (x, y) { return y - x; });
    var also = [rd(s.B1, 0), rd(s.B1, 1)].map(function (Bq) { return [s.a * sinD(180 - s.A - Bq) / sinD(s.A), s.a * sinD(Bq - s.A) / sinD(s.A)]; });
    var L = ambSol(s);
    L.push('Triangle 1: ' + t('\\angle ' + Cn + '\\approx 180^\\circ-' + dg(s.A) + '-' + dg(fx(s.B1, 1)) + '=' + dg(fx(s.C1, 1))) + ', ' + t(lc(Cn) + '=\\frac{' + F(fx(s.a, 1)) + '\\sin ' + dg(fx(s.C1, 1)) + '}{\\sin ' + dg(s.A) + '}\\approx ' + F(fx(s.c1, 1))) + ' ' + s.u + '.');
    L.push('Triangle 2: ' + t('\\angle ' + Cn + '\\approx 180^\\circ-' + dg(s.A) + '-' + dg(fx(s.B2, 1)) + '=' + dg(fx(s.C2, 1))) + ', ' + t(lc(Cn) + '=\\frac{' + F(fx(s.a, 1)) + '\\sin ' + dg(fx(s.C2, 1)) + '}{\\sin ' + dg(s.A) + '}\\approx ' + F(fx(s.c2, 1))) + ' ' + s.u + '.');
    return listPart(ambStem(s) + ' There are two possible triangles. Determine both possible lengths of side ' + t(lc(Cn)) + ', to the nearest tenth of a ' + unitName(s.u) + '.', sols, cp, { dp: 1, what: 'length', unit: s.u, also: also, altSets: [{ sols: [s.c1], code: cp + 'ab-pair', hint: 'That is one of them: find the second triangle (' + t('\\angle ' + N[1] + '\\approx ' + dg(fx(s.B2, 1))) + ').' }, { sols: [s.c2], code: cp + 'ab-pair', hint: 'That is one of them: find the other triangle too.' }], missingHint: 'Give both lengths: one from each triangle.' },
      L.join('<br>'), ['Find both possible values of ' + t('\\angle ' + N[1]) + ' (acute and its supplement).', 'For each, ' + t('\\angle ' + Cn + '=180^\\circ-\\angle ' + N[0] + '-\\angle ' + N[1]) + ', then the sine law for ' + t(lc(Cn)) + '.'], 'ambiguous case: both triangles');
  };
  /* for what lengths of a are there two triangles: h < a < b */
  B.ambRange = function (r, cp) {
    var N = names3(r, true), u = r.pick(UNITS), An = N[0], Bn = N[1];
    var s = find(function () { return { A: r.int(22, 70), b: r.int(8, 30) }; }, function (s) { return s.A !== 30 && s.A !== 36 && safe(s.b * sinD(s.A), 1); });
    var h = s.b * sinD(s.A);
    var lo = nearBox('lower:', h, 1, [{ v: s.b * cosD(s.A), code: cp + 'h-bound', hint: 'The height is ' + t('h=' + lc(Bn) + '\\sin ' + An) + ' (not cos).' }, { v: s.b * Math.sin(s.A), code: cp + 'radian', hint: 'Radian mode: switch to degree mode.' }], u);
    var hiChk = K.number(s.b, function (v) { return Math.abs(v - h) < 0.06 ? { code: cp + 'h-bound', hint: 'The upper bound is ' + t(lc(Bn) + '=' + s.b) + ': once ' + t(lc(An) + '\\ge ' + lc(Bn)) + ' there is only one triangle.' } : null; });
    var hi = { label: 'upper:', after: u, check: unitWrap(hiChk), key: String(s.b), show: t(s.b) + ' ' + u, bad: [fx(h, 1)] };
    lo.before = null; lo.label = null; lo.after = null; hi.label = null; hi.after = u;
    var p = fieldsPart('In ' + t(triTex(N)) + ', ' + angT(An, s.A) + ' and ' + t(lc(Bn) + '=' + s.b) + ' ' + u + '. For what lengths of side ' + t(lc(An)) + ' are there <b>two</b> triangles? Give the bounds to the nearest tenth.',
      [Object.assign(lo, { after: t('<' + lc(An) + '<') }), hi], cp,
      'The height from the far end of side ' + t(lc(Bn)) + ' to the other arm of ' + t('\\angle ' + An) + ' is ' + t('h=' + s.b + '\\sin ' + dg(s.A) + '\\approx ' + F(fx(h, 2))) + '. Two triangles when side ' + t(lc(An)) + ' is longer than ' + t('h') + ' but shorter than ' + t(lc(Bn)) + ': ' + t(F(fx(h, 1)) + '<' + lc(An) + '<' + s.b) + ' (' + u + ').',
      ['Two triangles (acute ' + t('\\angle ' + An) + '): ' + t('h<' + lc(An) + '<' + lc(Bn)) + ', with ' + t('h=' + lc(Bn) + '\\sin ' + An) + '.'], 'two-triangle range');
    p.answer = t(F(fx(h, 1)) + '<' + lc(An) + '<' + s.b) + ' ' + u;
    return p;
  };
  /* the area ½ab sin C */
  B.area = function (r, cp) {
    var N = names3(r), u = r.pick(['cm', 'm', 'm', 'cm', 'km']), V = r.pick(N), oth = others(N, V);
    var s = find(function () { return { C: r.int(25, 135), a: r.int(40, 250) / 10, b: r.int(40, 250) / 10 }; }, function (s) { var A0 = 0.5 * s.a * s.b * sinD(s.C); return safe(A0, 1) && s.C !== 90 && [38, 48, 150, 52].indexOf(s.C) < 0; });
    var Ar = 0.5 * s.a * s.b * sinD(s.C), c = Math.sqrt(s.a * s.a + s.b * s.b - 2 * s.a * s.b * cosD(s.C)), sides = {}; sides[V] = c; sides[oth[0]] = s.a; sides[oth[1]] = s.b;
    var T = triSides(N, sides), lab = {}; lab[oth[0]] = lenS(s.a, u); lab[oth[1]] = lenS(s.b, u); var al = {}; al[V] = dgs(s.C);
    var alts = [{ v: s.a * s.b * sinD(s.C), code: cp + 'area-half', hint: 'Area ' + t('=\\frac{1}{2}ab\\sin C') + ': don’t forget the ' + t('\\frac{1}{2}') + '.' }, { v: Math.abs(0.5 * s.a * s.b * cosD(s.C)), code: cp + 'area-cos', hint: 'Use the <b>sine</b> of the angle between the sides: ' + t('\\frac{1}{2}ab\\sin C') + '.' }, { v: 0.5 * s.a * s.b * Math.sin(s.C), code: cp + 'radian', hint: 'Radian mode: switch to degree mode.' }];
    return nearPart('Determine the area of ' + t(triTex(N)) + ', to the nearest tenth of a square ' + unitName(u) + '.' + triFig(T, { top: topOf(T), flip: r.chance(0.5), sides: lab, angles: al }), Ar, 1, { unit: u + '²', alts: alts, before: t('\\text{Area}\\approx') },
      'The angle ' + t(dg(s.C)) + ' is between the two given sides: ' + t('\\text{Area}=\\frac{1}{2}(' + F(fx(s.a, 1)) + ')(' + F(fx(s.b, 1)) + ')\\sin ' + dg(s.C) + '\\approx ' + F(fx(Ar, 1))) + ' ' + u + '².',
      [t('\\text{Area}=\\frac{1}{2}ab\\sin C') + ', with ' + t('C') + ' the angle between sides ' + t('a') + ' and ' + t('b') + '.'], 'area of a triangle');
  };
  /* L8: the most appropriate first method (MC) */
  B.method = function (r, cp) {
    var N = names3(r), An = N[0], Bn = N[1], Cn = N[2], kind = r.pick(['sss', 'sas', 'pair', 'right', 'none', 'aas']), giv, ask, right, why;
    var v = function () { return r.int(5, 40); };
    if (kind === 'sss') { giv = t(lc(An) + '=' + v()) + ', ' + t(lc(Bn) + '=' + v()) + ', ' + t(lc(Cn) + '=' + v()); ask = t('\\angle ' + Cn); right = 'cos'; why = 'Three sides (SSS) and no angle: the cosine law.'; }
    else if (kind === 'sas') { giv = t(lc(An) + '=' + v()) + ', ' + t(lc(Bn) + '=' + v()) + ', ' + angT(Cn, r.int(25, 130)); ask = 'side ' + t(lc(Cn)); right = 'cos'; why = 'Two sides and the angle between them (SAS): no full side–angle pair, so the cosine law.'; }
    else if (kind === 'pair' || kind === 'aas') { var A1 = r.int(30, 80), B1 = r.int(25, 70); giv = angT(An, A1) + ', ' + angT(Bn, B1) + ', ' + t(lc(Bn) + '=' + v()); ask = 'side ' + t(lc(An)); right = 'sine'; why = 'A full pair (' + t('\\angle ' + Bn) + ' and ' + t(lc(Bn)) + ') and the angle opposite the side you want: the sine law.'; }
    else if (kind === 'right') { var hyp = r.int(20, 40); giv = angT(Cn, 90) + ', ' + t(lc(Cn) + '=' + hyp) + ', ' + t(lc(An) + '=' + r.int(5, hyp - 3)); ask = t('\\angle ' + An); right = 'prim'; why = 'A right triangle: a primary ratio (' + t('\\sin ' + An + '=\\frac{' + lc(An) + '}{' + lc(Cn) + '}') + ').'; }
    else { giv = t(lc(An) + '=' + v()) + ', ' + angT(Cn, r.int(25, 120)); ask = 'side ' + t(lc(Cn)); right = 'none'; why = 'Only two measurements: a triangle needs three (with at least one side).'; }
    var opts = [{ html: 'primary trigonometric ratios', right: right === 'prim', code: 'prim', why: 'Primary ratios need a right triangle.' }, { html: 'the sine law', right: right === 'sine', code: 'sine', why: 'The sine law needs a full pair: a side and the angle opposite it.' },
      { html: 'the cosine law', right: right === 'cos', code: 'cos', why: 'The cosine law is for SAS (find the third side) or SSS (find an angle).' }, { html: 'it cannot be solved without more information', right: right === 'none', code: 'none', why: 'There is enough information here.' }];
    return P.mc(r, 'In ' + t(triTex(N)) + ': ' + giv + '. To find ' + ask + ', the most appropriate first method is', opts, why, ['Right triangle → primary ratios; a full side–angle pair → sine law; SAS or SSS → cosine law.'], 'choose a method', true);
  };
  /* L8 bearings: two legs; o = { ret: also the return bearing } */
  function bearT(b) { return (b < 10 ? '00' : b < 100 ? '0' : '') + b + '^\\circ'; }
  B.bearing = function (r, cp, s0, o) {
    o = o || {};
    var u = 'km', s = find(function () { var b1 = r.int(10, 350), turn = r.pick([-1, 1]) * r.int(40, 140), b2 = norm(b1 + turn); return { b1: b1, b2: b2, d1: r.int(50, 400) / 10, d2: r.int(50, 400) / 10 }; },
      function (s) { var ang = 180 - Math.abs(((s.b2 - s.b1 + 540) % 360) - 180); var E0 = s.d1 * sinD(s.b1) + s.d2 * sinD(s.b2), N0 = s.d1 * cosD(s.b1) + s.d2 * cosD(s.b2), rb = rd(norm(Math.atan2(-E0, -N0) / RAD), 0); var ang0 = 180 - Math.abs(((s.b2 - s.b1 + 540) % 360) - 180); return s.d2 < Math.max(s.d1, Math.hypot(E0, N0)) - 0.5 && ang0 > 0 && rb > 0 && rb < 360 && safe(norm(Math.atan2(-E0, -N0) / RAD), 0) && safe(Math.hypot(E0, N0), 1) && ang >= 35 && ang <= 145 && s.b1 % 10 !== 0 && s.b2 % 5 !== 0 && Math.abs(s.d1 - s.d2) > 2 && [62, 35, 300, 20].indexOf(s.b1) < 0; });
    var E = s.d1 * sinD(s.b1) + s.d2 * sinD(s.b2), Nn = s.d1 * cosD(s.b1) + s.d2 * cosD(s.b2), d = Math.hypot(E, Nn), ang = 180 - Math.abs(((s.b2 - s.b1 + 540) % 360) - 180);
    var retB = norm(Math.atan2(-E, -Nn) / RAD), outB = norm(retB + 180);
    var alts = [{ v: Math.sqrt(s.d1 * s.d1 + s.d2 * s.d2 - 2 * s.d1 * s.d2 * cosD(180 - ang)), code: cp + 'bear-angle', hint: 'The angle in the triangle at the turning point is between the path <b>back</b> (bearing ' + t(bearT(norm(s.b1 + 180))) + ') and the new course ' + t(bearT(s.b2)) + ': ' + t(dg(ang)) + '.' }, { v: s.d1 + s.d2, code: cp + 'bear-angle', hint: 'The ship turned, so use the cosine law with the angle at the turn.' }];
    var sol = 'At the turning point the back bearing to port is ' + t(bearT(s.b1) + '+180^\\circ=' + bearT(norm(s.b1 + 180))) + '; the new course is ' + t(bearT(s.b2)) + ', so the angle at the turn is ' + t(dg(ang)) + '. ' + t('d^{2}=' + F(fx(s.d1, 1)) + '^{2}+' + F(fx(s.d2, 1)) + '^{2}-2(' + F(fx(s.d1, 1)) + ')(' + F(fx(s.d2, 1)) + ')\\cos ' + dg(ang) + '\\approx ' + F(fx(d * d, 2))) + ', so ' + t('d\\approx ' + F(fx(d, 1))) + ' km.';
    var stem = 'A boat leaves port and travels ' + t(F(fx(s.d1, 1))) + ' km on a bearing of ' + t(bearT(s.b1)) + '. It then turns and travels ' + t(F(fx(s.d2, 1))) + ' km on a bearing of ' + t(bearT(s.b2)) + '.';
    if (!o.ret) return nearPart(stem + ' How far is the boat from port, to the nearest tenth of a kilometre?', d, 1, { unit: u, alts: alts, before: t('d\\approx') }, sol,
      ['Sketch north lines at both points. The angle at the turn is between the back bearing ' + t('(\\beta_1+180^\\circ)') + ' and the new bearing.', 'Then the cosine law (SAS).'], 'bearings: distance');
    var Pang = Math.abs(((outB - s.b1 + 540) % 360) - 180);
    var dBox = nearBox(t('d\\approx'), d, 1, alts, 'km');
    var bBox = nearBox('return bearing', retB, 0, [{ v: outB, code: cp + 'bear-back', hint: 'That is the bearing of the boat <b>from</b> port. To return, add (or subtract) ' + t('180^\\circ') + '.' }, { v: norm(s.b1 + 180), code: cp + 'bear-angle', hint: 'That is the way back along the first leg only. Find the angle at port first.' }], '°', [norm(rd(outB, 0) + 180)]);
    bBox.show = t(bearT(Math.round(retB)));
    return fieldsPart(stem + ' Determine its distance from port (nearest tenth of a km) and the bearing it must travel to return directly to port (nearest degree).', [dBox, bBox], cp,
      sol + '<br>Angle at port: ' + t('\\sin P=\\frac{' + F(fx(s.d2, 1)) + '\\sin ' + dg(ang) + '}{' + F(fx(d, 2)) + '}') + ', ' + t('P\\approx ' + dg(fx(Pang, 1))) + ' (acute: the side opposite it, ' + t(F(fx(s.d2, 1))) + ' km, is not the longest side). The boat is on a bearing of ' + t(bearT(s.b1) + (norm(outB - s.b1) < 180 ? '+' : '-') + dg(fx(Pang, 1)) + '\\approx ' + bearT(Math.round(outB) % 360)) + ' from port, so the return bearing is ' + t(bearT(Math.round(outB) % 360) + (outB >= 180 ? '-' : '+') + '180^\\circ=' + bearT(Math.round(retB) % 360)) + '.',
      ['Distance: cosine law with the angle at the turn.', 'Then the angle at port (sine law), the boat’s bearing from port, and add or subtract ' + t('180^\\circ') + ' to return.'], 'bearings: distance and return bearing');
  };
  /* two hikers at speeds on bearings */
  B.hikers = function (r, cp) {
    var s = find(function () { var b1 = r.int(5, 355), b2 = norm(b1 + r.pick([-1, 1]) * r.int(30, 150)); return { b1: b1, b2: b2, v1: r.int(30, 60) / 10, v2: r.int(30, 60) / 10, tm: r.pick([1.5, 2, 2.5, 3, 0.75]) }; }, function (s) { return Math.abs(s.v1 - s.v2) >= 0.3 && !(s.b1 === 20 && s.b2 === 130); });
    var ang = Math.abs(((s.b2 - s.b1 + 540) % 360) - 180), d1 = s.v1 * s.tm, d2 = s.v2 * s.tm, d = Math.sqrt(d1 * d1 + d2 * d2 - 2 * d1 * d2 * cosD(ang));
    var alts = [{ v: Math.sqrt(s.v1 * s.v1 + s.v2 * s.v2 - 2 * s.v1 * s.v2 * cosD(ang)), code: cp + 'hike-time', hint: 'Use the distances walked (speed × time), not the speeds.' }, { v: Math.sqrt(d1 * d1 + d2 * d2 - 2 * d1 * d2 * cosD(180 - ang)), code: cp + 'bear-angle', hint: 'The angle between the paths at camp is the difference of the bearings: ' + t(dg(ang)) + '.' }, { v: Math.sqrt(d1 * d1 + d2 * d2 - 2 * d1 * d2 * Math.cos(ang)), code: cp + 'radian', hint: 'Radian mode: switch to degree mode.' }];
    var tmT = s.tm === 0.75 ? '45 minutes' : s.tm + ' hours';
    return nearPart('Two hikers leave camp at the same time. One walks on a bearing of ' + t(bearT(s.b1)) + ' at ' + t(F(fx(s.v1, 1))) + ' km/h and the other on a bearing of ' + t(bearT(s.b2)) + ' at ' + t(F(fx(s.v2, 1))) + ' km/h. How far apart are they after ' + tmT + ', to the nearest tenth of a kilometre?', d, 1, { unit: 'km', alts: alts },
      'Distances: ' + t(F(fx(s.v1, 1)) + '(' + s.tm + ')=' + F(String(rd(d1, 3)))) + ' km and ' + t(F(fx(s.v2, 1)) + '(' + s.tm + ')=' + F(String(rd(d2, 3)))) + ' km. Angle between the paths at camp: ' + t(bearT(Math.max(s.b1, s.b2)) + '-' + bearT(Math.min(s.b1, s.b2)) + '=' + dg(Math.abs(s.b2 - s.b1))) + (Math.abs(s.b2 - s.b1) > 180 ? ', so the angle between them is ' + t('360^\\circ-' + dg(Math.abs(s.b2 - s.b1)) + '=' + dg(ang)) : '') + '. ' + t('d^{2}=' + F(String(rd(d1, 3))) + '^{2}+' + F(String(rd(d2, 3))) + '^{2}-2(' + F(String(rd(d1, 3))) + ')(' + F(String(rd(d2, 3))) + ')\\cos ' + dg(ang) + '\\approx ' + F(fx(d * d, 2))) + ', so ' + t('d\\approx ' + F(fx(d, 1))) + ' km.',
      ['Distance = speed × time for each hiker.', 'The angle at camp is the difference between the bearings; then the cosine law.'], 'hikers on bearings');
  };
  /* L5/L8: height from two angles of elevation; o.kind 'cliff' (both on one side) or 'balloon' (on both sides) */
  B.twoElev = function (r, cp, s0, o) {
    o = o || {}; var kind = o.kind || r.pick(['cliff', 'balloon']);
    var s = find(function () { var al = r.int(12, 40), be = kind === 'cliff' ? al + r.int(8, 30) : r.int(30, 70); return { al: al, be: be, d: kind === 'cliff' ? r.int(10, 60) * 10 : r.int(20, 120) * 10 }; },
      function (s) { var h = kind === 'cliff' ? s.d * sinD(s.al) * sinD(s.be) / sinD(s.be - s.al) : s.d * sinD(s.al) * sinD(s.be) / sinD(s.al + s.be); return safe(h, 0) && h > 20 && !(s.al === 18 && s.be === 31) && !(s.al === 40 && s.be === 56) && !(s.al === 42 && s.be === 57); });
    var h, sl, top, lines, alts;
    if (kind === 'cliff') {
      h = s.d * sinD(s.al) * sinD(s.be) / sinD(s.be - s.al); sl = s.d * sinD(s.al) / sinD(s.be - s.al);
      lines = 'In ' + t('\\triangle ABT') + ': ' + t('\\angle ABT=180^\\circ-' + dg(s.be) + '=' + dg(180 - s.be)) + ', so ' + t('\\angle ATB=180^\\circ-' + dg(s.al) + '-' + dg(180 - s.be) + '=' + dg(s.be - s.al)) + '. ' + t('BT=\\frac{' + s.d + '\\sin ' + dg(s.al) + '}{\\sin ' + dg(s.be - s.al) + '}\\approx ' + F(fx(sl, 2))) + ' m. Height ' + t('=BT\\sin ' + dg(s.be) + '\\approx ' + F(fx(h, 0))) + ' m.';
      alts = [{ v: sl, code: cp + 'elev-hyp', hint: 'That is ' + t('BT') + ', the slant distance. The height is ' + t('BT\\sin ' + dg(s.be)) + '.' }, { v: s.d * sinD(s.al) / sinD(s.be + s.al) * sinD(s.be), code: cp + 'elev-angle', hint: 'In ' + t('\\triangle ABT') + ' the angle at ' + t('B') + ' is ' + t('180^\\circ-' + dg(s.be)) + ', so the angle at ' + t('T') + ' is ' + t(dg(s.be) + '-' + dg(s.al)) + '.' }, { v: s.d * Math.sin(s.al) * Math.sin(s.be) / Math.sin(s.be - s.al), code: cp + 'radian', hint: 'Radian mode: switch to degree mode.' }];
      top = 'From a boat at point ' + t('A') + ', the angle of elevation of the top ' + t('T') + ' of a vertical cliff is ' + t(dg(s.al)) + '. The boat moves ' + t(s.d) + ' m straight toward the cliff to point ' + t('B') + ', where the angle of elevation is ' + t(dg(s.be)) + '. Determine the height of the cliff, to the nearest metre.';
      var Hx = h / tanD(s.be), pts = { A: [-(s.d + Hx), 0], B: [-Hx, 0], F: [0, 0], T: [0, h] };
      top += '<div class="fig">' + HW.fig({ pts: pts, segs: [['A', 'B'], ['B', 'F'], ['F', 'T', 'h', { width: 3 }], ['A', 'T', null, { dash: 1, width: 1.4 }], ['B', 'T', null, { dash: 1, width: 1.4 }]], right: [['F', 'B', 'T']], angles: [['A', 'B', 'T', dgs(s.al), { r: 34 }], ['B', 'F', 'T', dgs(s.be), { r: 26 }]], names: { A: 'A', B: 'B', T: 'T' }, width: 320, height: 200, extra: [{ type: 'ground', y: 0, x0: -(s.d + Hx) - 0.05 * s.d, x1: 0.05 * s.d }], aria: 'cliff and boat' }) + '</div>';
    } else {
      h = s.d * sinD(s.al) * sinD(s.be) / sinD(s.al + s.be); sl = s.d * sinD(s.be) / sinD(s.al + s.be);
      var g = 180 - s.al - s.be;
      lines = t('\\angle AHB=180^\\circ-' + dg(s.al) + '-' + dg(s.be) + '=' + dg(g)) + '. ' + t('AH=\\frac{' + s.d + '\\sin ' + dg(s.be) + '}{\\sin ' + dg(g) + '}\\approx ' + F(fx(sl, 2))) + ' m. Height ' + t('=AH\\sin ' + dg(s.al) + '\\approx ' + F(fx(h, 0))) + ' m.';
      alts = [{ v: sl, code: cp + 'elev-hyp', hint: 'That is ' + t('AH') + ', the distance to the balloon. The height is ' + t('AH\\sin ' + dg(s.al)) + '.' }, { v: s.d * sinD(s.be) / sinD(g) * sinD(s.be), code: cp + 'elev-angle', hint: t('AH') + ' is opposite ' + t(dg(s.be)) + '; its height uses the angle at ' + t('A') + ', ' + t(dg(s.al)) + '.' }, { v: s.d * Math.sin(s.al) * Math.sin(s.be) / Math.sin(s.al + s.be), code: cp + 'radian', hint: 'Radian mode: switch to degree mode.' }];
      top = 'Two observers ' + t('A') + ' and ' + t('B') + ' stand ' + t(F(String(s.d))) + ' m apart on level ground, with a hot-air balloon ' + t('H') + ' directly above a point between them. The angles of elevation of the balloon from ' + t('A') + ' and ' + t('B') + ' are ' + t(dg(s.al)) + ' and ' + t(dg(s.be)) + '. Determine the height of the balloon, to the nearest metre.';
      var xa = h / tanD(s.al), pts2 = { A: [-xa, 0], B: [s.d - xa, 0], F: [0, 0], H: [0, h] };
      top += '<div class="fig">' + HW.fig({ pts: pts2, segs: [['A', 'B', F(String(s.d)).replace(/\\,/g, ' ') + ' m'], ['A', 'H'], ['B', 'H'], ['F', 'H', 'h', { dash: 1, width: 1.4 }]], right: [['F', 'B', 'H']], angles: [['A', 'B', 'H', dgs(s.al)], ['B', 'A', 'H', dgs(s.be)]], names: { A: 'A', B: 'B', H: 'H' }, width: 320, height: 200, aria: 'balloon between two observers' }) + '</div>';
    }
    return nearPart(top, h, 0, { unit: 'm', alts: alts, before: t('h\\approx') }, lines,
      ['Work in the oblique triangle first: find its third angle, then a slant side by the sine law.', 'Then a right triangle: height = slant side × sin(angle of elevation).'], kind === 'cliff' ? 'height of a cliff' : 'height of a balloon');
  };
  /* L8/L9: a quadrilateral split by a diagonal: cosine law (SAS) for the diagonal, then the sine law in the second triangle */
  B.quadDiag = function (r, cp) {
    var nm = r.pick([['A', 'B', 'C', 'D'], ['P', 'Q', 'R', 'S'], ['W', 'X', 'Y', 'Z'], ['J', 'K', 'L', 'M']]), A = nm[0], Bv = nm[1], C = nm[2], D = nm[3];
    var s = find(function () { return { ab: r.int(6, 20), bc: r.int(6, 20), B: r.int(70, 125), cad: r.int(30, 70), acd: r.int(30, 75) }; }, function (s) { var adc = 180 - s.cad - s.acd; return adc >= 45 && adc <= 115 && Math.abs(adc - s.cad) >= 5 && Math.abs(adc - s.acd) >= 5 && Math.abs(s.cad - s.acd) >= 5 && Math.abs(s.ab - s.bc) >= 2 && !(s.ab === 9 && s.bc === 12 && s.B === 104) && !(s.ab === 12 && s.bc === 15 && s.B === 78); });
    var u = r.pick(['m', 'cm']), ac = Math.sqrt(s.ab * s.ab + s.bc * s.bc - 2 * s.ab * s.bc * cosD(s.B)), adc = 180 - s.cad - s.acd, ask = r.pick(['AD', 'CD']);
    var val = ask === 'AD' ? ac * sinD(s.acd) / sinD(adc) : ac * sinD(s.cad) / sinD(adc), acR = rd(ac, 1), valAlso = ask === 'AD' ? acR * sinD(s.acd) / sinD(adc) : acR * sinD(s.cad) / sinD(adc);
    var askT = ask === 'AD' ? A + D : C + D, oppA = ask === 'AD' ? s.acd : s.cad, oppNm = ask === 'AD' ? '\\angle ' + A + C + D : '\\angle ' + C + A + D;
    var alts = [{ v: ask === 'AD' ? ac * sinD(s.cad) / sinD(adc) : ac * sinD(s.acd) / sinD(adc), code: cp + 'quad-diag', hint: t(askT) + ' is opposite ' + t(oppNm + '=' + dg(oppA)) + '.' }, { v: ac, code: cp + 'quad-diag', hint: 'That is the diagonal ' + t(A + C) + '. Now use it in ' + t('\\triangle ' + A + C + D) + '.' },
      { v: Math.sqrt(s.ab * s.ab + s.bc * s.bc + 2 * s.ab * s.bc * cosD(s.B)) * sinD(oppA) / sinD(adc), code: cp + 'cos-plus', hint: 'Check the diagonal: the cosine law <b>subtracts</b> ' + t('2ab\\cos B') + '.' }];
    // figure: B at origin, A and C, then D on the far side of AC
    var Pb = [0, 0], Pa = [s.ab * cosD(90 + s.B / 2), s.ab * sinD(90 + s.B / 2)], Pc = [s.bc * cosD(90 - s.B / 2), s.bc * sinD(90 - s.B / 2)];
    var dir = Math.atan2(Pa[1] - Pc[1], Pa[0] - Pc[0]) / RAD, cd = ac * sinD(s.cad) / sinD(adc), ang = dir - s.acd, Pd = [Pc[0] + cd * cosD(ang), Pc[1] + cd * sinD(ang)];
    if ((Pd[1] - Pa[1]) * (Pc[0] - Pa[0]) - (Pd[0] - Pa[0]) * (Pc[1] - Pa[1]) < 0 === ((Pb[1] - Pa[1]) * (Pc[0] - Pa[0]) - (Pb[0] - Pa[0]) * (Pc[1] - Pa[1]) < 0)) { ang = dir + s.acd; Pd = [Pc[0] + cd * cosD(ang), Pc[1] + cd * sinD(ang)]; }
    var pts = {}; pts[A] = Pa; pts[Bv] = Pb; pts[C] = Pc; pts[D] = Pd;
    var fig = '<div class="fig">' + HW.fig({ pts: pts, segs: [[A, Bv, s.ab + ' ' + u], [Bv, C, s.bc + ' ' + u], [C, D], [D, A], [A, C, null, { dash: 1, width: 1.4 }]], angles: [[Bv, A, C, dgs(s.B)], [A, C, D, dgs(s.cad)], [C, A, D, dgs(s.acd)]], names: true, width: 300, height: 260, aria: 'quadrilateral split by a diagonal' }) + '</div>';
    return nearPart('In quadrilateral ' + t(nm.join('')) + ', ' + t(A + Bv + '=' + s.ab) + ' ' + u + ', ' + t(Bv + C + '=' + s.bc) + ' ' + u + ', ' + t('\\angle ' + A + Bv + C + '=' + dg(s.B)) + ', ' + t('\\angle ' + C + A + D + '=' + dg(s.cad)) + ' and ' + t('\\angle ' + A + C + D + '=' + dg(s.acd)) + '. Determine ' + t(askT) + ', to the nearest tenth of a ' + unitName(u) + '.' + fig, val, 1, { unit: u, alts: alts, also: [valAlso], before: t(askT + '\\approx') },
      'SAS in ' + t('\\triangle ' + A + Bv + C) + ': ' + t(A + C + '^{2}=' + s.ab + '^{2}+' + s.bc + '^{2}-2(' + s.ab + ')(' + s.bc + ')\\cos ' + dg(s.B) + '\\approx ' + F(fx(ac * ac, 2))) + ', ' + t(A + C + '\\approx ' + F(fx(ac, 2))) + ' ' + u + '.<br>In ' + t('\\triangle ' + A + C + D) + ': ' + t('\\angle ' + A + D + C + '=180^\\circ-' + dg(s.cad) + '-' + dg(s.acd) + '=' + dg(adc)) + ' (a full pair with ' + t(A + C) + '). ' + t(askT + '=\\frac{' + F(fx(ac, 2)) + '\\sin ' + dg(oppA) + '}{\\sin ' + dg(adc) + '}\\approx ' + F(fx(val, 1))) + ' ' + u + '.',
      ['The diagonal ' + t(A + C) + ' is shared: find it first with the cosine law (SAS in ' + t('\\triangle ' + A + Bv + C) + ').', 'In ' + t('\\triangle ' + A + C + D) + ', find the third angle; then the sine law with the pair ' + t(A + C) + ', ' + t('\\angle ' + A + D + C) + '.'], 'quadrilateral: two triangles');
  };
  /* L6: parallelogram: sides and the shorter diagonal → the longer diagonal */
  B.parallelogram = function (r, cp) {
    var s = find(function () { var p = r.int(40, 150) / 10, q = r.int(40, 150) / 10, ang = r.int(35, 80); return { p: p, q: q, ang: ang }; }, function (s) { return Math.abs(s.p - s.q) >= 1 && safe(Math.sqrt(s.p * s.p + s.q * s.q + 2 * s.p * s.q * cosD(s.ang)), 1); });
    var dS = rd(Math.sqrt(s.p * s.p + s.q * s.q - 2 * s.p * s.q * cosD(s.ang)), 1), ca = (s.p * s.p + s.q * s.q - dS * dS) / (2 * s.p * s.q), th = acosD(ca), dL = Math.sqrt(s.p * s.p + s.q * s.q + 2 * s.p * s.q * ca);
    var u = r.pick(['cm', 'm']);
    var alts = [{ v: dS, code: cp + 'para-same', hint: 'The longer diagonal is opposite the <b>obtuse</b> angle ' + t('180^\\circ-\\theta') + ', not ' + t('\\theta') + '.' }, { v: th, code: cp + 'para-same', hint: 'That is the acute angle. Use the obtuse angle ' + t('180^\\circ-\\theta') + ' to find the longer diagonal.' }, { v: Math.sqrt(s.p * s.p + s.q * s.q), code: cp + 'cos-noroot', hint: 'The angles of the parallelogram are not right angles: use the cosine law with ' + t('180^\\circ-\\theta') + '.' }];
    var Pts = { A: [0, 0], B: [s.q, 0], C: [s.q + s.p * cosD(th), s.p * sinD(th)], D: [s.p * cosD(th), s.p * sinD(th)] };
    var fig = '<div class="fig">' + HW.fig({ pts: Pts, segs: [['A', 'B', F(fx(s.q, 1)) + ' ' + u], ['B', 'C'], ['C', 'D'], ['D', 'A', F(fx(s.p, 1)) + ' ' + u], ['B', 'D', F(fx(dS, 1)) + ' ' + u, { dash: 1, width: 1.4 }]], names: true, width: 300, height: 200, aria: 'parallelogram' }) + '</div>';
    return nearPart('A parallelogram ' + t('ABCD') + ' has sides of ' + t(F(fx(s.p, 1))) + ' ' + u + ' and ' + t(F(fx(s.q, 1))) + ' ' + u + ', and its shorter diagonal ' + t('BD') + ' is ' + t(F(fx(dS, 1))) + ' ' + u + '. Determine the length of the longer diagonal ' + t('AC') + ', to the nearest tenth.' + fig, dL, 1, { unit: u, alts: alts, also: [Math.sqrt(s.p * s.p + s.q * s.q + 2 * s.p * s.q * cosD(rd(th, 0))), Math.sqrt(s.p * s.p + s.q * s.q + 2 * s.p * s.q * cosD(rd(th, 1)))], before: t('AC\\approx') },
      'The shorter diagonal is opposite the acute angle ' + t('\\theta=\\angle A') + ': ' + t('\\cos\\theta=\\frac{' + F(fx(s.p, 1)) + '^{2}+' + F(fx(s.q, 1)) + '^{2}-' + F(fx(dS, 1)) + '^{2}}{2(' + F(fx(s.p, 1)) + ')(' + F(fx(s.q, 1)) + ')}\\approx ' + fx(ca, 4)) + ', ' + t('\\theta\\approx ' + dg(fx(th, 1))) + '. The longer diagonal is opposite ' + t('\\angle B=180^\\circ-\\theta') + ', with ' + t('\\cos(180^\\circ-\\theta)=-\\cos\\theta') + ': ' + t('AC^{2}=' + F(fx(s.p, 1)) + '^{2}+' + F(fx(s.q, 1)) + '^{2}+2(' + F(fx(s.p, 1)) + ')(' + F(fx(s.q, 1)) + ')(' + fx(ca, 4) + ')\\approx ' + F(fx(dL * dL, 2))) + ', so ' + t('AC\\approx ' + F(fx(dL, 1))) + ' ' + u + '.',
      ['Find the acute angle of the parallelogram from the triangle with the shorter diagonal (SSS).', 'Adjacent angles of a parallelogram add to ' + t('180^\\circ') + ': the longer diagonal is opposite the obtuse angle.'], 'parallelogram diagonals');
  };
  /* L8: circle chord → inscribed angle */
  B.chord = function (r, cp) {
    var s = find(function () { return { R: r.int(5, 15), L: r.int(40, 280) / 10 }; }, function (s) { return s.L < 2 * s.R - 1 && s.L > 0.4 * s.R && safe(acosD((2 * s.R * s.R - s.L * s.L) / (2 * s.R * s.R)) / 2, 0) && !(s.R === 9 && s.L === 14); });
    var cen = acosD((2 * s.R * s.R - s.L * s.L) / (2 * s.R * s.R)), ins = cen / 2;
    var alts = [{ v: cen, code: cp + 'circ-central', hint: 'That is the central angle ' + t('\\angle POQ') + '. An inscribed angle on the same arc is half of it.' }, { v: 180 - ins, code: cp + 'supp', hint: t('R') + ' is on the <b>major</b> arc: the inscribed angle is half the central angle.' }];
    return nearPart('A circle with centre ' + t('O') + ' has a radius of ' + t(s.R) + ' cm. Chord ' + t('PQ') + ' is ' + t(F(fx(s.L, 1))) + ' cm long, and ' + t('R') + ' is a point on the major arc. Determine ' + t('\\angle PRQ') + ', to the nearest degree.', ins, 0, { unit: '°', alts: alts, before: t('\\angle PRQ\\approx'), also: [rd(cen, 0) / 2, rd(cen, 1) / 2], ansPre: '\\angle PRQ\\approx ' },
      t('\\triangle POQ') + ' has sides ' + t(s.R + ',\\ ' + s.R + ',\\ ' + F(fx(s.L, 1))) + ': ' + t('\\cos\\angle POQ=\\frac{' + s.R + '^{2}+' + s.R + '^{2}-' + F(fx(s.L, 1)) + '^{2}}{2(' + s.R + ')(' + s.R + ')}\\approx ' + fx((2 * s.R * s.R - s.L * s.L) / (2 * s.R * s.R), 4)) + ', so ' + t('\\angle POQ\\approx ' + dg(fx(cen, 1))) + '. The inscribed angle on the same arc is half: ' + t('\\angle PRQ\\approx ' + dg(fx(ins, 0))) + '.',
      ['Two radii and the chord make a triangle: SSS, cosine law for the central angle.', 'An inscribed angle is half the central angle on the same arc.'], 'circle: inscribed angle');
  };
  /* L8: clock hands — the distance between the tips */
  B.clock = function (r, cp) {
    var s = find(function () { return { h: r.int(1, 11), m: r.pick([0, 0, 10, 15, 20, 30, 40, 45, 50]), L1: r.int(8, 18), L2: r.int(5, 12) }; }, function (s) { var a = Math.abs((30 * s.h + 0.5 * s.m) - 6 * s.m) % 360; a = a > 180 ? 360 - a : a; return a > 8 && a < 172 && s.L1 > s.L2 + 1 && !(s.h === 2 && s.m === 0) && !(s.h === 4 && s.m === 30) && !(s.h === 7 && s.m === 20); });
    var hA = 30 * s.h + 0.5 * s.m, mA = 6 * s.m, a = Math.abs(hA - mA) % 360; a = a > 180 ? 360 - a : a;
    var d = Math.sqrt(s.L1 * s.L1 + s.L2 * s.L2 - 2 * s.L1 * s.L2 * cosD(a)), aW = Math.abs(30 * s.h - mA) % 360; aW = aW > 180 ? 360 - aW : aW;
    var alts = [{ v: Math.sqrt(s.L1 * s.L1 + s.L2 * s.L2 - 2 * s.L1 * s.L2 * cosD(aW)), code: cp + 'clock-angle', hint: 'The hour hand moves too: in ' + s.m + ' minutes it turns ' + t(s.m + '\\times 0.5^\\circ=' + dg(0.5 * s.m)) + ' past the ' + s.h + '.' }];
    var tm = s.h + ':' + (s.m < 10 ? '0' : '') + s.m;
    return nearPart('The minute hand of a clock is ' + t(s.L1) + ' cm long and the hour hand is ' + t(s.L2) + ' cm long. Determine the distance between the tips of the hands at ' + tm + ', to the nearest tenth of a centimetre.', d, 1, { unit: 'cm', alts: s.m ? alts : [] },
      'Hour hand: ' + t(s.h + '\\times 30^\\circ' + (s.m ? '+' + s.m + '(0.5^\\circ)' : '') + '=' + dg(hA)) + ' from 12; minute hand: ' + t(s.m + '\\times 6^\\circ=' + dg(mA)) + '. The angle between them is ' + t(dg(a)) + '. ' + t('d^{2}=' + s.L1 + '^{2}+' + s.L2 + '^{2}-2(' + s.L1 + ')(' + s.L2 + ')\\cos ' + dg(a) + '\\approx ' + F(fx(d * d, 2))) + ', ' + t('d\\approx ' + F(fx(d, 1))) + ' cm.',
      ['Each hour mark is ' + t('30^\\circ') + '; the minute hand turns ' + t('6^\\circ') + ' a minute and the hour hand ' + t('0.5^\\circ') + ' a minute.', 'Then the cosine law with the angle between the hands.'], 'clock hands');
  };
  S.B = B;

  /* =====================================================================================================
   * The Unit 3 test
   * ===================================================================================================== */
  var CP = 'u3t-';
  function pt(id, outcome, level, fn, o) { return { id: id, outcome: outcome, level: level, make: function (r, s) { return fn(r, CP, s, o); } }; }
  function one(num, outcome, level, lesson, stem, fn, o) { return { num: String(num), outcome: outcome, lesson: lesson, stem: stem, parts: [pt(String(num), outcome, level, fn, o)] }; }
  function ptShared2(r) { var s = B.ptShared(r, { quads: [2, 3, 4], triple: r.chance(0.6) }); s.given = true; return s; }
  function ptShared1(r) { var s = B.ptShared(r, { quads: [1, 2, 3, 4], triple: r.chance(0.35) }); s.given = true; return s; }

  var QUESTIONS = [
    /* ---------------- Beginning ---------------- */
    { num: '1', outcome: 'T1', lesson: 'L1', stem: 'Angles in standard position.', parts: [pt('1a', 'T1', 'BEG', B.refAngle), pt('1b', 'T1', 'BEG', B.fromRef)] },
    { num: '2', outcome: 'T2', lesson: 'L2', shared: ptShared1, stem: ptStem, parts: [pt('2a', 'T2', 'BEG', B.rDist), pt('2b', 'T2', 'BEG', B.oneRatio)] },
    one(3, 'T2', 'BEG', 'L3', 'The CAST rule.', B.otherAngle),
    { num: '4', outcome: 'T2', lesson: 'L4', stem: 'Exact values.', parts: [pt('4a', 'T2', 'BEG', B.exactVal), pt('4b', 'T2', 'BEG', B.exactVal, { mix: true, quadP: 0.5 })] },
    { num: '5', outcome: 'T3', lesson: 'L5, L6', stem: 'Each triangle is drawn to scale.', parts: [pt('5a', 'T3', 'BEG', B.sineSide), pt('5b', 'T3', 'BEG', B.cosSide)] },
    one(6, 'T3', 'BEG', 'L7', 'The ambiguous case.', B.countTri),
    /* ---------------- Progressing ---------------- */
    { num: '7', outcome: 'T1', lesson: 'L1, L4', stem: 'Reference angles and exact angles.', parts: [pt('7a', 'T1', 'PRG', B.sameRef), pt('7b', 'T1', 'PRG', B.exactAngle)] },
    { num: '8', outcome: 'T2', lesson: 'L2', shared: ptShared2, stem: ptStem, parts: [pt('8a', 'T2', 'PRG', B.ratios), pt('8b', 'T2', 'PRG', B.thetaPt)] },
    one(9, 'T2', 'PRG', 'L3', 'The other two ratios.', B.otherRatios),
    { num: '10', outcome: 'T2', lesson: 'L3, L4', stem: 'Solving equations.', parts: [pt('10a', 'T2', 'PRG', B.solveLinear, { interval: true }), pt('10b', 'T2', 'PRG', B.solveExact)] },
    { num: '11', outcome: 'T3', lesson: 'L5', shared: function (r) { return B.ssaOneShared(r); }, stem: function (s) { return ssaStem(s) + ssaFig(s); }, parts: [pt('11a', 'T3', 'PRG', function (r, cp, s) { return B.ssaAngle(r, cp, s, { stem: false }); }), pt('11b', 'T3', 'PRG', B.ssaSide)] },
    one(12, 'T3', 'PRG', 'L6', 'The cosine law.', B.cosAngle, { largest: true }),
    one(13, 'T3', 'PRG', 'L7', 'The ambiguous case.', function (r, cp) { return B.ambAngles(r, cp, B.ambShared(r, { mix: true })); }),
    one(14, 'T3', 'PRG', 'L8', 'Bearings.', B.bearing),
    /* ---------------- Mastery ---------------- */
    one(15, 'T1', 'MAS', 'L1', 'Two angles with the same reference angle.', B.sumAB),
    one(16, 'T2', 'MAS', 'L2', 'A missing coordinate.', B.kFind),
    one(17, 'T2', 'MAS', 'L4', 'A squared equation.', B.solveExact, { sq: true }),
    one(18, 'T3', 'MAS', 'L7', 'Both triangles.', function (r, cp) { return B.ambSides(r, cp, B.ambShared(r)); }),
    one(19, 'T3', 'MAS', 'L6, L8', 'Two triangles.', B.quadDiag)
  ];

  HW.defineTest({
    id: 'u3test', unit: 3, title: 'Unit 3 Test', calc: true,
    blurb: 'The Unit 3 outcomes-based test on T1 (angles in standard position), T2 (the trigonometric ratios from 0° to 360°) and T3 (the sine law, the cosine law and the ambiguous case): reference angles, ratios from a point, CAST, exact values, solving equations, oblique triangles, bearings and two-triangle problems — in Beginning, Progressing and Mastery boxes. Calculator allowed (Degree mode); exact-value parts ask for exact answers.',
    // Short version (about half the time): every outcome keeps its three boxes. Beginning: a reference angle (T1), r and a
    // ratio from a point (T2), a sine-law and a cosine-law side (T3); Progressing: the three other angles (T1), the three
    // ratios and θ from a point (T2), the one-triangle SSA angle and side (T3); Mastery: A and B from their sum (T1), k and
    // θ (T2), both triangles of an ambiguous case (T3).
    short: ['1a', '2', '5', '7a', '8', '11', '15', '16', '18'],
    questions: QUESTIONS
  });
})(window);
