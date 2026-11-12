/* Math 20-1 · Unit 8 · Lesson 7 — Quadratic Inequalities in One Variable: Sign Analysis (outcome RF8 on every part)
 * Assignment 7 (m201book unit8/u8_l07.tex, Questions 1–18) and the Lesson 7 Extra Practice (u8_ep07.tex, A1–A5, B1–B6,
 * C1–C3). Every part is a generator: the booklet question's idea, form and difficulty with new numbers (contexts vary a
 * little); the lesson's example inequalities and the booklet question's own numbers are left out. Calculator lesson:
 * answers are exact unless a question asks to round.
 *
 * Students never draw a number line or a sign chart: they fill in the product row of a chart (a grid of +, 0, −), judge
 * test values (true / false), choose, or type the solution set. Solution sets are typed in set notation
 * {x | x < −2 or x > 3, x ∈ ℝ}, as a plain inequality "x < -2 or x > 3", or as intervals; "x ≠ 4", "x = 4", all real numbers
 * and "no solution" too (read by HW.sets, js/relfn.js, through the Unit 8 assessment kit's set checker). Exact radical
 * endpoints (−3 ± √5) are accepted as typed (each endpoint is evaluated), with a "give exact values" nudge for decimals.
 *
 * Kit HW.u8k78 (also used by u8l8.js, which loads after this file):
 *   numbers/polys  pickWhere, nz, gcd, vt, dt, fr, M, quad, lin, tx, br, par, at, OPS, FLIP, strictOp, upOp, holds
 *   factors        a product k·Π(m·x − n) as facs = [[m, n], …]: fpoly, rootsOf, valAt, facT, chartTex (a sign chart),
 *                  signSet (the solution set from the signs), chartGrid (fill the product row), testGrid (true/false per
 *                  test value), solveSol (the worked solution: sign chart, case analysis or test points)
 *   sets           sIv, SET, setTexX (booklet style, "x ≠ h" for a hole), setPart (the HW.u8assess set checker with this
 *                  key format), exactSetPart (radical endpoints), roundSetPart, nlSvg (a number line)
 *   codes          BASE (the Unit 8 test's labels and partial-credit decisions), register(cp)
 * The Unit 8 assessment kit HW.u8assess (js/lessons/u8test.js: set checker, inequality checker, ordered pairs, region
 * graphs) loads after the lesson files, so it is only used inside make() / check functions.
 *
 * Recognised mistakes (codes u8l7-…): only the case with both factors positive (case analysis), between instead of
 * outside (or the reverse), the sign not reversed after multiplying by a negative, roots included / excluded, roots with
 * the wrong signs, "and" for "or", only one of the two intervals, dividing both sides by x (losing the other piece),
 * taking a square root ("x < ±3"), perfect squares (x ≠ h / x = h / all / none confused), no real roots (all real numbers
 * vs no solution), the product row of a chart (a zero column, the negative constant ignored), a test value judged
 * wrongly, the negative time, the landing time included, the times instead of how long, integer counts with the
 * endpoints wrong, the equal-roots values of k, and the boundary value of c included.
 * Conversions: "show it on a number line" → the set only; "complete the sign chart" → its product row; "test points" →
 * true/false for one value per interval; "a graph" → the graph is drawn, the student reads the set; "show algebraically
 * that it never reaches 62 m" → the discriminant (a number); "explain the error" → the corrected solution set.
 * Booklet note: u8_l07 #8(c) gives 5 < t ≤ 6 for "below the cliff but not yet in the water"; here 5 < t < 6 (at t = 6
 * the stone is at the water), as Ryan asked.
 * Levels: LIM BEG EMG PRG ADV MAS. Mastery: 11, 13(a), 13(b), Extra C1, C2, C3. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, KP = K.P, P = HW.poly, ex = HW.ex, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
  var LID = 'u8l7', CP = 'u8l7-', INF = Infinity, RF8 = 'RF8';

  /* ======================================================================================================
   * The kit HW.u8k78
   * ====================================================================================================== */
  var U = HW.u8k78 = {};
  function A() { var a = HW.u8assess; if (!a) throw new Error('u8l7/u8l8 need js/lessons/u8test.js (HW.u8assess)'); return a; }
  U.A = A;

  /* the Unit 8 test's codes (u8test.js BASE), registered here for each practice prefix */
  var BASE = U.BASE = {
    'nosol-claim': ['Said “no solution” when the graphs meet', 'n'], 'none-missed': ['Gave solutions for a system with none', 'n'],
    'inf-claim': ['Said “infinitely many” for different graphs', 'n'], 'inf-missed': ['Missed that the equations are the same graph (infinitely many)', 'n'],
    'root-sign': ['Roots with the wrong signs (factoring sign slip)', 'b'], 'sys-y': ['Right x-values, wrong y-values', 's'],
    'sys-missing': ['Missed a solution of the system', 'b'], 'sys-extra': ['An extra pair that is not a solution', 'b'], 'pair-flip': ['Ordered pairs written (y, x)', 's'],
    'double-root': ['Treated a double root as two roots', 'b'], 'k-dir': ['Values of the constant: inequality the wrong way', 'b'],
    'k-incl': ['Values of the constant: included the tangent value', 's'], 'k-tangent': ['Gave only the tangent value of the constant', 'b'],
    'tan-one': ['Only one of the tangent slopes', 'b'], 'tan-pts': ['Tangent slopes right, points of tangency wrong', 's'],
    'qq-k': ['One solution: right k, wrong solution', 's'], 'balls-h': ['Same height: right time, wrong height', 's'], 'balls-t': ['Same height: wrong time', 'n'],
    'pq-q': ['Model from data: right p, wrong q', 's'], 'be-profit': ['Break-even right, maximum profit wrong', 's'],
    'pt-row': ['Misjudged whether a point is a solution', 'b'], 'pt-boundary': ['A point on the boundary: included/excluded wrong', 's'],
    'reg-side': ['Inequality the wrong way (wrong side shaded)', 'b'], 'reg-strict': ['Solid/dashed boundary wrong (≤ vs <)', 's'],
    'reg-rev': ['Did not reverse the sign when dividing by a negative', 'b'], 'reg-bound': ['Wrong boundary', 'n'], 'reg-slope': ['Boundary line: slope as run over rise', 'n'],
    'reg-a': ['Boundary parabola: did not solve for a', 'b'], 'ctx-round': ['Whole numbers: rounded the wrong way', 's'], 'ctx-corner': ['Gave the other coordinate of the corner', 's'],
    'arch-half': ['Arch: used the whole width instead of half', 'b'],
    'ineq-incl': ['Roots included/excluded wrong', 's'], 'ineq-side': ['Between the roots instead of outside (or the reverse)', 'b'], 'ineq-rev': ['Multiplied by a negative without reversing the sign', 'b'],
    'ineq-roots': ['Roots with the wrong signs', 'b'], 'ineq-case': ['Case analysis: only the case with both factors positive', 'b'], 'ineq-and': ['Joined the two pieces with “and”', 'b'],
    'ineq-none': ['Said “no solution” when there are solutions', 'n'], 'ineq-claim': ['Gave solutions when there are none', 'n'], 'ineq-all': ['Said all real numbers', 'n'],
    'ineq-sq': ['A perfect square: confused x ≠ h, x = h, all real numbers and no solution', 'b'], 'ineq-restr': ['Ignored the restriction of the context', 's'], 'ineq-sqrt': ['Took the square root and lost the negative side', 'b'], 'ineq-half': ['Gave only one of the two intervals', 'b'],
    'ineq-time': ['Gave the times instead of how long', 'b'], 'count-ends': ['Counted the integers with the endpoints wrong', 's'],
    'sign-row': ['Sign chart: product row wrong', 'n'],
    'exact': ['Decimals instead of exact values (format)', ''], 'xs-only': ['Gave x-values instead of ordered pairs (format)', ''], 'gen-form': ['Inequality not in general form (format)', ''],
    'pos-lead': ['Leading coefficient not positive (format)', ''], 'int-coef': ['Coefficients not integers (format)', ''], 'round': ['Not rounded as asked (format)', '']
  };
  U.register = function (cp, extra) {
    var codes = {}, part = {};
    Object.keys(BASE).forEach(function (k) { codes[cp + k] = BASE[k][0]; if (BASE[k][1]) part[cp + k] = BASE[k][1]; });
    Object.keys(extra || {}).forEach(function (k) { codes[cp + k] = extra[k][0]; if (extra[k][1]) part[cp + k] = extra[k][1]; });
    HW.addCodes(codes); HW.addPartial(part);
  };
  U.register(CP, {
    'chart-zero': ['Sign chart: the product is 0 only at a zero (and is 0 there)', 's'], 'chart-const': ['Sign chart: ignored the negative constant factor', 'b'], 'chart': ['Sign chart: a sign in the product row', 's'],
    'test': ['Test points: judged a test value wrongly', 's'], 'divx': ['Divided both sides by x (lost the other piece)', 'b'], 'neg-time': ['Gave the negative (inadmissible) time', 'b'],
    'land': ['Included the moment it reaches the water', 's'], 'disc': ['Discriminant: arithmetic or sign slip', 's'], 'ends': ['Greatest/least integer: endpoint wrong', 's'],
    'k-eq': ['Gave only the values of k with equal roots', 'b'], 'c-incl': ['Included the value of c with a double root', 's'], 'dur': ['Gave a time instead of how long', 'b'],
    'case-why': ['Explained the error with the wrong reason', 'n']
  });

  /* ---------------- numbers and polynomials ---------------- */
  function pickWhere(gen, test) { for (var i = 0; i < 20000; i++) { var o = gen(); if (o && test(o)) return o; } throw new Error('u8k78: no instance found'); }
  function nz(r, lo, hi) { return (r.chance(0.5) ? -1 : 1) * r.int(lo, hi); }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var x = a % b; a = b; b = x; } return a; }
  function fr(p, q) { return ex.texRat(ex.norm(p, q == null ? 1 : q)); }
  function toFr(x) { for (var q = 1; q <= 64; q++) { var p = Math.round(x * q); if (Math.abs(p / q - x) < 1e-9) return [p, q]; } return null; }
  function vt(x) { if (Math.abs(x) < 1e-12) x = 0; var f = toFr(x); return f ? fr(f[0], f[1]) : String(Math.round(x * 1000) / 1000); }
  function dt(x) { return String(Math.round(x * 1e6) / 1e6); }
  function M(c, v, e) { if (!e) return P.num(c); var o = {}; o[v] = e; return P.mono(c, o); }
  function quad(a, b, c, v) { return P.add(M(a, v || 'x', 2), M(b, v || 'x', 1), P.num(c)); }
  function lin(m, k, v) { return P.add(M(m, v || 'x', 1), P.num(k)); }
  function tx(p) { var s = P.tex(p); return s === '' ? '0' : s; }
  function br(p) { return '(' + tx(p) + ')'; }
  function par(n) { return n < 0 ? '(' + vt(n) + ')' : vt(n); }
  function at(p, x, v) { var e = {}; e[v || 'x'] = x; return P.at(p, e); }
  function near(a, b, tol) { return a === b || Math.abs(a - b) < (tol || 1e-9); }
  function coefT(c) { return c === 1 ? '' : c === -1 ? '-' : vt(c); }
  /* terms in a chosen order: [[coef, power], …] → "3 − 13x", "24 − 2x − x²" */
  function seqT(terms, v) { return P.seq(terms.map(function (c) { return M(c[0], v || 'x', c[1]); })); }
  var OPS = { lt: '<', le: '\\le ', gt: '>', ge: '\\ge ' }, FLIP = { lt: 'gt', le: 'ge', gt: 'lt', ge: 'le' };
  function strictOp(o) { return o === 'lt' || o === 'gt'; }
  function upOp(o) { return o === 'gt' || o === 'ge'; }
  function holds(v, op) { return op === 'lt' ? v < -1e-12 : op === 'le' ? v <= 1e-12 : op === 'gt' ? v > 1e-12 : v >= -1e-12; }
  function words(op) { return { lt: 'less than', le: 'at most', gt: 'more than', ge: 'at least' }[op]; }
  function OP(op) { return OPS[op]; }
  Object.assign(U, { pickWhere: pickWhere, nz: nz, gcd: gcd, fr: fr, toFr: toFr, vt: vt, dt: dt, M: M, quad: quad, lin: lin, tx: tx, br: br, par: par, at: at, near: near, coefT: coefT, seqT: seqT,
    OPS: OPS, FLIP: FLIP, strictOp: strictOp, upOp: upOp, holds: holds, words: words });

  /* ---------------- solution sets ---------------- */
  function sIv(lo, hi, lc, hc) { return { lo: lo, hi: hi, lc: lo === -INF ? false : !!lc, hc: hi === INF ? false : !!hc }; }
  var SET = {
    between: function (a, b, inc) { return [sIv(a, b, inc, inc)]; },
    outside: function (a, b, inc) { return [sIv(-INF, a, false, inc), sIv(b, INF, inc, false)]; },
    below: function (a, inc) { return [sIv(-INF, a, false, inc)]; }, above: function (a, inc) { return [sIv(a, INF, inc, false)]; },
    ne: function (h) { return [sIv(-INF, h, false, false), sIv(h, INF, false, false)]; }, pt: function (h) { return [sIv(h, h, true, true)]; },
    all: function () { return [sIv(-INF, INF, false, false)]; }, none: function () { return []; }
  };
  U.sIv = sIv; U.SET = SET;
  function sortP(a) { return a.slice().sort(function (x, y) { return x.lo - y.lo || x.hi - y.hi; }); }
  function partsEq(A1, B1, tol) {
    if (A1.length !== B1.length) return false;
    var a = sortP(A1), b = sortP(B1);
    return a.every(function (p, i) { var q = b[i]; return near(p.lo, q.lo, tol) && near(p.hi, q.hi, tol) && p.lc === q.lc && p.hc === q.hc; });
  }
  U.partsEq = partsEq;
  /* booklet style: {x | x < −6 or x > 4, x ∈ ℝ}; a hole between two pieces is written ", x ≠ h"; eT(value) → endpoint TeX */
  function setTexX(parts, v, eT) {
    v = v || 'x'; eT = eT || vt;
    var E = function (x) { return x === INF ? '\\infty' : x === -INF ? '-\\infty' : eT(x); };
    if (!parts.length) return '\\text{no solution}';
    var s = sortP(parts).map(function (p) { return { lo: p.lo, hi: p.hi, lc: p.lc, hc: p.hc }; }), holes = [], m = [];
    s.forEach(function (p) { var last = m[m.length - 1]; if (last && last.hi === p.lo && !last.hc && !p.lc && p.lo !== p.hi && last.lo !== last.hi) { holes.push(p.lo); last.hi = p.hi; last.hc = p.hc; } else m.push(p); });
    var tail = holes.map(function (h) { return v + '\\ne ' + E(h); });
    if (m.length === 1 && m[0].lo === -INF && m[0].hi === INF) return '\\{' + v + '\\mid ' + (tail.length ? tail.join(',\\ ') + ',\\ ' : '') + v + '\\in\\mathbb{R}\\}';
    var cond = m.map(function (p) {
      if (p.lo === p.hi) return v + '=' + E(p.lo);
      if (p.lo === -INF) return v + (p.hc ? '\\le ' : '<') + E(p.hi);
      if (p.hi === INF) return v + (p.lc ? '\\ge ' : '>') + E(p.lo);
      return E(p.lo) + (p.lc ? '\\le ' : '<') + v + (p.hc ? '\\le ' : '<') + E(p.hi);
    });
    if (m.length === 1 && m[0].lo === m[0].hi && !tail.length) return '\\{' + v + '\\mid ' + cond[0] + '\\}';
    return '\\{' + v + '\\mid ' + cond.join('\\text{ or }') + ',\\ ' + tail.map(function (x) { return x + ',\\ '; }).join('') + v + '\\in\\mathbb{R}\\}';
  }
  U.setTexX = setTexX;
  function complement(parts) {
    var s = sortP(parts), out = [], lo = -INF, lc = false;
    s.forEach(function (p) { if (lo < p.lo || (lo === p.lo && lc && !p.lc && lo !== -INF)) out.push(sIv(lo, p.lo, lc, !p.lc)); lo = p.hi; lc = !p.hc; });
    if (lo < INF) out.push(sIv(lo, INF, lc, false));
    return out;
  }
  U.complement = complement;
  /* a `bad` answer must be wrong for this version */
  function cleanBad(p) { p.bad = (p.bad || []).filter(function (b, i, arr) { if (arr.indexOf(b) !== i) return false; try { return p.check(b).v !== 'correct'; } catch (e) { return false; } }); return p; }
  U.cleanBad = cleanBad;
  /* the HW.u8assess set checker with the booklet-style key. o as u8assess setPart: { v, wrongs: [{ parts, code, hint }], rev, sideHint, inclHint, revHint, noneHint, claimHint, tol } + eT, alts (other accepted sets) */
  U.setPart = function (cp, prompt, T, o, sol, hints, text) {
    o = o || {};
    var V = o.v || 'x', p = A().setPart(cp, prompt, T, o, sol, hints, text), key = setTexX(T, V, o.eT);
    var base = p.check, alts = (o.alts || []).map(function (S) { return A().setPart(cp, '', S, { v: V, tol: o.tol }).check; });
    p.check = function (resp) { var res = base(resp); if (res.v !== 'correct') for (var i = 0; i < alts.length; i++) if (alts[i](resp).v === 'correct') return ok(); return res; };
    p.key = key; p.answer = t(key);
    p.bad = (p.bad || []).concat((o.wrongs || []).filter(function (w) { return w && w.parts; }).map(function (w) { return setTexX(w.parts, V, o.eT); }));
    if (T.length) p.bad.push(setTexX(complement(T), V, o.eT));
    return cleanBad(p);
  };

  /* typed radicals in a set answer: each endpoint like −3 − √5 is replaced by its value */
  var DELIM = /(\\leqslant|\\geqslant|\\leq|\\geq|\\le(?![a-zA-Z])|\\ge(?![a-zA-Z])|\\neq|\\ne(?![a-zA-Z])|\\lt(?![a-zA-Z])|\\gt(?![a-zA-Z])|<=|>=|!=|<|>|≤|≥|≠|=|\\text\{[^{}]*\}|\\mathrm\{[^{}]*\}|\\operatorname\{[^{}]*\}|\\mathbb\{R\}|\\mathbb R|\\in(?![a-zA-Z])|\\mid|\\vert|\\\{|\\\}|\\lbrace|\\rbrace|\\left|\\right|\\cup|\\infty|,|\||\bor\b|\band\b|\bin\b|∪|∞|ℝ|∈)/;
  function sqrtToNum(s) {
    var bits = String(s == null ? '' : s).split(DELIM), out = '';
    for (var i = 0; i < bits.length; i++) {
      var b = bits[i]; if (b == null) continue;
      if (i % 2 === 1 || !/sqrt|√/.test(b)) { out += b; continue; }
      var m = /^(\s*[([]?\s*)([\s\S]*?)(\s*[)\]]?\s*)$/.exec(b);
      var core = m[2].replace(/\\[,;: !]/g, '').replace(/√\s*\(([^()]*)\)/g, '\\sqrt{$1}').replace(/√\s*(\d+)/g, '\\sqrt{$1}').replace(/sqrt\s*\(([^()]*)\)/g, '\\sqrt{$1}');
      var p = ex.parse(core.trim()); if (!p.ok) return null;
      var v = ex.value(p.ast); if (!isFinite(v)) return null;
      out += m[1] + String(+v.toPrecision(15)) + m[3];
    }
    return out;
  }
  U.sqrtToNum = sqrtToNum;
  /* a + b√n as TeX (pm: ±) */
  function surdT(a, b, n, pm) {
    var s = a ? vt(a) : '', bb = Math.abs(b), rad = (bb === 1 ? '' : vt(bb)) + '\\sqrt{' + n + '}';
    if (pm) return s + (b < 0 ? '\\mp ' : '\\pm ') + rad;
    return s + (b < 0 ? '-' : a ? '+' : '') + rad;
  }
  U.surdT = surdT;
  /* exact radical endpoints: T's endpoints are h ± √n (texOf maps a value to its TeX) */
  U.exactSetPart = function (cp, prompt, T, texOf, o, sol, hints, text) {
    o = o || {};
    var V = o.v || 'x', eT = function (x) { var s = texOf(x); return s == null ? vt(x) : s; };
    var p = A().setPart(cp, prompt, T, Object.assign({}, o, { tol: 1e-7 }), sol, hints, text), base = p.check;
    var loose = A().setPart(cp, '', T, { v: V, tol: 0.006 }).check;
    p.check = function (resp) {
      var s = String(resp == null ? '' : resp);
      if (/sqrt|√/.test(s)) { var c = sqrtToNum(s); if (c == null) return form('set-unreadable', 'Write each endpoint like ' + t('-3-\\sqrt{5}') + ', e.g. ' + t('\\{' + V + '\\mid ' + V + '<2-\\sqrt{3}\\text{ or }' + V + '>2+\\sqrt{3},\\ ' + V + '\\in\\mathbb{R}\\}') + '.'); return base(c); }
      var res = base(resp); if (res.v === 'correct') return res;
      if (loose(resp).v === 'correct') return form('exact', 'Those endpoints are decimal approximations. Give the exact values (use ' + t('\\sqrt{\\ }') + ').');
      return res;
    };
    var key = setTexX(T, V, eT); p.key = key; p.answer = t(key);
    p.bad = [setTexX(complement(T), V, eT), '\\text{no solution}', setTexX(T, V, function (x) { return dt(Math.round(x * 100) / 100); })];
    return cleanBad(p);
  };
  /* rounded endpoints (dp decimals) of the exact set T */
  U.roundSetPart = function (cp, prompt, T, dp, o, sol, hints, text) {
    o = o || {};
    var V = o.v || 'x', rd = function (x) { return isFinite(x) ? K.roundTo(x, dp) : x; };
    var TR = T.map(function (q) { return sIv(rd(q.lo), rd(q.hi), q.lc, q.hc); }), altR = (o.alts || []).map(function (S) { return S.map(function (q) { return sIv(rd(q.lo), rd(q.hi), q.lc, q.hc); }); });
    var p = U.setPart(cp, prompt, TR, Object.assign({}, o, { tol: 1e-6, alts: altR, eT: function (x) { return Math.abs(x - Math.round(x)) < 1e-9 ? String(Math.round(x)) : K.roundTo(x, dp).toFixed(dp); } }), sol, hints, text), base = p.check;
    var loose = A().setPart(cp, '', T, { v: V, tol: 0.006 }).check, looseAlt = altR.map(function (S) { return A().setPart(cp, '', S, { v: V, tol: 0.006 }).check; });
    p.check = function (resp) {
      var s = String(resp == null ? '' : resp);
      if (/sqrt|√/.test(s)) return form('round', 'Right idea — now give each endpoint as a decimal, to the nearest ' + (dp === 1 ? 'tenth' : 'hundredth') + '.');
      var res = base(resp); if (res.v === 'correct') return res;
      if (loose(resp).v === 'correct' || looseAlt.some(function (c) { return c(resp).v === 'correct'; })) return form('round', 'Round each endpoint to the nearest ' + (dp === 1 ? 'tenth' : 'hundredth') + '.');
      return res;
    };
    return cleanBad(p);
  };

  /* ---------------- products of linear factors k·Π(m·v − n) ---------------- */
  function fpoly(k, facs, v) { return P.scale(facs.reduce(function (acc, f) { return P.mul(acc, lin(f[0], -f[1], v)); }, P.num(1)), k); }
  function rootsOf(facs) { var rs = []; facs.forEach(function (f) { var x = f[1] / f[0]; if (!rs.some(function (y) { return near(x, y); })) rs.push(x); }); return rs.sort(function (a, b) { return a - b; }); }
  function valAt(k, facs, x) { return facs.reduce(function (acc, f) { return acc * (f[0] * x - f[1]); }, k); }
  function groupsOf(facs) {
    var g = [];
    facs.forEach(function (f) { var h = g.filter(function (q) { return q.m === f[0] && q.n === f[1]; })[0]; if (h) h.e++; else g.push({ m: f[0], n: f[1], e: 1 }); });
    return g.filter(function (q) { return q.n === 0; }).concat(g.filter(function (q) { return q.n !== 0; }));
  }
  function facBase(g, v) { return g.n === 0 && g.m === 1 ? v : '(' + tx(lin(g.m, -g.n, v)) + ')'; }
  function facT(k, facs, v) {
    v = v || 'x';
    var s = groupsOf(facs).map(function (g) { return facBase(g, v) + (g.e > 1 ? '^{' + g.e + '}' : ''); }).join('');
    return (k === 1 ? '' : k === -1 ? '-' : vt(k)) + s;
  }
  function rootLab(x) { return vt(x); }
  /* the columns of a sign chart: intervals and zeros, each with a test value */
  function chartCols(rts, v) {
    v = v || 'x';
    if (!rts.length) return [{ lab: '\\text{all }' + v, x: 0, pt: false }];
    var cols = [], n = rts.length;
    cols.push({ lab: v + '<' + rootLab(rts[0]), x: Math.floor(rts[0]) - 1, pt: false });
    for (var i = 0; i < n; i++) {
      cols.push({ lab: rootLab(rts[i]), x: rts[i], pt: true });
      if (i < n - 1) { var a = rts[i], b = rts[i + 1], c = Math.floor(a) + 1; if (!(c > a + 1e-9 && c < b - 1e-9)) c = (a + b) / 2; cols.push({ lab: rootLab(a) + '<' + v + '<' + rootLab(b), x: c, pt: false }); }
    }
    cols.push({ lab: v + '>' + rootLab(rts[n - 1]), x: Math.ceil(rts[n - 1]) + 1, pt: false });
    return cols;
  }
  function sg(v) { return Math.abs(v) < 1e-12 ? '0' : v > 0 ? '+' : '-'; }
  /* KaTeX sign chart: a row for a constant k ≠ 1, one per factor (squared factors as one row), and the product */
  function chartTex(k, facs, v, hide) {
    v = v || 'x';
    var rts = rootsOf(facs), cols = chartCols(rts, v), rows = [];
    if (k !== 1) rows.push({ lab: vt(k), f: function () { return k; } });
    groupsOf(facs).forEach(function (g) { rows.push({ lab: facBase(g, v).replace(/^\((.*)\)$/, '$1') + (g.e > 1 ? '' : ''), f: function (x) { return Math.pow(g.m * x - g.n, g.e); }, sq: g.e > 1 ? facBase(g, v) + '^{' + g.e + '}' : null }); });
    rows.forEach(function (r) { if (r.sq) r.lab = r.sq; });
    rows.push({ lab: '\\text{Product}', f: function (x) { return valAt(k, facs, x); }, prod: true });
    var head = v + ' & ' + cols.map(function (c) { return c.lab; }).join(' & ');
    var body = rows.map(function (r) { return r.lab + ' & ' + cols.map(function (c) { return r.prod && hide ? '?' : sg(r.f(c.x)); }).join(' & '); });
    return '\\begin{array}{c|' + cols.map(function () { return 'c'; }).join('') + '}' + head + '\\\\\\hline ' + body.join('\\\\ ') + '\\end{array}';
  }
  function chartHtml(k, facs, v, hide) { return '<div class="u8k-chart" style="overflow-x:auto;max-width:100%">\\[' + chartTex(k, facs, v, hide) + '\\]</div>'; }
  /* the solution set of fn(x) op 0, fn changing sign only at rts */
  function signSet(fn, rts, op) {
    var seq = [], n = rts.length, i;
    for (i = 0; i <= n; i++) {
      var lo = i ? rts[i - 1] : -INF, hi = i < n ? rts[i] : INF, xt = lo === -INF ? (hi === INF ? 0 : hi - 1) : hi === INF ? lo + 1 : (lo + hi) / 2;
      seq.push({ lo: lo, hi: hi, pt: false, inc: holds(fn(xt), op) });
      if (i < n) seq.push({ lo: rts[i], hi: rts[i], pt: true, inc: holds(fn(rts[i]), op) });
    }
    var parts = [], cur = null;
    seq.forEach(function (s) {
      if (s.inc) { if (!cur) cur = { lo: s.lo, lc: s.pt, hi: s.hi, hc: s.pt }; else { cur.hi = s.hi; cur.hc = s.pt; } }
      else if (cur) { parts.push(sIv(cur.lo, cur.hi, cur.lc, cur.hc)); cur = null; }
    });
    if (cur) parts.push(sIv(cur.lo, cur.hi, cur.lc, cur.hc));
    return parts;
  }
  function facSet(k, facs, op) { return signSet(function (x) { return valAt(k, facs, x); }, rootsOf(facs), op); }
  function polySet(p, op, v) { // any quadratic (real roots or none)
    var e2 = {}, e1 = {}; e2[v || 'x'] = 2; e1[v || 'x'] = 1;
    var a = P.coef(p, e2), b = P.coef(p, e1), c = P.constant(p);
    var A2 = a[0] / a[1], B1 = b[0] / b[1], C0 = c[0] / c[1], D = B1 * B1 - 4 * A2 * C0, rts = [];
    if (D > 1e-12) rts = [(-B1 - Math.sqrt(D)) / (2 * A2), (-B1 + Math.sqrt(D)) / (2 * A2)].sort(function (x, y) { return x - y; });
    else if (Math.abs(D) <= 1e-12) rts = [-B1 / (2 * A2)];
    return signSet(function (x) { return at(p, x, v); }, rts, op);
  }
  Object.assign(U, { fpoly: fpoly, rootsOf: rootsOf, valAt: valAt, facT: facT, chartCols: chartCols, chartTex: chartTex, chartHtml: chartHtml, signSet: signSet, facSet: facSet, polySet: polySet });

  /* the product row of a sign chart (a grid: one of +, 0, − per column) */
  U.chartGrid = function (cp, prompt, k, facs, v, sol, hints, text) {
    v = v || 'x';
    var rts = rootsOf(facs), cols = chartCols(rts, v), want = {}, rows = cols.map(function (c, i) { return { id: 'c' + i, html: t(c.lab), label: c.lab }; });
    var ID = { '+': 'p', '0': 'z', '-': 'n' };
    cols.forEach(function (c, i) { want['c' + i] = ID[sg(valAt(k, facs, c.x))]; });
    var neg = k < 0;
    var part = KP.grid(prompt, rows, [{ id: 'p', html: t('+') }, { id: 'z', html: t('0') }, { id: 'n', html: t('-') }], want, {
      rowHead: 'Column', why: function (row, got, w) {
        var c = cols[Number(row.slice(1))];
        if (w === 'z') return { code: cp + 'chart-zero', hint: 'At ' + t(v + '=' + c.lab) + ' one factor is ' + t('0') + ', so the product is ' + t('0') + '.' };
        if (got === 'z') return { code: cp + 'chart-zero', hint: 'The product is ' + t('0') + ' only at a zero of a factor. In the column ' + t(c.lab) + ' no factor is ' + t('0') + ': multiply their signs.' };
        return { code: cp + 'chart', hint: 'In the column ' + t(c.lab) + ', multiply the signs of every factor' + (k !== 1 ? ', including the constant ' + t(vt(k)) : '') + ': an even number of negatives gives ' + t('+') + '.' };
      } }, sol, hints, text);
    var base = part.check;
    part.check = function (resp) {
      var res = base(resp); if (res.v === 'correct' || res.v === 'form') return res;
      resp = resp || {};
      var flipped = Object.keys(want).every(function (id) { var g = resp[id], w = want[id]; return w === 'z' ? g === 'z' : g === (w === 'p' ? 'n' : 'p'); });
      if (flipped && neg) return wrong(cp + 'chart-const', 'Every sign is the opposite of the product’s: the constant factor ' + t(vt(k)) + ' is negative everywhere, so it changes every sign.');
      return res;
    };
    var flip = {}; Object.keys(want).forEach(function (id) { flip[id] = want[id] === 'z' ? 'z' : want[id] === 'p' ? 'n' : 'p'; });
    var allP = {}; Object.keys(want).forEach(function (id) { allP[id] = want[id] === 'z' ? 'z' : 'p'; });
    part.bad = [flip, allP].filter(function (b) { return Object.keys(b).some(function (id) { return b[id] !== want[id]; }); });
    return part;
  };
  /* test points: is the inequality true at each test value? (one per interval) */
  U.testGrid = function (cp, prompt, fn, vals, op, show, v, sol, hints, text) {
    v = v || 'x';
    var rows = vals.map(function (x, i) { return { id: 'v' + i, html: t(v + '=' + vt(x)) }; }), want = {};
    vals.forEach(function (x, i) { want['v' + i] = holds(fn(x), op) ? 'T' : 'F'; });
    var part = KP.grid(prompt, rows, [{ id: 'T', html: 'True' }, { id: 'F', html: 'False' }], want, {
      rowHead: 'Test value', why: function (row) { var x = vals[Number(row.slice(1))], val = fn(x); return { code: cp + 'test', hint: 'Substitute ' + t(v + '=' + vt(x)) + ': the left side is ' + t(vt(val)) + ', and ' + t(vt(val) + OPS[op] + '0') + ' is ' + (holds(val, op) ? 'true' : 'false') + '.' }; } }, sol, hints, text);
    var flip = {}; Object.keys(want).forEach(function (id) { flip[id] = want[id] === 'T' ? 'F' : 'T'; });
    part.bad = [flip];
    return part;
  };

  /* worked solutions: 'chart' (sign chart), 'case' (case analysis, two linear factors), 'test' (test points), 'graph' */
  function testVals(rts) {
    if (!rts.length) return [0];
    var out = [Math.floor(rts[0]) - 1];
    for (var i = 0; i < rts.length - 1; i++) { var a = rts[i], b = rts[i + 1], c = Math.floor(a) + 1; if (!(c > a + 1e-9 && c < b - 1e-9)) c = (a + b) / 2; out.push(c); }
    out.push(Math.ceil(rts[rts.length - 1]) + 1);
    return out;
  }
  U.testVals = testVals;
  function intervalsWord(T, v) { return t(setTexX(T, v)); }
  U.solveSol = function (k, facs, op, method, v) {
    v = v || 'x';
    var rts = rootsOf(facs), E = fpoly(k, facs, v), fT = facT(k, facs, v), T = facSet(k, facs, op), s = '';
    var zs = rts.map(function (x) { return t(vt(x)); }).join(', ');
    if (method === 'case' && facs.length === 2 && k > 0) {
      var f = facs.slice().sort(function (p, q) { return p[1] / p[0] - q[1] / q[0]; }), a = f[0][1] / f[0][0], b = f[1][1] / f[1][0];
      var F1 = facBase({ m: f[0][0], n: f[0][1] }, v).replace(/^\((.*)\)$/, '$1'), F2 = facBase({ m: f[1][0], n: f[1][1] }, v).replace(/^\((.*)\)$/, '$1'), st = strictOp(op), G = st ? '>' : '\\ge ', L = st ? '<' : '\\le ';
      if (upOp(op)) {
        s = t(fT + OPS[op] + '0') + ': the factors have the same sign' + (st ? '' : ' (or one is ' + t('0') + ')') + '.<br>' +
          'Case 1: ' + t(F1 + G + '0') + ' and ' + t(F2 + G + '0') + ': ' + t(v + G + vt(a)) + ' and ' + t(v + G + vt(b)) + ', so ' + t(v + G + vt(b)) + '.<br>' +
          'Case 2: ' + t(F1 + L + '0') + ' and ' + t(F2 + L + '0') + ': ' + t(v + L + vt(a)) + ' and ' + t(v + L + vt(b)) + ', so ' + t(v + L + vt(a)) + '.<br>';
      } else {
        s = t(fT + OPS[op] + '0') + ': the factors have opposite signs' + (st ? '' : ' (or one is ' + t('0') + ')') + '.<br>' +
          'Case 1: ' + t(F1 + G + '0') + ' and ' + t(F2 + L + '0') + ': ' + t(v + G + vt(a)) + ' and ' + t(v + L + vt(b)) + ', so ' + t(vt(a) + L + v + L + vt(b)) + '.<br>' +
          'Case 2: ' + t(F1 + L + '0') + ' and ' + t(F2 + G + '0') + ': ' + t(v + L + vt(a)) + ' and ' + t(v + G + vt(b)) + ': impossible.<br>';
      }
      return s + 'Case 1 or Case 2: ' + intervalsWord(T, v) + '.';
    }
    if (method === 'test') {
      var vals = testVals(rts);
      s = 'Roots: ' + zs + '. Test one value in each interval: ' + vals.map(function (x) { var y = at(E, x, v); return t(v + '=' + vt(x)) + ': ' + t(vt(y)) + (holds(y, op) ? ' ✓' : ' ✗'); }).join('; ') + '.<br>';
      return s + 'The roots ' + (strictOp(op) ? 'are not included' : 'are included') + ': ' + intervalsWord(T, v) + '.';
    }
    s = (tx(E) !== fT ? t(tx(E) + '=' + fT) + '. ' : '') + 'Zeros ' + zs + '.' + chartHtml(k, facs, v);
    return s + 'The product is ' + (upOp(op) ? 'positive' : 'negative') + (strictOp(op) ? '' : ' or zero') + ' for ' + intervalsWord(T, v) + '.';
  };

  /* a number line with the set shown (integer window lo..hi; labels: the values to number) */
  U.nlSvg = function (parts, lo, hi, labels) {
    var W = 340, H = 52, pad = 22, y = 22, X = function (x) { return pad + (x - lo) / (hi - lo) * (W - 2 * pad); }, col = '#2b55a0';
    var s = '<svg class="graph-svg" viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" style="max-width:100%;height:auto" role="img" aria-label="number line">';
    s += '<rect width="' + W + '" height="' + H + '" fill="#fff"/>';
    s += '<line x1="6" y1="' + y + '" x2="' + (W - 6) + '" y2="' + y + '" stroke="#333" stroke-width="1.5"/>';
    s += '<polygon points="2,' + y + ' 10,' + (y - 4) + ' 10,' + (y + 4) + '" fill="#333"/><polygon points="' + (W - 2) + ',' + y + ' ' + (W - 10) + ',' + (y - 4) + ' ' + (W - 10) + ',' + (y + 4) + '" fill="#333"/>';
    for (var x = lo; x <= hi; x++) s += '<line x1="' + X(x).toFixed(1) + '" y1="' + (y - 5) + '" x2="' + X(x).toFixed(1) + '" y2="' + (y + 5) + '" stroke="#333" stroke-width="1"/>';
    (labels || []).forEach(function (v) { s += '<text x="' + X(v).toFixed(1) + '" y="' + (y + 21) + '" font-size="13" text-anchor="middle" font-family="sans-serif">' + String(v).replace('-', '−') + '</text>'; });
    parts.forEach(function (p) {
      var a = p.lo === -INF ? 4 : X(p.lo), b = p.hi === INF ? W - 4 : X(p.hi);
      s += '<line x1="' + a.toFixed(1) + '" y1="' + y + '" x2="' + b.toFixed(1) + '" y2="' + y + '" stroke="' + col + '" stroke-width="5"/>';
      if (p.lo === -INF) s += '<polygon points="0,' + y + ' 11,' + (y - 7) + ' 11,' + (y + 7) + '" fill="' + col + '"/>';
      if (p.hi === INF) s += '<polygon points="' + W + ',' + y + ' ' + (W - 11) + ',' + (y - 7) + ' ' + (W - 11) + ',' + (y + 7) + '" fill="' + col + '"/>';
    });
    parts.forEach(function (p) {
      [[p.lo, p.lc], [p.hi, p.hc]].forEach(function (e) { if (isFinite(e[0])) s += '<circle cx="' + X(e[0]).toFixed(1) + '" cy="' + y + '" r="6" fill="' + (e[1] ? col : '#fff') + '" stroke="' + col + '" stroke-width="2.5"/>'; });
    });
    return '<div class="fig">' + s + '</svg></div>';
  };

  /* ---------------- choosing factors ---------------- */
  /* the roots of the lesson's examples and of the booklet questions (assignment and extra practice): never generated */
  var AVOID = ['-2,3', '-7,3', '-2,5', '-2/3,1/2', '-8,2', '-3,5', '5', '-3/2', '-4,3', '-6,-1', '-1/2,3', '0,7', '2,6', '0,8', '10,40', '-2,1,4', '-1,2',
    '-4,2', '3,6', '-6,4', '-7,7', '0,5', '-5,3/2', '-3/2,1/5', '0,3', '-4,7', '-2,6', '-3/2,1/2', '-4', '1/3', '-3,7', '-3,4', '-8,0', '-3/4,2', '-4,1,3', '0,3', '-1,4', '-1/2,4', '-3,6', '-1,6', '1,4', '10,20', '14,16', '8,12',
    '-1,5', '-5,0', '-5/2,5/2', '-2/3,3', '-1/2,5', '-3/2,3', '2/3,3/2', '-7', '2/5', '-7,1', '2/3,5', '5,10', '-5,3', '-3,1,5', '-1,2'];
  function rkey(facs) { return rootsOf(facs).map(function (x) { var f = toFr(x); return f[1] === 1 ? String(f[0]) : f[0] + '/' + f[1]; }).join(','); }
  function fresh(facs, extra) { var k = rkey(facs); return AVOID.indexOf(k) < 0 && (extra || []).indexOf(k) < 0; }
  U.rkey = rkey; U.fresh = fresh; U.AVOID = AVOID;
  /* two integer roots a < b */
  function intFacs(r, o) {
    o = o || {};
    return pickWhere(function () { var a = r.int(o.lo == null ? -8 : o.lo, o.hi == null ? 8 : o.hi), b = r.int(o.lo == null ? -8 : o.lo, o.hi == null ? 8 : o.hi); return a < b ? [[1, a], [1, b]] : null; },
      function (f) { var a = f[0][1], b = f[1][1]; return b - a >= (o.gap || 2) && b - a <= (o.maxGap || 20) && (!o.noZero || (a !== 0 && b !== 0)) && (!o.zero || a === 0 || b === 0) && Math.abs(a * b) <= (o.prod || 48) && Math.abs(a + b) <= (o.sum || 14) && (!o.noOpp || a !== -b) && (!o.test || o.test(a, b)) && fresh(f, o.avoid); });
  }
  /* one root p/q (q ≥ 2) and one integer root (or a second fraction when o.two) */
  function fracFacs(r, o) {
    o = o || {};
    return pickWhere(function () {
      var q = r.pick(o.qs || [2, 3, 2, 4, 5, 3]), p = nz(r, 1, o.pmax || 9), f = [[q, p]];
      if (o.two) { var q2 = r.pick(o.qs2 || [2, 3]), p2 = nz(r, 1, 7); f.push([q2, p2]); } else f.push([1, r.int(o.lo == null ? -7 : o.lo, o.hi == null ? 7 : o.hi)]);
      return f;
    }, function (f) {
      if (gcd(f[0][0], f[0][1]) !== 1 || f[0][0] < 2) return false;
      if (o.two && (gcd(f[1][0], f[1][1]) !== 1 || f[1][0] < 2)) return false;
      var rs = rootsOf(f); if (rs.length < 2 || rs[1] - rs[0] < 0.4) return false;
      var E = fpoly(1, f), c = P.constant(E), b = P.coef(E, { x: 1 });
      return Math.abs(c[0] / c[1]) <= (o.cmax || 40) && Math.abs(b[0] / b[1]) <= (o.bmax || 30) && (!o.test || o.test(f)) && fresh(f, o.avoid);
    });
  }
  U.intFacs = intFacs; U.fracFacs = fracFacs;
  function rndOp(r, list) { return r.pick(list || ['lt', 'le', 'gt', 'ge']); }

  /* ======================================================================================================
   * Parts for this lesson
   * ====================================================================================================== */
  var H_SOLVE = ['Move every term to one side so the other side is ' + t('0') + ', and factor.', 'Find the zeros and use the signs of the factors on each interval (a sign chart). Include the zeros for ' + t('\\le') + ' and ' + t('\\ge') + '.'];
  var H_NEG = ['Multiply both sides by ' + t('-1') + ' and <b>reverse</b> the inequality sign (or keep the negative constant as a row of the sign chart).', 'Factor, find the zeros and use a sign chart.'];
  var PROMPT_SET = ' Write the solution in set notation.';
  /* solve k·Π op 0 shown as `show`; o: { method, pre, rev, wrongs, hints, text, v, prompt, sideHint } */
  function solvePart(k, facs, op, show, o) {
    o = o || {};
    var v = o.v || 'x', T = facSet(k, facs, op), rts = rootsOf(facs);
    var sol = (o.pre || '') + U.solveSol(o.rev ? -k : k, facs, o.rev ? FLIP[op] : op, o.method || 'chart', v);
    var tv = testVals(rts), E = fpoly(k, facs, v);
    var sideHint = o.sideHint || 'Right zeros, wrong intervals. Test a value in each interval in the original inequality: ' + tv.map(function (x) { var y = at(E, x, v); return t(v + '=' + vt(x)) + ' gives ' + t(vt(y)) + (holds(y, op) ? ' ✓' : ' ✗'); }).join(', ') + '.';
    return U.setPart(CP, (o.prompt || 'Solve ' + t(show) + '.') + PROMPT_SET, T, { v: v, wrongs: o.wrongs || [], rev: !!o.rev, sideHint: sideHint, revHint: o.revHint }, sol, o.hints || (o.rev ? H_NEG : H_SOLVE), o.text || 'solve a quadratic inequality');
  }
  U.solvePart = function (cp, k, facs, op, show, o) { var save = CP; CP = cp; try { return solvePart(k, facs, op, show, o); } finally { CP = save; } };
  function exT(k, facs, op, v) { return tx(fpoly(k, facs, v)) + OPS[op] + '0'; }
  function caseWrong(k, facs, op) { // product > 0: only "both positive" → x > larger root
    var rts = rootsOf(facs); if (!(upOp(op) === (k > 0)) || rts.length !== 2) return null;
    return { parts: SET.above(rts[1], !strictOp(op)), code: CP + 'ineq-case', hint: 'That is Case 1 only. A product is also positive when <b>both</b> factors are negative: Case 2 gives ' + t('x' + (strictOp(op) ? '<' : '\\le ') + vt(rts[0])) + '.' };
  }

  /* ---- Q1 / A1: case analysis ---- */
  function caseQ(r, same, factored) {
    var op = same ? rndOp(r, ['gt', 'ge']) : rndOp(r, ['lt', 'le']);
    var f = intFacs(r, { lo: -8, hi: 9, noZero: true, gap: 2 });
    var show = factored ? (r.chance(0.5) ? facT(1, f) : facT(1, [f[1], f[0]])) + OPS[op] + '0' : exT(1, f, op);
    var pre = factored ? '' : 'Factor: ' + t(facT(1, f) + OPS[op] + '0') + '.<br>';
    return solvePart(1, f, op, show, { method: 'case', pre: pre, prompt: 'Solve ' + t(show) + ' by case analysis.', wrongs: [caseWrong(1, f, op)].filter(Boolean),
      hints: ['Factor. A product is ' + (same ? 'positive when both factors have the same sign' : 'negative when the factors have opposite signs') + '.', 'Write the two cases as pairs of linear inequalities (“and”: keep the overlap), then join the cases with “or”.'], text: 'case analysis' });
  }

  /* ---- Q2: sign charts ---- */
  function chartShared(r) { var f = intFacs(r, { lo: -8, hi: 8, noZero: true, gap: 3 }); return { f: f, op: rndOp(r) }; }
  function rearrSol(E, op, v) { return 'Rearrange: ' + t(tx(E) + OPS[op] + '0') + '.<br>'; }

  /* ---- Q5: perfect squares and no real roots ---- */
  function sqQ(r, o) {
    var s = pickWhere(function () { return { m: o.m ? r.pick(o.m) : 1, n: nz(r, 1, 8) }; }, function (z) { return gcd(z.m, z.n) === 1 && fresh([[z.m, z.n], [z.m, z.n]], o.avoid); });
    var facs = [[s.m, s.n], [s.m, s.n]], k = o.neg ? -1 : 1, op = rndOp(r, o.ops), E = fpoly(k, facs), h = s.n / s.m, T = facSet(k, facs, op);
    var sq = '(' + tx(lin(s.m, -s.n)) + ')^{2}';
    var sol = t(tx(E) + '=' + (o.neg ? '-' : '') + sq) + (o.neg ? ', which is never positive' : ', a square: never negative') + ', and ' + t('0') + ' only at ' + t('x=' + vt(h)) + '.<br>' + (T.length ? t(setTexX(T)) : '<b>No solution</b>') + '.';
    var wr = [SET.ne(h), SET.pt(h), SET.all(), SET.none()].map(function (w) { return { parts: w, code: CP + 'ineq-sq', hint: 'Think about the square ' + t(sq) + ': it is never negative, and it is ' + t('0') + ' only at ' + t('x=' + vt(h)) + '. Which values make ' + t(exT(k, facs, op)) + ' true?' }; });
    return U.setPart(CP, 'Solve ' + t(tx(E) + OPS[op] + '0') + '. (Type “no solution” if no real number works.)', T, { wrongs: wr }, sol,
      ['Factor: it is a perfect square.', 'A square is never negative and is ' + t('0') + ' at one value only.'], 'a perfect square');
  }
  function noRootQ(r, o) {
    var z = pickWhere(function () { return { a: r.pick(o.a), b: r.int(-7, 7), c: r.int(-12, 12) }; }, function (q) { return q.b * q.b - 4 * q.a * q.c < 0 && q.b !== 0 && !(q.a === 1 && q.b === 1 && q.c === 3) && !(q.a === 2 && q.b === -3 && q.c === 5) && !(q.a === 1 && q.b === -4 && q.c === 7) && !(q.a === -1 && q.b === 6 && q.c === -10); });
    var E = quad(z.a, z.b, z.c), op = rndOp(r, o.ops), T = polySet(E, op), D = z.b * z.b - 4 * z.a * z.c;
    var sol = t('b^{2}-4ac=' + par(z.b) + '^{2}-4(' + vt(z.a) + ')' + par(z.c) + '=' + D + '<0') + ': no real zeros, so ' + t(tx(E)) + ' has one sign for every ' + t('x') + '. Test ' + t('x=0') + ': ' + t(vt(z.c) + OPS[op] + '0') + ' is ' + (holds(z.c, op) ? 'true' : 'false') + '.<br>' + (T.length ? 'All real numbers: ' + t(setTexX(T)) + '.' : '<b>No solution.</b>');
    return U.setPart(CP, 'Solve ' + t(tx(E) + OPS[op] + '0') + '. (Type “no solution” if no real number works.)', T, { claimHint: 'Test ' + t('x=0') + ': ' + t(vt(z.c) + OPS[op] + '0') + ' is false, and with no real zeros the sign never changes: no solution.', noneHint: 'Test ' + t('x=0') + ': ' + t(vt(z.c) + OPS[op] + '0') + ' is true, and with no real zeros the sign never changes: every real number works.' }, sol,
      ['Check the discriminant ' + t('b^{2}-4ac') + ': are there real zeros?', 'No real zeros: the expression has the same sign everywhere. Test one value, such as ' + t('x=0') + '.'], 'no real roots');
  }
  /* irrational zeros h ± √n: E = (x − h)² − n */
  function surdShared(r, avoid) {
    return pickWhere(function () { return { h: nz(r, 1, 5), n: r.pick([2, 3, 5, 6, 7, 10, 11, 13]), op: rndOp(r) }; }, function (z) { return Math.abs(z.h * z.h - z.n) <= 30 && z.h * z.h !== z.n && !(z.h === -3 && z.n === 5) && !(z.h === 1 && z.n === 5) && !(z.h === 3 && z.n === 5) && !(avoid && avoid(z)); });
  }
  function surdParts(o, v) {
    var E = quad(1, -2 * o.h, o.h * o.h - o.n, v), r1 = o.h - Math.sqrt(o.n), r2 = o.h + Math.sqrt(o.n), T = signSet(function (x) { return at(E, x, v); }, [r1, r2], o.op);
    var texOf = function (x) { return near(x, r1, 1e-7) ? surdT(o.h, -1, o.n) : near(x, r2, 1e-7) ? surdT(o.h, 1, o.n) : null; };
    return { E: E, r1: r1, r2: r2, T: T, texOf: texOf };
  }
  function surdSol(o, S, v) {
    v = v || 'x';
    var b = -2 * o.h, c = o.h * o.h - o.n, D = b * b - 4 * c;
    return 'It does not factor. Zeros: ' + t(v + '=\\dfrac{' + vt(-b) + '\\pm\\sqrt{' + D + '}}{2}=' + surdT(o.h, 1, o.n, true)) + '.<br>' + (upOp(o.op) ? 'Positive outside' : 'Negative between') + ' the zeros (' + t('a>0') + '): ' + t(setTexX(S.T, v, S.texOf)) + '.';
  }

  /* ---- Q7 / B1: write the inequality ---- */
  function writePart(r, o) {
    var f = o.frac ? fracFacs(r, { qs: [2, 3, 4, 5], pmax: 7, lo: -6, hi: 6, avoid: o.avoid, test: o.test }) : intFacs(r, { lo: -9, hi: 9, gap: 2, zero: o.zero, noZero: !o.zero && !o.any, test: o.test2 });
    var out = o.out, inc = o.inc, rts = rootsOf(f), op = out ? (inc ? 'ge' : 'gt') : (inc ? 'le' : 'lt'), T = facSet(1, f, op), E = fpoly(1, f);
    var shown = o.line ? 'the solution shown on the number line' + U.nlSvg(T, Math.floor(rts[0]) - 3, Math.ceil(rts[1]) + 3, rts) : t(setTexX(T));
    var sol = 'Endpoints ' + rts.map(function (x) { return t(vt(x)); }).join(' and ') + ' give the factors ' + groupsOf(f).map(function (g) { return t(facBase(g, 'x')); }).join(' and ') + '. ' + (out ? 'Outside' : 'Between') + ', ' + (inc ? 'closed' : 'open') + ': ' + t(facT(1, f) + OPS[op] + '0') + ', so ' + t(tx(E) + OPS[op] + '0') + '.<br>(With a positive leading coefficient the product is negative between its zeros and positive outside them.)';
    return A().ineqPart(CP, 'Write a quadratic inequality with integer coefficients and a positive leading coefficient that has ' + (o.line ? shown : 'the solution ' + shown) + '.', E, op, tx(E) + OPS[op] + '0',
      { vars: ['x'], posLead: true, intCoef: true, ph: 'x^2 - 3x - 10 <= 0', example: 'x^{2}-3x-10\\le 0',
        sideHint: 'Right zeros, but the inequality points the wrong way: with a positive leading coefficient, the product is negative <b>between</b> its zeros and positive outside.',
        strictHint: 'Check the endpoints: ' + (inc ? 'they are included (closed dots), so use ' + t('\\le') + ' or ' + t('\\ge') + '.' : 'they are not included (open dots), so use ' + t('<') + ' or ' + t('>') + '.'),
        boundHint: 'Check your zeros: each endpoint ' + t('r') + ' gives a factor ' + t('(x-r)') + (o.frac ? ', and an endpoint ' + t('\\frac{p}{q}') + ' gives ' + t('(qx-p)') : '') + '.' }, sol,
      ['Each endpoint is a zero: write a factor for each one' + (o.frac ? ' (clear the fraction: ' + t('x=\\frac{p}{q}') + ' gives ' + t('qx-p') + ')' : '') + '.', 'Between the zeros → ' + t('<0') + ' (or ' + t('\\le 0') + '); outside → ' + t('>0') + ' (or ' + t('\\ge 0') + '). Then expand.'], 'write an inequality from its solution');
  }

  /* ---- MC helpers ---- */
  function mcSet(r, prompt, rightT, wrongs, sol, hints, text) {
    var opts = [{ html: t(setTexX(rightT).replace(/^\\\{x\\mid /, '').replace(/,\\ x\\in\\mathbb\{R\}\\\}$/, '')), right: true }];
    wrongs.forEach(function (w, i) { opts.push({ html: t(setTexX(w.T).replace(/^\\\{x\\mid /, '').replace(/,\\ x\\in\\mathbb\{R\}\\\}$/, '')), why: w.why, code: w.code || 'w' + i }); });
    return KP.mc(r, prompt, opts, sol, hints, text);
  }

  U.mcSet = mcSet; U.writePart = function (cp, r, o) { var save = CP; CP = cp; try { return writePart(r, o); } finally { CP = save; } };
  U.sqQ = function (cp, r, o) { var save = CP; CP = cp; try { return sqQ(r, o); } finally { CP = save; } };
  U.noRootQ = function (cp, r, o) { var save = CP; CP = cp; try { return noRootQ(r, o); } finally { CP = save; } };
  U.exT = exT; U.rndOp = rndOp; U.chartHtml = chartHtml; U.groupsOf = groupsOf;

  /* ======================================================================================================
   * Assignment 7
   * ====================================================================================================== */
  var QUESTIONS = [
    { num: '1', stem: 'Solve by case analysis. Write each solution in set notation.', parts: [
      { id: '1a', level: 'BEG', make: function (r) { return caseQ(r, false, true); } },
      { id: '1b', level: 'BEG', make: function (r) { return caseQ(r, true, false); } }] },

    { num: '2', shared: chartShared, parts: [
      { id: '2a', sub: 'a i', level: 'BEG', make: function (r, s) {
        var E = fpoly(1, s.f);
        return U.chartGrid(CP, 'Complete the sign chart for ' + t(tx(E) + OPS[s.op] + '0') + ', where ' + t(tx(E) + '=' + facT(1, s.f)) + ': choose the sign of the <b>product</b> in each column.' + chartHtml(1, s.f, 'x', true), 1, s.f, 'x',
          'Zeros ' + rootsOf(s.f).map(function (x) { return t(vt(x)); }).join(' and ') + '. In each column multiply the signs of the factors (at a zero the product is ' + t('0') + '):' + chartHtml(1, s.f, 'x'),
          ['At a zero, one factor is ' + t('0') + ', so the product is ' + t('0') + '.', 'Elsewhere, multiply the signs: ' + t('(-)(-)=+') + ', ' + t('(-)(+)=-') + ', ' + t('(+)(+)=+') + '.'], 'sign chart: product row');
      } },
      { id: '2a2', sub: 'a ii', level: 'BEG', make: function (r, s) { return solvePart(1, s.f, s.op, exT(1, s.f, s.op), { prompt: 'Use the sign chart to solve ' + t(exT(1, s.f, s.op)) + '.', text: 'solve from the sign chart' }); } },
      { id: '2b', sub: 'b', level: 'BEG', make: function (r) {
        var n = pickWhere(function () { return r.int(2, 12); }, function (x) { return x !== 7 && x !== 5; }), f = [[1, -n], [1, n]], op = rndOp(r);
        return solvePart(1, f, op, exT(1, f, op), { prompt: 'Solve ' + t(exT(1, f, op)) + ' with a sign chart.', text: 'difference of squares',
          wrongs: [{ parts: upOp(op) ? SET.above(n, !strictOp(op)) : SET.below(n, !strictOp(op)), code: CP + 'ineq-sqrt', hint: 'Taking the square root loses the negative side. Factor ' + t(facT(1, f)) + ' and use both zeros.' }] });
      } },
      { id: '2c', sub: 'c', level: 'EMG', make: function (r) {
        var s = pickWhere(function () { return { k: r.int(2, 6), n: nz(r, 1, 9) }; }, function (z) { return !(z.k === 3 && z.n === 5) && fresh([[1, 0], [1, z.n]]); });
        var f = [[1, 0], [1, s.n]], op = rndOp(r);
        return solvePart(s.k, f, op, exT(s.k, f, op), { prompt: 'Solve ' + t(exT(s.k, f, op)) + ' with a sign chart.', text: 'common factor', pre: 'Common factor: ' + t(facT(s.k, f) + OPS[op] + '0') + ' (the positive constant ' + t(s.k) + ' does not change any sign).<br>' });
      } },
      { id: '2d', sub: 'd', level: 'PRG', make: function (r) {
        var f = fracFacs(r, { qs: [2, 3, 2, 3, 4, 5], pmax: 9 }), op = rndOp(r);
        return solvePart(1, f, op, exT(1, f, op), { prompt: 'Solve ' + t(exT(1, f, op)) + ' with a sign chart.', text: 'non-monic, sign chart' });
      } }] },

    { num: '3', stem: 'Rearrange so one side is ' + t('0') + ', then solve.', parts: [
      { id: '3a', level: 'PRG', make: function (r) {
        var f = fracFacs(r, { qs: [2, 3, 5], two: r.chance(0.5), qs2: [2, 3, 5], pmax: 7, test: function (g) { var E = fpoly(1, g); return P.constant(E)[0] !== 0 && P.coef(E, { x: 1 })[0] !== 0; } }), op = rndOp(r), E = fpoly(1, f);
        var a2 = P.coef(E, { x: 2 }), b1 = P.coef(E, { x: 1 }), c0 = P.constant(E), show = tx(M(a2[0] / a2[1], 'x', 2)) + OPS[op] + seqT([[-c0[0] / c0[1], 0], [-b1[0] / b1[1], 1]]);
        return solvePart(1, f, op, show, { pre: rearrSol(E, op), text: 'rearrange, then solve' });
      } },
      { id: '3b', level: 'EMG', make: function (r) {
        var s = pickWhere(function () { return { k: r.int(2, 6), n: nz(r, 1, 8) }; }, function (z) { return !(z.k === 4 && z.n === 3) && fresh([[1, 0], [1, z.n]]); });
        var f = [[1, 0], [1, s.n]], op = rndOp(r), show = tx(M(s.k, 'x', 2)) + OPS[op] + tx(M(s.k * s.n, 'x', 1)), inc = !strictOp(op);
        return solvePart(s.k, f, op, show, { pre: 'Rearrange: ' + t(exT(s.k, f, op)) + ', so ' + t(facT(s.k, f) + OPS[op] + '0') + '. (Dividing both sides by ' + t('x') + ' would lose part of the solution: ' + t('x') + ' can be negative.)<br>', text: 'don’t divide by x',
          wrongs: [{ parts: upOp(op) ? SET.above(s.n, inc) : SET.below(s.n, inc), code: CP + 'divx', hint: 'Dividing both sides by ' + t('x') + ' only works when ' + t('x>0') + ' (a negative ' + t('x') + ' reverses the sign). Move everything to one side and factor out ' + t(s.k + 'x') + ' instead.' }] });
      } },
      { id: '3c', level: 'PRG', make: function (r) {
        var f = intFacs(r, { lo: -9, hi: 9, noZero: true, gap: 2, test: function (a, b) { return a + b !== 0 && !(a + b === -6 && a * b === -16) && !(a + b === 3 && a * b === -28); } }), op = rndOp(r), u = -(f[0][1] + f[1][1]), c = -f[0][1] * f[1][1];
        var show = 'x(' + tx(lin(1, u)) + ')' + OPS[op] + vt(c);
        return solvePart(1, f, op, show, { pre: 'Expand and rearrange: ' + t(tx(quad(1, u, 0)) + OPS[op] + vt(c)) + ', so ' + t(exT(1, f, op)) + '.<br>', text: 'expand, rearrange, solve',
          wrongs: [{ parts: upOp(op) ? SET.above(c, !strictOp(op)) : SET.below(c, !strictOp(op)), code: CP + 'ineq-side', hint: 'Each factor is not compared with ' + t(vt(c)) + ': a product being ' + t(OPS[op].trim() + vt(c)) + ' says nothing about its factors alone. Move ' + t(vt(c)) + ' to the left side and factor.' }] });
      } },
      { id: '3d', level: 'PRG', make: function (r) {
        var z = pickWhere(function () { var f = intFacs(r, { lo: -8, hi: 9, gap: 2, noZero: true }); return { f: f, u: nz(r, 1, 4) }; }, function (q) { var m = 2 * q.u + q.f[0][1] + q.f[1][1]; return m !== 0 && !(q.u === -1 && m === 2); });
        var a = z.f[0][1], b = z.f[1][1], m = 2 * z.u + a + b, c = z.u * z.u - a * b, op = rndOp(r);
        var show = '(' + tx(lin(1, z.u)) + ')^{2}' + OPS[op] + tx(lin(m, c));
        return solvePart(1, z.f, op, show, { pre: 'Expand: ' + t(tx(quad(1, 2 * z.u, z.u * z.u)) + OPS[op] + tx(lin(m, c))) + ', so ' + t(exT(1, z.f, op)) + '.<br>', text: 'expand a square, rearrange, solve' });
      } }] },

    { num: '4', stem: 'Solve. Each has a negative leading coefficient.', parts: [
      { id: '4a', level: 'PRG', make: function (r) {
        var f = intFacs(r, { lo: -8, hi: 8, gap: 3, noZero: true, test: function (a, b) { return a + b !== 0; } }), op = rndOp(r), E = fpoly(-1, f);
        var show = seqT([[P.constant(E)[0], 0], [P.coef(E, { x: 1 })[0], 1], [-1, 2]]) + OPS[op] + '0';
        return solvePart(-1, f, op, show, { rev: true, pre: 'Multiply by ' + t('-1') + ' and reverse the sign: ' + t(exT(1, f, FLIP[op])) + '.<br>', text: 'negative leading coefficient' });
      } },
      { id: '4b', level: 'PRG', make: function (r) {
        var f = fracFacs(r, { qs: [2, 3], pmax: 7 }), op = rndOp(r), q = f[0][0];
        return solvePart(-1, f, op, exT(-1, f, op), { rev: true, pre: 'Multiply by ' + t('-1') + ' and reverse the sign: ' + t(exT(1, f, FLIP[op])) + '.<br>', text: 'negative leading coefficient, non-monic' });
      } },
      { id: '4c', level: 'ADV', make: function (r) {
        var f = fracFacs(r, { qs: [2, 3, 2], two: true, qs2: [2, 3], pmax: 7, test: function (g) { return g[0][0] * g[1][0] >= 4; } }), op = rndOp(r);
        return solvePart(-1, f, op, exT(-1, f, op), { rev: true, pre: 'Multiply by ' + t('-1') + ' and reverse the sign: ' + t(exT(1, f, FLIP[op])) + '.<br>', text: 'negative leading coefficient, two fraction zeros' });
      } }] },

    { num: '5', stem: 'Solve.', shared: function (r) { return surdShared(r); }, parts: [
      { id: '5a', level: 'EMG', make: function (r) { return sqQ(r, { m: [1], ops: ['le', 'le', 'lt'] }); } },
      { id: '5b', level: 'EMG', make: function (r) { return sqQ(r, { m: [2, 3, 4, 5], ops: ['gt', 'gt', 'ge'] }); } },
      { id: '5c', level: 'EMG', make: function (r) { return noRootQ(r, { a: [1], ops: ['gt', 'ge'] }); } },
      { id: '5d', level: 'EMG', make: function (r) { return noRootQ(r, { a: [2, 3], ops: ['le', 'lt'] }); } },
      { id: '5e', sub: 'e i', level: 'ADV', make: function (r, o) {
        var S = surdParts(o);
        return U.exactSetPart(CP, 'Solve ' + t(tx(S.E) + OPS[o.op] + '0') + '. Give exact endpoints.', S.T, S.texOf, {}, surdSol(o, S), ['It does not factor: find the zeros with the quadratic formula.', 'The parabola opens up: negative between the zeros, positive outside them.'], 'irrational zeros, exact');
      } },
      { id: '5e2', sub: 'e ii', level: 'ADV', make: function (r, o) {
        var S = surdParts(o);
        return U.roundSetPart(CP, 'Write the solution of ' + t(tx(S.E) + OPS[o.op] + '0') + ' with each endpoint to the nearest hundredth.', S.T, 2, {}, surdSol(o, S) + '<br>To the nearest hundredth: ' + t(setTexX(S.T, 'x', function (x) { return K.roundTo(x, 2).toFixed(2); })) + '.', ['Evaluate each exact endpoint with a calculator.'], 'irrational zeros, rounded');
      } }] },

    { num: '6', shared: function (r) { return { f: intFacs(r, { lo: -5, hi: 5, gap: 3, maxGap: 6, noZero: true }), op: rndOp(r) }; },
      stem: function (s) { return 'Solve ' + t(exT(1, s.f, s.op)) + ' by each method.'; }, parts: [
      { id: '6a', level: 'BEG', make: function (r, s) { return solvePart(1, s.f, s.op, exT(1, s.f, s.op), { method: 'case', prompt: 'By case analysis: solve ' + t(exT(1, s.f, s.op)) + '.', pre: 'Factor: ' + t(facT(1, s.f) + OPS[s.op] + '0') + '.<br>', wrongs: [caseWrong(1, s.f, s.op)].filter(Boolean), text: 'case analysis' }); } },
      { id: '6b', level: 'EMG', make: function (r, s) {
        var rts = rootsOf(s.f), E = fpoly(1, s.f), vals = [rts[0] - r.int(1, 3), r.int(rts[0] + 1, rts[1] - 1), rts[1] + r.int(1, 3)];
        return U.testGrid(CP, 'By test points: the roots of ' + t(tx(E) + '=0') + ' are ' + t(vt(rts[0])) + ' and ' + t(vt(rts[1])) + '. One value is chosen in each interval. Does each make ' + t(exT(1, s.f, s.op)) + ' true?', function (x) { return at(E, x); }, vals, s.op, null, 'x',
          vals.map(function (x) { var y = at(E, x); return t('x=' + vt(x)) + ': ' + t(vt(y)) + (holds(y, s.op) ? ' ✓' : ' ✗'); }).join('; ') + '.<br>So the solution is ' + t(setTexX(facSet(1, s.f, s.op))) + '.',
          ['Substitute each value into ' + t(tx(E)) + '.', 'Compare the result with ' + t('0') + ' using ' + t(OPS[s.op].trim()) + '.'], 'test points');
      } },
      { id: '6c', level: 'BEG', make: function (r, s) {
        return U.chartGrid(CP, 'By a sign chart: complete the product row for ' + t(facT(1, s.f)) + '.' + chartHtml(1, s.f, 'x', true), 1, s.f, 'x', chartHtml(1, s.f, 'x') + 'So ' + t(exT(1, s.f, s.op)) + ' for ' + t(setTexX(facSet(1, s.f, s.op))) + '.',
          ['At a zero the product is ' + t('0') + '; elsewhere multiply the signs of the factors.'], 'sign chart: product row');
      } },
      { id: '6d', level: 'EMG', make: function (r, s) {
        var E = fpoly(1, s.f), rts = rootsOf(s.f), f = function (x) { return at(E, x); }, vy = f((rts[0] + rts[1]) / 2), T = facSet(1, s.f, s.op), pos = upOp(s.op);
        var lo = Math.max(-12, 2 * Math.floor((vy - 2) / 2)), hi = Math.min(12, Math.max(4, 2 * Math.ceil((f(rts[0] - 1.5) + 1) / 2)));
        var svg = A().regionSvg({ x: [-7, 7], y: [lo, hi], max: 260, curves: [{ f: f }], aria: 'graph of the parabola' });
        return U.setPart(CP, 'By a graph: the graph of ' + t('y=' + tx(E)) + ' is shown. Use it to solve ' + t(exT(1, s.f, s.op)) + '.' + PROMPT_SET + '<div class="fig">' + svg + '</div>', T,
          { sideHint: t('>0') + ' means the graph is <b>above</b> the ' + t('x') + '-axis; ' + t('<0') + ' below it.' },
          'The ' + t('x') + '-intercepts are ' + t(vt(rts[0])) + ' and ' + t(vt(rts[1])) + '. The parabola is ' + (pos ? 'above' : 'below') + ' the ' + t('x') + '-axis' + (strictOp(s.op) ? '' : ' (or on it)') + ' ' + (pos ? 'outside' : 'between') + ' them: ' + t(setTexX(T)) + '.',
          [t(exT(1, s.f, s.op)) + ' asks where the graph is ' + (pos ? 'above' : 'below') + ' the ' + t('x') + '-axis.', 'The ' + t('x') + '-intercepts are the endpoints: ' + (strictOp(s.op) ? 'not included.' : 'included.')], 'from the graph');
      } }] },

    { num: '7', stem: 'Write a quadratic inequality with integer coefficients and a positive leading coefficient that has the given solution.', parts: [
      { id: '7a', level: 'EMG', make: function (r) { return writePart(r, { out: false, inc: true }); } },
      { id: '7b', level: 'EMG', make: function (r) { return writePart(r, { out: true, inc: false }); } },
      { id: '7c', level: 'PRG', make: function (r) { return writePart(r, { out: true, inc: true, line: true, zero: r.chance(0.6), any: true }); } },
      { id: '7d', level: 'ADV', make: function (r) { return writePart(r, { out: false, inc: false, frac: true }); } }] },

    { num: '8', shared: function (r) {
        return pickWhere(function () { var T = r.int(4, 9), u = r.int(1, 2), d = T - u, t1 = r.int(1, Math.floor((d - 1) / 2)); return { T: T, u: u, d: d, H: 5 * T * u, b: 5 * d, t1: t1, t2: d - t1, ctx: r.pick(['stone', 'ball', 'rock']) }; },
          function (z) { return z.d >= 3 && z.t2 > z.t1 && z.H <= 60 && !(z.T === 6 && z.u === 1); });
      },
      stem: function (s) { return 'A ' + s.ctx + ' is thrown upward from the edge of a ' + t(s.H) + ' m cliff above a lake. Its height above the water after ' + t('t') + ' seconds is ' + t('h=-5t^{2}+' + s.b + 't+' + s.H) + ' metres.'; }, parts: [
      { id: '8a', level: 'BEG', make: function (r, s) {
        return KP.number('When does the ' + s.ctx + ' hit the water?', s.T, function (v) { return near(v, -s.u) ? { code: CP + 'neg-time', hint: 'A negative time is before the throw: it is inadmissible. Use the positive root.' } : null; },
          t('-5t^{2}+' + s.b + 't+' + s.H + '=0') + ', so ' + t('t^{2}-' + s.d + 't-' + s.T * s.u + '=0') + ', ' + t('(t-' + s.T + ')(t+' + s.u + ')=0') + ': ' + t('t=' + s.T) + ' s (' + t('t=-' + s.u) + ' is inadmissible).',
          ['It hits the water when ' + t('h=0') + '.', 'Divide by ' + t('-5') + ', factor, and keep the positive root.'], 'time to hit the water', { after: 's' });
      } },
      { id: '8b', sub: 'b i', level: 'PRG', make: function (r, s) {
        var H2 = s.H + 5 * s.t1 * s.t2, T = SET.between(s.t1, s.t2, false);
        return U.setPart(CP, 'When is the ' + s.ctx + ' more than ' + t(H2) + ' m above the water?' + ' Write the times in set notation.', T, { v: 't', rev: true, revHint: 'Dividing by ' + t('-5') + ' reverses the sign: the ' + s.ctx + ' is high <b>between</b> the two times.' },
          t('-5t^{2}+' + s.b + 't+' + s.H + '>' + H2) + ', so ' + t('-5t^{2}+' + s.b + 't-' + (H2 - s.H) + '>0') + '. Divide by ' + t('-5') + ' (reverse): ' + t('t^{2}-' + s.d + 't+' + s.t1 * s.t2 + '<0') + ', ' + t('(t-' + s.t1 + ')(t-' + s.t2 + ')<0') + '.<br>Between the roots: ' + t(setTexX(T, 't')) + '.',
          ['Write ' + t('h>' + H2) + ' and move every term to one side.', 'Divide by ' + t('-5') + ' (reverse the sign), factor and decide: between or outside the roots?'], 'height above a level: when');
      } },
      { id: '8b2', sub: 'b ii', level: 'PRG', make: function (r, s) {
        var H2 = s.H + 5 * s.t1 * s.t2;
        return KP.number('For how long is it more than ' + t(H2) + ' m above the water?', s.t2 - s.t1, function (v) { return near(v, s.t1) || near(v, s.t2) ? { code: CP + 'dur', hint: 'That is one of the times when it is exactly ' + H2 + ' m high. How long is it between them?' } : null; },
          'It is above ' + H2 + ' m for ' + t(s.t1 + '<t<' + s.t2) + ': ' + t(s.t2 + '-' + s.t1 + '=' + (s.t2 - s.t1)) + ' seconds.', ['Subtract the two times from part (b i).'], 'how long above a level', { after: 's' });
      } },
      { id: '8c', sub: 'c', level: 'ADV', make: function (r, s) {
        var T = [sIv(s.d, s.T, false, false)];
        return U.setPart(CP, 'When is the ' + s.ctx + ' below the top of the cliff but not yet in the water? Write the times in set notation.', T, { v: 't', wrongs: [
            { parts: SET.above(s.d, false), code: CP + 'ineq-restr', hint: 'Right inequality, but after ' + t('t=' + s.T) + ' s the ' + s.ctx + ' is in the lake: the model stops there.' },
            { parts: [sIv(s.d, s.T, false, true)], code: CP + 'land', hint: 'At ' + t('t=' + s.T) + ' s the ' + s.ctx + ' is at the water (' + t('h=0') + '): it is no longer “not yet in the water”. Use an open endpoint.' },
            { parts: SET.outside(0, s.d, false), code: CP + 'ineq-restr', hint: 'Times before the throw (' + t('t<0') + ') and after it lands do not fit the context.' },
            { parts: [sIv(0, s.d, false, false)], code: CP + 'ineq-side', hint: 'Between ' + t('0') + ' and ' + t(s.d) + ' s it is <b>above</b> the cliff top. Test a time such as ' + t('t=' + (s.d + 0.5)) + '.' }] },
          t('-5t^{2}+' + s.b + 't+' + s.H + '<' + s.H) + ', so ' + t('-5t^{2}+' + s.b + 't<0') + ' and ' + t('5t(t-' + s.d + ')>0') + ': ' + t('t<0') + ' or ' + t('t>' + s.d) + '.<br>It is in the air for ' + t('0\\le t\\le ' + s.T) + ', and at ' + t('t=' + s.T) + ' it reaches the water. So from ' + s.d + ' s until it lands: ' + t(setTexX(T, 't')) + '.',
          ['Below the cliff top: ' + t('h<' + s.H) + '. Solve it.', 'Keep only the times while the ' + s.ctx + ' is still in the air (it lands at ' + t('t=' + s.T) + ').'], 'below the cliff, in context');
      } },
      { id: '8d', sub: 'd', level: 'ADV', make: function (r, s) {
        var top = s.H + 5 * s.d * s.d / 4, Hn = Math.floor(top) + r.int(1, 4), c = Hn - s.H, D = s.b * s.b - 20 * c;
        var p = KP.number('Show algebraically that the ' + s.ctx + ' never reaches ' + t(Hn) + ' m: rearrange ' + t('h\\ge ' + Hn) + ' as ' + t('5t^{2}-' + s.b + 't+' + c + '\\le 0') + ' and give its discriminant ' + t('b^{2}-4ac') + '.', D,
          function (v) { return near(v, s.b * s.b + 20 * c) || near(v, -s.b * s.b - 20 * c) || near(v, s.b * s.b - 10 * c) ? { code: CP + 'disc', hint: t('b^{2}-4ac=(-' + s.b + ')^{2}-4(5)(' + c + ')') + ': square first, then subtract ' + t('20\\times ' + c) + '.' } : null; },
          t('-5t^{2}+' + s.b + 't+' + s.H + '\\ge ' + Hn) + ' gives ' + t('5t^{2}-' + s.b + 't+' + c + '\\le 0') + '. ' + t('b^{2}-4ac=' + s.b * s.b + '-' + 20 * c + '=' + D + '<0') + ': no zeros, and ' + t('t=0') + ' gives ' + t(c + '>0') + ', so ' + t('5t^{2}-' + s.b + 't+' + c) + ' is always positive. No solution: it never reaches ' + Hn + ' m (its maximum is ' + dt(top) + ' m).',
          ['Move every term to one side and multiply by ' + t('-1') + ' (reverse the sign).', 'A negative discriminant means no zeros: the expression has one sign for every ' + t('t') + '.'], 'never reaches a height');
        return p;
      } }] },

    { num: '9', shared: function (r) {
        return pickWhere(function () { var k = r.pick([2, 4, 5, 10]), x1 = r.int(4, 14), w = 2 * r.int(3, 7), d = r.int(1, w / 2 - 1); return { k: k, x1: x1, x2: x1 + w, x3: x1 + d, x4: x1 + w - d }; },
          function (z) { var V = z.k * (z.x3 * z.x4 - z.x1 * z.x2); return V > 0 && V <= 400 && z.k * z.x1 * z.x2 <= 2500 && !(z.k === 5 && z.x1 === 10 && z.x2 === 20) && !(z.x1 === 10 && z.x2 === 40); });
      },
      stem: function (s) { return 'A food truck’s daily profit, in dollars, when it charges ' + t('x') + ' dollars per meal is ' + t('P=-' + s.k + 'x^{2}+' + s.k * (s.x1 + s.x2) + 'x-' + s.k * s.x1 * s.x2) + '.'; }, parts: [
      { id: '9a', level: 'PRG', make: function (r, s) {
        var T = SET.between(s.x1, s.x2, false), S = s.x1 + s.x2, Q = s.x1 * s.x2;
        return U.setPart(CP, 'For what prices does the truck make a profit? Write the prices in set notation.', T, { rev: true, revHint: 'Dividing by ' + t(-s.k) + ' reverses the sign: the truck makes money <b>between</b> the two prices.' },
          t('-' + s.k + 'x^{2}+' + s.k * S + 'x-' + s.k * Q + '>0') + '. Divide by ' + t(-s.k) + ' (reverse): ' + t('x^{2}-' + S + 'x+' + Q + '<0') + ', ' + t('(x-' + s.x1 + ')(x-' + s.x2 + ')<0') + '.<br>Between ' + t('\\$' + s.x1) + ' and ' + t('\\$' + s.x2) + ': ' + t(setTexX(T)) + '.',
          ['A profit means ' + t('P>0') + '.', 'Divide by the negative leading coefficient (reverse), factor, and decide: between or outside?'], 'prices with a profit');
      } },
      { id: '9b', level: 'ADV', make: function (r, s) {
        var V = s.k * (s.x3 * s.x4 - s.x1 * s.x2), T = SET.between(s.x3, s.x4, true), S = s.x1 + s.x2;
        return U.setPart(CP, 'For what prices is the daily profit at least ' + t('\\$' + V) + '? Write the prices in set notation.', T, { rev: true, revHint: 'Dividing by ' + t(-s.k) + ' reverses the sign: the profit is high <b>between</b> the two prices.' },
          t('-' + s.k + 'x^{2}+' + s.k * S + 'x-' + s.k * s.x1 * s.x2 + '\\ge ' + V) + ', so ' + t('-' + s.k + 'x^{2}+' + s.k * S + 'x-' + (s.k * s.x1 * s.x2 + V) + '\\ge 0') + '. Divide by ' + t(-s.k) + ' (reverse): ' + t('x^{2}-' + S + 'x+' + s.x3 * s.x4 + '\\le 0') + ', ' + t('(x-' + s.x3 + ')(x-' + s.x4 + ')\\le 0') + '.<br>From ' + t('\\$' + s.x3) + ' to ' + t('\\$' + s.x4) + ': ' + t(setTexX(T)) + '.',
          ['Write ' + t('P\\ge ' + V) + ' and move ' + t(V) + ' to the left side.', 'Divide by ' + t(-s.k) + ' (reverse the sign) and factor.'], 'prices for a target profit');
      } }] },

    { num: '10', parts: [
      { id: '10', level: 'ADV', make: function (r) {
        var s = pickWhere(function () { var w1 = r.int(3, 12), w2 = r.int(w1 + 2, 22); return { w1: w1, w2: w2, S: w1 + w2, A: w1 * w2, strict: r.chance(0.3) }; }, function (z) { return z.S <= 30 && !(z.w1 === 8 && z.w2 === 12) && (z.S - 0) % 1 === 0; });
        var op = s.strict ? 'gt' : 'ge', T = SET.between(s.w1, s.w2, !s.strict);
        return U.setPart(CP, 'A rectangle has a perimeter of ' + t(2 * s.S) + ' cm. For what widths is its area ' + (s.strict ? 'more than' : 'at least') + ' ' + t(s.A) + ' cm²? Write the widths in set notation.', T, { v: 'w', rev: true, revHint: 'Multiplying by ' + t('-1') + ' reverses the sign: the area is large <b>between</b> the two widths.' },
          'Width ' + t('w') + ', length ' + t(s.S + '-w') + ' (with ' + t('0<w<' + s.S) + ').<br>' + t('w(' + s.S + '-w)' + OPS[op] + s.A) + ', so ' + t('-w^{2}+' + s.S + 'w-' + s.A + OPS[op] + '0') + ' and ' + t('w^{2}-' + s.S + 'w+' + s.A + OPS[FLIP[op]] + '0') + ': ' + t('(w-' + s.w1 + ')(w-' + s.w2 + ')' + OPS[FLIP[op]] + '0') + '.<br>Widths from ' + s.w1 + ' cm to ' + s.w2 + ' cm: ' + t(setTexX(T, 'w')) + '.',
          ['Half the perimeter is width + length: the length is ' + t(s.S + '-w') + '.', 'Write the area inequality, move every term to one side, and solve.'], 'rectangle widths');
      } }] },

    { num: '11', parts: [
      { id: '11', level: 'MAS', make: function (r) {
        var s = pickWhere(function () { var p = r.int(-6, 8), q = r.int(-6, 10); return { p: p, q: q, two: r.chance(0.7), v: r.pick(['k', 'k', 'm']) }; },
          function (z) { return z.p < z.q && (z.p + z.q) % 4 === 0 && (z.p * z.q) % 4 === 0 && z.p + z.q !== 0 && z.p * z.q !== 0 && !(z.p === 2 && z.q === 6); });
        var u = (s.p + s.q) / 4, w = -s.p * s.q / 4, V = s.v, cT = tx(lin(u, w, V)), T = s.two ? SET.outside(s.p, s.q, false) : SET.between(s.p, s.q, false);
        var Dt = tx(P.add(M(1, V, 2), M(-4 * u, V, 1), P.num(-4 * w)));
        return U.setPart(CP, 'For what values of ' + t(V) + ' does ' + t('x^{2}+' + V + 'x+(' + cT + ')=0') + ' have ' + (s.two ? '<b>two distinct real roots</b>' : '<b>no real roots</b>') + '?' + PROMPT_SET, T,
          { v: V, wrongs: [{ parts: SET.pt(s.p).concat(SET.pt(s.q)), code: CP + 'k-eq', hint: 'Those values make the discriminant ' + t('0') + ': equal roots. The question asks for ' + (s.two ? t('b^{2}-4ac>0') : t('b^{2}-4ac<0')) + '.' }] },
          t('b^{2}-4ac=' + V + '^{2}-4(1)(' + cT + ')=' + Dt) + '. ' + (s.two ? 'Two distinct real roots: ' + t(Dt + '>0') : 'No real roots: ' + t(Dt + '<0')) + '.<br>' + t(facT(1, [[1, s.p], [1, s.q]], V) + (s.two ? '>0' : '<0')) + ': ' + (s.two ? 'outside' : 'between') + ' ' + t(s.p) + ' and ' + t(s.q) + '.<br>' + t(setTexX(T, V)) + '.',
          ['Write the discriminant in terms of ' + t(V) + ': ' + t('a=1') + ', ' + t('b=' + V) + ', ' + t('c=' + cT) + '.', (s.two ? 'Two distinct real roots: ' + t('b^{2}-4ac>0') : 'No real roots: ' + t('b^{2}-4ac<0')) + '. Solve that quadratic inequality in ' + t(V) + '.'], 'values of k for real roots');
      } }] },

    { num: '12', parts: [
      { id: '12a', level: 'EMG', make: function (r) {
        var f = intFacs(r, { lo: -8, hi: 8, gap: 2, noZero: true, test: function (a, b) { return a < 0 && b > 0; } }), op = rndOp(r, ['gt', 'ge']), a = rootsOf(f)[0], b = rootsOf(f)[1], G = OPS[op];
        var name = r.pick(['Jordan', 'Liam', 'Noah', 'Ethan']);
        return solvePart(1, f, op, exT(1, f, op), { method: 'case', prompt: name + ' solved ' + t(exT(1, f, op)) + ' like this: ' + t(facT(1, [f[1], f[0]]) + G + '0') + ', so ' + t(tx(lin(1, -b)) + G + '0') + ' and ' + t(tx(lin(1, -a)) + G + '0') + ', so ' + t('x' + G + b) + '. His answer is incomplete. Give the correct solution.',
          pre: 'His error: a product is also positive when <b>both</b> factors are negative (Case 2).<br>', wrongs: [caseWrong(1, f, op)], text: 'explain the error: case analysis' });
      } },
      { id: '12b', level: 'EMG', make: function (r) {
        var n = pickWhere(function () { return r.int(2, 12); }, function (x) { return x !== 3 && x !== 7; }), op = rndOp(r), f = [[1, -n], [1, n]], name = r.pick(['Maya', 'Ava', 'Zoe', 'Priya']), sym = OPS[op];
        return solvePart(1, f, op, 'x^{2}' + sym + n * n, { prompt: name + ' wrote that the solution of ' + t('x^{2}' + sym + n * n) + ' is “' + t('x' + sym + '\\pm ' + n) + '”. That is wrong. Solve the inequality.',
          pre: (upOp(op) ? 'Test ' + t('x=-' + (n + 1)) + ': ' + t('(-' + (n + 1) + ')^{2}=' + (n + 1) * (n + 1) + sym + n * n) + ' is true, but ' + t('-' + (n + 1) + sym + n) + ' is false: taking the square root loses the negative side.' : 'Test ' + t('x=0') + ': ' + t('0' + sym + n * n) + ' is true, but ' + t('0' + sym + '-' + n) + ' is false: “' + t('x' + sym + '\\pm ' + n) + '” mixes up two statements.') + ' Rearrange instead: ' + t('x^{2}-' + n * n + sym + '0') + '.<br>', text: 'explain the error: square root',
          wrongs: [{ parts: upOp(op) ? SET.above(n, !strictOp(op)) : SET.below(n, !strictOp(op)), code: CP + 'ineq-sqrt', hint: 'Taking the square root loses the negative side: for example ' + t('x=-' + (n + 1)) + ' gives ' + t('x^{2}=' + (n + 1) * (n + 1)) + '. Rearrange to ' + t('x^{2}-' + n * n + sym + '0') + ' and factor.' },
            { parts: upOp(op) ? SET.above(-n, !strictOp(op)) : SET.below(-n, !strictOp(op)), code: CP + 'ineq-sqrt', hint: 'Taking the square root loses part of the solution. Rearrange to ' + t('x^{2}-' + n * n + sym + '0') + ' and factor.' }] });
      } }] },

    { num: '13', stem: '<i>(Extension.)</i> Solve with a sign chart.', parts: [
      { id: '13a', level: 'MAS', make: function (r) {
        var f = pickWhere(function () { var a = r.int(-6, 2), b = r.int(-3, 5), c = r.int(0, 7); return [[1, a], [1, b], [1, c]]; }, function (g) { var a = g[0][1], b = g[1][1], c = g[2][1]; return a < b && b < c && c - a <= 10 && fresh(g); });
        var op = rndOp(r), show = (r.chance(0.5) ? facT(1, f) : facT(1, [f[2], f[0], f[1]])) + OPS[op] + '0';
        return solvePart(1, f, op, show, { text: 'a product of three factors', hints: ['Three zeros make four intervals.', 'Use a sign chart: multiply the signs of the three factors in each column.'] });
      } },
      { id: '13b', level: 'MAS', make: function (r) {
        var s = pickWhere(function () { return { h: r.chance(0.6) ? 0 : nz(r, 1, 4), c: nz(r, 1, 6) }; }, function (z) { return z.h !== z.c && !(z.h === 0 && z.c === 3) && !(z.h === 2 && z.c === -1); });
        var f = [[1, s.h], [1, s.h], [1, s.c]], op = rndOp(r), show = facT(1, f) + OPS[op] + '0', T = facSet(1, f, op), sq = s.h === 0 ? 'x^{2}' : '(' + tx(lin(1, -s.h)) + ')^{2}';
        var sol = t(sq) + ' is positive except at ' + t('x=' + s.h) + ', where the product is ' + t('0') + '. So the product has the sign of ' + t(tx(lin(1, -s.c))) + ' (except at ' + t('x=' + s.h) + ').' + chartHtml(1, f, 'x') + t(setTexX(T)) + '.';
        var fake = upOp(op) ? SET.above(s.c, !strictOp(op)) : SET.below(s.c, !strictOp(op));
        return U.setPart(CP, 'Solve ' + t(show) + '.' + PROMPT_SET, T, { wrongs: partsEq(fake, T) ? [] : [{ parts: fake, code: CP + 'ineq-sq', hint: 'Check ' + t('x=' + s.h) + ': the squared factor is ' + t('0') + ' there, so the product is ' + t('0') + '. ' + (strictOp(op) ? 'For ' + t(OPS[op].trim()) + ' that value is not included.' : 'For ' + t(OPS[op].trim()) + ' it is included.') }] }, sol,
          ['A squared factor is never negative: it does not change sign.', 'So the product has the sign of the other factor, except where the square is ' + t('0') + '.'], 'a squared factor');
      } }] },

    { num: '14', parts: [
      { id: '14', level: 'PRG', make: function (r) {
        var f = intFacs(r, { lo: -6, hi: 6, gap: 3, maxGap: 8, noZero: true, noOpp: true }), out = r.chance(0.6), inc = r.chance(0.6), rts = rootsOf(f);
        var op = out ? (inc ? 'ge' : 'gt') : (inc ? 'le' : 'lt'), T = facSet(1, f, op), g = [[1, -f[1][1]], [1, -f[0][1]]];
        var E = fpoly(1, f), G = fpoly(1, g), op2 = out ? (inc ? 'le' : 'lt') : (inc ? 'ge' : 'gt');
        var opts = [{ html: t(tx(E) + OPS[op] + '0'), right: true }, { html: t(tx(E) + OPS[op2] + '0'), why: 'That one is ' + (out ? 'negative between' : 'positive outside') + ' its zeros: the other side of the number line.', code: 'side' },
          { html: t(tx(G) + OPS[op] + '0'), why: 'Its zeros are ' + t(-f[1][1]) + ' and ' + t(-f[0][1]) + ': check the signs of the factors.', code: 'sign' }, { html: t(tx(G) + OPS[op2] + '0'), why: 'Its zeros are ' + t(-f[1][1]) + ' and ' + t(-f[0][1]) + ', and it is on the other side.', code: 'both' }];
        return KP.mc(r, 'The solution shown on the number line belongs to the inequality' + U.nlSvg(T, Math.floor(rts[0]) - 3, Math.ceil(rts[1]) + 3, rts), opts,
          (inc ? 'Closed' : 'Open') + ' dots at ' + t(vt(rts[0])) + ' and ' + t(vt(rts[1])) + ', shaded ' + (out ? 'outside' : 'between') + ': ' + t(facT(1, f) + OPS[op] + '0') + ', that is, ' + t(tx(E) + OPS[op] + '0') + '.',
          ['The dots are the zeros: each gives a factor ' + t('(x-r)') + '.', 'Between → ' + t('<') + ' or ' + t('\\le') + '; outside → ' + t('>') + ' or ' + t('\\ge') + ' (for a positive leading coefficient).'], 'MC: inequality from a number line');
      } }] },

    { num: '15', parts: [
      { id: '15', level: 'EMG', make: function (r) {
        var f = fracFacs(r, { qs: [2, 3], pmax: 5, lo: 2, hi: 6, test: function (g) { var rs = rootsOf(g); return rs[0] < 0 && rs[0] > -3 && rs[1] >= 2 && Math.floor(rs[0]) !== rs[0]; } }), rts = rootsOf(f), E = fpoly(1, f), op = rndOp(r);
        var a = rts[0], b = rts[1], L = Math.floor(a) - r.int(0, 1), Mi = r.int(Math.ceil(a), b - 1), Rt = b + r.int(1, 2);
        var right = [L, Mi, Rt], two = [Math.ceil(a), Math.ceil(a) + 1, Rt], noMid = [L - 1, L, Rt], zero = [L, b, Rt + 1];
        var name = r.pick(['Kai', 'Sam', 'Eli', 'Rowan']);
        var opts = [{ html: t(right.join(',\\ ')), right: true }, { html: t(two.join(',\\ ')), why: 'No value is less than ' + t(vt(a)) + ': the interval ' + t('x<' + vt(a)) + ' is missed.', code: 'noleft' },
          { html: t(noMid.join(',\\ ')), why: 'No value is between ' + t(vt(a)) + ' and ' + t(vt(b)) + ': the middle interval is missed.', code: 'nomid' },
          { html: t(zero.join(',\\ ')), why: t(vt(b)) + ' is a zero, not a test value (and the middle interval is missed).', code: 'zero' }];
        return KP.mc(r, name + ' will solve ' + t(tx(E) + OPS[op] + '0') + ' by testing one value of ' + t('x') + ' in each interval. Which set of test values works?', opts,
          t(tx(E) + '=' + facT(1, f)) + ' has zeros ' + t(vt(a)) + ' and ' + t(vt(b)) + '. The intervals are ' + t('x<' + vt(a)) + ', ' + t(vt(a) + '<x<' + vt(b)) + ' and ' + t('x>' + vt(b)) + ': ' + t(right.join(',\\ ')) + ' has one value in each.',
          ['Factor to find the zeros: they split the number line into three intervals.', 'A test value must be inside an interval, not at a zero.'], 'MC: test values');
      } }] },

    { num: '16', parts: [
      { id: '16', level: 'PRG', make: function (r) {
        var f = intFacs(r, { lo: -7, hi: 7, gap: 3, noZero: true, noOpp: true, test: function (a, b) { return a + b !== 0; } }), op = rndOp(r, ['lt', 'gt']), E = fpoly(-1, f), rts = rootsOf(f);
        var show = seqT([[P.constant(E)[0], 0], [P.coef(E, { x: 1 })[0], 1], [-1, 2]]) + OPS[op] + '0';
        var T = facSet(-1, f, op), C = complement(T).filter(function () { return true; }), neg = [[1, -f[1][1]], [1, -f[0][1]]];
        var Tn = facSet(-1, neg, op), Cn = facSet(-1, neg, FLIP[op]);
        return mcSet(r, 'The solution of ' + t(show) + ' is', T, [{ T: facSet(-1, f, FLIP[op]), why: 'Multiplying by ' + t('-1') + ' reverses the sign: ' + t(exT(1, f, FLIP[op])) + '.', code: 'norev' },
          { T: Tn, why: 'Check the signs of the zeros: ' + t(exT(1, f, FLIP[op])) + ' has zeros ' + t(vt(rts[0])) + ' and ' + t(vt(rts[1])) + '.', code: 'sign' }, { T: Cn, why: 'Check the zeros and reverse the sign when you multiply by ' + t('-1') + '.', code: 'both' }],
          'Multiply by ' + t('-1') + ' and reverse: ' + t(exT(1, f, FLIP[op])) + ', ' + t(facT(1, f) + OPS[FLIP[op]] + '0') + ', so ' + t(setTexX(T)) + '.', H_NEG, 'MC: negative leading coefficient');
      } }] },

    { num: '17', parts: [
      { id: '17', level: 'PRG', make: function (r) {
        var f = intFacs(r, { lo: -7, hi: 9, gap: 4, maxGap: 14, noZero: true, test: function (a, b) { return a < 0 && b > 0; } }), op = rndOp(r, ['le', 'le', 'lt']), a = f[0][1], b = f[1][1], inc = op === 'le';
        var n = inc ? b - a + 1 : b - a - 1, E = fpoly(1, f);
        var p = KP.nr('The number of integers that satisfy ' + t(tx(E) + OPS[op] + '0') + ' is ______.', n, function (v) { return near(v, inc ? n - 2 : n + 2) || near(v, n - 1) || near(v, n + 1) ? { code: CP + 'count-ends', hint: 'Check the endpoints: ' + (inc ? t('\\le') + ' includes the zeros ' + t(a) + ' and ' + t(b) + '.' : t('<') + ' leaves the zeros out.') } : null; },
          t(facT(1, f) + OPS[op] + '0') + ': ' + t(setTexX(facSet(1, f, op))) + '. The integers from ' + t(inc ? a : a + 1) + ' to ' + t(inc ? b : b - 1) + ': <b>' + n + '</b>.', ['Solve the inequality first.', 'Count the integers in the solution, watching the endpoints.'], 'NR: count the integers');
        p.bad = [String(n + 1), String(n - 1)];
        return p;
      } }] },

    { num: '18', parts: [
      { id: '18', level: 'ADV', make: function (r) { var p = A().B.heightCtx(r, CP, { mode: 'duration' }); p.input.nr = true; return p; } }] }
  ];

  /* ======================================================================================================
   * Extra Practice 7
   * ====================================================================================================== */
  var EXTRA = [
    { num: 'A1', section: 'A. Skills', parts: [
      { id: 'A1', level: 'BEG', make: function (r) { return caseQ(r, true, true); } }] },
    { num: 'A2', stem: 'Solve with a sign chart.', parts: [
      { id: 'A2a', level: 'BEG', make: function (r) { var f = intFacs(r, { lo: -9, hi: 9, gap: 2, noZero: true }), op = rndOp(r); return solvePart(1, f, op, exT(1, f, op), { text: 'sign chart' }); } },
      { id: 'A2b', level: 'EMG', make: function (r) { var n = nz(r, 1, 9), f = [[1, 0], [1, n]], op = rndOp(r); if (!fresh(f)) { n = n > 0 ? n + 1 : n - 1; f = [[1, 0], [1, n]]; } return solvePart(1, f, op, exT(1, f, op), { text: 'common factor x' }); } },
      { id: 'A2c', level: 'EMG', make: function (r) {
        var s = pickWhere(function () { return { m: r.int(2, 5), n: r.int(1, 9) }; }, function (z) { return gcd(z.m, z.n) === 1 && !(z.m === 2 && z.n === 5); });
        var f = [[s.m, -s.n], [s.m, s.n]], op = rndOp(r);
        return solvePart(1, f, op, exT(1, f, op), { text: 'difference of squares', wrongs: [{ parts: upOp(op) ? SET.above(s.n / s.m, !strictOp(op)) : SET.below(s.n / s.m, !strictOp(op)), code: CP + 'ineq-sqrt', hint: 'Taking the square root loses the negative side. Factor the difference of squares and use both zeros.' }] });
      } },
      { id: 'A2d', level: 'PRG', make: function (r) { var f = fracFacs(r, { qs: [3, 2, 5], pmax: 8 }), op = rndOp(r); return solvePart(1, f, op, exT(1, f, op), { text: 'non-monic, sign chart' }); } }] },
    { num: 'A3', stem: 'Rearrange so one side is ' + t('0') + ', then solve.', parts: [
      { id: 'A3a', level: 'PRG', make: function (r) {
        var f = fracFacs(r, { qs: [2, 3], pmax: 7, test: function (g) { var E = fpoly(1, g); return P.constant(E)[0] !== 0 && P.coef(E, { x: 1 })[0] !== 0; } }), op = rndOp(r), E = fpoly(1, f);
        var a2 = P.coef(E, { x: 2 }), b1 = P.coef(E, { x: 1 }), c0 = P.constant(E), show = tx(M(a2[0] / a2[1], 'x', 2)) + OPS[op] + tx(lin(-b1[0] / b1[1], -c0[0] / c0[1]));
        return solvePart(1, f, op, show, { pre: rearrSol(E, op), text: 'rearrange, then solve' });
      } },
      { id: 'A3b', level: 'PRG', make: function (r) {
        var z = pickWhere(function () { var f = intFacs(r, { lo: -8, hi: 8, gap: 2, noZero: true }); return { f: f, u: nz(r, 1, 5), w: nz(r, 1, 6) }; }, function (q) { var c = q.u * q.w - q.f[0][1] * q.f[1][1]; return q.u + q.w === -(q.f[0][1] + q.f[1][1]) && c !== 0 && q.u !== q.w && !(q.u === 2 && q.w === -4); });
        var c = z.u * z.w - z.f[0][1] * z.f[1][1], op = rndOp(r), show = '(' + tx(lin(1, z.u)) + ')(' + tx(lin(1, z.w)) + ')' + OPS[op] + vt(c);
        return solvePart(1, z.f, op, show, { pre: 'Expand: ' + t(tx(quad(1, z.u + z.w, z.u * z.w)) + OPS[op] + vt(c)) + ', so ' + t(exT(1, z.f, op)) + '.<br>', text: 'expand, rearrange, solve' });
      } },
      { id: 'A3c', level: 'ADV', make: function (r) {
        var z = pickWhere(function () { var f = fracFacs(r, { qs: [2, 3], pmax: 7 }); return { f: f, d2: r.int(1, 3), d1: r.int(-5, 5), d0: r.int(-8, 8) }; }, function (q) { var E = fpoly(1, q.f); return P.coef(E, { x: 1 })[0] + q.d1 !== 0 && q.d1 !== 0 && q.d0 !== 0; });
        var E = fpoly(1, z.f), D = quad(z.d2, z.d1, z.d0), op = rndOp(r), show = tx(P.add(E, D)) + OPS[op] + tx(D);
        return solvePart(1, z.f, op, show, { pre: 'Subtract ' + t(tx(D)) + ' from both sides: ' + t(tx(E) + OPS[op] + '0') + '.<br>', text: 'both sides quadratic' });
      } }] },
    { num: 'A4', stem: 'Solve.', parts: [
      { id: 'A4a', level: 'PRG', make: function (r) {
        var f = intFacs(r, { lo: -8, hi: 8, gap: 3, noZero: true, test: function (a, b) { return a + b !== 0; } }), op = rndOp(r), E = fpoly(-1, f);
        var show = seqT([[P.constant(E)[0], 0], [P.coef(E, { x: 1 })[0], 1], [-1, 2]]) + OPS[op] + '0';
        return solvePart(-1, f, op, show, { rev: true, pre: 'Multiply by ' + t('-1') + ' and reverse the sign: ' + t(exT(1, f, FLIP[op])) + '.<br>', text: 'negative leading coefficient' });
      } },
      { id: 'A4b', level: 'ADV', make: function (r) {
        var f = fracFacs(r, { qs: [2, 3], two: true, qs2: [2, 3], pmax: 5, test: function (g) { return g[0][0] !== g[1][0] && rootsOf(g)[0] > 0; } }), op = rndOp(r);
        return solvePart(-1, f, op, exT(-1, f, op), { rev: true, pre: 'Multiply by ' + t('-1') + ' and reverse the sign: ' + t(exT(1, f, FLIP[op])) + '.<br>', text: 'negative leading coefficient, two fraction zeros' });
      } }] },
    { num: 'A5', stem: 'Solve.', parts: [
      { id: 'A5a', level: 'EMG', make: function (r) { return sqQ(r, { m: [1], ops: ['gt', 'gt', 'ge', 'lt'] }); } },
      { id: 'A5b', level: 'EMG', make: function (r) { return noRootQ(r, { a: [-1], ops: ['lt', 'gt', 'le', 'ge'] }); } },
      { id: 'A5c', level: 'EMG', make: function (r) { return sqQ(r, { m: [2, 3, 5], ops: ['le', 'le', 'lt'] }); } }] },

    { num: 'B1', section: 'B. Applying', stem: 'Write a quadratic inequality with integer coefficients and a positive leading coefficient for each solution.', parts: [
      { id: 'B1a', level: 'EMG', make: function (r) { return writePart(r, { out: false, inc: true }); } },
      { id: 'B1b', level: 'ADV', make: function (r) { return writePart(r, { out: true, inc: false, frac: true }); } }] },
    { num: 'B2', shared: function (r) {
        return pickWhere(function () { var T = r.int(3, 5), u = r.int(1, 2), L = r.int(3, 12); return { T: T, u: u, H: 5 * T * u, b: 5 * (T - u), L: L }; }, function (z) {
          if (z.T <= z.u || z.H > 40 || z.L >= z.H - 2) return false; var D = z.b * z.b + 20 * (z.H - z.L), sd = Math.sqrt(D); return Math.abs(sd - Math.round(sd)) > 1e-6;
        });
      },
      stem: function (s) { return 'A cliff diver jumps up from a ledge ' + t(s.H) + ' m above the water. Her height above the water after ' + t('t') + ' seconds is ' + t('h=-5t^{2}+' + s.b + 't+' + s.H) + ' metres.'; }, parts: [
      { id: 'B2a', level: 'BEG', make: function (r, s) {
        return KP.number('When does she enter the water?', s.T, function (v) { return near(v, -s.u) ? { code: CP + 'neg-time', hint: 'A negative time is before the jump. Use the positive root.' } : null; },
          t('-5t^{2}+' + s.b + 't+' + s.H + '=0') + ', so ' + t(tx(quad(1, -(s.T - s.u), -s.T * s.u, 't')) + '=0') + ', ' + t('(t-' + s.T + ')(t+' + s.u + ')=0') + ': ' + t('t=' + s.T) + ' s.', ['She enters the water when ' + t('h=0') + '.'], 'time to the water', { after: 's' });
      } },
      { id: 'B2b', level: 'PRG', make: function (r, s) {
        var d = s.T - s.u, T = [sIv(0, d, false, false)];
        return U.setPart(CP, 'When is she above the ledge? Write the times in set notation.', T, { v: 't', wrongs: [{ parts: SET.outside(0, d, false), code: CP + 'ineq-side', hint: 'Test a time such as ' + t('t=' + vt(d / 2)) + ': she is above the ledge <b>between</b> the two times.' }] },
          t('-5t^{2}+' + s.b + 't+' + s.H + '>' + s.H) + ', so ' + t('-5t^{2}+' + s.b + 't>0') + ', ' + t('5t(' + d + '-t)>0') + ': ' + t(setTexX(T, 't')) + '.',
          ['Above the ledge: ' + t('h>' + s.H) + '. Subtract ' + t(s.H) + ' from both sides.', 'Factor out ' + t('5t') + '; a product is positive when the factors have the same sign.'], 'above the ledge');
      } },
      { id: 'B2c', level: 'ADV', make: function (r, s) {
        var c = s.H - s.L, D = s.b * s.b + 20 * c, r2 = (s.b + Math.sqrt(D)) / 10, r1 = (s.b - Math.sqrt(D)) / 10, T = [sIv(r2, s.T, false, true)];
        return U.roundSetPart(CP, 'When is she less than ' + t(s.L) + ' m above the water? Write the times in set notation, to the nearest hundredth of a second.', T, 2, { v: 't', alts: [[sIv(r2, s.T, false, false)]] },
          t('-5t^{2}+' + s.b + 't+' + s.H + '<' + s.L) + ', so ' + t('5t^{2}-' + s.b + 't-' + c + '>0') + '. Zeros ' + t('t=\\dfrac{' + s.b + '\\pm\\sqrt{' + D + '}}{10}') + ': ' + t(r1.toFixed(2)) + ' and ' + t(r2.toFixed(2)) + '.<br>So ' + t('t>' + r2.toFixed(2)) + '; she is below ' + s.L + ' m from ' + r2.toFixed(2) + ' s until she enters the water at ' + s.T + ' s: ' + t('\\{t\\mid ' + r2.toFixed(2) + '<t\\le ' + s.T + '\\}') + '.',
          ['Write ' + t('h<' + s.L) + ', move every term to one side and use the quadratic formula.', 'Keep only the times between the jump and when she enters the water (' + t('t=' + s.T) + ').'], 'below a height, rounded');
      } }] },
    { num: 'B3', parts: [
      { id: 'B3', level: 'ADV', make: function (r) {
        var s = pickWhere(function () { var x1 = r.int(2, 12), x2 = r.int(x1 + 2, 20); return { x1: x1, x2: x2, F: 2 * (x1 + x2), A: 2 * x1 * x2 }; }, function (z) { return z.F <= 60 && !(z.x1 === 5 && z.x2 === 10); });
        var T = SET.between(s.x1, s.x2, true), S = s.x1 + s.x2, Q = s.x1 * s.x2;
        return U.setPart(CP, 'A farmer uses ' + t(s.F) + ' m of fencing for three sides of a rectangular pen; a barn wall forms the fourth side. Each side touching the wall is ' + t('x') + ' m long. For what values of ' + t('x') + ' is the area at least ' + t(s.A) + ' m²? Write them in set notation.', T,
          { rev: true, revHint: 'Dividing by a negative reverses the sign: the area is large <b>between</b> the two values.' },
          'The side opposite the wall is ' + t(s.F + '-2x') + '. ' + t('x(' + s.F + '-2x)\\ge ' + s.A) + ', so ' + t('-2x^{2}+' + s.F + 'x-' + s.A + '\\ge 0') + '. Divide by ' + t('-2') + ' (reverse): ' + t('x^{2}-' + S + 'x+' + Q + '\\le 0') + ', ' + t('(x-' + s.x1 + ')(x-' + s.x2 + ')\\le 0') + ': ' + t(setTexX(T)) + ' (metres).',
          ['The three fenced sides are ' + t('x') + ', ' + t('x') + ' and ' + t(s.F + '-2x') + '.', 'Write the area inequality, move every term to one side and solve.'], 'pen against a wall');
      } }] },
    { num: 'B4', parts: [
      { id: 'B4', level: 'ADV', make: function (r) {
        var s = pickWhere(function () { return { u: nz(r, 1, 5), m: r.int(1, 5), two: r.chance(0.6) }; }, function (z) { return !(z.u === 1 && z.m === 2) && !(z.u === -2 && z.m === 2); });
        var p = -s.u - 2 * s.m, q = -s.u + 2 * s.m, T = s.two ? SET.outside(p, q, false) : SET.between(p, q, false), kb = 'k' + (s.u > 0 ? '+' : '-') + Math.abs(s.u);
        return U.setPart(CP, 'For what values of ' + t('k') + ' does ' + t('x^{2}+(' + kb + ')x+' + s.m * s.m + '=0') + ' have ' + (s.two ? '<b>two distinct real roots</b>' : '<b>no real roots</b>') + '?' + PROMPT_SET, T,
          { v: 'k', wrongs: [{ parts: SET.pt(p).concat(SET.pt(q)), code: CP + 'k-eq', hint: 'Those values give equal roots (discriminant ' + t('0') + ').' }] },
          t('b^{2}-4ac=(' + kb + ')^{2}-' + 4 * s.m * s.m + (s.two ? '>0' : '<0')) + ', so ' + t(tx(P.sub(P.pow(lin(1, s.u, 'k'), 2), P.num(4 * s.m * s.m))) + (s.two ? '>0' : '<0')) + ', ' + t(facT(1, [[1, p], [1, q]], 'k') + (s.two ? '>0' : '<0')) + '.<br>' + t(setTexX(T, 'k')) + '.',
          ['Write the discriminant with ' + t('b=' + kb) + ' and ' + t('c=' + s.m * s.m) + '.', (s.two ? 'Two distinct real roots: ' + t('b^{2}-4ac>0') : 'No real roots: ' + t('b^{2}-4ac<0')) + '.'], 'values of k for real roots');
      } }] },
    { num: 'B5', parts: [
      { id: 'B5', level: 'EMG', make: function (r) {
        var f = intFacs(r, { lo: -7, hi: 8, gap: 3, noZero: true, noOpp: true, test: function (a, b) { return a + b !== 0; } }), out = r.chance(0.35), op = out ? 'gt' : 'lt', T = facSet(1, f, op), E = fpoly(1, f), G = fpoly(1, [[1, -f[1][1]], [1, -f[0][1]]]);
        var opts = [{ html: t(tx(E) + OPS[op] + '0'), right: true }, { html: t(tx(E) + OPS[FLIP[op]] + '0'), why: 'That is ' + (out ? 'negative between' : 'positive outside') + ' the zeros: the other intervals.', code: 'side' },
          { html: t(tx(G) + OPS[op] + '0'), why: 'Its zeros are ' + t(-f[1][1]) + ' and ' + t(-f[0][1]) + '.', code: 'sign' }, { html: t(tx(P.neg(E)) + OPS[op] + '0'), why: 'That is ' + t(tx(E) + OPS[FLIP[op]] + '0') + ' multiplied by ' + t('-1') + ': it has the ' + (out ? 'between' : 'outside') + ' solution.', code: 'neg' }];
        return KP.mc(r, 'Which inequality has the solution ' + t(setTexX(T)) + '?', opts, t(facT(1, f) + OPS[op] + '0') + ' is ' + (out ? 'positive outside' : 'negative between') + ' ' + t(f[0][1]) + ' and ' + t(f[1][1]) + ': ' + t(tx(E) + OPS[op] + '0') + '.', ['The endpoints are the zeros.', 'A positive leading coefficient: negative between the zeros, positive outside.'], 'MC: inequality for a solution');
      } }] },
    { num: 'B6', parts: [
      { id: 'B6', level: 'PRG', make: function (r) {
        var f = fracFacs(r, { qs: [2, 3], pmax: 7, lo: 3, hi: 9, test: function (g) { var rs = rootsOf(g); return rs[0] < 0 && rs[1] > 2; } }), least = r.chance(0.35), op = rndOp(r, ['lt', 'lt', 'le']), rts = rootsOf(f), E = fpoly(1, f);
        var inc = op === 'le', ans = least ? Math.ceil(rts[0] + (inc ? -1e-9 : 1e-9)) : (inc ? Math.floor(rts[1] + 1e-9) : Math.ceil(rts[1] - 1e-9) - 1);
        var p = KP.nr('The ' + (least ? 'least' : 'greatest') + ' integer that satisfies ' + t(tx(E) + OPS[op] + '0') + ' is ______.', ans, function (v) { return near(v, ans + (least ? -1 : 1)) ? { code: CP + 'ends', hint: 'Check the endpoint: ' + (inc ? 'it is included.' : 'with ' + t('<') + ' the zero itself is not included.') } : null; },
          t(facT(1, f) + OPS[op] + '0') + ': ' + t(setTexX(facSet(1, f, op))) + '. The ' + (least ? 'least' : 'greatest') + ' integer in it is <b>' + ans + '</b>.', ['Solve the inequality first.', 'Then look at the ' + (least ? 'left' : 'right') + ' endpoint: is it included?'], 'NR: greatest or least integer');
        p.bad = [String(ans + (least ? -1 : 1))];
        return p;
      } }] },

    { num: 'C1', section: 'C. Stretch', parts: [
      { id: 'C1', level: 'MAS', make: function (r) {
        var f = pickWhere(function () { var a = r.int(-7, 1), b = r.int(-3, 4), c = r.int(1, 8); return [[1, a], [1, b], [1, c]]; }, function (g) { var a = g[0][1], b = g[1][1], c = g[2][1]; return a < b && b < c && c - a <= 11 && fresh(g); });
        var op = rndOp(r), show = facT(1, [f[1], f[0], f[2]]) + OPS[op] + '0';
        return solvePart(1, f, op, show, { text: 'a product of three factors', hints: ['Three zeros make four intervals.', 'Multiply the signs of the three factors in each interval.'] });
      } }] },
    { num: 'C2', shared: function (r) { return surdShared(r, function (z) { return z.h === 3 && z.n === 5; }); }, parts: [
      { id: 'C2', level: 'MAS', make: function (r, o) {
        var S = surdParts(o);
        return U.exactSetPart(CP, 'Solve ' + t(tx(S.E) + OPS[o.op] + '0') + '. Give exact endpoints.', S.T, S.texOf, {}, surdSol(o, S), ['Find the zeros with the quadratic formula.', 'Positive outside the zeros, negative between them.'], 'irrational zeros, exact');
      } }] },
    { num: 'C3', parts: [
      { id: 'C3', level: 'MAS', make: function (r) {
        var s = pickWhere(function () { return { b: 2 * nz(r, 1, 7), neg: r.chance(0.35), n: r.pick([1, 1, 1, 2]) }; }, function (z) { return !(z.b === 6 && !z.neg && z.n === 1); });
        var bound = s.b * s.b / (4 * s.n), T = s.neg ? SET.below(-bound, false) : SET.above(bound, false);
        var lead = s.neg ? (s.n === 1 ? '-' : '-' + s.n) : (s.n === 1 ? '' : String(s.n)), show = lead + 'x^{2}' + (s.b > 0 ? '+' : '-') + Math.abs(s.b) + 'x+c' + (s.neg ? '<0' : '>0');
        var sol = 'The parabola opens ' + (s.neg ? 'down' : 'up') + ', so it is ' + (s.neg ? 'below' : 'above') + ' the ' + t('x') + '-axis for every ' + t('x') + ' exactly when it has no real zeros: ' + t('b^{2}-4ac<0') + '.<br>' +
          t(s.b * s.b + '-4(' + (s.neg ? -s.n : s.n) + ')c<0') + ', so ' + (s.neg ? t(s.b * s.b + '+' + 4 * s.n + 'c<0') + ' and ' + t('c<' + vt(-bound)) : t(s.b * s.b + '-' + 4 * s.n + 'c<0') + ' and ' + t('c>' + vt(bound))) + '. (At ' + t('c=' + vt(s.neg ? -bound : bound)) + ' there is a double zero where the expression is ' + t('0') + ', so that value fails.)<br>' + t(setTexX(T, 'c')) + '.';
        return U.setPart(CP, 'For what values of ' + t('c') + ' is ' + t(show) + ' true for every real number ' + t('x') + '?' + PROMPT_SET, T,
          { v: 'c', wrongs: [{ parts: s.neg ? SET.below(-bound, true) : SET.above(bound, true), code: CP + 'c-incl', hint: 'At ' + t('c=' + vt(s.neg ? -bound : bound)) + ' the expression is a perfect square times a constant: it equals ' + t('0') + ' at one ' + t('x') + ', so the strict inequality fails there.' }] }, sol,
          ['For the inequality to hold for every ' + t('x') + ', the parabola must never touch the ' + t('x') + '-axis.', 'No real zeros: ' + t('b^{2}-4ac<0') + '. Solve that for ' + t('c') + '.'], 'always positive (or negative)');
      } }] }
  ];

  HW.defineLesson({ id: LID, unit: 8, num: '7', title: 'Quadratic Inequalities in One Variable: Sign Analysis', outcome: RF8, calc: true, questions: QUESTIONS, extra: EXTRA });
})(window);
