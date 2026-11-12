/* Math 20-1 · Unit 7 · Lesson 2 — Graphing Absolute Value Functions of Linear Functions (outcome RF2 on every part)
 * Assignment 2 (m201book unit7/u7_l02.tex, Questions 1–18) and the Lesson 2 Extra Practice (u7_ep02.tex, A1–C4).
 * Every part is a generator: the booklet question's idea, form and difficulty with new numbers (the lesson's example
 * numbers and the booklet question's own numbers are left out where feasible). Calculator allowed (calc: true).
 * Uses the Unit 7 practice kit HW.u7kit (js/lessons/u7l1.js, which loads first).
 *
 * Answers: sketches of y = |f(x)| are drawn on a graph pad (the V as one line through a point on each arm and the vertex,
 * arrows at the ends; half-unit snapping when the vertex is at a half) and checked as a point set (K.graphExact), with
 * the line itself, the whole line reflected and the V drawn downward recognised; tables, points, intercepts (a number or
 * a point), domain and range (set notation, an inequality or interval notation) in labelled boxes; piecewise forms as
 * three boxes (the boundary, the piece to its right, the piece to its left); y = |ax + b| typed with the |x| key and
 * checked by value (the opposite inside is the same function); two possible lines f in two boxes (any order); times as
 * lists "t = a, t = b".
 * Recognised mistakes (u7l2- codes): the line drawn unchanged / reflected whole / the V drawn downward; the vertex from
 * ax + b = 0 with the wrong sign or taken as the y-intercept; the y-intercept of |f| left negative; the range of f given
 * for |f|; piecewise pieces on the wrong sides (the inequality not reversed when a < 0), the boundary's sign, the
 * opposite of only one term; a point on |f| with its y-value left negative or its x-value changed; only one of the two
 * possible values; the slope as run over rise; the reflected line given twice; a table row of f for |f| (or the reverse).
 * Conversions: Q1(b), Q2 "state the invariant point" → Q1(d) and Q2(g) typed points; Q1(b) "describe which part" →
 * multiple choice; Q11 "explain" → multiple choice (and the range of |−c| as multiple choice); Q12(a) and Q13 sketches →
 * choose-the-graph and the vertices / ranges that the sketches show; EP C2 → a table (number of solutions for k > 0,
 * k = 0, k < 0); EP C3 → multiple choice (the transformation).
 * Levels: LIM BEG EMG PRG ADV MAS. Mastery: Q10(a), EP C1(a)–(c), EP C4. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, KP = K.P, P = HW.poly, ex = HW.ex, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
  var U = HW.u7kit;
  if (!U) throw new Error('js/lessons/u7l2.js needs js/lessons/u7l1.js (the kit HW.u7kit) loaded first');
  var gcd = U.gcd, pickWhere = U.pickWhere, nz = U.nz, toR = U.toR, rv = U.rv, rt = U.rt, dt = U.dt, sgT = U.sgT, A = U.A, AL = U.AL, pt = U.pt, M = U.M, lin = U.lin, tx = U.tx, linT = U.linT, numVal = U.numVal;
  var CP = 'u7l2-';
  U.codes(CP, {
    'g-same': ['Sketch: drew the line y = f(x) unchanged', 'n'], 'g-whole': ['Sketch: reflected the whole line', 'b'], 'g-down': ['Sketch: drew the V opening down', 'b'],
    'tab-abs': ['Table: gave |f(x)| for f(x)', 's'], 'tab-noabs': ['Table: kept the negative values of f(x)', 'b'], 'part-side': ['Said the wrong part of the line is reflected', 'b'],
    'inv-yint': ['Gave the y-intercept as the invariant point', 'n'], 'inv-sign': ['Invariant point with the wrong sign', 's'], 'inv-none': ['Said there are no invariant points', 'n'], 'inv-extra': ['Listed an invariant point where there is none', 'n'],
    'v-sign': ['Vertex: solved ax + b = 0 with the wrong sign', 's'], 'v-yint': ['Gave the y-intercept point as the vertex', 'n'], 'yint-neg': ['y-intercept of |f| left negative', 'b'], 'yint-x': ['Gave the x-intercept for the y-intercept', 'n'],
    'rng-f': ['Gave the range of f instead of |f|', 'b'], 'rng-ctx': ['Context range from the wrong end value', 'b'], 'dom-ctx': ['Context domain wrong', 'b'],
    'abs-form': ['Not written in the form |ax + b| (format)', ''], 'abs-down': ['Equation of a V opening down', 'b'], 'abs-nobars': ['Equation without the absolute value bars', 'b'],
    'pt-neg': ['Point on |f|: kept the negative y-value', 'n'], 'pt-xchg': ['Point: changed the x-coordinate', 'n'], 'pt-one': ['Gave only one of the two possible values', 'b'], 'pt-moved': ['Moved a point that is above the axis', 'b'],
    'back-same': ['Two possible lines: gave the same line twice', 'b'], 'back-slope': ['Working backwards: slope as run over rise', 'b'], 'back-sign': ['Working backwards: slope with the wrong sign', 'b'], 'back-b': ['Working backwards: wrong y-intercept of the line', 'b'],
    'ctx-time': ['Context: wrong time', 'b'], 'ctx-one': ['Context: only one of the two times', 'b'], 'ctx-neg': ['Context: gave a negative distance', 's'], 'v-pos': ['Gave the slope or the vertex instead', 'b'],
    'cnt': ['Number of solutions wrong', 'b'], 'simp-case': ['Simplified for a different interval', 'b'], 'rng-low': ['Range: wrong lowest value', 'b'],
    'pts-fmt': ['Points not written as (x, y) (format)', ''], 'v-pt': ['Vertex not written as a point (format)', '']
  });
  U.codes(CP, U.PIECE_CODES);

  var DOM = '\\{x\\mid x\\in\\mathbb{R}\\}', RNG0 = '\\{y\\mid y\\ge 0,\\ y\\in\\mathbb{R}\\}', RNGALL = '\\{y\\mid y\\in\\mathbb{R}\\}';
  function same(a, b) { return Math.abs(rv(a) - rv(b)) < 1e-9; }
  function fT(a, b, cf) { return linT(a, b, cf); }
  /* a line f(x) = ax + b with zero h: a from o.as, h from o.hs (or integers), b = −ah an integer, avoiding o.avoid [[a, b]] */
  function linSpec(r, o) {
    o = o || {};
    return pickWhere(function () { var a = toR(r.pick(o.as || [1, -1, 2, -2, 3, -3])), h = o.hs ? r.pick(o.hs) : r.int(o.hmin == null ? -5 : o.hmin, o.hmax == null ? 5 : o.hmax) + (o.half ? 0.5 : 0); return { a: a, h: h, b: -rv(a) * h }; },
      function (z) {
        return z.h !== 0 && Math.abs(z.b - Math.round(z.b)) < 1e-9 && z.b !== 0 && Math.abs(z.b) <= (o.bmax || 15) && (!o.draw || U.vOk(z.a, Math.round(z.b), U.snapOf(z.a, Math.round(z.b)))) && (!o.test || o.test(z)) &&
          !(o.avoid || []).some(function (p) { return same(p[0], z.a) && Math.abs(p[1] - z.b) < 1e-9; });
      });
  }
  function L(r, o) { var s = linSpec(r, o); s.b = Math.round(s.b); return s; }
  /* the booklet's and the examples' lines (a, b), left out */
  var AV = [[2, -4], [1, 3], [-2, 6], [0.5, -2], [-2, 4], [3, -6], [-0.5, -2], [1, 5], [2, -7], [-3, 6], [-0.5, 1], [-1, 3], [2, 2], [-1, 1], [1 / 3, -1], [-3, -6], [0.75, 3], [2, -5], [-1, -3], [0.5, 2],
    [4, 12], [-5, 10], [2 / 3, -4], [-0.5, 7], [-2, -8], [1, -7], [3, 9], [-1, 5], [-4, 8], [-2, -5], [1 / 3, -2], [2, 4], [0.5, 1.5], [-3, 12], [3, -12], [-2, 5], [-4, 10], [1, -2], [-0.5, -1], [3, 3], [1, 6], [5, -15], [-0.75, 3], [1, -9], [4, 2], [-3, 12], [-1, -1], [2, 3], [3, -3], [-5, 13], [2, -6], [-2, 3]];
  function lineSol(a, b, cf) { var h = -rv(a) * 0 - rv(b) / rv(a); return t(fT(a, b, cf) + '=0') + ' gives ' + t('x=' + rt(h)); }
  var H_GRAPH = ['Keep the part of the line on or above the ' + t('x') + '-axis; reflect the part below it in the ' + t('x') + '-axis: ' + t('(x,\\ y)\\to(x,\\ -y)') + '.', 'The ' + t('x') + '-intercept does not move: it is the vertex of the V (the invariant point).'];

  /* the V drawing part for y = |ax + b| */
  function vDraw(r, a, b, o) {
    o = o || {};
    var h = -rv(b) / rv(a), cf = o.cf, f = fT(a, b, cf), yi = Math.abs(rv(b)), aa = Math.abs(rv(a));
    var Ls = U.armPt(a, b, -1, U.snapOf(a, b)), Rs = U.armPt(a, b, 1, U.snapOf(a, b));
    var sol = o.showF ? 'The line crosses the ' + t('x') + '-axis at ' + t(pt(h, 0)) + ', the invariant point. The part ' + (rv(a) > 0 ? 'left' : 'right') + ' of ' + t('x=' + rt(h)) + ' is below the axis, so it is reflected in the ' + t('x') + '-axis; the rest stays.'
      : 'Vertex: ' + t(f + '=0') + ' gives ' + t('x=' + rt(h)) + ', so ' + t(pt(h, 0)) + '. ' + t('y') + '-intercept: ' + t(AL(rt(b)) + '=' + rt(yi)) + ', so ' + t(pt(0, yi)) + '. The arms have slopes ' + t(rt(aa)) + ' and ' + t(rt(-aa)) + ', e.g. through ' + t(pt(Ls[0], Ls[1])) + ' and ' + t(pt(Rs[0], Rs[1])) + '.';
    var prompt = o.showF ? 'The graph of ' + t('y=f(x)') + ', where ' + t('f(x)=' + f) + ', is shown (dashed). Draw the graph of ' + t('y=|f(x)|') + '.' : 'Sketch the graph of ' + t('y=' + AL(f)) + ' without a table: find the vertex, the ' + t('y') + '-intercept and the slopes of the arms, then draw it.';
    return U.vGraph(CP, prompt, a, b, { showF: o.showF }, sol + '<br>The graph is a V with vertex ' + t(pt(h, 0)) + ', never below the ' + t('x') + '-axis.', o.showF ? H_GRAPH : ['The vertex is where ' + t(f + '=0') + '.', 'The arms have slopes ' + t('a') + ' and ' + t('-a') + '; the ' + t('y') + '-intercept is ' + t('|b|') + '.'], o.text || 'sketching y = |f(x)|');
  }
  /* y = |c| for a horizontal line y = c < 0 */
  function flatDraw(r, c) {
    return U.vGraph(CP, 'The graph of ' + t('y=f(x)') + ', where ' + t('f(x)=' + c) + ', is shown (dashed). Draw the graph of ' + t('y=|f(x)|') + '.', 0, c, { showF: true },
      'The whole line ' + t('y=' + c) + ' is below the ' + t('x') + '-axis, so all of it is reflected: ' + t(A(c) + '=' + (-c)) + '. The graph of ' + t('y=|f(x)|') + ' is the line ' + t('y=' + (-c)) + ' (no invariant points).', H_GRAPH, 'sketching y = |c|');
  }
  /* features: vertex, y-intercept, domain, range */
  function featPart(r, a, b, o) {
    o = o || {};
    var h = -rv(b) / rv(a), f = fT(a, b, o.cf), yi = Math.abs(rv(b));
    var vc = K.point([toR(h), [0, 1]], { wrong: [{ is: [toR(-h), [0, 1]], code: CP + 'v-sign', hint: 'Solve ' + t(f + '=0') + ' carefully: the vertex is at the zero of the line.' }, { is: [[0, 1], toR(yi)], code: CP + 'v-yint', hint: 'That is the ' + t('y') + '-intercept. The vertex is where the expression inside the bars is ' + t(0) + '.' }] });
    var vchk = function (s) { if (!/\(/.test(String(s || ''))) { var v = numVal(s); if (v != null && Math.abs(v - h) < 1e-9) return form(CP + 'v-pt', 'Right — now write the vertex as a point, ' + t('(x,\\ 0)') + '.'); } return vc(s); };
    var yc = U.icptChk('y', yi, [{ v: rv(b), code: CP + 'yint-neg', hint: 'At ' + t('x=0') + ': ' + t(AL(rt(b)) + '=' + rt(yi)) + '. The graph of ' + t('y=|f(x)|') + ' is never below the ' + t('x') + '-axis.' }, { v: h, code: CP + 'yint-x', hint: 'That is the ' + t('x') + '-coordinate of the vertex. The ' + t('y') + '-intercept is the value at ' + t('x=0') + '.' }]);
    var dc = U.setChk(DOM), rc = U.setChk(RNG0, { v: 'y', wrong: [{ is: RNGALL, code: CP + 'rng-f', hint: 'That is the range of the line. The graph of ' + t('y=|f(x)|') + ' is never below the ' + t('x') + '-axis.' }, { is: '\\{y\\mid y\\ge ' + rt(yi) + ',\\ y\\in\\mathbb{R}\\}', code: CP + 'rng-low', hint: 'The lowest point of the V is the vertex, on the ' + t('x') + '-axis.' }] });
    var fields = [{ label: 'Vertex', name: 'vertex', mode: 'math', keys: 'set', vars: ['x', 'y'], placeholder: '(x, y)' }, { label: t('y') + '-intercept', name: 'y-intercept', mode: 'math', keys: 'set', vars: ['x', 'y'] }, { label: 'Domain', name: 'domain', mode: 'math', keys: 'set', vars: ['x', 'y'] }, { label: 'Range', name: 'range', mode: 'math', keys: 'set', vars: ['x', 'y'] }];
    var keys = [pt(h, 0), rt(yi), DOM, RNG0];
    return U.fields(o.prompt || (o.short ? t('y=' + AL(f)) : 'For ' + t('y=' + AL(f)) + ', state the vertex, the ' + t('y') + '-intercept, the domain and the range.'), fields, [vchk, yc, dc, rc], keys, 'vertex ' + t(pt(h, 0)) + '; ' + t('y') + '-intercept ' + t(pt(0, yi)) + '; domain ' + t(DOM) + '; range ' + t(RNG0),
      t(f + '=0') + ' gives ' + t('x=' + rt(h)) + ': vertex ' + t(pt(h, 0)) + '. ' + t('y') + '-intercept: ' + t(AL(rt(b)) + '=' + rt(yi)) + ', the point ' + t(pt(0, yi)) + '.<br>Domain ' + t(DOM) + '; range ' + t(RNG0) + ' (the V is never below the ' + t('x') + '-axis).',
      ['The vertex is the zero of the line: solve ' + t(f + '=0') + '.', 'The ' + t('y') + '-intercept of ' + t('y=|ax+b|') + ' is ' + t('|b|') + '; the range starts at the vertex, ' + t('y\\ge 0') + '.'], 'vertex, y-intercept, domain, range of y = |ax + b|',
      [[pt(-h, 0), rt(yi), DOM, RNG0], [pt(h, 0), rt(b), DOM, RNG0], [pt(h, 0), rt(yi), DOM, RNGALL]]);
  }
  /* the graph of y = |f(x)| with marked points (for working backwards) */
  function vSvg(a, b, marks) {
    var f = function (x) { return Math.abs(rv(a) * x + rv(b)); };
    return U.G({ fns: [U.crv(f)], points: marks.map(function (p) { return { x: p[0], y: p[1], label: '(' + dt(p[0]) + ', ' + dt(p[1]) + ')' }; }), max: 280, aria: 'a V-shaped graph with its vertex on the x-axis and marked points' });
  }

  /* ---------- Q1: the table, the graph, the invariant point ---------- */
  var Q1 = { num: '1', shared: function (r) {
      var s = L(r, { as: [-1, -1, 1, -2, 2], hs: [-3, -2, -1, 1, 2, 4], avoid: AV, draw: true, bmax: 8 }), xs = [];
      for (var i = -3; i <= 3; i++) xs.push(s.h + i);
      s.xs = xs; return s;
    },
    stem: function (s) { return 'Let ' + t('f(x)=' + fT(s.a, s.b, rv(s.a) < 0)) + '.'; }, parts: [
    { id: 'q1a', level: 'BEG', make: function (r, s) {
      var ys = s.xs.map(function (x) { return rv(s.a) * x + s.b; }), ab = ys.map(Math.abs);
      var fields = s.xs.map(function (x) { return { label: t('x=' + x) + ': ' + t('f(x)='), name: 'f(' + x + ')' }; });
      return U.fields('Complete the row of the table for ' + t('y=f(x)') + '.', fields, ys.map(function (y) { return K.number(y); }), ys.map(String), ys.map(function (y) { return t(y); }).join(', '),
        'Substitute each ' + t('x') + ': ' + s.xs.map(function (x, i) { return t('f(' + x + ')=' + ys[i]); }).join(', ') + '.', ['Substitute each ' + t('x') + '-value into ' + t('f(x)') + '.'], 'table of values of f', [ab.map(String)],
        function (resp) { var v = resp.map(numVal); if (v.every(function (x, i) { return x != null && x === ab[i]; })) return wrong(CP + 'tab-abs', 'Those are the values of ' + t('|f(x)|') + '. This row is ' + t('f(x)') + ' itself, which can be negative.'); return null; });
    } },
    { id: 'q1b', level: 'BEG', make: function (r, s) {
      var ys = s.xs.map(function (x) { return rv(s.a) * x + s.b; }), ab = ys.map(Math.abs);
      var fields = s.xs.map(function (x) { return { label: t('x=' + x) + ': ' + t('|f(x)|='), name: '|f(' + x + ')|' }; });
      return U.fields('Complete the row of the table for ' + t('y=|f(x)|') + '.', fields, ab.map(function (y) { return K.number(y); }), ab.map(String), ab.map(function (y) { return t(y); }).join(', '),
        'Take the absolute value of each ' + t('f(x)') + ': ' + s.xs.map(function (x, i) { return t(A(ys[i]) + '=' + ab[i]); }).join(', ') + '.', ['Each value of ' + t('|f(x)|') + ' is the absolute value of ' + t('f(x)') + ': negatives become positive.'], 'table of values of |f|', [ys.map(String)],
        function (resp) { var v = resp.map(numVal); if (v.every(function (x, i) { return x != null && x === ys[i]; })) return wrong(CP + 'tab-noabs', 'Those are the values of ' + t('f(x)') + '. Take the absolute value of each one.'); return null; });
    } },
    { id: 'q1c', level: 'EMG', make: function (r, s) { return vDraw(r, s.a, s.b, { showF: true, cf: rv(s.a) < 0 }); } },
    { id: 'q1d', level: 'BEG', make: function (r, s) {
      return U.point('State the invariant point of ' + t('y=f(x)') + ' and ' + t('y=|f(x)|') + '.', [s.h, 0], [{ p: [0, Math.abs(s.b)], code: CP + 'inv-yint', hint: 'The invariant point is on both graphs: where ' + t('f(x)=0') + ', on the ' + t('x') + '-axis.' }, { p: [-s.h, 0], code: CP + 'inv-sign', hint: 'Solve ' + t('f(x)=0') + ' again.' }, { p: [0, s.b], code: CP + 'inv-yint', hint: 'The invariant point is where the line meets the ' + t('x') + '-axis.' }],
        'Points on the ' + t('x') + '-axis do not move: ' + t(fT(s.a, s.b, rv(s.a) < 0) + '=0') + ' gives ' + t('x=' + s.h) + ', the point ' + t(pt(s.h, 0)) + '.', ['Which point of the line is on the ' + t('x') + '-axis?'], 'invariant point');
    } },
    { id: 'q1e', level: 'EMG', make: function (r, s) {
      var right = rv(s.a) < 0, side = function (rt2) { return 'The part to the ' + (rt2 ? 'right' : 'left') + ' of ' + t('x=' + s.h) + ' (where ' + t('f(x)<0') + ')'; };
      return KP.mc(r, 'Which part of the line ' + t('y=f(x)') + ' is reflected to make ' + t('y=|f(x)|') + '?', [{ html: right ? 'The part to the right of ' + t('x=' + s.h) + ', below the ' + t('x') + '-axis' : 'The part to the left of ' + t('x=' + s.h) + ', below the ' + t('x') + '-axis', right: true },
        { html: right ? 'The part to the left of ' + t('x=' + s.h) + ', above the ' + t('x') + '-axis' : 'The part to the right of ' + t('x=' + s.h) + ', above the ' + t('x') + '-axis', why: 'The part above the axis already has ' + t('f(x)\\ge 0') + ', so it stays.', code: 'part-above' },
        { html: 'The whole line', why: 'Only the part below the ' + t('x') + '-axis is reflected.', code: 'whole' }, { html: 'Only the point ' + t(pt(s.h, 0)), why: 'That point does not move: it is the invariant point.', code: 'pt' }],
        'For ' + (right ? t('x>' + s.h) : t('x<' + s.h)) + ', ' + t('f(x)<0') + ' (the line is below the ' + t('x') + '-axis), so that part is reflected in the ' + t('x') + '-axis. The rest stays.', ['Look at your table: where is ' + t('f(x)') + ' negative?'], 'which part is reflected');
    } }] };

  /* ---------- Q2: sketch |f| from the graph of f (6 lines) and the invariant points ---------- */
  var Q2 = { num: '2', shared: function (r) {
      var used = AV.slice(), mk = function (o) { o.avoid = used; o.draw = true; o.bmax = 6; var s = L(r, o); used.push([s.a, s.b]); return s; };
      var S = { a: mk({ as: [2, 3, 1], hmin: -3, hmax: 3 }), b: mk({ as: [-1, -2], hmin: -4, hmax: 4 }), c: mk({ as: [[1, 3], [1, 2], [-1, 2]], hs: [-4, -2, 2, 4, 6, -6, 3, -3].filter(function (x) { return x; }) }),
        d: mk({ as: [-3, -2, 3], hmin: -2, hmax: 2 }), e: { a: 0, b: -r.int(1, 5) }, f: mk({ as: [[3, 4], [-3, 4], [2, 3], [-2, 3], [3, 2], [-3, 2]], hs: [-4, -2, 2, 4, 3, -3] }) };
      if (S.e.b === -4) S.e.b = -r.pick([1, 2, 3, 5]);
      S.gi = r.pick(['a', 'b', 'c', 'd', 'f']);
      return S;
    },
    parts: ['a', 'b', 'c', 'd', 'e', 'f'].map(function (k) {
      return { id: 'q2' + k, level: { a: 'BEG', b: 'BEG', c: 'EMG', d: 'EMG', e: 'EMG', f: 'PRG' }[k], make: function (r, S) { var s = S[k]; return k === 'e' ? flatDraw(r, s.b) : vDraw(r, s.a, s.b, { showF: true, cf: rv(s.a) < 0 && r.chance(0.5) }); } };
    }).concat([{ id: 'q2g', level: 'EMG', make: function (r, S) {
      var s = S[S.gi], h = -s.b / rv(s.a), c = S.e.b;
      var c1 = U.ptsCheck([[h, 0]], [{ pairs: [[0, Math.abs(s.b)]], code: CP + 'inv-yint', hint: 'The invariant points are where the line meets the ' + t('x') + '-axis.' }, { pairs: [[-h, 0]], code: CP + 'inv-sign', hint: 'Solve ' + t('f(x)=0') + ' again.' }, { pairs: [], code: CP + 'inv-none', hint: 'The line crosses the ' + t('x') + '-axis once: that point does not move.' }]);
      var c2 = U.ptsCheck([], [{ pairs: [[0, c]], code: CP + 'inv-extra', hint: 'Every point of ' + t('y=' + c) + ' is below the axis, so every point moves.' }, { pairs: [[0, -c]], code: CP + 'inv-extra', hint: 'That point is on ' + t('y=|f(x)|') + ' but not on ' + t('y=f(x)') + '.' }], { extraHint: 'The line ' + t('y=' + c) + ' never meets the ' + t('x') + '-axis, so every point moves.' });
      return U.fields('State the invariant points, if any, for the function in (' + S.gi + '), ' + t('f(x)=' + fT(s.a, s.b)) + ', and in (e), ' + t('f(x)=' + c) + '. (Type none if there are none.)', [{ label: '(' + S.gi + ')', name: '(' + S.gi + ')', mode: 'math', keys: 'u7kpts' }, { label: '(e)', name: '(e)', mode: 'math', keys: 'u7kpts' }],
        [c1, c2], [pt(h, 0), '\\text{none}'], '(' + S.gi + ') ' + t(pt(h, 0)) + '; (e) none',
        '(' + S.gi + '): ' + t(fT(s.a, s.b) + '=0') + ' gives ' + t('x=' + rt(h)) + ', so ' + t(pt(h, 0)) + '. (e): the line ' + t('y=' + c) + ' never meets the ' + t('x') + '-axis, so the whole line is reflected to ' + t('y=' + (-c)) + ': no invariant points.',
        ['Invariant points are the points on the ' + t('x') + '-axis: they do not move.'], 'invariant points', [[pt(0, Math.abs(s.b)), '\\text{none}'], [pt(h, 0), pt(0, -c)]]);
    } }]) };

  /* ---------- Q4 / EP A2 and the piecewise questions ---------- */
  function avoidL(o) { o.avoid = AV; return o; }

  /* the drone / car context: d = |D − v t| or |v t − D| */
  function ctxShared(r, kind) {
    if (kind === 'drone') {
      return pickWhere(function () { var v = r.pick([5, 8, 10, 12, 20, 25]), t0 = r.int(4, 10), T = t0 + r.int(2, Math.min(6, t0)); return { v: v, t0: t0, T: T, D: v * t0, j: r.int(1, Math.min(t0 - 1, T - t0)), unit: 'm', tu: 's', who: r.pick(['drone', 'model plane']) }; }, function (s) { return !(s.v === 15 && s.t0 === 8) && s.T < 2 * s.t0 && s.T - s.t0 >= 2; });
    }
    return pickWhere(function () { var v = r.pick([80, 90, 100, 110, 120]), t0 = r.pick([1, 1.5, 2, 2.5]), T = t0 + r.pick([0.5, 1, 1.5]); return { v: v, t0: t0, T: T, D: v * t0, j: r.pick([0.5, 1]), unit: 'km', tu: 'h', town: r.pick(['Lethbridge', 'Medicine Hat', 'Banff', 'Edmonton', 'Lloydminster']) }; }, function (s) { return !(s.v === 100 && s.t0 === 1.5) && s.T < 2 * s.t0 && s.j <= s.T - s.t0 && s.j < s.t0; });
  }

  /* ---------- the questions ---------- */
  var QUESTIONS = [Q1, Q2,
    { num: '3', parts: [
      { id: 'q3a', level: 'EMG', make: function (r) { var s = L(r, avoidL({ as: [2, -2], half: true, hmin: -3, hmax: 2, draw: true })); return vDraw(r, s.a, s.b, {}); } },
      { id: 'q3b', level: 'EMG', make: function (r) { var s = L(r, avoidL({ as: [-1], hmin: -5, hmax: 5, draw: true })); return vDraw(r, s.a, s.b, { cf: false }); } },
      { id: 'q3c', level: 'PRG', make: function (r) { var s = L(r, avoidL({ as: [[1, 2], [-1, 2], [1, 3], [-1, 3]], hs: [-6, -4, -3, -2, 2, 3, 4, 6], draw: true })); return vDraw(r, s.a, s.b, { cf: rv(s.a) < 0 && r.chance(0.4) }); } }] },
    { num: '4', stem: 'For each function, state the vertex, the \\(y\\)-intercept, the domain and the range.', parts: [
      { id: 'q4a', level: 'BEG', make: function (r) { var s = L(r, avoidL({ as: [2, 3, 4, 5], hmin: -6, hmax: 6 })); return featPart(r, s.a, s.b, { short: true }); } },
      { id: 'q4b', level: 'EMG', make: function (r) { var s = L(r, avoidL({ as: [-2, -3, -4, -5, -6], hmin: -6, hmax: 6 })); return featPart(r, s.a, s.b, { short: true }); } },
      { id: 'q4c', level: 'EMG', make: function (r) { var s = L(r, avoidL({ as: [[2, 3], [3, 4], [3, 2], [-2, 3], [-3, 4], [4, 3], [2, 5]], hs: [-9, -8, -6, -4, -3, 3, 4, 6, 8, 9, 10, 12] })); return featPart(r, s.a, s.b, { short: true }); } },
      { id: 'q4d', level: 'PRG', make: function (r) { var s = L(r, avoidL({ as: [-0.5, -0.25, -1.5], hs: [8, 10, 12, 14, 16, 18, -8, -12, 6], bmax: 20 })); return featPart(r, s.a, s.b, { cf: true, short: true }); } }] },
    { num: '5', shared: function (r) { return L(r, avoidL({ as: [-2, -3, -4, 2, 3, 4, 5], hmin: -6, hmax: 6, test: function (z) { return z.b < 0; } })); },
      stem: function (s) { return 'Let ' + t('f(x)=' + fT(s.a, s.b)) + '. Compare ' + t('y=f(x)') + ' with ' + t('y=|f(x)|') + '.'; }, parts: ['f', 'abs'].map(function (w, i) {
      return { id: 'q5' + 'ab'.charAt(i), level: i ? 'EMG' : 'BEG', make: function (r, s) {
        var h = s.h, yi = i ? Math.abs(s.b) : s.b, rng = i ? RNG0 : RNGALL, fn = i ? 'y=|f(x)|' : 'y=f(x)';
        var xc = U.icptChk('x', h, [{ v: -h, code: CP + 'v-sign', hint: 'Solve ' + t('f(x)=0') + ' again.' }, { v: s.b, code: CP + 'yint-x', hint: 'That is the ' + t('y') + '-intercept of ' + t('f') + '. The ' + t('x') + '-intercept is where ' + t('f(x)=0') + '.' }]);
        var yc = U.icptChk('y', yi, i ? [{ v: s.b, code: CP + 'yint-neg', hint: t(A(s.b) + '=' + Math.abs(s.b)) + ': the graph of ' + t('y=|f(x)|') + ' is never below the axis.' }] : [{ v: Math.abs(s.b), code: CP + 'tab-abs', hint: 'That is for ' + t('y=|f(x)|') + '. The line itself crosses the ' + t('y') + '-axis at ' + t('f(0)') + '.' }]);
        var rc = U.setChk(rng, { v: 'y', wrong: i ? [{ is: RNGALL, code: CP + 'rng-f', hint: 'That is the range of the line. ' + t('|f(x)|\\ge 0') + ' always.' }] : [{ is: RNG0, code: CP + 'tab-abs', hint: 'A non-horizontal line takes every ' + t('y') + '-value.' }] });
        var fields = [{ label: 'Domain', name: 'domain', mode: 'math', keys: 'set', vars: ['x', 'y'] }, { label: 'Range', name: 'range', mode: 'math', keys: 'set', vars: ['x', 'y'] }, { label: t('x') + '-intercept', name: 'x-intercept', mode: 'math', keys: 'set', vars: ['x', 'y'] }, { label: t('y') + '-intercept', name: 'y-intercept', mode: 'math', keys: 'set', vars: ['x', 'y'] }];
        return U.fields('For ' + t(fn) + ', state the domain, the range, the ' + t('x') + '-intercept and the ' + t('y') + '-intercept.', fields, [U.setChk(DOM), rc, xc, yc], [DOM, rng, rt(h), rt(yi)], 'domain ' + t(DOM) + '; range ' + t(rng) + '; ' + t('x') + '-intercept ' + t(rt(h)) + '; ' + t('y') + '-intercept ' + t(rt(yi)),
          t(fT(s.a, s.b) + '=0') + ' gives ' + t('x=' + h) + '; ' + t('f(0)=' + s.b) + (i ? ', so ' + t('|f(0)|=' + Math.abs(s.b)) : '') + '.<br>' + (i ? 'The domain and the ' + t('x') + '-intercept stay the same; the range becomes ' + t('y\\ge 0') + ' and the ' + t('y') + '-intercept ' + t(s.b) + ' becomes ' + t(A(s.b) + '=' + Math.abs(s.b)) + '.' : 'A non-horizontal line: domain and range are all real numbers.'),
          [i ? 'Reflecting the part below the axis changes the range and the ' + t('y') + '-intercept, not the domain or the ' + t('x') + '-intercept.' : 'Solve ' + t('f(x)=0') + ' for the ' + t('x') + '-intercept; substitute ' + t('x=0') + ' for the ' + t('y') + '-intercept.'], i ? 'features of y = |f(x)|' : 'features of y = f(x)',
          [[DOM, i ? RNGALL : RNG0, rt(h), rt(i ? s.b : Math.abs(s.b))]]);
      } };
    }) },
    { num: '6', stem: 'Write each function in piecewise form.', parts: [
      { id: 'q6a', level: 'BEG', make: function (r) { var s = L(r, avoidL({ as: [1], hmin: -9, hmax: 9 })); return U.piece(CP, s.a, s.b, { short: true }); } },
      { id: 'q6b', level: 'EMG', make: function (r) { var s = L(r, avoidL({ as: [2, 3, 4, 5], hmin: -5, hmax: 5 })); return U.piece(CP, s.a, s.b, { short: true }); } },
      { id: 'q6c', level: 'EMG', make: function (r) { var s = L(r, avoidL({ as: [-1], hmin: -9, hmax: 9 })); return U.piece(CP, s.a, s.b, { cf: true, short: true }); } },
      { id: 'q6d', level: 'PRG', make: function (r) { var s = L(r, avoidL({ as: [-2, -3, -4, -5], hmin: -5, hmax: 5, test: function (z) { return z.b > 0; } })); return U.piece(CP, s.a, s.b, { cf: true, short: true }); } },
      { id: 'q6e', level: 'PRG', make: function (r) { var s = L(r, avoidL({ as: [-2, -4, 2, 4], half: true, hmin: -5, hmax: 4, test: function (z) { return rv(z.a) < 0 || r.chance(0.3); } })); return U.piece(CP, s.a, s.b, { short: true }); } },
      { id: 'q6f', level: 'PRG', make: function (r) { var s = L(r, avoidL({ as: [[1, 3], [1, 2], [1, 4], [-1, 2], [-1, 3], [2, 3]], hs: [-9, -8, -6, -4, -3, 3, 4, 6, 8, 9] })); return U.piece(CP, s.a, s.b, { short: true }); } }] },
    { num: '7', stem: 'True or false?', parts: ['a', 'b', 'c', 'd', 'e'].map(function (k, i) {
      return { id: 'q7' + k, level: i < 2 ? 'EMG' : 'PRG', make: function (r) {
        var s = L(r, avoidL({ as: [1, 2, 3, 4, 5, -1, -2, -3, -5, [1, 2]], hmin: -8, hmax: 8, half: r.chance(0.3) })), cf = rv(s.a) < 0 && r.chance(0.6);
        var f = fT(s.a, s.b, cf), negE = fT(-rv(s.a), -s.b, cf && false), h = -s.b / rv(s.a);
        var useF = r.chance(0.5), right = r.chance(0.5), strict = r.chance(0.5), E = useF ? f : tx(lin(-rv(s.a), -s.b));
        if (!useF && rv(s.a) > 0 && r.chance(0.5)) E = P.seq([M(-s.b, 0), M(-rv(s.a), 1)]);
        var ivT = 'x' + (right ? (strict ? '>' : '\\ge ') : (strict ? '<' : '\\le ')) + rt(h);
        var fPos = (rv(s.a) > 0) === right, truth = useF ? fPos : !fPos;
        var tv = right ? h + 1 : h - 1, fv = rv(s.a) * tv + s.b;
        var why = 'Test ' + t('x=' + rt(tv)) + ': ' + t(AL(f) + '=' + A(rt(fv)) + '=' + rt(Math.abs(fv))) + ', but ' + t(E + '=' + rt(useF ? fv : -fv)) + '.';
        var sol = 'For ' + t(ivT) + ', ' + t(f) + (fPos ? ' \\(\\ge 0\\)' : ' \\(\\le 0\\)') + ', so ' + t(AL(f) + '=' + (fPos ? f : '-(' + f + ')=' + tx(lin(-rv(s.a), -s.b)))) + '. The statement is <b>' + (truth ? 'true' : 'false') + '</b>.' + (truth ? '' : ' ' + why);
        return KP.tf(r, t(AL(f) + '=' + E) + ' if ' + t(ivT), truth, truth ? 'Check the sign of ' + t(f) + ' for ' + t(ivT) + ' (test a value).' : why, sol, ['Decide whether ' + t(f) + ' is positive or negative on that interval (test one value of ' + t('x') + ').', 'Where it is negative, ' + t(AL(f)) + ' is its opposite.'], 'true or false: piecewise');
      } };
    }) },
    { num: '8', stem: 'The graph of \\(y=|f(x)|\\) is shown, where \\(f\\) is linear. Write an equation in the form \\(y=|ax+b|\\), then write it in piecewise form.', shared: function (r) {
        var g1 = L(r, avoidL({ as: [2, 3, -2, 1], hmin: -4, hmax: 3, bmax: 6, draw: true })), g2 = L(r, avoidL({ as: [[1, 3], [1, 2], [-1, 3], [-1, 2]], hs: [-4, -3, -2, 2, 3, 4], bmax: 3, draw: true }));
        return { g1: g1, g2: g2 };
      }, parts: [['ai', 'g1', 'eq', 'PRG'], ['aii', 'g1', 'pw', 'PRG'], ['bi', 'g2', 'eq', 'ADV'], ['bii', 'g2', 'pw', 'ADV']].map(function (d) {
        return { id: 'q8' + d[0], sub: d[0].charAt(0) + (d[0].length > 2 ? '.ii' : '.i'), level: d[3], make: function (r, S) {
          var s = S[d[1]], h = s.h, yi = Math.abs(s.b), aa = Math.abs(rv(s.a));
          var R = U.armPt(s.a, s.b, 1, U.snapOf(s.a, s.b)), marks = [[h, 0], [0, yi]];
          if (toR(aa)[1] !== 1) marks.push(R);
          var svg = vSvg(s.a, s.b, marks), pos = lin(toR(aa), -aa * h);
          if (d[2] === 'eq') {
            var p = KP.math('Graph (' + d[0].charAt(0) + '): write an equation in the form ' + t('y=|ax+b|') + '.' + svg, U.absLinChk(s.a, s.b, CP), AL(tx(pos)), 'The vertex ' + t(pt(h, 0)) + ' is the zero of the line. ' + (marks.length > 2 ? 'From the vertex to ' + t(pt(R[0], R[1])) + ' the right arm rises ' + t(rt(R[1])) + ' over a run of ' + t(rt(R[0] - h)) : 'The arm through ' + t(pt(0, yi)) + ' has slope ' + t(rt(h < 0 ? aa : -aa))) + ', so the arms have slopes ' + t(rt(aa)) + ' and ' + t(rt(-aa)) + '.<br>The line ' + t('y=' + tx(pos)) + ' has slope ' + t(rt(aa)) + ' and zero ' + t(rt(h)) + ', so ' + t('y=' + AL(tx(pos))) + ' (or, the same function, ' + t('y=' + AL(tx(P.neg(pos)))) + ').',
              ['The vertex is where the expression inside the bars is ' + t(0) + '.', 'The right arm is part of a line with a positive slope: rise over run from the vertex.'], 'equation y = |ax + b| from its graph', { keys: 'u7kabs', vars: ['x'], before: 'y=' });
            p.bad = [tx(pos), '-' + AL(tx(pos))];
            return p;
          }
          return U.piece(CP, toR(aa), toR(-aa * h), { prompt: 'Graph (' + d[0].charAt(0) + '): write the function in piecewise form: the value of ' + t('x') + ' where the pieces meet, and the expression on each side.' + svg });
        } };
      }) },
    { num: '9', stem: 'Answer each question about a function and the graph of its absolute value.', parts: [
      { id: 'q9a', level: 'BEG', make: function (r) { var x = nz(r, 1, 9), y = -r.int(2, 12); if (x === 5 && y === -9) y = -8;
        return U.point('The point ' + t(pt(x, y)) + ' is on ' + t('y=f(x)') + '. State the matching point on ' + t('y=|f(x)|') + '.', [x, -y], [{ p: [x, y], code: CP + 'pt-neg', hint: 'The ' + t('y') + '-value becomes its absolute value: ' + t(A(y) + '=' + (-y)) + '.' }, { p: [-x, -y], code: CP + 'pt-xchg', hint: 'The ' + t('x') + '-value does not change.' }, { p: [-x, y], code: CP + 'pt-xchg', hint: 'Only the ' + t('y') + '-value changes.' }],
          t('(x,\\ y)\\to(x,\\ |y|)') + ': ' + t(pt(x, -y)) + '.', ['A point ' + t('(x,\\ y)') + ' on ' + t('y=f(x)') + ' becomes ' + t('(x,\\ |y|)') + '.'], 'point on y = |f(x)|'); } },
      { id: 'q9b', level: 'BEG', make: function (r) { var x = nz(r, 1, 9), y = r.int(2, 12); if (x === -1 && y === 6) y = 7;
        return U.point('The point ' + t(pt(x, y)) + ' is on ' + t('y=f(x)') + '. State the matching point on ' + t('y=|f(x)|') + '.', [x, y], [{ p: [x, -y], code: CP + 'pt-moved', hint: 'This point is above the ' + t('x') + '-axis, so it does not move.' }, { p: [-x, y], code: CP + 'pt-xchg', hint: 'The ' + t('x') + '-value does not change.' }],
          t('|' + y + '|=' + y) + ': the point is above the axis, so it does not move: ' + t(pt(x, y)) + '.', ['Points on or above the ' + t('x') + '-axis do not move.'], 'point above the axis'); } },
      { id: 'q9c', level: 'EMG', make: function (r) { var y = r.int(2, 12), x = r.pick([0, 0, nz(r, 1, 6)]); if (x === 0 && y === 4) y = 5; var g = r.pick(['g', 'k', 'p']);
        return U.vals('The point ' + t(pt(x, y)) + ' is on ' + t('y=|' + g + '(x)|') + '. What are the possible values of ' + t(g + '(' + x + ')') + '?', [y, -y], [{ vals: [y], code: CP + 'pt-one', hint: 'Two numbers have absolute value ' + t(y) + '.' }, { vals: [-y], code: CP + 'pt-one', hint: 'Two numbers have absolute value ' + t(y) + '.' }],
          t('|' + g + '(' + x + ')|=' + y) + ' means ' + t(g + '(' + x + ')=' + y) + ' or ' + t(g + '(' + x + ')=-' + y) + '.', ['Which numbers have absolute value ' + t(y) + '?'], 'values of g from |g|', { v: null }); } },
      { id: 'q9d', level: 'BEG', make: function (r) { var x = nz(r, 1, 12) + (r.chance(0.3) ? 0.5 * (r.chance(0.5) ? 1 : -1) : 0); if (x === -7) x = -6; var g = r.pick(['h', 'q', 'f']);
        return U.num('The ' + t('x') + '-intercept of ' + t('y=' + g + '(x)') + ' is ' + t(dt(x)) + '. State the ' + t('x') + '-intercept of ' + t('y=|' + g + '(x)|') + '.', x, [{ v: -x, code: CP + 'inv-sign', hint: 'Points on the ' + t('x') + '-axis do not move.' }, { v: 0, code: CP + 'yint-x', hint: 'The ' + t('x') + '-intercept is an invariant point: it stays where it is.' }],
          t(dt(x)) + ': ' + t('|0|=0') + ', so the ' + t('x') + '-intercept is an invariant point.', ['What happens to a point on the ' + t('x') + '-axis?'], 'x-intercept of |h|', { box: 'number' }); } }] },
    { num: '10', parts: [
      { id: 'q10a', level: 'MAS', make: function (r) {
        var s = L(r, avoidL({ as: [[1, 2], [-1, 2], [1, 3], [-1, 3], [2, 3], [-2, 3], [3, 2]], hs: [-6, -5, -4, -3, -2, 2, 3, 4, 5, 6], bmax: 6, test: function (z) { return Math.abs(z.b) <= 5; } }));
        s.b = -rv(s.a) * s.h; // may be a fraction here (e.g. 3/2)
        var a = toR(s.a), bR = toR(s.b), Lp = lin(a, bR), Ln = P.neg(Lp), h = s.h, yi = Math.abs(s.b), q = a[1];
        var other = pickWhere(function () { return h + r.pick([1, 2, 3, -1, -2, -3]) * q; }, function (x) { return x !== 0 && Math.abs(x) <= 6 && Math.abs(rv(a) * x + rv(bR)) <= 6 && Math.abs(rv(a) * x + rv(bR)) > 0; });
        var mk = [[h, 0], [0, yi], [other, Math.abs(rv(a) * other + rv(bR))]];
        var c1 = K.poly(Lp, { expanded: false }), c2 = K.poly(Ln, { expanded: false }), is1 = U.polyIs(Lp), is2 = U.polyIs(Ln);
        var flip = lin(toR([a[1], a[0]]), toR(-h * a[1] / a[0]));
        var chk = function (resp) {
          resp = resp || []; var s1 = String(resp[0] || ''), s2 = String(resp[1] || '');
          if (!s1.trim() || !s2.trim()) return form('empty', 'Write both possible equations.');
          if ((is1(s1) && is2(s2)) || (is2(s1) && is1(s2))) return ok();
          if ((is1(s1) && is1(s2)) || (is2(s1) && is2(s2))) return wrong(CP + 'back-same', 'You wrote the same line twice. The other possible line is its reflection in the ' + t('x') + '-axis: change the sign of every term.');
          if (is1(s1) || is2(s1) || is1(s2) || is2(s2)) return wrong(CP + 'back-same', 'One line is right. The other one is its reflection in the ' + t('x') + '-axis: ' + t('y=-f(x)') + '.');
          var fl = U.polyIs(flip), fl2 = U.polyIs(P.neg(flip));
          if (fl(s1) || fl2(s1) || fl(s2) || fl2(s2)) return wrong(CP + 'back-slope', 'Slope is rise over run: from ' + t(pt(h, 0)) + ' to ' + t(pt(0, yi)) + ' the rise is ' + t(rt(yi)) + ' and the run is ' + t(rt(Math.abs(h))) + '.');
          return wrong('value', null);
        };
        var svg = vSvg(a, bR, mk);
        return { prompt: 'The graph of ' + t('y=|f(x)|') + ', where ' + t('f') + ' is linear, is shown. Write the equations of the two possible lines ' + t('y=f(x)') + '.' + svg,
          input: { type: 'fields', fields: [{ label: 'One line: ' + t('y='), name: 'first line', mode: 'math', keys: 'poly', vars: ['x'] }, { label: 'The other: ' + t('y='), name: 'second line', mode: 'math', keys: 'poly', vars: ['x'] }] },
          check: chk, key: [tx(Lp), tx(Ln)], answer: t('y=' + tx(Lp)) + ' and ' + t('y=' + tx(Ln)),
          solution: 'Vertex ' + t(pt(h, 0)) + ' and ' + t('y') + '-intercept ' + t(pt(0, yi)) + ': the arm between them has slope ' + t('\\frac{' + rt(yi) + '-0}{0-(' + rt(h) + ')}=' + rt(-yi / h)) + ', so one line is ' + t('y=' + tx(rv(a) * h < 0 ? Lp : Ln)) + '.<br>Its reflection in the ' + t('x') + '-axis gives the same V: ' + t('y=' + tx(rv(a) * h < 0 ? Ln : Lp)) + '.',
          hints: ['The vertex is the ' + t('x') + '-intercept of both lines.', 'Find one line from the vertex and the ' + t('y') + '-intercept, then reflect it in the ' + t('x') + '-axis (change every sign).'], text: 'two possible lines from |f|', bad: [[tx(Lp), tx(Lp)], [tx(flip), tx(P.neg(flip))]] };
      } },
      { id: 'q10b', level: 'ADV', make: function (r) {
        var z = pickWhere(function () { return { m: nz(r, 2, 6), h: nz(r, 1, 7) }; }, function (s) { return !(s.m === -3 && s.h === 4); }), g = lin(z.m, -z.m * z.h), yi = Math.abs(z.m * z.h);
        var cg = K.poly(g, { expanded: false, wrong: [{ is: lin(z.m, z.m * z.h), code: CP + 'v-sign', hint: 'The zero is at ' + t('x=' + z.h) + ': ' + t('g(x)=' + z.m + '(x' + sgT(-z.h) + ')') + '.' }, { is: lin(z.h, -z.m * z.h), code: CP + 'v-pos', hint: 'The slope is ' + t(z.m) + ': it multiplies ' + t('x') + '.' }] });
        return U.fields('A line ' + t('y=g(x)') + ' has slope ' + t(z.m) + ', and the vertex of ' + t('y=|g(x)|') + ' is ' + t(pt(z.h, 0)) + '. Write the equation of ' + t('g') + ' and state the ' + t('y') + '-intercept of ' + t('y=|g(x)|') + '.', [{ label: t('g(x)='), name: 'g(x)', mode: 'math', keys: 'poly', vars: ['x'] }, { label: t('y') + '-intercept of ' + t('y=|g(x)|'), name: 'y-intercept' }],
          [cg, U.icptChk('y', yi, [{ v: -z.m * z.h, code: CP + 'yint-neg', hint: 'That is ' + t('g(0)') + '. The graph of ' + t('y=|g(x)|') + ' is never below the axis.' }, { v: z.h, code: CP + 'yint-x', hint: 'The ' + t('y') + '-intercept is ' + t('|g(0)|') + '.' }])],
          [tx(g), String(yi)], t('g(x)=' + tx(g)) + '; ' + t('y') + '-intercept ' + t(yi), 'The vertex of ' + t('y=|g(x)|') + ' is the zero of ' + t('g') + ': ' + t('g(x)=' + z.m + '(x' + sgT(-z.h) + ')=' + tx(g)) + '.<br>' + t('|g(0)|=' + A(-z.m * z.h) + '=' + yi) + ', the point ' + t(pt(0, yi)) + '.',
          ['A line with slope ' + t('m') + ' and zero ' + t('h') + ' is ' + t('y=m(x-h)') + '.', 'The ' + t('y') + '-intercept of ' + t('y=|g(x)|') + ' is ' + t('|g(0)|') + '.'], 'line from slope and vertex', [[tx(g), String(-z.m * z.h)], [tx(lin(z.m, z.m * z.h)), String(yi)]]);
      } }] },
    { num: '11', parts: [
      { id: 'q11a', level: 'EMG', make: function (r) {
        var k = r.int(1, 9);
        return KP.mc(r, 'Why does the equation ' + t('|f(x)|=-' + k) + ' have no solution, and why is ' + t('|f(x)|<0') + ' never true?', [{ html: 'An absolute value is a distance from ' + t(0) + ', so ' + t('|f(x)|\\ge 0') + ' for every ' + t('x') + ': the graph of ' + t('y=|f(x)|') + ' is never below the ' + t('x') + '-axis.', right: true },
          { html: 'Because ' + t('f') + ' is linear: a line never reaches ' + t('y=-' + k) + '.', why: 'A non-horizontal line reaches every ' + t('y') + '-value. It is the absolute value that is never negative.' }, { html: 'It does have a solution: solve ' + t('f(x)=-' + k) + '.', why: 'Then ' + t('|f(x)|=' + k) + ', not ' + t(-k) + '.' }, { html: 'Because ' + t('|f(x)|') + ' is always positive.', why: 'Not always positive: it is ' + t(0) + ' at the vertex. It is never <b>negative</b>.' }],
          t('|f(x)|') + ' is never negative, so it cannot equal ' + t(-k) + ' or be less than ' + t(0) + '. The graph of ' + t('y=|f(x)|') + ' never goes below the ' + t('x') + '-axis.', ['What is the smallest value an absolute value can have?'], 'why |f(x)| = negative has no solution');
      } },
      { id: 'q11b', level: 'EMG', make: function (r) {
        var c = r.int(1, 9); if (c === 5) c = 6;
        return KP.mc(r, 'What is the range of ' + t('y=|f(x)|') + ' when ' + t('f(x)=-' + c) + ' for every ' + t('x') + '?', [{ html: t('\\{' + c + '\\}') + ', that is ' + t('\\{y\\mid y=' + c + '\\}'), right: true }, { html: t('\\{y\\mid y\\ge 0,\\ y\\in\\mathbb{R}\\}'), why: 'Here ' + t('|f(x)|') + ' is ' + t(c) + ' for every ' + t('x') + ': the graph is the horizontal line ' + t('y=' + c) + '.' },
          { html: t('\\{-' + c + '\\}'), why: 'That is the range of ' + t('f') + '. Its absolute value is ' + t(A('-' + c) + '=' + c) + '.' }, { html: t('\\{y\\mid y\\ge ' + c + ',\\ y\\in\\mathbb{R}\\}'), why: 'Every value of ' + t('|f(x)|') + ' is exactly ' + t(c) + '.' }],
          t('|f(x)|=' + A('-' + c) + '=' + c) + ' for every ' + t('x') + ': the graph is the line ' + t('y=' + c) + ' and the range is ' + t('\\{' + c + '\\}') + '.', ['What is ' + t('|f(x)|') + ' for any ' + t('x') + '?'], 'range of |c|');
      } }] },
    { num: '12', shared: function (r) { return ctxShared(r, 'drone'); },
      stem: function (s) { return 'A ' + s.who + ' flies at a constant ' + t(s.v) + ' m/s along a straight line and passes directly over a camera. Its horizontal distance from the camera after ' + t('t') + ' seconds is ' + t('d=|' + s.v + 't-' + s.D + '|') + ' metres, for ' + t('0\\le t\\le ' + s.T) + '.'; }, parts: [
      { id: 'q12a', level: 'EMG', make: function (r, s) {
        var dT = s.v * s.T - s.D, ymax = Math.ceil(s.D * 1.15 / 10) * 10, yl = Math.max(10, Math.round(s.D / 4 / 10) * 10);
        var g = function (segs, aria) { return HW.graph({ x: [0, s.T + 1], y: [-ymax, ymax], grid: 1, gridY: yl, labelsX: 2, labelsY: yl * 2, unitX: 200 / (s.T + 1), unitY: 150 / (2 * ymax), xName: 't', yName: 'd', segs: segs, max: 230, aria: aria }); };
        var V = [[0, s.D], [s.t0, 0], [s.T, dT]];
        var opts = [{ html: g([{ pts: V, start: 'closed', end: 'closed' }], 'a V shape'), right: true },
          { html: g([{ pts: [[0, s.D], [s.T, s.D - s.v * s.T]], start: 'closed', end: 'closed' }], 'a falling line'), why: 'That is ' + t(s.D + '-' + s.v + 't') + ' without the bars: a distance is never negative.', code: 'line' },
          { html: g([{ pts: V.map(function (p) { return [p[0], -p[1]]; }), start: 'closed', end: 'closed' }], 'an upside-down V below the axis'), why: 'A distance is never negative: the graph of ' + t('d=|\\ldots|') + ' is never below the ' + t('t') + '-axis.', code: 'down' },
          { html: g([{ pts: [[0, 0], [s.t0, s.D], [s.T, s.D - dT]], start: 'closed', end: 'closed' }], 'an upside-down V above the axis'), why: 'At ' + t('t=0') + ' the distance is ' + t('|0-' + s.D + '|=' + s.D) + ', not ' + t(0) + '.', code: 'hump' }];
        var p = KP.mc(r, 'Which graph shows ' + t('d') + ' for ' + t('0\\le t\\le ' + s.T) + '?', opts, 'At ' + t('t=0') + ', ' + t('d=' + s.D) + '; the ' + s.who + ' is overhead (' + t('d=0') + ') at ' + t('t=' + s.t0) + '; at ' + t('t=' + s.T) + ', ' + t('d=' + dT) + '. The graph is a V with vertex ' + t(pt(s.t0, 0)) + ', with solid dots at the ends of the domain.', ['Find ' + t('d') + ' at ' + t('t=0') + ', at the end, and where it is ' + t(0) + '.'], 'graph of a distance');
        p.input.columns = 2; return p;
      } },
      { id: 'q12b', level: 'BEG', make: function (r, s) { return U.num('When is the ' + s.who + ' directly over the camera? (in seconds)', s.t0, [{ v: s.D, code: CP + 'ctx-time', hint: 'Solve ' + t(s.v + 't-' + s.D + '=0') + ' for ' + t('t') + '.' }, { v: s.D * s.v, code: CP + 'ctx-time', hint: 'Divide by ' + t(s.v) + '.' }], t(s.v + 't-' + s.D + '=0') + ': ' + t('t=\\frac{' + s.D + '}{' + s.v + '}=' + s.t0) + ' s (the vertex).', ['Directly over the camera, the distance is ' + t(0) + '.'], 'context: the vertex', { box: 'number' }); } },
      { id: 'q12c', level: 'EMG', make: function (r, s) { var dT = s.v * s.T - s.D;
        return U.fields('How far from the camera was it at the start and at ' + t('t=' + s.T) + '? (in metres)', [{ label: 'At the start', name: 'start' }, { label: 'At ' + t('t=' + s.T), name: 'end' }], [K.number(s.D, function (v) { return v === -s.D ? { code: CP + 'ctx-neg', hint: 'A distance is never negative.' } : null; }), K.number(dT, function (v) { return v === -dT ? { code: CP + 'ctx-neg', hint: 'A distance is never negative.' } : null; })], [String(s.D), String(dT)], t(s.D) + ' m and ' + t(dT) + ' m',
          t('d(0)=|0-' + s.D + '|=' + s.D) + ' m; ' + t('d(' + s.T + ')=|' + s.v * s.T + '-' + s.D + '|=' + dT) + ' m.', ['Substitute ' + t('t=0') + ' and ' + t('t=' + s.T) + '.'], 'context: values', [[String(-s.D), String(dT)], [String(s.D), String(-dT)]]); } },
      { id: 'q12d', level: 'PRG', make: function (r, s) { var k = s.v * s.j, t1 = s.t0 - s.j, t2 = s.t0 + s.j;
        return U.vals('When is it ' + t(k) + ' m from the camera?', [t1, t2], [{ vals: [t1], code: CP + 'ctx-one', hint: 'The line ' + t('d=' + k) + ' meets both arms of the V: once before and once after it passes over.' }, { vals: [t2], code: CP + 'ctx-one', hint: 'The line ' + t('d=' + k) + ' meets both arms of the V.' }],
          'The line ' + t('d=' + k) + ' meets the V at ' + t('t=' + t1) + ' and ' + t('t=' + t2) + '. (Check: ' + t('|' + s.v * t1 + '-' + s.D + '|=' + k) + ' and ' + t('|' + s.v * t2 + '-' + s.D + '|=' + k) + '.)', ['Draw the horizontal line ' + t('d=' + k) + ' on your graph: where does it meet the V?'], 'context: two times', { v: 't', dec: true }); } },
      { id: 'q12e', level: 'PRG', make: function (r, s) { var dT = s.v * s.T - s.D, tg = '\\{d\\mid 0\\le d\\le ' + s.D + ',\\ d\\in\\mathbb{R}\\}';
        var p = KP.math('State the range of ' + t('d') + ' in this context.', U.setChk(tg, { v: 'd', wrong: [{ is: '\\{d\\mid 0\\le d\\le ' + dT + ',\\ d\\in\\mathbb{R}\\}', code: CP + 'rng-ctx', hint: 'The greatest distance is at the start: ' + t('d(0)=' + s.D) + '.' }, { is: '\\{d\\mid d\\ge 0,\\ d\\in\\mathbb{R}\\}', code: CP + 'rng-ctx', hint: 'The domain stops at ' + t('t=' + s.T) + ', so the distances stop too.' }, { is: '\\{d\\mid ' + dT + '\\le d\\le ' + s.D + ',\\ d\\in\\mathbb{R}\\}', code: CP + 'rng-ctx', hint: 'The drone is directly overhead at ' + t('t=' + s.t0) + ': ' + t('d=0') + ' is reached.' }] }), tg,
          'The least distance is ' + t(0) + ' (at ' + t('t=' + s.t0) + ') and the greatest is ' + t(s.D) + ' (at ' + t('t=0') + '; at ' + t('t=' + s.T) + ' it is only ' + t(dT) + '): ' + t(tg) + '.', ['Find the lowest and the highest points of the graph on the domain.'], 'context: range', { keys: 'set', vars: ['d'] });
        p.bad = ['\\{d\\mid 0\\le d\\le ' + dT + '\\}', '\\{d\\mid d\\ge 0\\}']; return p; } }] },
    { num: '13', shared: function (r) { return { h: pickWhere(function () { return nz(r, 1, 5); }, function (x) { return x !== 2; }) }; },
      stem: function (s) { return 'Compare the graphs of ' + t('y=|x' + sgT(-s.h) + '|') + ' and ' + t('y=|x|' + sgT(-s.h)) + '.'; }, parts: [
      { id: 'q13a', level: 'EMG', make: function (r, s) {
        var c1 = K.point([toR(s.h), [0, 1]], { wrong: [{ is: [toR(-s.h), [0, 1]], code: CP + 'v-sign', hint: 'The vertex of ' + t('y=|x' + sgT(-s.h) + '|') + ' is where ' + t('x' + sgT(-s.h) + '=0') + '.' }, { is: [[0, 1], toR(-s.h)], code: CP + 'v-yint', hint: 'That is the vertex of the other graph.' }] }), c2 = K.point([[0, 1], toR(-s.h)], { wrong: [{ is: [toR(s.h), [0, 1]], code: CP + 'v-yint', hint: 'That is the vertex of the other graph. ' + t('y=|x|' + sgT(-s.h)) + ' is ' + t('y=|x|') + ' moved ' + (s.h > 0 ? 'down' : 'up') + ' ' + t(Math.abs(s.h)) + '.' }, { is: [[0, 1], toR(s.h)], code: CP + 'v-sign', hint: 'At ' + t('x=0') + ', ' + t('y=|0|' + sgT(-s.h) + '=' + (-s.h)) + '.' }] });
        return U.fields('State the vertex of each graph.', [{ label: 'Vertex of ' + t('y=|x' + sgT(-s.h) + '|'), name: 'first vertex', mode: 'math', keys: 'u7kpts' }, { label: 'Vertex of ' + t('y=|x|' + sgT(-s.h)), name: 'second vertex', mode: 'math', keys: 'u7kpts' }], [c1, c2], [pt(s.h, 0), pt(0, -s.h)], t(pt(s.h, 0)) + ' and ' + t(pt(0, -s.h)),
          t('y=|x' + sgT(-s.h) + '|') + ': the line ' + t('y=x' + sgT(-s.h)) + ' with the part left of ' + t('x=' + s.h) + ' reflected, vertex ' + t(pt(s.h, 0)) + '.<br>' + t('y=|x|' + sgT(-s.h)) + ': the graph of ' + t('y=|x|') + ' moved ' + (s.h > 0 ? 'down' : 'up') + ' ' + t(Math.abs(s.h)) + ', vertex ' + t(pt(0, -s.h)) + '.', ['In ' + t('|x' + sgT(-s.h) + '|') + ' the number is combined <b>before</b> the absolute value; in ' + t('|x|' + sgT(-s.h)) + ' it is combined <b>after</b>.'], 'vertices of |x − h| and |x| − h', [[pt(0, -s.h), pt(s.h, 0)]]);
      } },
      { id: 'q13b', level: 'PRG', make: function (r, s) {
        var p = KP.math('State the range of ' + t('y=|x' + sgT(-s.h) + '|') + '.', U.setChk(RNG0, { v: 'y', wrong: [{ is: '\\{y\\mid y\\ge ' + (-s.h) + ',\\ y\\in\\mathbb{R}\\}', code: CP + 'rng-low', hint: 'Here ' + t(s.h) + ' is subtracted <b>inside</b> the bars, so the result is never negative.' }] }), RNG0, 'The value is an absolute value, never negative, and it is ' + t(0) + ' at ' + t('x=' + s.h) + ': ' + t(RNG0) + '.', ['Is the whole expression inside the bars?'], 'range of |x − h|', { keys: 'set', vars: ['y'] });
        p.bad = ['\\{y\\mid y\\ge ' + (-s.h) + '\\}']; return p;
      } },
      { id: 'q13c', level: 'PRG', make: function (r, s) {
        var tg = '\\{y\\mid y\\ge ' + (-s.h) + ',\\ y\\in\\mathbb{R}\\}';
        var p = KP.math('State the range of ' + t('y=|x|' + sgT(-s.h)) + '.', U.setChk(tg, { v: 'y', wrong: [{ is: RNG0, code: CP + 'rng-low', hint: 'The ' + t(s.h) + ' is ' + (s.h > 0 ? 'subtracted' : 'added') + ' <b>after</b> the absolute value, so the lowest value is ' + t('0' + sgT(-s.h) + '=' + (-s.h)) + '.' }] }), tg, 'The least value of ' + t('|x|') + ' is ' + t(0) + ', so the least value of ' + t('|x|' + sgT(-s.h)) + ' is ' + t(-s.h) + ': ' + t(tg) + '.', ['What is the lowest point of the graph?'], 'range of |x| − h', { keys: 'set', vars: ['y'] });
        p.bad = [RNG0]; return p;
      } }] },
    { num: '14', parts: [{ id: 'q14', level: 'EMG', make: function (r) {
      var z = pickWhere(function () { return { x1: nz(r, 1, 7), y1: -r.int(2, 9), x2: nz(r, 1, 8), y2: r.int(1, 9) }; }, function (s) { return s.x1 !== s.x2 && s.x1 !== -s.x2 && !(s.x1 === -2 && s.y1 === -5) && Math.abs(s.y1) !== s.y2; });
      var P2 = function (a2, b2) { return t(pt(a2[0], a2[1])) + ' and ' + t(pt(b2[0], b2[1])); };
      return KP.mc(r, 'The graph of ' + t('y=f(x)') + ' passes through ' + P2([z.x1, z.y1], [z.x2, z.y2]) + '. The graph of ' + t('y=|f(x)|') + ' must pass through', [{ html: P2([z.x1, -z.y1], [z.x2, z.y2]), right: true }, { html: P2([-z.x1, -z.y1], [z.x2, z.y2]), why: 'The ' + t('x') + '-coordinates do not change.' }, { html: P2([z.x1, -z.y1], [z.x2, -z.y2]), why: t(pt(z.x2, z.y2)) + ' is already above the axis, so it does not move.' }, { html: P2([-z.x1, z.y1], [-z.x2, z.y2]), why: 'Only the ' + t('y') + '-values are made non-negative; the ' + t('x') + '-values stay.' }],
        'Only the ' + t('y') + '-coordinates are made non-negative: ' + t('(' + z.x1 + ',\\ ' + A(z.y1) + ')=' + pt(z.x1, -z.y1)) + ', and ' + t(pt(z.x2, z.y2)) + ' stays.', ['A point ' + t('(x,\\ y)') + ' becomes ' + t('(x,\\ |y|)') + '.'], 'points on |f| (multiple choice)');
    } }] },
    { num: '15', parts: [{ id: 'q15', level: 'PRG', make: function (r) {
      var s = L(r, avoidL({ as: [2, 3, 4, 5], hmin: 1, hmax: 6 })), a = rv(s.a), b = s.b, h = s.h, f = fT(a, b);
      var trues = [['The graphs of ' + t('y=f(x)') + ' and ' + t('y=|f(x)|') + ' both have ' + t('x') + '-intercept ' + t(h) + '.'], ['The ' + t('y') + '-intercept of ' + t('y=|f(x)|') + ' is ' + t(-b) + '.'], ['The range of ' + t('y=|f(x)|') + ' is ' + t(RNG0) + '.'], [t('|f(x)|=' + f) + ' if ' + t('x\\ge ' + h) + '.'], [t('|f(x)|=' + tx(lin(-a, -b))) + ' if ' + t('x<' + h) + '.'], ['The vertex of ' + t('y=|f(x)|') + ' is ' + t(pt(h, 0)) + '.']];
      var falses = [[t('|f(x)|=' + f) + ' if ' + t('x<' + h) + '.', 'For ' + t('x<' + h) + ', ' + t(f + '<0') + ', so ' + t('|f(x)|=' + tx(lin(-a, -b))) + '.'], ['The ' + t('y') + '-intercept of ' + t('y=|f(x)|') + ' is ' + t(b) + '.', t('|f(0)|=' + A(b) + '=' + (-b)) + '.'], ['The range of ' + t('y=|f(x)|') + ' is ' + t('\\{y\\mid y\\ge ' + b + ',\\ y\\in\\mathbb{R}\\}') + '.', 'The lowest point is the vertex, on the ' + t('x') + '-axis: the range is ' + t('y\\ge 0') + '.'], ['The vertex of ' + t('y=|f(x)|') + ' is ' + t(pt(0, -b)) + '.', 'The vertex is the zero of ' + t('f') + ': ' + t(pt(h, 0)) + '.'], [t('|f(x)|=' + tx(lin(-a, b))) + ' if ' + t('x<' + h) + '.', 'The opposite of ' + t(f) + ' changes the sign of every term: ' + t(tx(lin(-a, -b))) + '.']];
      var F = r.pick(falses), T3 = r.sample(trues, 3);
      return KP.mc(r, 'Let ' + t('f(x)=' + f) + '. Which statement is <b>false</b>?', [{ html: F[0], right: true }].concat(T3.map(function (x) { return { html: x[0], why: 'That statement is true. Check each one with the vertex ' + t(pt(h, 0)) + ', ' + t('|f(0)|=' + (-b)) + ' and the sign of ' + t(f) + ' on each side.' }; })),
        'The false one: ' + F[0] + ' ' + F[1] + '<br>(' + t(f + '=0') + ' at ' + t('x=' + h) + '; ' + t('|f(0)|=' + (-b)) + '; the range is ' + t('y\\ge 0') + '.)', ['Check each statement: find the vertex, ' + t('|f(0)|') + ', and the sign of ' + t('f(x)') + ' on each side of the vertex.'], 'which statement is false');
    } }] },
    { num: '16', parts: [{ id: 'q16', level: 'PRG', make: function (r) {
      var s = L(r, avoidL({ as: [-2, -3, -4, -5], half: r.chance(0.5), hmin: 1, hmax: 5, test: function (z) { return z.b > 0 && Math.abs(z.h * 2 - Math.round(z.h * 2)) < 1e-9; } })), a = rv(s.a), b = s.b, h = s.h, cf = P.seq([M(b, 0), M(a, 1)]), op = tx(lin(-a, -b));
      var C = function (p1, i1, p2, i2) { return t('y=\\begin{cases}' + p1 + ', & ' + i1 + '\\\\ ' + p2 + ', & ' + i2 + '\\end{cases}'); };
      return KP.mc(r, 'The piecewise form of ' + t('y=|' + cf + '|') + ' is', [{ html: C(cf, 'x\\le ' + rt(h), op, 'x>' + rt(h)), right: true }, { html: C(cf, 'x\\ge ' + rt(h), op, 'x<' + rt(h)), why: 'Solve ' + t(cf + '\\ge 0') + ': dividing by ' + t(a) + ' reverses the inequality, so ' + t('x\\le ' + rt(h)) + '.' },
        { html: C(cf, 'x\\le ' + rt(-h), op, 'x>' + rt(-h)), why: 'The pieces meet where ' + t(cf + '=0') + ', at ' + t('x=' + rt(h)) + '.' }, { html: C(cf, 'x\\le ' + rt(h), tx(lin(-a, b)), 'x>' + rt(h)), why: 'The second piece is the opposite of the whole expression: change the sign of every term.' }],
        t(cf + '\\ge 0') + ' gives ' + t(tx(M(a, 1)) + '\\ge ' + (-b)) + ', so ' + t('x\\le ' + rt(h)) + ' (dividing by a negative reverses the sign). The other piece is ' + t('-(' + cf + ')=' + op) + '.', ['Solve ' + t(cf + '\\ge 0') + ' for ' + t('x') + ' carefully.'], 'piecewise form (multiple choice)');
    } }] },
    { num: '17', parts: [{ id: 'q17', level: 'PRG', make: function (r) {
      var z = pickWhere(function () { return { m: -r.int(2, 8), b: r.int(3, 25) }; }, function (s) { var a = s.b / -s.m, v = Math.round((a + s.b) * 10) / 10; return !(s.m === -4 && s.b === 10) && !(s.m === -5 && s.b === 13) && String(v).length <= 4 && Math.abs(a * 10 - Math.round(a * 10)) < 1e-9 && !Number.isInteger(a); });
      var a = z.b / -z.m, v = Math.round((a + z.b) * 10) / 10;
      return KP.nr('<b>Numerical response.</b> The graph of ' + t('y=|' + z.m + 'x+' + z.b + '|') + ' has its vertex at ' + t('(a,\\ 0)') + ' and its ' + t('y') + '-intercept at ' + t('(0,\\ b)') + '. The value of ' + t('a+b') + ', to the nearest tenth, is ______.', v,
        function (x) { if (Math.abs(x - Math.round((z.b - a) * 10) / 10) < 1e-9) return { code: CP + 'v-sign', hint: 'Check the sign of ' + t('a') + ': solve ' + t(z.m + 'x+' + z.b + '=0') + '.' }; return null; },
        t(z.m + 'x+' + z.b + '=0') + ' gives ' + t('a=' + dt(a)) + '; ' + t('b=|' + z.b + '|=' + z.b) + '; ' + t('a+b=' + dt(v)) + '.', ['The vertex is the zero of the line; the ' + t('y') + '-intercept is ' + t('|b|') + '.'], 'vertex and y-intercept (numerical response)');
    } }] },
    { num: '18', parts: [{ id: 'q18', level: 'ADV', make: function (r) {
      var z = pickWhere(function () { return { m: nz(r, 2, 6), x1: nz(r, 1, 6), y1: nz(r, 1, 12) }; }, function (s) { var h = s.x1 - s.y1 / s.m; return !(s.m === 2 && s.x1 === 1 && s.y1 === -5) && h > 0 && String(Math.round(h * 10) / 10).length <= 4 && Math.abs(h * 10 - Math.round(h * 10)) < 1e-9 && !Number.isInteger(h); });
      var h = z.x1 - z.y1 / z.m, b = z.y1 - z.m * z.x1;
      return KP.nr('<b>Numerical response.</b> A line ' + t('y=f(x)') + ' has slope ' + t(z.m) + ' and passes through ' + t(pt(z.x1, z.y1)) + '. The graph of ' + t('y=|f(x)|') + ' touches the ' + t('x') + '-axis at ' + t('x=') + ' ______.', Math.round(h * 10) / 10,
        function (x) { if (Math.abs(x - (z.x1 + z.y1 / z.m)) < 1e-9) return { code: CP + 'v-sign', hint: 'Solve ' + t('f(x)=0') + ' again: ' + t(z.y1 + sgT(z.m) + '(x' + sgT(-z.x1) + ')=0') + '.' }; return null; },
        t('f(x)=' + z.y1 + sgT(z.m) + '(x' + sgT(-z.x1) + ')=' + tx(lin(z.m, b))) + '. ' + t(tx(lin(z.m, b)) + '=0') + ' gives ' + t('x=' + dt(h)) + ' (the vertex of ' + t('y=|f(x)|') + ').', ['Write the equation of the line, then find its zero.'], 'vertex from a line (numerical response)');
    } }] }
  ];

  /* ---------- extra practice ---------- */
  var EXTRA = [
    { num: '1', section: 'A. Skills', shared: function (r) {
        var used = AV.slice(), mk = function (o) { o.avoid = used; o.draw = true; o.bmax = 6; var s = L(r, o); used.push([s.a, s.b]); return s; };
        return { a: mk({ as: [1], hmin: -4, hmax: 4 }), b: mk({ as: [[-1, 2], [1, 2], [-1, 3]], hs: [-4, -2, 2, 4, 6, -6, 3, -3] }), c: mk({ as: [3, -3, 2], hmin: -2, hmax: 2 }) };
      }, parts: ['a', 'b', 'c'].map(function (k, i) { return { id: 'e1' + k, level: ['BEG', 'EMG', 'EMG'][i], make: function (r, S) { var s = S[k]; return vDraw(r, s.a, s.b, { showF: true }); } }; }) },
    { num: '2', stem: 'For each function, state the vertex, the \\(y\\)-intercept, the domain and the range.', parts: [
      { id: 'e2a', level: 'BEG', make: function (r) { var s = L(r, avoidL({ as: [1], hmin: -9, hmax: 9 })); return featPart(r, s.a, s.b, { short: true }); } },
      { id: 'e2b', level: 'EMG', make: function (r) { var s = L(r, avoidL({ as: [3, 4, 5, 6], hmin: -5, hmax: 5 })); return featPart(r, s.a, s.b, { short: true }); } },
      { id: 'e2c', level: 'PRG', make: function (r) { var s = L(r, avoidL({ as: [[-3, 4], [-2, 3], [-3, 2], [-4, 3], [-2, 5]], hs: [-8, -6, -4, -3, 3, 4, 6, 8, 9] })); return featPart(r, s.a, s.b, { short: true }); } }] },
    { num: '3', stem: 'Write each function in piecewise form.', parts: [
      { id: 'e3a', level: 'BEG', make: function (r) { var s = L(r, avoidL({ as: [1], hmin: -12, hmax: 12 })); return U.piece(CP, s.a, s.b, { short: true }); } },
      { id: 'e3b', level: 'EMG', make: function (r) { var s = L(r, avoidL({ as: [2, 4, 6], half: true, hmin: -4, hmax: 3 })); return U.piece(CP, s.a, s.b, { short: true }); } },
      { id: 'e3c', level: 'PRG', make: function (r) { var s = L(r, avoidL({ as: [-2, -3, -4, -5], hmin: 1, hmax: 6 })); return U.piece(CP, s.a, s.b, { cf: true, short: true }); } },
      { id: 'e3d', level: 'PRG', make: function (r) { var s = L(r, avoidL({ as: [-1], hmin: -8, hmax: 8, test: function (z) { return z.b < 0; } })); return U.piece(CP, s.a, s.b, { short: true }); } }] },
    { num: '4', section: 'B. Applying', shared: function (r) { return L(r, avoidL({ as: [2, -2], half: true, hmin: -3, hmax: 2, draw: true })); },
      stem: function (s) { return 'Consider ' + t('y=' + AL(fT(s.a, s.b))) + '.'; }, parts: [
      { id: 'e4a', level: 'EMG', make: function (r, s) { return vDraw(r, s.a, s.b, {}); } },
      { id: 'e4b', level: 'BEG', make: function (r, s) {
        var rc = U.setChk(RNG0, { v: 'y', wrong: [{ is: RNGALL, code: CP + 'rng-f', hint: 'The graph of ' + t('y=|f(x)|') + ' is never below the ' + t('x') + '-axis.' }] });
        return U.fields('State the domain and the range.', [{ label: 'Domain', name: 'domain', mode: 'math', keys: 'set', vars: ['x', 'y'] }, { label: 'Range', name: 'range', mode: 'math', keys: 'set', vars: ['x', 'y'] }], [U.setChk(DOM), rc], [DOM, RNG0], 'domain ' + t(DOM) + '; range ' + t(RNG0),
          'Every ' + t('x') + ' can be used: domain ' + t(DOM) + '. The V is never below the ' + t('x') + '-axis and touches it at the vertex: range ' + t(RNG0) + '.', ['The lowest point of the V is the vertex.'], 'domain and range of y = |ax + b|', [[DOM, RNGALL]]);
      } },
      { id: 'e4c', level: 'PRG', make: function (r, s) { return U.piece(CP, s.a, s.b); } }] },
    { num: '5', stem: 'The graph of \\(y=|f(x)|\\), where \\(f\\) is linear, is shown.', shared: function (r) { return L(r, avoidL({ as: [2, 3, -2, -3], hmin: -3, hmax: 3, bmax: 6, draw: true })); }, parts: [
      { id: 'e5a', level: 'ADV', make: function (r, s) {
        var a = toR(s.a), Lp = lin(a, s.b), Ln = P.neg(Lp), is1 = U.polyIs(Lp), is2 = U.polyIs(Ln), h = s.h, yi = Math.abs(s.b), R = U.armPt(s.a, s.b, 1, 1);
        var svg = vSvg(s.a, s.b, [[h, 0], [0, yi], [2 * h, yi]].filter(function (p, i, arr) { return i < 2 || Math.abs(p[0]) <= 6; }));
        return { prompt: 'Write two possible equations for ' + t('y=f(x)') + '.' + svg, input: { type: 'fields', fields: [{ label: 'One line: ' + t('y='), name: 'first line', mode: 'math', keys: 'poly', vars: ['x'] }, { label: 'The other: ' + t('y='), name: 'second line', mode: 'math', keys: 'poly', vars: ['x'] }] },
          check: function (resp) { resp = resp || []; var s1 = String(resp[0] || ''), s2 = String(resp[1] || ''); if (!s1.trim() || !s2.trim()) return form('empty', 'Write both possible equations.'); if ((is1(s1) && is2(s2)) || (is2(s1) && is1(s2))) return ok(); if ((is1(s1) && is1(s2)) || (is2(s1) && is2(s2))) return wrong(CP + 'back-same', 'You wrote the same line twice. The other one is its reflection in the ' + t('x') + '-axis.'); if (is1(s1) || is2(s1) || is1(s2) || is2(s2)) return wrong(CP + 'back-same', 'One line is right. The other one is its reflection in the ' + t('x') + '-axis: change every sign.'); return wrong('value', null); },
          key: [tx(Lp), tx(Ln)], answer: t('y=' + tx(Lp)) + ' or ' + t('y=' + tx(Ln)), solution: 'Vertex ' + t(pt(h, 0)) + ', ' + t('y') + '-intercept ' + t(pt(0, yi)) + ': the arm through them has slope ' + t(rt(-yi / h)) + ', so one line is ' + t('y=' + tx(h < 0 ? (rv(a) > 0 ? Lp : Ln) : (rv(a) > 0 ? Ln : Lp))) + '; its reflection is the other.<br>' + t('f(x)=' + tx(Lp)) + ' or ' + t('f(x)=' + tx(Ln)) + '.',
          hints: ['Use the vertex and the ' + t('y') + '-intercept to find the slope of one arm.', 'The other possible line is the reflection: ' + t('y=-f(x)') + '.'], text: 'two possible lines from |f|', bad: [[tx(Lp), tx(Lp)]] };
      } },
      { id: 'e5b', level: 'ADV', make: function (r, s) { var aa = Math.abs(rv(s.a)), h = s.h, yi = Math.abs(s.b);
        return U.piece(CP, aa, -aa * h, { prompt: 'Write ' + t('y=|f(x)|') + ' in piecewise form: the value of ' + t('x') + ' where the pieces meet, and the expression on each side.' + vSvg(s.a, s.b, [[h, 0], [0, yi]]) }); } }] },
    { num: '6', stem: 'The function \\(y=f(x)\\) is linear.', parts: [
      { id: 'e6a', level: 'BEG', make: function (r) { var x = nz(r, 1, 9), y = -r.int(1, 9); if (x === -6 && y === -2) y = -3;
        return U.point('The point ' + t(pt(x, y)) + ' is on ' + t('y=f(x)') + '. State the matching point on ' + t('y=|f(x)|') + '.', [x, -y], [{ p: [x, y], code: CP + 'pt-neg', hint: t(A(y) + '=' + (-y)) + '.' }, { p: [-x, -y], code: CP + 'pt-xchg', hint: 'The ' + t('x') + '-value stays.' }], t(pt(x, -y)) + ': only the ' + t('y') + '-value changes.', ['A point ' + t('(x,\\ y)') + ' becomes ' + t('(x,\\ |y|)') + '.'], 'point on |f|'); } },
      { id: 'e6b', level: 'EMG', make: function (r) {
        var z = pickWhere(function () { return { h: nz(r, 1, 9) + (r.chance(0.5) ? 0.5 : 0), b: -r.int(2, 12) }; }, function (s) { return !(s.h === 2.5 && s.b === -7); });
        return U.fields('The ' + t('x') + '-intercept of ' + t('y=f(x)') + ' is ' + t(dt(z.h)) + ' and its ' + t('y') + '-intercept is ' + t(z.b) + '. State the intercepts of ' + t('y=|f(x)|') + '.', [{ label: t('x') + '-intercept', name: 'x-intercept' }, { label: t('y') + '-intercept', name: 'y-intercept' }],
          [K.number(z.h, function (v) { return Math.abs(v + z.h) < 1e-9 ? { code: CP + 'inv-sign', hint: 'The ' + t('x') + '-intercept is an invariant point: it does not move.' } : null; }), K.number(-z.b, function (v) { return v === z.b ? { code: CP + 'yint-neg', hint: t(A(z.b) + '=' + (-z.b)) + '.' } : null; })], [dt(z.h), String(-z.b)], t('x') + '-intercept ' + t(dt(z.h)) + '; ' + t('y') + '-intercept ' + t(-z.b),
          t('x') + '-intercept ' + t(dt(z.h)) + ' (invariant); ' + t('y') + '-intercept ' + t(A(z.b) + '=' + (-z.b)) + '.', ['The ' + t('x') + '-intercept does not move; the ' + t('y') + '-intercept becomes its absolute value.'], 'intercepts of |f|', [[dt(z.h), String(z.b)]]); } }] },
    { num: '7', shared: function (r) { return ctxShared(r, 'car'); },
      stem: function (s) { return 'A car drives at a constant ' + t(s.v) + ' km/h along a highway toward ' + s.town + ', which is ' + t(s.D) + ' km ahead, and continues past it. Its distance from ' + s.town + ' after ' + t('t') + ' hours is ' + t('d=|' + s.D + '-' + s.v + 't|') + ' kilometres, for ' + t('0\\le t\\le ' + dt(s.T)) + '.'; }, parts: [
      { id: 'e7a', level: 'BEG', make: function (r, s) { return U.num('When does the car pass through ' + s.town + '? (in hours)', s.t0, [{ v: s.D * s.v, code: CP + 'ctx-time', hint: 'Solve ' + t(s.D + '-' + s.v + 't=0') + '.' }], t(s.D + '-' + s.v + 't=0') + ': ' + t('t=\\frac{' + s.D + '}{' + s.v + '}=' + dt(s.t0)) + ' h.', ['At ' + s.town + ' the distance is ' + t(0) + '.'], 'context: vertex', { box: 'number' }); } },
      { id: 'e7b', level: 'EMG', make: function (r, s) { var dT = Math.round((s.v * s.T - s.D) * 1000) / 1000; return U.num('How far from ' + s.town + ' is the car at ' + t('t=' + dt(s.T)) + '? (in km)', dT, [{ v: -dT, code: CP + 'ctx-neg', hint: 'A distance is never negative.' }], t('|' + s.D + '-' + dt(s.v * s.T) + '|=' + A(dt(s.D - s.v * s.T)) + '=' + dt(dT)) + ' km.', ['Substitute ' + t('t=' + dt(s.T)) + '.'], 'context: value', { box: 'number' }); } },
      { id: 'e7c', level: 'PRG', make: function (r, s) { var k = s.v * s.j, t1 = s.t0 - s.j, t2 = s.t0 + s.j;
        return U.vals('When is the car ' + t(k) + ' km from ' + s.town + '?', [t1, t2], [{ vals: [t1], code: CP + 'ctx-one', hint: 'It is ' + t(k) + ' km away twice: before and after it passes through.' }, { vals: [t2], code: CP + 'ctx-one', hint: 'It is ' + t(k) + ' km away twice: before and after it passes through.' }],
          'The line ' + t('d=' + k) + ' meets the V at ' + t('t=' + dt(t1)) + ' and ' + t('t=' + dt(t2)) + ' h. (Check: ' + t('|' + s.D + '-' + dt(s.v * t1) + '|=' + k) + ' and ' + t('|' + s.D + '-' + dt(s.v * t2) + '|=' + k) + '.)', ['Sketch the graph (or graph it on your calculator) with the line ' + t('d=' + k) + '.'], 'context: two times', { v: 't', dec: true }); } },
      { id: 'e7d', level: 'PRG', make: function (r, s) { var dT = Math.round((s.v * s.T - s.D) * 1000) / 1000, dom = '\\{t\\mid 0\\le t\\le ' + dt(s.T) + ',\\ t\\in\\mathbb{R}\\}', rng = '\\{d\\mid 0\\le d\\le ' + s.D + ',\\ d\\in\\mathbb{R}\\}';
        var dc = U.setChk(dom, { v: 't', wrong: [{ is: '\\{t\\mid t\\in\\mathbb{R}\\}', code: CP + 'dom-ctx', hint: 'In this context ' + t('t') + ' only runs from ' + t(0) + ' to ' + t(dt(s.T)) + '.' }, { is: '\\{t\\mid t\\ge 0,\\ t\\in\\mathbb{R}\\}', code: CP + 'dom-ctx', hint: 'The domain stops at ' + t('t=' + dt(s.T)) + '.' }] });
        var rc = U.setChk(rng, { v: 'd', wrong: [{ is: '\\{d\\mid 0\\le d\\le ' + dt(dT) + ',\\ d\\in\\mathbb{R}\\}', code: CP + 'rng-ctx', hint: 'The greatest distance is at the start: ' + t(s.D) + ' km.' }, { is: '\\{d\\mid d\\ge 0,\\ d\\in\\mathbb{R}\\}', code: CP + 'rng-ctx', hint: 'The distances stop at the ends of the domain.' }, { is: '\\{d\\mid ' + dt(dT) + '\\le d\\le ' + s.D + ',\\ d\\in\\mathbb{R}\\}', code: CP + 'rng-ctx', hint: 'The car passes through ' + s.town + ': ' + t('d=0') + ' is reached.' }] });
        return U.fields('State the domain and the range of ' + t('d') + ' in this context.', [{ label: 'Domain', name: 'domain', mode: 'math', keys: 'set', vars: ['t', 'd'] }, { label: 'Range', name: 'range', mode: 'math', keys: 'set', vars: ['t', 'd'] }], [dc, rc], [dom, rng], 'domain ' + t(dom) + '; range ' + t(rng),
          'Domain: the times given, ' + t(dom) + '. Range: from ' + t(0) + ' (at ' + t('t=' + dt(s.t0)) + ') up to ' + t(s.D) + ' (at ' + t('t=0') + '; at the end it is ' + t(dt(dT)) + '): ' + t(rng) + '.', ['The domain is the times in the problem; the range runs from the lowest to the highest point of the graph.'], 'context: domain and range', [[dom, '\\{d\\mid 0\\le d\\le ' + dt(dT) + '\\}']]); } }] },
    { num: '8', parts: [{ id: 'e8', level: 'PRG', make: function (r) {
      var z = pickWhere(function () { return { a: r.int(2, 6), b: r.int(3, 15) }; }, function (s) { return !(s.a === 2 && s.b === 8) && (s.b % s.a !== 0 || r.chance(0.5)); });
      var e = z.a + 'x-' + z.b;
      return KP.mc(r, 'Which function has the same graph as ' + t('y=|' + e + '|') + '?', [{ html: t('y=|' + z.b + '-' + z.a + 'x|'), right: true }, { html: t('y=' + z.a + '|x|-' + z.b), why: 'That V has its vertex at ' + t(pt(0, -z.b)) + ': the ' + t(z.b) + ' is subtracted after the absolute value.' }, { html: t('y=|' + z.a + 'x|-' + z.b), why: 'That V has its vertex at ' + t(pt(0, -z.b)) + '.' }, { html: t('y=-|' + e + '|'), why: 'That V opens down.' }],
        t(z.b + '-' + z.a + 'x=-(' + e + ')') + ', and opposites have the same absolute value. (The second and third have vertex ' + t(pt(0, -z.b)) + '; the last opens down.)', ['Which expression is the opposite of ' + t(e) + '?'], 'same graph as |ax − b|');
    } }] },
    { num: '9', parts: [{ id: 'e9', level: 'PRG', make: function (r) {
      var z = pickWhere(function () { return { m: -r.int(2, 8), b: r.int(3, 30) }; }, function (s) { var a = s.b / -s.m, v = Math.round((s.b - a) * 10) / 10; return !(s.m === -5 && s.b === 13) && Math.abs(a * 10 - Math.round(a * 10)) < 1e-9 && !Number.isInteger(a) && String(v).length <= 4 && v > 0; });
      var a = z.b / -z.m, v = Math.round((z.b - a) * 10) / 10;
      return KP.nr('<b>Numerical response.</b> The graph of ' + t('y=|f(x)|') + ', where ' + t('f(x)=' + z.m + 'x+' + z.b) + ', touches the ' + t('x') + '-axis at ' + t('(a,\\ 0)') + ' and crosses the ' + t('y') + '-axis at ' + t('(0,\\ b)') + '. The value of ' + t('b-a') + ', to the nearest tenth, is ______.', v,
        function (x) { if (Math.abs(x - Math.round((z.b + a) * 10) / 10) < 1e-9) return { code: CP + 'v-sign', hint: 'Check the sign of ' + t('a') + '.' }; return null; },
        t(z.m + 'x+' + z.b + '=0') + ' gives ' + t('a=' + dt(a)) + '; ' + t('b=|' + z.b + '|=' + z.b) + '; ' + t('b-a=' + dt(v)) + '.', ['The vertex is the zero of ' + t('f') + '.'], 'vertex and intercept (numerical response)');
    } }] },
    { num: '10', section: 'C. Stretch', shared: function (r) { return { p: pickWhere(function () { return r.int(2, 8); }, function (x) { return x !== 4; }) }; },
      stem: function (s) { return 'Let ' + t('y=|x|+|x-' + s.p + '|') + '. Write ' + t('y') + ' without absolute value symbols when'; }, parts: [['lo', 'MAS'], ['mid', 'MAS'], ['hi', 'MAS']].map(function (d, j) {
        return { id: 'e10' + 'abc'.charAt(j), level: d[1], make: function (r, s) {
          var p = s.p, E = { lo: P.add(M(-2, 1), M(p, 0)), mid: P.num(p), hi: P.add(M(2, 1), M(-p, 0)) }, iv = d[0], ivT = { lo: 'x<0', mid: '0\\le x\\le ' + p, hi: 'x>' + p }, wr = [];
          ['lo', 'mid', 'hi'].forEach(function (k) { if (k !== iv) wr.push({ is: E[k], code: CP + 'simp-case', hint: 'That is the form on a different interval. For ' + t(ivT[iv]) + ', check the sign of ' + t('x') + ' and of ' + t('x-' + p) + '.' }); });
          if (iv === 'mid') wr.push({ is: P.add(M(2, 1), M(-p, 0)), code: CP + 'simp-case', hint: 'For ' + t(ivT.mid) + ', ' + t('x-' + p + '\\le 0') + ', so ' + t('|x-' + p + '|=-(x-' + p + ')') + '.' });
          var sol = { lo: t('-x-(x-' + p + ')=-2x+' + p), mid: t('x-(x-' + p + ')=' + p), hi: t('x+(x-' + p + ')=2x-' + p) }[iv];
          return U.poly(t(ivT[iv]) + ':', E[iv], wr, 'For ' + t(ivT[iv]) + ': ' + (iv === 'lo' ? t('|x|=-x') + ' and ' + t('|x-' + p + '|=-(x-' + p + ')') : iv === 'mid' ? t('|x|=x') + ' and ' + t('|x-' + p + '|=-(x-' + p + ')') : t('|x|=x') + ' and ' + t('|x-' + p + '|=x-' + p)) + ': ' + sol + '.', ['Decide the sign of ' + t('x') + ' and of ' + t('x-' + p) + ' on the interval.'], 'simplifying |x| + |x − p|');
        } };
      }).concat([{ id: 'e10d', level: 'ADV', make: function (r, s) {
        var tg = '\\{y\\mid y\\ge ' + s.p + ',\\ y\\in\\mathbb{R}\\}';
        var p = KP.math('The graph is a flat-bottomed V. State its range.', U.setChk(tg, { v: 'y', wrong: [{ is: RNG0, code: CP + 'rng-low', hint: 'The flat bottom is at ' + t('y=' + s.p) + ' (the distance from ' + t(0) + ' to ' + t(s.p) + '): the graph never gets lower.' }] }), tg, 'Between ' + t(0) + ' and ' + t(s.p) + ' the graph is flat at ' + t('y=' + s.p) + '; outside it rises. Range ' + t(tg) + '.', ['What is the value on the flat part?'], 'range of |x| + |x − p|', { keys: 'set', vars: ['y'] });
        p.bad = [RNG0]; return p;
      } }]) },
    { num: '11', parts: [{ id: 'e11', level: 'ADV', make: function (r) {
      var z = pickWhere(function () { return { a: r.int(2, 5), h: nz(r, 1, 5) }; }, function (s) { return !(s.a === 2 && s.h === 3); });
      var e = z.a + 'x' + sgT(-z.a * z.h), rows = [{ id: 'pos', html: t('k>0') }, { id: 'zero', html: t('k=0') }, { id: 'neg', html: t('k<0') }], cols = [{ id: 'c0', html: t(0) }, { id: 'c1', html: t(1) }, { id: 'c2', html: t(2) }];
      var p = KP.grid('Use the graph of ' + t('y=|' + e + '|') + ' and a horizontal line ' + t('y=k') + ' to decide how many solutions the equation ' + t('|' + e + '|=k') + ' has.', rows, cols, { pos: 'c2', zero: 'c1', neg: 'c0' },
        { colHead: 'Number of solutions', why: function (rid) { return { code: CP + 'cnt', hint: { pos: 'A line above the vertex crosses both arms of the V.', zero: 'The line ' + t('y=0') + ' touches only the vertex.', neg: 'The V is never below the ' + t('x') + '-axis.' }[rid] }; } },
        'The V has its vertex at ' + t(pt(z.h, 0)) + ' and opens up. ' + t('k>0') + ': the line crosses both arms, two solutions. ' + t('k=0') + ': it touches only the vertex, one solution (' + t('x=' + z.h) + '). ' + t('k<0') + ': the line is below the V, no solution.', ['Picture the V and a horizontal line moving up and down.'], 'number of solutions of |ax + b| = k');
      p.bad = [{ pos: 'c2', zero: 'c2', neg: 'c0' }]; return p;
    } }] },
    { num: '12', parts: [{ id: 'e12', level: 'ADV', make: function (r) {
      var z = pickWhere(function () { return { a: r.int(2, 5), h: nz(r, 1, 6) }; }, function (s) { return !(s.a === 2 && s.h === 3); });
      var e = z.a + 'x' + sgT(-z.a * z.h), inner = 'x' + sgT(-z.h);
      return KP.mc(r, t('|' + e + '|=|' + z.a + '(' + inner + ')|=|' + z.a + '|\\,|' + inner + '|=' + z.a + '|' + inner + '|') + '. Describe the graph of ' + t('y=|' + e + '|') + ' as a transformation of ' + t('y=|' + inner + '|') + '.', [{ html: 'A vertical stretch by a factor of ' + t(z.a) + ': the same vertex ' + t(pt(z.h, 0)) + ', arms ' + t(z.a) + ' times as steep.', right: true },
        { html: 'A horizontal stretch by a factor of ' + t(z.a) + ', with the vertex moved to ' + t(pt(z.a * z.h, 0)) + '.', why: 'The vertex stays at ' + t(pt(z.h, 0)) + ': ' + t(e + '=0') + ' there.' }, { html: 'A translation ' + t(z.a) + ' units up.', why: 'Every ' + t('y') + '-value is <b>multiplied</b> by ' + t(z.a) + ', not increased by ' + t(z.a) + '.' }, { html: 'A reflection in the ' + t('x') + '-axis.', why: 'Both graphs are V shapes that open up.' }],
        'Using ' + t('|ab|=|a|\\,|b|') + ': ' + t('|' + e + '|=' + z.a + '|' + inner + '|') + '. Every ' + t('y') + '-value is multiplied by ' + t(z.a) + ': a vertical stretch by a factor of ' + t(z.a) + ', same vertex ' + t(pt(z.h, 0)) + '.', ['Compare the ' + t('y') + '-values of the two functions at the same ' + t('x') + '.'], 'transformation: |ax − ah| = a|x − h|');
    } }] },
    { num: '13', parts: [{ id: 'e13', level: 'MAS', make: function (r) {
      var z = pickWhere(function () { return { m: nz(r, 1, 4) * (r.chance(0.3) ? 0.5 : 1), h: r.int(-5, 5) + 0.5 * (r.chance(0.5) ? 1 : 0), x1: nz(r, 1, 6) }; }, function (s) { var b = -s.m * s.h, y1 = s.m * s.x1 + b; return s.h !== 0 && s.x1 !== s.h && Number.isInteger(y1) && y1 !== 0 && Math.abs(y1) <= 15 && Math.abs(b * 2 - Math.round(b * 2)) < 1e-9 && b !== 0 && !(s.m === -2 && s.h === 1.5 && s.x1 === -2); });
      var b = -z.m * z.h, y1 = z.m * z.x1 + b, f = lin(toR(z.m), toR(b)), yi = Math.abs(b);
      var cf = K.poly(f, { expanded: false, wrong: [{ is: P.neg(f), code: CP + 'back-sign', hint: 'Check: ' + t('f(' + z.x1 + ')') + ' must be ' + t(y1) + ', not ' + t(-y1) + '.' }, { is: lin(toR(1 / z.m), toR(-z.h / z.m)), code: CP + 'back-slope', hint: 'Slope is rise over run.' }] });
      return U.fields('A linear function ' + t('f') + ' has ' + t('f(' + z.x1 + ')=' + y1) + ', and the graph of ' + t('y=|f(x)|') + ' has its vertex at ' + t(pt(z.h, 0)) + '. Determine ' + t('f(x)') + ' and the ' + t('y') + '-intercept of ' + t('y=|f(x)|') + '.', [{ label: t('f(x)='), name: 'f(x)', mode: 'math', keys: 'poly', vars: ['x'] }, { label: t('y') + '-intercept of ' + t('y=|f(x)|'), name: 'y-intercept' }],
        [cf, U.icptChk('y', yi, [{ v: b, code: CP + 'yint-neg', hint: 'The graph of ' + t('y=|f(x)|') + ' is never below the axis.' }])], [tx(f), rt(yi)], t('f(x)=' + tx(f)) + '; ' + t('y') + '-intercept ' + t(rt(yi)),
        'The line passes through ' + t(pt(z.x1, y1)) + ' and ' + t(pt(z.h, 0)) + ': slope ' + t('\\frac{0-' + U.pn(y1) + '}{' + rt(z.h) + '-' + U.pn(z.x1) + '}=' + rt(z.m)) + '.<br>' + t('f(x)=' + U.coefT(z.m) + '(x' + sgT(-z.h) + ')=' + tx(f)) + '. ' + t('y') + '-intercept of ' + t('y=|f(x)|') + ': ' + t(AL(rt(b)) + '=' + rt(yi)) + '.',
        ['The vertex of ' + t('y=|f(x)|') + ' is on the line ' + t('y=f(x)') + ': it is the zero of ' + t('f') + '.', 'Find the slope through the two points, then write ' + t('f(x)=m(x-h)') + '.'], 'linear f from a point and the vertex', [[tx(P.neg(f)), rt(yi)], [tx(f), rt(b)]]);
    } }] }
  ];

  HW.defineLesson({ id: 'u7l2', unit: 7, num: '2', title: 'Graphing Absolute Value Functions of Linear Functions', outcome: 'RF2', calc: true, questions: QUESTIONS, extra: EXTRA });
})(window);
