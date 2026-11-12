/* Math 20-1 · Unit 5 · Lesson 8 — The Discriminant (outcome RF5 on every part)
 * Assignment 8 (m201book unit5/u5_l08.tex, Questions 1–18) and the Lesson 8 Extra Practice (u5_ep08.tex, A1–A3, B1–B7,
 * C1–C4). Every part is a generator: the booklet question's idea, form and difficulty with new numbers (contexts vary a
 * little); the lesson's example equations and the booklet's own equations are left out. Calculator lesson; values of k
 * are exact (fractions where needed).
 * Uses the kit HW.p57 from u5l7.js (loaded first; the roots, number, MC and field builders and the 'p57' keypad), K.set
 * (js/relfn.js) for the values of a parameter (k < 25, k = 25, k ≤ 2 and k ≠ 0, −4 < k < 4; inequality, set or interval
 * notation, the 'set' keypad), K.poly for a discriminant in terms of k, and K.point for a vertex.
 * Recognised mistakes (codes u5l8-…): the sign of −4ac, a negative b squared without brackets, b instead of b², the 4
 * left out, a, b and c read before the equation is in standard form, the nature read the wrong way (0 → no roots, etc.),
 * the inequality not reversed when dividing by a negative, > for ≥ (or the reverse), k ≠ 0 left out when k is the x²
 * coefficient, only one value of k for equal roots, the equal root's sign, the greatest integer k equal to the boundary,
 * the vertex form read for intercepts the wrong way, D < 0 read as "reached once", the maximum at the wrong place.
 * Conversions: "nature of the roots" and "how many x-intercepts" → multiple choice (the discriminant with the conclusion;
 * distractors from real slips); "rational or irrational? if rational, solve" → boxes (discriminant, the word, the roots);
 * "show that" → the discriminant it shows (a number or an expression in k); "explain" → multiple choice of explanations;
 * "does it reach …?" → the discriminant and the number of times; numerical response → a 4-character box.
 * Levels: LIM BEG EMG PRG ADV MAS. Mastery: 9, 10(c), Extra C1, C2. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, B = K.P, ex = HW.ex, F = HW.fmt, P = HW.poly, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
  var Z = HW.p57;
  if (!Z) throw new Error('js/lessons/u5l8.js needs js/lessons/u5l7.js (HW.p57) loaded first');
  var LID = 'u5l8', CP = 'u5l8-', OUT = 'RF5';
  var gcd = Z.gcd, cl = Z.cl, same = Z.same, pickWhere = Z.pickWhere, nz = Z.nz, sgn = Z.sgn, nT = Z.nT, par = Z.par, isInt = Z.isInt, isSq = Z.isSq, frT = Z.frT, vT = Z.vT, polyT = Z.polyT, eqT = Z.eqT, qf = Z.qf, solF = Z.solF;

  var CODES = {
    'u5l8-4ac': 'Discriminant: sign error in −4ac', 'u5l8-bsq': 'Discriminant: squared a negative b without brackets', 'u5l8-bnosq': 'Discriminant: used b instead of b²', 'u5l8-no4': 'Discriminant: left out the 4',
    'u5l8-std': 'Read a, b, c before writing the equation in standard form', 'u5l8-nature': 'Nature of the roots read the wrong way from the discriminant', 'u5l8-count': 'Number of x-intercepts read the wrong way',
    'u5l8-vf': 'Vertex form: direction of opening or the vertex misread', 'u5l8-rat': 'Rational/irrational: perfect square misjudged', 'u5l8-flip': 'Inequality not reversed when dividing by a negative',
    'u5l8-dir': 'Inequality the wrong way (> and < swapped)', 'u5l8-strict': '> used for ≥ (or the reverse)', 'u5l8-k0': 'Left out k ≠ 0 (the equation must stay quadratic)', 'u5l8-k0-wrong': 'Excluded a value that isn’t needed',
    'u5l8-onek': 'Only one value of k for equal roots', 'u5l8-root-sign': 'Equal root: sign slip', 'u5l8-bound': 'Greatest integer: used the boundary itself', 'u5l8-ceil': 'Greatest integer: rounded up',
    'u5l8-times': 'Number of times a height is reached misread', 'u5l8-max': 'Maximum: wrong value', 'u5l8-explain': 'Explanation: wrong reason', 'u5l8-kval': 'Value of k: not rational roots / zero root', 'u5l8-poly': 'Discriminant expression: slip',
    'u5l8-which': 'Picked the wrong equation', 'u5l8-k2': 'k² inequality: wrong interval', 'u5l8-no4k': 'Used b² − ac', 'u5l8-vertex': 'Vertex: wrong point', 'u5l8-c': 'Wrong c'
  };
  HW.addCodes(CODES);
  HW.addPartial({ 'u5l8-4ac': 'b', 'u5l8-bsq': 's', 'u5l8-bnosq': 'b', 'u5l8-no4': 'b', 'u5l8-std': 'b', 'u5l8-flip': 'b', 'u5l8-dir': 'b', 'u5l8-strict': 's', 'u5l8-k0': 's', 'u5l8-k0-wrong': 's', 'u5l8-onek': 's', 'u5l8-root-sign': 's', 'u5l8-bound': 's', 'u5l8-ceil': 's', 'u5l8-times': 'b', 'u5l8-max': 'b', 'u5l8-poly': 'b', 'u5l8-vertex': 's', 'u5l8-c': 'b' });

  /* the lesson's examples and the booklet's own equations */
  var AV = Z.avoid([[1, -4, 3], [1, -4, 4], [1, -4, 7], [3, -5, -2], [4, -20, 25], [2, 3, 4], [2, -7, 3], [-3, 2, -1], [0.25, -3, 9], [3, 12, 13], [6, 7, -20], [2, 5, -4], [9, 30, 25], [1, 6, 9], [1, -6, 9], [2, -6, 4.5],
    [1, 3, 8], [4, -12, 9], [2, -5, -3], [-3, -1, 5], [1, -7, 10], [9, 6, 1], [3, -2, 5], [1, 4, -6], [2, -6, 5], [16, -24, 9], [1, -10, 25], [-2, 3, 7], [3, -1, 2], [-4, 16, -13], [12, -1, -6], [3, 4, -5], [8, -10, 3],
    [1, 2, 5], [4, -4, 1], [3, -1, -2], [1, 0, 9], [1, 10, 25], [1, -10, 25], [4, 4, 1], [4, -4, 1], [9, -12, 4], [-4.9, 14, -11.5], [-4.9, 14, -9.5], [1, -20, 100], [1, -20, 110], [2, -8, 8], [-5, 20, -24], [-5, 20, -15],
    [1, 5, 7], [25, -10, 1], [2, 1, -10], [1, -2, -4], [3, -4, 2], [1, -4, -7], [-1, 6, -9], [4, 3, -2], [6, 1, -12], [5, -3, -1], [4, -2, -3], [-5, 30, -48], [9, 12, 4], [9, -12, 4], [1, -10, 30]]);
  function D(a, b, c) { return cl(b * b - 4 * a * c); }
  function rel(d) { return d > 0 ? '>0' : d < 0 ? '<0' : ''; }
  function inside(a, b, c) { var f = cl(-4 * a * c); return (b ? nT(b * b) : '0') + (f ? (f > 0 ? '+' + nT(f) : '-' + nT(-f)) : ''); }
  function dSol(a, b, c) { var d = D(a, b, c); return t('b^{2}-4ac=' + par(b) + '^{2}-4(' + nT(a) + ')(' + nT(c) + ')=' + inside(a, b, c) + (inside(a, b, c) === nT(d) ? '' : '=' + nT(d))); }
  function natT(d, kind) {
    if (kind === 'xint') return d > 0 ? '<b>two</b> ' + t('x') + '-intercepts' : d === 0 ? '<b>one</b> ' + t('x') + '-intercept' : '<b>no</b> ' + t('x') + '-intercepts';
    return d > 0 ? '<b>two distinct</b> real roots' : d === 0 ? '<b>two equal</b> real roots' : '<b>no</b> real roots';
  }
  function dCands(a, b, c, extra) {
    var d = D(a, b, c), out = [];
    if (a * c) out.push([cl(b * b + 4 * a * c), CP + '4ac', 'Check the sign of ' + t('-4ac') + ': ' + t('-4(' + nT(a) + ')(' + nT(c) + ')=' + nT(-4 * a * c)) + '.']);
    if (b < 0) out.push([cl(-b * b - 4 * a * c), CP + 'bsq', 'Square ' + t('b') + ' with brackets: ' + t('(' + nT(b) + ')^{2}=' + nT(b * b)) + '.']);
    if (b && Math.abs(b) !== 1 && b * b !== Math.abs(b)) out.push([cl(b - 4 * a * c), CP + 'bnosq', 'The discriminant uses ' + t('b^{2}') + ', not ' + t('b') + '.']);
    if (a * c) out.push([cl(b * b - a * c), CP + 'no4', 'The discriminant is ' + t('b^{2}-4ac') + ': multiply ' + t('ac') + ' by 4.']);
    return out.concat(extra || []).filter(function (x) { return !same(x[0], d); });
  }
  /* the discriminant as a number */
  function dPart(prompt, a, b, c, o) {
    o = o || {}; var d = D(a, b, c);
    return Z.num(CP, prompt, d, { cands: dCands(a, b, c, o.cands), sol: (o.pre ? o.pre + '<br>' : '') + dSol(a, b, c) + (o.post ? '<br>' + o.post : ''), hints: o.hints || [(o.pre ? 'Write the equation in standard form first. ' : '') + 'Read ' + t('a') + ', ' + t('b') + ', ' + t('c') + ' with their signs and work out ' + t('b^{2}-4ac') + '.'], text: o.text, math: o.math });
  }
  /* the nature of the roots (or the number of x-intercepts): multiple choice */
  function natMC(r, prompt, a, b, c, o) {
    o = o || {}; var kind = o.kind || 'roots', d = D(a, b, c), lab = function (v) { return t('b^{2}-4ac=' + nT(v) + rel(v)); };
    var opts = [{ html: lab(d) + ': ' + natT(d, kind), right: true }];
    [1, 0, -1].filter(function (s) { return s !== Math.sign(d); }).forEach(function (s) { opts.push({ html: lab(d) + ': ' + natT(s, kind), why: d > 0 ? 'A positive discriminant gives two different values from the ' + t('\\pm') + '.' : d === 0 ? 'A zero discriminant: ' + t('\\pm\\sqrt{0}') + ' gives the same value twice.' : 'A negative discriminant has no real square root.', code: CP + (kind === 'xint' ? 'count' : 'nature') }); });
    var sl = (o.slips || []).concat(dCands(a, b, c)).filter(function (x) { return Math.sign(x[0]) !== Math.sign(d); })[0];
    if (sl) opts.push({ html: lab(sl[0]) + ': ' + natT(Math.sign(sl[0]), kind), why: sl[2], code: sl[1] });
    else { var s2 = dCands(a, b, c)[0]; if (s2) opts.push({ html: lab(s2[0]) + ': ' + natT(Math.sign(s2[0]), kind), why: s2[2], code: s2[1] }); }
    var p = Z.mc(r, prompt, opts.slice(0, 4), (o.pre ? o.pre + '<br>' : '') + dSol(a, b, c) + (d ? (d > 0 ? ' > 0' : ' < 0') : '') + ': ' + natT(d, kind) + (kind === 'xint' && d === 0 ? ' (the vertex is on the ' + t('x') + '-axis)' : '') + '.' + (o.post ? '<br>' + o.post : ''),
      [(o.pre ? 'Write the equation in standard form first. ' : '') + 'Work out ' + t('b^{2}-4ac') + ': positive → two, zero → one (equal), negative → none.'], o.text);
    return p;
  }
  /* number of x-intercepts from vertex form, with the reason */
  function vfMC(r, prompt, a, p, q) {
    var n = q === 0 ? 1 : (a > 0) === (q < 0) ? 2 : 0, up = a > 0, V = t('(' + nT(p) + ',\\ ' + nT(q) + ')'), pos = q === 0 ? 'on' : q > 0 ? 'above' : 'below';
    var lab = function (k) { return '<b>' + (k === 0 ? 'None' : k === 1 ? 'One' : 'Two') + '</b>: '; };
    var opts = [{ html: lab(n) + 'it opens ' + (up ? 'up' : 'down') + ' and its vertex ' + V + ' is ' + pos + ' the ' + t('x') + '-axis.', right: true },
      { html: lab(n === 2 ? 0 : 2) + 'it opens ' + (up ? 'down' : 'up') + ' and its vertex ' + V + ' is ' + pos + ' the ' + t('x') + '-axis.', why: t('a=' + nT(a)) + ' is ' + (up ? 'positive: it opens up.' : 'negative: it opens down.'), code: CP + 'vf' },
      { html: lab(n === 2 ? 0 : 2) + 'it opens ' + (up ? 'up' : 'down') + ' and its vertex ' + t('(' + nT(p) + ',\\ ' + nT(-q) + ')') + ' is ' + (pos === 'above' ? 'below' : 'above') + ' the ' + t('x') + '-axis.', why: 'The vertex of ' + t('a(x-p)^{2}+q') + ' is ' + t('(p,\\ q)') + ' = ' + V + '.', code: CP + 'vf' },
      { html: lab(1) + 'the vertex is on the ' + t('x') + '-axis.', why: 'The vertex is on the axis only when ' + t('q=0') + '.', code: CP + 'vf' }];
    var g = [a, -2 * a * p, a * p * p + q];
    return Z.mc(r, prompt, opts, 'It opens ' + (up ? 'up' : 'down') + ' (' + t('a=' + nT(a)) + ') and the vertex ' + V + ' is ' + pos + ' the ' + t('x') + '-axis: ' + (n === 2 ? 'two' : n === 1 ? 'one' : 'no') + ' ' + t('x') + '-intercept' + (n === 1 ? '' : 's') + '.<br>Check: ' + t('y=' + polyT(g)) + ', ' + dSol(g[0], g[1], g[2]) + ' ' + (n === 2 ? '> 0' : n === 0 ? '< 0' : '') + ' ✓', ['Picture the vertex and the direction of opening.'], 'x-intercepts from vertex form');
  }

  /* values of a parameter as a set */
  function fixFrac(s) { return String(s == null ? '' : s).replace(/\\([dt]?frac)(\d)(\d)/g, '\\frac{$2}{$3}').replace(/\\([dt]?frac)(\{[^{}]*\})(\d)/g, '\\frac$2{$3}').replace(/\\([dt]?frac)(\d)(\{)/g, '\\frac{$2}$3'); }
  function setChk(tex, v, wr) { var c = K.set(tex, { v: v, wrong: wr || [] }); return function (resp) { return c(fixFrac(resp)); }; }
  function fSet(label, tex, v, wr) { return { label: label, mode: 'math', keys: 'set', vars: [v], chk: setChk(tex, v, wr), key: tex, placeholder: 'e.g. ' + v + ' < 4' }; }
  function cx(n, v) { return n === 1 ? v : n === -1 ? '-' + v : nT(n) + v; }
  function sx(n, v) { return (n < 0 ? '-' : '+') + cx(Math.abs(n), v); }
  function kT(x) { if (isInt(x)) return nT(x); for (var q = 2; q <= 200; q++) if (isInt(x * q)) return frT(Math.round(x * q), q); return nT(x); }
  function ineq(v, op, x) { return v + op + kT(x); }
  var LT = '<', GT = '>', LE = '\\le ', GE = '\\ge ';
  function flipOp(op) { return op === LT ? GT : op === GT ? LT : op === LE ? GE : LE; }
  function looseOp(op) { return op === LT ? LE : op === GT ? GE : op === LE ? LT : GT; }
  function setPart(prompt, tex, v, wr, sol, hints, text) {
    var p = B.math(prompt, setChk(tex, v, wr), tex, sol, hints, text, { keys: 'set', vars: [v], placeholder: 'e.g. ' + v + ' < 4' });
    p.outcome = OUT; p.bad = (wr || []).map(function (w) { return w.is; }); return p;
  }
  /* the three cases for a constant k: ax² + bx + k = 0 (or m k) — threshold K, the inequality for two distinct roots */
  function threeK(prompt, a, b, m, v, o) {
    o = o || {}; v = v || 'k'; m = m || 1;
    var Kv = b * b / (4 * a * m), pos = a * m > 0, two = pos ? LT : GT, none = flipOp(two), dT = t(nT(b * b) + (pos ? '-' : '+') + (Math.abs(4 * a * m) === 1 ? '' : nT(Math.abs(4 * a * m))) + v);
    var flipW = function (op) { return [{ is: ineq(v, flipOp(op), Kv), code: CP + (pos ? 'dir' : 'flip'), hint: pos ? 'Two distinct real roots need ' + dT + t('>0') + '. Solve for ' + t(v) + ' carefully.' : 'You divided by a negative number: reverse the inequality sign.' }, { is: ineq(v, looseOp(op), Kv), code: CP + 'strict', hint: 'At ' + t(v + '=' + kT(Kv)) + ' the roots are equal, so that value is not included.' }]; };
    var sol = t('b^{2}-4ac=' + nT(b * b) + '-4(' + nT(a) + ')(' + (m === 1 ? v : nT(m) + v) + ')=') + dT + '<br>' +
      '(i) ' + dT + t('>0') + ': ' + t(ineq(v, two, Kv)) + (pos ? '' : ' (divide by a negative: reverse the sign)') + ' &nbsp; (ii) ' + dT + t('=0') + ': ' + t(v + '=' + kT(Kv)) + ' &nbsp; (iii) ' + dT + t('<0') + ': ' + t(ineq(v, none, Kv));
    return Z.fields(prompt, [fSet('(i) two distinct real roots:', ineq(v, two, Kv), v, flipW(two)), fSet('(ii) two equal real roots:', v + '=' + kT(Kv), v, [{ is: v + '=' + kT(-Kv), code: CP + 'flip', hint: 'Check the sign when you solve ' + dT + t('=0') + '.' }]), fSet('(iii) no real roots:', ineq(v, none, Kv), v, flipW(none))],
      { sol: sol, hints: ['Write the discriminant in terms of ' + t(v) + ', then use ' + t('>0') + ', ' + t('=0') + ' and ' + t('<0') + '.', 'Dividing both sides of an inequality by a negative number reverses the sign.'], text: o.text || 'values of k: three cases', bad: [[ineq(v, none, Kv), v + '=' + kT(Kv), ineq(v, two, Kv)]] });
  }

  /* ---- generators ---- */
  function natGen(r, sign, o) {
    o = o || {};
    return pickWhere(function () {
      if (sign === 0) { var s = r.int(1, 5), u = nz(r, -9, 9); return [s * s, 2 * s * u, u * u]; }
      return [r.pick(o.a || [1, 1, 2, 3, 4, 5]), nz(r, -9, 9), nz(r, -12, 12)];
    }, function (q) { var d = D(q[0], q[1], q[2]); return Math.sign(d) === sign && gcd(gcd(q[0], q[1]), q[2]) === 1 && AV(q[0], q[1], q[2]) && (!o.test || o.test(q, d)); });
  }

  var QUESTIONS = [
    { num: '1', stem: 'Determine the value of the discriminant.', parts: [
      { id: '1a', level: 'BEG', make: function (r) { var q = natGen(r, -1, { a: [1] }); return dPart('' + t(eqT(q[0], q[1], q[2])), q[0], q[1], q[2], { text: 'discriminant: negative' }); } },
      { id: '1b', level: 'BEG', make: function (r) { var q = natGen(r, 0); return dPart('' + t(eqT(q[0], q[1], q[2])), q[0], q[1], q[2], { text: 'discriminant: zero' }); } },
      { id: '1c', level: 'BEG', make: function (r) { var q = natGen(r, 1, { a: [2, 3, 4, 5], test: function (q, d) { return q[2] < 0 && isSq(d); } }); return dPart('' + t(eqT(q[0], q[1], q[2])), q[0], q[1], q[2], { text: 'discriminant: c negative' }); } },
      { id: '1d', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { A: r.int(2, 6), Bc: nz(r, -6, 6), C: r.int(1, 9) }; }, function (o) { return !(o.A === 3 && o.Bc === 1 && o.C === 5) && AV(-o.A, -o.Bc, o.C); });
        var a = -o.A, b = -o.Bc, c = o.C;
        return dPart('' + t(o.C + '-' + o.A + 'x^{2}=' + polyT([o.Bc, 0])), a, b, c, { pre: 'Standard form: ' + t(eqT(a, b, c)), cands: [[o.A * o.A - 4 * o.C * o.Bc, CP + 'std', 'Write the equation in standard form first, ' + t(eqT(a, b, c)) + ', then read ' + t('a') + ', ' + t('b') + ' and ' + t('c') + '.'], [4 * o.A * o.C, CP + 'std', 'The ' + t(polyT([o.Bc, 0])) + ' moves to the left side too: ' + t(eqT(a, b, c)) + '.']], text: 'discriminant: rearrange first' });
      } }] },
    { num: '2', stem: 'Determine the nature of the roots without solving.', parts: [
      { id: '2a', level: 'BEG', make: function (r) { var q = natGen(r, 1, { a: [1], test: function (q, d) { return isSq(d); } }); return natMC(r, '' + t(eqT(q[0], q[1], q[2])), q[0], q[1], q[2], { text: 'nature: two distinct' }); } },
      { id: '2b', level: 'BEG', make: function (r) { var q = natGen(r, 0, { test: function (q) { return q[0] > 1; } }); return natMC(r, '' + t(eqT(q[0], q[1], q[2])), q[0], q[1], q[2], { text: 'nature: equal roots' }); } },
      { id: '2c', level: 'BEG', make: function (r) { var q = natGen(r, -1, { a: [2, 3, 4, 5] }); return natMC(r, '' + t(eqT(q[0], q[1], q[2])), q[0], q[1], q[2], { text: 'nature: no real roots' }); } },
      { id: '2d', level: 'BEG', make: function (r) { var q = natGen(r, 1, { a: [1], test: function (q, d) { return q[2] < 0 && !isSq(d); } }); return natMC(r, '' + t(eqT(q[0], q[1], q[2])), q[0], q[1], q[2], { text: 'nature: two distinct (irrational)' }); } },
      { id: '2e', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { m: r.int(2, 4), p: r.int(1, 5), c: r.int(1, 9) }; }, function (o) { var a = o.m, b = -o.m * o.p, c = o.c; return D(a, b, c) < 0 && !(o.m === 2 && o.p === 3 && o.c === 5) && gcd(gcd(a, b), c) === 1; });
        var a = o.m, b = -o.m * o.p, c = o.c;
        return natMC(r, '' + t(o.m + 'x(x-' + o.p + ')=-' + o.c), a, b, c, { pre: 'Standard form: ' + t(eqT(a, b, c)), slips: [[D(a, b, 0), CP + 'std', 'Move the ' + t('-' + o.c) + ' to the left side first: ' + t(eqT(a, b, c)) + '.'], [D(a, b, -c), CP + 'std', 'When ' + t('-' + o.c) + ' moves to the left side it becomes ' + t('+' + o.c) + '.']], text: 'nature: rearrange first' });
      } },
      { id: '2f', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { s: r.int(2, 7), u: r.int(1, 9) }; }, function (o) { return gcd(o.s, o.u) === 1 && !(o.s === 4 && o.u === 3); });
        var a = o.s * o.s, b = -2 * o.s * o.u, c = o.u * o.u;
        return natMC(r, '' + t(a + 'x^{2}=' + polyT([-b, -c])), a, b, c, { pre: 'Standard form: ' + t(eqT(a, b, c)), slips: [[D(a, -b, -c), CP + 'std', 'Move every term to the left side, changing their signs: ' + t(eqT(a, b, c)) + '.']], text: 'nature: rearrange, equal roots' });
      } }] },
    { num: '3', stem: 'How many ' + t('x') + '-intercepts does the graph of each function have?', parts: [
      { id: '3a', level: 'BEG', make: function (r) { var q = natGen(r, 0, { test: function (q) { return q[0] === 1; } }); return natMC(r, '' + t('y=' + polyT(q)), q[0], q[1], q[2], { kind: 'xint', text: 'x-intercepts: one' }); } },
      { id: '3b', level: 'EMG', make: function (r) { var q = pickWhere(function () { return [-r.int(1, 4), nz(r, -9, 9), r.int(1, 12)]; }, function (q) { return AV(q[0], q[1], q[2]) && gcd(gcd(q[0], q[1]), q[2]) === 1; }); return natMC(r, '' + t('y=' + polyT(q)), q[0], q[1], q[2], { kind: 'xint', text: 'x-intercepts: a < 0' }); } },
      { id: '3c', level: 'BEG', make: function (r) { var q = natGen(r, -1, { a: [2, 3, 4, 5] }); return natMC(r, '' + t('y=' + polyT(q)), q[0], q[1], q[2], { kind: 'xint', text: 'x-intercepts: none' }); } },
      { id: '3d', level: 'EMG', make: function (r) { var o = pickWhere(function () { return { a: r.pick([-4, -3, -2, 2, 3, 4]), p: nz(r, -5, 5), q: r.pick([-6, -5, -3, -2, -1, 1, 2, 3, 5, 6]) }; }, function (o) { return !(o.a === -4 && o.p === 2 && o.q === 3) && !(o.a === 3 && o.p === -2 && o.q === 1) && !(o.a === -2 && o.p === 3 && o.q === -1); }); return vfMC(r, '' + t('y=' + nT(o.a) + '(' + polyT([1, -o.p]) + ')^{2}' + (o.q > 0 ? '+' : '') + o.q), o.a, o.p, o.q); } }] },
    { num: '4', stem: 'Use the discriminant to decide whether the roots are rational or irrational. If they are rational, solve by factoring.', parts: [
      { id: '4a', level: 'EMG', make: function (r) { return ratPart(r, '', true, 'a'); } },
      { id: '4b', level: 'EMG', make: function (r) { return ratPart(r, '', false); } },
      { id: '4c', level: 'PRG', make: function (r) { return ratPart(r, '', true, 'c'); } }] },
    { num: '5', shared: function (r) { return pickWhere(function () { return { m: r.int(3, 9) * sgn(r) }; }, function (o) { return Math.abs(o.m) !== 5; }); }, stem: function (o) { return 'Consider ' + t('x^{2}' + (o.m < 0 ? '+' : '-') + Math.abs(2 * o.m) + 'x+k=0') + '.'; }, parts: [
      { id: '5a', level: 'PRG', make: function (r, o) { return threeK('For what values of ' + t('k') + ' does it have (i) two distinct real roots, (ii) two equal real roots, (iii) no real roots?', 1, -2 * o.m, 1, 'k'); } },
      { id: '5b', level: 'ADV', make: function (r, o) {
        var m = o.m, b = -2 * m, key = m * m - 1;
        var chk = function (resp) {
          var a = K.read(String(resp == null ? '' : resp).replace(/^\s*k\s*=\s*/, '')); if (a.res) return a.res;
          if (!isInt(a.val)) return form(CP + 'kint', 'Give an <b>integer</b> value of ' + t('k') + '.');
          var k = Math.round(a.val), d = b * b - 4 * k;
          if (k === 0) return wrong(CP + 'kval', 'With ' + t('k=0') + ' one root is ' + t('0') + ': ' + t('x(x' + (b < 0 ? '-' : '+') + Math.abs(b) + ')=0') + '. The roots must not be zero.');
          if (d < 0) return wrong(CP + 'kval', 'With ' + t('k=' + k) + ', ' + t('b^{2}-4ac=' + d) + ' is negative: no real roots.');
          if (!isSq(d)) return wrong(CP + 'kval', 'With ' + t('k=' + k) + ', ' + t('b^{2}-4ac=' + d) + ' is not a perfect square, so the roots are irrational.');
          return ok();
        };
        var p = B.math('Give an integer value of ' + t('k') + ' for which the roots are rational and not zero.', chk, String(key),
          'The discriminant ' + t(b * b + '-4k') + ' must be a perfect square, and ' + t('k\\ne 0') + '. For example ' + t('k=' + key) + ': ' + t(b * b + '-' + 4 * key + '=4=2^{2}') + ', and ' + t(polyT([1, b, key]) + '=' + HW.factor.tex([polyT([1, -(m - 1)]), polyT([1, -(m + 1)])])) + ', roots ' + t(m - 1) + ' and ' + t(m + 1) + '. (Also ' + t('k=' + (m * m - 4)) + ', ' + t(m * m - 9) + ', ' + t(m * m) + ', …)', ['Find ' + t('k') + ' so that ' + t(b * b + '-4k') + ' is a perfect square (try ' + t('4') + ', ' + t('16') + ', ' + t('36') + ', …).'], 'values of k: rational roots', { keys: 'p57', placeholder: 'e.g. k = 9' });
        p.outcome = OUT; p.bad = ['0', String(m * m + 1), String(m * m - 2)].filter(function (x) { var k = +x, d = b * b - 4 * k; return !(k !== 0 && d >= 0 && isSq(d)); }); p.good = [String(m * m - 4), String(m * m - 9)].filter(function (x) { return +x !== 0; }); return p;
      } }] },
    { num: '6', parts: [
      { id: '6', level: 'PRG', make: function (r) { var o = pickWhere(function () { return { a: -r.int(1, 4), b: nz(r, -8, 8) }; }, function (o) { return !(o.a === -2 && o.b === 4) && gcd(o.a, o.b) <= 2; }); return threeK('For what values of ' + t('k') + ' does ' + t(polyT([o.a, o.b, 0]) + '+k=0') + ' have (a) two distinct real roots, (b) two equal real roots, (c) no real roots?', o.a, o.b, 1, 'k', { text: 'values of k: a < 0' }); } }] },
    { num: '7', stem: 'Each equation has two equal real roots. Determine every possible value of ' + t('k') + ', and the root for each value.', parts: [
      { id: '7a', level: 'PRG', make: function (r) { var o = pickWhere(function () { return { a: r.pick([1, 1, 4, 9]), c: r.pick([4, 9, 16, 36, 49, 64, 81]) }; }, function (o) { return gcd(o.a, o.c) === 1; }); return eqKb(r, '', o.a, o.c, 1); } },
      { id: '7b', level: 'PRG', make: function (r) { var o = pickWhere(function () { return { a: r.pick([9, 16, 25, 36]), c: r.pick([1, 4, 9]) }; }, function (o) { return gcd(o.a, o.c) === 1 && !(o.a === 4 && o.c === 1); }); return eqKb(r, '', o.a, o.c, -1); } },
      { id: '7c', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { var s = r.int(1, 5), b = -2 * r.int(2, 9); return { b: b, c: s * s }; }, function (o) { var k = o.b * o.b / (4 * o.c); return isInt(k) && !(o.b === -12 && o.c === 4) && k > 1 && gcd(k, gcd(o.b, o.c)) === 1; });
        var k = o.b * o.b / (4 * o.c), x = -o.b / (2 * k);
        return Z.fields('' + t('kx^{2}' + polyT([o.b, o.c]) + '=0'), [Z.fNum(CP, t('k='), k, { cands: [[-k, CP + 'flip', 'Solve ' + t(o.b * o.b + '-' + 4 * o.c + 'k=0') + ' carefully.'], [o.b * o.b / o.c, CP + 'no4', 'The discriminant is ' + t('b^{2}-4ac') + '.']] }), Z.fNum(CP, 'root ' + t('x='), x, { cands: [[-x, CP + 'root-sign', t('x=\\frac{-b}{2a}') + ': check the sign.']] })],
          { sol: t(o.b * o.b + '-4(k)(' + o.c + ')=0\\Rightarrow ' + o.b * o.b + '-' + 4 * o.c + 'k=0\\Rightarrow k=' + k) + '<br>' + t(polyT([k, o.b, o.c]) + '=' + HW.factor.tex([{ p: polyT([Math.sqrt(k), -Math.sqrt(o.c)]), k: 2 }]) + '=0') + ', so ' + t('x=' + frT(-o.b, 2 * k)) + '.', hints: ['Equal roots: ' + t('b^{2}-4ac=0') + '. Here ' + t('a=k') + '.', 'The equal root is ' + t('x=\\frac{-b}{2a}') + '.'], text: 'equal roots: k in a' });
      } }] },
    { num: '8', stem: 'For what values of ' + t('k') + ' does each equation have real roots?', parts: [
      { id: '8a', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { b: nz(r, -8, 8), c: nz(r, -6, 6) }; }, function (o) { return o.c > 0 && !(o.b === 4 && o.c === 2) && !(o.b === -10 && o.c === 5); });
        var Kv = o.b * o.b / (4 * o.c), tex = 'k' + LE + kT(Kv) + ',\\ k\\ne 0';
        return setPart('' + t('kx^{2}' + sx(o.b, 'x') + '+' + o.c + '=0'), tex, 'k', [{ is: 'k' + LE + kT(Kv), code: CP + 'k0', hint: 'If ' + t('k=0') + ' the equation isn’t quadratic: add ' + t('k\\ne 0') + '.' }, { is: 'k' + GE + kT(Kv) + ',\\ k\\ne 0', code: CP + 'dir', hint: 'Solve ' + t(o.b * o.b + '-' + 4 * o.c + 'k\\ge 0') + ': dividing by ' + t(-4 * o.c) + ' reverses the sign.' }, { is: 'k<' + kT(Kv) + ',\\ k\\ne 0', code: CP + 'strict', hint: '“Real roots” includes equal roots: use ' + t('\\ge 0') + '.' }],
          t('b^{2}-4ac=' + o.b * o.b + '-4(k)(' + o.c + ')=' + o.b * o.b + '-' + 4 * o.c + 'k\\ge 0\\Rightarrow k\\le ' + kT(Kv)) + ', and ' + t('k\\ne 0') + ' (otherwise it isn’t quadratic): ' + t(tex), ['Real roots: ' + t('b^{2}-4ac\\ge 0') + '. Here ' + t('a=k') + ', so it also needs ' + t('k\\ne 0') + '.'], 'real roots: k in a');
      } },
      { id: '8b', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(1, 5), b: nz(r, -12, 12), m: r.pick([2, 3, -2]) }; }, function (o) { return !(o.a === 3 && o.b === -12 && o.m === 2) && gcd(o.a, o.b) <= 3; });
        var Kv = o.b * o.b / (4 * o.a * o.m), op = o.a * o.m > 0 ? LE : GE, tex = 'k' + op + kT(Kv);
        return setPart('' + t(polyT([o.a, o.b, 0]) + (o.m > 0 ? '+' : '-') + Math.abs(o.m) + 'k=0'), tex, 'k', [{ is: 'k' + flipOp(op) + kT(Kv), code: CP + (o.m > 0 ? 'dir' : 'flip'), hint: o.m > 0 ? 'Check the direction: solve ' + t(o.b * o.b + '-' + 4 * o.a * o.m + 'k\\ge 0') + '.' : 'Dividing by a negative reverses the sign.' }, { is: 'k' + (op === LE ? LT : GT) + kT(Kv), code: CP + 'strict', hint: '“Real roots” includes equal roots: use ' + t('\\ge 0') + '.' }],
          t('b^{2}-4ac=' + o.b * o.b + '-4(' + o.a + ')(' + nT(o.m) + 'k)=' + o.b * o.b + (o.m > 0 ? '-' : '+') + Math.abs(4 * o.a * o.m) + 'k\\ge 0\\Rightarrow ' + tex), ['Real roots: ' + t('b^{2}-4ac\\ge 0') + '. Here ' + t('c=' + nT(o.m) + 'k') + '.'], 'real roots: k in c');
      } }] },
    { num: '9', parts: [
      { id: '9', level: 'MAS', make: function (r) {
        var o = pickWhere(function () { return { h: nz(r, -4, 4), b: nz(r, -8, 8), c: r.int(1, 6) }; }, function (o) { return !(o.h === 2 && o.b === 6 && o.c === 3) && gcd(o.b, o.c) <= 2; });
        var Mv = o.h + o.b * o.b / (4 * o.c), tex = 'm>' + kT(Mv);
        return setPart('For what values of ' + t('m') + ' does ' + t('(' + polyT([1, -o.h], 'm') + ')x^{2}' + sx(o.b, 'x') + '+' + o.c + '=0') + ' have no real roots?', tex, 'm', [{ is: 'm<' + kT(Mv), code: CP + 'flip', hint: 'Dividing by a negative number reverses the inequality sign.' }, { is: 'm>' + kT(o.b * o.b / (4 * o.c) - o.h), code: CP + 'flip', hint: 'Expand ' + t('-4(m' + (o.h > 0 ? '-' : '+') + Math.abs(o.h) + ')(' + o.c + ')') + ' carefully.' }, { is: 'm\\ge ' + kT(Mv), code: CP + 'strict', hint: 'No real roots: ' + t('b^{2}-4ac<0') + ' (strictly).' }],
          t(o.b * o.b + '-4(' + polyT([1, -o.h], 'm') + ')(' + o.c + ')=' + polyT([-4 * o.c, o.b * o.b + 4 * o.c * o.h], 'm') + '<0\\Rightarrow ' + tex) + '. (These values never make ' + t(polyT([1, -o.h], 'm') + '=0') + ', so the equation stays quadratic.)', ['No real roots: ' + t('b^{2}-4ac<0') + ' with ' + t('a=' + polyT([1, -o.h], 'm')) + '.'], 'no real roots: parameter in a');
      } }] },
    { num: '10', stem: 'Show that each equation has two distinct real roots for every real number ' + t('k') + '.', parts: [
      { id: '10a', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(1, 5), c: -r.int(1, 7), s: sgn(r) }; }, function (o) { return !(o.a === 2 && o.c === -1 && o.s === -1); });
        var T = P.parse('k^{2}+' + (-4 * o.a * o.c)), eq = polyT([o.a, 0, 0]) + (o.s > 0 ? '+' : '-') + 'kx' + '-' + Math.abs(o.c) + '=0';
        var p = B.math('' + t(eq) + ': write the discriminant in terms of ' + t('k') + '.', K.poly(T, { wrong: [{ is: P.parse('k^{2}-' + (-4 * o.a * o.c)), code: CP + '4ac', hint: 'Check the sign of ' + t('-4ac') + ' with ' + t('c=' + o.c) + '.' }, { is: P.parse('-k^{2}+' + (-4 * o.a * o.c)), code: CP + 'bsq', hint: t('(-k)^{2}=k^{2}') + '.' }] }), 'k^{2}+' + (-4 * o.a * o.c),
          t('b^{2}-4ac=(' + (o.s > 0 ? '' : '-') + 'k)^{2}-4(' + o.a + ')(' + o.c + ')=k^{2}+' + (-4 * o.a * o.c)) + '. Since ' + t('k^{2}\\ge 0') + ', ' + t('k^{2}+' + (-4 * o.a * o.c) + '\\ge ' + (-4 * o.a * o.c) + '>0') + ' for every ' + t('k') + ': always two distinct real roots.', ['Here ' + t('b=' + (o.s > 0 ? '' : '-') + 'k') + '. A square is never negative.'], 'show: discriminant in k', { keys: 'poly', vars: ['k'] });
        p.outcome = OUT; p.bad = ['k^{2}-' + (-4 * o.a * o.c), 'k^{2}']; return p;
      } },
      { id: '10b', level: 'ADV', make: function (r) { var s = r.int(2, 9); return dKexact(r, s, 'b'); } },
      { id: '10c', level: 'MAS', make: function (r) { var s = r.int(2, 9); return dKroots(r, s); } }] },
    { num: '11', parts: [
      { id: '11', level: 'ADV', make: function (r) {
        return Z.mc(r, 'Why does ' + t('ax^{2}+bx+c=0') + ' always have two distinct real roots when ' + t('a') + ' and ' + t('c') + ' have opposite signs?', [
          { html: t('ac<0') + ', so ' + t('-4ac>0') + '; since ' + t('b^{2}\\ge 0') + ', ' + t('b^{2}-4ac>0') + '.', right: true },
          { html: t('ac>0') + ', so ' + t('-4ac<0') + ', which makes the discriminant positive.', why: 'With opposite signs the product ' + t('ac') + ' is negative.', code: CP + 'explain' },
          { html: 'Because ' + t('b') + ' must then be positive, so ' + t('b^{2}-4ac>0') + '.', why: t('b') + ' can be any number; ' + t('b^{2}') + ' is never negative whatever its sign.', code: CP + 'explain' },
          { html: 'Because ' + t('b^{2}>4ac') + ' only when ' + t('a>0') + '.', why: 'The sign of ' + t('a') + ' alone doesn’t decide it: look at the sign of ' + t('-4ac') + '.', code: CP + 'explain' }],
          'If ' + t('a') + ' and ' + t('c') + ' have opposite signs, ' + t('ac<0') + ', so ' + t('-4ac>0') + '. Since ' + t('b^{2}\\ge 0') + ', ' + t('b^{2}-4ac>0') + ': two distinct real roots. (The parabola starts on one side of the ' + t('x') + '-axis at ' + t('(0,\\ c)') + ' and opens toward the other side.)', ['What is the sign of ' + t('ac') + '? Of ' + t('-4ac') + '?'], 'explain: opposite signs');
      } }] },
    { num: '12', shared: function (r) {
        return pickWhere(function () { var v = r.int(10, 18), h0 = r.pick([0.5, 1, 1.5, 2]), top = h0 + v * v / 19.6; return { v: v, h0: h0, top: top, H1: Math.ceil(top) + r.int(0, 2), H2: Math.floor(top) - r.int(1, 3) }; }, function (o) { return !(o.v === 14 && o.h0 === 0.5) && o.H1 - o.top > 0.3 && o.H2 > o.h0 + 1 && o.top - o.H2 > 0.3; });
      }, stem: function (o) { return 'A soccer ball is kicked so that its height after ' + t('t') + ' seconds is ' + t('h=-4.9t^{2}+' + o.v + 't+' + nT(o.h0)) + ' metres. Use the discriminant to decide whether it reaches each height.'; }, parts: [
      { id: '12a', level: 'PRG', make: function (r, o) { return reach(o, o.H1, ''); } },
      { id: '12b', level: 'PRG', make: function (r, o) { return reach(o, o.H2, ''); } }] },
    { num: '13', shared: function (r) {
        return pickWhere(function () { var m = r.pick([10, 20, 25, 40, 50]), x0 = r.int(4, 15), R = 100 * r.int(30, 90); return { m: m, x0: x0, R: R, c: R - m * x0 * x0, d: 100 * r.int(1, 4) }; }, function (o) { return o.c > 500 && o.c % 100 === 0 && !(o.m === 20 && o.x0 === 10 && o.R === 5000); });
      }, stem: function (o) { return 'A theatre’s ticket revenue, in dollars, is ' + t('R=-' + o.m + 'x^{2}+' + 2 * o.m * o.x0 + 'x+' + o.c) + ', where ' + t('x') + ' is the number of \\$1 price increases.'; }, parts: [
      { id: '13a', level: 'PRG', make: function (r, o) {
        var b = 2 * o.m * o.x0, c2 = o.c - o.R;
        return Z.fields('Can the revenue be ' + t('\\$' + o.R) + '? Use the discriminant: how many values of ' + t('x') + ' give this revenue, and what are they?', [Z.fNum(CP, 'Number of values of ' + t('x') + ':', 1, { cands: [[2, CP + 'times', 'The discriminant is ' + t('0') + ': one value only.'], [0, CP + 'times', 'The discriminant is ' + t('0') + ', not negative.']] }), Z.fNum(CP, t('x='), o.x0, { cands: [[-o.x0, CP + 'root-sign', 'Check the sign: ' + t('x=\\frac{-b}{2a}') + '.']] })],
          { sol: t('-' + o.m + 'x^{2}+' + b + 'x+' + o.c + '=' + o.R + '\\Rightarrow -' + o.m + 'x^{2}+' + b + 'x-' + (-c2) + '=0\\Rightarrow ' + polyT([1, -2 * o.x0, o.x0 * o.x0]) + '=0') + ' (divide by ' + t(-o.m) + ').<br>' + t('b^{2}-4ac=' + 4 * o.x0 * o.x0 + '-' + 4 * o.x0 * o.x0 + '=0') + ': exactly one value, ' + t('x=' + o.x0) + '.', hints: ['Set ' + t('R=' + o.R) + ', write the equation in standard form (divide by a common factor), and find the discriminant.'], text: 'revenue: reached once' });
      } },
      { id: '13b', level: 'PRG', make: function (r, o) {
        var R2 = o.R + o.d, c2 = o.c - R2, Dd = (2 * o.x0) * (2 * o.x0) - 4 * (o.x0 * o.x0 + o.d / o.m);
        return Z.mc(r, 'Can the revenue be ' + t('\\$' + R2) + '?', [
          { html: '<b>No</b>: the discriminant is negative, so no value of ' + t('x') + ' gives this revenue.', right: true },
          { html: '<b>Yes</b>, twice: the discriminant is positive.', why: 'Work it out: ' + t(polyT([1, -2 * o.x0, o.x0 * o.x0 + o.d / o.m]) + '=0') + ' has ' + t('b^{2}-4ac=' + nT(Dd)) + '.', code: CP + 'times' },
          { html: '<b>Yes</b>, once: the discriminant is ' + t('0') + '.', why: 'The discriminant is ' + t(nT(Dd)) + ', not ' + t('0') + '.', code: CP + 'times' },
          { html: '<b>Yes</b>, with a price decrease (a negative ' + t('x') + ').', why: 'A negative ' + t('x') + ' would still have to solve the equation, and there are no real roots at all.', code: CP + 'times' }],
          t('-' + o.m + 'x^{2}+' + 2 * o.m * o.x0 + 'x+' + o.c + '=' + R2 + '\\Rightarrow ' + polyT([1, -2 * o.x0, o.x0 * o.x0 + o.d / o.m]) + '=0') + ': ' + t('b^{2}-4ac=' + 4 * o.x0 * o.x0 + '-' + nT(4 * (o.x0 * o.x0 + o.d / o.m)) + '=' + nT(Dd) + '<0') + '. No: the revenue can never be ' + t('\\$' + R2) + '.', ['Set ' + t('R=' + R2) + ' and look at the sign of the discriminant.'], 'revenue: never reached');
      } },
      { id: '13c', level: 'ADV', make: function (r, o) {
        return Z.mc(r, 'What does (a) tell you about the maximum revenue?', [
          { html: t('\\$' + o.R) + ' is reached exactly once, so it is the <b>maximum</b> revenue (at ' + o.x0 + ' price increases).', right: true },
          { html: t('\\$' + o.R) + ' is the <b>minimum</b> revenue.', why: 'The parabola opens down (' + t('a<0') + '), so the vertex is a maximum.', code: CP + 'max' },
          { html: 'The maximum is higher than ' + t('\\$' + o.R) + ', because the revenue reaches ' + t('\\$' + o.R) + ' on the way up and down.', why: 'Reached twice would need a positive discriminant; here it is 0, so ' + t('\\$' + o.R) + ' is the vertex.', code: CP + 'max' },
          { html: 'The maximum is at ' + t('x=0') + ' (no price increase).', why: 'The vertex is at ' + t('x=' + o.x0) + ', where the revenue is reached once.', code: CP + 'max' }],
          'A revenue that is reached for exactly one value of ' + t('x') + ' is at the vertex. The parabola opens down, so ' + t('\\$' + o.R) + ' is the maximum revenue, at ' + t('x=' + o.x0) + ' price increases.', ['Discriminant 0 means the value is reached only at the vertex.'], 'revenue: maximum from D = 0');
      } }] },
    { num: '14', parts: [
      { id: '14', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(1, 5) * sgn(r), p: nz(r, -5, 5) }; }, function (o) { return !(o.a === 2 && o.p === 2) && !(o.a === 3 && o.p === -2); });
        var a = o.a, b = -2 * a * o.p, c = a * o.p * o.p;
        return Z.fields('The vertex of the parabola ' + t('y=' + polyT([a, b, 0]) + '+c') + ' lies on the ' + t('x') + '-axis. Determine ' + t('c') + ' and the vertex.', [Z.fNum(CP, t('c='), c, { cands: [[-c, CP + 'c', 'Solve ' + t(b * b + '-' + nT(4 * a) + 'c=0') + ' carefully.'], [b * b / a, CP + 'no4', 'The discriminant is ' + t('b^{2}-4ac') + '.']] }),
          { label: 'Vertex:', mode: 'math', keys: 'p57', chk: K.point([o.p, 0], { wrong: [{ is: [-o.p, 0], code: CP + 'vertex', hint: t('x=-\\frac{b}{2a}') + ': check the sign.' }, { is: [0, c], code: CP + 'vertex', hint: 'That is the ' + t('y') + '-intercept. The vertex is on the ' + t('x') + '-axis.' }] }), key: '(' + o.p + ',0)', placeholder: 'e.g. (3, 0)' }],
          { sol: 'Vertex on the ' + t('x') + '-axis means one ' + t('x') + '-intercept: ' + t(b * b + '-4(' + nT(a) + ')c=0\\Rightarrow c=' + c) + '.<br>' + t('y=' + polyT([a, b, c]) + '=' + nT(a).replace(/^1$/, '').replace(/^-1$/, '-') + '(' + polyT([1, -o.p]) + ')^{2}') + '; vertex ' + t('(' + o.p + ',\\ 0)') + '.', hints: ['A vertex on the ' + t('x') + '-axis: exactly one ' + t('x') + '-intercept, so ' + t('b^{2}-4ac=0') + '.'], text: 'vertex on the x-axis: c' });
      } }] },
    { num: '15', parts: [
      { id: '15', level: 'EMG', make: function (r) {
        var A = natGen(r, -1, { a: [1] }), Bq = natGen(r, 0, { test: function (q) { return q[0] > 1; } }), C = natGen(r, 1, { a: [2, 3, 4], test: function (q, d) { return q[2] < 0; } }), s = r.int(2, 7);
        return Z.mc(r, 'Which equation has two distinct real roots?', [
          { html: t(eqT(C[0], C[1], C[2])), right: true },
          { html: t(eqT(A[0], A[1], A[2])), why: t('b^{2}-4ac=' + D(A[0], A[1], A[2]) + '<0') + ': no real roots.', code: CP + 'which' },
          { html: t(eqT(Bq[0], Bq[1], Bq[2])), why: t('b^{2}-4ac=0') + ': two equal roots.', code: CP + 'which' },
          { html: t('x^{2}+' + s * s + '=0'), why: t('b^{2}-4ac=0-' + 4 * s * s + '<0') + ': no real roots.', code: CP + 'which' }],
          t(eqT(C[0], C[1], C[2])) + ': ' + dSol(C[0], C[1], C[2]) + ' > 0.', ['Work out ' + t('b^{2}-4ac') + ' for each equation.'], 'MC: which has two distinct roots');
      } }] },
    { num: '16', parts: [
      { id: '16', level: 'PRG', make: function (r) {
        var s = r.pick([3, 4, 5, 6, 7]), c = s * s, two = 2 * s;
        return Z.mc(r, 'The equation ' + t('x^{2}+kx+' + c + '=0') + ' has no real roots when', [
          { html: t('-' + two + '<k<' + two), right: true },
          { html: t('k<' + two), why: 'Try ' + t('k=-' + (two + 1)) + ': ' + t('(' + -(two + 1) + ')^{2}-' + 4 * c + '>0') + '. Both ends are needed: ' + t('k^{2}<' + 4 * c) + '.', code: CP + 'k2' },
          { html: t('k<-' + two + '\\text{ or }k>' + two), why: 'That is the condition for two distinct real roots.', code: CP + 'k2' },
          { html: t('-' + s + '<k<' + s), why: 'The discriminant is ' + t('b^{2}-4ac') + ', not ' + t('b^{2}-ac') + '.', code: CP + 'no4k' }],
          t('k^{2}-4(1)(' + c + ')<0\\Rightarrow k^{2}<' + 4 * c + '\\Rightarrow -' + two + '<k<' + two), ['No real roots: ' + t('b^{2}-4ac<0') + ' with ' + t('b=k') + '. Which numbers have squares less than ' + t(4 * c) + '?'], 'MC: k² < number');
      } }] },
    { num: '17', parts: [
      { id: '17', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(2, 6), b: -r.int(4, 30) }; }, function (o) { var k = o.b * o.b / (4 * o.a); return isInt(k) && k > 0 && k < 1000 && !(o.a === 3 && o.b === -12) && gcd(o.a, o.b) > 1; });
        var k = o.b * o.b / (4 * o.a);
        return Z.nrInt('<i>Numerical response.</i> The equation ' + t(polyT([o.a, o.b, 0]) + '+k=0') + ' has two equal real roots when ' + t('k') + ' is ____.', k, { cands: [[o.b * o.b / o.a, CP + 'no4', 'The discriminant is ' + t('b^{2}-4ac') + '.'], [o.b * o.b / 2 / o.a, CP + 'no4', 'The discriminant is ' + t('b^{2}-4ac') + '.']], sol: t(o.b * o.b + '-4(' + o.a + ')k=0\\Rightarrow k=\\frac{' + o.b * o.b + '}{' + 4 * o.a + '}=' + k), hints: ['Equal roots: ' + t('b^{2}-4ac=0') + '.'], text: 'NR: k for equal roots' });
      } }] },
    { num: '18', parts: [
      { id: '18', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(1, 5), b: nz(r, -13, 13) }; }, function (o) { var K0 = o.b * o.b / (4 * o.a); return K0 > 1.2 && K0 < 99 && !(o.a === 2 && o.b === 7) && (!isInt(K0) || r.chance(0.3)); });
        var K0 = o.b * o.b / (4 * o.a), g = isInt(K0) ? Math.round(K0) - 1 : Math.floor(K0);
        var cands = isInt(K0) ? [[Math.round(K0), CP + 'bound', 'At ' + t('k=' + Math.round(K0)) + ' the discriminant is ' + t('0') + ': equal roots, not distinct.']] : [[Math.ceil(K0), CP + 'ceil', t('k<' + kT(K0)) + ': ' + t(Math.ceil(K0)) + ' is too big.']];
        return Z.nrInt('<i>Numerical response.</i> The greatest integer value of ' + t('k') + ' for which ' + t(polyT([o.a, o.b, 0]) + '+k=0') + ' has two distinct real roots is ____.', g, { cands: cands, sol: t(o.b * o.b + '-' + 4 * o.a + 'k>0\\Rightarrow k<\\frac{' + o.b * o.b + '}{' + 4 * o.a + '}' + (isInt(K0 * 1000) ? '=' + nT(K0) : '\\approx ' + Z.fx(K0, 3))) + (isInt(K0) ? ' (at ' + t('k=' + K0) + ' the roots are equal, so ' + t('k') + ' must be less)' : '') + '. The greatest integer is ' + t(g) + '.', hints: ['Two distinct real roots: ' + t('b^{2}-4ac>0') + ' (strictly).'], text: 'NR: greatest integer k' });
      } }] }
  ];

  /* Q4 / Extra A3: rational or irrational */
  function ratPart(r, lab, rational, kind) {
    var o = rational ? pickWhere(function () { return { m: r.int(2, 6), n: nz(r, -7, 7), p: r.int(1, 4), q: nz(r, -7, 7) }; }, function (o) { var a = o.m * o.p, b = o.m * o.q + o.n * o.p, c = o.n * o.q; return gcd(o.m, o.n) === 1 && gcd(o.p, o.q) === 1 && a >= 6 && b !== 0 && o.m * o.q !== o.n * o.p && (kind === 'c' ? c > 0 && b < 0 : c < 0) && Math.abs(b) <= 20 && D(a, b, c) <= 700 && AV(a, b, c); })
      : pickWhere(function () { return { a: r.int(2, 6), b: nz(r, -9, 9), c: nz(r, -9, 9) }; }, function (o) { var d = D(o.a, o.b, o.c); return d > 0 && !isSq(d) && gcd(gcd(o.a, o.b), o.c) === 1 && AV(o.a, o.b, o.c); });
    var a = rational ? o.m * o.p : o.a, b = rational ? o.m * o.q + o.n * o.p : o.b, c = rational ? o.n * o.q : o.c, d = D(a, b, c), sq = Math.round(Math.sqrt(d));
    var wordChk = function (resp) {
      var s = String(resp == null ? '' : resp).replace(/\\text\{([^}]*)\}/g, '$1').replace(/[\\{}\s.]/g, '').toLowerCase();
      if (!s) return form('empty', 'Type <b>rational</b> or <b>irrational</b>.');
      if (s !== 'rational' && s !== 'irrational') return form(CP + 'word', 'Type the word <b>rational</b> or <b>irrational</b>.');
      if ((s === 'rational') === rational) return ok();
      return wrong(CP + 'rat', rational ? t(d + '=' + sq + '^{2}') + ' is a perfect square, so the roots are rational.' : t(d) + ' is not a perfect square, so the roots are irrational.');
    };
    var specs = [Z.fNum(CP, t('b^{2}-4ac='), d, { cands: dCands(a, b, c) }), { label: 'The roots are', mode: 'text', chk: wordChk, key: rational ? 'rational' : 'irrational', ansHtml: rational ? 'rational' : 'irrational', placeholder: 'rational or irrational' }];
    var sol = dSol(a, b, c) + (rational ? t('=' + sq + '^{2}') + ', a perfect square: <b>rational</b>.' : ', not a perfect square: <b>irrational</b> (the trinomial doesn’t factor over the integers).');
    if (rational) {
      var ft = HW.factor.tex([polyT([o.m, o.n]), polyT([o.p, o.q])]), T = Z.uniq([-o.n / o.m, -o.q / o.p]);
      specs.push(Z.fRoots(CP, 'Roots (by factoring):', T, { key: 'x=' + frT(-o.n, o.m) + ',\\ x=' + frT(-o.q, o.p), wrongs: [{ vals: [o.n / o.m, o.q / o.p], code: 'u5l7-factor', hint: 'Set each factor equal to 0: check the signs.' }] }));
      sol += '<br>' + t(ft + '=0') + ', so ' + t('x=' + frT(-o.n, o.m)) + ' or ' + t('x=' + frT(-o.q, o.p)) + '.';
    }
    return Z.fields(t(eqT(a, b, c)), specs, { sol: sol, hints: ['A perfect-square discriminant gives rational roots; otherwise they are irrational.', rational ? 'To factor, find two numbers with product ' + t('ac=' + a * c) + ' and sum ' + t(b) + '.' : 'Is the discriminant a perfect square?'], text: rational ? 'rational roots: factor' : 'irrational roots' });
  }
  /* Q7 (a)(b) / Extra B3: equal roots with k in b: ax² ± kx + c = 0 */
  function eqKb(r, lab, a, c, s) {
    var k = 2 * Math.sqrt(a * c), xp = -s * k / (2 * a), xn = s * k / (2 * a);
    var eq = polyT([a, 0, 0]) + (s > 0 ? '+' : '-') + 'kx+' + c + '=0';
    var rootC = function (x) { return [[-x, CP + 'root-sign', t('x=\\frac{-b}{2a}') + ' with ' + t('b=' + (s > 0 ? '' : '-') + 'k') + ': check the sign.']]; };
    var sq = function (x, sg) { return HW.factor.tex([{ p: polyT([Math.sqrt(a), sg * Math.sqrt(c)]), k: 2 }]); };
    return Z.fields(t(eq), [Z.fNum(CP, 'Positive value: ' + t('k='), k, { cands: [[k * k, CP + 'no4', t('k^{2}=' + 4 * a * c) + ', so ' + t('k=\\pm\\sqrt{' + 4 * a * c + '}') + '.'], [Math.sqrt(a * c), CP + 'no4', 'The discriminant is ' + t('k^{2}-4ac') + '.']] }), Z.fNum(CP, 'its root ' + t('x='), xp, { cands: rootC(xp) }), Z.fNum(CP, 'Negative value: ' + t('k='), -k, { cands: [[k, CP + 'onek', 'The other value is negative: ' + t('k^{2}=' + 4 * a * c) + ' has two solutions.']] }), Z.fNum(CP, 'its root ' + t('x='), xn, { cands: rootC(xn) })],
      { sol: t('b^{2}-4ac=k^{2}-4(' + a + ')(' + c + ')=k^{2}-' + 4 * a * c + '=0\\Rightarrow k=\\pm ' + k) + '<br>' + t('k=' + k) + ': ' + t(polyT([a, s * k, c]) + '=' + sq(k, s) + '=0') + ', ' + t('x=' + vT(xp)) + '<br>' + t('k=-' + k) + ': ' + t(polyT([a, -s * k, c]) + '=' + sq(k, -s) + '=0') + ', ' + t('x=' + vT(xn)), hints: ['Equal roots: ' + t('b^{2}-4ac=0') + '. ' + t('k^{2}=') + ' a number has two solutions.', 'Each equal root is ' + t('x=\\frac{-b}{2a}') + '.'], text: 'equal roots: k in b' });
  }
  /* Q10 (b)(c): x² + 2kx + k² − s² = 0 */
  function dKexact(r, s, lab) {
    var d = 4 * s * s;
    return Z.num(CP, '' + t('x^{2}+2kx+k^{2}-' + s * s + '=0') + ': find the discriminant (it doesn’t depend on ' + t('k') + ').', d, { cands: [[-d, CP + '4ac', 'Check the sign: ' + t('-4(k^{2}-' + s * s + ')=-4k^{2}+' + 4 * s * s) + '.'], [s * s, CP + 'no4', 'Multiply ' + t('ac') + ' by 4.']],
      sol: t('b^{2}-4ac=(2k)^{2}-4(1)(k^{2}-' + s * s + ')=4k^{2}-4k^{2}+' + d + '=' + d) + ' > 0 for every ' + t('k') + ': two distinct real roots.', hints: ['Here ' + t('b=2k') + ' and ' + t('c=k^{2}-' + s * s) + '. Expand and collect.'], text: 'show: discriminant constant' });
  }
  function dKroots(r, s) {
    var f1 = function (k) { return -k + s; }, f2 = function (k) { return -k - s; };
    var p = B.math('For ' + t('x^{2}+2kx+k^{2}-' + s * s + '=0') + ', show that the roots are rational when ' + t('k') + ' is an integer: solve for ' + t('x') + ' in terms of ' + t('k') + '.', Z.prChk(CP, [f1, f2], { p: 'k', pts: [-2.3, 0.7, 1.9, 3.4], cands: [[[function (k) { return k + s; }, function (k) { return k - s; }], CP + 'root-sign', 'The formula starts with ' + t('-b=-2k') + '.'], [[function (k) { return -2 * k + 2 * s; }, function (k) { return -2 * k - 2 * s; }], 'u5l7-half', 'Divide every term by ' + t('2a=2') + '.']] }), 'x=-k\\pm ' + s,
      t('b^{2}-4ac=' + 4 * s * s + '=' + 2 * s + '^{2}') + ', a perfect square, so ' + t('x=\\frac{-2k\\pm ' + 2 * s + '}{2}=-k\\pm ' + s) + ': integers (rational) when ' + t('k') + ' is an integer.', ['Use ' + t('\\sqrt{' + 4 * s * s + '}=' + 2 * s) + ' in the formula, then divide every term by 2.'], 'roots in terms of k', { keys: 'p57', vars: ['x', 'k'], placeholder: 'e.g. x = -k ± 2' });
    p.outcome = OUT; p.good = ['x=-k+' + s + ',\\ x=-k-' + s, 'x=' + s + '-k,\\ x=-' + s + '-k']; p.bad = ['x=k\\pm ' + s, 'x=-k+' + s]; return p;
  }
  /* Q12: does the ball reach H? */
  function reach(o, H, lab) {
    var c = cl(o.h0 - H), d = D(-4.9, o.v, c), n = d > 0 ? 2 : d === 0 ? 1 : 0;
    return Z.fields('Does it reach ' + t(H) + ' m? Give the discriminant and the number of times it is at that height.', [Z.fNum(CP, t('b^{2}-4ac='), d, { cands: [[D(-4.9, o.v, cl(o.h0 + H)), CP + 'std', 'Set ' + t('h=' + H) + ' and move the ' + t(H) + ' to the left: the constant is ' + t(nT(o.h0) + '-' + H + '=' + nT(c)) + '.'], [cl(o.v * o.v + 4 * 4.9 * c), CP + '4ac', 'Check the sign of ' + t('-4ac') + ' (both ' + t('a') + ' and ' + t('c') + ' are negative).'], [D(-4.9, o.v, o.h0), CP + 'std', 'Set ' + t('h=' + H) + ' first, then write the equation in standard form.']] }), Z.fNum(CP, 'Number of times:', n, { cands: [[n ? 0 : 1, CP + 'times', n ? 'A positive discriminant: two times (going up and coming down).' : 'A negative discriminant: no real roots, so it never reaches that height.'], [n ? 1 : 2, CP + 'times', n ? 'Positive discriminant: two roots.' : 'Negative discriminant: no roots.']] })],
      { sol: t('-4.9t^{2}+' + o.v + 't+' + nT(o.h0) + '=' + H + '\\Rightarrow ' + eqT(-4.9, o.v, c, 't')) + '<br>' + dSol(-4.9, o.v, c) + (n ? ' > 0: it reaches ' + H + ' m twice (going up and coming down).' : ' < 0: no real roots, so it never reaches ' + H + ' m.'), hints: ['Set ' + t('h=' + H) + ', move every term to one side, then find ' + t('b^{2}-4ac') + '.'], text: 'does it reach the height?' });
  }

  /* =========================== Extra Practice 8 =========================== */
  var EXTRA = [
    { num: 'A1', stem: 'Determine the discriminant and the nature of the roots.', parts: [
      { id: 'eA1a', level: 'BEG', make: function (r) { var q = natGen(r, -1, { a: [1] }); return natMC(r, '' + t(eqT(q[0], q[1], q[2])), q[0], q[1], q[2], { text: 'nature: none' }); } },
      { id: 'eA1b', level: 'BEG', make: function (r) { var q = natGen(r, 0, { test: function (q) { return q[0] > 4; } }); return natMC(r, '' + t(eqT(q[0], q[1], q[2])), q[0], q[1], q[2], { text: 'nature: equal' }); } },
      { id: 'eA1c', level: 'BEG', make: function (r) { var q = natGen(r, 1, { a: [2, 3], test: function (q, d) { return q[2] < 0 && isSq(d); } }); return natMC(r, '' + t(eqT(q[0], q[1], q[2])), q[0], q[1], q[2], { text: 'nature: two distinct (rational)', post: t(D(q[0], q[1], q[2])) + ' is a perfect square: the roots are rational.' }); } },
      { id: 'eA1d', level: 'BEG', make: function (r) { var q = natGen(r, 1, { a: [1], test: function (q, d) { return !isSq(d) && q[2] < 0; } }); return natMC(r, '' + t(eqT(q[0], q[1], q[2])), q[0], q[1], q[2], { text: 'nature: two distinct (irrational)' }); } },
      { id: 'eA1e', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(2, 5), b: r.int(1, 6), c: r.int(1, 6) }; }, function (o) { return D(o.a, -o.b, o.c) < 0 && gcd(gcd(o.a, o.b), o.c) === 1 && !(o.a === 3 && o.b === 4 && o.c === 2); });
        return natMC(r, '' + t(o.a + 'x^{2}=' + polyT([o.b, -o.c])), o.a, -o.b, o.c, { pre: 'Standard form: ' + t(eqT(o.a, -o.b, o.c)), slips: [[D(o.a, o.b, -o.c), CP + 'std', 'Move every term to the left side (changing signs) before reading ' + t('a') + ', ' + t('b') + ', ' + t('c') + '.']], text: 'nature: rearrange (none)' });
      } },
      { id: 'eA1f', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { p: nz(r, -6, 6), q: nz(r, -6, 6), m: r.int(1, 9) }; }, function (o) { var b = o.q - o.p, c = -o.p * o.q - o.m; return b !== 0 && c !== 0 && !(o.p === -1 && o.q === -5 && o.m === 2) && D(1, b, c) > 0; });
        var b = o.q - o.p, c = -o.p * o.q - o.m;
        return natMC(r, '' + t('(' + polyT([1, -o.p]) + ')(' + polyT([1, o.q]) + ')=' + o.m), 1, b, c, { pre: t(polyT([1, b, -o.p * o.q]) + '=' + o.m) + ', so ' + t(eqT(1, b, c)), slips: [[D(1, b, -o.p * o.q), CP + 'std', 'Move the ' + t(o.m) + ' to the left side first.']], text: 'nature: expand and rearrange' });
      } }] },
    { num: 'A2', stem: 'How many ' + t('x') + '-intercepts does each graph have?', parts: [
      { id: 'eA2a', level: 'BEG', make: function (r) { var q = pickWhere(function () { var s = r.int(1, 3), u = nz(r, -7, 7); return [-s * s, 2 * s * u, -u * u]; }, function (q) { return AV(q[0], q[1], q[2]); }); return natMC(r, '' + t('y=' + polyT(q)), q[0], q[1], q[2], { kind: 'xint', text: 'x-intercepts: one, a < 0' }); } },
      { id: 'eA2b', level: 'BEG', make: function (r) { var q = natGen(r, 1, { a: [2, 3, 4, 5], test: function (q) { return q[2] < 0; } }); return natMC(r, '' + t('y=' + polyT(q)), q[0], q[1], q[2], { kind: 'xint', text: 'x-intercepts: two' }); } },
      { id: 'eA2c', level: 'EMG', make: function (r) { var o = pickWhere(function () { return { a: r.pick([-3, -2, -1, 1, 2, 3]), p: nz(r, -5, 5), q: nz(r, -6, 6) }; }, function (o) { return !(o.a === -2 && o.p === 3 && o.q === -1); }); return vfMC(r, '' + t('y=' + (o.a === 1 ? '' : o.a === -1 ? '-' : o.a) + '(' + polyT([1, -o.p]) + ')^{2}' + (o.q > 0 ? '+' : '') + o.q), o.a, o.p, o.q); } }] },
    { num: 'A3', shared: function (r) {
        var f = pickWhere(function () { return { m: r.int(2, 5), n: nz(r, -6, 6), p: r.int(1, 4), q: nz(r, -6, 6) }; }, function (o) { var a = o.m * o.p, b = o.m * o.q + o.n * o.p; return gcd(o.m, o.n) === 1 && gcd(o.p, o.q) === 1 && a >= 4 && b !== 0 && o.n * o.q < 0 && AV(a, b, o.n * o.q); });
        var g = pickWhere(function () { return [r.int(2, 7), nz(r, -7, 7), nz(r, -6, 6)]; }, function (q) { var d = D(q[0], q[1], q[2]); return d > 0 && !isSq(d) && gcd(gcd(q[0], q[1]), q[2]) === 1 && AV(q[0], q[1], q[2]); });
        return { f: f, g: g, first: r.chance(0.5) };
      }, stem: function (o) { var F1 = [o.f.m * o.f.p, o.f.m * o.f.q + o.f.n * o.f.p, o.f.n * o.f.q], L = o.first ? [F1, o.g] : [o.g, F1]; return 'Use the discriminant to decide which trinomial factors over the integers, and factor it: &nbsp; (a) ' + t(polyT(L[0])) + ' &nbsp; (b) ' + t(polyT(L[1])); }, parts: [
      { id: 'eA3a', level: 'EMG', make: function (r, o) {
        var F1 = [o.f.m * o.f.p, o.f.m * o.f.q + o.f.n * o.f.p, o.f.n * o.f.q], dF = D(F1[0], F1[1], F1[2]), dG = D(o.g[0], o.g[1], o.g[2]), fl = o.first ? '(a)' : '(b)', gl = o.first ? '(b)' : '(a)', sq = Math.round(Math.sqrt(dF));
        return Z.mc(r, 'Which trinomial factors over the integers?', [
          { html: fl + ' only: ' + t('b^{2}-4ac=' + dF + '=' + sq + '^{2}') + ', a perfect square.', right: true },
          { html: gl + ' only: ' + t('b^{2}-4ac=' + dG) + '.', why: t(dG) + ' is not a perfect square, so ' + gl + ' doesn’t factor over the integers.', code: CP + 'rat' },
          { html: 'Both: both discriminants are positive.', why: 'Positive isn’t enough: the discriminant must be a perfect square.', code: CP + 'rat' },
          { html: 'Neither.', why: t(dF + '=' + sq + '^{2}') + ' is a perfect square.', code: CP + 'rat' }],
          fl + ': ' + dSol(F1[0], F1[1], F1[2]) + t('=' + sq + '^{2}') + ', a perfect square, so it factors.<br>' + gl + ': ' + dSol(o.g[0], o.g[1], o.g[2]) + ', not a perfect square: it does not factor over the integers.', ['A trinomial with integer coefficients factors over the integers exactly when its discriminant is a perfect square.'], 'which trinomial factors');
      } },
      { id: 'eA3b', level: 'EMG', make: function (r, o) {
        var f = o.f, ft = HW.factor.tex([polyT([f.m, f.n]), polyT([f.p, f.q])]), F1 = [f.m * f.p, f.m * f.q + f.n * f.p, f.n * f.q];
        var sol = 'Product ' + t('ac=' + F1[0] * F1[2]) + ', sum ' + t(F1[1]) + ': ' + t(f.m * f.q) + ' and ' + t(f.n * f.p) + '.<br>' + t(polyT(F1) + '=' + ft);
        var p = B.math('Factor the trinomial that factors.', K.factored(ft, { wrong: [{ is: HW.factor.tex([polyT([f.m, -f.n]), polyT([f.p, -f.q])]), code: 'u5l7-factor', hint: 'Check the signs: expand your brackets to compare.' }] }), ft, sol, ['Use decomposition: two numbers with product ' + t('ac') + ' and sum ' + t('b') + '.'], 'factor the one that factors', { keys: 'poly', vars: ['x'] });
        p.outcome = OUT; p.bad = [polyT(F1)]; return p;
      } }] },
    { num: 'B1', parts: [
      { id: 'eB1', level: 'PRG', make: function (r) { var m = pickWhere(function () { return r.int(2, 9) * sgn(r); }, function (m) { return m !== 4 && m !== 5; }); return threeK('For what values of ' + t('k') + ' does ' + t('x^{2}' + (m > 0 ? '+' : '-') + Math.abs(2 * m) + 'x+k=0') + ' have (a) two distinct real roots, (b) two equal real roots, (c) no real roots?', 1, 2 * m, 1, 'k'); } }] },
    { num: 'B2', parts: [
      { id: 'eB2', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { b: nz(r, -12, 12), c: r.int(1, 9) }; }, function (o) { return !(o.b === -10 && o.c === 5) && !(o.b === 4 && o.c === 2) && gcd(o.b, o.c) <= 2; });
        var Kv = o.b * o.b / (4 * o.c), tex = 'k\\le ' + kT(Kv) + ',\\ k\\ne 0';
        return setPart('For what values of ' + t('k') + ' does ' + t('kx^{2}' + sx(o.b, 'x') + '+' + o.c + '=0') + ' have real roots?', tex, 'k', [{ is: 'k\\le ' + kT(Kv), code: CP + 'k0', hint: 'With ' + t('k=0') + ' the equation isn’t quadratic: add ' + t('k\\ne 0') + '.' }, { is: 'k\\ge ' + kT(Kv) + ',\\ k\\ne 0', code: CP + 'dir', hint: 'Dividing by ' + t(-4 * o.c) + ' reverses the sign.' }, { is: 'k<' + kT(Kv) + ',\\ k\\ne 0', code: CP + 'strict', hint: '“Real roots” means ' + t('b^{2}-4ac\\ge 0') + '.' }],
          t(o.b * o.b + '-' + 4 * o.c + 'k\\ge 0\\Rightarrow k\\le ' + kT(Kv)) + ', and ' + t('k\\ne 0') + ' (to be quadratic): ' + t(tex), ['Real roots: ' + t('b^{2}-4ac\\ge 0') + '; ' + t('k') + ' is the ' + t('x^{2}') + ' coefficient, so ' + t('k\\ne 0') + '.'], 'real roots: k in a');
      } }] },
    { num: 'B3', stem: 'The equation has two equal real roots. Determine each value of ' + t('k') + ' and the root for each.', parts: [
      { id: 'eB3', level: 'PRG', make: function (r) { var o = pickWhere(function () { return { a: r.pick([4, 16, 25, 49]), c: r.pick([1, 9, 16, 25]) }; }, function (o) { return gcd(o.a, o.c) === 1 && !(o.a === 9 && o.c === 4); }); return eqKb(r, '', o.a, o.c, 1); } }] },
    { num: 'B4', parts: [
      { id: 'eB4', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(2, 6), c: -r.int(1, 6) }; }, function (o) { return !(o.a === 3 && o.c === -2); });
        var v = -4 * o.a * o.c, T = P.parse('k^{2}+' + v);
        var p = B.math('Show that ' + t(polyT([o.a, 0, 0]) + '+kx-' + (-o.c) + '=0') + ' has two distinct real roots for every real number ' + t('k') + ': write its discriminant in terms of ' + t('k') + '.', K.poly(T, { wrong: [{ is: P.parse('k^{2}-' + v), code: CP + '4ac', hint: 'Check the sign of ' + t('-4ac') + ' with ' + t('c=' + o.c) + '.' }] }), 'k^{2}+' + v,
          t('b^{2}-4ac=k^{2}-4(' + o.a + ')(' + o.c + ')=k^{2}+' + v) + '. Since ' + t('k^{2}\\ge 0') + ', ' + t('k^{2}+' + v + '>0') + ' for every ' + t('k') + '.', ['Here ' + t('b=k') + '. A square is never negative.'], 'show: discriminant in k', { keys: 'poly', vars: ['k'] });
        p.outcome = OUT; p.bad = ['k^{2}-' + v]; return p;
      } }] },
    { num: 'B5', shared: function (r) {
        return pickWhere(function () { var v = r.pick([10, 16, 20, 24, 30, 40]), h0 = r.int(1, 5); return { v: v, h0: h0, top: h0 + v * v / 20, H: 0 }; }, function (o) { return !(o.v === 30 && o.h0 === 2); });
      }, stem: function (o) { return 'A rocket’s height is ' + t('h=-5t^{2}+' + o.v + 't+' + o.h0) + ' metres after ' + t('t') + ' seconds.'; }, parts: [
      { id: 'eB5a', level: 'PRG', make: function (r, o) {
        var H = Math.ceil(o.top) + r.int(1, 6), c = o.h0 - H, d = D(-5, o.v, c);
        return Z.num(CP, 'Use the discriminant to show that it never reaches ' + t(H) + ' m: find the discriminant.', d, { cands: [[D(-5, o.v, o.h0 + H), CP + 'std', 'Set ' + t('h=' + H) + ' and move the ' + t(H) + ' to the left side.'], [o.v * o.v + 20 * c, CP + '4ac', 'Check the sign of ' + t('-4ac') + ': both ' + t('a') + ' and ' + t('c') + ' are negative.']],
          sol: t(eqT(-5, o.v, c, 't')) + ': ' + dSol(-5, o.v, c) + ' < 0. No real roots, so it never reaches ' + H + ' m.', hints: ['Set ' + t('h=' + H) + ', write the equation in standard form, then find ' + t('b^{2}-4ac') + '.'], text: 'rocket: never reaches' });
      } },
      { id: 'eB5b', level: 'ADV', make: function (r, o) {
        return Z.num(CP, 'Use the discriminant to determine its maximum height.', o.top, { after: 'm', unit: 'm', cands: [[o.v * o.v / 20, CP + 'max', 'Include the starting height: ' + t('-5t^{2}+' + o.v + 't+(' + o.h0 + '-H)=0') + '.'], [o.v / 10, CP + 'max', 'That is the time of the maximum, not the height.']],
          sol: t('-5t^{2}+' + o.v + 't+(' + o.h0 + '-H)=0') + ' needs ' + t(o.v * o.v + '+20(' + o.h0 + '-H)\\ge 0\\Rightarrow ' + nT(o.v * o.v + 20 * o.h0) + '\\ge 20H\\Rightarrow H\\le ' + nT(o.top)) + '.<br>Maximum height ' + t(nT(o.top)) + ' m (equal roots, at ' + t('t=' + nT(o.v / 10)) + ' s).', hints: ['A height ' + t('H') + ' is reached when ' + t('-5t^{2}+' + o.v + 't+' + o.h0 + '=H') + ' has real roots: ' + t('b^{2}-4ac\\ge 0') + '.', 'The largest such ' + t('H') + ' gives equal roots.'], text: 'rocket: maximum by the discriminant' });
      } }] },
    { num: 'B6', parts: [
      { id: 'eB6', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(1, 5), b: -r.int(2, 10) }; }, function (o) { return !(o.a === 2 && o.b === -4) && gcd(o.a, o.b) <= 2; });
        var Kv = o.b * o.b / (4 * o.a), kv = kT(Kv);
        return Z.mc(r, 'The equation ' + t(polyT([o.a, o.b, 0]) + '+c=0') + ' has no real roots when', [
          { html: t('c>' + kv), right: true },
          { html: t('c<' + kv), why: t('c<' + kv) + ' gives two distinct real roots.', code: CP + 'dir' },
          { html: t('c=' + kv), why: t('c=' + kv) + ' gives equal roots.', code: CP + 'nature' },
          { html: t('c>-' + kv), why: 'Check the sign: ' + t(o.b * o.b + '-' + 4 * o.a + 'c<0') + ' gives ' + t('c>' + kv) + '.', code: CP + 'flip' }],
          t(o.b * o.b + '-' + 4 * o.a + 'c<0\\Rightarrow c>' + kv), ['No real roots: ' + t('b^{2}-4ac<0') + '.'], 'MC: values of c');
      } }] },
    { num: 'B7', parts: [
      { id: 'eB7', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(2, 5), p: r.int(1, 4), q: r.int(1, 9), s: r.int(1, 5) }; }, function (o) { var a = o.a, b = -o.a * o.p + o.s, c = -o.q, d = D(a, b, c); return d > 0 && d < 1000 && !(o.a === 4 && o.p === 1 && o.q === 3 && o.s === 2); });
        var a = o.a, b = -o.a * o.p + o.s, c = -o.q, d = D(a, b, c);
        return Z.nrInt('<i>Numerical response.</i> The discriminant of ' + t(o.a + 'x(x-' + o.p + ')=' + o.q + '-' + (o.s === 1 ? '' : o.s) + 'x') + ' is ____.', d, { cands: [[D(a, -o.a * o.p, -o.q), CP + 'std', 'Move every term to the left side: the ' + t('-' + (o.s === 1 ? '' : o.s) + 'x') + ' becomes ' + t('+' + (o.s === 1 ? '' : o.s) + 'x') + '.'], [D(a, -o.a * o.p - o.s, -o.q), CP + 'std', 'When ' + t('-' + o.s + 'x') + ' moves to the left it becomes ' + t('+' + o.s + 'x') + '.'], [D(a, b, o.q), CP + 'std', 'When ' + t(o.q) + ' moves to the left it becomes ' + t(-o.q) + '.']],
          sol: t(polyT([o.a, -o.a * o.p, 0]) + '-' + o.q + (o.s === 1 ? '+x' : '+' + o.s + 'x') + '=0\\Rightarrow ' + eqT(a, b, c)) + '; ' + dSol(a, b, c) + '.', hints: ['Expand and move every term to the left side first.'], text: 'NR: discriminant after rearranging' });
      } }] },
    { num: 'C1', parts: [
      { id: 'eC1', level: 'MAS', make: function (r) {
        var m = pickWhere(function () { return nz(r, -6, 6); }, function (m) { return m !== 3 && m !== 2; });
        var Dk = P.parse('k^{2}' + (m > 0 ? '-' : '+') + Math.abs(2 * m) + 'k+' + m * m), sum = polyT([1, m], 'k');
        var specs = [{ label: 'Discriminant:', mode: 'math', keys: 'poly', vars: ['k'], chk: K.poly(Dk, { expanded: false, wrong: [{ is: P.parse('k^{2}' + (m > 0 ? '+' : '-') + Math.abs(6 * m) + 'k+' + m * m), code: CP + '4ac', hint: 'Check the sign of ' + t('-4ac=-4(' + nT(m) + 'k)') + '.' }, { is: P.parse('k^{2}+' + m * m + (m > 0 ? '-' : '+') + Math.abs(4 * m) + 'k'), code: CP + 'poly', hint: 'Square the whole bracket: ' + t('(' + sum + ')^{2}=k^{2}' + (m > 0 ? '+' : '-') + Math.abs(2 * m) + 'k+' + m * m) + '.' }] }), key: '(k' + (m > 0 ? '-' : '+') + Math.abs(m) + ')^{2}', placeholder: 'in terms of k' },
          { label: 'Roots:', mode: 'math', keys: 'p57', vars: ['x', 'k'], chk: Z.prChk(CP, [function (k) { return k; }, function () { return m; }], { p: 'k', pts: [-2.3, 0.7, 1.9, 3.4] }), key: 'x=k,\\ x=' + m, placeholder: 'e.g. x = k, x = 2' },
          Z.fNum(CP, 'Equal when ' + t('k='), m, { cands: [[-m, CP + 'root-sign', t('(k' + (m > 0 ? '-' : '+') + Math.abs(m) + ')^{2}=0') + ' when ' + t('k=' + m) + '.']] })];
        return Z.fields('Show that ' + t('x^{2}-(' + sum + ')x' + sx(m, 'k') + '=0') + ' has real roots for every value of ' + t('k') + ': write the discriminant as a perfect square. Then determine the roots in terms of ' + t('k') + ', and the value of ' + t('k') + ' that makes them equal.', specs,
          { sol: t('b^{2}-4ac=(' + sum + ')^{2}-4(' + cx(m, 'k') + ')=k^{2}' + (m > 0 ? '+' : '-') + Math.abs(2 * m) + 'k+' + m * m + (m > 0 ? '-' : '+') + Math.abs(4 * m) + 'k=k^{2}' + (m > 0 ? '-' : '+') + Math.abs(2 * m) + 'k+' + m * m + '=(k' + (m > 0 ? '-' : '+') + Math.abs(m) + ')^{2}\\ge 0') + ': always real.<br>' + t('x=\\frac{(' + sum + ')\\pm(k' + (m > 0 ? '-' : '+') + Math.abs(m) + ')}{2}') + ': ' + t('x=k') + ' or ' + t('x=' + m) + '. Equal when ' + t('k=' + m) + '.', hints: ['Here ' + t('b=-(' + sum + ')') + ' and ' + t('c=' + cx(m, 'k')) + '. Expand ' + t('b^{2}-4ac') + ' and factor it.', 'A perfect square is never negative. Use ' + t('\\sqrt{(k-m)^{2}}') + ' in the formula.'], text: 'discriminant a perfect square in k' });
      } }] },
    { num: 'C2', parts: [
      { id: 'eC2', level: 'MAS', make: function (r) {
        var o = pickWhere(function () { return { h: nz(r, -4, 4), b: nz(r, -8, 8), c: r.int(1, 4) }; }, function (o) { var Pv = o.b * o.b / (4 * o.c) - o.h; return !(o.h === 2 && o.b === -4 && o.c === 1) && !same(Pv, -o.h) && Pv > -o.h; });
        var Pv = o.b * o.b / (4 * o.c) - o.h, tex = 'p<' + kT(Pv) + ',\\ p\\ne ' + nT(-o.h);
        return setPart('For what values of ' + t('p') + ' does ' + t('(' + polyT([1, o.h], 'p') + ')x^{2}' + sx(o.b, 'x') + '+' + o.c + '=0') + ' have two distinct real roots?', tex, 'p', [{ is: 'p<' + kT(Pv), code: CP + 'k0', hint: 'At ' + t('p=' + nT(-o.h)) + ' the ' + t('x^{2}') + ' coefficient is 0 (not quadratic): exclude it.' }, { is: 'p>' + kT(Pv) + ',\\ p\\ne ' + nT(-o.h), code: CP + 'flip', hint: 'Dividing by a negative reverses the sign.' }, { is: 'p\\le ' + kT(Pv) + ',\\ p\\ne ' + nT(-o.h), code: CP + 'strict', hint: 'Two <b>distinct</b> roots: ' + t('b^{2}-4ac>0') + ' (strictly).' }],
          t(o.b * o.b + '-4(' + polyT([1, o.h], 'p') + ')(' + o.c + ')>0\\Rightarrow ' + polyT([-4 * o.c, o.b * o.b - 4 * o.c * o.h], 'p') + '>0\\Rightarrow p<' + kT(Pv)) + ', and ' + t('p\\ne ' + nT(-o.h)) + ' (otherwise it isn’t quadratic): ' + t(tex), ['Two distinct real roots: ' + t('b^{2}-4ac>0') + ' with ' + t('a=' + polyT([1, o.h], 'p')) + '. The ' + t('x^{2}') + ' coefficient can’t be 0.'], 'two distinct roots: parameter in a');
      } }] },
    { num: 'C3', parts: [
      { id: 'eC3', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { s: r.int(6, 20), A: 0 }; }, function (o) { return o.s !== 10; });
        var s = o.s, Amax = s * s / 4, A = Math.ceil(Amax) + r.int(1, 8), d = s * s - 4 * A;
        return Z.fields('A rectangle has a perimeter of ' + t(2 * s) + ' cm. Use the discriminant to show that its area cannot be ' + t(A + '\\text{ cm}^{2}') + ', and determine the largest possible area.', [Z.fNum(CP, t('b^{2}-4ac=') + ' (for area ' + A + ')', d, { cands: [[4 * s * s - 4 * A, CP + 'std', 'The sides add to half the perimeter: ' + t('x+(' + s + '-x)=' + s) + '.'], [s * s + 4 * A, CP + '4ac', 'Check the sign of ' + t('-4ac') + '.']] }), Z.fNum(CP, 'Largest area:', Amax, { after: 'cm²', cands: [[s * s, CP + 'max', 'Solve ' + t(s * s + '-4A\\ge 0') + ' for ' + t('A') + '.'], [s * s / 2, CP + 'max', 'Divide by 4: ' + t('A\\le\\frac{' + s * s + '}{4}') + '.']] })],
          { sol: 'Sides ' + t('x') + ' and ' + t(s + '-x') + ': ' + t('x(' + s + '-x)=A\\Rightarrow x^{2}-' + s + 'x+A=0') + '.<br>' + t('A=' + A) + ': ' + t(s * s + '-' + 4 * A + '=' + d + '<0') + ', no real roots: impossible.<br>Real roots need ' + t(s * s + '-4A\\ge 0') + ', so ' + t('A\\le ' + nT(Amax)) + ': the largest area is ' + t(nT(Amax) + '\\text{ cm}^{2}') + ' (a ' + t(nT(s / 2)) + ' cm square).', hints: ['Let one side be ' + t('x') + '; the other is ' + t(s + '-x') + '. Set the area equal to ' + t('A') + ' and write a quadratic equation.', 'An area is possible when the equation has real roots.'], text: 'rectangle: largest area' });
      } }] },
    { num: 'C4', parts: [
      { id: 'eC4', level: 'ADV', make: function (r) {
        var a = r.int(2, 6), c = r.int(1, 9) * a, sg = sgn(r);
        return Z.mc(r, 'Why does ' + t('ax^{2}+c=0') + ' (no ' + t('x') + ' term) have no real roots when ' + t('a') + ' and ' + t('c') + ' have the same sign? (For example ' + t(polyT([sg * a, 0, sg * c]) + '=0') + '.)', [
          { html: t('b=0') + ', so ' + t('b^{2}-4ac=-4ac') + '; with the same signs ' + t('ac>0') + ', so ' + t('-4ac<0') + '.', right: true },
          { html: t('b=0') + ', so the discriminant is ' + t('0') + ': there are no roots.', why: 'A zero discriminant would mean equal roots, and here it isn’t zero: ' + t('b^{2}-4ac=-4ac') + '.', code: CP + 'explain' },
          { html: 'With the same signs ' + t('ac<0') + ', so the discriminant is negative.', why: 'The same signs give a <b>positive</b> product ' + t('ac') + '.', code: CP + 'explain' },
          { html: 'A square root of ' + t('c') + ' is never real.', why: 'It depends on the sign of ' + t('-\\frac{c}{a}') + ', not on ' + t('c') + ' alone.', code: CP + 'explain' }],
          t('b=0') + ', so ' + t('b^{2}-4ac=-4ac') + '. With ' + t('a') + ' and ' + t('c') + ' the same sign, ' + t('ac>0') + ' and ' + t('-4ac<0') + ': no real roots. Example: ' + t(polyT([sg * a, 0, sg * c]) + '=0') + ' gives ' + t('x^{2}=-' + c / a) + ', no real roots.', ['What is ' + t('b') + '? What is the sign of ' + t('ac') + '?'], 'explain: no x term');
      } }] }
  ];

  HW.defineLesson({ id: LID, unit: 5, num: '8', title: 'The Discriminant', outcome: OUT, calc: true, questions: QUESTIONS, extra: EXTRA });
})(window);
