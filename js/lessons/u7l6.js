/* Math 20-1 · Unit 7 · Lesson 6 — Reciprocal Functions of Linear Functions (outcome RF11 on every part)
 * Assignment 6 (u7_l06.tex, Questions 1–16) and the Lesson 6 Extra Practice (u7_ep06.tex, A1–A4, B1–B5, C1–C3).
 * Every part is a generator: the booklet question's idea, form and difficulty with new numbers (the lesson's example
 * numbers and the booklet question's own numbers are left out). Calculator allowed; answers exact (fractions).
 *
 * Answers are typed: values (fractions or decimals, "undefined" for the reciprocal of 0), points "(x, y)", asymptotes as
 * equations "x = 2, y = 0", domain and range in set notation ({x | x ≠ 2, x ∈ ℝ}, an inequality or interval notation),
 * linear functions in any equivalent form. Several features at once are labelled boxes with one keypad (u7k56feat: digits,
 * fraction, ( ), x, y, =, { }, |, ≠, ∈ ℝ). Recognised mistakes (codes u7l6-…): the asymptote at the constant term or with
 * the wrong sign, y = … for a vertical asymptote, the horizontal asymptote left out, the line's y-intercept for the
 * reciprocal's, only one invariant point (or y = ±1 swapped, or the zero used), a reciprocal with the sign changed or the
 * y-value kept, the reciprocal's y-value used as a value of f, the domain excluding the y-intercept or the wrong sign, the
 * range excluding the asymptote's x-value, the positive side of the asymptote reversed, branches rising / falling the
 * wrong way, and the classic MC distractors.
 * Conversions: "sketch y = 1/f(x)" (#2b, #3, A1) → the features the sketch shows (asymptote, invariant points, y-intercept)
 * and, once per graph type, choose-the-graph (#2b; #7a chooses the line); "describe" / "explain" (#5, #10, B1b, B3a, C3) →
 * MC on the statement; "is (1, −0.5) also on the graph?" (C2) → yes/no box.
 * Levels: LIM BEG EMG PRG ADV MAS. Mastery: 11b, C1, C2, C3.
 *
 * Uses HW.u7k56 (js/lessons/u7l5.js, loaded first): the checkers for values, points, asymptotes and solutions. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, KP = K.P, P = HW.poly, ex = HW.ex, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
  var Z = HW.u7k56;
  if (!Z) throw new Error('js/lessons/u7l6.js needs js/lessons/u7l5.js (HW.u7k56) loaded first');
  var LID = 'u7l6', CP = 'u7l6-', OUT = 'RF11';
  var pickWhere = Z.pickWhere, nz = Z.nz, toR = Z.toR, rv = Z.rv, rt = Z.rt, dt = Z.dt, sgT = Z.sgT, has = Z.has, lin = Z.lin, tx = Z.tx, pt = Z.pt, ptsT = Z.ptsT, mc = Z.mc, G = Z.G, crv = Z.crv, recFns = Z.recFns, plainLow = Z.plainLow;

  /* keypad for several features at once */
  var W = HW.widgets;
  if (W && W.KEYSETS) {
    var d = function (n) { return { label: String(n), tex: String(n), plain: String(n) }; };
    var KY = { del: { label: '⌫', fn: 'del', title: 'Delete' }, clear: { label: 'clear', fn: 'clear' }, left: { label: '◀', fn: 'left', title: 'Move left' }, right: { label: '▶', fn: 'right', title: 'Move right (out of a box)' }, enter: { label: 'Check ↵', fn: 'enter', wide: true },
      minus: { label: '−', tex: '-', plain: '-' }, dot: { label: '.', tex: '.', plain: '.' }, comma: { label: ',', tex: ',', plain: ', ' }, frac: { label: '<sup>a</sup>⁄<sub>b</sub>', tex: '\\frac{#@}{#?}', plain: '/', title: 'Fraction' },
      par: { label: '( )', tex: '\\left(#0\\right)', plain: '(', title: 'A point: type x, y inside' }, eq: { label: '=', tex: '=', plain: ' = ' }, ne: { label: '≠', tex: '\\ne ', plain: ' != ', title: 'is not equal to' },
      braces: { label: '{ }', tex: '\\left\\lbrace #0\\right\\rbrace', plain: '{', title: 'Braces' }, mid: { label: '|', tex: '\\mid ', plain: ' | ', title: 'such that' }, inn: { label: '∈', tex: '\\in ', plain: ' in ' }, R: { label: 'ℝ', tex: '\\mathbb{R}', plain: 'R' },
      x: { label: '<i>x</i>', tex: 'x', plain: 'x' }, y: { label: '<i>y</i>', tex: 'y', plain: 'y' }, lt: { label: '<', tex: '<', plain: ' < ' }, gt: { label: '>', tex: '>', plain: ' > ' } };
    W.KEYSETS.u7k56feat = function () { return [[d(7), d(8), d(9), KY.frac, KY.par, KY.del], [d(4), d(5), d(6), KY.minus, KY.dot, KY.clear], [d(1), d(2), d(3), KY.x, KY.y, KY.eq, KY.left, KY.right], [d(0), KY.comma, KY.braces, KY.mid, KY.ne, KY.lt, KY.gt, KY.inn, KY.R], [KY.enter]]; };
    if (W.KEYHELP) W.KEYHELP.u7k56feat = ['Tap a box, then type: an asymptote as ' + HW.k('x=2') + ', points as ' + HW.k('(3,\\ 1),\\ (1,\\ -1)') + ' (press <b>( )</b>, then <b>▶</b> to step out), a number, or a set ' + HW.k('\\{x\\mid x\\ne 2,\\ x\\in\\mathbb{R}\\}') + '.', 'Type e.g. <code>x = 2, y = 0</code>, <code>(3, 1), (1, -1)</code>, <code>-1/2</code> or <code>{x | x != 2, x in R}</code>.'];
  }

  /* ---------------- f(x) = a x + b ---------------- */
  var SLOPES = [1, -1, 2, -2, 3, -3, 4, -4, 5, [1, 2], [-1, 2], [1, 3], [-1, 3]];
  function spec(r, o) {
    o = o || {};
    return pickWhere(function () { return { a: toR(r.pick(o.slopes || SLOPES)), b: nz(r, o.bmin || 1, o.bmax || 9) }; }, function (z) {
      var av = rv(z.a); z.h = -z.b / av; z.x1 = (1 - z.b) / av; z.x2 = (-1 - z.b) / av;
      if (Math.abs(z.h) > (o.hmax || 8) || toR(z.h)[1] > (o.hden || 5) || toR(z.x1)[1] > 6 || toR(z.x2)[1] > 6) return false;
      if (o.test && !o.test(z)) return false;
      return (o.not || []).indexOf(rt(z.a) + ',' + z.b) < 0;
    });
  }
  function fT(s, cf) { var av = rv(s.a); if (cf && av < 0) return rt(s.b) + (av === -1 ? '-' : '-' + rt(Math.abs(av))) + 'x'; return tx(lin(s.a, s.b)); }
  function fFn(s) { var av = rv(s.a); return function (x) { return av * x + s.b; }; }
  function recT(den) { return '\\dfrac{1}{' + den + '}'; }
  function domT(h, v) { v = v || 'x'; return '\\{' + v + '\\mid ' + v + '\\ne ' + rt(h) + ',\\ ' + v + '\\in\\mathbb{R}\\}'; }
  var RNG = '\\{y\\mid y\\ne 0,\\ y\\in\\mathbb{R}\\}';

  /* checkers for the features of y = 1/(ax + b) */
  function vaCheck(s, hz, den) { return Z.asyCheck(CP, { xs: [s.h], hz: !!hz }, { wrongs: [{ xs: [-s.b], code: CP + 'asy-const', hint: 'The vertical asymptote is where the denominator is 0: solve ' + t(den + '=0') + '.' }, { xs: [s.b], code: CP + 'asy-const', hint: 'Solve ' + t(den + '=0') + ' for ' + t('x') + ' (do not just read off the constant).' }] }); }
  function yiCheck(s) { return Z.valCheck(CP, toR([1, s.b]), [{ v: s.b, code: CP + 'yint-same', hint: 'That is the ' + t('y') + '-intercept of the line. The reciprocal’s is ' + t('\\frac{1}{' + s.b + '}') + '.' }, { v: -1 / s.b, code: CP + 'rpt-neg', hint: 'A number and its reciprocal have the <b>same</b> sign.' }]).check; }
  function invWrongs(s) { return [{ pairs: [[s.x1, 1]], code: CP + 'rinv-one', hint: 'There is another one: where the line meets ' + t('y=-1') + '.' }, { pairs: [[s.x2, -1]], code: CP + 'rinv-one', hint: 'There is another one: where the line meets ' + t('y=1') + '.' }, { pairs: [[s.h, 0]], code: CP + 'rinv-zero', hint: 'Where the line is 0 the reciprocal is undefined (the asymptote). Invariant points are where ' + t('f(x)=1') + ' or ' + t('f(x)=-1') + '.' }, { pairs: [[s.x1, -1], [s.x2, 1]], code: CP + 'rinv-swap', hint: 'Substitute each ' + t('x') + ' into the line to see which ' + t('y') + '-value it gives.' }]; }
  function invCheck(s) { return Z.ptsCheck(CP, [[s.x1, 1], [s.x2, -1]], invWrongs(s), { noneHint: 'A non-horizontal line meets both ' + t('y=1') + ' and ' + t('y=-1') + '.' }); }
  function domCheck(s) { return K.set(domT(s.h), { v: 'x', other: RNG, otherName: 'range', wrong: [{ is: domT(-s.h), code: CP + 'dom-sign', hint: 'The value left out of the domain is where the denominator is 0: solve ' + t('f(x)=0') + '.' }, { is: domT(toR([1, s.b])), code: CP + 'dom-y', hint: 'Leave out the ' + t('x') + '-value where the denominator is 0 (the vertical asymptote), not the ' + t('y') + '-intercept.' }] }); }
  function rngCheck(s) { return K.set(RNG, { v: 'y', other: domT(s.h), otherName: 'domain', wrong: [{ is: domT(s.h, 'y'), code: CP + 'rng-x', hint: 'The range leaves out the ' + t('y') + '-value the graph never reaches: the horizontal asymptote ' + t('y=0') + '.' }] }); }
  function invPairs(s) { return [[s.x1, 1], [s.x2, -1]]; }
  function featSol(s, den) {
    return 'Vertical asymptote: ' + t(den + '=0') + ', ' + t('x=' + rt(s.h)) + '; horizontal asymptote ' + t('y=0') + '.<br>' + t('y') + '-intercept: ' + t('\\frac{1}{' + s.b + '}=' + rt(toR([1, s.b])))
      + '.<br>Invariant points: ' + t(den + '=1') + ' gives ' + t('x=' + rt(s.x1)) + '; ' + t(den + '=-1') + ' gives ' + t('x=' + rt(s.x2)) + ': ' + t(ptsT(invPairs(s))) + '.';
  }
  var FEAT = { mode: 'math', keys: 'u7k56feat' };
  function F(label, name, ph) { return Object.assign({ label: label, name: name, placeholder: ph }, FEAT); }
  var H_FEAT = ['Vertical asymptote: where the denominator is 0. Horizontal asymptote: ' + t('y=0') + '.', 'Invariant points: solve ' + t('f(x)=1') + ' and ' + t('f(x)=-1') + '. The ' + t('y') + '-intercept is ' + t('\\frac{1}{f(0)}') + '.'];

  /* graphs */
  function lineGraph(s, o) { o = o || {}; var f = fFn(s); return G({ fns: [crv(f)], hline: o.guides === false ? [] : [1, -1], max: o.max || 260, aria: 'the graph of the line y = ' + fT(s) + (o.guides === false ? '' : ' with the guide lines y = 1 and y = −1') }); }
  function recGraph(s, o) { o = o || {}; var f = fFn(s); return G(Object.assign({ fns: recFns(f, [s.h], [-6, 6]), vline: [s.h], max: o.max || 165, aria: 'two branches beside a vertical asymptote' }, o.g || {})); }

  /* ---------------- reciprocal values ---------------- */
  function recipCheck(fv) {
    if (fv === 0) return function (resp) { var l = plainLow(resp); if (!l) return form('empty', 'Type your answer first.'); if (/undef|none|dne|not defined|no value/.test(l)) return ok(); return wrong(CP + 'rpt-zero', t('\\frac{1}{0}') + ' is <b>undefined</b>: you cannot divide by 0. Type undefined.'); };
    var c = Z.valCheck(CP, toR(1 / fv) || 1 / fv, [{ v: -1 / fv, code: CP + 'rpt-neg', hint: 'A number and its reciprocal have the <b>same</b> sign.' }].concat(Math.abs(fv) !== 1 ? [{ v: fv, code: CP + 'rpt-same', hint: 'Take the reciprocal: ' + t('\\frac{1}{' + dt(fv) + '}') + '.' }] : []), { exact: false }).check;
    return function (resp) { if (/undef/.test(plainLow(resp))) return wrong(CP + 'undef', 'Only ' + t('\\frac{1}{0}') + ' is undefined. Work out ' + t('\\frac{1}{' + dt(fv) + '}') + '.'); return c(resp); };
  }
  function recipKey(fv) { if (fv === 0) return '\\text{undefined}'; var f = toR(1 / fv); return f ? ex.texRat(f) : dt(1 / fv); }
  function recipSol(fv) { return fv === 0 ? t('\\frac{1}{0}') + ' is undefined' : t('\\frac{1}{' + (fv < 0 ? '(' + dt(fv) + ')' : dt(fv)) + '}=' + recipKey(fv)); }
  function recipTable(prompt, rows, sol, hints, text) {
    var fields = rows.map(function (rw) { return { label: rw.label, name: rw.name, mode: 'math', keys: 'u7k56rec', placeholder: 'value or undefined' }; });
    var keys = rows.map(function (rw) { return recipKey(rw.fv); });
    var bad = [rows.map(function (rw) { return rw.fv === 0 ? '0' : recipKey(-rw.fv || rw.fv); })];
    return Z.fieldsPart(prompt, fields, rows.map(function (rw) { return recipCheck(rw.fv); }), keys, rows.map(function (rw, i) { return rw.label + ' ' + t(keys[i]); }).join('; '), sol, hints, text, bad);
  }

  /* #1: complete the table of reciprocals */
  function q1(r) {
    var pos = pickWhere(function () { return r.int(2, 12); }, function (x) { return x !== 5; }), neg = -pickWhere(function () { return r.int(2, 9); }, function (x) { return x !== 2; });
    var uf = toR([r.pick([1, -1]), r.pick([2, 3, 5, 6, 8])]), dec = r.pick([-0.2, -0.5, 0.25, -0.25, 0.1, 0.2, -0.125]), big = r.pick([10, 1000, -100, -10, 50, 20]);
    var vals = r.shuffle([pos, neg, rv(uf), dec, big]).concat(r.shuffle([1, -1, 0]));
    var rows = vals.map(function (v) { var vt = v === rv(uf) ? rt(uf) : dt(v); return { fv: v, label: t('f(x)=' + vt) + ' → ' + t('\\frac{1}{f(x)}'), name: 'f(x) = ' + vt }; });
    return recipTable('Complete the table of reciprocals: give ' + t('\\dfrac{1}{f(x)}') + ' for each value of ' + t('f(x)') + '.', rows, rows.map(function (rw) { return recipSol(rw.fv); }).join('; ') + '. (1 and −1 are their own reciprocals; 0 has no reciprocal.)',
      ['The reciprocal of ' + t('a') + ' is ' + t('\\frac{1}{a}') + ': it keeps the sign. The reciprocal of a fraction flips it.', t('\\frac{1}{0}') + ' is undefined.'], 'table of reciprocals');
  }

  /* #2: f(x) = x + c */
  function q2Shared(r) { var c = pickWhere(function () { return nz(r, 1, 5); }, function (x) { return x !== 1 && x !== -2; }); return { a: [1, 1], b: c, h: -c, x1: 1 - c, x2: -1 - c }; }
  function q2stem(s) { return 'Let ' + t('f(x)=' + fT(s)) + '.'; }
  function q2a(r, s) {
    var fvs = r.shuffle([-4, -2, -1, -0.5]).slice(0, 2).concat([0]).concat(r.shuffle([0.5, 1, 2, 4]).slice(0, 2)).concat([r.pick([-1, 1])]).filter(function (v, i, arr) { return arr.indexOf(v) === i; }).sort(function (p, q) { return p - q; });
    var rows = fvs.map(function (fv) { var x = fv - s.b; return { fv: fv, label: t('x=' + dt(x)) + ' → ' + t('\\frac{1}{f(x)}'), name: 'x = ' + dt(x) }; });
    return recipTable('Complete the table: give ' + t('\\dfrac{1}{f(x)}') + ' at each value of ' + t('x') + '.', rows, rows.map(function (rw) { var x = rw.fv - s.b; return t('f(' + dt(x) + ')=' + dt(rw.fv)) + ', so ' + recipSol(rw.fv); }).join('<br>'),
      ['Work out ' + t('f(x)') + ' first, then take its reciprocal.', 'Where ' + t('f(x)=0') + ' the reciprocal is undefined.'], 'table of y = 1/f(x)');
  }
  function matchMC(r, s, prompt) {
    var f = fFn(s), h = s.h;
    var gs = {
      ok: recGraph(s), neg: G({ fns: recFns(function (x) { return -f(x); }, [h], [-6, 6]), vline: [h], max: 165, aria: 'two branches beside a vertical asymptote' }),
      mirror: G({ fns: recFns(function (x) { return f(-x); }, [-h], [-6, 6]), vline: [-h], max: 165, aria: 'two branches beside a vertical asymptote' }),
      abs: G({ fns: recFns(function (x) { return Math.abs(f(x)); }, [h], [-6, 6]), vline: [h], max: 165, aria: 'two branches above the x-axis beside a vertical asymptote' })
    };
    var whys = { neg: 'A reciprocal has the same sign as ' + t('f(x)') + ': where the line is above the ' + t('x') + '-axis, so is ' + t('y=\\frac{1}{f(x)}') + '.', mirror: 'The vertical asymptote is at the ' + t('x') + '-intercept of the line, ' + t('x=' + rt(h)) + '.', abs: 'Where the line is below the ' + t('x') + '-axis its reciprocal is negative too: one branch is below the axis.' };
    var p = mc(r, prompt, ['ok', 'neg', 'mirror', 'abs'].map(function (k) { return { html: gs[k], right: k === 'ok', why: whys[k], code: k }; }),
      'The vertical asymptote is at the ' + t('x') + '-intercept of the line, ' + t('x=' + rt(h)) + ', and the horizontal asymptote is ' + t('y=0') + '. Each branch is on the same side of the ' + t('x') + '-axis as the line, passes through the invariant points on ' + t('y=\\pm 1') + ', and ' + (rv(s.a) > 0 ? 'falls' : 'rises') + ' where the line ' + (rv(s.a) > 0 ? 'rises' : 'falls') + '.',
      ['The reciprocal has the same sign as ' + t('f(x)') + '.', 'Where ' + t('f(x)=0') + ' the reciprocal has a vertical asymptote.'], 'graph of y = 1/f(x) from a line', 2);
    return p;
  }
  function q2b(r, s) { return matchMC(r, s, 'The graph of ' + t('y=f(x)') + ' is shown. Which graph is ' + t('y=\\dfrac{1}{f(x)}') + '?' + lineGraph(s)); }
  function featFields(r, s, prompt, which, den, extraSol) {
    var all = {
      asy: { f: F('Asymptotes', 'asymptotes', 'e.g. x = 3, y = 0'), c: vaCheck(s, true, den), k: Z.asyT([s.h], true), b: Z.asyT([s.h], false) },
      va: { f: F('Vertical asymptote', 'vertical asymptote', 'e.g. x = 3'), c: vaCheck(s, false, den), k: 'x=' + rt(s.h), b: 'x=' + rt(-s.b) },
      inv: { f: F('Invariant points', 'invariant points', 'e.g. (3, 1), (1, -1)'), c: invCheck(s), k: ptsT(invPairs(s)), b: ptsT([[s.x1, 1]]) },
      yi: { f: F(t('y') + '-intercept', 'y-intercept', 'a number'), c: yiCheck(s), k: rt(toR([1, s.b])), b: String(s.b) },
      dom: { f: F('Domain', 'domain', '{x | x != 2, x in R}'), c: domCheck(s), k: domT(s.h), b: domT(-s.h) },
      rng: { f: F('Range', 'range', '{y | y != 0, y in R}'), c: rngCheck(s), k: RNG, b: domT(s.h, 'y') }
    };
    var L = which.map(function (w) { return all[w]; }), keys = L.map(function (x) { return x.k; });
    var bad = L.map(function (x, i) { var b = keys.slice(); b[i] = x.b; return b; }).filter(function (b) { return b.join('|') !== keys.join('|'); });
    var sol = featSol(s, den) + (which.indexOf('dom') >= 0 || which.indexOf('rng') >= 0 ? '<br>Domain ' + t(domT(s.h)) + '; range ' + t(RNG) + '.' : '') + (extraSol || '');
    return Z.fieldsPart(prompt, L.map(function (x) { return x.f; }), L.map(function (x) { return x.c; }), keys, which.map(function (w, i) { return L[i].f.name + ': ' + t(keys[i]); }).join('<br>'), sol, H_FEAT, 'features of y = 1/(ax + b)', bad);
  }
  function q2c(r, s) { return featFields(r, s, 'State the equations of the asymptotes, the invariant points, and the ' + t('y') + '-intercept of ' + t('y=\\dfrac{1}{f(x)}') + '.', ['asy', 'inv', 'yi'], fT(s), s.b === 1 || s.b === -1 ? '<br>(The ' + t('y') + '-intercept is also an invariant point.)' : ''); }

  /* #3: from the graph of a line: the vertical asymptote and y-intercept of the reciprocal */
  function q3(r, kind) {
    var s = kind === 'a' ? spec(r, { slopes: [1], hmax: 5, not: ['1,-3', '1,-2', '1,1'] }) : kind === 'b' ? spec(r, { slopes: [-2, -3, 2, 3], hmax: 4, test: function (z) { return Number.isInteger(z.h) && rv(z.a) < 0 || (Number.isInteger(z.h) && r.chance(0.3)); }, not: ['-2,4', '2,-4'] }) : spec(r, { slopes: [[1, 2], [1, 3], [-1, 2], [1, 4]], hmax: 5, bmax: 3, test: function (z) { return Number.isInteger(z.h); }, not: ['1/3,1', '-1/2,-1'] });
    var den = fT(s);
    return featFields(r, s, 'The graph of ' + t('y=f(x)=' + den) + ' and the guide lines ' + t('y=\\pm 1') + ' are shown. Sketch ' + t('y=\\dfrac{1}{f(x)}') + ' on paper, then state its vertical asymptote and its ' + t('y') + '-intercept.' + lineGraph(s), ['va', 'yi'], den,
      '<br>The sketch: two branches beside ' + t('x=' + rt(s.h)) + ', on the same side of the ' + t('x') + '-axis as the line, through the invariant points.' + recGraph(s, { max: 200 }));
  }

  /* #4: the table without graphing */
  function q4(r, kind) {
    var s = kind === 'a' ? spec(r, { slopes: [1], not: ['1,-5', '1,4'] }) : kind === 'b' ? spec(r, { slopes: [2, 3, 4, 5], test: function (z) { return !Number.isInteger(z.h); }, not: ['4,2', '3,-6'] }) : kind === 'c' ? spec(r, { slopes: [-2, -3, -4], bmin: 1, test: function (z) { return z.b > 0; }, not: ['-3,6', '-2,5'] }) : spec(r, { slopes: [[1, 2], [1, 3], [-1, 2]], bmax: 4, not: ['1/2,-2'] });
    var den = fT(s, kind === 'c');
    return featFields(r, s, 'For ' + t('y=' + recT(den)) + ', state the vertical asymptote, the ' + t('y') + '-intercept, the invariant points and the domain (without graphing).', ['va', 'yi', 'inv', 'dom'], den);
  }
  function q4e(r) {
    var s = spec(r, { slopes: [2, -3, [1, 2], 4] }), den = fT(s);
    return KP.set('State the range of ' + t('y=' + recT(den)) + '.', RNG, { v: 'y', other: domT(s.h), otherName: 'domain', wrong: [{ is: domT(s.h, 'y'), code: CP + 'rng-x', hint: 'The range leaves out the ' + t('y') + '-value the graph never reaches: ' + t('y=0') + ' (the horizontal asymptote). ' + t('x=' + rt(s.h)) + ' is about the domain.' }] },
      'A reciprocal ' + t('\\frac{1}{f(x)}') + ' takes every value except 0 (the numerator is 1): ' + t(RNG) + '. The range is the same for every non-horizontal line.', ['Which ' + t('y') + '-value can ' + t('\\frac{1}{f(x)}') + ' never be?'], 'range of y = 1/(ax + b)');
  }

  /* #5: near the asymptotes */
  function q5Shared(r) { return spec(r, { slopes: [1, -1, 2, -2], test: function (z) { return Number.isInteger(z.h); }, not: ['1,1', '1,-2'] }); }
  function q5stem(s) { return 'Consider ' + t('y=' + recT(fT(s, true))) + '.'; }
  function q5a(r, s) {
    var h = s.h, up = rv(s.a) > 0, R = up ? '+\\infty' : '-\\infty', L = up ? '-\\infty' : '+\\infty';
    var o = function (a, b) { return 'from the right ' + t('y\\to ' + a) + '; from the left ' + t('y\\to ' + b); };
    return mc(r, 'What happens to ' + t('y') + ' as ' + t('x') + ' approaches ' + t(rt(h)) + ' from the right (' + t('x=' + dt(h + 0.1) + ',\\ ' + dt(h + 0.01) + ',\\ \\dots') + ') and from the left (' + t('x=' + dt(h - 0.1) + ',\\ ' + dt(h - 0.01) + ',\\ \\dots') + ')?', [
      { html: o(R, L), right: true }, { html: o(L, R), why: 'Substitute ' + t('x=' + dt(h + 0.01)) + ': the denominator is ' + t(dt(rv(s.a) * 0.01)) + ', so ' + t('y=' + dt(1 / (rv(s.a) * 0.01))) + '.', code: 'swap' },
      { html: o('0', '0'), why: 'Near the vertical asymptote the denominator is close to 0, so ' + t('y') + ' is large.', code: 'zero' }, { html: o(R, R), why: 'On the two sides of ' + t('x=' + rt(h)) + ' the denominator has opposite signs.', code: 'same' }
    ], 'From the right, ' + t(fT(s, true)) + ' is a small ' + (up ? 'positive' : 'negative') + ' number, so ' + t('y') + ' is large and ' + (up ? 'positive' : 'negative') + ' (e.g. ' + t('x=' + dt(h + 0.01)) + ' gives ' + t('y=' + dt(1 / (rv(s.a) * 0.01))) + '): ' + t('y\\to ' + R) + '. From the left, ' + t('y\\to ' + L) + '.', ['Substitute a value just to the right of ' + t(rt(h)) + ', like ' + t(dt(h + 0.01)) + '.', 'The reciprocal of a small number is a large number with the same sign.'], 'behaviour near the vertical asymptote');
  }
  function q5b(r, s) {
    var up = rv(s.a) > 0, A1 = up ? 'above' : 'below', B1 = up ? 'below' : 'above';
    var o = function (a, b) { return 'As ' + t('x\\to+\\infty') + ', ' + t('y') + ' approaches 0 from ' + a + '; as ' + t('x\\to-\\infty') + ', from ' + b + '.'; };
    return mc(r, 'Describe ' + t('y') + ' as ' + t('x') + ' becomes very large and positive, and very large and negative. Why does the graph never touch the ' + t('x') + '-axis?', [
      { html: o(A1, B1) + ' It never reaches 0, because a fraction with numerator 1 is never 0.', right: true },
      { html: o(B1, A1) + ' It never reaches 0, because a fraction with numerator 1 is never 0.', why: 'Check the sign: for large positive ' + t('x') + ' the denominator ' + t(fT(s, true)) + ' is ' + (up ? 'positive' : 'negative') + '.', code: 'swap' },
      { html: o(A1, B1) + ' It reaches 0 when ' + t('x') + ' is large enough.', why: t('\\frac{1}{f(x)}') + ' gets close to 0 but is never 0: the numerator is 1.', code: 'reach' },
      { html: 'As ' + t('x') + ' becomes large, ' + t('y') + ' becomes large too, so the graph moves away from the ' + t('x') + '-axis.', why: 'The reciprocal of a large number is a small number.', code: 'big' }
    ], 'Where ' + t('|f(x)|') + ' is large, ' + t('\\frac{1}{f(x)}') + ' is close to 0 with the same sign as ' + t('f(x)') + '. For large positive ' + t('x') + ', ' + t(fT(s, true)) + ' is ' + (up ? 'positive' : 'negative') + ', so ' + t('y') + ' approaches 0 from ' + A1 + '. The graph never touches the ' + t('x') + '-axis because ' + t('\\frac{1}{f(x)}\\ne 0') + ': the horizontal asymptote is ' + t('y=0') + '.', ['Try ' + t('x=100') + ' and ' + t('x=-100') + '.'], 'behaviour for large |x|');
  }

  /* #6 */
  function q6a(r) {
    var x = nz(r, 1, 8), y = pickWhere(function () { return r.pick([2, 3, 4, 5, 6, 8, 10, -2, -3, -4, -5, -6, -8]); }, function (v) { return !(x === 3 && v === 8); });
    return Z.pointPart(CP, 'The graph of ' + t('y=f(x)') + ' passes through ' + t(pt(x, y)) + '. State the corresponding point on the graph of ' + t('y=\\dfrac{1}{f(x)}') + '.', [x, toR([1, y])], [{ p: [x, -1 / y], code: CP + 'rpt-neg', hint: 'A number and its reciprocal have the <b>same</b> sign.' }, { p: [x, y], code: CP + 'rpt-same', hint: 'The ' + t('y') + '-value becomes its reciprocal.' }, { p: [toR([1, x]), y], code: CP + 'rpt-x', hint: 'The ' + t('x') + '-value stays the same; the ' + t('y') + '-value becomes its reciprocal.' }],
      'The ' + t('x') + '-value stays and the ' + t('y') + '-value becomes its reciprocal: ' + t(pt(x, toR([1, y]))) + '.', ['A point ' + t('(x,\\ y)') + ' on ' + t('y=f(x)') + ' matches ' + t('\\left(x,\\ \\frac{1}{y}\\right)') + '.'], 'point on the reciprocal');
  }
  function q6b(r) {
    var x = nz(r, 1, 8), fv = pickWhere(function () { return r.pick([2.5, -2.5, 4, -4, 5, -5, 10, -10, 1.25, -1.25, 2, -2, 20]); }, function (v) { return !(x === -1 && v === -2.5); }), yv = 1 / fv;
    var p = Z.pointPart(CP, 'The graph of ' + t('y=\\dfrac{1}{f(x)}') + ' passes through ' + t('(' + x + ',\\ ' + dt(yv) + ')') + '. State the corresponding point on the graph of ' + t('y=f(x)') + '.', [x, fv], [{ p: [x, -fv], code: CP + 'rpt-neg', hint: 'A number and its reciprocal have the <b>same</b> sign.' }, { p: [x, yv], code: CP + 'rpt-same', hint: 'The ' + t('y') + '-value of ' + t('f') + ' is the reciprocal: ' + t('\\frac{1}{' + dt(yv) + '}') + '.' }],
      t('\\frac{1}{' + dt(yv) + '}=' + dt(fv)) + ': the point ' + t('(' + x + ',\\ ' + dt(fv) + ')') + '.', ['Take the reciprocal of the ' + t('y') + '-value: ' + t('\\frac{1}{0.4}=2.5') + '.'], 'point on f from the reciprocal');
    p.key = '(' + x + ', ' + dt(fv) + ')';
    return p;
  }
  function q6c(r) {
    var s = spec(r, { slopes: [2, 3, 4, -2, -3, [1, 2]], bmax: 5, not: ['3,-1'] }), k1 = r.pick([2, 3, 4, 5]), k2 = r.pick([2, 3, 4]), av = rv(s.a), den = fT(s);
    var xA = (1 / k1 - s.b) / av, xB = (-k2 - s.b) / av, pairs = [[xA, k1], [xB, -1 / k2]];
    if (toR(xA)[1] > 12 || toR(xB)[1] > 12) return q6c(r);
    return Z.ptsPart(CP, 'For ' + t('f(x)=' + den) + ', determine the points on the graph of ' + t('y=\\dfrac{1}{f(x)}') + ' where ' + t('y=' + k1) + ' and where ' + t('y=-\\frac{1}{' + k2 + '}') + '.', pairs,
      [{ pairs: [[(k1 - s.b) / av, k1], [(-1 / k2 - s.b) / av, -1 / k2]], code: CP + 'rl-point', hint: 'Where the reciprocal is ' + t(k1) + ', ' + t('f(x)=\\frac{1}{' + k1 + '}') + ': solve ' + t(den + '=\\frac{1}{' + k1 + '}') + '.' }, { pairs: [[xA, k1]], code: CP + 'rinv-one', hint: 'Find the second point too, where ' + t('y=-\\frac{1}{' + k2 + '}') + '.' }],
      t('y=' + k1) + ': ' + t(den + '=\\frac{1}{' + k1 + '}') + ', ' + t('x=' + rt(xA)) + ': ' + t(pt(xA, k1)) + '.<br>' + t('y=-\\frac{1}{' + k2 + '}') + ': ' + t(den + '=-' + k2) + ', ' + t('x=' + rt(xB)) + ': ' + t(pt(xB, toR([-1, k2]))) + '.',
      ['Where ' + t('\\frac{1}{f(x)}=k') + ', ' + t('f(x)=\\frac{1}{k}') + '.', 'Solve each linear equation for ' + t('x') + '.'], 'points on the reciprocal from a y-value');
  }
  function q6d(r) {
    var s = spec(r, { slopes: [-1, -2, -3, -4, [-1, 2]], bmin: 1, test: function (z) { return z.b > 0; }, not: ['-2,4'] }), den = fT(s, true), h = s.h;
    var tgt = '\\{x\\mid x<' + rt(h) + ',\\ x\\in\\mathbb{R}\\}';
    var setC = K.set(tgt, { v: 'x', tag: false, wrong: [{ is: '\\{x\\mid x>' + rt(h) + '\\}', code: CP + 'side', hint: 'Test a value: at ' + t('x=' + dt(h - 1)) + ' the denominator ' + t(den) + ' is positive.' }, { is: '\\{x\\mid x<' + rt(-h) + '\\}', code: CP + 'asy-sign', hint: 'The sign changes at the zero of ' + t(den) + ': solve ' + t(den + '=0') + '.' }] });
    var brC = function (v) { var l = plainLow(v); if (/ris|increas|up/.test(l) && !/fall|decreas|down/.test(l)) return ok(); if (/fall|decreas|down/.test(l)) return wrong(CP + 'branch', 'The line falls (its slope is negative), so its reciprocal rises: where ' + t('f') + ' decreases, ' + t('\\frac{1}{f}') + ' increases.'); return form(CP + 'word', 'Type <b>rises</b> or <b>falls</b>.'); };
    var fields = [{ label: t('\\frac{1}{f(x)}>0') + ' when', name: 'positive when', mode: 'math', keys: 'u7k56set', vars: ['x'], placeholder: 'e.g. x < 3' }, { label: 'Each branch (rises or falls)', name: 'branches', mode: 'text', wide: true, placeholder: 'rises or falls' }];
    return Z.fieldsPart('For ' + t('f(x)=' + den) + ', for which values of ' + t('x') + ' is ' + t('\\dfrac{1}{f(x)}') + ' positive? Does each branch of ' + t('y=\\dfrac{1}{f(x)}') + ' rise or fall from left to right?', fields, [setC, brC], ['x<' + rt(h), 'rises'], t('x<' + rt(h)) + '; each branch rises',
      t('\\frac{1}{f(x)}>0') + ' where ' + t(den + '>0') + ', that is ' + t('x<' + rt(h)) + '.<br>The line falls (slope ' + t(rt(s.a)) + '), so each branch of the reciprocal <b>rises</b>, on ' + t('x<' + rt(h)) + ' and on ' + t('x>' + rt(h)) + '.', ['The reciprocal has the same sign as ' + t('f(x)') + '.', 'Where ' + t('f') + ' decreases, ' + t('\\frac{1}{f}') + ' increases.'], 'sign and direction of the reciprocal', [['x>' + rt(h), 'rises'], ['x<' + rt(h), 'falls']]);
  }

  /* #7: the graph of y = 1/f(x): f from its asymptote and y-intercept */
  function q7Shared(r) { return pickWhere(function () { return { h: nz(r, 1, 5), b: nz(r, 2, 4) }; }, function (z) { var m = toR([-z.b, z.h]); z.a = m; z.x1 = (1 - z.b) / rv(m); z.x2 = (-1 - z.b) / rv(m); return m[1] <= 4 && Math.abs(rv(m)) <= 4 && !(z.h === -4 && z.b === -2) && !(z.h === 1.5) && Math.abs(z.x1) <= 7 && Math.abs(z.x2) <= 7; }); }
  function q7stem(s) { return 'The graph of ' + t('y=\\dfrac{1}{f(x)}') + ', where ' + t('f') + ' is linear, is shown. It has the vertical asymptote ' + t('x=' + s.h) + ' and the ' + t('y') + '-intercept ' + t(rt(toR([1, s.b]))) + '.' + recGraph(s, { max: 260, g: { points: [{ x: 0, y: 1 / s.b }], aria: 'the graph of y = 1/f(x): two branches beside the vertical asymptote x = ' + s.h } }); }
  function q7a(r, s) {
    var f = fFn(s), lg = function (fn, aria) { return G({ fns: [crv(fn)], max: 165, aria: aria }); };
    return mc(r, 'Which graph is ' + t('y=f(x)') + '?', [
      { html: lg(f, 'a line'), right: true },
      { html: lg(function (x) { return -f(x); }, 'a line'), why: 'The line has the same sign as its reciprocal: where the reciprocal is above the axis, so is the line.', code: 'neg' },
      { html: lg(function (x) { return f(-x); }, 'a line'), why: 'The line crosses the ' + t('x') + '-axis at the vertical asymptote, ' + t('x=' + s.h) + '.', code: 'mirror' },
      { html: lg(function (x) { return rv(s.a) * (x - s.h) / (s.b * s.b); }, 'a line'), why: 'The line’s ' + t('y') + '-intercept is the reciprocal of ' + t(rt(toR([1, s.b]))) + ', that is ' + t(s.b) + '.', code: 'yint' }
    ], 'The line crosses the ' + t('x') + '-axis at the asymptote, ' + t(pt(s.h, 0)) + ', and its ' + t('y') + '-intercept is ' + t('\\frac{1}{' + rt(toR([1, s.b])) + '}=' + s.b) + ': it passes through ' + t(pt(0, s.b)) + ' (and the invariant points ' + t(ptsT([[s.x1, 1], [s.x2, -1]])) + ').', ['The zero of ' + t('f') + ' is at the vertical asymptote.', 'The line’s ' + t('y') + '-intercept is the reciprocal of the reciprocal’s ' + t('y') + '-intercept.'], 'the line from its reciprocal (MC)', 2);
  }
  function q7b(r, s) {
    var T = lin(s.a, s.b), wr = [{ is: lin(toR([-1, s.b * s.h]), toR([1, s.b])), code: CP + 'rl-point', hint: 'The line’s ' + t('y') + '-intercept is the reciprocal of ' + t(rt(toR([1, s.b]))) + ', that is ' + t(s.b) + '.' }, { is: lin(toR([s.b, s.h]), s.b), code: CP + 'rl-slope', hint: 'Slope ' + t('=\\frac{' + s.b + '-0}{0-(' + s.h + ')}') + '.' }];
    var p = KP.poly('Determine ' + t('f(x)') + ' in the form ' + t('f(x)=ax+b') + '.', T, { wrong: wr, expanded: false }, t('b=' + s.b) + ' (the reciprocal of ' + t(rt(toR([1, s.b]))) + '). The zero is ' + t(s.h) + ': slope ' + t('a=\\frac{' + s.b + '-0}{0-(' + s.h + ')}=' + rt(s.a)) + '.<br>' + t('f(x)=' + tx(T)) + '.',
      ['The line passes through ' + t(pt(s.h, 0)) + ' and ' + t('(0,\\ b)') + ', where ' + t('b') + ' is the reciprocal of the reciprocal’s ' + t('y') + '-intercept.', 'Slope ' + t('=\\frac{\\text{rise}}{\\text{run}}') + '.'], 'linear f from its reciprocal', { before: 'f(x)=' });
    p.bad = wr.map(function (w) { return tx(w.is); });
    return p;
  }

  /* #8 / B2 / #11b / C1: a linear f from features of y = 1/f(x) */
  function backPart(prompt, T, wr, sol, hints) { var p = KP.poly(prompt, T, { wrong: wr, expanded: false }, sol, hints || ['The vertical asymptote of ' + t('y=\\frac{1}{f(x)}') + ' is at the zero of ' + t('f') + '; a point ' + t('(x,\\ k)') + ' on the reciprocal gives ' + t('\\left(x,\\ \\frac{1}{k}\\right)') + ' on the line.', 'Find two points on the line, then its slope and equation.'], 'a linear f from its reciprocal', { before: 'f(x)=' }); p.bad = wr.map(function (w) { return tx(w.is); }).filter(function (b, i, arr) { return arr.indexOf(b) === i && b !== p.key; }); return p; }
  function q8(r) {
    var s = pickWhere(function () { return { h: nz(r, 1, 6), m: toR(r.pick([1, 2, 3, 4, -1, -2, -3, [1, 2], [-1, 2]])), dx: r.pick([1, 2, 3, -1, -2]) }; }, function (z) { z.fv = rv(z.m) * z.dx; return [2, 4, 5, 8, -2, -4, -5, -8, 0.5, -0.5, 10, -10].indexOf(z.fv) >= 0 && !(z.h === 3 && z.dx === 2 && z.fv === 4); });
    var x1 = s.h + s.dx, yv = 1 / s.fv, T = P.scale(lin(1, -s.h), s.m);
    var wr = [{ is: P.scale(lin(1, -s.h), toR(yv / s.dx)), code: CP + 'rl-point', hint: 'On ' + t('y=f(x)') + ' the point is ' + t('(' + x1 + ',\\ ' + dt(s.fv) + ')') + ': take the reciprocal of ' + t(dt(yv)) + '.' }, { is: P.scale(lin(1, s.h), s.m), code: CP + 'rl-sign', hint: 'The asymptote ' + t('x=' + s.h) + ' is the zero of ' + t('f') + ': ' + t('f(' + s.h + ')=0') + '.' }];
    return backPart('The graph of ' + t('y=\\dfrac{1}{f(x)}') + ', where ' + t('f') + ' is linear, has the vertical asymptote ' + t('x=' + s.h) + ' and passes through ' + t('(' + x1 + ',\\ ' + dt(yv) + ')') + '. Determine the equation of ' + t('f(x)') + '.', T, wr,
      t('f(' + s.h + ')=0') + ' and ' + t('f(' + x1 + ')=\\frac{1}{' + dt(yv) + '}=' + dt(s.fv)) + '.<br>Slope ' + t('\\frac{' + dt(s.fv) + '-0}{' + x1 + '-(' + s.h + ')}=' + rt(s.m)) + ': ' + t('f(x)=' + rt(s.m) + '(x' + sgT(-s.h) + ')=' + tx(T)) + '.');
  }

  /* #9: a student's claim about y = 1/(ax + b) */
  function q9Shared(r) { var s = spec(r, { slopes: [2, 3, 4, -2], bmin: 2, test: function (z) { return Math.abs(z.b) !== Math.abs(rv(z.a)) && z.b % rv(z.a) === 0; }, not: ['2,6'] }); s.kind = r.pick(['va', 'va', 'inv']); s.useOne = r.chance(0.5); return s; }
  function q9Info(s) {
    var den = fT(s), ip = s.useOne ? [s.x1, 1] : [s.x2, -1], claimVA = s.kind === 'va' ? -s.b : s.h, claimP = s.kind === 'inv' ? [s.useOne ? s.x2 : s.x1, s.useOne ? 1 : -1] : ip;
    return { den: den, ip: ip, claimVA: claimVA, claimP: claimP };
  }
  function q9stem(s) { var I = q9Info(s); return 'A student says: “The graph of ' + t('y=' + recT(I.den)) + ' has the vertical asymptote ' + t('x=' + rt(I.claimVA)) + ' and passes through the invariant point ' + t(pt(I.claimP[0], I.claimP[1])) + '.”'; }
  function q9a(r, s) {
    var I = q9Info(s), right = s.kind === 'va' ? 'inv' : 'va';
    return mc(r, 'Which part of the statement is correct?', [
      { html: 'Only the asymptote', right: right === 'va', why: 'Check the asymptote: solve ' + t(I.den + '=0') + '.', code: 'va' }, { html: 'Only the invariant point', right: right === 'inv', why: 'Check the point: substitute ' + t('x=' + rt(I.claimP[0])) + ' into ' + t(I.den) + '.', code: 'inv' },
      { html: 'Both parts', why: 'Check each part separately.', code: 'both' }, { html: 'Neither part', why: 'One part checks: substitute, or solve ' + t(I.den + '=0') + '.', code: 'neither' }
    ], 'Asymptote: ' + t(I.den + '=0') + ' gives ' + t('x=' + rt(s.h)) + (s.kind === 'va' ? ', not ' + t(rt(I.claimVA)) + ' (the student used the constant term)' : ' ✓') + '.<br>Point: at ' + t('x=' + rt(I.claimP[0])) + ', ' + t(I.den + '=' + rt(rv(s.a) * rv(I.claimP[0]) + s.b)) + (s.kind === 'inv' ? ', so the point on the graph is ' + t(pt(I.claimP[0], toR([1, Math.round(rv(s.a) * rv(I.claimP[0]) + s.b)]))) + ', not ' + t(pt(I.claimP[0], I.claimP[1])) : ', so ' + t('y=' + I.claimP[1]) + ' ✓') + '.', ['Solve ' + t(I.den + '=0') + ' for the asymptote.', 'Substitute the point’s ' + t('x') + '-value to check its ' + t('y') + '-value.'], 'checking a claim (MC)', 2);
  }
  function q9b(r, s) {
    var I = q9Info(s);
    if (s.kind === 'va') return Z.asyPart(CP, 'Correct the error: state the vertical asymptote.', { xs: [s.h], hz: false }, { wrongs: [{ xs: [-s.b], code: CP + 'asy-const', hint: 'Solve ' + t(I.den + '=0') + ' for ' + t('x') + '.' }] }, t(I.den + '=0') + ', ' + t('x=' + rt(s.h)) + '.', ['Solve ' + t(I.den + '=0') + '.'], 'correcting the asymptote');
    var right = s.useOne ? [s.x1, 1] : [s.x2, -1];
    return Z.pointPart(CP, 'Correct the error: state the invariant point with the same ' + t('y') + '-value the student gave.', right, [{ p: I.claimP, code: CP + 'rinv-swap', hint: 'Substitute ' + t('x=' + rt(I.claimP[0])) + ' into the line: it gives ' + t(-I.claimP[1]) + ', not ' + t(I.claimP[1]) + '.' }], t(I.den + '=' + right[1]) + ' gives ' + t('x=' + rt(right[0])) + ': the invariant point is ' + t(pt(right[0], right[1])) + '.', ['Solve ' + t(I.den + '=' + right[1]) + '.'], 'correcting the invariant point');
  }

  /* #10 */
  function q10a(r) {
    return mc(r, 'Why does the reciprocal of a non-horizontal linear function always have exactly one vertical asymptote?', [
      { html: 'The line crosses the ' + t('x') + '-axis exactly once, so ' + t('f(x)=0') + ' at exactly one ' + t('x') + '-value.', right: true },
      { html: 'The line crosses the ' + t('y') + '-axis exactly once.', why: 'The vertical asymptote is where the denominator ' + t('f(x)') + ' is 0: the ' + t('x') + '-intercept, not the ' + t('y') + '-intercept.', code: 'yax' },
      { html: 'The line meets ' + t('y=1') + ' and ' + t('y=-1') + ' once each.', why: 'Those are the invariant points, not the asymptote.', code: 'inv' },
      { html: 'Every reciprocal function has exactly one vertical asymptote.', why: 'Not so: a quadratic can have two zeros (two asymptotes) or none.', code: 'all' }
    ], 'The vertical asymptote of ' + t('y=\\frac{1}{f(x)}') + ' is where ' + t('f(x)=0') + '. A non-horizontal line crosses the ' + t('x') + '-axis exactly once.', ['Where is ' + t('\\frac{1}{f(x)}') + ' undefined?'], 'why one asymptote (MC)');
  }
  function q10b(r) {
    var c = pickWhere(function () { return r.pick([3, 4, 5, -2, -3, -4, 0.5, -0.5, 0.25]); }, function () { return true; }), ct = dt(c), rc = rt(toR(1 / c));
    return mc(r, 'Describe the graph of ' + t('y=\\dfrac{1}{f(x)}') + ' when ' + t('f(x)=' + ct) + ' (a horizontal line). Does it have a vertical asymptote or invariant points?', [
      { html: 'The horizontal line ' + t('y=' + rc) + '; no vertical asymptote and no invariant points.', right: true },
      { html: 'The horizontal line ' + t('y=' + rc) + ' with the vertical asymptote ' + t('x=0') + '.', why: t('f') + ' is never 0, so the reciprocal is defined everywhere.', code: 'va' },
      { html: 'The horizontal line ' + t('y=' + rt(toR(-1 / c))) + '; no vertical asymptote and no invariant points.', why: 'A reciprocal keeps the sign.', code: 'neg' },
      { html: 'Two branches with asymptotes ' + t('x=0') + ' and ' + t('y=0') + ', like ' + t('y=\\frac{1}{x}') + '.', why: 'Here ' + t('f(x)') + ' is the same number for every ' + t('x') + ', so its reciprocal is too.', code: 'hyper' }
    ], t('\\frac{1}{' + ct + '}=' + rc) + ' for every ' + t('x') + ': the horizontal line ' + t('y=' + rc) + '. ' + t('f') + ' is never 0 (no vertical asymptote) and never ' + t('\\pm 1') + ' (no invariant points).', ['Every ' + t('y') + '-value of ' + t('f') + ' is ' + t(ct) + '.'], 'reciprocal of a horizontal line (MC)');
  }

  /* #11 */
  function q11a(r) {
    var s = pickWhere(function () { return { c: nz(r, 1, 4), x0: nz(r, 1, 4), y0: r.pick([1, -1, 0.5, -0.5, 0.25, -0.25, 0.2]) }; }, function (z) { z.k = (1 / z.y0 - z.c) / z.x0; return z.k !== 0 && toR(z.k)[1] <= 3 && Math.abs(z.k) <= 6 && !(z.c === 1 && z.x0 === 2 && z.y0 === -1); });
    var kv = s.k, h = -s.c / kv, den = 'kx' + sgT(s.c);
    var fields = [{ label: t('k='), name: 'k', mode: 'math', keys: 'u7asy' }, { label: 'Vertical asymptote', name: 'vertical asymptote', mode: 'math', keys: 'u7asy', placeholder: 'x = …' }];
    var kC = Z.valCheck(CP, toR(kv), [{ v: -kv, code: CP + 'k-sign', hint: 'Check the sign: ' + t('\\frac{1}{' + dt(s.y0) + '}=' + dt(1 / s.y0)) + '.' }, { v: (s.y0 - s.c) / s.x0, code: CP + 'rl-point', hint: 'Where ' + t('y=' + dt(s.y0)) + ', the denominator is ' + t('\\frac{1}{' + dt(s.y0) + '}=' + dt(1 / s.y0)) + '.' }]).check;
    var aC = Z.asyCheck(CP, { xs: [h], hz: false }, { wrongs: [{ xs: [-h], code: CP + 'asy-sign', hint: 'Solve ' + t(tx(lin(toR(kv), s.c)) + '=0') + '.' }] });
    var keys = [rt(toR(kv)), 'x=' + rt(toR(h))];
    return Z.fieldsPart('The graph of ' + t('y=\\dfrac{1}{' + den + '}') + ' passes through ' + t('(' + s.x0 + ',\\ ' + dt(s.y0) + ')') + '. Determine ' + t('k') + ' and the vertical asymptote.', fields, [kC, aC], keys, t('k=' + keys[0]) + '; ' + t(keys[1]),
      t('\\frac{1}{' + s.x0 + 'k' + sgT(s.c) + '}=' + dt(s.y0)) + ', so ' + t(s.x0 + 'k' + sgT(s.c) + '=' + dt(1 / s.y0)) + ', ' + t('k=' + keys[0]) + '.<br>' + t('f(x)=' + tx(lin(toR(kv), s.c))) + ': vertical asymptote ' + t(keys[1]) + '.', ['Substitute the point: ' + t('\\frac{1}{f(' + s.x0 + ')}=' + dt(s.y0)) + ', so ' + t('f(' + s.x0 + ')=\\frac{1}{' + dt(s.y0) + '}') + '.', 'Then solve ' + t('f(x)=0') + ' for the asymptote.'], 'k from a point on the reciprocal', [[rt(toR(-kv)), keys[1]], [keys[0], 'x=' + rt(toR(-h))]]);
  }
  function q11b(r) {
    var s = pickWhere(function () { return { x1: r.int(-6, 5), w: nz(r, 1, 4) }; }, function (z) { z.x2 = z.x1 + z.w; return Math.abs(z.x2) <= 7 && !(z.x1 === 1 && z.x2 === 3); });
    var m = toR([-2, s.w]), b = rv(m) * -s.x1 + 1, T = lin(m, toR(b)), h = (s.x1 + s.x2) / 2;
    var fields = [{ label: t('f(x)='), name: 'f(x)', mode: 'math', keys: 'u7k56feat' }, { label: 'Vertical asymptote', name: 'vertical asymptote', mode: 'math', keys: 'u7k56feat', placeholder: 'x = …' }];
    var fC = K.poly(T, { expanded: false, wrong: [{ is: lin(toR([2, s.w]), toR(-2 * s.x1 / s.w + 1)), code: CP + 'rl-slope', hint: 'Slope ' + t('=\\frac{-1-1}{' + s.x2 + '-(' + s.x1 + ')}') + '.' }] });
    var fC2 = function (resp) { var v = String(resp || '').replace(/^\s*f\(x\)\s*=/, ''); return fC(v); };
    var aC = Z.asyCheck(CP, { xs: [h], hz: false }, { wrongs: [{ xs: [-h], code: CP + 'asy-sign', hint: 'The asymptote is at the zero of ' + t('f') + '.' }] });
    var keys = [tx(T), 'x=' + rt(toR(h))];
    return Z.fieldsPart('The invariant points of the graph of ' + t('y=\\dfrac{1}{f(x)}') + ', where ' + t('f') + ' is linear, are ' + t(pt(s.x1, 1)) + ' and ' + t(pt(s.x2, -1)) + '. Determine ' + t('f(x)') + ' and the vertical asymptote.', fields, [fC2, aC], keys, t('f(x)=' + keys[0]) + '; ' + t(keys[1]),
      'Both points are on the line: slope ' + t('\\frac{-1-1}{' + s.x2 + '-(' + s.x1 + ')}=' + rt(m)) + ', so ' + t('f(x)=' + keys[0]) + '.<br>Its zero is ' + t('x=' + rt(toR(h))) + ', midway between the invariant points: the vertical asymptote ' + t(keys[1]) + '.', ['Invariant points are on both graphs, so on the line.', 'The asymptote is where ' + t('f(x)=0') + ' (midway between the two invariant points).'], 'f and the asymptote from the invariant points', [[keys[0], 'x=' + rt(toR(-h || 1))]]);
  }

  /* #12–#14, B4: multiple choice */
  function q12(r) {
    var s = spec(r, { slopes: [2, 3, 4, 5], bmin: 2, test: function (z) { return Number.isInteger(z.h) && Math.abs(z.b) !== Math.abs(z.h); }, not: ['3,12'] }), den = fT(s);
    return mc(r, 'The vertical asymptote of the graph of ' + t('y=' + recT(den)) + ' is', [
      { html: t('x=' + rt(s.h)), right: true }, { html: t('x=' + (-s.b)), why: 'That is the opposite of the constant term. Solve ' + t(den + '=0') + '.', code: 'const' },
      { html: t('x=' + rt(-s.h)), why: 'Check the sign: solve ' + t(den + '=0') + '.', code: 'sign' }, { html: t('y=' + rt(s.h)), why: 'A vertical asymptote is a vertical line ' + t('x=a') + '.', code: 'y' }
    ], t(den + '=0') + ' gives ' + t('x=' + rt(s.h)) + '.', ['Where is the denominator 0?'], 'vertical asymptote (MC)', 2);
  }
  /* statements about y = 1/(ax + b): one false (#13) or one true (B4) */
  function stmts(s, den) {
    var av = rv(s.a), h = s.h, up = av > 0, yi = toR([1, s.b]);
    return [
      { T: 'The vertical asymptote is ' + t('x=' + rt(h)) + '.', F: 'The vertical asymptote is ' + t('x=' + rt(-s.b)) + '.', why: 'Solve ' + t(den + '=0') + '.' },
      { T: t(pt(s.x1, 1)) + ' is an invariant point.', F: t(pt(s.x1, -1)) + ' is an invariant point.', why: 'At ' + t('x=' + rt(s.x1)) + ', ' + t(den + '=1') + '.' },
      { T: t('y>0') + ' when ' + t('x' + (up ? '>' : '<') + rt(h)) + '.', F: t('y>0') + ' when ' + t('x' + (up ? '<' : '>') + rt(h)) + '.', why: 'The reciprocal has the sign of ' + t(den) + ': test a value.' },
      { T: 'For ' + t('x>' + rt(h)) + ', ' + t('y') + ' ' + (up ? 'decreases' : 'increases') + ' as ' + t('x') + ' increases.', F: 'For ' + t('x>' + rt(h)) + ', ' + t('y') + ' ' + (up ? 'increases' : 'decreases') + ' as ' + t('x') + ' increases.', why: 'The line ' + (up ? 'rises' : 'falls') + ', so each branch of its reciprocal ' + (up ? 'falls' : 'rises') + '.' },
      { T: 'The ' + t('y') + '-intercept is ' + t(rt(yi)) + '.', F: 'The ' + t('y') + '-intercept is ' + t(s.b) + '.', why: 'The reciprocal’s ' + t('y') + '-intercept is ' + t('\\frac{1}{f(0)}') + '.' }
    ];
  }
  function stmtMC(r, wantFalse, o) {
    var s = spec(r, Object.assign({ slopes: [2, -2, 3, -3, 4], bmax: 8, test: function (z) { return Math.abs(z.b) > 1; } }, o || {})), den = fT(s, r.chance(0.4)), L = r.shuffle(stmts(s, den)).slice(0, 4), odd = r.int(0, 3);
    var opts = L.map(function (x, i) { var isOdd = i === odd; return { html: isOdd ? (wantFalse ? x.F : x.T) : (wantFalse ? x.T : x.F), right: isOdd, why: isOdd ? null : (wantFalse ? 'This one is true. ' : 'This one is false. ') + x.why, code: 's' + i }; });
    var x = L[odd];
    return mc(r, 'Which statement about the graph of ' + t('y=' + recT(den)) + ' is ' + (wantFalse ? '<b>false</b>' : '<b>true</b>') + '?', opts,
      featSol(s, den) + '<br>' + (wantFalse ? 'The false one: “' + x.F + '” ' + x.why : 'The true one: “' + x.T + '”') + ' (The line ' + (rv(s.a) > 0 ? 'rises, so each branch falls' : 'falls, so each branch rises') + '; ' + t('y>0') + ' where ' + t(den + '>0') + '.)', ['Find the asymptote, invariant points and ' + t('y') + '-intercept, and test the sign on each side of the asymptote.'], 'statements about the reciprocal (MC)');
  }
  function q14(r) {
    var s = pickWhere(function () { return { h: nz(r, 1, 5), m: r.pick([1, 2, -1, 3, [1, 2]]), dx: r.pick([1, -1, 2]) }; }, function (z) { z.mv = rv(toR(z.m)); z.fv = z.mv * z.dx; return [1, -1, 2, -2, 4, 0.5, -0.5].indexOf(z.fv) >= 0 && !(z.h === -3 && z.dx === 1 && z.mv === 1); });
    var m = toR(s.m), x1 = s.h + s.dx, yv = 1 / s.fv, T = P.scale(lin(1, -s.h), m), Tt = function (p) { return t('f(x)=' + tx(p)); };
    return mc(r, 'The graph of ' + t('y=\\dfrac{1}{f(x)}') + ', ' + t('f') + ' linear, has the vertical asymptote ' + t('x=' + s.h) + ' and passes through ' + t('(' + x1 + ',\\ ' + dt(yv) + ')') + '. The equation of ' + t('f') + ' is', [
      { html: Tt(T), right: true }, { html: Tt(P.scale(lin(1, s.h), m)), why: 'The zero of ' + t('f') + ' is at the asymptote, ' + t('x=' + s.h) + '.', code: 'sign' },
      { html: Tt(P.scale(T, -1)), why: 'Check the point: this gives ' + t('f(' + x1 + ')=' + dt(-s.fv)) + '.', code: 'neg' }, { html: Tt(P.scale(T, 3)), why: 'Check the point: this gives ' + t('f(' + x1 + ')=' + dt(3 * s.fv)) + ', not ' + t(dt(s.fv)) + '.', code: 'scale' }
    ], t('f(' + s.h + ')=0') + ' and ' + t('f(' + x1 + ')=\\frac{1}{' + dt(yv) + '}=' + dt(s.fv)) + ': slope ' + t(rt(m)) + ', so ' + Tt(T) + '.', ['The asymptote is at the zero of ' + t('f') + '.', 'The point on the line is ' + t('\\left(x,\\ \\frac{1}{y}\\right)') + '.'], 'f from asymptote and point (MC)', 2);
  }

  /* #15, B5: NR value of the reciprocal at a point */
  function nrP(r, dp) {
    var s = pickWhere(function () { return dp === 1 ? { a: toR(r.pick([[1, 4], [1, 2], [1, 5], [3, 4]])), b: r.int(1, 3), x: r.int(1, 9) } : { a: r.int(2, 5), b: -r.pick([1.5, 2.5, 3.5, 4.5, 0.5, 1.2]), x: r.int(1, 4) }; }, function (z) { z.f = rv(z.a) * z.x + z.b; return z.f > 1.05 && !(dp === 1 && z.x === 6 && rv(z.a) === 0.25 && z.b === 1) && !(dp === 2 && z.a === 3 && z.b === -4.5 && z.x === 2); });
    var den = dp === 1 ? tx(lin(s.a, s.b)) : s.a + 'x-' + dt(-s.b);
    var p = KP.approx('For ' + t('f(x)=' + den) + ', the graph of ' + t('y=\\dfrac{1}{f(x)}') + ' passes through ' + t('(' + s.x + ',\\ p)') + '. The value of ' + t('p') + ', to the nearest ' + (dp === 1 ? 'tenth' : 'hundredth') + ', is ____.', 1 / s.f, dp, { nr: true },
      t('f(' + s.x + ')=' + dt(s.f)) + ', so ' + t('p=\\frac{1}{' + dt(s.f) + '}\\approx ' + (1 / s.f).toFixed(dp)) + '.', ['Evaluate ' + t('f(' + s.x + ')') + ', then take the reciprocal.'], 'value of the reciprocal (NR)');
    p.bad = [String(+s.f.toFixed(dp))];
    return p;
  }
  /* #16: NR a + b for the invariant points */
  function q16(r) {
    var s = spec(r, { slopes: [2, 3, 4, 5], bmin: 2, test: function (z) { var sum = 2 * z.h; return sum > 0 && Number.isInteger(sum * 10) && sum < 100; }, not: ['4,-10'] }), den = fT(s), sum = s.x1 + s.x2;
    var p = KP.nr('The graph of ' + t('y=' + recT(den)) + ' has invariant points ' + t('(a,\\ 1)') + ' and ' + t('(b,\\ -1)') + '. The value of ' + t('a+b') + ' is ____.', +sum.toFixed(6), function (v) { if (Math.abs(v - s.h) < 1e-9) return { code: CP + 'rinv-one', hint: 'That is the asymptote, halfway between ' + t('a') + ' and ' + t('b') + '. Add both.' }; return null; },
      t(den + '=1') + ' gives ' + t('a=' + rt(s.x1)) + '; ' + t(den + '=-1') + ' gives ' + t('b=' + rt(s.x2)) + '. ' + t('a+b=' + dt(sum)) + '.', ['Solve ' + t(den + '=1') + ' and ' + t(den + '=-1') + '.'], 'sum of the invariant x-values (NR)');
    p.bad = [dt(s.h)];
    return p;
  }

  /* ---------------- Extra practice ---------------- */
  function epA1(r, kind) {
    var s = kind === 'a' ? spec(r, { slopes: [[1, 2], [-1, 2], [1, 3]], bmax: 3, hmax: 5, test: function (z) { return Number.isInteger(z.h) && Number.isInteger(z.x1) && Number.isInteger(z.x2) && Math.abs(z.x1) <= 6 && Math.abs(z.x2) <= 6; }, not: ['1/2,2'] }) : spec(r, { slopes: [-3, -2, 3, 2], bmax: 6, test: function (z) { return Number.isInteger(z.h) && Math.abs(z.h) <= 3; }, not: ['-3,-3'] });
    var den = fT(s);
    return featFields(r, s, 'Sketch ' + t('y=\\dfrac{1}{f(x)}') + ' for ' + t('f(x)=' + den) + ' (shown with ' + t('y=\\pm 1') + ') on paper, then state the vertical asymptote and the invariant points.' + lineGraph(s), ['va', 'inv'], den, recGraph(s, { max: 200 }));
  }
  function epA2(r, kind) {
    var s = kind === 'a' ? spec(r, { slopes: [2, 3, 4], test: function (z) { return Math.abs(z.b) > 2; }, not: ['2,8'] }) : spec(r, { slopes: [-1], bmin: 1, test: function (z) { return z.b > 0; }, not: ['-1,3'] });
    var den = fT(s, kind === 'b');
    return featFields(r, s, 'For ' + t('y=' + recT(den)) + ', state the vertical asymptote, the ' + t('y') + '-intercept, the invariant points, the domain and the range.', ['va', 'yi', 'inv', 'dom', 'rng'], den);
  }
  function epA3(r) {
    var s = spec(r, { slopes: [2, 3, 4, 5, -3], bmax: 6, test: function (z) { return !Number.isInteger(z.h); }, not: ['5,-2'] }), av = rv(s.a), den = fT(s);
    var xs = [0, s.h].concat(r.shuffle([1, -1, 2, -2, 3]).slice(0, 2)).sort(function (p, q) { return p - q; });
    var rows = xs.map(function (x) { var fv = Math.round((av * x + s.b) * 1e9) / 1e9; return { fv: fv, label: t('x=' + rt(x)) + ' → ' + t('\\frac{1}{f(x)}'), name: 'x = ' + rt(x) }; });
    return recipTable('For ' + t('f(x)=' + den) + ', evaluate ' + t('\\dfrac{1}{f(x)}') + ' at each value of ' + t('x') + '.', rows, rows.map(function (rw) { return t('f(' + rt(rw.fv === 0 ? s.h : (rw.fv - s.b) / av) + ')=' + dt(rw.fv)) + ': ' + recipSol(rw.fv); }).join('<br>') + '<br>(' + t('x=' + rt(s.h)) + ' is the vertical asymptote.)', ['Evaluate ' + t('f(x)') + ' first, then take its reciprocal.', 'Where ' + t('f(x)=0') + ' the reciprocal is undefined.'], 'evaluating y = 1/f(x)');
  }
  function epA4(r) {
    var m = toR(r.pick([-1, -2, 2, [-1, 2], [1, 2], -3, 3])), mv = rv(m), s = { a: m, b: 0, h: 0, x1: 1 / mv, x2: -1 / mv };
    var mx = (mv === -1 ? '-' : mv === 1 ? '' : rt(m)) + 'x', den = mx;
    var fields = [F('Invariant points', 'invariant points', 'e.g. (1, 1), (-1, -1)'), F('Asymptotes', 'asymptotes', 'e.g. x = 0, y = 0')];
    var invC = Z.ptsCheck(CP, invPairs(s), [{ pairs: [[s.x1, 1]], code: CP + 'rinv-one', hint: 'There is another, where ' + t('y=' + mx) + ' meets ' + t('y=-1') + '.' }, { pairs: [[s.x2, -1]], code: CP + 'rinv-one', hint: 'There is another, where ' + t('y=' + mx) + ' meets ' + t('y=1') + '.' }, { pairs: [[s.x1, -1], [s.x2, 1]], code: CP + 'rinv-swap', hint: 'Substitute each ' + t('x') + ' into ' + t('y=' + mx) + '.' }]);
    var aC = Z.asyCheck(CP, { xs: [0], hz: true }, {});
    var keys = [ptsT(invPairs(s)), 'x=0,\\ y=0'];
    return Z.fieldsPart('Sketch ' + t('y=' + mx) + ' and ' + t('y=' + recT(mx)) + ' on the same grid (check with a calculator). State the invariant points and the asymptotes of ' + t('y=' + recT(mx)) + '.', fields, [invC, aC], keys, t(keys[0]) + '; ' + t(keys[1]),
      t(mx + '=1') + ' at ' + t('x=' + rt(s.x1)) + ', ' + t(mx + '=-1') + ' at ' + t('x=' + rt(s.x2)) + ': ' + t(keys[0]) + '.<br>Asymptotes ' + t('x=0') + ' and ' + t('y=0') + '. The branches are in quadrants ' + (mv > 0 ? '1 and 3' : '2 and 4') + '.' + G({ fns: [crv(function (x) { return mv * x; })].concat(recFns(function (x) { return mv * x; }, [0], [-6, 6])), max: 200, aria: 'the line and its reciprocal' }),
      ['Invariant points: where ' + t(mx + '=1') + ' or ' + t(mx + '=-1') + '.', 'The zero of ' + t(mx) + ' is ' + t('x=0') + '.'], 'y = mx and its reciprocal', [[ptsT([[s.x1, 1]]), keys[1]], [keys[0], 'x=0']]);
  }
  function epB1Shared(r) { return pickWhere(function () { return { a: r.pick([1, 2, 4, 5, -2, -5]), h: toR(r.pick([1, 2, 3, -1, -2, [1, 2], [3, 2], [-1, 2], [5, 2]])) }; }, function (z) { return Number.isInteger(z.a * rv(z.h)) && !(z.a === 2 && rv(z.h) === 0.5); }); }
  function epB1T(s) { var hv = rv(s.h), b = -s.a * hv; return { den: tx(lin(s.a, toR(b))), b: b }; }
  function epB1stem(s) { return 'Consider ' + t('y=' + recT(epB1T(s).den)) + ' near ' + t('x=' + rt(s.h)) + '.'; }
  function epB1a(r, s) {
    var hv = rv(s.h), D = epB1T(s), xs = [hv - 0.1, hv - 0.01, hv + 0.01, hv + 0.1];
    var rows = xs.map(function (x) { var fv = Math.round(s.a * (x - hv) * 1e9) / 1e9; return { fv: fv, label: t('x=' + dt(x)) + ' → ' + t('y'), name: 'x = ' + dt(x) }; });
    return recipTable('Complete the table of values of ' + t('y=' + recT(D.den)) + '.', rows, rows.map(function (rw, i) { return t('x=' + dt(xs[i])) + ': ' + t(D.den + '=' + dt(rw.fv)) + ', ' + recipSol(rw.fv); }).join('<br>'), ['Evaluate the denominator first (it is small), then take the reciprocal.'], 'table near the asymptote');
  }
  function epB1b(r, s) {
    var up = s.a > 0, h = rt(s.h);
    return mc(r, 'Describe the graph near ' + t('x=' + h) + '.', [
      { html: 'Left of ' + t('x=' + h) + ' the graph ' + (up ? 'falls toward ' + t('-\\infty') : 'rises toward ' + t('+\\infty')) + '; right of it the graph ' + (up ? 'rises toward ' + t('+\\infty') : 'falls toward ' + t('-\\infty')) + '. The line ' + t('x=' + h) + ' is the vertical asymptote.', right: true },
      { html: 'Left of ' + t('x=' + h) + ' the graph ' + (up ? 'rises toward ' + t('+\\infty') : 'falls toward ' + t('-\\infty')) + '; right of it the graph ' + (up ? 'falls toward ' + t('-\\infty') : 'rises toward ' + t('+\\infty')) + '.', why: 'Look at the signs in the table on each side.', code: 'swap' },
      { html: 'The graph crosses the ' + t('x') + '-axis at ' + t('x=' + h) + '.', why: 'The reciprocal is never 0; at ' + t('x=' + h) + ' it is undefined.', code: 'cross' },
      { html: 'The graph gets close to ' + t('y=0') + ' near ' + t('x=' + h) + '.', why: 'Near the vertical asymptote the values are large, not small.', code: 'zero' }
    ], 'The table shows ' + t('|y|') + ' getting larger as ' + t('x') + ' gets closer to ' + t(h) + ', ' + (up ? 'negative on the left and positive on the right' : 'positive on the left and negative on the right') + ': ' + t('x=' + h) + ' is the vertical asymptote.', ['Use the signs and sizes of the values in the table.'], 'behaviour near the asymptote (MC)');
  }
  function epB2(r) {
    var s = pickWhere(function () { return { h: nz(r, 1, 6), b: nz(r, 1, 6) }; }, function (z) { var m = toR([-z.b, z.h]); return m[1] <= 3 && !(z.h === -2 && z.b === 4); });
    var m = toR([-s.b, s.h]), T = lin(m, s.b);
    return backPart('The graph of ' + t('y=\\dfrac{1}{f(x)}') + ', where ' + t('f') + ' is linear, has the vertical asymptote ' + t('x=' + s.h) + ' and the ' + t('y') + '-intercept ' + t(rt(toR([1, s.b]))) + '. Determine ' + t('f(x)') + '.', T,
      [{ is: lin(toR([-1, s.b * s.h]), toR([1, s.b])), code: CP + 'rl-point', hint: 'The line’s ' + t('y') + '-intercept is the reciprocal of ' + t(rt(toR([1, s.b]))) + ', that is ' + t(s.b) + '.' }, { is: lin(toR([s.b, s.h]), s.b), code: CP + 'rl-slope', hint: 'Slope ' + t('=\\frac{' + s.b + '-0}{0-(' + s.h + ')}') + '.' }],
      t('f(' + s.h + ')=0') + ' and ' + t('f(0)=' + s.b) + '. Slope ' + t('\\frac{' + s.b + '-0}{0-(' + s.h + ')}=' + rt(m)) + ': ' + t('f(x)=' + tx(T)) + '.');
  }
  function epB3Shared(r) { return pickWhere(function () { return { h: nz(r, 1, 4), k: r.pick([2, 3, 4, 5]) }; }, function (z) { return !(z.h === 1 && z.k === 3); }); }
  function epB3T(s) { return { d1: tx(lin(1, -s.h)), d2: tx(lin(s.k, -s.k * s.h)) }; }
  function epB3stem(s) { var D = epB3T(s); return 'Compare the graphs of ' + t('y=' + recT(D.d1)) + ' and ' + t('y=' + recT(D.d2)) + '.'; }
  function epB3a(r, s) {
    var D = epB3T(s);
    return mc(r, 'Which statement is true?', [
      { html: 'They have the same asymptotes ' + t('x=' + s.h) + ' and ' + t('y=0') + ', but the ' + t('y') + '-values of the second are ' + t('\\frac{1}{' + s.k + '}') + ' as large, so its invariant points are closer to the asymptote.', right: true },
      { html: 'They have different vertical asymptotes, ' + t('x=' + s.h) + ' and ' + t('x=' + s.k * s.h) + '.', why: t(D.d2 + '=' + s.k + '(' + D.d1 + ')') + ': both are 0 at ' + t('x=' + s.h) + '.', code: 'va' },
      { html: 'They are the same graph.', why: 'At ' + t('x=' + (s.h + 1)) + ' the first is ' + t(1) + ' and the second is ' + t('\\frac{1}{' + s.k + '}') + '.', code: 'same' },
      { html: 'They have the same invariant points.', why: 'The second meets ' + t('y=1') + ' where ' + t(D.d2 + '=1') + ', at ' + t('x=' + rt(toR(s.h + 1 / s.k))) + '.', code: 'inv' }
    ], 'Alike: both have asymptotes ' + t('x=' + s.h) + ' and ' + t('y=0') + ', the same domain and range, and are positive for ' + t('x>' + s.h) + '.<br>Different: ' + t(D.d2 + '=' + s.k + '(' + D.d1 + ')') + ', so the second has ' + t('y') + '-values ' + t('\\frac{1}{' + s.k + '}') + ' as large; its invariant points are closer to the asymptote.', ['Factor the second denominator.'], 'comparing two reciprocals (MC)');
  }
  function epB3b(r, s) {
    var D = epB3T(s), s2 = { a: [s.k, 1], b: -s.k * s.h, h: s.h, x1: s.h + 1 / s.k, x2: s.h - 1 / s.k };
    return Z.ptsPart(CP, 'State the invariant points of ' + t('y=' + recT(D.d2)) + '.', invPairs(s2), invWrongs(s2).concat([{ pairs: [[s.h + 1, 1], [s.h - 1, -1]], code: CP + 'rl-point', hint: 'Those are the invariant points of the first function. Solve ' + t(D.d2 + '=1') + ' and ' + t(D.d2 + '=-1') + '.' }]),
      t(D.d2 + '=1') + ' gives ' + t('x=' + rt(toR(s2.x1))) + '; ' + t(D.d2 + '=-1') + ' gives ' + t('x=' + rt(toR(s2.x2))) + ': ' + t(ptsT(invPairs(s2))) + ' (the first has ' + t(ptsT([[s.h + 1, 1], [s.h - 1, -1]])) + ').', ['Solve ' + t('f(x)=1') + ' and ' + t('f(x)=-1') + '.'], 'invariant points');
  }
  function epC1(r) {
    var s = pickWhere(function () { return { h: nz(r, 1, 5), dx: nz(r, 1, 4) }; }, function (z) { return !(z.h === 4 && z.dx === 2) && Math.abs(z.h + z.dx) <= 8 && Math.abs(z.h - z.dx) <= 8; });
    var m = toR([1, s.dx]), T = P.scale(lin(1, -s.h), m), other = [s.h - s.dx, -1], x1 = s.h + s.dx;
    var fields = [{ label: t('f(x)='), name: 'f(x)', mode: 'math', keys: 'u7k56feat' }, { label: 'Other invariant point', name: 'other invariant point', mode: 'math', keys: 'u7k56feat', placeholder: '(x, y)' }];
    var fC = K.poly(T, { expanded: false, wrong: [{ is: P.scale(lin(1, -s.h), s.dx), code: CP + 'rl-slope', hint: 'Slope ' + t('=\\frac{1-0}{' + x1 + '-(' + s.h + ')}') + '.' }] });
    var pc = Z.pointChk(CP, other, [{ p: [s.h - s.dx, 1], code: CP + 'rinv-swap', hint: 'The other invariant point is on ' + t('y=-1') + '.' }, { p: [x1, -1], code: CP + 'rinv-swap', hint: 'Solve ' + t('f(x)=-1') + '.' }]);
    var keys = [tx(T), pt(other[0], other[1])];
    return Z.fieldsPart('The graph of ' + t('y=\\dfrac{1}{f(x)}') + ', ' + t('f') + ' linear, has the vertical asymptote ' + t('x=' + s.h) + ' and the invariant point ' + t(pt(x1, 1)) + '. Determine ' + t('f(x)') + ' and the other invariant point.', fields, [function (v) { return fC(String(v || '').replace(/^\s*f\(x\)\s*=/, '')); }, pc.check], keys, t('f(x)=' + keys[0]) + '; ' + t(keys[1]),
      t('f(' + s.h + ')=0') + ', ' + t('f(' + x1 + ')=1') + ': slope ' + t(rt(m)) + ', so ' + t('f(x)=' + keys[0]) + '.<br>' + t(keys[0] + '=-1') + ' gives ' + t('x=' + other[0]) + ': the other invariant point is ' + t(keys[1]) + ' (the asymptote is midway between them).', ['The asymptote is the zero of ' + t('f') + '; the invariant point is on the line too.', 'Then solve ' + t('f(x)=-1') + '.'], 'f and the other invariant point', [[keys[0], pt(other[0], 1)]]);
  }
  function epC2(r) {
    var s = pickWhere(function () { return { x0: r.int(-3, 7), y0: r.pick([0.5, -0.5, 0.25, -0.25, 1, -1, 0.2]), x2: r.int(-5, 6), on: r.chance(0.5) }; }, function (z) { z.k = z.x0 - 1 / z.y0; return Number.isInteger(z.k) && Math.abs(z.k) <= 8 && z.k !== 0 && z.x2 !== z.k && z.x2 !== z.x0 && !(z.x0 === 5 && z.y0 === 0.5); });
    var y2true = 1 / (s.x2 - s.k), y2 = s.on ? y2true : -y2true, ans = s.on ? 'yes' : 'no';
    var kC = Z.valCheck(CP, s.k, [{ v: s.x0 + 1 / s.y0, code: CP + 'k-sign', hint: t('\\frac{1}{' + s.x0 + '-k}=' + dt(s.y0)) + ' gives ' + t(s.x0 + '-k=' + dt(1 / s.y0)) + '.' }]).check;
    var ynC = function (v) { var l = plainLow(v); if (/^(yes|y|true)\b/.test(l)) return ans === 'yes' ? ok() : wrong(CP + 'yes-no', 'Substitute ' + t('x=' + s.x2) + ': ' + t('\\frac{1}{' + s.x2 + sgT(-s.k) + '}') + '.'); if (/^(no|n|false)\b/.test(l)) return ans === 'no' ? ok() : wrong(CP + 'yes-no', 'Substitute ' + t('x=' + s.x2) + ': ' + t('\\frac{1}{' + s.x2 + sgT(-s.k) + '}=' + dt(y2true)) + '.'); return form(CP + 'word', 'Type <b>yes</b> or <b>no</b>.'); };
    var n2 = Math.round(1 / y2), y2T = [1, 2, 4, 5, 8, 10].indexOf(Math.abs(n2)) >= 0 && Math.abs(1 / y2 - n2) < 1e-9 ? dt(y2) : rt(toR(y2));
    var fields = [{ label: t('k='), name: 'k', mode: 'math', keys: 'fraction' }, { label: 'Is ' + t('(' + s.x2 + ',\\ ' + y2T + ')') + ' on the graph? (yes or no)', name: 'on the graph', mode: 'text', wide: true, placeholder: 'yes or no' }];
    return Z.fieldsPart('The graph of ' + t('y=\\dfrac{1}{x-k}') + ' passes through ' + t('(' + s.x0 + ',\\ ' + dt(s.y0) + ')') + '. Determine ' + t('k') + ', and decide whether ' + t('(' + s.x2 + ',\\ ' + y2T + ')') + ' is also on the graph.', fields, [kC, ynC], [String(s.k), ans], t('k=' + s.k) + '; ' + ans,
      t('\\frac{1}{' + s.x0 + '-k}=' + dt(s.y0)) + ', so ' + t(s.x0 + '-k=' + dt(1 / s.y0)) + ', ' + t('k=' + s.k) + '.<br>At ' + t('x=' + s.x2) + ': ' + t('\\frac{1}{' + s.x2 + sgT(-s.k) + '}=' + rt(toR(y2true))) + '. ' + (s.on ? '<b>Yes</b>, the point is on the graph.' : '<b>No</b>, the point is not on the graph (the sign is wrong).'), ['Substitute the point and solve for ' + t('k') + '.', 'Then substitute ' + t('x=' + s.x2) + ' and compare.'], 'k from a point; is a point on the graph?', [[String(s.x0 + 1 / s.y0), ans], [String(s.k), ans === 'yes' ? 'no' : 'yes']]);
  }
  function epC3(r) {
    return mc(r, 'For ' + t('f(x)=mx+b') + ', ' + t('m\\ne 0') + ', the invariant points of ' + t('y=\\dfrac{1}{f(x)}') + ' have ' + t('x') + '-coordinates ' + t('\\frac{1-b}{m}') + ' and ' + t('\\frac{-1-b}{m}') + '. What is their average, and what does it show?', [
      { html: t('-\\frac{b}{m}') + ': the zero of ' + t('f') + ', so the vertical asymptote is exactly halfway between the invariant points.', right: true },
      { html: t('-\\frac{b}{2m}') + ': halfway between the ' + t('y') + '-axis and the asymptote.', why: 'Add the two numerators: ' + t('(1-b)+(-1-b)=-2b') + ', then divide by 2.', code: 'half' },
      { html: t('\\frac{1-b}{m}') + ': the asymptote is at the invariant point on ' + t('y=1') + '.', why: 'Average both values: add them and divide by 2.', code: 'one' },
      { html: t('\\frac{b}{m}') + ': the opposite of the zero of ' + t('f') + '.', why: 'Check the sign: ' + t('(1-b)+(-1-b)=-2b') + '.', code: 'sign' }
    ], t('\\frac{1}{2}\\left(\\frac{1-b}{m}+\\frac{-1-b}{m}\\right)=\\frac{1}{2}\\cdot\\frac{-2b}{m}=-\\frac{b}{m}') + ', which is the solution of ' + t('mx+b=0') + ': the vertical asymptote. So the asymptote is exactly halfway between the invariant points.', ['Add the two fractions (same denominator), then divide by 2.'], 'asymptote midway between invariant points (MC)');
  }

  function Pt(id, level, make) { return { id: id, level: level, make: make }; }
  var QUESTIONS = [
    { num: '1', parts: [Pt('1', 'BEG', q1)] },
    { num: '2', shared: q2Shared, stem: q2stem, parts: [Pt('2a', 'BEG', q2a), Pt('2b', 'EMG', q2b), Pt('2c', 'EMG', q2c)] },
    { num: '3', parts: [Pt('3a', 'EMG', function (r) { return q3(r, 'a'); }), Pt('3b', 'EMG', function (r) { return q3(r, 'b'); }), Pt('3c', 'PRG', function (r) { return q3(r, 'c'); })] },
    { num: '4', stem: 'Complete the table without graphing.', parts: [Pt('4a', 'BEG', function (r) { return q4(r, 'a'); }), Pt('4b', 'PRG', function (r) { return q4(r, 'b'); }), Pt('4c', 'PRG', function (r) { return q4(r, 'c'); }), Pt('4d', 'PRG', function (r) { return q4(r, 'd'); }), Pt('4e', 'BEG', q4e)] },
    { num: '5', shared: q5Shared, stem: q5stem, parts: [Pt('5a', 'EMG', q5a), Pt('5b', 'EMG', q5b)] },
    { num: '6', parts: [Pt('6a', 'BEG', q6a), Pt('6b', 'BEG', q6b), Pt('6c', 'PRG', q6c), Pt('6d', 'PRG', q6d)] },
    { num: '7', shared: q7Shared, stem: q7stem, parts: [Pt('7a', 'PRG', q7a), Pt('7b', 'ADV', q7b)] },
    { num: '8', parts: [Pt('8', 'ADV', q8)] },
    { num: '9', shared: q9Shared, stem: q9stem, parts: [Pt('9a', 'PRG', q9a), Pt('9b', 'PRG', q9b)] },
    { num: '10', stem: 'Explain.', parts: [Pt('10a', 'EMG', q10a), Pt('10b', 'EMG', q10b)] },
    { num: '11', parts: [Pt('11a', 'ADV', q11a), Pt('11b', 'MAS', q11b)] },
    { num: '12', parts: [Pt('12', 'BEG', q12)] },
    { num: '13', parts: [Pt('13', 'PRG', function (r) { return stmtMC(r, true, { not: ['2,-1'] }); })] },
    { num: '14', parts: [Pt('14', 'PRG', q14)] },
    { num: '15', parts: [Pt('15', 'EMG', function (r) { return nrP(r, 1); })] },
    { num: '16', parts: [Pt('16', 'PRG', q16)] }
  ];
  var EXTRA = [
    { num: 'A1', section: 'A. Skills', parts: [Pt('A1a', 'BEG', function (r) { return epA1(r, 'a'); }), Pt('A1b', 'EMG', function (r) { return epA1(r, 'b'); })] },
    { num: 'A2', parts: [Pt('A2a', 'PRG', function (r) { return epA2(r, 'a'); }), Pt('A2b', 'PRG', function (r) { return epA2(r, 'b'); })] },
    { num: 'A3', parts: [Pt('A3', 'BEG', epA3)] },
    { num: 'A4', parts: [Pt('A4', 'EMG', epA4)] },
    { num: 'B1', section: 'B. Applying', shared: epB1Shared, stem: epB1stem, parts: [Pt('B1a', 'EMG', epB1a), Pt('B1b', 'EMG', epB1b)] },
    { num: 'B2', parts: [Pt('B2', 'ADV', epB2)] },
    { num: 'B3', shared: epB3Shared, stem: epB3stem, parts: [Pt('B3a', 'PRG', epB3a), Pt('B3b', 'PRG', epB3b)] },
    { num: 'B4', parts: [Pt('B4', 'PRG', function (r) { return stmtMC(r, false, { not: ['-2,6'] }); })] },
    { num: 'B5', parts: [Pt('B5', 'EMG', function (r) { return nrP(r, 2); })] },
    { num: 'C1', section: 'C. Stretch', parts: [Pt('C1', 'MAS', epC1)] },
    { num: 'C2', parts: [Pt('C2', 'MAS', epC2)] },
    { num: 'C3', parts: [Pt('C3', 'MAS', epC3)] }
  ];

  HW.defineLesson({ id: LID, unit: 7, num: '6', title: 'Reciprocal Functions of Linear Functions', outcome: OUT, calc: true, questions: QUESTIONS, extra: EXTRA });
})(window);
