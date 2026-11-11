/* Math 20-1 · Unit 2 · Lesson 1 — Mixed and Entire Radicals (outcome AN2 on every part)
 * Assignment 1 (u2_l01.tex, Questions 1–18) and the Lesson 1 Extra Practice (u2_ep01.tex, A1–A4, B1–B7, C1–C3).
 * Every part is a generator: the booklet question's idea, form and difficulty with new numbers (the lesson's example
 * numbers and the booklet's own numbers are left out where that is easy). No calculator (Unit 2): exact answers in
 * simplest form; the approximation questions use the given value of the root.
 *
 * This file also holds the radical kit shared with Lesson 2 (HW.p21rad: mixed/entire radicals of any index, with or
 * without variables, their checkers and diagnoses — adapted from the Math 10C Unit 1 Lesson 8 practice), so it must
 * load before u2l2.js.
 *
 * Conversions: "evaluate where possible" → one answer box with a "none" key for "not a real number"; "true or false,
 * correct the false ones / show a check" → true/false with the check in the worked solution; "classify" → a table of
 * choices; "explain the mistake and correct it" → multiple choice of reasons, then the corrected answer; "explain how to
 * order" → multiple choice of methods; "write it in every possible way" (Stretch C1) → tap every correct form, then the
 * simplest form; "decide which is greater" (C3) → multiple choice.
 * Levels: LIM BEG EMG PRG ADV MAS. Mastery: Extra C2 (largest k with k√m < U) and C3 (compare ∛a with √b). */
