/* Math 20-1 · Unit 4 · Lesson 4 — Differences of Squares, Including a²(f(x))² − b²(g(y))² (outcome RF1 on every part)
 * Assignment 4 (u4_l04.tex, Questions 1–16) and the Lesson 4 Extra Practice (u4_ep04.tex, A1–A3, B1–B5, C1–C3).
 * Every part is a generator: the booklet question's idea, form and difficulty with new numbers (the lesson's example
 * numbers and the booklet question's own numbers are left out). No calculator (Unit 4): exact answers.
 * Uses the factoring kit in u4l3.js (HW.p43), which must load first.
 *
 * Differences of squares are built from their square roots (A, B, the number of rounds, a common factor), so the key
 * always multiplies back to the question. Recognised mistakes: (A − B)² for A² − B², the squares instead of their roots
 * in the brackets, the squares subtracted the wrong way round, a sum of squares "factored", the common factor dropped or
 * divided into one term only, a bracket subtracted without changing every sign, the common factor that appears after
 * simplifying left inside a bracket (a nudge). "Factor, if possible" parts use one box with a <b>none</b> key, so the
 * input never gives away which ones factor.
 * Conversions: Q5, Extra B1 (rectangle) → boxes for the expressions and the numbers; Q8(a) (write the area) → multiple
 * choice; Q8(c) → the number in front of π; Q10 (is it a factor?) → a yes/no table; Q11 (explain Raj's error) →
 * (a) multiple choice of explanations, (b) factor fully. Multiple choice stays multiple choice, numerical response →
 * a number box. Levels: LIM BEG EMG PRG ADV MAS. Mastery: Q15, Extra B5, C2. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, B = K.P, P = HW.poly, FX = HW.factor, X = HW.p43, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
  var LID = 'u4l4';
  var gcd = X.gcd, isSq = X.isSq, lift = X.lift, tx = X.tx, lin = X.lin, key0 = X.key0, sg = X.sg, nz = X.nz, plain = X.plain, ut = X.ut, cterm = X.cterm;
  function pickWhere(gen, test) { return X.pickWhere(gen, test, LID); }
  function N(c) { return P.num(c); }
  function L(name, e) { return P.v(name, e); }
  /* monomial c·letters: M(3, 'xy') = 3xy, M([1, 2], 'x') = ½x, M(1, 'x', 2) = x² */
  function M(c, s, e) { var o = {}; (s || '').split('').forEach(function (ch) { o[ch] = (o[ch] || 0) + (e || 1); }); return P.mono(c, o); }
  function sq(A) { return P.pow(A, 2); }
  function br(list) { return '(' + P.seq(list) + ')'; }
  function isNum(A) { return !P.vars(A).length; }
  function coprime(a, b) { return gcd(a, b) === 1; }
  HW.addCodes({
    'p44-dos-square': 'Wrote a difference of squares as a perfect square (A − B)²', 'p44-no-root': 'Used a square instead of its square root in a bracket',
    'p44-rev': 'Squares subtracted the wrong way round', 'p44-lost-gcf': 'Dropped the common factor', 'p44-gcf-one': 'Divided only one term by the common factor',
    'p44-sum-sq': 'Tried to factor a sum of squares', 'p44-sum-bracket': 'Wrong plus bracket in a repeated difference of squares', 'p44-said-none': 'Said it can’t be factored (it can)',
    'p44-use-none': 'Retyped an expression that doesn’t factor', 'p44-minus-br': 'Subtracted a bracket without changing every sign', 'p44-lw-swap': 'Length and width swapped',
    'p44-perim-half': 'Used l + w for the perimeter instead of 2(l + w)', 'p44-dim': 'Dimension or area slip', 'p44-no-pi': 'Area: wrong multiple of π', 'p44-nr': 'NR: wrong values of the letters',
    'p44-eval': 'Evaluated the difference of squares wrongly', 'p44-group': 'Grouping error'
  });
  HW.addPartial({ 'p44-dos-square': 'b', 'p44-no-root': 'b', 'p44-lost-gcf': 's', 'p44-gcf-one': 's', 'p44-sum-sq': 's', 'p44-sum-bracket': 's', 'p44-minus-br': 's', 'p44-lw-swap': 's', 'p44-perim-half': 'b', 'p44-dim': 's', 'p44-group': 'b' });

  /* the lesson's examples and the booklet's own questions, never generated */
  var EXCL = {};
  ['25x^2-64', '49a^2-81b^2', '100m^2n^2-9p^2', 'x^2+36', '-y^2+4x^2', '1-S^2', '12x^2-27y^2', '5a^3b-45ab^3', '8x^2+50', '-18x^2+8', '36x^2-25y^2',
    '\\frac14x^2-9', '0.09a^2-0.49', 'x^4-81', '16a^4-b^4', '3x^4-48y^4', 'm^8-1', 'x^6-49', '(x+3)^2-25', '16-(y-1)^2', '4(2x-1)^2-9(y+2)^2', '(3x+1)^2-(x-5)^2',
    '(2x+5)^2-(x+1)^2', '2x^3-18x', 'x^3+2x^2-9x-18', '4x^4-37x^2+9', '6x^2-7x-20', '3a^2+12', '3x^4-48',
    '36x^2-49', '64a^2-25b^2', '81p^2q^2-4r^2', '121-x^2y^2', '9x^2+16', '-25+4m^2', '18x^2-50y^2', '7a^3-28a', '48m^2n-3n^3', '20x^2+45', '72-2y^2', '-27x^2+12y^2',
    'x^3y-xy^3', '50a^4b^2-2a^2b^4', '1-C^2', '9S^2-4', '\\frac19x^2-4', '0.16a^2-0.01b^2', '\\frac449m^2-1', '\\frac12x^2-8', 'a^4-1', '81x^4-16y^4', '2m^4-162', 'x^8-256',
    '16-81y^4', 'x^6y^2-4', '\\frac116x^4-1', '(x-4)^2-9', '36-(a+2)^2', '(2x+1)^2-(x+3)^2', '9(a+1)^2-4a^2', 'x^2-(y-z)^2', '49(x-1)^2-16(y+3)^2', '(x+y)^2-(x-y)^2',
    '4(3a-2)^2-25(a-1)^2', '5x^2-20x-60', '2x^3-3x^2-8x+12', '6y^4-5y^2-6', '9x^2-12x+4', 'x^4-8x^2-9', '4x^2-121', '100a^2-49b^2', '16x^2y^2-1', '3x^2-75', '45m^2-20n^2',
    'x^2+64y^2', '\\frac125x^2-\\frac14', '0.81-y^2', '-8a^2+2', 'y^4-16', '625a^4-b^4', '5x^4-5', 'x^4y^2-9', '(x+6)^2-16', '25-(2y-1)^2', '(x+5)^2-(x-3)^2', '4(x+1)^2-9(y-1)^2',
    '3x^3-12x^2-15x', 'x^3-5x^2-4x+20', '4x^4-13x^2+9', '16(x-1)^2-25', '(3x+2)^2-(x+4)^2'].forEach(function (s) { EXCL[s] = 1; });
  function fresh(s) { return !EXCL[key0(s).replace(/\\dfrac/g, '\\frac')]; }

  /* ---------------- "factor where possible": one box with a none key ---------------- */
  function noneField(vars) { return [{ name: 'Factored form', label: 'Factored form', mode: 'math', keys: 'poly', vars: vars, none: true, wide: true, placeholder: 'e.g. (x - 4)(x + 4)' }]; }
  function noneVal(resp) { var v = String((resp || [])[0] == null ? '' : (resp || [])[0]).trim(); return /^\\(text|mathrm)\{\s*none\s*\}$/i.test(v) ? 'none' : v; }
  var NONE_EMPTY = 'Type the factored form, or press <b>none</b> if it can’t be factored.';
  function canNone(p, saidNone) {
    var chk = p.check;
    return { prompt: p.prompt, input: { type: 'fields', fields: noneField(p.input.vars) }, key: [p.key], answer: p.answer, solution: p.solution, hints: p.hints, text: p.text,
      check: function (resp) { var v = noneVal(resp); if (!v) return form('empty', NONE_EMPTY); if (/^none$/i.test(v)) return wrong('p44-said-none', saidNone || 'It <b>can</b> be factored: both terms are perfect squares and they are subtracted.'); return chk(v); },
      good: (p.good || []).map(function (g) { return [g]; }), bad: [['none']].concat((p.bad || []).map(function (b) { return [b]; })) };
  }
  /* a sum of squares A² + B² (no common factor): the answer is none */
  function nonePart(A, Bq, exprTex) {
    var E = P.add(sq(A), sq(Bq)), e = exprTex || tx(E);
    var sol = t(e + '=' + sqTex(A) + '+' + sqTex(Bq)) + ' is a <b>sum</b> of squares. It would need two terms with sum ' + t('0') + ' and a positive product, but terms with sum ' + t('0') + ' are opposites, and opposites have a negative product. It <b>cannot be factored</b>.';
    var D = P.sub(A, Bq), S = P.add(A, Bq);
    return { prompt: t(e), input: { type: 'fields', fields: noneField(P.vars(E)) }, key: ['none'], answer: 'It cannot be factored (a sum of squares).', solution: sol,
      hints: ['Is it a <b>difference</b> or a <b>sum</b> of squares?', 'A sum of squares does not factor — press <b>none</b>.'], text: 'factor if possible ' + plain(e) + ' (none)',
      check: function (resp) {
        var s = noneVal(resp); if (!s) return form('empty', NONE_EMPTY); if (/^none$/i.test(s)) return ok();
        var a = K.read(s); if (a.res) return a.res; var sp = FX.split(a.ast); if (!sp.ok) return wrong('value', null);
        var Sp = sp.factors.reduce(function (acc, f) { return P.mul(acc, P.pow(f.p, f.k)); }, N(1));
        if (P.eq(Sp, E)) return form('p44-use-none', 'That is the expression itself. A sum of squares can’t be factored — press <b>none</b>.');
        return wrong('p44-sum-sq', 'Your factors multiply to ' + t(tx(Sp)) + ', not ' + t(e) + '. ' + t(e) + ' is a <b>sum</b> of squares: it does not factor, so press <b>none</b>.');
      },
      bad: [['(' + tx(D) + ')(' + tx(S) + ')'], ['(' + tx(S) + ')^{2}'], [tx(E)]] };
  }

  /* ---------------- differences of squares A^E − B^E (E = 2, 4, 8) with a common factor k ---------------- */
  /* how X² is written: x^{2}, 9^{2}, (4x)^{2}, (x^{2})^{2}, \left(\frac{1}{2}x\right)^{2} */
  function sqTex(Xp) {
    var ts = P.terms(Xp);
    if (ts.length === 1) { var T = ts[0], vs = Object.keys(T.v), c = T.c; if (c[1] === 1 && ((c[0] === 1 && vs.length === 1 && T.v[vs[0]] === 1) || (!vs.length && c[0] > 0))) return tx(Xp) + '^{2}'; }
    return '\\left(' + tx(Xp) + '\\right)^{2}';
  }
  function E2(R) { return Math.pow(2, Math.max(R, 1)); }
  function innerOf(s) { var E = E2(s.R); return s.R === 0 ? P.add(sq(s.a), sq(s.b)) : P.sub(P.pow(s.a, E), P.pow(s.b, E)); }
  function innerTex(s) { var E = E2(s.R); return s.R === 0 ? P.seq([sq(s.a), sq(s.b)]) : P.seq([P.pow(s.a, E), P.neg(P.pow(s.b, E))]); }
  function exprOf(s) { return s.k ? P.mul(s.k, innerOf(s)) : innerOf(s); }
  function exprTexOf(s, o) {
    o = o || {}; var E = E2(s.R), k = s.k || N(1), t1 = P.mul(k, s.R === 0 ? sq(s.a) : P.pow(s.a, E)), t2 = s.R === 0 ? P.mul(k, sq(s.b)) : P.neg(P.mul(k, P.pow(s.b, E)));
    if (o.dec) return [t1, t2].map(function (x, i) { var y = tx(x, { dec: true }); return i && y.charAt(0) !== '-' ? '+' + y : y; }).join('');
    return o.rev ? P.seq([t2, t1]) : P.seq([t1, t2]);
  }
  function plusBrackets(a, b, R, from) { var s = ''; for (var j = from; j < R; j++) { var e = Math.pow(2, j); s += br([P.pow(a, e), P.pow(b, e)]); } return s; }
  function kTex(k) { if (!k) return ''; var s = tx(k); return s === '1' ? '' : s === '-1' ? '-' : s; }
  function targetOf(s) { var kt = kTex(s.k); if (s.R === 0) return kt + '(' + innerTex(s) + ')'; return kt + br([s.a, P.neg(s.b)]) + br([s.a, s.b]) + plusBrackets(s.a, s.b, s.R, 1); }
  function factorsOf(s, kOn) {
    var out = s.k && kOn !== false ? [s.k] : [];
    if (s.R === 0) return out.concat([innerOf(s)]);
    out.push(P.sub(s.a, s.b), P.add(s.a, s.b));
    for (var j = 1; j < s.R; j++) { var e = Math.pow(2, j); out.push(P.add(P.pow(s.a, e), P.pow(s.b, e))); }
    return out;
  }
  function unrooted(Xp) { var ts = P.terms(Xp); if (ts.length !== 1) return null; var T = ts[0], c = T.c; if (c[1] !== 1 || Math.abs(c[0]) === 1) return null; return P.mono(c[0] * c[0], T.v); }
  function wrongsOf(s) {
    var a = s.a, b = s.b, k = s.k, pre = k ? [k] : [], kt = k ? tx(k) : '', ws = [];
    var rest = factorsOf(s).slice(pre.length + 2);
    if (s.R === 0) {
      ws.push({ is: pre.concat([P.sub(a, b), P.add(a, b)]), code: 'p44-sum-sq', hint: 'Those brackets multiply to a <b>difference</b>. ' + t(innerTex(s)) + ' is a <b>sum</b> of squares, and a sum of squares never factors: stop once the common factor is out.' });
      ws.push({ is: pre.concat([{ p: P.add(a, b), k: 2 }]), code: 'p44-sum-sq', hint: t('(' + P.seq([a, b]) + ')^{2}') + ' has a middle term. ' + t(innerTex(s)) + ' is a sum of squares: it doesn’t factor.' });
      if (k) ws.push({ is: [innerOf(s)], code: 'p44-lost-gcf', hint: 'Keep the common factor ' + t(kt) + ' in front of the bracket.' });
      return ws;
    }
    var D = P.sub(a, b), S = P.add(a, b);
    var sqHint = function (Xp, xt) { return 'A squared bracket has a middle term: ' + t('(' + xt + ')^{2}=' + tx(sq(Xp))) + '. A difference of squares needs one <b>minus</b> bracket and one <b>plus</b> bracket, so the middle terms cancel.'; };
    ws.push({ is: pre.concat([{ p: D, k: 2 }], rest), code: 'p44-dos-square', hint: sqHint(D, P.seq([a, P.neg(b)])) });
    ws.push({ is: pre.concat([{ p: S, k: 2 }], rest), code: 'p44-dos-square', hint: sqHint(S, P.seq([a, b])) });
    ws.push({ is: pre.concat([P.sub(b, a), P.add(b, a)], rest), code: 'p44-rev', hint: 'Your factors multiply to the <b>opposite</b> of the question (the squares are subtracted the other way round). Start each bracket with the square root of the term that is <b>added</b>, ' + t(tx(P.pow(a, E2(s.R)))) + '.' });
    if (s.R === 1) {
      [[a, 0], [b, 1]].forEach(function (pr) {
        var Xp = pr[0], X2 = isNum(Xp) ? (P.eq(sq(Xp), Xp) ? null : sq(Xp)) : unrooted(Xp); if (!X2) return;
        var A2 = pr[1] ? a : X2, B2 = pr[1] ? X2 : b;
        ws.push({ is: pre.concat([P.sub(A2, B2), P.add(A2, B2)]), code: 'p44-no-root', hint: 'Use the square <b>roots</b> in the brackets: ' + t(tx(sq(Xp)) + '=' + sqTex(Xp)) + ', so the bracket term is ' + t(tx(Xp)) + ', not ' + t(tx(X2)) + '.' });
      });
    }
    if (s.R >= 2) {
      var e = Math.pow(2, s.R - 1), lastTex = br([P.pow(a, e), P.pow(b, e)]);
      var fs = factorsOf(s), wrongLast = fs.slice(0, fs.length - 1).concat([P.sub(P.pow(a, e / 2), P.pow(b, e / 2)), P.add(P.pow(a, e / 2), P.pow(b, e / 2))]);
      ws.push({ is: wrongLast, code: 'p44-sum-sq', hint: t(lastTex) + ' is a <b>sum</b> of squares — it does not factor. (Brackets like ' + t(br([P.pow(a, e / 2), P.neg(P.pow(b, e / 2))]) + br([P.pow(a, e / 2), P.pow(b, e / 2)])) + ' multiply to a <b>difference</b>.)' });
      if (isNum(b) && !P.eq(sq(b), b) && s.R === 2) ws.push({ is: pre.concat([D, S, P.add(sq(a), b)]), code: 'p44-sum-bracket', hint: 'Check the plus bracket from the first round: ' + t(tx(P.pow(b, 4)) + '=' + sqTex(sq(b))) + ', so it is ' + t(lastTex) + '.' });
    }
    if (k) {
      ws.push({ is: factorsOf(s, false), code: 'p44-lost-gcf', hint: 'Your brackets are right, but the common factor ' + t(kt) + ' has gone missing. It stays in front of the brackets.' });
      if (isNum(k)) { var kv = P.constant(k), E = E2(s.R); ws.push({ is: [k, P.sub(P.pow(a, E), P.scale(P.pow(b, E), kv))], code: 'p44-gcf-one', hint: 'When you take out ' + t(kt) + ', divide <b>every</b> term by it: ' + t(tx(P.mul(k, P.pow(b, E))) + '\\div ' + (kt.charAt(0) === '-' ? '(' + kt + ')' : kt) + '=' + tx(P.pow(b, E))) + '.' }); }
    }
    return ws;
  }
  function notes(list) {
    var out = list.map(function (Xp) { var a = tx(sq(Xp)), b = sqTex(Xp); return a === b ? null : t(a + '=' + b); }).filter(Boolean);
    return out.length ? 'Both terms are perfect squares: ' + out.join(' and ') + '.<br>' : '';
  }
  function solOf(s, exprTex) {
    var kt = s.k ? kTex(s.k) : '', inner = innerTex(s), out = '';
    if (s.k) out += 'Take out the common factor ' + t(tx(s.k)) + ' first:<br>' + t(exprTex + '=' + kt + '(' + inner + ')') + '<br>';
    if (s.R === 0) return out + t(inner) + ' is a <b>sum</b> of squares, so it does not factor. Final answer: ' + t(targetOf(s)) + '.';
    if (!s.k && s.R === 1) out += notes([s.a, s.b]);
    var a = s.a, b = s.b, R = s.R, lines = [], Eh = Math.pow(2, R - 1), lead = sqTex(P.pow(a, Eh)) + '-' + sqTex(P.pow(b, Eh));
    var open = kt ? '\\left[' : '', close = kt ? '\\right]' : '';
    if (lead !== inner && lead !== exprTex) lines.push('=' + kt + open + lead + close);
    for (var j = R - 1; j >= 0; j--) { var e = Math.pow(2, j); lines.push('=' + kt + br([P.pow(a, e), P.neg(P.pow(b, e))]) + br([P.pow(a, e), P.pow(b, e)]) + plusBrackets(a, b, R, j + 1)); }
    if (R === 1) return out + t((s.k ? '' : exprTex) + lines.join(''));
    out += t((s.k ? '' : exprTex) + lines[0]);
    for (var i = 1; i < lines.length; i++) out += '<br>' + t(lines[i]);
    return out + '<br>Each round the <b>minus</b> bracket is a difference of squares again; the <b>plus</b> brackets are sums of squares and stop.';
  }
  var IDENT = t('A^{2}-B^{2}=(A-B)(A+B)');
  var H_DOS = ['Check that both terms are perfect squares and that they are subtracted, then use ' + IDENT + '.', 'Write each term as a square first, e.g. ' + t('49x^{2}=(7x)^{2}') + '. One bracket gets a minus sign, the other a plus sign.'];
  var H_GCF = ['Take out the greatest common factor first; what is left in the bracket should be a difference (or sum) of squares.', 'Then use ' + IDENT + ' and keep the common factor in front. A sum of squares does not factor.'];
  var H_MULTI = ['Use ' + IDENT + ', then look at every bracket: the minus bracket may be a difference of squares again.', 'The plus brackets are sums of squares — they never factor. Stop when no bracket is a difference of squares.'];
  /* o: { exprTex, rev, dec, keyTex, good, special, prompt, solPre, solPost, hints, none } */
  function dos(s, o) {
    o = o || {};
    var exprTex = o.exprTex || exprTexOf(s, o), target = o.keyTex || targetOf(s), good = o.good ? o.good.slice() : [];
    if (s.R >= 1) good.push(kTex(s.k) + br([s.a, s.b]) + br([s.a, P.neg(s.b)]) + plusBrackets(s.a, s.b, s.R, 1));
    var p = X.fx({ prompt: o.prompt || t(exprTex), key: target, ws: wrongsOf(s).concat(o.ws || []), sol: o.sol || (o.solPre || '') + solOf(s, exprTex) + (o.solPost || ''),
      hints: o.hints || (s.k ? H_GCF : s.R >= 2 ? H_MULTI : H_DOS), text: o.text || 'factor ' + plain(exprTex), special: o.special, vars: o.vars, good: good });
    p.exprTex = exprTex;
    return o.none ? canNone(p) : p;
  }
  function S(a, b, R, k) { return { a: lift(a), b: lift(b), R: R == null ? 1 : R, k: k ? lift(k) : null }; }

  /* ---------------- squares of binomials: m²(L1)² − n²(L2)² ---------------- */
  function sqTerm(m, Lp, first) { Lp = lift(Lp); if (P.count(Lp) > 1) return cterm(m * m, '(' + ut(Lp) + ')^{2}', first); var v = tx(P.scale(sq(Lp), m * m)); return first ? v : (v.charAt(0) === '-' ? v : '+' + v); }
  function rootTex(m, Lp) { Lp = lift(Lp); if (P.count(Lp) > 1) return (m === 1 ? '' : m) + '(' + ut(Lp) + ')'; return tx(P.scale(Lp, m)); }
  /* o: { m, L1, n, L2, pre (a factor in front, e.g. π), exprTex, prompt, special, solPre, solPost } */
  function dosBin(o) {
    var L1 = lift(o.L1), L2 = lift(o.L2), A = P.scale(L1, o.m), Bq = P.scale(L2, o.n), D = P.sub(A, Bq), Sm = P.add(A, Bq);
    var pre = o.pre ? lift(o.pre) : N(1), preT = o.pre ? tx(pre) : '';
    var exprTex = o.exprTex || sqTerm(o.m, L1, true) + '-' + sqTerm(o.n, L2, true);
    var col = X.collect([pre, D, Sm], false), key = X.cTex(col, { flip: true });
    var At = rootTex(o.m, L1), Bt = rootTex(o.n, L2), Bb = Bt;
    var rawD = P.seq(P.sorted(A).map(function (T) { return P.mono(T.c, T.v); }).concat(P.sorted(Bq).map(function (T) { return P.mono([-T.c[0], T.c[1]], T.v); })));
    var rawS = P.seq(P.sorted(A).map(function (T) { return P.mono(T.c, T.v); }).concat(P.sorted(Bq).map(function (T) { return P.mono(T.c, T.v); })));
    var lines = [];
    var asSq = (o.m === 1 && P.count(L1) > 1 ? '(' + ut(L1) + ')' : '\\big[' + At + '\\big]') + '^{2}-' + (o.n === 1 && P.count(L2) > 1 ? '(' + ut(L2) + ')' : '\\big[' + Bt + '\\big]') + '^{2}';
    if (o.m !== 1 || o.n !== 1 || P.count(L1) === 1 || P.count(L2) === 1) lines.push('Write it as a difference of squares: ' + t(exprTex + '=' + asSq.replace(/\\big\[([^\]]*?)\\big\]\^\{2\}/g, function (m0, inner) { return /^[a-z0-9]+$|^\d*[a-z]$/.test(inner) && !/\(/.test(inner) ? (inner.length === 1 ? inner : '(' + inner + ')') + '^{2}' : '\\big[' + inner + '\\big]^{2}'; })) + ', with ' + t('A=' + At) + ' and ' + t('B=' + Bt) + '.');
    var minus = '\\big[' + At + '-' + Bb + '\\big]\\big[' + At + '+' + Bb + '\\big]';
    lines.push(t((lines.length ? '' : exprTex) + '=' + preT + minus));
    var simp = '(' + ut(D) + ')(' + ut(Sm) + ')';
    if (rawD !== tx(D) || rawS !== tx(Sm)) lines.push(t('=' + preT + '(' + rawD + ')(' + rawS + ')'));
    lines.push(t('=' + preT + simp) + (preT + simp !== key ? '<br>' + t('=' + key) : ''));
    var ws = [];
    if (P.count(Bq) > 1) { var ld = P.sorted(Bq)[0], lead = P.mono(ld.c, ld.v), rest = P.sub(Bq, lead); ws.push({ is: [pre, P.add(A, P.neg(lead), rest), Sm], code: 'p44-minus-br', hint: 'In ' + t('A-B') + ' the minus sign applies to <b>every</b> term of ' + t('B=' + Bt) + ': ' + t('-(' + tx(Bq) + ')=' + tx(P.neg(Bq))) + '.' }); }
    if (o.m !== 1) ws.push({ is: [pre, P.sub(P.scale(L1, o.m * o.m), Bq), P.add(P.scale(L1, o.m * o.m), Bq)], code: 'p44-no-root', hint: 'Use the square <b>root</b> of ' + t(o.m * o.m) + ', which is ' + t(o.m) + ', in the brackets: ' + t(sqTerm(o.m, L1, true) + '=\\big[' + At + '\\big]^{2}') + '.' });
    if (o.n !== 1) ws.push({ is: [pre, P.sub(A, P.scale(L2, o.n * o.n)), P.add(A, P.scale(L2, o.n * o.n))], code: 'p44-no-root', hint: 'Use the square <b>root</b> of ' + t(o.n * o.n) + ', which is ' + t(o.n) + ', in the brackets.' });
    ws.push({ is: [pre, { p: D, k: 2 }], code: 'p44-dos-square', hint: 'A difference of squares factors as ' + t('(A-B)(A+B)') + ' — one minus bracket and one plus bracket — not ' + t('(A-B)^{2}') + '.' });
    var em = X.collect([D, Sm], false).mono;
    if (!isNum(em) || Math.abs(P.constant(em)[0]) !== 1) ws.push({ is: [pre].concat(col.br.map(function (b) { return { p: b.p, k: b.k }; })), code: 'p44-lost-gcf', hint: 'Taking a common factor out of a bracket doesn’t make it disappear: it moves in front. Check what your factors multiply to.' });
    var hints = ['Write it as ' + t('A^{2}-B^{2}') + ' with ' + t('A=' + At) + ' and ' + t('B=' + Bt) + ', then use ' + t('(A-B)(A+B)') + '.', 'Keep the brackets while you substitute (the minus sign applies to every term of ' + t('B') + '), then simplify each factor and take out any common factor.'];
    var good = [X.cTex(col, {}), X.cTex(col, { flip: true, rev: true })];
    var p = X.fx({ prompt: o.prompt || t(exprTex), key: key, ws: ws.concat(o.ws || []), sol: (o.solPre || '') + lines.join('<br>') + (o.solPost || ''), hints: o.hints || hints, text: o.text || 'factor ' + plain(exprTex), special: o.special, vars: o.vars, good: good });
    p.exprTex = exprTex; p.keyTex = key; p.col = col; p.D = D; p.Sm = Sm;
    return p;
  }
  X.dos = dos; X.dosBin = dosBin; X.S = S; X.nonePart = nonePart; X.canNone = canNone;

  /* ---------------- small generators ---------------- */
  function pq(r, lo, hi, test) { return pickWhere(function () { return [r.int(lo, hi), r.int(lo, hi)]; }, function (x) { return x[0] !== x[1] && coprime(x[0], x[1]) && (!test || test(x)); }); }
  /* (mx)² − n² style with exclusions; spec(r) -> s; build -> part */
  function gen(r, mk, opt) {
    opt = opt || {};
    var s = pickWhere(function () { return mk(r); }, function (s) { if (!s) return false; var e = opt.exprTex ? opt.exprTex(s) : exprTexOf(s, opt); return fresh(e) && (!opt.test || opt.test(s)); });
    return dos(s, Object.assign({}, opt, { exprTex: opt.exprTex ? opt.exprTex(s) : undefined, keyTex: opt.keyTex ? opt.keyTex(s) : undefined, good: opt.goodF ? opt.goodF(s) : undefined }));
  }
  function genBin(r, mk, test) { var o = pickWhere(function () { return mk(r); }, function (o) { if (!o) return false; var p; try { p = dosBin(o); } catch (e) { return false; } return fresh(p.exprTex) && p.col && (!test || test(o, p)); }); return dosBin(o); }
  /* decomposition / quadratic form through the kit */
  function qf(U, f, g) { return X.sub({ U: U, f: f, g: g || 1, mode: 'mono' }); }

  var QUESTIONS = [
    { num: '1', section: 'The difference of squares pattern', stem: 'Factor, if possible. If an expression can’t be factored, press <b>none</b>.', parts: [
      { id: '1a', level: 'BEG', make: function (r) { return gen(r, function (r) { var x = pq(r, 2, 11); return S(M(x[0], 'x'), x[1]); }, { none: true }); } },
      { id: '1b', level: 'BEG', make: function (r) { var v = r.pick(['ab', 'xy', 'mn']); return gen(r, function (r) { var x = pq(r, 2, 10); return S(M(x[0], v[0]), M(x[1], v[1])); }, { none: true }); } },
      { id: '1c', level: 'BEG', make: function (r) { var v = r.pick(['pqr', 'abc', 'xyz']); return gen(r, function (r) { var x = pq(r, 2, 10); return S(M(x[0], v.slice(0, 2)), M(x[1], v[2])); }, { none: true }); } },
      { id: '1d', level: 'BEG', make: function (r) { var v = r.pick(['xy', 'ab', 'mn']); return gen(r, function (r) { return S(r.int(2, 12), M(1, v)); }, { none: true }); } },
      { id: '1e', level: 'EMG', make: function (r) { var o = pickWhere(function () { return pq(r, 2, 9); }, function (x) { return fresh(tx(P.add(sq(M(x[0], 'x')), N(x[1] * x[1])))); }); return nonePart(M(o[0], r.pick(['x', 'x', 'y'])), N(o[1])); } },
      { id: '1f', level: 'EMG', make: function (r) { var v = r.pick(['m', 'x', 'k']); return gen(r, function (r) { var x = pq(r, 2, 9); return S(M(x[0], v), x[1]); }, { none: true, rev: true, hints: ['Reorder so the positive term comes first: ' + t('-B^{2}+A^{2}=A^{2}-B^{2}') + '.', 'Then use ' + IDENT + '.'] }); } }] },
    { num: '2', section: 'Common factor first', stem: 'Factor fully.', parts: [
      { id: '2a', level: 'EMG', make: function (r) { return gen(r, function (r) { var x = pq(r, 1, 6, function (x) { return x[0] > 1; }); return S(M(x[0], 'x'), M(x[1], 'y'), 1, r.pick([2, 3, 5, 6, 7])); }); } },
      { id: '2b', level: 'EMG', make: function (r) { var v = r.pick(['a', 'x', 'p']); return gen(r, function (r) { return S(M(1, v), r.int(2, 6), 1, M(r.int(2, 7), v)); }); } },
      { id: '2c', level: 'PRG', make: function (r) { return gen(r, function (r) { return S(M(r.int(2, 6), 'm'), M(1, 'n'), 1, M(r.int(2, 5), 'n')); }); } },
      { id: '2d', level: 'EMG', make: function (r) { return gen(r, function (r) { var x = pq(r, 1, 7, function (x) { return x[0] > 1; }); return S(M(x[0], 'x'), x[1], 0, r.pick([2, 3, 5, 6])); }); } },
      { id: '2e', level: 'EMG', make: function (r) { var v = r.pick(['y', 'x', 'b']); return gen(r, function (r) { return S(r.int(2, 9), M(1, v), 1, r.pick([2, 3, 5])); }); } },
      { id: '2f', level: 'PRG', make: function (r) { return gen(r, function (r) { var x = pq(r, 1, 5, function (x) { return x[0] > 1; }); return S(M(x[0], 'x'), M(x[1], 'y'), 1, -r.pick([2, 3, 5])); }, { goodF: function (s) { return [tx(P.neg(s.k)) + br([s.b, P.neg(s.a)]) + br([s.b, s.a])]; } }); } },
      { id: '2g', level: 'PRG', make: function (r) { return gen(r, function (r) { var q = r.pick([1, 1, 2, 3]); return S(M(1, 'x'), M(q, 'y'), 1, M(r.pick([1, 1, 2, 3]), 'xy')); }); } },
      { id: '2h', level: 'ADV', make: function (r) { return gen(r, function (r) { var x = pq(r, 1, 6, function (x) { return x[0] > 1; }); return S(M(x[0], 'a'), M(x[1], 'b'), 1, P.scale(P.mul(L('a', 2), L('b', 2)), r.pick([2, 3, 5]))); }); } }] },
    { num: '3', section: 'Trigonometric expressions', stem: 'Factor.', parts: [
      { id: '3a', level: 'BEG', make: function (r) { var nm = r.pick([[1, 2], [1, 3], [2, 1], [3, 1], [2, 3], [3, 2], [1, 4], [4, 1]]), F = r.pick(['S', 'C']); return dos(S(nm[0], M(nm[1], F)), { special: true, vars: [F === 'S' ? 'sin' : 'cos'] }); } },
      { id: '3b', level: 'EMG', make: function (r) { var o = pickWhere(function () { return { m: r.int(2, 5), n: r.int(1, 5), F: r.pick(['S', 'C']) }; }, function (o) { return coprime(o.m, o.n) && fresh(exprTexOf(S(M(o.m, o.F), o.n))); }); return dos(S(M(o.m, o.F), o.n), { special: true, vars: [o.F === 'S' ? 'sin' : 'cos'] }); } }] },
    { num: '4', section: 'Rational coefficients', stem: 'Factor fully.', parts: [
      { id: '4a', level: 'EMG', make: function (r) { return gen(r, function (r) { var m = r.int(2, 5); return S(M([1, m], 'x'), r.int(2, 6)); }, {
        goodF: function (s) { var m = P.terms(s.a)[0].c[1], n = P.constant(s.b)[0]; return ['\\frac{1}{' + (m * m) + '}(x-' + m * n + ')(x+' + m * n + ')']; },
        solPost: '' }); } },
      { id: '4b', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return pq(r, 2, 9); }, function (x) { return !(x[0] === 4 && x[1] === 5) && !(x[0] === 5 && x[1] === 6); });
        var s = S(M([1, o[0]], 'x'), M([1, o[1]], 'y')), e = '\\frac{x^{2}}{' + o[0] * o[0] + '}-\\frac{y^{2}}{' + o[1] * o[1] + '}';
        var A = '\\frac{x}{' + o[0] + '}', Bt = '\\frac{y}{' + o[1] + '}';
        var key = '\\left(' + A + '-' + Bt + '\\right)\\left(' + A + '+' + Bt + '\\right)';
        return dos(s, { exprTex: e, keyTex: key, sol: 'A fraction is a perfect square when its numerator and denominator both are: ' + t('\\frac{x^{2}}{' + o[0] * o[0] + '}=\\left(' + A + '\\right)^{2}') + ' and ' + t('\\frac{y^{2}}{' + o[1] * o[1] + '}=\\left(' + Bt + '\\right)^{2}') + '.<br>' + t(e + '=' + key) });
      } },
      { id: '4c', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { p: r.int(1, 9), q: r.int(1, 9), two: r.chance(0.6) }; }, function (o) { return o.p !== o.q && coprime(o.p, o.q) && !(o.p === 4 && o.q === 1 && o.two) && !(o.p === 3 && o.q === 7 && !o.two); });
        var s = S(M([o.p, 10], 'a'), o.two ? M([o.q, 10], 'b') : N([o.q, 10])), dq = function (v) { return tx(v, { dec: true }); };
        var key = '(' + dq(P.sub(s.a, s.b)) + ')(' + dq(P.add(s.a, s.b)) + ')';
        return dos(s, { dec: true, keyTex: key, sol: 'Decimals work too: ' + t(dq(sq(s.a)) + '=\\left(' + dq(s.a) + '\\right)^{2}') + ' and ' + t(dq(sq(s.b)) + '=\\left(' + dq(s.b) + '\\right)^{2}') + '.<br>' + t(exprTexOf(s, { dec: true }) + '=' + key), good: ['(' + dq(P.add(s.a, s.b)) + ')(' + dq(P.sub(s.a, s.b)) + ')'] });
      } },
      { id: '4d', level: 'PRG', make: function (r) { var v = r.pick(['m', 'x', 'k']); return gen(r, function (r) { var x = pq(r, 2, 9, function (x) { return x[0] < x[1]; }); return S(M([x[0], x[1]], v), 1); }); } },
      { id: '4e', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { c: r.pick([2, 3]), j: r.int(1, 3), v: r.pick(['x', 'x', 'y']) }; }, function (o) { return !(o.c === 2 && o.j === 2 && o.v === 'x'); });
        var n = o.c * o.j, s = S(L(o.v), n, 1, [1, o.c]);
        return dos(s, { solPre: t('\\frac{1}{' + o.c + '}') + ' is not a perfect square, so take it out as a common factor first.<br>', good: ['\\left(\\frac{1}{' + o.c + '}' + o.v + '-' + o.j + '\\right)(' + o.v + '+' + n + ')'] });
      } }] },
    { num: '5', section: 'Rectangular rug', shared: function (r) { return rect(r, [[8, 3, 2.5, 1], [6, 5, 4, 2.4]]); },
      stem: function (o) { return 'A rectangular rug has an area of ' + t(tx(P.sub(M(o.a * o.a, 'x', 2), M(o.b * o.b, 'y', 2)))) + ' square metres. Its length and width are both of the form ' + t('ax+by') + ', where ' + t('a') + ' and ' + t('b') + ' are integers.'; }, parts: [
      { id: '5a', level: 'PRG', make: function (r, o) { return lwPart(o); } },
      { id: '5b', level: 'PRG', make: function (r, o) {
        var Pm = 4 * o.a * o.x;
        return B.number('The perimeter is ' + t(fmt(Pm)) + ' m. Determine ' + t('x') + '.', o.x, function (v) { if (Math.abs(v - Pm / (2 * o.a)) < 1e-9) return { code: 'p44-perim-half', hint: 'The perimeter is ' + t('2(l+w)') + ', not ' + t('l+w') + '.' }; return null; },
          t('2(' + o.a + 'x+' + o.b + 'y)+2(' + o.a + 'x-' + o.b + 'y)=' + 4 * o.a + 'x=' + fmt(Pm) + '\\Rightarrow x=' + fmt(o.x)), ['Add the length and width, then double. The ' + t('y') + ' terms cancel.'], 'rug: x from the perimeter', { before: t('x='), after: '' });
      } },
      { id: '5c', level: 'ADV', make: function (r, o) {
        var X0 = o.a * o.x, Y0 = o.b * o.y, d = 2 * Y0, Lv = X0 + Y0, Wv = X0 - Y0;
        return B.fields('The length is also ' + t(fmt(d)) + ' m more than the width. Determine ' + t('y') + ', the dimensions and the area.', [{ name: 'y', label: t('y=') }, { name: 'Length', label: 'Length', after: 'm' }, { name: 'Width', label: 'Width', after: 'm' }, { name: 'Area', label: 'Area', after: 'm²' }],
          [K.number(o.y, function (v) { if (Math.abs(v - d / o.b) < 1e-9) return { code: 'p44-dim', hint: 'Length − width ' + t('=(' + o.a + 'x+' + o.b + 'y)-(' + o.a + 'x-' + o.b + 'y)=' + 2 * o.b + 'y') + '.' }; return null; }), K.number(Lv), K.number(Wv), K.number(Lv * Wv, function (v) { if (Math.abs(v - 2 * (Lv + Wv)) < 1e-9) return { code: 'p44-dim', hint: 'That is the perimeter. Area is length times width.' }; return null; })],
          [fmt(o.y), fmt(Lv), fmt(Wv), fmt(Lv * Wv)], t('y=' + fmt(o.y)) + '; ' + t(fmt(Lv)) + ' m by ' + t(fmt(Wv)) + ' m; area ' + t(fmt(Lv * Wv)) + ' m²',
          'Length − width ' + t('=' + 2 * o.b + 'y=' + fmt(d) + '\\Rightarrow y=' + fmt(o.y)) + '.<br>Length ' + t(o.a + '(' + fmt(o.x) + ')+' + o.b + '(' + fmt(o.y) + ')=' + fmt(Lv)) + ' m, width ' + t(fmt(X0) + '-' + fmt(Y0) + '=' + fmt(Wv)) + ' m.<br>Area ' + t(fmt(Lv) + '\\times ' + fmt(Wv) + '=' + fmt(Lv * Wv)) + ' m²',
          ['Subtract the width from the length: the ' + t('x') + ' terms cancel.', 'Substitute ' + t('x') + ' and ' + t('y') + ' into both expressions, then multiply for the area.'], 'rug: y, dimensions, area');
      } }] },
    { num: '6', section: 'Higher powers and repeated factoring', stem: 'Factor fully.', parts: [
      { id: '6a', level: 'EMG', make: function (r) { var v = r.pick(['a', 'x', 'y', 'm']); return gen(r, function (r) { return S(L(v), r.int(1, 3), 2); }); } },
      { id: '6b', level: 'PRG', make: function (r) { var v = r.pick(['xy', 'ab', 'mn']); return gen(r, function (r) { var x = pq(r, 1, 3); return S(M(x[0], v[0]), M(x[1], v[1]), 2); }); } },
      { id: '6c', level: 'PRG', make: function (r) { var v = r.pick(['m', 'x', 'a']); return gen(r, function (r) { return S(L(v), r.int(2, 3), 2, r.pick([2, 3, 5])); }); } },
      { id: '6d', level: 'ADV', make: function (r) { var c = r.pick([[L('a'), 2], [L('y'), 2], [L('x'), L('y')], [M(2, 'x'), 1], [L('x'), M(2, 'y')], [M(2, 'a'), L('b')]]); return dos(S(c[0], c[1], 3)); } },
      { id: '6e', level: 'PRG', make: function (r) { var v = r.pick(['y', 'x', 'b']); return gen(r, function (r) { var x = pq(r, 1, 3); return S(x[0], M(x[1], v), 2); }); } },
      { id: '6f', level: 'EMG', make: function (r) { var c = r.pick([[3, 1], [1, 3], [3, 0], [5, 1], [1, 5]]); return gen(r, function (r) { var a = P.mono(1, c[1] ? { x: c[0], y: c[1] } : { x: c[0] }); return S(a, r.int(2, 9)); }); } },
      { id: '6g', level: 'ADV', make: function (r) { var c = r.pick([[[1, 3], 1], [[1, 2], 2], [[1, 3], 2], [[2, 3], 1], [[1, 2], 3]]); return dos(S(M(c[0], 'x'), c[1], 2)); } }] },
    { num: '7', section: 'Squares of binomials', stem: 'Factor fully. Simplify each factor.', parts: [
      { id: '7a', level: 'EMG', make: function (r) { return genBin(r, function (r) { return { m: 1, L1: lin(1, L('x'), nz(r, -6, 6), 1), n: r.int(2, 6), L2: 1 }; }, function (o, p) { return p.col.br.length === 2; }); } },
      { id: '7b', level: 'PRG', make: function (r) { var v = r.pick(['a', 'y', 'x']); return genBin(r, function (r) { return { m: r.int(3, 8), L1: 1, n: 1, L2: lin(1, L(v), nz(r, -5, 5), 1) }; }, function (o, p) { return p.col.br.length === 2; }); } },
      { id: '7c', level: 'PRG', make: function (r) { return genBin(r, function (r) { return { m: 1, L1: lin(r.int(2, 3), L('x'), nz(r, -4, 4), 1), n: 1, L2: lin(1, L('x'), nz(r, -5, 5), 1) }; }, function (o, p) { return p.col.br.length === 2; }); } },
      { id: '7d', level: 'PRG', make: function (r) { var v = r.pick(['a', 'x']); return genBin(r, function (r) { var x = pq(r, 2, 5); return { m: x[0], L1: lin(1, L(v), nz(r, -4, 4), 1), n: x[1], L2: L(v) }; }, function (o, p) { return p.col.br.length === 2; }); } },
      { id: '7e', level: 'PRG', make: function (r) { var v = r.pick(['xyz', 'abc', 'pqr']); return genBin(r, function (r) { return { m: r.pick([1, 1, 2, 3]), L1: L(v[0]), n: 1, L2: lin(1, L(v[1]), r.pick([1, -1]), L(v[2])) }; }); } },
      { id: '7f', level: 'ADV', make: function (r) { return genBin(r, function (r) { var x = pq(r, 2, 7); return { m: x[0], L1: lin(1, L('x'), nz(r, -4, 4), 1), n: x[1], L2: lin(1, L('y'), nz(r, -4, 4), 1) }; }); } },
      { id: '7g', level: 'ADV', make: function (r) { return genBin(r, function (r) { var a = r.int(1, 3), b = r.int(1, 3), v = r.pick([['x', 'y'], ['a', 'b'], ['m', 'n']]); if (a === 1 && b === 1) return null; return { m: 1, L1: lin(a, L(v[0]), b, L(v[1])), n: 1, L2: lin(a, L(v[0]), -b, L(v[1])) }; }); } },
      { id: '7h', level: 'ADV', make: function (r) { return genBin(r, function (r) { var x = pq(r, 2, 5); return { m: x[0], L1: lin(r.int(2, 3), L('a'), nz(r, -3, 3), 1), n: x[1], L2: lin(1, L('a'), nz(r, -3, 3), 1) }; }, function (o, p) { return p.col.br.length === 2; }); } }] },
    { num: '8', section: 'Metal washer', shared: function (r) { return pickWhere(function () { return { p: r.int(2, 6), q: r.int(1, 4), r0: r.int(3, 8) }; }, function (o) { return o.r0 > o.q && !(o.p === 4 && o.q === 2); }); },
      stem: function (o) { return 'A metal washer is a disc of radius ' + t('(r+' + o.p + ')') + ' mm with a hole of radius ' + t('(r-' + o.q + ')') + ' mm cut from its centre.'; }, parts: [
      { id: '8a', level: 'EMG', make: function (r, o) {
        var A1 = '(r+' + o.p + ')', A2 = '(r-' + o.q + ')';
        return B.mc(r, 'Which expression is the area of the washer (not simplified)?', [
          { html: t('\\pi' + A1 + '^{2}-\\pi' + A2 + '^{2}'), right: true },
          { html: t('\\pi' + A1 + '^{2}+\\pi' + A2 + '^{2}'), why: 'The hole is cut <b>out</b>, so its area is subtracted.' },
          { html: t('2\\pi' + A1 + '-2\\pi' + A2), why: t('2\\pi r') + ' is the circumference. The area of a circle is ' + t('\\pi r^{2}') + '.' },
          { html: t('\\pi\\big[' + A1 + '-' + A2 + '\\big]^{2}'), why: 'Square each radius first, then subtract the areas: ' + t('\\pi R^{2}-\\pi r^{2}') + ', not ' + t('\\pi(R-r)^{2}') + '.' }],
          'Area of the disc minus the area of the hole: ' + t('\\pi' + A1 + '^{2}-\\pi' + A2 + '^{2}') + '.', ['A circle of radius ' + t('R') + ' has area ' + t('\\pi R^{2}') + '. The hole is removed.'], 'washer area expression');
      } },
      { id: '8b', level: 'PRG', make: function (r, o) {
        var p = dosBin({ m: 1, L1: lin(1, L('r'), o.p, 1), n: 1, L2: lin(1, L('r'), -o.q, 1), pre: L('Q'), exprTex: 'Q(r+' + o.p + ')^{2}-Q(r-' + o.q + ')^{2}', special: true, vars: ['r', 'pi'],
          solPre: 'Take out the common factor ' + t('Q') + ': ' + t('Q\\big[(r+' + o.p + ')^{2}-(r-' + o.q + ')^{2}\\big]') + '.<br>' });
        p.prompt = X.show('Factor the expression ' + t('Q(r+' + o.p + ')^{2}-Q(r-' + o.q + ')^{2}') + ' fully.');
        return p;
      } },
      { id: '8c', level: 'PRG', make: function (r, o) {
        var c = (o.p + o.q) * (2 * o.r0 + o.p - o.q);
        return B.number('Use the factored form to find the exact area when ' + t('r=' + o.r0) + '.', c, function (v) { if (v === (o.p + o.q) * (o.r0 + o.p - o.q) || v === Math.pow(o.r0 + o.p, 2) + Math.pow(o.r0 - o.q, 2)) return { code: 'p44-no-pi', hint: 'Substitute ' + t('r=' + o.r0) + ' into every factor of your factored form.' }; return null; },
          t('\\pi(' + (o.p + o.q) + ')(2(' + o.r0 + ')' + sg(o.p - o.q) + ')=' + c + '\\pi') + ' mm² &nbsp; (check: ' + t(Math.pow(o.r0 + o.p, 2) + '\\pi-' + Math.pow(o.r0 - o.q, 2) + '\\pi=' + c + '\\pi') + ')',
          ['Substitute ' + t('r=' + o.r0) + ' into the factored form from part (b).'], 'washer area at r', { before: 'Area =', after: t('\\pi') + ' mm²' });
      } }] },
    { num: '9', section: 'Choosing a method', stem: 'Factor fully. Choose the method using the checklist.', parts: [
      { id: '9a', level: 'EMG', make: function (r) { return gcfTri(r, false); } },
      { id: '9b', level: 'PRG', make: function (r) { return grouping(r); } },
      { id: '9c', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { var pr = r.pick([[6, 1], [3, 2], [2, 3], [5, 1], [4, 1], [3, 1]]); return { p1: pr[0], p2: pr[1], q1: nz(r, -5, 5), q2: nz(r, -5, 5), v: r.pick(['y', 'x']) }; }, function (o) {
          if (!coprime(o.p1, o.q1) || !coprime(o.p2, o.q2) || o.p1 * o.q2 + o.p2 * o.q1 === 0) return false;
          if ((o.q1 < 0 && isSq(o.p1) && isSq(-o.q1)) || (o.q2 < 0 && isSq(o.p2) && isSq(-o.q2))) return false;
          return fresh(qf(L(o.v, 2), [[o.p1, o.q1], [o.p2, o.q2]]).exprTex);
        });
        return qf(L(o.v, 2), [[o.p1, o.q1], [o.p2, o.q2]]).part();
      } },
      { id: '9d', level: 'EMG', make: function (r) { return perfSq(r); } },
      { id: '9e', level: 'EMG', make: function (r) { var o = pickWhere(function () { return { m: r.int(2, 5), k: r.int(1, 9), v: r.pick(['x', 'y']) }; }, function (o) { return o.k !== o.m * o.m && fresh(qf(L(o.v, 2), [[1, -o.m * o.m], [1, o.k]]).exprTex); }); return qf(L(o.v, 2), [[1, -o.m * o.m], [1, o.k]]).part(); } },
      { id: '9f', level: 'ADV', make: function (r) { return groupSq(r, ['a', 'b']); } }] },
    { num: '10', section: 'Is it a factor?', parts: [
      { id: '10', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { g: r.pick([2, 3, 5]), m: r.pick([2, 3]) }; }, function (o) { return !(o.g === 2 && o.m === 2) && !(o.g === 3 && o.m === 2); });
        var m = o.m, m2 = m * m, E = tx(P.scale(P.sub(L('x', 4), N(m2 * m2)), o.g));
        var yes = [{ tex: 'x+' + m, why: 'it is one of the factors' }, { tex: 'x-' + m, why: 'it is one of the factors' }, { tex: 'x^{2}+' + m2, why: 'it is one of the factors' }, { tex: 'x^{2}-' + m2, why: 'it is the product of ' + t('(x-' + m + ')(x+' + m + ')') }];
        var no = [{ tex: 'x-' + m2 }, { tex: 'x+' + m2 }, { tex: 'x^{2}-' + m }, { tex: 'x^{2}+' + m }];
        var nYes = r.pick([1, 2]), rowsY = r.sample(yes, nYes), rowsN = r.sample(no, 3 - nYes), rows = r.shuffle(rowsY.map(function (x) { return { y: 1, x: x }; }).concat(rowsN.map(function (x) { return { y: 0, x: x }; })));
        var want = {}; rows.forEach(function (rw, i) { want['r' + i] = rw.y ? 'yes' : 'no'; });
        var FF = o.g + '(x-' + m + ')(x+' + m + ')(x^{2}+' + m2 + ')';
        return B.grid('Determine whether each binomial is a factor of ' + t(E) + '.', rows.map(function (rw, i) { return { id: 'r' + i, html: '(' + String.fromCharCode(97 + i) + ') ' + t(rw.x.tex) }; }), [{ id: 'yes', html: 'Factor' }, { id: 'no', html: 'Not a factor' }], want, {},
          t(E + '=' + o.g + '(x^{4}-' + m2 * m2 + ')=' + o.g + '(x^{2}-' + m2 + ')(x^{2}+' + m2 + ')=' + FF) + '.<br>' + rows.map(function (rw, i) { return '(' + String.fromCharCode(97 + i) + ') ' + (rw.y ? '<b>Yes</b>: ' + rw.x.why : '<b>No</b>: ' + t(rw.x.tex) + ' is not in the factored form') + '.'; }).join(' &nbsp; '),
          ['Factor fully first (common factor, then a difference of squares twice).', 'A binomial is a factor if it appears in the fully factored form, or is a product of factors that appear there.'], 'is it a factor');
      } }] },
    { num: '11', section: 'Find the error', shared: function (r) { return pickWhere(function () { return { s: r.pick([2, 3]), a: r.pick([1, 1, 2]), b: r.int(1, 5), v: r.pick(['x', 'x', 'y']) }; }, function (o) { return coprime(o.a, o.b) && !(o.s === 2 && o.a === 1 && o.b === 3); }); },
      stem: function (o) { var E = tx(P.sub(M(o.s * o.s * o.a * o.a, o.v, 2), N(o.s * o.s * o.b * o.b))); return 'Raj factored ' + t(E) + ' as ' + t(br([M(o.s * o.a, o.v), N(-o.s * o.b)]) + br([M(o.s * o.a, o.v), N(o.s * o.b)])) + ' and said it was fully factored.'; }, parts: [
      { id: '11a', level: 'EMG', make: function (r, o) {
        var s = o.s, A = tx(M(s * o.a, o.v)), b = s * o.b;
        return B.mc(r, 'What is his error?', [
          { html: 'He didn’t take out the common factor first: both of his brackets still have a common factor of ' + t(s) + '.', right: true },
          { html: 'Nothing: ' + t('(' + A + '-' + b + ')(' + A + '+' + b + ')') + ' is fully factored.', why: 'Look inside each bracket: ' + t(A) + ' and ' + t(b) + ' share a factor of ' + t(s) + '.' },
          { html: 'It should be ' + t('(' + A + '-' + b + ')^{2}') + '.', why: t('(' + A + '-' + b + ')^{2}') + ' has a middle term. A difference of squares needs one minus and one plus bracket.' },
          { html: 'His brackets don’t multiply back to the expression.', why: 'Expand them: they do give the expression. The problem is that they aren’t factored <b>fully</b>.' }],
          'Each bracket still has a common factor of ' + t(s) + '. Taking out the GCF ' + t(s * s) + ' first avoids this.', ['Look inside each of Raj’s brackets: is there a common factor?'], 'Raj’s error');
      } },
      { id: '11b', level: 'PRG', make: function (r, o) {
        var p = dos(S(M(o.a, o.v), o.b, 1, o.s * o.s), { prompt: 'Factor ' + t(tx(P.sub(M(o.s * o.s * o.a * o.a, o.v, 2), N(o.s * o.s * o.b * o.b)))) + ' fully.' });
        p.bad = p.bad.concat([br([M(o.s * o.a, o.v), N(-o.s * o.b)]) + br([M(o.s * o.a, o.v), N(o.s * o.b)]) + '(1)']);
        return p;
      } }] },
    { num: '12', section: 'Multiple choice and numerical response', parts: [
      { id: '12', level: 'EMG', make: function (r) {
        var c = r.pick([[3, 1], [3, 2], [2, 3], [1, 2], [1, 4], [4, 1], [5, 1]]), a = c[0], b = c[1], v = r.pick(['x', 'x', 'y']);
        var E = tx(P.sub(M(Math.pow(a, 4), v, 4), N(Math.pow(b, 4)))), ax = tx(M(a, v)), sgnR = r.pick(['-', '+']);
        var opts = [{ html: t(ax + sgnR + b), right: true },
          { html: t(tx(P.sub(M(a * a, v), N(b * b)))), why: 'The square root of ' + t(tx(M(a * a * a * a, v, 4))) + ' is ' + t(tx(M(a * a, v, 2))) + ', so the brackets hold ' + t(v + '^{2}') + ', not ' + t(v) + '.' },
          { html: t(tx(P.add(M(a, v, 2), N(b)))), why: 'The coefficients must be square roots too: ' + t(tx(M(a * a * a * a, v, 4)) + '=\\left(' + tx(M(a * a, v, 2)) + '\\right)^{2}') + '.' },
          { html: t(tx(P.add(M(a * a, v), N(b * b)))), why: t(tx(P.add(M(a * a, v, 2), N(b * b)))) + ' is a sum of squares, but ' + t(tx(P.add(M(a * a, v), N(b * b)))) + ' (no square) is not a factor.' }];
        return B.mc(r, 'One factor of ' + t(E) + ' is', opts, t(E + '=(' + tx(P.sub(M(a * a, v, 2), N(b * b))) + ')(' + tx(P.add(M(a * a, v, 2), N(b * b))) + ')=(' + ax + '-' + b + ')(' + ax + '+' + b + ')(' + tx(P.add(M(a * a, v, 2), N(b * b))) + ')') + '.',
          ['Factor fully: a difference of squares twice.'], 'MC one factor');
      } },
      { id: '13', level: 'PRG', make: function (r) { return commonMC(r, true); } },
      { id: '14', level: 'EMG', make: function (r) {
        var c = r.int(2, 7), p = r.int(2, 4), v = r.pick(['x', 'y']);
        while (c === 5) c = r.int(2, 7);
        var opts = [{ html: t(tx(P.sub(M(p * p, v, 2), N(1)))), why: 'That is ' + t('(' + p + v + ')^{2}-1^{2}=(' + p + v + '-1)(' + p + v + '+1)') + '.' },
          { html: t(v + '^{2}+' + c * c), right: true },
          { html: t(c * c + '-' + v + '^{2}'), why: 'That is a difference of squares: ' + t('(' + c + '-' + v + ')(' + c + '+' + v + ')') + '.' },
          { html: t(v + '^{4}-' + c * c), why: 'That is a difference of squares: ' + t('(' + v + '^{2}-' + c + ')(' + v + '^{2}+' + c + ')') + '.' }];
        return B.mc(r, 'Which binomial <b>cannot</b> be factored over the real numbers?', opts, t(v + '^{2}+' + c * c) + ' is a <b>sum</b> of squares: it does not factor. Each of the others is a difference of squares.', ['Look for the one that is a <b>sum</b> of squares.'], 'MC cannot be factored');
      } },
      { id: '15', level: 'MAS', make: function (r) {
        var o = pickWhere(function () { return { m: r.int(1, 4), h: nz(r, -6, 6), k: nz(r, -6, 6) }; }, function (o) {
          var n = o.m + 1, a = o.m * o.h - n * o.k, c = o.m * o.h + n * o.k, b = 2 * o.m + 1; return a >= 1 && c >= 1 && coprime(b, c) && !(o.m === 3 && o.h === 2 && o.k === -1) && a + b + c < 100;
        });
        var n = o.m + 1, a = o.m * o.h - n * o.k, c = o.m * o.h + n * o.k, b = 2 * o.m + 1;
        var p = dosBin({ m: o.m, L1: lin(1, L('x'), o.h, 1), n: n, L2: lin(1, L('x'), o.k, 1) });
        return B.nr('The expression ' + t(p.exprTex) + ' can be factored as ' + t('-(x-a)(bx+c)') + ', where ' + t('a') + ', ' + t('b') + ' and ' + t('c') + ' are natural numbers. The value of ' + t('a+b+c') + ' is ____.', a + b + c,
          function (v) { if (v === b + c - a || v === a + b - c) return { code: 'p44-nr', hint: 'Write the first bracket as ' + t('-(x-a)') + ': take ' + t('-1') + ' out of it.' }; return null; },
          p.solution + '<br>' + t('=-(x-' + a + ')(' + b + 'x+' + c + ')') + ', so ' + t('a+b+c=' + a + '+' + b + '+' + c + '=' + (a + b + c)) + '.', p.hints, 'NR a+b+c');
      } },
      { id: '16', level: 'PRG', make: function (r) {
        var a = r.pick([1, 2, 4, 6]), v = r.pick(['x', 'y']), a4 = Math.pow(a, 4);
        return B.nr('When ' + t(v + '^{4}-' + a4) + ' is factored fully, it is ' + t('(' + v + '-a)(' + v + '+a)(' + v + '^{2}+b)') + '. The value of ' + t('a+b') + ' is ____.', a + a * a,
          function (x) { if (x === a * a + a * a) return { code: 'p44-nr', hint: 'In ' + t('(' + v + '-a)(' + v + '+a)') + ', ' + t('a') + ' is the square root of ' + t('b') + '.' }; return null; },
          t(v + '^{4}-' + a4 + '=(' + v + '^{2}-' + a * a + ')(' + v + '^{2}+' + a * a + ')=(' + v + '-' + a + ')(' + v + '+' + a + ')(' + v + '^{2}+' + a * a + ')') + '; ' + t('a=' + a + ',\\ b=' + a * a + ',\\ a+b=' + (a + a * a)),
          ['Use the difference of squares twice; the sum of squares stays.'], 'NR a+b');
      } }] }
  ];

  /* ---------------- helpers for the questions above ---------------- */
  function fmt(x) { return String(Math.round(x * 1e6) / 1e6); }
  /* a rectangle with area a²x² − b²y²: x, y chosen so the numbers stay friendly */
  function rect(r, excl) {
    return pickWhere(function () { return { a: r.int(2, 9), b: r.int(1, 7), x: r.pick([1.5, 2, 2.5, 3, 3.5, 4, 5, 6]), y: r.pick([0.5, 1, 1.5, 2, 2.5, 3]) }; }, function (o) {
      if (!coprime(o.a, o.b) || o.a === o.b) return false; var X0 = o.a * o.x, Y0 = o.b * o.y;
      if (Math.abs(X0 - Math.round(X0)) > 1e-9 || Math.abs(Y0 - Math.round(Y0)) > 1e-9 || X0 <= Y0 + 1) return false;
      return !(excl || []).some(function (e) { return e[0] === o.a && e[1] === o.b; });
    });
  }
  /* length and width of a rectangle with area a²x² − b²y² */
  function lwPart(o) {
    var Lp = P.add(M(o.a, 'x'), M(o.b, 'y')), Wp = P.sub(M(o.a, 'x'), M(o.b, 'y')), cL = K.poly(Lp), cW = K.poly(Wp);
    var fields = [{ name: 'Length', label: 'Length', mode: 'math', keys: 'poly', vars: ['x', 'y'] }, { name: 'Width', label: 'Width', mode: 'math', keys: 'poly', vars: ['x', 'y'] }];
    var p = B.fields('Write expressions for the length and the width.', fields, [cL, cW], [tx(Lp), tx(Wp)], 'Length ' + t(tx(Lp)) + ', width ' + t(tx(Wp)),
      t(tx(P.sub(M(o.a * o.a, 'x', 2), M(o.b * o.b, 'y', 2))) + '=(' + o.a + 'x)^{2}-(' + o.b + 'y)^{2}=(' + tx(Lp) + ')(' + tx(Wp) + ')') + '. With ' + t('x,y>0') + ' the plus bracket is longer: length ' + t(tx(Lp)) + ', width ' + t(tx(Wp)) + '.',
      ['Factor the area as a difference of squares.', 'The longer side is the one with ' + t('+' + o.b + 'y') + '.'], 'rug: length and width');
    var chk = p.check;
    p.check = function (resp) { if (resp && resp.length === 2 && cL(resp[1]).v === 'correct' && cW(resp[0]).v === 'correct') return wrong('p44-lw-swap', 'Those are the right factors, but the <b>length</b> is the longer side: ' + t(tx(Lp)) + ' (with ' + t('x,y>0') + ').'); return chk(resp); };
    p.bad = [[tx(Wp), tx(Lp)]];
    return p;
  }
  /* k(x² + bx + c) with a negative constant */
  function gcfTri(r, withX) {
    var o = pickWhere(function () { return { k: r.pick([2, 3, 4, 5, 6]), u: nz(r, -7, 7), w: nz(r, -7, 7), v: r.pick(['x', 'x', 'a']) }; }, function (o) { return o.u !== o.w && o.u + o.w !== 0 && o.u * o.w < 0 && !(o.k === 5 && o.u * o.w === -12 && o.u + o.w === -4) && !(withX && o.k === 3 && o.u * o.w === -5); });
    var v = L(o.v), g = withX ? P.scale(v, o.k) : N(o.k), s = X.sub({ U: v, f: [[1, o.u], [1, o.w]], g: g, mode: 'mono' });
    return s.part();
  }
  /* grouping two and two: (px − q)(x² − n²) expanded */
  function grouping(r, exclList) {
    var o = pickWhere(function () { return { p: r.pick([1, 2, 3, 1]), q: nz(r, -6, 6), n: r.int(1, 4) }; }, function (o) {
      var E = P.mul(lin(o.p, L('x'), -o.q, 1), P.sub(L('x', 2), N(o.n * o.n))); return coprime(o.p, o.q) && fresh(tx(E)) && o.n * o.n !== Math.abs(o.q);
    });
    var lnr = lin(o.p, L('x'), -o.q, 1), E = P.mul(lnr, P.sub(L('x', 2), N(o.n * o.n))), n2 = o.n * o.n;
    var key = '(' + tx(lnr) + ')(x-' + o.n + ')(x+' + o.n + ')';
    var sol = 'Four terms: group two and two.<br>' + t(tx(E) + '=x^{2}(' + tx(lnr) + ')-' + n2 + '(' + tx(lnr) + ')') + '<br>' + t('=(' + tx(lnr) + ')(x^{2}-' + n2 + ')') + '<br>' + t('=' + key);
    return X.fx({ prompt: t(tx(E)), key: key, sol: sol, text: 'factor by grouping ' + plain(tx(E)),
      ws: [{ is: [lnr, P.add(L('x', 2), N(n2))], code: 'p44-group', hint: 'Check the sign of the common factor you took out of the second pair: ' + t('-' + n2 + '(' + tx(lnr) + ')') + '.' }],
      hints: ['Four terms: group the first two and the last two, and take a common factor out of each pair.', 'The common binomial comes out; then check the other bracket — it is a difference of squares.'] });
  }
  /* a perfect square trinomial (my ± n)² */
  function perfSq(r) {
    var o = pickWhere(function () { return { m: r.int(2, 6), n: nz(r, -7, 7), v: r.pick(['x', 'x', 'y', 'a']) }; }, function (o) { return coprime(o.m, o.n) && fresh(tx(P.pow(lin(o.m, L(o.v), o.n, 1), 2))); });
    var b = lin(o.m, L(o.v), o.n, 1), E = P.pow(b, 2), e = tx(E), mid = 2 * o.m * Math.abs(o.n);
    return X.fx({ prompt: t(e), key: '(' + tx(b) + ')^{2}', text: 'factor perfect square ' + plain(e),
      sol: 'Three terms; the first and last are squares, ' + t(tx(M(o.m * o.m, o.v, 2)) + '=(' + tx(M(o.m, o.v)) + ')^{2}') + ' and ' + t(o.n * o.n + '=' + Math.abs(o.n) + '^{2}') + ', and the middle term is ' + t((o.n < 0 ? '-' : '') + '2(' + tx(M(o.m, o.v)) + ')(' + Math.abs(o.n) + ')=' + tx(M(o.n < 0 ? -mid : mid, o.v))) + '.<br>Perfect square: ' + t(e + '=(' + tx(b) + ')^{2}'),
      ws: [{ is: [lin(o.m, L(o.v), -o.n, 1), lin(o.m, L(o.v), o.n, 1)], code: 'p44-dos-square', hint: 'Those brackets multiply to ' + t(tx(P.mul(lin(o.m, L(o.v), -o.n, 1), b))) + ' — no middle term. This trinomial is a perfect square.' }],
      hints: ['Three terms: are the first and last terms perfect squares? Is the middle term twice the product of their square roots?', 'If so, it is ' + t('(A\\pm B)^{2}') + '; the sign is the sign of the middle term.'], good: ['(' + tx(b) + ')(' + tx(b) + ')'] });
  }
  /* grouping three and one: a² + 2ha + h² − n²b² = (a + h)² − (nb)² */
  function groupSq(r, vs) {
    var o = pickWhere(function () { return { h: nz(r, -7, 7), n: r.int(1, 5), k: r.pick([1, 1, 2]) }; }, function (o) {
      var a = L(vs[0]), b = L(vs[1]), Et = tx(P.pow(lin(o.k, a, o.h, 1), 2)) + '-' + tx(M(o.n * o.n, vs[1], 2)); return coprime(o.k, o.h) && fresh(Et) && !(o.k === 1 && o.h === 5 && o.n === 2);
    });
    var a = L(vs[0]), bq = L(vs[1]), Lb = lin(o.k, a, o.h, 1), E = P.sub(P.pow(Lb, 2), P.scale(sq(bq), o.n * o.n)), nb = tx(M(o.n, vs[1]));
    var key = '(' + tx(P.sub(Lb, M(o.n, vs[1]))) + ')(' + tx(P.add(Lb, M(o.n, vs[1]))) + ')';
    var Et = tx(P.pow(Lb, 2)) + '-' + tx(M(o.n * o.n, vs[1], 2));
    var sol = 'Four terms: the first three are a perfect square trinomial. Group them:<br>' + t(Et + '=(' + tx(P.pow(Lb, 2)) + ')-' + tx(M(o.n * o.n, vs[1], 2))) + '<br>' + t('=(' + tx(Lb) + ')^{2}-' + (o.n === 1 ? vs[1] : '(' + nb + ')') + '^{2}') + '<br>' + t('=' + key);
    return X.fx({ prompt: t(Et), key: key, sol: sol, text: 'factor grouping 3 and 1 ' + plain(tx(E)),
      ws: [{ is: [P.sub(lin(o.k, a, -o.h, 1), M(o.n, vs[1])), P.add(lin(o.k, a, -o.h, 1), M(o.n, vs[1]))], code: 'p44-group', hint: 'Group the perfect square first: ' + t(tx(P.pow(Lb, 2)) + '=(' + tx(Lb) + ')^{2}') + '. Both brackets start with ' + t(tx(Lb)) + '.' }],
      hints: ['Four terms: look for three that form a perfect square trinomial.', 'Write it as ' + t('(\\ldots)^{2}-(\\ldots)^{2}') + ' and use the difference of squares.'] });
  }
  /* common factor of a trinomial and a difference of squares */
  function commonMC(r, two) {
    var o = pickWhere(function () { return { p: r.int(2, 4), q: r.int(1, 4), s: r.pick([1, -1]), rr: r.int(1, 3), w: nz(r, -4, 4) }; }, function (o) {
      return coprime(o.p, o.q) && coprime(o.rr, o.w) && o.rr * o.q * o.s !== o.p * o.w && o.rr * o.q * o.s !== -o.p * o.w && !(o.p === 3 && o.q === 2 && o.s === 1 && o.rr === 2 && o.w === -1) && !(o.p === 2 && o.q === 3 && o.s === -1 && o.rr === 1 && o.w === 4);
    });
    var x = L('x'), y = two ? L('y') : N(1), c = lin(o.p, x, o.s * o.q, y), other = lin(o.p, x, -o.s * o.q, y), f2 = lin(o.rr, x, o.w, y), f2b = lin(o.rr, x, -o.w, y);
    var T1 = P.mul(c, f2), T2 = P.mul(c, other);
    var opts = [{ html: t(tx(c)), right: true }, { html: t(tx(other)), why: t(tx(other)) + ' is a factor of ' + t(tx(T2)) + ' only.' },
      { html: t(tx(f2)), why: t(tx(f2)) + ' is a factor of ' + t(tx(T1)) + ' only.' }, { html: t(tx(f2b)), why: 'Factor both polynomials and compare: ' + t(tx(f2b)) + ' is a factor of neither.' }];
    return B.mc(r, two ? 'The polynomials ' + t(tx(T1)) + ' and ' + t(tx(T2)) + ' have a common factor of' : 'Which binomial is a factor of both ' + t(tx(T1)) + ' and ' + t(tx(T2)) + '?', opts,
      t(tx(T1) + '=(' + tx(c) + ')(' + tx(f2) + ')') + ' and ' + t(tx(T2) + '=(' + tx(P.sub(M(o.p, 'x'), P.scale(y, o.q))) + ')(' + tx(P.add(M(o.p, 'x'), P.scale(y, o.q))) + ')') + ', so the common factor is ' + t(tx(c)) + '.',
      ['Factor each polynomial fully (decomposition for the trinomial, difference of squares for the binomial), then compare.'], 'MC common factor');
  }

  var EXTRA = [
    { num: 'A1', section: 'A. Skills', stem: 'Factor fully, if possible. If an expression can’t be factored, press <b>none</b>.', parts: [
      { id: 'A1a', level: 'BEG', make: function (r) { return gen(r, function (r) { var x = pq(r, 2, 12); return S(M(x[0], 'x'), x[1]); }, { none: true }); } },
      { id: 'A1b', level: 'BEG', make: function (r) { return gen(r, function (r) { var x = pq(r, 2, 10); return S(M(x[0], 'a'), M(x[1], 'b')); }, { none: true }); } },
      { id: 'A1c', level: 'BEG', make: function (r) { return gen(r, function (r) { var x = pq(r, 1, 9, function (x) { return x[0] > 1; }); return S(M(x[0], 'xy'), x[1]); }, { none: true }); } },
      { id: 'A1d', level: 'EMG', make: function (r) { return gen(r, function (r) { return S(L(r.pick(['x', 'y'])), r.int(2, 6), 1, r.pick([2, 3, 5, 6, 7])); }, { none: true }); } },
      { id: 'A1e', level: 'EMG', make: function (r) { return gen(r, function (r) { var x = pq(r, 1, 5, function (x) { return x[0] > 1; }); return S(M(x[0], 'm'), M(x[1], 'n'), 1, r.pick([2, 3, 5, 6, 7])); }, { none: true }); } },
      { id: 'A1f', level: 'EMG', make: function (r) { var o = pickWhere(function () { return r.int(2, 9); }, function (n) { return n !== 8; }); return nonePart(L('x'), M(o, 'y')); } },
      { id: 'A1g', level: 'PRG', make: function (r) { var o = pickWhere(function () { return pq(r, 2, 7); }, function (x) { return !(x[0] === 5 && x[1] === 2); }); var s = S(M([1, o[0]], 'x'), [1, o[1]]);
        var key = '\\left(\\frac{x}{' + o[0] + '}-\\frac{1}{' + o[1] + '}\\right)\\left(\\frac{x}{' + o[0] + '}+\\frac{1}{' + o[1] + '}\\right)';
        return dos(s, { none: true, keyTex: key, sol: 'Both terms are perfect squares: ' + t('\\frac{1}{' + o[0] * o[0] + '}x^{2}=\\left(\\frac{x}{' + o[0] + '}\\right)^{2}') + ' and ' + t('\\frac{1}{' + o[1] * o[1] + '}=\\left(\\frac{1}{' + o[1] + '}\\right)^{2}') + '.<br>' + t(exprTexOf(s) + '=' + key) }); } },
      { id: 'A1h', level: 'PRG', make: function (r) { var p = pickWhere(function () { return r.int(1, 9); }, function (p) { return p !== 9; }), v = r.pick(['y', 'x']); var s = S(N([p, 10]), L(v));
        var dd = tx(N([p, 10]), { dec: true }), key = '(' + dd + '-' + v + ')(' + dd + '+' + v + ')';
        return dos(s, { none: true, dec: true, keyTex: key, sol: 'Decimals work too: ' + t(tx(N([p * p, 100]), { dec: true }) + '=' + dd + '^{2}') + '.<br>' + t(exprTexOf(s, { dec: true }) + '=' + key) }); } },
      { id: 'A1i', level: 'PRG', make: function (r) { var v = r.pick(['a', 'x', 'm']); return gen(r, function (r) { var x = pq(r, 1, 4, function (x) { return x[0] > 1; }); return S(M(x[0], v), x[1], 1, -r.pick([2, 3, 5])); }, { none: true }); } }] },
    { num: 'A2', stem: 'Factor fully.', parts: [
      { id: 'A2a', level: 'EMG', make: function (r) { var v = r.pick(['y', 'x', 'n']); return gen(r, function (r) { return S(L(v), r.int(1, 3), 2); }); } },
      { id: 'A2b', level: 'PRG', make: function (r) { return gen(r, function (r) { var x = pq(r, 1, 5, function (x) { return Math.max(x[0], x[1]) > 1 && Math.pow(Math.max(x[0], x[1]), 4) <= 625; }); return S(M(x[0], 'a'), M(x[1], 'b'), 2); }); } },
      { id: 'A2c', level: 'PRG', make: function (r) { return gen(r, function (r) { return S(L(r.pick(['x', 'y'])), r.int(1, 2), 2, r.pick([2, 3, 5, 7])); }); } },
      { id: 'A2d', level: 'EMG', make: function (r) { var c = r.pick([[2, 1], [1, 2], [2, 3], [3, 2]]); return gen(r, function (r) { return S(P.mono(1, { x: c[0], y: c[1] }), r.int(2, 9)); }); } }] },
    { num: 'A3', stem: 'Factor fully. Simplify each factor.', parts: [
      { id: 'A3a', level: 'EMG', make: function (r) { return genBin(r, function (r) { return { m: 1, L1: lin(1, L('x'), nz(r, -8, 8), 1), n: r.int(2, 7), L2: 1 }; }, function (o, p) { return p.col.br.length === 2; }); } },
      { id: 'A3b', level: 'PRG', make: function (r) { var v = r.pick(['y', 'x']); return genBin(r, function (r) { return { m: r.int(3, 7), L1: 1, n: 1, L2: lin(2, L(v), r.pick([-3, -1, 1, 3]), 1) }; }, function (o, p) { return p.col.br.length === 2; }); } },
      { id: 'A3c', level: 'PRG', make: function (r) { return genBin(r, function (r) { return { m: 1, L1: lin(1, L('x'), nz(r, -6, 6), 1), n: 1, L2: lin(1, L('x'), nz(r, -6, 6), 1) }; }, function (o, p) { return p.col.br.length === 1; }); } },
      { id: 'A3d', level: 'ADV', make: function (r) { return genBin(r, function (r) { var x = pq(r, 2, 5); return { m: x[0], L1: lin(1, L('x'), nz(r, -3, 3), 1), n: x[1], L2: lin(1, L('y'), nz(r, -3, 3), 1) }; }); } }] },
    { num: 'B1', section: 'B. Applying', parts: [
      { id: 'B1', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { var k = r.pick([[3, 2], [2, 1], [3, 1], [4, 1]]); return { a: r.int(2, 7), b: r.int(1, 6), k: k, X0: r.int(2, 12) * (k[0] + k[1]) }; }, function (o) {
          var Y0 = o.X0 * (o.k[0] - o.k[1]) / (o.k[0] + o.k[1]), x = o.X0 / o.a, y = Y0 / o.b;
          var term = function (v) { return Math.abs(v * 100 - Math.round(v * 100)) < 1e-9; };
          return coprime(o.a, o.b) && o.a !== o.b && term(x) && term(y) && o.X0 <= 60 && !(o.a === 5 && o.b === 4 && o.X0 === 15);
        });
        var Y0 = o.X0 * (o.k[0] - o.k[1]) / (o.k[0] + o.k[1]), x = o.X0 / o.a, y = Y0 / o.b, Pm = 4 * o.X0, ratio = o.k[0] / o.k[1], Lv = o.X0 + Y0, Wv = o.X0 - Y0;
        var rt = o.k[1] === 1 ? String(o.k[0]) : fmt(ratio);
        return B.fields('A rectangular poster has an area of ' + t(tx(P.sub(M(o.a * o.a, 'x', 2), M(o.b * o.b, 'y', 2)))) + ' square centimetres; its length and width are of the form ' + t('ax+by') + ' with integers ' + t('a') + ' and ' + t('b') + '. The perimeter is ' + t(Pm) + ' cm and the length is ' + t(rt) + ' times the width. Find ' + t('x') + ', ' + t('y') + ' and the dimensions.',
          [{ name: 'x', label: t('x=') }, { name: 'y', label: t('y=') }, { name: 'Length', label: 'Length', after: 'cm' }, { name: 'Width', label: 'Width', after: 'cm' }],
          [K.number(x, function (v) { if (Math.abs(v - Pm / (2 * o.a)) < 1e-9) return { code: 'p44-perim-half', hint: 'The perimeter is ' + t('2(l+w)') + '.' }; return null; }), K.number(y), K.number(Lv), K.number(Wv)],
          [fmt(x), fmt(y), fmt(Lv), fmt(Wv)], t('x=' + fmt(x) + ',\\ y=' + fmt(y)) + '; ' + t(fmt(Lv)) + ' cm by ' + t(fmt(Wv)) + ' cm',
          'Length ' + t(o.a + 'x+' + o.b + 'y') + ', width ' + t(o.a + 'x-' + o.b + 'y') + '. Perimeter ' + t(4 * o.a + 'x=' + Pm + '\\Rightarrow x=' + fmt(x)) + '.<br>' + t(fmt(o.X0) + '+' + o.b + 'y=' + rt + '(' + fmt(o.X0) + '-' + o.b + 'y)\\Rightarrow y=' + fmt(y)) + '.<br>Length ' + t(fmt(o.X0) + '+' + fmt(Y0) + '=' + fmt(Lv)) + ' cm, width ' + t(fmt(o.X0) + '-' + fmt(Y0) + '=' + fmt(Wv)) + ' cm.',
          ['Factor the area: length ' + t(o.a + 'x+' + o.b + 'y') + ', width ' + t(o.a + 'x-' + o.b + 'y') + '. The perimeter gives ' + t('x') + '.', 'Then length ' + t('=') + ' ' + rt + ' × width gives an equation in ' + t('y') + '.'], 'poster: x, y, dimensions');
      } }] },
    { num: 'B2', section: 'Picture frame', shared: function (r) { return pickWhere(function () { return { p: r.int(2, 4), h1: r.int(1, 6), h2: r.int(1, 7), x0: r.int(3, 8) }; }, function (o) { return o.p * o.x0 + o.h1 > o.x0 + o.h2 + 1 && o.h1 !== o.h2 && !(o.p === 3 && o.h1 === 2 && o.h2 === 4); }); },
      stem: function (o) { return 'A square picture frame has outer side length ' + t('(' + o.p + 'x+' + o.h1 + ')') + ' cm and a square opening of side length ' + t('(x+' + o.h2 + ')') + ' cm.'; }, parts: [
      { id: 'B2a', level: 'PRG', make: function (r, o) { var p = dosBin({ m: 1, L1: lin(o.p, L('x'), o.h1, 1), n: 1, L2: lin(1, L('x'), o.h2, 1) }); p.prompt = 'Write and fully factor an expression for the area of the frame.'; p.solution = 'Area ' + t('=' + p.exprTex) + '<br>' + p.solution; return p; } },
      { id: 'B2b', level: 'PRG', make: function (r, o) {
        var A = Math.pow(o.p * o.x0 + o.h1, 2) - Math.pow(o.x0 + o.h2, 2), p = dosBin({ m: 1, L1: lin(o.p, L('x'), o.h1, 1), n: 1, L2: lin(1, L('x'), o.h2, 1) });
        return B.number('Find the area of the frame when ' + t('x=' + o.x0) + '.', A, function (v) { if (v === Math.pow(o.p * o.x0 + o.h1, 2)) return { code: 'p44-dim', hint: 'Subtract the area of the opening.' }; return null; },
          t(p.keyTex) + ' at ' + t('x=' + o.x0) + ': ' + t(A) + ' cm² &nbsp; (check: ' + t((o.p * o.x0 + o.h1) + '^{2}-' + (o.x0 + o.h2) + '^{2}=' + A) + ')', ['Substitute into the factored form from part (a), or into each square.'], 'frame area', { after: 'cm²' });
      } }] },
    { num: 'B3', stem: 'Factor fully.', parts: [
      { id: 'B3a', level: 'EMG', make: function (r) { return gcfTri(r, true); } },
      { id: 'B3b', level: 'PRG', make: function (r) { return grouping(r); } },
      { id: 'B3c', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { p: r.pick([2, 3]), q: r.int(1, 3), s: r.int(1, 3) }; }, function (o) { return coprime(o.p, o.q) && o.p * o.p * o.s * o.s !== o.q * o.q && fresh(qf(L('x', 2), [[o.p * o.p, -o.q * o.q], [1, -o.s * o.s]]).exprTex); });
        return qf(L('x', 2), [[o.p * o.p, -o.q * o.q], [1, -o.s * o.s]]).part();
      } },
      { id: 'B3d', level: 'PRG', make: function (r) { return genBin(r, function (r) { return { m: r.int(2, 5), L1: lin(1, L('x'), nz(r, -4, 4), 1), n: r.int(2, 7), L2: 1 }; }, function (o, p) { return coprime(o.m, o.n) && p.col.br.length === 2; }); } }] },
    { num: 'B4', parts: [
      { id: 'B4', level: 'PRG', make: function (r) { return commonMC(r, false); } }] },
    { num: 'B5', parts: [
      { id: 'B5', level: 'MAS', make: function (r) {
        var o = pickWhere(function () { var mn = pq(r, 2, 7, function (x) { return x[0] > x[1]; }); return { m: mn[0], n: mn[1], h1: nz(r, -5, 5), h2: nz(r, -5, 5) }; }, function (o) {
          var p = dosBin({ m: o.m, L1: lin(1, L('x'), o.h1, 1), n: o.n, L2: lin(1, L('x'), o.h2, 1) }), c = p.col;
          if (c.br.length !== 2 || !fresh(p.exprTex) || P.vars(c.mono).length || P.constant(c.mono)[0] < 1) return false;
          var b0 = c.br[0].p, b1 = c.br[1].p, mon = [b0, b1].filter(function (b) { return P.coef(b, { x: 1 })[0] === 1 && P.constant(b)[0] > 0; }), oth = [b0, b1].filter(function (b) { return P.constant(b)[0] < 0; });
          return mon.length >= 1 && oth.length === 1 && mon[0] !== oth[0] && !(o.m === 7 && o.n === 3) && P.constant(c.mono)[0] >= 2 && P.constant(mon[0])[0] <= 20 && -P.constant(oth[0])[0] <= 30;
        });
        var p = dosBin({ m: o.m, L1: lin(1, L('x'), o.h1, 1), n: o.n, L2: lin(1, L('x'), o.h2, 1) }), c = p.col, k = P.constant(c.mono)[0];
        var mon = c.br.filter(function (b) { return P.coef(b.p, { x: 1 })[0] === 1 && P.constant(b.p)[0] > 0; })[0].p, oth = c.br.filter(function (b) { return P.constant(b.p)[0] < 0; })[0].p;
        var a = P.constant(mon)[0], b = P.coef(oth, { x: 1 })[0], cc = -P.constant(oth)[0];
        return B.nr('The expression ' + t(p.exprTex) + ' can be factored as ' + t('k(x+a)(bx-c)') + ', where ' + t('k') + ', ' + t('a') + ', ' + t('b') + ' and ' + t('c') + ' are natural numbers. The value of ' + t('k+a+b+c') + ' is ____.', k + a + b + cc,
          function (v) { if (v === a + b + cc || v === a + b + cc + 1) return { code: 'p44-nr', hint: 'Take the common factors out of both brackets: ' + t('k') + ' is their product.' }; return null; },
          p.solution + '<br>' + t('k+a+b+c=' + k + '+' + a + '+' + b + '+' + cc + '=' + (k + a + b + cc)), p.hints, 'NR k+a+b+c');
      } }] },
    { num: 'C1', section: 'C. Stretch', parts: [
      { id: 'C1', level: 'ADV', make: function (r) { var vs = ['x', 'y']; var o = pickWhere(function () { return { s: r.pick([1, -1]), n: r.int(1, 5) }; }, function (o) { return !(o.s === -1 && o.n === 3); });
        var Lb = lin(1, L('x'), o.s, L('y')), E = P.sub(P.pow(Lb, 2), M(o.n * o.n, 'z', 2)), nz2 = tx(M(o.n, 'z'));
        var key = '(' + tx(Lb) + '-' + nz2 + ')(' + tx(Lb) + '+' + nz2 + ')';
        return X.fx({ prompt: 'Factor fully: ' + t(tx(E)) + '.', key: key, text: 'factor grouping 3 and 1 with z',
          sol: t(tx(E) + '=(' + tx(P.pow(Lb, 2)) + ')-' + tx(M(o.n * o.n, 'z', 2)) + '=(' + tx(Lb) + ')^{2}-' + (o.n === 1 ? 'z' : '(' + nz2 + ')') + '^{2}') + '<br>' + t('=' + key),
          hints: ['Look for three terms that form a perfect square trinomial.', 'Then it is a difference of squares: ' + t('(\\ldots)^{2}-(' + nz2 + ')^{2}') + '.'], good: ['(' + tx(Lb) + '+' + nz2 + ')(' + tx(Lb) + '-' + nz2 + ')'] }); } }] },
    { num: 'C2', parts: [
      { id: 'C2', level: 'MAS', make: function (r) {
        var o = pickWhere(function () { var rs = r.sample([1, 2, 3, 4, 5], 2); return { r1: Math.min(rs[0], rs[1]), r2: Math.max(rs[0], rs[1]), v: r.pick(['a', 'x']) }; }, function (o) { var p = o.r1 + o.r2, q = o.r1 * o.r2; return !isSq(p * p + 4 * q) && !(o.r1 === 1 && o.r2 === 2); });
        var v = L(o.v), p = o.r1 + o.r2, q = o.r1 * o.r2, Lb = lin(p, v, -q, 1), E = '\\displaystyle ' + o.v + '^{4}-(' + tx(Lb) + ')^{2}';
        var m1 = P.sub(sq(v), Lb), p1 = P.add(sq(v), Lb), key = '(' + o.v + '-' + o.r1 + ')(' + o.v + '-' + o.r2 + ')(' + tx(p1) + ')';
        return X.fx({ prompt: 'Factor fully: ' + t(o.v + '^{4}-(' + tx(Lb) + ')^{2}') + '.', key: key, text: 'a⁴ − (pa − q)²',
          sol: t(o.v + '^{4}=(' + o.v + '^{2})^{2}') + ', so with ' + t('A=' + o.v + '^{2}') + ' and ' + t('B=' + tx(Lb)) + ':<br>' + t('\\big[' + o.v + '^{2}-(' + tx(Lb) + ')\\big]\\big[' + o.v + '^{2}+(' + tx(Lb) + ')\\big]=(' + tx(m1) + ')(' + tx(p1) + ')') + '<br>The first trinomial factors (product ' + t(q) + ', sum ' + t(-p) + '); the second does not (no integers with product ' + t(-q) + ' and sum ' + t(p) + ').<br>' + t('=' + key),
          ws: [{ is: [P.sub(sq(v), lin(p, v, q, 1)), P.add(sq(v), Lb)], code: 'p44-minus-br', hint: 'In ' + t('A-B') + ' the minus applies to both terms of ' + t('(' + tx(Lb) + ')') + ': ' + t(o.v + '^{2}-' + p + o.v + '+' + q) + '.' }],
          hints: ['Write ' + t(o.v + '^{4}') + ' as ' + t('(' + o.v + '^{2})^{2}') + ' and use the difference of squares with ' + t('B=' + tx(Lb)) + ' in brackets.', 'Then check whether each trinomial factors.'] });
      } }] },
    { num: 'C3', stem: 'Use a difference of squares to evaluate without a calculator.', parts: [
      { id: 'C3a', level: 'ADV', make: function (r) { return evalPart(r, r.pick([50, 100, 100, 200, 40, 60]), r.int(1, 6)); } },
      { id: 'C3b', level: 'ADV', make: function (r) { return evalPart(r, r.pick([2025, 2030, 1999, 3005, 1500]), r.int(1, 2)); } }] }
  ];
  function evalPart(r, c, d) {
    if (c === 100 && d === 3) d = 4; if (c === 2025 && d === 1) d = 2;
    var Nn = c + d, Mm = c - d, ans = Nn * Nn - Mm * Mm;
    return B.number(t(Nn + '^{2}-' + Mm + '^{2}'), ans, function (v) { if (v === Math.pow(Nn - Mm, 2)) return { code: 'p44-eval', hint: t('A^{2}-B^{2}=(A-B)(A+B)') + ', not ' + t('(A-B)^{2}') + '.' }; if (v === Nn - Mm || v === Nn + Mm) return { code: 'p44-eval', hint: 'Multiply the two factors: ' + t('(A-B)(A+B)') + '.' }; return null; },
      t(Nn + '^{2}-' + Mm + '^{2}=(' + Nn + '-' + Mm + ')(' + Nn + '+' + Mm + ')=' + (Nn - Mm) + '(' + (Nn + Mm) + ')=' + ans), ['Use ' + t('A^{2}-B^{2}=(A-B)(A+B)') + ': the factors are easy to multiply.'], 'evaluate with a difference of squares');
  }

  /* the multiple-choice / numerical-response block is written as one list of parts; each part is its own booklet question */
  function splitQs(qs) {
    var out = [];
    qs.forEach(function (q) {
      if (q.parts.length > 1 && q.parts.every(function (pt) { return /^\d+$/.test(pt.id); })) q.parts.forEach(function (pt, i) { out.push({ num: pt.id, section: i ? undefined : q.section, parts: [pt] }); });
      else out.push(q);
    });
    return out;
  }
  HW.defineLesson({ id: 'u4l4', unit: 4, num: '4', title: 'Differences of Squares, Including a²(f(x))² − b²(g(y))²', outcome: 'RF1', calc: true, questions: splitQs(QUESTIONS), extra: EXTRA });
})(window);
