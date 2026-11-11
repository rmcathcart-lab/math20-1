/* Math 20-1 · Unit 2 · Lesson 6 — Rationalizing Binomial Denominators with Conjugates (outcome AN2 on every part)
 * Assignment 6 (m201book unit2/u2_l06.tex, Questions 1–18) and the Lesson 6 Extra Practice (u2_ep06.tex, A1–A3, B1–B6, C1–C3).
 * Every part is a generator: the booklet question's idea, form and difficulty with new numbers (the lesson's example
 * numbers and the booklet question's own numbers are left out where feasible). No calculator (Unit 2): exact answers.
 * Answers are checked as in Lesson 5 (u2l5.js; the radical engine is copied here, not shared): any equivalent exact
 * answer in simplest form is accepted (any term order, one fraction or reduced separate fractions, a whole-number
 * factor in front of brackets, an equivalent sign arrangement such as (4√y − 8)/(y − 4)); the right value in another
 * form gets a nudge that doesn't use a try. Restrictions are typed as inequalities and compared as sets.
 * Conversions: Q1 / Extra 1 -> a conjugate box and a product box; Q6(a) "explain" -> multiple choice; Q12 ("show")
 * -> the reciprocal and the difference; Q13 "rational or irrational" -> multiple choice with the value.
 * Restrictions where the original denominator can never be 0 (Q7(b), Q7(c), Extra 4(a)): the booklet answers add the
 * value excluded only by the rationalized form; both answers are accepted (see the report).
 * Levels: LIM BEG EMG PRG ADV MAS. Mastery: Q18, Extra C1–C3. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, B = K.P, ex = HW.ex, F = HW.fmt, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
  var LID = 'u2l6';

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
      if (!vars.length && ex.shape(a.ast).decimals && Math.abs(a.val - T({})) < 0.01 * Math.max(1, Math.abs(T({})))) return form('decimal-rounded', 'That decimal is close but not exact. Give the exact answer (a calculator only gives a decimal).');
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
      check: RX(keyTex, o), key: keyTex, answer: dd(t((o.ansPre || '') + keyTex + (o.unit ? '\\text{ ' + o.unit + '}' : ''))), solution: dd(o.sol), hints: o.hints || [], text: o.text, bad: bad, good: (o.good || []).filter(Boolean) };
  }
  /* sum-of-square-roots answer A (array), prompt = the expression */
  function sP(prompt, A, o) { o = o || {}; var k = sTex(A); o.good = (o.good || []).concat([sAlt(A)]); return radP(prompt, k, o); }
  function mP(prompt, Mx, o) { return radP(prompt, MT(Mx), o); }
  /* restriction box + simplified box */
  function restrP(prompt, v, want, keyTex, o) {
    o = o || {};
    var rk = rKey(want, v), fields = [{ label: 'Restriction:', name: 'Restriction', mode: 'math', keys: KR, vars: [v], wide: true, placeholder: 'e.g. ' + v + ' > 0' }, { label: 'Simplified:', name: 'Simplified', mode: 'math', keys: KR, vars: [v], wide: true, placeholder: 'e.g. 2sqrt(2' + v + ')/' + v }];
    var p = FL(prompt, fields, [RS(want, { v: v, kind: o.kind, z: o.z, alts: o.alts }), RX(keyTex, { vars: [v], cands: o.cands, radDen: o.radDen, sumRad: o.sumRad })], [rk, keyTex],
      'Restriction: ' + t(rTex(want, v)) + '<br>Simplified: ' + t(keyTex), o.sol, o.hints || [], o.text);
    p.bad = [[rk, '0'], [o.kind === 'odd' || o.kind === 'bin' ? v + '>0' : v + '\\geq 0', keyTex]].concat((o.cands || []).filter(function (c) { return typeof c[0] === 'string'; }).map(function (c) { return [rk, c[0]]; }));
    p.good = [[rTex(want, v).replace(/\\ /g, ' '), keyTex]];
    if (want.length === 1 && want[0].op === '>') p.good.push(['0<' + v, keyTex]);
    return p;
  }
  function dd(s) { return typeof s === 'string' ? s.replace(/\\frac\{/g, '\\dfrac{') : s; }
  function FL() { var p = B.fields.apply(null, arguments); p.solution = dd(p.solution); p.answer = dd(p.answer); return p; }
  function mcP(r, prompt, opts, sol, hints, text) {
    var seen = {}, out = [];
    opts.forEach(function (op) { var k = op.html.replace(/\s/g, ''); if (seen[k] && !op.right) return; seen[k] = 1; out.push(op); });
    return B.mc(r, prompt, out, dd(sol), hints || [], text);
  }
  function nrP(prompt, ans, cands, sol, hints, text) {
    var p = B.nr(prompt, ans, function (v) { for (var i = 0; i < (cands || []).length; i++) if (Math.abs(v - cands[i][0]) < 1e-9) return { code: cands[i][1], hint: cands[i][2] }; return null; }, sol, hints, text);
    p.solution = dd(p.solution);
    p.bad = (cands || []).filter(function (c) { return Math.abs(c[0] - ans) > 1e-9 && String(c[0]).length <= 4 && c[0] >= 0; }).map(function (c) { return String(c[0]); });
    return p;
  }
  function D(n, d) { return '\\dfrac{' + n + '}{' + d + '}'; }
  function ex1(texExpr) { return t(texExpr); }
  var SQF = [2, 3, 5, 6, 7, 10, 11, 13, 14, 15, 17, 19, 21, 22, 23, 26, 29, 30];
  var PR = [2, 3, 5, 7, 11, 13];
  function bareRoot(c, m, n) { return (c === 1 ? '' : c === -1 ? '-' : c) + rt(m, n); }
  CODES = {};
  CODES[LID + '-same'] = 'Conjugate: wrote the same binomial'; CODES[LID + '-neg-conj'] = 'Conjugate: changed the sign of the first term';
  CODES[LID + '-prod-add'] = 'Product: added the squares'; CODES[LID + '-prod-sq'] = 'Product: didn’t square the whole-number term';
  CODES[LID + '-prod-coef'] = 'Product: didn’t square the coefficient'; CODES[LID + '-den-add'] = 'Denominator: added instead of subtracting';
  CODES[LID + '-den-coef'] = 'Denominator: didn’t square the coefficient'; CODES[LID + '-num-sign'] = 'Multiplied the numerator by the binomial, not its conjugate';
  CODES[LID + '-num-only'] = 'Forgot to multiply the numerator'; CODES[LID + '-sum'] = 'Gave a + b instead of ab';
  CODES[LID + '-middle'] = 'Squared a binomial without the middle term'; CODES[LID + '-den-one'] = 'Treated the denominator as 1';
  HW.addCodes(Object.keys(CODES).filter(function (k) { return !HW.CODES[k]; }).reduce(function (o, k) { o[k] = CODES[k]; return o; }, {}));
  PART = {}; [['same', 'b'], ['neg-conj', 's'], ['prod-add', 'b'], ['prod-sq', 's'], ['prod-coef', 's'], ['den-add', 'b'], ['den-coef', 's'], ['num-sign', 'b'], ['num-only', 'b']].forEach(function (x) { PART[LID + '-' + x[0]] = x[1]; });
  HW.addPartial(PART);

  /* ======================= Lesson 6 generators ======================= */
  function sq2(x) { return Math.abs(qv(x.c)) * Math.abs(qv(x.c)) * x.m; }           // (c√m)² as a number
  function kT(A) { return sTex(A, { keep: true }); }
  /* N / D rationalized with the conjugate. N, Dl: raw lists [[c, m]] (radicands as shown). o.simplifyFirst shows the simplified radicals first. */
  function conj(N, Dl, o) {
    o = o || {};
    var Ns = S(N), Ds = S(Dl), C = sConj(Ds), R = sRat(sMul(Ds, C))[0], top = sMul(Ns, C), A = sSc(top, Q(1, R));
    var numTex = o.numTex || raw(N), denTex = o.denTex || raw(Dl), lead = D(numTex, denTex), steps = [];
    var nS = kT(Ns), dS = kT(Ds);
    if (nS !== numTex || dS !== denTex) steps.push(D(nS, dS));
    var nPart = Ns.length > 1 ? '(' + nS + ')' : nS, cPart = '(' + kT(C) + ')', x = Ds[0], y = Ds[1], a2 = sq2(x), b2 = y ? sq2(y) : 0;
    steps.push(D((nS === '1' ? '' : nPart) + cPart, F(a2) + '-' + F(b2)));
    steps.push(R === 1 ? kT(top) : D(kT(top), R));
    var fin = sTex(A); if (steps[steps.length - 1] !== fin) steps.push(fin);
    var cands = [];
    cands.push([sTex(sSc(top, Q(1, a2 + b2))), LID + '-den-add', 'The denominator is a difference of squares: ' + t(F(a2) + '-' + F(b2)) + ' — subtract.']);
    cands.push([sTex(sSc(sMul(Ns, Ds), Q(1, R))), LID + '-num-sign', 'Multiply the numerator by the <b>conjugate</b> ' + t(kT(C)) + ' (the denominator with the opposite sign in the middle).']);
    var kx = Math.abs(qv(x.c)), ky = Math.abs(qv(y.c)), wr = [];
    if (kx > 1 && x.m > 1) wr.push([kx * x.m - b2, kx, x.m]); if (ky > 1 && y.m > 1) wr.push([a2 - ky * y.m, ky, y.m]);
    wr.forEach(function (w) { if (w[0] && w[0] !== R) cands.push([sTex(sSc(top, Q(1, w[0]))), LID + '-den-coef', 'Square the whole term: ' + t('(' + w[1] + '\\sqrt{' + w[2] + '})^2=' + w[1] * w[1] + '(' + w[2] + ')=' + w[1] * w[1] * w[2]) + '.']); });
    var s0 = steps.length && steps[0] === D(nS, dS) && (nS !== numTex || dS !== denTex) ? steps.shift() : null;
    return { A: A, R: R, C: C, top: top, sol: t(lead + (s0 ? '=' + s0 : '') + '\\cdot' + D(kT(C), kT(C)) + '=' + steps.join('=')), cands: cands, lead: lead };
  }
  var HC = ['Multiply the numerator and the denominator by the conjugate of the denominator.', 'The denominator becomes a difference of squares; then simplify and reduce.'];
  function conjP(N, Dl, text, o) {
    o = o || {}; var c = conj(N, Dl, o);
    return sP(o.prompt || t(c.lead), c.A, { cands: c.cands.concat(o.cands || []), sol: c.sol, hints: o.hints || HC, text: text, before: o.before, after: o.after, unit: o.unit });
  }
  /* conjugate and product of a binomial */
  function conjProdP(Dl, text) {
    var Ds = S(Dl), C = sConj(Ds), R = sRat(sMul(Ds, C))[0], dT = raw(Dl), cT2 = kT(C), x = Ds[0], y = Ds[1], a2 = sq2(x), b2 = sq2(y);
    var negC = kT(sNeg(Ds)), wrongs = [[a2 + b2, LID + '-prod-add', 'The middle terms cancel and the product is a <b>difference</b> of squares: ' + t(F(a2) + '-' + F(b2)) + '.']], kx = Math.abs(qv(x.c)), ky = Math.abs(qv(y.c));
    if (x.m === 1 && kx > 1) wrongs.push([kx - b2, LID + '-prod-sq', 'Square the whole-number term too: ' + t(kx + '^2=' + kx * kx) + '.']);
    if (y.m === 1 && ky > 1) wrongs.push([a2 - ky, LID + '-prod-sq', 'Square the whole-number term too: ' + t(ky + '^2=' + ky * ky) + '.']);
    if (x.m > 1 && kx > 1) wrongs.push([kx * x.m - b2, LID + '-prod-coef', 'Square the coefficient too: ' + t('(' + kx + '\\sqrt{' + x.m + '})^2=' + kx * kx * x.m) + '.']);
    if (y.m > 1 && ky > 1) wrongs.push([a2 - ky * y.m, LID + '-prod-coef', 'Square the coefficient too: ' + t('(' + ky + '\\sqrt{' + y.m + '})^2=' + ky * ky * y.m) + '.']);
    var diag = function (v) { for (var i = 0; i < wrongs.length; i++) if (Math.abs(v - wrongs[i][0]) < 1e-9 && wrongs[i][0] !== R) return { code: wrongs[i][1], hint: wrongs[i][2] }; if (v === -R) return { code: 'sign', hint: 'Check the sign: ' + t(F(a2) + '-' + F(b2)) + '.' }; return null; };
    var p = FL(t(dT), [{ label: 'Conjugate:', name: 'Conjugate', mode: 'math', keys: KS, placeholder: 'e.g. 3sqrt(2)', wide: true }, { label: 'Product:', name: 'Product' }],
      [RX(cT2, { cands: [[kT(Ds), LID + '-same', 'That’s the same binomial. Change the sign <b>between</b> the terms.'], [negC, LID + '-neg-conj', 'Keep the first term as it is; change only the sign in front of the second term.'], [kT(sNeg(C)), LID + '-neg-conj', 'Keep the first term as it is; change only the sign in front of the second term.']] }), K.number(R, diag)],
      [cT2, String(R)], 'Conjugate ' + t(cT2) + ', product ' + t(R),
      t('(' + dT + ')(' + cT2 + ')=(' + kT([x]) + ')^2-(' + kT([{ c: [Math.abs(y.c[0]), y.c[1]], m: y.m }]) + ')^2=' + F(a2) + '-' + F(b2) + '=' + R), ['A conjugate has the same two terms with the opposite sign between them.', 'The product is (first term)² − (second term)².'], text);
    p.bad = [[kT(Ds), String(R)], [cT2, String(a2 + b2)]]; return p;
  }
  function nsq(r, lo, hi, not) { return pickWhere(function () { return r.int(lo, hi); }, function (m) { return !isPow(m, 2) && sqf(m) && (not || []).indexOf(m) < 0; }); }
  function small(A, L) { return sDen(A) <= (L || 12) && A.every(function (x) { return Math.abs(x.c[0]) <= 60; }); }
  /* a key with variables, built by hand: restriction + simplified */

  var QUESTIONS = [
    { num: '1', section: 'Assignment', stem: 'Write the conjugate of each binomial, and find the product of the binomial and its conjugate.', parts: [
      { id: '1a', level: 'BEG', make: function (r) { var z = pickWhere(function () { return { a: r.int(2, 9), m: nsq(r, 2, 15) }; }, function (z) { return !(z.a === 5 && z.m === 2) && !(z.a === 4 && z.m === 3); }); return conjProdP([[z.a, 1], [1, z.m]], 'conjugate: a + √m'); } },
      { id: '1b', level: 'BEG', make: function (r) { var z = pickWhere(function () { return { a: r.int(2, 6), m: nsq(r, 5, 30) }; }, function (z) { return !(z.a === 3 && z.m === 11); }); return conjProdP([[1, z.m], [-z.a, 1]], 'conjugate: √m − a'); } },
      { id: '1c', level: 'BEG', make: function (r) { var z = pickWhere(function () { return { p: nsq(r, 2, 15), q: nsq(r, 2, 15) }; }, function (z) { return z.p > z.q && !(z.p === 10 && z.q === 3) && !(z.p === 7 && z.q === 2); }); return conjProdP([[1, z.p], [1, z.q]], 'conjugate: √p + √q'); } },
      { id: '1d', level: 'EMG', make: function (r) { var z = pickWhere(function () { return { k: r.int(2, 5), m: r.pick([2, 3, 5, 6, 7]), a: r.int(1, 9) }; }, function (z) { return !(z.k === 4 && z.m === 2 && z.a === 5) && !(z.k === 2 && z.m === 5 && z.a === 3) && z.k * z.k * z.m !== z.a * z.a; }); return conjProdP([[z.k, z.m], [-z.a, 1]], 'conjugate: k√m − a'); } },
      { id: '1e', level: 'EMG', make: function (r) { var z = pickWhere(function () { return { k: r.int(2, 4), p: r.pick([2, 3, 5, 6, 7]), j: r.int(2, 4), q: r.pick([2, 3, 5, 6, 7]) }; }, function (z) { return z.p !== z.q && !(z.k === 2 && z.p === 7 && z.j === 3 && z.q === 2) && !(z.k === 3 && z.p === 2 && z.j === 2 && z.q === 6); }); return conjProdP([[z.k, z.p], [z.j, z.q]], 'conjugate: k√p + j√q'); } },
      { id: '1f', level: 'EMG', make: function (r) { var z = pickWhere(function () { return { a: r.int(1, 6), m: nsq(r, 2, 15) }; }, function (z) { return !(z.a === 1 && z.m === 6); }); return conjProdP([[-z.a, 1], [-1, z.m]], 'conjugate: −a − √m'); } }] },
    { num: '2', stem: 'Rationalize the denominator and simplify.', parts: [
      { id: '2a', level: 'BEG', make: function (r) { var m = nsq(r, 2, 11, [3]); return conjP([[1, 1]], [[1, m], [1, 1]], '1/(√m + 1)'); } },
      { id: '2b', level: 'BEG', make: function (r) { var z = pickWhere(function () { return { m: nsq(r, 2, 17), k: r.int(1, 3) }; }, function (z) { return !(z.m === 5 && z.k === 1); }); return conjP([[(z.m - 1) * z.k, 1]], [[1, z.m], [-1, 1]], 'a/(√m − 1), a multiple of m − 1'); } },
      { id: '2c', level: 'EMG', make: function (r) { var z = pickWhere(function () { return { c: r.int(2, 6), m: nsq(r, 2, 30), k: r.int(1, 2) }; }, function (z) { return z.c * z.c > z.m && !(z.c === 3 && z.m === 2); }); return conjP([[(z.c * z.c - z.m) * z.k, 1]], [[z.c, 1], [1, z.m]], 'a/(c + √m), integer result'); } },
      { id: '2d', level: 'EMG', make: function (r) { var z = pickWhere(function () { return { p: nsq(r, 3, 15), q: nsq(r, 2, 11), a: r.int(1, 9) }; }, function (z) { var d = z.p - z.q; return d > 1 && Q(z.a, d)[1] > 1 && !(z.p === 6 && z.q === 2 && z.a === 2); }); return conjP([[z.a, 1]], [[1, z.p], [-1, z.q]], 'a/(√p − √q), fraction result'); } },
      { id: '2e', level: 'EMG', make: function (r) { var z = pickWhere(function () { return { p: nsq(r, 3, 15), q: nsq(r, 2, 13), k: r.int(1, 4) }; }, function (z) { var d = z.p - z.q; return d > 1 && z.k > 1 && !(z.p === 7 && z.q === 3 && z.k === 3); }); return conjP([[(z.p - z.q) * z.k, 1]], [[1, z.p], [1, z.q]], 'a/(√p + √q), integer result'); } },
      { id: '2f', level: 'PRG', make: function (r) { var z = pickWhere(function () { return { c: r.int(2, 6), m: nsq(r, 2, 30), k: r.int(1, 2) }; }, function (z) { return z.c * z.c > z.m && !(z.c === 4 && z.m === 10); }); return conjP([[-(z.c * z.c - z.m) * z.k, 1]], [[z.c, 1], [-1, z.m]], '−a/(c − √m), negative result'); } }] },
    { num: '3', stem: 'Rationalize the denominator and simplify.', parts: [
      { id: '3a', level: 'PRG', make: function (r) { var z = pickWhere(function () { return { m: nsq(r, 2, 15), s: r.pick([1, -1]) }; }, function (z) { return !(z.m === 2 && z.s === 1); }); return conjP([[1, z.m]], [[1, z.m], [z.s, 1]], '√m/(√m ± 1)'); } },
      { id: '3b', level: 'PRG', make: function (r) { var z = pickWhere(function () { return { p: nsq(r, 3, 15), q: nsq(r, 2, 11), s: r.pick([1, -1]) }; }, function (z) { return z.p > z.q && !(z.p === 5 && z.q === 3 && z.s === -1); }); return conjP([[1, z.p]], [[1, z.p], [z.s, z.q]], '√p/(√p ± √q)'); } },
      { id: '3c', level: 'ADV', make: function (r) {
        var z = pickWhere(function () { return { a: r.pick([2, 3, 5]), b: r.pick([2, 3, 5, 7]), m: r.int(2, 3), k: r.int(1, 4) }; }, function (z) { if (z.a === z.b) return false; var D0 = S([[z.m, z.b], [-1, z.a * z.b]]), R = sRat(sMul(D0, sConj(D0))); if (!R || R[0] === 0) return false; var A = sDiv(S([[z.k, z.a]]), D0); return z.a !== z.b && small(A, 3) && !(z.a === 2 && z.b === 3 && z.m === 2 && z.k === 3); });
        return conjP([[z.k, z.a]], [[z.m, z.b], [-1, z.a * z.b]], 'k√a/(m√b − √(ab))');
      } },
      { id: '3d', level: 'ADV', make: function (r) {
        var z = pickWhere(function () { return { a: r.pick([2, 3, 5, 7]), b: r.pick([2, 3, 5]), k: r.int(2, 3) }; }, function (z) { if (z.a === z.b) return false; var D0 = S([[1, z.a * z.b], [z.k, z.a]]), R = sRat(sMul(D0, sConj(D0))); if (!R || R[0] >= 0) return false; var A = sDiv(S([[z.k, z.a]]), D0); return z.a !== z.b && small(A, 4) && !(z.a === 5 && z.b === 2 && z.k === 2); });
        return conjP([[z.k, z.a]], [[1, z.a * z.b], [z.k, z.a]], 'k√a/(√(ab) + k√a), negative denominator');
      } }] },
    { num: '4', stem: 'Rationalize the denominator and simplify.', parts: [
      { id: '4a', level: 'PRG', make: function (r) { var z = pickWhere(function () { return { m: nsq(r, 2, 15), c: r.int(1, 4) }; }, function (z) { return z.m !== z.c * z.c && !(z.m === 7 && z.c === 2) && !(z.m === 5 && z.c === 1); }); return conjP([[1, z.m], [z.c, 1]], [[1, z.m], [-z.c, 1]], '(√m + c)/(√m − c)'); } },
      { id: '4b', level: 'PRG', make: function (r) { var z = pickWhere(function () { return { m: nsq(r, 2, 15), c: r.int(1, 5) }; }, function (z) { return z.m !== z.c * z.c && !(z.m === 2 && z.c === 3); }); return conjP([[z.c, 1], [-1, z.m]], [[z.c, 1], [1, z.m]], '(c − √m)/(c + √m)'); } },
      { id: '4c', level: 'PRG', make: function (r) { var z = pickWhere(function () { return { p: nsq(r, 3, 15), q: nsq(r, 2, 11) }; }, function (z) { return z.p > z.q && !(z.p === 5 && z.q === 2); }); return conjP([[1, z.p], [1, z.q]], [[1, z.p], [-1, z.q]], '(√p + √q)/(√p − √q)'); } },
      { id: '4d', level: 'ADV', make: function (r) { var z = pickWhere(function () { return { m: nsq(r, 2, 15), c: r.int(1, 4), e: r.int(1, 3) }; }, function (z) { return z.c !== z.e && z.m !== z.e * z.e && !(z.m === 3 && z.c === 2 && z.e === 1) && small(sDiv(S([[1, z.m], [-z.c, 1]]), S([[1, z.m], [z.e, 1]])), 12); }); return conjP([[1, z.m], [-z.c, 1]], [[1, z.m], [z.e, 1]], '(√m − c)/(√m + e)'); } },
      { id: '4e', level: 'ADV', make: function (r) { var z = pickWhere(function () { return { p: r.pick([6, 10, 15, 14]), q: r.pick([2, 3, 5, 7]), k: r.int(2, 3) }; }, function (z) { return z.p % z.q === 0 && z.p !== z.q && !(z.p === 6 && z.q === 3 && z.k === 2) && small(sDiv(S([[z.k, z.p], [1, z.q]]), S([[1, z.p], [-1, z.q]])), 8); }); return conjP([[z.k, z.p], [1, z.q]], [[1, z.p], [-1, z.q]], '(k√p + √q)/(√p − √q), a radical simplifies'); } },
      { id: '4f', level: 'ADV', make: function (r) { var z = pickWhere(function () { return { c: r.int(2, 5), e: r.int(2, 4), m: 0 }; }, function (z) { z.m = z.e * z.e + 1; return z.c !== z.e && sqf(z.m) && !(z.c === 4 && z.e === 3); }); return conjP([[z.c, 1], [-1, z.m]], [[1, z.m], [-z.e, 1]], '(c − √m)/(√m − e), denominator 1'); } }] },
    { num: '5', stem: 'Simplify the radicals first, then rationalize and simplify.', parts: [
      { id: '5a', level: 'ADV', make: function (r) { var z = pickWhere(function () { return { s: r.int(2, 3), a: r.pick([2, 3, 5]), b: r.pick([2, 3, 6, 5, 7]), k: r.int(1, 3) }; }, function (z) { var R = z.s * z.s * z.a - z.b; return R > 0 && z.a !== z.b && !(z.s === 2 && z.a === 3 && z.b === 6) && (z.k * R) <= 30; }); var R = z.s * z.s * z.a - z.b; return conjP([[R * z.k, 1]], [[1, z.s * z.s * z.a], [1, z.b]], 'a/(√(s²a) + √b), simplify first'); } },
      { id: '5b', level: 'ADV', make: function (r) { var z = pickWhere(function () { return { m: r.pick([2, 3, 5, 6, 7]), s: r.int(2, 3), c: r.int(1, 3) }; }, function (z) { return !(z.m === 5 && z.s === 2 && z.c === 1) && z.s * z.s * z.m <= 75 && small(sDiv(S([[1, z.s * z.s * z.m], [-z.s * z.c, 1]]), S([[1, z.m], [z.c, 1]])), 6); }); return conjP([[1, z.s * z.s * z.m], [-z.s * z.c, 1]], [[1, z.m], [z.c, 1]], '(√(s²m) − sc)/(√m + c), simplify first'); } },
      { id: '5c', level: 'ADV', make: function (r) { var z = pickWhere(function () { return { a: r.pick([2, 3]), b: r.pick([2, 3, 5]), s1: r.int(2, 3), s2: r.int(2, 3), s0: r.int(2, 3) }; }, function (z) { if (z.a === z.b) return false; var D0 = S([[1, z.s1 * z.s1 * z.a], [-1, z.s2 * z.s2 * z.b]]), R = sRat(sMul(D0, sConj(D0))); return R && R[0] > 0 && small(sDiv(S([[1, z.s0 * z.s0 * z.a]]), D0), 6) && !(z.a === 2 && z.b === 3 && z.s1 === 3 && z.s2 === 2 && z.s0 === 2); }); return conjP([[1, z.s0 * z.s0 * z.a]], [[1, z.s1 * z.s1 * z.a], [-1, z.s2 * z.s2 * z.b]], '√(s²a)/(√(s²a) − √(s²b)), simplify first'); } }] },
    { num: '6', shared: function (r) { return pickWhere(function () { return { c: r.int(2, 5), m: nsq(r, 2, 24), k: r.int(1, 4) }; }, function (z) { return z.c * z.c > z.m && !(z.c === 2 && z.m === 3) && (z.c * z.c - z.m) * z.k <= 40; }); },
      stem: function (z) { var a = (z.c * z.c - z.m) * z.k; return 'A student simplified ' + t(D(a, z.c + '+\\sqrt{' + z.m + '}')) + ' by multiplying the numerator and denominator by ' + t('\\sqrt{' + z.m + '}') + '.'; }, parts: [
      { id: '6a', level: 'PRG', make: function (r, z) {
        return mcP(r, 'Why does this <b>not</b> rationalize the denominator?', [
          { html: 'The denominator becomes ' + t(z.c + '\\sqrt{' + z.m + '}+' + z.m) + ', which still contains a radical.', right: true },
          { html: 'Multiplying by ' + t('\\tfrac{\\sqrt{' + z.m + '}}{\\sqrt{' + z.m + '}}') + ' changes the value of the expression.', why: 'It is multiplying by 1, so the value doesn’t change — but the radical doesn’t go away.' },
          { html: 'The numerator would then contain a radical.', why: 'A radical in the numerator is fine. The problem is the denominator.' },
          { html: 'It does rationalize it: ' + t('\\sqrt{' + z.m + '}\\cdot\\sqrt{' + z.m + '}=' + z.m) + '.', why: 'Only the second term becomes ' + t(z.m) + '; the first term becomes ' + t(z.c + '\\sqrt{' + z.m + '}') + '.' }],
          t('(' + z.c + '+\\sqrt{' + z.m + '})\\sqrt{' + z.m + '}=' + z.c + '\\sqrt{' + z.m + '}+' + z.m) + ' still has a radical. For a binomial, multiply by the <b>conjugate</b> ' + t(z.c + '-\\sqrt{' + z.m + '}') + '.', ['Multiply out ' + t('(' + z.c + '+\\sqrt{' + z.m + '})\\sqrt{' + z.m + '}') + '.'], 'why multiplying by the radical fails');
      } },
      { id: '6b', level: 'EMG', make: function (r, z) { var a = (z.c * z.c - z.m) * z.k; var p = conjP([[a, 1]], [[z.c, 1], [1, z.m]], 'simplify correctly'); p.prompt = 'Simplify ' + t(D(a, z.c + '+\\sqrt{' + z.m + '}')) + ' correctly.'; return p; } }] },
    { num: '7', stem: 'Rationalize the denominator. State the restrictions on the variable.', parts: [
      { id: '7a', level: 'PRG', make: function (r) {
        var z = pickWhere(function () { return { v: r.pick(['x', 'y', 'n']), c: r.int(2, 7), a: r.int(1, 3) }; }, function (z) { return !(z.c === 3 && z.a === 1); });
        var v = z.v, c2 = z.c * z.c, lead = D(z.a, '\\sqrt{' + v + '}-' + z.c), key = '\\frac{' + cT(z.a) + '\\sqrt{' + v + '}+' + z.a * z.c + '}{' + v + '-' + c2 + '}';
        return restrP(t(lead), v, [{ op: '≥', v: 0 }, { op: '≠', v: c2 }], key, { kind: 'bin', z: c2, cands: [['\\frac{' + cT(z.a) + '\\sqrt{' + v + '}+' + z.a * z.c + '}{' + v + '+' + c2 + '}', LID + '-den-add', t('(\\sqrt{' + v + '}-' + z.c + ')(\\sqrt{' + v + '}+' + z.c + ')=' + v + '-' + c2) + ' — subtract.']],
          sol: t(v + '\\ge 0') + ' (square root) and ' + t(v + '\\ne ' + c2) + ' (then ' + t('\\sqrt{' + v + '}-' + z.c + '=0') + ').<br>' + t(lead + '\\cdot' + D('\\sqrt{' + v + '}+' + z.c, '\\sqrt{' + v + '}+' + z.c) + '=' + key), hints: ['Where is the denominator 0? Solve ' + t('\\sqrt{' + v + '}=' + z.c) + '.', 'Multiply by the conjugate ' + t('\\sqrt{' + v + '}+' + z.c) + '.'], text: 'restrictions: a/(√x − c)' });
      } },
      { id: '7b', level: 'PRG', make: function (r) {
        var z = pickWhere(function () { return { v: r.pick(['y', 'x', 'm']), c: r.int(2, 6), a: r.int(1, 5) }; }, function (z) { return !(z.c === 2 && z.a === 4); });
        var v = z.v, c2 = z.c * z.c, g = gcd(z.a, c2), lead = D(z.a, z.c + '+\\sqrt{' + v + '}'), key = '\\frac{' + z.a * z.c + '-' + cT(z.a) + '\\sqrt{' + v + '}}{' + c2 + '-' + v + '}';
        return restrP(t(lead), v, [{ op: '≥', v: 0 }], key, { kind: 'bin', z: c2, alts: [[{ op: '≥', v: 0 }, { op: '≠', v: c2 }]],
          sol: t(v + '\\ge 0') + '. (' + t(z.c + '+\\sqrt{' + v + '}') + ' is never 0; the rationalized form also needs ' + t(v + '\\ne ' + c2) + ', so either answer is accepted.)<br>' + t(lead + '\\cdot' + D(z.c + '-\\sqrt{' + v + '}', z.c + '-\\sqrt{' + v + '}') + '=' + D(z.a + '(' + z.c + '-\\sqrt{' + v + '})', c2 + '-' + v) + '=' + key), hints: ['Can ' + t(z.c + '+\\sqrt{' + v + '}') + ' ever be 0?', 'Multiply by the conjugate ' + t(z.c + '-\\sqrt{' + v + '}') + '.'], text: 'restrictions: a/(c + √y)' });
      } },
      { id: '7c', level: 'ADV', make: function (r) {
        var z = pickWhere(function () { return { v: r.pick(['a', 'x', 'n']), p: r.pick([2, 3, 5, 6, 7, 10]) }; }, function (z) { return !(z.v === 'a' && z.p === 5); });
        var v = z.v, lead = D('\\sqrt{' + v + '}', '\\sqrt{' + v + '}+\\sqrt{' + z.p + '}'), key = '\\frac{' + v + '-\\sqrt{' + z.p + v + '}}{' + v + '-' + z.p + '}';
        return restrP(t(lead), v, [{ op: '≥', v: 0 }], key, { kind: 'bin', z: z.p, alts: [[{ op: '≥', v: 0 }, { op: '≠', v: z.p }]], cands: [['\\frac{' + v + '-\\sqrt{' + z.p + v + '}}{' + v + '+' + z.p + '}', LID + '-den-add', 'The denominator is ' + t('(\\sqrt{' + v + '})^2-(\\sqrt{' + z.p + '})^2=' + v + '-' + z.p) + '.']],
          sol: t(v + '\\ge 0') + '. (The denominator is never 0 for ' + t(v + '\\ge 0') + '; the rationalized form also needs ' + t(v + '\\ne ' + z.p) + ', so either answer is accepted.)<br>' + t(lead + '\\cdot' + D('\\sqrt{' + v + '}-\\sqrt{' + z.p + '}', '\\sqrt{' + v + '}-\\sqrt{' + z.p + '}') + '=' + key), hints: ['Multiply by the conjugate ' + t('\\sqrt{' + v + '}-\\sqrt{' + z.p + '}') + '.', 'Write ' + t('\\sqrt{' + v + '}\\cdot\\sqrt{' + z.p + '}') + ' as one radical.'], text: 'restrictions: √a/(√a + √p)' });
      } },
      { id: '7d', level: 'ADV', make: function (r) {
        var z = pickWhere(function () { return { v: r.pick(['m', 'x', 'y']), c: r.int(1, 4) }; }, function (z) { return !(z.v === 'm' && z.c === 1); });
        var v = z.v, c2 = z.c * z.c, lead = D('\\sqrt{' + v + '}+' + z.c, '\\sqrt{' + v + '}-' + z.c), key = '\\frac{' + v + '+' + cT(2 * z.c) + '\\sqrt{' + v + '}+' + c2 + '}{' + v + '-' + c2 + '}';
        return restrP(t(lead), v, [{ op: '≥', v: 0 }, { op: '≠', v: c2 }], key, { kind: 'bin', z: c2, cands: [['\\frac{' + v + '+' + c2 + '}{' + v + '-' + c2 + '}', LID + '-middle', 'Square the numerator fully: ' + t('(\\sqrt{' + v + '}+' + z.c + ')^2=' + v + '+' + 2 * z.c + '\\sqrt{' + v + '}+' + c2) + ' (don’t forget the middle term).']],
          sol: t(v + '\\ge 0,\\ ' + v + '\\ne ' + c2) + '<br>' + t(lead + '\\cdot' + D('\\sqrt{' + v + '}+' + z.c, '\\sqrt{' + v + '}+' + z.c) + '=' + D('(\\sqrt{' + v + '}+' + z.c + ')^2', v + '-' + c2) + '=' + key), hints: ['Where is the denominator 0?', 'The numerator becomes a perfect square: expand it with FOIL.'], text: 'restrictions: (√m + c)/(√m − c)' });
      } }] },
    { num: '8', stem: 'Simplify.', parts: [
      { id: '8a', level: 'PRG', make: function (r) {
        var z = pickWhere(function () { return { m: nsq(r, 2, 15), c: r.int(1, 3), k: r.int(1, 3) }; }, function (z) { return z.m > z.c * z.c && !(z.m === 3 && z.c === 1 && z.k === 1); });
        var d = z.m - z.c * z.c, a = z.k * d, A = sSub(sDiv(S([[a, 1]]), S([[1, z.m], [-z.c, 1]])), S([[z.k, z.m]])), lead = D(a, '\\sqrt{' + z.m + '}-' + z.c) + '-' + cT(z.k) + '\\sqrt{' + z.m + '}';
        var first = sDiv(S([[a, 1]]), S([[1, z.m], [-z.c, 1]]));
        return sP(t(lead), A, { sol: t(lead + '=' + D(a + '(\\sqrt{' + z.m + '}+' + z.c + ')', z.m + '-' + z.c * z.c) + '-' + cT(z.k) + '\\sqrt{' + z.m + '}=' + kT(first) + '-' + cT(z.k) + '\\sqrt{' + z.m + '}=' + sTex(A)), hints: ['Rationalize the fraction first, then collect like terms.'], text: 'rationalize then subtract' });
      } },
      { id: '8b', level: 'PRG', make: function (r) {
        var z = pickWhere(function () { return { m: nsq(r, 2, 15), c: r.int(1, 3), op: r.pick(['-', '+']) }; }, function (z) { return z.m > z.c * z.c && !(z.m === 5 && z.c === 2 && z.op === '-') && (z.m - z.c * z.c) <= 6; });
        var D1 = S([[1, z.m], [-z.c, 1]]), D2 = S([[1, z.m], [z.c, 1]]), f1 = sDiv(S([[1, 1]]), D1), f2 = sDiv(S([[1, 1]]), D2), A = z.op === '-' ? sSub(f1, f2) : sAdd(f1, f2), d = z.m - z.c * z.c;
        var lead = D(1, '\\sqrt{' + z.m + '}-' + z.c) + z.op + D(1, '\\sqrt{' + z.m + '}+' + z.c);
        return sP(t(lead), A, { sol: t(lead + '=' + D('\\sqrt{' + z.m + '}+' + z.c, d) + z.op + D('\\sqrt{' + z.m + '}-' + z.c, d) + '=' + sTex(A)), hints: ['Rationalize each fraction: both denominators become ' + t(z.m + '-' + z.c * z.c + '=' + d) + '.'], text: 'sum/difference of conjugate fractions' });
      } },
      { id: '8c', level: 'ADV', make: function (r) {
        var z = pickWhere(function () { return { m: r.pick([2, 3, 5, 6, 7]), a: r.int(1, 6), b: r.int(1, 6), c: r.int(1, 3) }; }, function (z) { if (z.m === z.c * z.c) return false; var A = sAdd(sDiv(S([[z.a * z.m, 1]]), S([[1, z.m]])), sDiv(S([[z.b, 1]]), S([[1, z.m], [z.c, 1]]))); return small(A, 4) && A.length === 2 && !(z.m === 2 && z.a === 2 && z.b === 2 && z.c === 2); });
        var a = z.a * z.m, f1 = sDiv(S([[a, 1]]), S([[1, z.m]])), f2 = sDiv(S([[z.b, 1]]), S([[1, z.m], [z.c, 1]])), A = sAdd(f1, f2), lead = D(a, '\\sqrt{' + z.m + '}') + '+' + D(z.b, '\\sqrt{' + z.m + '}+' + z.c);
        return sP(t(lead), A, { sol: t(lead + '=' + sTex(f1) + '+' + D(z.b + '(\\sqrt{' + z.m + '}-' + z.c + ')', z.m - z.c * z.c) + '=' + sTex(f1) + (sTex(f2).charAt(0) === '-' ? '' : '+') + sTex(f2) + '=' + sTex(A)), hints: ['Rationalize each fraction separately, then collect like terms.'], text: 'monomial + binomial denominators' });
      } },
      { id: '8d', level: 'ADV', make: function (r) {
        var z = pickWhere(function () { return { c: r.int(2, 5), q: nsq(r, 2, 15), p: nsq(r, 2, 15), e: r.int(1, 3) }; }, function (z) { var R = z.p - z.e * z.e; return z.c * z.c > z.q && R !== 0 && !(z.c === 3 && z.q === 2 && z.p === 7 && z.e === 2) && small(sDiv(S([[z.c * z.c - z.q, 1]]), S([[1, z.p], [-z.e, 1]])), 9); });
        var n = z.c * z.c - z.q, A = sDiv(S([[n, 1]]), S([[1, z.p], [-z.e, 1]])), lead = '(' + z.c + '+\\sqrt{' + z.q + '})(' + z.c + '-\\sqrt{' + z.q + '})\\div(\\sqrt{' + z.p + '}-' + z.e + ')';
        return sP(t(lead), A, { sol: t(lead + '=' + D(z.c * z.c + '-' + z.q, '\\sqrt{' + z.p + '}-' + z.e) + '=' + D(n + '(\\sqrt{' + z.p + '}+' + z.e + ')', z.p + '-' + z.e * z.e) + '=' + sTex(A)), hints: ['The product of conjugates is a whole number. Then rationalize.'], text: 'conjugate product ÷ binomial' });
      } }] },
    { num: '9', stem: '', parts: [
      { id: '9', level: 'PRG', make: function (r) {
        var z = pickWhere(function () { return { p: nsq(r, 3, 15), q: nsq(r, 2, 11), k: r.int(1, 4) }; }, function (z) { var d = z.p - z.q; return d > 0 && (d * z.k) % 2 === 0 && !(z.p === 6 && z.q === 2 && z.k * d / 2 === 4); });
        var d = z.p - z.q, Aar = d * z.k / 2, h = sDiv(S([[2 * Aar, 1]]), S([[1, z.p], [1, z.q]]));
        return sP('A triangle has an area of ' + t(Aar) + '&nbsp;cm² and a base of ' + t('(\\sqrt{' + z.p + '}+\\sqrt{' + z.q + '})') + '&nbsp;cm. Determine its exact height with a rational denominator.', h, { before: 'h =', after: '\\text{cm}', unit: 'cm',
          cands: [[sTex(sDiv(S([[Aar, 1]]), S([[1, z.p], [1, z.q]]))), LID + '-half', t('h=\\tfrac{2A}{b}') + ' — don’t forget the 2.']],
          sol: t('h=\\frac{2A}{b}=' + D(2 * Aar, '\\sqrt{' + z.p + '}+\\sqrt{' + z.q + '}') + '\\cdot' + D('\\sqrt{' + z.p + '}-\\sqrt{' + z.q + '}', '\\sqrt{' + z.p + '}-\\sqrt{' + z.q + '}') + '=' + D(2 * Aar + '(\\sqrt{' + z.p + '}-\\sqrt{' + z.q + '})', z.p + '-' + z.q) + '=' + sTex(h)) + '&nbsp;cm', hints: ['Solve ' + t('A=\\tfrac12 bh') + ' for ' + t('h') + ', then multiply by the conjugate.'], text: 'triangle height' });
      } }] },
    { num: '10', stem: '', parts: [
      { id: '10', level: 'PRG', make: function (r) {
        var z = pickWhere(function () { return { c: r.int(2, 6), m: nsq(r, 2, 35) }; }, function (z) { return z.c * z.c > z.m && !(z.c === 3 && z.m === 3) && z.c * z.c - z.m <= 30; });
        var A = z.c * z.c - z.m, w = S([[z.c, 1], [-1, z.m]]), wT = kT(w), P = String(4 * z.c);
        var p = FL('A rectangle has an area of ' + t(A) + '&nbsp;m² and a length of ' + t('(' + z.c + '+\\sqrt{' + z.m + '})') + '&nbsp;m. Determine its exact width and show that its perimeter is a whole number.',
          [{ label: 'Width:', name: 'Width', mode: 'math', keys: KS, placeholder: 'e.g. 3sqrt(2)', after: '\\text{m}' }, { label: 'Perimeter:', name: 'Perimeter', after: 'm' }],
          [RX(wT, { cands: [[z.c + '+\\sqrt{' + z.m + '}', LID + '-num-sign', 'Multiply by the conjugate ' + t(z.c + '-\\sqrt{' + z.m + '}') + '.']] }), K.number(4 * z.c, function (v) { return v === 2 * z.c ? { code: LID + '-half-p', hint: 'The perimeter has two lengths and two widths.' } : null; })], [wT, P],
          'Width ' + t(wT) + '&nbsp;m, perimeter ' + t(P) + '&nbsp;m', t('w=' + D(A, z.c + '+\\sqrt{' + z.m + '}') + '\\cdot' + D(z.c + '-\\sqrt{' + z.m + '}', z.c + '-\\sqrt{' + z.m + '}') + '=' + D(A + '(' + wT + ')', z.c * z.c + '-' + z.m) + '=' + wT) + '&nbsp;m; ' + t('P=2(' + z.c + '+\\sqrt{' + z.m + '})+2(' + wT + ')=' + P) + '&nbsp;m — the radicals cancel.', ['Width = area ÷ length; multiply by the conjugate.'], 'rectangle width and perimeter');
        return p;
      } }] },
    { num: '11', stem: '', parts: [
      { id: '11', level: 'ADV', make: function (r) {
        var z = pickWhere(function () { return { p0: r.int(1, 3), a: nsq(r, 2, 15), k: r.int(1, 3), c: r.int(-3, 4) }; }, function (z) { var d = z.a - z.p0 * z.p0; if (d === 0) return false; var A = sDiv(S([[z.k, z.a]]), S([[1, z.a], [-z.p0, 1]])); return small(A, 3) && !(z.p0 === 1 && z.a === 2 && z.k === 1); });
        var A = sDiv(S([[z.k, z.a]]), S([[1, z.a], [-z.p0, 1]])), y2 = (z.c === 0 ? '' : z.c) + (z.c === 0 ? cT(z.k) : '+' + cT(z.k)) + '\\sqrt{' + z.a + '}';
        return sP('Determine the exact slope of the line through ' + t('(' + z.p0 + ',\\ ' + z.c + ')') + ' and ' + t('(\\sqrt{' + z.a + '},\\ ' + y2 + ')') + ', with a rational denominator.', A, { before: 'm =',
          sol: t('m=' + D('(' + y2 + ')-' + (z.c < 0 ? '(' + z.c + ')' : z.c), '\\sqrt{' + z.a + '}-' + z.p0) + '=' + D(cT(z.k) + '\\sqrt{' + z.a + '}', '\\sqrt{' + z.a + '}-' + z.p0) + '\\cdot' + D('\\sqrt{' + z.a + '}+' + z.p0, '\\sqrt{' + z.a + '}+' + z.p0) + '=' + sTex(A)), hints: ['Slope = rise ÷ run: ' + t('m=\\tfrac{y_2-y_1}{x_2-x_1}') + '.', 'Rationalize with the conjugate of the run.'], cands: [[sTex(sDiv(S([[1, z.a], [-z.p0, 1]]), S([[z.k, z.a]]))), 'flip', 'Slope is rise over run: ' + t('\\tfrac{\\Delta y}{\\Delta x}') + '.']], text: 'slope with a radical run' });
      } }] },
    { num: '12', stem: '', parts: [
      { id: '12', level: 'ADV', make: function (r) {
        var n = r.int(2, 6), m = n * n + 1, rec = S([[1, m], [-n, 1]]), rT = kT(rec);
        var p = FL('The <b>silver ratio</b> ' + t('1+\\sqrt{2}') + ' has a reciprocal that is 2 less than itself. The number ' + t(n + '+\\sqrt{' + m + '}') + ' behaves the same way. Find its reciprocal with a rational denominator, and how much less than ' + t(n + '+\\sqrt{' + m + '}') + ' the reciprocal is.',
          [{ label: t('\\dfrac{1}{' + n + '+\\sqrt{' + m + '}}='), name: 'Reciprocal', mode: 'math', keys: KS, placeholder: 'e.g. 3sqrt(2)', wide: true }, { label: 'Less by:', name: 'Difference' }],
          [RX(rT, { cands: [[n + '+\\sqrt{' + m + '}', LID + '-num-sign', 'Multiply by the conjugate ' + t(n + '-\\sqrt{' + m + '}') + '.']] }), K.number(2 * n)], [rT, String(2 * n)],
          t(D(1, n + '+\\sqrt{' + m + '}') + '=' + rT) + ', which is ' + t(2 * n) + ' less.', t(D(1, n + '+\\sqrt{' + m + '}') + '\\cdot' + D(n + '-\\sqrt{' + m + '}', n + '-\\sqrt{' + m + '}') + '=' + D(n + '-\\sqrt{' + m + '}', n * n + '-' + m) + '=' + rT) + ', and ' + t('(' + n + '+\\sqrt{' + m + '})-(' + rT + ')=' + 2 * n) + '.', ['The denominator becomes ' + t(n * n + '-' + m + '=-1') + '.'], 'reciprocal like the silver ratio');
        return p;
      } }] },
    { num: '13', shared: function (r) { var c = r.pick([2, 4, 5, 6, 7, 8, 9]); return { c: c, m: c * c - 1 }; },
      stem: function (z) { return 'Decide whether each value is rational or irrational.'; }, parts: [
      { id: '13a', level: 'PRG', make: function (r, z) { var lead = D(1, z.c + '-\\sqrt{' + z.m + '}') + '+' + D(1, z.c + '+\\sqrt{' + z.m + '}'), sp = split(z.m, 2), rad = (2 * sp.s) + '\\sqrt{' + sp.r + '}';
        return mcP(r, t(lead), [{ html: t(2 * z.c) + ': rational', right: true }, { html: t(rad) + ': irrational', why: 'The ' + t('\\sqrt{' + z.m + '}') + ' terms cancel when you <b>add</b>.' }, { html: t('0') + ': rational', why: 'Each fraction becomes ' + t(z.c + '\\pm\\sqrt{' + z.m + '}') + ' (the denominators are ' + t(z.c * z.c + '-' + z.m + '=1') + ').' }, { html: t(2 * z.c + '+' + rad) + ': irrational', why: 'One fraction gives ' + t('+\\sqrt{' + z.m + '}') + ' and the other ' + t('-\\sqrt{' + z.m + '}') + '.' }],
          t(lead + '=' + D(z.c + '+\\sqrt{' + z.m + '}', z.c * z.c + '-' + z.m) + '+' + D(z.c + '-\\sqrt{' + z.m + '}', z.c * z.c + '-' + z.m) + '=' + 2 * z.c) + ': rational.', ['Rationalize each fraction: both denominators are ' + t(z.c * z.c + '-' + z.m) + '.'], 'rational or irrational: sum'); } },
      { id: '13b', level: 'PRG', make: function (r, z) { var lead = D(1, z.c + '-\\sqrt{' + z.m + '}') + '-' + D(1, z.c + '+\\sqrt{' + z.m + '}'), sp = split(z.m, 2), rad = (2 * sp.s) + '\\sqrt{' + sp.r + '}';
        return mcP(r, t(lead), [{ html: t(rad) + ': irrational', right: true }, { html: t(2 * z.c) + ': rational', why: 'When you <b>subtract</b>, the whole numbers cancel and the radicals add.' }, { html: t('0') + ': rational', why: 'The two fractions aren’t equal.' }, { html: t(rad) + ': rational', why: t('\\sqrt{' + sp.r + '}') + ' is irrational, so the value is irrational.' }],
          t(lead + '=(' + z.c + '+\\sqrt{' + z.m + '})-(' + z.c + '-\\sqrt{' + z.m + '})=2\\sqrt{' + z.m + '}' + (sp.s > 1 ? '=' + rad : '')) + ': irrational.', ['Rationalize each fraction, then subtract.'], 'rational or irrational: difference'); } }] },
    { num: '14', stem: '', parts: [
      { id: '14', level: 'PRG', make: function (r) {
        var z = pickWhere(function () { return { a: nsq(r, 3, 15), b: nsq(r, 2, 11), j: r.int(1, 2) }; }, function (z) { return z.a > z.b && !(z.a === 5 && z.b === 2); });
        var k = (z.a - z.b) * z.j, s2 = '\\sqrt{' + z.a + '}+\\sqrt{' + z.b + '}', c = cT(z.j);
        return mcP(r, 'When ' + t(D(k, '\\sqrt{' + z.a + '}-\\sqrt{' + z.b + '}')) + ' is written with a rational denominator, the result is', [
          { html: t(c + (z.j > 1 ? '(' + s2 + ')' : s2)), right: true }, { html: t(c + (z.j > 1 ? '(\\sqrt{' + z.a + '}-\\sqrt{' + z.b + '})' : '\\sqrt{' + z.a + '}-\\sqrt{' + z.b + '}')), why: 'Multiply by the conjugate, which has a <b>+</b> sign.' },
          { html: t(D(k + '(' + s2 + ')', z.a + z.b)), why: 'The denominator is ' + t(z.a + '-' + z.b) + ', not ' + t(z.a + '+' + z.b) + '.' }, { html: t(D(s2, k)), why: 'The ' + t(k) + ' stays in the numerator; the denominator becomes ' + t(z.a - z.b) + '.' }],
          t(D(k + '(' + s2 + ')', z.a + '-' + z.b) + '=' + c + (z.j > 1 ? '(' + s2 + ')' : s2)), HC, 'conjugate denominator (MC)');
      } }] },
    { num: '15', stem: '', parts: [
      { id: '15', level: 'PRG', make: function (r) {
        var L = r.pick([['x', 'y'], ['a', 'b'], ['m', 'n']]), s = r.pick(['-', '+']); if (L[0] === 'x' && s === '-') s = '+';
        var u = L[0], w = L[1], cs = s === '-' ? '+' : '-';
        return mcP(r, 'For ' + t(u + '\\ge 0,\\ ' + w + '\\ge 0,\\ ' + u + '\\ne ' + w) + ', the expression ' + t(D('\\sqrt{' + u + '}', '\\sqrt{' + u + '}' + s + '\\sqrt{' + w + '}')) + ' with a rational denominator is', [
          { html: t(D(u + cs + '\\sqrt{' + u + w + '}', u + '-' + w)), right: true }, { html: t(D(u + s + '\\sqrt{' + u + w + '}', u + '-' + w)), why: 'The numerator is ' + t('\\sqrt{' + u + '}(\\sqrt{' + u + '}' + cs + '\\sqrt{' + w + '})') + ': use the conjugate’s sign.' },
          { html: t(D(u + cs + '\\sqrt{' + u + w + '}', u + '+' + w)), why: 'The denominator is a difference of squares: ' + t(u + '-' + w) + '.' }, { html: t(D('\\sqrt{' + u + '}' + cs + '\\sqrt{' + w + '}', u + '-' + w)), why: 'Multiply the numerator ' + t('\\sqrt{' + u + '}') + ' by the conjugate too.' }],
          t(D('\\sqrt{' + u + '}(\\sqrt{' + u + '}' + cs + '\\sqrt{' + w + '})', u + '-' + w) + '=' + D(u + cs + '\\sqrt{' + u + w + '}', u + '-' + w)), HC, 'variables with conjugates (MC)');
      } }] },
    { num: '16', stem: '', parts: [
      { id: '16', level: 'ADV', make: function (r) {
        var z = pickWhere(function () { return { m: r.int(2, 3), a: r.pick([2, 3, 5]), b: r.pick([2, 3, 5, 6, 7, 10, 11]), j: r.int(1, 2) }; }, function (z) { var R = z.m * z.m * z.a - z.b, W = z.m * z.a - z.b; return z.a !== z.b && R > 0 && W > 0 && W !== R && R <= 20 && !(z.m === 2 && z.a === 3 && z.b === 5 && z.j === 2); });
        var R = z.m * z.m * z.a - z.b, W = z.m * z.a - z.b, k = R * 2 * z.j, cj = z.m + '\\sqrt{' + z.a + '}+\\sqrt{' + z.b + '}', g = k / R;
        var ans = S([[g * z.m, z.a], [g, z.b]]), wrong1 = sSc(S([[z.m, z.a], [1, z.b]]), Q(k, W)), sgn = S([[g * z.m, z.a], [-g, z.b]]);
        return mcP(r, 'When ' + t(D(k, z.m + '\\sqrt{' + z.a + '}-\\sqrt{' + z.b + '}')) + ' is rationalized and simplified, the result is', [
          { html: t(kT(ans)), right: true }, { html: t(kT(sgn)), why: 'Multiply by the conjugate ' + t(cj) + ' (plus sign).' },
          { html: t(D(k + '(' + cj + ')', z.m * z.m * z.a + z.b)), why: 'The denominator is ' + t('(' + z.m + '\\sqrt{' + z.a + '})^2-(\\sqrt{' + z.b + '})^2') + ' — subtract.' }, { html: t(sTex(wrong1)), why: t('(' + z.m + '\\sqrt{' + z.a + '})^2=' + z.m * z.m + '(' + z.a + ')=' + z.m * z.m * z.a) + ', not ' + t(z.m + '(' + z.a + ')') + '.' }],
          'The denominator is ' + t('(' + z.m + '\\sqrt{' + z.a + '})^2-' + z.b + '=' + z.m * z.m * z.a + '-' + z.b + '=' + R) + ', so ' + t(D(k + '(' + cj + ')', R) + '=' + kT(ans)) + '.', HC, 'conjugate with a coefficient (MC)');
      } }] },
    { num: '17', stem: '', parts: [
      { id: '17', level: 'ADV', make: function (r) {
        var z = pickWhere(function () { return { p: r.int(2, 6), q: nsq(r, 2, 30), j: r.int(1, 4) }; }, function (z) { var d = z.p * z.p - z.q; return d > 0 && !(z.p === 3 && z.q === 3 && z.j === 2) && z.p * z.j * z.j <= 999; });
        var d = z.p * z.p - z.q, k = d * z.j, a = z.p * z.j, b = z.j;
        return nrP('The expression ' + t(D(k, z.p + '-\\sqrt{' + z.q + '}')) + ' can be written as ' + t('a+b\\sqrt{' + z.q + '}') + ', where ' + t('a') + ' and ' + t('b') + ' are whole numbers. The value of ' + t('ab') + ' is ____.', a * b,
          [[a + b, LID + '-sum', 'The question asks for the product ' + t('ab') + ', not the sum.']], t(D(k + '(' + z.p + '+\\sqrt{' + z.q + '})', z.p * z.p + '-' + z.q) + '=' + z.j + '(' + z.p + '+\\sqrt{' + z.q + '})=' + a + '+' + cT(b) + '\\sqrt{' + z.q + '}') + ', so ' + t('ab=' + a + '(' + b + ')=' + a * b), HC, 'NR: ab');
      } }] },
    { num: '18', stem: '', parts: [
      { id: '18', level: 'MAS', make: function (r) {
        var L = [], c, a; for (c = 1; c <= 3; c++) for (a = c * c + 1; a <= 45; a++) if (!isPow(a, 2) && sqf(a) && (2 * (a + c * c)) % (a - c * c) === 0 && !(a === 3 && c === 1)) L.push([a, c]);
        var z = r.pick(L), m = z[0], cc = z[1], v = 2 * (m + cc * cc) / (m - cc * cc);
        var lead = D('\\sqrt{' + m + '}+' + cc, '\\sqrt{' + m + '}-' + cc) + '+' + D('\\sqrt{' + m + '}-' + cc, '\\sqrt{' + m + '}+' + cc);
        return nrP('The value of ' + t(lead) + ' is ____.', v, [[(m + cc * cc) / (m - cc * cc), LID + '-one-term', 'Add both fractions — each one is ' + t(D(m + cc * cc + '\\pm' + 2 * cc + '\\sqrt{' + m + '}', m - cc * cc)) + '.']],
          t(lead + '=' + D('(\\sqrt{' + m + '}+' + cc + ')^2+(\\sqrt{' + m + '}-' + cc + ')^2', m + '-' + cc * cc) + '=' + D((m + cc * cc) + '+' + 2 * cc + '\\sqrt{' + m + '}+' + (m + cc * cc) + '-' + 2 * cc + '\\sqrt{' + m + '}', m - cc * cc) + '=' + D(2 * (m + cc * cc), m - cc * cc) + '=' + v), ['Rationalize each fraction (or use the common denominator ' + t(m + '-' + cc * cc) + ').', 'The radical terms cancel.'], 'NR: sum of conjugate quotients');
      } }] }
  ];

  var EXTRA = [
    { num: '1', section: 'A. Skills', stem: 'Write the conjugate of each binomial, and find the product of the binomial and its conjugate.', parts: [
      { id: 'e1a', level: 'BEG', make: function (r) { var z = pickWhere(function () { return { a: r.int(2, 9), m: nsq(r, 2, 15) }; }, function (z) { return !(z.a === 6 && z.m === 7); }); return conjProdP([[z.a, 1], [-1, z.m]], 'conjugate: a − √m (extra)'); } },
      { id: 'e1b', level: 'BEG', make: function (r) { var z = pickWhere(function () { return { p: nsq(r, 5, 23), q: nsq(r, 2, 13) }; }, function (z) { return z.p > z.q && !(z.p === 13 && z.q === 5); }); return conjProdP([[1, z.p], [1, z.q]], 'conjugate: √p + √q (extra)'); } },
      { id: 'e1c', level: 'EMG', make: function (r) { var z = pickWhere(function () { return { k: r.int(2, 4), p: r.pick([2, 3, 5, 7]), j: r.int(2, 4), q: r.pick([2, 3, 5, 7]) }; }, function (z) { return z.p !== z.q && !(z.k === 3 && z.p === 3 && z.j === 2 && z.q === 2); }); return conjProdP([[z.k, z.p], [-z.j, z.q]], 'conjugate: k√p − j√q (extra)'); } }] },
    { num: '2', stem: 'Rationalize the denominator and simplify.', parts: [
      { id: 'e2a', level: 'BEG', make: function (r) { var z = pickWhere(function () { return { m: nsq(r, 2, 17), k: r.int(1, 3) }; }, function (z) { return !(z.m === 6 && z.k === 1); }); return conjP([[(z.m - 1) * z.k, 1]], [[1, z.m], [1, 1]], 'a/(√m + 1) (extra)'); } },
      { id: 'e2b', level: 'BEG', make: function (r) { var z = pickWhere(function () { return { c: r.int(2, 5), m: nsq(r, 2, 24), k: r.int(1, 2) }; }, function (z) { return z.c * z.c > z.m && !(z.c === 3 && z.m === 7); }); return conjP([[(z.c * z.c - z.m) * z.k, 1]], [[z.c, 1], [-1, z.m]], 'a/(c − √m) (extra)'); } },
      { id: 'e2c', level: 'EMG', make: function (r) { var z = pickWhere(function () { return { p: nsq(r, 3, 19), q: nsq(r, 2, 13), k: r.int(1, 3) }; }, function (z) { return z.p > z.q && !(z.p === 11 && z.q === 3 && z.k === 1); }); return conjP([[(z.p - z.q) * z.k, 1]], [[1, z.p], [-1, z.q]], 'a/(√p − √q) (extra)'); } },
      { id: 'e2d', level: 'PRG', make: function (r) { var z = pickWhere(function () { return { m: r.pick([2, 3, 5, 6, 7]), c: r.int(2, 3) }; }, function (z) { return z.m < z.c * z.c && !(z.m === 3 && z.c === 3); }); return conjP([[1, z.m]], [[1, z.m], [z.c, 1]], '√m/(√m + c), negative denominator (extra)'); } },
      { id: 'e2e', level: 'PRG', make: function (r) { var z = pickWhere(function () { return { k: r.int(2, 3), p: r.pick([2, 3, 5]), q: r.pick([2, 3, 5, 7]), j: r.int(1, 3) }; }, function (z) { var R = z.k * z.k * z.p - z.q; return z.p !== z.q && R > 0 && !(z.k === 2 && z.p === 2 && z.q === 5) && R * z.j <= 40; }); var R = z.k * z.k * z.p - z.q; return conjP([[R * z.j, 1]], [[z.k, z.p], [1, z.q]], 'a/(k√p + √q) (extra)'); } },
      { id: 'e2f', level: 'PRG', make: function (r) { var z = pickWhere(function () { return { p: r.pick([3, 5, 7]), q: r.pick([2, 3, 5]) }; }, function (z) { return z.p > z.q && !(z.p === 3 && z.q === 2); }); return conjP([[1, z.p * z.q]], [[1, z.p], [-1, z.q]], '√(pq)/(√p − √q) (extra)'); } }] },
    { num: '3', stem: 'Rationalize the denominator and simplify.', parts: [
      { id: 'e3a', level: 'PRG', make: function (r) { var z = pickWhere(function () { return { m: nsq(r, 2, 15), c: r.int(1, 4) }; }, function (z) { return z.m !== z.c * z.c && !(z.m === 6 && z.c === 2); }); return conjP([[1, z.m], [-z.c, 1]], [[1, z.m], [z.c, 1]], '(√m − c)/(√m + c) (extra)'); } },
      { id: 'e3b', level: 'PRG', make: function (r) { var z = pickWhere(function () { return { m: nsq(r, 2, 15), a: r.int(1, 4), c: 0 }; }, function (z) { var cs = [1, 2, 3, 4].filter(function (c) { return c * c - z.m === 1; }); if (!cs.length) return false; z.c = cs[0]; return !(z.m === 3 && z.a === 1); }); return conjP([[z.a, 1], [1, z.m]], [[z.c, 1], [-1, z.m]], '(a + √m)/(c − √m), denominator 1 (extra)'); } },
      { id: 'e3c', level: 'ADV', make: function (r) { var z = pickWhere(function () { return { p: r.pick([2, 3, 5]), q: r.pick([2, 3, 5, 7]), k: r.int(2, 3) }; }, function (z) { return z.p !== z.q && Math.abs(z.p - z.q) <= 3 && !(z.p === 2 && z.q === 3 && z.k === 3); }); return conjP([[z.k, z.p], [-1, z.q]], [[1, z.p], [1, z.q]], '(k√p − √q)/(√p + √q) (extra)'); } }] },
    { num: '4', section: 'B. Applying', stem: 'Rationalize the denominator. State the restrictions on the variable.', parts: [
      { id: 'e4a', level: 'PRG', make: function (r) {
        var z = pickWhere(function () { return { v: r.pick(['x', 'y', 'n']), c: r.int(1, 5), a: r.int(2, 7) }; }, function (z) { return !(z.c === 1 && z.a === 5); });
        var v = z.v, c2 = z.c * z.c, lead = D(z.a, '\\sqrt{' + v + '}+' + z.c), key = '\\frac{' + z.a + '\\sqrt{' + v + '}-' + z.a * z.c + '}{' + v + '-' + c2 + '}';
        return restrP(t(lead), v, [{ op: '≥', v: 0 }], key, { kind: 'bin', z: c2, alts: [[{ op: '≥', v: 0 }, { op: '≠', v: c2 }]], sol: t(v + '\\ge 0') + ' (for this form also ' + t(v + '\\ne ' + c2) + '; either is accepted)<br>' + t(lead + '\\cdot' + D('\\sqrt{' + v + '}-' + z.c, '\\sqrt{' + v + '}-' + z.c) + '=' + key), hints: ['Can ' + t('\\sqrt{' + v + '}+' + z.c) + ' be 0?', 'Multiply by the conjugate.'], text: 'restrictions: a/(√x + c) (extra)' });
      } },
      { id: 'e4b', level: 'ADV', make: function (r) {
        var z = pickWhere(function () { return { v: r.pick(['y', 'x', 'm']), c: r.int(2, 5) }; }, function (z) { return !(z.v === 'y' && z.c === 3); });
        var v = z.v, c2 = z.c * z.c, lead = D('\\sqrt{' + v + '}+' + z.c, '\\sqrt{' + v + '}-' + z.c), key = '\\frac{' + v + '+' + 2 * z.c + '\\sqrt{' + v + '}+' + c2 + '}{' + v + '-' + c2 + '}';
        return restrP(t(lead), v, [{ op: '≥', v: 0 }, { op: '≠', v: c2 }], key, { kind: 'bin', z: c2, sol: t(v + '\\ge 0,\\ ' + v + '\\ne ' + c2) + '<br>' + t(lead + '\\cdot' + D('\\sqrt{' + v + '}+' + z.c, '\\sqrt{' + v + '}+' + z.c) + '=' + key), hints: ['Where is the denominator 0?', 'Expand ' + t('(\\sqrt{' + v + '}+' + z.c + ')^2') + ' with FOIL.'], text: 'restrictions: (√y + c)/(√y − c) (extra)' });
      } },
      { id: 'e4c', level: 'ADV', make: function (r) {
        var z = pickWhere(function () { return { v: r.pick(['x', 'a', 'n']), p: r.pick([2, 3, 5, 6, 7]), k: r.int(1, 4) }; }, function (z) { return !(z.v === 'x' && z.p === 3 && z.k === 2); });
        var v = z.v, lead = D(cT(z.k) + '\\sqrt{' + v + '}', '\\sqrt{' + v + '}-\\sqrt{' + z.p + '}'), key = '\\frac{' + cT(z.k) + v + '+' + cT(z.k) + '\\sqrt{' + z.p + v + '}}{' + v + '-' + z.p + '}';
        return restrP(t(lead), v, [{ op: '≥', v: 0 }, { op: '≠', v: z.p }], key, { kind: 'bin', z: z.p, sol: t(v + '\\ge 0,\\ ' + v + '\\ne ' + z.p) + '<br>' + t(lead + '\\cdot' + D('\\sqrt{' + v + '}+\\sqrt{' + z.p + '}', '\\sqrt{' + v + '}+\\sqrt{' + z.p + '}') + '=' + key), hints: ['Where is ' + t('\\sqrt{' + v + '}-\\sqrt{' + z.p + '}') + ' equal to 0?', 'Multiply by the conjugate.'], text: 'restrictions: k√x/(√x − √p) (extra)' });
      } }] },
    { num: '5', stem: 'Simplify.', parts: [
      { id: 'e5a', level: 'PRG', make: function (r) {
        var z = pickWhere(function () { return { m: nsq(r, 2, 15), c: r.int(1, 3) }; }, function (z) { return z.m > z.c * z.c && !(z.m === 2 && z.c === 1) && z.m - z.c * z.c <= 6; });
        var f1 = sDiv(S([[1, 1]]), S([[1, z.m], [z.c, 1]])), f2 = sDiv(S([[1, 1]]), S([[1, z.m], [-z.c, 1]])), A = sAdd(f1, f2), d = z.m - z.c * z.c, lead = D(1, '\\sqrt{' + z.m + '}+' + z.c) + '+' + D(1, '\\sqrt{' + z.m + '}-' + z.c);
        return sP(t(lead), A, { sol: t(lead + '=' + D('\\sqrt{' + z.m + '}-' + z.c, d) + '+' + D('\\sqrt{' + z.m + '}+' + z.c, d) + '=' + sTex(A)), hints: ['Rationalize each fraction, then add.'], text: 'sum of conjugate fractions (extra)' });
      } },
      { id: 'e5b', level: 'PRG', make: function (r) {
        var z = pickWhere(function () { return { m: nsq(r, 2, 15), c: r.int(1, 3), j: r.int(1, 3) }; }, function (z) { return z.m > z.c * z.c && !(z.m === 3 && z.c === 1 && z.j === 2); });
        var d = z.m - z.c * z.c, a = z.m * z.j, b = d * z.j, A = sSub(sDiv(S([[a, 1]]), S([[1, z.m]])), sDiv(S([[b, 1]]), S([[1, z.m], [-z.c, 1]]))), lead = D(a, '\\sqrt{' + z.m + '}') + '-' + D(b, '\\sqrt{' + z.m + '}-' + z.c);
        return sP(t(lead), A, { sol: t(lead + '=' + cT(z.j) + '\\sqrt{' + z.m + '}-' + D(b + '(\\sqrt{' + z.m + '}+' + z.c + ')', d) + '=' + cT(z.j) + '\\sqrt{' + z.m + '}-(' + kT(sDiv(S([[b, 1]]), S([[1, z.m], [-z.c, 1]]))) + ')=' + sTex(A)), hints: ['Rationalize both fractions, then subtract — watch the brackets.'], text: 'difference that comes out rational (extra)' });
      } }] },
    { num: '6', stem: '', parts: [
      { id: 'e6', level: 'PRG', make: function (r) {
        var z = pickWhere(function () { return { m: r.pick([2, 3, 5, 6, 7]), s1: r.int(2, 5), s2: r.int(1, 4), c: r.int(1, 3) }; }, function (z) { return z.s1 > z.s2 && z.m !== z.c * z.c && !(z.m === 2 && z.s1 === 3 && z.s2 === 2 && z.c === 1) && small(sDiv(S([[z.s1 - z.s2, z.m]]), S([[1, z.m], [z.c, 1]])), 6); });
        return conjP([[1, z.s1 * z.s1 * z.m], [-1, z.s2 * z.s2 * z.m]], [[1, z.m], [z.c, 1]], 'collect, then rationalize (extra)', { prompt: 'Simplify ' + t(D(raw([[1, z.s1 * z.s1 * z.m], [-1, z.s2 * z.s2 * z.m]]), '\\sqrt{' + z.m + '}+' + z.c)) + '.' });
      } }] },
    { num: '7', stem: '', parts: [
      { id: 'e7', level: 'PRG', make: function (r) {
        var z = pickWhere(function () { return { p: nsq(r, 3, 19), q: nsq(r, 2, 15) }; }, function (z) { return z.p > z.q && !(z.p === 6 && z.q === 3) && z.p - z.q <= 12; });
        var A = z.p - z.q, w = S([[1, z.p], [-1, z.q]]), wT = kT(w), P = S([[4, z.p]]);
        var p = FL('A rectangle has an area of ' + t(A) + '&nbsp;m² and a length of ' + t('(\\sqrt{' + z.p + '}+\\sqrt{' + z.q + '})') + '&nbsp;m. Determine its exact width and perimeter.',
          [{ label: 'Width:', name: 'Width', mode: 'math', keys: KS, placeholder: 'e.g. 3sqrt(2)', after: '\\text{m}' }, { label: 'Perimeter:', name: 'Perimeter', mode: 'math', keys: KS, placeholder: 'e.g. 3sqrt(2)', after: '\\text{m}' }],
          [RX(wT), RX(sTex(P), { cands: [[sTex(S([[2, z.p]])), LID + '-half-p', 'The perimeter has two lengths and two widths.']] })], [wT, sTex(P)],
          'Width ' + t(wT) + '&nbsp;m, perimeter ' + t(sTex(P)) + '&nbsp;m', t('w=' + D(A, '\\sqrt{' + z.p + '}+\\sqrt{' + z.q + '}') + '\\cdot' + D(wT, wT) + '=' + D(A + '(' + wT + ')', z.p + '-' + z.q) + '=' + wT) + '&nbsp;m; ' + t('P=2(\\sqrt{' + z.p + '}+\\sqrt{' + z.q + '})+2(' + wT + ')=' + sTex(P)) + '&nbsp;m', ['Width = area ÷ length; multiply by the conjugate.'], 'rectangle width and perimeter (extra)');
        return p;
      } }] },
    { num: '8', stem: '', parts: [
      { id: 'e8', level: 'PRG', make: function (r) {
        var z = pickWhere(function () { return { m: nsq(r, 2, 15), c: r.int(1, 3) }; }, function (z) { return z.m !== z.c * z.c && !(z.m === 5 && z.c === 2); });
        var m = z.m, c = z.c, sq = S([[m + c * c, 1], [2 * c, m]]);
        return mcP(r, 'Which expression is a rational number?', [
          { html: t(D(1, '\\sqrt{' + m + '}-' + c)), why: 'It equals ' + t(sTex(sDiv(S([[1, 1]]), S([[1, m], [-c, 1]])))) + ' — still has a radical.' },
          { html: t('(\\sqrt{' + m + '}+' + c + ')(\\sqrt{' + m + '}-' + c + ')'), right: true },
          { html: t('(\\sqrt{' + m + '}+' + c + ')^2'), why: 'It equals ' + t(kT(sq)) + ' — the middle term keeps a radical.' },
          { html: t(D('\\sqrt{' + m + '}', '\\sqrt{' + m + '}+' + c)), why: 'It equals ' + t(sTex(sDiv(S([[1, m]]), S([[1, m], [c, 1]])))) + ' — irrational.' }],
          t('(\\sqrt{' + m + '}+' + c + ')(\\sqrt{' + m + '}-' + c + ')=' + m + '-' + c * c + '=' + (m - c * c)) + ' is rational: the product of conjugates. The others still contain ' + t('\\sqrt{' + m + '}') + '.', ['Which one is a product of conjugates?'], 'which is rational');
      } }] },
    { num: '9', stem: '', parts: [
      { id: 'e9', level: 'ADV', make: function (r) {
        var c = r.pick([1, 2, 4, 5, 6]), m = c * c + 1;
        return nrP('The expression ' + t(D(1, '\\sqrt{' + m + '}-' + c)) + ' can be written as ' + t('a+\\sqrt{b}') + ', where ' + t('a') + ' and ' + t('b') + ' are whole numbers. The value of ' + t('a+b') + ' is ____.', c + m,
          [[m - c, LID + '-num-sign', 'Multiply by the conjugate ' + t('\\sqrt{' + m + '}+' + c) + ': the result is ' + t(c + '+\\sqrt{' + m + '}') + '.']], t(D('\\sqrt{' + m + '}+' + c, m + '-' + c * c) + '=' + c + '+\\sqrt{' + m + '}') + ', so ' + t('a+b=' + c + '+' + m + '=' + (c + m)), HC, 'NR: a + √b');
      } }] },
    { num: '10', section: 'C. Stretch', stem: '', parts: [
      { id: 'e10', level: 'MAS', make: function (r) {
        var k = r.int(2, 6), v = r.pick(['x', 'x', 'a', 'n']), key = k === 1 ? '\\sqrt{' + v + '+' + k + '}+\\sqrt{' + v + '}' : '\\frac{\\sqrt{' + v + '+' + k + '}+\\sqrt{' + v + '}}{' + k + '}', lead = D(1, '\\sqrt{' + v + '+' + k + '}-\\sqrt{' + v + '}');
        return radP('Rationalize the denominator of ' + t(lead) + ', ' + t(v + '\\ge 0') + '.', key, { vars: [v], sumRad: true, sol: t(lead + '\\cdot' + D('\\sqrt{' + v + '+' + k + '}+\\sqrt{' + v + '}', '\\sqrt{' + v + '+' + k + '}+\\sqrt{' + v + '}') + '=' + D('\\sqrt{' + v + '+' + k + '}+\\sqrt{' + v + '}', '(' + v + '+' + k + ')-' + v) + '=' + key), hints: ['The conjugate is ' + t('\\sqrt{' + v + '+' + k + '}+\\sqrt{' + v + '}') + '.', t('(\\sqrt{' + v + '+' + k + '})^2-(\\sqrt{' + v + '})^2=(' + v + '+' + k + ')-' + v) + '.'], text: 'conjugate with variable radicands',
          cands: [['\\sqrt{' + v + '+' + k + '}+\\sqrt{' + v + '}', LID + '-den-one', 'The denominator becomes ' + t('(' + v + '+' + k + ')-' + v + '=' + k) + ', not 1.']] });
      } }] },
    { num: '11', stem: '', parts: [
      { id: 'e11', level: 'MAS', make: function (r) {
        var a = r.pick([5, 6, 10, 13, 14]), b = a + 1, N = S([[1, 1], [1, a], [-1, b]]), A = sDiv(N, S([[2, a]])), lead = D(1, '1+\\sqrt{' + a + '}+\\sqrt{' + b + '}');
        return sP('Rationalize the denominator of ' + t(lead) + '. (Hint: group it as ' + t('(1+\\sqrt{' + a + '})+\\sqrt{' + b + '}') + ' and multiply by ' + t('(1+\\sqrt{' + a + '})-\\sqrt{' + b + '}') + '; then rationalize again.)', A, {
          sol: 'Denominator: ' + t('(1+\\sqrt{' + a + '})^2-' + b + '=' + (1 + a) + '+2\\sqrt{' + a + '}-' + b + '=2\\sqrt{' + a + '}') + ', so the expression is ' + t(D('1+\\sqrt{' + a + '}-\\sqrt{' + b + '}', '2\\sqrt{' + a + '}')) + '.<br>Multiply by ' + t(D('\\sqrt{' + a + '}', '\\sqrt{' + a + '}')) + ': ' + t(D(kT(sMul(N, S([[1, a]]))), 2 * a) + (sDen(A) === 2 * a ? '' : '=' + sTex(A))) + '.',
          hints: ['Multiply by ' + t('(1+\\sqrt{' + a + '})-\\sqrt{' + b + '}') + ' first: the denominator becomes ' + t('2\\sqrt{' + a + '}') + '.', 'Then rationalize the one-term denominator.'], text: 'three-term denominator' });
      } }] },
    { num: '12', stem: '', parts: [
      { id: 'e12', level: 'MAS', make: function (r) {
        var p = r.pick([3, 5, 7]), s = r.pick([-1, 1]), d = p - s, sg = s < 0 ? '+' : '-';
        var key = '\\frac{\\sqrt[3]{' + p * p + '}' + (s < 0 ? '-' : '+') + '\\sqrt[3]{' + p + '}+1}{' + d + '}'; // 1/(∛p − 1) -> (∛p² + ∛p + 1)/(p − 1); 1/(∛p + 1) -> (∛p² − ∛p + 1)/(p + 1)
        var lead = D(1, '\\sqrt[3]{' + p + '}' + (s > 0 ? '-' : '+') + '1'), f = s > 0 ? '(a-b)(a^2+ab+b^2)=a^3-b^3' : '(a+b)(a^2-ab+b^2)=a^3+b^3', mult = '\\sqrt[3]{' + p * p + '}' + (s > 0 ? '+' : '-') + '\\sqrt[3]{' + p + '}+1';
        return radP('Use ' + t(f) + ' with ' + t('a=\\sqrt[3]{' + p + '}') + ' and ' + t('b=1') + ' to rationalize the denominator of ' + t(lead) + '.', key, {
          sol: 'Multiply by ' + t(mult) + ': the denominator becomes ' + t('(\\sqrt[3]{' + p + '})^3' + (s > 0 ? '-' : '+') + '1^3=' + p + (s > 0 ? '-' : '+') + '1=' + d) + '.<br>' + t(lead + '=' + key), hints: ['Multiply the top and bottom by ' + t(s > 0 ? 'a^2+ab+b^2' : 'a^2-ab+b^2') + '.', t('a^2=\\sqrt[3]{' + p * p + '}') + '.'], text: 'cube-root binomial denominator' });
      } }] }
  ];

  HW.defineLesson({ id: LID, unit: 2, num: 6, title: 'Rationalizing Binomial Denominators with Conjugates', outcome: 'AN2', calc: true, questions: QUESTIONS, extra: EXTRA });
})(window);
