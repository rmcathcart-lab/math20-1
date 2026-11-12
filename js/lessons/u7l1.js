/* Math 20-1 · Unit 7 · Lesson 1 — Absolute Value of Real Numbers (outcome AN1 on every part)
 * Assignment 1 (m201book unit7/u7_l01.tex, Questions 1–18) and the Lesson 1 Extra Practice (u7_ep01.tex, A1–C4).
 * Every part is a generator: the booklet question's idea, form and difficulty with new numbers (the lesson's example
 * numbers and the booklet question's own numbers are left out where feasible). Calculator allowed (calc: true); answers
 * are exact where the booklet's are (fractions, radicals, π), with the nearest hundredth asked beside them in Q3(e)–(f).
 *
 * Answers: numbers in a number box; exact values (fractions, radicals, π) in a math box checked by value, with a nudge for
 * a rounded decimal or absolute value bars left in; solution lists "x = a, x = b" (any order); expressions in x through
 * K.poly; piecewise definitions and paired values in labelled boxes; ordering by tapping; "replace □ with <, > or =",
 * true/false-with-counterexample and "which statement" items as multiple choice; "which boxes pass" as a select.
 * Recognised mistakes (u7l1- codes): bars treated as brackets (a negative kept), a minus sign outside the bars made
 * positive, bars split or merged over a sum or difference, a principal square root taken as negative, a cube root of a
 * negative taken as positive, (−a)² read as −a², a distance given as a negative or as the difference of the sizes, the
 * centre's sign slipped (|x + h| read as the distance from h), net change and total distance mixed up, |x| = x used for
 * x < 0, a piece on the wrong interval.
 * Conversions: Q7 and EP C4 "explain / give a counterexample" → multiple choice between explanations and candidate
 * counterexamples (EP C4 first checks one opposite-sign pair); Q12(c) "explain" → multiple choice; Q14 "explain what it
 * measures" → multiple choice; EP B2 closest / farthest → a table of choices; EP C1 "for which values" → inequalities.
 * Levels: LIM BEG EMG PRG ADV MAS. Mastery: Q14(a), EP C2(a)–(c), EP C3.
 *
 * HW.u7kit — the Unit 7 practice kit (this file loads first among the Unit 7 lessons; later Unit 7 practice files can use
 * it). Nothing in it depends on js/lessons/u7test.js. Contents:
 *   numbers/TeX  gcd, nz(r, lo, hi) (non-zero ±), pickWhere(gen, test), toR(x) → [p, q], rv, rt(x) (exact TeX), dt(x)
 *                (decimal TeX), sgT(x) (signed term "+3"/"-3"), coefT, A(s) (\lvert s\rvert), AL(s) (\left\lvert…),
 *                pn(x) ("(−3)" when negative), pt(x, y), money(cents), has, uniqNums, sameSet
 *   polynomials  M(c, e), lin(a, b), tx(p), linT(a, b, constFirst) (6 − 3x rather than −3x + 6)
 *   codes        codes(prefix, { code: [label, 's'|'b'|'n'|''] }) registers labels + partial credit
 *   parts        num(prompt, target, wrongs, sol, hints, text, o)   a number (o.box 'number') or exact value (math box,
 *                                                                    o.keys); wrongs [{ v, code, hint, tex }]; o.noAbs,
 *                                                                    o.exact (rounded-decimal nudge), o.money ($ allowed)
 *                approx(prompt, x, dp, wrongs, sol, hints, text)    a rounded value
 *                vals(prompt, vals, wrongs, sol, hints, text, o)     a list of values in any order ({ vals: [...], code });
 *                                                                    o.v the letter (null: bare numbers), o.dec decimals in the key
 *                point(prompt, target, wrongs, sol, hints, text)     one point (x, y)
 *                pts(prompt, pairs, wrongs, sol, hints, text, o)     a set of points, or "none" ({ pairs: [...], code })
 *                setChk(targetTex, o)                                K.set (domain / range / inequality answers)
 *                icptChk(axis, v, wrongs)                            an intercept typed as a number or a point ('x' | 'y')
 *                ptsCheck(pairs, wrongs, o) / isNone(s) / ptsT(list)  point-set checker with "none"; numVal(s)
 *                fields(prompt, fields, checkers, keys, answer, sol, hints, text, bad, combine)
 *                poly(prompt, target, wrongs, sol, hints, text, o)   an expression in x ({ is: poly, code, hint })
 *                mc(r, prompt, opts, sol, hints, text, keepOrder)    multiple choice (K.P.mc)
 *                piece(cp, a, b, o)                                  piecewise form of y = |ax + b| (three boxes:
 *                                                                    boundary, right piece, left piece) with pw-swap,
 *                                                                    pw-bsign, pw-neg, pw-bound diagnoses (codes from
 *                                                                    U.PIECE_CODES; o.cf constant first, o.short the
 *                                                                    prompt is just y = |…| under a question stem)
 *                absLinChk(a, b, cp)                                 a typed |ax + b| (bars needed; same values; the
 *                                                                    opposite inside accepted)
 *   graphs       G(o), mini(o), crv(f, o) (HW.graph wrappers); vPad(a, b, o) → { input, key, wrongs } a graph pad for
 *                drawing y = |ax + b| (or y = |c|) with the line y = f(x) shown when o.showF; vGraph(cp, prompt, a, b, o,
 *                sol, hints, text) the drawing part (K.graphExact, with f, −|f| and −f recognised); armPt(a, b, dir, snap)
 *   keypads      'u7kpts' (points + none), 'u7kabs' (x, |x|, fractions: typing |ax + b|), 'u7kvals' (x =, ±, comma). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, KP = K.P, P = HW.poly, ex = HW.ex, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
  if (!K.set || !K.point || !K.pairs || !HW.graph || !K.poly || !K.graphExact) throw new Error('js/lessons/u7l1.js needs js/relfn.js, js/lines.js, js/poly.js and js/draw.js');

  /* ==================================================================================================
   * HW.u7kit
   * ================================================================================================== */
  var U = HW.u7kit = {};
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var c = a % b; a = b; b = c; } return a || 1; }
  function pickWhere(gen, test) { for (var i = 0; i < 10000; i++) { var o = gen(); if (o && test(o)) return o; } throw new Error('u7kit: no instance found'); }
  function nz(r, lo, hi) { return (r.chance(0.5) ? -1 : 1) * r.int(lo, hi); }
  function toR(x) { if (Array.isArray(x)) return ex.norm(x[0], x[1]); for (var q = 1; q <= 5000; q++) { var p = x * q; if (Math.abs(p - Math.round(p)) < 1e-9) return ex.norm(Math.round(p), q); } return null; }
  function rv(x) { return Array.isArray(x) ? x[0] / x[1] : x; }
  function rt(x) { var f = toR(x); return f ? ex.texRat(f) : String(+rv(x).toFixed(6)); }
  function dt(x) { return String(+rv(x).toFixed(6)); }
  function sgT(x) { return (rv(x) < 0 ? '-' : '+') + rt(Math.abs(rv(x))); }
  function coefT(a) { var v = rv(a); return v === 1 ? '' : v === -1 ? '-' : rt(a); }
  function A(s) { return '\\lvert ' + s + '\\rvert '; }
  function AL(s) { return '\\left\\lvert ' + s + '\\right\\rvert '; }
  function pn(x) { return rv(x) < 0 ? '(' + rt(x) + ')' : rt(x); }
  function pnd(x) { return x < 0 ? '(' + dt(x) + ')' : dt(x); }
  function pt(x, y) { return '(' + rt(x) + ',\\ ' + rt(y) + ')'; }
  function money(c) { return (c < 0 ? '-' : '') + '\\$' + (Math.abs(c) / 100).toFixed(2); }
  function has(arr, x) { return arr.some(function (y) { return Math.abs(x - y) < 1e-9 * Math.max(1, Math.abs(x)); }); }
  function uniqNums(a) { var out = []; a.forEach(function (x) { if (!has(out, x)) out.push(x); }); return out; }
  function sameSet(X, Y) { X = uniqNums(X); Y = uniqNums(Y); return X.length === Y.length && X.every(function (x) { return has(Y, x); }); }
  function M(c, e) { return e ? P.mono(toR(c), { x: e }) : P.num(toR(c)); }
  function lin(a, b) { return P.add(M(a, 1), M(b, 0)); }
  function tx(p) { return P.tex(p); }
  function linT(a, b, cf) { return cf && rv(a) < 0 && rv(b) !== 0 ? P.seq([M(b, 0), M(a, 1)]) : tx(lin(a, b)); }
  function linV(a, b, v) { return linT(a, b, false).replace(/x/g, v || 'x'); }
  Object.assign(U, { gcd: gcd, pickWhere: pickWhere, nz: nz, toR: toR, rv: rv, rt: rt, dt: dt, sgT: sgT, coefT: coefT, A: A, AL: AL, pn: pn, pnd: pnd, pt: pt, money: money,
    has: has, uniqNums: uniqNums, sameSet: sameSet, M: M, lin: lin, tx: tx, linT: linT, linV: linV });

  /* codes: { code: [label, partial] } registered under a prefix */
  U.codes = function (cp, o) {
    var c = {}, pa = {};
    Object.keys(o).forEach(function (k) { c[cp + k] = o[k][0]; if (o[k][1]) pa[cp + k] = o[k][1]; });
    HW.addCodes(c); HW.addPartial(pa);
  };
  U.PIECE_CODES = { 'pw-swap': ['Piecewise: the two pieces on the wrong sides', 'b'], 'pw-bsign': ['Piecewise: boundary with the wrong sign', 's'], 'pw-neg': ['Piecewise: took the opposite of only one term', 's'], 'pw-bound': ['Piecewise: wrong boundary', 'b'] };

  function stripMoney(s) { return String(s == null ? '' : s).replace(/\\\$|\$/g, '').replace(/\\text\{\s*\}/g, '').trim(); }
  function numVal(s) { s = String(s == null ? '' : s).trim().replace(/^\+/, ''); if (!s) return null; var r = ex.parse(s); if (!r.ok) return null; var v = ex.value(r.ast); return isFinite(v) ? v : null; }
  U.numVal = numVal;

  /* a number or an exact value */
  U.num = function (prompt, target, wr, sol, hints, text, o) {
    o = o || {};
    var T = rv(target), W = (wr || []).filter(function (w) { return Math.abs(rv(w.v) - T) > 1e-9 * Math.max(1, Math.abs(T)); });
    var diag = function (v) { for (var i = 0; i < W.length; i++) if (Math.abs(v - rv(W[i].v)) < 1e-9 * Math.max(1, Math.abs(v))) return { code: W[i].code, hint: W[i].hint }; return null; };
    var keyTex = o.keyTex || (o.money ? T.toFixed(2) : Array.isArray(target) ? rt(target) : Number.isInteger(T) ? String(T) : (o.box === 'number' ? dt(T) : rt(T)));
    var part;
    if (o.box === 'number') {
      var nchk = K.number(T, diag, { nr: !!o.nr });
      var check = o.money ? function (resp) { return nchk(stripMoney(resp)); } : nchk;
      part = { prompt: prompt, input: { type: 'number', nr: !!o.nr, before: o.before, after: o.after }, check: check, key: o.money ? T.toFixed(2) : dt(T), answer: t((o.money ? '\\$' : '') + keyTex), solution: sol, hints: hints || [], text: text };
    } else {
      var base = K.value(Array.isArray(target) ? target : T, { diag: diag, only: o.only });
      var chk = function (resp) {
        if (o.noAbs !== false && /\\lvert|\\vert|\||\\left\|/.test(String(resp || ''))) {
          var a0 = K.read(resp); if (!a0.res) return form('abs-left', 'Simplify all the way: write the value without absolute value bars.');
        }
        var res = base(resp);
        if (res.v === 'wrong' && res.code === 'value' && o.exact !== false) { var a = K.read(resp); if (!a.res && /\d\.\d/.test(String(resp)) && Math.abs(a.val - T) < 0.006 && Math.abs(a.val - T) > 1e-9) return form('exact', 'That is a rounded decimal. Give the <b>exact</b> value.'); }
        return res;
      };
      part = KP.math(prompt, chk, keyTex, sol, hints, text, { keys: o.keys || 'fraction', before: o.before, after: o.after });
    }
    part.bad = W.map(function (w) { return o.box === 'number' ? dt(rv(w.v)) : (w.tex || rt(w.v)); }).filter(function (b, i, arr) { return arr.indexOf(b) === i && b !== part.key; });
    return part;
  };
  U.approx = function (prompt, x, dp, wr, sol, hints, text) {
    var W = (wr || []).filter(function (w) { return Math.abs(K.roundTo(w.v, dp) - K.roundTo(x, dp)) > 1e-9; });
    var p = KP.approx(prompt, x, dp, { diag: function (v) { for (var i = 0; i < W.length; i++) if (Math.abs(v - K.roundTo(W[i].v, dp)) < 1e-9) return { code: W[i].code, hint: W[i].hint }; return null; } }, sol, hints, text);
    p.bad = W.map(function (w) { return K.roundTo(w.v, dp).toFixed(dp); });
    return p;
  };
  /* a list of values (any order); wrongs [{ vals, code, hint }] */
  U.vals = function (prompt, vals, wr, sol, hints, text, o) {
    o = o || {};
    var v = o.v === undefined ? 'x' : o.v, T = uniqNums(vals.map(rv));
    var W = (wr || []).filter(function (w) { return !sameSet(w.vals.map(rv), T); });
    var chk = K.valueSet(vals, { v: v || undefined, diag: function (Aa) { for (var i = 0; i < W.length; i++) if (sameSet(Aa, W[i].vals.map(rv))) return { code: W[i].code, hint: W[i].hint }; return null; } });
    var fmt = o.dec ? dt : rt, keyTex = vals.map(function (x) { return (v ? v + '=' : '') + fmt(x); }).join(',\\ ');
    var part = KP.math(prompt, chk, keyTex, sol, hints, text, { keys: 'u7kvals', vars: [v || 'x'], placeholder: v ? 'e.g. ' + v + ' = 3, ' + v + ' = -5' : 'e.g. 3, -5' });
    part.bad = W.map(function (w) { return w.vals.map(function (x) { return (v ? v + '=' : '') + fmt(x); }).join(',\\ '); });
    return part;
  };
  U.point = function (prompt, target, wr, sol, hints, text) {
    var T = [rv(target[0]), rv(target[1])], W = (wr || []).filter(function (w) { return !(Math.abs(rv(w.p[0]) - T[0]) < 1e-9 && Math.abs(rv(w.p[1]) - T[1]) < 1e-9); });
    var chk = K.point(target.map(function (c) { return toR(c) || c; }), { wrong: W.map(function (w) { return { is: w.p.map(function (c) { return toR(c) || c; }), code: w.code, hint: w.hint }; }) });
    var keyTex = pt(target[0], target[1]);
    var part = KP.math(prompt, chk, keyTex, sol, hints, text, { keys: 'u7kpts', placeholder: 'e.g. (3, -2)' });
    part.bad = W.map(function (w) { return pt(w.p[0], w.p[1]); }).filter(function (b, i, arr) { return arr.indexOf(b) === i && b !== keyTex; });
    return part;
  };
  function plainLow(s) { return String(s == null ? '' : s).replace(/\\text\{([^}]*)\}|\\mathrm\{([^}]*)\}/g, function (m, a, b) { return a || b || ''; }).replace(/\\left|\\right|\\[,;:! ]|~/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase(); }
  function isNone(s) { return /^(none|no (invariant )?points?|no invariant points|∅|\\emptyset|\\varnothing)$/.test(plainLow(s)); }
  U.isNone = isNone;
  function samePairs(L, M2) { return L.length === M2.length && L.every(function (q) { return M2.some(function (p) { return Math.abs(rv(p[0]) - rv(q[0])) < 1e-9 && Math.abs(rv(p[1]) - rv(q[1])) < 1e-9; }); }); }
  U.ptsCheck = function (pairs, wr, o) {
    o = o || {};
    var base = pairs.length ? K.pairs(pairs.map(function (p) { return [rv(p[0]), rv(p[1])]; })) : null;
    var W = (wr || []).filter(function (w) { return !samePairs(w.pairs, pairs); }).map(function (w) { return { c: w.pairs.length ? K.pairs(w.pairs.map(function (p) { return [rv(p[0]), rv(p[1])]; })) : null, none: !w.pairs.length, code: w.code, hint: w.hint }; });
    return function (resp) {
      var s = String(resp == null ? '' : resp).replace(/\\left|\\right/g, '').replace(/\\[ ,;:!]|~/g, ' ');
      if (!s.trim()) return form('empty', 'Type your answer first.');
      if (isNone(s)) { if (!pairs.length) return ok(); var wn = W.filter(function (w) { return w.none; })[0]; return wrong(wn ? wn.code : 'value', wn ? wn.hint : o.noneHint || 'There is at least one: look for where the graph meets the line.'); }
      if (!/\(/.test(s)) return form('pts-fmt', 'Give each one as a point ' + t('(x,\\ y)') + ', separated by commas' + (o.noneOk !== false ? ' (or write none)' : '') + '.');
      if (!pairs.length) { for (var j = 0; j < W.length; j++) if (W[j].c && W[j].c(s).v === 'correct') return wrong(W[j].code, W[j].hint); return wrong('value', o.extraHint || 'There are none here.'); }
      var res = base(s);
      if (res.v === 'correct' || res.v === 'form') return res;
      for (var i = 0; i < W.length; i++) if (W[i].c && W[i].c(s).v === 'correct') return wrong(W[i].code, W[i].hint);
      return res;
    };
  };
  function ptsT(list) { return list.length ? list.map(function (p) { return pt(p[0], p[1]); }).join(',\\ ') : '\\text{none}'; }
  U.ptsT = ptsT;
  U.pts = function (prompt, pairs, wr, sol, hints, text, o) {
    o = o || {};
    var keyTex = ptsT(pairs), part = KP.math(prompt, U.ptsCheck(pairs, wr, o), keyTex, sol, hints, text, { keys: 'u7kpts', placeholder: 'e.g. (1, 0), (5, 0)' + (o.noneOk !== false ? '   (or: none)' : '') });
    part.bad = (wr || []).filter(function (w) { return !samePairs(w.pairs, pairs); }).map(function (w) { return ptsT(w.pairs); }).concat(pairs.length && o.noneOk !== false ? ['\\text{none}'] : []).filter(function (b, i, arr) { return arr.indexOf(b) === i && b !== keyTex; });
    return part;
  };
  U.setChk = function (targetTex, o) { return K.set(targetTex, o || {}); };
  /* an intercept typed as a number or as a point: axis 'y' → v or (0, v); axis 'x' → v or (v, 0). wr [{ v, code, hint }] */
  U.icptChk = function (axis, v, wr) {
    var T = rv(v), W = (wr || []).filter(function (w) { return Math.abs(rv(w.v) - T) > 1e-9; });
    var asPt = function (c) { return axis === 'y' ? [[0, 1], toR(c)] : [toR(c), [0, 1]]; };
    var pc = K.point(asPt(v), { wrong: W.map(function (w) { return { is: asPt(w.v), code: w.code, hint: w.hint }; }) });
    var vc = K.value(T, { diag: function (x) { for (var i = 0; i < W.length; i++) if (Math.abs(x - rv(W[i].v)) < 1e-9 * Math.max(1, Math.abs(x))) return { code: W[i].code, hint: W[i].hint }; return null; } });
    return function (resp) { return /\(/.test(String(resp || '')) && /,/.test(String(resp || '')) ? pc(resp) : vc(resp); };
  };
  U.fields = function (prompt, fields, checkers, keys, answer, sol, hints, text, bad, combine) {
    var base = K.fields(checkers, { labels: fields.map(function (f) { return f.name || f.label; }) });
    return { prompt: prompt, input: { type: 'fields', fields: fields }, check: function (resp) { resp = resp || []; var c = combine ? combine(resp) : null; return c || base(resp); }, key: keys, answer: answer, solution: sol, hints: hints || [], text: text, bad: (bad || []).filter(function (b) { return b.join('|') !== keys.join('|'); }) };
  };
  U.poly = function (prompt, target, wr, sol, hints, text, o) {
    o = o || {};
    var p = KP.poly(prompt, target, Object.assign({ wrong: wr || [], expanded: o.expanded }, o), sol, hints, text);
    p.bad = (wr || []).map(function (w) { return tx(w.is); }).filter(function (b, i, arr) { return arr.indexOf(b) === i && b !== p.key; });
    return p;
  };
  U.mc = function (r, prompt, opts, sol, hints, text, keepOrder) { return KP.mc(r, prompt, opts, sol, hints, text, keepOrder); };
  function polyIs(target) { var c = K.poly(target, { expanded: false }); return function (s) { return c(s).v === 'correct'; }; }
  U.polyIs = polyIs;

  /* the piecewise form of y = |ax + b| (a ≠ 0): boundary h = −b/a, the right piece (larger x) and the left piece */
  U.piece = function (cp, a, b, o) {
    o = o || {};
    var v = o.v || 'x', aa = toR(a), bb = toR(b), av = rv(aa), h = toR(-rv(bb) / av), hv = rv(h);
    var E = lin(aa, bb), pos = av > 0, R = pos ? E : P.neg(E), Lf = P.neg(R);
    var rename = function (s) { return v === 'x' ? s : s.replace(/x/g, v); };
    var fT = rename(o.fTex || linT(aa, bb, o.cf));
    var fields = [{ label: 'The pieces meet at ' + t(v + '='), name: 'boundary', mode: 'math', keys: 'poly', vars: [v] },
      { label: 'To the right of it (larger ' + t(v) + '): ' + t('y='), name: 'right piece', mode: 'math', keys: 'poly', vars: [v] },
      { label: 'To the left of it (smaller ' + t(v) + '): ' + t('y='), name: 'left piece', mode: 'math', keys: 'poly', vars: [v] }];
    var toX = function (s) { return v === 'x' ? s : String(s || '').replace(new RegExp(v, 'g'), 'x'); };
    var isR = polyIs(R), isL = polyIs(Lf), negOne = P.add(M(P.coef(Lf, { x: 1 }), 1), P.num(P.constant(R)));
    var cR = K.poly(R, { expanded: false }), cL = K.poly(Lf, { expanded: false }), cH = K.value(h);
    var checkers = [cH, function (s) { return cR(toX(s)); }, function (s) { return cL(toX(s)); }];
    var keys = [rt(h), rename(tx(R)), rename(tx(Lf))];
    var combine = function (resp) {
      var k = numVal(resp[0]); if (k == null) return null;
      var kOK = Math.abs(k - hv) < 1e-9, s1 = toX(resp[1]), s2 = toX(resp[2]);
      if (!String(s1).trim() || !String(s2).trim()) return null;
      if (kOK && isL(s1) && isR(s2)) return wrong(cp + 'pw-swap', 'Your two pieces are on the wrong sides. Solve ' + t(fT + '\\ge 0') + ' for ' + t(v) + (pos ? '' : ': dividing by a negative number reverses the inequality') + '. The expression itself is the piece on the side where it is positive.');
      if (hv !== 0 && Math.abs(k + hv) < 1e-9 && ((isR(s1) && isL(s2)) || (isL(s1) && isR(s2)))) return wrong(cp + 'pw-bsign', 'The pieces meet at the zero of ' + t(fT) + ': solve ' + t(fT + '=0') + ' again and check the sign.');
      if (kOK && isR(s1) && polyIs(negOne)(s2) && !P.eq(negOne, Lf)) return wrong(cp + 'pw-neg', 'The other piece is the opposite of the <b>whole</b> expression: ' + t('-(' + rename(tx(R)) + ')=' + rename(tx(Lf))) + '. Change the sign of every term.');
      if (!kOK && isR(s1) && isL(s2)) return wrong(cp + 'pw-bound', 'The pieces are right. They meet where ' + t(fT + '=0') + '.');
      return null;
    };
    var bad = [[keys[0], keys[2], keys[1]], [rt(-hv), keys[1], keys[2]], [keys[0], keys[1], rename(tx(negOne))]];
    if (hv === 0) bad.splice(1, 1);
    var ge = pos ? t(v + '\\ge ' + rt(h)) : t(v + '\\le ' + rt(h)), lt = pos ? t(v + '<' + rt(h)) : t(v + '>' + rt(h));
    var ineq = pos ? t(fT + '\\ge 0') + ' gives ' + t(v + '\\ge ' + rt(h)) : t(fT + '\\ge 0') + ' gives ' + t(rename(tx(M(aa, 1))) + '\\ge ' + rt(-rv(bb))) + ', so ' + t(v + '\\le ' + rt(h)) + ' (dividing by a negative number reverses the sign)';
    var cases = 'y=\\begin{cases}' + fT + ', & ' + (pos ? v + '\\ge ' : v + '\\le ') + rt(h) + '\\\\ ' + rename(tx(P.neg(E))) + ', & ' + (pos ? v + '<' : v + '>') + rt(h) + '\\end{cases}';
    return U.fields(o.prompt || (o.short ? t('y=' + AL(fT)) : 'Write ' + t('y=' + AL(fT)) + ' in piecewise form: give the value of ' + t(v) + ' where the two pieces meet, and the expression for ' + t('y') + ' on each side of it.'), fields, checkers, keys, t(cases),
      ineq + '. There ' + t('y=' + fT) + ' (the bars change nothing); on the other side ' + t('y=-(' + fT + ')=' + rename(tx(P.neg(E)))) + '.<br>' + t(cases) + (o.solMore || ''),
      o.hints || ['Solve ' + t(fT + '\\ge 0') + ' for ' + t(v) + '. Dividing by a negative number reverses the inequality sign.', 'Where the expression inside the bars is negative, the piece is its opposite: change the sign of <b>every</b> term.'], o.text || 'piecewise form of y = |ax + b|', bad, combine);
  };

  /* a typed |ax + b| (for "write y = |ax + b|"): bars needed, the same values everywhere (the opposite inside is the same function) */
  U.absLinChk = function (a, b, cp) {
    var f = function (x) { return Math.abs(rv(a) * x + rv(b)); }, h0 = -rv(b) / rv(a), xs = [h0 - 3.3, h0 - 1.1, h0 - 0.4, h0 + 0.6, h0 + 2.2, h0 + 4.7, 0];
    return function (resp) {
      var s = String(resp == null ? '' : resp).replace(/^\s*y\s*=\s*/, '').replace(/([\dx)}])\s*\\left(\||\\lvert)/g, '$1\\times\\left$2');
      var p = ex.parse(s);
      if (!p.ok) return form(p.code === 'empty' ? 'empty' : 'unreadable', p.code === 'empty' ? 'Type your answer first.' : 'I can’t read that. Use the ' + t('|x|') + ' key for the bars, e.g. ' + t('\\lvert 2x+4\\rvert') + '.');
      var vals = xs.map(function (x) { return ex.value(p.ast, { x: x }); });
      if (vals.some(function (v) { return !isFinite(v); })) return form('unreadable', 'Use only ' + t('x') + ' and numbers, with absolute value bars.');
      var same = xs.every(function (x, i) { return Math.abs(vals[i] - f(x)) < 1e-7 * Math.max(1, f(x)); });
      var lineSame = xs.every(function (x, i) { return Math.abs(Math.abs(vals[i]) - f(x)) < 1e-7 * Math.max(1, f(x)); });
      if (same) { if (p.ast.t !== 'abs') return form(cp + 'abs-form', 'Same graph — now write it in the form ' + t('y=\\lvert ax+b\\rvert') + ' (one pair of bars around a linear expression).'); return ok(); }
      if (lineSame) { if (ex.shape(p.ast).abs) return wrong(cp + 'abs-down', 'Your graph opens downward. The graph of ' + t('y=|f(x)|') + ' is never below the ' + t('x') + '-axis.'); return wrong(cp + 'abs-nobars', 'That is the line ' + t('y=f(x)') + '. Put absolute value bars around it to get the V.'); }
      var lin2 = xs.every(function (x, i) { return Math.abs(vals[i] - f(-x)) < 1e-7 * Math.max(1, f(-x)); });
      if (lin2) return wrong(cp + 'v-sign', 'Check the vertex: your V has its vertex on the other side of the ' + t('y') + '-axis. The vertex is where the expression inside the bars is ' + t(0) + '.');
      return wrong('value', null);
    };
  };

  /* graphs */
  U.G = function (o) { return HW.graph(Object.assign({ x: [-6, 6], y: [-6, 6], labels: 2, max: 300, aria: 'graph' }, o)); };
  U.mini = function (o) { return HW.graph(Object.assign({ x: [-6, 6], y: [-6, 6], labels: 2, max: 165, aria: 'graph' }, o)); };
  U.crv = function (f, o) { return Object.assign({ f: f, start: 'arrow', end: 'arrow' }, o || {}); };
  /* the farthest snap point on an arm of y = |ax + b| (dir −1 left, +1 right) inside [−6, 6]², or null */
  U.armPt = function (a, b, dir, snap, win) {
    var av = rv(a), bv = rv(b), h = -bv / av, best = null, w = win || 6;
    for (var s = snap; s <= 24; s += snap) {
      var x = Math.round((h + dir * s) / snap) * snap; if (Math.abs(x - (h + dir * s)) > 1e-9) continue;
      var y = Math.abs(av * x + bv);
      if (Math.abs(x) > w + 1e-9 || y > w + 1e-9) break;
      if (Math.abs(y / snap - Math.round(y / snap)) < 1e-9) best = [x, y];
    }
    return best;
  };
  U.vOk = function (a, b, snap) { return !!(U.armPt(a, b, -1, snap) && U.armPt(a, b, 1, snap)); };
  U.snapOf = function (a, b) { var h = -rv(b) / rv(a); return Number.isInteger(h) ? 1 : 0.5; };
  U.vPad = function (a, b, o) {
    o = o || {};
    var flat = !rv(a), bv = rv(b), av = rv(a), key, f = function (x) { return av * x + bv; }, snap = o.snap || (flat ? 1 : U.snapOf(a, b)), wr = [];
    var line = function (g) { return { pts: [], pieces: [{ v: [[-6, g(-6)], [6, g(6)]].map(function (p) { return p; }), s: 'arrow', e: 'arrow' }] }; };
    function lineThrough(g) { // two snap points on y = g(x) in the window
      var ps = [];
      for (var x = -6; x <= 6 + 1e-9 && ps.length < 2; x += snap) { var y = g(x); if (Math.abs(y) <= 6 + 1e-9 && Math.abs(y / snap - Math.round(y / snap)) < 1e-9 && (!ps.length || Math.abs(x - ps[0][0]) > 1.5)) ps.push([x, y]); }
      return ps.length === 2 ? { pts: [], pieces: [{ v: ps, s: 'arrow', e: 'arrow' }] } : null;
    }
    if (flat) {
      key = { pts: [], pieces: [{ v: [[-4, Math.abs(bv)], [4, Math.abs(bv)]], s: 'arrow', e: 'arrow' }] };
      wr.push({ is: { pts: [], pieces: [{ v: [[-4, bv], [4, bv]], s: 'arrow', e: 'arrow' }] }, code: o.cp + 'g-same', hint: 'The line ' + t('y=' + rt(bv)) + ' is below the ' + t('x') + '-axis, so <b>all</b> of it is reflected: every ' + t('y') + '-value ' + t(rt(bv)) + ' becomes ' + t(rt(Math.abs(bv))) + '.' });
    } else {
      var h = -bv / av, L = U.armPt(a, b, -1, snap), R = U.armPt(a, b, 1, snap);
      key = { pts: [], pieces: [{ v: [L, [h, 0], R], s: 'arrow', e: 'arrow' }] };
      var fl = lineThrough(f); if (fl) wr.push({ is: fl, code: o.cp + 'g-same', hint: 'That is the line ' + t('y=f(x)') + ' itself. Keep the part on or above the ' + t('x') + '-axis and <b>reflect</b> the part below it.' });
      var fn = lineThrough(function (x) { return -f(x); }); if (fn) wr.push({ is: fn, code: o.cp + 'g-whole', hint: 'Only the part of the line <b>below</b> the ' + t('x') + '-axis is reflected; the part above it stays where it is.' });
      wr.push({ is: { pts: [], pieces: [{ v: [[L[0], -L[1]], [h, 0], [R[0], -R[1]]], s: 'arrow', e: 'arrow' }] }, code: o.cp + 'g-down', hint: 'The graph of ' + t('y=|f(x)|') + ' is never below the ' + t('x') + '-axis: the part below is reflected <b>up</b>.' });
    }
    var bg = o.showF ? { fns: [U.crv(f, { color: '#9aa3b2', dash: true })] } : {};
    var input = { x: [-6, 6], y: [-6, 6], labels: 2, defaultEnd: 'arrow', tools: ['line', 'ends'], snap: snap, bg: bg, max: 320,
      help: 'Use <b>╱ Line</b>: tap a point on the left arm, then the vertex, then a point on the right arm; tap the last point again to finish. The ends start as arrows (the graph goes on forever).' + (snap < 1 ? ' Points snap to every half unit.' : '') };
    return { input: input, key: key, wrongs: wr };
  };
  U.vGraph = function (cp, prompt, a, b, o, sol, hints, text) {
    o = o || {}; o.cp = cp;
    var V = U.vPad(a, b, o);
    var p = KP.graph(prompt, V.input, K.graphExact(V.key, { wrong: V.wrongs }), V.key, sol, hints, text);
    p.bad = V.wrongs.map(function (w) { return w.is; });
    return p;
  };

  /* keypads */
  var W = HW.widgets;
  if (W && W.KEYSETS) {
    var d = function (n) { return { label: String(n), tex: String(n), plain: String(n) }; };
    var KY = { del: { label: '⌫', fn: 'del', title: 'Delete' }, clear: { label: 'clear', fn: 'clear' }, left: { label: '◀', fn: 'left', title: 'Move left' }, right: { label: '▶', fn: 'right', title: 'Move right (out of a box)' }, enter: { label: 'Check ↵', fn: 'enter', wide: true },
      minus: { label: '−', tex: '-', plain: '-' }, plus: { label: '+', tex: '+', plain: '+' }, dot: { label: '.', tex: '.', plain: '.' }, comma: { label: ',', tex: ',', plain: ', ' }, frac: { label: '<sup>a</sup>⁄<sub>b</sub>', tex: '\\frac{#@}{#?}', plain: '/', title: 'Fraction' },
      sqrt: { label: '√', tex: '\\sqrt{#0}', plain: 'sqrt(' }, pm: { label: '±', tex: '\\pm ', plain: '±' }, par: { label: '( )', tex: '\\left(#0\\right)', plain: '(', title: 'A point: type x, y inside' },
      abs: { label: '|x|', tex: '\\left|#0\\right|', plain: '|', title: 'Absolute value bars' }, x: { label: '<i>x</i>', tex: 'x', plain: 'x' } };
    if (!W.KEYSETS.u7kpts) W.KEYSETS.u7kpts = function () { return [[d(7), d(8), d(9), KY.par, KY.del], [d(4), d(5), d(6), KY.frac, KY.clear], [d(1), d(2), d(3), KY.minus, KY.left, KY.right], [d(0), KY.dot, KY.comma, KY.sqrt, KY.plus], [{ label: 'none', tex: '\\text{none}', plain: 'none' }, KY.enter]]; };
    if (!W.KEYSETS.u7kabs) W.KEYSETS.u7kabs = function () { return [[d(7), d(8), d(9), KY.abs, KY.del], [d(4), d(5), d(6), KY.x, KY.clear], [d(1), d(2), d(3), KY.frac, KY.left, KY.right], [d(0), KY.dot, KY.minus, KY.plus, KY.enter]]; };
    if (!W.KEYSETS.u7kvals) W.KEYSETS.u7kvals = function (opt) {
      var v = (opt && opt.vars && opt.vars[0]) || 'x';
      return [[d(7), d(8), d(9), KY.frac, KY.del], [d(4), d(5), d(6), KY.sqrt, KY.clear], [d(1), d(2), d(3), KY.minus, KY.left, KY.right], [d(0), KY.dot, { label: '<i>' + v + '</i> =', tex: v + '=', plain: v + ' = ' }, KY.comma, KY.pm, KY.enter]];
    };
    if (W.KEYHELP) {
      W.KEYHELP.u7kpts = W.KEYHELP.u7kpts || ['Press <b>( )</b> for each point, type <i>x</i> <b>,</b> <i>y</i> inside, press <b>▶</b> to step out, then a comma before the next point (or the <b>none</b> key).', 'Type e.g. <code>(1, 0), (5, 0)</code> or <code>none</code>.'];
      W.KEYHELP.u7kabs = W.KEYHELP.u7kabs || ['Press <b>|x|</b> for the bars, type the expression inside, then <b>▶</b> to step out.', 'Type e.g. <code>|2x+4|</code>.'];
      W.KEYHELP.u7kvals = W.KEYHELP.u7kvals || ['Separate the values with a comma, e.g. ' + HW.k('x=3,\\ x=-5') + ', or use <b>±</b>.', 'Type e.g. <code>x = 3, x = -5</code>.'];
    }
  }

  /* ==================================================================================================
   * Lesson 1
   * ================================================================================================== */
  var CP = 'u7l1-';
  U.codes(CP, {
    'abs-neg': ['Gave a negative absolute value', 'n'], 'abs-bracket': ['Treated the bars as brackets (kept a negative value)', 'n'], 'abs-minus': ['Made a negative sign outside the bars positive', 's'],
    'abs-split': ['Split or merged the bars over a sum or difference', 'b'], 'sqrt-neg': ['Took a principal square root as negative', 's'], 'cbrt-sign': ['Cube root of a negative taken as positive', 'b'],
    'sq-neg': ['Read (−a)² as −a²', 'b'], 'pow-order': ['Exponent and absolute value applied in the wrong order', 'b'], 'den-sign': ['Made a negative denominator outside the bars positive', 's'],
    'dist-neg': ['Distance given as a negative number', 's'], 'dist-sub': ['Distance: subtracted the sizes of the numbers', 'b'], 'dist-one': ['Gave only one of the two numbers at that distance', 'b'], 'center-sign': ['Distance from −h read as the distance from h', 'b'],
    'net-total': ['Net change and total distance mixed up', 'b'], 'net-sign': ['Final value: change applied with the wrong sign', 's'], 'tol-edge': ['Tolerance: the boundary value excluded (≤ read as <)', 's'], 'tol-side': ['Tolerance: only one side checked', 'b'],
    'simp-sign': ['Used |x| = x when x < 0 (or −x when x > 0)', 'b'], 'simp-case': ['Simplified for a different interval', 'b'], 'def-swap': ['Piecewise definition: the two pieces swapped', 'b'],
    'ab-other': ['Kept the value that breaks the sign condition', 's'], 'ab-a': ['Gave a instead of b (or the sign of a wrong)', 'b'], 'ineq-dir': ['Inequality the wrong way', 'b'], 'ineq-strict': ['Boundary value left out (< for ≤)', 's'],
    'ord-sign': ['Ordering: a negative sign outside the bars ignored', 'b'], 'abs-left': ['Answer still has absolute value bars (format)', ''], exact: ['Rounded instead of exact (format)', ''], 'pts-fmt': ['Points not written as (x, y) (format)', '']
  });
  U.codes(CP, U.PIECE_CODES);

  /* the booklet's and the examples' numbers, left out */
  function notIn(x, list) { return list.every(function (y) { return Math.abs(x - y) > 1e-9; }); }
  var H_ABS = ['Absolute value bars are grouping symbols: simplify inside them first, then take the absolute value.', 'A negative sign outside the bars stays: ' + t('-\\lvert -6\\rvert=-6') + '.'];

  /* ---------- evaluate one simple expression (Q1, EP A1) ---------- */
  function evalSimple(r, kind, avoid) {
    avoid = avoid || [];
    var e, val, wr = [], sol, o = { box: 'number' };
    if (kind === 'negIn') { var n = pickWhere(function () { return r.int(11, 49); }, function (x) { return notIn(x, avoid); }); e = A('-' + n); val = n; sol = t(A('-' + n) + '=' + n) + ': ' + t('-' + n) + ' is ' + t(n) + ' units from ' + t(0) + '.'; wr.push({ v: -n, code: CP + 'abs-neg', hint: 'An absolute value is a distance from ' + t(0) + ', so it is never negative.' }); }
    else if (kind === 'negOut') { var n2 = pickWhere(function () { return r.int(8, 40); }, function (x) { return notIn(x, avoid); }); e = '-' + A(n2); val = -n2; sol = 'The negative sign is outside the bars: ' + t('-' + A(n2) + '=-(' + n2 + ')=-' + n2) + '.'; wr.push({ v: n2, code: CP + 'abs-minus', hint: 'The negative sign is <b>outside</b> the bars, so it stays: ' + t('-' + A(n2) + '=-' + n2) + '.' }); }
    else if (kind === 'negDec') { var d = pickWhere(function () { return r.int(2, 99) / 10; }, function (x) { return notIn(x, avoid) && x % 1 !== 0; }); e = '-' + A('-' + dt(d)); val = -d; sol = t(A('-' + dt(d)) + '=' + dt(d)) + ', and the negative sign outside the bars stays: ' + t('-' + A('-' + dt(d)) + '=-' + dt(d)) + '.'; wr.push({ v: d, code: CP + 'abs-minus', hint: 'Only the ' + t('-' + dt(d)) + ' is inside the bars. The negative sign in front of the bars stays.' }); }
    else if (kind === 'frac') {
      var s = pickWhere(function () { return { p: r.int(1, 13), q: r.int(2, 11) }; }, function (z) { return gcd(z.p, z.q) === 1 && notIn(z.p / z.q, avoid); });
      e = AL('-\\dfrac{' + s.p + '}{' + s.q + '}'); val = [s.p, s.q]; o = { keys: 'fraction' }; sol = t(AL('-\\frac{' + s.p + '}{' + s.q + '}') + '=\\frac{' + s.p + '}{' + s.q + '}') + '.';
      wr.push({ v: [-s.p, s.q], code: CP + 'abs-neg', hint: 'An absolute value is never negative.' });
    } else if (kind === 'sqrtNeg') { var m = pickWhere(function () { return r.int(5, 15); }, function (x) { return notIn(x, avoid); }); e = '\\sqrt{(-' + m + ')^{2}}'; val = m; sol = t('\\sqrt{(-' + m + ')^{2}}=\\sqrt{' + m * m + '}=' + m) + ' (the principal square root is never negative; it equals ' + t(A('-' + m)) + ').'; wr.push({ v: -m, code: CP + 'sqrt-neg', hint: t('(-' + m + ')^{2}=' + m * m) + ', and ' + t('\\sqrt{' + m * m + '}') + ' is the <b>principal</b> (positive) square root.' }); }
    else if (kind === 'sqrtNegDec') { var dd = pickWhere(function () { return r.int(2, 19) / 10; }, function (x) { return notIn(x, avoid) && x % 1 !== 0; }); e = '\\sqrt{(-' + dt(dd) + ')^{2}}'; val = dd; sol = t('\\sqrt{(-' + dt(dd) + ')^{2}}=' + A('-' + dt(dd)) + '=' + dt(dd)) + '.'; wr.push({ v: -dd, code: CP + 'sqrt-neg', hint: 'The principal square root is never negative: ' + t('\\sqrt{a^{2}}=|a|') + '.' }); }
    else if (kind === 'sqrtOut') { var m2 = pickWhere(function () { return r.int(3, 13); }, function (x) { return notIn(x, avoid); }); e = '-\\sqrt{' + m2 + '^{2}}'; val = -m2; sol = t('-\\sqrt{' + m2 + '^{2}}=-\\sqrt{' + m2 * m2 + '}=-' + m2) + ': the negative sign is outside the root.'; wr.push({ v: m2, code: CP + 'abs-minus', hint: 'The negative sign is outside the square root, so it stays.' }); }
    else if (kind === 'irr') {
      var w = r.pick(['pi', 'pi', 'kpi', 'root']); o = { keys: 'expr' };
      if (w === 'pi') { e = A('-\\pi'); val = Math.PI; o.keyTex = '\\pi'; sol = t(A('-\\pi') + '=\\pi') + ' (about ' + t('3.14') + '): a number and its opposite have the same absolute value.'; wr.push({ v: -Math.PI, tex: '-\\pi', code: CP + 'abs-neg', hint: 'An absolute value is never negative.' }); }
      else if (w === 'kpi') { var k = r.int(2, 5); e = A('-' + k + '\\pi'); val = k * Math.PI; o.keyTex = k + '\\pi'; sol = t(A('-' + k + '\\pi') + '=' + k + '\\pi') + '.'; wr.push({ v: -k * Math.PI, tex: '-' + k + '\\pi', code: CP + 'abs-neg', hint: 'An absolute value is never negative.' }); }
      else { var q = pickWhere(function () { return r.int(2, 30); }, function (x) { var s2 = Math.round(Math.sqrt(x)); return s2 * s2 !== x && x !== 5 && ex.simplest(x, 2); }); e = A('-\\sqrt{' + q + '}'); val = Math.sqrt(q); o.keyTex = '\\sqrt{' + q + '}'; sol = t(A('-\\sqrt{' + q + '}') + '=\\sqrt{' + q + '}') + '.'; wr.push({ v: -Math.sqrt(q), tex: '-\\sqrt{' + q + '}', code: CP + 'abs-neg', hint: 'An absolute value is never negative.' }); }
    } else { // nested signs: −|−(−n)|, |−(−n)|, −(−|−n|)
      var nn = pickWhere(function () { return r.int(2, 15); }, function (x) { return notIn(x, avoid); }), f2 = r.pick(['a', 'a', 'b', 'c']);
      if (f2 === 'a') { e = '-' + A('-(-' + nn + ')'); val = -nn; sol = t('-(-' + nn + ')=' + nn) + ' inside the bars: ' + t('-' + A('-(-' + nn + ')') + '=-' + A(nn) + '=-' + nn) + '.'; wr.push({ v: nn, code: CP + 'abs-minus', hint: 'Simplify inside first: ' + t('-(-' + nn + ')=' + nn) + '. The negative sign in front of the bars stays.' }); }
      else if (f2 === 'b') { e = A('-(-' + nn + ')'); val = nn; sol = t(A('-(-' + nn + ')') + '=' + A(nn) + '=' + nn) + '.'; wr.push({ v: -nn, code: CP + 'abs-neg', hint: 'An absolute value is never negative.' }); }
      else { e = '-\\bigl(-' + A('-' + nn) + '\\bigr)'; val = nn; sol = t(A('-' + nn) + '=' + nn) + ', so ' + t('-(-' + nn + ')=' + nn) + '.'; wr.push({ v: -nn, code: CP + 'abs-minus', hint: t(A('-' + nn) + '=' + nn) + '; then the two negative signs outside make it positive again.' }); }
    }
    return U.num('Evaluate ' + t(e) + '.', val, wr, sol, H_ABS, 'evaluating absolute values', o);
  }

  /* ---------- evaluate with order of operations (Q2, EP A1) ---------- */
  function evalOps(r, kind) {
    var e, val, wr = [], sol, o = { box: 'number' }, z;
    if (kind === 'diff') { // |a − b|, a < b
      z = pickWhere(function () { return { a: r.int(2, 14), b: r.int(5, 30) }; }, function (s) { return s.b - s.a >= 4 && !(s.a === 7 && s.b === 19) && !(s.a === 4 && s.b === 13); });
      e = A(z.a + '-' + z.b); val = z.b - z.a; sol = t(A(z.a + '-' + z.b) + '=' + A(z.a - z.b) + '=' + val) + '.';
      wr.push({ v: z.a - z.b, code: CP + 'abs-bracket', hint: 'You simplified inside the bars. Now take the absolute value: it is never negative.' });
    } else if (kind === 'diffSplit') { // |a| − |b|
      z = pickWhere(function () { return { a: r.int(2, 14), b: r.int(5, 30) }; }, function (s) { return s.b - s.a >= 4 && !(s.a === 7 && s.b === 19) && !(s.a === 4 && s.b === 13); });
      e = A(z.a) + '-' + A(z.b); val = z.a - z.b; sol = 'Each absolute value first, then subtract: ' + t(z.a + '-' + z.b + '=' + val) + '.';
      wr.push({ v: z.b - z.a, code: CP + 'abs-split', hint: 'Here there are two separate absolute values: ' + t(A(z.a) + '=' + z.a) + ' and ' + t(A(z.b) + '=' + z.b) + '. Their difference can be negative. (The bars cannot be merged into ' + t(A(z.a + '-' + z.b)) + '.)' });
    } else if (kind === 'negSub') { // |−a − (−b)|, a > b
      z = pickWhere(function () { return { a: r.int(5, 18), b: r.int(1, 12) }; }, function (s) { return s.a - s.b >= 2 && !(s.a === 8 && s.b === 3) && !(s.a === 11 && s.b === 3); });
      e = A('-' + z.a + '-(-' + z.b + ')'); val = z.a - z.b; sol = t(A('-' + z.a + '-(-' + z.b + ')') + '=' + A('-' + z.a + '+' + z.b) + '=' + A(z.b - z.a) + '=' + val) + '.';
      wr.push({ v: z.b - z.a, code: CP + 'abs-bracket', hint: 'You simplified inside the bars. Now take the absolute value.' });
      wr.push({ v: z.a + z.b, code: CP + 'abs-split', hint: 'Subtracting a negative adds: ' + t('-' + z.a + '-(-' + z.b + ')=-' + z.a + '+' + z.b) + '.' });
    } else if (kind === 'coef') { // k|−a| − |−b|
      z = pickWhere(function () { return { k: r.int(2, 6), a: r.int(2, 9), b: r.int(3, 30) }; }, function (s) { return s.k * s.a !== s.b && !(s.k === 4 && s.a === 2 && s.b === 10) && !(s.k === 3 && s.a === 5); });
      e = z.k + A('-' + z.a) + '-' + A('-' + z.b); val = z.k * z.a - z.b; sol = t(z.k + '(' + z.a + ')-' + z.b + '=' + z.k * z.a + '-' + z.b + '=' + val) + '.';
      wr.push({ v: -z.k * z.a + z.b, code: CP + 'abs-bracket', hint: t(A('-' + z.a) + '=' + z.a) + ' and ' + t(A('-' + z.b) + '=' + z.b) + ': the bars make the values positive.' });
      wr.push({ v: z.k * z.a + z.b, code: CP + 'abs-minus', hint: 'The second absolute value is <b>subtracted</b>: ' + t('-' + A('-' + z.b) + '=-' + z.b) + '.' });
    } else if (kind === 'coefOut') { // a − k|−b| (EP A1e)
      z = pickWhere(function () { return { a: r.int(2, 12), k: r.int(2, 5), b: r.int(2, 9) }; }, function (s) { return s.a !== s.k * s.b && !(s.a === 6 && s.k === 2 && s.b === 4); });
      e = z.a + '-' + z.k + A('-' + z.b); val = z.a - z.k * z.b; sol = t(z.a + '-' + z.k + '(' + z.b + ')=' + z.a + '-' + z.k * z.b + '=' + val) + '.';
      wr.push({ v: z.a + z.k * z.b, code: CP + 'abs-bracket', hint: t(A('-' + z.b) + '=' + z.b) + ', and it is subtracted ' + t(z.k) + ' times.' });
      wr.push({ v: (z.a - z.k) * z.b, code: CP + 'abs-split', hint: 'Multiplication comes before subtraction: ' + t(z.k + A('-' + z.b) + '=' + z.k * z.b) + ' first.' });
    } else if (kind === 'negCoef') { // −k|a − b| + c
      z = pickWhere(function () { return { k: r.int(2, 5), a: r.int(1, 9), b: r.int(4, 16), c: r.int(1, 15) }; }, function (s) { return s.b - s.a >= 2 && !(s.k === 3 && s.a === 6 && s.b === 11) && !(s.k === 2 && s.a === 1 && s.b === 7); });
      e = '-' + z.k + A(z.a + '-' + z.b) + '+' + z.c; val = -z.k * (z.b - z.a) + z.c; sol = t('-' + z.k + A(z.a - z.b) + '+' + z.c + '=-' + z.k + '(' + (z.b - z.a) + ')+' + z.c + '=' + val) + '.';
      wr.push({ v: z.k * (z.b - z.a) + z.c, code: CP + 'abs-minus', hint: 'The ' + t('-' + z.k) + ' multiplies the absolute value, so that term is negative: ' + t('-' + z.k + A(z.a - z.b) + '=-' + z.k * (z.b - z.a)) + '.' });
    } else if (kind === 'nest') { // ||−a| − |b||, a < b   or   ||−a| − b| (EP A1f)
      z = pickWhere(function () { return { a: r.int(2, 12), b: r.int(4, 20), plain: r.chance(0.4) }; }, function (s) { return s.b - s.a >= 2 && !(s.a === 4 && s.b === 9) && !(s.a === 10 && s.b === 15); });
      e = '\\bigl\\lvert\\,' + A('-' + z.a) + '-' + (z.plain ? z.b : A(z.b)) + '\\,\\bigr\\rvert '; val = z.b - z.a;
      sol = 'Work from the inside out: ' + t(A('-' + z.a) + '=' + z.a) + ', so the expression is ' + t(A(z.a + '-' + z.b) + '=' + A(z.a - z.b) + '=' + val) + '.';
      wr.push({ v: z.a - z.b, code: CP + 'abs-bracket', hint: 'You have the inside right: ' + t(z.a + '-' + z.b + '=' + (z.a - z.b)) + '. The outer bars then make it positive.' });
      wr.push({ v: z.a + z.b, code: CP + 'abs-split', hint: 'Take the inner absolute value first: ' + t(A('-' + z.a) + '=' + z.a) + '. The bars cannot be merged into ' + t(A('-' + z.a + '-' + z.b)) + '.' });
    } else if (kind === 'pow') { // |−a|^m − |−b^n|
      z = pickWhere(function () { return { a: r.int(2, 5), m: r.pick([2, 3]), b: r.int(2, 5), n: r.pick([2, 3]) }; }, function (s) { return !(s.a === s.b && s.m === s.n) && Math.pow(s.a, s.m) <= 125 && Math.pow(s.b, s.n) <= 125; });
      var am = Math.pow(z.a, z.m), bn = Math.pow(z.b, z.n);
      e = A('-' + z.a) + '^{' + z.m + '}-' + A('-' + z.b + '^{' + z.n + '}'); val = am - bn;
      sol = t(A('-' + z.a) + '^{' + z.m + '}=' + z.a + '^{' + z.m + '}=' + am) + ' and ' + t('-' + z.b + '^{' + z.n + '}=-' + bn) + ' (the power comes before the negative sign), so ' + t(A('-' + bn) + '=' + bn) + '.<br>' + t(am + '-' + bn + '=' + val) + '.';
      if (z.m % 2) wr.push({ v: -am - bn, code: CP + 'pow-order', hint: 'Take the absolute value first: ' + t(A('-' + z.a) + '=' + z.a) + ', then the power: ' + t(z.a + '^{' + z.m + '}=' + am) + '.' });
      wr.push({ v: am + bn, code: CP + 'abs-bracket', hint: t('-' + z.b + '^{' + z.n + '}=-' + bn) + ', and its absolute value is ' + t(bn) + ', which is subtracted.' });
    } else if (kind === 'quot') { // (|−a| + b) / |−c|
      z = pickWhere(function () { return { a: r.int(2, 12), b: r.int(1, 10), c: r.int(2, 8) }; }, function (s) { return !(s.a === 6 && s.b === 2 && s.c === 4) && ((s.a + s.b) % s.c !== 0 || r.chance(0.35)); });
      e = '\\dfrac{' + A('-' + z.a) + '+' + z.b + '}{' + A('-' + z.c) + '}'; val = ex.norm(z.a + z.b, z.c); o = { keys: 'fraction' };
      sol = t('\\frac{' + z.a + '+' + z.b + '}{' + z.c + '}=' + rt(val)) + '.';
      wr.push({ v: ex.norm(z.b - z.a, -z.c), code: CP + 'abs-bracket', hint: 'The bars make ' + t('-' + z.a) + ' and ' + t('-' + z.c) + ' positive.' });
      wr.push({ v: ex.norm(z.a + z.b, -z.c), code: CP + 'den-sign', hint: t(A('-' + z.c) + '=' + z.c) + ': the denominator is positive too.' });
    } else { // |a − b × c| (EP A1c)
      z = pickWhere(function () { return { a: r.int(2, 20), b: r.int(2, 6), c: r.int(2, 9) }; }, function (s) { return s.a < s.b * s.c && !(s.a === 12 && s.b === 5 && s.c === 3); });
      e = A(z.a + '-' + z.b + '\\times ' + z.c); val = z.b * z.c - z.a; sol = 'Multiply first, inside the bars: ' + t(A(z.a + '-' + z.b * z.c) + '=' + A(z.a - z.b * z.c) + '=' + val) + '.';
      wr.push({ v: z.a - z.b * z.c, code: CP + 'abs-bracket', hint: 'You simplified inside the bars. Now take the absolute value.' });
      wr.push({ v: Math.abs((z.a - z.b) * z.c), code: CP + 'abs-split', hint: 'Inside the bars, multiply before you subtract.' });
    }
    wr = wr.filter(function (w) { return w.v != null; });
    return U.num('Evaluate ' + t(e) + '.', val, wr, sol, ['Simplify inside each pair of bars first (with the order of operations), then take the absolute value, then finish outside the bars.', H_ABS[1]], 'order of operations with absolute values', o);
  }

  /* ---------- roots (Q3) ---------- */
  function evalRoot(r, kind) {
    var e, val, wr = [], sol, z;
    if (kind === 'cbrt') { z = pickWhere(function () { return r.int(2, 12); }, function (n) { return n !== 10 && n !== 4; }); e = AL('\\sqrt[3]{-' + z * z * z + '}'); val = z; sol = t('\\sqrt[3]{-' + z * z * z + '}=-' + z) + ', and ' + t(A('-' + z) + '=' + z) + '.'; wr.push({ v: -z, code: CP + 'abs-bracket', hint: 'The cube root is ' + t('-' + z) + '; now take its absolute value.' }); }
    else if (kind === 'cbrtOut') { z = pickWhere(function () { return r.int(2, 12); }, function (n) { return n !== 7 && n !== 5 && n !== 6; }); e = '-' + AL('-\\sqrt[3]{' + z * z * z + '}'); val = -z; sol = t('-\\sqrt[3]{' + z * z * z + '}=-' + z) + ', so ' + t('-' + A('-' + z) + '=-' + z) + '.'; wr.push({ v: z, code: CP + 'abs-minus', hint: 'The negative sign <b>outside</b> the bars stays.' }); }
    else if (kind === 'sq') { z = pickWhere(function () { return { p: r.int(2, 9), q: r.int(4, 15) }; }, function (s) { return s.q > s.p + 1 && !(s.p === 5 && s.q === 12) && !(s.p === 4 && s.q === 9); }); e = AL('\\sqrt{' + z.p * z.p + '}-\\sqrt{' + z.q * z.q + '}'); val = z.q - z.p; sol = t(A(z.p + '-' + z.q) + '=' + A(z.p - z.q) + '=' + val) + '.'; wr.push({ v: z.p - z.q, code: CP + 'abs-bracket', hint: 'You simplified inside the bars. Now take the absolute value.' }); }
    else { z = pickWhere(function () { return { m: r.int(2, 6), k: r.int(2, 10) }; }, function (s) { return s.m !== s.k && !(s.m === 2 && s.k === 3); }); e = AL('\\sqrt[3]{-' + z.m * z.m * z.m + '}-\\sqrt{' + z.k * z.k + '}'); val = z.m + z.k; sol = t('\\sqrt[3]{-' + z.m * z.m * z.m + '}=-' + z.m) + ' and ' + t('\\sqrt{' + z.k * z.k + '}=' + z.k) + ': ' + t(A('-' + z.m + '-' + z.k) + '=' + A(-z.m - z.k) + '=' + val) + '.'; wr.push({ v: -z.m - z.k, code: CP + 'abs-bracket', hint: 'Now take the absolute value of ' + t(-z.m - z.k) + '.' }); wr.push({ v: Math.abs(z.m - z.k), code: CP + 'cbrt-sign', hint: 'The cube root of a negative number is negative: ' + t('\\sqrt[3]{-' + z.m * z.m * z.m + '}=-' + z.m) + '.' }); }
    return U.num('Evaluate ' + t(e) + '.', val, wr, sol, ['Evaluate each root first, then simplify inside the bars, then take the absolute value.', 'The cube root of a negative number is negative; a square root is never negative.'], 'absolute values with roots', { box: 'number' });
  }
  /* |a − √b| or |√a − √b|: the exact value and the value to the nearest hundredth */
  function rootExact(r, kind) {
    var e, T, tex, wtex, sol, wv;
    if (kind === 'int') {
      var z = pickWhere(function () { return { a: r.int(2, 9), b: r.int(3, 90) }; }, function (s) { var q = Math.sqrt(s.b); return Math.round(q) * Math.round(q) !== s.b && ex.simplest(s.b, 2) && Math.abs(q - s.a) < 1.6 && Math.abs(q - s.a) > 0.05 && !(s.a === 3 && s.b === 11) && !(s.a === 2 && s.b === 10) && (q > s.a || r.chance(0.3)); });
      var q0 = Math.sqrt(z.b), big = q0 > z.a;
      e = AL(z.a + '-\\sqrt{' + z.b + '}'); T = Math.abs(z.a - q0);
      tex = big ? '\\sqrt{' + z.b + '}-' + z.a : z.a + '-\\sqrt{' + z.b + '}'; wtex = big ? z.a + '-\\sqrt{' + z.b + '}' : '\\sqrt{' + z.b + '}-' + z.a; wv = -T;
      sol = t('\\sqrt{' + z.b + '}\\approx ' + q0.toFixed(2)) + (big ? ' \\(>\\) ' : ' \\(<\\) ') + t(z.a) + ', so ' + t(z.a + '-\\sqrt{' + z.b + '}') + ' is ' + (big ? 'negative and its absolute value is its opposite' : 'positive and the bars change nothing') + ': ' + t(AL(z.a + '-\\sqrt{' + z.b + '}') + '=' + tex + '\\approx ' + K.roundTo(T, 2).toFixed(2)) + '.';
    } else {
      var y = pickWhere(function () { return { a: r.int(2, 40), b: r.int(3, 50) }; }, function (s) { return s.a < s.b && s.b - s.a <= 12 && ex.simplest(s.a, 2) && ex.simplest(s.b, 2) && [s.a, s.b].every(function (x) { var q = Math.round(Math.sqrt(x)); return q * q !== x; }) && !(s.a === 5 && s.b === 7); });
      var sw = r.chance(0.5);
      e = sw ? AL('\\sqrt{' + y.a + '}-\\sqrt{' + y.b + '}') : AL('\\sqrt{' + y.b + '}-\\sqrt{' + y.a + '}'); T = Math.sqrt(y.b) - Math.sqrt(y.a);
      tex = '\\sqrt{' + y.b + '}-\\sqrt{' + y.a + '}'; wtex = '\\sqrt{' + y.a + '}-\\sqrt{' + y.b + '}'; wv = -T;
      sol = t('\\sqrt{' + y.b + '}>\\sqrt{' + y.a + '}') + ', so ' + (sw ? t('\\sqrt{' + y.a + '}-\\sqrt{' + y.b + '}') + ' is negative and its absolute value is its opposite' : 'the expression inside is positive') + ': ' + t(e + '=' + tex + '\\approx ' + K.roundTo(T, 2).toFixed(2)) + '.';
    }
    var exact = K.value(T), ap = K.approx(T, 2);
    var exactChk = function (s) {
      var a = K.read(s); if (a.res) return a.res;
      var sh = ex.shape(a.ast);
      if (sh.abs) return form('abs-left', 'Write the exact value without absolute value bars.');
      if (!sh.roots && Math.abs(a.val - T) < 0.006) return form('exact', 'That is a rounded decimal. Give the <b>exact</b> value in the first box (with the ' + t('\\sqrt{\\ }') + ' key).');
      if (Math.abs(a.val - wv) < 1e-9) return wrong(CP + 'abs-bracket', 'That is negative. The absolute value is the opposite: ' + t('-(' + wtex + ')') + '.');
      return exact(s);
    };
    var apChk = function (s) { var v = numVal(s); if (v != null && Math.abs(v - K.roundTo(wv, 2)) < 1e-9) return wrong(CP + 'abs-bracket', 'An absolute value is never negative.'); return ap(s); };
    var fields = [{ label: 'Exact value', name: 'exact value', mode: 'math', keys: 'radical' }, { label: 'To the nearest hundredth', name: 'nearest hundredth', mode: 'math', keys: 'radical' }];
    return U.fields('Evaluate ' + t(e) + '. Give the exact value, and the value to the nearest hundredth.', fields, [exactChk, apChk], [tex, K.roundTo(T, 2).toFixed(2)], t(tex) + ' \\(\\approx\\) ' + t(K.roundTo(T, 2).toFixed(2)), sol,
      ['Decide whether the expression inside the bars is positive or negative (estimate the root with your calculator).', 'If it is negative, the absolute value is its opposite: ' + t('|a|=-a') + ' when ' + t('a<0') + '.'], 'exact absolute value with radicals', [[wtex, K.roundTo(wv, 2).toFixed(2)]]);
  }

  /* ---------- distance between two numbers (Q8, EP A2, Q18) ---------- */
  function distance(r, kind, avoid) {
    avoid = avoid || [];
    var a, b, aT, bT, val, wr = [], sol, o = { keys: 'fraction' };
    var bad = function (x, y) { return avoid.some(function (p) { return Math.abs(p[0] - x) < 1e-9 && Math.abs(p[1] - y) < 1e-9 || Math.abs(p[1] - x) < 1e-9 && Math.abs(p[0] - y) < 1e-9; }); };
    if (kind === 'pp' || kind === 'np' || kind === 'nn') {
      var z = pickWhere(function () {
        if (kind === 'pp') return { a: r.int(5, 30), b: r.int(1, 25) };
        if (kind === 'np') return { a: -r.int(2, 20), b: r.int(2, 20) };
        return { a: -r.int(8, 30), b: -r.int(1, 20) };
      }, function (s) { return s.a !== s.b && Math.abs(s.a - s.b) >= 3 && !bad(s.a, s.b) && (kind !== 'pp' || s.a > s.b); });
      a = z.a; b = z.b; aT = String(a); bT = String(b); val = Math.abs(a - b); o = { box: 'number' };
      sol = t(A(a + '-' + pn(b)) + '=' + A(a - b) + '=' + val) + (kind === 'pp' ? '' : ' (subtracting in either order gives the same distance)') + '.';
      if (a - b < 0) wr.push({ v: a - b, code: CP + 'dist-neg', hint: 'A distance is never negative: take the absolute value of the difference.' });
      if (kind !== 'pp') wr.push({ v: Math.abs(Math.abs(a) - Math.abs(b)), code: CP + 'dist-sub', hint: 'Subtract the numbers themselves, with their signs, then take the absolute value: ' + t(A(a + '-' + pn(b))) + '.' });
    } else if (kind === 'dec' || kind === 'decnn') {
      var y = pickWhere(function () {
        var A1 = -r.pick([r.int(11, 95) * 10, r.int(3, 39) * 25, r.int(105, 860)]), B1 = kind === 'decnn' ? -r.pick([r.int(5, 60) * 10, r.int(2, 30) * 25]) : r.pick([r.int(5, 60) * 10, r.int(2, 30) * 25, r.int(12, 640)]);
        return { A1: A1, B1: B1 };
      }, function (s) { return s.A1 !== s.B1 && Math.abs(s.A1 - s.B1) >= 50 && !bad(s.A1 / 100, s.B1 / 100) && (kind !== 'decnn' || s.A1 < s.B1); });
      a = y.A1 / 100; b = y.B1 / 100; aT = dt(a); bT = dt(b); val = Math.abs(y.A1 - y.B1) / 100; o = { box: 'number' };
      sol = t(A(aT + '-' + pnd(b)) + '=' + A(dt((y.A1 - y.B1) / 100)) + '=' + dt(val)) + '.';
      wr.push({ v: (y.A1 - y.B1) / 100, code: CP + 'dist-neg', hint: 'A distance is never negative: take the absolute value of the difference.' });
      wr.push({ v: Math.abs(Math.abs(y.A1) - Math.abs(y.B1)) / 100, code: CP + 'dist-sub', hint: 'Subtract the numbers themselves, with their signs, then take the absolute value.' });
    } else if (kind === 'frac') {
      var s = pickWhere(function () { return { p1: r.int(1, 7), q1: r.pick([2, 3, 4, 5, 6]), p2: r.int(1, 9), q2: r.pick([2, 3, 4, 5, 6, 8]), sw: r.chance(0.5) }; }, function (z2) { return gcd(z2.p1, z2.q1) === 1 && gcd(z2.p2, z2.q2) === 1 && z2.q1 !== z2.q2 && !bad(-z2.p1 / z2.q1, z2.p2 / z2.q2) && !(z2.p1 === 3 && z2.q1 === 4 && z2.p2 === 2 && z2.q2 === 3); });
      var fa = [-s.p1, s.q1], fb = [s.p2, s.q2]; if (s.sw) { var tmp = fa; fa = fb; fb = tmp; }
      a = fa; b = fb; aT = rt(fa); bT = rt(fb);
      var L2 = s.q1 * s.q2 / gcd(s.q1, s.q2), num = fa[0] * (L2 / fa[1]) - fb[0] * (L2 / fb[1]);
      val = ex.norm(Math.abs(num), L2);
      sol = 'Use a common denominator: ' + t(AL(aT + '-' + (rv(fb) < 0 ? '\\left(' + bT + '\\right)' : bT)) + '=' + AL('\\frac{' + fa[0] * (L2 / fa[1]) + '}{' + L2 + '}-' + (fb[0] < 0 ? '\\left(\\frac{' + fb[0] * (L2 / fb[1]) + '}{' + L2 + '}\\right)' : '\\frac{' + fb[0] * (L2 / fb[1]) + '}{' + L2 + '}')) + '=' + rt(val)) + '.';
      wr.push({ v: ex.norm(num, L2), code: CP + 'dist-neg', hint: 'A distance is never negative: take the absolute value of the difference.' });
      wr.push({ v: ex.norm(Math.abs(s.p2 * (L2 / s.q2) - s.p1 * (L2 / s.q1)), L2), code: CP + 'dist-sub', hint: 'Subtract with the signs: subtracting a positive from a negative moves further from ' + t(0) + '.' });
    } else { // radicals k√n and −m√n (one possibly an entire radical)
      var R = pickWhere(function () { return { n: r.pick([2, 3, 5, 6, 7]), k: r.int(1, 6), m: r.int(1, 4), entire: r.chance(0.5), sw: r.chance(0.5) }; }, function (z3) { return !bad(z3.k * Math.sqrt(z3.n), -z3.m * Math.sqrt(z3.n)) && !(z3.n === 3 && z3.k === 1 && z3.m === 2) && !(z3.n === 2 && z3.k === 1 && z3.m === 2) && !(z3.n === 2 && z3.k === 5 && z3.m === 1) && (z3.entire ? z3.m > 1 : true); });
      var rad = function (c) { return (c === 1 ? '' : c) + '\\sqrt{' + R.n + '}'; };
      aT = rad(R.k); bT = R.entire ? '-\\sqrt{' + R.m * R.m * R.n + '}' : '-' + rad(R.m); if (R.sw) { var t2 = aT; aT = bT; bT = t2; }
      val = (R.k + R.m) * Math.sqrt(R.n); o = { keys: 'radical', keyTex: rad(R.k + R.m) };
      sol = (R.entire ? t('-\\sqrt{' + R.m * R.m * R.n + '}=-' + rad(R.m)) + '. ' : '') + t(AL(rad(R.k) + '-(-' + rad(R.m) + ')') + '=' + AL(rad(R.k + R.m)) + '=' + rad(R.k + R.m)) + '.';
      if (R.k !== R.m) wr.push({ v: Math.abs(R.k - R.m) * Math.sqrt(R.n), tex: rad(Math.abs(R.k - R.m)), code: CP + 'dist-sub', hint: 'Subtract with the signs: ' + t(rad(R.k) + '-(-' + rad(R.m) + ')') + ' adds the two sizes.' });
      wr.push({ v: -val, tex: '-' + rad(R.k + R.m), code: CP + 'dist-neg', hint: 'A distance is never negative.' });
      var pr = U.num('Determine the distance between ' + t(aT) + ' and ' + t(bT) + ' on a number line. Give an exact answer.', val, wr, 'The distance between ' + t('a') + ' and ' + t('b') + ' is ' + t('|a-b|') + ':<br>' + sol,
        ['The distance between two numbers is the absolute value of their difference, ' + t('|a-b|') + '.', 'Write both as multiples of ' + t('\\sqrt{' + R.n + '}') + ' first.'], 'distance between radicals', o);
      pr.check = (function (base) { var rc = K.radical({ k: R.k + R.m, n: 2, m: R.n }, 'mixed'); return function (resp) { var b0 = base(resp); if (b0.v !== 'correct') return b0; return rc(resp); }; })(pr.check);
      return pr;
    }
    return U.num('Determine the distance between ' + t(aT) + ' and ' + t(bT) + ' on a number line.' + (kind === 'frac' ? ' Give an exact answer.' : ''), val, wr, 'The distance between ' + t('a') + ' and ' + t('b') + ' is ' + t('|a-b|') + ':<br>' + sol,
      ['The distance between two numbers is the absolute value of their difference, ' + t('|a-b|') + ' (either order).', 'Keep the signs when you subtract; a distance is never negative.'], 'distance between two numbers', o);
  }

  /* ---------- ordering (Q5, EP A3) ---------- */
  function orderQ(r, n, dir) {
    var c = r.int(3, 6);
    function item(kind) {
      if (kind === 'dec') { var d = (c * 10 + r.int(-7, 7)) / 10; return { tex: A('-' + dt(d)), val: d, why: t(A('-' + dt(d)) + '=' + dt(d)) }; }
      if (kind === 'negabs') { var m = r.int(1, c + 1); return { tex: '-' + A('-' + m), val: -m, why: t('-' + A('-' + m) + '=-' + m) }; }
      if (kind === 'diff') { var a0 = r.int(-3, 4), w = c + r.int(0, 1); return { tex: A(a0 + '-' + pn(a0 + w)), val: w, why: t(A(a0 - (a0 + w)) + '=' + w) }; }
      if (kind === 'root') { var k = pickWhere(function () { return r.int((c - 1) * (c - 1) + 1, (c + 1) * (c + 1) - 1); }, function (x) { var s = Math.round(Math.sqrt(x)); return s * s !== x; }); return { tex: A('-\\sqrt{' + k + '}'), val: Math.sqrt(k), why: t(A('-\\sqrt{' + k + '}') + '=\\sqrt{' + k + '}\\approx ' + K.roundTo(Math.sqrt(k), 2)) }; }
      if (kind === 'negdec') { var d2 = r.int(2, 29) / 10; return { tex: '-' + A(dt(d2)), val: -d2, why: t('-' + A(dt(d2)) + '=-' + dt(d2)) }; }
      if (kind === 'frac') { var q = r.pick([3, 6, 7]), p = pickWhere(function () { return c * q + r.int(-q + 1, q - 1); }, function (x) { return gcd(x, q) === 1; }); return { tex: AL('-\\dfrac{' + p + '}{' + q + '}'), val: p / q, why: t(AL('-\\frac{' + p + '}{' + q + '}') + '=\\frac{' + p + '}{' + q + '}\\approx ' + K.roundTo(p / q, 2)) }; }
      var k2 = pickWhere(function () { return r.int(10, 40); }, function (x) { var s = Math.round(Math.sqrt(x)); return s * s !== x && Math.sqrt(x) < c + 1.5; }), m2 = Math.floor(Math.sqrt(k2)) - r.int(1, 2);
      return { tex: AL('\\sqrt{' + k2 + '}-' + m2), val: Math.sqrt(k2) - m2, why: t(AL('\\sqrt{' + k2 + '}-' + m2) + '\\approx ' + K.roundTo(Math.sqrt(k2) - m2, 2)) };
    }
    var kinds = n === 6 ? ['dec', 'negabs', 'diff', 'root', 'negdec', 'frac'] : ['dec', 'negabs', 'rdiff', 'frac', 'negdec'];
    var items = pickWhere(function () { return kinds.map(item); }, function (L) { var v = L.map(function (x) { return x.val; }).sort(function (x, y) { return x - y; }); for (var i = 1; i < v.length; i++) if (v[i] - v[i - 1] < 0.06) return false; return true; });
    items.sort(function (x, y) { return dir === 'desc' ? y.val - x.val : x.val - y.val; }); items.forEach(function (x, i) { x.id = 'e' + i; });
    var p = KP.order(r, 'Arrange in order from ' + (dir === 'desc' ? 'greatest to least' : 'least to greatest') + '.', items, { first: dir === 'desc' ? 'greatest' : 'least', last: dir === 'desc' ? 'least' : 'greatest', why: function (x, y) { return t(items.filter(function (it) { return it.id === x; })[0].tex) + ' and ' + t(items.filter(function (it) { return it.id === y; })[0].tex) + ' are in the wrong order: evaluate each one and compare.'; } },
      'Evaluate each one: ' + items.map(function (x) { return x.why; }).join(', ') + '.<br>' + (dir === 'desc' ? 'Greatest to least: ' : 'Least to greatest: ') + items.map(function (x) { return t(x.tex); }).join(dir === 'desc' ? ' &gt; ' : ' &lt; ') + '.',
      ['Evaluate each expression first (a decimal approximation is fine for ordering).', 'A negative sign outside the bars makes the value negative: ' + t('-\\lvert -5\\rvert=-5') + '.'], 'ordering absolute values');
    p.bad = [items.map(function (x) { return x.id; }).reverse()];
    return p;
  }

  /* ---------- evaluate for given values (Q4, EP A4) ---------- */
  function evalAt(sh, kind, r) {
    var a = sh.a, b = sh.b, A_ = sh.an, B_ = sh.bn, e, val, wr = [], sub, o = { box: 'number' };
    if (kind === 'diff') { e = A(A_ + '-' + B_); val = Math.abs(a - b); sub = A(pn(a) + '-' + pn(b)) + '=' + A(a - b); wr.push({ v: a - b, code: CP + 'abs-bracket', hint: 'You found the value inside the bars. Now take its absolute value.' }); wr.push({ v: Math.abs(Math.abs(a) - Math.abs(b)), code: CP + 'abs-split', hint: 'Substitute with the sign: ' + t(A_ + '=' + a) + '.' }); }
    else if (kind === 'split') { e = A(A_) + '-' + A(B_); val = Math.abs(a) - Math.abs(b); sub = A(a) + '-' + A(b) + '=' + Math.abs(a) + '-' + Math.abs(b); wr.push({ v: a - b, code: CP + 'abs-bracket', hint: 'Take each absolute value: ' + t(A(a) + '=' + Math.abs(a)) + '.' }); wr.push({ v: Math.abs(a - b), code: CP + 'abs-split', hint: 'These are two separate absolute values; you cannot merge them into ' + t(A(A_ + '-' + B_)) + '.' }); }
    else if (kind === 'prod') { var k = sh.k; e = A(k + A_ + B_); val = Math.abs(k * a * b); sub = A(k + '(' + a + ')(' + b + ')') + '=' + A(k * a * b); wr.push({ v: k * a * b, code: CP + 'abs-bracket', hint: 'You found the value inside the bars. Now take its absolute value.' }); }
    else if (kind === 'sq') { var m = sh.m; e = A(A_ + '^{2}-' + m + B_); val = Math.abs(a * a - m * b); sub = A('(' + a + ')^{2}-' + m + '(' + b + ')') + '=' + A(a * a + '-' + m * b); if (a * a - m * b < 0) wr.push({ v: a * a - m * b, code: CP + 'abs-bracket', hint: 'You found the value inside the bars. Now take its absolute value.' }); wr.push({ v: Math.abs(-a * a - m * b), code: CP + 'sq-neg', hint: t('(' + a + ')^{2}=' + a * a) + ': a negative number squared is positive.' }); }
    else if (kind === 'lin') { var p = sh.p, q = sh.q; e = A(p + A_ + '+' + q + B_); val = Math.abs(p * a + q * b); sub = A(p + '(' + a + ')+' + q + '(' + b + ')') + '=' + A(p * a + '+' + q * b) + '=' + A(p * a + q * b); wr.push({ v: p * a + q * b, code: CP + 'abs-bracket', hint: 'You found the value inside the bars. Now take its absolute value.' }); wr.push({ v: Math.abs(-p * a + q * b), code: CP + 'abs-split', hint: 'Substitute with the sign: ' + t(p + A_ + '=' + p + '(' + a + ')=' + p * a) + '.' }); }
    else if (kind === 'quot') { // |a + b| / a  (a < 0)
      e = '\\dfrac{' + A(A_ + '+' + B_) + '}{' + A_ + '}'; val = ex.norm(Math.abs(a + b), a); o = { keys: 'fraction' }; sub = '\\frac{' + A(a + '+' + b) + '}{' + a + '}=\\frac{' + Math.abs(a + b) + '}{' + a + '}';
      wr.push({ v: ex.norm(Math.abs(a + b), -a), code: CP + 'den-sign', hint: 'Only the numerator is inside the bars; the denominator ' + t(A_ + '=' + a) + ' stays negative.' });
      wr.push({ v: ex.norm(a + b, a), code: CP + 'abs-bracket', hint: 'Take the absolute value of the numerator: ' + t(A(a + b) + '=' + Math.abs(a + b)) + '.' });
    } else { // |m a + b| / |a|
      var mm = sh.mm; e = '\\dfrac{' + A(mm + A_ + '+' + B_) + '}{' + A(A_) + '}'; val = ex.norm(Math.abs(mm * a + b), Math.abs(a)); o = { keys: 'fraction' }; sub = '\\frac{' + A(mm * a + '+' + b) + '}{' + A(a) + '}=\\frac{' + Math.abs(mm * a + b) + '}{' + Math.abs(a) + '}';
      wr.push({ v: ex.norm(mm * a + b, Math.abs(a)), code: CP + 'abs-bracket', hint: 'Take the absolute value of the numerator.' });
      wr.push({ v: ex.norm(Math.abs(mm * a + b), a), code: CP + 'den-sign', hint: 'The denominator is an absolute value too: ' + t(A(a) + '=' + Math.abs(a)) + '.' });
    }
    return U.num('Evaluate ' + t(e) + '.', val, wr, 'Substitute in brackets, simplify inside the bars, take the absolute value, then finish: ' + t(sub + '=' + rt(val)) + '.',
      ['Substitute each value in brackets, e.g. ' + t(A_ + '=(' + a + ')') + '.', 'Simplify inside the bars before taking the absolute value; anything outside the bars (a sign, a coefficient, a denominator) is applied afterwards.'], 'evaluating with absolute values', o);
  }

  /* ---------- compare: <, > or = (Q6) ---------- */
  function compareQ(r, kind) {
    var L, R, lv, rv2, why;
    if (kind === 'opp') { var n = pickWhere(function () { return r.int(2, 30); }, function (x) { return x !== 9; }); L = A('-' + n); R = A(n); lv = n; rv2 = n; why = 'A number and its opposite are the same distance from ' + t(0) + '.'; }
    else if (kind === 'same') { var a = r.int(2, 9), b = r.int(2, 9); if (a === 3 && b === 5) b = 6; L = A('-' + a + '-' + b); R = A('-' + a) + '+' + A(b); lv = a + b; rv2 = a + b; why = t('-' + a) + ' and ' + t('-' + b) + ' have the same sign, so nothing cancels.'; }
    else if (kind === 'split') { var p = r.int(2, 8), q = pickWhere(function () { return r.int(3, 15); }, function (x) { return x > p && !(p === 4 && x === 10); }); L = A(p + '-' + q); R = A(p) + '-' + A(q); lv = q - p; rv2 = p - q; why = 'The left side is an absolute value (never negative); the right side is a negative difference.'; }
    else if (kind === 'opp2') { var c = r.int(2, 9), d = pickWhere(function () { return r.int(2, 12); }, function (x) { return x !== c && !(c === 2 && x === 7); }); L = A('-' + c + '+' + d); R = A('-' + c) + '+' + A(d); lv = Math.abs(d - c); rv2 = c + d; why = 'Opposite signs partly cancel inside the bars, so ' + t(A('-' + c + '+' + d) + '=' + Math.abs(d - c)) + ' is less than ' + t(c + d) + '.'; }
    else if (kind === 'negabs') { var m = pickWhere(function () { return r.int(2, 20); }, function (x) { return x !== 6; }); L = '-' + A('-' + m); R = A('-' + m); lv = -m; rv2 = m; why = t('-' + A('-' + m) + '=-' + m) + ' and ' + t(A('-' + m) + '=' + m) + '.'; }
    else { var u = r.int(2, 9), w = r.int(2, 9); if (u === 3 && w === 4) w = 5; L = A('(-' + u + ')(-' + w + ')'); R = A('-' + u) + '\\cdot ' + A('-' + w); lv = u * w; rv2 = u * w; why = 'Bars can be split over a product: ' + t('|ab|=|a|\\,|b|') + '.'; }
    if (kind !== 'opp' && kind !== 'same' && kind !== 'prod' && r.chance(0.4)) { var tt = L; L = R; R = tt; var tv = lv; lv = rv2; rv2 = tv; }
    var rel = lv < rv2 ? '<' : lv > rv2 ? '>' : '=';
    var opts = ['<', '>', '='].map(function (s) { return { html: t(s), right: s === rel, code: s === '<' ? 'lt' : s === '>' ? 'gt' : 'eq', why: 'Evaluate each side: the left side is ' + t(lv) + ' and the right side is ' + t(rv2) + '.' }; });
    return KP.mc(r, 'Replace ' + t('\\square') + ' with ' + t('<') + ', ' + t('>') + ' or ' + t('=') + ':<br>' + t(L + '\\ \\square\\ ' + R), opts,
      'Left side: ' + t(L + '=' + lv) + '. Right side: ' + t(R + '=' + rv2) + '. So ' + t(L + rel + R) + '. ' + why, ['Evaluate each side separately, then compare the two numbers.'], 'comparing absolute values', true);
  }

  /* ---------- true or false, with the explanation or counterexample (Q7) ---------- */
  function tfQ(r, which) {
    var st, opts, sol;
    if (which === 'pos') {
      if (r.chance(0.7)) {
        var n = r.int(2, 9);
        st = 'The absolute value of every real number is positive.';
        opts = [{ html: 'False: ' + t('|0|=0') + ', which is not positive.', right: true }, { html: 'True: an absolute value is a distance, and distances are positive.', why: 'Check the number ' + t(0) + ': its distance from ' + t(0) + ' is ' + t(0) + '.' },
          { html: 'False: ' + t(A('-' + n) + '=-' + n) + '.', why: t(A('-' + n) + '=' + n) + ', so that is not a counterexample.' }, { html: 'True: ' + t(A('-' + n) + '=' + n) + ' and ' + t(A(n) + '=' + n) + '.', why: 'Two examples do not show it is true for <b>every</b> number. Try ' + t(0) + '.' }];
        sol = 'False. ' + t('|0|=0') + ', and ' + t(0) + ' is not positive. Absolute values are never <b>negative</b>: ' + t('|a|\\ge 0') + '.';
      } else {
        st = 'The absolute value of every <b>non-zero</b> real number is positive.';
        opts = [{ html: 'True: a non-zero number is some distance away from ' + t(0) + ', and that distance is positive.', right: true }, { html: 'False: ' + t('|0|=0') + '.', why: t(0) + ' is not a non-zero number, so it is not a counterexample here.' },
          { html: 'False: the absolute value of a negative number is negative.', why: 'The absolute value of a negative number is its opposite, which is positive.' }, { html: 'True: ' + t('|a|=a') + ' for every ' + t('a') + '.', why: 'That reason is false: ' + t(A('-2') + '=2\\ne -2') + '.' }];
        sol = 'True. Only ' + t(0) + ' is at distance ' + t(0) + ' from ' + t(0) + '; every other number is a positive distance away.';
      }
    } else if (which === 'sum') {
      var f = r.pick(['sum', 'sum', 'diff', 'prod']), p = r.int(2, 9), q = pickWhere(function () { return r.int(2, 9); }, function (x) { return x !== p; });
      if (f === 'sum') {
        st = t('|a+b|=|a|+|b|') + ' for all real numbers ' + t('a') + ' and ' + t('b') + '.';
        opts = [{ html: 'False: ' + t('a=' + p + ',\\ b=-' + q) + ' gives ' + t(A(p + '+(-' + q + ')') + '=' + Math.abs(p - q)) + ' but ' + t(A(p) + '+' + A('-' + q) + '=' + (p + q)) + '.', right: true },
          { html: 'False: ' + t('a=' + p + ',\\ b=' + q) + ' gives ' + t(A(p + '+' + q) + '=' + (p + q)) + ' and ' + t(A(p) + '+' + A(q) + '=' + (p + q)) + '.', why: 'Those two values are equal, so that pair is not a counterexample.' },
          { html: 'True: absolute value bars act like brackets.', why: 'Bars cannot be split over a sum. Try numbers with opposite signs.' }, { html: 'True: both sides are distances from ' + t(0) + '.', why: 'Try numbers with opposite signs.' }];
        sol = 'False. With ' + t('a=' + p) + ' and ' + t('b=-' + q) + ': ' + t('|a+b|=' + Math.abs(p - q)) + ' but ' + t('|a|+|b|=' + (p + q)) + '. (They are equal only when ' + t('a') + ' and ' + t('b') + ' do not have opposite signs.)';
      } else if (f === 'diff') {
        st = t('|a-b|=|a|-|b|') + ' for all real numbers ' + t('a') + ' and ' + t('b') + '.';
        var lo = Math.min(p, q), hi = Math.max(p, q);
        opts = [{ html: 'False: ' + t('a=' + lo + ',\\ b=' + hi) + ' gives ' + t(A(lo + '-' + hi) + '=' + (hi - lo)) + ' but ' + t(A(lo) + '-' + A(hi) + '=' + (lo - hi)) + '.', right: true },
          { html: 'False: ' + t('a=' + hi + ',\\ b=' + lo) + ' gives ' + t(A(hi + '-' + lo) + '=' + (hi - lo)) + ' and ' + t(A(hi) + '-' + A(lo) + '=' + (hi - lo)) + '.', why: 'Those two values are equal, so that pair is not a counterexample.' },
          { html: 'True: bars can be split over a difference.', why: 'Bars cannot be split over a difference. Try ' + t('a<b') + '.' }, { html: 'True: both sides are never negative.', why: t('|a|-|b|') + ' can be negative. Try ' + t('a<b') + '.' }];
        sol = 'False. With ' + t('a=' + lo) + ' and ' + t('b=' + hi) + ': ' + t('|a-b|=' + (hi - lo)) + ' but ' + t('|a|-|b|=' + (lo - hi)) + '.';
      } else {
        st = t('|ab|=|a|\\,|b|') + ' for all real numbers ' + t('a') + ' and ' + t('b') + '.';
        opts = [{ html: 'True: the size of a product is the product of the sizes; the signs only affect whether it is negative.', right: true },
          { html: 'False: ' + t('a=-' + p + ',\\ b=' + q) + ' gives ' + t(A('-' + p * q) + '=-' + p * q) + '.', why: t(A('-' + p * q) + '=' + p * q) + ', which equals ' + t(A('-' + p) + '\\,' + A(q) + '=' + p * q) + '.' },
          { html: 'False: bars cannot be split.', why: 'Bars cannot be split over a sum or difference, but they <b>can</b> be split over a product.' }, { html: 'True: ' + t('|a+b|=|a|+|b|') + ' too.', why: 'That is false (try ' + t('a=3,\\ b=-3') + '), so it is not a reason.' }];
        sol = 'True. For example ' + t('|(-' + p + ')(' + q + ')|=' + p * q + '=' + A('-' + p) + '\\,' + A(q)) + '. Bars can be split over a product or a quotient (but not over a sum or difference).';
      }
    } else if (which === 'neg') {
      var k = r.int(2, 9);
      if (r.chance(0.6)) {
        st = t('-|x|') + ' is never positive.';
        opts = [{ html: 'True: ' + t('|x|\\ge 0') + ', so its opposite ' + t('-|x|\\le 0') + '.', right: true }, { html: 'False: ' + t('x=-' + k) + ' gives ' + t('-' + A('-' + k) + '=' + k) + '.', why: t('-' + A('-' + k) + '=-' + k) + ': the negative sign outside the bars stays.' },
          { html: 'False: ' + t('x=0') + ' gives ' + t(0) + '.', why: t(0) + ' is not positive, so the statement still holds.' }, { html: 'True: ' + t('-|x|') + ' is always negative.', why: 'Not always: ' + t('-|0|=0') + '. The statement is true for a different reason.' }];
        sol = 'True. ' + t('|x|\\ge 0') + ' for every ' + t('x') + ', so ' + t('-|x|\\le 0') + ': it is negative or zero, never positive.';
      } else {
        st = t('-|x|') + ' is always negative.';
        opts = [{ html: 'False: ' + t('x=0') + ' gives ' + t('-|0|=0') + ', which is not negative.', right: true }, { html: 'True: ' + t('|x|\\ge 0') + ', so ' + t('-|x|<0') + '.', why: 'The opposite of ' + t(0) + ' is ' + t(0) + '. Check ' + t('x=0') + '.' },
          { html: 'False: ' + t('x=-' + k) + ' gives ' + t('-' + A('-' + k) + '=' + k) + '.', why: t('-' + A('-' + k) + '=-' + k) + ', which is negative.' }, { html: 'True: ' + t('-' + A(k) + '=-' + k) + ' and ' + t('-' + A('-' + k) + '=-' + k) + '.', why: 'Examples do not prove it for <b>every</b> ' + t('x') + '. Try ' + t('x=0') + '.' }];
        sol = 'False. ' + t('-|0|=0') + ', which is not negative. (' + t('-|x|') + ' is never <b>positive</b>.)';
      }
    } else {
      var m = r.int(2, 12), g = r.pick(['conv', 'conv', 'rev', 'or']);
      if (g === 'conv') {
        st = 'If ' + t('|a|=|b|') + ', then ' + t('a=b') + '.';
        opts = [{ html: 'False: ' + t(A(m) + '=' + A('-' + m)) + ' but ' + t(m + '\\ne -' + m) + '.', right: true }, { html: 'True: equal absolute values mean equal numbers.', why: 'A number and its opposite have the same absolute value.' },
          { html: 'False: ' + t(A(m) + '=' + A(m)) + ' but ' + t(m + '=' + m) + '.', why: 'That pair satisfies both parts, so it is not a counterexample.' }, { html: 'True: ' + t('a') + ' and ' + t('b') + ' are the same distance from ' + t(0) + '.', why: 'Two numbers can be the same distance from ' + t(0) + ' on <b>opposite</b> sides.' }];
        sol = 'False. ' + t(A(m) + '=' + A('-' + m) + '=' + m) + ', but ' + t(m + '\\ne -' + m) + '. We can only say ' + t('a=b') + ' or ' + t('a=-b') + '.';
      } else if (g === 'rev') {
        st = 'If ' + t('a=b') + ', then ' + t('|a|=|b|') + '.';
        opts = [{ html: 'True: equal numbers have the same distance from ' + t(0) + '.', right: true }, { html: 'False: ' + t(A(m) + '=' + A('-' + m)) + ' but ' + t(m + '\\ne -' + m) + '.', why: 'That example starts with ' + t('a\\ne b') + ', so it does not test this statement.' },
          { html: 'False: ' + t('a=-' + m + ',\\ b=-' + m) + ' gives ' + t('|a|=-' + m) + '.', why: t(A('-' + m) + '=' + m) + ', and ' + t('|b|=' + m) + ' too.' }, { html: 'True: ' + t('|a|=a') + ' for every ' + t('a') + '.', why: 'That reason is false: ' + t(A('-2') + '=2') + '.' }];
        sol = 'True. If ' + t('a') + ' and ' + t('b') + ' are the same number, they are the same distance from ' + t(0) + '.';
      } else {
        st = 'If ' + t('|a|=|b|') + ', then ' + t('a=b') + ' or ' + t('a=-b') + '.';
        opts = [{ html: 'True: two numbers the same distance from ' + t(0) + ' are equal or opposites.', right: true }, { html: 'False: ' + t(A(m) + '=' + A('-' + m)) + ' but ' + t(m + '\\ne -' + m) + '.', why: 'Here ' + t('a=-b') + ', which the statement allows.' },
          { html: 'False: ' + t('a=' + m + ',\\ b=' + m) + ' is not opposite.', why: 'Then ' + t('a=b') + ', which the statement allows.' }, { html: 'True: ' + t('|a|=a') + ' for every ' + t('a') + '.', why: 'That reason is false: ' + t(A('-2') + '=2') + '.' }];
        sol = 'True. On a number line there are exactly two numbers at each positive distance from ' + t(0) + ': a number and its opposite.';
      }
    }
    return KP.mc(r, 'True or false? Choose the correct answer with its reason or counterexample.<br><i>' + st + '</i>', opts, sol, ['To show a statement is false, one counterexample (values that make it false) is enough.', 'Test zero, a negative number, and numbers with opposite signs.'], 'true or false with absolute value');
  }

  /* ---------- simplify without bars (Q13, EP B3) ---------- */
  function simplifyQ(r, kind) {
    var m, k, target, wr = [], prompt, sol;
    if (kind === 'mx-abs') { m = pickWhere(function () { return nz(r, 2, 9); }, function (x) { return x !== 5 && x !== -1; }); prompt = t(m + 'x-|x|') + ' for ' + t('x<0'); target = M(m + 1, 1); wr.push({ is: M(m - 1, 1), code: CP + 'simp-sign', hint: 'For ' + t('x<0') + ', ' + t('|x|=-x') + ', so ' + t('-|x|=-(-x)=+x') + '.' }); sol = 'For ' + t('x<0') + ', ' + t('|x|=-x') + ': ' + t(m + 'x-(-x)=' + tx(target)) + '.'; }
    else if (kind === 'sum') { k = r.int(1, 6); m = r.int(1, 6); if (k === 1 && m === 1 && r.chance(0.6)) m = r.int(2, 6); prompt = t((k === 1 ? '' : k) + '|x|+|-' + (m === 1 ? '' : m) + 'x|') + ' for ' + t('x>0'); target = M(k + m, 1); wr.push({ is: M(k - m, 1), code: CP + 'simp-sign', hint: t('|-' + (m === 1 ? '' : m) + 'x|=' + (m === 1 ? '' : m) + '|x|') + ', and for ' + t('x>0') + ' that is ' + t((m === 1 ? '' : m) + 'x') + ' (positive).' }); sol = 'For ' + t('x>0') + ', ' + t('|x|=x') + ' and ' + t('|-' + (m === 1 ? '' : m) + 'x|=' + (m === 1 ? '' : m) + '|x|=' + (m === 1 ? '' : m) + 'x') + ': ' + t((k === 1 ? '' : k) + 'x+' + (m === 1 ? '' : m) + 'x=' + tx(target)) + '.'; if (P.eq(M(k - m, 1), target)) wr = []; }
    else if (kind === 'kx/x') { k = pickWhere(function () { return r.int(2, 9); }, function (x) { return x !== 3; }); prompt = t('\\dfrac{|' + k + 'x|}{x}') + ' for ' + t('x<0'); target = P.num(-k); wr.push({ is: P.num(k), code: CP + 'simp-sign', hint: 'For ' + t('x<0') + ', ' + t('|' + k + 'x|=' + k + '|x|=' + k + '(-x)') + '.' }); sol = t('\\frac{|' + k + 'x|}{x}=\\frac{' + k + '|x|}{x}=\\frac{' + k + '(-x)}{x}=-' + k) + ' for ' + t('x<0') + '.'; }
    else if (kind === 'sqrt') { m = r.int(1, 7); prompt = t('\\sqrt{x^{2}}+' + (m === 1 ? '' : m) + 'x') + ' for ' + t('x<0'); target = M(m - 1, 1); wr.push({ is: M(m + 1, 1), code: CP + 'simp-sign', hint: t('\\sqrt{x^{2}}=|x|') + ', and for ' + t('x<0') + ' that is ' + t('-x') + '.' }); sol = t('\\sqrt{x^{2}}=|x|=-x') + ' for ' + t('x<0') + ': ' + t('-x+' + (m === 1 ? '' : m) + 'x=' + tx(target)) + '.'; }
    else if (kind === 'negk') { k = r.int(2, 9); prompt = t('|-' + k + 'x|') + ' for ' + t('x<0'); target = M(-k, 1); wr.push({ is: M(k, 1), code: CP + 'simp-sign', hint: 'For ' + t('x<0') + ', ' + t(k + 'x') + ' is negative. ' + t('|-' + k + 'x|=' + k + '|x|=' + k + '(-x)') + '.' }); sol = t('|-' + k + 'x|=' + k + '|x|=' + k + '(-x)=-' + k + 'x') + ' (a positive number, since ' + t('x<0') + ').'; }
    return U.poly('Simplify ' + prompt + ', without absolute value symbols.', target, wr, sol, ['Use the definition: ' + t('|x|=x') + ' if ' + t('x\\ge 0') + ' and ' + t('|x|=-x') + ' if ' + t('x<0') + '.', 'Replace each absolute value, then collect like terms.'], 'simplifying without absolute value');
  }

  /* ---------- the questions ---------- */
  var QUESTIONS = [
    { num: '1', parts: [
      { id: 'q1a', level: 'LIM', make: function (r) { return evalSimple(r, 'negIn', [14, 23]); } },
      { id: 'q1b', level: 'BEG', make: function (r) { return evalSimple(r, 'negOut', [11, 17, 6]); } },
      { id: 'q1c', level: 'BEG', make: function (r) { return evalSimple(r, 'negDec', [2.5, 0.6]); } },
      { id: 'q1d', level: 'BEG', make: function (r) { return evalSimple(r, 'frac', [7 / 3, 5 / 9]); } },
      { id: 'q1e', level: 'EMG', make: function (r) { return evalSimple(r, 'sqrtNeg', [9, 12, 7]); } },
      { id: 'q1f', level: 'EMG', make: function (r) { return evalSimple(r, 'sqrtOut', [8, 4]); } },
      { id: 'q1g', level: 'EMG', make: function (r) { return evalSimple(r, 'irr'); } },
      { id: 'q1h', level: 'EMG', make: function (r) { return evalSimple(r, 'nest', [3]); } }] },
    { num: '2', parts: [
      { id: 'q2a', level: 'BEG', make: function (r) { return evalOps(r, 'diff'); } },
      { id: 'q2b', level: 'BEG', make: function (r) { return evalOps(r, 'diffSplit'); } },
      { id: 'q2c', level: 'EMG', make: function (r) { return evalOps(r, 'negSub'); } },
      { id: 'q2d', level: 'EMG', make: function (r) { return evalOps(r, 'coef'); } },
      { id: 'q2e', level: 'EMG', make: function (r) { return evalOps(r, 'negCoef'); } },
      { id: 'q2f', level: 'PRG', make: function (r) { return evalOps(r, 'nest'); } },
      { id: 'q2g', level: 'PRG', make: function (r) { return evalOps(r, 'pow'); } },
      { id: 'q2h', level: 'PRG', make: function (r) { return evalOps(r, 'quot'); } }] },
    { num: '3', parts: [
      { id: 'q3a', level: 'BEG', make: function (r) { return evalRoot(r, 'cbrt'); } },
      { id: 'q3b', level: 'BEG', make: function (r) { return evalRoot(r, 'cbrtOut'); } },
      { id: 'q3c', level: 'EMG', make: function (r) { return evalRoot(r, 'sq'); } },
      { id: 'q3d', level: 'EMG', make: function (r) { return evalRoot(r, 'mix'); } },
      { id: 'q3e', level: 'PRG', make: function (r) { return rootExact(r, 'int'); } },
      { id: 'q3f', level: 'PRG', make: function (r) { return rootExact(r, 'rad'); } }] },
    { num: '4', shared: function (r) {
        var s = pickWhere(function () { return { a: -r.int(2, 9), b: r.int(2, 9), k: r.int(2, 5), m: r.int(2, 6), p: r.int(2, 5), q: r.int(2, 6) }; }, function (z) {
          return !(z.a === -5 && z.b === 2) && z.a + z.b !== 0 && z.a * z.a - z.m * z.b !== 0 && z.p * z.a + z.q * z.b < 0 && Math.abs(z.a) !== z.b && gcd(Math.abs(z.a + z.b), Math.abs(z.a)) !== Math.abs(z.a); });
        s.an = 'a'; s.bn = 'b'; return s; },
      stem: function (s) { return 'Evaluate each expression for ' + t('a=' + s.a) + ' and ' + t('b=' + s.b) + '.'; }, parts: [
      { id: 'q4a', level: 'BEG', make: function (r, s) { return evalAt(s, 'diff', r); } },
      { id: 'q4b', level: 'BEG', make: function (r, s) { return evalAt(s, 'split', r); } },
      { id: 'q4c', level: 'EMG', make: function (r, s) { return evalAt(s, 'prod', r); } },
      { id: 'q4d', level: 'EMG', make: function (r, s) { return evalAt(s, 'sq', r); } },
      { id: 'q4e', level: 'EMG', make: function (r, s) { return evalAt(s, 'lin', r); } },
      { id: 'q4f', level: 'PRG', make: function (r, s) { return evalAt(s, 'quot', r); } }] },
    { num: '5', parts: [{ id: 'q5', level: 'PRG', make: function (r) { return orderQ(r, 6, 'asc'); } }] },
    { num: '6', parts: [
      { id: 'q6a', level: 'BEG', make: function (r) { return compareQ(r, 'opp'); } },
      { id: 'q6b', level: 'EMG', make: function (r) { return compareQ(r, 'same'); } },
      { id: 'q6c', level: 'EMG', make: function (r) { return compareQ(r, 'split'); } },
      { id: 'q6d', level: 'EMG', make: function (r) { return compareQ(r, 'opp2'); } },
      { id: 'q6e', level: 'BEG', make: function (r) { return compareQ(r, 'negabs'); } },
      { id: 'q6f', level: 'EMG', make: function (r) { return compareQ(r, 'prod'); } }] },
    { num: '7', parts: [
      { id: 'q7a', level: 'EMG', make: function (r) { return tfQ(r, 'pos'); } },
      { id: 'q7b', level: 'PRG', make: function (r) { return tfQ(r, 'sum'); } },
      { id: 'q7c', level: 'EMG', make: function (r) { return tfQ(r, 'neg'); } },
      { id: 'q7d', level: 'PRG', make: function (r) { return tfQ(r, 'eq'); } }] },
    { num: '8', parts: [
      { id: 'q8a', level: 'BEG', make: function (r) { return distance(r, 'pp', [[13, 4], [9, 2]]); } },
      { id: 'q8b', level: 'BEG', make: function (r) { return distance(r, 'np', [[-7, 8], [-6, 4], [-12, 5]]); } },
      { id: 'q8c', level: 'EMG', make: function (r) { return distance(r, 'nn', [[-15, -6], [-11, -3]]); } },
      { id: 'q8d', level: 'EMG', make: function (r) { return distance(r, 'dec', [[-3.4, 2.9], [-2.75, 1.5], [-2.65, 4.9]]); } },
      { id: 'q8e', level: 'PRG', make: function (r) { return distance(r, 'frac', [[-0.5, 5 / 3]]); } },
      { id: 'q8f', level: 'PRG', make: function (r) { return distance(r, 'rad', [[Math.sqrt(3), -2 * Math.sqrt(3)], [Math.sqrt(2), -2 * Math.sqrt(2)]]); } }] },
    { num: '9', parts: [
      { id: 'q9a', level: 'EMG', make: function (r) {
        var z = pickWhere(function () { return { p: nz(r, 1, 9), d: r.int(3, 12) }; }, function (s) { return !(s.p === -2 && s.d === 7) && !(s.p === -1 && s.d === 4) && !(s.p === -2 && s.d === 6); });
        var lab = r.pick(['A', 'P', 'M']), lab2 = { A: 'B', P: 'Q', M: 'N' }[lab];
        return U.vals('Point ' + t(lab) + ' is at ' + t(z.p) + ' on a number line. Point ' + t(lab2) + ' is ' + t(z.d) + ' units from ' + t(lab) + '. State the possible positions of ' + t(lab2) + '.', [z.p - z.d, z.p + z.d],
          [{ vals: [z.p + z.d], code: CP + 'dist-one', hint: t(lab2) + ' could be on either side of ' + t(lab) + '.' }, { vals: [z.p - z.d], code: CP + 'dist-one', hint: t(lab2) + ' could be on either side of ' + t(lab) + '.' }, { vals: [-z.p - z.d, -z.p + z.d], code: CP + 'center-sign', hint: 'Count from ' + t(lab) + ', which is at ' + t(z.p) + '.' }],
          'The numbers ' + t(z.d) + ' units from ' + t(z.p) + ' are ' + t(z.p + '+' + z.d + '=' + (z.p + z.d)) + ' and ' + t(z.p + '-' + z.d + '=' + (z.p - z.d)) + '.', ['Move ' + t(z.d) + ' units to the right and ' + t(z.d) + ' units to the left.'], 'numbers at a distance', { v: null });
      } },
      { id: 'q9b', level: 'EMG', make: function (r) {
        var z = pickWhere(function () { return { h: nz(r, 1, 9), d: r.int(2, 10) }; }, function (s) { return s.h > 0 && !(s.h === 3 && s.d === 5) && !(s.h === 4); });
        return U.vals('The expression ' + t('|x-' + z.h + '|') + ' is the distance between ' + t('x') + ' and ' + t(z.h) + '. Determine all values of ' + t('x') + ' for which ' + t('|x-' + z.h + '|=' + z.d) + '.', [z.h - z.d, z.h + z.d],
          [{ vals: [z.h + z.d], code: CP + 'dist-one', hint: 'There are two numbers ' + t(z.d) + ' units from ' + t(z.h) + ': one on each side.' }, { vals: [-z.h - z.d, -z.h + z.d], code: CP + 'center-sign', hint: t('|x-' + z.h + '|') + ' is the distance from ' + t(z.h) + ', not from ' + t(-z.h) + '.' }],
          'The numbers ' + t(z.d) + ' units from ' + t(z.h) + ': ' + t('x=' + z.h + '+' + z.d + '=' + (z.h + z.d)) + ' or ' + t('x=' + z.h + '-' + z.d + '=' + (z.h - z.d)) + '.', ['Which numbers are ' + t(z.d) + ' units from ' + t(z.h) + '?'], 'solving |x − h| = d by distance');
      } },
      { id: 'q9c', level: 'PRG', make: function (r) {
        var z = pickWhere(function () { return { h: r.int(1, 9), d: r.int(1, 9) }; }, function (s) { return !(s.h === 6 && s.d === 1) && s.h !== s.d; });
        return U.vals('Determine all values of ' + t('x') + ' for which ' + t('|x+' + z.h + '|=' + z.d) + '.', [-z.h - z.d, -z.h + z.d],
          [{ vals: [z.h - z.d, z.h + z.d], code: CP + 'center-sign', hint: t('|x+' + z.h + '|=|x-(-' + z.h + ')|') + ' is the distance between ' + t('x') + ' and ' + t(-z.h) + '.' }, { vals: [-z.h + z.d], code: CP + 'dist-one', hint: 'There are two numbers at that distance from ' + t(-z.h) + '.' }, { vals: [-z.h - z.d], code: CP + 'dist-one', hint: 'There are two numbers at that distance from ' + t(-z.h) + '.' }],
          t('|x+' + z.h + '|=|x-(-' + z.h + ')|') + ' is the distance from ' + t(-z.h) + ': ' + t('x=-' + z.h + '+' + z.d + '=' + (-z.h + z.d)) + ' or ' + t('x=-' + z.h + '-' + z.d + '=' + (-z.h - z.d)) + '.', ['Write ' + t('x+' + z.h) + ' as ' + t('x-(-' + z.h + ')') + ': the distance from which number?'], 'solving |x + h| = d by distance');
      } }] },
    { num: '10', shared: function (r) {
        var ch = pickWhere(function () { return r.shuffle([r.int(5, 160), -r.int(20, 220), -r.int(5, 120), r.int(5, 90), r.int(20, 180)]); }, function (c) { var n = c.reduce(function (x, y) { return x + y; }, 0); return n !== 0 && Math.abs(n) >= 5; });
        return { ch: ch, start: r.int(1200, 6800) + r.pick([0, 25, 50, 75]) };
      },
      stem: function (s) { return 'A stock’s closing price changed by ' + s.ch.map(function (c) { return t((c > 0 ? '+' : '') + money(c)); }).join(', ') + ' over five days.'; }, parts: [
      { id: 'q10a', level: 'BEG', make: function (r, s) {
        var net = s.ch.reduce(function (x, y) { return x + y; }, 0), tot = s.ch.reduce(function (x, y) { return x + Math.abs(y); }, 0);
        return U.num('Determine the net change in the price over the five days, in dollars (negative if it went down).', net / 100, [{ v: tot / 100, code: CP + 'net-total', hint: 'The net change keeps the signs: a drop subtracts.' }, { v: -net / 100, code: CP + 'net-sign', hint: 'Check the sign: add the changes with their signs.' }],
          'Add the changes with their signs: ' + t(s.ch.map(function (c, i) { return (i && c > 0 ? '+' : '') + (c / 100).toFixed(2); }).join('') + '=' + (net / 100).toFixed(2)) + ' (' + (net > 0 ? 'up' : 'down') + ' ' + t(money(Math.abs(net))) + ').', ['The net change keeps the signs.'], 'net change', { box: 'number', money: true, before: '$' });
      } },
      { id: 'q10b', level: 'EMG', make: function (r, s) {
        var net = s.ch.reduce(function (x, y) { return x + y; }, 0), tot = s.ch.reduce(function (x, y) { return x + Math.abs(y); }, 0);
        return U.num('Determine the total amount the price moved (up or down) over the five days, in dollars.', tot / 100, [{ v: net / 100, code: CP + 'net-total', hint: 'The total movement adds the <b>sizes</b> of the changes (their absolute values): a drop counts as movement too.' }, { v: Math.abs(net) / 100, code: CP + 'net-total', hint: 'That is the size of the net change. Add the absolute values of all five changes.' }],
          'Add the absolute values: ' + t(s.ch.map(function (c) { return (Math.abs(c) / 100).toFixed(2); }).join('+') + '=' + (tot / 100).toFixed(2)) + ', so ' + t(money(tot)) + '.', ['The total movement adds the absolute values of the changes.'], 'total movement', { box: 'number', money: true, before: '$' });
      } },
      { id: 'q10c', level: 'EMG', make: function (r, s) {
        var net = s.ch.reduce(function (x, y) { return x + y; }, 0), tot = s.ch.reduce(function (x, y) { return x + Math.abs(y); }, 0);
        return U.num('The price was ' + t(money(s.start)) + ' before the first day. What was it after the fifth day, in dollars?', (s.start + net) / 100, [{ v: (s.start - net) / 100, code: CP + 'net-sign', hint: 'Add the net change to the starting price, with its sign.' }, { v: (s.start + tot) / 100, code: CP + 'net-total', hint: 'The final price uses the <b>net</b> change, not the total movement.' }],
          'Starting price plus the net change: ' + t((s.start / 100).toFixed(2) + (net < 0 ? '-' : '+') + (Math.abs(net) / 100).toFixed(2) + '=' + ((s.start + net) / 100).toFixed(2)) + ', so ' + t(money(s.start + net)) + '.', ['The final price uses the net change.'], 'final price', { box: 'number', money: true, before: '$' });
      } }] },
    { num: '11', shared: function (r) {
        var lab = r.pick([[500, 8], [500, 10], [1000, 15], [1000, 20], [454, 6], [340, 5], [750, 10], [250, 4]]);
        var L0 = lab[0], tol = lab[1];
        var masses = [L0 - tol + r.int(1, Math.max(1, tol - 2)), L0 + tol, L0 + tol + r.pick([0.5, 1.5, 1]), L0 - tol - r.pick([1, 0.5, 2])];
        if (r.chance(0.5)) masses[1] = L0 - tol, masses[0] = L0 + tol - r.int(1, Math.max(1, tol - 2));
        return { L: L0, tol: tol, masses: r.shuffle(masses), item: r.pick(['cereal box', 'bag of flour', 'bag of coffee', 'jar of peanut butter']) };
      },
      stem: function (s) { return 'A ' + s.item + ' is labelled ' + t(s.L) + ' g. One with mass ' + t('m') + ' grams passes inspection if ' + t('|m-' + s.L + '|\\le ' + s.tol) + '.'; }, parts: [
      { id: 'q11a', level: 'PRG', make: function (r, s) {
        var pass = s.masses.filter(function (m) { return Math.abs(m - s.L) <= s.tol + 1e-9; }).map(dt), all = s.masses.map(dt);
        var edge = s.masses.filter(function (m) { return Math.abs(Math.abs(m - s.L) - s.tol) < 1e-9; }).map(dt);
        var chk = K.selectSet(pass, function (extra, missing) {
          if (!extra.length && missing.length && missing.every(function (x) { return edge.indexOf(x) >= 0; })) return { code: CP + 'tol-edge', hint: 'A box exactly ' + t(s.tol) + ' g away passes: the condition is ' + t('\\le') + ', not ' + t('<') + '.' };
          if (extra.length) return { code: CP + 'tol-side', hint: 'Work out ' + t('|m-' + s.L + '|') + ' for ' + t(extra[0]) + ' g: it is more than ' + t(s.tol) + '.' };
          return null;
        });
        return { prompt: 'Which of these pass inspection? Choose every one that passes.', input: { type: 'select', options: all.map(function (x) { return { value: x, html: t(x + '\\text{ g}') }; }) }, check: chk, key: pass, answer: pass.map(function (x) { return t(x + '\\text{ g}'); }).join(', '),
          solution: s.masses.map(function (m) { var d = Math.abs(m - s.L); return t(A(dt(m) + '-' + s.L) + '=' + dt(d)) + (d <= s.tol + 1e-9 ? ' passes' : ' fails'); }).join('; ') + '.', hints: ['For each mass, find how far it is from ' + t(s.L) + ': ' + t('|m-' + s.L + '|') + '.', 'It passes if that distance is ' + t(s.tol) + ' or less.'], text: 'tolerance check', bad: [all, pass.length > 1 ? pass.slice(1) : all.filter(function (x) { return pass.indexOf(x) < 0; })] };
      } },
      { id: 'q11b', level: 'EMG', make: function (r, s) {
        var lo = s.L - s.tol, hi = s.L + s.tol;
        return U.fields('State the lightest and the heaviest mass that passes.', [{ label: 'Lightest (g)', name: 'lightest' }, { label: 'Heaviest (g)', name: 'heaviest' }], [K.number(lo), K.number(hi)], [String(lo), String(hi)], t(lo + '\\text{ g}') + ' and ' + t(hi + '\\text{ g}'),
          'The masses within ' + t(s.tol) + ' g of ' + t(s.L) + ' g: from ' + t(s.L + '-' + s.tol + '=' + lo) + ' g to ' + t(s.L + '+' + s.tol + '=' + hi) + ' g.', ['The passing masses are at most ' + t(s.tol) + ' g from ' + t(s.L) + ' g, on either side.'], 'tolerance limits', [[String(hi), String(lo)]],
          function (resp) { var a = numVal(resp[0]), b = numVal(resp[1]); if (a === hi && b === lo) return wrong('swap-answer', 'Your answers are in each other’s boxes.'); return null; });
      } }] },
    { num: '12', parts: [
      { id: 'q12a', level: 'BEG', make: function (r) {
        var v = r.pick(['x', 'x', 'a', 't']), id = P.v(v), cases = '|' + v + '|=\\begin{cases}\\ \\ ' + v + ', & \\text{if } ' + v + '\\ge 0\\\\ -' + v + ', & \\text{if } ' + v + '<0\\end{cases}';
        var c1 = K.poly(id, { expanded: false }), c2 = K.poly(P.neg(id), { expanded: false });
        return U.fields('Complete the piecewise definition of absolute value.', [{ label: 'If ' + t(v + '\\ge 0') + ': ' + t('|' + v + '|='), name: 'first piece', mode: 'math', keys: 'poly', vars: [v] }, { label: 'If ' + t(v + '<0') + ': ' + t('|' + v + '|='), name: 'second piece', mode: 'math', keys: 'poly', vars: [v] }], [c1, c2], [v, '-' + v], t(cases),
          t(cases) + '<br>In the second piece ' + t(v) + ' is negative, so ' + t('-' + v) + ' is positive.', ['A number that is positive or zero is its own absolute value.', 'A negative number’s absolute value is its opposite.'], 'piecewise definition of |x|', [['-' + v, v], [v, v]],
          function (resp) { if (U.polyIs(P.neg(id))(String(resp[0]).replace(new RegExp(v, 'g'), 'x')) && U.polyIs(id)(String(resp[1]).replace(new RegExp(v, 'g'), 'x'))) return wrong(CP + 'def-swap', 'Your pieces are swapped: for ' + t(v + '\\ge 0') + ' the bars change nothing.'); return null; });
      } },
      { id: 'q12b', level: 'EMG', make: function (r) {
        var pool = [['|x|=-x', 'x<0', true, 'For ' + t('x<0') + ', ' + t('-x') + ' is positive: e.g. ' + t(A('-4') + '=4=-(-4)') + '.'], ['|x|=x', 'x\\le 0', false, t(A('-2') + '=2\\ne -2') + ' (it holds only at ' + t('x=0') + ').'], ['|-x|=x', 'x\\ge 0', true, t('|-x|=|x|=x') + ' for ' + t('x\\ge 0') + '.'], ['|-x|=-x', 'x>0', false, 'For ' + t('x>0') + ', ' + t('|-x|=x>0') + ' but ' + t('-x<0') + '.'],
          ['|x|=x', 'x\\ge 0', true, 'A non-negative number is its own absolute value.'], ['|x|=-x', 'x>0', false, 'For ' + t('x=3') + ': ' + t('|3|=3\\ne -3') + '.'], ['|-x|=-x', 'x\\le 0', true, 'For ' + t('x\\le 0') + ', ' + t('-x\\ge 0') + ', so ' + t('|-x|=-x') + '.'], ['|-x|=x', 'x<0', false, 'For ' + t('x=-2') + ': ' + t(A('-(-2)') + '=2\\ne -2') + '.'], ['|x|=-x', 'x\\le 0', true, 'For ' + t('x<0') + ' it is the definition, and at ' + t('x=0') + ' both sides are ' + t(0) + '.']];
        var pick4 = pickWhere(function () { return r.sample(pool, 4); }, function (L) { var tr = L.filter(function (x) { return x[2]; }).length; return tr >= 1 && tr <= 3; });
        var rows = pick4.map(function (x, i) { return { id: 'r' + i, html: t(x[0]) + ' if ' + t(x[1]) }; }), want = {}; pick4.forEach(function (x, i) { want['r' + i] = x[2] ? 'T' : 'F'; });
        var p = KP.grid('True or false?', rows, [{ id: 'T', html: 'True' }, { id: 'F', html: 'False' }], want, { why: function (rid) { var x = pick4[Number(rid.slice(1))]; return 'Check ' + t(x[0]) + ' if ' + t(x[1]) + ' with a value of ' + t('x') + ' in that interval.'; } },
          pick4.map(function (x) { return t(x[0]) + ' if ' + t(x[1]) + ': <b>' + (x[2] ? 'true' : 'false') + '</b>. ' + x[3]; }).join('<br>'), ['Test a value of ' + t('x') + ' from the interval in each statement (and the boundary value).'], 'piecewise definition: true or false');
        return p;
      } },
      { id: 'q12c', level: 'EMG', make: function (r) {
        var k = r.int(2, 9);
        return KP.mc(r, 'The definition says ' + t('|x|=-x') + ' if ' + t('x<0') + '. Why does this never give a negative absolute value?', [{ html: 'When ' + t('x<0') + ', its opposite ' + t('-x') + ' is positive: for example ' + t('x=-' + k) + ' gives ' + t('-x=' + k) + '.', right: true },
          { html: t('-x') + ' is negative, but the bars make it positive again.', why: 'In this piece there are no bars left: ' + t('-x') + ' itself is the answer. Try ' + t('x=-' + k) + '.' },
          { html: 'It only applies when ' + t('x=0') + '.', why: 'It applies to every negative ' + t('x') + '.' }, { html: t('-x') + ' means subtracting ' + t('x') + ', and subtracting always gives a positive result.', why: 'Subtracting does not always give a positive result; here ' + t('x') + ' is negative, and the opposite of a negative number is positive.' }],
          'When ' + t('x<0') + ', ' + t('-x') + ' is the opposite of a negative number, so it is positive. E.g. ' + t('x=-' + k) + ': ' + t('|x|=-(-' + k + ')=' + k) + '.', ['Try a negative value of ' + t('x') + ' in ' + t('-x') + '.'], 'why −x is positive for x < 0');
      } }] },
    { num: '13', stem: 'Simplify each expression for the values of \\(x\\) given.', parts: [
      { id: 'q13a', level: 'PRG', make: function (r) { return simplifyQ(r, 'mx-abs'); } },
      { id: 'q13b', level: 'PRG', make: function (r) { return simplifyQ(r, 'sum'); } },
      { id: 'q13c', level: 'ADV', make: function (r) { return simplifyQ(r, 'kx/x'); } },
      { id: 'q13d', level: 'ADV', make: function (r) { return simplifyQ(r, 'sqrt'); } }] },
    { num: '14', shared: function (r) {
        var h = pickWhere(function () { return r.int(1, 9); }, function (x) { return x !== 5 && x !== 4; });
        var x1 = pickWhere(function () { return -h - r.int(1, 6); }, function (x) { return x !== -8; }), x2 = pickWhere(function () { return -h + r.int(1, 12) + (r.chance(0.4) ? 0.5 : 0); }, function (x) { return x !== 1.5; });
        return { h: h, x1: x1, x2: x2 };
      },
      stem: function (s) { return 'Consider ' + t('|x+' + s.h + '|') + '.'; }, parts: [
      { id: 'q14a', level: 'MAS', make: function (r, s) { return U.piece(CP, 1, s.h, { prompt: 'Write ' + t('y=|x+' + s.h + '|') + ' in piecewise form: give the value of ' + t('x') + ' where the two pieces meet, and the expression on each side of it.' }); } },
      { id: 'q14b', level: 'PRG', make: function (r, s) {
        return KP.mc(r, 'What does ' + t('|x+' + s.h + '|') + ' measure on a number line?', [{ html: 'The distance between ' + t('x') + ' and ' + t(-s.h), right: true }, { html: 'The distance between ' + t('x') + ' and ' + t(s.h), why: t('x+' + s.h + '=x-(-' + s.h + ')') + ': it is the distance from ' + t(-s.h) + '.' },
          { html: 'The distance between ' + t('x') + ' and ' + t(0) + ', plus ' + t(s.h), why: 'That is ' + t('|x|+' + s.h) + ', a different expression: the bars here are around the whole sum.' }, { html: 'The position ' + t(s.h) + ' units to the right of ' + t('x'), why: 'That is ' + t('x+' + s.h) + ' without the bars, and it can be negative.' }],
          t('|x+' + s.h + '|=|x-(-' + s.h + ')|') + ' is the distance between ' + t('x') + ' and ' + t(-s.h) + '.', ['Write ' + t('x+' + s.h) + ' as a difference: ' + t('x-(?)') + '.'], 'meaning of |x + h|');
      } },
      { id: 'q14c', level: 'PRG', make: function (r, s) {
        var v1 = Math.abs(s.x1 + s.h), v2 = Math.abs(s.x2 + s.h);
        return U.fields('Use the piecewise form to evaluate ' + t('|x+' + s.h + '|') + ' for ' + t('x=' + dt(s.x1)) + ' and for ' + t('x=' + dt(s.x2)) + '.', [{ label: 'At ' + t('x=' + dt(s.x1)), name: 'x = ' + dt(s.x1) }, { label: 'At ' + t('x=' + dt(s.x2)), name: 'x = ' + dt(s.x2) }],
          [K.number(v1, function (v) { return v === s.x1 + s.h ? { code: CP + 'abs-bracket', hint: t(dt(s.x1) + '<' + (-s.h)) + ', so use the piece ' + t('-(x+' + s.h + ')') + '.' } : null; }), K.number(v2)], [dt(v1), dt(v2)], t(dt(v1)) + ' and ' + t(dt(v2)),
          t('x=' + dt(s.x1) + '<' + (-s.h)) + ': ' + t('-(' + dt(s.x1) + ')-' + s.h + '=' + dt(v1)) + '. ' + t('x=' + dt(s.x2) + '\\ge ' + (-s.h)) + ': ' + t(dt(s.x2) + '+' + s.h + '=' + dt(v2)) + '. (Check: each is the distance from ' + t(-s.h) + '.)',
          ['Decide which piece each ' + t('x') + '-value belongs to by comparing it with ' + t(-s.h) + '.'], 'evaluating with a piecewise form', [[dt(s.x1 + s.h), dt(v2)]]);
      } }] },
    { num: '15', parts: [{ id: 'q15', level: 'PRG', make: function (r) {
      var z = pickWhere(function () { return { a: r.int(1, 9), b: r.int(3, 15), c: r.int(1, 9) }; }, function (s) { var d = s.b - s.a; return d >= 2 && d !== s.c && !(s.a === 3 && s.b === 8 && s.c === 2); });
      var d = z.b - z.a, val = -d + z.c, vals = [val, d + z.c, -d - z.c, d - z.c];
      if (uniqNums(vals).length < 4) vals[3] = val + 1 === vals[1] ? val - 1 : val + 1;
      return KP.mc(r, 'The value of ' + t('-' + A(z.a + '-' + z.b) + '+' + A('-' + z.c)) + ' is', [{ html: t(val), right: true }, { html: t(vals[1]), why: 'The negative sign outside the first bars stays: ' + t('-' + A(z.a - z.b) + '=-' + d) + '.' }, { html: t(vals[2]), why: t(A('-' + z.c) + '=' + z.c) + ' is <b>added</b>.' }, { html: t(vals[3]), why: 'Evaluate each absolute value, then apply the signs outside the bars.' }],
        t('-' + A(z.a - z.b) + '+' + z.c + '=-' + d + '+' + z.c + '=' + val) + '.', H_ABS, 'evaluating (multiple choice)');
    } }] },
    { num: '16', parts: [{ id: 'q16', level: 'EMG', make: function (r) {
      var right = r.pick([['\\sqrt{x^{2}}=|x|', 'For every ' + t('x') + ', ' + t('\\sqrt{x^{2}}=|x|') + ' (the principal square root is never negative).'], ['|-x|=|x|', 'A number and its opposite are the same distance from ' + t(0) + '.'], ['|x|\\ge 0', 'An absolute value is a distance: never negative.']]);
      var wrongs = r.sample([['|x|=x', 'Fails for ' + t('x=-1') + ': ' + t(A('-1') + '=1\\ne -1') + '.'], ['|-x|=x', 'Fails for ' + t('x=-3') + ': ' + t(A('-(-3)') + '=3\\ne -3') + '.'], ['|x|>0', 'Fails for ' + t('x=0') + ': ' + t('|0|=0') + '.'], ['\\sqrt{x^{2}}=x', 'Fails for ' + t('x=-5') + ': ' + t('\\sqrt{25}=5\\ne -5') + '.'], ['-|x|<0', 'Fails for ' + t('x=0') + '.']], 3);
      return KP.mc(r, 'Which statement is true for <b>every</b> real number ' + t('x') + '?', [{ html: t(right[0]), right: true }].concat(wrongs.map(function (w) { return { html: t(w[0]), why: w[1] }; })),
        right[1] + '<br>The others fail: ' + wrongs.map(function (w) { return t(w[0]) + ': ' + w[1]; }).join(' '), ['Test each statement with a negative number and with ' + t(0) + '.'], 'true for every x');
    } }] },
    { num: '17', parts: [{ id: 'q17', level: 'BEG', make: function (r) {
      var z = pickWhere(function () { return { p: -r.int(1, 9), d: r.int(2, 12) }; }, function (s) { return s.d !== -s.p && s.d !== 2 * -s.p && !(s.p === -2 && s.d === 6) && !(s.p === -1 && s.d === 4); });
      var o = function (a2, b2) { return a2 === b2 ? t(a2) + ' only' : t(Math.min(a2, b2)) + ' and ' + t(Math.max(a2, b2)); };
      return KP.mc(r, 'The numbers on a number line that are ' + t(z.d) + ' units from ' + t(z.p) + ' are', [{ html: o(z.p - z.d, z.p + z.d), right: true }, { html: t(z.p + z.d) + ' only', why: 'There is also a number ' + t(z.d) + ' units to the <b>left</b> of ' + t(z.p) + '.' },
        { html: o(-z.p - z.d, -z.p + z.d), why: 'Count from ' + t(z.p) + ', not from ' + t(-z.p) + '.' }, { html: o(-z.d, z.d), why: 'Those are ' + t(z.d) + ' units from ' + t(0) + '.' }],
        t(z.p + '+' + z.d + '=' + (z.p + z.d)) + ' and ' + t(z.p + '-' + z.d + '=' + (z.p - z.d)) + '.', ['Move ' + t(z.d) + ' units each way from ' + t(z.p) + '.'], 'numbers at a distance (multiple choice)');
    } }] },
    { num: '18', parts: [{ id: 'q18', level: 'PRG', make: function (r) {
      var z = pickWhere(function () { return { a: -r.int(105, 480) / 100, b: r.int(110, 690) / 100 }; }, function (s) { var d = Math.round((s.b - s.a) * 100) / 100; return String(d).length <= 4 && String(d).indexOf('.') > 0 && !(Math.abs(s.a + 2.65) < 1e-9 && Math.abs(s.b - 4.9) < 1e-9); });
      var d = Math.round((z.b - z.a) * 100) / 100;
      return KP.nr('<b>Numerical response.</b> The distance between ' + t(dt(z.a)) + ' and ' + t(dt(z.b)) + ' on a number line is ______.', d, function (v) { if (Math.abs(v - Math.abs(Math.abs(z.b) - Math.abs(z.a))) < 1e-9) return { code: CP + 'dist-sub', hint: 'Subtract with the signs: ' + t(A(dt(z.a) + '-' + dt(z.b))) + '.' }; return null; },
        t(A(dt(z.a) + '-' + dt(z.b)) + '=' + A('-' + dt(d)) + '=' + dt(d)) + '.', ['The distance between ' + t('a') + ' and ' + t('b') + ' is ' + t('|a-b|') + '.'], 'distance (numerical response)');
    } }] }
  ];

  var EXTRA = [
    { num: '1', section: 'A. Skills', stem: 'Evaluate.', parts: [
      { id: 'e1a', level: 'LIM', make: function (r) { return evalSimple(r, 'negIn', [31, 14, 23]); } },
      { id: 'e1b', level: 'BEG', make: function (r) { return evalSimple(r, 'negDec', [9.4, 2.5, 0.6]); } },
      { id: 'e1c', level: 'BEG', make: function (r) { return evalOps(r, 'mulIn'); } },
      { id: 'e1d', level: 'BEG', make: function (r) { var z = pickWhere(function () { return { a: r.int(2, 12), b: r.int(3, 20) }; }, function (s) { return s.a !== s.b && !(s.a === 5 && s.b === 12); });
        return U.num('Evaluate ' + t(A('-' + z.a) + '-' + A('-' + z.b)) + '.', z.a - z.b, [{ v: z.b - z.a, code: CP + 'abs-split', hint: 'Take each absolute value separately: ' + t(z.a + '-' + z.b) + '.' }, { v: -z.a + z.b, code: CP + 'abs-bracket', hint: 'Each absolute value is positive.' }],
          t(A('-' + z.a) + '-' + A('-' + z.b) + '=' + z.a + '-' + z.b + '=' + (z.a - z.b)) + '.', H_ABS, 'difference of absolute values', { box: 'number' }); } },
      { id: 'e1e', level: 'EMG', make: function (r) { return evalOps(r, 'coefOut'); } },
      { id: 'e1f', level: 'EMG', make: function (r) { return evalOps(r, 'nest'); } },
      { id: 'e1g', level: 'EMG', make: function (r) { return evalRoot(r, 'cbrtOut'); } },
      { id: 'e1h', level: 'EMG', make: function (r) { return evalSimple(r, 'sqrtNegDec', [0.7]); } }] },
    { num: '2', stem: 'Determine the distance between the numbers. Give exact answers.', parts: [
      { id: 'e2a', level: 'BEG', make: function (r) { return distance(r, 'np', [[-12, 5], [-7, 8], [-6, 4]]); } },
      { id: 'e2b', level: 'EMG', make: function (r) { return distance(r, 'decnn', [[-8.5, -1.25]]); } },
      { id: 'e2c', level: 'PRG', make: function (r) { return distance(r, 'frac', [[2 / 3, -0.75], [-0.5, 5 / 3]]); } },
      { id: 'e2d', level: 'PRG', make: function (r) { return distance(r, 'rad', [[5 * Math.sqrt(2), -Math.sqrt(2)], [Math.sqrt(3), -2 * Math.sqrt(3)]]); } }] },
    { num: '3', parts: [{ id: 'e3', level: 'PRG', make: function (r) { return orderQ(r, 5, 'desc'); } }] },
    { num: '4', shared: function (r) {
        var s = pickWhere(function () { return { a: -r.int(2, 8), b: r.int(2, 9), m: r.int(2, 5), mm: r.int(2, 5) }; }, function (z) { return !(z.a === -2 && z.b === 3) && z.a * z.a - z.m * z.b !== 0 && z.mm * z.a + z.b !== 0 && Math.abs(z.a) !== z.b && (z.mm * z.a + z.b) % z.a !== 0; });
        s.an = 'x'; s.bn = 'y'; return s; },
      stem: function (s) { return 'Evaluate each expression for ' + t('x=' + s.a) + ' and ' + t('y=' + s.b) + '.'; }, parts: [
      { id: 'e4a', level: 'BEG', make: function (r, s) { return evalAt(s, 'diff', r); } },
      { id: 'e4b', level: 'BEG', make: function (r, s) { return evalAt(s, 'split', r); } },
      { id: 'e4c', level: 'EMG', make: function (r, s) { return evalAt(s, 'sq', r); } },
      { id: 'e4d', level: 'PRG', make: function (r, s) { return evalAt(s, 'quotAbs', r); } }] },
    { num: '5', section: 'B. Applying', parts: [{ id: 'e5', level: 'PRG', make: function (r) {
      var ps = pickWhere(function () { return [0, r.int(2, 9) * 5, -r.int(1, 8) * 5, r.int(2, 12) * 5, 0]; }, function (L) { return L[1] !== 35 && Math.abs(L[2] - L[1]) > 10 && Math.abs(L[3] - L[2]) > 10; });
      var legs = []; for (var i = 1; i < ps.length; i++) legs.push(Math.abs(ps[i] - ps[i - 1]));
      var tot = legs.reduce(function (x, y) { return x + y; }, 0), naive = ps.reduce(function (x, y) { return x + Math.abs(y); }, 0);
      var who = r.pick(['A delivery robot', 'A toy train', 'A robot vacuum']);
      return U.fields(who + ' moves along a straight path. Its positions (in metres, east of the start is positive) are ' + ps.map(function (p) { return t(p); }).join(', then ') + ' (back at the start). Determine its net change in position and the total distance it travels.',
        [{ label: 'Net change (m)', name: 'net change' }, { label: 'Total distance (m)', name: 'total distance' }], [K.number(0), K.number(tot, function (v) { if (v === naive && naive !== tot) return { code: CP + 'dist-sub', hint: 'The distance of each leg is the distance between two <b>positions</b>: ' + t('|' + ps[2] + '-' + ps[1] + '|') + ', not the position itself.' }; return null; })], ['0', String(tot)], t('0') + ' m; ' + t(tot) + ' m',
        'Net change: final position minus starting position, ' + t('0-0=0') + ' m.<br>Total distance: ' + t(legs.map(function (d, i) { return A(ps[i + 1] + '-' + pn(ps[i])); }).join('+') + '=' + legs.join('+') + '=' + tot) + ' m.',
        ['The net change only compares the start and the end.', 'The total distance adds the distance of each leg: ' + t('|\\text{next}-\\text{previous}|') + '.'], 'net change and total distance', [[String(tot), '0']],
        function (resp) { var a = numVal(resp[0]), b = numVal(resp[1]); if (a === tot && b === 0) return wrong(CP + 'net-total', 'Your answers are in each other’s boxes.'); return null; });
    } }] },
    { num: '6', parts: [{ id: 'e6', level: 'PRG', make: function (r) {
      var T = r.pick([60, 75, 88, 92, 105, 120]), offs = pickWhere(function () { return r.shuffle([-r.int(5, 40), r.int(5, 40), r.int(5, 40), -r.int(5, 40)]).map(function (x) { return x / 10; }); }, function (o) { var a = o.map(Math.abs).sort(function (x, y) { return x - y; }); for (var i = 1; i < 4; i++) if (a[i] - a[i - 1] < 0.15) return false; return true; });
      var laps = offs.map(function (o) { return Math.round((T + o) * 10) / 10; }), dev = offs.map(Math.abs);
      var ci = dev.indexOf(Math.min.apply(null, dev)), fi = dev.indexOf(Math.max.apply(null, dev));
      var rows = [{ id: 'close', html: 'Closest to the target' }, { id: 'far', html: 'Farthest from the target' }], cols = laps.map(function (l, i) { return { id: 'L' + i, html: t(dt(l) + '\\text{ s}') }; });
      var lo = laps.indexOf(Math.min.apply(null, laps)), hi = laps.indexOf(Math.max.apply(null, laps));
      var p = KP.grid('A runner aims for a lap time of ' + t(T) + ' s. Her four lap times were ' + laps.map(function (l) { return t(dt(l)) + ' s'; }).join(', ') + '. Use ' + t('|t-' + T + '|') + ' to find which lap was closest to the target and which was farthest from it.', rows, cols, { close: 'L' + ci, far: 'L' + fi },
        { count: false, why: function (rid, got) { var i = Number(String(got).slice(1)); if (rid === 'close' && i === lo && lo !== ci) return { code: CP + 'dist-sub', hint: 'The fastest lap is not the closest to the target. Compare ' + t('|t-' + T + '|') + ' for each lap.' }; if (rid === 'far' && (i === hi || i === lo) && i !== fi) return { code: CP + 'dist-sub', hint: 'Compare the distances from the target, ' + t('|t-' + T + '|') + ', not the times themselves.' }; return null; } },
        laps.map(function (l, i) { return t(A(dt(l) + '-' + T) + '=' + dt(dev[i])); }).join(', ') + '.<br>Closest: the ' + t(dt(laps[ci])) + ' s lap. Farthest: the ' + t(dt(laps[fi])) + ' s lap.', ['Work out ' + t('|t-' + T + '|') + ' for each lap: the smallest is the closest.'], 'closest and farthest from a target');
      p.bad = [{ close: 'L' + fi, far: 'L' + ci }];
      return p;
    } }] },
    { num: '7', stem: 'Simplify, without absolute value symbols.', parts: [
      { id: 'e7a', level: 'ADV', make: function (r) {
        var plus = r.chance(0.6), Xp = P.v('x'), Z = P.num(0);
        var tp = plus ? Xp : Z, tn = plus ? Z : Xp, e = '\\dfrac{x' + (plus ? '+' : '-') + '|x|}{2}';
        var cp1 = K.poly(tp, { expanded: false }), cn = K.poly(tn, { expanded: false });
        return U.fields('Simplify ' + t(e) + ' for ' + t('x>0') + ', and for ' + t('x<0') + '.', [{ label: 'For ' + t('x>0') + ':', name: 'x > 0', mode: 'math', keys: 'poly', vars: ['x'] }, { label: 'For ' + t('x<0') + ':', name: 'x < 0', mode: 'math', keys: 'poly', vars: ['x'] }], [cp1, cn], [tx(tp), tx(tn)], 'for ' + t('x>0') + ': ' + t(tx(tp)) + '; for ' + t('x<0') + ': ' + t(tx(tn)),
          t('x>0') + ': ' + t('|x|=x') + ', so ' + t('\\frac{x' + (plus ? '+' : '-') + 'x}{2}=' + tx(tp)) + '. ' + t('x<0') + ': ' + t('|x|=-x') + ', so ' + t('\\frac{x' + (plus ? '+' : '-') + '(-x)}{2}=' + tx(tn)) + '.',
          ['Replace ' + t('|x|') + ' by ' + t('x') + ' or ' + t('-x') + ' depending on the sign of ' + t('x') + '.'], 'simplifying (x ± |x|)/2', [[tx(tn), tx(tp)]],
          function (resp) { if (U.polyIs(tn)(resp[0]) && U.polyIs(tp)(resp[1])) return wrong(CP + 'simp-sign', 'Your answers are swapped: for ' + t('x>0') + ', ' + t('|x|=x') + '.'); return null; });
      } },
      { id: 'e7b', level: 'ADV', make: function (r) { return simplifyQ(r, 'negk'); } }] },
    { num: '8', parts: [{ id: 'e8', level: 'EMG', make: function (r) {
      var z = pickWhere(function () { return { a: r.int(2, 9), b: r.int(2, 12) }; }, function (s) { return s.a !== s.b && !(s.a === 3 && s.b === 8); });
      return KP.mc(r, 'Which expression has the greatest value?', [{ html: t(A('-' + z.a) + '+' + A('-' + z.b)), right: true }, { html: t(A('-' + z.a + '+' + z.b)), why: 'Opposite signs partly cancel inside the bars: ' + t(A('-' + z.a + '+' + z.b) + '=' + Math.abs(z.b - z.a)) + '.' },
        { html: t(A('-' + z.a) + '-' + A(z.b)), why: t(A('-' + z.a) + '-' + A(z.b) + '=' + (z.a - z.b)) + '.' }, { html: t('-' + A('-' + z.a + '-' + z.b)), why: 'A negative sign outside the bars makes it negative: ' + t('-' + (z.a + z.b)) + '.' }],
        'The values: ' + t(A('-' + z.a) + '+' + A('-' + z.b) + '=' + (z.a + z.b)) + ', ' + t(A('-' + z.a + '+' + z.b) + '=' + Math.abs(z.b - z.a)) + ', ' + t(A('-' + z.a) + '-' + A(z.b) + '=' + (z.a - z.b)) + ', ' + t('-' + A('-' + z.a + '-' + z.b) + '=' + (-z.a - z.b)) + '.', ['Evaluate each one.'], 'greatest value');
    } }] },
    { num: '9', parts: [{ id: 'e9', level: 'PRG', make: function (r) {
      var z = pickWhere(function () { return { a: -r.int(11, 95) / 10, b: r.int(1, 60) / 10 * (r.chance(0.3) ? -1 : 1) }; }, function (s) { var v = Math.round((Math.abs(s.a - s.b) + Math.abs(s.a)) * 10) / 10; return String(v).length <= 4 && !(Math.abs(s.a + 4.5) < 1e-9 && Math.abs(s.b - 1.3) < 1e-9) && Math.abs(s.b) > 0; });
      var v = Math.round((Math.abs(z.a - z.b) + Math.abs(z.a)) * 10) / 10, d = Math.round(Math.abs(z.a - z.b) * 10) / 10;
      return KP.nr('<b>Numerical response.</b> If ' + t('a=' + dt(z.a)) + ' and ' + t('b=' + dt(z.b)) + ', the value of ' + t('|a-b|+|a|') + ' is ______.', v,
        function (x) { if (Math.abs(x - Math.round((Math.abs(z.a - z.b) - Math.abs(z.a)) * 10) / 10) < 1e-9) return { code: CP + 'abs-minus', hint: t('|a|') + ' is added.' }; return null; },
        t(A(dt(z.a) + '-' + pnd(z.b)) + '+' + A(dt(z.a)) + '=' + dt(d) + '+' + dt(-z.a) + '=' + dt(v)) + '.', ['Substitute in brackets, then evaluate each absolute value.'], 'evaluating (numerical response)');
    } }] },
    { num: '10', section: 'C. Stretch', parts: [{ id: 'e10', level: 'ADV', make: function (r) {
      var h = pickWhere(function () { return nz(r, 1, 9); }, function (x) { return x !== 2; }), e = 'x' + sgT(-h);
      var c1 = U.setChk('\\{x\\mid x\\ge ' + h + '\\}', { wrong: [{ is: '\\{x\\mid x\\le ' + h + '\\}', code: CP + 'ineq-dir', hint: t('|' + e + '|=' + e) + ' when ' + t(e + '\\ge 0') + '.' }, { is: '\\{x\\mid x>' + h + '\\}', code: CP + 'ineq-strict', hint: 'At ' + t('x=' + h) + ' both sides are ' + t(0) + ', so include it.' }], tag: false });
      var c2 = U.setChk('\\{x\\mid x\\le ' + h + '\\}', { wrong: [{ is: '\\{x\\mid x\\ge ' + h + '\\}', code: CP + 'ineq-dir', hint: t('|' + e + '|=-(' + e + ')') + ' when ' + t(e + '\\le 0') + '.' }, { is: '\\{x\\mid x<' + h + '\\}', code: CP + 'ineq-strict', hint: 'At ' + t('x=' + h) + ' both sides are ' + t(0) + ', so include it.' }], tag: false });
      var other = rt(h) + '-x';
      return U.fields('For which values of ' + t('x') + ' is ' + t('|' + e + '|=' + e) + '? For which values is ' + t('|' + e + '|=' + other) + '? Answer with inequalities.', [{ label: t('|' + e + '|=' + e) + ' when', name: 'first', mode: 'math', keys: 'set', vars: ['x'] }, { label: t('|' + e + '|=' + other) + ' when', name: 'second', mode: 'math', keys: 'set', vars: ['x'] }], [c1, c2], ['x\\ge ' + h, 'x\\le ' + h], t('x\\ge ' + h) + '; ' + t('x\\le ' + h),
        t('|' + e + '|=' + e) + ' when ' + t(e + '\\ge 0') + ': ' + t('x\\ge ' + h) + '.<br>' + t('|' + e + '|=-(' + e + ')=' + other) + ' when ' + t(e + '\\le 0') + ': ' + t('x\\le ' + h) + '. (At ' + t('x=' + h) + ' both are ' + t(0) + '.)', ['Use the definition: ' + t('|A|=A') + ' when ' + t('A\\ge 0') + ', and ' + t('|A|=-A') + ' when ' + t('A\\le 0') + '.'], 'when |x − h| equals x − h or h − x', [['x\\le ' + h, 'x\\ge ' + h]]);
    } }] },
    { num: '11', shared: function (r) { return pickWhere(function () { return { p: r.int(1, 8), q: -r.int(1, 6) }; }, function (s) { return !(s.p === 3 && s.q === -1); }); },
      stem: function (s) { return 'Simplify ' + t(A('x' + sgT(-s.p)) + '+' + A('x' + sgT(-s.q))) + ' without absolute value symbols when'; }, parts: ['hi', 'mid', 'lo'].map(function (iv, j) {
      return { id: 'e11' + 'abc'.charAt(j), level: 'MAS', make: function (r, s) {
        var p = s.p, q = s.q, E = { lo: P.add(M(-2, 1), M(p + q, 0)), mid: P.num(p - q), hi: P.add(M(2, 1), M(-p - q, 0)) }, target = E[iv];
        var ivT = { lo: 'x<' + q, mid: q + '\\le x\\le ' + p, hi: 'x>' + p }, wr = [];
        ['lo', 'mid', 'hi'].forEach(function (k2) { if (k2 !== iv) wr.push({ is: E[k2], code: CP + 'simp-case', hint: 'That is the simplified form on a different interval. For ' + t(ivT[iv]) + ', check the sign of each expression inside the bars.' }); });
        var e1 = 'x' + sgT(-p), e2 = 'x' + sgT(-q), s1 = iv === 'hi' ? '+' : '-', s2 = iv === 'lo' ? '-' : '+';
        if (iv === 'mid') wr.push({ is: P.add(M(2, 1), M(-p - q, 0)), code: CP + 'simp-sign', hint: 'For ' + t(ivT.mid) + ', ' + t(e1 + '\\le 0') + ', so ' + t(A(e1) + '=-(' + e1 + ')') + '.' });
        var sol = 'For ' + t(ivT[iv]) + ': ' + t(e1) + (s1 === '+' ? ' \\(>0\\)' : ' \\(\\le 0\\)') + ' and ' + t(e2) + (s2 === '+' ? ' \\(\\ge 0\\)' : ' \\(<0\\)') + '.<br>' + t((s1 === '+' ? '(' + e1 + ')' : '-(' + e1 + ')') + (s2 === '+' ? '+(' + e2 + ')' : '-(' + e2 + ')') + '=' + tx(target)) + (iv === 'mid' ? ' (the distance from ' + t(q) + ' to ' + t(p) + ').' : '.');
        return U.poly(t(ivT[iv]) + ':', target, wr, sol, ['On the interval, decide whether each expression inside the bars is positive or negative (test a value of ' + t('x') + ' in it).', 'Replace ' + t('|A|') + ' by ' + t('A') + ' if ' + t('A\\ge 0') + ' and by ' + t('-A') + ' if ' + t('A<0') + ', then collect like terms.'], 'simplifying on an interval');
      } };
    }) },
    { num: '12', parts: [{ id: 'e12', level: 'MAS', make: function (r) {
      var z = pickWhere(function () { return { m: r.int(3, 19) / 2, n: r.int(8, 25) / 2 }; }, function (s) { return s.n > s.m + 1 && (s.m % 1 || s.n % 1) && !(s.m === 2.5 && s.n === 7); });
      var b = z.n - z.m, other = -z.m - z.n;
      return U.fields('The numbers ' + t('a') + ' and ' + t('b') + ' satisfy ' + t('a<0<b') + ', ' + t('|a|=' + dt(z.m)) + ' and ' + t('|a-b|=' + dt(z.n)) + '. Determine ' + t('a') + ' and ' + t('b') + '.', [{ label: t('a='), name: 'a' }, { label: t('b='), name: 'b' }],
        [K.number(-z.m, function (v) { return v === z.m ? { code: CP + 'ab-a', hint: t('a<0') + ', so ' + t('a') + ' is the negative number with absolute value ' + t(dt(z.m)) + '.' } : null; }), K.number(b, function (v) { if (Math.abs(v - other) < 1e-9) return { code: CP + 'ab-other', hint: 'That number is ' + t(dt(z.n)) + ' units from ' + t('a') + ', but it is negative, and ' + t('b>0') + '.' }; if (Math.abs(v - z.n) < 1e-9) return { code: CP + 'simp-case', hint: t('|a-b|') + ' is the distance between ' + t('a') + ' and ' + t('b') + ', not ' + t('b') + ' itself.' }; if (Math.abs(v - (z.m + z.n)) < 1e-9) return { code: CP + 'ab-a', hint: 'Count ' + t(dt(z.n)) + ' units from ' + t('a=' + dt(-z.m)) + ', not from ' + t(dt(z.m)) + '.' }; return null; })],
        [dt(-z.m), dt(b)], t('a=' + dt(-z.m)) + ', ' + t('b=' + dt(b)),
        t('a<0') + ' and ' + t('|a|=' + dt(z.m)) + ', so ' + t('a=-' + dt(z.m)) + '.<br>' + t('b') + ' is ' + t(dt(z.n)) + ' units from ' + t('-' + dt(z.m)) + ': ' + t('b=' + dt(b)) + ' or ' + t('b=' + dt(other)) + '. Since ' + t('b>0') + ', ' + t('b=' + dt(b)) + '.',
        ['A negative number with absolute value ' + t(dt(z.m)) + ' is ' + t('-' + dt(z.m)) + '.', t('|a-b|') + ' is the distance between ' + t('a') + ' and ' + t('b') + '.'], 'a and b from absolute values', [[dt(z.m), dt(b)], [dt(-z.m), dt(other)]]);
    } }] },
    { num: '13', shared: function (r) { return pickWhere(function () { return { p: r.int(2, 9), q: r.int(2, 12) }; }, function (s) { return s.p !== s.q && !(s.p === 3 && s.q === 5); }); },
      stem: 'Is \\(|a+b|\\) ever greater than \\(|a|+|b|\\)?', parts: [
      { id: 'e13a', level: 'EMG', make: function (r, s) {
        var v1 = Math.abs(s.p - s.q), v2 = s.p + s.q;
        return U.fields('Test a pair with opposite signs: for ' + t('a=' + s.p) + ' and ' + t('b=-' + s.q) + ', evaluate ' + t('|a+b|') + ' and ' + t('|a|+|b|') + '.', [{ label: t('|a+b|='), name: '|a + b|' }, { label: t('|a|+|b|='), name: '|a| + |b|' }],
          [K.number(v1, function (v) { return v === s.p - s.q ? { code: CP + 'abs-bracket', hint: 'Take the absolute value of ' + t(s.p - s.q) + '.' } : v === v2 ? { code: CP + 'abs-split', hint: 'Add first, inside the bars: ' + t(s.p + '+(-' + s.q + ')=' + (s.p - s.q)) + '.' } : null; }), K.number(v2, function (v) { return v === s.p - s.q ? { code: CP + 'abs-bracket', hint: t(A('-' + s.q) + '=' + s.q) + '.' } : null; })],
          [String(v1), String(v2)], t(v1) + ' and ' + t(v2), t(A(s.p + '+(-' + s.q + ')') + '=' + A(s.p - s.q) + '=' + v1) + ' and ' + t(A(s.p) + '+' + A('-' + s.q) + '=' + v2) + ': the opposite signs partly cancel, so ' + t('|a+b|') + ' is smaller.', ['Inside ' + t('|a+b|') + ', add first.'], 'testing |a + b| and |a| + |b|', [[String(v2), String(v1)]]);
      } },
      { id: 'e13b', level: 'ADV', make: function (r) {
        return KP.mc(r, 'Testing pairs with both numbers positive, both negative and opposite signs shows that ' + t('|a+b|') + ' is never greater than ' + t('|a|+|b|') + '. When is ' + t('|a+b|=|a|+|b|') + '?', [{ html: 'When ' + t('a') + ' and ' + t('b') + ' have the same sign (or one of them is ' + t(0) + ')', right: true },
          { html: 'When ' + t('a') + ' and ' + t('b') + ' have opposite signs', why: 'Then they partly cancel: e.g. ' + t('|3+(-5)|=2<8') + '.' }, { html: 'Only when ' + t('a=b'), why: 'Try ' + t('a=2,\\ b=7') + ': ' + t('|9|=9=2+7') + '.' }, { html: 'Always', why: 'Not for opposite signs: ' + t('|3+(-5)|=2') + ' but ' + t('|3|+|-5|=8') + '.' }],
          'Both positive: ' + t('|3+5|=8=3+5') + '. Both negative: ' + t('|-3-5|=8=3+5') + '. Opposite signs: ' + t('|3+(-5)|=2<8') + '.<br>They are equal when ' + t('a') + ' and ' + t('b') + ' have the same sign (or one is ' + t(0) + '); otherwise ' + t('|a+b|') + ' is smaller.', ['Compare your results for the three kinds of pairs.'], 'when |a + b| = |a| + |b|');
      } }] }
  ];

  HW.defineLesson({ id: 'u7l1', unit: 7, num: '1', title: 'Absolute Value of Real Numbers', outcome: 'AN1', calc: true, questions: QUESTIONS, extra: EXTRA });
})(window);
