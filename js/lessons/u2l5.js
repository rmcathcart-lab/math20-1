/* Math 20-1 · Unit 2 · Lesson 5 — Dividing Radicals and Rationalizing Monomial Denominators (outcome AN2 on every part)
 * Assignment 5 (m201book unit2/u2_l05.tex, Questions 1–19) and the Lesson 5 Extra Practice (u2_ep05.tex, A1–A4, B1–B7, C1–C3).
 * Every part is a generator: the booklet question's idea, form and difficulty with new numbers (the lesson's example
 * numbers and the booklet question's own numbers are left out where feasible). No calculator (Unit 2): exact answers.
 * Radical answers (any index, with or without variables) are typed with the keypad. Any equivalent exact answer is
 * accepted when it is in simplest form: no radical in a denominator, no fraction under a radical, no perfect-power
 * factor left under a root, like terms collected, fractions reduced (one fraction over the whole numerator, or each
 * term reduced on its own; a whole-number factor in front of brackets is fine). The right value in another form gets a
 * nudge that doesn't use a try. Variables are compared by value at several positive numbers.
 * Restrictions are typed as inequalities ("x > 0", "x ≠ 0", "x ≥ 0, x ≠ 9", "0 < x", …) and compared as sets.
 * Conversions: "explain / do you get the same answer" -> multiple choice or a step box; Q7(b) asks for the numerator
 * after rationalizing (radicals simplified) and the final answer; Extra C2 asks for the multiplier and the result;
 * Extra C3 ("show that") -> multiple choice for the argument, then the example.
 * Levels: LIM BEG EMG PRG ADV MAS. Mastery: Q7(c) simplify, Q18, Extra C1, Extra C2. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, B = K.P, ex = HW.ex, F = HW.fmt, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
  var LID = 'u2l5';

  var CODES = {};
  CODES[LID + '-rad-den'] = 'Radical left in the denominator'; CODES[LID + '-frac-under'] = 'Fraction left under a radical';
  CODES[LID + '-like'] = 'Like terms not collected'; CODES[LID + '-expand'] = 'Brackets not multiplied out';
  CODES[LID + '-two-roots'] = 'Product of radicals not combined'; CODES[LID + '-var-cancel'] = 'Common variable not cancelled';
  CODES[LID + '-neg-den'] = 'Negative denominator'; CODES[LID + '-neg-rad'] = 'Negative left inside an odd root';
  CODES[LID + '-one-frac'] = 'Not written as one fraction'; CODES[LID + '-coef'] = 'Didn’t divide the coefficients';
  CODES[LID + '-mult-rad'] = 'Multiplied the radicands instead of dividing'; CODES[LID + '-one-term'] = 'Divided only one term of the numerator';
  CODES[LID + '-one-term-mult'] = 'Multiplied only one numerator term by the radical'; CODES[LID + '-no-den'] = 'Rationalized the top but not the bottom';
  CODES[LID + '-den-k2'] = 'Squared the coefficient in the denominator'; CODES[LID + '-cube-as-sq'] = 'Treated a cube root like a square root';
  CODES[LID + '-root-top'] = 'Took the root of the numerator only'; CODES[LID + '-half'] = 'Forgot the ½ in A = ½bh';
  CODES[LID + '-mult-ratio'] = 'Multiplied by the ratio instead of dividing'; CODES[LID + '-not-smallest'] = 'Multiplier works but isn’t the smallest';
  CODES[LID + '-restr-zero'] = 'Restriction: allowed the value that makes the denominator 0'; CODES[LID + '-restr-odd'] = 'Restriction: odd root treated like an even root';
  CODES[LID + '-restr-den'] = 'Restriction: missed where the denominator is 0'; CODES[LID + '-restr-strict'] = 'Restriction: excluded a value that is allowed';
  CODES[LID + '-restr-even'] = 'Restriction: missed that the radicand must be ≥ 0'; CODES[LID + '-restr'] = 'Wrong restriction';
  CODES[LID + '-restr-format'] = 'Restriction not written as an inequality'; CODES[LID + '-restr-var'] = 'Restriction on the wrong letter';
  CODES[LID + '-area-diag'] = 'Squared the diagonal instead of the side'; CODES[LID + '-half-p'] = 'Perimeter: one length and one width only';
  CODES[LID + '-var-lost'] = 'Dropped the variable from the denominator'; CODES[LID + '-den-sq'] = 'Didn’t simplify the denominator radical';
  CODES[LID + '-sub-sign'] = 'Sign slip moving a term across'; CODES[LID + '-wrong-num'] = 'Wrong numerator after rationalizing';
  HW.addCodes(Object.keys(CODES).filter(function (k) { return !HW.CODES[k]; }).reduce(function (o, k) { o[k] = CODES[k]; return o; }, {}));
  var PART = {};
  [['coef', 's'], ['mult-rad', 'b'], ['one-term', 's'], ['one-term-mult', 's'], ['no-den', 's'], ['den-k2', 's'], ['cube-as-sq', 'b'], ['root-top', 'b'], ['half', 's'], ['mult-ratio', 'b'],
    ['not-smallest', 's'], ['restr-zero', 's'], ['restr-odd', 's'], ['restr-den', 's'], ['restr-strict', 's'], ['restr-even', 's'], ['sub-sign', 's'], ['wrong-num', 'b']].forEach(function (x) { PART[LID + '-' + x[0]] = x[1]; });
  HW.addPartial(PART);

  /* ======================= radical engine (the same block in u2l5.js and u2l6.js; kept local to each file) ======================= */
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var r = a % b; a = b; b = r; } return a; }
  function lcm(a, b) { return a / gcd(a, b) * b; }
  function Q(p, q) { if (q == null) q = 1; if (q < 0) { p = -p; q = -q; } var g = gcd(p, q) || 1; return [p / g, q / g]; }
  function R(c) { return typeof c === 'number' ? [c, 1] : c; }
  function qa(a, b) { return Q(a[0] * b[1] + b[0] * a[1], a[1] * b[1]); }
  function qm(a, b) { return Q(a[0] * b[0], a[1] * b[1]); }
  function qd(a, b) { return Q(a[0] * b[1], a[1] * b[0]); }
  function qv(a) { a = R(a); return a[0] / a[1]; }
  function pickWhere(gen, okf) { for (var i = 0; i < 6000; i++) { var o = gen(); if (okf(o)) return o; } throw new Error(LID + ': no valid numbers'); }
  function pw(a, n) { return Math.pow(a, n); }
  /* m = s^n · r with r free of nth powers (sign goes to s for odd n) */
  function split(m, n) { n = n || 2; var r = Math.abs(m), s = 1; for (var f = 2; pw(f, n) <= r; f++) { var fn = pw(f, n); while (r % fn === 0) { r /= fn; s *= f; } } return { s: m < 0 ? -s : s, r: r }; }
  function sqf(m) { return m > 1 && split(m, 2).s === 1; }
  function isPow(m, n) { var q = Math.round(pw(m, 1 / n)); return pw(q, n) === m; }
  function rt(m, n) { return n && n !== 2 ? '\\sqrt[' + n + ']{' + F(m) + '}' : '\\sqrt{' + F(m) + '}'; }
  function cT(k) { return k === 1 ? '' : k === -1 ? '-' : String(k); }        // whole-number coefficient in front of something
  function qT(c) { c = R(c); return c[1] === 1 ? String(c[0]) : (c[0] < 0 ? '-' : '') + '\\frac{' + Math.abs(c[0]) + '}{' + c[1] + '}'; }
  /* a raw (unsimplified) sum for prompts: [[c, m, n]] -> "c√m + …" (m = 1: the number c) */
  function raw(list) {
    return list.map(function (x, i) { var c = x[0], m = x[1] == null ? 1 : x[1], n = x[2] || 2, a = Math.abs(c), s = c < 0 ? '-' : i ? '+' : '';
      return s + (m === 1 ? String(a) : (a === 1 ? '' : a) + rt(m, n)); }).join('');
  }
  /* ---- sums of square roots: [{ c: [p, q], m }] with m square-free (1 = the rational part), in order of first appearance ---- */
  function addT(arr, c, m) { var sp = split(m, 2); c = qm(R(c), [sp.s, 1]); m = sp.r; if (m === 0) return arr;
    for (var i = 0; i < arr.length; i++) if (arr[i].m === m) { arr[i].c = qa(arr[i].c, c); if (arr[i].c[0] === 0) arr.splice(i, 1); return arr; }
    if (c[0] !== 0) arr.push({ c: c, m: m }); return arr; }
  function S(list) { var o = []; list.forEach(function (x) { addT(o, R(x[0]), x[1] == null ? 1 : x[1]); }); return o; }
  function sAdd(A, Bs) { var o = A.map(function (x) { return { c: x.c, m: x.m }; }); Bs.forEach(function (x) { addT(o, x.c, x.m); }); return o; }
  function sNeg(A) { return A.map(function (x) { return { c: [-x.c[0], x.c[1]], m: x.m }; }); }
  function sSub(A, Bs) { return sAdd(A, sNeg(Bs)); }
  function sSc(A, r) { var o = []; A.forEach(function (x) { addT(o, qm(x.c, R(r)), x.m); }); return o; }
  function sMul(A, Bs) { var o = []; A.forEach(function (a) { Bs.forEach(function (b) { addT(o, qm(a.c, b.c), a.m * b.m); }); }); return o; }
  function sConj(D) { if (D.length === 1) return [{ c: [1, 1], m: D[0].m }]; return [{ c: D[0].c, m: D[0].m }, { c: [-D[1].c[0], D[1].c[1]], m: D[1].m }]; }
  function sRat(A) { return !A.length ? [0, 1] : A.length === 1 && A[0].m === 1 ? A[0].c : null; }
  function sDiv(N, D) { var c = sConj(D), d = sRat(sMul(D, c)); if (!d || !d[0]) throw new Error(LID + ': bad denominator'); return sSc(sMul(N, c), qd([1, 1], d)); }
  function sVal(A) { return A.reduce(function (s, x) { return s + qv(x.c) * Math.sqrt(x.m); }, 0); }
  function sDen(A) { return A.reduce(function (l, x) { return lcm(l, x.c[1]); }, 1); }
  function sOrd(A) { var i = 0; while (i < A.length && A[i].c[0] < 0) i++; if (i === 0 || i === A.length) return A; return [A[i]].concat(A.slice(0, i), A.slice(i + 1)); }
  /* simplest-form TeX: one fraction over the lcm of the denominators, a positive term first */
  function sTex(A, opt) {
    opt = opt || {}; if (!A.length) return '0';
    if (!opt.keep) A = sOrd(A);
    var L = sDen(A), ints = A.map(function (x) { return x.c[0] * (L / x.c[1]); }), neg = L > 1 && ints.every(function (x) { return x < 0; });
    if (neg) ints = ints.map(function (x) { return -x; });
    var body = raw(ints.map(function (c, i) { return [c, A[i].m]; }));
    return L === 1 ? body : (neg ? '-' : '') + '\\frac{' + body + '}{' + L + '}';
  }
  /* the same value written another acceptable way (reversed order, each term its own fraction) — for the tests */
  function sAlt(A) { if (A.length < 2) return null; return A.slice().reverse().map(function (x, i) { var s = mTex(x.c, 2, x.m); return i && s.charAt(0) !== '-' ? '+' + s : s; }).join(''); }
  /* a single radical c·ⁿ√m (m free of nth powers) */
  function M(c, n, m) { var sp = split(m, n); return { c: qm(R(c), [sp.s, 1]), n: n, m: sp.r }; }
  function mTex(c, n, m) { return ex.texRadical(R(c), n, m); }
  function MT(x) { return mTex(x.c, x.n, x.m); }
  function MV(x) { return qv(x.c) * pw(x.m, 1 / x.n); }
  /* a / ⁿ√b rationalized: multiplier ⁿ√k making b·k a perfect nth power (b may be negative for odd n) */
  function ratRoot(a, n, b) {
    var sg = b < 0 ? -1 : 1, bb = Math.abs(b), k = 1, x = bb;
    for (var p = 2; p <= x; p++) { var e = 0; while (x % p === 0) { x /= p; e++; } if (e % n) k *= pw(p, n - e % n); }
    var Bv = Math.round(pw(bb * k, 1 / n));
    return { mult: k, B: Bv * sg, res: M(qd(R(a), [Bv * sg, 1]), n, k) };
  }

  /* ---------- reading an answer: is it in simplest form? (value already right) ---------- */
  function unp(a) { while (a && a.t === 'paren') a = a.a; return a; }
  function has(a, pred) { var f = false; (function w(x) { if (!x || typeof x !== 'object' || f) return; if (pred(x)) { f = true; return; } ['a', 'b', 'n'].forEach(function (k) { if (x[k] && typeof x[k] === 'object') w(x[k]); }); })(a); return f; }
  function isRoot(x) { return x.t === 'root'; }
  function isSum(x) { x = unp(x); while (x && x.t === 'neg') x = unp(x.a); return !!x && (x.t === 'add' || x.t === 'sub'); }
  function scaledSum(x) { x = unp(x); if (x.t !== 'mul') return false; var ra = ex.rat(x.a), rb = ex.rat(x.b); return (isSum(x.b) && ra && ra[1] === 1) || (isSum(x.a) && rb && rb[1] === 1); }
  function hasVar(x) { return has(x, function (y) { return y.t === 'var'; }); }
  function I(code, hint) { return { code: LID + '-' + code, hint: hint, plain: false }; }
  function G(code, hint) { return { code: code, hint: hint }; }
  function rootIssue(x, o) {
    var nn = ex.rat(x.n); if (!nn || nn[1] !== 1 || nn[0] < 2) return G('simplify', 'Right value — write the root with a whole-number index.');
    var n = nn[0], A = unp(x.a);
    if (has(A, function (y) { return y.t === 'div'; })) return I('frac-under', 'Right value, but there is still a fraction under the radical. Split it, ' + t('\\sqrt{\\tfrac{a}{b}}=\\tfrac{\\sqrt{a}}{\\sqrt{b}}') + ', then rationalize the denominator.');
    if (has(A, isRoot)) return G('not-simplest', 'Right value, but there is a radical inside a radical. Simplify it.');
    var r = ex.rat(A);
    if (r) {
      if (r[1] !== 1) return I('frac-under', 'Right value, but there is still a fraction under the radical.');
      var m = r[0];
      if (m < 0 && n % 2) return I('neg-rad', 'Right value — take the negative sign out of the root: ' + t('\\sqrt[3]{-a}=-\\sqrt[3]{a}') + '.');
      if (m === 0 || m === 1) return G('not-simplest', 'Right value, but ' + t(rt(m, n) + '=' + m) + ' — write it without the radical.');
      var f = ex.nthFactor(Math.abs(m), n);
      if (f > 1) return G('not-simplest', 'Right value, but ' + t(rt(m, n)) + ' isn’t in simplest form: ' + t(F(m)) + ' has the factor ' + t(F(pw(f, n)) + '=' + f + '^{' + n + '}') + '. Take ' + t(f) + ' out of the radical.');
      return null;
    }
    var mo = ex.mono(A);
    if (mo) {
      if (mo.k[1] !== 1) return I('frac-under', 'Right value, but there is still a fraction under the radical.');
      var neg = Object.keys(mo.vars).filter(function (v) { return mo.vars[v] < 0; });
      if (neg.length) return I('frac-under', 'Right value, but there is still a fraction under the radical.');
      var f2 = ex.nthFactor(Math.abs(mo.k[0]), n);
      if (f2 > 1) return G('not-simplest', 'Right value, but the number under the radical still has the factor ' + t(F(pw(f2, n))) + '. Take ' + t(f2) + ' out.');
      var big = Object.keys(mo.vars).filter(function (v) { return mo.vars[v] >= n; });
      if (big.length) return G('not-simplest-var', 'Right value, but ' + t(big[0] + '^{' + mo.vars[big[0]] + '}') + ' under the radical still contains ' + t(big[0] + '^{' + n + '}') + '. Take it out of the radical.');
      return null;
    }
    if (o.sumRad) return null;
    return G('simplify', 'Right value — simplify what is under the radical.');
  }
  /* one product/quotient term: numbers, variables and at most one root */
  function termOf(x, sg) {
    var fz = ex.factors(x), wn = [], wd = [], vn = {}, vd = {}, roots = [], issue = null;
    function fac(f, den) {
      f = unp(f);
      if (f.t === 'num') { (den ? wd : wn).push(f.v); return; }
      if (f.t === 'var') { var vv = den ? vd : vn; vv[f.n] = (vv[f.n] || 0) + 1; return; }
      if (f.t === 'pow' && unp(f.a).t === 'var') { var e = ex.rat(f.b); if (!e || e[1] !== 1) { issue = issue || G('simplify', 'Right value — write the variable powers with whole-number exponents.'); return; } var v3 = den ? vd : vn, nm = unp(f.a).n; v3[nm] = (v3[nm] || 0) + e[0]; return; }
      if (f.t === 'root') { if (den) { issue = issue || I('rad-den', null); return; } roots.push(f); return; }
      if (f.t === 'pow') { issue = issue || G('simplify', 'Right value — work out the power.'); return; }
      if (isSum(f)) { issue = issue || (den ? I('one-frac', 'Right value — write it as one fraction over the denominator.') : I('expand', 'Right value — multiply out the brackets to finish.')); return; }
      if (f.t === 'neg') { sg = -sg; fac(f.a, den); return; }
      if (f.t === 'mul' || f.t === 'div') { var fz2 = ex.factors(f); if (fz2.sign < 0) sg = -sg; fz2.num.forEach(function (y) { fac(y, den); }); fz2.den.forEach(function (y) { fac(y, !den); }); return; }
      issue = issue || G('simplify', 'Right value — simplify your answer.');
    }
    fz.num.forEach(function (f) { fac(f, false); }); fz.den.forEach(function (f) { fac(f, true); });
    var pn = wn.reduce(function (a, b) { return a * b; }, 1), pd = wd.reduce(function (a, b) { return a * b; }, 1);
    if (!issue && roots.length > 1) issue = I('two-roots', 'Right value — multiply the radicals together into one radical: ' + t('\\sqrt{a}\\cdot\\sqrt{b}=\\sqrt{ab}') + '.');
    if (!issue && (wn.length > 1 || wd.length > 1)) issue = G('simplify', 'Right value — multiply the numbers together into one coefficient.');
    if (!issue && wd.length && pd === 1) issue = G('simplify', 'Right value — a denominator of ' + t('1') + ' isn’t needed.');
    if (!issue && gcd(pn, pd) > 1) issue = G('lowest', 'Right value — reduce the fraction: ' + t(pn) + ' and ' + t(pd) + ' share the factor ' + t(gcd(pn, pd)) + '.');
    var both = Object.keys(vn).filter(function (v) { return vd[v]; });
    if (!issue && both.length) issue = I('var-cancel', 'Right value — ' + t(both[0]) + ' is in the numerator and the denominator. Cancel it.');
    var vs = Object.keys(vn).concat(Object.keys(vd)).filter(function (v, i, a) { return a.indexOf(v) === i; }).sort().map(function (v) { return v + ((vn[v] || 0) - (vd[v] || 0)); }).join('');
    var rs = roots.map(function (rr) { var A = unp(rr.a), r2 = ex.rat(A), mo = !r2 && ex.mono(A); return 'r' + JSON.stringify(ex.rat(rr.n)) + ':' + (r2 ? r2.join('/') : mo ? mo.k.join('/') + JSON.stringify(mo.vars) : JSON.stringify(A)); }).join(',');
    return { k: Q(sg * fz.sign * pn, pd), pn: pn, pd: pd, frac: wd.length > 0, sig: rs + '|' + vs, issue: issue };
  }
  function sumList(x, sg, out) {
    x = unp(x);
    if (x.t === 'neg') return sumList(x.a, -sg, out);
    if (x.t === 'add' || x.t === 'sub') { sumList(x.a, sg, out); sumList(x.b, x.t === 'sub' ? -sg : sg, out); return out; }
    if (x.t === 'mul') {
      var ra = ex.rat(x.a), rb = ex.rat(x.b);
      if (isSum(x.b) && ra && ra[1] === 1 && !isSum(x.a)) { sumList(x.b, sg * ra[0], out); return out; }
      if (isSum(x.a) && rb && rb[1] === 1 && !isSum(x.b)) { sumList(x.a, sg * rb[0], out); return out; }
      if (isSum(x.a) || isSum(x.b)) { out.issue = out.issue || I('expand', 'Right value — multiply out the brackets to finish.'); return out; }
    }
    if (x.t === 'div' && (isSum(x.a) || scaledSum(x.a))) {
      var dq = ex.rat(x.b);
      if (dq && dq[1] === 1 && dq[0] !== 0) {
        var inner = sumList(x.a, sg, []); if (inner.issue && !out.issue) out.issue = inner.issue;
        var g0 = inner.reduce(function (a, y) { return gcd(a, y.k[0] * y.k[1]); }, dq[0]);
        if (!out.issue && inner.some(function (y) { return y.frac; })) out.issue = G('simplify', 'Right value — write it with whole numbers in the numerator and the denominator.');
        if (!out.issue && Math.abs(g0) > 1) out.issue = G('lowest', 'Right value — reduce the fraction: every term and the denominator have the factor ' + t(Math.abs(g0)) + '.');
        if (!out.issue && dq[0] < 0) out.issue = I('neg-den', 'Right value — keep the denominator positive.');
        inner.forEach(function (y) { y.k = qd(y.k, [dq[0], 1]); y.frac = true; out.push(y); });
        return out;
      }
    }
    var tm = termOf(x, 1);
    if (sg !== 1 && sg !== -1) { tm.k = qm(tm.k, [Math.abs(sg), 1]); tm.pn *= Math.abs(sg); }
    if (sg < 0) tm.k = [-tm.k[0], tm.k[1]];
    if (tm.issue && !out.issue) out.issue = tm.issue;
    out.push(tm); return out;
  }
  function likeIssue(terms) { var seen = {}; for (var i = 0; i < terms.length; i++) { if (seen[terms[i].sig]) return I('like', 'Right value — collect the like terms (terms with the same radical' + (terms[i].sig === '|' ? ', or the plain numbers' : '') + ') into one term.'); seen[terms[i].sig] = 1; } return null; }
  function formIssue(ast, o) {
    var sh = ex.shape(ast);
    if (sh.decimals && !o.dec) return G('decimal', 'Right value — write it exactly, as a fraction or with radicals, not as a decimal.');
    if (has(ast, function (y) { return y.t === 'div' && has(y.b, isRoot); }) || has(ast, function (y) { return y.t === 'pow' && has(y.a, isRoot) && ex.rat(y.b) && ex.rat(y.b)[0] < 0; }))
      return I('rad-den', o.radDen || 'Right value, but there is still a radical in the denominator. Rationalize it: multiply the top and bottom by the radical that clears it.');
    var roots = []; (function w(x) { if (!x || typeof x !== 'object') return; if (x.t === 'root') roots.push(x); ['a', 'b', 'n'].forEach(function (k) { if (x[k] && typeof x[k] === 'object') w(x[k]); }); })(ast);
    for (var i = 0; i < roots.length; i++) { var ri = rootIssue(roots[i], o); if (ri) return ri; }
    if (has(ast, function (y) { return y.t === 'pow' && (has(y.a, isRoot) || isSum(y.a) || unp(y.a).t === 'num'); })) return G('simplify', 'Right value — work out the powers and multiply out to finish.');
    if (has(ast, function (y) { if (y.t !== 'div') return false; var b = unp(y.b); return b.t === 'neg' || (b.t === 'num' && b.v < 0); })) return I('neg-den', 'Right value — keep the denominator positive (put the negative sign in front of the fraction).');
    var top = unp(ast), sg = 1; while (top.t === 'neg') { sg = -sg; top = unp(top.a); }
    if (top.t === 'div' && (isSum(top.a) || isSum(top.b) || scaledSum(top.a))) {
      var N = sumList(top.a, 1, []), D = sumList(top.b, 1, []);
      if (N.issue) return N.issue; if (D.issue) return D.issue;
      if (N.some(function (x) { return x.frac; }) || D.some(function (x) { return x.frac; })) return G('simplify', 'Right value — write it with whole numbers in the numerator and the denominator.');
      var li = likeIssue(N) || likeIssue(D); if (li) return li;
      var g = N.concat(D).reduce(function (a, x) { return gcd(a, x.k[0]); }, 0);
      if (g > 1) return G('lowest', 'Right value — reduce the fraction: every term of the numerator and the denominator has the factor ' + t(g) + '.');
      if (D.length === 1 && D[0].sig === '|' && D[0].k[0] < 0) return I('neg-den', 'Right value — keep the denominator positive (move the negative sign to the front or into the numerator).');
      if (D.length === 1 && D[0].sig === '|' && D[0].k[0] === 1) return G('simplify', 'Right value — a denominator of ' + t('1') + ' isn’t needed.');
      if (D.length === 1 && D[0].sig !== '|') { var dv = D[0].sig.split('|')[1].replace(/\d+/g, ''); if (dv && dv.split('').every(function (v) { return N.every(function (x) { return x.sig.split('|')[1].indexOf(v) >= 0; }); })) return I('var-cancel', 'Right value — every term has the same variable factor as the denominator. Cancel it.'); }
      return null;
    }
    var T = sumList(ast, 1, []);
    if (T.issue) return T.issue;
    return likeIssue(T);
  }
  /* ---------- the answer checker: keyTex is the simplest-form answer ----------
   * o.vars (letters allowed), o.cands [[tex | number, code, hint]], o.radDen (hint), o.sumRad, o.dec, o.extra(ast, val) -> issue */
  var ENV = [0.37, 1.73, 2.91, 5.29, 7.43, 13.17];
  function envs(vars) { return ENV.map(function (x0, i) { var e = {}; vars.forEach(function (v, j) { e[v] = ENV[(i + 2 * j) % ENV.length] + 0.61 * j; }); return e; }); }
  function sameVal(fa, fb, vars) {
    var es = vars.length ? envs(vars) : [{}], n = 0;
    for (var i = 0; i < es.length; i++) { var x = fa(es[i]), y = fb(es[i]); if (!isFinite(y)) continue; if (!isFinite(x) || !ex.eq(x, y, 1e-8)) return false; n++; }
    return n > 0;
  }
  function texFn(tex) { var p = ex.parse(tex); if (!p.ok) throw new Error(LID + ': bad TeX ' + tex); return function (e) { return ex.value(p.ast, e); }; }
  function RX(keyTex, o) {
    o = o || {};
    var kp = ex.parse(keyTex); if (!kp.ok) throw new Error(LID + ': bad key ' + keyTex);
    var vars = o.vars || Object.keys(ex.shape(kp.ast).vars).sort(), T = function (e) { return ex.value(kp.ast, e); };
    var cands = (o.cands || []).filter(Boolean).map(function (c) { return { f: typeof c[0] === 'number' ? function () { return c[0]; } : texFn(c[0]), code: c[1], hint: c[2] }; });
    return function (resp) {
      var a = K.read(resp); if (a.res) return a.res;
      var sv = Object.keys(ex.shape(a.ast).vars), extra = sv.filter(function (v) { return vars.indexOf(v) < 0; });
      if (extra.length) return wrong('var', 'Your answer has a letter ' + t(extra[0]) + ' that isn’t in the question.');
      var S0 = function (e) { return ex.value(a.ast, e); };
      if (sameVal(S0, T, vars)) {
        var fi = formIssue(a.ast, o) || (o.extra ? o.extra(a.ast) : null);
        return fi ? form(fi.code, fi.hint) : ok();
      }
      if (!vars.length) { var mv = ex.mixedValue(a.ast); if (mv != null && ex.eq(mv, T({}))) return form('mixed-num', 'Right value! Write it as an improper fraction, not a mixed number.'); }
      if (!vars.length && ex.shape(a.ast).decimals && Math.abs(a.val - T({})) < 0.01 * Math.max(1, Math.abs(T({})))) return form('decimal-rounded', 'That decimal is close but not exact. Give the exact answer (no calculator in this unit).');
      for (var i = 0; i < cands.length; i++) if (sameVal(S0, cands[i].f, vars)) return wrong(cands[i].code, cands[i].hint);
      if (sameVal(S0, function (e) { return -T(e); }, vars)) return wrong('sign', 'Check the sign of your answer.');
      if (!vars.length && T({}) !== 0 && ex.eq(a.val, 1 / T({}))) return wrong('flip', 'Your answer is upside down — check which part goes on top.');
      return wrong('value', null);
    };
  }
  /* ---------- restrictions on one variable, typed as inequalities ---------- */
  function readRestr(resp) {
    var s = String(resp == null ? '' : resp);
    s = s.replace(/\\left|\\right|\\[,;:! ]|\\quad|~|\s/g, '').replace(/\\text\{([^{}]*)\}|\\mathrm\{([^{}]*)\}/g, function (m0, a, b) { return a || b || ''; });
    s = s.replace(/\\leqslant|\\leq|\\le|≤|<=|=</g, '≤').replace(/\\geqslant|\\geq|\\ge|≥|>=|=>/g, '≥').replace(/\\neq|\\ne|≠|!=|<>|\\not=/g, '≠').replace(/\\lt/g, '<').replace(/\\gt/g, '>');
    s = s.replace(/,?[a-z](\\in|∈)(\\mathbb\{R\}|ℝ|R)/g, '').replace(/\\land|\\wedge|and|&|;/g, ',');
    if (!s) return { empty: true };
    var alts = s.split(/\\lor|\\vee|or/), letters = {}, all = [];
    for (var ai = 0; ai < alts.length; ai++) {
    var parts = alts[ai].split(',').filter(function (p) { return p.length; }), cons = [];
    if (!parts.length) return { bad: true };
    for (var i = 0; i < parts.length; i++) {
      var tk = parts[i].split(/(≤|≥|≠|<|>)/).filter(function (z) { return z.length; });
      if (tk.length < 3 || tk.length % 2 === 0) return { bad: true };
      for (var j = 1; j < tk.length; j += 2) {
        var L = tk[j - 1], op = tk[j], Rr = tk[j + 1];
        if (!/^(≤|≥|≠|<|>)$/.test(op)) return { bad: true };
        var lv = /^[a-z]$/.test(L), rv = /^[a-z]$/.test(Rr);
        if (lv === rv) return { bad: true };
        var numS = lv ? Rr : L, p = ex.parse(numS); if (!p.ok) return { bad: true }; var val = ex.value(p.ast, {}); if (!isFinite(val)) return { bad: true };
        if (lv) letters[L] = 1; else letters[Rr] = 1;
        if (rv) op = { '<': '>', '>': '<', '≤': '≥', '≥': '≤', '≠': '≠' }[op];
        cons.push({ op: op, v: val });
      }
    }
    all.push(cons);
    }
    return { cons: all.length === 1 ? all[0] : { or: all }, letters: Object.keys(letters) };
  }
  function holds(cons, x) { if (cons.or) return cons.or.some(function (c) { return holds(c, x); }); return cons.every(function (c) { return c.op === '>' ? x > c.v + 1e-12 : c.op === '<' ? x < c.v - 1e-12 : c.op === '≥' ? x >= c.v - 1e-12 : c.op === '≤' ? x <= c.v + 1e-12 : Math.abs(x - c.v) > 1e-12; }); }
  function sameSet(A, Bc) {
    var pts = [-1000, -7.5, 1000];
    function flat(c) { return c.or ? [].concat.apply([], c.or) : c; }
    flat(A).concat(flat(Bc)).forEach(function (c) { pts.push(c.v, c.v - 0.5, c.v + 0.5, c.v - 1e-3, c.v + 1e-3); });
    return pts.every(function (x) { return holds(A, x) === holds(Bc, x); });
  }
  /* want: constraint list; o.alts: other accepted lists; o.v: the letter; o.kind: 'even' | 'odd' | 'bin' (binomial denominator, zero at o.z) */
  function RS(want, o) {
    o = o || {}; var v = o.v || 'x';
    return function (resp) {
      var rd = readRestr(resp);
      if (rd.empty) return form('empty', 'Type the restriction first, e.g. ' + t(v + '>0') + '.');
      if (rd.bad || !(rd.cons.or || rd.cons).length) return form(LID + '-restr-format', 'Write the restriction as an inequality, e.g. ' + t(v + '>0') + ', ' + t(v + '\\ne 0') + ' or ' + t(v + '\\ge 0,\\ ' + v + '\\ne 4') + '.');
      if (rd.letters.some(function (l) { return l !== v; })) return form(LID + '-restr-var', 'The variable in this question is ' + t(v) + ' — write the restriction for ' + t(v) + '.');
      var c = rd.cons;
      if (sameSet(c, want) || (o.alts || []).some(function (al) { return sameSet(c, al); })) return ok();
      var at0 = holds(c, 0), neg = holds(c, -1), z = o.z;
      if (o.kind === 'even') {
        if (at0 && !neg && sameSet(c, [{ op: '≥', v: 0 }])) return wrong(LID + '-restr-zero', t(v + '=0') + ' makes the denominator ' + t('0') + '. The radicand must be positive, not just ' + t('\\ge 0') + '.');
        if (neg) return wrong(LID + '-restr-even', 'A square root of a negative number isn’t a real number, so the radicand can’t be negative.');
      }
      if (o.kind === 'odd') {
        if (!neg) return wrong(LID + '-restr-odd', 'A cube root of a negative number is fine (' + t('\\sqrt[3]{-8}=-2') + '). Only the denominator can’t be ' + t('0') + '.');
        if (at0) return wrong(LID + '-restr-zero', t(v + '=0') + ' makes the denominator ' + t('0') + '.');
      }
      if (o.kind === 'bin') {
        if (neg) return wrong(LID + '-restr-even', 'The radicand ' + t(v) + ' must be ' + t('\\ge 0') + ': a square root of a negative isn’t real.');
        if (z != null && holds(c, z) && !(o.alts || []).length) return wrong(LID + '-restr-den', 'Check ' + t(v + '=' + z) + ': it makes the denominator ' + t('0') + '.');
        if (!at0) return wrong(LID + '-restr-strict', t(v + '=0') + ' is allowed: ' + t('\\sqrt{0}=0') + ' and the denominator isn’t ' + t('0') + ' there.');
      }
      return wrong(LID + '-restr', null);
    };
  }
  function rTex(want, v) { return want.map(function (c) { return v + { '>': '>', '<': '<', '≥': '\\ge ', '≤': '\\le ', '≠': '\\ne ' }[c.op] + c.v; }).join(',\\ '); }
  function rKey(want, v) { return want.map(function (c) { return v + { '>': '>', '<': '<', '≥': '\\geq ', '≤': '\\leq ', '≠': '\\neq ' }[c.op] + c.v; }).join(', '); }

  /* ---------- keypads (registered once, under this lesson's own names) ---------- */
  var KS = LID + 'k', KR = LID + 'kr';
  (function () {
    var W = HW.widgets; if (!W || !W.KEYSETS) return;
    function d(n) { return { label: String(n), tex: String(n), plain: String(n) }; }
    var Y = { del: { label: '⌫', fn: 'del', title: 'Delete' }, clear: { label: 'clear', fn: 'clear' }, left: { label: '◀', fn: 'left', title: 'Move left' }, right: { label: '▶', fn: 'right', title: 'Move right (out of a box)' },
      enter: { label: 'Check ↵', fn: 'enter', wide: true }, sqrt: { label: '√', tex: '\\sqrt{#0}', plain: 'sqrt(', title: 'Square root' }, cbrt: { label: '∛', tex: '\\sqrt[3]{#0}', plain: 'cbrt(', title: 'Cube root' },
      nrt: { label: '<sup>n</sup>√', tex: '\\sqrt[#?]{#0}', plain: '\\sqrt[]{}', title: 'Root with any index' }, frac: { label: '<sup>a</sup>⁄<sub>b</sub>', tex: '\\frac{#@}{#?}', plain: '/', title: 'Fraction' },
      pow: { label: 'x<sup>n</sup>', tex: '#@^{#?}', plain: '^', title: 'Exponent' }, plus: { label: '+', tex: '+', plain: '+' }, minus: { label: '−', tex: '-', plain: '-' },
      times: { label: '×', tex: '\\times', plain: ' × ', title: 'Multiply' }, par: { label: '( )', tex: '\\left(#0\\right)', plain: '(', title: 'Brackets' },
      gt: { label: '>', tex: '>', plain: ' > ' }, ge: { label: '≥', tex: '\\ge ', plain: ' >= ' }, lt: { label: '<', tex: '<', plain: ' < ' }, le: { label: '≤', tex: '\\le ', plain: ' <= ' }, ne: { label: '≠', tex: '\\ne ', plain: ' != ' }, comma: { label: ',', tex: ',', plain: ', ' } };
    function rows(opt, rel) {
      var vs = (opt && opt.vars ? opt.vars : []).slice(0, 4).map(function (v) { return { label: '<i>' + v + '</i>', tex: v, plain: v }; });
      var out = [[d(7), d(8), d(9), Y.sqrt, Y.cbrt, Y.nrt, Y.del], [d(4), d(5), d(6), Y.frac, Y.pow, Y.par, Y.clear], [d(1), d(2), d(3), Y.plus, Y.minus, Y.left, Y.right], [d(0), Y.times].concat(vs, [Y.enter])];
      if (rel) out.push([Y.gt, Y.ge, Y.lt, Y.le, Y.ne, Y.comma]);
      return out;
    }
    if (!W.KEYSETS[KS]) W.KEYSETS[KS] = function (opt) { return rows(opt, false); };
    if (!W.KEYSETS[KR]) W.KEYSETS[KR] = function (opt) { return rows(opt, true); };
    if (W.KEYHELP) {
      W.KEYHELP[KS] = ['Use <b>√</b>, <b>∛</b> or <b><sup>n</sup>√</b> for roots and <b><sup>a</sup>⁄<sub>b</sub></b> for a fraction. Press <b>▶</b> to step out of a root or a fraction box.', 'Type roots as <code>3sqrt(5)</code> or <code>2cbrt(4)</code> and fractions with <code>/</code> and brackets, e.g. <code>(5sqrt(3)+3)/3</code>.'];
      W.KEYHELP[KR] = ['Restriction: use <b>&gt; ≥ &lt; ≤ ≠</b>, with a comma between two conditions (e.g. ' + HW.k('x\\ge 0,\\ x\\ne 9') + '). Answer: use <b>√</b>, <b>∛</b> and <b><sup>a</sup>⁄<sub>b</sub></b>; press <b>▶</b> to step out of a box.', 'Restriction: type e.g. <code>x &gt; 0</code> or <code>x &gt;= 0, x != 9</code>. Answer: e.g. <code>2sqrt(2x)/x</code>.'];
    }
  })();

  /* ---------- part builders ---------- */
  var HR = ['Divide the coefficients, divide the radicands, then simplify.'];
  function radP(prompt, keyTex, o) {
    o = o || {};
    var vars = o.vars || Object.keys(ex.shape(ex.parse(keyTex).ast).vars).sort(), kf = texFn(keyTex);
    o.cands = (o.cands || []).filter(function (c) { return c && !sameVal(typeof c[0] === 'number' ? function () { return c[0]; } : texFn(c[0]), kf, vars); });
    var bad = (o.cands || []).filter(function (c) { return c && typeof c[0] === 'string'; }).map(function (c) { return c[0]; }).concat(o.bad || []);
    return { prompt: prompt, input: { type: 'math', keys: KS, vars: vars, before: o.before, after: o.after, placeholder: vars.length ? 'e.g. 2sqrt(3x)/x' : 'e.g. (5sqrt(3)+3)/3' },
      check: RX(keyTex, o), key: keyTex, answer: t((o.ansPre || '') + keyTex + (o.unit ? '\\text{ ' + o.unit + '}' : '')), solution: o.sol, hints: o.hints || [], text: o.text, bad: bad, good: (o.good || []).filter(Boolean) };
  }
  /* sum-of-square-roots answer A (array), prompt = the expression */
  function sP(prompt, A, o) { o = o || {}; var k = sTex(A); o.good = (o.good || []).concat([sAlt(A)]); return radP(prompt, k, o); }
  function mP(prompt, Mx, o) { return radP(prompt, MT(Mx), o); }
  /* restriction box + simplified box */
  function restrP(prompt, v, want, keyTex, o) {
    o = o || {};
    var rk = rKey(want, v), fields = [{ label: 'Restriction:', name: 'Restriction', mode: 'math', keys: KR, vars: [v], wide: true }, { label: 'Simplified:', name: 'Simplified', mode: 'math', keys: KR, vars: [v], wide: true }];
    var p = B.fields(prompt, fields, [RS(want, { v: v, kind: o.kind, z: o.z, alts: o.alts }), RX(keyTex, { vars: [v], cands: o.cands, radDen: o.radDen, sumRad: o.sumRad })], [rk, keyTex],
      'Restriction: ' + t(rTex(want, v)) + '<br>Simplified: ' + t(keyTex), o.sol, o.hints || [], o.text);
    p.bad = [[rk, '0'], [o.kind === 'odd' ? v + '>0' : v + '\\geq 0', keyTex]].concat((o.cands || []).filter(function (c) { return typeof c[0] === 'string'; }).map(function (c) { return [rk, c[0]]; }));
    p.good = [[rTex(want, v).replace(/\\ /g, ' '), keyTex]];
    if (want.length === 1 && want[0].op === '>') p.good.push(['0<' + v, keyTex]);
    return p;
  }
  function mcP(r, prompt, opts, sol, hints, text) {
    var seen = {}, out = [];
    opts.forEach(function (op) { var k = op.html.replace(/\s/g, ''); if (seen[k] && !op.right) return; seen[k] = 1; out.push(op); });
    return B.mc(r, prompt, out, sol, hints || [], text);
  }
  function nrP(prompt, ans, cands, sol, hints, text) {
    var p = B.nr(prompt, ans, function (v) { for (var i = 0; i < (cands || []).length; i++) if (Math.abs(v - cands[i][0]) < 1e-9) return { code: cands[i][1], hint: cands[i][2] }; return null; }, sol, hints, text);
    p.bad = (cands || []).filter(function (c) { return Math.abs(c[0] - ans) > 1e-9 && String(c[0]).length <= 4 && c[0] >= 0; }).map(function (c) { return String(c[0]); });
    return p;
  }
  function D(n, d) { return '\\dfrac{' + n + '}{' + d + '}'; }
  function ex1(texExpr) { return t(texExpr); }
  var SQF = [2, 3, 5, 6, 7, 10, 11, 13, 14, 15, 17, 19, 21, 22, 23, 26, 29, 30];
  var PR = [2, 3, 5, 7, 11, 13];
  function bareRoot(c, m, n) { return (c === 1 ? '' : c === -1 ? '-' : c) + rt(m, n); }
  /* ======================= Lesson 5 generators ======================= */
  /* (k1 ⁿ√(q·b)) / (k2 ⁿ√b), q = s^n·m: answer (k1/k2)·s·ⁿ√m */
  function divMono(o, text, level) {
    var n = o.n || 2, A = o.q * o.b, c = Q(o.k1, o.k2), res = M(c, n, o.q);
    var num = bareRoot(o.k1, A, n), den = bareRoot(o.k2, o.b, n);
    var cf = c[1] === 1 && Math.abs(c[0]) === 1 ? (c[0] < 0 ? '-' : '') : qT(c), rq = (n === 2 ? '\\sqrt' : '\\sqrt[' + n + ']');
    var steps = cf + rq + '{\\tfrac{' + F(A) + '}{' + F(o.b) + '}}=' + cf + rt(o.q, n) + (MT(res) !== cf + rt(o.q, n) ? '=' + MT(res) : '');
    var cands = [];
    if (o.k2 !== 1) cands.push([mTex(Q(o.k1, 1), n, o.q), LID + '-coef', 'Divide the coefficients too: ' + t('\\frac{' + o.k1 + '}{' + o.k2 + '}') + '.']);
    var mr = M(c, n, A * o.b); if (Math.abs(MV(mr) - MV(res)) > 1e-6) cands.push([MT(mr), LID + '-mult-rad', 'Divide the radicands (' + t(F(A) + '\\div ' + F(o.b)) + '), don’t multiply them.']);
    return mP(t(D(num, den)), res, { cands: cands, sol: t(D(num, den) + '=' + steps), hints: HR, text: text });
  }
  /* (k1 ⁿ√(s1ⁿ m)) / (k2 ⁿ√(s2ⁿ m)): the radicals simplify to like radicals */
  function divLike(o, text) {
    var n = o.n || 2, A = pw(o.s1, n) * o.m, Bv = pw(o.s2, n) * o.m, res = Q(o.k1 * o.s1, o.k2 * o.s2);
    var num = bareRoot(o.k1, A, n), den = bareRoot(o.k2, Bv, n);
    var mid = '\\frac{' + (o.k1 === 1 ? '' : o.k1 + '(') + o.s1 + rt(o.m, n) + (o.k1 === 1 ? '' : ')') + '}{' + (o.k2 === 1 ? '' : o.k2 + '(') + o.s2 + rt(o.m, n) + (o.k2 === 1 ? '' : ')') + '}';
    return radP(t(D(num, den)), qT(res), { cands: [[qT(Q(o.k2 * o.s2, o.k1 * o.s1)), 'flip', 'Upside down: the numerator’s radical goes on top.']].concat(o.k2 !== 1 ? [[qT(Q(o.s1, o.s2)), LID + '-coef', 'Include the coefficients ' + t(o.k1) + ' and ' + t(o.k2) + '.']] : []),
      sol: t(D(num, den) + '=' + mid + '=' + D(o.k1 * o.s1, o.k2 * o.s2) + (res[1] !== o.k2 * o.s2 || res[0] !== o.k1 * o.s1 ? '=' + qT(res) : '')), hints: ['Simplify each radical first: they become like radicals, which cancel.'], text: text });
  }
  /* numerator Σ a_i √(p_i d) over c√d (divide each term) */
  function divEach(terms, c, d, text, o) {
    o = o || {};
    var num = raw(terms.map(function (x) { return [x[0], x[1] * d]; })), den = bareRoot(c, d, 2);
    var A = sSc(S(terms), Q(1, c)), mid = raw(terms.map(function (x) { var q = Q(x[0], c); return [q[1] === 1 ? q[0] : NaN, x[1]]; }));
    var cands = [];
    if (terms.length > 1) { var one = sAdd(S([[Q(terms[0][0], c), terms[0][1]]]), S(terms.slice(1).map(function (x) { return [x[0], x[1] * d]; }))); cands.push([sTex(one), LID + '-one-term', 'The fraction bar divides <b>every</b> term of the numerator, not just the first one.']); }
    var midOk = !/NaN/.test(mid) && mid !== sTex(A);
    return sP(t(D(num, den)), A, { cands: cands, sol: t(D(num, den) + '=' + terms.map(function (x, i) { var s = D(raw([[Math.abs(x[0]), x[1] * d]]), den); return (i ? (x[0] < 0 ? '-' : '+') : x[0] < 0 ? '-' : '') + s; }).join('') + (midOk ? '=' + mid : '') + '=' + sTex(A)),
      hints: ['Split it into one fraction per term: ' + t('\\frac{a+b}{c}=\\frac{a}{c}+\\frac{b}{c}') + '.'], text: text });
  }
  /* rationalize N / (k√b) where N is a sum (list of [c, m]); radicands shown raw */
  function ratSq(N, k, b, text, o) {
    o = o || {};
    var num = o.numTex || raw(N), den = o.denTex || bareRoot(k, b, 2), sb = split(b, 2), A = sDiv(S(N), S([[k, b]]));
    var steps = [], top = sMul(S(N), S([[1, sb.r]])), dn = k * sb.s * sb.r;
    if (sb.s > 1) steps.push(D(num, (k * sb.s === 1 ? '' : k * sb.s) + rt(sb.r)));
    if (sb.r > 1) steps.push(D((N.length > 1 ? '(' + raw(N) + ')' : raw(N)) + '\\cdot' + rt(sb.r), (k * sb.s === 1 ? '' : k * sb.s) + rt(sb.r) + '\\cdot' + rt(sb.r)), D(sTex(top, { keep: true }), dn));
    var out = steps.join('=') + (D(sTex(top, { keep: true }), dn) === D(sTex(A), 1) ? '' : '=' + sTex(A));
    var cands = (o.cands || []).slice();
    if (sb.r > 1 && N.length === 1) { cands.push([sTex(sMul(S(N), S([[1, sb.r]]))), LID + '-no-den', 'You multiplied the numerator by ' + t(rt(sb.r)) + ' — the denominator was multiplied by it too: ' + t(rt(sb.r) + '\\cdot' + rt(sb.r) + '=' + sb.r) + '.']);
      if (k * sb.s > 1) cands.push([sTex(sSc(sMul(S(N), S([[1, sb.r]])), Q(1, k * k * sb.s * sb.s * sb.r))), LID + '-den-k2', 'Multiply by ' + t('\\frac{' + rt(sb.r) + '}{' + rt(sb.r) + '}') + ' only: the coefficient ' + t(k * sb.s) + ' in the denominator stays as it is (it isn’t squared).']); }
    if (N.length > 1 && sb.r > 1) { var oneM = sSc(sAdd(sMul(S([N[0]]), S([[1, sb.r]])), S(N.slice(1))), Q(1, dn)); cands.push([sTex(oneM), LID + '-one-term-mult', 'Multiply <b>every</b> term of the numerator by ' + t(rt(sb.r)) + '.']); }
    return sP(o.prompt || t(D(num, den)), A, { cands: cands, sol: t((o.lead || D(num, den)) + '=' + out), hints: o.hints || ['Multiply the numerator and the denominator by ' + t(rt(sb.r)) + (sb.s > 1 ? ' (simplify ' + t(rt(b)) + ' first)' : '') + '.'], text: text, before: o.before, after: o.after, unit: o.unit });
  }
  /* a / (k·ⁿ√b), n ≥ 3 (b may be negative for odd n) */
  function ratHi(a, k, n, b, text, o) {
    o = o || {};
    var rr = ratRoot(a, n, b), res = M(qd(R(a), [k * rr.B, 1]), n, rr.mult);
    var den = o.denTex || bareRoot(k, b, n), lead = o.lead || D(a, den);
    var sol = lead + '\\cdot' + D(rt(rr.mult, n), rt(rr.mult, n)) + '=' + D(a + rt(rr.mult, n), (k === 1 ? '' : k) + rt(Math.abs(b) * rr.mult * (b < 0 ? -1 : 1), n)) + '=' + D(a + rt(rr.mult, n), k * rr.B) + (MT(res) !== mTex(Q(a, k * rr.B), n, rr.mult) || Q(a, k * rr.B)[1] !== k * rr.B ? '=' + MT(res) : '');
    var cands = [];
    if (n === 3 && rr.mult !== Math.abs(b)) { var wr = M(qd(R(a), [k * (b < 0 ? -1 : 1) * Math.abs(b), 1]), 3, Math.abs(b)); cands.push([MT(wr), LID + '-cube-as-sq', t(rt(Math.abs(b), 3) + '\\cdot' + rt(Math.abs(b), 3) + '=' + rt(b * b, 3)) + ', not ' + t(Math.abs(b)) + '. For a cube root you need a perfect <b>cube</b> under the root.']); }
    return mP(o.prompt || t(lead), res, { cands: cands, radDen: 'Right value, but there is still a root in the denominator. Ask: what times ' + t(F(Math.abs(b))) + ' makes a perfect ' + (n === 3 ? 'cube' : n === 4 ? 'fourth power' : n + 'th power') + '?', sol: t(sol), hints: o.hints || ['What times ' + t(F(Math.abs(b))) + ' makes a perfect ' + (n === 3 ? 'cube' : 'fourth power') + '?'], text: text });
  }
  function sqf2(r, lo, hi, not) { return pickWhere(function () { return r.int(lo, hi); }, function (m) { return sqf(m) && (not || []).indexOf(m) < 0; }); }
  function prime(r, not) { return pickWhere(function () { return r.pick(PR); }, function (p) { return (not || []).indexOf(p) < 0; }); }
  function coprimeSqf(r, d, lo, hi, not) { return pickWhere(function () { return r.int(lo, hi); }, function (m) { return sqf(m) && gcd(m, d) === 1 && (not || []).indexOf(m) < 0; }); }

  /* ======================= the assignment ======================= */
  var QUESTIONS = [
    { num: '1', section: 'Assignment', stem: 'Divide and write in simplest form.', parts: [
      { id: '1a', level: 'BEG', make: function (r) { var z = pickWhere(function () { return { b: r.pick([2, 3, 5, 6, 7]), c: r.int(2, 9) }; }, function (z) { return z.c * z.c * z.b <= 300 && !(z.b === 2 && z.c === 6) && !(z.b === 3 && z.c === 4); }); return divMono({ q: z.c * z.c, b: z.b, k1: 1, k2: 1 }, '√(c²b) ÷ √b', 'BEG'); } },
      { id: '1b', level: 'BEG', make: function (r) { var z = pickWhere(function () { return { b: r.pick([2, 3, 5, 6, 7]), s: r.int(2, 3), m: r.pick([2, 3, 5, 6, 7]) }; }, function (z) { return z.m !== z.b && z.s * z.s * z.m * z.b <= 250 && !(z.b === 5 && z.s === 2 && z.m === 3); }); return divMono({ q: z.s * z.s * z.m, b: z.b, k1: 1, k2: 1 }, '√(qb) ÷ √b, quotient simplifies'); } },
      { id: '1c', level: 'BEG', make: function (r) { var z = pickWhere(function () { return { b: r.pick([2, 3, 5, 7]), m: r.pick([2, 3, 5, 6, 7, 10, 11]), k2: r.int(2, 6), q: r.int(2, 5) }; }, function (z) { return z.m !== z.b && gcd(z.m, z.b) === 1 && !(z.b === 7 && z.m === 6) && !(z.b === 6 && z.m === 7); }); return divMono({ q: z.m, b: z.b, k1: z.k2 * z.q, k2: z.k2 }, 'k√(mb) ÷ k√b'); } },
      { id: '1d', level: 'BEG', make: function (r) { var z = pickWhere(function () { return { b: r.pick([2, 3, 5, 7]), m: r.pick([2, 3, 5, 6, 7, 10, 11]), k2: r.int(2, 8), q: r.int(2, 5) }; }, function (z) { return z.m !== z.b && gcd(z.m, z.b) === 1 && !(z.b === 3 && z.m === 10); }); return divMono({ q: z.m, b: z.b, k1: -z.k2 * z.q, k2: z.k2 }, 'negative coefficient'); } },
      { id: '1e', level: 'EMG', make: function (r) { var z = pickWhere(function () { return { b: r.pick([2, 3, 4, 5, 6]), c: r.int(2, 5) }; }, function (z) { return z.c * z.c * z.c * z.b <= 800 && !(z.b === 2 && z.c === 5) && !(z.b === 3 && z.c === 4); }); return divMono({ n: 3, q: z.c * z.c * z.c, b: z.b, k1: 1, k2: 1 }, 'cube roots: quotient a perfect cube'); } },
      { id: '1f', level: 'EMG', make: function (r) { var z = pickWhere(function () { return { b: r.pick([2, 3, 5]), m: r.pick([2, 3, 5]), k2: r.int(2, 6), q: r.int(2, 4) }; }, function (z) { return z.m !== z.b && 8 * z.m * z.b <= 120 && !(z.b === 2 && z.m === 5) && !(z.b === 5 && z.m === 2); }); return divMono({ n: 3, q: 8 * z.m, b: z.b, k1: z.k2 * z.q, k2: z.k2 }, 'cube roots: quotient simplifies'); } }] },
    { num: '2', stem: 'Simplify. (The radicands do not divide evenly.)', parts: [
      { id: '2a', level: 'EMG', make: function (r) { var z = pickWhere(function () { return { m: r.pick([2, 3, 5, 6, 7]), s1: r.int(2, 7), s2: r.int(2, 6) }; }, function (z) { return z.s1 !== z.s2 && gcd(z.s1, z.s2) === 1 && !(z.m === 3 && z.s1 === 5 && z.s2 === 3) && !(z.m === 2 && z.s1 === 7 && z.s2 === 3); }); return divLike({ m: z.m, s1: z.s1, s2: z.s2, k1: 1, k2: 1 }, '√ ÷ √, like radicals, fraction'); } },
      { id: '2b', level: 'PRG', make: function (r) { var z = pickWhere(function () { return { m: r.pick([2, 3, 5]), s1: r.int(2, 8), s2: r.int(2, 5), k1: r.int(2, 6), k2: r.int(2, 6) }; }, function (z) { var q = Q(z.k1 * z.s1, z.k2 * z.s2); return z.s1 !== z.s2 && q[1] > 1 && pw(z.s1, 2) * z.m <= 200 && !(z.m === 2 && z.s1 === 8 && z.s2 === 5); }); return divLike(z, 'k√ ÷ k√, like radicals'); } },
      { id: '2c', level: 'PRG', make: function (r) { var z = pickWhere(function () { return { m: r.pick([3, 5, 6, 7]), s1: r.int(2, 5), s2: r.int(2, 5), k1: r.int(2, 12), k2: r.int(2, 9) }; }, function (z) { var q = Q(z.k1 * z.s1, z.k2 * z.s2); return z.s1 !== z.s2 && q[1] > 1 && q[0] !== 1 && !(z.m === 7 && z.s1 === 3 && z.s2 === 2 && z.k1 === 10 && z.k2 === 6); }); return divLike(z, 'k√ ÷ k√, like radicals (2)'); } },
      { id: '2d', level: 'PRG', make: function (r) { var z = pickWhere(function () { return { m: r.pick([2, 3, 4]), s1: r.int(2, 5), s2: r.int(2, 3), k1: r.int(1, 6) }; }, function (z) { return z.s1 !== z.s2 && !(z.m === 2 && z.s1 === 5 && z.s2 === 2) && !(z.m === 2 && z.s1 === 3 && z.s2 === 2 && z.k1 === 6); }); return divLike({ n: 3, m: z.m, s1: z.s1, s2: z.s2, k1: z.k1, k2: 1 }, 'cube roots, like radicals'); } },
      { id: '2e', level: 'PRG', make: function (r) {
        var z = pickWhere(function () { return { b: r.pick([2, 3, 5, 6, 7, 10, 12, 8]), c: r.int(2, 5), k1: r.int(2, 9), k2: r.int(2, 6) }; }, function (z) { var q = Q(z.k1 * z.c, z.k2); return q[1] > 1 && z.c * z.c * z.b <= 300 && !(z.b === 12 && z.c === 3 && z.k1 === 5 && z.k2 === 2); });
        var A = z.c * z.c * z.b, num = bareRoot(z.k1, A, 2), den = bareRoot(z.k2, z.b, 2), res = Q(z.k1 * z.c, z.k2);
        return radP(t(D(num, den)), qT(res), { cands: [[qT(Q(z.k1 * z.c * z.c, z.k2)), 'coef-power', 'Take the square root: ' + t('\\sqrt{' + (z.c * z.c) + '}=' + z.c) + '.']], sol: t(D(num, den) + '=\\frac{' + z.k1 + '}{' + z.k2 + '}\\sqrt{\\tfrac{' + A + '}{' + z.b + '}}=\\frac{' + z.k1 + '}{' + z.k2 + '}\\sqrt{' + (z.c * z.c) + '}=' + qT(res)), hints: HR, text: 'quotient a perfect square, fraction coefficient' });
      } }] },
    { num: '3', stem: 'Divide each term of the numerator by the denominator, and simplify.', parts: [
      { id: '3a', level: 'EMG', make: function (r) { var z = pickWhere(function () { return { d: r.pick([2, 3, 5, 6, 7]), p: r.pick([2, 3, 5, 7, 10, 11, 13]), q: r.pick([2, 3, 5, 7, 10, 11, 13]), s: r.pick([1, -1]) }; }, function (z) { return z.p !== z.q && gcd(z.p, z.d) === 1 && gcd(z.q, z.d) === 1 && z.p * z.d <= 80 && z.q * z.d <= 80 && !(z.d === 6 && (z.p === 11 || z.q === 11)) && !(z.d === 7); }); return divEach([[1, z.p], [z.s, z.q]], 1, z.d, 'divide each term, coefficients 1'); } },
      { id: '3b', level: 'EMG', make: function (r) { var z = pickWhere(function () { return { d: r.pick([3, 5, 7, 11]), p: r.pick([2, 3, 5, 6, 7]), q: r.pick([2, 3, 5, 6, 7]), c: r.int(2, 6), a: r.int(1, 4), b: r.int(1, 4) }; }, function (z) { return z.p !== z.q && gcd(z.p, z.d) === 1 && gcd(z.q, z.d) === 1 && z.a !== z.b && !(z.d === 7 && z.c === 5); }); return divEach([[z.a * z.c, z.p], [-z.b * z.c, z.q]], z.c, z.d, 'divide each term, k√ coefficients'); } },
      { id: '3c', level: 'PRG', make: function (r) { var z = pickWhere(function () { return { d: r.pick([2, 3, 5, 7]), p: r.pick([2, 3, 5, 6, 7, 10]), q: r.pick([2, 3, 5, 6, 7, 10, 11]), s: r.int(2, 3), c: r.int(2, 4), a: r.int(1, 3), b: r.int(1, 4) }; }, function (z) { return z.p !== z.q && gcd(z.p * z.q, z.d) === 1 && z.s * z.s * z.p * z.d <= 200 && !(z.d === 5 && z.p === 2 && z.q === 10); }); return divEach([[z.a * z.c, z.s * z.s * z.p], [z.b * z.c, z.q]], z.c, z.d, 'divide each term, a quotient simplifies'); } },
      { id: '3d', level: 'PRG', make: function (r) { var z = pickWhere(function () { return { d: r.pick([3, 5, 7, 11, 13]), p: r.pick([2, 3, 5, 6, 7]), q: r.pick([2, 3, 5, 6, 7]), c: r.int(2, 5), a: r.int(1, 4), b: r.int(1, 4) }; }, function (z) { return z.p !== z.q && gcd(z.p * z.q, z.d) === 1 && z.p * z.d <= 80 && z.q * z.d <= 80 && !(z.d === 11 && z.c === 3); }); return divEach([[z.a * z.c, z.p], [z.b * z.c, z.q], [-z.c, 1]], z.c, z.d, 'divide each of three terms'); } }] },
    { num: '4', stem: 'Rationalize the denominator and simplify.', parts: [
      { id: '4a', level: 'BEG', make: function (r) { var p = prime(r, [5, 3]); return ratSq([[1, 1]], 1, p, '1/√p'); } },
      { id: '4b', level: 'BEG', make: function (r) { var z = pickWhere(function () { return { p: r.pick([2, 3, 5, 6, 7]), k: r.int(2, 5) }; }, function (z) { return !(z.p === 2 && z.k === 4); }); return ratSq([[z.p * z.k, 1]], 1, z.p, 'p·k/√p'); } },
      { id: '4c', level: 'BEG', make: function (r) { var z = pickWhere(function () { return { a: r.pick([2, 3, 5, 6, 7]), p: r.pick([3, 5, 7, 11, 13]) }; }, function (z) { return z.a !== z.p && gcd(z.a, z.p) === 1 && !(z.a === 3 && z.p === 11) && !(z.a === 2 && z.p === 7); }); return ratSq([[1, z.a]], 1, z.p, '√a/√p'); } },
      { id: '4d', level: 'EMG', make: function (r) { var z = pickWhere(function () { return { a: r.int(3, 25), k: r.int(2, 5), p: r.pick([2, 3, 5, 6, 7]) }; }, function (z) { var q = Q(z.a, z.k * z.p); return q[1] > 1 && gcd(z.a, z.p) > 1 && !(z.a === 15 && z.k === 2 && z.p === 3) && !(z.a === 14 && z.k === 3 && z.p === 7); }); return ratSq([[z.a, 1]], z.k, z.p, 'a/(k√p)'); } },
      { id: '4e', level: 'EMG', make: function (r) { var z = pickWhere(function () { return { a: r.int(2, 20), k: r.int(2, 5), p: r.pick([2, 3, 5, 6, 7, 10]) }; }, function (z) { var q = Q(z.a, z.k * z.p); return q[1] > 1 && gcd(z.a, z.p) > 1 && !(z.a === 4 && z.k === 3 && z.p === 6) && !(z.a === 9 && z.k === 2 && z.p === 6); }); return ratSq([[-z.a, 1]], z.k, z.p, '−a/(k√p)'); } },
      { id: '4f', level: 'EMG', make: function (r) { var z = pickWhere(function () { return { s: r.int(2, 3), p: r.pick([2, 3, 5, 6, 7]), c: r.int(1, 4) }; }, function (z) { return !(z.s === 2 && z.p === 3 && z.c === 3) && !(z.s === 2 && z.p === 5 && z.c === 2); }); return ratSq([[z.c * z.s * z.p, 1]], 1, z.s * z.s * z.p, 'a/√(s²p): simplify first'); } },
      { id: '4g', level: 'PRG', make: function (r) { var z = pickWhere(function () { return { s: r.int(2, 3), p: r.pick([2, 3, 5, 7]), a: r.pick([2, 3, 5, 7, 11]), k: r.int(2, 6) }; }, function (z) { return z.a !== z.p && !(z.s === 2 && z.p === 2 && z.a === 5 && z.k === 2) && Q(z.k, z.s)[1] === 1; }); return ratSq([[z.k, z.a]], 1, z.s * z.s * z.p, 'k√a/√(s²p)'); } },
      { id: '4h', level: 'PRG', make: function (r) { var z = pickWhere(function () { return { s: r.int(2, 6), p: r.pick([2, 3, 5]) }; }, function (z) { return z.s * z.s * z.p <= 150 && !(z.s === 7); }); return ratSq([[z.s, 1]], 1, z.s * z.s * z.p, 's/√(s²p)'); } },
      { id: '4i', level: 'PRG', make: function (r) { var z = pickWhere(function () { return { a: r.pick([2, 3, 5]), b: r.pick([2, 3, 5, 7]), k1: r.int(2, 9), k2: r.int(2, 7) }; }, function (z) { return z.a !== z.b && Q(z.k1, z.k2 * z.b)[1] > 1 && gcd(z.k1, z.b) > 1 && !(z.a === 2 && z.b === 3 && z.k1 === 6 && z.k2 === 5); }); return ratSq([[z.k1, z.a]], z.k2, z.a * z.b, 'k√a/(k√(ab))', { hints: ['Divide the radicals first: ' + t('\\frac{\\sqrt{a}}{\\sqrt{ab}}=\\frac{1}{\\sqrt{b}}') + ', then rationalize.'] }); } }] },
    { num: '5', stem: 'Write each expression in simplest form (no fraction under a radical).', parts: [
      { id: '5a', level: 'EMG', make: function (r) { var z = pickWhere(function () { return { a: r.pick([2, 3, 5, 7]), b: r.pick([3, 5, 7, 11]) }; }, function (z) { return z.a < z.b && !(z.a === 2 && z.b === 3) && !(z.a === 5 && z.b === 8); }); return sqFrac(z.a, z.b, 1, 'EMG', '√(a/b)'); } },
      { id: '5b', level: 'EMG', make: function (r) { var z = pickWhere(function () { return { c: r.int(2, 5), b: r.pick([2, 3, 5, 6, 7, 10, 11]) }; }, function (z) { return !(z.c === 3 && z.b === 7) && gcd(z.c, z.b) === 1; }); return sqFrac(z.c * z.c, z.b, 1, 'EMG', '√(c²/b)'); } },
      { id: '5c', level: 'PRG', make: function (r) { var z = pickWhere(function () { return { a: r.pick([2, 3, 5, 7]), s: 2, b: r.pick([3, 5, 7]) }; }, function (z) { return z.a !== z.b && !(z.a === 5 && z.b === 3); }); return sqFrac(z.a, z.s * z.s * z.b, 1, 'PRG', '√(a/(s²b))'); } },
      { id: '5d', level: 'PRG', make: function (r) { var z = pickWhere(function () { return { a: r.pick([3, 5, 7]), b: 2, s: 2, k: r.pick([2, 4, 6, 8]) }; }, function (z) { return !(z.a === 3 && z.k === 4); }); return sqFrac(z.a, z.s * z.s * z.b, z.k, 'PRG', 'k√(a/(s²b))'); } },
      { id: '5e', level: 'PRG', make: function (r) { var z = pickWhere(function () { return { a: r.pick([2, 5, 7, 11]), b: r.pick([2, 3, 5]), s: 3, k: r.pick([3, 6, 9]) }; }, function (z) { return z.a !== z.b && gcd(z.a, z.b) === 1 && !(z.a === 7 && z.b === 2 && z.k === 6); }); return sqFrac(z.a, z.s * z.s * z.b, z.k, 'PRG', 'k√(a/(9b))'); } },
      { id: '5f', level: 'PRG', make: function (r) { var z = pickWhere(function () { return { p: r.int(2, 5), q: r.int(2, 5), g: r.pick([2, 3, 5]) }; }, function (z) { return z.p !== z.q && gcd(z.p, z.q) === 1 && !(z.p === 3 && z.q === 2 && z.g === 5); }); return sqFrac(z.p * z.p * z.g, z.q * z.q * z.g, -1, 'PRG', '−√(A/B) reduces to a perfect-square fraction'); } }] },
    { num: '6', stem: 'Rationalize the denominator and simplify.', parts: [
      { id: '6a', level: 'PRG', make: function (r) { var z = pickWhere(function () { return { a: r.int(2, 9), b: r.pick([2, 5, 6, 7, 11]), s: r.pick([1, -1]) }; }, function (z) { return gcd(z.a, z.b) === 1 && !(z.a === 5 && z.b === 3) && !(z.a === 4 && z.b === 2); }); return ratSq([[z.a, 1], [z.s, z.b]], 1, z.b, '(a ± √b)/√b'); } },
      { id: '6b', level: 'PRG', make: function (r) { var z = pickWhere(function () { return { d: r.pick([2, 3]), p: r.pick([5, 7, 11]), a: 2 * r.int(1, 4) }; }, function (z) { return z.a % z.d === 0 && !(z.d === 2 && z.p === 5 && z.a === 4); }); return ratSq([[1, z.d * z.p], [-z.a, 1]], 1, z.d, '(√(dp) − a)/√d'); } },
      { id: '6c', level: 'ADV', make: function (r) { var z = pickWhere(function () { return { d: r.pick([3, 5]), p: r.pick([2, 7]), k: r.int(2, 3), a: r.int(1, 4), b: r.int(1, 4) }; }, function (z) { var A = sDiv(S([[z.a * z.k, z.p], [z.b * z.k, z.p * z.d]]), S([[z.k, z.d]])); return sDen(A) > 1 && !(z.d === 3 && z.p === 2 && z.k === 3 && z.a === 2 && z.b === 1); }); return ratSq([[z.a * z.k, z.p], [z.b * z.k, z.p * z.d]], z.k, z.d, '(k√p + k√(pd))/(k√d)'); } },
      { id: '6d', level: 'ADV', make: function (r) { var z = pickWhere(function () { return { d: r.pick([3, 5, 7]), p: r.pick([2, 3, 5]), q: r.pick([2, 6, 3, 10]), b: r.int(1, 3) }; }, function (z) { var A = sDiv(S([[1, z.p * z.d], [-z.b, z.q]]), S([[2, z.d]])); return z.p !== z.d && gcd(z.q, z.d) === 1 && A.length === 2 && sDen(A) > 1 && !(z.d === 5 && z.p === 3 && z.q === 6 && z.b === 2); }); return ratSq([[1, z.p * z.d], [-z.b, z.q]], 2, z.d, '(√(pd) − b√q)/(2√d)'); } }] },
    { num: '7', shared: function (r) {
        return pickWhere(function () { return { d: r.pick([2, 3, 5]), p: r.pick([2, 3, 5, 7, 11]), q: r.pick([3, 5, 7, 11, 13]), c: r.int(2, 4), a: r.int(1, 4), b: r.int(1, 4), e: r.pick([3, 5, 7]) }; },
          function (z) { return z.p !== z.q && gcd(z.p * z.q, z.d) === 1 && z.e !== z.d && z.a !== z.b && (z.p * z.d) % z.e === 0 && (z.q * z.d) % z.e !== 0 && !(z.d === 2 && z.p === 5 && z.q === 7 && z.c === 3) && z.p * z.d <= 60 && z.q * z.d <= 60; });
      }, stem: function (z) { return 'Consider ' + t(D(raw([[z.a * z.c, z.p * z.d], [z.b * z.c, z.q * z.d]]), z.c + rt(z.d))) + '.'; }, parts: [
      { id: '7a', level: 'EMG', make: function (r, z) { var p = divEach([[z.a * z.c, z.p], [z.b * z.c, z.q]], z.c, z.d, 'consider: divide each term'); p.prompt = 'Simplify it by dividing each term of the numerator by the denominator.'; return p; } },
      { id: '7b', level: 'PRG', make: function (r, z) {
        var N = S([[z.a * z.c, z.p * z.d], [z.b * z.c, z.q * z.d]]), top = sMul(N, S([[1, z.d]])), A = sSc(top, Q(1, z.c * z.d)), nt = sTex(top, { keep: true }), num = raw([[z.a * z.c, z.p * z.d], [z.b * z.c, z.q * z.d]]);
        var p = B.fields('Now simplify it by rationalizing the denominator first: multiply by ' + t(D(rt(z.d), rt(z.d))) + '. The new denominator is ' + t(z.c + '(' + z.d + ')=' + z.c * z.d) + '. Give the new numerator (radicals in simplest form) and then the final answer. Do you get the same answer as in (a)?',
          [{ label: 'Numerator:', name: 'Numerator', mode: 'math', keys: KS, wide: true }, { label: 'Final answer:', name: 'Final', mode: 'math', keys: KS, wide: true }],
          [RX(nt, { cands: [[sTex(sAdd(sMul(S([[z.a * z.c, z.p * z.d]]), S([[1, z.d]])), S([[z.b * z.c, z.q * z.d]]))), LID + '-one-term-mult', 'Multiply <b>both</b> terms of the numerator by ' + t(rt(z.d)) + '.']] }), RX(sTex(A), {})], [nt, sTex(A)],
          'Numerator: ' + t(nt) + '<br>Final: ' + t(sTex(A)) + ' — the same answer as (a).',
          t(D('(' + num + ')' + rt(z.d), z.c + '(' + z.d + ')') + '=' + D(raw([[z.a * z.c, z.p * z.d * z.d], [z.b * z.c, z.q * z.d * z.d]]), z.c * z.d) + '=' + D(nt, z.c * z.d) + '=' + sTex(A)) + '. Yes — the same answer.', ['Multiply each term by ' + t(rt(z.d)) + ' and simplify: ' + t('\\sqrt{' + z.p * z.d + '}\\cdot\\sqrt{' + z.d + '}=\\sqrt{' + z.p * z.d * z.d + '}=' + z.d + '\\sqrt{' + z.p + '}') + '.'], 'consider: rationalize first');
        p.bad = [[sTex(sAdd(sMul(S([[z.a * z.c, z.p * z.d]]), S([[1, z.d]])), S([[z.b * z.c, z.q * z.d]]))), sTex(A)]]; return p;
      } },
      { id: '7c', level: 'PRG', make: function (r, z) {
        var den2 = z.c + rt(z.e), num = raw([[z.a * z.c, z.p * z.d], [z.b * z.c, z.q * z.d]]);
        return mcP(r, 'Why would dividing each term <b>not</b> work neatly for ' + t(D(num, den2)) + '?', [
          { html: t(F(z.q * z.d)) + ' is not divisible by ' + t(z.e) + ', so ' + t(D(z.b * z.c + rt(z.q * z.d), den2)) + ' leaves a fraction under a radical. Rationalizing works instead.', right: true },
          { html: 'Because the coefficient ' + t(z.c) + ' doesn’t divide the numerator’s coefficients.', why: t(z.c) + ' does divide ' + t(z.a * z.c) + ' and ' + t(z.b * z.c) + '. Look at the radicands: is ' + t(F(z.q * z.d)) + ' divisible by ' + t(z.e) + '?' },
          { html: 'Because you can never divide radicals with different radicands.', why: 'You can divide any radicals with the same index; the problem is a quotient that isn’t a whole number.' },
          { html: 'It does work: ' + t(D(rt(z.q * z.d), rt(z.e)) + '=' + rt(Math.round(z.q * z.d / z.e))) + '.', why: t(F(z.q * z.d) + '\\div ' + z.e) + ' isn’t a whole number.' }],
          t(F(z.p * z.d) + '\\div ' + z.e + '=' + (z.p * z.d / z.e)) + ' is fine, but ' + t(F(z.q * z.d) + '\\div ' + z.e) + ' isn’t a whole number, so that term would leave a fraction under the radical. Rationalize instead (part c).', ['Try dividing each radicand by ' + t(z.e) + '.'], 'consider: why dividing fails');
      } },
      { id: '7d', sub: 'c, simplify', level: 'MAS', make: function (r, z) { return ratSq([[z.a * z.c, z.p * z.d], [z.b * z.c, z.q * z.d]], z.c, z.e, 'consider: rationalize the other denominator', { prompt: 'Simplify ' + t(D(raw([[z.a * z.c, z.p * z.d], [z.b * z.c, z.q * z.d]]), z.c + rt(z.e))) + ' by rationalizing the denominator.' }); } }] },
    { num: '8', stem: 'Simplify and write in lowest terms.', parts: [
      { id: '8a', level: 'PRG', make: function (r) { var z = pickWhere(function () { return { p: r.pick([2, 3, 5]), q: r.pick([3, 5, 7]), a: r.int(2, 8), b: r.int(2, 8) }; }, function (z) { return z.p < z.q && z.a !== z.b && !(z.p === 2 && z.q === 3 && z.a === 6 && z.b === 4); }); var d = z.p * z.q; return divEach([[z.a, z.p], [-z.b, z.q]], 1, d, 'simplify (a√(dp) − b√(dq))/√d'); } },
      { id: '8b', level: 'PRG', make: function (r) {
        var z = pickWhere(function () { return { m: r.pick([2, 3, 5]), s1: r.int(2, 4), s2: r.int(2, 5), s3: r.int(2, 3), a: r.int(2, 9), b: r.int(2, 9), c: r.int(2, 5) }; }, function (z) { var v = z.a * z.s1 - z.b * z.s2; return z.s1 !== z.s2 && v > 0 && Q(v, z.c * z.s3)[1] > 1 && pw(z.s1, 2) * z.m <= 80 && pw(z.s2, 2) * z.m <= 80 && !(z.m === 3 && z.a === 14); });
        var v = z.a * z.s1 - z.b * z.s2, res = Q(v, z.c * z.s3), num = raw([[z.a, z.s1 * z.s1 * z.m], [-z.b, z.s2 * z.s2 * z.m]]), den = z.c + rt(z.s3 * z.s3 * z.m);
        return radP(t(D(num, den)), qT(res), { cands: [[qT(Q(z.a * z.s1 + z.b * z.s2, z.c * z.s3)), LID + '-sub-sign', 'Check the sign between the two terms: it’s a subtraction.']],
          sol: t(D(num, den) + '=' + D(raw([[z.a * z.s1, z.m], [-z.b * z.s2, z.m]]), z.c * z.s3 + rt(z.m)) + '=' + D(v + rt(z.m), z.c * z.s3 + rt(z.m)) + '=' + qT(res)), hints: ['Simplify every radical first — they are all like radicals.'], text: 'like radicals collect, then divide' });
      } },
      { id: '8c', level: 'ADV', make: function (r) {
        var z = pickWhere(function () { return { m: r.pick([2, 3, 5]), s: r.int(2, 4), c: r.int(1, 3), k: r.int(1, 3) }; }, function (z) { return z.s % z.c === 0 && !(z.m === 3 && z.s === 4 && z.c === 2); });
        var A0 = z.c * z.m * z.k * 2; // whole number on top, divisible by c·m
        var N = [[A0, 1], [-1, z.s * z.s * z.m]], A = sDiv(S(N), S([[z.c, z.m]]));
        return ratSq(N, z.c, z.m, 'simplify (A − √(s²m))/(c√m)');
      } }] },
    { num: '9', stem: 'Rationalize the denominator and simplify.', parts: [
      { id: '9a', level: 'EMG', make: function (r) { var z = pickWhere(function () { return { a: r.int(2, 9), p: r.pick([2, 3, 5, 7]) }; }, function (z) { return z.a % z.p !== 0 && !(z.a === 2 && z.p === 5) && !(z.a === 4 && z.p === 3); }); return ratHi(z.a, 1, 3, z.p, 'a/∛p'); } },
      { id: '9b', level: 'EMG', make: function (r) { var z = pickWhere(function () { return { k: r.int(2, 9), p: r.pick([2, 3, 5]) }; }, function (z) { return !(z.p === 2 && z.k === 6) && !(z.p === 5 && z.k === 2); }); return ratHi(z.k * z.p, 1, 3, z.p * z.p, 'p·k/∛(p²)'); } },
      { id: '9c', level: 'EMG', make: function (r) { var z = pickWhere(function () { return { a: r.int(2, 9), p: r.pick([2, 3, 5, 7]) }; }, function (z) { return z.a % z.p !== 0 && !(z.a === 5 && z.p === 3) && !(z.a === 10 && z.p === 5); }); return ratHi(z.a, 1, 3, z.p * z.p, 'a/∛(p²)'); } },
      { id: '9d', level: 'PRG', make: function (r) {
        var z = pickWhere(function () { return { a: r.pick([2, 3, 5, 7]), p: r.pick([2, 3, 5, 7]) }; }, function (z) { return z.a !== z.p && !(z.a === 2 && z.p === 3) && !(z.a === 3 && z.p === 4); });
        var rr = ratRoot(1, 3, z.p), res = M(Q(1, rr.B), 3, z.a * rr.mult), lead = '\\sqrt[3]{\\dfrac{' + z.a + '}{' + z.p + '}}';
        return mP(t(lead), res, { radDen: 'Right value, but there is still a cube root in the denominator. What times ' + t(z.p) + ' makes a perfect cube?', cands: [[MT(M(Q(1, z.p), 3, z.a * z.p)), LID + '-cube-as-sq', t('\\sqrt[3]{' + z.p + '}\\cdot\\sqrt[3]{' + z.p + '}=\\sqrt[3]{' + z.p * z.p + '}') + ', not ' + t(z.p) + '. Multiply by ' + t('\\sqrt[3]{' + z.p * z.p + '}') + ' to make a perfect cube.']],
          sol: t(lead + '=' + D(rt(z.a, 3), rt(z.p, 3)) + '\\cdot' + D(rt(rr.mult, 3), rt(rr.mult, 3)) + '=' + D(rt(z.a * rr.mult, 3), rt(z.p * rr.mult, 3)) + '=' + MT(res)), hints: ['Split it: ' + t('\\sqrt[3]{\\tfrac{a}{b}}=\\tfrac{\\sqrt[3]{a}}{\\sqrt[3]{b}}') + ', then make the denominator a perfect cube.'], text: '∛(a/p)' });
      } },
      { id: '9e', level: 'ADV', make: function (r) { var z = pickWhere(function () { return { s: r.int(2, 3), p: r.pick([2, 3]), k: r.int(1, 3) }; }, function (z) { return !(z.s === 2 && z.p === 2 && z.k === 2) && pw(z.s, 3) * z.p <= 81; }); var b = -pw(z.s, 3) * z.p, a = z.s * z.p * z.k; return ratHi(a, 1, 3, b, 'a/∛(negative)', { hints: ['Simplify first: ' + t('\\sqrt[3]{' + b + '}=' + (-z.s) + '\\sqrt[3]{' + z.p + '}') + '.'] }); } },
      { id: '9f', level: 'ADV', make: function (r) { var z = pickWhere(function () { return { p: r.pick([2, 3]), k: r.int(1, 5) }; }, function (z) { return !(z.p === 2 && z.k === 5) && !(z.p === 3 && z.k === 2); }); return ratHi(z.p * z.k, 1, 4, pw(z.p, 3), 'a/∜(p³)'); } }] },
    { num: '10', stem: 'Simplify. State the restrictions on the variable.', parts: [
      { id: '10a', level: 'PRG', make: function (r) {
        var z = pickWhere(function () { return { v: r.pick(['x', 'y', 'a']), b: r.pick([2, 3, 5, 6, 7]), s: r.int(2, 5), e: r.int(1, 2) }; }, function (z) { return z.s * z.s * z.b <= 150 && !(z.b === 7 && z.s === 3 && z.e === 1) && !(z.b === 5 && z.s === 3 && z.e === 2); });
        var v = z.v, num = '\\sqrt{' + z.s * z.s * z.b + v + '^{' + (2 * z.e + 1) + '}}', den = '\\sqrt{' + z.b + v + '}', key = z.s + (z.e === 1 ? v : v + '^{' + z.e + '}');
        return restrP(t(D(num, den)), v, [{ op: '>', v: 0 }], key, { kind: 'even', cands: [[z.s * z.s + (z.e === 1 ? v : v + '^{' + z.e + '}'), 'coef-power', 'Take the square root of ' + t(z.s * z.s) + ' too.'], [z.s + v + '^{' + 2 * z.e + '}', 'var-exp', 'Take the square root of ' + t(v + '^{' + 2 * z.e + '}') + ': it is ' + t(z.e === 1 ? v : v + '^{' + z.e + '}') + '.']],
          sol: t(v + '>0') + ' (the radicand in the denominator must be positive).<br>' + t(D(num, den) + '=\\sqrt{\\tfrac{' + z.s * z.s * z.b + v + '^{' + (2 * z.e + 1) + '}}{' + z.b + v + '}}=\\sqrt{' + z.s * z.s + v + '^{' + 2 * z.e + '}}=' + key), hints: ['A square root in a denominator needs a positive radicand.', 'Divide under one radical, then take the square root.'], text: 'restriction: √ ÷ √ with a variable' });
      } },
      { id: '10b', level: 'PRG', make: function (r) {
        var z = pickWhere(function () { return { v: r.pick(['x', 'y', 'a', 'm']), d: r.pick([2, 3, 5, 7]), p: r.pick([2, 3, 5, 7]), q: r.pick([2, 3, 5, 7, 11]) }; }, function (z) { return z.p !== z.q && gcd(z.p * z.q, z.d) === 1 && !(z.d === 5 && z.p === 2 && z.q === 3); });
        var v = z.v, num = '\\sqrt{' + z.p * z.d + v + '^{3}}+\\sqrt{' + z.q * z.d + v + '}', den = '\\sqrt{' + z.d + v + '}', key = v + '\\sqrt{' + z.p + '}+\\sqrt{' + z.q + '}';
        return restrP(t(D(num, den)), v, [{ op: '>', v: 0 }], key, { kind: 'even', cands: [['\\sqrt{' + z.p + '}+\\sqrt{' + z.q + '}', 'var-exp', 'Check the first term: ' + t('\\sqrt{' + z.p + v + '^{2}}=' + v + '\\sqrt{' + z.p + '}') + '.']],
          sol: t(v + '>0') + '<br>' + t(D(num, den) + '=\\sqrt{' + z.p + v + '^{2}}+\\sqrt{' + z.q + '}=' + key), hints: ['Divide each term by ' + t(den) + '.'], text: 'restriction: divide each term with a variable' });
      } },
      { id: '10c', level: 'PRG', make: function (r) {
        var z = pickWhere(function () { return { v: r.pick(['x', 'y', 'a']), k: r.pick([2, 3, 5, 6, 7]), m: r.int(1, 4) }; }, function (z) { return !(z.k === 2 && z.m === 2); });
        var v = z.v, a = z.k * z.m, num = String(a), den = '\\sqrt{' + z.k + v + '}', key = '\\frac{' + cT(z.m) + '\\sqrt{' + z.k + v + '}}{' + v + '}';
        if (z.m === 1) key = '\\frac{\\sqrt{' + z.k + v + '}}{' + v + '}';
        return restrP(t(D(num, den)), v, [{ op: '>', v: 0 }], key, { kind: 'even', radDen: 'Right value, but there is still a radical in the denominator. Multiply the top and bottom by ' + t(den) + '.', cands: [[a + '\\sqrt{' + z.k + v + '}', LID + '-no-den', t(den + '\\cdot' + den + '=' + z.k + v) + ': divide by it.']],
          sol: t(v + '>0') + '<br>' + t(D(num, den) + '\\cdot' + D(den, den) + '=' + D(a + '\\sqrt{' + z.k + v + '}', z.k + v) + '=' + key), hints: ['Multiply the top and bottom by ' + t(den) + '.'], text: 'restriction: a/√(kx)' });
      } },
      { id: '10d', level: 'PRG', make: function (r) {
        var z = pickWhere(function () { return { v: r.pick(['y', 'x', 'm']), k: r.pick([2, 3, 5, 6, 7, 10, 14, 15]), a: r.int(1, 9) }; }, function (z) { return !(z.k === 10 && z.a === 5) && !(z.k === 6 && z.a === 3) && Q(z.a, z.k)[0] !== 0 && z.a % z.k !== 0; });
        var v = z.v, num = cT(z.a) + v, den = '\\sqrt{' + z.k + v + '}', c = Q(z.a, z.k), rk = '\\sqrt{' + z.k + v + '}';
        var key = c[1] === 1 ? cT(c[0]) + rk : '\\frac{' + cT(c[0]) + rk + '}{' + c[1] + '}';
        return restrP(t(D(num, den)), v, [{ op: '>', v: 0 }], key, { kind: 'even', sol: t(v + '>0') + '<br>' + t(D(num, den) + '\\cdot' + D(den, den) + '=' + D(cT(z.a) + v + rk, z.k + v) + '=' + key), hints: ['Multiply the top and bottom by ' + t(den) + ', then cancel ' + t(v) + '.'], text: 'restriction: a·x/√(kx)' });
      } },
      { id: '10e', level: 'ADV', make: function (r) {
        var z = pickWhere(function () { return { v: r.pick(['m', 'y', 'x']), a: r.pick([3, 5, 7, 11]), b: r.pick([2, 3, 5, 7]) }; }, function (z) { return z.a !== z.b && !(z.a === 3 && z.b === 2) && !(z.a === 5 && z.b === 8); });
        var v = z.v, lead = '\\sqrt{\\dfrac{' + z.a + '}{' + z.b + v + '}}', key = '\\frac{\\sqrt{' + z.a * z.b + v + '}}{' + z.b + v + '}';
        return restrP(t(lead), v, [{ op: '>', v: 0 }], key, { kind: 'even', cands: [['\\frac{\\sqrt{' + z.a * z.b + v + '}}{' + z.b + '}', LID + '-var-lost', 'The denominator is ' + t('\\sqrt{' + z.b + v + '}\\cdot\\sqrt{' + z.b + v + '}=' + z.b + v) + ' — keep the ' + t(v) + '.']],
          sol: t(v + '>0') + '<br>' + t(lead + '=' + D('\\sqrt{' + z.a + '}', '\\sqrt{' + z.b + v + '}') + '\\cdot' + D('\\sqrt{' + z.b + v + '}', '\\sqrt{' + z.b + v + '}') + '=' + key), hints: ['Split the radical over the fraction, then rationalize.'], text: 'restriction: √(a/(b·x))' });
      } },
      { id: '10f', level: 'ADV', make: function (r) {
        var z = pickWhere(function () { return { v: r.pick(['x', 'a', 'n']), p: r.pick([2, 3, 5]), k: r.int(1, 4) }; }, function (z) { return !(z.p === 3 && z.k === 2) && !(z.p === 2 && z.k === 2); });
        var v = z.v, a = z.p * z.k, den = '\\sqrt[3]{' + z.p + v + '}', key = (z.k === 1 ? '\\frac{\\sqrt[3]{' + z.p * z.p + v + '^{2}}}{' + v + '}' : '\\frac{' + z.k + '\\sqrt[3]{' + z.p * z.p + v + '^{2}}}{' + v + '}');
        return restrP(t(D(a, den)), v, [{ op: '≠', v: 0 }], key, { kind: 'odd', radDen: 'Right value, but a cube root is still in the denominator. Multiply by ' + t('\\sqrt[3]{' + z.p * z.p + v + '^{2}}') + ' to make a perfect cube.', cands: [[(z.k === 1 ? '' : z.k) + '\\sqrt[3]{' + z.p + v + '}\\cdot\\frac{1}{' + v + '}', LID + '-cube-as-sq', t(den + '\\cdot' + den + '=\\sqrt[3]{' + z.p * z.p + v + '^{2}}') + ' — not a perfect cube yet.']],
          sol: t(v + '\\ne 0') + ' (a cube root can have a negative radicand; only the denominator can’t be 0).<br>' + t(D(a, den) + '\\cdot' + D('\\sqrt[3]{' + z.p * z.p + v + '^{2}}', '\\sqrt[3]{' + z.p * z.p + v + '^{2}}') + '=' + D(a + '\\sqrt[3]{' + z.p * z.p + v + '^{2}}', '\\sqrt[3]{' + pw(z.p, 3) + v + '^{3}}') + '=' + D(a + '\\sqrt[3]{' + z.p * z.p + v + '^{2}}', z.p + v) + '=' + key), hints: ['For a cube root, the radicand can be negative.', 'What times ' + t(z.p + v) + ' makes a perfect cube?'], text: 'restriction: a/∛(px)' });
      } }] },
    { num: '11', stem: '', parts: [
      { id: '11', level: 'PRG', make: function (r) {
        var z = pickWhere(function () { return { d: r.pick([2, 3, 5, 7]), p: r.pick([2, 3, 5, 6, 7, 11]), q: r.pick([2, 3, 5, 6, 7, 11]), u: r.int(1, 6), w: r.int(1, 6), k: r.pick([2, 4]) }; }, function (z) { return z.p !== z.q && gcd(z.p * z.q, z.d) === 1 && z.u !== z.w && !(z.d === 5 && z.u === 4 && z.w === 6); });
        var h = S([[z.u, z.p], [z.w, z.q]]), A = sSc(sMul(S([[z.k, z.d]]), h), Q(1, 2)), at = sTex(A), bt = z.k + rt(z.d);
        return sP('A triangular sail has an area of ' + t('(' + at + ')') + '&nbsp;m² and a base of ' + t(bt) + '&nbsp;m. Use ' + t('A=\\tfrac{1}{2}bh') + ' to determine the exact height of the sail.', h, { before: 'h =', after: '\\text{m}', unit: 'm',
          cands: [[sTex(sSc(h, Q(1, 2))), LID + '-half', 'Solve ' + t('A=\\tfrac12 bh') + ' for ' + t('h') + ': ' + t('h=\\tfrac{2A}{b}') + ' (don’t forget the 2).']],
          sol: t('h=\\frac{2A}{b}=' + D(sTex(sSc(A, 2)), bt) + '=' + sTex(h)) + '&nbsp;m', hints: ['Solve for ' + t('h') + ': ' + t('h=\\tfrac{2A}{b}') + '. Then divide each term.'], text: 'sail height' });
      } }] },
    { num: '12', stem: '', parts: [
      { id: '12', level: 'ADV', make: function (r) {
        var z = pickWhere(function () { return { a: r.pick([2, 3, 5, 6, 7, 10]), b: r.pick([3, 5, 6, 10, 14, 15]), c: r.int(1, 5), e: r.pick([2, 3, 5, 6, 7]) }; }, function (z) { return z.a !== z.b && !sqf(z.a * z.b) && !isPow(z.a * z.b, 2) && !(z.a === 6 && z.b === 15) && z.c > 1; });
        var h = S([[z.c, z.e]]), V = sMul(h, S([[1, z.a * z.b]])), vt = sTex(V), lw = split(z.a * z.b, 2);
        return sP('A rectangular box has a volume of ' + t(vt) + '&nbsp;cm³, a length of ' + t(rt(z.a)) + '&nbsp;cm and a width of ' + t(rt(z.b)) + '&nbsp;cm. Determine its exact height.', h, { before: 'h =', after: '\\text{cm}', unit: 'cm',
          sol: t('h=' + D(vt, rt(z.a) + '\\cdot' + rt(z.b)) + '=' + D(vt, rt(z.a * z.b)) + '=' + D(vt, (lw.s === 1 ? '' : lw.s) + rt(lw.r)) + '=' + sTex(h)) + '&nbsp;cm', hints: ['Volume = length × width × height, so divide the volume by ' + t(rt(z.a) + '\\cdot' + rt(z.b)) + '.'], text: 'box height' });
      } }] },
    { num: '13', stem: '', parts: [
      { id: '13', level: 'PRG', make: function (r) {
        var H = r.pick([3, 4, 5, 8, 9, 10, 12, 15]), s = S([[Q(2 * H, 3), 3]]), P = sSc(s, 3), sT = sTex(s), pT = sTex(P);
        var p = B.fields('The height of an equilateral triangle is ' + t('\\tfrac{\\sqrt{3}}{2}') + ' times its side length. An equilateral triangle has a height of ' + t(H) + '&nbsp;cm. Determine the exact side length and perimeter.',
          [{ label: 'Side:', name: 'Side', mode: 'math', keys: KS, after: '\\text{cm}' }, { label: 'Perimeter:', name: 'Perimeter', mode: 'math', keys: KS, after: '\\text{cm}' }],
          [RX(sT, { cands: [[sTex(S([[Q(H, 2), 3]])), LID + '-mult-ratio', 'The height is ' + t('\\tfrac{\\sqrt3}{2}') + ' times the side, so <b>divide</b> the height by ' + t('\\tfrac{\\sqrt3}{2}') + '.']] }), RX(pT, { cands: [[sTex(S([[Q(3 * H, 2), 3]])), LID + '-mult-ratio', 'Find the side first (divide by ' + t('\\tfrac{\\sqrt3}{2}') + '), then multiply by 3.']] })], [sT, pT],
          'Side ' + t(sT) + '&nbsp;cm, perimeter ' + t(pT) + '&nbsp;cm', t('\\tfrac{\\sqrt{3}}{2}s=' + H + '\\Rightarrow s=' + D(2 * H, '\\sqrt{3}') + '=' + D(2 * H + '\\sqrt{3}', 3) + '=' + sT) + '&nbsp;cm; ' + t('P=3(' + sT + ')=' + pT) + '&nbsp;cm', ['Solve ' + t('\\tfrac{\\sqrt3}{2}s=' + H) + ' for ' + t('s') + ', then rationalize.'], 'equilateral triangle side and perimeter');
        p.good = [[sAlt(s) || sT, pT]]; return p;
      } }] },
    { num: '14', stem: 'Solve each equation. Write ' + t('x') + ' in simplest form.', parts: [
      { id: '14a', level: 'EMG', make: function (r) { var z = pickWhere(function () { return { p: r.pick([2, 3, 5, 6, 7]), c: r.int(2, 21) }; }, function (z) { return !(z.p === 5 && z.c === 10) && (z.c % z.p === 0 || z.c < 10); }); var A = sDiv(S([[z.c, 1]]), S([[1, z.p]])); return sP(t('x' + rt(z.p) + '=' + z.c), A, { before: 'x =', cands: [[z.c + rt(z.p), LID + '-no-den', 'Divide by ' + t(rt(z.p)) + ' and rationalize: ' + t(D(z.c, rt(z.p)) + '\\cdot' + D(rt(z.p), rt(z.p))) + '.']], sol: t('x=' + D(z.c, rt(z.p)) + '=' + D(z.c + rt(z.p), z.p) + '=' + sTex(A)), hints: ['Divide both sides by ' + t(rt(z.p)) + ', then rationalize.'], text: 'solve x√p = c' }); } },
      { id: '14b', level: 'PRG', make: function (r) {
        var z = pickWhere(function () { return { m: r.pick([2, 3, 5, 6, 7]), s1: r.int(2, 5), s2: r.int(2, 6), op: r.pick(['-', '+']) }; }, function (z) { return z.s1 !== z.s2 && (z.op === '-' || z.s2 > z.s1) && z.s1 * z.s1 * z.m <= 180 && z.s2 * z.s2 * z.m <= 180 && !(z.m === 3 && z.s1 === 2 && z.s2 === 5); });
        var x = z.op === '-' ? z.s1 + z.s2 : z.s2 - z.s1, eq = 'x' + rt(z.m) + z.op + rt(z.s1 * z.s1 * z.m) + '=' + rt(z.s2 * z.s2 * z.m);
        return radP(t(eq), String(x), { before: 'x =', cands: [[String(z.op === '-' ? z.s2 - z.s1 : z.s1 + z.s2), LID + '-sub-sign', 'When you move ' + t(rt(z.s1 * z.s1 * z.m)) + ' to the other side, its sign changes.']],
          sol: t('x' + rt(z.m) + '=' + rt(z.s2 * z.s2 * z.m) + (z.op === '-' ? '+' : '-') + rt(z.s1 * z.s1 * z.m) + '=' + z.s2 + rt(z.m) + (z.op === '-' ? '+' : '-') + z.s1 + rt(z.m) + '=' + x + rt(z.m)) + ', so ' + t('x=' + x), hints: ['Simplify the radicals first: they are like radicals.'], text: 'solve x√m ± √ = √' });
      } },
      { id: '14c', level: 'ADV', make: function (r) { var z = pickWhere(function () { return { k: r.int(2, 5), p: r.pick([2, 3, 5, 7]), q: r.pick([2, 3, 5, 7, 11]) }; }, function (z) { return z.p !== z.q && !(z.k === 2 && z.p === 3 && z.q === 2); }); var A = sDiv(S([[1, z.q]]), S([[z.k, z.p]])); return sP(t(z.k + rt(z.p) + '\\,x-' + rt(z.q) + '=0'), A, { before: 'x =', sol: t('x=' + D(rt(z.q), z.k + rt(z.p)) + '=' + D(rt(z.p * z.q), z.k * z.p) + (sTex(A) !== '\\frac{' + rt(z.p * z.q) + '}{' + z.k * z.p + '}' ? '=' + sTex(A) : '')), hints: ['Get ' + t('x') + ' alone, then rationalize.'], text: 'solve k√p x − √q = 0' }); } }] },
    { num: '15', stem: '', parts: [
      { id: '15', level: 'ADV', make: function (r) {
        var z = pickWhere(function () { return { a: r.pick([3, 5, 7, 11]), b: r.pick([2, 3, 5]), k: r.int(2, 3) }; }, function (z) { return z.a !== z.b && !(z.a === 3 && z.b === 2); });
        var target = '\\dfrac{\\sqrt{' + z.a * z.b + '}}{' + z.b + '}';
        return mcP(r, 'Which expression is <b>not</b> equal to ' + t(target) + '?', [
          { html: t('\\sqrt{\\dfrac{' + z.a + '}{' + z.b + '}}'), why: t('\\sqrt{\\tfrac{' + z.a + '}{' + z.b + '}}=\\tfrac{\\sqrt{' + z.a + '}}{\\sqrt{' + z.b + '}}=\\tfrac{\\sqrt{' + z.a * z.b + '}}{' + z.b + '}') + ' — it is equal.' },
          { html: t(D(z.a, '\\sqrt{' + z.a * z.b + '}')), why: t('\\tfrac{' + z.a + '\\sqrt{' + z.a * z.b + '}}{' + z.a * z.b + '}=\\tfrac{\\sqrt{' + z.a * z.b + '}}{' + z.b + '}') + ' — it is equal.' },
          { html: t(D(z.k + '\\sqrt{' + z.a + '}', '\\sqrt{' + z.k * z.k * z.b + '}')), why: t('\\sqrt{' + z.k * z.k * z.b + '}=' + z.k + '\\sqrt{' + z.b + '}') + ', so it is ' + t('\\tfrac{\\sqrt{' + z.a + '}}{\\sqrt{' + z.b + '}}') + ' — equal.' },
          { html: t(D('\\sqrt{' + z.a + '}', z.b + '\\sqrt{' + z.b + '}')), right: true }],
          t(D('\\sqrt{' + z.a + '}', z.b + '\\sqrt{' + z.b + '}') + '=' + D('\\sqrt{' + z.a * z.b + '}', z.b + '(' + z.b + ')') + '=' + D('\\sqrt{' + z.a * z.b + '}', z.b * z.b)) + ', not ' + t(target) + '. The others simplify to ' + t(target) + '.', ['Rationalize each one and compare.'], 'which is not equal');
      } }] },
    { num: '16', stem: '', parts: [
      { id: '16', level: 'PRG', make: function (r) {
        var z = pickWhere(function () { return { p: r.pick([2, 3, 5, 7]), k: r.int(1, 4) }; }, function (z) { return !(z.p === 3 && z.k === 2) && !(z.p === 5 && z.k === 2); });
        var a = z.p * z.k, c = cT(z.k);
        return mcP(r, 'When ' + t(D(a, '\\sqrt[3]{' + z.p + '}')) + ' is written with a rational denominator, the result is', [
          { html: t(c + '\\sqrt[3]{' + z.p * z.p + '}'), right: true },
          { html: t(c + '\\sqrt[3]{' + z.p + '}'), why: 'Multiplying by ' + t('\\sqrt[3]{' + z.p + '}') + ' leaves ' + t('\\sqrt[3]{' + z.p * z.p + '}') + ' in the denominator — not a perfect cube.' },
          { html: t(a + '\\sqrt[3]{' + z.p * z.p + '}'), why: 'The denominator becomes ' + t('\\sqrt[3]{' + pw(z.p, 3) + '}=' + z.p) + ' — divide by it.' },
          { html: t(D(a + '\\sqrt[3]{' + z.p * z.p + '}', z.p * z.p)), why: 'The new denominator is ' + t('\\sqrt[3]{' + z.p + '}\\cdot\\sqrt[3]{' + z.p * z.p + '}=\\sqrt[3]{' + pw(z.p, 3) + '}=' + z.p) + ', not ' + t(z.p * z.p) + '.' }],
          'Multiply by ' + t(D('\\sqrt[3]{' + z.p * z.p + '}', '\\sqrt[3]{' + z.p * z.p + '}')) + ': ' + t(D(a + '\\sqrt[3]{' + z.p * z.p + '}', '\\sqrt[3]{' + pw(z.p, 3) + '}') + '=' + D(a + '\\sqrt[3]{' + z.p * z.p + '}', z.p) + '=' + c + '\\sqrt[3]{' + z.p * z.p + '}'), ['What times ' + t(z.p) + ' makes a perfect cube?'], 'cube-root denominator (MC)');
      } }] },
    { num: '17', stem: '', parts: [
      { id: '17', level: 'PRG', make: function (r) {
        var z = pickWhere(function () { return { c: r.int(2, 5), d: r.pick([2, 3, 5, 6, 7]), e: r.int(1, 2), v: r.pick(['x', 'y', 'a']) }; }, function (z) { return !(z.c === 2 && z.d === 5 && z.e === 1) && z.c * z.c * z.d <= 120; });
        var v = z.v, num = '\\sqrt{' + z.c * z.c * z.d + v + '^{' + (2 * z.e + 1) + '}}', den = '\\sqrt{' + z.d + v + '}', ve = z.e === 1 ? v : v + '^{' + z.e + '}', v2 = v + '^{' + 2 * z.e + '}';
        return mcP(r, 'For ' + t(v + '>0') + ', ' + t(D(num, den)) + ' simplifies to', [
          { html: t(z.c + ve), right: true },
          { html: t(z.c * z.c + ve), why: 'Take the square root of ' + t(z.c * z.c) + ' too.' },
          { html: t(z.c + v2), why: 'Take the square root of ' + t(v2) + ': it is ' + t(ve) + '.' },
          { html: t(z.c + ve + '\\sqrt{' + v + '}'), why: 'Divide first: ' + t(v + '^{' + (2 * z.e + 1) + '}\\div ' + v + '=' + v2) + ', a perfect square — no ' + t('\\sqrt{' + v + '}') + ' is left.' }],
          t(D(num, den) + '=\\sqrt{\\tfrac{' + z.c * z.c * z.d + v + '^{' + (2 * z.e + 1) + '}}{' + z.d + v + '}}=\\sqrt{' + z.c * z.c + v2 + '}=' + z.c + ve), ['Divide under one radical first.'], 'variable quotient (MC)');
      } }] },
    { num: '18', stem: '', parts: [
      { id: '18', level: 'MAS', make: function (r) {
        var z = pickWhere(function () { return { p: r.pick([2, 3, 5]), q: r.pick([2, 3, 5, 7]), j: r.int(1, 6), sw: r.chance(0.5) }; }, function (z) { var pq = z.p * z.q, a = z.j * (z.sw ? z.q : z.p) + (z.sw ? z.q : z.p), k = (a - (z.sw ? z.q : z.p)) / pq; return z.p !== z.q && k > 0 && Math.round(k * 10) === k * 10 && !(z.p * z.q === 6 && a === 12) && String(k).length <= 4; });
        var pq = z.p * z.q, num = z.sw ? z.q : z.p, den = z.sw ? z.p : z.q, a = z.j * num + num, k = (a - num) / pq;
        return nrP('The expression ' + t(D(a, '\\sqrt{' + pq + '}') + '-' + D('\\sqrt{' + num + '}', '\\sqrt{' + den + '}')) + ' can be written as ' + t('k\\sqrt{' + pq + '}') + '. The value of ' + t('k') + ', as a decimal, is ____.', k,
          [[(a + num) / pq, LID + '-sub-sign', 'It’s a subtraction: ' + t(D(a, pq) + '-' + D(1, den)) + '.'], [a / pq, LID + '-one-term', 'Rationalize the second fraction too: ' + t(D('\\sqrt{' + num + '}', '\\sqrt{' + den + '}') + '=' + D('\\sqrt{' + pq + '}', den)) + '.']],
          t(D(a + '\\sqrt{' + pq + '}', pq) + '-' + D('\\sqrt{' + pq + '}', den) + '=' + qT(Q(a, pq)) + '\\sqrt{' + pq + '}-' + qT(Q(1, den)) + '\\sqrt{' + pq + '}=' + qT(Q(a - num, pq)) + '\\sqrt{' + pq + '}') + ', so ' + t('k=' + k), ['Rationalize both fractions so they are both multiples of ' + t('\\sqrt{' + pq + '}') + '.'], 'NR: k√(pq)');
      } }] },
    { num: '19', stem: '', parts: [
      { id: '19', level: 'ADV', make: function (r) {
        var z = pickWhere(function () { return { s: r.int(2, 4), m: r.pick([2, 3, 5]), r2: r.pick([2, 3, 5, 7]), j: r.int(2, 6) }; }, function (z) { return z.r2 !== z.m && !(z.s === 3 && z.m === 2 && z.j === 4 && z.r2 === 3); });
        var a = z.j * z.s * z.m, k = z.j - 1, n1 = z.s * z.s * z.m;
        return nrP('If ' + t(D(a, '\\sqrt{' + n1 + '}') + '-' + D('\\sqrt{' + z.m * z.r2 + '}', '\\sqrt{' + z.r2 + '}') + '=k\\sqrt{' + z.m + '}') + ', then the value of ' + t('k') + ' is ____.', k,
          [[z.j + 1, LID + '-sub-sign', 'It’s a subtraction.'], [z.j, LID + '-one-term', 'Simplify the second fraction too: ' + t(D('\\sqrt{' + z.m * z.r2 + '}', '\\sqrt{' + z.r2 + '}') + '=\\sqrt{' + z.m + '}') + '.']],
          t(D(a, z.s + '\\sqrt{' + z.m + '}') + '-\\sqrt{' + z.m + '}=' + D(z.j * z.m, '\\sqrt{' + z.m + '}') + '-\\sqrt{' + z.m + '}=' + z.j + '\\sqrt{' + z.m + '}-\\sqrt{' + z.m + '}=' + k + '\\sqrt{' + z.m + '}') + ', so ' + t('k=' + k), ['Simplify ' + t('\\sqrt{' + n1 + '}') + ' first.'], 'NR: k√m');
      } }] }
  ];
  /* k·√(a/b) in simplest form (k = −1 for a negative) */
  function sqFrac(a, b, k, level, text) {
    var g = gcd(a, b), a2 = a / g, b2 = b / g, kk = k;
    var lead = (k === 1 ? '' : k === -1 ? '-' : k) + '\\sqrt{\\dfrac{' + a + '}{' + b + '}}';
    var A = sSc(sDiv(S([[1, a2]]), S([[1, b2]])), kk), sb = split(b2, 2), sa = split(a2, 2);
    var steps = [];
    if (g > 1) steps.push((k === 1 ? '' : k === -1 ? '-' : k) + '\\sqrt{\\tfrac{' + a2 + '}{' + b2 + '}}');
    steps.push(D((k === 1 ? '' : k === -1 ? '-' : k) + (sa.r === 1 ? sa.s : (sa.s === 1 ? '' : sa.s) + rt(sa.r)), (sb.s === 1 ? '' : sb.s) + (sb.r === 1 ? '' : rt(sb.r))));
    var cands = [[sTex(sSc(S([[1, a2]]), Q(kk, b2))), LID + '-root-top', 'The square root applies to the denominator too: ' + t('\\sqrt{\\tfrac{a}{b}}=\\tfrac{\\sqrt a}{\\sqrt b}') + '.']];
    return sP(t(lead), A, { cands: cands, sol: t(lead + '=' + steps.join('=') + '=' + sTex(A)), hints: ['Split it: ' + t('\\sqrt{\\tfrac{a}{b}}=\\tfrac{\\sqrt{a}}{\\sqrt{b}}') + (g > 1 ? ' (reduce the fraction first)' : '') + ', then rationalize.'], text: text });
  }

  /* ======================= the extra practice ======================= */
  var EXTRA = [
    { num: '1', section: 'A. Skills', stem: 'Divide and write in simplest form.', parts: [
      { id: 'e1a', level: 'BEG', make: function (r) { var z = pickWhere(function () { return { b: r.pick([2, 3, 5, 6, 7, 10, 11]), c: r.int(2, 6) }; }, function (z) { return z.c * z.c * z.b <= 200 && !(z.b === 11 && z.c === 3) && !(z.b === 3 && z.c === 4) && !(z.b === 2 && z.c === 6); }); return divMono({ q: z.c * z.c, b: z.b, k1: 1, k2: 1 }, '√(c²b) ÷ √b (extra)'); } },
      { id: 'e1b', level: 'BEG', make: function (r) { var z = pickWhere(function () { return { b: r.pick([2, 3, 5, 7]), m: r.pick([2, 3, 5, 6, 7, 11]), k2: r.int(2, 8), q: r.int(2, 5) }; }, function (z) { return z.m !== z.b && gcd(z.m, z.b) === 1 && !(z.b === 5 && z.m === 7 && z.k2 === 6) && !(z.b === 6); }); return divMono({ q: z.m, b: z.b, k1: z.k2 * z.q, k2: z.k2 }, 'k√ ÷ k√ (extra)'); } },
      { id: 'e1c', level: 'EMG', make: function (r) { var z = pickWhere(function () { return { b: r.pick([2, 4, 5]), s: r.int(2, 3), m: r.pick([2, 3, 5]) }; }, function (z) { return z.m !== z.b && !(z.b === 4 && z.s === 3 && z.m === 3) && pw(z.s, 3) * z.m * z.b <= 400; }); return divMono({ n: 3, q: pw(z.s, 3) * z.m, b: z.b, k1: 1, k2: 1 }, '∛ ÷ ∛, quotient simplifies (extra)'); } },
      { id: 'e1d', level: 'EMG', make: function (r) { var z = pickWhere(function () { return { b: r.pick([2, 3, 5, 10]), s: r.int(2, 3), m: r.pick([2, 3, 5]), k2: r.int(2, 5), q: r.int(2, 4) }; }, function (z) { return z.m !== z.b && gcd(z.m, z.b) === 1 && !(z.b === 10 && z.m === 2) && z.s * z.s * z.m * z.b <= 250; }); return divMono({ q: z.s * z.s * z.m, b: z.b, k1: z.k2 * z.q, k2: z.k2 }, 'k√ ÷ k√, quotient simplifies (extra)'); } },
      { id: 'e1e', level: 'BEG', make: function (r) { var z = pickWhere(function () { return { b: r.pick([3, 5, 7, 11]), m: r.pick([2, 3, 5, 6, 7]), k2: r.int(2, 6), q: r.int(2, 6) }; }, function (z) { return z.m !== z.b && gcd(z.m, z.b) === 1 && !(z.b === 11 && z.m === 6 && z.k2 === 5); }); return divMono({ q: z.m, b: z.b, k1: -z.k2 * z.q, k2: z.k2 }, 'negative k√ ÷ k√ (extra)'); } },
      { id: 'e1f', level: 'EMG', make: function (r) { var z = pickWhere(function () { return { b: r.pick([2, 3, 4]), c: r.int(2, 5), k2: r.int(2, 4), q: r.int(2, 3) }; }, function (z) { return pw(z.c, 3) * z.b <= 500 && !(z.b === 3 && z.c === 5); }); return divMono({ n: 3, q: pw(z.c, 3), b: z.b, k1: z.k2 * z.q, k2: z.k2 }, 'k∛ ÷ k∛, a whole number (extra)'); } }] },
    { num: '2', stem: 'Simplify.', parts: [
      { id: 'e2a', level: 'EMG', make: function (r) { var z = pickWhere(function () { return { m: r.pick([2, 3, 5, 6, 7]), s1: r.int(2, 6), s2: r.int(2, 5) }; }, function (z) { return z.s1 !== z.s2 && gcd(z.s1, z.s2) === 1 && !(z.m === 2 && z.s1 === 5 && z.s2 === 3); }); return divLike({ m: z.m, s1: z.s1, s2: z.s2, k1: 1, k2: 1 }, 'like radicals ÷ (extra)'); } },
      { id: 'e2b', level: 'PRG', make: function (r) { var z = pickWhere(function () { return { m: r.pick([2, 3, 5, 7]), s1: r.int(2, 4), s2: r.int(2, 4), k1: r.int(2, 9), k2: r.int(2, 9) }; }, function (z) { return z.s1 !== z.s2 && !(z.m === 5 && z.k1 === 6 && z.k2 === 4); }); return divLike(z, 'k√ ÷ k√ like radicals (extra)'); } },
      { id: 'e2c', level: 'PRG', make: function (r) { var z = pickWhere(function () { return { m: r.pick([2, 3, 4, 5]), s1: r.int(2, 5), s2: r.int(2, 5) }; }, function (z) { return z.s1 !== z.s2 && gcd(z.s1, z.s2) === 1 && pw(Math.max(z.s1, z.s2), 3) * z.m <= 500 && !(z.m === 3 && z.s1 === 2 && z.s2 === 3); }); return divLike({ n: 3, m: z.m, s1: z.s1, s2: z.s2, k1: 1, k2: 1 }, 'cube roots, like radicals (extra)'); } }] },
    { num: '3', stem: 'Rationalize the denominator and simplify.', parts: [
      { id: 'e3a', level: 'BEG', make: function (r) { var z = pickWhere(function () { return { a: r.int(2, 9), p: r.pick([2, 3, 5, 7, 11]) }; }, function (z) { return z.a % z.p !== 0 && !(z.a === 3 && z.p === 7) && !(z.a === 5 && z.p === 3); }); return ratSq([[z.a, 1]], 1, z.p, 'a/√p (extra)'); } },
      { id: 'e3b', level: 'BEG', make: function (r) { var z = pickWhere(function () { return { p: r.pick([2, 3, 5, 6, 7]), k: r.int(2, 6) }; }, function (z) { return !(z.p === 5 && z.k === 2) && !(z.p === 2 && z.k === 4); }); return ratSq([[z.p * z.k, 1]], 1, z.p, 'pk/√p (extra)'); } },
      { id: 'e3c', level: 'BEG', make: function (r) { var z = pickWhere(function () { return { a: r.pick([2, 3, 5, 7]), p: r.pick([3, 5, 6, 7, 10]) }; }, function (z) { return z.a !== z.p && gcd(z.a, z.p) === 1 && !(z.a === 5 && z.p === 6); }); return ratSq([[1, z.a]], 1, z.p, '√a/√p (extra)'); } },
      { id: 'e3d', level: 'EMG', make: function (r) { var z = pickWhere(function () { return { a: r.int(3, 21), k: r.int(2, 4), p: r.pick([2, 3, 5, 7]) }; }, function (z) { return z.a % z.p === 0 && Q(z.a, z.k * z.p)[1] > 1 && !(z.a === 9 && z.k === 2 && z.p === 3); }); return ratSq([[z.a, 1]], z.k, z.p, 'a/(k√p) (extra)'); } },
      { id: 'e3e', level: 'EMG', make: function (r) { var z = pickWhere(function () { return { s: r.int(2, 3), p: r.pick([2, 3, 5]), c: r.int(1, 5) }; }, function (z) { return !(z.s === 2 && z.p === 2 && z.c === 5); }); return ratSq([[z.c * z.s * z.p, 1]], 1, z.s * z.s * z.p, 'a/√(s²p) (extra)'); } },
      { id: 'e3f', level: 'EMG', make: function (r) { var z = pickWhere(function () { return { a: r.pick([3, 5, 7, 11]), b: r.pick([6, 10, 14, 15]) }; }, function (z) { return gcd(z.a, z.b) === 1 && !(z.a === 7 && z.b === 10); }); return sqFrac(z.a, z.b, 1, 'EMG', '√(a/b) (extra)'); } },
      { id: 'e3g', level: 'EMG', make: function (r) { var p = prime(r, [7]); return ratHi(1, 1, 3, p, '1/∛p (extra)'); } },
      { id: 'e3h', level: 'PRG', make: function (r) { var z = pickWhere(function () { return { p: r.pick([2, 3, 5, 7]), k: r.int(2, 5) }; }, function (z) { return !(z.p === 3 && z.k === 3); }); return ratHi(z.p * z.k, 1, 3, z.p, 'pk/∛p (extra)'); } },
      { id: 'e3i', level: 'PRG', make: function (r) { var z = pickWhere(function () { return { p: r.pick([2, 3]), k: r.int(1, 4) }; }, function (z) { return !(z.p === 2 && z.k === 1); }); return ratHi(z.p * z.k, 1, 4, z.p, 'a/∜p (extra)'); } }] },
    { num: '4', stem: 'Divide each term of the numerator by the denominator.', parts: [
      { id: 'e4a', level: 'EMG', make: function (r) { var z = pickWhere(function () { return { d: r.pick([2, 3, 5, 7]), p: r.pick([2, 3, 6, 7, 11]), c: r.int(2, 4) }; }, function (z) { return gcd(z.p, z.d) === 1 && z.p !== z.c * z.c && !(z.d === 5 && z.p === 6 && z.c === 2); }); return divEach([[1, z.p], [-1, z.c * z.c]], 1, z.d, 'divide each term, one becomes rational (extra)'); } },
      { id: 'e4b', level: 'EMG', make: function (r) { var z = pickWhere(function () { return { d: r.pick([5, 7, 11]), p: r.pick([2, 3, 6]), q: r.pick([2, 3, 5]), c: r.int(2, 6), a: r.int(1, 4), b: r.int(1, 4) }; }, function (z) { return z.p !== z.q && gcd(z.p * z.q, z.d) === 1 && !(z.d === 7 && z.c === 6); }); return divEach([[z.a * z.c, z.p], [z.b * z.c, z.q]], z.c, z.d, 'divide each term (extra)'); } }] },
    { num: '5', section: 'B. Applying', stem: 'Simplify fully.', parts: [
      { id: 'e5a', level: 'PRG', make: function (r) { var z = pickWhere(function () { return { d: r.pick([2, 3]), a: r.int(2, 9), s: 2, p: r.pick([3, 5, 7]) }; }, function (z) { return z.a % z.d === 0 && !(z.d === 2 && z.a === 8 && z.p === 3); }); return ratSq([[z.a, 1], [-1, z.s * z.s * z.p]], 1, z.d, '(a − √(4p))/√d (extra)'); } },
      { id: 'e5b', level: 'PRG', make: function (r) {
        var z = pickWhere(function () { return { m: r.pick([2, 3, 5]), s1: r.int(1, 4), s2: r.int(2, 5), s3: r.int(2, 3) }; }, function (z) { return z.s1 !== z.s2 && z.s3 !== z.s1 && z.s3 !== z.s2 && (z.s1 > 1 || z.s2 > 1) && !(z.m === 2 && z.s1 === 3 && z.s2 === 5 && z.s3 === 2); });
        var v = z.s1 + z.s2, res = Q(v, z.s3), num = raw([[1, z.s1 * z.s1 * z.m], [1, z.s2 * z.s2 * z.m]]), den = rt(z.s3 * z.s3 * z.m);
        return radP(t(D(num, den)), qT(res), { sol: t(D(num, den) + '=' + D(raw([[z.s1, z.m], [z.s2, z.m]]), z.s3 + rt(z.m)) + '=' + D(v + rt(z.m), z.s3 + rt(z.m)) + '=' + qT(res)), hints: ['Simplify each radical: they are all like radicals.'], text: 'like radicals ÷ like radical (extra)' });
      } },
      { id: 'e5c', level: 'PRG', make: function (r) { var z = pickWhere(function () { return { d: r.pick([3, 5]), a: r.int(1, 4), b: r.int(1, 3), p: r.pick([2, 7, 11]) }; }, function (z) { return !(z.d === 3 && z.a === 3 && z.b === 3); }); return ratSq([[z.a * z.d, 1], [-z.b * z.d, z.p * z.d]], 1, z.d, '(a − b√(pd))/√d (extra)'); } }] },
    { num: '6', stem: 'Simplify. State the restrictions on the variable.', parts: [
      { id: 'e6a', level: 'PRG', make: function (r) {
        var z = pickWhere(function () { return { v: r.pick(['a', 'x', 'y']), b: r.pick([2, 3, 5, 6, 7]), s: r.int(2, 5) }; }, function (z) { return !(z.b === 3 && z.s === 4) && z.s * z.s * z.b <= 150; });
        var v = z.v, num = '\\sqrt{' + z.s * z.s * z.b + v + '^{5}}', den = '\\sqrt{' + z.b + v + '}', key = z.s + v + '^{2}';
        return restrP(t(D(num, den)), v, [{ op: '>', v: 0 }], key, { kind: 'even', cands: [[z.s + v + '^{4}', 'var-exp', 'Take the square root of ' + t(v + '^{4}') + ': ' + t(v + '^{2}') + '.']], sol: t(v + '>0') + '<br>' + t(D(num, den) + '=\\sqrt{' + z.s * z.s + v + '^{4}}=' + key), hints: ['Divide under one radical.'], text: 'restriction: √(c²b x⁵)/√(bx) (extra)' });
      } },
      { id: 'e6b', level: 'PRG', make: function (r) {
        var z = pickWhere(function () { return { v: r.pick(['x', 'y', 'm']), k: r.pick([2, 3, 5, 6, 7]), m: r.int(2, 4) }; }, function (z) { return !(z.k === 5 && z.m === 2); });
        var v = z.v, a = z.k * z.m, den = '\\sqrt{' + z.k + v + '}', key = '\\frac{' + z.m + '\\sqrt{' + z.k + v + '}}{' + v + '}';
        return restrP(t(D(a, den)), v, [{ op: '>', v: 0 }], key, { kind: 'even', cands: [[a + '\\sqrt{' + z.k + v + '}', LID + '-no-den', 'Divide by ' + t(den + '\\cdot' + den + '=' + z.k + v) + '.']], sol: t(v + '>0') + '<br>' + t(D(a, den) + '\\cdot' + D(den, den) + '=' + D(a + '\\sqrt{' + z.k + v + '}', z.k + v) + '=' + key), hints: ['Multiply the top and bottom by ' + t(den) + '.'], text: 'restriction: a/√(kx) (extra)' });
      } },
      { id: 'e6c', level: 'ADV', make: function (r) {
        var z = pickWhere(function () { return { v: r.pick(['y', 'x', 'm']), a: r.pick([2, 5, 7, 11]), b: r.pick([3, 5, 7]) }; }, function (z) { return z.a !== z.b && !(z.a === 7 && z.b === 3); });
        var v = z.v, lead = '\\sqrt{\\dfrac{' + z.a + '}{' + z.b + v + '}}', key = '\\frac{\\sqrt{' + z.a * z.b + v + '}}{' + z.b + v + '}';
        return restrP(t(lead), v, [{ op: '>', v: 0 }], key, { kind: 'even', sol: t(v + '>0') + '<br>' + t(lead + '=' + D('\\sqrt{' + z.a + '}\\cdot\\sqrt{' + z.b + v + '}', z.b + v) + '=' + key), hints: ['Split the radical, then multiply by ' + t('\\sqrt{' + z.b + v + '}') + '.'], text: 'restriction: √(a/(bx)) (extra)' });
      } },
      { id: 'e6d', level: 'ADV', make: function (r) {
        var z = pickWhere(function () { return { v: r.pick(['x', 'a', 'n']), p: r.pick([2, 3, 5]), k: r.int(1, 4) }; }, function (z) { return !(z.p === 3 && z.k === 3); });
        var v = z.v, a = z.p * z.k, den = '\\sqrt[3]{' + z.p + v + '^{2}}', mlt = '\\sqrt[3]{' + z.p * z.p + v + '}', key = '\\frac{' + cT(z.k) + '\\sqrt[3]{' + z.p * z.p + v + '}}{' + v + '}';
        return restrP(t(D(a, den)), v, [{ op: '≠', v: 0 }], key, { kind: 'odd', radDen: 'Right value, but a cube root is still in the denominator. Multiply by ' + t(mlt) + ' to make a perfect cube.', sol: t(v + '\\ne 0') + '<br>' + t(D(a, den) + '\\cdot' + D(mlt, mlt) + '=' + D(a + mlt, '\\sqrt[3]{' + pw(z.p, 3) + v + '^{3}}') + '=' + D(a + mlt, z.p + v) + '=' + key), hints: ['For a cube root only the denominator matters: it can’t be 0.', 'What times ' + t(z.p + v + '^{2}') + ' makes a perfect cube?'], text: 'restriction: a/∛(px²) (extra)' });
      } }] },
    { num: '7', stem: '', parts: [
      { id: 'e7', level: 'PRG', make: function (r) {
        var z = pickWhere(function () { return { c: 2 * r.int(1, 5), p: r.pick([3, 5, 7, 11]) }; }, function (z) { return !(z.c === 4 && z.p === 3); });
        var s = S([[Q(z.c, 2), 2 * z.p]]), sT = sTex(s), area = Q(z.c * z.c * z.p, 2);
        var p = B.fields('A square has a diagonal of ' + t(z.c + '\\sqrt{' + z.p + '}') + '&nbsp;m. Its side is the diagonal divided by ' + t('\\sqrt{2}') + '. Determine the exact side length and the area.',
          [{ label: 'Side:', name: 'Side', mode: 'math', keys: KS, after: '\\text{m}' }, { label: 'Area:', name: 'Area', mode: 'math', keys: KS, after: '\\text{m}^2' }],
          [RX(sT, { cands: [[sTex(S([[z.c, 2 * z.p]])), LID + '-no-den', t('\\sqrt2\\cdot\\sqrt2=2') + ': divide by it.']] }), RX(qT(area), { cands: [[qT(Q(z.c * z.c * z.p, 1)), LID + '-area-diag', 'That’s the diagonal squared. Square the side.']] })], [sT, qT(area)],
          'Side ' + t(sT) + '&nbsp;m, area ' + t(qT(area)) + '&nbsp;m²', t('s=' + D(z.c + '\\sqrt{' + z.p + '}', '\\sqrt{2}') + '=' + D(z.c + '\\sqrt{' + 2 * z.p + '}', 2) + '=' + sT) + '&nbsp;m; ' + t('A=(' + sT + ')^2=' + qT(area)) + '&nbsp;m²', ['Rationalize ' + t(D(z.c + '\\sqrt{' + z.p + '}', '\\sqrt2')) + '.'], 'square: side and area from the diagonal (extra)');
        return p;
      } }] },
    { num: '8', stem: '', parts: [
      { id: 'e8', level: 'PRG', make: function (r) {
        var z = pickWhere(function () { return { k: r.int(2, 4), w: r.pick([2, 3, 5]), L: r.int(2, 12), l: r.pick([2, 3, 5, 7]) }; }, function (z) { return z.w !== z.l && !(z.k === 2 && z.w === 3 && z.L === 12 && z.l === 2); });
        var len = S([[z.L, z.l]]), wid = S([[z.k, z.w]]), A = sMul(len, wid), P = sSc(sAdd(len, wid), 2), aT = sTex(A);
        var p = B.fields('A rectangular patio has an area of ' + t(aT) + '&nbsp;m² and a width of ' + t(sTex(wid)) + '&nbsp;m. Determine the exact length and perimeter.',
          [{ label: 'Length:', name: 'Length', mode: 'math', keys: KS, after: '\\text{m}' }, { label: 'Perimeter:', name: 'Perimeter', mode: 'math', keys: KS, after: '\\text{m}' }],
          [RX(sTex(len)), RX(sTex(P), { cands: [[sTex(sAdd(len, wid)), LID + '-half-p', 'The perimeter has two lengths and two widths.']] })], [sTex(len), sTex(P)],
          'Length ' + t(sTex(len)) + '&nbsp;m, perimeter ' + t(sTex(P)) + '&nbsp;m', t('\\ell=' + D(aT, sTex(wid)) + '=' + sTex(len)) + '&nbsp;m; ' + t('P=2(' + sTex(len) + ')+2(' + sTex(wid) + ')=' + sTex(P)) + '&nbsp;m', ['Length = area ÷ width.'], 'patio length and perimeter (extra)');
        p.good = [[sTex(len), sAlt(P)]]; return p;
      } }] },
    { num: '9', stem: '', parts: [
      { id: 'e9', level: 'ADV', make: function (r) {
        var z = pickWhere(function () { return { p: r.pick([2, 3, 5]), q: r.pick([2, 3, 5, 7]), s1: r.int(1, 4), s2: r.int(2, 5) }; }, function (z) { return z.p !== z.q && z.s1 !== z.s2 && !(z.p === 5 && z.q === 2 && z.s1 === 2 && z.s2 === 3); });
        var tot = z.s1 + z.s2, A = sDiv(S([[tot, z.p]]), S([[1, z.p * z.q]])), eq = 'x\\sqrt{' + z.p * z.q + '}=' + raw([[1, z.s1 * z.s1 * z.p], [1, z.s2 * z.s2 * z.p]]);
        return sP(t(eq), A, { before: 'x =', sol: t('x\\sqrt{' + z.p * z.q + '}=' + raw([[z.s1, z.p], [z.s2, z.p]]) + '=' + tot + '\\sqrt{' + z.p + '}') + ', so ' + t('x=' + D(tot + '\\sqrt{' + z.p + '}', '\\sqrt{' + z.p * z.q + '}') + '=' + D(tot, '\\sqrt{' + z.q + '}') + '=' + sTex(A)), hints: ['Simplify and collect the right side first.'], text: 'solve x√(pq) = √ + √ (extra)' });
      } }] },
    { num: '10', stem: '', parts: [
      { id: 'e10', level: 'PRG', make: function (r) {
        var z = pickWhere(function () { return { a: r.pick([2, 3, 5]), b: r.pick([3, 5, 7]), c: r.int(2, 5), s: r.int(2, 3), m: r.pick([2, 3, 5]) }; }, function (z) { return z.a !== z.b && gcd(z.c, z.b) === 1 && !(z.a === 2 && z.b === 3); });
        return mcP(r, 'Which expression is in simplest form?', [
          { html: t('\\sqrt{\\dfrac{' + z.a + '}{' + z.b + '}}'), why: 'It has a fraction under the radical.' },
          { html: t(D(z.c, '\\sqrt{' + z.a + '}')), why: 'It has a radical in the denominator.' },
          { html: t(D('\\sqrt{' + z.a * z.b + '}', z.b)), right: true },
          { html: t(D('\\sqrt{' + z.s * z.s * z.m + '}', z.s)), why: t('\\sqrt{' + z.s * z.s * z.m + '}') + ' has a perfect-square factor: ' + t(D('\\sqrt{' + z.s * z.s * z.m + '}', z.s) + '=\\sqrt{' + z.m + '}') + '.' }],
          t(D('\\sqrt{' + z.a * z.b + '}', z.b)) + ' is in simplest form. The others have a fraction under a radical, a radical in the denominator, or a perfect-square factor under the radical.', ['Check each rule: no fraction under a radical, no radical in a denominator, no perfect-square factor.'], 'which is in simplest form');
      } }] },
    { num: '11', stem: '', parts: [
      { id: 'e11', level: 'ADV', make: function (r) {
        var z = pickWhere(function () { return { a: r.pick([3, 5, 7]), s: r.int(2, 3), b: r.pick([2, 3, 5, 7]) }; }, function (z) { return z.a !== z.b && !(z.a === 3 && z.s === 2 && z.b === 2); });
        var A = z.a * z.b, Bv = z.s * z.b;
        return nrP('In simplest form, ' + t(D('\\sqrt{' + z.a + '}', '\\sqrt{' + z.s * z.s * z.b + '}') + '=' + D('\\sqrt{a}', 'b')) + ', where ' + t('a') + ' and ' + t('b') + ' are whole numbers. The value of ' + t('a+b') + ' is ____.', A + Bv,
          [[A + z.s * z.s * z.b, LID + '-den-sq', 'Simplify ' + t('\\sqrt{' + z.s * z.s * z.b + '}=' + z.s + '\\sqrt{' + z.b + '}') + ' first; the denominator becomes ' + t(z.s + '(' + z.b + ')') + '.']],
          t(D('\\sqrt{' + z.a + '}', z.s + '\\sqrt{' + z.b + '}') + '\\cdot' + D('\\sqrt{' + z.b + '}', '\\sqrt{' + z.b + '}') + '=' + D('\\sqrt{' + A + '}', Bv)) + ', so ' + t('a=' + A + ',\\ b=' + Bv) + ' and ' + t('a+b=' + (A + Bv)), ['Simplify the denominator, then rationalize.'], 'NR: √a/b');
      } }] },
    { num: '12', section: 'C. Stretch', stem: '', parts: [
      { id: 'e12', level: 'MAS', make: function (r) {
        var z = pickWhere(function () { return { p: r.pick([2, 3, 5, 7]), s: r.int(2, 4), u: r.int(3, 5) }; }, function (z) { return z.s < z.u && !(z.p === 2 && z.s === 2 && z.u === 3); });
        var A = S([[Q(1, z.p), z.p], [Q(1, z.s * z.p), z.p], [Q(1, z.u * z.p), z.p]]), lead = D(1, rt(z.p)) + '+' + D(1, rt(z.s * z.s * z.p)) + '+' + D(1, rt(z.u * z.u * z.p));
        return sP('Simplify ' + t(lead) + '.', A, { sol: t(lead + '=' + D(rt(z.p), z.p) + '+' + D(rt(z.p), z.s * z.p) + '+' + D(rt(z.p), z.u * z.p) + '=' + sTex(A)), hints: ['Simplify and rationalize each fraction — they all become multiples of ' + t(rt(z.p)) + '.', 'Then add the fractions with a common denominator.'], text: 'sum of three rationalized fractions' });
      } }] },
    { num: '13', stem: '', parts: [
      { id: 'e13', level: 'MAS', make: function (r) {
        var z = pickWhere(function () { return { p: r.pick([2, 3, 5]), q: r.pick([2, 3, 5]), k: r.int(1, 3) }; }, function (z) { return z.p !== z.q && !(z.p === 2 && z.q === 3 && z.k === 1); });
        var N = z.p * z.p * z.q, mult = z.p * z.q * z.q, a = z.p * z.q * z.k, res = M(Q(a, z.p * z.q), 3, mult), rT = MT(res);
        var p = B.fields('Rationalize the denominator of ' + t(D(a, rt(N, 3))) + ' using the smallest possible multiplier. Give the multiplier (the cube root you multiply the top and bottom by) and the result.',
          [{ label: 'Multiplier:', name: 'Multiplier', mode: 'math', keys: KS, wide: true }, { label: 'Result:', name: 'Result', mode: 'math', keys: KS, wide: true }],
          [function (resp) { var c = RX(rt(mult, 3))(resp); if (c.v === 'correct') return c; var rd = K.read(resp); if (!rd.res) { var cube = Math.round(pw(rd.val, 3) * N); if (Math.abs(pw(rd.val, 3) * N - cube) < 1e-6 && isPow(cube, 3) && cube > 1) return wrong(LID + '-not-smallest', 'That works, but it isn’t the smallest multiplier. Factor ' + t(N + '=' + z.p + '^2\\cdot ' + z.q) + ': you need one more ' + t(z.p) + ' and two more ' + t(z.q) + '’s.'); } return c; }, RX(rT)],
          [rt(mult, 3), rT], 'Multiplier ' + t(rt(mult, 3)) + ', result ' + t(rT),
          t(N + '=' + z.p + '^2\\cdot ' + z.q) + ': multiply by ' + t('\\sqrt[3]{' + z.p + '\\cdot ' + z.q + '^2}=' + rt(mult, 3)) + ' to get ' + t(rt(N * mult, 3) + '=' + z.p * z.q) + ': ' + t(D(a + rt(mult, 3), z.p * z.q) + '=' + rT), ['Write ' + t(N) + ' as a product of primes. What is missing for a perfect cube?'], 'smallest cube-root multiplier');
        p.bad = [[rt(N * N, 3), rT]]; return p;
      } }] },
    { num: '14', stem: '', parts: [
      { id: 'e14a', level: 'ADV', make: function (r) {
        return mcP(r, 'Which argument shows that ' + t('\\sqrt{\\dfrac{x}{y}}=\\dfrac{\\sqrt{xy}}{y}') + ' for ' + t('x\\ge 0,\\ y>0') + '?', [
          { html: t('\\sqrt{\\tfrac{x}{y}}=\\tfrac{\\sqrt{x}}{\\sqrt{y}}\\cdot\\tfrac{\\sqrt{y}}{\\sqrt{y}}=\\tfrac{\\sqrt{xy}}{y}') + ': split the radical, then multiply by ' + t('\\tfrac{\\sqrt y}{\\sqrt y}=1') + '.', right: true },
          { html: t('\\sqrt{\\tfrac{x}{y}}=\\tfrac{\\sqrt{x}}{y}') + ', then multiply the top by ' + t('\\sqrt{y}') + '.', why: 'The square root applies to the denominator too, and multiplying only the top changes the value.' },
          { html: 'Square both sides: ' + t('\\tfrac{x}{y}=\\tfrac{xy}{y}') + '.', why: t('\\left(\\tfrac{\\sqrt{xy}}{y}\\right)^2=\\tfrac{xy}{y^2}') + ', not ' + t('\\tfrac{xy}{y}') + '.' },
          { html: 'Multiply the top and bottom inside the radical by ' + t('y') + ' and take the root of the top only.', why: 'Taking the root of only the top changes the value.' }],
          t('\\sqrt{\\tfrac{x}{y}}=\\tfrac{\\sqrt{x}}{\\sqrt{y}}=\\tfrac{\\sqrt{x}}{\\sqrt{y}}\\cdot\\tfrac{\\sqrt{y}}{\\sqrt{y}}=\\tfrac{\\sqrt{xy}}{y}') + '. (' + t('y>0') + ' keeps the denominator from being 0.)', ['Split the radical over the fraction first.'], 'show √(x/y) = √(xy)/y');
      } },
      { id: 'e14b', level: 'ADV', make: function (r) { var z = pickWhere(function () { return { a: r.pick([5, 7, 11, 13]), b: r.pick([6, 10, 14, 15]) }; }, function (z) { return gcd(z.a, z.b) === 1 && !(z.a === 11 && z.b === 6); }); var p = sqFrac(z.a, z.b, 1, 'ADV', 'use √(x/y) = √(xy)/y'); p.prompt = 'Use it to write ' + p.prompt + ' in simplest form.'; return p; } }] }
  ];

  HW.defineLesson({ id: LID, unit: 2, num: 5, title: 'Dividing Radicals and Rationalizing Monomial Denominators', outcome: 'AN2', calc: false, questions: QUESTIONS, extra: EXTRA });
})(window);
