/* Math 20-1 · Unit 3 · Lesson 7 — The Ambiguous Case (outcome T3)
 * Assignment 7 (m201book unit3/u3_l07.tex, Questions 1–17) and the Lesson 7 Extra Practice (u3_ep07.tex: A. Skills 1–3,
 * B. Applying 4–10, C. Stretch 11–13). Every part is a generator (booklet idea, form and difficulty; new numbers; the
 * lesson's example numbers and the booklet's own excluded where feasible). Self-contained: no helpers from the other
 * Unit 3 lesson files.
 * Calculator allowed (degree mode). Rounded answers: the rounding is stated and the value rounded that way is accepted;
 * a later answer also accepts the value reached from the booklet's tenth-rounded intermediate (e.g. B ≈ 62.8°), while
 * one reached from an intermediate rounded to the nearest degree gets the "rounded too early" hint (the lesson's rule).
 * "All possible measures" answers are typed as a list of angles (any order, "no triangle" possible) and recognise only
 * the acute angle B₁ given (its own code and hint), an impossible obtuse angle kept, the sine law upside down, radian
 * mode, the third angle given, and "no triangle" said when there is one (and the reverse).
 * Conversions: 1 (explain with a sketch) -> a grid of the six SSA conditions (0/1/2) with the sketch in the solution;
 * 2 type of information -> multiple choice (SSS…SSA with "exactly one" / "not guaranteed"); 3(b), Extra 1 -> grids;
 * 4, Extra 8 (ranges of a) -> boundary boxes; 5, Extra 2 (0/1/2) -> multiple choice; 9(b) explain the error -> multiple
 * choice; Extra 12 "show that" -> multiple choice; sketches -> drawn to scale in the stem or the worked solution.
 * One keypad is registered for this file when the widgets are loaded: u3l7ang (comma, no triangle).
 * Levels: LIM BEG EMG PRG ADV MAS. Mastery: 14, Extra 11, Extra 13. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, B = K.P, F = HW.fmt, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, TR = HW.trig;
  var LID = 'u3l7';

  var CODES = {
    'u3l7-only-b1': 'Gave only the acute angle (missed the second triangle)', 'u3l7-amb-obtuse': 'Kept an impossible obtuse angle', 'u3l7-sl-flip': 'Sine law ratio upside down',
    'u3l7-radian': 'Calculator in radian mode', 'u3l7-no-tri': 'Gave angles when there is no triangle', 'u3l7-said-none': 'Said no triangle when there is one',
    'u3l7-third': 'Gave the third angle instead', 'u3l7-count': 'Wrong number of triangles', 'u3l7-type': 'Wrong type of information (SSS, SAS, ASA, AAS, SSA)',
    'u3l7-alt-cos': 'Height with cos instead of sin', 'u3l7-alt-div': 'Height: divided instead of multiplied', 'u3l7-bound': 'Wrong boundary value', 'u3l7-early': 'Rounded an angle too early',
    'u3l7-swap-tri': 'Mixed up the two triangles', 'u3l7-one-pos': 'Gave only one of the two positions', 'u3l7-half': 'Half the distance (to the foot of the height)', 'u3l7-sum': 'Added instead of subtracting',
    'u3l7-list-end': 'Included a boundary value', 'u3l7-list-miss': 'Missed some values', 'u3l7-list-extra': 'Included values outside the range', 'u3l7-diff-angle': 'Used the difference as the angle',
    'u3l7-explain': 'Wrong explanation', 'u3l7-wrong-pair': 'Used the wrong side–angle pair', 'u3l7-set': 'Wrong angles'
  };
  HW.addCodes(Object.keys(CODES).filter(function (k) { return !HW.CODES[k]; }).reduce(function (o, k) { o[k] = CODES[k]; return o; }, {}));
  HW.addPartial({ 'u3l7-only-b1': 's', 'u3l7-amb-obtuse': 's', 'u3l7-sl-flip': 'b', 'u3l7-radian': 's', 'u3l7-no-tri': 'b', 'u3l7-said-none': 'b', 'u3l7-third': 'b', 'u3l7-count': 'b',
    'u3l7-type': 'b', 'u3l7-alt-cos': 'b', 'u3l7-alt-div': 'b', 'u3l7-bound': 'b', 'u3l7-early': 's', 'u3l7-swap-tri': 's', 'u3l7-one-pos': 's', 'u3l7-half': 's', 'u3l7-sum': 'b',
    'u3l7-list-end': 's', 'u3l7-list-miss': 's', 'u3l7-list-extra': 'b', 'u3l7-diff-angle': 'b', 'u3l7-explain': 'b', 'u3l7-wrong-pair': 'b' });

  /* ---- keypad for this file (registered once the widgets are loaded; in node it is just a name) ---- */
  (function addKeys() {
    var W = HW.widgets; if (!W || !W.KEYSETS) return;
    function d(n) { return { label: String(n), tex: String(n), plain: String(n) }; }
    var del = { label: '⌫', fn: 'del', title: 'Delete' }, clr = { label: 'clear', fn: 'clear' }, lf = { label: '◀', fn: 'left', title: 'Move left' }, rt = { label: '▶', fn: 'right', title: 'Move right' };
    var ent = { label: 'Check ↵', fn: 'enter', wide: true }, dot = { label: '.', tex: '.', plain: '.' };
    if (!W.KEYSETS.u3l7ang) W.KEYSETS.u3l7ang = [[d(7), d(8), d(9), { label: ',', tex: ',\\ ', plain: ', ', title: 'Next angle' }, del], [d(4), d(5), d(6), dot, clr], [d(1), d(2), d(3), lf, rt],
      [d(0), { label: 'no triangle', tex: '\\text{no triangle}', plain: 'no triangle', title: 'No triangle has these measurements' }, ent]];
    if (W.KEYHELP) W.KEYHELP.u3l7ang = ['Type each possible angle in degrees, separated by commas (any order), e.g. ' + HW.k('59,\\ 121') + '. Press <b>no triangle</b> if there is none.',
      'Type the angles separated by commas, e.g. <code>59, 121</code>, or <code>no triangle</code>.'];
  })();

  /* ======================= helpers ======================= */
  function cl(x) { return Math.round(x * 1e9) / 1e9; }
  function nT(x) { x = cl(x); if (Math.abs(x) < 1e-12) x = 0; return F(x); }
  function rd(x, dp) { return K.roundTo(x, dp); }
  function fx(x, dp) { return F(rd(x, dp).toFixed(Math.max(dp, 0))); }
  function fs(x, dp) { return rd(x, dp).toFixed(Math.max(dp, 0)); } // plain, for figures and keys
  function pickWhere(gen, okf) { for (var i = 0; i < 8000; i++) { var o = gen(); if (okf(o)) return o; } throw new Error(LID + ': no valid numbers'); }
  function D(x) { return nT(x) + '^\\circ'; }
  function Dx(x, dp) { return fx(x, dp) + '^\\circ'; }
  function sn(d) { return TR.sin(d); } function cs(d) { return TR.cos(d); } function asn(v) { return TR.asin(v); }
  function low(n) { return n.toLowerCase(); }
  function fig(svg) { return '<div class="fig" style="text-align:center;margin:6px 0">' + svg + '</div>'; }
  function uniqBy(arr, key) { var s = {}; return arr.filter(function (x) { var k = key(x); if (s[k]) return false; s[k] = 1; return true; }); }
  function safeR(x, dp) { var f = x * Math.pow(10, dp); return Math.abs(f - Math.floor(f) - 0.5) > 0.08; } // not near a rounding boundary
  function dec1(r, a, b) { return r.int(Math.round(a * 10), Math.round(b * 10)) / 10; }
  var NAMES = [['A', 'B', 'C'], ['D', 'E', 'F'], ['P', 'Q', 'R'], ['K', 'L', 'M'], ['S', 'T', 'U'], ['X', 'Y', 'Z'], ['R', 'S', 'T'], ['U', 'V', 'W']];
  function sub(n, i) { return n + '_' + i; }
  function sub1(n, i) { return n + (i === 1 ? '₁' : '₂'); }

  /* ---- the SSA solver: given angle A, its opposite side a and the other side b (from the vertex of A);
   *      the unknown angle B is opposite b. sols: [{ B, C, c }] (acute B first) ---- */
  function ssa(A, a, b) {
    var h = b * sn(A), s = h / a, o = { A: A, a: a, b: b, h: h, s: s, sols: [] };
    if (s > 1 + 1e-12) { o.n = 0; return o; }
    if (s > 1 || Math.abs(s - 1) < 1e-9) s = 1;
    var B1 = asn(s), B2 = 180 - B1; o.B1 = B1; o.B2 = B2;
    [B1, B2].forEach(function (Bv, i) { if (i === 1 && Math.abs(B2 - B1) < 1e-9) return; if (A + Bv < 180 - 1e-9) { var C = 180 - A - Bv; o.sols.push({ B: Bv, C: C, c: a * sn(C) / sn(A) }); } });
    o.n = o.sols.length;
    return o;
  }
  function nTri(A, a, b) { return ssa(A, a, b).n; }

  /* ---- rounded numbers. o: alts [{v, code, hint}], acc (values also accepted), unit, nr, sol, hints, text, v ---- */
  function nP(prompt, x, dp, o) {
    o = o || {};
    var acc = (o.acc || []).filter(function (v) { return isFinite(v); });
    var alts = (o.alts || []).filter(function (a) { return a && isFinite(a.v) && !acc.some(function (v) { return Math.abs(rd(v, dp) - rd(a.v, dp)) < 1e-9; }); });
    var p = K.P.near(prompt, x, dp, { unit: o.unit, alts: alts, nr: o.nr, after: o.after }, o.sol, o.hints || [], o.text);
    var base = p.check;
    if (acc.length) p.check = function (resp) { var r0 = base(resp); if (r0.v === 'correct') return r0; var pn = HW.parse.number(String(resp == null ? '' : resp).trim()); if (pn.ok && acc.some(function (v) { return Math.abs(pn.value - rd(v, dp)) < 1e-9; })) return ok(); return r0; };
    p.bad = uniqBy(alts.map(function (a) { return fs(a.v, dp); }), function (s) { return s; }).filter(function (s) { return s !== p.key && Math.abs(Number(s) - x) > Math.pow(10, -dp) * 0.6 && !acc.some(function (v) { return fs(v, dp) === s; }); });
    if (o.v) p._v = o.v;
    return p;
  }
  function cdiag(c) { return function (v) { for (var i = 0; i < (c || []).length; i++) if (c[i] && isFinite(c[i][0]) && Math.abs(v - c[i][0]) < 1e-9) return { code: c[i][1], hint: c[i][2] }; return null; }; }
  /* several boxes. spec: { label, name, kind: 'near' | 'int', x, dp, alts, acc, cands, unit, after, before } */
  function fP(prompt, specs, o) {
    o = o || {};
    var fields = [], checks = [], keys = [], ans = [], bad = [];
    specs.forEach(function (s) {
      var aft = s.after != null ? s.after : s.unit;
      fields.push({ label: s.label, name: s.name || s.label, after: aft, before: s.before });
      if (s.kind === 'int') { checks.push(K.number(s.x, cdiag(s.cands))); keys.push(String(s.x)); ans.push((s.label ? s.label + ' ' : '') + t(nT(s.x) + (s.unit === '°' ? '^\\circ' : s.unit ? '\\text{ ' + s.unit + '}' : '')) + (s.after && !s.unit ? ' ' + s.after : '')); bad.push(String(s.x + 1)); }
      else { var q = nP('', s.x, s.dp, s); checks.push(q.check); keys.push(q.key); ans.push((s.label ? s.label + ' ' : '') + q.answer + (s.after && !s.unit ? ' ' + s.after : '')); bad.push(String(Number(q.key) + 1)); }
    });
    var p = B.fields(prompt, fields, checks, keys, ans.join('<br>'), o.sol, o.hints || [], o.text);
    if (o.swap) {
      var c0 = p.check;
      p.check = function (resp) { var r0 = c0(resp); if (r0.v === 'correct' || !resp || resp.length < 2) return r0; var sw = resp.slice(); var tmp = sw[0]; sw[0] = sw[1]; sw[1] = tmp; if (checks[0](sw[0]).v === 'correct' && checks[1](sw[1]).v === 'correct') return wrong('swap-answer', o.swapHint || 'Right numbers, but in each other’s boxes.'); return r0; };
      bad.length && (o.bad = (o.bad || []).concat([[keys[1], keys[0]].concat(keys.slice(2))]));
    }
    p.bad = [bad].concat(o.bad || []).filter(function (b) { return JSON.stringify(b) !== JSON.stringify(keys); });
    if (o.v) p._v = o.v;
    return p;
  }
  function mcP(r, prompt, opts, sol, hints, text, keepOrder, cols) {
    var seen = {}, out = [];
    opts.forEach(function (op) { var k = op.html.replace(/\s/g, ''); if (seen[k] && !op.right) return; seen[k] = 1; out.push(op); });
    var p = B.mc(r, prompt, out, sol, hints || [], text, keepOrder);
    if (cols) p.input.columns = cols;
    return p;
  }

  /* ---- "all possible measures" answers: a list of angles or "no triangle" ---- */
  function readAng(resp) {
    var s = String(resp == null ? '' : resp);
    s = s.replace(/\\left|\\right/g, '').replace(/\\(?:text|mathrm|operatorname|textrm)\{([^{}]*)\}/g, ' $1 ').replace(/\{,\}/g, ',').replace(/\^\{?\s*\\circ\s*\}?|\\circ|\\degree|°/g, ' ')
      .replace(/\\angle|∠/g, ' ').replace(/\\[,;:! ]|~|\\quad|\\qquad/g, ' ').replace(/[=≈]|\\approx/g, ' ').replace(/−/g, '-').replace(/\bdeg(rees)?\b/gi, ' ');
    var plain = s.replace(/[{}]/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
    if (!plain) return { empty: true };
    if (/^(no ?(triangles?|solutions?|such triangle)|none|dne|impossible|0 triangles|zero triangles|not possible)$/.test(plain)) return { none: true, vals: [], strs: [] };
    var bits = plain.replace(/\band\b|\bor\b|;/g, ',').split(/[,\s]+/).filter(Boolean).filter(function (b) { return !/^[a-z](_?[12])?$/.test(b); }), vals = [], strs = [];
    if (!bits.length) return { bad: plain };
    for (var i = 0; i < bits.length; i++) { var p = HW.parse.number(bits[i]); if (!p.ok) return { bad: bits[i] }; vals.push(p.value); strs.push(bits[i]); }
    return { vals: vals, strs: strs };
  }
  /* o: { vals (wanted, acute first), dp, xc: [[v, code, hint]], onlyHint, onlyObtHint, extraHint (impossible obtuse kept), noneHint, emptyHint, name } */
  function angChk(o) {
    var dp = o.dp || 0, want = o.vals.slice(), tol = Math.pow(10, -dp) * 0.6;
    function m(v, x) { return Math.abs(v - rd(x, dp)) < 1e-9 || Math.abs(v - x) <= tol; }
    return function (resp) {
      var R = readAng(resp);
      if (R.empty) return form('empty', 'Type your answer first.');
      if (R.bad) return form('unreadable', 'Type the angles as numbers separated by commas, e.g. ' + t('59,\\ 121') + ' (or press <b>no triangle</b>).');
      if (R.none) return want.length ? wrong(LID + '-said-none', o.noneHint) : ok();
      var got = R.vals, i, j;
      if (!want.length) return wrong(LID + '-no-tri', o.emptyHint);
      for (i = 0; i < got.length; i++) for (j = i + 1; j < got.length; j++) if (Math.abs(got[i] - got[j]) < 1e-9) return form('duplicate', 'You listed ' + t(nT(got[i]) + '^\\circ') + ' twice.');
      var used = {}, idx = got.map(function (v) { for (var k = 0; k < want.length; k++) if (!used[k] && m(v, want[k])) { used[k] = 1; return k; } return -1; });
      var nOk = idx.filter(function (k) { return k >= 0; }).length;
      if (nOk === want.length && got.length === want.length) {
        if (R.strs.some(function (s) { return (s.split('.')[1] || '').length > dp; })) return form('round', 'Right angles — now round each to the nearest ' + (dp === 0 ? 'degree' : dp === 1 ? 'tenth of a degree' : 'hundredth') + '.');
        return ok();
      }
      if (want.length === 2 && got.length === 1 && nOk === 1) return wrong(LID + '-only-b1', idx[0] === 0 ? o.onlyHint : o.onlyObtHint);
      if (want.length === 1 && nOk === 1 && got.length === 2 && o.extra != null && got.some(function (v) { return m(v, o.extra); })) return wrong(LID + '-amb-obtuse', o.extraHint);
      for (i = 0; i < got.length; i++) if (idx[i] < 0) for (j = 0; j < (o.xc || []).length; j++) { var c = o.xc[j]; if (isFinite(c[0]) && m(got[i], c[0]) && !want.some(function (x) { return m(c[0], x); })) return wrong(c[1], c[2]); }
      if (want.length === 2 && nOk === 1) return wrong(LID + '-set', 'One of your angles is right. The other possible angle is ' + t('180^\\circ') + ' minus the acute one.');
      return wrong(LID + '-set', nOk ? 'Some of your angles are right. Check the others.' : null);
    };
  }
  function angKey(vals, dp) { return vals.length ? vals.map(function (v) { return fs(v, dp); }).join(', ') : '\\text{no triangle}'; }
  /* the angle list part for an SSA unknown. nm = { V (given angle), W (end of the known side), X (the unknown angle) }; S = ssa(); dp; o: prompt bits */
  function ssaAngP(prompt, S, nm, dp, o) {
    o = o || {};
    var vals = S.sols.map(function (s) { return s.B; }), X = nm.X, V = nm.V, W = nm.W, pre = o.pre || '';
    var flip = S.a * sn(S.A) / S.b, radv = S.b * Math.sin(S.A) / S.a, xc = [];
    if (flip <= 1) { xc.push([asn(flip), LID + '-sl-flip', 'Sine law: ' + t('\\dfrac{\\sin ' + X + '}{' + low(X) + '}=\\dfrac{\\sin ' + V + '}{' + low(V) + '}') + ', so ' + t('\\sin ' + X + '=\\dfrac{' + low(X) + '\\sin ' + V + '}{' + low(V) + '}') + ': the side opposite ' + t('\\angle ' + X) + ' goes on top.']); xc.push([180 - asn(flip), LID + '-sl-flip', t('\\sin ' + X + '=\\dfrac{' + low(X) + '\\sin ' + V + '}{' + low(V) + '}') + ' (the side opposite ' + t('\\angle ' + X) + ' on top).']); }
    if (Math.abs(radv) <= 1) xc.push([asn(Math.abs(radv)), LID + '-radian', 'Your calculator is in <b>radian</b> mode. Switch to degree mode.']);
    S.sols.forEach(function (s) { xc.push([s.C, LID + '-third', 'That is ' + t('\\angle ' + W) + ', the third angle. The question asks for ' + t('\\angle ' + X) + '.']); });
    var two = S.n === 2, sT = t('\\sin ' + X + '=\\dfrac{' + nT(S.b) + '\\sin ' + D(S.A) + '}{' + nT(S.a) + '}' + (S.s > 1 ? '\\approx ' + fx(S.s, 3) : '\\approx ' + fx(S.s, 4)));
    var p = {
      prompt: prompt, input: { type: 'math', keys: 'u3l7ang', before: t('\\angle ' + X + '='), placeholder: 'e.g. 59, 121' },
      check: angChk({ vals: vals, dp: dp, xc: xc, extra: S.n === 1 && S.B2 != null && Math.abs(S.B2 - S.B1) > 1e-6 ? S.B2 : null,
        onlyHint: t(Dx(S.B1, dp)) + ' is the acute angle your calculator gives. There is a second triangle: ' + t('\\angle ' + X + '=180^\\circ-' + Dx(S.B1, 1) + '=' + Dx(S.B2, 1)) + ' also fits, because ' + t(D(S.A) + '+' + Dx(S.B2, 1) + '<180^\\circ') + '. List both.',
        onlyObtHint: 'The obtuse angle works, but so does the acute one, ' + t('\\sin^{-1}(' + fx(S.s, 4) + ')') + '. List both.',
        extraHint: S.B2 != null ? t('180^\\circ-' + Dx(S.B1, 1) + '=' + Dx(S.B2, 1)) + ' is impossible: ' + t(D(S.A) + '+' + Dx(S.B2, 1) + '>180^\\circ') + '. Only one triangle.' : '',
        noneHint: (S.s < 1 ? t('\\sin ' + X + '\\approx ' + fx(S.s, 4)) + ' is less than ' + t('1') : t('\\sin ' + X + '=1')) + ', so at least one triangle exists. Find ' + t('\\angle ' + X) + ' with ' + t('\\sin^{-1}') + '.',
        emptyHint: sT + (S.s > 1 ? ', which is greater than ' + t('1') + '. No angle has a sine greater than ' + t('1') + ', so there is no triangle (press <b>no triangle</b>).' : '.') }),
      key: angKey(vals, dp), answer: t(vals.length ? '\\angle ' + X + '\\approx ' + vals.map(function (v) { return Dx(v, dp); }).join('\\text{ or }') : '\\text{no triangle}'),
      solution: pre + ssaWhy(S, nm) + '<br>' + sT + (S.n ? ' ' + t('\\Rightarrow\\angle ' + X + '\\approx ' + Dx(S.B1, 1)) + (two ? ' or ' + t('180^\\circ-' + Dx(S.B1, 1) + '=' + Dx(S.B2, 1)) + ' (' + t(D(S.A) + '+' + Dx(S.B2, 1) + '<180^\\circ') + ' ✓)' : S.B2 - S.B1 > 1e-6 ? ' (' + t(Dx(S.B2, 1)) + ' is rejected: ' + t(D(S.A) + '+' + Dx(S.B2, 1) + '>180^\\circ') + ')' : '') + '.<br>' + t('\\angle ' + X + '\\approx ' + vals.map(function (v) { return Dx(v, dp); }).join('\\text{ or }')) : ', which is greater than ' + t('1') + ': <b>no triangle</b>.') + (o.post || '') + (o.fig === false ? '' : ambFig(S, nm, o.lab)),
      hints: o.hints || ['Sine law: ' + t('\\sin ' + X + '=\\dfrac{' + low(X) + '\\sin ' + V + '}{' + low(V) + '}') + '. If that is more than ' + t('1') + ', there is no triangle.', 'The second possible angle is ' + t('180^\\circ-\\angle ' + X) + '. Keep it only if the angles still add to less than ' + t('180^\\circ') + '.'],
      text: o.text,
      bad: (function () { var b = []; if (two) b.push(fs(S.B1, dp)); if (S.n === 1 && S.B2 - S.B1 > 1e-6) b.push(fs(S.B1, dp) + ', ' + fs(S.B2, dp)); b.push(S.n ? '\\text{no triangle}' : '45'); return b; })()
    };
    p._v = { k: 'ssa-ang', A: S.A, a: S.a, b: S.b, dp: dp };
    return p;
  }
  /* why 0 / 1 / 2: S = ssa(); nm = { V, W, X } (side opposite V is WX = a, side VW = b) */
  function ssaWhy(S, nm) {
    var a = nT(S.a), b = nT(S.b);
    if (S.A >= 90) return t('\\angle ' + nm.V + '=' + D(S.A)) + ' is ' + (S.A > 90 ? 'obtuse' : 'right') + ' and ' + t(S.a > S.b ? a + '>' + b : a + '\\le ' + b) + ': ' + (S.a > S.b ? 'one triangle.' : 'no triangle.');
    var h = t('h=' + b + '\\sin ' + D(S.A) + '\\approx ' + fx(S.h, 2));
    if (S.a >= S.b) return t(a + '\\ge ' + b) + ' (the side opposite the given angle is the longer one): one triangle.';
    if (S.a < S.h - 1e-9) return h + ' and ' + t(a + '<' + fx(S.h, 2)) + ': the side is too short to reach, no triangle.';
    if (Math.abs(S.a - S.h) < 1e-9) return h + ' and ' + t('a=h') + ': one right triangle.';
    return h + '; ' + t(fx(S.h, 2) + '<' + a + '<' + b) + ': two triangles.';
  }
  /* to-scale sketch of SSA: given angle at V, known side VW, swinging side from W landing at X on the other arm */
  function ambFig(S, nm, lab) {
    lab = lab || {};
    var W = [S.b * cs(S.A), S.b * sn(S.A)], pts = { V: [0, 0], W: W }, names = { V: nm.V, W: nm.W }, segs = [], extra = [];
    var far = S.sols.length ? Math.max.apply(null, S.sols.map(function (s) { return s.c; })) : Math.max(W[0], 0) + S.a * 0.6;
    pts.E = [Math.max(far, W[0], S.b * 0.4) + S.b * 0.3, 0]; names.E = '';
    segs.push(['V', 'E']); segs.push(['V', 'W', lab.b || nT(S.b) + (lab.u ? ' ' + lab.u : '')]);
    S.sols.forEach(function (s, i) { var k = 'X' + i; pts[k] = [s.c, 0]; names[k] = S.sols.length > 1 ? sub1(nm.X, i + 1) : nm.X; segs.push(['W', k, i === 0 ? (lab.a || nT(S.a) + (lab.u ? ' ' + lab.u : '')) : undefined, i ? { dash: true } : undefined]); });
    if (!S.sols.length) { pts.H = [W[0], W[1] - S.a]; names.H = ''; segs.push(['W', 'H', lab.a || nT(S.a) + (lab.u ? ' ' + lab.u : ''), { dash: true, color: '#b03a2e' }]); extra.push({ type: 'dash', from: W, to: [W[0], 0] }); }
    else if (S.A < 90) extra.push({ type: 'dash', from: W, to: [W[0], 0] });
    if (S.A >= 90) { pts.E2 = [Math.min(W[0], 0) - S.b * 0.25, 0]; names.E2 = ''; extra.push({ type: 'dash', from: pts.E2, to: [0, 0] }); }
    return fig(HW.fig({ pts: pts, segs: segs, names: names, angles: [['V', 'E', 'W', nT(S.A) + '°']], extra: extra, width: 280, height: 210, aria: 'the swinging side, to scale' }));
  }
  /* a triangle to scale from SSA: given angle at V, VW = b, VX = c */
  function triFig(nm, A, b, c, lab, o) {
    o = o || {};
    var pts = {}; pts[nm[0]] = [0, 0]; pts[nm[1]] = [c, 0]; pts[nm[2]] = [b * cs(A), b * sn(A)];
    var segs = [[nm[1], nm[2], lab.a], [nm[0], nm[2], lab.b], [nm[0], nm[1], lab.c]].map(function (s) { return s[2] == null ? [s[0], s[1]] : s; });
    var angs = [];
    if (lab.A) angs.push([nm[0], nm[1], nm[2], lab.A]); if (lab.B) angs.push([nm[1], nm[0], nm[2], lab.B]); if (lab.C) angs.push([nm[2], nm[0], nm[1], lab.C]);
    return fig(HW.fig({ pts: pts, segs: segs, angles: angs, width: o.width || 260, height: o.height || 200, extra: o.extra, aria: o.aria || 'triangle drawn to scale' }));
  }
  function same3(A, a, b, list) { return (list || []).some(function (l) { return Math.abs(l[0] - A) < 1e-9 && Math.abs(l[1] - a) < 1e-9 && Math.abs(l[2] - b) < 1e-9; }); }
  /* example and booklet numbers to avoid (angle, opposite side, other side) */
  var AVOID = [[40, 7, 10], [38, 9, 13], [47, 15, 11], [62, 8, 10], [108, 20, 14], [22, 8, 15], [28, 3.5, 6], [34, 6.2, 9.5], [71, 12.4, 9.8], [39, 26, 35], [48, 11, 14], [124, 19, 12], [124, 10, 12],
    [30, 8, 11], [25, 8, 14], [35, 3, 4], [40, 8, 10], [46, 9, 12], [33, 10, 16], [44, 13, 16], [75, 9.2, 8.4], [52, 5, 7.5], [36, 15, 21], [131, 25, 16], [29, 6, 10], [48, 1.8, 2.2], [54, 8.5, 10], [27, 5, 9],
    [64, 10.2, 8.5], [33, 5.4, 9], [118, 7, 9], [55, 6, 8], [57, 7.5, 6.1], [24, 4.8, 10.5], [100, 7.3, 8.1]];

  /* a case for "how many triangles": kind 'one' | 'two' | 'none' | 'obt-none' | 'obt-one'; 1-decimal sides when dec */
  function ssaCase(r, kind, dec) {
    return pickWhere(function () {
      var A, a, b, v = function (lo, hi) { return dec ? dec1(r, lo, hi) : r.int(Math.ceil(lo), Math.floor(hi)); };
      if (kind === 'obt-none' || kind === 'obt-one') { A = r.int(96, 140); b = v(5, 14); a = kind === 'obt-one' ? b + v(0.6, 5) : b - v(0.4, 3); }
      else if (kind === 'one') { A = r.int(30, 80); b = v(5, 13); a = b + v(0.4, 4); }
      else { A = r.int(22, 66); b = v(6, 15); var h = b * sn(A); a = kind === 'none' ? v(Math.max(1, h - 1.5), h - 0.3) : v(h + 0.35, b - 0.35); }
      return { A: A, a: rd(a, 1), b: rd(b, 1), kind: kind };
    }, function (z) { if (z.a <= 0.5 || z.b <= 0.5 || same3(z.A, z.a, z.b, AVOID)) return false; var n = nTri(z.A, z.a, z.b); return n === (kind === 'two' ? 2 : kind === 'one' || kind === 'obt-one' ? 1 : 0) && Math.abs(z.a - z.b * sn(z.A)) > 0.2 && z.A !== 90; });
  }
  function caseMC(r, z, nm, text) {
    var S = ssa(z.A, z.a, z.b), n = S.n, V = nm[0], X = nm[1], W = nm[2];
    var desc = t('\\triangle ' + nm.join('') + ':\\ \\angle ' + V + '=' + D(z.A) + ',\\ ' + low(V) + '=' + nT(z.a) + ',\\ ' + low(X) + '=' + nT(z.b));
    var why = z.A > 90 ? t('\\angle ' + V) + ' is obtuse: compare ' + t(low(V)) + ' with ' + t(low(X)) + ' only.' : 'Compare ' + t(low(V)) + ' with ' + t(low(X)) + ', and with the height ' + t('h=' + low(X) + '\\sin ' + V) + '.';
    return mcP(r, 'Without using the sine law, decide how many triangles are possible. ' + desc, [0, 1, 2].map(function (k) { return { html: '<b>' + k + '</b> triangle' + (k === 1 ? '' : 's'), right: k === n, why: why, code: 'n' + k }; }),
      ssaWhy(S, { V: V, W: W, X: X }) + ambFig(S, { V: V, W: W, X: X }), ['Acute angle: ' + t('a<h') + ' none, ' + t('a=h') + ' one (right), ' + t('h<a<b') + ' two, ' + t('a\\ge b') + ' one.', 'Obtuse angle: ' + t('a\\le b') + ' none, ' + t('a>b') + ' one.'], text, true, 3);
  }
  /* solve both triangles: nm = { V, W, X }; the fields are ∠X₁, ∠W₁, side VX₁ (= w₁), then the same for triangle 2 */
  function bothP(prompt, S, nm, unit, o) {
    o = o || {};
    var X = nm.X, W = nm.W, V = nm.V, w = low(W), s1 = S.sols[0], s2 = S.sols[1];
    function early(Bv) { return S.a * sn(180 - S.A - rd(Bv, 0)) / sn(S.A); }
    function tenth(Bv) { return S.a * sn(180 - S.A - rd(Bv, 1)) / sn(S.A); }
    var eH = 'Keep the unrounded angle in the calculator: rounding ' + t('\\angle ' + W) + ' to the nearest degree first changes the side.';
    var flip1 = S.a * sn(S.A) / sn(s1.C);
    var specs = [
      { label: t('\\angle ' + sub(X, 1) + '='), name: t('\\angle ' + sub(X, 1)) + ' (acute)', kind: 'near', x: s1.B, dp: 0, unit: '°', alts: [{ v: s2.B, code: LID + '-swap-tri', hint: 'Put the <b>acute</b> angle in triangle 1 and the obtuse one in triangle 2.' }, { v: S.a * sn(S.A) / S.b <= 1 ? asn(S.a * sn(S.A) / S.b) : NaN, code: LID + '-sl-flip', hint: t('\\sin ' + X + '=\\dfrac{' + low(X) + '\\sin ' + V + '}{' + low(V) + '}') + '.' }] },
      { label: t('\\angle ' + sub(W, 1) + '='), name: t('\\angle ' + sub(W, 1)), kind: 'near', x: s1.C, dp: 0, unit: '°', acc: [180 - S.A - rd(s1.B, 1)], alts: [{ v: s2.C, code: LID + '-swap-tri', hint: 'Triangle 1 uses the acute ' + t('\\angle ' + sub(X, 1)) + ': ' + t('\\angle ' + sub(W, 1) + '=180^\\circ-\\angle ' + V + '-\\angle ' + sub(X, 1)) + '.' }] },
      { label: t(sub(w, 1) + '='), name: t(sub(w, 1)), kind: 'near', x: s1.c, dp: 1, unit: unit, acc: [tenth(s1.B)], alts: [{ v: early(s1.B), code: LID + '-early', hint: eH }, { v: s2.c, code: LID + '-swap-tri', hint: 'That is ' + t(sub(w, 2)) + '. Triangle 1 has the larger ' + t('\\angle ' + W) + ', so the longer side.' }, { v: flip1, code: LID + '-sl-flip', hint: t(w + '=\\dfrac{' + low(V) + '\\sin ' + W + '}{\\sin ' + V + '}') + '.' }] },
      { label: t('\\angle ' + sub(X, 2) + '='), name: t('\\angle ' + sub(X, 2)) + ' (obtuse)', kind: 'near', x: s2.B, dp: 0, unit: '°', alts: [{ v: s1.B, code: LID + '-swap-tri', hint: 'Triangle 2 has the obtuse angle ' + t('\\angle ' + sub(X, 2) + '=180^\\circ-\\angle ' + sub(X, 1)) + '.' }] },
      { label: t('\\angle ' + sub(W, 2) + '='), name: t('\\angle ' + sub(W, 2)), kind: 'near', x: s2.C, dp: 0, unit: '°', acc: [180 - S.A - rd(s2.B, 1)], alts: [{ v: s1.C, code: LID + '-swap-tri', hint: 'Triangle 2 uses the obtuse ' + t('\\angle ' + sub(X, 2)) + '.' }] },
      { label: t(sub(w, 2) + '='), name: t(sub(w, 2)), kind: 'near', x: s2.c, dp: 1, unit: unit, acc: [tenth(s2.B)], alts: [{ v: early(s2.B), code: LID + '-early', hint: eH }, { v: s1.c, code: LID + '-swap-tri', hint: 'That is ' + t(sub(w, 1)) + '. Use ' + t('\\angle ' + sub(W, 2)) + '.' }] }];
    var sol = ssaWhy(S, nm) + '<br>' + t('\\sin ' + X + '=\\dfrac{' + nT(S.b) + '\\sin ' + D(S.A) + '}{' + nT(S.a) + '}\\approx ' + fx(S.s, 4) + '\\Rightarrow ' + sub(X, 1) + '\\approx ' + Dx(s1.B, 1) + ',\\ ' + sub(X, 2) + '=180^\\circ-' + Dx(s1.B, 1) + '=' + Dx(s2.B, 1)) +
      '<br>Triangle 1: ' + t(sub(W, 1) + '=180^\\circ-' + D(S.A) + '-' + Dx(s1.B, 1) + '=' + Dx(s1.C, 1)) + ', ' + t(sub(w, 1) + '=\\dfrac{' + nT(S.a) + '\\sin ' + Dx(s1.C, 1) + '}{\\sin ' + D(S.A) + '}\\approx ' + fx(s1.c, 1)) + ' ' + unit + '. So ' + t('\\angle ' + X + '\\approx ' + Dx(s1.B, 0) + ',\\ \\angle ' + W + '\\approx ' + Dx(s1.C, 0) + ',\\ ' + w + '\\approx ' + fx(s1.c, 1)) + ' ' + unit + '.' +
      '<br>Triangle 2: ' + t(sub(W, 2) + '=180^\\circ-' + D(S.A) + '-' + Dx(s2.B, 1) + '=' + Dx(s2.C, 1)) + ', ' + t(sub(w, 2) + '=\\dfrac{' + nT(S.a) + '\\sin ' + Dx(s2.C, 1) + '}{\\sin ' + D(S.A) + '}\\approx ' + fx(s2.c, 1)) + ' ' + unit + '. So ' + t('\\angle ' + X + '\\approx ' + Dx(s2.B, 0) + ',\\ \\angle ' + W + '\\approx ' + Dx(s2.C, 0) + ',\\ ' + w + '\\approx ' + fx(s2.c, 1)) + ' ' + unit + '.' + ambFig(S, nm, { u: unit });
    return fP(prompt, specs, { sol: sol, hints: ['Count the triangles first with ' + t('h=' + low(X) + '\\sin ' + V) + '. Then the sine law gives ' + t('\\sin ' + X) + '.', 'The two values are ' + t('\\angle ' + sub(X, 1)) + ' (acute) and ' + t('180^\\circ-\\angle ' + sub(X, 1)) + '. Finish each triangle: third angle, then the third side with the sine law.'], text: o.text, v: { k: 'ssa-both', A: S.A, a: S.a, b: S.b } });
  }
  /* one triangle (given angle obtuse, or opposite side longer): ∠X, ∠W, side w */
  function oneP(prompt, S, nm, unit, o) {
    o = o || {};
    var X = nm.X, W = nm.W, V = nm.V, w = low(W), s1 = S.sols[0];
    var specs = [
      { label: t('\\angle ' + X + '='), name: t('\\angle ' + X), kind: 'near', x: s1.B, dp: 0, unit: '°', alts: [{ v: 180 - s1.B, code: LID + '-amb-obtuse', hint: t('180^\\circ-' + Dx(s1.B, 1)) + ' is impossible beside ' + t(D(S.A)) + ': the angles would add to more than ' + t('180^\\circ') + '.' }, { v: S.a * sn(S.A) / S.b <= 1 ? asn(S.a * sn(S.A) / S.b) : NaN, code: LID + '-sl-flip', hint: t('\\sin ' + X + '=\\dfrac{' + low(X) + '\\sin ' + V + '}{' + low(V) + '}') + '.' }, { v: asn(Math.min(1, Math.abs(S.b * Math.sin(S.A) / S.a))), code: LID + '-radian', hint: 'Your calculator is in <b>radian</b> mode.' }] },
      { label: t('\\angle ' + W + '='), name: t('\\angle ' + W), kind: 'near', x: s1.C, dp: 0, unit: '°', acc: [180 - S.A - rd(s1.B, 1)] },
      { label: t(w + '='), name: t(w), kind: 'near', x: s1.c, dp: 1, unit: unit, acc: [S.a * sn(180 - S.A - rd(s1.B, 1)) / sn(S.A)], alts: [{ v: S.a * sn(180 - S.A - rd(s1.B, 0)) / sn(S.A), code: LID + '-early', hint: 'Keep the unrounded angle in the calculator: rounding ' + t('\\angle ' + W) + ' to the nearest degree first changes the side.' }, { v: S.a * sn(S.A) / sn(s1.C), code: LID + '-sl-flip', hint: t(w + '=\\dfrac{' + low(V) + '\\sin ' + W + '}{\\sin ' + V + '}') + '.' }] }];
    var sol = ssaWhy(S, nm) + '<br>' + t('\\sin ' + X + '=\\dfrac{' + nT(S.b) + '\\sin ' + D(S.A) + '}{' + nT(S.a) + '}\\approx ' + fx(S.s, 4) + '\\Rightarrow ' + X + '\\approx ' + Dx(s1.B, 1)) + ' (the obtuse option is impossible)<br>' +
      t(W + '=180^\\circ-' + D(S.A) + '-' + Dx(s1.B, 1) + '=' + Dx(s1.C, 1)) + ', ' + t(w + '=\\dfrac{' + nT(S.a) + '\\sin ' + Dx(s1.C, 1) + '}{\\sin ' + D(S.A) + '}\\approx ' + fx(s1.c, 1)) + ' ' + unit + '<br>So ' + t('\\angle ' + X + '\\approx ' + Dx(s1.B, 0) + ',\\ \\angle ' + W + '\\approx ' + Dx(s1.C, 0) + ',\\ ' + w + '\\approx ' + fx(s1.c, 1)) + ' ' + unit + '.' +
      triFig([V, X, W], S.A, S.b, s1.c, { a: nT(S.a) + ' ' + unit, b: nT(S.b) + ' ' + unit, A: nT(S.A) + '°' });
    return fP(prompt, specs, { sol: sol, hints: [S.A > 90 ? t('\\angle ' + V) + ' is obtuse, so the other two angles are acute: only one triangle.' : 'The side opposite the given angle is the longer one: only one triangle.', 'Sine law for ' + t('\\angle ' + X) + ', then ' + t('\\angle ' + W + '=180^\\circ-\\angle ' + V + '-\\angle ' + X) + ', then the sine law for ' + t(w) + '.'], text: o.text, v: { k: 'ssa-one', A: S.A, a: S.a, b: S.b } });
  }
  /* two positions along a line (radio range, foghorn, gate, strut): near and far distances from the start */
  function twoPosP(prompt, S, labels, unit, o) {
    o = o || {};
    var s1 = S.sols[0], s2 = S.sols[1], tenth = function (s) { return S.a * sn(180 - S.A - rd(s.B, 1)) / sn(S.A); }, early = function (s) { return S.a * sn(180 - S.A - rd(s.B, 0)) / sn(S.A); };
    var eH = 'Keep the unrounded angles in the calculator until the end.';
    return fP(prompt, [
      { label: labels[0], name: o.names ? o.names[0] : 'Shorter distance', kind: 'near', x: s2.c, dp: 1, unit: unit, acc: [tenth(s2)], alts: [{ v: early(s2), code: LID + '-early', hint: eH }, { v: S.a * sn(S.A) / sn(s2.C), code: LID + '-sl-flip', hint: 'The distance is opposite the angle at the fixed point: ' + t('\\dfrac{\\text{distance}}{\\sin(\\text{its opposite angle})}=\\dfrac{' + nT(S.a) + '}{\\sin ' + D(S.A) + '}') + '.' }] },
      { label: labels[1], name: o.names ? o.names[1] : 'Longer distance', kind: 'near', x: s1.c, dp: 1, unit: unit, acc: [tenth(s1)], alts: [{ v: early(s1), code: LID + '-early', hint: eH }, { v: S.a * sn(S.A) / sn(s1.C), code: LID + '-sl-flip', hint: 'The distance is opposite the angle at the fixed point.' }, { v: s2.c, code: LID + '-one-pos', hint: 'There are two positions: the side can swing to meet the line in two places. Use the obtuse angle for one and the acute angle for the other.' }] }],
      { swap: true, swapHint: 'Right distances — put the shorter one first.', sol: o.sol, hints: o.hints, text: o.text, v: { k: 'twopos', A: S.A, a: S.a, b: S.b } });
  }
  function twoPosSol(S, P, X, F, unit) { // P = fixed start, X = point on the line, F = fixed object; angle at P; FX = a; PF = b
    var s1 = S.sols[0], s2 = S.sols[1];
    return 'In ' + t('\\triangle ' + P + F + X) + ': ' + t('\\angle ' + P + '=' + D(S.A)) + ', ' + t(F + X + '=' + nT(S.a)) + ' (opposite ' + t('\\angle ' + P) + '), ' + t(P + F + '=' + nT(S.b)) + ' (opposite ' + t('\\angle ' + X) + '). ' + t('h=' + nT(S.b) + '\\sin ' + D(S.A) + '\\approx ' + fx(S.h, 1) + '<' + nT(S.a) + '<' + nT(S.b)) + ': two positions.<br>' +
      t('\\sin ' + X + '=\\dfrac{' + nT(S.b) + '\\sin ' + D(S.A) + '}{' + nT(S.a) + '}\\approx ' + fx(S.s, 4) + '\\Rightarrow ' + X + '\\approx ' + Dx(s1.B, 1)) + ' or ' + t(Dx(s2.B, 1)) + '<br>' +
      t(X + '=' + Dx(s1.B, 1)) + ': ' + t('\\angle ' + F + '=' + Dx(s1.C, 1)) + ', ' + t(P + X + '=\\dfrac{' + nT(S.a) + '\\sin ' + Dx(s1.C, 1) + '}{\\sin ' + D(S.A) + '}\\approx ' + fx(s1.c, 1)) + ' ' + unit + '<br>' +
      t(X + '=' + Dx(s2.B, 1)) + ': ' + t('\\angle ' + F + '=' + Dx(s2.C, 1)) + ', ' + t(P + X + '=\\dfrac{' + nT(S.a) + '\\sin ' + Dx(s2.C, 1) + '}{\\sin ' + D(S.A) + '}\\approx ' + fx(s2.c, 1)) + ' ' + unit + ambFig(S, { V: P, W: F, X: X }, { u: unit });
  }
  function twoCase(r, lo, hi, opt) { // integer sides, two triangles, safe rounding of the final distances
    opt = opt || {};
    return pickWhere(function () { var A = r.int(lo, hi), b = opt.dec ? dec1(r, opt.b[0], opt.b[1]) : r.int(opt.b[0], opt.b[1]), h = b * sn(A); var a = opt.dec ? dec1(r, h + 0.3, b - 0.3) : r.int(Math.ceil(h + 0.5), Math.floor(b - 0.5)); return { A: A, a: rd(a, 1), b: rd(b, 1) }; },
      function (z) { var S = ssa(z.A, z.a, z.b); return S.n === 2 && S.sols[1].C >= (opt.minC || 12) && !same3(z.A, z.a, z.b, AVOID) && S.sols.every(function (s) { return safeR(s.c, 1) && safeR(s.B, 0) && safeR(s.C, 0); }) && (!opt.ok || opt.ok(z, S)); });
  }

  /* ======================= Assignment 7 ======================= */
  var HC = ['Acute angle: ' + t('a<h') + ' none, ' + t('a=h') + ' one (right), ' + t('h<a<b') + ' two, ' + t('a\\ge b') + ' one, with ' + t('h=b\\sin A') + '.', 'Obtuse (or right) angle: ' + t('a\\le b') + ' none, ' + t('a>b') + ' one.'];
  var TYPES = ['SSS', 'SAS', 'ASA', 'AAS', 'SSA'];
  function typeP(r, kind, text) {
    var nm = r.pick(NAMES.slice(1)), V0 = nm[0], V1 = nm[1], V2 = nm[2], s0 = low(V0), s1 = low(V1), s2 = low(V2), giv, why;
    var side = function () { return r.int(4, 15); }, ang = function () { return r.int(25, 80); };
    if (kind === 'SAS') { giv = [s0 + '=' + side(), s1 + '=' + side(), '\\angle ' + V2 + '=' + D(ang())]; why = 'The two sides ' + t(s0 + '=' + V1 + V2) + ' and ' + t(s1 + '=' + V0 + V2) + ' meet at ' + t(V2) + ', so ' + t('\\angle ' + V2) + ' is <b>between</b> them: SAS.'; }
    else if (kind === 'SSA') { giv = ['\\angle ' + V0 + '=' + D(ang()), s0 + '=' + side(), s2 + '=' + side()]; why = t('\\angle ' + V0) + ' is <b>opposite</b> ' + t(s0) + '. The sides ' + t(s0 + '=' + V1 + V2) + ' and ' + t(s2 + '=' + V0 + V1) + ' meet at ' + t(V1) + ', so the given angle is not between them: SSA.'; }
    else if (kind === 'AAS') { var a1 = ang(), a2 = r.int(30, 150 - a1); giv = ['\\angle ' + V0 + '=' + D(a1), '\\angle ' + V1 + '=' + D(a2), s0 + '=' + side()]; why = 'Side ' + t(s0 + '=' + V1 + V2) + ' is opposite ' + t('\\angle ' + V0) + ', not between the two angles: AAS.'; }
    else if (kind === 'ASA') { var b1 = ang(), b2 = r.int(30, 150 - b1); giv = ['\\angle ' + V0 + '=' + D(b1), '\\angle ' + V1 + '=' + D(b2), s2 + '=' + side()]; why = 'Side ' + t(s2 + '=' + V0 + V1) + ' joins ' + t(V0) + ' and ' + t(V1) + ', so it is between the two given angles: ASA.'; }
    else { var x = pickWhere(function () { return [r.int(4, 14), r.int(4, 14), r.int(4, 14)]; }, function (q) { return q[0] + q[1] > q[2] && q[0] + q[2] > q[1] && q[1] + q[2] > q[0] && q[0] !== q[1]; }); giv = [s0 + '=' + x[0], s1 + '=' + x[1], s2 + '=' + x[2]]; why = 'Three sides: SSS.'; }
    var opts = TYPES.map(function (k) { return { html: '<b>' + k + '</b>: ' + (k === 'SSA' ? 'not guaranteed (ambiguous case)' : 'exactly one triangle'), right: k === kind, why: why, code: k }; });
    return mcP(r, 'Name the type of information, and state whether exactly one triangle is guaranteed. ' + t('\\triangle ' + V0 + V1 + V2 + ':\\ ' + giv.join(',\\ ')), opts,
      why + ' ' + (kind === 'SSA' ? 'Two sides and an angle not between them do not guarantee exactly one triangle.' : 'Every triangle with these measurements is congruent: exactly one triangle.'), ['Side ' + t('d') + ' is opposite ' + t('\\angle D') + ': ' + t('d=EF') + '. Find where the two given sides meet.', 'SSS, SAS, ASA and AAS fix exactly one triangle. Only SSA (the angle not between the sides) may not.'], text, true);
  }

  var QUESTIONS = [
    { num: '1', parts: [{ id: '1', level: 'BEG', make: function (r) {
      var conds = [['acute', 'a<h', 0, 'side ' + t('a') + ' is too short to reach'], ['acute', 'a=h', 1, 'a right triangle, ' + t('\\angle B=90^\\circ')], ['acute', 'h<a<b', 2, t('\\angle B') + ' acute or obtuse'], ['acute', 'a\\ge b', 1, 'the swinging side meets the arm only once on the correct side'], ['obtuse or right', 'a\\le b', 0, 'side ' + t('a') + ' is not longer than ' + t('b')], ['obtuse or right', 'a>b', 1, 'only the longest side can be opposite an obtuse angle']];
      var sh = r.shuffle(conds), rows = sh.map(function (c, i) { return { id: 'r' + i, html: t('\\angle A') + ' ' + c[0] + ', ' + t(c[1]), label: c[0] + ', ' + c[1] }; }), want = {};
      sh.forEach(function (c, i) { want['r' + i] = 'n' + c[2]; });
      var ex = twoCase(r, 30, 50, { b: [10, 14] }), S = ssa(ex.A, ex.a, ex.b);
      return B.grid('The <b>ambiguous case</b> is SSA: two sides and an angle that is <b>not</b> between them. Side ' + t('a') + ' (opposite the given ' + t('\\angle A') + ') swings from ' + t('C') + ', and ' + t('h=b\\sin A') + ' is the height from ' + t('C') + '. How many triangles are possible in each situation?', rows,
        [{ id: 'n0', html: '0' }, { id: 'n1', html: '1' }, { id: 'n2', html: '2' }], want, { rowHead: 'Given', colHead: 'Triangles', why: function (row) { var c = sh[Number(row.slice(1))]; return { code: LID + '-count', hint: 'Picture side ' + t('a') + ' swinging from ' + t('C') + ' when ' + t('\\angle A') + ' is ' + c[0] + ' and ' + t(c[1]) + '. Can it reach the other arm, and in how many places?' }; } },
        sh.map(function (c) { return t('\\angle A') + ' ' + c[0] + ', ' + t(c[1]) + ': <b>' + c[2] + '</b> (' + c[3] + ').'; }).join('<br>') + '<br>Two triangles: ' + t('\\angle A') + ' acute and ' + t('h<a<b') + ', so the swinging side meets the other arm in two places, e.g. ' + t('\\angle A=' + D(ex.A) + ',\\ a=' + ex.a + ',\\ b=' + ex.b) + ':' + ambFig(S, { V: 'A', W: 'C', X: 'B' }),
        HC, 'ambiguous case: when 0, 1 or 2 triangles');
    } }] },
    { num: '2', parts: [
      { id: '2a', level: 'BEG', make: function (r) { return typeP(r, r.chance(0.8) ? 'SAS' : 'ASA', 'type of information (SAS)'); } },
      { id: '2b', level: 'BEG', make: function (r) { return typeP(r, 'SSA', 'type of information (SSA)'); } },
      { id: '2c', level: 'BEG', make: function (r) { return typeP(r, r.pick(['AAS', 'AAS', 'ASA']), 'type of information (AAS/ASA)'); } },
      { id: '2d', level: 'BEG', make: function (r) { return typeP(r, r.chance(0.8) ? 'SSS' : 'SAS', 'type of information (SSS)'); } }] },
    { num: '3', shared: function (r) {
      return pickWhere(function () { var Bv = r.int(30, 64), c = r.int(10, 22), h = c * sn(Bv); return { B: Bv, c: c, h: h, bs: r.shuffle([r.int(Math.max(2, Math.ceil(h - 5)), Math.floor(h - 0.6)), r.int(Math.ceil(h + 0.6), c - 1), r.int(c, c + 5)]) }; },
        function (z) { return safeR(z.h, 1) && z.bs.every(function (b) { return b > 1 && Math.abs(b - z.h) > 0.5; }) && z.bs[0] !== z.bs[1] && z.bs[1] !== z.bs[2] && z.bs[0] !== z.bs[2] && !(z.B === 42 && z.c === 15); });
    }, stem: function (z) {
      var C = [z.c * cs(z.B), z.c * sn(z.B)];
      return 'In ' + t('\\triangle ABC') + ', ' + t('\\angle B=' + D(z.B)) + ' and ' + t('c=AB=' + z.c) + ' cm. Side ' + t('b=AC') + ' is opposite ' + t('\\angle B') + '.' +
        fig(HW.fig({ pts: { B: [0, 0], A: C, E: [z.c * 1.25, 0], F: [C[0], 0] }, names: { B: 'B', A: 'A', E: '', F: '' }, segs: [['B', 'E'], ['B', 'A', z.c + ' cm'], ['A', 'F', 'h', { dash: true }]], right: [['F', 'E', 'A']], angles: [['B', 'E', 'A', z.B + '°']], width: 250, aria: 'angle B with side AB and the height from A' }));
    }, parts: [
      { id: '3a', level: 'BEG', make: function (r, z) {
        return nP('Determine the height ' + t('h') + ' from ' + t('A') + ' to line ' + t('BC') + ', to the nearest tenth.', z.h, 1, { unit: 'cm', alts: [{ v: z.c * cs(z.B), code: LID + '-alt-cos', hint: t('h') + ' is <b>opposite</b> ' + t('\\angle B') + ' in the right triangle, and ' + t('AB') + ' is the hypotenuse: ' + t('h=c\\sin B') + '.' }, { v: z.c / sn(z.B), code: LID + '-alt-div', hint: t('\\sin B=\\dfrac{h}{c}') + ', so ' + t('h=c\\sin B') + ': multiply.' }, { v: z.c * Math.sin(z.B), code: LID + '-radian', hint: 'Your calculator is in <b>radian</b> mode.' }],
          sol: t('h=c\\sin B=' + z.c + '\\sin ' + D(z.B) + '\\approx ' + fx(z.h, 1)) + ' cm', hints: ['In the right triangle, ' + t('\\sin B=\\dfrac{h}{c}') + '.'], text: 'height h = c sin B', v: { k: 'h', A: z.B, b: z.c } });
      } },
      { id: '3b', level: 'EMG', make: function (r, z) {
        var rows = z.bs.map(function (b, i) { return { id: 'r' + i, html: t('b=' + b) + ' cm', label: 'b = ' + b }; }), want = {};
        z.bs.forEach(function (b, i) { want['r' + i] = 'n' + nTri(z.B, b, z.c); });
        return B.grid('How many triangles are possible for each length of ' + t('b') + '?', rows, [{ id: 'n0', html: '0' }, { id: 'n1', html: '1' }, { id: 'n2', html: '2' }], want,
          { rowHead: 'Side b', colHead: 'Triangles', why: function (row) { var b = z.bs[Number(row.slice(1))]; return { code: LID + '-count', hint: 'Compare ' + t('b=' + b) + ' with ' + t('h\\approx ' + fx(z.h, 1)) + ' and with ' + t('c=' + z.c) + '.' }; } },
          t('h\\approx ' + fx(z.h, 1)) + ' cm.<br>' + z.bs.map(function (b) { var n = nTri(z.B, b, z.c); return t('b=' + b) + ': ' + (n === 0 ? t(b + '<h') + ', none.' : n === 2 ? t(fx(z.h, 1) + '<' + b + '<' + z.c) + ', two.' : t(b + '\\ge ' + z.c) + ', one.'); }).join('<br>'),
          ['Here the given angle is ' + t('\\angle B') + ', its opposite side is ' + t('b') + ' and the other side is ' + t('c') + '.', 'Compare ' + t('b') + ' with ' + t('h') + ' and ' + t('c') + ': ' + t('b<h') + ' none, ' + t('h<b<c') + ' two, ' + t('b\\ge c') + ' one.'], 'number of triangles for three lengths');
      } }] },
    { num: '4', shared: function (r) {
      return pickWhere(function () { var A = r.int(24, 66), b = r.int(12, 30); return { A: A, b: b, h: b * sn(A) }; }, function (z) { return safeR(z.h, 1) && !(z.A === 36 && z.b === 20) && !(z.A === 30) && !(z.A === 52 && z.b === 18) && !(z.A === 50 && z.b === 16); });
    }, stem: function (z) { return 'In ' + t('\\triangle ABC') + ', ' + t('\\angle A=' + D(z.A)) + ' and ' + t('b=' + z.b) + ' cm. Find the lengths of ' + t('a') + ' (to the nearest tenth) for each case.'; }, parts: [
      { id: '4a', level: 'EMG', make: function (r, z) {
        return fP('There is <b>no</b> triangle when', [{ label: '', before: t('0<a<'), name: 'Upper boundary', kind: 'near', x: z.h, dp: 1, unit: 'cm', alts: [{ v: z.b, code: LID + '-bound', hint: 'Below ' + t('b') + ' there can still be two triangles. No triangle means side ' + t('a') + ' is too short to reach: shorter than the height ' + t('h=b\\sin A') + '.' }, { v: z.b * cs(z.A), code: LID + '-alt-cos', hint: t('h=b\\sin A') + '.' }, { v: z.b * Math.sin(z.A), code: LID + '-radian', hint: 'Your calculator is in <b>radian</b> mode.' }] }],
          { sol: t('h=' + z.b + '\\sin ' + D(z.A) + '\\approx ' + fx(z.h, 1)) + ' cm. No triangle when ' + t('0<a<' + fx(z.h, 1)) + ' cm.', hints: ['Find the height ' + t('h=b\\sin A') + '. A side shorter than that cannot reach.'], text: 'range of a: no triangle', v: { k: 'h', A: z.A, b: z.b } });
      } },
      { id: '4b', level: 'PRG', make: function (r, z) {
        return fP('There is <b>exactly one</b> triangle when', [{ label: t('a='), name: 'Right-triangle length', kind: 'near', x: z.h, dp: 1, unit: 'cm', after: 'cm  or', alts: [{ v: z.b * cs(z.A), code: LID + '-alt-cos', hint: t('h=b\\sin A') + '.' }, { v: z.b, code: LID + '-bound', hint: 'One of the two cases is the right triangle, when ' + t('a') + ' is exactly the height.' }] },
          { label: t('a\\ge'), name: 'Lower bound for a ≥', kind: 'int', x: z.b, unit: 'cm', cands: [[rd(z.h, 1), LID + '-bound', 'For ' + t('a') + ' just above the height there are two triangles. One triangle again once ' + t('a') + ' reaches ' + t('b') + '.']] }],
          { sol: t('h\\approx ' + fx(z.h, 1)) + ' cm. Exactly one triangle when ' + t('a=' + fx(z.h, 1)) + ' cm (a right triangle) or ' + t('a\\ge ' + z.b) + ' cm.', hints: HC, text: 'range of a: one triangle', v: { k: 'h', A: z.A, b: z.b } });
      } },
      { id: '4c', level: 'PRG', make: function (r, z) {
        return fP('There are <b>two</b> triangles when', [{ label: '', name: 'Lower boundary', kind: 'near', x: z.h, dp: 1, after: t('<a<'), alts: [{ v: z.b * cs(z.A), code: LID + '-alt-cos', hint: t('h=b\\sin A') + '.' }, { v: z.b * Math.sin(z.A), code: LID + '-radian', hint: 'Your calculator is in <b>radian</b> mode.' }] },
          { label: '', name: 'Upper boundary', kind: 'int', x: z.b, unit: 'cm', cands: [[rd(z.h, 1), LID + '-bound', 'The upper boundary is ' + t('b') + ': side ' + t('a') + ' must be shorter than ' + t('b') + ' for two triangles.']] }],
          { swap: true, swapHint: 'Right numbers — the smaller one goes first.', sol: t('h\\approx ' + fx(z.h, 1)) + ' cm. Two triangles when ' + t(fx(z.h, 1) + '<a<' + z.b) + ' cm.', hints: ['Two triangles when ' + t('h<a<b') + '.'], text: 'range of a: two triangles', v: { k: 'h', A: z.A, b: z.b } });
      } }] },
    { num: '5', parts: [
      { id: '5a', level: 'EMG', make: function (r) { var nm = r.pick(NAMES.slice(1)); return caseMC(r, ssaCase(r, 'one', true), nm, '0/1/2: opposite side longer'); } },
      { id: '5b', level: 'PRG', make: function (r) { var nm = r.pick(NAMES.slice(1)); return caseMC(r, ssaCase(r, 'two', true), nm, '0/1/2: two triangles'); } },
      { id: '5c', level: 'EMG', make: function (r) { var nm = r.pick(NAMES.slice(1)); return caseMC(r, ssaCase(r, 'obt-none', false), nm, '0/1/2: obtuse, none'); } },
      { id: '5d', level: 'PRG', make: function (r) { var nm = r.pick(NAMES.slice(1)); return caseMC(r, ssaCase(r, 'none', false), nm, '0/1/2: too short'); } }] },
    { num: '6', stem: 'Determine all possible measures of ' + t('\\angle C') + ', to the nearest degree.', parts: [
      { id: '6a', level: 'PRG', make: function (r) {
        var z = twoCase(r, 25, 50, { dec: true, b: [7, 12] }), S = ssa(z.A, z.a, z.b);
        return ssaAngP(t('\\triangle ABC:\\ \\angle A=' + D(z.A) + ',\\ a=' + z.a + '\\text{ cm},\\ c=' + z.b + '\\text{ cm}'), S, { V: 'A', W: 'B', X: 'C' }, 0, { text: 'all possible angles: two', lab: { u: 'cm' } });
      } },
      { id: '6b', level: 'PRG', make: function (r) {
        var z = pickWhere(function () { var A = r.int(50, 80), c = dec1(r, 7, 12); return { A: A, b: c, a: rd(c + dec1(r, 1, 4), 1) }; }, function (z) { var S = ssa(z.A, z.a, z.b); return S.n === 1 && safeR(S.B1, 0) && !same3(z.A, z.a, z.b, AVOID); });
        return ssaAngP(t('\\triangle ABC:\\ \\angle A=' + D(z.A) + ',\\ a=' + z.a + '\\text{ cm},\\ c=' + z.b + '\\text{ cm}'), ssa(z.A, z.a, z.b), { V: 'A', W: 'B', X: 'C' }, 0, { text: 'all possible angles: one', lab: { u: 'cm' } });
      } }] },
    { num: '7', parts: [{ id: '7', level: 'ADV', make: function (r) {
      var nm = r.pick([['N', 'M', 'L'], ['R', 'Q', 'P'], ['F', 'E', 'D'], ['Z', 'Y', 'X']]), G = nm[0], X = nm[1], Y = nm[2]; // given ∠G; side XY opposite G; side YG opposite X; unknown ∠X, third ∠Y
      var z = twoCase(r, 28, 50, { b: [24, 45] }), S = ssa(z.A, z.a, z.b), s1 = S.sols[0], s2 = S.sols[1];
      var flip = S.a * sn(S.A) / S.b;
      return fP('In ' + t('\\triangle ' + Y + X + G) + ', ' + t('\\angle ' + G + '=' + D(z.A)) + ', ' + t(Y + X + '=' + z.a) + ' mm and ' + t(Y + G + '=' + z.b) + ' mm. Determine all possible measures of ' + t('\\angle ' + X) + ' and of ' + t('\\angle ' + Y) + ', to the nearest degree.', [
        { label: 'Triangle 1: ' + t('\\angle ' + X + '='), name: t('\\angle ' + X) + ' (acute)', kind: 'near', x: s1.B, dp: 0, unit: '°', alts: [{ v: s2.B, code: LID + '-swap-tri', hint: 'Put the acute ' + t('\\angle ' + X) + ' in triangle 1.' }, { v: flip <= 1 ? asn(flip) : NaN, code: LID + '-wrong-pair', hint: t(Y + X + '=' + low(G)) + ' is opposite ' + t('\\angle ' + G) + ' and ' + t(Y + G + '=' + low(X)) + ' is opposite ' + t('\\angle ' + X) + ': ' + t('\\sin ' + X + '=\\dfrac{' + z.b + '\\sin ' + D(z.A) + '}{' + z.a + '}') + '.' }] },
        { label: t('\\angle ' + Y + '='), name: 'Triangle 1: ' + t('\\angle ' + Y), kind: 'near', x: s1.C, dp: 0, unit: '°', acc: [180 - S.A - rd(s1.B, 1), 180 - S.A - rd(s1.B, 0)], alts: [{ v: s2.C, code: LID + '-swap-tri', hint: 'Triangle 1 uses the acute ' + t('\\angle ' + X) + '.' }] },
        { label: 'Triangle 2: ' + t('\\angle ' + X + '='), name: t('\\angle ' + X) + ' (obtuse)', kind: 'near', x: s2.B, dp: 0, unit: '°', alts: [{ v: s1.B, code: LID + '-swap-tri', hint: 'Triangle 2 has the obtuse ' + t('\\angle ' + X + '=180^\\circ-\\angle ' + X + '_1') + '.' }] },
        { label: t('\\angle ' + Y + '='), name: 'Triangle 2: ' + t('\\angle ' + Y), kind: 'near', x: s2.C, dp: 0, unit: '°', acc: [180 - S.A - rd(s2.B, 1), 180 - S.A - rd(s2.B, 0)], alts: [{ v: s1.C, code: LID + '-swap-tri', hint: 'Triangle 2 uses the obtuse ' + t('\\angle ' + X) + '.' }] }],
        { sol: t(Y + X + '=' + low(G) + '=' + z.a) + ' (opposite ' + t('\\angle ' + G) + '), ' + t(Y + G + '=' + low(X) + '=' + z.b) + ' (opposite ' + t('\\angle ' + X) + '). ' + t('h=' + z.b + '\\sin ' + D(z.A) + '\\approx ' + fx(S.h, 1) + '<' + z.a + '<' + z.b) + ': two.<br>' +
          t('\\sin ' + X + '=\\dfrac{' + z.b + '\\sin ' + D(z.A) + '}{' + z.a + '}\\approx ' + fx(S.s, 4) + '\\Rightarrow ' + X + '\\approx ' + Dx(s1.B, 1)) + ' or ' + t(Dx(s2.B, 1)) + '<br>' +
          t('\\angle ' + X + '\\approx ' + Dx(s1.B, 0) + ',\\ \\angle ' + Y + '\\approx ' + Dx(s1.C, 0)) + ' or ' + t('\\angle ' + X + '\\approx ' + Dx(s2.B, 0) + ',\\ \\angle ' + Y + '\\approx ' + Dx(s2.C, 0)) + ambFig(S, { V: G, W: Y, X: X }, { u: 'mm' }),
          hints: ['Name the sides by the angle they are opposite: ' + t(Y + X) + ' is opposite ' + t('\\angle ' + G) + '.', 'Then ' + t('\\sin ' + X + '=\\dfrac{' + low(X) + '\\sin ' + G + '}{' + low(G) + '}') + '; the second value is ' + t('180^\\circ-\\angle ' + X) + '.'], text: 'two triangles: both pairs of angles', v: { k: 'ssa-both', A: S.A, a: S.a, b: S.b } });
    } }] },
    { num: '8', parts: [{ id: '8', level: 'ADV', make: function (r) {
      var z = twoCase(r, 35, 62, { b: [10, 20] }), S = ssa(z.A, z.a, z.b);
      return bothP('Solve all possible triangles ' + t('ABC') + ' with ' + t('\\angle B=' + D(z.A)) + ', ' + t('b=' + z.a) + ' cm and ' + t('a=' + z.b) + ' cm. Round angles to the nearest degree and sides to the nearest tenth.', S, { V: 'B', W: 'C', X: 'A' }, 'cm', { text: 'solve both triangles' });
    } }] },
    { num: '9', shared: function (r) {
      return pickWhere(function () { var X = r.int(105, 140), y = r.int(8, 16); return { X: X, y: y, x1: r.int(y + 2, y + 9), x2: r.int(Math.ceil(y * sn(X) + 0.4), y - 1) }; }, function (z) {
        var S = ssa(z.X, z.x1, z.y), s2 = z.y * sn(z.X) / z.x2; return S.n === 1 && safeR(S.B1, 0) && safeR(S.sols[0].C, 0) && safeR(S.sols[0].c, 1) && s2 < 0.997 && z.x2 > 0 && z.x2 < z.y && nTri(z.X, z.x2, z.y) === 0 && safeR(asn(s2), 0) && !(z.X === 124 && z.y === 12);
      });
    }, stem: function (z) { return 'In ' + t('\\triangle XYZ') + ', ' + t('\\angle X=' + D(z.X)) + ' and ' + t('y=' + z.y) + ' cm.'; }, parts: [
      { id: '9a', level: 'PRG', make: function (r, z) { return oneP('If ' + t('x=' + z.x1) + ' cm, solve the triangle (angles to the nearest degree, sides to the nearest tenth).', ssa(z.X, z.x1, z.y), { V: 'X', W: 'Z', X: 'Y' }, 'cm', { text: 'obtuse angle: solve the one triangle' }); } },
      { id: '9b', level: 'PRG', make: function (r, z) {
        var s = z.y * sn(z.X) / z.x2, Y1 = asn(s), Y2 = 180 - Y1;
        return mcP(r, 'If ' + t('x=' + z.x2) + ' cm, a student gets ' + t('\\sin Y\\approx ' + fx(s, 4)) + ' and says ' + t('\\angle Y\\approx ' + Dx(Y1, 0)) + '. Which statement explains the error?', [
          { html: 'Neither ' + t(Dx(Y1, 0)) + ' nor ' + t(Dx(Y2, 0)) + ' fits beside ' + t(D(z.X)) + ': the angles would add to more than ' + t('180^\\circ') + '. There is <b>no triangle</b>.', right: true },
          { html: 'The angle should be the obtuse one, ' + t('\\angle Y\\approx ' + Dx(Y2, 0)) + '.', why: t('\\angle X') + ' is already obtuse, and a triangle has at most one obtuse angle. Check the angle sum for both values.' },
          { html: 'There are two triangles: ' + t('\\angle Y\\approx ' + Dx(Y1, 0)) + ' or ' + t(Dx(Y2, 0)) + '.', why: 'Add each value to ' + t(D(z.X)) + '. Does either give less than ' + t('180^\\circ') + '?' },
          { html: 'There is no error: ' + t('\\sin Y') + ' is less than ' + t('1') + ', so ' + t('\\angle Y\\approx ' + Dx(Y1, 0)) + '.', why: 'A sine less than ' + t('1') + ' does not guarantee a triangle. Check the angle sum: ' + t(D(z.X) + '+' + Dx(Y1, 1) + '=' + Dx(z.X + Y1, 1)) + '.' }],
          t('\\angle Y\\approx ' + Dx(Y1, 1)) + ' or ' + t(Dx(Y2, 1)) + ', but ' + t(D(z.X) + '+' + Dx(Y1, 1) + '>180^\\circ') + ' and ' + t(D(z.X) + '+' + Dx(Y2, 1) + '>180^\\circ') + '. Neither works: there is <b>no triangle</b> (obtuse ' + t('\\angle X') + ' with ' + t('x\\le y') + ', ' + t(z.x2 + '\\le ' + z.y) + '). A sine below ' + t('1') + ' does not guarantee a triangle; check the angle sum.',
          HC, 'obtuse angle: explain the error', false, 1);
      } }] },
    { num: '10', parts: [{ id: '10', level: 'PRG', make: function (r) {
      var z = twoCase(r, 25, 45, { b: [9, 16], ok: function (q) { return !(q.A === 30 && q.a === 8 && q.b === 11); } }), S = ssa(z.A, z.a, z.b);
      var nmn = r.pick(['Jordan', 'Priya', 'Mateo', 'Avery', 'Noor']);
      var p = ssaAngP(nmn + ' solved ' + t('\\triangle ABC') + ' with ' + t('\\angle A=' + D(z.A)) + ', ' + t('a=' + z.a) + ' cm and ' + t('b=' + z.b) + ' cm and wrote “' + t('\\angle B=' + Dx(S.B1, 0)) + '”. What did ' + nmn + ' miss? Give the complete answer for ' + t('\\angle B') + ', to the nearest degree.', S, { V: 'A', W: 'C', X: 'B' }, 0, { text: 'the missed obtuse angle', post: '<br>' + nmn + ' missed the obtuse angle.', lab: { u: 'cm' } });
      return p;
    } }] },
    { num: '11', parts: [{ id: '11', level: 'ADV', make: function (r) {
      var z = twoCase(r, 18, 40, { b: [9, 20] }), S = ssa(z.A, z.a, z.b), ctx = r.pick([['lighthouse', 'L', 'harbour', 'H', 'Its foghorn can be heard', 'hear the foghorn'], ['radio tower', 'T', 'port', 'P', 'Its signal reaches', 'receive the signal']]);
      return twoPosP('A ' + ctx[0] + ' ' + t(ctx[1]) + ' is ' + t(z.b) + ' km from a ' + ctx[2] + ' ' + t(ctx[3]) + '. A boat leaves ' + t(ctx[3]) + ' on a straight course that makes an angle of ' + t(D(z.A)) + ' with the line ' + t(ctx[3] + ctx[1]) + '. ' + ctx[4] + ' up to ' + t(z.a) + ' km away. Between what distances from ' + t(ctx[3]) + ' (to the nearest tenth of a kilometre) can the boat ' + ctx[5] + '?', S, [t('\\text{from}'), t('\\text{to}')], 'km',
        { names: ['From', 'To'], sol: twoPosSol(S, ctx[3], 'B', ctx[1], 'km') + '<br>The boat can ' + ctx[5] + ' from about ' + fx(S.sols[1].c, 1) + ' km to ' + fx(S.sols[0].c, 1) + ' km from ' + t(ctx[3]) + '.', hints: ['Sketch: the boat’s course, the ' + ctx[0] + ' off to one side, and a ' + t(z.a) + ' km line from the ' + ctx[0] + ' meeting the course in two places.', 'In the triangle, the ' + t(z.a) + ' km side is opposite the ' + t(D(z.A)) + ' angle. Find both angles at the boat, then both distances with the sine law.'], text: 'range along a course' });
    } }] },
    { num: '12', parts: [{ id: '12', level: 'ADV', make: function (r) {
      var z = twoCase(r, 25, 50, { dec: true, b: [3.2, 6.0], ok: function (q, S) { return q.a >= 1.8 && !(q.A === 35 && q.b === 4 && q.a === 3); } }), S = ssa(z.A, z.a, z.b);
      return twoPosP('A garden gate ' + t(fx(z.a, 1)) + ' m wide is hinged at post ' + t('G') + '. Post ' + t('G') + ' is ' + t(fx(z.b, 1)) + ' m from corner ' + t('K') + ' of a straight path, and line ' + t('KG') + ' makes an angle of ' + t(D(z.A)) + ' with the edge of the path. The gate swings until its free end touches the edge of the path. Find both possible distances from ' + t('K') + ' to the point where the gate touches the path, to the nearest tenth of a metre.', S, [t('\\text{shorter}'), t('\\text{longer}')], 'm',
        { sol: twoPosSol(S, 'K', 'T', 'G', 'm'), hints: ['In ' + t('\\triangle KGT') + ' (' + t('T') + ' where the gate touches the path), the gate ' + t('GT') + ' is opposite ' + t('\\angle K') + '.', 'Two angles at ' + t('T') + ' (acute and obtuse) give two distances ' + t('KT') + '.'], text: 'swinging gate: two positions' });
    } }] },
    { num: '13', parts: [{ id: '13', level: 'ADV', make: function (r) {
      var z = pickWhere(function () { var A = r.chance(0.4) ? 30 : r.int(24, 56), b = r.int(9, 17); return { A: A, b: b, h: b * sn(A) }; }, function (z) { var n = Math.ceil(z.b - 1) - Math.floor(z.h + 1e-9); return !(z.A === 30 && z.b === 12) && !(z.A === 30 && z.b === 14) && n >= 3 && n <= 9 && Math.abs(z.h - Math.round(z.h)) > (z.A === 30 ? -1 : 0.12); });
      var lo = Math.floor(z.h + 1e-9) + 1, want = []; for (var k = lo; k < z.b; k++) want.push(k);
      var hInt = Math.abs(z.h - Math.round(z.h)) < 1e-9;
      var check = function (resp) {
        var got = (resp || []).map(Number).filter(function (x) { return isFinite(x); });
        if (!got.length) return form('empty', 'Add the lengths one at a time (press Enter or comma after each).');
        var seen = {}; for (var i = 0; i < got.length; i++) { if (seen[got[i]]) return form('duplicate', 'You listed ' + t(got[i]) + ' twice.'); seen[got[i]] = 1; }
        if (got.some(function (x) { return x % 1; })) return form('whole', 'List whole numbers only.');
        var extra = got.filter(function (x) { return want.indexOf(x) < 0; }), miss = want.filter(function (x) { return got.indexOf(x) < 0; });
        if (!extra.length && !miss.length) return ok();
        if (extra.some(function (x) { return x === z.b; })) return wrong(LID + '-list-end', t('a=' + z.b) + ' is not shorter than ' + t('b') + ': that gives one (isosceles) triangle. Two triangles need ' + t('a<b') + '.');
        if (hInt && extra.some(function (x) { return x === Math.round(z.h); })) return wrong(LID + '-list-end', t('a=' + Math.round(z.h)) + ' is exactly the height: one right triangle. Two triangles need ' + t('a>h') + '.');
        if (extra.length) return wrong(LID + '-list-extra', t('a=' + extra[0]) + ' is outside ' + t('h<a<b') + ' (' + t('h\\approx ' + fx(z.h, 2)) + ').');
        return wrong(LID + '-list-miss', 'You have ' + got.length + ' of the ' + want.length + ' lengths. List every whole number between ' + t('h') + ' and ' + t('b') + '.');
      };
      return { prompt: 'In ' + t('\\triangle ABC') + ', ' + t('\\angle A=' + D(z.A)) + ' and ' + t('b=' + z.b) + ' cm. List every whole-number length of ' + t('a') + ' (in cm) that gives two triangles.', input: { type: 'list' }, check: check, key: want.slice(), answer: t('a=' + want.join(',\\ ')) + ' cm',
        solution: t('h=' + z.b + '\\sin ' + D(z.A) + (hInt ? '=' + Math.round(z.h) : '\\approx ' + fx(z.h, 2))) + '. Two triangles when ' + t((hInt ? Math.round(z.h) : fx(z.h, 2)) + '<a<' + z.b) + ': ' + t('a=' + want.join(',\\ ')) + ' cm.', hints: ['Two triangles when ' + t('h<a<b') + ', with ' + t('h=b\\sin A') + ' (both ends left out).'],
        text: 'whole-number lengths for two triangles', bad: [want.slice(1), want.concat([z.b]), [lo - 1].concat(want)], _v: { k: 'list', A: z.A, b: z.b } };
    } }] },
    { num: '14', parts: [{ id: '14', level: 'MAS', make: function (r) {
      var z = twoCase(r, 28, 55, { b: [8, 15], ok: function (q, S) { return safeR(S.sols[0].c - S.sols[1].c, 1) && !(q.A === 40 && q.a === 8 && q.b === 10); } }), S = ssa(z.A, z.a, z.b), s1 = S.sols[0], s2 = S.sols[1], d = s1.c - s2.c;
      var r2 = function (s) { return rd(S.a * sn(180 - S.A - rd(s.B, 1)) / sn(S.A), 2); };
      return nP('In ' + t('\\triangle ABC') + ', ' + t('\\angle A=' + D(z.A)) + ', ' + t('a=' + z.a) + ' cm and ' + t('b=' + z.b) + ' cm. Vertex ' + t('B') + ' can be in two places on the same line. How far apart are the two possible positions of ' + t('B') + '? Answer to the nearest tenth.', d, 1, { unit: 'cm', acc: [r2(s1) - r2(s2), rd(s1.c, 2) - rd(s2.c, 2)],
        alts: [{ v: s1.c + s2.c, code: LID + '-sum', hint: 'Both positions are on the same side of ' + t('A') + ': the distance between them is ' + t('c_1-c_2') + '.' }, { v: d / 2, code: LID + '-half', hint: 'That is the distance from the foot of the height to each position. The two positions are twice that apart.' }, { v: s1.c, code: LID + '-one-pos', hint: 'That is ' + t('c_1=AB_1') + '. Find ' + t('c_2') + ' too and subtract.' }, { v: s2.c, code: LID + '-one-pos', hint: 'That is ' + t('c_2=AB_2') + '. Find ' + t('c_1') + ' too and subtract.' }],
        sol: t('\\sin B=\\dfrac{' + z.b + '\\sin ' + D(z.A) + '}{' + z.a + '}\\approx ' + fx(S.s, 4)) + '; ' + t('B\\approx ' + Dx(s1.B, 1)) + ' or ' + t(Dx(s2.B, 1)) + '.<br>' + t('B=' + Dx(s1.B, 1)) + ': ' + t('C=' + Dx(s1.C, 1) + ',\\ c_1=\\dfrac{' + z.a + '\\sin ' + Dx(s1.C, 1) + '}{\\sin ' + D(z.A) + '}\\approx ' + fx(s1.c, 2)) + '; ' + t('B=' + Dx(s2.B, 1)) + ': ' + t('C=' + Dx(s2.C, 1) + ',\\ c_2\\approx ' + fx(s2.c, 2)) +
          '<br>Distance apart ' + t('=c_1-c_2\\approx ' + fx(s1.c, 2) + '-' + fx(s2.c, 2) + '\\approx ' + fx(d, 1)) + ' cm.<br>(Check: ' + t('h=b\\sin A') + ', and the two positions are ' + t('2\\sqrt{a^2-h^2}\\approx ' + fx(2 * Math.sqrt(z.a * z.a - S.h * S.h), 1)) + ' cm apart.)' + ambFig(S, { V: 'A', W: 'C', X: 'B' }, { u: 'cm' }),
        hints: ['Solve both triangles for ' + t('c=AB') + '. The two positions of ' + t('B') + ' are ' + t('c_1') + ' and ' + t('c_2') + ' from ' + t('A') + ' along the same line.'], text: 'distance between the two positions of B', v: { k: 'gap', A: z.A, a: z.a, b: z.b } });
    } }] },
    { num: '15', parts: [{ id: '15', level: 'PRG', make: function (r) {
      var two = r.chance(0.65);
      var z = pickWhere(function () { var P = r.int(30, 62), q = r.int(8, 15), h = q * sn(P); return { P: P, q: q, p: two ? r.int(Math.ceil(h + 0.4), q - 1) : r.int(q + 1, q + 5) }; }, function (z) { var S = ssa(z.P, z.p, z.q), f = z.p * sn(z.P) / z.q; return S.n === (two ? 2 : 1) && f < 0.995 && safeR(S.B1, 1) && safeR(asn(f), 1) && !(z.P === 46 && z.p === 9 && z.q === 12); });
      var S = ssa(z.P, z.p, z.q), F1 = asn(z.p * sn(z.P) / z.q);
      var Q1 = Dx(S.B1, 1), Q2 = Dx(180 - S.B1, 1), f1 = Dx(F1, 1), f2 = Dx(180 - F1, 1);
      return mcP(r, 'In ' + t('\\triangle PQR') + ', ' + t('\\angle P=' + D(z.P)) + ', ' + t('QR=' + z.p) + ' cm and ' + t('PR=' + z.q) + ' cm. To the nearest tenth of a degree, the measure of ' + t('\\angle Q') + ' is', [
        { html: t(Q1), right: !two, why: 'Check the obtuse value too: ' + t(D(z.P) + '+' + Q2 + '<180^\\circ') + ', and ' + t('h=' + z.q + '\\sin ' + D(z.P) + '\\approx ' + fx(S.h, 1)) + ' is less than ' + t(z.p) + ', which is less than ' + t(z.q) + ': two triangles.', code: 'q1' },
        { html: t(Q1) + ' or ' + t(Q2), right: two, why: t(D(z.P) + '+' + Q2 + '>180^\\circ') + ', so the obtuse value is impossible: only one triangle (' + t('QR>PR') + ').', code: 'q12' },
        { html: t(f1), why: 'Sine law: ' + t('\\sin Q=\\dfrac{PR\\sin P}{QR}') + ' — the side opposite ' + t('\\angle Q') + ' (' + t('PR') + ') goes on top.', code: 'f1' },
        { html: t(f1) + ' or ' + t(f2), why: 'Sine law: ' + t('\\sin Q=\\dfrac{PR\\sin P}{QR}') + ' — ' + t('PR') + ' is opposite ' + t('\\angle Q') + '.', code: 'f12' }],
        t('QR=p=' + z.p) + ' (opposite ' + t('\\angle P') + '), ' + t('PR=q=' + z.q) + ' (opposite ' + t('\\angle Q') + '). ' + t('\\sin Q=\\dfrac{' + z.q + '\\sin ' + D(z.P) + '}{' + z.p + '}\\approx ' + fx(S.s, 4) + ',\\ Q\\approx ' + Q1) + '; ' + (two ? t('h\\approx ' + fx(S.h, 1) + '<' + z.p + '<' + z.q) + ', so ' + t(Q2) + ' also works.' : t(Q2) + ' is rejected (' + t(D(z.P) + '+' + Q2 + '>180^\\circ') + ').') + ' (The other choices come from ' + t('\\dfrac{' + z.p + '\\sin ' + D(z.P) + '}{' + z.q + '}') + '.)',
        HC, 'MC: the measure of angle Q', true);
    } }] },
    { num: '16', parts: [{ id: '16', level: 'PRG', make: function (r) {
      var z = pickWhere(function () { var A = r.int(35, 65), b = r.int(9, 16), h = b * sn(A); return { A: A, b: b, h: h, aTwo: r.int(Math.ceil(h + 0.4), b - 1), aNone: r.int(Math.max(2, Math.ceil(h - 3)), Math.floor(h - 0.4)), aOne: b + r.int(1, 4), aObt: r.int(Math.max(3, b - 4), b - 1) }; },
        function (z) { return z.aTwo < z.b && z.aTwo > z.h + 0.3 && z.aNone < z.h - 0.3 && z.aNone >= 2 && !(z.A === 50 && z.b === 10); });
      var obtA = 180 - z.A + (z.A > 50 ? 0 : 10), row = function (A, a) { return t('\\angle A=' + D(A) + ',\\ a=' + a + '\\text{ cm},\\ b=' + z.b + '\\text{ cm}'); };
      return mcP(r, 'Which set of measurements gives exactly two triangles ' + t('ABC') + '?', [
        { html: row(z.A, z.aOne), why: t('a\\ge b') + ': only one triangle.', code: 'one' },
        { html: row(z.A, z.aNone), why: t('h=' + z.b + '\\sin ' + D(z.A) + '\\approx ' + fx(z.h, 2)) + ' and ' + t(z.aNone + '<h') + ': no triangle.', code: 'none' },
        { html: row(z.A, z.aTwo), right: true },
        { html: row(obtA, z.aObt), why: t('\\angle A') + ' is obtuse and ' + t('a<b') + ': no triangle.', code: 'obt' }],
        t('h=' + z.b + '\\sin ' + D(z.A) + '\\approx ' + fx(z.h, 2)) + '. ' + t('a=' + z.aOne) + ': ' + t('a>b') + ', one. ' + t('a=' + z.aNone) + ': ' + t('a<h') + ', none. ' + t('a=' + z.aTwo) + ': ' + t(fx(z.h, 2) + '<' + z.aTwo + '<' + z.b) + ', <b>two</b>. Obtuse ' + t('\\angle A') + ' with ' + t('a<b') + ': none.', HC, 'MC: which gives two triangles');
    } }] },
    { num: '17', parts: [{ id: '17', level: 'PRG', make: function (r) {
      var z = twoCase(r, 22, 45, { b: [10, 20], ok: function (q) { return !(q.A === 33 && q.a === 10 && q.b === 16); } }), S = ssa(z.A, z.a, z.b);
      return nP('<b>Numerical response.</b> In ' + t('\\triangle ABC') + ', ' + t('\\angle A=' + D(z.A)) + ', ' + t('a=' + z.a) + ' cm and ' + t('b=' + z.b) + ' cm. To the nearest degree, the <b>obtuse</b> possible measure of ' + t('\\angle B') + ' is ____°.', S.B2, 0, { nr: true, unit: '°',
        alts: [{ v: S.B1, code: LID + '-only-b1', hint: 'That is the acute value. The obtuse one is ' + t('180^\\circ') + ' minus it.' }, { v: 180 - asn(z.a * sn(z.A) / z.b), code: LID + '-sl-flip', hint: t('\\sin B=\\dfrac{b\\sin A}{a}') + '.' }, { v: S.sols[1].C, code: LID + '-third', hint: 'That is ' + t('\\angle C') + ' in the obtuse triangle. The question asks for ' + t('\\angle B') + '.' }],
        sol: t('\\sin B=\\dfrac{' + z.b + '\\sin ' + D(z.A) + '}{' + z.a + '}\\approx ' + fx(S.s, 4) + '\\Rightarrow B\\approx ' + Dx(S.B1, 1)) + '; obtuse: ' + t('180^\\circ-' + Dx(S.B1, 1) + '=' + Dx(S.B2, 1) + '\\approx ' + Dx(S.B2, 0)) + ' (' + t(D(z.A) + '+' + Dx(S.B2, 1) + '<180^\\circ') + ').',
        hints: ['Find the acute ' + t('\\angle B') + ' with the sine law; the obtuse one is its supplement.'], text: 'NR: the obtuse angle B', v: { k: 'ssa-b2', A: z.A, a: z.a, b: z.b } });
    } }] }
  ];

  /* ======================= Extra Practice 7 ======================= */
  var EXTRA = [
    { num: '1', section: 'A. Skills', shared: function (r) {
      return pickWhere(function () { var A = r.int(35, 65), b = r.int(12, 22), h = b * sn(A); return { A: A, b: b, h: h, as: [r.int(Math.max(3, Math.ceil(h - 4)), Math.floor(h - 0.6)), r.int(Math.ceil(h + 0.6), b - 1), r.int(b + 1, b + 5)] }; },
        function (z) { return safeR(z.h, 1) && z.as[1] < z.b && z.as[1] > z.h + 0.5 && z.as[0] < z.h - 0.5 && !(z.A === 50 && z.b === 16) && !(z.A === 30 && z.b === 14); });
    }, stem: function (z) { return 'In ' + t('\\triangle ABC') + ', ' + t('\\angle A=' + D(z.A)) + ' and ' + t('b=' + z.b) + ' cm.'; }, parts: [
      { id: 'e1a', level: 'BEG', make: function (r, z) {
        return nP('Determine the height ' + t('h=b\\sin A') + ' to the nearest tenth.', z.h, 1, { unit: 'cm', alts: [{ v: z.b * cs(z.A), code: LID + '-alt-cos', hint: t('h=b\\sin A') + ', not ' + t('b\\cos A') + '.' }, { v: z.b / sn(z.A), code: LID + '-alt-div', hint: 'Multiply: ' + t('h=b\\sin A') + '.' }, { v: z.b * Math.sin(z.A), code: LID + '-radian', hint: 'Your calculator is in <b>radian</b> mode.' }],
          sol: t('h=' + z.b + '\\sin ' + D(z.A) + '\\approx ' + fx(z.h, 1)) + ' cm', hints: ['Type ' + t(z.b + '\\sin(' + z.A + ')') + ' in degree mode.'], text: 'height h = b sin A', v: { k: 'h', A: z.A, b: z.b } });
      } },
      { id: 'e1b', level: 'EMG', make: function (r, z) {
        var as = r.shuffle(z.as), rows = as.map(function (a, i) { return { id: 'r' + i, html: t('a=' + a) + ' cm', label: 'a = ' + a }; }), want = {};
        as.forEach(function (a, i) { want['r' + i] = 'n' + nTri(z.A, a, z.b); });
        return B.grid('How many triangles are possible for each length of ' + t('a') + '?', rows, [{ id: 'n0', html: '0' }, { id: 'n1', html: '1' }, { id: 'n2', html: '2' }], want,
          { rowHead: 'Side a', colHead: 'Triangles', why: function (row) { var a = as[Number(row.slice(1))]; return { code: LID + '-count', hint: 'Compare ' + t('a=' + a) + ' with ' + t('h\\approx ' + fx(z.h, 1)) + ' and ' + t('b=' + z.b) + '.' }; } },
          t('h\\approx ' + fx(z.h, 1)) + ' cm.<br>' + as.map(function (a) { var n = nTri(z.A, a, z.b); return t('a=' + a) + ': ' + (n === 0 ? t(a + '<h') + ', none.' : n === 2 ? t(fx(z.h, 1) + '<' + a + '<' + z.b) + ', two.' : t(a + '\\ge ' + z.b) + ', one.'); }).join('<br>'), HC, 'number of triangles for three lengths');
      } }] },
    { num: '2', parts: [
      { id: 'e2a', level: 'EMG', make: function (r) { return caseMC(r, ssaCase(r, 'one', true), r.pick(NAMES.slice(1)), '0/1/2: opposite side longer'); } },
      { id: 'e2b', level: 'PRG', make: function (r) { return caseMC(r, ssaCase(r, 'two', true), r.pick(NAMES.slice(1)), '0/1/2: two triangles'); } },
      { id: 'e2c', level: 'EMG', make: function (r) { return caseMC(r, ssaCase(r, 'obt-none', true), r.pick(NAMES.slice(1)), '0/1/2: obtuse, none'); } }] },
    { num: '3', stem: 'Determine all possible measures of ' + t('\\angle B') + ', to the nearest degree, in ' + t('\\triangle ABC') + '.', parts: [
      { id: 'e3a', level: 'PRG', make: function (r) { var z = twoCase(r, 30, 55, { b: [10, 20] }); return ssaAngP(t('\\angle A=' + D(z.A) + ',\\ a=' + z.a + ',\\ b=' + z.b), ssa(z.A, z.a, z.b), { V: 'A', W: 'C', X: 'B' }, 0, { text: 'all possible angles: two' }); } },
      { id: 'e3b', level: 'PRG', make: function (r) {
        var z = pickWhere(function () { var A = r.int(55, 85), b = dec1(r, 5, 12); return { A: A, b: b, a: rd(b + dec1(r, 0.5, 3), 1) }; }, function (z) { var S = ssa(z.A, z.a, z.b); return S.n === 1 && S.B1 > 25 && safeR(S.B1, 0) && !same3(z.A, z.a, z.b, AVOID); });
        return ssaAngP(t('\\angle A=' + D(z.A) + ',\\ a=' + z.a + ',\\ b=' + z.b), ssa(z.A, z.a, z.b), { V: 'A', W: 'C', X: 'B' }, 0, { text: 'all possible angles: one' });
      } },
      { id: 'e3c', level: 'PRG', make: function (r) {
        var z = pickWhere(function () { var A = r.int(40, 70), b = dec1(r, 6, 12), h = b * sn(A); return { A: A, b: b, a: rd(dec1(r, Math.max(2, h - 2.5), h - 0.4), 1) }; }, function (z) { return z.a > 1 && ssa(z.A, z.a, z.b).n === 0 && !same3(z.A, z.a, z.b, AVOID); });
        return ssaAngP(t('\\angle A=' + D(z.A) + ',\\ a=' + z.a + ',\\ b=' + z.b), ssa(z.A, z.a, z.b), { V: 'A', W: 'C', X: 'B' }, 0, { text: 'all possible angles: none' });
      } }] },
    { num: '4', section: 'B. Applying', parts: [{ id: 'e4', level: 'ADV', make: function (r) {
      var z = twoCase(r, 25, 50, { b: [14, 28] }), S = ssa(z.A, z.a, z.b);
      return bothP('Solve all possible triangles ' + t('ABC') + ' with ' + t('\\angle A=' + D(z.A)) + ', ' + t('a=' + z.a) + ' m and ' + t('b=' + z.b) + ' m. Round angles to the nearest degree and sides to the nearest tenth.', S, { V: 'A', W: 'C', X: 'B' }, 'm', { text: 'solve both triangles' });
    } }] },
    { num: '5', parts: [{ id: 'e5', level: 'PRG', make: function (r) {
      var z = pickWhere(function () { var A = r.int(110, 140), b = r.int(10, 20); return { A: A, b: b, a: r.int(b + 3, b + 12) }; }, function (z) { var S = ssa(z.A, z.a, z.b); return S.n === 1 && safeR(S.B1, 0) && safeR(S.sols[0].C, 0) && safeR(S.sols[0].c, 1) && !same3(z.A, z.a, z.b, AVOID); });
      return oneP('In ' + t('\\triangle DEF') + ', ' + t('\\angle D=' + D(z.A)) + ', ' + t('d=' + z.a) + ' cm and ' + t('e=' + z.b) + ' cm. Solve the triangle (angles to the nearest degree, sides to the nearest tenth).', ssa(z.A, z.a, z.b), { V: 'D', W: 'F', X: 'E' }, 'cm', { text: 'obtuse angle: solve the one triangle' });
    } }] },
    { num: '6', parts: [{ id: 'e6', level: 'ADV', make: function (r) {
      var z = twoCase(r, 20, 42, { b: [8, 16], ok: function (q) { return !(q.A === 29 && q.b === 10 && q.a === 6); } }), S = ssa(z.A, z.a, z.b);
      return twoPosP('A radar station ' + t('R') + ' is ' + t(z.b) + ' km from a straight highway entrance ' + t('E') + '. The highway makes an angle of ' + t(D(z.A)) + ' with line ' + t('ER') + '. The radar detects vehicles up to ' + t(z.a) + ' km away. Between what distances from ' + t('E') + ' (to the nearest tenth of a km) along the highway is a car within radar range?', S, [t('\\text{from}'), t('\\text{to}')], 'km',
        { names: ['From', 'To'], sol: twoPosSol(S, 'E', 'V', 'R', 'km') + '<br>The car is within range from about ' + fx(S.sols[1].c, 1) + ' km to ' + fx(S.sols[0].c, 1) + ' km from ' + t('E') + '.', hints: ['In ' + t('\\triangle ERV') + ' (' + t('V') + ' a car at the edge of the range), ' + t('RV=' + z.a) + ' is opposite ' + t('\\angle E') + '.'], text: 'radar range along a highway' });
    } }] },
    { num: '7', parts: [{ id: 'e7', level: 'ADV', make: function (r) {
      var z = twoCase(r, 35, 60, { dec: true, b: [1.8, 3.4], ok: function (q) { return q.a >= 1.2 && !(q.A === 48 && q.b === 2.2); } }), S = ssa(z.A, z.a, z.b);
      return twoPosP('A robot arm has a fixed upper link ' + t('PQ') + ' of length ' + t(fx(z.b, 1)) + ' m that makes an angle of ' + t(D(z.A)) + ' with a straight conveyor belt at ' + t('P') + '. A ' + t(fx(z.a, 1)) + ' m lower link hinged at ' + t('Q') + ' swings down until its tip touches the belt. Find both possible distances from ' + t('P') + ' to the tip, to the nearest tenth of a metre.', S, [t('\\text{shorter}'), t('\\text{longer}')], 'm',
        { sol: twoPosSol(S, 'P', 'T', 'Q', 'm'), hints: ['In ' + t('\\triangle PQT') + ' (' + t('T') + ' the tip), the lower link ' + t('QT') + ' is opposite ' + t('\\angle P') + '.'], text: 'robot arm: two positions' });
    } }] },
    { num: '8', parts: [{ id: 'e8', level: 'PRG', make: function (r) {
      var z = pickWhere(function () { var A = r.int(35, 70), b = r.int(12, 26); return { A: A, b: b, h: b * sn(A) }; }, function (z) { return safeR(z.h, 1) && !(z.A === 52 && z.b === 18) && !(z.A === 36 && z.b === 20); });
      return fP('In ' + t('\\triangle ABC') + ', ' + t('\\angle A=' + D(z.A)) + ' and ' + t('b=' + z.b) + ' cm. For what lengths of ' + t('a') + ' (nearest tenth) is there <b>exactly one</b> triangle?', [
        { label: t('a='), name: 'Right-triangle length', kind: 'near', x: z.h, dp: 1, unit: 'cm', after: 'cm  or', alts: [{ v: z.b * cs(z.A), code: LID + '-alt-cos', hint: t('h=b\\sin A') + '.' }, { v: z.b, code: LID + '-bound', hint: 'One case is the right triangle: ' + t('a') + ' exactly equal to the height ' + t('h=b\\sin A') + '.' }] },
        { label: t('a\\ge'), name: 'Lower bound for a ≥', kind: 'int', x: z.b, unit: 'cm', cands: [[rd(z.h, 1), LID + '-bound', 'Just above the height there are two triangles. One triangle again once ' + t('a\\ge b') + '.']] }],
        { sol: t('h=' + z.b + '\\sin ' + D(z.A) + '\\approx ' + fx(z.h, 1)) + ' cm. Exactly one triangle when ' + t('a=' + fx(z.h, 1)) + ' cm (right triangle) or ' + t('a\\ge ' + z.b) + ' cm.', hints: HC, text: 'range of a: one triangle', v: { k: 'h', A: z.A, b: z.b } });
    } }] },
    { num: '9', parts: [{ id: 'e9', level: 'PRG', make: function (r) {
      var kind = r.pick(['two', 'two', 'none', 'one', 'right']), z;
      if (kind === 'right') { var b0 = 2 * r.int(5, 11); z = { A: 30, b: b0, a: b0 / 2 }; }
      else z = pickWhere(function () { var A = r.int(35, 65), b = r.int(8, 16), h = b * sn(A); return { A: A, b: b, a: kind === 'two' ? dec1(r, h + 0.3, b - 0.3) : kind === 'none' ? dec1(r, Math.max(2, h - 2), h - 0.3) : rd(b + dec1(r, 0.5, 3), 1) }; }, function (z) { var n = nTri(z.A, z.a, z.b); return n === (kind === 'two' ? 2 : kind === 'none' ? 0 : 1) && Math.abs(z.a - z.b * sn(z.A)) > 0.2 && !(z.A === 54 && z.a === 8.5 && z.b === 10); });
      var S = ssa(z.A, z.a, z.b), right = kind === 'right' ? 3 : S.n === 0 ? 0 : S.n === 2 ? 2 : 1, wh = 'Find ' + t('h=b\\sin A') + ' and compare ' + t('a') + ' with ' + t('h') + ' and ' + t('b') + '.';
      return mcP(r, 'In ' + t('\\triangle ABC') + ', ' + t('\\angle A=' + D(z.A)) + ', ' + t('a=' + nT(z.a)) + ' cm and ' + t('b=' + z.b) + ' cm. How many triangles are possible?', [
        { html: 'none', right: right === 0, why: wh }, { html: 'exactly one', right: right === 1, why: wh }, { html: 'exactly two', right: right === 2, why: wh }, { html: 'exactly one, and it is a right triangle', right: right === 3, why: kind === 'right' ? 'Is it a special triangle? ' + t('h=' + z.b + '\\sin 30^\\circ') + ' exactly.' : wh }],
        kind === 'right' ? t('h=' + z.b + '\\sin 30^\\circ=' + nT(z.a) + '=a') + ': exactly one triangle, a right triangle (' + t('\\angle B=90^\\circ') + ').' : ssaWhy(S, { V: 'A', W: 'C', X: 'B' }) + (S.n === 2 ? ' (' + t('B\\approx ' + Dx(S.sols[0].B, 1)) + ' or ' + t(Dx(S.sols[1].B, 1)) + ')' : ''), HC, 'MC: how many triangles', true);
    } }] },
    { num: '10', parts: [{ id: 'e10', level: 'ADV', make: function (r) {
      var z = twoCase(r, 20, 40, { b: [7, 14], ok: function (q, S) { return S.sols[1].c >= 1 && !(q.A === 27 && q.a === 5 && q.b === 9); } }), S = ssa(z.A, z.a, z.b), s1 = S.sols[0], s2 = S.sols[1];
      return nP('<b>Numerical response.</b> In ' + t('\\triangle ABC') + ', ' + t('\\angle A=' + D(z.A)) + ', ' + t('a=' + z.a) + ' cm and ' + t('b=' + z.b) + ' cm. To the nearest tenth of a centimetre, the <b>shorter</b> possible length of side ' + t('c') + ' is ____ cm.', s2.c, 1, { nr: true, unit: 'cm', acc: [S.a * sn(180 - S.A - rd(s2.B, 1)) / sn(S.A)],
        alts: [{ v: s1.c, code: LID + '-swap-tri', hint: 'That is the longer ' + t('c') + ' (with the acute ' + t('\\angle B') + '). The shorter ' + t('c') + ' comes with the obtuse ' + t('\\angle B') + '.' }, { v: S.a * sn(180 - S.A - rd(s2.B, 0)) / sn(S.A), code: LID + '-early', hint: 'Keep the unrounded angles in the calculator.' }, { v: S.a * sn(S.A) / sn(s2.C), code: LID + '-sl-flip', hint: t('c=\\dfrac{a\\sin C}{\\sin A}') + '.' }],
        sol: t('\\sin B=\\dfrac{' + z.b + '\\sin ' + D(z.A) + '}{' + z.a + '}\\approx ' + fx(S.s, 4)) + ', ' + t('B\\approx ' + Dx(s1.B, 1)) + ' or ' + t(Dx(s2.B, 1)) + '. The shorter ' + t('c') + ' comes with ' + t('B=' + Dx(s2.B, 1)) + ': ' + t('C=' + Dx(s2.C, 1)) + ', ' + t('c=\\dfrac{' + z.a + '\\sin ' + Dx(s2.C, 1) + '}{\\sin ' + D(z.A) + '}\\approx ' + fx(s2.c, 1)) + ' cm. (The other is ' + fx(s1.c, 1) + ' cm.)',
        hints: ['Solve both triangles for ' + t('c') + ', or think: the obtuse ' + t('\\angle B') + ' leaves the smaller ' + t('\\angle C') + ', so the shorter ' + t('c') + '.'], text: 'NR: the shorter side c', v: { k: 'ssa-c2', A: z.A, a: z.a, b: z.b } });
    } }] },
    { num: '11', section: 'C. Stretch', parts: [{ id: 'e11', level: 'MAS', make: function (r) {
      var z = pickWhere(function () { var Dd = r.pick([20, 30, 40, 50, 60, 70, 80, 90, 100]), Bv = (180 - Dd) / 2; return { A: r.int(20, 45), b: r.int(8, 16), Dd: Dd, B: Bv }; }, function (z) { return z.A < z.B - 4 && safeR(z.b * sn(z.A) / sn(z.B), 2) && !(z.A === 30 && z.b === 10 && z.Dd === 60); });
      var a = z.b * sn(z.A) / sn(z.B);
      return nP('In ' + t('\\triangle ABC') + ', ' + t('\\angle A=' + D(z.A)) + ' and ' + t('b=' + z.b) + ' cm. Find the length of ' + t('a') + ', to the nearest hundredth, for which the two possible values of ' + t('\\angle B') + ' differ by ' + t(D(z.Dd)) + '.', a, 2, { unit: 'cm',
        alts: [{ v: z.b * sn(z.A) / sn(z.Dd), code: LID + '-diff-angle', hint: 'The difference is not an angle of the triangle. The two values are ' + t('B') + ' and ' + t('180^\\circ-B') + ': set ' + t('(180^\\circ-B)-B=' + D(z.Dd)) + '.' }, { v: z.b * sn(z.B) / sn(z.A), code: LID + '-sl-flip', hint: t('a=\\dfrac{b\\sin A}{\\sin B}') + '.' }],
        sol: 'The two values are ' + t('B') + ' and ' + t('180^\\circ-B') + ', so ' + t('(180^\\circ-B)-B=' + D(z.Dd) + '\\Rightarrow B=' + D(z.B)) + ' (and ' + t(D(180 - z.B)) + ').<br>' + t('a=\\dfrac{b\\sin A}{\\sin B}=\\dfrac{' + z.b + '\\sin ' + D(z.A) + '}{\\sin ' + D(z.B) + '}\\approx ' + fx(a, 2)) + ' cm. (Check: ' + t('h\\approx ' + fx(z.b * sn(z.A), 2) + '<' + fx(a, 2) + '<' + z.b) + ', two triangles.)',
        hints: ['The two possible values are ' + t('B') + ' and ' + t('180^\\circ-B') + '. Their difference is ' + t('180^\\circ-2B') + '.', 'Once ' + t('B') + ' is known, the sine law gives ' + t('a') + '.'], text: 'working backwards: a from the difference of the angles', v: { k: 'diffB', A: z.A, b: z.b, Dd: z.Dd } });
    } }] },
    { num: '12', parts: [{ id: 'e12', level: 'ADV', make: function (r) {
      var A = r.int(25, 65), b = r.int(8, 18), h = b * sn(A);
      return mcP(r, 'In ' + t('\\triangle ABC') + ', ' + t('\\angle A=' + D(A)) + ', ' + t('b=' + b) + ' cm and ' + t('a') + ' is exactly the height: ' + t('a=h=b\\sin A=' + b + '\\sin ' + D(A) + '\\approx ' + fx(h, 2)) + ' cm. What does the sine law give?', [
        { html: t('\\sin B=\\dfrac{b\\sin A}{b\\sin A}=1') + ', so ' + t('\\angle B=90^\\circ') + ' only (' + t('180^\\circ-90^\\circ') + ' is the same angle): exactly one triangle, a right triangle.', right: true },
        { html: t('\\sin B=1') + ', so ' + t('\\angle B=90^\\circ') + ' or ' + t('\\angle B=180^\\circ-90^\\circ') + ': two triangles.', why: t('180^\\circ-90^\\circ=90^\\circ') + ' is the same angle, so it is the same triangle.' },
        { html: t('\\sin B=\\sin A') + ', so ' + t('\\angle B=' + D(A)) + ': an isosceles triangle.', why: 'Substitute ' + t('a=b\\sin A') + ' into ' + t('\\sin B=\\dfrac{b\\sin A}{a}') + '.' },
        { html: t('\\sin B>1') + ': no triangle.', why: 'Substitute ' + t('a=b\\sin A') + ': ' + t('\\sin B=\\dfrac{b\\sin A}{a}') + ' is exactly ' + t('1') + '.' }],
        t('\\sin B=\\dfrac{b\\sin A}{a}=\\dfrac{b\\sin A}{b\\sin A}=1') + ', so ' + t('B=90^\\circ') + ' (and ' + t('180^\\circ-90^\\circ') + ' is the same angle). One right triangle: side ' + t('a') + ' just reaches the other arm.', ['Substitute ' + t('a=b\\sin A') + ' into the sine law ' + t('\\sin B=\\dfrac{b\\sin A}{a}') + '.'], 'a = h gives one right triangle', false, 1);
    } }] },
    { num: '13', parts: [{ id: 'e13', level: 'MAS', make: function (r) {
      var z = pickWhere(function () { return { P: r.int(28, 55), b: r.int(9, 16), g: r.int(2, 9) }; }, function (z) { var h = z.b * sn(z.P), q = Math.sqrt(h * h + z.g * z.g / 4); return q < z.b - 0.4 && z.g / 2 < z.b * cs(z.P) - 0.3 && safeR(q, 1) && !(z.P === 40 && z.b === 12 && z.g === 6); });
      var h = z.b * sn(z.P), q = Math.sqrt(h * h + z.g * z.g / 4);
      return nP('In ' + t('\\triangle PQR') + ', ' + t('\\angle P=' + D(z.P)) + ' and ' + t('PR=' + z.b) + ' cm. Side ' + t('QR') + ' can swing so that ' + t('Q') + ' lands in two places on the other arm, ' + t(z.g) + ' cm apart. Find the length of ' + t('QR') + ' to the nearest tenth.', q, 1, { unit: 'cm', acc: [Math.sqrt(rd(h, 2) * rd(h, 2) + z.g * z.g / 4)],
        alts: [{ v: Math.sqrt(h * h + z.g * z.g), code: LID + '-half', hint: 'The foot of the height is the <b>midpoint</b> of the two positions, so each position is ' + t(nT(z.g / 2)) + ' cm from it.' }, { v: h + z.g / 2, code: LID + '-half', hint: 'Use the Pythagorean theorem in the right triangle with legs ' + t('h') + ' and ' + t(nT(z.g / 2)) + '.' }, { v: Math.sqrt(z.b * cs(z.P) * z.b * cs(z.P) + z.g * z.g / 4), code: LID + '-alt-cos', hint: 'The height is ' + t('h=PR\\sin P') + '.' }],
        sol: t('h=' + z.b + '\\sin ' + D(z.P) + '\\approx ' + fx(h, 2)) + '. The foot of the height is the midpoint of the two positions, so each is ' + t(nT(z.g / 2)) + ' cm from it.<br>' + t('QR=\\sqrt{h^2+' + nT(z.g / 2) + '^2}\\approx\\sqrt{' + fx(h * h, 2) + '+' + nT(z.g * z.g / 4) + '}\\approx ' + fx(q, 1)) + ' cm. (Check: ' + t(fx(h, 2) + '<' + fx(q, 1) + '<' + z.b) + ', two triangles.)' + ambFig(ssa(z.P, q, z.b), { V: 'P', W: 'R', X: 'Q' }, { a: 'QR', u: 'cm' }),
        hints: ['Draw the height ' + t('h') + ' from ' + t('R') + '. The two positions of ' + t('Q') + ' are the same distance from its foot.'], text: 'working backwards: the swinging side from the gap', v: { k: 'gapback', P: z.P, b: z.b, g: z.g } });
    } }] }
  ];

  HW.defineLesson({ id: LID, unit: 3, num: '7', title: 'The Ambiguous Case', outcome: 'T3', calc: true, questions: QUESTIONS, extra: EXTRA });
})(window);
