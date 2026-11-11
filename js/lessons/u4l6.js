/* Math 20-1 · Unit 4 · Lesson 6 — Solving Radical Equations and Checking for Extraneous Roots (outcome AN3 on every part)
 * Assignment 6 (u4_l06.tex, Questions 1–16) and the Lesson 6 Extra Practice (u4_ep06.tex, A1–A3, B1–B6, C1–C3).
 * Every part is a generator: the booklet question's idea, form and difficulty with new numbers (the lesson's example
 * numbers and the booklet question's own numbers are left out where that is easy). No calculator (Unit 4): exact
 * answers — except the pendulum questions (10, Extra B3), whose booklet versions round a π answer; those say so and
 * accept the rounded value.
 *
 * This file also holds the radical-equation kit HW.u4rad, for Lesson 7 (radical equations that lead to quadratics):
 *
 *   var R = HW.u4rad;
 *   R.Q(p, q), R.qv(r), R.rT(r)            exact rationals [p, q] and their LaTeX
 *   R.termTex(c, pow, v, first), R.pT([[c, pow], …], v), R.linT(a, b, v)   polynomial LaTeX (terms in the order given)
 *   R.radT(a, b, r, v)                     \sqrt{av+b} (or \sqrt{\dfrac{av+b}{r}});  R.kRad(k, tex): k·tex (k = 1, −1, int or [p,q])
 *   R.restrictInfo(rads, v)               rads = [{ a, b }] meaning a·v + b ≥ 0 → { tex, lines, lo, hi, empty }
 *                                         (tex 'x\ge 3', '-5\le x\le 2'; lines = the worked restriction, booklet style)
 *   R.ineq(targetTex, opt)                checker for an inequality answer (x ≥ 3, 3 ≤ x, [3, ∞), −5 ≤ x ≤ 2, "x ≥ −5 and x ≤ 2"…)
 *                                         opt: { v, cands: [{ tex, code, hint }], hint }
 *   R.restrictCands(rads, v)              the typical wrong restrictions (sign not reversed, strict instead of ≥, bound with
 *                                         the wrong sign or upside down, only one of two radicands) as cands for R.ineq
 *   R.P.restrict(prompt, rads, opt)       part: "state the restriction" (keypad 'u4ineq': ≤ ≥ < > and the variable)
 *   R.P.ineq(prompt, targetTex, opt)      part: any inequality answer (opt: v, cands, sol, hints, text)
 *   R.readRoots(resp, v)                  → { none } | { vals } | { letter } | { bad } | { empty } | { unsimp }
 *   R.solveCheck(roots, opt)              checker for "solve and verify": roots = the admissible roots (numbers or [p,q]),
 *                                         [] for no solution. opt: { v, ext: [extraneous values], extHint, cands: [{ val, code,
 *                                         hint }], noneHint }. Answers: "x = 4", "x = 4, x = −1", "no solution" (also none, ∅).
 *                                         Codes: u4rad-kept-extraneous (kept a root that fails the check — its own hint),
 *                                         u4rad-said-none (said "no solution" when a root checks), sol-missing / sol-extra.
 *   R.P.solve(prompt, roots, opt)         part (keypad 'u4rad': numbers, fractions, √, v =, comma, ± and a "no solution" key)
 *   R.lin1(o)                             one radical: c + k·√((a·v + b)/r) = d (o: { v, a, b, r, k, c, d, layout: 'kc'|'ck' })
 *                                         → { tex, m, x, ok, info, lines, cands } (lines = restriction, isolate, square, solve,
 *                                         verify; cands = typical wrong roots with codes)
 *   R.two(o)                              k1√(a1·v + b1) = k2√(a2·v + b2)  (o.layout 'minus': √A − k2√B = 0) → same shape
 *   R.verifyLine(lhsTex, lhsVal, rhsVal, ok)   "Verify: … = 5 ✓" / "… ≠ −2: extraneous"
 *
 * Recognised mistakes (codes u4rad-…): kept the extraneous root, said "no solution" when a root checks, didn't square the
 * other side, squared a negative to a negative, moved a constant with the wrong sign, squared each term before isolating,
 * didn't divide by (or square) the coefficient of the radical, didn't clear the fraction under the root, sign slip
 * dividing by a negative coefficient; restrictions: sign not reversed, strict inequality, wrong bound, one restriction of
 * two; units (cm vs m) in the pendulum.
 * Conversions: "explain the error" → multiple choice of explanations with the corrected answer; "explain why there is
 * no solution" → multiple choice of reasons; "describe how to use the intersect feature" → multiple choice of set-ups
 * with the root; "verify algebraically" → solve for the root. Cube-root extension (Extra C3): the root, then a reason.
 * Levels: LIM BEG EMG PRG ADV MAS. Mastery: 14 (which equation produces an extraneous root), Extra C2, C3. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, B = K.P, ex = HW.ex, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
  var LID = 'u4l6';

  var CODES = {
    'u4rad-kept-extraneous': 'Kept an extraneous root (didn’t verify)', 'u4rad-said-none': 'Said “no solution” when a root checks', 'u4rad-no-square': 'Didn’t square the other side',
    'u4rad-sq-neg': 'Squared a negative number to a negative', 'u4rad-move-sign': 'Isolating: moved a constant with the wrong sign', 'u4rad-square-terms': 'Squared each term before isolating the radical',
    'u4rad-coef': 'Didn’t divide by the coefficient of the radical', 'u4rad-coef-sq': 'Didn’t square the coefficient of the radical', 'u4rad-frac': 'Didn’t clear the fraction under the root',
    'u4rad-lin-sign': 'Sign slip dividing by a negative coefficient', 'u4rad-flip': 'Restriction: inequality sign not reversed (or reversed when it shouldn’t be)', 'u4rad-strict': 'Restriction: < or > instead of ≤ or ≥',
    'u4rad-bound-sign': 'Restriction: bound with the wrong sign', 'u4rad-bound': 'Restriction: wrong bound', 'u4rad-one': 'Restriction: only one of the two radicands', 'u4rad-ineq-form': 'Not written as an inequality',
    'u4rad-units': 'Units: centimetres used as metres (or the reverse)', 'u4rad-no-root': 'Pendulum: didn’t square both sides', 'u4l6-ycoord': 'Read the y-coordinate as the root', 'u4l6-endpoint': 'Read the end of a graph as the root'
  };
  HW.addCodes(CODES);
  HW.addPartial({ 'u4rad-kept-extraneous': 'b', 'u4rad-said-none': 'n', 'u4rad-no-square': 'b', 'u4rad-sq-neg': 'b', 'u4rad-move-sign': 'b', 'u4rad-square-terms': 'b', 'u4rad-coef': 'b', 'u4rad-coef-sq': 'b',
    'u4rad-frac': 'b', 'u4rad-lin-sign': 's', 'u4rad-flip': 'b', 'u4rad-strict': 's', 'u4rad-bound-sign': 'b', 'u4rad-bound': 'b', 'u4rad-one': 'b', 'u4rad-units': 's', 'u4rad-no-root': 'b', 'u4l6-ycoord': 'b', 'u4l6-endpoint': 'n' });

  /* ============================== the kit (HW.u4rad) ============================== */
  var R = HW.u4rad = { P: {} };
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var r = a % b; a = b; b = r; } return a; }
  function Q(p, q) { q = q == null ? 1 : q; if (q < 0) { p = -p; q = -q; } var g = gcd(p, q) || 1; return [p / g, q / g]; }
  function qq(x) { return Array.isArray(x) ? Q(x[0], x[1]) : [x, 1]; }
  function qv(r) { r = qq(r); return r[0] / r[1]; }
  function qmul(a, b) { a = qq(a); b = qq(b); return Q(a[0] * b[0], a[1] * b[1]); }
  function qadd(a, b) { a = qq(a); b = qq(b); return Q(a[0] * b[1] + b[0] * a[1], a[1] * b[1]); }
  function qdiv(a, b) { a = qq(a); b = qq(b); return Q(a[0] * b[1], a[1] * b[0]); }
  function rT(r) { return ex.texRat(qq(r)); }
  function same(a, b) { return Math.abs(a - b) < 1e-9; }
  function range(a, b) { var o = []; for (var i = a; i <= b; i++) o.push(i); return o; }
  function pm(a, b) { return range(a, b).concat(range(a, b).map(function (x) { return -x; })); }
  function pickWhere(gen, okf) { for (var i = 0; i < 8000; i++) { var o = gen(); if (okf(o)) return o; } throw new Error(LID + ': no valid numbers'); }
  function fracOf(x) { for (var q = 1; q <= 200; q++) { var p = Math.round(x * q); if (Math.abs(p / q - x) < 1e-9) return Q(p, q); } return [x, 1]; }
  function termTex(c, pow, v, first) {
    c = qq(c); if (!c[0]) return '';
    var neg = c[0] < 0, a = Math.abs(c[0]), num = c[1] === 1 ? String(a) : '\\frac{' + a + '}{' + c[1] + '}', body;
    if (pow === 0) body = num; else body = (a === 1 && c[1] === 1 ? '' : num) + v + (pow > 1 ? '^{' + pow + '}' : '');
    return (neg ? '-' : first ? '' : '+') + body;
  }
  function pT(list, v) { var s = ''; list.forEach(function (x) { s += termTex(x[0], x[1], v || 'x', !s); }); return s || '0'; }
  function linT(a, b, v) { return pT([[a, 1], [b, 0]], v); }
  function radT(a, b, r, v) { var l = linT(a, b, v); return '\\sqrt{' + (r && r > 1 ? '\\dfrac{' + l + '}{' + r + '}' : l) + '}'; }
  function kRad(k, tex) { k = qq(k); if (k[0] === 1 && k[1] === 1) return tex; if (k[0] === -1 && k[1] === 1) return '-' + tex; return rT(k) + tex; }
  R.Q = Q; R.qv = qv; R.qq = qq; R.qmul = qmul; R.qadd = qadd; R.qdiv = qdiv; R.rT = rT; R.termTex = termTex; R.pT = pT; R.linT = linT; R.radT = radT; R.kRad = kRad; R.fracOf = fracOf;

  /* ---------------- restrictions ---------------- */
  function bounds(rads) { return rads.map(function (rd) { return { bd: Q(-rd.b, rd.a), ge: rd.a > 0 }; }); }
  function combine(bs, v, strict) {
    var lo = null, hi = null;
    bs.forEach(function (b) { if (b.ge) { if (lo == null || qv(b.bd) > qv(lo)) lo = b.bd; } else if (hi == null || qv(b.bd) < qv(hi)) hi = b.bd; });
    var le = strict ? '<' : '\\le ', ge = strict ? '>' : '\\ge ';
    if (lo && hi) { if (qv(lo) > qv(hi)) return { empty: true, lo: lo, hi: hi }; return { tex: rT(lo) + le + v + le + rT(hi), lo: lo, hi: hi }; }
    if (lo) return { tex: v + ge + rT(lo), lo: lo };
    return { tex: v + le + rT(hi), hi: hi };
  }
  R.restrictInfo = function (rads, v) {
    v = v || 'x';
    var lines = rads.map(function (rd) {
      var a = rd.a, b = rd.b, bd = Q(-b, a), rel = a > 0 ? '\\ge ' : '\\le ', first = t(linT(a, b, v) + '\\ge 0');
      if (a === 1) return b === 0 ? t(v + '\\ge 0') : first + ' ⇒ ' + t(v + rel + rT(bd));
      var mid = b === 0 ? '' : t(termTex(a, 1, v, true) + '\\ge ' + (-b)) + ' ⇒ ';
      return first + ' ⇒ ' + mid + t(v + rel + rT(bd)) + (a < 0 ? ' (the sign reverses)' : '');
    });
    var c = combine(bounds(rads), v);
    if (rads.length > 1) lines.push(c.empty ? 'No number satisfies both.' : 'Both hold when ' + t(c.tex) + '.');
    return { tex: c.empty ? null : c.tex, lines: lines.join('; &nbsp;'), lo: c.lo, hi: c.hi, empty: !!c.empty };
  };
  R.restrictCands = function (rads, v) {
    v = v || 'x';
    var bs = bounds(rads), out = [];
    var put = function (list, code, hint, strict) { var c = combine(list, v, strict); if (c.empty || !c.tex) return; out.push({ tex: c.tex, code: code, hint: hint }); };
    bs.forEach(function (b, i) {
      var rd = rads[i], copy = function (f) { return bs.map(function (x, j) { return j === i ? f(x) : x; }); };
      put(copy(function (x) { return { bd: x.bd, ge: !x.ge }; }), 'u4rad-flip', rd.a < 0 ? 'Dividing (or multiplying) an inequality by a <b>negative</b> number reverses the sign: ' + t(linT(rd.a, rd.b, v) + '\\ge 0') + ' gives ' + t(v + '\\le ' + rT(b.bd)) + '.'
        : 'Adding, subtracting or dividing by a <b>positive</b> number keeps the direction: ' + t(linT(rd.a, rd.b, v) + '\\ge 0') + ' gives ' + t(v + '\\ge ' + rT(b.bd)) + '.');
      if (b.bd[0]) put(copy(function (x) { return { bd: [-x.bd[0], x.bd[1]], ge: x.ge }; }), 'u4rad-bound-sign', 'Check the sign of the bound: solve ' + t(linT(rd.a, rd.b, v) + '\\ge 0') + ' by moving the constant to the other side (its sign changes), then dividing.');
      if (b.bd[0] && Math.abs(b.bd[0]) !== b.bd[1]) put(copy(function (x) { return { bd: Q(x.bd[1], x.bd[0]), ge: x.ge }; }), 'u4rad-bound', 'Your bound is upside down: after moving the constant, divide by the <b>coefficient of ' + t(v) + '</b>.');
      if (rads.length > 1) put([b], 'u4rad-one', 'There are two conditions, and <b>both</b> must hold (each one ' + t('\\ge 0') + '): combine the two restrictions into one.');
    });
    put(bs, 'u4rad-strict', 'A radicand can be ' + t('0') + ' (' + t('\\sqrt{0}=0') + '), so the boundary value is allowed: use ' + t('\\ge') + ' or ' + t('\\le') + '.', true);
    return out;
  };
  R.ineq = function (targetTex, opt) {
    opt = opt || {}; var v = opt.v || 'x', S = HW.sets, T = S.parse(targetTex);
    if (!T.ok) throw new Error('u4rad.ineq: bad target ' + targetTex);
    var cands = (opt.cands || []).map(function (c) { var p = S.parse(c.tex); return { set: p.ok ? p.set : null, code: c.code, hint: c.hint }; }).filter(function (c) { return c.set && !S.eq(c.set, T.set); });
    return function (resp) {
      var s = String(resp == null ? '' : resp);
      if (!s.replace(/\s|\\[ ,;:!]/g, '')) return form('empty', 'Type your answer first.');
      var a = S.parse(s);
      if (!a.ok || a.set.kind !== 'int') return form('u4rad-ineq-form', 'Write it as an inequality, e.g. ' + t(v + '\\ge 3') + ', ' + t(v + '\\le 2') + ' or ' + t('-5\\le ' + v + '\\le 2') + '.');
      if (a.v && a.v !== v) return form('sol-letter', 'Use the variable ' + t(v) + ' (you wrote ' + t(a.v) + ').');
      if (S.eq(a.set, T.set)) return ok();
      for (var i = 0; i < cands.length; i++) if (S.eq(a.set, cands[i].set)) return wrong(cands[i].code, cands[i].hint);
      return wrong('u4rad-bound', opt.hint || 'Not quite. Solve “radicand ' + t('\\ge 0') + '” for ' + t(v) + ' — and remember that dividing by a negative number reverses the sign.');
    };
  };
  R.P.ineq = function (prompt, targetTex, opt) {
    opt = opt || {}; var v = opt.v || 'x';
    return { prompt: prompt, input: { type: 'math', keys: 'u4ineq', vars: [v], before: opt.before, placeholder: 'e.g. ' + v + ' >= 3' }, check: R.ineq(targetTex, opt), key: targetTex, answer: t(targetTex),
      solution: opt.sol, hints: opt.hints || [], text: opt.text, bad: (opt.cands || []).filter(function (c) { var p = HW.sets.parse(c.tex), q = HW.sets.parse(targetTex); return p.ok && !HW.sets.eq(p.set, q.set); }).map(function (c) { return c.tex; }).slice(0, 5) };
  };
  R.P.restrict = function (prompt, rads, opt) {
    opt = opt || {}; var v = opt.v || 'x', info = R.restrictInfo(rads, v);
    return R.P.ineq(prompt, info.tex, { v: v, cands: R.restrictCands(rads, v).concat(opt.cands || []), sol: opt.sol || info.lines, text: opt.text || 'restriction on the variable',
      hints: opt.hints || ['A square root is defined only when its radicand is ' + t('\\ge 0') + ': solve “radicand ' + t('\\ge 0') + '”' + (rads.length > 1 ? ' for each radical, then combine.' : '.'), 'Dividing an inequality by a negative number reverses the sign.'] });
  };

  /* ---------------- roots (with "no solution") ---------------- */
  var NONE = /^(no(real)?solutions?|nosoln|none|ns|∅|\\varnothing|\\emptyset|\\o|\{\}|\\\{\\\})$/i;
  R.readRoots = function (resp, v) {
    var s = String(resp == null ? '' : resp).replace(/\\(left|right)/g, '').replace(/\\(text|mathrm|textrm)\{([^{}]*)\}/g, '$2');
    var sq = s.replace(/\s|\\[ ,;:!]|~/g, '').replace(/^[a-zA-Z]=/, '').replace(/\.$/, '');
    if (!sq) return { empty: true };
    if (NONE.test(sq)) return { none: true };
    s = s.replace(/\b(or|and)\b/gi, ',').replace(/;/g, ',');
    var lm, letters = /([a-zA-Z])\s*=/g;
    while ((lm = letters.exec(s))) { if (v && lm[1] !== v) return { letter: lm[1] }; }
    s = s.replace(/[a-zA-Z]\s*=\s*/g, '').replace(/\\pm|±/g, '±').replace(/\\(quad|qquad)|\\[ ,;:!]|~/g, ' ');
    var out = [], pieces = s.split(',');
    for (var i = 0; i < pieces.length; i++) {
      var p = pieces[i].trim(); if (!p) continue;
      var pmv = p.charAt(0) === '±'; if (pmv) p = p.slice(1);
      var r = ex.parse(p); if (!r.ok) return { bad: true };
      var val = ex.value(r.ast); if (!isFinite(val)) return { bad: true };
      if (!/sqrt|√/.test(p) && (/\\times|\\cdot|[×*+]/.test(p) || /[0-9a-zA-Z})]\s*[-−]/.test(p))) return { unsimp: true };
      out.push(val); if (pmv) out.push(-val);
    }
    if (!out.length) return { empty: true };
    return { vals: out.filter(function (x, i) { return !out.slice(0, i).some(function (y) { return same(x, y); }); }) };
  };
  R.solveCheck = function (roots, opt) {
    opt = opt || {}; var v = opt.v || 'x', T = roots.map(qv), X = (opt.ext || []).map(qv);
    var has = function (L, x) { return L.some(function (y) { return same(x, y); }); };
    var extHint = opt.extHint || 'Verify every value in the <b>original</b> equation. A value that doesn’t make the left side equal the right side is <b>extraneous</b> and must be rejected.';
    return function (resp) {
      var A = R.readRoots(resp, v);
      if (A.empty) return form('empty', 'Type your answer first (or press <b>no solution</b>).');
      if (A.letter) return form('sol-letter', 'Use the variable ' + t(v) + ' here (you wrote ' + t(A.letter + '=') + ').');
      if (A.unsimp) return form('simplify', 'Simplify each root to a single number.');
      if (A.bad) return form('unreadable', 'Write the root as a number, e.g. ' + t(v + '=4') + ', or press <b>no solution</b>.');
      if (A.none) return T.length ? wrong('u4rad-said-none', opt.noneHint || 'There is a solution here. After isolating, the radical equals a number that is ' + t('\\ge 0') + ', so squaring is safe — solve, then verify.') : ok();
      var vals = A.vals, extra = vals.filter(function (x) { return !has(T, x); }), miss = T.filter(function (x) { return !has(vals, x); });
      if (!extra.length && !miss.length) return ok();
      if (extra.some(function (x) { return has(X, x); })) return wrong('u4rad-kept-extraneous', extHint);
      if (vals.length === 1 && extra.length === 1) { var c = (opt.cands || []).filter(function (cd) { return same(qv(cd.val), vals[0]); })[0]; if (c) return wrong(c.code, c.hint); }
      if (!T.length) return wrong('value', 'Verify your value in the original equation. (Can the radical equal the number it has to equal?)');
      if (miss.length && !extra.length) return wrong('sol-missing', 'Correct so far — but another value also checks.');
      if (extra.length && !miss.length) return wrong('sol-extra', 'You have a value that isn’t a root — substitute each one into the original equation to check.');
      if (vals.length === T.length && vals.every(function (x) { return has(T, -x); })) return wrong('sign', 'Check the sign of your answer.');
      return wrong('value', null);
    };
  };
  R.P.solve = function (prompt, roots, opt) {
    opt = opt || {}; var v = opt.v || 'x';
    var key = roots.length ? roots.map(function (x) { return v + '=' + rT(qq(x)); }).join(',\\ ') : '\\text{no solution}';
    var bad = (opt.ext || []).concat((opt.cands || []).map(function (c) { return c.val; })).map(function (x) { return v + '=' + rT(fracOf(qv(x))); });
    if (roots.length) bad.push('\\text{no solution}');
    return { prompt: prompt, input: { type: 'math', keys: 'u4rad', vars: [v], before: opt.before, placeholder: 'e.g. ' + v + ' = 4  or  no solution' }, check: R.solveCheck(roots, opt), key: key, answer: roots.length ? t(key) : 'no solution',
      solution: opt.sol, hints: opt.hints || H_SOLVE, text: opt.text, bad: bad, good: roots.length ? [] : ['no solution', 'none', '\\varnothing'] };
  };
  var H_SOLVE = ['State the restriction, then isolate the radical, square both sides and solve.', 'Verify by substituting into the <b>original</b> equation. A square root is never negative: if the radical has to equal a negative number, there is no solution.'];
  R.H_SOLVE = H_SOLVE;
  R.verifyLine = function (lhsTex, lhsVal, rhsVal, okv, v, x) {
    return 'Verify: ' + t(lhsTex + '=' + rT(lhsVal)) + (okv ? ' ✓' : ', but the right side is ' + t(rT(rhsVal)) + '. ' + t(v + '=' + rT(x)) + ' is extraneous: <b>no solution</b>.');
  };

  /* ---------------- c + k·√((a v + b)/r) = d ---------------- */
  R.lin1 = function (o) {
    var v = o.v || 'x', a = o.a, b = o.b, rr = o.r || 1, k = qq(o.k == null ? 1 : o.k), c = o.c || 0, d = o.d;
    var M = Q(d - c, 1), m = qdiv(M, k), m2 = qmul(m, m), A = qmul(m2, rr), x = qdiv(qadd(A, -b), a), okv = m[0] >= 0;
    var rad = radT(a, b, rr, v), term = kRad(k, rad), lhs;
    if (o.layout === 'ck') lhs = c + (term.charAt(0) === '-' ? '' : '+') + term;
    else lhs = term + (c > 0 ? '+' + c : c < 0 ? String(c) : '');
    var tex = lhs + '=' + d, info = R.restrictInfo([{ a: a, b: b }], v), lin = linT(a, b, v);
    var L = ['Restriction: ' + t(info.tex)];
    var iso = [];
    if (c) iso.push(t(term + '=' + rT(M)));
    if (!(k[0] === 1 && k[1] === 1)) iso.push(t(rad + '=' + rT(m)));
    if (iso.length) L.push(iso.join(' &nbsp;⇒&nbsp; '));
    if (!okv) L.push('A square root is never negative, so ' + t(rad + '=' + rT(m)) + ' is impossible. Squaring anyway:');
    var sqL = rr > 1 ? t('\\frac{' + lin + '}{' + rr + '}=' + rT(m2)) + ' &nbsp;⇒&nbsp; ' + t(lin + '=' + rT(A)) : t(lin + '=' + rT(A));
    var solveL = '';
    if (!(a === 1 && b === 0)) solveL = (a !== 1 ? t(termTex(a, 1, v, true) + '=' + rT(qadd(A, -b))) + ' &nbsp;⇒&nbsp; ' : '') + t(v + '=' + rT(x));
    L.push(sqL + (solveL ? ' &nbsp;⇒&nbsp; ' + solveL : ''));
    var sub = kRad(k, '\\sqrt{' + rT(m2) + '}'), lhsSub = o.layout === 'ck' ? c + (sub.charAt(0) === '-' ? '' : '+') + sub : sub + (c > 0 ? '+' + c : c < 0 ? String(c) : '');
    var lhsVal = qadd(qmul(k, [Math.abs(m[0]), m[1]]), c);
    L.push(R.verifyLine(lhsSub, lhsVal, d, okv, v, x));
    var cands = [], push = function (val, code, hint) { if (!val || !isFinite(qv(val)) || (okv && same(qv(val), qv(x))) || (!okv && same(qv(val), qv(x)))) return; if (cands.some(function (q) { return same(qv(q.val), qv(val)); })) return; cands.push({ val: val, code: code, hint: hint }); };
    var solveFor = function (Aval) { return qdiv(qadd(Aval, -b), a); };
    if (okv && !same(qv(m), 0) && !same(qv(m), 1)) push(solveFor(qmul(m, rr)), 'u4rad-no-square', 'Square <b>both</b> sides: if ' + t(rad + '=' + rT(m)) + ' then the radicand equals ' + t(rT(m) + '^{2}=' + rT(m2)) + '.');
    if (!okv) push(solveFor(qmul(qmul(m2, -1), rr)), 'u4rad-sq-neg', t('(' + rT(m) + ')^{2}=' + rT(m2)) + ', not ' + t(rT(qmul(m2, -1))) + ' — and in any case a square root can never equal a negative number. Verify your answer.');
    if (c) { var m1 = qdiv(Q(d + c, 1), k); if (m1[0] >= 0) push(solveFor(qmul(qmul(m1, m1), rr)), 'u4rad-move-sign', 'Isolate the radical carefully: to undo ' + t((c > 0 ? '+' : '') + c) + ', ' + (c > 0 ? 'subtract ' + t(String(c)) : 'add ' + t(String(-c))) + ' on both sides.'); }
    if (c && k[0] === 1 && k[1] === 1 && rr === 1) push(solveFor(Q(d * d - c * Math.abs(c), 1)), 'u4rad-square-terms', 'Square both <b>sides</b>, not each term: isolate the radical first, then square.');
    if (!(k[0] === 1 && k[1] === 1)) { push(solveFor(qmul(qmul(M, M), rr)), 'u4rad-coef', 'Divide by ' + t(rT(k)) + ' before squaring (or square it too: ' + t('(' + rT(k) + '\\sqrt{A})^{2}=' + rT(qmul(k, k)) + 'A') + ').'); push(solveFor(qmul(qdiv(qmul(M, M), k), rr)), 'u4rad-coef', 'Divide both sides by ' + t(rT(k)) + ' first, then square: ' + t(rad + '=' + rT(m)) + '.'); }
    if (rr > 1) push(solveFor(m2), 'u4rad-frac', 'After squaring, ' + t('\\frac{' + lin + '}{' + rr + '}=' + rT(m2)) + ': multiply both sides by ' + t(String(rr)) + '.');
    if (a < 0) push(qmul(x, -1), 'u4rad-lin-sign', 'Check the last step: dividing by the negative coefficient ' + t(String(a)) + ' changes the sign.');
    return { tex: tex, m: m, M: M, x: x, ok: okv, info: info, lines: L.join('<br>'), cands: cands, rad: rad, term: term, v: v };
  };
  /* a lin1 part: roots / extraneous from the equation */
  R.P.lin1 = function (prompt, e, opt) {
    opt = opt || {};
    return R.P.solve(prompt, e.ok ? [e.x] : [], { v: e.v, ext: e.ok ? [] : [e.x], cands: e.cands, sol: opt.sol || e.lines, hints: opt.hints, text: opt.text,
      extHint: 'Verify ' + t(e.v + '=' + rT(e.x)) + ' in the <b>original</b> equation: does the left side really equal the right side? (What number does ' + t(e.rad) + ' have to equal?) A value that doesn’t check is extraneous.' });
  };

  /* ---------------- k1√(a1 v + b1) = k2√(a2 v + b2) ---------------- */
  R.two = function (o) {
    var v = o.v || 'x', k1 = o.k1 || 1, k2 = o.k2 || 1, K1 = k1 * k1, K2 = k2 * k2;
    var r1 = radT(o.a1, o.b1, 1, v), r2 = radT(o.a2, o.b2, 1, v), lin1 = linT(o.a1, o.b1, v), lin2 = linT(o.a2, o.b2, v);
    var left = kRad(k1, r1), right = kRad(k2, r2);
    var tex = o.layout === 'minus' ? left + '-' + right + '=0' : left + '=' + right;
    var cx = K1 * o.a1 - K2 * o.a2, cc = K2 * o.b2 - K1 * o.b1;
    if (!cx) throw new Error('u4rad.two: no unique solution');
    var x = Q(cc, cx), A1 = qadd(qmul(o.a1, x), o.b1), A2 = qadd(qmul(o.a2, x), o.b2), okv = A1[0] >= 0 && A2[0] >= 0;
    var info = R.restrictInfo([{ a: o.a1, b: o.b1 }, { a: o.a2, b: o.b2 }], v);
    var L = ['Restriction: ' + (info.empty ? 'none possible' : t(info.tex)) + (/both/i.test(info.lines) ? ' (' + info.lines.replace(/; &nbsp;Both hold when.*$/, '') + ')' : '')];
    if (o.layout === 'minus') L.push(t(left + '=' + right));
    var sq = (K1 > 1 ? K1 + '(' + lin1 + ')' : lin1) + '=' + (K2 > 1 ? K2 + '(' + lin2 + ')' : lin2);
    var steps = [t(sq)];
    if (K1 > 1 || K2 > 1) steps.push(t(linT(K1 * o.a1, K1 * o.b1, v) + '=' + linT(K2 * o.a2, K2 * o.b2, v)));
    steps.push(t(termTex(cx, 1, v, true) + '=' + cc) + (cx !== 1 ? ' &nbsp;⇒&nbsp; ' + t(v + '=' + rT(x)) : ''));
    L.push('Square both sides: ' + steps.join(' &nbsp;⇒&nbsp; '));
    var vtex = function (k, Aq) { var s = kRad(k, '\\sqrt{' + rT(Aq) + '}'); return k > 1 ? s + '=\\sqrt{' + rT(qmul(Aq, k * k)) + '}' : s; };
    if (okv) L.push('Verify: left side ' + t(vtex(k1, A1)) + ', right side ' + t(vtex(k2, A2)) + ' ✓');
    else L.push('Verify: ' + t('\\sqrt{' + rT(A1[0] < 0 ? A1 : A2) + '}') + ' is not a real number (' + t(v + '=' + rT(x)) + ' breaks the restriction' + (info.tex ? ' ' + t(info.tex) : '') + '). ' + t(v + '=' + rT(x)) + ' is extraneous: <b>no solution</b>.');
    var cands = [];
    if (k1 > 1 || k2 > 1) { var cx2 = k1 * o.a1 - k2 * o.a2, cc2 = k2 * o.b2 - k1 * o.b1; if (cx2) { var x2 = Q(cc2, cx2); if (!same(qv(x2), qv(x))) cands.push({ val: x2, code: 'u4rad-coef-sq', hint: 'Square the coefficient too: ' + t('(' + (k1 > 1 ? k1 : k2) + '\\sqrt{A})^{2}=' + (k1 > 1 ? K1 : K2) + 'A') + '.' }); } }
    return { tex: tex, x: x, ok: okv, info: info, lines: L.join('<br>'), cands: cands, v: v, A1: A1, A2: A2 };
  };
  R.P.two = function (prompt, e, opt) {
    opt = opt || {};
    return R.P.solve(prompt, e.ok ? [e.x] : [], { v: e.v, ext: e.ok ? [] : [e.x], cands: e.cands, sol: e.lines, hints: opt.hints || ['Each side is a single radical: square both sides (square any coefficient in front too) and solve.', 'Check the answer in <b>both</b> radicands: if either is negative, the value is extraneous.'], text: opt.text,
      extHint: 'Verify ' + t(e.v + '=' + rT(e.x)) + ' in <b>both</b> radicands: is each one ' + t('\\ge 0') + '? A value that makes a radicand negative is extraneous.' });
  };

  /* ---------------- keypads ---------------- */
  var W = HW.widgets;
  if (W && W.KEYSETS) {
    var d = function (n) { return { label: String(n), tex: String(n), plain: String(n) }; };
    var KY = { del: { label: '⌫', fn: 'del', title: 'Delete' }, clear: { label: 'clear', fn: 'clear' }, left: { label: '◀', fn: 'left', title: 'Move left' }, right: { label: '▶', fn: 'right', title: 'Move right (out of a box)' },
      enter: { label: 'Check ↵', fn: 'enter', wide: true }, minus: { label: '−', tex: '-', plain: '-' }, dot: { label: '.', tex: '.', plain: '.' }, frac: { label: '<sup>a</sup>⁄<sub>b</sub>', tex: '\\frac{#@}{#?}', plain: '/', title: 'Fraction' },
      le: { label: '≤', tex: '\\le ', plain: ' <= ' }, lt: { label: '<', tex: '<', plain: ' < ' }, ge: { label: '≥', tex: '\\ge ', plain: ' >= ' }, gt: { label: '>', tex: '>', plain: ' > ' } };
    W.KEYSETS.u4ineq = function (opt) {
      var v = (opt && opt.vars && opt.vars[0]) || 'x';
      return [[d(7), d(8), d(9), KY.ge, KY.le, KY.del], [d(4), d(5), d(6), KY.gt, KY.lt, KY.clear], [d(1), d(2), d(3), KY.minus, KY.left, KY.right], [d(0), KY.dot, KY.frac, { label: '<i>' + v + '</i>', tex: v, plain: v }, KY.enter]];
    };
    W.KEYSETS.u4rad = function (opt) {
      var base = W.KEYSETS.solutions ? W.KEYSETS.solutions(opt) : [[d(7), d(8), d(9), KY.frac, KY.del], [d(4), d(5), d(6), KY.clear], [d(1), d(2), d(3), KY.minus, KY.left, KY.right], [d(0), KY.dot, KY.enter]];
      var rows = base.map(function (rw) { return rw.slice(); });
      rows.push([{ label: 'no solution', tex: '\\text{no solution}', plain: 'no solution', title: 'Every value found is extraneous: there is no solution', wide: true }]);
      return rows;
    };
    W.KEYHELP = W.KEYHELP || {};
    W.KEYHELP.u4ineq = ['Use <b>≥ ≤ &gt; &lt;</b>, e.g. ' + HW.k('x\\ge 3') + ' or ' + HW.k('-5\\le x\\le 2') + '.', 'Type e.g. <code>x &gt;= 3</code> or <code>-5 &lt;= x &lt;= 2</code>.'];
    W.KEYHELP.u4rad = ['Type the root, e.g. ' + HW.k('x=4') + ' (separate several with a comma), or press <b>no solution</b> if every value you find is extraneous.', 'Type e.g. <code>x = 4</code>, or <code>no solution</code>.'];
  }

  /* ============================== Lesson 6 generators ============================== */
  function npick(r, a, b, not) { return pickWhere(function () { return r.int(a, b); }, function (x) { return (not || []).indexOf(x) < 0; }); }
  /* √(p·v + q) = n with an integer root x0 (q = n² − p·x0) */
  function rootLin(r, o) {
    return pickWhere(function () { return { p: r.pick(o.ps || [2, 3, 4, 5, 6]), x0: r.pick(o.xs || range(1, 9)), n: r.pick(o.ns || range(2, 9)) }; }, function (x) {
      x.q = x.n * x.n - x.p * x.x0; return x.q !== 0 && Math.abs(x.q) <= (o.qmax || 15) && (!o.qneg || x.q < 0) && !(o.avoid || []).some(function (a) { return a[0] === x.p && a[1] === x.q && a[2] === x.n; });
    });
  }
  function mcPart(r, prompt, opts, sol, hints, text) { return B.mc(r, prompt, opts, sol, hints, text); }
  function pend(T) { return 9.8 * T * T / (4 * Math.PI * Math.PI); }
  var CALC = '<span class="muted">(Calculator allowed for the last step: round only at the end.)</span> ';

  /* ============================== the assignment ============================== */
  var QUESTIONS = [
    { num: '1', section: 'Restrictions on the variable', stem: 'State the restriction on the variable.', parts: [
      { id: '1a', level: 'BEG', make: function (r) { var a = pickWhere(function () { return r.pick(pm(1, 12)); }, function (a) { return a !== 9 && a !== 4; }); return R.P.restrict(t('\\sqrt{' + linT(1, a) + '}=' + r.int(2, 8)), [{ a: 1, b: a }]); } },
      { id: '1b', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { p: r.int(2, 7), q: r.int(1, 11), c: r.int(1, 5), d: r.int(1, 6) }; }, function (o) { return gcd(o.p, o.q) === 1 && o.q % o.p !== 0 && !(o.p === 5 && o.q === 3) && !(o.p === 2 && o.q === 5); });
        return R.P.restrict(t('\\sqrt{' + linT(o.p, -o.q) + '}+' + o.c + '=' + (o.c + o.d)), [{ a: o.p, b: -o.q }]);
      } },
      { id: '1c', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { c: r.int(2, 20), d: r.int(2, 6) }; }, function (o) { return !(o.c === 12 && o.d === 4) && !(o.c === 6 && o.d === 3); });
        return R.P.restrict(t('\\sqrt{' + o.c + '-' + o.d + 'x}=' + r.int(2, 9)), [{ a: -o.d, b: o.c }]);
      } },
      { id: '1d', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(1, 9), b: r.int(1, 9) }; }, function (o) { return !(o.a === 5 && o.b === 2) && !(o.a === 1 && o.b === 5); });
        return R.P.restrict(t('\\sqrt{x+' + o.a + '}-\\sqrt{' + o.b + '-x}=' + r.int(1, 3)), [{ a: 1, b: o.a }, { a: -1, b: o.b }]);
      } },
      { id: '1e', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { p: r.int(2, 5), q: r.int(1, 7), c: r.int(2, 15), s: r.int(2, 4) }; }, function (o) { return o.q / o.p < o.c / o.s && !(o.p === 3 && o.q === 1 && o.c === 10 && o.s === 2) && !(o.p === 5 && o.q === 2); });
        return R.P.restrict(t('\\sqrt{' + linT(o.p, -o.q) + '}=\\sqrt{' + o.c + '-' + o.s + 'x}'), [{ a: o.p, b: -o.q }, { a: -o.s, b: o.c }]);
      } },
      { id: '1f', level: 'PRG', make: function (r) {
        var k = r.int(2, 7), d = r.int(1, 6), c = d + r.int(1, 6);
        return R.P.restrict(t(c + '-\\sqrt{-' + k + 'x}=' + d), [{ a: -k, b: 0 }]);
      } }] },
    { num: '2', section: 'Solving by squaring and verifying', stem: 'Solve and verify.', parts: [
      { id: '2a', level: 'BEG', make: function (r) { var o = pickWhere(function () { return { a: r.int(1, 12), n: r.int(2, 9) }; }, function (o) { return !(o.a === 4 && o.n === 6); }); var e = R.lin1({ a: 1, b: -o.a, d: o.n }); return R.P.lin1(t(e.tex), e, { text: '√(x − a) = n' }); } },
      { id: '2b', level: 'BEG', make: function (r) { var o = rootLin(r, { avoid: [[5, 1, 4], [3, 1, 5]] }); var e = R.lin1({ a: o.p, b: o.q, d: o.n }); return R.P.lin1(t(e.tex), e, { text: '√(px + q) = n' }); } },
      { id: '2c', level: 'BEG', make: function (r) { var o = rootLin(r, { ps: [2, 3, 4, 5], ns: [1, 2, 3], xs: range(2, 9), qneg: true, avoid: [[2, -7, 1]] }); var e = R.lin1({ v: 'y', a: o.p, b: o.q, d: o.n }); return R.P.lin1(t(e.tex), e, { text: '√(py − q) = n, small n' }); } },
      { id: '2d', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { p: r.int(2, 5), x0: -r.int(1, 8), n: r.int(2, 9) }; }, function (o) { o.c = o.n * o.n + o.p * o.x0; return o.c > 0 && !(o.c === 10 && o.p === 3 && o.n === 5); });
        var e = R.lin1({ v: 'a', a: -o.p, b: o.c, d: o.n }); return R.P.lin1(t(e.tex), e, { text: '√(c − pa) = n, a negative root', hints: [H_SOLVE[0], 'A negative root is fine — what matters is that it checks in the original equation.'] });
      } }] },
    { num: '3', stem: 'Isolate the radical, then solve and verify.', parts: [
      { id: '3a', level: 'EMG', make: function (r) { var o = pickWhere(function () { return { a: r.pick(pm(1, 9)), c: r.int(1, 6), d: r.int(1, 7) }; }, function (o) { return !(o.a === 2 && o.c === 3 && o.d === 4); }); var e = R.lin1({ a: 1, b: o.a, c: -o.c, d: o.d }); return R.P.lin1(t(e.tex), e, { text: '√(x + a) − c = d' }); } },
      { id: '3b', level: 'EMG', make: function (r) { var o = pickWhere(function () { return { k: r.int(2, 5), m: r.int(2, 6), a: r.int(1, 9) }; }, function (o) { return !(o.k === 3 && o.m === 4 && o.a === 5) && !(o.k === 2 && o.m === 3 && o.a === 1); }); var e = R.lin1({ a: 1, b: -o.a, k: o.k, d: o.k * o.m }); return R.P.lin1(t(e.tex), e, { text: 'k√(x − a) = m' }); } },
      { id: '3c', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { k: r.int(2, 4), m: r.int(2, 5), p: r.int(2, 4), x0: r.int(1, 8), c: r.int(1, 9) }; }, function (o) { o.q = o.m * o.m - o.p * o.x0; o.d = o.k * o.m - o.c; return o.q !== 0 && Math.abs(o.q) <= 12 && o.d > 0 && !(o.k === 4 && o.p === 2 && o.q === 1 && o.c === 5); });
        var e = R.lin1({ a: o.p, b: o.q, k: o.k, c: -o.c, d: o.d }); return R.P.lin1(t(e.tex), e, { text: 'k√(px + q) − c = d' });
      } },
      { id: '3d', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { m: r.int(2, 6), d: r.int(1, 8), p: r.int(2, 4), x0: r.int(1, 9) }; }, function (o) { o.q = o.m * o.m - o.p * o.x0; o.c = o.d + o.m; return o.q !== 0 && Math.abs(o.q) <= 12 && !(o.c === 10 && o.p === 3 && o.q === 1); });
        var e = R.lin1({ a: o.p, b: o.q, k: -1, c: o.c, d: o.d, layout: 'ck' }); return R.P.lin1(t(e.tex), e, { text: 'c − √(px + q) = d' });
      } },
      { id: '3e', level: 'PRG', make: function (r) { var o = pickWhere(function () { return { a: r.pick(pm(1, 9)), b: r.int(2, 5), n: r.int(2, 4) }; }, function (o) { return !(o.a === -1 && o.b === 2 && o.n === 3) && !(o.a === 4 && o.b === 3 && o.n === 2); }); var e = R.lin1({ a: 1, b: o.a, r: o.b, d: o.n }); return R.P.lin1(t(e.tex), e, { text: '√((x + a)/b) = n' }); } },
      { id: '3f', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { j: r.pick([2, 3]), p: r.int(2, 8), s: r.int(1, 2), c: r.int(1, 5) }; }, function (o) { return (o.p * o.s) % o.j === 0 && !(o.j === 2 && o.p === 6 && o.s === 1 && o.c === 1); });
        var m = o.p * o.s, e = R.lin1({ a: o.p, b: 0, k: [1, o.j], c: o.c, d: o.c + m / o.j }); return R.P.lin1(t(e.tex), e, { text: '(1/j)√(px) + c = d' });
      } }] },
    { num: '4', section: 'Extraneous roots', stem: 'Solve and verify. Some equations have no solution: identify any extraneous root.', parts: [
      { id: '4a', level: 'EMG', make: function (r) { var o = pickWhere(function () { return { a: r.int(1, 9), n: r.int(2, 7) }; }, function (o) { return !(o.a === 2 && o.n === 5); }); var e = R.lin1({ a: 1, b: -o.a, d: -o.n }); return R.P.lin1(t(e.tex), e, { text: '√(x − a) = −n: no solution' }); } },
      { id: '4b', level: 'PRG', make: function (r) { var o = pickWhere(function () { return { p: r.int(2, 5), q: r.int(1, 9), c: r.int(4, 10), d: r.int(1, 9) }; }, function (o) { return o.d < o.c && !(o.p === 4 && o.q === 1 && o.c === 9 && o.d === 6); }); var e = R.lin1({ a: o.p, b: o.q, c: o.c, d: o.d }); return R.P.lin1(t(e.tex), e, { text: '√(px + q) + c = d with d < c: no solution' }); } },
      { id: '4c', level: 'PRG', make: function (r) { var o = pickWhere(function () { return { k: r.int(2, 6), c: r.int(1, 9) }; }, function (o) { return !(o.k === 3 && o.c === 2); }); var e = R.lin1({ a: 1, b: 0, k: o.k, c: o.c, d: o.c, layout: 'ck' }); return R.P.lin1(t(e.tex), e, { text: 'c + k√x = c: the radical equals 0', hints: [H_SOLVE[0], 'A radical may equal ' + t('0') + ': ' + t('\\sqrt{0}=0') + '.'] }); } },
      { id: '4d', level: 'PRG', make: function (r) { var o = pickWhere(function () { return { a: r.pick(pm(1, 9)), n: r.int(2, 6) }; }, function (o) { return !(o.a === 7 && o.n === 2); }); var e = R.lin1({ a: 1, b: o.a, k: -1, d: -o.n }); return R.P.lin1(t(e.tex), e, { text: '−√(x + a) = −n: this one has a root' }); } }] },
    { num: '5', section: 'A radical on each side', stem: 'Solve and verify.', parts: [
      { id: '5a', level: 'EMG', make: function (r) { var o = pickWhere(function () { return { p: r.int(2, 6), x0: r.int(1, 9), s: r.int(1, 12) }; }, function (o) { o.q = (o.p - 1) * o.x0 - o.s; return o.q > 0 && !(o.p === 4 && o.q === 3 && o.s === 9) && !(o.p === 5 && o.q === 2); }); var e = R.two({ a1: o.p, b1: -o.q, a2: 1, b2: o.s }); return R.P.two(t(e.tex), e, { text: '√(px − q) = √(x + s)' }); } },
      { id: '5b', level: 'PRG', make: function (r) { var o = pickWhere(function () { return { x0: -r.int(1, 6), p: r.int(2, 4), c: r.int(2, 12) }; }, function (o) { o.q = o.c - o.x0 - o.p * o.x0; return o.q !== 0 && Math.abs(o.q) <= 20 && !(o.c === 7 && o.p === 3 && o.q === 15); }); var e = R.two({ a1: -1, b1: o.c, a2: o.p, b2: o.q }); return R.P.two(t(e.tex), e, { text: '√(c − x) = √(px + q), a negative root' }); } },
      { id: '5c', level: 'PRG', make: function (r) { var o = pickWhere(function () { return { p: r.int(2, 4), a: r.int(2, 10), x0: r.int(-8, 9) }; }, function (o) { o.q = o.x0 * (1 - o.p) - o.a; return o.x0 < o.a && o.q !== 0 && Math.abs(o.q) <= 15 && !(o.a === 8 && o.p === 3 && o.q === 2); }); var e = R.two({ a1: 1, b1: -o.a, a2: o.p, b2: o.q }); return R.P.two(t(e.tex), e, { text: '√(x − a) = √(px + q): extraneous' }); } },
      { id: '5d', level: 'ADV', make: function (r) { var o = pickWhere(function () { return { k: r.pick([2, 3]), a: r.int(1, 6), x0: r.int(2, 12) }; }, function (o) { o.b = (o.k * o.k - 1) * o.x0 - o.k * o.k * o.a; return o.x0 > o.a && o.b >= 1 && o.b <= 20 && !(o.k === 2 && o.a === 3 && o.b === 6) && !(o.k === 2 && o.a === 1 && o.b === 5); }); var e = R.two({ k1: o.k, a1: 1, b1: -o.a, a2: 1, b2: o.b }); return R.P.two(t(e.tex), e, { text: 'k√(x − a) = √(x + b)' }); } },
      { id: '5e', level: 'ADV', make: function (r) { var o = pickWhere(function () { return { k: r.pick([2, 3]), p: r.int(1, 8), x0: r.int(1, 6) }; }, function (o) { o.q = (o.k * o.k - o.p) * o.x0; return o.p < o.k * o.k && o.q > 0 && !(o.k === 3 && o.p === 5 && o.x0 === 1); }); var e = R.two({ a1: o.p, b1: o.q, k2: o.k, a2: 1, b2: 0, layout: 'minus' }); return R.P.two(t(e.tex), e, { text: '√(px + q) − k√x = 0' }); } }] },
    { num: '6', section: 'Error analysis', stem: 'Each student made an error. Choose the explanation and the correct solution.', parts: [
      { id: '6a', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(1, 9), c: r.int(3, 9), d: r.int(0, 8) }; }, function (o) { return o.d < o.c && !(o.a === 6 && o.c === 4 && o.d === 1); });
        var m = o.d - o.c, xA = m * m - o.a, chk = Math.abs(m) + o.c, eq = '\\sqrt{x+' + o.a + '}+' + o.c + '=' + o.d;
        var work = t(eq) + ' &nbsp;⇒&nbsp; ' + t('\\sqrt{x+' + o.a + '}=' + m) + ' &nbsp;⇒&nbsp; ' + t('x+' + o.a + '=' + (m * m)) + ' &nbsp;⇒&nbsp; ' + t('x=' + xA);
        return mcPart(r, 'Ana: ' + work, [
          { html: 'She did not verify: ' + t('\\sqrt{' + (m * m) + '}+' + o.c + '=' + chk + '\\ne ' + o.d) + ', so ' + t('x=' + xA) + ' is extraneous. A square root can’t equal ' + t(String(m)) + ': <b>no solution</b>.', right: true },
          { html: 'She should have squared each term: ' + t('x+' + o.a + '+' + (o.c * o.c) + '=' + (o.d * o.d)) + ', so ' + t('x=' + (o.d * o.d - o.c * o.c - o.a)) + '.', why: 'Square both <b>sides</b> after isolating, never term by term. Her steps were fine — what did she forget at the end?' },
          { html: t('(' + m + ')^{2}') + ' should be ' + t(String(-m * m)) + ', so ' + t('x=' + (-m * m - o.a)) + '.', why: t('(' + m + ')^{2}=' + (m * m)) + ' — the square of a negative is positive. Check her answer in the original equation.' },
          { html: 'There is no error: ' + t('x=' + xA) + ' is the solution.', why: 'Substitute ' + t('x=' + xA) + ' into the original equation: does the left side equal ' + t(String(o.d)) + '?' }],
          'She did not verify. ' + t('\\sqrt{' + (m * m) + '}+' + o.c + '=' + chk + '\\ne ' + o.d) + ', so ' + t('x=' + xA) + ' is extraneous. After isolating, ' + t('\\sqrt{x+' + o.a + '}=' + m) + ' is already impossible: there is no solution.',
          ['Substitute her answer into the original equation.', 'What value is the square root being set equal to?'], 'error analysis: didn’t verify');
      } },
      { id: '6b', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { k: r.pick([2, 3]), a: r.int(1, 6), x0: r.int(2, 10) }; }, function (o) { o.b = (o.k * o.k - 1) * o.x0 - o.k * o.k * o.a; o.xb = (o.k * o.a + o.b) / (o.k - 1); return o.x0 > o.a && o.b >= 1 && o.b <= 15 && !same(o.xb, o.x0) && !(o.k === 2 && o.a === 1 && o.b === 5); });
        var K2 = o.k * o.k, xb = fracOf(o.xb), eq = o.k + '\\sqrt{x-' + o.a + '}=\\sqrt{x+' + o.b + '}';
        var work = t(eq) + ' &nbsp;⇒&nbsp; ' + t(o.k + '(x-' + o.a + ')=x+' + o.b) + ' &nbsp;⇒&nbsp; ' + t('x=' + rT(xb));
        return mcPart(r, 'Ben: ' + work, [
          { html: 'He did not square the ' + t(String(o.k)) + ': ' + t(K2 + '(x-' + o.a + ')=x+' + o.b) + ', so ' + t('x=' + o.x0) + ' (which checks).', right: true },
          { html: 'He did not square the ' + t(String(o.k)) + ', and the correct equation has <b>no solution</b>.', why: 'Solve ' + t(K2 + '(x-' + o.a + ')=x+' + o.b) + ' and verify the result: it does check.' },
          { html: 'He did not verify: ' + t('x=' + rT(xb)) + ' is extraneous, so there is <b>no solution</b>.', why: 'His value is wrong because of an algebra step, not because it is extraneous. Look at what happens to the ' + t(String(o.k)) + ' when you square.' },
          { html: 'There is no error: ' + t('x=' + rT(xb)) + '.', why: 'Check it: ' + t(o.k + '\\sqrt{' + rT(qadd(xb, -o.a)) + '}') + ' and ' + t('\\sqrt{' + rT(qadd(xb, o.b)) + '}') + ' are not equal.' }],
          'He did not square the ' + t(String(o.k)) + ': ' + t('(' + o.k + '\\sqrt{x-' + o.a + '})^{2}=' + K2 + '(x-' + o.a + ')') + '.<br>' + t(K2 + 'x-' + (K2 * o.a) + '=x+' + o.b) + ' &nbsp;⇒&nbsp; ' + t((K2 - 1) + 'x=' + ((K2 - 1) * o.x0)) + ' &nbsp;⇒&nbsp; ' + t('x=' + o.x0) + '. Verify: ' + t(o.k + '\\sqrt{' + (o.x0 - o.a) + '}=\\sqrt{' + (K2 * (o.x0 - o.a)) + '}') + ' ✓',
          ['Square the whole left side: ' + t('(' + o.k + '\\sqrt{A})^{2}=' + o.k + '^{2}\\cdot A') + '.', 'Then solve and check in the original equation.'], 'error analysis: coefficient not squared');
      } }] },
    { num: '7', stem: 'Without solving, explain why the equation has no solution.', parts: [
      { id: '7a', level: 'EMG', make: function (r) {
        var p = r.int(2, 7), q = r.int(1, 9), c = r.int(1, 9);
        return mcPart(r, t('\\sqrt{' + linT(p, q) + '}=-' + c), [
          { html: 'A principal square root is never negative, so it can’t equal ' + t(String(-c)) + '.', right: true },
          { html: 'The radicand ' + t(linT(p, q)) + ' is always negative.', why: 'The radicand can be positive (try ' + t('x=1') + '). The problem is the right side.' },
          { html: 'Squaring ' + t(String(-c)) + ' gives a negative number.', why: t('(-' + c + ')^{2}=' + (c * c)) + ' is positive. Think about what ' + t('\\sqrt{\\ }') + ' means.' },
          { html: 'The root would have to be a fraction.', why: 'Fractions are fine as roots. Look at the sign of the right side.' }],
          'The symbol ' + t('\\sqrt{\\ }') + ' means the principal (non-negative) square root, so ' + t('\\sqrt{' + linT(p, q) + '}\\ge 0') + ' and it can never equal ' + t(String(-c)) + '.', ['What sign can a square root have?'], 'why no solution: radical equals a negative');
      } },
      { id: '7b', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(3, 9), b: r.int(-3, 6), c: r.int(1, 6) }; }, function (o) { return o.a > o.b && !(o.a === 4 && o.b === 1); });
        var eq = '\\sqrt{x-' + o.a + '}+\\sqrt{' + (o.b < 0 ? '-' + (-o.b) + '-x' : o.b === 0 ? '-x' : o.b + '-x') + '}=' + o.c;
        return mcPart(r, t(eq), [
          { html: 'The restrictions are ' + t('x\\ge ' + o.a) + ' and ' + t('x\\le ' + o.b) + ': no number satisfies both, so the left side is never defined.', right: true },
          { html: 'A sum of two square roots can never equal ' + t(String(o.c)) + '.', why: 'Sums of square roots can equal ' + t(String(o.c)) + ' (e.g. ' + t('\\sqrt{0}+\\sqrt{' + (o.c * o.c) + '}') + '). Look at the restrictions.' },
          { html: 'You can’t square an equation with two radicals.', why: 'You can (more than once, in later courses). The reason here is the restrictions on ' + t('x') + '.' },
          { html: 'The right side would have to be negative.', why: 'The right side is ' + t(String(o.c)) + ', which is positive. Find where each radical is defined.' }],
          'Restrictions: ' + t('x-' + o.a + '\\ge 0') + ' gives ' + t('x\\ge ' + o.a) + ', and ' + t((o.b === 0 ? '' : o.b) + '-x\\ge 0') + ' gives ' + t('x\\le ' + o.b) + '. No number is both ' + t('\\ge ' + o.a) + ' and ' + t('\\le ' + o.b) + ', so the left side is never defined.', ['State the restriction for each radical.'], 'why no solution: restrictions don’t overlap');
      } }] },
    { num: '8', section: 'Checking with a graph', stem: function (s) { return 'Consider ' + t('\\sqrt{x}=\\sqrt{' + s.c + '-' + (s.k === 1 ? '' : s.k) + 'x}') + '.'; },
      shared: function (r) { return pickWhere(function () { return { k: r.pick([1, 3, 4, 7, 9]), c: r.int(5, 40) }; }, function (o) { return o.c % (o.k + 1) !== 0 && !(o.k === 3 && o.c === 17) && (o.k === 1 || o.c % o.k !== 0) && (o.c / (o.k + 1)) * 100 % 1 === 0; }); }, parts: [
      { id: '8a', level: 'PRG', make: function (r, s) { return R.P.restrict('State the restriction on ' + t('x') + '.', [{ a: 1, b: 0 }, { a: -s.k, b: s.c }]); } },
      { id: '8b', level: 'PRG', make: function (r, s) {
        var x0 = s.c / (s.k + 1), x0t = String(x0), y2 = 'Y_2=\\sqrt{' + s.c + '-' + (s.k === 1 ? '' : s.k) + 'X}';
        return mcPart(r, 'How do you solve the equation with the intersect feature of a graphing calculator, and what is the root?', [
          { html: t('Y_1=\\sqrt{X}') + ', ' + t(y2) + ', GRAPH, then 2nd [TRACE] 5: intersect. The root is the ' + t('x') + '-coordinate of the intersection, ' + t('x=' + x0t) + '.', right: true },
          { html: t('Y_1=\\sqrt{X}') + ', ' + t(y2) + ', GRAPH, then 2nd [TRACE] 5: intersect. The root is the ' + t('y') + '-coordinate, ' + t('\\sqrt{' + x0t + '}') + '.', code: 'u4l6-ycoord', why: 'The root is a value of ' + t('x') + ': read the <b>' + t('x') + '-coordinate</b> of the point of intersection.' },
          { html: t('Y_1=\\sqrt{X}') + ', ' + t(y2) + ', GRAPH. The root is where ' + t('Y_2') + ' ends, ' + t('x=' + rT(Q(s.c, s.k))) + '.', code: 'u4l6-endpoint', why: 'That’s the end of the graph of ' + t('Y_2') + ' (where its radicand is ' + t('0') + '). The root is where the two graphs <b>meet</b>.' },
          { html: t('Y_1=\\sqrt{X}') + ', ' + t(y2) + ', GRAPH, then 2nd [TRACE] 3: minimum. The root is ' + t('x=0') + '.', why: 'A minimum finds the lowest point of one graph. To solve ' + t('Y_1=Y_2') + ', use <b>intersect</b>.' }],
          'Enter each side as a function: ' + t('Y_1=\\sqrt{X}') + ', ' + t(y2) + '. GRAPH, then 2nd [TRACE], 5: intersect. The graphs meet at ' + t('x=' + x0t) + '.', ['Each side of the equation is graphed as its own function.', 'A root is an ' + t('x') + '-value.'], 'graphing calculator: intersect');
      } },
      { id: '8c', level: 'PRG', make: function (r, s) {
        var x0 = Q(s.c, s.k + 1), key = rT(x0), dec = String(s.c / (s.k + 1));
        var p = B.math('Solve the equation algebraically to verify the root. (A fraction or a decimal is fine.)', K.value(qv(x0), { diag: function (v) { return same(v, s.c / s.k) ? { code: 'u4l6-endpoint', hint: 'That makes ' + t(s.c + '-' + (s.k === 1 ? '' : s.k) + 'x=0') + '. Square both sides: ' + t('x=' + s.c + '-' + (s.k === 1 ? '' : s.k) + 'x') + ', then collect the ' + t('x') + '-terms.' } : same(v, s.c / Math.abs(s.k - 1)) && s.k !== 1 ? { code: 'sign', hint: 'Collect the ' + t('x') + '-terms carefully: add ' + t((s.k === 1 ? '' : s.k) + 'x') + ' to both sides.' } : null; } }), key,
          t('x=' + s.c + '-' + (s.k === 1 ? '' : s.k) + 'x') + ' &nbsp;⇒&nbsp; ' + t((s.k + 1) + 'x=' + s.c) + ' &nbsp;⇒&nbsp; ' + t('x=' + key + '=' + dec) + '.<br>Left side ' + t('\\sqrt{' + dec + '}') + '; right side ' + t('\\sqrt{' + s.c + '-' + (s.k === 1 ? '' : s.k + '(') + dec + (s.k === 1 ? '' : ')') + '}=\\sqrt{' + dec + '}') + ' ✓',
          ['Square both sides: ' + t('x=' + s.c + '-' + (s.k === 1 ? '' : s.k) + 'x') + '.', 'Collect the ' + t('x') + '-terms and divide.'], 'verify the root algebraically', { keys: 'fraction', before: t('x=') });
        p.good = [dec]; return p;
      } }] },
    { num: '9', section: 'Problems modelled by a radical equation', parts: [
      { id: '9', level: 'PRG', make: function (r) {
        var k = npick(r, 4, 30, [20]), s = 7 * k, d = 5 * k * k;
        return B.number('The speed of a tsunami wave in the open ocean is approximately ' + t('s=\\sqrt{9.8d}') + ', where ' + t('s') + ' is in metres per second and ' + t('d') + ' is the depth of the water in metres. At what depth does a tsunami travel at ' + t(s + '\\text{ m/s}') + '?', d,
          function (v) { return same(v, s / 9.8) ? { code: 'u4rad-no-square', hint: 'Square both sides first: ' + t(s + '^{2}=9.8d') + '.' } : same(v, s * s * 9.8) ? { code: 'value', hint: 'After squaring, ' + t(HW.fmt(s * s) + '=9.8d') + ': <b>divide</b> by ' + t('9.8') + '.' } : null; },
          t(s + '=\\sqrt{9.8d}') + ' &nbsp;⇒&nbsp; ' + t(HW.fmt(s * s).replace(/\s/g, '\\,') + '=9.8d') + ' &nbsp;⇒&nbsp; ' + t('d=' + d) + '. The water is ' + t(String(d)) + ' m deep.',
          ['Substitute the speed, then square both sides.', 'Divide by ' + t('9.8') + ' (multiply top and bottom by 10 if that helps: ' + t('\\frac{' + (s * s * 10) + '}{98}') + ').'], 'tsunami depth from its speed', { after: 'm' });
      } }] },
    { num: '10', stem: 'Use the pendulum formula ' + t('T=2\\pi\\sqrt{\\dfrac{L}{9.8}}') + ' (' + t('T') + ' in seconds, ' + t('L') + ' in metres).', parts: [
      { id: '10a', level: 'ADV', make: function (r) {
        var T = pickWhere(function () { return r.int(10, 30) / 10; }, function (T) { return T !== 2 && T !== 2.5; }), Lm = pend(T), cm = Lm * 100;
        var p = B.approx(CALC + 'A clock pendulum has a period of ' + t(T + '\\text{ s}') + '. Determine its length to the nearest centimetre.', cm, 0, { after: 'cm', diag: function (v) {
          if (Math.abs(v - Lm) < 0.006) return { code: 'u4rad-units', hint: 'That’s the length in <b>metres</b>. The question asks for centimetres (' + t('\\times 100') + ').' };
          if (Math.abs(v - 100 * 9.8 * T / (2 * Math.PI)) < 1 || Math.abs(v - 9.8 * T / (2 * Math.PI)) < 0.01) return { code: 'u4rad-no-root', hint: 'Isolate the radical, then <b>square</b> both sides: ' + t('\\frac{L}{9.8}=\\left(\\frac{T}{2\\pi}\\right)^{2}') + '.' };
          return null; } },
          t('\\sqrt{\\frac{L}{9.8}}=\\frac{' + T + '}{2\\pi}') + ' &nbsp;⇒&nbsp; ' + t('\\frac{L}{9.8}=\\left(\\frac{' + T + '}{2\\pi}\\right)^{2}') + ' &nbsp;⇒&nbsp; ' + t('L=9.8\\left(\\frac{' + T + '}{2\\pi}\\right)^{2}\\approx ' + Lm.toFixed(4)) + ' m ' + t('\\approx ' + Math.round(cm)) + ' cm',
          ['Divide both sides by ' + t('2\\pi') + ', then square both sides.', 'Multiply by ' + t('9.8') + ' to get ' + t('L') + ' in metres, then change to centimetres.'], 'pendulum length from its period');
        return p;
      } },
      { id: '10b', level: 'PRG', make: function (r) {
        var cm = pickWhere(function () { return r.int(15, 140); }, function (c) { return c !== 40 && c !== 150; }), T = 2 * Math.PI * Math.sqrt(cm / 100 / 9.8);
        return B.approx(CALC + 'Determine the period of a ' + t(cm + '\\text{ cm}') + ' pendulum, to the nearest hundredth of a second.', T, 2, { after: 's', diag: function (v) { return Math.abs(v - 2 * Math.PI * Math.sqrt(cm / 9.8)) < 0.006 ? { code: 'u4rad-units', hint: 'The formula needs ' + t('L') + ' in <b>metres</b>: ' + t(cm + '\\text{ cm}=' + (cm / 100) + '\\text{ m}') + '.' } : null; } },
          t('T=2\\pi\\sqrt{\\frac{' + (cm / 100) + '}{9.8}}\\approx ' + T.toFixed(2)) + ' s (use ' + t('L=' + (cm / 100)) + ' m, not ' + t(String(cm)) + ')',
          ['Change the length to metres first.', 'Substitute and evaluate; round only at the end.'], 'pendulum period from its length');
      } }] },
    { num: '11', parts: [
      { id: '11', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { p: r.int(2, 5), x0: r.int(2, 10), n: r.int(2, 9) }; }, function (o) { o.k = o.n * o.n - o.p * o.x0; return o.k !== 0 && Math.abs(o.k) <= 30 && !(o.p === 2 && o.x0 === 8 && o.n === 5); });
        return B.number('The equation ' + t('\\sqrt{' + o.p + 'x+k}=' + o.n) + ' has the root ' + t('x=' + o.x0) + '. Determine ' + t('k') + '.', o.k,
          function (v) { return same(v, o.n - o.p * o.x0) ? { code: 'u4rad-no-square', hint: 'Square both sides: the radicand equals ' + t(o.n + '^{2}=' + (o.n * o.n)) + '.' } : same(v, o.n * o.n + o.p * o.x0) ? { code: 'sign', hint: 'Solve ' + t((o.p * o.x0) + '+k=' + (o.n * o.n)) + ' for ' + t('k') + ': subtract.' } : null; },
          'Substitute ' + t('x=' + o.x0) + ': ' + t('\\sqrt{' + (o.p * o.x0) + '+k}=' + o.n) + ' &nbsp;⇒&nbsp; ' + t((o.p * o.x0) + '+k=' + (o.n * o.n)) + ' &nbsp;⇒&nbsp; ' + t('k=' + o.k) + '.',
          ['A root makes the equation true: substitute ' + t('x=' + o.x0) + '.', 'Square both sides and solve for ' + t('k') + '.'], 'unknown constant from a root', { before: t('k=') });
      } }] },
    { num: '12', section: 'Multiple choice and numerical response', parts: [
      { id: '12', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { d: r.int(2, 6), m: r.int(2, 8) }; }, function (o) { return !(o.d === 2 && o.m === 4); }), c = o.d * o.m;
        return mcPart(r, 'The restriction on the variable in ' + t('\\sqrt{' + c + '-' + o.d + 'x}') + ' is', [
          { html: t('x\\ge ' + o.m), why: 'Dividing by ' + t('-' + o.d) + ' reverses the inequality sign.' }, { html: t('x\\le ' + o.m), right: true },
          { html: t('x\\ge -' + o.m), why: t(c + '-' + o.d + 'x\\ge 0') + ' gives ' + t('-' + o.d + 'x\\ge -' + c) + ': check the sign of the bound and reverse the inequality.' }, { html: t('x\\le -' + o.m), why: 'Check the sign of the bound: ' + t('-' + o.d + 'x\\ge -' + c) + ', so ' + t('x\\le ' + o.m) + '.' }],
          t(c + '-' + o.d + 'x\\ge 0') + ' &nbsp;⇒&nbsp; ' + t('-' + o.d + 'x\\ge -' + c) + ' &nbsp;⇒&nbsp; ' + t('x\\le ' + o.m) + '. (The sign reverses.)', ['Solve “radicand ' + t('\\ge 0') + '”.'], 'MC: restriction');
      } }] },
    { num: '13', parts: [
      { id: '13', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(1, 9), c: r.int(3, 9), d: r.int(0, 8) }; }, function (o) { var m = o.d - o.c; return m < 0 && !(o.a === 5 && o.c === 6 && o.d === 2) && m * m - o.a !== m - o.a && m * m - o.a !== -m - o.a && -m - o.a !== m - o.a; });
        var m = o.d - o.c;
        return mcPart(r, 'The solution of ' + t('\\sqrt{x+' + o.a + '}+' + o.c + '=' + o.d) + ' is', [
          { html: t('x=' + (m * m - o.a)), code: 'u4rad-kept-extraneous', why: 'Verify it: ' + t('\\sqrt{' + (m * m) + '}+' + o.c + '=' + (-m + o.c) + '\\ne ' + o.d) + '. It is extraneous.' },
          { html: t('x=' + (m - o.a)), why: 'Square both sides: ' + t('(' + m + ')^{2}=' + (m * m)) + '. (And then verify.)' },
          { html: t('x=' + (-m - o.a)), why: 'The radical equals ' + t(String(m)) + ', a negative number — that’s the key.' },
          { html: 'no solution', right: true }],
          t('\\sqrt{x+' + o.a + '}=' + m) + ' is impossible. Squaring gives ' + t('x=' + (m * m - o.a)) + ', but ' + t('\\sqrt{' + (m * m) + '}+' + o.c + '=' + (-m + o.c) + '\\ne ' + o.d) + ', so it is extraneous: no solution.', ['Isolate the radical first.'], 'MC: extraneous root');
      } }] },
    { num: '14', parts: [
      { id: '14', level: 'MAS', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(1, 9), n: r.int(2, 6), p: r.int(2, 4), q: r.int(1, 8), s: r.int(4, 12), u: r.int(-4, 3), b: r.int(1, 9), c: r.int(1, 6), d2: r.int(1, 6) }; }, function (o) { return (o.s + o.u) % 2 === 0 && o.u < o.s && o.q % (o.p - 1) === 0 && !(o.s === 5 && o.u === 1); });
        var xc = (o.s + o.u) / 2, xb = o.q / (o.p - 1), uT = o.u < 0 ? '-' + (-o.u) + '-x' : o.u === 0 ? '-x' : o.u + '-x';
        return mcPart(r, 'When solved by squaring, which equation produces an extraneous root?', [
          { html: t('\\sqrt{x-' + o.a + '}=' + o.n), why: 'It gives ' + t('x=' + (o.n * o.n + o.a)) + ', which checks.' },
          { html: t('\\sqrt{' + o.p + 'x}=\\sqrt{x+' + o.q + '}'), why: 'It gives ' + t('x=' + xb) + ', which checks (both radicands are positive).' },
          { html: t('\\sqrt{x-' + o.s + '}=\\sqrt{' + uT + '}'), right: true },
          { html: t('\\sqrt{x+' + o.b + '}+' + o.c + '=' + (o.c + o.d2)), why: 'It gives ' + t('x=' + (o.d2 * o.d2 - o.b)) + ', which checks.' }],
          t('x-' + o.s + '=' + (o.u === 0 ? '' : o.u) + '-x') + ' gives ' + t('x=' + xc) + ', but ' + t('\\sqrt{' + xc + '-' + o.s + '}=\\sqrt{' + (xc - o.s) + '}') + ' is not real: extraneous. (The others give ' + t('x=' + (o.n * o.n + o.a)) + ', ' + t('x=' + xb) + ' and ' + t('x=' + (o.d2 * o.d2 - o.b)) + '; all check.)',
          ['Solve each one quickly and check the answer in the original radicands.', 'Watch for an answer that makes a radicand negative.'], 'MC: which has an extraneous root');
      } }] },
    { num: '15', parts: [
      { id: '15', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { k: r.int(2, 4), m: r.int(2, 6), p: r.pick([2, 4, 5]), q: r.int(1, 9), c: r.int(1, 6) }; }, function (o) { var x = (o.m * o.m + o.q) / o.p; return x % 1 !== 0 && String(x).length <= 4 && !(o.k === 3 && o.m === 4 && o.p === 2 && o.q === 5); });
        var x = (o.m * o.m + o.q) / o.p, d = o.k * o.m + o.c, e = R.lin1({ a: o.p, b: -o.q, k: o.k, c: o.c, d: d });
        return B.nr('The root of ' + t(e.tex) + ' is ' + t('x=') + ' ________.', x, function (v) { var c = e.cands.filter(function (cd) { return same(qv(cd.val), v); })[0]; return c ? { code: c.code, hint: c.hint } : null; }, e.lines, H_SOLVE, 'NR: root of a radical equation');
      } }] },
    { num: '16', parts: [
      { id: '16', level: 'PRG', make: function (r) {
        var k = r.pick([1, 2, 4, 5, 6, 8]), v = 7 * k, h = 2.5 * k * k;
        return B.nr('An object dropped from a height of ' + t('h') + ' metres hits the ground at a speed of ' + t('v=\\sqrt{19.6h}') + ' m/s. To hit the ground at ' + t(v + '\\text{ m/s}') + ', it must be dropped from a height of ________ m.', h,
          function (x) { return same(x, v / 19.6) ? { code: 'u4rad-no-square', hint: 'Square both sides first: ' + t(v + '^{2}=19.6h') + '.' } : null; },
          t(v + '=\\sqrt{19.6h}') + ' &nbsp;⇒&nbsp; ' + t((v * v) + '=19.6h') + ' &nbsp;⇒&nbsp; ' + t('h=' + h) + ' m', ['Substitute, then square both sides.', 'Divide by ' + t('19.6') + '.'], 'NR: drop height from speed');
      } }] }
  ];

  /* ============================== the extra practice ============================== */
  var EXTRA = [
    { num: 'A1', section: 'A. Skills', stem: 'State the restriction on the variable.', parts: [
      { id: 'A1a', level: 'BEG', make: function (r) { var a = npick(r, 1, 20, [11]); return R.P.restrict(t('\\sqrt{x-' + a + '}'), [{ a: 1, b: -a }]); } },
      { id: 'A1b', level: 'EMG', make: function (r) { var o = pickWhere(function () { return { c: r.int(1, 15), d: r.int(2, 7) }; }, function (o) { return gcd(o.c, o.d) === 1 && !(o.c === 9 && o.d === 4); }); return R.P.restrict(t('\\sqrt{' + o.c + '-' + o.d + 'x}'), [{ a: -o.d, b: o.c }]); } },
      { id: 'A1c', level: 'PRG', make: function (r) { var o = pickWhere(function () { return { p: r.int(2, 5), q: r.int(1, 9) }; }, function (o) { return !(o.p === 2 && o.q === 7); }); return R.P.restrict(t('\\sqrt{' + linT(o.p, o.q) + '}+\\sqrt{x}'), [{ a: o.p, b: o.q }, { a: 1, b: 0 }]); } },
      { id: 'A1d', level: 'PRG', make: function (r) { var o = pickWhere(function () { return { a: r.int(1, 6), b: r.int(2, 15), c: r.int(2, 4) }; }, function (o) { return -o.a < o.b / o.c && !(o.a === 1 && o.b === 6 && o.c === 3); }); return R.P.restrict(t('\\sqrt{x+' + o.a + '}=\\sqrt{' + o.b + '-' + o.c + 'x}'), [{ a: 1, b: o.a }, { a: -o.c, b: o.b }]); } }] },
    { num: 'A2', stem: 'Solve and verify. State “no solution” where it applies.', parts: [
      { id: 'A2a', level: 'BEG', make: function (r) { var o = pickWhere(function () { return { a: r.pick(pm(1, 12)), n: r.int(2, 9) }; }, function (o) { return !(o.a === 8 && o.n === 5); }); var e = R.lin1({ a: 1, b: o.a, d: o.n }); return R.P.lin1(t(e.tex), e, { text: '√(x + a) = n' }); } },
      { id: 'A2b', level: 'EMG', make: function (r) { var o = rootLin(r, { ps: [2, 3, 4, 5, 6, 7], qneg: true, ns: range(2, 6), avoid: [[6, -2, 4]] }), c = r.int(1, 6); var e = R.lin1({ a: o.p, b: o.q, c: -c, d: o.n - c }); return R.P.lin1(t(e.tex), e, { text: '√(px − q) − c = d' }); } },
      { id: 'A2c', level: 'EMG', make: function (r) { var o = pickWhere(function () { return { k: r.int(2, 6), m: r.int(2, 5), a: r.int(1, 9) }; }, function (o) { return !(o.k === 5 && o.m === 3 && o.a === 1); }); var e = R.lin1({ a: 1, b: -o.a, k: o.k, d: o.k * o.m }); return R.P.lin1(t(e.tex), e, { text: 'k√(x − a) = m' }); } },
      { id: 'A2d', level: 'PRG', make: function (r) { var o = pickWhere(function () { return { k: r.int(2, 4), m: r.int(2, 6), a: r.pick(pm(1, 9)) }; }, function (o) { return !(o.k === 2 && o.m === 4 && o.a === 3); }); var e = R.lin1({ a: 1, b: o.a, k: -o.k, c: o.k * o.m, d: 0, layout: 'ck' }); return R.P.lin1(t(e.tex), e, { text: 'c − k√(x + a) = 0' }); } },
      { id: 'A2e', level: 'PRG', make: function (r) { var o = pickWhere(function () { return { p: r.int(2, 6), q: r.int(1, 9), c: r.int(3, 10), d: r.int(0, 9) }; }, function (o) { return o.d < o.c && !(o.p === 4 && o.q === 5 && o.c === 7 && o.d === 3); }); var e = R.lin1({ a: o.p, b: o.q, c: o.c, d: o.d }); return R.P.lin1(t(e.tex), e, { text: '√(px + q) + c = d: no solution' }); } },
      { id: 'A2f', level: 'PRG', make: function (r) { var o = pickWhere(function () { return { p: r.int(2, 4), q: r.pick(pm(1, 9)), rr: r.pick([2, 3, 5]), n: r.int(2, 4) }; }, function (o) { return (o.rr * o.n * o.n - o.q) % o.p === 0 && !(o.p === 2 && o.q === 1 && o.rr === 5 && o.n === 3); }); var e = R.lin1({ a: o.p, b: o.q, r: o.rr, d: o.n }); return R.P.lin1(t(e.tex), e, { text: '√((px + q)/r) = n' }); } }] },
    { num: 'A3', stem: 'Solve and verify.', parts: [
      { id: 'A3a', level: 'EMG', make: function (r) { var o = pickWhere(function () { return { p: r.int(3, 7), s: r.int(1, 2), x0: r.int(1, 8), u: r.int(1, 12) }; }, function (o) { o.q = (o.p - o.s) * o.x0 - o.u; return o.p > o.s && o.q > 0 && !(o.p === 6 && o.q === 5 && o.s === 2 && o.u === 11); }); var e = R.two({ a1: o.p, b1: -o.q, a2: o.s, b2: o.u }); return R.P.two(t(e.tex), e, { text: '√(px − q) = √(sx + u)' }); } },
      { id: 'A3b', level: 'PRG', make: function (r) { var o = pickWhere(function () { return { p: r.int(2, 4), c: r.int(1, 12), u: r.int(2, 12) }; }, function (o) { var x = (o.c + o.u) / (o.p + 1); return x % 1 === 0 && o.c - o.p * x < 0 && !(o.p === 2 && o.c === 1 && o.u === 8); }); var e = R.two({ a1: -o.p, b1: o.c, a2: 1, b2: -o.u }); return R.P.two(t(e.tex), e, { text: '√(c − px) = √(x − u): extraneous' }); } },
      { id: 'A3c', level: 'ADV', make: function (r) { var o = pickWhere(function () { return { k: r.pick([2, 3]), x0: r.int(1, 6) }; }, function (o) { o.m = (o.k * o.k - 1) * o.x0; return o.m <= 40 && !(o.k === 3 && o.x0 === 2); }); var e = R.two({ k1: o.k, a1: 1, b1: 0, a2: 1, b2: o.m }); return R.P.two(t(e.tex), e, { text: 'k√x = √(x + m)' }); } }] },
    { num: 'B1', section: 'B. Applying', parts: [
      { id: 'B1', level: 'PRG', make: function (r) {
        var tt = npick(r, 2, 7, [3]), d = Math.round(4.9 * tt * tt * 10) / 10;
        return B.number('The time for an object to fall ' + t('d') + ' metres is ' + t('t=\\sqrt{\\dfrac{d}{4.9}}') + ' seconds. How far does an object fall in ' + t(tt + '\\text{ s}') + '?', d,
          function (v) { return same(v, 4.9 * tt) ? { code: 'u4rad-no-square', hint: 'Square both sides: ' + t(tt + '^{2}=\\frac{d}{4.9}') + '.' } : same(v, tt * tt / 4.9) ? { code: 'value', hint: t((tt * tt) + '=\\frac{d}{4.9}') + ': <b>multiply</b> both sides by ' + t('4.9') + '.' } : null; },
          t(tt + '=\\sqrt{\\frac{d}{4.9}}') + ' &nbsp;⇒&nbsp; ' + t((tt * tt) + '=\\frac{d}{4.9}') + ' &nbsp;⇒&nbsp; ' + t('d=' + d) + ' m', ['Substitute ' + t('t=' + tt) + ' and square both sides.', 'Multiply by ' + t('4.9') + '.'], 'falling distance from the time', { after: 'm' });
      } }] },
    { num: 'B2', parts: [
      { id: 'B2', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { p: r.int(2, 6), m: r.int(3, 9), x0: r.int(1, 12) }; }, function (o) { o.q = o.m * o.m - o.p * o.x0; return o.q !== 0 && Math.abs(o.q) <= 20 && !(o.p === 3 && o.q === 4 && o.m === 5); });
        var e = R.lin1({ a: o.p, b: o.q, k: 4, d: 4 * o.m });
        return B.number('A square has side length ' + t(e.rad) + ' cm and perimeter ' + t(String(4 * o.m)) + ' cm. Determine ' + t('x') + '.', o.x0,
          function (v) { var c = e.cands.filter(function (cd) { return same(qv(cd.val), v); })[0]; return c ? { code: c.code, hint: c.hint } : same(v, (16 * o.m * o.m - o.q) / o.p) ? { code: 'u4rad-coef', hint: 'A square has 4 equal sides: ' + t('4' + e.rad + '=' + (4 * o.m)) + '. Divide by 4 first.' } : null; },
          t('4' + e.rad + '=' + (4 * o.m)) + ' &nbsp;⇒&nbsp; ' + t(e.rad + '=' + o.m) + ' &nbsp;⇒&nbsp; ' + t(linT(o.p, o.q) + '=' + (o.m * o.m)) + ' &nbsp;⇒&nbsp; ' + t('x=' + o.x0) + '.', ['Perimeter of a square: ' + t('4s') + '.', 'Divide by ' + t('4') + ', then square both sides.'], 'square side as a radical');
      } }] },
    { num: 'B3', parts: [
      { id: 'B3', level: 'PRG', make: function (r) {
        var T = pickWhere(function () { return r.int(8, 30) / 10; }, function (T) { return T !== 1.5 && T !== 2 && T !== 2.5; }), Lm = pend(T);
        return B.approx(CALC + 'Using ' + t('T=2\\pi\\sqrt{\\dfrac{L}{9.8}}') + ', determine the length of a pendulum with a period of ' + t(T + '\\text{ s}') + ', to the nearest hundredth of a metre.', Lm, 2, { after: 'm', diag: function (v) { return Math.abs(v - 9.8 * T / (2 * Math.PI)) < 0.006 ? { code: 'u4rad-no-root', hint: 'Square both sides after isolating the radical: ' + t('\\frac{L}{9.8}=\\left(\\frac{T}{2\\pi}\\right)^{2}') + '.' } : null; } },
          t('\\sqrt{\\frac{L}{9.8}}=\\frac{' + T + '}{2\\pi}') + ' &nbsp;⇒&nbsp; ' + t('L=9.8\\left(\\frac{' + T + '}{2\\pi}\\right)^{2}\\approx ' + Lm.toFixed(2)) + ' m', ['Divide by ' + t('2\\pi') + ', square both sides, multiply by ' + t('9.8') + '.'], 'pendulum length (to the hundredth)');
      } }] },
    { num: 'B4', parts: [
      { id: 'B4', level: 'EMG', make: function (r) {
        var p = r.int(2, 6), q = r.int(1, 9), s = r.int(1, 9), c = r.int(1, 9);
        return mcPart(r, 'Why does ' + t('\\sqrt{' + linT(p, -q) + '}+\\sqrt{x+' + s + '}=-' + c) + ' have no solution?', [
          { html: 'Each square root is ' + t('0') + ' or positive, so their sum can never be negative.', right: true },
          { html: 'The two radicands can’t both be positive.', why: 'They can (try a large ' + t('x') + '). Look at the sign of the right side.' },
          { html: 'You can’t square both sides when there are two radicals.', why: 'That isn’t the reason. What is the smallest value the left side can have?' },
          { html: 'The equation has no ' + t('x^{2}') + ' term.', why: 'Linear radicands are fine. Think about the sign of each square root.' }],
          'Each principal square root is ' + t('\\ge 0') + ', so the left side is ' + t('\\ge 0') + ' and can never equal ' + t('-' + c) + '.', ['What sign does each square root have?'], 'why no solution: sum of roots negative');
      } }] },
    { num: 'B5', parts: [
      { id: 'B5', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { p: r.int(2, 5), x0: r.int(2, 9), s: r.int(1, 9) }; }, function (o) { o.q = (o.p - 1) * o.x0 - o.s; return o.q > 0 && !(o.p === 2 && o.q === 3 && o.s === 1) && (o.q - o.s) / (o.p + 1) !== o.x0 && (o.q - o.s) !== 0; });
        var wr = fracOf((o.s - o.q) / (o.p - 1) === -o.x0 ? (o.q + 2 * o.s) / (o.p + 1) : (o.s - o.q) / (o.p - 1));
        if (same(qv(wr), o.x0) || same(qv(wr), -o.x0)) wr = Q(o.q + o.s, o.p + 1);
        return mcPart(r, 'The solution of ' + t('\\sqrt{' + linT(o.p, -o.q) + '}=\\sqrt{x+' + o.s + '}') + ' is', [
          { html: t('x=' + o.x0), right: true }, { html: t('x=' + (-o.x0)), why: 'Collect the ' + t('x') + '-terms on one side and the numbers on the other carefully: ' + t((o.p - 1) + 'x=' + (o.q + o.s)) + '.' },
          { html: t('x=' + rT(wr)), why: 'Check your collecting: ' + t(linT(o.p, -o.q) + '=x+' + o.s) + ' gives ' + t((o.p - 1) + 'x=' + (o.q + o.s)) + '.' }, { html: 'no solution', why: 'Verify ' + t('x=' + o.x0) + ': both radicands are ' + t(String(o.x0 + o.s)) + ', so it checks.' }],
          t(linT(o.p, -o.q) + '=x+' + o.s) + ' &nbsp;⇒&nbsp; ' + t('x=' + o.x0) + '; ' + t('\\sqrt{' + (o.x0 + o.s) + '}=\\sqrt{' + (o.x0 + o.s) + '}') + ' ✓', ['Square both sides and solve; then verify.'], 'MC: radical on each side');
      } }] },
    { num: 'B6', parts: [
      { id: 'B6', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { k: r.int(2, 3), m: r.int(2, 6), p: r.pick([2, 4, 5]), q: r.int(1, 9), c: r.int(1, 6) }; }, function (o) { var x = (o.m * o.m + o.q) / o.p; return x % 1 !== 0 && String(x).length <= 4 && !(o.k === 2 && o.m === 4 && o.p === 5 && o.q === 1); });
        var x = (o.m * o.m + o.q) / o.p, e = R.lin1({ a: o.p, b: -o.q, k: o.k, c: -o.c, d: o.k * o.m - o.c });
        return B.nr('The root of ' + t(e.tex) + ' is ' + t('x=') + ' ________.', x, function (v) { var c = e.cands.filter(function (cd) { return same(qv(cd.val), v); })[0]; return c ? { code: c.code, hint: c.hint } : null; }, e.lines, H_SOLVE, 'NR: root of a radical equation');
      } }] },
    { num: 'C1', section: 'C. Stretch', parts: [
      { id: 'C1', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(2, 7), x0: r.int(2, 9), b: r.int(1, 12) }; }, function (o) { o.n2 = o.a * o.x0 - o.b; var n = Math.round(Math.sqrt(o.n2)); o.n = n; return o.n2 > 0 && n * n === o.n2 && !(o.a === 3 && o.x0 === 6 && o.b === 2); });
        return B.number('The equation ' + t('\\sqrt{ax-' + o.b + '}=' + o.n) + ' has the root ' + t('x=' + o.x0) + '. Determine ' + t('a') + '.', o.a,
          function (v) { return same(v, (o.n + o.b) / o.x0) ? { code: 'u4rad-no-square', hint: 'Square both sides: ' + t(o.x0 + 'a-' + o.b + '=' + o.n + '^{2}') + '.' } : same(v, (o.n * o.n - o.b) / o.x0) ? { code: 'sign', hint: 'Add ' + t(String(o.b)) + ' to both sides (don’t subtract).' } : null; },
          'Substitute ' + t('x=' + o.x0) + ' and square: ' + t(o.x0 + 'a-' + o.b + '=' + (o.n * o.n)) + ' &nbsp;⇒&nbsp; ' + t(o.x0 + 'a=' + (o.n * o.n + o.b)) + ' &nbsp;⇒&nbsp; ' + t('a=' + o.a) + '.', ['Substitute the root, then square both sides.'], 'unknown coefficient from a root', { before: t('a=') });
      } }] },
    { num: 'C2', parts: [
      { id: 'C2', level: 'MAS', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(1, 9), n: r.int(1, 8) }; }, function (o) { return !(o.a === 3 && o.n === 1); });
        var tgt = 'c>' + o.n;
        return R.P.ineq('For which values of ' + t('c') + ' does ' + t('\\sqrt{x-' + o.a + '}+c=' + o.n) + ' have no solution?', tgt, { v: 'c', text: 'parameter: when is there no solution?', hint: 'Isolate the radical: ' + t('\\sqrt{x-' + o.a + '}=' + o.n + '-c') + '. For which ' + t('c') + ' is the right side negative?',
          cands: [{ tex: 'c\\ge ' + o.n, code: 'u4rad-strict', hint: 'When ' + t('c=' + o.n) + ', ' + t('\\sqrt{x-' + o.a + '}=0') + ', which has the solution ' + t('x=' + o.a) + '. So ' + t('c=' + o.n) + ' is not included.' },
            { tex: 'c<' + o.n, code: 'u4rad-flip', hint: 'Isolate: ' + t('\\sqrt{x-' + o.a + '}=' + o.n + '-c') + '. There is no solution when the right side is <b>negative</b>.' }, { tex: 'c\\le ' + o.n, code: 'u4rad-flip', hint: 'Those values of ' + t('c') + ' give a solution. There is no solution when ' + t(o.n + '-c<0') + '.' }, { tex: 'c>-' + o.n, code: 'u4rad-bound-sign', hint: 'Solve ' + t(o.n + '-c<0') + ' carefully.' }],
          sol: t('\\sqrt{x-' + o.a + '}=' + o.n + '-c') + '. A square root is never negative, so there is no solution when ' + t(o.n + '-c<0') + ', that is, when ' + t('c>' + o.n) + '.',
          hints: ['Isolate the radical: ' + t('\\sqrt{x-' + o.a + '}=' + o.n + '-c') + '.', 'When can a square root not equal the right side?'] });
      } }] },
    { num: 'C3', stem: '(Extension: cube roots.)', parts: [
      { id: 'C3a', level: 'MAS', make: function (r) {
        var o = pickWhere(function () { return { p: r.int(2, 5), n: r.int(1, 4), x0: -r.int(1, 15) }; }, function (o) { o.q = o.p * o.x0 + o.n * o.n * o.n; return o.q > 0 && o.q <= 30 && !(o.p === 2 && o.q === 3 && o.n === 3); });
        var n3 = o.n * o.n * o.n;
        return B.number('Solve ' + t('\\sqrt[3]{' + linT(o.p, -o.q) + '}=-' + o.n) + '.', o.x0,
          function (v) { return same(v, (o.q - o.n * o.n) / o.p) || same(v, (o.q + o.n * o.n) / o.p) ? { code: 'u4rad-no-square', hint: 'To undo a cube root, <b>cube</b> both sides: ' + t('(-' + o.n + ')^{3}=-' + n3) + '.' } : same(v, (o.q + n3) / o.p) ? { code: 'u4rad-sq-neg', hint: t('(-' + o.n + ')^{3}=-' + n3) + ' (an odd power keeps the sign).' } : null; },
          'Cube both sides: ' + t(linT(o.p, -o.q) + '=-' + n3) + ' &nbsp;⇒&nbsp; ' + t(o.p + 'x=' + (o.q - n3)) + ' &nbsp;⇒&nbsp; ' + t('x=' + o.x0) + '.<br>Verify: ' + t('\\sqrt[3]{' + (o.p * o.x0 - o.q) + '}=-' + o.n) + ' ✓', ['Cube both sides.', 'A cube root of a negative number is negative — that’s allowed.'], 'cube-root equation', { before: t('x=') });
      } },
      { id: 'C3b', level: 'MAS', make: function (r) {
        return mcPart(r, 'Why does a cube-root equation have no restriction, and why does cubing not create extraneous roots?', [
          { html: 'Every real number has exactly one real cube root (negatives included), and ' + t('a^{3}=b^{3}') + ' means ' + t('a=b') + '.', right: true },
          { html: 'Cube roots are always positive, so they can’t be extraneous.', why: t('\\sqrt[3]{-8}=-2') + ': cube roots can be negative.' },
          { html: 'Cubing makes every number positive, just like squaring.', why: t('(-2)^{3}=-8') + ': cubing keeps the sign. That is exactly why no root is added.' },
          { html: 'The radicand of a cube root must be ' + t('\\ge 0') + ', but cubing removes that condition.', why: 'A cube root is defined for negative radicands too, e.g. ' + t('\\sqrt[3]{-27}=-3') + '.' }],
          'Every real number has one real cube root, so there is no restriction. Squaring can turn ' + t('a\\ne b') + ' into ' + t('a^{2}=b^{2}') + ' (e.g. ' + t('3^{2}=(-3)^{2}') + '), but ' + t('a^{3}=b^{3}') + ' only when ' + t('a=b') + ', so cubing cannot add a root.', ['Compare ' + t('(-3)^{2}') + ' and ' + t('(-3)^{3}') + '.'], 'cube roots: no restriction, no extraneous roots');
      } }] }
  ];

  HW.defineLesson({ id: LID, unit: 4, num: '6', title: 'Solving Radical Equations and Checking for Extraneous Roots', outcome: 'AN3', calc: true, questions: QUESTIONS, extra: EXTRA });
})(window);
