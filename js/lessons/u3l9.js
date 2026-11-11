/* Math 20-1 · Unit 3 · Lesson 9 — Unit 3 Review (outcome per part: T1 angles in standard position and reference angles,
 * T2 ratios of any angle, exact values and solving, T3 sine law, cosine law, ambiguous case)
 * Assignment 9 (m201book unit3/u3_l09.tex, Questions 1–27, a practice test) and the Lesson 9 Extra Practice, a second
 * practice test (u3_ep09.tex: A. Multiple Choice 1–10, B. Numerical Response 11–14, C. Written Response 15–18).
 * Every part is a generator (booklet idea, form and difficulty; new numbers; the lesson's example numbers and the
 * booklet's own excluded where feasible). Self-contained: no helpers from the other Unit 3 lesson files.
 * Calculator allowed (degree mode), except the exact-value parts (Assignment 4, 5, Extra 2–6, 16), which say
 * "no calculator" and want exact answers (√3/2, 1/√3 or √3/3 both fine, "undefined" possible; a calculator decimal
 * gets a nudge). Rounded answers: the rounding is stated and the value rounded that way is accepted; multi-step answers
 * also accept the value reached by rounding the intermediate step the way the booklet does (e.g. C to the nearest degree).
 * "All solutions" answers are typed as a list of angles (any order, "no solution" possible) and recognise only one
 * quadrant given, the reference angle given, a wrong CAST quadrant, the opposite-sign equation and "added 180°".
 * Triangles, quadrilaterals, bearings and terminal arms are drawn to scale from the generated numbers (js/geom.js).
 * Conversions: 1(a) table -> a quadrant grid + reference-angle boxes; 2, 3, Extra 15(a), 16(a) ratios -> labelled exact
 * boxes; 7 error analysis -> multiple choice; 10(a) proof reasons -> a grid; 11 -> a grid (0/1/2 triangles);
 * 13(a) "show that" -> the angle at the turn; 15(a) "explain" -> multiple choice; sketches -> in the worked solutions.
 * Two keypads are registered for this file when the widgets are loaded: u3l9exact (√, fraction, undefined) and
 * u3l9ang (comma, no solution).
 * Levels: LIM BEG EMG PRG ADV MAS. Mastery: 13(c), 14(c), 15(b), Extra 17(c). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, B = K.P, ex = HW.ex, F = HW.fmt, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, TR = HW.trig;
  var LID = 'u3l9', RAD = Math.PI / 180;

  var CODES = {
    'u3l9-ref-y': 'Reference angle measured to the y-axis', 'u3l9-ref-rule': 'Used another quadrant’s reference-angle rule', 'u3l9-quad': 'Wrong quadrant',
    'u3l9-ref-count': 'Missed angles with the same reference angle', 'u3l9-gave-ref': 'Gave the reference angle instead of θ', 'u3l9-place': 'Placed θR in the wrong quadrant',
    'u3l9-raw-atan': 'Gave the calculator’s inverse value without adjusting the quadrant', 'u3l9-radian': 'Calculator in radian mode', 'u3l9-r-noroot': 'Gave r² for r',
    'u3l9-swap-xy': 'Used x for y (sin and cos swapped)', 'u3l9-tan-flip': 'tan as x/y', 'u3l9-sign': 'Wrong sign (CAST)', 'u3l9-decimal': 'Calculator decimal for an exact value',
    'u3l9-co-angle': 'Used the other special angle’s value (30° ↔ 60°)', 'u3l9-tan-recip': 'tan value upside down (√3 ↔ 1/√3)', 'u3l9-not-undef': 'Gave a value for an undefined ratio',
    'u3l9-said-undef': 'Said undefined for a defined value', 'u3l9-zero-undef': '0 and undefined mixed up', 'u3l9-cast-sign': 'Ignored the CAST signs in an expression',
    'u3l9-one-sol': 'Only some of the solutions', 'u3l9-cast': 'A solution in the wrong CAST quadrant', 'u3l9-plus180': 'Added 180° for sin or cos', 'u3l9-opp-sign': 'Solved for the opposite sign',
    'u3l9-no-sol': 'Gave angles when there is no solution', 'u3l9-said-none': 'Said no solution when there are solutions', 'u3l9-range': 'Angle outside 0°–360°', 'u3l9-set': 'Wrong solutions',
    'u3l9-sq-pos': 'Square equation: used only the positive root', 'u3l9-sl-flip': 'Sine law ratio upside down', 'u3l9-forgot-angle': 'Used the wrong angle (third angle not found)',
    'u3l9-amb-obtuse': 'Gave an impossible obtuse angle', 'u3l9-cl-order': 'Cosine law: subtracted before multiplying by cos', 'u3l9-cl-noroot': 'Cosine law: forgot the square root',
    'u3l9-cl-plus': 'Cosine law: added 2bc cos A', 'u3l9-cl-sign': 'Dropped the negative cosine (acute instead of obtuse)', 'u3l9-opp-side': 'Angle opposite the wrong side',
    'u3l9-alt-cos': 'Altitude with cos instead of sin', 'u3l9-alt-mult': 'Multiplied instead of divided', 'u3l9-amb-count': 'Wrong number of triangles', 'u3l9-amb-one': 'Gave the same triangle twice',
    'u3l9-turn-heading': 'Used the change of heading, not the angle at the turn', 'u3l9-from-port': 'Gave the bearing from port (not back to port)', 'u3l9-bear-side': 'Port angle on the wrong side',
    'u3l9-opp-pair': 'Wrong side–angle pair', 'u3l9-area-half': 'Area: forgot the ½', 'u3l9-area-one': 'Area of only one triangle', 'u3l9-area-sum': 'Added the areas instead of subtracting',
    'u3l9-perim': 'Perimeter included the diagonal', 'u3l9-reflect': 'Wrong reflection rule', 'u3l9-bound': 'Wrong boundary for two triangles'
  };
  HW.addCodes(Object.keys(CODES).filter(function (k) { return !HW.CODES[k]; }).reduce(function (o, k) { o[k] = CODES[k]; return o; }, {}));
  HW.addPartial({ 'u3l9-ref-y': 'b', 'u3l9-ref-rule': 'b', 'u3l9-quad': 'b', 'u3l9-ref-count': 's', 'u3l9-gave-ref': 's', 'u3l9-place': 'b', 'u3l9-raw-atan': 's', 'u3l9-radian': 's',
    'u3l9-r-noroot': 's', 'u3l9-swap-xy': 'b', 'u3l9-tan-flip': 'b', 'u3l9-sign': 's', 'u3l9-co-angle': 'b', 'u3l9-tan-recip': 'b', 'u3l9-not-undef': 'b', 'u3l9-said-undef': 'b',
    'u3l9-zero-undef': 's', 'u3l9-cast-sign': 's', 'u3l9-one-sol': 's', 'u3l9-cast': 'b', 'u3l9-plus180': 'b', 'u3l9-opp-sign': 'b', 'u3l9-no-sol': 'b', 'u3l9-said-none': 'b',
    'u3l9-range': 's', 'u3l9-sq-pos': 's', 'u3l9-sl-flip': 'b', 'u3l9-forgot-angle': 'b', 'u3l9-amb-obtuse': 's', 'u3l9-cl-order': 'b', 'u3l9-cl-noroot': 's', 'u3l9-cl-plus': 'b',
    'u3l9-cl-sign': 's', 'u3l9-opp-side': 'b', 'u3l9-alt-cos': 'b', 'u3l9-alt-mult': 'b', 'u3l9-amb-count': 'b', 'u3l9-amb-one': 's', 'u3l9-turn-heading': 'b', 'u3l9-from-port': 's',
    'u3l9-bear-side': 'b', 'u3l9-opp-pair': 'b', 'u3l9-area-half': 's', 'u3l9-area-one': 'b', 'u3l9-area-sum': 'b', 'u3l9-perim': 's', 'u3l9-reflect': 'b', 'u3l9-bound': 'b' });

  /* ---- keypads for this file (registered once the widgets are loaded; in node they are just names) ---- */
  (function addKeys() {
    var W = HW.widgets; if (!W || !W.KEYSETS) return;
    function d(n) { return { label: String(n), tex: String(n), plain: String(n) }; }
    var del = { label: '⌫', fn: 'del', title: 'Delete' }, clr = { label: 'clear', fn: 'clear' }, lf = { label: '◀', fn: 'left', title: 'Move left' }, rt = { label: '▶', fn: 'right', title: 'Move right (out of a box)' };
    var ent = { label: 'Check ↵', fn: 'enter', wide: true }, neg = { label: '−', tex: '-', plain: '-' }, dot = { label: '.', tex: '.', plain: '.' };
    var sqrt = { label: '√', tex: '\\sqrt{#0}', plain: 'sqrt(', title: 'Square root' }, frac = { label: '<sup>a</sup>⁄<sub>b</sub>', tex: '\\frac{#@}{#?}', plain: '/', title: 'Fraction' };
    if (!W.KEYSETS.u3l9exact) W.KEYSETS.u3l9exact = [[d(7), d(8), d(9), sqrt, del], [d(4), d(5), d(6), frac, clr], [d(1), d(2), d(3), neg, lf, rt],
      [d(0), dot, { label: 'undefined', tex: '\\text{undefined}', plain: 'undefined', title: 'The ratio is undefined' }, ent]];
    if (!W.KEYSETS.u3l9ang) W.KEYSETS.u3l9ang = [[d(7), d(8), d(9), { label: ',', tex: ',\\ ', plain: ', ', title: 'Next angle' }, del], [d(4), d(5), d(6), dot, clr], [d(1), d(2), d(3), neg, lf, rt],
      [d(0), { label: 'no solution', tex: '\\text{no solution}', plain: 'no solution', title: 'The equation has no solution' }, ent]];
    if (W.KEYHELP) {
      W.KEYHELP.u3l9exact = ['Exact values: use <b>√</b> and the fraction key, e.g. ' + HW.k('-\\frac{\\sqrt{3}}{2}') + ' (' + HW.k('\\frac{1}{\\sqrt{3}}') + ' or ' + HW.k('\\frac{\\sqrt{3}}{3}') + ' are both fine). Press <b>undefined</b> if the ratio is undefined. Press <b>▶</b> to step out of a box.',
        'Type e.g. <code>-sqrt(3)/2</code>, or <code>undefined</code>.'];
      W.KEYHELP.u3l9ang = ['Type each angle in degrees, separated by commas (any order), e.g. ' + HW.k('48.6,\\ 131.4') + '. Press <b>no solution</b> if there is none.', 'Type the angles separated by commas, e.g. <code>48.6, 131.4</code>, or <code>no solution</code>.'];
    }
  })();

  /* ======================= helpers ======================= */
  function cl(x) { return Math.round(x * 1e9) / 1e9; }
  function same(a, b) { return Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b)); }
  function nT(x) { x = cl(x); if (Math.abs(x) < 1e-12) x = 0; return F(x); }
  function rd(x, dp) { return K.roundTo(x, dp); }
  function fx(x, dp) { return F(rd(x, dp).toFixed(Math.max(dp, 0))); }
  function fs(x, dp) { return rd(x, dp).toFixed(Math.max(dp, 0)); } // plain, for figures
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var r = a % b; a = b; b = r; } return a; }
  function range(a, b) { var o = []; for (var i = a; i <= b; i++) o.push(i); return o; }
  function pickWhere(gen, okf) { for (var i = 0; i < 8000; i++) { var o = gen(); if (okf(o)) return o; } throw new Error(LID + ': no valid numbers'); }
  function D(x) { return nT(x) + '^\\circ'; }
  function Dx(x, dp) { return fx(x, dp) + '^\\circ'; }
  function sn(d) { return TR.sin(d); } function cs(d) { return TR.cos(d); } function tn(d) { return TR.tan(d); }
  function asn(v) { return TR.asin(v); } function acs(v) { return TR.acos(v); } function atn(v) { return TR.atan(v); }
  function low(n) { return n.toLowerCase(); }
  function fig(svg) { return '<div class="fig" style="text-align:center;margin:6px 0">' + svg + '</div>'; }
  function uniqBy(arr, key) { var s = {}; return arr.filter(function (x) { var k = key(x); if (s[k]) return false; s[k] = 1; return true; }); }
  var QN = ['', 'I', 'II', 'III', 'IV'];
  function quadOf(a) { a = ((a % 360) + 360) % 360; return a < 90 ? 1 : a < 180 ? 2 : a < 270 ? 3 : 4; }
  function isQuadrantal(a) { return Math.abs(((a % 90) + 90) % 90) < 1e-9; }
  function refOf(a) { a = ((a % 360) + 360) % 360; var q = quadOf(a); return q === 1 ? a : q === 2 ? 180 - a : q === 3 ? a - 180 : 360 - a; }
  function fromRef(q, r) { return q === 1 ? r : q === 2 ? 180 - r : q === 3 ? 180 + r : 360 - r; }
  function refRule(q) { return q === 1 ? '\\theta_R=\\theta' : q === 2 ? '\\theta_R=180^\\circ-\\theta' : q === 3 ? '\\theta_R=\\theta-180^\\circ' : '\\theta_R=360^\\circ-\\theta'; }
  function placeTex(q, r, dp) { var rr = dp == null ? D(r) : Dx(r, dp), v = fromRef(q, r), vv = dp == null ? D(v) : Dx(v, dp); return q === 1 ? vv : q === 2 ? '180^\\circ-' + rr + '=' + vv : q === 3 ? '180^\\circ+' + rr + '=' + vv : '360^\\circ-' + rr + '=' + vv; }
  var POSQ = { sin: [1, 2], cos: [1, 4], tan: [1, 3] };
  function fv(f, a) { return f === 'sin' ? sn(a) : f === 'cos' ? cs(a) : tn(a); }
  function fname(f) { return '\\' + f; }
  function castTxt(f, sg) { var q = sg > 0 ? POSQ[f] : [1, 2, 3, 4].filter(function (x) { return POSQ[f].indexOf(x) < 0; }); return t(fname(f)) + ' is ' + (sg > 0 ? 'positive' : 'negative') + ' in quadrants ' + QN[q[0]] + ' and ' + QN[q[1]]; }
  /* exact numbers */
  function isRat(v) { for (var q = 1; q <= 48; q++) if (Math.abs(v * q - Math.round(v * q)) < 1e-9) return true; return false; }
  function ratOf(v) { for (var q = 1; q <= 48; q++) if (Math.abs(v * q - Math.round(v * q)) < 1e-9) { var p = Math.round(v * q), g = gcd(p, q) || 1; return [p / g, q / g]; } return null; }
  function ratTex(v) { var r = ratOf(v); if (!r) return nT(v); return r[1] === 1 ? String(r[0]) : (r[0] < 0 ? '-' : '') + '\\frac{' + Math.abs(r[0]) + '}{' + r[1] + '}'; }
  function sqParts(m) { var k = 1; for (var i = 2; i * i <= m; i++) while (m % (i * i) === 0) { m /= i * i; k *= i; } return [k, m]; } // √m = k√n
  function radTex(m) { var p = sqParts(m); return p[1] === 1 ? String(p[0]) : (p[0] === 1 ? '' : p[0]) + '\\sqrt{' + p[1] + '}'; }
  /* sign · k√n / d, reduced */
  function qrTex(sg, k, n, d) {
    var g = gcd(k, d); k /= g; d /= g;
    var core = n === 1 ? String(k) : (k === 1 ? '' : k) + '\\sqrt{' + n + '}';
    return (sg < 0 ? '-' : '') + (d === 1 ? core : '\\frac{' + core + '}{' + d + '}');
  }
  /* num / √m written exactly (rationalized when √m is irrational) */
  function overRootTex(num, m) {
    if (num === 0) return '0';
    var p = sqParts(m), sg = num < 0 ? -1 : 1, a = Math.abs(num);
    if (p[1] === 1) return fracTex(num, p[0]);
    return qrTex(sg, a, p[1], p[0] * p[1]);
  }
  function fracTex(p, q) { if (q < 0) { p = -p; q = -q; } var g = gcd(p, q) || 1; p /= g; q /= g; return q === 1 ? String(p) : (p < 0 ? '-' : '') + '\\frac{' + Math.abs(p) + '}{' + q + '}'; }
  /* exact values of special angles */
  var MAG = [[0, '0'], [0.5, '\\frac{1}{2}'], [Math.SQRT2 / 2, '\\frac{\\sqrt{2}}{2}'], [Math.sqrt(3) / 2, '\\frac{\\sqrt{3}}{2}'], [1, '1'], [Math.sqrt(3) / 3, '\\frac{\\sqrt{3}}{3}'], [Math.sqrt(3), '\\sqrt{3}']];
  function ev(f, a) {
    a = ((a % 360) + 360) % 360;
    var s = Math.sin(a * RAD), c = Math.cos(a * RAD); if (Math.abs(s) < 1e-12) s = 0; if (Math.abs(c) < 1e-12) c = 0;
    if (f === 'sin') return s; if (f === 'cos') return c; return c === 0 ? null : s / c;
  }
  function magTex(v) { var m = Math.abs(v); for (var i = 0; i < MAG.length; i++) if (Math.abs(m - MAG[i][0]) < 1e-9) return MAG[i][1]; return ratTex(m); }
  function valTex(v) { if (v === null) return '\\text{undefined}'; if (Math.abs(v) < 1e-12) return '0'; return (v < 0 ? '-' : '') + magTex(v); }
  function evTex(f, a) { return valTex(ev(f, a)); }
  function fa(f, a, sq) { return fname(f) + (sq ? '^2' : '') + ' ' + D(a); }
  function par(tx) { return /^-/.test(tx) ? '\\left(' + tx + '\\right)' : tx; }
  /* the co-value: the same function of the other special angle (30 ↔ 60), or the tan reciprocal */
  function coVal(f, a) { var r = refOf(a), v = ev(f, a); if (v === null || isQuadrantal(a) || r === 45) return null; var other = ev(f, fromRef(quadOf(a), 90 - r)); return other; }

  /* ---- reading exact answers ---- */
  function undefStr(s) { var u = String(s || '').replace(/\\(?:text|mathrm|operatorname|textrm)\{([^{}]*)\}/g, '$1').replace(/[\s\\{}~]/g, '').toLowerCase(); return /^(undefined|undef|und|dne|none|notdefined|doesnotexist)$/.test(u); }
  function coefOf(n) { if (!n) return 1; if (n.t === 'num') return n.dec ? null : n.v; if (n.t === 'neg' || n.t === 'paren') return coefOf(n.a); if (n.t === 'mul') { var a = coefOf(n.a), b = coefOf(n.b); return a == null || b == null ? null : a * b; } if (n.t === 'root') return 1; return null; }
  function rootsSimple(n) {
    var okk = true;
    (function w(x) { if (!x || typeof x !== 'object') return; if (x.t === 'root' && x.a && x.a.t === 'num' && !x.a.dec && (!x.n || x.n.v === 2)) { if (sqParts(x.a.v)[0] > 1) okk = false; } ['a', 'b', 'n'].forEach(function (k) { if (x[k]) w(x[k]); }); })(n);
    return okk;
  }
  function fracLowest(n) { while (n && (n.t === 'neg' || n.t === 'paren')) n = n.a; if (!n || n.t !== 'div') return true; var a = coefOf(n.a), b = coefOf(n.b); if (a == null || b == null) return true; return gcd(Math.round(a), Math.round(b)) <= 1; }
  /* an exact value (val = null: undefined). o.cands: [[value | 'undef', code, hint]], o.signHint */
  function exChk(val, o) {
    o = o || {};
    var cands = o.cands || [];
    return function (resp) {
      var s = String(resp == null ? '' : resp).trim();
      if (!s) return form('empty', 'Type your answer first.');
      var und = undefStr(s), i;
      if (val === null) {
        if (und) return ok();
        var a0 = K.read(s); if (a0.res) return a0.res;
        for (i = 0; i < cands.length; i++) if (cands[i][0] !== 'undef' && same(a0.val, cands[i][0])) return wrong(cands[i][1], cands[i][2]);
        return wrong(LID + '-not-undef', o.undefHint || 'Here ' + t('x=0') + ', and you can’t divide by ' + t('0') + ': the ratio is <b>undefined</b> (press <b>undefined</b>).');
      }
      if (und) { for (i = 0; i < cands.length; i++) if (cands[i][0] === 'undef') return wrong(cands[i][1], cands[i][2]); return wrong(LID + '-said-undef', o.defHint || 'This ratio is defined: the denominator isn’t ' + t('0') + '. Work out its value.'); }
      var a = K.read(s); if (a.res) return a.res;
      var sh = ex.shape(a.ast);
      if (Object.keys(sh.vars).length) return form('notnumber', 'Give an exact number (use √ and fractions)' + (o.undefOk === false ? '.' : ', or press <b>undefined</b>.'));
      if (sh.decimals && !isRat(val) && Math.abs(a.val - val) < 0.02) return form(LID + '-decimal', 'That is a calculator decimal. Give the <b>exact</b> value, with a square root (use a special triangle or the point’s coordinates).');
      if (same(a.val, val)) {
        if (sh.ops || /\\times|\\cdot/.test(s)) return form('simplify', 'Right value — now simplify it to a single number or fraction.');
        if (!rootsSimple(a.ast)) return form('not-simplest', 'Right value — now simplify the square root (take out the perfect-square factor).');
        if (!fracLowest(a.ast)) return form('lowest', 'Right value — now reduce the fraction.');
        return ok();
      }
      if (!isFinite(a.val)) return wrong('undefined', null);
      for (i = 0; i < cands.length; i++) if (cands[i][0] !== 'undef' && cands[i][0] !== null && same(a.val, cands[i][0])) return wrong(cands[i][1], cands[i][2]);
      if (val !== 0 && same(a.val, -val)) return wrong(LID + '-sign', o.signHint || 'Check the sign: use CAST for the quadrant.');
      return wrong('value', null);
    };
  }
  /* ---- rounded numbers. o: alts [{v, code, hint}], acc (values also accepted), unit, nr, sol, hints, text, v ---- */
  function nP(prompt, x, dp, o) {
    o = o || {};
    var acc = (o.acc || []).filter(function (v) { return isFinite(v); });
    var alts = (o.alts || []).filter(function (a) { return a && isFinite(a.v) && !acc.some(function (v) { return Math.abs(rd(v, dp) - rd(a.v, dp)) < 1e-9; }); });
    var p = K.P.near(prompt, x, dp, { unit: o.unit, after: o.after, alts: alts, nr: o.nr }, o.sol, o.hints || [], o.text);
    var base = p.check;
    if (acc.length) p.check = function (resp) { var r0 = base(resp); if (r0.v === 'correct') return r0; var pn = HW.parse.number(String(resp == null ? '' : resp).trim()); if (pn.ok && acc.some(function (v) { return Math.abs(pn.value - rd(v, dp)) < 1e-9; })) return ok(); return r0; };
    p.bad = uniqBy(alts.map(function (a) { return fs(a.v, dp); }), function (s) { return s; }).filter(function (s) { return s !== p.key && Math.abs(Number(s) - x) > Math.pow(10, -dp) * 0.6 && !acc.some(function (v) { return fs(v, dp) === s; }); });
    if (o.v) p._v = o.v;
    return p;
  }
  function deg(prompt, x, dp, o) { o = o || {}; o.unit = '°'; return nP(prompt, x, dp, o); }
  /* typical wrong values for K.number: [[value, code, hint]] */
  function cdiag(c) { return function (v) { for (var i = 0; i < (c || []).length; i++) if (c[i] && isFinite(c[i][0]) && same(v, c[i][0])) return { code: c[i][1], hint: c[i][2] }; return null; }; }
  function intP(prompt, x, o) {
    o = o || {};
    var p = B.number(prompt, x, cdiag(o.cands), o.sol, o.hints || [], o.text, { after: o.unit, nr: o.nr });
    if (o.unit) p.answer = t(nT(x) + (o.unit === '°' ? '^\\circ' : '\\text{ ' + o.unit + '}'));
    p.bad = (o.cands || []).map(function (c) { return String(c[0]); }).filter(function (s) { return Number(s) !== x; });
    return p;
  }
  /* several boxes. spec: { label, name, kind: 'near' | 'exact' | 'int', x, dp, alts, acc, cands, unit, key (exact) } */
  function fP(prompt, specs, o) {
    o = o || {};
    var fields = [], checks = [], keys = [], ans = [], bad = [];
    specs.forEach(function (s) {
      var math = s.kind === 'exact';
      fields.push({ label: s.label, name: s.name || s.label, after: s.after != null ? s.after : s.unit, before: s.before, mode: math ? 'math' : undefined, keys: math ? (s.keys || 'u3l9exact') : undefined, placeholder: math ? 'e.g. -sqrt(3)/2' : undefined });
      if (math) { checks.push(exChk(s.x, s)); keys.push(s.key); ans.push((s.label ? s.label + ' ' : '') + t(s.key)); bad.push(s.x === null ? '0' : s.x === 0 ? '1' : '-(' + s.key + ')'); }
      else if (s.kind === 'int') { checks.push(K.number(s.x, cdiag(s.cands))); keys.push(String(s.x)); ans.push((s.label ? s.label + ' ' : '') + t(nT(s.x) + (s.unit === '°' ? '^\\circ' : s.unit ? '\\text{ ' + s.unit + '}' : ''))); bad.push(String(s.x + 1)); }
      else { var q = nP('', s.x, s.dp, s); checks.push(q.check); keys.push(q.key); ans.push((s.label ? s.label + ' ' : '') + q.answer); bad.push(String(Number(q.key) + 1)); }
    });
    var p = B.fields(prompt, fields, checks, keys, ans.join('<br>'), o.sol, o.hints || [], o.text);
    if (o.swap) {
      var c0 = p.check;
      p.check = function (resp) { var r0 = c0(resp); if (r0.v === 'correct' || !resp || resp.length < 2) return r0; var sw = resp.slice(); var tmp = sw[0]; sw[0] = sw[1]; sw[1] = tmp; if (checks[0](sw[0]).v === 'correct' && checks[1](sw[1]).v === 'correct') return wrong('swap-answer', o.swapHint || 'Right numbers, but in each other’s boxes.'); return r0; };
    }
    p.bad = [bad].concat(o.bad || []);
    if (o.v) p._v = o.v;
    return p;
  }
  function mcP(r, prompt, opts, sol, hints, text, keepOrder) {
    var seen = {}, out = [];
    opts.forEach(function (op) { var k = op.html.replace(/\s/g, ''); if (seen[k] && !op.right) return; seen[k] = 1; out.push(op); });
    return B.mc(r, prompt, out, sol, hints || [], text, keepOrder);
  }

  /* ---- "list all solutions" answers ---- */
  function readAng(resp) {
    var s = String(resp == null ? '' : resp);
    s = s.replace(/\\left|\\right/g, '').replace(/\\(?:text|mathrm|operatorname|textrm)\{([^{}]*)\}/g, ' $1 ').replace(/\{,\}/g, ',').replace(/\^\{?\s*\\circ\s*\}?|\\circ|\\degree|°/g, ' ')
      .replace(/\\theta|θ/g, ' ').replace(/\\[,;:! ]|~|\\quad|\\qquad/g, ' ').replace(/\\\{|\\\}|\\lbrace|\\rbrace|\\emptyset|\\varnothing|∅/g, function (m) { return /empty|nothing|∅/.test(m) ? ' none ' : ' '; })
      .replace(/=/g, ' ').replace(/−/g, '-').replace(/\bdeg(rees)?\b/gi, ' ');
    var plain = s.replace(/[{}]/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
    if (!plain) return { empty: true };
    if (/^(no ?(real )?solutions?|none|dne|nosolution)$/.test(plain)) return { none: true, vals: [], strs: [] };
    var bits = plain.replace(/\band\b|\bor\b|;/g, ',').split(/[,\s]+/).filter(Boolean), vals = [], strs = [];
    for (var i = 0; i < bits.length; i++) { var p = HW.parse.number(bits[i]); if (!p.ok) return { bad: bits[i] }; vals.push(p.value); strs.push(bits[i]); }
    return { vals: vals, strs: strs };
  }
  function angKey(vals, dp) { return vals.length ? vals.slice().sort(function (a, b) { return a - b; }).map(function (v) { return fs(v, dp); }).join(', ') : '\\text{no solution}'; }
  function angTex(vals, dp) { return vals.length ? '\\theta=' + vals.slice().sort(function (a, b) { return a - b; }).map(function (v) { return Dx(v, dp); }).join(',\\ ') : '\\text{no solution}'; }
  /* o: { vals, dp, f, a (the ratio), ref, xc: [[v, code, hint]], setDiag(got) -> {code, hint}, noneHint, emptyHint, missHint } */
  function angChk(o) {
    var dp = o.dp || 0, want = o.vals.slice(), tol = dp ? Math.pow(10, -dp) * 0.6 : 1e-9;
    function m(v, x) { return Math.abs(v - rd(x, dp)) < 1e-9 || Math.abs(v - x) <= tol; }
    function one(v) {
      var xc = o.xc || [], i;
      for (i = 0; i < xc.length; i++) if (m(v, xc[i][0]) && !want.some(function (x) { return m(xc[i][0], x); })) return { code: xc[i][1], hint: xc[i][2] };
      if (o.ref != null && m(v, o.ref) && !want.some(function (x) { return m(o.ref, x); })) return { code: LID + '-gave-ref', hint: t(Dx(o.ref, dp)) + ' is the reference angle ' + t('\\theta_R') + '. Now place it in the right quadrants.' };
      if (o.f && o.a != null && o.a !== 0) { var fvv = fv(o.f, v); if (isFinite(fvv) && Math.abs(fvv + o.a) < 0.012 * Math.max(1, Math.abs(o.a))) return { code: LID + '-opp-sign', hint: t(Dx(v, dp)) + ' solves ' + t(fname(o.f) + '\\theta=' + nT(-cl(o.a))) + ' — check the sign. ' + castTxt(o.f, o.a > 0 ? 1 : -1) + '.' }; }
      if (o.f && o.f !== 'tan' && want.some(function (x) { return m(v, (x + 180) % 360); })) return { code: LID + '-plus180', hint: 'Adding ' + t('180^\\circ') + ' gives the second angle only for <b>tangent</b>. ' + (o.a != null ? castTxt(o.f, o.a > 0 ? 1 : -1) + '.' : '') };
      if (o.ref != null && Math.abs(refOf(v) - o.ref) <= tol + 1e-9) return { code: LID + '-cast', hint: t(Dx(v, dp)) + ' has the right reference angle, but it is in quadrant ' + QN[quadOf(v)] + '.' + (o.f && o.a != null ? ' ' + castTxt(o.f, o.a > 0 ? 1 : -1) + '.' : '') };
      return null;
    }
    return function (resp) {
      var R = readAng(resp);
      if (R.empty) return form('empty', 'Type your answer first.');
      if (R.bad) return form('unreadable', 'Type the angles as numbers separated by commas, e.g. ' + t('48.6,\\ 131.4') + ' (or press <b>no solution</b>).');
      if (R.none) return want.length ? wrong(LID + '-said-none', o.noneHint || 'This equation has solutions: the value is between ' + t('-1') + ' and ' + t('1') + ' (or it is a tangent, which can be any number).') : ok();
      var got = R.vals, i, j;
      if (!want.length) return wrong(LID + '-no-sol', o.emptyHint || 'Look at the value first: sine and cosine are always between ' + t('-1') + ' and ' + t('1') + '.');
      for (i = 0; i < got.length; i++) for (j = i + 1; j < got.length; j++) if (Math.abs(got[i] - got[j]) < 1e-9) return form('duplicate', 'You listed ' + t(nT(got[i]) + '^\\circ') + ' twice.');
      var outR = got.filter(function (v) { return v < 0 || v >= 360; });
      if (outR.length) { var v0 = outR[0], w0 = v0 < 0 ? v0 + 360 : v0 - 360; return wrong(LID + '-range', 'Give angles from ' + t('0^\\circ') + ' up to (not including) ' + t('360^\\circ') + '.' + (want.some(function (x) { return m(w0, x); }) ? ' ' + t(nT(v0) + '^\\circ') + ' has the same terminal arm as ' + t(nT(w0) + '^\\circ') + '.' : '')); }
      var used = {}, idx = got.map(function (v) { for (var k = 0; k < want.length; k++) if (!used[k] && m(v, want[k])) { used[k] = 1; return k; } return -1; });
      var nOk = idx.filter(function (k) { return k >= 0; }).length;
      if (nOk === want.length && got.length === want.length) {
        if (dp > 0 && R.strs.some(function (s) { return (s.split('.')[1] || '').length > dp; })) return form('round', 'Right angles — now round each to the nearest ' + (dp === 1 ? 'tenth' : 'hundredth') + ' of a degree.');
        return ok();
      }
      if (o.setDiag) { var hs = o.setDiag(got, m); if (hs) return wrong(hs.code, hs.hint); }
      for (i = 0; i < got.length; i++) if (idx[i] < 0) { var h = one(got[i]); if (h) return wrong(h.code, h.hint); }
      if (nOk === got.length && got.length < want.length) return wrong(LID + '-one-sol', o.missHint || ('Right so far, but there ' + (want.length - nOk === 1 ? 'is another solution' : 'are ' + (want.length - nOk) + ' more solutions') + '. ' + (o.f && o.a != null && o.a !== 0 ? castTxt(o.f, o.a > 0 ? 1 : -1) + ': one angle in each.' : 'Check every quadrant.')));
      return wrong(LID + '-set', (nOk ? nOk + ' of your angles ' + (nOk === 1 ? 'is' : 'are') + ' right. Check the others. ' : '') + (o.lastHint || ''));
    };
  }
  function angP(prompt, vals, dp, o) {
    o = o || {}; o.vals = vals; o.dp = dp;
    var sorted = vals.slice().sort(function (a, b) { return a - b; });
    var bad = [];
    if (sorted.length > 1) bad.push(fs(sorted[0], dp));
    if (sorted.length) bad.push('\\text{no solution}'); else bad.push('30, 150');
    if (o.ref != null && !vals.some(function (v) { return Math.abs(v - o.ref) < 1e-9; })) bad.push(fs(o.ref, dp));
    (o.xc || []).filter(function (c) { return isFinite(c[0]) && !vals.some(function (v) { return Math.abs(rd(v, dp) - rd(c[0], dp)) < 1e-9; }); }).forEach(function (c) { bad.push(sorted.slice(1).map(function (v) { return fs(v, dp); }).concat([fs(c[0], dp)]).join(', ')); });
    var p = { prompt: prompt, input: { type: 'math', keys: 'u3l9ang', before: t('\\theta='), placeholder: 'e.g. 48.6, 131.4' }, check: angChk(o), key: angKey(vals, dp), answer: t(angTex(vals, dp)),
      solution: o.sol, hints: o.hints || [], text: o.text, bad: bad.filter(function (b) { return b !== angKey(vals, dp); }) };
    if (o.v) p._v = o.v;
    return p;
  }
  /* solutions of f θ = a, 0 ≤ θ < 360 */
  function solve(f, a) {
    if (f !== 'tan' && Math.abs(a) > 1 + 1e-12) return [];
    var out = [];
    if (f === 'sin') { if (Math.abs(a - 1) < 1e-12) return [90]; if (Math.abs(a + 1) < 1e-12) return [270]; if (Math.abs(a) < 1e-12) return [0, 180]; var r = asn(Math.abs(a)); out = a > 0 ? [r, 180 - r] : [180 + r, 360 - r]; }
    else if (f === 'cos') { if (Math.abs(a - 1) < 1e-12) return [0]; if (Math.abs(a + 1) < 1e-12) return [180]; if (Math.abs(a) < 1e-12) return [90, 270]; var r2 = acs(Math.abs(a)); out = a > 0 ? [r2, 360 - r2] : [180 - r2, 180 + r2]; }
    else { if (Math.abs(a) < 1e-12) return [0, 180]; var r3 = atn(Math.abs(a)); out = a > 0 ? [r3, 180 + r3] : [180 - r3, 360 - r3]; }
    return out.map(function (v) { return Math.abs(v - Math.round(v)) < 1e-9 ? Math.round(v) : v; });
  }
  function refFor(f, a) { return f === 'sin' ? asn(Math.min(1, Math.abs(a))) : f === 'cos' ? acs(Math.min(1, Math.abs(a))) : atn(Math.abs(a)); }
  function solveSol(f, a, dp, pre) {
    var sols = solve(f, a), r = refFor(f, a), sg = a > 0 ? 1 : -1;
    if (!sols.length) return (pre || '') + t(fname(f) + '\\theta=' + nT(cl(a))) + ', but ' + t('-1\\le ' + fname(f) + '\\theta\\le 1') + ': <b>no solution</b>.';
    if (isQuadrantal(sols[0]) && (Math.abs(Math.abs(a) - 1) < 1e-9 || Math.abs(a) < 1e-9) && f !== 'tan' || (f === 'tan' && Math.abs(a) < 1e-9)) return (pre || '') + 'Quadrantal: on the unit circle, ' + t(fname(f) + '\\theta=' + nT(cl(a))) + ' at ' + t(angTex(sols, 0)) + '.';
    var rr = dp == null ? D(rd(r, 9)) : Dx(r, dp), dd = dp == null ? 0 : dp;
    return (pre || '') + t('\\theta_R=' + (dp == null ? '' : '\\' + (f === 'sin' ? 'sin' : f === 'cos' ? 'cos' : 'tan') + '^{-1}(' + nT(Math.abs(cl(a))) + ')\\approx ') + rr) + '. ' + castTxt(f, sg) + ': ' + t('\\theta=' + sols.map(function (v) { return Dx(v, dd); }).join(',\\ ')) + '.';
  }

  /* ---- figures ---- */
  /* a triangle to scale: nm = [n0, n1, n2]; A = angle at n0, b = |n0 n2|, c = |n0 n1|; lab = { a, b, c, A, B, C } (plain text) */
  function triFig(nm, A, b, c, lab, o) {
    o = o || {};
    var pts = {}; pts[nm[0]] = [0, 0]; pts[nm[1]] = [c, 0]; pts[nm[2]] = [b * cs(A), b * sn(A)];
    if (o.flip) Object.keys(pts).forEach(function (k) { pts[k] = [-pts[k][0], pts[k][1]]; });
    var segs = [[nm[1], nm[2], lab.a], [nm[0], nm[2], lab.b], [nm[0], nm[1], lab.c]].map(function (s) { return s[2] == null ? [s[0], s[1]] : s; });
    var angs = [];
    if (lab.A) angs.push([nm[0], nm[1], nm[2], lab.A]); if (lab.B) angs.push([nm[1], nm[0], nm[2], lab.B]); if (lab.C) angs.push([nm[2], nm[0], nm[1], lab.C]);
    return fig(HW.fig({ pts: pts, segs: segs, angles: angs, width: o.width || 270, height: o.height || 220, extra: o.extra, aria: o.aria || 'triangle drawn to scale' }));
  }
  /* a terminal arm through P(x, y), with the rotation arc */
  function armFig(x, y, o) {
    o = o || {};
    var S = 220, c = S / 2, m = Math.max(Math.abs(x), Math.abs(y)) || 1, k = 78 / m, px = c + x * k, py = c - y * k, th = Math.atan2(y, x) / RAD; if (th < 0) th += 360;
    var s = '<line x1="12" y1="' + c + '" x2="' + (S - 12) + '" y2="' + c + '" stroke="#6a7182" stroke-width="1.3"/><line x1="' + c + '" y1="' + (S - 12) + '" x2="' + c + '" y2="12" stroke="#6a7182" stroke-width="1.3"/>';
    s += '<text x="' + (S - 10) + '" y="' + (c - 8) + '" font-size="13" text-anchor="end" font-style="italic" fill="#2b3340">x</text><text x="' + (c + 9) + '" y="20" font-size="13" font-style="italic" fill="#2b3340">y</text>';
    if (o.tri !== false && x !== 0 && y !== 0) s += '<line x1="' + px.toFixed(1) + '" y1="' + py.toFixed(1) + '" x2="' + px.toFixed(1) + '" y2="' + c + '" stroke="#6a7182" stroke-width="1.4" stroke-dasharray="5 4"/>';
    s += '<line x1="' + c + '" y1="' + c + '" x2="' + px.toFixed(1) + '" y2="' + py.toFixed(1) + '" stroke="#2b3340" stroke-width="2.4" stroke-linecap="round"/><circle cx="' + px.toFixed(1) + '" cy="' + py.toFixed(1) + '" r="3.6" fill="#2b55a0"/>';
    if (th > 0.5) { var rr = 24, x1 = c + rr, y1 = c, x2 = c + rr * Math.cos(th * RAD), y2 = c - rr * Math.sin(th * RAD); s += '<path d="M' + x1 + ' ' + y1 + ' A' + rr + ' ' + rr + ' 0 ' + (th > 180 ? 1 : 0) + ' 0 ' + x2.toFixed(1) + ' ' + y2.toFixed(1) + '" fill="none" stroke="#2b55a0" stroke-width="1.8"/>'; var mid = th / 2 * RAD; s += '<text x="' + (c + 38 * Math.cos(mid)).toFixed(1) + '" y="' + (c - 38 * Math.sin(mid) + 4).toFixed(1) + '" font-size="13" text-anchor="middle" font-style="italic" fill="#2b55a0">θ</text>'; }
    var lx = px + (x >= 0 ? 6 : -6), ly = py + (y >= 0 ? -8 : 16);
    s += '<text x="' + lx.toFixed(1) + '" y="' + ly.toFixed(1) + '" font-size="13" text-anchor="' + (x >= 0 ? 'start' : 'end') + '" fill="#2b3340" paint-order="stroke" stroke="#fff" stroke-width="3">' + (o.name || 'P') + '(' + String(x).replace('-', '−') + ', ' + String(y).replace('-', '−') + ')</text>';
    return fig('<svg class="fig-svg" viewBox="0 0 ' + S + ' ' + S + '" width="100%" style="max-width:' + S + 'px" role="img" aria-label="terminal arm through a point">' + s + '</svg>');
  }
  /* a path of legs [{d, b (bearing)}] from a start, with north lines; names = labels of the points */
  function bearFig(legs, names, labs, o) {
    o = o || {};
    var pts = {}, x = 0, y = 0, ids = ['O'], extra = [], tot = legs.reduce(function (s, l) { return s + l.d; }, 0), L = tot * 0.22;
    pts.O = [0, 0];
    legs.forEach(function (l, i) { x += l.d * sn(l.b); y += l.d * cs(l.b); pts['P' + i] = [x, y]; ids.push('P' + i); });
    var segs = [];
    for (var i = 0; i + 1 < ids.length; i++) segs.push([ids[i], ids[i + 1], labs[i]]);
    if (o.close !== false) segs.push([ids[ids.length - 1], 'O', labs[legs.length] || '', { dash: true }]);
    ids.slice(0, o.northAll ? ids.length : ids.length - 1).forEach(function (id) { var p = pts[id]; extra.push({ type: 'dash', from: p, to: [p[0], p[1] + L] }); extra.push({ type: 'text', at: [p[0], p[1] + L * 1.18], text: 'N', size: 12 }); });
    var nmap = {}; ids.forEach(function (id, k) { nmap[id] = names[k]; });
    return fig(HW.fig({ pts: pts, segs: segs, names: nmap, extra: extra, width: o.width || 250, height: o.height || 240, aria: 'bearing diagram' }));
  }

  /* ---- sine-law and cosine-law helpers ---- */
  function clSide(b, c, A) { return Math.sqrt(b * b + c * c - 2 * b * c * cs(A)); }
  function clAlts(b, c, A, nm) {
    var o = (b * b + c * c - 2 * b * c) * cs(A), rad = Math.sqrt(Math.max(0, b * b + c * c - 2 * b * c * Math.cos(A)));
    return [{ v: o > 0 ? Math.sqrt(o) : NaN, code: LID + '-cl-order', hint: 'Order of operations: work out ' + t('2(' + nT(b) + ')(' + nT(c) + ')\\cos ' + D(A)) + ' first, then subtract it from ' + t(nT(b) + '^2+' + nT(c) + '^2') + '.' },
      { v: b * b + c * c - 2 * b * c * cs(A), code: LID + '-cl-noroot', hint: 'That is ' + t((nm || 'a') + '^2') + '. Take the square root.' },
      { v: Math.sqrt(b * b + c * c + 2 * b * c * cs(A)), code: LID + '-cl-plus', hint: 'The cosine law <b>subtracts</b> ' + t('2bc\\cos A') + '.' },
      { v: rad, code: LID + '-radian', hint: 'Your calculator is in <b>radian</b> mode. Switch to degree mode.' }];
  }
  function slAlts(known, sinTop, sinBot, top, bot) {
    return [{ v: known * sn(bot) / sn(top), code: LID + '-sl-flip', hint: 'Sine law: ' + t('\\dfrac{\\text{side}}{\\sin(\\text{its opposite angle})}') + ' is the same for every pair. The unknown side goes with the sine of <b>its own</b> opposite angle.' },
      { v: known * Math.sin(top) / Math.sin(bot), code: LID + '-radian', hint: 'Your calculator is in <b>radian</b> mode. Switch to degree mode.' }];
  }
  function ptAngle(x, y) { var a = Math.atan2(y, x) / RAD; if (a < 0) a += 360; return Math.abs(a - Math.round(a)) < 1e-9 ? Math.round(a) : a; }
  function ptAlts(x, y) {
    var th = ptAngle(x, y), q = quadOf(th), r0 = atn(Math.abs(y / x)), out = [];
    out.push({ v: r0, code: LID + '-gave-ref', hint: 'That is the reference angle ' + t('\\theta_R') + '. The point is in quadrant ' + QN[q] + ': ' + t(refRule(q)) + ', so find ' + t('\\theta') + ' from it.' });
    [2, 3, 4].forEach(function (k) { if (k !== q) out.push({ v: fromRef(k, r0), code: LID + '-place', hint: 'Check the quadrant: ' + t('x') + ' is ' + (x > 0 ? 'positive' : 'negative') + ' and ' + t('y') + ' is ' + (y > 0 ? 'positive' : 'negative') + ', so the point is in quadrant ' + QN[q] + '.' }); });
    out.push({ v: atn(y / x), code: LID + '-raw-atan', hint: t('\\tan^{-1}') + ' only gives angles between ' + t('-90^\\circ') + ' and ' + t('90^\\circ') + '. Find ' + t('\\theta_R') + ' with positive values, then place it in quadrant ' + QN[q] + '.' });
    out.push({ v: Math.atan(Math.abs(y / x)), code: LID + '-radian', hint: 'Your calculator is in <b>radian</b> mode. Switch to degree mode.' });
    out.push({ v: fromRef(q, atn(Math.abs(x / y))), code: LID + '-tan-flip', hint: t('\\tan\\theta_R=\\left|\\dfrac{y}{x}\\right|') + ': the vertical side over the horizontal side.' });
    return out;
  }
  function ptSol(x, y, dp) { var th = ptAngle(x, y), q = quadOf(th), r0 = atn(Math.abs(y / x)); return 'Quadrant ' + QN[q] + ': ' + t('\\theta_R=\\tan^{-1}\\left(\\dfrac{' + Math.abs(y) + '}{' + Math.abs(x) + '}\\right)\\approx ' + Dx(r0, dp)) + ', so ' + t('\\theta=' + placeTex(q, rd(r0, dp), dp)) + '.'; }

  /* ---- exact ratios of a point P(x, y) ---- */
  function ptRatios(x, y) {
    var m = x * x + y * y;
    return { m: m, r: Math.sqrt(m), rKey: radTex(m), sinKey: overRootTex(y, m), cosKey: overRootTex(x, m), tanKey: x === 0 ? '\\text{undefined}' : fracTex(y, x),
      sin: y / Math.sqrt(m), cos: x / Math.sqrt(m), tan: x === 0 ? null : y / x };
  }
  function ratioSpecs(x, y, withR) {
    var P = ptRatios(x, y), q = isQuadrantal(ptAngle(x, y)) ? 0 : quadOf(ptAngle(x, y));
    var sgH = function (f) { return 'Check the sign: ' + (q ? 'the point is in quadrant ' + QN[q] + ', where ' + castTxt(f, fv(f, ptAngle(x, y)) > 0 ? 1 : -1).replace(/ in quadrants.*/, '') : 'look at the signs of ' + t('x') + ' and ' + t('y')) + '.'; };
    var specs = [];
    if (withR) specs.push({ label: t('r='), name: t('r'), kind: 'exact', x: P.r, key: P.rKey, undefOk: false, cands: [[P.m, LID + '-r-noroot', 'That is ' + t('r^2=x^2+y^2') + '. Take the square root.'], [Math.abs(x) + Math.abs(y), LID + '-r-noroot', t('r=\\sqrt{x^2+y^2}') + ': square, add, then take the root.']] });
    specs.push({ label: t('\\sin\\theta='), name: t('\\sin\\theta'), kind: 'exact', x: P.sin, key: P.sinKey, signHint: sgH('sin'), cands: [[P.cos, LID + '-swap-xy', t('\\sin\\theta=\\dfrac{y}{r}') + ' (the ' + t('y') + '-coordinate over ' + t('r') + ').'], [y / P.m, LID + '-r-noroot', 'Divide by ' + t('r=\\sqrt{x^2+y^2}') + ', not by ' + t('r^2') + '.'], ['undef', LID + '-said-undef', t('r') + ' is never ' + t('0') + ', so ' + t('\\sin\\theta=\\dfrac{y}{r}') + ' is always defined.']] });
    specs.push({ label: t('\\cos\\theta='), name: t('\\cos\\theta'), kind: 'exact', x: P.cos, key: P.cosKey, signHint: sgH('cos'), cands: [[P.sin, LID + '-swap-xy', t('\\cos\\theta=\\dfrac{x}{r}') + ' (the ' + t('x') + '-coordinate over ' + t('r') + ').'], [x / P.m, LID + '-r-noroot', 'Divide by ' + t('r=\\sqrt{x^2+y^2}') + ', not by ' + t('r^2') + '.'], ['undef', LID + '-said-undef', t('r') + ' is never ' + t('0') + ', so ' + t('\\cos\\theta=\\dfrac{x}{r}') + ' is always defined.']] });
    specs.push({ label: t('\\tan\\theta='), name: t('\\tan\\theta'), kind: 'exact', x: P.tan, key: P.tanKey, signHint: sgH('tan'), cands: P.tan === null ? [[0, LID + '-zero-undef', t('\\tan\\theta=\\dfrac{y}{x}') + ' and here ' + t('x=0') + ': you can’t divide by zero, so it is <b>undefined</b> (it is ' + t('\\dfrac{x}{y}') + ' that would be ' + t('0') + ').']] : [[y === 0 ? NaN : x / y, LID + '-tan-flip', t('\\tan\\theta=\\dfrac{y}{x}') + ', not ' + t('\\dfrac{x}{y}') + '.'], ['undef', LID + '-said-undef', 'Here ' + t('x\\ne 0') + ', so ' + t('\\tan\\theta=\\dfrac{y}{x}') + ' is defined.']] });
    return { P: P, specs: specs };
  }
  function ratioSol(x, y) { var P = ptRatios(x, y); return t('r=\\sqrt{(' + x + ')^2+(' + y + ')^2}=\\sqrt{' + P.m + '}' + (radTex(P.m) !== '\\sqrt{' + P.m + '}' ? '=' + radTex(P.m) : '')) + '<br>' + t('\\sin\\theta=\\dfrac{y}{r}=' + P.sinKey + ',\\quad \\cos\\theta=\\dfrac{x}{r}=' + P.cosKey + ',\\quad \\tan\\theta=\\dfrac{y}{x}=' + P.tanKey); }
  var TRIP = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41], [12, 35, 37], [6, 8, 10], [9, 12, 15], [12, 16, 20], [28, 45, 53], [11, 60, 61], [15, 8, 17], [10, 24, 26]];
  function sgQ(q) { return [q === 1 || q === 4 ? 1 : -1, q === 1 || q === 2 ? 1 : -1]; }
  function triplePt(r, qs, avoid) { return pickWhere(function () { var tr = r.pick(TRIP), sw = r.chance(0.5), q = r.pick(qs), s = sgQ(q); return [s[0] * (sw ? tr[1] : tr[0]), s[1] * (sw ? tr[0] : tr[1])]; }, function (p) { return !(avoid || []).some(function (a) { return a[0] === p[0] && a[1] === p[1]; }); }); }
  function rootPt(r, qs, avoid, mx) { return pickWhere(function () { var q = r.pick(qs), s = sgQ(q); return [s[0] * r.int(1, mx || 9), s[1] * r.int(1, mx || 9)]; }, function (p) { var m = p[0] * p[0] + p[1] * p[1]; return Math.abs(Math.sqrt(m) - Math.round(Math.sqrt(m))) > 1e-9 && gcd(p[0], p[1]) <= 2 && !(avoid || []).some(function (a) { return a[0] === p[0] && a[1] === p[1]; }); }); }

  /* ---- "given one ratio, find the other two" ---- */
  function condTex(f, sg) { return fname(f) + '\\theta' + (sg > 0 ? '>0' : '<0'); }
  var INTV = ['', '0^\\circ<\\theta<90^\\circ', '90^\\circ<\\theta<180^\\circ', '180^\\circ<\\theta<270^\\circ', '270^\\circ<\\theta<360^\\circ'];
  function otherTwo(r, o) {
    // o.kind: 'cond' (a sign condition on another ratio) or 'interval'; o.avoid(z) -> true to reject
    var z = pickWhere(function () {
      var f = o.f || r.pick(['sin', 'cos', 'tan']), q = r.pick(o.qs || [2, 3, 4]), s = sgQ(q), rr, p, leg, x, y;
      if (f === 'tan') { x = s[0] * r.int(1, 9); y = s[1] * r.int(1, 9); }
      else { rr = r.int(3, 9); p = r.int(1, rr - 1); leg = Math.sqrt(rr * rr - p * p); if (f === 'cos') { x = s[0] * p; y = s[1] * leg; } else { y = s[1] * p; x = s[0] * leg; } }
      var g = r.pick(['sin', 'cos', 'tan'].filter(function (k) { return k !== f; }));
      return { f: f, q: q, x: x, y: y, r: f === 'tan' ? Math.sqrt(x * x + y * y) : rr, p: p, g: g, kind: o.kind || r.pick(['cond', 'interval']) };
    }, function (z) { if (z.f === 'tan' && gcd(z.x, z.y) !== 1) return false; if (z.f !== 'tan' && gcd(z.p, z.r) !== 1) return false; if (z.kind === 'cond' && z.f === 'tan' && z.g === 'tan') return false; return !(o.avoid && o.avoid(z)); });
    var x = z.x, y = z.y, rr = z.r, m2 = rr * rr, keys = {}, vals = {};
    // exact keys: when the missing leg is a root, use its own surd form; r may be a root for tan
    var legM = z.f === 'cos' ? m2 - x * x : z.f === 'sin' ? m2 - y * y : null;
    var given, cond;
    if (z.f === 'cos') { given = fracTex(x, rr); var lp = sqParts(legM); keys.sin = qrTex(Math.sign(y), lp[0], lp[1], rr); keys.tan = qrTex(Math.sign(y) * Math.sign(x), lp[0], lp[1], Math.abs(x)); vals.sin = y / rr; vals.tan = y / x; }
    else if (z.f === 'sin') { given = fracTex(y, rr); var lp2 = sqParts(legM); keys.cos = qrTex(Math.sign(x), lp2[0], lp2[1], rr); keys.tan = (function () { var a = Math.abs(y), sg = Math.sign(y) * Math.sign(x); return lp2[1] === 1 ? fracTex(sg * a, lp2[0]) : qrTex(sg, a, lp2[1], lp2[0] * lp2[1]); })(); vals.cos = x / rr; vals.tan = y / x; }
    else { given = fracTex(y, x); keys.sin = overRootTex(y, x * x + y * y); keys.cos = overRootTex(x, x * x + y * y); vals.sin = y / rr; vals.cos = x / rr; }
    cond = z.kind === 'cond' && z.f !== 'tan' ? condTex(z.g, fv(z.g, ptAngle(x, y)) > 0 ? 1 : -1) : INTV[z.q];
    var others = ['sin', 'cos', 'tan'].filter(function (k) { return k !== z.f; });
    var sgH = function (f) { return 'Check the sign: ' + t('\\theta') + ' is in quadrant ' + QN[z.q] + ' (' + (z.kind === 'cond' && z.f !== 'tan' ? 'the sign of ' + t(fname(z.f) + '\\theta') + ' and ' + t(cond) : t(cond)) + '), where ' + castTxt(f, vals[f] > 0 ? 1 : -1).replace(/ in quadrants.*/, '') + '.'; };
    var specs = others.map(function (f) {
      var c = f === 'tan' ? [[x / y, LID + '-tan-flip', t('\\tan\\theta=\\dfrac{y}{x}') + '.']] : [[f === 'sin' ? x / rr : y / rr, LID + '-swap-xy', f === 'sin' ? t('\\sin\\theta=\\dfrac{y}{r}') + '.' : t('\\cos\\theta=\\dfrac{x}{r}') + '.']];
      return { label: t(fname(f) + '\\theta='), name: t(fname(f) + '\\theta'), kind: 'exact', x: vals[f], key: keys[f], signHint: sgH(f), undefOk: false, cands: c };
    });
    var giv = t(fname(z.f) + '\\theta=' + given) + ' and ' + t(cond);
    var legTxt = z.f === 'cos' ? t('y=' + (y < 0 ? '-' : '') + '\\sqrt{' + rr + '^2-' + Math.abs(x) + '^2}=' + (y < 0 ? '-' : '') + radTex(legM)) : z.f === 'sin' ? t('x=' + (x < 0 ? '-' : '') + '\\sqrt{' + rr + '^2-' + Math.abs(y) + '^2}=' + (x < 0 ? '-' : '') + radTex(legM)) : t('r=\\sqrt{' + x * x + '+' + y * y + '}=' + radTex(x * x + y * y));
    var sol = 'Quadrant ' + QN[z.q] + ' (CAST). Sketch: ' + (z.f === 'cos' ? t('x=' + x + ',\\ r=' + rr) : z.f === 'sin' ? t('y=' + y + ',\\ r=' + rr) : t('x=' + x + ',\\ y=' + y)) + '. ' + legTxt + '.<br>' + others.map(function (f) { return t(fname(f) + '\\theta=' + keys[f]); }).join(', \\ ');
    return { z: z, giv: giv, specs: specs, sol: sol };
  }

  /* ---- exact-value parts ---- */
  function exactCands(f, a) {
    var v = ev(f, a), out = [], co = coVal(f, a);
    if (co !== null && co !== undefined) { out.push([co, LID + (f === 'tan' ? '-tan-recip' : '-co-angle'), f === 'tan' ? 'Check the special triangle: ' + t('\\tan 30^\\circ=\\dfrac{1}{\\sqrt{3}}') + ' and ' + t('\\tan 60^\\circ=\\sqrt{3}') + '.' : 'Check the special triangle: ' + t('\\sin 30^\\circ=\\cos 60^\\circ=\\dfrac{1}{2}') + ' and ' + t('\\sin 60^\\circ=\\cos 30^\\circ=\\dfrac{\\sqrt{3}}{2}') + '. Which is it for ' + t('\\theta_R=' + D(refOf(a))) + '?']); out.push([-co, LID + '-co-angle', 'Two things: the reference angle is ' + t(D(refOf(a))) + ' (check its special-triangle value) and use CAST for the sign.']); }
    if (isQuadrantal(a)) {
      var s = ev('sin', a), c = ev('cos', a);
      if (f === 'tan' && v === null) out.push([0, LID + '-zero-undef', 'At ' + t(D(a)) + ' the point is ' + t('(0,' + nT(s) + ')') + ': ' + t('\\tan\\theta=\\dfrac{y}{x}=\\dfrac{' + nT(s) + '}{0}') + ' is <b>undefined</b>.']);
      if (f !== 'tan') { out.push([f === 'sin' ? c : s, LID + '-swap-xy', 'At ' + t(D(a)) + ' the point on the unit circle is ' + t('(' + nT(c) + ',' + nT(s) + ')') + ': ' + t('\\cos\\theta=x') + ' and ' + t('\\sin\\theta=y') + '.']); out.push(['undef', LID + '-zero-undef', 'At ' + t(D(a)) + ' the point is ' + t('(' + nT(c) + ',' + nT(s) + ')') + ' with ' + t('r=1') + ': ' + t(fname(f) + '\\theta=\\dfrac{' + (f === 'sin' ? 'y' : 'x') + '}{r}') + ' is defined (' + t('r\\ne 0') + ').']); }
      if (f === 'tan' && v === 0) out.push(['undef', LID + '-zero-undef', 'At ' + t(D(a)) + ' the point is ' + t('(' + nT(c) + ',0)') + ': ' + t('\\tan\\theta=\\dfrac{0}{' + nT(c) + '}=0') + ' (it is undefined only when ' + t('x=0') + ').']);
    }
    return out;
  }
  function exactSol(f, a) {
    var v = ev(f, a);
    if (isQuadrantal(a)) { var s = ev('sin', a), c = ev('cos', a); return 'On an axis: the point ' + t('(' + nT(c) + ',' + nT(s) + ')') + ' with ' + t('r=1') + '. ' + t(fa(f, a) + '=' + (f === 'sin' ? '\\dfrac{' + nT(s) + '}{1}' : f === 'cos' ? '\\dfrac{' + nT(c) + '}{1}' : '\\dfrac{' + nT(s) + '}{' + nT(c) + '}') + (v === null ? '' : '=' + valTex(v))) + (v === null ? ': <b>undefined</b> (' + t('x=0') + ').' : '.'); }
    var q = quadOf(a), r0 = refOf(a);
    return 'Quadrant ' + QN[q] + ', ' + t('\\theta_R=' + D(r0)) + ', ' + t(fname(f)) + ' is ' + (v > 0 ? 'positive' : 'negative') + ' there: ' + t(fa(f, a) + '=' + (v < 0 ? '-' : '') + fname(f) + ' ' + D(r0) + '=' + valTex(v)) + '.';
  }
  function exactP(prompt, f, a, o) {
    o = o || {};
    var v = ev(f, a), key = v === null ? '\\text{undefined}' : evTex(f, a), sg = v > 0 ? 1 : -1;
    var signHint = isQuadrantal(a) ? 'Check the sign: where is the point on the unit circle?' : 'Check the sign: ' + t(D(a)) + ' is in quadrant ' + QN[quadOf(a)] + ', where ' + castTxt(f, sg).replace(/ in quadrants.*/, '') + ' (CAST).';
    var p = B.math(prompt, exChk(v, { cands: exactCands(f, a), signHint: signHint }), key, o.sol || exactSol(f, a), o.hints || ['Find the quadrant and the reference angle, then the special-triangle value. CAST gives the sign.', 'Quadrantal angles: use the point on the unit circle, e.g. ' + t('(-1,0)') + ' at ' + t('180^\\circ') + '.'], o.text, { keys: 'u3l9exact', before: t(fa(f, a) + '=') });
    p.answer = t(fa(f, a) + '=' + (v === null ? '\\text{undefined}' : key));
    p.bad = [v === null ? '0' : v === 0 ? '\\text{undefined}' : '-(' + key + ')'];
    return p;
  }
  var SPEC = [120, 135, 150, 210, 225, 240, 300, 315, 330];
  /* an expression of exact values; terms [{f, a, sq}] */
  var SPA = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330];
  function tv(term) { var v = ev(term.f, term.a); return v === null ? null : term.sq ? v * v : v; }
  function tvTex(term) { var v = ev(term.f, term.a); return term.sq ? '\\left(' + valTex(v) + '\\right)^2' : par(valTex(v)); }
  function absVal(term) { var v = ev(term.f, term.a); return v === null ? null : term.sq ? v * v : Math.abs(v); }

  /* ======================= Assignment 9 ======================= */
  var HQ = ['A reference angle is the acute angle between the terminal arm and the <b>x</b>-axis.', 'QII: ' + t('180^\\circ-\\theta') + ', QIII: ' + t('\\theta-180^\\circ') + ', QIV: ' + t('360^\\circ-\\theta') + '.'];
  var QUESTIONS = [
    { num: '1', section: 'Angles, Points and Ratios', shared: function (r) {
      var avoid = [73, 164, 215, 342, 112, 196, 333, 87];
      return pickWhere(function () { var refs = r.shuffle(range(4, 86).filter(function (x) { return x % 10 !== 0 && x !== 45; })).slice(0, 4), qs = r.shuffle([1, 2, 3, 4]); return { angs: qs.map(function (q, i) { return fromRef(q, refs[i]); }) }; },
        function (z) { return z.angs.every(function (a) { return avoid.indexOf(a) < 0; }); });
    }, parts: [
      { id: '1ai', sub: 'a i', level: 'BEG', outcome: 'T1', make: function (r, z) {
        var rows = z.angs.map(function (a, i) { return { id: 'r' + i, html: t('\\theta=' + D(a)), label: a + '°' }; }), cols = [1, 2, 3, 4].map(function (q) { return { id: 'q' + q, html: QN[q], label: QN[q] }; }), want = {};
        z.angs.forEach(function (a, i) { want['r' + i] = 'q' + quadOf(a); });
        return B.grid('In which quadrant does each angle terminate?', rows, cols, want, { rowHead: 'Angle', why: function (row) { var a = z.angs[Number(row.slice(1))]; return { code: LID + '-quad', hint: 'Check ' + t(D(a)) + ': quadrant I is ' + t('0^\\circ') + '–' + t('90^\\circ') + ', II is ' + t('90^\\circ') + '–' + t('180^\\circ') + ', III is ' + t('180^\\circ') + '–' + t('270^\\circ') + ', IV is ' + t('270^\\circ') + '–' + t('360^\\circ') + '.' }; } },
          z.angs.map(function (a) { return t(D(a)) + ': quadrant ' + QN[quadOf(a)]; }).join('; ') + '.', ['Quadrant I is ' + t('0^\\circ') + ' to ' + t('90^\\circ') + '; each quadrant after it adds ' + t('90^\\circ') + '.'], 'quadrant of an angle');
      } },
      { id: '1aii', sub: 'a ii', level: 'BEG', outcome: 'T1', make: function (r, z) {
        var fields = z.angs.map(function (a) { return { label: t('\\theta=' + D(a)) + ': ' + t('\\theta_R='), name: t('\\theta_R') + ' of ' + t(D(a)), after: '°' }; });
        var checks = z.angs.map(function (a) {
          var ref = refOf(a), c = [];
          [Math.abs(90 - a), Math.abs(270 - a)].forEach(function (v) { if (v !== ref && v < 90) c.push([v, LID + '-ref-y', 'The reference angle is measured to the <b>x</b>-axis, not the y-axis.']); });
          [180 - a, a - 180, 360 - a].forEach(function (v) { if (v !== ref) c.push([Math.abs(v), LID + '-ref-rule', t(D(a)) + ' is in quadrant ' + QN[quadOf(a)] + ': ' + t(refRule(quadOf(a))) + '. (A reference angle is always acute.)']); });
          if (a !== ref) c.push([a, LID + '-ref-rule', 'The reference angle is acute — the angle between the terminal arm and the x-axis.']);
          return K.number(ref, cdiag(c));
        });
        var p = B.fields('Determine the reference angle ' + t('\\theta_R') + ' of each angle.', fields, checks, z.angs.map(function (a) { return String(refOf(a)); }), z.angs.map(function (a) { return t(D(a)) + ': ' + t('\\theta_R=' + D(refOf(a))); }).join('<br>'),
          z.angs.map(function (a) { var q = quadOf(a); return t(D(a)) + ' (quadrant ' + QN[q] + '): ' + t('\\theta_R=' + (q === 1 ? D(a) : q === 2 ? '180^\\circ-' + D(a) : q === 3 ? D(a) + '-180^\\circ' : '360^\\circ-' + D(a)) + (q === 1 ? '' : '=' + D(refOf(a)))); }).join('<br>'), HQ, 'reference angles (table)');
        p.bad = [z.angs.map(function (a) { return String(Math.abs(90 - a) % 90 || 1); })];
        return p;
      } },
      { id: '1b', sub: 'b', level: 'BEG', outcome: 'T1', make: function (r) {
        var k = pickWhere(function () { return r.int(11, 79); }, function (k) { return [19, 52, 45, 30, 60].indexOf(k) < 0; }), vals = [k, 180 - k, 180 + k, 360 - k];
        return angP('Determine all angles from ' + t('0^\\circ') + ' to ' + t('360^\\circ') + ' that have a reference angle of ' + t(D(k)) + '.', vals, 0, { ref: null,
          xc: [[90 + k, LID + '-ref-y', 'Measure ' + t('\\theta_R') + ' from the <b>x</b>-axis: the angles are ' + t('\\theta_R') + ' away from ' + t('0^\\circ') + ', ' + t('180^\\circ') + ' or ' + t('360^\\circ') + '.'], [90 - k, LID + '-ref-y', 'Measure ' + t('\\theta_R') + ' from the <b>x</b>-axis.'], [270 - k, LID + '-ref-y', 'Measure ' + t('\\theta_R') + ' from the <b>x</b>-axis.'], [270 + k, LID + '-ref-y', 'Measure ' + t('\\theta_R') + ' from the <b>x</b>-axis.']],
          missHint: 'There is one angle with this reference angle in <b>each</b> quadrant — four in all.',
          sol: 'One in each quadrant: QI ' + t(D(k)) + ', QII ' + t('180^\\circ-' + D(k) + '=' + D(180 - k)) + ', QIII ' + t('180^\\circ+' + D(k) + '=' + D(180 + k)) + ', QIV ' + t('360^\\circ-' + D(k) + '=' + D(360 - k)) + '.', hints: ['Each quadrant has one angle with this reference angle.'], text: 'all angles with a reference angle' });
      } },
      { id: '1c', sub: 'c', level: 'BEG', outcome: 'T1', make: function (r) {
        var z = pickWhere(function () { return { q: r.pick([2, 3, 4]), k: r.int(12, 78) }; }, function (z) { return !(z.q === 3 && z.k === 41) && z.k !== 45; }), th = fromRef(z.q, z.k);
        var c = [2, 3, 4].filter(function (q) { return q !== z.q; }).map(function (q) { return [fromRef(q, z.k), LID + '-quad', 'That angle is in quadrant ' + QN[q] + '. In quadrant ' + QN[z.q] + ': ' + t('\\theta=' + (z.q === 2 ? '180^\\circ-\\theta_R' : z.q === 3 ? '180^\\circ+\\theta_R' : '360^\\circ-\\theta_R')) + '.']; });
        c.push([z.q === 3 ? 270 - z.k : z.q === 2 ? 90 + z.k : 270 + z.k, LID + '-ref-y', 'The reference angle is measured from the <b>x</b>-axis, not the y-axis.']);
        return intP('Angle ' + t('\\theta') + ' terminates in quadrant ' + QN[z.q] + ' and ' + t('\\theta_R=' + D(z.k)) + '. Determine ' + t('\\theta') + '.', th, { unit: '°', cands: c, sol: 'Quadrant ' + QN[z.q] + ': ' + t('\\theta=' + placeTex(z.q, z.k)) + '.', hints: HQ, text: 'angle from quadrant and reference angle' });
      } }] },
    { num: '2', shared: function (r) {
      var a = triplePt(r, [2, 3, 4], [[-8, -15], [-20, 21], [3, 7]]), qa = quadOf(ptAngle(a[0], a[1]));
      var b = rootPt(r, [2, 3, 4].filter(function (q) { return q !== qa; }), [[4, -6], [-1, -3], [3, 7], [-2, 5]]);
      var c = pickWhere(function () { var k = r.int(2, 9), d = r.int(0, 3); return [[k, 0], [0, k], [-k, 0], [0, -k]][d]; }, function (p) { return !(p[0] === -5 && p[1] === 0) && !(p[0] === 0 && p[1] === -4) && !(p[1] === 0 && p[0] > 0); });
      return { a: a, b: b, c: c };
    }, stem: function () { return 'Each point is on the terminal arm of an angle ' + t('\\theta') + ' in standard position, ' + t('0^\\circ\\le\\theta<360^\\circ') + '. Determine ' + t('r') + ', the exact values of the three primary ratios, and ' + t('\\theta') + ' to the nearest tenth of a degree.'; },
    parts: ['a', 'b', 'c'].reduce(function (acc, L, i) {
      var lv = [['PRG', 'PRG'], ['ADV', 'PRG'], ['PRG', 'EMG']][i];
      acc.push({ id: '2' + L + 'i', sub: L + ' i', level: lv[0], outcome: 'T2', make: function (r, z) {
        var p = z[L], R = ratioSpecs(p[0], p[1], true);
        var q = fP(t('P(' + p[0] + ',' + p[1] + ')') + ': determine ' + t('r') + ' and the exact values of ' + t('\\sin\\theta') + ', ' + t('\\cos\\theta') + ' and ' + t('\\tan\\theta') + (i === 2 ? ' (press <b>undefined</b> if a ratio is undefined).' : '.'), R.specs,
          { sol: armFig(p[0], p[1]) + ratioSol(p[0], p[1]) + (i === 2 ? '<br>' + t('\\tan\\theta') + ' is undefined because ' + t('x=0') + '.' : ''), hints: [t('r=\\sqrt{x^2+y^2}') + ', ' + t('\\sin\\theta=\\dfrac{y}{r}') + ', ' + t('\\cos\\theta=\\dfrac{x}{r}') + ', ' + t('\\tan\\theta=\\dfrac{y}{x}') + '.', 'Keep the signs of ' + t('x') + ' and ' + t('y') + '; ' + t('r') + ' is always positive.'], text: 'r and exact ratios from a point', v: { k: 'ratios', x: p[0], y: p[1] } });
        return q;
      } });
      acc.push({ id: '2' + L + 'ii', sub: L + ' ii', level: lv[1], outcome: 'T2', make: function (r, z) {
        var p = z[L], th = ptAngle(p[0], p[1]);
        if (i === 2) return intP(t('P(' + p[0] + ',' + p[1] + ')') + ': determine ' + t('\\theta') + '.', th, { unit: '°', cands: [[(th + 180) % 360, LID + '-place', 'Locate ' + t('P(' + p[0] + ',' + p[1] + ')') + ': it is on the ' + (p[0] === 0 ? (p[1] > 0 ? 'positive' : 'negative') + ' y' : (p[0] > 0 ? 'positive' : 'negative') + ' x') + '-axis.'], [th === 90 ? 270 : th === 270 ? 90 : 0, LID + '-place', 'Locate the point: it lies on an axis (a quadrantal angle).']], sol: 'The point is on the ' + (p[0] === 0 ? (p[1] > 0 ? 'positive' : 'negative') + ' ' + t('y') : (p[0] > 0 ? 'positive' : 'negative') + ' ' + t('x')) + '-axis: ' + t('\\theta=' + D(th)) + ' (quadrantal).', hints: ['A point on an axis gives a quadrantal angle: ' + t('0^\\circ') + ', ' + t('90^\\circ') + ', ' + t('180^\\circ') + ' or ' + t('270^\\circ') + '.'], text: 'quadrantal angle from a point' });
        return deg(t('P(' + p[0] + ',' + p[1] + ')') + ': determine ' + t('\\theta') + ' to the nearest tenth of a degree.', th, 1, { alts: ptAlts(p[0], p[1]), sol: ptSol(p[0], p[1], 1), hints: ['Find the quadrant, then ' + t('\\theta_R=\\tan^{-1}\\left|\\dfrac{y}{x}\\right|') + '.', HQ[1]], text: 'angle from a point', v: { k: 'ptang', x: p[0], y: p[1], dp: 1 } });
      } });
      return acc;
    }, []) },
    { num: '3', stem: function () { return 'Determine the exact values of the other two primary ratios.'; }, parts: [
      { id: '3a', level: 'PRG', outcome: 'T2', make: function (r) {
        var o = otherTwo(r, { kind: 'cond', f: r.pick(['cos', 'sin']), avoid: function (z) { return (z.f === 'cos' && z.x === 3 && z.r === 8 && z.q === 4) || (z.f === 'sin' && z.y === -2 && z.r === 5 && z.q === 3); } });
        return fP('Given ' + o.giv + '.', o.specs, { sol: o.sol, hints: ['Use the signs (CAST) to find the quadrant, then sketch the triangle: the given ratio gives two sides.', 'Find the third side with ' + t('x^2+y^2=r^2') + ' — its sign comes from the quadrant.'], text: 'other two ratios from one ratio and a sign', v: { k: 'other', z: o.z } });
      } },
      { id: '3b', level: 'PRG', outcome: 'T2', make: function (r) {
        var o = otherTwo(r, { kind: 'interval', f: 'tan', avoid: function (z) { return z.x === -7 && z.y === 4; } });
        return fP('Given ' + o.giv + '.', o.specs, { sol: o.sol, hints: ['The interval tells you the quadrant, and so the signs of ' + t('x') + ' and ' + t('y') + '.', t('r=\\sqrt{x^2+y^2}') + '; then ' + t('\\sin\\theta=\\dfrac{y}{r}') + ' and ' + t('\\cos\\theta=\\dfrac{x}{r}') + '.'], text: 'sin and cos from tan and an interval', v: { k: 'other', z: o.z } });
      } }] },
    { num: '4', section: 'Exact Values and Solving Equations', stem: function () { return '<b>No calculator.</b> Determine the exact value.'; }, parts: [
      ['a', 'cos', function (a) { return [30, 60].indexOf(refOf(a)) >= 0 && [240, 210, 330].indexOf(a) < 0; }],
      ['b', 'tan', function (a) { return refOf(a) === 45 && a !== 315; }],
      ['c', 'sin', function (a) { return [30, 60].indexOf(refOf(a)) >= 0 && [120, 135, 225].indexOf(a) < 0; }],
      ['d', 'cos', function (a) { return [330, 210, 240].indexOf(a) < 0 && quadOf(a) >= 3; }],
      ['e', 'tan', function (a) { return [30, 60].indexOf(refOf(a)) >= 0 && [150, 300].indexOf(a) < 0; }],
      ['f', 'sin', function (a) { return quadOf(a) >= 3 && a !== 225; }]].map(function (d) {
        return { id: '4' + d[0], level: 'EMG', outcome: 'T2', make: function (r) { var a = pickWhere(function () { return r.pick(SPEC); }, d[2]); return exactP(t(fa(d[1], a)), d[1], a, { text: 'exact value' }); } };
      }).concat([
      { id: '4g', level: 'EMG', outcome: 'T2', make: function (r) { var z = pickWhere(function () { return { f: r.pick(['sin', 'cos']), a: r.pick([0, 90, 180, 270]) }; }, function (z) { return !(z.f === 'cos' && (z.a === 180 || z.a === 270)); }); return exactP(t(fa(z.f, z.a)), z.f, z.a, { text: 'exact value: quadrantal' }); } },
      { id: '4h', level: 'EMG', outcome: 'T2', make: function (r) { var a = r.pick([270, 270, 180]); return exactP(t(fa('tan', a)), 'tan', a, { text: 'exact value: tan of a quadrantal angle' }); } },
      { id: '4i', level: 'PRG', outcome: 'T2', make: function (r) {
        var z = pickWhere(function () { return { t1: { f: r.pick(['sin', 'cos', 'tan']), a: r.pick(SPA) }, t2: { f: r.pick(['sin', 'cos', 'tan']), a: r.pick(SPA) }, t3: { f: r.pick(['sin', 'cos', 'tan']), a: r.pick(SPA) }, op: r.pick(['+', '-']) }; }, function (z) {
          var v1 = tv(z.t1), v2 = tv(z.t2), v3 = tv(z.t3); if (v1 === null || v2 === null || v3 === null) return false;
          if (isQuadrantal(z.t1.a) || isQuadrantal(z.t2.a) || z.t1.a === z.t2.a) return false; if (v1 * v2 === 0 || v3 === 0) return false;
          var tot = v1 * v2 + (z.op === '+' ? v3 : -v3); if (!isRat(v1 * v2) || !isRat(tot) || Math.abs(tot) < 1e-9) return false;
          if (!(quadOf(z.t1.a) > 1 || quadOf(z.t2.a) > 1 || quadOf(z.t3.a) > 1)) return false;
          return !(z.t1.a === 30 && z.t2.a === 60 && z.t3.a === 135);
        });
        return comboP(z, 'prod');
      } },
      { id: '4j', level: 'PRG', outcome: 'T2', make: function (r) {
        var z = pickWhere(function () { return { t1: { f: r.pick(['sin', 'cos', 'cos', 'sin', 'tan']), a: r.pick(SPEC), sq: true }, t2: { f: r.pick(['sin', 'cos', 'tan']), a: r.pick(SPEC), sq: true }, op: r.pick(['-', '-', '+']) }; }, function (z) {
          var v1 = tv(z.t1), v2 = tv(z.t2); if (v1 === null || v2 === null) return false; var tot = z.op === '+' ? v1 + v2 : v1 - v2; return Math.abs(tot) > 1e-9 && z.t1.a !== z.t2.a && !(z.t1.a === 315 && z.t2.a === 240);
        });
        return comboP(z, 'sq');
      } },
      { id: '4k', level: 'ADV', outcome: 'T2', make: function (r) {
        var z = pickWhere(function () { return { t1: { f: r.pick(['sin', 'cos']), a: r.pick(SPA) }, t2: { f: r.pick(['sin', 'cos', 'tan']), a: r.pick(SPA) }, t3: { f: r.pick(['tan', 'tan', 'sin', 'cos']), a: r.pick(SPA) } }; }, function (z) {
          var v1 = tv(z.t1), v2 = tv(z.t2), v3 = tv(z.t3); if (v1 === null || v2 === null || v3 === null || Math.abs(v3) < 1e-9) return false;
          if (!isRat(v1) || !isRat(v2) || !isRat(v3) || Math.abs(v1 + v2) < 1e-9 || v1 === 0 || v2 === 0) return false; if (!isRat((v1 + v2) / v3)) return false;
          if (z.t1.a === z.t2.a) return false; if (!isQuadrantal(z.t1.a) && !isQuadrantal(z.t2.a) && !isQuadrantal(z.t3.a)) return false;
          return !(z.t1.a === 270 && z.t2.a === 120 && z.t3.a === 225);
        });
        return comboP(z, 'quot');
      } }]) },
    { num: '5', stem: function () { return '<b>No calculator.</b> Solve exactly for ' + t('0^\\circ\\le\\theta<360^\\circ') + '.'; }, parts: [
      { id: '5a', level: 'EMG', outcome: 'T2', make: function (r) {
        var z = pickWhere(function () { var f = r.pick(['sin', 'cos', 'tan']), v = f === 'tan' ? r.pick([['\\frac{1}{\\sqrt{3}}', Math.sqrt(3) / 3], ['1', 1], ['\\sqrt{3}', Math.sqrt(3)], ['\\frac{\\sqrt{3}}{3}', Math.sqrt(3) / 3]]) : r.pick([['\\frac{1}{2}', 0.5], ['\\frac{\\sqrt{2}}{2}', Math.SQRT2 / 2], ['\\frac{\\sqrt{3}}{2}', Math.sqrt(3) / 2], ['\\frac{1}{\\sqrt{2}}', Math.SQRT2 / 2]]); return { f: f, tex: v[0], a: v[1] }; },
          function (z) { return !(z.f === 'sin' && Math.abs(z.a - Math.sqrt(3) / 2) < 1e-9); });
        return exSolveP(fname(z.f) + '\\theta=' + z.tex, z.f, z.a, 'exact solve: special value');
      } },
      { id: '5b', level: 'PRG', outcome: 'T2', make: function (r) {
        var z = pickWhere(function () { var f = r.pick(['sin', 'cos']), form0 = r.pick(LIN_SC), neg = r.chance(0.75); return { f: f, k: form0[0], m: form0[1], v: form0[2] * (neg ? -1 : 1), neg: neg }; },
          function (z) { return !(z.f === 'cos' && z.k === '2' && z.m === '1' && z.neg) && !(z.f === 'sin' && z.k === '2' && z.m === '\\sqrt{2}' && z.neg); });
        return exSolveP(linTex(z.k, z.f, z.m, z.neg), z.f, z.v, 'exact solve: linear sin/cos', z);
      } },
      { id: '5c', level: 'PRG', outcome: 'T2', make: function (r) {
        var z = pickWhere(function () { var form0 = r.pick(LIN_T), neg = r.chance(0.7); return { f: 'tan', k: form0[0], m: form0[1], v: form0[2] * (neg ? -1 : 1), neg: neg }; },
          function (z) { return !(z.k === '\\sqrt{3}' && z.m === '1' && z.neg) && !(z.k === '' && z.m === '1' && z.neg); });
        return exSolveP(linTex(z.k, 'tan', z.m, z.neg), 'tan', z.v, 'exact solve: linear tan', z);
      } },
      { id: '5d', level: 'EMG', outcome: 'T2', make: function (r) {
        var z = r.pick([['sin', 0], ['sin', 1], ['sin', -1], ['cos', 1], ['tan', 0], ['sin', 0]]);
        return exSolveP(fname(z[0]) + '\\theta=' + z[1], z[0], z[1], 'exact solve: quadrantal');
      } }] },
    { num: '6', stem: function () { return 'Solve for ' + t('0^\\circ\\le\\theta<360^\\circ') + ', to the nearest tenth of a degree.'; }, parts: [
      { id: '6a', level: 'EMG', outcome: 'T2', make: function (r) {
        var z = pickWhere(function () { return { f: r.pick(['cos', 'sin']), a: r.chance(0.5) ? r.int(11, 95) / 100 : r.int(105, 985) / 1000 }; }, function (z) { return !(z.f === 'cos' && z.a === 0.215) && !(z.f === 'sin' && z.a === 0.38) && Math.abs(z.a - 0.5) > 0.02; });
        return calcSolveP(fname(z.f) + '\\theta=' + nT(z.a), z.f, z.a, 'solve: positive value');
      } },
      { id: '6b', level: 'PRG', outcome: 'T2', make: function (r) {
        var z = pickWhere(function () { return { f: r.pick(['sin', 'cos']), a: -r.int(11, 95) / 100 }; }, function (z) { return !(z.f === 'sin' && z.a === -0.64) && !(z.f === 'cos' && z.a === -0.6) && z.a !== -0.5; });
        return calcSolveP(fname(z.f) + '\\theta=' + nT(z.a), z.f, z.a, 'solve: negative value');
      } },
      { id: '6c', level: 'PRG', outcome: 'T2', make: function (r) {
        var z = pickWhere(function () { return { k: r.int(2, 9), m: r.int(1, 12), neg: r.chance(0.5) }; }, function (z) { return z.m !== z.k && gcd(z.m, z.k) === 1 && !(z.k === 5 && z.m === 8) && !(z.k === 2 && z.m === 5); });
        var a = (z.neg ? -1 : 1) * z.m / z.k;
        return calcSolveP(z.k + '\\tan\\theta' + (z.neg ? '+' : '-') + z.m + '=0', 'tan', a, 'solve: linear tan', '\\tan\\theta=' + (z.neg ? '-' : '') + '\\frac{' + z.m + '}{' + z.k + '}' + (rd(z.m / z.k, 4) === z.m / z.k ? '=' + nT(a) : '\\approx ' + fx(a, 4)));
      } },
      { id: '6d', level: 'PRG', outcome: 'T2', make: function (r) {
        var z = pickWhere(function () { var k = r.int(2, 8); return { f: r.pick(['sin', 'cos']), k: k, m: (r.chance(0.5) ? -1 : 1) * r.int(k + 1, k + 6) }; }, function (z) { return !(z.f === 'sin' && z.k === 4 && z.m === 5); });
        var a = z.m / z.k;
        return angP(t(z.k + fname(z.f) + '\\theta=' + z.m), [], 1, { f: z.f, a: a, sol: t(fname(z.f) + '\\theta=\\dfrac{' + z.m + '}{' + z.k + '}=' + (isRat(a) && rd(a, 4) === a ? nT(a) : '\\approx ' + fx(a, 4))) + ', but ' + t('-1\\le ' + fname(z.f) + '\\theta\\le 1') + ': <b>no solution</b>.', hints: ['Isolate ' + t(fname(z.f) + '\\theta') + ' first. What values can ' + t(fname(z.f) + '\\theta') + ' have?'], text: 'solve: no solution' });
      } }] },
    { num: '7', stem: function () { return 'Each student made an error. Choose the explanation and the correct answer.'; }, parts: [
      { id: '7a', level: 'EMG', outcome: 'T1', make: function (r) {
        var k = pickWhere(function () { return r.int(15, 75); }, function (k) { return k !== 50 && k !== 45; }), th = 180 + k, nm = r.pick(['Jordan', 'Avery', 'Sam', 'Priya', 'Noah', 'Lena']);
        return mcP(r, nm + ' wrote: “The reference angle of ' + t(D(th)) + ' is ' + t(D(360 - th)) + '.” Which is right?', [
          { html: t(D(th)) + ' is in quadrant III, so ' + t('\\theta_R=\\theta-180^\\circ=' + D(k)) + '. ' + nm + ' used the quadrant IV rule ' + t('360^\\circ-\\theta') + ' (and ' + t(D(360 - th)) + ' isn’t acute).', right: true },
          { html: nm + ' is right: ' + t('\\theta_R=360^\\circ-\\theta') + ' for every angle.', why: 'That rule is for quadrant IV only — and a reference angle must be acute.' },
          { html: 'The reference angle is measured to the y-axis: ' + t('270^\\circ-' + D(th) + '=' + D(270 - th)) + '.', why: 'Reference angles are measured to the <b>x</b>-axis.' },
          { html: 'The reference angle is ' + t('\\theta-90^\\circ=' + D(th - 90)) + ', the angle past the y-axis.', why: 'A reference angle is acute and measured to the <b>x</b>-axis.' }],
          t(D(th)) + ' is between ' + t('180^\\circ') + ' and ' + t('270^\\circ') + ' (QIII). The reference angle is the acute angle to the x-axis: ' + t('\\theta_R=' + D(th) + '-180^\\circ=' + D(k)) + '.', HQ, 'error: reference angle rule');
      } },
      { id: '7b', level: 'PRG', outcome: 'T2', make: function (r) {
        var a = -pickWhere(function () { return r.int(1, 9) / 10; }, function (v) { return v !== 0.3 && v !== 0.5; }), A = acs(a), Ar = rd(A, 1), R0 = rd(acs(-a), 1), nm = r.pick(['Mei', 'Jonas', 'Ines', 'Kai', 'Ruth', 'Omar']);
        return mcP(r, nm + ' solved ' + t('\\cos\\theta=' + nT(a)) + ' for ' + t('0^\\circ\\le\\theta<360^\\circ') + '. ' + nm + ' entered ' + t('\\cos^{-1}(' + nT(a) + ')\\approx ' + Dx(A, 1)) + ', then added ' + t('180^\\circ') + ' and wrote ' + t('\\theta=' + Dx(A, 1) + ',\\ ' + Dx(A + 180, 1)) + '. Which is right?', [
          { html: t(Dx(A + 180, 1)) + ' is in quadrant IV, where cosine is positive. Cosine is negative in QII and QIII: ' + t('\\theta=' + Dx(A, 1) + ',\\ ' + Dx(360 - Ar, 1)) + '.', right: true },
          { html: nm + ' is right: adding ' + t('180^\\circ') + ' always gives the second solution.', why: 'Adding ' + t('180^\\circ') + ' works only for tangent. Where is ' + t(Dx(A + 180, 1)) + ', and what is the sign of cosine there?' },
          { html: 'Both angles are wrong: ' + t('\\theta=' + Dx(R0, 1) + ',\\ ' + Dx(360 - R0, 1)) + '.', why: 'Those solve ' + t('\\cos\\theta=' + nT(-a)) + '. Cosine is <b>negative</b> here.' },
          { html: 'The second solution is ' + t('180^\\circ-' + Dx(A, 1) + '=' + Dx(180 - Ar, 1)) + '.', why: 'That angle is in quadrant I, where cosine is positive.' }],
          t('\\theta_R=\\cos^{-1}(' + nT(-a) + ')\\approx ' + Dx(R0, 1)) + '; cosine is negative in QII and QIII: ' + t('180^\\circ-' + Dx(R0, 1) + '=' + Dx(180 - R0, 1)) + ' and ' + t('180^\\circ+' + Dx(R0, 1) + '=' + Dx(180 + R0, 1)) + '. (Adding ' + t('180^\\circ') + ' gives the second angle only for tangent.)', ['Where is ' + t(Dx(A + 180, 1)) + '? What is the sign of cosine there?'], 'error: added 180° for cosine');
      } }] },
    { num: '8', section: 'The Sine Law, the Cosine Law and the Ambiguous Case', stem: function () { return 'Sides to the nearest tenth, angles to the nearest degree.'; }, parts: [
      { id: '8a', level: 'PRG', outcome: 'T3', make: function (r) {
        var nm = r.pick([['D', 'E', 'F'], ['P', 'Q', 'R'], ['K', 'L', 'M'], ['G', 'H', 'J'], ['S', 'T', 'U']]);
        var z = pickWhere(function () { return { A: r.int(40, 75), B: r.int(45, 80), e: r.int(100, 250) / 10 }; }, function (z) { var C = 180 - z.A - z.B; return C >= 35 && C <= 85 && Math.abs(z.A - z.B) >= 4 && Math.abs(C - z.A) >= 4 && Math.abs(C - z.B) >= 4 && !(z.A === 54 && z.B === 67) && !(z.A === 48 && z.B === 71); });
        var C = 180 - z.A - z.B, d = z.e * sn(z.A) / sn(z.B), f = z.e * sn(C) / sn(z.B), l = nm.map(low);
        var figS = triFig(nm, z.A, z.e, f, { a: l[0], b: fs(z.e, 1) + ' cm', c: l[2], A: z.A + '°', B: z.B + '°' });
        return fP('In ' + t('\\triangle ' + nm.join('')) + ', ' + t('\\angle ' + nm[0] + '=' + D(z.A)) + ', ' + t('\\angle ' + nm[1] + '=' + D(z.B)) + ' and ' + t(l[1] + '=' + fx(z.e, 1)) + ' cm. Determine ' + t(l[0]) + ' and ' + t(l[2]) + '.' + figS, [
          { label: t(l[0] + '='), name: t(l[0]), kind: 'near', x: d, dp: 1, unit: 'cm', alts: slAlts(z.e, 0, 0, z.A, z.B).concat([{ v: z.e * sn(z.B) / sn(z.A), code: LID + '-sl-flip', hint: t('\\dfrac{' + l[0] + '}{\\sin ' + nm[0] + '}=\\dfrac{' + l[1] + '}{\\sin ' + nm[1] + '}') + ': multiply by ' + t('\\sin ' + nm[0]) + '.' }]) },
          { label: t(l[2] + '='), name: t(l[2]), kind: 'near', x: f, dp: 1, unit: 'cm', alts: [{ v: z.e * sn(z.B) / sn(C), code: LID + '-sl-flip', hint: t('\\dfrac{' + l[2] + '}{\\sin ' + nm[2] + '}=\\dfrac{' + l[1] + '}{\\sin ' + nm[1] + '}') + '.' }, { v: z.e * Math.sin(C) / Math.sin(z.B), code: LID + '-radian', hint: 'Your calculator is in <b>radian</b> mode.' }, { v: z.e * sn(z.A) / sn(z.B), code: LID + '-forgot-angle', hint: 'Find ' + t('\\angle ' + nm[2]) + ' first: ' + t('180^\\circ-' + D(z.A) + '-' + D(z.B)) + '.' }] }],
          { sol: t('\\angle ' + nm[2] + '=180^\\circ-' + D(z.A) + '-' + D(z.B) + '=' + D(C)) + '. A full pair (' + t(l[1]) + ', ' + t('\\angle ' + nm[1]) + ') is known: sine law.<br>' + t(l[0] + '=\\dfrac{' + fx(z.e, 1) + '\\sin ' + D(z.A) + '}{\\sin ' + D(z.B) + '}\\approx ' + fx(d, 1)) + ' cm, ' + t(l[2] + '=\\dfrac{' + fx(z.e, 1) + '\\sin ' + D(C) + '}{\\sin ' + D(z.B) + '}\\approx ' + fx(f, 1)) + ' cm',
            swap: true, hints: ['Find the third angle first.', 'Sine law: ' + t('\\dfrac{a}{\\sin A}=\\dfrac{b}{\\sin B}') + '. Use the known pair (' + t(l[1]) + ' with ' + t('\\angle ' + nm[1]) + ').'], text: 'sine law: two sides (AAS)', v: { k: 'aas', A: z.A, B: z.B, e: z.e } });
      } },
      { id: '8b', level: 'PRG', outcome: 'T3', make: function (r) {
        var nm = r.pick([['X', 'Y', 'Z'], ['A', 'B', 'C'], ['R', 'S', 'T'], ['M', 'N', 'P']]);
        var z = pickWhere(function () { var x = r.int(90, 150) / 10; return { X: r.int(100, 130), x: x, z: r.int(Math.round(x * 5), Math.round(x * 9)) / 10 }; }, function (z) { var Z = asn(z.z * sn(z.X) / z.x), Y = 180 - z.X - Z; return Y >= 8 && Math.abs(Z - Math.round(Z) - 0.5) > 0.03 && !(z.X === 112 && z.x === 11.4); });
        var Z = asn(z.z * sn(z.X) / z.x), Y = 180 - z.X - Z, y = z.x * sn(Y) / sn(z.X), l = nm.map(low);
        var figS = triFig([nm[0], nm[1], nm[2]], z.X, y, z.z, { a: fs(z.x, 1) + ' m', c: fs(z.z, 1) + ' m', A: z.X + '°' });
        return fP('In ' + t('\\triangle ' + nm.join('')) + ', ' + t('\\angle ' + nm[0] + '=' + D(z.X)) + ', ' + t(l[0] + '=' + fx(z.x, 1)) + ' m and ' + t(l[2] + '=' + fx(z.z, 1)) + ' m. Determine ' + t('\\angle ' + nm[2]) + ' and ' + t('\\angle ' + nm[1]) + '.' + figS, [
          { label: t('\\angle ' + nm[2] + '='), name: t('\\angle ' + nm[2]), kind: 'near', x: Z, dp: 0, unit: '°', alts: [{ v: 180 - Z, code: LID + '-amb-obtuse', hint: t('\\angle ' + nm[0]) + ' is already obtuse, so ' + t('\\angle ' + nm[2]) + ' must be acute (a triangle has only one obtuse angle).' }, { v: asn(z.z * Math.sin(z.X) / z.x) / 1, code: LID + '-radian', hint: 'Your calculator is in <b>radian</b> mode.' }] },
          { label: t('\\angle ' + nm[1] + '='), name: t('\\angle ' + nm[1]), kind: 'near', x: Y, dp: 0, unit: '°', acc: [180 - z.X - rd(Z, 0)], alts: [{ v: 180 - Z, code: LID + '-third-angle', hint: t('\\angle ' + nm[1] + '=180^\\circ-\\angle ' + nm[0] + '-\\angle ' + nm[2]) + '.' }] }],
          { sol: t('\\sin ' + nm[2] + '=\\dfrac{' + fx(z.z, 1) + '\\sin ' + D(z.X) + '}{' + fx(z.x, 1) + '}\\approx ' + fx(z.z * sn(z.X) / z.x, 4) + '\\Rightarrow \\angle ' + nm[2] + '\\approx ' + Dx(Z, 0)) + ' (one triangle: ' + t('\\angle ' + nm[0]) + ' is obtuse, so ' + t('\\angle ' + nm[2]) + ' is acute).<br>' + t('\\angle ' + nm[1] + '\\approx 180^\\circ-' + D(z.X) + '-' + Dx(Z, 0) + '=' + Dx(180 - z.X - rd(Z, 0), 0)),
            hints: ['A full pair (' + t(l[0]) + ', ' + t('\\angle ' + nm[0]) + ') is known: use the sine law for ' + t('\\sin ' + nm[2]) + '.'], text: 'sine law: an angle (obtuse given)', v: { k: 'ssa-obt', X: z.X, x: z.x, z: z.z } });
      } }] },
    { num: '9', parts: [
      { id: '9a', level: 'PRG', outcome: 'T3', make: function (r) {
        var z = pickWhere(function () { return { B: r.int(25, 75), a: r.int(8, 20), c: r.int(10, 25) }; }, function (z) { return z.a !== z.c && z.B !== 37 && !(z.a === 14 && z.c === 22); });
        var b = clSide(z.a, z.c, z.B), figS = triFig(['B', 'C', 'A'], z.B, z.c, z.a, { c: z.a + ' cm', b: z.c + ' cm', a: 'b', A: z.B + '°' });
        return nP('In ' + t('\\triangle ABC') + ', ' + t('\\angle B=' + D(z.B)) + ', ' + t('a=' + z.a) + ' cm and ' + t('c=' + z.c) + ' cm. Determine ' + t('b') + ' to the nearest tenth.' + figS, b, 1, { unit: 'cm', alts: clAlts(z.a, z.c, z.B, 'b'),
          sol: 'SAS: cosine law. ' + t('b^2=' + z.a + '^2+' + z.c + '^2-2(' + z.a + ')(' + z.c + ')\\cos ' + D(z.B) + '\\approx ' + fx(z.a * z.a + z.c * z.c, 0) + '-' + fx(2 * z.a * z.c * cs(z.B), 2) + '=' + fx(b * b, 2)) + ', so ' + t('b\\approx ' + fx(b, 1)) + ' cm.', hints: ['Two sides and the angle between them (SAS): cosine law ' + t('b^2=a^2+c^2-2ac\\cos B') + '.'], text: 'cosine law: a side', v: { k: 'sas', A: z.B, b: z.a, c: z.c } });
      } },
      { id: '9b', level: 'ADV', outcome: 'T3', make: function (r) {
        var z = pickWhere(function () { var s = r.shuffle(range(5, 20)).slice(0, 3).sort(function (a, b) { return a - b; }); return { p: s[0], q: s[1], s: s[2] }; }, function (z) {
          if (z.s >= z.p + z.q - 1) return false; var A = acs((z.q * z.q + z.s * z.s - z.p * z.p) / (2 * z.q * z.s)), B0 = acs((z.p * z.p + z.s * z.s - z.q * z.q) / (2 * z.p * z.s)), C = 180 - A - B0;
          if (rd(A, 0) + rd(B0, 0) + rd(C, 0) !== 180 || [A, B0, C].some(function (x) { return Math.abs(x - Math.floor(x) - 0.5) < 0.04; })) return false;
          return C > 95 && !(z.p === 8 && z.q === 11 && z.s === 16) && !(z.p === 7 && z.q === 9 && z.s === 13) && !(z.p === 6 && z.q === 8 && z.s === 12);
        });
        var A = acs((z.q * z.q + z.s * z.s - z.p * z.p) / (2 * z.q * z.s)), Bq = acs((z.p * z.p + z.s * z.s - z.q * z.q) / (2 * z.p * z.s)), C = 180 - A - Bq, cC = (z.p * z.p + z.q * z.q - z.s * z.s) / (2 * z.p * z.q);
        var figS = triFig(['X', 'Y', 'Z'], A, z.q, z.s, { a: z.p + ' cm', b: z.q + ' cm', c: z.s + ' cm' }, { aria: 'triangle with three sides' }).replace(/>[XYZ]</g, '><');
        return fP('A triangle has sides ' + t(z.p) + ' cm, ' + t(z.q) + ' cm and ' + t(z.s) + ' cm. Determine all three angles to the nearest degree.' + figS, [
          { label: 'opposite ' + t(z.s) + ' cm:', name: 'Angle opposite ' + t(z.s), kind: 'near', x: C, dp: 0, unit: '°', alts: [{ v: 180 - C, code: LID + '-cl-sign', hint: t('\\cos\\theta=' + fracTex(z.p * z.p + z.q * z.q - z.s * z.s, 2 * z.p * z.q)) + ' is <b>negative</b>, so the angle is obtuse. Keep the negative sign in ' + t('\\cos^{-1}') + '.' }, { v: A, code: LID + '-opp-side', hint: 'The largest angle is opposite the longest side, ' + t(z.s) + ' cm: put ' + t(z.s + '^2') + ' last in ' + t('\\cos\\theta=\\dfrac{a^2+b^2-c^2}{2ab}') + '.' }] },
          { label: 'opposite ' + t(z.q) + ' cm:', name: 'Angle opposite ' + t(z.q), kind: 'near', x: Bq, dp: 0, unit: '°', acc: [180 - rd(C, 0) - rd(A, 0)], alts: [{ v: A, code: LID + '-opp-side', hint: 'Use ' + t(z.q + '^2') + ' as the side opposite the angle you want.' }] },
          { label: 'opposite ' + t(z.p) + ' cm:', name: 'Angle opposite ' + t(z.p), kind: 'near', x: A, dp: 0, unit: '°', acc: [180 - rd(C, 0) - rd(Bq, 0)], alts: [{ v: Bq, code: LID + '-opp-side', hint: 'The smallest angle is opposite the shortest side.' }] }],
          { sol: 'Largest angle (opposite ' + t(z.s) + '): ' + t('\\cos\\theta=\\dfrac{' + z.p + '^2+' + z.q + '^2-' + z.s + '^2}{2(' + z.p + ')(' + z.q + ')}=' + fracTex(z.p * z.p + z.q * z.q - z.s * z.s, 2 * z.p * z.q) + '\\Rightarrow\\theta\\approx ' + Dx(C, 0)) + '<br>Opposite ' + t(z.p) + ': ' + t('\\cos\\alpha=\\dfrac{' + z.q + '^2+' + z.s + '^2-' + z.p + '^2}{2(' + z.q + ')(' + z.s + ')}=' + fracTex(z.q * z.q + z.s * z.s - z.p * z.p, 2 * z.q * z.s) + '\\Rightarrow\\alpha\\approx ' + Dx(A, 0)) + '<br>Third angle: ' + t('180^\\circ-' + Dx(C, 0) + '-' + Dx(A, 0) + '=' + Dx(Bq, 0)),
            hints: ['SSS: cosine law ' + t('\\cos A=\\dfrac{b^2+c^2-a^2}{2bc}') + '. Start with the largest angle (opposite the longest side).', 'A negative cosine means an obtuse angle.'], text: 'cosine law: three angles (SSS)', v: { k: 'sss', a: z.p, b: z.q, c: z.s } });
      } }] },
    { num: '10', parts: [
      { id: '10a', level: 'EMG', outcome: 'T3', make: function (r) {
        var L = r.pick([['A', 'B', 'C', 'D'], ['P', 'Q', 'R', 'S'], ['K', 'L', 'M', 'N'], ['D', 'E', 'F', 'G']]), A = L[0], Bv = L[1], C = L[2], Df = L[3], a = low(A), b = low(Bv);
        var pts = {}; pts[A] = [0, 0]; pts[Bv] = [5, 0]; pts[C] = [1.8, 2.8]; pts[Df] = [1.8, 0];
        var svg = fig(HW.fig({ pts: pts, segs: [[A, Bv], [Bv, C, low(A)], [A, C, low(Bv)], [C, Df, 'h', { dash: true }]], right: [[Df, Bv, C]], width: 220, aria: 'acute triangle with an altitude' }));
        var rows = [{ id: 's1', html: t('\\sin ' + A + '=\\tfrac{h}{' + b + '},\\ h=' + b + '\\sin ' + A), label: 'h = ' + b + ' sin ' + A }, { id: 's2', html: t('\\sin ' + Bv + '=\\tfrac{h}{' + a + '},\\ h=' + a + '\\sin ' + Bv), label: 'h = ' + a + ' sin ' + Bv }, { id: 's3', html: t(a + '\\sin ' + Bv + '=' + b + '\\sin ' + A), label: a + ' sin ' + Bv + ' = ' + b + ' sin ' + A }, { id: 's4', html: t('\\tfrac{' + a + '}{\\sin ' + A + '}=\\tfrac{' + b + '}{\\sin ' + Bv + '}'), label: a + '/sin ' + A + ' = ' + b + '/sin ' + Bv }];
        var cols = r.shuffle([{ id: 'c1', html: 'SOH in right ' + t('\\triangle ' + A + Df + C) }, { id: 'c2', html: 'SOH in right ' + t('\\triangle ' + Bv + Df + C) }, { id: 'c3', html: 'both equal ' + t('h') }, { id: 'c4', html: 'divide both sides by ' + t('\\sin ' + A + '\\sin ' + Bv) }, { id: 'c5', html: 'CAH in right ' + t('\\triangle ' + A + Df + C) }, { id: 'c6', html: 'multiply both sides by ' + t('\\sin ' + A + '\\sin ' + Bv) }]);
        var why = { s1: 'In right ' + t('\\triangle ' + A + Df + C) + ' the side opposite ' + t('\\angle ' + A) + ' is ' + t('h') + ' and the hypotenuse is ' + t(b) + ': opposite over hypotenuse.', s2: 'Which right triangle has ' + t('\\angle ' + Bv) + ', the side ' + t('h') + ' opposite it and the hypotenuse ' + t(a) + '?', s3: 'The two lines above each give ' + t('h') + '.', s4: 'Going from ' + t(a + '\\sin ' + Bv + '=' + b + '\\sin ' + A) + ' to ' + t('\\dfrac{' + a + '}{\\sin ' + A + '}=\\dfrac{' + b + '}{\\sin ' + Bv + '}') + ': what was done to both sides?' };
        return B.grid('Complete the reasons in this proof of the sine law for acute ' + t('\\triangle ' + A + Bv + C) + ', with altitude ' + t('h=' + C + Df) + ' from ' + t(C) + ' to ' + t(A + Bv) + '.' + svg, rows, cols, { s1: 'c1', s2: 'c2', s3: 'c3', s4: 'c4' }, { rowHead: 'Statement', why: function (row) { return { code: 'row', hint: why[row] }; } },
          '1. SOH in right ' + t('\\triangle ' + A + Df + C) + '. 2. SOH in right ' + t('\\triangle ' + Bv + Df + C) + '. 3. Both equal ' + t('h') + '. 4. Divide both sides by ' + t('\\sin ' + A + '\\sin ' + Bv) + '.', ['The altitude makes two right triangles that share the side ' + t('h') + '.'], 'sine law proof: reasons');
      } },
      { id: '10b', level: 'PRG', outcome: 'T3', make: function (r) {
        var z = pickWhere(function () { return { A: r.int(40, 70), B: r.int(45, 75), b: r.int(8, 16) }; }, function (z) { return z.A + z.B <= 140 && Math.abs(z.A - z.B) >= 5 && !(z.A === 50 && z.B === 60 && z.b === 10); });
        var h = z.b * sn(z.A), a = h / sn(z.B), xD = z.b * cs(z.A), c = xD + a * cs(z.B);
        var svg = fig(HW.fig({ pts: { A: [0, 0], B: [c, 0], C: [xD, h], D: [xD, 0] }, segs: [['A', 'B'], ['A', 'C', z.b + ' cm'], ['B', 'C', 'a'], ['C', 'D', 'h', { dash: true }]], right: [['D', 'B', 'C']], angles: [['A', 'B', 'C', z.A + '°'], ['B', 'A', 'C', z.B + '°']], width: 260, aria: 'triangle with altitude, to scale' }));
        return fP('In ' + t('\\triangle ABC') + ', ' + t('\\angle A=' + D(z.A)) + ', ' + t('\\angle B=' + D(z.B)) + ' and ' + t('b=' + z.b) + ' cm. Without the sine law, find ' + t('a') + ' by drawing the altitude ' + t('h=CD') + ' and using primary ratios.' + svg, [
          { label: t('h='), name: t('h') + ' (nearest hundredth)', kind: 'near', x: h, dp: 2, unit: 'cm', alts: [{ v: z.b * cs(z.A), code: LID + '-alt-cos', hint: 'In right ' + t('\\triangle ADC') + ', ' + t('h') + ' is <b>opposite</b> ' + t('\\angle A') + ' and ' + t('b') + ' is the hypotenuse: SOH.' }, { v: z.b * Math.sin(z.A), code: LID + '-radian', hint: 'Your calculator is in <b>radian</b> mode.' }] },
          { label: t('a='), name: t('a') + ' (nearest tenth)', kind: 'near', x: a, dp: 1, unit: 'cm', acc: [rd(h, 2) / sn(z.B)], alts: [{ v: h * sn(z.B), code: LID + '-alt-mult', hint: t('\\sin B=\\dfrac{h}{a}') + ', so ' + t('a=\\dfrac{h}{\\sin B}') + ': divide.' }, { v: h / cs(z.B), code: LID + '-alt-cos', hint: 'In right ' + t('\\triangle BDC') + ', ' + t('h') + ' is opposite ' + t('\\angle B') + ' and ' + t('a') + ' is the hypotenuse: SOH.' }] }],
          { sol: 'Right ' + t('\\triangle ADC') + ': ' + t('h=' + z.b + '\\sin ' + D(z.A) + '\\approx ' + fx(h, 3)) + ' cm. Right ' + t('\\triangle BDC') + ': ' + t('\\sin ' + D(z.B) + '=\\dfrac{h}{a}\\Rightarrow a=\\dfrac{' + fx(h, 3) + '}{\\sin ' + D(z.B) + '}\\approx ' + fx(a, 1)) + ' cm.<br>Check with the sine law: ' + t('a=\\dfrac{' + z.b + '\\sin ' + D(z.A) + '}{\\sin ' + D(z.B) + '}\\approx ' + fx(a, 1)) + ' cm ✓',
            hints: ['The altitude makes two right triangles that share ' + t('h') + '. Find ' + t('h') + ' in ' + t('\\triangle ADC') + ' first.'], text: 'altitude method for a side', v: { k: 'alt', A: z.A, B: z.B, b: z.b } });
      } }] },
    { num: '11', parts: [
      { id: '11', level: 'PRG', outcome: 'T3', make: function (r) {
        var cats = r.shuffle(['none', 'right', 'two', 'obt-one', 'obt-none', 'one']), rows = [], want = {}, info = {};
        cats.forEach(function (c, i) { var s = ssaCase(r, c, [[40, 5, 12], [30, 6, 12], [52, 10, 11], [115, 9, 7], [115, 7, 9], [65, 14, 9], [38, 7, 12], [38, 13, 12]]); rows.push({ id: 'r' + i, html: t('\\angle A=' + D(s.A) + ',\\ a=' + s.a + ',\\ b=' + s.b), label: '∠A = ' + s.A + '°, a = ' + s.a + ', b = ' + s.b }); want['r' + i] = 'n' + s.n; info['r' + i] = s; });
        var sol = cats.map(function (c, i) { return '(' + (i + 1) + ') ' + ssaSol(info['r' + i]); }).join('<br>');
        return B.grid('For each ' + t('\\triangle ABC') + ', how many triangles are possible?', rows, [{ id: 'n0', html: '0' }, { id: 'n1', html: '1' }, { id: 'n2', html: '2' }], want, { rowHead: 'Given', colHead: 'Triangles', why: function (row, got) { var s = info[row]; return { code: LID + '-amb-count', hint: s.A > 90 ? 'Check ' + t('\\angle A=' + D(s.A)) + ': it is obtuse, so compare ' + t('a') + ' with ' + t('b') + ' only.' : 'Check ' + t('\\angle A=' + D(s.A) + ',\\ a=' + s.a + ',\\ b=' + s.b) + ': find ' + t('h=b\\sin A') + ' and compare ' + t('a') + ' with ' + t('h') + ' and ' + t('b') + '.' }; } },
          sol, ['Acute ' + t('\\angle A') + ': ' + t('a<h') + ' none, ' + t('a=h') + ' one (right), ' + t('h<a<b') + ' two, ' + t('a\\ge b') + ' one.', 'Obtuse ' + t('\\angle A') + ': ' + t('a\\le b') + ' none, ' + t('a>b') + ' one.'], 'ambiguous case: number of triangles');
      } }] },
    { num: '12', shared: function (r) {
      return pickWhere(function () { var b = r.int(90, 160) / 10, A = r.int(25, 50), h = b * sn(A); return { A: A, b: b, a: r.int(Math.ceil((h + 0.6) * 10), Math.floor((b - 0.6) * 10)) / 10 }; },
        function (z) { if (!(z.a > z.b * sn(z.A) + 0.5 && z.a < z.b - 0.5)) return false; var B1 = asn(z.b * sn(z.A) / z.a); return 180 - z.A - (180 - B1) >= 5 && Math.abs(B1 - Math.floor(B1) - 0.5) > 0.05 && !(z.A === 35 && z.a === 8.2) && !(z.A === 38 && z.b === 12); });
    }, stem: function (z) { var s = ambSolve(z.A, z.a, z.b); return 'In ' + t('\\triangle ABC') + ', ' + t('\\angle A=' + D(z.A)) + ', ' + t('a=' + fx(z.a, 1)) + ' cm and ' + t('b=' + fx(z.b, 1)) + ' cm.' + ambFig(z, s); }, parts: [
      { id: '12', level: 'ADV', outcome: 'T3', make: function (r, z) { return ambBothP('Show that there are two triangles and solve both (angles to the nearest degree, sides to the nearest tenth).', z, 'ambiguous case: solve both'); } }] },
    { num: '13', section: 'Problem Solving', shared: function (r) {
      return pickWhere(function () { var b1 = r.int(20, 80), dl = r.int(60, 140); return { b1: b1, b2: b1 + dl, d1: r.int(15, 40), d2: r.int(10, 35) }; }, function (z) {
        var T = z.b1 + 180 - z.b2; if (T === 90 || z.b2 > 200 || z.d2 >= z.d1) return false; var d = clSide(z.d1, z.d2, T), P = acs((z.d1 * z.d1 + d * d - z.d2 * z.d2) / (2 * z.d1 * d));
        var ret = z.b1 + P + 180, retR = z.b1 + asn(z.d2 * sn(T) / rd(d, 1)) + 180;
        return P < 80 && Math.abs(P - Math.floor(P) - 0.5) > 0.06 && rd(ret, 0) === rd(retR, 0) && !(z.b1 === 62 && z.b2 === 154) && !(z.b1 === 35 && z.b2 === 120);
      });
    }, stem: function (z) { return 'A ship leaves port and sails ' + t(z.d1) + ' km on a bearing of ' + t(bearTex(z.b1)) + '. It then turns and sails ' + t(z.d2) + ' km on a bearing of ' + t(bearTex(z.b2)) + '.'; }, parts: [
      { id: '13a', level: 'PRG', outcome: 'T3', make: function (r, z) {
        var T = z.b1 + 180 - z.b2;
        return intP('Sketch a diagram. Determine the angle at the turning point ' + t('T') + '.', T, { unit: '°', cands: [[z.b2 - z.b1, LID + '-turn-heading', 'That is how much the ship turned. The angle <b>inside</b> the triangle at ' + t('T') + ' is between the way back to port (' + t(bearTex(z.b1) + '+180^\\circ') + ') and the new course.'], [360 - (z.b1 + 180 - z.b2), LID + '-turn-heading', 'Use the smaller angle at ' + t('T') + ', the one inside the triangle.']],
          sol: bearFig([{ d: z.d1, b: z.b1 }, { d: z.d2, b: z.b2 }], ['port', 'T', 'ship'], [z.d1 + ' km', z.d2 + ' km', 'd']) + 'At ' + t('T') + ', the direction back to port is ' + t(D(z.b1) + '+180^\\circ=' + D(z.b1 + 180)) + '. The new course is ' + t(bearTex(z.b2)) + '. The angle between them is ' + t(D(z.b1 + 180) + '-' + D(z.b2) + '=' + D(T)) + '.',
          hints: ['Draw a north line at ' + t('T') + '. The bearing back to port is the first bearing plus ' + t('180^\\circ') + '.'], text: 'bearings: angle at the turn' });
      } },
      { id: '13b', level: 'PRG', outcome: 'T3', make: function (r, z) {
        var T = z.b1 + 180 - z.b2, d = clSide(z.d1, z.d2, T);
        return nP('How far is the ship from port, to the nearest tenth of a kilometre?', d, 1, { unit: 'km', alts: clAlts(z.d1, z.d2, T, 'd'), sol: t('d^2=' + z.d1 + '^2+' + z.d2 + '^2-2(' + z.d1 + ')(' + z.d2 + ')\\cos ' + D(T) + '\\approx ' + fx(d * d, 2)) + ', ' + t('d\\approx ' + fx(d, 1)) + ' km', hints: ['SAS with the angle at ' + t('T') + ' from part (a): cosine law.'], text: 'bearings: distance from port', v: { k: 'sas', A: T, b: z.d1, c: z.d2 } });
      } },
      { id: '13c', level: 'MAS', outcome: 'T3', make: function (r, z) {
        var T = z.b1 + 180 - z.b2, d = clSide(z.d1, z.d2, T), P = acs((z.d1 * z.d1 + d * d - z.d2 * z.d2) / (2 * z.d1 * d)), Pr = asn(z.d2 * sn(T) / rd(d, 1)), ret = (z.b1 + P + 180) % 360;
        return nP('On what bearing must the ship sail to return directly to port? (Find the angle at port first; nearest degree.)', ret, 0, { unit: '°', acc: [(z.b1 + Pr + 180) % 360, (z.b1 + rd(P, 0) + 180) % 360],
          alts: [{ v: z.b1 + P, code: LID + '-from-port', hint: 'That is the bearing of the ship <b>from</b> port. To sail back, turn around: add ' + t('180^\\circ') + '.' }, { v: (z.b1 - P + 180 + 360) % 360, code: LID + '-bear-side', hint: 'The ship ended up clockwise from its first course, so its bearing from port is ' + t(bearTex(z.b1) + '+P') + '.' }, { v: P + 180, code: LID + '-bear-side', hint: 'Bearings are measured from north: the ship’s bearing from port is ' + t(bearTex(z.b1)) + ' plus the angle at port.' }, { v: P, code: LID + '-from-port', hint: 'That is the angle at port. Turn it into a bearing, then reverse it.' }],
          sol: 'Angle at port: ' + t('\\sin P=\\dfrac{' + z.d2 + '\\sin ' + D(T) + '}{' + fx(d, 2) + '}\\approx ' + fx(z.d2 * sn(T) / d, 4) + '\\Rightarrow P\\approx ' + Dx(P, 0)) + ' (acute: it is opposite the shorter side). The ship is on a bearing of ' + t(D(z.b1) + '+' + Dx(P, 0) + '=' + bearTex(rd(z.b1 + P, 0))) + ' from port, so the return bearing is ' + t(bearTex(rd(z.b1 + P, 0)) + '+180^\\circ=' + bearTex(rd(ret, 0))) + '.',
          hints: ['Find the angle at port with the sine law (or the cosine law).', 'Bearing of the ship from port = first bearing + angle at port. The way back is that bearing ' + t('\\pm 180^\\circ') + '.'], text: 'bearings: return bearing', v: { k: 'retbear', b1: z.b1, b2: z.b2, d1: z.d1, d2: z.d2 } });
      } }] },
    { num: '14', shared: function (r) {
      return pickWhere(function () { return { p: r.int(6, 14), q: r.int(8, 16), be: r.int(95, 125), a1: r.int(30, 55), a2: r.int(45, 70) }; }, function (z) { return z.a1 + z.a2 <= 125 && z.p !== z.q && !(z.p === 9 && z.q === 12 && z.be === 104); });
    }, stem: function (z) {
      var AC = clSide(z.p, z.q, z.be), BAC = asn(z.q * sn(z.be) / AC), ADC = 180 - z.a1 - z.a2, AD = AC * sn(z.a2) / sn(ADC);
      var svg = fig(HW.fig({ pts: { A: [0, 0], C: [AC, 0], D: [AD * cs(z.a1), AD * sn(z.a1)], B: [z.p * cs(BAC), -z.p * sn(BAC)] }, segs: [['A', 'B', z.p + ' m'], ['B', 'C', z.q + ' m'], ['C', 'D'], ['D', 'A'], ['A', 'C']], angles: [['B', 'A', 'C', z.be + '°'], ['A', 'C', 'D', z.a1 + '°'], ['C', 'A', 'D', z.a2 + '°']], width: 280, height: 260, aria: 'quadrilateral ABCD with diagonal AC, to scale' }));
      return 'In quadrilateral ' + t('ABCD') + ', ' + t('AB=' + z.p) + ' m, ' + t('BC=' + z.q) + ' m, ' + t('\\angle ABC=' + D(z.be)) + ', ' + t('\\angle CAD=' + D(z.a1)) + ' and ' + t('\\angle ACD=' + D(z.a2)) + '. Sides to the nearest tenth.' + svg;
    }, parts: [
      { id: '14a', level: 'PRG', outcome: 'T3', make: function (r, z) { var AC = clSide(z.p, z.q, z.be); return nP('Determine the length of the diagonal ' + t('AC') + '.', AC, 1, { unit: 'm', alts: clAlts(z.p, z.q, z.be, 'AC'), sol: 'SAS in ' + t('\\triangle ABC') + ': cosine law. ' + t('AC^2=' + z.p + '^2+' + z.q + '^2-2(' + z.p + ')(' + z.q + ')\\cos ' + D(z.be) + '\\approx ' + fx(AC * AC, 2)) + ', ' + t('AC\\approx ' + fx(AC, 1)) + ' m', hints: ['In ' + t('\\triangle ABC') + ' you know two sides and the angle between them.'], text: 'quadrilateral: diagonal', v: { k: 'sas', A: z.be, b: z.p, c: z.q } }); } },
      { id: '14b', level: 'ADV', outcome: 'T3', make: function (r, z) {
        var AC = clSide(z.p, z.q, z.be), ACr = rd(AC, 1), ADC = 180 - z.a1 - z.a2, AD = AC * sn(z.a2) / sn(ADC), CD = AC * sn(z.a1) / sn(ADC);
        return fP('Determine ' + t('AD') + ' and ' + t('CD') + '.', [
          { label: t('AD='), name: t('AD'), kind: 'near', x: AD, dp: 1, unit: 'm', acc: [ACr * sn(z.a2) / sn(ADC)], alts: [{ v: CD, code: LID + '-opp-pair', hint: t('AD') + ' is opposite ' + t('\\angle ACD=' + D(z.a2)) + '.' }, { v: AC * sn(z.a2) / sn(z.a1), code: LID + '-opp-pair', hint: t('AC') + ' is opposite ' + t('\\angle ADC') + ' — find that angle first.' }] },
          { label: t('CD='), name: t('CD'), kind: 'near', x: CD, dp: 1, unit: 'm', acc: [ACr * sn(z.a1) / sn(ADC)], alts: [{ v: AD, code: LID + '-opp-pair', hint: t('CD') + ' is opposite ' + t('\\angle CAD=' + D(z.a1)) + '.' }, { v: AC * sn(z.a1) / sn(z.a2), code: LID + '-opp-pair', hint: t('AC') + ' is opposite ' + t('\\angle ADC') + ' — find that angle first.' }] }],
          { sol: t('\\angle ADC=180^\\circ-' + D(z.a1) + '-' + D(z.a2) + '=' + D(ADC)) + ' (a full pair with ' + t('AC') + '): sine law.<br>' + t('AD=\\dfrac{' + fx(AC, 2) + '\\sin ' + D(z.a2) + '}{\\sin ' + D(ADC) + '}\\approx ' + fx(AD, 1)) + ' m, ' + t('CD=\\dfrac{' + fx(AC, 2) + '\\sin ' + D(z.a1) + '}{\\sin ' + D(ADC) + '}\\approx ' + fx(CD, 1)) + ' m',
            hints: ['In ' + t('\\triangle ACD') + ' find ' + t('\\angle ADC') + ' first; it is opposite ' + t('AC') + '.'], text: 'quadrilateral: two sides by sine law', v: { k: 'quad2', p: z.p, q: z.q, be: z.be, a1: z.a1, a2: z.a2 } });
      } },
      { id: '14c', level: 'MAS', outcome: 'T3', make: function (r, z) {
        var AC = clSide(z.p, z.q, z.be), ADC = 180 - z.a1 - z.a2, AD = AC * sn(z.a2) / sn(ADC), CD = AC * sn(z.a1) / sn(ADC);
        var per = z.p + z.q + AD + CD, A1 = 0.5 * z.p * z.q * sn(z.be), A2 = 0.5 * AC * AD * sn(z.a1), ar = A1 + A2;
        var perR = z.p + z.q + rd(AD, 1) + rd(CD, 1), arR = A1 + 0.5 * rd(AC, 1) * rd(AD, 1) * sn(z.a1), arR2 = rd(A1, 1) + rd(0.5 * rd(AC, 2) * rd(AD, 2) * sn(z.a1), 1);
        return fP('Determine the perimeter and the area of ' + t('ABCD') + ', to the nearest tenth, using ' + t('\\text{Area}=\\frac{1}{2}ab\\sin C') + ' for each triangle.', [
          { label: 'Perimeter', name: 'Perimeter', kind: 'near', x: per, dp: 1, unit: 'm', acc: [perR], alts: [{ v: per + AC, code: LID + '-perim', hint: 'The diagonal ' + t('AC') + ' is inside the shape: it isn’t part of the perimeter.' }, { v: z.p + z.q + AD, code: LID + '-perim', hint: 'Add all four sides.' }] },
          { label: 'Area', name: 'Area', kind: 'near', x: ar, dp: 1, after: t('\\text{m}^2'), acc: [arR, arR2], alts: [{ v: A1, code: LID + '-area-one', hint: 'That is only ' + t('\\triangle ABC') + '. Add the area of ' + t('\\triangle ACD') + '.' }, { v: A2, code: LID + '-area-one', hint: 'That is only ' + t('\\triangle ACD') + '. Add the area of ' + t('\\triangle ABC') + '.' }, { v: 2 * ar, code: LID + '-area-half', hint: t('\\text{Area}=\\frac{1}{2}ab\\sin C') + ': don’t forget the ' + t('\\frac{1}{2}') + '.' }] }],
          { sol: 'Perimeter ' + t('\\approx ' + z.p + '+' + z.q + '+' + fx(CD, 1) + '+' + fx(AD, 1) + '=' + fx(per, 1)) + ' m<br>Area ' + t('=\\frac{1}{2}(' + z.p + ')(' + z.q + ')\\sin ' + D(z.be) + '+\\frac{1}{2}(' + fx(AC, 2) + ')(' + fx(AD, 2) + ')\\sin ' + D(z.a1) + '\\approx ' + fx(A1, 1) + '+' + fx(A2, 1) + '=' + fx(ar, 1)) + ' m² (unrounded values)',
            hints: ['The perimeter uses the four outside sides (not ' + t('AC') + ').', t('\\triangle ACD') + ': the angle between ' + t('AC') + ' and ' + t('AD') + ' is ' + t('\\angle CAD') + '.'], text: 'quadrilateral: perimeter and area', v: { k: 'quad3', p: z.p, q: z.q, be: z.be, a1: z.a1, a2: z.a2 } });
      } }] },
    { num: '15', shared: function (r) {
      return pickWhere(function () { var JT = r.int(50, 95) / 10, ph = r.int(25, 45), h = JT * sn(ph); return { JT: JT, ph: ph, s: r.int(Math.ceil((h + 0.5) * 10), Math.floor((JT - 0.5) * 10)) / 10 }; }, function (z) { var h = z.JT * sn(z.ph); return z.s > h + 0.4 && z.s < z.JT - 0.4 && z.ph !== 34 && !(z.JT === 6 && z.s === 4); });
    }, stem: function (z) {
      var Tp = [z.JT * cs(z.ph), z.JT * sn(z.ph)], far = jpVals(z)[1], L = far * 1.15;
      var svg = fig(HW.fig({ pts: { J: [0, 0], T: Tp, E: [L, 0], F: [L * cs(z.ph) * 1.15, L * sn(z.ph) * 1.15] }, names: { J: 'J', T: 'T', E: 'road 2', F: 'road 1' }, segs: [['J', 'T', fs(z.JT, 1) + ' km'], ['T', 'F'], ['J', 'E']], angles: [['J', 'E', 'T', z.ph + '°']], width: 280, height: 200, aria: 'two roads meeting at J with a tower T' }));
      return 'Two straight roads meet at junction ' + t('J') + ' at an angle of ' + t(D(z.ph)) + '. A cell tower ' + t('T') + ' is on the first road, ' + t(fx(z.JT, 1)) + ' km from ' + t('J') + '. Its signal reaches ' + t(fx(z.s, 1)) + ' km in every direction.' + svg;
    }, parts: [
      { id: '15a', level: 'PRG', outcome: 'T3', make: function (r, z) {
        var h = z.JT * sn(z.ph);
        return mcP(r, 'Why does a car on the second road have signal for only part of the road?', [
          { html: 'The shortest distance from ' + t('T') + ' to the road is ' + t('h=' + fx(z.JT, 1) + '\\sin ' + D(z.ph) + '\\approx ' + fx(h, 2)) + ' km. Since ' + t(fx(h, 2) + '<' + fx(z.s, 1) + '<' + fx(z.JT, 1)) + ', the ' + t(fx(z.s, 1)) + ' km circle crosses the road at two points; there is signal only between them.', right: true },
          { html: 'Since ' + t(fx(z.s, 1) + '<' + fx(z.JT, 1)) + ', the signal never reaches the second road.', why: 'Compare the signal range with the <b>shortest</b> distance from ' + t('T') + ' to the road, ' + t('h=JT\\sin J') + ', not with ' + t('JT') + '.' },
          { html: 'The circle touches the road at exactly one point, where the road is closest to ' + t('T') + ', so there is signal only there.', why: 'That happens only when the range equals ' + t('h=JT\\sin J') + ' exactly. Work out ' + t('h') + '.' },
          { html: 'The car has signal only near ' + t('J') + ', because ' + t('J') + ' is the point of the road closest to ' + t('T') + '.', why: 'The closest point of the road to ' + t('T') + ' is the foot of the perpendicular, not ' + t('J') + '.' }],
          'The shortest distance from ' + t('T') + ' to the second road is ' + t('h=' + fx(z.JT, 1) + '\\sin ' + D(z.ph) + '\\approx ' + fx(h, 2)) + ' km. Since ' + t(fx(h, 2) + '<' + fx(z.s, 1) + '<' + fx(z.JT, 1)) + ' (the ambiguous case, two triangles ' + t('JTP') + '), the circle crosses the road at two points ' + t('P_1') + ' and ' + t('P_2') + '.', ['Compare the range with the perpendicular distance from ' + t('T') + ' to the road.'], 'ambiguous case: explain');
      } },
      { id: '15b', level: 'MAS', outcome: 'T3', make: function (r, z) {
        var v = jpVals(z), Pr = rd(asn(z.JT * sn(z.ph) / z.s), 1), nearR = z.s * sn(180 - z.ph - (180 - Pr)) / sn(z.ph), farR = z.s * sn(180 - z.ph - Pr) / sn(z.ph);
        var P1 = asn(z.JT * sn(z.ph) / z.s), Tp = [z.JT * cs(z.ph), z.JT * sn(z.ph)];
        var svg = fig(HW.fig({ pts: { J: [0, 0], T: Tp, P: [v[0], 0], Q: [v[1], 0] }, names: { J: 'J', T: 'T', P: 'P₁', Q: 'P₂' }, segs: [['J', 'T', fs(z.JT, 1)], ['J', 'Q'], ['T', 'P', fs(z.s, 1), { dash: true }], ['T', 'Q', fs(z.s, 1), { dash: true }]], angles: [['J', 'Q', 'T', z.ph + '°']], width: 270, aria: 'the two points where the signal circle meets the road' }));
        return fP('Determine, to the nearest tenth of a kilometre, the distances from ' + t('J') + ' along the second road at which the car gains and loses the signal.', [
          { label: 'gains at', name: 'Gains the signal', kind: 'near', x: v[0], dp: 1, unit: 'km from J', acc: [nearR], alts: [{ v: z.JT * cs(z.ph), code: LID + '-amb-one', hint: 'That is the foot of the perpendicular. The circle meets the road at two points, one on each side of it.' }] },
          { label: 'loses at', name: 'Loses the signal', kind: 'near', x: v[1], dp: 1, unit: 'km from J', acc: [farR], alts: [{ v: z.JT * cs(z.ph), code: LID + '-amb-one', hint: 'That is the foot of the perpendicular. The circle meets the road at two points, one on each side of it.' }] }],
          { swap: true, swapHint: 'Right distances — but the car gains the signal at the point <b>nearer</b> to ' + t('J') + '.',
            sol: svg + 'In ' + t('\\triangle JTP') + ': ' + t('JT=' + fx(z.JT, 1)) + ', ' + t('TP=' + fx(z.s, 1)) + ', ' + t('\\angle J=' + D(z.ph)) + '. ' + t('\\sin P=\\dfrac{' + fx(z.JT, 1) + '\\sin ' + D(z.ph) + '}{' + fx(z.s, 1) + '}\\approx ' + fx(z.JT * sn(z.ph) / z.s, 4) + '\\Rightarrow P\\approx ' + Dx(P1, 1)) + ' or ' + t(Dx(180 - P1, 1)) + '<br>' +
              t('P=' + Dx(180 - P1, 1)) + ': ' + t('\\angle T\\approx ' + Dx(P1 - z.ph, 1)) + ', ' + t('JP=\\dfrac{' + fx(z.s, 1) + '\\sin ' + Dx(P1 - z.ph, 1) + '}{\\sin ' + D(z.ph) + '}\\approx ' + fx(v[0], 1)) + ' km<br>' + t('P=' + Dx(P1, 1)) + ': ' + t('\\angle T\\approx ' + Dx(180 - z.ph - P1, 1)) + ', ' + t('JP=\\dfrac{' + fx(z.s, 1) + '\\sin ' + Dx(180 - z.ph - P1, 1) + '}{\\sin ' + D(z.ph) + '}\\approx ' + fx(v[1], 1)) + ' km<br>Signal from ' + t(fx(v[0], 1)) + ' km to ' + t(fx(v[1], 1)) + ' km from ' + t('J') + '.',
            hints: ['Triangle ' + t('JTP') + ' with ' + t('P') + ' on the second road: two sides (' + t('JT') + ', ' + t('TP') + ') and ' + t('\\angle J') + ' — the ambiguous case.', 'Find both values of ' + t('\\angle P') + ', then ' + t('JP') + ' for each.'], text: 'ambiguous case: signal on a road', v: { k: 'tower', JT: z.JT, ph: z.ph, s: z.s } });
      } }] },
    { num: '16', section: 'Multiple Choice and Numerical Response', parts: [
      { id: '16', level: 'EMG', outcome: 'T1', make: function (r) {
        var k = pickWhere(function () { return r.int(10, 80); }, function (k) { return k !== 45 && k !== 55; });
        var qs = r.shuffle([1, 2, 3, 4]).slice(0, 2).sort(), right = [fromRef(qs[0], k), fromRef(qs[1], k)].sort(function (a, b) { return a - b; });
        var ds = [], tries = 0;
        while (ds.length < 3 && tries++ < 200) { var s = r.int(10, 80), q = r.pick([1, 2, 3]), a = fromRef(q, s); if (s === 45 || a + 90 >= 360 || Math.abs(s - k) < 3 || Math.abs(90 - s - k) < 3) continue; var pr = [a, a + 90]; if (ds.some(function (d) { return d[0] === pr[0]; })) continue; ds.push(pr); }
        return mcP(r, 'Which pair of angles in standard position have the same reference angle?', [{ html: t(D(right[0]) + '\\text{ and }' + D(right[1])), right: true }].concat(ds.map(function (d) { return { html: t(D(d[0]) + '\\text{ and }' + D(d[1])), why: 'Their reference angles are ' + t(D(refOf(d[0]))) + ' and ' + t(D(refOf(d[1]))) + '.' }; })),
          'Both have ' + t('\\theta_R=' + D(k)) + '. (The other pairs differ by ' + t('90^\\circ') + ', so their reference angles add to ' + t('90^\\circ') + '.)', HQ, 'same reference angle');
      } },
      { id: '17', level: 'EMG', outcome: 'T1', make: function (r) {
        var k = r.pick([['-a', 'b', '180^\\circ-\\theta', 'the y-axis'], ['-a', '-b', '180^\\circ+\\theta', 'the origin'], ['a', '-b', '360^\\circ-\\theta', 'the x-axis']]);
        var opts = ['180^\\circ-\\theta', '180^\\circ+\\theta', '360^\\circ-\\theta', '90^\\circ+\\theta'].map(function (o) { return { html: t(o), right: o === k[2], why: o === '90^\\circ+\\theta' ? 'Rotating by ' + t('90^\\circ') + ' isn’t a reflection: it changes the reference angle.' : t('(' + k[0] + ',' + k[1] + ')') + ' is the reflection of ' + t('(a,b)') + ' in ' + k[3] + '. Which quadrant is it in?' }; });
        return mcP(r, 'The point ' + t('(a,b)') + ', with ' + t('a>0') + ' and ' + t('b>0') + ', is on the terminal arm of angle ' + t('\\theta') + '. The point ' + t('(' + k[0] + ',' + k[1] + ')') + ' is on the terminal arm of', opts, t('(' + k[0] + ',' + k[1] + ')') + ' is the reflection in ' + k[3] + ', in quadrant ' + QN[k[2] === '180^\\circ-\\theta' ? 2 : k[2] === '180^\\circ+\\theta' ? 3 : 4] + ', with the same reference angle ' + t('\\theta') + ': ' + t(k[2]) + '.', ['Reflect the point and find its quadrant; the reference angle stays ' + t('\\theta') + '.'], 'reflections of a point', true);
      } },
      { id: '18', level: 'PRG', outcome: 'T2', make: function (r) {
        var p = pickWhere(function () { var q = r.pick([2, 3, 4]), s = sgQ(q); return [s[0] * r.int(2, 45), s[1] * r.int(2, 45)]; }, function (p) { return !(p[0] === -9 && p[1] === 40) && !(p[0] === -4 && p[1] === -9) && Math.abs(Math.abs(p[0]) - Math.abs(p[1])) > 1 && Math.abs(ptAngle(p[0], p[1]) - Math.floor(ptAngle(p[0], p[1])) - 0.5) > 0.06; });
        var th = ptAngle(p[0], p[1]);
        return nP('<b>Numerical response.</b> The terminal arm of angle ' + t('\\theta') + ', ' + t('0^\\circ\\le\\theta<360^\\circ') + ', passes through ' + t('(' + p[0] + ',' + p[1] + ')') + '. To the nearest degree, ' + t('\\theta') + ' is ____°.', th, 0, { nr: true, alts: ptAlts(p[0], p[1]), sol: ptSol(p[0], p[1], 1) + ' Nearest degree: ' + t(Dx(th, 0)) + '.', hints: ['Find the quadrant first, then ' + t('\\theta_R') + '.'], text: 'NR: angle from a point', v: { k: 'ptang', x: p[0], y: p[1], dp: 0 } });
      } },
      { id: '19', level: 'EMG', outcome: 'T2', make: function (r) {
        var c = r.pick([['\\cos\\theta', '\\sin\\theta', -1, -1, 3], ['\\sin\\theta', '\\cos\\theta', 1, -1, 2], ['\\sin\\theta', '\\tan\\theta', -1, -1, 4], ['\\cos\\theta', '\\tan\\theta', 1, -1, 4], ['\\tan\\theta', '\\sin\\theta', 1, -1, 3], ['\\cos\\theta', '\\tan\\theta', -1, -1, 2], ['\\tan\\theta', '\\cos\\theta', 1, -1, 3], ['\\sin\\theta', '\\tan\\theta', 1, -1, 2]]);
        var txt = c[2] === c[3] ? 'both ' + t(c[0]) + ' and ' + t(c[1]) + ' ' + (c[2] < 0 ? 'negative' : 'positive') : t(c[0]) + ' ' + (c[2] > 0 ? 'positive' : 'negative') + ' and ' + t(c[1]) + ' ' + (c[3] > 0 ? 'positive' : 'negative');
        var SG = { 1: 'all three ratios are positive', 2: 'only sine is positive', 3: 'only tangent is positive', 4: 'only cosine is positive' };
        return mcP(r, 'In which quadrant is ' + txt + '?', [1, 2, 3, 4].map(function (q) { return { html: QN[q], right: q === c[4], why: 'In quadrant ' + QN[q] + ', ' + SG[q] + ' (CAST).' }; }), 'CAST: in quadrant ' + QN[c[4]] + ', ' + SG[c[4]] + '. (' + t('\\sin\\theta=\\frac{y}{r}') + ', ' + t('\\cos\\theta=\\frac{x}{r}') + ', ' + t('\\tan\\theta=\\frac{y}{x}') + '.)', ['Use the signs of ' + t('x') + ' and ' + t('y') + ' in each quadrant.'], 'CAST: quadrant from signs', true);
      } },
      { id: '20', level: 'EMG', outcome: 'T2', make: function (r) {
        var z = pickWhere(function () { return { f: r.pick(['sin', 'cos', 'tan']), a: r.pick([120, 150, 210, 240, 300, 330]) }; }, function (z) { return !(z.f === 'sin' && z.a === 240) && !(z.f === 'tan' && z.a === 300) && !(z.f === 'cos' && z.a === 210); });
        var v = ev(z.f, z.a), co = coVal(z.f, z.a);
        return mcP(r, '<b>No calculator.</b> The exact value of ' + t(fa(z.f, z.a)) + ' is', [{ html: t(valTex(v)), right: true }, { html: t(valTex(-v)), why: 'Check the sign with CAST: ' + t(D(z.a)) + ' is in quadrant ' + QN[quadOf(z.a)] + '.' }, { html: t(valTex(co)), why: 'That is the value for the other special angle. Here ' + t('\\theta_R=' + D(refOf(z.a))) + '.' }, { html: t(valTex(-co)), why: 'The reference angle is ' + t(D(refOf(z.a))) + ': check its special-triangle value.' }], exactSol(z.f, z.a), ['Quadrant, reference angle, special triangle, CAST sign.'], 'MC: exact value');
      } },
      { id: '21', level: 'PRG', outcome: 'T2', make: function (r) {
        var z = pickWhere(function () { var f = r.pick(['sin', 'cos', 'tan']), fm = r.pick(f === 'tan' ? LIN_T : LIN_SC), neg = r.chance(0.6); return { f: f, k: fm[0], m: fm[1], v: fm[2] * (neg ? -1 : 1), neg: neg }; }, function (z) { return !(z.f === 'sin' && z.k === '2' && z.m === '1' && z.neg); });
        var sols = solve(z.f, z.v), sum = Math.round(sols[0] + sols[1]);
        return intP('<b>Numerical response.</b> The sum of all the solutions of ' + t(linTex(z.k, z.f, z.m, z.neg)) + ', ' + t('0^\\circ\\le\\theta<360^\\circ') + ', is ____°.', sum, { nr: true, cands: [[Math.round(sols[0]), LID + '-one-sol', 'There are two solutions. Add them.'], [Math.round(sols[1]), LID + '-one-sol', 'There are two solutions. Add them.'], [Math.round(solve(z.f, -z.v)[0] + solve(z.f, -z.v)[1]), LID + '-opp-sign', 'Check the sign of ' + t(fname(z.f) + '\\theta') + ' after isolating it.']], sol: t(fname(z.f) + '\\theta=' + valTex(z.v)) + ', ' + solveSol(z.f, z.v, null) + ' Sum ' + t('=' + D(sum)) + '.', hints: ['Isolate ' + t(fname(z.f) + '\\theta') + ', find both solutions, then add.'], text: 'NR: sum of exact solutions' });
      } },
      { id: '22', level: 'PRG', outcome: 'T2', make: function (r) {
        var z = pickWhere(function () { var f = r.pick(['sin', 'cos', 'tan']); return { f: f, a: (r.chance(0.6) ? -1 : 1) * (f === 'tan' ? r.int(2, 35) / 10 : r.int(1, 9) / 10) }; }, function (z) { return !(z.f === 'cos' && z.a === -0.6) && Math.abs(Math.abs(z.a) - 0.5) > 1e-9 && Math.abs(Math.abs(z.a) - 1) > 1e-9 && !(z.f === 'tan' && z.a === 0.9); });
        var R0 = rd(refFor(z.f, z.a), 1), C4 = [R0, 180 - R0, 180 + R0, 360 - R0].map(function (v) { return rd(v, 1); }), byQ = function (vals) { return vals.map(function (v) { return C4[quadOf(v) - 1]; }).sort(function (a, b) { return a - b; }); };
        var pairs = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]].map(function (p) { return [C4[p[0]], C4[p[1]]]; }), key = function (p) { return p.join(','); };
        var sols = byQ(solve(z.f, z.a)), right = sols, opp = byQ(solve(z.f, -z.a));
        var others = r.shuffle(pairs.filter(function (p) { return key(p) !== key(sols) && key(p) !== key(opp); })).slice(0, 2);
        return mcP(r, 'The solutions of ' + t(fname(z.f) + '\\theta=' + nT(z.a)) + ', ' + t('0^\\circ\\le\\theta<360^\\circ') + ', to the nearest tenth of a degree, are', [{ html: t(Dx(right[0], 1) + ',\\ ' + Dx(right[1], 1)), right: true }, { html: t(Dx(opp[0], 1) + ',\\ ' + Dx(opp[1], 1)), why: 'Those solve ' + t(fname(z.f) + '\\theta=' + nT(-z.a)) + '. ' + castTxt(z.f, z.a > 0 ? 1 : -1) + '.' }].concat(others.map(function (p) { return { html: t(Dx(p[0], 1) + ',\\ ' + Dx(p[1], 1)), why: castTxt(z.f, z.a > 0 ? 1 : -1) + ' — check the quadrant of each angle.' }; })),
          solveSol(z.f, z.a, 1), ['Find ' + t('\\theta_R') + ' with the positive value, then use CAST.'], 'MC: solve with a calculator');
      } },
      { id: '23', level: 'PRG', outcome: 'T3', make: function (r) {
        var s = ssaCase(r, r.pick(['none', 'two', 'two', 'one', 'obt-one', 'obt-none']), [[44, 11, 15]]);
        return mcP(r, 'In ' + t('\\triangle ABC') + ', ' + t('\\angle A=' + D(s.A)) + ', ' + t('a=' + s.a) + ' cm and ' + t('b=' + s.b) + ' cm. The number of possible triangles is', [{ html: '0', right: s.n === 0, why: 'Compare ' + t('a') + ' with ' + t('h=b\\sin A') + ' and with ' + t('b') + '.' }, { html: '1', right: s.n === 1, why: 'Compare ' + t('a') + ' with ' + t('h=b\\sin A') + ' and with ' + t('b') + '.' }, { html: '2', right: s.n === 2, why: 'Compare ' + t('a') + ' with ' + t('h=b\\sin A') + ' and with ' + t('b') + '.' }, { html: 'cannot be determined', why: 'SSA can always be decided: compare ' + t('a') + ' with ' + t('h=b\\sin A') + ' and ' + t('b') + '.' }], ssaSol(s), ['Find ' + t('h=b\\sin A') + '.'], 'MC: number of triangles', true);
      } },
      { id: '24', level: 'EMG', outcome: 'T3', make: function (r) {
        var z = pickWhere(function () { return { a: r.int(8, 16), b: r.int(8, 16), C: r.int(30, 80) }; }, function (z) { var A = 0.5 * z.a * z.b * sn(z.C); return A < 99.9 && z.a !== z.b && !(z.a === 13 && z.b === 15) && Math.abs(A * 10 - Math.floor(A * 10) - 0.5) > 0.05; });
        var A = 0.5 * z.a * z.b * sn(z.C);
        return nP('<b>Numerical response.</b> Two sides of a triangular ' + r.pick(['garden', 'lot', 'sail', 'flower bed']) + ' are ' + t(z.a) + ' m and ' + t(z.b) + ' m and the angle between them is ' + t(D(z.C)) + '. The area, to the nearest tenth of a square metre, is ____ m².', A, 1, { nr: true, alts: [{ v: 2 * A, code: LID + '-area-half', hint: t('\\text{Area}=\\frac{1}{2}ab\\sin C') + ': don’t forget the ' + t('\\frac{1}{2}') + '.' }, { v: 0.5 * z.a * z.b * Math.sin(z.C), code: LID + '-radian', hint: 'Your calculator is in <b>radian</b> mode.' }, { v: 0.5 * z.a * z.b * cs(z.C), code: LID + '-alt-cos', hint: 'The area formula uses <b>sine</b> of the angle between the sides.' }], sol: t('\\text{Area}=\\frac{1}{2}(' + z.a + ')(' + z.b + ')\\sin ' + D(z.C) + '\\approx ' + fx(A, 1)) + ' m²', hints: ['Two sides and the angle between them: ' + t('\\text{Area}=\\frac{1}{2}ab\\sin C') + '.'], text: 'NR: area of a triangle', v: { k: 'area', a: z.a, b: z.b, C: z.C } });
      } },
      { id: '25', level: 'EMG', outcome: 'T3', make: function (r) {
        var who = r.pick(['A surveyor', 'An engineer', 'A carpenter', 'A pilot', 'A park designer']), p = r.int(40, 95), q = r.int(25, 80), x = r.int(35, 80), y = r.int(30, 70);
        var c = r.pick([
          ['knows two sides of a triangular lot, ' + p + ' m and ' + q + ' m, and the angle of ' + t(D(x)) + ' between them. To find the third side', 2, 'SAS: no side and its opposite angle are both known, so the sine law can’t start; the triangle isn’t right-angled. Use the cosine law.'],
          ['knows all three sides of a triangular frame, ' + p + ' cm, ' + q + ' cm and ' + (p + q - 9) + ' cm. To find its largest angle', 2, 'SSS: the cosine law, ' + t('\\cos C=\\dfrac{a^2+b^2-c^2}{2ab}') + '.'],
          ['knows two angles of a triangle, ' + t(D(x)) + ' and ' + t(D(y)) + ', and the side of ' + p + ' m opposite the ' + t(D(x)) + ' angle. To find the side opposite the ' + t(D(y)) + ' angle', 1, 'A side and its opposite angle are known (a full pair): the sine law.'],
          ['knows two angles, ' + t(D(x)) + ' and ' + t(D(y)) + ', and the side of ' + p + ' m between them. To find another side', 1, 'Find the third angle; then the known side and its opposite angle form a full pair: the sine law.'],
          ['knows a right triangle with a hypotenuse of ' + p + ' m and an acute angle of ' + t(D(x)) + '. To find the side opposite that angle', 0, 'A right triangle: SOH CAH TOA (' + t('\\sin\\theta=\\frac{\\text{opp}}{\\text{hyp}}') + ').']]);
        var names = ['SOH CAH TOA', 'the sine law', 'the cosine law', 'the problem cannot be solved without more information'];
        return mcP(r, who + ' ' + c[0] + ', the most appropriate method is', names.map(function (nm, i) { return { html: nm, right: i === c[1], why: i === 3 ? 'Three facts including a side are enough to solve a triangle.' : i === 0 ? 'SOH CAH TOA needs a right triangle.' : i === 1 ? 'The sine law needs a side and its opposite angle (a full pair).' : 'The cosine law is for SAS or SSS.' }; }), c[2], ['Right triangle: SOH CAH TOA. A full side–angle pair: sine law. SAS or SSS: cosine law.'], 'MC: choose the law', true);
      } },
      { id: '26', level: 'PRG', outcome: 'T3', make: function (r) {
        var z = pickWhere(function () { var s = r.shuffle(range(4, 15)).slice(0, 3).sort(function (a, b) { return a - b; }); return { a: s[0], b: s[1], c: s[2] }; }, function (z) {
          if (z.c >= z.a + z.b) return false; var C = acs((z.a * z.a + z.b * z.b - z.c * z.c) / (2 * z.a * z.b)), A = acs((z.b * z.b + z.c * z.c - z.a * z.a) / (2 * z.b * z.c));
          return C > 100 && Math.abs(C - Math.floor(C) - 0.5) > 0.05 && rd(A, 0) !== rd(180 - C, 0) && !(z.a === 6 && z.b === 8 && z.c === 12) && !(z.a === 7 && z.b === 9 && z.c === 13);
        });
        var C = acs((z.a * z.a + z.b * z.b - z.c * z.c) / (2 * z.a * z.b)), A = acs((z.b * z.b + z.c * z.c - z.a * z.a) / (2 * z.b * z.c));
        return mcP(r, 'The largest angle of a triangle with sides ' + t(z.a) + ' cm, ' + t(z.b) + ' cm and ' + t(z.c) + ' cm is, to the nearest degree,', [{ html: t(Dx(C, 0)), right: true }, { html: t(Dx(180 - C, 0)), why: 'The cosine is negative: the largest angle is obtuse. Keep the negative sign in ' + t('\\cos^{-1}') + '.' }, { html: t(Dx(A, 0)), why: 'That is the smallest angle (opposite the shortest side). The largest is opposite ' + t(z.c) + ' cm.' }, { html: t(Dx(180 - A, 0)), why: 'The largest angle is opposite the longest side, ' + t(z.c) + ' cm.' }],
          t('\\cos C=\\dfrac{' + z.a + '^2+' + z.b + '^2-' + z.c + '^2}{2(' + z.a + ')(' + z.b + ')}=' + fracTex(z.a * z.a + z.b * z.b - z.c * z.c, 2 * z.a * z.b) + '\\approx ' + fx((z.a * z.a + z.b * z.b - z.c * z.c) / (2 * z.a * z.b), 4)) + ', so ' + t('C\\approx ' + Dx(C, 0)) + '.', ['The largest angle is opposite the longest side.'], 'MC: largest angle (SSS)');
      } },
      { id: '27', level: 'PRG', outcome: 'T3', make: function (r) {
        var z = pickWhere(function () { var b1 = r.int(0, 90), dl = r.int(50, 140); return { b1: b1, b2: b1 + dl, d1: r.int(30, 99) / 10, d2: r.int(30, 99) / 10 }; }, function (z) { var dl = z.b2 - z.b1, d = clSide(z.d1, z.d2, dl); return d < 99.9 && dl !== 90 && Math.abs(z.d1 - z.d2) > 0.5 && Math.abs(d * 10 - Math.floor(d * 10) - 0.5) > 0.05 && !(z.b1 === 20 && z.b2 === 100); });
        var dl = z.b2 - z.b1, d = clSide(z.d1, z.d2, dl);
        return nP('<b>Numerical response.</b> Two hikers leave a camp at the same time. One walks ' + t(fx(z.d1, 1)) + ' km on a bearing of ' + t(bearTex(z.b1)) + ' and the other walks ' + t(fx(z.d2, 1)) + ' km on a bearing of ' + t(bearTex(z.b2)) + '. To the nearest tenth of a kilometre, they are ____ km apart.', d, 1, { nr: true, alts: clAlts(z.d1, z.d2, dl, 'd').concat([{ v: clSide(z.d1, z.d2, z.b1 + z.b2), code: LID + '-turn-heading', hint: 'The angle between the paths is the <b>difference</b> of the bearings.' }]),
          sol: 'Angle between the paths: ' + t(D(z.b2) + '-' + D(z.b1) + '=' + D(dl)) + '. ' + t('d^2=' + fx(z.d1, 1) + '^2+' + fx(z.d2, 1) + '^2-2(' + fx(z.d1, 1) + ')(' + fx(z.d2, 1) + ')\\cos ' + D(dl) + '\\approx ' + fx(d * d, 2)) + ', ' + t('d\\approx ' + fx(d, 1)) + ' km.', hints: ['The angle at the camp is the difference of the bearings; then SAS: cosine law.'], text: 'NR: bearings distance', v: { k: 'sas', A: dl, b: z.d1, c: z.d2 } });
      } }] }
  ];

  /* Questions 16–27 were written as one block of parts: give each its own question number, as in the booklet */
  (function splitMC() {
    for (var i = 0; i < QUESTIONS.length; i++) if (QUESTIONS[i].num === '16') break;
    var q = QUESTIONS[i], qs = q.parts.map(function (p, k) { var o = { num: p.id, parts: [p] }; if (!k) o.section = q.section; return o; });
    QUESTIONS.splice.apply(QUESTIONS, [i, 1].concat(qs));
  })();

  /* ---- helpers used above (function declarations are hoisted) ---- */
  function bearTex(b) { b = ((Math.round(b) % 360) + 360) % 360; return (b < 10 ? '00' : b < 100 ? '0' : '') + b + '^\\circ'; }
  var LIN_SC = [['2', '1', 0.5], ['2', '\\sqrt{3}', Math.sqrt(3) / 2], ['2', '\\sqrt{2}', Math.SQRT2 / 2], ['\\sqrt{2}', '1', Math.SQRT2 / 2]];
  var LIN_T = [['\\sqrt{3}', '1', Math.sqrt(3) / 3], ['', '\\sqrt{3}', Math.sqrt(3)], ['3', '\\sqrt{3}', Math.sqrt(3) / 3], ['\\sqrt{3}', '3', Math.sqrt(3)], ['', '1', 1]];
  /* k f θ ± m = 0, with the value −m/k (neg: the value is negative, so +m) */
  function linTex(k, f, m, neg) { return k + fname(f) + '\\theta' + (neg ? '+' : '-') + m + '=0'; }
  function exSolveP(eqTex, f, a, text, z) {
    var sols = solve(f, a), r0 = sols.length ? refFor(f, a) : null, isQ = sols.length && isQuadrantal(sols[0]) && !(f === 'tan' && Math.abs(a) > 1e-9) && (Math.abs(Math.abs(a) - 1) < 1e-9 || Math.abs(a) < 1e-9);
    var iso = z ? (z.k ? '\\dfrac{' + (z.neg ? '-' : '') + z.m + '}{' + z.k + '}' : (z.neg ? '-' : '') + z.m) : '';
    var pre = z ? t(fname(f) + '\\theta=' + iso + (valTex(a) !== iso ? '=' + valTex(a) : '')) + '. ' : '';
    var sol = isQ ? pre + 'Quadrantal: on the unit circle, ' + t(fname(f) + '\\theta=' + nT(a)) + ' at ' + t(angTex(sols, 0)) + '.' : pre + t('\\theta_R=' + D(Math.round(r0))) + ' (special triangle). ' + castTxt(f, a > 0 ? 1 : -1) + ': ' + t(angTex(sols, 0)) + '.';
    return angP(t(eqTex), sols, 0, { f: f, a: a, ref: isQ ? null : Math.round(r0), sol: sol, lastHint: isQ ? 'Picture the point on the unit circle (' + t('r=1') + ') where ' + t(fname(f) + '\\theta=' + nT(a)) + '.' : 'Check the reference angle: which special angle has ' + t(fname(f)) + ' equal to ' + t(magTex(a)) + '?', hints: ['Isolate ' + t(fname(f) + '\\theta') + ', then find ' + t('\\theta_R') + ' from a special triangle.', 'Use the sign and CAST to choose the two quadrants.'], text: text,
      xc: isQ ? [[(sols[0] + 180) % 360, LID + '-cast', 'Picture the point on the unit circle where ' + t(fname(f) + '\\theta=' + nT(a)) + '.']] : [], v: { k: 'set', f: f, a: a, dp: 0 } });
  }
  function calcSolveP(eqTex, f, a, text, pre) {
    var sols = solve(f, a), r0 = refFor(f, a);
    var rr = f === 'sin' ? Math.asin(Math.abs(a)) : f === 'cos' ? Math.acos(Math.abs(a)) : Math.atan(Math.abs(a));
    return angP(t(eqTex), sols, 1, { f: f, a: a, ref: r0, lastHint: 'Find ' + t('\\theta_R') + ' with the inverse key and ' + t('|' + nT(cl(a)) + '|') + ' (degree mode), then use CAST.', xc: [[rr, LID + '-radian', 'Your calculator is in <b>radian</b> mode. Switch to degree mode.'], [f === 'tan' ? atn(a) + 360 : NaN, LID + '-set', ''], [f === 'sin' ? asn(a) : f === 'cos' ? acs(a) : atn(a), LID + '-raw-atan', 'The inverse key gives only one angle (and possibly a negative one). Find ' + t('\\theta_R') + ' with the positive value, then use CAST.']].filter(function (c) { return isFinite(c[0]) && c[2]; }),
      sol: (pre ? t(pre) + ' ' : '') + solveSol(f, a, 1), hints: ['Find ' + t('\\theta_R') + ' with the inverse key and the <b>positive</b> value.', 'Use the sign and CAST to choose the two quadrants.'], text: text, v: { k: 'set', f: f, a: a, dp: 1 } });
  }
  function comboP(z, kind) {
    var exprTex, val, absV, steps;
    if (kind === 'prod') { exprTex = fa(z.t1.f, z.t1.a) + fa(z.t2.f, z.t2.a) + z.op + fa(z.t3.f, z.t3.a); val = tv(z.t1) * tv(z.t2) + (z.op === '+' ? 1 : -1) * tv(z.t3); absV = absVal(z.t1) * absVal(z.t2) + (z.op === '+' ? 1 : -1) * absVal(z.t3); steps = tvTex(z.t1) + '\\cdot ' + tvTex(z.t2) + z.op + tvTex(z.t3); }
    else if (kind === 'sq') { exprTex = fa(z.t1.f, z.t1.a, true) + z.op + fa(z.t2.f, z.t2.a, true); val = tv(z.t1) + (z.op === '+' ? 1 : -1) * tv(z.t2); absV = NaN; steps = tvTex(z.t1) + z.op + tvTex(z.t2) + '=' + ratTex(tv(z.t1)) + z.op + ratTex(tv(z.t2)); }
    else if (kind === 'sqprod') { exprTex = fa(z.t1.f, z.t1.a) + fa(z.t2.f, z.t2.a) + '+' + fa(z.t3.f, z.t3.a, true); val = tv(z.t1) * tv(z.t2) + tv(z.t3); absV = absVal(z.t1) * absVal(z.t2) + absVal(z.t3); steps = tvTex(z.t1) + tvTex(z.t2) + '+' + tvTex(z.t3) + '=' + ratTex(tv(z.t1) * tv(z.t2)) + '+' + ratTex(tv(z.t3)); }
    else { exprTex = '\\dfrac{' + fa(z.t1.f, z.t1.a) + '+' + fa(z.t2.f, z.t2.a) + '}{' + fa(z.t3.f, z.t3.a) + '}'; val = (tv(z.t1) + tv(z.t2)) / tv(z.t3); absV = (absVal(z.t1) + absVal(z.t2)) / absVal(z.t3); steps = '\\dfrac{' + tvTex(z.t1) + '+' + tvTex(z.t2) + '}{' + tvTex(z.t3) + '}'; }
    var key = ratTex(val), cands = [];
    if (isFinite(absV) && !same(absV, val)) cands.push([absV, LID + '-cast-sign', 'Check the sign of each value with CAST before combining them.']);
    var p = B.math('Evaluate exactly: ' + t(exprTex), exChk(val, { cands: cands, undefOk: false, signHint: 'Check the signs: use CAST for each angle.' }), key, t('=' + steps + '=' + key), ['Replace each ratio by its exact value (quadrant, reference angle, CAST sign), then simplify.', t('\\cos^2\\theta') + ' means ' + t('(\\cos\\theta)^2') + ': square the value, sign and all.'], kind === 'quot' ? 'exact expression: quotient' : 'exact expression', { keys: 'u3l9exact' });
    p.bad = [String(-val === 0 ? 1 : '-(' + key + ')')];
    return p;
  }
  function ssaCase(r, c, avoid) {
    return pickWhere(function () {
      var A, a, b;
      if (c === 'right') { A = 30; b = 2 * r.int(4, 10); a = b / 2; }
      else if (c === 'obt-one' || c === 'obt-none') { A = r.int(100, 140); b = r.int(5, 15); a = c === 'obt-one' ? b + r.int(1, 6) : b - r.int(0, 4); }
      else if (c === 'one') { A = r.int(40, 80); b = r.int(5, 14); a = b + r.int(0, 5); }
      else { A = r.int(25, 60); b = r.int(8, 20); var h = b * sn(A); a = c === 'none' ? r.int(2, Math.max(2, Math.floor(h - 0.4))) : r.int(Math.ceil(h + 0.4), b - 1); }
      return { A: A, a: a, b: b, c: c, n: c === 'none' || c === 'obt-none' ? 0 : c === 'two' ? 2 : 1 };
    }, function (s) {
      var h = s.b * sn(s.A); if (s.a < 2) return false;
      if (s.c === 'none' && !(s.a < h - 0.3)) return false; if (s.c === 'two' && !(s.a > h + 0.3 && s.a < s.b)) return false;
      if (s.c === 'right' && s.b === 12) return false;
      return !(avoid || []).some(function (v) { return v[0] === s.A && v[1] === s.a && v[2] === s.b; });
    });
  }
  function ssaSol(s) {
    if (s.A > 90) return t('\\angle A=' + D(s.A)) + ' is obtuse and ' + t(s.a > s.b ? 'a>b' : 'a\\le b') + ' (' + t(s.a + (s.a > s.b ? '>' : '\\le ') + s.b) + '): ' + (s.n ? 'one triangle.' : 'no triangle.');
    var h = s.b * sn(s.A), hT = s.c === 'right' ? t('h=' + s.b + '\\sin 30^\\circ=' + s.a) : t('h=' + s.b + '\\sin ' + D(s.A) + '\\approx ' + fx(h, 2));
    return hT + '. ' + (s.c === 'none' ? t('a<h') + ' (' + t(s.a + '<' + fx(h, 2)) + '): no triangle.' : s.c === 'right' ? t('a=h') + ': one (right) triangle.' : s.c === 'two' ? t('h<a<b') + ' (' + t(fx(h, 2) + '<' + s.a + '<' + s.b) + '): two triangles.' : t('a\\ge b') + ' (' + t(s.a + '\\ge ' + s.b) + '): one triangle.');
  }
  function ambSolve(A, a, b) {
    var B1 = asn(b * sn(A) / a), B2 = 180 - B1, C1 = 180 - A - B1, C2 = 180 - A - B2;
    return { h: b * sn(A), B1: B1, B2: B2, C1: C1, C2: C2, c1: a * sn(C1) / sn(A), c2: a * sn(C2) / sn(A), c1r: a * sn(180 - A - rd(B1, 0)) / sn(A), c2r: a * sn(180 - A - rd(B2, 0)) / sn(A) };
  }
  function ambFig(z, s) {
    var C = [z.b * cs(z.A), z.b * sn(z.A)];
    return fig(HW.fig({ pts: { A: [0, 0], C: C, B1: [s.c1, 0], B2: [s.c2, 0] }, names: { A: 'A', C: 'C', B1: 'B₁', B2: 'B₂' }, segs: [['A', 'B1'], ['A', 'C', fs(z.b, 1) + ' cm'], ['C', 'B1', fs(z.a, 1) + ' cm'], ['C', 'B2', fs(z.a, 1) + ' cm', { dash: true, side: -1 }]], angles: [['A', 'B1', 'C', z.A + '°']], width: 300, aria: 'the two possible triangles, to scale' }));
  }
  function ambBothP(prompt, z, text) {
    var s = ambSolve(z.A, z.a, z.b);
    return fP(prompt, [
      { label: t('\\angle B_1='), name: t('\\angle B_1') + ' (acute)', kind: 'near', x: s.B1, dp: 0, unit: '°', alts: [{ v: s.B2, code: LID + '-amb-one', hint: 'Put the <b>acute</b> angle in triangle 1 and the obtuse one in triangle 2.' }, { v: asn(z.a * sn(z.A) / z.b), code: LID + '-sl-flip', hint: t('\\sin B=\\dfrac{b\\sin A}{a}') + '.' }] },
      { label: t('\\angle C_1='), name: t('\\angle C_1'), kind: 'near', x: s.C1, dp: 0, unit: '°', alts: [{ v: s.C2, code: LID + '-amb-one', hint: 'Triangle 1 uses ' + t('\\angle B_1') + ' (acute): ' + t('\\angle C_1=180^\\circ-\\angle A-\\angle B_1') + '.' }] },
      { label: t('c_1='), name: t('c_1'), kind: 'near', x: s.c1, dp: 1, unit: 'cm', acc: [s.c1r], alts: [{ v: s.c2, code: LID + '-amb-one', hint: 'That is ' + t('c_2') + '. Triangle 1 has the larger ' + t('\\angle C') + '.' }, { v: z.a * sn(z.A) / sn(s.C1), code: LID + '-sl-flip', hint: t('c=\\dfrac{a\\sin C}{\\sin A}') + '.' }] },
      { label: t('\\angle B_2='), name: t('\\angle B_2') + ' (obtuse)', kind: 'near', x: s.B2, dp: 0, unit: '°', alts: [{ v: s.B1, code: LID + '-amb-one', hint: 'Triangle 2 has the obtuse angle ' + t('\\angle B_2=180^\\circ-\\angle B_1') + '.' }] },
      { label: t('\\angle C_2='), name: t('\\angle C_2'), kind: 'near', x: s.C2, dp: 0, unit: '°', alts: [{ v: s.C1, code: LID + '-amb-one', hint: 'Triangle 2 uses ' + t('\\angle B_2') + ' (obtuse).' }] },
      { label: t('c_2='), name: t('c_2'), kind: 'near', x: s.c2, dp: 1, unit: 'cm', acc: [s.c2r], alts: [{ v: s.c1, code: LID + '-amb-one', hint: 'That is ' + t('c_1') + '. Use ' + t('\\angle C_2') + '.' }] }],
      { sol: t('h=b\\sin A=' + fx(z.b, 1) + '\\sin ' + D(z.A) + '\\approx ' + fx(s.h, 2)) + ' cm; ' + t(fx(s.h, 2) + '<' + fx(z.a, 1) + '<' + fx(z.b, 1)) + ', so two triangles.<br>' + t('\\sin B=\\dfrac{' + fx(z.b, 1) + '\\sin ' + D(z.A) + '}{' + fx(z.a, 1) + '}\\approx ' + fx(z.b * sn(z.A) / z.a, 4) + '\\Rightarrow B\\approx ' + Dx(s.B1, 0)) + ' or ' + t(Dx(s.B2, 0)) + '<br>Triangle 1: ' + t('C\\approx 180^\\circ-' + D(z.A) + '-' + Dx(s.B1, 0) + '=' + Dx(s.C1, 0)) + ', ' + t('c=\\dfrac{' + fx(z.a, 1) + '\\sin ' + Dx(s.C1, 0) + '}{\\sin ' + D(z.A) + '}\\approx ' + fx(s.c1, 1)) + ' cm<br>Triangle 2: ' + t('C\\approx 180^\\circ-' + D(z.A) + '-' + Dx(s.B2, 0) + '=' + Dx(s.C2, 0)) + ', ' + t('c=\\dfrac{' + fx(z.a, 1) + '\\sin ' + Dx(s.C2, 0) + '}{\\sin ' + D(z.A) + '}\\approx ' + fx(s.c2, 1)) + ' cm',
        hints: ['Compare ' + t('a') + ' with ' + t('h=b\\sin A') + ' and ' + t('b') + '. Then the sine law gives ' + t('\\sin B') + '.', 'The two values of ' + t('B') + ' are ' + t('B') + ' and ' + t('180^\\circ-B') + '.'], text: text, v: { k: 'amb', A: z.A, a: z.a, b: z.b } });
  }
  function jpVals(z) { var P1 = asn(z.JT * sn(z.ph) / z.s), T1 = 180 - z.ph - P1, T2 = 180 - z.ph - (180 - P1); return [z.s * sn(T2) / sn(z.ph), z.s * sn(T1) / sn(z.ph)]; }

  /* ======================= Extra Practice 9 (a second practice test) ======================= */
  var EXTRA = [
    { num: '1', section: 'A. Multiple Choice', parts: [{ id: 'e1', level: 'BEG', outcome: 'T1', make: function (r) {
      var z = pickWhere(function () { return { q: r.pick([3, 3, 2, 4]), k: r.int(12, 78) }; }, function (z) { return !(z.q === 3 && z.k === 28) && z.k !== 45; });
      var right = fromRef(z.q, z.k), yax = z.q === 2 ? 90 + z.k : z.q === 3 ? 270 - z.k : 270 + z.k;
      var opts = uniqBy([[180 - z.k, 2], [180 + z.k, 3], [360 - z.k, 4], [yax, 0]].filter(function (o) { return o[0] !== right || o[1] === z.q; }), function (o) { return o[0]; });
      return mcP(r, 'An angle in standard position terminates in quadrant ' + QN[z.q] + ' and has a reference angle of ' + t(D(z.k)) + '. The angle is', opts.map(function (o) { return { html: t(D(o[0])), right: o[0] === right, why: o[1] ? 'That angle is in quadrant ' + QN[o[1]] + '.' : 'That measures the reference angle to the y-axis. Reference angles are measured to the x-axis.' }; }),
        'Quadrant ' + QN[z.q] + ': ' + t('\\theta=' + placeTex(z.q, z.k)) + '.', HQ, 'MC: angle from quadrant and θR');
    } }] },
    { num: '2', parts: [{ id: 'e2', level: 'PRG', outcome: 'T2', make: function (r) {
      var qs = r.shuffle([2, 3, 4, r.pick([2, 3, 4])]), used = {}, sts = qs.map(function (q, i) {
        var k = pickWhere(function () { return r.int(10, 80); }, function (k) { return !used[k] && k !== 45 && k % 10 !== 0 || (!used[k] && r.chance(0.2) && k !== 45); }); used[k] = 1;
        var a = fromRef(q, k), f = r.pick(['sin', 'cos', 'tan']), sg = fv(f, a) > 0 ? 1 : -1;
        return { a: a, k: k, f: f, sg: sg, right: i === 0 };
      });
      return mcP(r, 'Which statement is true?', sts.map(function (s) { var shown = s.right ? s.sg : -s.sg; return { html: t(fa(s.f, s.a) + '=' + (shown < 0 ? '-' : '') + fa(s.f, s.k)), right: s.right, why: t(D(s.a)) + ' is in quadrant ' + QN[quadOf(s.a)] + ', where ' + castTxt(s.f, s.sg).replace(/ in quadrants.*/, '') + '.' }; }),
        t(fa(sts[0].f, sts[0].a) + '=' + (sts[0].sg < 0 ? '-' : '') + fa(sts[0].f, sts[0].k)) + ': ' + t(D(sts[0].a)) + ' is in quadrant ' + QN[quadOf(sts[0].a)] + ' with ' + t('\\theta_R=' + D(sts[0].k)) + ', and ' + castTxt(sts[0].f, sts[0].sg).replace(/ in quadrants.*/, '') + ' there. Each other statement needs the opposite sign.', ['Same reference angle, so the value has the same size. CAST gives the sign.'], 'MC: sign of a ratio (CAST)');
    } }] },
    { num: '3', parts: [{ id: 'e3', level: 'EMG', outcome: 'T2', make: function (r) {
      var p = triplePt(r, [2, 3, 4], [[12, -5]]), f = r.pick(['cos', 'sin', 'tan']), P = ptRatios(p[0], p[1]), other = f === 'sin' ? 'cos' : 'sin';
      var v = P[f], ov = f === 'tan' ? p[0] / p[1] : P[other], vt = P[f + 'Key'], ot = f === 'tan' ? fracTex(p[0], p[1]) : P[other + 'Key'];
      return mcP(r, 'The point ' + t('(' + p[0] + ',' + p[1] + ')') + ' is on the terminal arm of angle ' + t('\\theta') + '. The exact value of ' + t(fname(f) + '\\theta') + ' is', [{ html: t(vt), right: true }, { html: t(valTexR(-v, vt)), why: 'Check the sign: look at the signs of ' + t('x') + ' and ' + t('y') + '.' }, { html: t(ot), why: f === 'tan' ? t('\\tan\\theta=\\dfrac{y}{x}') + '.' : 'That is ' + t(fname(other) + '\\theta') + '. ' + (f === 'cos' ? t('\\cos\\theta=\\dfrac{x}{r}') : t('\\sin\\theta=\\dfrac{y}{r}')) + '.' }, { html: t(valTexR(-ov, ot)), why: f === 'tan' ? t('\\tan\\theta=\\dfrac{y}{x}') + '.' : 'That is ' + t(fname(other) + '\\theta') + ' with the wrong sign.' }],
        t('r=\\sqrt{' + p[0] * p[0] + '+' + p[1] * p[1] + '}=' + Math.round(P.r)) + ', ' + t(fname(f) + '\\theta=' + (f === 'sin' ? '\\dfrac{y}{r}' : f === 'cos' ? '\\dfrac{x}{r}' : '\\dfrac{y}{x}') + '=' + vt) + '.', ['Find ' + t('r') + ' first.'], 'MC: exact ratio from a point');
    } }] },
    { num: '4', parts: [{ id: 'e4', level: 'EMG', outcome: 'T2', make: function (r) {
      var a = r.pick([120, 240, 150, 330, 210, 300]), f = r.pick(['tan', 'tan', 'sin', 'cos']);
      if (f === 'tan' && a === 300) a = 120; if (f === 'sin' && a === 240) a = 300;
      var v = ev(f, a), co = coVal(f, a);
      return mcP(r, '<b>No calculator.</b> The exact value of ' + t(fa(f, a)) + ' is', [{ html: t(valTex(v)), right: true }, { html: t(valTex(-v)), why: 'Check the sign with CAST.' }, { html: t(valTex(co)), why: 'That is the value for the other special angle; here ' + t('\\theta_R=' + D(refOf(a))) + '.' }, { html: t(f === 'tan' ? (v < 0 ? '-' : '') + '\\frac{1}{2}' : valTex(-co)), why: f === 'tan' ? t('\\tan\\theta=\\dfrac{\\sin\\theta}{\\cos\\theta}') + ': check the special triangle.' : 'Check the reference angle and the special triangle.' }], exactSol(f, a), ['Quadrant, reference angle, special triangle, CAST sign.'], 'MC: exact value');
    } }] },
    { num: '5', parts: [{ id: 'e5', level: 'PRG', outcome: 'T2', make: function (r) {
      var z = pickWhere(function () { var tr = r.pick(TRIP), sw = r.chance(0.5); return { y: sw ? tr[0] : tr[1], x: sw ? tr[1] : tr[0], rr: tr[2], q: r.pick([2, 2, 3, 4]), f: r.pick(['sin', 'cos']) }; }, function (z) { return !(z.f === 'sin' && z.y === 5 && z.rr === 13 && z.q === 2) && gcd(z.x, z.y) === 1; });
      var s = sgQ(z.q), x = s[0] * z.x, y = s[1] * z.y, given = z.f === 'sin' ? fracTex(y, z.rr) : fracTex(x, z.rr);
      var tanV = fracTex(y, x), recip = fracTex(x, y), other = z.f === 'sin' ? fracTex(x, z.rr) : fracTex(y, z.rr);
      return mcP(r, 'If ' + t(fname(z.f) + '\\theta=' + given) + ' and ' + t(INTV[z.q]) + ', then ' + t('\\tan\\theta') + ' is', [{ html: t(tanV), right: true }, { html: t(fracTex(-y, x)), why: 'Check the sign of ' + t('\\tan\\theta') + ' in quadrant ' + QN[z.q] + ' (CAST).' }, { html: t(recip), why: t('\\tan\\theta=\\dfrac{y}{x}') + ', not ' + t('\\dfrac{x}{y}') + '.' }, { html: t(other), why: 'That is ' + t(z.f === 'sin' ? '\\cos\\theta' : '\\sin\\theta') + '.' }],
        'Quadrant ' + QN[z.q] + ': ' + (z.f === 'sin' ? t('y=' + y + ',\\ r=' + z.rr + ',\\ x=' + (x < 0 ? '-' : '') + '\\sqrt{' + z.rr * z.rr + '-' + z.y * z.y + '}=' + x) : t('x=' + x + ',\\ r=' + z.rr + ',\\ y=' + (y < 0 ? '-' : '') + '\\sqrt{' + z.rr * z.rr + '-' + z.x * z.x + '}=' + y)) + ', so ' + t('\\tan\\theta=\\dfrac{' + y + '}{' + x + '}=' + tanV) + '.', ['Sketch the triangle in the right quadrant.'], 'MC: tan from sin or cos and an interval');
    } }] },
    { num: '6', parts: [{ id: 'e6', level: 'PRG', outcome: 'T2', make: function (r) {
      var z = pickWhere(function () { var f = r.pick(['sin', 'cos', 'tan']), fm = r.pick(f === 'tan' ? LIN_T : LIN_SC), neg = r.chance(0.5); return { f: f, k: fm[0], m: fm[1], v: fm[2] * (neg ? -1 : 1), neg: neg, big: r.chance(0.6) }; }, function (z) { return !(z.f === 'cos' && z.k === '2' && z.m === '\\sqrt{2}' && !z.neg); });
      var sols = solve(z.f, z.v), k = Math.round(refFor(z.f, z.v)), ans = z.big ? Math.max(sols[0], sols[1]) : Math.min(sols[0], sols[1]), c4 = [k, 180 - k, 180 + k, 360 - k];
      return mcP(r, 'The ' + (z.big ? 'largest' : 'smallest') + ' solution of ' + t(linTex(z.k, z.f, z.m, z.neg)) + ', ' + t('0^\\circ\\le\\theta<360^\\circ') + ', is', c4.map(function (v) { return { html: t(D(v)), right: Math.abs(v - ans) < 1e-9, why: sols.some(function (s) { return Math.abs(s - v) < 1e-9; }) ? 'That is a solution, but not the ' + (z.big ? 'largest' : 'smallest') + ' one.' : castTxt(z.f, z.v > 0 ? 1 : -1) + '; ' + t(D(v)) + ' is in quadrant ' + QN[quadOf(v)] + '.' }; }), t(fname(z.f) + '\\theta=' + valTex(z.v)) + ', ' + solveSol(z.f, z.v, null) + ' The ' + (z.big ? 'largest' : 'smallest') + ' is ' + t(D(ans)) + '.', ['Find both solutions first.'], 'MC: largest/smallest exact solution', true);
    } }] },
    { num: '7', parts: [{ id: 'e7', level: 'PRG', outcome: 'T2', make: function (r) {
      var a = pickWhere(function () { return (r.chance(0.5) ? -1 : 1) * r.int(2, 40) / 10; }, function (a) { return a !== 0.9 && Math.abs(Math.abs(a) - 1) > 1e-9; }), R0 = rd(atn(Math.abs(a)), 1), C4 = [R0, rd(180 - R0, 1), rd(180 + R0, 1), rd(360 - R0, 1)];
      var right = a > 0 ? [C4[0], C4[2]] : [C4[1], C4[3]], cands = a > 0 ? [[C4[0], C4[1]], [C4[0], C4[3]], [C4[1], C4[3]]] : [[C4[0], C4[2]], [C4[1], C4[2]], [C4[2], C4[3]]];
      return mcP(r, 'The solutions of ' + t('\\tan\\theta=' + nT(a)) + ', ' + t('0^\\circ\\le\\theta<360^\\circ') + ', to the nearest tenth of a degree, are', [{ html: t(Dx(right[0], 1) + ',\\ ' + Dx(right[1], 1)), right: true }].concat(cands.map(function (p) { return { html: t(Dx(p[0], 1) + ',\\ ' + Dx(p[1], 1)), why: castTxt('tan', a > 0 ? 1 : -1) + '. The two solutions of a tangent equation are ' + t('180^\\circ') + ' apart.' }; })), solveSol('tan', a, 1), ['Tangent: the second solution is the first ' + t('+180^\\circ') + '.'], 'MC: solve tan', true);
    } }] },
    { num: '8', parts: [{ id: 'e8', level: 'ADV', outcome: 'T3', make: function (r) {
      var z = pickWhere(function () { var P = r.int(20, 40), q = r.int(15, 30), h = q * sn(P); return { P: P, q: q, h: h, n0: Math.max(2, Math.floor(h) - r.int(1, 3)), t1: Math.ceil(h + 0.4), t2: q - 1 - r.int(0, 1), one: q + r.int(1, 8) }; }, function (z) { return z.t2 > z.t1 && z.n0 < z.h - 0.3 && !(z.P === 27 && z.q === 20); });
      var ps = [[z.n0, 0], [z.t1, 2], [z.t2, 2], [z.one, 1]];
      return mcP(r, 'In ' + t('\\triangle PQR') + ', ' + t('\\angle P=' + D(z.P)) + ' and ' + t('q=' + z.q) + ' cm. For which value of ' + t('p') + ' is there exactly one triangle?', ps.map(function (v) { return { html: t('p=' + v[0]) + ' cm', right: v[1] === 1, why: v[1] === 0 ? t('p<h=' + z.q + '\\sin ' + D(z.P) + '\\approx ' + fx(z.h, 2)) + ': no triangle.' : t('h<p<q') + ': two triangles.' }; }),
        t('h=' + z.q + '\\sin ' + D(z.P) + '\\approx ' + fx(z.h, 2)) + ' cm. ' + t('p=' + z.n0 + '<h') + ': none; ' + t('p=' + z.t1) + ' or ' + t(z.t2) + ' (' + t('h<p<q') + '): two; ' + t('p=' + z.one + '\\ge q') + ': one.', ['Find ' + t('h=q\\sin P') + ' and compare.'], 'MC: which side gives one triangle', true);
    } }] },
    { num: '9', parts: [{ id: 'e9', level: 'PRG', outcome: 'T3', make: function (r) {
      var z = pickWhere(function () { var R = r.int(10, 24) / 2; return { R: R, L: r.int(Math.ceil((R * Math.SQRT2 + 0.6) * 2), Math.floor((2 * R - 0.6) * 2)) / 2 }; }, function (z) { var O = acs((2 * z.R * z.R - z.L * z.L) / (2 * z.R * z.R)); return O > 95 && O < 160 && !(z.R === 7.5 && z.L === 11) && Math.abs(O - Math.floor(O) - 0.5) > 0.05 && Math.abs(O / 2 - Math.floor(O / 2) - 0.5) > 0.05; });
      var cO = (2 * z.R * z.R - z.L * z.L) / (2 * z.R * z.R), O = acs(cO);
      return mcP(r, 'A circle with centre ' + t('O') + ' has a radius of ' + t(nT(z.R)) + ' cm. Chord ' + t('AB') + ' is ' + t(nT(z.L)) + ' cm long. The measure of ' + t('\\angle AOB') + ', to the nearest degree, is', uniqBy([[rd(O, 0), true, null], [rd(180 - O, 0), false, 'The cosine is negative, so ' + t('\\angle AOB') + ' is obtuse. Keep the negative sign.'], [rd(O / 2, 0), false, 'That is half the angle.'], [rd(180 - O / 2, 0), false, 'Use the cosine law in ' + t('\\triangle AOB') + ' with ' + t('OA=OB=' + nT(z.R)) + '.']], function (o) { return o[0]; }).sort(function (p, q) { return p[0] - q[0]; }).map(function (o) { return { html: t(D(o[0])), right: o[1], why: o[2] }; }),
        t('\\triangle AOB') + ' has ' + t('OA=OB=' + nT(z.R)) + ' (SSS). ' + t('\\cos O=\\dfrac{' + nT(z.R) + '^2+' + nT(z.R) + '^2-' + nT(z.L) + '^2}{2(' + nT(z.R) + ')(' + nT(z.R) + ')}\\approx ' + fx(cO, 4)) + ', so ' + t('\\angle AOB\\approx ' + Dx(O, 0)) + '.', ['Two sides of ' + t('\\triangle AOB') + ' are radii.'], 'MC: chord angle (cosine law)', true);
    } }] },
    { num: '10', parts: [{ id: 'e10', level: 'ADV', outcome: 'T3', make: function (r) {
      var z = pickWhere(function () { var a = r.int(100, 180) / 10; return { A: r.int(50, 75), a: a, c: r.int(Math.round(a * 5), Math.round(a * 8.5)) / 10 }; }, function (z) { var C = asn(z.c * sn(z.A) / z.a); return Math.abs(C - Math.floor(C) - 0.5) > 0.05 && Math.abs(90 - C - C) > 3 && !(z.A === 63 && z.a === 14); });
      var C = asn(z.c * sn(z.A) / z.a), Cr = rd(C, 0);
      return mcP(r, 'In ' + t('\\triangle ABC') + ', ' + t('\\angle A=' + D(z.A)) + ', ' + t('a=' + fx(z.a, 1)) + ' cm and ' + t('c=' + fx(z.c, 1)) + ' cm. The measure of ' + t('\\angle C') + ' is', [{ html: t(D(Cr)), right: true }, { html: t(D(180 - Cr)), why: 'Since ' + t('c<a') + ', ' + t('\\angle C') + ' is smaller than ' + t('\\angle A') + ', so it can’t be obtuse.' }, { html: t(D(Cr) + '\\text{ or }' + D(180 - Cr)), why: 'Check: ' + t('c<a') + ', so ' + t('\\angle C<\\angle A') + ' — only one triangle.' }, { html: t(D(90 - Cr)), why: 'Sine law: ' + t('\\sin C=\\dfrac{c\\sin A}{a}') + '.' }],
        t('\\sin C=\\dfrac{' + fx(z.c, 1) + '\\sin ' + D(z.A) + '}{' + fx(z.a, 1) + '}\\approx ' + fx(z.c * sn(z.A) / z.a, 4)) + ', so ' + t('C\\approx ' + D(Cr)) + '. Since ' + t('c<a') + ', ' + t('C') + ' is smaller than ' + t('A') + ', so ' + t(D(180 - Cr)) + ' is impossible (one triangle).', ['The larger side is opposite the larger angle.'], 'MC: sine law angle, one triangle');
    } }] },
    { num: '11', section: 'B. Numerical Response', parts: [{ id: 'e11', level: 'PRG', outcome: 'T2', make: function (r) {
      var p = pickWhere(function () { var q = r.pick([3, 3, 2, 4]), s = sgQ(q); return [s[0] * r.int(2, 12), s[1] * r.int(2, 12)]; }, function (p) { var th = ptAngle(p[0], p[1]); return !(p[0] === -4 && p[1] === -9) && Math.abs(p[0]) !== Math.abs(p[1]) && Math.abs(th - Math.floor(th) - 0.5) > 0.06; }), th = ptAngle(p[0], p[1]);
      return nP('<b>Numerical response.</b> The terminal arm of angle ' + t('\\theta') + ', ' + t('0^\\circ\\le\\theta<360^\\circ') + ', passes through ' + t('(' + p[0] + ',' + p[1] + ')') + '. To the nearest degree, ' + t('\\theta') + ' is ____°.', th, 0, { nr: true, alts: ptAlts(p[0], p[1]), sol: ptSol(p[0], p[1], 1) + ' Nearest degree: ' + t(Dx(th, 0)) + '.', hints: ['Quadrant first, then ' + t('\\theta_R') + '.'], text: 'NR: angle from a point', v: { k: 'ptang', x: p[0], y: p[1], dp: 0 } });
    } }] },
    { num: '12', parts: [{ id: 'e12', level: 'ADV', outcome: 'T3', make: function (r) {
      var z = pickWhere(function () { var b1 = r.int(15, 75), dl = r.int(55, 130); return { b1: b1, b2: b1 + dl, d1: r.int(20, 60), d2: r.int(15, 50) }; }, function (z) { var T = z.b1 + 180 - z.b2, d = clSide(z.d1, z.d2, T); return T !== 90 && d < 99.4 && Math.abs(d - Math.floor(d) - 0.5) > 0.05 && !(z.b1 === 35 && z.b2 === 120) && !(z.b1 === 62 && z.b2 === 154); });
      var T = z.b1 + 180 - z.b2, d = clSide(z.d1, z.d2, T);
      return nP('<b>Numerical response.</b> A ship sails ' + t(z.d1) + ' km on a bearing of ' + t(bearTex(z.b1)) + ', then turns and sails ' + t(z.d2) + ' km on a bearing of ' + t(bearTex(z.b2)) + '. To the nearest kilometre, the ship is now ____ km from its starting point.', d, 0, { nr: true, alts: clAlts(z.d1, z.d2, T, 'd').concat([{ v: clSide(z.d1, z.d2, z.b2 - z.b1), code: LID + '-turn-heading', hint: 'The angle in the triangle at the turn is between the way back (' + t(bearTex(z.b1) + '+180^\\circ') + ') and the new course, not the change in heading.' }]),
        sol: bearFig([{ d: z.d1, b: z.b1 }, { d: z.d2, b: z.b2 }], ['start', 'T', 'ship'], [z.d1 + ' km', z.d2 + ' km', 'd']) + 'At the turn, the direction back to the start is ' + t(bearTex(z.b1 + 180)) + ', so the angle at the turn is ' + t(D(z.b1 + 180) + '-' + D(z.b2) + '=' + D(T)) + '.<br>' + t('d^2=' + z.d1 + '^2+' + z.d2 + '^2-2(' + z.d1 + ')(' + z.d2 + ')\\cos ' + D(T) + '\\approx ' + fx(d * d, 2)) + ', ' + t('d\\approx ' + fx(d, 0)) + ' km', hints: ['Sketch with north lines. The angle at the turn: first bearing ' + t('+180^\\circ') + ' minus the second bearing.'], text: 'NR: ship distance (bearings)', v: { k: 'sas', A: T, b: z.d1, c: z.d2 } });
    } }] },
    { num: '13', parts: [{ id: 'e13', level: 'ADV', outcome: 'T3', make: function (r) {
      var z = pickWhere(function () { return { d: r.int(15, 40) * 10, A: r.int(35, 70), B: r.int(35, 70) }; }, function (z) { var C = 180 - z.A - z.B, AC = z.d * sn(z.B) / sn(C), h = AC * sn(z.A); return z.A !== z.B && h < 9999 && Math.abs(h - Math.floor(h) - 0.5) > 0.05 && !(z.d === 300 && z.A === 42); });
      var C = 180 - z.A - z.B, AC = z.d * sn(z.B) / sn(C), h = AC * sn(z.A);
      var svg = fig(HW.fig({ pts: { A: [0, 0], B: [z.d, 0], C: [AC * cs(z.A), h], F: [AC * cs(z.A), 0] }, names: { A: 'A', B: 'B', C: 'balloon', F: '' }, segs: [['A', 'B', z.d + ' m'], ['A', 'C'], ['B', 'C'], ['C', 'F', 'h', { dash: true }]], right: [['F', 'B', 'C']], angles: [['A', 'B', 'C', z.A + '°'], ['B', 'A', 'C', z.B + '°']], width: 260, aria: 'balloon above the ground between A and B' }));
      return nP('<b>Numerical response.</b> Points ' + t('A') + ' and ' + t('B') + ' are ' + t(z.d) + ' m apart on level ground. A hot-air balloon is directly above a point between them. The angles of elevation of the balloon from ' + t('A') + ' and ' + t('B') + ' are ' + t(D(z.A)) + ' and ' + t(D(z.B)) + '. To the nearest metre, the balloon is ____ m above the ground.' + svg, h, 0, { nr: true, acc: [rd(AC, 2) * sn(z.A)],
        alts: [{ v: AC, code: LID + '-forgot-angle', hint: 'That is the distance from ' + t('A') + ' to the balloon. The height is the vertical side: ' + t('h=AC\\sin A') + '.' }, { v: z.d * sn(z.B) / sn(C) * cs(z.A), code: LID + '-alt-cos', hint: 'The height is <b>opposite</b> the angle at ' + t('A') + ': SOH.' }, { v: z.d * sn(z.A) / sn(C) * sn(z.A), code: LID + '-opp-pair', hint: t('AC') + ' is opposite the angle at ' + t('B') + '.' }],
        sol: 'Angle at the balloon: ' + t('180^\\circ-' + D(z.A) + '-' + D(z.B) + '=' + D(C)) + '. Sine law: ' + t('AC=\\dfrac{' + z.d + '\\sin ' + D(z.B) + '}{\\sin ' + D(C) + '}\\approx ' + fx(AC, 2)) + ' m.<br>Height ' + t('=AC\\sin ' + D(z.A) + '\\approx ' + fx(h, 0)) + ' m', hints: ['Find the angle at the balloon, then a side with the sine law, then the height with SOH.'], text: 'NR: balloon height', v: { k: 'balloon', d: z.d, A: z.A, B: z.B } });
    } }] },
    { num: '14', parts: [{ id: 'e14', level: 'PRG', outcome: 'T2', make: function (r) {
      var z = pickWhere(function () { var k = r.int(3, 9); return { k: k, m: (r.chance(0.6) ? 1 : -1) * r.int(1, k - 1), big: r.chance(0.6), f: r.pick(['cos', 'cos', 'sin']) }; }, function (z) { var a = -z.m / z.k, s = solve(z.f, a); return gcd(Math.abs(z.m), z.k) === 1 && Math.abs(Math.abs(a) - 0.5) > 1e-9 && !(z.f === 'cos' && z.k === 4 && z.m === 1) && s.every(function (v) { return Math.abs(v - Math.floor(v) - 0.5) > 0.06; }); });
      var a = -z.m / z.k, sols = solve(z.f, a), ans = z.big ? Math.max(sols[0], sols[1]) : Math.min(sols[0], sols[1]), other = z.big ? Math.min(sols[0], sols[1]) : Math.max(sols[0], sols[1]);
      return nP('<b>Numerical response.</b> The ' + (z.big ? 'larger' : 'smaller') + ' solution of ' + t(z.k + fname(z.f) + '\\theta' + (z.m > 0 ? '+' : '-') + Math.abs(z.m) + '=0') + ', ' + t('0^\\circ\\le\\theta<360^\\circ') + ', to the nearest degree, is ____°.', ans, 0, { nr: true, alts: [{ v: other, code: LID + '-one-sol', hint: 'That is the ' + (z.big ? 'smaller' : 'larger') + ' solution.' }, { v: refFor(z.f, a), code: LID + '-gave-ref', hint: 'That is ' + t('\\theta_R') + '. Place it in the right quadrants.' }].concat(solve(z.f, -a).map(function (v) { return { v: v, code: LID + '-opp-sign', hint: 'Check the sign: ' + t(fname(z.f) + '\\theta=' + fracTex(-z.m, z.k)) + '.' }; })),
        sol: t(fname(z.f) + '\\theta=' + fracTex(-z.m, z.k)) + (isRat(a) && rd(a, 4) === a ? t('=' + nT(a)) : '') + ', ' + solveSol(z.f, a, 1) + ' ' + (z.big ? 'Larger' : 'Smaller') + ': ' + t(Dx(ans, 0)) + '.', hints: ['Isolate ' + t(fname(z.f) + '\\theta') + ', find both solutions, then choose.'], text: 'NR: one solution of a linear equation', v: { k: 'set1', f: z.f, a: a, big: z.big } });
    } }] },
    { num: '15', section: 'C. Written Response', shared: function (r) { return { p: rootPt(r, [2, 3, 4], [[-2, 5], [4, -6], [-1, -3]], 7), refl: r.pick(['origin', 'origin', 'y', 'x']) }; }, stem: function (z) { return 'The point ' + t('P(' + z.p[0] + ',' + z.p[1] + ')') + ' is on the terminal arm of angle ' + t('\\theta') + ', ' + t('0^\\circ\\le\\theta<360^\\circ') + '.'; }, parts: [
      { id: 'e15a', level: 'PRG', outcome: 'T2', make: function (r, z) { var R = ratioSpecs(z.p[0], z.p[1], false); return fP('Sketch ' + t('\\theta') + ' in standard position. Determine the exact values of ' + t('\\sin\\theta') + ', ' + t('\\cos\\theta') + ' and ' + t('\\tan\\theta') + '.', R.specs, { sol: armFig(z.p[0], z.p[1]) + ratioSol(z.p[0], z.p[1]), hints: [t('r=\\sqrt{x^2+y^2}') + '. Rationalizing is optional.'], text: 'exact ratios from a point', v: { k: 'ratios', x: z.p[0], y: z.p[1] } }); } },
      { id: 'e15b', level: 'EMG', outcome: 'T2', make: function (r, z) { var th = ptAngle(z.p[0], z.p[1]); return deg('Determine ' + t('\\theta') + ' to the nearest tenth of a degree.', th, 1, { alts: ptAlts(z.p[0], z.p[1]), sol: ptSol(z.p[0], z.p[1], 1), hints: ['Quadrant first, then ' + t('\\theta_R=\\tan^{-1}\\left|\\dfrac{y}{x}\\right|') + '.'], text: 'angle from a point', v: { k: 'ptang', x: z.p[0], y: z.p[1], dp: 1 } }); } },
      { id: 'e15c', level: 'PRG', outcome: 'T1', make: function (r, z) {
        var x = z.p[0], y = z.p[1], th = ptAngle(x, y), R0 = rd(atn(Math.abs(y / x)), 1), Q = z.refl === 'origin' ? [-x, -y] : z.refl === 'y' ? [-x, y] : [x, -y], ang = ptAngle(Q[0], Q[1]), q = quadOf(ang);
        var nm = { origin: 'the origin', y: 'the y-axis', x: 'the x-axis' }[z.refl], rat = z.refl === 'origin' ? 'sin' : z.refl === 'y' ? 'cos' : 'sin';
        return deg(t('P') + ' is reflected in ' + nm + ' to ' + t('Q(' + Q[0] + ',' + Q[1] + ')') + '. Determine, to the nearest tenth of a degree, the angle in standard position whose terminal arm passes through ' + t('Q') + '.', ang, 1, { acc: [fromRef(q, R0)],
          alts: [{ v: th, code: LID + '-reflect', hint: 'That is the angle for ' + t('P') + '. ' + t('Q') + ' is in quadrant ' + QN[q] + '.' }, { v: atn(Math.abs(y / x)), code: LID + '-gave-ref', hint: 'That is the reference angle. ' + t('Q') + ' is in quadrant ' + QN[q] + '.' }].concat([2, 3, 4, 1].filter(function (k) { return k !== q && k !== quadOf(th); }).map(function (k) { return { v: fromRef(k, atn(Math.abs(y / x))), code: LID + '-reflect', hint: 'Locate ' + t('Q(' + Q[0] + ',' + Q[1] + ')') + ': it is in quadrant ' + QN[q] + '.' }; })),
          sol: t('Q') + ' is in quadrant ' + QN[q] + ' with the same reference angle ' + t(Dx(R0, 1)) + ': ' + t('\\theta=' + placeTex(q, R0, 1)) + (z.refl === 'origin' ? ' (also ' + t('\\theta+180^\\circ') + ')' : '') + '.<br>Both points have ' + t('r=\\sqrt{' + (x * x + y * y) + '}') + ', but ' + (z.refl === 'y' ? 'the ' + t('x') + '-coordinate changed sign, so ' + t('\\cos=\\frac{x}{r}') + ' and ' + t('\\tan') + ' change sign while ' + t('\\sin') + ' stays the same.' : 'the ' + t('y') + '-coordinate changed sign, so ' + t('\\sin=\\frac{y}{r}') + ' changes sign' + (z.refl === 'origin' ? ' (and so does ' + t('\\cos') + '; ' + t('\\tan') + ' stays the same).' : ' (and so does ' + t('\\tan') + ').')),
          hints: ['Reflecting keeps the reference angle; only the quadrant changes.'], text: 'reflection of a point: new angle' });
      } }] },
    { num: '16', stem: function () { return '<b>No calculator.</b>'; }, parts: [
      { id: 'e16a', level: 'PRG', outcome: 'T2', make: function (r) { var o = otherTwo(r, { kind: 'cond', f: r.pick(['cos', 'sin']), avoid: function (z) { return (z.f === 'cos' && z.x === -2 && z.r === 3 && z.q === 2) || (z.f === 'cos' && z.x === 3 && z.r === 8); } }); return fP('Given ' + o.giv + ', determine the exact values of the other two primary ratios.', o.specs, { sol: o.sol, hints: ['The two signs give the quadrant (CAST). Then sketch the triangle.'], text: 'other two ratios from one ratio and a sign', v: { k: 'other', z: o.z } }); } },
      { id: 'e16bi', sub: 'b i', level: 'EMG', outcome: 'T2', make: function (r) {
        var z = pickWhere(function () { var f = r.pick(['sin', 'cos', 'tan']), fm = r.pick(f === 'tan' ? LIN_T : LIN_SC); return { f: f, k: fm[0], m: fm[1], v: fm[2], neg: false }; }, function (z) { return !(z.f === 'cos' && z.k === '2' && z.m === '1'); });
        return exSolveP(linTex(z.k, z.f, z.m, false), z.f, z.v, 'exact solve: positive value', z);
      } },
      { id: 'e16bii', sub: 'b ii', level: 'ADV', outcome: 'T2', make: function (r) {
        var z = r.pick([['\\tan^2\\theta=1', 'tan', 1, 45], ['3\\tan^2\\theta=1', 'tan', Math.sqrt(3) / 3, 30], ['4\\sin^2\\theta=1', 'sin', 0.5, 30], ['4\\sin^2\\theta-3=0', 'sin', Math.sqrt(3) / 2, 60], ['2\\sin^2\\theta=1', 'sin', Math.SQRT2 / 2, 45], ['4\\cos^2\\theta=1', 'cos', 0.5, 60], ['4\\cos^2\\theta-3=0', 'cos', Math.sqrt(3) / 2, 30], ['2\\cos^2\\theta-1=0', 'cos', Math.SQRT2 / 2, 45], ['\\tan^2\\theta-3=0', 'tan', Math.sqrt(3), 60]]);
        var k = z[3], vals = [k, 180 - k, 180 + k, 360 - k], pos = solve(z[1], z[2]).map(Math.round), negS = solve(z[1], -z[2]).map(Math.round);
        return angP(t(z[0]), vals, 0, { ref: k, xc: [], setDiag: function (got, m) { var gs = got.slice().sort(function (a, b) { return a - b; }); if (gs.length === 2 && (gs.every(function (v) { return pos.some(function (x) { return m(v, x); }); }) || gs.every(function (v) { return negS.some(function (x) { return m(v, x); }); }))) return { code: LID + '-sq-pos', hint: 'Taking the square root gives <b>two</b> equations: ' + t(fname(z[1]) + '\\theta=' + valTex(z[2])) + ' or ' + t(fname(z[1]) + '\\theta=' + valTex(-z[2])) + '. Solve both.' }; return null; },
          missHint: t(fname(z[1]) + '\\theta=\\pm ' + magTex(z[2])) + ': the reference angle appears in all four quadrants.',
          sol: t(fname(z[1]) + '^2\\theta=' + ratTex(z[2] * z[2]) + '\\Rightarrow ' + fname(z[1]) + '\\theta=\\pm ' + magTex(z[2])) + '. ' + t('\\theta_R=' + D(k)) + ' in all four quadrants: ' + t(angTex(vals, 0)) + '.', hints: ['Isolate the square, then take the square root: don’t forget ' + t('\\pm') + '.'], text: 'exact solve: squared ratio', v: { k: 'sq', f: z[1], a: z[2] } });
      } },
      { id: 'e16c', sub: 'c', level: 'ADV', outcome: 'T2', make: function (r) {
        var z = pickWhere(function () { return { t1: { f: r.pick(['sin', 'cos', 'tan']), a: r.pick(SPEC) }, t2: { f: r.pick(['sin', 'cos', 'tan']), a: r.pick(SPEC) }, t3: { f: r.pick(['sin', 'cos']), a: r.pick([30, 45, 60, 135, 150, 210, 225, 300, 315]), sq: true } }; }, function (z) {
          var v1 = tv(z.t1), v2 = tv(z.t2), v3 = tv(z.t3); if (v1 === null || v2 === null) return false; var tot = v1 * v2 + v3; return isRat(v1 * v2) && Math.abs(tot) > 1e-9 && z.t1.a !== z.t2.a && !(z.t1.a === 120 && z.t2.a === 150 && z.t3.a === 45);
        });
        return comboP(z, 'sqprod');
      } }] },
    { num: '17', shared: function (r) {
      return pickWhere(function () { var A = r.int(30, 55), b = r.int(10, 20), h = b * sn(A); return { A: A, b: b, a: r.int(Math.ceil(h + 0.6), b - 1) }; }, function (z) { var h = z.b * sn(z.A); if (!(z.a > h + 0.5 && z.a < z.b)) return false; var s = ambSolve(z.A, z.a, z.b); return s.C2 >= 5 && Math.abs(s.B1 - Math.floor(s.B1) - 0.5) > 0.05 && Math.abs(h * 100 - Math.floor(h * 100) - 0.5) > 0.05 && !(z.A === 42 && z.b === 15); });
    }, stem: function (z) { return 'In ' + t('\\triangle ABC') + ', ' + t('\\angle A=' + D(z.A)) + ' and ' + t('b=' + z.b) + ' cm. The length of side ' + t('a') + ' can vary.'; }, parts: [
      { id: 'e17a', level: 'ADV', outcome: 'T3', make: function (r, z) {
        var h = z.b * sn(z.A);
        var p = fP('For what values of ' + t('a') + ' are there two triangles? (Give the lower boundary to the nearest hundredth.)', [
          { label: '', name: 'Lower boundary', kind: 'near', x: h, dp: 2, after: t('<a<'), alts: [{ v: z.b * cs(z.A), code: LID + '-alt-cos', hint: 'The lower boundary is the height ' + t('h=b\\sin A') + '.' }, { v: z.b * Math.sin(z.A), code: LID + '-radian', hint: 'Your calculator is in <b>radian</b> mode.' }] },
          { label: '', name: 'Upper boundary', kind: 'int', x: z.b, cands: [[rd(h, 2), LID + '-bound', 'Two triangles need ' + t('a') + ' shorter than ' + t('b') + ': the upper boundary is ' + t('b') + '.'], [rd(z.b * cs(z.A), 2), LID + '-bound', 'The upper boundary is ' + t('b') + ' itself.']] }],
          { sol: t('h=' + z.b + '\\sin ' + D(z.A) + '\\approx ' + fx(h, 2)) + ' cm. Two triangles when ' + t('h<a<b') + ': ' + t(fx(h, 2) + '<a<' + z.b) + '.', hints: ['Two triangles when ' + t('h<a<b') + ', with ' + t('h=b\\sin A') + '.'], text: 'ambiguous case: range for two triangles' });
        p.answer = t(fx(h, 2) + '<a<' + z.b) + ' (cm)';
        return p;
      } },
      { id: 'e17b', level: 'ADV', outcome: 'T3', make: function (r, z) { return ambBothP('Let ' + t('a=' + z.a) + ' cm. Solve both triangles (angles to the nearest degree, sides to the nearest tenth).' + ambFig(z, ambSolve(z.A, z.a, z.b)), z, 'ambiguous case: solve both'); } },
      { id: 'e17c', level: 'MAS', outcome: 'T3', make: function (r, z) {
        var s = ambSolve(z.A, z.a, z.b), A1 = 0.5 * z.b * s.c1 * sn(z.A), A2 = 0.5 * z.b * s.c2 * sn(z.A), dA = A1 - A2;
        return nP('With ' + t('a=' + z.a) + ' cm, determine the difference between the areas of the two triangles, to the nearest tenth of a square centimetre.', dA, 1, { after: t('\\text{cm}^2'), acc: [0.5 * z.b * (rd(s.c1, 2) - rd(s.c2, 2)) * sn(z.A)],
          alts: [{ v: A1 + A2, code: LID + '-area-sum', hint: 'The question asks for the <b>difference</b> of the areas.' }, { v: 2 * dA, code: LID + '-area-half', hint: t('\\text{Area}=\\frac{1}{2}bc\\sin A') + ': don’t forget the ' + t('\\frac{1}{2}') + '.' }, { v: A1, code: LID + '-area-one', hint: 'That is the area of triangle 1 only. Subtract the area of triangle 2.' }],
          sol: t('\\text{Area}=\\frac{1}{2}bc\\sin A') + ': ' + t('\\frac{1}{2}(' + z.b + ')(' + fx(s.c1, 2) + ')\\sin ' + D(z.A) + '\\approx ' + fx(A1, 1)) + ' and ' + t('\\frac{1}{2}(' + z.b + ')(' + fx(s.c2, 2) + ')\\sin ' + D(z.A) + '\\approx ' + fx(A2, 1)) + ' cm²<br>Difference ' + t('\\approx ' + fx(dA, 1)) + ' cm² (unrounded values)',
          hints: ['Both triangles share ' + t('b') + ' and ' + t('\\angle A') + ': ' + t('\\text{Area}=\\frac{1}{2}bc\\sin A') + ' with each ' + t('c') + '.'], text: 'ambiguous case: difference of areas', v: { k: 'ambarea', A: z.A, a: z.a, b: z.b } });
      } }] },
    { num: '18', shared: function (r) {
      return pickWhere(function () { return { d: r.int(60, 150), A: r.int(50, 80), B: r.int(50, 80) }; }, function (z) { var C = 180 - z.A - z.B, AC = z.d * sn(z.B) / sn(C); if (rd(0.5 * z.d * AC * sn(z.A), 0) !== rd(0.5 * z.d * rd(AC, 2) * sn(z.A), 0)) return false; return C >= 25 && z.A !== z.B && !(z.d === 85 && z.A === 58); });
    }, stem: function (z) {
      var C = 180 - z.A - z.B, AC = z.d * sn(z.B) / sn(C), Cx = AC * cs(z.A), Cy = AC * sn(z.A), m = z.d * 0.12;
      var svg = fig(HW.fig({ pts: { A: [0, 0], B: [z.d, 0], C: [Cx, Cy] }, segs: [['A', 'B', z.d + ' m'], ['A', 'C'], ['B', 'C']], angles: [['A', 'B', 'C', z.A + '°'], ['B', 'A', 'C', z.B + '°']], names: { A: 'A', B: 'B', C: 'C (tree)' }, extra: [{ type: 'ground', y: 0, x0: Math.min(0, Cx) - m, x1: Math.max(z.d, Cx) + m }, { type: 'dash', from: [Math.min(0, Cx) - m, Cy], to: [Math.max(z.d, Cx) + m, Cy] }], width: 270, aria: 'river with points A, B and a tree C, to scale' }));
      return 'Points ' + t('A') + ' and ' + t('B') + ' are ' + t(z.d) + ' m apart on one bank of a straight river. A tree ' + t('C') + ' stands on the opposite bank. ' + t('\\angle CAB=' + D(z.A)) + ' and ' + t('\\angle CBA=' + D(z.B)) + '.' + svg;
    }, parts: [
      { id: 'e18a', level: 'PRG', outcome: 'T3', make: function (r, z) {
        var C = 180 - z.A - z.B, AC = z.d * sn(z.B) / sn(C);
        return nP('Determine ' + t('AC') + ' to the nearest tenth of a metre. (Which law, and why?)', AC, 1, { unit: 'm', alts: [{ v: z.d * sn(C) / sn(z.B), code: LID + '-sl-flip', hint: t('\\dfrac{AC}{\\sin B}=\\dfrac{AB}{\\sin C}') + ': multiply by ' + t('\\sin B') + '.' }, { v: z.d * sn(z.B) / sn(z.A), code: LID + '-forgot-angle', hint: t('AB') + ' is opposite ' + t('\\angle C') + ', not ' + t('\\angle A') + '. Find ' + t('\\angle C') + ' first.' }, { v: z.d * Math.sin(z.B) / Math.sin(C), code: LID + '-radian', hint: 'Your calculator is in <b>radian</b> mode.' }],
          sol: t('\\angle ACB=180^\\circ-' + D(z.A) + '-' + D(z.B) + '=' + D(C)) + ', now opposite the known side ' + t('AB') + ': a full pair, so the sine law.<br>' + t('AC=\\dfrac{' + z.d + '\\sin ' + D(z.B) + '}{\\sin ' + D(C) + '}\\approx ' + fx(AC, 1)) + ' m', hints: ['Find ' + t('\\angle C') + ': then ' + t('AB') + ' and ' + t('\\angle C') + ' make a full pair.'], text: 'river: a side by sine law', v: { k: 'river', d: z.d, A: z.A, B: z.B, part: 'AC' } });
      } },
      { id: 'e18b', level: 'ADV', outcome: 'T3', make: function (r, z) {
        var C = 180 - z.A - z.B, AC = z.d * sn(z.B) / sn(C), w = AC * sn(z.A);
        return nP('Determine the width of the river, to the nearest tenth of a metre.', w, 1, { unit: 'm', acc: [rd(AC, 1) * sn(z.A), rd(AC, 2) * sn(z.A)], alts: [{ v: AC * cs(z.A), code: LID + '-alt-cos', hint: 'The width is <b>opposite</b> ' + t('\\angle A') + ' in the right triangle with hypotenuse ' + t('AC') + ': SOH.' }, { v: AC, code: LID + '-forgot-angle', hint: t('AC') + ' is slanted. The width is the perpendicular distance from ' + t('C') + ' to ' + t('AB') + '.' }, { v: z.d * sn(z.A), code: LID + '-opp-pair', hint: 'Use the side from ' + t('A') + ' to the tree, ' + t('AC') + ', as the hypotenuse.' }],
          sol: 'The width is the perpendicular distance from ' + t('C') + ' to ' + t('AB') + ' (a right triangle): ' + t(fx(AC, 2) + '\\sin ' + D(z.A) + '\\approx ' + fx(w, 1)) + ' m', hints: ['Drop a perpendicular from ' + t('C') + ' to ' + t('AB') + '. ' + t('AC') + ' is its hypotenuse.'], text: 'river: width', v: { k: 'river', d: z.d, A: z.A, B: z.B, part: 'w' } });
      } },
      { id: 'e18c', level: 'PRG', outcome: 'T3', make: function (r, z) {
        var C = 180 - z.A - z.B, AC = z.d * sn(z.B) / sn(C), ar = 0.5 * z.d * AC * sn(z.A);
        return nP('Determine the area of ' + t('\\triangle ABC') + ' to the nearest square metre.', ar, 0, { after: t('\\text{m}^2'), alts: [{ v: 2 * ar, code: LID + '-area-half', hint: t('\\text{Area}=\\frac{1}{2}ab\\sin C') + ': don’t forget the ' + t('\\frac{1}{2}') + '.' }, { v: 0.5 * z.d * AC * sn(z.B), code: LID + '-opp-pair', hint: 'Use the angle <b>between</b> the two sides: ' + t('AB') + ' and ' + t('AC') + ' meet at ' + t('A') + '.' }],
          sol: t('\\text{Area}=\\frac{1}{2}(' + z.d + ')(' + fx(AC, 2) + ')\\sin ' + D(z.A) + '\\approx ' + fx(ar, 0)) + ' m²', hints: [t('AB') + ' and ' + t('AC') + ' with the angle between them, ' + t('\\angle A') + '.'], text: 'river: area', v: { k: 'river', d: z.d, A: z.A, B: z.B, part: 'area' } });
      } }] }
  ];
  function valTexR(v, tx) { return /^-/.test(tx) ? tx.slice(1) : '-' + tx; }

  HW.defineLesson({ id: LID, unit: 3, num: '9', title: 'Unit 3 Review', outcome: 'T3', calc: true, questions: QUESTIONS, extra: EXTRA });
})(window);
