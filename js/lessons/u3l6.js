/* Math 20-1 · Unit 3 · Lesson 6 — The Cosine Law (outcome T3 on every part)
 * Assignment 6 (m201book unit3/u3_l06.tex, Questions 1–18) and the Lesson 6 Extra Practice (u3_ep06.tex, A1–A4, B1–B6,
 * C1–C2). Every part is a generator: the booklet question's idea, form and difficulty with new numbers (the lesson's
 * example numbers and the booklet question's own numbers are left out). Calculator allowed (Unit 3, degree mode): each
 * part states the rounding (sides to the nearest tenth, angles to the nearest degree unless it says otherwise) and accepts
 * the value rounded that way; multi-step answers also accept the value reached the booklet's way (a side kept to the tenth
 * before the next step). The "without a calculator" items (4, 15, 16, Extra A3, B4, C1, C2) want exact answers in
 * simplest radical form (√76 → 2√19; a decimal gets a nudge).
 * Triangles, the baseball diamond, the hillside pole, the parallelogram and the clock are drawn to scale from the
 * generated numbers (js/geom.js HW.fig). Self-contained: the triangle solver, figures and slip checks are in this file
 * (the same helper block is in u3l5.js).
 * Recognised mistakes: the order-of-operations slip (b² + c² − 2bc)·cos A, no square root (gave a²), + 2bc cos A, the 2
 * left out, radian mode, the wrong side subtracted (angle opposite another side), the negative cosine dropped (acute for
 * obtuse), a non-contained angle, the speeds used for the distances, a right angle assumed (Pythagoras), the slope or the
 * bearing angle misread, the obtuse angle found with the sine law (gave its acute supplement), rounding too early, cos 120°
 * taken as +½, the reference angle for the angle.
 * Conversions: 1 "complete each form", 8(b) "check with the cosine law", 9 "why", 14 "show what happens", Extra A4
 * "write the equation" -> multiple choice; Extra C2 "show that" -> the exact cosine and the angle; sketches -> drawn in
 * the worked solutions.
 * Levels: LIM BEG EMG PRG ADV MAS. Mastery: 13 (parallelogram), 15 (ratio 3:5:7 type), Extra C1(b), Extra C2. */
