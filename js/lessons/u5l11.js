/* Math 20-1 · Unit 5 · Lesson 11 — Unit 5 Review (outcome per part: RF3 vertex form and transformations, RF4 general form,
 * completing the square and max/min, RF5 zeros, roots and quadratic equations)
 * Assignment 11 (m201book unit5/u5_l11.tex, Questions 1–28, a practice test written like the unit test) and the Lesson 11
 * Extra Practice, a second practice test (u5_ep11.tex: A. Multiple Choice 1–10, B. Numerical Response 11–14, C. Written
 * Response 15–19). Every part is a generator: the booklet question's idea, form and difficulty with new numbers (the
 * lesson's example numbers and the booklet question's own numbers are left out). Calculator allowed; answers exact where
 * the booklet asks (radicals in simplest form, fractions), rounded where it says so.
 * Outcomes follow the unit test's map (js/lessons/u5test.js): L1 zeros/roots, L7 formula, L8 discriminant and "given a
 * value, solve" questions are RF5; L2, L3, L5 (transformations, vertex form, an equation from the vertex) are RF3; L4,
 * L6, L9, L10 (general/factored form, completing the square, max/min) are RF4.
 *
 * Built from the Unit 5 kits, used only inside the generators (the test runners load files alphabetically, so this file
 * loads before u5l3/u5l9/u5test): HW.u5k34 (u5l3.js: fields, points, axis, max/min, ranges, x-intercepts, graphs,
 * multiple choice), HW.u5mm (u5l9.js: vertex-form checks with the completing-the-square slips, set notation with ends)
 * and HW.u5assess (u5test.js: rootsPart (exact roots in simplest form, rounded roots, "no real roots"), eqPart
 * (equations, vertex form required where asked)) — called with this file's own code prefix u5l11- (registered below).
 * Conversions: "describe the transformations" → multiple choice of descriptions; "sketch" → choose the graph (plus the
 * features asked); the table (4) → labelled boxes; "how are … related", "explain her error", "what does the P-intercept
 * mean", "will it fit", "why not 10 °C" → multiple choice of explanations; "name the method" (11) → in the worked
 * solution; "nature of the roots" for three equations → a grid; numerical response → a number box.
 * Bike rental (Extra 19): the booklet's numbers put the vertex at 2.5 price increases ($27.50); here the numbers are
 * chosen so the vertex lands on a whole number of $1 increases.
 * Levels: LIM BEG EMG PRG ADV MAS. Mastery: 12(d), 15, Extra 17(b). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, KP = K.P, ex = HW.ex, F = HW.fmt, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
  var LID = 'u5l11', CP = 'u5l11-';
  var RF3 = 'RF3', RF4 = 'RF4', RF5 = 'RF5';

  /* ---------------- codes (the u5assess builders' codes with this file's prefix, plus this file's own) ---------------- */
  var BASE = {
    'zero-sign': ['Zeros (or roots) with the signs reversed', 'b'], 'zero-recip': ['Zero of (mx − n): gave m/n instead of n/m', 'b'], 'zero-const': ['Gave a zero for a constant factor', 's'],
    'a-sign': ['Value of a with the wrong sign', 'b'], 'a-recip': ['Value of a upside down', 'b'],
    'vf-psign': ['Vertex form: sign of p wrong', 'b'], 'vf-qsign': ['Vertex form: sign of q wrong', 'b'], 'vf-refl': ['Left out the reflection (sign of a)', 'b'],
    'vf-a': ['Vertex right, wrong value of a', 'b'], 'vf-q': ['Wrong vertical translation / maximum or minimum value', 'b'], 'vf-order': ['Translated before stretching', 'b'],
    'map-pdir': ['Image of a point: moved the wrong way horizontally', 'b'], 'map-order': ['Image of a point: translated before stretching', 'b'], 'map-noa': ['Image of a point: y-coordinate not multiplied by a', 'b'],
    'vp-nosq': ['Finding a: did not square (x − p)', 'b'], 'range-dir': ['Range: inequality the wrong way', 'b'], 'range-p': ['Range: used the x-coordinate of the vertex', 'n'],
    'axis-sign': ['Axis: lost the negative sign in x = −b/(2a)', 'b'], 'axis-2a': ['Axis: x = −b/a (forgot the 2)', 'b'], 'axis-y': ['Wrote the axis as y = …', 's'], 'axis-dist': ['Axis: used the distance between the points', 'n'],
    'cts-a': ['Completing the square: subtracted square not multiplied by a', 'b'], 'cts-add': ['Completing the square: added the square instead of subtracting it', 'b'],
    'qf-negb': ['Quadratic formula: used b instead of −b', 'b'], 'qf-2a': ['Quadratic formula: divided by a instead of 2a', 'b'], 'qf-disc': ['Quadratic formula: sign slip in b² − 4ac', 'b'],
    'qf-std': ['Used the coefficients before writing the equation in standard form', 'b'], 'qf-diva': ['Square roots: did not divide by a first', 'b'],
    'disc-4': ['Discriminant: used b² − ac', 'b'], 'k-dir': ['Parameter: inequality the wrong way', 'b'], 'k-strict': ['Parameter: strict and non-strict inequality mixed up', 's'],
    'k-zero': ['Left out the leading coefficient ≠ 0', 's'], 'k-one': ['Gave only one value of k', 's'], 'rev-x': ['Gave the number of price changes instead of the price', 'b'],
    'fence-4': ['Fenced all four sides (or the wrong number of fences)', 'b'], 'gave-other': ['Gave the other side / root', 's'], 'neg-root': ['Kept the negative (inadmissible) root', 'b'],
    'nosol-claim': ['Said there are no real roots when there are', 'n'], 'none-roots': ['Gave roots when there are none', 'n'], 'round': ['Rounding slip', 's'],
    'yint-sq': ['y-intercept: squared after multiplying by a (or did not square)', 'b'], 'yint-q': ['y-intercept: gave q', 'n'], 'mm-p': ['Max/min value: gave the x-coordinate', 'b'],
    'arch-half': ['Arch: used the full span instead of half (or the reverse)', 'b'], 'nr-order': ['Numerical response: values in the wrong boxes', 's'],
    'ctx-time': ['Gave the x-coordinate (time, dozens, price change) instead of the value asked', 'b'], 'ctx-c': ['Gave the starting value (the y-intercept)', 'n'], 'set-zeros': ['Used the zeros instead of the given level', 'b'],
    'exact': ['Decimals instead of exact roots (format)', ''], 'surd': ['Radical not in simplest form (format)', ''], 'reduce': ['Fraction not reduced (format)', ''],
    'vf-form': ['Not in vertex form (format)', ''], 'vf-lhs': ['Equation not solved for y (format)', ''], 'axis-eq': ['Axis not written as an equation (format)', '']
  };
  (function () {
    var codes = {}, part = {};
    Object.keys(BASE).forEach(function (k) { codes[CP + k] = BASE[k][0]; if (BASE[k][1]) part[CP + k] = BASE[k][1]; });
    HW.addCodes(codes); HW.addPartial(part);
  })();

  /* ---------------- the kits, fetched the first time a generator runs ---------------- */
  var Z, M, A, P, FX;
  function kit() {
    if (Z) return;
    Z = HW.u5k34; M = HW.u5mm; A = HW.u5assess; P = HW.poly; FX = HW.factor;
    if (!Z || !M || !A || !P || !FX) { Z = null; throw new Error(LID + '.js needs u5l3.js (HW.u5k34), u5l9.js (HW.u5mm) and u5test.js (HW.u5assess)'); }
  }
  function mk(fn) { return function (r, s) { kit(); return fn(r, s); }; }

  /* ---------------- numbers and LaTeX ---------------- */
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var c = a % b; a = b; b = c; } return a; }
  function pickWhere(gen, test) { for (var i = 0; i < 20000; i++) { var o = gen(); if (o && test(o)) return o; } throw new Error(LID + ': no valid numbers'); }
  function nz(r, lo, hi) { return (r.chance(0.5) ? -1 : 1) * r.int(lo, hi); }
  function same(a, b) { return Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b)); }
  function isInt(x) { return Math.abs(x - Math.round(x)) < 1e-9; }
  function isSq(n) { if (n < 0) return false; var s = Math.round(Math.sqrt(n)); return s * s === n; }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function rT(x) { return Z.rT(x); }
  function sT(x) { return Z.sT(x, true); }
  function vfT(a, p, q, v) { return Z.vfTex(a, p, q, v || 'x', true); }
  function genT(a, b, c, v) { return Z.polyTex([a, b, c], v || 'x', true); }
  function decT(cs, v) { return Z.polyTex(cs, v || 'x', false); }
  function ptT(x, y) { return '(' + rT(x) + ',\\ ' + rT(y) + ')'; }
  function par(x) { return x < 0 ? '(' + rT(x) + ')' : rT(x); }
  function fx(x, dp) { return F(K.roundTo(x, dp).toFixed(dp)); }
  function units(n, w) { return t(String(Math.abs(n))) + ' unit' + (Math.abs(n) === 1 ? '' : 's') + ' ' + w; }
  function hW(p) { return units(p, p > 0 ? 'right' : 'left'); }
  function vW(q) { return units(q, q > 0 ? 'up' : 'down'); }
  function joinAnd(L) { return L.length > 2 ? L.slice(0, -1).join(', ') + ' and ' + L[L.length - 1] : L.join(' and '); }
  /* polynomials (HW.poly) from numbers (fractions found from floats) */
  function R(x) { if (Array.isArray(x)) return x; var f = Z.toFrac(x); if (!f) throw new Error(LID + ': not a fraction ' + x); return f; }
  function V(v) { var o = {}; o[v || 'x'] = 1; return P.mono(1, o); }
  function lin(m, n, v) { return P.add(P.scale(V(v), R(m)), P.num(R(n))); }
  function vfP(a, p, q) { return P.add(P.scale(P.pow(lin(1, -p), 2), R(a)), P.num(R(q))); }
  function genP(a, b, c) { return P.add(P.scale(P.pow(V(), 2), R(a)), P.scale(V(), R(b)), P.num(R(c))); }
  function stripY(chk) { return function (resp) { var s = String(resp == null ? '' : resp); var m = /^\s*(y|f\(x\)|f\\left\(x\\right\))\s*=\s*/.exec(s); return chk(m ? s.slice(m[0].length) : s); }; }
  /* square roots: √n = k√m */
  function sqf(n) { var k = ex.nthFactor(n, 2); return [k, n / (k * k)]; }
  /* exact roots of ax² + bx + c = 0 (discriminant > 0, not a perfect square) in simplest form */
  function qfR(a, b, c) {
    var D = b * b - 4 * a * c, s = sqf(D), Aa = -b, Bk = s[0], m = s[1], Dn = 2 * a;
    if (Dn < 0) { Aa = -Aa; Dn = -Dn; }
    var g = gcd(gcd(Aa, Bk), Dn); Aa /= g; Bk /= g; Dn /= g;
    var num = (Aa ? Aa + '\\pm ' : '\\pm ') + (Bk === 1 ? '' : Bk) + '\\sqrt{' + m + '}';
    return { tex: Dn === 1 ? num : '\\frac{' + num + '}{' + Dn + '}', vals: [(-b + Math.sqrt(D)) / (2 * a), (-b - Math.sqrt(D)) / (2 * a)], D: D, k: s[0], m: m, simp: s[0] > 1 || g > 1 };
  }
  function qfWrongs(a, b, c) {
    var D = b * b - 4 * a * c, s = Math.sqrt(D), w = [];
    w.push({ vals: [(b + s) / (2 * a), (b - s) / (2 * a)], code: CP + 'qf-negb', hint: 'The formula starts with ' + t('-b') + ': here ' + t('-b=' + (-b)) + '.' });
    w.push({ vals: [(-b + s) / a, (-b - s) / a], code: CP + 'qf-2a', hint: 'Divide by ' + t('2a=' + 2 * a) + ', not by ' + t('a') + '.' });
    var D2 = b * b + 4 * a * c; if (D2 >= 0 && D2 !== D) w.push({ vals: [(-b + Math.sqrt(D2)) / (2 * a), (-b - Math.sqrt(D2)) / (2 * a)], code: CP + 'qf-disc', hint: 'Check the sign of ' + t('-4ac=-4(' + a + ')(' + c + ')=' + (-4 * a * c)) + '.' });
    return w;
  }
  function qfSol(a, b, c, pre) {
    var Q = qfR(a, b, c), sp = sqf(Q.D);
    return (pre || '') + 'Formula (' + t('a=' + a + ',\\ b=' + b + ',\\ c=' + c) + '): ' + t('x=\\frac{' + (-b) + '\\pm\\sqrt{' + par(b) + '^{2}-4(' + a + ')(' + c + ')}}{2(' + a + ')}=\\frac{' + (-b) + '\\pm\\sqrt{' + Q.D + '}}{' + 2 * a + '}') +
      (sp[0] > 1 ? ' and ' + t('\\sqrt{' + Q.D + '}=' + sp[0] + '\\sqrt{' + sp[1] + '}') : '') + '.<br>' + t('x=' + Q.tex);
  }
  /* factored-form answers y = a(x − r)(x − s) */
  function facPart(prompt, list, wrongs, sol, hints, text) {
    var target = FX.product(list), seen = [target], W = [];
    (wrongs || []).forEach(function (w) { var pp = FX.product(w.is); if (seen.some(function (s) { return P.eq(s, pp); })) return; seen.push(pp); W.push(w); });
    var p = KP.factored(prompt, list, { wrong: W, before: 'y=' }, sol, hints, text);
    p.check = stripY(p.check); p.answer = t('y=' + p.key);
    p.bad = W.map(function (w) { return FX.tex(w.is); });
    return p;
  }
  /* the axis of symmetry x = h (general form slips as candidates) */
  function axisCheck(h, cands) {
    return function (resp) {
      var s = String(resp == null ? '' : resp).replace(/\\left|\\right/g, '').trim();
      if (!s) return form('empty', 'Type your answer first.');
      var m = /^([a-zA-Z])\s*=\s*(.+)$/.exec(s), body = m ? m[2] : s;
      if (m && m[1] === 'y') return wrong(CP + 'axis-y', 'The axis of symmetry is a <b>vertical</b> line through the vertex: ' + t('x=\\ldots') + '.');
      var a = K.read(body); if (a.res) return a.res;
      if (Object.keys(ex.shape(a.ast).vars).length || !isFinite(a.val)) return form('unreadable', 'Write the axis as an equation, e.g. ' + t('x=3') + '.');
      if (same(a.val, h)) return m ? ok() : form(CP + 'axis-eq', 'Right value — write the axis as an equation: ' + t('x=' + rT(h)) + '.');
      for (var i = 0; i < (cands || []).length; i++) if (!same(cands[i][0], h) && same(a.val, cands[i][0])) return wrong(cands[i][1], cands[i][2]);
      return wrong('value', null);
    };
  }
  function axisSpec(label, h, cands) { return { label: label, name: 'Axis of symmetry', check: axisCheck(h, cands), key: 'x=' + rT(h), ansTex: 'x=' + rT(h), math: true, placeholder: 'e.g. x = 3' }; }
  function genAxisCands(a, b) { return [[b / (2 * a), CP + 'axis-sign', 'The axis is ' + t('x=-\\frac{b}{2a}') + ': keep the negative sign.'], [-b / a, CP + 'axis-2a', 'The axis is ' + t('x=-\\frac{b}{2a}') + ': divide by ' + t('2a') + ', not ' + t('a') + '.']]; }
  /* the classic completing-the-square slips, as candidate functions for an expression box */
  function ctsCands(a, b, c) {
    var p = -b / (2 * a), h = b / (2 * a), out = [];
    var f = function (A2, P2, Q2) { return function (x) { return A2 * (x - P2) * (x - P2) + Q2; }; };
    if (!same(a, 1)) out.push([f(a, p, c - h * h), CP + 'cts-a', 'The number you subtracted inside the bracket is multiplied by ' + t(rT(a)) + ' when it comes out: ' + t(rT(a) + '\\times' + par(h * h) + '=' + rT(a * h * h)) + '.']);
    out.push([f(a, p, c + a * h * h), CP + 'cts-add', 'The square you add inside the bracket has to be <b>subtracted</b> again, so the value doesn’t change.']);
    if (!same(p, 0)) out.push([f(a, -p, c - a * h * h), CP + 'vf-psign', 'Check the sign inside the bracket: half of ' + t(rT(b / a)) + ' is ' + t(rT(h)) + ', so the bracket is ' + t('(' + Z.binTex('x', p, true) + ')') + '.']);
    return out;
  }
  function ctsSteps(a, b, c) {
    var ba = b / a, h = ba / 2, p = -h, q = c - a * h * h, inner = 'x^{2}' + sT(ba).replace(/^([+-])1$/, '$1') + 'x';
    var L = [];
    if (same(a, 1)) {
      L.push(t('y=(' + inner + '+' + rT(h * h) + '-' + rT(h * h) + ')' + sT(c)));
      L.push(t('y=(' + Z.binTex('x', p, true) + ')^{2}-' + rT(h * h) + sT(c)) + ' &nbsp;⇒&nbsp; ' + t('y=' + vfT(1, p, q)));
    } else {
      L.push(t('y=' + Z.aTex(a, true) + '(' + inner + ')' + sT(c)));
      L.push(t('y=' + Z.aTex(a, true) + '(' + inner + '+' + rT(h * h) + '-' + rT(h * h) + ')' + sT(c)));
      L.push(t('y=' + Z.aTex(a, true) + '(' + Z.binTex('x', p, true) + ')^{2}' + sT(-a * h * h) + sT(c)) + ' &nbsp;⇒&nbsp; ' + t('y=' + vfT(a, p, q)));
    }
    return L.join('<br>');
  }
  function fixSet(p) { var raw = p.check; p.check = function (resp) { return raw(Z.fixFrac(resp)); }; return p; }
  function numBox(T) { // a plain number box check (HW.parse.number), for custom fields
    return function (resp) { var s = String(resp == null ? '' : resp).trim().replace(/^\\?\$/, ''); if (!s) return form('empty', 'Type your answer first.'); var pr = HW.parse.number(s); if (!pr.ok) return form('notnumber', 'Type a number.'); return T(pr.value); };
  }

  /* ---------------- transformation descriptions (multiple choice) ---------------- */
  function desc(o) {
    var parts = [];
    if (o.word) parts.push(o.word);
    else if (o.s != null && !same(o.s, 1)) parts.push('a vertical ' + (o.s > 1 ? 'stretch' : 'compression') + ' by a factor of ' + t(rT(o.s)));
    if (o.refl) parts.push('a reflection in the ' + t(o.refl) + '-axis');
    var tr = []; if (o.p) tr.push(o.swap ? hW(o.q) : hW(o.p)); if (o.q) tr.push(o.swap ? vW(o.p) : vW(o.q));
    if (tr.length) parts.push('a translation of ' + tr.join(' and '));
    return cap(joinAnd(parts)) + '.';
  }
  function descMC(r, a, p, q) {
    var s = Math.abs(a), refl = a < 0 ? 'x' : null, right = { s: s, refl: refl, p: p, q: q }, opts = [{ html: desc(right), right: true }];
    var add = function (o, why) { opts.push({ html: desc(o), why: why }); };
    if (p) add({ s: s, refl: refl, p: -p, q: q }, 'Check the horizontal translation: ' + t('(x-p)^{2}') + ' moves the graph ' + t('p') + ' units right, so ' + t('(' + Z.binTex('x', p) + ')^{2}') + ' moves it ' + hW(p) + '.');
    if (q) add({ s: s, refl: refl, p: p, q: -q }, 'Check the vertical translation: ' + t(sT(q)) + ' moves the graph ' + vW(q) + '.');
    if (p && q && Math.abs(p) !== Math.abs(q)) add({ s: s, refl: refl, p: q, q: p }, 'The number inside the bracket is the <b>horizontal</b> translation and the number outside is the <b>vertical</b> one.');
    if (!same(s, 1)) add({ word: 'a vertical ' + (s > 1 ? 'compression' : 'stretch') + ' by a factor of ' + t(rT(s > 1 ? s : 1 / s)), refl: refl, p: p, q: q }, t('|a|=' + rT(s)) + (s > 1 ? ' is greater than 1: a vertical <b>stretch</b> by a factor of ' + t(rT(s)) + '.' : ' is between 0 and 1: a vertical <b>compression</b> by a factor of ' + t(rT(s)) + '.'));
    if (refl) add({ s: s, refl: null, p: p, q: q }, t('a') + ' is negative, so there is also a reflection in the ' + t('x') + '-axis.');
    if (refl) add({ s: s, refl: 'y', p: p, q: q }, 'A negative ' + t('a') + ' reflects the graph in the ' + t('x') + '-axis (it flips upside down), not the ' + t('y') + '-axis.');
    var keep = [opts[0]].concat(r.shuffle(opts.slice(1)).slice(0, 3));
    return Z.mc(r, 'Describe how the graph of ' + t('y=x^{2}') + ' is transformed to give the graph of ' + t('y=' + vfT(a, p, q)) + '.', keep,
      'Compare with ' + t('y=a(x-p)^{2}+q') + ': ' + t('a=' + rT(a)) + (p ? ', ' + t('p=' + rT(p)) : '') + (q ? ', ' + t('q=' + rT(q)) : '') + '.<br>' + desc(right),
      ['Read ' + t('a') + ', ' + t('p') + ' and ' + t('q') + ' from ' + t('y=a(x-p)^{2}+q') + '.', t('|a|>1') + ': stretch; ' + t('0<|a|<1') + ': compression; ' + t('a<0') + ': reflection in the ' + t('x') + '-axis; ' + t('p') + ': horizontal, ' + t('q') + ': vertical.'], 'describe the transformations');
  }

  /* ---------------- shared bits ---------------- */
  /* a vertex-form function's table of features (Q4): vertex, axis, max/min, value, domain, range, y-intercept, x-intercepts */
  function tableFields(a, p, q, sol) {
    var up = a > 0, c = a * p * p + q, xs = Z.vfRoots(a, p, q), d = -q / a, irr = xs.length === 2 && !isInt(xs[0]);
    var specs = [
      { label: 'Vertex:', name: 'Vertex', pt: [p, q], cands: [[[-p, q], CP + 'vf-psign', 'The bracket is ' + t('(x-p)') + ': ' + t('(' + Z.binTex('x', p, true) + ')') + ' means ' + t('p=' + rT(p)) + '.'], [[q, p], 'pt-swap', 'The vertex is ' + t('(p,\\ q)') + ': the ' + t('x') + '-coordinate first.']] },
      axisSpec('Axis of symmetry:', p, [[-p, CP + 'vf-psign', 'The axis goes through the vertex: ' + t('x=p') + ', and ' + t('(' + Z.binTex('x', p, true) + ')') + ' means ' + t('p=' + rT(p)) + '.'], [q, CP + 'axis-y', 'The axis is the vertical line through the vertex, ' + t('x=p') + '.']]),
      { label: 'Direction of opening:', name: 'Direction of opening', check: function (resp) { var s = String(resp == null ? '' : resp).replace(/\\text\{([^}]*)\}/g, '$1').trim().toLowerCase(); if (!s) return form('empty', 'Type <b>up</b> or <b>down</b>.'); if (!/^(up|down|opens up|opens down)\b/.test(s)) return form(CP + 'dir-word', 'Type <b>up</b> or <b>down</b>.'); return (/up/.test(s) === up) ? ok() : wrong(CP + 'range-dir', t('a=' + rT(a)) + (up ? ' is positive: the parabola opens up.' : ' is negative: the parabola opens down.')); }, key: up ? 'up' : 'down', ansTex: '\\text{' + (up ? 'up' : 'down') + '}', text: true, placeholder: 'up or down' },
      { label: 'Maximum or minimum:', name: 'Maximum or minimum', mm: up ? 'min' : 'max' },
      { label: (up ? 'Minimum' : 'Maximum') + ' value:', name: 'Max/min value', ans: q, cands: [[p, CP + 'mm-p', 'The maximum or minimum value is the <b>y</b>-coordinate of the vertex, ' + t('q') + '.'], [c, CP + 'ctx-c', 'That is the ' + t('y') + '-intercept. The maximum or minimum is at the vertex.']] },
      { label: 'Domain:', name: 'Domain', dom: true, opt: { range: Z.rangeTex(q, up) } },
      { label: 'Range:', name: 'Range', range: [q, up], opt: { p: p, c: c } },
      { label: t('y') + '-intercept:', name: 'y-intercept', ans: c, cands: [[q, CP + 'yint-q', 'Let ' + t('x=0') + ': ' + t(Z.aTex(a, true) + '(0' + sT(-p) + ')^{2}' + sT(q)) + '.'], [a * a * p * p + q, CP + 'yint-sq', 'Square the bracket first, then multiply by ' + t('a') + '.'], [-a * p * p + q, 'sign', 'Check the sign: ' + t('(0' + sT(-p) + ')^{2}=' + p * p) + ' is positive.']] },
      { label: t('x') + '-intercepts:', name: 'x-intercepts', roots: { vals: xs, irr: irr, pm: irr ? [p, d] : null, cands: Z.vfCands(a, p, q) } }];
    return Z.fields('Complete the table for ' + t('y=' + vfT(a, p, q)) + '.', specs, { sol: sol, hints: ['Read the vertex ' + t('(p,\\ q)') + ' and ' + t('a') + ' from ' + t('y=a(x-p)^{2}+q') + '. The sign of ' + t('a') + ' gives the direction, the max/min and the range.', 'For the ' + t('y') + '-intercept let ' + t('x=0') + '; for the ' + t('x') + '-intercepts let ' + t('y=0') + ' and solve by square roots.'], text: 'table of features (vertex form)' });
  }
  function tableSol(a, p, q) {
    var up = a > 0, c = a * p * p + q, d = -q / a, xs = Z.vfRoots(a, p, q);
    var xl = !xs.length ? 'none (' + t('a') + ' and ' + t('q') + ' have the same sign: the vertex is ' + (up ? 'above' : 'below') + ' the ' + t('x') + '-axis and the parabola opens away from it)'
      : t('(' + Z.binTex('x', p, true) + ')^{2}=' + rT(d)) + ', so ' + t(Z.rootsKey({ vals: xs, irr: !isInt(xs[0]), pm: [p, d] }));
    return 'Vertex ' + t(ptT(p, q)) + ', axis ' + t('x=' + rT(p)) + '; ' + t('a' + (up ? '>0' : '<0')) + ': opens ' + (up ? 'up' : 'down') + ', ' + (up ? 'minimum' : 'maximum') + ' value ' + t(rT(q)) + '.<br>' +
      'Domain ' + t(Z.DOM) + '; range ' + t(Z.rangeTex(q, up)) + '.<br>' + t('y') + '-intercept: ' + t(Z.aTex(a, true) + '(0' + sT(-p) + ')^{2}' + sT(q) + '=' + rT(c)) + '.<br>' + t('x') + '-intercepts: ' + xl + '.';
  }
  /* a parabola's options for "choose the graph" (distinct shapes) */
  function graphOpts(a, p, q) {
    var cands = [[a, -p, q, 'Check the horizontal position of the vertex: ' + t('x=' + rT(p)) + '.'], [a, p, -q, 'Check the vertical position of the vertex: ' + t('y=' + rT(q)) + '.'], [-a, p, q, 'Check the direction of opening: ' + t('a=' + rT(a)) + '.'], [a > 0 ? 2 * a + 1 : 2 * a - 1, p, q, 'Check the shape: from the vertex, over 1 the graph moves ' + t(rT(a)) + ' vertically.']];
    var out = [{ f: Z.parabola(a, p, q), right: true }], seen = [[a, p, q]];
    cands.forEach(function (c) { if (out.length >= 4) return; if (seen.some(function (s) { return same(s[0], c[0]) && same(s[1], c[1]) && same(s[2], c[2]); })) return; seen.push(c); out.push({ f: Z.parabola(c[0], c[1], c[2]), why: c[3] }); });
    return { opts: out, verts: seen.map(function (s) { return [s[1], s[2]]; }) };
  }
  function stepPts(a, p, q) { return [[p, q], [p - 1, q + a], [p + 1, q + a], [p - 2, q + 4 * a], [p + 2, q + 4 * a]]; }

  /* ===================================================================================================== */
  var QUESTIONS = [
    { num: '1', section: 'Written Response', outcome: RF5, shared: mk(function (r) {
        return pickWhere(function () { return { k: r.pick([2, 3, -2, -3, 2, 4]), r1: nz(r, 1, 7), r2: nz(r, 1, 7) }; }, function (o) { return o.r1 < o.r2 && o.r1 + o.r2 !== 0 && Math.abs(o.k * o.r1 * o.r2) <= 60 && !(o.k === 2 && o.r1 === -2 && o.r2 === 3) && !(o.k === 2 && o.r1 === 1 && o.r2 === 5); });
      }), stem: function (s) { kit(); return 'Consider the function ' + t('y=' + genT(s.k, -s.k * (s.r1 + s.r2), s.k * s.r1 * s.r2)) + '.'; }, parts: [
      { id: '1a', level: 'BEG', make: mk(function (r, s) {
        var b = -(s.r1 + s.r2), c = s.r1 * s.r2;
        return Z.fields('Determine the zeros of the function and the ' + t('x') + '-intercepts of its graph.', [
          { label: 'Zeros:', name: 'Zeros', roots: { vals: [s.r1, s.r2], cands: [[[-s.r1, -s.r2], CP + 'zero-sign', 'A factor ' + t('(x-r)') + ' gives the zero ' + t('r') + ': set each factor equal to ' + t('0') + '.']], what: 'zeros' } },
          { label: t('x') + '-intercepts:', name: 'x-intercepts', check: K.pairs([[s.r1, 0], [s.r2, 0]]), key: '(' + s.r1 + ',0),(' + s.r2 + ',0)', ansTex: '(' + s.r1 + ',\\ 0),\\ (' + s.r2 + ',\\ 0)', math: true, placeholder: 'e.g. (3, 0), (-2, 0)' }],
          { sol: t(genT(s.k, s.k * b, s.k * c) + '=' + s.k + '(' + genT(1, b, c) + ')=' + Z.ffTex(s.k, [1, -s.r1], [1, -s.r2]) + '=0') + '.<br>Zeros ' + t(String(s.r1)) + ' and ' + t(String(s.r2)) + '; ' + t('x') + '-intercepts ' + t('(' + s.r1 + ',\\ 0)') + ' and ' + t('(' + s.r2 + ',\\ 0)') + '.',
            hints: ['Set ' + t('y=0') + ', take out the common factor and factor the trinomial.', 'Each zero ' + t('r') + ' gives the ' + t('x') + '-intercept ' + t('(r,\\ 0)') + '.'], text: 'zeros and x-intercepts', bad: [['x=' + (-s.r1) + ',x=' + (-s.r2), '(' + (-s.r1) + ',0),(' + (-s.r2) + ',0)'], ['x=' + s.r1 + ',x=' + s.r2, '(0,' + s.r1 + '),(0,' + s.r2 + ')']] });
      }) },
      { id: '1b', level: 'BEG', make: mk(function (r, s) {
        var eq = genT(s.k, -s.k * (s.r1 + s.r2), s.k * s.r1 * s.r2) + '=0';
        return Z.mc(r, 'How are your answers to (a) related to the roots of the equation ' + t(eq) + '?', [
          { html: 'They are the same numbers: the roots are the values of ' + t('x') + ' that make ' + t('y=0') + ', which is where the graph meets the ' + t('x') + '-axis.', right: true },
          { html: 'The roots are the opposites of the zeros: ' + t('x=' + (-s.r1)) + ' and ' + t('x=' + (-s.r2)) + '.', why: 'Substitute ' + t('x=' + s.r1) + ' into the equation: it makes the left side ' + t('0') + ', so it is a root.' },
          { html: 'The roots are the zeros divided by ' + t(String(s.k)) + ', the leading coefficient.', why: 'The constant factor ' + t(String(s.k)) + ' is never zero; it doesn’t change which ' + t('x') + '-values make ' + t('y=0') + '.' },
          { html: 'They are not related: zeros belong to the graph, roots only to the factored form.', why: 'Zeros of the function, roots of the equation ' + t('f(x)=0') + ' and ' + t('x') + '-intercepts of the graph are three names for the same values.' }],
          'The zeros of ' + t('y=f(x)') + ', the roots of ' + t('f(x)=0') + ' and the ' + t('x') + '-coordinates of the ' + t('x') + '-intercepts are the same numbers, ' + t(String(s.r1)) + ' and ' + t(String(s.r2)) + '.', ['What does a root of an equation make true? What is ' + t('y') + ' at an ' + t('x') + '-intercept?'], 'zeros, roots and intercepts');
      }) },
      { id: '1c', level: 'PRG', make: mk(function (r) {
        var o = pickWhere(function () { return { r1: nz(r, 1, 6), r2: nz(r, 1, 6), a: r.pick([-3, -2, 2, 3, -1, 4, -4]), x1: nz(r, 0, 5) }; }, function (o) {
          return o.r1 > o.r2 && o.r1 + o.r2 !== 0 && o.x1 !== o.r1 && o.x1 !== o.r2 && Math.abs(o.a * (o.x1 - o.r1) * (o.x1 - o.r2)) <= 50 && !(o.r1 === 3 && o.r2 === -4) && !(o.r1 === 5 && o.r2 === -1);
        });
        var y1 = o.a * (o.x1 - o.r1) * (o.x1 - o.r2), f1 = lin(1, -o.r1), f2 = lin(1, -o.r2), list = [P.num(o.a), f1, f2].filter(function (f, i) { return i > 0 || o.a !== 1; });
        var prod = (o.x1 - o.r1) * (o.x1 - o.r2);
        var ws = [{ is: [P.num(-o.a), f1, f2], code: CP + 'a-sign', hint: 'Check the sign of ' + t('a') + ': ' + t(y1 + '=a(' + (o.x1 - o.r1) + ')(' + (o.x1 - o.r2) + ')') + '.' }, { is: [P.num(o.a), lin(1, o.r1), lin(1, o.r2)], code: CP + 'zero-sign', hint: 'A zero ' + t('r') + ' gives the factor ' + t('(x-r)') + ': the zero ' + t(String(o.r2)) + ' gives ' + t('(' + Z.binTex('x', o.r2) + ')') + '.' }];
        if (Math.abs(o.a) !== 1) ws.push({ is: [P.num([1, o.a]), f1, f2], code: CP + 'a-recip', hint: 'Solve for ' + t('a') + ' by dividing ' + t(String(y1)) + ' by ' + t(String(prod)) + '.' });
        return facPart('Write the equation, in factored form, of the quadratic function with zeros ' + t(String(o.r1)) + ' and ' + t(String(o.r2)) + ' whose graph passes through ' + t(ptT(o.x1, y1)) + '.', list, ws,
          t('y=a(' + Z.binTex('x', o.r1) + ')(' + Z.binTex('x', o.r2) + ')') + '; substitute ' + t(ptT(o.x1, y1)) + ': ' + t(y1 + '=a(' + (o.x1 - o.r1) + ')(' + (o.x1 - o.r2) + ')=' + prod + 'a') + ', so ' + t('a=' + o.a) + '.<br>' + t('y=' + FX.tex(list)),
          ['Each zero ' + t('r') + ' gives a factor ' + t('(x-r)') + ': ' + t('y=a(x-r)(x-s)') + '.', 'Substitute the point for ' + t('x') + ' and ' + t('y') + ' and solve for ' + t('a') + '.'], 'factored form from the zeros and a point');
      }) }] },

    { num: '2', outcome: RF3, parts: [
      { id: '2a', level: 'BEG', make: mk(function (r) { var o = pickWhere(function () { return { p: nz(r, 1, 8), q: nz(r, 1, 9) }; }, function (o) { return Math.abs(o.p) !== Math.abs(o.q) && !(o.p === 4 && o.q === 1); }); return descMC(r, 1, o.p, o.q); }) },
      { id: '2b', level: 'EMG', make: mk(function (r) { var o = pickWhere(function () { return { a: -r.pick([1 / 2, 1 / 3, 1 / 4, 2 / 3, 3 / 4]), p: nz(r, 1, 7) }; }, function (o) { return !(same(o.a, -0.5) && o.p === -2); }); return descMC(r, o.a, o.p, 0); }) },
      { id: '2c', level: 'EMG', make: mk(function (r) { var o = pickWhere(function () { return { a: r.pick([2, 3, 4, 5]), p: nz(r, 1, 7), q: nz(r, 1, 9) }; }, function (o) { return !(o.a === 3 && o.p === -1 && o.q === -5) && !(o.a === 2 && o.p === -3); }); return descMC(r, o.a, o.p, o.q); }) },
      { id: '2d', level: 'BEG', make: mk(function (r) {
        var o = pickWhere(function () { return { s: r.pick([2, 3, 4, 5, 1 / 2, 1 / 3, 1 / 4]), neg: r.chance(0.7), p: nz(r, 1, 7), q: nz(r, 1, 9) }; }, function (o) { return !(o.s === 2 && o.neg && o.p === 3 && o.q === 4); });
        var a = o.neg ? -o.s : o.s, T = vfP(a, o.p, o.q);
        var ws = [{ p: vfP(a, -o.p, o.q), code: CP + 'vf-psign', hint: 'Translated ' + hW(o.p) + ' gives ' + t('(' + Z.binTex('x', o.p) + ')^{2}') + '.' }, { p: P.scale(vfP(1, o.p, o.q), R(a)), code: CP + 'vf-order', hint: 'Stretch (and reflect) first, then translate: the ' + t(rT(o.q)) + ' is not multiplied by ' + t('a') + '.' }];
        if (o.neg) ws.push({ p: vfP(o.s, o.p, o.q), code: CP + 'vf-refl', hint: 'The reflection in the ' + t('x') + '-axis makes ' + t('a') + ' negative.' });
        var parts = [(o.s > 1 ? 'stretched' : 'compressed') + ' vertically by a factor of ' + t(rT(o.s))]; if (o.neg) parts.push('reflected in the ' + t('x') + '-axis'); parts.push('translated ' + hW(o.p) + ' and ' + vW(o.q));
        return A.eqPart(CP, 'The graph of ' + t('y=x^{2}') + ' is ' + joinAnd(parts) + '. Write the equation of the new graph.', T, { form: 'vertex', wrongs: ws },
          t('a=' + rT(a)) + (o.neg ? ' (negative for the reflection)' : '') + ', ' + t('p=' + o.p) + ', ' + t('q=' + o.q) + ': ' + t('y=' + vfT(a, o.p, o.q)) + '.',
          ['In ' + t('y=a(x-p)^{2}+q') + ': ' + t('a') + ' is the stretch factor (negative for a reflection), ' + t('p') + ' the horizontal and ' + t('q') + ' the vertical translation.', 'Right ' + t('p') + ' gives ' + t('(x-p)') + '; left gives ' + t('(x+p)') + '.'], 'equation of the image');
      }) },
      { id: '2e', level: 'PRG', make: mk(function (r) {
        var o = pickWhere(function () { return { x0: nz(r, 1, 4), a: r.pick([2, 3, -2, -3, 4, -1, 1 / 2, -1 / 2]), p: nz(r, 1, 6), q: nz(r, 1, 9) }; }, function (o) { return isInt(o.a * o.x0 * o.x0) && !(o.x0 === 3 && o.a === 3 && o.p === -1 && o.q === -5); });
        var y0 = o.x0 * o.x0, X = o.x0 + o.p, Y = o.a * y0 + o.q;
        var ws = [{ is: [o.x0 - o.p, Y], code: CP + 'map-pdir', hint: 'In ' + t('(' + Z.binTex('x', o.p) + ')^{2}') + ' the graph moves ' + hW(o.p) + ': add ' + t(par(o.p)) + ' to the ' + t('x') + '-coordinate.' }, { is: [X, o.a * (y0 + o.q)], code: CP + 'map-order', hint: 'Stretch first, then translate: multiply ' + t(String(y0)) + ' by ' + t(rT(o.a)) + ', then add ' + t(par(o.q)) + '.' }];
        if (o.a !== 1) ws.push({ is: [X, y0 + o.q], code: CP + 'map-noa', hint: 'Multiply the ' + t('y') + '-coordinate by ' + t('a=' + rT(o.a)) + ' before translating.' });
        var p = KP.point('The point ' + t('(' + o.x0 + ',\\ ' + y0 + ')') + ' is on the graph of ' + t('y=x^{2}') + '. To which point is it mapped on the graph of ' + t('y=' + vfT(o.a, o.p, o.q)) + '?', [X, Y], { wrong: ws },
          t('(x,\\ y)\\to(x' + sT(o.p) + ',\\ ' + Z.aTex(o.a, true) + 'y' + sT(o.q) + ')') + ': ' + t('(' + o.x0 + ',\\ ' + y0 + ')\\to(' + X + ',\\ ' + rT(Y) + ')') + '.<br>Check: ' + t(vfT(o.a, o.p, o.q).replace(/x/g, '(' + X + ')') + '=' + rT(Y)) + ' ✓',
          ['The mapping is ' + t('(x,\\ y)\\to(x+p,\\ ay+q)') + '.', 'Multiply the ' + t('y') + '-coordinate by ' + t('a') + ' first, then add ' + t('q') + '.'], 'image of a point');
        p.key = '(' + X + ',' + rT(Y) + ')'; p.answer = t(ptT(X, Y)); p.bad = ws.map(function (w) { return '(' + w.is[0] + ',' + rT(w.is[1]) + ')'; });
        return p;
      }) }] },

    { num: '3', outcome: RF3, shared: function (r) {
        return pickWhere(function () { return { a: r.pick([1 / 2, -1 / 2, 2, -2, 1, -1]), p: nz(r, 0, 4), q: nz(r, 1, 5) }; }, function (o) { return !(o.a === 0.5 && o.p === 2 && o.q === -4) && !(o.a === -2 && o.p === -3); });
      }, stem: function (s) { kit(); return 'Consider the function ' + t('y=' + vfT(s.a, s.p, s.q)) + '.'; }, parts: [
      { id: '3a', level: 'EMG', make: mk(function (r, s) {
        var G = graphOpts(s.a, s.p, s.q), pts = stepPts(s.a, s.p, s.q), win = Z.win(G.verts, 4, 4);
        return Z.graphMC(r, 'Sketch the graph using its vertex and the step pattern: which graph is it?', G.opts, win,
          'Vertex ' + t(ptT(s.p, s.q)) + ', ' + t('a=' + rT(s.a)) + ': over 1, ' + (s.a > 0 ? 'up ' : 'down ') + t(rT(Math.abs(s.a))) + '; over 2, ' + (s.a > 0 ? 'up ' : 'down ') + t(rT(Math.abs(4 * s.a))) + ' from the vertex (the pattern 1, 3, 5 … times ' + t(rT(s.a)) + ').<br>Points: ' + pts.map(function (q) { return t(ptT(q[0], q[1])); }).join(', ') + '.',
          ['Plot the vertex ' + t('(p,\\ q)') + ' first.', 'From the vertex: over 1, move ' + t('1a') + '; over 1 more, ' + t('3a') + ' more; …'], 'sketch from vertex form');
      }) },
      { id: '3b', level: 'BEG', make: mk(function (r, s) {
        var up = s.a > 0, n = Z.countOf(s.a, s.q);
        return Z.fields('State the range and the number of ' + t('x') + '-intercepts.', [{ label: 'Range:', name: 'Range', range: [s.q, up], opt: { p: s.p } }, { label: 'Number of ' + t('x') + '-intercepts:', name: 'Number of x-intercepts', ans: n, cands: [[2 - n, CP + 'nx-count', 'Is the vertex above or below the ' + t('x') + '-axis, and which way does the parabola open from it?']] }],
          { sol: 'Range ' + t(Z.rangeTex(s.q, up)) + ' (opens ' + (up ? 'up' : 'down') + ' from ' + t('y=' + s.q) + ').<br>' + t('a') + ' and ' + t('q') + ' have ' + (n === 2 ? 'opposite signs: <b>2</b>' : 'the same sign: <b>0</b>') + ' ' + t('x') + '-intercepts.', hints: ['The range starts at the vertex’s ' + t('y') + '-value and goes the way the parabola opens.', t('a') + ' and ' + t('q') + ' with opposite signs: 2 intercepts; the same sign: 0; ' + t('q=0') + ': 1.'], text: 'range and number of x-intercepts' });
      }) }] },

    { num: '4', outcome: RF3, stem: 'Complete the table for each function.', parts: [
      { id: '4a', level: 'PRG', make: mk(function (r) {
        var o = pickWhere(function () { var a = r.pick([2, 3, 4, -2, -3]), d = r.int(1, 3); return { a: a, p: nz(r, 1, 5), d: d }; }, function (o) { return !(o.a === 3 && o.p === 2 && o.d === 2) && !(o.a === 2 && o.p === 3 && o.d === 2) && Math.abs(o.a * o.d * o.d) <= 27; });
        var q = -o.a * o.d * o.d; return tableFields(o.a, o.p, q, tableSol(o.a, o.p, q));
      }) },
      { id: '4b', level: 'PRG', make: mk(function (r) {
        var o = pickWhere(function () { var a = r.pick([-1 / 2, 1 / 2, -1 / 4, 1 / 3, -1 / 3]); return { a: a, p: nz(r, 1, 6), q: (a > 0 ? 1 : -1) * r.int(1, 8) }; }, function (o) { return isInt(o.a * o.p * o.p) && !(o.a === -0.5 && o.p === -4 && o.q === -3); });
        return tableFields(o.a, o.p, o.q, tableSol(o.a, o.p, o.q));
      }) }] },

    { num: '5', outcome: RF4, stem: 'For each function, state the ' + t('y') + '-intercept, the zeros, the equation of the axis of symmetry, the vertex and the range.', parts: [
      { id: '5a', level: 'PRG', make: mk(function (r) {
        var o = pickWhere(function () { return { k: r.pick([-1, -1, 1, -2]), r1: nz(r, 1, 8), r2: nz(r, 1, 8) }; }, function (o) { return o.r1 < o.r2 && (o.r1 + o.r2) % 2 === 0 && o.r1 + o.r2 !== 0 && Math.abs(o.k * o.r1 * o.r2) <= 40 && !(o.k === -1 && o.r1 === -1 && o.r2 === 7); });
        var a = o.k, b = -o.k * (o.r1 + o.r2), c = o.k * o.r1 * o.r2, h = (o.r1 + o.r2) / 2, kv = a * (h - o.r1) * (h - o.r2), up = a > 0;
        var fac = Z.ffTex(a, [1, -o.r1], [1, -o.r2]);
        return Z.fields('Consider ' + t('y=' + genT(a, b, c)) + '.', [
          { label: t('y') + '-intercept:', name: 'y-intercept', ans: c },
          { label: 'Zeros:', name: 'Zeros', roots: { vals: [o.r1, o.r2], cands: [[[-o.r1, -o.r2], CP + 'zero-sign', 'A factor ' + t('(x-r)') + ' gives the zero ' + t('r') + '.']] } },
          axisSpec('Axis of symmetry:', h, genAxisCands(a, b)),
          { label: 'Vertex:', name: 'Vertex', pt: [h, kv], cands: [[[h, c], CP + 'ctx-c', 'Substitute ' + t('x=' + h) + ' into the function to find the ' + t('y') + '-coordinate.'], [[-h, a * h * h - b * h + c], CP + 'axis-sign', 'The axis is ' + t('x=-\\frac{b}{2a}') + '.']] },
          { label: 'Range:', name: 'Range', range: [kv, up], opt: { p: h, c: c } }],
          { sol: t('y') + '-intercept ' + t(String(c)) + '.<br>' + t('y=' + fac) + ': zeros ' + t(String(o.r1)) + ' and ' + t(String(o.r2)) + '.<br>Axis ' + t('x=-\\frac{' + par(b) + '}{2(' + a + ')}=' + h) + '; ' + t('y=' + genT(a, b, c).replace(/x/g, '(' + h + ')') + '=' + kv) + '.<br>Vertex ' + t(ptT(h, kv)) + '; range ' + t(Z.rangeTex(kv, up)) + '.',
            hints: ['The ' + t('y') + '-intercept is ' + t('c') + '. Factor to find the zeros.', 'Axis ' + t('x=-\\frac{b}{2a}') + ' (midway between the zeros); substitute it for the vertex.'], text: 'features of general form' });
      }) },
      { id: '5b', level: 'PRG', make: mk(function (r) {
        var o = pickWhere(function () { return { k: r.pick([2, 3, -2, -3, 2]), r1: nz(r, 1, 7), r2: nz(r, 1, 7) }; }, function (o) { return o.r1 < o.r2 && (o.r1 + o.r2) % 2 === 0 && o.r1 + o.r2 !== 0 && Math.abs(o.k * o.r1 * o.r2) <= 50 && !(o.k === 2 && o.r1 === -5 && o.r2 === 1) && !(o.k === -2 && o.r1 === -1 && o.r2 === 5); });
        var a = o.k, b = -a * (o.r1 + o.r2), c = a * o.r1 * o.r2, h = (o.r1 + o.r2) / 2, kv = a * (h - o.r1) * (h - o.r2), up = a > 0, fac = Z.ffTex(a, [1, -o.r1], [1, -o.r2]);
        return Z.fields('Consider ' + t('y=' + fac) + '. Also write it in general form.', [
          { label: 'Zeros:', name: 'Zeros', roots: { vals: [o.r1, o.r2], cands: [[[-o.r1, -o.r2], CP + 'zero-sign', 'A factor ' + t('(x-r)') + ' gives the zero ' + t('r') + ': ' + t('(' + Z.binTex('x', o.r1) + ')') + ' gives ' + t(String(o.r1)) + '.']] } },
          axisSpec('Axis of symmetry:', h, [[-h, CP + 'zero-sign', 'The axis is midway between the zeros ' + t(String(o.r1)) + ' and ' + t(String(o.r2)) + '.']]),
          { label: 'Vertex:', name: 'Vertex', pt: [h, kv], cands: [[[h, (h - o.r1) * (h - o.r2)], CP + 'vf-a', 'Multiply by ' + t('a=' + a) + ' too: ' + t('y=' + a + '(' + (h - o.r1) + ')(' + (h - o.r2) + ')') + '.']] },
          { label: t('y') + '-intercept:', name: 'y-intercept', ans: c, cands: [[o.r1 * o.r2, CP + 'vf-a', 'Multiply by ' + t('a') + ': ' + t(a + '(' + (-o.r1) + ')(' + (-o.r2) + ')') + '.']] },
          { label: 'Range:', name: 'Range', range: [kv, up], opt: { p: h, c: c } },
          { label: 'General form:', name: 'General form', before: 'y=', check: stripY(K.poly(genP(a, b, c), { wrong: [{ is: genP(a, -b, c), code: CP + 'zero-sign', hint: 'Check the middle term: expand ' + t('(' + Z.binTex('x', o.r1) + ')(' + Z.binTex('x', o.r2) + ')') + ' carefully.' }, { is: genP(1, b / a, c / a), code: CP + 'vf-a', hint: 'Multiply every term by ' + t('a=' + a) + '.' }] })), key: genT(a, b, c), ansTex: 'y=' + genT(a, b, c), math: true, placeholder: 'e.g. 2x^2 + 8x - 10' }],
          { sol: 'Zeros ' + t(String(o.r1)) + ' and ' + t(String(o.r2)) + '; axis ' + t('x=\\frac{' + o.r1 + '+' + par(o.r2) + '}{2}=' + h) + '.<br>' + t('y=' + a + '(' + (h - o.r1) + ')(' + (h - o.r2) + ')=' + kv) + ': vertex ' + t(ptT(h, kv)) + '.<br>' + t('y') + '-intercept ' + t(a + '(' + (-o.r1) + ')(' + (-o.r2) + ')=' + c) + '; range ' + t(Z.rangeTex(kv, up)) + '.<br>General form: ' + t('y=' + a + '(' + genT(1, b / a, c / a) + ')=' + genT(a, b, c)) + '.',
            hints: ['Read the zeros from the factors; the axis is midway between them.', 'Substitute the axis value for the vertex; ' + t('x=0') + ' for the ' + t('y') + '-intercept. Expand for general form.'], text: 'features of factored form' });
      }) }] },

    { num: '6', stem: 'Write the equation of each quadratic function.', parts: [
      { id: '6a', level: 'PRG', outcome: RF3, make: mk(function (r) {
        var o = pickWhere(function () { return { p: nz(r, 0, 6), q: nz(r, 1, 9), a: r.pick([2, 3, -2, -3, -1, 1 / 2, -1 / 2, 4]), d: nz(r, 1, 3) }; }, function (o) { return isInt(o.a * o.d * o.d) && Math.abs(o.d) >= 1 && !(o.p === -3 && o.q === 2) && !(o.p === 2 && o.q === -5) && Math.abs(o.a * o.d * o.d + o.q) <= 40; });
        var x1 = o.p + o.d, y1 = o.a * o.d * o.d + o.q, T = vfP(o.a, o.p, o.q);
        var ws = [{ p: vfP(o.a, -o.p, o.q), code: CP + 'vf-psign', hint: 'The vertex ' + t(ptT(o.p, o.q)) + ' gives the bracket ' + t('(' + Z.binTex('x', o.p) + ')') + '.' }];
        if (Math.abs(o.d) > 1) ws.push({ p: vfP((y1 - o.q) / o.d, o.p, o.q), code: CP + 'vp-nosq', hint: 'Square the bracket: ' + t('(' + x1 + sT(-o.p) + ')^{2}=' + o.d * o.d) + '.' });
        return A.eqPart(CP, 'Vertex ' + t(ptT(o.p, o.q)) + ', passing through ' + t(ptT(x1, y1)) + '.', T, { form: 'vertex', wrongs: ws },
          t(y1 + '=a(' + x1 + sT(-o.p) + ')^{2}' + sT(o.q)) + ' &nbsp;⇒&nbsp; ' + t(rT(y1 - o.q) + '=' + o.d * o.d + 'a') + ' &nbsp;⇒&nbsp; ' + t('a=' + rT(o.a)) + '.<br>' + t('y=' + vfT(o.a, o.p, o.q)),
          ['Write ' + t('y=a(x-p)^{2}+q') + ' with the vertex, then substitute the point.', 'Solve for ' + t('a') + '.'], 'equation from the vertex and a point');
      }) },
      { id: '6b', level: 'PRG', outcome: RF3, make: mk(function (r) {
        var o = pickWhere(function () { return { p: nz(r, 0, 3), q: nz(r, 1, 4), a: r.pick([3 / 2, 1 / 2, -1 / 2, -3 / 2, 2, -2, 1 / 4, -1 / 4]), d: r.pick([1, 2]) }; }, function (o) {
          var y = o.q + o.a * o.d * o.d; return isInt(y) && Math.abs(y) <= 6 && Math.abs(o.a * o.d * o.d) >= 2 && !(o.p === 1 && o.q === -3 && o.a === 1.5) && (o.a > 0 ? o.q < 0 || r.chance(0.3) : o.q > 0 || r.chance(0.3));
        });
        var x1 = o.p + o.d, y1 = o.q + o.a * o.d * o.d, win = Z.win([[o.p, o.q], [x1, y1], [o.p - o.d, y1]], 2, 1);
        var fig = Z.fig({ x: win.x, y: win.y, l: 1, g: 1, ux: 220 / (win.x[1] - win.x[0]), uy: 220 / (win.y[1] - win.y[0]), fns: [{ f: Z.parabola(o.a, o.p, o.q), from: win.x[0], to: win.x[1] }], points: [{ x: o.p, y: o.q }, { x: x1, y: y1 }, { x: o.p - o.d, y: y1 }], max: 260, aria: 'parabola through marked points' });
        return A.eqPart(CP, 'The graph shown. Write its equation in vertex form.' + fig, vfP(o.a, o.p, o.q), { form: 'vertex', wrongs: [{ p: vfP(o.a, -o.p, o.q), code: CP + 'vf-psign', hint: 'Read the vertex from the graph: ' + t(ptT(o.p, o.q)) + '.' }, { p: vfP((y1 - o.q) / o.d, o.p, o.q), code: CP + 'vp-nosq', hint: 'Square the horizontal distance: ' + t('(' + x1 + sT(-o.p) + ')^{2}=' + o.d * o.d) + '.' }, { p: vfP(-o.a, o.p, o.q), code: CP + 'vf-refl', hint: 'The parabola opens ' + (o.a > 0 ? 'up' : 'down') + ': check the sign of ' + t('a') + '.' }] },
          'Vertex ' + t(ptT(o.p, o.q)) + ', point ' + t(ptT(x1, y1)) + ': ' + t(y1 + '=a(' + o.d + ')^{2}' + sT(o.q)) + ', so ' + t('a=' + rT(o.a)) + '.<br>' + t('y=' + vfT(o.a, o.p, o.q)),
          ['Read the vertex and one other point with whole-number coordinates from the graph.', 'Substitute the point into ' + t('y=a(x-p)^{2}+q') + ' and solve for ' + t('a') + '.'], 'equation from a graph');
      }) },
      { id: '6c', level: 'ADV', outcome: RF3, make: mk(function (r) {
        var o = pickWhere(function () { return { h: nz(r, 1, 4), d: r.int(1, 5), a: r.pick([1 / 2, 2, 1, 1 / 4, 3, -1 / 2, -1, -2]) }; }, function (o) { var k = -o.a * o.d * o.d, c = o.a * o.h * o.h + k; return o.d !== Math.abs(o.h) && isInt(k) && isInt(c) && Math.abs(k) <= 30 && Math.abs(c) <= 30 && c !== 0 && !(o.h === 2 && o.d === 4 && o.a === 0.5); });
        var k = -o.a * o.d * o.d, c = o.a * o.h * o.h + k, up = o.a > 0, xs = [o.h - o.d, o.h + o.d];
        return Z.fields('Axis of symmetry ' + t('x=' + o.h) + ', range ' + t(Z.rangeTex(k, up)) + ', ' + t('y') + '-intercept ' + t(String(c)) + '. Write the equation in vertex form, then find its ' + t('x') + '-intercepts.', [
          { label: 'Equation:', name: 'Equation', before: 'y=', expr: { fn: Z.parabola(o.a, o.h, k), key: vfT(o.a, o.h, k), vertex: { a: o.a, p: o.h, q: k }, cands: [[Z.parabola((c - k) / o.h, o.h, k), CP + 'vp-nosq', 'Square the bracket: ' + t('(0' + sT(-o.h) + ')^{2}=' + o.h * o.h) + '.'], [Z.parabola(-o.a, o.h, -k), CP + 'range-dir', 'The range gives the vertex’s ' + t('y') + '-value ' + t(String(k)) + ' and the direction of opening.']] }, placeholder: 'e.g. 2(x-3)^2-8' },
          { label: t('x') + '-intercepts:', name: 'x-intercepts', roots: { vals: xs, cands: Z.vfCands(o.a, o.h, k) } }],
          { sol: 'The vertex is on the axis at the end of the range: ' + t(ptT(o.h, k)) + '.<br>' + t(c + '=a(0' + sT(-o.h) + ')^{2}' + sT(k)) + ' &nbsp;⇒&nbsp; ' + t(rT(c - k) + '=' + o.h * o.h + 'a') + ', so ' + t('a=' + rT(o.a)) + ': ' + t('y=' + vfT(o.a, o.h, k)) + '.<br>' + t('x') + '-intercepts: ' + t('(' + Z.binTex('x', o.h) + ')^{2}=' + o.d * o.d) + ', ' + t(Z.binTex('x', o.h) + '=\\pm ' + o.d) + ': ' + t('x=' + xs[0] + ',\\ x=' + xs[1]) + '.',
            hints: ['The axis gives ' + t('p') + ' and the range gives ' + t('q') + ' (the max or min value). The ' + t('y') + '-intercept is the point ' + t('(0,\\ c)') + '.', 'Solve for ' + t('a') + '; then set ' + t('y=0') + ' and solve by square roots.'], text: 'equation from the axis, range and y-intercept' });
      }) },
      { id: '6d', level: 'ADV', outcome: RF5, make: mk(function (r) {
        var o = pickWhere(function () { return { m: r.pick([2, 3]), n: nz(r, 1, 5), s: nz(r, 1, 6), k: r.pick([1, 2, -1, -2, 3]) }; }, function (o) { return gcd(o.m, o.n) === 1 && o.n !== o.m * o.s && Math.abs(o.k * o.n * o.s) <= 40 && !(o.m === 2 && o.n === 1 && o.s === 4); });
        var a = o.k * o.m, c = o.k * o.n * o.s, b = -o.k * (o.m * o.s + o.n), list = [P.num(o.k), lin(o.m, -o.n), lin(1, -o.s)].filter(function (f, i) { return i > 0 || o.k !== 1; }), key = FX.tex(list);
        var zr = o.n / o.m;
        return Z.fields('Zeros ' + t(rT(zr)) + ' and ' + t(String(o.s)) + ', ' + t('y') + '-intercept ' + t(String(c)) + '. Give the equation in factored form and in general form.', [
          { label: 'Factored form:', name: 'Factored form', before: 'y=', check: stripY(K.factored(list, { wrong: [{ is: [P.num(-o.k), lin(o.m, -o.n), lin(1, -o.s)], code: CP + 'a-sign', hint: 'Check the sign of ' + t('a') + ': substitute ' + t('(0,\\ ' + c + ')') + '.' }, { is: [P.num(o.k), lin(o.m, o.n), lin(1, o.s)], code: CP + 'zero-sign', hint: 'A zero ' + t('r') + ' gives the factor ' + t('(x-r)') + '.' }] })), key: key, ansTex: 'y=' + key, math: true, placeholder: 'e.g. 2(2x - 1)(x - 4)' },
          { label: 'General form:', name: 'General form', before: 'y=', check: stripY(K.poly(genP(a, b, c))), key: genT(a, b, c), ansTex: 'y=' + genT(a, b, c), math: true, placeholder: 'e.g. 4x^2 - 18x + 8' }],
          { sol: t('y=a\\left(x' + sT(-zr) + '\\right)(' + Z.binTex('x', o.s) + ')') + '; substitute ' + t('(0,\\ ' + c + ')') + ': ' + t(c + '=a(' + rT(-zr) + ')(' + (-o.s) + ')=' + rT(zr * o.s) + 'a') + ', so ' + t('a=' + a) + '.<br>' + t('y=' + Z.aTex(a) + '\\left(x' + sT(-zr) + '\\right)(' + Z.binTex('x', o.s) + ')=' + key) + '<br>' + t('y=' + genT(a, b, c)),
            hints: ['Write ' + t('y=a(x-r)(x-s)') + ' and substitute the ' + t('y') + '-intercept ' + t('(0,\\ ' + c + ')') + '.', 'Move the ' + t(String(o.m)) + ' into the bracket with the fraction to clear it; expand for general form.'], text: 'factored and general form from the zeros' });
      }) }] },

    { num: '7', shared: mk(function (r) {
        return pickWhere(function () { return { W: 2 * r.int(9, 22), H: r.int(4, 9), bw: 2 * r.int(2, 6), bh: r.int(2, 8), h0: r.int(2, 7) }; }, function (o) {
          var half = o.W / 2, a = -o.H / (half * half), ye = o.H + a * (o.bw / 2) * (o.bw / 2);
          return !(o.W === 30 && o.H === 6) && !(o.W === 24 && o.H === 9) && o.bw < half && o.bh < o.H && Math.abs(ye - o.bh) >= 0.3 && o.h0 < o.H && !isSq((o.H - o.h0) * half * half / o.H) && Z.toFrac(a)[1] <= 600;
        });
      }), stem: function (s) { return 'The arch under a footbridge is a parabola. It spans ' + t(s.W) + ' m across a stream, and its highest point is ' + t(s.H) + ' m above the water. Place the origin at water level directly below the highest point.'; }, parts: [
      { id: '7a', level: 'PRG', outcome: RF3, make: mk(function (r, s) {
        var half = s.W / 2, a = -s.H / (half * half), f = function (x) { return a * x * x + s.H; };
        return M.exprPart('Write the equation of the arch.', f, rT(a) + 'x^{2}+' + s.H, { before: 'y=', ansPre: 'y=', outcome: RF3, cands: [[function (x) { return -s.H / (s.W * s.W) * x * x + s.H; }, CP + 'arch-half', 'The origin is below the top, so the ends are at ' + t('x=\\pm ' + half) + ', half the span.'], [function (x) { return -a * x * x + s.H; }, CP + 'a-sign', 'The arch opens down: ' + t('a') + ' is negative.'], [function (x) { return a * x * x; }, CP + 'vf-q', 'The top of the arch is at ' + t('(0,\\ ' + s.H + ')') + ': ' + t('q=' + s.H) + '.']],
          sol: 'Vertex ' + t('(0,\\ ' + s.H + ')') + ': ' + t('y=ax^{2}+' + s.H) + ' through ' + t('(' + half + ',\\ 0)') + ': ' + t(half * half + 'a+' + s.H + '=0') + ', so ' + t('a=-\\frac{' + s.H + '}{' + half * half + '}=' + rT(a)) + '.<br>' + t('y=' + rT(a) + 'x^{2}+' + s.H),
          hints: ['The vertex is ' + t('(0,\\ ' + s.H + ')') + ' and the arch meets the water at ' + t('x=\\pm\\frac{' + s.W + '}{2}') + '.', 'Substitute ' + t('(' + half + ',\\ 0)') + ' into ' + t('y=ax^{2}+' + s.H) + ' and solve for ' + t('a') + '.'], text: 'equation of an arch' });
      }) },
      { id: '7b', level: 'PRG', outcome: RF3, make: mk(function (r, s) {
        var half = s.W / 2, a = -s.H / (half * half), e = s.bw / 2, ye = s.H + a * e * e, yf = s.H + a * s.bw * s.bw, fits = ye > s.bh, yT = function (y) { return Z.vT(y); };
        var opts = [{ html: (fits ? '<b>Yes</b>: at ' + t('x=\\pm ' + e) + ' (the boat’s edges) the arch is ' + t(yT(ye)) + ' m high, more than ' + t(s.bh) + ' m.' : '<b>No</b>: at ' + t('x=\\pm ' + e) + ' (the boat’s edges) the arch is only ' + t(yT(ye)) + ' m high, less than ' + t(s.bh) + ' m.'), right: true },
          { html: (yf > s.bh ? '<b>Yes</b>' : '<b>No</b>') + ': at ' + t('x=\\pm ' + s.bw) + ' the arch is ' + t(yT(yf)) + ' m high' + (yf > s.bh ? ', more' : ', less') + ' than ' + t(s.bh) + ' m.', why: 'The boat is centred, so its edges are half its width from the centre: ' + t('x=\\pm ' + e) + '.' },
          { html: (fits ? '<b>No</b>' : '<b>Yes</b>') + ': the arch is ' + t(s.H) + ' m high at the centre' + (fits ? ', but the boat is ' + t(s.bw) + ' m wide, so it can’t fit.' : ', more than ' + t(s.bh) + ' m.'), why: 'Check the height of the arch where the boat’s top corners are, at ' + t('x=\\pm ' + e) + '.' },
          { html: (fits ? '<b>No</b>' : '<b>Yes</b>') + ': at ' + t('x=\\pm ' + e) + ' the arch is ' + t(yT(s.H - ye)) + ' m high.', why: 'Substitute carefully: ' + t('y=' + rT(a) + '(' + e + ')^{2}+' + s.H + '=' + yT(ye)) + '.' }];
        return Z.mc(r, 'A tour boat ' + t(s.bw) + ' m wide and ' + t(s.bh) + ' m tall passes through the centre of the arch. Will it fit? Choose the answer with the right reason.', opts,
          'The boat’s edges are at ' + t('x=\\pm ' + e) + ': ' + t('y=' + rT(a) + '(' + e + ')^{2}+' + s.H + '=' + yT(ye)) + ' m. Since ' + t(yT(ye) + (fits ? '>' : '<') + s.bh) + ', it ' + (fits ? 'fits' : 'does not fit') + '.',
          ['Where are the boat’s top corners? Find the height of the arch there.'], 'will the boat fit');
      }) },
      { id: '7c', level: 'ADV', outcome: RF5, make: mk(function (r, s) {
        var half = s.W / 2, a = -s.H / (half * half), x2 = (s.H - s.h0) / -a, xw = Math.sqrt(x2);
        return Z.apx('How wide is the arch at a height of ' + t(s.h0) + ' m above the water? Give the answer to the nearest tenth of a metre.', 2 * xw, 1, { after: 'm', unit: 'm', outcome: RF5, cands: [[xw, CP + 'arch-half', 'That is half the width (from the centre to one side). The width is from ' + t('-x') + ' to ' + t('x') + '.']],
          sol: t(rT(a) + 'x^{2}+' + s.H + '=' + s.h0) + ' &nbsp;⇒&nbsp; ' + t('x^{2}=' + rT(x2)) + ' &nbsp;⇒&nbsp; ' + t('x=\\pm\\sqrt{' + rT(x2) + '}\\approx\\pm ' + fx(xw, 2)) + '.<br>Width ' + t('\\approx ' + fx(2 * xw, 1)) + ' m.',
          hints: ['Set ' + t('y=' + s.h0) + ' and solve for ' + t('x') + ' by square roots.', 'The width is the distance between the two solutions.'], text: 'width of an arch at a height' });
      }) }] },

    { num: '8', outcome: RF4, stem: 'Complete the square to write each function in vertex form. State the vertex and the maximum or minimum value.', parts: [
      { id: '8a', level: 'BEG', make: mk(function (r) { var o = pickWhere(function () { return { h: nz(r, 1, 7), c: nz(r, 1, 20) }; }, function (o) { return !(o.h === 5 && o.c === 18) && o.c !== o.h * o.h; }); return ctsPart(1, 2 * o.h, o.c); }) },
      { id: '8b', level: 'PRG', make: mk(function (r) { var o = pickWhere(function () { return { a: r.int(2, 5), h: nz(r, 1, 5), c: nz(r, 1, 30) }; }, function (o) { return !(o.a === 3 && o.h === -3 && o.c === 22) && !(o.a === 2 && o.h === -3) && Math.abs(o.c - o.a * o.h * o.h) <= 60; }); return ctsPart(o.a, 2 * o.a * o.h, o.c); }) },
      { id: '8c', level: 'PRG', make: mk(function (r) { var o = pickWhere(function () { return { a: -r.int(1, 4), h: nz(r, 1, 5), c: nz(r, 1, 15) }; }, function (o) { return !(o.a === -2 && o.h === 2 && o.c === 1) && Math.abs(o.c - o.a * o.h * o.h) <= 60; }); return ctsPart(o.a, 2 * o.a * o.h, o.c); }) },
      { id: '8d', level: 'ADV', make: mk(function (r) { var o = pickWhere(function () { return { a: r.pick([1 / 2, -1 / 2, 1 / 2]), b: nz(r, 1, 7), c: nz(r, 1, 9) }; }, function (o) { return Math.abs(o.b) % 2 === 1 && !(o.a === 0.5 && o.b === 3 && o.c === -1); }); return ctsPart(o.a, o.b, o.c); }) }] },

    { num: '9', outcome: RF4, shared: function (r) {
        return pickWhere(function () { return { a: r.pick([2, 3, 4, -2, -3]), h: nz(r, 1, 5), c: nz(r, 1, 12) }; }, function (o) { return !(o.a === 2 && o.h === 3 && o.c === 5); });
      }, stem: function (s) {
        kit(); var b = 2 * s.a * s.h, hh = s.h * s.h, bad = s.c - hh;
        return 'Mila wrote ' + t('y=' + genT(s.a, b, s.c)) + ' in vertex form like this:<br>' + t('y=' + s.a + '(x^{2}' + sT(2 * s.h) + 'x+' + hh + '-' + hh + ')' + sT(s.c) + '=' + s.a + '(x' + sT(s.h) + ')^{2}-' + hh + sT(s.c) + '=' + s.a + '(x' + sT(s.h) + ')^{2}' + sT(bad));
      }, parts: [
      { id: '9a', level: 'PRG', make: mk(function (r, s) {
        var hh = s.h * s.h;
        return Z.mc(r, 'Explain her error.', [
          { html: 'The ' + t('-' + hh) + ' is inside the bracket, so it is multiplied by ' + t(String(s.a)) + ' when it comes out: ' + t(String(-s.a * hh)) + ', not ' + t('-' + hh) + '.', right: true },
          { html: 'She should have added and subtracted ' + t(String((s.a * s.h) * (s.a * s.h))) + ', the square of half of ' + t(String(2 * s.a * s.h)) + '.', why: 'After factoring out ' + t(String(s.a)) + ', the bracket holds ' + t('x^{2}' + sT(2 * s.h) + 'x') + ': half of ' + t(String(2 * s.h)) + ', squared, is ' + t(String(hh)) + ' — that step was right.' },
          { html: 'The bracket should be ' + t('(x' + sT(-s.h) + ')^{2}') + ', not ' + t('(x' + sT(s.h) + ')^{2}') + '.', why: t('x^{2}' + sT(2 * s.h) + 'x+' + hh + '=(x' + sT(s.h) + ')^{2}') + ' — the bracket was right.' },
          { html: 'She should have divided the constant ' + t(String(s.c)) + ' by ' + t(String(s.a)) + ' too.', why: 'Only the ' + t('x^{2}') + ' and ' + t('x') + ' terms are factored; ' + t(String(s.c)) + ' stays outside unchanged.' }],
          'The ' + t('-' + hh) + ' is inside the bracket, so it is multiplied by ' + t(String(s.a)) + ' when it comes out: ' + t(String(-s.a * hh)) + '.<br>Quick check with ' + t('x=0') + ': the original gives ' + t(String(s.c)) + '; her form gives ' + t(s.a + '(' + hh + ')' + sT(s.c - hh) + '=' + (s.a * hh + s.c - hh)) + ' ' + t('\\ne ' + s.c) + '.',
          ['Expand her answer, or substitute ' + t('x=0') + ' into both forms.'], 'error in completing the square');
      }) },
      { id: '9b', level: 'PRG', make: mk(function (r, s) {
        var p = -s.h, q = s.c - s.a * s.h * s.h, fn = Z.parabola(s.a, p, q);
        return M.exprPart('Give the correct vertex form.', fn, vfT(s.a, p, q), { before: 'y=', ansPre: 'y=', vertex: { a: s.a, p: p, q: q, c: s.c }, cands: [[Z.parabola(s.a, p, s.c - s.h * s.h), CP + 'cts-a', 'That is Mila’s answer. Multiply the ' + t(String(-s.h * s.h)) + ' by ' + t(String(s.a)) + ' when it comes out of the bracket.']],
          sol: t('y=' + s.a + '(x' + sT(s.h) + ')^{2}' + sT(-s.a * s.h * s.h) + sT(s.c) + '=' + vfT(s.a, p, q)) + '.<br>Check with ' + t('x=0') + ': ' + t(s.a + '(' + s.h * s.h + ')' + sT(q) + '=' + s.c) + ' ✓',
          hints: ['The ' + t('-' + s.h * s.h) + ' inside the bracket is multiplied by ' + t(String(s.a)) + ' when it comes out.'], text: 'corrected vertex form' });
      }) }] },

    { num: '10', outcome: RF5, stem: 'Solve using the quadratic formula.', parts: [
      { id: '10a', level: 'BEG', make: mk(function (r) {
        var o = pickWhere(function () { return { b: 2 * nz(r, 1, 5), c: nz(r, 1, 12) }; }, function (o) { var D = o.b * o.b - 4 * o.c; return D > 0 && !isSq(D) && !isSq(D / 4) && !(o.b === 4 && o.c === -1) && !(o.b === -6 && o.c === 4); });
        return qfPart(t(genT(1, o.b, o.c) + '=0') + ' &nbsp; (exact, in simplest form)', 1, o.b, o.c);
      }) },
      { id: '10b', level: 'PRG', make: mk(function (r) {
        var o = pickWhere(function () { return { a: r.pick([2, 3, 4]), b: 2 * nz(r, 1, 4), c: nz(r, 1, 6) }; }, function (o) { var D = o.b * o.b - 4 * o.a * o.c, Q; if (D <= 0 || isSq(D) || gcd(gcd(o.a, o.b), o.c) !== 1) return false; Q = qfR(o.a, o.b, o.c); return Q.simp && !(o.a === 2 && o.b === -2 && o.c === -1) && !(o.a === 3 && o.b === 2 && o.c === -4); });
        return qfPart(t(genT(o.a, o.b, o.c) + '=0') + ' &nbsp; (exact, in simplest form)', o.a, o.b, o.c);
      }) },
      { id: '10c', level: 'PRG', make: mk(function (r) {
        var o = pickWhere(function () { return { a: r.int(2, 7), b: nz(r, 1, 7), c: nz(r, 1, 6) }; }, function (o) { var D = o.b * o.b + 4 * o.a * o.c; return D > 0 && !isSq(D) && !(o.a === 5 && o.b === 3 && o.c === 1); });
        var a = o.a, b = -o.b, c = -o.c, D = b * b - 4 * a * c, s = Math.sqrt(D), x1 = (-b + s) / (2 * a), x2 = (-b - s) / (2 * a);
        return A.rootsPart(CP, t(a + 'x^{2}=' + genT(0, o.b, o.c).replace(/^\+/, '')) + ' &nbsp; (to the nearest hundredth)', [x1, x2], { dp: 2, wrongs: qfWrongs(a, b, c).concat(o.b * o.b - 4 * a * o.c > 0 ? [{ vals: [(-o.b + Math.sqrt(o.b * o.b - 4 * a * o.c)) / (2 * a), (-o.b - Math.sqrt(o.b * o.b - 4 * a * o.c)) / (2 * a)], code: CP + 'qf-std', hint: 'Write the equation in standard form first: ' + t(genT(a, b, c) + '=0') + '.' }] : []) },
          'Standard form: ' + t(genT(a, b, c) + '=0') + '.<br>' + t('x=\\frac{' + (-b) + '\\pm\\sqrt{' + par(b) + '^{2}-4(' + a + ')(' + c + ')}}{' + 2 * a + '}=\\frac{' + (-b) + '\\pm\\sqrt{' + D + '}}{' + 2 * a + '}') + ', so ' + t('x\\approx ' + fx(x1, 2)) + ' or ' + t('x\\approx ' + fx(x2, 2)) + '.',
          ['Move every term to one side first: ' + t('ax^{2}+bx+c=0') + '.', 'Use the formula and round each root at the end.'], 'quadratic formula, rounded');
      }) },
      { id: '10d', level: 'PRG', make: mk(function (r) {
        var o = pickWhere(function () { return { m: nz(r, 1, 6), n: r.int(2, 5), k: nz(r, 1, 6) }; }, function (o) { var B1 = o.m - o.n, C1 = -o.n * o.k, D = B1 * B1 - 4 * C1; return B1 !== 0 && C1 !== 0 && D > 0 && !isSq(D) && !(o.m === 3 && o.n === 2 && o.k === 5); });
        var b = o.m - o.n, c = -o.n * o.k;
        return qfPart(t('x(x' + sT(o.m) + ')=' + o.n + '(x' + sT(o.k) + ')') + ' &nbsp; (exact, in simplest form)', 1, b, c, 'Expand and move every term to one side: ' + t('x^{2}' + sT(o.m) + 'x=' + o.n + 'x' + sT(o.n * o.k)) + ' &nbsp;⇒&nbsp; ' + t(genT(1, b, c) + '=0') + '.<br>');
      }) }] },

    { num: '11', outcome: RF5, stem: 'Solve each equation exactly. Choose an efficient method (the worked solution names it).', parts: [
      { id: '11a', level: 'BEG', make: mk(function (r) {
        var o = pickWhere(function () { return { a: r.int(2, 5), p: nz(r, 1, 6), m: r.pick([2, 3, 5, 6, 7, 10, 11, 13]) }; }, function (o) { return !(o.a === 2 && o.p === 3 && o.m === 7); });
        var q = -o.a * o.m, vals = [o.p + Math.sqrt(o.m), o.p - Math.sqrt(o.m)];
        return A.rootsPart(CP, t(o.a + '(x' + sT(-o.p) + ')^{2}' + sT(q) + '=0'), vals, { exact: true, keyTex: 'x=' + o.p + '\\pm\\sqrt{' + o.m + '}', wrongs: [{ vals: [-o.p + Math.sqrt(o.m), -o.p - Math.sqrt(o.m)], code: CP + 'zero-sign', hint: 'From ' + t('x' + sT(-o.p) + '=\\pm\\sqrt{' + o.m + '}') + ', add ' + t(String(o.p)) + ' to both sides.' }, { vals: [o.p + Math.sqrt(-q), o.p - Math.sqrt(-q)], code: CP + 'qf-diva', hint: 'Divide both sides by ' + t(String(o.a)) + ' before taking the square root.' }] },
          'Square roots: ' + t(o.a + '(x' + sT(-o.p) + ')^{2}=' + (-q)) + ' &nbsp;⇒&nbsp; ' + t('(x' + sT(-o.p) + ')^{2}=' + o.m) + ' &nbsp;⇒&nbsp; ' + t('x' + sT(-o.p) + '=\\pm\\sqrt{' + o.m + '}') + '<br>' + t('x=' + o.p + '\\pm\\sqrt{' + o.m + '}'),
          ['The equation is ' + t('a(x-p)^{2}+q=0') + ': isolate the square and take square roots.', 'Remember ' + t('\\pm') + '.'], 'square roots');
      }) },
      { id: '11b', level: 'EMG', make: mk(function (r) {
        var o = pickWhere(function () { return { m: r.int(2, 4), n: nz(r, 1, 5), k: r.int(2, 4), l: nz(r, 1, 5) }; }, function (o) { return gcd(o.m, o.n) === 1 && gcd(o.k, o.l) === 1 && o.m * o.k <= 12 && o.m * o.l - o.n * o.k !== 0 && o.n * o.k !== -o.l * o.m && !(o.m === 3 && o.n === 2 && o.k === 2 && o.l === 1) && !(o.m === 2 && o.n === 1 && o.k === 1 && o.l === 2); });
        var a = o.m * o.k, b = o.m * o.l - o.n * o.k, c = -o.n * o.l, r1 = o.n / o.m, r2 = -o.l / o.k;
        var fac = '(' + Z.linTex(o.m, -o.n) + ')(' + Z.linTex(o.k, o.l) + ')';
        return A.rootsPart(CP, t(genT(a, b, c) + '=0'), [r1, r2], { exact: true, keyTex: 'x=' + rT(r1) + ',\\ x=' + rT(r2), wrongs: [{ vals: [-r1, -r2], code: CP + 'zero-sign', hint: 'Set each factor equal to ' + t('0') + ' and solve: ' + t(Z.linTex(o.m, -o.n) + '=0') + ' gives ' + t('x=' + rT(r1)) + '.' }, { vals: [1 / r1, 1 / r2], code: CP + 'zero-recip', hint: t(Z.linTex(o.m, -o.n) + '=0') + ' gives ' + t(o.m + 'x=' + o.n) + ', so ' + t('x=' + rT(r1)) + ' (divide by ' + t(String(o.m)) + ').' }] },
          'Factoring (decomposition, ' + t('ac=' + a * c) + '): ' + t(genT(a, b, c) + '=' + fac + '=0') + '<br>' + t('x=' + rT(r1)) + ' or ' + t('x=' + rT(r2)),
          ['It factors: find two numbers with product ' + t('ac') + ' and sum ' + t('b') + '.', 'Set each factor equal to ' + t('0') + '.'], 'factoring');
      }) },
      { id: '11c', level: 'EMG', make: mk(function (r) {
        var o = pickWhere(function () { return { a: r.int(1, 3), b: nz(r, 1, 6), c: r.int(1, 12) }; }, function (o) { return o.b * o.b - 4 * o.a * o.c < 0 && !(o.a === 1 && o.b === 2 && o.c === 5); });
        var D = o.b * o.b - 4 * o.a * o.c, s = Math.sqrt(-D);
        return A.rootsPart(CP, t(genT(o.a, o.b, o.c) + '=0'), [], { wrongs: [{ vals: [(-o.b + s) / (2 * o.a), (-o.b - s) / (2 * o.a)], code: CP + 'none-roots', hint: 'The discriminant ' + t(String(D)) + ' is negative: there is no real square root of a negative number.' }] },
          'Formula: ' + t('b^{2}-4ac=' + par(o.b) + '^{2}-4(' + o.a + ')(' + o.c + ')=' + D + '<0') + '.<br>No real roots.', ['It doesn’t factor: use the formula. Start with ' + t('b^{2}-4ac') + '.', 'If the discriminant is negative, there are no real roots.'], 'no real roots');
      }) }] },

    { num: '12', outcome: RF5, parts: [
      { id: '12a', level: 'BEG', make: mk(function (r) {
        var kinds = r.shuffle(['two', 'one', 'none']), rows = [], want = {}, sol = [];
        kinds.forEach(function (k, i) {
          var a, b, c;
          if (k === 'one') { var m = r.int(2, 5), n = nz(r, 1, 5); while (gcd(m, n) !== 1) n = nz(r, 1, 5); a = m * m; b = -2 * m * n; c = n * n; }
          else { var z = pickWhere(function () { return { a: r.int(1, 5), b: nz(r, 1, 9), c: nz(r, 1, 9) }; }, function (z) { var D = z.b * z.b - 4 * z.a * z.c; return k === 'two' ? D > 0 : D < 0; }); a = z.a; b = z.b; c = z.c; }
          var id = ['i', 'ii', 'iii'][i], D = b * b - 4 * a * c;
          rows.push({ id: id, html: '(' + id + ') ' + t(genT(a, b, c) + '=0') }); want[id] = k;
          sol.push('(' + id + ') ' + t(par(b) + '^{2}-4(' + a + ')(' + c + ')=' + D) + (D > 0 ? ' > 0: two distinct real roots' : D < 0 ? ' < 0: no real roots' : ': one real (equal) root'));
        });
        return KP.grid('Without solving, determine the nature of the roots of each equation.', rows, [{ id: 'two', html: 'two distinct real roots' }, { id: 'one', html: 'one real (equal) root' }, { id: 'none', html: 'no real roots' }], want, {}, sol.join('<br>'),
          ['Work out the discriminant ' + t('b^{2}-4ac') + ' for each equation.', 'Positive: two distinct real roots; zero: one (equal) root; negative: no real roots.'], 'nature of the roots');
      }) },
      { id: '12b', level: 'PRG', make: mk(function (r) {
        var o = pickWhere(function () { return { a: r.pick([1, 2, 3, 4, 9]), c: r.pick([1, 2, 3, 4, 8, 9, 12, 16, 18, 25]) }; }, function (o) { return isSq(o.a * o.c) && o.a * o.c > 1 && !(o.a === 2 && o.c === 8) && !(o.a === 1 && o.c === 9); });
        var K2 = 2 * Math.sqrt(o.a * o.c);
        return A.rootsPart(CP, 'Determine the values of ' + t('k') + ' for which ' + t(Z.aTex(o.a) + 'x^{2}+kx+' + o.c + '=0') + ' has equal roots.', [K2, -K2], { v: 'k', keyTex: 'k=\\pm ' + K2, missHint: 'Solving ' + t('k^{2}=' + K2 * K2) + ' gives two values.', wrongs: [{ vals: [Math.sqrt(o.a * o.c), -Math.sqrt(o.a * o.c)], code: CP + 'disc-4', hint: 'Use ' + t('b^{2}-4ac=0') + ': ' + t('k^{2}-4(' + o.a + ')(' + o.c + ')=0') + '.' }, { vals: [K2], code: CP + 'k-one', hint: t('k^{2}=' + K2 * K2) + ' has two solutions.' }] },
          'Equal roots: ' + t('b^{2}-4ac=0') + ', so ' + t('k^{2}-4(' + o.a + ')(' + o.c + ')=0') + ', ' + t('k^{2}=' + K2 * K2) + ' and ' + t('k=\\pm ' + K2) + '.', ['Equal roots: the discriminant is ' + t('0') + '.', 'Solve ' + t('k^{2}-4ac=0') + ': a square root has two signs.'], 'k for equal roots');
      }) },
      { id: '12c', level: 'PRG', make: mk(function (r) {
        var o = pickWhere(function () { return { a: r.pick([1, 1, 2, 3]), b: nz(r, 1, 10), ask: r.pick(['none', 'none', 'two']) }; }, function (o) { return !(o.a === 1 && o.b === -4) && !(o.a === 1 && Math.abs(o.b) === 6); });
        var Bd = o.b * o.b / (4 * o.a), op = o.ask === 'none' ? '>' : '<', flip = o.ask === 'none' ? '<' : '>', st = o.ask === 'none' ? '\\ge ' : '\\le ';
        var S = function (oo, x) { return '\\{k\\mid k' + oo + rT(x) + ',\\ k\\in\\mathbb{R}\\}'; };
        return fixSet(KP.set('Determine the values of ' + t('k') + ' for which ' + t(genT(o.a, o.b, 0) + '+k=0') + ' has ' + (o.ask === 'none' ? 'no real roots' : 'two distinct real roots') + '.', S(op, Bd), { v: 'k', wrong: [{ is: S(flip, Bd), code: CP + 'k-dir', hint: 'Solve the inequality carefully: dividing by a negative number reverses it.' }, { is: S(st, Bd), code: CP + 'k-strict', hint: 'At ' + t('k=' + rT(Bd)) + ' the discriminant is ' + t('0') + ': one (equal) root. Leave it out.' }, { is: S(op, o.b * o.b / o.a), code: CP + 'disc-4', hint: 'The discriminant is ' + t('b^{2}-4ac') + ' — the 4 matters.' }] },
          t('b^{2}-4ac=' + o.b * o.b + '-' + 4 * o.a + 'k') + '.<br>' + (o.ask === 'none' ? 'No real roots' : 'Two distinct real roots') + ': ' + t(o.b * o.b + '-' + 4 * o.a + 'k' + (o.ask === 'none' ? '<0' : '>0')) + ', so ' + t('k' + op + rT(Bd)) + '.',
          ['Write the discriminant in terms of ' + t('k') + '.', (o.ask === 'none' ? 'No real roots: ' + t('b^{2}-4ac<0') : 'Two distinct real roots: ' + t('b^{2}-4ac>0')) + '. Solve for ' + t('k') + '.'], 'values of k'));
      }) },
      { id: '12d', level: 'MAS', make: mk(function (r) {
        var o = pickWhere(function () { return { b: nz(r, 2, 8), c: nz(r, 1, 5) }; }, function (o) { return !(o.b === 4 && o.c === -2) && !(o.b === 4 && o.c === 1); });
        var Bd = o.b * o.b / (4 * o.c), neg = o.c < 0, op = neg ? '>' : '<', flip = neg ? '<' : '>', st = neg ? '\\ge ' : '\\le ';
        var S = function (oo, x, z) { return '\\{m\\mid m' + oo + rT(x) + (z ? ',\\ m\\ne 0' : '') + ',\\ m\\in\\mathbb{R}\\}'; };
        return fixSet(KP.set('Determine the values of ' + t('m') + ' for which ' + t('mx^{2}' + sT(o.b) + 'x' + sT(o.c) + '=0') + ' has two distinct real roots.', S(op, Bd, true), { v: 'm', wrong: [{ is: S(op, Bd, false), code: CP + 'k-zero', hint: 'Almost: if ' + t('m=0') + ' the equation isn’t quadratic (it has only one root). Add ' + t('m\\ne 0') + '.' }, { is: S(flip, Bd, true), code: CP + 'k-dir', hint: 'Solve the inequality carefully: dividing by a negative number reverses it.' }, { is: S(flip, Bd, false), code: CP + 'k-dir', hint: 'Solve the inequality carefully: dividing by a negative number reverses it.' }, { is: S(st, Bd, true), code: CP + 'k-strict', hint: 'At ' + t('m=' + rT(Bd)) + ' the roots are equal. Leave it out.' }] },
          t('b^{2}-4ac=' + o.b * o.b + '-4(m)(' + o.c + ')=' + o.b * o.b + sT(-4 * o.c) + 'm') + '.<br>Two distinct real roots: ' + t(o.b * o.b + sT(-4 * o.c) + 'm>0') + ', so ' + t('m' + op + rT(Bd)) + '; also ' + t('m\\ne 0') + ' (otherwise the equation is not quadratic).<br>' + t('m' + op + rT(Bd) + ',\\ m\\ne 0'),
          ['Two distinct real roots: ' + t('b^{2}-4ac>0') + ' with ' + t('a=m') + '.', 'What happens to the equation when ' + t('m=0') + '?'], 'parameter in the leading coefficient'));
      }) },
      { id: '12e', level: 'EMG', make: mk(function (r) {
        var kind = r.pick(['none', 'none', 'two', 'one']), z;
        if (kind === 'one') { var m = r.int(1, 3), n = nz(r, 1, 4), s = r.pick([1, -1]); z = { a: s * m * m, b: -2 * s * m * n, c: s * n * n }; }
        else z = pickWhere(function () { return { a: nz(r, 1, 4), b: nz(r, 1, 6), c: nz(r, 1, 6) }; }, function (o) { var D = o.b * o.b - 4 * o.a * o.c; return (kind === 'two' ? D > 0 : D < 0) && !(o.a === -3 && o.b === 2 && o.c === -1); });
        var D = z.b * z.b - 4 * z.a * z.c, n = D > 0 ? 2 : D === 0 ? 1 : 0, up = z.a > 0, pos = D < 0 ? (up ? 'above' : 'below') : D === 0 ? 'on' : (up ? 'below' : 'above');
        var lab = function (k) { return '<b>' + k + '</b> ' + t('x') + '-intercept' + (k === 1 ? '' : 's') + ': '; };
        var opts = [{ html: lab(n) + t('b^{2}-4ac=' + D) + (D > 0 ? '>0' : D < 0 ? '<0' : '') + '; the parabola opens ' + (up ? 'up' : 'down') + ' and its vertex is ' + pos + ' the ' + t('x') + '-axis.', right: true }];
        var D2 = z.b * z.b + 4 * z.a * z.c, n2 = D2 > 0 ? 2 : D2 === 0 ? 1 : 0;
        if (n2 !== n) opts.push({ html: lab(n2) + t('b^{2}-4ac=' + D2) + (D2 > 0 ? '>0' : D2 < 0 ? '<0' : '') + '.', why: 'Check the sign of ' + t('-4ac=-4(' + z.a + ')(' + z.c + ')') + '.' });
        [0, 1, 2].filter(function (k) { return k !== n && k !== n2; }).forEach(function (k) { opts.push({ html: lab(k) + (k === 2 ? 'the parabola opens ' + (up ? 'up' : 'down') + ', so it must cross the ' + t('x') + '-axis twice.' : k === 1 ? 'the vertex is on the ' + t('x') + '-axis.' : 'the parabola opens ' + (up ? 'up' : 'down') + ', so it never meets the ' + t('x') + '-axis.'), why: 'Use the discriminant: ' + t('b^{2}-4ac=' + D) + '.' }); });
        return Z.mc(r, 'How many ' + t('x') + '-intercepts does the graph of ' + t('y=' + genT(z.a, z.b, z.c)) + ' have? Choose the answer with the right reason.', opts,
          t('b^{2}-4ac=' + par(z.b) + '^{2}-4(' + z.a + ')(' + z.c + ')=' + D) + ': ' + (n === 2 ? 'two' : n === 1 ? 'one' : 'no') + ' real root' + (n === 1 ? '' : 's') + ', so ' + n + ' ' + t('x') + '-intercept' + (n === 1 ? '' : 's') + '. The parabola opens ' + (up ? 'up' : 'down') + ' and its vertex is ' + pos + ' the ' + t('x') + '-axis.',
          ['The number of ' + t('x') + '-intercepts is the number of real roots of ' + t('y=0') + ': use the discriminant.'], 'x-intercepts from the discriminant');
      }) }] },

    { num: '13', shared: function (r) {
        return pickWhere(function () { return { m: r.pick([0.2, 0.4, 0.5, 0.4]), h: r.int(20, 60), d: r.int(10, 35), e: r.int(5, 30) }; }, function (o) {
          var mx = o.m * o.d * o.d, c = o.m * (o.h * o.h - o.d * o.d), k = o.m * (o.d * o.d - o.e * o.e);
          return o.h - o.d >= 5 && o.e < o.d - 3 && isInt(mx) && isInt(c) && c >= 100 && isInt(k) && Math.round(k) % 10 === 0 && k >= 50 && !(o.m === 0.4 && o.h === 45 && o.d === 30);
        });
      }, stem: function (s) { kit(); return 'A bakery’s daily profit, ' + t('P') + ' dollars, from selling ' + t('x') + ' dozen cookies is modelled by ' + t('P=' + decT([-s.m, 2 * s.m * s.h, -s.m * (s.h * s.h - s.d * s.d)])) + '. Use a graphing calculator (or algebra) to answer.'; }, parts: [
      { id: '13a', level: 'PRG', outcome: RF4, make: mk(function (r, s) {
        var mx = s.m * s.d * s.d, c = s.m * (s.h * s.h - s.d * s.d), b = 2 * s.m * s.h;
        return Z.fields('How many dozen should be sold to make the maximum profit? What is the maximum profit?', [{ label: 'Number of dozen:', name: 'Dozen', ans: s.h, cands: [[mx, CP + 'ctx-time', 'That is the profit. The number of dozen is the ' + t('x') + '-coordinate of the vertex.']] }, { label: 'Maximum profit:', name: 'Maximum profit', before: '$', ans: mx, cands: [[s.h, CP + 'ctx-time', 'That is the number of dozen. The maximum profit is the ' + t('P') + '-coordinate of the vertex.'], [c, CP + 'ctx-c', 'That is the daily cost (the ' + t('P') + '-intercept, made positive).']] }],
          { sol: 'Maximum at ' + t(ptT(s.h, mx)) + ': ' + t(String(s.h)) + ' dozen, ' + t('\\$' + mx) + '.<br>(' + t('x=-\\frac{' + F(b) + '}{2(' + F(-s.m) + ')}=' + s.h) + '; ' + t('P=' + F(-s.m) + '(' + s.h + ')^{2}+' + F(b) + '(' + s.h + ')-' + F(c) + '=' + mx) + '.)', hints: ['Graph the function and use <b>maximum</b>, or use ' + t('x=-\\frac{b}{2a}') + '.'], text: 'maximum profit' });
      }) },
      { id: '13b', level: 'PRG', outcome: RF5, make: mk(function (r, s) {
        var z1 = s.h - s.d, z2 = s.h + s.d;
        return A.rootsPart(CP, 'How many dozen must be sold to break even (' + t('P=0') + ')?', [z1, z2], { exact: false, keyTex: 'x=' + z1 + ',\\ x=' + z2, wrongs: [{ vals: [s.h], code: CP + 'ctx-time', hint: 'That is where the profit is greatest. Break even means ' + t('P=0') + ': the zeros.' }] },
          'Zeros: ' + t('x=' + z1) + ' and ' + t('x=' + z2) + ' dozen. (' + t(F(-s.m) + '(x^{2}-' + 2 * s.h + 'x+' + (s.h * s.h - s.d * s.d) + ')=' + F(-s.m) + '(x-' + z1 + ')(x-' + z2 + ')=0') + ')',
          ['Break even means the profit is ' + t('0') + ': find the zeros (calculator <b>zero</b>, or factor).', 'There are two.'], 'break-even points');
      }) },
      { id: '13c', level: 'ADV', outcome: RF5, make: mk(function (r, s) {
        var k = s.m * (s.d * s.d - s.e * s.e), x1 = s.h - s.e, x2 = s.h + s.e, S = function (lo, hi, st) { return '\\{x\\mid ' + lo + (st ? '<' : '\\le ') + 'x' + (st ? '<' : '\\le ') + hi + ',\\ x\\in\\mathbb{R}\\}'; };
        return fixSet(KP.set('For what numbers of dozens is the profit at least ' + t('\\$' + k) + '?', S(x1, x2), { v: 'x', wrong: [{ is: S(s.h - s.d, s.h + s.d), code: CP + 'set-zeros', hint: 'Between the zeros the profit is positive. Here it must be at least ' + t('\\$' + k) + ': intersect with ' + t('P=' + k) + '.' }] },
          'Intersect with ' + t('P=' + k) + ': ' + t('x=' + x1) + ' and ' + t('x=' + x2) + ' (' + t('(x-' + x1 + ')(x-' + x2 + ')=0') + '). The profit is at least ' + t('\\$' + k) + ' from ' + t(String(x1)) + ' to ' + t(String(x2)) + ' dozen: ' + t(S(x1, x2)) + '.',
          ['Graph ' + t('P=' + k) + ' too and use <b>intersect</b> twice (or solve ' + t('P=' + k) + ').', 'Between the two intersections the profit is above the line.'], 'profit at least a value'));
      }) },
      { id: '13d', level: 'EMG', outcome: RF4, make: mk(function (r, s) {
        var c = s.m * (s.h * s.h - s.d * s.d);
        return Z.mc(r, 'What does the ' + t('P') + '-intercept mean in this context?', [{ html: 'At ' + t('x=0') + ', ' + t('P=-' + c) + ': with no sales the bakery loses ' + t('\\$' + c) + ' (its daily costs).', right: true },
          { html: 'With no sales the bakery makes a profit of ' + t('\\$' + c) + '.', why: 'The ' + t('P') + '-intercept is negative: a loss.' }, { html: 'The bakery must sell ' + t(String(c)) + ' dozen to break even.', why: 'The break-even points are the zeros (where ' + t('P=0') + '), not the ' + t('P') + '-intercept.' }, { html: 'The greatest possible loss is ' + t('\\$' + c) + ', at the maximum.', why: 'The ' + t('P') + '-intercept is the value at ' + t('x=0') + '. The maximum is at the vertex.' }],
          'At ' + t('x=0') + ', ' + t('P=-' + c) + ': selling nothing, the bakery loses ' + t('\\$' + c) + ' a day (its costs).', ['Substitute ' + t('x=0') + '. What does a negative profit mean?'], 'meaning of the P-intercept');
      }) }] },

    { num: '14', outcome: RF4, parts: [
      { id: '14', level: 'PRG', make: mk(function (r) {
        var L = 4 * r.int(10, 60), ctx = r.pick([['the side of a barn', 'The barn wall'], ['a straight river bank', 'The river'], ['a long stone wall', 'The wall']]);
        if (L === 120) L = 128;
        var w = L / 4, l = L / 2, Ar = L * L / 8;
        return Z.fields('A farmer has ' + t(L) + ' m of fencing to build a rectangular pen along ' + ctx[0] + '. ' + ctx[1] + ' forms one side and needs no fence. Determine the dimensions that give the maximum area, and the maximum area.', [
          { label: 'Each side perpendicular to ' + ctx[1].replace('The ', 'the ') + ':', name: 'Width', ans: w, after: 'm', cands: [[L / 3, CP + 'fence-4', 'Only three sides are fenced: two widths and one length, ' + t('2x+(' + L + '-2x)') + '.']] },
          { label: 'Side parallel to ' + ctx[1].replace('The ', 'the ') + ':', name: 'Length', ans: l, after: 'm', cands: [[w, CP + 'fence-4', 'Only three sides are fenced. The side along ' + ctx[1].replace('The ', 'the ') + ' is ' + t(L + '-2x') + '.']] },
          { label: 'Maximum area:', name: 'Maximum area', ans: Ar, after: 'm²', cands: [[L * L / 16, CP + 'fence-4', 'That is the area if all four sides were fenced. Here only three are.'], [L * L / 9, CP + 'fence-4', 'Let ' + t('x') + ' be each width: the length is ' + t(L + '-2x') + '.']] }],
          { sol: 'Let ' + t('x') + ' be each side perpendicular to ' + ctx[1].replace('The ', 'the ') + '; the parallel side is ' + t(L + '-2x') + '.<br>' + t('A=x(' + L + '-2x)=-2x^{2}+' + L + 'x=-2(x^{2}-' + L / 2 + 'x+' + w * w + '-' + w * w + ')=-2(x-' + w + ')^{2}+' + Ar) + '.<br>Vertex ' + t(ptT(w, Ar)) + ': the pen is ' + t(w) + ' m by ' + t(l) + ' m (' + t(l) + ' m along ' + ctx[1].replace('The ', 'the ') + '), with a maximum area of ' + t(Ar) + ' m².',
            hints: ['Let ' + t('x') + ' be the width; three sides are fenced, so the length is ' + t(L + '-2x') + '.', 'Write the area as a quadratic and find its vertex.'], text: 'fencing along a wall' });
      }) }] },

    { num: '15', outcome: RF5, parts: [
      { id: '15', level: 'MAS', make: mk(function (r) {
        var o = pickWhere(function () { return { d: r.int(1, 7), D: r.int(8, 20) }; }, function (o) { var N = 2 * o.D * o.D - o.d * o.d; return o.D > o.d + 3 && !isSq(N) && sqf(N)[0] > 1 && !(o.d === 4 && o.D === 12); });
        var N = 2 * o.D * o.D - o.d * o.d, sp = sqf(N), w = (-o.d + Math.sqrt(N)) / 2, wn = (-o.d - Math.sqrt(N)) / 2;
        var g = gcd(gcd(o.d, sp[0]), 2), A0 = -o.d / g, B0 = sp[0] / g, D0 = 2 / g, num = A0 + '+' + (B0 === 1 ? '' : B0) + '\\sqrt{' + sp[1] + '}', exactT = D0 === 1 ? num : '\\frac{' + num + '}{' + D0 + '}';
        var pe = A.rootsPart(CP, '', [w], { v: 'w', exact: true, keyTex: 'w=' + exactT, wrongs: [{ vals: [w, wn], code: CP + 'neg-root', hint: 'A width must be positive: reject the negative root.' }, { vals: [wn], code: CP + 'neg-root', hint: 'A width must be positive: use the other root.' }, { vals: [w + o.d], code: CP + 'gave-other', hint: 'That is the length. The question asks for the width.' }] });
        return Z.fields('The length of a rectangle is ' + t(o.d) + ' cm more than its width, and its diagonal is ' + t(o.D) + ' cm. Determine the width, exactly and to the nearest tenth of a centimetre.', [
          { label: 'Exact width:', name: 'Exact width', check: pe.check, key: pe.key, ansTex: pe.key, math: true, placeholder: 'e.g. w = -2 + 2sqrt(17)' },
          { label: 'Width to the nearest tenth:', name: 'Rounded width', ans: w, dp: 1, after: 'cm', cands: [[w + o.d, CP + 'gave-other', 'That is the length. The question asks for the width.'], [Math.abs(wn), CP + 'neg-root', 'That comes from the negative root, which is inadmissible.']] }],
          { sol: t('w^{2}+(w+' + o.d + ')^{2}=' + o.D * o.D) + ' &nbsp;⇒&nbsp; ' + t('2w^{2}+' + 2 * o.d + 'w' + sT(o.d * o.d - o.D * o.D) + '=0') + '.<br>' + t('w=\\frac{-' + 2 * o.d + '\\pm\\sqrt{' + 4 * o.d * o.d + '+' + (-8 * (o.d * o.d - o.D * o.D)) + '}}{4}=\\frac{-' + 2 * o.d + '\\pm\\sqrt{' + 4 * N + '}}{4}=\\frac{-' + o.d + '\\pm\\sqrt{' + N + '}}{2}') + (sp[0] > 1 ? ', and ' + t('\\sqrt{' + N + '}=' + sp[0] + '\\sqrt{' + sp[1] + '}') : '') + '.<br>A width must be positive: ' + t('w=' + exactT + '\\approx ' + fx(w, 1)) + ' cm (the other root is inadmissible).',
            hints: ['Use the Pythagorean theorem: ' + t('w^{2}+(w+' + o.d + ')^{2}=' + o.D + '^{2}') + '.', 'Write it in standard form, use the quadratic formula, simplify the radical and reject the negative root.'], text: 'rectangle from its diagonal' });
      }) }] },

    { num: '16', section: 'Multiple Choice and Numerical Response', outcome: RF5, parts: [
      { id: '16', level: 'EMG', make: mk(function (r) {
        var o = pickWhere(function () { return { r1: nz(r, 1, 6), r2: nz(r, 1, 6), rt: nz(r, 2, 9), f: r.int(2, 9) }; }, function (o) { return o.r1 < o.r2 && o.r1 + o.r2 !== 0 && !(o.r1 === -2 && o.r2 === 4); });
        var eq = genT(1, -(o.r1 + o.r2), o.r1 * o.r2);
        var topics = {
          zeros: { T: 'The roots of ' + t(eq + '=0') + ' are the zeros of the function ' + t('y=' + eq) + '.' },
          factor: { T: 'If ' + t('x=' + o.rt) + ' is a root of ' + t('ax^{2}+bx+c=0') + ', then ' + t('(' + Z.binTex('x', o.rt) + ')') + ' is a factor of ' + t('ax^{2}+bx+c') + '.', F: 'If ' + t('x=' + o.rt) + ' is a root of ' + t('ax^{2}+bx+c=0') + ', then ' + t('(' + Z.binTex('x', -o.rt) + ')') + ' is a factor of ' + t('ax^{2}+bx+c') + '.', why: 'A root ' + t('x=' + o.rt) + ' gives the factor ' + t('(' + Z.binTex('x', o.rt) + ')') + '.' },
          icpt: { T: 'If ' + t('x+' + o.f) + ' is a factor of ' + t('ax^{2}+bx+c') + ', then the graph of ' + t('y=ax^{2}+bx+c') + ' has an ' + t('x') + '-intercept at ' + t('(-' + o.f + ',\\ 0)') + '.', F: 'If ' + t('x+' + o.f) + ' is a factor of ' + t('ax^{2}+bx+c') + ', then the graph of ' + t('y=ax^{2}+bx+c') + ' has an ' + t('x') + '-intercept at ' + t('(' + o.f + ',\\ 0)') + '.', why: 'The factor ' + t('x+' + o.f) + ' gives the zero ' + t('x=-' + o.f) + ', so the ' + t('x') + '-intercept is ' + t('(-' + o.f + ',\\ 0)') + '.' },
          vert: { T: 'A quadratic function whose vertex is on the ' + t('x') + '-axis has exactly one zero.', F: 'A quadratic function whose graph opens down from a vertex above the ' + t('x') + '-axis has no zeros.', why: 'It opens down from above the axis, so it crosses the ' + t('x') + '-axis twice: two zeros.' } };
        var falseT = r.pick(['icpt', 'icpt', 'factor', 'vert']);
        var opts = ['zeros', 'factor', 'icpt', 'vert'].map(function (k) { return k === falseT ? { html: topics[k].F, right: true } : { html: topics[k].T, why: 'That statement is true.' }; });
        return Z.mc(r, 'Which statement is <b>false</b>?', opts, topics[falseT].why, ['Test each statement: a root ' + t('r') + ' ↔ a factor ' + t('(x-r)') + ' ↔ an ' + t('x') + '-intercept ' + t('(r,\\ 0)') + '.'], 'zeros, roots, factors, intercepts');
      }) }] },
    { num: '17', outcome: RF3, parts: [
      { id: '17', level: 'BEG', make: mk(function (r) {
        var o = pickWhere(function () { return { h: nz(r, 1, 6), k: nz(r, 1, 6) }; }, function (o) { return Math.abs(o.h) !== Math.abs(o.k) && !(o.h === 3 && o.k === -2); });
        var f = function (p, q) { return t('y=' + vfT(1, p, q)); };
        return Z.mc(r, 'The graph of ' + t('y=x^{2}') + ' is translated ' + hW(o.h) + ' and ' + vW(o.k) + '. The equation of the new graph is', [{ html: f(o.h, o.k), right: true }, { html: f(-o.h, o.k), why: 'Moving ' + hW(o.h) + ' gives ' + t('(' + Z.binTex('x', o.h) + ')^{2}') + '.' }, { html: f(o.k, o.h), why: 'The horizontal translation goes inside the bracket, the vertical one outside.' }, { html: f(o.h, -o.k), why: 'Moving ' + vW(o.k) + ' gives ' + t(sT(o.k)) + ' outside the bracket.' }],
          t('(' + Z.binTex('x', o.h) + ')^{2}') + ' moves the graph ' + hW(o.h) + '; ' + t(sT(o.k)) + ' moves it ' + vW(o.k) + ': ' + f(o.h, o.k) + '.', ['Right ' + t('p') + ' gives ' + t('(x-p)') + ' inside the square; up ' + t('q') + ' gives ' + t('+q') + '.'], 'equation of a translation');
      }) }] },
    { num: '18', outcome: RF3, parts: [
      { id: '18', level: 'EMG', make: mk(function (r) {
        var o = pickWhere(function () { return { a: r.int(1, 9), p: nz(r, 1, 6), q: nz(r, 1, 9), d: nz(r, 1, 3) }; }, function (o) { return !(o.a === 3 && o.p === 3 && o.q === -7) && (o.a >= 2 || Math.abs(o.d) >= 2); });
        var x1 = o.p + o.d, y1 = o.a * o.d * o.d + o.q;
        return Z.num('<i>(Numerical Response)</i> The graph of ' + t('y=a' + '(' + Z.binTex('x', o.p) + ')^{2}' + sT(o.q)) + ' passes through the point ' + t(ptT(x1, y1)) + '. The value of ' + t('a') + ' is ____.', o.a, { nr: true, outcome: RF3, cands: [[(y1 - o.q) / o.d, CP + 'vp-nosq', 'Square the bracket: ' + t('(' + x1 + sT(-o.p) + ')^{2}=' + o.d * o.d) + '.'], [(y1 + o.q) / (o.d * o.d), CP + 'vf-qsign', 'Move ' + t(sT(o.q)) + ' to the other side carefully.']],
          sol: t(y1 + '=a(' + x1 + sT(-o.p) + ')^{2}' + sT(o.q)) + ' &nbsp;⇒&nbsp; ' + t(o.d * o.d + 'a=' + (y1 - o.q)) + ' &nbsp;⇒&nbsp; ' + t('a=' + o.a), hints: ['Substitute the point for ' + t('x') + ' and ' + t('y') + ', then solve for ' + t('a') + '.'], text: 'NR: the value of a' });
      }) }] },
    { num: '19', outcome: RF3, parts: [
      { id: '19', level: 'BEG', make: mk(function (r) {
        var o = pickWhere(function () { return { a: nz(r, 1, 5), p: nz(r, 1, 6), q: nz(r, 1, 9) }; }, function (o) { return o.p !== o.q && !(o.a === -3 && o.p === -1 && o.q === 5); });
        var up = o.a > 0, S = function (op, x) { return t('\\{y\\mid y' + op + x + ',\\ y\\in\\mathbb{R}\\}'); };
        return Z.mc(r, 'The range of ' + t('y=' + vfT(o.a, o.p, o.q)) + ' is', [{ html: S(up ? '\\ge ' : '\\le ', o.q), right: true }, { html: S(up ? '\\le ' : '\\ge ', o.q), why: t('a=' + o.a) + (up ? ' > 0: the graph opens up from its minimum.' : ' < 0: the graph opens down from its maximum.') }, { html: S(up ? '\\ge ' : '\\le ', o.p), why: 'The range uses the ' + t('y') + '-coordinate of the vertex, ' + t('q=' + o.q) + '.' }, { html: S(up ? '\\le ' : '\\ge ', o.p), why: 'The range uses the ' + t('y') + '-coordinate of the vertex, and the direction of opening.' }],
          t('a' + (up ? '>0' : '<0')) + ', so the graph opens ' + (up ? 'up from the minimum' : 'down from the maximum') + ' value ' + t('q=' + o.q) + ': ' + S(up ? '\\ge ' : '\\le ', o.q) + '.', ['The range starts at ' + t('q') + ' and goes the way the parabola opens.'], 'range from vertex form');
      }) }] },
    { num: '20', outcome: RF4, parts: [
      { id: '20', level: 'EMG', make: mk(function (r) {
        var o = pickWhere(function () { return { h: nz(r, 1, 6), c: nz(r, 1, 15) }; }, function (o) { var k = o.c - o.h * o.h; return k !== o.c && k !== 0 && !(o.h === -4 && o.c === 10) && o.h !== k && 2 * o.h !== o.c; });
        var b = -2 * o.h, k = o.c - o.h * o.h;
        return Z.mc(r, 'The vertex of the graph of ' + t('y=' + genT(1, b, o.c)) + ' is', [{ html: t(ptT(o.h, k)), right: true }, { html: t(ptT(-o.h, k)), why: 'The axis is ' + t('x=-\\frac{b}{2a}=' + o.h) + '.' }, { html: t(ptT(o.h, o.c)), why: t(String(o.c)) + ' is the ' + t('y') + '-intercept. Substitute ' + t('x=' + o.h) + ' for the vertex.' }, { html: t(ptT(-b, o.c)), why: 'Half of ' + t(String(b)) + ' gives the bracket; the vertex is ' + t('(-\\frac{b}{2a},\\ \\ldots)') + '.' }],
          t('y=(x^{2}' + sT(b) + 'x+' + o.h * o.h + '-' + o.h * o.h + ')' + sT(o.c) + '=' + vfT(1, o.h, k)) + ': vertex ' + t(ptT(o.h, k)) + '. (Or ' + t('x=-\\frac{' + par(b) + '}{2}=' + o.h) + ', ' + t('y=' + k) + '.)', ['Complete the square, or use ' + t('x=-\\frac{b}{2a}') + ' and substitute.'], 'vertex of general form');
      }) }] },
    { num: '21', outcome: RF4, parts: [
      { id: '21', level: 'PRG', make: mk(function (r) {
        var o = pickWhere(function () { return { a: r.int(1, 9), b: r.int(1, 9) }; }, function (o) { return o.a !== o.b && !(o.a === 5 && o.b === 7); });
        var c = o.a * o.a + o.b;
        return Z.num('<i>(Numerical Response)</i> The function ' + t('y=' + genT(1, -2 * o.a, c)) + ' can be written in the form ' + t('y=(x-a)^{2}+b') + '. Write the value of ' + t('a') + ' in the first box and the value of ' + t('b') + ' in the second box.', 10 * o.a + o.b, { nr: true, outcome: RF4, cands: [[10 * o.b + o.a, CP + 'nr-order', t('a') + ' goes in the first box and ' + t('b') + ' in the second.'], [10 * o.a + (c + o.a * o.a), CP + 'cts-add', 'The square you add inside the bracket has to be subtracted: ' + t(c + '-' + o.a * o.a) + '.']],
          sol: t('y=(x^{2}-' + 2 * o.a + 'x+' + o.a * o.a + '-' + o.a * o.a + ')+' + c + '=(x-' + o.a + ')^{2}+' + o.b) + ': ' + t('a=' + o.a) + ', ' + t('b=' + o.b) + '. Answer ' + t(String(10 * o.a + o.b)) + '.', hints: ['Complete the square: half of ' + t(String(-2 * o.a)) + ', squared.'], text: 'NR: completing the square' });
      }) }] },
    { num: '22', outcome: RF4, parts: [
      { id: '22', level: 'BEG', make: mk(function (r) {
        var o = pickWhere(function () { return { x1: nz(r, 1, 7), dx: 2 * r.int(2, 6), y0: nz(r, 1, 9) }; }, function (o) { var m = o.x1 + o.dx / 2; return [m, o.y0, o.dx, o.dx / 2].every(function (v, i, arr) { return arr.indexOf(v) === i; }) && !(o.x1 === -1 && o.dx === 6 && o.y0 === 7) && m !== 0; });
        var x2 = o.x1 + o.dx, m = (o.x1 + x2) / 2, f = function (v) { return t('x=' + v); };
        return Z.mc(r, 'A parabola passes through the points ' + t(ptT(o.x1, o.y0)) + ' and ' + t(ptT(x2, o.y0)) + '. The equation of its axis of symmetry is', [{ html: f(m), right: true }, { html: f(o.y0), why: 'The axis of symmetry is a vertical line ' + t('x=\\ldots') + ' midway between the two points.' }, { html: f(o.dx), why: 'That is the distance between the points. The axis is midway between them.' }, { html: f(o.dx / 2), why: 'That is half the distance. Add it to the left point’s ' + t('x') + '-value.' }],
          'Points with the same ' + t('y') + '-value are mirror images in the axis, so the axis is midway: ' + t('x=\\frac{' + o.x1 + '+' + par(x2) + '}{2}=' + m) + '.', ['Points at the same height are mirror images in the axis of symmetry.'], 'axis from two symmetric points');
      }) }] },
    { num: '23', outcome: RF3, parts: [
      { id: '23', level: 'EMG', make: mk(function (r) {
        var sg = r.pick([1, -1]), a = r.int(1, 4), p = nz(r, 1, 5), q = r.int(1, 6), f = function (A2, P2, Q2) { return t('y=' + vfT(A2, P2, Q2)); };
        return Z.mc(r, 'Which function has a graph with <b>no</b> ' + t('x') + '-intercepts?', [{ html: f(sg * a, p, sg * q), right: true }, { html: f(sg * a, p, -sg * q), why: t('a') + ' and ' + t('q') + ' have opposite signs: the parabola opens toward the ' + t('x') + '-axis from its vertex, so it crosses twice.' }, { html: f(-sg * a, p, sg * q), why: t('a') + ' and ' + t('q') + ' have opposite signs: two ' + t('x') + '-intercepts.' }, { html: f(-sg * a, -p, 0), why: t('q=0') + ': the vertex is on the ' + t('x') + '-axis, one ' + t('x') + '-intercept.' }],
          f(sg * a, p, sg * q) + ': it opens ' + (sg > 0 ? 'up' : 'down') + ' from a vertex ' + (sg > 0 ? 'above' : 'below') + ' the ' + t('x') + '-axis, so it never meets it.', [t('a') + ' and ' + t('q') + ' with the same sign: no ' + t('x') + '-intercepts.'], 'no x-intercepts');
      }) }] },
    { num: '24', outcome: RF5, parts: [
      { id: '24', level: 'PRG', make: mk(function (r) {
        var o = pickWhere(function () { return { a: r.pick([2, 3]), h: nz(r, 1, 5), c: nz(r, 1, 8) }; }, function (o) { var b = 2 * o.h, D = b * b - 4 * o.a * o.c, m = D / 4; return D > 0 && m > 1 && !isSq(m) && sqf(m)[0] === 1 && gcd(o.a, o.h) === 1 && b * b + 4 * o.a * o.c > 0 && !(o.a === 2 && o.h === -3 && o.c === 3); });
        var b = 2 * o.h, m = (b * b - 4 * o.a * o.c) / 4, m2 = (b * b + 4 * o.a * o.c) / 4, Ft = function (A2, rad, d) { return t('\\frac{' + A2 + '\\pm\\sqrt{' + rad + '}}{' + d + '}'); };
        var opts = [{ html: Ft(-o.h, m, o.a), right: true }, { html: Ft(o.h, m, o.a), why: 'The formula starts with ' + t('-b') + '.' }, { html: Ft(-b, m, 2 * o.a), why: t('\\sqrt{' + 4 * m + '}=2\\sqrt{' + m + '}') + ', not ' + t('\\sqrt{' + m + '}') + '.' }];
        opts.push(isSq(m2) ? { html: Ft(-o.h, m, 2 * o.a), why: 'Divide every term by the common factor: numerator and denominator.' } : { html: Ft(-o.h, m2, o.a), why: 'Check the sign of ' + t('-4ac') + ': ' + t('b^{2}-4ac=' + b * b + sT(-4 * o.a * o.c)) + '.' });
        return Z.mc(r, 'The roots of ' + t(genT(o.a, b, o.c) + '=0') + ' are', opts,
          t('x=\\frac{' + (-b) + '\\pm\\sqrt{' + b * b + sT(-4 * o.a * o.c) + '}}{' + 2 * o.a + '}=\\frac{' + (-b) + '\\pm\\sqrt{' + 4 * m + '}}{' + 2 * o.a + '}=\\frac{' + (-b) + '\\pm 2\\sqrt{' + m + '}}{' + 2 * o.a + '}=\\frac{' + (-o.h) + '\\pm\\sqrt{' + m + '}}{' + o.a + '}'), ['Use the formula, simplify the radical, then divide every term by the common factor.'], 'MC: quadratic formula');
      }) }] },
    { num: '25', outcome: RF5, parts: [
      { id: '25', level: 'PRG', make: mk(function (r) {
        var o = pickWhere(function () { return { a: r.int(2, 6), b: nz(r, 1, 8), c: -r.int(2, 12) }; }, function (o) { var D = o.b * o.b - 4 * o.a * o.c, x = (-o.b + Math.sqrt(D)) / (2 * o.a); return !isSq(D) && x < 10 && !(o.a === 3 && o.b === -4 && o.c === -9); });
        var D = o.b * o.b - 4 * o.a * o.c, x = (-o.b + Math.sqrt(D)) / (2 * o.a);
        return Z.apx('<i>(Numerical Response)</i> The positive root of ' + t(genT(o.a, o.b, o.c) + '=0') + ', to the nearest tenth, is ____.', x, 1, { nr: true, outcome: RF5, cands: [[(o.b + Math.sqrt(D)) / (2 * o.a), CP + 'qf-negb', 'The formula starts with ' + t('-b') + '.'], [(-o.b + Math.sqrt(D)) / o.a, CP + 'qf-2a', 'Divide by ' + t('2a') + '.']],
          sol: t('x=\\frac{' + (-o.b) + '+\\sqrt{' + o.b * o.b + '+' + (-4 * o.a * o.c) + '}}{' + 2 * o.a + '}=\\frac{' + (-o.b) + '+\\sqrt{' + D + '}}{' + 2 * o.a + '}\\approx ' + fx(x, 2)) + ', so ' + t(fx(x, 1)) + '.', hints: ['Use the quadratic formula with the ' + t('+') + ' sign (or graph and use <b>zero</b>).'], text: 'NR: positive root' });
      }) }] },
    { num: '26', outcome: RF5, parts: [
      { id: '26', level: 'EMG', make: mk(function (r) {
        var up = r.chance(0.5), two = r.chance(0.5), a = (up ? 1 : -1) * r.pick([1, 1 / 2, 2]), p = nz(r, 0, 2), q = (two === up ? -1 : 1) * r.int(1, 3);
        var win = { x: [p - 4, p + 4], y: [Math.min(-6, q - 3), Math.max(6, q + 3)] };
        var fig = Z.fig({ x: win.x, y: win.y, l: 2, g: 1, ux: 200 / 8, uy: 200 / (win.y[1] - win.y[0]), fns: [{ f: Z.parabola(a, p, q), from: p - 4, to: p + 4 }], max: 230, aria: 'graph of a parabola' });
        var opts = [[1, 1], [1, -1], [-1, 1], [-1, -1]].map(function (s) { var ri = (s[0] > 0) === up && (s[1] > 0) === two; return { html: t('a' + (s[0] > 0 ? '>' : '<') + '0') + ' and ' + t('b^{2}-4ac' + (s[1] > 0 ? '>' : '<') + '0'), right: ri, why: ri ? null : (s[0] > 0) !== up ? 'The parabola opens ' + (up ? 'up' : 'down') + ': ' + t('a' + (up ? '>' : '<') + '0') + '.' : 'Count the ' + t('x') + '-intercepts: ' + (two ? 'two, so the discriminant is positive.' : 'none, so the discriminant is negative.') }; });
        return Z.mc(r, 'The graph of ' + t('y=ax^{2}+bx+c') + ' is shown. Which statement is true?' + fig, opts, 'The parabola opens ' + (up ? 'up' : 'down') + ' (' + t('a' + (up ? '>' : '<') + '0') + ') and ' + (two ? 'crosses the ' + t('x') + '-axis twice (two real roots, ' + t('b^{2}-4ac>0') + ').' : 'does not meet the ' + t('x') + '-axis (no real roots, ' + t('b^{2}-4ac<0') + ').'), ['The direction of opening gives the sign of ' + t('a') + '; the number of ' + t('x') + '-intercepts gives the sign of the discriminant.'], 'graph, a and the discriminant', true);
      }) }] },
    { num: '27', outcome: RF4, parts: [
      { id: '27', level: 'PRG', make: mk(function (r) {
        var d = r.pick([4, 6, 8, 12, 14, 16, 18, 20]), h = d / 2, mn = -h * h;
        return Z.mc(r, 'Two numbers have a difference of ' + t(d) + '. The minimum possible value of their product is', [{ html: t(String(mn)), right: true }, { html: t('0'), why: 'Try ' + t('-' + h) + ' and ' + t(String(h)) + ': their product is ' + t(String(mn)) + '.' }, { html: t(String(mn + 1)), why: 'That comes from two whole numbers near the minimum. The minimum is at the vertex.' }, { html: t(String(-mn)), why: 'The product of a negative and a positive number can be negative: the minimum is below ' + t('0') + '.' }],
          'The numbers are ' + t('x') + ' and ' + t('x+' + d) + ': ' + t('P=x^{2}+' + d + 'x=(x+' + h + ')^{2}-' + h * h) + '. Minimum ' + t(String(mn)) + ' when the numbers are ' + t('-' + h) + ' and ' + t(String(h)) + '.', ['Write the product as a quadratic in ' + t('x') + ' and complete the square.'], 'minimum product');
      }) }] },
    { num: '28', outcome: RF4, parts: [
      { id: '28', level: 'PRG', make: mk(function (r) {
        var Pm = 4 * r.int(6, 40); if (Pm === 52) Pm = 56;
        var s = Pm / 4, Ar = s * s;
        return Z.num('<i>(Numerical Response)</i> A rectangle has a perimeter of ' + t(Pm) + ' cm. The maximum possible area of the rectangle, in square centimetres, is ____.', Ar, { nr: true, outcome: RF4, cands: [[(Pm / 2) * (Pm / 2), CP + 'fence-4', 'The length plus the width is half the perimeter, ' + t(String(Pm / 2)) + '.'], [Pm * Pm / 8, CP + 'fence-4', 'All four sides make the perimeter: width ' + t('x') + ', length ' + t(Pm / 2 + '-x') + '.']],
          sol: 'Width ' + t('x') + ', length ' + t(Pm / 2 + '-x') + ': ' + t('A=x(' + Pm / 2 + '-x)=-(x-' + s + ')^{2}+' + Ar) + '. Maximum ' + t(String(Ar)) + ' cm² (a ' + t(String(s)) + ' cm square).', hints: ['Half the perimeter is the length plus the width.', 'Write the area as a quadratic and find its vertex.'], text: 'NR: maximum area' });
      }) }] }
  ];

  /* the quadratic formula part (exact, simplest form) */
  function qfPart(prompt, a, b, c, pre) {
    var Q = qfR(a, b, c);
    return A.rootsPart(CP, prompt, Q.vals, { exact: true, keyTex: 'x=' + Q.tex, wrongs: qfWrongs(a, b, c) }, qfSol(a, b, c, pre),
      [(pre ? 'Write the equation in standard form first. ' : '') + 'Use ' + t('x=\\frac{-b\\pm\\sqrt{b^{2}-4ac}}{2a}') + ' with ' + t('a=' + a) + ', ' + t('b=' + b) + ', ' + t('c=' + c) + '.', 'Simplify the radical, then divide every term by any common factor.'], 'quadratic formula, exact');
  }
  /* completing the square: vertex form, vertex, max/min, value */
  function ctsPart(a, b, c) {
    var p = -b / (2 * a), q = c - b * b / (4 * a), up = a > 0;
    return Z.fields('Consider ' + t('y=' + genT(a, b, c)) + '.', [
      { label: 'Vertex form:', name: 'Vertex form', before: 'y=', check: M.exprCheck(Z.parabola(a, p, q), { vertex: { a: a, p: p, q: q, c: c }, cands: ctsCands(a, b, c) }), key: vfT(a, p, q), ansTex: 'y=' + vfT(a, p, q), math: true, placeholder: 'e.g. 2(x - 3)^2 - 5' },
      { label: 'Vertex:', name: 'Vertex', pt: [p, q], cands: [[[-p, q], CP + 'vf-psign', 'The vertex is ' + t('(p,\\ q)') + ' in ' + t('a(x-p)^{2}+q') + ': ' + t('(' + Z.binTex('x', p, true) + ')') + ' means ' + t('p=' + rT(p)) + '.']] },
      { label: 'Maximum or minimum:', name: 'Maximum or minimum', mm: up ? 'min' : 'max' },
      { label: 'Value:', name: 'Max/min value', ans: q, cands: [[p, CP + 'mm-p', 'The maximum or minimum value is the ' + t('y') + '-coordinate of the vertex.'], [c, CP + 'ctx-c', 'That is the ' + t('y') + '-intercept.']] }],
      { sol: ctsSteps(a, b, c) + '<br>Vertex ' + t(ptT(p, q)) + '; ' + (up ? 'minimum' : 'maximum') + ' value ' + t(rT(q)) + ' (' + t('a' + (up ? '>0' : '<0')) + ').', text: 'completing the square',
        hints: [(same(a, 1) ? '' : 'Factor ' + t(rT(a)) + ' from the ' + t('x^{2}') + ' and ' + t('x') + ' terms. ') + 'Inside the bracket add and subtract (half the coefficient of ' + t('x') + ')' + t('^{2}') + '.', 'Move the subtracted number out of the bracket by multiplying it by ' + t('a') + '. Check: the ' + t('y') + '-intercept must still be ' + t(rT(c)) + '.'] });
  }

  /* ===================================================================================================== */
  var EXTRA = [
    { num: '1', section: 'A. Multiple Choice', outcome: RF5, parts: [
      { id: 'E1', level: 'BEG', make: mk(function (r) {
        var o = pickWhere(function () { return { k: nz(r, 2, 4), m: nz(r, 1, 6), n: r.int(2, 5), l: nz(r, 1, 4) }; }, function (o) { return gcd(o.n, o.l) === 1 && o.l !== o.n && o.k !== -o.m && !(o.k === -2 && o.m === 4 && o.n === 3 && o.l === 1); });
        var z = o.l / o.n, f = function (L) { return L.map(function (x) { return t(rT(x)); }).join(L.length > 2 ? ', ' : ' and ').replace(/, ([^,]*)$/, ' and $1'); };
        return Z.mc(r, 'The zeros of the function ' + t('y=' + o.k + '(' + Z.linTex(1, o.m) + ')(' + Z.linTex(o.n, -o.l) + ')') + ' are', [{ html: f([-o.m, z]), right: true }, { html: f([o.m, -z]), why: 'Set each factor equal to ' + t('0') + ': ' + t(Z.linTex(1, o.m) + '=0') + ' gives ' + t('x=' + (-o.m)) + '.' }, { html: f([-o.m, o.n]), why: t(Z.linTex(o.n, -o.l) + '=0') + ' gives ' + t('x=' + rT(z)) + '.' }, { html: f([o.k, -o.m, z]), why: 'The constant ' + t(String(o.k)) + ' is never zero, so it gives no zero.' }],
          t(Z.linTex(1, o.m) + '=0') + ' gives ' + t(String(-o.m)) + '; ' + t(Z.linTex(o.n, -o.l) + '=0') + ' gives ' + t(rT(z)) + '. The constant ' + t(String(o.k)) + ' gives no zero.', ['Set each factor that contains ' + t('x') + ' equal to ' + t('0') + '.'], 'MC: zeros from factored form');
      }) }] },
    { num: '2', outcome: RF3, parts: [
      { id: 'E2', level: 'BEG', make: mk(function (r) {
        var s = r.pick([2, 3, 4]), p = nz(r, 1, 6), q = nz(r, 1, 8), a = -1 / s;
        while (p === -2 && q === 5 && s === 3) q = nz(r, 1, 8);
        var cats = { h: [hW(p), hW(-p)], v: [vW(q), vW(-q)], s: ['a vertical compression by a factor of ' + t(rT(1 / s)), 'a vertical stretch by a factor of ' + t(String(s))], r: ['a reflection in the ' + t('x') + '-axis', 'a reflection in the ' + t('y') + '-axis'] };
        var why = { h: t('(' + Z.binTex('x', p) + ')') + ' moves the graph ' + hW(p) + '.', v: t(sT(q)) + ' moves the graph ' + vW(q) + '.', s: t('|a|=' + rT(1 / s)) + ' is between 0 and 1: a compression by ' + t(rT(1 / s)) + '.', r: 'A negative ' + t('a') + ' reflects the graph in the ' + t('x') + '-axis.' };
        var trueCat = r.pick(['h', 'v', 's', 'r']);
        var opts = ['h', 'v', 's', 'r'].map(function (k) { var tr = k === 'h' || k === 'v' ? 'a translation ' + cats[k][k === trueCat ? 0 : 1] : cats[k][k === trueCat ? 0 : 1]; return { html: cap(tr), right: k === trueCat, why: k === trueCat ? null : why[k] }; });
        return Z.mc(r, 'The graph of ' + t('y=' + vfT(a, p, q)) + ' can be obtained from the graph of ' + t('y=x^{2}') + ' by several transformations. One of them is', opts,
          t('a=' + rT(a)) + ': a compression by ' + t(rT(1 / s)) + ' and a reflection in the ' + t('x') + '-axis; ' + t('p=' + p) + ': ' + hW(p) + '; ' + t('q=' + q) + ': ' + vW(q) + '.', ['Read ' + t('a') + ', ' + t('p') + ' and ' + t('q') + ' and check each statement.'], 'MC: one transformation');
      }) }] },
    { num: '3', outcome: RF3, parts: [
      { id: 'E3', level: 'EMG', make: mk(function (r) {
        var ask = r.pick(['none', 'none', 'two']), sg = r.pick([1, -1]);
        var lab = function (sa, sq) { return t('a' + (sa > 0 ? '>' : '<') + '0') + ', ' + t('q' + (sq > 0 ? '>' : sq < 0 ? '<' : '=') + '0'); };
        var opts = ask === 'none' ? [{ html: lab(sg, sg), right: true }, { html: lab(sg, -sg), why: 'Opposite signs: the parabola opens toward the ' + t('x') + '-axis, so two ' + t('x') + '-intercepts.' }, { html: lab(-sg, sg), why: 'Opposite signs: two ' + t('x') + '-intercepts.' }, { html: lab(-sg, 0), why: t('q=0') + ': the vertex is on the ' + t('x') + '-axis, one ' + t('x') + '-intercept.' }]
          : [{ html: lab(sg, -sg), right: true }, { html: lab(sg, sg), why: 'The same sign: the parabola opens away from the ' + t('x') + '-axis, no ' + t('x') + '-intercepts.' }, { html: lab(-sg, -sg), why: 'The same sign: no ' + t('x') + '-intercepts.' }, { html: lab(sg, 0), why: t('q=0') + ': one ' + t('x') + '-intercept.' }];
        return Z.mc(r, 'The graph of ' + t('y=a(x-p)^{2}+q') + ' has ' + (ask === 'none' ? '<b>no</b> ' + t('x') + '-intercepts' : '<b>two</b> ' + t('x') + '-intercepts') + ' when', opts,
          ask === 'none' ? t('a') + ' and ' + t('q') + ' with the same sign: the parabola opens away from the ' + t('x') + '-axis from a vertex off the axis.' : t('a') + ' and ' + t('q') + ' with opposite signs: it opens toward the ' + t('x') + '-axis from its vertex, so it crosses twice.', ['Sketch each case: where is the vertex, and which way does the parabola open?'], 'MC: number of x-intercepts');
      }) }] },
    { num: '4', outcome: RF3, parts: [
      { id: 'E4', level: 'BEG', make: mk(function (r) {
        var o = pickWhere(function () { return { a: r.int(2, 6), p: nz(r, 1, 6), q: nz(r, 1, 9) }; }, function (o) { return o.p !== o.q && !(o.a === 4 && o.p === 3 && o.q === -1); });
        var S = function (op, x) { return t('\\{y\\mid y' + op + x + ',\\ y\\in\\mathbb{R}\\}'); };
        return Z.mc(r, 'The range of ' + t('y=' + vfT(o.a, o.p, o.q)) + ' is', [{ html: S('\\ge ', o.q), right: true }, { html: S('\\le ', o.q), why: t('a=' + o.a) + ' > 0: the graph opens up from its minimum.' }, { html: S('\\ge ', o.p), why: 'The range uses the ' + t('y') + '-coordinate of the vertex.' }, { html: t('\\{y\\mid y\\in\\mathbb{R}\\}'), why: 'That is the domain. A parabola has a highest or lowest point.' }],
          t('a=' + o.a + '>0') + ', so the minimum value is ' + t('q=' + o.q) + ': ' + S('\\ge ', o.q) + '.', ['The range starts at ' + t('q') + ' and goes the way the parabola opens.'], 'MC: range');
      }) }] },
    { num: '5', outcome: RF4, parts: [
      { id: 'E5', level: 'EMG', make: mk(function (r) {
        var o = pickWhere(function () { return { a: -r.int(1, 4), h: nz(r, 1, 4), c: nz(r, 1, 9) }; }, function (o) { var b = -2 * o.a * o.h; return !(o.a === -2 && o.h === 2 && o.c === -3) && b !== 0 && -b / o.a !== o.h; });
        var b = -2 * o.a * o.h, k = o.c - o.a * o.h * o.h, ka = -o.a * o.h * o.h + b * o.h + o.c;
        var opts = [{ html: t(ptT(o.h, k)), right: true }, { html: t(ptT(-o.h, o.a * o.h * o.h - b * o.h + o.c)), why: 'The axis is ' + t('x=-\\frac{b}{2a}=-\\frac{' + b + '}{2(' + o.a + ')}=' + o.h) + '.' }, { html: t(ptT(-b / o.a, o.c)), why: 'Divide by ' + t('2a') + ', and substitute for the ' + t('y') + '-value (' + t(String(o.c)) + ' is the ' + t('y') + '-intercept).' }, { html: t(ptT(o.h, ka)), why: 'Square first: ' + t(o.a + '(' + o.h + ')^{2}=' + o.a * o.h * o.h) + '.' }];
        return Z.mc(r, 'The vertex of the graph of ' + t('y=' + genT(o.a, b, o.c)) + ' is', opts,
          t('x=-\\frac{' + b + '}{2(' + o.a + ')}=' + o.h) + '; ' + t('y=' + o.a + '(' + o.h + ')^{2}' + sT(b) + '(' + o.h + ')' + sT(o.c) + '=' + k) + '.', ['Use ' + t('x=-\\frac{b}{2a}') + ', then substitute.'], 'MC: vertex of general form');
      }) }] },
    { num: '6', outcome: RF3, parts: [
      { id: 'E6', level: 'PRG', make: mk(function (r) {
        var o = pickWhere(function () { return { p: nz(r, 1, 5), d: nz(r, 2, 3), a: r.pick([1, 2, 3, -1, -2, 1 / 2]) }; }, function (o) { return isInt(o.a * o.d * o.d) && !(o.p === 1 && o.d === 2 && o.a === 2); });
        var q = -o.a * o.d * o.d, x1 = o.p + o.d, f = function (A2, P2, Q2) { return t('y=' + vfT(A2, P2, Q2)); };
        return Z.mc(r, 'The quadratic function with vertex ' + t(ptT(o.p, q)) + ' whose graph passes through ' + t(ptT(x1, 0)) + ' is', [{ html: f(o.a, o.p, q), right: true }, { html: f(o.a, -o.p, q), why: 'The vertex ' + t(ptT(o.p, q)) + ' gives ' + t('(' + Z.binTex('x', o.p) + ')') + '.' }, { html: f(-q / o.d, o.p, q), why: 'Square the bracket: ' + t('(' + x1 + sT(-o.p) + ')^{2}=' + o.d * o.d) + '.' }, { html: f(-o.a, o.p, -q), why: 'The vertex is ' + t(ptT(o.p, q)) + ': ' + t('q=' + rT(q)) + '.' }],
          t('0=a(' + x1 + sT(-o.p) + ')^{2}' + sT(q)) + ' &nbsp;⇒&nbsp; ' + t(o.d * o.d + 'a=' + rT(-q)) + ' &nbsp;⇒&nbsp; ' + t('a=' + rT(o.a)) + '.', ['Substitute the point into ' + t('y=a(x-p)^{2}+q') + '.'], 'MC: equation from the vertex and a point');
      }) }] },
    { num: '7', outcome: RF4, parts: [
      { id: 'E7', level: 'PRG', make: mk(function (r) {
        var o = pickWhere(function () { return { a: r.int(2, 5), h: nz(r, 1, 4), c: nz(r, 1, 12) }; }, function (o) { return !(o.a === 3 && o.h === 2 && o.c === 7); });
        var b = 2 * o.a * o.h, hh = o.h * o.h, q = o.c - o.a * hh;
        return Z.mc(r, 'When ' + t('y=' + genT(o.a, b, o.c)) + ' is written in the form ' + t('y=a(x-p)^{2}+q') + ', the value of ' + t('q') + ' is', [{ html: t(String(q)), right: true }, { html: t(String(o.c - hh)), why: 'The ' + t('-' + hh) + ' is multiplied by ' + t(String(o.a)) + ' when it comes out of the bracket.' }, { html: t(String(o.c + o.a * hh)), why: 'The square added inside the bracket is <b>subtracted</b> again.' }, { html: t(String(o.c + hh)), why: 'Subtract the square, and multiply it by ' + t(String(o.a)) + '.' }],
          t('y=' + o.a + '(x^{2}' + sT(2 * o.h) + 'x+' + hh + '-' + hh + ')' + sT(o.c) + '=' + o.a + '(x' + sT(o.h) + ')^{2}' + sT(-o.a * hh) + sT(o.c) + '=' + vfT(o.a, -o.h, q)) + '.', ['Factor ' + t(String(o.a)) + ' from the first two terms and complete the square inside.'], 'MC: q by completing the square');
      }) }] },
    { num: '8', outcome: RF5, parts: [
      { id: 'E8', level: 'PRG', make: mk(function (r) {
        var o = pickWhere(function () { return { a: r.int(2, 5), b: nz(r, 1, 7), c: nz(r, 1, 6) }; }, function (o) { var D = o.b * o.b - 4 * o.a * o.c, D2 = o.b * o.b + 4 * o.a * o.c; return D > 0 && D2 > 0 && !isSq(D) && sqf(D)[0] === 1 && !isSq(D2) && gcd(gcd(o.a, o.b), o.c) === 1 && !(o.a === 3 && o.b === 5 && o.c === -1); });
        var D = o.b * o.b - 4 * o.a * o.c, D2 = o.b * o.b + 4 * o.a * o.c, Ft = function (A2, rad, d) { return t('\\frac{' + A2 + '\\pm\\sqrt{' + rad + '}}{' + d + '}'); };
        return Z.mc(r, 'The roots of ' + t(genT(o.a, o.b, o.c) + '=0') + ' are', [{ html: Ft(-o.b, D, 2 * o.a), right: true }, { html: Ft(o.b, D, 2 * o.a), why: 'The formula starts with ' + t('-b') + '.' }, { html: Ft(-o.b, D2, 2 * o.a), why: 'Check the sign of ' + t('-4ac') + '.' }, { html: Ft(-o.b, D, o.a), why: 'Divide by ' + t('2a') + ', not ' + t('a') + '.' }],
          t('x=\\frac{' + (-o.b) + '\\pm\\sqrt{' + o.b * o.b + sT(-4 * o.a * o.c) + '}}{' + 2 * o.a + '}=\\frac{' + (-o.b) + '\\pm\\sqrt{' + D + '}}{' + 2 * o.a + '}'), ['Substitute ' + t('a') + ', ' + t('b') + ', ' + t('c') + ' with their signs into the formula.'], 'MC: quadratic formula');
      }) }] },
    { num: '9', outcome: RF5, parts: [
      { id: 'E9', level: 'BEG', make: mk(function (r) {
        var sign = r.pick([1, -1, 0, -1]), z;
        if (sign === 0) { var m = r.int(1, 4), n = nz(r, 1, 6); z = { a: m * m, b: -2 * m * n, c: n * n }; }
        else z = pickWhere(function () { return { a: r.int(1, 3), b: nz(r, 1, 9), c: nz(r, 1, 12) }; }, function (o) { var D = o.b * o.b - 4 * o.a * o.c; return (sign > 0 ? D > 0 && o.c > 0 : D < 0) && !(o.a === 1 && o.b === -5 && o.c === 7); });
        var D = z.b * z.b - 4 * z.a * z.c, opts = [{ html: 'two distinct real roots', right: D > 0 }, { html: 'two equal real roots', right: D === 0 }, { html: 'no real roots', right: D < 0 }, { html: 'one positive and one negative root', right: false }];
        opts.forEach(function (o) { if (!o.right) o.why = 'Work out ' + t('b^{2}-4ac') + ': positive, zero or negative?'; });
        return Z.mc(r, 'The equation ' + t(genT(z.a, z.b, z.c) + '=0') + ' has', opts, t('b^{2}-4ac=' + par(z.b) + '^{2}-4(' + z.a + ')(' + z.c + ')=' + D) + (D > 0 ? '>0: two distinct real roots.' : D < 0 ? '<0: no real roots.' : ': two equal real roots.'), ['Find the discriminant.'], 'MC: nature of the roots', true);
      }) }] },
    { num: '10', outcome: RF5, parts: [
      { id: 'E10', level: 'ADV', make: mk(function (r) {
        var o = pickWhere(function () { return { b: nz(r, 2, 8), c: r.int(1, 5) }; }, function (o) { return isInt(o.b * o.b / (4 * o.c)) && !(Math.abs(o.b) === 4 && o.c === 1); });
        var Bd = o.b * o.b / (4 * o.c), kk = function (s) { return t(s); };
        return Z.mc(r, 'The equation ' + t('kx^{2}' + sT(o.b) + 'x+' + o.c + '=0') + ' has two distinct real roots for', [{ html: kk('k<' + Bd + ',\\ k\\ne 0'), right: true }, { html: kk('k>' + Bd), why: 'Solve ' + t(o.b * o.b + '-' + 4 * o.c + 'k>0') + ': dividing by ' + t(String(-4 * o.c)) + ' reverses the inequality.' }, { html: kk('k=' + Bd), why: 'At ' + t('k=' + Bd) + ' the discriminant is ' + t('0') + ': equal roots.' }, { html: kk('k<-' + Bd), why: 'Solve ' + t(o.b * o.b + '-' + 4 * o.c + 'k>0') + ' carefully.' }],
          t('b^{2}-4ac=' + o.b * o.b + '-' + 4 * o.c + 'k>0') + ' &nbsp;⇒&nbsp; ' + t('k<' + Bd) + ', and ' + t('k\\ne 0') + ' so the equation stays quadratic.', ['Two distinct real roots: ' + t('b^{2}-4ac>0') + ' with ' + t('a=k') + '.'], 'MC: values of k', true);
      }) }] },
    { num: '11', section: 'B. Numerical Response', outcome: RF5, parts: [
      { id: 'E11', level: 'PRG', make: mk(function (r) {
        var o = pickWhere(function () { return { a: r.int(2, 6), b: nz(r, 1, 6), c: r.int(1, 12) }; }, function (o) { var D = o.b * o.b + 4 * o.a * o.c, x = (o.b + Math.sqrt(D)) / (2 * o.a); return !isSq(D) && x < 10 && !(o.a === 3 && o.b === 2 && o.c === 7); });
        var D = o.b * o.b + 4 * o.a * o.c, x = (o.b + Math.sqrt(D)) / (2 * o.a);
        return Z.apx('<i>(Numerical Response)</i> The positive root of ' + t(o.a + 'x^{2}=' + genT(0, o.b, o.c).replace(/^\+/, '')) + ', to the nearest hundredth, is ____.', x, 2, { nr: true, outcome: RF5, cands: [[(-o.b + Math.sqrt(o.b * o.b + 4 * o.a * o.c)) / (2 * o.a), CP + 'qf-std', 'Write the equation in standard form first: ' + t(genT(o.a, -o.b, -o.c) + '=0') + '.'], [(o.b + Math.sqrt(D)) / o.a, CP + 'qf-2a', 'Divide by ' + t('2a') + '.']],
          sol: t(genT(o.a, -o.b, -o.c) + '=0') + ': ' + t('x=\\frac{' + o.b + '+\\sqrt{' + o.b * o.b + '+' + 4 * o.a * o.c + '}}{' + 2 * o.a + '}=\\frac{' + o.b + '+\\sqrt{' + D + '}}{' + 2 * o.a + '}\\approx ' + K.roundTo(x, 3).toFixed(3)) + ', so ' + t(K.roundTo(x, 2).toFixed(2)) + '.', hints: ['Write the equation in standard form, then use the formula with ' + t('+') + '.'], text: 'NR: positive root to the hundredth' });
      }) }] },
    { num: '12', outcome: RF5, parts: [
      { id: 'E12', level: 'EMG', make: mk(function (r) {
        var o = pickWhere(function () { return { r1: nz(r, 1, 9), r2: nz(r, 1, 9) }; }, function (o) { var v = o.r1 * o.r2 - o.r1 - o.r2; return o.r1 < o.r2 && v >= 0 && v <= 99 && !(o.r1 === 2 && o.r2 === 7); });
        var b = -(o.r1 + o.r2), c = o.r1 * o.r2, v = b + c;
        return Z.num('<i>(Numerical Response)</i> The function ' + t('y=x^{2}+bx+c') + ' has zeros ' + t(String(o.r1)) + ' and ' + t(String(o.r2)) + '. The value of ' + t('b+c') + ' is ____.', v, { nr: true, outcome: RF5, cands: [[o.r1 + o.r2 + c, CP + 'zero-sign', 'A zero ' + t('r') + ' gives the factor ' + t('(x-r)') + ': ' + t('b=-(' + o.r1 + '+' + par(o.r2) + ')') + '.']],
          sol: t('y=(' + Z.binTex('x', o.r1) + ')(' + Z.binTex('x', o.r2) + ')=' + genT(1, b, c)) + ': ' + t('b+c=' + b + sT(c) + '=' + v) + '.', hints: ['Write the function in factored form from its zeros, then expand.'], text: 'NR: b + c from the zeros' });
      }) }] },
    { num: '13', outcome: RF4, parts: [
      { id: 'E13', level: 'ADV', make: mk(function (r) {
        var o = pickWhere(function () { return { F: 10 * r.int(6, 24), n: r.pick([2, 2, 3]) }; }, function (o) { var Ar = o.F * o.F / (8 * (o.n + 1)); return !(o.F === 80 && o.n === 2) && !isInt(Ar) && Ar < 9999; });
        var m = o.n + 1, w = o.F / (2 * m), Ar = o.F * o.F / (8 * m), side = (o.F - m * w) / 2;
        return Z.apx('<i>(Numerical Response)</i> A rancher has ' + t(o.F) + ' m of fencing to enclose a rectangular pen and divide it into ' + (o.n === 2 ? 'two' : 'three') + ' equal parts with fences parallel to one pair of sides. The maximum total area, to the nearest square metre, is ____.', Ar, 0, { nr: true, outcome: RF4, cands: [[o.F * o.F / 16, CP + 'fence-4', 'That would be the area with no dividing ' + (o.n === 2 ? 'fence' : 'fences') + '. Count every fence: ' + t(String(m)) + ' parallel fences and two other sides.'], [o.F * o.F / (8 * o.n), CP + 'fence-4', 'There are ' + t(String(m)) + ' parallel fences (the two ends and ' + t(String(o.n - 1)) + ' divider' + (o.n === 2 ? '' : 's') + ').']],
          sol: 'Let ' + t('w') + ' be the length of each of the ' + t(String(m)) + ' parallel fences. The other two sides are each ' + t('\\frac{' + o.F + '-' + m + 'w}{2}') + '.<br>' + t('A=w\\left(' + o.F / 2 + '-' + F(m / 2) + 'w\\right)') + '; ' + t('w=-\\frac{' + o.F / 2 + '}{2(-' + F(m / 2) + ')}=' + rT(w)) + '; ' + t('A=' + rT(w) + '(' + rT(side) + ')=' + rT(Ar) + '\\approx ' + fx(Ar, 1)) + ', so ' + t(String(Math.round(Ar))) + '.',
          hints: ['Count the fences: ' + t(String(m)) + ' of length ' + t('w') + ' and two of the other length.', 'Write the area as a quadratic in ' + t('w') + ' and find its vertex.'], text: 'NR: divided pen' });
      }) }] },
    { num: '14', outcome: RF5, parts: [
      { id: 'E14', level: 'PRG', make: mk(function (r) {
        var o = pickWhere(function () { return { k: r.int(1, 9), Pr: r.int(20, 120) }; }, function (o) { var D = o.k * o.k + 4 * o.Pr; return !isSq(D) && !(o.k === 3 && o.Pr === 50); });
        var D = o.k * o.k + 4 * o.Pr, x = (-o.k + Math.sqrt(D)) / 2;
        return Z.apx('<i>(Numerical Response)</i> The product of a positive number and the number that is ' + t(o.k) + ' greater is ' + t(o.Pr) + '. The number, to the nearest tenth, is ____.', x, 1, { nr: true, outcome: RF5, cands: [[x + o.k, CP + 'gave-other', 'That is the greater number. The question asks for the first one.'], [(o.k + Math.sqrt(D)) / 2, CP + 'neg-root', 'That is the size of the negative root, which is rejected (the number is positive).']],
          sol: t('x(x+' + o.k + ')=' + o.Pr) + ' &nbsp;⇒&nbsp; ' + t('x^{2}+' + o.k + 'x-' + o.Pr + '=0') + ': ' + t('x=\\frac{-' + o.k + '+\\sqrt{' + o.k * o.k + '+' + 4 * o.Pr + '}}{2}=\\frac{-' + o.k + '+\\sqrt{' + D + '}}{2}\\approx ' + fx(x, 2)) + ', so ' + t(fx(x, 1)) + ' (the negative root is rejected).', hints: ['Let the number be ' + t('x') + ': ' + t('x(x+' + o.k + ')=' + o.Pr) + '.', 'Standard form, then the formula; keep the positive root.'], text: 'NR: number problem' });
      }) }] },

    { num: '15', section: 'C. Written Response', shared: function (r) {
        return pickWhere(function () { return { k: r.pick([2, 3, 2, -2]), r1: nz(r, 1, 5), r2: nz(r, 1, 5) }; }, function (o) { return o.r1 < o.r2 && (o.r1 + o.r2) % 2 === 0 && o.r1 + o.r2 !== 0 && !(o.k === 2 && o.r1 === -3 && o.r2 === 1) && !(o.k === 2 && o.r1 === 1 && o.r2 === 5); });
      }, stem: function (s) { kit(); return 'Consider the function ' + t('y=' + genT(s.k, -s.k * (s.r1 + s.r2), s.k * s.r1 * s.r2)) + '.'; }, parts: [
      { id: 'E15a', level: 'EMG', outcome: RF4, make: mk(function (r, s) {
        var a = s.k, b = -a * (s.r1 + s.r2), c = a * s.r1 * s.r2, p = (s.r1 + s.r2) / 2, q = c - b * b / (4 * a);
        return M.exprPart('Write it in vertex form by completing the square.', Z.parabola(a, p, q), vfT(a, p, q), { before: 'y=', ansPre: 'y=', outcome: RF4, vertex: { a: a, p: p, q: q, c: c }, cands: ctsCands(a, b, c), sol: ctsSteps(a, b, c),
          hints: ['Factor ' + t(String(a)) + ' from the first two terms; add and subtract (half the coefficient of ' + t('x') + ')' + t('^{2}') + ' inside.', 'The subtracted square is multiplied by ' + t(String(a)) + ' when it comes out.'], text: 'completing the square' });
      }) },
      { id: 'E15b', level: 'PRG', outcome: RF4, make: mk(function (r, s) {
        var a = s.k, b = -a * (s.r1 + s.r2), c = a * s.r1 * s.r2, p = (s.r1 + s.r2) / 2, q = c - b * b / (4 * a), up = a > 0;
        return Z.fields('State the vertex, the axis of symmetry, the range, the ' + t('y') + '-intercept and the ' + t('x') + '-intercepts.', [
          { label: 'Vertex:', name: 'Vertex', pt: [p, q], cands: [[[-p, q], CP + 'vf-psign', 'In ' + t('a(x-p)^{2}+q') + ' the vertex is ' + t('(p,\\ q)') + '.']] },
          axisSpec('Axis of symmetry:', p, [[-p, CP + 'vf-psign', 'The axis goes through the vertex: ' + t('x=p') + '.']]),
          { label: 'Range:', name: 'Range', range: [q, up], opt: { p: p, c: c } },
          { label: t('y') + '-intercept:', name: 'y-intercept', ans: c, cands: [[q, CP + 'yint-q', 'Let ' + t('x=0') + ' (or read ' + t('c') + ' from general form).']] },
          { label: t('x') + '-intercepts:', name: 'x-intercepts', roots: { vals: [s.r1, s.r2], cands: [[[-s.r1, -s.r2], CP + 'zero-sign', 'Check the signs: a factor ' + t('(x-r)') + ' gives the zero ' + t('r') + '.']] } }],
          { sol: 'Vertex ' + t(ptT(p, q)) + '; axis ' + t('x=' + p) + '; range ' + t(Z.rangeTex(q, up)) + '; ' + t('y') + '-intercept ' + t(String(c)) + '.<br>' + t(s.k + '(' + genT(1, b / a, c / a) + ')=' + Z.ffTex(s.k, [1, -s.r1], [1, -s.r2]) + '=0') + ': ' + t('x') + '-intercepts ' + t(String(s.r1)) + ' and ' + t(String(s.r2)) + '.',
            hints: ['Read the vertex, axis and range from the vertex form; ' + t('c') + ' from the general form.', 'Factor the general form for the ' + t('x') + '-intercepts.'], text: 'features from two forms' });
      }) },
      { id: 'E15c', level: 'EMG', outcome: RF3, make: mk(function (r, s) {
        var a = s.k, b = -a * (s.r1 + s.r2), c = a * s.r1 * s.r2, p = (s.r1 + s.r2) / 2, q = c - b * b / (4 * a), G = graphOpts(a, p, q), win = Z.win(G.verts.concat([[s.r1, 0], [s.r2, 0], [0, c]]), 2, 3);
        return Z.graphMC(r, 'Sketch the graph: which graph is it?', G.opts, win, 'Vertex ' + t(ptT(p, q)) + ', ' + t('x') + '-intercepts ' + t(String(s.r1)) + ' and ' + t(String(s.r2)) + ', ' + t('y') + '-intercept ' + t(String(c)) + ', opening ' + (a > 0 ? 'up' : 'down') + '.', ['Plot the vertex and the intercepts you found.'], 'sketch the graph');
      }) }] },
    { num: '16', shared: function (r) {
        return pickWhere(function () { return { a: r.pick([-1 / 2, 1 / 2, -2, 2, -1, 1, -1 / 4, 1 / 4]), p: nz(r, 1, 4), q: r.int(1, 5) }; }, function (o) { o.q = o.a < 0 ? Math.abs(o.q) : -Math.abs(o.q); var d = -o.q / o.a, c = o.a * o.p * o.p + o.q; return isInt(c) && Math.abs(c) <= 8 && isInt(d) && !isSq(d) && !(o.a === -0.5 && o.p === -2 && o.q === 4); });
      }, stem: function (s) {
        kit(); var c = s.a * s.p * s.p + s.q, win = Z.win([[s.p, s.q], [0, c], [2 * s.p, c]], 3, 1);
        return 'The graph of a quadratic function is shown.' + Z.fig({ x: win.x, y: win.y, l: 1, g: 1, ux: 230 / (win.x[1] - win.x[0]), uy: 230 / (win.y[1] - win.y[0]), fns: [{ f: Z.parabola(s.a, s.p, s.q), from: win.x[0], to: win.x[1] }], points: [{ x: s.p, y: s.q }, { x: 0, y: c }, { x: 2 * s.p, y: c }], max: 260, aria: 'parabola through marked points' });
      }, parts: [
      { id: 'E16a', level: 'PRG', outcome: RF3, make: mk(function (r, s) {
        var c = s.a * s.p * s.p + s.q;
        return A.eqPart(CP, 'Write its equation in vertex form.', vfP(s.a, s.p, s.q), { form: 'vertex', wrongs: [{ p: vfP(s.a, -s.p, s.q), code: CP + 'vf-psign', hint: 'Read the vertex from the graph: ' + t(ptT(s.p, s.q)) + '.' }, { p: vfP((c - s.q) / s.p, s.p, s.q), code: CP + 'vp-nosq', hint: 'Square the bracket: ' + t('(0' + sT(-s.p) + ')^{2}=' + s.p * s.p) + '.' }] },
          'Vertex ' + t(ptT(s.p, s.q)) + ', point ' + t(ptT(0, c)) + ': ' + t(c + '=a(0' + sT(-s.p) + ')^{2}' + sT(s.q)) + ' &nbsp;⇒&nbsp; ' + t(s.p * s.p + 'a=' + rT(c - s.q)) + ' &nbsp;⇒&nbsp; ' + t('a=' + rT(s.a)) + '.<br>' + t('y=' + vfT(s.a, s.p, s.q)),
          ['Read the vertex and the ' + t('y') + '-intercept from the graph.', 'Substitute the ' + t('y') + '-intercept into ' + t('y=a(x-p)^{2}+q') + ' and solve for ' + t('a') + '.'], 'equation from a graph');
      }) },
      { id: 'E16b', level: 'ADV', outcome: RF3, make: mk(function (r, s) {
        var d = -s.q / s.a, sp = sqf(d), rad = (sp[0] === 1 ? '' : sp[0]) + '\\sqrt{' + sp[1] + '}', vals = [s.p + Math.sqrt(d), s.p - Math.sqrt(d)];
        return A.rootsPart(CP, 'Determine the exact ' + t('x') + '-intercepts.', vals, { exact: true, keyTex: 'x=' + s.p + '\\pm ' + rad, wrongs: [{ vals: [-s.p + Math.sqrt(d), -s.p - Math.sqrt(d)], code: CP + 'zero-sign', hint: 'From ' + t('(' + Z.binTex('x', s.p) + ')^{2}=' + d) + ': ' + t('x=' + s.p + '\\pm\\sqrt{' + d + '}') + '.' }, { vals: [s.p + Math.sqrt(Math.abs(s.q)), s.p - Math.sqrt(Math.abs(s.q))], code: CP + 'qf-diva', hint: 'Divide by ' + t('a=' + rT(s.a)) + ' before taking the square root.' }] },
          t(vfT(s.a, s.p, s.q) + '=0') + ' &nbsp;⇒&nbsp; ' + t('(' + Z.binTex('x', s.p) + ')^{2}=' + d) + ' &nbsp;⇒&nbsp; ' + t(Z.binTex('x', s.p) + '=\\pm\\sqrt{' + d + '}=\\pm ' + rad) + '<br>' + t('x=' + s.p + '\\pm ' + rad) + ' (about ' + t(fx(vals[1], 2)) + ' and ' + t(fx(vals[0], 2)) + ')',
          ['Set ' + t('y=0') + ', isolate the square and take square roots.', 'Simplify the radical.'], 'exact x-intercepts');
      }) },
      { id: 'E16c', level: 'PRG', outcome: RF4, make: mk(function (r, s) {
        var a = s.a, b = -2 * a * s.p, c = a * s.p * s.p + s.q;
        var p = KP.poly('Write the equation in general form.', genP(a, b, c), { before: 'y=', wrong: [{ is: genP(a, -b, c), code: CP + 'zero-sign', hint: 'Check the middle term: ' + t('(' + Z.binTex('x', s.p) + ')^{2}=' + genT(1, -2 * s.p, s.p * s.p)) + '.' }, { is: genP(a, b, a * s.p * s.p), code: CP + 'vf-q', hint: 'Add the ' + t(rT(s.q)) + ' as well.' }, { is: genP(a, -2 * s.p, s.p * s.p + s.q), code: CP + 'vf-a', hint: 'Multiply every term of the expanded square by ' + t(rT(a)) + '.' }] },
          t('y=' + Z.aTex(a, true) + '(' + genT(1, -2 * s.p, s.p * s.p) + ')' + sT(s.q) + '=' + genT(a, b, c)) + ' (' + t('y') + '-intercept ' + t(rT(c)) + ' ✓)', ['Expand the square, multiply by ' + t('a') + ', then add ' + t('q') + '.'], 'general form from vertex form');
        p.answer = t('y=' + genT(a, b, c)); return p;
      }) }] },
    { num: '17', outcome: RF5, parts: [
      { id: 'E17a', level: 'EMG', make: mk(function (r) {
        var z = pickWhere(function () { return { a: nz(r, 1, 4), b: nz(r, 1, 6), c: nz(r, 1, 9) }; }, function (o) { return o.b * o.b - 4 * o.a * o.c < 0 && o.b * o.b + 4 * o.a * o.c > 0 && !(o.a === 2 && o.b === -3 && o.c === 5); });
        var D = z.b * z.b - 4 * z.a * z.c, D2 = z.b * z.b + 4 * z.a * z.c, up = z.a > 0;
        return Z.mc(r, 'Use the discriminant to show that ' + t(genT(z.a, z.b, z.c) + '=0') + ' has no real roots. What does this tell you about the graph of ' + t('y=' + genT(z.a, z.b, z.c)) + '?', [
          { html: t('b^{2}-4ac=' + D + '<0') + ': no real roots, so the graph has no ' + t('x') + '-intercepts (it opens ' + (up ? 'up and lies entirely above' : 'down and lies entirely below') + ' the ' + t('x') + '-axis).', right: true },
          { html: t('b^{2}-4ac=' + D2 + '>0') + ': the graph crosses the ' + t('x') + '-axis twice.', why: 'Check the sign of ' + t('-4ac=-4(' + z.a + ')(' + z.c + ')') + '.' },
          { html: t('b^{2}-4ac=' + D + '<0') + ': the graph touches the ' + t('x') + '-axis once, at its vertex.', why: 'A discriminant of exactly ' + t('0') + ' gives one ' + t('x') + '-intercept. A negative one gives none.' },
          { html: t('b^{2}-4ac=' + D + '<0') + ': no real roots, so the graph lies entirely ' + (up ? 'below' : 'above') + ' the ' + t('x') + '-axis.', why: 'Check the direction of opening: ' + t('a=' + z.a) + '.' }],
          t('b^{2}-4ac=' + par(z.b) + '^{2}-4(' + z.a + ')(' + z.c + ')=' + D + '<0') + ': no real roots. The graph has no ' + t('x') + '-intercepts: it opens ' + (up ? 'up and lies entirely above' : 'down and lies entirely below') + ' the ' + t('x') + '-axis.', ['Work out ' + t('b^{2}-4ac') + ' with the signs of ' + t('a') + ', ' + t('b') + ' and ' + t('c') + '.'], 'discriminant and the graph');
      }) },
      { id: 'E17b', level: 'MAS', make: mk(function (r) {
        var o = pickWhere(function () { return { a: r.pick([1, 2, 3, 4, 5]), c: r.pick([1, 2, 3, 4, 5, 8, 9, 12, 16, 20, 27]) }; }, function (o) { var K2 = 2 * Math.sqrt(o.a * o.c); return isSq(o.a * o.c) && o.a * o.c > 1 && !(o.a === 3 && o.c === 12) && isInt(K2); });
        var K2 = 2 * Math.sqrt(o.a * o.c), x1 = -K2 / (2 * o.a), x2 = K2 / (2 * o.a);
        var pk = A.rootsPart(CP, '', [K2, -K2], { v: 'k', keyTex: 'k=\\pm ' + K2, wrongs: [{ vals: [K2], code: CP + 'k-one', hint: t('k^{2}=' + K2 * K2) + ' has two solutions.' }, { vals: [Math.sqrt(o.a * o.c), -Math.sqrt(o.a * o.c)], code: CP + 'disc-4', hint: 'Use ' + t('b^{2}-4ac=0') + ' — the 4 matters.' }] });
        return Z.fields('Determine the values of ' + t('k') + ' for which ' + t(Z.aTex(o.a) + 'x^{2}+kx+' + o.c + '=0') + ' has exactly one real root, and find the root for each value of ' + t('k') + '.', [
          { label: 'Values of ' + t('k') + ':', name: 'Values of k', check: pk.check, key: pk.key, ansTex: pk.key, math: true, placeholder: 'e.g. k = ±12' },
          { label: 'Root when ' + t('k=' + K2) + ':', name: 'Root (positive k)', ans: x1, cands: [[x2, CP + 'zero-sign', 'For ' + t('k=' + K2) + ' the equation is ' + t(Z.aTex(o.a) + 'x^{2}+' + K2 + 'x+' + o.c + '=0') + ': the root is ' + t('-\\frac{b}{2a}') + '.']] },
          { label: 'Root when ' + t('k=-' + K2) + ':', name: 'Root (negative k)', ans: x2, cands: [[x1, CP + 'zero-sign', 'For ' + t('k=-' + K2) + ' the root is ' + t('-\\frac{b}{2a}=\\frac{' + K2 + '}{' + 2 * o.a + '}') + '.']] }],
          { sol: t('k^{2}-4(' + o.a + ')(' + o.c + ')=0') + ' &nbsp;⇒&nbsp; ' + t('k^{2}=' + K2 * K2) + ' &nbsp;⇒&nbsp; ' + t('k=\\pm ' + K2) + '.<br>' + t('k=' + K2) + ': ' + t(Z.aTex(o.a) + 'x^{2}+' + K2 + 'x+' + o.c + '=0') + ', the root is ' + t('x=-\\frac{' + K2 + '}{' + 2 * o.a + '}=' + rT(x1)) + '.<br>' + t('k=-' + K2) + ': ' + t(Z.aTex(o.a) + 'x^{2}-' + K2 + 'x+' + o.c + '=0') + ', the root is ' + t('x=' + rT(x2)) + '.',
            hints: ['Exactly one real root: ' + t('b^{2}-4ac=0') + '.', 'With a zero discriminant the formula gives one root, ' + t('x=-\\frac{b}{2a}') + ' (or factor the perfect square).'], text: 'k for one root, and the root' });
      }) }] },
    { num: '18', outcome: RF4, shared: function (r) {
        return pickWhere(function () { var a = r.pick([3.2, 3.5, 3.6, 4, 4.4, 4.5, 4.8, 5]), b = 10 * r.int(18, 34); return { a: a, b: b, c: 100 * r.int(10, 40), Tl: r.pick([16, 18]), Tu: r.pick([38, 40]), T1: r.int(19, 24), L: 0, Tx: r.pick([5, 8, 10]) }; }, function (o) {
          var T0 = o.b / (2 * o.a), Am = o.b * o.b / (4 * o.a) - o.c, f = function (T) { return -o.a * T * T + o.b * T - o.c; };
          if (!(T0 > 26 && T0 < 34 && Am > 900 && Am < 3000 && o.T1 < T0 - 4 && f(o.T1) > 100 && f(o.Tx) < -50 && !(o.a === 4.2 && o.b === 260))) return false;
          o.L = 100 * Math.floor((Am - 150) / 100); if (Am - o.L > 700) return false;
          var D = o.b * o.b - 4 * o.a * (o.c + o.L), t1 = (o.b - Math.sqrt(D)) / (2 * o.a), t2 = (o.b + Math.sqrt(D)) / (2 * o.a);
          return D > 0 && t1 > o.Tl && t2 < o.Tu;
        });
      }, stem: function (s) { kit(); return 'A water park recorded its daily attendance, ' + t('A') + ' people, and the day’s high temperature, ' + t('T') + ' °C, all summer. A quadratic regression on a graphing calculator gave the model ' + t('A=' + decT([-s.a, s.b, -s.c], 'T')) + ' for ' + t(s.Tl + '\\le T\\le ' + s.Tu) + '.'; }, parts: [
      { id: 'E18a', level: 'BEG', make: mk(function (r, s) {
        var v = -s.a * s.T1 * s.T1 + s.b * s.T1 - s.c;
        return Z.apx('Predict the attendance on a day with a high of ' + t(s.T1) + ' °C, to the nearest person.', v, 0, { after: 'people', outcome: RF4, cands: [[s.a * s.T1 * s.T1 + s.b * s.T1 - s.c, 'sign', 'Square first, then multiply by ' + t(F(-s.a)) + ': the first term is negative.']],
          sol: t('A=' + F(-s.a) + '(' + s.T1 + ')^{2}+' + s.b + '(' + s.T1 + ')-' + s.c + '=' + F(Math.round(v * 1000) / 1000)) + ': about ' + t(String(Math.round(v))) + ' people.', hints: ['Substitute ' + t('T=' + s.T1) + ' into the model.'], text: 'prediction from a model' });
      }) },
      { id: 'E18b', level: 'PRG', make: mk(function (r, s) {
        var T0 = s.b / (2 * s.a), Tn = Math.round(T0), f = function (T) { return -s.a * T * T + s.b * T - s.c; }, Am = f(T0), An = f(Tn);
        var attChk = numBox(function (v) { if (Math.abs(v - Math.round(Am)) < 1e-9 || Math.abs(v - Math.round(An)) < 1e-9) return ok(); if (Math.abs(v - Am) < 1) return form('round', 'Round to the nearest person.'); if (Math.abs(v - T0) < 1) return wrong(CP + 'ctx-time', 'That is the temperature. The attendance is the ' + t('A') + '-value of the vertex.'); return wrong('value', null); });
        return Z.fields('Which temperature, to the nearest degree, gives the greatest attendance? What is that attendance, to the nearest person?', [{ label: 'Temperature:', name: 'Temperature', ans: T0, dp: 0, after: '°C', cands: [[Am, CP + 'ctx-time', 'That is the attendance. The temperature is the ' + t('T') + '-coordinate of the vertex.']] }, { label: 'Greatest attendance:', name: 'Attendance', check: attChk, key: String(Math.round(Am)), ansTex: String(Math.round(Am)), after: 'people' }],
          { sol: 'Maximum: ' + t('T=-\\frac{' + s.b + '}{2(' + F(-s.a) + ')}\\approx ' + fx(T0, 2)) + ', so about ' + t(Tn + '^{\\circ}\\text{C}') + '. ' + t('A\\approx ' + fx(Am, 1)) + ': about ' + t(String(Math.round(Am))) + ' people.', hints: ['Graph and use <b>maximum</b>, or use ' + t('T=-\\frac{b}{2a}') + '.'], text: 'maximum of a model', bad: [[String(Math.round(Am)), String(Tn)]] });
      }) },
      { id: 'E18c', level: 'ADV', outcome: RF5, make: mk(function (r, s) {
        var D = s.b * s.b - 4 * s.a * (s.c + s.L), t1 = (s.b - Math.sqrt(D)) / (2 * s.a), t2 = (s.b + Math.sqrt(D)) / (2 * s.a), C2 = s.c + s.L;
        return Z.fields('At what temperatures, to the nearest tenth of a degree, is the attendance ' + t(s.L) + '?', [{ label: 'Lower temperature:', name: 'Lower temperature', ans: t1, dp: 1, after: '°C' }, { label: 'Higher temperature:', name: 'Higher temperature', ans: t2, dp: 1, after: '°C' }],
          { swap: [[0, 1]], outcome: RF5, sol: 'Intersect with ' + t('A=' + s.L) + ' (or solve ' + t(decT([-s.a, s.b, -C2], 'T') + '=0') + '): ' + t('T=\\frac{' + s.b + '\\pm\\sqrt{' + F(Math.round(D * 1000) / 1000) + '}}{' + F(2 * s.a) + '}') + '<br>' + t('T\\approx ' + fx(t1, 1)) + ' °C and ' + t('T\\approx ' + fx(t2, 1)) + ' °C.', hints: ['Graph ' + t('A=' + s.L) + ' too and use <b>intersect</b> twice, or solve the equation with the formula.'], text: 'temperatures for an attendance' });
      }) },
      { id: 'E18d', level: 'EMG', make: mk(function (r, s) {
        var v = -s.a * s.Tx * s.Tx + s.b * s.Tx - s.c, T0 = s.b / (2 * s.a);
        return Z.mc(r, 'Explain why the model should not be used for a day with a high of ' + t(s.Tx) + ' °C.', [{ html: t(s.Tx + '^{\\circ}\\text{C}') + ' is outside the data (' + t(s.Tl + '\\le T\\le ' + s.Tu) + '), and the model gives ' + t('A\\approx ' + Math.round(v)) + ': attendance can’t be negative.', right: true },
          { html: 'The model only works for whole-number temperatures.', why: 'Any temperature in ' + t(s.Tl + '\\le T\\le ' + s.Tu) + ' can be used. ' + t(s.Tx + '^{\\circ}\\text{C}') + ' is outside it.' }, { html: 'Temperatures below the vertex, ' + t('T\\approx ' + fx(T0, 1)) + ', can’t be used.', why: 'The model was used for ' + t('T=' + s.T1) + ' in (a). The problem is that ' + t(s.Tx) + ' is outside the data.' }, { html: 'At ' + t(s.Tx + '^{\\circ}\\text{C}') + ' the model gives the greatest attendance.', why: 'Substitute: the model gives ' + t(String(Math.round(v))) + '.' }],
          t(s.Tx + '^{\\circ}\\text{C}') + ' is outside the data (' + t(s.Tl + '\\le T\\le ' + s.Tu) + '). The model gives ' + t('A=' + F(Math.round(v * 1000) / 1000)) + ', and attendance cannot be negative.', ['Look at the domain the model was made for, and substitute ' + t('T=' + s.Tx) + '.'], 'limits of a model');
      }) }] },
    { num: '19', outcome: RF4, parts: [
      { id: 'E19', level: 'ADV', make: mk(function (r) {
        var o = pickWhere(function () { return { k: r.int(2, 5), P0: r.int(15, 40), xs: r.int(1, 12) }; }, function (o) { var N = o.k * o.P0 + 2 * o.k * o.xs; return N <= 200 && !(o.k === 2 && o.P0 === 25); });
        var N = o.k * o.P0 + 2 * o.k * o.xs, price = o.P0 + o.xs, bikes = N - o.k * o.xs, Rv = price * bikes, b = N - o.k * o.P0;
        return Z.fields('A bike rental shop rents ' + t(N) + ' bikes a day at ' + t('\\$' + o.P0) + ' each. For every ' + t('\\$1') + ' increase in price, it rents ' + t(o.k) + ' fewer bikes. Write a revenue function and use it to determine the price that gives the maximum revenue, the number of bikes rented at that price, and the maximum revenue.', [
          { label: 'Price:', name: 'Price', before: '$', ans: price, cands: [[o.xs, CP + 'rev-x', 'That is the number of ' + t('\\$1') + ' increases. The price is ' + t(o.P0 + '+x') + '.'], [o.P0 - o.xs, 'sign', 'The price goes <b>up</b>: ' + t(o.P0 + '+x') + '.']] },
          { label: 'Bikes rented:', name: 'Bikes', ans: bikes, cands: [[N - o.xs, CP + 'rev-x', 'Each increase means ' + t(o.k) + ' fewer bikes: ' + t(N + '-' + o.k + 'x') + '.']] },
          { label: 'Maximum revenue:', name: 'Maximum revenue', before: '$', ans: Rv, cands: [[N * o.P0, CP + 'ctx-c', 'That is the revenue now, before any increase.']] }],
          { sol: 'Let ' + t('x') + ' be the number of ' + t('\\$1') + ' increases: price ' + t(o.P0 + '+x') + ', bikes ' + t(N + '-' + o.k + 'x') + '.<br>' + t('R=(' + o.P0 + '+x)(' + N + '-' + o.k + 'x)=' + genT(-o.k, b, N * o.P0)) + '.<br>' + t('x=-\\frac{' + b + '}{2(-' + o.k + ')}=' + o.xs) + ' (or midway between the zeros ' + t('x=-' + o.P0) + ' and ' + t('x=' + N / o.k) + ').<br>Price ' + t('\\$' + price) + ', bikes ' + t(String(bikes)) + ', maximum revenue ' + t('\\$' + Rv) + '.',
            hints: ['Let ' + t('x') + ' be the number of increases: revenue = price × number rented.', 'Find the vertex of the revenue function, then work out the price and the number of bikes.'], text: 'revenue problem' });
      }) }] }
  ];

  HW.defineLesson({ id: LID, unit: 5, num: '11', title: 'Unit 5 Review', outcome: 'RF3', calc: true, questions: QUESTIONS, extra: EXTRA });
})(window);