(function (root) {
  'use strict';
  var HW = root.HW, ex = HW.ex, F = HW.fmt, K = HW.kit, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
  var LID = 'u2l1';

  HW.addCodes({
    'neg-root': 'Lost the sign of an odd root of a negative', 'coef-lost': 'Forgot to multiply by the coefficient in front',
    'wrong-power': 'Took out a perfect square (or wrong power) instead of the index’s power', 'even-neg': 'Put a negative under an even root',
    'den-power': 'Raised only part of a fraction coefficient', 'rad-decimal': 'Decimal under the radical', 'var-no-power': 'Didn’t multiply the variable exponent by the index',
    'outside-lost': 'Dropped the factor in front of the radical', 'dropped-rem': 'Dropped the leftover under the radical', 'kept-inside': 'Took a factor out but left it inside too',
    added: 'Added instead of multiplying',
    'u2l1-even-neg': 'Gave a value for an even root of a negative', 'u2l1-odd-neg': 'Said an odd root of a negative is not real',
    'u2l1-outside-neg': 'Said “not real” when the negative is outside the root', 'u2l1-none': 'Said “not real” for a real root',
    'u2l1-odd-sign': 'Odd root of a negative given as positive', 'u2l1-pm': 'Gave ± for the principal root', 'u2l1-divided-index': 'Divided by the index instead of taking the root',
    'u2l1-no-root': 'Didn’t take the root', 'u2l1-top-only': 'Took the root of the numerator only', 'u2l1-bottom-only': 'Took the root of the denominator only',
    'u2l1-dec-place': 'Decimal point in the wrong place', 'u2l1-unevaluated': 'Left a root unevaluated', 'u2l1-between': 'Wrong pair of whole numbers',
    'u2l1-between-root': 'Used the wrong kind of root for the bounds', 'u2l1-classify': 'Classified a number wrongly', 'u2l1-given': 'Didn’t use the given value exactly',
    'u2l1-place': 'Right digits, wrong place value', 'u2l1-perimeter': 'Perimeter not 4 × side', 'u2l1-area-side': 'Side of the scaled square wrong',
    'u2l1-hyp-add': 'Added the legs instead of their squares', 'u2l1-dist': 'Distance: squares of the changes added wrong', 'u2l1-select': 'Missed or added a form',
    'u2l1-k': 'Largest whole number wrong', 'u2l1-k-off': 'Off by one (k² m must stay below U²)', 'u2l1-nr-sum': 'Gave p or q instead of p + q', 'u2l1-nr-square': 'Didn’t square the coefficient'
  });
  HW.addPartial({ 'neg-root': 's', 'coef-lost': 'b', 'wrong-power': 'n', 'even-neg': 'n', 'den-power': 'b', 'var-no-power': 'b', 'outside-lost': 'b', 'dropped-rem': 'b', 'kept-inside': 'b', added: 'n',
    'u2l1-even-neg': 'n', 'u2l1-odd-neg': 'n', 'u2l1-outside-neg': 'n', 'u2l1-none': 'n', 'u2l1-odd-sign': 's', 'u2l1-pm': 's', 'u2l1-divided-index': 'n', 'u2l1-no-root': 'n',
    'u2l1-top-only': 'b', 'u2l1-bottom-only': 'b', 'u2l1-dec-place': 's', 'u2l1-between': 'n', 'u2l1-between-root': 'n', 'u2l1-classify': 'n', 'u2l1-place': 's',
    'u2l1-perimeter': 'b', 'u2l1-area-side': 'n', 'u2l1-hyp-add': 'n', 'u2l1-dist': 'b', 'u2l1-select': 'b', 'u2l1-k': 'n', 'u2l1-k-off': 's', 'u2l1-nr-sum': 'b', 'u2l1-nr-square': 'n' });

  /* ============================== the radical kit (Lessons 1–2) ============================== */
  var RK = HW.p21rad = {};
  function Rq(c) { return typeof c === 'number' ? [c, 1] : c; }
  function rq(c) { c = Rq(c); return c[0] / c[1]; }
  function pw(a, n) { return Math.pow(a, n); }
  function rt(n, inner) { return ex.texRoot(n, inner); }
  var POW = { 2: 'square', 3: 'cube', 4: 'fourth power', 5: 'fifth power', 6: 'sixth power' };
  var ROOT = { 2: 'square root', 3: 'cube root', 4: 'fourth root', 5: 'fifth root', 6: 'sixth root' };
  var LIST = { 2: '4,\\ 9,\\ 16,\\ 25,\\ 36,\\ 49,\\ 64,\\ 81,\\ 100,\\ 121,\\ 144', 3: '8,\\ 27,\\ 64,\\ 125,\\ 216,\\ 343,\\ 512,\\ 729,\\ 1\\,000',
    4: '16,\\ 81,\\ 256,\\ 625,\\ 1\\,296', 5: '32,\\ 243,\\ 1\\,024,\\ 3\\,125' };
  var SF = [2, 3, 5, 6, 7, 10, 11, 13, 14, 15];
  function coefTex(k) { k = Rq(k); if (k[1] === 1) return k[0] === 1 ? '' : k[0] === -1 ? '-' : String(k[0]); return (k[0] < 0 ? '-' : '') + '\\frac{' + Math.abs(k[0]) + '}{' + k[1] + '}'; }
  function given(c, n, R) { return coefTex(c) + rt(n, F(R)); }
  function mixTex(k, n, m) { return m === 1 ? ex.texRat(Rq(k)) : coefTex(k) + rt(n, F(m)); }
  function ratTex(r) { return ex.texRat(Rq(r)); }
  function isPow(N, n) { var s = Math.round(Math.pow(N, 1 / n)); return pw(s, n) === N; }
  function pickWhere(gen, test, dflt) { for (var i = 0; i < 600; i++) { var v = gen(); if (test(v)) return v; } return dflt; }
  /* a radicand f^n·t whose largest perfect nth-power factor is exactly f^n (t > 1), not in excl */
  function pickR(r, n, fs, ts, dflt, excl) {
    for (var i = 0; i < 500; i++) {
      var f = r.pick(fs), tt = r.pick(ts), R = pw(f, n) * tt;
      if (tt > 1 && ex.nthFactor(R, n) === f && (!excl || excl.indexOf(R) < 0)) return R;
    }
    return dflt;
  }
  function hintsFor(n, A) {
    return ['Find the <b>largest</b> perfect ' + POW[n] + ' that divides ' + t(F(A)) + '. Perfect ' + POW[n] + 's: ' + t(LIST[n] + ',\\ \\ldots'),
      'Write ' + t(F(A)) + ' as (perfect ' + POW[n] + ') ' + t('\\times') + ' (what’s left). The ' + ROOT[n] + ' of the perfect ' + POW[n] + ' comes out in front.'];
  }
  function mixDiag(c, n, R, f, m, k) {
    var A = Math.abs(R), cA = Math.abs(rq(c)), V = rq(k) * pw(m, 1 / n), hasC = !(c[0] === 1 && c[1] === 1);
    return function (val, r) {
      if (R < 0 && ex.eq(val, -V)) return { code: 'neg-root', hint: 'Watch the sign: an odd root of a negative number is negative, e.g. ' + t(rt(n, '-' + pw(f, n)) + '=-' + f) + '.' };
      if (hasC && ex.eq(val, V / rq(c))) return { code: 'coef-lost', hint: 'You simplified ' + t(rt(n, F(R))) + ' correctly — now multiply by the ' + t(ratTex(c)) + ' in front.' };
      if (hasC && ex.eq(val, -V / rq(c))) return { code: 'coef-lost', hint: 'Simplify ' + t(rt(n, F(R))) + ' first, then multiply by the ' + t(ratTex(c)) + ' in front (watch the sign).' };
      if (hasC && Number.isInteger(cA) && cA > 1 && r && r.n === n && r.m === m && ex.eq(Math.abs(rq(r.k)), cA + f)) return { code: 'added', hint: 'The ' + t(f) + ' that comes out of the root <b>multiplies</b> the ' + t(cA) + ' already in front — don’t add them.' };
      if (!r || r.n !== n) return null;
      var g = Math.abs(rq(r.k)) / cA;
      if (r.m === m && f > 1 && ex.eq(g, pw(f, n))) return { code: 'coef-power', hint: 'You found the right factor, but ' + t(F(pw(f, n))) + ' comes out of the ' + ROOT[n] + ' as ' + t(rt(n, F(pw(f, n))) + '=' + f) + ', not as ' + t(F(pw(f, n))) + '.' };
      if (Number.isInteger(Math.round(g * 1e9) / 1e9) && g > 1) {
        g = Math.round(g);
        for (var j = 2; j <= 5; j++) if (j !== n && pw(g, j) * r.m === A)
          return { code: 'wrong-power', hint: t(F(pw(g, j)) + '=' + g + '^{' + j + '}') + ' is a perfect ' + POW[j] + ', but this is a ' + ROOT[n] + ': ' + t(rt(n, F(pw(g, j))) + '\\neq ' + g) + '. Look for a perfect <b>' + POW[n] + '</b> factor instead.' };
        if (g * r.m === A) return { code: 'divided', hint: 'Check: ' + t(g + '\\times ' + F(r.m) + '=' + F(A)) + ', but a number in front of a ' + ROOT[n] + ' stands for its ' + POW[n] + ' inside. Look for a perfect ' + POW[n] + ' factor of ' + t(F(A)) + '.' };
      }
      return null;
    };
  }
  /* c·ⁿ√R → simplest mixed radical (R may be negative for an odd index) */
  function mixPart(c, n, R, o) {
    o = o || {}; c = Rq(c);
    var A = Math.abs(R), f = ex.nthFactor(A, n), m = A / pw(f, n), sg = R < 0 ? -1 : 1, k = ex.norm(c[0] * sg * f, c[1]);
    var hasC = !(c[0] === 1 && c[1] === 1), inner = mixTex([sg * f, 1], n, m), key = mixTex(k, n, m);
    var sol = 'The largest perfect ' + POW[n] + ' that divides ' + t(F(A)) + ' is ' + t(F(pw(f, n)) + '=' + f + '^{' + n + '}') + ', because ' + t(F(A) + '=' + F(pw(f, n)) + '\\times ' + F(m)) + '.<br>';
    if (R < 0) sol += 'The index is odd, so the negative sign comes out of the root: ' + t(rt(n, F(R)) + '=-' + rt(n, F(A))) + '.<br>';
    sol += t(rt(n, F(R)) + '=' + (sg < 0 ? '-' : '') + rt(n, F(pw(f, n)) + '\\times ' + F(m)) + '=' + (sg < 0 ? '-' : '') + rt(n, F(pw(f, n))) + '\\times ' + rt(n, F(m)) + '=' + inner) + '.';
    if (hasC) sol += '<br>Multiply by the coefficient: ' + t(ratTex(c) + '\\times ' + (sg < 0 ? '(-' + f + ')' : f) + '=' + ratTex(k)) + ', so ' + t(given(c, n, R) + '=' + key) + '.';
    var good = [], bad = [];
    if (n % 2 && k[0] < 0 && m > 1) good.push(coefTex([-k[0], k[1]]) + rt(n, '-' + m));
    if (f > 1) bad.push(coefTex(ex.norm(c[0] * sg * pw(f, n), c[1])) + rt(n, F(m)));
    if (n !== 2) bad.push(mixTex(k, 2, m === 1 ? 2 : m));
    bad.push(given(c, n, R));
    var p = P.math(o.prompt || t(given(c, n, R)), K.radical({ k: k, n: n, m: m }, 'mixed', { diag: mixDiag(c, n, R, f, m, k) }), key, o.sol || sol, o.hints || hintsFor(n, A), o.text || 'mixed: ' + given(c, n, R), { keys: 'radical' });
    if (f === 1) { p.bad = []; } else p.bad = bad;
    p.good = good; p.spec = { k: k, n: n, m: m, f: f };
    return p;
  }
  /* c·ⁿ√m → entire radical (a negative stays outside for an even index; a fraction coefficient allowed) */
  function entireInfo(c, n, m) {
    c = Rq(c);
    var neg = c[0] < 0, A = ex.norm(pw(Math.abs(c[0]), n) * m, pw(c[1], n));
    var radT = A[1] === 1 ? F(A[0]) : ratTex(A), key = neg ? (n % 2 ? rt(n, '-' + radT) : '-' + rt(n, radT)) : rt(n, radT);
    return { c: c, n: n, m: m, neg: neg, A: A, key: key, radT: radT, V: (neg ? -1 : 1) * pw(A[0] / A[1], 1 / n) };
  }
  function entireCheck(c, n, m) {
    var I = entireInfo(c, n, m), cA = Math.abs(rq(I.c)), V = I.V, pAbs = Math.abs(I.c[0]), q = I.c[1];
    return function (resp) {
      var a = K.read(resp); if (a.res) return a.res;
      var node = a.ast; while (node.t === 'neg' || node.t === 'paren') node = node.a;
      var isRoot = node.t === 'root', idx = isRoot ? ex.rat(node.n) : null, rad = isRoot ? ex.rat(node.a) : null, ni = idx && idx[1] === 1 ? idx[0] : null;
      if (ex.eq(a.val, V)) {
        if (!isRoot || !rad) return form('not-entire', 'Right value, but an entire radical has nothing in front of the root' + (I.neg && n % 2 === 0 ? ' except the negative sign' : '') + '. Move ' + t(ratTex(I.neg && n % 2 === 0 ? [pAbs, q] : I.c)) + ' inside: raise it to the power ' + t(n) + ' first.');
        if (ni !== n) return form('index', 'Right value, but keep the index ' + t(n) + ' (a ' + ROOT[n] + ').');
        if (ex.shape(node.a).decimals) return form('rad-decimal', 'Right value — write the number under the root as a whole number or a fraction.');
        var pf = ex.plainFraction(node.a);
        if (!pf) return form('simplify', 'Right value — now multiply out what’s under the root so it is a single number.');
        if (pf[1] !== 1 && ex.gcd(pf[0], pf[1]) > 1) return form('lowest', 'Right value — reduce the fraction under the root to lowest terms.');
        return ok();
      }
      if (isRoot && ni && ni % 2 === 0 && rad && rad[0] < 0) return wrong('even-neg', 'With an even index the radicand can’t be negative: ' + t(rt(ni, '-' + Math.abs(rad[0]))) + ' is not a real number. A negative coefficient has to stay <b>outside</b> the root.');
      if (isRoot && ni === n && rad) {
        var rv = Math.abs(rad[0] / rad[1]);
        if (ex.eq(Math.abs(a.val), Math.abs(V))) return wrong('sign', I.neg ? (n % 2 ? 'Check the sign. The index is odd, so the negative goes inside with the coefficient: ' + t('(' + ratTex(I.c) + ')^{' + n + '}') + ' is negative' : 'Check the sign. The index is even, so the negative must stay outside: ' + t('-' + rt(n, '\\ldots'))) + '.' : 'Check the sign of your answer.');
        if (cA !== 1 && ex.eq(rv, cA * m)) return wrong('no-power', 'Before ' + t(ratTex([pAbs, q])) + ' moves inside, raise it to the power ' + t(n) + ': ' + t(ratTex([pAbs, q]) + '=' + rt(n, ratTex(ex.norm(pw(pAbs, n), pw(q, n))))) + '.');
        if (ex.eq(rv, pw(cA, n) + m)) return wrong('added', 'Multiply ' + t(ratTex(ex.norm(pw(pAbs, n), pw(q, n)))) + ' by ' + t(m) + ' — don’t add them.');
        if (q > 1 && (ex.eq(rv, pw(pAbs, n) * m / q) || ex.eq(rv, pAbs * m / pw(q, n)))) return wrong('den-power', 'Raise the <b>whole</b> fraction to the power ' + t(n) + ': ' + t('\\left(\\frac{' + pAbs + '}{' + q + '}\\right)^{' + n + '}=\\frac{' + pw(pAbs, n) + '}{' + pw(q, n) + '}') + '.');
        for (var j = 2; j <= 5; j++) if (j !== n && cA > 1 && ex.eq(rv, pw(cA, j) * m)) return wrong('wrong-power', 'The index is ' + t(n) + ', so the coefficient is raised to the power ' + t(n) + ' (not ' + t(j) + ') when it moves inside.');
      }
      if (isRoot && ni && ni !== n) return wrong('index', 'Keep the index: this is a ' + ROOT[n] + '.');
      return wrong('value', null);
    };
  }
  function entirePart(c, n, m, o) {
    o = o || {};
    var I = entireInfo(c, n, m), pAbs = Math.abs(I.c[0]), q = I.c[1], cAt = ratTex([pAbs, q]), powT = ratTex(ex.norm(pw(pAbs, n), pw(q, n)));
    var sol = '';
    if (I.neg && n % 2 === 0) sol += 'The index is even, so the negative sign stays <b>outside</b> (' + t(rt(n, I.radT)) + ' is never negative). Move only ' + t(cAt) + ' inside.<br>' + t(cAt + '=' + rt(n, powT)) + ', so ' + t(given([pAbs, q], n, m) + '=' + rt(n, powT + '\\times ' + m) + '=' + rt(n, I.radT)) + '.<br>So ' + t(given(I.c, n, m) + '=' + I.key) + '.';
    else if (I.neg) sol += 'The index is odd, so the negative sign can go inside: ' + t('\\left(' + ratTex(I.c) + '\\right)^{' + n + '}=-' + powT) + '.<br>' + t(given(I.c, n, m) + '=' + rt(n, '(-' + powT + ')\\times ' + m) + '=' + I.key) + ' (or ' + t('-' + rt(n, I.radT)) + ').';
    else sol += 'Raise the coefficient to the power ' + t(n) + ': ' + t('\\left(' + cAt + '\\right)^{' + n + '}=' + powT) + '.<br>' + t(given(I.c, n, m) + '=' + rt(n, powT + '\\times ' + m) + '=' + I.key) + '.';
    var good = []; if (I.neg && n % 2) good.push('-' + rt(n, I.radT));
    var bad = [given(I.c, n, m), rt(n, String(Math.max(2, Math.round(pAbs * m / q))))];
    if (I.neg && n % 2 === 0) bad.push(rt(n, '-' + I.radT));
    if (I.neg) bad.push(rt(n, I.radT));
    var p = P.math(o.prompt || t(given(I.c, n, m)), entireCheck(I.c, n, m), I.key, sol,
      o.hints || ['Write the coefficient as a ' + ROOT[n] + ': raise it to the power ' + t(n) + '. Then multiply the two radicands.', n % 2 === 0 ? 'With an even index, a negative sign stays in front of the root.' : 'With an odd index, a negative sign can move inside the root.'],
      o.text || 'entire: ' + given(I.c, n, m), { keys: 'radical' });
    p.good = good; p.bad = bad; p.info = I;
    return p;
  }

  /* ---------- radicals with variables. A monomial is (k, {x: e, …}) ---------- */
  function vtex(k, v) { return ex.texMono(Rq(k), v || {}).replace(/^(-?)(\d{4,})/, function (m0, sg, d) { return sg + F(Number(d)); }); }
  function vout(k, v) { var s = vtex(k, v); return s === '1' ? '' : s === '-1' ? '-' : s; }
  function sameV(a, b) { var ka = Object.keys(a).filter(function (x) { return a[x]; }), kb = Object.keys(b).filter(function (x) { return b[x]; }); return ka.length === kb.length && ka.every(function (x) { return a[x] === b[x]; }); }
  function sameK(a, b) { return a[0] * b[1] === a[1] * b[0]; }
  function vp(x, e) { return e === 1 ? x : x + '^{' + e + '}'; }
  function addV(a, b, mult) { var o = {}; Object.keys(a).forEach(function (x) { o[x] = a[x]; }); Object.keys(b).forEach(function (x) { o[x] = (o[x] || 0) + (mult || 1) * b[x]; }); return o; }
  /* outside·ⁿ√(inside) → entire radical */
  function varEntire(oK, oV, n, iK, iV, o) {
    o = o || {}; oK = Rq(oK);
    var neg = oK[0] < 0, ak = [Math.abs(oK[0]), oK[1]], pk = ex.norm(pw(ak[0], n) * iK, pw(ak[1], n));
    var rv = addV(iV, oV, n), radIn = vtex(pk, rv), target = neg ? (n % 2 ? rt(n, '-' + radIn) : '-' + rt(n, radIn)) : rt(n, radIn);
    var prompt = vout(oK, oV) + rt(n, vtex(iK, iV));
    var outPow = vtex(ex.norm((neg && n % 2 ? -1 : 1) * pw(ak[0], n), pw(ak[1], n)), addV({}, oV, n));
    var sol = (neg && n % 2 === 0 ? 'Even index: the negative sign stays outside. ' : '') + 'Raise everything in front to the power ' + t(n) + ': ' +
      t('\\left(' + vout(neg && n % 2 === 0 ? ak : oK, oV) + '\\right)^{' + n + '}=' + outPow) + '.<br>Multiply by the radicand: ' + t(outPow + '\\cdot ' + vtex(iK, iV) + '=' + (neg && n % 2 ? '-' : '') + radIn) + '.<br>So ' + t(prompt + '=' + target) + (neg && n % 2 ? ' (or ' + t('-' + rt(n, radIn)) + ')' : '') + '.';
    var chk = K.varRadical(target, 'entire', { diag: function (r) {
      if (!r || r.n !== n || Object.keys(r.vars).length || Math.abs(r.k[0]) !== 1 || r.k[1] !== 1) return null;
      if (neg && r.k[0] > 0 && r.rad.m === pk[0] && sameV(r.rad.vars, rv)) return { code: 'sign', hint: n % 2 ? 'Check the sign: ' + t('(' + vout(oK, oV) + ')^{' + n + '}') + ' is negative, so the radicand is negative (or put the ' + t('-') + ' in front of the root).' : 'Check the sign: with an even index the ' + t('-') + ' stays in front of the root.' };
      if (!(ak[0] === 1 && ak[1] === 1) && ex.eq(r.rad.m, rq(ak) * iK)) return { code: 'no-power', hint: 'Raise the coefficient to the power ' + t(n) + ' before it moves inside: ' + t((ak[1] === 1 ? ak[0] : '\\left(' + ratTex(ak) + '\\right)') + '^{' + n + '}=' + ratTex(ex.norm(pw(ak[0], n), pw(ak[1], n)))) + '.' };
      var vs = Object.keys(oV).filter(function (x) { return (r.rad.vars[x] || 0) === (iV[x] || 0) + oV[x]; });
      if (vs.length) { var x = vs[0]; return { code: 'var-no-power', hint: 'When ' + t(vp(x, oV[x])) + ' moves inside a ' + ROOT[n] + ' it becomes ' + t('\\left(' + vp(x, oV[x]) + '\\right)^{' + n + '}=' + vp(x, n * oV[x])) + ' — multiply its exponent by ' + t(n) + '.' }; }
      return null;
    } });
    if (neg && n % 2 === 0) { var chk0 = chk; chk = function (resp) { if (new RegExp('\\\\sqrt' + (n === 2 ? '' : '\\[' + n + '\\]') + '\\{\\s*-').test(String(resp || ''))) return wrong('even-neg', 'With an even index the radicand can’t be negative. The negative sign stays <b>outside</b> the root: ' + t('-' + rt(n, '\\ldots')) + '.'); return chk0(resp); }; }
    var p = P.math(o.prompt || t(prompt), chk, target, o.sol || sol, o.hints || ['Raise the coefficient <b>and</b> each variable in front to the power ' + t(n) + ' (multiply each exponent by ' + t(n) + ').', neg ? (n % 2 ? 'Odd index: the negative sign can go inside.' : 'Even index: the negative sign stays in front of the root.') : 'Then multiply by what is already under the root — add the exponents of the same variable.'], o.text || 'entire (variables): ' + prompt, { keys: 'var' });
    p.good = neg && n % 2 ? ['-' + rt(n, radIn)] : []; p.bad = [prompt, rt(n, vtex([ak[0] * iK, 1], addV(iV, oV)))];
    if (neg && n % 2 === 0) p.bad.push(rt(n, radIn));
    return p;
  }
  /* outside·ⁿ√(inside) → simplest mixed radical; iK may be negative for an odd index */
  function varMixed(oK, oV, n, iK, iV, o) {
    o = o || {}; oK = Rq(oK);
    var sg = iK < 0 ? -1 : 1, iA = Math.abs(iK);
    var s = ex.nthFactor(iA, n), tt = iA / pw(s, n), q = {}, rem = {}, big = {};
    Object.keys(iV).forEach(function (x) { var Q = Math.floor(iV[x] / n), Rm = iV[x] % n; if (Q) { q[x] = Q; big[x] = Q * n; } if (Rm) rem[x] = Rm; });
    var ansK = ex.norm(oK[0] * sg * s, oK[1]), ansOut = addV(oV, q), hasRad = tt > 1 || Object.keys(rem).length, inTex = vtex([tt, 1], rem);
    var target = hasRad ? vout(ansK, ansOut) + rt(n, inTex) : vtex(ansK, ansOut);
    var hasOut = !(oK[0] === 1 && oK[1] === 1) || Object.keys(oV).length;
    var prompt = vout(oK, oV) + rt(n, vtex(iK, iV)), perfT = vtex([pw(s, n), 1], big), innerOut = vout([sg * s, 1], q);
    var parts = [];
    if (s > 1) parts.push(t(F(iA) + '=' + F(pw(s, n)) + '\\cdot ' + tt));
    Object.keys(iV).sort().forEach(function (x) { if (iV[x] >= n && iV[x] % n) parts.push(t(vp(x, iV[x]) + '=' + vp(x, big[x]) + '\\cdot ' + vp(x, rem[x]))); else if (iV[x] >= n) parts.push(t(vp(x, iV[x])) + ' is a perfect ' + POW[n]); else parts.push(t(vp(x, iV[x])) + ' stays under the root'); });
    var sol = (sg < 0 ? 'The index is odd, so the negative comes out of the root. ' : '') + 'Split each factor into a perfect ' + POW[n] + ' and what’s left: ' + parts.join(', ') + '.<br>' +
      t(rt(n, vtex(iK, iV)) + '=' + rt(n, (sg < 0 ? '-' : '') + (perfT === '1' ? '' : perfT + '\\cdot ') + inTex) + '=' + (hasRad ? (innerOut === '' ? '' : innerOut) + rt(n, inTex) : vtex([sg * s, 1], q))) + ' (divide each exponent by ' + t(n) + ': the quotient comes out, the remainder stays under).';
    if (hasOut) sol += '<br>Multiply by the factor in front: ' + t(vout(oK, oV) + '\\cdot ' + (sg < 0 ? '\\left(' + vtex([sg * s, 1], q) + '\\right)' : vtex([s, 1], q)) + '=' + vtex(ansK, ansOut)) + '.';
    sol += '<br>So ' + t(prompt + '=' + target) + '.';
    var chk = K.varRadical(target, 'mixed', { diag: function (r) {
      if (!r) return null;
      var radOk = r.rad.m === tt && sameV(r.rad.vars, rem);
      if (hasRad && r.n === 1 && sameK(r.k, ansK) && sameV(r.vars, ansOut)) return { code: 'dropped-rem', hint: 'Don’t lose the leftover: ' + t(inTex) + ' still has to stay under the ' + ROOT[n] + '.' };
      if (r.n !== n && hasRad) return null;
      if (sg < 0 && radOk && sameK(r.k, [-ansK[0], ansK[1]]) && sameV(r.vars, ansOut)) return { code: 'neg-root', hint: 'Watch the sign: an odd root of a negative number is negative.' };
      if (hasOut && radOk && sameK(r.k, [sg * s, 1]) && sameV(r.vars, q)) return { code: 'outside-lost', hint: 'You simplified ' + t(rt(n, vtex(iK, iV))) + ' correctly — now multiply by the ' + t(vout(oK, oV)) + ' in front.' };
      if (s > 1 && radOk && sameV(r.vars, ansOut) && ex.eq(Math.abs(rq(r.k)), Math.abs(rq(oK)) * pw(s, n))) return { code: 'coef-power', hint: t(F(pw(s, n))) + ' comes out of the ' + ROOT[n] + ' as ' + t(rt(n, F(pw(s, n))) + '=' + s) + ', not as ' + t(F(pw(s, n))) + '.' };
      var kept = Object.keys(q).filter(function (x) { return (r.rad.vars[x] || 0) === iV[x] && (r.vars[x] || 0) === ansOut[x]; });
      if (kept.length) { var x = kept[0]; return { code: 'kept-inside', hint: 'When ' + t(vp(x, big[x])) + ' comes out as ' + t(vp(x, q[x])) + ', it leaves the radical: only ' + (rem[x] ? t(vp(x, rem[x])) : 'nothing') + ' of ' + t(vp(x, iV[x])) + ' stays inside.' }; }
      return null;
    } });
    var p = P.math(o.prompt || t(prompt), chk, target, o.sol || sol, o.hints || ['Divide each exponent by the index ' + t(n) + '. The quotient is the exponent that comes out; the remainder stays under the root.', s > 1 ? 'Take the largest perfect ' + POW[n] + ' out of ' + t(F(iA)) + ' too.' : 'Then multiply by anything already in front of the radical.'], o.text || 'mixed (variables): ' + prompt, { keys: 'var' });
    p.bad = [];
    if (hasRad) p.bad.push(vout(ansK, ansOut) === '' ? '1' : vout(ansK, ansOut));
    if (Object.keys(q).length && hasRad) p.bad.push(vout(ansK, addV(ansOut, q)) + rt(n, inTex));
    if (hasRad || Object.keys(q).length) p.bad.push(prompt);
    p.target = target;
    return p;
  }
  /* the variables of a radical, in the order of the letters given (a, b, x, y only: the keypad has those) */
  function obj(keys, vals) { var o = {}; keys.forEach(function (x, i) { if (vals[i]) o[x] = vals[i]; }); return o; }
  function letters(r, k) { return r.pick([['x', 'y'], ['a', 'b'], ['x', 'y'], ['a', 'b'], ['x', 'b'], ['a', 'y']]).slice(0, k); }
  /* several boxes, each a mixed radical (side and perimeter, …) */
  function radFields(prompt, boxes, sol, hints, text) {
    var p = P.fields(prompt, boxes.map(function (b) { return { name: b.name, label: b.label, mode: 'math', keys: b.keys || 'radical', vars: b.vars, after: b.after }; }),
      boxes.map(function (b) { return b.check; }), boxes.map(function (b) { return b.key; }), boxes.map(function (b) { return (b.name ? b.name + ': ' : '') + t(b.key) + (b.after ? ' ' + b.after : ''); }).join('<br>'), sol, hints, text);
    if (boxes.some(function (b) { return b.bad; })) p.bad = [boxes.map(function (b, i) { return b.bad || boxes[i].key; })];
    return p;
  }
  RK.Rq = Rq; RK.rq = rq; RK.pw = pw; RK.rt = rt; RK.POW = POW; RK.ROOT = ROOT; RK.LIST = LIST; RK.SF = SF;
  RK.coefTex = coefTex; RK.mixTex = mixTex; RK.ratTex = ratTex; RK.given = given; RK.isPow = isPow; RK.pickWhere = pickWhere; RK.pickR = pickR;
  RK.mixPart = mixPart; RK.entirePart = entirePart; RK.entireInfo = entireInfo; RK.vtex = vtex; RK.vout = vout; RK.vp = vp; RK.addV = addV; RK.sameV = sameV;
  RK.varEntire = varEntire; RK.varMixed = varMixed; RK.obj = obj; RK.letters = letters; RK.radFields = radFields;

  /* ============================== Lesson 1 helpers ============================== */
  function strip0(s) { return s.indexOf('.') >= 0 ? s.replace(/0+$/, '').replace(/\.$/, '') : s; }
  function decOf(p, q) { // p/q with q a power of 10 → decimal string
    var d = Math.round(Math.log10(q)); return strip0((p / q).toFixed(Math.max(0, d)));
  }

  /* ---------- "evaluate where possible": one box with a "none" key ---------- */
  function isNone(s) { s = String(s == null ? '' : s).replace(/\\text\{([^}]*)\}|\\mathrm\{([^}]*)\}/g, '$1$2').replace(/\s+/g, ' ').trim(); return /^(none|not real|not a real number|no real (root|number|answer)|dne|undefined|nr)$/i.test(s); }
  function numCheck(V, diag) { // V: [p, q]
    var T = V[0] / V[1];
    return function (resp) {
      var a = K.read(resp); if (a.res) return a.res;
      var sh = ex.shape(a.ast);
      if (ex.eq(a.val, T) || (T === 0 && a.val === 0)) {
        if (sh.roots || sh.pow) return form('u2l1-unevaluated', 'Right value — now work it out: give the answer as a number with no root sign.');
        var pf = ex.plainFraction(a.ast);
        if (pf && pf[1] !== 1 && ex.gcd(pf[0], pf[1]) > 1) return form('lowest', 'Right value — reduce the fraction to lowest terms.');
        if (!pf && !sh.decimals && (sh.muls || sh.ops || sh.divs)) return form('simplify', 'Right value — simplify it to a single number.');
        return ok();
      }
      if (!isFinite(a.val)) return wrong('undefined', null);
      var h = diag ? diag(a.val, a.ast) : null; if (h) return wrong(h.code, h.hint);
      if (T !== 0 && ex.eq(a.val, -T)) return wrong('sign', 'Check the sign of your answer.');
      return wrong('value', null);
    };
  }
  function rootPhrase(n) { return n === 2 ? 'multiplied by itself' : 'used as a factor ' + n + ' times'; }
  /* ⁿ√(num/den) (num may be negative; dec: show the radicand as a decimal), with an optional minus sign outside */
  function evalPart(o) {
    var n = o.n, num = o.num, den = o.den || 1, neg = num < 0, even = n % 2 === 0, notReal = neg && even, outer = o.outer || 1;
    var a = Math.round(Math.pow(Math.abs(num), 1 / n)), b = Math.round(Math.pow(den, 1 / n));
    var radT = o.dec ? decOf(num, den) : den === 1 ? F(num) : (neg ? '-' : '') + '\\dfrac{' + F(Math.abs(num)) + '}{' + F(den) + '}';
    var expr = (outer < 0 ? '-' : '') + rt(n, radT), absRadT = o.dec ? decOf(Math.abs(num), den) : den === 1 ? F(Math.abs(num)) : '\\dfrac{' + F(Math.abs(num)) + '}{' + F(den) + '}';
    var V = notReal ? null : ex.norm(outer * (neg ? -1 : 1) * a, b), Vx = V ? V[0] / V[1] : null;
    var vTex = V ? (o.dec ? decOf(V[0] * (10 / b === Math.round(10 / b) ? 1 : 1), V[1]) : ex.texRat(V)) : '';
    if (V && o.dec) { var dd = Math.round(Math.log10(Math.pow(den, 1 / n))); vTex = strip0((Vx).toFixed(Math.max(0, dd))); }
    var rootT = rt(n, absRadT), rootVal = o.dec ? strip0((a / b).toFixed(Math.max(0, Math.round(Math.log10(b))))) : ex.texRat(ex.norm(a, b)), aPow = (o.dec || b === 1) ? rootVal : '\\left(' + rootVal + '\\right)';
    var sol;
    if (notReal) sol = 'The index ' + t(n) + ' is <b>even</b> and the radicand is negative. No real number ' + rootPhrase(n) + ' gives a negative result (' + t(rootVal + '^{' + n + '}') + ' and ' + t('(-' + rootVal + ')^{' + n + '}') + ' are both positive), so ' + t(expr) + ' is <b>not a real number</b>.';
    else if (neg) sol = 'The index ' + t(n) + ' is odd, so a negative radicand is fine: ' + t('\\left(-' + rootVal + '\\right)^{' + n + '}=' + radT) + ', so ' + t(expr + '=' + vTex) + '.';
    else if (outer < 0) sol = 'The negative sign is <b>outside</b> the root. ' + t(rootT + '=' + rootVal) + ' because ' + t(aPow + '^{' + n + '}=' + absRadT) + ', so ' + t(expr + '=-' + rootVal) + '.';
    else sol = t(aPow + '^{' + n + '}=' + absRadT) + ', so ' + t(expr + '=' + vTex) + (n === 2 ? ' (the principal, non-negative, square root)' : '') + '.';
    if (o.solMore) sol += o.solMore;
    var radX = num / den;
    var diag = function (v) {
      if (Vx == null) return null;
      if (neg && !even && ex.eq(v, -Vx)) return { code: 'u2l1-odd-sign', hint: 'Check: ' + t(aPow + '^{' + n + '}=' + absRadT) + ', not ' + t(radT) + '. Which number, ' + rootPhrase(n) + ', gives a <b>negative</b> result?' };
      if (outer < 0 && ex.eq(v, -Vx)) return { code: 'sign', hint: 'Don’t lose the minus sign in front of the root: find ' + t(rootT) + ', then take its opposite.' };
      if (Math.abs(radX) !== 1 && ex.eq(Math.abs(v), Math.abs(radX) / n)) return { code: 'u2l1-divided-index', hint: 'Taking a root isn’t dividing by the index. ' + t(rootT) + ' is the number that, ' + rootPhrase(n) + ', gives ' + t(absRadT) + '.' };
      if (Math.abs(radX) !== 1 && ex.eq(Math.abs(v), Math.abs(radX))) return { code: 'u2l1-no-root', hint: 'You still need to take the ' + ROOT[n] + ' of ' + t(absRadT) + '.' };
      if (den > 1 && !o.dec && ex.eq(Math.abs(v), a / den)) return { code: 'u2l1-top-only', hint: 'Take the ' + ROOT[n] + ' of the denominator ' + t(F(den)) + ' too.' };
      if (den > 1 && !o.dec && ex.eq(Math.abs(v), Math.abs(num) / b)) return { code: 'u2l1-bottom-only', hint: 'Take the ' + ROOT[n] + ' of the numerator ' + t(F(Math.abs(num))) + ' too.' };
      if (o.dec) for (var j = -2; j <= 2; j++) if (j && ex.eq(Math.abs(v), Math.abs(Vx) * Math.pow(10, j))) return { code: 'u2l1-dec-place', hint: 'Right digits — check the decimal point: ' + t('(' + vTex.replace('-', '') + ')^{' + n + '}=' + absRadT) + '. Square your answer to check it.' };
      return null;
    };
    var base = V ? numCheck(V, diag) : null;
    function one(resp) {
      var s = String(resp == null ? '' : resp).trim();
      if (!s) return form('empty', 'Type your answer first, or press <b>none</b> if it is not a real number.');
      if (/\\pm|±/.test(s)) return wrong('u2l1-pm', 'The radical sign means only the <b>principal</b> (non-negative) root' + (n % 2 ? ' — and an odd root has only one real value anyway' : '') + '. Give one number.');
      if (isNone(s)) {
        if (notReal) return ok();
        if (neg) return wrong('u2l1-odd-neg', 'The index ' + t(n) + ' is <b>odd</b>, so a negative radicand is allowed: some negative number ' + rootPhrase(n) + ' gives ' + t(radT) + '.');
        if (outer < 0) return wrong('u2l1-outside-neg', 'The negative sign is <b>outside</b> the root, so the radicand ' + t(absRadT) + ' is positive. Find ' + t(rootT) + ', then take its opposite.');
        return wrong('u2l1-none', t(absRadT) + ' is a perfect ' + POW[n] + ': find the number that, ' + rootPhrase(n) + ', gives ' + t(absRadT) + '.');
      }
      if (notReal) {
        var ar = K.read(s); if (ar.res) return ar.res;
        if (isFinite(ar.val) && ex.eq(Math.abs(ar.val), a / b)) return wrong('u2l1-even-neg', 'Check: ' + t(aPow + '^{' + n + '}') + ' and ' + t('\\left(-' + rootVal + '\\right)^{' + n + '}') + ' are both <b>positive</b>. With an even index the radicand can’t be negative — press <b>none</b> (not a real number).');
        return wrong('u2l1-even-neg', 'The index is even and the radicand is negative. Can any real number ' + rootPhrase(n) + ' give a negative result?');
      }
      return base(s);
    }
    var key = V ? (o.dec ? vTex : ex.texRat(V)) : 'none';
    var p = { prompt: t(expr), input: { type: 'fields', fields: [{ label: t(expr + '='), mode: 'math', keys: 'fraction', none: true }] }, check: function (resp) { return one(Array.isArray(resp) ? resp[0] : resp); },
      key: [key], answer: V ? t(expr + '=' + vTex) : t(expr) + ' is not a real number (none)', solution: sol,
      hints: o.hints || [notReal || neg ? 'Is the index even or odd? An even root of a negative number is not a real number; an odd root of a negative number is negative.' : outer < 0 ? 'Is the negative sign inside or outside the root?' : 'What number, ' + rootPhrase(n) + ', gives ' + t(absRadT) + '?', 'If there is no real answer, press <b>none</b>.'],
      text: 'evaluate ' + expr };
    p.bad = notReal ? [[String(a)], [String(-a)]] : [['none'], [String(-Vx)]];
    return p;
  }

  /* ---------- classify rational / irrational ---------- */
  function classifyPart(r, prompt, items, text) {
    var rows = items.map(function (x, i) { return { id: 'r' + i, html: t(x.tex) }; }), want = {};
    items.forEach(function (x, i) { want['r' + i] = x.rat ? 'rat' : 'irr'; });
    var cols = [{ id: 'rat', html: 'Rational' }, { id: 'irr', html: 'Irrational' }];
    return P.grid(prompt, rows, cols, want, { why: function (id) { var x = items[Number(id.slice(1))]; return { code: 'u2l1-classify', hint: 'Look again at ' + t(x.tex) + ': ' + x.why }; } },
      items.map(function (x) { return t(x.tex) + ': ' + (x.rat ? '<b>rational</b>' : '<b>irrational</b>') + ' — ' + x.why; }).join('<br>'),
      ['The root of a perfect square (cube, fourth power, …) is rational. Any other root is irrational.', 'For a decimal or fraction, check the numerator and the denominator: ' + t('0.49=\\frac{49}{100}') + ' is a perfect square, ' + t('0.4=\\frac{2}{5}') + ' is not.'], text);
  }
  var SQDEC = [[16, 100], [25, 100], [36, 100], [64, 100], [81, 100], [121, 100], [169, 100], [196, 100]], NSQDEC = [[2, 10], [3, 10], [5, 10], [6, 10], [7, 10], [8, 10], [9, 10], [12, 10]];
  function clsItem(r, kind, rat) {
    var s, N;
    if (kind === 'sq') { if (rat) { s = r.int(11, 19); return { tex: '\\sqrt{' + s * s + '}', rat: true, why: t(s * s + '=' + s + '^{2}') + ', so ' + t('\\sqrt{' + s * s + '}=' + s) + '.' }; }
      N = pickWhere(function () { return r.int(20, 200); }, function (v) { return !isPow(v, 2) && v !== 45 && v !== 50; }, 60); return { tex: '\\sqrt{' + N + '}', rat: false, why: t(N) + ' is not a perfect square.' }; }
    if (kind === 'cubeneg') { if (rat) { s = r.int(2, 10); return { tex: '\\sqrt[3]{-' + F(s * s * s) + '}', rat: true, why: t('(-' + s + ')^{3}=-' + F(s * s * s)) + ', so it equals ' + t(-s) + '.' }; }
      N = pickWhere(function () { return r.int(10, 300); }, function (v) { return !isPow(v, 3); }, 100); return { tex: '\\sqrt[3]{-' + N + '}', rat: false, why: t(N) + ' is not a perfect cube.' }; }
    if (kind === 'frac') { var b = r.int(3, 11), aa = pickWhere(function () { return r.int(1, b - 1); }, function (v) { return ex.gcd(v, b) === 1; }, 1);
      if (rat) return { tex: '\\sqrt{\\dfrac{' + aa * aa + '}{' + b * b + '}}', rat: true, why: 'both ' + t(aa * aa) + ' and ' + t(b * b) + ' are perfect squares, so it equals ' + t('\\frac{' + aa + '}{' + b + '}') + '.' };
      N = pickWhere(function () { return r.int(2, b * b - 1); }, function (v) { return !isPow(v, 2) && ex.gcd(v, b) === 1; }, 2); return { tex: '\\sqrt{\\dfrac{' + N + '}{' + b * b + '}}', rat: false, why: t(N) + ' is not a perfect square, so the numerator’s root is irrational.' }; }
    if (kind === 'four') { if (rat) { s = r.pick([2, 3, 4, 5]); return { tex: '\\sqrt[4]{' + F(pw(s, 4)) + '}', rat: true, why: t(F(pw(s, 4)) + '=' + s + '^{4}') + ', so it equals ' + t(s) + '.' }; }
      N = pickWhere(function () { return r.int(10, 200); }, function (v) { return !isPow(v, 4) && v !== 32 && v !== 40; }, 50); return { tex: '\\sqrt[4]{' + N + '}', rat: false, why: t(N) + ' is not a perfect fourth power.' }; }
    if (kind === 'dec') { var d = rat ? r.pick(SQDEC) : r.pick(NSQDEC), dt = decOf(d[0], d[1]);
      if (rat) return { tex: '\\sqrt{' + dt + '}', rat: true, why: t(dt + '=\\frac{' + d[0] + '}{' + d[1] + '}') + ' and both are perfect squares: it equals ' + t(decOf(Math.round(Math.sqrt(d[0])), Math.round(Math.sqrt(d[1])))) + '.' };
      var fr = ex.norm(d[0], d[1]); return { tex: '\\sqrt{' + dt + '}', rat: false, why: t(dt + '=' + ratTex(fr)) + ', and ' + (isPow(fr[0], 2) ? t(fr[1]) : t(fr[0])) + ' is not a perfect square.' }; }
    /* 'cubedec' */
    var cd = rat ? r.pick([[1, 1000], [8, 1000], [27, 1000], [64, 1000], [125, 1000], [216, 1000]]) : r.pick([[8, 100], [27, 100], [2, 10], [4, 10], [5, 100], [16, 1000]]), ct = decOf(cd[0], cd[1]);
    if (rat) return { tex: '\\sqrt[3]{' + ct + '}', rat: true, why: t(ct + '=\\frac{' + cd[0] + '}{1000}') + ', a perfect cube over a perfect cube: it equals ' + t(decOf(Math.round(Math.cbrt(cd[0])), 10)) + '.' };
    var cf = ex.norm(cd[0], cd[1]); return { tex: '\\sqrt[3]{' + ct + '}', rat: false, why: t(ct + '=' + ratTex(cf)) + ', and ' + (isPow(cf[0], 3) ? t(cf[1]) : t(cf[0])) + ' is not a perfect cube.' };
  }
  function clsItems(r, kinds) {
    var rats = kinds.map(function () { return r.chance(0.5); });
    var nr = rats.filter(Boolean).length; if (nr === 0) rats[r.int(0, kinds.length - 1)] = true; if (nr === kinds.length) rats[r.int(0, kinds.length - 1)] = false;
    return kinds.map(function (k, i) { return clsItem(r, k, rats[i]); });
  }

  /* ---------- between which whole numbers ---------- */
  function betweenPart(N, n) {
    var lo = Math.floor(Math.pow(N, 1 / n) + 1e-9), hi = lo + 1;
    var diag = function (which) { return function (v) {
      for (var j = 2; j <= 4; j++) if (j !== n) { var l2 = Math.floor(Math.pow(N, 1 / j) + 1e-9); if (v === (which ? l2 + 1 : l2) && l2 !== lo) return { code: 'u2l1-between-root', hint: 'That bound is for the ' + ROOT[j] + '. Use perfect <b>' + POW[n] + 's</b>: which two consecutive ones are ' + t(N) + ' between?' }; }
      return { code: 'u2l1-between', hint: 'List perfect ' + POW[n] + 's: ' + t(LIST[n]) + '. Which two consecutive ones is ' + t(N) + ' between?' };
    }; };
    return P.fields(t(rt(n, N)) + ' lies between two consecutive whole numbers.', [{ name: 'Smaller', label: 'between', mode: 'number' }, { name: 'Larger', label: 'and', mode: 'number' }],
      [K.number(lo, diag(0)), K.number(hi, diag(1))], [String(lo), String(hi)], 'between ' + t(lo) + ' and ' + t(hi),
      t(F(pw(lo, n)) + '<' + N + '<' + F(pw(hi, n))) + ' (' + t(lo + '^{' + n + '}') + ' and ' + t(hi + '^{' + n + '}') + '), so ' + t(rt(n, F(pw(lo, n))) + '<' + rt(n, N) + '<' + rt(n, F(pw(hi, n)))) + ': between ' + t(lo) + ' and ' + t(hi) + '.',
      ['Find the perfect ' + POW[n] + 's just below and just above ' + t(N) + ' (' + t(LIST[n]) + ').'], 'between: ' + rt(n, N));
  }

  /* ---------- approximate from a given root ---------- */
  var GIVEN = { 2: 1414, 3: 1732, 5: 2236, 6: 2449, 7: 2646, 10: 3162, 11: 3317 };
  function approxPart(b, num, den) { // √(b·num²/den²) = (num/den)√b ≈ num·G/(1000·den)
    var G = GIVEN[b], g = strip0((G / 1000).toFixed(3)), R = b * num * num, radS = den === 1 ? F(R) : decOf(R, den * den);
    var ansS = decOf(num * G, 1000 * den), ans = Number(ansS), trueV = num / den * Math.sqrt(b);
    var diag = function (v) {
      for (var j = -3; j <= 3; j++) if (j && ex.eq(v, ans * Math.pow(10, j))) return { code: 'u2l1-place', hint: 'Right digits, wrong place value. Which perfect square did you split off, and what is its square root?' };
      if (num > 1 && ex.eq(v, num * num * G / 1000 / den)) return { code: 'coef-power', hint: 'Only the <b>square root</b> of the perfect square comes out: ' + t('\\sqrt{' + F(num * num) + '}=' + num) + '.' };
      return null;
    };
    var base = K.number(ans, diag);
    var check = function (resp) {
      var res = base(resp); if (res.v !== 'wrong') return res;
      var pv = HW.parse.number(resp);
      if (pv.ok && Math.abs(pv.value - trueV) < 0.01 * trueV) return form('u2l1-given', 'Close — but use the given value ' + t('\\sqrt{' + b + '}\\approx ' + g) + ' exactly: multiply or divide it, and don’t round.');
      return res;
    };
    var steps = den === 1 ? t('\\sqrt{' + radS + '}=\\sqrt{' + F(num * num) + '\\times ' + b + '}=' + num + '\\sqrt{' + b + '}\\approx ' + num + '(' + g + ')=' + F(ansS))
      : t('\\sqrt{' + radS + '}=\\sqrt{\\dfrac{' + b + '}{' + F(den * den) + '}}=\\dfrac{\\sqrt{' + b + '}}{' + F(den) + '}\\approx\\dfrac{' + g + '}{' + F(den) + '}=' + ansS);
    return { prompt: t('\\sqrt{' + radS + '}'), input: { type: 'number' }, check: check, key: ansS, answer: t('\\sqrt{' + radS + '}\\approx ' + F(ansS)), solution: steps + '.',
      hints: [den === 1 ? 'Write ' + t(F(R)) + ' as a perfect square ' + t('\\times ' + b) + '.' : 'Write the decimal as a fraction with a perfect-square denominator: ' + t(radS + '=\\dfrac{' + b + '}{' + F(den * den) + '}') + '.', 'The perfect square comes out as its square root; then use ' + t('\\sqrt{' + b + '}\\approx ' + g) + '.'],
      text: 'approximate sqrt ' + radS + ' from sqrt ' + b, bad: [String(Math.round(trueV * 1000) / 1000 === ans ? ans + 1 : Math.round(trueV * 1000) / 1000)] };
  }

  /* ---------- ordering by converting to entire radicals ---------- */
  function orderPart(r, items, desc, n, text) {
    var sorted = items.slice().sort(function (a, b) { return desc ? b.v - a.v : a.v - b.v; }), byId = {};
    items.forEach(function (x) { byId[x.id] = x; });
    var rel = desc ? '>' : '<';
    return P.order(r, 'Without a calculator, arrange from <b>' + (desc ? 'greatest to least' : 'least to greatest') + '</b>: ' + items.map(function (x) { return t(x.tex); }).join(', \\ '), sorted, { first: desc ? 'greatest' : 'least', last: desc ? 'least' : 'greatest',
      why: function (a, b) { return t(byId[a].tex) + ' and ' + t(byId[b].tex) + ' are in the wrong order. Write each as an entire radical (' + t('a' + rt(n, 'b') + '=' + rt(n, 'a^{' + n + '}b')) + ') and compare the radicands.' + (items.some(function (x) { return x.v < 0; }) ? ' A negative radicand gives a negative number: ' + t('-80>-81') + ', so ' + t(rt(3, '-80') + '>' + rt(3, '-81')) + '.' : ''); } },
      'Write every radical as an entire radical:<br>' + items.map(function (x) { return t(x.conv); }).join('<br>') + '<br>Compare the radicands: ' + t(sorted.map(function (x) { return rt(n, F(x.v)); }).join(rel)) + ', so<br>' + t(sorted.map(function (x) { return x.tex; }).join('\\ ' + rel + '\\ ')) + '.',
      ['Convert every mixed radical to an entire radical: ' + t('a' + rt(n, 'b') + '=' + rt(n, 'a^{' + n + '}b')) + (n % 2 ? ' (a negative coefficient goes inside as a negative).' : '.'), 'With the same index, the larger radicand gives the larger value.'], text);
  }
  function sqItems(r, nMixed, lo, hi, excl) {
    var pool = []; [2, 3, 4, 5, 6, 7].forEach(function (c) { SF.concat([17, 19, 21, 22, 23]).forEach(function (m) { var v = c * c * m; if (v >= lo && v <= hi) pool.push({ c: c, m: m, v: v }); }); });
    for (var tries = 0; tries < 600; tries++) {
      var mixed = r.sample(pool, nMixed), vs = mixed.map(function (x) { return x.v; }), N = r.int(lo, hi);
      if (ex.nthFactor(N, 2) > 1 || vs.indexOf(N) >= 0) continue;
      var all = vs.concat([N]), okk = true;
      for (var a = 0; a < all.length && okk; a++) for (var b = a + 1; b < all.length; b++) if (all[a] === all[b]) okk = false;
      if (!okk || (excl && all.slice().sort().join() === excl.slice().sort().join())) continue;
      var items = mixed.map(function (x, i) { return { id: 'm' + i, tex: x.c + '\\sqrt{' + x.m + '}', v: x.v, conv: x.c + '\\sqrt{' + x.m + '}=\\sqrt{' + x.c * x.c + '\\times ' + x.m + '}=\\sqrt{' + x.v + '}' }; });
      items.push({ id: 'e', tex: '\\sqrt{' + N + '}', v: N, conv: '\\sqrt{' + N + '}\\ \\text{(already entire)}' });
      return r.shuffle(items);
    }
    return null;
  }
  function cbItems(r, nPos, nEnt, nNeg, lo, hi) {
    var pool = []; [2, 3, 4].forEach(function (c) { [2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15].forEach(function (m) { var v = c * c * c * m; if (v >= lo && v <= hi && ex.nthFactor(m, 3) === 1) pool.push({ c: c, m: m, v: v }); }); });
    for (var tries = 0; tries < 800; tries++) {
      var pick = r.sample(pool, nPos + nNeg), ents = [];
      for (var e = 0; e < nEnt; e++) ents.push(r.int(lo, hi));
      var abs = pick.map(function (x) { return x.v; }).concat(ents), okk = ents.every(function (N) { return ex.nthFactor(N, 3) === 1; });
      for (var a = 0; a < abs.length && okk; a++) for (var b = a + 1; b < abs.length; b++) if (abs[a] === abs[b]) okk = false;
      if (!okk) continue;
      var items = pick.map(function (x, i) { var ng = i >= nPos, sgn = ng ? '-' : ''; return { id: 'm' + i, tex: sgn + x.c + '\\sqrt[3]{' + x.m + '}', v: ng ? -x.v : x.v, conv: sgn + x.c + '\\sqrt[3]{' + x.m + '}=\\sqrt[3]{(' + sgn + x.c + ')^{3}\\times ' + x.m + '}=\\sqrt[3]{' + (ng ? '-' : '') + x.v + '}' }; });
      ents.forEach(function (N, i) { var ng = i >= nEnt - (nEnt > 1 ? 1 : 0) && nEnt > 1; items.push({ id: 'e' + i, tex: (ng ? '-' : '') + '\\sqrt[3]{' + N + '}', v: ng ? -N : N, conv: (ng ? '-\\sqrt[3]{' + N + '}=\\sqrt[3]{-' + N + '}' : '\\sqrt[3]{' + N + '}\\ \\text{(already entire)}') }); });
      return r.shuffle(items);
    }
    return null;
  }

  /* ---------- figures ---------- */
  function svgWrap(w, h, body) { return '<svg viewBox="0 0 ' + w + ' ' + h + '" width="100%" style="max-width:' + w + 'px;display:block;margin:6px 0" role="img" fill="none" stroke="currentColor" stroke-width="1.6" font-size="13" font-family="KaTeX_Main,\'Times New Roman\',serif">' + body + '</svg>'; }
  function txt(x, y, s, anchor, it) { return '<text x="' + x + '" y="' + y + '" fill="currentColor" stroke="none" text-anchor="' + (anchor || 'middle') + '"' + (it ? ' font-style="italic"' : '') + '>' + s + '</text>'; }
  function rightTri(a, b, unit) {
    var W = 170, H = Math.max(45, Math.min(130, 170 * a / b)), x0 = 46, y0 = 10;
    return svgWrap(250, H + 40, '<path d="M' + x0 + ' ' + y0 + ' L' + x0 + ' ' + (y0 + H) + ' L' + (x0 + W) + ' ' + (y0 + H) + ' Z"/><path stroke-width="1.2" d="M' + x0 + ' ' + (y0 + H - 10) + ' h10 v10"/>' +
      txt(x0 + W / 2, y0 + H + 18, b + ' ' + unit) + txt(x0 - 6, y0 + H / 2 + 4, a + ' ' + unit, 'end') + txt(x0 + W / 2 + 12, y0 + H / 2 - 4, 'c', 'middle', true));
  }
  function squareFig(lab) { return svgWrap(150, 118, '<rect x="35" y="12" width="85" height="85"/>' + txt(77, 60, lab) + txt(77, 113, 's', 'middle', true)); }
  function cubeFig(lab) { return svgWrap(150, 125, '<path d="M30 40 h70 v70 h-70 Z M30 40 l25 -25 h70 l-25 25 M125 15 v70 l-25 25"/>' + txt(65, 80, lab) + txt(65, 124, 'e', 'middle', true)); }

  /* ---------- contexts ---------- */
  function sideFields(A, unit, obj2, prompt, text) {
    var s = ex.nthFactor(A, 2), m = A / (s * s), side = { k: [s, 1], n: 2, m: m }, per = { k: [4 * s, 1], n: 2, m: m };
    var sideChk = K.radical(side, 'mixed', { diag: function (val) { if (ex.eq(val, A / 4)) return { code: 'value', hint: 'The side of a square is the <b>square root</b> of its area: ' + t('s=\\sqrt{A}') + '.' }; return null; } });
    var perChk = K.radical(per, 'mixed', { diag: function (val) { if (ex.eq(val, s * Math.sqrt(m)) || ex.eq(val, 2 * s * Math.sqrt(m))) return { code: 'u2l1-perimeter', hint: 'A square has <b>four</b> equal sides: ' + t('P=4s') + '.' }; return null; } });
    return radFields((prompt || '') + squareFig('A = ' + F(A) + ' ' + unit + '²') + 'Determine the exact side length and the perimeter, in simplest form.', [
      { name: 'Side', label: t('s='), check: sideChk, key: K.radTex(side), after: unit }, { name: 'Perimeter', label: t('P='), check: perChk, key: K.radTex(per), after: unit }],
      t('s=\\sqrt{' + F(A) + '}=\\sqrt{' + F(s * s) + '\\times ' + m + '}=' + s + '\\sqrt{' + m + '}') + ' ' + unit + '<br>' + t('P=4\\times ' + s + '\\sqrt{' + m + '}=' + 4 * s + '\\sqrt{' + m + '}') + ' ' + unit,
      ['The side of a square is ' + t('\\sqrt{A}') + '. Simplify it: find the largest perfect square that divides ' + t(F(A)) + '.', 'The perimeter is ' + t('4s') + ': multiply the coefficient by 4.'], text || 'square side and perimeter from area ' + A);
  }
  function cubeEdge(V, unit, intro, text) {
    var p = mixPart(1, 3, V, { prompt: cubeFig('V = ' + F(V) + ' ' + unit + '³') + (intro || 'A cube has a volume of ' + t(F(V) + '\\ \\text{' + unit + '}^{3}') + '.') + ' Determine its exact edge length in simplest form.', text: text || 'cube edge from volume ' + V });
    p.input.after = unit; p.solution = t('e=\\sqrt[3]{V}=\\sqrt[3]{' + F(V) + '}') + '.<br>' + p.solution;
    p.hints = ['The edge of a cube is the <b>cube root</b> of its volume.'].concat(hintsFor(3, V).slice(0, 1));
    return p;
  }
  function hypPart(r, excl) {
    var o = pickWhere(function () { var a = r.int(2, 12), b = r.int(a + 1, 15); return { a: a, b: b, S: a * a + b * b }; }, function (v) { var f = ex.nthFactor(v.S, 2); return f > 1 && v.S / (f * f) > 1 && !(excl || []).some(function (e) { return e[0] === v.a && e[1] === v.b; }); }, { a: 6, b: 12, S: 180 });
    var f = ex.nthFactor(o.S, 2), m = o.S / (f * f), unit = r.pick(['cm', 'm', 'mm']);
    var p = P.radical(rightTri(o.a, o.b, unit) + 'A right triangle has legs ' + t(o.a) + ' ' + unit + ' and ' + t(o.b) + ' ' + unit + '. Determine the exact length of the hypotenuse ' + t('c') + ', in simplest form.', { k: [f, 1], n: 2, m: m }, 'mixed',
      t('c=\\sqrt{' + o.a + '^{2}+' + o.b + '^{2}}=\\sqrt{' + o.a * o.a + '+' + o.b * o.b + '}=\\sqrt{' + o.S + '}=\\sqrt{' + f * f + '\\times ' + m + '}=' + f + '\\sqrt{' + m + '}') + ' ' + unit + '.',
      ['Pythagorean theorem: ' + t('c=\\sqrt{a^{2}+b^{2}}') + '.', 'Simplify ' + t('\\sqrt{' + o.S + '}') + ': find the largest perfect square that divides it.'], 'hypotenuse legs ' + o.a + ', ' + o.b,
      { diag: function (val) { if (ex.eq(val * val, o.a + o.b) || ex.eq(val, o.a + o.b)) return { code: 'u2l1-hyp-add', hint: 'Add the <b>squares</b> of the legs: ' + t('c^{2}=a^{2}+b^{2}') + '.' }; return null; } });
    p.input.after = unit;
    return p;
  }
  function distPart(r, excl) {
    var o = pickWhere(function () { var x1 = r.int(-6, 6), y1 = r.int(-7, 7), dx = r.int(1, 9) * r.pick([1, -1]), dy = r.int(1, 10) * r.pick([1, -1]); return { x1: x1, y1: y1, x2: x1 + dx, y2: y1 + dy, dx: dx, dy: dy, S: dx * dx + dy * dy }; },
      function (v) { var f = ex.nthFactor(v.S, 2); return Math.abs(v.x2) <= 9 && Math.abs(v.y2) <= 9 && f > 1 && v.S / (f * f) > 1 && !(excl || []).some(function (e) { return e[0] === Math.abs(v.dx) && e[1] === Math.abs(v.dy); }); },
      { x1: 1, y1: -6, x2: -4, y2: 4, dx: -5, dy: 10, S: 125 });
    var f = ex.nthFactor(o.S, 2), m = o.S / (f * f), L = r.pick([['P', 'Q'], ['A', 'B'], ['M', 'N'], ['R', 'S']]);
    var pt = function (x, y) { return '(' + x + ',\\ ' + y + ')'; }, par = function (v) { return v < 0 ? '(' + v + ')' : String(v); };
    return P.radical('Determine the exact distance between ' + t(L[0] + pt(o.x1, o.y1)) + ' and ' + t(L[1] + pt(o.x2, o.y2)) + ', in simplest form.', { k: [f, 1], n: 2, m: m }, 'mixed',
      'Horizontal change ' + t(par(o.x2) + '-' + par(o.x1) + '=' + o.dx) + '; vertical change ' + t(par(o.y2) + '-' + par(o.y1) + '=' + o.dy) + '.<br>' + t(L[0] + L[1] + '=\\sqrt{' + par(o.dx) + '^{2}+' + par(o.dy) + '^{2}}=\\sqrt{' + o.dx * o.dx + '+' + o.dy * o.dy + '}=\\sqrt{' + o.S + '}=\\sqrt{' + f * f + '\\times ' + m + '}=' + f + '\\sqrt{' + m + '}') + '.',
      ['Use ' + t('d=\\sqrt{(x_2-x_1)^{2}+(y_2-y_1)^{2}}') + ' — the Pythagorean theorem with the horizontal and vertical changes as legs.', 'Square each change (a negative change squares to a positive), add, then simplify.'], 'distance ' + L.join(''),
      { diag: function (val) { var a = Math.abs(o.dx), b = Math.abs(o.dy); if (ex.eq(val, a + b) || ex.eq(val, Math.sqrt(a + b)) || ex.eq(val, Math.sqrt(Math.abs(a * a - b * b)))) return { code: 'u2l1-dist', hint: 'Square <b>each</b> change and <b>add</b> the squares: ' + t('d^{2}=(\\Delta x)^{2}+(\\Delta y)^{2}') + '.' }; return null; } });
  }

  /* ---------- multiple-choice and true/false builders ---------- */
  function tf(r, prompt, truth, why, sol, text) { return P.tf(r, prompt, truth, why, sol, ['Work out each side separately and compare.'], text); }

  /* ================================ Assignment ================================ */
  var QUESTIONS = [
    { num: '1', section: 'Roots and radicals', stem: 'Without a calculator, evaluate where possible. If the radical is not a real number, press <b>none</b>.', parts: [
      { id: '1a', level: 'BEG', make: function (r) { var s = r.pick([13, 14, 15, 16, 17, 18, 19, 20]); return evalPart({ n: 2, num: s * s }); } },
      { id: '1b', level: 'BEG', make: function (r) { var s = r.pick([6, 8, 9, 10, 11, 12, 13]); return evalPart({ n: 2, num: s * s, outer: -1 }); } },
      { id: '1c', level: 'BEG', make: function (r) { var s = r.pick([4, 5, 6, 8, 9, 10]); return evalPart({ n: 2, num: -s * s }); } },
      { id: '1d', level: 'BEG', make: function (r) { var s = r.pick([2, 3, 4, 6, 7, 8, 9]); return evalPart({ n: 3, num: -s * s * s }); } },
      { id: '1e', level: 'BEG', make: function (r) { var s = r.pick([2, 4, 5, 6]); return evalPart({ n: 4, num: pw(s, 4) }); } },
      { id: '1f', level: 'EMG', make: function (r) { var n = r.pick([4, 4, 6]), s = n === 4 ? r.pick([1, 2, 3]) : r.pick([1, 2]); return evalPart({ n: n, num: -pw(s, n) }); } },
      { id: '1g', level: 'EMG', make: function (r) { var s = r.pick([2, 3, 4, 10]); return evalPart({ n: 5, num: -pw(s, 5) }); } },
      { id: '1h', level: 'EMG', make: function (r) { var ab = r.pick([[1, 2], [1, 3], [3, 4], [1, 4], [2, 5], [3, 5], [1, 5], [5, 6], [2, 7], [3, 7]]); return evalPart({ n: 3, num: pw(ab[0], 3), den: pw(ab[1], 3) }); } },
      { id: '1i', level: 'EMG', make: function (r) { var s = r.pick([11, 13, 14, 15, 16, 17, 7, 5, 8]); return evalPart({ n: 2, num: s * s, den: 100, dec: true }); } }] },
    { num: '2', stem: 'True or false? (Think about how you would correct each false statement.)', parts: [
      { id: '2a', level: 'LIM', make: function (r) { var s = r.pick([5, 6, 8, 9, 10, 11, 12]), tr = r.chance(0.6);
        return tf(r, 'The square roots of ' + t(s * s) + ' are ' + (tr ? t(s) + ' and ' + t(-s) : 'only ' + t(s)) + '.', tr, tr ? 'Every positive number has <b>two</b> square roots: ' + t(s + '^{2}=' + s * s) + ' and ' + t('(-' + s + ')^{2}=' + s * s) + '.' : t('(-' + s + ')^{2}=' + s * s) + ' too, so ' + t(-s) + ' is also a square root.',
          (tr ? '<b>True.</b> ' : '<b>False.</b> ') + 'Both ' + t(s + '^{2}') + ' and ' + t('(-' + s + ')^{2}') + ' equal ' + t(s * s) + ', so ' + t(s * s) + ' has two square roots, ' + t(s) + ' and ' + t(-s) + '. (Only the principal root ' + t('\\sqrt{' + s * s + '}=' + s) + ' is written with the radical sign.)', 'square roots of ' + s * s); } },
      { id: '2b', level: 'BEG', make: function (r) { var s = r.pick([5, 6, 8, 9, 10, 11]), tr = r.chance(0.35);
        return tf(r, t('\\sqrt{' + s * s + '}=' + (tr ? s : '\\pm ' + s)), tr, tr ? 'The radical sign means the principal (non-negative) root, and ' + t(s + '^{2}=' + s * s) + '.' : 'The radical sign means only the <b>principal</b> (non-negative) root.',
          (tr ? '<b>True.</b> ' : '<b>False.</b> Correct: ' + t('\\sqrt{' + s * s + '}=' + s) + '. ') + 'The symbol ' + t('\\sqrt{\\ }') + ' means the principal (non-negative) square root only; ' + t(s * s) + ' has square roots ' + t('\\pm ' + s) + ', but ' + t('\\sqrt{' + s * s + '}=' + s) + '.', 'sqrt ' + s * s + ' = ±?'); } },
      { id: '2c', level: 'BEG', make: function (r) { var s = r.pick([2, 4, 5, 6]), c = s * s * s, tr = r.chance(0.35);
        return tf(r, tr ? t(-c) + ' has exactly one real cube root.' : t(-c) + ' has no cube root.', tr, tr ? t('(-' + s + ')^{3}=-' + c) + ', and only one real number cubes to ' + t(-c) + '.' : t('(-' + s + ')^{3}=-' + c) + ', so ' + t(-s) + ' is a cube root of ' + t(-c) + '.',
          (tr ? '<b>True.</b> ' : '<b>False.</b> ') + 'Every real number has exactly one real cube root: ' + t('\\sqrt[3]{-' + c + '}=-' + s) + ' because ' + t('(-' + s + ')^{3}=-' + c) + '.', 'cube root of -' + c); } },
      { id: '2d', level: 'BEG', make: function (r) { var n = r.pick([4, 4, 6, 3]), s = r.pick([2, 3]), c = pw(s, n), odd = n % 2 === 1;
        return tf(r, t('\\sqrt[' + n + ']{-' + c + '}') + ' is not a real number.', !odd, odd ? 'The index ' + t(n) + ' is odd: ' + t('(-' + s + ')^{' + n + '}=-' + c) + '.' : 'The index ' + t(n) + ' is even: ' + t(s + '^{' + n + '}') + ' and ' + t('(-' + s + ')^{' + n + '}') + ' are both positive.',
          odd ? '<b>False.</b> The index is odd, so a negative radicand is fine: ' + t('\\sqrt[' + n + ']{-' + c + '}=-' + s) + '.' : '<b>True.</b> The index is even and the radicand is negative; no real number to an even power is negative.', 'root ' + n + ' of -' + c); } },
      { id: '2e', level: 'BEG', make: function (r) { var s = r.pick([3, 4, 6, 7, 8, 9]), tr = r.chance(0.6);
        return tf(r, 'If ' + t('x^{2}=' + s * s) + ', then ' + (tr ? t('x=' + s) + ' or ' + t('x=-' + s) : t('x=' + s)) + '.', tr, tr ? 'Both ' + t(s) + ' and ' + t(-s) + ' square to ' + t(s * s) + '.' : 'It is missing a solution: ' + t('(-' + s + ')^{2}=' + s * s) + ' too.',
          (tr ? '<b>True.</b> ' : '<b>False.</b> Correct: ' + t('x=' + s) + ' or ' + t('x=-' + s) + '. ') + 'The equation asks for <b>every</b> number whose square is ' + t(s * s) + ': ' + t(s) + ' and ' + t(-s) + '. (This is different from ' + t('\\sqrt{' + s * s + '}') + ', which is only ' + t(s) + '.)', 'x^2 = ' + s * s); } },
      { id: '2f', level: 'BEG', make: function (r) { var s = r.pick([3, 4, 5, 10]), c = s * s * s, tr = r.chance(0.6);
        return tf(r, t('\\sqrt[3]{-' + F(c) + '}=' + (tr ? '-\\sqrt[3]{' + F(c) + '}' : '\\sqrt[3]{' + F(c) + '}')), tr, tr ? 'Both sides equal ' + t(-s) + '.' : 'The left side is ' + t(-s) + ' and the right side is ' + t(s) + '.',
          (tr ? '<b>True.</b> ' : '<b>False.</b> ') + t('\\sqrt[3]{-' + F(c) + '}=-' + s) + ' and ' + t('\\sqrt[3]{' + F(c) + '}=' + s) + '. For an odd index, ' + t('\\sqrt[3]{-x}=-\\sqrt[3]{x}') + '.', 'cbrt(-' + c + ')'); } }] },
    { num: '3', stem: '', shared: function (r) {
        var N = pickWhere(function () { return r.int(28, 250); }, function (v) { return !isPow(v, 2) && !isPow(v, 3) && !isPow(v, 4) && v !== 50 && v !== 90; }, 70);
        return { N: N, items: clsItems(r, r.shuffle(['sq', 'cubeneg', 'frac', 'four', 'dec', 'cubedec'])) };
      }, parts: [
      { id: '3a', level: 'BEG', make: function (r, sh) { return classifyPart(r, '(a) Classify each number as rational or irrational.', sh.items, 'classify six roots'); } },
      { id: '3b1', sub: 'b i', level: 'EMG', make: function (r, sh) { var p = betweenPart(sh.N, 2); p.prompt = '(b) ' + p.prompt; return p; } },
      { id: '3b2', sub: 'b ii', level: 'EMG', make: function (r, sh) { return betweenPart(sh.N, 3); } },
      { id: '3b3', sub: 'b iii', level: 'EMG', make: function (r, sh) { return betweenPart(sh.N, 4); } },
      { id: '3c', level: 'EMG', make: function (r, sh) {
        var N = sh.N, its = [2, 3, 4].map(function (n) { var lo = Math.floor(Math.pow(N, 1 / n) + 1e-9); return { id: 'n' + n, tex: rt(n, N), lo: lo, n: n }; });
        return P.order(r, '(c) Use (b) to arrange ' + its.map(function (x) { return t(x.tex); }).join(', ') + ' from least to greatest.', its.slice().reverse(), { why: function () { return 'Use your answers to (b): which whole numbers is each one between?'; } },
          'From (b): ' + its.map(function (x) { return t(x.lo + '<' + x.tex + '<' + (x.lo + 1)); }).join(', ') + '. Least to greatest: ' + its.slice().reverse().map(function (x) { return t(x.tex); }).join(', ') + '.',
          ['Look at the whole numbers each one lies between.'], 'order roots of ' + N);
      } }] },
    { num: '4', section: 'Multiplying and dividing under one root', stem: 'True or false? Check each one by working out both sides.', parts: [
      { id: '4a', level: 'BEG', make: function (r) { var ab = r.sample([2, 3, 5, 7, 11, 13], 2), a = ab[0], b = ab[1], tr = r.chance(0.6);
        var rhs = tr ? '\\sqrt{' + a * b + '}' : '\\sqrt{' + (a + b) + '}';
        return tf(r, t('\\sqrt{' + a + '}\\times\\sqrt{' + b + '}=' + rhs), tr, tr ? 'Roots with the same index multiply under one root: ' + t('\\sqrt{a}\\times\\sqrt{b}=\\sqrt{ab}') + '.' : 'Roots multiply under one root — the radicands are <b>multiplied</b>, not added.',
          (tr ? '<b>True</b> (product property): ' : '<b>False:</b> ') + t('\\sqrt{' + a + '}\\times\\sqrt{' + b + '}=\\sqrt{' + a + '\\times ' + b + '}=\\sqrt{' + a * b + '}') + (tr ? '.' : ', not ' + t(rhs) + '.'), 'sqrt' + a + ' x sqrt' + b); } },
      { id: '4b', level: 'BEG', make: function (r) { var tr3 = r.pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [12, 16, 20], [9, 12, 15]]), A = tr3[0] * tr3[0], B = tr3[1] * tr3[1];
        return tf(r, t('\\sqrt{' + A + '+' + B + '}=\\sqrt{' + A + '}+\\sqrt{' + B + '}'), false, 'Work out both sides: ' + t('\\sqrt{' + (A + B) + '}=' + tr3[2]) + ', but ' + t(tr3[0] + '+' + tr3[1] + '=' + (tr3[0] + tr3[1])) + '.',
          '<b>False:</b> left side ' + t('\\sqrt{' + A + '+' + B + '}=\\sqrt{' + (A + B) + '}=' + tr3[2]) + '; right side ' + t(tr3[0] + '+' + tr3[1] + '=' + (tr3[0] + tr3[1])) + '. A root of a sum is not the sum of the roots.', 'sqrt of a sum'); } },
      { id: '4c', level: 'EMG', make: function (r) { var k = r.pick([2, 3, 5, 6, 7]), m = r.pick([2, 3, 5, 7].filter(function (x) { return x !== k; })), tr = r.chance(0.55), N = k * k * m;
        var rhs = tr ? k : k * k;
        return tf(r, t('\\dfrac{\\sqrt{' + N + '}}{\\sqrt{' + m + '}}=' + rhs), tr, tr ? 'Divide under one root: ' + t('\\sqrt{\\tfrac{' + N + '}{' + m + '}}=\\sqrt{' + k * k + '}=' + k) + '.' : 'Divide under one root, then take the root: ' + t('\\sqrt{\\tfrac{' + N + '}{' + m + '}}=\\sqrt{' + k * k + '}') + '.',
          (tr ? '<b>True:</b> ' : '<b>False:</b> ') + t('\\dfrac{\\sqrt{' + N + '}}{\\sqrt{' + m + '}}=\\sqrt{\\dfrac{' + N + '}{' + m + '}}=\\sqrt{' + k * k + '}=' + k) + (tr ? '.' : ', not ' + t(k * k) + '.'), 'quotient of roots ' + N + '/' + m); } },
      { id: '4d', level: 'EMG', make: function (r) { var tr3 = r.pick([[5, 3, 4], [5, 4, 3], [10, 8, 6], [15, 9, 12], [15, 12, 9], [17, 8, 15], [17, 15, 8], [25, 7, 24], [20, 12, 16], [20, 16, 12]]), a = tr3[0], b = tr3[1], A = a * a, B = b * b, tr = r.chance(0.4);
        var C = tr ? (a - b) * (a - b) : A - B;
        return tf(r, t('\\sqrt{' + A + '}-\\sqrt{' + B + '}=\\sqrt{' + C + '}'), tr, tr ? 'Work it out: ' + t(a + '-' + b + '=' + (a - b)) + ' and ' + t('\\sqrt{' + C + '}=' + (a - b)) + '.' : 'Work out both sides: ' + t(a + '-' + b + '=' + (a - b)) + ', but ' + t('\\sqrt{' + C + '}=' + Math.round(Math.sqrt(C))) + '.',
          (tr ? '<b>True:</b> ' : '<b>False:</b> ') + 'left side ' + t(a + '-' + b + '=' + (a - b)) + '; right side ' + t('\\sqrt{' + C + '}=' + Math.round(Math.sqrt(C))) + '.' + (tr ? ' (It works here only because ' + t(C) + ' happens to be ' + t((a - b) + '^{2}') + ' — in general ' + t('\\sqrt{a}-\\sqrt{b}\\ne\\sqrt{a-b}') + '.)' : ' In general ' + t('\\sqrt{a}-\\sqrt{b}\\ne\\sqrt{a-b}') + '.'), 'difference of roots'); } },
      { id: '4e', level: 'EMG', make: function (r) { var tr = r.chance(0.55);
        if (tr) { var pr = r.pick([[2, 4, 2], [25, 5, 5], [12, 18, 6], [49, 7, 7], [4, 54, 6], [3, 72, 6], [16, 32, 8], [5, 200, 10]]);
          return tf(r, t('\\sqrt[3]{' + pr[0] + '}\\times\\sqrt[3]{' + pr[1] + '}=' + pr[2]), true, 'Multiply under one cube root: ' + t('\\sqrt[3]{' + pr[0] * pr[1] + '}=' + pr[2]) + '.',
            '<b>True:</b> ' + t('\\sqrt[3]{' + pr[0] + '\\times ' + pr[1] + '}=\\sqrt[3]{' + pr[0] * pr[1] + '}=' + pr[2]) + ' because ' + t(pr[2] + '^{3}=' + pr[0] * pr[1]) + '.', 'cbrt product'); }
        var sm = r.pick([[2, 6, 8], [3, 5, 8], [10, 17, 27], [11, 16, 27], [12, 15, 27], [13, 14, 27]]), c = Math.round(Math.cbrt(sm[2])), lb = sm[2] === 8 ? 1 : 2;
        return tf(r, t('\\sqrt[3]{' + sm[0] + '}+\\sqrt[3]{' + sm[1] + '}=\\sqrt[3]{' + sm[2] + '}'), false, 'Roots can’t be added under one root sign. Estimate: each cube root on the left is more than ' + t(lb) + '.',
          '<b>False:</b> roots cannot be added under one sign. ' + t('\\sqrt[3]{' + sm[2] + '}=' + c) + ', but ' + t('\\sqrt[3]{' + sm[0] + '}') + ' and ' + t('\\sqrt[3]{' + sm[1] + '}') + ' are each greater than ' + t(lb) + ', so their sum is greater than ' + t(2 * lb) + '.', 'cbrt sum'); } },
      { id: '4f', level: 'BEG', make: function (r) { var ab = r.sample([4, 9, 16, 25, 36, 49], 2), a = ab[0], b = ab[1], sa = Math.sqrt(a), sb = Math.sqrt(b), tr = r.chance(0.6);
        return tf(r, t('\\sqrt{' + a + '\\times ' + b + '}=\\sqrt{' + a + '}' + (tr ? '\\times' : '+') + '\\sqrt{' + b + '}'), tr, tr ? 'Both sides equal ' + t(sa * sb) + '.' : 'Left side: ' + t('\\sqrt{' + a * b + '}=' + sa * sb) + '; right side: ' + t(sa + '+' + sb + '=' + (sa + sb)) + '.',
          (tr ? '<b>True:</b> ' : '<b>False:</b> ') + 'left side ' + t('\\sqrt{' + a * b + '}=' + sa * sb) + '; right side ' + (tr ? t(sa + '\\times ' + sb + '=' + sa * sb) : t(sa + '+' + sb + '=' + (sa + sb))) + '.', 'sqrt product of squares'); } }] },
    { num: '5', section: 'Entire radicals to mixed radicals', stem: 'Write each radical as a mixed radical in simplest form.', parts: [
      { id: '5a', level: 'BEG', make: function (r) { return mixPart(1, 2, 4 * r.pick([3, 5, 6, 10, 11, 13, 14, 15, 17, 19])); } },
      { id: '5b', level: 'BEG', make: function (r) { return mixPart(1, 2, 9 * r.pick([2, 3, 5, 6, 10, 11, 13])); } },
      { id: '5c', level: 'BEG', make: function (r) { return mixPart(1, 2, 25 * r.pick([2, 7, 10, 11, 13])); } },
      { id: '5d', level: 'BEG', make: function (r) { return mixPart(1, 2, pickR(r, 2, [8, 10, 11, 12, 13], [2, 3, 5, 6], 338, [242])); } },
      { id: '5e', level: 'EMG', make: function (r) { var c = r.pick([2, 3, 4, 5]), R = pickR(r, 2, [2, 3, 4], [5, 6, 7, 10, 11], 72, [45, 98]); return mixPart(c, 2, R); } },
      { id: '5f', level: 'EMG', make: function (r) { return mixPart(1, 3, 8 * r.pick([3, 5, 6, 9, 10, 11])); } },
      { id: '5g', level: 'PRG', make: function (r) { return mixPart(1, 3, -27 * r.pick([2, 4, 7, 10, 11])); } },
      { id: '5h', level: 'EMG', make: function (r) { return mixPart(1, 3, pickR(r, 3, [4, 5], [2, 4, 5, 3], 128, [192, 250])); } },
      { id: '5i', level: 'PRG', make: function (r) { return mixPart(1, 4, 16 * r.pick([2, 5, 6, 7, 10])); } },
      { id: '5j', level: 'PRG', make: function (r) { var c = r.pick([2, 3, 4, 5]), R = pickR(r, 3, [2, 3], [2, 3, 4, 5, 6, 7], 54, c === 3 ? [81] : []); return mixPart(-c, 3, R); } },
      { id: '5k', level: 'PRG', make: function (r) { return mixPart(1, 4, pickR(r, 4, [3, 5], [3, 5, 6, 7, 2], 405, [1250, 162])); } },
      { id: '5l', level: 'EMG', make: function (r) { return mixPart(-1, 2, pickR(r, 2, [6, 8, 10], [2, 3, 6, 7], 300, [500])); } }] },
    { num: '6', stem: 'Simplify. Use prime factors if it helps.', parts: [
      { id: '6a', level: 'PRG', make: function (r) { return mixPart(1, 2, pickR(r, 2, [20, 30, 50, 60], [2, 3, 5, 6, 7], 4500, [2700, 3200])); } },
      { id: '6b', level: 'PRG', make: function (r) { return mixPart(1, 2, pickR(r, 2, [12, 15, 18, 21, 22], [2, 3, 5, 6, 7], 1350, [1176])); } },
      { id: '6c', level: 'PRG', make: function (r) { return mixPart(1, 3, pickR(r, 3, [6, 10, 12], [2, 3, 5], 2000, [4000, 3024])); } },
      { id: '6d', level: 'ADV', make: function (r) { return mixPart(1, 3, -pickR(r, 3, [7, 13], [2, 3], 686, [])); } }] },
    { num: '7', stem: 'Each student’s answer is not correct or not in simplest form.', shared: function (r) {
        var j = pickWhere(function () { var S = r.pick([6, 8, 9, 10, 12]), ds = HW.nt.divisors(S).filter(function (d) { return d > 1 && d < S; }), a = r.pick(ds), m = r.pick([2, 3, 5, 7]); return { S: S, a: a, m: m, N: S * S * m }; }, function (v) { return v.N !== 180 && v.N !== 72 && v.N <= 1200; }, { S: 6, a: 2, m: 5, N: 180 });
        var l = r.pick([[80, 4, 5], [96, 4, 6], [112, 4, 7], [162, 9, 2], [72, 6, 2], [200, 10, 2], [176, 4, 11], [243, 9, 3]]);
        return { j: j, l: { N: l[0], s: l[1], m: l[2] }, names: r.sample(['Jade', 'Liam', 'Noor', 'Mateo', 'Ava', 'Kenji'], 2) };
      }, parts: [
      { id: '7a1', sub: 'a i', level: 'EMG', make: function (r, sh) {
        var j = sh.j, b = j.S / j.a, rest = j.N / (j.a * j.a);
        return P.mc(r, sh.names[0] + ' wrote ' + t('\\sqrt{' + j.N + '}=' + j.a + '\\sqrt{' + rest + '}') + '. What is the mistake?', [
          { html: t(rest + '=' + b * b + '\\times ' + j.m) + ' still has the perfect-square factor ' + t(b * b) + ', so it isn’t in simplest form.', right: true },
          { html: t(j.a * j.a) + ' is not a factor of ' + t(j.N) + '.', why: 'Check: ' + t(j.a * j.a + '\\times ' + rest + '=' + j.N) + ', so the work so far is correct — but is it finished?' },
          { html: 'The ' + t(j.a) + ' should stay under the root.', why: t('\\sqrt{' + j.a * j.a + '}=' + j.a) + ' does come out of the root. Look at what is left inside.' },
          { html: 'Nothing — it is in simplest form.', why: 'Look at ' + t(rest) + ': does it have a perfect-square factor?' }],
          t(rest + '=' + b * b + '\\times ' + j.m) + ', and ' + t(b * b) + ' is a perfect square, so ' + t(j.a + '\\sqrt{' + rest + '}') + ' is not finished. Use the <b>largest</b> perfect square factor, ' + t(j.S * j.S) + ', right away.', ['Does the number left under the root have a perfect-square factor?'], 'mistake: not largest square');
      } },
      { id: '7a2', sub: 'a ii', level: 'EMG', make: function (r, sh) {
        var j = sh.j, b = j.S / j.a, rest = j.N / (j.a * j.a);
        var p = mixPart(1, 2, j.N, { prompt: 'Give the correct simplest form of ' + t('\\sqrt{' + j.N + '}') + '.' });
        p.solution = t(j.a + '\\sqrt{' + rest + '}=' + j.a + '\\sqrt{' + b * b + '\\times ' + j.m + '}=' + j.a + '\\times ' + b + '\\sqrt{' + j.m + '}=' + j.S + '\\sqrt{' + j.m + '}') + '.<br>In one step: ' + t('\\sqrt{' + j.N + '}=\\sqrt{' + j.S * j.S + '\\times ' + j.m + '}=' + j.S + '\\sqrt{' + j.m + '}') + '.';
        p.bad = (p.bad || []).concat([j.a + '\\sqrt{' + rest + '}']);
        return p;
      } },
      { id: '7b1', sub: 'b i', level: 'PRG', make: function (r, sh) {
        var l = sh.l, f = ex.nthFactor(l.N, 3), rem = l.N / (f * f * f);
        return P.mc(r, sh.names[1] + ' wrote ' + t('\\sqrt[3]{' + l.N + '}=' + l.s + '\\sqrt[3]{' + l.m + '}') + '. What is the mistake?', [
          { html: 'He took ' + t('\\sqrt{' + l.s * l.s + '}=' + l.s) + ' out, but ' + t(l.s * l.s) + ' is a perfect <b>square</b>, not a perfect cube. Only a perfect cube comes out of a cube root.', right: true },
          { html: t(l.N) + ' has no perfect-cube factor, so ' + t('\\sqrt[3]{' + l.N + '}') + ' is already in simplest form.', why: t(l.N + '=' + f * f * f + '\\times ' + rem) + ', and ' + t(f * f * f + '=' + f + '^{3}') + '.' },
          { html: 'The ' + t(l.s) + ' should be ' + t(l.s * l.s) + ' in front.', why: 'The number in front would stand for its cube inside: ' + t(l.s + '\\sqrt[3]{' + l.m + '}=\\sqrt[3]{' + l.s * l.s * l.s * l.m + '}') + '.' },
          { html: 'Nothing — it is correct.', why: 'Check by cubing: ' + t(l.s + '\\sqrt[3]{' + l.m + '}=\\sqrt[3]{' + l.s + '^{3}\\times ' + l.m + '}=\\sqrt[3]{' + l.s * l.s * l.s * l.m + '}') + ', not ' + t('\\sqrt[3]{' + l.N + '}') + '.' }],
          t(l.N + '=' + l.s * l.s + '\\times ' + l.m) + ' uses a perfect square, which is right for a square root but not a cube root. Use a perfect cube: ' + t(l.N + '=' + f * f * f + '\\times ' + rem) + '.', ['Is ' + t(l.s * l.s) + ' a perfect cube?'], 'mistake: square in a cube root');
      } },
      { id: '7b2', sub: 'b ii', level: 'PRG', make: function (r, sh) { var l = sh.l; var p = mixPart(1, 3, l.N, { prompt: 'Give the correct simplest form of ' + t('\\sqrt[3]{' + l.N + '}') + '.' }); p.bad = (p.bad || []).concat([l.s + '\\sqrt[3]{' + l.m + '}']); return p; } }] },
    { num: '8', stem: function (sh) { return 'Given ' + t('\\sqrt{' + sh.b + '}\\approx ' + strip0((GIVEN[sh.b] / 1000).toFixed(3))) + ', determine an approximate value of each without a calculator.'; },
      shared: function (r) { return { b: r.pick([5, 6, 10, 11]), k1: r.pick([2, 3]), k2: r.pick([4, 5, 6]) }; }, parts: [
      { id: '8a', level: 'EMG', make: function (r, sh) { return approxPart(sh.b, 10, 1); } },
      { id: '8b', level: 'EMG', make: function (r, sh) { return approxPart(sh.b, sh.k1, 1); } },
      { id: '8c', level: 'PRG', make: function (r, sh) { return approxPart(sh.b, 1, 10); } },
      { id: '8d', level: 'EMG', make: function (r, sh) { return approxPart(sh.b, sh.k2, 1); } },
      { id: '8e', level: 'PRG', make: function (r, sh) { return approxPart(sh.b, 100, 1); } }] },
    { num: '9', section: 'Mixed radicals to entire radicals', stem: 'Write each mixed radical as an entire radical.', parts: [
      { id: '9a', level: 'BEG', make: function (r) { var c = r.pick([5, 8, 9]), m = r.pick([2, 3, 5]); return entirePart(c, 2, m); } },
      { id: '9b', level: 'BEG', make: function (r) { return entirePart(r.pick([2, 3, 4]), 2, r.pick([7, 10, 13, 14])); } },
      { id: '9c', level: 'EMG', make: function (r) { return entirePart(-r.pick([2, 3, 5, 6]), 2, r.pick([3, 6, 7, 10])); } },
      { id: '9d', level: 'BEG', make: function (r) { var c = r.pick([2, 3]), m = r.pick(c === 2 ? [3, 5, 6, 9] : [2, 5, 7]); return entirePart(c, 3, m); } },
      { id: '9e', level: 'EMG', make: function (r) { var c = r.pick([2, 4]), m = r.pick([3, 5, 6, 7]); return entirePart(-c, 3, m); } },
      { id: '9f', level: 'EMG', make: function (r) { var c = r.pick([4, 5, 10]), m = r.pick(c === 10 ? [2, 4, 5] : [2, 3]); return entirePart(c, 3, m); } },
      { id: '9g', level: 'EMG', make: function (r) { var c = r.pick([2, 3]), m = r.pick(c === 2 ? [7, 6] : [2, 3]); return entirePart(c, 4, m); } },
      { id: '9h', level: 'PRG', make: function (r) { var q = r.pick([2, 3, 4, 5]), tt = r.pick([2, 3, 5, 7, 6].filter(function (x) { return !(q === 3 && x === 6) && !(q === 2 && x === 5); })); return entirePart([1, q], 2, q * q * tt); } },
      { id: '9i', level: 'PRG', make: function (r) { var q = r.pick([2, 3]), tt = r.pick([2, 3, 4, 6, 7].filter(function (x) { return x % q; })); return entirePart([1, q], 3, q * q * q * tt); } }] },
    { num: '10', section: 'Comparing and ordering radicals', stem: '', parts: [
      { id: '10', level: 'PRG', make: function (r) { return orderPart(r, sqItems(r, 4, 55, 100, [80, 72, 63, 76, 77]), true, 2, 'order 5 square roots (greatest first)'); } }] },
    { num: '11', stem: function (sh) { return 'Consider the radicals ' + sh.items.map(function (x) { return t(x.tex); }).join(', \\ ') + '.'; },
      shared: function (r) { return { items: cbItems(r, 2, 1, 2, 30, 150) }; }, parts: [
      { id: '11a', level: 'EMG', make: function (r) {
        return P.mc(r, '(a) How can you order them without a calculator?', [
          { html: 'Write each as an entire cube root: cube the number in front (a negative stays negative) and multiply by the radicand. Then compare the radicands.', right: true },
          { html: 'Compare the numbers in front of the roots: the larger the coefficient, the larger the radical.', why: 'The radicand matters too: ' + t('2\\sqrt[3]{9}=\\sqrt[3]{72}') + ' is larger than ' + t('3\\sqrt[3]{2}=\\sqrt[3]{54}') + '.' },
          { html: 'Multiply each coefficient by its radicand and compare the products.', why: 'A coefficient moving inside a cube root is <b>cubed</b>: ' + t('2\\sqrt[3]{9}=\\sqrt[3]{2^{3}\\times 9}') + ', not ' + t('\\sqrt[3]{18}') + '.' },
          { html: 'Ignore the signs and compare the entire radicals.', why: 'The negative ones are less than every positive one, and ' + t('\\sqrt[3]{-128}<\\sqrt[3]{-120}') + '.' }],
          'Write each one as an entire radical with index ' + t('3') + ': cube the coefficient (for an odd index a negative coefficient goes inside as a negative) and multiply by the radicand. With the same index, the larger radicand gives the larger value — and a more negative radicand gives a smaller value.',
          ['What do you have to do to a coefficient to move it inside a cube root?'], 'how to order cube roots');
      } },
      { id: '11b', level: 'PRG', make: function (r, sh) { var p = orderPart(r, sh.items, false, 3, 'order cube roots with negatives'); p.prompt = '(b) Arrange them from <b>least to greatest</b>.'; return p; } }] },
    { num: '12', section: 'Radicals in context', stem: 'Give each answer exactly, in simplest form.', parts: [
      { id: '12a', level: 'PRG', make: function (r) { var A = pickR(r, 2, [3, 4, 5, 6, 7, 8, 9, 10], [2, 3, 5, 6, 7], 147, [180, 288, 300]); return sideFields(A, 'cm', null, '(a) A square tile has an area of ' + t(F(A) + '\\ \\text{cm}^{2}') + '. '); } },
      { id: '12b', level: 'ADV', make: function (r) {
        var k = r.pick([2, 3, 5]), L = r.pick([4, 5, 6, 7, 8, 9, 11, 12].filter(function (x) { return !(k === 2 && x === 10); })), word = { 2: 'twice', 3: 'three times', 5: 'five times' }[k], A = k * L * L;
        return P.radical('(b) A square has ' + word + ' the area of a square with side ' + t(L) + ' m. Determine its side length.', { k: [L, 1], n: 2, m: k }, 'mixed',
          'Area of the small square: ' + t(L + '^{2}=' + L * L) + '. The new area is ' + t(k + '\\times ' + L * L + '=' + A) + ' m².<br>' + t('s=\\sqrt{' + A + '}=\\sqrt{' + L * L + '\\times ' + k + '}=' + L + '\\sqrt{' + k + '}') + ' m.',
          ['First find the area of the new square.', 'Its side is the square root of that area.'], 'square with ' + k + 'x area of side ' + L,
          { diag: function (val) { if (ex.eq(val, k * L) || ex.eq(val, Math.sqrt(k * L))) return { code: 'u2l1-area-side', hint: 'Multiply the <b>area</b> (not the side) by ' + t(k) + ': the small square’s area is ' + t(L + '^{2}') + '.' }; return null; } });
      } },
      { id: '12c', level: 'PRG', make: function (r) { var V = pickR(r, 3, [2, 3, 4, 5], [2, 3, 5, 6, 7, 9], 250, [448, 1080]); return cubeEdge(V, 'cm', '(c) A cube has a volume of ' + t(F(V) + '\\ \\text{cm}^{3}') + '.'); } }] },
    { num: '13', stem: 'Determine each length exactly, in simplest form.', parts: [
      { id: '13a', level: 'PRG', make: function (r) { return hypPart(r, [[4, 8], [6, 9]]); } },
      { id: '13b', level: 'PRG', make: function (r) { return distPart(r, [[6, 6], [5, 10]]); } }] },
    { num: '14', section: 'Multiple choice and numerical response', stem: '<i>(Multiple Choice)</i>', parts: [
      { id: '14', level: 'EMG', make: function (r) {
        var good = r.pick([30, 42, 66, 70, 78, 102, 105, 110, 21, 35]), a = 4 * r.pick([5, 6, 7, 10, 11]), b = 8 * r.pick([3, 5, 6, 7]), c = 16 * r.pick([2, 3, 5]);
        return P.mc(r, 'Which radical is in simplest form?', [
          { html: t('\\sqrt{' + good + '}'), right: true },
          { html: t('\\sqrt{' + a + '}'), why: t(a + '=4\\times ' + a / 4) + ' has the perfect-square factor 4: ' + t('\\sqrt{' + a + '}=2\\sqrt{' + a / 4 + '}') + '.' },
          { html: t('\\sqrt[3]{' + b + '}'), why: t(b + '=8\\times ' + b / 8) + ' has the perfect-cube factor 8: ' + t('\\sqrt[3]{' + b + '}=2\\sqrt[3]{' + b / 8 + '}') + '.' },
          { html: t('\\sqrt[4]{' + c + '}'), why: t(c + '=16\\times ' + c / 16) + ' has the perfect fourth power 16: ' + t('\\sqrt[4]{' + c + '}=2\\sqrt[4]{' + c / 16 + '}') + '.' }],
          t(good + '=' + HW.texExpanded(good)) + ' has no perfect-square factor, so ' + t('\\sqrt{' + good + '}') + ' is in simplest form. The others simplify: ' + t('\\sqrt{' + a + '}=2\\sqrt{' + a / 4 + '}') + ', ' + t('\\sqrt[3]{' + b + '}=2\\sqrt[3]{' + b / 8 + '}') + ', ' + t('\\sqrt[4]{' + c + '}=2\\sqrt[4]{' + c / 16 + '}') + '.',
          ['For each one, look for a perfect power (matching the index) that divides the radicand.'], 'MC simplest form');
      } }] },
    { num: '15', stem: '<i>(Multiple Choice)</i>', parts: [
      { id: '15', level: 'EMG', make: function (r) {
        var cm = pickWhere(function () { return [r.pick([2, 3, 4]), r.pick([2, 3, 5, 7, 9])]; }, function (v) { return !(v[0] === 2 && v[1] === 5) && !(v[0] === 3 && v[1] === 9); }, [3, 2]), c = cm[0], m = cm[1], C = c * c * c * m;
        return P.mc(r, 'As an entire radical, ' + t('-' + c + '\\sqrt[3]{' + m + '}') + ' is', [
          { html: t('\\sqrt[3]{-' + C + '}'), right: true },
          { html: t('-\\sqrt[3]{' + c * m + '}'), why: 'The coefficient is <b>cubed</b> when it moves inside: ' + t(c + '^{3}=' + c * c * c) + ', not ' + t(c) + '.' },
          { html: t('\\sqrt[3]{' + C + '}'), why: 'Check the sign: ' + t('(-' + c + ')^{3}=-' + c * c * c) + ' is negative.' },
          { html: t('\\sqrt[3]{-' + c * m + '}'), why: 'Cube the coefficient: ' + t('(-' + c + ')^{3}=-' + c * c * c) + '.' }],
          t('(-' + c + ')^{3}\\times ' + m + '=-' + c * c * c + '\\times ' + m + '=-' + C) + ', so ' + t('-' + c + '\\sqrt[3]{' + m + '}=\\sqrt[3]{-' + C + '}') + '. (Odd index: the negative can go inside.)', ['Cube the coefficient, sign and all.'], 'MC entire of -' + c + 'cbrt' + m);
      } }] },
    { num: '16', stem: '<i>(Multiple Choice)</i>', parts: [
      { id: '16', level: 'EMG', make: function (r) {
        var sq = r.pick([[9, 16, 25], [36, 64, 100], [25, 144, 169]]), pq = r.pick([[2, 8, 4], [3, 12, 6], [2, 18, 6], [5, 20, 10], [3, 27, 9]]), s = r.pick([4, 9, 16, 36]), c = r.pick([8, 27, 64]);
        return P.mc(r, 'Which statement is true?', [
          { html: t('\\sqrt{' + pq[0] + '}\\times\\sqrt{' + pq[1] + '}=' + pq[2]), right: true },
          { html: t('\\sqrt{' + sq[0] + '}+\\sqrt{' + sq[1] + '}=\\sqrt{' + sq[2] + '}'), why: 'Left side: ' + t(Math.sqrt(sq[0]) + '+' + Math.sqrt(sq[1]) + '=' + (Math.sqrt(sq[0]) + Math.sqrt(sq[1]))) + '; right side: ' + t(Math.sqrt(sq[2])) + '.' },
          { html: t('\\sqrt{' + 2 * s + '}-\\sqrt{' + s + '}=\\sqrt{' + s + '}'), why: t('\\sqrt{' + 2 * s + '}=' + Math.sqrt(s) + '\\sqrt{2}') + ', not ' + t(2 * Math.sqrt(s)) + ', so the left side isn’t ' + t(Math.sqrt(s)) + '.' },
          { html: t('\\sqrt[3]{' + c + '}+\\sqrt[3]{' + c + '}=\\sqrt[3]{' + 2 * c + '}'), why: 'Left side: ' + t(Math.round(Math.cbrt(c)) + '+' + Math.round(Math.cbrt(c)) + '=' + 2 * Math.round(Math.cbrt(c))) + ', but ' + t('\\sqrt[3]{' + 2 * c + '}') + ' isn’t ' + t(2 * Math.round(Math.cbrt(c))) + '.' }],
          t('\\sqrt{' + pq[0] + '}\\times\\sqrt{' + pq[1] + '}=\\sqrt{' + pq[0] * pq[1] + '}=' + pq[2]) + ' — true. Roots multiply under one root sign, but they don’t add or subtract that way.', ['Check each one by working out both sides.'], 'MC which is true');
      } }] },
    { num: '17', stem: '<i>(Numerical Response)</i>', parts: [
      { id: '17', level: 'PRG', make: function (r) {
        var pq = pickWhere(function () { return [r.pick([3, 4, 5, 6, 8, 9]), r.pick([2, 3, 4, 5, 6, 7, 9])]; }, function (v) { return ex.nthFactor(v[1], 3) === 1 && !(v[0] === 7 && v[1] === 4); }, [5, 3]), p = pq[0], q = pq[1], V = p * p * p * q;
        return P.nr('A cube has a volume of ' + t(F(V) + '\\ \\text{cm}^{3}') + '. Its edge length in simplest form is ' + t('p\\sqrt[3]{q}') + ' cm. The value of ' + t('p+q') + ' is ________.', p + q,
          function (v) { if (v === p || v === q) return { code: 'u2l1-nr-sum', hint: 'Record ' + t('p+q') + ', the sum of the coefficient and the radicand.' }; if (v === p * p + q || v === p * p * p + q) return { code: 'coef-power', hint: 'The perfect cube comes out as its <b>cube root</b>.' }; return null; },
          t('\\sqrt[3]{' + F(V) + '}=\\sqrt[3]{' + p * p * p + '\\times ' + q + '}=' + p + '\\sqrt[3]{' + q + '}') + ', so ' + t('p+q=' + p + '+' + q + '=' + (p + q)) + '.', ['The edge is the cube root of the volume. Find the largest perfect cube that divides ' + t(F(V)) + '.'], 'NR cube edge p+q');
      } }] },
    { num: '18', stem: '<i>(Numerical Response)</i>', parts: [
      { id: '18', level: 'BEG', make: function (r) {
        var cm = pickWhere(function () { return [r.int(2, 9), r.pick([2, 3, 5, 6, 7, 10, 11])]; }, function (v) { return ['5,6', '4,3', '7,2'].indexOf(v.join()) < 0; }, [4, 5]), c = cm[0], m = cm[1], N = c * c * m;
        return P.nr('When ' + t(c + '\\sqrt{' + m + '}') + ' is written as the entire radical ' + t('\\sqrt{n}') + ', the value of ' + t('n') + ' is ________.', N,
          function (v) { if (v === c * m) return { code: 'u2l1-nr-square', hint: 'Square the ' + t(c) + ' first: ' + t(c + '^{2}=' + c * c) + ', then multiply by ' + t(m) + '.' }; if (v === 2 * c * m) return { code: 'u2l1-nr-square', hint: 'Squaring isn’t doubling: ' + t(c + '^{2}=' + c * c) + '.' }; return null; },
          t(c + '\\sqrt{' + m + '}=\\sqrt{' + c + '^{2}\\times ' + m + '}=\\sqrt{' + c * c + '\\times ' + m + '}=\\sqrt{' + N + '}') + '. Record ' + t(N) + '.', ['Square the coefficient and multiply by the radicand.'], 'NR entire of ' + c + 'sqrt' + m);
      } }] }
  ];

  /* ================================ Extra practice ================================ */
  var EXTRA = [
    { num: 'A1', section: 'A. Skills', stem: 'Without a calculator, evaluate where possible. If the radical is not a real number, press <b>none</b>.', parts: [
      { id: 'xa1a', level: 'BEG', make: function (r) { var s = r.pick([13, 15, 16, 17, 18, 21, 25]); return evalPart({ n: 2, num: s * s }); } },
      { id: 'xa1b', level: 'BEG', make: function (r) { var s = r.pick([2, 3, 4, 5, 6, 7]); return evalPart({ n: 3, num: s * s * s, outer: -1 }); } },
      { id: 'xa1c', level: 'BEG', make: function (r) { var s = r.pick([1, 3, 5, 7]); return evalPart({ n: 2, num: -s * s }); } },
      { id: 'xa1d', level: 'BEG', make: function (r) { var s = r.pick([3, 4, 5, 10]); return evalPart({ n: 4, num: pw(s, 4) }); } },
      { id: 'xa1e', level: 'EMG', make: function (r) { var ab = r.pick([[1, 2], [1, 4], [1, 5], [2, 3], [1, 10], [2, 5]]); return evalPart({ n: 3, num: -pw(ab[0], 3), den: pw(ab[1], 3) }); } },
      { id: 'xa1f', level: 'EMG', make: function (r) { var s = r.pick([2, 5, 6, 7, 8, 9, 12]); return evalPart({ n: 2, num: s * s, den: 100, dec: true }); } }] },
    { num: 'A2', stem: '', parts: [
      { id: 'xa2', level: 'BEG', make: function (r) { return classifyPart(r, 'Classify each number as rational or irrational.', clsItems(r, r.shuffle(['sq', 'sq', 'cubeneg', 'cubeneg'])), 'classify four roots'); } }] },
    { num: 'A3', stem: 'Write each radical as a mixed radical in simplest form.', parts: [
      { id: 'xa3a', level: 'BEG', make: function (r) { return mixPart(1, 2, 16 * r.pick([3, 5, 6, 7])); } },
      { id: 'xa3b', level: 'BEG', make: function (r) { return mixPart(1, 2, 36 * r.pick([2, 5, 6, 7])); } },
      { id: 'xa3c', level: 'BEG', make: function (r) { return mixPart(1, 2, 25 * r.pick([3, 5, 6, 11])); } },
      { id: 'xa3d', level: 'EMG', make: function (r) { var c = r.pick([2, 3, 5]); return mixPart(c, 2, pickR(r, 2, [3, 4, 6], [2, 3, 5], 50, [72])); } },
      { id: 'xa3e', level: 'EMG', make: function (r) { return mixPart(1, 3, 8 * r.pick([3, 4, 6, 7, 9])); } },
      { id: 'xa3f', level: 'PRG', make: function (r) { return mixPart(1, 3, -8 * r.pick([2, 5, 6, 7, 9])); } },
      { id: 'xa3g', level: 'EMG', make: function (r) { return mixPart(1, 3, pickR(r, 3, [3, 4, 5], [2, 3], 81, [128])); } },
      { id: 'xa3h', level: 'PRG', make: function (r) { return mixPart(1, 4, pickR(r, 4, [2, 3], [3, 6, 7, 2], 48, [80])); } }] },
    { num: 'A4', stem: 'Write each mixed radical as an entire radical.', parts: [
      { id: 'xa4a', level: 'BEG', make: function (r) { return entirePart(r.pick([3, 4, 6]), 2, r.pick([2, 5, 7])); } },
      { id: 'xa4b', level: 'BEG', make: function (r) { return entirePart(r.pick([7, 8, 10]), 2, r.pick([3, 2, 5])); } },
      { id: 'xa4c', level: 'EMG', make: function (r) { return entirePart(-r.pick([3, 4, 7]), 2, r.pick([2, 5, 6])); } },
      { id: 'xa4d', level: 'BEG', make: function (r) { return entirePart(r.pick([2, 3, 5]), 3, r.pick([3, 4, 5])); } },
      { id: 'xa4e', level: 'EMG', make: function (r) { return entirePart(-r.pick([3, 4, 5]), 3, r.pick([2, 3, 7])); } },
      { id: 'xa4f', level: 'EMG', make: function (r) { return entirePart(r.pick([2, 4]), 4, r.pick([3, 5])); } }] },
    { num: 'B1', section: 'B. Applying', stem: '', parts: [
      { id: 'xb1', level: 'PRG', make: function (r) { return orderPart(r, sqItems(r, 4, 40, 80, [60, 48, 45, 58, 72]), false, 2, 'order 5 square roots (least first)'); } }] },
    { num: 'B2', stem: '', parts: [
      { id: 'xb2', level: 'PRG', make: function (r) { return orderPart(r, cbItems(r, 2, 2, 1, 40, 90), true, 3, 'order cube roots (greatest first)'); } }] },
    { num: 'B3', stem: '', parts: [
      { id: 'xb3', level: 'PRG', make: function (r) { var A = pickR(r, 2, [7, 8, 9, 11, 12, 13], [2, 3, 5], 245, [363, 288]); return sideFields(A, 'm', null, 'A square courtyard has an area of ' + t(F(A) + '\\ \\text{m}^{2}') + '. ', 'courtyard ' + A); } }] },
    { num: 'B4', stem: '', parts: [
      { id: 'xb4', level: 'PRG', make: function (r) { return distPart(r, [[6, 3], [6, 6], [5, 10]]); } }] },
    { num: 'B5', stem: function (sh) { return 'Given ' + t('\\sqrt{' + sh.b + '}\\approx ' + strip0((GIVEN[sh.b] / 1000).toFixed(3))) + ', approximate without a calculator.'; },
      shared: function (r) { return { b: r.pick([2, 3, 5, 7]), k: r.pick([3, 4, 5]) }; }, parts: [
      { id: 'xb5a', level: 'EMG', make: function (r, sh) { return approxPart(sh.b, 10, 1); } },
      { id: 'xb5b', level: 'PRG', make: function (r, sh) { return approxPart(sh.b, 1, 10); } },
      { id: 'xb5c', level: 'EMG', make: function (r, sh) { return approxPart(sh.b, sh.k, 1); } },
      { id: 'xb5d', level: 'PRG', make: function (r, sh) { return approxPart(sh.b, 20, 1); } }] },
    { num: 'B6', stem: '<i>(Multiple Choice)</i>', parts: [
      { id: 'xb6', level: 'EMG', make: function (r) {
        var its = pickWhere(function () { return r.sample([[2, 3], [3, 2], [2, 5], [3, 3], [4, 2], [2, 7], [3, 5], [5, 2], [2, 6], [4, 3]], 3); }, function (v) { var vs = v.map(function (x) { return x[0] * x[0] * x[1]; }); return vs[0] !== vs[1] && vs[1] !== vs[2] && vs[0] !== vs[2] && !(v.map(function (x) { return x[0]; }).join() === '2,3,2'); }, [[2, 3], [3, 2], [2, 5]]);
        var tex = function (x) { return x[0] + '\\sqrt{' + x[1] + '}'; }, val = function (x) { return x[0] * x[0] * x[1]; };
        var sorted = its.slice().sort(function (a, b) { return val(a) - val(b); }), perms = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]].filter(function (pp) { return pp.join() !== '0,1,2'; });
        var wrongs = r.sample(perms, 3).map(function (pp) { return { html: t(pp.map(function (i) { return tex(sorted[i]); }).join(',\\ ')), why: 'Write each as an entire radical: ' + its.map(function (x) { return t(tex(x) + '=\\sqrt{' + val(x) + '}'); }).join(', ') + '.' }; });
        return P.mc(r, 'Which list is in order from least to greatest?', [{ html: t(sorted.map(tex).join(',\\ ')), right: true }].concat(wrongs),
          its.map(function (x) { return t(tex(x) + '=\\sqrt{' + val(x) + '}'); }).join(', ') + ', so the order is ' + t(sorted.map(tex).join('<')) + '.', ['Convert each to an entire radical.'], 'MC order three mixed radicals');
      } }] },
    { num: 'B7', stem: '<i>(Numerical Response)</i>', parts: [
      { id: 'xb7', level: 'BEG', make: function (r) {
        var cm = pickWhere(function () { return [r.pick([2, 3, 4, 5]), r.pick([2, 3, 5, 6, 7, 9, 10])]; }, function (v) { return !(v[0] === 3 && v[1] === 7) && !(v[0] === 2 && v[1] === 7) && !(v[0] === 3 && v[1] === 4); }, [2, 5]), c = cm[0], m = cm[1], N = c * c * c * m;
        return P.nr('When ' + t(c + '\\sqrt[3]{' + m + '}') + ' is written as the entire radical ' + t('\\sqrt[3]{n}') + ', the value of ' + t('n') + ' is ________.', N,
          function (v) { if (v === c * c * m) return { code: 'wrong-power', hint: 'This is a <b>cube</b> root: cube the coefficient, ' + t(c + '^{3}=' + c * c * c) + '.' }; if (v === c * m || v === 3 * c * m) return { code: 'u2l1-nr-square', hint: 'Cube the ' + t(c) + ' first: ' + t(c + '^{3}=' + c * c * c) + '.' }; return null; },
          t(c + '^{3}\\times ' + m + '=' + c * c * c + '\\times ' + m + '=' + N) + ', so ' + t(c + '\\sqrt[3]{' + m + '}=\\sqrt[3]{' + N + '}') + '.', ['Cube the coefficient and multiply by the radicand.'], 'NR entire of ' + c + 'cbrt' + m);
      } }] },
    { num: 'C1', section: 'C. Stretch', stem: function (sh) { return 'Consider ' + t('\\sqrt{' + F(sh.N) + '}') + '.'; },
      shared: function (r) { var o = r.pick([[12, 3], [12, 2], [18, 2], [18, 3], [20, 2], [20, 3], [24, 2]]); return { S: o[0], m: o[1], N: o[0] * o[0] * o[1] }; }, parts: [
      { id: 'xc1a', level: 'ADV', make: function (r, sh) {
        var N = sh.N, ds = HW.nt.divisors(sh.S).filter(function (d) { return d > 1; });
        var right = ds.map(function (a) { return { a: a, b: N / (a * a), ok: true }; });
        var wrongC = [];
        [2, 3, 4, 5, 6, 8, 9, 10, 12].forEach(function (a) { if (N % a === 0 && N / a > 1 && !right.some(function (x) { return x.a === a && x.b === N / a; })) wrongC.push({ a: a, b: N / a, ok: false, why: t(a + '\\sqrt{' + N / a + '}=\\sqrt{' + a * a * (N / a) + '}') + ', not ' + t('\\sqrt{' + N + '}') + ' — the number in front stands for its <b>square</b> inside.' }); });
        [5, 7].forEach(function (a) { if (sh.S % a) wrongC.push({ a: a, b: Math.round(N / (a * a)), ok: false, why: t(a * a) + ' doesn’t divide ' + t(N) + '.' }); });
        var opts = r.shuffle(right.concat(r.sample(wrongC, Math.min(3, wrongC.length)))).map(function (x, i) { return { value: 'o' + i, html: t(x.a + '\\sqrt{' + F(x.b) + '}'), x: x }; });
        var want = opts.filter(function (o) { return o.x.ok; }).map(function (o) { return o.value; });
        var check = K.selectSet(want, function (extra, missing) {
          if (extra.length) { var o = opts.filter(function (z) { return z.value === extra[0]; })[0]; return { code: 'u2l1-select', hint: 'Check ' + o.html + ': ' + o.x.why }; }
          return { code: 'u2l1-select', hint: 'You’re missing ' + (missing.length === 1 ? 'one' : missing.length) + '. Every perfect-square factor of ' + t(N) + ' (other than 1) gives a form ' + t('a\\sqrt{b}') + '.' };
        });
        return { prompt: 'Tap <b>every</b> way to write ' + t('\\sqrt{' + F(N) + '}') + ' in the form ' + t('a\\sqrt{b}') + ' with whole numbers ' + t('a>1') + ' and ' + t('b>1') + '.', input: { type: 'select', options: opts.map(function (o) { return { value: o.value, html: o.html }; }) },
          check: check, key: want, answer: opts.filter(function (o) { return o.x.ok; }).map(function (o) { return o.html; }).join(', '),
          solution: 'The perfect-square factors of ' + t(N) + ' (other than 1 and ' + t(N) + ') are ' + t(right.map(function (x) { return x.a * x.a; }).join(',\\ ')) + ':<br>' + right.map(function (x) { return t('\\sqrt{' + F(N) + '}=\\sqrt{' + x.a * x.a + '\\times ' + x.b + '}=' + x.a + '\\sqrt{' + x.b + '}'); }).join('<br>'),
          hints: ['Each perfect-square factor ' + t('a^{2}') + ' of ' + t(N) + ' gives ' + t('a\\sqrt{N/a^{2}}') + '.', 'Check an option by squaring its coefficient and multiplying by the radicand.'], text: 'all a√b forms of √' + N };
      } },
      { id: 'xc1b', level: 'EMG', make: function (r, sh) { return mixPart(1, 2, sh.N, { prompt: 'Which of these forms is the <b>simplest form</b>? Type it.' }); } }] },
    { num: 'C2', stem: '', parts: [
      { id: 'xc2', level: 'MAS', make: function (r) {
        var o = pickWhere(function () { return { m: r.pick([2, 3, 5, 6, 7]), U: r.pick([20, 25, 30, 40, 50]) }; }, function (v) { return !(v.m === 5 && v.U === 30); }, { m: 3, U: 20 }), m = o.m, U = o.U;
        var k = Math.floor(Math.sqrt(U * U / m) - 1e-9); while ((k + 1) * (k + 1) * m < U * U) k++; while (k * k * m >= U * U) k--;
        return P.number('Determine the largest whole number ' + t('k') + ' for which ' + t('k\\sqrt{' + m + '}<' + U) + '. (No calculator.)', k,
          function (v) { if (v === k + 1) return { code: 'u2l1-k-off', hint: 'Check: ' + t((k + 1) + '\\sqrt{' + m + '}=\\sqrt{' + (k + 1) * (k + 1) * m + '}') + ' and ' + t(U + '=\\sqrt{' + U * U + '}') + '. Is it still less than ' + t(U) + '?' }; if (v === Math.floor(U / m) || v === Math.floor(U / Math.sqrt(m) * 0 + U / m)) return { code: 'u2l1-k', hint: 'Write both sides as entire radicals: ' + t('k\\sqrt{' + m + '}=\\sqrt{' + m + 'k^{2}}') + ' and ' + t(U + '=\\sqrt{' + U * U + '}') + '.' }; return null; },
          'As entire radicals: ' + t('\\sqrt{' + m + 'k^{2}}<\\sqrt{' + U * U + '}') + ', so ' + t(m + 'k^{2}<' + U * U) + ' and ' + t('k^{2}<' + strip0((U * U / m).toFixed(2))) + '.<br>' + t(k + '^{2}=' + k * k) + ' works, but ' + t((k + 1) + '^{2}=' + (k + 1) * (k + 1)) + ' is too big, so ' + t('k=' + k) + '.',
          ['Write both sides as entire radicals: ' + t('k\\sqrt{' + m + '}=\\sqrt{' + m + 'k^{2}}') + ' and ' + t(U + '=\\sqrt{' + U * U + '}') + '.', 'Then find the largest ' + t('k') + ' with ' + t(m + 'k^{2}<' + U * U) + '.'], 'largest k with k sqrt' + m + ' < ' + U);
      } }] },
    { num: 'C3', stem: '', parts: [
      { id: 'xc3', level: 'MAS', make: function (r) {
        var ab = r.pick([[3, 2], [11, 5], [15, 6], [19, 7], [23, 8], [6, 3], [10, 5], [4, 3]]), a = ab[0], b = ab[1], A6 = a * a, B6 = b * b * b, cubeBig = A6 > B6;
        return P.mc(r, 'Without a calculator, which is greater: ' + t('\\sqrt[3]{' + a + '}') + ' or ' + t('\\sqrt{' + b + '}') + '? (Hint: raise each number to the 6th power.)', [
          { html: t('\\sqrt[3]{' + a + '}'), right: cubeBig, why: cubeBig ? null : 'Compare the 6th powers: ' + t('(\\sqrt[3]{' + a + '})^{6}=' + a + '^{2}=' + A6) + ' and ' + t('(\\sqrt{' + b + '})^{6}=' + b + '^{3}=' + B6) + '.' },
          { html: t('\\sqrt{' + b + '}'), right: !cubeBig, why: !cubeBig ? null : 'Compare the 6th powers: ' + t('(\\sqrt[3]{' + a + '})^{6}=' + a + '^{2}=' + A6) + ' and ' + t('(\\sqrt{' + b + '})^{6}=' + b + '^{3}=' + B6) + '.' },
          { html: 'They are equal.', why: 'Their 6th powers are ' + t(A6) + ' and ' + t(B6) + ' — not equal.' },
          { html: 'It can’t be decided without a calculator.', why: 'Raise both to the 6th power: the roots disappear.' }],
          t('\\left(\\sqrt[3]{' + a + '}\\right)^{6}=\\left(\\left(\\sqrt[3]{' + a + '}\\right)^{3}\\right)^{2}=' + a + '^{2}=' + A6) + '; ' + t('\\left(\\sqrt{' + b + '}\\right)^{6}=\\left(\\left(\\sqrt{' + b + '}\\right)^{2}\\right)^{3}=' + b + '^{3}=' + B6) + '.<br>Both numbers are positive and ' + t(Math.max(A6, B6) + '>' + Math.min(A6, B6)) + ', so ' + t(cubeBig ? '\\sqrt[3]{' + a + '}' : '\\sqrt{' + b + '}') + ' is greater.',
          ['6 is a multiple of both indexes: ' + t('(\\sqrt[3]{x})^{6}=x^{2}') + ' and ' + t('(\\sqrt{y})^{6}=y^{3}') + '.', 'For positive numbers, the one with the larger 6th power is larger.'], 'compare cbrt' + a + ' and sqrt' + b);
      } }] }
  ];

  HW.defineLesson({ id: LID, unit: 2, num: '1', title: 'Mixed and Entire Radicals', outcome: 'AN2', calc: true,
    blurb: 'Evaluating roots exactly, simplest mixed form and entire radicals of any index, and comparing radicals without a calculator.',
    questions: QUESTIONS, extra: EXTRA });
})(window);
