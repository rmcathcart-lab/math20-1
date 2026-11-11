/* Math 20-1 · Unit 3 · Lesson 5 — The Sine Law (outcome T3 on every part)
 * Assignment 5 (m201book unit3/u3_l05.tex, Questions 1–15) and the Lesson 5 Extra Practice (u3_ep05.tex, A1–A4, B1–B6,
 * C1–C2). Every part is a generator: the booklet question's idea, form and difficulty with new numbers (the lesson's
 * example numbers and the booklet question's own numbers are left out). Calculator allowed (Unit 3, degree mode): each
 * part states the rounding (sides to the nearest tenth, angles to the nearest degree unless it says otherwise) and accepts
 * the value rounded that way; a multi-step answer also accepts the value reached the booklet's way (an angle kept to the
 * tenth before the next step). Every SSA item has exactly one triangle (the known angle is obtuse, or opposite the longer
 * given side, or the triangle is given as acute); the ambiguous case is Lesson 7.
 * Triangles, bearings, the ladder, the cliff, the tree and the quadrilateral are drawn to scale from the generated numbers
 * (js/geom.js HW.fig). Self-contained: the triangle solver, figures and slip checks are in this file (the same helper
 * block is in u3l6.js).
 * Recognised mistakes: radian mode, the ratio upside down, the wrong side–angle pair (a side with an angle it touches,
 * the third angle not found first), sin⁻¹ answer replaced by its supplement, the third angle given instead, rounding an
 * intermediate angle or side too early, SOH CAH TOA ratio mix-ups (multiplied for divided, sin for cos, the complement),
 * bearings measured from the wrong direction, a right angle assumed at the wall, area without the ½.
 * Conversions: 2(a) "write the sine law", 2(b) "which side / which angle", 6(a), 8, 10(a), Extra A3 and C2 (explain,
 * show, decide) -> multiple choice; 4 "state the reason" -> 4(d), a table of reasons (tick all that are true);
 * 7(b) "check with the sine law" -> choose the equation; 9(b) "which station is closer, and by how much" -> both
 * distances, then multiple choice; sketches -> drawn in the worked solutions.
 * Levels: LIM BEG EMG PRG ADV MAS. Mastery: 15 (cliff, numerical response), Extra C1 (quadrilateral). */
