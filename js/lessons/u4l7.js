/* Math 20-1 · Unit 4 · Lesson 7 — Radical Equations That Lead to Quadratics (outcome AN3 on every part)
 * Assignment 7 (u4_l07.tex, Questions 1–17) and the Lesson 7 Extra Practice (u4_ep07.tex, A1–A3, B1–B6, C1–C3).
 * Every part is a generator: the booklet question's idea, form and difficulty with new numbers (the lesson's example
 * numbers and the booklet's own numbers are left out). No calculator (Unit 4): exact roots.
 *
 * Built on the radical-equation kit HW.u4rad from u4l6.js (restrictions R.restrictInfo / R.restrictCands / R.P.ineq,
 * roots with "no solution" R.readRoots / R.P.solve, the u4ineq and u4rad keypads), so u4l6.js must load first.
 * This file adds the kit HW.u4r7 (also used by u4l8.js, the unit review):
 *   rad(c, list), pol(list)            terms of an equation side (list = [[coef, power], …] in display order)
 *   eqTex(E), checkX(E, x)             the equation's LaTeX; the verification line for one root (LS / RS, ✓ or extraneous)
 *   facTex(A, roots, v)                g(qx − p)… for a quadratic with leading coefficient A and rational roots
 *   quadRad(o)                         k√(ax + b) = mx + e built from the values u = mx + e at its two roots (o.u1, o.u2;
 *                                      u < 0 makes that root extraneous), in a layout (iso, swap, radc, crad, xminus, radx,
 *                                      xrad) → { eq, tex, lines (restrictions, isolate, square, factor, verify), roots,
 *                                      ext, cands (missing middle term, coefficient not squared, isolating sign slip, root
 *                                      signs) }
 *   twoRad(o)                          √A ∓ √B = c or √A = √B + c, squared twice (linear or quadratic after the second square)
 *   subRad(o)                          ax + b√x + c = 0 by u = √x (reject u < 0, x = u²)
 *   finish(E, pre, A, B, C, roots)     factoring line, verification and conclusion for a custom equation E
 *   solvePart(prompt, E, o)            R.P.solve plus this lesson's diagnoses (wrong-root sets, "both roots check")
 *   restrictPart(prompt, E, o)         "state the restrictions": radicand ≥ 0 AND the other side ≥ 0
 *   radExpandPart(prompt, o)           expand a binomial with a radical, e.g. (2√x − 3)² (checked numerically on the domain,
 *                                      with form nudges: not expanded, like terms, √(9x) not simplified)
 * Recognised mistakes (codes u4l7-…): (x − 2)² as x² + 4 (the middle term missing), the middle term not doubled, the
 * coefficient of a radical not squared, a sign slip isolating the radical, root signs from the factors, kept an extraneous
 * root (u4rad-kept-extraneous, with the failing check as the hint), rejected a root that checks, only the radicand (or only
 * the other side) in the restrictions, squared term by term ((√A − √B)² as A − B), gave u = √x instead of x = u².
 * Conversions: "explain the error" / "use the graph to explain" / "which statement is true" → multiple choice of
 * explanations (the graph drawn from the generated equation); "write a radical equation" → multiple choice of equations;
 * "state the dimensions" → number boxes; "find c, then the extraneous root" → two boxes.
 * Levels: LIM BEG EMG PRG ADV MAS. Mastery: 9(c), 9(d), 10(b), Extra B2(b), C1, C2, C3(c). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, B = K.P, ex = HW.ex, P = HW.poly, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
  var LID = 'u4l7', R = HW.u4rad;
  if (!R) throw new Error(LID + '.js needs js/lessons/u4l6.js (HW.u4rad) loaded first');
  var Q = R.Q, qq = R.qq, qv = R.qv, qmul = R.qmul, qadd = R.qadd, qdiv = R.qdiv, rT = R.rT, termTex = R.termTex, pT = R.pT, linT = R.linT, kRad = R.kRad, fracOf = R.fracOf;

  var CODES = {
    'u4l7-binom': 'Squared a binomial without its middle term', 'u4l7-double': 'Middle term of a square not doubled', 'u4l7-coef': 'Coefficient of the radical not squared',
    'u4l7-sign': 'Roots with the wrong signs (from the factors)', 'u4l7-both': 'Rejected a root that checks', 'u4l7-rhs': 'Restrictions: only the radicand',
    'u4l7-radicand': 'Restrictions: only the other side', 'u4l7-sq-terms': 'Squared term by term (lost the middle radical term)', 'u4l7-u': 'Gave u = √x instead of x = u²',
    'u4l7-expand': 'Not fully expanded', 'u4l7-like': 'Like terms not collected', 'u4l7-rad-simp': 'Radical not simplified', 'u4l7-inadm': 'Kept an inadmissible root',
    'u4l7-c': 'Wrong value of the constant'
  };
  HW.addCodes(CODES);
  HW.addPartial({ 'u4l7-binom': 'b', 'u4l7-double': 's', 'u4l7-coef': 's', 'u4l7-sign': 's', 'u4l7-both': 's', 'u4l7-rhs': 'b', 'u4l7-radicand': 'b', 'u4l7-sq-terms': 'b', 'u4l7-u': 'b', 'u4l7-inadm': 's', 'u4l7-c': 'b' });

  /* ============================== small tools ============================== */
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var r = a % b; a = b; b = r; } return a; }
  function same(a, b) { return Math.abs(a - b) < 1e-9; }
  function range(a, b) { var o = []; for (var i = a; i <= b; i++) o.push(i); return o; }
  function pm(a, b) { return range(a, b).concat(range(a, b).map(function (x) { return -x; })); }
  function pickWhere(gen, okf) { for (var i = 0; i < 20000; i++) { var o = gen(); if (o && okf(o)) return o; } throw new Error(LID + ': no valid numbers'); }
  function qsub(a, b) { return qadd(a, qmul(b, -1)); }
  function qeq(a, b) { a = qq(a); b = qq(b); return a[0] * b[1] === b[0] * a[1]; }
  function isInt(r) { return qq(r)[1] === 1; }
  function isqrt(n) { if (n < 0) return null; var s = Math.round(Math.sqrt(n)); return s * s === n ? s : null; }
  function sqrtQ(r) { r = qq(r); if (r[0] < 0) return null; var a = isqrt(r[0]), b = isqrt(r[1]); return a == null || b == null ? null : [a, b]; }
  function has(L, x) { return L.some(function (y) { return same(x, y); }); }
  function sameSet(A, Bv) { return A.length === Bv.length && A.every(function (x) { return has(Bv, x); }) && Bv.every(function (y) { return has(A, y); }); }
  function uniqQ(list) { var out = []; list.forEach(function (r) { if (!out.some(function (s) { return qeq(s, r); })) out.push(qq(r)); }); return out; }
  /* rational roots of A x² + B x + C = 0 (integers in), or null */
  function rootsQ(A, Bc, C) {
    if (!A) { if (!Bc) return null; return [Q(-C, Bc)]; }
    var D = Bc * Bc - 4 * A * C; if (D < 0) return null; var s = isqrt(D); if (s == null) return null;
    return uniqQ([Q(-Bc + s, 2 * A), Q(-Bc - s, 2 * A)]);
  }
  function rootsLine(roots, v) { return roots.map(function (r) { return t(v + '=' + rT(r)); }).join(' or '); }
  function joinT(parts) { var s = ''; parts.forEach(function (p) { if (!p) return; if (s && p.charAt(0) !== '-') s += '+'; s += p; }); return s || '0'; }

  /* ============================== equations ============================== */
  function rad(c, list) { return { k: 'rad', c: c, list: list }; }
  function pol(list) { return { k: 'pol', list: list.filter(function (x) { return qv(x[0]) !== 0; }) }; }
  function evalList(list, x) { return list.reduce(function (s, tm) { var p = [1, 1]; for (var i = 0; i < tm[1]; i++) p = qmul(p, x); return qadd(s, qmul(tm[0], p)); }, [0, 1]); }
  function radT(list, v) { return '\\sqrt{' + pT(list, v) + '}'; }
  function termT(tm, v) { return tm.k === 'rad' ? kRad(tm.c, radT(tm.list, v)) : pT(tm.list, v); }
  function sideT(side, v) { return side.length ? joinT(side.map(function (tm) { return termT(tm, v); })) : '0'; }
  function eqTex(E) { return sideT(E.L, E.v) + '=' + sideT(E.R, E.v); }
  function sideAt(side, x) {
    var parts = [], val = [0, 1], num = 0, irr = false, undef = null;
    side.forEach(function (tm) {
      if (tm.k === 'pol') { var y = evalList(tm.list, x); parts.push(rT(y)); val = qadd(val, y); num += qv(y); return; }
      var N = evalList(tm.list, x); parts.push(kRad(tm.c, '\\sqrt{' + rT(N) + '}'));
      if (qv(N) < 0) { undef = N; return; }
      var s = sqrtQ(N);
      if (s) { val = qadd(val, qmul(tm.c, s)); num += qv(tm.c) * qv(s); } else { irr = true; num += qv(tm.c) * Math.sqrt(qv(N)); }
    });
    if (!side.length) parts.push('0');
    return { tex: joinT(parts), val: val, num: num, irr: irr, undef: undef };
  }
  function checkX(E, x) {
    var v = E.v, L = sideAt(E.L, x), Rr = sideAt(E.R, x), head = t(v + '=' + rT(x)) + ': ';
    if (L.undef || Rr.undef) { var u = L.undef || Rr.undef; return { ok: false, line: head + t('\\sqrt{' + rT(u) + '}') + ' is not a real number, so ' + t(v + '=' + rT(x)) + ' is extraneous.' }; }
    var okv = Math.abs(L.num - Rr.num) < 1e-9;
    function show(S) { if (S.irr) return S.tex; var vt = rT(S.val); return S.tex === vt ? vt : S.tex + '=' + vt; }
    return { ok: okv, line: head + 'LS ' + t('=' + show(L)) + ', RS ' + t('=' + show(Rr)) + (okv ? ' ✓' : '. LS ' + t('\\ne') + ' RS, so ' + t(v + '=' + rT(x)) + ' is extraneous.') };
  }
  /* g(q₁v − p₁)(q₂v − p₂) for leading coefficient A and roots p/q */
  function facTex(A, roots, v) {
    var g = [A, 1], mono = '', brs = [];
    roots.forEach(function (r) { r = qq(r); g = qdiv(g, r[1]); if (r[0] === 0) mono += v; else brs.push('(' + linT(r[1], -r[0], v) + ')'); });
    if (!isInt(g)) return null;
    if (roots.length === 1) { var r0 = qq(roots[0]); g = qdiv([A, 1], r0[1]); if (!isInt(g)) return null; brs = r0[0] ? ['(' + linT(r0[1], -r0[0], v) + ')^{2}'] : []; mono = r0[0] ? '' : v + '^{2}'; }
    var gn = g[0], lead = gn === 1 ? '' : gn === -1 ? '-' : String(gn);
    if (!mono && !brs.length) return lead || '1';
    return lead + mono + brs.join('');
  }
  /* the factoring line, every root verified, and the conclusion. pre: earlier lines. roots: the roots of the quadratic */
  function finish(E, pre, A, Bc, C, roots, o) {
    o = o || {}; var v = E.v, lines = (pre || []).slice();
    var std = pT([[A, 2], [Bc, 1], [C, 0]], v), fac = facTex(A, roots, v);
    if (!o.noStd) lines.push((o.zeroLeft ? t(std + '=0') : t('0=' + std)) + (fac && fac !== std ? (o.zeroLeft ? ' &nbsp;⇒&nbsp; ' + t(fac + '=0') : t('=' + fac)) : '') + ', so ' + rootsLine(roots, v) + '.');
    var res = finishChecks(E, roots); lines = lines.concat(res.lines);
    return { lines: lines, roots: res.roots, ext: res.ext, checks: res.checks };
  }
  function finishChecks(E, roots) {
    var v = E.v, checks = {}, good = [], bad = [];
    var cs = roots.map(function (r) { var c = checkX(E, r); checks[rT(r)] = c; (c.ok ? good : bad).push(r); return c; });
    var lines = cs.filter(function (c) { return c.ok; }).concat(cs.filter(function (c) { return !c.ok; })).map(function (c) { return c.line; });
    if (!good.length) lines.push('Every root is extraneous: <b>no solution</b>.');
    else if (good.length === 1) lines.push('The root is ' + t(v + '=' + rT(good[0])) + '.');
    else lines.push('Both roots are valid: ' + rootsLine(good, v) + '. (Squaring does not always create an extraneous root.)');
    return { lines: lines, roots: good, ext: bad, checks: checks };
  }
  function restrictLines(rads, v, labels) {
    var parts = rads.map(function (rd, i) { return (labels ? labels[i] + ': ' : '') + R.restrictInfo([rd], v).lines; });
    var all = R.restrictInfo(rads, v);
    return { tex: all.tex, empty: all.empty, line: 'Restrictions: ' + parts.join('; ') + (rads.length > 1 ? (all.empty ? '. No number satisfies both.' : '. Together: ' + t(all.tex) + '.') : '.') };
  }

  /* ---------------- k√(ax + b) = mx + e, from the values u = mx + e at the two roots ---------------- */
  function layoutSides(lay, RAD, a, b, k, m, e, c) {
    var radL = RAD.list;
    switch (lay) {
      case 'swap': return { L: [pol([[m, 1], [e, 0]])], R: [RAD] };
      case 'radc': return { L: [RAD, pol([[c, 0]])], R: [pol([[m, 1], [e + c, 0]])] };
      case 'crad': return { L: [pol([[c, 0]]), RAD], R: [pol([[m, 1], [e + c, 0]])] };
      case 'xminus': return { L: [pol([[m, 1], [e + c, 0]]), rad(-k, radL)], R: [pol([[c, 0]])] };
      case 'radx': return { L: [RAD, pol([[-m, 1]])], R: [pol([[e, 0]])] };
      case 'xrad': return { L: [pol([[-m, 1]]), RAD], R: [pol([[e, 0]])] };
      default: return { L: [RAD], R: [pol([[m, 1], [e, 0]])] };
    }
  }
  /* o: { v, k, m, e, u1, u2, layout, c (the constant moved, for radc / crad / xminus) } → null if a, b aren't integers */
  function quadRad(o) {
    var v = o.v || 'x', k = o.k || 1, m = o.m, e = o.e, u1 = qq(o.u1), u2 = qq(o.u2), K2 = k * k, lay = o.layout || 'iso', c = o.c || 0;
    if (qeq(u1, u2)) return null;
    var su = qadd(u1, u2), a = qdiv(qmul(m, su), K2), b = qdiv(qsub(qmul(e, su), qmul(u1, u2)), K2);
    if (!isInt(a) || !isInt(b) || !a[0]) return null;
    a = a[0]; b = b[0];
    var r1 = qdiv(qsub(u1, e), m), r2 = qdiv(qsub(u2, e), m), radL = a < 0 && b > 0 ? [[b, 0], [a, 1]] : [[a, 1], [b, 0]], RAD = rad(k, radL);
    var E = layoutSides(lay, RAD, a, b, k, m, e, c); E.v = v;
    var radTex = kRad(k, radT(radL, v)), rhs = m < 0 && e > 0 ? pT([[e, 0], [m, 1]], v) : linT(m, e, v), tex = eqTex(E);
    var rs = restrictLines([{ a: a, b: b }, { a: m, b: e }], v, ['radicand', (lay === 'iso' || lay === 'swap' ? 'other side' : 'other side after isolating')]);
    var pre = [], isoLine = lay === 'iso' || lay === 'swap' ? '' : 'Isolate: ' + t(radTex + '=' + rhs);
    if (isoLine) pre.push(isoLine);
    pre.push(rs.line);
    var sq = pT([[m * m, 2], [2 * m * e, 1], [e * e, 0]], v);
    pre.push(k > 1 ? 'Square (square the ' + t(String(k)) + ' as well): ' + t(K2 + '(' + linT(a, b, v) + ')=' + sq) : 'Square: ' + t(linT(a, b, v) + '=' + sq));
    var A2 = m * m, B2 = 2 * m * e - K2 * a, C2 = e * e - K2 * b;
    var f = finish(E, pre, A2, B2, C2, [r1, r2]);
    var out = { eq: E, tex: tex, v: v, a: a, b: b, k: k, m: m, e: e, c: c, layout: lay, r1: r1, r2: r2, u1: u1, u2: u2, roots: f.roots, ext: f.ext, checks: f.checks, lines: f.lines,
      radTex: radTex, rhsTex: rhs, isoLine: isoLine, restrict: rs, std: [A2, B2, C2], text: 'solve ' + tex };
    /* wrong root sets */
    var cands = [], put = function (vals, code, hint) { if (!vals || !vals.length) return; cands.push({ vals: vals, code: code, hint: hint }); };
    put(rootsQ(m * m, -K2 * a, e * e - K2 * b), 'u4l7-binom', 'Square the binomial side as a binomial: ' + t('(' + rhs + ')^{2}=' + sq) + ' — don’t forget the middle term ' + t(termTex(2 * m * e, 1, v, true)) + '.');
    if (k > 1) put(rootsQ(m * m, 2 * m * e - k * a, e * e - k * b), 'u4l7-coef', 'Square the coefficient too: ' + t('(' + k + '\\sqrt{A})^{2}=' + K2 + 'A') + '.');
    if (c && (lay === 'radc' || lay === 'crad' || lay === 'xminus')) { var ew = e + 2 * c; put(rootsQ(m * m, 2 * m * ew - K2 * a, ew * ew - K2 * b), 'u4rad-move-sign', 'Isolate the radical carefully: ' + (c > 0 ? 'subtract ' + t(String(c)) : 'add ' + t(String(-c))) + ' on both sides, so ' + t(radTex + '=' + rhs) + '.'); }
    if (lay === 'radx' || lay === 'xrad') put(rootsQ(m * m, -2 * m * e - K2 * a, e * e - K2 * b), 'u4rad-move-sign', 'Isolate the radical carefully: moving ' + t(termTex(-m, 1, v, true)) + ' to the other side changes its sign, so ' + t(radTex + '=' + rhs) + '.');
    if (qv(r1) || qv(r2)) put([qmul(r1, -1), qmul(r2, -1)], 'u4l7-sign', 'Check the signs of the roots: a factor ' + t('(' + v + '-7)') + ' gives ' + t(v + '=7') + ', and ' + t('(' + v + '+3)') + ' gives ' + t(v + '=-3') + '.');
    out.cands = cleanCands(cands, out.roots, out.ext);
    out.hints = ['State the restrictions' + (isoLine ? ', isolate the radical' : '') + ', then square both sides — square the binomial side with its middle term, ' + t('(a+b)^{2}=a^{2}+2ab+b^{2}') + '.', 'Write the quadratic in standard form, factor it, and verify every root in the <b>original</b> equation.'];
    return out;
  }
  function cleanCands(cands, roots, ext) {
    var T = roots.map(qv), X = ext.map(qv), out = [];
    cands.forEach(function (c) {
      var vs = c.vals.map(qv);
      if (sameSet(vs, T) || vs.every(function (x) { return has(T, x) || has(X, x); })) return;
      if (out.some(function (o) { return sameSet(o.vals.map(qv), vs); })) return;
      out.push(c);
    });
    return out;
  }

  /* ---------------- two radicals: √A − √B = c ('diff'), √A + √B = c ('sum'), √A = √B + c ('iso') ---------------- */
  function twoRad(o) {
    var v = o.v || 'x', a1 = o.a1, b1 = o.b1, a2 = o.a2, b2 = o.b2, c = o.c, fm = o.form || 'diff';
    var LA = [[a1, 1], [b1, 0]], LB = [[a2, 1], [b2, 0]], sA = radT(LA, v), sB = radT(LB, v), E;
    if (fm === 'sum') E = { L: [rad(1, LA), rad(1, LB)], R: [pol([[c, 0]])] };
    else if (fm === 'iso') E = { L: [rad(1, LA)], R: [rad(1, LB), pol([[c, 0]])] };
    else E = { L: [rad(1, LA), rad(-1, LB)], R: [pol([[c, 0]])] };
    E.v = v;
    var sg = fm === 'sum' ? -1 : 1, tex = eqTex(E);
    var rs = restrictLines([{ a: a1, b: b1 }, { a: a2, b: b2 }], v);
    var pre = [rs.line];
    if (fm !== 'iso') pre.push('Isolate one radical: ' + t(sA + '=' + c + (sg > 0 ? '+' : '-') + sB));
    pre.push('Square: ' + t(linT(a1, b1, v) + '=' + joinT([String(c * c), (sg > 0 ? '' : '-') + (2 * c) + sB, linT(a2, b2, v)])));
    var l1 = sg * (a1 - a2), l0 = sg * (b1 - b2 - c * c), L1 = linT(l1, l0, v), roots, A2 = 0, B2 = 0, C2 = 0, lin = !l1;
    pre.push('Collect the other terms: ' + t(L1 + '=' + (2 * c) + sB));
    if (lin) {
      var w = Q(l0, 2 * c);
      pre.push(t(sB + '=' + rT(w)) + (w[0] < 0 ? ' — a square root is never negative, so there is no solution. (Squaring anyway gives the extraneous value below.)' : ''));
      var x = qdiv(qsub(qmul(w, w), b2), a2);
      pre.push('Square again: ' + t(linT(a2, b2, v) + '=' + rT(qmul(w, w))) + (a2 === 1 && b2 === 0 ? '' : ' &nbsp;⇒&nbsp; ' + t(v + '=' + rT(x))));
      roots = [x];
    } else {
      A2 = l1 * l1; B2 = 2 * l1 * l0 - 4 * c * c * a2; C2 = l0 * l0 - 4 * c * c * b2;
      roots = rootsQ(A2, B2, C2);
      pre.push('Square again: ' + t(pT([[l1 * l1, 2], [2 * l1 * l0, 1], [l0 * l0, 0]], v) + '=' + (b2 === 0 ? termTex(4 * c * c * a2, 1, v, true) : 4 * c * c + '(' + linT(a2, b2, v) + ')')));
    }
    if (!roots) return null;
    var f = lin ? (function () { var r = finishChecks(E, roots); return { lines: pre.concat(r.lines), roots: r.roots, ext: r.ext, checks: r.checks }; })() : finish(E, pre, A2, B2, C2, roots, { zeroLeft: true });
    var out = { eq: E, tex: tex, v: v, lines: f.lines, roots: f.roots, ext: f.ext, checks: f.checks, all: roots, linear: lin, restrict: rs, text: 'solve ' + tex };
    var cands = [];
    var dA = fm === 'sum' ? a1 + a2 : a1 - a2, dB = fm === 'sum' ? b1 + b2 : b1 - b2;
    if (dA) cands.push({ vals: [Q(c * c - dB, dA)], code: 'u4l7-sq-terms', hint: 'Isolate one radical before squaring, and square the other side as a binomial: ' + t('(' + c + (sg > 0 ? '+' : '-') + '\\sqrt{B})^{2}=' + (c * c) + (sg > 0 ? '+' : '-') + (2 * c) + '\\sqrt{B}+B') + '. The middle term is the radical that remains: isolate it and square again.' });
    if (!lin) cands.push({ vals: roots.map(function (r) { return qmul(r, -1); }), code: 'u4l7-sign', hint: 'Check the signs of the roots from your factors.' });
    out.cands = cleanCands(cands, out.roots, out.ext);
    out.hints = ['State the restrictions. Isolate one radical, then square both sides (the other side is a binomial: keep its middle term).', 'One radical remains: isolate it and square again. Solve, then verify every root in the original equation.'];
    return out;
  }

  /* ---------------- ax + b√x + c = 0 by u = √x: g(p₁u + q₁)(p₂u + q₂) ---------------- */
  function subRad(o) {
    var v = o.v || 'x', f = o.f, g = o.g || 1, A = g * f[0][0] * f[1][0], Bc = g * (f[0][0] * f[1][1] + f[0][1] * f[1][0]), C = g * f[0][1] * f[1][1];
    var us = [Q(-f[0][1], f[0][0]), Q(-f[1][1], f[1][0])], E;
    if (o.layout === 'rhs') E = { L: [pol([[A, 1]]), rad(Bc, [[1, 1]])], R: [pol([[-C, 0]])] };
    else E = { L: [pol([[A, 1]]), rad(Bc, [[1, 1]]), pol([[C, 0]])], R: [] };
    E.v = v;
    var tex = eqTex(E), uq = pT([[A, 2], [Bc, 1], [C, 0]], 'u'), fac = facTex(A, us, 'u');
    var lines = ['Let ' + t('u=\\sqrt{' + v + '}') + ', so ' + t('u\\ge 0') + ' and ' + t(v + '=u^{2}') + ': &nbsp;' + t(uq + '=0') + (fac ? ' &nbsp;⇒&nbsp; ' + t(fac + '=0') : ''), 'So ' + rootsLine(us, 'u') + '.'];
    var good = us.filter(function (u) { return qv(u) >= 0; }), bad = us.filter(function (u) { return qv(u) < 0; });
    if (bad.length) lines.push(t('u=\\sqrt{' + v + '}\\ge 0') + ', so reject ' + bad.map(function (u) { return t('u=' + rT(u)); }).join(' and ') + '.');
    if (good.length) lines.push(good.map(function (u) { return t('\\sqrt{' + v + '}=' + rT(u)) + ' ⇒ ' + t(v + '=' + rT(qmul(u, u))); }).join('; ') + '.');
    var xs = good.map(function (u) { return qmul(u, u); });
    var r = finishChecks(E, xs), ext = bad.map(function (u) { return qmul(u, u); });
    ext.forEach(function (x) { r.checks[rT(x)] = checkX(E, x); });
    var out = { eq: E, tex: tex, v: v, us: us, A: A, B: Bc, C: C, lines: lines.concat(r.lines), roots: r.roots, ext: ext, checks: r.checks, text: 'solve ' + tex };
    out.cands = cleanCands([{ vals: good, code: 'u4l7-u', hint: 'Those are values of ' + t('u=\\sqrt{' + v + '}') + '. The question asks for ' + t(v) + ': ' + t(v + '=u^{2}') + '.' }], out.roots, out.ext);
    out.hints = ['Let ' + t('u=\\sqrt{' + v + '}') + ', so ' + t(v + '=u^{2}') + ': the equation becomes a quadratic in ' + t('u') + '.', 'Factor it. Reject any negative ' + t('u') + ' (a square root is never negative), then square each ' + t('u') + ' to get ' + t(v) + '.'];
    return out;
  }

  /* ============================== part makers ============================== */
  function solvePart(prompt, E, o) {
    o = o || {}; var v = E.v, T = E.roots.map(qv), X = E.ext.map(qv);
    var extHint = o.extHint || ('Verify every root in the <b>original</b> equation. ' + E.ext.map(function (x) { return E.checks[rT(x)] ? E.checks[rT(x)].line : ''; }).join(' '));
    var C = (E.cands || []).concat(o.cands || []);
    var p = R.P.solve(prompt, E.roots, { v: v, ext: E.ext, extHint: extHint, sol: o.sol || E.lines.join('<br>'), hints: o.hints || E.hints, text: o.text || E.text,
      noneHint: 'There is a root that checks. Solve the quadratic, then substitute each root into the original equation: keep the ones that work.' });
    var base = p.check;
    p.check = function (resp) {
      var A = R.readRoots(resp, v);
      if (A.vals && !sameSet(A.vals, T)) {
        var vals = A.vals;
        if (T.length === 2 && vals.length === 1 && has(T, vals[0])) return wrong('u4l7-both', 'That one checks — but verify the <b>other</b> root of the quadratic too. Squaring doesn’t always create an extraneous root: here it checks as well.');
        for (var i = 0; i < C.length; i++) { var cs = C[i].vals.map(qv); if (vals.every(function (x) { return has(cs, x); }) && vals.some(function (x) { return !has(T, x) && !has(X, x); })) return wrong(C[i].code, C[i].hint); }
      }
      return base(resp);
    };
    p.bad = (p.bad || []).concat(C.slice(0, 3).map(function (c) { return c.vals.map(function (x) { return v + '=' + rT(fracOf(qv(x))); }).join(','); }));
    if (E.roots.length === 2) p.bad.push(v + '=' + rT(E.roots[0]));
    if (E.roots.length > 1) p.good = [E.roots.slice().reverse().map(function (x) { return v + '=' + rT(x); }).join(',')];
    return p;
  }
  /* restrictions of k√(ax + b) = mx + e (after isolating): ax + b ≥ 0 and mx + e ≥ 0 */
  function restrictPart(prompt, E, o) {
    o = o || {}; var v = E.v, S = HW.sets;
    var rads = [{ a: E.a, b: E.b }, { a: E.m, b: E.e }], iR = R.restrictInfo([rads[0]], v), iS = R.restrictInfo([rads[1]], v), iB = R.restrictInfo(rads, v);
    var T = S.parse(iB.tex).set;
    var cands = [{ tex: iR.tex, code: 'u4l7-rhs', hint: 'That’s the radicand condition. A square root is never negative, so the other side, ' + t(E.rhsTex) + ', must be ' + t('\\ge 0') + ' too. Combine the two.' },
      { tex: iS.tex, code: 'u4l7-radicand', hint: 'That’s the condition on the other side. The radicand, ' + t(linT(E.a, E.b, v)) + ', must also be ' + t('\\ge 0') + '. Combine the two.' }]
      .concat(R.restrictCands(rads, v).filter(function (c) { return c.code !== 'u4rad-one'; }));
    var seen = [];
    cands = cands.filter(function (c) { var p = S.parse(c.tex); if (!p.ok || S.eq(p.set, T) || seen.some(function (s) { return S.eq(s, p.set); })) return false; seen.push(p.set); return true; });
    var sol = (E.isoLine ? E.isoLine + '<br>' : '') + 'Radicand: ' + iR.lines + '<br>' + (E.isoLine ? 'Other side' : 'Right side') + ': ' + iS.lines + '<br>Together: ' + t(iB.tex);
    return R.P.ineq(prompt, iB.tex, { v: v, cands: cands, sol: sol, text: o.text || 'restrictions for ' + E.tex,
      hints: o.hints || [(E.isoLine ? 'Isolate the radical first. ' : '') + 'Two things must be true: the radicand is ' + t('\\ge 0') + ', and the side the radical equals is ' + t('\\ge 0') + ' (a square root is never negative).', 'Solve each inequality (dividing by a negative reverses the sign), then combine them into one statement.'] });
  }

  /* ---- expanding a binomial with a radical ---- */
  function rootRadSimp(node) {
    var rd = node.a; while (rd && rd.t === 'paren') rd = rd.a;
    var r = P.read(rd); if (!r.ok) return null;
    var ts = P.terms(r.p); if (ts.length !== 1) return null;
    var c = ts[0].c; if (c[1] !== 1) return null;
    for (var s = Math.floor(Math.sqrt(Math.abs(c[0]))); s >= 2; s--) if (c[0] % (s * s) === 0) return s;
    return null;
  }
  function expIssue(ast) {
    var issue = null;
    (function walk(x) {
      if (!x || issue || typeof x !== 'object') return;
      var strip = function (y) { while (y && y.t === 'paren') y = y.a; return y; };
      if (x.t === 'root') { var s = rootRadSimp(x); if (s) issue = { code: 'u4l7-rad-simp', msg: 'Right value — now simplify the radical: take the perfect square ' + t(String(s * s)) + ' out (' + t('\\sqrt{' + (s * s) + 'x}=' + s + '\\sqrt{x}') + ').' }; return; }
      if (x.t === 'pow') { var bs = strip(x.a); if (bs && bs.t !== 'var' && bs.t !== 'num') { issue = { code: 'u4l7-expand', msg: 'Right value — now expand it fully: no powers of brackets or radicals left (' + t('(\\sqrt{A})^{2}=A') + ').' }; return; } }
      if (x.t === 'mul') { var l = strip(x.a), r = strip(x.b); if ((l && (l.t === 'add' || l.t === 'sub')) || (r && (r.t === 'add' || r.t === 'sub'))) { issue = { code: 'u4l7-expand', msg: 'Right value — now multiply out the brackets and simplify.' }; return; } }
      if (x.t === 'neg') { var n = strip(x.a); if (n && (n.t === 'add' || n.t === 'sub')) { issue = { code: 'u4l7-expand', msg: 'Right value — now remove the brackets and simplify.' }; return; } }
      ['a', 'b'].forEach(function (k) { walk(x[k]); });
    })(ast);
    return issue;
  }
  function countTerms(ast) { var n = 0; (function w(x) { while (x && x.t === 'paren' && x.a && (x.a.t === 'add' || x.a.t === 'sub')) x = x.a; if (x && (x.t === 'add' || x.t === 'sub')) { w(x.a); w(x.b); } else n++; })(ast); return n; }
  /* o: { v, f (target value), dom (lowest x), terms, key, wrongs: [{ f, code, hint }], sol, hints, text, bad } */
  function radExpandPart(prompt, o) {
    var v = o.v || 'x', xs = [0.37, 1.93, 4.31, 7.17, 11.61].map(function (d) { return o.dom + d; });
    var eqf = function (ast, f) { return xs.every(function (x) { var env = {}; env[v] = x; var a = ex.value(ast, env), b = f(x); return isFinite(a) && Math.abs(a - b) < 1e-7 * Math.max(1, Math.abs(b)); }); };
    var check = function (resp) {
      var a = K.read(resp); if (a.res) return a.res;
      var vs = Object.keys(ex.shape(a.ast).vars); if (vs.some(function (k) { return k !== v; })) return form('sol-letter', 'Use the variable ' + t(v) + ' only.');
      if (eqf(a.ast, o.f)) {
        var fi = expIssue(a.ast); if (fi) return form(fi.code, fi.msg);
        if (countTerms(a.ast) > o.terms) return form('u4l7-like', 'Right value — now collect the like terms (combine the numbers, and the ' + t(v) + ' terms).');
        return ok();
      }
      for (var i = 0; i < (o.wrongs || []).length; i++) if (eqf(a.ast, o.wrongs[i].f)) return wrong(o.wrongs[i].code, o.wrongs[i].hint);
      return wrong('value', null);
    };
    return { prompt: prompt, input: { type: 'math', keys: 'u4l7x', vars: [v], placeholder: 'e.g. x + 6√x + 9' }, check: check, key: o.key, answer: t(o.key), solution: o.sol, hints: o.hints || [], text: o.text, bad: o.bad || [], good: o.good || [] };
  }

  /* ---- a few shared generators ---- */
  /* AVOID: the isolated forms k√(ax + b) = mx + e of the lesson's examples and the booklet's questions (Lessons 7 and 8) */
  var AVOID = {};
  [[1, 12, 1, 1, 0], [3, 4, 1, 1, -2], [-3, 10, 1, -1, 2], [2, 7, 1, 1, 2], [1, 1, 2, 1, -2], [2, -3, 1, 2, -3], [1, 3, 1, 1, -3], [1, 9, 1, 1, -3], [-1, 8, 1, 1, 4], [2, -1, 1, 3, 0],
    [1, 5, 1, -1, 1], [1, 4, 1, 1, -2], [1, 42, 1, 1, 0], [5, 6, 1, 1, 0], [-3, 10, 1, 1, 0], [3, 10, 1, 1, 2], [1, 7, 1, 1, -5], [2, 6, 1, 1, -1], [1, -1, 3, 1, 1], [2, 1, 1, 2, -1],
    [1, 6, 1, 1, -6], [-1, 12, 1, 1, 0], [6, 1, 1, 2, -1], [1, 2, 1, 1, 0], [1, 2, 1, 1, -4], [-2, 6, 1, 1, 0], [1, 3, 1, -1, 3], [1, 30, 1, 1, 0], [7, -6, 1, 1, 0], [3, 7, 1, 1, -1],
    [-1, 11, 1, 1, 1], [1, 10, 1, 1, -2], [1, 3, 2, 1, 0], [4, 1, 1, 1, 1], [5, 14, 1, 1, 0], [6, -5, 1, 2, -3], [5, 1, 1, 1, 1], [1, 9, 1, 1, -3], [1, 14, 1, 1, 2], [1, 8, 1, 1, -4],
    [1, 1, 1, 1, -5], [2, 9, 1, 1, -3], [2, -1, 1, 1, -2]].forEach(function (s) { AVOID[s.join('|')] = 1; });
  function fresh(E) { return E && !AVOID[[E.a, E.b, E.k, E.m, E.e].join('|')]; }
  /* random quadRad with conditions: o = { k, m, e: [lo, hi] | list, u1: list, u2: list, layout, c: list, test } */
  function pickQ(r, o) {
    return pickWhere(function () {
      var e = Array.isArray(o.e) ? r.pick(o.e) : o.e, c = o.c ? r.pick(o.c) : 0;
      return quadRad({ v: o.v, k: o.k ? (Array.isArray(o.k) ? r.pick(o.k) : o.k) : 1, m: Array.isArray(o.m) ? r.pick(o.m) : (o.m || 1), e: e, u1: r.pick(o.u1), u2: r.pick(o.u2), layout: o.layout, c: c });
    }, function (E) { return fresh(E) && (!o.test || o.test(E)); });
  }
  function negs(a, b) { return range(a, b).map(function (x) { return -x; }); }
  function halfInt(r) { r = qq(r); return r[1] === 1 || r[1] === 2; }
  function nice(E) { return [E.r1, E.r2].every(function (x) { return isInt(x) && Math.abs(qv(x)) <= 40; }) && Math.abs(E.a) <= 40 && Math.abs(E.b) <= 99; }

  var U7 = HW.u4r7 = { rad: rad, pol: pol, eqTex: eqTex, checkX: checkX, facTex: facTex, finish: finish, finishChecks: finishChecks, quadRad: quadRad, twoRad: twoRad, subRad: subRad,
    solvePart: solvePart, restrictPart: restrictPart, radExpandPart: radExpandPart, pickQ: pickQ, fresh: fresh, nice: nice, rootsQ: rootsQ, restrictLines: restrictLines, cleanCands: cleanCands,
    gcd: gcd, same: same, range: range, pm: pm, negs: negs, pickWhere: pickWhere, qsub: qsub, qeq: qeq, isInt: isInt, sqrtQ: sqrtQ, has: has, sameSet: sameSet, joinT: joinT, rootsLine: rootsLine };

  /* keypad: the poly keypad with a square-root key */
  var W = HW.widgets;
  if (W && W.KEYSETS) {
    W.KEYSETS.u4l7x = function (opt) {
      var base = W.KEYSETS.poly ? W.KEYSETS.poly(opt) : [[]];
      var rows = base.map(function (rw) { return rw.slice(); });
      if (rows[2]) rows[2].splice(3, 0, { label: '√', tex: '\\sqrt{#0}', plain: 'sqrt(', title: 'Square root' }); else rows[0].push({ label: '√', tex: '\\sqrt{#0}', plain: 'sqrt(', title: 'Square root' });
      return rows;
    };
    W.KEYHELP = W.KEYHELP || {};
    W.KEYHELP.u4l7x = ['Use <b>√</b> for a square root (press <b>▶</b> to step out of it) and <b>x<sup>2</sup></b> for a square.', 'Type e.g. <code>x + 6sqrt(x) + 9</code>.'];
  }

  /* ============================== Lesson 7 generators ============================== */
  function binSqPart(r, kind) {
    var v = 'x', p, a, b, tgt, shown, sol, W = [], txt;
    if (kind === 'a') { p = pickWhere(function () { return r.int(2, 12); }, function (p) { return p !== 3 && p !== 7 && p !== 2; }); shown = '(x-' + p + ')^{2}'; tgt = P.parse('x^2-' + 2 * p + 'x+' + p * p);
      W = [{ is: P.parse('x^2+' + p * p), code: 'u4l7-binom', hint: t(shown) + ' means ' + t('(x-' + p + ')(x-' + p + ')') + ': there is a middle term, ' + t('2(x)(-' + p + ')=-' + 2 * p + 'x') + '.' }, { is: P.parse('x^2-' + p * p), code: 'u4l7-binom', hint: 'Multiply ' + t('(x-' + p + ')(x-' + p + ')') + ' term by term: the middle term is ' + t('-' + 2 * p + 'x') + ' and ' + t('(-' + p + ')^{2}=+' + p * p) + '.' }, { is: P.parse('x^2-' + p + 'x+' + p * p), code: 'u4l7-double', hint: 'The middle term is ' + t('2ab') + ': double ' + t('(x)(-' + p + ')') + '.' }];
      sol = t(shown + '=x^{2}-2(x)(' + p + ')+' + p + '^{2}=' + P.tex(tgt)); txt = 'square (x − a)';
    } else {
      var o = pickWhere(function () { return { a: r.int(2, 5), b: r.int(1, 9) }; }, function (o) { return gcd(o.a, o.b) === 1 && !(o.a === 3 && o.b === 2) && !(o.a === 2 && o.b === 5) && !(o.a === 2 && o.b === 3); });
      a = o.a; b = o.b;
      shown = kind === 'b' ? '(' + a + 'x-' + b + ')^{2}' : '(' + b + '-' + a + 'x)^{2}';
      tgt = P.parse(a * a + 'x^2-' + 2 * a * b + 'x+' + b * b);
      W = [{ is: P.parse(a * a + 'x^2+' + b * b), code: 'u4l7-binom', hint: 'Don’t square each term separately: the middle term is ' + t('2ab=2(' + (kind === 'b' ? a + 'x)(-' + b : b + ')(-' + a + 'x') + ')=-' + 2 * a * b + 'x') + '.' },
        { is: P.parse(a + 'x^2-' + 2 * a * b + 'x+' + b * b), code: 'u4l7-coef', hint: 'Square the coefficient too: ' + t('(' + a + 'x)^{2}=' + a * a + 'x^{2}') + '.' }, { is: P.parse(a * a + 'x^2-' + a * b + 'x+' + b * b), code: 'u4l7-double', hint: 'The middle term is ' + t('2ab') + ': double the product of the two terms.' }];
      sol = t(shown + '=' + (kind === 'b' ? '(' + a + 'x)^{2}-2(' + a + 'x)(' + b + ')+' + b + '^{2}' : b + '^{2}-2(' + b + ')(' + a + 'x)+(' + a + 'x)^{2}') + '=' + (kind === 'b' ? P.tex(tgt) : (b * b) + '-' + 2 * a * b + 'x+' + a * a + 'x^{2}')) + (kind === 'c' ? ', or ' + t(P.tex(tgt)) : '');
      txt = kind === 'b' ? 'square (ax − b)' : 'square (b − ax)';
    }
    var part = K.P.poly(t(shown), tgt, { wrong: W }, sol, ['Use the pattern ' + t('(a-b)^{2}=a^{2}-2ab+b^{2}') + ' — never square each term separately.', 'Square the first term, double the product of the two terms (with its sign), square the last term.'], txt);
    part.bad = W.map(function (w) { return P.tex(w.is); });
    return part;
  }
  function radSqPart(r, kind) {
    var v = 'x';
    if (kind === 'd') {
      var p = pickWhere(function () { return r.int(2, 9); }, function (p) { return p !== 2 && p !== 4; });
      var key = 'x+' + 2 * p + '\\sqrt{x}+' + p * p;
      return radExpandPart(t('\\left(' + p + '+\\sqrt{x}\\right)^{2}'), { v: v, dom: 0, terms: 3, key: key, f: function (x) { return Math.pow(p + Math.sqrt(x), 2); },
        wrongs: [{ f: function (x) { return p * p + x; }, code: 'u4l7-binom', hint: 'The square of a binomial has a middle term: ' + t('2(' + p + ')(\\sqrt{x})=' + 2 * p + '\\sqrt{x}') + '.' }, { f: function (x) { return p * p + p * Math.sqrt(x) + x; }, code: 'u4l7-double', hint: 'The middle term is ' + t('2ab') + ': ' + t('2(' + p + ')\\sqrt{x}') + '.' }],
        sol: t('=' + p + '^{2}+2(' + p + ')\\sqrt{x}+\\left(\\sqrt{x}\\right)^{2}=' + p * p + '+' + 2 * p + '\\sqrt{x}+x') + ', i.e. ' + t(key), hints: ['Use ' + t('(a+b)^{2}=a^{2}+2ab+b^{2}') + ' with ' + t('a=' + p) + ' and ' + t('b=\\sqrt{x}') + '.', t('\\left(\\sqrt{x}\\right)^{2}=x') + '.'], text: 'square (p + √x)', bad: ['x+' + p * p] });
    }
    if (kind === 'e') {
      var o = pickWhere(function () { return { a: r.int(2, 5), b: r.int(1, 7) }; }, function (o) { return !(o.a === 2 && o.b === 3) && gcd(o.a, o.b) === 1; });
      var A = o.a * o.a, M = 2 * o.a * o.b, key2 = A + 'x-' + M + '\\sqrt{x}+' + o.b * o.b;
      return radExpandPart(t('\\left(' + o.a + '\\sqrt{x}-' + o.b + '\\right)^{2}'), { v: v, dom: 0, terms: 3, key: key2, f: function (x) { return Math.pow(o.a * Math.sqrt(x) - o.b, 2); },
        wrongs: [{ f: function (x) { return o.a * x - M * Math.sqrt(x) + o.b * o.b; }, code: 'u4l7-coef', hint: 'Square the coefficient too: ' + t('\\left(' + o.a + '\\sqrt{x}\\right)^{2}=' + A + 'x') + ', not ' + t(o.a + 'x') + '.' },
          { f: function (x) { return A * x + o.b * o.b; }, code: 'u4l7-binom', hint: 'Don’t forget the middle term ' + t('2ab=2(' + o.a + '\\sqrt{x})(-' + o.b + ')') + '.' }, { f: function (x) { return A * x + M * Math.sqrt(x) + o.b * o.b; }, code: 'sign', hint: 'The middle term has the sign of the product ' + t('(' + o.a + '\\sqrt{x})(-' + o.b + ')') + ': it is negative.' },
          { f: function (x) { return A * x - o.a * o.b * Math.sqrt(x) + o.b * o.b; }, code: 'u4l7-double', hint: 'The middle term is ' + t('2ab') + ': double the product.' }],
        sol: t('=\\left(' + o.a + '\\sqrt{x}\\right)^{2}-2(' + o.a + '\\sqrt{x})(' + o.b + ')+' + o.b + '^{2}=' + key2), hints: ['Use ' + t('(a-b)^{2}=a^{2}-2ab+b^{2}') + ' with ' + t('a=' + o.a + '\\sqrt{x}') + ' and ' + t('b=' + o.b) + '.', t('\\left(k\\sqrt{x}\\right)^{2}=k^{2}x') + ': square the coefficient too.'], text: 'square (a√x − b)', bad: [A + 'x+' + o.b * o.b, o.a + 'x-' + M + '\\sqrt{x}+' + o.b * o.b] });
    }
    var q = pickWhere(function () { return { h: r.pick(pm(1, 9)), p: r.pick(pm(1, 5)) }; }, function (q) { return !(q.h === -2 && q.p === 1) && !(q.h === 1 && q.p === -3); });
    var h = q.h, pp = q.p, cst = h + pp * pp, radx = '\\sqrt{' + linT(1, h) + '}', key3 = joinT([linT(1, cst), (pp < 0 ? '-' : '') + (Math.abs(2 * pp) === 1 ? '' : Math.abs(2 * pp)) + radx]);
    var shown = '\\left(' + radx + (pp > 0 ? '+' : '-') + Math.abs(pp) + '\\right)^{2}';
    return radExpandPart(t(shown), { v: v, dom: -h, terms: cst ? 3 : 2, key: key3, f: function (x) { return Math.pow(Math.sqrt(x + h) + pp, 2); },
      wrongs: [{ f: function (x) { return x + h + pp * pp; }, code: 'u4l7-binom', hint: 'There is a middle term: ' + t('2(' + radx + ')(' + pp + ')') + '. It is the radical that remains.' }, { f: function (x) { return x + h + pp * Math.sqrt(x + h) + pp * pp; }, code: 'u4l7-double', hint: 'The middle term is ' + t('2ab') + ': double the product of the two terms.' },
        { f: function (x) { return x * x + h * h + 2 * pp * Math.sqrt(x + h) + pp * pp; }, code: 'u4l7-expand', hint: t('\\left(' + radx + '\\right)^{2}=' + linT(1, h)) + ': squaring a square root gives back the radicand.' }],
      sol: t('=\\left(' + radx + '\\right)^{2}' + (pp > 0 ? '+' : '-') + Math.abs(2 * pp) + radx + '+' + pp * pp + '=(' + linT(1, h) + ')' + (pp > 0 ? '+' : '-') + Math.abs(2 * pp) + radx + '+' + pp * pp) + '<br>' + t('=' + key3), hints: ['Use the square of a binomial with ' + t('a=' + radx) + ' and ' + t('b=' + pp) + '.', t('\\left(' + radx + '\\right)^{2}=' + linT(1, h)) + '; then collect the numbers.'], text: 'square (√(x + h) + p)' });
  }

  /* Q3: the student's error, families √(x + d²) = x ∓ d */
  function q3shared(r) {
    return pickWhere(function () { return { d: r.int(2, 8), minus: r.chance(0.6) }; }, function (o) { return !(o.d === 2 && o.minus); });
  }
  function q3E(s) { return s.minus ? quadRad({ m: 1, e: -s.d, u1: s.d + 1, u2: -s.d }) : quadRad({ m: 1, e: s.d, u1: s.d, u2: 1 - s.d }); }

  /* Q7: the graph */
  function q7shared(r) {
    return pickWhere(function () { var u1 = r.pick([2, 3]), e = r.int(-3, 2); return quadRad({ m: 1, e: e, u1: u1, u2: 1 - u1 }); }, function (E) { return fresh(E) && E.b >= -3 && E.b <= 7 && Math.abs(qv(E.r1)) <= 7 && qv(E.r2) >= -E.b; });
  }
  function q7graph(E) {
    var b = E.b, e = E.e, r1 = qv(E.r1), xl = Math.min(-b, qv(E.r2)) - 1, xh = Math.max(r1, 2) + 3, yl = Math.min(-3, qv(E.u2) - 1), yh = Math.max(4, Math.ceil(Math.sqrt(xh + b)) + 1);
    xl = Math.floor(xl); xh = Math.ceil(xh);
    return '<div class="fig">' + HW.graph({ x: [xl, xh], y: [yl, yh], grid: 1, labels: 2, max: 320, aria: 'graphs of y = square root of (x + ' + b + ') and y = x + ' + e,
      fns: [{ f: function (x) { return Math.sqrt(x + b); }, from: -b, to: xh, start: 'closed' }, { f: function (x) { return x + e; }, from: Math.max(xl, yl - e), to: Math.min(xh, yh - e), color: '#b0413e' }],
      points: [{ x: r1, y: qv(E.u1) }] }) + '</div><div class="fig-cap">Blue: ' + t('y=\\sqrt{' + linT(1, b) + '}') + ' &nbsp; Red: ' + t('y=' + linT(1, e)) + '</div>';
  }

  /* Q10: √(αx − β) − √x = c */
  function q10shared(r) {
    return pickWhere(function () {
      var al = r.pick([2, 3]), n = r.int(2, 7), c = r.pick([1, 1, 2]), be = al * n * n - (n + c) * (n + c);
      if (be <= 0) return null;
      var E = twoRad({ a1: al, b1: -be, a2: 1, b2: 0, c: c, form: 'diff' }); if (!E) return null; E.al = al; E.be = be; E.c = c; E.n = n; return E;
    }, function (E) { return E.roots.length === 1 && E.ext.length === 1 && isInt(E.ext[0]) && qv(E.ext[0]) >= 0 && !(E.al === 2 && E.be === 7 && E.c === 1); });
  }
  var TIMES = { 1: '', 2: 'twice', 3: 'three times', 4: 'four times', 5: 'five times', 6: 'six times' };

  /* Q12: distance */
  var OFFS = { 5: [[3, 4], [4, 3], [5, 0], [0, 5]], 10: [[6, 8], [8, 6], [10, 0], [0, 10]], 13: [[5, 12], [12, 5], [13, 0], [0, 13]] };
  function allOffs(d) { var out = []; OFFS[d].forEach(function (o) { [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(function (s) { var p = [o[0] * s[0], o[1] * s[1]]; if (!out.some(function (q) { return q[0] === p[0] && q[1] === p[1]; })) out.push(p); }); }); return out; }
  function q12shared(r) {
    return pickWhere(function () {
      var d = r.pick([5, 5, 10, 13]), os = allOffs(d), o1 = r.pick(os), o2 = r.pick(os), x1 = r.int(-4, 4), y1 = r.int(-4, 5);
      if (o1[0] === o2[0]) return null;
      var p = (o2[1] - o1[1]) / (o2[0] - o1[0]); if (p % 1 || !p || Math.abs(p) > 3) return null;
      var B1 = [x1 + o1[0], y1 + o1[1]], B2 = [x1 + o2[0], y1 + o2[1]], q = B1[1] - p * B1[0];
      return { d: d, x1: x1, y1: y1, p: p, q: q, k1: B1[0], k2: B2[0], B1: B1, B2: B2 };
    }, function (o) { return Math.abs(o.q) <= 9 && !(o.x1 === -1 && o.y1 === 3 && o.p === 2 && o.q === 0) && Math.abs(o.k1) <= 15 && Math.abs(o.k2) <= 15 && o.k1 + o.k2 !== 0; });
  }
  function q12tex(s) {
    var dx = s.x1 === 0 ? 'k^{2}' : '(' + linT(1, -s.x1, 'k') + ')^{2}', dy = '(' + linT(s.p, s.q - s.y1, 'k') + ')^{2}';
    if (s.p === 1 && s.q === s.y1) dy = 'k^{2}';
    return '\\sqrt{' + dx + '+' + dy + '}=' + s.d;
  }

  /* Q11 / B3 / Q17: the number problems by u = √x */
  function q11shared(r) {
    return pickWhere(function () { return { al: r.int(1, 4), be: r.int(1, 7), ga: r.int(1, 3), de: r.int(1, 4) }; }, function (o) {
      return o.al * o.de - o.be * o.ga === -1 && gcd(o.al, o.be) === 1 && gcd(o.ga, o.de) === 1 && o.al * o.ga <= 6 && o.be * o.de <= 30 && o.al !== o.be && !(o.al === 2 && o.be === 3 && o.ga === 1 && o.de === 1);
    });
  }

  /* ============================== the assignment ============================== */
  var QUESTIONS = [
    { num: '1', section: 'Binomial squares and restrictions', stem: 'Expand and simplify. Assume each radicand is non-negative.', parts: [
      { id: '1a', level: 'BEG', make: function (r) { return binSqPart(r, 'a'); } },
      { id: '1b', level: 'BEG', make: function (r) { return binSqPart(r, 'b'); } },
      { id: '1c', level: 'EMG', make: function (r) { return binSqPart(r, 'c'); } },
      { id: '1d', level: 'EMG', make: function (r) { return radSqPart(r, 'd'); } },
      { id: '1e', level: 'PRG', make: function (r) { return radSqPart(r, 'e'); } },
      { id: '1f', level: 'PRG', make: function (r) { return radSqPart(r, 'f'); } }] },
    { num: '2', stem: 'State the restrictions on ' + t('x') + ' for each equation.', parts: [
      { id: '2a', level: 'BEG', make: function (r) { var E = pickQ(r, { e: negs(1, 9), u1: range(1, 9), u2: negs(1, 9), test: function (E) { return E.a === 1 && E.b > 0 && E.b <= 20; } }); return restrictPart(t(E.tex), E); } },
      { id: '2b', level: 'EMG', make: function (r) { var E = pickQ(r, { e: range(1, 9), u1: range(1, 9), u2: negs(1, 9), test: function (E) { return E.a === -1 && E.b > 0 && E.b <= 15; } }); return restrictPart(t(E.tex), E); } },
      { id: '2c', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(2, 5), b: r.int(1, 9), m: r.int(2, 4) }; }, function (o) { return gcd(o.a, o.b) === 1 && o.b % o.a !== 0 && !(o.a === 2 && o.b === 1 && o.m === 3); });
        var E = { v: 'x', a: o.a, b: -o.b, m: o.m, e: 0, rhsTex: o.m + 'x', isoLine: '', tex: '\\sqrt{' + linT(o.a, -o.b) + '}=' + o.m + 'x' };
        return restrictPart(t(E.tex), E);
      } },
      { id: '2d', level: 'PRG', make: function (r) { var E = pickQ(r, { m: -1, e: range(1, 6), u1: range(1, 8), u2: negs(1, 8), layout: 'xrad', test: function (E) { return E.a === 1 && E.b > 0 && E.b <= 12; } }); return restrictPart(t(E.tex), E); } }] },
    { num: '3', stem: function (s) {
        var E = q3E(s), d = s.d;
        return 'A student solved ' + t(E.tex) + ' as shown.<div class="work">' + t('x+' + d * d + '=x^{2}+' + d * d + '\\quad\\Rightarrow\\quad x^{2}-x=0\\quad\\Rightarrow\\quad x(x-1)=0\\quad\\Rightarrow\\quad x=0\\text{ or }x=1') + '</div>';
      }, shared: q3shared, parts: [
      { id: '3a', level: 'EMG', make: function (r, s) {
        var d = s.d, sgn = s.minus ? '-' : '+', br = '(x' + sgn + d + ')^{2}';
        return B.mc(r, 'Explain the error.', [
          { html: t(br) + ' was written as ' + t('x^{2}+' + d * d) + '. The middle term is missing: ' + t(br + '=x^{2}' + sgn + 2 * d + 'x+' + d * d) + '.', right: true },
          { html: 'Squaring both sides isn’t allowed when ' + t('x') + ' is outside the radical; the student should have graphed instead.', why: 'Squaring both sides is the right method — it just has to be done correctly (and the roots checked).' },
          { html: t('x^{2}-x=0') + ' was factored wrongly: it should be ' + t('(x-1)(x+1)=0') + '.', why: t('x(x-1)') + ' is the correct factoring of ' + t('x^{2}-x') + ' — expand it to check. The mistake comes earlier.' },
          { html: 'The left side was squared wrongly: ' + t('\\left(\\sqrt{x+' + d * d + '}\\right)^{2}') + ' should be ' + t('x^{2}+' + Math.pow(d, 4)) + '.', why: 'Squaring a square root gives back the radicand: ' + t('\\left(\\sqrt{x+' + d * d + '}\\right)^{2}=x+' + d * d) + '. That step was right.' }],
          t(br) + ' was written as ' + t('x^{2}+' + d * d) + ': the middle term is missing. ' + t(br + '=x^{2}' + sgn + 2 * d + 'x+' + d * d) + '. (The student also did not check the roots.)', ['Expand ' + t(br) + ' yourself and compare with the student’s right side.'], 'MC: explain the binomial-square error');
      } },
      { id: '3b', level: 'PRG', make: function (r, s) { return solvePart('Solve the equation correctly and verify.', q3E(s)); } }] },
    { num: '4', section: 'Solving and verifying', stem: 'Solve and verify. Identify any extraneous roots.', parts: [
      { id: '4a', level: 'EMG', make: function (r) { var E = pickQ(r, { e: 0, u1: range(3, 13), u2: negs(2, 12), test: function (E) { return E.a === 1; } }); return solvePart(t(E.tex), E); } },
      { id: '4b', level: 'EMG', make: function (r) { var E = pickQ(r, { e: 0, u1: range(3, 12), u2: negs(1, 6), test: function (E) { return E.a >= 2 && E.b > 0; } }); return solvePart(t(E.tex), E); } },
      { id: '4c', level: 'PRG', make: function (r) { var E = pickQ(r, { e: 0, u1: range(1, 8), u2: negs(2, 10), layout: 'swap', test: function (E) { return E.a < 0 && E.b > 0; } }); return solvePart(t(E.tex), E); } },
      { id: '4d', level: 'PRG', make: function (r) { var E = pickQ(r, { e: pm(1, 5), u1: range(1, 9), u2: negs(1, 6), test: function (E) { return E.a >= 1 && nice(E); } }); return solvePart(t(E.tex), E); } }] },
    { num: '5', stem: 'Isolate the radical, then solve and verify.', parts: [
      { id: '5a', level: 'PRG', make: function (r) { var E = pickQ(r, { e: negs(1, 8), c: range(1, 8), u1: range(1, 9), u2: negs(1, 7), layout: 'radc', test: function (E) { return E.a === 1 && E.e + E.c === 0 && nice(E); } }); return solvePart(t(E.tex), E); } },
      { id: '5b', level: 'PRG', make: function (r) { var E = pickQ(r, { e: negs(1, 6), c: range(1, 6), u1: range(1, 9), u2: negs(1, 6), layout: 'xminus', test: function (E) { return E.e + E.c === 0 && E.a >= 1 && E.a <= 4 && nice(E); } }); return solvePart(t(E.tex), E); } },
      { id: '5c', level: 'PRG', make: function (r) {
        var opts = [[3, 1, [3, 6]], [2, 2, [2, 6]], [3, 2, [3, 15]], [3, 2, [6, 12]], [2, 3, [2, 10]], [2, 3, [4, 8]], [3, 3, [3, 24]], [3, 3, [6, 21]], [3, 3, [9, 18]], [2, 4, [2, 14]], [2, 4, [6, 10]]];
        var E = pickWhere(function () { var o = r.pick(opts), us = r.chance(0.5) ? o[2] : [o[2][1], o[2][0]]; return quadRad({ k: o[0], m: 1, e: r.int(-3, 6), u1: us[0], u2: us[1] }); }, function (E) { return fresh(E) && E.b !== 0 && E.roots.length === 2 && nice(E); });
        return solvePart(t(E.tex), E);
      } },
      { id: '5d', level: 'ADV', make: function (r) { var E = pickQ(r, { m: 2, e: negs(1, 5), c: range(1, 5), u1: range(1, 6), u2: negs(1, 4), layout: 'xminus', test: function (E) { return E.e + E.c === 0 && !isInt(E.r1) && halfInt(E.r1) && halfInt(E.r2) && E.a > 0 && E.a <= 16; } }); return solvePart(t(E.tex), E); } }] },
    { num: '6', stem: 'Solve and verify. (The radicand contains ' + t('x^{2}') + ', but the steps are the same.)', parts: [
      { id: '6a', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { r1: r.pick(pm(1, 10)), r2: r.pick(pm(1, 10)), n: r.int(2, 8), zero: r.chance(0.5) }; }, function (o) {
          var be = -(o.r1 + o.r2), ga = o.r1 * o.r2 + o.n * o.n; o.be = be; o.ga = o.zero ? 0 : ga;
          if (o.zero) { if (o.r1 * o.r2 !== -o.n * o.n) return false; }
          return o.r1 < o.r2 && be !== 0 && !(be === -5 && o.ga === 0 && o.n === 6) && Math.abs(o.ga) <= 60;
        });
        var E = { L: [rad(1, [[1, 2], [o.be, 1], [o.ga, 0]])], R: [pol([[o.n, 0]])], v: 'x' }, rl = pT([[1, 2], [o.be, 1], [o.ga, 0]]);
        var f = finish(E, ['Square: ' + t(rl + '=' + o.n * o.n)], 1, o.be, o.ga - o.n * o.n, [Q(o.r1, 1), Q(o.r2, 1)], { zeroLeft: true });
        E.lines = f.lines; E.roots = f.roots; E.ext = f.ext; E.checks = f.checks; E.cands = cleanCands([{ vals: [Q(-o.r1, 1), Q(-o.r2, 1)], code: 'u4l7-sign', hint: 'Check the signs of the roots from your factors.' }], f.roots, f.ext);
        E.hints = ['Square both sides, then move every term to one side and factor.', 'Verify both roots: here the radicand equals ' + t(String(o.n * o.n)) + ' at both of them.'];
        return solvePart(t(eqTex(E)), E);
      } },
      { id: '6b', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { e: r.pick([1, 2, 3, -1]), r1: r.int(2, 12) }; }, function (o) { o.r2 = 2 * o.e - o.r1; o.ga = o.r1 * o.r2 + o.e * o.e; return o.r1 + o.e >= 0 && o.r2 + o.e < 0 && o.ga !== 0 && Math.abs(o.ga) <= 60 && !(o.e === 1 && o.r1 === 4); });
        var E = { L: [rad(1, [[2, 2], [o.ga, 0]])], R: [pol([[1, 1], [o.e, 0]])], v: 'x' };
        var f = finish(E, ['Square: ' + t(pT([[2, 2], [o.ga, 0]]) + '=' + pT([[1, 2], [2 * o.e, 1], [o.e * o.e, 0]]))], 1, -2 * o.e, o.ga - o.e * o.e, [Q(o.r1, 1), Q(o.r2, 1)], { zeroLeft: true });
        E.lines = f.lines; E.roots = f.roots; E.ext = f.ext; E.checks = f.checks;
        E.cands = cleanCands([{ vals: rootsQ(1, 0, o.ga - o.e * o.e), code: 'u4l7-binom', hint: 'Square the right side as a binomial: ' + t('(' + linT(1, o.e) + ')^{2}=' + pT([[1, 2], [2 * o.e, 1], [o.e * o.e, 0]])) + '.' }, { vals: [Q(-o.r1, 1), Q(-o.r2, 1)], code: 'u4l7-sign', hint: 'Check the signs of the roots from your factors.' }].filter(function (c) { return c.vals; }), f.roots, f.ext);
        E.hints = ['Square both sides (the right side is a binomial), collect every term on one side and factor.', 'Verify each root: the right side, ' + t(linT(1, o.e)) + ', can’t be negative.'];
        return solvePart(t(eqTex(E)), E);
      } },
      { id: '6c', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { r1: r.int(2, 10), r2: -r.int(1, 8) }; }, function (o) { return o.r1 + o.r2 > 0 && !(o.r1 === 4 && o.r2 === -2); });
        var de = o.r1 + o.r2, ga = o.r1 * o.r2;
        var E = { L: [rad(1, [[1, 2], [ga, 0]])], R: [rad(1, [[de, 1]])], v: 'x' };
        var f = finish(E, ['Square: ' + t(pT([[1, 2], [ga, 0]]) + '=' + pT([[de, 1]]))], 1, -de, ga, [Q(o.r1, 1), Q(o.r2, 1)], { zeroLeft: true });
        E.lines = f.lines; E.roots = f.roots; E.ext = f.ext; E.checks = f.checks; E.cands = cleanCands([{ vals: [Q(-o.r1, 1), Q(-o.r2, 1)], code: 'u4l7-sign', hint: 'Check the signs of the roots from your factors.' }], f.roots, f.ext);
        E.hints = ['Both sides are single radicals: square both sides, then solve the quadratic.', 'Verify each root: a negative radicand means the square root is undefined.'];
        return solvePart(t(eqTex(E)), E, { extHint: 'Verify every root in the original equation. ' + E.checks[rT(Q(o.r2, 1))].line });
      } }] },
    { num: '7', section: 'Extraneous roots on a graph', stem: function (E) { return 'The graphs of ' + t('y=\\sqrt{' + linT(1, E.b) + '}') + ' and ' + t('y=' + linT(1, E.e)) + ' are shown.' + q7graph(E); }, shared: q7shared, parts: [
      { id: '7a', level: 'PRG', make: function (r, E) { return solvePart('Solve ' + t(E.tex) + ' algebraically.', E); } },
      { id: '7b', level: 'ADV', make: function (r, E) {
        var r1 = rT(E.r1), r2 = rT(E.r2), y1 = rT(E.u1), yc = rT(qmul(E.u2, -1)), yl = rT(E.u2);
        return B.mc(r, 'Use the graph to explain why one of your answers in (a) is extraneous.', [
          { html: 'The graphs meet only at ' + t('(' + r1 + ',\\ ' + y1 + ')') + '. At ' + t('x=' + r2) + ' the curve is at ' + t('y=' + yc) + ' but the line is at ' + t('y=' + yl) + ', so they don’t meet there: ' + t('x=' + r2) + ' solves ' + t('\\sqrt{' + linT(1, E.b) + '}=-(' + linT(1, E.e) + ')') + ' instead.', right: true },
          { html: 'Both graphs are defined at ' + t('x=' + r2) + ', so they meet there and both answers are roots.', why: 'Being defined isn’t enough: at ' + t('x=' + r2) + ' the curve is at ' + t('y=' + yc) + ' and the line at ' + t('y=' + yl) + '.' },
          { html: 'The curve ' + t('y=\\sqrt{' + linT(1, E.b) + '}') + ' doesn’t exist at ' + t('x=' + r2) + ', so that answer is extraneous.', why: 'The curve starts at ' + t('x=' + (-E.b)) + ', so it does exist at ' + t('x=' + r2) + '. Compare the two ' + t('y') + '-values there.' },
          { html: 'The graphs meet twice, so both answers are roots.', why: 'Look again: the curve is never below the ' + t('x') + '-axis, but at ' + t('x=' + r2) + ' the line is.' }],
          'The roots of the equation are the ' + t('x') + '-coordinates of the points where the graphs meet. They meet only at ' + t('(' + r1 + ',\\ ' + y1 + ')') + '. At ' + t('x=' + r2) + ' the curve is at ' + t('y=' + yc) + ' but the line is at ' + t('y=' + yl) + '. ' + t('x=' + r2) + ' solves ' + t('\\sqrt{' + linT(1, E.b) + '}=-(' + linT(1, E.e) + ')') + ', which squaring also solved.',
          ['Where do the two graphs actually cross?', 'At the other value of ' + t('x') + ', compare the height of the curve with the height of the line.'], 'MC: extraneous root on a graph');
      } }] },
    { num: '8', section: 'Equations like x + √x = 12', stem: 'Solve each equation. Use either method (isolate and square, or let ' + t('u=\\sqrt{x}') + ').', parts: [
      { id: '8a', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { b: r.pick([1, 1, 2, 3]), p: r.int(2, 9) }; }, function (o) { return !(o.b === 1 && (o.p === 3 || o.p === 4)) && !(o.b === 2 && o.p === 4) && !(o.b === 3 && o.p === 5); });
        var E = subRad({ f: [[1, -o.p], [1, o.p + o.b]], layout: 'rhs' });
        return solvePart(t(E.tex), E);
      } },
      { id: '8b', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { p1: r.pick([2, 3, 4]), q1: r.int(1, 5), q2: r.int(1, 6) }; }, function (o) { return gcd(o.p1, o.q1) === 1 && o.q1 !== o.p1 * o.q2 && !(o.p1 === 2 && o.q1 === 1 && o.q2 === 3); });
        var E = subRad({ f: [[o.p1, -o.q1], [1, -o.q2]] });
        return solvePart(t(E.tex), E);
      } }] },
    { num: '9', section: 'Two radicals: squaring twice', stem: 'Solve by squaring twice. Verify each root.', parts: [
      { id: '9a', level: 'ADV', make: function (r) {
        var E = pickWhere(function () { var w = r.int(1, 8), c = r.pick([1, 1, 2, 3]), h = c * (2 * w + c); return twoRad({ a1: 1, b1: h, a2: 1, b2: 0, c: c, form: 'diff' }); }, function (E) { return E.roots.length === 1 && !/x\+9\}-\\sqrt\{x\}=1$/.test(E.tex) && !/x\+7\}-\\sqrt\{x\}=1$/.test(E.tex); });
        return solvePart(t(E.tex), E);
      } },
      { id: '9b', level: 'ADV', make: function (r) {
        var E = pickWhere(function () { var w = r.int(1, 6), s = r.int(2, 8), q = r.int(1, 9), x0 = w * w + q, p = s * s - x0; if (s <= w || !p) return null; return twoRad({ a1: 1, b1: p, a2: 1, b2: -q, c: s + w, form: 'sum' }); }, function (E) { return E.roots.length === 1 && !/x\+1\}\+\\sqrt\{x-4\}=5$/.test(E.tex); });
        return solvePart(t(E.tex), E);
      } },
      { id: '9c', level: 'MAS', make: function (r) {
        var E = pickWhere(function () { var a1 = r.pick([2, 3]), x0 = r.int(-1, 9), s = r.int(1, 7), w = s - 1, b1 = s * s - a1 * x0, b2 = w * w - x0; return twoRad({ a1: a1, b1: b1, a2: 1, b2: b2, c: 1, form: 'diff' }); }, function (E) { return E.roots.length === 2 && E.roots.every(function (x) { return isInt(x) && Math.abs(qv(x)) <= 30; }) && !/2x\+3\}-\\sqrt\{x\+1\}=1$/.test(E.tex); });
        return solvePart(t(E.tex), E);
      } },
      { id: '9d', level: 'MAS', make: function (r) {
        var E = pickWhere(function () { var a2 = r.pick([2, 3]), x0 = r.int(1, 9), s = r.int(2, 7), w = s - 1, b1 = s * s - x0, b2 = w * w - a2 * x0; return twoRad({ a1: 1, b1: b1, a2: a2, b2: b2, c: 1, form: 'diff' }); }, function (E) { return E.roots.length === 1 && E.ext.length === 1 && E.all.every(function (x) { return isInt(x) && Math.abs(qv(x)) <= 40; }) && !/x\+2\}-\\sqrt\{2x-3\}=1$/.test(E.tex) && !/x-1\}-\\sqrt\{2x-4\}=1$/.test(E.tex); });
        return solvePart(t(E.tex), E);
      } }] },
    { num: '10', section: 'Problems', stem: function (E) { return 'When the square root of a number is subtracted from the square root of ' + t(String(E.be)) + ' less than ' + TIMES[E.al] + ' the number, the result is ' + t(String(E.c)) + '.'; }, shared: q10shared, parts: [
      { id: '10a', level: 'PRG', make: function (r, E) {
        var A = linT(E.al, -E.be);
        return B.mc(r, 'Which radical equation represents this information?', [
          { html: t('\\sqrt{' + A + '}-\\sqrt{x}=' + E.c), right: true },
          { html: t('\\sqrt{x}-\\sqrt{' + A + '}=' + E.c), why: '“The square root of a number is subtracted <b>from</b> …” means the square root of the number comes second.' },
          { html: t('\\sqrt{' + pT([[E.be, 0], [-E.al, 1]]) + '}-\\sqrt{x}=' + E.c), why: '“' + E.be + ' less than ' + TIMES[E.al] + ' the number” is ' + t(A) + ': start with ' + t(E.al + 'x') + ' and take ' + t(String(E.be)) + ' away.' },
          { html: t('\\sqrt{' + E.al + 'x}-' + E.be + '-\\sqrt{x}=' + E.c), why: 'The whole expression “' + E.be + ' less than ' + TIMES[E.al] + ' the number” is under the root.' }],
          'Let the number be ' + t('x') + '. “' + E.be + ' less than ' + TIMES[E.al] + ' the number” is ' + t(A) + ', so ' + t('\\sqrt{' + A + '}-\\sqrt{x}=' + E.c) + '.', ['Translate piece by piece: “the square root of the number” is ' + t('\\sqrt{x}') + '.', '“' + E.be + ' less than ' + TIMES[E.al] + ' the number” means ' + t(E.al + 'x') + ' minus ' + t(String(E.be)) + '.'], 'MC: write the radical equation');
      } },
      { id: '10b', level: 'MAS', make: function (r, E) {
        var x0 = E.roots[0], xe = E.ext[0];
        var fields = [{ label: 'The number:', name: 'The number' }, { label: 'The extraneous root:', name: 'Extraneous root' }];
        return B.fields('Solve the equation ' + t(E.tex) + ' to determine the number, and state the extraneous root.', fields,
          [K.number(qv(x0), function (v) { return same(v, qv(xe)) ? { code: 'u4rad-kept-extraneous', hint: 'That value doesn’t check: ' + E.checks[rT(xe)].line } : null; }), K.number(qv(xe), function (v) { return same(v, qv(x0)) ? { code: 'swap-answer', hint: 'That one checks, so it is the number. The extraneous root is the other root of the quadratic.' } : null; })],
          [rT(x0), rT(xe)], 'the number ' + t(rT(x0)) + '; extraneous root ' + t(rT(xe)), E.lines.join('<br>') + '<br>The number is ' + t(rT(x0)) + '; the extraneous root is ' + t(rT(xe)) + '.', E.hints, 'number problem: two radicals');
      } }] },
    { num: '11', parts: [
      { id: '11', level: 'ADV', make: function (r) {
        var o = q11shared(r), m = o.al * o.ga, c = o.be * o.de, u = Q(o.be, o.al), ue = Q(-o.de, o.ga), x = qmul(u, u), xe = qmul(ue, ue);
        var E = { L: [pol([[m, 1]])], R: [rad(1, [[1, 1]]), pol([[c, 0]])], v: 'x' };
        var who = m === 1 ? 'A number' : TIMES[m].charAt(0).toUpperCase() + TIMES[m].slice(1) + ' a number';
        var lines = ['Let the number be ' + t('x') + ': ' + t(eqTex(E)) + ', so ' + t('\\sqrt{x}=' + linT(m, -c)) + ' (so ' + t('x\\ge ' + rT(Q(c, m))) + ').',
          'Square: ' + t('x=' + pT([[m * m, 2], [-2 * m * c, 1], [c * c, 0]])) + ' &nbsp;⇒&nbsp; ' + t('0=' + pT([[m * m, 2], [-2 * m * c - 1, 1], [c * c, 0]]) + '=' + facTex(m * m, [x, xe], 'x'))];
        var ch = finishChecks(E, [x, xe]);
        var sol = lines.concat(ch.lines).join('<br>') + '<br>(With ' + t('u=\\sqrt{x}') + ': ' + t(pT([[m, 2], [-1, 1], [-c, 0]], 'u') + '=' + facTex(m, [u, ue], 'u') + '=0') + ', ' + t('u=' + rT(u)) + ', ' + t('x=' + rT(x)) + '.)';
        return { prompt: who + ' is ' + t(String(c)) + ' more than the square root of the number. Write a radical equation and solve it to determine the number.', input: { type: 'math', keys: 'fraction', placeholder: 'e.g. 9/4' },
          check: K.fraction(x, { diag: function (v) { if (same(v, qv(xe))) return { code: 'u4rad-kept-extraneous', hint: 'That value doesn’t check: ' + ch.checks[rT(xe)].line }; if (same(v, qv(u))) return { code: 'u4l7-u', hint: 'That’s the value of ' + t('\\sqrt{x}') + '. The number is its square.' }; return null; } }),
          key: rT(x), answer: t(rT(x)), solution: sol, hints: ['Let the number be ' + t('x') + ': ' + t(eqTex(E)) + '. Isolate the radical (or let ' + t('u=\\sqrt{x}') + ').', 'Square, factor and verify: one root is extraneous. The answer may be a fraction.'], text: 'number problem: m·x = √x + c', bad: [rT(xe), rT(u)] };
      } }] },
    { num: '12', stem: function (s) { return 'The distance between points ' + t('(x_1, y_1)') + ' and ' + t('(x_2, y_2)') + ' is ' + t('d=\\sqrt{(x_2-x_1)^{2}+(y_2-y_1)^{2}}') + '. Point ' + t('A') + ' is ' + t('(' + s.x1 + ',\\ ' + s.y1 + ')') + ' and point ' + t('B') + ' is ' + t('(k,\\ ' + linT(s.p, s.q, 'k') + ')') + '. The distance ' + t('AB') + ' is ' + t(String(s.d)) + '.'; }, shared: q12shared, parts: [
      { id: '12a', level: 'ADV', make: function (r, s) {
        var c2 = 1 + s.p * s.p, c1 = 2 * s.p * (s.q - s.y1) - 2 * s.x1, c0 = s.x1 * s.x1 + (s.q - s.y1) * (s.q - s.y1) - s.d * s.d, ks = [Q(s.k1, 1), Q(s.k2, 1)];
        var ex1 = s.x1 === 0 ? 'k^{2}' : pT([[1, 2], [-2 * s.x1, 1], [s.x1 * s.x1, 0]], 'k'), ex2 = pT([[s.p * s.p, 2], [2 * s.p * (s.q - s.y1), 1], [(s.q - s.y1) * (s.q - s.y1), 0]], 'k');
        var sol = t(q12tex(s)) + '<br>Square: ' + t(ex1 + '+' + ex2 + '=' + s.d * s.d) + '<br>' + t(pT([[c2, 2], [c1, 1], [c0, 0]], 'k') + '=0') + ' &nbsp;⇒&nbsp; ' + t(facTex(c2, ks, 'k') + '=0') + '<br>' + rootsLine(ks, 'k') + '.';
        var p = K.P.valueSet('Write a radical equation and solve it for ' + t('k') + '.', ks, { v: 'k', diag: function (A) { if (sameSet(A, ks.map(function (x) { return -qv(x); }))) return { code: 'u4l7-sign', hint: 'Check the signs of the roots from your factors.' }; return null; } }, sol,
          ['Substitute: ' + t('\\sqrt{(k-' + '(' + s.x1 + '))^{2}+((' + linT(s.p, s.q, 'k') + ')-(' + s.y1 + '))^{2}}=' + s.d) + '. Square both sides.', 'Expand both squares, collect into a quadratic in ' + t('k') + ', take out the common factor and factor.'], 'distance: solve for k');
        p.bad = ['k=' + (-s.k1) + ',k=' + (-s.k2), 'k=' + s.k1];
        return p;
      } },
      { id: '12b', level: 'ADV', make: function (r, s) {
        var pts = [s.B1, s.B2];
        var p = K.P.pairs('Verify both answers and state the possible coordinates of ' + t('B') + '.', pts, {}, 'For ' + t('k=' + s.k1) + ': ' + t('B(' + s.B1[0] + ',\\ ' + s.B1[1] + ')') + ', ' + t('\\sqrt{' + (s.B1[0] - s.x1) * (s.B1[0] - s.x1) + '+' + (s.B1[1] - s.y1) * (s.B1[1] - s.y1) + '}=' + s.d) + ' ✓<br>For ' + t('k=' + s.k2) + ': ' + t('B(' + s.B2[0] + ',\\ ' + s.B2[1] + ')') + ', ' + t('\\sqrt{' + (s.B2[0] - s.x1) * (s.B2[0] - s.x1) + '+' + (s.B2[1] - s.y1) * (s.B2[1] - s.y1) + '}=' + s.d) + ' ✓<br>Both are valid.',
          ['Substitute each value of ' + t('k') + ' into ' + t('(k,\\ ' + linT(s.p, s.q, 'k') + ')') + '.', 'Check each point’s distance from ' + t('A') + '. Both values of ' + t('k') + ' work, so there are two points.'], 'distance: the points B');
        p.bad = ['\\{(' + s.B1[0] + ', ' + s.B1[1] + ')\\}', '\\{(' + s.k1 + ', ' + s.k2 + ')\\}'];
        return p;
      } }] },
    { num: '13', section: 'Multiple choice and numerical response', parts: [
      { id: '13', level: 'EMG', make: function (r) {
        var E = pickQ(r, { e: negs(2, 9), u1: range(2, 9), u2: negs(1, 8), test: function (E) { return E.a === 1 && E.b > 0 && qv(E.r2) !== 0 && qv(E.r1) !== -qv(E.r2); } });
        var x1 = rT(E.r1), x2 = rT(E.r2);
        return B.mc(r, 'When solving ' + t(E.tex) + ', the extraneous root is', [{ html: t(x2), right: true }, { html: t(x1), why: 'Check it: ' + E.checks[x1].line }, { html: t(rT(qmul(E.r2, -1))), why: 'That isn’t a root of the squared equation. Square, factor, then check each root.' }, { html: t(rT(qmul(E.r1, -1))), why: 'That isn’t a root of the squared equation. Square, factor, then check each root.' }],
          t(linT(1, E.b) + '=' + pT([[1, 2], [2 * E.e, 1], [E.e * E.e, 0]])) + ' ⇒ ' + t(pT([[1, 2], [E.std[1], 1], [E.std[2], 0]]) + '=' + facTex(1, [E.r1, E.r2], 'x') + '=0') + '.<br>' + E.checks[x1].line + '<br>' + E.checks[x2].line, E.hints, 'MC: the extraneous root');
      } },
      { id: '14', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { c: r.int(5, 20), a: r.pick([1, 1, 2, 3]) }; }, function (o) { return o.c !== 12 && gcd(o.a, o.c) === 1; });
        var bd = rT(Q(o.c, o.a)), rad0 = '\\sqrt{' + linT(-o.a, o.c) + '}';
        return B.mc(r, 'All the restrictions on ' + t('x') + ' in the equation ' + t(rad0 + '=x') + ' are', [{ html: t('x\\le ' + bd), why: 'That’s only the radicand. The right side, ' + t('x') + ', equals a square root, so it can’t be negative either.' }, { html: t('x\\ge 0'), why: 'That’s only the right side. The radicand must also be ' + t('\\ge 0') + '.' }, { html: t('0\\le x\\le ' + bd), right: true }, { html: t('x\\ge ' + bd), why: 'Solve ' + t(linT(-o.a, o.c) + '\\ge 0') + ' carefully: dividing by ' + t(String(-o.a)) + ' reverses the sign.' }],
          'The radicand needs ' + t(linT(-o.a, o.c) + '\\ge 0') + ' (' + t('x\\le ' + bd) + ') and the right side needs ' + t('x\\ge 0') + '. Together: ' + t('0\\le x\\le ' + bd) + '.', ['Two conditions: the radicand ' + t('\\ge 0') + ', and the side the radical equals ' + t('\\ge 0') + '.'], 'MC: all the restrictions');
      } },
      { id: '15', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(3, 9), b: r.int(-3, 4), c: r.int(1, 5) }; }, function (o) { return o.b < o.a && !(o.a === 4 && o.b === 1 && o.c === 2); });
        return B.mc(r, 'Without solving, which statement about ' + t('\\sqrt{' + linT(1, -o.a) + '}+\\sqrt{' + linT(-1, o.b) + '}=' + o.c) + ' is true?', [
          { html: 'It has exactly one root.', why: 'Look at the radicands first: can ' + t(linT(1, -o.a)) + ' and ' + t(linT(-1, o.b)) + ' both be ' + t('\\ge 0') + '?' },
          { html: 'It has two roots.', why: 'Look at the radicands first: can ' + t(linT(1, -o.a)) + ' and ' + t(linT(-1, o.b)) + ' both be ' + t('\\ge 0') + '?' },
          { html: 'It has no roots, because no value of ' + t('x') + ' meets both restrictions.', right: true },
          { html: 'It has no roots, because the right side is positive.', why: 'A sum of square roots can be positive. The real reason is in the restrictions.' }],
          t('\\sqrt{' + linT(1, -o.a) + '}') + ' needs ' + t('x\\ge ' + o.a) + ' and ' + t('\\sqrt{' + linT(-1, o.b) + '}') + ' needs ' + t('x\\le ' + o.b) + '. No number does both, so there is no solution.', ['Write the restriction for each radical.'], 'MC: no roots from the restrictions');
      } },
      { id: '16', level: 'PRG', make: function (r) {
        var E = pickQ(r, { m: 2, e: negs(1, 5), c: range(1, 5), u1: range(1, 9), u2: negs(1, 5), layout: 'radc', test: function (E) { return E.e + E.c === 0 && E.a > 0 && E.a <= 30 && halfInt(E.r1) && qv(E.r1) > 0 && qv(E.r1) < 100 && halfInt(E.r2); } });
        var x = qv(E.r1);
        return B.nr('<i>(Numerical Response)</i> The root of the equation ' + t(E.tex) + ', to the nearest tenth, is ________.', x, function (v) { return E.ext.some(function (y) { return same(v, qv(y)); }) ? { code: 'u4rad-kept-extraneous', hint: 'That root doesn’t check: ' + E.checks[rT(E.ext[0])].line } : null; }, E.lines.join('<br>') + '<br>To the nearest tenth: ' + t(x.toFixed(1)) + '.', E.hints, 'NR: root of a radical equation');
      } },
      { id: '17', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { u1: r.int(1, 8), u2: r.int(1, 9) }; }, function (o) { return o.u1 < o.u2 && !(o.u1 === 2 && o.u2 === 3) && !(o.u1 === 2 && o.u2 === 4); });
        var E = subRad({ f: [[1, -o.u1], [1, -o.u2]] }), S = o.u1 * o.u1 + o.u2 * o.u2;
        return B.nr('<i>(Numerical Response)</i> The equation ' + t(E.tex) + ' has two roots. Their sum is ________.', S, function (v) { if (v === o.u1 + o.u2) return { code: 'u4l7-u', hint: 'That’s the sum of the values of ' + t('u=\\sqrt{x}') + '. Square each one first.' }; return null; }, E.lines.join('<br>') + '<br>Sum ' + t('=' + o.u1 * o.u1 + '+' + o.u2 * o.u2 + '=' + S) + '.', E.hints, 'NR: sum of the roots');
      } }] }
  ];

  /* ============================== the extra practice ============================== */
  var EXTRA = [
    { num: 'A1', section: 'A. Skills', stem: 'State the restrictions on ' + t('x') + '.', parts: [
      { id: 'A1a', level: 'BEG', make: function (r) { var E = pickQ(r, { e: negs(2, 9), u1: range(1, 9), u2: negs(1, 9), test: function (E) { return E.a === 1 && E.b > 0 && E.b <= 20; } }); return restrictPart(t(E.tex), E); } },
      { id: 'A1b', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(2, 4), c: r.int(3, 15) }; }, function (o) { return !(o.a === 2 && o.c === 6); });
        var E = { v: 'x', a: -o.a, b: o.c, m: 1, e: 0, rhsTex: 'x', isoLine: '', tex: '\\sqrt{' + linT(-o.a, o.c) + '}=x' };
        return restrictPart(t(E.tex), E);
      } },
      { id: 'A1c', level: 'PRG', make: function (r) { var E = pickQ(r, { m: -1, e: range(1, 6), u1: range(1, 8), u2: negs(1, 8), layout: 'radx', test: function (E) { return E.a === 1 && E.b > 0 && E.b <= 12; } }); return restrictPart(t(E.tex), E); } }] },
    { num: 'A2', stem: 'Solve and verify. Identify any extraneous roots.', parts: [
      { id: 'A2a', level: 'EMG', make: function (r) { var E = pickQ(r, { e: 0, u1: range(3, 12), u2: negs(2, 11), test: function (E) { return E.a === 1; } }); return solvePart(t(E.tex), E); } },
      { id: 'A2b', level: 'EMG', make: function (r) { var E = pickQ(r, { e: 0, u1: range(1, 9), u2: range(1, 9), test: function (E) { return E.a >= 2 && E.b < 0; } }); return solvePart(t(E.tex), E); } },
      { id: 'A2c', level: 'PRG', make: function (r) { var E = pickQ(r, { e: negs(1, 5), u1: range(1, 9), u2: negs(1, 6), test: function (E) { return E.a >= 2 && nice(E); } }); return solvePart(t(E.tex), E); } },
      { id: 'A2d', level: 'PRG', make: function (r) { var E = pickQ(r, { e: range(1, 5), u1: range(1, 9), u2: negs(1, 6), test: function (E) { return E.a < 0 && E.b > 0 && nice(E); } }); return solvePart(t(E.tex), E); } }] },
    { num: 'A3', stem: 'Isolate the radical, then solve and verify.', parts: [
      { id: 'A3a', level: 'PRG', make: function (r) { var E = pickQ(r, { e: negs(1, 6), c: range(1, 6), u1: range(1, 9), u2: negs(1, 6), layout: 'xminus', test: function (E) { return E.e + E.c === 0 && E.a === 1 && nice(E); } }); return solvePart(t(E.tex), E); } },
      { id: 'A3b', level: 'PRG', make: function (r) { var E = pickQ(r, { k: [2, 3], e: 0, u1: [2, 3, 4, 6, 8, 9, 10, 12], u2: [-2, -3, -4, -6, -8, -9], layout: 'radx', test: function (E) { return E.a === 1 && E.b > 0 && nice(E); } }); return solvePart(t(E.tex), E); } },
      { id: 'A3c', level: 'PRG', make: function (r) { var E = pickQ(r, { e: range(1, 4), c: [-1, -2, -3], u1: range(0, 8), u2: range(0, 8), layout: 'radc', test: function (E) { return E.e + E.c === 0 && E.roots.length === 2 && E.a >= 1 && nice(E); } }); return solvePart(t(E.tex), E); } }] },
    { num: 'B1', section: 'B. Applying', parts: [
      { id: 'B1', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { u1: r.int(1, 6), u2: r.int(2, 8) }; }, function (o) { return o.u1 < o.u2 && !(o.u1 === 2 && o.u2 === 4) && !(o.u1 === 2 && o.u2 === 3); });
        var E = subRad({ f: [[1, -o.u1], [1, -o.u2]] });
        return solvePart('Solve ' + t(E.tex) + ' by letting ' + t('u=\\sqrt{x}') + '. Verify both roots.', E);
      } }] },
    { num: 'B2', stem: 'Solve and verify.', parts: [
      { id: 'B2a', level: 'ADV', make: function (r) {
        var E = pickWhere(function () { var w = r.int(1, 6), c = r.pick([1, 2, 2, 3]), s = w + c, q = r.int(1, 8), x0 = w * w + q, p = s * s - x0; return twoRad({ a1: 1, b1: p, a2: 1, b2: -q, c: c, form: 'diff' }); }, function (E) { return E.roots.length === 1 && !/x\+4\}-\\sqrt\{x-4\}=2$/.test(E.tex); });
        return solvePart(t(E.tex), E);
      } },
      { id: 'B2b', level: 'MAS', make: function (r) {
        var E = pickWhere(function () { var x0 = r.int(-2, 9), s = r.int(2, 7), w = s - 1, b1 = s * s - 2 * x0, b2 = w * w - x0; return twoRad({ a1: 2, b1: b1, a2: 1, b2: b2, c: 1, form: 'diff' }); }, function (E) { return E.roots.length === 1 && E.ext.length === 1 && E.all.every(function (x) { return isInt(x) && Math.abs(qv(x)) <= 30; }) && !/2x\+6\}-\\sqrt\{x\+4\}=1$/.test(E.tex) && !/2x\+1\}-\\sqrt\{x\+4\}=1$/.test(E.tex); });
        return solvePart(t(E.tex), E);
      } }] },
    { num: 'B3', parts: [
      { id: 'B3', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { b: r.pick([2, 2, 3, 4]), p: r.int(2, 9) }; }, function (o) { return !(o.b === 2 && o.p === 4) && o.p * (o.p + o.b) <= 200; });
        var E = subRad({ f: [[1, -o.p], [1, o.p + o.b]], layout: 'rhs' }), n = o.p * (o.p + o.b), x = o.p * o.p, xe = (o.p + o.b) * (o.p + o.b);
        var word = { 2: 'twice', 3: 'three times', 4: 'four times' }[o.b];
        return B.number('A number increased by ' + word + ' its square root is ' + t(String(n)) + '. Write a radical equation and determine the number.', x,
          function (v) { if (v === xe) return { code: 'u4rad-kept-extraneous', hint: 'That value doesn’t check: ' + E.checks[rT(Q(xe, 1))].line }; if (v === o.p) return { code: 'u4l7-u', hint: 'That’s the square root of the number. The number is its square.' }; return null; },
          'Let the number be ' + t('x') + ': ' + t(E.tex) + '.<br>' + E.lines.join('<br>'), E.hints, 'number problem: x + b√x = n');
      } }] },
    { num: 'B4', stem: function (s) { return 'A rectangular garden plot is ' + t('x') + ' m wide and ' + t('(x+' + s.p + ')') + ' m long. A straight path along its diagonal is ' + t('(x+' + s.q + ')') + ' m long.'; },
      shared: function (r) {
        var trip = pickWhere(function () { var b = r.pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41]]), k = b[0] === 3 ? r.int(2, 8) : b[0] === 5 ? r.pick([1, 2, 3]) : 1; return [b[0] * k, b[1] * k, b[2] * k]; }, function (b) { return !(b[0] === 10 && b[1] === 24) && !(b[0] === 30 && b[1] === 40); });
        return { w: trip[0], p: trip[1] - trip[0], q: trip[2] - trip[0], L: trip[1], d: trip[2] };
      }, parts: [
      { id: 'B4a', level: 'PRG', make: function (r, s) {
        return B.mc(r, 'Which radical equation gives the length of the diagonal?', [
          { html: t('\\sqrt{x^{2}+(x+' + s.p + ')^{2}}=x+' + s.q), right: true },
          { html: t('x^{2}+(x+' + s.p + ')^{2}=x+' + s.q), why: 'By the Pythagorean theorem the <b>square</b> of the diagonal is ' + t('x^{2}+(x+' + s.p + ')^{2}') + ', so the diagonal is its square root.' },
          { html: t('\\sqrt{x+(x+' + s.p + ')}=x+' + s.q), why: 'Square each side length before adding: ' + t('d^{2}=w^{2}+l^{2}') + '.' },
          { html: t('\\sqrt{(x+' + s.p + ')^{2}-x^{2}}=x+' + s.q), why: 'The diagonal is the hypotenuse: <b>add</b> the squares of the two sides.' }],
          'The diagonal is the hypotenuse of a right triangle with legs ' + t('x') + ' and ' + t('x+' + s.p) + ': ' + t('\\sqrt{x^{2}+(x+' + s.p + ')^{2}}=x+' + s.q) + '.', ['Use the Pythagorean theorem: ' + t('d=\\sqrt{w^{2}+l^{2}}') + '.'], 'MC: diagonal equation');
      } },
      { id: 'B4b', level: 'ADV', make: function (r, s) {
        var c1 = 2 * (s.p - s.q), c0 = s.p * s.p - s.q * s.q, other = 2 * (s.q - s.p) - s.w, rhsO = other + s.q;
        var fields = [{ label: 'Width:', name: 'Width', after: 'm' }, { label: 'Length:', name: 'Length', after: 'm' }];
        var why = rhsO >= 0 ? t('x=' + other) + ' satisfies the equation (' + t('\\sqrt{' + (other * other + (other + s.p) * (other + s.p)) + '}=' + rhsO) + '), but a width can’t be negative: it is inadmissible.' : t('x=' + other) + ' is extraneous (the right side would be negative), and a width can’t be negative anyway.';
        var p = B.fields('Solve the equation ' + t('\\sqrt{x^{2}+(x+' + s.p + ')^{2}}=x+' + s.q) + ' and state the dimensions of the plot. (One root is rejected — the solution explains why.)', fields,
          [K.number(s.w, function (v) { return same(v, other) ? { code: 'u4l7-inadm', hint: 'A width can’t be negative: reject that root.' } : null; }), K.number(s.L, function (v) { return same(v, s.w) ? { code: 'swap-answer', hint: 'That’s the width. The length is ' + t('x+' + s.p) + '.' } : same(v, s.d) ? { code: 'value', hint: 'That’s the diagonal. The length is ' + t('x+' + s.p) + '.' } : null; })],
          [String(s.w), String(s.L)], t(s.w + '\\text{ m by }' + s.L + '\\text{ m}'),
          'Square: ' + t('x^{2}+' + pT([[1, 2], [2 * s.p, 1], [s.p * s.p, 0]]) + '=' + pT([[1, 2], [2 * s.q, 1], [s.q * s.q, 0]])) + '<br>' + t(pT([[1, 2], [c1, 1], [c0, 0]]) + '=0') + ' &nbsp;⇒&nbsp; ' + t(facTex(1, [Q(s.w, 1), Q(other, 1)], 'x') + '=0') + '<br>' + t('x=' + s.w) + ': ' + t('\\sqrt{' + (s.w * s.w + s.L * s.L) + '}=' + s.d + '=' + s.w + '+' + s.q) + ' ✓. ' + why + '<br>The plot is ' + t(String(s.w)) + ' m by ' + t(String(s.L)) + ' m (diagonal ' + t(String(s.d)) + ' m).',
          ['Square both sides, expand, and collect into a quadratic.', 'Factor and check both roots — then ask which one makes sense as a width.'], 'garden dimensions from the diagonal');
        p.bad = [[String(s.L), String(s.w)]]; return p;
      } }] },
    { num: 'B5', parts: [
      { id: 'B5', level: 'EMG', make: function (r) {
        var E = pickQ(r, { e: 0, u1: range(3, 11), u2: negs(1, 8), layout: 'swap', test: function (E) { return E.a >= 2 && E.b > 0 && E.r1[0] !== -E.r2[0]; } });
        var x1 = rT(E.r1), x2 = rT(E.r2);
        return B.mc(r, 'The extraneous root of ' + t(E.tex) + ' is', [{ html: t(rT(qmul(E.r1, -1))), why: 'That isn’t a root of the squared equation. Square, factor, then check each root.' }, { html: t(x2), right: true }, { html: t(rT(qmul(E.r2, -1))), why: 'That isn’t a root of the squared equation. Square, factor, then check each root.' }, { html: t(x1), why: 'Check it: ' + E.checks[x1].line }],
          t('x^{2}=' + linT(E.a, E.b)) + ' ⇒ ' + t(facTex(1, [E.r1, E.r2], 'x') + '=0') + '.<br>' + E.checks[x1].line + '<br>' + E.checks[x2].line, E.hints, 'MC: the extraneous root');
      } }] },
    { num: 'B6', parts: [
      { id: 'B6', level: 'ADV', make: function (r) {
        var E = pickQ(r, { m: 2, e: negs(1, 6), c: range(1, 6), u1: range(1, 9), u2: negs(1, 5), layout: 'xminus', test: function (E) { return E.e + E.c === 0 && E.a > 0 && E.a <= 30 && halfInt(E.r1) && !isInt(E.r1) && qv(E.r1) > 0 && halfInt(E.r2); } });
        var x = qv(E.r1);
        return B.nr('<i>(Numerical Response)</i> The root of ' + t(E.tex) + ', to the nearest tenth, is ________.', x, function (v) { return E.ext.some(function (y) { return same(v, qv(y)); }) ? { code: 'u4rad-kept-extraneous', hint: 'That root doesn’t check: ' + E.checks[rT(E.ext[0])].line } : null; }, E.lines.join('<br>') + '<br>To the nearest tenth: ' + t(x.toFixed(1)) + '.', E.hints, 'NR: root of a radical equation');
      } }] },
    { num: 'C1', section: 'C. Stretch', parts: [
      { id: 'C1', level: 'MAS', make: function (r) {
        var o = pickWhere(function () { return { A: r.int(2, 5), Bb: r.int(1, 4) }; }, function (o) { return o.A > o.Bb && !(o.A === 2 && o.Bb === 1); });
        var p = o.A * o.A - o.Bb * o.Bb, q = 2 * o.A * o.Bb - p, s = o.A * o.Bb;
        var E = { L: [rad(1, [[1, 1], [-p, 0]]), rad(1, [[1, 1]])], R: [rad(1, [[2, 1], [q, 0]])], v: 'x' };
        var rs = restrictLines([{ a: 1, b: -p }, { a: 1, b: 0 }, { a: 2, b: q }], 'x');
        var pre = [rs.line, 'Square both sides: ' + t('(' + linT(1, -p) + ')+2\\sqrt{x(' + linT(1, -p) + ')}+x=' + linT(2, q)), t('2\\sqrt{' + pT([[1, 2], [-p, 1]]) + '}=' + (p + q)) + ' &nbsp;⇒&nbsp; ' + t('\\sqrt{' + pT([[1, 2], [-p, 1]]) + '}=' + s), 'Square again: ' + t(pT([[1, 2], [-p, 1]]) + '=' + s * s)];
        var f = finish(E, pre, 1, -p, -s * s, [Q(o.A * o.A, 1), Q(-o.Bb * o.Bb, 1)], { zeroLeft: true });
        E.lines = f.lines; E.roots = f.roots; E.ext = f.ext; E.checks = f.checks; E.cands = []; E.text = 'three radicals';
        E.hints = ['Square both sides: the left side is a binomial, ' + t('(\\sqrt{A}+\\sqrt{B})^{2}=A+2\\sqrt{AB}+B') + '.', 'Isolate the radical that remains, square again, and verify both roots in the original equation.'];
        return solvePart('Solve ' + t(eqTex(E)) + ' and verify.', E);
      } }] },
    { num: 'C2', parts: [
      { id: 'C2', level: 'MAS', make: function (r) {
        var E = pickWhere(function () { var a1 = r.pick([2, 3, 4]), x0 = r.int(1, 9), s = r.int(2, 8), c = r.pick([1, 2]), w = s - c, b1 = s * s - a1 * x0, b2 = w * w - x0; if (w < 0) return null; return twoRad({ a1: a1, b1: b1, a2: 1, b2: b2, c: c, form: 'iso' }); }, function (E) { return E.roots.length === 1 && E.ext.length === 1 && E.all.every(function (x) { return isInt(x) && Math.abs(qv(x)) <= 30; }) && !/3x\+1\}=\\sqrt\{x\+4\}\+1$/.test(E.tex); });
        return solvePart('Solve ' + t(E.tex) + ' and verify.', E);
      } }] },
    { num: 'C3', parts: [
      { id: 'C3a', level: 'ADV', make: function (r) {
        var o = { a: r.int(2, 5), b: r.int(1, 9), c: r.int(1, 8) }, A = '\\sqrt{' + linT(o.a, o.b) + '}';
        return B.mc(r, 'Explain, without solving, why ' + t(A + '+' + o.c + '=0') + ' has no solution.', [
          { html: 'Isolating gives ' + t(A + '=-' + o.c) + ', but a square root is never negative.', right: true },
          { html: 'The radicand ' + t(linT(o.a, o.b)) + ' is always negative.', why: 'The radicand is ' + t('\\ge 0') + ' for ' + t('x\\ge ' + rT(Q(-o.b, o.a))) + '. The problem is the value the root must equal.' },
          { html: 'Squaring both sides gives ' + t(linT(o.a, o.b) + '+' + o.c * o.c + '=0') + ', which has no solution.', why: 'That equation does have a solution — and it isn’t how to square. Isolate the radical first.' },
          { html: 'A radical equation with a constant can never be solved.', why: 'Many such equations have solutions. Look at what the radical would have to equal.' }],
          'Isolating gives ' + t(A + '=-' + o.c) + ', but a square root is never negative.', ['Isolate the radical. What number must it equal?'], 'MC: why no solution');
      } },
      { id: 'C3b', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(3, 9), b: r.int(-2, 4), c: r.int(1, 4) }; }, function (o) { return o.b < o.a && !(o.a === 5 && o.b === 2); });
        return B.mc(r, 'Explain why ' + t('\\sqrt{' + linT(1, -o.a) + '}+\\sqrt{' + linT(-1, o.b) + '}=' + o.c) + ' has no solution.', [
          { html: 'The restrictions are ' + t('x\\ge ' + o.a) + ' and ' + t('x\\le ' + o.b) + '. No number satisfies both, so the two radicals are never defined at the same ' + t('x') + '.', right: true },
          { html: 'The sum of two square roots can’t equal ' + t(String(o.c)) + '.', why: 'Sums of square roots can equal ' + t(String(o.c)) + '. Look at where each radical is defined.' },
          { html: 'Squaring creates an extraneous root, so there is never a solution.', why: 'Squaring <i>can</i> create extraneous roots, but many such equations have a real root. Check the restrictions.' },
          { html: 'The restrictions are ' + t('x\\ge ' + o.a) + ' and ' + t('x\\ge ' + (-o.b)) + ', and ' + t(String(o.c)) + ' is less than both.', why: 'Solve ' + t(linT(-1, o.b) + '\\ge 0') + ' carefully: it gives ' + t('x\\le ' + o.b) + '.' }],
          'The restrictions are ' + t('x\\ge ' + o.a) + ' and ' + t('x\\le ' + o.b) + '. No number satisfies both, so neither radical can be evaluated at the same ' + t('x') + '.', ['Write the restriction for each radical.'], 'MC: no solution from the restrictions');
      } },
      { id: 'C3c', level: 'MAS', make: function (r) {
        var n = pickWhere(function () { return r.int(3, 12); }, function (n) { return n !== 5; }), c = n * n - n, xe = 1 - n;
        var fields = [{ label: t('c='), name: 'c' }, { label: 'Extraneous root: ' + t('x='), name: 'Extraneous root' }];
        var p = B.fields('Find the value of ' + t('c') + ' so that ' + t('\\sqrt{x+c}=x') + ' has the root ' + t('x=' + n) + '. Then find the extraneous root that squaring produces.', fields,
          [K.number(c, function (v) { if (v === n * n) return { code: 'u4l7-c', hint: 'Substitute ' + t('x=' + n) + ' on <b>both</b> sides: ' + t('\\sqrt{' + n + '+c}=' + n) + ', so ' + t(n + '+c=' + n * n) + '.' }; if (v === n * n + n) return { code: 'u4l7-c', hint: 'Solve ' + t(n + '+c=' + n * n) + ' carefully: subtract ' + t(String(n)) + '.' }; return null; }),
            K.number(xe, function (v) { if (v === -n) return { code: 'u4l7-sign', hint: 'Solve ' + t('x^{2}-x-' + c + '=0') + ' and check the signs of the roots from the factors.' }; if (v === n) return { code: 'value', hint: t('x=' + n) + ' is the valid root. The other root of the squared equation is the extraneous one.' }; return null; })],
          [String(c), String(xe)], t('c=' + c) + ', extraneous root ' + t('x=' + xe),
          t('\\sqrt{' + n + '+c}=' + n) + ' ⇒ ' + t(n + '+c=' + n * n) + ' ⇒ ' + t('c=' + c) + '.<br>' + t('x+' + c + '=x^{2}') + ' ⇒ ' + t('x^{2}-x-' + c + '=(x-' + n + ')(x+' + (n - 1) + ')=0') + '.<br>' + t('x=' + xe) + ': ' + t('\\sqrt{' + (xe + c) + '}=' + Math.abs(xe) + '\\ne ' + xe) + ', so ' + t(String(xe)) + ' is extraneous.',
          ['A root makes the equation true: substitute ' + t('x=' + n) + ' and solve for ' + t('c') + '.', 'Then solve the squared equation ' + t('x+c=x^{2}') + ' and check its other root.'], 'find c from a root, then the extraneous root');
        p.bad = [[String(n * n), String(xe)], [String(c), String(-n)]]; return p;
      } }] }
  ];

  /* one question per booklet number: a group of single-part questions (ids like 17 or E17) becomes separate questions */
  function splitNum(list) {
    var out = [];
    list.forEach(function (q) {
      if (q.parts.length > 1 && q.parts.every(function (p) { return /^E?\d+$/.test(p.id); })) {
        q.parts.forEach(function (p, i) { var nq = { num: p.id.replace(/^E/, ''), parts: [p] }; if (i === 0 && q.section) nq.section = q.section; if (q.outcome) nq.outcome = q.outcome; if (q.stem) nq.stem = q.stem; out.push(nq); });
      } else out.push(q);
    });
    return out;
  }
  HW.defineLesson({ id: LID, unit: 4, num: '7', title: 'Radical Equations That Lead to Quadratics', outcome: 'AN3', calc: false, questions: splitNum(QUESTIONS), extra: splitNum(EXTRA) });
})(window);
