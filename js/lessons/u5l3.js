/* Math 20-1 · Unit 5 · Lesson 3 — Characteristics of a Quadratic Function in Vertex Form (outcome RF3 on every part)
 * Assignment 3 (m201book unit5/u5_l03.tex, Questions 1–18) and the Lesson 3 Extra Practice (u5_ep03.tex, A1–A3, B1–B6,
 * C1–C3). Every part is a generator: the booklet question's idea, form and difficulty with new numbers (contexts vary a
 * little); the lesson's example functions and the booklet's own functions are left out. Calculator lesson: x-intercepts
 * are exact where the booklet asks (simplest radical form), and rounded to the nearest hundredth where it says so.
 *
 * This file also defines the kit HW.u5k34, used by u5l4.js (load this file first) and reusable by later Unit 5 lessons:
 *   numbers   cl, same, gcd, toFrac, rT (exact: integer or fraction), vT (display: integer, ≤ 2-place decimal or fraction),
 *             cT(x, frac) (a coefficient's size), sT (signed term "+3"), pickWhere, avoid(list)(a, p, q),
 *             polyTex(coefs, v, frac), binTex(v, p), vfTex(a, p, q, v, frac), linTex(m, n, v), ffTex(k, [m1, n1], [m2, n2], v, frac),
 *             ptTex(x, y), radT(c, k, m) (c ± k√m pieces), vfRoots(a, p, q)
 *   checkers  numChk(T, o) (exact number; o.cands [[value, code, hint]]), ptChk(x, y, o) (a point; o.cands [[[x, y], code, hint]]),
 *             axisChk(p, o) (x = p; a bare number gets a nudge; o.q for the "y = q" mix-up), mmChk('max' | 'min'),
 *             setChk(tex, o) (K.set with MathLive \frac59 accepted), rangeTex(q, up, v), rangeChk(q, up, o), DOM (domain tex),
 *             rootsChk(spec) (x-intercepts: "x = 2, x = −12", "x = 1 ± √7", "none"; spec.vals, spec.irr (simplest radical
 *             form required), spec.cands [[values, code, hint]]), exprChk(fn, o) (o.vertex: vertex form a(x − p)² + q),
 *             featChk(spec) (an equation with given features: spec.p, spec.q, spec.aSign; vertex form required)
 *   parts     num(prompt, ans, o), apx(prompt, x, dp, o), fields(prompt, specs, o) (boxes: ans | dp | pt | axis | mm | set |
 *             roots | expr | poly | fac | check; o.swap = [[i, j]] two boxes in either order), mc(r, prompt, opts, sol, hints, text),
 *             roots(prompt, spec, o), countMC(r, prompt, a, p, q, o), graphMC(r, prompt, opts, win, sol, hints, text)
 *   figures   fig(o) (HW.graph wrapped: functions, points, window), parabola(a, p, q)
 *   keypads   'u5k34' (digits, fraction, √, ( ), comma, + −, x, y, =, x², ±, none) and 'u5k34s' (the same with ≤ ≥ < > { } | ∈ ℝ)
 * Recognised mistakes (codes u5l3-…): the sign of p (x + 3 read as p = 3), the sign of q, not solving for y first (y + 6 = …,
 * 2y = …), the axis written as y = q or as a bare number, maximum and minimum mixed up, the max/min value given as p, the
 * range the wrong way or from p, y-intercept slips (the sign of a, q given, not squaring, squaring a), only one square root,
 * "none" when there are x-intercepts, a square root of a negative, not dividing by a first, q moved with the wrong sign,
 * mirror points reflected in the y-axis, the negative root kept in a context, the vertex time doubled or halved.
 * Conversions: "sketch the graph" → choose the graph; "how many x-intercepts? give a reason" → multiple choice of counts with
 * reasons; "identify both errors" → multiple choice of corrected answers; "show that …" → the value it shows; "for which
 * values of q" → a table of choices; numerical response → a number box (4 digits).
 * Levels: LIM BEG EMG PRG ADV MAS. Mastery: 6(c), 10(d), Extra C2, C3(b). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, B = K.P, ex = HW.ex, F = HW.fmt, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
  var LID = 'u5l3';

  /* =========================== the kit (HW.u5k34) =========================== */
  var Z = HW.u5k34 = {};
  function cl(x) { return Math.round(x * 1e9) / 1e9; }
  function same(a, b) { return Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b)); }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var r = a % b; a = b; b = r; } return a; }
  function pickWhere(gen, okf) { for (var i = 0; i < 20000; i++) { var o = gen(); if (okf(o)) return o; } throw new Error('u5k34: no valid numbers'); }
  function toFrac(x) { for (var q = 1; q <= 1000; q++) { var p = x * q; if (Math.abs(p - Math.round(p)) < 1e-7) { var g = gcd(Math.round(p), q) || 1; return [Math.round(p) / g, q / g]; } } return null; }
  function terminates(fr) { var q = fr[1]; while (q % 2 === 0) q /= 2; while (q % 5 === 0) q /= 5; return q === 1; }
  function nT(x) { x = cl(x); if (Math.abs(x) < 1e-12) x = 0; return F(x); }
  /* exact: an integer or a fraction */
  function rT(x) { var f = toFrac(x); if (!f || f[1] === 1) return nT(x); return (f[0] < 0 ? '-' : '') + '\\frac{' + Math.abs(f[0]) + '}{' + f[1] + '}'; }
  /* display: integer, a decimal with at most 2 places, else a fraction */
  function vT(x) { var f = toFrac(x); if (!f || f[1] === 1) return nT(x); if (terminates(f) && Math.abs(cl(x * 100) - Math.round(x * 100)) < 1e-9) return nT(x); return rT(x); }
  function cT(x, frac) { var f = toFrac(Math.abs(x)); if (frac && f && f[1] !== 1) return '\\frac{' + f[0] + '}{' + f[1] + '}'; return nT(Math.abs(x)); }
  function sT(x, frac) { if (same(x, 0)) return ''; return (x < 0 ? '-' : '+') + (frac ? cT(x, true) : vT(Math.abs(x))); }
  function aTex(a, frac) { return same(a, 1) ? '' : same(a, -1) ? '-' : (a < 0 ? '-' : '') + cT(a, frac); }
  function polyTex(cs, v, frac) {
    var n = cs.length - 1, s = '';
    cs.forEach(function (c, i) {
      var pw = n - i; if (same(c, 0)) return;
      var neg = c < 0, body = (same(Math.abs(c), 1) && pw > 0 ? '' : cT(c, frac)) + (pw > 1 ? v + '^{' + pw + '}' : pw === 1 ? v : '');
      s += s ? (neg ? '-' : '+') + body : (neg ? '-' : '') + body;
    });
    return s || '0';
  }
  function binTex(v, p, frac) { return same(p, 0) ? v : v + (p > 0 ? '-' : '+') + (frac ? cT(p, true) : vT(Math.abs(p))); }
  function vfTex(a, p, q, v, frac) {
    v = v || 'x';
    var s = aTex(a, frac) + (same(p, 0) ? v + '^{2}' : '(' + binTex(v, p, frac) + ')^{2}');
    return s + sT(q, frac);
  }
  function linTex(m, n, v) { v = v || 'x'; return (m === 1 ? '' : m === -1 ? '-' : m) + v + (n ? (n > 0 ? '+' : '-') + Math.abs(n) : ''); }
  /* k(m1 x + n1)(m2 x + n2); a bare x factor goes in front without brackets */
  function ffTex(k, f1, f2, v, frac) {
    v = v || 'x';
    var fs = [f1, f2].sort(function (A, Bb) { return (A[1] === 0 && A[0] === 1 ? 0 : 1) - (Bb[1] === 0 && Bb[0] === 1 ? 0 : 1); });
    return aTex(k, frac) + fs.map(function (f) { return f[1] === 0 && f[0] === 1 ? v : '(' + linTex(f[0], f[1], v) + ')'; }).join('');
  }
  function ptTex(x, y) { return '(' + vT(x) + ',\\ ' + vT(y) + ')'; }
  function ptKey(x, y) { return '(' + rT(x) + ',' + rT(y) + ')'; }
  function avoid(list) { return function (a, p, q) { return !list.some(function (L) { return same(L[0], a) && same(L[1], p) && same(L[2], q); }); }; }
  /* x-intercepts of a(x − p)² + q (sorted; [] for none) */
  function vfRoots(a, p, q) { var d = -q / a; if (d < -1e-12) return []; if (Math.abs(d) < 1e-12) return [p]; var s = Math.sqrt(d); return [p - s, p + s]; }
  /* p ± √(d) in simplest radical form: d = num/den → √(num·den)/den = (k/w)√f */
  function radParts(d) {
    var fr = toFrac(d), N = fr[0] * fr[1], w = fr[1], k = ex.nthFactor(N, 2), f = N / (k * k), g = gcd(k, w);
    return { k: k / g, w: w / g, f: f };
  }
  function radTex(rp) { // the size of the ± term
    if (rp.f === 1) return rT(rp.k / rp.w);
    var top = (rp.k === 1 ? '' : rp.k) + '\\sqrt{' + rp.f + '}';
    return rp.w === 1 ? top : '\\frac{' + top + '}{' + rp.w + '}';
  }
  function pmTex(p, d, v) { // "x = p ± √d" (exact), or the two rational roots
    var rp = radParts(d); v = v || 'x';
    if (rp.f === 1) { var s = rp.k / rp.w; return v + '=' + rT(p - s) + ',\\ ' + v + '=' + rT(p + s); }
    return v + '=' + (same(p, 0) ? '' : rT(p)) + '\\pm ' + radTex(rp);
  }
  Z.cl = cl; Z.same = same; Z.gcd = gcd; Z.pickWhere = pickWhere; Z.toFrac = toFrac; Z.nT = nT; Z.rT = rT; Z.vT = vT; Z.cT = cT; Z.sT = sT; Z.aTex = aTex;
  Z.polyTex = polyTex; Z.binTex = binTex; Z.vfTex = vfTex; Z.linTex = linTex; Z.ffTex = ffTex; Z.ptTex = ptTex; Z.ptKey = ptKey; Z.avoid = avoid;
  Z.vfRoots = vfRoots; Z.radParts = radParts; Z.radTex = radTex; Z.pmTex = pmTex;

  /* ---- an exact number (a terminating value may be a decimal; otherwise a fraction in lowest terms) ---- */
  function cdiag(cands, dp) {
    return function (v) {
      var c = cands || [];
      for (var i = 0; i < c.length; i++) { if (!c[i] || !isFinite(c[i][0])) continue; if (same(v, c[i][0]) || (dp != null && Math.abs(v - K.roundTo(c[i][0], dp)) < 1e-9)) return { code: c[i][1], hint: c[i][2] }; }
      return null;
    };
  }
  function cleanNum(resp) { return String(resp == null ? '' : resp).trim().replace(/^\s*[a-zA-Z]\s*=\s*/, '').replace(/\\(text|mathrm)\{\s*(m|s|cm|seconds?|metres?)\s*\}\s*$/, '').replace(/\s*(m|s)\s*$/, ''); }
  function numChk(T, o) {
    o = o || {};
    var fr = toFrac(T), nonTerm = fr && fr[1] !== 1 && !terminates(fr), dg = cdiag((o.cands || []).filter(function (c) { return c && !same(c[0], T); }));
    return function (resp) {
      var a = K.read(cleanNum(resp)); if (a.res) return a.res;
      var sh = ex.shape(a.ast);
      if (Object.keys(sh.vars).length) return form('notnumber', 'Type a number only (no letters).');
      if (same(a.val, T)) {
        var pf = ex.plainFraction(a.ast);
        if (sh.ops || sh.pow || sh.roots || sh.muls || (sh.divs && !pf)) return form('simplify', 'Right value — now simplify it to a single number.');
        if (pf && pf[1] !== 1 && gcd(pf[0], pf[1]) > 1) return form('lowest', 'Right value — now reduce the fraction to lowest terms.');
        return ok();
      }
      if (nonTerm && sh.decimals && Math.abs(a.val - T) < 0.01) return form('decimal-rounded', 'That decimal is close, but it isn’t exact. Give the exact value as a fraction.');
      if (!isFinite(a.val)) return wrong('undefined', null);
      var h = dg(a.val); if (h) return wrong(h.code, h.hint);
      if (T !== 0 && same(a.val, -T)) return wrong('sign', 'Check the sign of your answer.');
      return wrong('value', null);
    };
  }
  function numKey(T) { var f = toFrac(T); return f && f[1] !== 1 && !terminates(f) ? rT(T) : String(cl(T)); }
  function badNums(cands, ans, dp) {
    var out = [];
    (cands || []).forEach(function (c) {
      if (!c || !isFinite(c[0])) return;
      var x = dp != null ? K.roundTo(c[0], dp) : cl(c[0]);
      if (dp != null ? Math.abs(x - K.roundTo(ans, dp)) < 1e-9 : same(x, ans)) return;
      var f = toFrac(x); out.push(dp != null ? x.toFixed(dp) : f && f[1] !== 1 && !terminates(f) ? rT(x) : String(x));
    });
    return out;
  }
  function nrWrap(check) { return function (resp) { var s = String(resp == null ? '' : resp).replace(/\s/g, ''); if (HW.parse.number(s).ok && s.length > 4) return form('nr-long', 'Numerical response answers fit in 4 boxes (digits and a decimal point only).'); return check(resp); }; }
  Z.cdiag = cdiag; Z.numChk = numChk; Z.numKey = numKey; Z.nrWrap = nrWrap;

  /* ---- points, the axis of symmetry, maximum/minimum ---- */
  function ptChk(X, Y, o) {
    o = o || {};
    var w = (o.cands || []).filter(function (c) { return c && !(same(c[0][0], X) && same(c[0][1], Y)); }).map(function (c) { return { is: c[0], code: c[1], hint: c[2] }; });
    return K.point([X, Y], { wrong: w });
  }
  function axisChk(p, o) {
    o = o || {};
    var w = [];
    if (!same(p, 0)) w.push({ is: { x: -p }, code: LID + '-p-sign', hint: o.signHint || 'Check the sign: the bracket is ' + t('(x-p)') + ', so ' + t('(' + binTex('x', p) + ')') + ' means ' + t('p=' + vT(p)) + '.' });
    if (o.q != null) w.push({ is: { y: o.q }, code: LID + '-axis-y', hint: 'The axis of symmetry is the <b>vertical</b> line through the vertex, ' + t('x=p') + '.' });
    (o.cands || []).forEach(function (c) { if (!same(c[0], p)) w.push({ is: { x: c[0] }, code: c[1], hint: c[2] }); });
    var inner = K.line({ x: p }, { wrong: w });
    return function (resp) {
      var s = String(resp == null ? '' : resp).trim();
      if (s && !/=/.test(s)) {
        var a = ex.parse(s);
        if (a.ok && !Object.keys(ex.shape(a.ast).vars).length) { if (same(ex.value(a.ast), p)) return form(LID + '-axis-eq', 'Right value — now write the axis of symmetry as an equation, ' + t('x=\\ldots') + '.'); return inner('x=' + s); }
      }
      return inner(resp);
    };
  }
  function mmChk(kind) {
    return function (resp) {
      var s = String(resp == null ? '' : resp).replace(/\\text\{([^}]*)\}|\\mathrm\{([^}]*)\}/g, '$1$2').replace(/[\\{}]/g, '').trim().toLowerCase();
      if (!s) return form('empty', 'Type <b>maximum</b> or <b>minimum</b>.');
      var isMax = /^max/.test(s), isMin = /^min/.test(s);
      if (!isMax && !isMin) return form(LID + '-maxmin-word', 'Type the word <b>maximum</b> or <b>minimum</b>.');
      if ((kind === 'max') === isMax) return ok();
      return wrong(LID + '-maxmin', kind === 'max' ? 'Here ' + t('a<0') + ': the parabola opens down, so the vertex is the highest point (a maximum).' : 'Here ' + t('a>0') + ': the parabola opens up, so the vertex is the lowest point (a minimum).');
    };
  }
  Z.ptChk = ptChk; Z.axisChk = axisChk; Z.mmChk = mmChk;

  /* ---- domain and range ---- */
  function fixFrac(s) { return String(s == null ? '' : s).replace(/\\([dt]?frac)(\d)(\d)/g, '\\frac{$2}{$3}').replace(/\\([dt]?frac)(\{[^{}]*\})(\d)/g, '\\frac$2{$3}').replace(/\\([dt]?frac)(\d)(\{)/g, '\\frac{$2}$3'); }
  function setChk(tex, o) { var c = K.set(tex, o || {}); return function (resp) { return c(fixFrac(resp)); }; }
  var DOM = '\\{x\\mid x\\in\\mathbb{R}\\}';
  function rangeTex(q, up, v) { v = v || 'y'; return '\\{' + v + '\\mid ' + v + (up ? '\\ge ' : '\\le ') + rT(q) + ',\\ ' + v + '\\in\\mathbb{R}\\}'; }
  /* range of a parabola: y ≥ q (up) or y ≤ q; o.p (the "range from p" slip), o.c (from the y-intercept), o.wrong */
  function rangeChk(q, up, o) {
    o = o || {};
    var w = [{ is: rangeTex(q, !up), code: LID + '-range-dir', hint: up ? 'The parabola opens <b>up</b>, so the range goes up from the vertex: ' + t('y\\ge q') + '.' : 'The parabola opens <b>down</b>, so the range goes down from the vertex: ' + t('y\\le q') + '.' }];
    if (o.p != null && !same(o.p, q)) w.push({ is: rangeTex(o.p, up), code: LID + '-range-p', hint: 'The range uses the <b>y</b>-coordinate of the vertex (the max or min value), not the ' + t('x') + '-coordinate.' }, { is: rangeTex(o.p, !up), code: LID + '-range-p', hint: 'The range uses the <b>y</b>-coordinate of the vertex (the max or min value), not the ' + t('x') + '-coordinate.' });
    if (o.c != null && !same(o.c, q)) w.push({ is: rangeTex(o.c, up), code: 'u5l4-range-yint', hint: 'The range starts at the vertex (the max or min value), not at the ' + t('y') + '-intercept.' });
    (o.wrong || []).forEach(function (x) { w.push(x); });
    return setChk(rangeTex(q, up), { v: 'y', wrong: w, other: DOM, otherName: 'domain' });
  }
  Z.fixFrac = fixFrac; Z.setChk = setChk; Z.DOM = DOM; Z.rangeTex = rangeTex; Z.rangeChk = rangeChk;
  Z.domChk = function (o) { o = o || {}; return setChk(DOM, { v: 'x', other: o.range, otherName: 'range', wrong: o.wrong }); };

  /* ---- x-intercepts as a set of values ("none" possible) ---- */
  var NONE = /^(no(real)?(x?intercepts?|roots?|solutions?|zeros?|realroots?)?|none|nosolutions?|∅|\\varnothing|\\emptyset|\{\}|\\\{\\\})$/i;
  function readRoots(resp, v) {
    var s = String(resp == null ? '' : resp).replace(/\\(left|right)/g, '').replace(/\\(text|mathrm|textrm)\{([^{}]*)\}/g, '$2');
    var sq = s.replace(/\s|\\[ ,;:!]|~/g, '').replace(/^[a-zA-Z]=/, '').replace(/\.$/, '').replace(/-/g, '');
    if (!sq) return { empty: true };
    if (NONE.test(sq)) return { none: true };
    s = s.replace(/\b(or|and)\b/gi, ',').replace(/;/g, ',').replace(/\\(quad|qquad)|\\[ ,;:!]|~/g, ' ');
    var lm, letters = /([a-zA-Z])\s*=/g;
    while ((lm = letters.exec(s))) { if (v && lm[1] !== v) return { letter: lm[1] }; }
    s = s.replace(/[a-zA-Z]\s*=\s*/g, '');
    var out = [], pieces = s.split(',');
    for (var i = 0; i < pieces.length; i++) {
      var p = pieces[i].trim(); if (!p) continue;
      var pm = /\\pm|±/.exec(p), alts = pm ? [p.slice(0, pm.index) + '+' + p.slice(pm.index + pm[0].length), p.slice(0, pm.index) + '-' + p.slice(pm.index + pm[0].length)] : [p];
      for (var j = 0; j < alts.length; j++) {
        var a = alts[j].replace(/^\s*\+/, ''), r = ex.parse(a); if (!r.ok) return { bad: true };
        var val = ex.value(r.ast); if (!isFinite(val)) return { bad: true };
        out.push({ v: val, ast: r.ast });
      }
    }
    if (!out.length) return { empty: true };
    return { vals: out };
  }
  function uniqVals(L) { var o = []; L.forEach(function (x) { if (!o.some(function (y) { return same(x, y); })) o.push(x); }); return o; }
  function setEq(A, T) { return A.length === T.length && A.every(function (x) { return T.some(function (y) { return same(x, y); }); }); }
  function rootsIn(a, cond) { // any node satisfying cond
    var hit = false; (function walk(x) { if (!x || hit) return; if (cond(x)) { hit = true; return; } ['a', 'b', 'n'].forEach(function (k) { if (x[k] && typeof x[k] === 'object') walk(x[k]); }); })(a); return hit;
  }
  function radForm(ast) { // a form problem with the radicals in an exact answer, or null
    var res = null;
    (function walk(x) {
      if (!x || res) return;
      if (x.t === 'root') {
        var r = ex.rat(x.a);
        if (r && r[1] !== 1) { res = form(LID + '-rad-frac', 'Right values — now simplify the radical: no fraction under the root (' + t('\\sqrt{\\frac{a}{b}}=\\frac{\\sqrt{ab}}{b}') + ').'); return; }
        if (r && r[0] > 0) {
          var k = ex.nthFactor(r[0], 2);
          if (k * k === r[0]) { res = form('simplify', 'Right values — ' + t('\\sqrt{' + r[0] + '}=' + k) + ', so simplify your answer.'); return; }
          if (k > 1) { res = form('not-simplest', 'Right values — now write ' + t('\\sqrt{' + r[0] + '}') + ' in simplest radical form.'); return; }
        }
      }
      if (x.t === 'div' && rootsIn(x.b, function (y) { return y.t === 'root'; })) { res = form(LID + '-rad-den', 'Right values — now simplify: no square root in the denominator.'); return; }
      ['a', 'b', 'n'].forEach(function (k2) { if (x[k2] && typeof x[k2] === 'object') walk(x[k2]); });
    })(ast);
    return res;
  }
  /* spec: { vals (the x-intercepts; [] = none), irr (exact radicals), cands [[values, code, hint]], v, noneHint, negHint, letter } */
  function rootsChk(spec) {
    var T = uniqVals(spec.vals || []), v = spec.v || 'x', what = spec.what || t(v) + '-intercepts';
    var cands = (spec.cands || []).filter(function (c) { return c && c[0].every(isFinite) && !setEq(uniqVals(c[0]), T); });
    return function (resp) {
      var A = readRoots(resp, v);
      if (A.empty) return form('empty', 'Type your answer first (or <b>none</b>).');
      if (A.letter) return form('sol-letter', 'Use the variable ' + t(v) + ' here (you wrote ' + t(A.letter + '=') + ').');
      if (A.bad) return form('unreadable', 'Write each value as a number, separated by commas, e.g. ' + t(v + '=3,\\ ' + v + '=-5') + ' (or use ' + t('\\pm') + '), or type <b>none</b>.');
      if (A.none) return T.length ? wrong(LID + '-said-none', spec.noneHint || 'There are ' + what + ' here: after you isolate the square, it equals a number that is ' + t('\\ge 0') + ', so take the square root of both sides.') : ok();
      var vals = uniqVals(A.vals.map(function (x) { return x.v; }));
      for (var i = 0; i < cands.length; i++) if (setEq(vals, uniqVals(cands[i][0]))) return wrong(cands[i][1], cands[i][2]);
      if (!T.length) return wrong(LID + '-neg-sq', spec.negHint || 'Check the step where you isolate the square: a square can’t equal a negative number, so there are no ' + what + '.');
      if (setEq(vals, T)) {
        for (var j = 0; j < A.vals.length; j++) {
          var ast = A.vals[j].ast, sh = ex.shape(ast);
          if (!spec.irr && (sh.ops || sh.roots || sh.pow || sh.muls || (sh.divs && !ex.plainFraction(ast)))) return form('simplify', 'Right values — now simplify each one to a single number.');
          if (spec.irr) { var rf = radForm(ast); if (rf) return rf; }
          var pf = ex.plainFraction(ast); if (pf && pf[1] !== 1 && gcd(pf[0], pf[1]) > 1) return form('lowest', 'Right values — now reduce the fractions to lowest terms.');
        }
        return ok();
      }
      var dec = A.vals.some(function (x) { return ex.shape(x.ast).decimals; });
      if (spec.irr && dec && vals.length === T.length && vals.every(function (x) { return T.some(function (y) { return Math.abs(x - y) < 0.006; }); })) return form(LID + '-exact', 'Those are rounded decimals. Give the exact values, in simplest radical form (use ' + t('\\pm') + ' and ' + t('\\sqrt{\\ }') + ').');
      if (vals.length === 1 && T.length === 2 && T.some(function (y) { return same(y, vals[0]); })) return wrong(LID + '-pm', 'Correct so far — but a square has two square roots: ' + t('(x-p)^{2}=k') + ' gives ' + t('x-p=\\pm\\sqrt{k}') + ', so there are two ' + what + '.');
      var miss = T.filter(function (x) { return !vals.some(function (y) { return same(x, y); }); }), extra = vals.filter(function (x) { return !T.some(function (y) { return same(x, y); }); });
      if (miss.length && !extra.length) return wrong('sol-missing', 'Correct so far — but there is another value.');
      if (extra.length && !miss.length) return wrong('sol-extra', 'You have a value that doesn’t belong — substitute each one to check.');
      if (vals.length === T.length && vals.every(function (x) { return T.some(function (y) { return same(-x, y); }); })) return wrong(LID + '-p-sign', 'Check the signs: ' + t('x+3=0') + ' gives ' + t('x=-3') + '.');
      return wrong('value', null);
    };
  }
  function rootsKey(spec) {
    var v = spec.v || 'x', T = uniqVals(spec.vals || []).sort(function (a, b) { return a - b; });
    if (!T.length) return '\\text{none}';
    if (spec.irr && spec.pm) return pmTex(spec.pm[0], spec.pm[1], v);
    return T.map(function (x) { return v + '=' + rT(x); }).join(',\\ ');
  }
  function rootsAns(spec) { return (spec.vals || []).length ? t(rootsKey(spec)) : (spec.noneText || 'none (no ' + (spec.v || 'x') + '-intercepts)'); }
  Z.readRoots = readRoots; Z.rootsChk = rootsChk; Z.rootsKey = rootsKey; Z.rootsAns = rootsAns; Z.uniqVals = uniqVals; Z.setEq = setEq;
  /* the classic wrong x-intercepts for a(x − p)² + q = 0 */
  Z.vfCands = function (a, p, q) {
    var c = [], d = -q / a, sq = function (k) { return k >= 0 ? [p - Math.sqrt(k), p + Math.sqrt(k)] : null; };
    if (same(q, 0)) return c;
    if (!same(p, 0) && d >= 0) c.push([[-p - Math.sqrt(d), -p + Math.sqrt(d)], LID + '-p-sign', 'Check the sign of ' + t('p') + ': ' + t('(' + binTex('x', p) + ')^{2}') + ' is zero at ' + t('x=' + vT(p)) + ', so the ' + t('x') + '-intercepts are ' + t(vT(p) + '\\pm\\ldots') + '.']);
    if (!same(Math.abs(a), 1) && sq(-q * Math.sign(a))) c.push([sq(Math.abs(q)), LID + '-div-a', 'Divide both sides by ' + t('a=' + vT(a)) + ' <b>before</b> you take the square root: ' + t('(' + binTex('x', p) + ')^{2}=' + rT(d)) + '.']);
    if (d < 0 && sq(-d)) c.push([sq(-d), LID + '-move-q', 'Check the sign when you move ' + t('q') + ' across: ' + t(vfTex(a, p, q) + '=0') + ' gives ' + t(aTex(a) + '(' + binTex('x', p) + ')^{2}=' + vT(-q)) + '. Then a square would have to equal a negative number.']);
    if (d > 0 && !same(Math.abs(a), 1) && sq(Math.abs(q * a))) c.push([sq(Math.abs(q * a)), LID + '-div-a', 'Divide both sides by ' + t('a') + ' (don’t multiply): ' + t('(' + binTex('x', p) + ')^{2}=' + rT(d)) + '.']);
    return c;
  };

  /* ---- expressions in x: equivalent to fn (checked at several values); o.vertex: written as a(x − p)² + q ---- */
  function stripLHS(s) { return String(s == null ? '' : s).replace(/^\s*[A-Za-z](_\{?[A-Za-z0-9]+\}?)?\s*(\\left)?\(\s*[a-zA-Z]\s*(\\right)?\)\s*=\s*/, '').replace(/^\s*[A-Za-z]\s*=\s*/, ''); }
  var XS = [-2.3, -0.7, 0.4, 1.3, 2.9, 4.6];
  function unparen(a) { while (a && a.t === 'paren') a = a.a; return a; }
  function isConst(a) { return !Object.keys(ex.shape(a).vars).length; }
  function termsOf(a, sign, out) { a = unparen(a); if (a.t === 'add') { termsOf(a.a, sign, out); termsOf(a.b, sign, out); } else if (a.t === 'sub') { termsOf(a.a, sign, out); termsOf(a.b, -sign, out); } else out.push({ s: sign, a: a }); return out; }
  function factorsOf(a, out) { if (a.t === 'neg') return factorsOf(a.a, out); if (a.t === 'mul') { factorsOf(a.a, out); return factorsOf(a.b, out); } if (a.t === 'div') { if (!isConst(a.b)) { out.bad = true; return out; } return factorsOf(a.a, out); } out.push(a); return out; }
  function isVertexForm(ast, v, order) {
    var ts = termsOf(ast, 1, []), sq = ts.filter(function (x) { return !isConst(x.a); });
    if (sq.length !== 1 || ts.length > 2 || (order && isConst(ts[0].a))) return false;
    var fs = factorsOf(sq[0].a, []); if (fs.bad) return false;
    var vf = fs.filter(function (f) { return !isConst(f); }); if (vf.length !== 1) return false;
    var pw = vf[0]; if (pw.t !== 'pow' || !same(ex.value(pw.b), 2)) return false;
    var inner = unparen(pw.a);
    if (inner.t === 'var') return inner.n === v;
    return (inner.t === 'add' || inner.t === 'sub') && unparen(inner.a).t === 'var' && unparen(inner.a).n === v && isConst(inner.b);
  }
  function fitQuad(f) {
    var c = f(0), f1 = f(1), fm = f(-1); if (![c, f1, fm].every(isFinite)) return null;
    var a = (f1 + fm) / 2 - c, b = (f1 - fm) / 2;
    for (var i = 0; i < XS.length; i++) { var x = XS[i], y = f(x); if (!isFinite(y) || Math.abs(a * x * x + b * x + c - y) > 1e-6 * Math.max(1, Math.abs(y))) return null; }
    return { a: a, b: b, c: c };
  }
  function eqFn(f, g) { for (var i = 0; i < XS.length; i++) { var x = XS[i], y = f(x), z = g(x); if (!isFinite(y) || !isFinite(z) || Math.abs(y - z) > 1e-7 * Math.max(1, Math.abs(z))) return false; } return true; }
  function readFn(resp, v) {
    var a = K.read(stripLHS(resp)); if (a.res) return { res: a.res };
    var vs = Object.keys(ex.shape(a.ast).vars);
    if (vs.some(function (x) { return x !== v; })) return { res: form(LID + '-letter', 'Use only the letter ' + t(v) + ' in your expression.') };
    if (!vs.length) return { res: wrong(LID + '-no-var', 'Your answer should be an expression in ' + t(v) + '.') };
    return { ast: a.ast, f: function (x) { var e = {}; e[v] = x; return ex.value(a.ast, e); } };
  }
  /* o: v, cands [[fn, code, hint]], vertex {a, p, q}, what */
  function exprChk(fn, o) {
    o = o || {}; var v = o.v || 'x';
    return function (resp) {
      var R = readFn(resp, v); if (R.res) return R.res;
      if (eqFn(R.f, fn)) { if (o.vertex && !isVertexForm(R.ast, v)) return form(LID + '-not-vertex', 'Right function — now write it in vertex form, ' + t('y=a(' + v + '-p)^{2}+q') + '.'); if (o.vertex && !isVertexForm(R.ast, v, true)) return form(LID + '-not-vertex', 'Right — now write it in the order ' + t('a(' + v + '-p)^{2}+q') + ' (the squared term first).'); return ok(); }
      var c = o.cands || [];
      for (var i = 0; i < c.length; i++) if (c[i] && eqFn(R.f, c[i][0])) return wrong(c[i][1], c[i][2]);
      if (o.vertex) {
        var V = o.vertex, g = fitQuad(R.f);
        if (!g || Math.abs(g.a) < 1e-9) return wrong('value', 'Your expression isn’t a quadratic. Check the square on the bracket.');
        var p2 = -g.b / (2 * g.a), q2 = g.c - g.b * g.b / (4 * g.a), sa = same(g.a, V.a);
        if (sa && same(p2, -V.p) && !same(V.p, 0)) return wrong(LID + '-p-sign', 'Check the sign inside the bracket: the vertex is at ' + t(v + '=' + rT(V.p)) + ', so the bracket is ' + t('(' + binTex(v, V.p) + ')') + '.');
        if (sa && same(p2, V.p)) return wrong(LID + '-q', 'The bracket and ' + t('a') + ' are right — check the constant ' + t('q') + '.');
        if (!sa && same(p2, V.p) && same(q2, V.q)) return wrong(LID + '-a', 'The vertex is right — check ' + t('a') + '.');
      }
      return wrong('value', o.what ? 'Check your expression: substitute a value of ' + t(v) + ' and compare with ' + o.what + '.' : null);
    };
  }
  /* an equation in vertex form with given features: spec { p, q, aSign, pHint, qHint, dirHint } */
  function featChk(sp) {
    return function (resp) {
      var R = readFn(resp, 'x'); if (R.res) return R.res;
      var g = fitQuad(R.f);
      if (!g || Math.abs(g.a) < 1e-9) return wrong(LID + '-feat-quad', 'Your equation should be a quadratic function, ' + t('y=a(x-p)^{2}+q') + '.');
      if (!isVertexForm(R.ast, 'x')) return form(LID + '-not-vertex', 'Write your equation in vertex form, ' + t('y=a(x-p)^{2}+q') + '.');
      var p2 = -g.b / (2 * g.a), q2 = g.c - g.b * g.b / (4 * g.a);
      if (!same(p2, sp.p)) return same(p2, -sp.p) ? wrong(LID + '-p-sign', 'Check the sign inside the bracket: ' + t('(x-p)') + ' with ' + t('p=' + vT(sp.p)) + ' is ' + t('(' + binTex('x', sp.p) + ')') + '.') : wrong(LID + '-feat-p', sp.pHint || 'Check the vertex (or the axis of symmetry) of your parabola.');
      if (sp.q != null && !same(q2, sp.q)) return same(q2, -sp.q) ? wrong(LID + '-q-sign', 'Check the sign of ' + t('q') + '.') : wrong(LID + '-feat-q', sp.qHint || 'Check the ' + t('y') + '-coordinate of the vertex, ' + t('q') + '.');
      if (sp.aSign && Math.sign(g.a) !== sp.aSign) return wrong(LID + '-feat-dir', sp.dirHint || (sp.aSign < 0 ? 'Your parabola opens up. It has to open <b>down</b>: ' + t('a<0') + '.' : 'Your parabola opens down. It has to open <b>up</b>: ' + t('a>0') + '.'));
      return ok();
    };
  }
  Z.stripLHS = stripLHS; Z.isVertexForm = isVertexForm; Z.fitQuad = fitQuad; Z.eqFn = eqFn; Z.exprChk = exprChk; Z.featChk = featChk;

  /* =========================== part builders =========================== */
  function unitAns(o) { return o.unit ? '\\text{ ' + o.unit + '}' : ''; }
  Z.num = function (prompt, ans, o) {
    o = o || {};
    var f = toFrac(ans), frac = f && f[1] !== 1 && !terminates(f);
    var input = frac || o.math ? { type: 'math', keys: 'u5k34', before: o.before, after: o.after } : { type: 'number', before: o.before, after: o.after, nr: !!o.nr };
    var check = numChk(ans, o); if (o.nr) check = nrWrap(check);
    return { prompt: prompt, input: input, check: check, key: numKey(ans), answer: t((o.ansPre || '') + (frac ? rT(ans) : nT(ans)) + unitAns(o)),
      solution: o.sol, hints: o.hints || [], text: o.text, bad: badNums(o.cands, ans).concat(o.bad || []), good: o.good, outcome: o.outcome };
  };
  Z.apx = function (prompt, x, dp, o) {
    o = o || {};
    return { prompt: prompt, input: { type: 'number', before: o.before, after: o.after, nr: !!o.nr }, check: K.approx(x, dp, { diag: cdiag(o.cands, dp), nr: o.nr }), key: K.roundTo(x, dp).toFixed(Math.max(dp, 0)),
      answer: t(F(K.roundTo(x, dp).toFixed(dp)) + unitAns(o)), solution: o.sol, hints: o.hints || [], text: o.text, bad: badNums(o.cands, x, dp).concat(o.bad || []), good: o.good, outcome: o.outcome };
  };
  /* several boxes. specs: [{ label, name, before, after, placeholder,
   *   ans (exact) + cands | dp + ans + cands | pt: [x, y] + cands | axis: p + q + cands | mm: 'max'|'min' | set: tex + opt (setChk) |
   *   range: [q, up] + opt | dom: true | roots: spec | expr: { fn, key, vertex, cands } | poly: { target, opt } | fac: { target, opt } |
   *   check + key + ansTex (+ math) }] */
  Z.fields = function (prompt, specs, o) {
    o = o || {};
    var fields = [], checks = [], keys = [], ans = [], hasSet = specs.some(function (s) { return s.set || s.range || s.dom; });
    var MK = hasSet ? 'u5k34s' : 'u5k34';
    specs.forEach(function (s) {
      var mode, chk, key, aTx, ph = s.placeholder;
      if (s.pt) { mode = 'math'; chk = ptChk(s.pt[0], s.pt[1], s); key = ptKey(s.pt[0], s.pt[1]); aTx = ptTex(s.pt[0], s.pt[1]); ph = ph || 'e.g. (3, -2)'; }
      else if (s.axis != null) { mode = 'math'; chk = axisChk(s.axis, s); key = 'x=' + rT(s.axis); aTx = 'x=' + vT(s.axis); ph = ph || 'e.g. x = 3'; }
      else if (s.mm) { mode = 'text'; chk = mmChk(s.mm); key = s.mm === 'max' ? 'maximum' : 'minimum'; aTx = '\\text{' + key + '}'; ph = ph || 'maximum or minimum'; }
      else if (s.range) { mode = 'math'; chk = rangeChk(s.range[0], s.range[1], s.opt); key = rangeTex(s.range[0], s.range[1]); aTx = key; ph = ph || 'e.g. {y | y >= 2, y in R}'; }
      else if (s.dom) { mode = 'math'; chk = Z.domChk(s.opt); key = DOM; aTx = DOM; ph = ph || 'e.g. {x | x in R}'; }
      else if (s.set) { mode = 'math'; chk = setChk(s.set, s.opt); key = s.set; aTx = s.set; ph = ph || 'e.g. {x | 0 <= x <= 5, x in R}'; }
      else if (s.roots) { mode = 'math'; chk = rootsChk(s.roots); key = rootsKey(s.roots); aTx = null; ph = ph || 'e.g. x = 3, x = -5  or  none'; }
      else if (s.expr) { mode = 'math'; chk = exprChk(s.expr.fn, s.expr); key = s.expr.key; aTx = s.expr.ansTex || s.expr.key; }
      else if (s.poly) { mode = 'math'; chk = K.poly(s.poly.target, s.poly.opt || {}); key = s.poly.key || s.poly.target; aTx = key; }
      else if (s.fac) { mode = 'math'; chk = K.factored(s.fac.target, s.fac.opt || {}); key = s.fac.key || s.fac.target; aTx = key; }
      else if (s.check) { mode = s.math ? 'math' : s.text ? 'text' : undefined; chk = s.check; key = s.key; aTx = s.ansTex; }
      else if (s.dp != null) { chk = K.approx(s.ans, s.dp, { diag: cdiag(s.cands, s.dp) }); key = K.roundTo(s.ans, s.dp).toFixed(Math.max(0, s.dp)); aTx = F(key); }
      else { var f = toFrac(s.ans), frac = f && f[1] !== 1 && !terminates(f); mode = frac || s.math ? 'math' : undefined; chk = numChk(s.ans, s); key = numKey(s.ans); aTx = frac ? rT(s.ans) : nT(s.ans); }
      fields.push({ label: s.label, name: s.name || String(s.label || '').replace(/<[^>]+>|\\\(|\\\)/g, ''), after: s.after, before: s.before, mode: mode, keys: mode === 'math' ? MK : undefined, vars: ['x', 'y'], placeholder: ph, wide: mode === 'math' });
      checks.push(chk); keys.push(key);
      ans.push((s.label ? s.label + ' ' : '') + (aTx == null ? rootsAns(s.roots) : t(aTx + (s.unit ? '\\text{ ' + s.unit + '}' : ''))));
    });
    var p = B.fields(prompt, fields, checks, keys, ans.join('<br>'), o.sol, o.hints || [], o.text);
    (o.swap || []).forEach(function (sw) {
      var i = sw[0], j = sw[1], inner = p.check;
      p.check = function (resp) { var r1 = inner(resp); if (r1.v === 'correct' || !Array.isArray(resp)) return r1; var s2 = resp.slice(); s2[i] = resp[j]; s2[j] = resp[i]; var r2 = inner(s2); return r2.v === 'correct' ? r2 : r1; };
    });
    p.bad = o.bad; p.good = o.good; p.outcome = o.outcome;
    return p;
  };
  Z.mc = function (r, prompt, opts, sol, hints, text, keepOrder) {
    var seen = {}, out = [];
    opts.forEach(function (op) { var k = op.html.replace(/\s/g, ''); if (seen[k] && !op.right) return; seen[k] = 1; out.push(op); });
    return B.mc(r, prompt, out, sol, hints || [], text, keepOrder);
  };
  Z.roots = function (prompt, spec, o) {
    o = o || {};
    var T0 = uniqVals(spec.vals), bad = (spec.cands || []).filter(function (c) { return c[0].every(isFinite) && !setEq(uniqVals(c[0]), T0); }).map(function (c) { return c[0].map(function (x) { return 'x=' + rT(cl(x)); }).join(',\\ '); });
    if (spec.vals.length) bad.push('\\text{none}'); else bad.push('x=0');
    if (spec.vals.length === 2) bad.push('x=' + rT(spec.vals[1]));
    return { prompt: prompt, input: { type: 'math', keys: 'u5k34', vars: ['x'], before: o.before, placeholder: 'e.g. x = 3, x = -5  or  none' }, check: rootsChk(spec), key: rootsKey(spec), answer: rootsAns(spec),
      solution: o.sol, hints: o.hints || [], text: o.text, bad: o.bad || bad.filter(function (b) { return !/NaN/.test(b); }), good: o.good || (spec.vals.length ? [] : ['none', 'no x-intercepts', '\\varnothing']), outcome: o.outcome };
  };

  /* ---- number of x-intercepts with a reason (multiple choice) ---- */
  function countOf(a, q) { return same(q, 0) ? 1 : (a > 0) === (q < 0) ? 2 : 0; }
  function posWord(q) { return same(q, 0) ? 'on' : q > 0 ? 'above' : 'below'; }
  Z.countOf = countOf;
  Z.countMC = function (r, prompt, a, p, q, o) {
    o = o || {};
    var n = countOf(a, q), up = a > 0, V = t(ptTex(p, q)), reason = function (u, pos) { return 'opens ' + (u ? 'up' : 'down') + ' and its vertex ' + V + ' is ' + pos + ' the ' + t('x') + '-axis'; };
    var opts = [];
    function lab(k) { return '<b>' + k + '</b> ' + t('x') + '-intercept' + (k === 1 ? '' : 's') + ': '; }
    if (n === 1) {
      opts.push({ html: lab(1) + 'the vertex ' + V + ' is on the ' + t('x') + '-axis', right: true });
      opts.push({ html: lab(2) + 'it ' + reason(up, up ? 'below' : 'above'), why: 'Here ' + t('q=0') + ': the vertex is <b>on</b> the ' + t('x') + '-axis, so the parabola just touches it once.', code: LID + '-count' });
      opts.push({ html: lab(0) + 'it ' + reason(up, up ? 'above' : 'below'), why: 'Here ' + t('q=0') + ': the vertex is <b>on</b> the ' + t('x') + '-axis, so the parabola touches it once.', code: LID + '-count' });
    } else {
      var pos = posWord(q);
      opts.push({ html: lab(n) + 'it ' + reason(up, pos), right: true });
      opts.push({ html: lab(2 - n) + 'it ' + reason(!up, pos), why: 'Check the direction of opening: ' + t('a=' + vT(a)) + ' is ' + (up ? 'positive, so it opens up' : 'negative, so it opens down') + '.', code: LID + '-count-dir' });
      opts.push({ html: lab(2 - n) + 'it ' + reason(up, pos === 'above' ? 'below' : 'above').replace(V, t(ptTex(p, -q))), why: 'Check the vertex: ' + t('q=' + vT(q)) + ', so the vertex is ' + pos + ' the ' + t('x') + '-axis.', code: LID + '-count-q' });
      opts.push({ html: lab(1) + 'the vertex is on the ' + t('x') + '-axis', why: 'The vertex is on the ' + t('x') + '-axis only when ' + t('q=0') + '.', code: LID + '-count' });
    }
    var sol = n === 1 ? t('q=0') + ': the vertex ' + V + ' is on the ' + t('x') + '-axis, so there is <b>1</b> ' + t('x') + '-intercept.'
      : t('a' + (up ? '>' : '<') + '0') + ': it opens ' + (up ? 'up' : 'down') + ', and the vertex ' + V + ' is ' + posWord(q) + ' the ' + t('x') + '-axis, so there ' + (n === 2 ? 'are <b>2</b> ' + t('x') + '-intercepts' : 'are <b>0</b> ' + t('x') + '-intercepts') + '.';
    return Z.mc(r, prompt, opts, sol, o.hints || ['Picture the vertex and the direction of opening: does the parabola have to cross the ' + t('x') + '-axis?'], o.text || 'number of x-intercepts');
  };

  /* ---- figures ---- */
  Z.parabola = function (a, p, q) { return function (x) { return a * (x - p) * (x - p) + q; }; };
  Z.fig = function (o) {
    var svg = HW.graph({ x: o.x, y: o.y, grid: o.g || 1, gridY: o.gy || o.g || 1, labels: o.l || 2, labelsX: o.lx || o.l || 2, labelsY: o.ly || o.l || 2, xName: o.xName || 'x', yName: o.yName || 'y', xTitle: o.xTitle, yTitle: o.yTitle,
      unitX: o.ux, unitY: o.uy, max: o.max || 300, aria: o.aria || 'graph', fns: (o.fns || []).map(function (f) { return typeof f === 'function' ? { f: f } : f; }), points: o.points || [], vline: o.vline, hline: o.hline, firstQuadrant: o.firstQuadrant });
    return o.bare ? svg : '<div class="fig">' + svg + '</div>';
  };
  /* a window that fits the given vertices (and extra points) */
  Z.win = function (pts, padX, padY) {
    padX = padX == null ? 3 : padX; padY = padY == null ? 2 : padY;
    var xs = pts.map(function (P) { return P[0]; }).concat([0]), ys = pts.map(function (P) { return P[1]; }).concat([0]);
    var x0 = Math.floor(Math.min.apply(null, xs) - padX), x1 = Math.ceil(Math.max.apply(null, xs) + padX), y0 = Math.floor(Math.min.apply(null, ys) - padY), y1 = Math.ceil(Math.max.apply(null, ys) + padY);
    if ((x1 - x0) % 2) x1++; if ((y1 - y0) % 2) y1++;
    return { x: [x0, x1], y: [y0, y1] };
  };
  /* choose the graph: opts [{ f, right, why, points }] on one window */
  Z.graphMC = function (r, prompt, opts, win, sol, hints, text) {
    var span = Math.max(win.x[1] - win.x[0], win.y[1] - win.y[0]), l = span > 16 ? 4 : 2;
    var out = opts.map(function (op, i) { return { html: Z.fig({ x: win.x, y: win.y, l: l, fns: [op.f], points: op.points || [], max: 210, bare: true, aria: 'graph option' }), right: !!op.right, why: op.why, code: op.code || ('g' + i) }; });
    var p = B.mc(r, prompt, out, sol, hints || [], text);
    p.input.columns = 2;
    return p;
  };

  /* ---- keypads ---- */
  var W = HW.widgets;
  if (W && W.KEYSETS) {
    var d = function (n) { return { label: String(n), tex: String(n), plain: String(n) }; };
    var KY = {
      del: { label: '⌫', fn: 'del', title: 'Delete' }, clear: { label: 'clear', fn: 'clear' }, left: { label: '◀', fn: 'left', title: 'Move left' }, right: { label: '▶', fn: 'right', title: 'Move right (out of a box)' },
      enter: { label: 'Check ↵', fn: 'enter', wide: true }, minus: { label: '−', tex: '-', plain: '-' }, plus: { label: '+', tex: '+', plain: '+' }, dot: { label: '.', tex: '.', plain: '.' },
      frac: { label: '<sup>a</sup>⁄<sub>b</sub>', tex: '\\frac{#@}{#?}', plain: '/', title: 'Fraction' }, sqrt: { label: '√', tex: '\\sqrt{#0}', plain: 'sqrt(', title: 'Square root' },
      par: { label: '( )', tex: '\\left(#0\\right)', plain: '(', title: 'Brackets (a point or a factor)' }, comma: { label: ',', tex: ',', plain: ', ' }, eq: { label: '=', tex: '=', plain: ' = ' },
      x: { label: '<i>x</i>', tex: 'x', plain: 'x' }, y: { label: '<i>y</i>', tex: 'y', plain: 'y' }, sq: { label: 'x<sup>2</sup>', tex: '^{2}', plain: '^2', title: 'Squared' }, pm: { label: '±', tex: '\\pm ', plain: '±' },
      none: { label: 'none', tex: '\\text{none}', plain: 'none', title: 'No x-intercepts' },
      le: { label: '≤', tex: '\\le ', plain: ' <= ' }, ge: { label: '≥', tex: '\\ge ', plain: ' >= ' }, lt: { label: '<', tex: '<', plain: ' < ' }, gt: { label: '>', tex: '>', plain: ' > ' },
      braces: { label: '{ }', tex: '\\left\\lbrace #0\\right\\rbrace', plain: '{', title: 'Braces' }, mid: { label: '|', tex: '\\mid ', plain: ' | ', title: 'such that' },
      inn: { label: '∈', tex: '\\in ', plain: ' in ', title: 'is an element of' }, R: { label: 'ℝ', tex: '\\mathbb{R}', plain: 'R', title: 'the real numbers' }
    };
    var base = function () { return [[d(7), d(8), d(9), KY.frac, KY.sqrt, KY.del], [d(4), d(5), d(6), KY.par, KY.comma, KY.clear], [d(1), d(2), d(3), KY.plus, KY.minus, KY.left, KY.right], [d(0), KY.dot, KY.x, KY.y, KY.eq, KY.sq, KY.pm]]; };
    W.KEYSETS.u5k34 = function () { return base().concat([[KY.none, KY.enter]]); };
    W.KEYSETS.u5k34s = function () { return base().concat([[KY.le, KY.ge, KY.lt, KY.gt, KY.braces, KY.mid, KY.inn, KY.R], [KY.enter]]); };
    W.KEYHELP = W.KEYHELP || {};
    W.KEYHELP.u5k34 = ['Points: press <b>( )</b> and type ' + HW.k('x') + ', a comma, ' + HW.k('y') + '. Equations: ' + HW.k('x=3') + '. Several ' + HW.k('x') + '-values: separate them with a comma or use <b>±</b>; press <b>none</b> if there are none.', 'Type e.g. <code>(3, -2)</code>, <code>x = 3</code>, <code>x = 1 ± sqrt(7)</code> or <code>none</code>.'];
    W.KEYHELP.u5k34s = ['Sets: ' + HW.k('\\{y\\mid y\\ge 2,\\ y\\in\\mathbb{R}\\}') + ' with <b>{ }</b>, <b>|</b>, <b>≥</b>, <b>∈</b> and <b>ℝ</b> (press <b>▶</b> to step out). Points: <b>( )</b>, then ' + HW.k('x') + ', ' + HW.k('y') + '. Axis: ' + HW.k('x=3') + '.', 'Type e.g. <code>{y | y >= 2, y in R}</code>, <code>(3, -2)</code> or <code>x = 3</code>.'];
  }

  var CODES = {
    'u5l3-p-sign': 'Sign of p wrong (x + 3 read as p = 3)', 'u5l3-q-sign': 'Sign of q wrong', 'u5l3-solve-y': 'Didn’t solve for y first (moved or divided wrongly)', 'u5l3-axis-y': 'Axis of symmetry written as y = q',
    'u5l3-maxmin': 'Maximum and minimum mixed up', 'u5l3-mm-p': 'Max/min value given as p (x-coordinate)', 'u5l3-mm-a': 'Max/min value given as a', 'u5l3-range-dir': 'Range inequality the wrong way',
    'u5l3-range-p': 'Range from p instead of q', 'u5l4-range-yint': 'Range from the y-intercept', 'u5l3-yint-sign': 'y-intercept: sign of a dropped', 'u5l3-yint-q': 'Gave q as the y-intercept',
    'u5l3-yint-nosq': 'y-intercept: didn’t square', 'u5l3-yint-asq': 'y-intercept: squared a as well', 'u5l3-count': 'Number of x-intercepts: vertex on/off the axis misread', 'u5l3-count-dir': 'Number of x-intercepts: direction of opening misread',
    'u5l3-count-q': 'Number of x-intercepts: vertex above/below misread', 'u5l3-div-a': 'Took the square root before dividing by a', 'u5l3-pm': 'Only one square root (forgot ±)', 'u5l3-said-none': 'Said no x-intercepts when there are',
    'u5l3-neg-sq': 'Took the square root of a negative', 'u5l3-move-q': 'Moved q with the wrong sign', 'u5l3-letter': 'Wrong letter in an expression', 'u5l3-no-var': 'Expression with no variable',
    'u5l3-q': 'Vertex form: wrong q', 'u5l3-a': 'Vertex form: wrong a', 'u5l3-feat-quad': 'Not a quadratic', 'u5l3-feat-p': 'Equation with the wrong axis/vertex', 'u5l3-feat-q': 'Equation with the wrong max/min value',
    'u5l3-feat-dir': 'Equation opens the wrong way', 'u5l3-mirror': 'Mirror point reflected in the y-axis, not the axis of symmetry', 'u5l3-neg-root': 'Kept the root that makes no sense in the context',
    'u5l3-half': 'Used the time of the maximum for the whole flight (or the reverse)', 'u5l3-swap': 'Height and distance/time swapped', 'u5l3-ctx-range0': 'Context range started at the starting height',
    'u5l3-match': 'Matched an equation to the wrong graph', 'u5l3-mid': 'Axis: added the x-values but didn’t halve', 'u5l3-c1': 'Values of q for the number of x-intercepts', 'u5l3-kai': 'Error analysis: missed an error'
  };
  HW.addCodes(CODES);
  HW.addPartial({ 'u5l3-p-sign': 's', 'u5l3-q-sign': 's', 'u5l3-solve-y': 'b', 'u5l3-axis-y': 'b', 'u5l3-maxmin': 'b', 'u5l3-mm-p': 'b', 'u5l3-mm-a': 'n', 'u5l3-range-dir': 'b', 'u5l3-range-p': 'b', 'u5l4-range-yint': 'b',
    'u5l3-yint-sign': 's', 'u5l3-yint-q': 'n', 'u5l3-yint-nosq': 'b', 'u5l3-yint-asq': 's', 'u5l3-div-a': 'b', 'u5l3-pm': 's', 'u5l3-said-none': 'n', 'u5l3-neg-sq': 'b', 'u5l3-move-q': 'b', 'u5l3-q': 's', 'u5l3-a': 's',
    'u5l3-feat-p': 'b', 'u5l3-feat-q': 'b', 'u5l3-feat-dir': 'b', 'u5l3-mirror': 'b', 'u5l3-neg-root': 's', 'u5l3-half': 'b', 'u5l3-swap': 's', 'u5l3-ctx-range0': 's', 'u5l3-mid': 's', 'u5l3-match': 'b' });

  /* =========================== Lesson 3 =========================== */
  var nz = function (r, a, b) { return pickWhere(function () { return r.int(a, b); }, function (x) { return x !== 0; }); };
  var sgn = function (r) { return r.chance(0.5) ? 1 : -1; };
  /* the lesson's examples and the booklet's own functions [a, p, q] */
  var AV = avoid([[3, 4, 1], [-1, -2, 6], [0.5, 0, -7], [-2, 5, 0], [0.4, -3, -2.5], [-2, -6, 3], [1 / 3, 2, 4], [-1, 1, 8], [2, -1, -9], [-0.75, 6, 4], [5, 0, -2], [-1, 3, 0], [2, 3, -5], [-0.5, -4, 10], [3, 1, 2],
    [4, 2, -1], [-3, -5, -6], [0.5, 7, 3], [-1, -1, 9], [6, 4, 0], [1, 3, -16], [2, -1, -18], [-3, 2, 15], [0.5, -4, -6], [4, 1, 3], [-1, -6, 0], [-0.5, 2, 8], [0.5, 1, -3], [-1, 2, 4], [2, 1, -3], [-1, -2, 4], [-0.08, 10, 8],
    [5, 7, -2], [-1, -8, 3], [-0.25, 0, 9], [1.5, -0.5, 0], [-6, 1, -4], [4, 3, -6], [-0.5, -5, 5], [3, -7, -1], [-1, 9, 4], [3, -2, -7], [-1, 6, 20], [0.25, 8, 1], [-2, -0.5, 3], [-2, 3, 8], [7, -1, 0.5], [-1, 4, 0],
    [0.3, 0, -12], [-5, -2, -1], [1, -5, -49], [3, 2, -75], [-2, -1, 32], [0.25, 6, -1], [5, 3, 20], [-1, 9, 0], [1, 1, -7], [-2, -3, 16], [3, 4, -10], [2, 3, -8], [-0.5, 3, 5], [-5, 1.2, 7.2], [-1, 6, -2], [-3, -2, 5],
    [3, -2, -5], [-4, 1, 7], [2 / 3, -9, -1], [2, 0, 5], [-0.25, 2, 0], [1, 5, -3], [-2, -1, -4], [3, -2, 0], [2, 1, -50], [-1, -7, 3], [0.5, 2, -9], [-3, 4, -12], [1, -2, -9], [0.5, 2, -2], [-1.25, 1, 5], [4, -1, -9], [2, 3, -14]]);
  var HV = ['In ' + t('y=a(x-p)^{2}+q') + ' the vertex is ' + t('(p,\\ q)') + ' and the axis of symmetry is ' + t('x=p') + '. Watch the sign: ' + t('(x+3)^{2}=(x-(-3))^{2}') + ', so ' + t('p=-3') + '.',
    t('a>0') + ': opens up, minimum value ' + t('q') + ', range ' + t('y\\ge q') + '. ' + t('a<0') + ': opens down, maximum value ' + t('q') + ', range ' + t('y\\le q') + '.'];
  var HY = ['The ' + t('y') + '-intercept is where ' + t('x=0') + ': substitute ' + t('0') + ' for ' + t('x') + ' and evaluate (square first, then multiply by ' + t('a') + ').'];
  var HX = ['Set ' + t('y=0') + ', isolate ' + t('(x-p)^{2}') + ', then take the square root of both sides (' + t('\\pm') + '). If the square equals a negative number, there are no ' + t('x') + '-intercepts.'];
  function eqT(a, p, q, frac) { return t('y=' + vfTex(a, p, q, 'x', frac)); }
  function mmWord(a) { return a > 0 ? 'minimum' : 'maximum'; }
  /* the vertex-features table: vertex, axis, max/min, value, (domain), range */
  function featTable(a, p, q, o) {
    o = o || {};
    var up = a > 0, sp = [{ label: 'Vertex', pt: [p, q], cands: [[[-p, q], LID + '-p-sign', 'Check the sign of ' + t('p') + ': ' + t('(' + binTex('x', p) + ')') + ' means ' + t('p=' + vT(p)) + '.']].concat(o.ptCands || []) },
      { label: 'Axis of symmetry', axis: p, q: q },
      { label: 'Max or min?', mm: up ? 'min' : 'max' },
      { label: (up ? 'Min' : 'Max') + ' / value', name: 'Value', ans: q, cands: [[p, LID + '-mm-p', 'That is the ' + t('x') + '-coordinate of the vertex. The ' + (up ? 'minimum' : 'maximum') + ' value is its ' + t('y') + '-coordinate, ' + t('q') + '.'], [a, LID + '-mm-a', t('a') + ' gives the shape and direction. The max or min value is ' + t('q') + '.']].concat(o.valCands || []) }];
    sp[3].label = 'Max or min value';
    if (o.domain) sp.push({ label: 'Domain', dom: true, opt: { range: rangeTex(q, up) } });
    sp.push({ label: 'Range', range: [q, up], opt: { p: p } });
    if (o.noAxis) sp.splice(1, 1);
    if (o.noRange) sp.pop();
    return sp;
  }
  function featSol(a, p, q, pre) {
    var up = a > 0;
    return (pre || '') + 'Vertex ' + t(ptTex(p, q)) + '; axis of symmetry ' + t('x=' + vT(p)) + '. ' + t('a=' + vT(a)) + (up ? '>0' : '<0').replace(/^/, '') + ': opens ' + (up ? 'up' : 'down') + ', so ' + mmWord(a) + ' value ' + t(vT(q)) + '.<br>Domain ' + t(DOM) + '; range ' + t(rangeTex(q, up)) + '.';
  }
  function featSolT(a, p, q, pre) { return (pre || '') + 'Vertex ' + t(ptTex(p, q)) + '; axis of symmetry ' + t('x=' + vT(p)) + '. ' + t('a' + (a > 0 ? '>' : '<') + '0') + ': opens ' + (a > 0 ? 'up' : 'down') + ', so ' + mmWord(a) + ' value ' + t(vT(q)) + '.<br>Domain ' + t(DOM) + '; range ' + t(rangeTex(q, a > 0)) + '.'; }
  /* the y-intercept with its classic slips */
  function yint(a, p, q) { return cl(a * p * p + q); }
  function yintCands(a, p, q) {
    var c = [[q, LID + '-yint-q', t('q') + ' is the ' + t('y') + '-coordinate of the vertex. The ' + t('y') + '-intercept is the value at ' + t('x=0') + '.'],
      [cl(a * (-p) + q), LID + '-yint-nosq', 'Square the bracket: ' + t('(0' + sT(-p) + ')^{2}=' + vT(cl(p * p))) + '.']];
    if (a < 0) c.push([cl(-a * p * p + q), LID + '-yint-sign', 'Square first, then multiply by ' + t('a=' + vT(a)) + ': ' + t(aTex(a) + '(' + vT(cl(p * p)) + ')=' + vT(cl(a * p * p))) + '.']);
    if (!same(Math.abs(a), 1)) c.push([cl(a * a * p * p + q), LID + '-yint-asq', 'Only the bracket is squared: ' + t(aTex(a) + '(0' + sT(-p) + ')^{2}=' + aTex(a) + '(' + vT(cl(p * p)) + ')') + '.']);
    return c;
  }
  function yintSol(a, p, q) { return t('y=' + aTex(a) + (same(p, 0) ? '(0)^{2}' : '(0' + sT(-p) + ')^{2}') + sT(q) + '=' + (same(Math.abs(a), 1) ? '' : vT(a) + '(' + vT(cl(p * p)) + ')') + (same(Math.abs(a), 1) ? vT(cl(a * p * p)) : '') + sT(q) + '=' + vT(yint(a, p, q))); }
  /* x-intercept spec for a(x − p)² + q (exact) */
  function xSpec(a, p, q) { var R = vfRoots(a, p, q), d = -q / a; return { vals: R, irr: R.length === 2 && radParts(d).f !== 1, pm: [p, d], cands: Z.vfCands(a, p, q) }; }
  function xSol(a, p, q, frac) {
    var d = cl(-q / a), lines = [t(vfTex(a, p, q, 'x', frac) + '=0')];
    if (!same(a, 1) && !same(q, 0)) lines.push(t(aTex(a, frac) + '(' + binTex('x', p) + ')^{2}=' + vT(-q)));
    lines.push(t('(' + binTex('x', p) + ')^{2}=' + rT(d)));
    if (d < 0) { lines.push('A square can’t be negative: <b>no ' + t('x') + '-intercepts</b>.'); return lines.join('<br>'); }
    if (same(d, 0)) { lines.push(t(binTex('x', p) + '=0') + ', so ' + t('x=' + vT(p)) + ' only: one ' + t('x') + '-intercept (the vertex is on the axis).'); return lines.join('<br>'); }
    var rp = radParts(d);
    if (rp.f === 1) { var s = rp.k / rp.w; lines.push(t(binTex('x', p) + '=\\pm ' + rT(s))); lines.push(t('x=' + rT(p - s)) + ' or ' + t('x=' + rT(p + s))); }
    else { lines.push(t('x=' + (same(p, 0) ? '' : rT(p)) + '\\pm\\sqrt{' + rT(d) + '}' + (rp.w !== 1 || rp.k !== 1 ? '=' + (same(p, 0) ? '' : rT(p)) + '\\pm ' + radTex(rp) : ''))); }
    return lines.join('<br>');
  }
  function apxRoots(R, cands) { return [{ label: t('x\\approx'), name: 'Smaller', dp: 2, ans: R[0], cands: cands }, { label: 'or ' + t('x\\approx'), name: 'Larger', dp: 2, ans: R[1], cands: cands }]; }
  /* the four "choose the graph" options for a(x − p)² + q */
  function graphOpts(a, p, q, extraPts) {
    var f = Z.parabola, w = Z.win([[p, q], [-p, q], [p, -q]].concat(extraPts || []), 4, 3), o = [{ f: f(a, p, q), right: true }];
    if (!same(p, 0)) o.push({ f: f(a, -p, q), why: 'Check the vertex: ' + t('(' + binTex('x', p) + ')^{2}') + ' gives ' + t('p=' + vT(p)) + '.', code: LID + '-p-sign' });
    o.push({ f: f(-a, p, q), why: 'Check the direction: ' + t('a=' + vT(a)) + (a > 0 ? ' is positive, so it opens up.' : ' is negative, so it opens down.'), code: LID + '-g-dir' });
    if (!same(q, 0)) o.push({ f: f(a, p, -q), why: 'Check the vertex: its ' + t('y') + '-coordinate is ' + t('q=' + vT(q)) + '.', code: LID + '-q-sign' });
    if (o.length < 4) o.push({ f: f(a * 3, p, q), why: 'Check the shape: plot the ' + t('y') + '-intercept to see how wide it is.', code: LID + '-g-width' });
    return { opts: o, win: w };
  }

  var QUESTIONS = [
    { num: '1', stem: 'Complete the table for each function. (The domain of each function is ' + t(DOM) + '.)', parts: [
      { id: '1a', level: 'BEG', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(2, 6), p: nz(r, -9, 9), q: r.int(-9, -1) }; }, function (z) { return AV(z.a, z.p, z.q); });
        return Z.fields('For ' + eqT(o.a, o.p, o.q) + ':', featTable(o.a, o.p, o.q), { sol: featSolT(o.a, o.p, o.q), hints: HV, text: 'vertex form: vertex, axis, min, range' });
      } },
      { id: '1b', level: 'BEG', make: function (r) {
        var o = pickWhere(function () { return { a: -1, p: r.int(-9, -1), q: r.int(1, 9) }; }, function (z) { return AV(z.a, z.p, z.q); });
        return Z.fields('For ' + eqT(o.a, o.p, o.q) + ':', featTable(o.a, o.p, o.q), { sol: featSolT(o.a, o.p, o.q), hints: HV, text: 'vertex form (a = −1): features' });
      } },
      { id: '1c', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { a: -1 / r.pick([2, 3, 4, 5]), p: 0, q: r.int(1, 12) }; }, function (z) { return AV(z.a, z.p, z.q); });
        return Z.fields('For ' + eqT(o.a, 0, o.q, true) + ':', featTable(o.a, 0, o.q), { sol: featSolT(o.a, 0, o.q, 'There is no bracket, so ' + t('p=0') + ': ' + t('y=' + aTex(o.a, true) + '(x-0)^{2}' + sT(o.q)) + '.<br>'), hints: HV, text: 'vertex form (p = 0): features' });
      } },
      { id: '1d', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { a: r.pick([0.5, 1.5, 2.5, 0.2, 1.2, 3.5]), p: r.pick([-2.5, -1.5, -0.5, 0.5, 1.5, 2.5]), q: 0 }; }, function (z) { return AV(z.a, z.p, z.q); });
        return Z.fields('For ' + eqT(o.a, o.p, 0) + ':', featTable(o.a, o.p, 0), { sol: featSolT(o.a, o.p, 0, 'There is no constant term, so ' + t('q=0') + '.<br>'), hints: HV, text: 'vertex form (q = 0, decimals): features' });
      } },
      { id: '1e', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { a: -r.int(2, 7), p: nz(r, -9, 9), q: r.int(-9, -1) }; }, function (z) { return AV(z.a, z.p, z.q); });
        return Z.fields('For ' + eqT(o.a, o.p, o.q) + ':', featTable(o.a, o.p, o.q), { sol: featSolT(o.a, o.p, o.q, 'The maximum value can be negative: the vertex is the highest point.<br>'), hints: HV, text: 'vertex form: negative maximum' });
      } }] },

    { num: '2', stem: 'Write each equation in the form ' + t('y=a(x-p)^{2}+q') + '. Then state the vertex and the maximum or minimum value.', parts: [
      { id: '2a', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(2, 6), p: nz(r, -9, 9), k: r.int(2, 9) }; }, function (z) { return AV(z.a, z.p, -z.k); }), a = o.a, p = o.p, q = -o.k;
        var fn = Z.parabola(a, p, q);
        return Z.fields('Write ' + t('y+' + o.k + '=' + vfTex(a, p, 0)) + ' in vertex form. Then state the vertex and the minimum or maximum value.', [
          { label: 'Equation', before: t('y='), expr: { fn: fn, key: vfTex(a, p, q), vertex: { a: a, p: p, q: q }, cands: [[Z.parabola(a, p, o.k), LID + '-solve-y', 'Get ' + t('y') + ' by itself: <b>subtract</b> ' + t(o.k) + ' from both sides.']] } },
          { label: 'Vertex', pt: [p, q], cands: [[[p, o.k], LID + '-solve-y', 'Solve for ' + t('y') + ' first: ' + t('y=' + vfTex(a, p, 0) + '-' + o.k) + '.'], [[-p, q], LID + '-p-sign', 'Check the sign of ' + t('p') + '.']] },
          { label: 'Max or min?', mm: 'min' }, { label: 'Value', ans: q, cands: [[o.k, LID + '-solve-y', 'Solve for ' + t('y') + ' first: the constant is ' + t('-' + o.k) + '.'], [p, LID + '-mm-p', 'That is the ' + t('x') + '-coordinate of the vertex.']] }],
          { sol: 'Subtract ' + t(o.k) + ': ' + eqT(a, p, q) + '.<br>Vertex ' + t(ptTex(p, q)) + '; ' + t('a>0') + ': minimum value ' + t(q) + '.', hints: ['Solve for ' + t('y') + ' first: undo the ' + t('+' + o.k) + ' on the left side.', HV[0]], text: 'y + k = a(x − p)²: rewrite and features' });
      } },
      { id: '2b', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { var c = r.pick([2, 3, 4]); return { c: c, p: nz(r, -8, 8), m: r.int(1, 6) }; }, function (z) { return AV(-1 / z.c, z.p, z.m); }), c = o.c, a = -1 / c, p = o.p, q = o.m, D = c * o.m;
        return Z.fields('Write ' + t(c + 'y=' + vfTex(-1, p, D)) + ' in vertex form. Then state the vertex and the maximum or minimum value.', [
          { label: 'Equation', before: t('y='), expr: { fn: Z.parabola(a, p, q), key: vfTex(a, p, q, 'x', true), vertex: { a: a, p: p, q: q }, cands: [[Z.parabola(a, p, D), LID + '-solve-y', 'Divide <b>every</b> term by ' + t(c) + ', the constant too.'], [Z.parabola(-1, p, q), LID + '-solve-y', 'Divide <b>every</b> term by ' + t(c) + ': the squared term becomes ' + t('-\\frac{1}{' + c + '}(' + binTex('x', p) + ')^{2}') + '.'], [Z.parabola(-1, p, D), LID + '-solve-y', 'Get ' + t('y') + ' by itself: divide every term by ' + t(c) + '.']] } },
          { label: 'Vertex', pt: [p, q], cands: [[[p, D], LID + '-solve-y', 'Divide the constant by ' + t(c) + ' too.'], [[-p, q], LID + '-p-sign', 'Check the sign of ' + t('p') + '.']] },
          { label: 'Max or min?', mm: 'max' }, { label: 'Value', ans: q, cands: [[D, LID + '-solve-y', 'Divide by ' + t(c) + ' first.'], [p, LID + '-mm-p', 'That is the ' + t('x') + '-coordinate of the vertex.']] }],
          { sol: 'Divide every term by ' + t(c) + ': ' + eqT(a, p, q, true) + '.<br>Vertex ' + t(ptTex(p, q)) + '; ' + t('a<0') + ': maximum value ' + t(q) + '.', hints: ['Get ' + t('y') + ' by itself: divide <b>every</b> term on the right by ' + t(c) + '.', HV[0]], text: 'ky = …: divide, then features' });
      } },
      { id: '2c', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(2, 6), p: nz(r, -9, 9), q: r.int(-9, -1) }; }, function (z) { return AV(z.a, z.p, z.q); }), a = o.a, p = o.p, q = o.q;
        return Z.fields('Write ' + t('y=' + q + '+' + vfTex(a, p, 0)) + ' in vertex form. Then state the vertex and the maximum or minimum value.', [
          { label: 'Equation', before: t('y='), expr: { fn: Z.parabola(a, p, q), key: vfTex(a, p, q), vertex: { a: a, p: p, q: q } } },
          { label: 'Vertex', pt: [p, q], cands: [[[-p, q], LID + '-p-sign', 'Check the sign of ' + t('p') + ': ' + t('(' + binTex('x', p) + ')') + ' means ' + t('p=' + p) + '.']] },
          { label: 'Max or min?', mm: 'min' }, { label: 'Value', ans: q, cands: [[p, LID + '-mm-p', 'That is the ' + t('x') + '-coordinate of the vertex.'], [a, LID + '-mm-a', 'The max or min value is ' + t('q') + ', not ' + t('a') + '.']] }],
          { sol: 'Reorder: ' + eqT(a, p, q) + '.<br>Vertex ' + t(ptTex(p, q)) + '; ' + t('a=' + a + '>0') + ': minimum value ' + t(q) + '.', hints: ['Write the squared term first, then the constant.', HV[0]], text: 'y = q + a(x − p)²: reorder and features' });
      } },
      { id: '2d', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { p: nz(r, -9, 9), k: r.int(1, 9) }; }, function (z) { return AV(-1, z.p, z.k); }), p = o.p, q = o.k;
        return Z.fields('Write ' + t('y-' + q + '=' + vfTex(-1, p, 0)) + ' in vertex form. Then state the vertex and the maximum or minimum value.', [
          { label: 'Equation', before: t('y='), expr: { fn: Z.parabola(-1, p, q), key: vfTex(-1, p, q), vertex: { a: -1, p: p, q: q }, cands: [[Z.parabola(-1, p, -q), LID + '-solve-y', '<b>Add</b> ' + t(q) + ' to both sides.']] } },
          { label: 'Vertex', pt: [p, q], cands: [[[p, -q], LID + '-solve-y', 'Solve for ' + t('y') + ': add ' + t(q) + ' to both sides.'], [[-p, q], LID + '-p-sign', 'Check the sign of ' + t('p') + '.']] },
          { label: 'Max or min?', mm: 'max' }, { label: 'Value', ans: q, cands: [[-q, LID + '-solve-y', 'Add ' + t(q) + ' to both sides first.'], [p, LID + '-mm-p', 'That is the ' + t('x') + '-coordinate of the vertex.']] }],
          { sol: 'Add ' + t(q) + ': ' + eqT(-1, p, q) + '.<br>Vertex ' + t(ptTex(p, q)) + '; ' + t('a=-1') + ': maximum value ' + t(q) + '.', hints: ['Solve for ' + t('y') + ': undo the ' + t('-' + q) + ' on the left.', HV[0]], text: 'y − k = −(x − p)²: rewrite and features' });
      } }] },

    { num: '3', stem: 'Determine the ' + t('y') + '-intercept of each graph.', parts: [
      { id: '3a', level: 'BEG', make: function (r) { var o = pickWhere(function () { return { a: r.int(2, 4), p: -r.int(1, 5), q: nz(r, -9, 9) }; }, function (z) { return AV(z.a, z.p, z.q); }); return Z.num(eqT(o.a, o.p, o.q), yint(o.a, o.p, o.q), { before: t('y') + '-intercept:', cands: yintCands(o.a, o.p, o.q), sol: yintSol(o.a, o.p, o.q), hints: HY, text: 'y-intercept from vertex form' }); } },
      { id: '3b', level: 'BEG', make: function (r) { var o = pickWhere(function () { return { a: -1, p: r.int(2, 8), q: r.int(2, 30) }; }, function (z) { return AV(z.a, z.p, z.q) && z.q !== z.p * z.p; }); return Z.num(eqT(o.a, o.p, o.q), yint(o.a, o.p, o.q), { before: t('y') + '-intercept:', cands: yintCands(o.a, o.p, o.q), sol: yintSol(o.a, o.p, o.q), hints: HY.concat(['With ' + t('a=-1') + ': ' + t('-(-6)^{2}=-36') + ' (square first).']), text: 'y-intercept (a = −1)' }); } },
      { id: '3c', level: 'EMG', make: function (r) { var o = pickWhere(function () { var k = r.pick([2, 3, 4]); return { a: 1 / k, k: k, p: k * nz(r, -3, 3), q: nz(r, -9, 9) }; }, function (z) { return AV(z.a, z.p, z.q); }); return Z.num(eqT(o.a, o.p, o.q, true), yint(o.a, o.p, o.q), { before: t('y') + '-intercept:', cands: yintCands(o.a, o.p, o.q), sol: t('y=\\frac{1}{' + o.k + '}(' + vT(cl(o.p * o.p)) + ')' + sT(o.q) + '=' + vT(yint(o.a, o.p, o.q))), hints: HY, text: 'y-intercept (a a fraction)' }); } },
      { id: '3d', level: 'EMG', make: function (r) { var o = pickWhere(function () { return { a: -r.int(2, 4), p: r.pick([-1.5, -0.5, 0.5, 1.5]), q: r.int(1, 9) }; }, function (z) { return AV(z.a, z.p, z.q); }); return Z.num(eqT(o.a, o.p, o.q), yint(o.a, o.p, o.q), { before: t('y') + '-intercept:', cands: yintCands(o.a, o.p, o.q), sol: t('y=' + o.a + '(' + vT(cl(o.p * o.p)) + ')' + sT(o.q) + '=' + vT(yint(o.a, o.p, o.q))), hints: HY, text: 'y-intercept (decimal p)' }); } }] },

    { num: '4', stem: 'Without graphing, state the number of ' + t('x') + '-intercepts of each graph. Give a reason.', parts: [
      { id: '4a', level: 'BEG', make: function (r) { var o = pickWhere(function () { return { a: -r.int(2, 5), p: nz(r, -6, 6), q: r.int(1, 9) }; }, function (z) { return AV(z.a, z.p, z.q); }); return Z.countMC(r, eqT(o.a, o.p, o.q), o.a, o.p, o.q); } },
      { id: '4b', level: 'BEG', make: function (r) { var o = pickWhere(function () { return { a: r.int(2, 8), p: nz(r, -6, 6), q: r.pick([0.5, 1.5, 2, 3, 0.25]) }; }, function (z) { return AV(z.a, z.p, z.q); }); return Z.countMC(r, eqT(o.a, o.p, o.q), o.a, o.p, o.q); } },
      { id: '4c', level: 'EMG', make: function (r) { var o = pickWhere(function () { return { a: r.pick([-1, -2, 3, 1]), p: nz(r, -6, 6), q: 0 }; }, function (z) { return AV(z.a, z.p, z.q); }); return Z.countMC(r, eqT(o.a, o.p, 0), o.a, o.p, 0); } },
      { id: '4d', level: 'BEG', make: function (r) { var o = pickWhere(function () { return { a: r.pick([0.2, 0.3, 0.4, 0.6, 1.5]), p: 0, q: -r.int(3, 15) }; }, function (z) { return AV(z.a, z.p, z.q); }); return Z.countMC(r, eqT(o.a, 0, o.q), o.a, 0, o.q); } },
      { id: '4e', level: 'EMG', make: function (r) { var o = pickWhere(function () { return { a: -r.int(2, 6), p: nz(r, -6, 6), q: -r.int(1, 9) }; }, function (z) { return AV(z.a, z.p, z.q); }); return Z.countMC(r, eqT(o.a, o.p, o.q), o.a, o.p, o.q); } }] },

    { num: '5', stem: 'Determine the ' + t('x') + '-intercepts algebraically.', parts: [
      { id: '5a', level: 'BEG', make: function (r) { var o = pickWhere(function () { return { p: nz(r, -8, 8), k: r.int(2, 9) }; }, function (z) { return AV(1, z.p, -z.k * z.k) && z.k !== Math.abs(z.p); }), q = -o.k * o.k; return Z.roots(eqT(1, o.p, q), xSpec(1, o.p, q), { sol: xSol(1, o.p, q), hints: HX, text: 'x-intercepts: (x − p)² − k²' }); } },
      { id: '5b', level: 'EMG', make: function (r) { var o = pickWhere(function () { return { a: r.int(2, 5), p: nz(r, -6, 6), k: r.int(2, 6) }; }, function (z) { return AV(z.a, z.p, -z.a * z.k * z.k) && z.k !== Math.abs(z.p); }), q = -o.a * o.k * o.k; return Z.roots(eqT(o.a, o.p, q), xSpec(o.a, o.p, q), { sol: xSol(o.a, o.p, q), hints: HX, text: 'x-intercepts: divide by a first' }); } },
      { id: '5c', level: 'EMG', make: function (r) { var o = pickWhere(function () { return { a: -r.int(2, 4), p: nz(r, -6, 6), k: r.int(2, 6) }; }, function (z) { return AV(z.a, z.p, -z.a * z.k * z.k) && z.k !== Math.abs(z.p); }), q = -o.a * o.k * o.k; return Z.roots(eqT(o.a, o.p, q), xSpec(o.a, o.p, q), { sol: xSol(o.a, o.p, q), hints: HX, text: 'x-intercepts: a < 0' }); } },
      { id: '5d', level: 'PRG', make: function (r) { var o = pickWhere(function () { var n = r.pick([2, 3, 4]); return { n: n, p: nz(r, -8, 8), k: n * r.int(1, 3) }; }, function (z) { return AV(1 / z.n, z.p, -z.k * z.k / z.n) && z.k !== Math.abs(z.p); }), a = 1 / o.n, q = -o.k * o.k / o.n; return Z.roots(eqT(a, o.p, q, true), xSpec(a, o.p, q), { sol: xSol(a, o.p, q, true), hints: HX.concat(['Multiply both sides by ' + t(o.n) + ' to clear the fraction.']), text: 'x-intercepts: a a fraction' }); } },
      { id: '5e', level: 'EMG', make: function (r) { var o = pickWhere(function () { return { a: r.int(2, 6), p: nz(r, -6, 6), q: r.int(2, 30) }; }, function (z) { return AV(z.a, z.p, z.q); }); return Z.roots(eqT(o.a, o.p, o.q), xSpec(o.a, o.p, o.q), { sol: xSol(o.a, o.p, o.q) + ' (It opens up from the vertex ' + t(ptTex(o.p, o.q)) + ' above the axis.)', hints: HX, text: 'x-intercepts: none' }); } },
      { id: '5f', level: 'EMG', make: function (r) { var o = pickWhere(function () { return { a: r.pick([-1, -2, -3, 2]), p: nz(r, -9, 9) }; }, function (z) { return AV(z.a, z.p, 0); }); return Z.roots(eqT(o.a, o.p, 0), xSpec(o.a, o.p, 0), { sol: xSol(o.a, o.p, 0), hints: HX, text: 'x-intercepts: one (q = 0)' }); } }] },

    { num: '6', stem: 'Determine the ' + t('x') + '-intercepts as exact values in simplest form, then to the nearest hundredth.', parts: [
      { id: '6a', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { p: nz(r, -6, 6), m: r.pick([2, 3, 5, 6, 7, 10, 11, 13, 14, 15]) }; }, function (z) { return AV(1, z.p, -z.m); }), q = -o.m, S = xSpec(1, o.p, q), R = S.vals;
        return Z.fields(eqT(1, o.p, q), [{ label: 'Exact', roots: S }].concat(apxRoots(R, [[-o.p - Math.sqrt(o.m), LID + '-p-sign', 'Check the sign of ' + t('p') + '.'], [-o.p + Math.sqrt(o.m), LID + '-p-sign', 'Check the sign of ' + t('p') + '.']])), { swap: [[1, 2]], sol: xSol(1, o.p, q) + '<br>' + t('x\\approx ' + R[0].toFixed(2)) + ' or ' + t('x\\approx ' + R[1].toFixed(2)), hints: HX.concat(['Leave ' + t('\\sqrt{' + o.m + '}') + ' as a radical for the exact answer; use the calculator to round.']), text: 'x-intercepts: p ± √m, exact and rounded' });
      } },
      { id: '6b', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { var s = r.pick([2, 3]), f = r.pick([2, 3, 5, 6, 7]); return { k: r.pick([2, 3]), p: nz(r, -6, 6), M: s * s * f }; }, function (z) { return z.M <= 50 && AV(-z.k, z.p, z.k * z.M); }), a = -o.k, q = o.k * o.M, S = xSpec(a, o.p, q), R = S.vals;
        return Z.fields(eqT(a, o.p, q), [{ label: 'Exact', roots: S }].concat(apxRoots(R, [])), { swap: [[1, 2]], sol: xSol(a, o.p, q) + '<br>' + t('x\\approx ' + R[0].toFixed(2)) + ' or ' + t('x\\approx ' + R[1].toFixed(2)), hints: HX.concat(['Simplify the radical: take the largest perfect square out of ' + t('\\sqrt{' + o.M + '}') + '.']), text: 'x-intercepts: simplify the radical' });
      } },
      { id: '6c', level: 'MAS', make: function (r) {
        var o = pickWhere(function () { return { a: r.pick([2, 3, 5]), p: nz(r, -6, 6), m: r.int(5, 22) }; }, function (z) { var N = z.m * z.a; return z.m % z.a !== 0 && ex.nthFactor(N, 2) * ex.nthFactor(N, 2) !== N && AV(z.a, z.p, -z.m); }), q = -o.m, S = xSpec(o.a, o.p, q), R = S.vals;
        return Z.fields(eqT(o.a, o.p, q), [{ label: 'Exact', roots: S }].concat(apxRoots(R, [])), { swap: [[1, 2]], sol: xSol(o.a, o.p, q) + '<br>' + t('x\\approx ' + R[0].toFixed(2)) + ' or ' + t('x\\approx ' + R[1].toFixed(2)), hints: HX.concat(['No fraction under the root: ' + t('\\sqrt{\\frac{a}{b}}=\\frac{\\sqrt{a}}{\\sqrt{b}}=\\frac{\\sqrt{ab}}{b}') + '.']), text: 'x-intercepts: fraction under the root' });
      } }] },

    { num: '7', shared: function (r) {
        return pickWhere(function () { var a = r.pick([2, 3, 0.5, -2, -0.5, -1]), k = r.int(1, 4); return { a: a, k: k, p: nz(r, -4, 4), q: -a * k * k, gs: r.int(0, 1000) }; },
          function (z) { var c = yint(z.a, z.p, z.q); return AV(z.a, z.p, z.q) && Number.isInteger(z.q) && Math.abs(z.q) <= 18 && Math.abs(c) <= 18 && Number.isInteger(c * 2) && z.k !== Math.abs(z.p); });
      },
      stem: function (o) { return 'Analyze ' + eqT(o.a, o.p, o.q) + ', then sketch its graph.'; },
      parts: [
        { id: '7a', level: 'BEG', make: function (r, o) { return Z.fields('State the vertex, the axis of symmetry and the maximum or minimum value.', featTable(o.a, o.p, o.q, { noRange: true }), { sol: featSolT(o.a, o.p, o.q).split('<br>')[0], hints: HV, text: 'analyze: vertex, axis, max/min' }); } },
        { id: '7b', level: 'EMG', make: function (r, o) { return Z.fields('State the domain and range.', [{ label: 'Domain', dom: true, opt: { range: rangeTex(o.q, o.a > 0) } }, { label: 'Range', range: [o.q, o.a > 0], opt: { p: o.p } }], { sol: 'Every ' + t('x') + ' works: domain ' + t(DOM) + '. It opens ' + (o.a > 0 ? 'up from the minimum' : 'down from the maximum') + ' ' + t(vT(o.q)) + ': range ' + t(rangeTex(o.q, o.a > 0)) + '.', hints: [HV[1]], text: 'analyze: domain and range' }); } },
        { id: '7c', level: 'EMG', make: function (r, o) {
          var c = yint(o.a, o.p, o.q);
          return Z.fields('Determine the ' + t('y') + '-intercept and the point that is its mirror image in the axis of symmetry.', [{ label: t('y') + '-intercept', ans: c, cands: yintCands(o.a, o.p, o.q) },
            { label: 'Mirror point', pt: [2 * o.p, c], cands: [[[-2 * o.p, c], LID + '-mirror', 'Reflect in the axis of symmetry ' + t('x=' + o.p) + ', not in the ' + t('y') + '-axis: ' + t('(0,\\ ' + vT(c) + ')') + ' is ' + Math.abs(o.p) + ' units from the axis.'], [[o.p, c], LID + '-mirror', 'The mirror point is as far on the other side of the axis as ' + t('(0,\\ ' + vT(c) + ')') + ' is: ' + Math.abs(o.p) + ' more units.'], [[0, -c], LID + '-mirror', 'The mirror point has the same ' + t('y') + '-value; it is on the other side of the axis ' + t('x=' + o.p) + '.']] }],
            { sol: yintSol(o.a, o.p, o.q) + '. The axis is ' + t('x=' + o.p) + ', so the mirror point of ' + t('(0,\\ ' + vT(c) + ')') + ' is ' + t(ptTex(2 * o.p, c)) + '.', hints: HY.concat(['The mirror of ' + t('(0,\\ c)') + ' in the axis ' + t('x=p') + ' is ' + t('(2p,\\ c)') + '.']), text: 'analyze: y-intercept and mirror point' });
        } },
        { id: '7d', level: 'PRG', make: function (r, o) { return Z.roots('Determine the ' + t('x') + '-intercepts algebraically.', xSpec(o.a, o.p, o.q), { sol: xSol(o.a, o.p, o.q), hints: HX, text: 'analyze: x-intercepts' }); } },
        { id: '7e', level: 'EMG', make: function (r, o) {
          var c = yint(o.a, o.p, o.q), G = graphOpts(o.a, o.p, o.q, [[0, c], [o.p - o.k, 0], [o.p + o.k, 0]]);
          G.opts[0].points = [{ x: o.p, y: o.q }, { x: 0, y: c }, { x: 2 * o.p, y: c }, { x: o.p - o.k, y: 0 }, { x: o.p + o.k, y: 0 }];
          return Z.graphMC(r, 'Which is the graph of ' + eqT(o.a, o.p, o.q) + '?', G.opts, G.win, 'Plot the vertex ' + t(ptTex(o.p, o.q)) + ', the ' + t('x') + '-intercepts ' + t(vT(o.p - o.k)) + ' and ' + t(vT(o.p + o.k)) + ', the ' + t('y') + '-intercept ' + t(vT(c)) + ' and its mirror point ' + t(ptTex(2 * o.p, c)) + ', then join them with a smooth curve.', ['Check the vertex first, then the direction of opening.'], 'analyze: choose the graph');
        } }] },

    { num: '8', shared: function (r) {
        return pickWhere(function () { var a = r.pick([-1, 1]), k = r.int(2, 4); return { a: a, k: k, p: nz(r, -3, 3), q: -a * k * k }; }, function (z) { return AV(z.a, z.p, z.q) && z.k !== Math.abs(z.p); });
      },
      stem: function (o) {
        var c = yint(o.a, o.p, o.q), W0 = Z.win([[o.p - o.k, 0], [o.p + o.k, 0], [o.p, o.q], [0, c]], 2, 2);
        return 'The graph of a quadratic function is shown. The marked points have integer coordinates.' + Z.fig({ x: W0.x, y: W0.y, l: 2, fns: [{ f: Z.parabola(o.a, o.p, o.q), from: o.p - o.k - 0.7, to: o.p + o.k + 0.7 }], points: [{ x: o.p, y: o.q }, { x: 0, y: c }, { x: o.p - o.k, y: 0 }, { x: o.p + o.k, y: 0 }], max: 300, aria: 'graph of a parabola' });
      },
      parts: [
        { id: '8a', level: 'BEG', make: function (r, o) { return Z.fields('State the vertex and the equation of the axis of symmetry.', [{ label: 'Vertex', pt: [o.p, o.q] }, { label: 'Axis of symmetry', axis: o.p, q: o.q }], { sol: 'The vertex is the ' + (o.a < 0 ? 'highest' : 'lowest') + ' point, ' + t(ptTex(o.p, o.q)) + '; the axis of symmetry is the vertical line through it, ' + t('x=' + o.p) + '.', hints: ['The vertex is the turning point. The axis is the vertical line through it.'], text: 'graph: vertex and axis' }); } },
        { id: '8b', level: 'EMG', make: function (r, o) { return Z.fields('State the maximum or minimum value, the domain and the range.', [{ label: 'Max or min?', mm: o.a > 0 ? 'min' : 'max' }, { label: 'Value', ans: o.q, cands: [[o.p, LID + '-mm-p', 'That is the ' + t('x') + '-coordinate of the vertex.']] }, { label: 'Domain', dom: true, opt: { range: rangeTex(o.q, o.a > 0) } }, { label: 'Range', range: [o.q, o.a > 0], opt: { p: o.p } }], { sol: (o.a > 0 ? 'Minimum' : 'Maximum') + ' value ' + t(o.q) + '.<br>Domain ' + t(DOM) + '; range ' + t(rangeTex(o.q, o.a > 0)) + '.', hints: [HV[1]], text: 'graph: max/min, domain, range' }); } },
        { id: '8c', level: 'BEG', make: function (r, o) { var c = yint(o.a, o.p, o.q); return Z.fields('State the ' + t('x') + '- and ' + t('y') + '-intercepts.', [{ label: t('x') + '-intercepts', roots: { vals: [o.p - o.k, o.p + o.k] } }, { label: t('y') + '-intercept', ans: c, cands: [[o.q, LID + '-yint-q', 'That is the vertex. The ' + t('y') + '-intercept is where the graph crosses the ' + t('y') + '-axis.']] }], { sol: t('x') + '-intercepts ' + t(o.p - o.k) + ' and ' + t(o.p + o.k) + '; ' + t('y') + '-intercept ' + t(c) + '.', hints: ['The ' + t('x') + '-intercepts are where the graph crosses the ' + t('x') + '-axis; the ' + t('y') + '-intercept is where it crosses the ' + t('y') + '-axis.'], text: 'graph: intercepts' }); } },
        { id: '8d', level: 'EMG', make: function (r, o) { return Z.roots('The equation is ' + eqT(o.a, o.p, o.q) + '. Determine (verify) the ' + t('x') + '-intercepts algebraically.', xSpec(o.a, o.p, o.q), { sol: xSol(o.a, o.p, o.q) + ' ✓ (the same as the graph)', hints: HX, text: 'graph: verify x-intercepts' }); } }] },

    { num: '9', stem: 'Use symmetry.', parts: [
      { id: '9a', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { p: nz(r, -6, 6), d: r.int(2, 8), s: sgn(r) }; }, function (z) { return !(z.p === 4 && z.d === 6) && !(z.p === -3 && z.d === 5); }), x1 = o.p + o.s * o.d, x2 = o.p - o.s * o.d;
        return Z.num('The graph of ' + t('y=a(' + binTex('x', o.p) + ')^{2}+q') + ' has an ' + t('x') + '-intercept at ' + t(x1) + '. Determine the other ' + t('x') + '-intercept.', x2, { before: t('x='), cands: [[-x1, LID + '-mirror', 'Reflect in the axis of symmetry ' + t('x=' + o.p) + ', not in the ' + t('y') + '-axis.'], [-o.p, LID + '-p-sign', 'Check the axis: ' + t('(' + binTex('x', o.p) + ')') + ' gives ' + t('x=' + o.p) + '.'], [2 * (-o.p) - x1, LID + '-p-sign', 'Check the axis: ' + t('(' + binTex('x', o.p) + ')') + ' gives ' + t('x=' + o.p) + '.'], [o.p, LID + '-mirror', 'That is the axis. The other intercept is as far on the other side of it.']], sol: 'The axis is ' + t('x=' + o.p) + '. ' + t(x1) + ' is ' + o.d + ' units to the ' + (o.s > 0 ? 'right' : 'left') + ' of it, so the other intercept is ' + o.d + ' units to the ' + (o.s > 0 ? 'left' : 'right') + ': ' + t('x=' + x2) + '.', hints: ['The two ' + t('x') + '-intercepts are the same distance from the axis ' + t('x=p') + '.'], text: 'symmetry: other x-intercept' });
      } },
      { id: '9b', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { var p = nz(r, -5, 5), d = r.int(1, 4) * sgn(r), a = r.pick([-2, -1, 2, 3]), q = nz(r, -8, 8); return { p: p, q: q, d: d, x1: p + d, y1: q + a * d * d }; }, function (z) { return !(z.p === -2 && z.q === 5) && Math.abs(z.y1) <= 30 && z.x1 !== 0; }), x2 = o.p - o.d;
        return Z.fields('A parabola has vertex ' + t(ptTex(o.p, o.q)) + ' and passes through ' + t(ptTex(o.x1, o.y1)) + '. Name another point on it.', [{ label: 'Point', pt: [x2, o.y1], cands: [[[-o.x1, o.y1], LID + '-mirror', 'Reflect in the axis of symmetry ' + t('x=' + o.p) + ', not in the ' + t('y') + '-axis.'], [[o.x1, -o.y1], LID + '-mirror', 'The mirror point has the same ' + t('y') + '-value.']] }],
          { sol: t(ptTex(o.x1, o.y1)) + ' is ' + Math.abs(o.d) + ' units ' + (o.d > 0 ? 'right' : 'left') + ' of the axis ' + t('x=' + o.p) + '; its mirror point is ' + t(ptTex(x2, o.y1)) + '.', hints: ['Points with the same ' + t('y') + '-value are the same distance from the axis, on opposite sides.'], text: 'symmetry: mirror point' });
      } },
      { id: '9c', level: 'BEG', make: function (r) { var x1 = -r.pick([1.5, 2.5, 4.5, 5.5, 6.5, 0.5, 7.5]) * sgn(r); return Z.num('The graph of ' + t('y=ax^{2}+q') + ' has an ' + t('x') + '-intercept at ' + t(vT(x1)) + '. Determine the other ' + t('x') + '-intercept.', -x1, { before: t('x='), cands: [[x1, 'value', 'The other intercept is on the other side of the axis.']], sol: 'Here ' + t('p=0') + ', so the axis is the ' + t('y') + '-axis: the other ' + t('x') + '-intercept is ' + t(vT(-x1)) + '.', hints: ['There is no bracket: ' + t('p=0') + '. What is the axis of symmetry?'], text: 'symmetry: p = 0' }); } }] },

    { num: '10', stem: 'Write an equation in the form ' + t('y=a(x-p)^{2}+q') + ' for a parabola with the given features. (Many answers are possible.)', parts: [
      { id: '10a', level: 'EMG', make: function (r) { var p = nz(r, -8, 8), q = nz(r, -9, 9); if (p === -3 && q === 5) q = 6; return { prompt: 'vertex ' + t(ptTex(p, q)) + ', opens down', input: { type: 'math', keys: 'poly', vars: ['x'], before: t('y=') }, check: featChk({ p: p, q: q, aSign: -1 }), key: vfTex(-1, p, q), answer: t('y=' + vfTex(-1, p, q)) + ' (any ' + t('a<0') + ')', solution: 'Any ' + t('a<0') + ' with ' + t('p=' + p) + ' and ' + t('q=' + q) + ', e.g. ' + t('y=' + vfTex(-1, p, q)) + ' or ' + t('y=' + vfTex(-3, p, q)) + '.', hints: ['The vertex gives ' + t('p') + ' and ' + t('q') + '. Opening down means ' + t('a<0') + '.'], text: 'features → equation: vertex and opens down', good: [vfTex(-2, p, q), vfTex(-0.5, p, q)], bad: [vfTex(1, p, q), vfTex(-1, -p, q)] }; } },
      { id: '10b', level: 'EMG', make: function (r) { var p = nz(r, -8, 8), q = nz(r, -9, 9); if (p === 2 && q === -6) q = -5; return { prompt: 'axis of symmetry ' + t('x=' + p) + ', minimum value ' + t(q), input: { type: 'math', keys: 'poly', vars: ['x'], before: t('y=') }, check: featChk({ p: p, q: q, aSign: 1, dirHint: 'A <b>minimum</b> value means it opens up: ' + t('a>0') + '.' }), key: vfTex(1, p, q), answer: t('y=' + vfTex(1, p, q)) + ' (any ' + t('a>0') + ')', solution: 'The vertex is ' + t(ptTex(p, q)) + ' and a minimum needs ' + t('a>0') + ', e.g. ' + t('y=' + vfTex(1, p, q)) + '.', hints: ['The axis gives ' + t('p') + '; the minimum value is ' + t('q') + '. A minimum means the parabola opens up.'], text: 'features → equation: axis and minimum', good: [vfTex(3, p, q)], bad: [vfTex(-1, p, q)].concat(p !== q ? [vfTex(1, q, p)] : []) }; } },
      { id: '10c', level: 'ADV', make: function (r) { var p = nz(r, -8, 8), q = nz(r, -9, 9), s = q < 0 ? -1 : 1; if (p === 1 && q === -4) p = 2; return { prompt: 'vertex ' + t(ptTex(p, q)) + ' and no ' + t('x') + '-intercepts', input: { type: 'math', keys: 'poly', vars: ['x'], before: t('y=') }, check: featChk({ p: p, q: q, aSign: s, dirHint: 'With the vertex ' + (q < 0 ? 'below' : 'above') + ' the ' + t('x') + '-axis, your parabola crosses it. For no ' + t('x') + '-intercepts it must open ' + (q < 0 ? 'down' : 'up') + '.' }), key: vfTex(2 * s, p, q), answer: t('y=' + vfTex(2 * s, p, q)) + ' (any ' + t(s < 0 ? 'a<0' : 'a>0') + ')', solution: 'The vertex is ' + (q < 0 ? 'below' : 'above') + ' the ' + t('x') + '-axis, so it must open ' + (q < 0 ? 'down' : 'up') + ' (' + t(s < 0 ? 'a<0' : 'a>0') + '), e.g. ' + t('y=' + vfTex(2 * s, p, q)) + '.', hints: ['Is the vertex above or below the ' + t('x') + '-axis? Which way must it open so it never reaches the axis?'], text: 'features → equation: no x-intercepts', good: [vfTex(s, p, q)], bad: [vfTex(-s, p, q)] }; } },
      { id: '10d', level: 'MAS', make: function (r) { var p = nz(r, -8, 8), k = r.chance(0.6) ? 0 : nz(r, -6, 6), down = r.chance(0.6); if (p === -7 && k === 0 && down) p = -6; var a = down ? -1 : 1, set = rangeTex(k, !down); return { prompt: 'axis of symmetry ' + t('x=' + p) + ' and range ' + t(set), input: { type: 'math', keys: 'poly', vars: ['x'], before: t('y=') }, check: featChk({ p: p, q: k, aSign: a, qHint: 'The range ends at the ' + (down ? 'maximum' : 'minimum') + ' value ' + t(k) + ': that is ' + t('q') + '.', dirHint: 'The range is ' + t(down ? 'y\\le ' + k : 'y\\ge ' + k) + ', so the parabola opens ' + (down ? 'down' : 'up') + '.' }), key: vfTex(a, p, k), answer: t('y=' + vfTex(a, p, k)) + ' (any ' + t(down ? 'a<0' : 'a>0') + ')', solution: (down ? 'Maximum' : 'Minimum') + ' value ' + t(k) + ', so the vertex is ' + t(ptTex(p, k)) + ' and ' + t(down ? 'a<0' : 'a>0') + ', e.g. ' + t('y=' + vfTex(a, p, k)) + '.', hints: ['The range tells you the ' + (down ? 'maximum' : 'minimum') + ' value (that is ' + t('q') + ') and the direction of opening.'], text: 'features → equation: axis and range', good: [vfTex(2 * a, p, k)], bad: [vfTex(-a, p, k)] }; } }] },

    { num: '11', parts: [
      { id: '11', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { var s = sgn(r); return { s: s, a: s * r.int(2, 5), m: r.int(1, 6), n: r.int(2, 9) }; }, function (z) { return !(z.a === 3 && z.m === 2 && z.n === 5); }), q = -o.s * o.n, p = -o.m, name = r.pick(['Kai', 'Avery', 'Jordan', 'Sam']);
        var claim = t(ptTex(o.m, q)) + ' and no ' + t('x') + '-intercepts because ' + t('q') + ' is ' + (q < 0 ? 'negative' : 'positive');
        var V = function (x) { return 'vertex ' + t(ptTex(x, q)); };
        return Z.mc(r, name + ' says that ' + eqT(o.a, p, q) + ' has vertex ' + claim + '. Which correction is right?', [
          { html: 'The ' + V(p) + ', and there are <b>2</b> ' + t('x') + '-intercepts.', right: true },
          { html: 'The ' + V(p) + ', and there are no ' + t('x') + '-intercepts.', why: 'The sign of ' + t('q') + ' alone doesn’t decide it: compare it with the direction of opening (' + t('a=' + o.a) + ').', code: LID + '-kai' },
          { html: 'The ' + V(o.m) + ' is right, but there are <b>2</b> ' + t('x') + '-intercepts.', why: t('(x+' + o.m + ')=(x-(-' + o.m + '))') + ', so ' + t('p=-' + o.m) + '.', code: LID + '-p-sign' },
          { html: name + ' is right: ' + V(o.m) + ' and no ' + t('x') + '-intercepts.', why: 'There are two errors: the sign of ' + t('p') + ', and the reason about ' + t('q') + '.', code: LID + '-kai' }],
          t('(x+' + o.m + ')=(x-(-' + o.m + '))') + ', so ' + t('p=-' + o.m) + ': the vertex is ' + t(ptTex(p, q)) + '.<br>A ' + (q < 0 ? 'negative' : 'positive') + ' ' + t('q') + ' alone doesn’t decide it: ' + t('a=' + o.a) + ' (opens ' + (o.a > 0 ? 'up' : 'down') + ') and the vertex is ' + (q < 0 ? 'below' : 'above') + ' the axis, so there are 2 ' + t('x') + '-intercepts (' + t(pmTex(p, -q / o.a)) + ').', ['Check the sign of ' + t('p') + ' in ' + t('(x+' + o.m + ')') + '.', 'For the number of ' + t('x') + '-intercepts, use the direction of opening <b>and</b> the position of the vertex.'], 'error analysis: vertex and x-intercepts');
      } }] },

    { num: '12', shared: function (r) {
        return pickWhere(function () { var a = r.pick([-0.5, -0.25, -0.4, -0.2, -1, -0.8]), p = r.pick([1.5, 2, 2.5, 3, 3.5, 4]), q = r.int(3, 9); return { a: a, p: p, q: q, c: cl(a * p * p + q), L: p + Math.sqrt(-q / a), N: p - Math.sqrt(-q / a), what: r.pick([['fountain nozzle', 'nozzle', 'water', 'the surface of the pool', 'hit the pool surface'], ['garden sprinkler', 'sprinkler head', 'water', 'the lawn', 'land on the lawn']]) }; },
          function (z) { var D = -z.q / z.a, s = Math.sqrt(D); return z.c > 0.2 && z.c < 3 && Math.abs(s - Math.round(s)) > 0.01 && Math.abs(z.L * 100 - Math.round(z.L * 100)) > 0.05 && !(z.a === -0.5 && z.p === 3 && z.q === 5) && Number.isInteger(cl(z.c * 100)); });
      },
      stem: function (o) { return 'A ' + o.what[0] + ' sprays ' + o.what[2] + ' in a parabolic arc. The height of the water above ' + o.what[3] + ' is ' + t('h=' + vfTex(o.a, o.p, o.q)) + ' metres, where ' + t('x') + ' is the horizontal distance in metres from the ' + o.what[1] + '.'; },
      parts: [
        { id: '12a', level: 'BEG', make: function (r, o) { return Z.fields('What is the maximum height of the water, and at what horizontal distance does it occur?', [{ label: 'Maximum height', ans: o.q, after: 'm', cands: [[o.p, LID + '-swap', 'That is the horizontal distance. The height is the second coordinate of the vertex.']] }, { label: 'At a distance of', ans: o.p, after: 'm', cands: [[o.q, LID + '-swap', 'That is the height. The distance is the first coordinate of the vertex.']] }], { sol: 'Vertex ' + t(ptTex(o.p, o.q)) + ': a maximum height of ' + t(vT(o.q)) + ' m, ' + t(vT(o.p)) + ' m from the ' + o.what[1] + '.', hints: ['The highest point is the vertex ' + t('(p,\\ q)') + '.'], text: 'fountain: maximum height' }); } },
        { id: '12b', level: 'EMG', make: function (r, o) { return Z.num('How high above ' + o.what[3] + ' is the ' + o.what[1] + '?', o.c, { after: 'm', unit: 'm', cands: yintCands(o.a, o.p, o.q), sol: 'At ' + t('x=0') + ': ' + t('h=' + vT(o.a) + '(' + vT(cl(o.p * o.p)) + ')+' + o.q + '=' + vT(o.c)) + ' m.', hints: ['The ' + o.what[1] + ' is at ' + t('x=0') + '.'], text: 'fountain: starting height' }); } },
        { id: '12c', level: 'PRG', make: function (r, o) { return Z.apx('How far from the ' + o.what[1] + ' does the water ' + o.what[4] + '? Give the answer to the nearest hundredth of a metre.', o.L, 2, { after: 'm', unit: 'm', cands: [[o.N, LID + '-neg-root', 'Reject the negative root: it is behind the ' + o.what[1] + ', where there is no water.'], [-o.N, LID + '-neg-root', 'Reject the negative root (behind the ' + o.what[1] + '); use the positive one.'], [2 * o.p, LID + '-half', 'The water doesn’t start at the ground: solve ' + t('h=0') + '.']], sol: t(vT(-o.a) + '(x-' + vT(o.p) + ')^{2}=' + o.q) + ', so ' + t('(x-' + vT(o.p) + ')^{2}=' + vT(cl(-o.q / o.a))) + ' and ' + t('x=' + vT(o.p) + '\\pm\\sqrt{' + vT(cl(-o.q / o.a)) + '}') + '.<br>' + t('x\\approx ' + o.L.toFixed(2)) + ' or ' + t('x\\approx ' + o.N.toFixed(2)) + '. Reject ' + t(o.N.toFixed(2)) + ': it is behind the ' + o.what[1] + '. The water lands ' + t(o.L.toFixed(2)) + ' m away.', hints: ['Set ' + t('h=0') + ' and solve. One root is negative — does it make sense here?'], text: 'fountain: landing distance (reject a root)' }); } },
        { id: '12d', level: 'ADV', make: function (r, o) {
          var L = K.roundTo(o.L, 2), D = '\\{x\\mid 0\\le x\\le ' + L.toFixed(2) + ',\\ x\\in\\mathbb{R}\\}', Rg = '\\{h\\mid 0\\le h\\le ' + o.q + ',\\ h\\in\\mathbb{R}\\}';
          return Z.fields('State the domain and range in this context.', [{ label: 'Domain', set: D, opt: { v: 'x', other: Rg, otherName: 'range', wrong: [{ is: '\\{x\\mid ' + K.roundTo(o.N, 2).toFixed(2) + '\\le x\\le ' + L.toFixed(2) + ',\\ x\\in\\mathbb{R}\\}', code: LID + '-neg-root', hint: 'The water starts at the ' + o.what[1] + ' (' + t('x=0') + '), not at the rejected root.' }, { is: DOM, code: 'set-arrow', hint: 'Only the arc of water makes sense: from the ' + o.what[1] + ' to where it lands.' }] } },
            { label: 'Range', set: Rg, opt: { v: 'h', other: D, otherName: 'domain', wrong: [{ is: '\\{h\\mid ' + vT(o.c) + '\\le h\\le ' + o.q + ',\\ h\\in\\mathbb{R}\\}', code: LID + '-ctx-range0', hint: 'The water falls past the ' + o.what[1] + '’s height all the way down to ' + o.what[3] + ': the range starts at ' + t('0') + '.' }, { is: '\\{h\\mid h\\le ' + o.q + ',\\ h\\in\\mathbb{R}\\}', code: 'set-arrow', hint: 'Only the arc of water makes sense: the height stops at ' + t('0') + '.' }] } }],
            { sol: 'Only the arc of water makes sense: domain ' + t(D) + ' (approx.); range ' + t(Rg) + '.', hints: ['Domain: from the ' + o.what[1] + ' (' + t('x=0') + ') to where the water lands. Range: from ' + t('0') + ' up to the maximum height.'], text: 'fountain: domain and range in context' });
        } }] },

    { num: '13', shared: function (r) {
        return pickWhere(function () { var p = r.pick([0.8, 0.9, 1.1, 1.3, 1.4, 1.5, 1.6, 2]), d = r.int(2, 9) / 10; return { p: p, q: cl(5 * p * p), d: d, k: cl(5 * p * p - 5 * d * d), what: r.pick(['soccer ball', 'football', 'volleyball']) }; },
          function (z) { return z.d < z.p - 0.15 && !(z.p === 1.2) && z.k > 0.5; });
      },
      stem: function (o) { return 'A ' + o.what + ' is kicked from the ground. Its height after ' + t('t') + ' seconds is ' + t('h=-5(t-' + vT(o.p) + ')^{2}+' + vT(o.q)) + ' metres.'; },
      parts: [
        { id: '13a', level: 'BEG', make: function (r, o) { return Z.fields('What is the maximum height, and when does it occur?', [{ label: 'Maximum height', ans: o.q, after: 'm', cands: [[o.p, LID + '-swap', 'That is the time. The height is the second coordinate of the vertex.']] }, { label: 'At', before: t('t='), ans: o.p, after: 's', cands: [[o.q, LID + '-swap', 'That is the height. The time is the first coordinate of the vertex.']] }], { sol: 'Vertex ' + t(ptTex(o.p, o.q)) + ': ' + t(vT(o.q)) + ' m at ' + t('t=' + vT(o.p)) + ' s.', hints: ['The vertex ' + t('(p,\\ q)') + ' gives the time and the maximum height.'], text: 'kick: maximum height' }); } },
        { id: '13b', level: 'BEG', make: function (r, o) { return Z.num('Show that the ball starts on the ground: what is its height at ' + t('t=0') + '?', 0, { after: 'm', unit: 'm', cands: [[o.q, LID + '-yint-q', 'That is the maximum height. Substitute ' + t('t=0') + '.'], [cl(5 * o.p * o.p + o.q), LID + '-yint-sign', 'Square first, then multiply by ' + t('-5') + '.']], sol: t('h=-5(0-' + vT(o.p) + ')^{2}+' + vT(o.q) + '=-5(' + vT(cl(o.p * o.p)) + ')+' + vT(o.q) + '=0') + ' ✓', hints: ['Substitute ' + t('t=0') + '.'], text: 'kick: starts on the ground' }); } },
        { id: '13c', level: 'EMG', make: function (r, o) { return Z.num('How long is the ball in the air?', 2 * o.p, { after: 's', unit: 's', cands: [[o.p, LID + '-half', 'That is the time to the top. It lands when ' + t('h=0') + ' again.']], sol: t('5(t-' + vT(o.p) + ')^{2}=' + vT(o.q)) + ', so ' + t('(t-' + vT(o.p) + ')^{2}=' + vT(cl(o.p * o.p))) + ' and ' + t('t-' + vT(o.p) + '=\\pm ' + vT(o.p)) + '.<br>' + t('t=0') + ' or ' + t('t=' + vT(2 * o.p)) + ': it is in the air for ' + t(vT(2 * o.p)) + ' s.', hints: ['Solve ' + t('h=0') + '. One root is the kick (' + t('t=0') + ').'], text: 'kick: time in the air' }); } },
        { id: '13d', level: 'ADV', make: function (r, o) { var t1 = cl(o.p - o.d), t2 = cl(o.p + o.d); return Z.fields('At what times is the ball ' + t(vT(o.k)) + ' m high?', [{ label: 'Rising', before: t('t='), ans: t1, after: 's', cands: [[t2, 'swap-answer', 'That is the time on the way down (the later time).']] }, { label: 'Falling', before: t('t='), ans: t2, after: 's', cands: [[t1, 'swap-answer', 'That is the time on the way up (the earlier time).']] }], { sol: t('-5(t-' + vT(o.p) + ')^{2}+' + vT(o.q) + '=' + vT(o.k)) + ', so ' + t('(t-' + vT(o.p) + ')^{2}=' + vT(cl(o.d * o.d))) + ' and ' + t('t-' + vT(o.p) + '=\\pm ' + vT(o.d)) + '.<br>' + t('t=' + vT(t1)) + ' s (rising) and ' + t('t=' + vT(t2)) + ' s (falling).', hints: ['Set ' + t('h=' + vT(o.k)) + ', isolate the square and take both square roots.'], text: 'kick: times at a height' }); } }] },

    { num: '14', parts: [
      { id: '14', level: 'EMG', make: function (r) {
        var p = nz(r, -8, 8), k = nz(r, -8, 8); if (p === 6 && k === 2) k = 3;
        var lhs = 'y' + (k > 0 ? '+' : '-') + Math.abs(k), V = function (x, y) { return t(ptTex(x, y)); };
        return Z.mc(r, 'The vertex of the graph of ' + t(lhs + '=-' + (p === 0 ? 'x^{2}' : '(' + binTex('x', p) + ')^{2}')) + ' is', [
          { html: V(p, -k), right: true }, { html: V(p, k), why: 'Solve for ' + t('y') + ' first: ' + t('y=-(' + binTex('x', p) + ')^{2}' + sT(-k)) + '.', code: LID + '-solve-y' },
          { html: V(-p, -k), why: 'Check the sign of ' + t('p') + '.', code: LID + '-p-sign' }, { html: V(-p, k), why: 'Check the sign of ' + t('p') + ', and solve for ' + t('y') + ' first.', code: LID + '-p-sign' }],
          t('y=-(' + binTex('x', p) + ')^{2}' + sT(-k)) + ', so ' + t('p=' + p) + ' and ' + t('q=' + (-k)) + ': the vertex is ' + V(p, -k) + '.', ['Solve for ' + t('y') + ' first, then read ' + t('(p,\\ q)') + '.'], 'MC: vertex after solving for y');
      } }] },
    { num: '15', parts: [
      { id: '15', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { a: r.pick([-3, -2, -4, 2, 3, 0.5]), p: nz(r, -6, 6), q: nz(r, -9, 9) }; }, function (z) { return AV(z.a, z.p, z.q) && Math.abs(z.p) !== Math.abs(z.q) && z.a !== z.q && -z.p !== z.a; }), up = o.a > 0;
        var S = function (v, u) { return t(rangeTex(v, u)); };
        return Z.mc(r, 'The range of ' + eqT(o.a, o.p, o.q) + ' is', [
          { html: S(o.q, up), right: true }, { html: S(o.q, !up), why: 'It opens ' + (up ? 'up' : 'down') + ' (' + t('a=' + vT(o.a)) + ').', code: LID + '-range-dir' },
          { html: S(o.p, up), why: 'The range uses ' + t('q') + ', the ' + t('y') + '-coordinate of the vertex.', code: LID + '-range-p' }, { html: S(o.a, !up), why: t('a') + ' gives the shape, not the range.', code: LID + '-mm-a' }],
          'It opens ' + (up ? 'up' : 'down') + ' (' + t('a=' + vT(o.a)) + ') with ' + mmWord(o.a) + ' value ' + t('q=' + o.q) + ': the range is ' + S(o.q, up) + '.', [HV[1]], 'MC: range from vertex form');
      } }] },
    { num: '16', parts: [
      { id: '16', level: 'EMG', make: function (r) {
        var s = sgn(r), mk = function (a, q) { return eqT(a, nz(r, -5, 5), q); };
        return Z.mc(r, 'Which function has no ' + t('x') + '-intercepts?', [
          { html: mk(s * r.int(2, 4), s * r.int(2, 7)), right: true },
          { html: mk(s * r.int(1, 3), -s * r.int(2, 6)), why: t('a') + ' and ' + t('q') + ' have opposite signs: two ' + t('x') + '-intercepts.', code: LID + '-count' },
          { html: mk(-s * r.int(1, 3), s * r.int(1, 5)), why: t('a') + ' and ' + t('q') + ' have opposite signs: two ' + t('x') + '-intercepts.', code: LID + '-count' },
          { html: mk(-s * r.pick([0.5, 2, 3]), 0), why: t('q=0') + ': the vertex is on the axis, one ' + t('x') + '-intercept.', code: LID + '-count' }],
          'When ' + t('a') + ' and ' + t('q') + ' have the <b>same sign</b>, the parabola opens away from the axis from a vertex that isn’t on it: no ' + t('x') + '-intercepts.', ['For each one: which way does it open, and is the vertex above, on or below the ' + t('x') + '-axis?'], 'MC: which has no x-intercepts');
      } }] },
    { num: '17', parts: [
      { id: '17', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { h: r.int(2, 4), k: r.int(2, 5) }; }, function (z) { return !(z.h === 3 && z.k === 4); });
        var shapes = [{ a: 0.5, p: o.h, q: -o.k }, { a: -2, p: -o.h, q: o.k }, { a: -1, p: o.h, q: o.k }, { a: 1, p: -o.h, q: -o.k }];
        var labels = r.shuffle([1, 2, 3, 4]), order = r.shuffle([0, 1, 2, 3]);
        var X = o.h + 4, Y = o.k + 2, fns = shapes.map(function (s) { return { f: Z.parabola(s.a, s.p, s.q) }; }), pts = shapes.map(function (s, i) { return { x: s.p, y: s.q, label: String(labels[i]) }; });
        var ans = Number(order.map(function (i) { return labels[i]; }).join('')), sw = Number(order.map(function (i) { var j = shapes.findIndex(function (s) { return s.p === -shapes[i].p && s.q === shapes[i].q; }); return labels[j]; }).join(''));
        var fig = Z.fig({ x: [-X, X], y: [-Y, Y], l: 2, fns: fns, points: pts, max: 320, aria: 'four numbered parabolas' });
        var eqs = order.map(function (i, n) { return ['First', 'Second', 'Third', 'Fourth'][n] + ' digit: the graph number of ' + eqT(shapes[i].a, shapes[i].p, shapes[i].q); }).join('<br>');
        return Z.num('<i>(Numerical Response)</i> Four parabolas are numbered on the grid (at their vertices). Match the equations with the graphs.' + fig + eqs + '<br>(Record the four digits from left to right.)', ans, { nr: true, cands: [[sw, LID + '-p-sign', 'Check the sign of ' + t('p') + ' in each bracket: ' + t('(x+' + o.h + ')') + ' means the vertex is at ' + t('x=-' + o.h) + '.']],
          sol: order.map(function (i) { var s = shapes[i]; return eqT(s.a, s.p, s.q) + ': vertex ' + t(ptTex(s.p, s.q)) + ', opens ' + (s.a > 0 ? 'up' : 'down') + ' → graph ' + labels[i]; }).join('<br>') + '<br>The answer is ' + t(ans) + '.', hints: ['Find each vertex (careful with the sign of ' + t('p') + '), then check the direction of opening.'], text: 'NR: match equations and graphs' });
      } }] },
    { num: '18', parts: [
      { id: '18', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { a: -r.int(2, 4), p: nz(r, -5, 5), q: r.int(40, 99) }; }, function (z) { return !(z.a === -2 && z.p === -3 && z.q === 50) && yint(z.a, z.p, z.q) > 0; });
        return Z.num('<i>(Numerical Response)</i> The ' + t('y') + '-intercept of the graph of ' + eqT(o.a, o.p, o.q) + ' is ______.', yint(o.a, o.p, o.q), { nr: true, cands: yintCands(o.a, o.p, o.q), sol: yintSol(o.a, o.p, o.q), hints: HY, text: 'NR: y-intercept' });
      } }] }
  ];

  var EXTRA = [
    { num: 'A1', section: 'A. Skills', stem: 'Complete the table for each function.', parts: [
      { id: 'eA1a', level: 'BEG', make: function (r) { var o = pickWhere(function () { return { a: -r.int(2, 6), p: nz(r, -9, 9), q: r.int(1, 9) }; }, function (z) { return AV(z.a, z.p, z.q); }); return Z.fields('For ' + eqT(o.a, o.p, o.q) + ':', featTable(o.a, o.p, o.q, { domain: true }), { sol: featSolT(o.a, o.p, o.q), hints: HV, text: 'table with domain (a < 0)' }); } },
      { id: 'eA1b', level: 'BEG', make: function (r) { var o = pickWhere(function () { var d = r.pick([3, 4, 5]); return { a: r.int(1, d - 1) / d, p: nz(r, -9, 9), q: nz(r, -9, 9) }; }, function (z) { return AV(z.a, z.p, z.q) && toFrac(z.a)[1] > 2; }); return Z.fields('For ' + eqT(o.a, o.p, o.q, true) + ':', featTable(o.a, o.p, o.q, { domain: true }), { sol: featSolT(o.a, o.p, o.q), hints: HV, text: 'table with domain (fraction a)' }); } },
      { id: 'eA1c', level: 'EMG', make: function (r) { var o = pickWhere(function () { return { a: r.int(2, 5), k: nz(r, -9, 9) }; }, function (z) { return AV(z.a, 0, z.k); }); var lhs = 'y' + (o.k > 0 ? '-' : '+') + Math.abs(o.k); return Z.fields('For ' + t(lhs + '=' + o.a + 'x^{2}') + ':', featTable(o.a, 0, o.k, { domain: true, ptCands: [[[0, -o.k], LID + '-solve-y', 'Solve for ' + t('y') + ' first: ' + t('y=' + o.a + 'x^{2}' + sT(o.k)) + '.']], valCands: [[-o.k, LID + '-solve-y', 'Solve for ' + t('y') + ' first.']] }), { sol: featSolT(o.a, 0, o.k, t('y=' + o.a + 'x^{2}' + sT(o.k)) + '.<br>'), hints: ['Solve for ' + t('y') + ' first.', HV[1]], text: 'table: y − k = ax²' }); } },
      { id: 'eA1d', level: 'PRG', make: function (r) { var o = pickWhere(function () { return { c: r.pick([2, 3, 4, 5]), p: nz(r, -9, 9) }; }, function (z) { return AV(-1 / z.c, z.p, 0); }); return Z.fields('For ' + t(o.c + 'y=-(' + binTex('x', o.p) + ')^{2}') + ':', featTable(-1 / o.c, o.p, 0, { domain: true }), { sol: featSolT(-1 / o.c, o.p, 0, t('y=' + vfTex(-1 / o.c, o.p, 0, 'x', true)) + '.<br>'), hints: ['Divide by ' + t(o.c) + ' first.', HV[1]], text: 'table: ky = −(x − p)²' }); } }] },
    { num: 'A2', stem: 'State the ' + t('y') + '-intercept and the number of ' + t('x') + '-intercepts of each graph.', parts: [
      { id: 'eA2a', level: 'BEG', make: function (r) { var o = pickWhere(function () { return { a: 1, p: nz(r, -7, 7), q: -r.int(1, 9) }; }, function (z) { return AV(z.a, z.p, z.q); }); return twoCount(o); } },
      { id: 'eA2b', level: 'EMG', make: function (r) { var o = pickWhere(function () { return { a: -r.int(2, 4), p: nz(r, -5, 5), q: -r.int(1, 9) }; }, function (z) { return AV(z.a, z.p, z.q); }); return twoCount(o); } },
      { id: 'eA2c', level: 'EMG', make: function (r) { var o = pickWhere(function () { return { a: r.pick([2, 3, 4, -2]), p: nz(r, -5, 5), q: 0 }; }, function (z) { return AV(z.a, z.p, z.q); }); return twoCount(o); } }] },
    { num: 'A3', stem: 'Determine the ' + t('x') + '-intercepts as exact values in simplest form.', parts: [
      { id: 'eA3a', level: 'EMG', make: function (r) { var o = pickWhere(function () { return { p: nz(r, -6, 6), k: r.int(2, 6) }; }, function (z) { return AV(2, z.p, -2 * z.k * z.k) && z.k !== Math.abs(z.p); }), q = -2 * o.k * o.k; return Z.roots(eqT(2, o.p, q), xSpec(2, o.p, q), { sol: xSol(2, o.p, q), hints: HX, text: 'exact x-intercepts: integers' }); } },
      { id: 'eA3b', level: 'PRG', make: function (r) { var o = pickWhere(function () { return { p: nz(r, -8, 8), m: r.pick([2, 3, 5, 6, 7, 10, 11]) }; }, function (z) { return AV(-1, z.p, z.m); }); return Z.roots(eqT(-1, o.p, o.m), xSpec(-1, o.p, o.m), { sol: xSol(-1, o.p, o.m), hints: HX, text: 'exact x-intercepts: p ± √m' }); } },
      { id: 'eA3c', level: 'ADV', make: function (r) { var o = pickWhere(function () { var s = r.pick([2, 3]), f = r.pick([2, 3, 5, 7]); return { p: nz(r, -6, 6), M: s * s * f }; }, function (z) { return z.M % 2 === 0 && AV(0.5, z.p, -z.M / 2); }), q = -o.M / 2; return Z.roots(eqT(0.5, o.p, q, true), xSpec(0.5, o.p, q), { sol: xSol(0.5, o.p, q, true), hints: HX.concat(['Simplify the radical.']), text: 'exact x-intercepts: simplify the radical' }); } },
      { id: 'eA3d', level: 'EMG', make: function (r) { var o = pickWhere(function () { return { a: -r.int(2, 5), p: nz(r, -6, 6), q: -r.int(2, 15) }; }, function (z) { return AV(z.a, z.p, z.q); }); return Z.roots(eqT(o.a, o.p, o.q), xSpec(o.a, o.p, o.q), { sol: xSol(o.a, o.p, o.q), hints: HX, text: 'exact x-intercepts: none' }); } }] },

    { num: 'B1', section: 'B. Applying', shared: function (r) { return pickWhere(function () { var k = r.int(2, 4); return { p: nz(r, -4, 4), k: k, q: -k * k }; }, function (z) { return AV(1, z.p, z.q) && z.k !== Math.abs(z.p) && Math.abs(z.p * z.p + z.q) <= 16; }); },
      stem: function (o) { return 'For ' + eqT(1, o.p, o.q) + ':'; },
      parts: [
        { id: 'eB1a', level: 'EMG', make: function (r, o) { return Z.fields('State the vertex, the axis of symmetry and the range.', featTable(1, o.p, o.q).filter(function (s) { return !s.mm && s.label !== 'Max or min value'; }), { sol: 'Vertex ' + t(ptTex(o.p, o.q)) + '; axis ' + t('x=' + o.p) + '; minimum ' + t(o.q) + ', so the range is ' + t(rangeTex(o.q, true)) + '.', hints: HV, text: 'B1: vertex, axis, range' }); } },
        { id: 'eB1b', level: 'PRG', make: function (r, o) { var c = yint(1, o.p, o.q); return Z.fields('State the ' + t('y') + '-intercept and the ' + t('x') + '-intercepts.', [{ label: t('y') + '-intercept', ans: c, cands: yintCands(1, o.p, o.q) }, { label: t('x') + '-intercepts', roots: xSpec(1, o.p, o.q) }], { sol: yintSol(1, o.p, o.q) + '; mirror point ' + t(ptTex(2 * o.p, c)) + '.<br>' + xSol(1, o.p, o.q), hints: HY.concat(HX), text: 'B1: intercepts' }); } },
        { id: 'eB1c', level: 'EMG', make: function (r, o) { var c = yint(1, o.p, o.q), G = graphOpts(1, o.p, o.q, [[0, c]]); G.opts[0].points = [{ x: o.p, y: o.q }, { x: 0, y: c }, { x: 2 * o.p, y: c }, { x: o.p - o.k, y: 0 }, { x: o.p + o.k, y: 0 }]; return Z.graphMC(r, 'Which is the graph?', G.opts, G.win, 'Vertex ' + t(ptTex(o.p, o.q)) + ', ' + t('x') + '-intercepts ' + t(o.p - o.k) + ' and ' + t(o.p + o.k) + ', ' + t('y') + '-intercept ' + t(c) + ' and the mirror point ' + t(ptTex(2 * o.p, c)) + '.', ['Check the vertex first (careful with the sign of ' + t('p') + ').'], 'B1: choose the graph'); } }] },
    { num: 'B2', shared: function (r) { return pickWhere(function () { var a = r.pick([0.5, 0.5, 1, -1, -0.5]), j = Math.abs(a) === 0.5 ? r.pick([2, 4]) : r.int(1, 3), h = Math.abs(a) === 0.5 ? 2 * nz(r, -2, 2) : nz(r, -3, 3); return { a: a, j: j, h: h, q: -a * j * j }; }, function (z) { return AV(z.a, z.h, z.q) && Math.abs(yint(z.a, z.h, z.q)) <= 10 && Math.abs(z.q) <= 8 && z.j !== Math.abs(z.h); }); },
      stem: function (o) { var c = yint(o.a, o.h, o.q), W0 = Z.win([[o.h - o.j, 0], [o.h + o.j, 0], [o.h, o.q], [0, c]], 2, 2); return 'The graph of a quadratic function is shown. The marked points have integer coordinates.' + Z.fig({ x: W0.x, y: W0.y, l: 2, fns: [{ f: Z.parabola(o.a, o.h, o.q), from: o.h - o.j - 1, to: o.h + o.j + 1 }], points: [{ x: o.h, y: o.q }, { x: 0, y: c }, { x: o.h - o.j, y: 0 }, { x: o.h + o.j, y: 0 }], max: 280, aria: 'graph of a parabola' }); },
      parts: [
        { id: 'eB2a', level: 'BEG', make: function (r, o) { return Z.fields('State the vertex and the ' + mmWord(o.a) + ' value.', [{ label: 'Vertex', pt: [o.h, o.q] }, { label: (o.a > 0 ? 'Minimum' : 'Maximum') + ' value', ans: o.q, cands: [[o.h, LID + '-mm-p', 'That is the ' + t('x') + '-coordinate of the vertex.']] }], { sol: 'Vertex ' + t(ptTex(o.h, o.q)) + '; ' + mmWord(o.a) + ' value ' + t(o.q) + '.', hints: ['The vertex is the turning point.'], text: 'B2 graph: vertex and min/max' }); } },
        { id: 'eB2b', level: 'EMG', make: function (r, o) { return Z.fields('State the range.', [{ label: 'Range', range: [o.q, o.a > 0], opt: { p: o.h } }], { sol: t(rangeTex(o.q, o.a > 0)), hints: [HV[1]], text: 'B2 graph: range' }); } },
        { id: 'eB2c', level: 'EMG', make: function (r, o) { var c = yint(o.a, o.h, o.q); return Z.fields('State the ' + t('x') + '- and ' + t('y') + '-intercepts.', [{ label: t('x') + '-intercepts', roots: { vals: [o.h - o.j, o.h + o.j] } }, { label: t('y') + '-intercept', ans: c, cands: [[o.q, LID + '-yint-q', 'That is the vertex.']] }], { sol: t('x') + '-intercepts ' + t(o.h - o.j) + ' and ' + t(o.h + o.j) + '; ' + t('y') + '-intercept ' + t(c) + '.', hints: ['Read where the graph crosses each axis.'], text: 'B2 graph: intercepts' }); } }] },
    { num: 'B3', shared: function (r) { return pickWhere(function () { var q = r.int(3, 8), d = r.pick([2, 2.5, 3, 4]), p = r.pick([0.5, 1, 1.5]); return { q: q, d: d, p: p, a: cl(-q / (d * d)), who: r.pick(['A diver', 'A swimmer', 'A cliff jumper']) }; }, function (z) { var c = cl(z.a * z.p * z.p + z.q); return Number.isInteger(cl(z.a * 100)) && c > 0.5 && z.p < z.d && !(z.a === -1.25 && z.p === 1 && z.q === 5) && Number.isInteger(cl(c * 100)); }); },
      stem: function (o) { return o.who + ' leaves the end of a diving board. The height above the water is ' + t('h=' + vfTex(o.a, o.p, o.q)) + ' metres, where ' + t('x') + ' is the horizontal distance in metres from the end of the board.'; },
      parts: [
        { id: 'eB3a', level: 'BEG', make: function (r, o) { return Z.fields('What is the maximum height, and how far out does it occur?', [{ label: 'Maximum height', ans: o.q, after: 'm', cands: [[o.p, LID + '-swap', 'That is the distance.']] }, { label: 'Distance out', ans: o.p, after: 'm', cands: [[o.q, LID + '-swap', 'That is the height.']] }], { sol: 'Vertex ' + t(ptTex(o.p, o.q)) + ': ' + t(o.q) + ' m, ' + t(vT(o.p)) + ' m out from the end of the board.', hints: ['The vertex gives the maximum.'], text: 'diver: maximum height' }); } },
        { id: 'eB3b', level: 'BEG', make: function (r, o) { var c = cl(o.a * o.p * o.p + o.q); return Z.num('How high is the board above the water?', c, { after: 'm', unit: 'm', cands: yintCands(o.a, o.p, o.q), sol: 'At ' + t('x=0') + ': ' + t('h=' + vT(o.a) + '(' + vT(cl(o.p * o.p)) + ')+' + o.q + '=' + vT(c)) + ' m.', hints: ['The end of the board is at ' + t('x=0') + '.'], text: 'diver: board height' }); } },
        { id: 'eB3c', level: 'PRG', make: function (r, o) { var L = cl(o.p + o.d), N = cl(o.p - o.d); return Z.num('How far from the end of the board does the diver enter the water?', L, { after: 'm', unit: 'm', cands: [[N, LID + '-neg-root', 'Reject the negative root: it is behind the board.'], [-N, LID + '-neg-root', 'Use the positive root, ' + t(vT(o.p) + '+' + vT(o.d)) + '.'], [o.d, 'value', 'Add the distance to the vertex: ' + t('x-' + vT(o.p) + '=\\pm ' + vT(o.d)) + '.']], sol: t(vT(-o.a) + '(x-' + vT(o.p) + ')^{2}=' + o.q + '\\Rightarrow (x-' + vT(o.p) + ')^{2}=' + vT(cl(o.d * o.d))) + ', so ' + t('x=' + vT(L)) + ' or ' + t('x=' + vT(N)) + '. Reject ' + t(vT(N)) + ' (behind the board): ' + t(vT(L)) + ' m out.', hints: ['Set ' + t('h=0') + ' and solve; reject the root that doesn’t make sense.'], text: 'diver: entry point' }); } }] },
    { num: 'B4', parts: [
      { id: 'eB4', level: 'EMG', make: function (r) { var o = pickWhere(function () { var p = nz(r, -6, 6), d = r.int(2, 6); return { p: p, x1: p - d, x2: p + d, y: nz(r, -9, 9) }; }, function (z) { return !(z.x1 === -6 && z.x2 === 2); }); return Z.num('The points ' + t(ptTex(o.x1, o.y)) + ' and ' + t(ptTex(o.x2, o.y)) + ' are on the graph of ' + t('y=a(x-p)^{2}+q') + '. Determine ' + t('p') + '.', o.p, { before: t('p='), cands: [[o.x1 + o.x2, LID + '-mid', 'Halfway: add the ' + t('x') + '-values and divide by 2.'], [(o.x2 - o.x1) / 2, LID + '-mid', 'That is half the distance between the points. The axis is at their midpoint.'], [o.y, 'value', 'The points have the same ' + t('y') + '-value; the axis is halfway between their ' + t('x') + '-values.']], sol: 'Points with the same ' + t('y') + '-value are mirror images, so the axis is halfway between them: ' + t('p=\\frac{' + o.x1 + '+' + (o.x2 < 0 ? '(' + o.x2 + ')' : o.x2) + '}{2}=' + o.p) + '.', hints: ['Points at the same height are the same distance from the axis.'], text: 'symmetry: p from two points' }); } }] },
    { num: 'B5', parts: [
      { id: 'eB5', level: 'EMG', make: function (r) { var M = nz(r, -9, 9), h = nz(r, -5, 5), k = r.int(2, 4); return Z.mc(r, 'Which function has a maximum value of ' + t(M) + '?', [
        { html: eqT(-k, h, M), right: true }, { html: eqT(1, h, M), why: t('a>0') + ': that is a <b>minimum</b> of ' + t(M) + '.', code: LID + '-maxmin' },
        { html: eqT(-1, M, 0), why: 'Its maximum is ' + t('q=0') + ' (the vertex is ' + t(ptTex(M, 0)) + ').', code: LID + '-mm-p' }, { html: eqT(M > 0 ? M : -M, h, 0), why: 'That has ' + t('q=0') + ' and opens up: a minimum of 0.', code: LID + '-mm-a' }],
        t('a<0') + ' and ' + t('q=' + M) + ': ' + eqT(-k, h, M) + ' has a maximum value of ' + t(M) + '.', [HV[1]], 'MC: which has this maximum'); } }] },
    { num: 'B6', parts: [
      { id: 'eB6', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { var a = r.pick([4, 25]), k = Math.sqrt(a), m = r.int(1, 3), j = r.int(1, 12); return { a: a, k: k, m: m, j: j, n: j * j, x: -m + j / k }; }, function (z) { return z.x > 0 && z.x < 9.95 && !Number.isInteger(z.x) && !(z.a === 4 && z.m === 1 && z.j === 3) && Number.isInteger(cl(z.x * 10)); });
        return Z.apx('<i>(Numerical Response)</i> The positive ' + t('x') + '-intercept of the graph of ' + eqT(o.a, -o.m, -o.n) + ', to the nearest tenth, is ______.', o.x, 1, { nr: true, cands: [[-o.m - o.j / o.k, LID + '-neg-root', 'That is the negative one.'], [o.m + o.j / o.k, LID + '-p-sign', 'Check the sign of ' + t('p') + '.'], [-o.m + Math.sqrt(o.n), LID + '-div-a', 'Divide by ' + t(o.a) + ' before taking the square root.']], sol: t('(x+' + o.m + ')^{2}=\\frac{' + o.n + '}{' + o.a + '}\\Rightarrow x+' + o.m + '=\\pm\\frac{' + o.j + '}{' + o.k + '}') + ', so ' + t('x=' + rT(o.x)) + ' or ' + t('x=' + rT(-o.m - o.j / o.k)) + '. The positive one is ' + t(o.x.toFixed(1)) + '.', hints: HX, text: 'NR: positive x-intercept' });
      } }] },

    { num: 'C1', section: 'C. Stretch', parts: [
      { id: 'eC1', level: 'ADV', make: function (r) {
        var a = r.pick([-3, -2, -1, 2, 3, 0.5]), p = nz(r, -6, 6), up = a > 0; if (a === -3 && p === -4) p = -5;
        var cols = [{ id: 'pos', html: t('q>0') }, { id: 'zero', html: t('q=0') }, { id: 'neg', html: t('q<0') }];
        var want = { two: up ? 'neg' : 'pos', one: 'zero', none: up ? 'pos' : 'neg' };
        return B.grid('For which values of ' + t('q') + ' does the graph of ' + t('y=' + aTex(a) + '(' + binTex('x', p) + ')^{2}+q') + ' have each number of ' + t('x') + '-intercepts?', [{ id: 'two', html: 'two' }, { id: 'one', html: 'one' }, { id: 'none', html: 'none' }], cols, want, { rowHead: t('x') + '-intercepts', colHead: 'values of ' + t('q') },
          'It opens ' + (up ? 'up' : 'down') + '. Two: the vertex ' + (up ? 'below' : 'above') + ' the axis, ' + t(up ? 'q<0' : 'q>0') + '. One: the vertex on the axis, ' + t('q=0') + '. None: the vertex ' + (up ? 'above' : 'below') + ' the axis, ' + t(up ? 'q>0' : 'q<0') + '.', ['Which way does it open? Then where must the vertex be for each case?'], 'values of q for 2, 1, 0 x-intercepts');
      } }] },
    { num: 'C2', parts: [
      { id: 'eC2', level: 'MAS', make: function (r) {
        var o = pickWhere(function () { return { k: r.pick([2, 3, -2, 4, 0.5]), h: nz(r, -6, 6), m: r.pick([2, 3, 5, 6, 7, 10, 11]) }; }, function (z) { return !(z.k === 2 && z.h === 3 && z.m === 7); }), q = -o.k * o.m;
        return Z.fields('The graph of ' + t('y=' + aTex(o.k) + '(x-p)^{2}+q') + ' has ' + t('x') + '-intercepts ' + t(o.h + '+\\sqrt{' + o.m + '}') + ' and ' + t(o.h + '-\\sqrt{' + o.m + '}') + '. Determine ' + t('p') + ' and ' + t('q') + '.', [{ label: t('p='), name: 'p', ans: o.h, cands: [[-o.h, LID + '-p-sign', 'The axis is halfway between the intercepts: ' + t('x=' + o.h) + '.']] }, { label: t('q='), name: 'q', ans: q, cands: [[-q, LID + '-q-sign', 'Substitute an intercept: ' + t('0=' + aTex(o.k) + '(\\sqrt{' + o.m + '})^{2}+q') + '.'], [-o.m, LID + '-div-a', 'Multiply by ' + t('a') + ': ' + t('0=' + vT(o.k) + '(' + o.m + ')+q') + '.']] }],
          { sol: 'The axis is halfway between the intercepts: ' + t('p=' + o.h) + '.<br>Substitute ' + t('x=' + o.h + '+\\sqrt{' + o.m + '}') + ', ' + t('y=0') + ': ' + t('0=' + aTex(o.k) + '(\\sqrt{' + o.m + '})^{2}+q=' + vT(cl(o.k * o.m)) + '+q') + ', so ' + t('q=' + vT(q)) + '. The function is ' + eqT(o.k, o.h, q) + '.', hints: ['The two intercepts are mirror images: the axis is halfway between them.', 'Substitute one intercept with ' + t('y=0') + ' to find ' + t('q') + '.'], text: 'p and q from irrational intercepts' });
      } }] },
    { num: 'C3', shared: function (r) { return pickWhere(function () { return { n: r.int(2, 5), x0: nz(r, -5, 5) }; }, function (z) { return !(z.n === 3 && z.x0 === 1) && z.x0 !== z.n && z.x0 !== -z.n; }); },
      stem: function (o) { return 'The graph of ' + t('y=(x-p)^{2}-' + o.n * o.n) + ' has an ' + t('x') + '-intercept at ' + t(o.x0) + '.'; },
      parts: [
        { id: 'eC3a', level: 'ADV', make: function (r, o) { var p1 = o.x0 - o.n, p2 = o.x0 + o.n; return B.valueSet('Determine the two possible values of ' + t('p') + '.', [p1, p2], { v: 'p', diag: function (A) { if (A.length === 2 && A.every(function (x) { return x === -o.x0 - o.n || x === -o.x0 + o.n; })) return { code: LID + '-p-sign', hint: 'Solve ' + t('(' + o.x0 + '-p)^{2}=' + o.n * o.n) + ' for ' + t('p') + ' carefully.' }; return null; } }, t('0=(' + o.x0 + '-p)^{2}-' + o.n * o.n + '\\Rightarrow (' + o.x0 + '-p)^{2}=' + o.n * o.n + '\\Rightarrow ' + o.x0 + '-p=\\pm ' + o.n) + ', so ' + t('p=' + p1) + ' or ' + t('p=' + p2) + '.', ['Substitute ' + t('x=' + o.x0) + ' and ' + t('y=0') + ', then solve for ' + t('p') + '.'], 'two values of p'); } },
        { id: 'eC3b', level: 'MAS', make: function (r, o) { var p1 = o.x0 - o.n, p2 = o.x0 + o.n; return Z.fields('For each value of ' + t('p') + ', what is the other ' + t('x') + '-intercept?', [{ label: 'When ' + t('p=' + p1) + ':', name: 'p = ' + p1, before: t('x='), ans: p1 - o.n, cands: [[o.x0, 'value', 'That is the given intercept. Find the other one.']] }, { label: 'When ' + t('p=' + p2) + ':', name: 'p = ' + p2, before: t('x='), ans: p2 + o.n, cands: [[o.x0, 'value', 'That is the given intercept. Find the other one.']] }],
          { sol: t('p=' + p1) + ': ' + t('(' + binTex('x', p1) + ')^{2}=' + o.n * o.n) + ' gives ' + t('x=' + o.x0) + ' or ' + t('x=' + (p1 - o.n)) + '.<br>' + t('p=' + p2) + ': ' + t('(' + binTex('x', p2) + ')^{2}=' + o.n * o.n) + ' gives ' + t('x=' + o.x0) + ' or ' + t('x=' + (p2 + o.n)) + '.', hints: ['The two intercepts are ' + t('p\\pm ' + o.n) + '. One of them is ' + t(o.x0) + '.'], text: 'other intercept for each p' }); } }] }
  ];
  function twoCount(o) {
    var c = yint(o.a, o.p, o.q), n = countOf(o.a, o.q);
    return Z.fields(eqT(o.a, o.p, o.q), [{ label: t('y') + '-intercept', ans: c, cands: yintCands(o.a, o.p, o.q) }, { label: 'Number of ' + t('x') + '-intercepts', name: 'Number of x-intercepts', ans: n, cands: [[n === 2 ? 0 : 2, LID + '-count', 'Use the direction of opening <b>and</b> the position of the vertex ' + t(ptTex(o.p, o.q)) + '.'], [1, LID + '-count', 'Only one when the vertex is on the axis (' + t('q=0') + ').']] }],
      { sol: yintSol(o.a, o.p, o.q) + '.<br>' + (n === 1 ? 'The vertex ' + t(ptTex(o.p, 0)) + ' is on the axis: 1.' : 'Opens ' + (o.a > 0 ? 'up' : 'down') + ', vertex ' + (o.q < 0 ? 'below' : 'above') + ' the axis: ' + n + '.'), hints: HY.concat(['Picture the vertex and the direction of opening.']), text: 'y-intercept and number of x-intercepts' });
  }

  HW.defineLesson({ id: LID, unit: 5, num: '3', title: 'Characteristics of a Quadratic Function in Vertex Form', outcome: 'RF3', calc: true, questions: QUESTIONS, extra: EXTRA });
})(window);
