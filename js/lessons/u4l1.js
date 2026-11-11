/* Math 20-1 · Unit 4 · Lesson 1 — Factoring Review: Common Factors and x² + bx + c (outcome RF1 on every part)
 * Assignment 1 (u4_l01.tex, Questions 1–16) and the Lesson 1 Extra Practice (u4_ep01.tex, A1–A4, B1–B5, C1–C4).
 * Every part is a generator: the booklet question's idea, form and difficulty with new numbers (the lesson's example
 * numbers and the booklet's own numbers are left out). No calculator (Unit 4): exact answers.
 *
 * This file also holds the factoring kit HW.u4kit (Unit 4 Lessons 1–2, reusable by the later Unit 4 lessons), so it
 * must load before u4l2.js:
 *   U.Tri({ p, q, r, s, v, w, k, gv })  a trinomial built from its factors: k·x^gv · (p·v + q·w)(r·v + s·w)
 *                                        (w: a second letter or none; k: integer or [num, den]; gv: {letter: power}).
 *                                        Fields: a b c ac m n (decomposition pair), F1 F2 inner full G list key tex asc
 *   U.triMaker(avoid)                   -> tri(r, spec, extra): random Tri from ranges, never one of the avoided
 *                                        trinomials (the lesson's examples and booklet questions, letters as x and y)
 *   U.facPart(T, o)                     "factor (fully)" part: K.factored with the classic mistakes (product/sum pair
 *                                        diagnosis for a = 1, decomposition slips for a ≠ 1, dropped / partial / wrong-sign
 *                                        common factor, second letter missing), the booklet's method as the solution.
 *                                        o.asc (ascending prompt), o.intBrackets (fraction must come out in front),
 *                                        o.ps (perfect-square solution), o.prompt, o.sol, o.hints, o.wrong
 *   U.canPart(T, o) / U.nonePart(o)     "factor where possible": one box with a none key
 *   U.gcfPart(G, inner, o)              take out the GCF (o.negGcf: a negative factor is asked for)
 *   U.groupPart(A, B, C, D, o)          factor by grouping (C + D)(A + B) from four monomials; o.order = term order
 *   U.twoPolys(...)                     two expressions in either order (length and width)
 *   U.factorMC(r, o)                    "is L a factor of …?" as multiple choice (factoring + verdict)
 *   small tools: gcd, sg, par, pickWhere, posPairs, signedPairs, signHint, V, M, N, tx, br, lin, normKey
 * Every answer typed with the factoring keypad ('poly'). "Find all b" answers are value lists (K.P.valueSet).
 *
 * Conversions: "Is x − a a factor? Show your factoring" → multiple choice of factorization + verdict; "whose answer is
 * factored fully" and "explain why n² + 5n + 6 is even" → multiple choice of explanations; the box (Q12) and the
 * garden (Q11) → boxes for the expressions and the numbers.
 * Levels: LIM BEG EMG PRG ADV MAS. Mastery: 9(b), 16, Extra C2, C4. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, B = K.P, P = HW.poly, FX = HW.factor, nt = HW.nt, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
  var LID = 'u4l1';

  /* ================================ the Unit 4 factoring kit ================================ */
  var U = HW.u4kit = {};
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var x = b; b = a % b; a = x; } return a; }
  function V(v, e) { var o = {}; o[v] = e == null ? 1 : e; return P.mono(1, o); }
  function M(c, vars) { return P.mono(c, vars || {}); }
  function N(c) { return P.num(c); }
  function tx(p, o) { return P.tex(p, o); }
  function br(p) { return P.btex(p); }
  function sg(n) { return n < 0 ? String(n) : '+' + n; }
  function par(n) { return n < 0 ? '(' + n + ')' : String(n); }
  function lin(p, q, v, w) { return P.add(M(p, oneVar(v || 'x')), w ? M(q, oneVar(w)) : N(q)); }
  function oneVar(v) { var o = {}; o[v] = 1; return o; }
  function pickWhere(gen, test, lid) { for (var i = 0; i < 4000; i++) { var o = gen(); if (test(o)) return o; } throw new Error((lid || LID) + ': no valid numbers'); }
  function posPairs(n) { n = Math.abs(n); var o = []; for (var u = 1; u * u <= n; u++) if (n % u === 0) o.push([u, n / u]); return o; }
  function signedPairs(c) { var o = []; posPairs(c).forEach(function (pq) { if (c > 0) { o.push([pq[0], pq[1]]); o.push([-pq[0], -pq[1]]); } else { o.push([pq[0], -pq[1]]); o.push([-pq[0], pq[1]]); } }); return o; }
  function isSq(n) { if (n < 0) return false; var s = Math.round(Math.sqrt(n)); return s * s === n; }
  function factorable(a, b, c) { return isSq(b * b - 4 * a * c); }
  function signHint(b, c, what) {
    what = what || 'product';
    if (c > 0) return b > 0 ? 'The ' + what + ' is positive and the sum is positive, so <b>both</b> numbers are positive.' : 'The ' + what + ' is positive but the sum is negative, so <b>both</b> numbers are negative.';
    if (b === 0) return 'The ' + what + ' is negative, so one number is positive and one is negative; a sum of ' + t('0') + ' means they are the same size.';
    return 'The ' + what + ' is negative, so the numbers have opposite signs; the larger one has the sign of the sum, ' + t(b) + '.';
  }
  function mulAll(list) { return list.reduce(function (acc, f) { return P.mul(acc, f && f.p ? P.pow(f.p, f.k) : f); }, N(1)); }
  function polyOf(f) { return f && f.p ? f.p : f; }
  U.gcd = gcd; U.V = V; U.M = M; U.N = N; U.tx = tx; U.br = br; U.sg = sg; U.par = par; U.lin = lin; U.pickWhere = pickWhere;
  U.posPairs = posPairs; U.signedPairs = signedPairs; U.isSq = isSq; U.factorable = factorable; U.signHint = signHint; U.mulAll = mulAll;

  HW.addCodes({
    'pair-sum': 'Pair with the right product but the wrong sum', 'pair-product': 'Pair with the right sum but the wrong product', 'pair-signs': 'Pair with the wrong signs',
    'swap-bc': 'Numbers multiply to b and add to c (roles swapped)', 'gcf-dropped': 'Dropped the common factor', 'gcf-part': 'Took out only part of the GCF',
    'y-missing': 'Second variable missing from a bracket', 'ax-sign-swap': 'Signs of both constants switched', 'ax-const-swap': 'Constant terms in the wrong brackets',
    'ax-pair-as-factors': 'Wrote the pair into the brackets as if a = 1', 'ax-no-divide': 'Used ax ± m, ax ± n without dividing out a', 'ax-lost-negative': 'Lost the negative common factor',
    'ax-gcf-sign': 'Common factor with the wrong sign', 'u4-said-none': 'Said it can’t be factored (it can)', 'u4-no-pair': 'Wrote factors for a trinomial that doesn’t factor',
    'u4-use-none': 'Retyped a trinomial that doesn’t factor', 'u4-frac-bracket': 'Fraction left inside a bracket', 'u4-neg-gcf': 'Took out a positive factor (a negative one was asked for)',
    'u4-group-sign': 'Grouping: sign slip in the second group', 'u4-either': 'One of the two expressions wrong', 'u4-said-not-ps': 'Said it isn’t a perfect square (it is)',
    'u4-not-ps': 'Factored a trinomial that isn’t a perfect square as if it were', 'u4-ps-sign': 'Perfect square with the wrong sign'
  });
  HW.addPartial({ 'pair-sum': 's', 'pair-product': 's', 'swap-bc': 'b', 'u4-group-sign': 's', 'u4-either': 's', 'u4-ps-sign': 's', 'ax-pair-as-factors': 'b', 'ax-no-divide': 'b', 'u4-not-ps': 'b' });

  /* ---------------- a trinomial built from its factors ---------------- */
  function rq(k) { return Array.isArray(k) ? k : [k == null ? 1 : k, 1]; }
  U.Tri = function (o) {
    var v = o.v || 'x', w = o.w || null, Uv = V(v), Wv = w ? V(w) : N(1), T = { p: o.p, q: o.q, r: o.r, s: o.s, v: v, w: w };
    T.F1 = P.add(P.scale(Uv, o.p), P.scale(Wv, o.q)); T.F2 = P.add(P.scale(Uv, o.r), P.scale(Wv, o.s));
    T.Uv = Uv; T.Wv = Wv;
    T.inner = P.mul(T.F1, T.F2);
    T.a = o.p * o.r; T.b = o.p * o.s + o.q * o.r; T.c = o.q * o.s; T.ac = T.a * T.c; T.m = o.p * o.s; T.n = o.q * o.r;
    T.monic = T.a === 1;
    T.k = rq(o.k); T.gv = o.gv || {};
    T.G = P.mono(T.k, T.gv); T.g1 = P.eq(T.G, N(1)); T.neg = T.k[0] < 0; T.frac = T.k[1] !== 1;
    T.full = P.mul(T.G, T.inner);
    T.sq = P.eq(T.F1, T.F2);
    var brs = T.sq ? [{ p: T.F1, k: 2 }] : [T.F1, T.F2];
    T.list = T.g1 ? brs : [T.G].concat(brs);
    T.key = FX.tex(T.list);
    T.tex = tx(T.full); T.asc = tx(T.full, { order: 'asc', var: v }); T.innerTex = tx(T.inner);
    var gt = tx(T.G); T.gtex = gt; T.gpre = gt === '1' ? '' : gt === '-1' ? '-' : gt;
    return T;
  };
  /* the same trinomial with the letters renamed x (and y), for comparing with the avoided list */
  U.normKey = function (T) {
    var ren = {}; ren[T.v] = 'x'; if (T.w) ren[T.w] = 'y';
    var gv = {}; Object.keys(T.gv).forEach(function (x) { gv[ren[x] || (T.w ? 'z' : 'y')] = T.gv[x]; });
    var N2 = U.Tri({ p: T.p, q: T.q, r: T.r, s: T.s, v: 'x', w: T.w ? 'y' : null, k: T.k, gv: gv });
    return tx(N2.full);
  };
  function val(r, x) { return typeof x === 'number' ? x : Array.isArray(x) ? r.int(x[0], x[1]) : r.pick(x.of); }
  U.triMaker = function (avoid, lid) {
    var bad = {}; (avoid || []).forEach(function (s) { bad[tx(P.parse(s))] = 1; });
    return function (r, sp, extra) {
      extra = extra || {};
      for (var i = 0; i < 6000; i++) {
        var o = { p: val(r, sp.p == null ? 1 : sp.p), q: val(r, sp.q), r: val(r, sp.r == null ? 1 : sp.r), s: val(r, sp.s == null ? 0 : sp.s) };
        if (sp.square) { o.r = o.p; o.s = o.q; }
        if (!o.q || !o.s || o.p < 1 || o.r < 1 || gcd(o.p, o.q) !== 1 || gcd(o.r, o.s) !== 1) continue;
        var b = o.p * o.s + o.q * o.r; if (!b && !sp.b0) continue;
        if (o.p === o.r && o.q === o.s && !sp.square) continue;
        o.a = o.p * o.r; o.b = b; o.c = o.q * o.s; o.ac = o.a * o.c;
        if (sp.test && !sp.test(o)) continue;
        var T = U.Tri({ p: o.p, q: o.q, r: o.r, s: o.s, v: extra.v, w: extra.w, k: typeof extra.k === 'function' ? extra.k(o) : extra.k, gv: extra.gv });
        if (bad[U.normKey(T)]) continue;
        return T;
      }
      throw new Error((lid || LID) + ': no trinomial found');
    };
  };

  /* ---------------- solution lines in the booklet's method ---------------- */
  function splitTex(T) { var w = T.Wv; return P.seq([P.mul(M(T.a), P.pow(T.Uv, 2)), P.mul(M(T.m), T.Uv, w), P.mul(M(T.n), T.Uv, w), P.mul(M(T.c), P.pow(w, 2))]); }
  function groupTex(T) {
    var g1 = P.scale(T.Uv, T.p), g2 = P.scale(T.Wv, T.q), b2 = br(T.F2), g2t = tx(g2);
    return tx(g1) + b2 + (g2t.charAt(0) === '-' ? '' : '+') + g2t + b2;
  }
  U.splitTex = splitTex; U.groupTex = groupTex;
  function altNeg(T) { // -(F1)(F2) with the minus taken into the bracket whose constant is negative, written in ascending order
    var negF1 = T.q < 0 || T.s > 0;
    var A = negF1 ? P.neg(T.F1) : T.F1, Bb = negF1 ? T.F2 : P.neg(T.F2);
    var rest = T.gtex === '-1' ? '' : tx(P.neg(T.G));
    return rest + '(' + tx(A, { order: 'asc', var: T.v }) + ')(' + tx(Bb, { order: 'asc', var: T.v }) + ')';
  }
  U.altNeg = altNeg;
  function kTex(T) { return tx(T.G); }
  function gcfLine(T, o) {
    var pre = o.asc ? 'In descending order, ' + t(T.asc + '=' + T.tex) + '.<br>' : '';
    if (T.g1) return pre;
    if (T.frac) return pre + 'Take out ' + t(kTex(T)) + ' (dividing each term by ' + t(kTex(T)) + '): ' + t(T.tex + '=' + T.gpre + '\\left(' + T.innerTex + '\\right)') + '.<br>';
    if (T.neg) return pre + 'The leading term is negative, so take out ' + t(T.gtex === '-1' ? '-1' : T.gtex) + ': ' + t(T.tex + '=' + T.gpre + '(' + T.innerTex + ')') + '.<br>';
    return pre + 'GCF first: ' + t(T.tex + '=' + T.gpre + '(' + T.innerTex + ')') + '.<br>';
  }
  U.pairLine = function (T) {
    if (T.monic) return 'Product ' + t(T.c) + ', sum ' + t(T.b) + ': ' + t(T.q + ',\\ ' + T.s) + '.' + (T.w ? ' The ' + t(T.w) + ' goes with the second term of each bracket.' : '');
    return t('ac=' + T.a + '(' + T.c + ')=' + T.ac) + ', sum ' + t(T.b) + ': ' + t(T.m + ',\\ ' + T.n) + '.';
  };
  function sqT(m) { var s = tx(m); return /^([0-9]+|[a-z])$/.test(s) ? s + '^{2}' : '(' + s + ')^{2}'; }
  U.sol = function (T, o) {
    o = o || {};
    var L = gcfLine(T, o), inner = T.innerTex, res;
    if (T.sq && o.ps) {
      var A = P.scale(T.Uv, T.p), Bb = P.scale(T.Wv, Math.abs(T.q));
      L += 'First and last terms: ' + t(sqT(A)) + ' and ' + t(sqT(Bb)) + '; ' + t('2(' + tx(A) + ')(' + tx(Bb) + ')=' + tx(P.mul(M(2), A, Bb))) + ' ✓ (sign ' + (T.q < 0 ? t('-') : t('+')) + ').<br>';
      res = '(' + (o.asc ? tx(T.F1, { order: 'asc', var: T.v }) : tx(T.F1)) + ')^{2}';
    } else if (T.monic) {
      L += (T.g1 ? '' : 'For ' + t(inner) + ': ') + U.pairLine(T) + '<br>';
      res = '(' + tx(T.F1) + ')(' + tx(T.F2) + ')';
    } else {
      L += (T.g1 ? '' : 'For ' + t(inner) + ': ') + U.pairLine(T) + '<br>' + t(inner + '=' + splitTex(T)) + '<br>' + t('=' + groupTex(T)) + '<br>';
      res = br(T.F2) + br(T.F1);
    }
    var whole = T.g1 ? res : T.gpre + res;
    L += 'So ' + t((o.asc ? T.asc : T.tex) + '=' + whole);
    if (T.neg && T.gtex === '-1' && !T.sq) L += ', or ' + t(altNeg(T));
    return L + '.' + (o.check ? '<br>Check: expand ' + t(whole) + ' to get back ' + t(T.tex) + ' ✓' : '');
  };
  U.hints = function (T, o) {
    o = o || {};
    var h = [];
    if (o.asc) h.push('Rewrite it in descending order first: ' + t(T.tex) + '.');
    if (!T.g1) h.push(T.frac ? 'Take out ' + t(kTex(T)) + ' first so the bracket has whole-number coefficients.' : T.neg ? 'The leading term is negative: take out ' + t(T.gtex === '-1' ? '-1' : T.gtex) + ' first.' : 'Every term has a common factor of ' + t(T.gtex) + '. Take it out first.');
    if (T.sq && o.ps) h.push('Are the first and last terms perfect squares ' + t('A^{2}') + ' and ' + t('B^{2}') + '? Is the middle term ' + t('\\pm 2AB') + '?');
    else if (T.monic) h.push('Find two integers with product ' + t(T.c) + ' and sum ' + t(T.b) + '. ' + signHint(T.b, T.c));
    else h.push('Find two integers with product ' + t('ac=' + T.ac) + ' and sum ' + t(T.b) + ', split the middle term with them, then group.');
    if (h.length < 2 && T.w) h.push('Each bracket has the form ' + t('(' + (T.p === 1 ? '' : T.p) + T.v + '+\\square\\,' + T.w + ')') + '.');
    if (h.length < 2) h.push('Check by expanding: the outside and inside products must add to the middle term.');
    return h.slice(0, 2);
  };

  /* ---------------- classic wrong factorizations ---------------- */
  function coefRel(S, m) { var tm = P.terms(m)[0], c = P.coef(S, tm.v); return (c[0] * tm.c[1]) / (c[1] * tm.c[0]); }
  U.pairDiag = function (T) { // a = 1: read the student's two numbers from the product of their factors
    if (!T.monic) return null;
    var m2 = P.mul(T.G, P.pow(T.Uv, 2)), m1 = P.mul(T.G, T.Uv, T.Wv), m0 = P.mul(T.G, P.pow(T.Wv, 2));
    var b = T.b, c = T.c, inside = T.g1 ? '' : ' (inside the bracket)';
    return function (S) {
      var L = coefRel(S, m2), Mm = coefRel(S, m1), C = coefRel(S, m0);
      if (L !== 1 || Mm % 1 || C % 1) return null;
      if (!P.eq(S, P.add(m2, P.scale(m1, Mm), P.scale(m0, C)))) return null;
      var pre = 'Your factors multiply to ' + t(tx(S)) + ', not ' + t(T.tex) + '. ';
      if (C === c && Mm === -b) return { code: 'pair-signs', hint: pre + 'Your numbers multiply to ' + t(c) + ' but add to ' + t(-b) + ', not ' + t(b) + ': the signs are backwards. ' + signHint(b, c) };
      if (Mm === c && C === b && b !== c) return { code: 'swap-bc', hint: pre + 'Your numbers multiply to ' + t(b) + ' and add to ' + t(c) + ' — the wrong way round. They must <b>multiply to</b> ' + t(c) + ' and <b>add to</b> ' + t(b) + inside + '.' };
      if (C === c) return { code: 'pair-sum', hint: pre + 'Your numbers multiply to ' + t(c) + ' ✓ but add to ' + t(Mm) + ', not ' + t(b) + '. Try another factor pair of ' + t(Math.abs(c)) + '.' };
      if (Mm === b && C === -c) return { code: 'pair-signs', hint: pre + 'Your numbers add to ' + t(b) + ' ✓ but multiply to ' + t(-c) + ', not ' + t(c) + '. ' + (c > 0 ? 'A positive product needs two numbers with the <b>same</b> sign.' : 'A negative product needs one positive and one negative number.') };
      if (Mm === b) return { code: 'pair-product', hint: pre + 'Your numbers add to ' + t(b) + ' ✓ but multiply to ' + t(C) + ', not ' + t(c) + '. The last terms of the brackets must multiply to ' + t(c) + inside + '.' };
      if (C === -c) return { code: 'pair-signs', hint: pre + 'Your numbers multiply to ' + t(C) + ', not ' + t(c) + '. ' + (c > 0 ? 'A positive product needs two numbers with the <b>same</b> sign.' : 'A negative product needs one positive and one negative number.') };
      return null;
    };
  };
  U.wrongs = function (T) {
    var out = [], seen = [T.full], v = T.v, w = T.w, G = T.G;
    function add(fs, code, hint) {
      var pr = mulAll(fs);
      if (P.isZero(pr) || seen.some(function (x) { return P.eq(x, pr); })) return;
      seen.push(pr); out.push({ is: pr, code: code, hint: hint(t(tx(pr))), tex: FX.tex(fs) });
    }
    var F1n = lin(T.p, -T.q, v, w), F2n = lin(T.r, -T.s, v, w);
    add([G, F1n, F2n], T.monic ? 'pair-signs' : 'ax-sign-swap', function (Pp) { return 'Your factors multiply to ' + Pp + ': the middle term has the wrong sign. Change the sign of the last term in <b>both</b> brackets.'; });
    if (!T.monic) {
      add([G, lin(T.p, T.s, v, w), lin(T.r, T.q, v, w)], 'ax-const-swap', function (Pp) { return 'Your factors multiply to ' + Pp + '. The first and last terms are right but the middle term isn’t: the last terms are in the wrong brackets. Split the middle term and group to place them.'; });
      add([G, lin(1, T.m, v, w), lin(1, T.n, v, w)], 'ax-pair-as-factors', function (Pp) { return 'Your factors multiply to ' + Pp + '. Writing the pair straight into the brackets only works when ' + t('a=1') + '. Use the pair to <b>split the middle term</b>, then group.'; });
      add([G, lin(T.a, T.m, v, w), lin(T.a, T.n, v, w)], 'ax-no-divide', function (Pp) { return 'Your factors multiply to ' + Pp + ', which is ' + t(T.a) + ' times too big. Split the middle term with the pair and group instead.'; });
    }
    if (!T.g1) {
      var lostNeg = T.neg && T.gtex === '-1';
      add([T.F1, T.F2], lostNeg ? 'ax-lost-negative' : 'gcf-dropped', function (Pp) {
        return lostNeg ? 'Your factors multiply to ' + Pp + ' — the opposite of the expression. Keep the ' + t('-') + ' you took out in front of the brackets (or put it into one bracket).'
          : 'Your brackets are right, but the common factor ' + t(T.gtex) + ' is missing: your factors multiply to ' + Pp + '.';
      });
      if (T.neg && !lostNeg) add([P.neg(G), T.F1, T.F2], 'ax-gcf-sign', function (Pp) { return 'Your factors multiply to ' + Pp + ' — the opposite of the expression. The leading term is negative, so the common factor is ' + t(T.gtex) + '.'; });
      var gvars = Object.keys(T.gv).length, kn = T.k[0] / T.k[1];
      if (gvars && Math.abs(kn) !== 1) add([N(kn), T.F1, T.F2], 'gcf-part', function () { return 'Take out the <b>whole</b> common factor: every term also has a factor of ' + t(P.monoTex(T.gv)) + '. The GCF is ' + t(T.gtex) + '.'; });
      if (gvars) add([M(T.k[0] < 0 ? -1 : 1, T.gv), T.F1, T.F2], 'gcf-part', function () { return 'Take out the <b>whole</b> common factor: the number ' + t(Math.abs(T.k[0])) + ' divides every coefficient too. The GCF is ' + t(T.gtex) + '.'; });
    }
    if (w) {
      var yh = 'Each bracket needs its own ' + t(w) + ': the last term ' + t(tx(P.mul(M(T.c), P.pow(T.Wv, 2)))) + ' comes from multiplying the two last terms.';
      add([G, lin(T.p, T.q, v), lin(T.r, T.s, v, w)], 'y-missing', function () { return yh; });
      add([G, lin(T.p, T.q, v, w), lin(T.r, T.s, v)], 'y-missing', function () { return yh; });
      add([G, lin(T.p, T.q, v), lin(T.r, T.s, v)], 'y-missing', function () { return yh; });
    }
    return out;
  };

  /* "factor (fully)" */
  function monoSign(sp) { // sign of the monomial factors the student wrote in front (−1 from a leading minus included)
    return sp.factors.reduce(function (s, f) { if (P.count(f.p) !== 1) return s; var c = P.terms(f.p)[0].c[0]; return c < 0 ? -s : s; }, 1);
  }
  function fracInside(sp) { return sp.factors.some(function (f) { return P.count(f.p) > 1 && P.terms(f.p).some(function (x) { return x.c[1] !== 1; }); }); }
  U.wrapForm = function (check, o) { // extra form rules on top of K.factored
    if (!o.intBrackets && !o.negGcf) return check;
    return function (resp) {
      var res = check(resp); if (res.v !== 'correct') return res;
      var a = K.read(resp); if (a.res) return res;
      var sp = FX.split(a.ast); if (!sp.ok) return res;
      if (o.intBrackets && fracInside(sp)) return form('u4-frac-bracket', 'Equal, but take the fraction (or decimal) out in front so each bracket has whole-number coefficients.');
      if (o.negGcf && monoSign(sp) > 0) return form('u4-neg-gcf', 'Equal, but the question asks you to take out a <b>negative</b> common factor, so the first term in the bracket is positive.');
      return res;
    };
  };
  U.facPart = function (T, o) {
    o = o || {};
    var W = U.wrongs(T).concat(o.wrong || []).filter(function (x) { return !P.eq(x.is, T.full); });
    var vs = P.vars(T.full); if (!vs.length) vs = [T.v];
    var keyTex = o.keyTex || (T.sq && o.asc ? (T.g1 ? '' : T.gpre) + '(' + tx(T.F1, { order: 'asc', var: T.v }) + ')^{2}' : T.key);
    var p = B.factored(o.prompt || t(o.asc ? T.asc : T.tex), T.list, { wrong: W, diag: U.pairDiag(T), keyTex: keyTex, vars: vs },
      o.sol || U.sol(T, o), o.hints || U.hints(T, o), o.text || 'factor ' + (o.asc ? T.asc : T.tex));
    p.check = U.wrapForm(p.check, o);
    p.bad = W.map(function (x) { return x.tex; }).concat(o.bad || []);
    p.good = [];
    if (!T.sq) p.good.push((T.g1 ? '' : T.gpre) + br(T.F2) + br(T.F1));
    else p.good.push((T.g1 ? '' : T.gpre) + br(T.F1) + br(T.F1));
    if (T.neg && T.gtex === '-1' && !T.sq) { var al = altNeg(T); p.good.push(al); p.answer = t(keyTex) + ' or ' + t(al); }
    return p;
  };

  /* ---------------- "factor where possible": one box with a none key ---------------- */
  function noneField(vars) { return [{ name: 'Factored form', label: 'Factored form', mode: 'math', keys: 'poly', vars: vars, none: true, wide: true, placeholder: 'e.g. (x - 4)(x + 2)' }]; }
  function noneVal(resp) { var v = String((Array.isArray(resp) ? resp[0] : resp) || '').trim(); return /^\\(text|mathrm)\{\s*none\s*\}$/i.test(v) ? 'none' : v; }
  var NONE_EMPTY = 'Type the factored form, or press <b>none</b> if it can’t be factored over the integers.';
  U.noneField = noneField; U.noneVal = noneVal;
  U.canPart = function (T, o) {
    o = o || {};
    var base = U.facPart(T, o), chk = base.check, vs = P.vars(T.full);
    var what = T.monic ? 'product ' + t(T.c) : 'product ' + t('ac=' + T.ac);
    return { prompt: base.prompt, input: { type: 'fields', fields: noneField(vs.length ? vs : [T.v]) }, key: [base.key], answer: base.answer, solution: base.solution, hints: base.hints, text: base.text,
      check: function (resp) {
        var v = noneVal(resp);
        if (!v) return form('empty', NONE_EMPTY);
        if (/^none$/i.test(v)) return wrong('u4-said-none', 'It <b>can</b> be factored: there is a pair of integers with ' + what + ' and sum ' + t(T.b) + '. Go through the factor pairs again. ' + signHint(T.b, T.monic ? T.c : T.ac));
        return chk(v);
      },
      good: base.good.map(function (g) { return [g]; }), bad: [['none']].concat(base.bad.map(function (b) { return [b]; })) };
  };
  /* o = { v, a (default 1), b, c, prompt, text } — a trinomial with no integer pair */
  U.nonePart = function (o) {
    var v = o.v || 'x', a = o.a || 1, Tt = P.add(P.mul(M(a), V(v, 2)), P.scale(V(v), o.b), N(o.c)), ac = a * o.c, sp = signedPairs(ac);
    if (factorable(a, o.b, o.c)) throw new Error('nonePart: it factors');
    var sol = 'Need two integers with product ' + t(a === 1 ? String(ac) : 'ac=' + ac) + ' and sum ' + t(o.b) + '.<br>Pairs: ' + sp.map(function (pq) { return t(pq[0] + ',\\ ' + pq[1]) + ' (sum ' + t(pq[0] + pq[1]) + ')'; }).join('; ') + '.<br>No pair has sum ' + t(o.b) + ', so ' + t(tx(Tt)) + ' <b>does not factor</b> over the integers.';
    var near = sp.slice().sort(function (x, y) { return Math.abs(x[0] + x[1] - o.b) - Math.abs(y[0] + y[1] - o.b); })[0];
    return { prompt: o.prompt || t(tx(Tt)), input: { type: 'fields', fields: noneField([v]) }, key: ['none'], answer: 'It does not factor over the integers.', solution: sol,
      hints: ['List every pair of integers with product ' + t(ac) + ' and add each pair. Is any sum equal to ' + t(o.b) + '?', 'If no pair works, the trinomial does not factor over the integers — press <b>none</b>.'], text: o.text || 'factor where possible ' + tx(Tt) + ' (none)',
      check: function (resp) {
        var s = noneVal(resp);
        if (!s) return form('empty', NONE_EMPTY);
        if (/^none$/i.test(s)) return ok();
        var r = K.read(s); if (r.res) return r.res;
        var spl = FX.split(r.ast); if (!spl.ok) return wrong('value', null);
        var S = spl.factors.reduce(function (acc, f) { return P.mul(acc, P.pow(f.p, f.k)); }, N(1));
        if (P.eq(S, Tt)) return form('u4-use-none', 'That is the trinomial itself. If no pair of integers works, press <b>none</b>.');
        return wrong('u4-no-pair', 'Your factors multiply to ' + t(tx(S)) + ', not ' + t(tx(Tt)) + '. Test every pair of integers with product ' + t(ac) + ': does any pair add to ' + t(o.b) + '?');
      },
      bad: [[a === 1 ? '(' + tx(lin(1, near[0], v)) + ')(' + tx(lin(1, near[1], v)) + ')' : '(' + tx(lin(a, near[0], v)) + ')(' + tx(lin(1, near[1], v)) + ')'], [tx(Tt)]] };
  };
  /* a random trinomial x² + bx + c (or ax² + bx + c) that does not factor; test(o) filters */
  U.noneTri = function (r, sp) {
    return pickWhere(function () { return { a: val(r, sp.a || 1), b: val(r, sp.b), c: val(r, sp.c) }; },
      function (o) { return o.b && o.c && !factorable(o.a, o.b, o.c) && gcd(gcd(o.a, o.b), o.c) === 1 && (!sp.test || sp.test(o)); });
  };

  /* ---------------- take out the GCF ---------------- */
  /* G: monomial; inner: primitive polynomial; o.order: list of term indexes (descending order of the full polynomial) for the
     prompt; o.negGcf: the question asks for a negative factor */
  U.gcfPart = function (G, inner, o) {
    o = o || {};
    var full = P.mul(G, inner), ts = P.sorted(full), vs = P.vars(full);
    var shown = o.order ? P.seq(o.order.map(function (i) { return P.mono(ts[i].c, ts[i].v); })) : tx(full);
    var Gt = tx(G), W = [];
    var its = P.sorted(inner);
    its.forEach(function (x, i) { // a term that equals ±G leaves ±1, not 0
      if (P.count(P.mono(x.c, x.v)) && !Object.keys(x.v).length && Math.abs(x.c[0]) === 1 && x.c[1] === 1 && its.length > 1) {
        var rest = P.sub(inner, P.mono(x.c, x.v));
        W.push({ is: P.mul(G, rest), code: 'u4l1-lost-one', hint: 'One term is the GCF itself: dividing it by ' + t(Gt) + ' leaves ' + t(x.c[0] < 0 ? '-1' : '1') + ', not ' + t(0) + '. Expand your answer to check: you should get ' + t(tx(full)) + ' back.' });
      }
    });
    if (P.terms(G)[0].c[0] < 0 && its.length > 1) {
      var half = P.add(P.mono(its[0].c, its[0].v), P.neg(P.sub(inner, P.mono(its[0].c, its[0].v))));
      W.push({ is: P.mul(G, half), code: 'u4l1-neg-signs', hint: 'Taking out a negative factor changes the sign of <b>every</b> term inside the bracket. Expand your answer to check.' });
    }
    var sol = 'GCF ' + t('=' + Gt) + '. Divide each term by ' + t(Gt) + ':<br>' + t(shown + '=' + Gt.replace(/^-1$/, '-') + '(' + tx(inner) + ')') + (o.solExtra || '');
    var p = B.factored(o.prompt || t(shown), [G, inner], { gcfOnly: true, wrong: W, keyTex: (Gt === '-1' ? '-' : Gt) + '(' + tx(inner) + ')', vars: vs }, sol,
      o.hints || ['The GCF is the largest number that divides every coefficient, times the lowest power of each letter that is in <b>every</b> term.', P.terms(G)[0].c[0] < 0 ? 'Take out a negative factor: every sign inside the bracket changes.' : 'Check by expanding: ' + t('\\text{GCF}\\times(\\ldots)') + ' must give back every term.'], o.text || 'GCF of ' + shown);
    p.check = U.wrapForm(p.check, o);
    p.bad = W.map(function (x) { return tx(x.is); });
    return p;
  };
  HW.addCodes({ 'u4l1-lost-one': 'GCF term left 0 instead of 1', 'u4l1-neg-signs': 'Took out a negative factor without changing every sign' });
  HW.addPartial({ 'u4l1-lost-one': 's', 'u4l1-neg-signs': 's' });

  /* ---------------- factor by grouping: (C + D)(A + B) ---------------- */
  U.groupPart = function (A, Bm, C, D, o) {
    o = o || {};
    var F1 = P.add(A, Bm), F2 = P.add(C, D), ts = [P.mul(A, C), P.mul(A, D), P.mul(Bm, C), P.mul(Bm, D)];
    var order = o.order || [0, 1, 2, 3], shown = P.seq(order.map(function (i) { return ts[i]; })), nat = P.seq(ts);
    var full = mulAll(ts.length ? [F1, F2] : []), vs = P.vars(full);
    var b2 = '(' + (o.f2tex || tx(F2)) + ')', bt = tx(Bm), keyTex = o.keyTex || b2 + '(' + (o.f1tex || tx(F1)) + ')';
    var sol = (order.join() !== '0,1,2,3' ? 'The pairs as written share no common factor. Rearrange: ' + t(nat) + '.<br>' : '') +
      t((order.join() !== '0,1,2,3' ? nat : shown) + '=' + tx(A) + b2 + (bt.charAt(0) === '-' ? '' : '+') + bt + b2) + '<br>' + t('=' + keyTex);
    var Wr = [{ is: P.mul(F2, P.sub(A, Bm)), code: 'u4-group-sign', hint: 'Check the sign of the factor you took out of the second pair: expand your answer and compare it term by term. When the second pair starts with a minus, take out a <b>negative</b> factor so the brackets match.' }];
    var p = B.factored(o.prompt || t(shown), [F2, F1], { wrong: Wr, keyTex: keyTex, vars: vs }, o.sol || sol,
      o.hints || [(order.join() !== '0,1,2,3' ? 'Rearrange the terms so each pair has a common factor. ' : '') + 'Group the terms in pairs and take the GCF out of each pair.', 'The two brackets must match. If they don’t, take a negative factor out of the second pair.'], o.text || 'group ' + shown);
    p.bad = [FX.tex([F2, P.sub(A, Bm)])];
    p.good = ['(' + tx(F1) + ')' + b2];
    return p;
  };

  /* ---------------- two expressions in either order ---------------- */
  U.polyBox = function (label, vars) { return { name: label, label: label, mode: 'math', keys: 'poly', vars: vars || ['x'], wide: true }; };
  U.eitherOrder = function (cs, labels) {
    return function (resp) {
      resp = resp || [];
      var r0 = String(resp[0] || '').trim(), r1 = String(resp[1] || '').trim();
      if (!r0 || !r1) return form('empty', 'Fill in both boxes.');
      var a0 = cs[0](r0), b1 = cs[1](r1), b0 = cs[1](r0), a1 = cs[0](r1);
      if (a0.v === 'correct' && b1.v === 'correct') return ok();
      if (b0.v === 'correct' && a1.v === 'correct') return ok();
      function lab(i, res) { return { v: res.v, code: res.v === 'wrong' ? 'u4-either' : res.code, hint: '<b>' + labels[i] + ':</b> ' + (res.hint || 'Check this one again.') }; }
      if (a0.v === 'correct') return lab(1, b1);
      if (b0.v === 'correct') return lab(1, a1);
      if (a1.v === 'correct') return lab(0, b0);
      if (b1.v === 'correct') return lab(0, a0);
      var r = a0.v === 'form' ? a0 : b0.v === 'form' ? b0 : a0;
      return { v: r.v, code: r.code, hint: '<b>' + labels[0] + ':</b> ' + (r.hint || 'Factor the area first: the two brackets are the length and the width.') };
    };
  };
  U.twoPolys = function (prompt, polys, labels, sol, hints, text, vars) {
    var cs = polys.map(function (q) { return K.poly(q); });
    return { prompt: prompt, input: { type: 'fields', fields: labels.map(function (l) { return U.polyBox(l, vars); }) }, check: U.eitherOrder(cs, labels), key: polys.map(function (q) { return tx(q); }),
      answer: labels.map(function (l, i) { return l + ' ' + t(tx(polys[i])); }).join(', ') + ' (either way round)', solution: sol, hints: hints || [], text: text,
      good: [[tx(polys[1]), tx(polys[0])]], bad: [[tx(polys[0]), tx(polys[0])]] };
  };

  /* ---------------- "is L a factor of …?" as multiple choice ----------------
   * o = { full (poly), list (its factors), flip (a wrong factorization: the signs switched), L (the binomial), prompt, sol } */
  U.factorMC = function (r, o) {
    var Lt = tx(o.L), ft = FX.tex(o.list), fl = FX.tex(o.flip);
    var has = function (list) { return list.some(function (f) { var p = polyOf(f); return P.count(p) > 1 && P.eq(p, o.L); }); };
    var yes = has(o.list), flipYes = has(o.flip);
    function verdict(y, f) { return (y ? '<b>Yes</b>: ' : '<b>No</b>: ') + t(tx(o.full) + '=' + f) + ', so ' + t(Lt) + (y ? ' is a factor.' : ' is not a factor.'); }
    var opts = [{ html: verdict(yes, ft), right: true },
      { html: verdict(!yes, ft), why: 'The factoring is right — now read it: ' + (yes ? t(Lt) + ' is one of the factors.' : t(Lt) + ' is not one of the factors (a bracket with the opposite sign is a different factor).') },
      { html: verdict(flipYes, fl), why: 'Expand that factoring: it gives ' + t(tx(mulAll(o.flip))) + ', not ' + t(tx(o.full)) + '. Check the signs.' },
      { html: verdict(!flipYes, fl), why: 'Expand that factoring: it gives ' + t(tx(mulAll(o.flip))) + ', not ' + t(tx(o.full)) + '. Check the signs.' }];
    return B.mc(r, o.prompt || 'Is ' + t(Lt) + ' a factor of ' + t(tx(o.full)) + '?', opts, o.sol || (o.solPre || '') + t(tx(o.full) + '=' + ft) + '. ' + (yes ? 'Yes, ' + t(Lt) + ' is a factor.' : 'No, ' + t(Lt) + ' is not a factor.'),
      o.hints || ['Factor the polynomial fully first (GCF, then the trinomial or grouping).', 'Then see whether ' + t(Lt) + ' is one of the brackets.'], o.text || 'is ' + Lt + ' a factor?');
  };

  /* ---------------- number lists ("find all b") ---------------- */
  U.valuesPart = function (prompt, vals, v, sol, hints, text, diag) {
    var pos = vals.filter(function (x) { return x > 0; }).sort(function (a, b) { return a - b; }), sym = pos.length * 2 === vals.length && pos.every(function (x) { return vals.indexOf(-x) >= 0; });
    var keyTex = sym ? v + '=' + pos.map(function (x) { return '\\pm ' + x; }).join(',\\ ') : v + '=' + vals.slice().sort(function (a, b) { return a - b; }).join(',\\ ');
    return B.valueSet(prompt, vals, { v: v, keyTex: keyTex, diag: diag }, sol, hints, text);
  };

  /* ============================== Lesson 1 ============================== */
  var LET = ['x', 'y', 'a', 'n', 't', 'm', 'k', 'p', 'w', 'z'];
  var PAIRS2 = [['x', 'y'], ['a', 'b'], ['m', 'n'], ['p', 'q'], ['r', 's']];
  // examples and booklet questions of Lesson 1 (letters as x and y) — never generated
  var AVOID = ['x^2+13x+36', 'x^2-10x+21', 'x^2+2x-35', 'x^2-9x-36', 'x^2-7xy+12y^2', 'x^2+xy-20y^2', '4x^2-8x-60', '2x^3+14x^2+24x', '-x^2+2x+48', '5x^2y-15xy^2-50y^3',
    'x^2+11x+28', '2x^2-2x-24', 'x^2-x-12', 'x^2+8x+15', 'x^2-9x+14', 'x^2+4x-32', 'x^2-x-42', 'x^2-16x+63', 'x^2+19x+48', 'x^2+2x-63', 'x^2-20x+36', 'x^2+9xy+20y^2',
    'x^2-2xy-15y^2', 'x^2-13xy+40y^2', 'x^2+3xy-28y^2', '5x^2+10x-40', '2x^3-22x^2+48x', '-x^2-3x+54', '-x^2+3x+40', '4x^2y-4xy-80y', '3x^2y+3xy^2-18y^3', '2x^2-10x-28',
    'x^2+7x+12', 'x^2-x-20', 'x^2-2x-15', '3x^2+6x-24', 'x^2+x-6', 'x^2+14x+45', '2x^3+10x^2+12x', '2x^2-8x-42', '-x^2+4x+12', 'x^2+11x+18', 'x^2-12x+32', 'x^2+5x-36',
    'x^2-3x-54', 'x^2-15x+56', 'x^2+10xy+24y^2', 'x^2-6xy-27y^2', 'x^2-14xy+45y^2', '6x^2-6x-72', '3x^3+24x^2+45x', '-x^2+9x-20', '-x^2-5x+24', '2x^2y-16xy+30y',
    'x^4-2x^3-35x^2', 'x^2+3x-10', '4x^2-4x-8', 'x^2-4x-12', 'x^2+12x+32', '3x^2-3x-60', 'x^2-13x+36', 'x^2+5x+6', 'x^2+5x+8', 'x^2+x+3', 'x^2+4x+6', 'x^2-5x-7', 'x^2+6x+7'];
  var tri = U.triMaker(AVOID, LID);
  var BADNONE = { 'x^{2}+5x+8': 1, 'x^{2}+x+3': 1, 'x^{2}+4x+6': 1, 'x^{2}-5x-7': 1, 'x^{2}+6x+7': 1 };
  function noneOk(o) { return !BADNONE[tx(P.add(V('x', 2), P.scale(V('x'), o.b), N(o.c)))]; }
  function letter(r) { return r.pick(LET); }
  function pos(lo, hi) { return [lo, hi]; }
  function negr(lo, hi) { return [-hi, -lo]; }
  function mono(c, v) { return P.mono(c, v); }
  function vv(a, e, b, f) { var o = {}; if (a) o[a] = e; if (b) o[b] = (o[b] || 0) + f; return o; }

  /* Q1 / A1: GCF of a polynomial, built as G · inner (inner primitive) */
  function gcfMake(r, kind, v, w) {
    return pickWhere(function () {
      var g = r.pick([2, 3, 4, 5, 6, 7, 8, 9]), e = r.int(1, 3), cs, inner, G;
      if (kind === 'bin') { // 14a³ − 21a²: g·v^e (α v − β)
        var al = r.int(2, 5), be = r.int(2, 7);
        G = mono(g, vv(v, e)); inner = P.add(mono(al, vv(v, 1)), N(-be)); cs = [al, be];
      } else if (kind === 'xy3') { // 9x²y − 6xy² + 3xy: g·xy (α x − β y + 1)
        var a1 = r.int(2, 5), b1 = r.int(2, 5);
        G = mono(g, vv(v, 1, w, 1)); inner = P.add(mono(a1, vv(v, 1)), mono(-b1, vv(w, 1)), N(1)); cs = [a1, b1];
      } else if (kind === 'neg') { // −8p⁴ + 20p²: −g p² (α p² − β)
        var a2 = r.int(2, 5), b2 = r.int(3, 7);
        G = mono(-g, vv(v, 2)); inner = P.add(mono(a2, vv(v, 2)), N(-b2)); cs = [a2, b2];
      } else if (kind === 'big') { // 24m⁵n² − 16m³n³ + 40m²n⁴: g m² n² (α m³ − β m n + γ n²)
        var a3 = r.int(2, 5), b3 = r.int(2, 5), c3 = r.int(2, 7);
        G = mono(g, vv(v, 2, w, 2)); inner = P.add(mono(a3, vv(v, 3)), mono(-b3, vv(v, 1, w, 1)), mono(c3, vv(w, 2))); cs = [a3, b3, c3];
      } else if (kind === 'xy3b') { // 6a³b − 9a²b² + 12ab³: g ab (α a² − β ab + γ b²)
        var a4 = r.int(2, 5), b4 = r.int(2, 5), c4 = r.int(2, 5);
        G = mono(g, vv(v, 1, w, 1)); inner = P.add(mono(a4, vv(v, 2)), mono(-b4, vv(v, 1, w, 1)), mono(c4, vv(w, 2))); cs = [a4, b4, c4];
      } else { // negb: −10y³ − 25y² = −5y²(2y + 5)
        var a5 = r.int(2, 5), b5 = r.int(2, 7);
        G = mono(-g, vv(v, e + 1)); inner = P.add(mono(a5, vv(v, 1)), N(b5)); cs = [a5, b5];
      }
      return { G: G, inner: inner, cs: cs, g: g };
    }, function (o) { var gg = o.cs.reduce(function (s, x) { return gcd(s, x); }, 0); return gg === 1 && (kind !== 'xy3' || o.cs[0] !== o.cs[1]) && [tx(P.mul(o.G, o.inner))].every(function (s) { return ['14a^{3}-21a^{2}', '9x^{2}y-6xy^{2}+3xy', '-8p^{4}+20p^{2}', '12x^{3}-18x^{2}', '18x^{4}-27x^{3}', '6a^{3}b-9a^{2}b^{2}+12ab^{3}', '-10y^{3}-25y^{2}'].indexOf(s) < 0; }); });
  }

  /* Q2 / A1(d–f): a binomial common factor */
  function binA(r, v) { // α v(β v + γ) − δ(β v + γ) → (β v + γ)(α v − δ)
    var o = pickWhere(function () { return { al: r.int(2, 7), be: r.int(1, 3), ga: r.pick([-7, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 7]), de: r.int(2, 9), sgn: r.chance(0.7) ? -1 : 1 }; },
      function (o) { return gcd(o.be, o.ga) === 1 && gcd(o.al, o.de) === 1 && !(o.al === 5 && o.be === 2 && o.ga === 1 && o.de === 3) && !(o.al === 5 && o.be === 1 && o.ga === 6) && !(o.al === 4 && o.be === 1 && o.ga === -7 && o.de === 9); });
    var Bn = lin(o.be, o.ga, v), A = mono(o.al, vv(v, 1)), D = N(o.sgn * o.de), F = P.add(A, D);
    var shown = o.al + v + br(Bn) + (o.sgn < 0 ? '-' : '+') + o.de + br(Bn);
    var p = B.factored(t(shown), [Bn, F], { keyTex: br(Bn) + br(F), vars: [v], wrong: [{ is: P.mul(Bn, P.sub(A, D)), code: 'u4l1-bin-sign', hint: 'Keep the sign in front of ' + t(o.de) + ': it goes into the second bracket, ' + t(tx(F)) + '.' }] },
      'Common factor ' + t(br(Bn)) + ':<br>' + t(shown + '=' + br(Bn) + br(F)), ['Both terms contain the bracket ' + t(br(Bn)) + '. Take it out like a monomial.', 'What is left from each term goes in the second bracket, with its sign.'], 'binomial common factor ' + shown);
    p.good = [br(F) + br(Bn)]; p.bad = [br(Bn) + '(' + tx(P.sub(A, D)) + ')'];
    return p;
  }
  function binB(r, v, lin2) { // v(v − k) + (v − k) → (v − k)(v + 1), or 2y(3y + 1) + (3y + 1)
    var o = pickWhere(function () { return { al: lin2 ? r.int(2, 5) : 1, be: lin2 ? r.int(2, 5) : 1, k: r.pick([-9, -8, -7, -6, -5, -3, -2, 2, 3, 5, 6, 7, 8, 9]), sg: lin2 ? 1 : r.chance(0.75) ? 1 : -1 }; },
      function (o) { return gcd(o.be, o.k) === 1 && !(o.be === 1 && o.k === -4) && !(o.be === 2 && o.k === -1) && !(o.al === 3 && o.be === 2) && !(o.al === 2 && o.be === 3 && o.k === 1); });
    var Bn = lin(o.be, o.k, v), A = mono(o.al, vv(v, 1)), F = P.add(A, N(o.sg)), at = tx(A);
    var shown = at + br(Bn) + (o.sg > 0 ? '+' : '-') + br(Bn);
    var p = B.factored(t(shown), [Bn, F], { keyTex: br(Bn) + br(F), vars: [v], wrong: [{ is: P.mul(Bn, A), code: 'u4l1-hidden-one', hint: 'The second term is ' + t((o.sg > 0 ? '' : '-') + '1' + br(Bn)) + ': taking out ' + t(br(Bn)) + ' leaves ' + t(o.sg > 0 ? '1' : '-1') + ', not ' + t(0) + '.' }] },
      'The second term is ' + t((o.sg > 0 ? '' : '-') + '1' + br(Bn)) + ':<br>' + t(shown + '=' + br(Bn) + br(F)), ['Both terms contain ' + t(br(Bn)) + '.', 'The second term is ' + t((o.sg > 0 ? '' : '-') + '1\\cdot' + br(Bn)) + '.'], 'binomial common factor ' + shown);
    p.good = [br(F) + br(Bn)]; p.bad = [at + br(Bn)];
    return p;
  }
  function binOpp(r, v, flipOrder) { // c(v − k) − v(k − v) → (v − k)(v + c);  v(k − v) + c(v − k) → (v − k)(c − v)
    var o = pickWhere(function () { return { c: r.int(2, 9), k: r.int(2, 9), s: r.chance(0.6) ? -1 : 1 }; }, function (o) { return o.c !== o.k && !(o.c === 7 && o.k === 3) && !(o.c === 7 && o.k === 2) && !(o.c === 6 && o.k === 4); });
    if (flipOrder) o.s = 1;
    var A = lin(1, -o.k, v), Opp = lin(-1, o.k, v), oppTex = o.k + '-' + v;
    var F = o.s < 0 ? lin(1, o.c, v) : lin(-1, o.c, v); // c(v−k) − v(k−v) = (v−k)(c + v); c(v−k) + v(k−v) = (v−k)(c − v)
    var shown = flipOrder ? v + '(' + oppTex + ')+' + o.c + br(A) : o.c + br(A) + (o.s < 0 ? '-' : '+') + v + '(' + oppTex + ')';
    var Ft = o.s < 0 ? v + '+' + o.c : o.c + '-' + v, keyTex = br(A) + '(' + Ft + ')';
    var wr = P.mul(A, o.s < 0 ? lin(-1, o.c, v) : lin(1, o.c, v));
    var mid = (o.s < 0 ? '-' : '+') + v + '(' + oppTex + ')=' + (o.s < 0 ? '+' : '-') + v + br(A);
    var p = B.factored(t(shown), [A, F], { keyTex: keyTex, vars: [v], wrong: [{ is: wr, code: 'u4l1-opposite', hint: 'The brackets ' + t(br(A)) + ' and ' + t('(' + oppTex + ')') + ' are opposites, not the same. Write ' + t(oppTex + '=-' + br(A)) + ' first; the sign in front of ' + t(v) + ' changes.' }] },
      t(oppTex + '=-' + br(A)) + ', so ' + t(mid) + ':<br>' + t(shown + '=' + (flipOrder ? '-' + v + br(A) + '+' + o.c + br(A) : o.c + br(A) + (o.s < 0 ? '+' : '-') + v + br(A)) + '=' + keyTex),
      ['The brackets are opposites: ' + t(oppTex + '=-' + br(A)) + '.', 'Rewrite one term so both brackets match, then take the bracket out.'], 'opposite brackets ' + shown);
    p.bad = [FX.tex([A, o.s < 0 ? lin(-1, o.c, v) : lin(1, o.c, v)])];
    return p;
  }
  HW.addCodes({ 'u4l1-bin-sign': 'Lost the sign of the second term', 'u4l1-hidden-one': 'Left out the 1 from the second term', 'u4l1-opposite': 'Treated opposite brackets as the same', 'u4l1-gcf-out': 'Left the number common factor inside' });
  HW.addPartial({ 'u4l1-bin-sign': 's', 'u4l1-hidden-one': 's', 'u4l1-opposite': 's', 'u4l1-gcf-out': 's' });

  /* Q2(d): α x(x + k)² − β(x + k) → g(x + k)(α' x² + α' k x − β') */
  function binSq(r, v) {
    var o = pickWhere(function () { return { g: r.int(2, 4), a: r.pick([1, 1, 2]), b: r.int(1, 5), k: r.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 6]) }; },
      function (o) { return gcd(o.a, o.b) === 1 && !factorable(o.a, o.a * o.k, -o.b) && !(o.g === 2 && o.a === 1 && o.b === 3 && o.k === 5); });
    var Bn = lin(1, o.k, v), inner = P.add(mono(o.a, vv(v, 2)), mono(o.a * o.k, vv(v, 1)), N(-o.b)), al = o.g * o.a, be = o.g * o.b;
    var shown = (al === 1 ? '' : al) + v + br(Bn) + '^{2}-' + be + br(Bn);
    var keyTex = o.g + br(Bn) + '(' + tx(inner) + ')';
    var p = B.factored(t(shown), [N(o.g), Bn, inner], { keyTex: keyTex, vars: [v], wrong: [{ is: P.mul(Bn, inner), code: 'gcf-dropped', hint: 'The common factor is ' + t(o.g + br(Bn)) + ': both terms also share the number ' + t(o.g) + '. Your factors multiply to ' + t(tx(P.mul(Bn, inner))) + '.' }] },
      'GCF ' + t('=' + o.g + br(Bn)) + ':<br>' + t(shown + '=' + o.g + br(Bn) + '[' + (o.a === 1 ? '' : o.a) + v + br(Bn) + '-' + o.b + ']') + '<br>' + t('=' + keyTex),
      ['Both terms contain ' + t(br(Bn)) + ' <b>and</b> the number ' + t(o.g) + '. Take out ' + t(o.g + br(Bn)) + '.', 'Expand and simplify what is left in the square bracket.'], 'GCF with a bracket ' + shown);
    p.bad = [br(Bn) + '(' + tx(inner) + ')'];
    return p;
  }

  /* Q3 / A2: grouping */
  function groupMake(r, kind) {
    var o, v, w;
    if (kind === 'cubic') { // x³ + 2x² + 5x + 10 = (x + 2)(x² + 5)
      v = letter(r); o = pickWhere(function () { return { d: r.pick([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6]), b: r.pick([-7, -6, -5, -3, -2, 2, 3, 5, 6, 7]) }; }, function (o) { return !(o.d === 2 && o.b === 5) && !(o.d === -3 && o.b === 4) && !(o.d === 2 && o.b === 3) && !(o.d === -2 && o.b === 7) && !(o.d === 4 && o.b === -3); });
      return U.groupPart(mono(1, vv(v, 2)), N(o.b), mono(1, vv(v, 1)), N(o.d));
    }
    if (kind === 'neg2') { // 4ab + 12a − b − 3 = (b + 3)(4a − 1); 10xy + 5x − 6y − 3 = (2y + 1)(5x − 3)
      var pr = r.pick(PAIRS2); v = pr[0]; w = pr[1];
      o = pickWhere(function () { return { al: r.int(2, 6), be: r.int(1, 5), ga: r.int(1, 3), de: r.int(1, 7) }; }, function (o) { return gcd(o.ga, o.de) === 1 && gcd(o.al, o.be) === 1 && !(o.al === 4 && o.be === 1 && o.ga === 1 && o.de === 3) && !(o.al === 5 && o.be === 3 && o.ga === 2 && o.de === 1) && !(o.al === 3 && o.be === 2 && o.ga === 2 && o.de === 3); });
      return U.groupPart(mono(o.al, vv(v, 1)), N(-o.be), mono(o.ga, vv(w, 1)), N(o.de));
    }
    if (kind === 'split') { // 2x² − 6x + 5x − 15 = (x − 3)(2x + 5)
      v = letter(r); o = pickWhere(function () { return { al: r.int(2, 5), be: r.pick([-7, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 7]), d: r.pick([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6]) }; }, function (o) { return gcd(o.al, o.be) === 1 && !(o.al === 2 && o.be === 5 && o.d === -3) && o.al * o.d + o.be !== 0 && !(o.al === 3 && o.be === 4 && o.d === 2); });
      return U.groupPart(mono(o.al, vv(v, 1)), N(o.be), mono(1, vv(v, 1)), N(o.d));
    }
    if (kind === 'ab') { // ab − 3a + 7b − 21 = (b − 3)(a + 7)
      var p2 = r.pick(PAIRS2); v = p2[0]; w = p2[1];
      o = pickWhere(function () { return { d: r.pick([-8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8]), b: r.pick([-8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8]) }; }, function (o) { return !(o.d === -3 && o.b === 7) && !(o.d === -5 && o.b === -2) && Math.abs(o.d) !== Math.abs(o.b); });
      return U.groupPart(mono(1, vv(v, 1)), N(o.b), mono(1, vv(w, 1)), N(o.d));
    }
    // 'rearr': mn − 8 + 2n − 4m = (m + 2)(n − 4): shown AC, BD, AD, BC
    var p3 = r.pick(PAIRS2); v = p3[0]; w = p3[1];
    o = pickWhere(function () { return { d: r.pick([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6]), b: r.pick([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6]) }; }, function (o) { return Math.abs(o.d) !== Math.abs(o.b) && !(o.d === 2 && o.b === -4) && !(o.d === 3 && o.b === 5) && o.d * o.b < 0; });
    return U.groupPart(mono(1, vv(w, 1)), N(o.b), mono(1, vv(v, 1)), N(o.d), { order: [0, 3, 1, 2] });
  }

  /* trinomial parts */
  function fac(r, sp, ex, o) { return U.facPart(tri(r, sp, ex), o); }
  function can(r, sp, ex, o) { return U.canPart(tri(r, sp, ex), o); }
  function none(r, sp, v) { var o = U.noneTri(r, Object.assign({ test: noneOk }, sp)); return U.nonePart({ v: v, b: o.b, c: o.c }); }
  function two(r) { return r.pick(PAIRS2); }

  /* "is L a factor?" MC parts */
  function mcMonic(r, yes, v, Lval) {
    var T = tri(r, { q: [-9, 9], s: [-9, 9], test: function (o) {
      if (Math.abs(o.q) === Math.abs(o.s)) return false;
      if (Lval == null) return true;
      return yes ? o.q === -Lval || o.s === -Lval : (o.q === Lval || o.s === Lval) && o.q !== -Lval && o.s !== -Lval;
    } }, { v: v });
    var L = Lval != null ? lin(1, -Lval, v) : yes ? T.F1 : lin(1, -T.q, v);
    var flip = [lin(1, -T.q, v), lin(1, -T.s, v)];
    return U.factorMC(r, { full: T.full, list: [T.F1, T.F2], flip: flip, L: L, solPre: U.pairLine(T) + '<br>' });
  }
  function mcGcf(r, yes, v, Lval) {
    var k = r.int(2, 5);
    var T = tri(r, { q: [-8, 8], s: [-8, 8], test: function (o) { return Math.abs(o.q) !== Math.abs(o.s) && (Lval == null || o.q === -Lval || o.s === -Lval); } }, { v: v, k: k });
    var L = Lval != null ? lin(1, -Lval, v) : yes ? T.F1 : lin(1, -T.q, v);
    return U.factorMC(r, { full: T.full, list: T.list, flip: [N(k), lin(1, -T.q, v), lin(1, -T.s, v)], L: L, solPre: 'GCF first: ' + t(T.tex + '=' + T.gpre + '(' + T.innerTex + ')') + '. ' + U.pairLine(T) + '<br>' });
  }
  function mcGroup(r, yes, v, Lval) {
    var o = pickWhere(function () { return { d: Lval != null ? -Lval : r.pick([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6]), b: r.pick([2, 3, 5, 6, 7, 10, 11]) }; }, function (o) { return !(o.d === 2 && o.b === 3) && !(o.d === -2 && o.b === 7); });
    var F = lin(1, o.d, v), Q = P.add(V(v, 2), N(o.b)), full = P.mul(F, Q), L = yes || Lval != null ? F : lin(1, -o.d, v);
    return U.factorMC(r, { full: full, list: [F, Q], flip: [lin(1, -o.d, v), Q], L: L, solPre: 'Grouping: ' + t(tx(full) + '=' + v + '^{2}' + br(F) + '+' + o.b + br(F)) + '.<br>' });
  }

  /* MC with explanations (Q7b) */
  function aliBree(r, sh) {
    var A = sh.ali, Bt = sh.bree;
    return B.mc(r, 'Whose answer is factored fully?', [
      { html: '<b>Bree’s</b>: Ali’s factor ' + t(br(sh.aliBr)) + ' still has a common factor of ' + t(sh.k) + '.', right: true },
      { html: '<b>Ali’s</b>: both answers multiply out to the trinomial, so both are factored fully.', why: 'Equal is not the same as factored fully: ' + t(tx(sh.aliBr) + '=' + sh.k + br(sh.F2)) + ' can still be factored.' },
      { html: '<b>Ali’s</b>: it has only two factors, so it is simpler.', why: 'Fewer factors is not the test. Fully factored means no factor can be factored again — and ' + t(br(sh.aliBr)) + ' has a common factor.' },
      { html: '<b>Neither</b>: ' + t(br(sh.F1)) + ' can still be factored.', why: t(br(sh.F1)) + ' has no common factor (other than 1), so it cannot be factored again.' }],
      'Bree’s. Ali’s ' + t(A) + ' is equal to the trinomial, but ' + t(tx(sh.aliBr) + '=' + sh.k + br(sh.F2)) + ', so ' + t(A + '=' + Bt) + '. Take the GCF out <b>first</b> to factor fully.',
      ['Factored fully means no factor can be factored again.', 'Look inside each of Ali’s brackets for a common factor.'], 'whose answer is factored fully');
  }

  function rectShared(r) { // garden: area (x + P)(x + Q), P > Q
    return pickWhere(function () { var Q = r.int(2, 8), Pp = r.int(Q + 2, Q + 7); return { P: Pp, Q: Q, X: r.int(5, 15) }; }, function (o) { return !(o.P === 9 && o.Q === 5) && !(o.P === 7 && o.Q === 4) && !(o.P === 8 && o.Q === 4); });
  }

  var QUESTIONS = [
    { num: '1', section: 'Greatest common factor', stem: 'Factor by taking out the GCF.', parts: [
      { id: '1a', level: 'BEG', make: function (r) { var v = letter(r), o = gcfMake(r, 'bin', v); return U.gcfPart(o.G, o.inner); } },
      { id: '1b', level: 'BEG', make: function (r) { var pr = two(r), o = gcfMake(r, 'xy3', pr[0], pr[1]); return U.gcfPart(o.G, o.inner); } },
      { id: '1c', level: 'EMG', make: function (r) { var v = letter(r), o = gcfMake(r, 'neg', v); var p = U.gcfPart(o.G, o.inner, { negGcf: true }); p.prompt += ' (take out a negative factor)'; p.bad.push(tx(P.neg(o.G)) + '(' + tx(P.neg(o.inner)) + ')'); return p; } },
      { id: '1d', level: 'EMG', make: function (r) { var pr = two(r), o = gcfMake(r, 'big', pr[0], pr[1]); return U.gcfPart(o.G, o.inner); } }] },
    { num: '2', section: 'A binomial common factor', stem: 'Factor.', parts: [
      { id: '2a', level: 'BEG', make: function (r) { return binA(r, letter(r)); } },
      { id: '2b', level: 'EMG', make: function (r) { return binB(r, letter(r)); } },
      { id: '2c', level: 'PRG', make: function (r) { return binOpp(r, r.pick(['a', 'b', 'x', 'm', 'n', 'y'])); } },
      { id: '2d', level: 'ADV', make: function (r) { return binSq(r, letter(r)); } }] },
    { num: '3', section: 'Factoring by grouping', stem: 'Factor by grouping.', parts: [
      { id: '3a', level: 'EMG', make: function (r) { return groupMake(r, 'cubic'); } },
      { id: '3b', level: 'PRG', make: function (r) { return groupMake(r, 'neg2'); } },
      { id: '3c', level: 'EMG', make: function (r) { return groupMake(r, 'split'); } },
      { id: '3d', level: 'ADV', make: function (r) { return groupMake(r, 'rearr'); } }] },
    { num: '4', section: 'Factoring x² + bx + c', stem: 'Factor where possible. If a trinomial does not factor over the integers, press <b>none</b>.', parts: [
      { id: '4a', level: 'BEG', make: function (r) { return can(r, { q: pos(1, 6), s: pos(2, 9), test: function (o) { return o.q < o.s && o.c <= 40; } }, { v: 'x' }); } },
      { id: '4b', level: 'BEG', make: function (r) { return can(r, { q: negr(1, 5), s: negr(3, 9), test: function (o) { return o.q > o.s; } }, { v: letter(r) }); } },
      { id: '4c', level: 'BEG', make: function (r) { return can(r, { q: pos(4, 10), s: negr(2, 7), test: function (o) { return o.b > 0; } }, { v: letter(r) }); } },
      { id: '4d', level: 'EMG', make: function (r) { return can(r, { q: negr(4, 10), s: pos(3, 9), test: function (o) { return o.b >= -3 && o.b < 0; } }, { v: letter(r) }); } },
      { id: '4e', level: 'EMG', make: function (r) { return can(r, { q: negr(5, 9), s: negr(6, 12), test: function (o) { return o.q > o.s && o.c >= 40; } }, { v: letter(r) }); } },
      { id: '4f', level: 'EMG', make: function (r) { return can(r, { q: pos(2, 4), s: pos(10, 18), test: function (o) { return posPairs(o.c).length >= 4; } }, { v: letter(r) }); } },
      { id: '4g', level: 'EMG', make: function (r) { return can(r, { q: pos(6, 11), s: negr(5, 10), test: function (o) { return o.b > 0 && o.b <= 4; } }, { v: letter(r) }); } },
      { id: '4h', level: 'PRG', make: function (r) { return can(r, { q: negr(1, 3), s: negr(12, 20), test: function (o) { return posPairs(o.c).length >= 3; } }, { v: letter(r) }); } },
      { id: '4i', level: 'PRG', make: function (r) { return none(r, { b: [-5, 5], c: [2, 7] }, letter(r)); } }] },
    { num: '5', section: 'Two variables', stem: 'Factor.', parts: [
      { id: '5a', level: 'EMG', make: function (r) { var pr = two(r); return fac(r, { q: pos(2, 5), s: pos(3, 7), test: function (o) { return o.q < o.s; } }, { v: pr[0], w: pr[1] }); } },
      { id: '5b', level: 'PRG', make: function (r) { var pr = two(r); return fac(r, { q: negr(3, 7), s: pos(2, 5), test: function (o) { return o.b < 0; } }, { v: pr[0], w: pr[1] }); } },
      { id: '5c', level: 'PRG', make: function (r) { var pr = two(r); return fac(r, { q: negr(3, 6), s: negr(5, 9), test: function (o) { return o.q > o.s; } }, { v: pr[0], w: pr[1] }); } },
      { id: '5d', level: 'PRG', make: function (r) { var pr = two(r); return fac(r, { q: pos(4, 9), s: negr(2, 6), test: function (o) { return o.b > 0; } }, { v: pr[0], w: pr[1] }); } }] },
    { num: '6', section: 'Factor fully', stem: 'Factor fully.', parts: [
      { id: '6a', level: 'PRG', make: function (r) { return fac(r, { q: pos(2, 6), s: negr(1, 5), test: function (o) { return o.b > 0; } }, { k: r.int(2, 6) }); } },
      { id: '6b', level: 'PRG', make: function (r) { var v = letter(r), k = r.int(2, 4), gv = {}; gv[v] = 1; return fac(r, { q: negr(2, 5), s: negr(4, 9), test: function (o) { return o.q > o.s; } }, { v: v, k: k, gv: gv }); } },
      { id: '6c', level: 'PRG', make: function (r) { return fac(r, { q: pos(4, 10), s: negr(3, 8), test: function (o) { return o.b > 0; } }, { k: -1 }); } },
      { id: '6d', level: 'ADV', make: function (r) { return fac(r, { q: negr(4, 10), s: pos(2, 7), test: function (o) { return o.b !== 0; } }, { k: -1 }, { asc: true }); } },
      { id: '6e', level: 'PRG', make: function (r) { var pr = two(r), gv = {}; gv[pr[1]] = 1; return fac(r, { q: negr(3, 7), s: pos(2, 5), test: function (o) { return o.b !== 0; } }, { v: pr[0], k: r.int(2, 5), gv: gv }); } },
      { id: '6f', level: 'ADV', make: function (r) { var pr = two(r), gv = {}; gv[pr[1]] = 1; return fac(r, { q: pos(2, 5), s: negr(1, 4), test: function (o) { return o.b !== 0; } }, { v: pr[0], w: pr[1], k: r.int(2, 5), gv: gv }); } }] },
    { num: '7', section: 'Factored fully?',
      shared: function (r) {
        var o = pickWhere(function () { return { k: r.int(2, 5), q: r.pick([-9, -8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6]), s: r.pick([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8]) }; }, function (o) { return o.q * o.s < 0 && o.q + o.s !== 0 && !(o.k === 2 && o.q === -7 && o.s === 2); });
        var F1 = lin(1, o.q), F2 = lin(1, o.s), full = P.mul(N(o.k), F1, F2), aliBr = P.scale(F2, o.k);
        return { k: o.k, F1: F1, F2: F2, full: full, aliBr: aliBr, ali: br(aliBr) + br(F1), bree: o.k + br(F1) + br(F2) };
      },
      stem: function (sh) { return 'Two students factored ' + t(tx(sh.full)) + '. &nbsp;Ali wrote ' + t(sh.ali) + '. &nbsp;Bree wrote ' + t(sh.bree) + '.'; },
      parts: [
        { id: '7a', level: 'EMG', make: function (r, sh) {
          var p = B.poly('Expand Ali’s answer. (Is it equal to ' + t(tx(sh.full)) + '?)', sh.full, {}, t(sh.ali + '=' + P.seq([M(sh.k, { x: 2 }), M(sh.k * PL0(sh.F1), { x: 1 }), M(sh.k * PL0(sh.F2), { x: 1 }), N(sh.k * PL0(sh.F1) * PL0(sh.F2))]) + '=' + tx(sh.full)) + '. Yes, it is equal.',
            ['Multiply each term of the first bracket by each term of the second.', 'Collect the two ' + t('x') + '-terms.'], 'expand Ali’s answer');
          p.answer += ' — yes, it is equal.';
          return p;
        } },
        { id: '7b', level: 'PRG', make: function (r, sh) { return aliBree(r, sh); } }] },
    { num: '8', section: 'Does it factor?', stem: 'Factor the trinomials that can be factored over the integers. For the others press <b>none</b> (and check every pair).', parts: [
      { id: '8a', level: 'BEG', make: function (r) { return can(r, { q: pos(1, 5), s: pos(2, 7), test: function (o) { return o.q < o.s; } }); } },
      { id: '8b', level: 'PRG', make: function (r) { return none(r, { b: [2, 9], c: [4, 12] }, 'x'); } },
      { id: '8c', level: 'EMG', make: function (r) { return can(r, { q: negr(3, 8), s: pos(2, 7), test: function (o) { return o.b < 0; } }); } },
      { id: '8d', level: 'PRG', make: function (r) { return none(r, { b: [-9, -2], c: { of: [-5, -7, -11, -13, -3, -10, -14, -15] } }, 'x'); } }] },
    { num: '9', section: 'Finding b and c', parts: [
      { id: '9a', level: 'ADV', make: function (r) {
        var Nn = r.pick([6, 8, 12, 14, 18, 20, 21, 22, 26, 28, 33, 35]), vals = [];
        posPairs(Nn).forEach(function (pq) { vals.push(pq[0] + pq[1], -(pq[0] + pq[1])); });
        var posv = vals.filter(function (x) { return x > 0; });
        return U.valuesPart('Find all integers ' + t('b') + ' so that ' + t('x^{2}+bx+' + Nn) + ' can be factored.', vals, 'b',
          t('b') + ' is the sum of a pair of integers with product ' + t(Nn) + ':<br>' + posPairs(Nn).map(function (pq) { return t(pq[0] + '+' + pq[1] + '=' + (pq[0] + pq[1])) + ', ' + t('-' + pq[0] + '-' + pq[1] + '=-' + (pq[0] + pq[1])); }).join('; ') + '.<br>' + t('b=' + posv.map(function (x) { return '\\pm ' + x; }).join(',\\ ')),
          ['List every factor pair of ' + t(Nn) + ' — and the negative pairs too.', 'Each pair’s sum is a possible ' + t('b') + '.'], 'all b for x^2+bx+' + Nn,
          function (A, T) { var tp = T.filter(function (x) { return x > 0; }); if (A.length === tp.length && tp.every(function (x) { return A.indexOf(x) >= 0; })) return { code: 'u4l1-no-negatives', hint: 'Negative pairs work too: two negative numbers also multiply to ' + t(Nn) + '.' }; return null; });
      } },
      { id: '9b', level: 'MAS', make: function (r) {
        var Bb = r.pick([6, 7, 8, 10, 11, 12]), ks = [], lines = [];
        for (var m = 1; m <= Bb / 2; m++) { ks.push(m * (Bb - m)); lines.push(t(m + '+' + (Bb - m))); }
        return U.valuesPart('Find all positive integers ' + t('k') + ' so that ' + t('x^{2}+' + Bb + 'x+k') + ' can be factored.', ks, 'k',
          'We need two <b>positive</b> integers with sum ' + t(Bb) + ' (a positive ' + t('k') + ' with a positive sum): ' + lines.join(', ') + '.<br>' + t('k') + ' is their product: ' + t('k=' + ks.join(',\\ ')),
          ['The two numbers must add to ' + t(Bb) + ' and multiply to ' + t('k') + '.', 'For ' + t('k') + ' to be positive, both numbers are positive: list the pairs that add to ' + t(Bb) + '.'], 'all positive k for x^2+' + Bb + 'x+k',
          function (A) { if (A.some(function (x) { return x <= 0; })) return { code: 'u4l1-k-positive', hint: t('k') + ' has to be a positive integer, so leave out zero and negative values.' }; return null; });
      } }] },
    { num: '10', section: 'Is it a factor?', stem: 'Decide whether the binomial is a factor of the polynomial. Factor first.', parts: [
      { id: '10a', level: 'EMG', make: function (r) { return mcMonic(r, r.chance(0.7), 'x'); } },
      { id: '10b', level: 'PRG', make: function (r) { return mcGcf(r, r.chance(0.7), 'x'); } },
      { id: '10c', level: 'PRG', make: function (r) { return mcGroup(r, r.chance(0.75), 'x'); } },
      { id: '10d', level: 'EMG', make: function (r) { return mcMonic(r, r.chance(0.3), 'x'); } }] },
    { num: '11', section: 'Problem solving',
      shared: rectShared,
      stem: function (sh) { return 'A rectangular garden plot has an area of ' + t('(' + tx(P.mul(lin(1, sh.P), lin(1, sh.Q))) + ')\\ \\text{m}^{2}') + '.'; },
      parts: [
        { id: '11a', level: 'EMG', make: function (r, sh) {
          var L = lin(1, sh.P), W = lin(1, sh.Q), A = P.mul(L, W);
          return U.twoPolys('Factor to find expressions for the length and width.', [L, W], ['Length', 'Width'], t(tx(A) + '=' + br(L) + br(W)) + ' (product ' + t(sh.P * sh.Q) + ', sum ' + t(sh.P + sh.Q) + '). Length ' + t(tx(L)) + ', width ' + t(tx(W)) + '.',
            ['Factor the area: two integers with product ' + t(sh.P * sh.Q) + ' and sum ' + t(sh.P + sh.Q) + '.', 'The two brackets are the length and the width.'], 'garden dimensions');
        } },
        { id: '11b', level: 'EMG', make: function (r, sh) {
          var d = sh.P - sh.Q;
          return B.number('How much longer is the length than the width?', d, function (v) { if (v === sh.P + sh.Q) return { code: 'u4l1-added', hint: 'Subtract the width from the length, don’t add.' }; if (v === -d) return { code: 'sign', hint: 'Length minus width: the length is the longer side.' }; return null; },
            t(br(lin(1, sh.P)) + '-' + br(lin(1, sh.Q)) + '=' + d) + ' m', ['Factor first to get the length and the width.', 'Subtract: the ' + t('x') + ' terms cancel.'], 'length minus width', { after: 'm' });
        } },
        { id: '11c', level: 'PRG', make: function (r, sh) {
          var Pp = P.add(M(4, { x: 1 }), N(2 * (sh.P + sh.Q))), val0 = 4 * sh.X + 2 * (sh.P + sh.Q);
          var cP = K.poly(Pp, { wrong: [{ is: P.add(M(2, { x: 1 }), N(sh.P + sh.Q)), code: 'u4l1-half-perim', hint: 'That is length + width. The perimeter is ' + t('2l+2w') + '.' }] });
          var cV = K.number(val0, function (v) { if (v === val0 / 2) return { code: 'u4l1-half-perim', hint: 'That is half the perimeter.' }; if (v === (sh.X + sh.P) * (sh.X + sh.Q)) return { code: 'u4l1-area', hint: 'That is the area. The perimeter is the distance around.' }; return null; });
          return B.fields('Write and simplify an expression for the perimeter, then evaluate it when ' + t('x=' + sh.X) + '.', [U.polyBox('Perimeter (m)', ['x']), { name: 'Perimeter when x = ' + sh.X, label: 'When ' + t('x=' + sh.X) + ':', after: 'm' }], [cP, cV], [tx(Pp), String(val0)],
            t('P=' + tx(Pp)) + ' m; ' + t(val0) + ' m',
            t('P=2' + br(lin(1, sh.P)) + '+2' + br(lin(1, sh.Q)) + '=' + tx(Pp)) + '.<br>When ' + t('x=' + sh.X) + ': ' + t('4(' + sh.X + ')+' + 2 * (sh.P + sh.Q) + '=' + val0) + ' m (the plot is ' + t(sh.X + sh.P) + ' m by ' + t(sh.X + sh.Q) + ' m).',
            ['Perimeter ' + t('=2\\times\\text{length}+2\\times\\text{width}') + '.', 'Collect like terms, then substitute.'], 'garden perimeter');
        } }] },
    { num: '12',
      shared: function (r) { return pickWhere(function () { var q = r.int(1, 4); return { h: r.int(1, 3), p: q, q: r.int(q + 1, q + 4), X: r.int(3, 8) }; }, function (o) { return !(o.h === 2 && o.p === 2 && o.q === 3); }); },
      stem: function (sh) { var V0 = P.mul(M(sh.h, { x: 1 }), lin(1, sh.p), lin(1, sh.q)); return 'A box has a volume of ' + t('(' + tx(V0) + ')\\ \\text{cm}^{3}') + '. Its height is ' + t((sh.h === 1 ? '' : sh.h) + 'x') + ' cm.'; },
      parts: [
        { id: '12a', level: 'ADV', make: function (r, sh) {
          var V0 = P.mul(M(sh.h, { x: 1 }), lin(1, sh.p), lin(1, sh.q)), L = lin(1, sh.q), W = lin(1, sh.p), hx = (sh.h === 1 ? '' : sh.h) + 'x';
          return U.twoPolys('Find expressions for the length and width of its base.', [L, W], ['Length (cm)', 'Width (cm)'],
            t(tx(V0) + '=' + hx + '(' + tx(P.mul(L, W)) + ')=' + hx + br(W) + br(L)) + '. The height is ' + t(hx) + ', so the base is ' + t(br(L)) + ' cm by ' + t(br(W)) + ' cm.',
            ['Take out the GCF ' + t(hx) + ' first — that is the height.', 'Factor the trinomial left: its two brackets are the length and width of the base.'], 'box base');
        } },
        { id: '12b', level: 'ADV', make: function (r, sh) {
          var X = sh.X, l = X + sh.q, w = X + sh.p, h = sh.h * X;
          var cs = [K.number(l), K.number(w), K.number(h)];
          return { prompt: 'Find the box’s dimensions when ' + t('x=' + X) + '.', input: { type: 'fields', fields: [{ name: 'Length', label: 'Length', after: 'cm' }, { name: 'Width', label: 'Width', after: 'cm' }, { name: 'Height', label: 'Height', after: 'cm' }] },
            check: function (resp) {
              resp = resp || []; var a = U.eitherOrder([cs[0], cs[1]], ['Length', 'Width'])([resp[0], resp[1]]);
              var hc = cs[2](resp[2] == null ? '' : resp[2]);
              if (a.v !== 'correct') return a;
              if (hc.v !== 'correct') return { v: hc.v, code: hc.code, hint: '<b>Height:</b> ' + (hc.hint || 'The height is ' + t((sh.h === 1 ? '' : sh.h) + 'x') + '.') };
              return ok();
            },
            key: [String(l), String(w), String(h)], answer: t(l) + ' cm by ' + t(w) + ' cm by ' + t(h) + ' cm', solution: 'Base ' + t(br(lin(1, sh.q)) + '\\times' + br(lin(1, sh.p))) + ', height ' + t((sh.h === 1 ? '' : sh.h) + 'x') + '. When ' + t('x=' + X) + ': ' + t(l) + ' cm by ' + t(w) + ' cm by ' + t(h) + ' cm (volume ' + t(l * w * h) + ' cm³).',
            hints: ['Use the factors from (a) and the height.', 'Substitute ' + t('x=' + X) + ' into each factor.'], text: 'box dimensions', good: [[String(w), String(l), String(h)]], bad: [[String(l), String(l), String(h)], [String(l), String(w), String(h + 1)]] };
        } }] },
    { num: '13', section: 'Multiple choice and numerical response', parts: [
      { id: '13', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { k: r.int(2, 4), a: r.pick([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6]), b: r.pick([-9, -8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7]), g: r.pick([-7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7]) }; },
          function (o) { var s = [o.a, o.b, o.g, -o.a, -o.g]; return s.every(function (x, i) { return s.every(function (y, j) { return i === j || x !== y; }); }) && !(o.a === 3 && o.b === -7 && o.g === -2); });
        var T1 = P.mul(N(o.k), lin(1, o.a), lin(1, o.b)), T2 = P.mul(lin(1, o.a), lin(1, o.g));
        return B.mc(r, 'Which binomial is a factor of both ' + t(tx(T1)) + ' and ' + t(tx(T2)) + '?', [
          { html: t(tx(lin(1, o.a))), right: true },
          { html: t(tx(lin(1, o.b))), why: t(tx(lin(1, o.b))) + ' is a factor of the first one only. Factor the second one too.' },
          { html: t(tx(lin(1, -o.a))), why: 'Check the signs: factor both trinomials fully and compare the brackets.' },
          { html: t(tx(lin(1, -o.g))), why: 'Check the signs: ' + t(tx(T2) + '=' + br(lin(1, o.a)) + br(lin(1, o.g))) + '.' }],
          t(tx(T1) + '=' + o.k + br(lin(1, o.a)) + br(lin(1, o.b))) + ' and ' + t(tx(T2) + '=' + br(lin(1, o.a)) + br(lin(1, o.g))) + '. The common factor is ' + t(tx(lin(1, o.a))) + '.',
          ['Factor both fully (GCF first).', 'Which bracket appears in both?'], 'common binomial factor');
      } }] },
    { num: '14', parts: [
      { id: '14', level: 'PRG', make: function (r) {
        var C = r.pick([-18, -20, -24, -28, -30, -10, -15, -14, -21]), sums = {};
        posPairs(C).forEach(function (pq) { sums[pq[1] - pq[0]] = 1; sums[pq[0] - pq[1]] = 1; });
        var valid = Object.keys(sums).map(Number).filter(function (x) { return x !== 0; });
        var cand = posPairs(C).map(function (pq) { return pq[0] + pq[1]; }).concat([2, 3, 4, 5, 6, 7, 8, 9]).filter(function (x) { return !sums[x] && !sums[-x]; });
        var bad = r.pick(cand.slice(0, Math.max(2, Math.min(4, cand.length)))) * (r.chance(0.5) ? 1 : -1);
        var three = r.sample(valid, 3);
        var opts = three.map(function (k) { var pq = posPairs(C).filter(function (p) { return Math.abs(p[1] - p[0]) === Math.abs(k); })[0], u = k > 0 ? pq[1] : -pq[1], w = k > 0 ? -pq[0] : pq[0]; return { html: t(k), why: 'It does factor for ' + t('k=' + k) + ': ' + t(u + '\\times' + par(w) + '=' + C) + ' and ' + t(u + '+' + par(w) + '=' + k) + '.' }; });
        opts.push({ html: t(bad), right: true });
        return B.mc(r, 'The trinomial ' + t('x^{2}+kx' + C) + ' can be factored over the integers for each of these values of ' + t('k') + ' <b>except</b>', opts,
          'Pairs with product ' + t(C) + ' have sums ' + t(valid.filter(function (x) { return x > 0; }).sort(function (a, b) { return b - a; }).map(function (x) { return '\\pm' + x; }).join(',\\ ')) + '. No pair has sum ' + t(bad) + '.',
          ['List the pairs of integers with product ' + t(C) + ' (one positive, one negative) and their sums.', 'Which option is not one of those sums?'], 'which k fails');
      } }] },
    { num: '15', parts: [
      { id: '15', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { m: r.int(2, 9), n: r.int(1, 8) }; }, function (o) { return o.m !== o.n && o.m * o.n !== o.m && o.m * o.n !== o.n && !(o.m === 6 && o.n === 2) && !(o.m === 7 && o.n === 5) && o.m - o.n !== 0; });
        var C = o.m * o.n, Bc = o.m - o.n, shown = tx(P.add(N(C), M(Bc, { x: 1 }), M(-1, { x: 2 })), { order: 'asc' });
        return B.mc(r, 'One factor of ' + t(shown) + ' is', [
          { html: t('x-' + o.m), right: true },
          { html: t('x-' + o.n), why: 'Factor it: ' + t(shown + '=(' + o.m + '-x)(' + o.n + '+x)') + '. The second bracket is ' + t('x+' + o.n) + ', not ' + t('x-' + o.n) + '.' },
          { html: t('x+' + o.m), why: t(o.m + '-x=-(x-' + o.m + ')') + ', so the factor is ' + t('x-' + o.m) + ', not ' + t('x+' + o.m) + '.' },
          { html: t('x-' + C), why: t(C) + ' is the constant term, not a factor. Find two numbers with product ' + t(C) + '.' }],
          t(shown + '=(' + o.m + '-x)(' + o.n + '+x)=-(x-' + o.m + ')(x+' + o.n + ')') + ', so ' + t('x-' + o.m) + ' is a factor.',
          ['Factor it directly in ascending order, or take out ' + t('-1') + ' first.', t('a-x=-(x-a)') + ': a bracket like ' + t('(5-x)') + ' gives the factor ' + t('x-5') + '.'], 'one factor, ascending');
      } }] },
    { num: '16', parts: [
      { id: '16', level: 'MAS', make: function (r) {
        var C = r.pick([18, 20, 24, 28, 30, 32, 40, 42, 44, 45, 48, 50]), pr = posPairs(C), tot = pr.reduce(function (s, pq) { return s + pq[0] + pq[1]; }, 0);
        return B.nr('<i>(Numerical Response)</i> The trinomial ' + t('x^{2}+bx+' + C) + ', where ' + t('b') + ' is a positive integer, can be factored over the integers for several values of ' + t('b') + '. The sum of all these values of ' + t('b') + ' is ____.', tot,
          function (v) { if (v === 0) return { code: 'u4l1-no-negatives', hint: 'Only <b>positive</b> values of ' + t('b') + ' count, so use only the positive pairs.' }; var miss = pr.filter(function (pq) { return v === tot - pq[0] - pq[1]; })[0]; if (miss) return { code: 'u4l1-missed-pair', hint: 'You missed a pair: list every factor pair of ' + t(C) + ', from ' + t('1\\times' + C) + ' up.' }; return null; },
          'Positive pairs of ' + t(C) + ': ' + pr.map(function (pq) { return t(pq[0] + ',\\ ' + pq[1]); }).join('; ') + '. So ' + t('b=' + pr.map(function (pq) { return pq[0] + pq[1]; }).join(',\\ ')) + ' and the sum is ' + t(tot) + '.',
          ['' + t('b') + ' is the sum of a pair of positive integers with product ' + t(C) + '.', 'List every factor pair of ' + t(C) + ', add each pair, then add those sums.'], 'sum of all b');
      } }] }
  ];
  HW.addCodes({ 'u4l1-no-negatives': 'Forgot the negative pairs', 'u4l1-k-positive': 'Included a value that isn’t positive', 'u4l1-added': 'Added instead of subtracting', 'u4l1-half-perim': 'Gave length + width (half the perimeter)', 'u4l1-area': 'Gave the area instead of the perimeter', 'u4l1-missed-pair': 'Missed a factor pair' });
  HW.addPartial({ 'u4l1-no-negatives': 's', 'u4l1-half-perim': 's', 'u4l1-missed-pair': 's' });

  function PL0(F) { return P.constant(F)[0]; }

  var EXTRA = [
    { num: 'A1', section: 'A. Skills', stem: 'Factor.', parts: [
      { id: 'A1a', level: 'BEG', make: function (r) { var v = letter(r), o = gcfMake(r, 'bin', v); return U.gcfPart(o.G, o.inner); } },
      { id: 'A1b', level: 'EMG', make: function (r) { var pr = two(r), o = gcfMake(r, 'xy3b', pr[0], pr[1]); return U.gcfPart(o.G, o.inner); } },
      { id: 'A1c', level: 'EMG', make: function (r) { var v = letter(r), o = gcfMake(r, 'negb', v); return U.gcfPart(o.G, o.inner); } },
      { id: 'A1d', level: 'BEG', make: function (r) { return binA(r, letter(r)); } },
      { id: 'A1e', level: 'EMG', make: function (r) { return binB(r, letter(r), true); } },
      { id: 'A1f', level: 'PRG', make: function (r) { return binOpp(r, r.pick(['m', 'a', 'x', 'n', 'y']), true); } }] },
    { num: 'A2', stem: 'Factor by grouping.', parts: [
      { id: 'A2a', level: 'EMG', make: function (r) { return groupMake(r, 'cubic'); } },
      { id: 'A2b', level: 'PRG', make: function (r) { return groupMake(r, 'neg2'); } },
      { id: 'A2c', level: 'EMG', make: function (r) { return groupMake(r, 'ab'); } }] },
    { num: 'A3', stem: 'Factor where possible. If a trinomial does not factor over the integers, press <b>none</b>.', parts: [
      { id: 'A3a', level: 'BEG', make: function (r) { return can(r, { q: pos(1, 5), s: pos(3, 11), test: function (o) { return o.q < o.s; } }); } },
      { id: 'A3b', level: 'BEG', make: function (r) { return can(r, { q: negr(2, 6), s: negr(5, 10), test: function (o) { return o.q > o.s; } }); } },
      { id: 'A3c', level: 'BEG', make: function (r) { return can(r, { q: pos(5, 10), s: negr(2, 6), test: function (o) { return o.b > 0; } }); } },
      { id: 'A3d', level: 'EMG', make: function (r) { return can(r, { q: negr(5, 10), s: pos(3, 8), test: function (o) { return o.b < 0; } }); } },
      { id: 'A3e', level: 'EMG', make: function (r) { return can(r, { q: negr(5, 9), s: negr(6, 11), test: function (o) { return o.q > o.s && o.c >= 30; } }, { v: letter(r) }); } },
      { id: 'A3f', level: 'PRG', make: function (r) { return none(r, { b: [3, 9], c: { of: [5, 7, 11, 13, 3, 10] } }, 'x'); } }] },
    { num: 'A4', stem: 'Factor.', parts: [
      { id: 'A4a', level: 'EMG', make: function (r) { var pr = two(r); return fac(r, { q: pos(2, 6), s: pos(3, 8), test: function (o) { return o.q < o.s; } }, { v: pr[0], w: pr[1] }); } },
      { id: 'A4b', level: 'PRG', make: function (r) { var pr = two(r); return fac(r, { q: negr(4, 9), s: pos(2, 5), test: function (o) { return o.b < 0; } }, { v: pr[0], w: pr[1] }); } },
      { id: 'A4c', level: 'PRG', make: function (r) { var pr = two(r); return fac(r, { q: negr(3, 6), s: negr(6, 10), test: function (o) { return o.q > o.s; } }, { v: pr[0], w: pr[1] }); } }] },
    { num: 'B1', section: 'B. Applying', stem: 'Factor fully.', parts: [
      { id: 'B1a', level: 'PRG', make: function (r) { return fac(r, { q: negr(2, 6), s: pos(1, 5), test: function (o) { return o.b < 0; } }, { k: r.int(2, 7) }); } },
      { id: 'B1b', level: 'PRG', make: function (r) { var v = letter(r), gv = {}; gv[v] = 1; return fac(r, { q: pos(1, 5), s: pos(2, 7), test: function (o) { return o.q < o.s; } }, { v: v, k: r.int(2, 4), gv: gv }); } },
      { id: 'B1c', level: 'PRG', make: function (r) { return fac(r, { q: negr(2, 6), s: negr(3, 8), test: function (o) { return o.q > o.s; } }, { v: letter(r), k: -1 }); } },
      { id: 'B1d', level: 'ADV', make: function (r) { return fac(r, { q: pos(4, 10), s: negr(2, 6), test: function (o) { return o.b > 0; } }, { k: -1 }, { asc: true }); } },
      { id: 'B1e', level: 'PRG', make: function (r) { var pr = two(r), gv = {}; gv[pr[1]] = 1; return fac(r, { q: negr(2, 5), s: negr(3, 7), test: function (o) { return o.q > o.s; } }, { v: pr[0], k: r.int(2, 4), gv: gv }); } },
      { id: 'B1f', level: 'PRG', make: function (r) { var v = letter(r), gv = {}; gv[v] = 2; return fac(r, { q: negr(3, 9), s: pos(2, 7), test: function (o) { return o.b !== 0; } }, { v: v, gv: gv }); } }] },
    { num: 'B2', shared: function (r) { return { d: r.int(1, 5) }; }, stem: function (sh) { return 'Which of these polynomials have ' + t('x-' + sh.d) + ' as a factor? Factor each one first.'; }, parts: [
      { id: 'B2a', level: 'EMG', make: function (r, sh) { return mcMonic(r, true, 'x', sh.d); } },
      { id: 'B2b', level: 'PRG', make: function (r, sh) { return mcGcf(r, true, 'x', sh.d); } },
      { id: 'B2c', level: 'EMG', make: function (r, sh) { return mcMonic(r, false, 'x', sh.d); } },
      { id: 'B2d', level: 'PRG', make: function (r, sh) { return mcGroup(r, true, 'x', sh.d); } }] },
    { num: 'B3', shared: function (r) { return pickWhere(function () { var w = r.int(1, 6); return { w: w, l: r.int(w + 2, w + 8), Pm: 0 }; }, function (o) { return !(o.w === 4 && o.l === 8); }); },
      stem: function (sh) { return 'A rectangle has an area of ' + t('(' + tx(P.mul(lin(1, sh.w), lin(1, sh.l))) + ')\\ \\text{cm}^{2}') + ' and a width of ' + t('(' + tx(lin(1, sh.w)) + ')') + ' cm.'; },
      parts: [
        { id: 'B3a', level: 'EMG', make: function (r, sh) {
          var L = lin(1, sh.l), A = P.mul(lin(1, sh.w), L);
          return B.poly('Find an expression for its length.', L, { wrong: [{ is: lin(1, -sh.l), code: 'sign', hint: 'Check the sign: the two numbers multiply to ' + t(sh.w * sh.l) + ' and add to ' + t(sh.w + sh.l) + '.' }] },
            t(tx(A) + '=' + br(lin(1, sh.w)) + br(L)) + ', so the length is ' + t(br(L)) + ' cm.', ['Factor the area. One factor is the width ' + t(br(lin(1, sh.w))) + '.', 'Which number goes with ' + t(sh.w) + '? Product ' + t(sh.w * sh.l) + ', sum ' + t(sh.w + sh.l) + '.'], 'length from area');
        } },
        { id: 'B3b', level: 'PRG', make: function (r, sh) {
          var X = r.int(4, 14), Pm = 4 * X + 2 * (sh.w + sh.l), l = X + sh.l, w = X + sh.w;
          var cs = [K.number(X, function (v) { if (v === Pm / 4) return { code: 'u4l1-perim-eq', hint: 'Write the perimeter first: ' + t('2' + br(lin(1, sh.l)) + '+2' + br(lin(1, sh.w)) + '=' + Pm) + ', then solve.' }; return null; }), K.number(l), K.number(w)];
          var labels = ['x', 'Length', 'Width'];
          return B.fields('The perimeter is ' + t(Pm) + ' cm. Find ' + t('x') + ' and the rectangle’s dimensions.', [{ name: 'x', label: t('x=') }, { name: 'Length', label: 'Length', after: 'cm' }, { name: 'Width', label: 'Width', after: 'cm' }], cs, [String(X), String(l), String(w)],
            t('x=' + X) + '; ' + t(l) + ' cm by ' + t(w) + ' cm',
            t('2' + br(lin(1, sh.l)) + '+2' + br(lin(1, sh.w)) + '=' + Pm + '\\Rightarrow 4x+' + 2 * (sh.w + sh.l) + '=' + Pm + '\\Rightarrow x=' + X) + '.<br>The rectangle is ' + t(l) + ' cm by ' + t(w) + ' cm (area ' + t(l * w) + ' cm²).',
            ['Write the perimeter in terms of ' + t('x') + ' and set it equal to ' + t(Pm) + '.', 'Solve for ' + t('x') + ', then substitute into the length and the width.'], 'perimeter → x');
        } }] },
    { num: 'B4', parts: [
      { id: 'B4', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { k: r.int(2, 5), q: r.pick([-7, -6, -5, -4, -3, -2]), s: r.pick([2, 3, 4, 5, 6]) }; }, function (o) { return o.q + o.s !== 0 && !(o.k === 3 && o.q === -5 && o.s === 4); });
        var F1 = lin(1, o.q), F2 = lin(1, o.s), full = P.mul(N(o.k), F1, F2);
        return B.mc(r, 'The fully factored form of ' + t(tx(full)) + ' is', [
          { html: t(br(P.scale(F1, o.k)) + br(F2)), why: 'Equal to the trinomial, but ' + t(br(P.scale(F1, o.k))) + ' still has a common factor of ' + t(o.k) + '.' },
          { html: t(o.k + br(F1) + br(F2)), right: true },
          { html: t(o.k + br(lin(1, -o.q)) + br(lin(1, -o.s))), why: 'Expand it: the middle term has the wrong sign. The signs are reversed.' },
          { html: t(br(F1) + br(P.scale(F2, o.k))), why: 'Equal to the trinomial, but ' + t(br(P.scale(F2, o.k))) + ' still has a common factor of ' + t(o.k) + '.' }],
          t(tx(full) + '=' + o.k + '(' + tx(P.mul(F1, F2)) + ')=' + o.k + br(F1) + br(F2)) + '. Two of the others equal the trinomial but are not factored fully; one has the signs reversed.',
          ['Take out the GCF first.', 'Fully factored: no bracket has a common factor left.'], 'fully factored form');
      } }] },
    { num: 'B5', parts: [
      { id: 'B5', level: 'ADV', make: function (r) {
        var Bb = r.pick([6, 7, 9, 10, 11]), cs = [];
        for (var m = 1; m <= Bb / 2; m++) cs.push(m * (Bb - m));
        var tot = cs.reduce(function (s, x) { return s + x; }, 0);
        return B.nr('<i>(Numerical Response)</i> The trinomial ' + t('x^{2}+' + Bb + 'x+c') + ', where ' + t('c') + ' is a positive integer, can be factored over the integers for several values of ' + t('c') + '. The sum of all these values of ' + t('c') + ' is ____.', tot,
          function (v) { if (Bb % 2 === 0 && v === tot - Bb * Bb / 4) return { code: 'u4l1-missed-pair', hint: 'Don’t forget the pair ' + t(Bb / 2 + '+' + Bb / 2) + '.' }; return null; },
          'Positive integers with sum ' + t(Bb) + ': ' + cs.map(function (c, i) { return t((i + 1) + ',\\ ' + (Bb - i - 1)); }).join('; ') + '. So ' + t('c=' + cs.join(',\\ ')) + '; the sum is ' + t(tot) + '.',
          ['The two numbers must add to ' + t(Bb) + '; ' + t('c') + ' is their product.', 'Both must be positive for a positive ' + t('c') + '. List every pair that adds to ' + t(Bb) + '.'], 'sum of all c');
      } }] },
    { num: 'C1', section: 'C. Stretch', parts: [
      { id: 'C1', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { m: r.int(2, 8) * (r.chance(0.75) ? 1 : -1), u: r.pick([-12, -10, -9, -8, -7, -6, -5, -3, -2, 2, 3, 5, 6, 7, 8, 9, 10, 12]) }; }, function (o) { return o.m !== o.u && o.m !== -o.u && !(o.m === 4 && o.u === 9) && o.m + o.u !== 0; });
        var C = o.m * o.u, k = -(o.m + o.u), L = lin(1, -o.m), Ct = sg(C);
        return B.number('Find the value of ' + t('k') + ' so that ' + t(tx(L)) + ' is a factor of ' + t('x^{2}+kx' + Ct) + '.', k,
          function (v) { if (v === -k) return { code: 'sign', hint: 'Check the signs: write the other factor as ' + t('(x+n)') + ' with ' + t(par(-o.m) + 'n=' + C) + ', then ' + t('k') + ' is the sum ' + t(par(-o.m) + '+n') + '.' }; if (v === -o.u || v === o.u) return { code: 'u4l1-gave-n', hint: 'That is the number in the other bracket. ' + t('k') + ' is the coefficient of the middle term.' }; return null; },
          'The other factor is ' + t('x+n') + ' with ' + t(par(-o.m) + 'n=' + C) + ', so ' + t('n=' + (-o.u)) + ': ' + t(br(L) + br(lin(1, -o.u)) + '=' + tx(P.mul(L, lin(1, -o.u)))) + '. &nbsp;' + t('k=' + k),
          ['Write ' + t('x^{2}+kx' + Ct + '=' + br(L) + '(x+n)') + '.', 'The last terms multiply to ' + t(C) + '; ' + t('k') + ' is their sum.'], 'k from a factor');
      } }] },
    { num: 'C2', parts: [
      { id: 'C2', level: 'MAS', make: function (r) {
        var v = r.pick(['a', 'x', 'y', 'm']);
        var o = pickWhere(function () { return { al: r.int(1, 6), be: r.int(2, 6), k: r.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]) }; },
          function (o) { var c1 = o.al - o.be, c0 = -o.be * o.k; return c1 < 0 && c0 && gcd(c1, c0) > 1 && !(o.al === 3 && o.be === 5 && o.k === 2); });
        var c1 = o.al - o.be, c0 = -o.be * o.k, g = -gcd(c1, c0), Bn = lin(1, o.k, v), In = lin(c1 / g, c0 / g, v);
        var shown = (o.al === 1 ? '' : o.al) + v + br(Bn) + '-' + o.be + br(Bn) + '^{2}', keyTex = g + br(Bn) + br(In);
        var p = B.factored(t(shown), [N(g), Bn, In], { keyTex: keyTex, vars: [v], wrong: [{ is: P.mul(Bn, lin(c1, o.be * o.k, v)), code: 'u4l1-minus-bracket', hint: 'The minus sign in front of ' + t(o.be + br(Bn)) + ' applies to <b>both</b> terms: ' + t('-' + o.be + br(Bn) + '=' + tx(P.scale(Bn, -o.be))) + '.' }] },
          t(shown + '=' + br(Bn) + '[' + (o.al === 1 ? '' : o.al) + v + '-' + o.be + br(Bn) + ']=' + br(Bn) + '(' + tx(lin(c1, c0, v)) + ')') + '<br>' + t('=' + keyTex),
          ['Take out the common bracket ' + t(br(Bn)) + ' — the second term still has one ' + t(br(Bn)) + ' left.', 'Simplify the square bracket, then take out its common factor (a negative one, since the ' + t(v) + '-term is negative).'], 'common bracket, then GCF');
        p.bad = [br(Bn) + '(' + tx(lin(c1, c0, v)) + ')'];
        return p;
      } }] },
    { num: 'C3', parts: [
      { id: 'C3', level: 'ADV', make: function (r) {
        var pr = r.pick([['x', 'y'], ['a', 'b'], ['m', 'n']]), x = pr[0], y = pr[1];
        var o = pickWhere(function () { return { al: r.int(2, 9), be: r.int(2, 9) }; }, function (o) { return o.al !== o.be && !(o.al === 3 && o.be === 4); });
        var A = N(o.be), Bm = M(-1, oneVar(x)), C = N(o.al), D = M(-1, oneVar(y));
        return U.groupPart(A, Bm, C, D, { f2tex: o.al + '-' + y, f1tex: o.be + '-' + x, prompt: t(P.seq([N(o.al * o.be), M(-o.be, oneVar(y)), M(-o.al, oneVar(x)), P.mul(V(x), V(y))])) });
      } }] },
    { num: 'C4', parts: [
      { id: 'C4', level: 'MAS', make: function (r) {
        var k = r.pick([1, 3, 4, 5, 6]), n = 'n', b = 2 * k + 1, c = k * (k + 1), T = 'n^{2}+' + b + 'n+' + c;
        return B.mc(r, 'Which explains why ' + t(T) + ' is even for every integer ' + t(n) + '?', [
          { html: t(T + '=(n+' + k + ')(n+' + (k + 1) + ')') + ', a product of two consecutive integers, and one of any two consecutive integers is even.', right: true },
          { html: 'The constant term ' + t(c) + ' is even, so the whole expression is even.', why: 'An even constant is not enough: ' + t('n^{2}+2n+' + c) + ' is odd whenever ' + t('n') + ' is odd. Factor the trinomial instead.' },
          { html: t(T + '=(n+' + k + ')(n+' + (k + 1) + ')') + ', and both factors are always even.', why: 'Both can’t be even: they are consecutive integers, so exactly one of them is even — and that is enough.' },
          { html: 'Squaring any integer gives an even number, so ' + t('n^{2}') + ' makes it even.', why: 'Not true: ' + t('3^{2}=9') + ' is odd. Factor the trinomial instead.' }],
          t(T + '=(n+' + k + ')(n+' + (k + 1) + ')') + '. These are two consecutive integers; one of them is even, so the product is even.',
          ['Factor the trinomial.', 'What do you notice about the two factors? Are they next to each other?'], 'why it is even');
      } }] }
  ];
  HW.addCodes({ 'u4l1-perim-eq': 'Didn’t set up the perimeter equation', 'u4l1-gave-n': 'Gave the other factor’s number instead of k', 'u4l1-minus-bracket': 'Minus sign not applied to the whole bracket' });
  HW.addPartial({ 'u4l1-gave-n': 'b', 'u4l1-minus-bracket': 's' });

  HW.defineLesson({ id: 'u4l1', unit: 4, num: '1', title: 'Factoring Review: Common Factors and x² + bx + c', outcome: 'RF1', calc: false, questions: QUESTIONS, extra: EXTRA });
})(typeof window !== 'undefined' ? window : globalThis);
