/* Math 20-1 · Unit 8 · Lesson 2 — Solving Quadratic–Quadratic Systems (outcome RF6 on every part)
 * Assignment 2 (m201book unit8/u8_l02.tex, Questions 1–16) and the Lesson 2 Extra Practice (u8_ep02.tex, A1–A3, B1–B7,
 * C1–C2). Every part is a generator: the booklet question's idea, form and difficulty with new numbers (the lesson's
 * example numbers and the booklet question's own numbers are left out). Calculator allowed; answers stay exact unless the
 * question asks to round. Uses the Unit 8 practice kit HW.u8kit (js/lessons/u8l1.js, which loads first).
 * Conversions: "state the solutions" / "solve" -> ordered pairs in one box ("no solution" / "infinitely many" possible);
 * "solve algebraically to confirm" after reading a graph -> multiple choice (the equation left after eliminating y);
 * "sketch two parabolas that …" -> multiple choice (pick the system with that property); "describe how the graphs meet"
 * -> multiple choice; "state your window" is not checked (the solution gives one); values of k for two / no solutions ->
 * two inequality boxes; "write the equation of a different parabola …" -> the equation typed and checked against the
 * conditions (opens down, passes through both points); unknown constants -> number boxes; numerical response -> a
 * 4-character box.
 * Recognised mistakes: roots with the wrong signs, right x-values with wrong y-values, a missing or extra pair, pairs
 * written (y, x), "no solution" / "infinitely many" confused (a vertical translation vs the same parabola), adding the
 * equations instead of subtracting, decimals for exact answers, rounding; k inequalities the wrong way, including the
 * tangent value; the sign of a constant; the other solution with a sign slip.
 * Levels: LIM BEG EMG PRG ADV MAS. Mastery: Q11, Extra C1, C2.
 */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, KP = K.P, P = HW.poly, ex = HW.ex, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
  var U = HW.u8kit;
  if (!U) throw new Error('js/lessons/u8l2.js needs js/lessons/u8l1.js (HW.u8kit)');
  var LID = 'u8l2', CP = 'u8l2-', OUT = 'RF6';
  U.codes(CP);
  var R = U.R, qa = U.qa, qs = U.qs, qm = U.qm, qd = U.qd, qv = U.qv, qt = U.qt, quad = U.quad, lin = U.lin, tx = U.tx, sub = U.sub, coefT = U.coefT, par = U.par, sg = U.sg;
  var pickWhere = U.pickWhere, nz = U.nz, gcd = U.gcd, ptT = U.ptT, dtex = U.dtex, HQ = U.HQQ;
  function same(z, ref) { return Object.keys(ref).every(function (k) { return z[k] === ref[k]; }); }
  function excl(z, list) { return !list.some(function (ref) { return same(z, ref); }); }
  function prPairs(o) { return o.pts.map(function (p) { return t(ptT(p)); }).join(' and ') || 'no solution'; }
  function yP(P1, x) { return qv(P1[0]) * x * x + qv(P1[1]) * x + qv(P1[2]); }
  function eqT(Pc, dec) { return 'y=' + tx(quad(Pc), dec); }

  /* P1 − P2 = d·(x − r1)(x − r2), r1 = p/q; P2 = [a2, b2, c2]. o: { a1, a2, q, ex, bMax, cMax, b2s (allowed b2 step) } */
  function qqInt(r, o) {
    var a1 = R(o.a1), a2 = R(o.a2), d = qs(a1, a2), q = o.q || 1;
    var z = pickWhere(function () {
      var p = q > 1 ? nz(r, 1, 2 * q + 1) : r.int(o.lo == null ? -6 : o.lo, o.hi == null ? 6 : o.hi), r2 = r.int(o.lo == null ? -5 : o.lo, o.hi == null ? 5 : o.hi);
      return { p: p, r2: r2, b2: r.int(-6, 6) * (o.b2s || 1), c2: r.int(-8, 8) };
    }, function (z) {
      if (q > 1 && gcd(z.p, q) !== 1) return false;
      var r1 = [z.p, q]; if (qv(r1) === z.r2) return false;
      var b1 = qs(z.b2, qm(d, qa(r1, z.r2))), c1 = qa(z.c2, qm(d, qm(r1, z.r2)));
      z.b1 = b1; z.c1 = c1;
      var okInt = o.frac ? (b1[1] <= 4 && c1[1] <= 4) : (b1[1] === 1 && c1[1] === 1);
      return okInt && Math.abs(qv(b1)) <= (o.bMax || 10) && Math.abs(qv(c1)) <= (o.cMax || 18) && (!o.test || o.test(z)) && excl(z, o.ex || []);
    });
    z.P1 = [a1, z.b1, z.c1]; z.P2 = [a2, z.b2, z.c2];
    return z;
  }
  function qqPart(o, prompt, sol, text, extraWr, dec) {
    return U.pairs(CP, prompt, o.pts, { wrongs: U.signWrongs(CP, o).concat(extraWr || []), inf: o.kind === 'inf' }, sol || U.qqSol(o, { dec: dec }), HQ, text);
  }
  function elimWrong(o) {
    // adding the equations instead of subtracting (only when that gives a different quadratic with rational roots)
    var Ad = U.roots([qa(o.P1[0], o.P2[0]), qa(o.P1[1], o.P2[1]), qa(o.P1[2], o.P2[2])]);
    if (Ad.kind !== 'two' || U.irr(Ad.xs[0])) return [];
    return [{ pts: Ad.xs.map(function (x) { return [qv(x.r), yP(o.P2, qv(x.r))]; }), code: CP + 'elim', hint: 'Subtract the equations (set the right sides equal); adding them does not eliminate ' + t('y') + '.' }];
  }

  /* ---------- Q1 shared: two parabolas with integer intersections, drawn ---------- */
  function q1Shared(r) {
    var s = pickWhere(function () { return { a: r.pick([1, 1, -1]), h: r.int(-1, 1), q: r.int(-5, 3), x1: r.int(-3, 1), x2: r.int(0, 3) }; }, function (z) {
      if (z.x2 - z.x1 < 2) return false;
      var f = function (x) { return z.a * (x - z.h) * (x - z.h) + z.q; }, y1 = f(z.x1), y2 = f(z.x2), g = function (x) { return f(x) - 2 * z.a * (x - z.x1) * (x - z.x2); };
      var top = g((z.x1 + z.x2) / 2);
      return Math.abs(y1) <= 7 && Math.abs(y2) <= 7 && Math.abs(top) <= 11 && Math.abs(z.q) <= 8 && !(z.a === 1 && z.h === 0 && z.q === -4 && z.x1 === -2 && z.x2 === 3) && !(z.a === 1 && z.h === 0 && z.q === -1 && z.x1 === -1 && z.x2 === 2);
    });
    var P1 = [s.a, -2 * s.a * s.h, s.a * s.h * s.h + s.q], P2 = [P1[0] - 2 * s.a, P1[1] + 2 * s.a * (s.x1 + s.x2), P1[2] - 2 * s.a * s.x1 * s.x2];
    var o = U.qq(P1, P2), f1 = function (x) { return yP(P1, x); }, f2 = function (x) { return yP(P2, x); };
    var yr = U.yRange([f1(s.x1), f1(s.x2), s.q, f2((s.x1 + s.x2) / 2)]);
    s.o = o; s.fig = U.fig({ x: [-5, 5], y: yr, unit: 18, curves: [{ f: f1 }, { f: f2, color: '#c4532a' }], aria: 'two parabolas' });
    return s;
  }

  /* ---------- Q2: systems with a given shape ---------- */
  function sysOf(r, kind) {
    var c = r.int(-3, 3), e = nz(r, 2, 5), h = nz(r, 1, 3), dd = r.int(1, 4), b = nz(r, 1, 4), b2 = b + nz(r, 1, 3);
    var Y = function (Pc) { return 'y=' + tx(quad(Pc)); };
    switch (kind) {
      case 'uu0': return { tex: [Y([1, b, c]), Y([1, b, c + e])], n: 0, up: [1, 1], d: 'both open up and one is the other translated ' + Math.abs(e) + ' units ' + (e > 0 ? 'up' : 'down') + ': no point in common' };
      case 'uu2': return { tex: [Y([1, 0, c + dd * dd]), Y([2, 0, c])], n: 2, up: [1, 1], d: 'both open up, but subtracting gives ' + t('x^{2}=' + dd * dd) + ': two points in common' };
      case 'uu1': return { tex: [Y([1, b, c]), Y([1, b2, c + 2])], n: 1, up: [1, 1], d: 'both open up and the ' + t('x^{2}') + '-terms cancel to a linear equation: one point in common' };
      case 'ud1': return { tex: [Y([1, -2 * h, h * h + c]), Y([-1, 2 * h, -h * h + c])], n: 1, up: [1, -1], d: 'one opens up and one down, and they touch at their shared vertex ' + t('(' + h + ',\\ ' + c + ')') + ': one point' };
      case 'ud2': return { tex: [Y([1, 0, c - dd * dd]), Y([-1, 0, c + dd * dd])], n: 2, up: [1, -1], d: 'one opens up and one down, crossing where ' + t('x^{2}=' + dd * dd) + ': two points' };
      case 'ud0': return { tex: [Y([1, 0, c + dd]), Y([-1, 0, c - dd])], n: 0, up: [1, -1], d: 'one opens up and one down, but the first is entirely above the second: no point in common' };
      case 'dd2': return { tex: [Y([-1, 0, c + dd * dd]), Y([-2, 0, c + 2 * dd * dd])], n: 2, up: [-1, -1], d: 'both open down, crossing where ' + t('x^{2}=' + dd * dd) + ': two points' };
      case 'dd0': return { tex: [Y([-1, b, c]), Y([-1, b, c - e])], n: 0, up: [-1, -1], d: 'both open down, but one is a vertical translation of the other: no point in common' };
      case 'dd1': return { tex: [Y([-1, b, c]), Y([-1, b2, c - 2])], n: 1, up: [-1, -1], d: 'both open down and the ' + t('x^{2}') + '-terms cancel: one point in common' };
      case 'inf': return { tex: ['y=(x' + sg(-h) + ')^{2}' + (c ? sg(c) : ''), Y([1, -2 * h, h * h + c])], n: 'inf', up: [1, 1], d: 'expanding ' + t('(x' + sg(-h) + ')^{2}' + (c ? sg(c) : '')) + ' gives the other equation: the same parabola, infinitely many solutions' };
      case 'infBad': return { tex: ['y=(x' + sg(h) + ')^{2}' + (c ? sg(c) : ''), Y([1, -2 * h, h * h + c])], n: 1, up: [1, 1], d: t('(x' + sg(h) + ')^{2}=' + tx(quad([1, 2 * h, h * h]))) + ', not ' + t(tx(quad([1, -2 * h, h * h]))) + ': different parabolas meeting at one point' };
    }
  }
  function q2Part(want, others, ask) {
    return function (r) {
      var right = sysOf(r, want), opts = [{ html: t(right.tex[0]) + ' and ' + t(right.tex[1]), right: true }];
      others.forEach(function (k) { var w = sysOf(r, k); opts.push({ html: t(w.tex[0]) + ' and ' + t(w.tex[1]), why: 'In this system the parabolas ' + w.d + '.', code: k }); });
      return KP.mc(r, 'Which system is an example of ' + ask + '?', opts, 'The parabolas ' + right.d + '. (Check by eliminating ' + t('y') + '.)',
        ['The sign of the ' + t('x^{2}') + '-coefficient tells whether a parabola opens up or down.', 'Subtract the equations: count the solutions of what is left.'], 'example of a system');
    };
  }

  var QUESTIONS = [
    { num: '1', shared: q1Shared, stem: function (s) { return 'The graphs of ' + t(eqT(s.o.P1)) + ' and ' + t(eqT(s.o.P2)) + ' are shown.' + s.fig; },
      parts: [
        { id: '1a', level: 'BEG', make: function (r, s) {
          var o = s.o;
          return U.pairs(CP, 'State the solutions of the system.', o.pts, { wrongs: [{ pts: o.pts.map(function (p) { return [p.x, 0]; }), code: CP + 'sys-y', hint: 'The solutions are the points where the parabolas <b>meet</b>, with both coordinates.' }] },
            'The parabolas cross at ' + prPairs(o) + '.', ['The solutions are the points where the two graphs intersect.', 'Read both coordinates of each crossing point.'], 'solutions from a graph');
        } },
        { id: '1b', level: 'BEG', make: function (r, s) {
          var o = s.o, ET = tx(quad([o.a, o.b, o.c])), add = U.roots([qa(o.P1[0], o.P2[0]), qa(o.P1[1], o.P2[1]), qa(o.P1[2], o.P2[2])]);
          var addT = tx(quad([add.a, add.b, add.c])), sb = tx(quad([o.a, -o.b, o.c])), sc = tx(quad([o.a, o.b, -o.c]));
          var opts = [{ html: t(ET + '=0') + ', so ' + t('x=' + o.pts[0].xt) + ' or ' + t('x=' + o.pts[1].xt), right: true }];
          [[addT, 'Adding the equations does not eliminate ' + t('y') + ' here: subtract them (set the right sides equal).'], [sb, 'Check the signs when you subtract: every term of the second equation changes sign.'], [sc, 'Check the constant term: subtract it too.']].forEach(function (w) {
            if (w[0] !== ET && opts.every(function (q) { return q.html.indexOf(t(w[0] + '=0')) !== 0; })) opts.push({ html: t(w[0] + '=0'), why: w[1] });
          });
          while (opts.length < 4) opts.push({ html: t(tx(quad([o.a, o.b + opts.length, o.c])) + '=0'), why: 'Subtract the equations term by term.' });
          return KP.mc(r, 'Solve the system algebraically to confirm. Eliminating ' + t('y') + ' and simplifying gives', opts, U.qqSol(o), HQ, 'confirm algebraically');
        } }] },
    { num: '2', section: 'Examples of systems', parts: [
      { id: '2a', level: 'EMG', make: q2Part('uu0', ['uu2', 'ud0', 'uu1'], 'two parabolas that both open up and have <b>no</b> point in common') },
      { id: '2b', level: 'EMG', make: q2Part('ud1', ['ud2', 'uu1', 'ud0'], 'two parabolas, one opening up and one opening down, with exactly <b>one</b> point in common') },
      { id: '2c', level: 'PRG', make: q2Part('dd2', ['dd0', 'ud2', 'dd1'], 'two parabolas that both open down and have <b>two</b> points in common') },
      { id: '2d', level: 'EMG', make: q2Part('inf', ['uu0', 'infBad', 'uu1'], 'a quadratic–quadratic system with <b>infinitely many</b> solutions') }] },
    { num: '3', section: 'Solving algebraically', parts: [
      { id: '3a', level: 'BEG', make: function (r) {
        var z = qqInt(r, { a1: 1, a2: 2, ex: [{ b2: -2, c2: -1 }] }), o = U.qq(z.P1, z.P2);
        return qqPart(o, 'Solve the system algebraically: ' + t(eqT(z.P1)) + ' and ' + t(eqT(z.P2)) + '.', null, 'solve: both open up', elimWrong(o));
      } },
      { id: '3b', level: 'BEG', make: function (r) {
        var z = qqInt(r, { a1: -1, a2: 1, ex: [{ b2: -1, c2: -7 }, { b2: -3, c2: 2 }] }), o = U.qq(z.P1, z.P2);
        return qqPart(o, 'Solve the system algebraically: ' + t(eqT(z.P1)) + ' and ' + t(eqT(z.P2)) + '.', null, 'solve: one up, one down', elimWrong(o));
      } },
      { id: '3c', level: 'PRG', make: function (r) {
        var z = qqInt(r, { a1: 3, a2: 1, q: 2, ex: [{ p: -1, r2: 2, b2: 4, c2: 0 }] }), o = U.qq(z.P1, z.P2);
        return qqPart(o, 'Solve the system algebraically: ' + t(eqT(z.P1)) + ' and ' + t(eqT(z.P2)) + '.', null, 'solve: a fractional root');
      } },
      { id: '3d', level: 'EMG', make: function (r) {
        var z = pickWhere(function () { return { h: nz(r, 1, 4), x0: nz(r, 1, 4) }; }, function (z) { var c = z.h * z.h - 2 * z.h * z.x0; return c !== 0 && Math.abs(c) <= 16 && !(z.h === 3 && z.x0 === 1); });
        var c = z.h * z.h - 2 * z.h * z.x0, P1 = [1, -2 * z.h, z.h * z.h], P2 = [1, 0, c], o = U.qq(P1, P2), vt = 'y=(x' + sg(-z.h) + ')^{2}';
        var sol = 'Expand: ' + t(vt + '=' + tx(quad(P1))) + '.<br>' + U.qqSol(o);
        return qqPart(o, 'Solve the system algebraically: ' + t(vt) + ' and ' + t(eqT(P2)) + '.', sol, 'solve: x²-terms cancel');
      } }] },
    { num: '4', parts: [{ id: '4', level: 'EMG', make: function (r) {
      var z = qqInt(r, { a1: 1, a2: -1, ex: [{ b2: 4, c2: 5 }] }), o = U.qq(z.P1, z.P2);
      var s1 = 'y-x^{2}=' + tx(lin([z.P1[1], z.P1[2]])), s2 = 'y+x^{2}=' + tx(lin([z.P2[1], z.P2[2]]));
      return qqPart(o, 'Solve the system ' + t(s1) + ' and ' + t(s2) + '.', U.qqSol(o, { pre: 'Write each with ' + t('y') + ' alone: ' + t(eqT(z.P1)) + ' and ' + t(eqT(z.P2)) + '.<br>' }) + ' (Adding the original equations eliminates ' + t('x^{2}') + ' instead: a shortcut.)', 'solve: rearrange first');
    } }] },
    { num: '5', section: 'Graphing calculator and exact answers', shared: function (r) {
      var z = pickWhere(function () { return { A: r.pick([2, 2, 3]), B: r.int(-6, 6), C: r.int(-7, 3), a2: r.pick([-1, 1, -1]), b2: r.int(-4, 4), c2: r.int(-4, 5) }; }, function (z) {
        var D = z.B * z.B - 4 * z.A * z.C; if (D <= 0 || Math.abs(Math.sqrt(D) % 1) < 1e-9) return false;
        if (z.A + z.a2 === 0) return false;
        if (z.A === 2 && z.B === -4 && z.C === -5) return false; if (z.A === 3 && z.B === -6 && z.C === -4) return false;
        var P1 = [z.A + z.a2, z.B + z.b2, z.C + z.c2]; if (Math.abs(P1[1]) > 8 || Math.abs(P1[2]) > 9) return false;
        var o = U.qq(P1, [z.a2, z.b2, z.c2]);
        return o.pts.every(function (p) { return Math.abs(p.y) <= 30 && [p.x, p.y].every(function (v) { var f = Math.abs(v * 10) % 1; return Math.abs(f - 0.5) > 0.06; }); });
      });
      z.o = U.qq([z.A + z.a2, z.B + z.b2, z.C + z.c2], [z.a2, z.b2, z.c2]); return z;
    }, stem: function (z) { return 'Consider the system ' + t(eqT(z.o.P1)) + ' and ' + t(eqT(z.o.P2)) + '.'; },
    parts: [
      { id: '5a', level: 'EMG', make: function (r, z) {
        var o = z.o, ys = o.pts.map(function (p) { return p.y; });
        return U.pairsRounded(CP, 'Use a graphing calculator to solve the system, to the nearest tenth.', o.pts, 1, {},
          t('Y_1=' + tx(o.P1p).replace(/x/g, 'X')) + ', ' + t('Y_2=' + tx(o.P2p).replace(/x/g, 'X')) + '. Window: e.g. ' + t('x') + ' from ' + t(Math.floor(o.pts[0].x) - 2) + ' to ' + t(Math.ceil(o.pts[1].x) + 2) + ', ' + t('y') + ' from ' + t(Math.floor(Math.min.apply(null, ys)) - 3) + ' to ' + t(Math.ceil(Math.max.apply(null, ys)) + 3) + '.<br>2nd [CALC] 5:intersect, once near each point: ' + o.pts.map(function (p) { return t('(' + p.x.toFixed(1) + ',\\ ' + p.y.toFixed(1) + ')'); }).join(' and ') + '.',
          ['Enter one parabola as ' + t('Y_1') + ' and the other as ' + t('Y_2') + '; find a window that shows both crossing points.', '2nd [TRACE] (CALC), 5:intersect, once near each point. Round at the end.'], 'calculator: intersect');
      } },
      { id: '5b', level: 'ADV', make: function (r, z) {
        var o = z.o;
        return qqPart(o, 'Solve the system algebraically to get the exact solutions.', U.qqSol(o) + '<br>(For each ' + t('y') + ': substitute the exact ' + t('x') + ' and simplify, or use the equation ' + t(tx(o.E) + '=0') + ' to replace ' + t('x^{2}') + '.)', 'exact solutions');
      } }] },
    { num: '6', section: 'When the x²-terms cancel', parts: [
      { id: '6a', level: 'BEG', make: function (r) {
        var z = pickWhere(function () { return { a: r.pick([1, -2, 2, -1, 3]), b2: r.int(-6, 6), c2: r.int(-8, 8), dd: nz(r, 1, 8), x0: r.int(-4, 4) }; }, function (z) { var c1 = z.c2 - z.dd * z.x0; return Math.abs(z.b2 + z.dd) <= 10 && Math.abs(c1) <= 16 && z.x0 !== 0 && !(z.a === 1 && z.b2 === 3 && z.c2 === -6); });
        var P2 = [z.a, z.b2, z.c2], P1 = [z.a, z.b2 + z.dd, z.c2 - z.dd * z.x0], o = U.qq(P1, P2);
        return qqPart(o, 'Solve the system, or explain why it has no solution or infinitely many: ' + t(eqT(P1)) + ' and ' + t(eqT(P2)) + '.', null, 'x²-terms cancel: one solution');
      } },
      { id: '6b', level: 'BEG', make: function (r) {
        var z = pickWhere(function () { return { a: r.pick([1, -2, 2, -1, 3]), b: r.int(-6, 6), c: r.int(-8, 8), e: nz(r, 1, 7) }; }, function (z) { return Math.abs(z.c + z.e) <= 12 && !(z.a === -2 && z.b === 1 && z.c === -1 && z.e === 4); });
        var P1 = [z.a, z.b, z.c + z.e], P2 = [z.a, z.b, z.c], o = U.qq(P1, P2);
        return U.pairs(CP, 'Solve the system, or explain why it has no solution or infinitely many: ' + t(eqT(P1)) + ' and ' + t(eqT(P2)) + '.', [], { noneHint: 'Subtract the equations: what is left? Is it ever true?' },
          'Subtract: everything but the constants cancels, leaving ' + t('0=' + z.e) + ', a false statement. <b>No solution</b>: the first parabola is the second translated ' + Math.abs(z.e) + ' units ' + (z.e > 0 ? 'up' : 'down') + '.', HQ, 'x²-terms cancel: no solution');
      } },
      { id: '6c', level: 'EMG', make: function (r) {
        var z = pickWhere(function () { return { a: r.pick([1, 2, -1, -2, 3]), h: nz(r, 1, 4), q: r.int(-6, 6) }; }, function (z) { return !(z.a === 1 && z.h === -2 && z.q === -1) && !(z.a === 2 && z.h === 1 && z.q === 3); });
        var P1 = [z.a, -2 * z.a * z.h, z.a * z.h * z.h + z.q], vt = 'y=' + coefT(z.a) + '(x' + sg(-z.h) + ')^{2}' + (z.q ? sg(z.q) : '');
        var sol = 'Expand: ' + t(coefT(z.a) + '(x' + sg(-z.h) + ')^{2}' + (z.q ? sg(z.q) : '') + '=' + tx(quad(P1))) + '. The equations are identical (subtracting gives ' + t('0=0') + '): <b>infinitely many</b> solutions.';
        return U.pairs(CP, 'Solve the system, or explain why it has no solution or infinitely many: ' + t(vt) + ' and ' + t(eqT(P1)) + '.', [], { inf: true }, sol, ['Expand the vertex form and compare it with the other equation.'], 'the same parabola');
      } }] },
    { num: '7', section: 'The number of solutions', parts: [
      { id: '7a', level: 'BEG', make: function (r) {
        var z = pickWhere(function () { return { d: r.pick([1, 2, -1, 2]), h: nz(r, 1, 3), a2: r.pick([1, -1, 2]), b2: r.int(-4, 4), c2: r.int(-4, 4) }; }, function (z) { return z.a2 + z.d !== 0 && Math.abs(z.b2 - 2 * z.d * z.h) <= 9 && !(z.d === 1 && z.h === -1 && z.a2 === 1 && z.b2 === 1); });
        var P2 = [z.a2, z.b2, z.c2], P1 = [z.a2 + z.d, z.b2 - 2 * z.d * z.h, z.c2 + z.d * z.h * z.h], o = U.qq(P1, P2);
        return U.countMC(r, 'Without solving, determine the number of solutions of ' + t(eqT(P1)) + ' and ' + t(eqT(P2)) + '.', 1, 'Subtract: ' + t(tx(o.E) + '=0') + '. Discriminant: ' + t(dtex(o.A, o.B, o.C) + '=0') + '.', { qq: true });
      } },
      { id: '7b', level: 'BEG', make: function (r) {
        var z = pickWhere(function () { return { a1: r.pick([1, 2, -1]), a2: r.pick([-1, 1, -2]), b1: r.int(-4, 4), c1: r.int(-4, 5), b2: r.int(-4, 4), c2: r.int(-4, 5) }; }, function (z) { var A = z.a1 - z.a2, B = z.b1 - z.b2, C = z.c1 - z.c2; return A !== 0 && B * B - 4 * A * C < 0 && !(z.a1 === 1 && z.c1 === 1 && z.a2 === -1 && z.b2 === 2 && z.c2 === -2); });
        var P1 = [z.a1, z.b1, z.c1], P2 = [z.a2, z.b2, z.c2], o = U.qq(P1, P2);
        return U.countMC(r, 'Without solving, determine the number of solutions of ' + t(eqT(P1)) + ' and ' + t(eqT(P2)) + '.', 0, 'Subtract: ' + t(tx(o.E) + '=0') + '. Discriminant: ' + t(dtex(o.A, o.B, o.C) + '=' + (qv(o.B) * qv(o.B) - 4 * qv(o.A) * qv(o.C))) + '.', { qq: true });
      } },
      { id: '7c', level: 'EMG', make: function (r) {
        var z = pickWhere(function () { return { a1: r.pick([3, 2, 4]), a2: r.pick([1, -1]), b1: r.int(-4, 4), c1: r.int(-6, 4), b2: r.int(-5, 5), c2: r.int(-4, 4) }; }, function (z) { var A = z.a1 - z.a2, B = z.b1 - z.b2, C = z.c1 - z.c2, D = B * B - 4 * A * C; return D > 0 && Math.abs(Math.sqrt(D) % 1) > 1e-9 && !(z.a1 === 3 && z.c1 === -2 && z.b2 === 5); });
        var P1 = [z.a1, z.b1, z.c1], P2 = [z.a2, z.b2, z.c2], o = U.qq(P1, P2);
        return U.countMC(r, 'Without solving, determine the number of solutions of ' + t(eqT(P1)) + ' and ' + t(eqT(P2)) + '.', 2, 'Subtract: ' + t(tx(o.E) + '=0') + '. Discriminant: ' + t(dtex(o.A, o.B, o.C) + '=' + (qv(o.B) * qv(o.B) - 4 * qv(o.A) * qv(o.C))) + '.', { qq: true });
      } },
      { id: '7d', level: 'EMG', make: function (r) {
        var z = pickWhere(function () { return { a: r.pick([4, 3, -2, 5]), b1: r.int(-5, 5), b2: r.int(-5, 5), c1: r.int(-4, 4), c2: r.int(-4, 4) }; }, function (z) { return z.b1 !== z.b2 && !(z.a === 4 && z.b1 === 1 && z.b2 === -3); });
        var P1 = [z.a, z.b1, z.c1], P2 = [z.a, z.b2, z.c2], o = U.qq(P1, P2);
        return U.countMC(r, 'Without solving, determine the number of solutions of ' + t(eqT(P1)) + ' and ' + t(eqT(P2)) + '.', 1, 'Subtract: the ' + t('x^{2}') + '-terms cancel, leaving ' + t(tx(o.E) + '=0') + ', a linear equation.', { qq: true, lin: true });
      } }] },
    { num: '8', section: 'Unknown constants', shared: function (r) {
      var z = pickWhere(function () { return { d: r.pick([1, 1, 2, -1]), a2: r.pick([1, -1, 2]), x0: nz(r, 1, 4) }; }, function (z) { return z.a2 + z.d !== 0 && !(z.d === 1 && z.a2 === 1 && z.x0 === -3) && !(z.d === 2 && z.a2 === -1 && z.x0 === 1); });
      z.b = 2 * z.d * z.x0; z.k0 = z.d * z.x0 * z.x0; z.a1 = z.a2 + z.d; // P1 = a1 x² + k, P2 = a2 x² + b x: P1 − P2 = d x² − b x + k
      z.o = U.qq([z.a1, 0, z.k0], [z.a2, z.b, 0]); return z;
    }, stem: function (z) { return 'Consider the system ' + t('y=' + tx(quad([z.a1, 0, 0])) + '+k') + ' and ' + t(eqT([z.a2, z.b, 0])) + '.'; },
    parts: [
      { id: '8a', level: 'PRG', make: function (r, z) {
        var p = z.o.pts[0], Et = tx(quad([z.d, -z.b, 0])) + '+k';
        var sol = 'Subtract: ' + t(Et + '=0') + '.<br>One solution: discriminant ' + t('0') + ': ' + t(par(-z.b) + '^{2}-4(' + z.d + ')k=0') + ', so ' + t('k=' + z.k0) + '.<br>' + t(tx(z.o.E) + '=0') + ': ' + t('x=' + p.xt) + ', ' + t('y=' + p.yt) + '. The solution is ' + t(ptT(p)) + '.';
        return U.kPoint(CP, 'Determine the value of ' + t('k') + ' for which the system has exactly one solution, and find that solution.', 'k', z.k0, p, sol,
          ['Subtract the equations. One solution means the discriminant of what is left is ' + t('0') + '.', 'Solve for ' + t('k') + ', then solve the system with that ' + t('k') + '.'], 'one solution: find k');
      } },
      { id: '8b', level: 'ADV', make: function (r, z) {
        var D0 = z.b * z.b, sol = 'Subtract: ' + t(tx(quad([z.d, -z.b, 0])) + '+k=0') + '. Discriminant: ' + t(par(-z.b) + '^{2}-4(' + z.d + ')k=' + D0 + (z.d > 0 ? '-' : '+') + Math.abs(4 * z.d) + 'k') + '.<br>Two solutions: ' + t(D0 + (z.d > 0 ? '-' : '+') + Math.abs(4 * z.d) + 'k>0') + ', so ' + t(z.d > 0 ? 'k<' + z.k0 : 'k>' + z.k0) + '. No solution: ' + t(z.d > 0 ? 'k>' + z.k0 : 'k<' + z.k0) + '.' + (z.d > 0 ? ' (Dividing by ' + t(-4 * z.d) + ' reverses the sign.)' : '');
        return U.kRanges(CP, 'For which values of ' + t('k') + ' does the system have two solutions? no solution? Write an inequality for each.', 'k', z.k0, z.d < 0, sol,
          ['Write the discriminant of the equation after eliminating ' + t('y') + '; it contains ' + t('k') + '.', 'Two solutions: discriminant ' + t('>0') + '. None: ' + t('<0') + '. Solve each for ' + t('k') + '.'], 'values of k: two / none');
      } }] },
    { num: '9', section: 'Fractional and decimal coefficients', parts: [
      { id: '9a', level: 'PRG', make: function (r) {
        var fa = r.pick([[[1, 3], [-2, 3]], [[2, 3], [-1, 3]], [[1, 4], [-3, 4]], [[3, 4], [-1, 4]], [[1, 2], [-1, 2]]]);
        var z = qqInt(r, { a1: fa[0], a2: fa[1], ex: [{ b2: 2, c2: 4 }] }), o = U.qq(z.P1, z.P2);
        return qqPart(o, 'Solve the system: ' + t(eqT(z.P1)) + ' and ' + t(eqT(z.P2)) + '.', U.qqSol(o) + '<br>(The ' + t('x^{2}') + '-terms give ' + t(qt(fa[0]) + '-(' + qt(fa[1]) + ')=1') + '.)', 'solve: fractional coefficients');
      } },
      { id: '9b', level: 'PRG', make: function (r) {
        var fa = r.pick([[[1, 2], [-1, 4]], [[3, 4], [-1, 4]], [[1, 4], [-1, 2]], [[1, 2], [-1, 2]]]);
        var z = qqInt(r, { a1: fa[0], a2: fa[1], frac: true, b2s: 0.5, ex: [{ b2: 1.5, c2: 4 }], test: function (z) { return [z.b1, z.c1].every(function (c) { return c[1] === 1 || c[1] === 2 || c[1] === 4; }); } }), o = U.qq(z.P1, z.P2);
        o.pts = U.decPts(o.pts);
        return qqPart(o, 'Solve the system: ' + t(eqT(z.P1, true)) + ' and ' + t(eqT(z.P2, true)) + '.', null, 'solve: decimal coefficients', null, true);
      } }] },
    { num: '10', parts: [{ id: '10', level: 'PRG', make: function (r) {
      var z = pickWhere(function () { return { r1: r.int(1, 4), r2: r.int(2, 8), b1: r.int(3, 6), ctx: r.pick(['logo', 'bridge', 'jets']) }; }, function (z) {
        return z.r1 < z.r2 && (z.r1 + z.r2) % 2 === 0 && (z.r1 * z.r2) % 2 === 0 && [z.r1, z.r2].every(function (x) { return -0.5 * x * x + z.b1 * x > 0; }) && !(z.r1 === 2 && z.r2 === 4 && z.b1 === 4);
      });
      var P1 = [[-1, 2], z.b1, 0], P2 = [-1, z.b1 + (z.r1 + z.r2) / 2, -z.r1 * z.r2 / 2], o = U.qq(P1, P2);
      var what = { logo: ['A designer draws a logo with two arcs:', 'centimetres', 'arcs cross'], bridge: ['Two arches of a footbridge sculpture follow', 'metres', 'arches cross'], jets: ['Two water jets in a fountain follow the paths', 'metres', 'jets cross'] }[z.ctx];
      return qqPart(o, what[0] + ' ' + t(eqT(P1, true)) + ' and ' + t(eqT(P2)) + ', in ' + what[1] + '. Determine the points where the ' + what[2] + '.', null, 'context: two arcs', null, true);
    } }] },
    { num: '11', parts: [{ id: '11', level: 'MAS', make: function (r) {
      var z = pickWhere(function () { return { x0: r.pick([1, -1, 2, -2]), b2: r.int(-4, 6), c2: r.int(-4, 6), c1: r.int(-3, 8) }; }, function (z) {
        var y0 = -z.x0 * z.x0 + z.b2 * z.x0 + z.c2, b = (y0 - z.x0 * z.x0 - z.c1) / z.x0; if (b % 1 !== 0 || b === 0 || Math.abs(b) > 9) return false;
        var x1 = (z.c1 - z.c2) / (2 * z.x0); return x1 !== z.x0 && Math.abs(x1) <= 6 && (x1 * 2) % 1 === 0 && !(z.x0 === 1 && z.b2 === 3 && z.c2 === 1 && z.c1 === 5);
      });
      var y0 = -z.x0 * z.x0 + z.b2 * z.x0 + z.c2, b = (y0 - z.x0 * z.x0 - z.c1) / z.x0, P1 = [1, b, z.c1], P2 = [-1, z.b2, z.c2], o = U.qq(P1, P2);
      var other = o.pts.filter(function (p) { return Math.abs(p.x - z.x0) > 1e-9; })[0];
      var sol = 'From the second equation, ' + t('x=' + z.x0) + ' gives ' + t('y=' + sub(tx(quad(P2)), z.x0) + '=' + y0) + ', so ' + t('(' + z.x0 + ',\\ ' + y0 + ')') + ' is on the first parabola: ' + t(sub('x^{2}+bx' + sg(z.c1), z.x0) + '=' + y0) + ', so ' + t('b=' + b) + '.<br>' + U.qqSol(o, { check: false }) + '<br>The other solution is ' + t(ptT(other)) + '.';
      var bChk = K.number(b, function (v) { return v === -b ? { code: CP + 'k-sign', hint: 'Check the sign when you solve for ' + t('b') + '.' } : null; }), pChk = U.assess().pairsPart(CP, '', [{ x: other.x, y: other.y, xt: other.xt, yt: other.yt }], { wrongs: [{ pts: [[z.x0, y0]], code: CP + 'sys-missing', hint: 'That is the given solution. Find the <b>other</b> one.' }] }, '', [], '').check;
      var part = KP.fields('The system ' + t('y=x^{2}+bx' + sg(z.c1)) + ' and ' + t(eqT(P2)) + ' has a solution with ' + t('x=' + z.x0) + '. Determine ' + t('b') + ' and the other solution.',
        [{ label: t('b='), name: 'b' }, { label: 'Other solution:', mode: 'math', keys: 'u8pairs', name: 'Other solution', placeholder: 'e.g. (2, 3)' }], [bChk, pChk], [String(b), ptT(other)], t('b=' + b) + '; the other solution is ' + t(ptT(other)), sol,
        ['Find ' + t('y') + ' at ' + t('x=' + z.x0) + ' from the equation you know completely; that point is on both parabolas.', 'Substitute it into the first equation to find ' + t('b') + ', then solve the system.'], 'unknown coefficient and the other solution');
      part.bad = [[String(b), ptT({ xt: String(z.x0), yt: String(y0) })], [String(-b || 99), ptT(other)]];
      return part;
    } }] },
    { num: '12', section: 'Choices', parts: [{ id: '12', level: 'EMG', make: function (r) {
      var z = pickWhere(function () { return { d: r.pick([2, 1, 3]), h: nz(r, 1, 3), a2: r.pick([1, -1, 2]), b2: r.int(-4, 4), c2: r.int(-4, 4) }; }, function (z) { return z.a2 + z.d !== 0 && Math.abs(z.b2 - 2 * z.d * z.h) <= 9 && Math.abs(z.c2 + z.d * z.h * z.h) <= 20 && !(z.d === 2 && z.h === 2 && z.a2 === 1 && z.b2 === 2); });
      var P2 = [z.a2, z.b2, z.c2], P1 = [z.a2 + z.d, z.b2 - 2 * z.d * z.h, z.c2 + z.d * z.h * z.h], o = U.qq(P1, P2);
      return U.countMC(r, 'The number of solutions of the system ' + t(eqT(P1)) + ' and ' + t(eqT(P2)) + ' is', 1, 'Subtract: ' + t(tx(o.E) + '=0') + ', so ' + t(tx(quad([o.a, o.b, o.c])) + '=0') + ' with discriminant ' + t('0') + ': one solution, ' + prPairs(o) + '.', { qq: true });
    } }] },
    { num: '13', parts: [{ id: '13', level: 'EMG', make: function (r) {
      var h = nz(r, 1, 4), a = r.pick([1, 1, 2, -1]), q = r.int(-3, 3), V = function (s, hh) { return 'y=' + coefT(s) + '(x' + sg(-hh) + ')^{2}' + (q ? sg(q) : ''); }, Sx = function (Pc) { return eqT(Pc); };
      var right = [V(a, h), Sx([a, -2 * a * h, a * h * h + q])];
      if (a === 1 && h === 3 && q === 0) right = [V(a, h), Sx([1, -6, 9])];
      var w1 = [Sx([a, -2 * a * h, a * h * h + q]), V(a, -h)], w2 = [Sx([a, 0, a * h * h + q]), V(a, h)], w3 = [V(-a, h), Sx([a, -2 * a * h, a * h * h + q])];
      return KP.mc(r, 'Which system has infinitely many solutions?', [
        { html: t(right[0]) + ' and ' + t(right[1]), right: true },
        { html: t(w1[0]) + ' and ' + t(w1[1]), why: t('(x' + sg(h) + ')^{2}') + ' expands to ' + t(tx(quad([1, 2 * h, h * h]))) + ': a different parabola (they meet once).' },
        { html: t(w2[0]) + ' and ' + t(w2[1]), why: t('(x' + sg(-h) + ')^{2}') + ' has a middle term ' + t(-2 * h + 'x') + ': these meet at one point, where ' + t('x=0') + '.' },
        { html: t(w3[0]) + ' and ' + t(w3[1]), why: 'One of these opens up and the other down: they are different parabolas.' }],
        'Expanding: ' + t(coefT(a) + '(x' + sg(-h) + ')^{2}' + (q ? sg(q) : '') + '=' + tx(quad([a, -2 * a * h, a * h * h + q]))) + ', so both equations describe the same parabola.', ['Expand each vertex form and compare.'], 'MC: infinitely many');
    } }] },
    { num: '14', parts: [{ id: '14', level: 'PRG', make: function (r) {
      var z = qqInt(r, { a1: 2, a2: 1, lo: -4, hi: 6, ex: [{ p: 5, r2: -1, b2: 1, c2: 5 }, { p: -1, r2: 5, b2: 1, c2: 5 }], test: function (z) { return z.p !== 0 && z.r2 !== 0 && Math.abs(z.p) !== Math.abs(z.r2); } });
      var o = U.qq(z.P1, z.P2), i = r.int(0, 1), gp = o.pts[i], op = o.pts[1 - i];
      var opts = [{ html: t(ptT(op)), right: true }, { html: t('(' + (-op.x) + ',\\ ' + yP(z.P2, -op.x) + ')'), why: 'Check the signs: the factor ' + t('(x' + sg(-op.x) + ')') + ' gives ' + t('x=' + op.x) + '.' },
        { html: t('(' + op.xt + ',\\ ' + (-op.y) + ')'), why: 'Right ' + t('x') + '. Substitute it carefully to find ' + t('y') + '.' }, { html: t('(' + (-gp.x) + ',\\ ' + yP(z.P2, -gp.x) + ')'), why: 'The other root comes from factoring the equation after eliminating ' + t('y') + ', not from changing the sign of the given ' + t('x') + '.' }];
      var seen = {}; opts = opts.filter(function (q) { if (seen[q.html]) return false; seen[q.html] = 1; return true; });
      while (opts.length < 4) opts.push({ html: t('(' + op.xt + ',\\ ' + (op.y + opts.length) + ')'), why: 'Substitute the other root into either equation.' });
      return KP.mc(r, 'One solution of the system ' + t(eqT(z.P1)) + ' and ' + t(eqT(z.P2)) + ' is ' + t(ptT(gp)) + '. The other solution is', opts, U.qqSol(o, { check: false }), HQ, 'MC: the other solution');
    } }] },
    { num: '15', parts: [{ id: '15', level: 'PRG', make: function (r) {
      var z = qqInt(r, { a1: 1, a2: -1, ex: [{ b2: 6, c2: 1 }], test: function (z) { var s = yP([1, qv(z.b1), qv(z.c1)], z.p) + yP([1, qv(z.b1), qv(z.c1)], z.r2); return s > 0 && s <= 999; } }), o = U.qq(z.P1, z.P2);
      var s = o.pts[0].y + o.pts[1].y;
      return KP.nr('The solutions of the system ' + t(eqT(z.P1)) + ' and ' + t(eqT(z.P2)) + ' are ' + t('(a,\\ b)') + ' and ' + t('(c,\\ d)') + '. The value of ' + t('b+d') + ' is ____.', s, function (v) { return v === o.pts[0].x + o.pts[1].x ? { code: CP + 'sys-y', hint: t('b') + ' and ' + t('d') + ' are the <b>' + t('y') + '-coordinates</b>.' } : null; },
        U.qqSol(o, { check: false }) + '<br>' + t('b+d=' + par(o.pts[0].y) + '+' + par(o.pts[1].y) + '=' + s) + '.', HQ, 'NR: sum of y-coordinates');
    } }] },
    { num: '16', parts: [{ id: '16', level: 'ADV', make: function (r) {
      var z = pickWhere(function () { return { tt: nz(r, 1, 3), b2: r.int(-4, 8), c2: r.int(-4, 8) }; }, function (z) { var k = z.c2 + 2 * z.tt * z.tt; return k > 0 && k <= 99 && Math.abs(z.b2 + 4 * z.tt) <= 10 && !(z.tt === -1 && z.b2 === 8 && z.c2 === 1); });
      // y = x² + bx + k, y = −x² + b2 x + c2: 2x² + (b − b2)x + (k − c2) = 0, b − b2 = 4t, k = c2 + 2t²
      var b = z.b2 + 4 * z.tt, k = z.c2 + 2 * z.tt * z.tt, o = U.qq([1, b, k], [-1, z.b2, z.c2]);
      return KP.nr('The parabolas ' + t('y=' + tx(quad([1, b, 0])) + '+k') + ' and ' + t(eqT([-1, z.b2, z.c2])) + ' touch at exactly one point. The value of ' + t('k') + ' is ____.', k, function (v) { return v === 2 * z.tt * z.tt - z.c2 && v !== k ? { code: CP + 'k-sign', hint: 'The constant term after subtracting is ' + t('k' + sg(-z.c2)) + '.' } : null; },
        'Subtract: ' + t('2x^{2}' + sg(4 * z.tt) + 'x+(k' + sg(-z.c2) + ')=0') + '. One solution: ' + t('(' + 4 * z.tt + ')^{2}-8(k' + sg(-z.c2) + ')=0') + ', so ' + t('k' + sg(-z.c2) + '=' + 2 * z.tt * z.tt) + ' and ' + t('k=' + k) + '. (They touch at ' + prPairs(o) + '.)', ['Subtract the equations; touching at one point means the discriminant is ' + t('0') + '.'], 'NR: touching parabolas');
    } }] }
  ];

  /* ---------------- Extra practice ---------------- */
  var EXTRA = [
    { num: 'A1', section: 'A. Skills', parts: [
      { id: 'eA1a', level: 'BEG', make: function (r) {
        var z = qqInt(r, { a1: 1, a2: -1, ex: [{ b2: 3, c2: 1 }] }), o = U.qq(z.P1, z.P2);
        return qqPart(o, 'Solve the system algebraically: ' + t(eqT(z.P1)) + ', ' + t(eqT(z.P2)) + '.', null, 'EP: solve', elimWrong(o));
      } },
      { id: 'eA1b', level: 'BEG', make: function (r) {
        var z = qqInt(r, { a1: 2, a2: 1, ex: [{ b2: -1, c2: 5 }] }), o = U.qq(z.P1, z.P2);
        return qqPart(o, 'Solve the system algebraically: ' + t(eqT(z.P1)) + ', ' + t(eqT(z.P2)) + '.', null, 'EP: solve', elimWrong(o));
      } },
      { id: 'eA1c', level: 'EMG', make: function (r) {
        var z = pickWhere(function () { return { b1: r.int(-6, 8), b2: r.int(-6, 6), x0: r.int(-4, 4), c2: r.int(-6, 16) }; }, function (z) { var c1 = z.c2 + (z.b2 - z.b1) * z.x0; return z.b1 !== z.b2 && Math.abs(c1) <= 16 && !(z.b1 === 6 && z.b2 === -2); });
        var P1 = [1, z.b1, z.c2 + (z.b2 - z.b1) * z.x0], P2 = [1, z.b2, z.c2], o = U.qq(P1, P2);
        return qqPart(o, 'Solve the system algebraically: ' + t(eqT(P1)) + ', ' + t(eqT(P2)) + '.', null, 'EP: x²-terms cancel');
      } },
      { id: 'eA1d', level: 'PRG', make: function (r) {
        var z = qqInt(r, { a1: 3, a2: 1, q: 2, ex: [{ p: -1, r2: 2, b2: 1, c2: 1 }] }), o = U.qq(z.P1, z.P2);
        return qqPart(o, 'Solve the system algebraically: ' + t(eqT(z.P1)) + ', ' + t(eqT(z.P2)) + '.', null, 'EP: fractional root');
      } }] },
    { num: 'A2', parts: [
      { id: 'eA2a', level: 'BEG', make: function (r) {
        var z = pickWhere(function () { return { h: nz(r, 1, 3), c1: r.int(-3, 6), a2: -1 }; }, function (z) { return !(z.h === 1 && z.c1 === 4); });
        // y = x² + c1, y = −x² + 2·2h... : P1 − P2 = 2(x − h)² -> P2 = [−1, 4h, c1 − 2h²]
        var P1 = [1, 0, z.c1], P2 = [-1, 4 * z.h, z.c1 - 2 * z.h * z.h], o = U.qq(P1, P2);
        return U.countMC(r, 'Without solving, state the number of solutions of ' + t(eqT(P1)) + ', ' + t(eqT(P2)) + '.', 1, 'Subtract: ' + t(tx(o.E) + '=0') + '. Discriminant: ' + t(dtex(o.A, o.B, o.C) + '=0') + '.', { qq: true });
      } },
      { id: 'eA2b', level: 'BEG', make: function (r) {
        var z = pickWhere(function () { return { c1: r.int(-2, 4), b2: r.int(-4, 4), c2: r.int(0, 6) }; }, function (z) { var B = -z.b2, C = z.c1 - z.c2; return B * B - 8 * C < 0 && !(z.c1 === 1 && z.b2 === 2 && z.c2 === 3); });
        var P1 = [-1, 0, z.c1], P2 = [1, z.b2, z.c2], o = U.qq(P1, P2);
        return U.countMC(r, 'Without solving, state the number of solutions of ' + t(eqT(P1)) + ', ' + t(eqT(P2)) + '.', 0, 'Subtract: ' + t(tx(o.E) + '=0') + '. Discriminant: ' + t(dtex(o.A, o.B, o.C) + '=' + (qv(o.B) * qv(o.B) - 4 * qv(o.A) * qv(o.C))) + '.', { qq: true });
      } },
      { id: 'eA2c', level: 'EMG', make: function (r) {
        var z = pickWhere(function () { return { a: r.pick([5, 3, -4, 2]), b: r.int(-5, 5), c: r.int(-4, 4), e: nz(r, 1, 6) }; }, function (z) { return !(z.a === 5 && z.b === -3 && z.c === 2); });
        var P1 = [z.a, z.b, z.c], P2 = [z.a, z.b, z.c + z.e];
        return U.countMC(r, 'Without solving, state the number of solutions of ' + t(eqT(P1)) + ', ' + t(eqT(P2)) + '.', 0, 'Subtracting gives ' + t('0=' + z.e) + ', false (one parabola is the other translated vertically).', { qq: true, falseStmt: true });
      } },
      { id: 'eA2d', level: 'EMG', make: function (r) {
        var z = pickWhere(function () { return { a: r.pick([-2, -3, 2, 3]), h: nz(r, 1, 3), q: r.int(-5, 5) }; }, function (z) { return !(z.a === -2 && z.h === -1 && z.q === 4); });
        var P2 = [z.a, -2 * z.a * z.h, z.a * z.h * z.h + z.q], vt = 'y=' + coefT(z.a) + '(x' + sg(-z.h) + ')^{2}' + (z.q ? sg(z.q) : '');
        return U.countMC(r, 'Without solving, state the number of solutions of ' + t(vt) + ', ' + t(eqT(P2)) + '.', 'inf', 'Expand: ' + t(coefT(z.a) + '(x' + sg(-z.h) + ')^{2}' + (z.q ? sg(z.q) : '') + '=' + tx(quad(P2))) + ': identical.', { qq: true });
      } }] },
    { num: 'A3', parts: [{ id: 'eA3', level: 'EMG', make: function (r) {
      var z = qqInt(r, { a1: 1, a2: -1, lo: -4, hi: 5, ex: [{ b2: 6, c2: -5 }] }), o = U.qq(z.P1, z.P2), i = r.int(0, 1), gp = o.pts[i], op = o.pts[1 - i];
      var sol = 'Verify ' + t(ptT(gp)) + ': ' + t(sub(tx(o.P1p), gp.xt) + '=' + gp.yt) + ' ✓ and ' + t(sub(tx(o.P2p), gp.xt) + '=' + gp.yt) + ' ✓.<br>' + U.qqSol(o, { check: false }) + '<br>The other solution is ' + t(ptT(op)) + '.';
      return U.pairs(CP, 'Verify that ' + t(ptT(gp)) + ' is a solution of the system ' + t(eqT(z.P1)) + ' and ' + t(eqT(z.P2)) + ', then find the other solution.', [op],
        { wrongs: [{ pts: [[gp.x, gp.y]], code: CP + 'sys-missing', hint: 'That is the given solution. Find the <b>other</b> one.' }, { pts: [[gp.x, gp.y], [op.x, op.y]], code: CP + 'sys-extra', hint: 'Give only the <b>other</b> solution.' }] }, sol,
        ['Substitute the point into both equations to verify it.', 'Eliminate ' + t('y') + ' and solve; one root is the given ' + t('x') + '.'], 'EP: verify and the other solution');
    } }] },
    { num: 'B1', section: 'B. Applying', shared: function (r) {
      var z = pickWhere(function () { return { h: r.int(-2, 2), n: r.pick([2, 3, 5, 6, 7]), b2: r.int(-4, 4), c2: r.int(-3, 4) }; }, function (z) {
        var P2 = [-1, z.b2, z.c2], P1 = [1, z.b2 - 4 * z.h, z.c2 + 2 * (z.h * z.h - z.n)];
        if (Math.abs(P1[1]) > 8 || Math.abs(P1[2]) > 9 || (z.h === 1 && z.n === 3)) return false;
        var o = U.qq(P1, P2); return o.pts.every(function (p) { return [p.x, p.y].every(function (v) { var f = Math.abs(v * 10) % 1; return Math.abs(f - 0.5) > 0.06; }); });
      });
      z.o = U.qq([1, z.b2 - 4 * z.h, z.c2 + 2 * (z.h * z.h - z.n)], [-1, z.b2, z.c2]); return z;
    }, stem: function (z) { return 'Consider the system ' + t(eqT(z.o.P1)) + ' and ' + t(eqT(z.o.P2)) + '.'; },
    parts: [
      { id: 'eB1a', level: 'PRG', make: function (r, z) { return qqPart(z.o, 'Solve the system exactly.', null, 'EP: exact'); } },
      { id: 'eB1b', level: 'EMG', make: function (r, z) {
        return U.pairsRounded(CP, 'Give the solutions to the nearest tenth (check with the calculator’s intersect).', z.o.pts, 1, {}, z.o.pts.map(function (p) { return t(ptT(p) + '\\approx(' + p.x.toFixed(1) + ',\\ ' + p.y.toFixed(1) + ')'); }).join(' and ') + '.', ['Evaluate each exact coordinate; round at the end.'], 'EP: rounded');
      } }] },
    { num: 'B2', parts: [{ id: 'eB2', level: 'EMG', make: function (r) {
      var z = qqInt(r, { a1: 2, a2: -1, ex: [{ b2: 4, c2: 3 }] }), o = U.qq(z.P1, z.P2);
      var s1 = 'y-2x^{2}=' + tx(lin([z.P1[1], z.P1[2]])), s2 = 'y+x^{2}=' + tx(lin([z.P2[1], z.P2[2]]));
      return qqPart(o, 'Solve: ' + t(s1) + ' and ' + t(s2) + '.', U.qqSol(o, { pre: 'Write each with ' + t('y') + ' alone: ' + t(eqT(z.P1)) + ' and ' + t(eqT(z.P2)) + '.<br>' }), 'EP: rearrange first');
    } }] },
    { num: 'B3', shared: function (r) {
      var fa = r.pick([[[1, 4], [-1, 2]], [[1, 2], [-1, 4]], [[1, 3], [-2, 3]], [[1, 2], [-1, 2]]]);
      var z = pickWhere(function () { return { x0: nz(r, 1, 4), b2: r.int(-4, 6), c2: r.int(-4, 4) }; }, function (z) {
        var d = qs(fa[0], fa[1]), b1 = qs(z.b2, qm(d, 2 * z.x0)), c1 = qa(z.c2, qm(d, z.x0 * z.x0));
        return b1[1] <= 4 && c1[1] <= 4 && Math.abs(qv(b1)) <= 8 && Math.abs(qv(c1)) <= 12 && !(z.x0 === 2 && z.b2 === 4 && z.c2 === -3);
      });
      var d = qs(fa[0], fa[1]); z.P1 = [fa[0], qs(z.b2, qm(d, 2 * z.x0)), qa(z.c2, qm(d, z.x0 * z.x0))]; z.P2 = [fa[1], z.b2, z.c2]; z.o = U.qq(z.P1, z.P2); return z;
    }, stem: function (z) { return 'Consider the system ' + t(eqT(z.P1)) + ' and ' + t(eqT(z.P2)) + '.'; },
    parts: [
      { id: 'eB3a', level: 'PRG', make: function (r, z) { return qqPart(z.o, 'Solve the system.', null, 'EP: fractional coefficients'); } },
      { id: 'eB3b', level: 'EMG', make: function (r, z) {
        return KP.mc(r, 'How do the graphs meet?', [
          { html: 'They touch at one point (a double root).', right: true }, { html: 'They cross at two points.', why: 'The equation left after eliminating ' + t('y') + ' has one (double) root.' },
          { html: 'They cross at one point, like a line and a parabola.', why: 'A double root means the parabolas touch without crossing.' }, { html: 'They are the same parabola.', why: 'The equations are different: subtracting does not give ' + t('0=0') + '.' }],
          'Eliminating ' + t('y') + ' gives ' + t(U.factorTex(z.o) + '=0') + ', a double root: the parabolas touch at ' + prPairs(z.o) + '.', ['Look at the equation after eliminating ' + t('y') + ': how many roots, and is one repeated?'], 'EP: how the graphs meet');
      } }] },
    { num: 'B4', parts: [{ id: 'eB4', level: 'PRG', make: function (r) {
      var z = pickWhere(function () { return { tt: nz(r, 1, 3), b2: r.int(-2, 8), c2: r.int(-3, 3) }; }, function (z) { return Math.abs(z.b2 + 4 * z.tt) <= 10 && !(z.tt === -2 && z.b2 === 6 && z.c2 === 0); });
      var b1 = z.b2 + 4 * z.tt, k0 = z.c2 + 2 * z.tt * z.tt, o = U.qq([1, b1, k0], [-1, z.b2, z.c2]), p = o.pts[0];
      var sol = 'Subtract: ' + t('2x^{2}' + sg(4 * z.tt) + 'x+(k' + sg(-z.c2) + ')=0').replace('+(k+0)', '+k').replace('(k+0)', 'k') + '. One solution: ' + t('(' + 4 * z.tt + ')^{2}-8(k' + sg(-z.c2) + ')=0') + ', so ' + t('k=' + k0) + '.<br>' + t(tx(o.E) + '=0') + ': ' + t('x=' + p.xt) + ', ' + t('y=' + p.yt) + '. Solution ' + t(ptT(p)) + '.';
      return U.kPoint(CP, 'Determine ' + t('k') + ' so that the system ' + t('y=' + tx(quad([1, b1, 0])) + '+k') + ' and ' + t(eqT([-1, z.b2, z.c2])) + ' has exactly one solution, and find it.', 'k', k0, p, sol, ['Subtract; one solution means a zero discriminant.'], 'EP: one solution: find k');
    } }] },
    { num: 'B5', parts: [{ id: 'eB5', level: 'ADV', make: function (r) {
      var z = pickWhere(function () { return { p: r.int(-3, 2), q: r.int(-2, 4), c0: r.pick([0, 0, 1, -1, 2]) }; }, function (z) { return z.p < z.q && !(z.p === 1 && z.q === 2 && z.c0 === 0); });
      var f = [1, 0, z.c0], F = quad(f), fx = function (x) { return x * x + z.c0; };
      var keyP = [-1, 2 * (z.p + z.q), z.c0 - 2 * z.p * z.q]; // x² + c0 − 2(x − p)(x − q)
      var check = function (resp) {
        var s = String(resp == null ? '' : resp).replace(/\\(left|right)/g, '').replace(/\\[,;: !]|~/g, ' ').trim();
        if (!s) return form('empty', 'Type your answer first.');
        var sides = s.split('='); if (sides.length !== 2) return form('eq-form', 'Write the equation as ' + t('y=ax^{2}+bx+c') + '.');
        var l = sides[0].replace(/\s/g, ''), rr = sides[1].replace(/\s/g, ''), other = l === 'y' ? rr : rr === 'y' ? l : null;
        if (other == null) return form('eq-form', 'Write the equation as ' + t('y=\\dots') + '.');
        var pr = P.read(other); if (!pr.ok || P.vars(pr.p).some(function (w) { return w !== 'x'; })) return form('unreadable', 'Write a quadratic in ' + t('x') + ', e.g. ' + t('y=-x^{2}+6x-4') + '.');
        if (P.degree(pr.p) !== 2) return wrong(CP + 'model', 'A parabola needs an ' + t('x^{2}') + '-term.');
        var at = function (x) { return P.at(pr.p, { x: x }); }, hits = [z.p, z.q].filter(function (x) { return Math.abs(at(x) - fx(x)) < 1e-9; });
        if (qv(P.coef(pr.p, { x: 2 })) >= 0 && hits.length === 2) return wrong(CP + 'model', 'It passes through both points, but it must <b>open down</b>: the ' + t('x^{2}') + '-coefficient must be negative.');
        if (hits.length < 2) return wrong(CP + 'model', hits.length ? 'It passes through ' + t('(' + hits[0] + ',\\ ' + fx(hits[0]) + ')') + ' but not the other point. Check both.' : 'It must pass through both ' + t('(' + z.p + ',\\ ' + fx(z.p) + ')') + ' and ' + t('(' + z.q + ',\\ ' + fx(z.q) + ')') + '.');
        if (qv(P.coef(pr.p, { x: 2 })) >= 0) return wrong(CP + 'model', 'It must open down.');
        return ok();
      };
      var key = eqT(keyP);
      var part = KP.math('The parabola ' + t('y=' + tx(F)) + ' passes through ' + t('(' + z.p + ',\\ ' + fx(z.p) + ')') + ' and ' + t('(' + z.q + ',\\ ' + fx(z.q) + ')') + '. Write the equation of a different parabola, opening down, that meets ' + t('y=' + tx(F)) + ' at exactly these two points.', check, key,
        'Sample: ' + t(key) + '. Check: ' + t(tx(F) + '=' + tx(quad(keyP))) + ' gives ' + t(tx(quad([2, -2 * (z.p + z.q), 2 * z.p * z.q])) + '=0') + ', so ' + t('2' + U.factorTex(U.roots([1, -(z.p + z.q), z.p * z.q])) + '=0') + ': ' + t('x=' + z.p) + ' and ' + t('x=' + z.q) + ' only.<br>(Any ' + t('y=' + tx(F) + '+c' + U.factorTex(U.roots([1, -(z.p + z.q), z.p * z.q]))) + ' with ' + t('c<-1') + ' works.)',
        ['Subtracting the two equations must leave a quadratic with roots ' + t(z.p) + ' and ' + t(z.q) + '.', 'Try ' + t('y=' + tx(F) + '+c(x' + sg(-z.p) + ')(x' + sg(-z.q) + ')') + ' and choose ' + t('c') + ' so that the ' + t('x^{2}') + '-coefficient is negative.'], 'EP: write a parabola through two points', { keys: 'u8keq', placeholder: 'e.g. y = -x^2 + 6x - 4' });
      part.bad = [eqT([1, 0, z.c0 + 1]), eqT([3, -2 * (z.p + z.q), z.c0 + 2 * z.p * z.q])];
      return part;
    } }] },
    { num: 'B6', parts: [{ id: 'eB6', level: 'EMG', make: function (r) {
      var c = r.int(-3, 5), e = nz(r, 2, 6), d = r.int(1, 3), base = eqT([1, 0, c]);
      return KP.mc(r, 'Which system has no solution?', [
        { html: t(base) + ' and ' + t(eqT([1, 0, c - e])), right: true },
        { html: t(base) + ' and ' + t(eqT([-1, 0, c + 2 * d * d])), why: 'Subtracting gives ' + t('2x^{2}=' + 2 * d * d) + ': two solutions.' },
        { html: t(base) + ' and ' + t(eqT([2, 0, c - d * d])), why: 'Subtracting gives ' + t('x^{2}=' + d * d) + ': two solutions.' },
        { html: t(base) + ' and ' + t('y=(x' + sg(-d) + ')^{2}'), why: 'Expanding, the ' + t('x^{2}') + '-terms cancel and leave a linear equation: one solution.' }],
        'Subtracting the first pair gives ' + t('0=' + e) + ', false: one parabola is the other translated vertically, so no solution.', ['Subtract the equations in each system.'], 'EP MC: no solution');
    } }] },
    { num: 'B7', parts: [{ id: 'eB7', level: 'PRG', make: function (r) {
      var z = qqInt(r, { a1: 2, a2: 1, ex: [{ b2: 1, c2: -4 }], test: function (z) { var ys = [z.p, z.r2].map(function (x) { return x * x + z.b2 * x + z.c2; }); return Math.max.apply(null, ys) > 0 && Math.max.apply(null, ys) <= 999 && ys[0] !== ys[1]; } }), o = U.qq(z.P1, z.P2);
      var ys = o.pts.map(function (p) { return p.y; }), big = Math.max.apply(null, ys);
      return KP.nr('The greater ' + t('y') + '-coordinate of the solutions of the system ' + t(eqT(z.P1)) + ' and ' + t(eqT(z.P2)) + ' is ____.', big, function (v) { return o.pts.some(function (p) { return p.x === v; }) ? { code: CP + 'sys-y', hint: 'That is an ' + t('x') + '-coordinate. Find the ' + t('y') + '-values.' } : null; },
        U.qqSol(o, { check: false }) + '<br>The greater ' + t('y') + '-coordinate is ' + t(big) + '.', HQ, 'EP NR: greater y');
    } }] },
    { num: 'C1', section: 'C. Stretch', parts: [{ id: 'eC1', level: 'MAS', make: function (r) {
      var z = pickWhere(function () { return { e: nz(r, 1, 4) * 2, dl: nz(r, 1, 4), gm: r.int(-3, 3) }; }, function (z) { var q = z.e * z.e / (4 * z.dl); if (q % 1 !== 0) return false; var a = 1 - q; return a !== 0 && a !== 1 && Math.abs(a) <= 9 && z.gm + z.e !== 0 && !(z.e === 4 && z.dl === -1 && z.gm === -2); });
      var bet = z.gm + z.e, aV = 1 - z.e * z.e / (4 * z.dl), P2 = [1, z.gm, z.dl];
      // a = 1: linear (β − γ)x − δ = 0 -> x = δ / e ; a = aV: x = 2δ / e
      var x1 = R([z.dl, z.e]), x2 = R([2 * z.dl, z.e]), p1 = U.mkPt(U.S(x1), U.S(P.atExact(quad(P2), { x: x1 }))), p2 = U.mkPt(U.S(x2), U.S(P.atExact(quad(P2), { x: x2 })));
      var sol = 'Subtract: ' + t('(a-1)x^{2}' + sg(z.e) + 'x' + sg(-z.dl) + '=0') + '.<br>If ' + t('a=1') + ', it is linear: ' + t(z.e + 'x' + sg(-z.dl) + '=0') + ', ' + t('x=' + p1.xt) + ', ' + t('y=' + p1.yt) + ': one solution ' + t(ptT(p1)) + '.<br>If ' + t('a\\ne 1') + ': one solution when ' + t(par(z.e) + '^{2}-4(a-1)' + par(-z.dl) + '=0') + ', so ' + t('a-1=' + qt(R([-z.e * z.e, 4 * z.dl]))) + ' and ' + t('a=' + aV) + '. Then ' + t('x=' + p2.xt) + ', ' + t('y=' + p2.yt) + ': ' + t(ptT(p2)) + '.';
      return U.tanPart(CP, 'Determine all values of ' + t('a') + ' for which the system ' + t('y=ax^{2}' + sg(bet) + 'x') + ' and ' + t(eqT(P2)) + ' has exactly one solution, and give the solution for each.', 'a', [1, aV], [p1, p2], null, sol,
        ['Subtract: the ' + t('x^{2}') + '-coefficient is ' + t('a-1') + '. What happens when it is ' + t('0') + '?', 'Otherwise one solution means a zero discriminant: solve for ' + t('a') + '.'], 'EP: all values of a', { ptsLabel: 'Solutions:' });
    } }] },
    { num: 'C2', parts: [{ id: 'eC2', level: 'MAS', make: function (r) {
      var z = pickWhere(function () { return { A: r.pick([2, 3, -2, 4, -1]), p: nz(r, 1, 4), q: r.int(-6, 6) }; }, function (z) { return !(z.A === 3 && z.p === 2 && z.q === -5); });
      var B = -2 * z.A * z.p, C = z.A * z.p * z.p + z.q, P2 = [z.A, B, C];
      var pChk = K.number(z.p, function (v) { return v === -z.p ? { code: CP + 'k-sign', hint: 'Expand ' + t(z.A + '(x-p)^{2}') + ': the ' + t('x') + '-term is ' + t(-2 * z.A + 'px') + '. Match it to ' + t(B + 'x') + '.' } : null; });
      var qChk = K.number(z.q, function (v) { return v === C ? { code: CP + 'model', hint: 'The constant of ' + t(z.A + '(x-p)^{2}+q') + ' is ' + t(z.A + 'p^{2}+q') + ', not ' + t('q') + ' alone.' } : null; });
      return KP.fields('Determine ' + t('p') + ' and ' + t('q') + ' so that the system ' + t('y=' + coefT(z.A) + '(x-p)^{2}+q') + ' and ' + t(eqT(P2)) + ' has infinitely many solutions.', [{ label: t('p='), name: 'p' }, { label: t('q='), name: 'q' }], [pChk, qChk], [String(z.p), String(z.q)], t('p=' + z.p) + ', ' + t('q=' + z.q),
        'The equations must be identical: ' + t(coefT(z.A) + '(x-p)^{2}+q=' + tx(quad([z.A, 0, 0])) + sg(-2 * z.A) + 'px+' + (z.A === 1 ? '' : z.A === -1 ? '-' : z.A) + 'p^{2}+q') + '.<br>' + t(-2 * z.A + 'p=' + B) + ', so ' + t('p=' + z.p) + '; ' + t(z.A * z.p * z.p + '+q=' + C) + ', so ' + t('q=' + z.q) + '.',
        ['Infinitely many solutions: the two equations describe the same parabola. Expand the vertex form.', 'Match the ' + t('x') + '-coefficients to find ' + t('p') + ', then the constants to find ' + t('q') + '.'], 'EP: identical parabolas');
    } }] }
  ];

  HW.defineLesson({ id: LID, unit: 8, num: '2', title: 'Solving Quadratic–Quadratic Systems', outcome: OUT, calc: true, questions: QUESTIONS, extra: EXTRA });
})(window);
