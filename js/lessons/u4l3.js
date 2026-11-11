/* Math 20-1 · Unit 4 · Lesson 3 — Factoring by Substitution: a(f(x))² + b(f(x)) + c (outcome RF1 on every part)
 * Assignment 3 (u4_l03.tex, Questions 1–15) and the Lesson 3 Extra Practice (u4_ep03.tex, A1–A3, B1–B6, C1–C3).
 * Every part is a generator: the booklet question's idea, form and difficulty with new numbers (the lesson's example
 * numbers and the booklet question's own numbers are left out). No calculator (Unit 4): exact answers.
 *
 * This file also holds the factoring kit shared by Lessons 3 and 4 (HW.p43); u4l4.js needs it, so this file loads first.
 *   X.sub(o)      a trinomial in quadratic form, a(U)² + b(U)(V) + c(V)², built from its factors g(p₁U + q₁V)(p₂U + q₂V):
 *                 U, V monomials (x², y³, xy, sin x) shown expanded, or binomials (x + 3, 1 − x) shown in brackets.
 *                 Gives the key (fully factored: brackets simplified, common factors out in front, differences of squares
 *                 split), the booklet's worked solution (let A = …, product/sum or decomposition, substitute back, simplify)
 *                 and the classic wrong answers (left in A, the binomial not put back, the coefficient not distributed,
 *                 x for x², the common factor lost, a sum of squares "factored").
 *   X.fx(o)       a "factor" part graded by K.factored (js/factor.js), plus a nudge for an unsimplified bracket such as
 *                 (x + 2 − 2), and sin x / cos x / π read as letters (S, C, Q inside; shown as \sin x, \cos x, \pi).
 *   X.collect / X.cTex   a product put in standard form (number and monomial in front, primitive brackets, powers).
 *   W.KEYSETS.p43 the poly keypad plus sin x, sin²x, cos x, cos²x and π keys when a part needs them.
 * K.factored already handles two variables (x² − 5xy + 6y²), fractional common factors (½(x − 4)(x + 2) and
 * (½x − 2)(x + 4) both accepted) and substitution results; nothing in it needed changing.
 *
 * Conversions: Q7 "factor two ways; which was faster?" → (a) factor by substitution, (b) the trinomial you get by
 * expanding first (the solution compares the two); Q9 → (a) factor, (b) x and the area; Q10, Extra C3 "find all
 * integers" → a number list; multiple choice stays multiple choice, numerical response → a number box.
 * Levels: LIM BEG EMG PRG ADV MAS. Mastery: Q8, Q10, Extra C2, C3. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, B = K.P, P = HW.poly, FX = HW.factor, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
  var LID = 'u4l3';

  /* ============================== the factoring kit (Lessons 3–4) ============================== */
  var X = HW.p43 = {};
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var r = a % b; a = b; b = r; } return a; }
  function isSq(n) { if (!(n > 0)) return false; var s = Math.round(Math.sqrt(n)); return s * s === n; }
  function isCube(n) { n = Math.abs(n); var s = Math.round(Math.cbrt(n)); return s * s * s === n; }
  function pickWhere(gen, test, lid) { for (var i = 0; i < 8000; i++) { var o = gen(); if (test(o)) return o; } throw new Error((lid || LID) + ': no valid numbers'); }
  function lift(a) { return typeof a === 'number' || Array.isArray(a) ? P.num(a) : typeof a === 'string' ? P.parse(a) : a; }
  function N(c) { return P.num(c); }
  function tx(p, o) { return P.tex(lift(p), o); }
  function lin(c1, u1, c2, u2) { return P.add(P.scale(lift(u1), c1), P.scale(lift(u2), c2)); }
  function isOne(p) { p = lift(p); return P.eq(p, N(1)); }
  function key0(s) { return String(s).replace(/\\left|\\right|[{}\s]/g, ''); }
  function sg(n) { return n < 0 ? '-' + (-n) : '+' + n; }
  function nz(r, a, b) { var v = 0; while (!v) v = r.int(a, b); return v; }
  function plain(s) { return String(s).replace(/\\left|\\right|\\big|\\Big/g, '').replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, '$1/$2').replace(/[{}]/g, '').replace(/\\/g, ''); }
  X.gcd = gcd; X.isSq = isSq; X.pickWhere = pickWhere; X.lift = lift; X.tx = tx; X.lin = lin; X.key0 = key0; X.sg = sg; X.nz = nz; X.plain = plain; X.isOne = isOne;

  /* ---- sin x, cos x and π are the letters S, C and Q inside (polynomial algebra works on them) ---- */
  var TRIG = { S: '\\sin', C: '\\cos' };
  function showMath(s) {
    return String(s).replace(/(^|[^\\a-zA-Z])([SCQ])(?:\^\{(\d+)\})?/g, function (m, pre, L, e) {
      if (L === 'Q') return pre + '\\pi ' + (e ? '^{' + e + '}' : '');
      return pre + TRIG[L] + (e ? '^{' + e + '}' : '') + ' x';
    });
  }
  function show(html) { return String(html == null ? '' : html).replace(/\\\(([\s\S]*?)\\\)/g, function (m, b) { return '\\(' + showMath(b) + '\\)'; }); }
  function unshow(resp) {
    var s = String(resp == null ? '' : resp).replace(/\\left|\\right/g, '').replace(/\\(?:operatorname|mathrm|text)\{\s*(sin|cos)\s*\}/g, '\\$1');
    s = s.replace(/\\?(sin|cos)\s*(?:\^\s*(?:\{\s*(\d+)\s*\}|(\d)))?\s*(?:\(\s*x\s*\)|\{\s*x\s*\}|x)(?:\s*\^\s*(?:\{\s*(\d+)\s*\}|(\d)))?/g, function (m, f, e1, e2, e3, e4) {
      var e = e1 || e2 || e3 || e4; return (f === 'sin' ? 'S' : 'C') + (e ? '^{' + e + '}' : '');
    });
    return s.replace(/\\pi(?![a-zA-Z])|π|\bpi\b/g, 'Q');
  }
  X.show = show; X.showMath = showMath; X.unshow = unshow;

  /* ---- standard form of a product: number × monomial in front, primitive brackets (positive leading term), powers ---- */
  function sqrtMono(T) {
    var c = T.c; if (c[0] <= 0 || !isSq(c[0]) || !isSq(c[1])) return null;
    var v = {}, okv = true; Object.keys(T.v).forEach(function (x) { if (T.v[x] % 2) okv = false; else v[x] = T.v[x] / 2; });
    return okv ? P.mono([Math.round(Math.sqrt(c[0])), Math.round(Math.sqrt(c[1]))], v) : null;
  }
  /* a primitive binomial that is a difference of squares → its factors (the minus bracket split again while it can be) */
  function dosSplit(p) {
    var ts = P.sorted(p);
    if (ts.length !== 2 || ts[0].c[0] < 0 || ts[1].c[0] > 0) return [p];
    var a = sqrtMono(ts[0]), b = sqrtMono({ c: [-ts[1].c[0], ts[1].c[1]], v: ts[1].v });
    if (!a || !b) return [p];
    return dosSplit(P.sub(a, b)).concat([P.add(a, b)]);
  }
  function collect(list, split) {
    var mono = N(1), br = [];
    function addBr(p, k) { for (var i = 0; i < br.length; i++) if (P.eq(br[i].p, p)) { br[i].k += k; return; } br.push({ p: p, k: k }); }
    list.forEach(function (f) {
      var p = lift(f && f.p ? f.p : f), k = (f && f.k) || 1;
      if (!P.count(p)) throw new Error('p43: zero factor');
      if (P.count(p) === 1) { mono = P.mul(mono, P.pow(p, k)); return; }
      var cn = FX.content(p);
      mono = P.mul(mono, P.pow(P.mono(cn.c, cn.v), k));
      (split ? dosSplit(cn.prim) : [cn.prim]).forEach(function (q) { addBr(q, k); });
    });
    return { mono: mono, br: br };
  }
  /* LaTeX of a collected product. o.flip: a negative number in front is moved into one bracket instead, written with its
   * constant first (−(a − 4)(a + 8) → (4 − a)(a + 8)); o.rev: brackets in reverse order */
  function cTex(c, o) {
    o = o || {};
    var mono = c.mono, brs = c.br.map(function (b) { return { p: b.p, k: b.k, s: tx(b.p) }; });
    if (o.rev) brs.reverse();
    var lead = P.terms(mono)[0].c[0];
    if (lead < 0 && o.flip) {
      var at = -1;
      for (var i = 0; i < brs.length; i++) if (brs[i].k % 2 === 1 && P.constant(brs[i].p)[0] !== 0) { at = i; break; }
      if (at < 0) for (var j = 0; j < brs.length; j++) if (brs[j].k % 2 === 1) { at = j; break; }
      if (at >= 0) { brs[at].s = tx(P.neg(brs[at].p), { order: 'asc' }); mono = P.neg(mono); }
    }
    var mt = tx(mono), pre = mt === '1' ? '' : mt === '-1' ? '-' : mt;
    if (!brs.length) return mt;
    return pre + brs.map(function (b) { return '(' + b.s + ')' + (b.k > 1 ? '^{' + b.k + '}' : ''); }).join('');
  }
  function prodTex(list) { return list.map(function (p) { return '(' + tx(p) + ')'; }).join(''); }
  X.sqrtMono = sqrtMono; X.dosSplit = dosSplit; X.collect = collect; X.cTex = cTex; X.prodTex = prodTex;
  /* a term c·body for an expression written in the booklet's form: 3(x+1)^{2}, -(x-1)^{2}, +5(x+3) */
  function cterm(c, body, first) { if (!c) return ''; var s = c < 0 ? '-' : first ? '' : '+', m = Math.abs(c) === 1 ? '' : String(Math.abs(c)); return s + m + body; }
  function ctermAll(list) { var out = ''; list.forEach(function (x) { var s = cterm(x[0], x[1], !out); out += s; }); return out; }
  X.cterm = cterm; X.ctermAll = ctermAll;
  /* a brackets body: (x+3) for a binomial, x^{2} for a monomial */
  /* a binomial written with a positive first term where it can be: 1 - x rather than -x + 1 */
  function ut(p) { p = lift(p); var ts = P.sorted(p); return ts.length > 1 && ts[0].c[0] < 0 && P.constant(p)[0] > 0 ? tx(p, { order: 'asc' }) : tx(p); }
  X.ut = ut;
  function bod(U) { U = lift(U); return P.count(U) > 1 ? '(' + tx(U) + ')' : tx(U); }
  X.bod = bod;

  /* ---------------- the "factor" part ---------------- */
  function wTex(is) { return typeof is === 'string' ? is : FX.tex(is); }
  function cleanW(T, ws) {
    var out = [];
    (ws || []).forEach(function (w) {
      if (!w || !w.is) return; var p; try { p = FX.product(w.is); } catch (e) { return; }
      if (P.eq(p, T) || out.some(function (o) { return P.eq(FX.product(o.is), p); })) return;
      out.push(w);
    });
    return out;
  }
  /* a right answer with a bracket still to simplify, e.g. 2(x+5)(x+2-2) */
  function brIssue(s) {
    var pr = HW.ex.parse(s); if (!pr.ok) return null;
    var sp = FX.split(pr.ast); if (!sp.ok) return null;
    for (var i = 0; i < sp.factors.length; i++) { var f = sp.factors[i]; if (f.ast && P.formIssue(f.ast)) return form('p43-simplify-br', 'Right — now <b>simplify inside each bracket</b>: collect the like terms so each factor is as short as possible.'); }
    return null;
  }
  X.brIssue = brIssue;
  /* o: { prompt, key (LaTeX, fully factored, in the internal letters), ws: [{ is, code, hint }], sol, hints, text,
   *      vars (keypad letters; 'sin', 'cos', 'pi' add those keys), special (sin x / cos x / π in the answer), good, bad, diag } */
  function fx(o) {
    var T = FX.product(o.key), S = o.special ? show : function (x) { return x; }, SM = o.special ? showMath : function (x) { return x; };
    var ws = cleanW(T, o.ws).map(function (w) { return { is: w.is, code: w.code, hint: S(w.hint) }; });
    var base = K.factored(o.key, { wrong: ws, diag: o.diag });
    var check = function (resp) {
      var s = o.special ? unshow(resp) : resp;
      if (o.special && /sin|cos/.test(s)) return form('p43-trig', 'Write each sine or cosine with its angle, e.g. ' + t('(2\\sin x-1)(\\sin x+1)') + '.');
      var r = base(s);
      if (r.v === 'correct') { var f = brIssue(s); if (f) return f; }
      if (o.special && r.hint) r = { v: r.v, code: r.code, hint: show(r.hint) };
      return r;
    };
    var vars = o.vars || P.vars(T).filter(function (v) { return 'SCQ'.indexOf(v) < 0; });
    if (!vars.length) vars = ['x'];
    var key = SM(o.key);
    return { prompt: S(o.prompt), input: { type: 'math', keys: o.special ? 'p43' : 'poly', vars: vars, placeholder: 'e.g. 3x(x - 4)(x + 2)' }, check: check, key: key, answer: t(key),
      solution: S(o.sol), hints: (o.hints || []).map(S), text: o.text,
      bad: ws.map(function (w) { return SM(wTex(w.is)); }).concat((o.bad || []).map(SM)), good: (o.good || []).map(SM) };
  }
  X.fx = fx;
  HW.addCodes({
    'p43-simplify-br': 'Bracket not simplified after substituting back', 'p43-trig': 'Sine or cosine written without its angle',
    'p43-letter': 'Left the answer in the substitution letter', 'p43-no-back': 'Wrote x for the substituted expression (didn’t put it back)',
    'p43-no-dist': 'Coefficient not multiplied by every term of the binomial', 'p43-power': 'Wrote x instead of the repeated power (x² → x)',
    'p43-lost-gcf': 'Dropped the common factor', 'p43-sum-sq': 'Factored a sum of squares', 'p43-k-missing': 'Missed some values', 'p43-k-extra': 'Listed a value that doesn’t work',
    'p43-k-pair': 'Listed the pairs’ numbers instead of the sums', 'p43-expand': 'Expansion error', 'p43-dim': 'Dimension or area slip', 'p43-perim': 'Perimeter set up wrongly',
    'p43-nr-sign': 'NR: the bracket signs mixed up', 'p43-nr-order': 'NR: values in the wrong order'
  });
  HW.addPartial({ 'p43-letter': 'b', 'p43-no-back': 'b', 'p43-no-dist': 's', 'p43-power': 'b', 'p43-lost-gcf': 's', 'p43-sum-sq': 's', 'p43-k-missing': 's', 'p43-expand': 's', 'p43-dim': 's', 'p43-perim': 'b' });

  /* ---------------- factoring by substitution ---------------- */
  var LA = P.v('A'), LB = P.v('B');
  function abc(f) { return [f[0][0] * f[1][0], f[0][0] * f[1][1] + f[0][1] * f[1][0], f[0][1] * f[1][1]]; }
  /* o: { U, V (optional second unit), mode: 'mono' (shown expanded) | 'bin' (shown in brackets), f: [[p1, q1], [p2, q2]],
   *      g (GCF: a monomial in 'mono' mode, a whole number multiplying the trinomial in A in 'bin' mode), order: 'asc',
   *      split (default true: split differences of squares), flip, prompt, exprTex, sol (extra lines after), hints, special } */
  function sub(o) {
    var U = lift(o.U), two = !!o.V, V = two ? lift(o.V) : N(1), g = lift(o.g || 1), f = o.f, mode = o.mode || 'mono';
    var uT = ut(U), vT = two ? ut(V) : '';
    var c3 = abc(f), a = c3[0], b = c3[1], c = c3[2], Bv = two ? LB : N(1);
    var Ab = [lin(f[0][0], LA, f[0][1], Bv), lin(f[1][0], LA, f[1][1], Bv)];
    var Atri = P.add(P.scale(P.pow(LA, 2), a), P.scale(P.mul(LA, Bv), b), P.scale(P.pow(Bv, 2), c));
    var Br = [lin(f[0][0], U, f[0][1], V), lin(f[1][0], U, f[1][1], V)];
    var Q = P.mul(g, Br[0], Br[1]);
    var gt = tx(g), gpre = gt === '1' ? '' : gt === '-1' ? '-' : gt, gNum = P.vars(g).length === 0 ? P.constant(g)[0] / P.constant(g)[1] : null;
    var exprTex = o.exprTex;
    if (!exprTex && mode === 'mono') exprTex = tx(Q, { order: o.order });
    if (!exprTex && two) exprTex = ctermAll([[gNum * a, '(' + uT + ')^{2}'], [gNum * b, '(' + uT + ')(' + vT + ')'], [gNum * c, '(' + vT + ')^{2}']]);
    if (!exprTex) exprTex = ctermAll([[gNum * a, '(' + uT + ')^{2}'], [gNum * b, '(' + uT + ')']]) + (gNum * c ? sg(gNum * c) : '');
    var col = collect([g].concat(Br), o.split !== false), key = cTex(col, { flip: o.flip });
    var sameBr = P.eq(Ab[0], Ab[1]);
    var AbTex = sameBr ? '(' + tx(Ab[0]) + ')^{2}' : '(' + tx(Ab[0]) + ')(' + tx(Ab[1]) + ')';
    var Uname = o.Uname || uT, Vname = two ? (o.Vname || vT) : '';
    var lines = [];
    var gOut = mode === 'mono' && !isOne(g);
    if (gOut) lines.push('Take out the common factor ' + t(gt) + ' first: ' + t(exprTex + '=' + gpre + '(' + tx(P.mul(Br[0], Br[1])) + ')'));
    var pre = gOut || (mode === 'bin' && !isOne(g)) ? gpre : '';
    var Ascaled = mode === 'bin' && !isOne(g) ? tx(P.scale(Atri, gNum)) + '=' + gpre + '(' + tx(Atri) + ')' : (pre ? pre + '(' + tx(Atri) + ')' : tx(Atri));
    var direct = mode === 'mono' && !two && a === 1 && P.count(U) === 1 && P.degree(U) === 1 && P.terms(U)[0].c[0] === 1;  // a plain trinomial in x: no substitution needed
    if (!direct) lines.push('Let ' + t('A=' + Uname) + (two ? ' and ' + t('B=' + Vname) : '') + ': ' + t(Ascaled));
    var m = f[0][0] * f[1][1], n = f[1][0] * f[0][1];
    if (direct) lines.push('Two numbers with product ' + t(c) + ' and sum ' + t(b) + ': ' + t(f[0][1]) + ' and ' + t(f[1][1]) + '.<br>' + t('=' + pre + prodTex(Br)));
    else if (a === 1 && !(two && (f[0][0] !== 1 || f[1][0] !== 1))) {
      lines.push('Two numbers with product ' + t(c) + ' and sum ' + t(b) + ': ' + t(f[0][1]) + ' and ' + t(f[1][1]) + '.<br>' + t('=' + pre + AbTex));
    } else {
      var br2 = '(' + tx(Ab[1]) + ')', q1 = f[0][1], g1 = tx(P.scale(LA, f[0][0])), g2 = (q1 < 0 ? '-' : '+') + (two ? (Math.abs(q1) === 1 ? '' : Math.abs(q1)) + 'B' : Math.abs(q1));
      var splitT = P.seq([P.scale(P.pow(LA, 2), a), P.scale(P.mul(LA, Bv), m), P.scale(P.mul(LA, Bv), n), P.scale(P.pow(Bv, 2), c)]);
      var o1 = pre ? '\\big[' : '', o2 = pre ? '\\big]' : '';
      lines.push('Product ' + t('ac=' + (a * c)) + ', sum ' + t(b) + ': ' + t(m) + ' and ' + t(n) + '.<br>' + t('=' + pre + o1 + splitT + o2) + '<br>' + t('=' + pre + o1 + (g1 === '1A' ? 'A' : g1) + br2 + g2 + br2 + o2) + '<br>' + t('=' + pre + AbTex));
    }
    var back;
    if (mode === 'mono') back = sameBr ? '(' + tx(Br[0]) + ')^{2}' : prodTex(Br);
    else {
      var bs = function (fi) { var s = cterm(fi[0], '(' + uT + ')', true); s += two ? cterm(fi[1], '(' + vT + ')', false) : sg(fi[1]); return '\\big[' + s + '\\big]'; };
      back = sameBr ? bs(f[0]) + '^{2}' : bs(f[0]) + bs(f[1]);
    }
    if (!direct) lines.push('Replace ' + t('A') + (two ? ' and ' + t('B') : '') + ': ' + t('=' + pre + back));
    if (mode === 'bin') {
      var raw = Br.map(function (bb, i) { return P.count(bb) <= 1 && f[i][0] === 1 && !two ? '(' + uT + sg(f[i][1]) + ')' : '(' + ut(bb) + ')'; });
      var simp = sameBr ? raw[0] + '^{2}' : raw.join('');
      var em = collect(Br, false).mono, emK = P.vars(em).length ? 1 : Math.abs(P.constant(em)[0]);
      lines.push(t('=' + pre + simp) + (pre + simp !== key ? '<br>' + t('=' + key) + (emK !== 1 ? ' &nbsp; (common factor ' + t(emK) + ')' : '') : ''));
    } else if (key !== pre + back) {
      lines.push(t('=' + key) + ' &nbsp; (factor each difference of squares)');
    }
    var sums = col.br.filter(function (bb) { var ts = P.sorted(bb.p); return ts.length === 2 && ts[0].c[0] > 0 && ts[1].c[0] > 0 && sqrtMono(ts[0]) && sqrtMono(ts[1]); });
    if (sums.length) lines.push(sums.map(function (bb) { return t(tx(bb.p)); }).join(' and ') + (sums.length > 1 ? ' are sums' : ' is a sum') + ' of squares: ' + (sums.length > 1 ? 'they do' : 'it does') + ' not factor.');
    /* wrong answers */
    var ws = [], main = (P.vars(U).filter(function (v) { return 'SCQ'.indexOf(v) < 0; })[0]) || 'x';
    ws.push({ is: [g].concat(Ab), code: 'p43-letter', hint: 'That’s the factorization in ' + t('A') + '. Now put ' + t(Uname) + ' back in place of ' + t('A') + (two ? ' (and ' + t(Vname) + ' for ' + t('B') + ')' : '') + ', then simplify and factor fully.' });
    var ts0 = P.terms(U);
    if (mode === 'mono' && !two && ts0.length === 1 && Object.keys(ts0[0].v).length === 1 && ts0[0].v[Object.keys(ts0[0].v)[0]] > 1 && ts0[0].c[0] === 1) {
      var xv = P.v(Object.keys(ts0[0].v)[0]);
      ws.push({ is: [g, lin(f[0][0], xv, f[0][1], 1), lin(f[1][0], xv, f[1][1], 1)], code: 'p43-power', hint: 'The repeated part is ' + t(Uname) + ', so each bracket holds ' + t(Uname) + ', not ' + t(tx(xv)) + ': ' + t('(' + Uname + ')^{2}=' + tx(P.pow(U, 2))) + '.' });
    }
    if (mode === 'bin' && !two && !P.eq(U, P.v(main))) {
      var xm = P.v(main);
      ws.push({ is: [g, lin(f[0][0], xm, f[0][1], 1), lin(f[1][0], xm, f[1][1], 1)], code: 'p43-no-back', hint: 'Those brackets factor the trinomial in ' + t('A') + ' with ' + t(main) + ' written for ' + t('A') + '. Replace ' + t('A') + ' with the whole binomial ' + t('(' + Uname + ')') + ', in brackets, then simplify.' });
    }
    if (mode === 'bin' && P.count(U) > 1 && (Math.abs(f[0][0]) !== 1 || Math.abs(f[1][0]) !== 1)) {
      var ld = P.sorted(U)[0], lead = P.mono(ld.c, ld.v), rest = P.sub(U, lead);
      var nd = Br.map(function (bb, i) { return Math.abs(f[i][0]) === 1 ? bb : P.add(P.scale(lead, f[i][0]), rest, two ? P.scale(V, f[i][1]) : N(f[i][1])); });
      var pp = Math.abs(f[0][0]) !== 1 ? f[0][0] : f[1][0];
      ws.push({ is: [g].concat(nd), code: 'p43-no-dist', hint: 'When you put ' + t('(' + Uname + ')') + ' back into ' + t(tx(P.scale(LA, pp))) + ', multiply <b>every</b> term: ' + t(pp + '(' + Uname + ')=' + tx(P.scale(U, pp))) + '.' });
    }
    if (!isOne(g)) ws.push({ is: Br, code: 'p43-lost-gcf', hint: 'Your brackets are right, but the common factor ' + t(gt) + ' has gone missing. It stays in front of the brackets.' });
    var emerged = collect(Br, false).mono;
    if (mode === 'bin' && !isOne(emerged) && P.count(emerged) === 1 && !P.vars(emerged).length) {
      ws.push({ is: [g].concat(col.br.map(function (bb) { return { p: bb.p, k: bb.k }; })), code: 'p43-lost-gcf', hint: 'Taking a common factor out of a bracket doesn’t make it disappear: it moves in front. Check what your brackets multiply to.' });
    }
    col.br.forEach(function (bb, i) {
      var ts = P.sorted(bb.p); if (ts.length !== 2 || ts[1].c[0] < 0) return; var A1 = sqrtMono(ts[0]), B1 = sqrtMono(ts[1]); if (!A1 || !B1) return;
      var list = [col.mono]; col.br.forEach(function (x, j) { if (j === i) list.push(P.sub(A1, B1), P.add(A1, B1)); else list.push({ p: x.p, k: x.k }); });
      ws.push({ is: list, code: 'p43-sum-sq', hint: t(tx(bb.p)) + ' is a <b>sum</b> of squares — it does not factor. (' + t('(' + tx(P.sub(A1, B1)) + ')(' + tx(P.add(A1, B1)) + ')') + ' multiplies to a <b>difference</b>.)' });
    });
    var hints = o.hints || (mode === 'mono'
      ? [(gOut ? 'Take out the common factor ' + t(gt) + ' first. ' : '') + 'The trinomial is in quadratic form: ' + t('(' + Uname + ')^{2}=' + tx(P.pow(U, 2))) + '. Let ' + t('A=' + Uname) + (two ? ' and ' + t('B=' + Vname) : '') + '.',
        'Factor the trinomial in ' + t('A') + (a === 1 ? ' (two numbers with product ' + t(c) + ' and sum ' + t(b) + ')' : ' by decomposition (product ' + t(a * c) + ', sum ' + t(b) + ')') + ', put ' + t(Uname) + ' back, then factor any difference of squares.']
      : ['Let ' + t('A=' + Uname) + (two ? ' and ' + t('B=' + Vname) : '') + ' and factor the trinomial in ' + t('A') + (a === 1 ? ' (product ' + t(c) + ', sum ' + t(b) + ')' : ' by decomposition (product ' + t(a * c) + ', sum ' + t(b) + ')') + '.',
        'Put ' + t('(' + Uname + ')') + ' back in brackets, simplify each bracket and take out any common factor.']);
    var good = [cTex(col, { flip: o.flip, rev: true })];
    if (o.flip) good.push(cTex(col, {}));
    return { exprTex: exprTex, key: key, keyRev: good[0], Q: Q, col: col, lines: lines, ws: ws, hints: hints, Atri: Atri, Ab: Ab, Br: Br, a: a, b: b, c: c, good: good,
      part: function (po) {
        po = po || {};
        return fx({ prompt: po.prompt || t(exprTex), key: key, ws: ws.concat(po.ws || []), sol: (po.solPre || '') + lines.join('<br>') + (po.solPost || ''), hints: po.hints || hints, text: po.text || 'factor ' + plain(exprTex),
          special: o.special, vars: o.vars, good: good.concat(po.good || []), bad: po.bad });
      } };
  }
  X.sub = sub;

  /* ---------------- other small part makers ---------------- */
  function listPart(prompt, want, o) {
    o = o || {};
    want = want.slice().sort(function (x, y) { return x - y; });
    var check = function (resp) {
      if (!resp || !resp.length) return form('empty', 'Add the values one at a time (press Enter or comma after each).');
      var got = resp.map(Number);
      if (got.some(function (v) { return !isFinite(v); })) return form('notnumber', 'Enter whole numbers only.');
      var dup = got.filter(function (v, i) { return got.indexOf(v) !== i; }); if (dup.length) return form('duplicate', 'You listed ' + t(dup[0]) + ' more than once.');
      var extra = got.filter(function (v) { return want.indexOf(v) < 0; }), miss = want.filter(function (v) { return got.indexOf(v) < 0; });
      if (!extra.length && !miss.length) return ok();
      if (o.diag) { var h = o.diag(got, extra, miss); if (h) return wrong(h.code, h.hint); }
      if (extra.length) return wrong('p43-k-extra', t(extra[0]) + ' doesn’t work: no pair of integers gives it. ' + (o.extraHint || ''));
      return wrong('p43-k-missing', 'You have ' + (want.length - miss.length) + ' of the ' + want.length + ' values. ' + (o.missHint || ''));
    };
    return { prompt: prompt, input: { type: 'list' }, check: check, key: want.slice(), answer: t(want.join(',\\ ')), solution: o.sol, hints: o.hints || [], text: o.text, bad: o.bad || [want.slice(1)] };
  }
  X.listPart = listPart;

  /* ---------------- keypad: the poly keypad with sin x, cos x and π keys ---------------- */
  var W = HW.widgets;
  if (W && W.KEYSETS) {
    var d = function (n) { return { label: String(n), tex: String(n), plain: String(n) }; };
    var KY = {
      del: { label: '⌫', fn: 'del', title: 'Delete' }, clear: { label: 'clear', fn: 'clear' },
      left: { label: '◀', fn: 'left', title: 'Move left' }, right: { label: '▶', fn: 'right', title: 'Move right (out of a box)' },
      enter: { label: 'Check ↵', fn: 'enter', wide: true }, plus: { label: '+', tex: '+', plain: '+' }, minus: { label: '−', tex: '-', plain: '-' },
      sq: { label: 'x<sup>2</sup>', tex: '^{2}', plain: '^2', title: 'Squared' }, pow: { label: 'x<sup>n</sup>', tex: '#@^{#?}', plain: '^', title: 'Exponent' },
      frac: { label: '<sup>a</sup>⁄<sub>b</sub>', tex: '\\frac{#@}{#?}', plain: '/', title: 'Fraction' }, par: { label: '( )', tex: '\\left(#0\\right)', plain: '(', title: 'Brackets' },
      dot: { label: '.', tex: '.', plain: '.' }
    };
    W.KEYSETS.p43 = function (opt) {
      var row = [];
      ((opt && opt.vars && opt.vars.length) ? opt.vars : ['x']).forEach(function (v) {
        if (v === 'sin') row.push({ label: 'sin <i>x</i>', tex: '\\sin x', plain: 'sin x' }, { label: 'sin<sup>2</sup><i>x</i>', tex: '\\sin^{2}x', plain: 'sin^2 x' });
        else if (v === 'cos') row.push({ label: 'cos <i>x</i>', tex: '\\cos x', plain: 'cos x' }, { label: 'cos<sup>2</sup><i>x</i>', tex: '\\cos^{2}x', plain: 'cos^2 x' });
        else if (v === 'pi') row.push({ label: 'π', tex: '\\pi', plain: 'π' });
        else if (row.length < 7) row.push({ label: '<i>' + v + '</i>', tex: v, plain: v });
      });
      return [[d(7), d(8), d(9), KY.plus, KY.minus, KY.del], [d(4), d(5), d(6), KY.sq, KY.pow, KY.clear], [d(1), d(2), d(3), KY.frac, KY.left, KY.right], [d(0), KY.dot, KY.par, KY.enter], row];
    };
    if (W.KEYHELP) W.KEYHELP.p43 = ['Use the <b>sin <i>x</i></b> / <b>cos <i>x</i></b> keys (or <b>sin<sup>2</sup><i>x</i></b>) for the trig parts and <b>π</b> for pi. Press <b>▶</b> to step out of an exponent.',
      'Type e.g. <code>(2sin x - 1)(sin x + 1)</code> or <code>12pi(r + 1)</code>.'];
  }

  /* ============================== Lesson 3 ============================== */
  /* the lesson's examples and the booklet's own questions (as the generators write them), never generated */
  var EXCL = {};
  ['x^4+9x^2+14', 'y^4-3y^2-28', 'x^6+4x^3-21', 'x^4-13x^2+36', 'm^4-5m^2-36', '3y^5-54y^3+243y', '3x^4-10x^2-8', '9x^4-37x^2+4', '6a^2b^2-5ab-6',
    '2p^6+5p^3-12', '(x+2)^2-3(x+2)-10', '2(3x-1)^2+5(3x-1)-3', '4(x-1)^2-4(x-1)-3', '(2x+1)^2-6(2x+1)+9', 'x^4+10x^2+25', '2S^2+S-1',
    'x^4+8x^2+15', 'a^4-2a^2-35', 'y^6+2y^3-15', 'x^2y^2+3xy-18', 'x^4-10x^2+9', 'n^4-21n^2-100', 'x^4+3x^2-4', '5x^4-25x^2+20', 'x^5-8x^3+16x',
    'x^4-13x^2y^2+36y^4', '2x^4+7x^2+3', '3a^4-7a^2+2', '4x^4-17x^2+4', '5m^6+13m^3-6', '6x^2y^2-7xy-20', '12x^5-15x^3-27x', '9-8x^2-x^4',
    '2C^2-3C+1', '3S^2+5S-2', '(x+3)^2+5(x+3)+6', '(a-2)^2-4(a-2)-21', '3(x+1)^2-7(x+1)+2', '2(2x-3)^2+(2x-3)-6', '4(y+1)^2-12(y+1)+9',
    '6(1-x)^2-5(1-x)-4', '(x+y)^2-2(x+y)-15', '2(x+2)^2+2(x+2)-12', '2(x-3)^2-3(x-3)-2', '(x+5)^2+(x+5)-12', '2(x+1)^2-7(x+1)+3', '3(2x-1)^2-4(2x-1)-4',
    'x^4+7x^2+10', 'b^4-4b^2-45', 'x^6-x^3-20', 'a^2b^2-11ab+28', 'x^4-26x^2+25', '2y^4+10y^2-48', '2x^4-7x^2+3', '9x^4-10x^2+1', '3p^6-11p^3-4',
    '10x^2y^2+9xy+2', '3x^5+6x^3-45x', '(x-1)^2+6(x-1)+8', '(2a+1)^2-(2a+1)-12', '2(x+4)^2-5(x+4)-3', '9(x-2)^2+12(x-2)+4', '2S^2-5S-3',
    '3(x+2)^2+3(x+2)-18', '5(1-2x)^2+7(1-2x)-6', '3(x+1)^2-10(x+1)+8', '(x-5)^2+4(x-5)-12', 'x^4-10x^2y^2+9y^4', '4x^4-37x^2+9'].forEach(function (s) { EXCL[s] = 1; });
  function fresh(s) { return !EXCL[key0(s)]; }
  /* random helpers */
  function L(name, e) { return P.v(name, e); }
  function mono(c, name, e) { return P.scale(P.v(name, e), c); }
  /* (A + m)(A + n) style choices */
  function coprime(p, q) { return gcd(p, q) === 1; }
  function primLin(c1, c0) { return gcd(c1, c0) === 1; }

  /* quadratic form in a monomial unit; f = [[p1,q1],[p2,q2]]; checks every bracket factors only as intended */
  function monoSub(U, f, g, o) { o = o || {}; return sub({ U: U, V: o.V, f: f, g: g, mode: 'mono', order: o.order, special: o.special, vars: o.vars, Uname: o.Uname, flip: o.flip }); }
  function binSub(U, f, g, o) { o = o || {}; return sub({ U: U, V: o.V, f: f, g: g || 1, mode: 'bin', special: o.special, flip: o.flip }); }
  var H_BIN = null;

  /* generators of the factor pairs */
  function genSimple(r, lo, hi) { return [nz(r, lo, hi), nz(r, lo, hi)]; }

  /* ---- Q1 / A1: x⁴ + bx² + c with positive constants (sums: no further factoring) ---- */
  function q1a(r, excl) {
    var o = pickWhere(function () { var m = r.int(1, 9), n = r.int(1, 9); return { v: r.pick(['x', 'x', 'y', 'm', 'n']), m: Math.min(m, n), n: Math.max(m, n) }; },
      function (o) { if (o.m === o.n || o.m * o.n > 60) return false; var s = monoSub(L(o.v, 2), [[1, o.m], [1, o.n]]); return fresh(s.exprTex) && (!excl || excl(o)); });
    return monoSub(L(o.v, 2), [[1, o.m], [1, o.n]]);
  }
  /* ---- a⁴ − 2a² − 35: (a² − m)(a² + n), m not a perfect square ---- */
  function q1b(r) {
    var o = pickWhere(function () { return { v: r.pick(['a', 'b', 'x', 'p', 'w']), m: r.pick([2, 3, 5, 6, 7, 8, 10, 11, 12, 13]), n: r.int(1, 9) }; },
      function (o) { return o.m !== o.n && fresh(monoSub(L(o.v, 2), [[1, -o.m], [1, o.n]]).exprTex); });
    return monoSub(L(o.v, 2), [[1, -o.m], [1, o.n]]);
  }
  /* ---- y⁶ + by³ + c: (y³ + m)(y³ + n), no ±1 or ±8 (differences of cubes are not in the course) ---- */
  function q1c(r, v) {
    var o = pickWhere(function () { return { v: v || r.pick(['y', 'x', 'k', 'n']), m: nz(r, -9, 9), n: nz(r, -9, 9) }; },
      function (o) { return o.m !== o.n && o.m + o.n !== 0 && !isCube(o.m) && !isCube(o.n) && fresh(monoSub(L(o.v, 3), [[1, o.m], [1, o.n]]).exprTex); });
    return monoSub(L(o.v, 3), [[1, o.m], [1, o.n]]);
  }
  /* ---- x²y² + bxy + c: A = xy ---- */
  function q1d(r, vs) {
    var o = pickWhere(function () { return { vs: vs || r.pick([['x', 'y'], ['a', 'b'], ['m', 'n']]), m: nz(r, -9, 9), n: nz(r, -9, 9) }; },
      function (o) { return o.m !== o.n && o.m + o.n !== 0 && fresh(monoSub(P.mul(L(o.vs[0]), L(o.vs[1])), [[1, o.m], [1, o.n]]).exprTex); });
    return monoSub(P.mul(L(o.vs[0]), L(o.vs[1])), [[1, o.m], [1, o.n]]);
  }
  /* ---- (x² − m²)(x² − n²) ---- */
  function q2a(r, v) {
    var o = pickWhere(function () { var m = r.int(1, 6), n = r.int(1, 6); return { v: v || r.pick(['x', 'x', 'y', 'a']), m: Math.min(m, n), n: Math.max(m, n) }; },
      function (o) { return o.m !== o.n && fresh(monoSub(L(o.v, 2), [[1, -o.m * o.m], [1, -o.n * o.n]]).exprTex); });
    return monoSub(L(o.v, 2), [[1, -o.m * o.m], [1, -o.n * o.n]]);
  }
  /* ---- (n² − m²)(n² + k) ---- */
  function q2b(r, v, mFirst) {
    var o = pickWhere(function () { return { v: v || r.pick(['n', 'x', 'm', 'y']), m: r.int(2, 6), k: r.int(1, 9) }; },
      function (o) { return o.k !== o.m * o.m && o.m * o.m * o.k <= 150 && fresh(monoSub(L(o.v, 2), mFirst ? [[1, -o.m * o.m], [1, o.k]] : [[1, -o.m * o.m], [1, o.k]]).exprTex); });
    return monoSub(L(o.v, 2), [[1, -o.m * o.m], [1, o.k]]);
  }
  /* ---- (x² + k)(x² − m²) ---- */
  function q2c(r) {
    var o = pickWhere(function () { return { v: r.pick(['x', 'y', 'a']), m: r.int(1, 4), k: r.int(1, 9) }; },
      function (o) { return o.k !== o.m * o.m && fresh(monoSub(L(o.v, 2), [[1, o.k], [1, -o.m * o.m]]).exprTex); });
    return monoSub(L(o.v, 2), [[1, o.k], [1, -o.m * o.m]]);
  }
  /* ---- g(x² − m²)(x² − n²) ---- */
  function q2d(r) {
    var o = pickWhere(function () { var m = r.int(1, 4), n = r.int(1, 4); return { v: r.pick(['x', 'y', 'a']), g: r.pick([2, 3, 4, 5, 6]), m: Math.min(m, n), n: Math.max(m, n) }; },
      function (o) { return o.m !== o.n && fresh(monoSub(L(o.v, 2), [[1, -o.m * o.m], [1, -o.n * o.n]], o.g).exprTex); });
    return monoSub(L(o.v, 2), [[1, -o.m * o.m], [1, -o.n * o.n]], o.g);
  }
  /* ---- c·x(x² − m²)²: x⁵ − 8x³ + 16x ---- */
  function q2e(r) {
    var o = pickWhere(function () { return { v: r.pick(['x', 'x', 'y', 'a']), c: r.pick([1, 1, 2, 3]), m: r.int(1, 5) }; },
      function (o) { return fresh(monoSub(L(o.v, 2), [[1, -o.m * o.m], [1, -o.m * o.m]], mono(o.c, o.v)).exprTex); });
    return monoSub(L(o.v, 2), [[1, -o.m * o.m], [1, -o.m * o.m]], mono(o.c, o.v));
  }
  /* ---- (x² − m²y²)(x² − n²y²) ---- */
  function q2f(r, excl) {
    var o = pickWhere(function () { var m = r.int(1, 5), n = r.int(1, 5); return { m: Math.min(m, n), n: Math.max(m, n) }; },
      function (o) { return o.m !== o.n && o.m * o.n <= 15 && fresh(monoSub(L('x', 2), [[1, -o.m * o.m], [1, -o.n * o.n]], 1, { V: L('y', 2) }).exprTex) && (!excl || excl(o)); });
    return monoSub(L('x', 2), [[1, -o.m * o.m], [1, -o.n * o.n]], 1, { V: L('y', 2) });
  }
  /* ---- decomposition (p x² + q)(r x² + s): kind 'pos' (all positive), 'neg' (q, s < 0, neither a difference of squares),
   *      'dos' (both differences of squares), 'mixed' ---- */
  function bracketOK(p, q, U, kind) { // the bracket p U + q: primitive; for a difference of squares only when intended
    if (!coprime(p, q)) return false;
    var dosB = q < 0 && isSq(p) && isSq(-q) && U === 2;
    if (kind === 'dos') return dosB;
    return !dosB;
  }
  function decomp(r, U, e, kind, excl) {
    var o = pickWhere(function () {
      if (kind === 'dos') { var pp = r.pick([2, 3]), qq = r.int(1, 3), ss = r.int(1, 3); return { f: [[pp * pp, -qq * qq], [1, -ss * ss]] }; }
      var p1 = r.pick([2, 3, 4, 5, 6]), p2 = r.pick([1, 1, 1, 2, 3]), q1 = nz(r, -7, 7), q2 = nz(r, -7, 7);
      if (kind === 'pos') { q1 = Math.abs(q1); q2 = Math.abs(q2); }
      if (kind === 'neg') { q1 = -Math.abs(q1); q2 = -Math.abs(q2); }
      return { f: [[p1, q1], [p2, q2]] };
    }, function (o) {
      var f = o.f; if (f[0][0] === f[1][0] && f[0][1] === f[1][1]) return false;
      if (kind === 'dos') { if (!coprime(f[0][0], f[0][1])) return false; } else if (!bracketOK(f[0][0], f[0][1], e, kind) || !bracketOK(f[1][0], f[1][1], e, kind)) return false;
      if (kind === 'mixed' && f[0][1] * f[1][1] > 0) return false;
      if (e === 3 && ((isCube(f[0][0]) && isCube(f[0][1])) || (isCube(f[1][0]) && isCube(f[1][1])))) return false;
      var b = abc(f)[1]; if (!b) return false;
      var s = monoSub(U, f); return fresh(s.exprTex) && (!excl || excl(o));
    });
    return monoSub(U, o.f);
  }

  /* ---- binomial units ---- */
  function binU(c1, v, c0) { return lin(c1, L(v), c0, 1); }

  var QUESTIONS = [
    { num: '1', section: 'Trinomials in quadratic form', stem: 'Factor.', parts: [
      { id: '1a', level: 'BEG', make: function (r) { return q1a(r, function (o) { return !(o.m === 3 && o.n === 5); }).part(); } },
      { id: '1b', level: 'BEG', make: function (r) { return q1b(r).part(); } },
      { id: '1c', level: 'BEG', make: function (r) { return q1c(r).part(); } },
      { id: '1d', level: 'BEG', make: function (r) { return q1d(r).part(); } }] },
    { num: '2', section: 'Finishing with a difference of squares', stem: 'Factor fully.', parts: [
      { id: '2a', level: 'EMG', make: function (r) { return q2a(r).part(); } },
      { id: '2b', level: 'EMG', make: function (r) { return q2b(r).part(); } },
      { id: '2c', level: 'EMG', make: function (r) { return q2c(r).part(); } },
      { id: '2d', level: 'PRG', make: function (r) { return q2d(r).part(); } },
      { id: '2e', level: 'PRG', make: function (r) { return q2e(r).part(); } },
      { id: '2f', level: 'PRG', make: function (r) { return q2f(r).part(); } }] },
    { num: '3', section: 'Leading coefficient not 1', stem: 'Factor fully.', parts: [
      { id: '3a', level: 'EMG', make: function (r) { return decomp(r, L(r.pick(['x', 'y', 'b']), 2), 2, 'pos').part(); } },
      { id: '3b', level: 'EMG', make: function (r) { return decomp(r, L(r.pick(['a', 'x', 'm']), 2), 2, 'neg').part(); } },
      { id: '3c', level: 'PRG', make: function (r) { return decomp(r, L(r.pick(['x', 'x', 'y']), 2), 2, 'dos').part(); } },
      { id: '3d', level: 'PRG', make: function (r) { return decomp(r, L(r.pick(['m', 'x', 'p']), 3), 3, 'mixed').part(); } },
      { id: '3e', level: 'PRG', make: function (r) { var vs = r.pick([['x', 'y'], ['a', 'b'], ['p', 'q']]); return decomp(r, P.mul(L(vs[0]), L(vs[1])), 1, 'mixed').part(); } },
      { id: '3f', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { v: r.pick(['x', 'x', 'y']), g: r.pick([2, 3, 4]), p: r.int(1, 3), q: r.int(1, 3), rr: r.pick([1, 1, 2]), s: r.int(1, 4) }; },
          function (o) { if (!coprime(o.p, o.q) || !coprime(o.rr, o.s) || o.p * o.p * o.s - o.q * o.q * o.rr === 0) return false; return fresh(monoSub(L(o.v, 2), [[o.p * o.p, -o.q * o.q], [o.rr, o.s]], mono(o.g, o.v)).exprTex); });
        return monoSub(L(o.v, 2), [[o.p * o.p, -o.q * o.q], [o.rr, o.s]], mono(o.g, o.v)).part();
      } }] },
    { num: '4', parts: [
      { id: '4', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { v: r.pick(['x', 'x', 'y']), m: r.int(1, 12), n: r.int(1, 3) }; }, function (o) { return o.n * o.n !== o.m && fresh(monoSub(L(o.v, 2), [[1, o.m], [1, -o.n * o.n]], -1, { order: 'asc' }).exprTex); });
        var s = monoSub(L(o.v, 2), [[1, o.m], [1, -o.n * o.n]], -1, { order: 'asc' }), v = o.v;
        var alt = '(' + o.n + '-' + v + ')(' + o.n + '+' + v + ')(' + v + '^{2}+' + o.m + ')';
        return s.part({ prompt: 'Factor fully: ' + t(s.exprTex) + '. (Hint: take out ' + t('-1') + ' first.)',
          solPost: '<br>(Equivalently ' + t(alt) + '.)', good: [alt],
          hints: ['Write the terms in descending order and take out ' + t('-1') + ': ' + t(s.exprTex + '=-(' + tx(P.neg(s.Q)) + ')') + '.', 'Factor the trinomial in ' + t(v + '^{2}') + ', then the difference of squares. Keep the ' + t('-') + ' in front.'] });
      } }] },
    { num: '5', section: 'Other repeated expressions', stem: 'Factor each trigonometric expression.', parts: [
      { id: '5a', level: 'EMG', make: function (r) { return trigSub(r, 'C', ['2C^2-3C+1']).part(); } },
      { id: '5b', level: 'EMG', make: function (r) { return trigSub(r, 'S', ['3S^2+5S-2']).part(); } }] },
    { num: '6', section: 'Substituting for a binomial', stem: 'Factor fully. Simplify each factor.', parts: [
      { id: '6a', level: 'BEG', make: function (r) {
        var o = pickWhere(function () { return { v: r.pick(['x', 'x', 'm']), h: r.int(1, 6), m: r.int(1, 6), n: r.int(1, 6) }; }, function (o) { return o.m !== o.n && fresh(binSub(binU(1, o.v, o.h), [[1, o.m], [1, o.n]]).exprTex); });
        return binSub(binU(1, o.v, o.h), [[1, o.m], [1, o.n]]).part();
      } },
      { id: '6b', level: 'BEG', make: function (r) {
        var o = pickWhere(function () { return { v: r.pick(['a', 'x', 'y']), h: -r.int(1, 6), m: -r.int(1, 9), n: r.int(1, 6) }; }, function (o) { return o.m + o.n !== 0 && o.h + o.m !== 0 && o.h + o.n !== 0 && fresh(binSub(binU(1, o.v, o.h), [[1, o.m], [1, o.n]]).exprTex); });
        return binSub(binU(1, o.v, o.h), [[1, o.m], [1, o.n]]).part();
      } },
      { id: '6c', level: 'EMG', make: function (r) { return binA(r, 1, function (o) { return true; }, 'none').part(); } },
      { id: '6d', level: 'PRG', make: function (r) { return binA(r, 2, null, 'none').part(); } },
      { id: '6e', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { v: r.pick(['y', 'x']), h: nz(r, -4, 4), m: r.pick([2, 3]), n: nz(r, -5, 5) }; }, function (o) { var c0 = o.m * o.h + o.n; return coprime(o.m, o.n) && c0 !== 0 && coprime(o.m, c0) && fresh(binSub(binU(1, o.v, o.h), [[o.m, o.n], [o.m, o.n]]).exprTex); });
        return binSub(binU(1, o.v, o.h), [[o.m, o.n], [o.m, o.n]]).part();
      } },
      { id: '6f', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { var pr = r.pick([[3, 2], [2, 3], [6, 1], [2, 1], [3, 1], [5, 1], [3, 4], [4, 3]]); return { h: r.int(1, 4), p1: pr[0], p2: pr[1], q1: nz(r, -5, 5), q2: nz(r, -5, 5) }; },
          function (o) { var c1 = o.p1 * o.h + o.q1, c2 = o.p2 * o.h + o.q2; return coprime(o.p1, o.q1) && coprime(o.p2, o.q2) && c1 !== 0 && c2 !== 0 && coprime(o.p1, c1) && coprime(o.p2, c2) && abc([[o.p1, o.q1], [o.p2, o.q2]])[1] !== 0 && fresh(binSub(lin(-1, L('x'), o.h, 1), [[o.p1, o.q1], [o.p2, o.q2]]).exprTex); });
        return revSub(o).part();
      } },
      { id: '6g', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { s: r.pick([1, 1, -1]), m: nz(r, -7, 7), n: nz(r, -7, 7), vs: r.pick([['x', 'y'], ['a', 'b'], ['m', 'n']]) }; }, function (o) { return o.m !== o.n && o.m + o.n !== 0 && fresh(binSub(lin(1, L(o.vs[0]), o.s, L(o.vs[1])), [[1, o.m], [1, o.n]]).exprTex); });
        return binSub(lin(1, L(o.vs[0]), o.s, L(o.vs[1])), [[1, o.m], [1, o.n]]).part();
      } },
      { id: '6h', level: 'ADV', make: function (r) { return zeroBr(r).part(); } }] },
    { num: '7', section: 'Two ways', shared: function (r) {
      return pickWhere(function () { return { h: nz(r, -5, 5), p: r.pick([2, 3]), q: nz(r, -4, 4), s: nz(r, -5, 5) }; }, function (o) {
        var c1 = o.p * o.h + o.q, c2 = o.h + o.s; return coprime(o.p, o.q) && c1 !== 0 && c2 !== 0 && coprime(o.p, c1) && abc([[o.p, o.q], [1, o.s]])[1] !== 0 && fresh(binSub(binU(1, 'x', o.h), [[o.p, o.q], [1, o.s]]).exprTex);
      });
    }, stem: function (o) { return 'Factor ' + t(binSub(binU(1, 'x', o.h), [[o.p, o.q], [1, o.s]]).exprTex) + ' two ways: by substitution and by expanding first.'; }, parts: [
      { id: '7a', level: 'PRG', make: function (r, o) { var s = binSub(binU(1, 'x', o.h), [[o.p, o.q], [1, o.s]]); return s.part({ prompt: 'By substitution: factor ' + t(s.exprTex) + '.' }); } },
      { id: '7b', level: 'EMG', make: function (r, o) {
        var s = binSub(binU(1, 'x', o.h), [[o.p, o.q], [1, o.s]]), U = binU(1, 'x', o.h), Q = s.Q, a = s.a, b = s.b, c = s.c;
        var sqU = P.pow(U, 2), exp1 = P.seq([P.scale(sqU, a), P.scale(U, b), N(c)]);
        var qa = P.coef(Q, { x: 2 })[0], qb = P.coef(Q, { x: 1 })[0], qc = P.constant(Q)[0];
        var sol = 'Expand each part: ' + t(s.exprTex + '=' + cterm(a, '(' + tx(sqU) + ')', true) + cterm(b, '(' + tx(U) + ')', false) + sg(c)) + '<br>' + t('=' + tx(Q)) +
          '<br>Factoring this needs product ' + t(qa * qc) + ' and sum ' + t(qb) + ', and gives the same answer, ' + t(s.key) + '. Substitution was quicker: its numbers (product ' + t(a * c) + ', sum ' + t(b) + ') are smaller.';
        var bad1 = P.add(P.scale(P.add(P.pow(L('x'), 2), N(o.h * o.h)), a), P.scale(U, b), N(c));
        var p = B.poly('By expanding first: write ' + t(s.exprTex) + ' as a trinomial ' + t('ax^{2}+bx+c') + '.', Q, { wrong: [{ is: bad1, code: 'p43-expand', hint: 'Square the binomial properly: ' + t('(' + tx(U) + ')^{2}=' + tx(sqU)) + ' has a middle term.' }] }, sol,
          ['Expand ' + t('(' + tx(U) + ')^{2}') + ' first (it has three terms), then multiply out the rest and collect like terms.'], 'expand first');
        p.bad = [tx(bad1)];
        return p;
      } }] },
    { num: '8', section: 'Two repeated binomials', parts: [
      { id: '8', level: 'MAS', make: function (r) {
        var o = pickWhere(function () { return { h1: nz(r, -5, 5), h2: nz(r, -5, 5), u: nz(r, -4, 4), w: nz(r, -4, 4) }; }, function (o) {
          if (o.h1 === o.h2 || o.u === o.w || o.u === -1 || o.w === -1 || o.u + o.w === 0) return false;
          var s = twoSub(o); return fresh(s.exprTex) && s.col.br.length === 2 && !(o.h1 === 4 && o.h2 === -1);
        });
        var s = twoSub(o);
        return s.part({ prompt: 'Factor fully: ' + t(s.exprTex) + '.' });
      } }] },
    { num: '9', section: 'Rectangle', shared: function (r) {
      return pickWhere(function () { return { h: r.int(1, 6), m: r.int(2, 6), n: nz(r, -5, 4), x0: r.int(2, 8) }; }, function (o) { return o.m > o.n && o.h + o.n >= 1 && o.m + o.n !== 0 && !(o.h === 5 && o.m === 4 && o.n === -3); });
    }, stem: function (o) { var s = binSub(binU(1, 'x', o.h), [[1, o.m], [1, o.n]]); return 'The area of a rectangle is ' + t(s.exprTex) + ' square units. Its length and width are binomials in ' + t('x') + '.'; }, parts: [
      { id: '9a', level: 'PRG', make: function (r, o) {
        var s = binSub(binU(1, 'x', o.h), [[1, o.m], [1, o.n]]);
        return s.part({ prompt: 'Factor to find expressions for the length and width (write the area as their product).', solPost: '<br>Length ' + t('x' + sg(o.h + o.m)) + ', width ' + t('x' + sg(o.h + o.n)) + '.' });
      } },
      { id: '9b', level: 'ADV', make: function (r, o) {
        var Lc = o.h + o.m, Wc = o.h + o.n, Pm = 2 * (2 * o.x0 + Lc + Wc), Lv = o.x0 + Lc, Wv = o.x0 + Wc, area = Lv * Wv;
        var xBad = (Pm - Lc - Wc) / 2;
        var chkX = K.number(o.x0, function (v) { if (Math.abs(v - xBad) < 1e-9) return { code: 'p43-perim', hint: 'The perimeter counts the length <b>and</b> the width twice: ' + t('2(l+w)') + '.' }; return null; });
        var chkA = K.number(area, function (v) { if (Math.abs(v - Lv - Wv) < 1e-9) return { code: 'p43-dim', hint: 'Area is length <b>times</b> width.' }; return null; });
        return B.fields('The perimeter is ' + t(Pm) + ' units. Find ' + t('x') + ' and the area.', [{ name: 'x', label: t('x=') }, { name: 'Area', label: 'Area =', after: 'square units' }], [chkX, chkA], [String(o.x0), String(area)],
          t('x=' + o.x0) + ', area ' + t(area) + ' square units',
          t('2(x' + sg(Lc) + ')+2(x' + sg(Wc) + ')=4x' + sg(2 * (Lc + Wc)) + '=' + Pm + '\\Rightarrow x=' + o.x0) + '.<br>Dimensions ' + t(Lv) + ' by ' + t(Wv) + '; area ' + t(Lv + '\\times ' + Wv + '=' + area) + ' square units.<br>(Check: ' + t('(' + (o.x0 + o.h) + ')^{2}' + cterm(o.m + o.n, '(' + (o.x0 + o.h) + ')', false) + sg(o.m * o.n) + '=' + area) + '.)',
          ['Perimeter ' + t('=2(\\text{length})+2(\\text{width})') + ' with the binomials from part (a). Solve for ' + t('x') + '.', 'Substitute ' + t('x') + ' into each binomial, then multiply for the area.'], 'rectangle: x and area');
      } }] },
    { num: '10', section: 'Which values work?', parts: [
      { id: '10', level: 'MAS', make: function (r) {
        var c = r.pick([-8, -10, -18, -20, -24, -28, -30, -16, -36, -40]), pairs = [], ks = [];
        for (var p = -Math.abs(c); p <= Math.abs(c); p++) { if (!p || c % p) continue; var q = c / p; if (p <= q) { pairs.push([p, q]); if (ks.indexOf(p + q) < 0) ks.push(p + q); } }
        var v = r.pick(['x', 'x', 'y']);
        return listPart('Find all integers ' + t('k') + ' for which ' + t(v + '^{4}+k' + v + '^{2}' + sg(c)) + ' can be factored as ' + t('(' + v + '^{2}+p)(' + v + '^{2}+q)') + ', where ' + t('p') + ' and ' + t('q') + ' are integers.', ks, {
          text: 'all k for x⁴ + kx² + c',
          sol: 'Expanding: ' + t('(' + v + '^{2}+p)(' + v + '^{2}+q)=' + v + '^{4}+(p+q)' + v + '^{2}+pq') + ', so ' + t('pq=' + c) + ' and ' + t('k=p+q') + '.<br>Pairs: ' + pairs.map(function (pq) { return t('(' + pq[0] + ',\\ ' + pq[1] + ')') + ' → ' + t(pq[0] + pq[1]); }).join(', ') + '.<br>' + t('k\\in\\{' + ks.slice().sort(function (x, y) { return x - y; }).join(',\\ ') + '\\}'),
          hints: ['Expand ' + t('(' + v + '^{2}+p)(' + v + '^{2}+q)') + ': the constant is ' + t('pq') + ' and the middle coefficient is ' + t('p+q') + '.', 'List every pair of integers with product ' + t(c) + ' (one of them negative) and add each pair.'],
          missHint: 'List every pair of integers with product ' + t(c) + ' — swap which number is negative too — and add each pair.',
          diag: function (got, extra) { if (extra.length && extra.every(function (e) { return c % e === 0; })) return { code: 'p43-k-pair', hint: 'Those look like the numbers ' + t('p') + ' and ' + t('q') + '. The question asks for ' + t('k=p+q') + '.' }; return null; },
          bad: [ks.filter(function (k) { return k > 0; }).length ? ks.filter(function (k) { return k > 0; }) : [999]] });
      } }] },
    { num: '11', section: 'Multiple choice and numerical response', parts: [
      { id: '11', level: 'EMG', make: function (r) {
        var m = r.pick([1, 4, 5, 6, 7]), sgn = r.pick([1, -1]), v = r.pick(['x', 'y']), x2 = L(v, 2), x4 = L(v, 4);
        var T = function (a4, a2, a0) { return tx(P.add(P.scale(x4, a4), P.scale(x2, a2), N(a0))); };
        var right = T(1, sgn * 2 * m, m * m), sq = '(' + tx(P.add(x2, N(sgn * m))) + ')^{2}';
        var opts = [{ html: t(right), right: true },
          { html: t(T(1, sgn * 2 * m, -m * m)), why: 'The last term of a perfect square trinomial is a square, so it must be <b>positive</b>.' },
          { html: t(T(4, sgn * 2 * m, m * m)), why: 'For ' + t('(' + tx(P.add(P.scale(x2, 2), N(sgn * m))) + ')^{2}') + ' the middle term would be ' + t(tx(P.scale(x2, sgn * 4 * m))) + ': twice the product of ' + t(tx(P.scale(x2, 2))) + ' and ' + t(m) + '.' },
          { html: t(T(1, sgn * (m === 1 ? 3 : m * m), m * m)), why: 'For ' + t(sq) + ' the middle term is ' + t(tx(P.scale(x2, sgn * 2 * m))) + ': <b>twice</b> the product of ' + t(tx(x2)) + ' and ' + t(m) + '.' }];
        return B.mc(r, 'Which expression is a perfect square trinomial?', opts, t(right + '=' + sq) + '. The first and last terms are squares and the middle term is twice their product, ' + t('2(' + tx(x2) + ')(' + m + ')') + '.',
          ['A perfect square trinomial is ' + t('A^{2}\\pm 2AB+B^{2}') + ': the last term is positive and the middle term is twice the product of the square roots.'], 'which is a perfect square');
      } },
      { id: '12', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { h: nz(r, -3, 3), q: r.pick([-3, -1, 1, 3]), s: nz(r, -4, 4) }; }, function (o) {
          var c1 = 2 * o.h + o.q, c2 = o.h + o.s; if (!c1 || !c2) return false;
          var e = binSub(binU(1, 'x', o.h), [[2, o.q], [1, o.s]]); if (!fresh(e.exprTex) || !e.b) return false;
          var opts = optsQ12(o); for (var i = 0; i < opts.length; i++) for (var j = i + 1; j < opts.length; j++) if (P.eq(opts[i].p, opts[j].p)) return false;
          return true;
        });
        var s = binSub(binU(1, 'x', o.h), [[2, o.q], [1, o.s]]), ops = optsQ12(o);
        var opts = ops.map(function (x) { return { html: t(x.tex), right: !!x.right, why: x.why }; });
        return B.mc(r, 'When fully factored, ' + t(s.exprTex) + ' is equal to', opts, s.lines.join('<br>'), s.hints, 'MC factor by substitution');
      } },
      { id: '13', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { g: r.pick([2, 3, 4, 5]), m: r.pick([1, 4, 9]), n: r.pick([2, 3, 5, 6, 7]) }; }, function (o) { return o.m !== o.n && !(o.g === 3 && o.m === 4 && o.n === 3); });
        var rm = Math.round(Math.sqrt(o.m)), E = tx(P.mul(N(o.g), P.add(L('x', 2), N(o.m)), P.sub(L('x', 2), N(o.n))));
        var opts = [{ html: t(o.g), why: 'Every term has the common factor ' + t(o.g) + ', so it is a factor.' },
          { html: t('x^{2}+' + o.m), why: t(E + '=' + o.g + '(x^{2}+' + o.m + ')(x^{2}-' + o.n + ')') + ', so ' + t('x^{2}+' + o.m) + ' is a factor.' },
          { html: t('x^{2}-' + o.n), why: t('x^{2}-' + o.n) + ' is one of the factors.' },
          { html: t('x-' + rm), right: true }];
        return B.mc(r, 'Which expression is <b>not</b> a factor of ' + t(E) + '?', opts,
          t(E + '=' + o.g + '(' + tx(P.mul(P.add(L('x', 2), N(o.m)), P.sub(L('x', 2), N(o.n)))) + ')=' + o.g + '(x^{2}+' + o.m + ')(x^{2}-' + o.n + ')') + '. ' + t('x^{2}+' + o.m) + ' is a sum and ' + t(o.n) + ' is not a perfect square, so neither factors further; ' + t('x-' + rm) + ' is not a factor.',
          ['Factor fully first, then look for each option in the factored form.'], 'MC which is not a factor');
      } },
      { id: '14', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { k: r.pick([2, 3]), h: nz(r, -3, 3), p: r.int(2, 3), rr: 1, q: nz(r, -5, 5), s: nz(r, -5, 5) }; }, function (o) {
          if (!coprime(o.k, o.h)) return false;
          var a1 = o.p * o.k, b1 = o.p * o.h + o.q, c1 = o.rr * o.k, d1 = o.rr * o.h + o.s, sum = a1 + b1 + c1 + d1;
          if (!b1 || !d1 || !coprime(a1, b1) || !coprime(c1, d1) || a1 <= c1 || sum < 0 || sum > 99) return false;
          var e = binSub(lin(o.k, L('x'), o.h, 1), [[o.p, o.q], [o.rr, o.s]]); return e.b !== 0 && fresh(e.exprTex);
        });
        var s = binSub(lin(o.k, L('x'), o.h, 1), [[o.p, o.q], [o.rr, o.s]]);
        var a1 = o.p * o.k, b1 = o.p * o.h + o.q, c1 = o.k, d1 = o.h + o.s, ans = a1 + b1 + c1 + d1;
        var p = B.nr('The expression ' + t(s.exprTex) + ' can be factored as ' + t('(ax+b)(cx+d)') + ', where ' + t('a') + ', ' + t('b') + ', ' + t('c') + ' and ' + t('d') + ' are integers and ' + t('a>c>0') + '. The value of ' + t('a+b+c+d') + ' is ____.', ans,
          function (v) { if (v === a1 - b1 + c1 - d1 || v === a1 + Math.abs(b1) + c1 + Math.abs(d1)) return { code: 'p43-nr-sign', hint: 'Keep the signs of ' + t('b') + ' and ' + t('d') + ' as they are in the brackets.' }; if (v === o.p + o.q + o.rr + o.s) return { code: 'p43-letter', hint: 'Those are the numbers from the brackets in ' + t('A') + '. Put ' + t('A=' + tx(lin(o.k, L('x'), o.h, 1))) + ' back first.' }; return null; },
          s.lines.join('<br>') + '<br>' + t('a+b+c+d=' + a1 + sg(b1) + sg(c1) + sg(d1) + '=' + ans), s.hints, 'NR a+b+c+d');
        return p;
      } },
      { id: '15', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(1, 5), b: r.int(2, 7) }; }, function (o) { return o.a < o.b && o.a * o.b <= 30 && !(o.a === 2 && o.b === 5) && !(o.a === 1 && o.b === 3) && !(o.a === 2 && o.b === 3) && !(o.a === 1 && o.b === 5); });
        var A2 = o.a * o.a, B2 = o.b * o.b, ans = o.a * o.b;
        return B.nr('When ' + t('x^{4}-' + (A2 + B2) + 'x^{2}+' + (A2 * B2)) + ' is factored fully, it is ' + t('(x-a)(x+a)(x-b)(x+b)') + ', where ' + t('0<a<b') + '. The value of ' + t('ab') + ' is ____.', ans,
          function (v) { if (v === A2 * B2) return { code: 'p43-nr-order', hint: 'That is ' + t('a^{2}b^{2}') + '. Find ' + t('a') + ' and ' + t('b') + ' themselves.' }; if (v === A2 + B2 || v === o.a + o.b) return { code: 'p43-nr-order', hint: 'The question asks for the <b>product</b> ' + t('ab') + '.' }; return null; },
          t('(x^{2}-' + A2 + ')(x^{2}-' + B2 + ')=(x-' + o.a + ')(x+' + o.a + ')(x-' + o.b + ')(x+' + o.b + ')') + ', so ' + t('a=' + o.a) + ', ' + t('b=' + o.b) + ', ' + t('ab=' + ans) + '.',
          ['Two numbers with product ' + t(A2 * B2) + ' and sum ' + t(-(A2 + B2)) + ' — both are perfect squares.'], 'NR ab');
      } }] }
  ];

  /* ---- helpers used above (function declarations are hoisted) ---- */
  function trigSub(r, F, ex) {
    var o = pickWhere(function () { var pr = r.pick([[2, 1], [3, 1], [2, 3], [4, 1], [3, 2], [5, 1]]); return { p1: pr[0], p2: pr[1], q1: nz(r, -3, 3), q2: nz(r, -3, 3) }; }, function (o) {
      if (!coprime(o.p1, o.q1) || !coprime(o.p2, o.q2)) return false; var f = [[o.p1, o.q1], [o.p2, o.q2]]; if (!abc(f)[1]) return false;
      var e = monoSub(L(F), f, 1, { special: true, vars: [F === 'S' ? 'sin' : 'cos'] }); return fresh(e.exprTex) && (ex || []).indexOf(key0(e.exprTex)) < 0;
    });
    return monoSub(L(F), [[o.p1, o.q1], [o.p2, o.q2]], 1, { special: true, vars: [F === 'S' ? 'sin' : 'cos'] });
  }
  /* A = kx + h with a ≠ 1: (pA + q)(A + s), brackets primitive (no common factor emerges) */
  function binA(r, k, test) {
    var o = pickWhere(function () { return { v: r.pick(['x', 'x', 'a']), h: nz(r, -4, 4), p: r.pick([2, 3, 5]), q: nz(r, -5, 5), s: nz(r, -5, 5), rr: k === 2 ? r.pick([1, 1, 2]) : 1 }; }, function (o) {
      var c1 = o.p * o.h + o.q, c2 = o.rr * o.h + o.s; if (!coprime(o.p, o.q) || !coprime(o.rr, o.s) || !c1 || !c2 || !coprime(o.p * k, c1) || !coprime(o.rr * k, c2)) return false;
      if (o.p === o.rr && o.q === o.s) return false;
      var e = binSub(lin(k, L(o.v), o.h, 1), [[o.p, o.q], [o.rr, o.s]]); return e.b !== 0 && fresh(e.exprTex) && (!test || test(o));
    });
    return binSub(lin(k, L(o.v), o.h, 1), [[o.p, o.q], [o.rr, o.s]]);
  }
  /* A = h − x */
  function revSub(o) { return binSub(lin(-1, L('x'), o.h, 1), [[o.p1, o.q1], [o.p2, o.q2]]); }
  /* g(A + m)(A + n) where A + m simplifies to x: 2(x+2)² + 2(x+2) − 12 = 2x(x + 5) */
  function zeroBr(r, ex) {
    var o = pickWhere(function () { return { v: r.pick(['x', 'x', 'y']), g: r.pick([2, 3, 4, 5]), h: nz(r, -5, 5), n: nz(r, -6, 6) }; }, function (o) {
      return o.n !== -o.h && o.h + o.n !== 0 && o.n - o.h !== 0 && (o.n - o.h) !== 0 && fresh(binSub(binU(1, o.v, o.h), [[1, -o.h], [1, o.n]], o.g).exprTex) && (!ex || ex(o));
    });
    return binSub(binU(1, o.v, o.h), [[1, -o.h], [1, o.n]], o.g);
  }
  /* A² + (u + w)AB + uwB² with A = x + h1, B = x + h2 */
  function twoSub(o) { return sub({ U: binU(1, 'x', o.h1), V: binU(1, 'x', o.h2), f: [[1, o.u], [1, o.w]], mode: 'bin', g: 1 }); }
  /* Q12 options: right, not substituted back, coefficient not distributed, sign slip */
  function optsQ12(o) {
    var U = binU(1, 'x', o.h), x = L('x');
    var mk = function (b1, b2) { var p = P.mul(b1, b2); return { p: p, tex: P.btex(b1) + P.btex(b2) }; };
    var R = mk(lin(2, U, o.q, 1), lin(1, U, o.s, 1)); R.right = true;
    var A = mk(lin(2, x, o.q, 1), lin(1, x, o.s, 1)); A.why = 'Those are the factors of the trinomial in ' + t('A') + ' with ' + t('x') + ' written for ' + t('A') + '. Replace ' + t('A') + ' with ' + t('(' + tx(U) + ')') + '.';
    var C = mk(P.add(P.scale(x, 2), N(o.h + o.q)), lin(1, U, o.s, 1)); C.why = 'In ' + t('2A') + ', multiply <b>both</b> terms of ' + t('(' + tx(U) + ')') + ' by 2: ' + t('2(' + tx(U) + ')=' + tx(P.scale(U, 2))) + '.';
    var D = mk(lin(2, U, -o.q, 1), lin(1, U, o.s, 1)); D.why = 'Check the sign of the constant in the first bracket: expand your answer and compare.';
    return [R, A, C, D];
  }

  var EXTRA = [
    { num: 'A1', section: 'A. Skills', stem: 'Factor fully.', parts: [
      { id: 'A1a', level: 'BEG', make: function (r) { return q1a(r, function (o) { return !(o.m === 2 && o.n === 5) && !(o.m === 3 && o.n === 5); }).part(); } },
      { id: 'A1b', level: 'EMG', make: function (r) { return q2b(r, r.pick(['b', 'x', 'm'])).part(); } },
      { id: 'A1c', level: 'BEG', make: function (r) { return q1c(r, 'x').part(); } },
      { id: 'A1d', level: 'BEG', make: function (r) { return q1d(r, r.pick([['a', 'b'], ['x', 'y'], ['p', 'q']])).part(); } },
      { id: 'A1e', level: 'EMG', make: function (r) { return q2a(r, r.pick(['x', 'y', 'n'])).part(); } },
      { id: 'A1f', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { v: r.pick(['y', 'x', 'b']), g: r.pick([2, 3, 4, 5]), m: r.int(1, 9), n: r.pick([2, 3, 5, 6, 7, 8]) }; }, function (o) { return o.m !== o.n && fresh(monoSub(L(o.v, 2), [[1, o.m], [1, -o.n]], o.g).exprTex); });
        return monoSub(L(o.v, 2), [[1, o.m], [1, -o.n]], o.g).part();
      } }] },
    { num: 'A2', stem: 'Factor fully.', parts: [
      { id: 'A2a', level: 'EMG', make: function (r) { return decomp(r, L(r.pick(['x', 'y']), 2), 2, 'neg').part(); } },
      { id: 'A2b', level: 'PRG', make: function (r) { return decomp(r, L(r.pick(['x', 'a']), 2), 2, 'dos').part(); } },
      { id: 'A2c', level: 'EMG', make: function (r) { return decomp(r, L(r.pick(['p', 'x', 'k']), 3), 3, 'mixed').part(); } },
      { id: 'A2d', level: 'EMG', make: function (r) { var vs = r.pick([['x', 'y'], ['m', 'n'], ['a', 'b']]); return decomp(r, P.mul(L(vs[0]), L(vs[1])), 1, 'pos').part(); } },
      { id: 'A2e', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { v: r.pick(['x', 'y']), g: r.pick([2, 3, 4, 5]), m: r.int(1, 9), n: r.pick([2, 3, 5, 6, 7]) }; }, function (o) { return o.m !== o.n && fresh(monoSub(L(o.v, 2), [[1, o.m], [1, -o.n]], mono(o.g, o.v)).exprTex); });
        return monoSub(L(o.v, 2), [[1, o.m], [1, -o.n]], mono(o.g, o.v)).part();
      } }] },
    { num: 'A3', stem: 'Factor fully. Simplify each factor.', parts: [
      { id: 'A3a', level: 'BEG', make: function (r) {
        var o = pickWhere(function () { return { v: r.pick(['x', 'x', 'p']), h: -r.int(1, 5), m: nz(r, -6, 7), n: nz(r, -6, 7) }; }, function (o) { return o.m !== o.n && o.m + o.n !== 0 && o.h + o.m !== 0 && o.h + o.n !== 0 && o.m * o.n > 0 && fresh(binSub(binU(1, o.v, o.h), [[1, o.m], [1, o.n]]).exprTex); });
        return binSub(binU(1, o.v, o.h), [[1, o.m], [1, o.n]]).part();
      } },
      { id: 'A3b', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { v: r.pick(['a', 'x']), h: r.pick([1, -1, 3, -3]), m: nz(r, -6, 6), n: nz(r, -6, 6) }; }, function (o) { return o.m !== o.n && o.m + o.n !== 0 && (o.h + o.m) % 2 === 0 && (o.h + o.n) % 2 !== 0 && o.h + o.m !== 0 && fresh(binSub(binU(2, o.v, o.h), [[1, o.m], [1, o.n]]).exprTex); });
        return binSub(lin(2, L(o.v), o.h, 1), [[1, o.m], [1, o.n]]).part();
      } },
      { id: 'A3c', level: 'EMG', make: function (r) { return binA(r, 1).part(); } },
      { id: 'A3d', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { v: r.pick(['x', 'a']), h: nz(r, -4, 4), m: r.pick([2, 3]), n: nz(r, -5, 5) }; }, function (o) { var c0 = o.m * o.h + o.n; return coprime(o.m, o.n) && c0 !== 0 && coprime(o.m, c0) && fresh(binSub(binU(1, o.v, o.h), [[o.m, o.n], [o.m, o.n]]).exprTex) && !(o.m === 2 && o.h === 1 && o.n === -3); });
        return binSub(binU(1, o.v, o.h), [[o.m, o.n], [o.m, o.n]]).part();
      } }] },
    { num: 'B1', section: 'B. Applying', parts: [
      { id: 'B1', level: 'EMG', make: function (r) { var s = trigSub(r, 'S', ['2S^2-5S-3', '3S^2+5S-2']); return s.part({ prompt: 'Factor ' + t(s.exprTex) + '.' }); } }] },
    { num: 'B2', parts: [
      { id: 'B2', level: 'ADV', make: function (r) { var s = zeroBr(r); return s.part({ prompt: 'Factor fully: ' + t(s.exprTex) + '.' }); } }] },
    { num: 'B3', parts: [
      { id: 'B3', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { var pr = r.pick([[5, 1], [3, 1], [2, 1], [3, 2], [5, 2], [4, 1]]); return { k: r.pick([2, 3]), h: r.int(1, 3), p1: pr[0], p2: pr[1], q1: nz(r, -6, 6), q2: nz(r, -6, 6) }; }, function (o) {
          var f = [[o.p1, o.q1], [o.p2, o.q2]]; if (!coprime(o.k, o.h) || !coprime(o.p1, o.q1) || !coprime(o.p2, o.q2) || !abc(f)[1]) return false;
          var U = lin(-o.k, L('x'), o.h, 1), e = binSub(U, f); if (!fresh(e.exprTex)) return false;
          if (e.col.br.length !== 2) return false;
          return P.constant(e.col.mono)[0] !== 1 && P.constant(e.col.mono)[0] !== -1; // a common factor appears
        });
        var s = binSub(lin(-o.k, L('x'), o.h, 1), [[o.p1, o.q1], [o.p2, o.q2]]);
        return s.part({ prompt: 'Factor fully: ' + t(s.exprTex) + '.' });
      } }] },
    { num: 'B4', parts: [
      { id: 'B4', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { h: nz(r, -4, 4), p: r.pick([2, 3, 5]), q: nz(r, -5, 5), s: nz(r, -5, 5) }; }, function (o) { var c1 = o.p * o.h + o.q, c2 = o.h + o.s; return coprime(o.p, o.q) && c1 && c2 && coprime(o.p, c1) && abc([[o.p, o.q], [1, o.s]])[1] !== 0 && fresh(binSub(binU(1, 'x', o.h), [[o.p, o.q], [1, o.s]]).exprTex); });
        var s = binSub(binU(1, 'x', o.h), [[o.p, o.q], [1, o.s]]), U = binU(1, 'x', o.h);
        var chk = '<br>Check by expanding first: ' + t(cterm(s.a, '(' + tx(P.pow(U, 2)) + ')', true) + cterm(s.b, '(' + tx(U) + ')', false) + sg(s.c) + '=' + tx(s.Q)) + ', which factors to ' + t(s.key) + ' ✓';
        return s.part({ prompt: 'Factor ' + t(s.exprTex) + ' by substitution. (Then check by expanding first.)', solPost: chk });
      } }] },
    { num: 'B5', parts: [
      { id: 'B5', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { p: r.pick([2, 3]), q: nz(r, -5, 5), s: nz(r, -5, 5), pick: r.int(0, 1) }; }, function (o) {
          return o.q * o.s < 0 && coprime(o.p, o.q) && o.q + o.p * o.s !== 0 && Math.abs(o.q) !== Math.abs(o.s) && !(o.p === 2 && o.q === -3 && o.s === 2) && !isSq(Math.abs(o.q)) && !isSq(Math.abs(o.s));
        });
        var x2 = L('x', 2), b1 = lin(o.p, x2, o.q, 1), b2 = lin(1, x2, o.s, 1), E = P.mul(b1, b2);
        var right = o.pick ? b2 : b1, other = o.pick ? b1 : b2;
        var flipO = P.sub(P.scale(x2, P.coef(other, { x: 2 })[0]), N(P.constant(other)[0])), flipR = P.sub(P.scale(x2, P.coef(right, { x: 2 })[0]), N(P.constant(right)[0]));
        var linO = lin(P.coef(other, { x: 2 })[0], L('x'), P.constant(other)[0], 1);
        var opts = [{ html: t(tx(right)), right: true }, { html: t(tx(flipO)), why: 'Check the sign: the two numbers for the decomposition have product ' + t(o.p * o.q * o.s) + ' and sum ' + t(o.q + o.p * o.s) + '. Expand your factors to compare.' },
          { html: t(tx(flipR)), why: 'Close — but the sign is wrong. The two numbers for the decomposition have product ' + t(o.p * o.q * o.s) + ' and sum ' + t(o.q + o.p * o.s) + '.' },
          { html: t(tx(linO)), why: 'The trinomial is in ' + t('x^{2}') + ': its factors contain ' + t('x^{2}') + ', not ' + t('x') + '.' }];
        var pq = [o.p * o.s, o.q];
        return B.mc(r, 'Which expression is a factor of ' + t(tx(E)) + '?', opts,
          'Let ' + t('A=x^{2}') + ': product ' + t(o.p * o.q * o.s) + ', sum ' + t(o.q + o.p * o.s) + ': ' + t(pq[0]) + ' and ' + t(pq[1]) + '.<br>' + t(tx(E) + '=(' + tx(b1) + ')(' + tx(b2) + ')') + ', so ' + t(tx(right)) + ' is a factor.',
          ['Factor it by decomposition with ' + t('A=x^{2}') + ', then compare.'], 'MC which is a factor');
      } }] },
    { num: 'B6', parts: [
      { id: 'B6', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { h: r.int(1, 6), m: r.int(1, 9), n: -r.int(1, 9) }; }, function (o) { return o.m - o.h > 0 && o.n - o.h < 0 && o.m + o.n !== 0 && !(o.h === 5 && o.m === 6 && o.n === -2); });
        var s = binSub(binU(1, 'x', -o.h), [[1, o.m], [1, o.n]]), a = o.m - o.h, b = o.h - o.n;
        return B.nr('When factored, ' + t(s.exprTex + '=(x+a)(x-b)') + ', where ' + t('a>0') + ' and ' + t('b>0') + '. The value of ' + t('a+b') + ' is ____.', a + b,
          function (v) { if (v === o.m - o.n) return { code: 'p43-letter', hint: 'Those are the numbers from the brackets in ' + t('A') + '. Put ' + t('A=x-' + o.h) + ' back first.' }; return null; },
          s.lines.join('<br>') + '<br>' + t('a=' + a + ',\\ b=' + b + ',\\ a+b=' + (a + b)), s.hints, 'NR a+b');
      } }] },
    { num: 'C1', section: 'C. Stretch', parts: [
      { id: 'C1', level: 'ADV', make: function (r) { var s = q2f(r, function (o) { return !(o.m === 1 && o.n === 3) && !(o.m === 2 && o.n === 3); }); return s.part({ prompt: 'Factor fully: ' + t(s.exprTex) + '.' }); } }] },
    { num: 'C2', parts: [
      { id: 'C2', level: 'MAS', make: function (r) {
        var o = pickWhere(function () { return { h1: nz(r, -4, 4), h2: nz(r, -4, 4), p: r.pick([2, 3, 4]), u: r.pick([1, 2, 3]) }; }, function (o) {
          if (o.h1 === o.h2 || o.p === o.u) return false; var e = sub({ U: binU(1, 'x', o.h1), V: binU(1, 'x', o.h2), f: [[o.p, o.u], [1, -1]], mode: 'bin' });
          return fresh(e.exprTex) && !(o.p === 3 && o.u === 1 && o.h1 === 1 && o.h2 === -1) && e.col.br.length === 1 && e.b !== 0;
        });
        var s = sub({ U: binU(1, 'x', o.h1), V: binU(1, 'x', o.h2), f: [[o.p, o.u], [1, -1]], mode: 'bin' });
        return s.part({ prompt: 'Factor fully: ' + t(s.exprTex) + '.' });
      } }] },
    { num: 'C3', parts: [
      { id: 'C3', level: 'MAS', make: function (r) {
        var o = pickWhere(function () { return { a: r.pick([2, 3]), c: r.pick([3, 5, 7, 6, 10, 14, 15, 11]) }; }, function (o) { return !(o.a === 2 && o.c === 5) && o.a !== o.c; });
        var pairs = [], bs = [];
        for (var p = -o.c; p <= o.c; p++) { if (!p || o.c % p) continue; var q = -o.c / p; pairs.push([p, q]); if (bs.indexOf(p + o.a * q) < 0) bs.push(p + o.a * q); }
        return listPart('Find all integers ' + t('b') + ' for which ' + t(o.a + 'x^{4}+bx^{2}-' + o.c) + ' can be factored as ' + t('(' + o.a + 'x^{2}+p)(x^{2}+q)') + ', with ' + t('p') + ' and ' + t('q') + ' integers.', bs, {
          text: 'all b for ax⁴ + bx² − c',
          sol: 'Expanding: ' + t('(' + o.a + 'x^{2}+p)(x^{2}+q)=' + o.a + 'x^{4}+(' + o.a + 'q+p)x^{2}+pq') + ', so ' + t('pq=-' + o.c) + ' and ' + t('b=p+' + o.a + 'q') + '.<br>' + pairs.map(function (pq) { return t('(p,q)=(' + pq[0] + ',\\ ' + pq[1] + ')') + ': ' + t('b=' + (pq[0] + o.a * pq[1])); }).join('; ') + '.<br>' + t('b\\in\\{' + bs.slice().sort(function (x, y) { return x - y; }).join(',\\ ') + '\\}'),
          hints: ['Expand ' + t('(' + o.a + 'x^{2}+p)(x^{2}+q)') + ': the middle coefficient is ' + t('p+' + o.a + 'q') + ', not ' + t('p+q') + '.', 'Go through every integer pair with ' + t('pq=-' + o.c) + ' — the order matters, because ' + t('q') + ' is multiplied by ' + t(o.a) + '.'],
          missHint: 'The order of ' + t('p') + ' and ' + t('q') + ' matters here: try each pair both ways round.',
          diag: function (got) { var wrongB = []; pairs.forEach(function (pq) { var v = pq[0] + pq[1]; if (wrongB.indexOf(v) < 0) wrongB.push(v); }); if (got.some(function (v) { return bs.indexOf(v) < 0 && wrongB.indexOf(v) >= 0; })) return { code: 'p43-k-extra', hint: 'The middle coefficient is ' + t('p+' + o.a + 'q') + ' (the ' + t('x^{2}') + ' in the first bracket is multiplied by ' + t(o.a) + '), not ' + t('p+q') + '.' }; return null; } });
      } }] }
  ];

  /* the multiple-choice / numerical-response block is written as one list of parts; each part is its own booklet question */
  function splitQs(qs) {
    var out = [];
    qs.forEach(function (q) {
      if (q.parts.length > 1 && q.parts.every(function (pt) { return /^\d+$/.test(pt.id); })) q.parts.forEach(function (pt, i) { out.push({ num: pt.id, section: i ? undefined : q.section, parts: [pt] }); });
      else out.push(q);
    });
    return out;
  }
  HW.defineLesson({ id: 'u4l3', unit: 4, num: '3', title: 'Factoring by Substitution: a(f(x))² + b(f(x)) + c', outcome: 'RF1', calc: true, questions: splitQs(QUESTIONS), extra: EXTRA });
})(window);
