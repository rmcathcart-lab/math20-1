/* Math 20-1 · Unit 8 · Lesson 1 — Solving Linear–Quadratic Systems (outcome RF6 on every part)
 * Assignment 1 (m201book unit8/u8_l01.tex, Questions 1–17) and the Lesson 1 Extra Practice (u8_ep01.tex, A1–A4, B1–B6,
 * C1–C3). Every part is a generator: the booklet question's idea, form and difficulty with new numbers (the lesson's
 * example numbers and the booklet question's own numbers are left out). Calculator allowed; answers stay exact unless the
 * question asks to round.
 * Conversions: "state the solution(s)" / "solve" -> ordered pairs typed in one box ("no solution" possible); "verify" ->
 * a table (is each point a solution?); "graph each line, state the number of solutions and the solutions" -> the
 * parabola is drawn and the student gives the pairs (the solution draws the lines); "describe how a graph / algebra
 * shows" and "check part (b) algebraically" -> multiple choice; "state the window" is not checked (the solution gives
 * one); values of k for two / no solutions -> two inequality boxes; tangent slopes or constants -> a values box plus a
 * points box; "determine their equations" -> the equations typed (y = mx + b, any order); numerical response -> a
 * 4-character box.
 * Recognised mistakes: roots with the wrong signs, a double root counted twice, right x-values with wrong y-values, a
 * missing or extra pair, pairs written (y, x), "no solution" for graphs that meet (and the reverse), decimals for exact
 * answers, rounding; k inequalities the wrong way, including the tangent value, giving only the tangent value; only one
 * tangent slope, slopes paired with the wrong points; discriminant slips; points judged on only one of the two graphs.
 * Levels: LIM BEG EMG PRG ADV MAS. Mastery: Q9, Extra C1, C2, C3.
 *
 * ============================================================================================================
 * HW.u8kit — the Unit 8 practice kit for systems (defined here; later Unit 8 practice files reuse it: load this file
 * first). It reuses the Unit 8 assessment kit HW.u8assess (js/lessons/u8test.js, which loads AFTER the practice files)
 * lazily: only inside generators and checkers, never at load time.
 * ============================================================================================================
 *   var U = HW.u8kit, P = HW.poly;
 *   Codes:    U.codes('u8l3-') registers the kit's mistake codes under a lesson prefix (pairs: root-sign, double-root, sys-y,
 *             sys-missing, sys-extra, pair-flip, nosol-claim, none-missed, inf-claim, inf-missed; constants: k-dir, k-incl,
 *             k-tangent, k-sign, k-point, tan-one, tan-pts, disc; sets: ineq-*; verify, elim, eq-line, model), with partial
 *             credit. Format nudge: 'u8k-exact'. Every builder takes the prefix cp.
 *   Numbers:  rationals are [p, q]: U.R(x) (number, decimal like 0.25, or [p,q]) · U.qa/qs/qm/qd (+ − × ÷) · U.qv (value) ·
 *             U.qt (LaTeX) · U.qeq. Surds a + b√n: U.S(a, b, n) · U.sv (value) · U.irr · U.stex(z, pm) (LaTeX as one
 *             fraction, e.g. \frac{3+\sqrt{21}}{2} or 1-\sqrt{3}; pm writes ± / ∓) · U.slin(z, α, β) = α·z + β.
 *   Polys:    U.quad([a,b,c]) / U.lin([m,k]) -> HW.poly; U.tx(poly, dec) LaTeX (dec: decimals for ½, ¼ …); U.sub(tex, xTex)
 *             writes the substitution; U.lineShow(r, m, k, std) -> { tex, std } (y = mx + k, or a standard form).
 *   Solving:  U.roots([A,B,C]) -> { kind: 'two'|'one'|'none'|'lin'|'false'|'inf', xs (surds, ascending), a,b,c (integer
 *             form, content 1, lead > 0), f (what the equation was multiplied by), D }.
 *             U.work(o) -> the booklet's working (clear fractions / divide, factor or the quadratic formula, or the
 *             discriminant), HTML.  U.lq(Q, L) and U.qq(P1, P2) (coefficient lists) -> roots object plus pts
 *             [{ x, y, xt, yt, X, Y }] (y from the line / from P2, exact) and E (the equation after eliminating y).
 *             U.lqSol(o, opt) / U.qqSol(o, opt) -> worked solutions (opt: { dec, pre, check: false, elim: 'sub'|'add' }).
 *             U.signWrongs(cp, o, yOf) -> the standard wrong answers (root signs, a double root counted twice).
 *   Parts:    U.pairs(cp, prompt, pts, o, sol, hints, text) — ordered pairs, any order (HW.u8assess.pairsPart: o.inf,
 *             o.wrongs [{ pts:[[x,y]…], code, hint }], o.dp for rounded answers), plus "exact values" (a decimal with 3+
 *             places for an irrational coordinate is a format nudge). pts [] = no solution.
 *             U.countMC(r, prompt, n, calc, opt) — number of solutions (n 0|1|2|'inf'; calc = the working).
 *             U.kRanges(cp, prompt, v, k0, twoAbove, sol, hints, text) — two boxes: the values of v for two solutions and
 *             for none (inequalities; the tangent value k0; twoAbove: two solutions when v > k0).
 *             U.tanPart(cp, prompt, v, vals, pts, wrongPts, sol, hints, text) — the values of v (e.g. m = ±4) and the
 *             points of tangency (o2.ptsLabel relabels the points box).  U.kPoint(cp, prompt, v, k0, pt, sol, hints, text, wr) — one constant and one point.
 *             U.lineEqsPart(cp, prompt, lines [[m,k]…], …) — equations y = mx + k typed, any order.
 *             U.verifyGrid(r, prompt, rows [{ pt:[x,y], on1, on2 }], names, sol, hints, text) — is each point a solution?
 *             U.setCheck(cp, T, o) / U.setKey(T, v) / U.SET() — inequality sets (HW.u8assess).
 *             U.fig({ x, y, curves:[{ f, color, dash }], points, unit }) — a graph (HW.graph) in a figure.
 *   Keypads:  HW.u8assess's 'u8pairs' (pairs, no solution, infinitely many) and 'u8set'; here 'u8kval' (values of the letter
 *             in vars[0]: "v =", ±, and pairs) and 'u8keq' (equations y = …, separated by commas).
 */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, KP = K.P, P = HW.poly, ex = HW.ex, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
  if (!P || !K.valueSet || !HW.graph) throw new Error('js/lessons/u8l1.js needs js/poly.js and js/relfn.js');

  /* ======================================================================================================
   * HW.u8kit
   * ====================================================================================================== */
  var U = HW.u8kit = {};
  function A() { var a = HW.u8assess; if (!a) throw new Error('HW.u8kit needs js/lessons/u8test.js (HW.u8assess)'); return a; }
  U.assess = A;
  var KC = {
    'root-sign': ['Roots with the wrong signs (factoring sign slip)', 'b'], 'double-root': ['Treated a double root as two roots', 'b'],
    'sys-y': ['Right x-values, wrong y-values', 's'], 'sys-missing': ['Missed a solution of the system', 'b'], 'sys-extra': ['An extra pair that is not a solution', 'b'],
    'pair-flip': ['Ordered pairs written (y, x)', 's'], 'nosol-claim': ['Said “no solution” when the graphs meet', 'n'], 'none-missed': ['Gave solutions for a system with none', 'n'],
    'inf-claim': ['Said “infinitely many” for different graphs', 'n'], 'inf-missed': ['Missed that the equations are the same graph (infinitely many)', 'n'],
    'k-dir': ['Values of the constant: inequality the wrong way', 'b'], 'k-incl': ['Values of the constant: included the tangent value', 's'],
    'k-tangent': ['Gave only the tangent value of the constant', 'b'], 'k-sign': ['Constant for one solution: wrong sign', 'b'], 'k-point': ['Right constant, wrong point', 's'],
    'tan-one': ['Only one of the two values (tangents)', 'b'], 'tan-pts': ['Tangent values right, points of tangency wrong', 's'], disc: ['Discriminant slip', 'b'],
    verify: ['Judged a point on only one of the graphs', 'b'], elim: ['Eliminated wrongly (added instead of subtracting, or the reverse)', 'b'],
    'eq-line': ['Equation of a line wrong', 'b'], model: ['Equation does not meet the conditions', 'n'], round: ['Rounded wrongly', 's'],
    'ineq-and': ['Joined two pieces with “and”', 'b'], 'ineq-claim': ['Gave values when there are none', 'n'], 'ineq-none': ['Said there are no values', 'n'],
    'ineq-all': ['Said all real numbers', 'n'], 'ineq-half': ['Gave only one of the two intervals', 'b'], 'ineq-incl': ['Endpoint included/excluded wrong', 's'],
    'ineq-side': ['Inequality the wrong way', 'b'], 'ineq-rev': ['Did not reverse the sign when dividing by a negative', 'b'], 'ineq-roots': ['Values with the wrong sign', 'b']
  };
  var REG = {};
  U.codes = function (cp) {
    if (REG[cp]) return; REG[cp] = 1;
    var c = {}, pa = {};
    Object.keys(KC).forEach(function (k) { c[cp + k] = KC[k][0]; pa[cp + k] = KC[k][1]; });
    HW.addCodes(c); HW.addPartial(pa);
  };
  HW.addCodes({ 'u8k-exact': 'Decimals instead of exact values (format)' });

  /* ---------- rationals ---------- */
  function gcd(a, b) { return ex.gcd(Math.abs(a), Math.abs(b)); }
  function lcm(a, b) { return Math.abs(a) / (gcd(a, b) || 1) * Math.abs(b); }
  function R(x) {
    if (Array.isArray(x)) return ex.norm(x[0], x[1]);
    if (x % 1 === 0) return [x, 1];
    for (var q = 2; q <= 400; q++) { var p = Math.round(x * q); if (Math.abs(p / q - x) < 1e-9) return ex.norm(p, q); }
    throw new Error('u8kit: not a simple rational ' + x);
  }
  function qa(a, b) { a = R(a); b = R(b); return ex.norm(a[0] * b[1] + b[0] * a[1], a[1] * b[1]); }
  function qn(a) { a = R(a); return [-a[0], a[1]]; }
  function qs(a, b) { return qa(a, qn(b)); }
  function qm(a, b) { a = R(a); b = R(b); return ex.norm(a[0] * b[0], a[1] * b[1]); }
  function qd(a, b) { a = R(a); b = R(b); return ex.norm(a[0] * b[1], a[1] * b[0]); }
  function qv(a) { a = R(a); return a[0] / a[1]; }
  function qt(a) { return ex.texRat(R(a)); }
  function qeq(a, b) { a = R(a); b = R(b); return a[0] === b[0] && a[1] === b[1]; }
  U.R = R; U.qa = qa; U.qs = qs; U.qm = qm; U.qd = qd; U.qv = qv; U.qt = qt; U.qeq = qeq; U.gcd = gcd; U.lcm = lcm;

  /* ---------- surds a + b√n ---------- */
  function S(r, s, n) { r = R(r); s = R(s || 0); n = n || 1; if (n === 1) { r = qa(r, s); s = [0, 1]; } if (s[0] === 0) n = 1; return { r: r, s: s, n: n }; }
  function sv(z) { return qv(z.r) + qv(z.s) * Math.sqrt(z.n); }
  function irr(z) { return z.n > 1 && z.s[0] !== 0; }
  function stex(z, pm) {
    if (!irr(z)) return qt(z.r);
    var D = lcm(z.r[1], z.s[1]), Pn = z.r[0] * D / z.r[1], Qn = z.s[0] * D / z.s[1];
    var rad = (Math.abs(Qn) === 1 ? '' : Math.abs(Qn)) + '\\sqrt{' + z.n + '}';
    var num = (Pn ? String(Pn) : '') + (pm ? (Qn < 0 ? '\\mp ' : '\\pm ') : (Qn < 0 ? '-' : (Pn ? '+' : ''))) + rad;
    return D === 1 ? num : '\\frac{' + num + '}{' + D + '}';
  }
  function slin(z, al, be) { return S(qa(qm(al, z.r), be || 0), qm(al, z.s), z.n); }
  U.S = S; U.sv = sv; U.irr = irr; U.stex = stex; U.slin = slin;

  /* ---------- polynomials ---------- */
  function M(c, e) { return e ? P.mono(R(c), { x: e }) : P.num(R(c)); }
  function quad(q) { return P.add(M(q[0], 2), M(q[1], 1), M(q[2], 0)); }
  function lin(l) { return P.add(M(l[0], 1), M(l[1], 0)); }
  function tx(p, dec) { var s = P.tex(p, dec ? { dec: true } : undefined); return s === '' ? '0' : s; }
  function sub(tex, xt) { return tex.replace(/x/g, '(' + xt + ')'); }
  function coefT(c) { c = R(c); return c[0] === c[1] ? '' : c[0] === -c[1] ? '-' : qt(c); }
  function par(n) { return qv(n) < 0 ? '(' + qt(n) + ')' : qt(n); }
  function sg(n) { return qv(n) < 0 ? qt(n) : '+' + qt(n); }
  function dtex(a, b, c, dec) { var f = dec ? function (x) { return String(qv(x)); } : qt; return (qv(b) < 0 ? '(' + f(b) + ')' : f(b)) + '^{2}-4(' + f(a) + ')(' + f(c) + ')'; }
  U.dtex = dtex;
  U.M = M; U.quad = quad; U.lin = lin; U.tx = tx; U.sub = sub; U.coefT = coefT; U.par = par; U.sg = sg;
  /* a line y = mx + k shown as y = …, or in a standard form (mx − y = −k, x + y = k, y − mx = k) */
  U.lineShow = function (r, m, k, std) {
    if (!std) return { tex: 'y=' + tx(lin([m, k])), std: false };
    var kind = r.pick(m === -1 || m === 1 ? ['sum', 'mxy'] : ['mxy', 'ymx']);
    if (kind === 'sum') return { tex: m === -1 ? 'x+y=' + k : 'y-x=' + k, std: true };
    if (kind === 'mxy') return { tex: tx(lin([m, 0])) + '-y=' + (-k), std: true };
    return { tex: 'y' + (m > 0 ? '-' + coefT(m) : '+' + coefT(-m)) + 'x=' + k, std: true };
  };

  /* ---------- solving A x² + B x + C = 0 ---------- */
  function sqf(D) { var f = 1, n = D; for (var p = 2; p * p <= n; p++) while (n % (p * p) === 0) { n /= p * p; f *= p; } return { f: f, n: n }; }
  U.roots = function (E) {
    var A0 = R(E[0]), B0 = R(E[1]), C0 = R(E[2]);
    var L = lcm(lcm(A0[1], B0[1]), C0[1]);
    var a = A0[0] * L / A0[1], b = B0[0] * L / B0[1], c = C0[0] * L / C0[1];
    var g = gcd(gcd(a, b), c) || 1, lead = a !== 0 ? a : b !== 0 ? b : c; if (lead < 0) g = -g;
    a /= g; b /= g; c /= g;
    var o = { A: A0, B: B0, C: C0, a: a, b: b, c: c, f: ex.norm(L, g), xs: [] };
    if (a === 0) { if (b === 0) { o.kind = c === 0 ? 'inf' : 'false'; return o; } o.kind = 'lin'; o.xs = [S(ex.norm(-c, b))]; return o; }
    var D = b * b - 4 * a * c; o.D = D;
    if (D < 0) { o.kind = 'none'; return o; }
    if (D === 0) { o.kind = 'one'; o.xs = [S(ex.norm(-b, 2 * a))]; return o; }
    var q = sqf(D); o.sq = q; o.kind = 'two';
    o.xs = q.n === 1 ? [S(ex.norm(-b - q.f, 2 * a)), S(ex.norm(-b + q.f, 2 * a))] : [S(ex.norm(-b, 2 * a), ex.norm(-q.f, 2 * a), q.n), S(ex.norm(-b, 2 * a), ex.norm(q.f, 2 * a), q.n)];
    return o;
  };
  function factorTex(o) {
    var fs = o.xs.map(function (x) { var r = x.r; return r[0] === 0 ? 'x' : '(' + tx(lin([r[1], -r[0]])) + ')'; });
    if (o.kind === 'one') return fs[0] + '^{2}';
    if (fs[1] === 'x') fs.reverse();
    return fs.join('');
  }
  U.factorTex = factorTex;
  /* the working after the equation E = 0 is written: clear fractions / divide, then factor, formula or discriminant */
  U.work = function (o, opt) {
    opt = opt || {};
    var s = '', ET = tx(quad([o.a, o.b, o.c]));
    if (!qeq(o.f, [1, 1])) {
      var f = o.f;
      s += (f[1] === 1 ? 'Multiply by ' + t(qt(f)) : f[0] === 1 ? 'Divide by ' + t(f[1]) : f[0] === -1 ? 'Divide by ' + t(-f[1]) : 'Multiply by ' + t(qt(f))) + ': ' + t(ET + '=0') + '.<br>';
    }
    if (o.kind === 'lin') return s + 'The ' + t('x^{2}') + '-terms cancel: ' + t(ET + '=0') + ', so ' + t('x=' + stex(o.xs[0])) + '.';
    if (o.kind === 'false') return s + 'Everything but the constant cancels: ' + t(o.c + '=0') + ' is false, so there is <b>no solution</b>.';
    if (o.kind === 'inf') return s + 'Everything cancels: ' + t('0=0') + ', so the equations describe the same graph: <b>infinitely many</b> solutions.';
    var dT = t(dtex(o.a, o.b, o.c) + '=' + o.D);
    if (o.kind === 'none') return s + 'The discriminant is ' + dT + ', which is negative: no real roots, so <b>no solution</b>.';
    if (o.kind === 'one') return s + 'Factor: ' + t(factorTex(o) + '=0') + ', so ' + t('x=' + stex(o.xs[0])) + ' (a double root' + (opt.what ? ': ' + opt.what : '') + ').';
    if (!irr(o.xs[0])) return s + 'Factor: ' + t(factorTex(o) + '=0') + ', so ' + t('x=' + stex(o.xs[0])) + ' or ' + t('x=' + stex(o.xs[1])) + '.';
    if (o.sq.f === 1 && gcd(o.b, 2 * o.a) === 1) return s + 'It does not factor. ' + t('x=\\dfrac{' + (o.b ? -o.b : '') + '\\pm\\sqrt{' + o.D + '}}{' + 2 * o.a + '}') + '.';
    var nb = String(-o.b === 0 ? '' : -o.b), mid = o.sq.f > 1 ? '=\\dfrac{' + nb + '\\pm ' + o.sq.f + '\\sqrt{' + o.sq.n + '}}{' + 2 * o.a + '}' : '';
    return s + 'It does not factor. ' + t('x=\\dfrac{' + nb + '\\pm\\sqrt{' + o.D + '}}{' + 2 * o.a + '}' + mid + '=' + stex(o.xs[1], true)) + '.';
  };

  function mkPt(x, y) { return { x: sv(x), y: sv(y), xt: stex(x), yt: stex(y), X: x, Y: y }; }
  function ptT(p) { return '(' + p.xt + ',\\ ' + p.yt + ')'; }
  U.mkPt = mkPt; U.ptT = ptT;
  U.pt = function (x, y) { return mkPt(S(x), S(y)); };
  /* rational coordinates with a terminating decimal written as decimals (contexts with decimal coefficients) */
  function decT(z) { if (irr(z)) return stex(z); var q = z.r[1]; while (q % 2 === 0) q /= 2; while (q % 5 === 0) q /= 5; return q === 1 ? String(Number(qv(z.r).toFixed(6))) : qt(z.r); }
  U.decPts = function (pts) { return pts.map(function (p) { var o = Object.assign({}, p); o.xt = decT(p.X); o.yt = decT(p.Y); return o; }); };
  /* linear–quadratic: Q = [a, b, c] (y = ax² + bx + c), L = [m, k] (y = mx + k) */
  U.lq = function (Q, L) {
    var E = [Q[0], qs(Q[1], L[0]), qs(Q[2], L[1])], o = U.roots(E);
    o.Q = Q; o.L = L; o.Qp = quad(Q); o.Lp = lin(L); o.E = quad(E);
    o.pts = o.xs.map(function (x) { return mkPt(x, slin(x, L[0], L[1])); });
    o.yOf = function (x) { return qv(L[0]) * x + qv(L[1]); };
    return o;
  };
  /* quadratic–quadratic: y = P1 and y = P2 (coefficient lists); y from P2 */
  U.qq = function (P1, P2) {
    var E = [qs(P1[0], P2[0]), qs(P1[1], P2[1]), qs(P1[2], P2[2])], o = U.roots(E);
    o.P1 = P1; o.P2 = P2; o.P1p = quad(P1); o.P2p = quad(P2); o.E = quad(E);
    o.pts = o.xs.map(function (x) {
      if (!irr(x)) return mkPt(x, S(P.atExact(o.P2p, { x: x.r })));
      // x² = −(Bx + C)/A, so y = (b2 − a2·B/A) x + (c2 − a2·C/A)
      var al = qs(P2[1], qm(P2[0], qd(E[1], E[0]))), be = qs(P2[2], qm(P2[0], qd(E[2], E[0])));
      return mkPt(x, slin(x, al, be));
    });
    o.yOf = function (x) { return P.at(o.P2p, { x: x }); };
    return o;
  };
  function yLines(o, Ltex, from) {
    if (!o.pts.length) return '';
    if (irr(o.xs[0])) {
      var z = o.xs[1], y = o.pts[1].Y;
      return 'Use ' + from + ': ' + t('y=' + sub(Ltex, stex(z, true)) + '=' + stex(y, true)) + '.<br>';
    }
    return o.pts.map(function (p) { return t('x=' + p.xt) + ': ' + t('y=' + sub(Ltex, p.xt) + '=' + p.yt); }).join('; ') + '.<br>';
  }
  function ending(o, chkP, chkName) {
    if (!o.pts.length) return '';
    var s = (o.pts.length === 1 ? 'One solution: ' : 'Solutions: ') + o.pts.map(function (p) { return t(ptT(p)); }).join(' and ') + '.';
    if (chkP && !irr(o.xs[0])) { var p = o.pts[0]; s += ' Check ' + t(ptT(p)) + ' in ' + chkName + ': ' + t(sub(tx(chkP, true), p.xt) + '=' + qt(P.atExact(chkP, { x: p.X.r }))) + ' ✓'; }
    return s;
  }
  /* worked solution, substitution (opt.pre: a first line, e.g. rewriting the line; opt.elim 'sub'|'add': wording) */
  U.lqSol = function (o, opt) {
    opt = opt || {};
    var QT = tx(o.Qp, opt.dec), LT = tx(o.Lp, opt.dec), ET = tx(o.E, opt.dec);
    var s = (opt.pre || '');
    if (opt.elim) s += (opt.elim === 'add' ? 'The ' + t('y') + '-terms are opposites, so add the equations: ' : 'Subtract the equations to eliminate ' + t('y') + ': ') + t(ET + '=0') + '.<br>';
    else s += 'Substitute: ' + t(QT + '=' + LT) + ', so ' + t(ET + '=0') + '.<br>';
    s += U.work(o, { what: 'the line is tangent' }) + '<br>' + yLines(o, LT, 'the linear equation') + ending(o, opt.check === false ? null : o.Qp, 'the quadratic');
    return s;
  };
  U.qqSol = function (o, opt) {
    opt = opt || {};
    var T1 = tx(o.P1p, opt.dec), T2 = tx(o.P2p, opt.dec), ET = tx(o.E, opt.dec);
    var s = (opt.pre || '') + 'Set the right sides equal (subtract): ' + t(T1 + '=' + T2) + ', so ' + t(ET + '=0') + '.<br>';
    s += U.work(o, { what: 'the parabolas touch' }) + '<br>' + yLines(o, T2, t('y=' + T2)) + ending(o, opt.check === false ? null : o.P1p, 'the other equation');
    return s;
  };
  /* standard wrong answers for rational roots: roots with the opposite signs; a double root as ±x */
  U.signWrongs = function (cp, o) {
    var wr = [];
    if (!o.xs.length || irr(o.xs[0])) return wr;
    var xs = o.xs.map(sv), ns = xs.map(function (x) { return -x; });
    if (!ns.every(function (x) { return xs.some(function (y) { return Math.abs(x - y) < 1e-9; }); })) wr.push({ pts: ns.map(function (x) { return [x, o.yOf(x)]; }), code: cp + 'root-sign', hint: 'Check the signs of your roots: a factor ' + t('(x-3)') + ' gives ' + t('x=3') + '.' });
    if (o.kind === 'one' && xs[0] !== 0) wr.push({ pts: [[xs[0], o.yOf(xs[0])], [-xs[0], o.yOf(-xs[0])]], code: cp + 'double-root', hint: 'A perfect square has only one root: ' + t(factorTex(o) + '=0') + ' gives one point.' });
    return wr;
  };

  /* ---------- parts ---------- */
  U.pairs = function (cp, prompt, pts, o, sol, hints, text) {
    o = o || {};
    var part = A().pairsPart(cp, prompt, pts.map(function (p) { return { x: p.x, y: p.y, xt: p.xt, yt: p.yt }; }), o, sol, hints, text);
    var exact = o.dp == null && pts.some(function (p) { return p.X && (irr(p.X) || irr(p.Y)); });
    if (exact) {
      var inner = part.check;
      part.check = function (resp) {
        var r = inner(resp);
        if (r.v === 'correct' && /\d\.\d{3,}/.test(String(resp))) return form('u8k-exact', 'Those are decimals. Give the exact values: keep the ' + t('\\sqrt{\\ }') + '.');
        return r;
      };
      part.bad.push(pts.map(function (p) { return '(' + p.x.toFixed(6) + ',\\ ' + p.y.toFixed(6) + ')'; }).join(',\\ '));
    }
    return part;
  };
  /* rounded pairs (dp places) */
  U.pairsRounded = function (cp, prompt, pts, dp, o, sol, hints, text) {
    o = Object.assign({}, o || {}, { dp: dp });
    var rp = pts.map(function (p) { return { x: p.x, y: p.y, xt: K.roundTo(p.x, dp).toFixed(dp), yt: K.roundTo(p.y, dp).toFixed(dp) }; });
    return A().pairsPart(cp, prompt, rp, o, sol, hints, text);
  };
  U.countMC = function (r, prompt, n, calc, opt) {
    opt = opt || {};
    var verdict = n === 'inf' ? 'The equations describe the same graph: <b>infinitely many</b> solutions.' : n === 2 ? 'Positive: <b>two</b> solutions.' : n === 1 ? (opt.lin ? 'A linear equation has one root: <b>one</b> solution.' : 'Zero: <b>one</b> solution' + (opt.qq ? ' (the parabolas touch).' : ' (the line is tangent).')) : opt.falseStmt ? 'A false statement: <b>no</b> solution.' : 'Negative: <b>no</b> solution.';
    var opts = [0, 1, 2, 'inf'].map(function (v) {
      var right = v === n, why = null;
      if (!right) why = v === 'inf' ? (opt.qq ? 'Infinitely many happens only when both equations describe the same parabola. ' : 'A line and a parabola meet at most twice. ') + calc : calc + ' Check what the result tells you.';
      return { html: v === 'inf' ? 'infinitely many' : t(v), right: right, code: 'n' + v, why: why };
    });
    return KP.mc(r, prompt, opts, calc + ' ' + verdict, opt.hints || ['Eliminate ' + t('y') + ' to get one equation in standard form ' + t('ax^{2}+bx+c=0') + '.', 'Its discriminant ' + t('b^{2}-4ac') + ': positive → two, zero → one, negative → none.'], opt.text || 'number of solutions', true);
  };
  U.SET = function () { return A().SET; };
  U.setCheck = function (cp, T, o) { return A().setPart(cp, '', T, o || {}, '', [], '').check; };
  U.setKey = function (T, v) { return A().setPart('u8k-', '', T, { v: v }, '', [], '').key; };
  /* two inequality boxes: the values of v for two solutions and for no solution */
  U.kRanges = function (cp, prompt, v, k0, twoAbove, sol, hints, text) {
    var SET = A().SET, above = SET.above(k0, false), below = SET.below(k0, false), Two = twoAbove ? above : below, None = twoAbove ? below : above;
    function wr(T, oth, what) {
      return [{ parts: oth, code: cp + 'k-dir', hint: 'Check the direction: ' + what + '. Solve that inequality for ' + t(v) + ' (dividing by a negative reverses the sign).' },
        { parts: T[0].lo === -Infinity ? SET.below(k0, true) : SET.above(k0, true), code: cp + 'k-incl', hint: 'At ' + t(v + '=' + qt(k0)) + ' the discriminant is ' + t('0') + ': one solution, so that value is not included.' },
        { parts: SET.pt(k0), code: cp + 'k-tangent', hint: 'That value gives <b>one</b> solution. Write an inequality.' }];
    }
    var c1 = U.setCheck(cp, Two, { v: v, wrongs: wr(Two, None, 'two solutions need a <b>positive</b> discriminant') }), c2 = U.setCheck(cp, None, { v: v, wrongs: wr(None, Two, 'no solution needs a <b>negative</b> discriminant') });
    var kT = U.setKey(Two, v), kN = U.setKey(None, v);
    var part = { prompt: prompt, input: { type: 'fields', fields: [{ label: 'Two solutions:', mode: 'math', keys: 'u8set', vars: [v], name: 'Two solutions', placeholder: 'e.g. ' + v + ' > 4' }, { label: 'No solution:', mode: 'math', keys: 'u8set', vars: [v], name: 'No solution', placeholder: 'e.g. ' + v + ' < 4' }] },
      check: K.fields([c1, c2], { labels: ['Two solutions', 'No solution'] }), key: [kT, kN], answer: 'Two solutions: ' + t(kT) + '; no solution: ' + t(kN), solution: sol, hints: hints || [], text: text };
    part.bad = [[kN, kT], [U.setKey(SET.pt(k0), v), kN]];
    return part;
  };
  /* one constant (number box) and one point (pairs box) */
  U.kPoint = function (cp, prompt, v, k0, pt, sol, hints, text, wr) {
    var kChk = K.number(qv(k0), function (x) { return Math.abs(x + qv(k0)) < 1e-9 && qv(k0) !== 0 ? { code: cp + 'k-sign', hint: 'Check the sign of ' + t(v) + ': set the discriminant equal to ' + t('0') + ' and solve carefully.' } : null; });
    var pChk = A().pairsPart(cp, '', [{ x: pt.x, y: pt.y, xt: pt.xt, yt: pt.yt }], { wrongs: wr || [] }, '', [], '').check;
    var chk = function (resp) {
      resp = resp || [];
      var a = kChk(resp[0] == null ? '' : resp[0]), b = pChk(resp[1] == null ? '' : resp[1]);
      if (a.v === 'correct' && b.v === 'correct') return ok();
      if (a.v !== 'correct') return a.v === 'form' ? a : wrong(a.code === 'value' ? 'value' : a.code, '<b>' + v + ':</b> ' + (a.hint || 'Eliminate ' + t('y') + ' and set the discriminant equal to ' + t('0') + '.'));
      return b.v === 'form' ? b : wrong(b.code === 'value' ? cp + 'k-point' : b.code, '<b>Point:</b> ' + (b.hint && b.code !== 'value' ? b.hint : 'Right ' + t(v) + '. Put it back, solve the perfect square for ' + t('x') + ', then find ' + t('y') + '.'));
    };
    var part = { prompt: prompt, input: { type: 'fields', fields: [{ label: t(v + '='), name: v }, { label: 'Point:', mode: 'math', keys: 'u8pairs', name: 'Point', placeholder: 'e.g. (1, 3)' }] },
      check: chk, key: [qt(k0).replace(/\\frac\{(\d+)\}\{(\d+)\}/, '$1/$2'), ptT(pt)], answer: t(v + '=' + qt(k0)) + '; point ' + t(ptT(pt)), solution: sol, hints: hints || [], text: text };
    part.bad = [[String(-qv(k0) || 99), ptT(pt)], [part.key[0], '(' + pt.yt + ',\\ ' + pt.xt + ')']];
    if (pt.xt === pt.yt) part.bad.pop();
    return part;
  };
  /* values of v (two) and the points of tangency */
  U.tanPart = function (cp, prompt, v, vals, pts, wrongPts, sol, hints, text, o2) {
    var vChk = K.valueSet(vals, { v: v, diag: function (Ag) { if (Ag.length === 1 && vals.some(function (x) { return Math.abs(Ag[0] - x) < 1e-9; })) return { code: cp + 'tan-one', hint: 'There are two values: the equation you solved for ' + t(v) + ' has two roots.' }; return null; } });
    var pChk = A().pairsPart(cp, '', pts.map(function (p) { return { x: p.x, y: p.y, xt: p.xt, yt: p.yt }; }), { wrongs: wrongPts ? [{ pts: wrongPts, code: cp + 'tan-pts', hint: 'Pair each value with its own point: substitute each ' + t(v) + ' back and solve the perfect square.' }] : [] }, '', [], '').check;
    var chk = function (resp) {
      resp = resp || [];
      var a = vChk(resp[0] == null ? '' : resp[0]), b = pChk(resp[1] == null ? '' : resp[1]);
      if (a.v === 'correct' && b.v === 'correct') return ok();
      if (a.v === 'wrong') return wrong(a.code, '<b>Values of ' + t(v) + ':</b> ' + (a.hint || 'Set the discriminant equal to ' + t('0') + ' and solve for ' + t(v) + '.'));
      if (a.v === 'form') return a;
      if (b.v === 'form') return { v: 'form', code: b.code, hint: '<b>Points:</b> ' + b.hint };
      return wrong(b.code === 'value' ? cp + 'tan-pts' : b.code, '<b>Points:</b> ' + (b.hint || 'Substitute each value back to find its point of tangency.'));
    };
    var vk = vals.map(function (x) { return v + '=' + qt(x); }).join(',\\ '), pk = pts.map(ptT).join(',\\ ');
    var part = { prompt: prompt, input: { type: 'fields', fields: [{ label: 'Values of ' + t(v) + ':', mode: 'math', keys: 'u8kval', vars: [v], name: 'Values', placeholder: 'e.g. ' + v + ' = 4, ' + v + ' = -4' }, { label: (o2 && o2.ptsLabel) || 'Points:', mode: 'math', keys: 'u8kval', vars: [v], name: 'Points', placeholder: 'e.g. (2, 7), (-2, 7)' }] },
      check: chk, key: [vk, pk], answer: vals.map(function (x) { return t(v + '=' + qt(x)); }).join(' and ') + '; points ' + pts.map(function (p) { return t(ptT(p)); }).join(' and '), solution: sol, hints: hints || [], text: text };
    part.bad = [[v + '=' + qt(vals[1]), pk]];
    if (wrongPts) part.bad.push([vk, wrongPts.map(function (p) { return '(' + p[0] + ',\\ ' + p[1] + ')'; }).join(',\\ ')]);
    return part;
  };
  /* equations y = mx + k (any order) */
  function readEqs(resp) {
    var s = String(resp == null ? '' : resp).replace(/\\(left|right)/g, '').replace(/\\(text|mathrm|operatorname)\{\s*(and|or)\s*\}/gi, ',').replace(/\b(and|or)\b/gi, ',').replace(/\\[,;: !]|~/g, ' ').replace(/;/g, ',').trim();
    if (!s) return { empty: true };
    var out = [], bits = s.split(',');
    for (var i = 0; i < bits.length; i++) {
      var b = bits[i].trim(); if (!b) continue;
      var sides = b.split('='); if (sides.length !== 2) return { bad: true };
      var l = sides[0].replace(/\s/g, ''), rr = sides[1].replace(/\s/g, ''), other;
      if (l === 'y') other = rr; else if (rr === 'y') other = l; else return { noy: true };
      var pr = P.read(other); if (!pr.ok) return { bad: true };
      if (P.vars(pr.p).some(function (w) { return w !== 'x'; }) || P.degree(pr.p) > 1) return { bad: true };
      out.push([qv(P.coef(pr.p, { x: 1 })), qv(P.constant(pr.p))]);
    }
    return out.length ? { lines: out } : { empty: true };
  }
  U.lineEqsCheck = function (cp, lines, o) {
    o = o || {};
    return function (resp) {
      var L = readEqs(resp);
      if (L.empty) return form('empty', 'Type your answer first.');
      if (L.noy) return form('eq-form', 'Write each line as ' + t('y=mx+b') + ', separated by commas.');
      if (L.bad) return form('unreadable', 'Write each line as ' + t('y=mx+b') + ', e.g. ' + t('y=6x-4,\\ y=-2x-4') + '.');
      var A2 = L.lines, same = function (p, q) { return Math.abs(p[0] - q[0]) < 1e-9 && Math.abs(p[1] - q[1]) < 1e-9; };
      var hit = A2.filter(function (p) { return lines.some(function (q) { return same(p, q); }); });
      if (hit.length === A2.length && A2.length === lines.length && lines.every(function (q) { return A2.some(function (p) { return same(p, q); }); })) return ok();
      if (hit.length === A2.length && A2.length < lines.length) return wrong(cp + 'tan-one', 'Correct so far, but there ' + (lines.length - A2.length === 1 ? 'is another line' : 'are more lines') + ': the equation for ' + t('m') + ' has two roots.');
      if (o.diag) { var h = o.diag(A2); if (h) return wrong(h.code, h.hint); }
      return wrong(cp + 'eq-line', 'Check each line: it must pass through the given point and touch the parabola once (discriminant ' + t('0') + ').');
    };
  };
  U.lineEqsPart = function (cp, prompt, lines, o, sol, hints, text) {
    var key = lines.map(function (l) { return 'y=' + tx(lin(l)); }).join(',\\ ');
    var part = KP.math(prompt, U.lineEqsCheck(cp, lines, o), key, sol, hints, text, { keys: 'u8keq', placeholder: 'e.g. y = 6x - 4, y = -2x - 4' });
    part.bad = ['y=' + tx(lin(lines[0]))];
    return part;
  };
  /* is each point a solution of the system? rows [{ pt:[x,y], on1, on2 }]; names [first, second] */
  U.verifyGrid = function (cp, prompt, rows, names, sol, hints, text) {
    var R0 = rows.map(function (rw, i) { return { id: 'p' + i, html: t('(' + qt(rw.pt[0]) + ',\\ ' + qt(rw.pt[1]) + ')') }; });
    var want = {}; rows.forEach(function (rw, i) { want['p' + i] = rw.on1 && rw.on2 ? 'yes' : 'no'; });
    var cols = [{ id: 'yes', html: 'a solution' }, { id: 'no', html: 'not a solution' }];
    var p = KP.grid(prompt, R0, cols, want, { why: function (id, given) {
      var rw = rows[Number(id.slice(1))];
      if (given === 'yes' && (rw.on1 || rw.on2)) return { code: cp + 'verify', hint: t('(' + qt(rw.pt[0]) + ',\\ ' + qt(rw.pt[1]) + ')') + ' is on ' + (rw.on1 ? names[0] : names[1]) + ' but not on ' + (rw.on1 ? names[1] : names[0]) + '. A solution must satisfy <b>both</b> equations.' };
      return { code: cp + 'verify', hint: 'Substitute each point into <b>both</b> equations. One row isn’t right yet.' };
    } }, sol, hints, text);
    var bad = {}; Object.keys(want).forEach(function (k) { bad[k] = 'yes'; }); p.bad = [bad];
    return p;
  };
  /* keypad: equations y = … (several, separated by commas) */
  var W = HW.widgets;
  if (W && W.KEYSETS) {
    var dk = function (n) { return { label: String(n), tex: String(n), plain: String(n) }; };
    var KY = { del: { label: '⌫', fn: 'del', title: 'Delete' }, clear: { label: 'clear', fn: 'clear' }, left: { label: '◀', fn: 'left', title: 'Move left' }, right: { label: '▶', fn: 'right', title: 'Move right (out of a box)' }, enter: { label: 'Check ↵', fn: 'enter', wide: true },
      minus: { label: '−', tex: '-', plain: '-' }, plus: { label: '+', tex: '+', plain: '+' }, dot: { label: '.', tex: '.', plain: '.' }, comma: { label: ',', tex: ',', plain: ', ' }, eq: { label: '=', tex: '=', plain: ' = ' },
      frac: { label: '<sup>a</sup>⁄<sub>b</sub>', tex: '\\frac{#@}{#?}', plain: '/', title: 'Fraction' }, sq: { label: '□²', tex: '^{2}', plain: '^2', title: 'Squared' }, par: { label: '( )', tex: '\\left(#0\\right)', plain: '(', title: 'Brackets' },
      x: { label: '<i>x</i>', tex: 'x', plain: 'x' }, y: { label: '<i>y</i>', tex: 'y', plain: 'y' } };
    W.KEYSETS.u8keq = function () {
      return [[dk(7), dk(8), dk(9), KY.plus, KY.minus, KY.del], [dk(4), dk(5), dk(6), KY.frac, KY.par, KY.clear], [dk(1), dk(2), dk(3), KY.eq, KY.left, KY.right], [dk(0), KY.dot, KY.x, KY.y, KY.sq, KY.comma, KY.enter]];
    };
    /* values of one letter (v = …, ±) and ordered pairs */
    W.KEYSETS.u8kval = function (opt) {
      var v = (opt && opt.vars && opt.vars[0]) || 'm';
      return [[dk(7), dk(8), dk(9), KY.par, KY.del], [dk(4), dk(5), dk(6), KY.frac, KY.clear], [dk(1), dk(2), dk(3), KY.minus, KY.left, KY.right], [dk(0), KY.dot, KY.comma, { label: '<i>' + v + '</i> =', tex: v + '=', plain: v + ' = ' }, { label: '±', tex: '\\pm ', plain: '±' }, KY.enter]];
    };
    if (W.KEYHELP) W.KEYHELP.u8kval = ['Values: e.g. ' + HW.k('m=4,\\ m=-4') + '. Points: press <b>( )</b> for each ordered pair, type ' + HW.k('x') + ' <b>,</b> ' + HW.k('y') + ' inside and press <b>▶</b> to step out.', 'Type e.g. <code>m = 4, m = -4</code> and <code>(2, 7), (-2, 7)</code>.'];
    if (W.KEYHELP) W.KEYHELP.u8keq = ['Type each equation, e.g. ' + HW.k('y=6x-4') + ', with a comma between two equations. Use <b>□²</b> for a square.', 'Type e.g. <code>y = 6x - 4, y = -2x - 4</code>.'];
  }
  U.fig = function (g) {
    var spec = { x: g.x || [-6, 6], y: g.y || [-6, 6], grid: g.grid == null ? 1 : g.grid, labels: g.labels || 2, max: g.max || 280, unit: g.unit, aria: g.aria || 'graph',
      fns: (g.curves || []).map(function (c) { return { f: c.f, dash: c.dash, color: c.color, from: c.from, to: c.to }; }), points: g.points || [] };
    return '<div class="fig">' + HW.graph(spec) + '</div>';
  };
  U.yRange = function (vals, lo0, hi0) {
    var lo = Math.min.apply(null, vals.concat([lo0 == null ? -2 : lo0])) - 1, hi = Math.max.apply(null, vals.concat([hi0 == null ? 2 : hi0])) + 1;
    return [Math.max(-14, 2 * Math.floor(lo / 2)), Math.min(14, 2 * Math.ceil(hi / 2))];
  };
  function pickWhere(gen, test, n) { for (var i = 0; i < (n || 20000); i++) { var o = gen(); if (o && test(o)) return o; } throw new Error('u8kit: no instance found'); }
  function nz(r, lo, hi) { return (r.chance(0.5) ? -1 : 1) * r.int(lo, hi); }
  U.pickWhere = pickWhere; U.nz = nz;
  U.HSOLVE = ['Write the linear equation as ' + t('y=\\dots') + ' and substitute it into the quadratic (or set the two expressions for ' + t('y') + ' equal).', 'Solve the quadratic equation (factor, or use the quadratic formula), then use the linear equation to find each ' + t('y') + '.'];
  U.HQQ = ['Write both equations as ' + t('y=\\dots') + ' and set the right sides equal (this eliminates ' + t('y') + ').', 'Collect every term on one side and solve. Find each ' + t('y') + ' from the simpler equation.'];

  /* ======================================================================================================
   * Lesson 1
   * ====================================================================================================== */
  var LID = 'u8l1', CP = 'u8l1-', OUT = 'RF6';
  U.codes(CP);
  var HS = U.HSOLVE;
  var cnt = 0;
  function same(z, ref) { return Object.keys(ref).every(function (k) { return z[k] === ref[k]; }); }
  function excl(z, list) { return !list.some(function (ref) { return same(z, ref); }); }
  function kLin(a, b, v) { return tx(P.add(P.mono(a, mon1(v || 'k')), P.num(b))); }
  function mon1(v) { var o = {}; o[v] = 1; return o; }
  function prPairs(o) { return o.pts.map(function (p) { return t(ptT(p)); }).join(' and ') || 'no solution'; }
  /* integer-root linear–quadratic: y = a x² + bx + c and y = mx + k with Q − L = a(x − r1)(x − r2) */
  function lqInt(r, a, o) {
    o = o || {};
    return pickWhere(function () { var r1 = r.int(o.lo || -6, o.hi || 6), r2 = r.int(o.lo || -6, o.hi || 6), m = nz(r, 1, o.mMax || 5), k = r.int(-8, 8); return { r1: Math.min(r1, r2), r2: Math.max(r1, r2), m: m, k: k, b: m - a * (r1 + r2), c: k + a * r1 * r2 }; },
      function (z) { return z.r1 !== z.r2 && Math.abs(z.b) <= (o.bMax || 9) && Math.abs(z.c) <= (o.cMax || 20) && (o.b0 || z.b !== 0) && (!o.test || o.test(z)) && excl(z, o.ex || []); });
  }
  function lqParts(cp, o, eqs, sol, extraWr, text, prompt) {
    return U.pairs(cp, prompt || ('Solve the system algebraically: ' + eqs + '.'), o.pts, { wrongs: U.signWrongs(cp, o).concat(extraWr || []) }, sol, HS, text);
  }

  /* ---------- Q1 shared: a parabola and a line with two integer intersection points ---------- */
  function q1Shared(r) {
    var s = pickWhere(function () { var a = r.pick([1, -1]), h = r.int(-2, 2), q = a > 0 ? r.int(-5, -1) : r.int(1, 5), x1 = r.int(-3, 2), x2 = r.int(-1, 4); return { a: a, h: h, q: q, x1: x1, x2: x2 }; }, function (z) {
      if (z.x2 - z.x1 < 2) return false;
      var f = function (x) { return z.a * (x - z.h) * (x - z.h) + z.q; }, y1 = f(z.x1), y2 = f(z.x2), m = (y2 - y1) / (z.x2 - z.x1);
      return Math.abs(y1) <= 7 && Math.abs(y2) <= 7 && m !== 0 && m % 1 === 0 && Math.abs(m) <= 3 && !(z.a === -1 && z.h === 1 && z.q === 4 && z.x1 === -1 && z.x2 === 2) && !(z.a === 1 && z.h === 1 && z.q === -4);
    });
    var Q = [s.a, -2 * s.a * s.h, s.a * s.h * s.h + s.q], f = function (x) { return s.a * x * x + Q[1] * x + Q[2]; }, y1 = f(s.x1), y2 = f(s.x2), m = (y2 - y1) / (s.x2 - s.x1), L = [m, y1 - m * s.x1];
    var o = U.lq(Q, L), yr = U.yRange([y1, y2, s.q]);
    s.o = o; s.Q = Q; s.L = L;
    s.fig = U.fig({ x: [-5, 5], y: yr, unit: 20, curves: [{ f: f }, { f: function (x) { return m * x + L[1]; }, color: '#c4532a' }], aria: 'a parabola and a line' });
    return s;
  }

  /* ---------- Q2 shared: one parabola, three parallel lines (two / one / no solutions) ---------- */
  function q2Shared(r) {
    var s = pickWhere(function () { var a = r.pick([[1, 2], [1, 2], [-1, 2], [1, 1], [-1, 1]]), h = r.int(-2, 2), q = r.int(-3, 3), m = nz(r, 1, 3); return { a: a, h: h, q: q, m: m, s: r.pick([1, 2]), d: r.pick([1, 2]) }; }, function (z) {
      var av = qv(z.a), xt = z.h + z.m / (2 * av);
      if (xt % 1 !== 0 || xt === 0 || Math.abs(xt) > 4) return false;
      if ((av * z.s * z.s) % 1 !== 0 || Math.abs(av * z.s * z.s) < 1) return false;
      if (z.h === 0 && z.q === 0 && av === 0.5 && z.m === 2) return false;
      var f = function (x) { return av * (x - z.h) * (x - z.h) + z.q; }, kt = f(xt) - z.m * xt, k2 = kt + av * z.s * z.s;
      var ys = [xt - z.s, xt + z.s].map(function (x) { return z.m * x + k2; });
      return Math.abs(xt - z.s) <= 5 && Math.abs(xt + z.s) <= 5 && ys.every(function (y) { return Math.abs(y) <= 10; }) && Math.abs(f(xt)) <= 8 && kt % 1 === 0;
    });
    var av = qv(s.a), xt = s.h + s.m / (2 * av), f = function (x) { return av * (x - s.h) * (x - s.h) + s.q; }, kt = f(xt) - s.m * xt;
    var k2 = kt + av * s.s * s.s, k0 = kt - (av > 0 ? 1 : -1) * s.d;
    var Q = [s.a, qm(-2 * s.h, s.a), qa(qm(s.h * s.h, s.a), s.q)];
    s.Q = Q; s.av = av; s.xt = xt; s.f = f;
    s.lines = { two: U.lq(Q, [s.m, k2]), one: U.lq(Q, [s.m, kt]), none: U.lq(Q, [s.m, k0]) };
    s.order = r.shuffle(['two', 'one', 'none']);
    var yv = [f(xt), f(-5), f(5)].filter(function (y) { return Math.abs(y) < 12; });
    s.yr = U.yRange(yv.concat([kt], s.lines.two.pts.map(function (p) { return p.y; })), -4, 4); if (s.yr[1] - s.yr[0] < 10) s.yr[1] = s.yr[0] + 10;
    s.fig = U.fig({ x: [-5, 5], y: s.yr, unit: 18, curves: [{ f: f }], aria: 'the parabola' });
    return s;
  }
  function q2Part(key) {
    return function (r, s) {
      var o = s.lines[key], i = s.order.indexOf(key), LT = tx(o.Lp);
      var figSol = U.fig({ x: [-5, 5], y: s.yr, unit: 18, curves: [{ f: s.f }, { f: function (x) { return o.yOf(x); }, color: '#c4532a' }], points: o.pts.map(function (p) { return { x: p.x, y: p.y, color: '#c4532a' }; }), aria: 'the parabola and the line' });
      var sol = (key === 'one' ? 'The line touches the parabola at one point: it is <b>tangent</b>. ' : key === 'two' ? 'The line crosses the parabola at two points. ' : 'The line misses the parabola. ') + figSol + 'Algebra: ' + U.lqSol(o, { check: false });
      return U.pairs(CP, 'Line ' + (i + 1) + ': ' + t('y=' + LT) + '. Graph it with the parabola (on paper or the calculator), then give the solution(s) of the system. (Type “no solution” if they do not meet.)', o.pts, { wrongs: U.signWrongs(CP, o) }, sol,
        ['Graph the line: start at its ' + t('y') + '-intercept and use its slope. Where does it meet the parabola?', 'Check algebraically: substitute ' + t('y=' + LT) + ' into the parabola and solve.'], 'parallel lines and a parabola');
    };
  }

  var QUESTIONS = [
    { num: '1', shared: q1Shared, stem: function (s) { return 'The graphs of ' + t('y=' + tx(s.o.Qp)) + ' and ' + t('y=' + tx(s.o.Lp)) + ' are shown.' + s.fig; },
      parts: [
        { id: '1a', level: 'BEG', make: function (r, s) {
          var o = s.o;
          return U.pairs(CP, 'State the solution of the system.', o.pts, { wrongs: [{ pts: o.pts.map(function (p) { return [p.x, 0]; }), code: CP + 'sys-y', hint: 'The solutions are the points where the two graphs <b>meet</b>, with both coordinates.' }] },
            'The graphs cross at ' + prPairs(o) + '.', ['The solutions of a system are the points where its graphs intersect.', 'Read both coordinates of each crossing point.'], 'solutions from a graph');
        } },
        { id: '1b', level: 'BEG', make: function (r, s) {
          var o = s.o, Qf = function (x) { return P.at(o.Qp, { x: x }); }, Lf = o.yOf;
          var xa = pickWhere(function () { return r.int(-3, 3); }, function (x) { return o.pts.every(function (p) { return p.x !== x; }) && Math.abs(Qf(x)) <= 12 && Qf(x) !== Lf(x); });
          var xb = pickWhere(function () { return r.int(-3, 3); }, function (x) { return x !== xa && o.pts.every(function (p) { return p.x !== x; }) && Math.abs(Lf(x)) <= 12 && Lf(x) !== Qf(x) && Lf(x) % 1 === 0; });
          var rows = r.shuffle([{ pt: [o.pts[0].x, o.pts[0].y], on1: true, on2: true }, { pt: [o.pts[1].x, o.pts[1].y], on1: true, on2: true }, { pt: [xa, Qf(xa)], on1: true, on2: false }, { pt: [xb, Lf(xb)], on1: false, on2: true }]);
          var QT = tx(o.Qp), LT = tx(o.Lp);
          var sol = rows.map(function (rw) { var x = rw.pt[0]; return t('(' + x + ',\\ ' + rw.pt[1] + ')') + ': ' + t(sub(QT, x) + '=' + Qf(x)) + (rw.on1 ? ' ✓' : ' ✗') + ', ' + t(sub(LT, x) + '=' + Lf(x)) + (rw.on2 ? ' ✓' : ' ✗') + ' → ' + (rw.on1 && rw.on2 ? '<b>a solution</b>' : 'not a solution'); }).join('<br>');
          return U.verifyGrid(CP, 'Verify algebraically: for each point, decide whether it is a solution of the system.', rows, ['the parabola', 'the line'], sol,
            ['Substitute the point into <b>both</b> equations. A solution makes both true.'], 'verify solutions');
        } }] },
    { num: '2', shared: q2Shared, stem: function (s) { return 'The parabola ' + t('y=' + tx(quad(s.Q))) + ' is graphed. Three parallel lines are given.' + s.fig; },
      parts: [
        { id: '2a', level: 'BEG', make: function (r, s) { return q2Part(s.order[0])(r, s); } },
        { id: '2b', level: 'EMG', make: function (r, s) { return q2Part(s.order[1])(r, s); } },
        { id: '2c', level: 'BEG', make: function (r, s) { return q2Part(s.order[2])(r, s); } },
        { id: '2d', level: 'EMG', make: function (r, s) {
          var o = s.lines.one, wo = s.lines.two, LT = tx(o.Lp), y0 = o.pts[0];
          var ET = tx(quad([o.a, o.b, o.c]));
          var Ec = tx(quad([o.a, o.b, -o.c])), Dc = o.b * o.b + 4 * o.a * o.c;
          return KP.mc(r, 'Check the tangent line ' + t('y=' + LT) + ' algebraically. Substituting it into the parabola and simplifying gives', [
            { html: t(ET + '=0') + ': discriminant ' + t('0') + ', so one solution, ' + t(ptT(y0)) + ': the line is tangent', right: true },
            { html: t(ET + '=0') + ': discriminant ' + t('0') + ', so no solution', why: 'A zero discriminant means one (double) root: one point of intersection.' },
            { html: t(Ec + '=0') + ': discriminant ' + t(Dc) + ', so two solutions', why: 'Check the constant term: move every term to one side carefully. ' + t(tx(o.Qp) + '=' + LT) + '.' },
            { html: t(ET + '=0') + ': ' + t('x=\\pm ' + Math.abs(qv(o.xs[0].r) || 1)) + ', so two solutions', why: t(factorTex(o) + '=0') + ' has only one root.' }],
            'Substitute: ' + t(tx(o.Qp) + '=' + LT) + '. ' + U.work(o, { what: 'the line is tangent' }) + ' Then ' + t('y=' + y0.yt) + ': one solution ' + t(ptT(y0)) + '. (The other lines give ' + prPairs(wo) + ' and no solution.)',
            ['Substitute the line into the parabola and write the equation in standard form.', 'A tangent gives a double root (discriminant ' + t('0') + ').'], 'check a tangent');
        } }] },
    { num: '3', section: 'Solving algebraically', parts: [
      { id: '3a', level: 'BEG', make: function (r) {
        var z = lqInt(r, 1, { ex: [{ b: -3, c: -2, m: 2, k: 4 }, { b: 2, c: -5, m: 3, k: 1 }] }), o = U.lq([1, z.b, z.c], [z.m, z.k]);
        return lqParts(CP, o, t('y=' + tx(o.Qp)) + ' and ' + t('y=' + tx(o.Lp)), U.lqSol(o), null, 'solve: substitution');
      } },
      { id: '3b', level: 'BEG', make: function (r) {
        var z = lqInt(r, -1, { ex: [{ b: 3, c: 10, m: 1, k: 7 }] }), o = U.lq([-1, z.b, z.c], [z.m, z.k]);
        return lqParts(CP, o, t('y=' + tx(o.Qp)) + ' and ' + t('y=' + tx(o.Lp)), U.lqSol(o), null, 'solve: parabola opening down');
      } },
      { id: '3c', level: 'EMG', make: function (r) {
        var z = pickWhere(function () { return { h: nz(r, 1, 5), m: nz(r, 1, 4), k: r.int(-6, 6) }; }, function (z) { var b = z.m - 2 * z.h, c = z.k + z.h * z.h; return Math.abs(b) <= 10 && Math.abs(c) <= 20 && b !== 0 && !(z.h === -2 && z.m === 2 && z.k === 0); });
        var o = U.lq([1, z.m - 2 * z.h, z.k + z.h * z.h], [z.m, z.k]);
        return lqParts(CP, o, t('y=' + tx(o.Qp)) + ' and ' + t('y=' + tx(o.Lp)), U.lqSol(o), null, 'solve: a tangent');
      } },
      { id: '3d', level: 'PRG', make: function (r) {
        var z = pickWhere(function () { return { a: r.pick([1, 2, 2]), h: r.int(-3, 3), n: r.pick([2, 3, 5, 6, 7, 10]), m: r.pick([-1, -1, 1, 2, -2]), k: r.int(-6, 6) }; }, function (z) { var b = z.m - 2 * z.a * z.h, c = z.k + z.a * (z.h * z.h - z.n); return Math.abs(b) <= 12 && Math.abs(c) <= 24 && !(z.a === 2 && z.h === 1 && z.n === 3) && !(z.h === 3 && z.n === 5); });
        var Q = [z.a, z.m - 2 * z.a * z.h, z.k + z.a * (z.h * z.h - z.n)], o = U.lq(Q, [z.m, z.k]), ls = U.lineShow(r, z.m, z.k, true);
        return lqParts(CP, o, t('y=' + tx(o.Qp)) + ' and ' + t(ls.tex), U.lqSol(o, { pre: 'Write the linear equation as ' + t('y=' + tx(o.Lp)) + '.<br>' }), null, 'solve: exact radical answers', 'Solve the system algebraically: ' + t('y=' + tx(o.Qp)) + ' and ' + t(ls.tex) + '. Give exact answers.');
      } },
      { id: '3e', level: 'PRG', make: function (r) {
        var z = pickWhere(function () { var a = r.pick([2, 3, 3, 4]); return { a: a, p: nz(r, 1, a * 2), r2: r.int(-4, 4), m: nz(r, 1, 4), k: r.int(-7, 7) }; }, function (z) {
          if (gcd(z.p, z.a) !== 1) return false; var r1 = z.p / z.a; if (Math.abs(r1 - z.r2) < 1e-9) return false;
          var b = z.m - z.a * (r1 + z.r2), c = z.k + z.a * r1 * z.r2; return b % 1 === 0 && c % 1 === 0 && Math.abs(b) <= 12 && Math.abs(c) <= 18 && !(z.a === 3 && z.p === 1 && z.r2 === 2 && z.m === 3) && !(z.a === 2 && z.p === -1 && z.r2 === 2 && z.m === 4);
        });
        var r1 = z.p / z.a, Q = [z.a, Math.round(z.m - z.a * (r1 + z.r2)), Math.round(z.k + z.a * r1 * z.r2)], o = U.lq(Q, [z.m, z.k]), ls = U.lineShow(r, z.m, z.k, true);
        return lqParts(CP, o, t(ls.tex) + ' and ' + t('y=' + tx(o.Qp)), U.lqSol(o, { pre: 'Write the linear equation as ' + t('y=' + tx(o.Lp)) + '.<br>' }), null, 'solve: a fractional root');
      } }] },
    { num: '4', section: 'Elimination', parts: [
      { id: '4a', level: 'BEG', make: function (r) {
        var z = lqInt(r, 1, { ex: [{ b: -2, c: 5, m: 4, k: -3 }] }), o = U.lq([1, z.b, z.c], [z.m, z.k]);
        return U.pairs(CP, 'Solve by elimination: ' + t('y=' + tx(o.Qp)) + ' and ' + t('y=' + tx(o.Lp)) + '.', o.pts, { wrongs: U.signWrongs(CP, o) }, U.lqSol(o, { elim: 'sub' }),
          ['Both equations start ' + t('y=') + ': subtract one from the other to eliminate ' + t('y') + '.', 'Solve the quadratic that is left, then use the line to find each ' + t('y') + '.'], 'elimination: subtract');
      } },
      { id: '4b', level: 'EMG', make: function (r) {
        // up: x² − y = d and px + y = e (y = x² − d, y = e − px); down: x² + y = d and px − y = e (y = d − x², y = px − e)
        var up = r.chance(0.5), z = pickWhere(function () { return { r1: r.int(-6, 5), r2: r.int(-5, 6), d: r.int(-6, 9) }; }, function (z) {
          if (z.r1 >= z.r2) return false; var p = -(z.r1 + z.r2), e = -z.r1 * z.r2 - z.d;
          return p !== 0 && Math.abs(p) <= 6 && Math.abs(e) <= 15 && !(up && p === 2 && z.d === 3) && !(!up && p === 3 && z.d === 7);
        });
        // both: adding gives x² + px = d + e with roots r1, r2
        var p = -(z.r1 + z.r2), e = -z.r1 * z.r2 - z.d, eqs, Q, L, sol;
        if (up) { Q = [1, 0, -z.d]; L = [-p, e]; eqs = t('x^{2}-y=' + z.d) + ' and ' + t(tx(lin([p, 0])) + '+y=' + e); }
        else { Q = [-1, 0, z.d]; L = [p, -e]; eqs = t('x^{2}+y=' + z.d) + ' and ' + t(tx(lin([p, 0])) + '-y=' + e); }
        var o = U.lq(Q, L);
        sol = 'The ' + t('y') + '-terms are opposites, so add the equations: ' + t(tx(quad([1, p, 0])) + '=' + (z.d + e)) + ', so ' + t(tx(quad([1, p, -(z.d + e)])) + '=0') + '.<br>' + U.work(U.roots([1, p, -(z.d + e)])) + '<br>' +
          'From ' + t('y=' + tx(o.Lp)) + ': ' + o.pts.map(function (q) { return t('x=' + q.xt) + ', ' + t('y=' + q.yt); }).join('; ') + '.<br>Solutions: ' + prPairs(o) + '.';
        var wr = U.signWrongs(CP, o);
        return U.pairs(CP, 'Solve by elimination: ' + eqs + '.', o.pts, { wrongs: wr }, sol, ['The ' + t('y') + '-terms are opposites: add the equations to eliminate ' + t('y') + '.', 'Solve the quadratic that is left, then find each ' + t('y') + ' from the linear equation.'], 'elimination: add');
      } }] },
    { num: '5', section: 'Graphing calculator and exact answers', shared: function (r) {
      var z = pickWhere(function () { return { h: r.int(-3, 3), n: r.pick([2, 3, 5, 6, 7, 8, 10, 11, 12, 13]), m: nz(r, 1, 3), k: r.int(-4, 4) }; }, function (z) {
        var b = z.m - 2 * z.h, c = z.k + z.h * z.h - z.n, xs = [z.h - Math.sqrt(z.n), z.h + Math.sqrt(z.n)];
        var safe = xs.every(function (x) { var y = z.m * x + z.k; return [x, y].every(function (v) { var f = Math.abs(v * 10) % 1; return Math.abs(f - 0.5) > 0.06; }); });
        return Math.abs(b) <= 8 && Math.abs(c) <= 15 && safe && !(z.h === -1 && z.n === 6 && z.m === -1) && !(z.h === 3 && z.n === 5);
      });
      z.o = U.lq([1, z.m - 2 * z.h, z.k + z.h * z.h - z.n], [z.m, z.k]); return z;
    }, stem: function (z) { return 'Consider the system ' + t('y=' + tx(z.o.Qp)) + ' and ' + t('y=' + tx(z.o.Lp)) + '.'; },
    parts: [
      { id: '5a', level: 'EMG', make: function (r, z) {
        var o = z.o, ys = o.pts.map(function (p) { return p.y; }).concat([z.k]);
        return U.pairsRounded(CP, 'Use a graphing calculator to solve the system, to the nearest tenth.', o.pts, 1, {},
          t('Y_1=' + tx(o.Qp).replace(/x/g, 'X')) + ', ' + t('Y_2=' + tx(o.Lp).replace(/x/g, 'X')) + '. A window such as ' + t('x') + ' from ' + t(Math.floor(o.pts[0].x) - 2) + ' to ' + t(Math.ceil(o.pts[1].x) + 2) + ', ' + t('y') + ' from ' + t(Math.floor(Math.min.apply(null, ys)) - 3) + ' to ' + t(Math.ceil(Math.max.apply(null, ys)) + 3) + ' shows both points.<br>2nd [CALC] 5:intersect near each point: ' +
          o.pts.map(function (p) { return t('(' + p.x.toFixed(3) + '\\dots,\\ ' + p.y.toFixed(3) + '\\dots)'); }).join(' and ') + '.<br>To the nearest tenth: ' + o.pts.map(function (p) { return t('(' + p.x.toFixed(1) + ',\\ ' + p.y.toFixed(1) + ')'); }).join(' and ') + '.',
          ['Enter the quadratic as ' + t('Y_1') + ' and the line as ' + t('Y_2') + '; adjust the window until both crossing points show.', '2nd [TRACE] (CALC), 5:intersect, once near each point. Round at the end.'], 'calculator: intersect');
      } },
      { id: '5b', level: 'PRG', make: function (r, z) {
        var o = z.o;
        return lqParts(CP, o, '', U.lqSol(o), null, 'exact solutions', 'Solve the system algebraically to get the exact solutions.');
      } }] },
    { num: '6', section: 'No solution', shared: function (r) {
      var z = pickWhere(function () { return { b: r.int(-6, 6), c: r.int(-3, 9), m: nz(r, 1, 4), k: r.int(-6, 6) }; }, function (z) { var B = z.b - z.m, C = z.c - z.k; return B * B - 4 * C < 0 && C <= 12 && !(z.b === 3 && z.c === 6 && z.m === 1 && z.k === 2); });
      z.o = U.lq([1, z.b, z.c], [z.m, z.k]); return z;
    }, stem: function (z) { return 'The system ' + t('y=' + tx(z.o.Qp)) + ' and ' + t('y=' + tx(z.o.Lp)) + ' has no solution.'; },
    parts: [
      { id: '6a', level: 'LIM', make: function (r) {
        return KP.mc(r, 'How does a graph show that a linear–quadratic system has no solution?', [
          { html: 'The line and the parabola never meet: there is no point of intersection.', right: true },
          { html: 'The line touches the parabola at exactly one point.', why: 'Touching at one point is one solution (a tangent).' },
          { html: 'The line passes through the vertex of the parabola.', why: 'A point the graphs share is a solution.' },
          { html: 'The parabola does not cross the ' + t('x') + '-axis.', why: 'The ' + t('x') + '-axis is not part of the system: look for where the <b>line</b> meets the parabola.' }],
          'The solutions are the points where the graphs meet. If the line misses the parabola, there are no points of intersection, so no solution.', ['What are the solutions of a system, on the graph?'], 'no solution: graph');
      } },
      { id: '6b', level: 'BEG', make: function (r) {
        return KP.mc(r, 'How does algebra show that a linear–quadratic system has no solution?', [
          { html: 'Substituting gives one quadratic equation with no real roots: its discriminant is negative.', right: true },
          { html: 'Substituting gives a quadratic equation whose discriminant is ' + t('0') + '.', why: 'A zero discriminant gives one root: one solution (a tangent).' },
          { html: 'Substituting gives a quadratic equation with a root of ' + t('x=0') + '.', why: t('x=0') + ' is a perfectly good root: it gives a point.' },
          { html: 'The quadratic equation does not factor.', why: 'An equation that doesn’t factor can still have real roots (use the quadratic formula).' }],
          'Substitute to get one quadratic equation. Each real root gives a point of intersection; a negative discriminant means no real roots, so no solution.', ['Each real root of the equation after substituting gives one point.'], 'no solution: algebra');
      } },
      { id: '6c', level: 'BEG', make: function (r, z) {
        var o = z.o, B = o.b, C = o.c, D = o.D;
        return KP.number('Show algebraically that this system has no solution: substitute, write the equation in the form ' + t('x^{2}+bx+c=0') + ', and give its discriminant.', D, function (v) {
          if (v === B * B + 4 * C) return { code: CP + 'disc', hint: t('b^{2}-4ac') + ': watch the sign of ' + t('c') + '.' };
          if (v === -B * B - 4 * C || v === B * B - C) return { code: CP + 'disc', hint: 'The discriminant is ' + t('b^{2}-4ac') + '.' };
          var Cw = z.c + z.k; if (v === B * B - 4 * Cw || v === (z.b + z.m) * (z.b + z.m) - 4 * C) return { code: CP + 'disc', hint: 'Move every term to one side carefully: ' + t(tx(o.Qp) + '-(' + tx(o.Lp) + ')=0') + '.' };
          return null;
        }, 'Substitute: ' + t(tx(o.Qp) + '=' + tx(o.Lp)) + ', so ' + t(tx(o.E) + '=0') + '.<br>' + U.work(o), ['Set the two expressions for ' + t('y') + ' equal and move every term to one side.', 'The discriminant is ' + t('b^{2}-4ac') + '.'], 'discriminant: no solution');
      } }] },
    { num: '7', section: 'The number of solutions', parts: [
      { id: '7a', level: 'BEG', make: function (r) {
        var z = pickWhere(function () { return { a: r.pick([2, 3, 4, -2, -3]), h: nz(r, 1, 3), m: nz(r, 1, 6), k: r.int(-5, 5) }; }, function (z) { var b = z.m - 2 * z.a * z.h, c = z.k + z.a * z.h * z.h; return Math.abs(b) <= 14 && Math.abs(c) <= 20 && !(z.a === 3 && z.h === 1 && z.m === 5 && z.k === -1); });
        var o = U.lq([z.a, z.m - 2 * z.a * z.h, z.k + z.a * z.h * z.h], [z.m, z.k]), A0 = qv(o.A), B0 = qv(o.B), C0 = qv(o.C);
        return U.countMC(r, 'Without solving, determine the number of solutions of ' + t('y=' + tx(o.Qp)) + ' and ' + t('y=' + tx(o.Lp)) + '.', 1, 'Substitute: ' + t(tx(o.E) + '=0') + '. Discriminant: ' + t(dtex(A0, B0, C0) + '=' + (B0 * B0 - 4 * A0 * C0)) + '.');
      } },
      { id: '7b', level: 'EMG', make: function (r) {
        var z = pickWhere(function () { return { a: r.pick([-2, -3, -1]), b: r.int(-4, 4), c: r.int(-4, 4), m: nz(r, 1, 3), k: r.int(-2, 8) }; }, function (z) { var B = z.b - z.m, C = z.c - z.k; return B * B - 4 * z.a * C < 0 && !(z.a === -2 && z.b === 1 && z.c === 1 && z.m === -1); });
        var o = U.lq([z.a, z.b, z.c], [z.m, z.k]), A0 = qv(o.A), B0 = qv(o.B), C0 = qv(o.C);
        return U.countMC(r, 'Without solving, determine the number of solutions of ' + t('y=' + tx(o.Qp)) + ' and ' + t('y=' + tx(o.Lp)) + '.', 0, 'Substitute: ' + t(tx(o.E) + '=0') + '. Discriminant: ' + t(dtex(A0, B0, C0) + '=' + (B0 * B0 - 4 * A0 * C0)) + '.');
      } },
      { id: '7c', level: 'EMG', make: function (r) {
        var z = pickWhere(function () { return { a: r.pick([0.5, -0.5, 1.5, 0.25]), b: r.int(-3, 3), c: r.int(-5, 5), m: nz(r, 1, 3), k: r.int(-4, 4) }; }, function (z) { var B = z.b - z.m, C = z.c - z.k, D = B * B - 4 * z.a * C; return D > 0 && Math.abs(Math.sqrt(D) % 1) > 1e-9 && !(z.a === 0.5 && z.b === 0 && z.c === -2 && z.m === 1); });
        var o = U.lq([z.a, z.b, z.c], [z.m, z.k]), A0 = qv(o.A), B0 = qv(o.B), C0 = qv(o.C);
        return U.countMC(r, 'Without solving, determine the number of solutions of ' + t('y=' + tx(o.Qp, true)) + ' and ' + t('y=' + tx(o.Lp)) + '.', 2, 'Substitute: ' + t(tx(o.E, true) + '=0') + '. Discriminant: ' + t(dtex(A0, B0, C0, true) + '=' + Math.round((B0 * B0 - 4 * A0 * C0) * 1000) / 1000) + '.');
      } }] },
    { num: '8', section: 'Tangents and unknown constants', shared: function (r) {
      var z = pickWhere(function () { return { m: nz(r, 1, 6), b: r.int(-6, 6), c: r.int(-5, 9) }; }, function (z) { var d = z.b - z.m; return d % 2 === 0 && d !== 0 && Math.abs(d) <= 10 && !(z.m === 4 && z.b === 2 && z.c === 5) && !(z.m === 2 && z.b === -4 && z.c === 3) && Math.abs(z.c - d * d / 4) <= 20; });
      var d = z.b - z.m; z.k0 = z.c - d * d / 4; z.xt = -d / 2; z.o = U.lq([1, z.b, z.c], [z.m, z.k0]); return z;
    }, stem: function (z) { return 'Consider the line ' + t('y=' + coefT(z.m) + 'x+k') + ' and the parabola ' + t('y=' + tx(quad([1, z.b, z.c]))) + '.'; },
    parts: [
      { id: '8a', level: 'PRG', make: function (r, z) {
        var d = z.b - z.m, cT = z.c ? '(' + z.c + '-k)' : '(-k)', p = z.o.pts[0];
        var sol = 'Substitute: ' + t(tx(quad([1, d, 0])) + '+' + cT + '=0') + '.<br>Tangent: discriminant ' + t('0') + ': ' + t(par(d) + '^{2}-4(1)' + cT + '=0') + ', so ' + t(kLin(4, d * d - 4 * z.c) + '=0') + ' and ' + t('k=' + z.k0) + '.<br>' + t(tx(z.o.E) + '=' + factorTex(z.o) + '=0') + ': ' + t('x=' + p.xt) + ', ' + t('y=' + sub(tx(z.o.Lp), p.xt) + '=' + p.yt) + '. Point ' + t(ptT(p)) + '.';
        return U.kPoint(CP, 'Determine the value of ' + t('k') + ' for which the line is tangent to the parabola, and the point of tangency.', 'k', z.k0, p, sol,
          ['Substitute the line into the parabola. A tangent gives one solution: the discriminant is ' + t('0') + '.', 'Solve for ' + t('k') + ', then solve the system with that ' + t('k') + ' to find the point.'], 'tangent: find k');
      } },
      { id: '8b', level: 'ADV', make: function (r, z) {
        var d = z.b - z.m, cT = z.c ? '(' + z.c + '-k)' : '(-k)', Dc = d * d - 4 * z.c;
        var sol = 'Discriminant: ' + t(par(d) + '^{2}-4(1)' + cT + '=' + kLin(4, Dc)) + '.<br>Two solutions: ' + t(kLin(4, Dc) + '>0') + ', so ' + t('k>' + z.k0) + '. No solution: ' + t(kLin(4, Dc) + '<0') + ', so ' + t('k<' + z.k0) + '.';
        return U.kRanges(CP, 'For which values of ' + t('k') + ' does the system have two solutions? no solution? Write an inequality for each.', 'k', z.k0, true, sol,
          ['Write the discriminant of the equation after substituting; it contains ' + t('k') + '.', 'Two solutions: discriminant ' + t('>0') + '. None: ' + t('<0') + '. Solve each for ' + t('k') + '.'], 'values of k: two / none');
      } }] },
    { num: '9', parts: [{ id: '9', level: 'MAS', make: function (r) {
      var z = pickWhere(function () { return { a: r.pick([1, 2, 3, 2]), u: r.int(1, 3), c: r.int(-4, 6) }; }, function (z) { var q = z.c - z.a * z.u * z.u; return Math.abs(q) <= 12 && q !== z.c && !(z.a === 2 && z.u === 1 && z.c === 5) && !(z.a === 1 && z.u === 2 && z.c === 3); });
      var q = z.c - z.a * z.u * z.u, m1 = 2 * z.a * z.u, y0 = z.a * z.u * z.u + z.c, pts = [U.pt(-z.u, y0), U.pt(z.u, y0)];
      var sol = 'Substitute: ' + t(tx(quad([z.a, 0, z.c])) + '=mx' + sg(q)) + ', so ' + t(tx(quad([z.a, 0, z.c - q])).replace(/(x\^\{2\})/, '$1-mx') + '=0') + '.<br>Tangent: discriminant ' + t('0') + ': ' + t('m^{2}-4(' + z.a + ')(' + (z.c - q) + ')=0') + ', so ' + t('m^{2}=' + m1 * m1) + ' and ' + t('m=\\pm ' + m1) + '.<br>' +
        t('m=' + m1) + ': ' + t(tx(quad([z.a, -m1, z.c - q])) + '=0') + ', ' + t('x=' + z.u) + ', ' + t('y=' + y0) + ': ' + t('(' + z.u + ',\\ ' + y0 + ')') + '. ' + t('m=' + -m1) + ': ' + t('x=' + -z.u) + ': ' + t('(' + -z.u + ',\\ ' + y0 + ')') + '.';
      return U.tanPart(CP, 'The line ' + t('y=mx' + (q ? sg(q) : '')) + ' is tangent to the parabola ' + t('y=' + tx(quad([z.a, 0, z.c]))) + '. Determine the possible values of ' + t('m') + ' and the point of tangency for each.', 'm', [-m1, m1], pts, [[z.u, -m1 * z.u + q], [-z.u, m1 * -z.u + q]], sol,
        ['Substitute: a tangent meets the parabola once, so the discriminant is ' + t('0') + '.', 'Solve for ' + t('m') + ' (two values), then put each back to find its point.'], 'tangent slopes');
    } }] },
    { num: '10', section: 'A line and a circle', parts: [
      { id: '10a', level: 'PRG', make: function (r) {
        var z = pickWhere(function () { return { m: r.pick([1, -1, 2, -2, 3, -3]), w: r.pick([1, 4, 9, 2, 3, 5, 8, 16]) }; }, function (z) { var r2 = (1 + z.m * z.m) * z.w; return r2 <= 100 && !(z.m === 1 && z.w === 25) && !(z.m === 2 && z.w === 4) && !(z.m === 3 && z.w === 4); });
        var r2 = (1 + z.m * z.m) * z.w, xs = U.roots([1, 0, -z.w]).xs, pts = xs.map(function (x) { return mkPt(x, slin(x, z.m, 0)); });
        var mT = coefT(z.m) + 'x', sol = 'Substitute ' + t('y=' + mT) + ': ' + t('x^{2}+(' + mT + ')^{2}=' + r2) + ', so ' + t((1 + z.m * z.m) + 'x^{2}=' + r2) + ' and ' + t('x^{2}=' + z.w) + '.<br>' + t('x=\\pm ' + stex(xs[1])) + '; ' + t('y=' + mT) + ' gives ' + pts.map(function (p) { return t(ptT(p)); }).join(' and ') + '.';
        return U.pairs(CP, 'Determine the exact points of intersection of the circle ' + t('x^{2}+y^{2}=' + r2) + ' and the line ' + t('y=' + mT) + '.', pts, { wrongs: [{ pts: pts.map(function (p) { return [p.x, -p.y]; }), code: CP + 'sys-y', hint: 'Find each ' + t('y') + ' from the <b>line</b>: ' + t('y=' + mT) + '.' }] }, sol,
          ['Substitute the line into the circle’s equation.', 'Solve for ' + t('x') + ' (two values), then use the line to find each ' + t('y') + '.'], 'circle and line through the origin');
      } },
      { id: '10b', level: 'ADV', make: function (r) {
        var cands = [];
        [5, 10, 13, 17, 20, 25, 26, 29, 34, 37, 40, 41, 45, 50, 52, 53, 58, 61, 65].forEach(function (r2) {
          var L = []; for (var x = -8; x <= 8; x++) for (var y = -8; y <= 8; y++) if (x * x + y * y === r2) L.push([x, y]);
          for (var i = 0; i < L.length; i++) for (var j = i + 1; j < L.length; j++) { var P1 = L[i], P2 = L[j]; if (P1[0] === P2[0]) continue; var m = (P2[1] - P1[1]) / (P2[0] - P1[0]), c = P1[1] - m * P1[0]; if ([1, -1, 2, -2].indexOf(m) >= 0 && c % 1 === 0 && c !== 0 && Math.abs(c) <= 9 && !(r2 === 17 && m === 1 && c === 3)) cands.push({ r2: r2, m: m, c: c, p: [P1, P2] }); }
        });
        var z = r.pick(cands), o = U.roots([1 + z.m * z.m, 2 * z.m * z.c, z.c * z.c - z.r2]), pts = o.xs.map(function (x) { return mkPt(x, slin(x, z.m, z.c)); });
        var lt = tx(lin([z.m, z.c])), sol = 'Substitute ' + t('y=' + lt) + ': ' + t('x^{2}+(' + lt + ')^{2}=' + z.r2) + ', so ' + t(tx(quad([1 + z.m * z.m, 2 * z.m * z.c, z.c * z.c - z.r2])) + '=0') + '.<br>' + U.work(o) + '<br>' + pts.map(function (p) { return t('x=' + p.xt) + ': ' + t('y=' + sub(lt, p.xt) + '=' + p.yt); }).join('; ') + '.<br>Points: ' + pts.map(function (p) { return t(ptT(p)); }).join(' and ') + '.';
        var wr = [{ pts: pts.map(function (p) { return [p.x, -p.y]; }), code: CP + 'sys-y', hint: 'Find each ' + t('y') + ' from the <b>line</b>, not the circle (the circle gives two ' + t('y') + '-values for each ' + t('x') + ').' }, { pts: pts.map(function (p) { return [-p.x, z.m * -p.x + z.c]; }), code: CP + 'root-sign', hint: 'Check the signs of your roots.' }];
        return U.pairs(CP, 'Determine the exact points of intersection of the circle ' + t('x^{2}+y^{2}=' + z.r2) + ' and the line ' + t('y=' + lt) + '.', pts, { wrongs: wr }, sol,
          ['Substitute the line into the circle, expand ' + t('(' + lt + ')^{2}') + ' and collect terms.', 'Solve the quadratic, then use the <b>line</b> to find each ' + t('y') + '.'], 'circle and line');
      } }] },
    { num: '11', parts: [{ id: '11', level: 'ADV', make: function (r) {
      var z = pickWhere(function () { var u = r.pick([1, 1, 2, 3]), v = r.pick([1, 2, 3, 4]); if (r.chance(0.5)) { var tt = u; u = v; v = tt; } return { u: u * (r.chance(0.5) ? 1 : -1), v: v * (r.chance(0.5) ? 1 : -1) }; }, function (z) { return (Math.abs(z.u) === 1 || Math.abs(z.v) === 1) && Math.abs(z.u) !== Math.abs(z.v) && !(z.u === 1 && z.v === 3) && !(z.u === 2 && z.v === 4) && !(z.u === 1 && z.v === 2); });
      var r2 = z.u * z.u + z.v * z.v, xOne = Math.abs(z.u) === 1, lineT, sol, eqT;
      // line u x + v y = r2
      lineT = tx(P.add(M(z.u, 1), P.mono(z.v, { y: 1 }))) + '=' + r2;
      if (xOne) {
        var xe = tx(P.add(P.num(r2 * z.u), P.mono(-z.v * z.u, { y: 1 }))); // x = u(r2 − v y) since u = ±1
        var Ey = P.sub(P.add(P.pow(P.add(P.num(r2 * z.u), P.mono(-z.v * z.u, { y: 1 })), 2), P.mono(1, { y: 2 })), P.num(r2));
        eqT = tx(Ey).replace(/\s/g, '');
        sol = t('x=' + xe) + '. Substitute: ' + t('(' + xe + ')^{2}+y^{2}=' + r2) + ', so ' + t(eqT + '=0') + ', which is ' + r2 + ' times ' + t('(y' + sg(-z.v) + ')^{2}=0') + '.<br>Discriminant ' + t('0') + ': one point, so the line is tangent. ' + t('y=' + z.v) + ', ' + t('x=' + z.u) + '. Point of contact ' + t('(' + z.u + ',\\ ' + z.v + ')') + '.';
      } else {
        var ye = tx(P.add(P.num(r2 * z.v), M(-z.u * z.v, 1)));
        var Ex = P.sub(P.add(P.pow(P.add(P.num(r2 * z.v), M(-z.u * z.v, 1)), 2), M(1, 2)), P.num(r2));
        sol = t('y=' + ye) + '. Substitute: ' + t('x^{2}+(' + ye + ')^{2}=' + r2) + ', so ' + t(tx(Ex) + '=0') + ', which is ' + r2 + ' times ' + t('(x' + sg(-z.u) + ')^{2}=0') + '.<br>Discriminant ' + t('0') + ': one point, so the line is tangent. ' + t('x=' + z.u) + ', ' + t('y=' + z.v) + '. Point of contact ' + t('(' + z.u + ',\\ ' + z.v + ')') + '.';
      }
      var pt = U.pt(z.u, z.v);
      return U.pairs(CP, 'Show algebraically that the line ' + t(lineT) + ' is tangent to the circle ' + t('x^{2}+y^{2}=' + r2) + ', and determine the point of contact.', [pt], { wrongs: [{ pts: [[z.u, z.v], [-z.u, -z.v]], code: CP + 'double-root', hint: 'The equation is a perfect square: one root, so one point of contact.' }, { pts: [[-z.u, -z.v]], code: CP + 'root-sign', hint: 'Check the sign of your root, and check the point in the line’s equation.' }] }, sol,
        ['Solve the line for the variable with coefficient ' + t('\\pm 1') + ' and substitute into the circle.', 'A tangent gives a perfect square (discriminant ' + t('0') + '): one point of contact.'], 'tangent to a circle');
    } }] },
    { num: '12', section: 'Contexts and choices', parts: [{ id: '12', level: 'PRG', make: function (r) {
      var z = pickWhere(function () { return { d: r.pick([2, 4, 4, 5]), r1: r.int(-6, -1), r2: r.int(1, 10), ctx: r.pick(['dish', 'arch', 'ramp']) }; }, function (z) {
        var m = (z.r1 + z.r2) / z.d, k = -z.r1 * z.r2 / z.d; return (m * 2) % 1 === 0 && (k * 2) % 1 === 0 && m !== 0 && k > 0 && Math.abs(m) <= 3 && k <= 12 && !(z.d === 4 && z.r1 === -2 && z.r2 === 6);
      });
      var a = [1, z.d], m = (z.r1 + z.r2) / z.d, k = -z.r1 * z.r2 / z.d, o = U.lq([a, 0, 0], [m, k]);
      var what = { dish: ['A cross-section of a satellite dish follows', 'a straight support rod follows', 'decimetres', 'rod meets the dish'], arch: ['A designer’s curved rail follows', 'a straight brace follows', 'metres', 'brace meets the rail'], ramp: ['The side view of a skateboard bowl follows', 'a straight railing follows', 'metres', 'railing meets the bowl'] }[z.ctx];
      o.pts = U.decPts(o.pts);
      var sol = t(tx(o.Qp, true) + '=' + tx(o.Lp, true)) + '. ' + U.work(o) + '<br>' + o.pts.map(function (p) { return t('x=' + p.xt) + ': ' + t('y=' + p.yt); }).join('; ') + '. The ' + what[3] + ' at ' + prPairs(o) + '.';
      return U.pairs(CP, what[0] + ' ' + t('y=' + tx(o.Qp, true)) + ' and ' + what[1] + ' ' + t('y=' + tx(o.Lp, true)) + ', both in ' + what[2] + '. Determine the points where the ' + what[3] + '.', o.pts, { wrongs: U.signWrongs(CP, o) }, sol,
        ['Set the two expressions for ' + t('y') + ' equal; multiply by ' + t(z.d) + ' to clear the decimal.', 'Factor, then find each ' + t('y') + '.'], 'context: two curves meet');
    } }] },
    { num: '13', parts: [{ id: '13', level: 'EMG', make: function (r) {
      var z = pickWhere(function () { return { h: r.int(2, 5) * (r.chance(0.7) ? 1 : -1), m: nz(r, 1, 4), k: r.int(-6, 6) }; }, function (z) { var b = z.m - 2 * z.h, c = z.k + z.h * z.h; return Math.abs(b) <= 12 && c <= 30 && !(z.h === 3 && z.m === 2 && z.k === -3); });
      var o = U.lq([1, z.m - 2 * z.h, z.k + z.h * z.h], [z.m, z.k]), p = o.pts[0], wy = o.yOf(-z.h);
      return KP.mc(r, 'The solution of the system ' + t('y=' + tx(o.Qp)) + ' and ' + t('y=' + tx(o.Lp)) + ' is', [
        { html: t(ptT(p)) + ' only', right: true }, { html: t('(' + -z.h + ',\\ ' + wy + ')') + ' only', why: 'Check the sign of the root: ' + t(factorTex(o) + '=0') + ' gives ' + t('x=' + z.h) + '.' },
        { html: t(ptT(p)) + ' and ' + t('(' + -z.h + ',\\ ' + wy + ')'), why: t(tx(o.E) + '=0') + ' is a perfect square, ' + t(factorTex(o)) + ', not ' + t('(x' + sg(-z.h) + ')(x' + sg(z.h) + ')') + '.' },
        { html: 'no solution', why: 'The discriminant of ' + t(tx(o.E) + '=0') + ' is ' + t('0') + ', not negative.' }],
        'Substitute: ' + t(tx(o.E) + '=0') + ', so ' + t(factorTex(o) + '=0') + ' and ' + t('x=' + z.h) + ' only; ' + t('y=' + p.yt) + '. The answer is ' + t(ptT(p)) + ' only (the line is tangent).', HS, 'MC: a tangent system');
    } }] },
    { num: '14', parts: [{ id: '14', level: 'ADV', make: function (r) {
      var z = pickWhere(function () { return { m: nz(r, 1, 3), b: r.int(-6, 6), want: r.pick(['none', 'none', 'two']) }; }, function (z) { var d = z.b - z.m; return d % 2 === 0 && d !== 0 && !(z.m === -1 && z.b === 3); });
      var d = z.b - z.m, k0 = -d * d / 4, Q = quad([1, z.b, 0]);
      var none = z.want === 'none', rightT = none ? 'k<' + k0 : 'k>' + k0;
      return KP.mc(r, 'The line ' + t('y=' + coefT(z.m) + 'x+k') + (none ? ' does <b>not</b> intersect' : ' intersects') + ' the parabola ' + t('y=' + tx(Q)) + (none ? '' : ' at <b>two</b> points') + ' when', [
        { html: t(rightT), right: true }, { html: t(none ? 'k>' + k0 : 'k<' + k0), why: 'That gives ' + (none ? 'two points' : 'no points') + '. Check the direction of the inequality.' },
        { html: t(none ? 'k<' + -k0 : 'k>' + -k0), why: 'Check the sign: solve the discriminant inequality for ' + t('k') + ' carefully.' }, { html: t('k=' + k0), why: 'At ' + t('k=' + k0) + ' the line is tangent (one point).' }],
        'Substitute: ' + t(tx(quad([1, d, 0])) + '-k=0') + '. Discriminant: ' + t(par(d) + '^{2}-4(1)(-k)=' + d * d + '+4k') + '. ' + (none ? 'No intersection: ' + t(d * d + '+4k<0') + ', so ' + t('k<' + k0) : 'Two points: ' + t(d * d + '+4k>0') + ', so ' + t('k>' + k0)) + '.',
        ['Substitute; the constant term contains ' + t('k') + '.', (none ? 'No intersection: discriminant ' + t('<0') : 'Two points: discriminant ' + t('>0')) + '. Solve for ' + t('k') + '.'], 'MC: values of k');
    } }] },
    { num: '15', parts: [{ id: '15', level: 'EMG', make: function (r) {
      var want = r.pick([1, 1, 2, 0]), z = pickWhere(function () { var m = r.pick([2, 3, -2, 4, -3]), k = nz(r, 1, 6), c = r.int(-6, 6), h = r.int(-3, 3); var b = want === 1 ? m - 2 * h : r.int(-3, 3), cc = want === 1 ? k + h * h : c; return { m: m, k: k, b: b, c: cc }; },
        function (z) { var B = z.b - z.m, C = z.c - z.k, D = B * B - 4 * C; return (want === 1 ? D === 0 : want === 2 ? D > 0 : D < 0) && Math.abs(z.b) <= 6 && Math.abs(z.c) <= 12 && !(z.m === 2 && z.k === -3 && z.b === 0 && z.c === -2); });
      var o = U.lq([1, z.b, z.c], [z.m, z.k]), ls = U.lineShow(r, z.m, z.k, true), A0 = 1, B0 = qv(o.B), C0 = qv(o.C);
      return U.countMC(r, 'How many solutions does the system ' + t(ls.tex) + ' and ' + t('y=' + tx(o.Qp)) + ' have?', want, t('y=' + tx(o.Lp)) + '. Substitute: ' + t(tx(o.E) + '=0') + '. Discriminant: ' + t(dtex(A0, B0, C0) + '=' + (B0 * B0 - 4 * C0)) + '.');
    } }] },
    { num: '16', parts: [{ id: '16', level: 'PRG', make: function (r) {
      var z = pickWhere(function () { return { m: nz(r, 1, 5), b: r.int(-5, 5), c: r.int(1, 12) }; }, function (z) { var d = z.b - z.m; var k = z.c - d * d / 4; return d % 2 === 0 && d !== 0 && k > 0 && k <= 99 && !(z.m === 3 && z.b === -1 && z.c === 7); });
      var d = z.b - z.m, k = z.c - d * d / 4, o = U.lq([1, z.b, z.c], [z.m, k]), p = o.pts[0];
      return KP.nr('The line ' + t('y=' + coefT(z.m) + 'x+k') + ' is tangent to the parabola ' + t('y=' + tx(quad([1, z.b, z.c]))) + '. The value of ' + t('k') + ' is ____.', k, function (v) { return v === -k ? { code: CP + 'k-sign', hint: 'Check the sign: ' + t(par(d) + '^{2}-4(1)(' + z.c + '-k)=0') + '.' } : v === z.c + d * d / 4 ? { code: CP + 'disc', hint: 'Check the constant term: it is ' + t(z.c + '-k') + '.' } : null; },
        'Substitute: ' + t(tx(quad([1, d, 0])) + '+(' + z.c + '-k)=0') + '. Tangent: ' + t(par(d) + '^{2}-4(' + z.c + '-k)=0') + ', so ' + t('k=' + k) + '. (Point of tangency ' + t(ptT(p)) + '.)', ['Substitute, then set the discriminant equal to ' + t('0') + '.'], 'NR: tangent k');
    } }] },
    { num: '17', parts: [{ id: '17', level: 'PRG', make: function (r) {
      var z = lqInt(r, 1, { ex: [{ b: 2, c: -1, m: 5, k: 3 }], test: function (z) { var s = z.r1 + z.r2 + z.m * (z.r1 + z.r2) + 2 * z.k; return s > 0 && s <= 999; } });
      var o = U.lq([1, z.b, z.c], [z.m, z.k]), sum = o.pts.reduce(function (acc, p) { return acc + p.x + p.y; }, 0);
      return KP.nr('The solutions of the system ' + t('y=' + tx(o.Qp)) + ' and ' + t('y=' + tx(o.Lp)) + ' are ' + t('(a,\\ b)') + ' and ' + t('(c,\\ d)') + '. The value of ' + t('a+b+c+d') + ' is ____.', sum, function (v) { return v === z.r1 + z.r2 ? { code: CP + 'sys-y', hint: 'Add the ' + t('y') + '-coordinates too.' } : null; },
        U.lqSol(o, { check: false }) + '<br>' + t(o.pts.map(function (p) { return par(p.x) + '+' + par(p.y); }).join('+') + '=' + sum), HS, 'NR: sum of coordinates');
    } }] }
  ];

  /* ---------------- Extra practice ---------------- */
  var EXTRA = [
    { num: 'A1', section: 'A. Skills', parts: [
      { id: 'eA1a', level: 'BEG', make: function (r) {
        var z = lqInt(r, 1, { ex: [{ b: 4, c: -1, m: 2, k: 7 }] }), o = U.lq([1, z.b, z.c], [z.m, z.k]);
        return lqParts(CP, o, t('y=' + tx(o.Qp)) + ', ' + t('y=' + tx(o.Lp)), U.lqSol(o), null, 'EP: solve');
      } },
      { id: 'eA1b', level: 'BEG', make: function (r) {
        var z = pickWhere(function () { var r1 = r.int(-5, 4), r2 = r.int(-4, 5); return { r1: r1, r2: r2, m: -(r1 + r2) }; }, function (z) { return z.r1 < z.r2 && z.m !== 0 && Math.abs(z.m) <= 3 && z.r1 * z.r2 < 0 && !(z.m === 1 && z.r1 === -3 && z.r2 === 2); });
        var c = -z.r1 * z.r2, o = U.lq([-1, 0, c], [z.m, 0]);
        return lqParts(CP, o, t('y=' + tx(o.Qp)) + ', ' + t('y=' + tx(o.Lp)), U.lqSol(o), null, 'EP: solve, line through the origin');
      } },
      { id: 'eA1c', level: 'EMG', make: function (r) {
        var z = pickWhere(function () { return { a: r.pick([2, 3]), h: nz(r, 1, 3), m: nz(r, 1, 8), k: r.int(-6, 6) }; }, function (z) { var b = z.m - 2 * z.a * z.h, c = z.k + z.a * z.h * z.h; return Math.abs(b) <= 12 && Math.abs(c) <= 20 && b !== 0 && !(z.a === 2 && z.h === 1 && z.m === 7); });
        var o = U.lq([z.a, z.m - 2 * z.a * z.h, z.k + z.a * z.h * z.h], [z.m, z.k]);
        return lqParts(CP, o, t('y=' + tx(o.Qp)) + ', ' + t('y=' + tx(o.Lp)), U.lqSol(o), null, 'EP: a tangent');
      } },
      { id: 'eA1d', level: 'EMG', make: function (r) {
        var z = lqInt(r, 1, { mMax: 3, ex: [{ b: -5, c: 6, m: 1, k: -2 }] }), o = U.lq([1, z.b, z.c], [z.m, z.k]), ls = U.lineShow(r, z.m, z.k, true);
        return lqParts(CP, o, t(ls.tex) + ', ' + t('y=' + tx(o.Qp)), U.lqSol(o, { pre: 'Write the line as ' + t('y=' + tx(o.Lp)) + '.<br>' }), null, 'EP: standard-form line');
      } }] },
    { num: 'A2', parts: [{ id: 'eA2', level: 'EMG', make: function (r) {
      var z = pickWhere(function () { var r1 = r.int(-6, 5), r2 = r.int(-5, 6); return { r1: r1, r2: r2, m: -(r1 + r2) }; }, function (z) { return z.r1 < z.r2 && z.m !== 0 && Math.abs(z.m) <= 4 && z.r1 * z.r2 !== 0 && !(z.m === 3 && z.r1 === -4); });
      var c = -z.r1 * z.r2, o = U.lq([-1, 0, c], [z.m, 0]);
      var sol = 'Subtract the second equation from the first: ' + t('x^{2}' + sg(z.m) + 'x=' + c).replace('+1x', '+x').replace('-1x', '-x') + ', so ' + t(tx(quad([1, z.m, -c])) + '=0') + '.<br>' + U.work(U.roots([1, z.m, -c])) + '<br>' + t('y=' + coefT(z.m) + 'x') + ': ' + prPairs(o) + '.';
      return U.pairs(CP, 'Solve by elimination: ' + t('y+x^{2}=' + c) + ' and ' + t('y' + (z.m > 0 ? '-' + coefT(z.m) : '+' + coefT(-z.m)) + 'x=0') + '.', o.pts, { wrongs: U.signWrongs(CP, o) }, sol,
        ['Both equations have ' + t('+y') + ': subtract them to eliminate ' + t('y') + '.', 'Solve the quadratic left, then find each ' + t('y') + '.'], 'EP: elimination');
    } }] },
    { num: 'A3', parts: [{ id: 'eA3', level: 'BEG', make: function (r) {
      var z = lqInt(r, 1, { lo: -4, hi: 4, ex: [{ b: -3, c: 0, m: -2, k: 2 }] }), o = U.lq([1, z.b, z.c], [z.m, z.k]), Qf = function (x) { return P.at(o.Qp, { x: x }); }, Lf = o.yOf;
      var xa = pickWhere(function () { return r.int(-3, 3); }, function (x) { return o.pts.every(function (p) { return p.x !== x; }) && Qf(x) !== Lf(x); });
      var rows = r.shuffle([{ pt: [o.pts[0].x, o.pts[0].y], on1: true, on2: true }, { pt: [o.pts[1].x, o.pts[1].y], on1: true, on2: true }, { pt: [xa, Qf(xa)], on1: true, on2: false }, { pt: [o.pts[0].y, o.pts[0].x], on1: false, on2: false }]);
      rows = rows.filter(function (rw, i, arr) { for (var j = 0; j < i; j++) if (arr[j].pt[0] === rw.pt[0] && arr[j].pt[1] === rw.pt[1]) return false; return true; });
      var QT = tx(o.Qp), LT = tx(o.Lp);
      var sol = rows.map(function (rw) { var x = rw.pt[0], on1 = Qf(x) === rw.pt[1], on2 = Lf(x) === rw.pt[1]; rw.on1 = on1; rw.on2 = on2; return t('(' + x + ',\\ ' + rw.pt[1] + ')') + ': ' + t(sub(QT, x) + '=' + Qf(x)) + (on1 ? ' ✓' : ' ✗') + ', ' + t(sub(LT, x) + '=' + Lf(x)) + (on2 ? ' ✓' : ' ✗'); }).join('<br>') + '<br>(' + t(tx(o.E) + '=0') + ' has only the roots ' + t(o.pts[0].xt) + ' and ' + t(o.pts[1].xt) + ', so there are no others.)';
      return U.verifyGrid(CP, 'Which of these points are solutions of the system ' + t('y=' + QT) + ' and ' + t('y=' + LT) + '?', rows, ['the parabola', 'the line'], sol, ['Substitute each point into <b>both</b> equations.'], 'EP: verify');
    } }] },
    { num: 'A4', parts: [
      { id: 'eA4a', level: 'BEG', make: function (r) {
        var z = pickWhere(function () { var h = nz(r, 1, 3); return { h: h, m: 2 * h, c: r.int(1, 8) }; }, function (z) { return !(z.h === 1 && z.c === 5); });
        var o = U.lq([1, 0, z.c], [z.m, z.c - z.h * z.h]);
        return U.countMC(r, 'Without solving, determine the number of solutions of ' + t('y=' + tx(o.Qp)) + ', ' + t('y=' + tx(o.Lp)) + '.', 1, 'Substitute: ' + t(tx(o.E) + '=0') + '. Discriminant: ' + t(dtex(1, o.b, o.c) + '=0') + '.');
      } },
      { id: 'eA4b', level: 'BEG', make: function (r) {
        var z = pickWhere(function () { return { b: nz(r, 1, 4) * 2, k: r.int(-2, 8), c: r.int(-3, 3) }; }, function (z) { var D = z.b * z.b + 4 * (z.c - z.k); return D < 0 && !(z.b === 2 && z.k === 3 && z.c === 0); });
        var o = U.lq([-1, z.b, z.c], [0, z.k]);
        return U.countMC(r, 'Without solving, determine the number of solutions of ' + t('y=' + tx(o.Qp)) + ', ' + t('y=' + z.k) + '.', 0, 'Substitute: ' + t(tx(o.E) + '=0') + '. Discriminant: ' + t(dtex(-1, qv(o.B), qv(o.C)) + '=' + (qv(o.B) * qv(o.B) + 4 * qv(o.C))) + '.');
      } },
      { id: 'eA4c', level: 'EMG', make: function (r) {
        var z = pickWhere(function () { return { a: r.pick([4, 3, 5]), b: r.int(-3, 3), m: nz(r, 1, 4), k: r.int(-3, 3) }; }, function (z) { var B = z.b - z.m, D = B * B + 4 * z.a * z.k; return D > 0 && !(z.a === 4 && z.b === -1 && z.m === 3); });
        var o = U.lq([z.a, z.b, 0], [z.m, z.k]), B0 = qv(o.B), C0 = qv(o.C);
        return U.countMC(r, 'Without solving, determine the number of solutions of ' + t('y=' + tx(o.Qp)) + ', ' + t('y=' + tx(o.Lp)) + '.', 2, 'Substitute: ' + t(tx(o.E) + '=0') + '. Discriminant: ' + t(dtex(z.a, B0, C0) + '=' + (B0 * B0 - 4 * z.a * C0)) + '.');
      } }] },
    { num: 'B1', section: 'B. Applying', shared: function (r) {
      var z = pickWhere(function () { return { B: nz(r, 1, 4) * 2 - (r.chance(0.5) ? 1 : -1), C: r.int(-6, 4), m: nz(r, 1, 3), k: r.int(-4, 4) }; }, function (z) {
        var D = z.B * z.B - 4 * z.C; if (D <= 0 || Math.abs(Math.sqrt(D) % 1) < 1e-9) return false;
        var xs = [(-z.B - Math.sqrt(D)) / 2, (-z.B + Math.sqrt(D)) / 2];
        return xs.every(function (x) { return [x, z.m * x + z.k].every(function (v) { var f = Math.abs(v * 100) % 1; return Math.abs(f - 0.5) > 0.05; }); }) && !(z.B === -3 && z.C === -3 && z.m === 1 && z.k === 2) && Math.abs(z.B + z.m) <= 7;
      });
      z.o = U.lq([1, z.B + z.m, z.C + z.k], [z.m, z.k]); return z;
    }, stem: function (z) { return 'Consider the system ' + t('y=' + tx(z.o.Qp)) + ' and ' + t('y=' + tx(z.o.Lp)) + '.'; },
    parts: [
      { id: 'eB1a', level: 'PRG', make: function (r, z) { return lqParts(CP, z.o, '', U.lqSol(z.o), null, 'EP: exact', 'Solve the system. Give exact answers.'); } },
      { id: 'eB1b', level: 'EMG', make: function (r, z) {
        return U.pairsRounded(CP, 'Now round each coordinate to the nearest hundredth.', z.o.pts, 2, {}, 'From the exact answers: ' + z.o.pts.map(function (p) { return t(ptT(p) + '\\approx(' + p.x.toFixed(2) + ',\\ ' + p.y.toFixed(2) + ')'); }).join(' and ') + '.', ['Evaluate each exact coordinate on the calculator; round only at the end.'], 'EP: rounded');
      } }] },
    { num: 'B2', parts: [{ id: 'eB2', level: 'PRG', make: function (r) {
      var z = pickWhere(function () { return { h: r.int(0, 4), n: r.pick([3, 5, 6, 7, 10, 11, 12, 14]), m: nz(r, 1, 2), k: r.int(-3, 3) }; }, function (z) {
        var xs = [z.h - Math.sqrt(z.n), z.h + Math.sqrt(z.n)];
        return (z.n - z.h * z.h) % 2 === 0 && xs.every(function (x) { return [x, z.m * x + z.k].every(function (v) { var f = Math.abs(v * 10) % 1; return Math.abs(f - 0.5) > 0.06; }); }) && !(z.h === 2 && z.n === 10 && z.m === 1 && z.k === -1);
      });
      // −0.5x² + bx + c = mx + k  <=>  x² − 2(b − m)x − 2(c − k) = 0, roots h ± √n: b − m = h, c − k = (n − h²)/2
      var cc = (z.n - z.h * z.h) / 2;
      var Q = [[-1, 2], z.h + z.m, qa(cc, z.k)], o = U.lq(Q, [z.m, z.k]);
      var ys = o.pts.map(function (p) { return p.y; });
      return U.pairsRounded(CP, 'Use a graphing calculator to solve ' + t('y=' + tx(o.Qp, true)) + ' and ' + t('y=' + tx(o.Lp)) + ', to the nearest tenth.', o.pts, 1, {},
        'Window: e.g. ' + t('x') + ' from ' + t(Math.floor(o.pts[0].x) - 2) + ' to ' + t(Math.ceil(o.pts[1].x) + 2) + ', ' + t('y') + ' from ' + t(Math.floor(Math.min.apply(null, ys)) - 3) + ' to ' + t(Math.ceil(Math.max.apply(null, ys)) + 4) + '.<br>Intersect: ' + o.pts.map(function (p) { return t('(' + p.x.toFixed(1) + ',\\ ' + p.y.toFixed(1) + ')'); }).join(' and ') + ' (exactly ' + t('x=' + stex(o.xs[1], true)) + ').',
        ['Enter both equations, find a window that shows both crossings, then 2nd [CALC] 5:intersect near each.'], 'EP: calculator');
    } }] },
    { num: 'B3', parts: [{ id: 'eB3', level: 'PRG', make: function (r) {
      var z = pickWhere(function () { return { m: nz(r, 1, 4), b: r.int(-6, 6) }; }, function (z) { var d = z.b - z.m; return d % 2 === 0 && d !== 0 && !(z.m === -2 && z.b === 4); });
      var d = z.b - z.m, k0 = d * d / 4, o = U.lq([-1, z.b, 0], [z.m, k0]), p = o.pts[0];
      var sol = 'Substitute: ' + t(tx(quad([-1, z.b, 0])) + '=' + coefT(z.m) + 'x+k') + ', so ' + t(tx(quad([1, -d, 0])) + '+k=0') + '.<br>Tangent: ' + t(par(-d) + '^{2}-4k=0') + ', so ' + t('k=' + k0) + '.<br>' + t(tx(quad([1, -d, k0])) + '=' + factorTex(U.roots([1, -d, k0])) + '=0') + ': ' + t('x=' + p.xt) + ', ' + t('y=' + p.yt) + '. Point ' + t(ptT(p)) + '.';
      return U.kPoint(CP, 'Determine ' + t('k') + ' so that the line ' + t('y=' + coefT(z.m) + 'x+k') + ' is tangent to the parabola ' + t('y=' + tx(quad([-1, z.b, 0]))) + ', and find the point of tangency.', 'k', k0, p, sol, ['Substitute and write the equation in standard form; set its discriminant to ' + t('0') + '.'], 'EP: tangent k');
    } }] },
    { num: 'B4', parts: [{ id: 'eB4', level: 'PRG', make: function (r) {
      var z = pickWhere(function () { return { m: r.pick([2, -2, 3, -3, 1, -1]), w: r.pick([1, 4, 9]) }; }, function (z) { return !(z.m === 3 && z.w === 4) && !(z.m === 2 && z.w === 4) && !(z.m === 1 && z.w === 25); });
      var r2 = (1 + z.m * z.m) * z.w, u = Math.sqrt(z.w), pts = [U.pt(-u, -z.m * u), U.pt(u, z.m * u)], mT = coefT(z.m) + 'x';
      return U.pairs(CP, 'Determine the exact points of intersection of the circle ' + t('x^{2}+y^{2}=' + r2) + ' and the line ' + t('y=' + mT) + '.', pts, { wrongs: [{ pts: [[u, -z.m * u], [-u, z.m * u]], code: CP + 'sys-y', hint: 'Use the line to find each ' + t('y') + '.' }] },
        t('x^{2}+' + (z.m * z.m === 1 ? '' : z.m * z.m) + 'x^{2}=' + r2) + ', so ' + t('x^{2}=' + z.w) + ' and ' + t('x=\\pm ' + u) + '. Points ' + pts.map(function (p) { return t(ptT(p)); }).join(' and ') + '.', ['Substitute the line into the circle.'], 'EP: circle and line');
    } }] },
    { num: 'B5', parts: [{ id: 'eB5', level: 'PRG', make: function (r) {
      var z = pickWhere(function () { return { p: nz(r, 1, 3), c: r.int(-3, 5), d: r.int(1, 3) }; }, function (z) { return !(z.p === 1 && z.c === 1); });
      var Q = quad([1, 0, z.c]), m = 2 * z.p, lt = function (mm, kk) { return t('y=' + tx(lin([mm, kk]))); };
      return KP.mc(r, 'Which line is tangent to the parabola ' + t('y=' + tx(Q)) + '?', [
        { html: lt(m, z.c - z.p * z.p), right: true },
        { html: lt(m, z.c), why: 'Substitute: ' + t('x^{2}' + sg(-m) + 'x=0') + ' has two roots (it meets twice).' },
        { html: lt(z.p, z.c - z.p * z.p), why: 'Substitute: ' + t(tx(quad([1, -z.p, z.p * z.p])) + '=0') + ' has a negative discriminant (no points).' },
        { html: lt(m, z.c - z.p * z.p - z.d), why: 'Substitute: the discriminant is negative (no points).' }],
        'A tangent gives a zero discriminant. ' + lt(m, z.c - z.p * z.p) + ': ' + t(tx(quad([1, -m, z.p * z.p])) + '=0') + ', discriminant ' + t(m * m + '-' + 4 * z.p * z.p + '=0') + ' ✓', ['Substitute each line; the tangent gives a discriminant of ' + t('0') + '.'], 'EP MC: which line is tangent');
    } }] },
    { num: 'B6', parts: [{ id: 'eB6', level: 'PRG', make: function (r) {
      var z = pickWhere(function () { return { b: r.int(-8, 4), c: r.int(1, 12), m: nz(r, 1, 4) }; }, function (z) { var d = z.b - z.m; if (d % 2) return false; var cc = d * d / 4 - z.c; return cc > 0 && cc <= 99 && !(z.b === -6 && z.c === 10 && z.m === 2); });
      var d = z.b - z.m, cc = d * d / 4 - z.c;
      return KP.nr('The system ' + t('y=' + tx(quad([1, z.b, z.c]))) + ' and ' + t('y=' + coefT(z.m) + 'x-c') + ' has exactly one solution. The value of ' + t('c') + ' is ____.', cc, function (v) { return v === -cc ? { code: CP + 'k-sign', hint: 'The constant term is ' + t(z.c + '+c') + '.' } : null; },
        'Substitute: ' + t(tx(quad([1, d, 0])) + '+(' + z.c + '+c)=0') + '. One solution: ' + t(par(d) + '^{2}-4(' + z.c + '+c)=0') + ', so ' + t(d * d + '=' + 4 * z.c + '+4c') + ' and ' + t('c=' + cc) + '.', ['Substitute; one solution means the discriminant is ' + t('0') + '.'], 'EP NR: one solution');
    } }] },
    { num: 'C1', section: 'C. Stretch', parts: [{ id: 'eC1', level: 'MAS', make: function (r) {
      var z = pickWhere(function () { return { m: nz(r, 1, 3), q: r.int(-3, 4), u: r.int(1, 3) }; }, function (z) { return z.q + z.u * z.u !== 0 && !(z.m === 1 && z.q === 2 && z.u === 1); });
      var c = z.q + z.u * z.u, b1 = z.m + 2 * z.u, b2 = z.m - 2 * z.u, p1 = U.pt(-z.u, -z.m * z.u + z.q), p2 = U.pt(z.u, z.m * z.u + z.q);
      // b1: x² + 2u x + u² -> x = −u ; b2: x = u
      var lt = tx(lin([z.m, z.q])), sol = 'Substitute: ' + t('x^{2}+bx+' + c + '=' + lt) + ', so ' + t('x^{2}+(b' + sg(-z.m) + ')x+' + (c - z.q) + '=0') + '.<br>Tangent: ' + t('(b' + sg(-z.m) + ')^{2}-4(' + (c - z.q) + ')=0') + ', so ' + t('b' + sg(-z.m) + '=\\pm ' + 2 * z.u) + ' and ' + t('b=' + b1) + ' or ' + t('b=' + b2) + '.<br>' +
        t('b=' + b1) + ': ' + t('(x+' + z.u + ')^{2}=0') + ', point ' + t(ptT(p1)) + '. ' + t('b=' + b2) + ': ' + t('(x-' + z.u + ')^{2}=0') + ', point ' + t(ptT(p2)) + '.';
      return U.tanPart(CP, 'Determine the values of ' + t('b') + ' for which the line ' + t('y=' + lt) + ' is tangent to the parabola ' + t('y=x^{2}+bx' + sg(c)) + '. Give the point of tangency for each.', 'b', [b2, b1], [p1, p2], [[z.u, -z.m * z.u + z.q], [-z.u, z.m * z.u + z.q]], sol,
        ['Substitute; the coefficient of ' + t('x') + ' contains ' + t('b') + '.', 'Set the discriminant to ' + t('0') + ': you get a square equal to a number, so two values of ' + t('b') + '.'], 'EP: tangent, unknown b');
    } }] },
    { num: 'C2', parts: [{ id: 'eC2', level: 'MAS', make: function (r) {
      var z = pickWhere(function () { return { b: r.int(-4, 4), c: r.int(-3, 3), u: r.int(1, 3) }; }, function (z) { var q = z.c - z.u * z.u; return q !== 0 && !(z.b === 2 && z.c === 0 && z.u === 2); });
      var q = z.c - z.u * z.u, m1 = z.b - 2 * z.u, m2 = z.b + 2 * z.u, Q = quad([1, z.b, z.c]);
      var p1 = U.pt(-z.u, m1 * -z.u + q), p2 = U.pt(z.u, m2 * z.u + q), lines = [[m1, q], [m2, q]];
      var sol = 'A line through ' + t('(0,\\ ' + q + ')') + ': ' + t('y=mx' + sg(q)) + '. Substitute: ' + t(tx(Q) + '=mx' + sg(q)) + ', so ' + t('x^{2}+(' + (z.b ? z.b + '-m' : '-m') + ')x+' + par(z.c - q) + '=0') + '.<br>Tangent: ' + t('(' + (z.b ? z.b + '-m' : '-m') + ')^{2}-4(' + (z.c - q) + ')=0') + ', so ' + t((z.b ? z.b + '-m' : '-m') + '=\\pm ' + 2 * z.u) + ': ' + t('m=' + m1) + ' or ' + t('m=' + m2) + '.<br>' +
        t('y=' + tx(lin(lines[1]))) + ' touches at ' + t(ptT(p2)) + '; ' + t('y=' + tx(lin(lines[0]))) + ' touches at ' + t(ptT(p1)) + '.';
      var eq = U.lineEqsPart(CP, '', lines, {}, '', [], '');
      var pChk = A().pairsPart(CP, '', [p1, p2].map(function (p) { return { x: p.x, y: p.y, xt: p.xt, yt: p.yt }; }), {}, '', [], '').check;
      var part = KP.fields('Two lines through the point ' + t('(0,\\ ' + q + ')') + ' are tangent to the parabola ' + t('y=' + tx(Q)) + '. Determine their equations and the points of tangency.',
        [{ label: 'Equations:', mode: 'math', keys: 'u8keq', name: 'Equations', placeholder: 'e.g. y = 6x - 4, y = -2x - 4' }, { label: 'Points:', mode: 'math', keys: 'u8pairs', name: 'Points', placeholder: 'e.g. (2, 8), (-2, 0)' }],
        [eq.check, pChk], [eq.key, ptT(p1) + ',\\ ' + ptT(p2)], t(eq.key) + '; points ' + t(ptT(p1)) + ' and ' + t(ptT(p2)), sol,
        ['Any line through ' + t('(0,\\ ' + q + ')') + ' is ' + t('y=mx' + sg(q)) + '. Substitute it into the parabola.', 'Tangent: set the discriminant to ' + t('0') + ' and solve for ' + t('m') + ' (two values).'], 'EP: tangents from a point');
      part.bad = [['y=' + tx(lin(lines[0])), ptT(p1) + ',\\ ' + ptT(p2)]];
      return part;
    } }] },
    { num: 'C3', parts: [{ id: 'eC3', level: 'MAS', make: function (r) {
      var z = pickWhere(function () { return { rr: nz(r, 1, 3), b: r.int(-4, 4), c: r.int(-5, 5) }; }, function (z) { var m = z.b + 3 * z.rr; return m !== 0 && Math.abs(m) <= 12 && !(z.rr === 2 && z.b === 2 && z.c === -1); });
      var m = z.b + 3 * z.rr, kk = z.c + 2 * z.rr * z.rr, o = U.lq([1, z.b, kk], [m, z.c]);
      var kc = z.c ? '(k' + sg(-z.c) + ')' : 'k', sol = 'Substitute: ' + t(tx(quad([1, z.b - m, 0])) + '+' + kc + '=0') + '. Let the roots be ' + t('r') + ' and ' + t('2r') + ': their sum is ' + t('3r=' + (m - z.b)) + ', so ' + t('r=' + z.rr) + ' (substituting both roots and subtracting gives the same).<br>Then ' + t('(' + z.rr + ')^{2}' + sg(z.b - m) + '(' + z.rr + ')+' + kc + '=0') + ', so ' + t('k=' + kk) + '.<br>' + t(tx(o.E) + '=0') + ': ' + t('x=' + o.pts[0].xt) + ' or ' + t('x=' + o.pts[1].xt) + '. Solutions ' + prPairs(o) + '.';
      var kChk = K.number(kk, null), pChk = A().pairsPart(CP, '', o.pts.map(function (p) { return { x: p.x, y: p.y, xt: p.xt, yt: p.yt }; }), {}, '', [], '').check;
      var part = KP.fields('The system ' + t('y=x^{2}' + (z.b ? sg(z.b) + 'x' : '') + '+k').replace('+1x', '+x').replace('-1x', '-x') + ' and ' + t('y=' + tx(lin([m, z.c]))) + ' has two solutions, and the ' + t('x') + '-coordinate of one is twice the ' + t('x') + '-coordinate of the other. Determine ' + t('k') + ' and solve the system.',
        [{ label: t('k='), name: 'k' }, { label: 'Solutions:', mode: 'math', keys: 'u8pairs', name: 'Solutions', placeholder: 'e.g. (2, 15), (4, 31)' }], [kChk, pChk], [String(kk), o.pts.map(ptT).join(',\\ ')], t('k=' + kk) + '; solutions ' + prPairs(o), sol,
        ['After substituting, the roots are ' + t('r') + ' and ' + t('2r') + '. Their sum is the negative of the ' + t('x') + '-coefficient.', 'Find ' + t('r') + ', then ' + t('k') + ' from either root, then solve.'], 'EP: roots in ratio 2');
      part.bad = [[String(kk + 1), o.pts.map(ptT).join(',\\ ')]];
      return part;
    } }] }
  ];

  HW.defineLesson({ id: LID, unit: 8, num: '1', title: 'Solving Linear–Quadratic Systems', outcome: OUT, calc: true, questions: QUESTIONS, extra: EXTRA });
})(window);