(function (root) {
  'use strict';
  var LID = 'u3l5';
  var HW = root.HW, K = HW.kit, B = K.P, F = HW.fmt, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, TR = HW.trig;
  var RAD = Math.PI / 180;

  /* ======================= helpers (the same block in u3l5.js and u3l6.js) ======================= */
  function cl(x) { return Math.round(x * 1e9) / 1e9; }
  function same(a, b) { return Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b)); }
  function nT(x) { x = cl(x); if (Math.abs(x) < 1e-12) x = 0; return F(x); }
  function rd(x, dp) { return K.roundTo(x, dp); }
  function fx(x, dp) { return F(rd(x, dp).toFixed(Math.max(dp, 0))); }
  function fs(x, dp) { return rd(x, dp).toFixed(Math.max(dp, 0)); } // plain text, for figures and keys
  function D(x) { return nT(x) + '^\\circ'; }
  function Dx(x, dp) { return fx(x, dp) + '^\\circ'; }
  function sn(d) { return TR.sin(d); } function cs(d) { return TR.cos(d); } function tn(d) { return TR.tan(d); }
  function asn(v) { return TR.asin(v); } function acs(v) { return TR.acos(v); } function atn(v) { return TR.atan(v); }
  function pickWhere(gen, okf) { for (var i = 0; i < 8000; i++) { var o = gen(); if (okf(o)) return o; } throw new Error(LID + ': no valid numbers'); }
  function fig(svg) { return '<div class="fig" style="text-align:center;margin:6px 0">' + svg + '</div>'; }
  function uniqBy(arr, key) { var s = {}; return arr.filter(function (x) { var k = key(x); if (s[k]) return false; s[k] = 1; return true; }); }
  function low(n) { return n.toLowerCase(); }
  function tenth(r, a, b) { return r.int(Math.round(a * 10), Math.round(b * 10)) / 10; }
  /* a length as given in the question: one decimal place when it was generated in tenths (9.0 stays 9.0) */
  function L(x, dp) { return dp ? x.toFixed(dp) : String(x); }
  function Lt(x, dp) { return F(L(x, dp)); }
  /* a value that is not too close to a rounding boundary (so the intermediate rounding the booklet does can't flip it) */
  function safe(x, dp) { var s = x * Math.pow(10, dp), f = s - Math.floor(s); return Math.abs(f - 0.5) > 0.06; }
  var SETS = [['A', 'B', 'C'], ['P', 'Q', 'R'], ['D', 'E', 'F'], ['K', 'L', 'M'], ['X', 'Y', 'Z'], ['G', 'H', 'J'], ['R', 'S', 'T'], ['L', 'M', 'N'], ['U', 'V', 'W'], ['J', 'K', 'L'], ['S', 'T', 'U']];

  /* ---- answer parts ---- */
  /* a rounded number. o: alts [{v, code, hint}], acc (other values accepted: an intermediate rounded the booklet's way), unit, nr, sol, hints, text */
  function nP(prompt, x, dp, o) {
    o = o || {};
    var acc = (o.acc || []).filter(function (v) { return isFinite(v); });
    var alts = (o.alts || []).filter(function (a) { return a && isFinite(a.v) && Math.abs(rd(a.v, dp) - rd(x, dp)) > 1e-9 && !acc.some(function (v) { return Math.abs(rd(v, dp) - rd(a.v, dp)) < 1e-9; }); });
    var p = K.P.near(prompt, x, dp, { unit: o.unit, after: o.after, alts: alts, nr: o.nr }, o.sol, o.hints || [], o.text);
    var base = p.check;
    if (acc.length) p.check = function (resp) { var r0 = base(resp); if (r0.v === 'correct') return r0; var pn = HW.parse.number(String(resp == null ? '' : resp).trim()); if (pn.ok && acc.some(function (v) { return Math.abs(pn.value - rd(v, dp)) < 1e-9; })) return ok(); return r0; };
    p.bad = uniqBy(alts.map(function (a) { return fs(a.v, dp); }), function (s) { return s; }).filter(function (s) { return s !== p.key && Math.abs(Number(s) - x) > Math.pow(10, -dp) * 0.6 && !acc.some(function (v) { return fs(v, dp) === s; }); });
    if (o.nr) p.bad = p.bad.filter(function (s) { return s.replace('-', '').length <= 4; });
    return p;
  }
  function deg(prompt, x, dp, o) { o = o || {}; o.unit = '°'; return nP(prompt, x, dp, o); }
  function cdiag(c) { return function (v) { for (var i = 0; i < (c || []).length; i++) if (c[i] && isFinite(c[i][0]) && same(v, c[i][0])) return { code: c[i][1], hint: c[i][2] }; return null; }; }
  /* a whole number (exact). o: cands [[value, code, hint]], unit, nr */
  function intP(prompt, x, o) {
    o = o || {};
    var p = B.number(prompt, x, cdiag(o.cands), o.sol, o.hints || [], o.text, { after: o.unit, nr: o.nr });
    if (o.unit) p.answer = t(nT(x) + (o.unit === '°' ? '^\\circ' : '\\text{ ' + o.unit + '}'));
    p.bad = (o.cands || []).map(function (c) { return String(c[0]); }).filter(function (s) { return Number(s) !== x; });
    return p;
  }
  /* several boxes. spec: { label, name, kind: 'near' (default) | 'int' | 'exact', x, dp, alts, acc, cands, unit, check, key, ansTex } */
  function fP(prompt, specs, o) {
    o = o || {};
    var fields = [], checks = [], keys = [], ans = [], bad = [];
    specs.forEach(function (s) {
      var math = s.kind === 'exact';
      fields.push({ label: s.label, name: s.name || s.label, after: s.after != null ? s.after : s.unit, before: s.before, mode: math ? 'math' : undefined, keys: math ? (s.keys || 'radical') : undefined });
      if (math) { checks.push(s.check); keys.push(s.key); ans.push((s.label ? s.label + ' ' : '') + t(s.ansTex || s.key)); bad.push(s.badKey || '0'); }
      else if (s.kind === 'int') { checks.push(K.number(s.x, cdiag(s.cands))); keys.push(String(s.x)); ans.push((s.label ? s.label + ' ' : '') + t(nT(s.x) + (s.unit === '°' ? '^\\circ' : s.unit ? '\\text{ ' + s.unit + '}' : ''))); bad.push(String(s.x + 1)); }
      else { var q = nP('', s.x, s.dp, s); checks.push(q.check); keys.push(q.key); ans.push((s.label ? s.label + ' ' : '') + q.answer); bad.push(String(Number(q.key) + 1)); }
    });
    var p = B.fields(prompt, fields, checks, keys, ans.join('<br>'), o.sol, o.hints || [], o.text);
    if (o.swap) {
      var c0 = p.check, i0 = o.swap[0], i1 = o.swap[1];
      p.check = function (resp) { var r0 = c0(resp); if (r0.v === 'correct' || !resp || resp.length < 2) return r0; var sw = resp.slice(); sw[i0] = resp[i1]; sw[i1] = resp[i0]; if (checks[i0](sw[i0]).v === 'correct' && checks[i1](sw[i1]).v === 'correct') return wrong('swap-answer', o.swapHint || 'Right numbers, but in each other’s boxes.'); return r0; };
      var sb = keys.slice(); sb[i0] = keys[i1]; sb[i1] = keys[i0]; if (sb[i0] !== keys[i0]) bad = [bad, sb]; else bad = [bad];
    } else bad = [bad];
    p.bad = bad.concat(o.bad || []);
    if (o.sum180) { // three angles: one may be found from the other two (180° minus their typed values)
      var c1 = p.check;
      p.check = function (resp) {
        var r0 = c1(resp); if (r0.v === 'correct' || !resp || resp.length !== 3) return r0;
        var v = resp.map(function (x) { var q = HW.parse.number(String(x == null ? '' : x).trim()); return q.ok ? q.value : NaN; });
        for (var i = 0; i < 3; i++) { var j = (i + 1) % 3, k = (i + 2) % 3; if (checks[j](resp[j]).v === 'correct' && checks[k](resp[k]).v === 'correct' && Math.abs(v[i] - (180 - v[j] - v[k])) < 1e-9) return ok(); }
        return r0;
      };
    }
    return p;
  }
  function mcP(r, prompt, opts, sol, hints, text, keepOrder) {
    var seen = {}, out = [];
    opts.forEach(function (op) { var k = op.html.replace(/\s/g, ''); if (seen[k] && !op.right) return; seen[k] = 1; out.push(op); });
    return B.mc(r, prompt, out, sol, hints || [], text, keepOrder);
  }
  /* multiple choice of rounded values: opts [[value, why|true]] — drops distractors that round to the answer or to each other */
  function mcNum(r, prompt, x, dp, opts, unit, sol, hints, text) {
    var u = unit === '°' ? '^\\circ' : unit ? '\\text{ ' + unit + '}' : '', seen = {}, out = [{ html: t(fx(x, dp) + u), right: true }];
    seen[fs(x, dp)] = 1;
    opts.forEach(function (o) { if (!isFinite(o[0]) || o[0] <= 0) return; var k = fs(o[0], dp); if (seen[k]) return; seen[k] = 1; out.push({ html: t(fx(o[0], dp) + u), why: o[1] }); });
    return mcP(r, prompt, out.slice(0, 4), sol, hints, text);
  }

  /* ---- triangles: T = { nm: [P, Q, R], A: { P: angle }, s: { P: side opposite P } } ---- */
  function others(T, v) { return T.nm.filter(function (w) { return w !== v; }); }
  function sideName(T, v) { var o = others(T, v); return o[0] + o[1]; } // the side opposite v, named by its endpoints
  function triAngles(nm, angs, v, len) { // angles [a0, a1, a2] at nm; the side opposite v has length len
    var T = { nm: nm, A: {}, s: {} }; nm.forEach(function (w, i) { T.A[w] = angs[i]; });
    var k = len / sn(T.A[v]); nm.forEach(function (w) { T.s[w] = k * sn(T.A[w]); }); return T;
  }
  function triSides(nm, sides) { // sides [s0, s1, s2] opposite nm
    var T = { nm: nm, A: {}, s: {} }; nm.forEach(function (w, i) { T.s[w] = sides[i]; });
    nm.forEach(function (w) { var o = others(T, w), b = T.s[o[0]], c = T.s[o[1]], a = T.s[w]; T.A[w] = acs(Math.max(-1, Math.min(1, (b * b + c * c - a * a) / (2 * b * c)))); }); return T;
  }
  function triSAS(nm, v, ang, s1, s2) { // angle ang at v; the two sides at v: s1 opposite others[0], s2 opposite others[1]
    var o = others({ nm: nm }, v), a = Math.sqrt(s1 * s1 + s2 * s2 - 2 * s1 * s2 * cs(ang)), sd = {};
    sd[v] = a; sd[o[0]] = s1; sd[o[1]] = s2; var T = triSides(nm, nm.map(function (w) { return sd[w]; })); T.A[v] = ang; return T;
  }
  function maxAng(T) { return Math.max.apply(null, T.nm.map(function (w) { return T.A[w]; })); }
  function minAng(T) { return Math.min.apply(null, T.nm.map(function (w) { return T.A[w]; })); }
  /* the triangle drawn to scale. lab = { s: { v: label of the side opposite v }, A: { v: label at v } } (plain text).
   * o: base (the vertex opposite the horizontal side; default the largest angle), flip, names (false | map), width, height, extra, segs, right, aria */
  function triFig(T, lab, o) {
    o = o || {}; lab = lab || {};
    var apex = o.base || T.nm.slice().sort(function (p, q) { return T.A[q] - T.A[p]; })[0], ot = others(T, apex), u = ot[0], w = ot[1];
    if (o.flip) { u = ot[1]; w = ot[0]; }
    var pts = {}; pts[u] = [0, 0]; pts[w] = [T.s[apex], 0]; pts[apex] = [T.s[w] * cs(T.A[u]), T.s[w] * sn(T.A[u])];
    Object.keys(o.pts || {}).forEach(function (k) { pts[k] = o.pts[k](pts); });
    var sl = lab.s || {}, al = lab.A || {};
    var segs = [[u, w, sl[apex]], [u, apex, sl[w]], [w, apex, sl[u]]].map(function (q) { return q[2] == null || q[2] === '' ? [q[0], q[1]] : q; }).concat(o.segs || []);
    var angs = []; T.nm.forEach(function (v) { if (al[v]) { var q = others(T, v), A0 = T.A[v]; angs.push([v, q[0], q[1], al[v], { r: A0 > 128 ? 11 : A0 > 100 ? 14 : A0 < 30 ? 30 : 22 }]); } });
    (o.angles || []).forEach(function (a) { angs.push(a); });
    var names = o.names === undefined ? true : o.names;
    return fig(HW.fig({ pts: pts, segs: segs, angles: angs, right: o.right, names: names, width: o.width || 300, height: o.height || 250, extra: o.extra, aria: o.aria || 'triangle drawn to scale' }));
  }
  /* the usual labels: given side values (dp places) and unknown letters */
  function labs(T, sides, angs, unit, dp) {
    var L0 = { s: {}, A: {} };
    Object.keys(sides || {}).forEach(function (v) { var x = sides[v]; L0.s[v] = typeof x === 'string' ? x : L(x, dp) + (unit ? ' ' + unit : ''); });
    Object.keys(angs || {}).forEach(function (v) { var x = angs[v]; L0.A[v] = typeof x === 'string' ? x : nT(x) + '°'; });
    return L0;
  }

  /* ---- typical slips ---- */
  /* side by the sine law: known side k opposite angle Ak; the wanted side is opposite Aw */
  function slSide(k, Ak, Aw) { return k * sn(Aw) / sn(Ak); }
  function slSideAlts(k, Ak, Aw, wrongAngs) {
    var out = [{ v: k * sn(Ak) / sn(Aw), code: LID + '-flip', hint: 'The ratio is upside down. Put the unknown side on top: ' + t('\\dfrac{x}{\\sin ' + D(Aw) + '}=\\dfrac{' + nT(k) + '}{\\sin ' + D(Ak) + '}') + ', then multiply both sides by ' + t('\\sin ' + D(Aw)) + '.' },
      { v: k * Math.sin(Aw) / Math.sin(Ak), code: LID + '-radian', hint: 'Your calculator is in <b>radian</b> mode. Switch to degree mode (TI-84: <b>mode</b>, choose <b>DEGREE</b>).' }];
    (wrongAngs || []).forEach(function (w) { if (!w) return; out.push({ v: k * sn(w[0]) / sn(w[1]), code: LID + '-pair', hint: w[2] || 'Each side goes with the sine of the angle <b>opposite</b> it (the angle it doesn’t touch). Check which angle is opposite the side you know and which is opposite the side you want.' }); });
    return out;
  }
  /* angle by the sine law: sin W = sw·sin Ak / sk (the answer is acute) */
  function slAng(sw, sk, Ak) { return asn(sw * sn(Ak) / sk); }
  function slAngAlts(sw, sk, Ak, why, third) {
    var x = slAng(sw, sk, Ak), out = [{ v: 180 - x, code: LID + '-supp', hint: t('\\sin^{-1}') + ' gives the acute angle, and this angle is acute' + (why ? ' (' + why + ')' : '') + '. Don’t use ' + t('180^\\circ') + ' minus it.' }];
    var f = sk * sn(Ak) / sw; if (Math.abs(f) <= 1) out.push({ v: asn(f), code: LID + '-flip', hint: 'Put the sines on top and the unknown angle’s opposite side with it: ' + t('\\sin\\theta=\\dfrac{(\\text{side opposite }\\theta)\\sin ' + D(Ak) + '}{' + nT(sk) + '}') + '.' });
    var g = sw * Math.sin(Ak) / sk; if (Math.abs(g) <= 1) out.push({ v: Math.asin(g), code: LID + '-radian', hint: 'Your calculator is in <b>radian</b> mode. Switch to degree mode.' });
    if (third !== false) out.push({ v: 180 - Ak - x, code: LID + '-other-angle', hint: 'That is the <b>third</b> angle of the triangle. The angle asked for is opposite the side ' + t(nT(sw)) + '.' });
    return out;
  }
  /* side by the cosine law, from sides b, c and the contained angle A */
  function clSide(b, c, A) { return Math.sqrt(b * b + c * c - 2 * b * c * cs(A)); }
  function clAlts(b, c, A, nm) {
    nm = nm || 'a';
    var o = (b * b + c * c - 2 * b * c) * cs(A), rad = b * b + c * c - 2 * b * c * Math.cos(A);
    return [{ v: o > 0 ? Math.sqrt(o) : NaN, code: LID + '-order', hint: 'Order of operations: multiply ' + t('2(' + nT(b) + ')(' + nT(c) + ')\\cos ' + D(A)) + ' <b>first</b>, then subtract it from ' + t(nT(b) + '^2+' + nT(c) + '^2') + '. (Don’t work out ' + t(nT(b) + '^2+' + nT(c) + '^2-2(' + nT(b) + ')(' + nT(c) + ')') + ' and then multiply by the cosine.)' },
      { v: b * b + c * c - 2 * b * c * cs(A), code: LID + '-noroot', hint: 'That is ' + t(nm + '^2') + '. Take the square root.' },
      { v: Math.sqrt(b * b + c * c + 2 * b * c * cs(A)), code: LID + '-plus', hint: 'The cosine law <b>subtracts</b> the last term: ' + t(nm + '^2=b^2+c^2-2bc\\cos A') + '.' + (A > 90 ? ' (The cosine of an obtuse angle is negative, so subtracting it makes the side longer.)' : '') },
      { v: rad > 0 ? Math.sqrt(rad) : NaN, code: LID + '-radian', hint: 'Your calculator is in <b>radian</b> mode. Switch to degree mode.' },
      { v: Math.sqrt(Math.max(0, b * b + c * c - b * c * cs(A))), code: LID + '-no2', hint: 'The last term is ' + t('2bc\\cos A') + ': don’t forget the ' + t('2') + '.' }];
  }
  /* angle opposite a, from the three sides (cosine law) */
  function clAng(a, b, c) { return acs((b * b + c * c - a * a) / (2 * b * c)); }
  function clAngAlts(a, b, c) {
    var x = clAng(a, b, c), v = (b * b + c * c - a * a) / (2 * b * c), out = [];
    if (x > 90) out.push({ v: 180 - x, code: LID + '-sign', hint: 'The cosine is <b>negative</b> (' + t('\\approx ' + fx(v, 4)) + '), so the angle is obtuse. Keep the negative sign when you use ' + t('\\cos^{-1}') + '.' });
    out.push({ v: clAng(b, a, c), code: LID + '-opp', hint: 'The side you <b>subtract</b> in the numerator is the side opposite the angle you want: ' + t(nT(a)) + ' here.' });
    out.push({ v: clAng(c, a, b), code: LID + '-opp', hint: 'The side you <b>subtract</b> in the numerator is the side opposite the angle you want: ' + t(nT(a)) + ' here.' });
    out.push({ v: Math.acos(v), code: LID + '-radian', hint: 'Your calculator is in <b>radian</b> mode. Switch to degree mode.' });
    var w = (b * b + c * c - a * a) / (b * c); if (Math.abs(w) <= 1) out.push({ v: acs(w), code: LID + '-no2', hint: 'The denominator is ' + t('2bc') + ': don’t forget the ' + t('2') + '.' });
    return out;
  }
  /* LaTeX of the cosine-law steps */
  function clSideTex(nm, b, c, A, dp) { var v = b * b + c * c - 2 * b * c * cs(A); return nm + '^2=' + Lt(b, dp) + '^2+' + Lt(c, dp) + '^2-2(' + Lt(b, dp) + ')(' + Lt(c, dp) + ')\\cos ' + D(A) + '\\approx ' + fx(v, 2) + ',\\ \\ ' + nm + '\\approx ' + fx(Math.sqrt(v), 1); }
  function clAngTex(th, a, b, c, dp, ans) { var v = (b * b + c * c - a * a) / (2 * b * c); return '\\cos ' + th + '=\\dfrac{' + Lt(b, dp) + '^2+' + Lt(c, dp) + '^2-' + Lt(a, dp) + '^2}{2(' + Lt(b, dp) + ')(' + Lt(c, dp) + ')}\\approx ' + fx(v, 4) + ',\\ \\ ' + th + '\\approx ' + Dx(acs(v), ans == null ? 0 : ans); }
  /* a bearing in quadrant notation: N52°E */
  function brg(ns, a, ew) { return '\\text{' + ns + '}' + D(a) + '\\text{' + ew + '}'; }
  /* north (or any) direction line from a point, for figures: a dashed tick of length len with a label */
  function northLine(p, len, lab) { return [{ type: 'dash', from: p, to: [p[0], p[1] + len] }, { type: 'text', at: [p[0], p[1] + len * 1.16], text: lab || 'N', size: 12 }]; }

  var CODES = {
    'u3l5-radian': 'Calculator in radian mode', 'u3l5-flip': 'Sine law ratio upside down', 'u3l5-pair': 'Wrong side–angle pair (side not opposite its angle)',
    'u3l5-supp': 'Gave 180° minus the angle (it is acute)', 'u3l5-other-angle': 'Gave the third angle instead', 'u3l5-early': 'Rounded an intermediate value too early',
    'u3l5-rt-mult': 'Right triangle: multiplied instead of divided', 'u3l5-rt-ratio': 'Right triangle: wrong ratio (or the other acute angle)',
    'u3l5-bearing': 'Bearing angle measured from the wrong direction', 'u3l5-right': 'Assumed a right angle that isn’t there', 'u3l5-area-half': 'Area: forgot the ½',
    'u3l5-perim': 'Perimeter: left out a side', 'u3l5-alt-cos': 'Altitude: cos instead of sin', 'u3l5-alt-mult': 'Altitude: multiplied instead of divided',
    'u3l5-dist': 'Gave a distance instead of the height', 'u3l5-wrong-tri': 'Used the wrong side in the right triangle', 'u3l5-slope': 'Slope angle not taken into account',
    'u3l5-ref90': 'Same sine: subtracted 90° instead of using 180° − θ', 'u3l5-ref360': 'Same sine: used 360° − θ (that has the same cosine)'
  };
  HW.addCodes(CODES);
  HW.addPartial({ 'u3l5-radian': 's', 'u3l5-flip': 'b', 'u3l5-pair': 'b', 'u3l5-supp': 'b', 'u3l5-other-angle': 's', 'u3l5-early': 's', 'u3l5-rt-mult': 'b', 'u3l5-rt-ratio': 'b',
    'u3l5-bearing': 'b', 'u3l5-right': 'n', 'u3l5-area-half': 's', 'u3l5-perim': 's', 'u3l5-alt-cos': 'b', 'u3l5-alt-mult': 'b', 'u3l5-dist': 's', 'u3l5-wrong-tri': 'b', 'u3l5-slope': 'b',
    'u3l5-ref90': 'n', 'u3l5-ref360': 'n' });

  var HSIDE = ['Find a <b>known pair</b>: an angle and the side opposite it (the side it doesn’t touch).', 'Put the unknown side on top: ' + t('\\dfrac{x}{\\sin(\\text{its opposite angle})}=\\dfrac{\\text{known side}}{\\sin(\\text{its opposite angle})}') + ', then multiply.'];
  var HANG = ['Put the sines on top: ' + t('\\dfrac{\\sin B}{b}=\\dfrac{\\sin A}{a}') + ', so ' + t('\\sin B=\\dfrac{b\\sin A}{a}') + '.', 'Then use ' + t('\\sin^{-1}') + ' (2nd SIN) in degree mode.'];
  var H3RD = 'If the known side is not opposite a known angle, find the third angle first: ' + t('180^\\circ') + ' minus the other two.';

  /* a right triangle: angle th at P, right angle at Q; lab = { adj, opp, hyp, ang } */
  function rtFig(th, hyp, lab, flip) {
    var w = hyp * cs(th), h = hyp * sn(th), X = flip ? -1 : 1;
    var pts = { P: [0, 0], Q: [X * w, 0], R: [X * w, h] };
    var segs = [['P', 'Q', lab.adj], ['Q', 'R', lab.opp], ['P', 'R', lab.hyp]].map(function (q) { return q[2] == null ? [q[0], q[1]] : q; });
    return fig(HW.fig({ pts: pts, segs: segs, right: [['Q', 'P', 'R']], angles: [['P', 'Q', 'R', lab.ang]], names: false, width: 270, height: 230, aria: 'right triangle drawn to scale' }));
  }
  function unitOf(r) { return r.pick(['cm', 'm']); }
  /* an AAS/ASA triangle: angles at nm[0], nm[1] (a0, a1), side opposite nm[kv] given */
  function aasT(nm, a0, a1, kv, len) { return triAngles(nm, [a0, a1, 180 - a0 - a1], nm[kv], len); }
  function eqSide(w, Aw, k, Ak, dp) { return w + '=\\dfrac{' + Lt(k, dp) + '\\sin ' + D(Aw) + '}{\\sin ' + D(Ak) + '}'; }
  function ssaWhy(kind, nm, kv, ov) {
    if (kind === 'obt') return t('\\angle ' + kv) + ' is obtuse, so the other angles are acute';
    if (kind === 'long') return 'the known angle ' + t('\\angle ' + kv) + ' is opposite the longer given side, so ' + t('\\angle ' + ov) + ' is smaller and acute';
    return 'the triangle is acute (given)';
  }

  /* ---- Question 4: three SSA triangles with one shape each ---- */
  function ssaGen(r, kind, nm, avoid) {
    return pickWhere(function () {
      var K0, k, o;
      if (kind === 'long') { K0 = r.int(55, 82); k = tenth(r, 10, 26); o = rd(k * (0.55 + 0.33 * r.int(0, 100) / 100), 1); }
      else if (kind === 'obt') { K0 = r.int(100, 135); k = tenth(r, 14, 40); o = rd(k * (0.4 + 0.38 * r.int(0, 100) / 100), 1); }
      else { K0 = r.int(50, 70); k = tenth(r, 10, 24); o = rd(k * (1.03 + 0.15 * r.int(0, 100) / 100), 1); }
      return { kind: kind, nm: nm, K0: K0, k: k, o: o };
    }, function (z) {
      var f = z.o * sn(z.K0) / z.k; if (f >= 0.985) return false;
      var W = asn(f), third = 180 - z.K0 - W; if (third < (z.kind === 'obt' ? 18 : 12)) return false;
      if (z.kind === 'acute' && (W >= 86 || third >= 86 || W - z.K0 < 3)) return false;
      if (Math.abs(z.o - z.k) < 0.5) return false;
      return safe(W, 0) && !(avoid || []).some(function (a) { return a[0] === z.K0 && (a[1] === z.k || a[2] === z.o); });
    });
  }
  /* the SSA triangle: known angle at nm[0] with opposite side k, other given side o opposite nm[1] (wanted angle) */
  function ssaT(z) { var W = asn(z.o * sn(z.K0) / z.k); return triAngles(z.nm, [z.K0, W, 180 - z.K0 - W], z.nm[0], z.k); }
  function ssaPart(z, prompt, text) {
    var T = ssaT(z), kv = z.nm[0], wv = z.nm[1], x = T.A[wv], why = ssaWhy(z.kind, z.nm, kv, wv);
    var svg = triFig(T, { s: (function () { var s = {}; s[kv] = fs(z.k, 1); s[wv] = fs(z.o, 1); return s; })(), A: (function () { var a = {}; a[kv] = z.K0 + '°'; a[wv] = '?'; return a; })() });
    return deg((prompt || 'Determine the indicated angle to the nearest degree.') + svg, x, 0, { alts: slAngAlts(z.o, z.k, z.K0, why),
      sol: (z.kind === 'acute' ? 'The triangle is acute (given).' : z.kind === 'obt' ? t('\\angle ' + kv) + ' is obtuse, so ' + t('\\angle ' + wv) + ' is acute.' : t(fs(z.k, 1) + '>' + fs(z.o, 1)) + ': the known angle is opposite the longer side, so ' + t('\\angle ' + wv) + ' is acute.') + '<br>' +
        t('\\sin ' + wv + '=\\dfrac{' + Lt(z.o, 1) + '\\sin ' + D(z.K0) + '}{' + Lt(z.k, 1) + '}\\approx ' + fx(z.o * sn(z.K0) / z.k, 4)) + ', so ' + t('\\angle ' + wv + '\\approx ' + Dx(x, 0)) + '.',
      hints: HANG, text: text });
  }

  var QUESTIONS = [
    { num: '1', stem: 'Determine the indicated value in each right triangle. Round sides to the nearest tenth and angles to the nearest degree.', parts: [
      { id: '1a', level: 'BEG', make: function (r) {
        var z = pickWhere(function () { return { k: r.pick(['cosH', 'sinH', 'tanA']), th: r.int(25, 65), v: tenth(r, 5, 20), u: unitOf(r) }; }, function (z) {
          if (z.th === 41 || z.th === 34) return false; var x = z.k === 'cosH' ? z.v / cs(z.th) : z.k === 'sinH' ? z.v / sn(z.th) : z.v / tn(z.th); return safe(x, 1) && x < 60;
        });
        var x, lab = { ang: z.th + '°' }, hyp, eq, fn, alts, V = Lt(z.v, 1);
        if (z.k === 'cosH') { x = z.v / cs(z.th); hyp = x; lab.adj = fs(z.v, 1) + ' ' + z.u; lab.hyp = 'x'; fn = 'cos'; eq = '\\cos ' + D(z.th) + '=\\dfrac{' + V + '}{x}'; }
        else if (z.k === 'sinH') { x = z.v / sn(z.th); hyp = x; lab.opp = fs(z.v, 1) + ' ' + z.u; lab.hyp = 'x'; fn = 'sin'; eq = '\\sin ' + D(z.th) + '=\\dfrac{' + V + '}{x}'; }
        else { x = z.v / tn(z.th); hyp = Math.hypot(x, z.v); lab.opp = fs(z.v, 1) + ' ' + z.u; lab.adj = 'x'; fn = 'tan'; eq = '\\tan ' + D(z.th) + '=\\dfrac{' + V + '}{x}'; }
        var f = function (d) { return fn === 'cos' ? cs(d) : fn === 'sin' ? sn(d) : tn(d); }, fr = function (d) { return fn === 'cos' ? Math.cos(d) : fn === 'sin' ? Math.sin(d) : Math.tan(d); };
        var other = fn === 'cos' ? sn : fn === 'sin' ? cs : function (d) { return 1 / tn(d); };
        alts = [{ v: z.v * f(z.th), code: LID + '-rt-mult', hint: t('x') + ' is in the <b>denominator</b>: ' + t(eq) + ' gives ' + t('x=\\dfrac{' + V + '}{\\' + fn + ' ' + D(z.th) + '}') + '. Divide, don’t multiply.' },
          { v: z.v / other(z.th), code: LID + '-rt-ratio', hint: 'Label the sides from the ' + t(D(z.th)) + ' angle: opposite, adjacent, hypotenuse. Which ratio uses the two sides in this triangle?' },
          { v: z.v / fr(z.th), code: LID + '-radian', hint: 'Your calculator is in <b>radian</b> mode. Switch to degree mode.' }];
        return nP('Determine ' + t('x') + '.' + rtFig(z.th, hyp, lab, r.chance(0.4)), x, 1, { unit: z.u, alts: alts,
          sol: (fn === 'tan' ? t(V) + ' is opposite and ' + t('x') + ' is adjacent: ' : t(V) + ' is ' + (fn === 'cos' ? 'adjacent' : 'opposite') + ' and ' + t('x') + ' is the hypotenuse: ') + t(eq) + ', so ' + t('x=\\dfrac{' + V + '}{\\' + fn + ' ' + D(z.th) + '}\\approx ' + fx(x, 1)) + ' ' + z.u + '.',
          hints: ['SOH CAH TOA: label the sides from the given angle.', 'The unknown is in the denominator, so you will divide.'], text: 'right triangle: a side (divide)' });
      } },
      { id: '1b', level: 'LIM', make: function (r) {
        var z = pickWhere(function () { var k = r.pick(['sin', 'cos', 'tan']), h = tenth(r, 10, 25), a = k === 'tan' ? tenth(r, 4, 20) : rd(h * (0.3 + 0.6 * r.int(0, 100) / 100), 1), b = k === 'tan' ? tenth(r, 4, 20) : h; return { k: k, a: a, b: b, u: unitOf(r) }; }, function (z) {
          if (z.a === z.b || (z.a === 13 && z.b === 20) || (z.a === 7 && z.b === 11)) return false; var v = z.a / z.b; if (z.k !== 'tan' && v >= 0.95) return false; var th = z.k === 'sin' ? asn(v) : z.k === 'cos' ? acs(v) : atn(v); return th > 15 && th < 75 && safe(th, 0);
        });
        var v = z.a / z.b, th = z.k === 'sin' ? asn(v) : z.k === 'cos' ? acs(v) : atn(v), hyp = z.k === 'tan' ? Math.hypot(z.a, z.b) : z.b, lab = { ang: 'θ' };
        if (z.k === 'sin') { lab.opp = fs(z.a, 1) + ' ' + z.u; lab.hyp = fs(z.b, 1) + ' ' + z.u; } else if (z.k === 'cos') { lab.adj = fs(z.a, 1) + ' ' + z.u; lab.hyp = fs(z.b, 1) + ' ' + z.u; } else { lab.opp = fs(z.a, 1) + ' ' + z.u; lab.adj = fs(z.b, 1) + ' ' + z.u; }
        var raw = z.k === 'sin' ? Math.asin(v) : z.k === 'cos' ? Math.acos(v) : Math.atan(v);
        return deg('Determine ' + t('\\theta') + '.' + rtFig(th, hyp, lab, r.chance(0.4)), th, 0, { alts: [{ v: 90 - th, code: LID + '-rt-ratio', hint: 'That is the <b>other</b> acute angle. Label the sides from ' + t('\\theta') + ': which side is opposite ' + t('\\theta') + '?' }, { v: raw, code: LID + '-radian', hint: 'Your calculator is in <b>radian</b> mode. Switch to degree mode.' }],
          sol: t(Lt(z.a, 1)) + ' is ' + (z.k === 'cos' ? 'adjacent' : 'opposite') + ' and ' + t(Lt(z.b, 1)) + ' is ' + (z.k === 'tan' ? 'adjacent' : 'the hypotenuse') + ': ' + t('\\' + z.k + '\\theta=\\dfrac{' + Lt(z.a, 1) + '}{' + Lt(z.b, 1) + '}') + ', so ' + t('\\theta=\\' + z.k + '^{-1}\\left(\\dfrac{' + Lt(z.a, 1) + '}{' + Lt(z.b, 1) + '}\\right)\\approx ' + Dx(th, 0)) + '.',
          hints: ['SOH CAH TOA: name the two given sides from ' + t('\\theta') + ', then use the inverse key.'], text: 'right triangle: an angle' });
      } }] },
    { num: '2', parts: [
      { id: '2a', level: 'LIM', make: function (r) {
        var nm = r.pick(SETS), a = low(nm[0]), b = low(nm[1]), c = low(nm[2]), X = nm[0], Y = nm[1], Z = nm[2], recip = r.chance(0.35);
        var right = recip ? '\\dfrac{\\sin ' + X + '}{' + a + '}=\\dfrac{\\sin ' + Y + '}{' + b + '}=\\dfrac{\\sin ' + Z + '}{' + c + '}' : '\\dfrac{' + a + '}{\\sin ' + X + '}=\\dfrac{' + b + '}{\\sin ' + Y + '}=\\dfrac{' + c + '}{\\sin ' + Z + '}';
        return mcP(r, 'Which equation is the sine law for ' + t('\\triangle ' + nm.join('')) + '?', [
          { html: t(right), right: true },
          { html: t('\\dfrac{' + a + '}{\\sin ' + Y + '}=\\dfrac{' + b + '}{\\sin ' + Z + '}=\\dfrac{' + c + '}{\\sin ' + X + '}'), why: 'Each side goes with the angle <b>opposite</b> it: side ' + t(a) + ' is opposite ' + t('\\angle ' + X) + '.' },
          { html: t('\\dfrac{' + a + '}{\\cos ' + X + '}=\\dfrac{' + b + '}{\\cos ' + Y + '}=\\dfrac{' + c + '}{\\cos ' + Z + '}'), why: 'The sine law uses the <b>sine</b> of each angle.' },
          { html: t(a + '\\sin ' + X + '=' + b + '\\sin ' + Y + '=' + c + '\\sin ' + Z), why: 'Each side is <b>divided</b> by the sine of its opposite angle (or the sine divided by the side).' }],
          'Each side over the sine of the angle opposite it: ' + t('\\dfrac{' + a + '}{\\sin ' + X + '}=\\dfrac{' + b + '}{\\sin ' + Y + '}=\\dfrac{' + c + '}{\\sin ' + Z + '}') + ' (or the reciprocals, ' + t('\\dfrac{\\sin ' + X + '}{' + a + '}=\\cdots') + ').', ['Lowercase ' + t(a) + ' is the side opposite ' + t('\\angle ' + X) + '.'], 'write the sine law');
      } },
      { id: '2b', level: 'LIM', make: function (r) {
        var nm = r.pick(SETS), sh = r.shuffle(nm), V = sh[0], o = nm.filter(function (w) { return w !== V; });
        var pair = r.shuffle(nm).slice(0, 2), third = nm.filter(function (w) { return pair.indexOf(w) < 0; })[0], pr = pair.join('');
        var sideOK = low(V) + '\\ (=' + o[0] + o[1] + ')', sideBad = low(V) + '\\ (=' + V + o[0] + ')';
        return mcP(r, 'In ' + t('\\triangle ' + nm.join('')) + ', which side is opposite ' + t('\\angle ' + V) + '? Which angle is opposite side ' + t(pr) + '?', [
          { html: 'Side ' + t(sideOK) + '; ' + t('\\angle ' + third), right: true },
          { html: 'Side ' + t(sideBad) + '; ' + t('\\angle ' + third), why: 'Side ' + t(V + o[0]) + ' touches ' + t('\\angle ' + V) + '. The opposite side is the one ' + t('\\angle ' + V) + ' doesn’t touch.' },
          { html: 'Side ' + t(sideOK) + '; ' + t('\\angle ' + pair[0]), why: 'Side ' + t(pr) + ' runs from ' + t(pair[0]) + ' to ' + t(pair[1]) + ': it touches ' + t('\\angle ' + pair[0]) + '. The angle opposite it is at the third vertex.' },
          { html: 'Side ' + t(sideBad) + '; ' + t('\\angle ' + pair[1]), why: 'An opposite side doesn’t touch its angle. Look across the triangle.' }],
          'Side ' + t(low(V)) + ' (' + t(o[0] + o[1]) + ') is opposite ' + t('\\angle ' + V) + ' — it doesn’t touch ' + t(V) + '. Side ' + t(pr) + ' (' + t(low(third)) + ') is opposite ' + t('\\angle ' + third) + '.', ['The side opposite an angle is the one it doesn’t touch; it gets the matching lowercase letter.'], 'opposite sides and angles');
      } }] },
    { num: '3', stem: 'Determine the indicated side to the nearest tenth.', parts: [
      { id: '3a', level: 'BEG', make: function (r) {
        var nm = r.pick(SETS), z = pickWhere(function () { return { a0: r.int(35, 80), a1: r.int(40, 85), k: tenth(r, 8, 30), u: unitOf(r) }; }, function (z) {
          if (z.a0 + z.a1 > 150 || Math.abs(z.a0 - z.a1) < 6 || (z.a0 === 48 && z.a1 === 74) || (z.a0 === 38 && z.a1 === 67) || (z.a0 === 52 && z.a1 === 46)) return false; return safe(slSide(z.k, z.a0, z.a1), 1);
        });
        var T = aasT(nm, z.a0, z.a1, 0, z.k), w = low(nm[1]), C = T.A[nm[2]], x = T.s[nm[1]], s = {}, A = {};
        s[nm[0]] = fs(z.k, 1) + ' ' + z.u; s[nm[1]] = w; A[nm[0]] = z.a0 + '°'; A[nm[1]] = z.a1 + '°';
        return nP(triFig(T, { s: s, A: A }, { flip: r.chance(0.5) }), x, 1, { unit: z.u, alts: slSideAlts(z.k, z.a0, z.a1, [[C, z.a1], [z.a0, C, 'That is the third side. You want ' + t(w) + ', opposite ' + t(D(z.a1)) + '.']]),
          sol: 'Known pair: ' + t('\\angle ' + nm[0] + '=' + D(z.a0)) + ' and ' + t(low(nm[0]) + '=' + Lt(z.k, 1)) + '.<br>' + t('\\dfrac{' + w + '}{\\sin ' + D(z.a1) + '}=\\dfrac{' + Lt(z.k, 1) + '}{\\sin ' + D(z.a0) + '}') + ', so ' + t(eqSide(w, z.a1, z.k, z.a0, 1) + '\\approx ' + fx(x, 1)) + ' ' + z.u + '.', hints: HSIDE, text: 'sine law: side (AAS)' });
      } },
      { id: '3b', level: 'EMG', make: function (r) {
        var nm = r.pick(SETS), z = pickWhere(function () { return { a0: r.int(28, 70), a1: r.int(40, 80), k: tenth(r, 10, 40), u: unitOf(r) }; }, function (z) {
          if (z.a0 + z.a1 > 145 || z.a0 + z.a1 < 85 || (z.a0 === 35 && z.a1 === 62)) return false; return safe(z.k * sn(z.a0) / sn(180 - z.a0 - z.a1), 1);
        });
        var T = aasT(nm, z.a0, z.a1, 2, z.k), C = T.A[nm[2]], w = low(nm[0]), x = T.s[nm[0]], s = {}, A = {};
        s[nm[2]] = fs(z.k, 1) + ' ' + z.u; s[nm[0]] = w; A[nm[0]] = z.a0 + '°'; A[nm[1]] = z.a1 + '°';
        return nP(triFig(T, { s: s, A: A }, { flip: r.chance(0.5) }), x, 1, { unit: z.u, alts: slSideAlts(z.k, C, z.a0, [[z.a1, z.a0, 'The given side ' + t(nm[0] + nm[1]) + ' is <b>between</b> the two angles, so it isn’t opposite either of them. ' + H3RD]]),
          sol: t('\\angle ' + nm[2] + '=180^\\circ-' + D(z.a0) + '-' + D(z.a1) + '=' + D(C)) + ', opposite ' + t(nm[0] + nm[1] + '=' + Lt(z.k, 1)) + '.<br>' + t(eqSide(w, z.a0, z.k, C, 1) + '\\approx ' + fx(x, 1)) + ' ' + z.u + '.', hints: [H3RD].concat(HSIDE.slice(1)), text: 'sine law: side (ASA, third angle first)' });
      } },
      { id: '3c', level: 'EMG', make: function (r) {
        var nm = r.pick(SETS), z = pickWhere(function () { return { a0: r.int(15, 35), a1: r.int(110, 145), k: tenth(r, 15, 45), u: unitOf(r) }; }, function (z) {
          if (z.a0 + z.a1 > 160 || (z.a0 === 24 && z.a1 === 131) || (z.a1 === 109)) return false; return safe(slSide(z.k, z.a1, z.a0), 1);
        });
        var T = aasT(nm, z.a0, z.a1, 1, z.k), C = T.A[nm[2]], w = low(nm[0]), x = T.s[nm[0]], s = {}, A = {};
        s[nm[1]] = fs(z.k, 1) + ' ' + z.u; s[nm[0]] = w; A[nm[0]] = z.a0 + '°'; A[nm[1]] = z.a1 + '°';
        return nP(triFig(T, { s: s, A: A }, { flip: r.chance(0.5) }), x, 1, { unit: z.u, alts: slSideAlts(z.k, z.a1, z.a0, [[C, z.a0], [z.a1, C, 'That is the third side. You want ' + t(w) + ', opposite ' + t(D(z.a0)) + '.']]),
          sol: t(w) + ' is opposite ' + t('\\angle ' + nm[0] + '=' + D(z.a0)) + '; ' + t(Lt(z.k, 1)) + ' is opposite ' + t('\\angle ' + nm[1] + '=' + D(z.a1)) + '.<br>' + t(eqSide(w, z.a0, z.k, z.a1, 1) + '\\approx ' + fx(x, 1)) + ' ' + z.u + ' (' + t('\\sin ' + D(z.a1) + '=\\sin ' + D(180 - z.a1)) + ' is positive).', hints: HSIDE, text: 'sine law: side with an obtuse angle' });
      } },
      { id: '3d', level: 'BEG', make: function (r) {
        var nm = r.pick(SETS), z = pickWhere(function () { return { a0: r.int(55, 85), a1: r.int(22, 45), k: tenth(r, 5, 20), u: unitOf(r) }; }, function (z) {
          if ((z.a0 === 72 && z.a1 === 29)) return false; return safe(slSide(z.k, z.a0, z.a1), 1);
        });
        var T = aasT(nm, z.a0, z.a1, 0, z.k), C = T.A[nm[2]], w = low(nm[1]), x = T.s[nm[1]], s = {}, A = {};
        s[nm[0]] = fs(z.k, 1) + ' ' + z.u; s[nm[1]] = w; A[nm[0]] = z.a0 + '°'; A[nm[1]] = z.a1 + '°';
        return nP(triFig(T, { s: s, A: A }, { base: nm[0], flip: r.chance(0.5) }), x, 1, { unit: z.u, alts: slSideAlts(z.k, z.a0, z.a1, [[C, z.a1], [z.a1, z.a0]]),
          sol: t(Lt(z.k, 1)) + ' is opposite ' + t('\\angle ' + nm[0] + '=' + D(z.a0)) + '; ' + t(w) + ' is opposite ' + t('\\angle ' + nm[1] + '=' + D(z.a1)) + '.<br>' + t(eqSide(w, z.a1, z.k, z.a0, 1) + '\\approx ' + fx(x, 1)) + ' ' + z.u + '.', hints: HSIDE, text: 'sine law: side (AAS, other layout)' });
      } }] },
    { num: '4', stem: 'Determine the indicated angle to the nearest degree. Each triangle has only one possible shape.',
      shared: function (r) {
        var s = r.shuffle(SETS);
        return { a: ssaGen(r, 'long', [s[0][2], s[0][0], s[0][1]], [[71, 16, 12.3], [64, 12.5, 9.2]]), b: ssaGen(r, 'obt', [s[1][1], s[1][0], s[1][2]], [[115, 34, 21.5], [127, 20, 14]]), c: ssaGen(r, 'acute', [s[2][0], s[2][1], s[2][2]], [[58, 19, 21]]) };
      },
      parts: [
        { id: '4a', level: 'BEG', make: function (r, z) { return ssaPart(z.a, null, 'sine law angle: opposite the longer side'); } },
        { id: '4b', level: 'BEG', make: function (r, z) { return ssaPart(z.b, null, 'sine law angle: obtuse known angle'); } },
        { id: '4c', level: 'EMG', make: function (r, z) { return ssaPart(z.c, 'The triangle is acute. Determine the indicated angle to the nearest degree.', 'sine law angle: acute triangle'); } },
        { id: '4d', level: 'EMG', make: function (r, z) {
          var rows = [['a', z.a], ['b', z.b], ['c', z.c]].map(function (q) { var y = q[1]; return { id: q[0], html: '(' + q[0] + ') ' + t('\\angle ' + y.nm[0] + '=' + D(y.K0) + ',\\ ' + low(y.nm[0]) + '=' + Lt(y.k, 1) + ',\\ ' + low(y.nm[1]) + '=' + Lt(y.o, 1)) + (y.kind === 'acute' ? ', acute' : '') }; });
          var cols = [{ id: 'r1', html: 'The known angle is opposite the longer given side' }, { id: 'r2', html: 'The known angle is obtuse' }, { id: 'r3', html: 'The triangle is given as acute' }];
          var why = { a: 'In (a), compare the side opposite the known angle with the other given side.', b: 'In (b), the known angle is obtuse — and an obtuse angle is always opposite the longest side, so two reasons are true.', c: 'In (c), the known angle is opposite the <b>shorter</b> given side. The only thing that rules out a second shape is that the triangle is acute.' };
          return B.grid('Why does each triangle in this question have only one possible shape? For each triangle, choose <b>every</b> reason that is true.', rows, cols, { a: ['r1'], b: ['r1', 'r2'], c: ['r3'] }, { rowHead: 'Triangle', why: function (row) { return { code: 'row', hint: why[row] }; } },
            '(a) The known angle is opposite the longer side, so the unknown angle is smaller, hence acute.<br>(b) The known angle is obtuse (and so it is opposite the longest side): the others are acute.<br>(c) The known angle is opposite the shorter side, so a second (obtuse) shape could exist — but the triangle is given as acute.', ['The unknown angle is acute when the known angle is obtuse, or when the known angle is opposite the longer given side.'], 'one shape: reasons');
        } }] },
    { num: '5', parts: [
      { id: '5', level: 'PRG', make: function (r) {
        var nm = r.pick(SETS), z = pickWhere(function () { return { a0: r.int(40, 75), a2: r.int(45, 80), k: tenth(r, 10, 30) }; }, function (z) {
          if (z.a0 + z.a2 > 140 || Math.abs(z.a0 - z.a2) < 5 || (z.a0 === 53 && z.a2 === 68)) return false; var B0 = 180 - z.a0 - z.a2; return safe(slSide(z.k, z.a2, z.a0), 1) && safe(slSide(z.k, z.a2, B0), 1) && Math.abs(B0 - z.a0) > 3;
        });
        var T = triAngles(nm, [z.a0, 180 - z.a0 - z.a2, z.a2], nm[2], z.k), Bv = nm[1], Bang = T.A[Bv], a = T.s[nm[0]], b = T.s[Bv], s = {}, A = {};
        s[nm[2]] = fs(z.k, 1) + ' cm'; s[nm[0]] = low(nm[0]); s[nm[1]] = low(nm[1]); A[nm[0]] = z.a0 + '°'; A[nm[2]] = z.a2 + '°';
        return fP('In ' + t('\\triangle ' + nm.join('')) + ', ' + t('\\angle ' + nm[0] + '=' + D(z.a0)) + ', ' + t('\\angle ' + nm[2] + '=' + D(z.a2)) + ' and ' + t(low(nm[2]) + '=' + Lt(z.k, 1)) + ' cm. Sketch the triangle, then determine ' + t(low(nm[0])) + ' and ' + t(low(nm[1])) + ' to the nearest tenth.', [
          { label: t(low(nm[0]) + '='), name: t(low(nm[0])), x: a, dp: 1, unit: 'cm', alts: slSideAlts(z.k, z.a2, z.a0, [[Bang, z.a0]]) },
          { label: t(low(nm[1]) + '='), name: t(low(nm[1])), x: b, dp: 1, unit: 'cm', alts: slSideAlts(z.k, z.a2, Bang, [[z.a0, Bang, 'Use the known pair ' + t('\\angle ' + nm[2]) + ' and ' + t(low(nm[2])) + ' (the given side is opposite ' + t('\\angle ' + nm[2]) + ').']]) }],
          { swap: [0, 1], sol: triFig(T, { s: s, A: A }, { width: 280, height: 240 }) + t(eqSide(low(nm[0]), z.a0, z.k, z.a2, 1) + '\\approx ' + fx(a, 1)) + ' cm<br>' + t('\\angle ' + Bv + '=180^\\circ-' + D(z.a0) + '-' + D(z.a2) + '=' + D(Bang)) + ', so ' + t(eqSide(low(Bv), Bang, z.k, z.a2, 1) + '\\approx ' + fx(b, 1)) + ' cm', hints: ['The known pair is ' + t('\\angle ' + nm[2]) + ' and ' + t(low(nm[2])) + '.', 'For ' + t(low(nm[1])) + ', find ' + t('\\angle ' + nm[1]) + ' first.'], text: 'sine law: two sides (AAS)' });
      } }] },
    { num: '6', shared: function (r) {
        var nm = r.pick(SETS);
        return pickWhere(function () { var q = r.int(30, 60); return { nm: nm, Q: r.int(95, 125), q: q, rr: r.int(Math.round(q * 0.4), Math.round(q * 0.8)) }; }, function (z) {
          if (z.Q === 102 && z.q === 45) return false; var R = asn(z.rr * sn(z.Q) / z.q), P = 180 - z.Q - R; if (P < 10) return false;
          var p1 = z.q * sn(180 - z.Q - rd(R, 1)) / sn(z.Q), p0 = z.q * sn(180 - z.Q - R) / sn(z.Q); return safe(R, 0) && safe(R, 1) && safe(P, 0) && Math.abs(rd(p1, 1) - rd(p0, 1)) < 1e-9 && safe(p0, 1);
        });
      },
      stem: function (z) { var n = z.nm; return 'In ' + t('\\triangle ' + n.join('')) + ', ' + t('\\angle ' + n[1] + '=' + D(z.Q)) + ', ' + t(low(n[1]) + '=' + z.q) + ' m and ' + t(low(n[2]) + '=' + z.rr) + ' m.'; },
      parts: [
        { id: '6a', level: 'EMG', make: function (r, z) {
          var n = z.nm;
          return mcP(r, 'Why must ' + t('\\angle ' + n[2]) + ' be acute?', [
            { html: 'A triangle can have only one obtuse angle, and ' + t('\\angle ' + n[1]) + ' is already obtuse.', right: true },
            { html: 'The sine of an obtuse angle is negative, so ' + t('\\sin ' + n[2]) + ' can’t be obtuse.', why: 'Sine is <b>positive</b> in quadrant II: ' + t('\\sin(180^\\circ-\\theta)=\\sin\\theta') + '. That is exactly why an obtuse angle could have the same sine.' },
            { html: 'The ' + t('\\sin^{-1}') + ' key always gives the correct angle.', why: t('\\sin^{-1}') + ' only gives angles from ' + t('0^\\circ') + ' to ' + t('90^\\circ') + '. We need a reason the angle is acute.' },
            { html: 'Side ' + t(low(n[2])) + ' is shorter than ' + t(low(n[1])) + ', so ' + t('\\angle ' + n[2]) + ' is larger than ' + t('\\angle ' + n[1]) + '.', why: 'The shorter side is opposite the <b>smaller</b> angle.' }],
            t('\\angle ' + n[1] + '=' + D(z.Q)) + ' is obtuse. The three angles add to ' + t('180^\\circ') + ', so there is room for only one angle of ' + t('90^\\circ') + ' or more: ' + t('\\angle ' + n[2]) + ' is acute.', ['How many obtuse angles can a triangle have?'], 'why the angle is acute (obtuse given)');
        } },
        { id: '6b', level: 'PRG', make: function (r, z) {
          var n = z.nm, R = asn(z.rr * sn(z.Q) / z.q), P = 180 - z.Q - R, p = z.q * sn(P) / sn(z.Q), T = triAngles(n, [P, z.Q, R], n[1], z.q);
          var pEarly = z.q * sn(180 - z.Q - rd(R, 0)) / sn(z.Q);
          return fP('Solve the triangle: angles to the nearest degree, the side to the nearest tenth.', [
            { label: t('\\angle ' + n[2] + '='), name: t('\\angle ' + n[2]), x: R, dp: 0, unit: '°', alts: slAngAlts(z.rr, z.q, z.Q, t('\\angle ' + n[1]) + ' is obtuse') },
            { label: t('\\angle ' + n[0] + '='), name: t('\\angle ' + n[0]), x: P, dp: 0, unit: '°', acc: [180 - z.Q - rd(R, 0), 180 - z.Q - rd(R, 1)], alts: [{ v: 180 - R, code: LID + '-other-angle', hint: 'The three angles add to ' + t('180^\\circ') + ': subtract <b>both</b> known angles.' }] },
            { label: t(low(n[0]) + '='), name: t(low(n[0])), x: p, dp: 1, unit: 'm', acc: [z.q * sn(180 - z.Q - rd(R, 1)) / sn(z.Q)], alts: slSideAlts(z.q, z.Q, P, [[R, P]]).concat([{ v: pEarly, code: LID + '-early', hint: 'Keep ' + t('\\angle ' + n[2]) + ' unrounded (or to at least one decimal place) when you find ' + t('\\angle ' + n[0]) + ' and ' + t(low(n[0])) + '.' }]) }],
            { sol: t('\\sin ' + n[2] + '=\\dfrac{' + z.rr + '\\sin ' + D(z.Q) + '}{' + z.q + '}\\approx ' + fx(z.rr * sn(z.Q) / z.q, 4)) + ', so ' + t('\\angle ' + n[2] + '\\approx ' + Dx(R, 1) + '\\approx ' + Dx(R, 0)) + '<br>' + t('\\angle ' + n[0] + '\\approx 180^\\circ-' + D(z.Q) + '-' + Dx(R, 1) + '=' + Dx(P, 1) + '\\approx ' + Dx(P, 0)) + '<br>' + t(low(n[0]) + '=\\dfrac{' + z.q + '\\sin ' + Dx(P, 1) + '}{\\sin ' + D(z.Q) + '}\\approx ' + fx(p, 1)) + ' m' + triFig(T, labs(T, (function () { var s = {}; s[n[1]] = z.q + ' m'; s[n[2]] = z.rr + ' m'; return s; })(), (function () { var a = {}; a[n[1]] = z.Q; return a; })()), { width: 280, height: 240 }),
              hints: HANG.concat(['Then the angle sum, then the sine law again for the last side.']), text: 'solve the triangle (obtuse angle given)' });
        } }] },
    { num: '7', shared: function (r) {
        return pickWhere(function () { return { A: r.int(35, 60), B: r.int(45, 75), b: tenth(r, 10, 25) }; }, function (z) {
          if (z.A + z.B > 140 || (z.A === 44 && z.B === 58) || (z.A === 38 && z.B === 67)) return false; var h = z.b * sn(z.A); return safe(h, 2) && safe(h / sn(z.B), 1) && Math.abs(rd(h, 2) / sn(z.B) - h / sn(z.B)) < 0.04 && safe(rd(h, 2) / sn(z.B), 1);
        });
      },
      stem: function (z) {
        var h = z.b * sn(z.A), a = h / sn(z.B), xD = z.b * cs(z.A), c = xD + a * cs(z.B);
        return 'In ' + t('\\triangle ABC') + ', ' + t('\\angle A=' + D(z.A)) + ', ' + t('\\angle B=' + D(z.B)) + ' and ' + t('AC=' + Lt(z.b, 1)) + ' cm. The altitude from ' + t('C') + ' meets ' + t('AB') + ' at ' + t('D') + '.' +
          fig(HW.fig({ pts: { A: [0, 0], B: [c, 0], C: [xD, h], D: [xD, 0] }, segs: [['A', 'B'], ['A', 'C', fs(z.b, 1) + ' cm'], ['B', 'C'], ['C', 'D', null, { dash: true }]], right: [['D', 'B', 'C']], angles: [['A', 'B', 'C', z.A + '°'], ['B', 'A', 'C', z.B + '°']], width: 300, height: 230, aria: 'triangle with an altitude, to scale' }));
      },
      parts: [
        { id: '7a', level: 'EMG', make: function (r, z) {
          var h = z.b * sn(z.A), a = h / sn(z.B);
          return fP('Without the sine law, determine ' + t('CD') + ' (to the nearest hundredth) and then ' + t('BC') + ' (to the nearest tenth).', [
            { label: t('CD='), name: t('CD'), x: h, dp: 2, unit: 'cm', alts: [{ v: z.b * cs(z.A), code: LID + '-alt-cos', hint: 'In right ' + t('\\triangle ACD') + ', ' + t('CD') + ' is <b>opposite</b> ' + t('\\angle A') + ' and ' + t('AC') + ' is the hypotenuse: SOH.' }, { v: z.b * Math.sin(z.A), code: LID + '-radian', hint: 'Your calculator is in <b>radian</b> mode.' }] },
            { label: t('BC='), name: t('BC'), x: a, dp: 1, unit: 'cm', acc: [rd(h, 2) / sn(z.B)], alts: [{ v: h * sn(z.B), code: LID + '-alt-mult', hint: t('\\sin B=\\dfrac{CD}{BC}') + ', so ' + t('BC=\\dfrac{CD}{\\sin B}') + ': divide.' }, { v: h / cs(z.B), code: LID + '-alt-cos', hint: 'In right ' + t('\\triangle BCD') + ', ' + t('CD') + ' is opposite ' + t('\\angle B') + ' and ' + t('BC') + ' is the hypotenuse: SOH.' }] }],
            { sol: 'Right ' + t('\\triangle ACD') + ': ' + t('CD=' + Lt(z.b, 1) + '\\sin ' + D(z.A) + '\\approx ' + fx(h, 2)) + ' cm (keep ' + t(fx(h, 4) + '\\ldots') + ').<br>Right ' + t('\\triangle BCD') + ': ' + t('\\sin ' + D(z.B) + '=\\dfrac{CD}{BC}') + ', so ' + t('BC=\\dfrac{' + fx(h, 4) + '\\ldots}{\\sin ' + D(z.B) + '}\\approx ' + fx(a, 1)) + ' cm.',
              hints: ['The altitude makes two right triangles that share ' + t('CD') + '. Find ' + t('CD') + ' in ' + t('\\triangle ACD') + ' first.'], text: 'altitude method for a side' });
        } },
        { id: '7b', level: 'BEG', make: function (r, z) {
          var a = z.b * sn(z.A) / sn(z.B), C = 180 - z.A - z.B, b = Lt(z.b, 1);
          return mcP(r, 'Which sine-law equation checks your value of ' + t('BC') + ' in one step?', [
            { html: t('BC=\\dfrac{' + b + '\\sin ' + D(z.A) + '}{\\sin ' + D(z.B) + '}'), right: true },
            { html: t('BC=\\dfrac{' + b + '\\sin ' + D(z.B) + '}{\\sin ' + D(z.A) + '}'), why: t('BC') + ' is opposite ' + t('\\angle A') + ', so ' + t('\\sin A') + ' goes on top with it; ' + t('AC') + ' is opposite ' + t('\\angle B') + '.' },
            { html: t('BC=\\dfrac{' + b + '\\sin ' + D(C) + '}{\\sin ' + D(z.B) + '}'), why: 'That is ' + t('AB') + ' (opposite ' + t('\\angle C=' + D(C)) + ').' },
            { html: t('BC=\\dfrac{' + b + '\\sin ' + D(z.A) + '}{\\sin ' + D(C) + '}'), why: t('AC') + ' is opposite ' + t('\\angle B') + ', not ' + t('\\angle C') + '.' }],
            'Known pair: ' + t('\\angle B') + ' and ' + t('AC=' + b) + '. ' + t('BC') + ' is opposite ' + t('\\angle A') + ': ' + t('BC=\\dfrac{' + b + '\\sin ' + D(z.A) + '}{\\sin ' + D(z.B) + '}\\approx ' + fx(a, 1)) + ' cm ✓', HSIDE, 'check with the sine law');
        } }] },
    { num: '8', shared: function (r) { var B0 = r.int(115, 140), a = r.int(25, 40) / 10, c = r.int(30, 50) / 10; return { B0: B0, a: a, c: c }; },
      stem: function (z) {
        var Bx = z.c, Cx = Bx + z.a * cs(180 - z.B0), Cy = z.a * sn(180 - z.B0);
        return 'In ' + t('\\triangle ABC') + ' below, ' + t('\\angle B') + ' is obtuse, so the altitude ' + t('CD') + ' (length ' + t('h') + ') meets side ' + t('AB') + ' extended.' +
          fig(HW.fig({ pts: { A: [0, 0], B: [Bx, 0], D: [Cx, 0], C: [Cx, Cy] }, segs: [['A', 'B', 'c'], ['B', 'C', 'a'], ['A', 'C', 'b'], ['B', 'D', null, { dash: true }], ['C', 'D', 'h', { dash: true }]], right: [['D', 'B', 'C']], width: 300, height: 210, aria: 'obtuse triangle with the altitude outside' }));
      },
      parts: [
        { id: '8a', level: 'EMG', make: function (r) {
          return mcP(r, 'Why is ' + t('\\angle CBD=180^\\circ-\\angle B') + '?', [
            { html: t('\\angle ABC') + ' and ' + t('\\angle CBD') + ' lie along the straight line ' + t('AD') + ', so they add to ' + t('180^\\circ') + '.', right: true },
            { html: 'They are vertically opposite angles.', why: 'Vertically opposite angles are made by two crossing lines and are <b>equal</b>. Here the two angles sit side by side on the line ' + t('AD') + '.' },
            { html: 'The angles in ' + t('\\triangle BCD') + ' add to ' + t('180^\\circ') + '.', why: 'That sum includes ' + t('\\angle BCD') + ' and the right angle at ' + t('D') + ', not ' + t('\\angle ABC') + '.' },
            { html: 'They are alternate angles between parallel lines.', why: 'There are no parallel lines here. Look at the straight line ' + t('AD') + ' through ' + t('B') + '.' }],
            t('\\angle ABC') + ' and ' + t('\\angle CBD') + ' together make the straight angle at ' + t('B') + ' on line ' + t('AD') + ': they add to ' + t('180^\\circ') + '.', ['What is the angle along a straight line?'], 'obtuse proof: supplementary angle');
        } },
        { id: '8b', level: 'PRG', make: function (r) {
          return mcP(r, 'Write ' + t('h') + ' in terms of ' + t('b') + ' and ' + t('\\angle A') + ', and in terms of ' + t('a') + ' and ' + t('\\angle B') + '.', [
            { html: t('h=b\\sin A') + ' and ' + t('h=a\\sin(180^\\circ-B)=a\\sin B'), right: true },
            { html: t('h=b\\sin A') + ' and ' + t('h=a\\cos B'), why: 'In right ' + t('\\triangle BCD') + ', ' + t('h') + ' is opposite ' + t('\\angle CBD=180^\\circ-B') + ' and ' + t('a') + ' is the hypotenuse: SOH.' },
            { html: t('h=a\\sin A') + ' and ' + t('h=b\\sin B'), why: 'In right ' + t('\\triangle ACD') + ' the hypotenuse is ' + t('AC=b') + '; in right ' + t('\\triangle BCD') + ' it is ' + t('BC=a') + '.' },
            { html: t('h=b\\cos A') + ' and ' + t('h=a\\sin B'), why: t('h') + ' is <b>opposite</b> ' + t('\\angle A') + ' in right ' + t('\\triangle ACD') + ': SOH.' }],
            'Right ' + t('\\triangle ACD') + ': ' + t('\\sin A=\\dfrac{h}{b}') + ', so ' + t('h=b\\sin A') + '. Right ' + t('\\triangle BCD') + ': ' + t('\\sin(180^\\circ-B)=\\dfrac{h}{a}') + ', so ' + t('h=a\\sin(180^\\circ-B)=a\\sin B') + ', because ' + t('\\sin(180^\\circ-\\theta)=\\sin\\theta') + '.', ['Use the two right triangles, ' + t('\\triangle ACD') + ' and ' + t('\\triangle BCD') + '.', t('\\sin(180^\\circ-\\theta)=\\sin\\theta') + '.'], 'obtuse proof: h two ways');
        } },
        { id: '8c', level: 'ADV', make: function (r) {
          return mcP(r, 'Which steps show that ' + t('\\dfrac{a}{\\sin A}=\\dfrac{b}{\\sin B}') + ' in this triangle too?', [
            { html: 'Both expressions equal ' + t('h') + ', so ' + t('a\\sin B=b\\sin A') + '. Divide both sides by ' + t('\\sin A\\sin B') + '.', right: true },
            { html: 'Both expressions equal ' + t('h') + ', so ' + t('a\\sin B=b\\sin A') + '. Multiply both sides by ' + t('\\sin A\\sin B') + '.', why: 'Multiplying gives ' + t('a\\sin A\\sin^2 B=\\ldots') + '. To get ' + t('\\sin A') + ' under ' + t('a') + ', divide.' },
            { html: 'Both expressions equal ' + t('h') + ', so ' + t('a\\sin A=b\\sin B') + '. Divide both sides by ' + t('\\sin A\\sin B') + '.', why: 'Check part (b): ' + t('h=b\\sin A') + ' and ' + t('h=a\\sin B') + ', so ' + t('a\\sin B=b\\sin A') + '.' },
            { html: 'The proof only works when every angle is acute, so it can’t be shown here.', why: 'Using ' + t('\\sin(180^\\circ-B)=\\sin B') + ', the same steps work: the sine law holds in every triangle.' }],
            t('b\\sin A=h=a\\sin B') + '. Dividing both sides by ' + t('\\sin A\\sin B') + ' gives ' + t('\\dfrac{b}{\\sin B}=\\dfrac{a}{\\sin A}') + ': the sine law holds when ' + t('\\angle B') + ' is obtuse too.', ['Set the two expressions for ' + t('h') + ' equal.'], 'obtuse proof: finish');
        } }] },
    { num: '9', shared: function (r) {
        return pickWhere(function () { return { d: tenth(r, 10, 30), al: r.int(25, 60), be: r.int(40, 80) }; }, function (z) {
          var Bt = 180 - z.al - z.be; if (Bt < 30 || Bt > 80 || Math.abs(z.al - z.be) < 10 || (z.al === 40 && z.be === 65)) return false;
          var NB = z.d * sn(z.al) / sn(Bt), MB = z.d * sn(z.be) / sn(Bt); return safe(NB, 1) && safe(MB, 1) && safe(MB - NB, 1) && Math.abs(MB - NB) > 1;
        });
      },
      stem: function (z) {
        var Bt = 180 - z.al - z.be, MB = z.d * sn(z.be) / sn(Bt), P = { M: [0, 0], N: [0, z.d], B: [MB * sn(z.al), MB * cs(z.al)] };
        return 'Coast guard station ' + t('N') + ' is ' + t(Lt(z.d, 1)) + ' km due north of station ' + t('M') + '. A boat ' + t('B') + ' is on a bearing of ' + t(brg('N', z.al, 'E')) + ' from ' + t('M') + ' and ' + t(brg('S', z.be, 'E')) + ' from ' + t('N') + '.' +
          fig(HW.fig({ pts: P, segs: [['M', 'N', fs(z.d, 1) + ' km'], ['N', 'B'], ['M', 'B']], angles: [['M', 'N', 'B', z.al + '°'], ['N', 'M', 'B', z.be + '°']], extra: northLine(P.N, z.d * 0.42), width: 240, height: 270, aria: 'bearings from two stations' }));
      },
      parts: [
        { id: '9a', level: 'EMG', make: function (r, z) {
          var Bt = 180 - z.al - z.be;
          return fP('Determine the three angles of ' + t('\\triangle MNB') + '.', [
            { label: t('\\angle M='), name: t('\\angle M'), kind: 'int', x: z.al, unit: '°', cands: [[90 - z.al, LID + '-bearing', t(brg('N', z.al, 'E')) + ' is measured from <b>north</b>, and ' + t('MN') + ' points north: the angle at ' + t('M') + ' is ' + t(D(z.al)) + '.']] },
            { label: t('\\angle N='), name: t('\\angle N'), kind: 'int', x: z.be, unit: '°', cands: [[180 - z.be, LID + '-bearing', t(brg('S', z.be, 'E')) + ' is measured from <b>south</b>, and from ' + t('N') + ' the station ' + t('M') + ' is due south: the angle inside the triangle is ' + t(D(z.be)) + '.'], [90 - z.be, LID + '-bearing', 'Turn from south toward east: the angle between ' + t('NM') + ' (due south) and ' + t('NB') + ' is the bearing angle itself.']] },
            { label: t('\\angle B='), name: t('\\angle B'), kind: 'int', x: Bt, unit: '°', cands: [[z.be - z.al, LID + '-bearing', 'The three angles add to ' + t('180^\\circ') + '.'], [180 - z.al - (180 - z.be), LID + '-bearing', 'Check ' + t('\\angle N') + ' first: it is ' + t(D(z.be)) + '.']] }],
            { sol: t('\\angle M=' + D(z.al)) + ' (from north, turning east), ' + t('\\angle N=' + D(z.be)) + ' (from south, turning east), ' + t('\\angle B=180^\\circ-' + D(z.al) + '-' + D(z.be) + '=' + D(Bt)) + '.', hints: ['A bearing S' + z.be + '°E: face south, turn ' + z.be + '° toward east. From ' + t('N') + ', station ' + t('M') + ' is due south.'], text: 'bearings: angles of the triangle' });
        } },
        { id: '9b', level: 'PRG', make: function (r, z) {
          var Bt = 180 - z.al - z.be, NB = z.d * sn(z.al) / sn(Bt), MB = z.d * sn(z.be) / sn(Bt);
          return fP('Determine the distance from each station to the boat, to the nearest tenth of a kilometre.', [
            { label: t('NB='), name: t('NB'), x: NB, dp: 1, unit: 'km', alts: slSideAlts(z.d, Bt, z.al, [[z.be, z.al]]) },
            { label: t('MB='), name: t('MB'), x: MB, dp: 1, unit: 'km', alts: slSideAlts(z.d, Bt, z.be, [[z.al, z.be]]) }],
            { swap: [0, 1], sol: 'Known pair: ' + t('\\angle B=' + D(Bt)) + ' and ' + t('MN=' + Lt(z.d, 1)) + '.<br>' + t('NB=\\dfrac{' + Lt(z.d, 1) + '\\sin ' + D(z.al) + '}{\\sin ' + D(Bt) + '}\\approx ' + fx(NB, 1)) + ' km (opposite ' + t('\\angle M') + ')<br>' + t('MB=\\dfrac{' + Lt(z.d, 1) + '\\sin ' + D(z.be) + '}{\\sin ' + D(Bt) + '}\\approx ' + fx(MB, 1)) + ' km (opposite ' + t('\\angle N') + ')', hints: ['The side ' + t('MN') + ' is opposite ' + t('\\angle B') + ': that is the known pair.'], text: 'bearings: distances' });
        } },
        { id: '9c', level: 'ADV', make: function (r, z) {
          var Bt = 180 - z.al - z.be, NB = z.d * sn(z.al) / sn(Bt), MB = z.d * sn(z.be) / sn(Bt), dlt = Math.abs(MB - NB), near = NB < MB ? 'N' : 'M', far = near === 'N' ? 'M' : 'N';
          return mcP(r, 'Which station is closer to the boat, and by how much?', [
            { html: 'Station ' + t(near) + ', by about ' + t(fx(dlt, 1)) + ' km', right: true },
            { html: 'Station ' + t(far) + ', by about ' + t(fx(dlt, 1)) + ' km', why: 'Station ' + t(near) + ' is opposite the <b>smaller</b> angle of the triangle at the other station, so it is closer: compare ' + t('NB\\approx ' + fx(NB, 1)) + ' and ' + t('MB\\approx ' + fx(MB, 1)) + '.' },
            { html: 'Station ' + t(near) + ', by about ' + t(fx(Math.min(NB, MB), 1)) + ' km', why: 'That is the distance from station ' + t(near) + '. “By how much” is the <b>difference</b> of the two distances.' },
            { html: 'Station ' + t(near) + ', by about ' + t(fx(NB + MB, 1)) + ' km', why: 'Subtract the distances, don’t add them.' }],
            t('NB\\approx ' + fx(NB, 2)) + ' km and ' + t('MB\\approx ' + fx(MB, 2)) + ' km, so station ' + t(near) + ' is closer by about ' + t(fx(Math.max(NB, MB), 2) + '-' + fx(Math.min(NB, MB), 2) + '\\approx ' + fx(dlt, 1)) + ' km.', ['Use your two distances from part (b).'], 'bearings: which is closer');
        } }] },
    { num: '10', shared: function (r) {
        return pickWhere(function () { return { Ln: tenth(r, 4, 9), s: r.int(6, 18), g: r.int(40, 65) }; }, function (z) { var T = 180 - z.g - 90 - z.s; return T > 12 && !(z.Ln === 6 && z.s === 12) && safe(z.Ln * sn(z.g) / sn(90 + z.s), 1); });
      },
      stem: function (z) {
        var W0 = 90 + z.s, T0 = 180 - z.g - W0, LW = z.Ln * sn(T0) / sn(W0), WT = z.Ln * sn(z.g) / sn(W0), u = [cs(z.s), sn(z.s)];
        var P = { L: [0, 0], W: [LW * u[0], LW * u[1]], G0: [-0.75 * LW * u[0], -0.75 * LW * u[1]], G1: [1.18 * LW * u[0], 1.18 * LW * u[1]], H: [-0.75 * LW, 0], Wt: [LW * u[0], LW * u[1] + WT * 1.15] };
        P.T = [P.W[0], P.W[1] + WT];
        return 'A ' + t(Lt(z.Ln, 1)) + ' m ladder leans against a vertical wall. The ground slopes up toward the wall at ' + t(D(z.s)) + ' to the horizontal, and the ladder makes an angle of ' + t(D(z.g)) + ' with the sloped ground.' +
          fig(HW.fig({ pts: P, segs: [['G0', 'G1', null, { color: '#8a6a3a', width: 2.6 }], ['W', 'Wt', null, { color: '#8a8f99', width: 5 }], ['L', 'T', fs(z.Ln, 1) + ' m'], ['L', 'H', null, { dash: true, color: '#6a7182', width: 1.4 }]], angles: [['L', 'H', 'G0', z.s + '°', { r: 34 }], ['L', 'W', 'T', z.g + '°', { r: 24 }]], names: { L: 'L', W: 'W', T: 'T' }, width: 280, height: 250, aria: 'ladder against a wall on sloped ground' }));
      },
      parts: [
        { id: '10a', level: 'EMG', make: function (r, z) {
          return mcP(r, 'Why is the angle between the wall and the ground at the foot of the wall, ' + t('\\angle LWT') + ', equal to ' + t(D(90 + z.s)) + '?', [
            { html: 'The wall is vertical (' + t('90^\\circ') + ' to the horizontal), and the ground drops ' + t(D(z.s)) + ' below the horizontal toward ' + t('L') + ': ' + t('90^\\circ+' + D(z.s)) + '.', right: true },
            { html: 'The wall is perpendicular to the sloped ground, so the angle is ' + t('90^\\circ') + ' plus the ladder’s angle.', why: 'The wall is vertical, not perpendicular to the slope. The extra ' + t(D(z.s)) + ' comes from the slope.' },
            { html: 'The angles of the triangle add to ' + t('180^\\circ') + ', so ' + t('\\angle LWT=180^\\circ-' + D(z.g)) + '.', why: 'We don’t know ' + t('\\angle T') + ' yet. Find ' + t('\\angle LWT') + ' from the wall and the slope.' },
            { html: 'The wall makes ' + t('90^\\circ') + ' with the horizontal, so ' + t('\\angle LWT=90^\\circ-' + D(z.s)) + '.', why: 'The ground goes <b>down</b> from ' + t('W') + ' toward ' + t('L') + ', so the angle at ' + t('W') + ' opens wider than ' + t('90^\\circ') + '.' }],
            'Vertical wall: ' + t('90^\\circ') + ' above the horizontal. The ground toward ' + t('L') + ' is ' + t(D(z.s)) + ' below the horizontal. So ' + t('\\angle LWT=90^\\circ+' + D(z.s) + '=' + D(90 + z.s)) + '.', ['Draw a horizontal line through ' + t('W') + '.'], 'ladder: angle at the wall');
        } },
        { id: '10b', level: 'PRG', make: function (r, z) {
          var W0 = 90 + z.s, T0 = 180 - z.g - W0, WT = z.Ln * sn(z.g) / sn(W0);
          return nP('How far up the wall, measured from ' + t('W') + ', does the ladder reach? Round to the nearest tenth of a metre.', WT, 1, { unit: 'm', alts: slSideAlts(z.Ln, W0, z.g, [[T0, z.g]]).concat([{ v: z.Ln * sn(z.g), code: LID + '-right', hint: 'The angle at ' + t('W') + ' is ' + t(D(W0)) + ', not ' + t('90^\\circ') + ': this is not a right triangle. Use the sine law with the known pair ' + t('\\angle W') + ' and ' + t('LT') + '.' }, { v: z.Ln * sn(z.g) / sn(90 - z.s), code: LID + '-slope', hint: 'Use ' + t('\\angle LWT=90^\\circ+' + D(z.s)) + ' from part (a).' }]),
            sol: t('\\angle T=180^\\circ-' + D(z.g) + '-' + D(W0) + '=' + D(T0)) + '. Known pair: ' + t('\\angle W=' + D(W0)) + ' and ' + t('LT=' + Lt(z.Ln, 1)) + '.<br>' + t('WT=\\dfrac{' + Lt(z.Ln, 1) + '\\sin ' + D(z.g) + '}{\\sin ' + D(W0) + '}\\approx ' + fx(WT, 1)) + ' m', hints: ['The ladder ' + t('LT') + ' is opposite ' + t('\\angle W') + ': that is the known pair.', t('WT') + ' is opposite ' + t('\\angle L') + '.'], text: 'ladder on a slope' });
        } }] },
    { num: '11', shared: function (r) {
        return pickWhere(function () { return { c: r.int(12, 26) * 10 + r.pick([0, 5]), J: r.int(50, 75), Kk: r.int(40, 65) }; }, function (z) {
          var Lg = 180 - z.J - z.Kk; if (Lg < 50 || Math.abs(z.J - z.Kk) < 5 || (z.c === 185 && z.J === 63)) return false; var JL = z.c * sn(z.Kk) / sn(Lg), KL = z.c * sn(z.J) / sn(Lg), A = 0.5 * z.c * JL * sn(z.J);
          return safe(z.c + JL + KL, 0) && safe(A / 10, 0) && safe(z.c + rd(JL, 1) + rd(KL, 1), 0) && rd(z.c + rd(JL, 1) + rd(KL, 1), 0) === rd(z.c + JL + KL, 0) && rd(0.5 * z.c * rd(JL, 1) * sn(z.J), -1) === rd(A, -1);
        });
      },
      stem: function (z) { return 'A triangular field has corners ' + t('J') + ', ' + t('K') + ' and ' + t('L') + '. The side ' + t('JK') + ' is ' + t(z.c) + ' m, ' + t('\\angle J=' + D(z.J)) + ' and ' + t('\\angle K=' + D(z.Kk)) + '.'; },
      parts: [
        { id: '11a', level: 'PRG', make: function (r, z) {
          var Lg = 180 - z.J - z.Kk, JL = z.c * sn(z.Kk) / sn(Lg), KL = z.c * sn(z.J) / sn(Lg), P = z.c + JL + KL, T = triAngles(['J', 'K', 'L'], [z.J, z.Kk, Lg], 'L', z.c);
          return nP('Sketch the field and determine its perimeter to the nearest metre.', P, 0, { unit: 'm', alts: [{ v: JL + KL, code: LID + '-perim', hint: 'The perimeter includes all three sides: add ' + t('JK=' + z.c) + ' m too.' }, { v: z.c + z.c * sn(Lg) / sn(z.Kk) + z.c * sn(Lg) / sn(z.J), code: LID + '-flip', hint: 'Put the unknown side on top: ' + t('JL=\\dfrac{' + z.c + '\\sin ' + D(z.Kk) + '}{\\sin ' + D(Lg) + '}') + '.' }, { v: z.c + z.c * sn(z.J) / sn(z.Kk) + z.c * sn(z.Kk) / sn(z.J), code: LID + '-pair', hint: H3RD + ' ' + t('JK') + ' is opposite ' + t('\\angle L') + '.' }],
            sol: triFig(T, labs(T, { L: z.c + ' m', K: 'JL', J: 'KL' }, { J: z.J, K: z.Kk }), { width: 280, height: 240 }) + t('\\angle L=180^\\circ-' + D(z.J) + '-' + D(z.Kk) + '=' + D(Lg)) + ' (opposite ' + t('JK') + ').<br>' + t('JL=\\dfrac{' + z.c + '\\sin ' + D(z.Kk) + '}{\\sin ' + D(Lg) + '}\\approx ' + fx(JL, 2)) + ' m, ' + t('KL=\\dfrac{' + z.c + '\\sin ' + D(z.J) + '}{\\sin ' + D(Lg) + '}\\approx ' + fx(KL, 2)) + ' m<br>Perimeter ' + t('\\approx ' + z.c + '+' + fx(JL, 2) + '+' + fx(KL, 2) + '\\approx ' + fx(P, 0)) + ' m',
            hints: [H3RD, 'Find both other sides, then add all three.'], text: 'field: perimeter' });
        } },
        { id: '11b', level: 'ADV', make: function (r, z) {
          var Lg = 180 - z.J - z.Kk, JL = z.c * sn(z.Kk) / sn(Lg), h = JL * sn(z.J), A = 0.5 * z.c * h;
          return nP('Determine the area of the field to the nearest ten square metres. (Hint: find the height from ' + t('L') + ' to ' + t('JK') + '.)', A, -1, { unit: 'm²', alts: [{ v: z.c * h, code: LID + '-area-half', hint: 'Area of a triangle ' + t('=\\tfrac{1}{2}(\\text{base})(\\text{height})') + '.' }, { v: 0.5 * z.c * JL * cs(z.J), code: LID + '-alt-cos', hint: 'The height is <b>opposite</b> ' + t('\\angle J') + ' in the right triangle with hypotenuse ' + t('JL') + ': ' + t('h=JL\\sin J') + '.' }, { v: 0.5 * z.c * JL, code: LID + '-wrong-tri', hint: t('JL') + ' is a slanted side, not the height. The height is ' + t('JL\\sin J') + '.' }],
            sol: 'Height ' + t('h=JL\\sin J\\approx ' + fx(JL, 3) + '\\sin ' + D(z.J) + '\\approx ' + fx(h, 2)) + ' m<br>Area ' + t('=\\tfrac{1}{2}(' + z.c + ')(' + fx(h, 2) + '\\ldots)\\approx ' + fx(A, -1)) + ' m²', hints: ['In the right triangle with hypotenuse ' + t('JL') + ', the height is opposite ' + t('\\angle J') + '.', 'Area ' + t('=\\tfrac{1}{2}bh') + '.'], text: 'field: area' });
        } }] },
    { num: '12', parts: [
      { id: '12', level: 'EMG', make: function (r) {
        var nm = r.pick(SETS), X = nm[0], Y = nm[1], Z = nm[2], z = pickWhere(function () { return { J: r.int(18, 35), Lz: r.int(120, 150), k: tenth(r, 5, 15) }; }, function (z) {
          if (z.J + z.Lz > 168 || (z.J === 25 && z.Lz === 140)) return false; var Kk = 180 - z.J - z.Lz, v = [z.k * sn(z.Lz) / sn(z.J), z.k * sn(Kk) / sn(z.J), z.k * sn(z.J) / sn(z.Lz), z.k * sn(z.Lz) / sn(Kk)].map(function (x) { return fs(x, 1); });
          return v.filter(function (x, i) { return v.indexOf(x) === i; }).length === 4;
        });
        var Kk = 180 - z.J - z.Lz, x = z.k * sn(z.Lz) / sn(z.J);
        return mcNum(r, '<i>(Multiple Choice)</i> In ' + t('\\triangle ' + nm.join('')) + ', ' + t('\\angle ' + X + '=' + D(z.J)) + ', ' + t('\\angle ' + Z + '=' + D(z.Lz)) + ' and ' + t(Y + Z + '=' + Lt(z.k, 1)) + ' m. The length of ' + t(X + Y) + ', to the nearest tenth of a metre, is', x, 1, [
          [z.k * sn(Kk) / sn(z.J), 'That is ' + t(X + Z) + ' (opposite ' + t('\\angle ' + Y) + '). ' + t(X + Y) + ' is opposite ' + t('\\angle ' + Z) + '.'],
          [z.k * sn(z.J) / sn(z.Lz), 'Upside down: ' + t('\\dfrac{' + X + Y + '}{\\sin ' + D(z.Lz) + '}=\\dfrac{' + Lt(z.k, 1) + '}{\\sin ' + D(z.J) + '}') + ', so multiply by ' + t('\\sin ' + D(z.Lz)) + '.'],
          [z.k * sn(z.Lz) / sn(Kk), t(Y + Z) + ' is opposite ' + t('\\angle ' + X) + ' (it doesn’t touch ' + t(X) + '), not ' + t('\\angle ' + Y) + '.']], 'm',
          t(Y + Z + '=' + low(X)) + ' is opposite ' + t('\\angle ' + X) + '; ' + t(X + Y + '=' + low(Z)) + ' is opposite ' + t('\\angle ' + Z) + '.<br>' + t(low(Z) + '=\\dfrac{' + Lt(z.k, 1) + '\\sin ' + D(z.Lz) + '}{\\sin ' + D(z.J) + '}\\approx ' + fx(x, 1)) + ' m', HSIDE, 'MC: side named by vertices');
      } }] },
    { num: '13', parts: [
      { id: '13', level: 'PRG', make: function (r) {
        var nm = r.pick(SETS), X = nm[0], Z = nm[2], z = pickWhere(function () { return { A: r.int(32, 55), a: r.int(8, 16), c: r.int(9, 20) }; }, function (z) {
          if (z.c <= z.a || (z.A === 40 && z.a === 11 && z.c === 14)) return false; var f = z.c * sn(z.A) / z.a; if (f >= 0.99) return false; var C = asn(f), Bq = 180 - z.A - C;
          return C < 86 && Bq < 86 && Bq > 10 && Math.abs(Bq - C) > 2 && z.a * sn(z.A) / z.c < 1;
        });
        var C = asn(z.c * sn(z.A) / z.a), Bq = 180 - z.A - C;
        return mcNum(r, '<i>(Multiple Choice)</i> In acute ' + t('\\triangle ' + nm.join('')) + ', ' + t('\\angle ' + X + '=' + D(z.A)) + ', ' + t(low(X) + '=' + z.a) + ' cm and ' + t(low(Z) + '=' + z.c) + ' cm. To the nearest tenth of a degree, ' + t('\\angle ' + Z) + ' is', C, 1, [
          [asn(z.a * sn(z.A) / z.c), 'Upside down: ' + t('\\sin ' + Z + '=\\dfrac{' + low(Z) + '\\sin ' + X + '}{' + low(X) + '}=\\dfrac{' + z.c + '\\sin ' + D(z.A) + '}{' + z.a + '}') + '.'],
          [Bq, 'That is the third angle, ' + t('\\angle ' + nm[1]) + '.'],
          [180 - C, 'The triangle is acute, so ' + t('\\angle ' + Z) + ' is the acute angle that ' + t('\\sin^{-1}') + ' gives.']], '°',
          t('\\sin ' + Z + '=\\dfrac{' + z.c + '\\sin ' + D(z.A) + '}{' + z.a + '}\\approx ' + fx(z.c * sn(z.A) / z.a, 4)) + ', so ' + t('\\angle ' + Z + '\\approx ' + Dx(C, 1)) + ' (acute, as given).', HANG, 'MC: angle in an acute triangle');
      } }] },
    { num: '14', parts: [
      { id: '14', level: 'EMG', make: function (r) {
        var nm = r.pick([['A', 'B', 'C'], ['P', 'Q', 'R'], ['D', 'E', 'F']]), A = nm[0], Bv = nm[1], C = nm[2], a = low(A), b = low(Bv), c = low(C), sss = r.chance(0.3);
        var right = sss ? t(a + ',\\ ' + b + '\\text{ and }' + c) : t(a + ',\\ ' + b + '\\text{ and }\\angle ' + C);
        return mcP(r, '<i>(Multiple Choice)</i> For which set of given information can the sine law <b>not</b> be used as the first step?', [
          { html: right, right: true },
          { html: t('\\angle ' + A + ',\\ \\angle ' + Bv + '\\text{ and }' + a), why: t('\\angle ' + A) + ' and ' + t(a) + ' are a known pair, so the sine law works.' },
          { html: t('\\angle ' + Bv + ',\\ \\angle ' + C + '\\text{ and }' + a), why: 'Find ' + t('\\angle ' + A + '=180^\\circ-\\angle ' + Bv + '-\\angle ' + C) + ' first: then ' + t('\\angle ' + A) + ' and ' + t(a) + ' are a known pair.' },
          { html: t(a + ',\\ ' + b + '\\text{ and }\\angle ' + A) + ' (' + t(a + '>' + b) + ')', why: t('\\angle ' + A) + ' and ' + t(a) + ' are a known pair (and ' + t(a + '>' + b) + ' means one triangle).' }],
          (sss ? 'Three sides contain no angle at all' : 'Two sides and the angle between them contain no angle–opposite-side pair') + ', so the sine law can’t start. (With two angles, the third angle completes a pair.)', ['The sine law needs a known pair: an angle and the side opposite it.'], 'MC: when the sine law can start');
      } }] },
    { num: '15', parts: [
      { id: '15', level: 'MAS', make: function (r) {
        var z = pickWhere(function () { var e1 = r.int(12, 25); return { e1: e1, e2: e1 + r.int(8, 20), d: r.int(20, 60) * 10 }; }, function (z) {
          if (z.e2 > 45 || (z.e1 === 18 && z.e2 === 31)) return false; var h = z.d * sn(z.e1) / sn(z.e2 - z.e1) * sn(z.e2); return h >= 60 && h < 9999 && safe(h, 0);
        });
        var Tq = z.e2 - z.e1, BT = z.d * sn(z.e1) / sn(Tq), h = BT * sn(z.e2), BF = BT * cs(z.e2), AT = z.d * sn(z.e2) / sn(Tq);
        var P = { A: [0, 0], B: [z.d, 0], F: [z.d + BF, 0], T: [z.d + BF, h], G: [z.d + BF * 1.12, 0], G2: [z.d + BF * 1.12, h] };
        var svg = fig(HW.fig({ pts: P, segs: [['A', 'B', z.d + ' m'], ['B', 'F'], ['A', 'T'], ['B', 'T'], ['T', 'F'], ['F', 'G', null, { width: 1.4 }], ['G', 'G2', null, { color: '#8a8f99', width: 1.4 }], ['T', 'G2', null, { color: '#8a8f99', width: 1.4 }]], right: [['F', 'B', 'T']], angles: [['A', 'B', 'T', z.e1 + '°', { r: 40 }], ['B', 'F', 'T', z.e2 + '°', { r: 24 }]], names: { A: 'A', B: 'B', F: 'F', T: 'T' }, width: 320, height: 220, aria: 'two angles of elevation of a cliff' }));
        return nP('<i>(Numerical Response)</i> From a boat at point ' + t('A') + ', the angle of elevation of the top ' + t('T') + ' of a vertical cliff is ' + t(D(z.e1)) + '. The boat moves ' + t(z.d) + ' m straight toward the cliff to point ' + t('B') + ', where the angle of elevation is ' + t(D(z.e2)) + '. The height of the cliff, to the nearest metre, is ______ m.' + svg, h, 0, { nr: true,
          alts: [{ v: BT * cs(z.e2), code: LID + '-alt-cos', hint: 'That is ' + t('BF') + ', along the water. The height ' + t('TF') + ' is opposite the ' + t(D(z.e2)) + ' angle: ' + t('TF=BT\\sin ' + D(z.e2)) + '.' }, { v: AT * sn(z.e2), code: LID + '-wrong-tri', hint: 'In right ' + t('\\triangle AFT') + ' the angle at ' + t('A') + ' is ' + t(D(z.e1)) + ': ' + t('TF=AT\\sin ' + D(z.e1)) + ' (or use ' + t('BT\\sin ' + D(z.e2)) + ').' }, { v: z.d * sn(z.e1), code: LID + '-pair', hint: 'In ' + t('\\triangle ABT') + ', ' + t('\\angle ABT=180^\\circ-' + D(z.e2)) + ' and ' + t('\\angle ATB=' + D(z.e2) + '-' + D(z.e1) + '=' + D(Tq)) + '. Pair ' + t(z.d) + ' m with ' + t('\\angle ATB') + '.' }, { v: BT, code: LID + '-dist', hint: 'That is ' + t('BT') + ', the line of sight. Now use right ' + t('\\triangle BFT') + ' for the height.' }, { v: z.d * Math.sin(z.e1) / Math.sin(Tq) * Math.sin(z.e2), code: LID + '-radian', hint: 'Your calculator is in <b>radian</b> mode.' }],
          sol: 'In ' + t('\\triangle ABT') + ': ' + t('\\angle ABT=180^\\circ-' + D(z.e2) + '=' + D(180 - z.e2)) + ', so ' + t('\\angle ATB=180^\\circ-' + D(z.e1) + '-' + D(180 - z.e2) + '=' + D(Tq)) + '.<br>' + t('BT=\\dfrac{' + z.d + '\\sin ' + D(z.e1) + '}{\\sin ' + D(Tq) + '}\\approx ' + fx(BT, 2)) + ' m. Height ' + t('=BT\\sin ' + D(z.e2) + '\\approx ' + fx(h, 0)) + ' m',
          hints: ['Work in ' + t('\\triangle ABT') + ' first: find its angles at ' + t('B') + ' and ' + t('T') + '.', 'Then the right triangle ' + t('BFT') + ' gives the height.'], text: 'NR: cliff from two angles of elevation' });
      } }] }
  ];

  /* ---- Extra Practice ---- */
  function oneAAS(r, kind, avoid) {
    var nm = r.pick(SETS);
    if (kind === 'a') {
      var z = pickWhere(function () { return { a0: r.int(30, 70), a1: r.int(50, 90), k: tenth(r, 6, 25) }; }, function (z) { return z.a0 + z.a1 <= 150 && Math.abs(z.a0 - z.a1) > 8 && !(z.a0 === 39 && z.a1 === 82) && safe(slSide(z.k, z.a0, z.a1), 1); });
      return { nm: nm, z: z, T: aasT(nm, z.a0, z.a1, 0, z.k) };
    }
    return null;
  }
  var EXTRA = [
    { num: 'A1', section: 'A. Skills', stem: 'Sketch each triangle and determine the indicated side(s) to the nearest tenth.', parts: [
      { id: 'eA1a', level: 'BEG', make: function (r) {
        var o = oneAAS(r, 'a'), nm = o.nm, z = o.z, T = o.T, x = T.s[nm[1]], C = T.A[nm[2]];
        var s = {}; s[nm[0]] = fs(z.k, 1) + ' cm'; s[nm[1]] = low(nm[1]);
        return nP(t('\\angle ' + nm[0] + '=' + D(z.a0) + ',\\ \\angle ' + nm[1] + '=' + D(z.a1) + ',\\ ' + low(nm[0]) + '=' + Lt(z.k, 1)) + ' cm; find ' + t(low(nm[1])) + '.', x, 1, { unit: 'cm', alts: slSideAlts(z.k, z.a0, z.a1, [[C, z.a1]]),
          sol: triFig(T, labs(T, s, (function () { var a = {}; a[nm[0]] = z.a0; a[nm[1]] = z.a1; return a; })()), { width: 280, height: 240 }) + t(eqSide(low(nm[1]), z.a1, z.k, z.a0, 1) + '\\approx ' + fx(x, 1)) + ' cm', hints: HSIDE, text: 'sine law: side (AAS)' });
      } },
      { id: 'eA1b', level: 'EMG', make: function (r) {
        var nm = r.pick(SETS), z = pickWhere(function () { return { P: r.int(105, 135), Q: r.int(18, 40), k: tenth(r, 15, 45) }; }, function (z) {
          if (z.P + z.Q > 160 || Math.abs(180 - z.P - 2 * z.Q) < 4 || (z.P === 118 && z.Q === 27)) return false; var R = 180 - z.P - z.Q; return safe(slSide(z.k, z.P, z.Q), 1) && safe(slSide(z.k, z.P, R), 1);
        });
        var T = triAngles(nm, [z.P, z.Q, 180 - z.P - z.Q], nm[0], z.k), R = T.A[nm[2]], q = T.s[nm[1]], rr = T.s[nm[2]], s = {}, a = {};
        s[nm[0]] = fs(z.k, 1) + ' m'; s[nm[1]] = low(nm[1]); s[nm[2]] = low(nm[2]); a[nm[0]] = z.P; a[nm[1]] = z.Q;
        return fP(t('\\angle ' + nm[0] + '=' + D(z.P) + ',\\ \\angle ' + nm[1] + '=' + D(z.Q) + ',\\ ' + low(nm[0]) + '=' + Lt(z.k, 1)) + ' m; find ' + t(low(nm[1])) + ' and ' + t(low(nm[2])) + '.', [
          { label: t(low(nm[1]) + '='), name: t(low(nm[1])), x: q, dp: 1, unit: 'm', alts: slSideAlts(z.k, z.P, z.Q, [[R, z.Q]]) },
          { label: t(low(nm[2]) + '='), name: t(low(nm[2])), x: rr, dp: 1, unit: 'm', alts: slSideAlts(z.k, z.P, R, [[z.Q, R]]) }],
          { swap: [0, 1], sol: triFig(T, labs(T, s, a), { width: 280, height: 240 }) + t('\\angle ' + nm[2] + '=180^\\circ-' + D(z.P) + '-' + D(z.Q) + '=' + D(R)) + '<br>' + t(eqSide(low(nm[1]), z.Q, z.k, z.P, 1) + '\\approx ' + fx(q, 1)) + ' m<br>' + t(eqSide(low(nm[2]), R, z.k, z.P, 1) + '\\approx ' + fx(rr, 1)) + ' m', hints: HSIDE, text: 'sine law: two sides, obtuse angle' });
      } },
      { id: 'eA1c', level: 'EMG', make: function (r) {
        var nm = r.pick(SETS), z = pickWhere(function () { return { J: r.int(38, 62), Lq: r.int(52, 78), k: r.int(25, 95) }; }, function (z) {
          var Kq = 180 - z.J - z.Lq; return Kq > 35 && Math.abs(Kq - z.Lq) > 4 && Math.abs(Kq - z.J) > 4 && !(z.J === 47 && z.Lq === 68) && safe(z.k * sn(Kq) / sn(z.J), 1);
        });
        var Kq = 180 - z.J - z.Lq, T = triAngles([nm[0], nm[1], nm[2]], [z.J, Kq, z.Lq], nm[0], z.k), x = T.s[nm[1]], s = {}, a = {};
        s[nm[0]] = z.k + ' km'; s[nm[1]] = low(nm[1]); a[nm[0]] = z.J; a[nm[2]] = z.Lq;
        return nP(t('\\angle ' + nm[0] + '=' + D(z.J) + ',\\ \\angle ' + nm[2] + '=' + D(z.Lq) + ',\\ ' + low(nm[0]) + '=' + z.k) + ' km; find ' + t(low(nm[1])) + '.', x, 1, { unit: 'km', alts: slSideAlts(z.k, z.J, Kq, [[z.J, z.Lq, 'You want ' + t(low(nm[1])) + ', opposite ' + t('\\angle ' + nm[1]) + ': find ' + t('\\angle ' + nm[1]) + ' first.']]),
          sol: triFig(T, labs(T, s, a), { width: 280, height: 240 }) + t('\\angle ' + nm[1] + '=180^\\circ-' + D(z.J) + '-' + D(z.Lq) + '=' + D(Kq)) + '<br>' + t(eqSide(low(nm[1]), Kq, z.k, z.J, 0) + '\\approx ' + fx(x, 1)) + ' km', hints: [H3RD].concat(HSIDE), text: 'sine law: side, third angle first' });
      } }] },
    { num: 'A2', stem: 'Determine the indicated angle(s) to the nearest degree. Explain in a few words why only one triangle is possible.', parts: [
      { id: 'eA2a', level: 'BEG', make: function (r) {
        var s = r.pick(SETS), z = ssaGen(r, 'long', [s[0], s[1], s[2]], [[76, 18.5, 14.2], [64, 12.5, 9.2]]), x = asn(z.o * sn(z.K0) / z.k), n = z.nm;
        return deg(t('\\angle ' + n[0] + '=' + D(z.K0) + ',\\ ' + low(n[0]) + '=' + Lt(z.k, 1) + ',\\ ' + low(n[1]) + '=' + Lt(z.o, 1)) + '; find ' + t('\\angle ' + n[1]) + '.', x, 0, { alts: slAngAlts(z.o, z.k, z.K0, ssaWhy('long', n, n[0], n[1])),
          sol: t(low(n[0]) + '>' + low(n[1])) + ', so ' + t('\\angle ' + n[1]) + ' is acute (one triangle).<br>' + t('\\sin ' + n[1] + '=\\dfrac{' + Lt(z.o, 1) + '\\sin ' + D(z.K0) + '}{' + Lt(z.k, 1) + '}\\approx ' + fx(z.o * sn(z.K0) / z.k, 4)) + ', ' + t('\\angle ' + n[1] + '\\approx ' + Dx(x, 0)), hints: HANG, text: 'sine law angle: longer side' });
      } },
      { id: 'eA2b', level: 'BEG', make: function (r) {
        var s = r.pick(SETS), z = ssaGen(r, 'obt', [s[2], s[1], s[0]], [[131, 25.4, 16.9], [127, 20, 14]]), x = asn(z.o * sn(z.K0) / z.k), n = z.nm;
        return deg(t('\\angle ' + n[0] + '=' + D(z.K0) + ',\\ ' + low(n[0]) + '=' + Lt(z.k, 1) + ',\\ ' + low(n[1]) + '=' + Lt(z.o, 1)) + '; find ' + t('\\angle ' + n[1]) + '.', x, 0, { alts: slAngAlts(z.o, z.k, z.K0, ssaWhy('obt', n, n[0], n[1])),
          sol: t('\\angle ' + n[0]) + ' is obtuse, so ' + t('\\angle ' + n[1]) + ' is acute (one triangle).<br>' + t('\\sin ' + n[1] + '=\\dfrac{' + Lt(z.o, 1) + '\\sin ' + D(z.K0) + '}{' + Lt(z.k, 1) + '}\\approx ' + fx(z.o * sn(z.K0) / z.k, 4)) + ', ' + t('\\angle ' + n[1] + '\\approx ' + Dx(x, 0)), hints: HANG, text: 'sine law angle: obtuse known angle' });
      } },
      { id: 'eA2c', level: 'EMG', make: function (r) {
        var s = r.pick(SETS), z = pickWhere(function () { return ssaGen(r, 'acute', [s[0], s[1], s[2]], [[62, 11, 12], [58, 19, 21]]); }, function (z) { var Y = asn(z.o * sn(z.K0) / z.k); return safe(Y, 1) && safe(180 - z.K0 - Y, 0) && rd(180 - z.K0 - rd(Y, 1), 0) === rd(180 - z.K0 - Y, 0); });
        var n = z.nm, Y = asn(z.o * sn(z.K0) / z.k), Z = 180 - z.K0 - Y;
        return fP('Acute ' + t('\\triangle ' + n.join('')) + ': ' + t('\\angle ' + n[0] + '=' + D(z.K0) + ',\\ ' + low(n[0]) + '=' + Lt(z.k, 1) + ',\\ ' + low(n[1]) + '=' + Lt(z.o, 1)) + '; find ' + t('\\angle ' + n[1]) + ' and ' + t('\\angle ' + n[2]) + '.', [
          { label: t('\\angle ' + n[1] + '='), name: t('\\angle ' + n[1]), x: Y, dp: 0, unit: '°', alts: slAngAlts(z.o, z.k, z.K0, 'the triangle is acute', false) },
          { label: t('\\angle ' + n[2] + '='), name: t('\\angle ' + n[2]), x: Z, dp: 0, unit: '°', acc: [180 - z.K0 - rd(Y, 0)], alts: [{ v: 180 - z.K0 - (180 - Y), code: LID + '-supp', hint: 'Use the acute value of ' + t('\\angle ' + n[1]) + '.' }] }],
          { swap: [0, 1], sol: 'The triangle is acute (given), so ' + t('\\angle ' + n[1]) + ' is the acute angle.<br>' + t('\\sin ' + n[1] + '=\\dfrac{' + Lt(z.o, 1) + '\\sin ' + D(z.K0) + '}{' + Lt(z.k, 1) + '}\\approx ' + fx(z.o * sn(z.K0) / z.k, 4)) + ', ' + t('\\angle ' + n[1] + '\\approx ' + Dx(Y, 1) + '\\approx ' + Dx(Y, 0)) + '<br>' + t('\\angle ' + n[2] + '\\approx 180^\\circ-' + D(z.K0) + '-' + Dx(Y, 1) + '\\approx ' + Dx(Z, 0)), hints: HANG, text: 'acute triangle: two angles' });
      } }] },
    { num: 'A3', stem: 'For each set of information about ' + t('\\triangle ABC') + ', decide whether the sine law can be used as the first step. If it can, choose the equation you would solve.', parts: [
      { id: 'eA3a', level: 'BEG', make: function (r) {
        var z = pickWhere(function () { return { B: r.int(35, 70), C: r.int(40, 85), b: r.int(5, 20) }; }, function (z) { return z.B + z.C < 160 && z.B !== z.C && !(z.B === 50 && z.C === 72); });
        return mcP(r, t('\\angle B=' + D(z.B) + ',\\ b=' + z.b + ',\\ \\angle C=' + D(z.C)) + '; find ' + t('c') + '.', [
          { html: 'Yes: ' + t('\\dfrac{c}{\\sin ' + D(z.C) + '}=\\dfrac{' + z.b + '}{\\sin ' + D(z.B) + '}'), right: true },
          { html: 'Yes: ' + t('\\dfrac{c}{\\sin ' + D(z.B) + '}=\\dfrac{' + z.b + '}{\\sin ' + D(z.C) + '}'), why: 'Each side goes with its <b>opposite</b> angle: ' + t('c') + ' with ' + t('\\angle C') + ', ' + t('b') + ' with ' + t('\\angle B') + '.' },
          { html: 'No: no angle and its opposite side are both known.', why: t('\\angle B') + ' and ' + t('b') + ' are a known pair.' },
          { html: 'No: it is two sides and the angle between them (SAS).', why: 'Only one side is known here, ' + t('b') + ', and it is opposite a known angle.' }],
          'Yes. Known pair ' + t('\\angle B') + ', ' + t('b') + ': ' + t('\\dfrac{c}{\\sin ' + D(z.C) + '}=\\dfrac{' + z.b + '}{\\sin ' + D(z.B) + '}') + '.', ['Look for an angle and the side opposite it.'], 'can the sine law start? (AAS)');
      } },
      { id: 'eA3b', level: 'BEG', make: function (r) {
        var z = pickWhere(function () { return { a: r.int(4, 15), b: r.int(5, 18), C: r.int(30, 120) }; }, function (z) { return z.a !== z.b && !(z.a === 7 && z.b === 10 && z.C === 45); });
        return mcP(r, t('a=' + z.a + ',\\ b=' + z.b + ',\\ \\angle C=' + D(z.C)) + '; find ' + t('c') + '.', [
          { html: 'No: two sides and the angle between them (SAS) — no known pair.', right: true },
          { html: 'Yes: ' + t('\\dfrac{c}{\\sin ' + D(z.C) + '}=\\dfrac{' + z.a + '}{\\sin A}'), why: t('\\angle A') + ' is not known, so this equation has two unknowns.' },
          { html: 'Yes: ' + t('\\dfrac{c}{\\sin ' + D(z.C) + '}=\\dfrac{' + z.b + '}{\\sin ' + D(z.C) + '}'), why: t('b') + ' is opposite ' + t('\\angle B') + ', not ' + t('\\angle C') + '.' },
          { html: 'No: three sides but no angle (SSS).', why: 'An angle is given here, but it is the angle <b>between</b> the two sides (SAS).' }],
          'No. ' + t('\\angle C') + ' is between ' + t('a') + ' and ' + t('b') + ', and ' + t('c') + ' is unknown: no angle is paired with its opposite side (SAS — the cosine law, Lesson 6).', ['Is any given angle paired with the side opposite it?'], 'can the sine law start? (SAS)');
      } },
      { id: 'eA3c', level: 'EMG', make: function (r) {
        var z = pickWhere(function () { return { A: r.int(25, 60), B: r.int(50, 110), c: r.int(6, 20) }; }, function (z) { return z.A + z.B < 160 && z.A + z.B > 100 && !(z.A === 35 && z.B === 95); }), C = 180 - z.A - z.B;
        return mcP(r, t('\\angle A=' + D(z.A) + ',\\ \\angle B=' + D(z.B) + ',\\ c=' + z.c) + '; find ' + t('a') + '.', [
          { html: 'Yes, after ' + t('\\angle C=' + D(C)) + ': ' + t('\\dfrac{a}{\\sin ' + D(z.A) + '}=\\dfrac{' + z.c + '}{\\sin ' + D(C) + '}'), right: true },
          { html: 'Yes: ' + t('\\dfrac{a}{\\sin ' + D(z.A) + '}=\\dfrac{' + z.c + '}{\\sin ' + D(z.B) + '}'), why: t('c') + ' is opposite ' + t('\\angle C') + ', not ' + t('\\angle B') + '. Find ' + t('\\angle C') + ' first.' },
          { html: 'No: the given side is not opposite a given angle.', why: 'The third angle is ' + t('180^\\circ') + ' minus the other two, and it is opposite ' + t('c') + '.' },
          { html: 'Yes: ' + t('\\dfrac{a}{\\sin ' + D(z.B) + '}=\\dfrac{' + z.c + '}{\\sin ' + D(z.A) + '}'), why: t('a') + ' is opposite ' + t('\\angle A') + '.' }],
          'Yes. ' + t('\\angle C=180^\\circ-' + D(z.A) + '-' + D(z.B) + '=' + D(C)) + ' is opposite ' + t('c') + ': ' + t('\\dfrac{a}{\\sin ' + D(z.A) + '}=\\dfrac{' + z.c + '}{\\sin ' + D(C) + '}') + '.', [H3RD], 'can the sine law start? (ASA)');
      } },
      { id: 'eA3d', level: 'BEG', make: function (r) {
        var z = pickWhere(function () { var s = r.shuffle([4, 5, 6, 7, 8, 9, 10, 11, 12, 13]).slice(0, 3).sort(function (a, b) { return a - b; }); return { a: s[0], b: s[1], c: s[2] }; }, function (z) { return z.a + z.b > z.c + 1 && !(z.a === 6 && z.b === 8 && z.c === 11); });
        return mcP(r, t('a=' + z.a + ',\\ b=' + z.b + ',\\ c=' + z.c) + '; find ' + t('\\angle C') + '.', [
          { html: 'No: three sides but no known angle (SSS).', right: true },
          { html: 'Yes: ' + t('\\dfrac{\\sin C}{' + z.c + '}=\\dfrac{\\sin A}{' + z.a + '}'), why: t('\\angle A') + ' isn’t known: this equation has two unknowns.' },
          { html: 'No: two sides and the angle between them (SAS).', why: 'No angle is given at all: that is SSS.' },
          { html: 'Yes: ' + t('\\sin C=\\dfrac{' + z.c + '}{' + z.b + '}'), why: 'That is a right-triangle ratio, and this triangle isn’t a right triangle.' }],
          'No. With three sides there is no known angle, so no known pair (SSS — the cosine law, Lesson 6).', ['The sine law needs an angle and its opposite side.'], 'can the sine law start? (SSS)');
      } }] },
    { num: 'A4', parts: [
      { id: 'eA4', level: 'LIM', make: function (r) {
        var a = pickWhere(function () { return r.int(130, 170); }, function (x) { return x !== 145 && x !== 130 && x !== 150; }), b = pickWhere(function () { return r.int(91, 106); }, function (x) { return x !== 98; }), c = pickWhere(function () { return r.int(108, 128); }, function (x) { return x !== 120; });
        var sp = function (x, lab) { return { label: t('\\sin ' + D(x) + '=\\sin'), name: '(' + lab + ') ' + t('\\sin ' + D(x)), kind: 'int', x: 180 - x, unit: '°', cands: [[x - 90, LID + '-ref90', t('\\sin(180^\\circ-\\theta)=\\sin\\theta') + ': subtract from ' + t('180^\\circ') + ', not ' + t('90^\\circ') + '.'], [360 - x, LID + '-ref360', 'The angle must be acute: ' + t('\\sin(180^\\circ-\\theta)=\\sin\\theta') + '.']] }; };
        return fP('Without a calculator, name the acute angle with the same sine as each angle.', [sp(a, 'a'), sp(b, 'b'), sp(c, 'c')],
          { sol: t('\\sin(180^\\circ-\\theta)=\\sin\\theta') + ' (same reference angle; sine is positive in quadrant II):<br>' + t('\\sin ' + D(a) + '=\\sin ' + D(180 - a) + ',\\quad \\sin ' + D(b) + '=\\sin ' + D(180 - b) + ',\\quad \\sin ' + D(c) + '=\\sin ' + D(180 - c)), hints: [t('\\sin(180^\\circ-\\theta)=\\sin\\theta') + '.'], text: 'same sine: 180° − θ' });
      } }] },
    { num: 'B1', section: 'B. Applying', parts: [
      { id: 'eB1', level: 'PRG', make: function (r) {
        var n = r.pick(SETS), z = pickWhere(function () { var a = tenth(r, 15, 40); return { A: r.int(50, 80), a: a, b: rd(a * (0.55 + 0.33 * r.int(0, 100) / 100), 1) }; }, function (z) {
          if (z.A === 57 || z.A === 64) return false; var Bq = asn(z.b * sn(z.A) / z.a), C = 180 - z.A - Bq, c = z.a * sn(C) / sn(z.A), c1 = z.a * sn(180 - z.A - rd(Bq, 1)) / sn(z.A);
          return safe(Bq, 0) && safe(Bq, 1) && safe(C, 0) && safe(c, 1) && rd(c1, 1) === rd(c, 1) && C > 20;
        });
        var Bq = asn(z.b * sn(z.A) / z.a), C = 180 - z.A - Bq, c = z.a * sn(C) / sn(z.A), cE = z.a * sn(180 - z.A - rd(Bq, 0)) / sn(z.A);
        return fP('In ' + t('\\triangle ' + n.join('')) + ', ' + t('\\angle ' + n[0] + '=' + D(z.A)) + ', ' + t(low(n[0]) + '=' + Lt(z.a, 1)) + ' cm and ' + t(low(n[1]) + '=' + Lt(z.b, 1)) + ' cm. Solve the triangle (angles to the nearest degree, the side to the nearest tenth).', [
          { label: t('\\angle ' + n[1] + '='), name: t('\\angle ' + n[1]), x: Bq, dp: 0, unit: '°', alts: slAngAlts(z.b, z.a, z.A, ssaWhy('long', n, n[0], n[1])) },
          { label: t('\\angle ' + n[2] + '='), name: t('\\angle ' + n[2]), x: C, dp: 0, unit: '°', acc: [180 - z.A - rd(Bq, 0)] },
          { label: t(low(n[2]) + '='), name: t(low(n[2])), x: c, dp: 1, unit: 'cm', acc: [z.a * sn(180 - z.A - rd(Bq, 1)) / sn(z.A)], alts: slSideAlts(z.a, z.A, C).concat([{ v: cE, code: LID + '-early', hint: 'Keep the angles unrounded (or to at least one decimal place) until the last step.' }]) }],
          { sol: t(low(n[0]) + '>' + low(n[1])) + ', so ' + t('\\angle ' + n[1]) + ' is acute. ' + t('\\sin ' + n[1] + '=\\dfrac{' + Lt(z.b, 1) + '\\sin ' + D(z.A) + '}{' + Lt(z.a, 1) + '}\\approx ' + fx(z.b * sn(z.A) / z.a, 4)) + ', ' + t('\\angle ' + n[1] + '\\approx ' + Dx(Bq, 1) + '\\approx ' + Dx(Bq, 0)) + '<br>' + t('\\angle ' + n[2] + '\\approx 180^\\circ-' + D(z.A) + '-' + Dx(Bq, 1) + '=' + Dx(C, 1) + '\\approx ' + Dx(C, 0)) + '<br>' + t(low(n[2]) + '=\\dfrac{' + Lt(z.a, 1) + '\\sin ' + Dx(C, 1) + '}{\\sin ' + D(z.A) + '}\\approx ' + fx(c, 1)) + ' cm', hints: HANG, text: 'solve the triangle (SSA, one triangle)' });
      } }] },
    { num: 'B2', parts: [
      { id: 'eB2', level: 'ADV', make: function (r) {
        var z = pickWhere(function () { return { d: tenth(r, 1.5, 4.5), e1: r.int(25, 55), e2: r.int(30, 70) }; }, function (z) {
          if (Math.abs(z.e1 - z.e2) < 6 || z.e1 + z.e2 > 130 || (z.d === 2.5 && z.e1 === 35)) return false; var H = 180 - z.e1 - z.e2, PH = z.d * sn(z.e2) / sn(H); return safe(PH * sn(z.e1), 2);
        });
        var H = 180 - z.e1 - z.e2, PH = z.d * sn(z.e2) / sn(H), h = PH * sn(z.e1), QH = z.d * sn(z.e1) / sn(H);
        var P = { P: [0, 0], Q: [z.d, 0], H: [PH * cs(z.e1), h], F: [PH * cs(z.e1), 0] };
        return nP('Two observers stand ' + t(Lt(z.d, 1)) + ' km apart on level ground with a hot-air balloon between them. The angles of elevation of the balloon are ' + t(D(z.e1)) + ' from one observer and ' + t(D(z.e2)) + ' from the other. Sketch a diagram and determine the height of the balloon to the nearest hundredth of a kilometre.', h, 2, { unit: 'km',
          alts: [{ v: PH * sn(z.e2), code: LID + '-wrong-tri', hint: 'In the right triangle with hypotenuse ' + t('PH') + ' the angle at ' + t('P') + ' is ' + t(D(z.e1)) + ': height ' + t('=PH\\sin ' + D(z.e1)) + '.' }, { v: PH, code: LID + '-dist', hint: 'That is the distance from the observer to the balloon. Now use a right triangle for the height.' }, { v: z.d * sn(z.e1) * sn(z.e2), code: LID + '-right', hint: 'The angle at the balloon is ' + t(D(H)) + ', not ' + t('90^\\circ') + '. Use the sine law in the big triangle first.' }, { v: z.d * Math.sin(z.e2) / Math.sin(H) * Math.sin(z.e1), code: LID + '-radian', hint: 'Your calculator is in <b>radian</b> mode.' }],
          sol: fig(HW.fig({ pts: P, segs: [['P', 'Q', fs(z.d, 1) + ' km'], ['P', 'H'], ['Q', 'H'], ['H', 'F', 'h', { dash: true }]], right: [['F', 'Q', 'H']], angles: [['P', 'Q', 'H', z.e1 + '°'], ['Q', 'P', 'H', z.e2 + '°']], width: 280, height: 250, aria: 'balloon between two observers' })) + 'Call the observers ' + t('P') + ' (' + t(D(z.e1)) + ') and ' + t('Q') + ' (' + t(D(z.e2)) + '). ' + t('\\angle H=180^\\circ-' + D(z.e1) + '-' + D(z.e2) + '=' + D(H)) + ', opposite ' + t('PQ') + '.<br>' + t('PH=\\dfrac{' + Lt(z.d, 1) + '\\sin ' + D(z.e2) + '}{\\sin ' + D(H) + '}\\approx ' + fx(PH, 3)) + ' km. Height ' + t('=PH\\sin ' + D(z.e1) + '\\approx ' + fx(h, 2)) + ' km (or ' + t('QH\\sin ' + D(z.e2)) + ').',
          hints: ['The triangle has the two observers and the balloon. Its angle at the balloon is ' + t('180^\\circ') + ' minus the other two.', 'Find a distance to the balloon, then use SOH for the height.'], text: 'balloon height' });
      } }] },
    { num: 'B3', parts: [
      { id: 'eB3', level: 'PRG', make: function (r) {
        var z = pickWhere(function () { return { s: tenth(r, 8, 16), a1: r.int(20, 40), a2: r.int(35, 55) }; }, function (z) { return z.a2 - z.a1 >= 5 && !(z.s === 12 && z.a1 === 32 && z.a2 === 45) && safe(z.s * sn(z.a2) / sn(180 - z.a1 - z.a2), 1) && safe(z.s * sn(z.a1) / sn(180 - z.a1 - z.a2), 1); });
        var Pk = 180 - z.a1 - z.a2, L1 = z.s * sn(z.a2) / sn(Pk), L2 = z.s * sn(z.a1) / sn(Pk), T = triAngles(['A', 'B', 'C'], [z.a1, z.a2, Pk], 'C', z.s);
        return fP('A roof truss spans ' + t(Lt(z.s, 1)) + ' m. One side of the roof rises at ' + t(D(z.a1)) + ' and the other at ' + t(D(z.a2)) + '. Determine the length of each sloped side, to the nearest tenth of a metre.' + triFig(T, { s: { C: fs(z.s, 1) + ' m' }, A: { A: z.a1 + '°', B: z.a2 + '°' } }, { names: false, base: 'C', width: 300, height: 200 }), [
          { label: 'side rising at ' + t(D(z.a1)) + ':', name: 'Side rising at ' + t(D(z.a1)), x: L1, dp: 1, unit: 'm', alts: slSideAlts(z.s, Pk, z.a2, [[z.a2, z.a1]]) },
          { label: 'side rising at ' + t(D(z.a2)) + ':', name: 'Side rising at ' + t(D(z.a2)), x: L2, dp: 1, unit: 'm', alts: slSideAlts(z.s, Pk, z.a1, [[z.a1, z.a2]]) }],
          { swap: [0, 1], swapHint: 'Right lengths, swapped: the side rising at ' + t(D(z.a1)) + ' starts at the ' + t(D(z.a1)) + ' corner, so it is <b>opposite</b> the ' + t(D(z.a2)) + ' angle.', sol: 'The peak angle is ' + t('180^\\circ-' + D(z.a1) + '-' + D(z.a2) + '=' + D(Pk)) + ', opposite the span.<br>Side rising at ' + t(D(z.a1)) + ' (opposite ' + t(D(z.a2)) + '): ' + t('\\dfrac{' + Lt(z.s, 1) + '\\sin ' + D(z.a2) + '}{\\sin ' + D(Pk) + '}\\approx ' + fx(L1, 1)) + ' m<br>Side rising at ' + t(D(z.a2)) + ' (opposite ' + t(D(z.a1)) + '): ' + t('\\dfrac{' + Lt(z.s, 1) + '\\sin ' + D(z.a1) + '}{\\sin ' + D(Pk) + '}\\approx ' + fx(L2, 1)) + ' m',
            hints: ['The angle at the peak is opposite the span: that completes a known pair.', 'Each sloped side is opposite the angle at the <b>other</b> end of the span.'], text: 'roof truss' });
      } }] },
    { num: 'B4', parts: [
      { id: 'eB4', level: 'ADV', make: function (r) {
        var z = pickWhere(function () { return { d: r.int(15, 35), al: r.int(50, 75), be: r.int(10, 35) }; }, function (z) { return z.al - z.be >= 20 && z.al - z.be <= 55 && !(z.d === 24 && z.al === 63 && z.be === 18) && safe(z.d * cs(z.al) / sn(z.al - z.be), 1) && safe(z.d * cs(z.be) / sn(z.al - z.be), 1); });
        var Rq = 90 - z.al, Sq = 90 + z.be, Fq = z.al - z.be, SF = z.d * sn(Rq) / sn(Fq), RF = z.d * sn(Sq) / sn(Fq), Fw = 180 - Rq - (90 - z.be);
        var P = { R: [0, 0], S: [z.d, 0], F: [RF * sn(z.al), RF * cs(z.al)] }, ex0 = northLine(P.R, RF * 0.45).concat(northLine(P.S, RF * 0.45));
        return fP('Ranger station ' + t('S') + ' is ' + t(z.d) + ' km due east of ranger station ' + t('R') + '. A campfire ' + t('F') + ' is on a bearing of ' + t(brg('N', z.al, 'E')) + ' from ' + t('R') + ' and ' + t(brg('N', z.be, 'E')) + ' from ' + t('S') + '. Sketch a diagram and determine the distance from each station to the fire, to the nearest tenth of a kilometre.', [
          { label: t('SF='), name: t('SF'), x: SF, dp: 1, unit: 'km', alts: slSideAlts(z.d, Fq, Rq).concat([{ v: z.d * sn(Rq) / sn(Fw), code: LID + '-bearing', hint: 'At ' + t('S') + ', the angle inside the triangle is from due <b>west</b> (toward ' + t('R') + '), through north, to the fire: ' + t('90^\\circ+' + D(z.be)) + '.' }]) },
          { label: t('RF='), name: t('RF'), x: RF, dp: 1, unit: 'km', alts: slSideAlts(z.d, Fq, Sq).concat([{ v: z.d * sn(90 - z.be) / sn(Fw), code: LID + '-bearing', hint: 'At ' + t('S') + ', the angle inside the triangle is ' + t('90^\\circ+' + D(z.be)) + ' (from west, through north, to the fire).' }]) }],
          { swap: [0, 1], sol: fig(HW.fig({ pts: P, segs: [['R', 'S', z.d + ' km'], ['R', 'F'], ['S', 'F']], angles: [['R', 'S', 'F', Rq + '°'], ['S', 'R', 'F', Sq + '°']], extra: ex0, width: 240, height: 220, aria: 'bearings from two ranger stations' })) + t('\\angle FRS=90^\\circ-' + D(z.al) + '=' + D(Rq)) + '; ' + t('\\angle FSR=90^\\circ+' + D(z.be) + '=' + D(Sq)) + '; ' + t('\\angle F=180^\\circ-' + D(Rq) + '-' + D(Sq) + '=' + D(Fq)) + ', opposite ' + t('RS') + '.<br>' + t('SF=\\dfrac{' + z.d + '\\sin ' + D(Rq) + '}{\\sin ' + D(Fq) + '}\\approx ' + fx(SF, 1)) + ' km; ' + t('RF=\\dfrac{' + z.d + '\\sin ' + D(Sq) + '}{\\sin ' + D(Fq) + '}\\approx ' + fx(RF, 1)) + ' km',
            hints: ['At ' + t('R') + ': the angle between east (toward ' + t('S') + ') and the fire is ' + t('90^\\circ') + ' minus the bearing.', 'At ' + t('S') + ': from west (toward ' + t('R') + ') through north to the fire.'], text: 'bearings: campfire' });
      } }] },
    { num: 'B5', parts: [
      { id: 'eB5', level: 'EMG', make: function (r) {
        var z = pickWhere(function () { return { B: r.int(35, 60), C: r.int(15, 35), b: tenth(r, 6, 15) }; }, function (z) {
          if (z.B + z.C > 80 || (z.B === 48 && z.C === 21)) return false; var A = 180 - z.B - z.C, v = [z.b * sn(A) / sn(z.B), z.b * sn(z.C) / sn(z.B), z.b * sn(z.B) / sn(A), z.b * sn(A) / sn(z.C)].map(function (x) { return fs(x, 1); });
          return v.filter(function (x, i) { return v.indexOf(x) === i; }).length === 4;
        });
        var A = 180 - z.B - z.C, a = z.b * sn(A) / sn(z.B);
        return mcNum(r, '<i>(Multiple Choice)</i> In ' + t('\\triangle ABC') + ', ' + t('\\angle B=' + D(z.B)) + ', ' + t('\\angle C=' + D(z.C)) + ' and ' + t('b=' + Lt(z.b, 1)) + ' cm. To the nearest tenth, ' + t('a') + ' is', a, 1, [
          [z.b * sn(z.C) / sn(z.B), 'That is ' + t('c') + '. For ' + t('a') + ', find ' + t('\\angle A') + ' first.'], [z.b * sn(z.B) / sn(A), 'Upside down: put ' + t('a') + ' on top with ' + t('\\sin A') + '.'], [z.b * sn(A) / sn(z.C), t('b') + ' is opposite ' + t('\\angle B') + ', not ' + t('\\angle C') + '.']], 'cm',
          t('\\angle A=180^\\circ-' + D(z.B) + '-' + D(z.C) + '=' + D(A)) + ', so ' + t('a=\\dfrac{' + Lt(z.b, 1) + '\\sin ' + D(A) + '}{\\sin ' + D(z.B) + '}\\approx ' + fx(a, 1)) + ' cm.', [H3RD], 'MC: side after the third angle');
      } }] },
    { num: 'B6', parts: [
      { id: 'eB6', level: 'ADV', make: function (r) {
        var z = pickWhere(function () { var s = r.int(8, 20); return { s: s, d: tenth(r, 20, 45), e: s + r.int(15, 32) }; }, function (z) {
          if (z.e > 62 || (z.s === 15 && z.e === 42)) return false; var FT = z.d * sn(z.e - z.s) / sn(90 - z.e); return FT < 99.9 && FT > 5 && safe(FT, 1);
        });
        var a = z.e - z.s, Fq = 90 + z.s, Tq = 90 - z.e, FT = z.d * sn(a) / sn(Tq), u = [cs(z.s), sn(z.s)];
        var P = { P: [0, 0], F: [z.d * u[0], z.d * u[1]], G0: [-0.1 * z.d * u[0], -0.1 * z.d * u[1]], G1: [1.18 * z.d * u[0], 1.18 * z.d * u[1]], H: [0.45 * z.d, 0] }; P.T = [P.F[0], P.F[1] + FT];
        var svg = fig(HW.fig({ pts: P, segs: [['G0', 'G1', null, { color: '#8a6a3a', width: 2.6 }], ['F', 'T', null, { color: '#3d7a4f', width: 3 }], ['P', 'T'], ['P', 'H', null, { dash: true, color: '#6a7182', width: 1.4 }], ['P', 'F', fs(z.d, 1) + ' m', { side: -1, width: 0.01 }]], angles: [['P', 'H', 'F', z.s + '°', { r: 54 }], ['P', 'H', 'T', z.e + '°', { r: 28 }]], names: { P: 'P', F: 'F', T: 'T' }, width: 270, height: 220, aria: 'tree on a hillside' }));
        var alt1 = 90 - z.e - z.s > 3 ? z.d * sn(z.e) / sn(90 - z.e - z.s) : NaN;
        return nP('<i>(Numerical Response)</i> A vertical tree ' + t('FT') + ' grows on a hillside that slopes at ' + t(D(z.s)) + '. From point ' + t('P') + ', ' + t(Lt(z.d, 1)) + ' m downhill from the foot ' + t('F') + ', the angle of elevation of the top ' + t('T') + ' (from the horizontal) is ' + t(D(z.e)) + '. The height of the tree, to the nearest tenth of a metre, is ______ m.' + svg, FT, 1, { nr: true,
          alts: [{ v: alt1, code: LID + '-slope', hint: 'Inside ' + t('\\triangle PFT') + ', the angle at ' + t('P') + ' is between the slope and the line of sight: ' + t(D(z.e) + '-' + D(z.s) + '=' + D(a)) + '.' }, { v: z.d * tn(a), code: LID + '-right', hint: 'The tree is vertical, but the ground is sloped: the angle at ' + t('F') + ' is ' + t('90^\\circ+' + D(z.s)) + ', not ' + t('90^\\circ') + '.' }, { v: z.d * sn(a) / sn(180 - a - 90), code: LID + '-right', hint: 'The angle at the foot of the tree is ' + t('90^\\circ+' + D(z.s) + '=' + D(Fq)) + ' (the ground drops ' + t(D(z.s)) + ' below the horizontal toward ' + t('P') + ').' }, { v: z.d * Math.sin(a) / Math.sin(Tq), code: LID + '-radian', hint: 'Your calculator is in <b>radian</b> mode.' }],
          sol: t('\\angle TPF=' + D(z.e) + '-' + D(z.s) + '=' + D(a)) + '; ' + t('\\angle PFT=90^\\circ+' + D(z.s) + '=' + D(Fq)) + '; ' + t('\\angle T=180^\\circ-' + D(a) + '-' + D(Fq) + '=' + D(Tq)) + '.<br>' + t('FT=\\dfrac{' + Lt(z.d, 1) + '\\sin ' + D(a) + '}{\\sin ' + D(Tq) + '}\\approx ' + fx(FT, 1)) + ' m',
          hints: ['Find the three angles of ' + t('\\triangle PFT') + ': at ' + t('P') + ' measure from the slope, at ' + t('F') + ' the tree is vertical and the ground slopes.', t('PF') + ' is opposite ' + t('\\angle T') + '.'], text: 'NR: tree on a hillside' });
      } }] },
    { num: 'C1', section: 'C. Stretch', parts: [
      { id: 'eC1', level: 'MAS', make: function (r) {
        var z = pickWhere(function () { return { Q: r.int(85, 110), a1: r.int(30, 45), QR: tenth(r, 5, 10), a2: r.int(35, 55), S: r.int(62, 85) }; }, function (z) {
          if (180 - z.Q - z.a1 < 20 || 180 - z.a2 - z.S < 20 || (z.Q === 96 && z.a1 === 38)) return false; var PR = z.QR * sn(z.Q) / sn(z.a1), RS = PR * sn(z.a2) / sn(z.S), RSe = rd(PR, 1) * sn(z.a2) / sn(z.S);
          return safe(RS, 1) && safe(RSe, 1);
        });
        var PR = z.QR * sn(z.Q) / sn(z.a1), RS = PR * sn(z.a2) / sn(z.S), Rq1 = 180 - z.Q - z.a1, Rq2 = 180 - z.a2 - z.S, PQ = z.QR * sn(Rq1) / sn(z.a1), PS = PR * sn(Rq2) / sn(z.S);
        var P = { P: [0, 0], R: [PR, 0], Q: [PQ * cs(z.a1), -PQ * sn(z.a1)], S: [PS * cs(z.a2), PS * sn(z.a2)] };
        var svg = fig(HW.fig({ pts: P, segs: [['P', 'Q'], ['Q', 'R', fs(z.QR, 1) + ' cm'], ['R', 'S'], ['S', 'P'], ['P', 'R']], angles: [['Q', 'P', 'R', z.Q + '°', { r: 15 }], ['P', 'Q', 'R', z.a1 + '°', { r: 42 }], ['P', 'R', 'S', z.a2 + '°', { r: 42 }], ['S', 'P', 'R', z.S + '°', { r: 18 }]], width: 300, height: 300, aria: 'quadrilateral split by a diagonal' }));
        var RSe = rd(PR, 1) * sn(z.a2) / sn(z.S);
        return nP('Quadrilateral ' + t('PQRS') + ' is split by the diagonal ' + t('PR') + '. In ' + t('\\triangle PQR') + ', ' + t('\\angle Q=' + D(z.Q)) + ', ' + t('\\angle QPR=' + D(z.a1)) + ' and ' + t('QR=' + Lt(z.QR, 1)) + ' cm. In ' + t('\\triangle PRS') + ', ' + t('\\angle RPS=' + D(z.a2)) + ' and ' + t('\\angle S=' + D(z.S)) + '. Determine ' + t('RS') + ' to the nearest tenth.' + svg, RS, 1, { unit: 'cm',
          alts: [{ v: RSe, code: LID + '-early', hint: 'Keep ' + t('PR') + ' unrounded in your calculator for the second triangle.' }, { v: PR * sn(z.S) / sn(z.a2), code: LID + '-flip', hint: 'In ' + t('\\triangle PRS') + ': ' + t('\\dfrac{RS}{\\sin ' + D(z.a2) + '}=\\dfrac{PR}{\\sin ' + D(z.S) + '}') + '.' }, { v: z.QR * sn(z.a1) / sn(z.Q) * sn(z.a2) / sn(z.S), code: LID + '-flip', hint: 'In ' + t('\\triangle PQR') + ': ' + t('\\dfrac{PR}{\\sin ' + D(z.Q) + '}=\\dfrac{' + Lt(z.QR, 1) + '}{\\sin ' + D(z.a1) + '}') + ' (' + t('PR') + ' is opposite ' + t('\\angle Q') + ').' }, { v: PR * sn(Rq2) / sn(z.S), code: LID + '-pair', hint: 'That is ' + t('PS') + '. ' + t('RS') + ' is opposite ' + t('\\angle RPS') + '.' }, { v: z.QR * Math.sin(z.Q) / Math.sin(z.a1) * Math.sin(z.a2) / Math.sin(z.S), code: LID + '-radian', hint: 'Your calculator is in <b>radian</b> mode.' }],
          sol: t('\\triangle PQR') + ': ' + t('PR=\\dfrac{' + Lt(z.QR, 1) + '\\sin ' + D(z.Q) + '}{\\sin ' + D(z.a1) + '}\\approx ' + fx(PR, 3)) + ' cm (keep it).<br>' + t('\\triangle PRS') + ': ' + t('RS=\\dfrac{PR\\sin ' + D(z.a2) + '}{\\sin ' + D(z.S) + '}\\approx ' + fx(RS, 1)) + ' cm', hints: ['Work in ' + t('\\triangle PQR') + ' first: ' + t('PR') + ' is opposite the ' + t(D(z.Q)) + ' angle.', 'Then use ' + t('PR') + ' in ' + t('\\triangle PRS') + '.'], text: 'quadrilateral: two sine laws' });
      } }] },
    { num: 'C2', parts: [
      { id: 'eC2', level: 'ADV', make: function (r) {
        return mcP(r, 'Use the sine law to show that ' + t('\\dfrac{a}{b}=\\dfrac{\\sin A}{\\sin B}') + ' in any ' + t('\\triangle ABC') + '. Then which argument explains why, if ' + t('a>b') + ' and both angles are acute, ' + t('\\angle A>\\angle B') + '?', [
          { html: 'Multiply ' + t('\\dfrac{a}{\\sin A}=\\dfrac{b}{\\sin B}') + ' by ' + t('\\dfrac{\\sin A}{b}') + '. If ' + t('a>b') + ', then ' + t('\\dfrac{a}{b}>1') + ', so ' + t('\\sin A>\\sin B') + '; for acute angles the sine grows as the angle grows, so ' + t('\\angle A>\\angle B') + '.', right: true },
          { html: 'Multiply ' + t('\\dfrac{a}{\\sin A}=\\dfrac{b}{\\sin B}') + ' by ' + t('\\dfrac{\\sin A}{b}') + '. If ' + t('a>b') + ', then ' + t('\\sin A<\\sin B') + ', so ' + t('\\angle A>\\angle B') + '.', why: t('\\dfrac{\\sin A}{\\sin B}=\\dfrac{a}{b}>1') + ', so ' + t('\\sin A') + ' is the <b>larger</b> sine.' },
          { html: 'Cross-multiply to get ' + t('ab=\\sin A\\sin B') + '; then ' + t('a>b') + ' gives ' + t('\\angle A>\\angle B') + '.', why: 'Cross-multiplying gives ' + t('a\\sin B=b\\sin A') + ', not ' + t('ab=\\sin A\\sin B') + '.' },
          { html: 'Multiply by ' + t('\\dfrac{\\sin A}{b}') + '. Since ' + t('\\dfrac{a}{b}>1') + ', ' + t('\\sin A>\\sin B') + ', and this is true for <b>any</b> two angles, acute or not.', why: 'A larger sine doesn’t always mean a larger angle: ' + t('\\sin 150^\\circ<\\sin 60^\\circ') + '. That is why the angles must be acute.' }],
          'From ' + t('\\dfrac{a}{\\sin A}=\\dfrac{b}{\\sin B}') + ', multiply both sides by ' + t('\\dfrac{\\sin A}{b}') + ': ' + t('\\dfrac{a}{b}=\\dfrac{\\sin A}{\\sin B}') + '.<br>If ' + t('a>b') + ', then ' + t('\\dfrac{a}{b}>1') + ', so ' + t('\\sin A>\\sin B') + '. For acute angles, the sine gets larger as the angle gets larger, so ' + t('\\angle A>\\angle B') + '.', ['What is ' + t('\\dfrac{a}{b}') + ' when ' + t('a>b') + '?'], 'longer side, larger angle');
      } }] }
  ];

  HW.defineLesson({ id: LID, unit: 3, num: '5', title: 'The Sine Law', outcome: 'T3', calc: true, questions: QUESTIONS, extra: EXTRA });
})(window);
