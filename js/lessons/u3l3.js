/* Math 20-1 · Unit 3 · Lesson 3 — The CAST Rule: Signs and Solving for Angles (outcome T2 on every part)
 * Assignment 3 (u3_l03.tex, Questions 1–18) and the Lesson 3 Extra Practice (u3_ep03.tex, A1–A5, B1–B6, C1–C3).
 * Every part is a generator: the booklet question's idea, form and difficulty with new numbers (the lesson's example
 * numbers and the booklet's own numbers are left out where that is easy). Calculator allowed (Unit 3), degree mode:
 * angles to the rounding asked (answers within the rounding are accepted; more decimals get a "round it" nudge).
 *
 * This file also holds the Unit 3 trig kit, HW.u3kit (used by u3l4.js; Lessons 3.1–3.2 and later Unit 3 lessons may use
 * it inside make(), when every script has loaded):
 *   angles      U.norm(a), U.quad(a) (1–4, 0 on an axis), U.ref(a), U.place(ref, q), U.ROM, U.sign(fn, q), U.quadsFor(fn, s),
 *               U.castWhy(q), U.deg(x) ('35^\circ'), U.refTex(a) ('180^\circ-132^\circ=48^\circ')
 *   exact       U.spec(p, q, m) = p√m/q normalized; U.exact(fn, a) (any multiple of 30° or 45°, 'undef' when undefined);
 *               U.val(spec), U.tex(spec, {unrat}) ; U.num/U.nAdd/U.nMul/U.nDiv/U.nVal/U.nTex (sums of radicals for
 *               exact expressions); U.solveExact(fn, spec) / U.solveCalc(fn, a, dp, aTex) -> { sols, ref, quads, lines }
 *   checkers    U.exactCheck(want, opt)   want: number | spec | 'undef'. opt.rational (radical in a denominator gets a nudge),
 *                 opt.decOk (an exact terminating decimal is fine), opt.alts [{ v, code, hint }], opt.signHint
 *               U.angleCheck(sols, opt)  "all solutions" as a set of angles, any order, "no solution" possible.
 *                 opt.dp (1 = tenth, 0 = degree) or opt.exact; opt.fn, opt.ref (θR) for the diagnoses (only one
 *                 solution, the reference angle given, a wrong CAST quadrant, a negative calculator angle, radian mode);
 *                 opt.all (every solution in 0°–360° when the interval is smaller), opt.interval (tex), opt.altSets
 *                 [{ sols, code, hint }] (e.g. a sign slip while isolating), opt.missingHint, opt.noneHint, opt.saidNoneHint
 *               U.ratioCheck(fn, angle) "write as ± the same ratio of θR" (−cos 12°); U.quadCheck(quads, conds) (select I–IV);
 *               U.degCheck(ans, alts) one angle in a number box; U.exprCheck(keyTex, v) an expression in a variable (k)
 *   parts       U.P.exact(prompt, want, opt, sol, hints, text), U.P.angles(prompt, sols, opt, sol, hints, text),
 *               U.P.boxes(prompt, boxes, sol, hints, text) (several exact / degree boxes), U.P.quads, U.P.sign (positive/negative),
 *               U.P.ratio, U.P.deg, U.mc (deduplicated multiple choice)
 *   figures     U.sketch({ x, y, label, sides: { x, y, r }, ref, arc, thetaLabel, quads, width }) coordinate sketch of an angle in
 *               standard position: axes, terminal arm to P, rotation arc, reference triangle and θR; U.cast({ hi: [quads] })
 *   keypads     'u3ang' (angles, comma, °, no solution), 'u3exact' / 'u3exactU' (√, fraction, ±; U adds "undefined"),
 *               'u3ratio' (sin cos tan, −, °), 'u3var' (√, fraction, x², brackets and the letter k)
 *
 * Conversions: "identify the errors" (Q13) → multiple choice of explanations + the correct solutions; "sketch each
 * angle" (Q5) → the sketch is in the worked solution; "in terms of k" (C2) → expressions in k, checked at several values.
 * Levels: LIM BEG EMG PRG ADV MAS. Mastery: Q7, Q17, Extra C1–C3. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, B = K.P, ex = HW.ex, F = HW.fmt, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
  var LID = 'u3l3';

  /* ============================== the Unit 3 kit ============================== */
  var U = HW.u3kit = {};
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var r = a % b; a = b; b = r; } return a; }
  function rd(x, dp) { return K.roundTo(x, dp); }
  function fx(x, dp) { return rd(x, dp).toFixed(dp); }
  function pickWhere(gen, okf, tag) { for (var i = 0; i < 8000; i++) { var o = gen(); if (okf(o)) return o; } throw new Error((tag || LID) + ': no valid numbers'); }
  function sq(n) { var s = Math.round(Math.sqrt(n)); return s * s === n; }
  U.gcd = gcd; U.rd = rd; U.fx = fx; U.pickWhere = pickWhere; U.isSq = sq;
  var TG = { sin: function (d) { return Math.sin(d * Math.PI / 180); }, cos: function (d) { return Math.cos(d * Math.PI / 180); }, tan: function (d) { return Math.tan(d * Math.PI / 180); } };
  var INV = { sin: function (v) { return Math.asin(v) * 180 / Math.PI; }, cos: function (v) { return Math.acos(v) * 180 / Math.PI; }, tan: function (v) { return Math.atan(v) * 180 / Math.PI; } };
  U.TG = TG; U.INV = INV;

  /* ---------------- angles ---------------- */
  U.norm = function (a) { a = a % 360; if (a < 0) a += 360; return a; };
  U.quad = function (a) { a = U.norm(a); if (Math.abs(a % 90) < 1e-9) return 0; return Math.floor(a / 90) + 1; };
  U.ref = function (a) { a = U.norm(a); var q = U.quad(a); return q === 1 ? a : q === 2 ? 180 - a : q === 3 ? a - 180 : q === 4 ? 360 - a : (a === 90 || a === 270 ? 90 : 0); };
  U.place = function (ref, q) { return q === 1 ? ref : q === 2 ? 180 - ref : q === 3 ? 180 + ref : 360 - ref; };
  U.ROM = ['', 'I', 'II', 'III', 'IV'];
  U.SIGNS = { sin: [0, 1, 1, -1, -1], cos: [0, 1, -1, -1, 1], tan: [0, 1, -1, 1, -1] };
  U.sign = function (fn, q) { return U.SIGNS[fn][q]; };
  U.quadsFor = function (fn, s) { return [1, 2, 3, 4].filter(function (q) { return U.sign(fn, q) === s; }); };
  U.castWhy = function (q) { return ['', 'all three ratios are positive (A)', 'only sin is positive (S)', 'only tan is positive (T)', 'only cos is positive (C)'][q]; };
  U.why = { sin: 'y', cos: 'x', tan: 'y/x' };
  U.deg = function (x) { return x + '^\\circ'; };
  U.fnT = function (fn, v) { return '\\' + fn + (v == null ? '\\theta' : v); };
  U.quadsTex = function (qs) { return qs.map(function (q) { return U.ROM[q]; }).join(qs.length === 2 ? ' and ' : ', '); };
  U.refTex = function (a) {
    var q = U.quad(a), r = U.ref(a);
    if (q === 1) return '\\theta_R=' + U.deg(a);
    return '\\theta_R=' + (q === 2 ? U.deg(180) + '-' + U.deg(a) : q === 3 ? U.deg(a) + '-' + U.deg(180) : U.deg(360) + '-' + U.deg(a)) + '=' + U.deg(r);
  };
  U.placeTex = function (q, refS) { return q === 1 ? U.deg(refS) : q === 2 ? U.deg(180) + '-' + U.deg(refS) : q === 3 ? U.deg(180) + '+' + U.deg(refS) : U.deg(360) + '-' + U.deg(refS); };
  U.randRef = function (r, avoidSpecial) { return pickWhere(function () { return r.int(4, 86); }, function (x) { return !avoidSpecial || [30, 45, 60].indexOf(x) < 0; }); };
  U.angleIn = function (r, q, avoid) { return pickWhere(function () { return U.place(U.randRef(r, true), q); }, function (a) { return (avoid || []).indexOf(a) < 0; }); };

  /* ---------------- exact values: p√m/q ---------------- */
  U.spec = function (p, q, m) {
    q = q == null ? 1 : q; m = m == null ? 1 : m;
    if (p === 0 || m === 0) return { p: 0, q: 1, m: 1 };
    var f = ex.nthFactor(m, 2); if (f > 1) { p *= f; m /= f * f; }
    if (q < 0) { p = -p; q = -q; }
    var g = gcd(p, q) || 1; return { p: p / g, q: q / g, m: m };
  };
  /* √a / √b (with a sign) as a spec: √(ab)/b */
  U.radRatio = function (s, a, b) { return U.spec(s, b, a * b); };
  var BASE = { sin: { 0: [0, 1, 1], 30: [1, 2, 1], 45: [1, 2, 2], 60: [1, 2, 3], 90: [1, 1, 1] }, cos: { 0: [1, 1, 1], 30: [1, 2, 3], 45: [1, 2, 2], 60: [1, 2, 1], 90: [0, 1, 1] }, tan: { 0: [0, 1, 1], 30: [1, 3, 3], 45: [1, 1, 1], 60: [1, 1, 3], 90: 'undef' } };
  U.BASE = BASE;
  U.exact = function (fn, a) {
    a = U.norm(a);
    if (a % 90 === 0) {
      var P = { 0: [1, 0], 90: [0, 1], 180: [-1, 0], 270: [0, -1] }[a];
      if (fn === 'sin') return U.spec(P[1]); if (fn === 'cos') return U.spec(P[0]);
      return P[0] === 0 ? 'undef' : U.spec(P[1] / P[0]);
    }
    var rf = U.ref(a), b = BASE[fn][rf]; if (!b) throw new Error('u3kit: no exact value for ' + fn + ' ' + a);
    return U.spec(U.sign(fn, U.quad(a)) * b[0], b[1], b[2]);
  };
  U.val = function (s) { return s === 'undef' ? NaN : typeof s === 'number' ? s : s.p * Math.sqrt(s.m) / s.q; };
  U.neg = function (s) { return s === 'undef' ? s : { p: -s.p, q: s.q, m: s.m }; };
  U.same = function (a, b) { return a === b || (a !== 'undef' && b !== 'undef' && a.p === b.p && a.q === b.q && a.m === b.m); };
  U.tex = function (s, o) {
    o = o || {};
    if (s === 'undef') return '\\text{undefined}';
    if (s.p === 0) return '0';
    var neg = s.p < 0, p = Math.abs(s.p), rad = s.m > 1 ? '\\sqrt{' + s.m + '}' : '';
    if (o.unrat && s.m > 1 && s.q % s.m === 0) { // p√m/q = p/((q/m)√m)
      var d = s.q / s.m; return (neg ? '-' : '') + '\\frac{' + p + '}{' + (d === 1 ? '' : d) + rad + '}';
    }
    var top = (p === 1 && rad ? '' : String(p)) + rad;
    return (neg ? '-' : '') + (s.q === 1 ? top : '\\frac{' + top + '}{' + s.q + '}');
  };
  U.hasUnrat = function (s) { return s !== 'undef' && s.m > 1 && s.q % s.m === 0; };
  /* plain-text radical for SVG labels: s·√X simplified, e.g. −2√10 */
  U.plainRad = function (s, X) { if (!X) return '0'; var f = ex.nthFactor(X, 2), m = X / (f * f); return (s < 0 ? '−' : '') + (m === 1 ? String(f) : (f === 1 ? '' : f) + '√' + m); };
  U.radTexOf = function (s, X) { if (!X) return '0'; var f = ex.nthFactor(X, 2), m = X / (f * f); return (s < 0 ? '-' : '') + (m === 1 ? String(f) : (f === 1 ? '' : f) + '\\sqrt{' + m + '}'); };

  /* sums of radicals for exact expressions: { m: [p, q] } (m squarefree) */
  function qn(p, q) { if (q < 0) { p = -p; q = -q; } var g = gcd(p, q) || 1; return [p / g, q / g]; }
  U.num = function (s) { var o = {}; if (typeof s === 'number') { if (s) o[1] = qn(s, 1); return o; } if (Array.isArray(s)) { if (s[0]) o[1] = qn(s[0], s[1]); return o; } if (s.p) o[s.m] = qn(s.p, s.q); return o; };
  U.nAdd = function (a, b) { var o = {}; [a, b].forEach(function (x) { Object.keys(x).forEach(function (m) { var c = x[m], d = o[m]; o[m] = d ? qn(d[0] * c[1] + c[0] * d[1], d[1] * c[1]) : c; if (!o[m][0]) delete o[m]; }); }); return o; };
  U.nNeg = function (a) { var o = {}; Object.keys(a).forEach(function (m) { o[m] = [-a[m][0], a[m][1]]; }); return o; };
  U.nMul = function (a, b) {
    var o = {};
    Object.keys(a).forEach(function (m1) { Object.keys(b).forEach(function (m2) {
      var mm = Number(m1) * Number(m2), f = ex.nthFactor(mm, 2), m = mm / (f * f), c = qn(a[m1][0] * b[m2][0] * f, a[m1][1] * b[m2][1]), add = {}; add[m] = c;
      o = U.nAdd(o, add);
    }); });
    return o;
  };
  U.nDiv = function (a, b) { // b a single term c√m
    var ks = Object.keys(b); if (ks.length !== 1) throw new Error('u3kit: divide by a sum');
    var m = Number(ks[0]), c = b[ks[0]], inv = {}; inv[m] = qn(c[1], c[0] * m); return U.nMul(a, inv);
  };
  U.nVal = function (a) { return Object.keys(a).reduce(function (s, m) { return s + a[m][0] / a[m][1] * Math.sqrt(Number(m)); }, 0); };
  U.nSingle = function (a) { var ks = Object.keys(a); if (!ks.length) return U.spec(0); if (ks.length > 1) return null; var c = a[ks[0]]; return U.spec(c[0], c[1], Number(ks[0])); };
  U.nTex = function (a) {
    var s1 = U.nSingle(a); if (s1) return U.tex(s1);
    var ms = Object.keys(a).map(Number).sort(function (x, y) { return x - y; }), L = ms.reduce(function (l, m) { var q = a[m][1]; return l * q / gcd(l, q); }, 1);
    var allNeg = ms.every(function (m) { return a[m][0] < 0; }), sg = allNeg ? -1 : 1;
    var top = ms.map(function (m, i) { var c = sg * a[m][0] * L / a[m][1], ac = Math.abs(c), body = m === 1 ? String(ac) : (ac === 1 ? '' : ac) + '\\sqrt{' + m + '}'; return (c < 0 ? '-' : i ? '+' : '') + body; }).join('');
    return (allNeg ? '-' : '') + (L === 1 ? (allNeg ? '\\left(' + top + '\\right)' : top) : '\\frac{' + top + '}{' + L + '}');
  };

  /* ---------------- solving ---------------- */
  var QUADRANTAL = { sin: { '0': [0, 180], '1': [90], '-1': [270] }, cos: { '0': [90, 270], '1': [0], '-1': [180] }, tan: { '0': [0, 180] } };
  function signWord(s) { return s > 0 ? 'Positive' : 'Negative'; }
  /* calculator: fn θ = a (a a number; aTex how it is written, e.g. '-\\frac{5}{12}') */
  U.solveCalc = function (fn, a, dp, aTex) {
    dp = dp == null ? 1 : dp; aTex = aTex || String(a);
    var lines = [], key = String(rd(a, 12));
    if (fn !== 'tan' && Math.abs(a) > 1 + 1e-12) {
      lines.push(t(aTex + (a > 1 ? '>1' : '<-1')) + ', and ' + (fn === 'sin' ? 'sine' : 'cosine') + ' is never ' + (a > 1 ? 'greater than ' + t('1') : 'less than ' + t('-1')) + ' (' + t(fn === 'sin' ? '|y|\\le r' : '|x|\\le r') + '). No solution.');
      return { sols: [], none: true, lines: lines };
    }
    if (QUADRANTAL[fn][key]) {
      var qs = QUADRANTAL[fn][key];
      var why = fn === 'sin' ? (a === 0 ? t('y=0') + ': on the ' + t('x') + '-axis.' : a > 0 ? t('y=r') + ': on the positive ' + t('y') + '-axis.' : t('y=-r') + ': on the negative ' + t('y') + '-axis.')
        : fn === 'cos' ? (a === 0 ? t('x=0') + ': on the ' + t('y') + '-axis.' : a > 0 ? t('x=r') + ': on the positive ' + t('x') + '-axis.' : t('x=-r') + ': on the negative ' + t('x') + '-axis.') : t('y=0') + ': on the ' + t('x') + '-axis.';
      lines.push(why + ' ' + t('\\theta=' + qs.map(U.deg).join('\\text{ or }')) + (qs.length === 1 ? ' (one solution)' : ''));
      return { sols: qs.slice(), quadrantal: true, lines: lines };
    }
    var s = a > 0 ? 1 : -1, quads = U.quadsFor(fn, s), ref = INV[fn](Math.abs(a));
    var absTex = aTex.replace(/^-/, ''), refS = fx(ref, 2);
    var sols = quads.map(function (q) { return U.place(ref, q); }).sort(function (x, y) { return x - y; });
    lines.push(signWord(s) + ' ' + fn + ': Quadrants ' + U.quadsTex(quads) + '.');
    lines.push(t('\\theta_R=\\' + fn + '^{-1}\\left(' + absTex + '\\right)\\approx ' + U.deg(refS)));
    lines.push(quads.map(function (q) { return U.ROM[q] + ': ' + t((q === 1 ? '\\theta\\approx ' : '\\theta\\approx ' + U.placeTex(q, refS) + '\\approx ') + U.deg(fx(U.place(ref, q), dp))); }).join(' &nbsp; '));
    return { sols: sols, ref: ref, quads: quads, lines: lines };
  };
  /* exact: fn θ = spec */
  U.solveExact = function (fn, s) {
    var lines = [], v = U.val(s);
    if (s === 'undef') { lines.push(t('\\tan\\theta=\\frac{y}{x}') + ' is undefined when ' + t('x=0') + ': on the ' + t('y') + '-axis. ' + t('\\theta=90^\\circ\\text{ or }270^\\circ')); return { sols: [90, 270], quadrantal: true, lines: lines }; }
    if (fn !== 'tan' && Math.abs(v) > 1 + 1e-12) { lines.push(t(U.tex(s)) + ' is outside ' + t('-1') + ' to ' + t('1') + ': no solution.'); return { sols: [], none: true, lines: lines }; }
    if (s.m === 1 && s.q === 1 && QUADRANTAL[fn][String(s.p)]) return U.solveCalc(fn, s.p, 0, String(s.p));
    var sg = s.p > 0 ? 1 : -1, abs = { p: Math.abs(s.p), q: s.q, m: s.m }, ref = null;
    [30, 45, 60].forEach(function (r) { var b = BASE[fn][r]; if (U.same(U.spec(b[0], b[1], b[2]), abs)) ref = r; });
    if (ref == null) throw new Error('u3kit: not a special value ' + fn + ' ' + U.tex(s));
    var quads = U.quadsFor(fn, sg), sols = quads.map(function (q) { return U.place(ref, q); }).sort(function (x, y) { return x - y; });
    lines.push(signWord(sg) + ' ' + fn + ': Quadrants ' + U.quadsTex(quads) + '. ' + t('\\' + fn + '\\theta_R=' + U.tex(abs)) + ', so ' + t('\\theta_R=' + U.deg(ref)) + '.');
    lines.push(t('\\theta=' + sols.map(U.deg).join('\\text{ or }')));
    return { sols: sols, ref: ref, quads: quads, lines: lines };
  };

  /* ---------------- reading answers ---------------- */
  var UNDEF = /^(undefined|undef|und|not ?defined|does ?not ?exist|dne)$/i;
  function plainOf(resp) {
    return String(resp == null ? '' : resp).replace(/\\left|\\right/g, '').replace(/\\(?:text|mathrm|textrm|operatorname)\{([^{}]*)\}/g, ' $1 ')
      .replace(/\\[,;:! ]|\\quad|\\qquad|~/g, ' ').replace(/\s+/g, ' ').trim();
  }
  U.isUndef = function (resp) { return UNDEF.test(plainOf(resp).replace(/[.\s]+$/, '').trim()); };
  function walk(a, f) { if (!a || typeof a !== 'object') return; f(a); ['a', 'b', 'n'].forEach(function (k) { if (a[k] && typeof a[k] === 'object') walk(a[k], f); }); }
  function hasRoot(a) { var h = false; walk(a, function (x) { if (x.t === 'root') h = true; }); return h; }
  function rootInDen(a) { var h = false; walk(a, function (x) { if (x.t === 'div' && hasRoot(x.b)) h = true; }); return h; }
  function notSimplest(a) { var h = null; walk(a, function (x) { if (x.t === 'root') { var r = ex.rat(x.a); if (r && r[1] !== 1) h = 'frac'; else if (r && r[0] > 0 && ex.nthFactor(r[0], 2) > 1) h = r[0]; } }); return h; }
  function unreduced(a) {
    var h = false;
    walk(a, function (x) { if (x.t !== 'div') return; var num = ex.radical(x.a), den = ex.rat(x.b); if (num && den && den[1] === 1 && num.k[1] === 1 && Math.abs(den[0]) > 1 && gcd(num.k[0], den[0]) > 1) h = true; if (num && den && den[1] === 1 && Math.abs(den[0]) === 1) h = true; });
    return h;
  }
  /* An exact value. want: number | spec | 'undef'. */
  U.exactCheck = function (want, opt) {
    opt = opt || {};
    var W = want === 'undef' ? NaN : U.val(want);
    var alts = (opt.alts || []).filter(function (a) { return a.v === 'undef' || (isFinite(a.v) && !(isFinite(W) && ex.eq(a.v, W))); });
    return function (resp) {
      var und = U.isUndef(resp);
      if (want === 'undef') {
        if (und) return ok();
        var a0 = K.read(resp); if (a0.res) return a0.res;
        if (a0.val === 0 || Math.abs(a0.val) < 1e-12) return wrong('u3l3-undef-zero', opt.undefHint || t('\\tan\\theta=\\frac{y}{x}') + ', and ' + t('x=0') + ' here: dividing by zero is <b>undefined</b>. (The ratio is ' + t('0') + ' when ' + t('y=0') + '.)');
        return wrong('u3l3-undef', opt.undefHint || 'The point is on the ' + t('y') + '-axis, so ' + t('x=0') + ' and ' + t('\\frac{y}{x}') + ' divides by zero: the ratio is <b>undefined</b>.');
      }
      if (und) {
        for (var j = 0; j < alts.length; j++) if (alts[j].v === 'undef') return wrong(alts[j].code, alts[j].hint);
        return wrong('u3l3-not-undef', W === 0 ? 'The ratio is ' + t('0') + ' here: ' + t('0\\div r=0') + '. A ratio is undefined only when it divides by ' + t('0') + ' (' + t('\\tan\\theta') + ' with ' + t('x=0') + ').' : 'This ratio has a value: it would be undefined only if it divided by ' + t('0') + '.');
      }
      var a = K.read(resp); if (a.res) return a.res;
      var sh = ex.shape(a.ast);
      if (Object.keys(sh.vars).length) return form('var', 'Give a number (fractions and radicals), with no letters.');
      if (!isFinite(a.val)) return wrong('value', null);
      if (ex.eq(a.val, W) || (W === 0 && Math.abs(a.val) < 1e-12)) {
        if (sh.decimals && !opt.decOk) return form('u3l3-dec-exact', 'Right value — now write it exactly, as a fraction' + (hasRoot(a.ast) || (want && want.m > 1) ? ' with radicals' : '') + ' (no decimals).');
        var ns = notSimplest(a.ast);
        if (ns === 'frac') return form('u3l3-rad-frac', 'Right value — now simplify: leave no fraction under the radical (' + t('\\sqrt{\\frac{a}{b}}=\\frac{\\sqrt{a}}{\\sqrt{b}}') + ').');
        if (ns) return form('not-simplest', 'Right value — now simplify the radical: ' + t('\\sqrt{' + ns + '}') + ' has a perfect-square factor.');
        if (opt.rational && rootInDen(a.ast)) return form('u3l3-rationalize', 'Right value — now rationalize the denominator: multiply the top and bottom by the radical, e.g. ' + t('\\frac{1}{\\sqrt{3}}=\\frac{\\sqrt{3}}{3}') + '.');
        if (unreduced(a.ast) || (ex.plainFraction(a.ast) && gcd(ex.plainFraction(a.ast)[0], ex.plainFraction(a.ast)[1]) > 1)) return form('lowest', 'Right value — now reduce the fraction to lowest terms.');
        if (sh.pow) return form('simplify', 'Right value — now work out the power, e.g. ' + t('\\left(\\frac{\\sqrt{3}}{2}\\right)^{2}=\\frac{3}{4}') + '.');
        return ok();
      }
      if (sh.decimals && Math.abs(a.val - W) < 0.006 * Math.max(1, Math.abs(W))) return form('decimal', 'That’s a decimal approximation. Give the <b>exact</b> value: a fraction' + (want && want.m > 1 ? ' with a radical' : '') + ', no decimals.');
      for (var i = 0; i < alts.length; i++) if (alts[i].v !== 'undef' && ex.eq(a.val, alts[i].v)) return wrong(alts[i].code, alts[i].hint);
      var h = opt.diag ? opt.diag(a.val, a.ast) : null; if (h) return wrong(h.code, h.hint);
      if (W !== 0 && ex.eq(a.val, -W)) return wrong(opt.signCode || 'u3l3-sign', opt.signHint || 'Check the sign: use CAST for the quadrant of the angle.');
      return wrong('value', null);
    };
  };
  /* an expression in one variable (Extra C2: in terms of k), checked at several values */
  U.exprCheck = function (keyTex, v, opt) {
    opt = opt || {};
    var kp = ex.parse(keyTex); if (!kp.ok) throw new Error('u3kit: bad key ' + keyTex);
    var S = [0.23, 0.41, 0.67, 0.88], env = function (x) { var e = {}; e[v] = x; return e; }, KV = S.map(function (x) { return ex.value(kp.ast, env(x)); });
    var alts = (opt.alts || []).map(function (c) { var p = ex.parse(c.tex); return { vals: S.map(function (x) { return ex.value(p.ast, env(x)); }), code: c.code, hint: c.hint }; });
    function same(A, Bv) { return A.every(function (x, i) { return isFinite(x) && ex.eq(x, Bv[i], 1e-8); }); }
    return function (resp) {
      var a = K.read(resp); if (a.res) return a.res;
      var vs = Object.keys(ex.shape(a.ast).vars).filter(function (x) { return x !== v; });
      if (vs.length) return wrong('var', 'Use only the letter ' + t(v) + '.');
      var V = S.map(function (x) { return ex.value(a.ast, env(x)); });
      if (same(V, KV)) return ok();
      for (var i = 0; i < alts.length; i++) if (same(V, alts[i].vals)) return wrong(alts[i].code, alts[i].hint);
      if (same(V, KV.map(function (x) { return -x; }))) return wrong('u3l3-sign', opt.signHint || 'Check the sign for the quadrant (CAST).');
      return wrong('value', null);
    };
  };

  /* angles: a set of degrees, any order */
  U.readAngles = function (resp) {
    var s = plainOf(resp).replace(/\{,\}/g, ',').replace(/−|–/g, '-');
    var low = s.toLowerCase().replace(/\\/g, '');
    if (!s) return { empty: true };
    if (/no ?solutions?|none|varnothing|emptyset|∅/.test(low) && !/\d/.test(low)) return { none: true };
    if (/^\s*\\?\{\s*\\?\}\s*$/.test(s)) return { none: true };
    s = s.replace(/\^\{?\s*\\circ\s*\}?|\\circ|\\degree|°|\^\{\s*\}/g, ' ').replace(/\\theta|θ|\\alpha|\\beta|\b[A-Za-z]\s*=|=/g, ' ')
      .replace(/\\\{|\\\}|[{}]/g, ' ').replace(/\bor\b|\band\b|&|\\lor/gi, ',').replace(/-\s+/g, '-').replace(/\s*\.\s*(?=\d)/g, '.');
    var bits = s.split(/[,;\s]+/).filter(Boolean), vals = [], decs = [];
    if (!bits.length) return { empty: true };
    for (var i = 0; i < bits.length; i++) {
      if (!/^-?(\d+(\.\d*)?|\.\d+)$/.test(bits[i])) return { bad: true };
      vals.push(Number(bits[i])); decs.push((bits[i].split('.')[1] || '').length);
    }
    return { vals: vals, decs: decs };
  };
  U.angleCheck = function (sols, opt) {
    opt = opt || {};
    var exact = !!opt.exact, dp = exact ? 0 : opt.dp == null ? 1 : opt.dp, tol = exact ? 1e-6 : 0.6 * Math.pow(10, -dp) + 1e-9, loose = exact ? 1e-6 : 0.6 + 1e-9;
    var place = dp === 1 ? 'tenth of a degree' : dp === 0 ? 'degree' : dp + ' decimal places';
    var fnN = opt.fn, quads = opt.quads || [];
    function near(v, x, tl) { return Math.abs(v - x) <= (tl || tol); }
    function inSet(v, set, tl) { for (var i = 0; i < set.length; i++) if (near(v, set[i], tl)) return i; return -1; }
    var refPl = opt.ref == null ? [] : [1, 2, 3, 4].map(function (q) { return U.place(opt.ref, q); });
    var radPl = opt.ref == null || exact ? [] : [1, 2, 3, 4].map(function (q) { return U.place(opt.ref * Math.PI / 180, q); });
    return function (resp) {
      var p = U.readAngles(resp);
      if (p.empty) return form('empty', 'Type the angle' + (sols.length === 1 ? '' : 's') + ' in degrees' + (sols.length > 1 ? ', separated by commas' : '') + ' — or press <b>no solution</b>.');
      if (p.bad) return form('u3l3-ang-read', 'Type just the angles in degrees, separated by commas, e.g. ' + t(exact ? '30,\\ 150' : '24.8,\\ 155.2') + ' (or press <b>no solution</b>).');
      if (p.none) return sols.length ? wrong('u3l3-said-none', opt.saidNoneHint || 'There are solutions: ' + (fnN && fnN !== 'tan' ? 'the value is between ' + t('-1') + ' and ' + t('1') + ', so ' : '') + 'find the reference angle and place it in the quadrants where the ratio has this sign.') : ok();
      if (!sols.length) return wrong('u3l3-none', opt.noneHint || 'Check the value first: ' + (fnN === 'tan' ? 'tangent can be any number.' : t('\\sin\\theta') + ' and ' + t('\\cos\\theta') + ' are always between ' + t('-1') + ' and ' + t('1') + '.'));
      var vals = p.vals;
      for (var d = 0; d < vals.length; d++) for (var e = d + 1; e < vals.length; e++) if (Math.abs(vals[d] - vals[e]) < 1e-9) return form('duplicate', 'You listed ' + t(vals[d] + '^\\circ') + ' twice. List each angle once.');
      var hit = vals.map(function (v) { return inSet(v, sols); });
      if (hit.every(function (h) { return h >= 0; }) && hit.filter(function (h, i) { return hit.indexOf(h) === i; }).length === vals.length && vals.length === sols.length) {
        if (!exact && p.decs.some(function (dd) { return dd > dp; })) return form('round', 'Right — now round each angle to the nearest ' + place + '.');
        return ok();
      }
      // the right angles to the wrong rounding
      if (!exact && dp >= 1 && vals.length === sols.length && vals.every(function (v) { return inSet(v, sols, loose) >= 0; })) return form('round', 'Close — give each angle to the nearest ' + place + ' (keep the full calculator value until the end).');
      var alts = opt.altSets || [];
      for (var k = 0; k < alts.length; k++) {
        var as = alts[k].sols;
        if (as.length === vals.length && vals.every(function (v) { return inSet(v, as) >= 0; }) && !(as.length === sols.length && as.every(function (x) { return inSet(x, sols) >= 0; }))) return wrong(alts[k].code, alts[k].hint);
      }
      var bad = vals.filter(function (v, i) { return hit[i] < 0; });
      if (!bad.length) return wrong('u3l3-missing', opt.missingHint || ('There ' + (sols.length - vals.length === 1 ? 'is another solution' : 'are ' + (sols.length - vals.length) + ' more solutions') + (fnN && quads.length === 2 ? ': ' + t('\\' + fnN + '\\theta') + ' has this sign in two quadrants, ' + U.quadsTex(quads) + '. Place ' + t('\\theta_R') + ' in both.' : '.')));
      var u = bad[0];
      if (u < 0 || u >= 360) return wrong('u3l3-range', 'Give angles from ' + t('0^\\circ') + ' to ' + t('360^\\circ') + '. ' + (u < 0 && fnN ? 'A negative calculator angle such as ' + t('\\' + (fnN === 'cos' ? 'sin' : fnN) + '^{-1}(-0.4)\\approx ' + (fnN === 'tan' ? '-21.8' : '-23.6') + '^\\circ') + ' isn’t the reference angle: use the <b>positive</b> value to find ' + t('\\theta_R') + ', then place it in the quadrants.' : ''));
      if (opt.all && inSet(u, opt.all) >= 0) return wrong('u3l3-interval', t(fx(u, exact ? 0 : dp) + '^\\circ') + ' solves the equation, but it isn’t in the interval ' + t(opt.interval || '') + '. Keep only the solutions in the interval.');
      if (radPl.length && inSet(u, radPl) >= 0) return wrong('u3l3-radian', 'Your calculator is in <b>radian</b> mode. Switch it to <b>degree</b> mode (TI-84: MODE → DEGREE) and try again.');
      if (opt.ref != null && near(u, opt.ref) && inSet(opt.ref, sols) < 0) return wrong('u3l3-ref', t(fx(opt.ref, exact ? 0 : dp) + '^\\circ') + ' is the reference angle ' + t('\\theta_R') + ', not a solution here' + (fnN && quads.length ? ': ' + t('\\' + fnN + '\\theta') + ' is ' + (U.sign(fnN, quads[0]) > 0 ? 'positive' : 'negative') + ', so ' + t('\\theta') + ' is in Quadrants ' + U.quadsTex(quads) : '') + '. Place ' + t('\\theta_R') + ' in those quadrants.');
      if (refPl.length && inSet(u, refPl) >= 0) return wrong('u3l3-quad', 'Check the quadrants with CAST' + (fnN && quads.length ? ': ' + t('\\' + fnN + '\\theta') + ' is ' + (U.sign(fnN, quads[0]) > 0 ? 'positive' : 'negative') + ' in Quadrants ' + U.quadsTex(quads) + '. ' + quads.map(function (q) { return U.ROM[q] + ': ' + t(q === 1 ? '\\theta_R' : q === 2 ? '180^\\circ-\\theta_R' : q === 3 ? '180^\\circ+\\theta_R' : '360^\\circ-\\theta_R'); }).join(', ') + '.' : '.'));
      return wrong('value', opt.valueHint || null);
    };
  };
  U.angKey = function (sols, dp, exact) { return sols.length ? sols.map(function (x) { return exact ? String(Math.round(x)) : fx(x, dp); }).join(', ') : '\\text{no solution}'; };
  U.angTex = function (sols, dp, exact) { return sols.length ? sols.map(function (x) { return U.deg(exact ? String(Math.round(x)) : fx(x, dp)); }).join(',\\ ') : '\\text{no solution}'; };

  /* "write as ± the same ratio of θR" (−cos 12°) */
  U.readRatio = function (resp) {
    var s = String(resp == null ? '' : resp).replace(/\\left|\\right|\\[,;: !]|\\quad|~|\s/g, '').replace(/\\(?:operatorname|mathrm|text)\{(\w+)\}/g, '\\$1')
      .replace(/\^\{?\\circ\}?|\\circ|\\degree|°/g, '').replace(/−|–/g, '-');
    if (s.indexOf('=') >= 0) s = s.slice(s.lastIndexOf('=') + 1);
    s = s.replace(/\\(sin|cos|tan)/g, '$1').replace(/[(){}]/g, '').replace(/\\theta|θ/g, '');
    var m = /^([+-]?)(sin|cos|tan)(\d+(?:\.\d+)?)$/.exec(s);
    return m ? { sign: m[1] === '-' ? -1 : 1, fn: m[2], ang: Number(m[3]) } : null;
  };
  U.ratioCheck = function (fn, a) {
    var q = U.quad(a), rf = U.ref(a), s = U.sign(fn, q);
    return function (resp) {
      if (!String(resp == null ? '' : resp).trim()) return form('empty', 'Type your answer first.');
      var p = U.readRatio(resp);
      if (!p) return form('u3l3-ratio-read', 'Write the sign (if negative), the ratio and the reference angle, like ' + t('-\\cos 12^\\circ') + '.');
      if (p.fn !== fn) return wrong('u3l3-fn', 'Keep the same ratio: ' + t('\\' + fn) + ' stays ' + t('\\' + fn) + '. Only the angle changes (to ' + t('\\theta_R') + '), and CAST gives the sign.');
      if (p.ang === a) return wrong('u3l3-same', 'Write it with the <b>reference angle</b> ' + t('\\theta_R') + ' (the acute angle between the terminal arm and the ' + t('x') + '-axis), not ' + t(U.deg(a)) + ' itself.');
      if (p.ang !== rf) return wrong('u3l3-refangle', 'Check the reference angle: ' + t(U.deg(a)) + ' is in Quadrant ' + U.ROM[q] + ', so ' + t(q === 2 ? '\\theta_R=180^\\circ-\\theta' : q === 3 ? '\\theta_R=\\theta-180^\\circ' : '\\theta_R=360^\\circ-\\theta') + '.');
      if (p.sign !== s) return wrong('u3l3-sign', t(U.deg(a)) + ' is in Quadrant ' + U.ROM[q] + ', where ' + U.castWhy(q) + ': ' + t('\\' + fn + ' ' + U.deg(a)) + ' is ' + (s > 0 ? 'positive' : 'negative') + '.');
      return ok();
    };
  };
  /* quadrants I–IV (select). conds: [[fn, sign], …] all true at once */
  U.quadCheck = function (want, conds) {
    var W = want.map(function (q) { return U.ROM[q]; });
    function condT(c) { return t('\\' + c[0] + '\\theta' + (c[1] > 0 ? '>0' : '<0')); }
    return function (resp) {
      if (!resp || !resp.length) return form('empty', 'Tap the quadrant' + (want.length > 1 ? 's' : '') + ' first.');
      var extra = resp.filter(function (x) { return W.indexOf(x) < 0; }), missing = W.filter(function (x) { return resp.indexOf(x) < 0; });
      if (!extra.length && !missing.length) return ok();
      if (extra.length) {
        var q = U.ROM.indexOf(extra[0]);
        for (var i = 0; i < conds.length; i++) if (U.sign(conds[i][0], q) !== conds[i][1]) {
          var c = conds[i], why = c[0] === 'sin' ? t('y') + (U.sign('sin', q) > 0 ? ' is positive' : ' is negative') : c[0] === 'cos' ? t('x') + (U.sign('cos', q) > 0 ? ' is positive' : ' is negative') : t('x') + ' and ' + t('y') + (U.sign('tan', q) > 0 ? ' have the same sign' : ' have opposite signs');
          return wrong(conds.length > 1 && resp.length > 1 ? 'u3l3-quad-both' : 'u3l3-quad-wrong', 'In Quadrant ' + extra[0] + ', ' + why + ', so ' + t('\\' + c[0] + '\\theta') + ' is ' + (U.sign(c[0], q) > 0 ? 'positive' : 'negative') + ' there: Quadrant ' + extra[0] + ' doesn’t fit ' + condT(c) + '.' + (conds.length > 1 ? ' Both conditions must be true at once.' : ''));
        }
      }
      return wrong('u3l3-quad-one', condT(conds[0]) + ' is true in <b>two</b> quadrants. Which other quadrant has ' + (conds[0][0] === 'sin' ? t('y') + (conds[0][1] > 0 ? '>0' : '<0') : conds[0][0] === 'cos' ? t('x') + (conds[0][1] > 0 ? '>0' : '<0') : t('x') + ' and ' + t('y') + (conds[0][1] > 0 ? ' with the same sign' : ' with opposite signs')) + '?');
    };
  };
  /* one angle in a number box (degrees) */
  U.degCheck = function (ans, alts) {
    return K.number(ans, function (v) { for (var i = 0; i < (alts || []).length; i++) if (Math.abs(v - alts[i].v) < 1e-9 && Math.abs(alts[i].v - ans) > 1e-9) return { code: alts[i].code, hint: alts[i].hint }; return null; });
  };

  /* ---------------- codes ---------------- */
  HW.addCodes({
    'u3l3-undef-zero': 'Said 0 for an undefined ratio', 'u3l3-undef': 'Missed that the ratio is undefined', 'u3l3-not-undef': 'Said “undefined” for a ratio with a value',
    'u3l3-dec-exact': 'Exact value written as a decimal', 'u3l3-rad-frac': 'Fraction left under a radical', 'u3l3-rationalize': 'Radical left in the denominator', 'u3l3-sign': 'Wrong sign (CAST)',
    'u3l3-ang-read': 'Angles not written as a list', 'u3l3-said-none': 'Said “no solution” when there are solutions', 'u3l3-none': 'Gave angles when there is no solution',
    'u3l3-missing': 'Missed a solution (only one quadrant)', 'u3l3-range': 'Angle outside 0°–360° (negative calculator angle)', 'u3l3-interval': 'Kept a solution outside the interval',
    'u3l3-radian': 'Calculator in radian mode', 'u3l3-ref': 'Gave the reference angle as a solution', 'u3l3-quad': 'Wrong quadrant (CAST)',
    'u3l3-ratio-read': 'Ratio not written as ± ratio of θR', 'u3l3-fn': 'Changed the ratio', 'u3l3-same': 'Kept the angle instead of θR', 'u3l3-refangle': 'Wrong reference angle',
    'u3l3-quad-both': 'Chose a quadrant that fails one condition', 'u3l3-quad-wrong': 'Chose a quadrant with the wrong sign', 'u3l3-quad-one': 'Gave only one of two quadrants',
    'u3l3-xy': 'Mixed up x and y (sin = y/r, cos = x/r)', 'u3l3-tan-flip': 'tan written as x/y', 'u3l3-other': 'Gave the angle itself, not the other one',
    'u3l3-isolate': 'Sign slip isolating the ratio', 'u3l3-nodivide': 'Didn’t divide by the coefficient', 'u3l3-sum-same': 'Used the given angles instead of the other ones',
    'u3l3-wrong-axis': 'Used cos for a vertical distance (or sin for horizontal)', 'u3l3-ref-only': 'Gave the reference angle'
  });
  HW.addPartial({ 'u3l3-sign': 'b', 'u3l3-missing': 'b', 'u3l3-range': 'b', 'u3l3-interval': 's', 'u3l3-radian': 's', 'u3l3-ref': 'b', 'u3l3-quad': 'b', 'u3l3-said-none': 'n', 'u3l3-none': 'n',
    'u3l3-fn': 'n', 'u3l3-same': 'n', 'u3l3-refangle': 'b', 'u3l3-quad-one': 's', 'u3l3-quad-both': 'b', 'u3l3-xy': 'b', 'u3l3-tan-flip': 'b', 'u3l3-isolate': 's', 'u3l3-nodivide': 'b',
    'u3l3-undef-zero': 'b', 'u3l3-other': 'n', 'u3l3-sum-same': 'n', 'u3l3-wrong-axis': 'b', 'u3l3-ref-only': 'b' });

  /* ---------------- keypads (browser only) ---------------- */
  var W = HW.widgets;
  if (W && W.KEYSETS) {
    var dg = function (n) { return { label: String(n), tex: String(n), plain: String(n) }; };
    var KK = { del: { label: '⌫', fn: 'del', title: 'Delete' }, clear: { label: 'clear', fn: 'clear' }, left: { label: '◀', fn: 'left', title: 'Move left' }, right: { label: '▶', fn: 'right', title: 'Move right (out of a box)' },
      enter: { label: 'Check ↵', fn: 'enter', wide: true }, sqrt: { label: '√', tex: '\\sqrt{#0}', plain: 'sqrt(', title: 'Square root' }, frac: { label: '<sup>a</sup>⁄<sub>b</sub>', tex: '\\frac{#@}{#?}', plain: '/', title: 'Fraction' },
      minus: { label: '−', tex: '-', plain: '-' }, plus: { label: '+', tex: '+', plain: '+' }, dot: { label: '.', tex: '.', plain: '.' }, comma: { label: ',', tex: ',', plain: ', ', title: 'Next angle' },
      degk: { label: '°', tex: '^{\\circ}', plain: '°', title: 'Degrees (optional)' }, none: { label: 'no solution', tex: '\\text{no solution}', plain: 'no solution', title: 'The equation has no solution', wide: true },
      undef: { label: 'undefined', tex: '\\text{undefined}', plain: 'undefined', title: 'The ratio is undefined (divides by zero)' },
      sin: { label: 'sin', tex: '\\sin ', plain: 'sin ' }, cos: { label: 'cos', tex: '\\cos ', plain: 'cos ' }, tan: { label: 'tan', tex: '\\tan ', plain: 'tan ' },
      sq2: { label: 'x²', tex: '^{2}', plain: '^2', title: 'Squared' }, par: { label: '( )', tex: '\\left(#0\\right)', plain: '(', title: 'Brackets' } };
    W.KEYSETS.u3ang = [[dg(7), dg(8), dg(9), KK.degk, KK.del], [dg(4), dg(5), dg(6), KK.comma, KK.clear], [dg(1), dg(2), dg(3), KK.minus, KK.left, KK.right], [dg(0), KK.dot, KK.none, KK.enter]];
    W.KEYSETS.u3exact = [[dg(7), dg(8), dg(9), KK.sqrt, KK.del], [dg(4), dg(5), dg(6), KK.frac, KK.clear], [dg(1), dg(2), dg(3), KK.minus, KK.plus, KK.left, KK.right], [dg(0), KK.dot, KK.enter]];
    W.KEYSETS.u3exactU = [[dg(7), dg(8), dg(9), KK.sqrt, KK.del], [dg(4), dg(5), dg(6), KK.frac, KK.clear], [dg(1), dg(2), dg(3), KK.minus, KK.plus, KK.left, KK.right], [dg(0), KK.undef, KK.enter]];
    W.KEYSETS.u3ratio = [[dg(7), dg(8), dg(9), KK.sin, KK.del], [dg(4), dg(5), dg(6), KK.cos, KK.clear], [dg(1), dg(2), dg(3), KK.tan, KK.left, KK.right], [dg(0), KK.minus, KK.degk, KK.enter]];
    W.KEYSETS.u3var = function (opt) {
      var v = (opt && opt.vars && opt.vars[0]) || 'k', vk = { label: '<i>' + v + '</i>', tex: v, plain: v };
      return [[dg(7), dg(8), dg(9), KK.sqrt, KK.frac, KK.del], [dg(4), dg(5), dg(6), vk, KK.sq2, KK.clear], [dg(1), dg(2), dg(3), KK.minus, KK.plus, KK.left, KK.right], [dg(0), KK.par, KK.enter]];
    };
    if (W.KEYHELP) {
      W.KEYHELP.u3ang = ['Type each angle in degrees with a comma between them, e.g. ' + HW.k('24.8,\\ 155.2') + ' (the ° is optional). Press <b>no solution</b> if there is none.', 'Type e.g. <code>24.8, 155.2</code> or <code>no solution</code>.'];
      W.KEYHELP.u3exact = ['Use <b><sup>a</sup>⁄<sub>b</sub></b> for a fraction and <b>√</b> for a root, e.g. ' + HW.k('-\\frac{\\sqrt{3}}{2}') + '. Press <b>▶</b> to step out of a box.', 'Type e.g. <code>-sqrt(3)/2</code> or <code>-21/29</code>.'];
      W.KEYHELP.u3exactU = ['Use <b><sup>a</sup>⁄<sub>b</sub></b> and <b>√</b>, e.g. ' + HW.k('-\\frac{\\sqrt{3}}{2}') + ', or press <b>undefined</b>. Press <b>▶</b> to step out of a box.', 'Type e.g. <code>-sqrt(3)/2</code>, or <code>undefined</code>.'];
      W.KEYHELP.u3ratio = ['Type the sign, the ratio and the reference angle, e.g. − <b>cos</b> 12 for ' + HW.k('-\\cos 12^\\circ') + '.', 'Type e.g. <code>-cos 12</code>.'];
      W.KEYHELP.u3var = ['Use <b>√</b>, <b><sup>a</sup>⁄<sub>b</sub></b> and <b>x²</b>, e.g. ' + HW.k('-\\sqrt{1-k^{2}}') + '. Press <b>▶</b> to step out of a box.', 'Type e.g. <code>-sqrt(1 - k^2)</code>.'];
    }
  }

  /* ---------------- part builders ---------------- */
  U.P = {};
  U.P.exact = function (prompt, want, opt, sol, hints, text) {
    opt = opt || {};
    var key = U.tex(want), p = B.math(prompt, U.exactCheck(want, opt), key, sol, hints || [], text, { keys: opt.undef || want === 'undef' ? 'u3exactU' : 'u3exact', before: opt.before, after: opt.after, placeholder: 'e.g. -sqrt(3)/2' });
    if (want === 'undef') p.answer = 'undefined';
    p.bad = (opt.alts || []).filter(function (a) { return a.v !== 'undef' && isFinite(a.v) && !(want !== 'undef' && ex.eq(a.v, U.val(want))); }).map(function (a) { return a.tex || String(a.v); }).concat(want === 'undef' ? ['0'] : [want.p ? U.tex(U.neg(want)) : '1', 'undefined']);
    p.good = [];
    if (want !== 'undef' && !opt.rational && U.hasUnrat(want)) p.good.push(U.tex(want, { unrat: true }));
    if (want !== 'undef' && opt.decOk && want.m === 1 && [1, 2, 4, 5, 8, 10, 20, 25, 40, 50, 100].indexOf(want.q) >= 0) p.good.push(String(want.p / want.q));
    return p;
  };
  /* boxes: [{ label, name, want, rational, undef, decOk, alts, signHint } | { label, name, deg: ans, alts }] */
  U.P.boxes = function (prompt, boxes, sol, hints, text) {
    var anyU = boxes.some(function (b) { return b.undef || b.want === 'undef'; });
    var fields = boxes.map(function (b) { return b.deg != null ? { label: b.label, name: b.name || 'Angle', mode: 'number', after: '°' } : { label: b.label, name: b.name || String(b.label).replace(/\\\(|\\\)|\\/g, ''), mode: 'math', keys: anyU ? 'u3exactU' : 'u3exact', placeholder: 'e.g. -3/5' }; });
    var checks = boxes.map(function (b) { return b.deg != null ? U.degCheck(b.deg, b.alts) : U.exactCheck(b.want, b); });
    var keys = boxes.map(function (b) { return b.deg != null ? String(b.deg) : U.tex(b.want); });
    var answer = boxes.map(function (b) { return b.label + ' ' + (b.deg != null ? t(U.deg(b.deg)) : b.want === 'undef' ? 'undefined' : t(U.tex(b.want))); }).join('<br>');
    var p = B.fields(prompt, fields, checks, keys, answer, sol, hints || [], text);
    p.bad = [keys.map(function (k, i) { var b = boxes[i]; return b.deg != null ? String(b.deg + 180) : b.want === 'undef' ? '0' : b.want.p ? U.tex(U.neg(b.want)) : '1'; })];
    if (keys.length >= 2 && keys[0] !== keys[1] && boxes[0].deg == null && boxes[1].deg == null) { var sw = keys.slice(); sw[0] = keys[1]; sw[1] = keys[0]; p.bad.push(sw); }
    var g = keys.map(function (k, i) { var b = boxes[i]; return b.deg == null && b.want !== 'undef' && !b.rational && U.hasUnrat(b.want) ? U.tex(b.want, { unrat: true }) : k; });
    p.good = g.join('|') !== keys.join('|') ? [g] : [];
    return p;
  };
  U.P.angles = function (prompt, sols, opt, sol, hints, text) {
    opt = opt || {};
    var dp = opt.dp == null ? 1 : opt.dp, ex0 = !!opt.exact;
    var p = B.math(prompt, U.angleCheck(sols, opt), U.angKey(sols, dp, ex0), sol, hints || [], text, { keys: 'u3ang', placeholder: ex0 ? 'e.g. 30, 150' : 'e.g. 24.8, 155.2' });
    p.answer = sols.length ? t('\\theta=' + U.angTex(sols, dp, ex0)) : 'No solution';
    var bad = [];
    if (sols.length > 1) bad.push(U.angKey(sols.slice(0, 1), dp, ex0));
    if (sols.length) bad.push('\\text{no solution}'); else bad.push('30, 150');
    if (opt.ref != null && sols.length && sols.every(function (x) { return Math.abs(x - opt.ref) > 0.1; })) bad.push(U.angKey([opt.ref].concat(sols.slice(1)), dp, ex0));
    (opt.altSets || []).forEach(function (a) { if (a.sols.length) bad.push(U.angKey(a.sols, dp, ex0)); });
    p.bad = bad;
    if (sols.length) p.good = [U.angKey(sols.slice().reverse(), dp, ex0), sols.map(function (x) { return (ex0 ? String(Math.round(x)) : fx(x, dp)) + '^{\\circ}'; }).join(','), '\\theta=' + U.angKey(sols, dp, ex0)];
    return p;
  };
  U.P.quads = function (prompt, quads, conds, sol, hints, text) {
    return { prompt: prompt, input: { type: 'select', options: [1, 2, 3, 4].map(function (q) { return { value: U.ROM[q], html: 'Quadrant ' + U.ROM[q] }; }), help: 'Tap every quadrant that fits. Tap again to unselect.' },
      check: U.quadCheck(quads, conds), key: quads.map(function (q) { return U.ROM[q]; }), answer: quads.length === 1 ? 'Quadrant ' + U.ROM[quads[0]] : 'Quadrants ' + U.quadsTex(quads), solution: sol, hints: hints || [], text: text };
  };
  U.P.sign = function (r, prompt, s, why, sol, hints, text) {
    var p = B.mc(r, prompt, [{ html: '<b>Positive</b>', right: s > 0, why: s > 0 ? null : why, code: 'u3l3-said-pos' }, { html: '<b>Negative</b>', right: s < 0, why: s < 0 ? null : why, code: 'u3l3-said-neg' }], sol, hints, text, true);
    p.tries = 1; p.input.columns = 2; return p;
  };
  U.P.ratio = function (prompt, fn, a, sol, hints, text) {
    var q = U.quad(a), rf = U.ref(a), s = U.sign(fn, q), key = (s < 0 ? '-' : '') + '\\' + fn + ' ' + rf + '^{\\circ}';
    var p = B.math(prompt, U.ratioCheck(fn, a), key, sol, hints || [], text, { keys: 'u3ratio', before: t('\\' + fn + ' ' + U.deg(a) + '=\\;'), placeholder: 'e.g. -cos 12' });
    p.answer = t('\\' + fn + ' ' + U.deg(a) + '=' + (s < 0 ? '-' : '') + '\\' + fn + ' ' + U.deg(rf));
    p.bad = [(s > 0 ? '-' : '') + '\\' + fn + ' ' + rf, (s < 0 ? '-' : '') + '\\' + fn + ' ' + a, (s < 0 ? '-' : '') + '\\' + (fn === 'sin' ? 'cos' : 'sin') + ' ' + rf];
    p.good = [(s < 0 ? '-' : '') + 'cos'.replace('cos', fn) + '(' + rf + ')', (s < 0 ? '-' : '') + '\\' + fn + rf];
    return p;
  };
  U.P.deg = function (prompt, ans, alts, sol, hints, text) {
    var p = B.number(prompt, ans, null, sol, hints, text, { after: '°' });
    p.check = U.degCheck(ans, alts); p.answer = t(U.deg(ans));
    p.bad = (alts || []).filter(function (a) { return Math.abs(a.v - ans) > 1e-9; }).map(function (a) { return String(a.v); });
    return p;
  };
  U.mc = function (r, prompt, opts, sol, hints, text, keepOrder) {
    var seen = {}, out = [];
    opts.forEach(function (op) { var k = String(op.html).replace(/\s/g, ''); if (seen[k] && !op.right) return; seen[k] = 1; out.push(op); });
    if (out.length < 3) throw new Error('u3kit: too few distinct options');
    return B.mc(r, prompt, out, sol, hints || [], text, keepOrder);
  };

  /* ---------------- figures ---------------- */
  var INK = '#2b3340', COL = '#2b55a0', ACC = '#b4462f', SOFT = '#9aa3b2';
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function txt(x, y, s, o) {
    o = o || {};
    var body = esc(s).replace(/θR/g, 'θ<tspan font-size="' + Math.round((o.size || 13) * 0.7) + '" dy="3">R</tspan>');
    return '<text x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" font-size="' + (o.size || 13) + '" text-anchor="' + (o.anchor || 'middle') + '" dominant-baseline="central" fill="' + (o.color || INK) + '"' + (o.italic ? ' font-style="italic"' : '') + ' paint-order="stroke" stroke="#fff" stroke-width="3" stroke-linejoin="round">' + body + '</text>';
  }
  function ln(x1, y1, x2, y2, o) { o = o || {}; return '<line x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) + '" stroke="' + (o.color || INK) + '" stroke-width="' + (o.w || 1.4) + '"' + (o.dash ? ' stroke-dasharray="4 3"' : '') + ' stroke-linecap="round"/>'; }
  function head(x, y, ang, color, size) { // arrowhead at (x, y) pointing along ang (radians, SVG coordinates)
    size = size || 7; var a1 = ang + Math.PI * 0.85, a2 = ang - Math.PI * 0.85;
    return '<polygon points="' + x.toFixed(1) + ',' + y.toFixed(1) + ' ' + (x + size * Math.cos(a1)).toFixed(1) + ',' + (y + size * Math.sin(a1)).toFixed(1) + ' ' + (x + size * Math.cos(a2)).toFixed(1) + ',' + (y + size * Math.sin(a2)).toFixed(1) + '" fill="' + color + '"/>';
  }
  function arcPath(cx, cy, rr, a0, a1) { // math angles in degrees, counterclockwise from a0 to a1
    var pts = [], n = Math.max(6, Math.ceil(Math.abs(a1 - a0) / 4));
    for (var i = 0; i <= n; i++) { var a = (a0 + (a1 - a0) * i / n) * Math.PI / 180; pts.push((cx + rr * Math.cos(a)).toFixed(1) + ',' + (cy - rr * Math.sin(a)).toFixed(1)); }
    return pts;
  }
  /* coordinate sketch: o = { x, y (numbers), label ('P(−8, −15)'), sides: { x, y, r } labels, ref (draw the reference triangle; default
   * true off the axes), arc (rotation arc, default true), thetaLabel ('θ'), refLabel ('θR'), quads (Roman numerals), width } */
  U.sketch = function (o) {
    o = o || {};
    var Wd = o.width || 230, H = Wd, cx = Wd / 2, cy = H / 2, R = Wd * 0.33, x = o.x, y = o.y;
    var th = o.theta != null ? o.theta : U.norm(Math.atan2(y, x) * 180 / Math.PI), q = U.quad(th), g = [];
    // a sketch, not to scale: a reference angle under 20° or over 70° is drawn as 20° / 70° so the labels have room
    if (q && o.exact !== true) { var rf0 = U.ref(th); th = U.place(Math.max(20, Math.min(70, rf0)), q); }
    var px = cx + R * Math.cos(th * Math.PI / 180), py = cy - R * Math.sin(th * Math.PI / 180);
    g.push(ln(10, cy, Wd - 12, cy, { color: SOFT, w: 1.2 }), head(Wd - 8, cy, 0, SOFT, 6), ln(cx, H - 10, cx, 12, { color: SOFT, w: 1.2 }), head(cx, 8, -Math.PI / 2, SOFT, 6));
    g.push(txt(Wd - 10, cy + 12, 'x', { italic: true, size: 12, color: '#56606e' }), txt(cx + 11, 12, 'y', { italic: true, size: 12, color: '#56606e' }));
    if (o.quads) [[1, 0.82, 0.16], [2, 0.18, 0.16], [3, 0.18, 0.86], [4, 0.82, 0.86]].forEach(function (z) { g.push(txt(Wd * z[1], H * z[2], U.ROM[z[0]], { size: 11, color: SOFT })); });
    var refOn = o.ref !== false && q !== 0;
    if (refOn) {
      g.push(ln(px, py, px, cy, { color: COL, dash: true, w: 1.3 }));
      var bx = px > cx ? -7 : 7, by = py < cy ? -7 : 7;
      if (Math.abs(py - cy) > 14 && Math.abs(px - cx) > 14) g.push('<polyline points="' + (px + bx).toFixed(1) + ',' + cy.toFixed(1) + ' ' + (px + bx).toFixed(1) + ',' + (cy + by).toFixed(1) + ' ' + px.toFixed(1) + ',' + (cy + by).toFixed(1) + '" fill="none" stroke="' + COL + '" stroke-width="1"/>');
    }
    g.push(ln(cx, cy, px, py, { color: COL, w: 2.2 }), '<circle cx="' + px.toFixed(1) + '" cy="' + py.toFixed(1) + '" r="3.2" fill="' + COL + '"/>');
    if (o.arc !== false) {
      var ra = Wd * 0.075, pts = arcPath(cx, cy, ra, 0, th - 6);
      g.push('<polyline points="' + pts.join(' ') + '" fill="none" stroke="' + ACC + '" stroke-width="1.4"/>');
      var ea = (th - 3) * Math.PI / 180, ex2 = cx + ra * Math.cos(ea), ey = cy - ra * Math.sin(ea);
      g.push(head(ex2, ey, -(th + 90) * Math.PI / 180, ACC, 6));
      var la = (th > 100 ? 40 : th / 2) * Math.PI / 180, lr = ra + 11;
      if (th > 20 || !refOn) g.push(txt(cx + lr * Math.cos(la), cy - lr * Math.sin(la), o.thetaLabel || 'θ', { italic: true, size: 12, color: ACC }));
    }
    if (refOn && q !== 1) {
      var r2 = Wd * 0.12, a0 = q === 2 ? th : q === 3 ? 180 : th, a1 = q === 2 ? 180 : q === 3 ? th : 360;
      g.push('<polyline points="' + arcPath(cx, cy, r2, a0, a1).join(' ') + '" fill="none" stroke="' + COL + '" stroke-width="1.3"/>');
      var mid = ((a0 + a1) / 2) * Math.PI / 180, lr2 = r2 + 11;
      g.push(txt(cx + lr2 * Math.cos(mid), cy - lr2 * Math.sin(mid), o.refLabel || 'θR', { italic: true, size: 12, color: COL }));
    }
    var sd = o.sides || {};
    if (sd.x != null) g.push(txt((cx + px) / 2, cy + (py < cy ? 11 : -11), sd.x, { size: 12 }));
    if (sd.y != null) g.push(txt(px + (px > cx ? 6 : -6), (cy + py) / 2, sd.y, { size: 12, anchor: px > cx ? 'start' : 'end' }));
    if (sd.r != null) { var mx = (cx + px) / 2, my = (cy + py) / 2, nx = -(py - cy), ny = px - cx, nl = Math.sqrt(nx * nx + ny * ny) || 1; nx /= nl; ny /= nl; if (nx * (px - mx) + ny * (cy - my) > 0) { nx = -nx; ny = -ny; } g.push(txt(mx + nx * 12, my + ny * 12, sd.r, { size: 12 })); }
    if (o.label) { var ux = (px - cx) / R, uy = (py - cy) / R; g.push(txt(px + (Math.abs(ux) < 0.25 ? 0 : ux > 0 ? 4 : -4), py + (uy > 0 ? 15 : -13), o.label, { size: 12, anchor: Math.abs(ux) < 0.25 ? 'middle' : ux > 0 ? 'end' : 'start' })); }
    return '<svg class="fig u3-sketch" viewBox="0 0 ' + Wd + ' ' + H + '" width="' + Wd + '" style="max-width:100%;height:auto;display:block;margin:6px auto" role="img" aria-label="' + esc(o.aria || 'Angle in standard position') + '">' + g.join('') + '</svg>';
  };
  /* the CAST diagram, quadrants in o.hi shaded */
  U.cast = function (o) {
    o = o || {};
    var Wd = o.width || 150, c = Wd / 2, g = [];
    (o.hi || []).forEach(function (q) { var xx = q === 1 || q === 4 ? c : 6, yy = q === 1 || q === 2 ? 6 : c; g.push('<rect x="' + xx + '" y="' + yy + '" width="' + (c - 6) + '" height="' + (c - 6) + '" fill="#e3eaf7" rx="4"/>'); });
    g.push(ln(4, c, Wd - 4, c, { color: SOFT }), ln(c, 4, c, Wd - 4, { color: SOFT }));
    [[1, 'A', 'all +'], [2, 'S', 'sin +'], [3, 'T', 'tan +'], [4, 'C', 'cos +']].forEach(function (z) {
      var xx = z[0] === 1 || z[0] === 4 ? c * 1.5 : c * 0.5, yy = z[0] === 1 || z[0] === 2 ? c * 0.5 : c * 1.5;
      g.push(txt(xx, yy - 6, z[1], { size: 15, color: INK }), txt(xx, yy + 10, z[2], { size: 10, color: '#56606e' }), txt(z[0] === 1 || z[0] === 4 ? Wd - 12 : 12, z[0] === 1 || z[0] === 2 ? 12 : Wd - 12, U.ROM[z[0]], { size: 9, color: SOFT }));
    });
    return '<svg class="fig u3-cast" viewBox="0 0 ' + Wd + ' ' + Wd + '" width="' + Wd + '" style="max-width:100%;height:auto;display:block;margin:6px auto" role="img" aria-label="CAST diagram">' + g.join('') + '</svg>';
  };

  /* a point {X, Y, sx, sy} (x = sx√X, y = sy√Y): its ratios and the booklet's steps */
  U.pointRatios = function (P) {
    var R2 = P.X + P.Y;
    return { R2: R2, sin: U.radRatio(P.sy, P.Y, R2), cos: U.radRatio(P.sx, P.X, R2), tan: P.X === 0 ? 'undef' : U.radRatio(P.sx * P.sy, P.Y, P.X) };
  };

  /* ============================== Lesson 3 ============================== */
  var FN = ['sin', 'cos', 'tan'];
  function fnT(fn, v) { return '\\' + fn + (v == null ? '\\theta' : ' ' + v); }
  function sgnWord(s) { return s > 0 ? 'positive' : 'negative'; }
  function condTex(c) { return '\\' + c[0] + '\\theta' + (c[1] > 0 ? '>0' : '<0'); }
  function decOrFrac(n, d) { // a value n/d written as a decimal when it terminates in ≤ 2 places, else a fraction
    var g = gcd(n, d); n /= g; d /= g; if (d < 0) { n = -n; d = -d; }
    var v = n / d; if (Math.abs(v * 100 - Math.round(v * 100)) < 1e-9) return { v: v, tex: String(Math.round(v * 100) / 100) };
    return { v: v, tex: (n < 0 ? '-' : '') + '\\frac{' + Math.abs(n) + '}{' + d + '}', frac: true };
  }
  var H_SOLVE = ['Use the sign of the value and CAST to find the two quadrants.', 'Find ' + t('\\theta_R') + ' with the inverse key on the <b>positive</b> value (degree mode), then place it: II: ' + t('180^\\circ-\\theta_R') + ', III: ' + t('180^\\circ+\\theta_R') + ', IV: ' + t('360^\\circ-\\theta_R') + '.'];
  var H_EXACT2 = ['Use the signs (CAST) to decide the quadrant, then read two of ' + t('x') + ', ' + t('y') + ', ' + t('r') + ' from the given ratio.', 'Find the third with ' + t('x^{2}+y^{2}=r^{2}') + ', give it the sign for the quadrant, then write ' + t('\\sin\\theta=\\frac{y}{r}') + ', ' + t('\\cos\\theta=\\frac{x}{r}') + ', ' + t('\\tan\\theta=\\frac{y}{x}') + '.'];
  var DEC = ', to the nearest tenth of a degree';

  /* ---- solve fn θ = a with a calculator: a part ---- */
  function solvePart(prompt, fn, a, o) {
    o = o || {};
    var dp = o.dp == null ? 1 : o.dp, info = U.solveCalc(fn, a, dp, o.aTex), sols = info.sols;
    var all = null;
    if (o.interval) { all = sols; sols = sols.filter(o.interval.has); }
    var lines = (o.pre || []).concat(info.lines);
    if (o.interval) lines.push(sols.length ? 'In ' + t(o.interval.tex) + ': ' + t('\\theta\\approx ' + U.angTex(sols, dp)) : 'None of them is in ' + t(o.interval.tex) + '.');
    var altSets = (o.altSets || []).map(function (as) { var i2 = U.solveCalc(fn, as.a, dp); var s2 = o.interval ? i2.sols.filter(o.interval.has) : i2.sols; return { sols: s2, code: as.code, hint: as.hint }; }).filter(function (as) { return as.sols.length; });
    var aTxt = o.aTex || String(a);
    var mh = o.missingHint || (info.quadrantal ? 'Check every point on the axes (with ' + t('r=1') + '): ' + t('(1,0)') + ' at ' + t('0^\\circ') + ', ' + t('(0,1)') + ' at ' + t('90^\\circ') + ', ' + t('(-1,0)') + ' at ' + t('180^\\circ') + ', ' + t('(0,-1)') + ' at ' + t('270^\\circ') + '.' : null);
    return U.P.angles(prompt, sols, { dp: dp, fn: fn, ref: info.ref, quads: info.quads, all: all, interval: o.interval && o.interval.tex, altSets: altSets, missingHint: mh, saidNoneHint: o.saidNoneHint || (fn !== 'tan' && Math.abs(a) <= 1 ? t(aTxt) + ' is between ' + t('-1') + ' and ' + t('1') + ', so there are solutions.' : undefined) },
      lines.join('<br>'), o.hints || H_SOLVE, o.text || 'solve ' + fn + ' θ = ' + a);
  }
  /* a random value for fn θ = a (two decimals for sin/cos, one or two for tan), sign s */
  var AVOID_A = [0.42, -0.73, -3.5, 0.8, 0.35, 1.9, -0.27, -0.91, -0.6, 0.62, -0.12, 0.25, -0.95, 0.5, -6, 0.24, -0.15, 0.55, 0.7, -0.85, -0.4, -2.5];
  function randA(r, fn, s, avoid) {
    return pickWhere(function () {
      var v = fn === 'tan' ? (r.chance(0.5) ? r.int(11, 95) / 10 : r.int(12, 95) / 100) : r.int(6, 97) / 100;
      return s * v;
    }, function (v) {
      if (AVOID_A.concat(avoid || []).some(function (x) { return Math.abs(x - v) < 1e-9; })) return false;
      var ref = INV[fn](Math.abs(v));
      if ([30, 45, 60].some(function (z) { return Math.abs(ref - z) < 0.5; })) return false;
      // keep the tenths away from a rounding edge so nearby rounding doesn't decide the answer
      return [1, 2, 3, 4].every(function (q) { var x = U.place(ref, q) * 10; return Math.abs(x - Math.floor(x) - 0.5) > 0.06; });
    });
  }
  function eqTex(k, fn, b, c) { return (k === 1 ? '' : k === -1 ? '-' : String(k)) + '\\' + fn + '\\theta' + (b > 0 ? '+' + b : b < 0 ? String(b) : '') + '=' + c; }

  /* ---- the "other two ratios" engine ---- */
  var TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [12, 35, 37], [9, 40, 41], [28, 45, 53], [11, 60, 61], [33, 56, 65], [16, 63, 65], [48, 55, 73], [13, 84, 85], [36, 77, 85], [39, 80, 89], [65, 72, 97]];
  U.TRIPLES = TRIPLES;
  var QINT = { 1: '0^\\circ<\\theta<90^\\circ', 2: '90^\\circ<\\theta<180^\\circ', 3: '180^\\circ<\\theta<270^\\circ', 4: '270^\\circ<\\theta<360^\\circ' };
  function coordTex(s, X) { return U.radTexOf(s, X); }
  /* P = { X, Y, sx, sy }, given fn; cond: { kind: 'int' | 'sign' | 'half', fn2, half }. v: the angle letter. Builds the part. */
  function otherTwo(P, given, cond, o) {
    o = o || {};
    var v = o.v || '\\theta', q = P.sx > 0 ? (P.sy > 0 ? 1 : 4) : (P.sy > 0 ? 2 : 3), RT = U.pointRatios(P), others = FN.filter(function (f) { return f !== given; });
    var gv = RT[given], givenTex = o.givenTex || U.tex(gv);
    var condT = cond.kind === 'int' ? QINT[q].replace(/\\theta/g, v) : cond.kind === 'half' ? cond.tex : '\\' + cond.fn2 + ' ' + v + (U.sign(cond.fn2, q) > 0 ? '>0' : '<0');
    var lead = o.lead != null ? o.lead : 'Determine the exact values of the other two ratios' + (o.rational ? ', with rational denominators' : '') + '.';
    var prompt = (lead ? lead + '<br>' : '') + t('\\' + given + ' ' + v + '=' + givenTex) + (cond.kind === 'sign' ? ' and ' : ', ') + t(condT);
    // steps
    var xT = coordTex(P.sx, P.X), yT = coordTex(P.sy, P.Y), rT = U.radTexOf(1, RT.R2);
    var why = cond.kind === 'int' ? 'Quadrant ' + U.ROM[q] : cond.kind === 'half' ? cond.why : (given === 'tan' ? 'tan ' : given + ' ') + (U.sign(given, q) > 0 ? '+' : '−') + ', ' + cond.fn2 + ' ' + (U.sign(cond.fn2, q) > 0 ? '+' : '−') + ': Quadrant ' + U.ROM[q];
    var L = [why + (o.decLine ? '. ' + o.decLine : '') + '.'];
    var known = given === 'sin' ? [['y', yT], ['r', rT]] : given === 'cos' ? [['x', xT], ['r', rT]] : [['x', xT], ['y', yT]];
    L.push(t('\\' + given + ' ' + v + '=' + (given === 'sin' ? '\\frac{y}{r}' : given === 'cos' ? '\\frac{x}{r}' : '\\frac{y}{x}')) + ': ' + known.map(function (k) { return t(k[0] + '=' + k[1]); }).join(', ') + '.');
    if (given === 'tan') L.push(t('r=\\sqrt{x^{2}+y^{2}}=\\sqrt{' + P.X + '+' + P.Y + '}=' + rT));
    else if (given === 'sin') L.push(t('x^{2}=r^{2}-y^{2}=' + RT.R2 + '-' + P.Y + '=' + P.X) + ', so ' + t('x=' + xT) + ' (' + (P.sx > 0 ? 'positive' : 'negative') + ' in Quadrant ' + U.ROM[q] + ').');
    else L.push(t('y^{2}=r^{2}-x^{2}=' + RT.R2 + '-' + P.X + '=' + P.Y) + ', so ' + t('y=' + yT) + ' (' + (P.sy > 0 ? 'positive' : 'negative') + ' in Quadrant ' + U.ROM[q] + ').');
    var den = { sin: 'r', cos: 'r', tan: 'x' }, nume = { sin: 'y', cos: 'x', tan: 'y' }, vals = { x: xT, y: yT, r: rT };
    L.push(others.map(function (f) {
      var raw = '\\frac{' + vals[nume[f]] + '}{' + vals[den[f]] + '}', fin = U.tex(RT[f]);
      return t('\\' + f + ' ' + v + '=' + '\\frac{' + nume[f] + '}{' + den[f] + '}=' + raw + (raw === fin ? '' : '=' + fin));
    }).join(' &nbsp; '));
    var sk = U.sketch({ x: P.sx * Math.sqrt(P.X), y: P.sy * Math.sqrt(P.Y), label: 'P(' + U.plainRad(P.sx, P.X) + ', ' + U.plainRad(P.sy, P.Y) + ')', sides: { x: U.plainRad(P.sx, P.X), y: U.plainRad(P.sy, P.Y), r: U.plainRad(1, RT.R2) }, width: 240 });
    var boxes = others.map(function (f) {
      var alts = [];
      if (f === 'tan') alts.push({ v: U.val(RT.tan) === 0 ? NaN : 1 / U.val(RT.tan), code: 'u3l3-tan-flip', hint: t('\\tan ' + v + '=\\frac{y}{x}') + ' (rise over run), not ' + t('\\frac{x}{y}') + '.' });
      else alts.push({ v: U.val(RT[f === 'sin' ? 'cos' : 'sin']), code: 'u3l3-xy', hint: t('\\sin ' + v + '=\\frac{y}{r}') + ' and ' + t('\\cos ' + v + '=\\frac{x}{r}') + ': check which side you used.' });
      return { label: t('\\' + f + ' ' + v + '='), name: f + ' ' + (o.vPlain || 'θ'), want: RT[f], rational: !!o.rational, decOk: !!o.decOk,
        signHint: 'Check the sign: ' + t(v) + ' is in Quadrant ' + U.ROM[q] + ', where ' + U.castWhy(q) + '.', alts: alts };
    });
    return U.P.boxes(prompt, boxes, sk + L.join('<br>'), o.hints || H_EXACT2, o.text || 'other two ratios from ' + given);
  }
  function tripleP(r, q, avoid) {
    return pickWhere(function () { var T = r.pick(TRIPLES), sw = r.chance(0.5); var a = sw ? T[1] : T[0], b = sw ? T[0] : T[1]; return { X: a * a, Y: b * b, sx: q === 1 || q === 4 ? 1 : -1, sy: q <= 2 ? 1 : -1, a: a, b: b, c: T[2] }; },
      function (P) { return !(avoid || []).some(function (z) { return z[0] === P.sx * P.a && z[1] === P.sy * P.b; }); });
  }
  /* the condition that pins the quadrant */
  function sideCond(r, given, q) { var f2 = r.pick(FN.filter(function (f) { return f !== given; })); return { kind: 'sign', fn2: f2 }; }

  /* ---- Q1 / A1 quadrant conditions ---- */
  function quadShared(r) {
    var singles = r.shuffle([['sin', 1], ['sin', -1], ['cos', 1], ['cos', -1], ['tan', 1], ['tan', -1]]);
    var qs = r.shuffle([1, 2, 3, 4]).slice(0, 3), pairs = [['sin', 'cos'], ['sin', 'tan'], ['cos', 'tan']];
    var doubles = qs.map(function (q) { var pr = pickWhere(function () { return r.pick(pairs); }, function (p) { return !(q === 3 && p[0] === 'sin' && p[1] === 'tan'); }); var o = r.chance(0.5) ? pr : [pr[1], pr[0]]; return o.map(function (f) { return [f, U.sign(f, q)]; }); });
    return { singles: singles, doubles: doubles };
  }
  function quadPart(conds) {
    var quads = [1, 2, 3, 4].filter(function (q) { return conds.every(function (c) { return U.sign(c[0], q) === c[1]; }); });
    var expl = conds.map(function (c) { return t(condTex(c)) + ': Quadrants ' + U.quadsTex(U.quadsFor(c[0], c[1])); }).join('; ');
    var sol = U.cast({ hi: quads, width: 140 }) + expl + (conds.length > 1 ? '. Both are true only in Quadrant ' + U.ROM[quads[0]] + '.' : '.');
    return U.P.quads(conds.map(function (c) { return t(condTex(c)); }).join(' and ') + '?', quads, conds, sol,
      ['CAST: Quadrant I all positive, II only sin, III only tan, IV only cos.', t('\\sin\\theta') + ' has the sign of ' + t('y') + ', ' + t('\\cos\\theta') + ' the sign of ' + t('x') + ', and ' + t('\\tan\\theta') + ' is positive when ' + t('x') + ' and ' + t('y') + ' have the same sign.'], 'quadrants where ' + conds.map(function (c) { return c[0] + (c[1] > 0 ? '>0' : '<0'); }).join(' and '));
  }
  /* ---- Q2 / A2 signs, Q3 / A3 reference-angle form: distinct (fn, quadrant) combos ---- */
  function comboShared(n, quads, mixSign, avoid) {
    return function (r) {
      return pickWhere(function () {
        var all = []; FN.forEach(function (f) { quads.forEach(function (q) { all.push([f, q]); }); });
        var pick = r.shuffle(all).slice(0, n), used = (avoid || []).slice();
        return pick.map(function (c) { var a = U.angleIn(r, c[1], used); used.push(a); return { fn: c[0], q: c[1], a: a }; });
      }, function (cs) { if (!mixSign) return true; var s = cs.map(function (c) { return U.sign(c.fn, c.q); }); return s.indexOf(1) >= 0 && s.indexOf(-1) >= 0; });
    };
  }
  function signPart(r, c) {
    var s = U.sign(c.fn, c.q), why = t(U.deg(c.a)) + ' is in Quadrant ' + U.ROM[c.q] + ', where ' + U.castWhy(c.q) + '.';
    return U.P.sign(r, t(fnT(c.fn, U.deg(c.a))), s, why, 'Quadrant ' + U.ROM[c.q] + ': ' + U.castWhy(c.q) + ', so ' + t(fnT(c.fn, U.deg(c.a))) + ' is ' + sgnWord(s) + '.',
      ['Find the quadrant first: I is ' + t('0^\\circ') + '–' + t('90^\\circ') + ', II ' + t('90^\\circ') + '–' + t('180^\\circ') + ', III ' + t('180^\\circ') + '–' + t('270^\\circ') + ', IV ' + t('270^\\circ') + '–' + t('360^\\circ') + '.', 'CAST: the letter in each quadrant names the ratio that is positive there.'], 'sign of ' + c.fn + ' ' + c.a);
  }
  function ratioPart(c) {
    var s = U.sign(c.fn, c.q), rf = U.ref(c.a);
    return U.P.ratio(t(fnT(c.fn, U.deg(c.a))), c.fn, c.a, 'Quadrant ' + U.ROM[c.q] + ', ' + t(U.refTex(c.a)) + '; ' + c.fn + ' is ' + sgnWord(s) + ' in Quadrant ' + U.ROM[c.q] + '.<br>' + t(fnT(c.fn, U.deg(c.a)) + '=' + (s < 0 ? '-' : '') + fnT(c.fn, U.deg(rf))),
      ['Same ratio, with the reference angle: II ' + t('\\theta_R=180^\\circ-\\theta') + ', III ' + t('\\theta_R=\\theta-180^\\circ') + ', IV ' + t('\\theta_R=360^\\circ-\\theta') + '.', 'The sign comes from CAST for the quadrant of ' + t('\\theta') + '.'], 'write ' + c.fn + ' ' + c.a + ' with θR');
  }
  var AV_SIGN = [162, 251, 304, 200, 203, 147, 112, 289, 199, 138, 104, 263, 333, 352];
  var AV_RAT = [132, 214, 297, 349, 168, 236, 302, 251, 117, 341, 172, 316, 125, 247];

  /* ---- Q4 the other angle with the same ratio ---- */
  function otherAnglePart(fn, a) {
    var q = U.quad(a), rf = U.ref(a), s = U.sign(fn, q), qs = U.quadsFor(fn, s), q2 = qs[0] === q ? qs[1] : qs[0], ans = U.place(rf, q2);
    var alts = [{ v: a, code: 'u3l3-other', hint: 'That’s the angle given. Find the <b>other</b> angle from ' + t('0^\\circ') + ' to ' + t('360^\\circ') + ' with the same ratio.' }, { v: rf, code: 'u3l3-ref-only', hint: t(U.deg(rf)) + ' is the reference angle. Place it in the other quadrant where ' + t('\\' + fn) + ' is ' + sgnWord(s) + '.' }];
    [1, 2, 3, 4].forEach(function (z) { if (z !== q && z !== q2 && U.place(rf, z) !== rf) alts.push({ v: U.place(rf, z), code: 'u3l3-quad', hint: 'In Quadrant ' + U.ROM[z] + ' ' + t('\\' + fn) + ' is ' + sgnWord(-s) + '. ' + t('\\' + fn + ' ' + U.deg(a)) + ' is ' + sgnWord(s) + ', so use the other quadrant where ' + t('\\' + fn) + ' is ' + sgnWord(s) + ' (CAST).' }); });
    return U.P.deg(t(fnT(fn) + '=' + fnT(fn, U.deg(a))), ans, alts,
      fn + ' ' + (s > 0 ? 'positive' : 'negative') + ': Quadrants ' + U.quadsTex(qs) + ', ' + t(U.refTex(a)) + '.<br>Quadrant ' + U.ROM[q2] + ': ' + t('\\theta=' + (q2 === 1 ? U.deg(rf) : U.placeTex(q2, rf) + '=' + U.deg(ans))),
      ['The other angle has the same reference angle, in the other quadrant where ' + t('\\' + fn) + ' has the same sign.'], 'other angle with ' + fn + ' = ' + fn + ' ' + a);
  }

  /* ---- intervals ---- */
  function iv(lo, hi, loInc, hiInc) {
    return { lo: lo, hi: hi, tex: U.deg(lo) + (loInc ? '\\le' : '<') + '\\theta' + (hiInc ? '\\le' : '<') + U.deg(hi),
      has: function (x) { return (loInc ? x >= lo - 1e-9 : x > lo + 1e-9) && (hiInc ? x <= hi + 1e-9 : x < hi - 1e-9); } };
  }
  var IVS = [iv(0, 180, true, true), iv(90, 270, true, true), iv(180, 360, true, false), iv(0, 90, true, true), iv(270, 360, true, false), iv(90, 180, true, true)];

  /* ---- isolate-then-solve ---- */
  function isoGen(r, fn, kind, none) {
    return pickWhere(function () {
      var k = r.int(2, 9), b, c, n, lead = null;
      if (kind === 'zero') { b = r.int(1, 9) * (r.chance(0.5) ? 1 : -1); c = 0; n = -b; }
      else if (kind === 'const') { b = r.int(1, 9) * (r.chance(0.5) ? 1 : -1); c = r.int(-9, 9); n = c - b; }
      else { var a0 = r.int(3, 12), d0 = r.int(-6, 9); lead = a0; b = null; c = d0; n = a0 - d0; } // a0 − k f = d0, so f = (a0 − d0)/k
      var v = decOrFrac(n, k);
      return { k: k, b: b, c: c, n: n, v: v, lead: lead };
    }, function (o) {
      if (o.n === 0 || o.n % o.k === 0 && Math.abs(o.n / o.k) <= 1 && fn !== 'tan') return false;
      if (none) return fn !== 'tan' && Math.abs(o.v.v) > 1 && Math.abs(o.v.v) < 4;
      if (fn !== 'tan' && Math.abs(o.v.v) >= 0.97) return false;
      if (fn === 'tan' && (Math.abs(o.v.v) > 12 || Math.abs(o.v.v) < 0.1)) return false;
      var ref = INV[fn](Math.abs(o.v.v)); if ([30, 45, 60].some(function (z) { return Math.abs(ref - z) < 0.3; })) return false;
      return [1, 2, 3, 4].every(function (q) { var x = U.place(ref, q) * 10; return Math.abs(x - Math.floor(x) - 0.5) > 0.06; });
    });
  }
  function isoPart(fn, o, extra) {
    extra = extra || {};
    var q = o.lead != null ? o.lead + '-' + Math.abs(o.k) + '\\' + fn + '\\theta=' + o.c : eqTex(o.k, fn, o.b, o.c);
    var pre = [];
    if (o.lead != null) pre.push(t('-' + Math.abs(o.k) + '\\' + fn + '\\theta=' + o.c + '-' + o.lead + '=' + (o.c - o.lead)) + ', so ' + t('\\' + fn + '\\theta=' + o.v.tex) + (o.v.frac ? '' : '') + '.');
    else pre.push(t(o.k + '\\' + fn + '\\theta=' + o.c + (o.b > 0 ? '-' + o.b : '+' + (-o.b)) + '=' + o.n) + ', so ' + t('\\' + fn + '\\theta=' + o.v.tex) + '.');
    var altSets = [{ a: -o.v.v, code: 'u3l3-isolate', hint: 'Check the sign when you move the constant to the other side: ' + (o.lead != null ? 'subtract ' + t(o.lead) + ' from both sides, then divide by ' + t(-Math.abs(o.k)) + '.' : 'subtract ' + t(o.b) + ' from both sides (the sign changes), then divide by ' + t(o.k) + '.') }];
    var nod = o.lead != null ? null : o.c - o.b;
    if (nod != null && (fn === 'tan' || Math.abs(nod) <= 1) && nod !== 0) altSets.push({ a: nod, code: 'u3l3-nodivide', hint: 'Isolate the ratio completely: divide both sides by ' + t(Math.abs(o.k)) + ' too.' });
    altSets = altSets.filter(function (as) { return fn === 'tan' || Math.abs(as.a) <= 1; });
    return solvePart(t(q) + (extra.suffix || ''), fn, o.v.v, { aTex: o.v.tex, pre: pre, altSets: altSets, interval: extra.interval, text: 'solve ' + q.replace(/\\/g, ''),
      hints: ['Isolate the ratio first, exactly like solving a linear equation for ' + t('x') + '.'].concat(H_SOLVE) });
  }

  /* ============================== the assignment ============================== */
  var QUESTIONS = [
    { num: '1', section: 'Signs of the ratios', stem: 'In which quadrant(s) does the terminal arm of ' + t('\\theta') + ' lie if:', shared: quadShared, parts: [
      { id: '1a', level: 'BEG', make: function (r, sh) { return quadPart([sh.singles[0]]); } },
      { id: '1b', level: 'BEG', make: function (r, sh) { return quadPart([sh.singles[1]]); } },
      { id: '1c', level: 'BEG', make: function (r, sh) { return quadPart([sh.singles[2]]); } },
      { id: '1d', level: 'EMG', make: function (r, sh) { return quadPart(sh.doubles[0]); } },
      { id: '1e', level: 'EMG', make: function (r, sh) { return quadPart(sh.doubles[1]); } },
      { id: '1f', level: 'EMG', make: function (r, sh) { return quadPart(sh.doubles[2]); } }] },
    { num: '2', stem: 'Without using a calculator, state whether each ratio is positive or negative.', shared: comboShared(6, [2, 3, 4], true, AV_SIGN), parts: [0, 1, 2, 3, 4, 5].map(function (i) {
      return { id: '2' + 'abcdef'[i], level: 'BEG', make: function (r, sh) { return signPart(r, sh[i]); } }; }) },
    { num: '3', section: 'Reference angles', stem: 'Write each ratio as the same ratio of its reference angle, with the correct sign.', shared: comboShared(6, [2, 3, 4], true, AV_RAT), parts: [0, 1, 2, 3, 4, 5].map(function (i) {
      return { id: '3' + 'abcdef'[i], level: i < 3 ? 'BEG' : 'EMG', make: function (r, sh) { return ratioPart(sh[i]); } }; }) },
    { num: '4', stem: 'Determine the other angle ' + t('\\theta') + ', ' + t('0^\\circ\\le\\theta<360^\\circ') + ', that satisfies each equation.',
      shared: function (r) { var f = r.shuffle(FN); return f; }, parts: [
      { id: '4a', level: 'EMG', make: function (r, sh) { return otherAnglePart(sh[0], U.angleIn(r, 1, [52])); } },
      { id: '4b', level: 'PRG', make: function (r, sh) { var q = r.pick([2, 3, 4]); return otherAnglePart(sh[1], U.angleIn(r, q, [233, 132])); } },
      { id: '4c', level: 'PRG', make: function (r, sh) { var q = r.pick([2, 3, 4]); return otherAnglePart(sh[2], U.angleIn(r, q, [161, 128])); } }] },
    { num: '5', section: 'Exact ratios from one ratio', stem: 'Determine the exact values of the other two ratios. (The sketch is in the worked solution.)', parts: [
      { id: '5a', level: 'PRG', make: function (r) {
        var q = r.pick([2, 3, 4]), P = tripleP(r, q, [[20, -21], [-8, -15]]), given = r.pick(FN);
        return otherTwo(P, given, { kind: 'int' }, { lead: '' });
      } },
      { id: '5b', level: 'PRG', make: function (r) {
        var half = r.pick([0, 180]), given = r.pick(['tan', 'cos']), q = pickWhere(function () { return r.pick(half ? [3, 4] : [1, 2]); }, function (q) { return q !== 1; });
        var P = tripleP(r, q, [[-35, 12]]), lo = half, s = U.sign(given, q);
        var tex = U.deg(lo) + '\\le A\\le ' + U.deg(lo + 180), why = t('\\' + given + ' A') + ' is ' + sgnWord(s) + ' and ' + t(tex) + ': Quadrant ' + U.ROM[q];
        return otherTwo(P, given, { kind: 'half', tex: tex, why: why }, { lead: '', v: 'A', vPlain: 'A' });
      } },
      { id: '5c', level: 'ADV', make: function (r) {
        var o = pickWhere(function () {
          var given = r.pick(FN), opts = given === 'tan' ? [[3, 4], [12, 5], [15, 8], [21, 20], [9, 40]] : [[3, 5], [4, 5], [7, 25], [24, 25], [44, 125], [117, 125]];
          var pr = r.pick(opts), q = r.pick([2, 3, 4]); return { given: given, pr: pr, q: q };
        }, function (o) { return !(o.given === 'cos' && o.pr[0] === 7 && o.q === 4); });
        var g = o.given, n = o.pr[0], d = o.pr[1], other = g === 'tan' ? Math.sqrt(n * n + d * d) : Math.sqrt(d * d - n * n);
        var P = g === 'sin' ? { X: other * other, Y: n * n } : g === 'cos' ? { X: n * n, Y: other * other } : { X: d * d, Y: n * n };
        P.sx = o.q === 1 || o.q === 4 ? 1 : -1; P.sy = o.q <= 2 ? 1 : -1;
        var sg = U.sign(g, o.q), dec = sg * n / d, decTex = String(Math.round(dec * 1000) / 1000);
        var fr = g === 'tan' ? '\\frac{' + n + '}{' + d + '}' : '\\frac{' + n + '}{' + d + '}';
        var digits = (String(Math.abs(dec)).split('.')[1] || '').length, pw = Math.pow(10, digits), raw = Math.round(Math.abs(dec) * pw);
        var decLine = t(decTex.replace(/^-/, '') + '=\\frac{' + raw + '}{' + pw + '}' + (raw !== n ? '=' + fr : ''));
        return otherTwo(P, g, sideCond(r, g, o.q), { lead: '', givenTex: decTex, decLine: decLine, decOk: true });
      } }] },
    { num: '6', parts: [{ id: '6', level: 'ADV', make: function (r) {
      var o = pickWhere(function () { var b = r.int(3, 9), a = r.int(1, b - 1); return { a: a, b: b, given: r.pick(['sin', 'cos']), q: r.pick([2, 3, 4]) }; },
        function (o) { return gcd(o.a, o.b) === 1 && !sq(o.b * o.b - o.a * o.a) && !(o.a === 5 && o.b === 6) && !(o.a === 2 && o.b === 3 && o.given === 'sin' && o.q === 2) && U.sign(o.given, o.q) !== 0; });
      var other = o.b * o.b - o.a * o.a, P = o.given === 'sin' ? { X: other, Y: o.a * o.a } : { X: o.a * o.a, Y: other };
      P.sx = o.q === 1 || o.q === 4 ? 1 : -1; P.sy = o.q <= 2 ? 1 : -1;
      var f2 = o.given === 'sin' ? 'cos' : 'sin';
      return otherTwo(P, o.given, { kind: 'sign', fn2: r.chance(0.5) ? f2 : 'tan' }, { rational: true, lead: 'Given the ratio and the sign below, determine the exact values of the other two ratios with rational denominators.', text: 'other two ratios, irrational side' });
    } }] },
    { num: '7', parts: [{ id: '7', level: 'MAS', make: function (r) {
      var o = pickWhere(function () { var b = r.int(3, 5), c = r.pick([2, 3, 5, 6, 7, 10, 11]); return { b: b, c: c, given: r.pick(['sin', 'cos']), q: r.pick([2, 3, 4]) }; },
        function (o) { return o.c < o.b * o.b && !(o.c === 5 && o.b === 4 && o.given === 'cos' && o.q === 3) && o.b * o.b - o.c !== o.c; });
      var other = o.b * o.b - o.c, P = o.given === 'sin' ? { X: other, Y: o.c } : { X: o.c, Y: other };
      P.sx = o.q === 1 || o.q === 4 ? 1 : -1; P.sy = o.q <= 2 ? 1 : -1;
      var gTex = (U.sign(o.given, o.q) < 0 ? '-' : '') + '\\frac{\\sqrt{' + o.c + '}}{' + o.b + '}';
      return otherTwo(P, o.given, { kind: 'sign', fn2: o.given === 'sin' ? (r.chance(0.5) ? 'cos' : 'tan') : (r.chance(0.5) ? 'sin' : 'tan') }, { rational: true, givenTex: gTex, lead: 'Given the ratio and the sign below, determine the exact values of the other two ratios with rational denominators.', text: 'other two ratios, radical given' });
    } }] },
    { num: '8', section: 'Solving for the angle', stem: 'Solve for ' + t('\\theta') + ', ' + t('0^\\circ\\le\\theta<360^\\circ') + DEC + '.', parts: [
      ['sin', 1, 'EMG'], ['cos', 1, 'EMG'], ['tan', 1, 'EMG'], ['sin', -1, 'PRG'], ['cos', -1, 'PRG'], ['tan', -1, 'PRG']].map(function (z, i) {
      return { id: '8' + 'abcdef'[i], level: z[2], make: function (r) { var a = randA(r, z[0], z[1]); return solvePart(t(fnT(z[0]) + '=' + a), z[0], a); } }; }) },
    { num: '9', stem: 'Solve for ' + t('\\theta') + ', ' + t('0^\\circ\\le\\theta<360^\\circ') + '. Round to the nearest tenth of a degree where needed.',
      shared: function (r) { return r.shuffle([['sin', 0], ['sin', 1], ['sin', -1], ['cos', 0], ['cos', 1], ['cos', -1], ['tan', 0]]); }, parts: [
      { id: '9a', level: 'EMG', make: function (r, sh) { return solvePart(t(fnT(sh[0][0]) + '=' + sh[0][1]), sh[0][0], sh[0][1], { hints: ['Use the points on the axes, with ' + t('r=1') + ': ' + t('(1,0)') + ' at ' + t('0^\\circ') + ', ' + t('(0,1)') + ' at ' + t('90^\\circ') + ', ' + t('(-1,0)') + ' at ' + t('180^\\circ') + ', ' + t('(0,-1)') + ' at ' + t('270^\\circ') + '.'] }); } },
      { id: '9b', level: 'EMG', make: function (r, sh) { return solvePart(t(fnT(sh[1][0]) + '=' + sh[1][1]), sh[1][0], sh[1][1], { hints: ['Use the points on the axes: ' + t('\\sin\\theta=y') + ' and ' + t('\\cos\\theta=x') + ' when ' + t('r=1') + '.'] }); } },
      { id: '9c', level: 'EMG', make: function (r, sh) { return solvePart(t(fnT(sh[2][0]) + '=' + sh[2][1]), sh[2][0], sh[2][1], { hints: ['Use the points on the axes: ' + t('\\sin\\theta=y') + ' and ' + t('\\cos\\theta=x') + ' when ' + t('r=1') + '.'] }); } },
      { id: '9d', level: 'EMG', make: function (r) { var fn = r.pick(['sin', 'cos']), a = (r.chance(0.5) ? 1 : -1) * r.int(105, 260) / 100; a = Math.round(a * 100) / 100; if (Math.abs(a + 1.3) < 1e-9) a = -1.35;
        return solvePart(t(fnT(fn) + '=' + a), fn, a, { hints: ['Can ' + t('\\' + fn + '\\theta') + ' ever be ' + t(a) + '? Think about ' + t(fn === 'sin' ? '\\frac{y}{r}' : '\\frac{x}{r}') + ' with ' + t(fn === 'sin' ? '|y|\\le r' : '|x|\\le r') + '.'] }); } },
      { id: '9e', level: 'PRG', make: function (r) { var a = pickWhere(function () { return (r.chance(0.5) ? 1 : -1) * r.int(15, 80); }, function (a) { var ref = INV.tan(Math.abs(a)); return a !== -40 && [1, 2, 3, 4].every(function (q) { var x = U.place(ref, q) * 10; return Math.abs(x - Math.floor(x) - 0.5) > 0.06; }); });
        return solvePart(t(fnT('tan') + '=' + a), 'tan', a); } }] },
    { num: '10', section: 'Isolate the ratio first', stem: 'Solve for ' + t('\\theta') + ', ' + t('0^\\circ\\le\\theta<360^\\circ') + DEC + '.', parts: [
      { id: '10a', level: 'PRG', make: function (r) { var fn = r.pick(['sin', 'cos']); return isoPart(fn, isoGen(r, fn, 'zero')); } },
      { id: '10b', level: 'PRG', make: function (r) { var fn = r.pick(['sin', 'cos']); return isoPart(fn, isoGen(r, fn, 'const')); } },
      { id: '10c', level: 'PRG', make: function (r) { return isoPart('tan', isoGen(r, 'tan', 'const')); } },
      { id: '10d', level: 'ADV', make: function (r) { var fn = r.pick(['sin', 'cos']); return isoPart(fn, isoGen(r, fn, r.pick(['const', 'lead']), true)); } }] },
    { num: '11', section: 'Restricted intervals', stem: 'Solve each equation in the given interval' + DEC + '.', shared: function (r) { return r.shuffle(FN); }, parts: [0, 1, 2].map(function (i) {
      return { id: '11' + 'abc'[i], level: 'ADV', make: function (r, sh) {
        var fn = sh[i], o = pickWhere(function () { return { a: randA(r, fn, r.chance(0.5) ? 1 : -1, [-0.15, 0.55, 0.7]), I: r.pick(IVS) }; },
          function (o) { var s = U.solveCalc(fn, o.a, 1).sols.filter(o.I.has); return s.length === 1; });
        return solvePart(t(fnT(fn) + '=' + o.a) + ', ' + t(o.I.tex), fn, o.a, { interval: o.I, hints: ['Find both solutions from ' + t('0^\\circ') + ' to ' + t('360^\\circ') + ' first.', 'Then keep only the ones in the interval.'] });
      } }; }) },
    { num: '12', section: 'Problems', shared: function (r) {
        var L = r.pick([0.8, 1.2, 1.5, 1.6, 1.8, 2.4, 2.5, 3.2]), ctx = r.pick([{ what: 'A robot arm', turn: 'pivots about a fixed point', piv: 'pivot', end: 'tip' }, { what: 'A wind-turbine blade', turn: 'turns about the hub', piv: 'hub', end: 'tip' }, { what: 'A crane jib (seen from above)', turn: 'swings about its base', piv: 'base', end: 'hook end' }]);
        return { L: L, ctx: ctx };
      }, stem: function (sh) { return sh.ctx.what + ' ' + F(sh.L) + ' m long ' + sh.ctx.turn + '. When it has rotated ' + t('\\theta') + ' in standard position, its ' + sh.ctx.end + ' is ' + t('x=' + sh.L + '\\cos\\theta') + ' metres right of the ' + sh.ctx.piv + ' and ' + t('y=' + sh.L + '\\sin\\theta') + ' metres above it (negative values mean left or below). Answer to the nearest tenth of a degree, ' + t('0^\\circ\\le\\theta<360^\\circ') + '.'; }, parts: [
      { id: '12a', level: 'PRG', make: function (r, sh) { return armPart(r, sh, 'y'); } },
      { id: '12b', level: 'ADV', make: function (r, sh) { return armPart(r, sh, 'x'); } }] },
    { num: '13', section: 'Find the error', shared: function (r) { var a = pickWhere(function () { return r.int(12, 92) / 100; }, function (a) { var ref = INV.cos(a); return Math.abs(a - 0.6) > 1e-9 && Math.abs(a - 0.5) > 1e-9 && Math.abs(ref - 45) > 1 && [1, 2, 3, 4].every(function (q) { var x = U.place(ref, q) * 10; return Math.abs(x - Math.floor(x) - 0.5) > 0.06; }); }); return { a: a, second: r.pick(['180+', '360-']) }; },
      stem: function (sh) { var A = fx(INV.cos(-sh.a), 1); return 'Jordan solved ' + t('\\cos\\theta=-' + sh.a) + ' for ' + t('0^\\circ\\le\\theta<360^\\circ') + ' this way: “' + t('\\cos^{-1}(-' + sh.a + ')\\approx ' + U.deg(A)) + '. Cosine is negative in Quadrants II and IV, so ' + t('\\theta\\approx ' + U.deg(A)) + ' and ' + t(sh.second === '180+' ? '180^\\circ+' + U.deg(A) + '=' + U.deg(fx(180 + INV.cos(-sh.a), 1)) : '360^\\circ-' + U.deg(A) + '=' + U.deg(fx(360 - INV.cos(-sh.a), 1))) + '.”'; }, parts: [
      { id: '13a', level: 'ADV', make: function (r, sh) {
        var A = fx(INV.cos(-sh.a), 1), R0 = fx(INV.cos(sh.a), 1);
        return U.mc(r, 'Which describes Jordan’s errors?', [
          { html: t('\\cos^{-1}(-' + sh.a + ')') + ' is not a reference angle (use ' + t('\\theta_R=\\cos^{-1}(' + sh.a + ')\\approx ' + U.deg(R0)) + '), <b>and</b> cosine is negative in Quadrants II and III, not IV.', right: true },
          { html: 'Only the quadrants are wrong: cosine is negative in Quadrants II and III.', why: 'That’s one error. Is ' + t(U.deg(A)) + ' an acute reference angle?', code: 'u3l3-j-quad' },
          { html: 'Only the reference angle is wrong: it should be ' + t('\\cos^{-1}(' + sh.a + ')\\approx ' + U.deg(R0)) + '.', why: 'That’s one error. Where is cosine negative (CAST)?', code: 'u3l3-j-ref' },
          { html: 'Nothing is wrong: ' + t(U.deg(A)) + ' is a correct solution, so the method works.', why: t(U.deg(A)) + ' happens to be right, but check the method: the reference angle and the quadrants.', code: 'u3l3-j-none' }],
          'Cosine is negative in Quadrants II and III (not IV). Also ' + t(U.deg(A)) + ' is not a reference angle: use ' + t('\\theta_R=\\cos^{-1}(' + sh.a + ')\\approx ' + U.deg(fx(INV.cos(sh.a), 2))) + '.',
          ['A reference angle is always acute, from the inverse key on the positive value.', 'CAST: cos is positive in I and IV.'], 'Jordan’s errors');
      } },
      { id: '13b', level: 'ADV', make: function (r, sh) { return solvePart('Give the correct solutions of ' + t('\\cos\\theta=-' + sh.a) + DEC + '.', 'cos', -sh.a); } }] },
    { num: '14', section: 'Multiple choice and numerical response', parts: [{ id: '14', level: 'PRG', make: function (r) {
      var s = r.chance(0.5) ? 1 : -1, used = [];
      var same = pickWhere(function () { var all = []; FN.forEach(function (f) { [1, 2, 3, 4].forEach(function (q) { if (U.sign(f, q) === s) all.push([f, q]); }); }); return r.shuffle(all).slice(0, 3); }, function (cs) { return cs.map(function (c) { return c[0]; }).filter(function (f, i, a) { return a.indexOf(f) === i; }).length >= 2; });
      var oddF = r.pick(FN), oddQ = r.pick(U.quadsFor(oddF, -s));
      var cs = same.map(function (c) { var a = U.angleIn(r, c[1], used.concat([140, 320, 230, 200])); used.push(a); return { fn: c[0], q: c[1], a: a }; }), odd = { fn: oddF, q: oddQ, a: U.angleIn(r, oddQ, used.concat([140, 320, 230, 200])) };
      var opts = cs.map(function (c) { return { html: t(fnT(c.fn, U.deg(c.a))), why: t(U.deg(c.a)) + ' is in Quadrant ' + U.ROM[c.q] + ' (' + U.castWhy(c.q) + '), so this one is ' + sgnWord(s) + ' — like two of the others.', code: 'u3l3-odd' }; });
      opts.push({ html: t(fnT(odd.fn, U.deg(odd.a))), right: true });
      return U.mc(r, 'Which ratio has a different sign from the other three?', opts,
        t(fnT(odd.fn, U.deg(odd.a))) + ': Quadrant ' + U.ROM[odd.q] + ', ' + U.castWhy(odd.q) + ', so it is ' + sgnWord(-s) + '. ' + cs.map(function (c) { return t(fnT(c.fn, U.deg(c.a))) + ' (' + U.ROM[c.q] + ')'; }).join(', ') + ' are all ' + sgnWord(s) + '.',
        ['Find each angle’s quadrant, then use CAST for each ratio.'], 'ratio with a different sign');
    } }] },
    { num: '15', parts: [{ id: '15', level: 'PRG', make: function (r) {
      var q = r.pick([2, 3, 4]), P = tripleP(r, q, [[-40, -9]]), RT = U.pointRatios(P), g = r.pick(['sin', 'cos']), o2 = FN.filter(function (f) { return f !== g; });
      var pair = function (a, b) { return t(U.tex(a)) + ' and ' + t(U.tex(b)); };
      var A = RT[o2[0]], Bv = RT[o2[1]], flipB = o2[1] === 'tan' ? U.spec(P.sx * P.sy * P.a, P.b) : null;
      var opts = [{ html: pair(A, Bv), right: true }, { html: pair(U.neg(A), Bv), why: 'Check the sign of ' + t('\\' + o2[0] + '\\theta') + ' in Quadrant ' + U.ROM[q] + ' (' + U.castWhy(q) + ').', code: 'u3l3-sign' },
        { html: pair(A, U.neg(Bv)), why: 'Check the sign of ' + t('\\' + o2[1] + '\\theta') + ' in Quadrant ' + U.ROM[q] + ' (' + U.castWhy(q) + ').', code: 'u3l3-sign' },
        { html: pair(U.neg(A), U.neg(Bv)), why: 'Both signs are off: ' + U.castWhy(q) + ' in Quadrant ' + U.ROM[q] + '.', code: 'u3l3-sign' }];
      if (flipB && !U.same(flipB, Bv)) opts[3] = { html: pair(A, U.spec(P.sx * P.sy * P.a, P.b)), why: t('\\tan\\theta=\\frac{y}{x}') + ', not ' + t('\\frac{x}{y}') + '.', code: 'u3l3-tan-flip' };
      return U.mc(r, 'If ' + t('\\' + g + '\\theta=' + U.tex(RT[g])) + ' and ' + t(QINT[q]) + ', then the values of ' + t('\\' + o2[0] + '\\theta') + ' and ' + t('\\' + o2[1] + '\\theta') + ' are', opts,
        'Quadrant ' + U.ROM[q] + ': ' + t('x=' + P.sx * P.a) + ', ' + t('y=' + P.sy * P.b) + ', ' + t('r=' + P.c) + '. ' + t('\\' + o2[0] + '\\theta=' + U.tex(A)) + ', ' + t('\\' + o2[1] + '\\theta=' + U.tex(Bv)) + '.', H_EXACT2, 'other two ratios (MC)');
    } }] },
    { num: '16', parts: [{ id: '16', level: 'PRG', make: function (r) {
      var o = pickWhere(function () { var fn = r.pick(FN), s = r.chance(0.5) ? 1 : -1; return { fn: fn, a: randA(r, fn, s, [0.24]), s: s }; }, function (o) { var ref = INV[o.fn](Math.abs(o.a)); return Math.abs(ref - Math.round(ref)) < 0.4 && ref > 5 && ref < 85; });
      var info = U.solveCalc(o.fn, o.a, 0), ref = info.ref, P4 = [1, 2, 3, 4].map(function (q) { return Math.round(U.place(ref, q)); });
      var pr = function (qs) { return t(qs.map(function (q) { return U.deg(P4[q - 1]); }).join(',\\ ')); };
      var right = info.quads, cands = [[1, 2], [1, 4], [2, 3], [1, 3], [3, 4], [2, 4]].filter(function (c) { return c.join() !== right.join(); });
      var opts = [{ html: pr(right), right: true }].concat(r.shuffle(cands).slice(0, 3).map(function (c) { return { html: pr(c), why: 'CAST: ' + t('\\' + o.fn) + ' is ' + sgnWord(o.s) + ' in Quadrants ' + U.quadsTex(right) + '.', code: 'u3l3-quad' }; }));
      return U.mc(r, 'To the nearest degree, the solutions of ' + t(fnT(o.fn) + '=' + o.a) + ' for ' + t('0^\\circ\\le\\theta<360^\\circ') + ' are', opts, info.lines.join('<br>'), H_SOLVE, 'solutions to the nearest degree (MC)');
    } }] },
    { num: '17', parts: [{ id: '17', level: 'MAS', make: function (r) {
      var o = pickWhere(function () { var f = r.sample(FN, 2); return { f1: f[0], f2: f[1], a1: U.angleIn(r, r.pick([2, 3, 4]), [314, 251]), a2: U.angleIn(r, r.pick([1, 2, 3, 4]), [314, 251]) }; }, function (o) { return o.a1 !== o.a2 && U.ref(o.a1) !== U.ref(o.a2); });
      function other(fn, a) { var q = U.quad(a), s = U.sign(fn, q), qs = U.quadsFor(fn, s), q2 = qs[0] === q ? qs[1] : qs[0]; return { q: q, q2: q2, ref: U.ref(a), v: U.place(U.ref(a), q2), s: s }; }
      var A = other(o.f1, o.a1), Bo = other(o.f2, o.a2), ans = A.v + Bo.v;
      var diag = function (v) { if (v === o.a1 + o.a2) return { code: 'u3l3-sum-same', hint: 'Use the <b>other</b> angles: ' + t('A\\ne ' + U.deg(o.a1)) + ' and ' + t('B\\ne ' + U.deg(o.a2)) + '.' }; if (v === A.ref + Bo.ref) return { code: 'u3l3-ref-only', hint: 'Those are the reference angles. Place each one in the other quadrant where its ratio has the same sign.' }; return null; };
      var p = B.nr('Angles ' + t('A') + ' and ' + t('B') + ' are between ' + t('0^\\circ') + ' and ' + t('360^\\circ') + ', with ' + t('\\' + o.f1 + ' A=\\' + o.f1 + ' ' + U.deg(o.a1)) + ' (' + t('A\\ne ' + U.deg(o.a1)) + ') and ' + t('\\' + o.f2 + ' B=\\' + o.f2 + ' ' + U.deg(o.a2)) + ' (' + t('B\\ne ' + U.deg(o.a2)) + '). The value of ' + t('A+B') + ', in degrees, is ____.', ans, diag,
        t('\\' + o.f1 + ' ' + U.deg(o.a1)) + ' is ' + sgnWord(A.s) + ' (' + U.ROM[A.q] + '), ' + t('\\theta_R=' + U.deg(A.ref)) + ', so ' + t('A=' + U.deg(A.v)) + ' (Quadrant ' + U.ROM[A.q2] + ').<br>' + t('\\' + o.f2 + ' ' + U.deg(o.a2)) + ' is ' + sgnWord(Bo.s) + ' (' + U.ROM[Bo.q] + '), ' + t('\\theta_R=' + U.deg(Bo.ref)) + ', so ' + t('B=' + U.deg(Bo.v)) + ' (Quadrant ' + U.ROM[Bo.q2] + ').<br>' + t('A+B=' + ans),
        ['For each angle: same reference angle, other quadrant where that ratio has the same sign.'], 'A + B from equal ratios (NR)');
      p.bad = [String(o.a1 + o.a2)]; return p;
    } }] },
    { num: '18', parts: [{ id: '18', level: 'ADV', make: function (r) {
      var o = pickWhere(function () { var fn = r.pick(['cos', 'tan']), k = r.int(2, 9), c = r.int(1, 9) * (r.chance(0.75) ? 1 : -1); return { fn: fn, k: k, c: c, v: -c / k }; },
        function (o) { if (o.fn === 'cos' && Math.abs(o.v) >= 0.97) return false; if (o.k === 9 && o.c === 4 && o.fn === 'cos') return false; if (gcd(o.k, Math.abs(o.c)) > 1) return false; var ref = INV[o.fn](Math.abs(o.v)); if ([30, 45, 60].some(function (z) { return Math.abs(ref - z) < 0.5; })) return false; var sol = o.v < 0 ? 180 - ref : ref; return Math.abs(sol - Math.floor(sol) - 0.5) > 0.06; });
      var ref = INV[o.fn](Math.abs(o.v)), sol = o.v < 0 ? 180 - ref : ref, ans = Math.round(sol), vT = (o.v < 0 ? '-' : '') + '\\frac{' + Math.abs(o.c) + '}{' + o.k + '}';
      var diag = function (v) { if (v === Math.round(ref) && o.v < 0) return { code: 'u3l3-ref-only', hint: 'That’s the reference angle. ' + t('\\' + o.fn + '\\theta') + ' is negative, so ' + t('\\theta') + ' is in Quadrant II here: ' + t('180^\\circ-\\theta_R') + '.' }; if (v === Math.round(180 + ref) || v === Math.round(360 - ref)) return { code: 'u3l3-interval', hint: 'That angle is outside ' + t('0^\\circ\\le\\theta\\le 180^\\circ') + '.' }; return null; };
      var p = B.nr('For ' + t('0^\\circ\\le\\theta\\le 180^\\circ') + ', the solution of ' + t(eqTex(o.k, o.fn, o.c, 0)) + ', to the nearest degree, is ____' + t('^\\circ') + '.', ans, diag,
        t('\\' + o.fn + '\\theta=' + vT) + '; ' + (o.v < 0 ? 'II or ' + (o.fn === 'cos' ? 'III' : 'IV') : 'I or ' + (o.fn === 'cos' ? 'IV' : 'III')) + '; ' + t('\\theta_R=\\' + o.fn + '^{-1}\\left(\\tfrac{' + Math.abs(o.c) + '}{' + o.k + '}\\right)\\approx ' + U.deg(fx(ref, 1))) + '. In ' + t('0^\\circ\\le\\theta\\le 180^\\circ') + ' only Quadrant ' + (o.v < 0 ? 'II: ' + t('\\theta\\approx 180^\\circ-' + U.deg(fx(ref, 1)) + '\\approx ' + U.deg(ans)) : 'I: ' + t('\\theta\\approx ' + U.deg(ans))) + '.',
        ['Isolate the ratio, find ' + t('\\theta_R') + ', then keep only the solution from ' + t('0^\\circ') + ' to ' + t('180^\\circ') + '.'], 'solve in 0–180, nearest degree (NR)');
      p.bad = [String(Math.round(ref) === ans ? ans + 1 : Math.round(ref))]; return p;
    } }] }
  ];
  /* Q12 / B4: a rotating arm */
  function armPart(r, sh, axis) {
    var L = sh.L, o = pickWhere(function () { return { d: Math.round(r.int(1, Math.round(L * 10) - 1)) / 10, s: r.chance(0.5) ? 1 : -1 }; }, function (o) {
      if (o.d === 0.5 && L === 1.2 || o.d === 0.9 && L === 1.2) return false; var v = o.d / L; if (v >= 0.97 || v <= 0.08) return false;
      var ref = INV[axis === 'y' ? 'sin' : 'cos'](v); if ([30, 45, 60].some(function (z) { return Math.abs(ref - z) < 0.3; })) return false; return [1, 2, 3, 4].every(function (q) { var x = U.place(ref, q) * 10; return Math.abs(x - Math.floor(x) - 0.5) > 0.06; }); });
    var fn = axis === 'y' ? 'sin' : 'cos', v = o.s * o.d / L, g = gcd(Math.round(o.d * 10), Math.round(L * 10)), n = Math.round(o.d * 10) / g, d = Math.round(L * 10) / g, vT = (o.s < 0 ? '-' : '') + (d === 1 ? n : '\\frac{' + n + '}{' + d + '}');
    var dir = axis === 'y' ? (o.s > 0 ? 'above' : 'below') : (o.s > 0 ? 'right' : 'left'), other = axis === 'y' ? 'cos' : 'sin';
    var wrongAxis = U.solveCalc(other, v, 1).sols;
    var p = solvePart('At what angles is the ' + sh.ctx.end + ' ' + F(o.d) + ' m ' + dir + (axis === 'x' ? ' of' : '') + ' the ' + sh.ctx.piv + '?', fn, v, { aTex: vT, pre: [t(L + '\\' + fn + '\\theta=' + (o.s < 0 ? '-' : '') + o.d) + ', so ' + t('\\' + fn + '\\theta=' + vT) + '.'],
      altSets: [], hints: ['A distance ' + (axis === 'y' ? 'above or below uses ' + t('y=' + L + '\\sin\\theta') : 'right or left uses ' + t('x=' + L + '\\cos\\theta')) + '; ' + (o.s < 0 ? (axis === 'y' ? 'below' : 'left') + ' means negative.' : 'set it equal to the distance.')].concat(H_SOLVE), text: 'arm ' + dir });
    var base = p.check;
    p.check = function (resp) { var res = base(resp); if (res.v === 'wrong' && res.code === 'value') { var pa = U.readAngles(resp); if (pa.vals && pa.vals.length === wrongAxis.length && pa.vals.every(function (x) { return wrongAxis.some(function (w) { return Math.abs(w - x) < 0.07; }); })) return wrong('u3l3-wrong-axis', 'A distance ' + (axis === 'y' ? 'above or below' : 'left or right') + ' is ' + t(axis) + ', so use ' + t(axis + '=' + L + '\\' + fn + '\\theta') + '.'); } return res; };
    p.bad.push(U.angKey(wrongAxis, 1));
    return p;
  }

  /* ============================== the extra practice ============================== */
  var EXTRA = [
    { num: 'A1', section: 'A. Skills', stem: 'Name the quadrant in which ' + t('\\theta') + ' terminates.', shared: quadShared, parts: [0, 1, 2].map(function (i) {
      return { id: 'A1' + 'abc'[i], level: 'EMG', make: function (r, sh) { return quadPart(sh.doubles[i]); } }; }) },
    { num: 'A2', stem: 'Without a calculator, state whether each ratio is positive or negative.', shared: comboShared(4, [2, 3, 4], true, AV_SIGN), parts: [0, 1, 2, 3].map(function (i) {
      return { id: 'A2' + 'abcd'[i], level: 'BEG', make: function (r, sh) { return signPart(r, sh[i]); } }; }) },
    { num: 'A3', stem: 'Write each ratio as the same ratio of its reference angle, with the correct sign.', shared: comboShared(4, [2, 3, 4], true, AV_RAT), parts: [0, 1, 2, 3].map(function (i) {
      return { id: 'A3' + 'abcd'[i], level: 'EMG', make: function (r, sh) { return ratioPart(sh[i]); } }; }) },
    { num: 'A4', stem: 'Solve for ' + t('\\theta') + ', ' + t('0^\\circ\\le\\theta<360^\\circ') + DEC + '.', shared: function (r) { return r.shuffle(FN); }, parts: [[0, 1], [1, -1], [2, 1], [0, -1], [1, 1], [2, -1]].map(function (z, i) {
      return { id: 'A4' + 'abcdef'[i], level: z[1] > 0 ? 'EMG' : 'PRG', make: function (r, sh) { var fn = sh[z[0]]; var a = randA(r, fn, z[1]); return solvePart(t(fnT(fn) + '=' + a), fn, a); } }; }) },
    { num: 'A5', stem: 'Solve for ' + t('\\theta') + ', ' + t('0^\\circ\\le\\theta<360^\\circ') + '.', shared: function (r) { return r.shuffle([['sin', 0], ['sin', 1], ['sin', -1], ['cos', 0], ['cos', 1], ['cos', -1], ['tan', 0]]); }, parts: [
      { id: 'A5a', level: 'EMG', make: function (r, sh) { return solvePart(t(fnT(sh[0][0]) + '=' + sh[0][1]), sh[0][0], sh[0][1]); } },
      { id: 'A5b', level: 'EMG', make: function (r) { var fn = r.pick(['sin', 'cos']), a = Math.round((r.chance(0.5) ? 1 : -1) * r.int(11, 30) / 10 * 10) / 10; if (Math.abs(a - 2.1) < 1e-9) a = 2.2; return solvePart(t(fnT(fn) + '=' + a), fn, a); } },
      { id: 'A5c', level: 'EMG', make: function (r, sh) { return solvePart(t(fnT(sh[1][0]) + '=' + sh[1][1]), sh[1][0], sh[1][1]); } },
      { id: 'A5d', level: 'EMG', make: function (r, sh) { return solvePart(t(fnT(sh[2][0]) + '=' + sh[2][1]), sh[2][0], sh[2][1]); } }] },
    { num: 'B1', section: 'B. Applying', parts: [{ id: 'B1', level: 'PRG', make: function (r) {
      var q = r.pick([2, 3, 4]), P = tripleP(r, q, [[-24, -7]]), given = r.pick(FN);
      return otherTwo(P, given, sideCond(r, given, q), { lead: 'Determine the exact values of the other two ratios.' });
    } }] },
    { num: 'B2', parts: [{ id: 'B2', level: 'ADV', make: function (r) {
      var o = pickWhere(function () { return { a: r.int(1, 9), b: r.int(1, 9), q: r.pick([2, 3, 4]) }; }, function (o) { return gcd(o.a, o.b) === 1 && o.a !== o.b && !sq(o.a * o.a + o.b * o.b) && !(o.a === 5 && o.b === 2 && o.q === 3) && !(o.a === 2 && o.b === 5 && o.q === 3); });
      var P = { X: o.b * o.b, Y: o.a * o.a, sx: o.q === 1 || o.q === 4 ? 1 : -1, sy: o.q <= 2 ? 1 : -1 };
      return otherTwo(P, 'tan', { kind: 'sign', fn2: r.pick(['sin', 'cos']) }, { rational: true, lead: 'Determine the exact values of the other two ratios with rational denominators.' });
    } }] },
    { num: 'B3', parts: [{ id: 'B3', level: 'PRG', make: function (r) {
      var o = pickWhere(function () { var fn = r.pick(FN), c = r.int(1, 4), a = c + r.int(1, 3), b = r.int(-9, 9), d = r.int(-9, 9); return { fn: fn, a: a, c: c, b: b, d: d, v: decOrFrac(d - b, a - c) }; },
        function (o) { if (o.b === o.d || o.b === 0 || o.d === 0) return false; if (o.fn !== 'tan' && Math.abs(o.v.v) >= 0.97) return false; if (o.fn === 'tan' && Math.abs(o.v.v) > 12) return false; if (o.fn === 'tan' && o.v.v === 4) return false; var ref = INV[o.fn](Math.abs(o.v.v)); if ([30, 45, 60].some(function (z) { return Math.abs(ref - z) < 0.3; })) return false; return [1, 2, 3, 4].every(function (q) { var x = U.place(ref, q) * 10; return Math.abs(x - Math.floor(x) - 0.5) > 0.06; }); });
      var f = '\\' + o.fn + '\\theta', side = function (k, c) { return (k === 1 ? '' : k) + f + (c > 0 ? '+' + c : c < 0 ? String(c) : ''); };
      var q = side(o.a, o.b) + '=' + side(o.c, o.d), k = o.a - o.c;
      var pre = [t((k === 1 ? '' : k) + f + '=' + (o.d - o.b)) + (k === 1 ? '' : ', so ' + t(f + '=' + o.v.tex)) + '.'];
      return solvePart('Solve ' + t(q) + ' for ' + t('0^\\circ\\le\\theta<360^\\circ') + DEC + '.', o.fn, o.v.v, { aTex: o.v.tex, pre: pre, altSets: [{ a: (o.b - o.d) / k, code: 'u3l3-isolate', hint: 'Check the signs when you collect the terms: subtract ' + t((o.c === 1 ? '' : o.c) + f) + ' and ' + t(o.b) + ' from both sides.' }].filter(function (z) { return o.fn === 'tan' || Math.abs(z.a) <= 1; }), hints: ['Collect the ' + t(f) + ' terms on one side and the numbers on the other, like solving for ' + t('x') + '.'].concat(H_SOLVE), text: 'solve with the ratio on both sides' });
    } }] },
    { num: 'B4', parts: [{ id: 'B4', level: 'PRG', make: function (r) {
      var o = pickWhere(function () { var L = r.pick([1.5, 2, 2.5, 3, 3.5, 4, 4.5, 6]); return { L: L, d: r.int(2, Math.round(L * 10) - 2) / 10, s: r.chance(0.5) ? 1 : -1, ax: r.pick(['x', 'y']) }; },
        function (o) { var v = o.d / o.L; if (v >= 0.97 || (o.L === 2.5 && o.d === 2)) return false; var ref = INV[o.ax === 'y' ? 'sin' : 'cos'](v); if ([30, 45, 60].some(function (z) { return Math.abs(ref - z) < 0.3; })) return false; return [1, 2, 3, 4].every(function (q) { var x = U.place(ref, q) * 10; return Math.abs(x - Math.floor(x) - 0.5) > 0.06; }); });
      var fn = o.ax === 'y' ? 'sin' : 'cos', v = o.s * o.d / o.L, dir = o.ax === 'x' ? (o.s > 0 ? 'east' : 'west') : (o.s > 0 ? 'north' : 'south');
      return solvePart('The end of a lawn sprinkler arm is ' + t((o.ax === 'x' ? 'x=' : 'y=') + o.L + '\\' + fn + '\\theta') + ' metres ' + (o.ax === 'x' ? 'east' : 'north') + ' of its pivot after the arm rotates ' + t('\\theta') + ' from due east (negative means ' + (o.ax === 'x' ? 'west' : 'south') + '). For ' + t('0^\\circ\\le\\theta<360^\\circ') + ', at what angles is the end ' + F(o.d) + ' m ' + dir + ' of the pivot? Answer to the nearest tenth of a degree.',
        fn, v, { aTex: decOrFrac(Math.round(o.s * o.d * 10), Math.round(o.L * 10)).tex, pre: [t(o.L + '\\' + fn + '\\theta=' + (o.s < 0 ? '-' : '') + o.d) + ', so ' + t('\\' + fn + '\\theta=' + decOrFrac(Math.round(o.s * o.d * 10), Math.round(o.L * 10)).tex) + '.'], text: 'sprinkler arm' });
    } }] },
    { num: 'B5', parts: [{ id: 'B5', level: 'PRG', make: function (r) {
      var fn = r.pick(FN), q = r.pick([2, 3, 4]), a = U.angleIn(r, q, [128]), rf = U.ref(a), s = U.sign(fn, q);
      var qs = U.quadsFor(fn, s), q2 = qs[0] === q ? qs[1] : qs[0], qo = U.quadsFor(fn, -s), rv = TG[fn](a);
      var right = (s < 0 ? '-' : '') + fnT(fn, U.deg(rf));
      var pool = [{ html: t((s < 0 ? '' : '-') + fnT(fn, U.deg(rf))), v: -s * TG[fn](rf), why: 'Check the sign: ' + t(fnT(fn, U.deg(a))) + ' is in Quadrant ' + U.ROM[q] + ' (' + U.castWhy(q) + ').', code: 'u3l3-sign' }]
        .concat(qo.map(function (z) { var b = U.place(rf, z); return { html: t(fnT(fn, U.deg(b))), v: TG[fn](b), why: t(U.deg(b)) + ' is in Quadrant ' + U.ROM[z] + ', where ' + t('\\' + fn) + ' has the opposite sign.', code: 'u3l3-quad' }; }))
        .concat([U.place(rf, q2), a].filter(function (b) { return b !== rf; }).map(function (b) { return { html: t('-' + fnT(fn, U.deg(b))), v: -TG[fn](b), why: t(fnT(fn, U.deg(b))) + ' has the same value as ' + t(fnT(fn, U.deg(a))) + ', so its negative doesn’t.', code: 'u3l3-sign' }; }))
        .filter(function (o) { return Math.abs(o.v - rv) > 1e-9; });
      var opts = [{ html: t(right), right: true }].concat(r.shuffle(pool).slice(0, 3));
      return U.mc(r, 'Which ratio has the same value as ' + t(fnT(fn, U.deg(a))) + '?', opts, t(U.deg(a)) + ' is in Quadrant ' + U.ROM[q] + ' with ' + t('\\theta_R=' + U.deg(rf)) + ', and ' + t('\\' + fn) + ' is ' + sgnWord(s) + ' there: ' + t(fnT(fn, U.deg(a)) + '=' + right) + '.', ['Write it with the reference angle and the CAST sign.'], 'same value (MC)');
    } }] },
    { num: 'B6', parts: [{ id: 'B6', level: 'PRG', make: function (r) {
      var o = pickWhere(function () { return { a: r.int(10, 95) / 100 }; }, function (o) { if (Math.abs(o.a - 0.85) < 1e-9 || Math.abs(o.a - 0.5) < 1e-9) return false; var sol = 180 - INV.cos(o.a); return Math.abs(sol - Math.floor(sol) - 0.5) > 0.06 && Math.abs(INV.cos(o.a) - 45) > 1 && Math.abs(INV.cos(o.a) - 30) > 1; });
      var ref = INV.cos(o.a), ans = Math.round(180 - ref);
      var p = B.nr('For ' + t('0^\\circ\\le\\theta\\le 180^\\circ') + ', the solution of ' + t('\\cos\\theta=-' + o.a) + ', to the nearest degree, is ____' + t('^\\circ') + '.', ans, function (v) { if (v === Math.round(ref)) return { code: 'u3l3-ref-only', hint: 'That’s the reference angle. Cosine is negative, so ' + t('\\theta') + ' is in Quadrant II here.' }; return null; },
        'II or III; ' + t('\\theta_R=\\cos^{-1}(' + o.a + ')\\approx ' + U.deg(fx(ref, 1))) + '. Quadrant II: ' + t('180^\\circ-' + U.deg(fx(ref, 1)) + '\\approx ' + U.deg(ans)) + '.', ['Only one quadrant with negative cosine is between ' + t('0^\\circ') + ' and ' + t('180^\\circ') + '.'], 'solve cos in 0–180 (NR)');
      p.bad = [String(Math.round(ref))]; return p;
    } }] },
    { num: 'C1', section: 'C. Stretch', parts: [{ id: 'C1', level: 'MAS', make: function (r) {
      var o = pickWhere(function () {
        var fs = r.sample(FN, 2);
        var fac = fs.map(function (fn) { var k = r.int(2, 6), c = r.int(1, 6) * (r.chance(0.5) ? 1 : -1); return { fn: fn, k: k, c: c, v: -c / k }; });
        return { fac: fac };
      }, function (o) {
        if (o.fac.some(function (f) { return gcd(f.k, Math.abs(f.c)) > 1 || (f.fn !== 'tan' && Math.abs(f.v) >= 0.97); })) return false;
        var all = []; o.fac.forEach(function (f) { all = all.concat(U.solveCalc(f.fn, f.v, 1).sols); });
        all.sort(function (a, b) { return a - b; });
        for (var i = 1; i < all.length; i++) if (all[i] - all[i - 1] < 0.5) return false;
        return all.every(function (x) { var y = x * 10; return Math.abs(y - Math.floor(y) - 0.5) > 0.06; }) && !(o.fac[0].fn === 'sin' && o.fac[0].k === 2 && o.fac[0].c === -1);
      });
      var fT = function (f) { return f.k + '\\' + f.fn + '\\theta' + (f.c > 0 ? '+' + f.c : String(f.c)); };
      var all = [], lines = [];
      o.fac.forEach(function (f) { var vT = (f.v < 0 ? '-' : '') + '\\frac{' + Math.abs(f.c) + '}{' + f.k + '}', info = U.solveCalc(f.fn, f.v, 1, vT); all = all.concat(info.sols); lines.push(t(fT(f) + '=0') + ': ' + t('\\' + f.fn + '\\theta=' + vT) + '. ' + info.lines.slice(0).join(' ')); });
      all.sort(function (a, b) { return a - b; });
      lines.push('All four: ' + t(U.angTex(all, 1)));
      var one = U.solveCalc(o.fac[0].fn, o.fac[0].v, 1).sols;
      return U.P.angles('Solve ' + t('\\left(' + fT(o.fac[0]) + '\\right)\\left(' + fT(o.fac[1]) + '\\right)=0') + ' for ' + t('0^\\circ\\le\\theta<360^\\circ') + DEC + '. (A product is zero when one factor is zero.)', all,
        { dp: 1, missingHint: 'Each factor gives its own solutions: set <b>each</b> factor equal to ' + t('0') + ' and solve both. There are four solutions.', altSets: [{ sols: one, code: 'u3l3-missing', hint: 'Now solve the second factor too: set it equal to ' + t('0') + '.' }] },
        lines.join('<br>'), ['Set each factor equal to ' + t('0') + ' and solve each equation for the ratio.'].concat(H_SOLVE), 'product of two factors = 0');
    } }] },
    { num: 'C2', parts: [{ id: 'C2', level: 'MAS', make: function (r) {
      var c = r.pick([{ g: 'cos', s: 1, q: 4 }, { g: 'sin', s: 1, q: 2 }, { g: 'cos', s: -1, q: 3 }, { g: 'sin', s: -1, q: 4 }, { g: 'cos', s: -1, q: 2 }, { g: 'sin', s: -1, q: 3 }]);
      var sx = c.q === 1 || c.q === 4 ? 1 : -1, sy = c.q <= 2 ? 1 : -1, root = '\\sqrt{1-k^{2}}';
      var xT = c.g === 'cos' ? (c.s < 0 ? '-k' : 'k') : (sx < 0 ? '-' : '') + root, yT = c.g === 'sin' ? (c.s < 0 ? '-k' : 'k') : (sy < 0 ? '-' : '') + root;
      var o2 = c.g === 'cos' ? 'sin' : 'cos', k1 = c.g === 'cos' ? yT : xT;
      var tanKey = (sx * sy < 0 ? '-' : '') + '\\frac{' + (c.g === 'cos' ? root : 'k') + '}{' + (c.g === 'cos' ? 'k' : root) + '}';
      var given = (c.s < 0 ? '-k' : 'k');
      var fields = [{ label: t('\\' + o2 + '\\theta='), name: o2 + ' θ', mode: 'math', keys: 'u3var', vars: ['k'], placeholder: 'e.g. -sqrt(1 - k^2)' }, { label: t('\\tan\\theta='), name: 'tan θ', mode: 'math', keys: 'u3var', vars: ['k'], placeholder: 'e.g. -sqrt(1-k^2)/k' }];
      var flip = (sx * sy < 0 ? '-' : '') + '\\frac{' + (c.g === 'cos' ? 'k' : root) + '}{' + (c.g === 'cos' ? root : 'k') + '}';
      var checks = [U.exprCheck(k1, 'k', { alts: [{ tex: '1-k^{2}', code: 'u3l3-noroot', hint: 'That’s the square of the side. Take the square root: ' + t('\\sqrt{1-k^{2}}') + '.' }, { tex: (k1.charAt(0) === '-' ? '-' : '') + '\\sqrt{1+k^{2}}', code: 'u3l3-pyth', hint: 'With ' + t('r=1') + ', the missing side squared is ' + t('1-k^{2}') + ' (subtract), not ' + t('1+k^{2}') + '.' }] }),
        U.exprCheck(tanKey, 'k', { alts: [{ tex: flip, code: 'u3l3-tan-flip', hint: t('\\tan\\theta=\\frac{y}{x}') + ', not ' + t('\\frac{x}{y}') + '.' }] })];
      var p = B.fields('Angle ' + t('\\theta') + ' is in Quadrant ' + U.ROM[c.q] + ' with ' + t('\\' + c.g + '\\theta=' + given) + ', where ' + t('0<k<1') + '. Write ' + t('\\' + o2 + '\\theta') + ' and ' + t('\\tan\\theta') + ' in terms of ' + t('k') + '.', fields, checks, [k1, tanKey],
        t('\\' + o2 + '\\theta=' + k1) + '<br>' + t('\\tan\\theta=' + tanKey),
        'Use ' + t((c.g === 'cos' ? 'x=' : 'y=') + given) + ', ' + t('r=1') + '. Then ' + t((c.g === 'cos' ? 'y' : 'x') + '^{2}=1-k^{2}') + ' and ' + t((c.g === 'cos' ? 'y' : 'x')) + ' is ' + ((c.g === 'cos' ? sy : sx) > 0 ? 'positive' : 'negative') + ' in Quadrant ' + U.ROM[c.q] + ', so ' + t((c.g === 'cos' ? 'y=' + yT : 'x=' + xT)) + '.<br>' + t('\\' + o2 + '\\theta=' + k1) + ', &nbsp; ' + t('\\tan\\theta=\\frac{y}{x}=' + tanKey),
        ['Use ' + t('r=1') + ' so the given ratio is the coordinate itself.', 'Find the other coordinate with ' + t('x^{2}+y^{2}=1') + ' and the sign for the quadrant.'], 'ratios in terms of k');
      p.bad = [[k1.charAt(0) === '-' ? k1.slice(1) : '-' + k1, tanKey], [k1, flip]];
      return p;
    } }] },
    { num: 'C3', parts: [{ id: 'C3', level: 'MAS', make: function (r) {
      var o = pickWhere(function () { return { a: r.int(1, 5), b: r.int(1, 5) * (r.chance(0.5) ? 1 : -1) }; }, function (o) { if (gcd(o.a, Math.abs(o.b)) !== 1) return false; if (o.a === 1 && o.b === 1) return false; var ref = INV.tan(Math.abs(o.b / o.a)); return [1, 2, 3, 4].every(function (q) { var x = U.place(ref, q) * 10; return Math.abs(x - Math.floor(x) - 0.5) > 0.06; }); });
      var lhs = (o.a === 1 ? '' : o.a) + '\\sin\\theta', rhs = (o.b === 1 ? '' : o.b === -1 ? '-' : o.b) + '\\cos\\theta', v = o.b / o.a, vT = Math.abs(o.b) === 1 && o.a === 1 ? String(o.b) : (v < 0 ? '-' : '') + (o.a === 1 ? Math.abs(o.b) : '\\frac{' + Math.abs(o.b) + '}{' + o.a + '}');
      var exactCase = Math.abs(v) === 1;
      return solvePart('For which angles ' + t('\\theta') + ', ' + t('0^\\circ\\le\\theta<360^\\circ') + ', is ' + t(lhs + '=' + rhs) + '? Answer to the nearest tenth of a degree. (Hint: on the terminal arm, ' + t('\\sin\\theta=\\frac{y}{r}') + ' and ' + t('\\cos\\theta=\\frac{x}{r}') + '.)', 'tan', v,
        { aTex: vT, pre: [t(lhs + '=' + rhs) + ' means ' + t((o.a === 1 ? '' : o.a) + 'y=' + (o.b === 1 ? '' : o.b === -1 ? '-' : o.b) + 'x') + ' (with ' + t('x\\ne 0') + '), so ' + t('\\tan\\theta=\\frac{y}{x}=' + vT) + (exactCase ? '' : '') + '.'],
          hints: ['Divide both sides by ' + t('\\cos\\theta') + ': ' + t('\\frac{\\sin\\theta}{\\cos\\theta}=\\tan\\theta') + '.'].concat(H_SOLVE), text: 'a sin θ = b cos θ' });
    } }] }
  ];

  ['said-pos', 'said-neg', 'odd', 'j-quad', 'j-ref', 'j-none', 'sign', 'quad', 'tan-flip'].forEach(function (c) { var o = {}; o['mc-u3l3-' + c] = (HW.CODES['u3l3-' + c] || { 'said-pos': 'Said positive (it’s negative)', 'said-neg': 'Said negative (it’s positive)', odd: 'Picked a ratio with the common sign', 'j-quad': 'Found only the quadrant error', 'j-ref': 'Found only the reference-angle error', 'j-none': 'Said Jordan made no error' }[c]) + ' (MC)'; HW.addCodes(o); });
  HW.addCodes({ 'u3l3-said-pos': 'Said positive (it’s negative)', 'u3l3-said-neg': 'Said negative (it’s positive)', 'u3l3-odd': 'Picked a ratio with the common sign', 'u3l3-j-quad': 'Found only the quadrant error', 'u3l3-j-ref': 'Found only the reference-angle error', 'u3l3-j-none': 'Said Jordan made no error', 'u3l3-noroot': 'Gave the square of the side', 'u3l3-pyth': 'Added instead of subtracting (Pythagoras)' });
  HW.addPartial({ 'u3l3-noroot': 'b', 'u3l3-pyth': 'b' });

  HW.defineLesson({ id: LID, unit: 3, num: '3', title: 'The CAST Rule: Signs and Solving for Angles', outcome: 'T2', questions: QUESTIONS, extra: EXTRA });
})(window);
