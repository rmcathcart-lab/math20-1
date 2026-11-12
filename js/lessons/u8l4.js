/* Math 20-1 · Unit 8 · Lesson 4 — Linear Inequalities in Two Variables (outcome RF7 on every part)
 * Assignment 4 (m201book unit8/u8_l04.tex, Questions 1–16) and the Lesson 4 Extra Practice (u8_ep04.tex, A1–A4, B1–B5,
 * C1–C3). Every part is a generator: the booklet question's idea, form and difficulty with new numbers (contexts vary a
 * little); the lesson's example numbers and the booklet question's own numbers are left out. Calculator allowed.
 * Students never draw: "graph each inequality" becomes "which graph shows it?" (four shaded graphs: the right one, the
 * other side, the other kind of boundary, and a wrong boundary or both wrong — every picture is drawn from the actual
 * half-planes, by js/lessons/u8l4.js regPic); "write the inequality" is typed and checked by HW.u8assess (any equivalent
 * form, with wrong side / solid vs dashed / not reversed / wrong boundary diagnosed); one-variable inequalities are typed
 * in set notation, as a plain inequality or as an interval (HW.sets); points in a region are a yes/no grid; contexts are
 * typed inequalities in simplest form (restrictions stated), numbers, corners as ordered pairs, and multiple choice for
 * "is this combination possible?". The number lines of Q1 and EP A1 are not drawn (the set notation is asked).
 * Levels: LIM BEG EMG PRG ADV MAS. Mastery: Q11(b) (the corners of a two-condition context), Extra C1 (corners and area
 * of a three-inequality region), C2(c) (the best whole-number combination), C3 (a system from the corners of a triangle).
 * Uses HW.u8k34 (js/lessons/u8l3.js, loaded first) and HW.u8assess (js/lessons/u8test.js, only inside the generators). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, KP = K.P, P = HW.poly, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, U = HW.u8k34;
  if (!U) throw new Error('js/lessons/u8l4.js needs js/lessons/u8l3.js (HW.u8k34) first');
  var LID = 'u8l4', CP = 'u8l4-';
  var A = U.A, pickWhere = U.pickWhere, nz = U.nz, cl = U.cl, isInt = U.isInt, nT = U.nT, nK = U.nK, gcd = U.gcd, vF = U.vF, vD = U.vD, par = U.par, M = U.M, lf = U.lf, ptT = U.ptT;
  var numChk = U.numChk, numP = U.numP, fieldsP = U.fieldsP, mcP = U.mcP, pairsChk = U.pairsChk;

  U.assessCodes(CP);
  U.codes({
    'u8l4-pt-row': ['Misjudged whether a point is a solution', 'b'], 'u8l4-pt-boundary': ['A point on the boundary: included/excluded wrong', 's'],
    'u8l4-yform': ['Not written with y alone (format)', ''], 'u8l4-simplest': ['Inequality not in simplest form (format)', ''],
    'u8l4-ctx-round': ['Whole numbers: rounded the wrong way', 's'], 'u8l4-ctx-corner': ['Gave the other coordinate of the corner', 's'],
    'u8l4-nr-x': ['Used the x-intercept instead of the y-intercept', 'b'], 'u8l4-nr-one': ['Ignored “at least one of each”', 'b'],
    'u8l4-count': ['Counted the combinations wrong', 'b'], 'u8l4-best': ['Not the combination with the greatest profit', 'b'],
    'u8l4-area': ['Right corners, wrong area', 's'], 'u8l4-tri': ['System from corners: an inequality wrong', 'b'], 'u8l4-sys': ['Context system: an inequality wrong', 'b']
  });

  /* ======================================================================================================
   * Inequality tools
   * ====================================================================================================== */
  var OPS = { lt: '<', le: '\\le ', gt: '>', ge: '\\ge ' }, FLIP = { lt: 'gt', le: 'ge', gt: 'lt', ge: 'le' }, SOFT = { lt: 'le', le: 'lt', gt: 'ge', ge: 'gt' };
  function strict(o) { return o === 'lt' || o === 'gt'; }
  function up(o) { return o === 'gt' || o === 'ge'; }
  function holds(v, op) { return op === 'lt' ? v < -1e-12 : op === 'le' ? v <= 1e-12 : op === 'gt' ? v > 1e-12 : v >= -1e-12; }
  function opT(op) { return OPS[op].trim(); }
  /* a half-plane A·x + B·y op C */
  function hp(Aa, B, C, op) { return { A: Aa, B: B, C: C, op: op }; }
  function flipH(h) { return hp(h.A, h.B, h.C, FLIP[h.op]); }
  function inH(h, x, y) { return holds(h.A * x + h.B * y - h.C, h.op); }
  /* LaTeX of a·u + b·w (u, w: letters), coefficients as fractions */
  function term(c, v, first) { if (!c) return ''; var a = Math.abs(c), s = (a === 1 ? '' : vF(a)) + v; return (c < 0 ? '-' : first ? '' : '+') + s; }
  function lin2(a, u, b, w) { var s = term(a, u, true); s += term(b, w, !s); return s || '0'; }
  function stdT(h, u, w) { return lin2(h.A, u || 'x', h.B, w || 'y') + OPS[h.op] + vF(h.C); }
  /* y-form of a half-plane with B ≠ 0 */
  function yOf(h) { return { m: cl(-h.A / h.B), b: cl(h.C / h.B), op: h.B > 0 ? h.op : FLIP[h.op] }; }
  function yT(h, w, u) { var y = yOf(h); return (w || 'y') + OPS[y.op] + lf(y.m, y.b, u || 'x'); }
  /* the target polynomial (L − R) of a half-plane, for HW.u8assess.ineqPart */
  function poly2(h, u, w) { return P.add(M(h.A, u || 'x', 1), M(h.B, w || 'y', 1), M(-h.C)); }
  /* a test point not on the boundary */
  function testPt(h) { var c = [[0, 0], [0, 1], [1, 0], [0, -1], [1, 1]]; for (var i = 0; i < c.length; i++) if (Math.abs(h.A * c[i][0] + h.B * c[i][1] - h.C) > 1e-9) return c[i]; return [2, 2]; }
  function testSent(h, u, w) {
    var p = testPt(h), v = cl(h.A * p[0] + h.B * p[1]), tr = inH(h, p[0], p[1]);
    return 'Test ' + t(ptT(p[0], p[1])) + ': ' + t(nT(v) + OPS[h.op] + vF(h.C)) + ' is ' + (tr ? 'true, so shade the side with ' + (p[0] || p[1] ? 'that point' : 'the origin') : 'false, so shade the other side') + '.';
  }
  /* a typed inequality (HW.u8assess.ineqPart): o = { vars, wrongs, rev, sideHint, yForm, simplest, intCoef } */
  function ineqP(prompt, h, keyTex, o, sol, hints, text) {
    o = o || {};
    var vs = o.vars || ['x', 'y'];
    var p = A().ineqPart(CP, prompt, poly2(h, vs[0], vs[1]), h.op, keyTex, { vars: vs, wrongs: o.wrongs, rev: o.rev, sideHint: o.sideHint, intCoef: o.intCoef, ph: o.ph, example: o.example }, sol, hints, text);
    p.check = wrapForm(p.check, o, vs);
    return p;
  }
  function ineqChk(h, o) { o = o || {}; var vs = o.vars || ['x', 'y']; return wrapForm(A().ineqPart(CP, '', poly2(h, vs[0], vs[1]), h.op, 'x<1', { vars: vs, wrongs: o.wrongs, rev: o.rev, sideHint: o.sideHint }).check, o, vs); }
  function wrapForm(chk, o, vs) {
    return function (resp) {
      var r = chk(resp); if (r.v !== 'correct') return r;
      var s = String(resp == null ? '' : resp).replace(/\\left|\\right|\s|\\[,;: !]/g, '');
      if (o.yForm && !new RegExp('^' + vs[1] + '(\\\\le|\\\\ge|\\\\leq|\\\\geq|\\\\lt|\\\\gt|<|>|≤|≥)').test(s)) return form(CP + 'yform', 'Right — now write it with ' + t(vs[1]) + ' alone on the left, e.g. ' + t(vs[1] + '\\le 3' + vs[0] + '-4') + '.');
      if (o.simplest) {
        var m = /\\leqslant|\\geqslant|\\leq|\\geq|\\le|\\ge|\\lt|\\gt|<=|>=|≤|≥|<|>/.exec(s), Lp = m && P.read(s.slice(0, m.index)), Rp = m && P.read(s.slice(m.index + m[0].length));
        if (Lp && Rp && Lp.ok && Rp.ok) {
          var cs = P.terms(P.sub(Lp.p, Rp.p)).map(function (T) { return T.c; });
          if (cs.some(function (c) { return c[1] !== 1; })) return form(CP + 'simplest', 'Right — now clear the fractions: use whole-number coefficients.');
          var g = cs.reduce(function (a, c) { return gcd(a, c[0]); }, 0); if (g > 1) return form(CP + 'simplest', 'Right — now write it in simplest form: divide every term by ' + t(g) + '.');
        }
      }
      return r;
    };
  }

  /* ---------------- pictures: shaded regions from half-planes ---------------- */
  function clip(poly, h) {
    var s = up(h.op) ? 1 : -1, f = function (p) { return s * (h.A * p[0] + h.B * p[1] - h.C); }, out = [];
    for (var i = 0; i < poly.length; i++) {
      var p1 = poly[i], p2 = poly[(i + 1) % poly.length], f1 = f(p1), f2 = f(p2);
      if (f1 >= 0) out.push(p1);
      if ((f1 >= 0) !== (f2 >= 0)) { var q = f1 / (f1 - f2); out.push([p1[0] + q * (p2[0] - p1[0]), p1[1] + q * (p2[1] - p1[1])]); }
    }
    return out;
  }
  function lineSeg(Aa, B, C, xr, yr) {
    var pts = [];
    if (B) [xr[0], xr[1]].forEach(function (x) { var y = (C - Aa * x) / B; if (y >= yr[0] - 1e-9 && y <= yr[1] + 1e-9) pts.push([x, y]); });
    if (Aa) [yr[0], yr[1]].forEach(function (y) { var x = (C - B * y) / Aa; if (x >= xr[0] - 1e-9 && x <= xr[1] + 1e-9) pts.push([x, y]); });
    if (pts.length < 2) return null;
    pts.sort(function (a, b) { return a[0] - b[0] || a[1] - b[1]; });
    return [pts[0], pts[pts.length - 1]];
  }
  /* o = { x, y, regions: [[h, …], …] (each shaded where all its half-planes hold), lines: [{ h, dash }], points, xName, yName, max } */
  function regPic(o) {
    var xr = o.x || [-6, 6], yr = o.y || [-6, 6], span = Math.max(xr[1] - xr[0], yr[1] - yr[0]);
    var step = o.step || (span <= 14 ? 1 : span <= 30 ? 2 : span <= 70 ? 5 : span <= 140 ? 10 : 20);
    var spec = { x: xr, y: yr, grid: step, labels: o.labels || (span <= 14 ? 2 : step * 2), max: o.max || 260, unit: Math.min(26, 260 / span), xName: o.xName, yName: o.yName, firstQuadrant: xr[0] >= 0,
      aria: o.aria || 'a shaded region', segs: [], points: (o.points || []).map(function (p) { return { x: p[0], y: p[1], label: p[2] }; }) };
    (o.lines || []).forEach(function (l) { var s = lineSeg(l.h.A, l.h.B, l.h.C, xr, yr); if (s) spec.segs.push({ pts: s, dash: !!l.dash }); });
    var svg = HW.graph(spec), G = HW.graph.last, polys = '';
    (o.regions || []).forEach(function (hs) {
      var poly = [[xr[0], yr[0]], [xr[1], yr[0]], [xr[1], yr[1]], [xr[0], yr[1]]];
      hs.forEach(function (h) { if (poly.length) poly = clip(poly, h); });
      if (poly.length >= 3) polys += '<polygon points="' + poly.map(function (p) { return G.X(p[0]).toFixed(1) + ',' + G.Y(p[1]).toFixed(1); }).join(' ') + '" fill="#2b55a0" fill-opacity="0.18" stroke="none"/>';
    });
    return svg.replace('fill="#fff"/>', 'fill="#fff"/>' + polys);
  }
  function fig(svg) { return '<div class="fig">' + svg + '</div>'; }
  /* a picture of one half-plane (plus fixed restrictions fq), boundary dashed or solid */
  function onePic(h, dash, o) { o = o || {}; return regPic({ x: o.x, y: o.y, regions: [[h].concat(o.fq || [])], lines: [{ h: h, dash: dash }], max: o.max || 200, xName: o.xName, yName: o.yName, points: o.points }); }
  /* which graph shows h? o = { x, y, fq, alt (a wrong boundary for the 4th option), xName, yName, sol, hints, text } */
  function whichGraph(r, prompt, h, o) {
    o = o || {};
    var s = strict(h.op), W = { x: o.x, y: o.y, fq: o.fq, xName: o.xName, yName: o.yName };
    var opts = [{ html: onePic(h, s, W), right: true, code: 'right' },
      { html: onePic(flipH(h), s, W), code: 'side', why: 'That shades the wrong side. ' + testSent(h, o.u, o.w) },
      { html: onePic(h, !s, W), code: 'line', why: s ? t('<') + ' or ' + t('>') + ': the boundary is <b>dashed</b> (points on it are not solutions).' : t('\\le') + ' or ' + t('\\ge') + ': the boundary is <b>solid</b> (points on it are solutions).' }];
    if (o.alt) opts.push({ html: onePic(o.alt, s, W), code: 'bound', why: o.altWhy || 'That is the wrong boundary line: check its intercepts.' });
    else opts.push({ html: onePic(flipH(h), !s, W), code: 'both', why: 'Both the side and the kind of boundary are wrong. ' + testSent(h, o.u, o.w) });
    var p = KP.mc(r, prompt, opts, o.sol, o.hints || ['Graph the boundary by replacing the sign with ' + t('=') + '. Solid for ' + t('\\le') + ', ' + t('\\ge') + '; dashed for ' + t('<') + ', ' + t('>') + '.', 'Test a point that is not on the line: shade its side if the inequality is true there.'], o.text || 'which graph');
    p.input.columns = 2;
    return p;
  }
  function solOf(h, how) { return how + ' ' + (strict(h.op) ? 'Dashed' : 'Solid') + ' boundary (' + t(opT(h.op)) + '). ' + testSent(h); }

  /* ======================================================================================================
   * Generators
   * ====================================================================================================== */
  var HINQ = ['Solve it like an equation. Multiplying or dividing both sides by a negative number reverses the sign.', 'Check with a test value: a number in your solution should make the original inequality true.'];
  var INCL = 'Check the endpoint: ' + t('<') + ' and ' + t('>') + ' leave it out (open circle); ' + t('\\le') + ' and ' + t('\\ge') + ' include it (closed dot).';
  function setT(x0, op) { var S = A().SET; return op === 'lt' ? S.below(x0, false) : op === 'le' ? S.below(x0, true) : op === 'gt' ? S.above(x0, false) : S.above(x0, true); }
  function setP(prompt, x0, op, rev, sol, text) {
    return A().setPart(CP, prompt, setT(x0, op), { v: 'x', rev: rev, inclHint: INCL, sideHint: 'The inequality points the wrong way: test a value in the original inequality.', noneHint: 'There are solutions: test a value such as ' + t('x=' + vF(op === 'lt' || op === 'le' ? Math.floor(x0) - 1 : Math.ceil(x0) + 1)) + '.' }, sol, HINQ, text);
  }
  function testVal(x0, op, f) { var v = op === 'lt' || op === 'le' ? Math.floor(x0) - 1 : Math.ceil(x0) + 1; return 'Test ' + t('x=' + v) + ': ' + f(v) + ' ✓'; }
  /* Q1(a) ax + b op cx + d (no reversing) */
  function oneA(r) {
    var z = pickWhere(function () { return { a: r.int(2, 8), c: r.int(-3, 7), x0: r.int(-8, 8), b: r.int(-9, 9), op: r.pick(['lt', 'le', 'gt', 'ge']) }; }, function (s) { return s.c < s.a && s.c !== 0 && s.b !== 0 && !(s.a === 5 && s.c === 2 && s.b === -8); });
    var k = z.a - z.c, d = z.b + k * z.x0, L = function (x) { return U.lx(z.a, z.b).replace(/x/g, '(' + x + ')'); };
    var sol = t(k + 'x' + OPS[z.op] + (d - z.b)) + ', so ' + t('x' + OPS[z.op] + z.x0) + '.<br>' + testVal(z.x0, z.op, function (v) { return t(nT(z.a * v + z.b) + OPS[z.op] + nT(z.c * v + d)); }) + '<br>' + t(A().setPart(CP, '', setT(z.x0, z.op), {}).key);
    void L;
    return setP('Solve, check with a test value, and write the solution in set notation: ' + t(U.lx(z.a, z.b) + OPS[z.op] + U.lx(z.c, d)), z.x0, z.op, false, sol, 'one-variable inequality');
  }
  /* Q1(b) p − q(s − x) op ux + v (reversing) */
  function oneB(r) {
    var z = pickWhere(function () { return { p: r.int(-5, 9), q: r.int(2, 5), s: r.int(1, 6), du: r.int(1, 5), x0: r.int(-8, 6), op: r.pick(['lt', 'le', 'gt', 'ge']) }; }, function (w) { return !(w.p === 4 && w.q === 3 && w.s === 2); });
    var u = z.q + z.du, k = z.q - u, v = k * z.x0 + z.p - z.q * z.s, c0 = z.p - z.q * z.s, op2 = FLIP[z.op];
    var sol = t(nT(c0) + '+' + z.q + 'x' + OPS[z.op] + U.lx(u, v)) + '<br>' + t(k + 'x' + OPS[z.op] + nT(v - c0)) + '; divide by ' + t(k) + ' (negative: <b>reverse</b> the sign): ' + t('x' + OPS[op2] + z.x0) + '.<br>' +
      testVal(z.x0, op2, function (x) { return t(nT(c0 + z.q * x) + OPS[z.op] + nT(u * x + v)); }) + '<br>' + t(A().setPart(CP, '', setT(z.x0, op2), {}).key);
    return setP('Solve, check with a test value, and write the solution in set notation: ' + t(z.p + '-' + z.q + '(' + z.s + '-x)' + OPS[z.op] + U.lx(u, v)), z.x0, op2, true, sol, 'inequality: reverse the sign');
  }
  /* Q1(c) (αx + β)/γ − δ op x/ε */
  function lcm(a, b) { return a / gcd(a, b) * b; }
  function oneC(r) {
    var z = pickWhere(function () { return { al: r.int(1, 4), be: r.int(-5, 5), ga: r.int(2, 5), de: r.int(1, 4), ep: r.int(2, 5), op: r.pick(['lt', 'le', 'gt', 'ge']) }; }, function (w) {
      if (w.ga === w.ep || w.be === 0 || (w.al === 2 && w.be === 1 && w.ga === 3 && w.de === 1 && w.ep === 2)) return false;
      var L = lcm(w.ga, w.ep), k = L / w.ga * w.al - L / w.ep, c = L / w.ga * w.be - L * w.de; if (!k) return false; var f = U.toFr(-c / k); return f && f[1] <= 6 && Math.abs(f[0] / f[1]) <= 15;
    });
    var L = lcm(z.ga, z.ep), a1 = L / z.ga, e1 = L / z.ep, k = a1 * z.al - e1, c = a1 * z.be - L * z.de, x0 = cl(-c / k), op2 = k < 0 ? FLIP[z.op] : z.op;
    var top = U.lx(z.al, z.be), sol = 'Multiply both sides by ' + t(L) + ': ' + t(a1 + '(' + top + ')-' + L * z.de + OPS[z.op] + (e1 === 1 ? '' : e1) + 'x') + '<br>' + t(U.lx(a1 * z.al, a1 * z.be - L * z.de) + OPS[z.op] + (e1 === 1 ? '' : e1) + 'x') + ', so ' + t(U.lx(k, 0) + OPS[z.op] + nT(-c)) + '<br>' +
      (k < 0 ? 'Divide by ' + t(k) + ' (negative: <b>reverse</b> the sign): ' : (k !== 1 ? 'Divide by ' + t(k) + ': ' : '')) + t('x' + OPS[op2] + vF(x0)) + '.<br>' + testVal(x0, op2, function (x) { return t(vF((z.al * x + z.be) / z.ga - z.de) + OPS[z.op] + vF(x / z.ep)); }) + '<br>' + t(A().setPart(CP, '', setT(x0, op2), {}).key);
    return setP('Solve, check with a test value, and write the solution in set notation: ' + t('\\dfrac{' + top + '}{' + z.ga + '}-' + z.de + OPS[z.op] + '\\dfrac{x}{' + z.ep + '}'), x0, op2, k < 0, sol, 'inequality with fractions');
  }

  /* points: is each a solution? (Q2 with 5 points, EP A2 with 4) */
  function ptsGrid(r, n, o) {
    o = o || {};
    var z = pickWhere(function () {
      if (o.yform) { var m = nz(r, 1, 3), b = r.int(-4, 5); return { A: -m, B: 1, x0: r.int(-3, 3), op: r.pick(['lt', 'le', 'gt', 'ge']), b: b }; }
      return { A: nz(r, 1, 5), B: nz(r, 1, 5), x0: r.int(-3, 3), y0: r.int(-3, 3), op: r.pick(['lt', 'le', 'gt', 'ge']) };
    }, function (s) {
      if (o.yform) { s.y0 = -s.A * s.x0 + s.b; s.C = s.b; return Math.abs(s.y0) <= 6 && !(s.A === 1 && s.b === 3 && s.op === 'gt'); }
      s.C = s.A * s.x0 + s.B * s.y0; return gcd(s.A, s.B) === 1 && Math.abs(s.C) <= 12 && s.C !== 0 && !(s.A === 3 && s.B === 2 && s.C === 6) && Math.abs(s.x0 + s.B) <= 6 && Math.abs(s.y0 - s.A) <= 6;
    });
    var h = hp(z.A, z.B, z.C, z.op), nb = o.yform ? 1 : 2;
    var pts = pickWhere(function () {
      var L = [[z.x0, z.y0]]; if (nb === 2) L.push([z.x0 + z.B, z.y0 - z.A]);
      while (L.length < n) L.push([r.int(-5, 5), r.int(-5, 5)]);
      return L;
    }, function (L) {
      var keys = L.map(function (p) { return p.join(','); }); if (keys.some(function (k, i) { return keys.indexOf(k) !== i; })) return false;
      var rest = L.slice(nb); if (rest.some(function (p) { return Math.abs(z.A * p[0] + z.B * p[1] - z.C) < 1e-9; })) return false;
      var yes = rest.filter(function (p) { return inH(h, p[0], p[1]); }).length; return yes >= 1 && yes < rest.length;
    });
    var show = o.yform ? yT(h) : stdT(h), order = r.shuffle(pts.map(function (p, i) { return { p: p, onB: i < nb }; })), want = {}, rows = [], lines = [], bIds = [];
    order.forEach(function (q, j) {
      var id = 'p' + j, yes = inH(h, q.p[0], q.p[1]); want[id] = yes ? 'y' : 'n'; if (q.onB) bIds.push(id);
      rows.push({ id: id, html: t(ptT(q.p[0], q.p[1])) });
      var lhs = o.yform ? t(nT(q.p[1]) + OPS[yOf(h).op] + nT(yOf(h).m * q.p[0] + yOf(h).b)) : t(nT(z.A * q.p[0] + z.B * q.p[1]) + OPS[z.op] + z.C);
      lines.push(t(ptT(q.p[0], q.p[1])) + ': ' + lhs + (yes ? ' is true: a solution' : ' is false: not a solution') + (q.onB ? ' (on the boundary, which is ' + (strict(z.op) ? 'dashed' : 'solid and included') + ')' : '') + '.');
    });
    var p = KP.grid('Determine whether each point is in the solution region of ' + t(show) + '.', rows, [{ id: 'y', html: 'Solution' }, { id: 'n', html: 'Not a solution' }], want,
      { why: function (row) { if (bIds.indexOf(row) >= 0) return { code: CP + 'pt-boundary', hint: 'That point is on the boundary (both sides are equal). ' + t(opT(z.op)) + (strict(z.op) ? ' does not include the boundary.' : ' includes the boundary.') }; return { code: CP + 'pt-row', hint: 'Substitute the point into the inequality and check whether the statement is true.' }; } },
      lines.join('<br>'), ['Substitute the ' + t('x') + '- and ' + t('y') + '-values of each point.', 'A point that makes both sides equal is on the boundary: a solution only for ' + t('\\le') + ' or ' + t('\\ge') + '.'], 'points in a region');
    var f1 = {}, f2 = {}; Object.keys(want).forEach(function (k) { f1[k] = want[k]; f2[k] = want[k] === 'y' ? 'n' : 'y'; }); bIds.forEach(function (k) { f1[k] = want[k] === 'y' ? 'n' : 'y'; });
    p.bad = [f1, f2];
    return p;
  }

  /* which graph: y op mx + b (Q3, EP A4a) */
  var YEXCL = [[1, -4, 'ge'], [-3, 2, 'lt'], [0.75, 1, 'le'], [2, -1, 'lt'], [-2 / 3, 3, 'ge'], [-2, 4, 'ge']];
  function graphY(r, kind) {
    var z = pickWhere(function () {
      var m = kind === 'one' ? (r.chance(0.5) ? 1 : -1) : kind === 'int' ? nz(r, 2, 3) : (function () { var q = r.pick([2, 3, 4]), p = nz(r, 1, q + 1); return p / q; })();
      return { m: cl(m), b: r.int(-4, 4), op: r.pick(['lt', 'le', 'gt', 'ge']) };
    }, function (s) { return (kind !== 'frac' || !isInt(s.m)) && !YEXCL.some(function (e) { return Math.abs(e[0] - s.m) < 1e-9 && e[1] === s.b && e[2] === s.op; }); });
    var h = hp(-z.m, 1, z.b, z.op), show = 'y' + OPS[z.op] + lf(z.m, z.b);
    return whichGraph(r, 'Which graph shows the solution region of ' + t(show) + '?', h, { sol: solOf(h, 'Slope ' + t(vF(z.m)) + ', ' + t('y') + '-intercept ' + t(z.b) + '; with ' + t('y') + ' alone, ' + t(opT(z.op)) + ' means the region is <b>' + (up(z.op) ? 'above' : 'below') + '</b> the line.'), text: 'graph y > mx + b' });
  }
  /* which graph: standard form (Q4, EP A4b) — kind 'pos' (Ax + By op C), 'neg' (Ax − By op C), 'origin' (Ax + By op 0), 'moved' (Ax − By + C op 0) */
  function graphStd(r, kind, excl) {
    var z = pickWhere(function () { return { xi: r.int(2, 6), yi: r.int(2, 6), a: nz(r, 1, 4), b: r.int(1, 3), op: r.pick(['lt', 'le', 'gt', 'ge']) }; }, function (s) {
      if (kind === 'origin') return gcd(s.a, s.b) === 1 && !(s.a === 3 && s.b === 1) && !(s.a === 2 && s.b === 5) && !(excl && excl(s));
      return s.xi !== s.yi && !(excl && excl(s));
    });
    var h, show, how, alt = null, altWhy;
    if (kind === 'origin') {
      h = hp(z.a, z.b, 0, z.op); show = lin2(z.a, 'x', z.b, 'y') + OPS[z.op] + '0';
      how = 'The boundary ' + t(lin2(z.a, 'x', z.b, 'y') + '=0') + ' passes through the origin (slope ' + t(vF(-z.a / z.b)) + '), so test a different point.';
      alt = hp(-z.a, z.b, 0, z.op); altWhy = 'That boundary has the wrong slope: ' + t(lin2(z.a, 'x', z.b, 'y') + '=0') + ' has slope ' + t(vF(-z.a / z.b)) + '.';
    } else {
      var xi = z.xi, yi = kind === 'neg' ? -z.yi : z.yi, X = kind === 'moved' ? -z.xi : xi, g = gcd(Math.abs(X), Math.abs(yi));
      // line through (X, 0) and (0, yi): yi·x + X·y = X·yi
      var a0 = yi / g, b0 = X / g, c0 = X * yi / g; if (a0 < 0) { a0 = -a0; b0 = -b0; c0 = -c0; }
      if (kind === 'moved') {
        // a0 x + b0 y − c0 op 0 (b0 < 0 since X < 0 < yi)
        h = hp(a0, b0, c0, z.op); show = lin2(a0, 'x', b0, 'y') + U.sg(-c0) + OPS[z.op] + '0';
      } else { h = hp(a0, b0, c0, z.op); show = stdT(h); }
      how = 'Intercepts ' + t(ptT(X, 0)) + ' and ' + t(ptT(0, yi)) + '.';
      var ga = gcd(Math.abs(yi), Math.abs(X)), aa = X / ga, bb = yi / ga, cc = X * yi / ga; alt = hp(aa, bb, cc, z.op); if (aa < 0) alt = hp(-aa, -bb, -cc, FLIP[z.op]);
      altWhy = 'That line has the intercepts swapped. Find them: put ' + t('y=0') + ' to get the ' + t('x') + '-intercept and ' + t('x=0') + ' for the ' + t('y') + '-intercept.';
    }
    var yf = h.B ? ' (Solving for ' + t('y') + ': ' + t(yT(h)) + (h.B < 0 ? ', the sign reversed' : '') + '.)' : '';
    return whichGraph(r, 'Which graph shows the solution region of ' + t(show) + '?', h, { alt: alt, altWhy: altWhy, sol: solOf(h, how) + yf, text: 'graph Ax + By > C' });
  }
  /* vertical / horizontal boundaries (Q5, EP A4c) */
  function graphVH(r, kind) {
    var z = pickWhere(function () { return { a: nz(r, 1, 5), k: r.pick([2, 3, -2, -3]), op: r.pick(['lt', 'le', 'gt', 'ge']), v: r.pick(['x', 'y']) }; }, function (s) {
      if (kind === 'x') return !(s.a === 4 && s.op === 'le') && !(s.a === -2 && s.op === 'gt');
      if (kind === 'ymove') return !(s.a === -1 && s.op === 'gt') && !(s.a === 1 && s.op === 'le');
      return !(s.k === 2 && s.a === -3 && s.op === 'ge') && !(s.k === 2 && s.a === -2.5);
    });
    var h, show, how;
    if (kind === 'x') { h = hp(1, 0, z.a, z.op); show = 'x' + OPS[z.op] + z.a; how = 'Vertical boundary ' + t('x=' + z.a) + '; the region is to the ' + (up(z.op) ? 'right' : 'left') + '.'; }
    else if (kind === 'ymove') { h = hp(0, 1, -z.a, z.op); show = 'y' + U.sg(z.a) + OPS[z.op] + '0'; how = t('y' + OPS[z.op] + (-z.a)) + ': horizontal boundary ' + t('y=' + (-z.a)) + '; the region is ' + (up(z.op) ? 'above' : 'below') + '.'; }
    else {
      var x0 = z.a, b = -z.k * x0, op2 = z.k > 0 ? z.op : FLIP[z.op];
      h = z.v === 'x' ? hp(1, 0, x0, op2) : hp(0, 1, x0, op2); show = z.k + z.v + U.sg(b) + OPS[z.op] + '0';
      how = t(z.k + z.v + OPS[z.op] + (-b)) + ', so ' + t(z.v + OPS[op2] + x0) + (z.k < 0 ? ' (dividing by a negative reverses the sign)' : '') + ': ' + (z.v === 'x' ? 'vertical boundary ' + t('x=' + x0) + ', region to the ' + (up(op2) ? 'right' : 'left') : 'horizontal boundary ' + t('y=' + x0) + ', region ' + (up(op2) ? 'above' : 'below')) + '.';
    }
    return whichGraph(r, 'Which graph shows the solution region of ' + t(show) + '?', h, { sol: how + ' ' + (strict(h.op) ? 'Dashed' : 'Solid') + ' boundary (' + t(opT(h.op)) + ').', text: 'vertical/horizontal boundary' });
  }
  /* a band a op1 v op2 b (Q5d) */
  function graphBand(r) {
    var z = pickWhere(function () { return { lo: r.int(-5, 2), w: r.int(2, 7), s1: r.chance(0.5), s2: r.chance(0.5), v: r.pick(['x', 'x', 'y']) }; }, function (s) { return s.lo + s.w <= 5 && s.s1 !== s.s2 && !(s.v === 'x' && s.lo === -2 && s.w === 5) && !(s.v === 'y' && s.lo === -3 && s.w === 5); });
    var lo = z.lo, hi = z.lo + z.w, v = z.v, mk = function (c, op) { return v === 'x' ? hp(1, 0, c, op) : hp(0, 1, c, op); };
    var hL = mk(lo, z.s1 ? 'gt' : 'ge'), hH = mk(hi, z.s2 ? 'lt' : 'le'), show = lo + (z.s1 ? '<' : '\\le ') + v + (z.s2 ? '<' : '\\le ') + hi;
    var pic = function (regions, d1, d2) { return regPic({ regions: regions, lines: [{ h: hL, dash: d1 }, { h: hH, dash: d2 }], max: 200 }); };
    var opts = [{ html: pic([[hL, hH]], z.s1, z.s2), right: true },
      { html: pic([[hL, hH]], z.s2, z.s1), why: 'Check each end: ' + t('<') + ' gives a dashed line, ' + t('\\le') + ' a solid one. Here ' + t(v + '=' + lo) + ' is ' + (z.s1 ? 'dashed' : 'solid') + ' and ' + t(v + '=' + hi) + ' is ' + (z.s2 ? 'dashed' : 'solid') + '.' },
      { html: pic([[flipH(hL)], [flipH(hH)]], z.s1, z.s2), why: 'The solutions are <b>between</b> ' + t(lo) + ' and ' + t(hi) + ': both inequalities hold at once.' },
      { html: pic([[hL, hH]], false, false), why: 'One end uses ' + t('<') + ': that boundary is dashed.' }];
    var p = KP.mc(r, 'Which graph shows the solution region of ' + t(show) + '?', opts, 'Both at once: ' + (z.s1 ? 'dashed' : 'solid') + ' ' + t(v + '=' + lo) + ', ' + (z.s2 ? 'dashed' : 'solid') + ' ' + t(v + '=' + hi) + '; shade the band between them.', ['A compound inequality means both parts hold: the region between the two lines.', t('<') + ' gives a dashed line; ' + t('\\le') + ' a solid one.'], 'a band');
    p.input.columns = 2;
    return p;
  }

  /* Q6 — Maya forgot to reverse the sign */
  function mayaShared(r) {
    return pickWhere(function () { return { B: r.int(2, 5), m: nz(r, 1, 4), n: nz(r, 1, 5), op: r.pick(['lt', 'le', 'gt', 'ge']), who: r.pick(['Maya', 'Liam', 'Priya', 'Owen']) }; }, function (z) { return !(z.B === 2 && z.m === 3 && z.n === 4); });
  }
  function mayaH(o) { return hp(o.B * o.m, -o.B, o.B * o.n, o.op); }
  function mayaStem(o) { var h = mayaH(o); return o.who + ' graphed ' + t(stdT(h)) + ' by rewriting it as ' + t('y' + OPS[o.op] + lf(o.m, -o.n)) + ' and shading ' + (up(o.op) ? 'above' : 'below') + ' a ' + (strict(o.op) ? 'dashed' : 'solid') + ' line.'; }
  function mayaA(r, o) {
    var h = mayaH(o), op2 = FLIP[o.op], key = 'y' + OPS[op2] + lf(o.m, -o.n);
    var sol = t('-' + o.B + 'y' + OPS[o.op] + lf(-o.B * o.m, o.B * o.n)) + '; dividing by ' + t(-o.B) + ' <b>reverses</b> the sign: ' + t(key) + '. ' + o.who + ' forgot to reverse it, so the wrong side was shaded. (The ' + (strict(o.op) ? 'dashed' : 'solid') + ' line is correct.)';
    return ineqP('Explain the error, and write the correct inequality with ' + t('y') + ' alone on the left.', h, key, { rev: true, yForm: true, sideHint: 'Dividing both sides by a negative number reverses the inequality sign — that is the error.' }, sol, ['Isolate ' + t('-' + o.B + 'y') + ', then divide by ' + t(-o.B) + '.', 'Dividing by a negative number reverses the sign.'], 'the reversed sign');
  }
  function mayaB(r, o) {
    var h = mayaH(o), tv = holds(-h.C, h.op), oAbove = o.n > 0, side = function (withO) { return withO ? (oAbove ? 'above' : 'below') : (oAbove ? 'below' : 'above'); }, z = '\\(0' + OPS[o.op] + nT(h.C) + '\\)';
    var opt = function (truth, withO) { return { html: z + ' is ' + (truth ? 'true' : 'false') + ', so shade the side ' + (withO ? 'with' : 'without') + ' the origin: ' + side(withO) + ' the line.', right: truth === tv && withO === tv, why: truth !== tv ? 'Substitute ' + t('(0,\\ 0)') + ' carefully: ' + t('0' + OPS[o.op] + nT(h.C)) + ' is ' + (tv ? 'true' : 'false') + '.' : 'If the test point makes the inequality ' + (tv ? 'true, shade its side' : 'false, shade the other side') + '.' }; };
    return mcP(r, 'Use the test point ' + t('(0,\\ 0)') + ' in ' + t(stdT(h)) + ' to decide which side should be shaded.', [opt(true, true), opt(true, false), opt(false, true), opt(false, false)],
      'Test ' + t('(0,\\ 0)') + ' in the original: ' + t('0' + OPS[o.op] + nT(h.C)) + ' is ' + (tv ? 'true' : 'false') + '. The origin is ' + (oAbove ? 'above' : 'below') + ' the line (the ' + t('y') + '-intercept is ' + t(-o.n) + '), so shade ' + side(tv) + '.', ['Substitute ' + t('x=0') + ', ' + t('y=0') + ' into the original inequality.'], 'test point');
  }

  /* write the inequality from its graph (Q7, EP B1): kind 'negFrac' | 'int' | 'origin' | 'posFrac' | 'negInt' */
  function writeGraph(r, kind, excl) {
    var z = pickWhere(function () {
      var q = kind === 'int' || kind === 'negInt' ? r.pick([1, 1, 2]) : r.pick([2, 3, 4]), p = kind === 'negFrac' || kind === 'negInt' ? -r.int(1, 4) : r.int(1, 4);
      if (kind === 'int' || kind === 'negInt') p = p * q;
      return { p: p, q: q, b: kind === 'origin' ? 0 : nz(r, 1, 4), op: r.pick(['lt', 'le', 'gt', 'ge']) };
    }, function (s) {
      if ((kind === 'negFrac' || kind === 'posFrac' || kind === 'origin') && (s.p % s.q === 0 || gcd(s.p, s.q) !== 1)) return false;
      var y2 = s.b + s.p; return Math.abs(y2) <= 6 && Math.abs(s.q) <= 6 && !(excl && excl(s));
    });
    var m = cl(z.p / z.q), b = z.b, h = hp(-m, 1, b, z.op), pts = [[0, b], [z.q, b + z.p]];
    var svg = regPic({ regions: [[h]], lines: [{ h: h, dash: strict(z.op) }], points: pts, max: 240 });
    var key = 'y' + OPS[z.op] + lf(m, b), wr = [];
    if (Math.abs(z.p) !== Math.abs(z.q)) wr.push({ T: P.sub(M(1, 'y', 1), P.add(M(z.q / z.p, 'x', 1), M(b))), code: CP + 'reg-slope', hint: 'Slope is rise over run: ' + t('m=\\dfrac{\\Delta y}{\\Delta x}') + '.' });
    wr.push({ T: P.sub(M(1, 'y', 1), P.add(M(-m, 'x', 1), M(b))), code: CP + 'reg-bound', hint: 'Check the sign of the slope: the line ' + (m > 0 ? 'rises' : 'falls') + ' from left to right.' });
    var sol = 'Through ' + t(ptT(pts[0][0], pts[0][1])) + ' and ' + t(ptT(pts[1][0], pts[1][1])) + ': ' + t('m=\\dfrac{' + nT(pts[1][1]) + '-' + par(b) + '}{' + z.q + '-0}=' + vF(m)) + ', ' + t('b=' + b) + '.<br>' + (strict(z.op) ? 'Dashed' : 'Solid') + ', shaded ' + (up(z.op) ? 'above' : 'below') + ': ' + t(key) + '.';
    return ineqP('Write the inequality whose solution region is shown. The marked points are on the boundary.' + fig(svg), h, key, { wrongs: wr, sideHint: 'Right boundary, but the inequality points the wrong way: the shaded region is ' + (up(z.op) ? 'above' : 'below') + ' the line.' }, sol,
      ['Find the slope and ' + t('y') + '-intercept of the boundary from the marked points.', 'Dashed → ' + t('<') + ' or ' + t('>') + '; solid → ' + t('\\le') + ' or ' + t('\\ge') + '. With ' + t('y') + ' alone: shaded above → ' + t('>') + ' or ' + t('\\ge') + '.'], 'inequality from a graph');
  }
  /* the inequality described in words (Q8): 'int' — intercepts, solid, contains the origin; 'two' — dashed through two points, not containing the origin; EP B2 'below' — solid through two points, region below */
  function writeWords(r, kind) {
    var z, m, b, op, prompt, sol, solid, regionUp;
    if (kind === 'int') {
      z = pickWhere(function () { return { a: nz(r, 2, 6), bb: nz(r, 2, 6), solid: r.chance(0.75), org: r.chance(0.75) }; }, function (s) { return Math.abs(s.a) !== Math.abs(s.bb) && !(s.a === -4 && s.bb === 6); });
      m = cl(-z.bb / z.a); b = z.bb; solid = z.solid; var oBelow = b > 0; regionUp = z.org ? !oBelow : oBelow;
      prompt = 'The boundary line is ' + (solid ? 'solid' : 'dashed') + ' with ' + t('x') + '-intercept ' + t(z.a) + ' and ' + t('y') + '-intercept ' + t(z.bb) + ', and the solution region ' + (z.org ? 'contains' : 'does <b>not</b> contain') + ' the origin. Determine the inequality.';
      sol = 'Slope ' + t('\\dfrac{' + z.bb + '-0}{0-' + par(z.a) + '}=' + vF(m)) + ': ' + t('y=' + lf(m, b)) + '. The origin is ' + (oBelow ? 'below' : 'above') + ' the line (' + t('0' + (oBelow ? '<' : '>') + b) + '), so the region is ' + (regionUp ? 'above' : 'below') + '.';
    } else {
      z = pickWhere(function () { return { x1: r.int(-4, 3), y1: r.int(-5, 6), dx: r.int(1, 4), m: r.pick([-3, -2, -1, 1, 2, 3, 0.5, -0.5, 1.5]), solid: kind === 'below' ? r.chance(0.6) : r.chance(0.3), org: r.chance(0.5), below: r.chance(0.6) }; }, function (s) {
        var x2 = s.x1 + s.dx, y2 = s.y1 + s.m * s.dx, bb = s.y1 - s.m * s.x1; return isInt(y2) && Math.abs(y2) <= 8 && bb !== 0 && s.x1 !== 0 && x2 !== 0 && s.y1 !== 0 && isInt(bb * 2) && !(s.x1 === -1 && s.y1 === 5 && x2 === 3) && !(s.x1 === -4 && s.y1 === -1 && x2 === 2);
      });
      m = z.m; b = cl(z.y1 - z.m * z.x1); solid = z.solid; var x2 = z.x1 + z.dx, y2 = cl(z.y1 + z.m * z.dx);
      if (kind === 'two') { regionUp = z.org ? b < 0 : b > 0; prompt = 'The boundary line is ' + (solid ? 'solid' : 'dashed') + ' and passes through ' + t(ptT(z.x1, z.y1)) + ' and ' + t(ptT(x2, y2)) + ', and the solution region ' + (z.org ? 'contains' : 'does <b>not</b> contain') + ' the origin. Determine the inequality.'; }
      else { regionUp = !z.below; prompt = 'The boundary of a solution region is a ' + (solid ? 'solid' : 'dashed') + ' line through ' + t(ptT(z.x1, z.y1)) + ' and ' + t(ptT(x2, y2)) + ', and the region lies ' + (regionUp ? 'above' : 'below') + ' the line. Write the inequality.'; }
      sol = t('m=\\dfrac{' + nT(y2) + '-' + par(z.y1) + '}{' + x2 + '-' + par(z.x1) + '}=' + vF(m)) + '; ' + t('y-' + par(z.y1) + '=' + vF(m) + '(x-' + par(z.x1) + ')\\Rightarrow y=' + lf(m, b)) + '.' + (kind === 'two' ? ' The origin is ' + (b > 0 ? 'below' : 'above') + ' the line (' + t('0' + (b > 0 ? '<' : '>') + vF(b)) + '), so the region is ' + (regionUp ? 'above' : 'below') + '.' : '');
    }
    op = solid ? (regionUp ? 'ge' : 'le') : (regionUp ? 'gt' : 'lt');
    var h = hp(-m, 1, b, op), key = 'y' + OPS[op] + lf(m, b);
    sol += ' ' + (solid ? 'Solid' : 'Dashed') + ', ' + (regionUp ? 'above' : 'below') + ': ' + t(key) + '.';
    return ineqP(prompt, h, key, { wrongs: [{ T: P.sub(M(1, 'y', 1), P.add(M(-m, 'x', 1), M(b))), code: CP + 'reg-bound', hint: 'Check the sign of the slope.' }], sideHint: kind === 'below' ? 'Right boundary, but the inequality points the wrong way: the region is ' + (regionUp ? 'above' : 'below') + ' the line.' : 'Right boundary, but the inequality points the wrong way: test the origin.' }, sol,
      ['Find the equation of the boundary line first.', 'Solid → ' + t('\\le') + ' or ' + t('\\ge') + '; dashed → ' + t('<') + ' or ' + t('>') + '. Use the origin (or above/below) to choose the direction.'], 'inequality from a description');
  }

  /* Q9 — two inequalities: the overlap, where the boundaries meet, and whether that point is in the region */
  function sysShared(r) {
    return pickWhere(function () { return { x0: r.int(-3, 3), y0: r.int(-3, 3), A1: nz(r, 1, 2), B1: nz(r, 1, 2), m2: r.pick([1, -1, 2, -2, 0.5, -0.5, 3]), op1: r.pick(['le', 'ge', 'lt', 'gt']), op2: r.pick(['lt', 'gt', 'le', 'ge']) }; }, function (z) {
      if (gcd(z.A1, z.B1) !== 1 || Math.abs(-z.A1 / z.B1 - z.m2) < 1e-9) return false;
      var b2 = z.y0 - z.m2 * z.x0, C1 = z.A1 * z.x0 + z.B1 * z.y0; return isInt(b2) && Math.abs(b2) <= 5 && Math.abs(C1) <= 8 && !(z.A1 === 1 && z.B1 === 1 && C1 === 4 && z.m2 === 1 && b2 === -2);
    });
  }
  function sysH(o) { var b2 = o.y0 - o.m2 * o.x0; return [hp(o.A1, o.B1, o.A1 * o.x0 + o.B1 * o.y0, o.op1), hp(-o.m2, 1, b2, o.op2)]; }
  function sysStem(o) { var H = sysH(o); return 'Two inequalities must both hold: ' + t(stdT(H[0])) + ' and ' + t(yT(H[1])) + '.'; }
  function sysA(r, o) {
    var H = sysH(o), lines = [{ h: H[0], dash: strict(H[0].op) }, { h: H[1], dash: strict(H[1].op) }];
    var pic = function (a, b) { return regPic({ regions: [[a, b]], lines: lines, max: 200 }); };
    var p = KP.mc(r, 'Which graph shows the region that satisfies both inequalities?', [
      { html: pic(H[0], H[1]), right: true }, { html: pic(flipH(H[0]), H[1]), why: 'Check the side of ' + t(stdT(H[0])) + ': ' + testSent(H[0]) },
      { html: pic(H[0], flipH(H[1])), why: 'Check the side of ' + t(yT(H[1])) + ': ' + testSent(H[1]) }, { html: pic(flipH(H[0]), flipH(H[1])), why: 'Both sides are wrong: test a point in each inequality.' }],
      t(stdT(H[0])) + ': ' + (strict(H[0].op) ? 'dashed' : 'solid') + '; ' + testSent(H[0]) + '<br>' + t(yT(H[1])) + ': ' + (strict(H[1].op) ? 'dashed' : 'solid') + ', shade ' + (up(H[1].op) ? 'above' : 'below') + '.<br>The solution is where the shadings overlap.', ['Graph each inequality on its own (boundary, then a test point).', 'The solution region is the overlap of the two shadings.'], 'system: which graph');
    p.input.columns = 2;
    return p;
  }
  function sysB(r, o) {
    var H = sysH(o), b2 = H[1].C;
    var sol = 'Solve ' + t(lin2(o.A1, 'x', o.B1, 'y') + '=' + H[0].C) + ' and ' + t('y=' + lf(o.m2, b2)) + ': ' + t(lin2(o.A1, 'x', o.B1, '(' + lf(o.m2, b2) + ')') + '=' + H[0].C) + ', so ' + t('x=' + o.x0) + ' and ' + t('y=' + o.y0) + '. The boundaries meet at ' + t(ptT(o.x0, o.y0)) + '.';
    return U.pairsP(CP, 'State the point where the boundary lines meet.', [{ x: o.x0, y: o.y0 }], {}, sol, ['Replace both signs with ' + t('=') + ' and solve the linear system by substitution.'], 'where the boundaries meet');
  }
  function sysC(r, o) {
    var H = sysH(o), inc = !strict(H[0].op) && !strict(H[1].op), dl = strict(H[0].op) ? stdT(H[0]) : yT(H[1]);
    return mcP(r, 'Is the point where the boundary lines meet, ' + t(ptT(o.x0, o.y0)) + ', in the solution region?', [
      { html: 'Yes: it is on both solid boundaries, so it satisfies both inequalities.', right: inc, why: inc ? null : 'Check each sign: a point on a <b>dashed</b> line fails the strict inequality.' },
      { html: 'No: it is on a dashed boundary, so it fails a strict inequality.', right: !inc, why: !inc ? null : 'Both boundaries are solid (' + t('\\le') + ' or ' + t('\\ge') + '): points on them are included.' },
      { html: 'Yes: a corner of a region is always included.', why: 'Not always: a corner on a dashed line is not included.' },
      { html: 'No: a corner of a region is never included.', why: 'A corner on two solid lines is included.' }],
      inc ? 'Both boundaries are solid, so ' + t(ptT(o.x0, o.y0)) + ' (on both) satisfies both inequalities: it is in the region.' : t(ptT(o.x0, o.y0)) + ' is on the dashed boundary of ' + t(dl) + ', so that strict inequality is false there (both sides are equal): it is <b>not</b> in the region.',
      ['Substitute the point into each inequality: is each statement true?'], 'is the corner included?', true);
  }

  /* Q10 / EP B3 — a budget (at most) or a goal (at least) with two prices; g = common factor */
  var CTX = {
    le: [{ s: 'A club has at most %M for a party. Pizzas cost %P each and veggie trays %Q each.', u: 'p', w: 'v', U: 'pizzas', W: 'trays' }, { s: 'A class has at most %M to spend on art supplies. Paint sets cost %P each and sketchbooks %Q each.', u: 'p', w: 's', U: 'paint sets', W: 'sketchbooks' }],
    ge: [{ s: 'A team raises money by washing cars for %P and dogs for %Q. Its goal is at least %M.', u: 'c', w: 'd', U: 'cars', W: 'dogs' }, { s: 'A band sells T-shirts for %P and posters for %Q. It needs to take in at least %M.', u: 't', w: 'p', U: 'T-shirts', W: 'posters' }]
  };
  function budShared(r, dir) {
    return pickWhere(function () { return { g: r.pick([2, 3, 4, 5, 6, 8]), a: r.int(1, 5), b: r.int(1, 5), k: r.int(2, 8), c: r.int(0, 1) }; }, function (z) {
      return z.a !== z.b && gcd(z.a, z.b) === 1 && z.a * z.k <= 30 && z.b * z.k <= 30 && z.b * z.k >= 6 && z.a * z.k >= 6 && !(z.g === 8 && z.a === 2 && z.b === 3 && z.k === 5) && !(z.g === 4 && z.a === 2 && z.b === 3 && z.k === 20);
    });
  }
  function budV(o, dir) { var C = CTX[dir][o.c], c = o.a * o.b * o.k; return { C: C, c: c, P1: o.g * o.a, P2: o.g * o.b, Mn: o.g * c, X: o.b * o.k, Y: o.a * o.k }; }
  function budStem(o, dir) { var v = budV(o, dir); return v.C.s.replace('%M', t('\\$' + v.Mn)).replace('%P', t('\\$' + v.P1)).replace('%Q', t('\\$' + v.P2)) + ' Let ' + t(v.C.u) + ' be the number of ' + v.C.U + ' and ' + t(v.C.w) + ' the number of ' + v.C.W + '.'; }
  function budH(o, dir) { var v = budV(o, dir); return hp(o.a, o.b, v.c, dir); }
  function budA(r, o, dir) {
    var v = budV(o, dir), h = budH(o, dir), key = lin2(o.a, v.C.u, o.b, v.C.w) + OPS[dir] + v.c;
    return ineqP('Write an inequality for the situation, in simplest form. (The restrictions are ' + t(v.C.u + '\\ge 0') + ', ' + t(v.C.w + '\\ge 0') + ', whole numbers.)', h, key, { vars: [v.C.u, v.C.w], simplest: true, ph: o.a + v.C.u + ' + ' + o.b + v.C.w + (dir === 'le' ? ' <= ' : ' >= ') + v.c, example: key },
      t(lin2(v.P1, v.C.u, v.P2, v.C.w) + OPS[dir] + v.Mn) + '; divide by ' + t(o.g) + ': ' + t(key) + '; ' + t(v.C.u + '\\ge 0') + ', ' + t(v.C.w + '\\ge 0') + ', whole numbers.', ['Cost (or money raised) = price × number, added for both items.', '“At most” is ' + t('\\le') + '; “at least” is ' + t('\\ge') + '. Then divide by the common factor.'], 'context inequality');
  }
  function budB(r, o, dir) {
    var v = budV(o, dir), h = budH(o, dir), fq = [hp(1, 0, 0, 'ge'), hp(0, 1, 0, 'ge')], W = { x: [0, Math.ceil(Math.max(v.X, v.Y) * 1.3 / 2) * 2], fq: fq, xName: v.C.u, yName: v.C.w };
    W.y = W.x;
    var alt = hp(o.b, o.a, v.c, dir);
    return whichGraph(r, 'Which graph shows the solution region (with the restrictions)?', h, { x: W.x, y: W.y, fq: fq, xName: v.C.u, yName: v.C.w, alt: alt, altWhy: 'The intercepts are swapped: with ' + t(v.C.w + '=0') + ', ' + t(v.C.u + '=' + v.X) + '.',
      sol: 'Intercepts ' + t(ptT(v.X, 0)) + ' and ' + t(ptT(0, v.Y)) + '; solid. Test ' + t('(0,\\ 0)') + ': ' + t('0' + OPS[dir] + v.c) + ' is ' + (dir === 'le' ? 'true, so shade toward the origin' : 'false, so shade away from the origin') + ', in the first quadrant only.', text: 'context: which graph' });
  }
  function budC(r, o) {
    var v = budV(o, 'le'), cs = r.pick(['on', 'in', 'out']), pt = pickWhere(function () { var x = r.int(1, v.X - 1); return [x, r.int(1, v.Y)]; }, function (q) { var s = o.a * q[0] + o.b * q[1]; return cs === 'on' ? s === v.c : cs === 'in' ? s < v.c && s >= v.c - 3 * o.b : s > v.c && s <= v.c + 2 * o.b; });
    var cost = v.P1 * pt[0] + v.P2 * pt[1], M0 = '\\$' + v.Mn;
    return mcP(r, 'Can it buy ' + t(pt[0]) + ' ' + v.C.U + ' and ' + t(pt[1]) + ' ' + v.C.W + '?', [
      { html: 'Yes: it costs exactly ' + t(M0) + ', a point on the solid boundary.', right: cs === 'on', why: 'Work out the cost: ' + t(v.P1 + '(' + pt[0] + ')+' + v.P2 + '(' + pt[1] + ')=' + cost) + '.' },
      { html: 'Yes: it costs less than ' + t(M0) + '.', right: cs === 'in', why: 'Work out the cost: ' + t(v.P1 + '(' + pt[0] + ')+' + v.P2 + '(' + pt[1] + ')=' + cost) + '.' },
      { html: 'No: it costs more than ' + t(M0) + '.', right: cs === 'out', why: 'Work out the cost: ' + t(v.P1 + '(' + pt[0] + ')+' + v.P2 + '(' + pt[1] + ')=' + cost) + '.' },
      { html: 'No: it costs exactly ' + t(M0) + ', and points on the boundary are not included.', why: '“At most” is ' + t('\\le') + ': the boundary is solid, so spending exactly ' + t(M0) + ' is allowed.' }],
      t(o.a + '(' + pt[0] + ')+' + o.b + '(' + pt[1] + ')=' + (o.a * pt[0] + o.b * pt[1])) + (cs === 'on' ? '=' + v.c + ': yes, it costs exactly ' + t(M0) + ' (a point on the solid line).' : cs === 'in' ? '<' + v.c + ': yes, it costs ' + t('\\$' + cost) + '.' : '>' + v.c + ': no, it would cost ' + t('\\$' + cost) + '.'),
      ['Substitute the two numbers into the inequality.'], 'is this combination possible?', true);
  }
  function budD(r, o, dir) {
    var v = budV(o, dir), n = pickWhere(function () { return r.int(1, (dir === 'le' ? v.X : v.Y) - 1); }, function (x) { return dir === 'le' ? (v.c - o.a * x) % o.b !== 0 || r.chance(0.25) : (v.c - o.b * x) % o.a !== 0 || r.chance(0.25); });
    var rest, q, ans, other, prompt, sol;
    if (dir === 'le') {
      rest = v.c - o.a * n; q = rest / o.b; ans = Math.floor(q + 1e-9); other = Math.ceil(q - 1e-9);
      prompt = 'With ' + t(n) + ' ' + v.C.U + ', what is the greatest number of ' + v.C.W + '?';
      sol = t(o.a + '(' + n + ')+' + o.b + v.C.w + '\\le ' + v.c + '\\Rightarrow ' + (o.b === 1 ? '' : o.b) + v.C.w + '\\le ' + rest + '\\Rightarrow ' + v.C.w + '\\le ' + vD(q)) + '. Whole numbers: at most <b>' + ans + '</b> ' + v.C.W + '.';
    } else {
      rest = v.c - o.b * n; q = rest / o.a; ans = Math.ceil(q - 1e-9); other = Math.floor(q + 1e-9);
      prompt = 'If it sells (or washes) ' + t(n) + ' ' + v.C.W + ', what is the least number of ' + v.C.U + ' needed?';
      prompt = 'With ' + t(n) + ' ' + v.C.W + ', what is the least number of ' + v.C.U + ' needed to reach the goal?';
      sol = t(o.a === 1 ? v.C.u : o.a + v.C.u) + '+' + t(o.b + '(' + n + ')\\ge ' + v.c) + ', so ' + t((o.a === 1 ? '' : o.a) + v.C.u + '\\ge ' + rest + '\\Rightarrow ' + v.C.u + '\\ge ' + vD(q)) + '. Whole numbers: at least <b>' + ans + '</b> ' + v.C.U + '.';
    }
    return numP(prompt, ans, { cands: other !== ans ? [[other, CP + 'ctx-round', dir === 'le' ? 'With ' + t(other) + ' it would go over the budget: round <b>down</b>.' : 'With ' + t(other) + ' it would not reach the goal: round <b>up</b>.']] : [], sol: sol,
      hints: ['Substitute the known number into the inequality and solve for the other variable.', 'The answer must be a whole number: decide whether to round up or down.'], text: 'context: whole numbers' });
  }

  /* Q11 — fitness class: capacity and money */
  function fitShared(r) {
    return pickWhere(function () { return { N: r.pick([30, 36, 40, 45, 50, 60]), pm: r.pick([5, 6, 8, 9, 10]), pd: r.pick([12, 14, 15, 16, 18, 20]), m0: r.int(5, 50) }; }, function (z) {
      var T = z.pm * z.m0 + z.pd * (z.N - z.m0); return z.m0 < z.N - 4 && z.pd > z.pm && T % z.pd === 0 && T / z.pd < z.N && !(z.N === 40 && z.pm === 8 && z.pd === 12 && z.m0 === 30);
    });
  }
  function fitV(o) { var T = o.pm * o.m0 + o.pd * (o.N - o.m0); return { T: T, d0: o.N - o.m0, dmin: T / o.pd }; }
  function fitStem(o) { var v = fitV(o); return 'A fitness class has room for at most ' + t(o.N) + ' people. Members pay ' + t('\\$' + o.pm) + ' and drop-ins pay ' + t('\\$' + o.pd) + ', and the instructor needs at least ' + t('\\$' + v.T) + ' per class. Let ' + t('m') + ' be the number of members and ' + t('d') + ' the number of drop-ins.'; }
  function fitA(r, o) {
    var v = fitV(o), h1 = hp(1, 1, o.N, 'le'), h2 = hp(o.pm, o.pd, v.T, 'ge'), V = { vars: ['m', 'd'] };
    var c1 = ineqChk(h1, V), c2 = ineqChk(h2, V), lab = ['People', 'Money'];
    var chk = function (resp) {
      resp = resp || []; var a = [c1(resp[0] || ''), c2(resp[1] || '')];
      if (a[0].v === 'correct' && a[1].v === 'correct') return ok();
      var sw = [c2(resp[0] || ''), c1(resp[1] || '')]; if (sw[0].v === 'correct' && sw[1].v === 'correct') return ok();
      for (var i = 0; i < 2; i++) if (a[i].v !== 'correct') return { v: a[i].v, code: a[i].v === 'wrong' ? (a[i].code === 'value' ? CP + 'sys' : a[i].code) : a[i].code, hint: '<b>' + lab[i] + ':</b> ' + (a[i].hint || 'Check this inequality.') };
      return ok();
    };
    var g = gcd(o.pm, gcd(o.pd, v.T));
    return { prompt: 'Write a system of inequalities for the situation. (The restrictions are ' + t('m\\ge 0') + ', ' + t('d\\ge 0') + ', whole numbers.)',
      input: { type: 'fields', fields: [{ label: 'People:', name: 'People', mode: 'math', keys: 'u8ineq', vars: ['m', 'd'], placeholder: 'e.g. m + d <= 40' }, { label: 'Money:', name: 'Money', mode: 'math', keys: 'u8ineq', vars: ['m', 'd'], placeholder: 'e.g. 8m + 12d >= 360' }] },
      check: chk, key: ['m+d\\le ' + o.N, lin2(o.pm, 'm', o.pd, 'd') + '\\ge ' + v.T], answer: t('m+d\\le ' + o.N) + ', ' + t(lin2(o.pm, 'm', o.pd, 'd') + '\\ge ' + v.T) + (g > 1 ? ' (or ' + t(lin2(o.pm / g, 'm', o.pd / g, 'd') + '\\ge ' + v.T / g) + ')' : ''),
      solution: 'People: ' + t('m+d\\le ' + o.N) + '. Money: ' + t(lin2(o.pm, 'm', o.pd, 'd') + '\\ge ' + v.T) + (g > 1 ? ' (or ' + t(lin2(o.pm / g, 'm', o.pd / g, 'd') + '\\ge ' + v.T / g) + ')' : '') + '. Restrictions ' + t('m\\ge 0') + ', ' + t('d\\ge 0') + ', whole numbers.',
      hints: ['“At most” is ' + t('\\le') + '; “at least” is ' + t('\\ge') + '.', 'Money = price × number for each kind of person, added.'], text: 'context: system', bad: [['m+d<' + o.N, lin2(o.pm, 'm', o.pd, 'd') + '\\ge ' + v.T], ['m+d\\le ' + o.N, lin2(o.pm, 'm', o.pd, 'd') + '\\le ' + v.T]] };
  }
  function fitB(r, o) {
    var v = fitV(o), pts = [{ x: 0, y: v.dmin }, { x: 0, y: o.N }, { x: o.m0, y: v.d0 }];
    var svg = regPic({ x: [0, Math.ceil(o.N * 1.25 / 10) * 10], y: [0, Math.ceil(o.N * 1.25 / 10) * 10], regions: [[hp(1, 1, o.N, 'le'), hp(o.pm, o.pd, v.T, 'ge'), hp(1, 0, 0, 'ge')]], lines: [{ h: hp(1, 1, o.N, 'le') }, { h: hp(o.pm, o.pd, v.T, 'ge') }], xName: 'm', yName: 'd', max: 260 });
    var sol = 'Corners on the ' + t('d') + '-axis: ' + t('m+d=' + o.N) + ' gives ' + t(ptT(0, o.N)) + '; ' + t(lin2(o.pm, 'm', o.pd, 'd') + '=' + v.T) + ' gives ' + t(ptT(0, v.dmin)) + '.<br>The lines meet where ' + t(o.pm + 'm+' + o.pd + '(' + o.N + '-m)=' + v.T) + ': ' + t((o.pd - o.pm) + 'm=' + (o.pd * o.N - v.T)) + ', ' + t('m=' + o.m0) + ', ' + t('d=' + v.d0) + '.<br>Corners ' + t(ptT(0, v.dmin)) + ', ' + t(ptT(0, o.N)) + ', ' + t(ptT(o.m0, v.d0)) + '.';
    return U.pairsP(CP, 'The solution region is shown. Determine its three corners, as ' + t('(m,\\ d)') + '.' + fig(svg), pts, { wrongs: [{ pts: [[0, v.dmin], [0, o.N]], code: CP + 'sys-missing', hint: 'There is a third corner where the two slanted boundaries meet: solve them together.' }] }, sol,
      ['Two corners are on the ' + t('d') + '-axis (put ' + t('m=0') + ' in each boundary).', 'The third is where the boundaries meet: solve ' + t('m+d=' + o.N) + ' and ' + t(lin2(o.pm, 'm', o.pd, 'd') + '=' + v.T) + ' together.'], 'corners of a region');
  }
  function fitC(r, o) {
    var v = fitV(o), cs = r.pick(['money', 'money', 'cap', 'ok', 'both']);
    var pt = pickWhere(function () { return [r.int(0, o.N + 5), r.int(0, o.N)]; }, function (q) { var cap = q[0] + q[1] <= o.N, mon = o.pm * q[0] + o.pd * q[1] >= v.T; return cs === 'money' ? cap && !mon && q[0] + q[1] >= o.N - 8 : cs === 'cap' ? !cap && mon && q[0] + q[1] <= o.N + 5 : cs === 'ok' ? cap && mon && !(q[0] === o.m0 && q[1] === v.d0) : !cap && !mon; });
    var n = pt[0] + pt[1], money = o.pm * pt[0] + o.pd * pt[1];
    var sol = 'People: ' + t(pt[0] + '+' + pt[1] + '=' + n + (n <= o.N ? '\\le ' : '>') + o.N) + (n <= o.N ? ' ✓' : ' ✗') + '. Money: ' + t(o.pm + '(' + pt[0] + ')+' + o.pd + '(' + pt[1] + ')=' + money + (money >= v.T ? '\\ge ' : '<') + v.T) + (money >= v.T ? ' ✓' : ' ✗') + '.';
    return mcP(r, 'Is a class with ' + t(pt[0]) + ' members and ' + t(pt[1]) + ' drop-ins acceptable?', [
      { html: 'Yes: both conditions hold.', right: cs === 'ok' }, { html: 'No: too many people.', right: cs === 'cap' }, { html: 'No: not enough money.', right: cs === 'money' }, { html: 'No: too many people and not enough money.', right: cs === 'both' }].map(function (q) { if (!q.right) q.why = 'Check both conditions: ' + sol; return q; }),
      sol, ['Substitute the numbers into both inequalities.'], 'is this class acceptable?', true);
  }
  function fitD(r, o) {
    var v = fitV(o);
    return numP('What is the greatest number of members the class can have?', o.m0, { cands: [[v.d0, CP + 'ctx-corner', 'That is the number of drop-ins at the corner. The question asks for members.'], [o.N, 'value', 'With ' + t(o.N) + ' members the money is ' + t('\\$' + o.pm * o.N) + ': not enough.']],
      sol: 'The most members is at the corner ' + t(ptT(o.m0, v.d0)) + ': ' + t(o.pm + 'm+' + o.pd + '(' + o.N + '-m)=' + v.T + '\\Rightarrow m=' + o.m0) + '. At most <b>' + o.m0 + '</b> members (with ' + v.d0 + ' drop-ins).',
      hints: ['More members means less money per person: the most members is at a corner of the region.'], text: 'context: corner' });
  }

  /* Q12 / EP B4 — which point is (not) in the region (multiple choice) */
  function ptMC(r, notIn, excl) {
    var z = pickWhere(function () { return { A: r.int(1, 5), B: r.int(1, 5), x0: r.int(-3, 4), y0: r.int(-3, 3), op: notIn ? r.pick(['le', 'ge']) : r.pick(['lt', 'gt']) }; }, function (s) { s.C = s.A * s.x0 - s.B * s.y0; return gcd(s.A, s.B) === 1 && s.C !== 0 && Math.abs(s.C) <= 15 && !(excl && excl(s)); });
    var h = hp(z.A, -z.B, z.C, z.op), on = [[z.x0, z.y0]];
    if (!notIn) { var q = [z.x0 + z.B, z.y0 + z.A]; if (Math.abs(q[0]) <= 7 && Math.abs(q[1]) <= 7) on.push(q); }
    var pts = pickWhere(function () { var L = on.slice(); while (L.length < 4) L.push([r.int(-4, 5), r.int(-5, 5)]); return L; }, function (L) {
      var keys = L.map(function (p) { return p.join(','); }); if (keys.some(function (k, i) { return keys.indexOf(k) !== i; })) return false;
      var rest = L.slice(on.length); if (rest.some(function (p) { return Math.abs(z.A * p[0] - z.B * p[1] - z.C) < 1e-9; })) return false;
      var good = rest.filter(function (p) { return inH(h, p[0], p[1]); }).length; return notIn ? good === rest.length - 1 : good === 1;
    });
    var val = function (p) { return z.A * p[0] - z.B * p[1]; };
    var opts = pts.map(function (p, i) {
      var isIn = inH(h, p[0], p[1]), right = notIn ? !isIn : isIn;
      return { html: t(ptT(p[0], p[1])), right: right, why: right ? null : i < on.length ? 'That point is on the boundary (' + t(nT(val(p)) + '=' + z.C) + '). ' + (strict(z.op) ? 'The boundary is dashed, so it is not a solution.' : 'The boundary is solid, so it is a solution.') : t(nT(val(p)) + OPS[z.op] + z.C) + ' is ' + (isIn ? 'true' : 'false') + '.' };
    });
    var sol = pts.map(function (p) { return t(ptT(p[0], p[1])) + ': ' + t(nT(val(p)) + OPS[z.op] + z.C) + ' is ' + (inH(h, p[0], p[1]) ? 'true' : 'false'); }).join('; ') + '.';
    return mcP(r, '<i>(Multiple Choice)</i> The point that is ' + (notIn ? '<b>not</b> ' : '') + 'in the solution region of ' + t(stdT(h)) + ' is', opts, sol, ['Substitute each point. A point on the boundary counts only for ' + t('\\le') + ' or ' + t('\\ge') + '.'], notIn ? 'MC: point not in the region' : 'MC: point in the region');
  }
  /* Q13 — the graph shows the region of… (multiple choice) */
  function graphIsMC(r) {
    var z = pickWhere(function () { return { xi: nz(r, 2, 5), yi: nz(r, 2, 5), op: r.pick(['lt', 'gt']) }; }, function (s) { return Math.abs(s.xi) !== Math.abs(s.yi) && !(s.xi === -3 && s.yi === 2); });
    var g = gcd(z.xi, z.yi), a = z.yi / g, b = z.xi / g, c = z.xi * z.yi / g; if (a < 0) { a = -a; b = -b; c = -c; }
    var h = hp(a, b, c, z.op), svg = regPic({ regions: [[h]], lines: [{ h: h, dash: true }], points: [[z.xi, 0], [0, z.yi]], max: 220 }), sw = hp(b, a, c, z.op);
    if (b < 0) sw = hp(-b, -a, -c, FLIP[z.op]);
    return mcP(r, '<i>(Multiple Choice)</i> The graph shows the solution region of' + fig(svg), [
      { html: t(stdT(h)), right: true }, { html: t(stdT(flipH(h))), why: 'That is the other side. Test ' + t('(0,\\ 0)') + ': is the origin shaded?' },
      { html: t(stdT(sw)), why: 'Check the boundary: substitute the intercepts ' + t(ptT(z.xi, 0)) + ' and ' + t(ptT(0, z.yi)) + '.' }, { html: t(stdT(hp(a, b, c, SOFT[z.op]))), why: 'The boundary is dashed, so the sign is ' + t('<') + ' or ' + t('>') + '.' }],
      'The line through ' + t(ptT(z.xi, 0)) + ' and ' + t(ptT(0, z.yi)) + ' is ' + t(lin2(a, 'x', b, 'y') + '=' + c) + '; it is dashed, so ' + t('<') + ' or ' + t('>') + '. ' + testSent(h) + ' So ' + t(stdT(h)) + '.', ['Find the boundary from the intercepts, then test a point in the shaded region.'], 'MC: inequality of a graph');
  }
  /* Q14 — solid boundary, region above (multiple choice) */
  function solidAboveMC(r) {
    var z = pickWhere(function () { return { m: nz(r, 1, 4), b: nz(r, 1, 5), k: r.int(2, 3) }; }, function (s) { return !(s.m === 2 && s.b === 1); });
    var m = z.m, b = z.b, k = z.k;
    // correct: k·m·x − k·y ≤ −k·b  (y ≥ mx + b)
    var right = lin2(k * m, 'x', -k, 'y') + '\\le ' + (-k * b), d1 = 'y>' + lf(m, b), d2 = lin2(-m, 'x', 1, 'y') + '\\le ' + b, d3 = lin2(m, 'x', -1, 'y') + '\\ge ' + (-b);
    return mcP(r, '<i>(Multiple Choice)</i> Which inequality has a solid boundary line and a solution region <b>above</b> its boundary line?', [
      { html: t(right), right: true }, { html: t(d1), why: t('>') + ' gives a dashed boundary.' }, { html: t(d2), why: 'Solve for ' + t('y') + ': ' + t('y\\le ' + lf(m, b)) + ': below.' }, { html: t(d3), why: 'Solve for ' + t('y') + ': ' + t('-y\\ge ' + lf(-m, -b)) + ', so ' + t('y\\le ' + lf(m, b)) + ' (sign reversed): below.' }],
      t('-' + k + 'y\\le ' + lf(-k * m, -k * b) + '\\Rightarrow y\\ge ' + lf(m, b)) + ' (dividing by ' + t(-k) + ' reverses the sign): solid, above.', ['Solve each for ' + t('y') + '; remember to reverse the sign when dividing by a negative.'], 'MC: solid and above');
  }

  /* EP C1 — corners and area of y ≥ m1x + b1, y ≤ m2x + b2, x ≥ 0 */
  function cornersArea(r) {
    var z = pickWhere(function () { return { m1: r.pick([1, 2, 0.5, 3]), m2: r.pick([-1, -2, -0.5, -3, 0]), b1: r.int(-5, 1), b2: r.int(1, 7), x0: r.int(1, 5) }; }, function (s) { var xs = (s.b2 - s.b1) / (s.m1 - s.m2); return isInt(xs) && xs >= 1 && xs <= 6 && isInt(s.m1 * xs + s.b1) && !(s.m1 === 1 && s.b1 === -3 && s.m2 === -2 && s.b2 === 6); });
    var xs = (z.b2 - z.b1) / (z.m1 - z.m2), ys = z.m1 * xs + z.b1, Ar = (z.b2 - z.b1) * xs / 2, pts = [{ x: 0, y: z.b1 }, { x: 0, y: z.b2 }, { x: xs, y: ys }];
    var sol = t(lf(z.m1, z.b1) + '=' + lf(z.m2, z.b2)) + ' gives ' + t('x=' + xs) + ', ' + t('y=' + vD(ys)) + '. With ' + t('x=0') + ': ' + t(ptT(0, z.b1)) + ' and ' + t(ptT(0, z.b2)) + '.<br>The region is the triangle with corners ' + t(ptT(0, z.b1)) + ', ' + t(ptT(0, z.b2)) + ', ' + t(ptT(xs, ys)) + '.<br>Area ' + t('=\\dfrac{1}{2}(\\text{base } ' + (z.b2 - z.b1) + ')(\\text{height } ' + xs + ')=' + vD(Ar)) + ' square units.';
    return fieldsP('Consider the region that satisfies ' + t('y\\ge ' + lf(z.m1, z.b1)) + ', ' + t('y\\le ' + lf(z.m2, z.b2)) + ' and ' + t('x\\ge 0') + '. Determine the corners of the region and its area.', [
      { label: 'Corners:', name: 'Corners', math: true, keys: 'u8pairs', placeholder: 'e.g. (0, -3), (0, 6), (3, 0)', chk: pairsChk(CP, pts), key: pts.map(function (p) { return ptT(p.x, p.y); }).join(',\\ '), ans: pts.map(function (p) { return ptT(p.x, p.y); }).join(',\\ ') },
      { label: 'Area:', name: 'Area', after: 'square units', chk: numChk(Ar, [[2 * Ar, CP + 'area', 'A triangle’s area is ' + t('\\dfrac{1}{2}bh') + '.']]), key: nK(Ar), ans: nT(Ar) }],
      { sol: sol, hints: ['The corners are where the boundaries meet: each pair of boundary lines.', 'The base lies on the ' + t('y') + '-axis; the height is the ' + t('x') + '-coordinate of the third corner.'], text: 'corners and area', bad: [[pts.map(function (p) { return ptT(p.x, p.y); }).join(',\\ '), nK(2 * Ar)], [ptT(0, z.b1) + ',\\ ' + ptT(0, z.b2), nK(Ar)]] });
  }

  /* EP C2 — chairs and tables */
  function woodShared(r) {
    return pickWhere(function () { return { hc: r.int(2, 5), ht: r.int(3, 8), H: r.int(18, 40), tm: r.int(1, 3), pc: 10 * r.int(3, 9), pt: 10 * r.int(5, 14) }; }, function (z) {
      if (z.ht <= z.hc || z.pt <= z.pc || (z.hc === 3 && z.ht === 5 && z.H === 30 && z.tm === 2)) return false;
      var L = woodList(z); if (L.length < 8 || L.length > 40) return false;
      var best = Math.max.apply(null, L.map(function (q) { return q.p; })); return L.filter(function (q) { return q.p === best; }).length === 1;
    });
  }
  function woodList(z) { var out = []; for (var tt = z.tm; z.ht * tt <= z.H; tt++) for (var c = 0; z.hc * c + z.ht * tt <= z.H; c++) out.push({ c: c, t: tt, p: z.pc * c + z.pt * tt }); return out; }
  function woodStem(o) { return 'A woodworker builds chairs (' + t(o.hc) + ' h each) and tables (' + t(o.ht) + ' h each). She has at most ' + t(o.H) + ' hours this week and must build at least ' + t(o.tm) + (o.tm === 1 ? ' table' : ' tables') + '. Let ' + t('c') + ' be the number of chairs and ' + t('t') + ' the number of tables.'; }
  function woodA(r, o) {
    var h1 = hp(o.hc, o.ht, o.H, 'le'), h2 = hp(0, 1, o.tm, 'ge'), V = { vars: ['c', 't'] }, c1 = ineqChk(h1, V), c2 = ineqChk(h2, V), lab = ['Hours', 'Tables'];
    var chk = function (resp) {
      resp = resp || []; var a = [c1(resp[0] || ''), c2(resp[1] || '')];
      if (a[0].v === 'correct' && a[1].v === 'correct') return ok();
      var sw = [c2(resp[0] || ''), c1(resp[1] || '')]; if (sw[0].v === 'correct' && sw[1].v === 'correct') return ok();
      for (var i = 0; i < 2; i++) if (a[i].v !== 'correct') return { v: a[i].v, code: a[i].v === 'wrong' ? (a[i].code === 'value' ? CP + 'sys' : a[i].code) : a[i].code, hint: '<b>' + lab[i] + ':</b> ' + (a[i].hint || 'Check this inequality.') };
      return ok();
    };
    return { prompt: 'Write the system of inequalities. (The restrictions are ' + t('c\\ge 0') + ', whole numbers.)', input: { type: 'fields', fields: [{ label: 'Hours:', name: 'Hours', mode: 'math', keys: 'u8ineq', vars: ['c', 't'], placeholder: 'e.g. 3c + 5t <= 30' }, { label: 'Tables:', name: 'Tables', mode: 'math', keys: 'u8ineq', vars: ['c', 't'], placeholder: 'e.g. t >= 2' }] },
      check: chk, key: [lin2(o.hc, 'c', o.ht, 't') + '\\le ' + o.H, 't\\ge ' + o.tm], answer: t(lin2(o.hc, 'c', o.ht, 't') + '\\le ' + o.H) + ', ' + t('t\\ge ' + o.tm) + ', ' + t('c\\ge 0') + ', whole numbers', solution: 'Hours: ' + t(lin2(o.hc, 'c', o.ht, 't') + '\\le ' + o.H) + '. Tables: ' + t('t\\ge ' + o.tm) + '. Also ' + t('c\\ge 0') + ', whole numbers.',
      hints: ['Hours used = hours per item × number of items, added.', '“At most” is ' + t('\\le') + '; “at least” is ' + t('\\ge') + '.'], text: 'chairs and tables: system', bad: [[lin2(o.hc, 'c', o.ht, 't') + '\\ge ' + o.H, 't\\ge ' + o.tm], [lin2(o.hc, 'c', o.ht, 't') + '\\le ' + o.H, 't>' + o.tm]] };
  }
  function woodB(r, o) {
    var L = woodList(o), all = woodList(Object.assign({}, o, { tm: 0 })).length, noZero = L.filter(function (q) { return q.c > 0; }).length, rows = [];
    for (var tt = o.tm; o.ht * tt <= o.H; tt++) { var mx = Math.floor((o.H - o.ht * tt) / o.hc); rows.push(t('t=' + tt) + ': ' + t('c=0') + (mx > 0 ? ' to ' + t(mx) : '') + ' (' + (mx + 1) + ')'); }
    return numP('How many possible combinations ' + t('(c,\\ t)') + ' are there?', L.length, { cands: [[all, CP + 'count', 'Remember she must build at least ' + t(o.tm) + (o.tm === 1 ? ' table' : ' tables') + '.'], [noZero, CP + 'count', t('c=0') + ' (no chairs) is allowed too.']],
      sol: rows.join('; ') + '. (' + t(o.hc + 'c\\le ' + o.H + '-' + o.ht + 't') + ' in each case.) In all, <b>' + L.length + '</b> combinations.', hints: ['For each possible number of tables, find the largest number of chairs that fits.', 'Count every whole number of chairs from 0 up to that largest number.'], text: 'chairs and tables: count' });
  }
  function woodC(r, o) {
    var L = woodList(o), best = L.reduce(function (a, b) { return b.p > a.p ? b : a; }), byT = {};
    L.forEach(function (q) { if (!byT[q.t] || q.c > byT[q.t].c) byT[q.t] = q; });
    var lines = Object.keys(byT).map(function (k) { var q = byT[k]; return t(ptT(q.c, q.t)) + ': ' + t('\\$' + q.p); }).join('; ');
    var chk = function (resp) {
      resp = resp || [];
      var a = HW.parse.number(resp[0] == null ? '' : resp[0]), b = HW.parse.number(resp[1] == null ? '' : resp[1]);
      if (!a.ok || !b.ok) return form('empty', 'Type a whole number in each box.');
      if (a.value === best.c && b.value === best.t) return ok();
      var f = L.filter(function (q) { return q.c === a.value && q.t === b.value; })[0];
      if (!f) return wrong(CP + 'best', 'That combination does not fit: check ' + t(o.hc + 'c+' + o.ht + 't\\le ' + o.H) + ' and ' + t('t\\ge ' + o.tm) + '.');
      return wrong(CP + 'best', 'That works and earns ' + t('\\$' + f.p) + ', but another combination earns more. Check the most chairs for each number of tables.');
    };
    return { prompt: 'She earns ' + t('\\$' + o.pc) + ' profit per chair and ' + t('\\$' + o.pt) + ' per table. Which combination gives the greatest profit?', input: { type: 'fields', fields: [{ label: 'Chairs:', name: 'Chairs' }, { label: 'Tables:', name: 'Tables' }] },
      check: chk, key: [String(best.c), String(best.t)], answer: t(best.c) + ' chairs and ' + t(best.t) + ' tables (' + t('\\$' + best.p) + ')',
      solution: 'Check the most chairs for each number of tables: ' + lines + '.<br>' + t(best.c) + ' chairs and ' + t(best.t) + ' tables give the greatest profit, ' + t('\\$' + best.p) + '.', hints: ['Only the combinations with the most chairs for each number of tables can be best.', 'Work out the profit for each of those and compare.'], text: 'chairs and tables: best',
      bad: [[String(best.c + 1), String(best.t)], [String(best.c), String(best.t + 1)]] };
  }

  /* EP C3 — a system from the corners of a triangle (three boxes, any order) */
  function triSys(r) {
    var z = pickWhere(function () { return { a: r.int(2, 8), b: r.int(2, 8), k: r.pick(['A', 'A', 'B', 'C']) }; }, function (s) { return !(s.k === 'A' && s.a === 4 && s.b === 4); });
    var a = z.a, b = z.b, g = gcd(a, b), H, corners;
    if (z.k === 'A') { H = [hp(1, 0, 0, 'ge'), hp(0, 1, 0, 'ge'), hp(b / g, a / g, a * b / g, 'le')]; corners = [[0, 0], [a, 0], [0, b]]; }
    else if (z.k === 'B') { H = [hp(0, 1, 0, 'ge'), hp(1, 0, a, 'le'), hp(b / g, -a / g, 0, 'ge')]; corners = [[0, 0], [a, 0], [a, b]]; }
    else { H = [hp(1, 0, 0, 'ge'), hp(0, 1, b, 'le'), hp(b / g, -a / g, 0, 'le')]; corners = [[0, 0], [0, b], [a, b]]; }
    var C = H.map(function (h) { return ineqChk(h); }), keys = H.map(function (h) { return stdT(h); });
    var perms = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
    var chk = function (resp) {
      resp = resp || [];
      if (resp.some(function (x) { return !String(x == null ? '' : x).trim(); })) return form('empty', 'Write one inequality in each box.');
      for (var i = 0; i < perms.length; i++) if (perms[i].every(function (j, k) { return C[j](resp[k]).v === 'correct'; })) return ok();
      var used = {}, nOk = 0, firstBad = null;
      resp.forEach(function (x, k) { for (var j = 0; j < 3; j++) if (!used[j] && C[j](x).v === 'correct') { used[j] = 1; nOk++; return; } if (firstBad == null) firstBad = k; });
      var miss = [0, 1, 2].filter(function (j) { return !used[j]; }), hint = nOk + ' of your 3 inequalities ' + (nOk === 1 ? 'is' : 'are') + ' right. ';
      if (miss.length === 1 && firstBad != null) { var rr = C[miss[0]](resp[firstBad]); if (rr.v !== 'correct' && rr.hint && rr.code !== CP + 'reg-bound') return wrong(rr.code === 'value' ? CP + 'tri' : rr.code, hint + '<b>Box ' + (firstBad + 1) + ':</b> ' + rr.hint); }
      return wrong(CP + 'tri', hint + 'Each side of the triangle lies on one boundary line; the region is on the triangle’s side of each, and the sides are included.');
    };
    var cT = corners.map(function (p) { return ptT(p[0], p[1]); }).join(', ');
    return { prompt: 'Write a system of inequalities whose solution region is the triangle with corners ' + t(cT.replace(/, \(/g, ',\\ (')) + ', including its sides. (One inequality in each box, in any order.)',
      input: { type: 'fields', fields: [0, 1, 2].map(function (i) { return { label: (i + 1) + '.', name: 'Box ' + (i + 1), mode: 'math', keys: 'u8ineq', vars: ['x', 'y'], placeholder: i ? '' : 'e.g. x >= 0' }; }) },
      check: chk, key: keys, answer: keys.map(function (k) { return t(k); }).join(', '),
      solution: 'The sides lie on ' + H.map(function (h) { return t(lin2(h.A, 'x', h.B, 'y') + '=' + vF(h.C)); }).join(', ') + '. The triangle is on the side of each line that holds the other corners, and the sides are included (solid): ' + keys.map(function (k) { return t(k); }).join(', ') + '.',
      hints: ['Each side of the triangle is part of a boundary line: write the equation of each.', 'Choose each sign so that the third corner (or a point inside) makes it true; use ' + t('\\le') + ' or ' + t('\\ge') + ' to include the sides.'], text: 'system from a triangle',
      bad: [[keys[0], keys[1], stdT(flipH(H[2]))], [keys[0], keys[1], stdT(hp(H[2].A, H[2].B, H[2].C, SOFT[H[2].op]))]] };
  }

  /* ======================================================================================================
   * Questions
   * ====================================================================================================== */
  var QUESTIONS = [
    { num: '1', parts: [
      { id: 'q1a', level: 'BEG', make: function (r) { return oneA(r); } },
      { id: 'q1b', level: 'EMG', make: function (r) { return oneB(r); } },
      { id: 'q1c', level: 'PRG', make: function (r) { return oneC(r); } }] },
    { num: '2', parts: [{ id: 'q2', level: 'BEG', make: function (r) { return ptsGrid(r, 5); } }] },
    { num: '3', parts: [
      { id: 'q3a', level: 'BEG', make: function (r) { return graphY(r, 'one'); } },
      { id: 'q3b', level: 'BEG', make: function (r) { return graphY(r, 'int'); } },
      { id: 'q3c', level: 'EMG', make: function (r) { return graphY(r, 'frac'); } }] },
    { num: '4', parts: [
      { id: 'q4a', level: 'EMG', make: function (r) { return graphStd(r, 'pos', function (s) { return s.xi === 3 && s.yi === 2; }); } },
      { id: 'q4b', level: 'PRG', make: function (r) { return graphStd(r, 'neg', function (s) { return (s.xi === 4 && s.yi === 3) || (s.xi === 3 && s.yi === 4); }); } },
      { id: 'q4c', level: 'PRG', make: function (r) { return graphStd(r, 'origin'); } },
      { id: 'q4d', level: 'PRG', make: function (r) { return graphStd(r, 'moved', function (s) { return s.xi === 5 && s.yi === 4; }); } }] },
    { num: '5', parts: [
      { id: 'q5a', level: 'BEG', make: function (r) { return graphVH(r, 'x'); } },
      { id: 'q5b', level: 'BEG', make: function (r) { return graphVH(r, 'ymove'); } },
      { id: 'q5c', level: 'EMG', make: function (r) { return graphVH(r, 'solve'); } },
      { id: 'q5d', level: 'EMG', make: function (r) { return graphBand(r); } }] },
    { num: '6', shared: mayaShared, stem: mayaStem, parts: [
      { id: 'q6a', level: 'PRG', make: function (r, o) { return mayaA(r, o); } },
      { id: 'q6b', level: 'EMG', make: function (r, o) { return mayaB(r, o); } }] },
    { num: '7', parts: [
      { id: 'q7a', level: 'EMG', make: function (r) { return writeGraph(r, 'negFrac', function (s) { return s.p === -1 && s.q === 2 && s.b === 2; }); } },
      { id: 'q7b', level: 'PRG', make: function (r) { return writeGraph(r, 'int', function (s) { return s.p === 2 && s.q === 1 && s.b === -3; }); } },
      { id: 'q7c', level: 'PRG', make: function (r) { return writeGraph(r, 'origin', function (s) { return s.p === 2 && s.q === 3; }); } }] },
    { num: '8', parts: [
      { id: 'q8a', level: 'PRG', make: function (r) { return writeWords(r, 'int'); } },
      { id: 'q8b', level: 'ADV', make: function (r) { return writeWords(r, 'two'); } }] },
    { num: '9', shared: sysShared, stem: sysStem, parts: [
      { id: 'q9a', level: 'PRG', make: function (r, o) { return sysA(r, o); } },
      { id: 'q9b', level: 'PRG', make: function (r, o) { return sysB(r, o); } },
      { id: 'q9c', level: 'PRG', make: function (r, o) { return sysC(r, o); } }] },
    { num: '10', shared: function (r) { return budShared(r, 'le'); }, stem: function (o) { return budStem(o, 'le'); }, parts: [
      { id: 'q10a', level: 'EMG', make: function (r, o) { return budA(r, o, 'le'); } },
      { id: 'q10b', level: 'PRG', make: function (r, o) { return budB(r, o, 'le'); } },
      { id: 'q10c', level: 'EMG', make: function (r, o) { return budC(r, o); } },
      { id: 'q10d', level: 'PRG', make: function (r, o) { return budD(r, o, 'le'); } }] },
    { num: '11', shared: fitShared, stem: fitStem, parts: [
      { id: 'q11a', level: 'PRG', make: function (r, o) { return fitA(r, o); } },
      { id: 'q11b', level: 'MAS', make: function (r, o) { return fitB(r, o); } },
      { id: 'q11c', level: 'EMG', make: function (r, o) { return fitC(r, o); } },
      { id: 'q11d', level: 'ADV', make: function (r, o) { return fitD(r, o); } }] },
    { num: '12', parts: [{ id: 'q12', level: 'EMG', make: function (r) { return ptMC(r, true, function (s) { return s.A === 3 && s.B === 2 && s.C === 6; }); } }] },
    { num: '13', parts: [{ id: 'q13', level: 'PRG', make: function (r) { return graphIsMC(r); } }] },
    { num: '14', parts: [{ id: 'q14', level: 'PRG', make: function (r) { return solidAboveMC(r); } }] },
    { num: '15', parts: [{ id: 'q15', level: 'EMG', make: function (r) {
      var z = pickWhere(function () { return { a: r.int(2, 9), k: r.int(2, 9), b: r.int(2, 12) }; }, function (s) { return !(s.a === 4 && s.k === 3 && s.b === 8) && s.b * s.k <= 99 && s.b !== s.k; }), C = z.b * z.k;
      return numP('<i>(Numerical Response)</i> The boundary line of the solution region of ' + t(z.a + 'x+by<' + C) + ' has a ' + t('y') + '-intercept of ' + t(z.k) + '. The value of ' + t('b') + ' is ______.', z.b, { nr: true, cands: [[C / z.a, CP + 'nr-x', 'That would make ' + t(z.k) + ' the ' + t('x') + '-intercept. At the ' + t('y') + '-intercept, ' + t('x=0') + '.'], [z.k * C, 'value', 'At ' + t('x=0') + ': ' + t('b(' + z.k + ')=' + C) + ': divide.']],
        sol: 'At the ' + t('y') + '-intercept ' + t('x=0') + ', ' + t('y=' + z.k) + ': ' + t(z.a + '(0)+b(' + z.k + ')=' + C + '\\Rightarrow b=' + z.b) + '.', hints: ['The boundary is ' + t(z.a + 'x+by=' + C) + '. The ' + t('y') + '-intercept is the point ' + t(ptT(0, z.k)) + '.'], text: 'NR: coefficient from an intercept' });
    } }] },
    { num: '16', parts: [{ id: 'q16', level: 'ADV', make: function (r) {
      var z = pickWhere(function () { return { M: r.int(12, 60), p: r.int(2, 9), q: r.int(2, 9) }; }, function (s) { return s.p !== s.q && s.M > s.p + s.q + 3 && !(s.M === 20 && s.p === 4 && s.q === 3); });
      var best = 0, bx = 0, by = 0; for (var x = 1; z.p * x <= z.M; x++) for (var y = 1; z.p * x + z.q * y <= z.M; y++) if (x + y > best) { best = x + y; bx = x; by = y; }
      var lo = Math.min(z.p, z.q), hi = Math.max(z.p, z.q), noOne = Math.floor(z.M / lo), names = z.p === lo ? ['pizza slices', 'drinks'] : ['drinks', 'pizza slices'];
      void names;
      return numP('<i>(Numerical Response)</i> Kai has at most ' + t('\\$' + z.M) + ' to spend on pizza slices at ' + t('\\$' + z.p) + ' each and drinks at ' + t('\\$' + z.q) + ' each, and he buys at least one of each. The greatest total number of items he can buy is ______.', best, { nr: true,
        cands: noOne !== best ? [[noOne, CP + 'nr-one', 'He must buy at least one of each: spend ' + t('\\$' + hi) + ' on one of the dearer item first.']] : [], sol: t(z.p + 'x+' + z.q + 'y\\le ' + z.M) + ', ' + t('x\\ge 1') + ', ' + t('y\\ge 1') + ', whole numbers. Buy one of the dearer item and as many of the cheaper as fit: e.g. ' + t(bx) + ' slices and ' + t(by) + ' drinks (' + t('\\$' + (z.p * bx + z.q * by)) + '). The greatest total is ' + t(best) + '.',
        hints: ['Write the inequality with the restrictions ' + t('x\\ge 1') + ', ' + t('y\\ge 1') + '.', 'To get the most items, buy as many of the cheaper item as you can.'], text: 'NR: most items' });
    } }] }
  ];

  var EXTRA = [
    { num: '1', section: 'A. Skills', parts: [
      { id: 'e1a', level: 'BEG', make: function (r) {
        var z = pickWhere(function () { return { a: r.int(2, 6), x0: r.int(-8, 8), c: r.int(-9, 12), op: r.pick(['lt', 'le', 'gt', 'ge']) }; }, function (s) { return !(s.c === 7 && s.a === 4) && s.c !== 0; });
        var d = z.c - z.a * z.x0, op2 = FLIP[z.op];
        return setP('Solve and write the solution in set notation: ' + t(z.c + '-' + z.a + 'x' + OPS[z.op] + d), z.x0, op2, true, t('-' + z.a + 'x' + OPS[z.op] + (d - z.c)) + '; divide by ' + t(-z.a) + ' (<b>reverse</b> the sign): ' + t('x' + OPS[op2] + z.x0) + '.<br>' + t(A().setPart(CP, '', setT(z.x0, op2), {}).key), 'inequality: reverse the sign');
      } },
      { id: 'e1b', level: 'EMG', make: function (r) {
        var z = pickWhere(function () { return { p: r.int(2, 5), q: r.int(-6, 6), ds: r.int(1, 5), x0: r.int(-6, 8), op: r.pick(['lt', 'le', 'gt', 'ge']) }; }, function (s) { return s.q !== 0 && !(s.p === 2 && s.q === 5 && s.ds === 4); });
        var s = z.p + z.ds, tt = z.ds * z.x0 - z.p * z.q, op2 = FLIP[z.op];
        return setP('Solve and write the solution in set notation: ' + t(z.p + '(x' + U.sg(z.q) + ')' + OPS[z.op] + U.lx(s, -tt)), z.x0, op2, false, t(U.lx(z.p, z.p * z.q) + OPS[z.op] + U.lx(s, -tt)) + '; collect the ' + t('x') + '-terms on the right: ' + t(nT(z.p * z.q + tt) + OPS[z.op] + z.ds + 'x') + ', so ' + t('x' + OPS[op2] + z.x0) + '.<br>' + t(A().setPart(CP, '', setT(z.x0, op2), {}).key), 'inequality with brackets');
      } }] },
    { num: '2', parts: [{ id: 'e2', level: 'BEG', make: function (r) { return ptsGrid(r, 4, { yform: true }); } }] },
    { num: '3', parts: [
      { id: 'e3a', level: 'EMG', make: function (r) {
        var z = pickWhere(function () { return { a: nz(r, 1, 6), c: nz(r, 1, 6), op: r.pick(['lt', 'le', 'gt', 'ge']) }; }, function (s) { return !(s.a === 5 && s.c === 3 && s.op === 'lt'); });
        var h = hp(z.a, -1, z.c, z.op), key = yT(h);
        return ineqP('Write ' + t(stdT(h)) + ' in the form ' + t('y<mx+b') + ', ' + t('y\\le mx+b') + ', ' + t('y>mx+b') + ' or ' + t('y\\ge mx+b') + '.', h, key, { yForm: true, rev: true }, t('-y' + OPS[z.op] + U.lx(-z.a, z.c)) + '; multiply by ' + t('-1') + ' (<b>reverse</b> the sign): ' + t(key) + ': ' + (strict(z.op) ? 'dashed' : 'solid') + ', ' + (up(yOf(h).op) ? 'above' : 'below') + '.', ['Move the ' + t('x') + '-term, then divide by the coefficient of ' + t('y') + '. Dividing by a negative reverses the sign.'], 'solve for y');
      } },
      { id: 'e3b', level: 'EMG', make: function (r) {
        var z = pickWhere(function () { return { a: nz(r, 1, 6), B: -r.int(2, 4), k: r.int(-3, 3), op: r.pick(['lt', 'le', 'gt', 'ge']) }; }, function (s) { return !(s.a === -4 && s.B === -2 && s.op === 'ge') && s.k !== 0; });
        var h = hp(z.a, z.B, z.B * z.k, z.op), y = yOf(h), solid = !strict(z.op), above = up(y.op);
        return mcP(r, 'The inequality ' + t(stdT(h)) + ' is graphed. Which describes its graph?', [[true, true], [true, false], [false, true], [false, false]].map(function (q) {
          var right = q[0] === solid && q[1] === above; return { html: (q[0] ? 'Solid' : 'Dashed') + ' boundary; the region ' + (q[1] ? 'above' : 'below') + ' it', right: right, why: right ? null : q[1] !== above ? 'Solve for ' + t('y') + ': dividing by ' + t(z.B) + ' reverses the sign, giving ' + t(yT(h)) + '.' : t('\\le') + ' and ' + t('\\ge') + ' give a solid boundary; ' + t('<') + ' and ' + t('>') + ' a dashed one.' };
        }), t(z.B + 'y' + OPS[z.op] + U.lx(-z.a, z.B * z.k)) + '; divide by ' + t(z.B) + ' (<b>reverse</b> the sign): ' + t(yT(h)) + ': ' + (solid ? 'solid' : 'dashed') + ', ' + (above ? 'above' : 'below') + '.', ['Solve for ' + t('y') + '. Dividing by a negative reverses the sign.'], 'boundary and side', true);
      } }] },
    { num: '4', parts: [
      { id: 'e4a', level: 'BEG', make: function (r) { return graphY(r, 'int'); } },
      { id: 'e4b', level: 'EMG', make: function (r) { return graphStd(r, 'neg', function (s) { return s.xi === 6 && s.yi === 2; }); } },
      { id: 'e4c', level: 'EMG', make: function (r) { return graphVH(r, 'solve'); } }] },
    { num: '5', section: 'B. Applying', parts: [
      { id: 'e5a', level: 'PRG', make: function (r) { return writeGraph(r, 'posFrac', function (s) { return s.p === 3 && s.q === 2 && s.b === 1; }); } },
      { id: 'e5b', level: 'PRG', make: function (r) { return writeGraph(r, 'negInt', function (s) { return s.p === -2 && s.q === 1 && s.b === -4; }); } }] },
    { num: '6', parts: [{ id: 'e6', level: 'PRG', make: function (r) { return writeWords(r, 'below'); } }] },
    { num: '7', shared: function (r) { return budShared(r, 'ge'); }, stem: function (o) { return budStem(o, 'ge'); }, parts: [
      { id: 'e7a', level: 'EMG', make: function (r, o) { return budA(r, o, 'ge'); } },
      { id: 'e7b', level: 'PRG', make: function (r, o) { return budB(r, o, 'ge'); } },
      { id: 'e7c', level: 'PRG', make: function (r, o) { return budD(r, o, 'ge'); } }] },
    { num: '8', parts: [{ id: 'e8', level: 'EMG', make: function (r) { return ptMC(r, false, function (s) { return s.A === 2 && s.B === 5 && s.C === 10; }); } }] },
    { num: '9', parts: [{ id: 'e9', level: 'EMG', make: function (r) {
      var z = pickWhere(function () { return { a: r.int(1, 6), x0: r.int(-6, 6), y0: nz(r, 1, 8), k: r.int(1, 12) }; }, function (s) { return !(s.a === 3 && s.x0 === -5 && s.y0 === 6) && s.x0 !== 0; }), C = z.a * z.x0 + z.k * z.y0;
      return numP('<i>(Numerical Response)</i> The point ' + t(ptT(z.x0, z.y0)) + ' lies on the boundary line of the inequality ' + t(z.a + 'x+ky\\ge ' + C) + '. The value of ' + t('k') + ' is ______.', z.k, { nr: true, cands: [[(C + z.a * z.x0) / z.y0, 'value', 'Check the sign of ' + t(z.a + '(' + z.x0 + ')') + '.']],
        sol: t(z.a + '(' + z.x0 + ')+k(' + z.y0 + ')=' + C + '\\Rightarrow ' + z.y0 + 'k=' + (C - z.a * z.x0) + '\\Rightarrow k=' + z.k) + '.', hints: ['A point on the boundary makes both sides equal: substitute it into ' + t(z.a + 'x+ky=' + C) + '.'], text: 'NR: coefficient from a point' });
    } }] },
    { num: '10', section: 'C. Stretch', parts: [{ id: 'e10', level: 'MAS', make: function (r) { return cornersArea(r); } }] },
    { num: '11', shared: woodShared, stem: woodStem, parts: [
      { id: 'e11a', level: 'PRG', make: function (r, o) { return woodA(r, o); } },
      { id: 'e11b', level: 'ADV', make: function (r, o) { return woodB(r, o); } },
      { id: 'e11c', level: 'MAS', make: function (r, o) { return woodC(r, o); } }] },
    { num: '12', parts: [{ id: 'e12', level: 'MAS', make: function (r) { return triSys(r); } }] }
  ];

  HW.defineLesson({ id: LID, unit: 8, num: '4', title: 'Linear Inequalities in Two Variables', outcome: 'RF7', calc: true, questions: QUESTIONS, extra: EXTRA });
})(window);
