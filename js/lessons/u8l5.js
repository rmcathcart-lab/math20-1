/* Math 20-1 · Unit 8 · Lesson 5 — Quadratic Inequalities in Two Variables (outcome RF7 on every part)
 * Assignment 5 (u8_l05.tex, Questions 1–16) and the Lesson 5 Extra Practice (u8_ep05.tex, A1–A3, B1–B6, C1–C3).
 * Every part is a generator: the booklet question's idea, form and difficulty with new numbers (the boundaries of the
 * lesson's examples and of the booklet questions themselves are left out). Calculator allowed; answers exact unless a
 * question asks to round.
 *
 * Conversions (students never draw):
 *   "graph the solution region" → choose the graph: four shaded graphs (the right one, the other side, solid ↔ dashed,
 *     and a wrong boundary — intercepts with the wrong signs, or the parabola that opens the other way — drawn in the
 *     right style); the worked solution gives the intercepts, vertex, test point and side (inside / outside);
 *   "with y alone on the left" → typed, any form of y op … (y alone is required; the sign must be reversed after
 *     dividing by a negative) — or, where the booklet then asks only about the graph, multiple choice;
 *   "is each point a solution" → a yes/no grid; "explain why (0, 0) cannot be the test point" → multiple choice on the
 *     reason, then on what the other test point shows;
 *   "write the inequality whose region is shown" → typed in general form (any equivalent inequality is accepted, the
 *     sign checked for the side and solid/dashed); calculator graphs → the x-intercepts to the nearest tenth;
 *   contexts → numbers, a yes/no box, or ordered pairs for where the boundaries meet.
 * Recognised mistakes (codes u8l5-…): the wrong side (or a sign not reversed after dividing by a negative), solid vs
 * dashed, a wrong boundary or a = 1 assumed, a boundary point judged wrong, using the whole width of an arch, the
 * restriction a ≠ 0 left out, and the classic MC distractors.
 * Levels: LIM BEG EMG PRG ADV MAS. Mastery: 16 (a + b + c from the vertex), Extra C1b, C2, C3.
 *
 * This file also holds HW.u8k56, the small kit both u8l5.js and u8l6.js use (so this file loads first): codes for both
 * lessons, solution sets (copied from the Unit 8 assessment kit), number lines, shaded regions bounded by one or two
 * curves, the choose-the-graph builder, "y alone" answers, rounded and exact (surd) solution sets and an exact-set keypad.
 * The Unit 8 assessment kit HW.u8assess (js/lessons/u8test.js: setPart, ineqPart, pairsPart and the builders B.*) is used
 * only inside generators, because u8test.js loads after the lesson files. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, KP = K.P, P = HW.poly, ex = HW.ex, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
  if (!P || !K.valueSet || !HW.sets || !HW.graph) throw new Error('js/lessons/u8l5.js needs js/poly.js and js/relfn.js');
  var INF = Infinity, U = HW.u8k56 = {};
  function AK() { var a = HW.u8assess; if (!a) throw new Error('u8l5–6 practice needs js/lessons/u8test.js (HW.u8assess)'); return a; }
  U.AK = AK;

  /* ---------- codes for both lessons (labels as in the Unit 8 assessment kit), then the lessons' own ---------- */
  (function () {
    var BASE = {
      'pt-row': ['Misjudged whether a point is a solution', 'b'], 'pt-boundary': ['A point on the boundary: included/excluded wrong', 's'],
      'reg-side': ['Inequality the wrong way (wrong side shaded)', 'b'], 'reg-strict': ['Solid/dashed boundary wrong (≤ vs <)', 's'],
      'reg-rev': ['Did not reverse the sign when dividing by a negative', 'b'], 'reg-bound': ['Wrong boundary', 'n'], 'reg-a': ['Boundary parabola: did not solve for a', 'b'],
      'arch-half': ['Arch: used the whole width instead of half', 'b'],
      'root-sign': ['Roots with the wrong signs (factoring sign slip)', 'b'], 'sys-y': ['Right x-values, wrong y-values', 's'], 'sys-missing': ['Missed a solution of the system', 'b'],
      'sys-extra': ['An extra pair that is not a solution', 'b'], 'pair-flip': ['Ordered pairs written (y, x)', 's'], 'nosol-claim': ['Said “no solution” when the graphs meet', 'n'],
      'none-missed': ['Gave solutions for a system with none', 'n'], 'inf-claim': ['Said “infinitely many” for different graphs', 'n'], 'inf-missed': ['Missed that the equations are the same graph', 'n'],
      'double-root': ['Treated a double root as two roots', 'b'],
      'ineq-incl': ['Roots included/excluded wrong', 's'], 'ineq-side': ['Between the roots instead of outside (or the reverse)', 'b'], 'ineq-rev': ['Multiplied by a negative without reversing the sign', 'b'],
      'ineq-roots': ['Roots with the wrong signs', 'b'], 'ineq-case': ['Case analysis: only the case with both factors positive', 'b'], 'ineq-and': ['Joined the two pieces with “and”', 'b'],
      'ineq-none': ['Said “no solution” when there are solutions', 'n'], 'ineq-claim': ['Gave solutions when there are none', 'n'], 'ineq-all': ['Said all real numbers', 'n'],
      'ineq-sq': ['A perfect square: confused x ≠ h, x = h, all real numbers and no solution', 'b'], 'ineq-restr': ['Ignored the restriction of the context', 's'],
      'ineq-sqrt': ['Took the square root and lost the negative side', 'b'], 'ineq-half': ['Gave only one of the two intervals', 'b'], 'count-ends': ['Counted the integers with the endpoints wrong', 's'],
      'k-tangent': ['Gave only the values that make the discriminant zero', 'b'], 'ctx-round': ['Whole numbers: rounded the wrong way', 's'],
      'one-root': ['Only one of the two values right', 's'], 'yes-no': ['Right height, wrong yes/no decision', 's'], 'height': ['Height under the curve worked out wrong', 'b']
    };
    var codes = {}, part = {};
    Object.keys(BASE).forEach(function (k) { ['u8l5-', 'u8l6-'].forEach(function (cp) { codes[cp + k] = BASE[k][0]; if (BASE[k][1]) part[cp + k] = BASE[k][1]; }); });
    codes['u8l5-a-zero'] = 'Values of a: left out a ≠ 0 (the inequality must stay quadratic)'; part['u8l5-a-zero'] = 's';
    codes['u8l5-a-dir'] = 'Values of a: inequality the wrong way'; part['u8l5-a-dir'] = 'b';
    codes['u8l5-land-half'] = 'Gave where the stream is highest, not where it lands'; part['u8l5-land-half'] = 'b';
    codes['u8l5-abc-sign'] = 'a + b + c: worked out a − b + c (the value at x = −1)'; part['u8l5-abc-sign'] = 's';
    codes['u8l5-abc-a'] = 'a + b + c: gave only a'; part['u8l5-abc-a'] = 'b';
    codes['u8l5-k-bound'] = 'Whole-number k: took the boundary value'; part['u8l5-k-bound'] = 's';
    codes['u8l5-lattice'] = 'Counted the integer points with an endpoint wrong'; part['u8l5-lattice'] = 's';
    codes['u8l6-b-sign'] = 'Unknown coefficient from the roots: sign wrong'; part['u8l6-b-sign'] = 'b';
    codes['u8l6-consec'] = 'Consecutive integers: an end value wrong or missing'; part['u8l6-consec'] = 's';
    codes['u8l6-k-equal'] = 'Equal roots: gave only one of the two values'; part['u8l6-k-equal'] = 's';
    codes['u8l6-line'] = 'Compared with the x-axis instead of the given line'; part['u8l6-line'] = 'b';
    ['yalone', 'exact', 'round', 'gen-form', 'pos-lead', 'int-coef', 'unreadable', 'yesno'].forEach(function (k) { codes[k] = codes[k] || { yalone: 'Not written with y alone on the left (format)', exact: 'Decimals instead of exact values (format)', round: 'Not rounded as asked (format)', 'gen-form': 'Not in general form (format)', 'pos-lead': 'Leading coefficient not positive (format)', 'int-coef': 'Coefficients not integers (format)', unreadable: 'Answer could not be read (format)', yesno: 'Yes/no box not answered (format)' }[k]; });
    HW.addCodes(codes); HW.addPartial(part);
  })();

  /* ---------- small tools ---------- */
  function pickWhere(gen, test) { for (var i = 0; i < 8000; i++) { var o = gen(); if (o && test(o)) return o; } throw new Error('u8l5–6 practice: no instance found'); }
  function nz(r, lo, hi) { return (r.chance(0.5) ? -1 : 1) * r.int(lo, hi); }
  function R(x) { return Array.isArray(x) ? ex.norm(x[0], x[1]) : [x, 1]; }
  function rv(x) { x = R(x); return x[0] / x[1]; }
  function fr(p, q) { return ex.texRat(ex.norm(p, q == null ? 1 : q)); }
  function toFr(x) { for (var q = 1; q <= 64; q++) { var p = Math.round(x * q); if (Math.abs(p / q - x) < 1e-9) return [p, q]; } return null; }
  function vt(x) { var f = toFr(x); return f ? fr(f[0], f[1]) : String(Math.round(x * 1000) / 1000); }
  function dt(x) { return String(Math.round(x * 1e6) / 1e6); }
  function M(c, v, e) { if (!e) return P.num(c); var o = {}; o[v] = e; return P.mono(c, o); }
  function quad(a, b, c, v) { return P.add(M(a, v || 'x', 2), M(b, v || 'x', 1), P.num(c)); }
  function lin(m, k, v) { return P.add(M(m, v || 'x', 1), P.num(k)); }
  function Y() { return M(1, 'y', 1); }
  function tx(p) { var s = P.tex(p); return s === '' ? '0' : s; }
  function txd(p) { var s = P.tex(p, { dec: true }); return s === '' ? '0' : s; }
  function br(p) { return '(' + tx(p) + ')'; }
  function par(n) { return n < 0 ? '(' + vt(n) + ')' : vt(n); }
  function at(p, x) { return P.at(p, { x: x }); }
  function coefT(c) { return c === 1 ? '' : c === -1 ? '-' : vt(c); }
  function near(a, b, tol) { return a === b || Math.abs(a - b) < (tol || 1e-9); }
  function ptT(x, y) { return '(' + vt(x) + ',\\ ' + vt(y) + ')'; }
  function sgn(n) { return n < 0 ? '-' + vt(-n) : '+' + vt(n); }
  function cof(p) { return [rv(P.coef(p, { x: 2 })), rv(P.coef(p, { x: 1 })), rv(P.constant(p))]; }
  function keyOf(p) { return cof(p).map(function (c) { return String(Math.round(c * 1000) / 1000); }).join(','); }
  function exclude(list) { var o = {}; list.forEach(function (c) { o[c.map(function (x) { return String(Math.round(x * 1000) / 1000); }).join(',')] = 1; }); return function (p) { return !o[keyOf(p)]; }; }
  var OPS = { lt: '<', le: '\\le ', gt: '>', ge: '\\ge ' }, FLIP = { lt: 'gt', le: 'ge', gt: 'lt', ge: 'le' }, TOG = { lt: 'le', le: 'lt', gt: 'ge', ge: 'gt' };
  function strictOp(o) { return o === 'lt' || o === 'gt'; }
  function upOp(o) { return o === 'gt' || o === 'ge'; }
  function holds(v, op) { return op === 'lt' ? v < -1e-12 : op === 'le' ? v <= 1e-12 : op === 'gt' ? v > 1e-12 : v >= -1e-12; }
  function fig(svg) { return '<div class="fig">' + svg + '</div>'; }
  /* a·(x − r1)(x − r2) with integer brackets (r1, r2 rationals); a double root gives (…)² (as in the assessment kit) */
  function facT(A, r1, r2, v) {
    v = v || 'x'; r1 = R(r1); r2 = R(r2);
    var c0 = ex.norm(R(A)[0], R(A)[1] * r1[1] * r2[1]), cT = c0[1] === 1 && Math.abs(c0[0]) === 1 ? (c0[0] < 0 ? '-' : '') : fr(c0[0], c0[1]);
    var f1 = br(lin(r1[1], -r1[0], v)), f2 = br(lin(r2[1], -r2[0], v));
    if (r1[0] === 0) f1 = v; if (r2[0] === 0 && r1[0] !== 0) f2 = v;
    if (r1[0] * r2[1] === r2[0] * r1[1]) return cT + f1 + '^{2}';
    return r2[0] === 0 && r1[0] !== 0 ? cT + f2 + f1 : cT + f1 + f2;
  }
  /* finish a part: drop `bad` answers that happen to be right for these numbers */
  function fin(p) { p.bad = (p.bad || []).filter(function (b) { try { return p.check(b).v !== 'correct'; } catch (e) { return false; } }); return p; }
  function mcPart(r, prompt, opts, sol, hints, text, keep) {
    var seen = {}; opts.forEach(function (o) { if (seen[o.html]) throw new Error('u8k56 mc: two options read the same: ' + o.html); seen[o.html] = 1; });
    return KP.mc(r, prompt, opts, sol, hints, text, keep);
  }
  function yesNo(r, prompt, yes, whyNo, whyYes, sol, hints, text) {
    var p = KP.mc(r, prompt, [{ html: '<b>Yes</b>', right: !!yes, why: yes ? null : whyYes, code: 'yes' }, { html: '<b>No</b>', right: !yes, why: yes ? whyNo : null, code: 'no' }], sol, hints, text, true);
    p.tries = 1; p.input.columns = 2; return p;
  }
  Object.assign(U, { pickWhere: pickWhere, nz: nz, R: R, rv: rv, fr: fr, vt: vt, dt: dt, M: M, quad: quad, lin: lin, Y: Y, tx: tx, txd: txd, br: br, par: par, at: at, coefT: coefT, near: near, ptT: ptT, sgn: sgn,
    cof: cof, exclude: exclude, OPS: OPS, FLIP: FLIP, TOG: TOG, strictOp: strictOp, upOp: upOp, holds: holds, fig: fig, facT: facT, fin: fin, mcPart: mcPart, yesNo: yesNo });

  /* ======================================================================================================
   * Solution sets (parts { lo, hi, lc, hc }; ±Infinity for unbounded) — as in the assessment kit
   * ====================================================================================================== */
  function sIv(lo, hi, lc, hc) { return { lo: lo, hi: hi, lc: lo === -INF ? false : !!lc, hc: hi === INF ? false : !!hc }; }
  var SET = {
    between: function (a, b, inc) { return [sIv(a, b, inc, inc)]; },
    outside: function (a, b, inc) { return [sIv(-INF, a, false, inc), sIv(b, INF, inc, false)]; },
    below: function (a, inc) { return [sIv(-INF, a, false, inc)]; }, above: function (a, inc) { return [sIv(a, INF, inc, false)]; },
    ne: function (h) { return [sIv(-INF, h, false, false), sIv(h, INF, false, false)]; }, pt: function (h) { return [sIv(h, h, true, true)]; },
    all: function () { return [sIv(-INF, INF, false, false)]; }, none: function () { return []; }
  };
  /* the solution of A(v − r1)(v − r2) op 0 (r1 ≤ r2) */
  function quadSet(A, r1, r2, op) {
    var pos = A > 0 ? upOp(op) : !upOp(op), inc = !strictOp(op);
    if (near(r1, r2)) { if (pos) return inc ? SET.all() : SET.ne(r1); return inc ? SET.pt(r1) : SET.none(); }
    return pos ? SET.outside(r1, r2, inc) : SET.between(r1, r2, inc);
  }
  function sortP(a) { return a.slice().sort(function (x, y) { return x.lo - y.lo || x.hi - y.hi; }); }
  function partsEq(A, B, tol, ends) {
    if (A.length !== B.length) return false;
    var a = sortP(A), b = sortP(B);
    return a.every(function (p, i) { var q = b[i]; return near(p.lo, q.lo, tol) && near(p.hi, q.hi, tol) && (ends || (p.lc === q.lc && p.hc === q.hc)); });
  }
  function complement(parts) {
    var s = sortP(parts), out = [], lo = -INF, lc = false;
    s.forEach(function (p) { if (lo < p.lo || (lo === p.lo && lc && !p.lc && lo !== -INF)) out.push(sIv(lo, p.lo, lc, !p.lc)); lo = p.hi; lc = !p.hc; });
    if (lo < INF) out.push(sIv(lo, INF, lc, false));
    return out;
  }
  function isAll(A) { return A.length === 1 && A[0].lo === -INF && A[0].hi === INF; }
  /* et(x): LaTeX for an endpoint (default: exact fraction) */
  function setTex(parts, v, et) {
    v = v || 'x'; et = et || vt;
    var E = function (x) { return x === INF ? '\\infty' : x === -INF ? '-\\infty' : et(x); };
    if (!parts.length) return '\\text{no solution}';
    if (isAll(parts)) return '\\{' + v + '\\mid ' + v + '\\in\\mathbb{R}\\}';
    var s = sortP(parts);
    if (s.length === 2 && s[0].lo === -INF && s[1].hi === INF && s[0].hi === s[1].lo && !s[0].hc && !s[1].lc) return '\\{' + v + '\\mid ' + v + '\\ne ' + E(s[0].hi) + ',\\ ' + v + '\\in\\mathbb{R}\\}';
    if (s.length === 1 && s[0].lo === s[0].hi) return '\\{' + v + '\\mid ' + v + '=' + E(s[0].lo) + '\\}';
    var cond = s.map(function (p) {
      if (p.lo === -INF) return v + (p.hc ? '\\le ' : '<') + E(p.hi);
      if (p.hi === INF) return v + (p.lc ? '\\ge ' : '>') + E(p.lo);
      return E(p.lo) + (p.lc ? '\\le ' : '<') + v + (p.hc ? '\\le ' : '<') + E(p.hi);
    });
    return '\\{' + v + '\\mid ' + cond.join('\\text{ or }') + ',\\ ' + v + '\\in\\mathbb{R}\\}';
  }
  /* a number line showing the parts */
  function nlSvg(parts) {
    if (!HW.draw || !HW.draw.numlineSvg) return '';
    var ends = []; parts.forEach(function (p) { if (isFinite(p.lo)) ends.push(p.lo); if (isFinite(p.hi)) ends.push(p.hi); });
    var lo = ends.length ? Math.floor(Math.min.apply(null, ends)) - 2 : -5, hi = ends.length ? Math.ceil(Math.max.apply(null, ends)) + 2 : 5;
    if (hi - lo < 6) { lo -= Math.ceil((6 - (hi - lo)) / 2); hi = lo + 6 > hi ? lo + 6 : hi; }
    var I = { min: lo, max: hi, step: 1, labels: hi - lo > 16 ? 2 : 1 };
    return HW.draw.numlineSvg(I, HW.draw.numlineKey(parts));
  }
  function testLine(E, a, b, op, v) {
    v = v || 'x';
    var tps = [Math.floor(a) - 1, near(a, b) ? null : (Math.floor(a) + 1 <= b - 1e-9 && Math.floor(a) + 1 > a + 1e-9 ? Math.floor(a) + 1 : (a + b) / 2), Math.ceil(b) + 1].filter(function (x) { return x != null; });
    return 'Test ' + tps.map(function (x) { var val = at(E, x); return t(v + '=' + vt(x)) + ': ' + t(vt(val)) + (holds(val, op) ? ' ✓' : ' ✗'); }).join('; ') + '.';
  }
  Object.assign(U, { sIv: sIv, SET: SET, quadSet: quadSet, partsEq: partsEq, complement: complement, setTex: setTex, nlSvg: nlSvg, testLine: testLine });

  /* the plain text of a typed answer, and "or" typed as letters */
  function plain(resp) { return String(resp == null ? '' : resp).replace(/\\(text|mathrm|textrm|operatorname)\{([^{}]*)\}/g, ' $2 ').replace(/\\left|\\right/g, '').replace(/\\[,;: !]|~/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase(); }
  function orFix(s) { return String(s == null ? '' : s).replace(/\\(operatorname|mathrm|textrm|text)\{\s*(or|and)\s*\}/g, ' $2 ').replace(/([0-9}\)\]])\s*(or|and)\s*(?=[a-zA-Z\\(\[\-])/g, '$1 $2 '); }

  /* a rounded solution set (calculator, nearest tenth): exact roots r1 < r2 of A(x − r1)(x − r2) */
  U.roundSetPart = function (cp, prompt, A, r1, r2, op, o, sol, hints, text) {
    o = o || {};
    var dp = o.dp == null ? 1 : o.dp, rd = function (x) { return K.roundTo(x, dp); };
    var T = quadSet(A, rd(r1), rd(r2), op), Tx = quadSet(A, r1, r2, op);
    var p = AK().setPart(cp, prompt, T, { v: o.v, wrongs: o.wrongs, rev: o.rev, sideHint: o.sideHint }, sol, hints, text);
    var base = p.check;
    p.check = function (resp) {
      var res = base(resp); if (res.v === 'correct') return res;
      var pr = HW.sets.parse(orFix(resp));
      if (pr.ok && pr.set.kind !== 'list') {
        var A2 = pr.set.parts.map(function (q) { return sIv(q.lo, q.hi, q.lc, q.hc); });
        if (partsEq(A2, Tx, 0.06 * Math.pow(10, 1 - dp))) return form('round', 'Right — now round each endpoint to the nearest ' + (dp === 1 ? 'tenth' : 'hundredth') + '.');
      }
      return res;
    };
    return p;
  };

  /* an exact solution set whose endpoints may be surds: "3 − √7 < x < 3 + √7", "x ≤ a or x ≥ b", set notation */
  var OPT = /\\leqslant|\\geqslant|\\leq|\\geq|\\le(?![a-zA-Z])|\\ge(?![a-zA-Z])|\\lt(?![a-zA-Z])|\\gt(?![a-zA-Z])|<=|>=|≤|≥|<|>/g;
  function opOf(s) { return /le|<=|≤/.test(s) ? 'le' : /ge|>=|≥/.test(s) ? 'ge' : /lt|</.test(s) ? 'lt' : 'gt'; }
  function valOf(s) {
    s = s.trim(); if (!s) return null;
    var q = ex.parse(s.replace(/√\s*(\d+)/g, '\\sqrt{$1}')); if (!q.ok) return null;
    var v = ex.value(q.ast); return isFinite(v) ? v : null;
  }
  function readExactSet(resp, V) {
    var s = orFix(resp).replace(/\\left|\\right/g, '').replace(/\\[,;: !]|~/g, ' ').trim();
    s = s.replace(/^\\\{|^\\lbrace|^\{/, '').replace(/\\\}$|\\rbrace$|\}$/, '').trim();
    var mid = s.split(/\\mid|\|/); if (mid.length === 2 && mid[0].trim() === V) s = mid[1];
    s = s.replace(new RegExp(',?\\s*' + V + '\\s*(\\\\in|∈|in)\\s*(\\\\mathbb\\{R\\}|ℝ|R)\\s*$'), '').trim();
    if (!s) return { why: 'empty' };
    var pieces = s.split(/\s*\bor\b\s*/), parts = [];
    for (var i = 0; i < pieces.length; i++) {
      var pc = pieces[i], m, ops = [], idx = []; OPT.lastIndex = 0;
      while ((m = OPT.exec(pc))) { ops.push(opOf(m[0])); idx.push([m.index, m[0].length]); }
      if (!ops.length || ops.length > 2) return { why: 'unreadable' };
      var terms = [], last = 0; idx.forEach(function (q) { terms.push(pc.slice(last, q[0]).trim()); last = q[0] + q[1]; }); terms.push(pc.slice(last).trim());
      if (ops.length === 1) {
        if (terms[0] === V) { var v1 = valOf(terms[1]); if (v1 == null) return { why: 'unreadable' }; parts.push(ops[0] === 'lt' || ops[0] === 'le' ? sIv(-INF, v1, false, ops[0] === 'le') : sIv(v1, INF, ops[0] === 'ge', false)); }
        else if (terms[1] === V) { var v0 = valOf(terms[0]); if (v0 == null) return { why: 'unreadable' }; parts.push(ops[0] === 'gt' || ops[0] === 'ge' ? sIv(-INF, v0, false, ops[0] === 'ge') : sIv(v0, INF, ops[0] === 'le', false)); }
        else return { why: 'unreadable' };
      } else {
        if (terms[1] !== V) return { why: 'unreadable' };
        var a = valOf(terms[0]), b = valOf(terms[2]); if (a == null || b == null) return { why: 'unreadable' };
        if ((ops[0] === 'lt' || ops[0] === 'le') && (ops[1] === 'lt' || ops[1] === 'le')) { if (a > b) return { why: 'backwards' }; parts.push(sIv(a, b, ops[0] === 'le', ops[1] === 'le')); }
        else return { why: 'backwards' };
      }
    }
    return { ok: true, parts: parts, dec: /\d\.\d/.test(s) };
  }
  U.exactSetPart = function (cp, prompt, T, keyTex, o, sol, hints, text) {
    o = o || {};
    var V = o.v || 'x', comp = complement(T);
    var check = function (resp) {
      if (!String(resp == null ? '' : resp).trim()) return form('empty', 'Type your answer first.');
      var q = readExactSet(resp, V);
      if (!q.ok) return form(q.why === 'backwards' ? 'unreadable' : q.why === 'empty' ? 'empty' : 'unreadable', q.why === 'backwards' ? 'Write the smaller number first, e.g. ' + t('3-\\sqrt{7}<' + V + '<3+\\sqrt{7}') + '.' : 'Write the solution like ' + t(V + '\\le 3-2\\sqrt{2}\\text{ or }' + V + '\\ge 3+2\\sqrt{2}') + ' (use √ for exact values).');
      if (partsEq(q.parts, T, 1e-7)) return q.dec ? form('exact', 'Those are decimal approximations. Give the exact values (use ' + t('\\sqrt{\\ }') + ').') : ok();
      if (partsEq(q.parts, T, 0.006)) return form('exact', 'Those are decimal approximations. Give the exact values (use ' + t('\\sqrt{\\ }') + ').');
      if (partsEq(q.parts, T, 1e-7, true)) return wrong(cp + 'ineq-incl', 'Right endpoints: now check whether they are included (' + t('\\le') + ', ' + t('\\ge') + ') or not (' + t('<') + ', ' + t('>') + ').');
      if (comp.length && partsEq(q.parts, comp, 1e-7, true)) return wrong(cp + 'ineq-side', 'Right roots, wrong intervals: test a value from each interval in the original inequality.');
      if (T.length === 2 && q.parts.length === 1 && T.some(function (w) { return partsEq(q.parts, [w], 1e-7, true); })) return wrong(cp + 'ineq-half', 'One piece is right, but the solution has another interval: test a value on the other side of the roots too.');
      return wrong('value', o.valueHint || null);
    };
    var p = KP.math(prompt, check, keyTex, sol, hints, text, { keys: 'u8k56ex', vars: [V], placeholder: 'e.g. 3 - sqrt(7) < ' + V + ' < 3 + sqrt(7)' });
    p.bad = [setTex(comp, V), '\\text{no solution}'];
    return p;
  };

  /* keypad for exact sets (the u8set keys plus √ and +) */
  var W = HW.widgets;
  if (W && W.KEYSETS) {
    var dk = function (n) { return { label: String(n), tex: String(n), plain: String(n) }; };
    var KY = {
      del: { label: '⌫', fn: 'del', title: 'Delete' }, clear: { label: 'clear', fn: 'clear' }, left: { label: '◀', fn: 'left', title: 'Move left' }, right: { label: '▶', fn: 'right', title: 'Move right (out of a box)' },
      enter: { label: 'Check ↵', fn: 'enter', wide: true }, minus: { label: '−', tex: '-', plain: '-' }, plus: { label: '+', tex: '+', plain: '+' }, dot: { label: '.', tex: '.', plain: '.' }, comma: { label: ',', tex: ',', plain: ', ' },
      frac: { label: '<sup>a</sup>⁄<sub>b</sub>', tex: '\\frac{#@}{#?}', plain: '/', title: 'Fraction' }, sqrt: { label: '√', tex: '\\sqrt{#0}', plain: 'sqrt(' },
      le: { label: '≤', tex: '\\le ', plain: ' <= ' }, lt: { label: '<', tex: '<', plain: ' < ' }, ge: { label: '≥', tex: '\\ge ', plain: ' >= ' }, gt: { label: '>', tex: '>', plain: ' > ' },
      or: { label: 'or', tex: '\\text{ or }', plain: ' or ', title: 'or' }, braces: { label: '{ }', tex: '\\left\\lbrace #0\\right\\rbrace', plain: '{', title: 'Braces' }, mid: { label: '|', tex: '\\mid ', plain: ' | ', title: 'such that' },
      inn: { label: '∈', tex: '\\in ', plain: ' in ', title: 'is an element of' }, Rr: { label: 'ℝ', tex: '\\mathbb{R}', plain: 'R', title: 'the real numbers' }
    };
    W.KEYSETS.u8k56ex = function (opt) {
      var vs = (opt && opt.vars && opt.vars.length ? opt.vars : ['x']).slice(0, 1).map(function (v) { return { label: '<i>' + v + '</i>', tex: v, plain: v }; });
      return [[dk(7), dk(8), dk(9), KY.lt, KY.le, KY.del], [dk(4), dk(5), dk(6), KY.gt, KY.ge, KY.clear], [dk(1), dk(2), dk(3), KY.plus, KY.minus, KY.sqrt],
        [dk(0), KY.dot, KY.frac, KY.or, KY.left, KY.right], vs.concat([KY.braces, KY.mid, KY.comma, KY.inn, KY.Rr, KY.enter])];
    };
    if (W.KEYHELP) W.KEYHELP.u8k56ex = ['Type the solution with exact values, e.g. ' + HW.k('3-\\sqrt{7}<x<3+\\sqrt{7}') + ' or ' + HW.k('x\\le\\frac{-3-\\sqrt{29}}{2}\\text{ or }x\\ge\\frac{-3+\\sqrt{29}}{2}') + '. Press <b>▶</b> to step out of a root or a fraction.', 'Type e.g. <code>3 - sqrt(7) &lt; x &lt; 3 + sqrt(7)</code> or <code>x &lt;= 1 - sqrt(2) or x &gt;= 1 + sqrt(2)</code>.'];
  }

  /* ======================================================================================================
   * Regions and graphs
   * ====================================================================================================== */
  /* g: { x, y, curves: [{ f, dash }], shade: [{ f, side: 'above'|'below' }] (the region on those sides of all of them), points, max } */
  function regSvg(g) {
    var spec = { x: g.x || [-6, 6], y: g.y || [-6, 6], grid: 1, labels: g.labels || 2, max: g.max || 260, unit: g.unit, aria: g.aria || 'graph',
      fns: (g.curves || []).map(function (c) { return { f: c.f, dash: c.dash, color: c.color }; }), points: g.points || [] };
    var svg = HW.graph(spec), L = HW.graph.last;
    if (g.shade && g.shade.length) {
      var xr = L.xr, yr = L.yr, n = 160, polys = [], cur = null;
      for (var i = 0; i <= n; i++) {
        var x = xr[0] + (xr[1] - xr[0]) * i / n, lo = yr[0], hi = yr[1];
        g.shade.forEach(function (c) { var v = c.f(x); if (c.side === 'above') lo = Math.max(lo, v); else hi = Math.min(hi, v); });
        lo = Math.max(yr[0], Math.min(yr[1], lo)); hi = Math.max(yr[0], Math.min(yr[1], hi));
        if (hi > lo + 1e-9) { if (!cur) { cur = { up: [], dn: [] }; polys.push(cur); } cur.up.push([x, hi]); cur.dn.push([x, lo]); } else cur = null;
      }
      var poly = polys.map(function (pc) { var pts = pc.up.concat(pc.dn.reverse()); return '<polygon points="' + pts.map(function (q) { return L.X(q[0]).toFixed(1) + ',' + L.Y(q[1]).toFixed(1); }).join(' ') + '" fill="#2b55a0" fill-opacity="0.17" stroke="none"/>'; }).join('');
      svg = svg.replace('fill="#fff"/>', 'fill="#fff"/>' + poly);
    }
    return svg;
  }
  U.regSvg = regSvg;
  /* a window for the parabola with vertex (h, k) */
  function winFor(f, h, o) {
    o = o || {};
    var x0 = Math.min(-1, Math.floor(h - 5)), x1 = Math.max(1, Math.ceil(h + 5)), vy = f(h), up = f(h + 1) > vy, lo, hi;
    if (o.x) { x0 = o.x[0]; x1 = o.x[1]; }
    if (up) { lo = Math.min(-2, 2 * Math.floor((vy - 1) / 2)); hi = Math.max(lo + 14, 4); }
    else { hi = Math.max(2, 2 * Math.ceil((vy + 1) / 2)); lo = Math.min(hi - 14, -4); }
    if (o.ys) o.ys.forEach(function (y) { if (y > hi - 1) hi = 2 * Math.ceil((y + 1.5) / 2); if (y < lo + 1) lo = 2 * Math.floor((y - 1.5) / 2); });
    return { x: [x0, x1], y: [lo, hi] };
  }
  U.winFor = winFor;

  /* a parabola y = a(x − r1)(x − r2) (a may be a fraction [p, q]) */
  function para(a, r1, r2) {
    var A = R(a), Q = P.scale(P.mul(lin(1, -r1), lin(1, -r2)), A), h = (r1 + r2) / 2, f = function (x) { return at(Q, x); };
    return { A: A, a: rv(A), r1: r1, r2: r2, Q: Q, f: f, h: h, k: f(h), c: f(0) };
  }
  /* from vertex form y = a(x − h)² + k (any a, h, k) */
  function paraV(a, h, k) {
    var A = R(a), Q = P.add(P.scale(P.pow(lin(1, -h), 2), A), P.num(k)), f = function (x) { return at(Q, x); }, d = -k / rv(A);
    var o = { A: A, a: rv(A), Q: Q, f: f, h: h, k: k, c: f(0) };
    if (d > 0) { o.r1 = h - Math.sqrt(d); o.r2 = h + Math.sqrt(d); }
    return o;
  }
  U.para = para; U.paraV = paraV;
  /* the test point for a parabola: (0, 0) unless it is on it */
  function testPt(info) {
    if (Math.abs(info.c) > 1e-9) return [0, 0];
    if (Math.abs(info.h - Math.round(info.h)) < 1e-9 && Math.abs(info.k) > 1e-9) return [info.h, 0];
    return Math.abs(info.f(1)) > 1e-9 ? [1, 0] : [-1, 0];
  }
  U.testPt = testPt;
  /* the worked solution for graphing y op Q */
  function regionSol(info, op, o) {
    o = o || {};
    var solid = !strictOp(op), above = upOp(op), inside = (info.a > 0) === above, tp = testPt(info), tv = info.f(tp[0]), tr = holds(tp[1] - tv, op);
    var s = (o.pre || '');
    if (info.r1 != null && o.facS !== false) s += (o.facS ? o.facS : 'Factor: ' + t('y=' + facT(info.A, toFr(info.r1) || info.r1, toFr(info.r2) || info.r2))) + ': ' + t('x') + '-intercepts ' + t(vt(info.r1)) + ' and ' + t(vt(info.r2)) + '; ';
    s += 'axis ' + t('x=' + vt(info.h)) + '; vertex ' + t(ptT(info.h, info.k)) + '; ' + t('y') + '-intercept ' + t(vt(info.c)) + '.<br>';
    s += (solid ? 'Solid' : 'Dashed') + ' (the sign is ' + t(OPS[op].trim()) + '). ';
    if (tp[0] !== 0 || tp[1] !== 0) s += t('(0,\\ 0)') + ' is on the parabola, so test ' + t(ptT(tp[0], tp[1])) + ': ';
    else s += 'Test ' + t('(0,\\ 0)') + ': ';
    s += t(vt(tp[1]) + OPS[op] + vt(tv)) + ' is ' + (tr ? 'true' : 'false') + '.<br>Shade the side ' + (tr ? 'with' : 'without') + ' the test point: <b>' + (above ? 'above' : 'below') + '</b> (' + (inside ? 'inside' : 'outside') + ') the parabola.';
    return s;
  }
  U.regionSol = regionSol;

  /* choose the graph of y op f. o: { win, wrongF (another boundary drawn in the right style), boundWhy, revd, pre, facS, sol } */
  U.graphMC = function (r, prompt, info, op, o) {
    o = o || {};
    var solid = !strictOp(op), above = upOp(op), f = info.f, wf = o.wrongF || (Math.abs(info.h) > 1e-9 ? function (x) { return f(-x); } : function (x) { return -f(x); });
    var wn = o.win || winFor(f, info.h, { ys: [info.c] }), tp = testPt(info);
    var draw = function (ff, sd, ab, aria) { return regSvg({ x: wn.x, y: wn.y, max: 200, curves: [{ f: ff, dash: !sd }], shade: [{ f: ff, side: ab ? 'above' : 'below' }], aria: aria }); };
    var opts = [
      { html: draw(f, solid, above, 'graph A'), right: true, code: 'right' },
      { html: draw(f, solid, !above, 'graph B'), code: 'side', why: o.revd ? 'Dividing (or multiplying) by a negative number reverses the inequality sign: that is the other side.' : 'Wrong side: test a point such as ' + t(ptT(tp[0], tp[1])) + ' in the inequality.' },
      { html: draw(f, !solid, above, 'graph C'), code: 'line', why: solid ? t('\\le') + ' or ' + t('\\ge') + ': the boundary is solid.' : t('<') + ' or ' + t('>') + ': the boundary is dashed.' },
      { html: draw(wf, solid, above, 'graph D'), code: 'bound', why: o.boundWhy || 'Check the boundary: find its intercepts and vertex' + (info.r1 != null ? ' (the ' + t('x') + '-intercepts are ' + t(vt(info.r1)) + ' and ' + t(vt(info.r2)) + ')' : '') + '.' }
    ];
    var p = mcPart(r, prompt, opts, o.sol || regionSol(info, op, { pre: o.pre, facS: o.facS }), o.hints || ['Graph the boundary: find the ' + t('x') + '-intercepts, the vertex and the ' + t('y') + '-intercept. Solid for ' + t('\\le') + ', ' + t('\\ge') + '; dashed for ' + t('<') + ', ' + t('>') + '.', 'Test a point that is not on the parabola: shade its side if it makes the inequality true.'], o.text || 'graph a quadratic inequality');
    p.input.columns = 2;
    return p;
  };

  /* a typed inequality that must have y alone on the left. T: the target's L − R as y − f; o as ineqPart's, plus o.general */
  var YALONE = /^\s*y\s*(\\leqslant|\\geqslant|\\leq|\\geq|\\le(?![a-zA-Z])|\\ge(?![a-zA-Z])|\\lt(?![a-zA-Z])|\\gt(?![a-zA-Z])|<=|>=|≤|≥|<|>)/;
  U.yAlonePart = function (cp, prompt, f, op, o, sol, hints, text) {
    o = o || {};
    var keyTex = 'y' + OPS[op] + (o.keyRhs || tx(f));
    var p = AK().ineqPart(cp, prompt, P.sub(Y(), f), op, keyTex, Object.assign({ ph: 'y > x^2 - 4', example: 'y>x^{2}-4' }, o), sol, hints, text);
    var base = p.check;
    p.check = function (resp) {
      var res = base(resp); if (res.v !== 'correct') return res;
      var s = String(resp).replace(/\\left|\\right/g, '').replace(/\\[,;: !]|~/g, ' ');
      var m = YALONE.exec(s);
      if (!m || /y/.test(s.slice(m.index + m[0].length))) return form('yalone', 'Right — now write it with ' + t('y') + ' alone on the left, like ' + t('y\\le\\dots') + '.');
      return ok();
    };
    p.bad = (p.bad || []).concat([o.orig ? o.orig : null]).filter(Boolean);
    return p;
  };

  /* ======================================================================================================
   * Lesson 5 practice
   * ====================================================================================================== */
  var CP = 'u8l5-', LID = 'u8l5';
  /* the boundaries of the lesson's examples and of the booklet's questions (assignment and extra practice) */
  var FRESH = exclude([[1, -2, -3], [1, -6, 5], [-1, -2, 8], [2, -4, -6], [-0.5, 1, 4], [1, -4, 3], [1, -4, 0], [-1, -3, 2], [1, -4, 1], [-2, -4, 6], [-1, 2, 6], [-0.375, 0, 6],
    [2, -5, 1], [1, 0, -7], [-3, 1, 0], [-1, 0, -2], [1, -2, -8], [-1, 6, -5], [-1, 0, 9], [1, 4, -5], [-0.5, -1, 1.5], [1, 4, 0], [1, 1, -12], [1, 2, -3], [3, 5, 0], [1, 0, -4], [-1, 4, 5],
    [2, 12, 16], [-2, 5, 3], [1, -3, -2], [-0.4, 2, 0], [-1, 0, 5], [2, -4, -1], [-1, 3, 4], [-1, 0, 2], [1, -5, 10], [-1, 4, 3],
    [-1, 4, 1], [2, 0, 5], [3, 0, -6], [-2, 0, 1], [1, -4, -5], [-1, 2, 3], [2, -8, 0], [0.5, -1, -4], [-0.2, 0, 5], [-1, 0, 4], [-1, 3, 15], [-2, 12, -10]]);
  function anyOp(r) { return r.pick(['lt', 'le', 'gt', 'ge']); }
  function showY(op, rhs) { return 'y' + OPS[op] + rhs; }
  function graphPrompt(show) { return 'Graph the solution region of ' + t(show) + ': which graph shows it?'; }

  /* a parabola with integer roots: a = 1 or −1 (general form), |vertex| and |y-intercept| small */
  function intPara(r, aList, o) {
    o = o || {};
    return pickWhere(function () { var a = r.pick(aList), r1 = r.int(-6, 5), w = r.int(2, 8); return para(a, r1, r1 + w); }, function (q) {
      return q.r2 <= 7 && Math.abs(q.k) <= (o.kmax || 10) && Math.abs(q.c) <= 12 && (o.zero ? Math.abs(q.c) < 1e-9 : (Math.abs(q.r1) > 0 && Math.abs(q.r2) > 0)) && FRESH(q.Q) && (!o.test || o.test(q));
    });
  }

  /* Q2 a–b: y already alone — solid/dashed and above/below (MC) */
  function sideMC(r, show, op, sol0) {
    var solid = !strictOp(op), above = upOp(op);
    var opts = [[true, true], [true, false], [false, true], [false, false]].map(function (q) {
      var right = q[0] === solid && q[1] === above;
      return { html: (q[0] ? 'Solid' : 'Dashed') + ' boundary; the region ' + (q[1] ? 'above' : 'below') + ' the parabola', right: right, code: (q[0] ? 's' : 'd') + (q[1] ? 'a' : 'b'),
        why: right ? null : q[0] !== solid ? t('\\le') + ' and ' + t('\\ge') + ' give a solid boundary (points on it are solutions); ' + t('<') + ' and ' + t('>') + ' a dashed one.' : 'With ' + t('y') + ' alone on the left, ' + t('>') + ' or ' + t('\\ge') + ' is the region above the parabola, ' + t('<') + ' or ' + t('\\le') + ' below it.' };
    });
    return mcPart(r, 'For ' + t(show) + ', state whether the boundary is solid or dashed and whether the solution region is above or below the parabola.', opts,
      (sol0 || '') + (solid ? 'Solid' : 'Dashed') + ' boundary (' + t(OPS[op].trim()) + ' ' + (solid ? 'includes' : 'does not include') + ' the points on the parabola). With ' + t('y') + ' alone on the left, ' + t(OPS[op].trim()) + ' means the region <b>' + (above ? 'above' : 'below') + '</b> the parabola.',
      ['Solid for ' + t('\\le') + ', ' + t('\\ge') + '; dashed for ' + t('<') + ', ' + t('>') + '.', t('y>\\dots') + ' or ' + t('y\\ge\\dots') + ': above; ' + t('y<\\dots') + ' or ' + t('y\\le\\dots') + ': below.'], 'boundary and side', true);
  }

  /* typed "y alone" (Q2c, Q2d, EP A2a, A2c). kind: 'add' (y ± k op (x − h)²), 'neg' (−y op …), 'sub' (y − k op a x²), 'div' (c − m y op …) */
  function yAloneQ(r, kind) {
    var s, f, show, op = anyOp(r), opS, sol, rev = false;
    if (kind === 'add') {
      s = pickWhere(function () { return { h: r.int(-4, 4), k: nz(r, 1, 9) }; }, function (z) { return z.h !== 0 && !(z.h === 1 && z.k === 4); });
      f = P.sub(P.pow(lin(1, -s.h), 2), P.num(s.k)); show = 'y' + sgn(s.k) + OPS[op] + br(lin(1, -s.h)) + '^{2}'; opS = op;
      sol = (s.k > 0 ? 'Subtract ' : 'Add ') + t(vt(Math.abs(s.k))) + ' on both sides: ' + t('y' + OPS[op] + br(lin(1, -s.h)) + '^{2}' + sgn(-s.k)) + ' (or ' + t('y' + OPS[op] + tx(f)) + ').';
      var keyR = br(lin(1, -s.h)) + '^{2}' + sgn(-s.k);
      return { f: f, op: op, show: show, sol: sol, keyRhs: keyR, rev: false };
    }
    if (kind === 'neg') {
      s = pickWhere(function () { return { a: r.pick([1, 1, 2, 3, -1, -2]), c: nz(r, 1, 9) }; }, function (z) { return !(z.a === 1 && z.c === 2); });
      var g = quad(s.a, 0, s.c); f = P.neg(g); show = '-y' + OPS[op] + tx(g); opS = FLIP[op]; rev = true;
      sol = 'Multiply both sides by ' + t('-1') + ' and <b>reverse</b> the sign: ' + t('y' + OPS[opS] + tx(f)) + '.';
      return { f: f, op: opS, show: show, sol: sol, rev: rev, orig: 'y' + OPS[op] + tx(f) };
    }
    if (kind === 'sub') {
      s = pickWhere(function () { return { a: r.pick([1, 2, 3, -1, -2, 4]), k: nz(r, 1, 9) }; }, function (z) { return !(z.a === 2 && z.k === 5); });
      f = quad(s.a, 0, s.k); show = 'y' + sgn(-s.k) + OPS[op] + tx(M(s.a, 'x', 2));
      sol = (s.k > 0 ? 'Add ' : 'Subtract ') + t(vt(Math.abs(s.k))) + ' on both sides: ' + t('y' + OPS[op] + tx(f)) + '.';
      return { f: f, op: op, show: show, sol: sol, rev: false };
    }
    // div: c − m·y op m·(a x² + b x + q) shown as c − my op …, or m·a x² − m y op … — divide by −m
    s = pickWhere(function () { return { m: r.pick([2, 3, 4, 5]), a: r.pick([1, 2, -1, -2]), b: r.int(-4, 4), q: nz(r, 1, 6), form: r.pick(['c', 'x']) }; }, function (z) { return !(z.m === 4 && z.a === -2 && z.b === 0 && z.q === 1) && !(z.m === 3 && z.a === -1 && z.q === 2); });
    // form 'c': m·q − m·y op0 m(a x² + b x)  ⇒  −m·y op0 m(a x² + b x) − m·q  ⇒  y op −a x² − b x + q
    // form 'x': m(a x² + b x) − m·y op0 −m·q    ⇒  −m·y op0 −m(a x² + b x + q) ⇒  y op a x² + b x + q      (op0 = FLIP[op])
    var op0 = FLIP[op];
    if (s.form === 'c') {
      f = quad(-s.a, -s.b, s.q); show = vt(s.m * s.q) + '-' + s.m + 'y' + OPS[op0] + tx(quad(s.m * s.a, s.m * s.b, 0));
      sol = 'Subtract ' + t(vt(s.m * s.q)) + ': ' + t('-' + s.m + 'y' + OPS[op0] + tx(quad(s.m * s.a, s.m * s.b, -s.m * s.q))) + '. ';
    } else {
      f = quad(s.a, s.b, s.q); show = tx(quad(s.m * s.a, s.m * s.b, 0)) + '-' + s.m + 'y' + OPS[op0] + vt(-s.m * s.q);
      sol = 'Move the ' + t('x') + '-terms: ' + t('-' + s.m + 'y' + OPS[op0] + tx(quad(-s.m * s.a, -s.m * s.b, -s.m * s.q))) + '. ';
    }
    sol += 'Divide by ' + t(-s.m) + ' and <b>reverse</b> the sign: ' + t('y' + OPS[op] + tx(f)) + '.';
    return { f: f, op: op, show: show, sol: sol, rev: true, orig: 'y' + OPS[op0] + tx(f) };
  }
  function yAlonePartQ(r, kind) {
    var q = yAloneQ(r, kind), solid = !strictOp(q.op), above = upOp(q.op);
    var sol = q.sol + '<br>' + (solid ? 'Solid' : 'Dashed') + ' boundary; the region is <b>' + (above ? 'above' : 'below') + '</b> the parabola.';
    return fin(U.yAlonePart(CP, 'Write ' + t(q.show) + ' with ' + t('y') + ' alone on the left.', q.f, q.op, { keyRhs: q.keyRhs, rev: q.rev, orig: q.orig, sideHint: q.rev ? 'Multiplying or dividing both sides by a negative number <b>reverses</b> the inequality sign.' : null }, sol,
      ['Solve for ' + t('y') + ' as you would solve an equation.', 'Multiplying or dividing by a negative number reverses the sign; adding or subtracting never does.'], 'y alone on the left'));
  }

  /* Q3, Q4, EP A3, B1: choose the graph */
  function g3(r, kind) {
    var info, show, op = anyOp(r), o = {};
    if (kind === 'up' || kind === 'down') {
      info = intPara(r, [kind === 'up' ? 1 : -1]); show = showY(op, tx(info.Q));
      if (kind === 'down') o.facS = 'Factor: ' + t('y=-(' + tx(P.neg(info.Q)) + ')=' + facT(-1, info.r1, info.r2));
    } else if (kind === 'sym') {
      var s = pickWhere(function () { return { a: r.pick([1, 1, 1, 2, -1, -1, -1]), m: r.int(1, 4), cfirst: r.chance(0.7) }; }, function (z) { return z.a * z.m * z.m <= 18 && !(z.a === -1 && z.m === 3) && !(z.a === 1 && z.m === 2); });
      info = para(-s.a, -s.m, s.m); var cc = s.a * s.m * s.m;
      show = showY(op, s.cfirst ? (cc + '-' + coefT(s.a) + 'x^{2}') : tx(info.Q));
      o.facS = 'The boundary ' + t('y=' + tx(info.Q)) + ' crosses the ' + t('x') + '-axis where ' + t(tx(M(s.a, 'x', 2)) + '=' + cc) + ', ' + t('x=\\pm ' + s.m);
      o.wrongF = function (x) { return -info.f(x); }; o.boundWhy = 'That parabola opens the wrong way: the coefficient of ' + t('x^{2}') + ' is ' + t(-s.a) + '.';
    } else if (kind === 'vtx') {
      var v = pickWhere(function () { return { a: r.pick([1, 1, 2, -1, -1, -2]), p: r.int(-4, 4), m: r.int(1, 3) }; }, function (z) { var q = paraV(z.a, z.p, -z.a * z.m * z.m); return z.p !== 0 && Math.abs(z.a * z.m * z.m) <= 12 && Math.abs(q.c) <= 14 && FRESH(q.Q) && !(z.a === -1 && z.p === 1 && z.m === 2); });
      info = para(v.a, v.p - v.m, v.p + v.m); var q0 = -v.a * v.m * v.m;
      show = showY(op, coefT(v.a) + br(lin(1, -v.p)) + '^{2}' + sgn(q0));
      o.facS = 'Vertex ' + t(ptT(v.p, q0)) + ', opens ' + (v.a > 0 ? 'up' : 'down') + '. ' + t('x') + '-intercepts: ' + t(br(lin(1, -v.p)) + '^{2}=' + v.m * v.m) + ', ' + t('x=' + v.p + '\\pm ' + v.m);
      o.wrongF = function (x) { return info.f(x + 2 * v.p); }; o.boundWhy = 'Check the vertex: ' + t(br(lin(1, -v.p)) + '^{2}') + ' is ' + t(0) + ' when ' + t('x=' + v.p) + ', not ' + t(-v.p) + '.';
    } else if (kind === 'fac') {
      var z = pickWhere(function () { var a = r.pick([[1, 2], [-1, 2], [2, 1], [-2, 1], [-1, 2]]), r1 = r.int(-5, 3), w = r.pick([2, 4, 6]); return { a: a, r1: r1, r2: r1 + w }; }, function (q) { var pp = para(q.a, q.r1, q.r2); return q.r2 <= 5 && q.r1 !== 0 && q.r2 !== 0 && Math.abs(pp.k) <= 9 && Math.abs(pp.c) <= 12 && FRESH(pp.Q); });
      info = para(z.a, z.r1, z.r2); show = showY(op, facT(z.a, z.r1, z.r2));
      o.facS = 'The factors give the ' + t('x') + '-intercepts directly';
      o.pre = 'Vertex: ' + t('x=\\frac{' + z.r1 + '+' + par(z.r2) + '}{2}=' + vt(info.h)) + ', ' + t('y=' + vt(info.k)) + '.<br>';
    } else { // zero: c = 0, the origin is on the boundary
      var zz = pickWhere(function () { return { a: r.pick(kind === 'zero2' ? [2, -2, 3, -3] : [1, -1, 1]), b: nz(r, 1, 8) }; }, function (q) { var Qq = quad(q.a, q.b, 0); return (Math.abs(q.b) % 2 === 0 || Math.abs(q.a) !== 1 ? true : false) && q.b % q.a === 0 && Math.abs(q.b * q.b / (4 * q.a)) <= 12 && FRESH(Qq); });
      var rr = [0, -zz.b / zz.a].sort(function (a, b) { return a - b; });
      info = para(zz.a, rr[0], rr[1]); show = showY(op, tx(info.Q));
      o.facS = 'Factor: ' + t('y=' + (Math.abs(zz.a) === 1 ? (zz.a < 0 ? '-' : '') : zz.a) + 'x' + br(lin(1, zz.b / zz.a)));
    }
    return fin(U.graphMC(r, graphPrompt(show), info, op, o));
  }

  /* Q5: rearrange first, then graph */
  function g5(r, kind) {
    var op = anyOp(r), info, show, o = {};
    if (kind === 'add') {
      info = intPara(r, [1], { test: function (q) { return Math.abs(cof(q.Q)[1]) > 0 && Math.abs(q.c) > 0; } });
      var k = -info.c, b = cof(info.Q)[1];
      show = 'y' + sgn(k) + OPS[op] + tx(quad(1, b, 0));
      o.pre = (k > 0 ? 'Subtract ' : 'Add ') + t(vt(Math.abs(k))) + ': ' + t('y' + OPS[op] + tx(info.Q)) + '.<br>';
    } else {
      info = intPara(r, [1], { test: function (q) { return Math.abs(cof(q.Q)[1]) > 0 && Math.abs(q.c) > 0; } });
      var m = r.pick([2, 3]), B = cof(info.Q)[1], C = info.c, op0 = FLIP[op];
      show = tx(P.add(M(m, 'x', 2), M(m * B, 'x', 1), M(-m, 'y', 1))) + OPS[op0] + vt(-m * C);
      o.pre = t('-' + m + 'y' + OPS[op0] + tx(quad(-m, -m * B, -m * C))) + '; divide by ' + t(-m) + ' and <b>reverse</b> the sign: ' + t('y' + OPS[op] + tx(info.Q)) + '.<br>';
      o.revd = true;
    }
    return fin(U.graphMC(r, 'Write ' + t(show) + ' with ' + t('y') + ' alone on the left, then graph its solution region: which graph shows it?', info, op, o));
  }

  /* Q6 (a): why (0, 0) cannot be the test point; (b): what another test point shows */
  function q6shared(r) {
    return pickWhere(function () { return { a: r.pick([1, 2, 3, -1, -2, -3, 4]), b: nz(r, 1, 7), op: anyOp(r) }; }, function (z) { return ex.gcd(Math.abs(z.a), Math.abs(z.b)) === 1 && !(z.a === 3 && z.b === 5) && Math.abs(z.b) !== Math.abs(z.a) && FRESH(quad(z.a, z.b, 0)); });
  }
  function q6a(r, s) {
    var Q = quad(s.a, s.b, 0), show = showY(s.op, tx(Q));
    var opts = [
      { html: t('(0,\\ 0)') + ' is on the boundary: ' + t(coefT(s.a) + '(0)^{2}' + (s.b > 0 ? '+' : '') + coefT(s.b) + '(0)=0') + ', so it is in neither region.', right: true },
      { html: t('(0,\\ 0)') + ' makes the inequality false, so it can never be used.', code: 'false', why: 'A false result is still useful: it means “shade the other side”. The trouble is that ' + t('(0,\\ 0)') + ' is <b>on</b> the parabola.' },
      { html: t('(0,\\ 0)') + ' is the vertex of the parabola.', code: 'vertex', why: 'The vertex is at ' + t('x=' + vt(-s.b / (2 * s.a))) + ', not at the origin. But ' + t('(0,\\ 0)') + ' is <b>on</b> the parabola.' },
      { html: 'The boundary is ' + (strictOp(s.op) ? 'dashed' : 'solid') + ', so the origin cannot be tested.', code: 'line', why: 'Any point off the parabola can be a test point, whatever the boundary style. ' + t('(0,\\ 0)') + ' is <b>on</b> the parabola.' }
    ];
    return fin(mcPart(r, 'Explain why ' + t('(0,\\ 0)') + ' cannot be used as the test point for ' + t(show) + '.', opts,
      'Substitute: ' + t(tx(Q).replace(/x/g, '(0)') + '=0') + ', so ' + t('(0,\\ 0)') + ' is on the boundary. A point on the boundary is in neither region, so it cannot tell us which side to shade.',
      ['What do you get when you substitute ' + t('x=0') + ' into ' + t(tx(Q)) + '?'], 'why not (0, 0)'));
  }
  function q6b(r, s) {
    var Q = quad(s.a, s.b, 0), show = showY(s.op, tx(Q)), xt = at(Q, 1) !== 0 ? 1 : -1, fv = at(Q, xt), truth = holds(0 - fv, s.op);
    var pAbove = 0 > fv, shadeAbove = truth ? pAbove : !pAbove, inside = function (ab) { return (s.a > 0) === ab ? 'inside' : 'outside'; };
    var calc = t('0' + OPS[s.op] + vt(fv));
    var opts = [[true, true], [true, false], [false, true], [false, false]].map(function (q) {
      var right = q[0] === truth && q[1] === shadeAbove;
      return { html: calc + ' is ' + (q[0] ? 'true' : 'false') + ': shade the region ' + (q[1] ? 'above' : 'below') + ' (' + inside(q[1]) + ') the parabola.', right: right, code: (q[0] ? 't' : 'f') + (q[1] ? 'a' : 'b'),
        why: right ? null : q[0] !== truth ? 'Check the substitution: ' + t(tx(Q).replace(/x/g, '(' + xt + ')') + '=' + vt(fv)) + ', and ' + calc + ' is ' + (truth ? 'true' : 'false') + '.' : 'The point ' + t(ptT(xt, 0)) + ' is ' + (pAbove ? 'above' : 'below') + ' the parabola. A true test point is in the shaded region; a false one is not.' };
    });
    var sol = 'Test ' + t(ptT(xt, 0)) + ': ' + t(tx(Q).replace(/x/g, '(' + xt + ')') + '=' + vt(fv)) + ', and ' + calc + ' is ' + (truth ? 'true' : 'false') + '.<br>' + t(ptT(xt, 0)) + ' is ' + (pAbove ? 'above' : 'below') + ' the parabola (the ' + t('x') + '-intercepts are ' + t(vt(Math.min(0, -s.b / s.a))) + ' and ' + t(vt(Math.max(0, -s.b / s.a))) + '), so shade the region <b>' + (shadeAbove ? 'above' : 'below') + '</b> (' + inside(shadeAbove) + ') the parabola, with a ' + (strictOp(s.op) ? 'dashed' : 'solid') + ' boundary.';
    return fin(mcPart(r, 'Use the test point ' + t(ptT(xt, 0)) + ' to decide which region of ' + t(show) + ' is shaded.', opts, sol, ['Substitute ' + t('x=' + xt) + ', ' + t('y=0') + '.', 'Is the point above or below the parabola? True → shade its side.'], 'another test point', true));
  }

  /* Q7, EP B2, B5, C3: write the inequality from its graph (typed, general form) */
  function writeQ(r, kind, o) {
    o = o || {};
    var op = o.op || anyOp(r), info, info1 = null, desc, sol, pts;
    if (kind === 'sym') { // vertex (0, q), x-intercepts ±m
      var s = pickWhere(function () { return { a: r.pick([1, -1, 1, -1, 2, -2, [1, 2], [-1, 2]]), m: r.int(1, 5) }; }, function (z) { var q0 = -rv(z.a) * z.m * z.m; return Number.isInteger(q0) && Math.abs(q0) <= 12 && FRESH(quad(z.a, 0, q0)) && !(z.a === 1 && z.m === 2); });
      info = para(s.a, -s.m, s.m); var q = -rv(s.a) * s.m * s.m; pts = [[0, q], [-s.m, 0], [s.m, 0]];
      desc = 'Vertex ' + t(ptT(0, q)) + '; ' + t('x') + '-intercepts ' + t('\\pm ' + s.m) + '.';
      sol = t('y=ax^{2}' + sgn(q)) + '; at ' + t(ptT(s.m, 0)) + ': ' + t('0=' + s.m * s.m + 'a' + sgn(q)) + ', ' + t('a=' + vt(rv(s.a))) + '. Boundary ' + t('y=' + tx(info.Q)) + '.';
      if (rv(s.a) !== 1) info1 = quad(1, 0, q);
    } else if (kind === 'vtx') { // vertex (h, k) and another point
      var v = pickWhere(function () { return { a: r.pick([1, -1, 2, -2, 1, -1]), h: nz(r, 1, 3), k: r.int(-5, 5), d: r.pick([1, 2, -1, -2]) }; }, function (z) { var pv = paraV(z.a, z.h, z.k); return z.k !== 0 && Math.abs(z.k + z.a * z.d * z.d) <= 9 && Math.abs(pv.c) <= 12 && z.h + z.d !== 0 && FRESH(pv.Q); });
      info = paraV(v.a, v.h, v.k); var px = v.h + v.d, py = info.f(px); pts = [[v.h, v.k], [px, py]];
      desc = 'The boundary has vertex ' + t(ptT(v.h, v.k)) + ' and passes through ' + t(ptT(px, py)) + '.';
      sol = t('y=a' + br(lin(1, -v.h)) + '^{2}' + sgn(v.k)) + '; at ' + t(ptT(px, py)) + ': ' + t(vt(py) + '=a(' + v.d + ')^{2}' + sgn(v.k)) + ', so ' + t('a=' + v.a) + '.<br>' + t('y=' + coefT(v.a) + br(lin(1, -v.h)) + '^{2}' + sgn(v.k) + '=' + tx(info.Q)) + '.';
      if (v.a !== 1) info1 = paraV(1, v.h, v.k).Q;
    } else { // intercepts r1, r2 and the y-intercept (kind 'int'), or the vertex (kind 'intv')
      var z = pickWhere(function () { var a = r.pick(o.aList || [1, -1, 2, -2, -1]), r1 = r.int(-5, 3), w = r.int(2, 6); return { a: a, r1: r1, r2: r1 + w }; }, function (q2) { var pp = para(q2.a, q2.r1, q2.r2); return q2.r2 <= 6 && q2.r1 !== 0 && q2.r2 !== 0 && Math.abs(pp.c) <= 12 && Math.abs(pp.k) <= 10 && (kind !== 'intv' || (q2.r1 + q2.r2) % 2 === 0) && FRESH(pp.Q); });
      info = para(z.a, z.r1, z.r2);
      if (kind === 'intv') {
        pts = [[z.r1, 0], [z.r2, 0], [info.h, info.k]];
        desc = 'The boundary has ' + t('x') + '-intercepts ' + t(z.r1) + ' and ' + t(z.r2) + ' and vertex ' + t(ptT(info.h, info.k)) + '.';
        sol = t('y=a' + facT(1, z.r1, z.r2)) + '; at ' + t(ptT(info.h, info.k)) + ': ' + t(vt(info.k) + '=a(' + vt(info.h - z.r1) + ')(' + vt(info.h - z.r2) + ')') + ', so ' + t('a=' + vt(info.a)) + '.<br>' + t('y=' + tx(info.Q)) + '.';
      } else {
        pts = [[z.r1, 0], [z.r2, 0], [0, info.c]];
        desc = 'The boundary has ' + t('x') + '-intercepts ' + t(z.r1) + ' and ' + t(z.r2) + ' and ' + t('y') + '-intercept ' + t(vt(info.c)) + '.';
        sol = t('y=a' + facT(1, z.r1, z.r2)) + '; at ' + t(ptT(0, info.c)) + ': ' + t(vt(info.c) + '=a(' + (-z.r1) + ')(' + (-z.r2) + ')') + ', so ' + t('a=' + vt(info.a)) + '.<br>' + t('y=' + tx(info.Q)) + '.';
      }
      if (z.a !== 1) info1 = P.mul(lin(1, -z.r1), lin(1, -z.r2));
    }
    if (o.words) op = o.words(info);
    var solid = !strictOp(op), above = upOp(op), wn = winFor(info.f, info.h, { ys: pts.map(function (q3) { return q3[1]; }) });
    var svg = regSvg({ x: wn.x, y: wn.y, max: 260, curves: [{ f: info.f, dash: !solid }], shade: [{ f: info.f, side: above ? 'above' : 'below' }], points: o.words ? [] : pts.map(function (q3) { return { x: q3[0], y: q3[1] }; }), aria: 'a region bounded by a parabola' });
    var tp = testPt(info), inR = holds(tp[1] - info.f(tp[0]), op), chk = inR ? tp : [Math.round(info.h), info.k + (above ? 2 : -2)];
    sol += '<br>' + (solid ? 'Solid' : 'Dashed') + ', shaded ' + (above ? 'above' : 'below') + ': ' + t('y' + OPS[op] + tx(info.Q)) + '.<br>Check ' + t(ptT(chk[0], chk[1])) + ', a point in the region: ' + t(vt(chk[1]) + OPS[op] + vt(info.f(chk[0]))) + ' ✓';
    var wr = info1 ? [{ T: P.sub(Y(), info1), code: CP + 'reg-a', hint: 'Substitute the other point to find ' + t('a') + ': it is not ' + t('1') + '.' }] : [];
    var prompt = (o.prompt || (desc + ' Write the inequality whose solution region is shown, in general form.')) + (o.noFig ? '' : fig(svg));
    var p = AK().ineqPart(CP, prompt, P.sub(Y(), info.Q), op, 'y' + OPS[op] + tx(info.Q), { wrongs: wr, general: true, ph: 'y <= x^2 - 4x + 1', example: 'y\\le x^{2}-4x+1', sideHint: 'Right boundary, but the inequality points the wrong way: the region is ' + (above ? 'above' : 'below') + ' the parabola.' }, sol,
      [kind === 'vtx' ? 'Write the boundary as ' + t('y=a(x-p)^{2}+q') + ' and substitute the other point to find ' + t('a') + '.' : 'Write the boundary as ' + (kind === 'sym' ? t('y=ax^{2}+q') : t('y=a(x-r)(x-s)')) + ' and substitute a point to find ' + t('a') + '.', 'Dashed → ' + t('<') + ' or ' + t('>') + '; solid → ' + t('\\le') + ' or ' + t('\\ge') + '. Shaded above → ' + t('y>') + ' (or ' + t('\\ge') + '). Expand to general form.'], o.text || 'inequality from a graph');
    p.info = info; p.op = op;
    return fin(p);
  }

  /* Q8 shared: vertex (p, q) and a point; the region's side and boundary in words */
  function q8shared(r) {
    var s = pickWhere(function () { return { a: r.pick([1, 2, 3, -1, -2, 2]), p: nz(r, 1, 4), q: r.int(-6, 6), d: r.pick([1, 2, -1, -2, 3]), above: r.chance(0.6), incl: r.chance(0.4) }; }, function (z) { var pv = paraV(z.a, z.p, z.q); return z.q !== 0 && Math.abs(pv.c) <= 30 && z.p + z.d !== 0 && Math.abs(z.q + z.a * z.d * z.d) <= 20 && FRESH(pv.Q) && !(z.a === 2 && z.p === -3 && z.q === -2); });
    s.info = paraV(s.a, s.p, s.q); s.px = s.p + s.d; s.py = s.info.f(s.px); s.op = s.above ? (s.incl ? 'ge' : 'gt') : (s.incl ? 'le' : 'lt');
    return s;
  }
  function q8stem(s) { return 'A solution region is bounded by the parabola with vertex ' + t(ptT(s.p, s.q)) + ' that passes through ' + t(ptT(s.px, s.py)) + '. The region is ' + (s.above ? 'above' : 'below') + ' the parabola and ' + (s.incl ? 'includes' : 'does not include') + ' the parabola.'; }

  /* Q9: calculator — the x-intercepts to the nearest tenth */
  function q9(r, aList, ops) {
    var s = pickWhere(function () { return { a: r.pick(aList), b: r.int(-6, 6), c: r.int(-7, 7), op: r.pick(ops) }; }, function (z) {
      var D = z.b * z.b - 4 * z.a * z.c; if (D <= 0) return false; var sd = Math.sqrt(D), x1 = (-z.b - sd) / (2 * z.a), x2 = (-z.b + sd) / (2 * z.a);
      return Math.abs(sd - Math.round(sd)) > 1e-6 && Math.max(Math.abs(x1), Math.abs(x2)) <= 6 && Math.abs(x1 - x2) > 0.6 && z.c !== 0 && FRESH(quad(z.a, z.b, z.c)) && Math.abs(K.roundTo(x1, 1) - x1) > 0.005 && Math.abs(K.roundTo(x2, 1) - x2) > 0.005;
    });
    var Q = quad(s.a, s.b, s.c), D = s.b * s.b - 4 * s.a * s.c, xs = [(-s.b - Math.sqrt(D)) / (2 * s.a), (-s.b + Math.sqrt(D)) / (2 * s.a)].sort(function (a, b) { return a - b; });
    var rd = xs.map(function (x) { return K.roundTo(x, 1); }), h = -s.b / (2 * s.a), k = at(Q, h), solid = !strictOp(s.op), above = upOp(s.op);
    var f = function (x) { return at(Q, x); }, wn = winFor(f, h, { ys: [s.c] });
    var svg = regSvg({ x: wn.x, y: wn.y, max: 240, curves: [{ f: f, dash: !solid }], shade: [{ f: f, side: above ? 'above' : 'below' }], points: [{ x: xs[0], y: 0 }, { x: xs[1], y: 0 }, { x: 0, y: s.c }], aria: 'the solution region' });
    var show = showY(s.op, tx(Q));
    var sol = t('Y_1=' + tx(Q).replace(/x/g, 'X')) + ' with the shade-' + (above ? 'above' : 'below') + ' icon; 2nd CALC <b>zero</b> (twice): ' + t('x\\approx ' + rd[0].toFixed(1)) + ' and ' + t('x\\approx ' + rd[1].toFixed(1)) + ' (exactly ' + t('\\frac{' + (-s.b) + '\\pm\\sqrt{' + D + '}}{' + 2 * s.a + '}') + ').<br>' + t('y') + '-intercept ' + t(s.c) + '; vertex ' + t('\\approx ' + ptT(Math.round(h * 100) / 100, Math.round(k * 100) / 100)) + '.<br>' + (solid ? 'Solid' : 'Dashed') + '; shade ' + (above ? 'above' : 'below') + ' (' + ((s.a > 0) === above ? 'inside' : 'outside') + ').' + fig(svg);
    var chk = function (resp) {
      resp = resp || []; var a = HW.parse.number(String(resp[0] || '').trim()), b = HW.parse.number(String(resp[1] || '').trim());
      if (!String(resp[0] || '').trim() || !String(resp[1] || '').trim()) return form('empty', 'Fill in both boxes.');
      if (!a.ok || !b.ok) return form('unreadable', 'Type each intercept as a number, e.g. ' + t('-1.6') + '.');
      var got = [a.value, b.value];
      if (near(got[0], rd[0], 1e-9) && near(got[1], rd[1], 1e-9)) return ok();
      if (near(got[0], rd[1], 1e-9) && near(got[1], rd[0], 1e-9)) return form('unreadable', 'Right values — put the smaller intercept in the first box.');
      var srt = got.slice().sort(function (x, y) { return x - y; });
      if (near(srt[0], xs[0], 0.06) && near(srt[1], xs[1], 0.06)) return form('round', 'Round each intercept to the nearest tenth.');
      if (near(srt[0], -rd[1], 1e-9) && near(srt[1], -rd[0], 1e-9)) return wrong(CP + 'root-sign', 'Check the signs: read the intercepts from the graph of ' + t('Y_1=' + tx(Q).replace(/x/g, 'X')) + '.');
      if (near(got[0], rd[0], 1e-9) || near(got[1], rd[1], 1e-9)) return wrong(CP + 'one-root', 'One intercept is right. Use <b>zero</b> again near the other one.');
      return wrong('value', null);
    };
    var p = KP.fields('Use a graphing calculator to graph ' + t(show) + '. Give the ' + t('x') + '-intercepts of the boundary to the nearest tenth.', [{ label: 'Smaller:', name: 'smaller', mode: 'number', before: t('x\\approx') }, { label: 'Larger:', name: 'larger', mode: 'number', before: t('x\\approx') }], [], [rd[0].toFixed(1), rd[1].toFixed(1)],
      t('x\\approx ' + rd[0].toFixed(1)) + ' and ' + t('x\\approx ' + rd[1].toFixed(1)), sol, ['Enter ' + t('Y_1') + ' as the right side and use 2nd CALC <b>zero</b>, once for each intercept.', 'Round to one decimal place.'], 'intercepts with a calculator');
    p.check = chk; p.bad = [[rd[1].toFixed(1), rd[0].toFixed(1)], [(-rd[1]).toFixed(1), (-rd[0]).toFixed(1)]];
    return fin(p);
  }

  /* Q10: the sprinkler */
  function q10shared(r) {
    return pickWhere(function () { return { a: r.pick([0.1, 0.2, 0.25, 0.4, 0.5, 0.8]), D: r.pick([4, 5, 6, 8, 10]) }; }, function (z) { var b = z.a * z.D, hm = z.a * z.D * z.D / 4; return Math.abs(b * 10 - Math.round(b * 10)) < 1e-9 && hm >= 1 && hm <= 5 && !(z.a === 0.4 && z.D === 5); });
  }
  function streamTex(s) { return '-' + dt(s.a) + 'x^{2}+' + dt(s.a * s.D) + 'x'; }
  function stream(s, x) { return -s.a * x * x + s.a * s.D * x; }
  function q10stem(s) { return 'A lawn sprinkler sends a stream of water along the path ' + t('y=' + streamTex(s)) + ', where ' + t('x') + ' is the horizontal distance from the sprinkler and ' + t('y') + ' is the height, both in metres. Points under the stream satisfy ' + t('y<' + streamTex(s)) + '.'; }
  function q10pass(r, s, near0, what) {
    var z = pickWhere(function () { var d = near0 ? r.pick([0.5, 1, 1.5]) : s.D - r.pick([0.5, 1, 1.5]); return { d: d, dl: r.pick([0.1, 0.2, 0.1, 0.3]), yes: r.chance(0.6) }; }, function (q) { var h = stream(s, q.d); return q.d > 0 && q.d < s.D && h - q.dl > 0.2 && Math.abs(h * 100 - Math.round(h * 100)) < 1e-6; });
    var hS = stream(s, z.d), obj = Math.round((z.yes ? hS - z.dl : hS + z.dl) * 100) / 100, yes = obj < hS;
    var calc = t('-' + dt(s.a) + '(' + dt(z.d) + ')^{2}+' + dt(s.a * s.D) + '(' + dt(z.d) + ')=' + dt(hS));
    var sol = 'Test ' + t(ptT(z.d, obj)) + ': ' + calc + ', and ' + t(dt(obj) + '<' + dt(hS)) + ' is ' + (yes ? 'true' : 'false') + '.<br>' + (yes ? 'The top of the ' + what + ' is under the stream: the water passes over it (by ' + dt(Math.round((hS - obj) * 100) / 100) + ' m).' : 'The top of the ' + what + ' is above the stream there: the water hits it (it is ' + dt(Math.round((obj - hS) * 100) / 100) + ' m too tall).');
    var hc = K.approx(hS, 2), chk = function (resp) {
      resp = resp || []; var a = String(resp[0] || '').trim(), b = String(resp[1] || '').trim().toLowerCase();
      if (!a || !b) return form('empty', 'Fill in both boxes.');
      var rh = hc(a); if (rh.v !== 'correct') { var pn = HW.parse.number(a); if (pn.ok && near(pn.value, s.a * z.d * z.d + s.a * s.D * z.d, 0.006)) return wrong(CP + 'height', 'Check the sign of the ' + t('x^{2}') + '-term: ' + t('-' + dt(s.a) + '(' + dt(z.d) + ')^{2}') + ' is negative.'); return rh.v === 'form' ? rh : wrong(CP + 'height', 'Substitute ' + t('x=' + dt(z.d)) + ' into ' + t(streamTex(s)) + '.'); }
      var yn = /^(y|yes|oui)$/.test(b) ? true : /^(n|no|non)$/.test(b) ? false : null;
      if (yn === null) return form('yesno', 'Type <b>yes</b> or <b>no</b> in the second box.');
      return yn === yes ? ok() : wrong(CP + 'yes-no', 'Right height. Now compare: the ' + what + ' is ' + dt(obj) + ' m tall and the stream is ' + dt(hS) + ' m high there.');
    };
    var p = KP.fields('A ' + what + ' ' + t(dt(obj)) + ' m tall stands ' + t(dt(z.d)) + ' m from the sprinkler. How high is the stream there, and does the water pass over the ' + what + '?', [{ label: 'Height of the stream:', name: 'height', mode: 'number', after: 'm' }, { label: 'Passes over? (yes / no)', name: 'yes or no', mode: 'text' }], [], [dt(hS), yes ? 'yes' : 'no'],
      dt(hS) + ' m; ' + (yes ? 'yes' : 'no'), sol, ['Substitute ' + t('x=' + dt(z.d)) + ' into the path.', 'The water passes over when the top of the ' + what + ' is under the stream: ' + t('y<' + streamTex(s)) + '.'], 'a point under a curve');
    p.check = chk; p.bad = [[dt(hS), yes ? 'no' : 'yes']];
    return fin(p);
  }

  /* Q11 shared: y ≤ −x² + k and y ≥ mx + n meet at x1 < x2 */
  function q11shared(r) {
    return pickWhere(function () { var x1 = r.int(-4, 1), x2 = r.int(1, 4); var m = -(x1 + x2), k = r.int(2, 8); return { x1: x1, x2: x2, m: m, k: k, n: k + x1 * x2 }; }, function (z) {
      return z.x2 - z.x1 >= 3 && z.m !== 0 && Math.abs(z.m) <= 3 && Math.abs(z.n) <= 6 && !(z.k === 5 && z.m === 1 && z.n === -1) && !(z.k === 4 && z.m === -1 && z.n === 2) && Math.min(-z.x1 * z.x1 + z.k, -z.x2 * z.x2 + z.k) >= -8;
    });
  }
  function q11fs(s) { return { fp: function (x) { return -x * x + s.k; }, fl: function (x) { return s.m * x + s.n; } }; }
  function q11stem(s) { return 'The solution region of a pair of inequalities is the set of points that satisfy both: ' + t('y\\le -x^{2}+' + s.k) + ' and ' + t('y\\ge ' + tx(lin(s.m, s.n))) + '.'; }

  /* ---------------- the assignment ---------------- */
  var QUESTIONS = [
    { num: '1', parts: [{ id: '1', level: 'BEG', make: function (r) { return fin(AK().B.ptsGrid(r, CP, { kind: 'quad' })); } }] },
    { num: '2', stem: 'For each inequality, write it with ' + t('y') + ' alone on the left (if needed), and decide whether the boundary is solid or dashed and the region above or below the parabola.', parts: [
      { id: '2a', level: 'LIM', make: function (r) { var s = pickWhere(function () { return { a: r.pick([1, 2, -1, 3]), c: nz(r, 1, 9) }; }, function (z) { return !(z.a === 1 && z.c === -7); }); var op = anyOp(r); return fin(sideMC(r, showY(op, tx(quad(s.a, 0, s.c))), op)); } },
      { id: '2b', level: 'LIM', make: function (r) { var s = pickWhere(function () { return { a: nz(r, 1, 4), b: nz(r, 1, 5) }; }, function (z) { return !(z.a === -3 && z.b === 1); }); var op = anyOp(r); return fin(sideMC(r, showY(op, tx(quad(s.a, s.b, 0))), op)); } },
      { id: '2c', level: 'BEG', make: function (r) { return yAlonePartQ(r, 'add'); } },
      { id: '2d', level: 'EMG', make: function (r) { return yAlonePartQ(r, 'neg'); } }] },
    { num: '3', stem: 'Graph the solution region of each inequality. (Find the intercepts, the vertex and a test point.)', parts: [
      { id: '3a', level: 'BEG', make: function (r) { return g3(r, 'up'); } },
      { id: '3b', level: 'BEG', make: function (r) { return g3(r, 'down'); } },
      { id: '3c', level: 'EMG', make: function (r) { return g3(r, 'sym'); } }] },
    { num: '4', stem: 'Graph the solution region of each inequality. Use the form the equation is given in.', parts: [
      { id: '4a', level: 'EMG', make: function (r) { return g3(r, 'vtx'); } },
      { id: '4b', level: 'PRG', make: function (r) { return g3(r, 'fac'); } },
      { id: '4c', level: 'PRG', make: function (r) { return g3(r, 'zero'); } }] },
    { num: '5', parts: [
      { id: '5a', level: 'PRG', make: function (r) { return g5(r, 'add'); } },
      { id: '5b', level: 'ADV', make: function (r) { return g5(r, 'div'); } }] },
    { num: '6', shared: q6shared, parts: [
      { id: '6a', level: 'EMG', make: function (r, s) { return q6a(r, s); } },
      { id: '6b', level: 'PRG', make: function (r, s) { return q6b(r, s); } }] },
    { num: '7', parts: [
      { id: '7a', level: 'PRG', make: function (r) { return writeQ(r, 'sym'); } },
      { id: '7b', level: 'PRG', make: function (r) { return writeQ(r, 'int'); } }] },
    { num: '8', shared: q8shared, stem: q8stem, parts: [
      { id: '8a', level: 'EMG', make: function (r, s) {
        var sol = t(vt(s.py) + '=a(' + vt(s.px) + sgn(-s.p) + ')^{2}' + sgn(s.q)) + ', so ' + t(vt(s.a * s.d * s.d) + '=' + (s.d * s.d === 1 ? '' : s.d * s.d) + 'a') + ' and ' + t('a=' + s.a) + '.<br>' + t('y=' + coefT(s.a) + br(lin(1, -s.p)) + '^{2}' + sgn(s.q) + '=' + tx(s.info.Q)) + '.';
        var w1 = paraV(1, s.p, s.q).Q;
        var p = K.P.poly('Write the equation of the parabola in general form.', s.info.Q, { before: 'y=', wrong: s.a !== 1 ? [{ is: w1, code: CP + 'reg-a', hint: 'Substitute the point ' + t(ptT(s.px, s.py)) + ' to find ' + t('a') + ': it is not ' + t(1) + '.' }] : [] }, sol,
          ['Start from ' + t('y=a(x-p)^{2}+q') + ' with the vertex, and substitute the other point to find ' + t('a') + '.', 'Expand to general form ' + t('y=ax^{2}+bx+c') + '.'], 'equation from the vertex and a point');
        p.bad = [tx(w1), tx(paraV(s.a, -s.p, s.q).Q)]; return fin(p);
      } },
      { id: '8b', level: 'EMG', make: function (r, s) {
        return fin(AK().ineqPart(CP, 'Write the inequality, in general form.', P.sub(Y(), s.info.Q), s.op, 'y' + OPS[s.op] + tx(s.info.Q), { general: true, ph: 'y > 2x^2 + 12x + 16', example: 'y>2x^{2}+12x+16', sideHint: 'The region is ' + (s.above ? 'above' : 'below') + ' the parabola: use ' + (s.above ? t('y>') + ' or ' + t('y\\ge') : t('y<') + ' or ' + t('y\\le')) + '.', strictHint: s.incl ? 'The region includes the parabola: use ' + t('\\le') + ' or ' + t('\\ge') + '.' : 'The region does not include the parabola: use ' + t('<') + ' or ' + t('>') + '.' },
          (s.above ? 'Above' : 'Below') + ' the parabola, ' + (s.incl ? 'including' : 'not including') + ' it: ' + t('y' + OPS[s.op] + tx(s.info.Q)) + '.', ['Above → ' + t('y>') + ' or ' + t('y\\ge') + '; below → ' + t('y<') + ' or ' + t('y\\le') + '.', 'Includes the parabola → ' + t('\\le') + ' or ' + t('\\ge') + '.'], 'write the inequality'));
      } },
      { id: '8c', level: 'PRG', make: function (r, s) {
        var c = s.info.c, y1 = pickWhere(function () { return s.q + nz(r, 1, 4); }, function () { return true; });
        var pts = [[s.p, y1], [0, c]], want = {}, rows = [], lines = [];
        pts.forEach(function (q, i) { var v = q[1] - s.info.f(q[0]), yes = holds(v, s.op); want['p' + i] = yes ? 'y' : 'n'; rows.push({ id: 'p' + i, html: t(ptT(q[0], q[1])) });
          lines.push(t(ptT(q[0], q[1])) + ': ' + t(vt(q[1]) + OPS[s.op] + vt(s.info.f(q[0]))) + ' is ' + (yes ? 'true: a solution' : 'false: not a solution') + (i === 1 ? ' (it is on the ' + (s.incl ? 'solid' : 'dashed') + ' boundary' + (s.incl ? ', which is included' : '') + ')' : '') + '.'); });
        var p = KP.grid('Is each point a solution?', rows, [{ id: 'y', html: 'Solution' }, { id: 'n', html: 'Not a solution' }], want, { why: function (row) { return row === 'p1' ? { code: CP + 'pt-boundary', hint: t(ptT(0, c)) + ' is on the boundary (it is the ' + t('y') + '-intercept). Does the region include the parabola?' } : { code: CP + 'pt-row', hint: 'Substitute the point into your inequality.' }; } }, lines.join('<br>'), ['Substitute each point into the inequality.', 'A point on the parabola is a solution only when the region includes the boundary.'], 'points in the region');
        var fl = {}; Object.keys(want).forEach(function (k2) { fl[k2] = want[k2] === 'y' ? 'n' : 'y'; }); p.bad = [fl];
        return fin(p);
      } }] },
    { num: '9', stem: 'Use a graphing calculator.', parts: [
      { id: '9a', level: 'EMG', make: function (r) { return q9(r, [-2, -1, 2, 3, -3], ['gt', 'ge']); } },
      { id: '9b', level: 'EMG', make: function (r) { return q9(r, [1, -1, 1, 2], ['le', 'lt']); } }] },
    { num: '10', shared: q10shared, stem: q10stem, parts: [
      { id: '10a', level: 'BEG', make: function (r, s) {
        var p = KP.number('How far from the sprinkler does the water land?', s.D, function (v) { return near(v, s.D / 2) ? { code: CP + 'land-half', hint: 'That is where the stream is highest (the axis of symmetry). Where does it come back down to ' + t('y=0') + '?' } : null; },
          t(streamTex(s) + '=0') + ' gives ' + t('-' + dt(s.a) + 'x(x-' + s.D + ')=0') + ', so ' + t('x=0') + ' (the sprinkler) or ' + t('x=' + s.D) + '. It lands <b>' + s.D + ' m</b> away.', ['The water lands where its height is ' + t(0) + '.', 'Factor out ' + t('-' + dt(s.a) + 'x') + '.'], 'where the stream lands', { after: 'm' });
        p.bad = [String(s.D / 2)]; return fin(p);
      } },
      { id: '10b', level: 'PRG', make: function (r, s) { return q10pass(r, s, false, 'garden gnome'); } },
      { id: '10c', level: 'PRG', make: function (r, s) { return q10pass(r, s, true, 'shrub'); } }] },
    { num: '11', shared: q11shared, stem: q11stem, parts: [
      { id: '11a', level: 'PRG', make: function (r, s) {
        var F = q11fs(s), lo = Math.min(-8, s.m * -5 + s.n, s.m * 5 + s.n), wn = { x: [-5, 5], y: [Math.max(-10, 2 * Math.floor((Math.min(F.fl(-5), F.fl(5), -s.x1 * s.x1 + s.k, -s.x2 * s.x2 + s.k) - 1) / 2)), Math.max(2 * Math.ceil((s.k + 2) / 2), 4)] };
        var dr = function (sp, sl, aria) { return regSvg({ x: wn.x, y: wn.y, max: 200, curves: [{ f: F.fp }, { f: F.fl }], shade: [{ f: F.fp, side: sp }, { f: F.fl, side: sl }], aria: aria }); };
        var opts = [{ html: dr('below', 'above', 'graph A'), right: true }, { html: dr('above', 'above', 'graph B'), code: 'pa', why: t('y\\le') + ' means below the parabola.' },
          { html: dr('below', 'below', 'graph C'), code: 'lb', why: t('y\\ge') + ' means above the line.' }, { html: dr('above', 'below', 'graph D'), code: 'both', why: 'Both sides are reversed: below the parabola and above the line.' }];
        var p = mcPart(r, 'Which graph shows the region that satisfies both inequalities?', opts, 'Solid parabola, vertex ' + t(ptT(0, s.k)) + ', opening down; solid line with slope ' + t(s.m) + ' and ' + t('y') + '-intercept ' + t(s.n) + '.<br>The region is <b>below the parabola and above the line</b>, between the points where they meet.',
          ['Shade each inequality on its own: ' + t('y\\le') + ' is below, ' + t('y\\ge') + ' is above.', 'The solution of the pair is where the two shadings overlap.'], 'region of a pair of inequalities');
        p.input.columns = 2; return fin(p);
      } },
      { id: '11b', level: 'ADV', make: function (r, s) {
        var pts = [s.x1, s.x2].map(function (x) { return { x: x, y: s.m * x + s.n }; });
        var sol = t('-x^{2}+' + s.k + '=' + tx(lin(s.m, s.n))) + ', so ' + t(tx(quad(1, s.m, s.n - s.k)) + '=0') + ' and ' + t(facT(1, s.x1, s.x2) + '=0') + ': ' + t('x=' + s.x1) + ' or ' + t('x=' + s.x2) + '.<br>' + pts.map(function (q) { return t('x=' + q.x) + ': ' + t('y=' + vt(q.y)); }).join('; ') + '. Points ' + pts.map(function (q) { return t(ptT(q.x, q.y)); }).join(' and ') + '.';
        return fin(AK().pairsPart(CP, 'Find, algebraically, the points where the boundaries meet.', pts, { wrongs: [{ pts: [[-s.x1, -s.m * s.x1 + s.n], [-s.x2, -s.m * s.x2 + s.n]], code: CP + 'root-sign', hint: 'Check the signs of your roots: a factor ' + t('(x-3)') + ' gives ' + t('x=3') + '.' }] }, sol,
          ['Set the two expressions for ' + t('y') + ' equal and move every term to one side.', 'Factor; substitute each ' + t('x') + ' into the line for ' + t('y') + '.'], 'where the boundaries meet'));
      } },
      { id: '11c', level: 'PRG', make: function (r, s) {
        var F = q11fs(s), inside = pickWhere(function () { return [r.int(s.x1 + 1 > s.x2 - 1 ? s.x1 : s.x1 + 1, s.x2 - 1), r.int(-6, 8)]; }, function (q) { return q[1] < F.fp(q[0]) - 0.5 && q[1] > F.fl(q[0]) + 0.5; });
        var outp = pickWhere(function () { return [r.int(s.x1, s.x2), r.int(-8, 8)]; }, function (q) { return (q[1] <= F.fp(q[0]) - 0.5 && q[1] < F.fl(q[0]) - 0.5) || (q[1] > F.fp(q[0]) + 0.5 && q[1] >= F.fl(q[0]) + 0.5); });
        var pts = r.shuffle([{ p: inside, y: true }, { p: outp, y: false }]), want = {}, rows = [], lines = [];
        pts.forEach(function (q, i) { var a1 = q.p[1] <= F.fp(q.p[0]), a2 = q.p[1] >= F.fl(q.p[0]); want['p' + i] = q.y ? 'y' : 'n'; rows.push({ id: 'p' + i, html: t(ptT(q.p[0], q.p[1])) });
          lines.push(t(ptT(q.p[0], q.p[1])) + ': ' + t(vt(q.p[1]) + '\\le ' + vt(F.fp(q.p[0]))) + (a1 ? ' ✓' : ' ✗') + ' and ' + t(vt(q.p[1]) + '\\ge ' + vt(F.fl(q.p[0]))) + (a2 ? ' ✓' : ' ✗') + ': ' + (q.y ? 'in the region.' : 'not in the region.')); });
        var p = KP.grid('Is each point in the region?', rows, [{ id: 'y', html: 'In the region' }, { id: 'n', html: 'Not in it' }], want, { why: function () { return { code: CP + 'pt-row', hint: 'A point is in the region only when it satisfies <b>both</b> inequalities.' }; } }, lines.join('<br>'), ['Substitute the point into both inequalities.', 'Both must be true.'], 'points in a pair of regions');
        var fl = {}; Object.keys(want).forEach(function (k2) { fl[k2] = want[k2] === 'y' ? 'n' : 'y'; }); p.bad = [fl]; return fin(p);
      } }] },
    { num: '12', parts: [{ id: '12', level: 'PRG', make: function (r) {
      var s = pickWhere(function () { return { a: r.pick([2, -2, 3, -3]), h: nz(r, 1, 2), k: r.int(-5, 5), op: anyOp(r) }; }, function (z) { var c = z.a * z.h * z.h + z.k; return Math.abs(c) <= 9 && c !== z.k && z.k !== 0 && !(z.a === 2 && z.h === 1 && z.k === -3); });
      var info = paraV(s.a, s.h, s.k), Q1 = paraV(1, s.h, s.k).Q, wn = winFor(info.f, s.h, { ys: [info.c], x: [Math.min(-3, s.h - 3), Math.max(3, s.h + 3)] });
      var svg = regSvg({ x: wn.x, y: wn.y, max: 230, curves: [{ f: info.f, dash: strictOp(s.op) }], shade: [{ f: info.f, side: upOp(s.op) ? 'above' : 'below' }], points: [{ x: s.h, y: s.k }, { x: 0, y: info.c }], aria: 'a shaded region' });
      var opts = [{ html: t(showY(s.op, tx(info.Q))), right: true }, { html: t(showY(FLIP[s.op], tx(info.Q))), code: 'side', why: 'That is the region on the other side of the parabola.' },
        { html: t(showY(TOG[s.op], tx(info.Q))), code: 'line', why: strictOp(s.op) ? 'The boundary is dashed: use ' + t('<') + ' or ' + t('>') + '.' : 'The boundary is solid: use ' + t('\\le') + ' or ' + t('\\ge') + '.' },
        { html: t(showY(s.op, tx(Q1))), code: 'a1', why: 'That parabola has ' + t('a=1') + ', so its ' + t('y') + '-intercept is ' + t(vt(at(Q1, 0))) + ', not ' + t(vt(info.c)) + '.' }];
      return fin(mcPart(r, 'The boundary of the shaded region is a parabola with vertex ' + t(ptT(s.h, s.k)) + ' and ' + t('y') + '-intercept ' + t(vt(info.c)) + '. The inequality is' + fig(svg), opts,
        t('y=a' + br(lin(1, -s.h)) + '^{2}' + sgn(s.k)) + '; at ' + t(ptT(0, info.c)) + ': ' + t(vt(info.c) + '=' + (s.h * s.h) + 'a' + sgn(s.k)) + ', ' + t('a=' + s.a) + ', so ' + t('y=' + tx(info.Q)) + '. ' + (strictOp(s.op) ? 'Dashed' : 'Solid') + ' and shaded ' + (upOp(s.op) ? 'above' : 'below') + ': ' + t(OPS[s.op].trim()) + '.',
        ['Find ' + t('a') + ' from the vertex form and the ' + t('y') + '-intercept.', 'Dashed or solid? Shaded above or below?'], 'inequality from a graph (MC)'));
    } }] },
    { num: '13', parts: [{ id: '13', level: 'EMG', make: function (r) {
      var s = pickWhere(function () { return { b: r.int(-4, 4), c: r.int(-2, 6), op: r.pick(['ge', 'le']), x0: r.int(-3, 4), onB: r.chance(0.6) }; }, function (z) { return !(z.b === 3 && z.c === 4) && Math.abs(-z.x0 * z.x0 + z.b * z.x0 + z.c) <= 8; });
      var Q = quad(-1, s.b, s.c), f = function (x) { return at(Q, x); }, up = s.op === 'ge';
      var good = [s.x0, f(s.x0) + (s.onB ? 0 : (up ? 2 : -2))], seen = {}; seen[good.join()] = 1;
      var bads = []; for (var i = 0; bads.length < 3 && i < 400; i++) { var x = r.int(-3, 4), y = f(x) + (up ? -r.int(1, 4) : r.int(1, 4)); if (!seen[x + ',' + y] && Math.abs(y) <= 12) { seen[x + ',' + y] = 1; bads.push([x, y]); } }
      if (bads.length < 3) throw new Error('u8l5 13: no points');
      var opts = [good].concat(bads).map(function (q, i) { return { html: t(ptT(q[0], q[1])), right: i === 0, code: 'p' + i, why: i ? 'Substitute: ' + t(vt(q[1]) + OPS[s.op] + vt(f(q[0]))) + ' is false.' : null }; });
      var sol = [good].concat(bads).map(function (q, i) { return t(ptT(q[0], q[1])) + ': ' + t(vt(q[1]) + OPS[s.op] + vt(f(q[0]))) + (i === 0 ? ' is true' + (s.onB ? ' (it is on the solid boundary)' : '') : ' is false'); }).join('; ') + '.';
      return fin(mcPart(r, 'Which point is in the solution region of ' + t(showY(s.op, tx(Q))) + '?', opts, sol, ['Substitute each point: find ' + t(tx(Q)) + ' at its ' + t('x') + ', then compare with its ' + t('y') + '.'], 'a point in the region'));
    } }] },
    { num: '14', parts: [{ id: '14', level: 'EMG', make: function (r) {
      var s = pickWhere(function () { return { m: r.pick([2, 3, 4, 5]), q: nz(r, 1, 5), sa: r.pick([1, 2, -1]), op: anyOp(r) }; }, function (z) { return !(z.m === 3 && z.q === 2 && z.sa === 1); });
      var c0 = s.m * s.q, g = M(s.sa, 'x', 2), show = c0 + '-' + s.m + 'y' + OPS[s.op] + tx(P.scale(g, s.m)), rhs = tx(P.add(P.neg(g), P.num(s.q))), rhsW = tx(P.sub(g, P.num(s.q)));
      var opts = [{ html: t(showY(FLIP[s.op], rhs)), right: true }, { html: t(showY(s.op, rhs)), code: 'norev', why: 'Dividing by ' + t(-s.m) + ' reverses the inequality sign.' },
        { html: t(showY(FLIP[s.op], rhsW)), code: 'signs', why: 'Divide <b>every</b> term by ' + t(-s.m) + ': both terms on the right change sign.' }, { html: t(showY(s.op, rhsW)), code: 'both', why: 'Dividing by a negative changes the sign of every term <b>and</b> reverses the inequality.' }];
      return fin(mcPart(r, 'Written with ' + t('y') + ' alone on the left, the inequality ' + t(show) + ' is', opts,
        'Subtract ' + t(c0) + ': ' + t('-' + s.m + 'y' + OPS[s.op] + tx(P.sub(P.scale(g, s.m), P.num(c0)))) + '. Dividing by ' + t(-s.m) + ' reverses the sign: ' + t(showY(FLIP[s.op], rhs)) + '.', ['Subtract the constant first, then divide by the coefficient of ' + t('y') + '.', 'Dividing by a negative number reverses the sign.'], 'y alone (MC)'));
    } }] },
    { num: '15', parts: [{ id: '15', level: 'PRG', make: function (r) {
      var s = pickWhere(function () { return { b: r.int(-7, 5), c: r.int(-4, 12), x0: r.int(-3, 4), op: r.pick(['gt', 'ge', 'gt']) }; }, function (z) { var v = z.x0 * z.x0 + z.b * z.x0 + z.c; return v >= 1 && v <= 15 && FRESH(quad(1, z.b, z.c)); });
      var Q = quad(1, s.b, s.c), v = at(Q, s.x0), ans = s.op === 'gt' ? v + 1 : v, other = s.op === 'gt' ? v : v + 1;
      var p = KP.nr(t('\\text{NR}') + ' The point ' + t('(' + s.x0 + ',\\ k)') + ' is in the solution region of ' + t(showY(s.op, tx(Q))) + ', and ' + t('k') + ' is a whole number. The smallest possible value of ' + t('k') + ' is', ans,
        function (x) { return x === other ? { code: CP + 'k-bound', hint: s.op === 'gt' ? 'The boundary is not included (' + t('>') + '): ' + t('k') + ' must be <b>more than</b> ' + t(v) + '.' : 'The boundary is included (' + t('\\ge') + '): ' + t('k=' + v) + ' works.' } : null; },
        'At ' + t('x=' + s.x0) + ' the boundary is ' + t(tx(Q).replace(/x/g, '(' + s.x0 + ')') + '=' + v) + '. We need ' + t('k' + OPS[s.op] + v) + ', so the smallest whole number is <b>' + ans + '</b>.', ['Find the height of the boundary at ' + t('x=' + s.x0) + '.', t('>') + ' leaves the boundary out; ' + t('\\ge') + ' includes it.'], 'smallest k');
      p.bad = [String(other)]; return fin(p);
    } }] },
    { num: '16', parts: [{ id: '16', level: 'MAS', make: function (r) {
      var s = pickWhere(function () { return { a: nz(r, 1, 3), h: nz(r, 2, 3), k: r.int(-8, 8), below: r.chance(0.6) }; }, function (z) { var pv = paraV(z.a, z.h, z.k); return Math.abs(pv.c) <= 30 && !(z.a === -1 && z.h === 2 && z.k === 7) && (z.below ? z.a < 0 : z.a > 0) && z.k !== 0; });
      var info = paraV(s.a, s.h, s.k), C = cof(info.Q), ans = C[0] + C[1] + C[2], op = s.below ? 'le' : 'ge', alt = C[0] - C[1] + C[2];
      var p = KP.nr(t('\\text{NR}') + ' The solution region of ' + t('y' + OPS[op] + 'ax^{2}+bx+c') + ' is ' + (s.below ? 'below' : 'above') + ' a solid parabola with vertex ' + t(ptT(s.h, s.k)) + ' that passes through ' + t(ptT(0, info.c)) + '. The value of ' + t('a+b+c') + ' is', ans,
        function (x) { if (x === alt) return { code: CP + 'abc-sign', hint: 'Check the sign of ' + t('b') + ': that is ' + t('a-b+c') + '.' }; if (x === s.a && s.a !== ans) return { code: CP + 'abc-a', hint: 'That is ' + t('a') + '. Expand to general form to find ' + t('b') + ' and ' + t('c') + ' too.' }; return null; },
        t(vt(info.c) + '=a(0' + sgn(-s.h) + ')^{2}' + sgn(s.k)) + ', so ' + t('a=' + s.a) + ' and ' + t('y=' + coefT(s.a) + br(lin(1, -s.h)) + '^{2}' + sgn(s.k) + '=' + tx(info.Q)) + '.<br>' + t('a+b+c=' + vt(C[0]) + sgn(C[1]) + sgn(C[2]) + '=' + vt(ans)) + ' (the value of ' + t('y') + ' at ' + t('x=1') + ').',
        ['Find ' + t('a') + ' from the vertex form and the point.', 'Expand, then add the coefficients (or substitute ' + t('x=1') + ').'], 'a + b + c from a graph');
      p.bad = [String(alt), String(s.a)]; return fin(p);
    } }] }
  ];

  /* ---------------- the extra practice ---------------- */
  function archShared(r) {
    return pickWhere(function () { return { W: r.pick([8, 10, 12, 16, 20]), H: r.int(4, 9) }; }, function (z) { var a = z.H / (z.W * z.W / 4); return Math.abs(a * 1000 - Math.round(a * 1000)) < 1e-9 && !(z.W === 8 && z.H === 6) && !(z.W === 10 && z.H === 5); });
  }
  function archA(s) { return s.H / (s.W * s.W / 4); }
  function archEq(s) { return '-' + dt(archA(s)) + 'x^{2}+' + s.H; }
  var EXTRA = [
    { num: 'A1', section: 'A. Skills', parts: [{ id: 'A1', level: 'BEG', make: function (r) { return fin(AK().B.ptsGrid(r, CP, { kind: 'quad' })); } }] },
    { num: 'A2', stem: 'Write each inequality with ' + t('y') + ' alone on the left; then the boundary (solid or dashed) and the side (above or below) can be read from it.', parts: [
      { id: 'A2a', level: 'BEG', make: function (r) { return yAlonePartQ(r, 'sub'); } },
      { id: 'A2b', level: 'EMG', make: function (r) { return fin(AK().B.bdMC(r, CP, { kind: 'quad' })); } },
      { id: 'A2c', level: 'PRG', make: function (r) { return yAlonePartQ(r, 'div'); } }] },
    { num: 'A3', stem: 'Graph the solution region of each inequality.', parts: [
      { id: 'A3a', level: 'BEG', make: function (r) { return g3(r, 'up'); } },
      { id: 'A3b', level: 'EMG', make: function (r) { return g3(r, 'vtx'); } }] },
    { num: 'B1', section: 'B. Applying', parts: [{ id: 'B1', level: 'PRG', make: function (r) { return g3(r, 'zero2'); } }] },
    { num: 'B2', parts: [{ id: 'B2', level: 'PRG', make: function (r) { return writeQ(r, 'vtx'); } }] },
    { num: 'B3', shared: function (r) {
        var z = pickWhere(function () { var r1 = r.int(-5, -1), r2 = r.int(1, 6); return { r1: r1, r2: r2, a: r.pick([[1, 2], [-1, 2], [1, 2], [3, 2], [-1, 3], [1, 3]]), up: r.chance(0.6) }; }, function (q) { var pp = para(q.a, q.r1, q.r2); return Number.isInteger(pp.c) && Math.abs(pp.c) <= 12 && FRESH(pp.Q) && !(q.r1 === -2 && q.r2 === 4); });
        z.info = para(z.a, z.r1, z.r2); z.op = z.up ? 'ge' : 'le'; return z;
      }, stem: function (s) { return 'A solid parabola has ' + t('x') + '-intercepts ' + t(s.r1) + ' and ' + t(s.r2) + ' and passes through ' + t(ptT(0, s.info.c)) + '. The solution region is ' + (s.up ? 'above' : 'below') + ' it.'; }, parts: [
      { id: 'B3a', level: 'ADV', make: function (r, s) {
        var sol = t('y=a(x' + sgn(-s.r1) + ')(x' + sgn(-s.r2) + ')') + '; ' + t(vt(s.info.c) + '=a(' + (-s.r1) + ')(' + (-s.r2) + ')') + ', ' + t('a=' + vt(s.info.a)) + '.<br>' + t('y' + OPS[s.op] + tx(s.info.Q)) + '.';
        return fin(AK().ineqPart(CP, 'Write the inequality in general form.', P.sub(Y(), s.info.Q), s.op, 'y' + OPS[s.op] + tx(s.info.Q), { general: true, wrongs: [{ T: P.sub(Y(), P.mul(lin(1, -s.r1), lin(1, -s.r2))), code: CP + 'reg-a', hint: 'Substitute the point ' + t(ptT(0, s.info.c)) + ' to find ' + t('a') + '.' }], ph: 'y >= 1/2x^2 - x - 4', example: 'y\\ge\\frac{1}{2}x^{2}-x-4' }, sol,
          ['Start from ' + t('y=a(x-r)(x-s)') + ' and substitute the third point to find ' + t('a') + '.', 'Solid, above → ' + t('\\ge') + '; solid, below → ' + t('\\le') + '.'], 'inequality from intercepts and a point'));
      } },
      { id: 'B3b', level: 'EMG', make: function (r, s) {
        var x0 = pickWhere(function () { return r.int(s.r1 + 1, s.r2 - 1); }, function (x) { return x !== 0; }), fv = s.info.f(x0), y0 = Math.round(fv + (r.chance(0.5) ? 0.5 : -0.5)), yes = holds(y0 - fv, s.op);
        return fin(yesNo(r, 'Is ' + t(ptT(x0, y0)) + ' a solution?', yes, 'Substitute: ' + t(vt(y0) + OPS[s.op] + vt(fv)) + ' is true.', 'Substitute: ' + t(vt(y0) + OPS[s.op] + vt(fv)) + ' is false.',
          'At ' + t('x=' + x0) + ': ' + t(tx(s.info.Q).replace(/x/g, '(' + x0 + ')') + '=' + vt(fv)) + ', and ' + t(vt(y0) + OPS[s.op] + vt(fv)) + ' is ' + (yes ? 'true: yes.' : 'false: no.'), ['Substitute the point into your inequality from (a).'], 'is the point a solution'));
      } }] },
    { num: 'B4', shared: archShared, stem: function (s) { return 'The opening of a tunnel is a parabolic arch ' + t(s.W) + ' m wide at the road and ' + t(s.H) + ' m high in the middle. Put the origin at the centre of the road.'; }, parts: [
      { id: 'B4a', level: 'PRG', make: function (r, s) {
        var a = archA(s), Q = quad(ex.norm(-4 * s.H, s.W * s.W), 0, s.H), half = s.W / 2;
        var p = K.P.poly('Write the equation of the arch.', Q, { before: 'y=', keyTex: archEq(s), wrong: [{ is: quad(ex.norm(-s.H, s.W * s.W), 0, s.H), code: CP + 'arch-half', hint: 'The arch meets the road at ' + t('x=\\pm ' + half) + ' (half the width), not at ' + t('x=' + s.W) + '.' }] },
          'Vertex ' + t(ptT(0, s.H)) + ': ' + t('y=ax^{2}+' + s.H) + '. At ' + t(ptT(half, 0)) + ': ' + t('0=' + half * half + 'a+' + s.H) + ', so ' + t('a=-' + dt(a)) + '.<br>' + t('y=' + archEq(s)) + '.', ['The vertex is at the top of the arch, ' + t(ptT(0, s.H)) + '.', 'The arch meets the road ' + t(half) + ' m on each side of the centre: substitute ' + t(ptT(half, 0)) + ' to find ' + t('a') + '.'], 'equation of an arch');
        p.bad = [tx(quad(ex.norm(-s.H, s.W * s.W), 0, s.H))]; return fin(p);
      } },
      { id: 'B4b', level: 'PRG', make: function (r, s) {
        var a = archA(s), Q = quad(ex.norm(-4 * s.H, s.W * s.W), 0, s.H), c1 = AK().ineqPart(CP, '', P.sub(Y(), Q), 'le', 'y\\le ' + archEq(s), {}).check, c2 = AK().ineqPart(CP, '', Y(), 'ge', 'y\\ge 0', {}).check;
        var p = KP.fields('Write the inequalities for the points on or under the arch and on or above the road.', [{ label: 'Under the arch:', name: 'under the arch', mode: 'math', keys: 'u8ineq', vars: ['x', 'y'] }, { label: 'Above the road:', name: 'above the road', mode: 'math', keys: 'u8ineq', vars: ['x', 'y'] }], [c1, c2], ['y\\le ' + archEq(s), 'y\\ge 0'],
          t('y\\le ' + archEq(s)) + ' and ' + t('y\\ge 0'), 'On or under the arch: ' + t('y\\le ' + archEq(s)) + '. On or above the road (the ' + t('x') + '-axis): ' + t('y\\ge 0') + '.', ['Under a curve → ' + t('y\\le') + '; above the road → ' + t('y\\ge 0') + '.'], 'inequalities for a region');
        p.bad = [['y\\ge ' + archEq(s), 'y\\ge 0'], ['y<' + archEq(s), 'y\\le 0']]; return fin(p);
      } },
      { id: 'B4c', level: 'ADV', make: function (r, s) {
        var a = archA(s), z = pickWhere(function () { return { w: r.pick([2, 3, 4, 5, 6]), dl: r.pick([0.1, 0.2, 0.3]), yes: r.chance(0.5) }; }, function (q) { return q.w < s.W - 2; });
        var hA = s.H - a * (z.w / 2) * (z.w / 2), hL = Math.round((z.yes ? hA - z.dl : hA + z.dl) * 100) / 100, yes = hL <= hA, hW = s.H - a * z.w * z.w;
        return fin(yesNo(r, 'Will a load ' + t(z.w) + ' m wide and ' + t(dt(hL)) + ' m high, centred, fit through?', yes, 'Its top corners are at ' + t('x=\\pm ' + dt(z.w / 2)) + ', where the arch is ' + t(dt(hA)) + ' m high: the load fits.', 'Its top corners are at ' + t('x=\\pm ' + dt(z.w / 2)) + ' (half the width), where the arch is only ' + t(dt(hA)) + ' m high.',
          'Corner ' + t(ptT(z.w / 2, hL)) + ': ' + t('-' + dt(a) + '(' + dt(z.w / 2) + ')^{2}+' + s.H + '=' + dt(hA)) + '; ' + t(dt(hL) + '\\le ' + dt(hA)) + ' is ' + (yes ? 'true. It fits (with ' + dt(Math.round((hA - hL) * 100) / 100) + ' m to spare).' : 'false. It does not fit.'), ['A centred load ' + t(z.w) + ' m wide has its top corners at ' + t('x=\\pm ' + dt(z.w / 2)) + '.', 'Test a top corner in ' + t('y\\le ' + archEq(s)) + '.'], 'does it fit'));
      } },
      { id: 'B4d', level: 'ADV', make: function (r, s) {
        var a = archA(s), w = pickWhere(function () { return r.pick([2, 3, 4, 5, 6, 8]); }, function (q) { return q < s.W - 1; }), hm = s.H - a * (w / 2) * (w / 2), hb = s.H - a * w * w;
        var p = KP.approx('How high can a centred load ' + t(w) + ' m wide be? (Round to the nearest hundredth if needed.)', hm, 2, { after: 'm', diag: function (v) { return Math.abs(v - K.roundTo(hb, 2)) < 1e-9 ? { code: CP + 'arch-half', hint: 'A centred load ' + t(w) + ' m wide reaches ' + t(dt(w / 2)) + ' m to each side: use ' + t('x=' + dt(w / 2)) + '.' } : null; } },
          'At ' + t('x=' + dt(w / 2)) + ': ' + t('-' + dt(a) + '(' + dt(w / 2) + ')^{2}+' + s.H + '=' + dt(Math.round(hm * 1e6) / 1e6)) + ' m. The load can be at most <b>' + dt(K.roundTo(hm, 2)) + ' m</b> high.', ['The top corners of the load are at ' + t('x=\\pm ' + dt(w / 2)) + '.', 'The arch’s height there is the greatest height.'], 'tallest centred load');
        p.bad = [K.roundTo(hb, 2).toFixed(2), String(s.H)]; return fin(p);
      } }] },
    { num: 'B5', parts: [{ id: 'B5', level: 'EMG', make: function (r) {
      var s = pickWhere(function () { return { a: r.pick([-1, 1, -1, -2, 2]), m: r.int(1, 3), op: anyOp(r) }; }, function (z) { return Math.abs(z.a) * z.m * z.m <= 9 && !(z.a === -1 && z.m === 2) && !(z.a === 1 && z.m === 2); });
      var q = -s.a * s.m * s.m, Q = quad(s.a, 0, q), f = function (x) { return at(Q, x); }, wn = winFor(f, 0, { x: [-4, 4] });
      var svg = regSvg({ x: wn.x, y: wn.y, max: 220, curves: [{ f: f, dash: strictOp(s.op) }], shade: [{ f: f, side: upOp(s.op) ? 'above' : 'below' }], aria: 'a shaded region' });
      var opts = [{ html: t(showY(s.op, tx(Q))), right: true }, { html: t(showY(FLIP[s.op], tx(Q))), code: 'side', why: 'That is the region on the other side of the parabola.' },
        { html: t(showY(TOG[s.op], tx(Q))), code: 'line', why: strictOp(s.op) ? 'The boundary is dashed: ' + t('<') + ' or ' + t('>') + '.' : 'The boundary is solid: ' + t('\\le') + ' or ' + t('\\ge') + '.' },
        { html: t(showY(s.op, tx(P.neg(Q)))), code: 'open', why: 'That parabola opens ' + (s.a > 0 ? 'down' : 'up') + ' and has vertex ' + t(ptT(0, -q)) + '.' }];
      return fin(mcPart(r, 'The boundary of the shaded region has vertex ' + t(ptT(0, q)) + ' and ' + t('x') + '-intercepts ' + t('\\pm ' + s.m) + '. The inequality is' + fig(svg), opts,
        'The boundary is ' + t('y=' + tx(Q)) + ' (opens ' + (s.a > 0 ? 'up' : 'down') + '), ' + (strictOp(s.op) ? 'dashed' : 'solid') + ', shaded ' + (upOp(s.op) ? 'above' : 'below') + ': ' + t(showY(s.op, tx(Q))) + '.', ['Write the boundary from the vertex and an intercept.', 'Solid or dashed; above or below.'], 'inequality from a graph (MC)'));
    } }] },
    { num: 'B6', parts: [{ id: 'B6', level: 'PRG', make: function (r) {
      var s = pickWhere(function () { return { b: r.int(-5, 5), c: r.int(4, 16), x0: r.int(-3, 3), op: r.pick(['lt', 'le', 'lt']) }; }, function (z) { var v = -z.x0 * z.x0 + z.b * z.x0 + z.c; return z.x0 !== 0 && Math.abs(v) <= 14 && FRESH(quad(-1, z.b, z.c)); });
      var Q = quad(-1, s.b, s.c), v = at(Q, s.x0), ans = s.op === 'lt' ? v - 1 : v, other = s.op === 'lt' ? v : v - 1;
      var p = KP.nr(t('\\text{NR}') + ' The point ' + t('(' + s.x0 + ',\\ k)') + ' is in the solution region of ' + t(showY(s.op, tx(Q))) + ', and ' + t('k') + ' is an integer. The largest possible value of ' + t('k') + ' is', ans,
        function (x) { return x === other ? { code: CP + 'k-bound', hint: s.op === 'lt' ? 'The boundary is not included (' + t('<') + '): ' + t('k') + ' must be <b>less than</b> ' + t(v) + '.' : 'The boundary is included (' + t('\\le') + '): ' + t('k=' + v) + ' works.' } : null; },
        'At ' + t('x=' + s.x0) + ' the boundary is ' + t(tx(Q).replace(/x/g, '(' + s.x0 + ')') + '=' + v) + '. We need ' + t('k' + OPS[s.op] + v) + ', so ' + t('k=' + ans) + '.', ['Find the boundary’s height at ' + t('x=' + s.x0) + '.', t('<') + ' leaves the boundary out.'], 'largest k');
      p.bad = [String(other)]; return fin(p);
    } }] },
    { num: 'C1', section: 'C. Stretch', shared: function (r) {
        return pickWhere(function () { var x1 = r.int(-4, 0), x2 = r.int(1, 4); return { x1: x1, x2: x2, s: x1 + x2, m: r.int(1, 6) }; }, function (z) { z.n = -z.x1 * z.x2 - z.m; return z.s !== 0 && Math.abs(z.s) <= 2 && Math.abs(z.n) <= 8 && z.x2 - z.x1 >= 3 && !(z.m === 4 && z.s === 1 && z.n === 2); });
      }, stem: function (s) { return 'Consider the region that satisfies both ' + t('y\\ge x^{2}-' + s.m) + ' and ' + t('y\\le ' + tx(lin(s.s, s.n))) + '.'; }, parts: [
      { id: 'C1a', level: 'ADV', make: function (r, s) {
        var pts = [s.x1, s.x2].map(function (x) { return { x: x, y: s.s * x + s.n }; }), fp = function (x) { return x * x - s.m; }, fl = function (x) { return s.s * x + s.n; };
        var svg = regSvg({ x: [-5, 5], y: [-s.m - 2, Math.max(8, Math.ceil(Math.max(pts[0].y, pts[1].y)) + 2)], max: 220, curves: [{ f: fp }, { f: fl }], shade: [{ f: fp, side: 'above' }, { f: fl, side: 'below' }], aria: 'the region between a parabola and a line' });
        var sol = t('x^{2}-' + s.m + '=' + tx(lin(s.s, s.n))) + ', so ' + t(tx(quad(1, -s.s, -s.m - s.n)) + '=0') + ', ' + t(facT(1, s.x1, s.x2) + '=0') + ': ' + t('x=' + s.x1) + ' or ' + t('x=' + s.x2) + '.<br>Meeting points ' + pts.map(function (q) { return t(ptT(q.x, q.y)); }).join(' and ') + '. The region is above the parabola and below the line, between them (both boundaries solid).' + fig(svg);
        return fin(AK().pairsPart(CP, 'Find where the boundaries meet.', pts, { wrongs: [{ pts: [[-s.x1, -s.s * s.x1 + s.n], [-s.x2, -s.s * s.x2 + s.n]], code: CP + 'root-sign', hint: 'Check the signs of your roots.' }] }, sol, ['Set ' + t('x^{2}-' + s.m) + ' equal to ' + t(tx(lin(s.s, s.n))) + ' and solve.', 'Find each ' + t('y') + ' from the line.'], 'where the boundaries meet'));
      } },
      { id: 'C1b', level: 'MAS', make: function (r, s) {
        var x0 = pickWhere(function () { return r.int(s.x1 + 1, s.x2 - 1); }, function () { return true; }), lo = x0 * x0 - s.m, hi = s.s * x0 + s.n, n = hi - lo + 1;
        var p = KP.number('How many points with integer coordinates and ' + t('x=' + x0) + ' are in the region?', n, function (v) { return v === n - 1 || v === n + 1 || v === n - 2 ? { code: CP + 'lattice', hint: 'Both boundaries are solid, so ' + t('y=' + lo) + ' and ' + t('y=' + hi) + ' both count.' } : null; },
          'At ' + t('x=' + x0) + ': ' + t(vt(lo) + '\\le y\\le ' + vt(hi)) + ', so ' + t('y=' + lo + ',\\ ' + (lo + 1) + ',\\ \\dots,\\ ' + hi) + ': <b>' + n + '</b> points.', ['At ' + t('x=' + x0) + ', find the parabola’s and the line’s ' + t('y') + '.', 'Count the integers from the lower to the upper value, both included.'], 'count lattice points');
        p.bad = [String(n - 1), String(n + 1)]; return fin(p);
      } }] },
    { num: 'C2', parts: [{ id: 'C2', level: 'MAS', make: function (r) {
      var s = pickWhere(function () { return { p: nz(r, 1, 3), q: r.int(-6, 8), c: r.int(-5, 5), op: r.pick(['gt', 'gt', 'lt']) }; }, function (z) { var L = (z.q - z.c) / (z.p * z.p); return (z.op === 'gt' ? L > 0 : L < 0) && Math.abs(L) <= 6 && !(z.p === 2 && z.q === 3 && z.c === -1); });
      var L = (s.q - s.c) / (s.p * s.p), Lf = toFr(L), SETx = U.SET, T = s.op === 'gt' ? [sIv(-INF, 0, false, false), sIv(0, L, false, false)] : [sIv(L, 0, false, false), sIv(0, INF, false, false)];
      var noZ = s.op === 'gt' ? SETx.below(L, false) : SETx.above(L, false), rev = s.op === 'gt' ? SETx.above(L, false) : SETx.below(L, false);
      var sol = t(s.q + OPS[s.op] + 'a' + par(s.p) + '^{2}' + sgn(s.c)) + ', so ' + t((s.q - s.c) + OPS[s.op] + s.p * s.p + 'a') + ' and ' + t('a' + OPS[FLIP[s.op]] + fr(Lf[0], Lf[1])) + '.<br>The inequality must stay quadratic, so ' + t('a\\ne 0') + ': ' + t(setTex(T, 'a')) + ' (that is, ' + t('a' + OPS[FLIP[s.op]] + fr(Lf[0], Lf[1]) + ',\\ a\\ne 0') + ').';
      return fin(AK().setPart(CP, 'For what values of ' + t('a') + ' is the point ' + t(ptT(s.p, s.q)) + ' in the solution region of ' + t('y' + OPS[s.op] + 'ax^{2}' + sgn(s.c)) + '?', T, { v: 'a', wrongs: [{ parts: noZ, code: CP + 'a-zero', hint: 'Almost: if ' + t('a=0') + ' the inequality is not quadratic. Exclude ' + t('a=0') + '.' }, { parts: rev, code: CP + 'a-dir', hint: 'Substitute the point and solve for ' + t('a') + ' carefully: which way does the inequality point?' }] }, sol,
        ['Substitute ' + t('x=' + s.p) + ' and ' + t('y=' + s.q) + ', then solve for ' + t('a') + '.', 'A quadratic inequality needs ' + t('a\\ne 0') + '.'], 'values of a'));
    } }] },
    { num: 'C3', parts: [{ id: 'C3', level: 'MAS', make: function (r) {
      var s = { down: r.chance(0.6), out: r.chance(0.7), incl: r.chance(0.6) };
      // the region is named in words, not drawn
      var p = writeQ(r, 'intv', { aList: s.down ? [-1, -2, -1, -3] : [1, 2, 1, 3], noFig: true, text: 'write the inequality of a region', words: function (info) { var above = s.out ? info.a < 0 : info.a > 0; return above ? (s.incl ? 'ge' : 'gt') : (s.incl ? 'le' : 'lt'); } });
      var info = p.info;
      p.prompt = 'A parabola opens ' + (info.a < 0 ? 'down' : 'up') + ', has ' + t('x') + '-intercepts ' + t(info.r1) + ' and ' + t(info.r2) + ', and has vertex ' + t(ptT(info.h, info.k)) + '. Write the inequality whose solution region is the region <b>' + (s.out ? 'outside' : 'inside') + '</b> this parabola, ' + (s.incl ? 'boundary included' : 'boundary not included') + ', in general form.';
      p.solution += '<br>For a parabola that opens ' + (info.a < 0 ? 'down' : 'up') + ', ' + (s.out ? 'outside' : 'inside') + ' is ' + (upOp(p.op) ? 'above' : 'below') + '.';
      return p;
    } }] }
  ];

  HW.defineLesson({ id: LID, unit: 8, num: '5', title: 'Quadratic Inequalities in Two Variables', outcome: 'RF7', calc: true, questions: QUESTIONS, extra: EXTRA });
})(window);