(function (root) {
  'use strict';
  var LID = 'u3l6';
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
    'u3l6-radian': 'Calculator in radian mode', 'u3l6-order': 'Cosine law: subtracted before multiplying by cos', 'u3l6-noroot': 'Cosine law: forgot the square root',
    'u3l6-plus': 'Cosine law: added 2bc cos A', 'u3l6-no2': 'Cosine law: left out the 2', 'u3l6-sign': 'Dropped the negative cosine (acute instead of obtuse)',
    'u3l6-opp': 'Subtracted the wrong side (angle opposite another side)', 'u3l6-angle': 'Used an angle that is not between the two sides', 'u3l6-speed': 'Used the speeds, not the distances',
    'u3l6-right': 'Assumed a right angle (Pythagoras)', 'u3l6-slope': 'Slope angle misread', 'u3l6-sine-obtuse': 'Found an obtuse angle with the sine law (got its supplement)',
    'u3l6-early': 'Rounded an intermediate value too early', 'u3l6-cos-sign': 'Exact cosine with the wrong sign', 'u3l6-ref': 'Gave the reference angle', 'u3l6-cos': 'Gave the cosine, not the angle',
    'u3l6-alt-cos': 'Altitude: cos and sin mixed up', 'u3l6-alt-seg': 'Used the wrong piece of the base', 'u3l6-diag': 'Parallelogram: wrong angle for the diagonal', 'u3l6-small': 'Gave the other angle'
  };
  HW.addCodes(CODES);
  HW.addPartial({ 'u3l6-radian': 's', 'u3l6-order': 'b', 'u3l6-noroot': 's', 'u3l6-plus': 'b', 'u3l6-no2': 'b', 'u3l6-sign': 'b', 'u3l6-opp': 'b', 'u3l6-angle': 'n', 'u3l6-speed': 'b',
    'u3l6-right': 'n', 'u3l6-slope': 'b', 'u3l6-sine-obtuse': 'b', 'u3l6-early': 's', 'u3l6-cos-sign': 'b', 'u3l6-ref': 'b', 'u3l6-cos': 's', 'u3l6-alt-cos': 'b', 'u3l6-alt-seg': 'b', 'u3l6-diag': 'b', 'u3l6-small': 'n' });

  var HSAS = ['Two sides and the angle <b>between</b> them (SAS): ' + t('a^2=b^2+c^2-2bc\\cos A') + '.', 'Enter it all at once, e.g. ' + t('\\sqrt{b^2+c^2-2bc\\cos A}') + ': the multiplication comes before the subtraction.'];
  var HSSS = ['Three sides (SSS): ' + t('\\cos A=\\dfrac{b^2+c^2-a^2}{2bc}') + '. The side you subtract is opposite the angle you want.', 'A negative cosine means an obtuse angle.'];
  /* exact cosine-law answers: N = (side)², shown as k√m in simplest form. o.cands: [[value, code, hint]] */
  function sqParts(m) { var k = 1; for (var i = 2; i * i <= m; i++) while (m % (i * i) === 0) { m /= i * i; k *= i; } return [k, m]; }
  function rootTex(N) { var p = sqParts(N); return K.radTex({ k: p[0], n: 2, m: p[1] }); }
  function exCheck(N, cands) {
    var p = sqParts(N);
    return K.radical({ k: p[0], n: 2, m: p[1] }, 'mixed', { diag: function (v) {
      for (var i = 0; i < (cands || []).length; i++) { var c = cands[i]; if (c && isFinite(c[0]) && Math.abs(v - c[0]) < 1e-9) return { code: c[1], hint: c[2] }; }
      if (Math.abs(v - N) < 1e-9) return { code: LID + '-noroot', hint: 'That is the side <b>squared</b>. Take the square root and simplify it.' };
      return null;
    } });
  }
  function exP(prompt, N, o) {
    o = o || {};
    var key = rootTex(N), p = B.math(prompt, exCheck(N, o.cands), key, o.sol, o.hints || [], o.text, { keys: 'radical', before: o.before });
    p.bad = (N > 1 ? [String(N)] : []).concat((o.cands || []).filter(function (c) { return isFinite(c[0]) && c[0] > 0 && Math.abs(c[0] - Math.sqrt(N)) > 1e-6; }).map(function (c) { return String(rd(c[0], 6)); }));
    return p;
  }
  function radIn(k, m) { return (k === 1 ? '' : k) + '\\sqrt{' + m + '}'; }
  var TRI120 = [[5, 16, 19], [11, 24, 31], [7, 33, 37], [13, 35, 43], [16, 39, 49], [9, 56, 61], [3, 5, 7], [7, 8, 13]];

  /* ---- the SAS-side and SSS-angle items, figure only ---- */
  function sasPart(r, z, unit, dp, text, lvl) {
    var nm = r.pick(SETS), T = triSAS(nm, nm[0], z.A, z.b, z.c), x = T.s[nm[0]], s = {}, A = {};
    s[nm[1]] = L(z.b, dp) + ' ' + unit; s[nm[2]] = L(z.c, dp) + ' ' + unit; s[nm[0]] = low(nm[0]); A[nm[0]] = z.A + '°';
    return nP(triFig(T, { s: s, A: A }, { flip: r.chance(0.5) }), x, 1, { unit: unit, alts: clAlts(z.b, z.c, z.A, low(nm[0])),
      sol: 'SAS: ' + t(clSideTex(low(nm[0]), z.b, z.c, z.A, dp)) + ' ' + unit, hints: HSAS, text: text });
  }
  function sssPart(r, sd, dp, want, text) { // sd = [a, b, c]; want: index of the side opposite the angle
    var nm = r.pick(SETS), T = triSides(nm, sd), v = nm[want], o = others(T, v), x = T.A[v], s = {}, A = {};
    nm.forEach(function (w, i) { s[w] = L(sd[i], dp); }); A[v] = 'θ';
    return deg(triFig(T, { s: s, A: A }, { names: false, flip: r.chance(0.5) }), x, 0, { alts: clAngAlts(sd[want], T.s[o[0]], T.s[o[1]]),
      sol: t(clAngTex('\\theta', sd[want], T.s[o[0]], T.s[o[1]], dp)), hints: HSSS, text: text });
  }
  function sasGen(r, lo, hi, s0, s1, dp, avoid) {
    return pickWhere(function () { var f = dp ? function () { return tenth(r, s0, s1); } : function () { return r.int(s0, s1); }; return { A: r.int(lo, hi), b: f(), c: f() }; }, function (z) {
      return Math.abs(z.b - z.c) >= (dp ? 1 : 2) && safe(clSide(z.b, z.c, z.A), 1) && !(avoid || []).some(function (a) { return a[0] === z.A && ((a[1] === z.b && a[2] === z.c) || (a[1] === z.c && a[2] === z.b)); });
    });
  }
  function sssGen(r, s0, s1, dp, kind, avoid) { // kind: 'acute' | 'obtuse' | 'any'
    return pickWhere(function () { var f = dp ? function () { return tenth(r, s0, s1); } : function () { return r.int(s0, s1); }; var s = [f(), f(), f()].sort(function (a, b) { return a - b; }); return s; }, function (s) {
      if (s[0] + s[1] <= s[2] * 1.08 || s[1] - s[0] < (dp ? 0.8 : 1) || s[2] - s[1] < (dp ? 0.8 : 1)) return false;
      var big = clAng(s[2], s[0], s[1]); if (kind === 'obtuse' && big < 100) return false; if (kind === 'acute' && big > 85) return false;
      return [clAng(s[0], s[1], s[2]), clAng(s[1], s[0], s[2]), big].every(function (x) { return safe(x, 0); }) && !(avoid || []).some(function (a) { return a.slice().sort(function (p, q) { return p - q; }).join() === s.join(); });
    });
  }

  var QUESTIONS = [
    { num: '1', stem: 'Complete each form of the cosine law.', shared: function (r) { return { nm: r.pick(SETS) }; }, parts: [
      { id: '1a', level: 'LIM', make: function (r, z) {
        var n = z.nm, k = low(n[0]), l = low(n[1]), m = low(n[2]);
        return mcP(r, 'For ' + t('\\triangle ' + n.join('')) + ': ' + t(k + '^2=') + ' ?', [
          { html: t(l + '^2+' + m + '^2-2' + l + m + '\\cos ' + n[0]), right: true },
          { html: t(l + '^2+' + m + '^2+2' + l + m + '\\cos ' + n[0]), why: 'The cosine law <b>subtracts</b> ' + t('2' + l + m + '\\cos ' + n[0]) + '.' },
          { html: t(l + '^2+' + m + '^2-2' + l + m + '\\cos ' + n[1]), why: 'The angle is the one <b>opposite</b> ' + t(k) + ' — the angle between ' + t(l) + ' and ' + t(m) + ': ' + t('\\angle ' + n[0]) + '.' },
          { html: t(l + '^2+' + m + '^2-' + l + m + '\\cos ' + n[0]), why: 'The last term is ' + t('2' + l + m + '\\cos ' + n[0]) + ': don’t forget the 2.' }],
          t(k + '^2=' + l + '^2+' + m + '^2-2' + l + m + '\\cos ' + n[0]) + ': the side on the left is opposite the angle on the right.', ['The side on the left is opposite the angle in the cosine.'], 'cosine law form: side');
      } },
      { id: '1b', level: 'LIM', make: function (r, z) {
        var n = z.nm, k = low(n[0]), l = low(n[1]), m = low(n[2]);
        return mcP(r, 'For ' + t('\\triangle ' + n.join('')) + ': ' + t(m + '^2=') + ' ?', [
          { html: t(k + '^2+' + l + '^2-2' + k + l + '\\cos ' + n[2]), right: true },
          { html: t(k + '^2+' + l + '^2-2' + k + l + '\\cos ' + n[0]), why: 'Use the angle opposite ' + t(m) + ': ' + t('\\angle ' + n[2]) + '.' },
          { html: t(k + '^2+' + m + '^2-2' + k + m + '\\cos ' + n[2]), why: 'The two sides on the right are the ones that form ' + t('\\angle ' + n[2]) + ': ' + t(k) + ' and ' + t(l) + '.' },
          { html: t(k + '^2-' + l + '^2-2' + k + l + '\\cos ' + n[2]), why: 'Both squares are <b>added</b>; only the ' + t('2' + k + l + '\\cos ' + n[2]) + ' term is subtracted.' }],
          t(m + '^2=' + k + '^2+' + l + '^2-2' + k + l + '\\cos ' + n[2]), ['The other two sides form the angle opposite ' + t(m) + '.'], 'cosine law form: another side');
      } },
      { id: '1c', level: 'BEG', make: function (r, z) {
        var n = z.nm, k = low(n[0]), l = low(n[1]), m = low(n[2]);
        return mcP(r, 'For ' + t('\\triangle ' + n.join('')) + ': ' + t('\\cos ' + n[1] + '=') + ' ?', [
          { html: t('\\dfrac{' + k + '^2+' + m + '^2-' + l + '^2}{2' + k + m + '}'), right: true },
          { html: t('\\dfrac{' + k + '^2+' + l + '^2-' + m + '^2}{2' + k + l + '}'), why: 'That is ' + t('\\cos ' + n[2]) + '. Subtract the side opposite ' + t('\\angle ' + n[1]) + ': ' + t(l + '^2') + '.' },
          { html: t('\\dfrac{' + l + '^2-' + k + '^2-' + m + '^2}{2' + k + m + '}'), why: 'Solve ' + t(l + '^2=' + k + '^2+' + m + '^2-2' + k + m + '\\cos ' + n[1]) + ' carefully: the signs come out the other way.' },
          { html: t('\\dfrac{' + k + '^2+' + m + '^2-' + l + '^2}{' + k + m + '}'), why: 'The denominator is ' + t('2' + k + m) + '.' }],
          'From ' + t(l + '^2=' + k + '^2+' + m + '^2-2' + k + m + '\\cos ' + n[1]) + ': ' + t('\\cos ' + n[1] + '=\\dfrac{' + k + '^2+' + m + '^2-' + l + '^2}{2' + k + m + '}') + '.', ['The side subtracted in the numerator is the side opposite the angle.'], 'cosine law form: angle');
      } }] },
    { num: '2', stem: 'Determine the indicated side to the nearest tenth.', parts: [
      { id: '2a', level: 'BEG', make: function (r) { return sasPart(r, sasGen(r, 30, 52, 8, 25, 1, [[35, 12, 17.5], [42, 9, 13]]), 'cm', 1, 'cosine law: side (acute angle)'); } },
      { id: '2b', level: 'EMG', make: function (r) { return sasPart(r, sasGen(r, 95, 130, 4, 12, 1, [[104, 6.4, 9.1], [128, 7.5, 11.2]]), 'cm', 1, 'cosine law: side (obtuse angle)'); } },
      { id: '2c', level: 'BEG', make: function (r) { var z = pickWhere(function () { return sasGen(r, 15, 30, 18, 42, 0, [[21, 31, 28]]); }, function (z) { return Math.abs(z.b - z.c) <= 8; }); return sasPart(r, z, 'm', 0, 'cosine law: side (small angle)'); } }] },
    { num: '3', parts: [
      { id: '3', level: 'BEG', make: function (r) {
        var nm = r.pick(SETS), z = pickWhere(function () { return { B: r.int(58, 86), a: r.int(15, 40), c: r.int(15, 40) }; }, function (z) { return z.a !== z.c && !(z.B === 76 && z.a === 23) && safe(clSide(z.a, z.c, z.B), 0); }), b = clSide(z.a, z.c, z.B);
        return nP('In ' + t('\\triangle ' + nm.join('')) + ', ' + t('\\angle ' + nm[1] + '=' + D(z.B)) + ', ' + t(low(nm[0]) + '=' + z.a) + ' and ' + t(low(nm[2]) + '=' + z.c) + '. Determine ' + t(low(nm[1])) + ' to the nearest whole number.', b, 0, { alts: clAlts(z.a, z.c, z.B, low(nm[1])),
          sol: t(low(nm[1]) + '^2=' + z.a + '^2+' + z.c + '^2-2(' + z.a + ')(' + z.c + ')\\cos ' + D(z.B) + '\\approx ' + fx(b * b, 2)) + ', so ' + t(low(nm[1]) + '\\approx ' + fx(b, 0)), hints: HSAS, text: 'cosine law: side to a whole number' });
      } }] },
    { num: '4', stem: 'Without a calculator, determine ' + t('p') + ' exactly in ' + t('\\triangle PQR') + ', in simplest radical form.', parts: [
      { id: '4a', level: 'PRG', make: function (r) {
        var z = pickWhere(function () { return { P: r.pick([60, 120]), q: r.int(3, 12), rr: r.int(3, 12) }; }, function (z) {
          if (z.q === z.rr || (z.P === 60 && z.q === 6 && z.rr === 10) || (z.P === 120 && z.q === 3 && z.rr === 5)) return false; var N = z.q * z.q + z.rr * z.rr + (z.P === 120 ? 1 : -1) * z.q * z.rr; return sqParts(N)[1] > 1 && N < 400;
        });
        var sg = z.P === 120 ? 1 : -1, N = z.q * z.q + z.rr * z.rr + sg * z.q * z.rr, Nw = z.q * z.q + z.rr * z.rr - sg * z.q * z.rr, c = z.P === 120 ? '-\\tfrac{1}{2}' : '\\tfrac{1}{2}';
        return exP(t('\\angle P=' + D(z.P) + ',\\ q=' + z.q + ',\\ r=' + z.rr), N, { before: t('p='), cands: [[Math.sqrt(Nw), LID + '-cos-sign', t('\\cos ' + D(z.P) + '=' + (sg > 0 ? '-' : '') + '\\tfrac{1}{2}') + (sg > 0 ? ' (negative: quadrant II)' : '') + '.'], [Math.sqrt(z.q * z.q + z.rr * z.rr + sg * z.q * z.rr / 2), LID + '-no2', 'Use ' + t('-2qr\\cos P') + ': the 2 cancels the ' + t('\\tfrac{1}{2}') + '.'], [Math.sqrt(z.q * z.q + z.rr * z.rr), LID + '-right', t('\\cos ' + D(z.P)) + ' isn’t 0: ' + t('\\angle P') + ' isn’t a right angle.']],
          sol: t('p^2=' + z.q + '^2+' + z.rr + '^2-2(' + z.q + ')(' + z.rr + ')\\left(' + c + '\\right)=' + (z.q * z.q + z.rr * z.rr) + (sg > 0 ? '+' : '-') + z.q * z.rr + '=' + N) + ', so ' + t('p=\\sqrt{' + N + '}' + (rootTex(N) !== '\\sqrt{' + N + '}' ? '=' + rootTex(N) : '')),
          hints: ['Exact value: ' + t('\\cos ' + D(z.P) + '=' + (sg > 0 ? '-' : '') + '\\tfrac{1}{2}') + '.', 'Simplify the square root: take out the largest perfect-square factor.'], text: 'exact cosine law (60°/120°)' });
      } },
      { id: '4b', level: 'ADV', make: function (r) {
        var z = pickWhere(function () { var P = r.pick([135, 45, 150, 30]); return { P: P, q: r.int(2, 8), k: r.int(1, 5), rt: P === 135 || P === 45 ? 2 : 3 }; }, function (z) {
          if (z.P === 135 && z.q === 2 && z.k === 3) return false; var sg = z.P > 90 ? 1 : -1, N = z.q * z.q + z.rt * z.k * z.k + sg * z.rt * z.q * z.k; return N > 0 && sqParts(N)[1] > 1 && N < 500;
        });
        var sg = z.P > 90 ? 1 : -1, N = z.q * z.q + z.rt * z.k * z.k + sg * z.rt * z.q * z.k, Nw = z.q * z.q + z.rt * z.k * z.k - sg * z.rt * z.q * z.k, cv = (sg > 0 ? '-' : '') + '\\tfrac{\\sqrt{' + z.rt + '}}{2}';
        return exP(t('\\angle P=' + D(z.P) + ',\\ q=' + z.q + ',\\ r=' + radIn(z.k, z.rt)), N, { before: t('p='), cands: [[Math.sqrt(Nw), LID + '-cos-sign', t('\\cos ' + D(z.P) + '=' + cv) + '.'], [Math.sqrt(z.q * z.q + z.rt * z.k * z.k), LID + '-right', 'Include the ' + t('-2qr\\cos P') + ' term.'], [Math.sqrt(z.q * z.q + z.k * z.k + sg * z.rt * z.q * z.k), LID + '-noroot', t('r^2=(' + radIn(z.k, z.rt) + ')^2=' + z.k * z.k + '\\times ' + z.rt + '=' + z.rt * z.k * z.k) + '.']],
          sol: t('p^2=' + z.q + '^2+(' + radIn(z.k, z.rt) + ')^2-2(' + z.q + ')(' + radIn(z.k, z.rt) + ')\\left(' + cv + '\\right)=' + (z.q * z.q + z.rt * z.k * z.k) + (sg > 0 ? '+' : '-') + z.q * z.k + '(' + z.rt + ')=' + N) + ', so ' + t('p=\\sqrt{' + N + '}' + (rootTex(N) !== '\\sqrt{' + N + '}' ? '=' + rootTex(N) : '')),
          hints: ['Exact value: ' + t('\\cos ' + D(z.P) + '=' + cv) + '.', t('\\sqrt{' + z.rt + '}\\times\\sqrt{' + z.rt + '}=' + z.rt) + '.'], text: 'exact cosine law (radical side)' });
      } }] },
    { num: '5', stem: 'Determine the indicated angle to the nearest degree.', parts: [
      { id: '5a', level: 'BEG', make: function (r) { var s = sssGen(r, 6, 16, 0, 'acute', [[9, 12, 14], [8, 11, 13]]); return sssPart(r, s, 0, r.pick([0, 1]), 'cosine law: angle (SSS)'); } },
      { id: '5b', level: 'EMG', make: function (r) { var s = sssGen(r, 4, 13, 1, 'obtuse', [[5.2, 7.8, 11.6], [6.5, 9.2, 13.8]]); return sssPart(r, s, 1, 2, 'cosine law: obtuse angle (SSS)'); } },
      { id: '5c', level: 'EMG', make: function (r) {
        var z = pickWhere(function () { var Lq = r.int(7, 16); return { Lq: Lq, b: r.int(3, Lq + 3) }; }, function (z) { return z.b !== z.Lq && !(z.Lq === 10 && z.b === 6) && safe(clAng(z.b, z.Lq, z.Lq), 0) && clAng(z.b, z.Lq, z.Lq) > 15; });
        var nm = r.pick(SETS), T = triSides(nm, [z.b, z.Lq, z.Lq]), x = T.A[nm[0]], s = {}; s[nm[0]] = String(z.b); s[nm[1]] = String(z.Lq); s[nm[2]] = String(z.Lq);
        return deg(triFig(T, { s: s, A: (function () { var a = {}; a[nm[0]] = 'θ'; return a; })() }, { names: false, base: nm[0] }), x, 0, { alts: clAngAlts(z.b, z.Lq, z.Lq).concat([{ v: (180 - x) / 2, code: LID + '-small', hint: 'That is one of the two equal base angles. ' + t('\\theta') + ' is between the two equal sides, opposite the side ' + t(z.b) + '.' }]),
          sol: t(clAngTex('\\theta', z.b, z.Lq, z.Lq, 0)), hints: HSSS, text: 'cosine law: angle of an isosceles triangle' });
      } }] },
    { num: '6', parts: [
      { id: '6', level: 'PRG', make: function (r) {
        var s = sssGen(r, 10, 40, 0, 'any', [[17, 25, 30], [11, 13, 15]]), sm = clAng(s[0], s[1], s[2]), lg = clAng(s[2], s[0], s[1]);
        var ctx = r.pick(['Three trees in a garden are', 'Three posts of a fence are', 'Three buoys on a lake are']);
        return fP(ctx + ' ' + s[0] + ' m, ' + s[1] + ' m and ' + s[2] + ' m apart. Determine the smallest and the largest angle of the triangle they form, to the nearest degree.', [
          { label: 'smallest:', name: 'Smallest angle', x: sm, dp: 0, unit: '°', alts: clAngAlts(s[0], s[1], s[2]).filter(function (a) { return a.code !== LID + '-opp' || Math.abs(a.v - lg) > 0.5; }) },
          { label: 'largest:', name: 'Largest angle', x: lg, dp: 0, unit: '°', alts: clAngAlts(s[2], s[0], s[1]).filter(function (a) { return a.code !== LID + '-opp' || Math.abs(a.v - sm) > 0.5; }) }],
          { swap: [0, 1], swapHint: 'Right angles, swapped: the smallest angle is opposite the shortest side.', sol: 'Smallest, opposite ' + s[0] + ': ' + t(clAngTex('\\alpha', s[0], s[1], s[2], 0)) + '<br>Largest, opposite ' + s[2] + ': ' + t(clAngTex('\\beta', s[2], s[0], s[1], 0)), hints: ['The smallest angle is opposite the shortest side; the largest is opposite the longest side.'].concat(HSSS.slice(0, 1)), text: 'smallest and largest angle' });
      } }] },
    { num: '7', parts: [
      { id: '7', level: 'ADV', make: function (r) {
        var nm = r.pick(SETS), z = pickWhere(function () { var a = tenth(r, 5, 12); return { C: r.int(100, 130), a: a, b: rd(a + tenth(r, 2.5, 8), 1) }; }, function (z) {
          if (z.C === 112 && z.a === 8.4) return false; var c = clSide(z.a, z.b, z.C), A = asn(z.a * sn(z.C) / c), A1 = asn(z.a * sn(z.C) / rd(c, 1)), Bq = 180 - z.C - A;
          return safe(c, 1) && safe(A, 0) && safe(A, 1) && rd(A1, 0) === rd(A, 0) && safe(Bq, 0) && rd(180 - z.C - rd(A, 1), 0) === rd(Bq, 0) && Bq > 10;
        });
        var c = clSide(z.a, z.b, z.C), A = asn(z.a * sn(z.C) / c), Bq = 180 - z.C - A, T = triSides(nm, [z.a, z.b, c]); var s = {}, an = {}; s[nm[0]] = fs(z.a, 1) + ' m'; s[nm[1]] = fs(z.b, 1) + ' m'; an[nm[2]] = z.C;
        return fP('Solve ' + t('\\triangle ' + nm.join('')) + ' if ' + t('\\angle ' + nm[2] + '=' + D(z.C)) + ', ' + t(low(nm[0]) + '=' + Lt(z.a, 1)) + ' m and ' + t(low(nm[1]) + '=' + Lt(z.b, 1)) + ' m (side to the nearest tenth, angles to the nearest degree).', [
          { label: t(low(nm[2]) + '='), name: t(low(nm[2])), x: c, dp: 1, unit: 'm', alts: clAlts(z.a, z.b, z.C, low(nm[2])) },
          { label: t('\\angle ' + nm[0] + '='), name: t('\\angle ' + nm[0]), x: A, dp: 0, unit: '°', acc: [asn(z.a * sn(z.C) / rd(c, 1))], alts: slAngAlts(z.a, c, z.C, 'it is opposite the shortest side').map(function (a) { if (a.code === LID + '-supp') a.code = LID + '-sine-obtuse'; return a; }) },
          { label: t('\\angle ' + nm[1] + '='), name: t('\\angle ' + nm[1]), x: Bq, dp: 0, unit: '°', acc: [180 - z.C - rd(A, 0), 180 - z.C - rd(A, 1)], alts: [{ v: 180 - Bq, code: LID + '-sine-obtuse', hint: 'The angles must add to ' + t('180^\\circ') + ' with ' + t('\\angle ' + nm[2] + '=' + D(z.C)) + '.' }] }],
          { sol: triFig(T, labs(T, s, an), { width: 280, height: 240 }) + 'SAS: ' + t(clSideTex(low(nm[2]), z.a, z.b, z.C, 1)) + ' m<br>' + t('\\angle ' + nm[0]) + ' is opposite the shortest side, so it is acute: ' + t('\\sin ' + nm[0] + '=\\dfrac{' + Lt(z.a, 1) + '\\sin ' + D(z.C) + '}{' + fx(c, 3) + '\\ldots}\\approx ' + fx(z.a * sn(z.C) / c, 4)) + ', ' + t('\\angle ' + nm[0] + '\\approx ' + Dx(A, 1) + '\\approx ' + Dx(A, 0)) + '<br>' + t('\\angle ' + nm[1] + '\\approx 180^\\circ-' + D(z.C) + '-' + Dx(A, 1) + '=' + Dx(Bq, 1) + '\\approx ' + Dx(Bq, 0)),
            hints: HSAS.slice(0, 1).concat(['Then find the <b>smaller</b> unknown angle (opposite the shorter given side) with the sine law: it must be acute.']), text: 'solve the triangle (SAS, obtuse)' });
      } }] },
    { num: '8', shared: function (r) {
        return pickWhere(function () { var b = tenth(r, 6, 14); return { A: r.int(40, 65), b: b, c: rd(b * cs(50) + tenth(r, 3, 10), 1) }; }, function (z) {
          var h = z.b * sn(z.A), AD = z.b * cs(z.A), DB = z.c - AD; if (DB < 1.5 || (z.A === 53 && z.b === 10) || (z.A === 42 && z.b === 9)) return false; var a = Math.hypot(h, DB), a2 = Math.hypot(rd(h, 2), z.c - rd(AD, 2));
          return safe(h, 2) && safe(AD, 2) && safe(a, 1) && rd(a2, 1) === rd(a, 1);
        });
      },
      stem: function (z) { return 'In ' + t('\\triangle ABC') + ', ' + t('\\angle A=' + D(z.A)) + ', ' + t('AC=' + Lt(z.b, 1)) + ' cm and ' + t('AB=' + Lt(z.c, 1)) + ' cm.'; },
      parts: [
        { id: '8a', level: 'EMG', make: function (r, z) {
          var h = z.b * sn(z.A), AD = z.b * cs(z.A), DB = z.c - AD, a = Math.hypot(h, DB);
          var svg = fig(HW.fig({ pts: { A: [0, 0], B: [z.c, 0], C: [AD, h], D: [AD, 0] }, segs: [['A', 'B', fs(z.c, 1) + ' cm'], ['A', 'C', fs(z.b, 1) + ' cm'], ['B', 'C'], ['C', 'D', 'h', { dash: true }]], right: [['D', 'B', 'C']], angles: [['A', 'B', 'C', z.A + '°']], width: 300, height: 220, aria: 'triangle with the altitude from C' }));
          return fP('Draw the altitude ' + t('CD') + ' from ' + t('C') + ' to ' + t('AB') + ' and use right triangles only: determine ' + t('h=CD') + ' and ' + t('AD') + ' (to the nearest hundredth), then ' + t('BC') + ' (to the nearest tenth).' + svg, [
            { label: t('h='), name: t('h'), x: h, dp: 2, unit: 'cm', alts: [{ v: AD, code: LID + '-alt-cos', hint: t('h') + ' is <b>opposite</b> ' + t('\\angle A') + ' in right ' + t('\\triangle ACD') + ': ' + t('h=' + Lt(z.b, 1) + '\\sin ' + D(z.A)) + '.' }, { v: z.b * Math.sin(z.A), code: LID + '-radian', hint: 'Your calculator is in <b>radian</b> mode.' }] },
            { label: t('AD='), name: t('AD'), x: AD, dp: 2, unit: 'cm', alts: [{ v: h, code: LID + '-alt-cos', hint: t('AD') + ' is <b>adjacent</b> to ' + t('\\angle A') + ': ' + t('AD=' + Lt(z.b, 1) + '\\cos ' + D(z.A)) + '.' }] },
            { label: t('BC='), name: t('BC'), x: a, dp: 1, unit: 'cm', acc: [Math.hypot(rd(h, 2), z.c - rd(AD, 2))], alts: [{ v: Math.hypot(h, AD), code: LID + '-alt-seg', hint: 'In right ' + t('\\triangle BCD') + ' the legs are ' + t('h') + ' and ' + t('DB=AB-AD') + ', not ' + t('AD') + '.' }, { v: Math.hypot(h, z.c), code: LID + '-alt-seg', hint: 'The leg along the base is ' + t('DB=AB-AD') + ', not all of ' + t('AB') + '.' }, { v: Math.sqrt(Math.abs(DB * DB - h * h)), code: LID + '-alt-seg', hint: t('BC') + ' is the hypotenuse of ' + t('\\triangle BCD') + ': ' + t('BC^2=h^2+DB^2') + '.' }] }],
            { swap: [0, 1], sol: t('\\triangle ACD') + ': ' + t('h=' + Lt(z.b, 1) + '\\sin ' + D(z.A) + '\\approx ' + fx(h, 3)) + ' cm and ' + t('AD=' + Lt(z.b, 1) + '\\cos ' + D(z.A) + '\\approx ' + fx(AD, 3)) + ' cm.<br>' + t('DB=' + Lt(z.c, 1) + '-' + fx(AD, 3) + '\\approx ' + fx(DB, 3)) + ' cm<br>' + t('\\triangle BCD') + ' (Pythagoras): ' + t('BC=\\sqrt{h^2+DB^2}=\\sqrt{' + fx(h, 3) + '^2+' + fx(DB, 3) + '^2}\\approx ' + fx(a, 1)) + ' cm',
              hints: ['In ' + t('\\triangle ACD') + ': SOH for ' + t('h') + ', CAH for ' + t('AD') + '.', 'Then ' + t('DB=AB-AD') + ' and Pythagoras in ' + t('\\triangle BCD') + '.'], text: 'altitude method (SAS)' });
        } },
        { id: '8b', level: 'BEG', make: function (r, z) {
          var a = clSide(z.b, z.c, z.A), B0 = Lt(z.b, 1), C0 = Lt(z.c, 1);
          return mcP(r, 'Which cosine-law equation checks your value of ' + t('BC') + '?', [
            { html: t('BC^2=' + B0 + '^2+' + C0 + '^2-2(' + B0 + ')(' + C0 + ')\\cos ' + D(z.A)), right: true },
            { html: t('BC^2=' + B0 + '^2+' + C0 + '^2+2(' + B0 + ')(' + C0 + ')\\cos ' + D(z.A)), why: 'The cosine law subtracts the last term.' },
            { html: t('BC^2=' + B0 + '^2+' + C0 + '^2-(' + B0 + ')(' + C0 + ')\\cos ' + D(z.A)), why: 'The last term is ' + t('2bc\\cos A') + '.' },
            { html: t('BC^2=' + B0 + '^2-' + C0 + '^2-2(' + B0 + ')(' + C0 + ')\\cos ' + D(z.A)), why: 'Both squares are added.' }],
            t('BC^2=' + B0 + '^2+' + C0 + '^2-2(' + B0 + ')(' + C0 + ')\\cos ' + D(z.A) + '\\approx ' + fx(a * a, 2)) + ', so ' + t('BC\\approx ' + fx(a, 1)) + ' cm ✓', HSAS, 'check with the cosine law');
        } }] },
    { num: '9', parts: [
      { id: '9a', level: 'BEG', make: function (r) {
        return mcP(r, 'What does the cosine law ' + t('a^2=b^2+c^2-2bc\\cos A') + ' become when ' + t('\\angle A=90^\\circ') + '? Why?', [
          { html: t('a^2=b^2+c^2') + ', because ' + t('\\cos 90^\\circ=0') + ': the Pythagorean theorem, with ' + t('a') + ' the hypotenuse.', right: true },
          { html: t('a^2=b^2+c^2-2bc') + ', because ' + t('\\cos 90^\\circ=1') + '.', why: t('\\cos 90^\\circ=0') + ' (the point on the terminal arm is ' + t('(0,1)') + ').' },
          { html: t('a^2=(b-c)^2') + ', because the angle is the largest one.', why: 'Substitute ' + t('\\cos 90^\\circ') + ' into the formula.' },
          { html: 'It doesn’t change: the cosine law only works for oblique triangles.', why: 'The cosine law works in every triangle. Substitute ' + t('\\cos 90^\\circ=0') + '.' }],
          t('\\cos 90^\\circ=0') + ', so the last term is 0: ' + t('a^2=b^2+c^2') + ', the Pythagorean theorem with ' + t('a') + ' (opposite the right angle) the hypotenuse.', ['What is ' + t('\\cos 90^\\circ') + '?'], 'cosine law at 90°');
      } },
      { id: '9b', level: 'EMG', make: function (r) {
        return mcP(r, 'Why is ' + t('a^2>b^2+c^2') + ' when ' + t('\\angle A') + ' is obtuse?', [
          { html: t('\\cos A<0') + ', so ' + t('-2bc\\cos A') + ' is positive: it is <b>added</b> to ' + t('b^2+c^2') + '.', right: true },
          { html: t('\\cos A>1') + ' for an obtuse angle, so the last term is large.', why: 'A cosine is always between ' + t('-1') + ' and ' + t('1') + '. For an obtuse angle it is negative.' },
          { html: 'The term ' + t('2bc\\cos A') + ' is always positive, so it makes ' + t('a^2') + ' larger.', why: 'For an acute angle ' + t('2bc\\cos A') + ' is positive and is subtracted (' + t('a^2<b^2+c^2') + '). The sign of ' + t('\\cos A') + ' decides.' },
          { html: 'Because ' + t('a') + ' is the hypotenuse.', why: 'There is no hypotenuse: the triangle isn’t a right triangle.' }],
          'An obtuse angle is in quadrant II, where cosine is negative. So ' + t('-2bc\\cos A>0') + ' and ' + t('a^2=b^2+c^2+(\\text{a positive number})>b^2+c^2') + '.', ['What is the sign of the cosine of an obtuse angle?'], 'obtuse angle: why a² > b² + c²');
      } }] },
    { num: '10', parts: [
      { id: '10', level: 'PRG', make: function (r) {
        var z = pickWhere(function () { return { th: r.int(40, 115), v1: tenth(r, 3, 6), v2: tenth(r, 2.5, 5.5), T: r.pick([1.5, 2, 2.5, 3, 3.5]) }; }, function (z) { return z.th !== 90 && Math.abs(z.v1 - z.v2) >= 0.3 && !(z.th === 68 && z.v1 === 4.5) && safe(clSide(z.v1 * z.T, z.v2 * z.T, z.th), 1); });
        var d1 = cl(z.v1 * z.T), d2 = cl(z.v2 * z.T), d = clSide(d1, d2, z.th);
        return nP('Two hikers leave a trailhead at the same time on straight paths that make an angle of ' + t(D(z.th)) + '. One walks at ' + t(Lt(z.v1, 1)) + ' km/h and the other at ' + t(Lt(z.v2, 1)) + ' km/h. How far apart are they after ' + t(nT(z.T)) + ' h, to the nearest tenth of a kilometre?', d, 1, { unit: 'km', alts: [{ v: clSide(z.v1, z.v2, z.th), code: LID + '-speed', hint: 'That is how far apart they are after <b>1</b> hour. Find each distance first: speed × time.' }].concat(clAlts(d1, d2, z.th, 'd')),
          sol: 'Distances: ' + t(nT(z.v1) + '(' + nT(z.T) + ')=' + nT(d1)) + ' km and ' + t(nT(z.v2) + '(' + nT(z.T) + ')=' + nT(d2)) + ' km.<br>' + t('d^2=' + nT(d1) + '^2+' + nT(d2) + '^2-2(' + nT(d1) + ')(' + nT(d2) + ')\\cos ' + D(z.th) + '\\approx ' + fx(d * d, 2)) + ', so ' + t('d\\approx ' + fx(d, 1)) + ' km', hints: ['Distance = speed × time for each hiker.'].concat(HSAS.slice(0, 1)), text: 'hikers: distance apart' });
      } }] },
    { num: '11', parts: [
      { id: '11', level: 'PRG', make: function (r) {
        var s = sssGen(r, 30, 85, 0, 'any', [[42, 57, 68], [17, 25, 30]]), A = clAng(s[0], s[1], s[2]), Bq = clAng(s[1], s[0], s[2]), C = clAng(s[2], s[0], s[1]);
        return fP('A triangular lot has sides of ' + s[0] + ' m, ' + s[1] + ' m and ' + s[2] + ' m. Determine all three angles to the nearest degree. Check that they add to ' + t('180^\\circ') + '.', [
          { label: 'opposite ' + s[0] + ' m:', name: 'Angle opposite ' + s[0] + ' m', x: A, dp: 0, unit: '°', alts: clAngAlts(s[0], s[1], s[2]) },
          { label: 'opposite ' + s[1] + ' m:', name: 'Angle opposite ' + s[1] + ' m', x: Bq, dp: 0, unit: '°', alts: clAngAlts(s[1], s[0], s[2]) },
          { label: 'opposite ' + s[2] + ' m:', name: 'Angle opposite ' + s[2] + ' m', x: C, dp: 0, unit: '°', alts: clAngAlts(s[2], s[0], s[1]) }],
          { sum180: true, sol: 'Opposite ' + s[0] + ': ' + t(clAngTex('\\theta', s[0], s[1], s[2], 0)) + '<br>Opposite ' + s[1] + ': ' + t(clAngTex('\\theta', s[1], s[0], s[2], 0)) + '<br>Opposite ' + s[2] + ': ' + t(clAngTex('\\theta', s[2], s[0], s[1], 0)) + '<br>' + t(nT(rd(A, 0)) + '+' + nT(rd(Bq, 0)) + '+' + nT(rd(C, 0)) + '=' + nT(rd(A, 0) + rd(Bq, 0) + rd(C, 0))), hints: HSSS, text: 'SSS: all three angles' });
      } }] },
    { num: '12', parts: [
      { id: '12', level: 'ADV', make: function (r) {
        var z = pickWhere(function () { var s = tenth(r, 15, 30); return { s: s, m: rd(s * (0.45 + 0.33 * r.int(0, 100) / 100), 1) }; }, function (z) { return !(z.s === 27.4) && safe(clSide(z.s, z.m, 45), 1); });
        var d = clSide(z.s, z.m, 45), q = z.s / Math.SQRT2, P = { H: [0, 0], F: [q, q], S2: [0, 2 * q], T3: [-q, q], M: [0, z.m] };
        var svg = fig(HW.fig({ pts: P, segs: [['H', 'F', fs(z.s, 1) + ' m'], ['F', 'S2'], ['S2', 'T3'], ['T3', 'H'], ['H', 'S2', null, { dash: true, width: 1.4 }], ['M', 'F', null, { color: '#2b55a0', width: 2.6 }]], names: { H: 'H', F: 'F', S2: '2nd', T3: '3rd', M: 'M' }, extra: [{ type: 'eye', at: P.M }], width: 220, height: 230, aria: 'ball diamond with the pitcher’s mound on the diagonal' }));
        return nP('A ball diamond is a square with sides of ' + t(Lt(z.s, 1)) + ' m. The pitcher’s mound ' + t('M') + ' is ' + t(Lt(z.m, 1)) + ' m from home plate ' + t('H') + ', on the diagonal from home plate to second base. Determine the distance from the mound to first base ' + t('F') + ', to the nearest tenth of a metre.' + svg, d, 1, { unit: 'm', alts: [{ v: Math.hypot(z.s, z.m), code: LID + '-right', hint: 'The angle at ' + t('H') + ' between the baseline and the diagonal is ' + t('45^\\circ') + ', not ' + t('90^\\circ') + '.' }, { v: clSide(z.s, z.m, 90), code: LID + '-angle', hint: 'The diagonal <b>bisects</b> the ' + t('90^\\circ') + ' corner: ' + t('\\angle MHF=45^\\circ') + '.' }].concat(clAlts(z.s, z.m, 45, 'MF')),
          sol: 'The diagonal bisects the ' + t('90^\\circ') + ' corner, so ' + t('\\angle MHF=45^\\circ') + '.<br>' + t('MF^2=' + Lt(z.s, 1) + '^2+' + Lt(z.m, 1) + '^2-2(' + Lt(z.s, 1) + ')(' + Lt(z.m, 1) + ')\\cos 45^\\circ\\approx ' + fx(d * d, 2)) + ', so ' + t('MF\\approx ' + fx(d, 1)) + ' m', hints: ['What angle does the diagonal of a square make with a side?', 'Then it is SAS in ' + t('\\triangle MHF') + '.'], text: 'ball diamond: mound to first base' });
      } }] },
    { num: '13', parts: [
      { id: '13', level: 'MAS', make: function (r) {
        var z = pickWhere(function () { var p = tenth(r, 5, 10); return { p: p, q: rd(p + tenth(r, 2, 6), 1), d: 0, f: r.int(0, 100) / 100 }; }, function (z) {
          var lo = z.q - z.p + 1, hi = Math.sqrt(z.p * z.p + z.q * z.q) - 0.8; if (hi <= lo) return false; z.d = rd(lo + (hi - lo) * z.f, 1); if (z.p === 7 && z.q === 11 && z.d === 8) return false;
          var th = clAng(z.d, z.p, z.q), D2 = Math.sqrt(2 * z.p * z.p + 2 * z.q * z.q - z.d * z.d); return th > 25 && th < 80 && safe(th, 0) && safe(D2, 1);
        });
        var th = clAng(z.d, z.p, z.q), D2 = Math.sqrt(2 * z.p * z.p + 2 * z.q * z.q - z.d * z.d), D2e = clSide(z.p, z.q, 180 - rd(th, 0));
        var P = { A: [0, 0], B: [z.q, 0], D: [z.p * cs(th), z.p * sn(th)] }; P.C = [P.B[0] + P.D[0], P.D[1]];
        return fP('A parallelogram has sides of ' + t(Lt(z.p, 1)) + ' cm and ' + t(Lt(z.q, 1)) + ' cm, and its shorter diagonal is ' + t(Lt(z.d, 1)) + ' cm. Determine the angles of the parallelogram (to the nearest degree) and the length of its longer diagonal (to the nearest tenth).', [
          { label: 'acute angle:', name: 'Acute angle', x: th, dp: 0, unit: '°', alts: clAngAlts(z.d, z.p, z.q).concat([{ v: 180 - th, code: LID + '-diag', hint: 'The <b>shorter</b> diagonal is opposite the <b>acute</b> angle.' }]) },
          { label: 'obtuse angle:', name: 'Obtuse angle', x: 180 - th, dp: 0, unit: '°', acc: [180 - rd(th, 0)], alts: [{ v: th, code: LID + '-diag', hint: 'Adjacent angles of a parallelogram add to ' + t('180^\\circ') + '.' }] },
          { label: 'longer diagonal:', name: 'Longer diagonal', x: D2, dp: 1, unit: 'cm', acc: [clSide(z.p, z.q, 180 - rd(th, 1))], alts: [{ v: D2e, code: LID + '-early', hint: 'Keep the angle unrounded (or use ' + t('\\cos(180^\\circ-\\theta)=-\\cos\\theta') + ' exactly).' }, { v: Math.hypot(z.p, z.q), code: LID + '-right', hint: 'The angle between the sides is obtuse, not ' + t('90^\\circ') + '.' }, { v: clSide(z.p, z.q, th), code: LID + '-diag', hint: 'That is the shorter diagonal again. The longer diagonal is opposite the <b>obtuse</b> angle.' }].concat(clAlts(z.p, z.q, 180 - th, 'd').slice(0, 2)) }],
          { swap: [0, 1], sol: fig(HW.fig({ pts: P, segs: [['A', 'B', fs(z.q, 1) + ' cm'], ['B', 'C'], ['C', 'D'], ['D', 'A', fs(z.p, 1) + ' cm'], ['B', 'D', fs(z.d, 1) + ' cm', { dash: true }], ['A', 'C', null, { dash: true }]], angles: [['A', 'B', 'D', 'θ']], extra: [{ type: 'text', at: [P.C[0] * 0.78 + 0.25, P.C[1] * 0.78 - 0.35], text: 'd' }], width: 320, height: 230, aria: 'parallelogram with its diagonals' })) + 'The shorter diagonal is opposite the acute angle ' + t('\\theta') + ': ' + t('\\cos\\theta=\\dfrac{' + Lt(z.p, 1) + '^2+' + Lt(z.q, 1) + '^2-' + Lt(z.d, 1) + '^2}{2(' + Lt(z.p, 1) + ')(' + Lt(z.q, 1) + ')}\\approx ' + fx((z.p * z.p + z.q * z.q - z.d * z.d) / (2 * z.p * z.q), 4)) + ', so ' + t('\\theta\\approx ' + Dx(th, 1) + '\\approx ' + Dx(th, 0)) + '; the other angle is ' + t('\\approx ' + Dx(180 - th, 0)) + '.<br>Longer diagonal, opposite the obtuse angle: ' + t('\\cos(180^\\circ-\\theta)=-\\cos\\theta') + ', so ' + t('d^2=' + Lt(z.p, 1) + '^2+' + Lt(z.q, 1) + '^2+2(' + Lt(z.p, 1) + ')(' + Lt(z.q, 1) + ')\\cos\\theta\\approx ' + fx(D2 * D2, 2)) + ', ' + t('d\\approx ' + fx(D2, 1)) + ' cm',
            hints: ['Each diagonal splits the parallelogram into two triangles with sides ' + t(Lt(z.p, 1)) + ' and ' + t(Lt(z.q, 1)) + '. The shorter diagonal is opposite the acute angle.', 'Adjacent angles of a parallelogram add to ' + t('180^\\circ') + '.'], text: 'parallelogram: angles and the longer diagonal' });
      } }] },
    { num: '14', parts: [
      { id: '14', level: 'ADV', make: function (r) {
        var z = pickWhere(function () { var p = r.int(3, 6), q = r.int(p + 1, 9); return { p: p, q: q, s: p + q + r.int(1, 4) }; }, function (z) { return !(z.p === 4 && z.q === 7 && z.s === 12); });
        var v = (z.p * z.p + z.q * z.q - z.s * z.s) / (2 * z.p * z.q), vt = fx(v, 2);
        return mcP(r, 'A student tries to find the largest angle of a triangle with sides ' + t(z.p) + ', ' + t(z.q) + ' and ' + t(z.s) + '. What happens, and why?', [
          { html: t('\\cos\\theta=\\dfrac{' + z.p + '^2+' + z.q + '^2-' + z.s + '^2}{2(' + z.p + ')(' + z.q + ')}\\approx ' + vt) + ', less than ' + t('-1') + ', so ' + t('\\cos^{-1}') + ' gives an error. No such triangle exists: ' + t(z.p + '+' + z.q + '<' + z.s) + '.', right: true },
          { html: t('\\cos\\theta\\approx ' + vt) + ', so ' + t('\\theta') + ' is a little more than ' + t('180^\\circ') + '.', why: 'A triangle’s angle is less than ' + t('180^\\circ') + ', and no angle has a cosine less than ' + t('-1') + '.' },
          { html: 'The calculator gives an error because it is in radian mode.', why: 'Radian mode would still give a value for a cosine between ' + t('-1') + ' and ' + t('1') + '. Here the cosine is ' + t('\\approx ' + vt) + '.' },
          { html: 'The cosine law can’t be used for the largest angle; use the sine law instead.', why: 'The cosine law is the safe way to find the largest angle. The problem is the triangle itself.' }],
          t('\\cos\\theta=\\dfrac{' + (z.p * z.p + z.q * z.q - z.s * z.s) + '}{' + 2 * z.p * z.q + '}\\approx ' + vt) + '. A cosine can’t be less than ' + t('-1') + ', so the calculator gives an error. The two shorter sides can’t reach: ' + t(z.p + '+' + z.q + '=' + (z.p + z.q) + '<' + z.s) + ', so no such triangle exists.', ['Work out the cosine. What values can a cosine have?'], 'impossible triangle');
      } }] },
    { num: '15', parts: [
      { id: '15', level: 'MAS', make: function (r) {
        var tr = r.pick(TRI120.slice(0, 6)), sh = r.chance(0.5) ? [tr[1], tr[0], tr[2]] : tr.slice(), c2 = 2 * sh[0] * sh[1];
        return intP('The sides of a triangle are in the ratio ' + t(sh[0] + ':' + sh[1] + ':' + sh[2]) + '. Without a calculator, determine the exact measure of its largest angle.', 120, { unit: '°', cands: [[60, LID + '-ref', t('\\cos\\theta=-\\tfrac{1}{2}') + ' is <b>negative</b>, so the angle is obtuse: ' + t('180^\\circ-60^\\circ') + '.'], [-0.5, LID + '-cos', 'That is ' + t('\\cos\\theta') + '. Which angle has that cosine?']],
          sol: 'Let the sides be ' + t(sh[0] + 'k,\\ ' + sh[1] + 'k,\\ ' + sh[2] + 'k') + '. ' + t('\\cos\\theta=\\dfrac{' + sh[0] * sh[0] + 'k^2+' + sh[1] * sh[1] + 'k^2-' + sh[2] * sh[2] + 'k^2}{2(' + sh[0] + 'k)(' + sh[1] + 'k)}=\\dfrac{-' + (c2 / 2) + 'k^2}{' + c2 + 'k^2}=-\\dfrac{1}{2}') + '<br>The reference angle is ' + t('60^\\circ') + ' and the angle is obtuse, so ' + t('\\theta=120^\\circ') + '.', hints: ['Call the sides ' + t(sh[0] + 'k') + ', ' + t(sh[1] + 'k') + ', ' + t(sh[2] + 'k') + ': the ' + t('k^2') + ' cancels.', 'The largest angle is opposite ' + t(sh[2] + 'k') + '.'], text: 'exact largest angle from a ratio' });
      } }] },
    { num: '16', parts: [
      { id: '16', level: 'PRG', make: function (r) {
        var z = pickWhere(function () { return { A: r.pick([150, 30, 135, 45]), b: r.int(2, 8), c: r.int(2, 8) }; }, function (z) { return z.b !== z.c && !(z.A === 150 && ((z.b === 6 && z.c === 4) || (z.b === 4 && z.c === 6))); });
        var rt = z.A === 150 || z.A === 30 ? 3 : 2, sg = z.A > 90 ? '+' : '-', og = sg === '+' ? '-' : '+', S = z.b * z.b + z.c * z.c, k = z.b * z.c, cv = (z.A > 90 ? '-' : '') + '\\tfrac{\\sqrt{' + rt + '}}{2}';
        return mcP(r, '<i>(Multiple Choice)</i> In ' + t('\\triangle ABC') + ', ' + t('AB=' + z.c) + ', ' + t('AC=' + z.b) + ' and ' + t('\\angle A=' + D(z.A)) + '. The exact value of ' + t('(BC)^2') + ' is', [
          { html: t(S + sg + k + '\\sqrt{' + rt + '}'), right: true },
          { html: t(S + og + k + '\\sqrt{' + rt + '}'), why: t('\\cos ' + D(z.A) + '=' + cv) + '. ' + (z.A > 90 ? 'Subtracting a negative adds.' : 'It is positive, so the term is subtracted.') },
          { html: t(S + sg + 2 * k + '\\sqrt{' + rt + '}'), why: t('2(' + z.b + ')(' + z.c + ')\\cdot\\tfrac{\\sqrt{' + rt + '}}{2}=' + k + '\\sqrt{' + rt + '}') + ': the 2 cancels.' },
          { html: t(S), why: 'The last term isn’t 0: ' + t('\\cos ' + D(z.A) + '\\neq 0') + '.' }],
          t('(BC)^2=' + z.c + '^2+' + z.b + '^2-2(' + z.c + ')(' + z.b + ')\\cos ' + D(z.A) + '=' + S + '-' + 2 * k + '\\left(' + cv + '\\right)=' + S + sg + k + '\\sqrt{' + rt + '}'), ['Exact value: ' + t('\\cos ' + D(z.A) + '=' + cv) + '.'], 'MC: exact cosine law');
      } }] },
    { num: '17', parts: [
      { id: '17', level: 'EMG', make: function (r) {
        var z = pickWhere(function () { return { b: r.int(3, 12), c: r.int(3, 12), A: r.int(35, 75) }; }, function (z) {
          if (Math.abs(z.b - z.c) < 2 || (z.b === 5 && z.c === 8 && z.A === 50)) return false; var a = clSide(z.b, z.c, z.A), v = [a, Math.sqrt((z.b * z.b + z.c * z.c - 2 * z.b * z.c) * cs(z.A)), Math.sqrt(z.b * z.b + z.c * z.c + 2 * z.b * z.c * cs(z.A)), a * a].map(function (x) { return fs(x, 1); });
          return v.filter(function (x, i) { return v.indexOf(x) === i; }).length === 4 && safe(a, 1);
        });
        var a = clSide(z.b, z.c, z.A), S = z.b * z.b + z.c * z.c, k = 2 * z.b * z.c;
        return mcNum(r, '<i>(Multiple Choice)</i> In ' + t('\\triangle ABC') + ', ' + t('b=' + z.b) + ', ' + t('c=' + z.c) + ' and ' + t('\\angle A=' + D(z.A)) + '. To the nearest tenth, ' + t('a') + ' is', a, 1, [
          [Math.sqrt((S - k) * cs(z.A)), 'Order of operations: ' + t('(' + S + '-' + k + ')\\cos ' + D(z.A)) + ' is wrong. Multiply ' + t(k + '\\cos ' + D(z.A)) + ' first, then subtract.'],
          [Math.sqrt(S + k * cs(z.A)), 'The cosine law subtracts ' + t('2bc\\cos A') + '.'],
          [a * a, 'That is ' + t('a^2') + '. Take the square root.']], '',
          t('a=\\sqrt{' + S + '-' + k + '\\cos ' + D(z.A) + '}\\approx ' + fx(a, 1)) + '. (Wrong order: ' + t('\\sqrt{(' + S + '-' + k + ')\\cos ' + D(z.A) + '}') + '; adding the last term; or ' + t('a^2') + ' without the root.)', HSAS, 'MC: cosine law order of operations');
      } }] },
    { num: '18', parts: [
      { id: '18', level: 'PRG', make: function (r) {
        var z = pickWhere(function () { var p = tenth(r, 6, 14), q = tenth(r, 6, 14); return { p: p, q: q, s: rd(Math.sqrt(p * p + q * q) + tenth(r, 1.5, 6), 1) }; }, function (z) {
          if (z.s >= z.p + z.q - 0.5 || Math.abs(z.p - z.q) < 0.5 || (z.p === 9.5 && z.q === 11)) return false; var th = clAng(z.s, z.p, z.q); return th > 95 && th < 160 && safe(th, 0);
        });
        var th = clAng(z.s, z.p, z.q);
        return deg('<i>(Numerical Response)</i> Two ships leave port ' + t('P') + '. One sails ' + t(Lt(z.p, 1)) + ' km to ' + t('R') + ' and the other sails ' + t(Lt(z.q, 1)) + ' km to ' + t('Q') + '. The ships are then ' + t(Lt(z.s, 1)) + ' km apart. The angle between their directions, ' + t('\\angle RPQ') + ', to the nearest degree, is ______°.', th, 0, { nr: true, alts: clAngAlts(z.s, z.p, z.q),
          sol: t(clAngTex('P', z.s, z.p, z.q, 1)), hints: HSSS, text: 'NR: angle between two ships' });
      } }] }
  ];

  var EXTRA = [
    { num: 'A1', section: 'A. Skills', stem: 'Sketch each triangle and determine the third side to the nearest tenth.', parts: [
      { id: 'eA1a', level: 'BEG', make: function (r) { return sasText(r, sasGen(r, 35, 65, 6, 20, 0, [[47, 14, 9]]), 0, 'cm', 'cosine law: third side'); } },
      { id: 'eA1b', level: 'EMG', make: function (r) { return sasText(r, sasGen(r, 120, 150, 2, 8, 1, [[138, 3.6, 5.1]]), 1, 'm', 'cosine law: third side (obtuse)'); } },
      { id: 'eA1c', level: 'BEG', make: function (r) { return sasText(r, sasGen(r, 20, 40, 60, 150, 0, [[29, 120, 85]]), 0, 'km', 'cosine law: third side (long sides)'); } }] },
    { num: 'A2', stem: 'Determine the indicated angle to the nearest degree.', parts: [
      { id: 'eA2a', level: 'BEG', make: function (r) { return sssText(r, sssGen(r, 8, 20, 0, 'acute', [[11, 13, 15]]), 0, 0, 'cosine law: smallest angle'); } },
      { id: 'eA2b', level: 'EMG', make: function (r) { return sssText(r, sssGen(r, 8, 30, 0, 'obtuse', [[12, 16, 25]]), 0, 2, 'cosine law: obtuse angle'); } },
      { id: 'eA2c', level: 'BEG', make: function (r) { return sssText(r, sssGen(r, 3, 12, 1, 'any', [[4.4, 7.2, 9]]), 1, 0, 'cosine law: angle (decimals)'); } }] },
    { num: 'A3', parts: [
      { id: 'eA3', level: 'PRG', make: function (r) {
        var z = pickWhere(function () { return { A: r.pick([30, 30, 150]), k: r.int(1, 5), c: r.int(2, 10) }; }, function (z) { if (z.A === 30 && z.k === 2 && z.c === 4) return false; var N = 3 * z.k * z.k + z.c * z.c + (z.A > 90 ? 3 : -3) * z.k * z.c; return N > 1 && N < 400; });
        var sg = z.A > 90 ? 1 : -1, N = 3 * z.k * z.k + z.c * z.c + sg * 3 * z.k * z.c, cv = (sg > 0 ? '-' : '') + '\\tfrac{\\sqrt{3}}{2}';
        return exP('Without a calculator, determine ' + t('a') + ' exactly in ' + t('\\triangle ABC') + ' if ' + t('\\angle A=' + D(z.A)) + ', ' + t('b=' + radIn(z.k, 3)) + ' and ' + t('c=' + z.c) + '.', N, { before: t('a='), cands: [[Math.sqrt(3 * z.k * z.k + z.c * z.c - sg * 3 * z.k * z.c), LID + '-cos-sign', t('\\cos ' + D(z.A) + '=' + cv) + '.'], [Math.sqrt(z.k * z.k + z.c * z.c + sg * 3 * z.k * z.c), LID + '-noroot', t('b^2=(' + radIn(z.k, 3) + ')^2=' + 3 * z.k * z.k) + '.']],
          sol: t('a^2=(' + radIn(z.k, 3) + ')^2+' + z.c + '^2-2(' + radIn(z.k, 3) + ')(' + z.c + ')\\left(' + cv + '\\right)=' + 3 * z.k * z.k + '+' + z.c * z.c + (sg > 0 ? '+' : '-') + z.k * z.c + '(3)=' + N) + ', so ' + t('a=' + (rootTex(N) === '\\sqrt{' + N + '}' ? '' : '\\sqrt{' + N + '}=') + rootTex(N)), hints: ['Exact value: ' + t('\\cos ' + D(z.A) + '=' + cv) + '.', t('\\sqrt{3}\\times\\sqrt{3}=3') + '.'], text: 'exact cosine law (√3 side)' });
      } }] },
    { num: 'A4', stem: 'Choose the equation you would use (do not solve it).', parts: [
      { id: 'eA4a', level: 'LIM', make: function (r) {
        var n = r.pick(SETS), d = low(n[0]), e = low(n[1]), f = low(n[2]);
        return mcP(r, 'In ' + t('\\triangle ' + n.join('')) + ', find ' + t(e) + ' given ' + t(d) + ', ' + t(f) + ' and ' + t('\\angle ' + n[1]) + '.', [
          { html: t(e + '^2=' + d + '^2+' + f + '^2-2' + d + f + '\\cos ' + n[1]), right: true },
          { html: t(e + '^2=' + d + '^2+' + f + '^2-2' + d + f + '\\cos ' + n[0]), why: 'Use the angle between ' + t(d) + ' and ' + t(f) + ', opposite ' + t(e) + ': ' + t('\\angle ' + n[1]) + '.' },
          { html: t('\\dfrac{' + e + '}{\\sin ' + n[1] + '}=\\dfrac{' + d + '}{\\sin ' + n[0] + '}'), why: t('\\angle ' + n[0]) + ' isn’t known: SAS needs the cosine law.' },
          { html: t(e + '^2=' + d + '^2+' + f + '^2+2' + d + f + '\\cos ' + n[1]), why: 'The cosine law subtracts the last term.' }],
          'SAS: ' + t(e + '^2=' + d + '^2+' + f + '^2-2' + d + f + '\\cos ' + n[1]), HSAS, 'equation: SAS');
      } },
      { id: 'eA4b', level: 'BEG', make: function (r) {
        var n = r.pick(SETS), x = low(n[0]), y = low(n[1]), zz = low(n[2]);
        return mcP(r, 'In ' + t('\\triangle ' + n.join('')) + ', find ' + t('\\angle ' + n[1]) + ' given ' + t(x) + ', ' + t(y) + ' and ' + t(zz) + '.', [
          { html: t('\\cos ' + n[1] + '=\\dfrac{' + x + '^2+' + zz + '^2-' + y + '^2}{2' + x + zz + '}'), right: true },
          { html: t('\\cos ' + n[1] + '=\\dfrac{' + x + '^2+' + y + '^2-' + zz + '^2}{2' + x + y + '}'), why: 'Subtract the side opposite ' + t('\\angle ' + n[1]) + ': ' + t(y + '^2') + '.' },
          { html: t('\\sin ' + n[1] + '=\\dfrac{' + y + '\\sin ' + n[0] + '}{' + x + '}'), why: 'No angle is known, so the sine law can’t be used.' },
          { html: t('\\cos ' + n[1] + '=\\dfrac{' + x + '^2+' + zz + '^2-' + y + '^2}{' + x + zz + '}'), why: 'The denominator is ' + t('2' + x + zz) + '.' }],
          'SSS: ' + t('\\cos ' + n[1] + '=\\dfrac{' + x + '^2+' + zz + '^2-' + y + '^2}{2' + x + zz + '}'), HSSS, 'equation: SSS');
      } }] },
    { num: 'B1', section: 'B. Applying', parts: [
      { id: 'eB1', level: 'PRG', make: function (r) {
        var s = pickWhere(function () { return sssGen(r, 7, 18, 1, 'any', [[9.4, 12.7, 15.1]]); }, function (s) { var A = clAng(s[0], s[1], s[2]), Bq = clAng(s[1], s[0], s[2]), C = 180 - A - Bq; return safe(A, 1) && safe(Bq, 1) && rd(180 - rd(A, 1) - rd(Bq, 1), 0) === rd(C, 0); });
        var nm = r.pick(SETS), A = clAng(s[0], s[1], s[2]), Bq = clAng(s[1], s[0], s[2]), C = 180 - A - Bq;
        return fP('Solve the triangle with sides ' + t(low(nm[0]) + '=' + Lt(s[0], 1)) + ' cm, ' + t(low(nm[1]) + '=' + Lt(s[1], 1)) + ' cm and ' + t(low(nm[2]) + '=' + Lt(s[2], 1)) + ' cm (angles to the nearest degree).', [
          { label: t('\\angle ' + nm[0] + '='), name: t('\\angle ' + nm[0]), x: A, dp: 0, unit: '°', alts: clAngAlts(s[0], s[1], s[2]) },
          { label: t('\\angle ' + nm[1] + '='), name: t('\\angle ' + nm[1]), x: Bq, dp: 0, unit: '°', alts: clAngAlts(s[1], s[0], s[2]) },
          { label: t('\\angle ' + nm[2] + '='), name: t('\\angle ' + nm[2]), x: C, dp: 0, unit: '°', acc: [180 - rd(A, 1) - rd(Bq, 1)], alts: clAngAlts(s[2], s[0], s[1]) }],
          { sum180: true, sol: t(clAngTex(nm[0], s[0], s[1], s[2], 1, 1)) + '<br>' + t(clAngTex(nm[1], s[1], s[0], s[2], 1, 1)) + '<br>' + t('\\angle ' + nm[2] + '\\approx 180^\\circ-' + Dx(A, 1) + '-' + Dx(Bq, 1) + '\\approx ' + Dx(C, 0)), hints: HSSS.concat(['Find two angles with the cosine law, then the third from the angle sum.']), text: 'solve the triangle (SSS)' });
      } }] },
    { num: 'B2', parts: [
      { id: 'eB2', level: 'PRG', make: function (r) {
        var z = pickWhere(function () { return { a: r.int(200, 700), b: r.int(200, 700), C: r.int(40, 120) }; }, function (z) { return Math.abs(z.a - z.b) > 40 && z.C !== 90 && !(z.C === 71 && z.a === 386) && safe(clSide(z.a, z.b, z.C), 0); });
        var d = clSide(z.a, z.b, z.C);
        return nP('A tunnel will be built straight through a hill from ' + t('A') + ' to ' + t('B') + '. From a point ' + t('C') + ', a surveyor measures ' + t('CA=' + z.a) + ' m, ' + t('CB=' + z.b) + ' m and ' + t('\\angle ACB=' + D(z.C)) + '. Determine the length of the tunnel to the nearest metre.', d, 0, { unit: 'm', alts: clAlts(z.a, z.b, z.C, 'AB'),
          sol: t('AB^2=' + z.a + '^2+' + z.b + '^2-2(' + z.a + ')(' + z.b + ')\\cos ' + D(z.C) + '\\approx ' + F(fs(d * d, 0))) + ', so ' + t('AB\\approx ' + fx(d, 0)) + ' m', hints: HSAS, text: 'tunnel length' });
      } }] },
    { num: 'B3', parts: [
      { id: 'eB3', level: 'ADV', make: function (r) {
        var z = pickWhere(function () { return { h: tenth(r, 5, 12), d: tenth(r, 6, 18), s: r.int(6, 20) }; }, function (z) { return !(z.h === 8.5 && z.d === 12) && safe(clSide(z.h, z.d, 90 + z.s), 1); });
        var Wq = 90 + z.s, w = clSide(z.h, z.d, Wq), u = [-cs(z.s), -sn(z.s)], P = { F: [0, 0], T: [0, z.h], K: [z.d * u[0], z.d * u[1]], G1: [0.2 * z.d * cs(z.s), 0.2 * z.d * sn(z.s)], G0: [1.12 * z.d * u[0], 1.12 * z.d * u[1]] };
        return nP('An ' + t(Lt(z.h, 1)) + ' m vertical pole stands on a hillside that slopes at ' + t(D(z.s)) + '. A guy wire runs from the top of the pole to a stake ' + t(Lt(z.d, 1)) + ' m downhill from the base of the pole. Sketch a diagram and determine the length of the wire, to the nearest tenth of a metre.', w, 1, { unit: 'm', alts: [{ v: Math.hypot(z.h, z.d), code: LID + '-right', hint: 'The ground is sloped, so the pole and the ground don’t meet at ' + t('90^\\circ') + '.' }, { v: clSide(z.h, z.d, 90 - z.s), code: LID + '-slope', hint: 'The stake is <b>downhill</b>: the ground drops away from the pole, so the angle is ' + t('90^\\circ+' + D(z.s)) + '.' }].concat(clAlts(z.h, z.d, Wq, 'w')),
          sol: fig(HW.fig({ pts: P, segs: [['G0', 'G1', null, { color: '#8a6a3a', width: 2.6 }], ['F', 'T', fs(z.h, 1) + ' m', { color: '#8a8f99', width: 4 }], ['T', 'K', 'w'], ['F', 'K', fs(z.d, 1) + ' m', { width: 0.01, side: -1 }]], angles: [['F', 'K', 'T', Wq + '°', { r: 15 }]], names: { F: 'base', T: 'top', K: 'stake' }, width: 280, height: 240, aria: 'pole on a hillside with a guy wire' })) + 'The angle between the pole and the downhill slope is ' + t('90^\\circ+' + D(z.s) + '=' + D(Wq)) + '.<br>' + t('w^2=' + Lt(z.h, 1) + '^2+' + Lt(z.d, 1) + '^2-2(' + Lt(z.h, 1) + ')(' + Lt(z.d, 1) + ')\\cos ' + D(Wq) + '\\approx ' + fx(w * w, 2)) + ', so ' + t('w\\approx ' + fx(w, 1)) + ' m',
          hints: ['Find the angle between the pole and the ground on the downhill side: the pole is vertical and the ground drops ' + t(D(z.s)) + ' below the horizontal.'].concat(HSAS.slice(0, 1)), text: 'guy wire on a hillside' });
      } }] },
    { num: 'B4', parts: [
      { id: 'eB4', level: 'ADV', make: function (r) {
        var z = pickWhere(function () { var h = r.int(3, 9); return { h: h, m: h + r.int(2, 6), hr: r.pick([2, 4, 8, 10]) }; }, function (z) { return !(z.h === 6 && z.m === 9 && z.hr === 4); });
        var gap = Math.min(z.hr, 12 - z.hr) * 30, sg = gap > 90 ? 1 : -1, N = z.h * z.h + z.m * z.m + sg * z.h * z.m, d = Math.sqrt(N), Nw = z.h * z.h + z.m * z.m - sg * z.h * z.m;
        var ang = z.hr * 30, R = 1, P = { O: [0, 0], Hh: [z.h * sn(ang), z.h * cs(ang)], Mm: [0, z.m], T12: [0, z.m * 1.12] };
        return fP('A clock has an hour hand ' + t(z.h) + ' cm long and a minute hand ' + t(z.m) + ' cm long. Determine the distance between the tips of the hands at ' + z.hr + ':00, exactly (simplest radical form) and to the nearest tenth.', [
          { label: 'exact:', name: 'Exact distance', kind: 'exact', check: exCheck(N, [[Math.sqrt(Nw), LID + '-cos-sign', 'At ' + z.hr + ':00 the hands are ' + t(D(gap)) + ' apart, and ' + t('\\cos ' + D(gap) + '=' + (sg > 0 ? '-' : '') + '\\tfrac{1}{2}') + '.']]), key: rootTex(N), badKey: rootTex(Nw), after: 'cm' },
          { label: 'nearest tenth:', name: 'To the nearest tenth', x: d, dp: 1, unit: 'cm', alts: [{ v: Math.sqrt(Nw), code: LID + '-cos-sign', hint: 'At ' + z.hr + ':00 the angle between the hands is ' + t(D(gap)) + '.' }, { v: Math.hypot(z.h, z.m), code: LID + '-right', hint: 'The hands are ' + t(D(gap)) + ' apart, not ' + t('90^\\circ') + '.' }, { v: N, code: LID + '-noroot', hint: 'That is ' + t('d^2') + '.' }] }],
          { sol: fig(HW.fig({ pts: P, segs: [['O', 'Hh', z.h + ' cm', { width: 3.4 }], ['O', 'Mm', z.m + ' cm', { width: 2.2 }], ['Hh', 'Mm', 'd', { dash: true }]], angles: [['O', 'Mm', 'Hh', gap + '°']], names: false, width: 230, height: 230, aria: 'clock hands' })) + 'At ' + z.hr + ':00 the hands are ' + t(Math.min(z.hr, 12 - z.hr) + '\\times 30^\\circ=' + D(gap)) + ' apart.<br>' + t('d^2=' + z.h + '^2+' + z.m + '^2-2(' + z.h + ')(' + z.m + ')\\left(' + (sg > 0 ? '-' : '') + '\\tfrac{1}{2}\\right)=' + N) + ', so ' + t('d=' + (rootTex(N) === '\\sqrt{' + N + '}' ? '' : '\\sqrt{' + N + '}=') + rootTex(N) + '\\approx ' + fx(d, 1)) + ' cm',
            hints: ['Each hour on a clock is ' + t('360^\\circ\\div 12=30^\\circ') + '.', 'Exact value: ' + t('\\cos 60^\\circ=\\tfrac{1}{2}') + ', ' + t('\\cos 120^\\circ=-\\tfrac{1}{2}') + '.'], text: 'clock hands: exact distance' });
      } }] },
    { num: 'B5', parts: [
      { id: 'eB5', level: 'EMG', make: function (r) {
        var s = pickWhere(function () { return sssGen(r, 5, 20, 0, 'any', [[8, 13, 15]]); }, function (s) { var v = [clAng(s[2], s[0], s[1]), clAng(s[0], s[1], s[2]), clAng(s[1], s[0], s[2]), 180 - clAng(s[2], s[0], s[1])].map(function (x) { return fs(x, 1); }); return v.filter(function (x, i) { return v.indexOf(x) === i; }).length === 4 && safe(clAng(s[2], s[0], s[1]), 1); });
        var C = clAng(s[2], s[0], s[1]);
        return mcNum(r, '<i>(Multiple Choice)</i> The largest angle of a triangle with sides ' + t(s[0]) + ', ' + t(s[1]) + ' and ' + t(s[2]) + ', to the nearest tenth of a degree, is', C, 1, [
          [clAng(s[0], s[1], s[2]), 'That is the smallest angle (opposite ' + t(s[0]) + '). The largest is opposite the longest side, ' + t(s[2]) + '.'], [clAng(s[1], s[0], s[2]), 'That is the angle opposite ' + t(s[1]) + '.'], [180 - C, 'Check the sign of the cosine: ' + t('\\cos\\theta=\\dfrac{' + (s[0] * s[0] + s[1] * s[1] - s[2] * s[2]) + '}{' + 2 * s[0] * s[1] + '}') + '.']], '°',
          'Opposite ' + t(s[2]) + ': ' + t('\\cos\\theta=\\dfrac{' + s[0] + '^2+' + s[1] + '^2-' + s[2] + '^2}{2(' + s[0] + ')(' + s[1] + ')}=\\dfrac{' + (s[0] * s[0] + s[1] * s[1] - s[2] * s[2]) + '}{' + 2 * s[0] * s[1] + '}') + ', ' + t('\\theta\\approx ' + Dx(C, 1)), HSSS, 'MC: largest angle');
      } }] },
    { num: 'B6', parts: [
      { id: 'eB6', level: 'PRG', make: function (r) {
        var z = pickWhere(function () { return { a: tenth(r, 5, 15), b: tenth(r, 5, 15), C: r.int(40, 115) }; }, function (z) { return Math.abs(z.a - z.b) >= 1 && z.C !== 90 && !(z.a === 9 && z.C === 74) && safe(clSide(z.a, z.b, z.C), 1); });
        var d = clSide(z.a, z.b, z.C);
        return nP('<i>(Numerical Response)</i> Two straight paths lead from a fountain to two benches, ' + t(Lt(z.a, 1)) + ' m and ' + t(Lt(z.b, 1)) + ' m away. The angle between the paths is ' + t(D(z.C)) + '. The distance between the benches, to the nearest tenth of a metre, is ______ m.', d, 1, { nr: true, alts: clAlts(z.a, z.b, z.C, 'd'),
          sol: t('d^2=' + Lt(z.a, 1) + '^2+' + Lt(z.b, 1) + '^2-2(' + Lt(z.a, 1) + ')(' + Lt(z.b, 1) + ')\\cos ' + D(z.C) + '\\approx ' + fx(d * d, 2)) + ', so ' + t('d\\approx ' + fx(d, 1)) + ' m', hints: HSAS, text: 'NR: benches' });
      } }] },
    { num: 'C1', section: 'C. Stretch', shared: function (r) {
        return pickWhere(function () { var s = r.shuffle([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]).slice(0, 3).sort(function (a, b) { return b - a; }); return { l: s[0], w: s[1], h: s[2] }; }, function (z) { return !(z.l === 8 && z.w === 6 && z.h === 5) && safe(acs(z.h * z.h / Math.sqrt((z.l * z.l + z.h * z.h) * (z.w * z.w + z.h * z.h))), 0); });
      },
      stem: function (z) { return 'A box measures ' + t(z.l + '\\text{ cm}\\times ' + z.w + '\\text{ cm}\\times ' + z.h + '\\text{ cm}') + '. From one corner, a diagonal is drawn across each of the three faces that meet there; their far ends form a triangle.' + fig(HW.solid('rectprism', { l: z.l + ' cm', w: z.w + ' cm', h: z.h + ' cm', width: 220 })); },
      parts: [
        { id: 'eC1a', level: 'ADV', make: function (r, z) {
          var N1 = z.l * z.l + z.w * z.w, N2 = z.l * z.l + z.h * z.h, N3 = z.w * z.w + z.h * z.h;
          var f = function (lab, N, a, b) { return { label: lab, name: lab, kind: 'exact', check: exCheck(N, [[a + b, LID + '-right', 'Pythagoras: square the edges, add, then take the square root.']]), key: rootTex(N), badKey: String(a + b), after: 'cm' }; };
          return fP('Determine the side lengths of that triangle exactly (simplest radical form). Each side is the diagonal of one face.', [f(z.l + ' × ' + z.w + ' face:', N1, z.l, z.w), f(z.l + ' × ' + z.h + ' face:', N2, z.l, z.h), f(z.w + ' × ' + z.h + ' face:', N3, z.w, z.h)],
            { sol: 'Each side is a face diagonal (Pythagoras): ' + t('\\sqrt{' + z.l + '^2+' + z.w + '^2}=' + rootTex(N1)) + ', ' + t('\\sqrt{' + z.l + '^2+' + z.h + '^2}=' + rootTex(N2)) + ', ' + t('\\sqrt{' + z.w + '^2+' + z.h + '^2}=' + rootTex(N3)) + '.', hints: ['A face diagonal is the hypotenuse of a right triangle whose legs are two edges of the box.'], text: 'box: face diagonals' });
        } },
        { id: 'eC1b', level: 'MAS', make: function (r, z) {
          var N1 = z.l * z.l + z.w * z.w, N2 = z.l * z.l + z.h * z.h, N3 = z.w * z.w + z.h * z.h, a = Math.sqrt(N1), b = Math.sqrt(N2), c = Math.sqrt(N3), th = clAng(a, b, c);
          return deg('Determine the largest angle of that triangle, to the nearest degree.', th, 0, { alts: clAngAlts(a, b, c),
            sol: 'The largest angle is opposite the longest side, ' + t(rootTex(N1)) + ': ' + t('\\cos\\theta=\\dfrac{' + N2 + '+' + N3 + '-' + N1 + '}{2\\sqrt{' + N2 + '}\\sqrt{' + N3 + '}}=\\dfrac{' + (N2 + N3 - N1) + '}{2\\sqrt{' + N2 * N3 + '}}\\approx ' + fx((N2 + N3 - N1) / (2 * b * c), 4)) + ', so ' + t('\\theta\\approx ' + Dx(th, 0)), hints: ['The largest angle is opposite the longest face diagonal.', t('(\\sqrt{n})^2=n') + ', so the squares in the cosine law are whole numbers.'], text: 'box: largest angle' });
        } }] },
    { num: 'C2', parts: [
      { id: 'eC2', level: 'MAS', make: function (r) {
        var tr = r.pick(TRI120.slice(0, 6)), sh = r.chance(0.5) ? [tr[1], tr[0], tr[2]] : tr.slice(), num = sh[0] * sh[0] + sh[1] * sh[1] - sh[2] * sh[2], den = 2 * sh[0] * sh[1];
        return fP('Show, without a calculator, that a triangle with sides ' + t(sh[0]) + ', ' + t(sh[1]) + ' and ' + t(sh[2]) + ' has a ' + t('120^\\circ') + ' angle: give the exact cosine of its largest angle, then the angle.', [
          { label: t('\\cos\\theta='), name: t('\\cos\\theta'), kind: 'exact', keys: 'fraction', check: K.fraction([-1, 2], {}), key: '-\\frac{1}{2}', badKey: '\\frac{1}{2}' },
          { label: t('\\theta='), name: t('\\theta'), kind: 'int', x: 120, unit: '°', cands: [[60, LID + '-ref', 'The cosine is negative, so the angle is obtuse: ' + t('180^\\circ-60^\\circ') + '.']] }],
          { sol: 'The largest angle is opposite ' + t(sh[2]) + ': ' + t('\\cos\\theta=\\dfrac{' + sh[0] * sh[0] + '+' + sh[1] * sh[1] + '-' + sh[2] * sh[2] + '}{2(' + sh[0] + ')(' + sh[1] + ')}=\\dfrac{' + num + '}{' + den + '}=-\\dfrac{1}{2}') + '.<br>Reference angle ' + t('60^\\circ') + ', obtuse, so ' + t('\\theta=180^\\circ-60^\\circ=120^\\circ') + '.', hints: ['Use the largest side as the one subtracted.', 'Reduce the fraction.'], text: 'show a 120° angle' });
      } }] }
  ];
  function sasText(r, z, dp, unit, text) {
    var nm = r.pick(SETS), v = nm[r.int(0, 2)], o = others({ nm: nm }, v), T = triSAS(nm, v, z.A, z.b, z.c), x = T.s[v], s = {}, A = {};
    s[o[0]] = L(z.b, dp) + ' ' + unit; s[o[1]] = L(z.c, dp) + ' ' + unit; s[v] = low(v); A[v] = z.A + '°';
    return nP(t('\\angle ' + v + '=' + D(z.A) + ',\\ ' + low(o[0]) + '=' + Lt(z.b, dp) + ',\\ ' + low(o[1]) + '=' + Lt(z.c, dp)) + ' ' + unit + '; find ' + t(low(v)) + '.', x, 1, { unit: unit, alts: clAlts(z.b, z.c, z.A, low(v)),
      sol: triFig(T, { s: s, A: A }, { width: 280, height: 240 }) + t(clSideTex(low(v), z.b, z.c, z.A, dp)) + ' ' + unit, hints: HSAS, text: text });
  }
  function sssText(r, sd, dp, want, text) {
    var nm = r.pick(SETS), T = triSides(nm, sd), v = nm[want], o = others(T, v), x = T.A[v];
    return deg(t(nm.map(function (w, i) { return low(w) + '=' + Lt(sd[i], dp); }).join(',\\ ')) + '; find ' + t('\\angle ' + v) + '.', x, 0, { alts: clAngAlts(sd[want], T.s[o[0]], T.s[o[1]]),
      sol: t(clAngTex(v, sd[want], T.s[o[0]], T.s[o[1]], dp)), hints: HSSS, text: text });
  }

  HW.defineLesson({ id: LID, unit: 3, num: '6', title: 'The Cosine Law', outcome: 'T3', calc: true, questions: QUESTIONS, extra: EXTRA });
})(window);
