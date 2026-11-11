/* Math 20-1 · Unit 3 · Lesson 8 — Choosing the Sine Law or the Cosine Law (outcome T3)
 * Assignment 8 (m201book unit3/u3_l08.tex, Questions 1–18) and the Lesson 8 Extra Practice (u3_ep08.tex: A. Skills 1–4,
 * B. Applying 5–10, C. Stretch 11–12). Every part is a generator (booklet idea, form and difficulty; new numbers; the
 * lesson's example numbers and the booklet's own excluded where feasible). Self-contained: no helpers from the other
 * Unit 3 lesson files.
 * Calculator allowed (degree mode). Rounded answers: the rounding is stated and the value rounded that way is accepted;
 * a later answer also accepts the value reached from the booklet's rounded intermediate (a side to the hundredth, an
 * angle to the tenth or the degree, as the booklet's solutions do).
 * Bearings: a bearing is a number (three digits shown, 035°; 35 is fine); a quadrant direction ("N 35° E") is typed as
 * text (N35E, N 35° E, n35e all fine) and recognises the angle measured from east–west, the wrong quadrant and the
 * bearing itself used as the angle. Two-leg trips: the angle at the turn (recognises the change of heading used), the
 * distance back (cosine law) and the return bearing (recognises the bearing from the start, the wrong side).
 * Conversions: 1, Extra 1 (name the method) -> multiple choice (primary ratios / sine law / cosine law / cannot be
 * solved); 5(a) and 11(a) "explain"/"sketch" -> the angles as numbers (the sketch is in the worked solution);
 * 13 "why two?" -> in the worked solution; 8 and Extra 8 split into sides, then perimeter/area.
 * One keypad is registered for this file when the widgets are loaded: u3l8ang (comma).
 * Levels: LIM BEG EMG PRG ADV MAS. Mastery: 4(b), 8(b), Extra 5(b), Extra 8(b), Extra 11, Extra 12. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, B = K.P, F = HW.fmt, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, TR = HW.trig;
  var LID = 'u3l8';

  var CODES = {
    'u3l8-method': 'Wrong method chosen', 'u3l8-qb-axis': 'Direction angle measured from east–west', 'u3l8-qb-quad': 'Direction in the wrong quadrant', 'u3l8-qb-raw': 'Used the bearing itself as the direction angle',
    'u3l8-bear-turn': 'Turned the wrong way from N or S', 'u3l8-back': 'Back bearing: wrong adjustment', 'u3l8-hour-fixed': 'Hour hand not moved past the hour', 'u3l8-reflex': 'Gave the larger (reflex) angle',
    'u3l8-clock-opp': 'Hands in a straight line: added or subtracted wrongly', 'u3l8-cl-order': 'Cosine law: subtracted before multiplying by cos', 'u3l8-cl-noroot': 'Cosine law: forgot the square root',
    'u3l8-cl-plus': 'Cosine law: added 2bc cos A', 'u3l8-radian': 'Calculator in radian mode', 'u3l8-turn-heading': 'Used the change of heading, not the angle at the turn', 'u3l8-from-port': 'Gave the bearing from the start (not back to it)',
    'u3l8-bear-side': 'Angle added on the wrong side', 'u3l8-angle-only': 'Gave an angle, not a bearing', 'u3l8-sl-flip': 'Sine law ratio upside down', 'u3l8-alt-cos': 'cos instead of sin (or sin for cos) in a right triangle',
    'u3l8-not-height': 'Stopped at the slant distance', 'u3l8-sine-acute': 'Sine law gave the acute angle for an obtuse one', 'u3l8-sine-obt': 'Took an obtuse angle that is impossible', 'u3l8-part-side': 'Used part of a side',
    'u3l8-perim-diag': 'Perimeter included the diagonal', 'u3l8-area-half': 'Area: forgot the ½', 'u3l8-area-one': 'Area of only one triangle', 'u3l8-area-cos': 'Area with cos instead of sin', 'u3l8-inscribed': 'Central and inscribed angles mixed up',
    'u3l8-tangent': 'Tangent length: wrong ratio', 'u3l8-only-acute': 'Gave only the acute angle', 'u3l8-wrong-pair': 'Used the wrong side–angle pair', 'u3l8-third-angle': 'Did not find the third angle first',
    'u3l8-hours': 'Gave hours, not minutes', 'u3l8-closest': 'Closest distance: not the perpendicular', 'u3l8-elev': 'Angle in the triangle from the elevation angles is wrong', 'u3l8-set': 'Wrong angles',
    'u3l8-swap-tri': 'Mixed up the two positions', 'u3l8-dist-time': 'Distance not found from speed × time', 'u3l8-sss-angle': 'Used the wrong angle (not opposite the side)'
  };
  HW.addCodes(Object.keys(CODES).filter(function (k) { return !HW.CODES[k]; }).reduce(function (o, k) { o[k] = CODES[k]; return o; }, {}));
  HW.addPartial({ 'u3l8-method': 'b', 'u3l8-qb-axis': 'b', 'u3l8-qb-quad': 'b', 'u3l8-qb-raw': 'b', 'u3l8-bear-turn': 'b', 'u3l8-back': 'b', 'u3l8-hour-fixed': 's', 'u3l8-reflex': 's', 'u3l8-clock-opp': 'b',
    'u3l8-cl-order': 'b', 'u3l8-cl-noroot': 's', 'u3l8-cl-plus': 'b', 'u3l8-radian': 's', 'u3l8-turn-heading': 'b', 'u3l8-from-port': 's', 'u3l8-bear-side': 'b', 'u3l8-angle-only': 's', 'u3l8-sl-flip': 'b',
    'u3l8-alt-cos': 'b', 'u3l8-not-height': 's', 'u3l8-sine-acute': 's', 'u3l8-sine-obt': 's', 'u3l8-part-side': 'b', 'u3l8-perim-diag': 's', 'u3l8-area-half': 's', 'u3l8-area-one': 'b', 'u3l8-area-cos': 'b',
    'u3l8-inscribed': 'b', 'u3l8-tangent': 'b', 'u3l8-only-acute': 's', 'u3l8-wrong-pair': 'b', 'u3l8-third-angle': 'b', 'u3l8-hours': 's', 'u3l8-closest': 'b', 'u3l8-elev': 'b', 'u3l8-swap-tri': 's', 'u3l8-dist-time': 'b', 'u3l8-sss-angle': 'b' });

  (function addKeys() {
    var W = HW.widgets; if (!W || !W.KEYSETS) return;
    function d(n) { return { label: String(n), tex: String(n), plain: String(n) }; }
    if (!W.KEYSETS.u3l8ang) W.KEYSETS.u3l8ang = [[d(7), d(8), d(9), { label: ',', tex: ',\\ ', plain: ', ', title: 'Next angle' }, { label: '⌫', fn: 'del', title: 'Delete' }], [d(4), d(5), d(6), { label: '.', tex: '.', plain: '.' }, { label: 'clear', fn: 'clear' }],
      [d(1), d(2), d(3), { label: '◀', fn: 'left', title: 'Move left' }, { label: '▶', fn: 'right', title: 'Move right' }], [d(0), { label: 'Check ↵', fn: 'enter', wide: true }]];
    if (W.KEYHELP) W.KEYHELP.u3l8ang = ['Type each angle in degrees, separated by commas (any order), e.g. ' + HW.k('41.8,\\ 138.2') + '.', 'Type the angles separated by commas, e.g. <code>41.8, 138.2</code>.'];
  })();

  /* ======================= helpers ======================= */
  function cl(x) { return Math.round(x * 1e9) / 1e9; }
  function nT(x) { x = cl(x); if (Math.abs(x) < 1e-12) x = 0; return F(x); }
  function rd(x, dp) { return K.roundTo(x, dp); }
  function fx(x, dp) { return F(rd(x, dp).toFixed(Math.max(dp, 0))); }
  function fs(x, dp) { return rd(x, dp).toFixed(Math.max(dp, 0)); }
  function pickWhere(gen, okf) { for (var i = 0; i < 8000; i++) { var o = gen(); if (okf(o)) return o; } throw new Error(LID + ': no valid numbers'); }
  function D(x) { return nT(x) + '^\\circ'; }
  function Dx(x, dp) { return fx(x, dp) + '^\\circ'; }
  function sn(d) { return TR.sin(d); } function cs(d) { return TR.cos(d); } function tn(d) { return TR.tan(d); } function asn(v) { return TR.asin(v); } function acs(v) { return TR.acos(v); }
  function low(n) { return n.toLowerCase(); }
  function fig(svg) { return '<div class="fig" style="text-align:center;margin:6px 0">' + svg + '</div>'; }
  function uniqBy(arr, key) { var s = {}; return arr.filter(function (x) { var k = key(x); if (s[k]) return false; s[k] = 1; return true; }); }
  function safeR(x, dp) { var f = x * Math.pow(10, dp); return Math.abs(f - Math.floor(f) - 0.5) > 0.08; }
  function md(x) { return ((x % 360) + 360) % 360; }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  var NAMES = [['A', 'B', 'C'], ['D', 'E', 'F'], ['P', 'Q', 'R'], ['K', 'L', 'M'], ['S', 'T', 'U'], ['X', 'Y', 'Z'], ['G', 'H', 'J']];

  /* ---- triangle solvers ---- */
  function clSide(b, c, A) { return Math.sqrt(b * b + c * c - 2 * b * c * cs(A)); }
  function clAng(a, b, c) { return acs((b * b + c * c - a * a) / (2 * b * c)); } // angle opposite a
  function clAlts(b, c, A, nm) {
    var o = (b * b + c * c - 2 * b * c) * cs(A);
    return [{ v: o > 0 ? Math.sqrt(o) : NaN, code: LID + '-cl-order', hint: 'Order of operations: work out ' + t('2(' + nT(b) + ')(' + nT(c) + ')\\cos ' + D(A)) + ' first, then subtract it from ' + t(nT(b) + '^2+' + nT(c) + '^2') + '.' },
      { v: b * b + c * c - 2 * b * c * cs(A), code: LID + '-cl-noroot', hint: 'That is ' + t((nm || 'a') + '^2') + '. Take the square root.' },
      { v: Math.sqrt(b * b + c * c + 2 * b * c * cs(A)), code: LID + '-cl-plus', hint: 'The cosine law <b>subtracts</b> ' + t('2bc\\cos A') + '.' },
      { v: Math.sqrt(Math.max(0, b * b + c * c - 2 * b * c * Math.cos(A))), code: LID + '-radian', hint: 'Your calculator is in <b>radian</b> mode. Switch to degree mode.' }];
  }
  function clTex(nm, b, c, A, v) { return nm + '^2=' + nT(b) + '^2+' + nT(c) + '^2-2(' + nT(b) + ')(' + nT(c) + ')\\cos ' + D(A) + '\\approx ' + fx(v * v, 2) + ',\\ ' + nm + '\\approx ' + fx(v, 1); }
  function ssa(A, a, b) { // given angle A, opposite side a, other side b (from the vertex of A)
    var h = b * sn(A), s = h / a, o = { A: A, a: a, b: b, h: h, s: s, sols: [] };
    if (s > 1 + 1e-12) { o.n = 0; return o; }
    if (s > 1 || Math.abs(s - 1) < 1e-9) s = 1;
    var B1 = asn(s), B2 = 180 - B1; o.B1 = B1; o.B2 = B2;
    [B1, B2].forEach(function (Bv, i) { if (i === 1 && Math.abs(B2 - B1) < 1e-9) return; if (A + Bv < 180 - 1e-9) { var C = 180 - A - Bv; o.sols.push({ B: Bv, C: C, c: a * sn(C) / sn(A) }); } });
    o.n = o.sols.length; return o;
  }

  /* ---- part builders ---- */
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
  function intP(prompt, x, o) {
    o = o || {};
    var cands = (o.cands || []).filter(function (c) { return c && isFinite(c[0]) && Math.abs(c[0] - x) > 1e-9; });
    var p = B.number(prompt, x, cdiag(cands), o.sol, o.hints || [], o.text, { after: o.unit, nr: o.nr });
    p.answer = o.ansTex ? t(o.ansTex) : t(nT(x) + (o.unit === '°' ? '^\\circ' : o.unit ? '\\text{ ' + o.unit + '}' : ''));
    p.bad = uniqBy(cands.map(function (c) { return String(c[0]); }), function (s) { return s; });
    if (o.v) p._v = o.v;
    return p;
  }
  /* several boxes. spec: { label, name, kind: 'near' | 'int' | 'text', x, dp, alts, acc, cands, unit, after, before, check, key, ans } */
  function fP(prompt, specs, o) {
    o = o || {};
    var fields = [], checks = [], keys = [], ans = [], bad = [];
    specs.forEach(function (s) {
      var aft = s.after != null ? s.after : s.unit;
      fields.push({ label: s.label, name: s.name || s.label, after: aft, before: s.before, mode: s.kind === 'text' ? 'text' : undefined, wide: s.kind === 'text', placeholder: s.placeholder });
      if (s.kind === 'text') { checks.push(s.check); keys.push(s.key); ans.push((s.label ? s.label + ' ' : '') + s.ans); bad.push('X'); }
      else if (s.kind === 'int') { var cs0 = (s.cands || []).filter(function (c) { return c && isFinite(c[0]) && Math.abs(c[0] - s.x) > 1e-9; }); checks.push(K.number(s.x, cdiag(cs0))); keys.push(String(s.x)); ans.push((s.label ? s.label + ' ' : '') + t(nT(s.x) + (s.unit === '°' ? '^\\circ' : s.unit ? '\\text{ ' + s.unit + '}' : ''))); bad.push(String(s.x + 1)); }
      else { var q = nP('', s.x, s.dp, s); checks.push(q.check); keys.push(q.key); ans.push((s.label ? s.label + ' ' : '') + q.answer); bad.push(String(Number(q.key) + 1)); }
    });
    var p = B.fields(prompt, fields, checks, keys, ans.join('<br>'), o.sol, o.hints || [], o.text);
    if (o.swap) {
      var c0 = p.check;
      p.check = function (resp) { var r0 = c0(resp); if (r0.v === 'correct' || !resp || resp.length < 2) return r0; var sw = resp.slice(); var tmp = sw[0]; sw[0] = sw[1]; sw[1] = tmp; if (checks[0](sw[0]).v === 'correct' && checks[1](sw[1]).v === 'correct') return wrong('swap-answer', o.swapHint || 'Right numbers, but in each other’s boxes.'); return r0; };
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

  /* ---- a list of angles (any order) ---- */
  function readAng(resp) {
    var s = String(resp == null ? '' : resp);
    s = s.replace(/\\left|\\right/g, '').replace(/\\(?:text|mathrm|operatorname|textrm)\{([^{}]*)\}/g, ' $1 ').replace(/\{,\}/g, ',').replace(/\^\{?\s*\\circ\s*\}?|\\circ|\\degree|°/g, ' ')
      .replace(/\\theta|θ|\\angle|∠/g, ' ').replace(/\\[,;:! ]|~|\\quad|\\qquad/g, ' ').replace(/[=≈]|\\approx/g, ' ').replace(/−/g, '-');
    var plain = s.replace(/[{}]/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
    if (!plain) return { empty: true };
    var bits = plain.replace(/\band\b|\bor\b|;/g, ',').split(/[,\s]+/).filter(Boolean), vals = [], strs = [];
    for (var i = 0; i < bits.length; i++) { var p = HW.parse.number(bits[i]); if (!p.ok) return { bad: bits[i] }; vals.push(p.value); strs.push(bits[i]); }
    return { vals: vals, strs: strs };
  }
  function angListP(prompt, vals, dp, o) {
    o = o || {};
    var tol = Math.pow(10, -dp) * 0.6;
    function m(v, x) { return Math.abs(v - rd(x, dp)) < 1e-9 || Math.abs(v - x) <= tol; }
    var check = function (resp) {
      var R = readAng(resp);
      if (R.empty) return form('empty', 'Type your answer first.');
      if (R.bad) return form('unreadable', 'Type the angles as numbers separated by commas, e.g. ' + t('41.8,\\ 138.2') + '.');
      var got = R.vals, used = {}, idx = got.map(function (v) { for (var k = 0; k < vals.length; k++) if (!used[k] && m(v, vals[k])) { used[k] = 1; return k; } return -1; }), nOk = idx.filter(function (k) { return k >= 0; }).length;
      if (nOk === vals.length && got.length === vals.length) { if (R.strs.some(function (s) { return (s.split('.')[1] || '').length > dp; })) return form('round', 'Right angles — now round each to the nearest ' + (dp === 1 ? 'tenth of a degree' : 'degree') + '.'); return ok(); }
      if (got.length === 1 && nOk === 1 && vals.length === 2) return wrong(LID + '-only-acute', o.onlyHint);
      for (var i = 0; i < got.length; i++) if (idx[i] < 0) for (var j = 0; j < (o.xc || []).length; j++) if (isFinite(o.xc[j][0]) && m(got[i], o.xc[j][0])) return wrong(o.xc[j][1], o.xc[j][2]);
      return wrong(LID + '-set', nOk ? 'One of your angles is right. Check the other.' : null);
    };
    var key = vals.map(function (v) { return fs(v, dp); }).join(', ');
    return { prompt: prompt, input: { type: 'math', keys: 'u3l8ang', before: t((o.name || '\\theta') + '='), placeholder: 'e.g. 41.8, 138.2' }, check: check, key: key, answer: t((o.name || '\\theta') + '\\approx ' + vals.map(function (v) { return Dx(v, dp); }).join('\\text{ or }')),
      solution: o.sol, hints: o.hints || [], text: o.text, bad: [fs(vals[0], dp)].concat((o.xc || []).map(function (c) { return fs(c[0], dp); })), _v: o.v };
  }

  /* ---- bearings ---- */
  function bearTex(b) { b = md(Math.round(b)); return (b < 10 ? '00' : b < 100 ? '0' : '') + b + '^\\circ'; }
  function quadDir(b) { b = md(b); return b <= 90 ? { ns: 'N', k: b, ew: 'E' } : b <= 180 ? { ns: 'S', k: 180 - b, ew: 'E' } : b <= 270 ? { ns: 'S', k: b - 180, ew: 'W' } : { ns: 'N', k: 360 - b, ew: 'W' }; }
  function dirBear(d) { return d.ns === 'N' ? (d.ew === 'E' ? d.k : 360 - d.k) : (d.ew === 'E' ? 180 - d.k : 180 + d.k); }
  function dirTex(d) { return '\\text{' + d.ns + '}\\,' + nT(d.k) + '^\\circ\\,\\text{' + d.ew + '}'; }
  function readDir(s) {
    s = String(s == null ? '' : s).replace(/\\(?:text|mathrm)\{([^{}]*)\}/g, '$1').replace(/\^\{?\\circ\}?|\\circ|\\degree|°|º/g, ' ').replace(/\bdeg(rees)?\b/gi, ' ').replace(/\\[,;: ]|~/g, ' ').toUpperCase().replace(/[\s.]+$/g, '').replace(/\s+/g, '');
    if (!s) return { empty: true };
    s = s.replace(/^NORTH/, 'N').replace(/^SOUTH/, 'S').replace(/EAST$/, 'E').replace(/WEST$/, 'W');
    var m = /^([NS])(\d+(?:\.\d+)?)([EW])$/.exec(s); if (m) return { ns: m[1], k: Number(m[2]), ew: m[3] };
    var m2 = /^([EW])(\d+(?:\.\d+)?)([NS])$/.exec(s); if (m2) return { rev: true, ns: m2[3], k: Number(m2[2]), ew: m2[1] };
    if (/^\d+(\.\d+)?$/.test(s)) return { num: Number(s) };
    return { bad: true };
  }
  function dirChk(b) {
    var w = quadDir(b);
    return function (resp) {
      var d = readDir(resp);
      if (d.empty) return form('empty', 'Type the direction, e.g. N 40° E.');
      if (d.bad) return form('dir-form', 'Write it like <b>N 40° E</b>: N or S, then the angle, then E or W.');
      if (d.num != null) return form('dir-form', 'Write the direction with letters, e.g. <b>S 20° E</b>: N or S, the angle from that line, then E or W.');
      if (d.rev) return form('dir-form', 'Start from north or south: write N or S first, e.g. <b>' + w.ns + ' ' + nT(w.k) + '° ' + w.ew + '</b> style.');
      if (d.ns === w.ns && d.ew === w.ew && Math.abs(d.k - w.k) < 1e-9) return ok();
      var quadTxt = 'A bearing of ' + t(bearTex(b)) + ' is between ' + t(bearTex(w.ns === 'N' ? (w.ew === 'E' ? 0 : 270) : (w.ew === 'E' ? 90 : 180))) + ' and ' + t(w.ns === 'N' && w.ew === 'W' ? '360^\\circ' : bearTex(w.ns === 'N' ? 90 : (w.ew === 'E' ? 180 : 270))) + ': that is ' + (w.ns === 'N' ? 'north' : 'south') + '-' + (w.ew === 'E' ? 'east' : 'west') + '.';
      if (d.ns === w.ns && d.ew === w.ew && Math.abs(d.k - (90 - w.k)) < 1e-9) return wrong(LID + '-qb-axis', 'Measure the angle from the <b>north–south</b> line (the letter you write first), not from east–west.');
      if (Math.abs(d.k - md(b)) < 1e-9 && md(b) > 90) return wrong(LID + '-qb-raw', 'The angle in this form is measured from N or S, so it is at most ' + t('90^\\circ') + '. ' + quadTxt);
      if (Math.abs(d.k - w.k) < 1e-9 || Math.abs(d.k - (90 - w.k)) < 1e-9) return wrong(LID + '-qb-quad', quadTxt);
      return wrong('value', null);
    };
  }
  function dirP(prompt, b, o) {
    o = o || {}; var w = quadDir(b);
    return fP(prompt, [{ label: o.label || '', name: 'Direction', kind: 'text', check: dirChk(b), key: w.ns + ' ' + nT(w.k) + '° ' + w.ew, ans: t(dirTex(w)), placeholder: 'e.g. N 40° E' }],
      { sol: o.sol || dirSol(b), hints: ['Face ' + (w.ns === 'N' ? 'north' : 'south') + ' (the nearer of north and south), then turn toward ' + (w.ew === 'E' ? 'east' : 'west') + '. The angle you turn is the middle number.', 'From south: angle ' + t('=|\\text{bearing}-180^\\circ|') + '. From north going west: ' + t('360^\\circ-\\text{bearing}') + '.'], text: o.text, v: { k: 'dir', b: b }, bad: [[w.ns + ' ' + nT(90 - w.k) + ' ' + w.ew]] });
  }
  function dirSol(b) { var w = quadDir(b); return t(bearTex(b)) + ' is ' + (w.ns === 'N' ? 'north' : 'south') + '-' + (w.ew === 'E' ? 'east' : 'west') + ': ' + (w.ns === 'N' ? (w.ew === 'E' ? 'the angle from north is ' + t(D(w.k)) : t('360^\\circ-' + bearTex(b) + '=' + D(w.k))) : (w.ew === 'E' ? t('180^\\circ-' + bearTex(b) + '=' + D(w.k)) : t(bearTex(b) + '-180^\\circ=' + D(w.k)))) + ', so ' + t(dirTex(w)) + '.'; }
  function bearNumP(prompt, d, o) {
    o = o || {}; var b = dirBear(d), k = d.k, cands = [];
    if (d.ns === 'S' && d.ew === 'E') cands = [[180 + k, LID + '-bear-turn', 'From south, turning toward <b>east</b> goes back toward ' + t('090^\\circ') + ': subtract, ' + t('180^\\circ-' + D(k)) + '.'], [90 + k, LID + '-qb-axis', 'Start from south (' + t('180^\\circ') + '), not from east.'], [k, LID + '-qb-quad', 'The direction starts with <b>S</b>: start from south, ' + t('180^\\circ') + '.']];
    else if (d.ns === 'S') cands = [[180 - k, LID + '-bear-turn', 'From south, turning toward <b>west</b> keeps going clockwise: add, ' + t('180^\\circ+' + D(k)) + '.'], [270 - k, LID + '-qb-axis', 'Start from south (' + t('180^\\circ') + '), not from west.'], [k, LID + '-qb-quad', 'The direction starts with <b>S</b>: start from south, ' + t('180^\\circ') + '.']];
    else if (d.ew === 'W') cands = [[k, LID + '-qb-quad', 'Bearings go clockwise from north. Turning ' + t(D(k)) + ' toward <b>west</b> is counterclockwise: ' + t('360^\\circ-' + D(k)) + '.'], [270 + k, LID + '-qb-axis', 'Start from north (' + t('360^\\circ') + '), not from west.'], [180 + k, LID + '-bear-turn', 'The direction starts with <b>N</b>: start from north.']];
    else cands = [[360 - k, LID + '-bear-turn', 'Turning toward <b>east</b> from north is clockwise: the bearing is just ' + t(D(k)) + ' (written ' + t(bearTex(k)) + ').'], [90 - k, LID + '-qb-axis', 'Measure from north, not from east.'], [180 - k, LID + '-qb-quad', 'The direction starts with <b>N</b>: start from north.']];
    return intP(prompt, b, { unit: '°', ansTex: bearTex(b), cands: cands, sol: t(dirTex(d)) + ': ' + (d.ns === 'N' ? (d.ew === 'E' ? 'turn ' + t(D(k)) + ' clockwise from north: ' + t(bearTex(b)) : t('360^\\circ-' + D(k) + '=' + bearTex(b))) : (d.ew === 'E' ? t('180^\\circ-' + D(k) + '=' + bearTex(b)) : t('180^\\circ+' + D(k) + '=' + bearTex(b)))) + '.',
      hints: ['Bearings go clockwise from north: east ' + t('090^\\circ') + ', south ' + t('180^\\circ') + ', west ' + t('270^\\circ') + '.', 'South-based: ' + t('180^\\circ\\pm') + ' the angle; north-based west: ' + t('360^\\circ-') + ' the angle.'], text: o.text, v: { k: 'bear', d: d } });
  }
  function backP(prompt, b, o) {
    o = o || {}; var w = md(b + 180);
    return intP(prompt, w, { unit: '°', ansTex: bearTex(w), cands: [[b, LID + '-back', 'That is the bearing of the second town from the first. Turn around: ' + t('\\pm 180^\\circ') + '.'], [md(360 - b), LID + '-back', 'The back bearing differs by ' + t('180^\\circ') + ', not ' + t('360^\\circ') + '.'], [md(180 - b), LID + '-back', 'Add or subtract ' + t('180^\\circ') + ' (keep the result between ' + t('000^\\circ') + ' and ' + t('360^\\circ') + ').'], [b + 180 > 360 ? b + 180 : NaN, LID + '-back', 'Subtract ' + t('180^\\circ') + ' instead: a bearing is less than ' + t('360^\\circ') + '.']],
      sol: 'The back bearing differs by ' + t('180^\\circ') + ': ' + t(bearTex(b) + (b >= 180 ? '-' : '+') + '180^\\circ=' + bearTex(w)) + '.', hints: ['North lines are parallel: the bearing back is the bearing there ' + t('\\pm 180^\\circ') + '.'], text: o.text || 'back bearing', v: { k: 'back', b: b } });
  }

  /* ---- clocks: hour hand at 30H + M/2 degrees from 12, minute hand at 6M ---- */
  function handAng(H, M) { var a = Math.abs(md(30 * (H % 12) + M / 2) - 6 * M); return a > 180 ? 360 - a : a; }
  function clockFig(H, M, mL, hL) {
    var S = 160, c = 80, R = 66, s = '<circle cx="' + c + '" cy="' + c + '" r="' + R + '" fill="#fbfaf6" stroke="#2b3340" stroke-width="2"/>';
    for (var i = 0; i < 12; i++) { var a = i * 30 * Math.PI / 180, r1 = R - (i % 3 ? 5 : 9); s += '<line x1="' + (c + R * Math.sin(a)).toFixed(1) + '" y1="' + (c - R * Math.cos(a)).toFixed(1) + '" x2="' + (c + r1 * Math.sin(a)).toFixed(1) + '" y2="' + (c - r1 * Math.cos(a)).toFixed(1) + '" stroke="#2b3340" stroke-width="' + (i % 3 ? 1.2 : 2) + '"/>'; }
    [[12, 0], [3, 90], [6, 180], [9, 270]].forEach(function (q) { var a = q[1] * Math.PI / 180; s += '<text x="' + (c + (R - 18) * Math.sin(a)).toFixed(1) + '" y="' + (c - (R - 18) * Math.cos(a)).toFixed(1) + '" font-size="12" text-anchor="middle" dominant-baseline="central" fill="#6a7182">' + q[0] + '</text>'; });
    var ha = (30 * (H % 12) + M / 2) * Math.PI / 180, ma = 6 * M * Math.PI / 180, hl = R * 0.52, ml = R * 0.84;
    s += '<line x1="' + c + '" y1="' + c + '" x2="' + (c + ml * Math.sin(ma)).toFixed(1) + '" y2="' + (c - ml * Math.cos(ma)).toFixed(1) + '" stroke="#2b55a0" stroke-width="2.6" stroke-linecap="round"/>';
    s += '<line x1="' + c + '" y1="' + c + '" x2="' + (c + hl * Math.sin(ha)).toFixed(1) + '" y2="' + (c - hl * Math.cos(ha)).toFixed(1) + '" stroke="#2b3340" stroke-width="4" stroke-linecap="round"/>';
    s += '<line x1="' + (c + ml * Math.sin(ma)).toFixed(1) + '" y1="' + (c - ml * Math.cos(ma)).toFixed(1) + '" x2="' + (c + hl * Math.sin(ha)).toFixed(1) + '" y2="' + (c - hl * Math.cos(ha)).toFixed(1) + '" stroke="#b03a2e" stroke-width="1.6" stroke-dasharray="5 4"/>';
    s += '<circle cx="' + c + '" cy="' + c + '" r="3" fill="#2b3340"/>';
    var lab = '<text x="' + c + '" y="' + (S - 2) + '" font-size="12" text-anchor="middle" fill="#2b3340">' + H + ':' + (M < 10 ? '0' : '') + M + ' (minute hand ' + esc(String(mL)) + ', hour hand ' + esc(String(hL)) + ')</text>';
    return fig('<svg class="fig-svg" viewBox="0 0 ' + (S + 60) + ' ' + (S + 6) + '" width="100%" style="max-width:' + (S + 60) + 'px" role="img" aria-label="clock face"><g transform="translate(30,0)">' + s + '</g>' + lab.replace('x="' + c + '"', 'x="' + (c + 30) + '"') + '</svg>');
  }
  function clockSolAng(H, M) {
    var hp = 30 * (H % 12) + M / 2, mp = 6 * M, a = handAng(H, M);
    if (M === 0) { var k = Math.min(H % 12, 12 - H % 12); return 'At ' + H + ':00 the hands are ' + k + ' mark' + (k === 1 ? '' : 's') + ' apart: ' + t(k + '\\times 30^\\circ=' + D(a)) + '.'; }
    return 'Hour hand: ' + t(H + '\\times 30^\\circ+' + M + '(0.5^\\circ)=' + D(hp)) + ' from 12. Minute hand: ' + t(M + '\\times 6^\\circ=' + D(mp)) + '. Angle ' + t('=' + (Math.abs(hp - mp) > 180 ? '360^\\circ-' : '') + '|' + D(hp) + '-' + D(mp) + '|=' + D(a)) + '.';
  }

  /* ---- figures ---- */
  /* a path of legs [{d, b (bearing)}] from a start, with north lines; names = labels of the points */
  function bearFig(legs, names, labs, o) {
    o = o || {};
    var pts = { O: [0, 0] }, x = 0, y = 0, ids = ['O'], extra = [], tot = legs.reduce(function (s, l) { return s + l.d; }, 0), L = tot * 0.2;
    legs.forEach(function (l, i) { x += l.d * sn(l.b); y += l.d * cs(l.b); pts['P' + i] = [x, y]; ids.push('P' + i); });
    var segs = [];
    for (var i = 0; i + 1 < ids.length; i++) segs.push([ids[i], ids[i + 1], labs[i]]);
    if (o.close !== false) segs.push([ids[ids.length - 1], 'O', labs[legs.length] || '', { dash: true }]);
    ids.slice(0, o.northAll ? ids.length : ids.length - 1).forEach(function (id) { var p = pts[id]; extra.push({ type: 'dash', from: p, to: [p[0], p[1] + L] }); extra.push({ type: 'text', at: [p[0], p[1] + L * 1.2], text: 'N', size: 12 }); });
    var nmap = {}; ids.forEach(function (id, k) { nmap[id] = names[k]; });
    return fig(HW.fig({ pts: pts, segs: segs, names: nmap, extra: extra, width: o.width || 290, height: o.height || 260, aria: 'bearing diagram' }));
  }
  /* points with north lines at some of them (map sketch) */
  function mapFig(pts, segs, norths, o) {
    o = o || {};
    var xs = [], ys = []; Object.keys(pts).forEach(function (k) { xs.push(pts[k][0]); ys.push(pts[k][1]); });
    var span = Math.max(Math.max.apply(null, xs) - Math.min.apply(null, xs), Math.max.apply(null, ys) - Math.min.apply(null, ys)), L = span * 0.22, extra = (o.extra || []).slice();
    norths.forEach(function (k) { var p = pts[k]; extra.push({ type: 'dash', from: p, to: [p[0], p[1] + L] }); extra.push({ type: 'text', at: [p[0], p[1] + L * 1.2], text: 'N', size: 12 }); });
    return fig(HW.fig({ pts: pts, segs: segs, names: o.names, angles: o.angles, extra: extra, width: o.width || 250, height: o.height || 240, aria: o.aria || 'map sketch' }));
  }
  /* a circle with centre O (0, 0) and radius R; pts {name: [x, y]}; segs [[a, b, {dash, label}]] */
  function circFig(R, pts, segs, o) {
    o = o || {};
    var xs = [-R, R], ys = [-R, R]; Object.keys(pts).forEach(function (k) { xs.push(pts[k][0]); ys.push(pts[k][1]); });
    var W = o.width || 230, pad = 26, x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs), y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys), sc = (W - 2 * pad) / (x1 - x0);
    if ((y1 - y0) * sc > (o.height || 260) - 2 * pad) sc = ((o.height || 260) - 2 * pad) / (y1 - y0);
    var Wd = (x1 - x0) * sc + 2 * pad, Ht = (y1 - y0) * sc + 2 * pad, X = function (x) { return pad + (x - x0) * sc; }, Y = function (y) { return pad + (y1 - y) * sc; };
    var s = '<circle cx="' + X(0).toFixed(1) + '" cy="' + Y(0).toFixed(1) + '" r="' + (R * sc).toFixed(1) + '" fill="none" stroke="#2b3340" stroke-width="1.8"/>';
    segs.forEach(function (g) { var a = pts[g[0]], b = pts[g[1]], op = g[2] || {}; s += '<line x1="' + X(a[0]).toFixed(1) + '" y1="' + Y(a[1]).toFixed(1) + '" x2="' + X(b[0]).toFixed(1) + '" y2="' + Y(b[1]).toFixed(1) + '" stroke="' + (op.color || '#2b3340') + '" stroke-width="' + (op.w || 2) + '"' + (op.dash ? ' stroke-dasharray="5 4"' : '') + ' stroke-linecap="round"/>';
      if (op.label) { var mx = (X(a[0]) + X(b[0])) / 2, my = (Y(a[1]) + Y(b[1])) / 2, nx = -(Y(b[1]) - Y(a[1])), ny = X(b[0]) - X(a[0]), L = Math.hypot(nx, ny) || 1; nx /= L; ny /= L; if ((mx - X(0)) * nx + (my - Y(0)) * ny < 0 && !op.inside) { nx = -nx; ny = -ny; } s += txt(mx + nx * 11, my + ny * 11, op.label, nx > 0.35 ? 'start' : nx < -0.35 ? 'end' : 'middle'); } });
    Object.keys(pts).forEach(function (k) { var p = pts[k], px = X(p[0]), py = Y(p[1]); if (k === 'O' || (o.dots || []).indexOf(k) >= 0) s += '<circle cx="' + px.toFixed(1) + '" cy="' + py.toFixed(1) + '" r="3" fill="#2b3340"/>';
      var dx = px - X(0), dy = py - Y(0), L = Math.hypot(dx, dy); if (L < 1) { dx = 0.7; dy = -0.7; L = 1; } var nm = (o.names && o.names[k] != null) ? o.names[k] : k; if (nm) s += txt(px + dx / L * 13, py + dy / L * 13, nm, 'middle', 600); });
    return fig('<svg class="fig-svg" viewBox="0 0 ' + Wd.toFixed(0) + ' ' + Ht.toFixed(0) + '" width="100%" style="max-width:' + Wd.toFixed(0) + 'px" role="img" aria-label="' + esc(o.aria || 'circle figure') + '">' + s + '</svg>');
  }
  function txt(x, y, s, anchor, weight) { var it = /^[A-Za-z]$/.test(String(s)) ? ' font-style="italic"' : ''; return '<text x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" font-size="13" text-anchor="' + (anchor || 'middle') + '" dominant-baseline="central" fill="#2b3340"' + it + (weight ? ' font-weight="' + weight + '"' : '') + ' paint-order="stroke" stroke="#fff" stroke-width="3" stroke-linejoin="round">' + esc(s) + '</text>'; }

  /* ---- two legs from P: P → Q (d1 on bearing b1) → R (d2 on bearing b2) ---- */
  function legs2(d1, b1, d2, b2) {
    var Q = [d1 * sn(b1), d1 * cs(b1)], R = [Q[0] + d2 * sn(b2), Q[1] + d2 * cs(b2)], T = Math.abs(md(b1 + 180) - md(b2)); if (T > 180) T = 360 - T;
    var dist = Math.hypot(R[0], R[1]), brR = md(Math.atan2(R[0], R[1]) * 180 / Math.PI), Pang = clAng(d2, d1, dist), cross = Q[0] * R[1] - Q[1] * R[0], sg = cross < 0 ? 1 : -1; // sg = +1: R clockwise from Q (seen from P)
    return { Q: Q, R: R, T: T, dist: dist, brR: brR, ret: md(brR + 180), P: Pang, sg: sg };
  }
  function legsGen(r, o) {
    return pickWhere(function () { var b1 = r.int(0, 359), T = r.int(o.T[0], o.T[1]), sg = r.chance(0.5) ? 1 : -1, b2 = md(b1 + 180 + sg * T); return { b1: b1, b2: b2, d1: o.d1(), d2: o.d2() }; }, function (z) {
      var L = legs2(z.d1, z.b1, z.d2, z.b2), Pr = asn(Math.min(1, z.d2 * sn(L.T) / rd(L.dist, 2))); return rd(md(z.b1 + L.sg * Pr + 180), 0) === rd(L.ret, 0) && z.b1 % 90 && z.b2 % 90 && L.P < 85 && z.d2 * z.d2 < z.d1 * z.d1 + L.dist * L.dist && safeR(L.dist, o.dp || 0) && safeR(L.ret, 0) && safeR(L.P, 0) && !(o.avoid || []).some(function (a) { return a[0] === z.d1 && a[1] === z.b1 && a[2] === z.d2 && a[3] === z.b2; });
    });
  }
  function legsDistP(prompt, z, unit, dp, o) {
    o = o || {}; var L = legs2(z.d1, z.b1, z.d2, z.b2), heading = Math.abs(z.b2 - z.b1) > 180 ? 360 - Math.abs(z.b2 - z.b1) : Math.abs(z.b2 - z.b1);
    return nP(prompt, L.dist, dp, { unit: unit, alts: clAlts(z.d1, z.d2, L.T, 'PR').concat([{ v: clSide(z.d1, z.d2, heading), code: LID + '-turn-heading', hint: 'That uses the change of heading (' + t(D(heading)) + '). The angle <b>inside</b> the triangle at the turn is between the way back (' + t(bearTex(z.b1) + (z.b1 >= 180 ? '-' : '+') + '180^\\circ') + ') and the new course.' }]),
      sol: legsSol1(z, L, unit, dp) + bearFig([{ d: z.d1, b: z.b1 }, { d: z.d2, b: z.b2 }], o.names || ['P', 'Q', 'R'], [nT(z.d1) + ' ' + unit, nT(z.d2) + ' ' + unit, '?']),
      hints: ['Draw north lines at both points. At the turn, the bearing back to the start is the first bearing ' + t('\\pm 180^\\circ') + '.', 'The angle at the turn is between that back bearing and the new course. Then SAS: cosine law.'], text: o.text, v: { k: 'legs', d1: z.d1, b1: z.b1, d2: z.d2, b2: z.b2, want: 'dist', dp: dp } });
  }
  function legsSol1(z, L, unit, dp) {
    var nm = ['P', 'Q', 'R'], back = md(z.b1 + 180);
    return 'At ' + t(nm[1]) + ': the bearing back to ' + t(nm[0]) + ' is ' + t(bearTex(z.b1) + (z.b1 >= 180 ? '-' : '+') + '180^\\circ=' + bearTex(back)) + '; the course leaves on ' + t(bearTex(z.b2)) + '. ' + t('\\angle PQR=' + D(L.T)) + '.<br>SAS: ' + t('PR^2=' + nT(z.d1) + '^2+' + nT(z.d2) + '^2-2(' + nT(z.d1) + ')(' + nT(z.d2) + ')\\cos ' + D(L.T) + '\\approx ' + fx(L.dist * L.dist, 1) + ',\\ PR\\approx ' + fx(L.dist, dp)) + ' ' + unit + '<br>';
  }
  function legsRetP(prompt, z, unit, o) {
    o = o || {}; var L = legs2(z.d1, z.b1, z.d2, z.b2), PRr = rd(L.dist, 2), Pr = asn(Math.min(1, z.d2 * sn(L.T) / PRr));
    var accs = [md(z.b1 + L.sg * Pr + 180), md(z.b1 + L.sg * rd(L.P, 1) + 180), md(z.b1 + L.sg * rd(L.P, 0) + 180)];
    return nP(prompt, L.ret, 0, { unit: '°', acc: accs, alts: [{ v: L.brR, code: LID + '-from-port', hint: 'That is the bearing of ' + t('R') + ' <b>from</b> ' + t('P') + '. To go back, turn around: ' + t('\\pm 180^\\circ') + '.' }, { v: md(z.b1 - L.sg * L.P + 180), code: LID + '-bear-side', hint: 'Check the sketch: is ' + t('R') + ' clockwise or counterclockwise from the first course, seen from ' + t('P') + '? Add or subtract ' + t('\\angle QPR') + ' accordingly.' }, { v: md(z.b1 - L.sg * L.P), code: LID + '-bear-side', hint: 'Use the sketch to decide which side of the first course ' + t('R') + ' is on, then reverse the bearing.' }, { v: L.P, code: LID + '-angle-only', hint: 'That is ' + t('\\angle QPR') + '. Turn it into the bearing of ' + t('R') + ' from ' + t('P') + ', then reverse it.' }],
      sol: legsSol1(z, L, unit, 2) + 'Now a full pair is known: ' + t('\\sin\\angle QPR=\\dfrac{' + nT(z.d2) + '\\sin ' + D(L.T) + '}{' + fx(L.dist, 2) + '}\\approx ' + fx(z.d2 * sn(L.T) / L.dist, 4) + ',\\ \\angle QPR\\approx ' + Dx(L.P, 1)) + ' (acute: ' + t('QR') + ' is not the longest side).<br>Bearing of ' + t('R') + ' from ' + t('P') + ': ' + t(bearTex(z.b1) + (L.sg > 0 ? '+' : '-') + Dx(L.P, 1) + (z.b1 + L.sg * L.P < 0 ? '+360^\\circ' : z.b1 + L.sg * L.P >= 360 ? '-360^\\circ' : '') + '\\approx ' + bearTex(rd(L.brR, 0))) + '. Return bearing: ' + t(bearTex(rd(L.brR, 0)) + (L.brR >= 180 ? '-' : '+') + '180^\\circ\\approx ' + bearTex(rd(L.ret, 0))) + '.' + bearFig([{ d: z.d1, b: z.b1 }, { d: z.d2, b: z.b2 }], ['P', 'Q', 'R'], [nT(z.d1) + ' ' + unit, nT(z.d2) + ' ' + unit, fx(L.dist, 1) + ' ' + unit], { northAll: true }),
      hints: ['Find ' + t('\\angle QPR') + ' with the sine law (now a full pair is known).', 'Bearing of ' + t('R') + ' from ' + t('P') + ' = first bearing ' + t('\\pm\\angle QPR') + ' (use the sketch). The way back is that ' + t('\\pm 180^\\circ') + '.'], text: o.text, v: { k: 'legs', d1: z.d1, b1: z.b1, d2: z.d2, b2: z.b2, want: 'ret' } });
  }

  /* ---- "name the method" ---- */
  var METH = ['primary trigonometric ratios', 'the sine law', 'the cosine law', 'cannot be solved without more information'];
  function methodP(r, kind, text) {
    var nm = r.pick(NAMES), A = nm[0], Bv = nm[1], C = nm[2], a = low(A), b = low(Bv), c = low(C), giv, find, right, sol;
    var s = function () { return r.int(4, 20); };
    if (kind === 'sss') { var q = pickWhere(function () { return [s(), s(), s()].sort(function (x, y) { return x - y; }); }, function (q) { return q[0] + q[1] > q[2] + 1 && q[0] !== q[1] && q[1] !== q[2]; }); giv = a + '=' + q[0] + ',\\ ' + b + '=' + q[1] + ',\\ ' + c + '=' + q[2]; find = '\\angle ' + C; right = 2; sol = 'SSS (three sides, no angle): the cosine law gives ' + t('\\angle ' + C) + '.'; }
    else if (kind === 'sas') { giv = '\\angle ' + A + '=' + D(r.int(35, 110)) + ',\\ ' + b + '=' + s() + ',\\ ' + c + '=' + s(); find = a; right = 2; sol = 'SAS: ' + t('\\angle ' + A) + ' is between ' + t(b) + ' and ' + t(c) + ', and no angle–opposite-side pair is known: the cosine law gives ' + t(a) + '.'; }
    else if (kind === 'right-hyp') { var hy = r.int(10, 25), lg = r.int(3, hy - 2); giv = '\\angle ' + Bv + '=90^\\circ,\\ ' + b + '=' + hy + ',\\ ' + a + '=' + lg; find = '\\angle ' + A; right = 0; sol = 'A right triangle: primary ratios, ' + t('\\sin ' + A + '=\\dfrac{' + lg + '}{' + hy + '}') + '.'; }
    else if (kind === 'right-legs') { var l1 = r.int(3, 15), l2 = r.int(3, 15); giv = '\\angle ' + C + '=90^\\circ,\\ ' + a + '=' + l1 + ',\\ ' + b + '=' + l2; find = '\\angle ' + A; right = 0; sol = 'A right triangle: primary ratios, ' + t('\\tan ' + A + '=\\dfrac{' + l1 + '}{' + l2 + '}') + '.'; }
    else if (kind === 'right-side') { giv = '\\angle ' + C + '=90^\\circ,\\ \\angle ' + A + '=' + D(r.int(20, 70)) + ',\\ ' + c + '=' + s(); find = b; right = 0; sol = 'A right triangle: primary ratios (' + t(b) + ' is adjacent to ' + t('\\angle ' + A) + ', ' + t(c) + ' is the hypotenuse: CAH).'; }
    else if (kind === 'aas') { var g1 = r.int(30, 80), g2 = r.int(30, 150 - g1); giv = '\\angle ' + A + '=' + D(g1) + ',\\ \\angle ' + Bv + '=' + D(g2) + ',\\ ' + b + '=' + s(); find = a; right = 1; sol = 'Full pair: ' + t('\\angle ' + Bv) + ' and ' + t(b) + '. The sine law gives ' + t(a) + '.'; }
    else if (kind === 'asa') { var e1 = r.int(30, 80), e2 = r.int(30, 150 - e1); giv = '\\angle ' + A + '=' + D(e1) + ',\\ \\angle ' + Bv + '=' + D(e2) + ',\\ ' + c + '=' + s(); find = a; right = 1; sol = t('\\angle ' + C + '=180^\\circ-' + D(e1) + '-' + D(e2) + '=' + D(180 - e1 - e2)) + ', then the full pair (' + t('\\angle ' + C) + ', ' + t(c) + '): the sine law.'; }
    else if (kind === 'two') { giv = a + '=' + s() + ',\\ \\angle ' + C + '=' + D(r.int(25, 80)); find = c; right = 3; sol = 'Only two measurements: a triangle needs three (at least one a side). It cannot be solved without more information.'; }
    else { var f1 = r.int(35, 75), f2 = r.int(35, 145 - f1); giv = '\\angle ' + A + '=' + D(f1) + ',\\ \\angle ' + Bv + '=' + D(f2) + ',\\ \\angle ' + C + '=' + D(180 - f1 - f2); find = a; right = 3; sol = 'AAA: the shape is known but not the size, so no side can be found.'; }
    var why = function (k) {
      if (k === 0) return 'This is not a right triangle, so SOH CAH TOA does not apply directly.';
      if (k === 3) return 'There is enough information: three measurements, at least one of them a side.';
      if (right === 0) return 'It is a right triangle: SOH CAH TOA is enough, and simpler.';
      if (right === 3) return kind === 'aaa' ? 'With only angles, any size of triangle fits: no side can be found.' : 'Only two measurements are known: that does not fix a triangle.';
      if (k === 1) return 'The sine law needs an angle <b>and its opposite side</b>. Is a full pair known?';
      return 'A full pair (an angle and its opposite side) is known' + (kind === 'asa' ? ' once you find the third angle' : '') + ', so the sine law is easier.';
    };
    return mcP(r, 'Name the most appropriate first method. ' + t('\\triangle ' + A + Bv + C + ':\\ ' + giv) + '; find ' + t(find) + '.', METH.map(function (m, k) { return { html: m, right: k === right, why: why(k), code: 'm' + k }; }), sol,
      ['Right triangle → primary ratios. A known angle with its opposite side → sine law. Otherwise SAS or SSS → cosine law.', 'Side ' + t('a') + ' is opposite ' + t('\\angle A') + '.'], text, true);
  }

  /* ======================= Assignment 8 ======================= */
  var CLK_AVOID = [[4, 0], [2, 30], [2, 0], [4, 30], [6, 0], [7, 20], [11, 0], [3, 30]];
  var QUESTIONS = [
    { num: '1', stem: 'Name the most appropriate first method and justify it. Do not solve.', parts: [
      { id: '1a', level: 'BEG', make: function (r) { return methodP(r, 'sss', 'method: SSS'); } },
      { id: '1b', level: 'BEG', make: function (r) { return methodP(r, r.pick(['right-hyp', 'right-legs']), 'method: right triangle'); } },
      { id: '1c', level: 'BEG', make: function (r) { return methodP(r, 'aas', 'method: full pair'); } },
      { id: '1d', level: 'BEG', make: function (r) { return methodP(r, r.pick(['two', 'two', 'aaa']), 'method: not enough information'); } }] },
    { num: '2', shared: function (r) { return pickWhere(function () { return { m: r.int(10, 18), hl: r.int(5, 12) }; }, function (z) { return z.hl <= z.m - 3 && !(z.m === 15 && z.hl === 11) && !(z.m === 9 && z.hl === 6); }); },
      stem: function (z) { return 'The minute hand of a clock is ' + t(z.m) + ' cm long and the hour hand is ' + t(z.hl) + ' cm long. Round distances to the nearest tenth.'; }, parts: [
      { id: '2a', level: 'EMG', make: function (r, z) {
        var H = pickWhere(function () { return r.pick([1, 3, 5, 7, 8, 9, 10]); }, function (H) { return !CLK_AVOID.some(function (c) { return c[0] === H && c[1] === 0; }); }), A = handAng(H, 0), d = clSide(z.m, z.hl, A);
        return fP('Find the angle between the hands at ' + H + ':00 and the distance between the tips.', [{ label: 'Angle:', name: 'Angle', kind: 'int', x: A, unit: '°', cands: [[30 * H, LID + '-reflex', 'Use the smaller angle between the hands (at most ' + t('180^\\circ') + ').'], [360 - A, LID + '-reflex', 'Use the smaller angle between the hands.']] },
          { label: 'Distance:', name: 'Distance', kind: 'near', x: d, dp: 1, unit: 'cm', alts: clAlts(z.m, z.hl, A, 'd') }],
          { sol: clockSolAng(H, 0) + ' SAS, so the cosine law: ' + t(clTex('d', z.m, z.hl, A, d)) + ' cm' + clockFig(H, 0, z.m + ' cm', z.hl + ' cm'), hints: ['The 12 marks are ' + t('30^\\circ') + ' apart.', 'Two sides (the hands) and the angle between them: cosine law.'], text: 'clock: whole hour', v: { k: 'clock', m: z.m, hl: z.hl, H: H, M: 0 } });
      } },
      { id: '2b', level: 'PRG', make: function (r, z) {
        var H = pickWhere(function () { return r.pick([1, 3, 5, 6, 7, 8, 9, 10, 11]); }, function (H) { return !CLK_AVOID.some(function (c) { return c[0] === H && c[1] === 30; }); }), A = handAng(H, 30), d = clSide(z.m, z.hl, A), Af = Math.abs(30 * H - 180);
        return fP('Find the angle between the hands at ' + H + ':30 and the distance between the tips.', [{ label: 'Angle:', name: 'Angle', kind: 'int', x: A, unit: '°', cands: [[Af, LID + '-hour-fixed', 'At the half hour the hour hand is <b>halfway</b> between ' + H + ' and ' + (H % 12 + 1) + ': it has moved ' + t('30(0.5^\\circ)=15^\\circ') + ' past the ' + H + '.'], [360 - A, LID + '-reflex', 'Use the smaller angle between the hands.']] },
          { label: 'Distance:', name: 'Distance', kind: 'near', x: d, dp: 1, unit: 'cm', alts: clAlts(z.m, z.hl, A, 'd').concat([{ v: clSide(z.m, z.hl, Af), code: LID + '-hour-fixed', hint: 'The hour hand has moved past the ' + H + ' at the half hour: recheck the angle.' }]) }],
          { sol: clockSolAng(H, 30) + '<br>' + t(clTex('d', z.m, z.hl, A, d)) + ' cm' + clockFig(H, 30, z.m + ' cm', z.hl + ' cm'), hints: ['The hour hand moves ' + t('0.5^\\circ') + ' each minute: at the half hour it is halfway between two marks.', 'Find each hand’s angle from 12, subtract, then use the cosine law.'], text: 'clock: half hour', v: { k: 'clock', m: z.m, hl: z.hl, H: H, M: 30 } });
      } },
      { id: '2c', level: 'EMG', make: function (r, z) {
        var six = r.chance(0.7), d = six ? z.m + z.hl : z.m - z.hl;
        return nP('What is the distance between the tips at ' + (six ? '6:00' : '12:00') + '?', d, 1, { unit: 'cm', alts: [{ v: six ? z.m - z.hl : z.m + z.hl, code: LID + '-clock-opp', hint: six ? 'At 6:00 the hands point in <b>opposite</b> directions: the distance is the sum of the lengths.' : 'At 12:00 both hands point straight up, one on top of the other: subtract.' }, { v: Math.sqrt(z.m * z.m + z.hl * z.hl), code: LID + '-clock-opp', hint: 'The angle between the hands is ' + t(six ? '180^\\circ' : '0^\\circ') + ', not ' + t('90^\\circ') + '.' }],
          sol: six ? 'The hands point in opposite directions (' + t('180^\\circ') + '): ' + t(z.m + '+' + z.hl + '=' + d) + ' cm.' : 'The hands point the same way (' + t('0^\\circ') + '): ' + t(z.m + '-' + z.hl + '=' + d) + ' cm.', hints: ['Picture the hands: at ' + (six ? '6:00 they make a straight line' : '12:00 they overlap') + '.'], text: 'clock: hands in a line', v: { k: 'clockline', m: z.m, hl: z.hl, six: six } });
      } }] },
    { num: '3', stem: 'Write each bearing in the other form.', parts: [
      { id: '3a', level: 'BEG', make: function (r) { var b = pickWhere(function () { return r.int(4, 86); }, function (b) { return [35, 65, 45, 75].indexOf(b) < 0; }); return dirP('Bearing ' + t(bearTex(b)), b, { text: 'bearing to direction: NE' }); } },
      { id: '3b', level: 'EMG', make: function (r) { var b = pickWhere(function () { return r.int(94, 176); }, function (b) { return [160, 165, 140, 135].indexOf(b) < 0; }); return dirP('Bearing ' + t(bearTex(b)), b, { text: 'bearing to direction: SE' }); } },
      { id: '3c', level: 'EMG', make: function (r) { var b = pickWhere(function () { return r.int(184, 266); }, function (b) { return [215, 250, 200, 225].indexOf(b) < 0; }); return dirP('Bearing ' + t(bearTex(b)), b, { text: 'bearing to direction: SW' }); } },
      { id: '3d', level: 'EMG', make: function (r) { var b = pickWhere(function () { return r.int(274, 356); }, function (b) { return [290, 310, 300, 315].indexOf(b) < 0; }); return dirP('Bearing ' + t(bearTex(b)), b, { text: 'bearing to direction: NW' }); } },
      { id: '3e', level: 'EMG', make: function (r) { var d = { ns: 'S', k: pickWhere(function () { return r.int(5, 85); }, function (k) { return [25, 15, 40, 62, 45].indexOf(k) < 0; }), ew: 'E' }; return bearNumP('Direction ' + t(dirTex(d)), d, { text: 'direction to bearing: S…E' }); } },
      { id: '3f', level: 'EMG', make: function (r) { var d = { ns: 'N', k: pickWhere(function () { return r.int(5, 85); }, function (k) { return [15, 20, 45].indexOf(k) < 0; }), ew: 'W' }; return bearNumP('Direction ' + t(dirTex(d)), d, { text: 'direction to bearing: N…W' }); } },
      { id: '3g', level: 'EMG', make: function (r) { var d = { ns: 'S', k: pickWhere(function () { return r.int(5, 85); }, function (k) { return [80, 15, 70, 45].indexOf(k) < 0; }), ew: 'W' }; return bearNumP('Direction ' + t(dirTex(d)), d, { text: 'direction to bearing: S…W' }); } },
      { id: '3h', level: 'BEG', make: function (r) { var d = { ns: 'N', k: pickWhere(function () { return r.int(1, 9); }, function (k) { return k !== 5; }), ew: 'E' }; return bearNumP('Direction ' + t(dirTex(d)) + ' (three digits)', d, { text: 'direction to bearing: small N…E' }); } },
      { id: '3i', level: 'EMG', make: function (r) { var b = pickWhere(function () { return r.int(5, 355); }, function (b) { return b % 90 && [35, 65, 300].indexOf(b) < 0; }); return backP('Town ' + t('B') + ' is on a bearing of ' + t(bearTex(b)) + ' from town ' + t('A') + '. What is the bearing of ' + t('A') + ' from ' + t('B') + '?', b); } }] },
    { num: '4', shared: function (r) { return legsGen(r, { T: [40, 115], d1: function () { return 10 * r.int(8, 25); }, d2: function () { return 10 * r.int(8, 25); }, dp: 0, avoid: [[150, 300, 210, 50], [18, 60, 25, 170]] }); },
      stem: function (z) { return 'A plane flies ' + t(z.d1) + ' km on a bearing of ' + t(bearTex(z.b1)) + ' from base ' + t('P') + ' to ' + t('Q') + ', then ' + t(z.d2) + ' km on a bearing of ' + t(bearTex(z.b2)) + ' to ' + t('R') + '.'; }, parts: [
      { id: '4a', level: 'ADV', make: function (r, z) { return legsDistP('Find the distance from ' + t('R') + ' back to ' + t('P') + ', to the nearest kilometre.', z, 'km', 0, { text: 'bearings: distance back' }); } },
      { id: '4b', level: 'MAS', make: function (r, z) { return legsRetP('Find the bearing the plane must fly to return from ' + t('R') + ' to ' + t('P') + ', to the nearest degree.', z, 'km', { text: 'bearings: return bearing' }); } }] },
    { num: '5', shared: function (r) {
      return pickWhere(function () { var b1 = r.int(0, 80), Aa = r.int(40, 85), Ba = r.int(35, 80); return { b1: b1, b2: b1 + Aa, Aa: Aa, Ba: Ba, d: r.int(8, 25) }; }, function (z) {
        var La = 180 - z.Aa - z.Ba, AL = z.d * sn(z.Ba) / sn(La), BL = z.d * sn(z.Aa) / sn(La); return La >= 25 && z.b2 % 90 && md(z.b2 + 180 + z.Ba) % 90 && safeR(BL, 1) && safeR(AL * sn(z.Aa), 1) && !(z.b1 === 25 && z.b2 === 95);
      });
    }, stem: function (z) { return 'At noon a ship at ' + t('A') + ' sees a lighthouse ' + t('L') + ' on a bearing of ' + t(bearTex(z.b1)) + '. The ship sails ' + t(z.d) + ' km on a bearing of ' + t(bearTex(z.b2)) + ' to ' + t('B') + ', where the lighthouse is on a bearing of ' + t(bearTex(md(z.b2 + 180 + z.Ba))) + '.'; }, parts: [
      { id: '5a', level: 'PRG', make: function (r, z) {
        var La = 180 - z.Aa - z.Ba, b3 = md(z.b2 + 180 + z.Ba), AL = z.d * sn(z.Ba) / sn(La), Bp = [z.d * sn(z.b2), z.d * cs(z.b2)], Lp = [AL * sn(z.b1), AL * cs(z.b1)];
        return fP('Sketch the situation and find the three angles of ' + t('\\triangle ABL') + '.', [
          { label: t('\\angle A='), name: t('\\angle A'), kind: 'int', x: z.Aa, unit: '°', cands: [[z.b2 + z.b1, LID + '-elev', 'The angle at ' + t('A') + ' is between the two directions from ' + t('A') + ': subtract the bearings.'], [180 - z.Aa, LID + '-elev', 'Subtract the two bearings measured at ' + t('A') + '.']] },
          { label: t('\\angle B='), name: t('\\angle B'), kind: 'int', x: z.Ba, unit: '°', cands: [[Math.abs(b3 - z.b2), LID + '-turn-heading', 'At ' + t('B') + ', use the bearing back to ' + t('A') + ' (' + t(bearTex(z.b2) + '+180^\\circ') + '), not the course.'], [180 - z.Ba, LID + '-turn-heading', 'At ' + t('B') + ' the bearing back to ' + t('A') + ' is ' + t(bearTex(md(z.b2 + 180))) + '.']] },
          { label: t('\\angle L='), name: t('\\angle L'), kind: 'int', x: La, unit: '°' }],
          { sol: 'At ' + t('A') + ': ' + t(bearTex(z.b2) + '-' + bearTex(z.b1) + '=' + D(z.Aa)) + '. At ' + t('B') + ': the bearing to ' + t('A') + ' is ' + t(bearTex(md(z.b2 + 180))) + ' and to ' + t('L') + ' is ' + t(bearTex(b3)) + ': ' + t(D(z.Ba)) + '. At ' + t('L') + ': ' + t('180^\\circ-' + D(z.Aa) + '-' + D(z.Ba) + '=' + D(La)) + '.' +
            mapFig({ A: [0, 0], B: Bp, L: Lp }, [['A', 'B', z.d + ' km'], ['A', 'L', '', { dash: true }], ['B', 'L', '', { dash: true }]], ['A', 'B'], { angles: [['A', 'B', 'L', z.Aa + '°'], ['B', 'L', 'A', z.Ba + '°']] }),
            hints: ['Draw north lines at ' + t('A') + ' and ' + t('B') + '. At ' + t('A') + ' the angle is the difference of the two bearings.', 'At ' + t('B') + ', the bearing back to ' + t('A') + ' is ' + t(bearTex(z.b2) + '+180^\\circ') + '.'], text: 'bearings: angles of the triangle', v: { k: 'lh', b1: z.b1, b2: z.b2, Ba: z.Ba, d: z.d, want: 'angles' } });
      } },
      { id: '5b', level: 'PRG', make: function (r, z) {
        var La = 180 - z.Aa - z.Ba, BL = z.d * sn(z.Aa) / sn(La);
        return nP('Find the distance ' + t('BL') + ', to the nearest tenth of a kilometre.', BL, 1, { unit: 'km', alts: [{ v: z.d * sn(z.Ba) / sn(La), code: LID + '-wrong-pair', hint: t('BL') + ' is opposite ' + t('\\angle A') + ': ' + t('BL=\\dfrac{AB\\sin A}{\\sin L}') + '.' }, { v: z.d * sn(La) / sn(z.Aa), code: LID + '-sl-flip', hint: t('\\dfrac{BL}{\\sin A}=\\dfrac{AB}{\\sin L}') + ': multiply by ' + t('\\sin A') + '.' }, { v: z.d * Math.sin(z.Aa) / Math.sin(La), code: LID + '-radian', hint: 'Your calculator is in <b>radian</b> mode.' }],
          sol: 'Full pair: ' + t('\\angle L=' + D(La)) + ' and ' + t('AB=' + z.d) + '. ' + t('BL=\\dfrac{' + z.d + '\\sin ' + D(z.Aa) + '}{\\sin ' + D(La) + '}\\approx ' + fx(BL, 1)) + ' km', hints: ['Use the angles from part (a): ' + t('AB') + ' is opposite ' + t('\\angle L') + ' (a full pair).'], text: 'bearings: a side by sine law', v: { k: 'lh', b1: z.b1, b2: z.b2, Ba: z.Ba, d: z.d, want: 'BL' } });
      } },
      { id: '5c', level: 'ADV', make: function (r, z) {
        var La = 180 - z.Aa - z.Ba, AL = z.d * sn(z.Ba) / sn(La), BL = z.d * sn(z.Aa) / sn(La), hh = AL * sn(z.Aa);
        return nP('How close to the lighthouse did the ship pass on its way from ' + t('A') + ' to ' + t('B') + '? (Nearest tenth of a kilometre.)', hh, 1, { unit: 'km', acc: [rd(BL, 1) * sn(z.Ba), rd(BL, 2) * sn(z.Ba), rd(AL, 2) * sn(z.Aa)], alts: [{ v: AL * cs(z.Aa), code: LID + '-alt-cos', hint: 'The closest distance is <b>opposite</b> ' + t('\\angle A') + ' in the right triangle with hypotenuse ' + t('AL') + ': ' + t('AL\\sin A') + '.' }, { v: Math.min(AL, BL), code: LID + '-closest', hint: 'The closest point is where the line from ' + t('L') + ' meets the path at a right angle, not at ' + t('A') + ' or ' + t('B') + '.' }, { v: BL * sn(z.Aa), code: LID + '-wrong-pair', hint: 'In the right triangle at ' + t('B') + ', use ' + t('\\angle B') + ': ' + t('BL\\sin B') + '.' }],
          sol: 'The closest distance is the perpendicular from ' + t('L') + ' to ' + t('AB') + ' (both ' + t('\\angle A') + ' and ' + t('\\angle B') + ' are acute, so its foot is between ' + t('A') + ' and ' + t('B') + ').<br>' + t('AL=\\dfrac{' + z.d + '\\sin ' + D(z.Ba) + '}{\\sin ' + D(La) + '}\\approx ' + fx(AL, 2)) + ', so the distance is ' + t(fx(AL, 2) + '\\sin ' + D(z.Aa) + '\\approx ' + fx(hh, 1)) + ' km (or ' + t('BL\\sin B') + ', the same).',
          hints: ['The ship is closest when the line to the lighthouse is perpendicular to its path.', 'That perpendicular is a leg of a right triangle with hypotenuse ' + t('AL') + ' (or ' + t('BL') + ').'], text: 'bearings: closest approach', v: { k: 'lh', b1: z.b1, b2: z.b2, Ba: z.Ba, d: z.d, want: 'close' } });
      } }] },
    { num: '6', parts: [{ id: '6', level: 'ADV', make: function (r) {
      var z = pickWhere(function () { var Dd = 5 * r.int(12, 26); return { D: Dd, x: r.int(15, Dd - 15), al: r.int(35, 65), be: r.int(10, 30) }; }, function (z) { var h1 = z.x * tn(z.al), h2 = (z.D - z.x) * tn(z.be), d = Math.hypot(z.D, h1 - h2); return safeR(d, 1) && !(z.D === 80 && z.x === 30 && z.al === 55); });
      var p1 = z.x / cs(z.al), p2 = (z.D - z.x) / cs(z.be), ang = 180 - z.al - z.be, d = clSide(p1, p2, ang), r1 = rd(p1, 2), r2 = rd(p2, 2);
      var h1 = z.x * tn(z.al), h2 = (z.D - z.x) * tn(z.be);
      return nP('Two lamp posts stand ' + t(z.D) + ' m apart on level ground. From point ' + t('P') + ' on the ground between them, ' + t(z.x) + ' m from the first post, the angle of elevation to the top of the first post is ' + t(D(z.al)) + ' and to the top of the second post is ' + t(D(z.be)) + '. Find the distance between the tops of the posts, to the nearest tenth of a metre.', d, 1, { unit: 'm', acc: [clSide(r1, r2, ang), clSide(rd(p1, 1), rd(p2, 1), ang)],
        alts: [{ v: clSide(p1, p2, z.al + z.be), code: LID + '-elev', hint: 'The angle at ' + t('P') + ' between the two lines of sight is what is left of the straight line: ' + t('180^\\circ-' + D(z.al) + '-' + D(z.be)) + '.' }, { v: clSide(z.x * cs(z.al), (z.D - z.x) * cs(z.be), ang), code: LID + '-alt-cos', hint: 'In each right triangle the ground distance is <b>adjacent</b> and the line of sight is the hypotenuse: ' + t('PT_1=\\dfrac{' + z.x + '}{\\cos ' + D(z.al) + '}') + '.' }, { v: z.D, code: LID + '-not-height', hint: 'The tops are at different heights, so they are farther apart than the posts.' }].concat(clAlts(p1, p2, ang, 'T_1T_2').slice(0, 3)),
        sol: 'Right triangles: ' + t('PT_1=\\dfrac{' + z.x + '}{\\cos ' + D(z.al) + '}\\approx ' + fx(p1, 2)) + ' m; ' + t('PT_2=\\dfrac{' + (z.D - z.x) + '}{\\cos ' + D(z.be) + '}\\approx ' + fx(p2, 2)) + ' m<br>' + t('\\angle T_1PT_2=180^\\circ-' + D(z.al) + '-' + D(z.be) + '=' + D(ang)) + '. Cosine law:<br>' + t('T_1T_2^2=' + fx(p1, 2) + '^2+' + fx(p2, 2) + '^2-2(' + fx(p1, 2) + ')(' + fx(p2, 2) + ')\\cos ' + D(ang) + '\\approx ' + fx(d * d, 0) + ',\\ T_1T_2\\approx ' + fx(d, 1)) + ' m' +
          fig(HW.fig({ pts: { F1: [0, 0], T1: [0, h1], P: [z.x, 0], F2: [z.D, 0], T2: [z.D, h2] }, names: { F1: '', T1: 'T₁', P: 'P', F2: '', T2: 'T₂' }, segs: [['F1', 'F2'], ['F1', 'T1', '', { width: 3 }], ['F2', 'T2', '', { width: 3 }], ['P', 'T1'], ['P', 'T2'], ['T1', 'T2', '', { dash: true }]], angles: [['P', 'F1', 'T1', z.al + '°', { r: 18 }], ['P', 'F2', 'T2', z.be + '°', { r: 26 }]], width: 280, aria: 'two lamp posts and the point P, to scale' })),
        hints: ['Find each line of sight ' + t('PT_1') + ' and ' + t('PT_2') + ' from its right triangle.', 'The angle between the lines of sight at ' + t('P') + ' is ' + t('180^\\circ') + ' minus the two elevation angles. Then the cosine law.'], text: 'two right triangles, then the cosine law', v: { k: 'lamp', D: z.D, x: z.x, al: z.al, be: z.be } });
    } }] },
    { num: '7', parts: [{ id: '7', level: 'ADV', make: function (r) {
      var z = pickWhere(function () { return { d: 50 * r.int(6, 18), al: r.int(30, 62), be: r.int(35, 68) }; }, function (z) { var hgt = z.d * sn(z.al) * sn(z.be) / sn(z.al + z.be); return Math.abs(z.al - z.be) >= 6 && z.al + z.be < 140 && safeR(hgt, 0) && !(z.d === 600 && z.al === 40); });
      var Hh = 180 - z.al - z.be, AH = z.d * sn(z.be) / sn(Hh), hgt = AH * sn(z.al);
      return nP('A hot-air balloon ' + t('H') + ' is directly above a point between two observers ' + t('A') + ' and ' + t('B') + ', who are ' + t(F(z.d)) + ' m apart. The angles of elevation of the balloon from ' + t('A') + ' and ' + t('B') + ' are ' + t(D(z.al)) + ' and ' + t(D(z.be)) + '. Find the height of the balloon, to the nearest metre.', hgt, 0, { unit: 'm', acc: [rd(AH, 1) * sn(z.al), rd(AH, 2) * sn(z.al)],
        alts: [{ v: AH, code: LID + '-not-height', hint: 'That is the slant distance ' + t('AH') + '. The height is the vertical side of the right triangle at ' + t('A') + '.' }, { v: AH * cs(z.al), code: LID + '-alt-cos', hint: 'The height is <b>opposite</b> the ' + t(D(z.al)) + ' angle: ' + t('AH\\sin ' + D(z.al)) + '.' }, { v: z.d * sn(z.al) / sn(Hh) * sn(z.al), code: LID + '-wrong-pair', hint: t('AH') + ' is opposite ' + t('\\angle B') + ': ' + t('AH=\\dfrac{AB\\sin B}{\\sin H}') + '.' }, { v: z.d * sn(z.be) / sn(z.al + z.be) * sn(z.al), code: LID + '-third-angle', hint: 'The angle at ' + t('H') + ' is ' + t('180^\\circ-' + D(z.al) + '-' + D(z.be)) + '.' }],
        sol: t('\\angle AHB=180^\\circ-' + D(z.al) + '-' + D(z.be) + '=' + D(Hh)) + '. Sine law: ' + t('AH=\\dfrac{' + F(z.d) + '\\sin ' + D(z.be) + '}{\\sin ' + D(Hh) + '}\\approx ' + fx(AH, 1)) + ' m<br>Height ' + t('=AH\\sin ' + D(z.al) + '\\approx ' + fx(hgt, 0)) + ' m' +
          fig(HW.fig({ pts: { A: [0, 0], B: [z.d, 0], H: [AH * cs(z.al), hgt], F: [AH * cs(z.al), 0] }, segs: [['A', 'B', F(z.d) + ' m'], ['A', 'H'], ['B', 'H'], ['H', 'F', 'h', { dash: true }]], names: { A: 'A', B: 'B', H: 'H', F: '' }, right: [['F', 'B', 'H']], angles: [['A', 'B', 'H', z.al + '°'], ['B', 'A', 'H', z.be + '°']], width: 270, aria: 'balloon above the ground between A and B, to scale' })),
        hints: ['In ' + t('\\triangle ABH') + ' you know two angles and the side between them. Find ' + t('\\angle H') + ', then ' + t('AH') + ' with the sine law.', 'The height is a leg of the right triangle at ' + t('A') + '.'], text: 'balloon: sine law then a primary ratio', v: { k: 'balloon', d: z.d, al: z.al, be: z.be } });
    } }] },
    { num: '8', shared: function (r) {
      return pickWhere(function () { return { pq: r.int(8, 18), qr: r.int(9, 20), q: r.int(65, 115), a1: r.int(30, 55), a2: r.int(80, 110) }; }, function (z) { var PR = clSide(z.pq, z.qr, z.q), sp = 180 - z.a1 - z.a2, PS = PR * sn(z.a1) / sn(z.a2), RS = PR * sn(sp) / sn(z.a2); return sp >= 25 && z.pq !== z.qr && safeR(PR, 1) && safeR(PS, 1) && safeR(RS, 1) && !(z.pq === 12 && z.qr === 15) && !(z.pq === 7 && z.qr === 9.5); });
    }, stem: function (z) {
      var PR = clSide(z.pq, z.qr, z.q), RS = PR * sn(180 - z.a1 - z.a2) / sn(z.a2), P = [z.pq * cs(z.q), z.pq * sn(z.q)], R = [z.qr, 0], u = [(P[0] - R[0]) / PR, (P[1] - R[1]) / PR];
      var rot = function (v, a) { return [v[0] * cs(a) - v[1] * sn(a), v[0] * sn(a) + v[1] * cs(a)]; }, S1 = rot(u, -z.a1), S2 = rot(u, z.a1), side = function (v) { return (P[0] - R[0]) * v[1] - (P[1] - R[1]) * v[0]; }, qside = (P[0] - R[0]) * (0 - R[1]) - (P[1] - R[1]) * (0 - R[0]);
      var dir = side(S1) * qside < 0 ? S1 : S2, S = [R[0] + RS * dir[0], R[1] + RS * dir[1]];
      return 'Quadrilateral ' + t('PQRS') + ' is split by diagonal ' + t('PR') + '. ' + t('PQ=' + z.pq) + ' cm, ' + t('QR=' + z.qr) + ' cm, ' + t('\\angle PQR=' + D(z.q)) + ', ' + t('\\angle PRS=' + D(z.a1)) + ' and ' + t('\\angle PSR=' + D(z.a2)) + '.' +
        fig(HW.fig({ pts: { P: P, Q: [0, 0], R: R, S: S }, segs: [['P', 'Q', z.pq + ''], ['Q', 'R', z.qr + ''], ['R', 'S'], ['S', 'P'], ['P', 'R', '', { dash: true }]], angles: [['Q', 'R', 'P', z.q + '°'], ['R', 'P', 'S', z.a1 + '°'], ['S', 'P', 'R', z.a2 + '°']], width: 260, height: 240, aria: 'quadrilateral PQRS with diagonal PR, to scale' }));
    }, parts: [
      { id: '8a', level: 'ADV', make: function (r, z) {
        var PR = clSide(z.pq, z.qr, z.q), sp = 180 - z.a1 - z.a2, PS = PR * sn(z.a1) / sn(z.a2), RS = PR * sn(sp) / sn(z.a2), p2 = rd(PR, 2);
        return fP('Find ' + t('PR') + ', ' + t('PS') + ' and ' + t('RS') + ' to the nearest tenth.', [
          { label: t('PR='), name: t('PR'), kind: 'near', x: PR, dp: 1, unit: 'cm', alts: clAlts(z.pq, z.qr, z.q, 'PR') },
          { label: t('PS='), name: t('PS'), kind: 'near', x: PS, dp: 1, unit: 'cm', acc: [p2 * sn(z.a1) / sn(z.a2), rd(PR, 1) * sn(z.a1) / sn(z.a2)], alts: [{ v: PR * sn(sp) / sn(z.a2), code: LID + '-wrong-pair', hint: t('PS') + ' is opposite ' + t('\\angle PRS') + '.' }, { v: PR * sn(z.a2) / sn(z.a1), code: LID + '-sl-flip', hint: t('PS=\\dfrac{PR\\sin\\angle PRS}{\\sin\\angle PSR}') + '.' }] },
          { label: t('RS='), name: t('RS'), kind: 'near', x: RS, dp: 1, unit: 'cm', acc: [p2 * sn(sp) / sn(z.a2), rd(PR, 1) * sn(sp) / sn(z.a2)], alts: [{ v: PR * sn(z.a1) / sn(z.a2), code: LID + '-wrong-pair', hint: t('RS') + ' is opposite ' + t('\\angle SPR') + ', the third angle of ' + t('\\triangle PRS') + '.' }, { v: PR * sn(z.q) / sn(z.a2), code: LID + '-third-angle', hint: 'Find ' + t('\\angle SPR=180^\\circ-' + D(z.a1) + '-' + D(z.a2)) + ' first.' }] }],
          { sol: t(clTex('PR', z.pq, z.qr, z.q, PR)) + ' cm<br>' + t('\\angle SPR=180^\\circ-' + D(z.a1) + '-' + D(z.a2) + '=' + D(sp)) + '. ' + t('PS=\\dfrac{' + fx(PR, 2) + '\\sin ' + D(z.a1) + '}{\\sin ' + D(z.a2) + '}\\approx ' + fx(PS, 1)) + ' cm, ' + t('RS=\\dfrac{' + fx(PR, 2) + '\\sin ' + D(sp) + '}{\\sin ' + D(z.a2) + '}\\approx ' + fx(RS, 1)) + ' cm',
            hints: [t('\\triangle PQR') + ' is SAS: cosine law for ' + t('PR') + '.', 'In ' + t('\\triangle PRS') + ', ' + t('PR') + ' and ' + t('\\angle PSR') + ' are a full pair: the sine law.'], text: 'two triangles: sides of a quadrilateral', v: { k: 'quad', z: z } });
      } },
      { id: '8b', level: 'MAS', make: function (r, z) {
        var PR = clSide(z.pq, z.qr, z.q), sp = 180 - z.a1 - z.a2, PS = PR * sn(z.a1) / sn(z.a2), RS = PR * sn(sp) / sn(z.a2), per = z.pq + z.qr + PS + RS, A1 = 0.5 * z.pq * z.qr * sn(z.q), A2 = 0.5 * PR * RS * sn(z.a1);
        var r1 = function (x) { return rd(x, 1); };
        return fP('Find the perimeter and the area of ' + t('PQRS') + ', to the nearest tenth.', [
          { label: 'Perimeter:', name: 'Perimeter', kind: 'near', x: per, dp: 1, unit: 'cm', acc: [z.pq + z.qr + r1(PS) + r1(RS), z.pq + z.qr + rd(PS, 2) + rd(RS, 2)], alts: [{ v: per + PR, code: LID + '-perim-diag', hint: 'The diagonal ' + t('PR') + ' is inside the shape: it is not part of the perimeter.' }] },
          { label: 'Area:', name: 'Area', kind: 'near', x: A1 + A2, dp: 1, after: t('\\text{cm}^2'), acc: [A1 + 0.5 * rd(PR, 2) * rd(RS, 2) * sn(z.a1), A1 + 0.5 * r1(PR) * r1(RS) * sn(z.a1)], alts: [{ v: A1, code: LID + '-area-one', hint: 'That is ' + t('\\triangle PQR') + ' only. Add the area of ' + t('\\triangle PRS') + '.' }, { v: A2, code: LID + '-area-one', hint: 'That is ' + t('\\triangle PRS') + ' only. Add the area of ' + t('\\triangle PQR') + '.' }, { v: 2 * (A1 + A2), code: LID + '-area-half', hint: t('\\text{Area}=\\frac{1}{2}ab\\sin C') + ': don’t forget the ' + t('\\frac{1}{2}') + '.' }] }],
          { sol: 'Perimeter ' + t('\\approx ' + z.pq + '+' + z.qr + '+' + fx(PS, 2) + '+' + fx(RS, 2) + '\\approx ' + fx(per, 1)) + ' cm<br>Area ' + t('=\\frac{1}{2}(' + z.pq + ')(' + z.qr + ')\\sin ' + D(z.q) + '+\\frac{1}{2}(' + fx(PR, 2) + ')(' + fx(RS, 2) + ')\\sin ' + D(z.a1) + '\\approx ' + fx(A1, 2) + '+' + fx(A2, 2) + '\\approx ' + fx(A1 + A2, 1)) + ' cm²',
            hints: ['Perimeter: the four outside sides (not the diagonal).', 'Area: add the two triangles, each ' + t('\\frac{1}{2}ab\\sin C') + ' with two sides and the angle between them.'], text: 'quadrilateral: perimeter and area', v: { k: 'quad', z: z } });
      } }] },
    { num: '9', shared: function (r) {
      return pickWhere(function () { return { ab: r.int(10, 18), B: r.int(40, 65), bd: r.int(4, 9), dc: r.int(6, 12) }; }, function (z) {
        var AD = clSide(z.ab, z.bd, z.B), adb = clAng(z.ab, AD, z.bd), BC = z.bd + z.dc, AC = clSide(z.ab, BC, z.B), C = clAng(z.ab, AC, BC);
        return adb > 95 && C < 85 && z.ab < BC && safeR(AD, 1) && safeR(adb, 0) && safeR(AC, 1) && safeR(C, 0) && !(z.ab === 14 && z.B === 50 && z.bd === 6);
      });
    }, stem: function (z) {
      var BC = z.bd + z.dc;
      return 'In ' + t('\\triangle ABC') + ', ' + t('AB=' + z.ab) + ' cm and ' + t('\\angle ABC=' + D(z.B)) + '. Point ' + t('D') + ' is on ' + t('BC') + ' with ' + t('BD=' + z.bd) + ' cm and ' + t('DC=' + z.dc) + ' cm.' +
        fig(HW.fig({ pts: { B: [0, 0], C: [BC, 0], D: [z.bd, 0], A: [z.ab * cs(z.B), z.ab * sn(z.B)] }, segs: [['A', 'B', z.ab + ''], ['B', 'D', z.bd + ''], ['D', 'C', z.dc + ''], ['A', 'C'], ['A', 'D']], angles: [['B', 'C', 'A', z.B + '°']], width: 260, aria: 'triangle ABC with D on BC, to scale' }));
    }, parts: [
      { id: '9a', level: 'PRG', make: function (r, z) { var AD = clSide(z.ab, z.bd, z.B); return nP('Find ' + t('AD') + ' to the nearest tenth.', AD, 1, { unit: 'cm', alts: clAlts(z.ab, z.bd, z.B, 'AD'), sol: 'SAS in ' + t('\\triangle ABD') + ': ' + t(clTex('AD', z.ab, z.bd, z.B, AD)) + ' cm', hints: ['In ' + t('\\triangle ABD') + ' you know ' + t('AB') + ', ' + t('BD') + ' and the angle between them.'], text: 'cosine law: AD', v: { k: 'abd', z: z, want: 'AD' } }); } },
      { id: '9b', level: 'ADV', make: function (r, z) {
        var AD = clSide(z.ab, z.bd, z.B), adb = clAng(z.ab, AD, z.bd), a2 = rd(AD, 2), cosv = (a2 * a2 + z.bd * z.bd - z.ab * z.ab) / (2 * a2 * z.bd);
        return nP('Find ' + t('\\angle ADB') + ' to the nearest degree.', adb, 0, { unit: '°', acc: [acs(cosv)], alts: [{ v: 180 - adb, code: LID + '-sine-acute', hint: 'The sine law only gives the acute angle, but ' + t('\\angle ADB') + ' is <b>obtuse</b> here (it is opposite the longest side of ' + t('\\triangle ABD') + ', ' + t('AB') + '). Use the cosine law: a negative cosine shows an obtuse angle.' }, { v: clAng(z.bd, z.ab, AD), code: LID + '-sss-angle', hint: 'That is ' + t('\\angle BAD') + '. ' + t('\\angle ADB') + ' is opposite ' + t('AB') + '.' }],
          sol: 'Cosine law (safer: the angle may be obtuse): ' + t('\\cos\\angle ADB=\\dfrac{' + fx(AD, 2) + '^2+' + z.bd + '^2-' + z.ab + '^2}{2(' + fx(AD, 2) + ')(' + z.bd + ')}\\approx ' + fx(cs(adb), 4)) + ', ' + t('\\angle ADB\\approx ' + Dx(adb, 0)), hints: ['Use the three sides of ' + t('\\triangle ABD') + ' and the cosine law. ' + t('\\angle ADB') + ' is opposite ' + t('AB') + '.'], text: 'cosine law: an obtuse angle', v: { k: 'abd', z: z, want: 'ADB' } });
      } },
      { id: '9c', level: 'PRG', make: function (r, z) { var BC = z.bd + z.dc, AC = clSide(z.ab, BC, z.B); return nP('Find ' + t('AC') + ' to the nearest tenth.', AC, 1, { unit: 'cm', alts: clAlts(z.ab, BC, z.B, 'AC').concat([{ v: clSide(z.ab, z.dc, z.B), code: LID + '-part-side', hint: 'The ' + t(D(z.B)) + ' angle is between ' + t('AB') + ' and the whole side ' + t('BC=' + z.bd + '+' + z.dc) + '.' }]), sol: 'In ' + t('\\triangle ABC') + ', ' + t('BC=' + z.bd + '+' + z.dc + '=' + BC) + ' (SAS): ' + t(clTex('AC', z.ab, BC, z.B, AC)) + ' cm', hints: ['Use the whole triangle ' + t('ABC') + ' with ' + t('BC=BD+DC') + '.'], text: 'cosine law: AC', v: { k: 'abd', z: z, want: 'AC' } }); } },
      { id: '9d', level: 'ADV', make: function (r, z) {
        var BC = z.bd + z.dc, AC = clSide(z.ab, BC, z.B), C = clAng(z.ab, AC, BC), sv = z.ab * sn(z.B) / rd(AC, 2);
        return nP('Find ' + t('\\angle ACB') + ' to the nearest degree.', C, 0, { unit: '°', acc: [asn(sv)], alts: [{ v: 180 - C, code: LID + '-sine-obt', hint: t('\\angle ACB') + ' is acute: the largest angle is opposite the longest side, ' + t('BC') + ', so it is ' + t('\\angle A') + ', not ' + t('\\angle C') + '.' }, { v: asn(Math.min(1, AC * sn(z.B) / z.ab)), code: LID + '-sl-flip', hint: t('\\sin C=\\dfrac{AB\\sin B}{AC}') + '.' }],
          sol: t('\\sin\\angle ACB=\\dfrac{' + z.ab + '\\sin ' + D(z.B) + '}{' + fx(AC, 2) + '}\\approx ' + fx(z.ab * sn(z.B) / AC, 4)) + '; acute (the largest angle is opposite ' + t('BC=' + BC) + ', so ' + t('\\angle C') + ' is not obtuse): ' + t('\\angle ACB\\approx ' + Dx(C, 0)), hints: ['A full pair is known in ' + t('\\triangle ABC') + ': ' + t('\\angle B') + ' and ' + t('AC') + '.'], text: 'sine law: an acute angle', v: { k: 'abd', z: z, want: 'C' } });
      } }] },
    { num: '10', parts: [{ id: '10', level: 'PRG', make: function (r) {
      var z = pickWhere(function () { var R0 = r.int(6, 15); return { R: R0, L: r.int(R0 + 1, 2 * R0 - 1) }; }, function (z) { var c = acs((2 * z.R * z.R - z.L * z.L) / (2 * z.R * z.R)); return safeR(c, 0) && safeR(c / 2, 0) && !(z.R === 9 && z.L === 14) && !(z.R === 6.5 && z.L === 10); });
      var c = acs((2 * z.R * z.R - z.L * z.L) / (2 * z.R * z.R)), ins = c / 2, h = c / 2, P = [-z.R * sn(h), -z.R * cs(h)], Q = [z.R * sn(h), -z.R * cs(h)];
      return fP('A circle with centre ' + t('O') + ' has radius ' + t(z.R) + ' cm. Chord ' + t('PQ') + ' is ' + t(z.L) + ' cm long, and ' + t('R') + ' is a point on the major arc. Find ' + t('\\angle POQ') + ' and ' + t('\\angle PRQ') + ' to the nearest degree.', [
        { label: t('\\angle POQ='), name: t('\\angle POQ'), kind: 'near', x: c, dp: 0, unit: '°', alts: [{ v: ins, code: LID + '-inscribed', hint: 'That is the inscribed angle. ' + t('\\angle POQ') + ' is the <b>central</b> angle, twice as big.' }, { v: 180 - c, code: LID + '-sine-acute', hint: 'The cosine is negative, so the angle is obtuse.' }] },
        { label: t('\\angle PRQ='), name: t('\\angle PRQ'), kind: 'near', x: ins, dp: 0, unit: '°', acc: [rd(c, 0) / 2, rd(c, 1) / 2], alts: [{ v: c, code: LID + '-inscribed', hint: 'The inscribed angle is <b>half</b> the central angle on the same arc.' }, { v: 180 - ins, code: LID + '-inscribed', hint: t('R') + ' is on the major arc, so ' + t('\\angle PRQ') + ' is half of ' + t('\\angle POQ') + '.' }] }],
        { sol: 'SSS in ' + t('\\triangle POQ') + ': ' + t('\\cos\\angle POQ=\\dfrac{' + z.R + '^2+' + z.R + '^2-' + z.L + '^2}{2(' + z.R + ')(' + z.R + ')}\\approx ' + fx(cs(c), 4) + ',\\ \\angle POQ\\approx ' + Dx(c, 1)) + '<br>Inscribed angle on the same arc: ' + t('\\angle PRQ=\\frac{1}{2}(' + Dx(c, 1) + ')\\approx ' + Dx(ins, 0)) +
          circFig(z.R, { O: [0, 0], P: P, Q: Q, R: [0, z.R] }, [['O', 'P', { label: String(z.R) }], ['O', 'Q'], ['P', 'Q', { label: String(z.L) }], ['P', 'R', { color: '#2b55a0' }], ['Q', 'R', { color: '#2b55a0' }]], { aria: 'circle with chord PQ' }),
          hints: ['Two radii and the chord make an isosceles triangle: SSS, so the cosine law for ' + t('\\angle POQ') + '.', 'The inscribed angle is half the central angle on the same arc.'], text: 'circle: central and inscribed angles', v: { k: 'chord', R: z.R, L: z.L } });
    } }] },
    { num: '11', shared: function (r) { return pickWhere(function () { return { R: r.int(4, 12), d: 2 * r.int(14, 42) }; }, function (z) { var c = 180 - z.d; return safeR(2 * z.R * sn(c / 2), 1) && safeR(z.R * tn(c / 2), 1) && !(z.R === 5 && z.d === 46); }); },
      stem: function (z) {
        var c = 180 - z.d, OD = z.R / sn(z.d / 2), A = [-z.R * sn(c / 2), -z.R * cs(c / 2)], C = [z.R * sn(c / 2), -z.R * cs(c / 2)];
        return 'Tangents ' + t('DA') + ' and ' + t('DC') + ' touch a circle with centre ' + t('O') + ' and radius ' + t(z.R) + ' cm at ' + t('A') + ' and ' + t('C') + '. ' + t('\\angle ADC=' + D(z.d)) + ', and ' + t('B') + ' is a point on the major arc ' + t('AC') + '.' +
          circFig(z.R, { O: [0, 0], A: A, C: C, D: [0, -OD], B: [z.R * sn(15), z.R * cs(15)] }, [['O', 'A'], ['O', 'C'], ['A', 'D'], ['D', 'C'], ['A', 'B'], ['B', 'C'], ['A', 'C', { dash: true }]], { aria: 'circle with two tangents from D', height: 300 });
      }, parts: [
      { id: '11a', level: 'EMG', make: function (r, z) { var c = 180 - z.d; return intP('Find ' + t('\\angle AOC') + '. (Hint: what angle does a tangent make with the radius?)', c, { unit: '°', cands: [[z.d, LID + '-tangent', 'The tangents meet the radii at right angles: the quadrilateral ' + t('OADC') + ' has two ' + t('90^\\circ') + ' angles.'], [360 - z.d, LID + '-tangent', 'The four angles of ' + t('OADC') + ' add to ' + t('360^\\circ') + ', and two of them are ' + t('90^\\circ') + '.'], [90 - z.d / 2, LID + '-tangent', 'Use the whole quadrilateral ' + t('OADC') + ': ' + t('360^\\circ-90^\\circ-90^\\circ-' + D(z.d)) + '.']], sol: t('\\angle OAD=\\angle OCD=90^\\circ') + ' (tangent ' + t('\\perp') + ' radius); the angles in quadrilateral ' + t('OADC') + ' add to ' + t('360^\\circ') + ': ' + t('\\angle AOC=360^\\circ-90^\\circ-90^\\circ-' + D(z.d) + '=' + D(c)) + '.', hints: ['A tangent is perpendicular to the radius at the point of tangency.'], text: 'tangents: central angle', v: { k: 'tan', R: z.R, d: z.d, want: 'AOC' } }); } },
      { id: '11b', level: 'PRG', make: function (r, z) { var c = 180 - z.d, AC = clSide(z.R, z.R, c); return nP('Find the length of chord ' + t('AC') + ' to the nearest tenth.', AC, 1, { unit: 'cm', alts: clAlts(z.R, z.R, c, 'AC').concat([{ v: clSide(z.R, z.R, z.d), code: LID + '-inscribed', hint: 'Use the central angle ' + t('\\angle AOC=' + D(c)) + ' in ' + t('\\triangle AOC') + '.' }]), sol: 'SAS in ' + t('\\triangle AOC') + ': ' + t(clTex('AC', z.R, z.R, c, AC)) + ' cm', hints: [t('OA=OC=' + z.R) + ' with ' + t('\\angle AOC') + ' between them: cosine law.'], text: 'circle: chord by cosine law', v: { k: 'tan', R: z.R, d: z.d, want: 'AC' } }); } },
      { id: '11c', level: 'PRG', make: function (r, z) { var c = 180 - z.d; return intP('Find ' + t('\\angle ABC') + '.', c / 2, { unit: '°', cands: [[c, LID + '-inscribed', 'The inscribed angle is <b>half</b> the central angle on the same arc.'], [z.d / 2, LID + '-inscribed', 'Use the central angle ' + t('\\angle AOC') + ', not ' + t('\\angle ADC') + '.'], [180 - c / 2, LID + '-inscribed', t('B') + ' is on the major arc: ' + t('\\angle ABC=\\frac{1}{2}\\angle AOC') + '.']], sol: 'Inscribed angle on the same arc: ' + t('\\angle ABC=\\frac{1}{2}(' + D(c) + ')=' + D(c / 2)), hints: ['The central angle is twice the inscribed angle on the same arc.'], text: 'circle: inscribed angle', v: { k: 'tan', R: z.R, d: z.d, want: 'ABC' } }); } },
      { id: '11d', level: 'ADV', make: function (r, z) { var c = 180 - z.d, DA = z.R * tn(c / 2); return nP('Find the length of the tangent ' + t('DA') + ' to the nearest tenth.', DA, 1, { unit: 'cm', alts: [{ v: z.R / tn(c / 2), code: LID + '-tangent', hint: 'In right ' + t('\\triangle OAD') + ', ' + t('DA') + ' is <b>opposite</b> ' + t('\\angle AOD') + ' and ' + t('OA') + ' is adjacent: ' + t('DA=OA\\tan\\angle AOD') + '.' }, { v: z.R * sn(c / 2), code: LID + '-tangent', hint: t('OA') + ' is a leg (adjacent to ' + t('\\angle AOD') + '), not the hypotenuse: use TOA.' }, { v: z.R * tn(c), code: LID + '-tangent', hint: t('OD') + ' bisects ' + t('\\angle AOC') + ': ' + t('\\angle AOD=\\frac{1}{2}(' + D(c) + ')') + '.' }].filter(function (a) { return Math.abs(a.v - DA) > 0.06; }),
        sol: t('\\angle OAD=90^\\circ') + ', and ' + t('OD') + ' bisects ' + t('\\angle AOC') + ': ' + t('\\angle AOD=' + D(c / 2)) + '. ' + t('DA=' + z.R + '\\tan ' + D(c / 2) + '\\approx ' + fx(DA, 1)) + ' cm', hints: ['Right ' + t('\\triangle OAD') + ' (tangent ' + t('\\perp') + ' radius) with ' + t('\\angle AOD=\\frac{1}{2}\\angle AOC') + '.'], text: 'circle: tangent length', v: { k: 'tan', R: z.R, d: z.d, want: 'DA' } }); } }] },
    { num: '12', stem: 'Find each area, to the nearest tenth.', parts: [
      { id: '12a', level: 'EMG', make: function (r) {
        var z = pickWhere(function () { return { a: r.int(6, 20), b: r.int(6, 20), C: r.int(25, 80) }; }, function (z) { return z.a !== z.b && safeR(0.5 * z.a * z.b * sn(z.C), 1) && !(z.a === 11 && z.b === 16); }), A = 0.5 * z.a * z.b * sn(z.C);
        return nP(t('\\triangle ABC') + ' with ' + t('a=' + z.a) + ' cm, ' + t('b=' + z.b) + ' cm and ' + t('\\angle C=' + D(z.C)) + '.', A, 1, { after: t('\\text{cm}^2'), alts: [{ v: 2 * A, code: LID + '-area-half', hint: t('\\text{Area}=\\frac{1}{2}ab\\sin C') + ': don’t forget the ' + t('\\frac{1}{2}') + '.' }, { v: 0.5 * z.a * z.b * cs(z.C), code: LID + '-area-cos', hint: 'The height is ' + t('a\\sin C') + ': use sine.' }, { v: 0.5 * z.a * z.b * Math.sin(z.C), code: LID + '-radian', hint: 'Your calculator is in <b>radian</b> mode.' }],
          sol: t('\\text{Area}=\\frac{1}{2}(' + z.a + ')(' + z.b + ')\\sin ' + D(z.C) + '\\approx ' + fx(A, 1)) + ' cm²', hints: [t('\\text{Area}=\\frac{1}{2}ab\\sin C') + ' with the angle between the two sides.'], text: 'area: two sides and the contained angle', v: { k: 'sas-area', a: z.a, b: z.b, C: z.C } });
      } },
      { id: '12b', level: 'PRG', make: function (r) { return sssAreaP(r, 'm', [[8, 10, 13], [7, 9, 12], [6, 8, 11]], 'area: three sides'); } }] },
    { num: '13', parts: [{ id: '13', level: 'ADV', make: function (r) {
      var z = pickWhere(function () { var p = r.int(6, 18), q = r.int(8, 20); return { p: p, q: q, A: r.int(Math.ceil(0.15 * p * q), Math.floor(0.47 * p * q)) }; }, function (z) { var s = 2 * z.A / (z.p * z.q); return z.p !== z.q && s < 0.95 && safeR(asn(s), 1) && !(z.p === 12 && z.q === 15 && z.A === 60); });
      var s = 2 * z.A / (z.p * z.q), a1 = asn(s), a2 = 180 - a1;
      return angListP('A triangle has sides of ' + t(z.p) + ' cm and ' + t(z.q) + ' cm and an area of ' + t(z.A) + ' cm². Find both possible measures of the angle between the two sides, to the nearest tenth of a degree.', [a1, a2], 1, {
        onlyHint: 'That is one of them. An acute angle and its supplement have the same sine, so ' + t('180^\\circ-' + Dx(a1, 1) + '=' + Dx(a2, 1)) + ' gives the same area. List both.',
        xc: [[asn(Math.min(1, z.A / (z.p * z.q))), LID + '-area-half', t(z.A + '=\\frac{1}{2}(' + z.p + ')(' + z.q + ')\\sin\\theta') + ': the ' + t('\\frac{1}{2}') + ' makes ' + t('\\sin\\theta=\\dfrac{2(' + z.A + ')}{' + z.p * z.q + '}') + '.'], [180 - asn(Math.min(1, z.A / (z.p * z.q))), LID + '-area-half', 'Remember the ' + t('\\frac{1}{2}') + ' in ' + t('\\frac{1}{2}ab\\sin\\theta') + '.']],
        sol: t(z.A + '=\\frac{1}{2}(' + z.p + ')(' + z.q + ')\\sin\\theta\\Rightarrow\\sin\\theta=\\dfrac{' + 2 * z.A + '}{' + z.p * z.q + '}\\approx ' + fx(s, 4)) + '; ' + t('\\theta\\approx ' + Dx(a1, 1)) + ' or ' + t('180^\\circ-' + Dx(a1, 1) + '=' + Dx(a2, 1)) + '.<br>There are two because an acute angle and its supplement have the same sine, so both triangles have the same area.',
        hints: ['Substitute into ' + t('\\text{Area}=\\frac{1}{2}ab\\sin\\theta') + ' and solve for ' + t('\\sin\\theta') + '.', 'Two angles between ' + t('0^\\circ') + ' and ' + t('180^\\circ') + ' have that sine.'], text: 'area: both possible angles', v: { k: 'area-ang', p: z.p, q: z.q, A: z.A } });
    } }] },
    { num: '14', parts: [{ id: '14', level: 'PRG', make: function (r) {
      var z = pickWhere(function () { var b1 = r.int(105, 165), right = r.chance(0.55), b2 = right ? b1 - 90 : b1 - 90 + (r.chance(0.5) ? 1 : -1) * r.int(12, 25); return { b1: b1, b2: b2, right: right, d: r.int(4, 15) }; }, function (z) { var T = z.b1 + 180 - z.b2, Tin = 360 - T; return z.b2 > 5 && z.b2 < 85 && (z.b1 - 90) + Tin < 170 && !(z.b1 === 120 && z.d === 6); });
      var T = 360 - (z.b1 + 180 - z.b2), O = z.b1 - 90;
      var why = { 0: 'Is the angle at the turn ' + t('90^\\circ') + '? The back bearing is ' + t(bearTex(z.b1 + 180)) + ' and the new course is ' + t(bearTex(z.b2)) + '.', 1: 'You know two angles (at the dock and at the turn) and one side' + (z.right ? ', but the angle at the turn is ' + t('90^\\circ') + ': a right triangle is simpler.' : ': with the third angle, that is a full pair.'), 2: 'The cosine law needs two sides (SAS or SSS). Only one side is known.', 3: 'You can find the angle at the dock (' + t(bearTex(z.b1) + '-090^\\circ') + ') and the angle at the turn from the bearings.' };
      return mcP(r, 'A sailboat leaves a dock, sails ' + t(z.d) + ' km on a bearing of ' + t(bearTex(z.b1)) + ', then turns onto a bearing of ' + t(bearTex(z.b2)) + ' and sails until it is due east of the dock. To find how far it is from the dock, the most appropriate method is', METH.map(function (m, k) { return { html: m, right: k === (z.right ? 0 : 1), why: why[k], code: 'm' + k }; }),
        'At the turn the back bearing is ' + t(bearTex(z.b1 + 180)) + ' and the new course is ' + t(bearTex(z.b2)) + ': the angle between them is ' + t(D(T)) + '. The angle at the dock is ' + t(bearTex(z.b1) + '-090^\\circ=' + D(O)) + '. ' + (z.right ? 'A right triangle, so <b>primary ratios</b>: distance ' + t('=\\dfrac{' + z.d + '}{\\cos ' + D(O) + '}') + '.' : 'Not a right triangle. The third angle is ' + t('180^\\circ-' + D(O) + '-' + D(T) + '=' + D(180 - O - T)) + ', opposite the ' + t(z.d) + ' km leg: a full pair, so the <b>sine law</b>.') +
        bearFig([{ d: z.d, b: z.b1 }, { d: z.d * sn(O) / sn(180 - O - T), b: z.b2 }], ['dock', 'turn', ''], [z.d + ' km', '', '?']),
        ['Find the angle at the turn from the bearings, and the angle at the dock (east is ' + t('090^\\circ') + ').'], 'MC: method for a sailing problem', true);
    } }] },
    { num: '15', parts: [{ id: '15', level: 'PRG', make: function (r) {
      var kind = r.chance(0.6) ? 'ssa' : 'sas', z = pickWhere(function () { return { pq: r.int(5, 12), pr: r.int(8, 16), Q: r.int(95, 130), P: r.int(40, 100) }; }, function (z) { return z.pq < z.pr && !(z.pq === 7 && z.pr === 11 && z.Q === 105); });
      var prm = kind === 'ssa' ? 'In ' + t('\\triangle PQR') + ', ' + t('PQ=' + z.pq) + ' cm, ' + t('PR=' + z.pr) + ' cm and ' + t('\\angle PQR=' + D(z.Q)) + '. To find ' + t('\\angle PRQ') + ', the most appropriate method is' : 'In ' + t('\\triangle PQR') + ', ' + t('PQ=' + z.pq) + ' cm, ' + t('PR=' + z.pr) + ' cm and ' + t('\\angle QPR=' + D(z.P)) + '. To find ' + t('\\angle PRQ') + ', the most appropriate first method is';
      var right = kind === 'ssa' ? 1 : 2;
      var why = { 0: 'This is not a right triangle.', 1: kind === 'ssa' ? '' : 'The sine law needs an angle and its opposite side. ' + t('\\angle QPR') + ' is opposite ' + t('QR') + ', which is not known.', 2: kind === 'ssa' ? t('\\angle Q') + ' and its opposite side ' + t('PR') + ' are a full pair, so the sine law is quicker.' : '', 3: 'Two sides and an angle are known: enough to solve the triangle.' };
      return mcP(r, prm, METH.map(function (m, k) { return { html: m, right: k === right, why: why[k] || null, code: 'm' + k }; }),
        kind === 'ssa' ? t('\\angle Q') + ' and its opposite side ' + t('PR') + ' are a full pair, and ' + t('PQ') + ' is opposite ' + t('\\angle R') + ': the <b>sine law</b>, ' + t('\\sin R=\\dfrac{' + z.pq + '\\sin ' + D(z.Q) + '}{' + z.pr + '}') + '. (Since ' + t('\\angle Q') + ' is obtuse, ' + t('\\angle R') + ' is acute: one answer.)' : 'SAS: ' + t('\\angle QPR') + ' is between ' + t('PQ') + ' and ' + t('PR') + ', and no full pair is known. The <b>cosine law</b> gives ' + t('QR') + ' first; then a full pair is known.',
        ['Look for an angle with its opposite side (a full pair).'], 'MC: choosing the law', true);
    } }] },
    { num: '16', parts: [{ id: '16', level: 'EMG', make: function (r) {
      var z = pickWhere(function () { return { p: r.int(6, 16), q: r.int(8, 20), th: r.pick([110, 115, 120, 125, 130, 135, 140, 145, 150, 155, 160]) }; }, function (z) { return z.p !== z.q && !(z.p === 10 && z.q === 14 && z.th === 150); });
      var A = 0.5 * z.p * z.q * sn(z.th), Ac = 0.5 * z.p * z.q * Math.abs(cs(z.th)), u = ' cm²';
      return mcP(r, 'The area of a triangle with sides ' + t(z.p) + ' cm and ' + t(z.q) + ' cm and a contained angle of ' + t(D(z.th)) + ' is', [
        { html: fx(A, 1) + u, right: true }, { html: fx(Ac, 1) + u, why: 'The area uses ' + t('\\sin') + ', not ' + t('\\cos') + ': ' + t('\\frac{1}{2}ab\\sin C') + '.' }, { html: fx(2 * A, 1) + u, why: 'Don’t forget the ' + t('\\frac{1}{2}') + '.' }, { html: fx(2 * Ac, 1) + u, why: t('\\text{Area}=\\frac{1}{2}ab\\sin C') + '.' }],
        t('\\frac{1}{2}(' + z.p + ')(' + z.q + ')\\sin ' + D(z.th) + '\\approx ' + fx(A, 1)) + ' cm². (The others use ' + t('|\\cos|') + ', forget the ' + t('\\frac{1}{2}') + ', or both.)', ['Area ' + t('=\\frac{1}{2}ab\\sin C') + '; ' + t('\\sin') + ' of an obtuse angle is positive.'], 'MC: area with an obtuse angle', false, 2);
    } }] },
    { num: '17', parts: [{ id: '17', level: 'PRG', make: function (r) {
      var z = pickWhere(function () { return { H: r.int(1, 11), M: 2 * r.int(1, 29) }; }, function (z) { var a = handAng(z.H, z.M); return z.M % 30 && a > 15 && !(z.H === 7 && z.M === 20) && Math.abs(a - Math.abs(30 * z.H - 6 * z.M)) > 0.9; });
      var a = handAng(z.H, z.M), fixd = Math.abs(30 * z.H - 6 * z.M);
      return intP('<b>Numerical response.</b> To the nearest degree, the smaller angle between the hands of a clock at ' + z.H + ':' + (z.M < 10 ? '0' : '') + z.M + ' is ____°.', a, { unit: '°', nr: true, cands: [[fixd > 180 ? 360 - fixd : fixd, LID + '-hour-fixed', 'The hour hand moves too: ' + t('0.5^\\circ') + ' each minute past the hour (' + t(z.M + '(0.5^\\circ)=' + D(z.M / 2)) + ' here).'], [360 - a, LID + '-reflex', 'Give the <b>smaller</b> angle between the hands (at most ' + t('180^\\circ') + ').']],
        sol: clockSolAng(z.H, z.M) + clockFig(z.H, z.M, 'long', 'short'), hints: ['Minute hand: ' + t('6^\\circ') + ' per minute. Hour hand: ' + t('30^\\circ') + ' per hour plus ' + t('0.5^\\circ') + ' per minute.'], text: 'NR: angle between clock hands', v: { k: 'clockang', H: z.H, M: z.M } });
    } }] },
    { num: '18', parts: [{ id: '18', level: 'PRG', make: function (r) {
      var z = pickWhere(function () { var b1 = r.int(0, 120), dl = r.int(60, 150); return { b1: b1, b2: b1 + dl, v1: r.int(7, 12) / 2, v2: r.int(7, 12) / 2, h: r.pick([1.5, 2, 2.5, 3]) }; }, function (z) { var d = clSide(z.v1 * z.h, z.v2 * z.h, z.b2 - z.b1); return z.v1 !== z.v2 && d < 99 && safeR(d, 1) && !(z.b1 === 20 && z.b2 === 130); });
      var d1 = z.v1 * z.h, d2 = z.v2 * z.h, A = z.b2 - z.b1, d = clSide(d1, d2, A);
      return nP('<b>Numerical response.</b> Two hikers leave camp at the same time. One walks on a bearing of ' + t(bearTex(z.b1)) + ' at ' + t(nT(z.v1)) + ' km/h and the other on a bearing of ' + t(bearTex(z.b2)) + ' at ' + t(nT(z.v2)) + ' km/h. To the nearest tenth of a kilometre, their distance apart after ' + nT(z.h) + ' hours is ____ km.', d, 1, { nr: true, unit: 'km',
        alts: clAlts(d1, d2, A, 'd').concat([{ v: clSide(z.v1, z.v2, A), code: LID + '-dist-time', hint: 'Use the distances walked (speed × time), not the speeds.' }, { v: clSide(d1, d2, 180 - A), code: LID + '-turn-heading', hint: 'The angle between the paths at camp is the difference of the bearings: ' + t(bearTex(z.b2) + '-' + bearTex(z.b1) + '=' + D(A)) + '.' }]),
        sol: 'Distances: ' + t(nT(z.v1) + '(' + nT(z.h) + ')=' + nT(d1)) + ' km and ' + t(nT(z.v2) + '(' + nT(z.h) + ')=' + nT(d2)) + ' km; angle ' + t(bearTex(z.b2) + '-' + bearTex(z.b1) + '=' + D(A)) + '.<br>' + t(clTex('d', d1, d2, A, d)) + ' km', hints: ['Distance = speed × time. The angle at camp is the difference of the bearings.'], text: 'NR: hikers apart', v: { k: 'hike', d1: d1, d2: d2, A: A } });
    } }] }
  ];
  function sssAreaP(r, unit, avoid, text) {
    var z = pickWhere(function () { var s = [r.int(5, 14), r.int(5, 14), r.int(6, 18)].sort(function (a, b) { return a - b; }); return { a: s[0], b: s[1], c: s[2] }; }, function (z) { return z.a + z.b > z.c + 1 && z.a !== z.b && z.b !== z.c && z.a * z.a + z.b * z.b !== z.c * z.c && !avoid.some(function (v) { return v[0] === z.a && v[1] === z.b && v[2] === z.c; }) && safeR(0.5 * z.a * z.b * sn(clAng(z.c, z.a, z.b)), 1); });
    var th = clAng(z.c, z.a, z.b), A = 0.5 * z.a * z.b * sn(th), num = z.a * z.a + z.b * z.b - z.c * z.c, u = unit;
    return nP('A triangle with sides ' + t(z.a) + ' ' + u + ', ' + t(z.b) + ' ' + u + ' and ' + t(z.c) + ' ' + u + '.', A, 1, { after: t('\\text{' + u + '}^2'), acc: [0.5 * z.a * z.b * sn(rd(th, 1))], alts: [{ v: z.a * z.b * sn(th), code: LID + '-area-half', hint: 'Don’t forget the ' + t('\\frac{1}{2}') + ' in ' + t('\\frac{1}{2}ab\\sin C') + '.' }, { v: 0.5 * z.a * z.b * Math.abs(cs(th)), code: LID + '-area-cos', hint: 'Find the angle with the cosine law, then use ' + t('\\frac{1}{2}ab\\sin\\theta') + ' (sine, not cosine).' }, { v: 0.5 * z.a * z.c * sn(th), code: LID + '-sss-angle', hint: 'Use the two sides that make the angle: the angle opposite ' + t(z.c) + ' is between ' + t(z.a) + ' and ' + t(z.b) + '.' }],
      sol: 'Angle ' + t('\\theta') + ' opposite ' + t(z.c) + ' (SSS): ' + t('\\cos\\theta=\\dfrac{' + z.a + '^2+' + z.b + '^2-' + z.c + '^2}{2(' + z.a + ')(' + z.b + ')}=\\dfrac{' + num + '}{' + 2 * z.a * z.b + '},\\ \\theta\\approx ' + Dx(th, 1)) + '<br>Area ' + t('=\\frac{1}{2}(' + z.a + ')(' + z.b + ')\\sin ' + Dx(th, 1) + '\\approx ' + fx(A, 1)) + ' ' + u + '²',
      hints: ['First find one angle with the cosine law (SSS).', 'Then ' + t('\\text{Area}=\\frac{1}{2}ab\\sin\\theta') + ' with the two sides that make that angle.'], text: text, v: { k: 'sss-area', a: z.a, b: z.b, c: z.c } });
  }

  /* ======================= Extra Practice 8 ======================= */
  var EXTRA = [
    { num: '1', section: 'A. Skills', stem: 'Name the most appropriate method to find the unknown, and justify it. Do not solve.', parts: [
      { id: 'e1a', level: 'BEG', make: function (r) { return methodP(r, 'sas', 'method: SAS'); } },
      { id: 'e1b', level: 'BEG', make: function (r) { return methodP(r, 'asa', 'method: third angle, then sine law'); } },
      { id: 'e1c', level: 'BEG', make: function (r) { return methodP(r, r.pick(['right-legs', 'right-side']), 'method: right triangle'); } },
      { id: 'e1d', level: 'BEG', make: function (r) { return methodP(r, 'sss', 'method: SSS'); } }] },
    { num: '2', stem: 'Write each bearing in the other form.', parts: [
      { id: 'e2a', level: 'BEG', make: function (r) { var b = pickWhere(function () { return r.int(4, 86); }, function (b) { return [75, 35, 65, 45].indexOf(b) < 0; }); return dirP('Bearing ' + t(bearTex(b)), b, { text: 'bearing to direction: NE' }); } },
      { id: 'e2b', level: 'EMG', make: function (r) { var b = pickWhere(function () { return r.int(184, 266); }, function (b) { return [200, 215, 250, 225].indexOf(b) < 0; }); return dirP('Bearing ' + t(bearTex(b)), b, { text: 'bearing to direction: SW' }); } },
      { id: 'e2c', level: 'EMG', make: function (r) { var d = { ns: 'S', k: pickWhere(function () { return r.int(5, 85); }, function (k) { return [50, 25, 40, 45].indexOf(k) < 0; }), ew: 'E' }; return bearNumP('Direction ' + t(dirTex(d)), d, { text: 'direction to bearing: S…E' }); } },
      { id: 'e2d', level: 'EMG', make: function (r) { var d = { ns: 'N', k: pickWhere(function () { return r.int(5, 85); }, function (k) { return [35, 15, 20, 45].indexOf(k) < 0; }), ew: 'W' }; return bearNumP('Direction ' + t(dirTex(d)), d, { text: 'direction to bearing: N…W' }); } },
      { id: 'e2e', level: 'EMG', make: function (r) { var b = pickWhere(function () { return r.int(185, 355); }, function (b) { return b % 90 && b !== 300; }); return backP(t('Q') + ' is on a bearing of ' + t(bearTex(b)) + ' from ' + t('P') + '. Find the bearing of ' + t('P') + ' from ' + t('Q') + '.', b); } }] },
    { num: '3', stem: 'Find each area, to the nearest tenth.', parts: [
      { id: 'e3a', level: 'EMG', make: function (r) {
        var z = pickWhere(function () { return { a: r.int(5, 18), b: r.int(6, 20), C: r.int(30, 85) }; }, function (z) { return z.a !== z.b && safeR(0.5 * z.a * z.b * sn(z.C), 1) && !(z.a === 9 && z.b === 13); }), A = 0.5 * z.a * z.b * sn(z.C);
        return nP('Sides ' + t(z.a) + ' cm and ' + t(z.b) + ' cm with a contained angle of ' + t(D(z.C)) + '.', A, 1, { after: t('\\text{cm}^2'), alts: [{ v: 2 * A, code: LID + '-area-half', hint: 'Don’t forget the ' + t('\\frac{1}{2}') + '.' }, { v: 0.5 * z.a * z.b * cs(z.C), code: LID + '-area-cos', hint: 'Use sine: ' + t('\\frac{1}{2}ab\\sin C') + '.' }], sol: t('\\frac{1}{2}(' + z.a + ')(' + z.b + ')\\sin ' + D(z.C) + '\\approx ' + fx(A, 1)) + ' cm²', hints: [t('\\text{Area}=\\frac{1}{2}ab\\sin C') + '.'], text: 'area: SAS', v: { k: 'sas-area', a: z.a, b: z.b, C: z.C } });
      } },
      { id: 'e3b', level: 'PRG', make: function (r) { return sssAreaP(r, 'm', [[6, 8, 11], [7, 9, 12], [8, 10, 13]], 'area: SSS'); } },
      { id: 'e3c', level: 'EMG', make: function (r) {
        var s = pickWhere(function () { return r.int(4, 20); }, function (s) { return s !== 10 && safeR(0.25 * Math.sqrt(3) * s * s, 1); }), A = 0.5 * s * s * sn(60);
        return nP('An equilateral triangle with sides ' + t(s) + ' cm.', A, 1, { after: t('\\text{cm}^2'), alts: [{ v: s * s * sn(60), code: LID + '-area-half', hint: 'Don’t forget the ' + t('\\frac{1}{2}') + '.' }, { v: 0.5 * s * s, code: LID + '-area-cos', hint: 'Each angle of an equilateral triangle is ' + t('60^\\circ') + ': ' + t('\\frac{1}{2}s^2\\sin 60^\\circ') + '.' }, { v: 0.5 * s * s * cs(60), code: LID + '-area-cos', hint: 'Use sine: ' + t('\\frac{1}{2}ab\\sin C') + '.' }], sol: 'Every angle is ' + t('60^\\circ') + ': ' + t('\\frac{1}{2}(' + s + ')(' + s + ')\\sin 60^\\circ\\approx ' + fx(A, 1)) + ' cm²', hints: ['What is each angle of an equilateral triangle?'], text: 'area: equilateral', v: { k: 'sas-area', a: s, b: s, C: 60 } });
      } }] },
    { num: '4', parts: [{ id: 'e4', level: 'PRG', make: function (r) {
      var z = pickWhere(function () { return { m: r.int(8, 16), hl: r.int(4, 11), H1: r.pick([1, 2, 4, 5, 7, 8, 10, 11]), H2: r.pick([1, 2, 4, 5, 7, 8, 9, 10, 11]) }; }, function (z) { return z.hl <= z.m - 3 && z.H1 !== 11 && !(z.H2 === 3) && z.H1 !== z.H2 && !(z.m === 10 && z.hl === 7) && !(z.H2 === 2 || z.H2 === 4); });
      var A1 = handAng(z.H1, 0), A2 = handAng(z.H2, 30), d = clSide(z.m, z.hl, A2), Af = Math.abs(30 * z.H2 - 180);
      return fP('A clock’s minute hand is ' + t(z.m) + ' cm long and its hour hand is ' + t(z.hl) + ' cm long. Find the angle between the hands at ' + z.H1 + ':00 and at ' + z.H2 + ':30, and the distance between the tips at ' + z.H2 + ':30 (nearest tenth).', [
        { label: z.H1 + ':00 angle:', name: z.H1 + ':00 angle', kind: 'int', x: A1, unit: '°', cands: [[360 - A1, LID + '-reflex', 'Use the smaller angle.'], [30 * z.H1, LID + '-reflex', 'Use the smaller angle between the hands.']] },
        { label: z.H2 + ':30 angle:', name: z.H2 + ':30 angle', kind: 'int', x: A2, unit: '°', cands: [[Af > 180 ? 360 - Af : Af, LID + '-hour-fixed', 'At the half hour the hour hand is halfway to the next number: ' + t('15^\\circ') + ' past the ' + z.H2 + '.'], [360 - A2, LID + '-reflex', 'Use the smaller angle.']] },
        { label: z.H2 + ':30 distance:', name: 'Distance', kind: 'near', x: d, dp: 1, unit: 'cm', alts: clAlts(z.m, z.hl, A2, 'd') }],
        { sol: clockSolAng(z.H1, 0) + '<br>' + clockSolAng(z.H2, 30) + '<br>' + t(clTex('d', z.m, z.hl, A2, d)) + ' cm' + clockFig(z.H2, 30, z.m + ' cm', z.hl + ' cm'), hints: ['Marks are ' + t('30^\\circ') + ' apart; at the half hour the hour hand is halfway between two marks.'], text: 'clock: angles and distance', v: { k: 'clock', m: z.m, hl: z.hl, H: z.H2, M: 30 } });
    } }] },
    { num: '5', section: 'B. Applying', shared: function (r) { return legsGen(r, { T: [45, 110], d1: function () { return r.int(20, 60) / 10; }, d2: function () { return r.int(20, 60) / 10; }, dp: 1, avoid: [[3.2, 140, 4.5, 250]] }); },
      stem: function (z) { return 'A hiker walks ' + t(nT(z.d1)) + ' km on a bearing of ' + t(bearTex(z.b1)) + ' from camp ' + t('P') + ' to ' + t('Q') + ', then ' + t(nT(z.d2)) + ' km on a bearing of ' + t(bearTex(z.b2)) + ' to ' + t('R') + '.'; }, parts: [
      { id: 'e5a', level: 'ADV', make: function (r, z) { return legsDistP('Find the distance from ' + t('R') + ' back to camp, to the nearest tenth of a km.', z, 'km', 1, { text: 'bearings: distance back' }); } },
      { id: 'e5b', level: 'MAS', make: function (r, z) { return legsRetP('Find the bearing (nearest degree) from ' + t('R') + ' back to camp.', z, 'km', { text: 'bearings: return bearing' }); } }] },
    { num: '6', parts: [{ id: 'e6', level: 'ADV', make: function (r) {
      var z = pickWhere(function () { var al = r.int(12, 26); return { al: al, be: al + r.int(8, 20), d: 10 * r.int(8, 25) }; }, function (z) { var hgt = z.d * sn(z.al) * sn(z.be) / sn(z.be - z.al); return z.be < 60 && safeR(hgt, 0) && !(z.al === 18 && z.be === 31 && z.d === 150); });
      var top = z.be - z.al, s2 = z.d * sn(z.al) / sn(top), hgt = s2 * sn(z.be);
      return nP('A boat at sea sees the top of a cliff at an angle of elevation of ' + t(D(z.al)) + '. After the boat moves ' + t(z.d) + ' m straight toward the cliff, the angle of elevation is ' + t(D(z.be)) + '. Find the height of the cliff, to the nearest metre.', hgt, 0, { unit: 'm', acc: [rd(s2, 1) * sn(z.be)],
        alts: [{ v: s2, code: LID + '-not-height', hint: 'That is the line of sight from the second position. The height is the vertical side of the right triangle.' }, { v: s2 * cs(z.be), code: LID + '-alt-cos', hint: 'The height is <b>opposite</b> the ' + t(D(z.be)) + ' angle.' }, { v: z.d * sn(z.al) / sn(z.al + z.be) * sn(z.be), code: LID + '-elev', hint: 'The angle at the top of the cliff is ' + t(D(z.be) + '-' + D(z.al) + '=' + D(top)) + ' (the angle at the second position is ' + t('180^\\circ-' + D(z.be)) + ').' }, { v: s2 * sn(z.al), code: LID + '-wrong-pair', hint: 'Use the right triangle at the second position, with the ' + t(D(z.be)) + ' angle.' }],
        sol: 'In the oblique triangle: angles ' + t(D(z.al)) + ', ' + t('180^\\circ-' + D(z.be) + '=' + D(180 - z.be)) + ', and ' + t(D(z.be) + '-' + D(z.al) + '=' + D(top)) + ' at the top.<br>Distance from the second position to the top: ' + t('\\dfrac{' + z.d + '\\sin ' + D(z.al) + '}{\\sin ' + D(top) + '}\\approx ' + fx(s2, 1)) + ' m. Height ' + t('\\approx ' + fx(s2, 1) + '\\sin ' + D(z.be) + '\\approx ' + fx(hgt, 0)) + ' m.' +
          fig(HW.fig({ pts: { A: [0, 0], B: [z.d, 0], F: [z.d + s2 * cs(z.be), 0], T: [z.d + s2 * cs(z.be), hgt] }, segs: [['A', 'B', z.d + ' m'], ['B', 'F'], ['F', 'T', 'h', { width: 3 }], ['A', 'T'], ['B', 'T']], names: { A: 'A', B: 'B', F: '', T: 'T' }, right: [['F', 'B', 'T']], angles: [['A', 'B', 'T', z.al + '°'], ['B', 'F', 'T', z.be + '°']], width: 280, aria: 'two sightings of a cliff top, to scale' })),
        hints: ['In the triangle with the two positions and the top: the angle at the nearer position is ' + t('180^\\circ-' + D(z.be)) + ', so the angle at the top is ' + t(D(z.be) + '-' + D(z.al)) + '.', 'Sine law for the line of sight from the nearer position, then SOH for the height.'], text: 'cliff: two angles of elevation', v: { k: 'cliff', al: z.al, be: z.be, d: z.d } });
    } }] },
    { num: '7', parts: [{ id: 'e7', level: 'PRG', make: function (r) {
      var z = pickWhere(function () { return { R: r.int(5, 15), g: r.int(18, 75) }; }, function (z) { return safeR(2 * z.R * sn(z.g), 1) && !(z.R === 12 && z.g === 35); });
      var c = 2 * z.g, AB = clSide(z.R, z.R, c), A = [-z.R * sn(z.g), -z.R * cs(z.g)], Bp = [z.R * sn(z.g), -z.R * cs(z.g)];
      return fP('Points ' + t('A') + ', ' + t('B') + ' and ' + t('C') + ' lie on a circle with centre ' + t('O') + ' and radius ' + t(z.R) + ' cm, and ' + t('\\angle ACB=' + D(z.g)) + ' (' + t('C') + ' on the major arc). Find ' + t('\\angle AOB') + ' and the length of chord ' + t('AB') + ', to the nearest tenth.', [
        { label: t('\\angle AOB='), name: t('\\angle AOB'), kind: 'int', x: c, unit: '°', cands: [[z.g / 2, LID + '-inscribed', 'The <b>central</b> angle is <b>twice</b> the inscribed angle on the same arc.'], [z.g, LID + '-inscribed', 'The central angle is twice the inscribed angle.'], [180 - z.g, LID + '-inscribed', 'Central angle ' + t('=2\\times') + ' inscribed angle.']] },
        { label: t('AB='), name: t('AB'), kind: 'near', x: AB, dp: 1, unit: 'cm', alts: clAlts(z.R, z.R, c, 'AB').concat([{ v: clSide(z.R, z.R, z.g), code: LID + '-inscribed', hint: 'In ' + t('\\triangle AOB') + ' the angle between the radii is the central angle ' + t(D(c)) + '.' }]) }],
        { sol: 'Central angle ' + t('=2\\times ' + D(z.g) + '=' + D(c)) + '. ' + t(clTex('AB', z.R, z.R, c, AB)) + ' cm' + circFig(z.R, { O: [0, 0], A: A, B: Bp, C: [z.R * sn(160), -z.R * cs(160)] }, [['O', 'A'], ['O', 'B'], ['A', 'B'], ['A', 'C', { color: '#2b55a0' }], ['B', 'C', { color: '#2b55a0' }]], { aria: 'circle with central and inscribed angles' }),
          hints: ['The central angle is twice the inscribed angle on the same arc.', 'Two radii and the central angle: SAS, cosine law.'], text: 'circle: central angle and chord', v: { k: 'insc', R: z.R, g: z.g } });
    } }] },
    { num: '8', shared: function (r) {
      return pickWhere(function () { return { wx: 5 * r.int(10, 20), xy: 5 * r.int(8, 18), X: r.int(95, 135), a1: r.int(25, 50), a2: r.int(45, 75) }; }, function (z) { var WY = clSide(z.wx, z.xy, z.X), Zz = 180 - z.a1 - z.a2, WZ = WY * sn(z.a2) / sn(Zz), YZ = WY * sn(z.a1) / sn(Zz), Ar = 0.5 * z.wx * z.xy * sn(z.X) + 0.5 * WY * WZ * sn(z.a1); return Zz >= 40 && safeR(WY, 0) && safeR(WZ, 0) && safeR(YZ, 0) && safeR(Ar, -1) && z.wx !== z.xy && !(z.wx === 85 && z.xy === 60); });
    }, stem: function (z) {
      var WY = clSide(z.wx, z.xy, z.X), Zz = 180 - z.a1 - z.a2, WZ = WY * sn(z.a2) / sn(Zz), Y0 = asn(z.wx * sn(z.X) / WY);
      var Wp = [0, 0], Yp = [WY, 0], Xp = [WY - z.xy * cs(Y0), -z.xy * sn(Y0)], Zp = [WZ * cs(z.a1), WZ * sn(z.a1)];
      return 'A field ' + t('WXYZ') + ' is split by the diagonal ' + t('WY') + '. ' + t('WX=' + z.wx) + ' m, ' + t('XY=' + z.xy) + ' m, ' + t('\\angle WXY=' + D(z.X)) + ', ' + t('\\angle YWZ=' + D(z.a1)) + ' and ' + t('\\angle WYZ=' + D(z.a2)) + '.' +
        fig(HW.fig({ pts: { W: Wp, X: Xp, Y: Yp, Z: Zp }, segs: [['W', 'X', z.wx + ' m'], ['X', 'Y', z.xy + ' m'], ['Y', 'Z'], ['Z', 'W'], ['W', 'Y', '', { dash: true }]], angles: [['X', 'W', 'Y', z.X + '°'], ['W', 'Y', 'Z', z.a1 + '°'], ['Y', 'W', 'Z', z.a2 + '°']], width: 270, height: 250, aria: 'field WXYZ with diagonal WY, to scale' }));
    }, parts: [
      { id: 'e8a', level: 'ADV', make: function (r, z) {
        var WY = clSide(z.wx, z.xy, z.X), Zz = 180 - z.a1 - z.a2, WZ = WY * sn(z.a2) / sn(Zz), YZ = WY * sn(z.a1) / sn(Zz), w1 = rd(WY, 1);
        return fP('Find ' + t('WY') + ', ' + t('WZ') + ' and ' + t('YZ') + ' to the nearest metre.', [
          { label: t('WY='), name: t('WY'), kind: 'near', x: WY, dp: 0, unit: 'm', alts: clAlts(z.wx, z.xy, z.X, 'WY') },
          { label: t('WZ='), name: t('WZ'), kind: 'near', x: WZ, dp: 0, unit: 'm', acc: [w1 * sn(z.a2) / sn(Zz), rd(WY, 0) * sn(z.a2) / sn(Zz)], alts: [{ v: YZ, code: LID + '-wrong-pair', hint: t('WZ') + ' is opposite ' + t('\\angle WYZ') + '.' }, { v: WY * sn(z.a2) / sn(z.a1), code: LID + '-third-angle', hint: 'Find ' + t('\\angle Z') + ' first: it is opposite the known side ' + t('WY') + '.' }] },
          { label: t('YZ='), name: t('YZ'), kind: 'near', x: YZ, dp: 0, unit: 'm', acc: [w1 * sn(z.a1) / sn(Zz), rd(WY, 0) * sn(z.a1) / sn(Zz)], alts: [{ v: WZ, code: LID + '-wrong-pair', hint: t('YZ') + ' is opposite ' + t('\\angle YWZ') + '.' }] }],
          { sol: t('WY^2=' + z.wx + '^2+' + z.xy + '^2-2(' + z.wx + ')(' + z.xy + ')\\cos ' + D(z.X) + '\\approx ' + fx(WY * WY, 0) + ',\\ WY\\approx ' + fx(WY, 0)) + ' m<br>' + t('\\angle Z=180^\\circ-' + D(z.a1) + '-' + D(z.a2) + '=' + D(Zz)) + ': ' + t('WZ=\\dfrac{' + fx(WY, 1) + '\\sin ' + D(z.a2) + '}{\\sin ' + D(Zz) + '}\\approx ' + fx(WZ, 0)) + ' m, ' + t('YZ=\\dfrac{' + fx(WY, 1) + '\\sin ' + D(z.a1) + '}{\\sin ' + D(Zz) + '}\\approx ' + fx(YZ, 0)) + ' m',
            hints: ['SAS in ' + t('\\triangle WXY') + ' for the diagonal; then the third angle of ' + t('\\triangle WYZ') + ' and the sine law.'], text: 'field: sides', v: { k: 'field', z: z } });
      } },
      { id: 'e8b', level: 'MAS', make: function (r, z) {
        var WY = clSide(z.wx, z.xy, z.X), Zz = 180 - z.a1 - z.a2, WZ = WY * sn(z.a2) / sn(Zz), A1 = 0.5 * z.wx * z.xy * sn(z.X), A2 = 0.5 * WY * WZ * sn(z.a1), w1 = rd(WY, 1);
        return nP('Find the area of the field, to the nearest ' + t('10') + ' m².', A1 + A2, -1, { after: t('\\text{m}^2'), acc: [A1 + 0.5 * w1 * rd(w1 * sn(z.a2) / sn(Zz), 1) * sn(z.a1), A1 + 0.5 * rd(WY, 0) * rd(WZ, 0) * sn(z.a1)],
          alts: [{ v: A1, code: LID + '-area-one', hint: 'That is ' + t('\\triangle WXY') + ' only. Add ' + t('\\triangle WYZ') + '.' }, { v: A2, code: LID + '-area-one', hint: 'That is ' + t('\\triangle WYZ') + ' only. Add ' + t('\\triangle WXY') + '.' }, { v: 2 * (A1 + A2), code: LID + '-area-half', hint: 'Don’t forget the ' + t('\\frac{1}{2}') + '.' }],
          sol: 'Area ' + t('=\\frac{1}{2}(' + z.wx + ')(' + z.xy + ')\\sin ' + D(z.X) + '+\\frac{1}{2}(' + fx(WY, 1) + ')(' + fx(WZ, 1) + ')\\sin ' + D(z.a1) + '\\approx ' + fx(A1, 1) + '+' + fx(A2, 1) + '\\approx ' + fx(A1 + A2, -1)) + ' m²',
          hints: ['Add the areas of the two triangles, each ' + t('\\frac{1}{2}ab\\sin C') + ' with the angle between the two sides.'], text: 'field: area', v: { k: 'field', z: z } });
      } }] },
    { num: '9', parts: [{ id: 'e9', level: 'EMG', make: function (r) {
      var d = pickWhere(function () { return { ns: r.pick(['S', 'S', 'N']), k: r.int(8, 80), ew: 'W' }; }, function (d) { return d.k % 5 === 0 && d.k !== 45 && !(d.ns === 'S' && d.k === 20); });
      if (r.chance(0.3)) d.ew = 'E';
      var b = dirBear(d), opts = uniqBy([b, d.k, md(180 - d.k), md(180 + d.k), md(270 - d.k), md(360 - d.k), md(90 + d.k)], function (x) { return x; }).filter(function (x) { return x !== b; });
      var pick = r.shuffle(opts).slice(0, 3);
      return mcP(r, 'A direction of ' + t(dirTex(d)) + ' is the same as a bearing of', [{ html: t(bearTex(b)), right: true }].concat(pick.map(function (x) { return { html: t(bearTex(x)), why: 'Face ' + (d.ns === 'N' ? 'north (' + t('000^\\circ') + ')' : 'south (' + t('180^\\circ') + ')') + ' and turn ' + t(D(d.k)) + ' toward ' + (d.ew === 'E' ? 'east' : 'west') + '. Bearings go clockwise from north.' }; })),
        'Face ' + (d.ns === 'N' ? 'north' : 'south') + ' and turn ' + t(D(d.k)) + ' toward ' + (d.ew === 'E' ? 'east' : 'west') + ': ' + t(d.ns === 'N' ? (d.ew === 'E' ? bearTex(b) : '360^\\circ-' + D(d.k) + '=' + bearTex(b)) : (d.ew === 'E' ? '180^\\circ-' + D(d.k) + '=' + bearTex(b) : '180^\\circ+' + D(d.k) + '=' + bearTex(b))) + '.', ['Bearings: clockwise from north, three digits.'], 'MC: direction as a bearing', false, 2);
    } }] },
    { num: '10', parts: [{ id: 'e10', level: 'PRG', make: function (r) {
      var z = pickWhere(function () { return { b1: r.int(280, 345), b2: r.int(15, 80), v1: r.int(15, 35), v2: r.int(15, 35), mn: 5 * r.int(4, 10) }; }, function (z) { var A = 360 - z.b1 + z.b2, d = clSide(z.v1 * z.mn / 60, z.v2 * z.mn / 60, A); return A < 175 && z.v1 !== z.v2 && z.b1 % 5 === 0 && z.b2 % 5 === 0 && safeR(d, 0) && d < 99 && !(z.b1 === 310 && z.b2 === 45); });
      var h = z.mn / 60, d1 = z.v1 * h, d2 = z.v2 * h, A = 360 - z.b1 + z.b2, d = clSide(d1, d2, A);
      return nP('<b>Numerical response.</b> Two boats leave a dock at the same time, one on a bearing of ' + t(bearTex(z.b1)) + ' at ' + t(z.v1) + ' km/h and the other on a bearing of ' + t(bearTex(z.b2)) + ' at ' + t(z.v2) + ' km/h. To the nearest kilometre, their distance apart after ' + z.mn + ' minutes is ____ km.', d, 0, { nr: true, unit: 'km',
        alts: clAlts(d1, d2, A, 'd').concat([{ v: clSide(d1, d2, z.b1 - z.b2), code: LID + '-turn-heading', hint: 'The angle between the paths goes through north: ' + t('360^\\circ-' + bearTex(z.b1) + '+' + bearTex(z.b2) + '=' + D(A)) + '.' }, { v: clSide(z.v1 * z.mn, z.v2 * z.mn, A), code: LID + '-hours', hint: 'Change the minutes to hours first: ' + t(z.mn + '\\text{ min}=\\frac{' + z.mn + '}{60}\\text{ h}') + '.' }]),
        sol: 'Distances: ' + t(z.v1 + '\\times\\frac{' + z.mn + '}{60}\\approx ' + fx(d1, 2)) + ' km and ' + t(z.v2 + '\\times\\frac{' + z.mn + '}{60}\\approx ' + fx(d2, 2)) + ' km. Angle: ' + t('360^\\circ-' + bearTex(z.b1) + '+' + bearTex(z.b2) + '=' + D(A)) + '.<br>' + t('d^2=' + fx(d1, 2) + '^2+' + fx(d2, 2) + '^2-2(' + fx(d1, 2) + ')(' + fx(d2, 2) + ')\\cos ' + D(A) + '\\approx ' + fx(d * d, 1) + ',\\ d\\approx ' + fx(d, 0)) + ' km',
        hints: ['Distance = speed × time (in hours).', 'The angle between the two bearings goes past north.'], text: 'NR: boats apart', v: { k: 'hike', d1: d1, d2: d2, A: A } });
    } }] },
    { num: '11', section: 'C. Stretch', parts: [{ id: 'e11', level: 'MAS', make: function (r) {
      var z = pickWhere(function () { return { n: r.pick([5, 7, 8, 9, 10, 12]), R: r.int(4, 15) }; }, function (z) { var c = 360 / z.n, s = clSide(z.R, z.R, c), A = z.n * 0.5 * z.R * z.R * sn(c); return safeR(s, 1) && safeR(A, 1) && !(z.n === 5 && z.R === 10); });
      var nmz = { 5: 'pentagon', 7: 'heptagon', 8: 'octagon', 9: 'nonagon', 10: 'decagon', 12: 'dodecagon' }[z.n], c = 360 / z.n, s = clSide(z.R, z.R, c), A = z.n * 0.5 * z.R * z.R * sn(c);
      return fP('A regular ' + nmz + ' (' + z.n + ' sides) is drawn inside a circle of radius ' + t(z.R) + ' cm, with all its vertices on the circle. Find the side length and the area of the ' + nmz + ', to the nearest tenth.', [
        { label: 'Side:', name: 'Side length', kind: 'near', x: s, dp: 1, unit: 'cm', alts: clAlts(z.R, z.R, c, 's').concat([{ v: clSide(z.R, z.R, 180 - c), code: LID + '-inscribed', hint: 'The central angles are ' + t('360^\\circ\\div ' + z.n + '=' + D(rd(c, 4))) + '.' }]) },
        { label: 'Area:', name: 'Area', kind: 'near', x: A, dp: 1, after: t('\\text{cm}^2'), alts: [{ v: 0.5 * z.R * z.R * sn(c), code: LID + '-area-one', hint: 'That is one of the ' + z.n + ' triangles. Multiply by ' + z.n + '.' }, { v: 2 * A, code: LID + '-area-half', hint: 'Don’t forget the ' + t('\\frac{1}{2}') + '.' }] }],
        { sol: z.n + ' equal central angles of ' + t('360^\\circ\\div ' + z.n + '=' + (c % 1 ? Dx(c, 2) : D(c))) + '. Side: ' + t('s^2=' + z.R + '^2+' + z.R + '^2-2(' + z.R + ')(' + z.R + ')\\cos ' + (c % 1 ? Dx(c, 2) : D(c)) + '\\approx ' + fx(s * s, 2) + ',\\ s\\approx ' + fx(s, 1)) + ' cm<br>Area ' + t('=' + z.n + '\\times\\frac{1}{2}(' + z.R + ')(' + z.R + ')\\sin ' + (c % 1 ? Dx(c, 2) : D(c)) + '\\approx ' + fx(A, 1)) + ' cm²',
          hints: ['Join the centre to every vertex: ' + z.n + ' congruent isosceles triangles with central angle ' + t('\\dfrac{360^\\circ}{' + z.n + '}') + '.'], text: 'regular polygon in a circle', v: { k: 'poly', n: z.n, R: z.R } });
    } }] },
    { num: '12', parts: [{ id: 'e12', level: 'MAS', make: function (r) {
      var z = pickWhere(function () { var lam = r.int(10, 80), ang = r.int(25, 50), d = r.int(9, 18), h = d * sn(ang); return { lam: lam, be: lam + ang, ang: ang, d: d, v: r.int(10, 24), R: r.int(Math.ceil(h + 0.6), Math.max(Math.ceil(h + 0.6), d - 1)) }; }, function (z) { var S = ssa(z.ang, z.R, z.d); return z.R < z.d - 0.5 && S.n === 2 && S.sols[1].C >= 12 && safeR(S.sols[1].c / z.v * 60, 0) && safeR(S.sols[0].c / z.v * 60, 0) && safeR(S.h, 1) && !(z.lam === 40 && z.be === 80 && z.d === 12); });
      var S = ssa(z.ang, z.R, z.d), s1 = S.sols[0], s2 = S.sols[1], t1 = s2.c / z.v * 60, t2 = s1.c / z.v * 60;
      return fP('A ship at ' + t('P') + ' sails at ' + t(z.v) + ' km/h on a bearing of ' + t(bearTex(z.be)) + '. A lighthouse ' + t('L') + ' is ' + t(z.d) + ' km from ' + t('P') + ' on a bearing of ' + t(bearTex(z.lam)) + '. A sailor can see the lighthouse’s light from up to ' + t(z.R) + ' km away. After how many minutes does the light come into view, and after how many minutes is it lost? (Nearest minute.) What is the closest the ship comes to the lighthouse?', [
        { label: 'Comes into view after', name: 'Comes into view', kind: 'near', x: t1, dp: 0, unit: 'min', alts: [{ v: s2.c / z.v, code: LID + '-hours', hint: 'That is in hours. Multiply by ' + t('60') + ' for minutes.' }, { v: t2, code: LID + '-swap-tri', hint: 'The light comes into view at the <b>nearer</b> point (the one with the obtuse angle at the ship).' }, { v: s2.c, code: LID + '-dist-time', hint: 'That is the distance. Time = distance ÷ speed.' }] },
        { label: 'Lost after', name: 'Lost', kind: 'near', x: t2, dp: 0, unit: 'min', alts: [{ v: s1.c / z.v, code: LID + '-hours', hint: 'That is in hours. Multiply by ' + t('60') + '.' }, { v: s1.c, code: LID + '-dist-time', hint: 'Time = distance ÷ speed.' }] },
        { label: 'Closest distance', name: 'Closest distance', kind: 'near', x: S.h, dp: 1, unit: 'km', alts: [{ v: z.d * cs(z.ang), code: LID + '-closest', hint: 'The closest distance is the perpendicular from ' + t('L') + ' to the path: opposite the angle at ' + t('P') + ', so ' + t(z.d + '\\sin ' + D(z.ang)) + '.' }, { v: z.R, code: LID + '-closest', hint: 'The ship comes closer than the edge of the range: the closest distance is the perpendicular from ' + t('L') + '.' }] }],
        { sol: t('\\triangle PLS') + ' (' + t('S') + ' the ship at the edge of the range): ' + t('\\angle P=' + bearTex(z.be) + '-' + bearTex(z.lam) + '=' + D(z.ang)) + ', ' + t('LS=' + z.R) + ', ' + t('PL=' + z.d) + '. ' + t('h=' + z.d + '\\sin ' + D(z.ang) + '\\approx ' + fx(S.h, 1) + '<' + z.R + '<' + z.d) + ': two positions.<br>' +
          t('\\sin S=\\dfrac{' + z.d + '\\sin ' + D(z.ang) + '}{' + z.R + '}\\approx ' + fx(S.s, 4) + ',\\ S\\approx ' + Dx(s1.B, 1)) + ' or ' + t(Dx(s2.B, 1)) + '<br>' + t('S=' + Dx(s2.B, 1) + ':\\ \\angle L=' + Dx(s2.C, 1) + ',\\ PS=\\dfrac{' + z.R + '\\sin ' + Dx(s2.C, 1) + '}{\\sin ' + D(z.ang) + '}\\approx ' + fx(s2.c, 2)) + ' km ' + t('\\to\\dfrac{' + fx(s2.c, 2) + '}{' + z.v + '}') + ' h ' + t('\\approx ' + fx(t1, 0)) + ' min (comes into view)<br>' +
          t('S=' + Dx(s1.B, 1) + ':\\ \\angle L=' + Dx(s1.C, 1) + ',\\ PS\\approx ' + fx(s1.c, 2)) + ' km ' + t('\\to\\approx ' + fx(t2, 0)) + ' min (lost)<br>Closest distance ' + t('=h\\approx ' + fx(S.h, 1)) + ' km.',
          hints: ['The angle at ' + t('P') + ' is the difference of the bearings. The edge of the range is ' + t(z.R) + ' km from ' + t('L') + ': the ambiguous case gives two points on the path.', 'Time = distance ÷ speed (then × 60 for minutes). The closest point is the foot of the perpendicular from ' + t('L') + '.'], text: 'light in view: ambiguous case with times', v: { k: 'lightrange', ang: z.ang, R: z.R, d: z.d, v: z.v } });
    } }] }
  ];

  HW.defineLesson({ id: LID, unit: 3, num: '8', title: 'Choosing the Sine Law or the Cosine Law', outcome: 'T3', calc: true, questions: QUESTIONS, extra: EXTRA });
})(window);
