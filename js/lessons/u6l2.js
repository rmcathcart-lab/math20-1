/* Math 20-1 · Unit 6 · Lesson 2 — Simplifying Rational Expressions by Factoring (outcome AN4 on every part)
 * Assignment 2 (m201book unit6/u6_l02.tex, Questions 1–18) and the Lesson 2 Extra Practice (u6_ep02.tex, A1–A3, B4–B9,
 * C1–C4). Every part is a generator: the booklet question's idea, form and difficulty with new numbers (the lesson's
 * example numbers and the booklet question's own numbers are left out). Calculator allowed; answers stay exact.
 * Uses the Unit 6 kit HW.u6kit from u6l1.js (load that first): each expression is built from its factors and reduced by
 * U.reduce, so the key, the NPVs and the "NPVs after cancelling" diagnosis come from the factors.
 * "Simplify. State the NPVs" is one part with two boxes (Simplified, NPVs); the simplified expression is checked by value
 * at six points, then for form (lowest terms, one fraction; factored or expanded both fine).
 * Conversions: "explain the error" -> multiple choice for the reason plus the corrected simplification or NPVs;
 * "which are equivalent? explain" -> one multiple choice per expression (yes / the opposite / different NPVs / no);
 * dimensions -> labelled boxes; the exact area with a radical -> one box (a + b√n); numerical response -> 4 characters.
 * Recognised mistakes: NPVs from the simplified expression (npv-cancel), from the numerator, signs; dividing out terms;
 * losing the −1 of opposite factors; monomial powers on the wrong side, coefficients not reduced (format).
 * Levels: LIM BEG EMG PRG ADV MAS. Mastery: Q5(d), Q6(f), Q7(d), Q9(e), Q10(c), Q13, Extra C1–C4.
 */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, B = K.P, P = HW.poly, ex = HW.ex, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
  var U = HW.u6kit, LID = 'u6l2', CP = LID + '-';
  if (!U) throw new Error('u6l2.js needs u6l1.js (HW.u6kit) loaded first');
  U.codes(CP);
  HW.addCodes({ 'u6l2-equiv': 'Equivalent expressions: wrong decision', 'u6l2-dims': 'Dimensions: length and width mixed up', 'u6l2-half': 'Triangle: left out the 2 in h = 2A/b', 'u6l2-trin': 'Trinomials over trinomials: wrong expression' });
  HW.addPartial({ 'u6l2-equiv': 'n', 'u6l2-dims': 's', 'u6l2-half': 'b', 'u6l2-trin': 'n' });
  var OUT = 'AN4';
  var lin = U.lin, pt = U.pt, pta = U.pta, rt = U.rt, R = U.R, nz = U.nz, gcd = U.gcd, pickWhere = U.pickWhere, sg = U.sg, par = U.par, nvT = U.npvTex, qd = U.qd;
  function M(c, v) { return P.mono(c, v || {}); }
  function X(v, e) { var o = {}; o[v || 'x'] = e == null ? 1 : e; return o; }
  function dq(n, d) { return d === '1' ? n : '\\dfrac{' + n + '}{' + d + '}'; }
  function sq(v) { return P.mono(1, X(v, 2)); }
  function excl(o, list) { return !list.some(function (e) { return Object.keys(e).every(function (k) { return o[k] === e[k]; }); }); }
  function mk(v, vals) { var o = {}; o[v] = vals; return o; }
  function ym(m, w) { return (m === 1 ? '' : m === -1 ? '-' : String(m)) + (w || 'y'); }
  function ymF(p, q, w) { var r = ex.norm(p, q); if (r[1] === 1) return ym(r[0], w); return (r[0] < 0 ? '-' : '') + '\\frac{' + (Math.abs(r[0]) === 1 ? '' : Math.abs(r[0])) + (w || 'y') + '}{' + r[1] + '}'; }
  function ftex(list) { var s = HW.factor.tex(list); var m = /^\(([^()]*)\)$/.exec(s); return m ? m[1] : s; }
  function prod(list) { return HW.factor.product(list); }
  var HS = ['Factor the numerator and the denominator fully. State the NPVs from the <b>original</b> denominator, then divide out the common factors.'];
  var HOPP = [t('b-a=-(a-b)') + ': factor ' + t('-1') + ' out of one of the opposite factors, then divide out.'];
  /* "Simplify. State the NPVs." from factor lists; show = the expression as printed; fN, fD = factored forms for the solution */
  function simp(show, num, den, o) {
    o = o || {};
    var rd = U.reduce(num, den), v = o.v || U.vars(rd.D)[0] || 'x', npv = o.npv || U.npvOf(rd.D, v);
    var fN = o.fN || ftex(num), fD = o.fD || ftex(den);
    var sol = o.sol || (t(dq(fN, fD)) + '; NPVs: ' + t(nvT(npv)) + '<br>' + t('=' + rd.tex) + ', ' + t(nvT(npv)));
    var dl = (o.dl || []).map(function (w) { var q = U.reduce(w.num, w.den); return { N: q.T.N, D: q.T.D, tex: q.tex, code: w.code, hint: w.hint }; });
    return U.simpPart(o.prompt || t(show), { cp: CP, N: rd.N, D: rd.D, T: rd.T, key: o.key || rd.tex, v: v, vars: o.vars, npv: npv, dl: dl, nw: o.nw, sol: sol, hints: o.hints || HS, text: o.text || 'simplify' });
  }
  function ratP(prompt, num, den, o) {
    o = o || {}; var rd = U.reduce(num, den);
    var dl = (o.dl || []).map(function (w) { var q = U.reduce(w.num, w.den); return { N: q.T.N, D: q.T.D, tex: q.tex, code: w.code, hint: w.hint }; });
    return U.ratPart(prompt, { cp: CP, T: rd.T, key: o.key || rd.tex, vars: o.vars, dl: dl, sol: o.sol, hints: o.hints || HS, text: o.text, before: o.before, after: o.after, good: o.good, avoid: o.avoid });
  }

  /* ---------- generators shared by the assignment and the extra practice ---------- */
  function g_mono(r, ex1) { // c1 x^m / (c2 x^n)
    var o = pickWhere(function () { return { g: r.int(2, 7), a: r.int(1, 5), b: r.int(1, 5), m: r.int(1, 6), n: r.int(1, 6), s: r.chance(0.3) ? -1 : 1, v: U.pickVar(r, ['x', 'x', 'a', 'm', 't', 'y']) }; }, function (z) {
      return gcd(z.a, z.b) === 1 && z.m !== z.n && !(z.a === 1 && z.b === 1) && excl(z, [{ g: 7, a: 3, b: 2, m: 4, n: 1 }, { g: 6, a: 3, b: 4, m: 5, n: 2 }].concat(ex1 || []));
    });
    var v = o.v, c1 = o.s * o.g * o.a, c2 = o.g * o.b, num = [M(c1, X(v, o.m))], den = [M(c2, X(v, o.n))], d = Math.abs(o.m - o.n);
    var wrongPow = o.m > o.n ? { num: [o.s * o.a], den: [M(o.b, X(v, d))] } : { num: [M(o.s * o.a, X(v, d))], den: [o.b] };
    return simp(dq(c1 + v + '^{' + o.m + '}', c2 + v + (o.n > 1 ? '^{' + o.n + '}' : '')), num, den, { v: v, text: 'simplify monomials',
      dl: [{ num: wrongPow.num, den: wrongPow.den, code: CP + 'mono-exp', hint: t(dq(v + '^{' + o.m + '}', v + '^{' + o.n + '}')) + ': subtract the exponents. The power that is left stays where the larger power was.' }, { num: [M(o.s * o.b, o.m > o.n ? X(v, d) : {})], den: [M(o.a, o.m > o.n ? {} : X(v, d))], code: CP + 'mono-coef', hint: 'Divide the coefficients: ' + t(dq(Math.abs(c1), c2) + '=' + dq(o.a, o.b)) + '.' }],
      sol: 'NPV: ' + t(v + '\\ne 0') + '<br>' + t(dq(c1 + v + '^{' + o.m + '}', c2 + v + (o.n > 1 ? '^{' + o.n + '}' : '')) + '=' + U.reduce(num, den).tex) + ', ' + t(v + '\\ne 0'), hints: ['Divide the coefficients by their GCF and subtract the exponents: ' + t('\\frac{x^{5}}{x^{2}}=x^{3}') + '.'] });
  }
  function g_mono2(r, ex1) { // c1 m^a n^b / (c2 m^c n^d), two letters
    var Lp = r.pick([['m', 'n'], ['a', 'b'], ['x', 'y'], ['p', 'q']]), u = Lp[0], w = Lp[1];
    var o = pickWhere(function () { return { g: r.int(2, 6), a: r.int(1, 5), b: r.int(2, 5), e1: r.int(2, 4), e2: r.int(1, 3), e3: r.int(1, 2), e4: r.int(2, 6), s: r.pick([1, -1, -1]) }; }, function (z) {
      return gcd(z.a, z.b) === 1 && z.e1 > z.e3 && z.e4 > z.e2 && excl(z, [{ g: 4, a: 2, b: 3, e1: 3, e2: 2, e3: 1, e4: 5 }, { g: 5, a: 2, b: 7 }, { g: 5, a: 3, b: 5, e1: 3, e2: 1, e3: 1, e4: 4 }].concat(ex1 || []));
    });
    var c1 = o.s * o.g * o.a, c2 = o.g * o.b, mN = {}, mD = {}; mN[u] = o.e1; mN[w] = o.e2; mD[u] = o.e3; mD[w] = o.e4;
    var num = [M(c1, mN)], den = [M(c2, mD)], npv = {}; npv[u] = [0]; npv[w] = [0];
    var rd = U.reduce(num, den);
    return simp(dq(pt(num[0]), pt(den[0])), num, den, { v: u, npv: npv, vars: [u, w], text: 'simplify monomials, two letters',
      nw: [{ vals: mk(u, [0]), code: CP + 'npv-missing', hint: 'Both letters are in the denominator: ' + t(w + '\\ne 0') + ' too.' }],
      dl: [{ num: [M(o.s * o.a, (function () { var z = {}; z[u] = o.e1 - o.e3; z[w] = o.e4 - o.e2; return z; })())], den: [o.b], code: CP + 'mono-exp', hint: 'The larger power of ' + t(w) + ' is in the denominator, so what is left of it stays in the denominator.' }],
      sol: 'NPVs: ' + t(u + '\\ne 0,\\ ' + w + '\\ne 0') + '<br>' + t(dq(pt(num[0]), pt(den[0])) + '=' + rd.tex) + ', ' + t(u + '\\ne 0,\\ ' + w + '\\ne 0'), hints: ['Divide the coefficients and subtract the exponents of each letter. Each letter in the denominator gives an NPV.'] });
  }
  function g_binpow(r, flip, ex1) { // k1(v+a) / (k2(v+a)^2)  or  k1(v+a)^2/(k2(v+a))
    var o = pickWhere(function () { return { g: r.int(2, 6), p: r.int(1, 5), q: r.int(1, 5), a: nz(r, 1, 9), v: U.pickVar(r, ['a', 'x', 'm', 't']) }; }, function (z) { return gcd(z.p, z.q) === 1 && !(z.p === 1 && z.q === 1) && excl(z, [{ g: 2, p: 2, q: 5, a: 1 }, { g: 7, p: 1, q: 3, a: -1 }, { g: 3, p: 2, q: 3, a: -2 }].concat(ex1 || [])); });
    var f = lin(1, o.a, o.v), k1 = o.g * o.p, k2 = o.g * o.q;
    var num = flip ? [k1, { p: f, k: 2 }] : [k1, f], den = flip ? [k2, f] : [k2, { p: f, k: 2 }];
    var show = dq(k1 + '(' + pt(f) + ')' + (flip ? '^{2}' : ''), k2 + '(' + pt(f) + ')' + (flip ? '' : '^{2}'));
    return simp(show, num, den, { v: o.v, text: 'simplify a binomial factor', fN: show, fD: '' , sol: 'NPV: ' + t(nvT(mk(o.v, [-o.a]))) + '<br>' + t(show + '=' + U.reduce(num, den).tex) + ', ' + t(nvT(mk(o.v, [-o.a]))) });
  }
  function g_trifac(r, ex1) { // (v − p)(v + q) / (k(v + q)(v − s))
    var o = pickWhere(function () { return { p: nz(r, 1, 9), q: nz(r, 1, 9), s: nz(r, 1, 9), k: r.int(2, 6), v: U.pickVar(r, ['y', 'x', 'n', 'a']) }; }, function (z) { return z.p !== z.s && z.q !== -z.s && z.q !== -z.p && excl(z, [{ p: 6, q: 2, s: 1, k: 3 }, { p: 2, q: -1, s: -1 }].concat(ex1 || [])); });
    var f1 = lin(1, -o.p, o.v), f2 = lin(1, o.q, o.v), f3 = lin(1, -o.s, o.v);
    var show = dq('(' + pt(f1) + ')(' + pt(f2) + ')', o.k + '(' + pt(f2) + ')(' + pt(f3) + ')');
    return simp(show, [f1, f2], [o.k, f2, f3], { v: o.v, text: 'simplify factored', fN: '(' + pt(f1) + ')(' + pt(f2) + ')', fD: o.k + '(' + pt(f2) + ')(' + pt(f3) + ')' });
  }
  function g_gcfnum(r, ex1) { // (c x + c d)/k
    var o = pickWhere(function () { return { g: r.int(2, 5), a: r.int(1, 5), b: r.int(2, 5), d: nz(r, 1, 9) }; }, function (z) { return gcd(z.a, z.b) === 1 && excl(z, [{ g: 3, a: 2, b: 3, d: 3 }].concat(ex1 || [])); });
    var c = o.g * o.a, k = o.g * o.b, f = lin(1, o.d), N = P.mul(c, f);
    return simp(dq(pt(N), k), [c, f], [k], { text: 'simplify: common factor over a number', nw: [{ vals: { x: [-o.d] }, code: CP + 'npv-num', hint: 'The denominator ' + t(k) + ' is never ' + t(0) + ': no NPVs. (A numerator of ' + t(0) + ' is fine.)' }],
      dl: [{ num: [lin(o.a, c * o.d)], den: [o.b], code: CP + 'terms', hint: 'Factor the numerator first: ' + t(pt(N) + '=' + c + '(' + pt(f) + ')') + '. A number divides out of the whole numerator, not one term.' }],
      sol: t(dq(c + '(' + pt(f) + ')', k) + '=' + U.reduce([c, f], [k]).tex) + '; the denominator is a number, so there are no NPVs.' });
  }
  function g_overmono(r, ex1, v0) { // (c v − c r)/(v² − r v)  → c/v
    var o = pickWhere(function () { return { c: r.int(2, 9), rr: nz(r, 1, 9), v: v0 || U.pickVar(r, ['a', 'x', 'p', 'k']) }; }, function (z) { return excl(z, [{ c: 5, rr: 4 }].concat(ex1 || [])); });
    var f = lin(1, -o.rr, o.v), N = P.mul(o.c, f), D = P.mul(M(1, X(o.v)), f);
    return simp(dq(pt(N), pt(D)), [o.c, f], [M(1, X(o.v)), f], { v: o.v, text: 'simplify: GCF over GCF', fN: o.c + '(' + pt(f) + ')', fD: o.v + '(' + pt(f) + ')' });
  }
  function g_dosoverlin(r, ex1, flip) { // (x² − s²)/(k x + k s) → (x − s)/k ; flip: (k x − k s)/(x² − s²) style: (x² − s²)/(k(x − s))
    var o = pickWhere(function () { return { s: r.int(2, 9), k: r.int(2, 7), sgn: r.pick([1, -1]) }; }, function (z) { return excl(z, [{ s: 7, k: 3, sgn: 1 }, { s: 4, k: 5, sgn: -1 }, { s: 5, k: 4 }].concat(ex1 || [])); });
    var a = lin(1, -o.s), b = lin(1, o.s), keep = o.sgn > 0 ? b : a, N = P.mul(a, b), D = P.mul(o.k, keep);
    if (flip) return simp(dq(pt(D), pt(N)), [o.k, keep], [a, b], { text: 'simplify: linear over difference of squares', fN: o.k + '(' + pt(keep) + ')', fD: '(' + pt(a) + ')(' + pt(b) + ')' });
    return simp(dq(pt(N), pt(D)), [a, b], [o.k, keep], { text: 'simplify: difference of squares over linear', fN: '(' + pt(a) + ')(' + pt(b) + ')', fD: o.k + '(' + pt(keep) + ')' });
  }
  function g_gcfmono(r, ex1) { // (g a t² + g b t)/(g t) → a t + b ; or (12x − 8)/(4x) → (3x − 2)/x
    var o = pickWhere(function () { return { g: r.int(2, 6), a: r.int(1, 5), b: nz(r, 1, 7), v: U.pickVar(r, ['t', 'x', 'm', 'n']), deg: r.chance(0.5) ? 1 : 0 }; }, function (z) { return gcd(z.a, z.b) === 1 && excl(z, [{ g: 4, a: 2, b: 3 }, { g: 4, a: 3, b: -2 }].concat(ex1 || [])); });
    var f = lin(o.a, o.b, o.v), num = [M(o.g, o.deg ? X(o.v) : {}), f], den = [M(o.g, X(o.v))], N = prod(num), D = prod(den);
    return simp(dq(pt(N), pt(D)), num, den, { v: o.v, text: 'simplify: common factor over a monomial', fN: (o.deg ? o.g + o.v : o.g) + '(' + pt(f) + ')', fD: o.g + o.v,
      dl: o.deg ? [{ num: [lin(o.a, o.g * o.b, o.v)], den: [1], code: CP + 'terms', hint: 'Factor the numerator first: ' + t(o.g + o.v) + ' must divide out of <b>both</b> terms.' }] : [] });
  }
  /* a trinomial-over-trinomial pair sharing one factor; kinds: 'mm' monic/monic, 'dos' over/under a difference of squares, 'sq' perfect square, 'ac' a≠1 */
  function g_tri(r, kind, ex1) {
    var v = U.pickVar(r, ['x', 'x', 'm', 'y', 'a']), o, num, den;
    if (kind === 'mm') {
      o = pickWhere(function () { return { p: nz(r, 1, 9), q: nz(r, 1, 9), s: nz(r, 1, 9) }; }, function (z) { return z.p !== z.s && z.p !== z.q && z.q !== z.s && excl(z, [{ p: 3, q: 5, s: -3 }, { p: 6, q: -4, s: -3 }, { p: -5, q: 4, s: 5 }].concat(ex1 || [])); });
      num = [lin(1, o.p, v), lin(1, o.q, v)]; den = [lin(1, o.q, v), lin(1, o.s, v)];
    } else if (kind === 'dos') {
      o = pickWhere(function () { return { s: r.int(2, 9), q: nz(r, 1, 9), up: r.chance(0.5) }; }, function (z) { return Math.abs(z.q) !== z.s && excl(z, [{ s: 6, q: 3 }, { s: 3, q: 3 }].concat(ex1 || [])); });
      num = [lin(1, -o.s, v), lin(1, o.s, v)]; den = [lin(1, -o.s, v), lin(1, o.q, v)];
      if (o.up) { var tmp = num; num = den; den = tmp; }
    } else if (kind === 'sq') {
      o = pickWhere(function () { return { s: nz(r, 2, 9), up: r.chance(0.5) }; }, function (z) { return excl(z, [{ s: -5 }, { s: 3 }].concat(ex1 || [])); });
      num = [{ p: lin(1, -o.s, v), k: 2 }]; den = [lin(1, -o.s, v), lin(1, o.s, v)];
      if (o.up) { var tm2 = num; num = den; den = tm2; }
    } else if (kind === 'acdos') { // (a y + b)(y − s) / ((y − s)(y + s))
      o = pickWhere(function () { return { a: r.int(2, 5), b: nz(r, 1, 7), s: r.int(2, 9) }; }, function (z) { return gcd(z.a, z.b) === 1 && excl(z, [{ a: 2, b: 1, s: 3 }].concat(ex1 || [])); });
      num = [lin(o.a, o.b, v), lin(1, -o.s, v)]; den = [lin(1, -o.s, v), lin(1, o.s, v)];
    } else if (kind === 'acac') { // (p x + q)(x + r) / ((p x + q)(u x + w))
      o = pickWhere(function () { return { p: r.int(2, 5), q: nz(r, 1, 6), rr: nz(r, 1, 6), u: r.int(2, 5), w: nz(r, 1, 6) }; }, function (z) { return gcd(z.p, z.q) === 1 && gcd(z.u, z.w) === 1 && (z.p !== z.u || z.q !== z.w) && excl(z, [{ p: 3, q: -1, rr: 2, u: 2, w: -1 }].concat(ex1 || [])); });
      num = [lin(o.p, o.q, v), lin(1, o.rr, v)]; den = [lin(o.p, o.q, v), lin(o.u, o.w, v)];
    } else if (kind === 'dosac') { // (2a − 1)(2a + 1)/((2a − 1)(a + 5))
      o = pickWhere(function () { return { p: r.int(2, 5), q: r.int(1, 5), s: nz(r, 1, 7), up: r.chance(0.3) }; }, function (z) { return gcd(z.p, z.q) === 1 && excl(z, [{ p: 2, q: 1, s: 5 }, { p: 3, q: 1, s: 4 }].concat(ex1 || [])); });
      num = [lin(o.p, -o.q, v), lin(o.p, o.q, v)]; den = [lin(o.p, -o.q, v), lin(1, o.s, v)];
      if (o.up) { var tm3 = num; num = den; den = tm3; }
    }
    var rd = U.reduce(num, den);
    return simp(dq(pt(rd.N), pt(rd.D)), num, den, { v: v, text: 'simplify trinomials: ' + kind,
      dl: [{ num: [P.add(rd.N, P.neg(M(P.coef(rd.N, X(v, 2)), X(v, 2))))], den: [P.add(rd.D, P.neg(M(P.coef(rd.D, X(v, 2)), X(v, 2))))], code: CP + 'terms', hint: 'The ' + t(v + '^{2}') + ' terms are terms, not factors, so they cannot be divided out. Factor first.' }] });
  }

  /* opposite-binomial generators */
  function g_opp1(r, ex1) { // (s − y)/(y − s)
    var o = pickWhere(function () { return { s: nz(r, 1, 12), v: U.pickVar(r, ['y', 'x', 'a', 'm']), up: r.chance(0.5) }; }, function (z) { return excl(z, [{ s: 3 }, { s: 7 }, { s: 5 }].concat(ex1 || [])); });
    var a = lin(-1, o.s, o.v), b = lin(1, -o.s, o.v), num = o.up ? [b] : [a], den = o.up ? [a] : [b];
    return simp(dq(o.up ? pt(b) : pta(a), o.up ? pta(a) : pt(b)), num, den, { v: o.v, text: 'opposites: −1', hints: HOPP,
      dl: [{ num: [1], den: [1], code: CP + 'opp', hint: 'They are <b>opposites</b>, not the same: ' + t(pta(a) + '=-(' + pt(b) + ')') + ', so the quotient is ' + t('-1') + '.' }],
      sol: t(dq(o.up ? pt(b) : '-(' + pt(b) + ')', o.up ? '-(' + pt(b) + ')' : pt(b)) + '=-1') + ', ' + t(nvT(mk(o.v, [o.s]))) });
  }
  function g_opp2(r, ex1) { // (k x − k s)/(s − x) → −k
    var o = pickWhere(function () { return { k: r.int(2, 9), s: nz(r, 1, 9) }; }, function (z) { return excl(z, [{ k: 4, s: 3 }].concat(ex1 || [])); });
    var f = lin(1, -o.s), g2 = lin(-1, o.s), N = P.mul(o.k, f);
    return simp(dq(pt(N), pta(g2)), [o.k, f], [g2], { text: 'opposites: a number', hints: HOPP,
      dl: [{ num: [o.k], den: [1], code: CP + 'opp', hint: t(pta(g2) + '=-(' + pt(f) + ')') + ': the quotient is negative.' }],
      sol: t(dq(o.k + '(' + pt(f) + ')', '-(' + pt(f) + ')') + '=' + (-o.k)) + ', ' + t(nvT({ x: [o.s] })) });
  }
  function g_opp3(r, ex1) { // (s² − a²)/((a − s)(a + q)) → −(a + s)/(a + q)
    var o = pickWhere(function () { return { s: r.int(2, 9), q: nz(r, 1, 9), v: U.pickVar(r, ['a', 'x', 'y']), up: r.chance(0.25) }; }, function (z) { return Math.abs(z.q) !== z.s && excl(z, [{ s: 5, q: 2 }, { s: 3, q: 4 }, { s: 4, q: 5 }].concat(ex1 || [])); });
    var v = o.v, A = lin(-1, o.s, v), Bb = lin(1, o.s, v), C = lin(1, -o.s, v), D2 = lin(1, o.q, v), N = P.mul(A, Bb), Dd = P.mul(C, D2);
    var num = [A, Bb], den = [C, D2];
    if (o.up) { num = [C, D2]; den = [A, Bb]; }
    var rd = U.reduce(num, den);
    var show = o.up ? dq(pt(Dd), pta(N)) : dq(pta(N), pt(Dd));
    var fA = '(' + pta(A) + ')(' + pta(Bb) + ')', fC = '(' + pt(C) + ')(' + pt(D2) + ')';
    return simp(show, num, den, { v: v, text: 'opposites: difference of squares', hints: HOPP,
      dl: [{ num: o.up ? [D2] : [Bb], den: o.up ? [Bb] : [D2], code: CP + 'opp', hint: t(pta(A) + '=-(' + pt(C) + ')') + ': you lost the ' + t('-1') + '.' }],
      sol: t(dq(o.up ? fC : fA, o.up ? fA : fC) + '=' + dq(o.up ? fC : '-(' + pt(C) + ')(' + pt(Bb) + ')', o.up ? '-(' + pt(C) + ')(' + pt(Bb) + ')' : fC)) + '; NPVs ' + t(nvT(U.npvOf(rd.D, v))) + '<br>' + t('=' + rd.tex) + ', ' + t(nvT(U.npvOf(rd.D, v))) });
  }
  function g_opp4(r, ex1) { // (c − b x − x²)/(x + s)²  → −(x − p)/(x + s)
    var o = pickWhere(function () { return { s: nz(r, 1, 7), p: nz(r, 1, 7), alt: r.chance(0.5) }; }, function (z) { return z.p !== -z.s && excl(z, [{ s: 3, p: 2 }].concat(ex1 || [])); });
    var f1 = lin(1, o.s), f2 = lin(1, -o.p), N = P.neg(P.mul(f1, f2));
    var num = [-1, f1, f2], den = o.alt ? [f1, lin(1, o.s + (o.s > 0 ? 1 : -1))] : [{ p: f1, k: 2 }];
    if (o.alt && (o.s + (o.s > 0 ? 1 : -1)) === -o.p) den = [{ p: f1, k: 2 }];
    var rd = U.reduce(num, den);
    return simp(dq(pta(N), pt(rd.D)), num, den, { text: 'opposites: negative x² term', hints: ['Factor ' + t('-1') + ' out of the numerator first: ' + t(pta(N) + '=-(' + pt(P.neg(N)) + ')') + '.'],
      dl: [{ num: [f2], den: den.slice(1).length ? [den[1]] : [f1], code: CP + 'opp', hint: 'The numerator is ' + t('-(' + pt(P.neg(N)) + ')') + ': keep the ' + t('-1') + '.' }],
      sol: t(dq('-(' + pt(P.neg(N)) + ')', ftex(den)) + '=' + dq('-(' + pt(f1) + ')(' + pt(f2) + ')', ftex(den))) + '; NPVs ' + t(nvT(U.npvOf(rd.D, 'x'))) + '<br>' + t('=' + rd.tex) + ', ' + t(nvT(U.npvOf(rd.D, 'x'))) });
  }
  function g_opp5(r, ex1) { // (p x + q)(x + rr) / (−(p x + q)(x + w))
    var o = pickWhere(function () { return { p: r.int(2, 4), q: nz(r, 1, 7), rr: nz(r, 1, 7), w: nz(r, 1, 7) }; }, function (z) { return gcd(z.p, z.q) === 1 && z.rr !== z.w && excl(z, [{ p: 2, q: -3, rr: -2, w: 4 }].concat(ex1 || [])); });
    var a = lin(o.p, o.q), b = lin(1, o.rr), c = lin(1, o.w), N = P.mul(a, b), D = P.neg(P.mul(a, c));
    var rd = U.reduce([a, b], [-1, a, c]);
    return simp(dq(pt(N), pta(D)), [a, b], [-1, a, c], { text: 'opposites: a ≠ 1', hints: ['Factor ' + t('-1') + ' out of the denominator first: ' + t(pta(D) + '=-(' + pt(P.neg(D)) + ')') + '.'],
      dl: [{ num: [b], den: [c], code: CP + 'opp', hint: 'The denominator is ' + t('-(' + pt(P.neg(D)) + ')') + ': keep the ' + t('-1') + '.' }],
      sol: t(dq('(' + pt(a) + ')(' + pt(b) + ')', '-(' + pt(a) + ')(' + pt(c) + ')')) + '; NPVs ' + t(nvT(U.npvOf(rd.D, 'x'))) + '<br>' + t('=' + rd.tex) + ', ' + t(nvT(U.npvOf(rd.D, 'x'))) });
  }
  function g_opp6(r, inv, ex1) { // (a − k b)²/(k²b² − a²)   or (inv) (a² − k²b²)/(kb − a)²
    var Lp = r.pick([['a', 'b'], ['m', 'n'], ['x', 'y'], ['p', 'q']]), u = Lp[0], w = Lp[1];
    var o = pickWhere(function () { return { k: r.int(1, 4) }; }, function (z) { return excl(z, ex1 || []); });
    var A = P.add(P.v(u), P.mono(-o.k, X(w))), Bp = P.add(P.v(u), P.mono(o.k, X(w))), C = P.add(P.mono(o.k, X(w)), P.mono(-1, X(u)));
    var num, den, show, npv = {};
    if (!inv) { num = [{ p: A, k: 2 }]; den = [C, Bp]; show = dq('(' + pt(A) + ')^{2}', pta(P.mul(C, Bp))); npv[u] = [ym(o.k, w), ym(-o.k, w)]; }
    else { num = [A, Bp]; den = [{ p: C, k: 2 }]; show = dq(pt(P.mul(A, Bp)), '(' + pta(C) + ')^{2}'); npv[u] = [ym(o.k, w)]; }
    var rd = U.reduce(num, den);
    return simp(show, num, den, { v: u, vars: [u, w], npv: npv, text: 'opposites: two letters', hints: [t('(' + pta(C) + ')^{2}=(' + pt(A) + ')^{2}') + ' (a square of opposites is the same), and ' + t(pta(C) + '=-(' + pt(A) + ')') + '.'],
      nw: [{ vals: mk(u, inv ? [o.k] : [o.k, -o.k]), code: CP + 'npv-noy', hint: 'Keep the ' + t(w) + ': the NPVs are in terms of ' + t(w) + '.' }].concat(inv ? [] : [{ vals: mk(u, [ym(o.k, w)]), code: CP + 'npv-cancel', hint: 'The NPVs come from the original denominator ' + t('(' + pta(C) + ')(' + pt(Bp) + ')') + ': two of them.' }]),
      sol: (inv ? t('(' + pta(C) + ')^{2}=(' + pt(A) + ')^{2}') + ', so ' + t(dq('(' + pt(A) + ')(' + pt(Bp) + ')', '(' + pt(A) + ')^{2}')) : t(pta(P.mul(C, Bp)) + '=(' + pta(C) + ')(' + pt(Bp) + ')=-(' + pt(A) + ')(' + pt(Bp) + ')') + ', so ' + t(dq('(' + pt(A) + ')^{2}', '-(' + pt(A) + ')(' + pt(Bp) + ')'))) + '<br>' + t('=' + rd.tex) + ', ' + t(nvT(npv)) });
  }
  /* two variables, x in terms of y */
  function g_y(r, kind, ex1) {
    var o, num, den, show, npv, nw = [], hints = ['Factor as with one variable, treating ' + t('y') + ' like a number. State the NPVs for ' + t('x') + ' in terms of ' + t('y') + '.'];
    function L(a, b) { return P.add(P.mono(a, { x: 1 }), P.mono(b, { y: 1 })); }
    if (kind === 'gcf') { // (k x + k m y)/(x² − m² y²)
      o = pickWhere(function () { return { k: r.int(2, 9), m: r.int(1, 5), s: r.pick([1, -1]) }; }, function (z) { return excl(z, [{ k: 3, m: 1, s: 1 }].concat(ex1 || [])); });
      num = [o.k, L(1, o.s * o.m)]; den = [L(1, -o.m), L(1, o.m)]; show = dq(pt(prod(num)), pt(prod(den))); npv = { x: [ym(o.m), ym(-o.m)] };
    } else if (kind === 'sq') { // (x + m y)²/(x² − m² y²)
      o = pickWhere(function () { return { m: r.int(1, 6), s: r.pick([1, -1]) }; }, function (z) { return excl(z, [{ m: 2, s: 1 }].concat(ex1 || [])); });
      num = [{ p: L(1, o.s * o.m), k: 2 }]; den = [L(1, -o.m), L(1, o.m)]; show = dq(pt(prod(num)), pt(prod(den))); npv = { x: [ym(o.m), ym(-o.m)] };
      nw = [{ vals: { x: [ym(o.s * o.m)] }, code: CP + 'npv-cancel', hint: 'The NPVs come from the original denominator: both factors of ' + t(pt(prod(den))) + '.' }];
    } else if (kind === 'opp') { // (k y − k m x)/(m² x² − y²) → −k/(m x + y)
      o = pickWhere(function () { return { k: r.int(2, 7), m: r.int(2, 5) }; }, function (z) { return excl(z, [{ k: 2, m: 3 }, { k: 3, m: 2 }].concat(ex1 || [])); });
      num = [o.k, L(-o.m, 1)]; den = [L(o.m, -1), L(o.m, 1)]; show = dq(pta(prod(num)), pt(prod(den))); npv = { x: [ymF(1, o.m), ymF(-1, o.m)] };
      nw = [{ vals: { x: [ym(o.m), ym(-o.m)] }, code: 'flip', hint: 'Solve ' + t(o.m + 'x-y=0') + ' for ' + t('x') + ': ' + t('x=\\frac{y}{' + o.m + '}') + '.' }];
      hints = HOPP.concat(hints);
    } else if (kind === 'oppmono') { // (x − p y)(x + q y)/(p y² − x y) → −(x + q y)/y ; NPVs x ≠ p y, y ≠ 0
      o = pickWhere(function () { return { p: r.int(2, 6), q: nz(r, 1, 6) }; }, function (z) { return z.q !== -z.p && excl(z, [{ p: 5, q: 2 }].concat(ex1 || [])); });
      num = [L(1, -o.p), L(1, o.q)]; den = [M(1, { y: 1 }), L(-1, o.p)]; show = dq(pt(prod(num)), pta(prod(den))); npv = { x: [ym(o.p)], y: [0] };
      nw = [{ vals: { x: [ym(o.p)] }, code: CP + 'npv-missing', hint: 'The factor ' + t('y') + ' of the denominator gives an NPV too: ' + t('y\\ne 0') + '.' }];
      hints = HOPP.concat(hints);
    } else if (kind === 'mono') { // (x² − m² y²)/(x² + m x y) → (x − m y)/x ; NPVs x ≠ 0, −m y
      o = pickWhere(function () { return { m: r.int(2, 6) }; }, function (z) { return excl(z, [{ m: 4 }].concat(ex1 || [])); });
      num = [L(1, -o.m), L(1, o.m)]; den = [M(1, { x: 1 }), L(1, o.m)]; show = dq(pt(prod(num)), pt(prod(den))); npv = { x: [0, ym(-o.m)] };
    } else { // (k x − k m y... ) opp2: (2k x − k y)/(y² − 4x²) → −k/(y + 2x)
      o = pickWhere(function () { return { k: r.int(2, 7), m: r.int(2, 4) }; }, function (z) { return excl(z, [{ k: 3, m: 2 }].concat(ex1 || [])); });
      num = [o.k, L(o.m, -1)]; den = [L(-o.m, 1), L(o.m, 1)]; show = dq(pt(prod(num)), pta(prod(den))); npv = { x: [ymF(1, o.m), ymF(-1, o.m)] };
      hints = HOPP.concat(hints);
    }
    nw.push({ vals: { x: (npv.x || []).map(function (s) { var a = ex.parse(s).ast; return ex.value(a, { y: 1 }); }).map(function (x) { return Math.round(x * 1000) / 1000 === Math.round(x) ? Math.round(x) : x; }) }, code: CP + 'npv-noy', hint: 'Keep the ' + t('y') + ': the NPVs of ' + t('x') + ' are in terms of ' + t('y') + '.' });
    var rd = U.reduce(num, den);
    return simp(show, num, den, { v: 'x', vars: ['x', 'y'], npv: npv, nw: nw, text: 'two variables: ' + kind, hints: hints,
      sol: t(dq(ftex(num), ftex(den))) + '; NPVs ' + t(nvT(npv)) + '<br>' + t('=' + rd.tex) + ', ' + t(nvT(npv)) });
  }

  /* is it equivalent to (v + p)/(v − q)? kinds: 'mono' v(v+p)/(v(v−q)), 'neg' (−v−p)/(q−v), 'opp' (v+p)/(q−v), 'sq' (v+p)(v−q)/(v−q)², 'terms' (v²+p)/(v²−q) */
  function equivMC(r, o, kind) {
    var v = o.v, Nt = lin(1, o.p, v), Dt = lin(1, -o.q, v), tgt = dq(pt(Nt), pt(Dt)), show, right;
    if (kind === 'mono') { show = dq(pt(P.mul(P.v(v), Nt)), pt(P.mul(P.v(v), Dt))); right = 'yes'; }
    else if (kind === 'neg') { show = dq(pt(P.neg(Nt)), pta(P.neg(Dt))); right = 'yes'; }
    else if (kind === 'opp') { show = dq(pt(Nt), pta(P.neg(Dt))); right = 'opp'; }
    else if (kind === 'sq') { show = dq(pt(P.mul(Nt, Dt)), '(' + pt(Dt) + ')^{2}'); right = 'yes'; }
    else { show = dq(v + '^{2}' + sg(o.p), v + '^{2}' + sg(-o.q)); right = 'no'; }
    var sols = { mono: t(dq(v + '(' + pt(Nt) + ')', v + '(' + pt(Dt) + ')')) + ': yes, for ' + t(nvT(mk(v, [0, o.q]))) + '.', neg: t(dq('-(' + pt(Nt) + ')', '-(' + pt(Dt) + ')')) + ': yes, for ' + t(v + '\\ne ' + o.q) + '.',
      opp: 'No: only the denominator is the opposite, so it equals ' + t('-' + tgt) + '.', sq: t(dq('(' + pt(Nt) + ')(' + pt(Dt) + ')', '(' + pt(Dt) + ')^{2}')) + ': yes, for ' + t(v + '\\ne ' + o.q) + '.',
      terms: 'No: ' + t(v + '^{2}') + ' is a term, not a factor, so nothing divides out. (Try ' + t(v + '=' + o.t0) + '.)' };
    return U.mc(r, 'Is ' + t(show) + ' equivalent to ' + t(tgt) + ' (for its permissible values)?', [
      { html: 'Yes: it simplifies to ' + t(tgt), right: right === 'yes', why: right === 'opp' ? 'Factor ' + t('-1') + ' out of the denominator: is the numerator also the opposite?' : 'Factor it. Can anything divide out?' },
      { html: 'No: it simplifies to the opposite, ' + t('-' + tgt), right: right === 'opp', why: 'Factor ' + t('-1') + ' out of each opposite factor and see what is left.' },
      { html: 'No: it has different NPVs, so it cannot be equivalent', right: false, why: 'Equivalent means equal for every permissible value. Extra NPVs are fine: it can still be equivalent where both are defined.' },
      { html: 'No: it does not simplify to ' + t(tgt) + ' at all', right: right === 'no', why: 'Factor the numerator and the denominator fully, then divide out common factors.' }],
      sols[kind], ['Simplify it (factor, divide out common factors, watch for opposites) and compare.'], 'equivalent? ' + kind, true);
  }

  /* a trinomial over a trinomial: equal to T for every x but x = s, with NPVs exactly npv */
  function trinCheck(T, npvRoots, s) {
    var base = U.ratCheck(T, { cp: CP, vars: ['x'], noForm: true });
    return function (resp) {
      var r0 = base(resp); if (r0.v !== 'correct') return r0;
      var a = K.read(resp), top = a.ast; while (top.t === 'paren') top = top.a;
      if (top.t !== 'div') return wrong(CP + 'trin', 'Write one fraction: a trinomial over a trinomial.');
      var Nr = P.read(top.a), Dr = P.read(top.b); if (!Nr.ok || !Dr.ok) return form('u6k-tidy', 'Write the numerator and the denominator as polynomials.');
      var roots = U.ratRoots(Dr.p, 'x'), want = npvRoots.map(R);
      var same = roots.length === want.length && want.every(function (w) { return roots.some(function (x) { return x[0] === w[0] && x[1] === w[1]; }); });
      if (!same) return wrong(CP + 'trin', 'Equal to the simplified form, but the NPVs are not ' + t(nvT({ x: npvRoots })) + '. Multiply the numerator and the denominator by the factor that gives the extra NPV, ' + t('(' + pt(lin(1, -s)) + ')') + '.');
      var fN = P.formIssue(top.a), fD = P.formIssue(top.b);
      if (fN || fD || P.count(Nr.p) !== 3 || P.count(Dr.p) !== 3) return form('u6k-expand', 'Right expression — now expand the numerator and the denominator, so each is a trinomial.');
      return ok();
    };
  }
  function trinPart(r, ex1) {
    var o = pickWhere(function () { return { a: r.pick([1, 1, 2, 3]), b: nz(r, 1, 6), c: nz(r, 1, 7), s: nz(r, 1, 7) }; }, function (z) { var f = lin(1, -z.s); return gcd(z.a, z.b) === 1 && z.s !== -z.c && z.s * z.a + z.b !== 0 && z.b !== z.c * z.a && P.count(P.mul(lin(z.a, z.b), f)) === 3 && P.count(P.mul(lin(1, z.c), f)) === 3 && excl(z, [{ a: 1, b: -2, c: 5, s: 1 }, { a: 2, b: 1, c: -3, s: -4 }].concat(ex1 || [])); });
    // simplified (a x + b)/(x + c), NPVs −c and s
    var Nn = lin(o.a, o.b), Dd = lin(1, o.c), f = lin(1, -o.s), N2 = P.mul(Nn, f), D2 = P.mul(Dd, f), key = dq(pt(N2), pt(D2)).replace(/\\dfrac/g, '\\frac');
    var npv = { x: [-o.c, o.s] };
    var p = B.math('Write a rational expression with a trinomial numerator and a trinomial denominator that simplifies to ' + t(dq(pt(Nn), pt(Dd))) + ' and has the NPVs ' + t(nvT(npv)) + '.', trinCheck({ N: Nn, D: Dd }, [-o.c, o.s], o.s), key,
      'Multiply the numerator and the denominator by ' + t('(' + pt(f) + ')') + ' (it gives the NPV ' + t('x=' + o.s) + '): ' + t(dq('(' + pt(Nn) + ')(' + pt(f) + ')', '(' + pt(Dd) + ')(' + pt(f) + ')') + '=' + dq(pt(N2), pt(D2))), ['Which factor gives the extra NPV? Multiply the top and the bottom by it, then expand.'], 'write trinomial over trinomial', { keys: 'u6k', vars: ['x'] });
    var fx = lin(1, o.s);
    p.bad = [dq(pt(Nn), pt(Dd)).replace(/\\dfrac/g, '\\frac'), '\\frac{' + pt(P.mul(Nn, fx)) + '}{' + pt(P.mul(Dd, fx)) + '}', '\\frac{(' + pt(Nn) + ')(' + pt(f) + ')}{(' + pt(Dd) + ')(' + pt(f) + ')}'].filter(function (b) { return b !== key; });
    p.good = ['\\frac{' + pt(P.neg(N2)) + '}{' + pt(P.neg(D2)) + '}'];
    return p;
  }
  /* a missing numerator: num/den = ?/newDen  (answer a polynomial; factored or expanded) */
  function missingNum(prompt, ans, o) {
    o = o || {};
    var T = { N: ans, D: P.num(1) };
    var p = U.ratPart(prompt, { cp: CP, T: T, key: pt(ans), vars: o.vars || ['x'], before: t('?='), dl: o.dl, sol: o.sol, hints: o.hints, text: o.text, good: o.good });
    return p;
  }
  function nrPart(prompt, x, dp, cands, sol, hints, text) {
    var p = dp == null ? B.nr(prompt, x, function (v) { for (var i = 0; i < cands.length; i++) if (cands[i][0] === v && v !== x) return { code: cands[i][1], hint: cands[i][2] }; return null; }, sol, hints, text)
      : B.approx(prompt, x, dp, { nr: true, diag: function (v) { for (var i = 0; i < cands.length; i++) if (Math.abs(K.roundTo(cands[i][0], dp) - v) < 1e-9 && Math.abs(K.roundTo(cands[i][0], dp) - K.roundTo(x, dp)) > 1e-9) return { code: cands[i][1], hint: cands[i][2] }; return null; } }, sol, hints, text);
    p.bad = cands.map(function (c) { return dp == null ? String(c[0]) : K.roundTo(c[0], dp).toFixed(dp); }).filter(function (b) { return Number(b) !== (dp == null ? x : K.roundTo(x, dp)) && b.length <= 4 && Number(b) >= 0; });
    return p;
  }
  function fxs(x) { var s = (Math.round(x * 1000) / 1000).toFixed(3).replace(/0+$/, '').replace(/\.$/, ''); return s === '-0' ? '0' : s; }

  /* ---------- Questions ---------- */
  var QUESTIONS = [
    { num: '1', stem: 'Simplify. State the non-permissible values.', parts: [
      { id: '1a', level: 'BEG', make: function (r) { return g_mono(r); } },
      { id: '1b', level: 'BEG', make: function (r) { return g_mono2(r); } },
      { id: '1c', level: 'EMG', make: function (r) { return g_binpow(r, false); } },
      { id: '1d', level: 'EMG', make: function (r) { return g_trifac(r); } }] },
    { num: '2', stem: 'Explain each error.', parts: [
      { id: '2a', level: 'EMG', make: function (r) {
        var k = r.int(2, 9), x0 = pickWhere(function () { return r.int(1, 9); }, function (x) { return x !== 5 || k !== 5; });
        var val = ex.norm(x0 + 2 * k, x0 + k);
        return U.mc(r, 'A student writes ' + t(dq('x+' + 2 * k, 'x+' + k) + '=2') + '. Which explains the error?', [
          { html: t(2 * k) + ' and ' + t(k) + ' are terms, not factors, so nothing divides out. With ' + t('x=' + x0) + ': ' + t(dq(x0 + 2 * k, x0 + k) + '=' + rt(val) + '\\ne 2') + '. It is already in simplest form.', right: true },
          { html: 'The ' + t('x') + '’s divide out, so the answer should be ' + t(dq(2 * k, k) + '=2') + ': nothing is wrong.', why: 'Try a value: with ' + t('x=' + x0) + ' the expression is ' + t(rt(val)) + ', not ' + t(2) + '.' },
          { html: 'The ' + t('x') + '’s divide out, so the answer should be ' + t(1) + '.', why: 'Only common <b>factors</b> divide out. ' + t('x') + ' is a term of each binomial, not a factor of it.' },
          { html: 'It should be ' + t('x+2') + ': divide ' + t(2 * k) + ' by ' + t(k) + ' and keep the ' + t('x') + '.', why: 'You can’t divide one term of the numerator by one term of the denominator. Try ' + t('x=' + x0) + '.' }],
          'Only factors of the whole numerator and denominator divide out. ' + t(dq('x+' + 2 * k, 'x+' + k)) + ' has no common factor: it is already in simplest form (' + t('x\\ne ' + (-k)) + '). Check with ' + t('x=' + x0) + ': ' + t(rt(val) + '\\ne 2') + '.', ['Substitute a value of ' + t('x') + ' into both sides. Do they agree?'], 'error: dividing terms');
      } },
      { id: '2b', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { c: r.int(2, 9), d: nz(r, 1, 9) }; }, function (z) { return excl(z, [{ c: 5, d: 3 }, { c: 3, d: -4 }]); });
        var N = P.mul(o.c, lin(1, -o.d));
        return ratP('A student writes ' + t(dq(pt(N), o.c) + '=' + pt(lin(1, -o.c * o.d))) + '. Give the correct simplification.', [o.c, lin(1, -o.d)], [o.c], { text: 'error: one term divided',
          dl: [{ num: [lin(1, -o.c * o.d)], den: [1], code: CP + 'terms', hint: 'That is the student’s answer: the ' + t(o.c) + ' was divided out of only one term. Factor the numerator first.' }],
          sol: 'The ' + t(o.c) + ' was divided out of only one term. ' + t(dq(o.c + '(' + pt(lin(1, -o.d)) + ')', o.c) + '=' + pt(lin(1, -o.d))) + '.', hints: ['Factor the numerator first: ' + t(o.c) + ' is a common factor of both terms.'] });
      } },
      { id: '2c', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(2, 9), q: nz(r, 1, 9), s: r.pick([1, -1]) }; }, function (z) { return Math.abs(z.q) !== z.a && excl(z, [{ a: 2, q: 3, s: -1 }]); });
        var keep = lin(1, o.s * o.a), gone = lin(1, -o.s * o.a), N = P.mul(gone, lin(1, o.q)), D = P.add(sq('x'), P.num(-o.a * o.a));
        return U.npvPart('A student writes ' + t(dq(pt(N), pt(D)) + '=' + dq(pt(lin(1, o.q)), pt(keep)) + ',\\ x\\ne ' + (-o.s * o.a)) + '. The simplification is right. Give the correct NPVs.', { cp: CP, D: D, N: N, v: 'x',
          nw: [{ vals: { x: [-o.s * o.a] }, code: CP + 'npv-cancel', hint: 'That is the student’s answer. The NPVs come from the <b>original</b> denominator ' + t(pt(D) + '=(x-' + o.a + ')(x+' + o.a + ')') + '.' }],
          sol: 'The NPVs come from the original denominator ' + t('(x-' + o.a + ')(x+' + o.a + ')') + ': ' + t('x\\ne\\pm ' + o.a) + '.', hints: ['Which denominator do the NPVs come from: the original or the simplified one?'], text: 'error: NPV lost' });
      } }] },
    { num: '3', stem: 'Simplify. State the non-permissible values.', parts: [
      { id: '3a', level: 'EMG', make: function (r) { return g_gcfnum(r); } },
      { id: '3b', level: 'PRG', make: function (r) { return g_overmono(r); } },
      { id: '3c', level: 'PRG', make: function (r) { return g_dosoverlin(r); } },
      { id: '3d', level: 'EMG', make: function (r) { var p = g_gcfmono(r); return p; } }] },
    { num: '4', stem: 'Simplify. State the non-permissible values.', parts: [
      { id: '4a', level: 'PRG', make: function (r) { return g_tri(r, 'mm'); } },
      { id: '4b', level: 'PRG', make: function (r) { return g_tri(r, 'dos'); } },
      { id: '4c', level: 'PRG', make: function (r) { return g_tri(r, 'sq'); } },
      { id: '4d', level: 'PRG', make: function (r) { return g_tri(r, 'acdos'); } },
      { id: '4e', level: 'ADV', make: function (r) { return g_tri(r, 'acac'); } },
      { id: '4f', level: 'ADV', make: function (r) { return g_tri(r, 'dosac'); } }] },
    { num: '5', stem: 'Simplify. State the non-permissible values.', parts: [
      { id: '5a', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { g1: r.int(2, 6), g2: r.int(2, 9), p: nz(r, 1, 9), q: r.int(2, 8), s: r.pick([1, -1]) }; }, function (z) { return gcd(z.g1, z.g2) > 1 && z.g1 !== z.g2 && Math.abs(z.p) !== z.q && excl(z, [{ g1: 2, g2: 4, p: 5, q: 4 }]); });
        var c = lin(1, o.s * o.q), num = [o.g1, lin(1, -o.p), c], den = [o.g2, lin(1, -o.s * o.q), c];
        return simp(dq(pt(prod(num)), pt(prod(den))), num, den, { text: 'simplify: GCFs, trinomial over difference of squares', fN: o.g1 + '(' + pt(lin(1, -o.p)) + ')(' + pt(c) + ')', fD: o.g2 + '(' + pt(lin(1, -o.s * o.q)) + ')(' + pt(c) + ')', hints: ['Take out each common factor first: ' + t(o.g1) + ' and ' + t(o.g2) + '. Then factor the brackets.'] });
      } },
      { id: '5b', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(2, 7), s: r.pick([1, -1]) }; }, function (z) { return excl(z, [{ a: 3, s: 1 }]); });
        var num = [P.v('x'), lin(1, -o.a), lin(1, o.a)], den = [P.v('x'), { p: lin(1, o.s * o.a), k: 2 }];
        return simp(dq(pt(prod(num)), pt(prod(den))), num, den, { text: 'simplify cubics', fN: 'x(' + pt(lin(1, -o.a)) + ')(' + pt(lin(1, o.a)) + ')', fD: 'x(' + pt(lin(1, o.s * o.a)) + ')^{2}', hints: ['Take out the common factor ' + t('x') + ' first. It gives an NPV.'] });
      } },
      { id: '5c', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { g: r.int(2, 4), p: r.int(2, 3), q: nz(r, 1, 7), rr: nz(r, 1, 5), k: r.int(2, 5), v: U.pickVar(r, ['y', 'x', 'm']) }; }, function (z) { return gcd(z.p, z.q) === 1 && gcd(z.k, z.p) === 1 && gcd(z.k, z.q) === 1 && excl(z, [{ g: 3, p: 2, q: -3, rr: 2, k: 4 }]); });
        var v = o.v, gy = M(o.g, X(v)), num = [gy, lin(o.p, o.q, v), lin(1, o.rr, v)], den = [M(o.g * o.k, X(v)), lin(1, o.rr, v)];
        return simp(dq(pt(prod(num)), pt(prod(den))), num, den, { v: v, text: 'simplify: cubic over quadratic', fN: o.g + v + '(' + pt(lin(o.p, o.q, v)) + ')(' + pt(lin(1, o.rr, v)) + ')', fD: o.g * o.k + v + '(' + pt(lin(1, o.rr, v)) + ')' });
      } },
      { id: '5d', level: 'MAS', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(1, 4), b: nz(r, 1, 6) }; }, function (z) { return Math.abs(z.b) !== z.a && excl(z, [{ a: 2, b: 3 }, { a: 3, b: 3 }]); });
        var s2 = P.add(sq('x'), P.num(o.a * o.a)), num = [s2, lin(1, -o.a), lin(1, o.a)], den = [lin(1, o.b), lin(1, -o.a)];
        return simp(dq(pt(prod(num)), pt(prod(den))), num, den, { text: 'simplify a quartic', fN: '(' + pt(s2) + ')(' + pt(lin(1, -o.a)) + ')(' + pt(lin(1, o.a)) + ')', fD: '(' + pt(lin(1, o.b)) + ')(' + pt(lin(1, -o.a)) + ')', hints: ['Difference of squares twice: ' + t('x^{4}-' + Math.pow(o.a, 4) + '=(x^{2}+' + o.a * o.a + ')(x^{2}-' + o.a * o.a + ')') + '.'] });
      } }] },
    { num: '6', stem: 'Simplify. State the non-permissible values.', parts: [
      { id: '6a', level: 'EMG', make: function (r) { return g_opp1(r); } },
      { id: '6b', level: 'PRG', make: function (r) { return g_opp2(r); } },
      { id: '6c', level: 'PRG', make: function (r) { return g_opp3(r); } },
      { id: '6d', level: 'ADV', make: function (r) { return g_opp4(r); } },
      { id: '6e', level: 'ADV', make: function (r) { return g_opp5(r); } },
      { id: '6f', level: 'MAS', make: function (r) { var p = g_opp6(r, false, [{ k: 1 }]); p.prompt = p.prompt + ' (State the NPVs for the first letter in terms of the second.)'; return p; } }] },
    { num: '7', stem: 'Simplify, and state the non-permissible values for ' + t('x') + ' in terms of ' + t('y') + '.', parts: [
      { id: '7a', level: 'PRG', make: function (r) { return g_y(r, 'gcf'); } },
      { id: '7b', level: 'PRG', make: function (r) { return g_y(r, 'sq'); } },
      { id: '7c', level: 'ADV', make: function (r) { return g_y(r, 'opp'); } },
      { id: '7d', level: 'MAS', make: function (r) { var p = g_y(r, 'oppmono'); p.prompt += ' (Also state the NPV of ' + t('y') + '.)'; return p; } }] },
    { num: '8', shared: function (r) {
        var o = pickWhere(function () { return { p: nz(r, 1, 7), q: nz(r, 1, 7), v: U.pickVar(r, ['a', 'x', 'm', 't']), t0: r.int(1, 4) }; }, function (z) { return z.p !== -z.q && z.p !== z.q && excl(z, [{ p: 4, q: 1 }, { p: -3, q: -2 }]) && z.t0 !== z.q && z.t0 * z.t0 !== z.q; });
        o.ord = r.shuffle(['mono', 'neg', 'opp', 'sq']); return o;
      },
      stem: function (o) { return 'Which expressions are equivalent to ' + t(dq(pt(lin(1, o.p, o.v)), pt(lin(1, -o.q, o.v)))) + ' (for their permissible values)? Decide for each one.'; },
      parts: [0, 1, 2, 3].map(function (i) { return { id: '8' + 'abcd'.charAt(i), level: 'PRG', make: function (r, o) { return equivMC(r, o, o.ord[i]); } }; }) },
    { num: '9', stem: 'Determine the missing numerator.', parts: [
      { id: '9a', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { p: nz(r, 1, 9), s: r.int(2, 9), sg: r.pick([1, -1]) }; }, function (z) { return Math.abs(z.p) !== z.s && excl(z, [{ p: 2, s: 5, sg: 1 }, { p: -3, s: 2, sg: -1 }]); });
        var Dd = lin(1, -o.sg * o.s), mult = lin(1, o.sg * o.s), ans = P.mul(lin(1, o.p), mult);
        return missingNum(t(dq(pt(lin(1, o.p)), pt(Dd)) + '=' + dq('?', 'x^{2}-' + o.s * o.s)), ans, { text: 'missing numerator: difference of squares', good: ['(' + pt(lin(1, o.p)) + ')(' + pt(mult) + ')'],
          dl: [{ N: lin(1, o.p), D: P.num(1), code: 'value', hint: 'The denominator was multiplied by ' + t('(' + pt(mult) + ')') + ': multiply the numerator by it too.' }],
          sol: t('x^{2}-' + o.s * o.s + '=(' + pt(Dd) + ')(' + pt(mult) + ')') + ', so multiply the numerator by ' + t('(' + pt(mult) + ')') + ': ' + t('?=(' + pt(lin(1, o.p)) + ')(' + pt(mult) + ')=' + pt(ans)), hints: ['What was the denominator multiplied by? Do the same to the numerator.'] });
      } },
      { id: '9b', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { k: r.int(1, 9), c: r.int(2, 5), m: r.int(2, 5), n: r.int(2, 4) }; }, function (z) { return gcd(z.k, z.c) === 1 && excl(z, [{ k: 3, c: 2, m: 4, n: 3 }]); });
        var mult = M(o.m, X('x', o.n - 1)), ans = M(o.k * o.m, X('x', o.n - 1));
        return missingNum(t(dq(o.k, o.c + 'x') + '=' + dq('?', o.c * o.m + 'x^{' + o.n + '}')), ans, { text: 'missing numerator: monomial',
          dl: [{ N: M(o.k * o.m, {}), D: P.num(1), code: 'value', hint: 'The denominator was multiplied by ' + t(pt(mult)) + ' (a number <b>and</b> a power of ' + t('x') + ').' }],
          sol: 'Multiply by ' + t(pt(mult)) + ': ' + t('?=' + o.k + '\\cdot ' + pt(mult) + '=' + pt(ans)), hints: [t(o.c + 'x\\times ? =' + o.c * o.m + 'x^{' + o.n + '}') + '.'] });
      } },
      { id: '9c', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { p: nz(r, 1, 9), s: r.int(1, 9) }; }, function (z) { return z.p !== z.s && excl(z, [{ p: 1, s: 4 }]); });
        var ans = lin(-1, o.p);
        return missingNum(t(dq(pt(lin(1, -o.p)), pta(lin(-1, o.s))) + '=' + dq('?', pt(lin(1, -o.s)))), ans, { text: 'missing numerator: opposite', good: ['-(' + pt(lin(1, -o.p)) + ')'],
          sol: 'The denominator was multiplied by ' + t('-1') + ': ' + t('?=-(' + pt(lin(1, -o.p)) + ')=' + pta(ans)), hints: [t(pta(lin(-1, o.s)) + '\\times(-1)=' + pt(lin(1, -o.s))) + '.'] });
      } },
      { id: '9d', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { k: r.int(1, 5), a: nz(r, 1, 6), rr: nz(r, 1, 6) }; }, function (z) { return z.rr !== -z.a && excl(z, [{ k: 2, a: 3, rr: 2 }]); });
        var Dd = lin(1, o.a), mult = lin(1, -o.rr), ans = P.mul(M(o.k, X('x')), mult);
        return missingNum(t(dq(coefTex(o.k) + 'x', pt(Dd)) + '=' + dq('?', pt(P.mul(Dd, mult)))), ans, { text: 'missing numerator: trinomial', good: [coefTex(o.k) + 'x(' + pt(mult) + ')'],
          sol: t(pt(P.mul(Dd, mult)) + '=(' + pt(Dd) + ')(' + pt(mult) + ')') + ': ' + t('?=' + coefTex(o.k) + 'x(' + pt(mult) + ')=' + pt(ans)), hints: ['Factor the new denominator to see what ' + t(pt(Dd)) + ' was multiplied by.'] });
      } },
      { id: '9e', level: 'MAS', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(2, 4), b: nz(r, 1, 7), s: r.int(2, 6), sg: r.pick([1, -1]) }; }, function (z) { return gcd(z.a, z.b) === 1 && z.b !== z.a * z.s && excl(z, [{ a: 2, b: -3, s: 4, sg: 1 }, { a: 3, b: 2, s: 2 }]); });
        var keepD = lin(1, -o.sg * o.s), gone = lin(1, o.sg * o.s), Nf = P.mul(lin(o.a, o.b), gone), k = P.coef(Nf, { x: 1 })[0], c = P.constant(Nf)[0];
        return U.numPart('The expression ' + t(dq(o.a + 'x^{2}+kx' + sg(c), 'x^{2}-' + o.s * o.s)) + ' simplifies to ' + t(dq(pt(lin(o.a, o.b)), pt(keepD))) + '. Determine ' + t('k') + '.', k, { cp: CP, before: t('k='), text: 'find k (simplifies to)',
          cands: [[-k, 'sign', 'Check which factor was divided out: ' + t('(' + pt(gone) + ')') + '.']],
          sol: t('x^{2}-' + o.s * o.s + '=(x-' + o.s + ')(x+' + o.s + ')') + ', and ' + t('(' + pt(gone) + ')') + ' was divided out, so the numerator is ' + t('(' + pt(lin(o.a, o.b)) + ')(' + pt(gone) + ')=' + pt(Nf)) + '. ' + t('k=' + k) + '.', hints: ['Which factor of the denominator is missing from the simplified form? It was divided out of the numerator too.'] });
      } }] },
    { num: '10', shared: function (r) {
        return pickWhere(function () { var z = { p: r.int(2, 4), q: nz(r, 1, 6), rr: r.int(1, 7), d: r.int(1, 5), m: r.int(1, 3), n: r.pick([2, 3, 5]) }; z.x = (z.rr - z.q - z.d) / (z.p - 1); return z; }, function (z) {
          var w = z.p * z.x + z.q, L = z.x + z.rr; return gcd(z.p, z.q) === 1 && z.x > 0 && w > 0 && Math.abs(z.x * 100 - Math.round(z.x * 100)) < 1e-9 && excl(z, [{ p: 3, q: -2, rr: 4, d: 3 }, { p: 2, q: -1, rr: 5 }]) && z.p * z.m + z.q > 0;
        });
      },
      stem: function (o) { return 'A rectangle has an area of ' + t('(' + pt(P.mul(lin(o.p, o.q), lin(1, o.rr))) + ')\\text{ cm}^2') + ' and a length of ' + t('(' + pt(lin(1, o.rr)) + ')') + ' cm.'; },
      parts: [
        { id: '10a', level: 'PRG', make: function (r, o) {
          return ratP('Write and simplify an expression for its width.', [lin(o.p, o.q), lin(1, o.rr)], [lin(1, o.rr)], { before: t('\\text{width}='), after: 'cm', text: 'rectangle width',
            sol: t('\\text{width}=' + dq(pt(P.mul(lin(o.p, o.q), lin(1, o.rr))), pt(lin(1, o.rr))) + '=' + dq('(' + pt(lin(o.p, o.q)) + ')(' + pt(lin(1, o.rr)) + ')', pt(lin(1, o.rr))) + '=' + pt(lin(o.p, o.q))) + ' cm, ' + t('x\\ne ' + (-o.rr)), hints: ['Width ' + t('=\\frac{\\text{area}}{\\text{length}}') + '. Factor the area.'] });
        } },
        { id: '10b', level: 'ADV', make: function (r, o) {
          var w = o.p * o.x + o.q, L = o.x + o.rr;
          var p = B.fields('The length is ' + o.d + ' cm more than the width. Determine ' + t('x') + ' and the dimensions.', [{ label: t('x='), name: 'x' }, { label: 'Length:', name: 'Length', after: 'cm' }, { label: 'Width:', name: 'Width', after: 'cm' }],
            [K.number(o.x), K.number(L, function (v) { return Math.abs(v - w) < 1e-9 ? { code: 'u6l2-dims', hint: 'That is the width. The length is ' + t('x+' + o.rr) + '.' } : null; }), K.number(w, function (v) { return Math.abs(v - L) < 1e-9 ? { code: 'u6l2-dims', hint: 'That is the length. The width is ' + t(pt(lin(o.p, o.q))) + '.' } : null; })],
            [String(o.x), String(L), String(w)], t('x=' + fxs(o.x)) + '; length ' + t(fxs(L)) + ' cm, width ' + t(fxs(w)) + ' cm',
            t(pt(lin(1, o.rr)) + '=(' + pt(lin(o.p, o.q)) + ')+' + o.d + '\\Rightarrow ' + pt(lin(1, o.rr)) + '=' + pt(lin(o.p, o.q + o.d)) + '\\Rightarrow x=' + fxs(o.x)) + '.<br>Length ' + t(fxs(L)) + ' cm, width ' + t(fxs(w)) + ' cm.', ['Length ' + t('=') + ' width ' + t('+' + o.d) + ': write the equation and solve for ' + t('x') + '.'], 'rectangle: x and dimensions');
          p.bad = [[String(o.x), String(w), String(L)]];
          return p;
        } },
        { id: '10c', level: 'MAS', make: function (r, o) {
          // x = m + √n: width p(m+√n)+q = (pm+q) + p√n, length (m+rr) + √n
          var a1 = o.p * o.m + o.q, b1 = o.p, a2 = o.m + o.rr, b2 = 1, A = a1 * a2 + b1 * b2 * o.n, Bc = a1 * b2 + a2 * b1;
          var key = U.radSumTex(A, Bc, o.n), xs = o.m + '+\\sqrt{' + o.n + '}';
          var p = B.math('Determine the exact area when ' + t('x=' + xs) + '.', U.radSumCheck(A, Bc, o.n, { cands: [[2 * (a1 + a2) + 2 * (b1 + b2) * Math.sqrt(o.n), 'value', 'That is the perimeter. The area is length ' + t('\\times') + ' width.']] }), key,
            'Width ' + t('=' + o.p + '(' + xs + ')' + sg(o.q) + '=' + U.radSumTex(a1, b1, o.n)) + ', length ' + t('=' + xs + '+' + o.rr + '=' + U.radSumTex(a2, b2, o.n)) + '.<br>Area ' + t('=(' + U.radSumTex(a2, b2, o.n) + ')(' + U.radSumTex(a1, b1, o.n) + ')=' + a1 * a2 + '+' + (a2 * b1) + '\\sqrt{' + o.n + '}+' + (a1 * b2) + '\\sqrt{' + o.n + '}+' + (b1 * b2 * o.n) + '=' + key) + ' cm².', ['Substitute into the length and the simplified width, then multiply (FOIL) and collect like terms: ' + t('\\sqrt{' + o.n + '}\\cdot\\sqrt{' + o.n + '}=' + o.n) + '.'], 'rectangle: exact area', { keys: 'radical', after: 'cm²' });
          p.bad = [U.radSumTex(a1 * a2, Bc, o.n), String(A + Bc)];
          return p;
        } }] },
    { num: '11', parts: [{ id: '11', level: 'PRG', make: function (r) {
      var o = pickWhere(function () { return { p: nz(r, 1, 7), q: nz(r, 1, 7), v: U.pickVar(r, ['x', 'x', 'a', 't']) }; }, function (z) { return z.p !== z.q && excl(z, [{ p: 3, q: 4 }, { p: 4, q: 3 }]); });
      var v = o.v, b = lin(1, o.p, v), c = lin(1, o.q, v), A = P.mul(b, c);
      return ratP('A triangle has an area of ' + t('(' + pt(A) + ')\\text{ cm}^2') + ' and a base of ' + t('(' + pt(b) + ')') + ' cm. Write and simplify an expression for its height.', [2, b, c], [b], { vars: [v], before: t('h='), after: 'cm', text: 'triangle height',
        dl: [{ num: [c], den: [1], code: 'u6l2-half', hint: t('A=\\frac{1}{2}bh') + ', so ' + t('h=\\frac{2A}{b}') + ': don’t forget the ' + t(2) + '.' }],
        sol: t('A=\\frac{1}{2}bh\\Rightarrow h=\\frac{2A}{b}=' + dq('2(' + pt(b) + ')(' + pt(c) + ')', pt(b)) + '=2(' + pt(c) + ')=' + pt(P.mul(2, c))) + ' cm, ' + t(v + '\\ne ' + (-o.p)), hints: ['Solve ' + t('A=\\frac{1}{2}bh') + ' for ' + t('h') + ', then factor the area.'] });
    } }] },
    { num: '12', shared: function (r) { return { k: r.pick([1, 3, 7, 9]), m: r.int(2, 6) }; },
      stem: function (o) { return 'A cylinder has radius ' + t('r') + ' cm and height ' + t('(r+' + o.k + ')') + ' cm.'; },
      parts: [
        { id: '12a', level: 'ADV', make: function (r, o) {
          var sa = function (e) { return 2 * Math.PI * e.r * (2 * e.r + o.k); }, vol = function (e) { return Math.PI * e.r * e.r * (e.r + o.k); };
          var c1 = U.exprCheck(sa, { vars: ['r'], form: U.factForm, dl: [{ fn: function (e) { return 2 * Math.PI * e.r * e.r + 2 * Math.PI * e.r; }, code: 'value', hint: 'Use ' + t('h=r+' + o.k) + ' in ' + t('2\\pi rh') + ', then collect like terms.' }, { fn: function (e) { return 2 * Math.PI * e.r * (e.r + o.k); }, code: 'value', hint: 'Include the two circles, ' + t('2\\pi r^{2}') + ', then collect like terms.' }] });
          var c2 = U.exprCheck(vol, { vars: ['r'], form: U.factForm });
          var k1 = '2\\pi r(2r+' + o.k + ')', k2 = '\\pi r^{2}(r+' + o.k + ')';
          var p = B.fields('Write the surface area ' + t('SA=2\\pi r^{2}+2\\pi rh') + ' and the volume ' + t('V=\\pi r^{2}h') + ' in factored form.', [{ label: t('SA='), name: 'SA', mode: 'math', keys: 'u6kp', vars: ['r'], placeholder: 'e.g. 2πr(r+4)' }, { label: t('V='), name: 'V', mode: 'math', keys: 'u6kp', vars: ['r'], placeholder: 'e.g. πr^2(r+4)' }], [c1, c2], [k1, k2], t('SA=' + k1) + '<br>' + t('V=' + k2),
            t('SA=2\\pi r^{2}+2\\pi r(r+' + o.k + ')=4\\pi r^{2}+' + 2 * o.k + '\\pi r=' + k1) + '<br>' + t('V=' + k2), ['Substitute ' + t('h=r+' + o.k) + ', collect like terms, then take out the greatest common factor.'], 'cylinder: SA and V factored');
          p.bad = [['4\\pi r^{2}+' + 2 * o.k + '\\pi r', k2], [k1, '\\pi r^{3}+' + o.k + '\\pi r^{2}'], ['2\\pi r(r+' + o.k + ')', k2]];
          return p;
        } },
        { id: '12b', level: 'ADV', make: function (r, o) {
          var num = [M(1, { r: 2 }), lin(1, o.k, 'r')], den = [M(2, { r: 1 }), lin(2, o.k, 'r')];
          return simp('', num, den, { v: 'r', prompt: 'Write ' + t('\\dfrac{V}{SA}') + ' in simplest form and state the NPVs.', text: 'cylinder: V/SA',
            sol: t(dq('\\pi r^{2}(r+' + o.k + ')', '2\\pi r(2r+' + o.k + ')') + '=' + dq('r(r+' + o.k + ')', '2(2r+' + o.k + ')')) + ', ' + t(nvT({ r: [0, [-o.k, 2]] })) + ' (in context ' + t('r>0') + ').', hints: ['Divide out the common factors ' + t('\\pi') + ' and ' + t('r') + '. The NPVs come from ' + t('2\\pi r(2r+' + o.k + ')') + '.'] });
        } },
        { id: '12c', level: 'PRG', make: function (r, o) {
          var val = ex.norm(o.m * (o.m + o.k), 2 * (2 * o.m + o.k));
          return U.numPart('Evaluate ' + t('\\dfrac{V}{SA}') + ' for ' + t('r=' + o.m) + '.', val, { cp: CP, text: 'cylinder: V/SA at r',
            sol: t(dq(o.m + '(' + o.m + '+' + o.k + ')', '2(2(' + o.m + ')+' + o.k + ')') + '=' + dq(o.m * (o.m + o.k), 2 * (2 * o.m + o.k)) + '=' + rt(val)), hints: ['Substitute into the simplified form.'] });
        } }] },
    { num: '13', parts: [{ id: '13', level: 'MAS', make: function (r) { return trinPart(r); } }] },
    { num: '14', parts: [{ id: '14', level: 'PRG', make: function (r) {
      var a = pickWhere(function () { return r.int(2, 9); }, function (z) { return z !== 4; });
      return U.mc(r, 'In simplest form, ' + t(dq('x^{2}-' + a + 'x', a * a + '-x^{2}')) + ' is', [
        { html: t(dq('x', 'x+' + a)), why: t(a * a + '-x^{2}=(' + a + '-x)(' + a + '+x)') + ', and ' + t(a + '-x=-(x-' + a + ')') + ': you lost the ' + t('-1') + '.' },
        { html: t('-' + dq('x', 'x+' + a)), right: true },
        { html: t(dq('x', 'x-' + a)), why: 'Factor both: ' + t('x(x-' + a + ')') + ' over ' + t('(' + a + '-x)(' + a + '+x)') + '.' },
        { html: t('-' + dq(1, a)), why: 'You can’t divide out the ' + t('x^{2}') + ' terms: they are terms, not factors.' }],
        t(dq('x(x-' + a + ')', '(' + a + '-x)(' + a + '+x)') + '=' + dq('x(x-' + a + ')', '-(x-' + a + ')(x+' + a + ')') + '=-' + dq('x', 'x+' + a)) + ', ' + t('x\\ne\\pm ' + a) + '.', HOPP, 'MC: simplest form with opposites');
    } }] },
    { num: '15', parts: [{ id: '15', level: 'PRG', make: function (r) {
      var o = pickWhere(function () { return { p: r.int(1, 9), q: r.int(1, 9), v: U.pickVar(r, ['a', 'x', 'm']) }; }, function (z) { return z.p !== z.q && excl(z, [{ p: 2, q: 3 }]); }), v = o.v;
      return U.mc(r, 'Which expression is equivalent to ' + t(dq(v + '-' + o.p, o.q + '-' + v)) + '?', [
        { html: t(dq(o.p + '-' + v, v + '-' + o.q)), right: true },
        { html: t(dq(v + '-' + o.p, v + '-' + o.q)), why: 'Only the denominator was changed to its opposite: that gives the opposite of the expression.' },
        { html: t('-' + dq(v + '+' + o.p, v + '-' + o.q)), why: t('-(' + v + '-' + o.p + ')=' + o.p + '-' + v) + ', not ' + t('-(' + v + '+' + o.p + ')') + '.' },
        { html: t(dq(o.p, o.q)), why: 'You can’t divide out the ' + t(v) + ' terms: they are terms, not factors.' }],
        t(dq(o.p + '-' + v, v + '-' + o.q) + '=' + dq('-(' + v + '-' + o.p + ')', '-(' + o.q + '-' + v + ')') + '=' + dq(v + '-' + o.p, o.q + '-' + v)) + '.', ['Changing the sign of both the numerator and the denominator keeps the value.'], 'MC: equivalent with opposites');
    } }] },
    { num: '16', parts: [{ id: '16', level: 'PRG', make: function (r) {
      var o = pickWhere(function () { return { p: r.int(2, 4), q: nz(r, 1, 5), s: r.int(1, 6) }; }, function (z) { return gcd(z.p, z.q) === 1 && excl(z, [{ p: 2, q: 1, s: 2 }]) && z.q !== -z.p * z.s && z.q !== z.p * z.s; });
      var f = lin(o.p, o.q), N = P.mul(f, lin(1, -o.s)), sT = dq(pt(f), 'x+' + o.s), np = ',\\ x\\ne\\pm ' + o.s;
      return U.mc(r, 'When ' + t(dq(pt(N), 'x^{2}-' + o.s * o.s)) + ' is written in simplest form, the result is', [
        { html: t(sT + ',\\ x\\ne ' + (-o.s)), why: 'The NPVs come from the original denominator: ' + t('x\\ne ' + o.s) + ' too.' }, { html: t(sT + np), right: true },
        { html: t(dq(pt(lin(o.p, -o.q)), 'x+' + o.s) + np), why: 'Check the signs in your factors: expand ' + t('(' + pt(f) + ')(x-' + o.s + ')') + '.' }, { html: t(dq(pt(f), 'x-' + o.s) + np), why: 'Which factor is common to the numerator and the denominator?' }],
        t(dq('(' + pt(f) + ')(x-' + o.s + ')', '(x-' + o.s + ')(x+' + o.s + ')') + '=' + sT) + '; the NPVs come from the original denominator, ' + t('x\\ne\\pm ' + o.s) + '.', HS, 'MC: simplest form and NPVs');
    } }] },
    { num: '17', parts: [{ id: '17', level: 'ADV', make: function (r) {
      var o = pickWhere(function () { return { a: r.int(2, 5), b: r.int(2, 9) }; }, function (z) { return excl(z, [{ a: 3, b: 4 }]) && z.a + z.b <= 14; });
      var N = P.mul(lin(o.a, 1), lin(1, -o.b));
      return nrPart('The expression ' + t(dq(pt(N), 'x^{2}-' + o.b * o.b)) + ' simplifies to ' + t(dq('ax+1', 'x+b')) + '. The value of ' + t('a+b') + ' is ____.', o.a + o.b, null, [[o.a - o.b, 'sign', 'The simplified denominator is ' + t('x+' + o.b) + ', so ' + t('b=' + o.b) + '.']],
        t('ac=' + (-o.a * o.b)) + ': ' + t(-o.a * o.b) + ' and ' + t(1) + '. ' + t(pt(N) + '=(' + pt(lin(o.a, 1)) + ')(x-' + o.b + ')') + '.<br>' + t(dq('(' + pt(lin(o.a, 1)) + ')(x-' + o.b + ')', '(x-' + o.b + ')(x+' + o.b + ')') + '=' + dq(pt(lin(o.a, 1)), 'x+' + o.b)) + ': ' + t('a=' + o.a + ',\\ b=' + o.b + ',\\ a+b=' + (o.a + o.b)) + '.', HS, 'NR: a + b');
    } }] },
    { num: '18', parts: [{ id: '18', level: 'PRG', make: function (r) {
      var o = pickWhere(function () { return { s: r.int(2, 9), p: r.int(1, 9), m: r.int(0, 6) }; }, function (z) { return z.p !== z.s && excl(z, [{ s: 7, p: 2, m: 3 }]) && z.m !== z.s; });
      var N = P.mul(lin(1, -o.s), lin(1, o.p)), val = (o.m + o.p) / (o.m + o.s);
      return nrPart('Simplify ' + t(dq(pt(N), 'x^{2}-' + o.s * o.s)) + ' and evaluate it at ' + t('x=' + o.m) + '. To the nearest tenth, the value is ____.', val, 1, [],
        t(dq('(x-' + o.s + ')(' + pt(lin(1, o.p)) + ')', '(x-' + o.s + ')(x+' + o.s + ')') + '=' + dq(pt(lin(1, o.p)), 'x+' + o.s)) + ', ' + t('x\\ne\\pm ' + o.s) + '. At ' + t('x=' + o.m) + ': ' + t(dq(o.m + o.p, o.m + o.s) + '\\approx ' + K.roundTo(val, 1).toFixed(1)) + '.', ['Simplify first, then substitute (or substitute into the original: the value is the same).'], 'NR: simplify and evaluate');
    } }] }
  ];
  function coefTex(k) { return k === 1 ? '' : String(k); }

  /* ---------- Extra practice ---------- */
  var EXTRA = [
    { num: 'A1', section: 'A. Skills', stem: 'Simplify. State the non-permissible values.', parts: [
      { id: 'eA1a', level: 'BEG', make: function (r) { return g_mono2(r); } },
      { id: 'eA1b', level: 'EMG', make: function (r) { return g_binpow(r, true); } },
      { id: 'eA1c', level: 'EMG', make: function (r) { return g_gcfmono(r); } },
      { id: 'eA1d', level: 'EMG', make: function (r) { return g_dosoverlin(r, [], false); } }] },
    { num: 'A2', stem: 'Simplify. State the non-permissible values.', parts: [
      { id: 'eA2a', level: 'PRG', make: function (r) { return g_tri(r, 'mm'); } },
      { id: 'eA2b', level: 'PRG', make: function (r) { return g_tri(r, 'sq'); } },
      { id: 'eA2c', level: 'PRG', make: function (r) { return g_tri(r, 'dosac'); } },
      { id: 'eA2d', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { g1: r.int(2, 6), g2: r.int(2, 6), p: nz(r, 1, 6), s: r.int(1, 6), sg: r.pick([1, -1]) }; }, function (z) { return gcd(z.g1, z.g2) > 1 && z.g1 !== z.g2 && Math.abs(z.p) !== z.s && excl(z, [{ g1: 4, g2: 2, p: 3, s: 2 }]); });
        var c = lin(1, -o.sg * o.s), num = [o.g1, lin(1, o.p), c], den = [o.g2, lin(1, o.sg * o.s), c];
        return simp(dq(pt(prod(num)), pt(prod(den))), num, den, { text: 'EP: GCFs then factor', fN: o.g1 + '(' + pt(lin(1, o.p)) + ')(' + pt(c) + ')', fD: o.g2 + '(' + pt(lin(1, o.sg * o.s)) + ')(' + pt(c) + ')' });
      } }] },
    { num: 'A3', stem: 'Simplify. State the non-permissible values.', parts: [
      { id: 'eA3a', level: 'EMG', make: function (r) { return g_opp1(r); } },
      { id: 'eA3b', level: 'PRG', make: function (r) { return g_opp3(r); } },
      { id: 'eA3c', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { k: r.int(2, 7), s: nz(r, 1, 6), q: nz(r, 1, 6) }; }, function (z) { return z.q !== -z.s && excl(z, [{ k: 3, s: 2, q: 4 }]); });
        var f = lin(1, -o.s), g2 = lin(1, o.q), N = P.mul(o.k, f), D = P.neg(P.mul(f, g2));
        var rd = U.reduce([o.k, f], [-1, f, g2]);
        return simp(dq(pt(N), pta(D)), [o.k, f], [-1, f, g2], { text: 'EP: opposites, negative x²', hints: ['Factor ' + t('-1') + ' out of the denominator: ' + t(pta(D) + '=-(' + pt(P.neg(D)) + ')') + '.'],
          dl: [{ num: [o.k], den: [g2], code: CP + 'opp', hint: 'The denominator is ' + t('-(' + pt(P.neg(D)) + ')') + ': keep the ' + t('-1') + '.' }],
          sol: t(dq(o.k + '(' + pt(f) + ')', '-(' + pt(g2) + ')(' + pt(f) + ')')) + '; NPVs ' + t(nvT(U.npvOf(rd.D, 'x'))) + '<br>' + t('=' + rd.tex) + ', ' + t(nvT(U.npvOf(rd.D, 'x'))) });
      } }] },
    { num: 'B4', section: 'B. Applying', stem: 'Simplify, and state the non-permissible values for ' + t('x') + ' in terms of ' + t('y') + '.', parts: [
      { id: 'eB4a', level: 'PRG', make: function (r) { return g_y(r, 'mono'); } },
      { id: 'eB4b', level: 'ADV', make: function (r) { return g_y(r, 'opp2'); } }] },
    { num: 'B5', shared: function (r) { return pickWhere(function () { return { p: nz(r, 1, 9), q: nz(r, 1, 9), x0: r.int(1, 4) }; }, function (z) { return z.p !== z.q && z.x0 !== -z.q && excl(z, [{ p: 3, q: 5 }]) && (z.x0 + z.p) * z.q !== z.p * (z.x0 + z.q); }); },
      stem: function (o) { return 'A student writes ' + t(dq('x^{2}' + sg(o.p) + 'x', 'x^{2}' + sg(o.q) + 'x') + '=' + dq(o.p + 'x', o.q + 'x') + '=' + rt(ex.norm(o.p, o.q))) + '.'; },
      parts: [
        { id: 'eB5a', level: 'EMG', make: function (r, o) {
          var v1 = ex.norm(o.x0 + o.p, o.x0 + o.q), wv = rt(ex.norm(o.p, o.q));
          return U.mc(r, 'Which explains the error?', [
            { html: 'The ' + t('x^{2}') + ' terms were divided out, but they are terms, not factors. With ' + t('x=' + o.x0) + ': ' + t(rt(v1) + '\\ne ' + wv) + '.', right: true },
            { html: 'Nothing is wrong: the ' + t('x^{2}') + ' terms are the same, so they divide out.', why: 'Try ' + t('x=' + o.x0) + ' in the original: you get ' + t(rt(v1)) + ', not ' + t(wv) + '.' },
            { html: 'The answer should be ' + t(dq(o.p + 'x', o.q + 'x')) + ': the ' + t('x') + '’s cannot divide out.', why: 'The first step is the mistake: ' + t('x^{2}') + ' is a term of each binomial, not a factor.' },
            { html: 'The ' + t('x') + '’s should have been divided out first, giving ' + t(dq('x' + sg(o.p), 'x' + sg(o.q))) + ' with no NPVs.', why: 'Dividing out ' + t('x') + ' is right, but the NPV ' + t('x\\ne 0') + ' stays.' }],
            'Only factors divide out. ' + t('x^{2}') + ' is a term. With ' + t('x=' + o.x0) + ': ' + t(rt(v1) + '\\ne ' + wv) + '.', ['Substitute a value of ' + t('x') + ' into the original and the answer.'], 'EP error: dividing terms');
        } },
        { id: 'eB5b', level: 'PRG', make: function (r, o) {
          var num = [P.v('x'), lin(1, o.p)], den = [P.v('x'), lin(1, o.q)];
          return simp('', num, den, { prompt: 'Simplify ' + t(dq('x^{2}' + sg(o.p) + 'x', 'x^{2}' + sg(o.q) + 'x')) + ' correctly. State the NPVs.', text: 'EP error: correct simplification', fN: 'x(' + pt(lin(1, o.p)) + ')', fD: 'x(' + pt(lin(1, o.q)) + ')',
            dl: [{ num: [o.p], den: [o.q], code: CP + 'terms', hint: 'That is the student’s answer. Factor ' + t('x') + ' out of the numerator and the denominator first.' }] });
        } }] },
    { num: 'B6', parts: [
      { id: 'eB6a', level: 'PRG', make: function (r) {
        var s = pickWhere(function () { return nz(r, 1, 9); }, function (z) { return z !== 1; });
        var D = P.pow(lin(1, -s), 2), N = P.mul(lin(1, -s), lin(1, s));
        return U.mc(r, 'Is ' + t(dq(pt(N), pt(D))) + ' equivalent to ' + t(dq(pt(lin(1, s)), pt(lin(1, -s)))) + '?', [
          { html: 'Yes, for ' + t('x\\ne ' + s) + ': ' + t(dq('(' + pt(lin(1, -s)) + ')(' + pt(lin(1, s)) + ')', '(' + pt(lin(1, -s)) + ')^{2}')) + ' simplifies to it', right: true },
          { html: 'No: the ' + t('x^{2}') + ' terms do not divide out', why: 'Factor first: the numerator and the denominator share the factor ' + t('(' + pt(lin(1, -s)) + ')') + '.' },
          { html: 'No: it simplifies to ' + t(dq(pt(lin(1, -s)), pt(lin(1, s)))), why: 'Which factor is left in the denominator?' },
          { html: 'No: they have different NPVs', why: 'Both have only ' + t('x\\ne ' + s) + '; and equivalent only needs equal values where both are defined.' }],
          t(dq('(' + pt(lin(1, -s)) + ')(' + pt(lin(1, s)) + ')', '(' + pt(lin(1, -s)) + ')^{2}') + '=' + dq(pt(lin(1, s)), pt(lin(1, -s)))) + ': yes, for ' + t('x\\ne ' + s) + '.', HS, 'EP: equivalent? (yes)');
      } },
      { id: 'eB6b', level: 'PRG', make: function (r) {
        var k = pickWhere(function () { return r.int(1, 9); }, function (z) { return z !== 1; }), x0 = r.int(1, 3);
        return U.mc(r, 'Is ' + t(dq('x^{2}+' + k * k, 'x+' + k)) + ' equivalent to ' + t('x+' + k) + '?', [
          { html: 'No: ' + t('x^{2}+' + k * k) + ' does not factor, so nothing divides out. (At ' + t('x=' + x0) + ': ' + t(rt(ex.norm(x0 * x0 + k * k, x0 + k))) + ' vs ' + t(x0 + k) + '.)', right: true },
          { html: 'Yes: ' + t('x^{2}+' + k * k + '=(x+' + k + ')^{2}') + ', so it simplifies to ' + t('x+' + k), why: t('(x+' + k + ')^{2}=x^{2}+' + 2 * k + 'x+' + k * k) + ' has a middle term.' },
          { html: 'Yes: ' + t('x^{2}+' + k * k + '=(x+' + k + ')(x-' + k + ')') + ', so it simplifies to ' + t('x-' + k), why: 'That is a difference of squares; this is a <b>sum</b>.' },
          { html: 'Yes, for ' + t('x\\ne -' + k) + ': divide ' + t('x^{2}') + ' by ' + t('x') + ' and ' + t(k * k) + ' by ' + t(k), why: 'Terms can’t be divided one by one. Try a value of ' + t('x') + '.' }],
          'No. ' + t('x^{2}+' + k * k) + ' is a sum of squares and does not factor. With ' + t('x=' + x0) + ': ' + t(dq(x0 * x0 + k * k, x0 + k) + '=' + rt(ex.norm(x0 * x0 + k * k, x0 + k))) + ', but ' + t('x+' + k + '=' + (x0 + k)) + '.', ['Try a value of ' + t('x') + ' in both.'], 'EP: equivalent? (no)');
      } }] },
    { num: 'B7', shared: function (r) { return pickWhere(function () { return { a: r.int(2, 5), b: r.int(1, 9), x: r.int(2, 9) }; }, function (z) { return gcd(z.a, z.b) === 1 && z.a * z.x > z.b && excl(z, [{ a: 2, b: 3, x: 5 }]); }); },
      stem: function (o) { return 'A rectangle has an area of ' + t('(' + o.a * o.a + 'x^{2}-' + o.b * o.b + ')\\text{ m}^2') + ' and a width of ' + t('(' + pt(lin(o.a, -o.b)) + ')') + ' m.'; },
      parts: [
        { id: 'eB7a', level: 'PRG', make: function (r, o) {
          return ratP('Write and simplify an expression for the length.', [lin(o.a, -o.b), lin(o.a, o.b)], [lin(o.a, -o.b)], { before: t('\\text{length}='), after: 'm', text: 'EP rectangle length',
            sol: t(dq('(' + pt(lin(o.a, -o.b)) + ')(' + pt(lin(o.a, o.b)) + ')', pt(lin(o.a, -o.b))) + '=' + pt(lin(o.a, o.b))) + ' m, ' + t('x\\ne\\frac{' + o.b + '}{' + o.a + '}') + '.', hints: ['Length ' + t('=\\frac{\\text{area}}{\\text{width}}') + '. Factor the difference of squares.'] });
        } },
        { id: 'eB7b', level: 'ADV', make: function (r, o) {
          var Pm = 4 * o.a * o.x, w = o.a * o.x - o.b, L = o.a * o.x + o.b;
          var p = B.fields('The perimeter is ' + Pm + ' m. Determine ' + t('x') + ' and the dimensions.', [{ label: t('x='), name: 'x' }, { label: 'Width:', name: 'Width', after: 'm' }, { label: 'Length:', name: 'Length', after: 'm' }],
            [K.number(o.x), K.number(w, function (v) { return v === L ? { code: 'u6l2-dims', hint: 'That is the length.' } : null; }), K.number(L, function (v) { return v === w ? { code: 'u6l2-dims', hint: 'That is the width.' } : null; })],
            [String(o.x), String(w), String(L)], t('x=' + o.x) + '; ' + t(w) + ' m by ' + t(L) + ' m',
            t('2(' + pt(lin(o.a, -o.b)) + ')+2(' + pt(lin(o.a, o.b)) + ')=' + 4 * o.a + 'x=' + Pm + '\\Rightarrow x=' + o.x) + '. The rectangle is ' + t(w) + ' m by ' + t(L) + ' m (area ' + t(w * L + '=' + o.a * o.a + '(' + o.x * o.x + ')-' + o.b * o.b) + ').', ['Perimeter ' + t('=2(\\text{length})+2(\\text{width})') + '.'], 'EP rectangle: perimeter');
          p.bad = [[String(o.x), String(L), String(w)]];
          return p;
        } }] },
    { num: 'B8', parts: [{ id: 'eB8', level: 'PRG', make: function (r) {
      var o = pickWhere(function () { return { g: r.int(2, 5), s: r.int(1, 5), q: nz(r, 1, 5) }; }, function (z) { return Math.abs(z.q) !== z.s && excl(z, [{ g: 2, s: 2, q: 1 }]); });
      var N = P.mul(o.g, lin(1, -o.s), lin(1, o.s)), D = P.mul(lin(1, -o.s), lin(1, o.q));
      return U.mc(r, 'The simplest form of ' + t(dq(pt(N), pt(D))) + ' is', [
        { html: t(dq(o.g + '(x+' + o.s + ')', pt(lin(1, o.q)))), right: true }, { html: t(dq(o.g + '(x-' + o.s + ')', pt(lin(1, o.q)))), why: 'Which factor is common to the numerator and the denominator?' },
        { html: t(dq('x+' + o.s, pt(lin(1, o.q)))), why: 'Take out the common factor ' + t(o.g) + ' first, and keep it.' }, { html: t(dq(o.g * o.s * o.s, pt(lin(1, -o.s)))), why: 'You can’t divide out the ' + t('x^{2}') + ' terms.' }],
        t(dq(o.g + '(x-' + o.s + ')(x+' + o.s + ')', '(x-' + o.s + ')(' + pt(lin(1, o.q)) + ')') + '=' + dq(o.g + '(x+' + o.s + ')', pt(lin(1, o.q)))) + ', ' + t(nvT({ x: [o.s, -o.q] })) + '.', HS, 'EP MC: simplest form');
    } }] },
    { num: 'B9', parts: [{ id: 'eB9', level: 'PRG', make: function (r) {
      var o = pickWhere(function () { return { p: nz(r, 1, 7), q: r.int(1, 5), s: nz(r, 1, 5), m: r.int(1, 5) }; }, function (z) { return gcd(2, z.q) === 1 && z.p !== z.s && excl(z, [{ p: 5, q: 1, s: -3, m: 2 }]) && 2 * z.m + z.q > 0 && z.m + z.p > 0 && z.m !== z.s; });
      var f = lin(1, -o.s), N = P.mul(lin(1, o.p), f), D = P.mul(lin(2, o.q), f), val = (o.m + o.p) / (2 * o.m + o.q);
      return nrPart('Simplify ' + t(dq(pt(N), pt(D))) + ' and evaluate it at ' + t('x=' + o.m) + '. To the nearest tenth, the value is ____.', val, 1, [],
        t(dq('(' + pt(lin(1, o.p)) + ')(' + pt(f) + ')', '(' + pt(lin(2, o.q)) + ')(' + pt(f) + ')') + '=' + dq(pt(lin(1, o.p)), pt(lin(2, o.q)))) + '. At ' + t('x=' + o.m) + ': ' + t(dq(o.m + o.p, 2 * o.m + o.q) + '\\approx ' + K.roundTo(val, 1).toFixed(1)) + '.', HS, 'EP NR: simplify and evaluate');
    } }] },
    { num: 'C1', section: 'C. Stretch', parts: [{ id: 'eC1', level: 'MAS', make: function (r) {
      var o = pickWhere(function () { return { a: r.int(2, 5), b: nz(r, 1, 7), s: r.int(2, 6), sg: r.pick([1, -1]) }; }, function (z) { return gcd(z.a, z.b) === 1 && Math.abs(z.b) !== z.a * z.s && excl(z, [{ a: 3, b: 2, s: 2, sg: 1 }, { a: 2, b: -3, s: 4 }]); });
      var keepD = lin(1, o.sg * o.s), gone = lin(1, -o.sg * o.s), Nf = P.mul(lin(o.a, o.b), gone), k = P.coef(Nf, { x: 1 })[0], c = P.constant(Nf)[0];
      return U.numPart('The expression ' + t(dq(o.a + 'x^{2}+kx' + sg(c), 'x^{2}-' + o.s * o.s)) + ' simplifies to ' + t(dq(pt(lin(o.a, o.b)), pt(keepD))) + '. Determine ' + t('k') + '.', k, { cp: CP, before: t('k='), text: 'EP: find k', cands: [[-k, 'sign', 'Which factor was divided out? ' + t('(' + pt(gone) + ')') + '.']],
        sol: t('(' + pt(gone) + ')') + ' was divided out, so the numerator is ' + t('(' + pt(lin(o.a, o.b)) + ')(' + pt(gone) + ')=' + pt(Nf)) + '. ' + t('k=' + k) + '.', hints: ['The factor of ' + t('x^{2}-' + o.s * o.s) + ' that is missing from the answer was divided out.'] });
    } }] },
    { num: 'C2', parts: [{ id: 'eC2', level: 'MAS', make: function (r) {
      var o = pickWhere(function () { return { a: r.int(1, 4), b: r.int(2, 5), s: r.pick([1, -1]), q: r.pick([1, -1]) }; }, function (z) { return z.a < z.b && excl(z, [{ a: 2, b: 3 }]); });
      var num = [lin(1, -o.a), lin(1, o.a), lin(1, -o.b), lin(1, o.b)], den = [lin(1, o.s * o.a), lin(1, o.q * o.b)];
      var rd = U.reduce(num, den);
      return simp(dq(pt(prod(num)), pt(prod(den))), num, den, { text: 'EP: quartic over trinomial', hints: ['Let ' + t('u=x^{2}') + ' to factor the numerator, then factor each difference of squares.'],
        sol: t(pt(prod(num)) + '=(x^{2}-' + o.a * o.a + ')(x^{2}-' + o.b * o.b + ')=' + ftex(num)) + '; ' + t(pt(prod(den)) + '=' + ftex(den)) + '.<br>' + t('=' + rd.tex + '=' + pt(rd.T.N)) + ', ' + t(nvT(U.npvOf(rd.D, 'x'))), good: [] });
    } }] },
    { num: 'C3', parts: [{ id: 'eC3', level: 'MAS', make: function (r) { var p = g_opp6(r, true); p.prompt += ' (State the NPV for the first letter in terms of the second.)'; return p; } }] },
    { num: 'C4', parts: [{ id: 'eC4', level: 'MAS', make: function (r) { return trinPart(r, [{ a: 2, b: 1, c: -3, s: -4 }]); } }] }
  ];

  HW.defineLesson({ id: LID, unit: 6, num: '2', title: 'Simplifying Rational Expressions by Factoring', outcome: OUT, calc: true, questions: QUESTIONS, extra: EXTRA });
})(window);
