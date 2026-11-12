/* Math 20-1 · Unit 8 Test (RF6, RF7, RF8) — Systems of Equations and Inequalities: linear–quadratic and
 * quadratic–quadratic systems (graphically, by substitution and elimination, exact roots, the number of solutions,
 * tangents and unknown constants), problems modelled by systems (numbers, two thrown balls, break-even, rectangles, a
 * parabola from two data points), linear and quadratic inequalities in two variables (test points, solid or dashed
 * boundaries, which side is shaded, writing the inequality from a graph, contexts with restrictions and corners), and
 * quadratic inequalities in one variable (from a graph, roots and test points, sign analysis, one or no roots, unknown
 * coefficients, heights, profits and areas). Written from Ryan's Unit 8 booklet (m201book/unit8: Lessons 1–8, their
 * assignments and extra practice; Lesson 8's assignment and EP08 are the practice tests that set the style and
 * difficulty). There is no older test for this course. One class (about 75 minutes by tests/short_report.js),
 * calculator allowed (answers stay exact unless a question asks to round); three outcomes, each with Beginning,
 * Progressing and Mastery boxes; 18 questions / 26 parts:
 *   RF6 (systems, L1–L3)                      Beginning 2 questions / 4 parts, Progressing 2 / 4, Mastery 2 / 2
 *   RF7 (inequalities in two variables, L4–L5) Beginning 2 / 3,                Progressing 2 / 3, Mastery 2 / 2
 *   RF8 (inequalities in one variable, L6–L7)  Beginning 2 / 3,                Progressing 2 / 3, Mastery 2 / 2
 *
 * How each box is pitched:
 *   Beginning  — each lesson's core skill as first taught: a linear–quadratic system by substitution with integer roots,
 *                and the number of solutions from the discriminant (L1 Ex 3, Ex 6, #3, #7); a quadratic–quadratic system
 *                by elimination, sometimes with the x²-terms cancelling, and the solutions read from a graph (L1 #1, L2
 *                Ex 1, Ex 3, Ex 5, #1, #3, #6); whether points are solutions of a linear inequality, and solid/dashed and
 *                above/below once y is alone (with the sign reversed when dividing by a negative) (L4 Ex 2, #2, #6,
 *                EP04 A3); which graph shows a quadratic inequality (L5 Ex 2–3, #3–4); a one-variable inequality from the
 *                graph of its parabola, by roots and test points, and a factored product by case analysis (L6 Ex 1–2,
 *                Ex 4, #1, #4, L7 Ex 1, #1).
 *   Progressing — the typical assignment question: a system with exact (irrational) solutions, the values of k for
 *                which a line meets a parabola at two / no points (or is tangent) (L1 Ex 3c, Ex 6a, #3d, #8, L3 #10); a
 *                quadratic–quadratic system with fractional coefficients, rearranged equations or a fractional root, and
 *                two balls thrown at the same moment (L2 Ex 7, #3c, #4, #9, L3 Ex 5, #8, L8 #6); the inequality whose
 *                region is shown (a line through two given points), a ticket / budget context with whole numbers, and
 *                the quadratic inequality from a vertex and a point or from its intercepts (L4 Ex 6, Ex 7, #7, #10, L5
 *                Ex 6, #7, L8 #8, #10); one-variable inequalities that need decomposition, rearranging or a negative
 *                leading coefficient, and the one-root / no-root cases (L6 Ex 5–7, #5, #7, L7 #3–5, L8 #12).
 *   Mastery    — the hardest assignment / extra-practice items: a problem modelled by a system (a rectangle from its
 *                perimeter and diagonal, break-even and the maximum profit, h = −5(t − p)² + q from two data points)
 *                (L3 #3, #7, #12, EP03 B3–B4); every slope of a tangent from a given point with its point of tangency, or
 *                the k that makes a quadratic–quadratic system have one solution with that solution (L1 #9, L2 #8, L8 #4,
 *                EP01 C2, EP02 B4); a tunnel arch from its width and height and the tallest centred load (L5 #10, EP05
 *                B4); a system of two linear inequalities in context and its corner (L4 Ex 8, #11, EP04 C2); how long a
 *                ball is above a height, widths of a rectangle with its restriction, or prices that give a profit (L6
 *                Ex 8b, L7 #8–10, L7 nr, EP07 B2–B3, EP08 C4); the values of k for which an equation with k in more than
 *                one coefficient has two / no real roots (L6 #10, L7 #11, EP07 B4).
 * Coverage: L1 Q1, Q7, Q14 · L2 Q2, Q8a, Q14 · L3 Q8b, Q13 · L4 Q3, Q9, Q16 · L5 Q4, Q10, Q15 · L6 Q5, Q11a, Q12, Q18 ·
 *           L7 Q6, Q11b, Q17 · L8 (review) numbers and styles throughout (Q1, Q7, Q9a, Q10, Q11, Q14, Q17).
 * Short version (def.short): Q1a, Q2a, Q3, Q5 (Beginning: RF6 2, RF7 2, RF8 2 parts), Q7a, Q8b, Q9a, Q10, Q11
 * (Progressing: 2 each), Q13, Q15, Q17 (Mastery: 1 each) — 12 questions / 15 parts, a little over half the working time
 * (~42 of ~75 min by tests/short_report.js); every outcome keeps all three boxes.
 * Not used: numerical-response boxes ("a + b + c + d") — the online version asks for the solutions themselves;
 * graphing-calculator intersect / zero items and "describe" or "explain the error" items — their checkable step is asked
 * instead (exact solutions, the corrected solution set); drawing a region (the online version asks which graph, which
 * side or the inequality of a drawn region); circles (L1 Section 6) and cubic sign charts (the L7 extension).
 *
 * Answer formats (all typed, with the u8 keypads below; a few multiple choice where recognition is the skill):
 *   systems — ordered pairs "(3, 10), (-2, -5)" in any order (fractions and exact radicals allowed; decimals that are
 *     close get a "give exact values" nudge), or "no solution" / "infinitely many";
 *   one-variable inequalities — set notation {x | x < −2 or x > 3, x ∈ ℝ}, a plain inequality "x < -2 or x > 3", or
 *     intervals (−∞, −2) ∪ (3, ∞), all parsed by HW.sets (js/relfn.js); "x ≠ 4", "x = 4", "all real numbers" ({x | x ∈ ℝ})
 *     and "no solution" too. Diagnoses: roots included/excluded, between instead of outside (or a sign not reversed),
 *     roots with the wrong signs, "and" instead of "or", a restriction ignored;
 *   inequalities in two variables — any equivalent inequality ("y > 2/3x - 1" = "2x - 3y < 3"): the student's L − R must
 *     be a non-zero multiple of the target's, with the sign reversed for a negative multiple. Diagnoses: the right
 *     boundary with the wrong direction (wrong side) or strictness (solid vs dashed), a wrong boundary;
 *   points in a region — a yes/no grid; boundary type and side — multiple choice; the number of solutions — multiple
 *     choice; contexts — numbers.
 * Every part has `bad` answers with u8t- codes; partial credit (one recognized mistake keeps 2/3 or 1/3) is decided below.
 *
 * The question builders are the Unit 8 assessment kit HW.u8assess (below); js/exits/u8.js uses them with u8x- codes, so
 * this file loads first. Nothing here depends on the practice files (js/lessons/u8l*.js). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, KP = K.P, P = HW.poly, ex = HW.ex, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
  if (!P || !K.valueSet || !HW.sets || !HW.graph) throw new Error('js/lessons/u8test.js needs js/poly.js and js/relfn.js');
  var INF = Infinity;

  /* ======================================================================================================
   * Codes: one list, registered for both the test (u8t-) and the exit slips (u8x-), with partial-credit decisions
   * (s = small: keeps 2/3, b = big: keeps 1/3, n = none). Format nudges (v: 'form') only need labels.
   * ====================================================================================================== */
  var BASE = {
    'nosol-claim': ['Said “no solution” when the graphs meet', 'n'], 'none-missed': ['Gave solutions for a system with none', 'n'],
    'inf-claim': ['Said “infinitely many” for different graphs', 'n'], 'inf-missed': ['Missed that the equations are the same graph (infinitely many)', 'n'],
    'root-sign': ['Roots with the wrong signs (factoring sign slip)', 'b'], 'sys-y': ['Right x-values, wrong y-values', 's'],
    'sys-missing': ['Missed a solution of the system', 'b'], 'sys-extra': ['An extra pair that is not a solution', 'b'], 'pair-flip': ['Ordered pairs written (y, x)', 's'],
    'double-root': ['Treated a double root as two roots', 'b'], 'k-dir': ['Values of the constant: inequality the wrong way', 'b'],
    'k-incl': ['Values of the constant: included the tangent value', 's'], 'k-tangent': ['Gave only the tangent value of the constant', 'b'],
    'tan-one': ['Only one of the tangent slopes', 'b'], 'tan-pts': ['Tangent slopes right, points of tangency wrong', 's'],
    'qq-k': ['One solution: right k, wrong solution', 's'], 'balls-h': ['Same height: right time, wrong height', 's'], 'balls-t': ['Same height: wrong time', 'n'],
    'pq-q': ['Model from data: right p, wrong q', 's'], 'be-profit': ['Break-even right, maximum profit wrong', 's'],
    'pt-row': ['Misjudged whether a point is a solution', 'b'], 'pt-boundary': ['A point on the boundary: included/excluded wrong', 's'],
    'reg-side': ['Inequality the wrong way (wrong side shaded)', 'b'], 'reg-strict': ['Solid/dashed boundary wrong (≤ vs <)', 's'],
    'reg-rev': ['Did not reverse the sign when dividing by a negative', 'b'], 'reg-bound': ['Wrong boundary', 'n'], 'reg-slope': ['Boundary line: slope as run over rise', 'n'],
    'reg-a': ['Boundary parabola: did not solve for a', 'b'], 'ctx-round': ['Whole numbers: rounded the wrong way', 's'], 'ctx-corner': ['Gave the other coordinate of the corner', 's'],
    'arch-half': ['Arch: used the whole width instead of half', 'b'],
    'ineq-incl': ['Roots included/excluded wrong', 's'], 'ineq-side': ['Between the roots instead of outside (or the reverse)', 'b'], 'ineq-rev': ['Multiplied by a negative without reversing the sign', 'b'],
    'ineq-roots': ['Roots with the wrong signs', 'b'], 'ineq-case': ['Case analysis: only the case with both factors positive', 'b'], 'ineq-and': ['Joined the two pieces with “and”', 'b'],
    'ineq-none': ['Said “no solution” when there are solutions', 'n'], 'ineq-claim': ['Gave solutions when there are none', 'n'], 'ineq-all': ['Said all real numbers', 'n'],
    'ineq-sq': ['A perfect square: confused x ≠ h, x = h, all real numbers and no solution', 'b'], 'ineq-restr': ['Ignored the restriction of the context', 's'], 'ineq-sqrt': ['Took the square root and lost the negative side', 'b'],
    'ineq-time': ['Gave the times instead of how long', 'b'], 'count-ends': ['Counted the integers with the endpoints wrong', 's'],
    'sign-row': ['Sign chart: product row wrong', 'n'],
    'exact': ['Decimals instead of exact values (format)', ''], 'xs-only': ['Gave x-values instead of ordered pairs (format)', ''], 'gen-form': ['Inequality not in general form (format)', ''],
    'pos-lead': ['Leading coefficient not positive (format)', ''], 'int-coef': ['Coefficients not integers (format)', ''], 'round': ['Not rounded as asked (format)', '']
  };
  (function () {
    var codes = {}, part = {};
    Object.keys(BASE).forEach(function (k) { ['u8t-', 'u8x-'].forEach(function (cp) { codes[cp + k] = BASE[k][0]; if (BASE[k][1]) part[cp + k] = BASE[k][1]; }); });
    HW.addCodes(codes); HW.addPartial(part);
  })();

  /* ======================================================================================================
   * Keypads: ordered pairs (with "no solution" / "infinitely many"), solution sets (with "or", ≠ and "no solution"),
   * inequalities in two variables (x, y, x², < ≤ > ≥)
   * ====================================================================================================== */
  var W = HW.widgets;
  if (W && W.KEYSETS) {
    var d = function (n) { return { label: String(n), tex: String(n), plain: String(n) }; };
    var KY = {
      del: { label: '⌫', fn: 'del', title: 'Delete' }, clear: { label: 'clear', fn: 'clear' }, left: { label: '◀', fn: 'left', title: 'Move left' },
      right: { label: '▶', fn: 'right', title: 'Move right (out of a box)' }, enter: { label: 'Check ↵', fn: 'enter', wide: true },
      minus: { label: '−', tex: '-', plain: '-' }, plus: { label: '+', tex: '+', plain: '+' }, dot: { label: '.', tex: '.', plain: '.' }, comma: { label: ',', tex: ',', plain: ', ' },
      frac: { label: '<sup>a</sup>⁄<sub>b</sub>', tex: '\\frac{#@}{#?}', plain: '/', title: 'Fraction' }, sqrt: { label: '√', tex: '\\sqrt{#0}', plain: 'sqrt(' },
      par: { label: '( )', tex: '\\left(#0\\right)', plain: '(', title: 'Brackets' }, sq: { label: '□²', tex: '^{2}', plain: '^2', title: 'Squared' },
      le: { label: '≤', tex: '\\le ', plain: ' <= ' }, lt: { label: '<', tex: '<', plain: ' < ' }, ge: { label: '≥', tex: '\\ge ', plain: ' >= ' }, gt: { label: '>', tex: '>', plain: ' > ' },
      ne: { label: '≠', tex: '\\ne ', plain: ' != ' }, eq: { label: '=', tex: '=', plain: ' = ' }, or: { label: 'or', tex: '\\text{ or }', plain: ' or ', title: 'or' },
      braces: { label: '{ }', tex: '\\left\\lbrace #0\\right\\rbrace', plain: '{', title: 'Braces' }, mid: { label: '|', tex: '\\mid ', plain: ' | ', title: 'such that' },
      inn: { label: '∈', tex: '\\in ', plain: ' in ', title: 'is an element of' }, R: { label: 'ℝ', tex: '\\mathbb{R}', plain: 'R', title: 'the real numbers' },
      none: { label: 'no solution', tex: '\\text{no solution}', plain: 'no solution', title: 'No solution' },
      inf: { label: 'infinitely many', tex: '\\text{infinitely many}', plain: 'infinitely many', title: 'The same graph: infinitely many solutions' }
    };
    W.KEYSETS.u8pairs = function () {
      return [[d(7), d(8), d(9), KY.par, KY.del], [d(4), d(5), d(6), KY.frac, KY.clear], [d(1), d(2), d(3), KY.minus, KY.left, KY.right], [d(0), KY.dot, KY.comma, KY.sqrt, KY.plus, KY.enter], [KY.none, KY.inf]];
    };
    W.KEYSETS.u8tan = function () {
      return [[d(7), d(8), d(9), KY.par, KY.del], [d(4), d(5), d(6), KY.frac, KY.clear], [d(1), d(2), d(3), KY.minus, KY.left, KY.right], [d(0), KY.dot, KY.comma, { label: '<i>m</i> =', tex: 'm=', plain: 'm = ' }, { label: '±', tex: '\\pm ', plain: '±' }, KY.enter]];
    };
    W.KEYSETS.u8set = function (opt) {
      var vs = (opt && opt.vars && opt.vars.length ? opt.vars : ['x']).slice(0, 2).map(function (v) { return { label: '<i>' + v + '</i>', tex: v, plain: v }; });
      return [[d(7), d(8), d(9), KY.lt, KY.le, KY.del], [d(4), d(5), d(6), KY.gt, KY.ge, KY.clear], [d(1), d(2), d(3), KY.minus, KY.left, KY.right],
        [d(0), KY.dot, KY.frac, KY.or, KY.ne, KY.eq], vs.concat([KY.braces, KY.mid, KY.comma, KY.inn, KY.R, KY.enter]), [KY.none]];
    };
    W.KEYSETS.u8ineq = function (opt) {
      var vs = (opt && opt.vars && opt.vars.length ? opt.vars : ['x', 'y']).slice(0, 3).map(function (v) { return { label: '<i>' + v + '</i>', tex: v, plain: v }; });
      return [[d(7), d(8), d(9), KY.lt, KY.le, KY.del], [d(4), d(5), d(6), KY.gt, KY.ge, KY.clear], [d(1), d(2), d(3), KY.plus, KY.minus, KY.frac],
        [d(0), KY.dot].concat(vs, [KY.sq, KY.par]), [KY.left, KY.right, KY.enter]];
    };
    if (W.KEYHELP) {
      W.KEYHELP.u8pairs = ['Press <b>( )</b> for each ordered pair, type ' + HW.k('x') + ' <b>,</b> ' + HW.k('y') + ' inside, press <b>▶</b> to step out, then a comma before the next pair. Use <b>no solution</b> or <b>infinitely many</b> when the graphs don’t meet in points.', 'Type e.g. <code>(3, 10), (-2, -5)</code>, <code>no solution</code> or <code>infinitely many</code>.'];
      W.KEYHELP.u8tan = ['Slopes: e.g. ' + HW.k('m=4,\\ m=-4') + '. Points: press <b>( )</b> for each ordered pair, type ' + HW.k('x') + ' <b>,</b> ' + HW.k('y') + ' inside and press <b>▶</b> to step out.', 'Type e.g. <code>m = 4, m = -4</code> and <code>(2, 7), (-2, 7)</code>.'];
      W.KEYHELP.u8set = ['Type the solution, e.g. ' + HW.k('\\{x\\mid x<-2\\text{ or }x>3,\\ x\\in\\mathbb{R}\\}') + ' or just ' + HW.k('x<-2\\text{ or }x>3') + '. Use <b>or</b> between two pieces, <b>≠</b> for “every number but one”, ' + HW.k('\\{x\\mid x\\in\\mathbb{R}\\}') + ' for all real numbers, or <b>no solution</b>.', 'Type e.g. <code>{x | x &lt; -2 or x &gt; 3, x in R}</code>, <code>-2 &lt;= x &lt;= 5</code>, <code>x != 4</code> or <code>no solution</code>.'];
      W.KEYHELP.u8ineq = ['Type the whole inequality, e.g. ' + HW.k('y>\\frac{2}{3}x-1') + ' or ' + HW.k('y\\le x^{2}-4x+1') + '. Use <b><sup>a</sup>⁄<sub>b</sub></b> for a fraction and <b>□²</b> for a square.', 'Type e.g. <code>y &gt; 2/3x - 1</code> or <code>y &lt;= x^2 - 4x + 1</code>.'];
    }
  }

  /* ======================================================================================================
   * Small tools
   * ====================================================================================================== */
  function pickWhere(gen, test) { for (var i = 0; i < 8000; i++) { var o = gen(); if (o && test(o)) return o; } throw new Error('u8 assessments: no instance found'); }
  function nz(r, lo, hi) { return (r.chance(0.5) ? -1 : 1) * r.int(lo, hi); }
  function R(x) { return Array.isArray(x) ? ex.norm(x[0], x[1]) : [x, 1]; }
  function rv(x) { x = R(x); return x[0] / x[1]; }
  function fr(p, q) { return ex.texRat(ex.norm(p, q == null ? 1 : q)); }
  function toFr(x) { for (var q = 1; q <= 64; q++) { var p = Math.round(x * q); if (Math.abs(p / q - x) < 1e-9) return [p, q]; } return null; }
  function vt(x) { var f = toFr(x); return f ? fr(f[0], f[1]) : String(Math.round(x * 1000) / 1000); }
  function dt(x) { return String(Math.round(x * 1e6) / 1e6); }
  function M(c, v, e) { if (!e) return P.num(c); var o = {}; o[v] = e; return P.mono(c, o); }
  function quad(a, b, c, v) { return P.add(M(a, v || 'x', 2), M(b, v || 'x', 1), P.num(c)); }
  function lin(m, k, v) { return P.add(M(m, v || 'x', 1), P.num(k)); }
  function Y() { return M(1, 'y', 1); }
  function tx(p) { var s = P.tex(p); return s === '' ? '0' : s; }
  function br(p) { return '(' + tx(p) + ')'; }
  function par(n) { return n < 0 ? '(' + vt(n) + ')' : vt(n); }
  function at(p, x) { return P.at(p, { x: x }); }
  function subX(tex, x) { return tex.replace(/x/g, '(' + vt(x) + ')'); }
  function coefT(c) { return c === 1 ? '' : c === -1 ? '-' : vt(c); }
  function near(a, b, tol) { return a === b || Math.abs(a - b) < (tol || 1e-9); }
  function ptT(x, y) { return '(' + vt(x) + ',\\ ' + vt(y) + ')'; }
  function ptsT(list) { return list.map(function (p) { return ptT(p[0], p[1]); }).join(' and '); }
  /* a·(x − r1)(x − r2) with integer brackets (r1, r2 rationals); a double root gives (…)² */
  function facT(A, r1, r2, v) {
    v = v || 'x'; r1 = R(r1); r2 = R(r2);
    var c0 = ex.norm(R(A)[0], R(A)[1] * r1[1] * r2[1]), cT = c0[1] === 1 && Math.abs(c0[0]) === 1 ? (c0[0] < 0 ? '-' : '') : fr(c0[0], c0[1]);
    var f1 = br(lin(r1[1], -r1[0], v)), f2 = br(lin(r2[1], -r2[0], v));
    if (r1[0] === 0) f1 = v; if (r2[0] === 0 && r1[0] !== 0) f2 = v;
    if (r1[0] * r2[1] === r2[0] * r1[1]) return cT + f1 + '^{2}';
    return r2[0] === 0 && r1[0] !== 0 ? cT + f2 + f1 : cT + f1 + f2;
  }
  /* a + b√n */
  function surdT(a, b, n, pm) {
    var s = (a ? vt(a) : ''), bb = Math.abs(b), rad = (bb === 1 ? '' : vt(bb)) + '\\sqrt{' + n + '}';
    if (pm) return s + (b < 0 ? '\\mp ' : '\\pm ') + rad;
    return s + (b < 0 ? '-' : a ? '+' : '') + rad;
  }
  var OPS = { lt: '<', le: '\\le ', gt: '>', ge: '\\ge ' }, FLIP = { lt: 'gt', le: 'ge', gt: 'lt', ge: 'le' };
  function strictOp(o) { return o === 'lt' || o === 'gt'; }
  function upOp(o) { return o === 'gt' || o === 'ge'; }
  function holds(v, op) { return op === 'lt' ? v < -1e-12 : op === 'le' ? v <= 1e-12 : op === 'gt' ? v > 1e-12 : v >= -1e-12; }
  function words(op) { return { lt: 'less than', le: 'at most', gt: 'more than', ge: 'at least' }[op]; }

  /* ---------------- region graphs: HW.graph plus a shaded side of one boundary ---------------- */
  function regionSvg(g) {
    var spec = { x: g.x || [-6, 6], y: g.y || [-6, 6], grid: 1, labels: g.labels || 2, max: g.max || 260, unit: g.unit, aria: g.aria || 'graph',
      fns: (g.curves || []).map(function (c) { return { f: c.f, dash: c.dash, color: c.color }; }), points: g.points || [] };
    var svg = HW.graph(spec), L = HW.graph.last;
    if (g.shade) {
      var xr = L.xr, yr = L.yr, n = 120, pts = [], up = g.shade.side === 'above';
      for (var i = 0; i <= n; i++) { var x = xr[0] + (xr[1] - xr[0]) * i / n, y = g.shade.f(x); y = Math.max(yr[0], Math.min(yr[1], y)); pts.push(L.X(x).toFixed(1) + ',' + L.Y(y).toFixed(1)); }
      var edge = up ? yr[1] : yr[0];
      pts.push(L.X(xr[1]).toFixed(1) + ',' + L.Y(edge).toFixed(1), L.X(xr[0]).toFixed(1) + ',' + L.Y(edge).toFixed(1));
      svg = svg.replace('fill="#fff"/>', 'fill="#fff"/><polygon points="' + pts.join(' ') + '" fill="#2b55a0" fill-opacity="0.17" stroke="none"/>');
    }
    return svg;
  }
  function fig(svg) { return '<div class="fig">' + svg + '</div>'; }

  /* ======================================================================================================
   * Checkers
   * ====================================================================================================== */
  function plain(resp) { return String(resp == null ? '' : resp).replace(/\\(text|mathrm|textrm|operatorname)\{([^{}]*)\}/g, ' $2 ').replace(/\\left|\\right/g, '').replace(/\\[,;: !]|~/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase(); }
  function isNone(resp) { var s = plain(resp); return /no\s*(real\s*)?(solutions?|answer|points?)\b|^none$|^\\emptyset$|^\\varnothing$|^∅$|^\{\s*\}$|^\\\{\s*\\\}$|^\\lbrace\s*\\rbrace$/.test(s); }
  function isInf(resp) { return /infinit/.test(plain(resp)); }

  /* ---------------- ordered pairs ---------------- */
  function pairList(resp) {
    var s = String(resp == null ? '' : resp).replace(/\\(left|right)/g, '').replace(/\\(text|mathrm|operatorname)\{\s*(and|or)\s*\}/gi, ',').replace(/\b(and|or)\b/gi, ',')
      .replace(/\\\{|\\\}|\\lbrace|\\rbrace/g, ' ').replace(/\\[,;: !]|~/g, ' ').trim();
    if (s.charAt(0) === '{' && s.charAt(s.length - 1) === '}') s = s.slice(1, -1);
    if (!s.trim()) return { empty: true };
    var re = /\(([^()]*)\)/g, m, out = [];
    while ((m = re.exec(s))) {
      var xy = m[1].split(','); if (xy.length !== 2) return { bad: true };
      var a = ex.parse(xy[0].trim()), b = ex.parse(xy[1].trim()); if (!a.ok || !b.ok) return { bad: true };
      var va = ex.value(a.ast), vb = ex.value(b.ast); if (!isFinite(va) || !isFinite(vb)) return { bad: true };
      out.push([va, vb]);
    }
    if (!out.length) return { noParen: true };
    if (s.replace(re, '').replace(/[,\s]/g, '').length) return { bad: true };
    return { pairs: out };
  }
  function samePts(A, B, tol) {
    if (A.length !== B.length) return false;
    var has = function (L, p) { return L.some(function (q) { return near(p[0], q[0], tol) && near(p[1], q[1], tol); }); };
    return A.every(function (p) { return has(B, p); }) && B.every(function (q) { return has(A, q); });
  }
  /* pts: [[x, y], …] (numbers); o: { inf, wrongs: [{ pts, code, hint }], dp (rounded answers), noneHint } */
  function pairsCheck(cp, pts, o) {
    o = o || {};
    var T = pts, tol = o.dp != null ? 0.5 * Math.pow(10, -o.dp) + 1e-9 : 1e-7;
    var wrongs = (o.wrongs || []).filter(function (w) { return w && w.pts && !samePts(w.pts, T, 1e-7); });
    return function (resp) {
      var s0 = String(resp == null ? '' : resp).trim(); if (!s0) return form('empty', 'Type your answer first.');
      if (isInf(resp)) return o.inf ? ok() : wrong(cp + 'inf-claim', 'Infinitely many solutions happen only when both equations describe the same graph. Eliminate ' + t('y') + ': what is left?');
      if (isNone(resp)) return !T.length && !o.inf ? ok() : wrong(cp + (o.inf ? 'inf-missed' : 'nosol-claim'), o.inf ? 'Eliminating ' + t('y') + ' gives ' + t('0=0') + ': the equations describe the same parabola, so every point on it is a solution.' : o.noneHint || 'The graphs do meet. Set the two expressions for ' + t('y') + ' equal, solve for ' + t('x') + ', then find each ' + t('y') + '.');
      var L = pairList(resp);
      if (L.noParen) return form('xs-only', 'Write each solution as an ordered pair ' + t('(x,\\ y)') + ', e.g. ' + t('(3,\\ 10),\\ (-2,\\ -5)') + '.');
      if (L.bad || L.empty) return form('unreadable', 'Write ordered pairs in brackets, separated by commas, e.g. ' + t('(3,\\ 10),\\ (-2,\\ -5)') + ', or type “no solution”.');
      var A = L.pairs;
      if (o.inf) return wrong(cp + 'inf-missed', 'Eliminate ' + t('y') + ' (or expand): you get ' + t('0=0') + ', so the equations describe the same parabola: infinitely many solutions.');
      if (!T.length) return wrong(cp + 'none-missed', o.noneHint2 || 'Check your work: after eliminating ' + t('y') + ' the equation has no real roots, so the graphs do not meet: no solution.');
      if (samePts(A, T, tol)) return ok();
      if (o.dp == null && samePts(A, T, 0.006)) return form('exact', 'Those are decimal approximations. Give the exact values (use ' + t('\\sqrt{\\ }') + ').');
      if (o.dp != null && samePts(A, T, 0.06 * Math.pow(10, 1 - o.dp))) return form('round', 'Round each coordinate to the nearest ' + (o.dp === 1 ? 'tenth' : 'hundredth') + '.');
      for (var i = 0; i < wrongs.length; i++) if (samePts(A, wrongs[i].pts, tol)) return wrong(wrongs[i].code, wrongs[i].hint);
      if (samePts(A.map(function (p) { return [p[1], p[0]]; }), T, tol)) return wrong(cp + 'pair-flip', 'Your pairs are backwards: write ' + t('(x,\\ y)') + ', the ' + t('x') + '-coordinate first.');
      var hit = A.filter(function (p) { return T.some(function (q) { return near(p[0], q[0], tol) && near(p[1], q[1], tol); }); });
      if (hit.length === A.length && A.length < T.length) return wrong(cp + 'sys-missing', 'Correct so far, but there ' + (T.length - A.length === 1 ? 'is another solution' : 'are more solutions') + ': the equation in ' + t('x') + ' has ' + T.length + ' roots, and each gives a point.');
      if (hit.length === T.length && A.length > T.length) return wrong(cp + 'sys-extra', 'One of your pairs is not a solution: check every pair in <b>both</b> equations.');
      var xa = A.map(function (p) { return p[0]; }).sort(), xb = T.map(function (p) { return p[0]; }).sort();
      if (xa.length === xb.length && xa.every(function (x, j) { return near(x, xb[j], tol); })) return wrong(cp + 'sys-y', 'Your ' + t('x') + '-values are right. Substitute each one into the simpler original equation to find its ' + t('y') + '.');
      return wrong('value', 'Substitute your pairs into both equations: they do not check.');
    };
  }
  /* pts: [{ x, y, xt, yt }] (xt / yt: exact LaTeX; default from the values) */
  function pairsPart(cp, prompt, pts, o, sol, hints, text) {
    o = o || {};
    var T = pts.map(function (p) { return [p.x, p.y]; });
    var keyTex = pts.length ? pts.map(function (p) { return '(' + (p.xt || vt(p.x)) + ',\\ ' + (p.yt || vt(p.y)) + ')'; }).join(',\\ ') : o.inf ? '\\text{infinitely many}' : '\\text{no solution}';
    var part = KP.math(prompt, pairsCheck(cp, T, o), keyTex, sol, hints, text, { keys: 'u8pairs', placeholder: 'e.g. (3, 10), (-2, -5)   or: no solution' });
    var bad = (o.wrongs || []).filter(function (w) { return w && w.pts && w.pts.length && !samePts(w.pts, T, 1e-7); }).map(function (w) { return w.pts.map(function (p) { return ptT(p[0], p[1]); }).join(',\\ '); });
    if (pts.length > 1) bad.push(keyTex.split(',\\ (')[0]);
    if (pts.length || o.inf) bad.push('\\text{no solution}'); else bad.push('(0,\\ 1)');
    if (o.inf) bad.push('(0,\\ 0)');
    part.bad = bad.filter(function (b, i, arr) { return arr.indexOf(b) === i; });
    return part;
  }

  /* ---------------- solution sets of one-variable inequalities ---------------- */
  function sIv(lo, hi, lc, hc) { return { lo: lo, hi: hi, lc: lo === -INF ? false : !!lc, hc: hi === INF ? false : !!hc }; }
  var SET = {
    between: function (a, b, inc) { return [sIv(a, b, inc, inc)]; },
    outside: function (a, b, inc) { return [sIv(-INF, a, false, inc), sIv(b, INF, inc, false)]; },
    below: function (a, inc) { return [sIv(-INF, a, false, inc)]; }, above: function (a, inc) { return [sIv(a, INF, inc, false)]; },
    ne: function (h) { return [sIv(-INF, h, false, false), sIv(h, INF, false, false)]; }, pt: function (h) { return [sIv(h, h, true, true)]; },
    all: function () { return [sIv(-INF, INF, false, false)]; }, none: function () { return []; }
  };
  /* the solution of A(v − r1)(v − r2) op 0 (r1 ≤ r2) */
  function quadSet(A, r1, r2, op) {
    var pos = A > 0 ? upOp(op) : !upOp(op), inc = !strictOp(op);
    if (near(r1, r2)) { if (pos) return inc ? SET.all() : SET.ne(r1); return inc ? SET.pt(r1) : SET.none(); }
    return pos ? SET.outside(r1, r2, inc) : SET.between(r1, r2, inc);
  }
  function sortP(a) { return a.slice().sort(function (x, y) { return x.lo - y.lo || x.hi - y.hi; }); }
  function partsEq(A, B, tol, ends) {
    if (A.length !== B.length) return false;
    var a = sortP(A), b = sortP(B);
    return a.every(function (p, i) { var q = b[i]; return near(p.lo, q.lo, tol) && near(p.hi, q.hi, tol) && (ends || (p.lc === q.lc && p.hc === q.hc)); });
  }
  function complement(parts) {
    var s = sortP(parts), out = [], lo = -INF, lc = false;
    s.forEach(function (p) {
      if (lo < p.lo || (lo === p.lo && lc && !p.lc && lo !== -INF)) out.push(sIv(lo, p.lo, lc, !p.lc));
      lo = p.hi; lc = !p.hc;
    });
    if (lo < INF) out.push(sIv(lo, INF, lc, false));
    return out;
  }
  function isAll(A) { return A.length === 1 && A[0].lo === -INF && A[0].hi === INF; }
  function eT(x, dec) { return x === INF ? '\\infty' : x === -INF ? '-\\infty' : dec ? dt(x) : vt(x); }
  function setTex(parts, v, dec) {
    v = v || 'x';
    if (!parts.length) return '\\text{no solution}';
    if (isAll(parts)) return '\\{' + v + '\\mid ' + v + '\\in\\mathbb{R}\\}';
    var s = sortP(parts);
    if (s.length === 2 && s[0].lo === -INF && s[1].hi === INF && s[0].hi === s[1].lo && !s[0].hc && !s[1].lc) return '\\{' + v + '\\mid ' + v + '\\ne ' + eT(s[0].hi, dec) + ',\\ ' + v + '\\in\\mathbb{R}\\}';
    if (s.length === 1 && s[0].lo === s[0].hi) return '\\{' + v + '\\mid ' + v + '=' + eT(s[0].lo, dec) + '\\}';
    var cond = s.map(function (p) {
      if (p.lo === -INF) return v + (p.hc ? '\\le ' : '<') + eT(p.hi, dec);
      if (p.hi === INF) return v + (p.lc ? '\\ge ' : '>') + eT(p.lo, dec);
      return eT(p.lo, dec) + (p.lc ? '\\le ' : '<') + v + (p.hc ? '\\le ' : '<') + eT(p.hi, dec);
    });
    return '\\{' + v + '\\mid ' + cond.join('\\text{ or }') + ',\\ ' + v + '\\in\\mathbb{R}\\}';
  }
  var WHY = {
    unbalanced: 'Check your braces: a { needs a matching }.', backwards: 'Write the smaller number first (on the left), e.g. ' + t('-3<x<4') + '. Never write ' + t('4<x<-3') + '.',
    'var-mix': 'Use the same variable all the way through.', 'inf-bracket': 'Infinity is never included: use a round bracket next to ' + t('\\infty') + '.',
    unreadable: 'Write the solution like ' + t('\\{x\\mid x<-2\\text{ or }x>3,\\ x\\in\\mathbb{R}\\}') + ', ' + t('-2\\le x\\le 5') + ', ' + t('x\\ne 4') + ' or “no solution”.'
  };
  /* T: parts; o: { v, tol, dec, wrongs: [{ parts, code, hint }], rev (a complement means a sign not reversed), sideHint, inclHint, revHint } */
  function setCheck(cp, T, o) {
    o = o || {};
    var V = o.v || 'x', tol = o.tol || 1e-9, comp = complement(T), neg = T.map(function (p) { return sIv(-p.hi, -p.lo, p.hc, p.lc); });
    var wrongs = (o.wrongs || []).filter(function (w) { return w && w.parts && !partsEq(w.parts, T, tol); });
    return function (resp) {
      var s0 = String(resp == null ? '' : resp).trim(), A;
      if (!s0) return form('empty', 'Type your answer first.');
      if (isNone(resp)) A = [];
      else {
        var pr = HW.sets.parse(resp);
        if (!pr.ok) { var pn = HW.parse.number(s0); if (pn.ok) pr = { ok: true, set: { kind: 'list', vals: [pn.value] }, v: '' }; }
        if (!pr.ok) return form(pr.why === 'empty' ? 'empty' : 'set-' + pr.why, WHY[pr.why] || WHY.unreadable);
        if (pr.v && pr.v !== V) return form('set-letter', 'Use the variable ' + t(V) + ' here.');
        A = pr.set.kind === 'list' ? pr.set.vals.map(function (x) { return sIv(x, x, true, true); }) : pr.set.parts.map(function (p) { return sIv(p.lo, p.hi, p.lc, p.hc); });
        if (!A.length && /\band\b/i.test(plain(resp)) && T.length === 2) return wrong(cp + 'ineq-and', 'No number is in both pieces at once: join the two pieces with <b>or</b>, e.g. ' + t(V + '<-2\\text{ or }' + V + '>3') + '.');
      }
      if (partsEq(A, T, tol)) return ok();
      for (var i = 0; i < wrongs.length; i++) if (partsEq(A, wrongs[i].parts, tol)) return wrong(wrongs[i].code, wrongs[i].hint);
      if (!T.length) return wrong(cp + 'ineq-claim', o.claimHint || 'Test a value in the original inequality: no real number makes it true, so there is no solution.');
      if (!A.length) return wrong(cp + 'ineq-none', o.noneHint || 'There are values that work: test ' + t(V + '=0') + ' (or another value) in the original inequality.');
      if (isAll(A)) return wrong(cp + 'ineq-all', 'Not every real number works: test a few values in the original inequality.');
      if (partsEq(A, T, tol, true)) return wrong(cp + 'ineq-incl', o.inclHint || 'Right intervals: now check the endpoints. ' + t('\\le') + ' and ' + t('\\ge') + ' include the roots (closed dots); ' + t('<') + ' and ' + t('>') + ' leave them out (open dots).');
      if (comp.length && partsEq(A, comp, tol, true)) return wrong(cp + (o.rev ? 'ineq-rev' : 'ineq-side'), o.rev ? (o.revHint || 'Multiplying or dividing by a negative number reverses the inequality sign. Test a value in the <b>original</b> inequality.') : (o.sideHint || 'Right roots, wrong intervals: test a value from each interval in the original inequality.'));
      if (partsEq(A, neg, tol, true) || (comp.length && partsEq(A, complement(neg), tol, true))) return wrong(cp + 'ineq-roots', 'Check the signs of the roots: ' + t('(' + V + '-3)=0') + ' gives ' + t(V + '=3') + ', not ' + t('-3') + '.');
      return wrong('value', null);
    };
  }
  function setPart(cp, prompt, T, o, sol, hints, text) {
    o = o || {};
    var V = o.v || 'x', key = setTex(T, V, o.dec);
    var p = KP.math(prompt, setCheck(cp, T, o), key, sol, hints, text, { keys: 'u8set', vars: [V], placeholder: 'e.g. {' + V + ' | ' + V + ' < -2 or ' + V + ' > 3, ' + V + ' in R}' });
    var bad = (o.wrongs || []).filter(function (w) { return w && w.parts && !partsEq(w.parts, T, o.tol || 1e-9); }).map(function (w) { return setTex(w.parts, V, o.dec); });
    var comp = complement(T); if (comp.length && T.length) bad.push(setTex(comp, V, o.dec));
    if (T.length && !isAll(T)) { var sw = T.map(function (q) { return sIv(q.lo, q.hi, q.lo !== q.hi ? !q.lc : q.lc, q.lo !== q.hi ? !q.hc : q.hc); }); if (!partsEq(sw, T)) bad.push(setTex(sw, V, o.dec)); }
    bad.push(T.length ? '\\text{no solution}' : '\\{' + V + '\\mid ' + V + '\\in\\mathbb{R}\\}');
    p.bad = bad.filter(function (b, i, arr) { return b !== key && arr.indexOf(b) === i; });
    return p;
  }

  /* ---------------- inequalities in two variables (or one, for "write the inequality") ---------------- */
  var OPTOK = /\\leqslant|\\geqslant|\\leq|\\geq|\\le(?![a-zA-Z])|\\ge(?![a-zA-Z])|\\lt(?![a-zA-Z])|\\gt(?![a-zA-Z])|<=|>=|≤|≥|<|>/g;
  function opOf(s) { return /le|<=|≤/.test(s) ? 'le' : /ge|>=|≥/.test(s) ? 'ge' : /lt|</.test(s) ? 'lt' : 'gt'; }
  function readIneq(resp) {
    var s = String(resp == null ? '' : resp).replace(/\\left|\\right/g, '').replace(/\\[,;: !]|~/g, ' ').trim();
    if (!s) return { why: 'empty' };
    var m, found = []; OPTOK.lastIndex = 0;
    while ((m = OPTOK.exec(s))) found.push({ i: m.index, n: m[0].length, op: opOf(m[0]) });
    if (!found.length) return { why: /=/.test(s) ? 'eq' : 'none' };
    if (found.length > 1) return { why: 'chain' };
    var L = P.read(s.slice(0, found[0].i)), Rr = P.read(s.slice(found[0].i + found[0].n));
    if (!L.ok || !Rr.ok) return { why: 'unreadable' };
    return { ok: true, D: P.sub(L.p, Rr.p), op: found[0].op };
  }
  function propTo(D, T) {
    var ks = Object.keys(T); if (!ks.length) return null;
    var k = ks.indexOf('y1') >= 0 ? 'y1' : ks[0]; if (!D[k]) return null;
    var lam = ex.norm(D[k].c[0] * T[k].c[1], D[k].c[1] * T[k].c[0]);
    return lam[0] !== 0 && P.eq(D, P.scale(T, lam)) ? lam : null;
  }
  function nonInt(D) { return Object.keys(D).some(function (k) { return D[k].c[1] !== 1; }); }
  /* T: the target's L − R (a polynomial) with the sign op, e.g. y − (2/3 x − 1) > 0; o: { wrongs: [{ T, op, code, hint }], general, posLead, intCoef, rev, sideHint, strictHint, boundHint } */
  function ineqCheck(cp, T, op, o) {
    o = o || {};
    return function (resp) {
      var q = readIneq(resp);
      if (!q.ok) return form(q.why === 'empty' ? 'empty' : 'ineq-' + q.why, { empty: 'Type your answer first.', eq: 'Write an inequality: use ' + t('<') + ', ' + t('\\le') + ', ' + t('>') + ' or ' + t('\\ge') + ', not ' + t('=') + '.', none: 'Write an inequality, e.g. ' + t(o.example || 'y>2x-1') + '.', chain: 'Use one inequality sign only.', unreadable: 'I can’t read that. Type it like ' + t(o.example || 'y>2x-1') + '.' }[q.why]);
      var lam = propTo(q.D, T), eff = lam ? (lam[0] > 0 ? q.op : FLIP[q.op]) : null;
      if (lam && eff === op) {
        if (o.posLead && lam[0] < 0) return form('pos-lead', 'Right — now write it with a positive leading coefficient (multiply both sides by ' + t('-1') + ' and reverse the sign).');
        if (o.intCoef && nonInt(q.D)) return form('int-coef', 'Right — now multiply to clear the fractions: use integer coefficients.');
        if (o.general && /\(/.test(String(resp))) return form('gen-form', 'Right — now expand it: write the right side in general form, ' + t('ax^{2}+bx+c') + '.');
        return ok();
      }
      for (var i = 0; i < (o.wrongs || []).length; i++) { var w = o.wrongs[i], lw = propTo(q.D, w.T); if (lw && (!w.op || (lw[0] > 0 ? q.op : FLIP[q.op]) === w.op)) return wrong(w.code, w.hint); }
      if (lam) {
        if (upOp(eff) === upOp(op)) return wrong(cp + 'reg-strict', o.strictHint || (strictOp(op) ? 'The boundary is <b>dashed</b>: points on it are not solutions, so use ' + t('<') + ' or ' + t('>') + '.' : 'The boundary is <b>solid</b>: points on it are solutions, so use ' + t('\\le') + ' or ' + t('\\ge') + '.'));
        return wrong(cp + (o.rev ? 'reg-rev' : 'reg-side'), o.sideHint || 'Right boundary, but the inequality points the wrong way. Substitute a point from the shaded region to choose the sign.');
      }
      return wrong(cp + 'reg-bound', o.boundHint || 'Check the boundary: substitute the given points into your equation.');
    };
  }
  function ineqPart(cp, prompt, T, op, keyTex, o, sol, hints, text) {
    o = o || {};
    var p = KP.math(prompt, ineqCheck(cp, T, op, o), keyTex, sol, hints, text, { keys: 'u8ineq', vars: o.vars || ['x', 'y'], placeholder: 'e.g. ' + (o.ph || 'y > 2/3x - 1') });
    var sides = keyTex.split(OPS[op].trim());
    p.bad = [sides[0] + OPS[FLIP[op]] + sides.slice(1).join(OPS[op].trim()), sides[0] + OPS[strictOp(op) ? (op === 'lt' ? 'le' : 'ge') : (op === 'le' ? 'lt' : 'gt')] + sides.slice(1).join(OPS[op].trim())].concat(o.bad || []);
    return p;
  }

  var B = {};

  /* ======================================================================================================
   * RF6 — systems (Lessons 1–3)
   * ====================================================================================================== */
  /* a linear equation y = mx + k shown as y = …, or in standard form (mx − y = −k, x + y = k, y − mx = k) */
  function lineShow(r, m, k, std) {
    if (!std) return { tex: 'y=' + tx(lin(m, k)), std: false };
    var kind = r.pick(m === -1 || m === 1 ? ['sum', 'mxy'] : ['mxy', 'ymx']);
    if (kind === 'sum') return { tex: m === -1 ? 'x+y=' + vt(k) : 'y-x=' + vt(k), std: true };
    if (kind === 'mxy') return { tex: tx(lin(m, 0)) + '-y=' + vt(-k), std: true };
    return { tex: tx(P.add(Y(), M(-m, 'x', 1))) + '=' + vt(k), std: true };
  }
  /* linear–quadratic by substitution (L1 Ex 3, Ex 5, #3, #4, EP01 A1, L8 #1): 'basic' | 'std' (a ≠ 1 or a standard-form
     line) | 'exact' (x = h ± √n) | 'tangent' | 'none' | 'mix' */
  B.lqSolve = function (r, cp, opt) {
    opt = opt || {};
    var mode = opt.mode || 'basic';
    if (mode === 'mix') mode = r.pick(['basic', 'std', 'std', 'tangent', 'none']);
    var s, a = 1, b, c, m, k, roots = null, std = false;
    if (mode === 'basic') {
      s = pickWhere(function () { return { r1: r.int(-6, 6), r2: r.int(-6, 6), m: nz(r, 1, 5), k: r.int(-8, 8) }; }, function (z) { return z.r1 < z.r2 && Math.abs(z.m - z.r1 - z.r2) <= 9 && Math.abs(z.k + z.r1 * z.r2) <= 20 && !(z.r1 === -2 && z.r2 === 3 && z.m === 3 && z.k === 1); });
      m = s.m; k = s.k; b = m - s.r1 - s.r2; c = k + s.r1 * s.r2; roots = [[s.r1, 1], [s.r2, 1]]; std = r.chance(0.3);
    } else if (mode === 'std') {
      s = pickWhere(function () { var aa = r.pick([2, 3, 2, -1, -2]), q = aa > 1 ? aa : 1; return { a: aa, p: q > 1 ? nz(r, 1, 7) : r.int(-6, 6), q: q, r2: r.int(-5, 5), m: nz(r, 1, 5), k: r.int(-7, 7) }; },
        function (z) { if (z.q > 1 && z.p % z.q === 0) return false; var r1 = z.p / z.q; if (Math.abs(r1 - z.r2) < 1e-9) return false; var bb = z.m - z.a * (r1 + z.r2), cc = z.k + z.a * r1 * z.r2; return Math.abs(bb) <= 12 && Math.abs(cc) <= 20 && bb % 1 === 0 && cc % 1 === 0 && !(z.a === 2 && z.p === -1 && z.r2 === 2); });
      a = s.a; m = s.m; k = s.k; roots = [[s.p, s.q], [s.r2, 1]]; b = m - a * (s.p / s.q + s.r2); c = k + a * (s.p / s.q) * s.r2; std = r.chance(0.6);
      if (rv(roots[0]) > rv(roots[1])) roots.reverse();
    } else if (mode === 'exact') {
      s = pickWhere(function () { return { h: r.int(-4, 4), n: r.pick([2, 3, 5, 6, 7, 10, 11]), m: nz(r, 1, 4), k: r.int(-6, 6) }; }, function (z) { return Math.abs(z.m - 2 * z.h) <= 10 && Math.abs(z.k + z.h * z.h - z.n) <= 20 && !(z.h === 3 && z.n === 5) && !(z.h === 1 && z.n === 3) && !(z.h === -1 && z.n === 6); });
      m = s.m; k = s.k; b = m - 2 * s.h; c = k + s.h * s.h - s.n; std = r.chance(0.4);
    } else if (mode === 'tangent') {
      s = pickWhere(function () { return { a: r.pick([1, 1, 2, -1]), h: nz(r, 1, 4), m: nz(r, 1, 5), k: r.int(-6, 6) }; }, function (z) { return Math.abs(z.m - 2 * z.a * z.h) <= 12 && Math.abs(z.k + z.a * z.h * z.h) <= 20; });
      a = s.a; m = s.m; k = s.k; b = m - 2 * a * s.h; c = k + a * s.h * s.h; roots = [[s.h, 1], [s.h, 1]]; std = r.chance(0.5);
    } else {
      s = pickWhere(function () { return { a: r.pick([1, 1, 2, -1]), b: r.int(-6, 6), c: r.int(-6, 9), m: nz(r, 1, 5), k: r.int(-7, 7) }; }, function (z) { var dd = z.b - z.m; return dd * dd - 4 * z.a * (z.c - z.k) < 0 && Math.abs(z.c - z.k) <= 12; });
      a = s.a; b = s.b; c = s.c; m = s.m; k = s.k; std = r.chance(0.5);
    }
    var Lp = lin(m, k), Q = quad(a, b, c), E = P.sub(Q, Lp), ls = lineShow(r, m, k, std);
    var eqs = t('y=' + tx(Q)) + ' and ' + t(ls.tex);
    var sol = (ls.std ? 'Write the linear equation as ' + t('y=' + tx(Lp)) + '.<br>' : '') + 'Substitute: ' + t(tx(Q) + '=' + tx(Lp)) + ', so ' + t(tx(E) + '=0') + '.<br>';
    var pts = [], wr = [];
    if (mode === 'exact') {
      var h = s.h, n = s.n, yc = m * h + k;
      sol += 'It does not factor. ' + t('x=\\dfrac{' + 2 * h + '\\pm\\sqrt{' + 4 * n + '}}{2}=' + surdT(h, 1, n, true)) + '.<br>Use the linear equation: ' + t('y=' + coefT(m) + '(' + surdT(h, 1, n, true) + ')' + (k ? (k > 0 ? '+' : '') + k : '') + '=' + surdT(yc, m, n, true)) + '.<br>';
      pts = [{ x: h + Math.sqrt(n), y: yc + m * Math.sqrt(n), xt: surdT(h, 1, n), yt: surdT(yc, m, n) }, { x: h - Math.sqrt(n), y: yc - m * Math.sqrt(n), xt: surdT(h, -1, n), yt: surdT(yc, -m, n) }];
      sol += 'Solutions: ' + t('(' + pts[0].xt + ',\\ ' + pts[0].yt + ')') + ' and ' + t('(' + pts[1].xt + ',\\ ' + pts[1].yt + ')') + '.';
    } else if (roots) {
      var xs = roots.map(rv), dbl = near(xs[0], xs[1]);
      sol += 'Factor: ' + t(facT(a, roots[0], roots[1]) + '=0') + ', so ' + (dbl ? t('x=' + vt(xs[0])) + ' (a double root: the line is tangent).' : t('x=' + vt(xs[0])) + ' or ' + t('x=' + vt(xs[1])) + '.') + '<br>';
      (dbl ? [xs[0]] : xs).forEach(function (x) { var y = at(Lp, x); pts.push({ x: x, y: y }); sol += t('x=' + vt(x)) + ': ' + t('y=' + subX(tx(Lp), x) + '=' + vt(y)) + '. '; });
      sol += '<br>' + (dbl ? 'One solution: ' : 'Solutions: ') + pts.map(function (p) { return t(ptT(p.x, p.y)); }).join(' and ') + '. Check ' + t(ptT(pts[0].x, pts[0].y)) + ' in the quadratic: ' + t(vt(at(Q, pts[0].x)) + '=' + vt(pts[0].y)) + ' ✓';
      var ns = (dbl ? [xs[0]] : xs).map(function (x) { return -x; });
      if (!ns.every(function (x) { return xs.some(function (y) { return near(x, y); }); })) wr.push({ pts: ns.map(function (x) { return [x, at(Lp, x)]; }), code: cp + 'root-sign', hint: 'Check the signs of your roots: a factor ' + t('(x-3)') + ' gives ' + t('x=3') + '.' });
      if (dbl && !near(xs[0], 0)) wr.push({ pts: [[xs[0], at(Lp, xs[0])], [-xs[0], at(Lp, -xs[0])]], code: cp + 'double-root', hint: t(facT(a, roots[0], roots[1]) + '=0') + ' has only one root: the line touches the parabola at one point (it is tangent).' });
    } else {
      var A2 = P.coef(E, { x: 2 }), B1 = P.coef(E, { x: 1 }), C0 = P.constant(E), Dd = rv(B1) * rv(B1) - 4 * rv(A2) * rv(C0);
      sol += 'The discriminant is ' + t(par(rv(B1)) + '^{2}-4' + '(' + vt(rv(A2)) + ')' + par(rv(C0)) + '=' + vt(Dd)) + ', which is negative: no real roots. <b>No solution</b>: the line and the parabola do not meet.';
      wr.push({ pts: [[0, k]], code: cp + 'none-missed', hint: null });
    }
    var prompt = 'Solve the system algebraically: ' + eqs + '.' + (mode === 'exact' ? ' Give exact solutions.' : '') + ' (Type “no solution” if the graphs do not meet.)';
    return pairsPart(cp, prompt, pts, { wrongs: wr }, sol, ['Write the linear equation as ' + t('y=\\dots') + ' and substitute it into the quadratic.', 'Solve the quadratic equation (factor' + (mode === 'exact' ? ' or use the quadratic formula' : '') + '), then use the linear equation to find each ' + t('y') + '.'], 'solve a linear–quadratic system');
  };

  /* the number of solutions without solving (L1 Ex 6, #7, EP01 A4, L3 MC, L8 #15): multiple choice */
  B.lqCount = function (r, cp, opt) {
    opt = opt || {};
    var want = opt.want != null ? opt.want : r.pick([0, 1, 2, 2, 0, 1]);
    var s = pickWhere(function () {
      var a = r.pick([1, 1, 2, 3, -1, -2]), m = nz(r, 1, 5), k = r.int(-6, 6), b, c;
      if (want === 1) { var h = nz(r, 1, 3); b = m - 2 * a * h; c = k + a * h * h; }
      else { b = r.int(-6, 6); c = r.int(-6, 8); }
      return { a: a, b: b, c: c, m: m, k: k };
    }, function (z) { var dd = z.b - z.m, D = dd * dd - 4 * z.a * (z.c - z.k); return Math.abs(z.b) <= 12 && Math.abs(z.c) <= 15 && (want === 0 ? D < 0 : want === 1 ? D === 0 : D > 0); });
    var Lp = lin(s.m, s.k), Q = quad(s.a, s.b, s.c), E = P.sub(Q, Lp), ls = lineShow(r, s.m, s.k, r.chance(0.4));
    var A2 = rv(P.coef(E, { x: 2 })), B1 = rv(P.coef(E, { x: 1 })), C0 = rv(P.constant(E)), D = B1 * B1 - 4 * A2 * C0;
    var calc = (ls.std ? t('y=' + tx(Lp)) + '. ' : '') + 'Substitute: ' + t(tx(E) + '=0') + '. Discriminant: ' + t(par(B1) + '^{2}-4(' + vt(A2) + ')' + par(C0) + '=' + vt(D)) + '.';
    var opts = [0, 1, 2, 'inf'].map(function (n) {
      var right = n === want;
      return { html: n === 'inf' ? 'infinitely many' : t(n), right: right, code: 'n' + n, why: right ? null : n === 'inf' ? 'A line and a parabola can meet at most twice. ' + calc : calc + ' ' + (D > 0 ? 'Positive: two solutions.' : D === 0 ? 'Zero: one solution (the line is tangent).' : 'Negative: no solution.') };
    });
    return KP.mc(r, 'Without solving, determine the number of solutions of the system ' + t('y=' + tx(Q)) + ' and ' + t(ls.tex) + '.', opts,
      calc + ' ' + (D > 0 ? 'The discriminant is positive: <b>two</b> solutions.' : D === 0 ? 'The discriminant is zero: <b>one</b> solution (the line is tangent to the parabola).' : 'The discriminant is negative: <b>no</b> solution.'),
      ['Substitute to get one quadratic equation in standard form ' + t('ax^{2}+bx+c=0') + '.', 'Its discriminant ' + t('b^{2}-4ac') + ': positive → two, zero → one, negative → none.'], 'number of solutions', true);
  };

  /* the solutions read from a graph (L1 #1, L2 Ex 1, #1, EP01 A3): a line and a parabola, or two parabolas */
  B.readGraph = function (r, cp, opt) {
    opt = opt || {};
    var qq = opt.mode ? opt.mode === 'qq' : r.chance(0.5);
    var s = pickWhere(function () { var a = r.pick([1, -1]), h = r.int(-2, 2), q = a > 0 ? r.int(-6, -1) : r.int(1, 6), x1 = r.int(-4, 3), x2 = r.int(-3, 4); return { a: a, h: h, q: q, x1: x1, x2: x2 }; }, function (z) {
      if (z.x2 - z.x1 < 2) return false;
      var f = function (x) { return z.a * (x - z.h) * (x - z.h) + z.q; }, y1 = f(z.x1), y2 = f(z.x2);
      if (Math.abs(y1) > 8 || Math.abs(y2) > 8) return false;
      if (qq) { var g = function (x) { return f(x) - 2 * z.a * (x - z.x1) * (x - z.x2); }, gv = g((z.x1 + z.x2) / 2); return Math.abs(gv) <= 9; }
      return Math.abs((y2 - y1) / (z.x2 - z.x1)) <= 4 && y1 !== y2;
    });
    var P1 = P.add(P.scale(P.pow(lin(1, -s.h), 2), s.a), P.num(s.q)), f1 = function (x) { return at(P1, x); };
    var y1 = f1(s.x1), y2 = f1(s.x2), P2, f2;
    if (qq) { P2 = P.sub(P1, P.scale(P.mul(lin(1, -s.x1), lin(1, -s.x2)), 2 * s.a)); }
    else { var mm = (y2 - y1) / (s.x2 - s.x1); P2 = lin(mm, y1 - mm * s.x1); }
    f2 = function (x) { return at(P2, x); };
    var lo = Math.min(-2, y1, y2, s.q, qq ? f2((s.x1 + s.x2) / 2) : 0) - 2, hi = Math.max(2, y1, y2, s.q, qq ? f2((s.x1 + s.x2) / 2) : 0) + 2;
    lo = Math.max(-11, 2 * Math.floor(lo / 2)); hi = Math.min(11, 2 * Math.ceil(hi / 2));
    var svg = regionSvg({ x: [-6, 6], y: [lo, hi], unit: 20, max: 300, curves: [{ f: f1 }, { f: f2, color: '#c4532a' }], aria: 'graphs of the system' });
    var pts = [{ x: s.x1, y: y1 }, { x: s.x2, y: y2 }];
    var sol = 'The graphs cross at ' + t(ptT(s.x1, y1)) + ' and ' + t(ptT(s.x2, y2)) + '.<br>Check ' + t(ptT(s.x1, y1)) + ': ' + t(subX(tx(P1), s.x1) + '=' + y1) + ' ✓ and ' + t(subX(tx(P2), s.x1) + '=' + y1) + ' ✓.';
    return pairsPart(cp, 'The graphs of ' + t('y=' + tx(P1)) + ' and ' + t('y=' + tx(P2)) + ' are shown. State the solution of the system.' + fig(svg), pts,
      { wrongs: [{ pts: [[s.x1, 0], [s.x2, 0]], code: cp + 'sys-y', hint: 'The solutions are the points where the graphs <b>meet</b>, with both coordinates.' }] }, sol,
      ['The solutions of a system are the points of intersection of its graphs.', 'Read each point where the graphs cross, then check it in both equations.'], 'solutions from a graph');
  };

  /* quadratic–quadratic (L2 Ex 3, Ex 5, Ex 7, #3, #4, #6, #9, EP02 A1, B2, L8 #3): 'basic' | 'cancel' (one / none /
     infinitely many) | 'frac' (fractional or decimal coefficients) | 'rearr' (y − x² = …) | 'fracroot' | 'mix' */
  B.qqSolve = function (r, cp, opt) {
    opt = opt || {};
    var mode = opt.mode || 'basic';
    if (mode === 'mix') mode = r.pick(['frac', 'rearr', 'fracroot']);
    var s, P1, P2, roots = null, kind = 'two', show1, show2, dec = false;
    if (mode === 'cancel') {
      kind = opt.kind || r.pick(['one', 'one', 'none', 'inf']);
      s = pickWhere(function () { return { a: r.pick([1, 2, 3, -1, -2, 5]), b2: r.int(-6, 6), c2: r.int(-8, 8), dd: nz(r, 1, 8), x0: r.int(-4, 4), e: nz(r, 1, 7), h: nz(r, 1, 4), q: r.int(-6, 6) }; }, function (z) { return true; });
      if (kind === 'one') { P2 = quad(s.a, s.b2, s.c2); P1 = P.add(P2, lin(s.dd, -s.dd * s.x0)); roots = [[s.x0, 1]]; }
      else if (kind === 'none') { P2 = quad(s.a, s.b2, s.c2); P1 = P.add(P2, P.num(s.e)); }
      else { P1 = P.add(P.scale(P.pow(lin(1, -s.h), 2), s.a), P.num(s.q)); P2 = P1; }
      show1 = 'y=' + (kind === 'inf' ? coefT(s.a) + br(lin(1, -s.h)) + '^{2}' + (s.q ? (s.q > 0 ? '+' : '') + s.q : '') : tx(P1)); show2 = 'y=' + tx(P2);
      if (r.chance(0.5)) { var tmp = show1; show1 = show2; show2 = tmp; tmp = P1; P1 = P2; P2 = tmp; }
    } else {
      s = pickWhere(function () {
        var kk = mode === 'fracroot' ? r.pick([2, 3, -2]) : r.pick([1, 2, -1, -2, 3, 1]), q1 = mode === 'fracroot' ? Math.abs(kk) : 1;
        var p1 = mode === 'fracroot' ? nz(r, 1, 7) : r.int(-6, 6);
        var fa = mode === 'frac' ? r.pick([[[1, 3], [-2, 3]], [[2, 3], [-1, 3]], [[1, 2], [-1, 2]], [[1, 4], [-3, 4]], [[3, 4], [-1, 4]]]) : null;
        return { k: fa ? 1 : kk, p1: p1, q1: q1, r2: r.int(-5, 5), a2: fa ? fa[1] : r.pick([1, -1, 2, -2, 1]), b2: r.int(-6, 6), c2: r.int(-8, 8), fa: fa };
      }, function (z) {
        if (z.q1 > 1 && z.p1 % z.q1 === 0) return false; var r1 = z.p1 / z.q1; if (near(r1, z.r2)) return false;
        if (!z.fa && rv(z.a2) + z.k === 0) return false;
        var b1 = z.b2 - z.k * (r1 + z.r2), c1 = z.c2 + z.k * r1 * z.r2;
        return b1 % 1 === 0 && c1 % 1 === 0 && Math.abs(b1) <= 10 && Math.abs(c1) <= 18 && !(z.r2 === 4 && near(r1, -1) && z.k === 2);
      });
      var r1 = s.p1 / s.q1;
      P2 = quad(s.a2, s.b2, s.c2); P1 = P.add(P2, P.scale(P.mul(lin(s.q1, -s.p1), lin(1, -s.r2)), ex.norm(s.k, s.q1)));
      roots = [[s.p1, s.q1], [s.r2, 1]]; if (r1 > s.r2) roots.reverse();
      dec = mode === 'frac' && r.chance(0.4) && s.fa && [2, 4].indexOf(R(s.fa[0])[1]) >= 0;
      var showP = function (p) { return dec ? P.tex(p, { dec: true }) : tx(p); };
      show1 = 'y=' + showP(P1); show2 = 'y=' + showP(P2);
      if (mode === 'rearr') {
        var a1v = P.coef(P1, { x: 2 }), a2v = P.coef(P2, { x: 2 });
        show1 = P.seq([Y(), M([-a1v[0], a1v[1]], 'x', 2)]) + '=' + tx(P.sub(P1, M(a1v, 'x', 2)));
        show2 = P.seq([Y(), M([-a2v[0], a2v[1]], 'x', 2)]) + '=' + tx(P.sub(P2, M(a2v, 'x', 2)));
      }
    }
    var Dp = P.sub(P1, P2), sol = (mode === 'rearr' ? 'Write each with ' + t('y') + ' alone: ' + t('y=' + tx(P1)) + ' and ' + t('y=' + tx(P2)) + '.<br>' : '') + 'Set the right sides equal (subtract the equations): ' + t(tx(Dp) + '=0') + '.<br>';
    var pts = [], wr = [];
    if (kind === 'none') sol += 'The ' + t('x^{2}') + '- and ' + t('x') + '-terms cancel and leave ' + t(vt(rv(P.constant(Dp))) + '=0') + ', a false statement: <b>no solution</b> (one parabola is the other translated vertically).';
    else if (kind === 'inf') sol += 'Everything cancels: ' + t('0=0') + '. The equations describe the same parabola, so there are <b>infinitely many</b> solutions.';
    else {
      var xs = roots.map(rv);
      if (kind === 'one') sol += 'The ' + t('x^{2}') + '-terms cancel, leaving a linear equation: ' + t('x=' + vt(xs[0])) + '.<br>';
      else sol += 'Factor: ' + t(facT(P.lead(Dp), roots[0], roots[1]) + '=0') + ', so ' + t('x=' + vt(xs[0])) + ' or ' + t('x=' + vt(xs[1])) + '.<br>';
      xs.forEach(function (x) { var y = at(P2, x); pts.push({ x: x, y: y }); sol += t('x=' + vt(x)) + ': ' + t('y=' + vt(y)) + '. '; });
      sol += '<br>' + (kind === 'one' ? 'One solution: ' : 'Solutions: ') + pts.map(function (p) { return t(ptT(p.x, p.y)); }).join(' and ') + '. Check ' + t(ptT(pts[0].x, pts[0].y)) + ' in the other equation: ' + t(vt(at(P1, pts[0].x))) + ' ✓';
      var ns = xs.map(function (x) { return -x; });
      if (!ns.every(function (x) { return xs.some(function (y) { return near(x, y); }); })) wr.push({ pts: ns.map(function (x) { return [x, at(P2, x)]; }), code: cp + 'root-sign', hint: 'Check the signs of your roots: a factor ' + t('(x-3)') + ' gives ' + t('x=3') + '.' });
    }
    var prompt = 'Solve the system: ' + t(show1) + ' and ' + t(show2) + '. (Type “no solution” or “infinitely many” if that is the case.)';
    return pairsPart(cp, prompt, pts, { wrongs: wr, inf: kind === 'inf' }, sol, ['Write both equations as ' + t('y=\\dots') + ' and set the right sides equal (this eliminates ' + t('y') + ').', 'Collect every term on one side and solve. If the ' + t('x^{2}') + '-terms cancel, what is left is linear (or a statement such as ' + t('0=5') + ' or ' + t('0=0') + ').'], 'solve a quadratic–quadratic system');
  };

  /* the values of k (or c) for which a line meets a parabola at two / one / no points (L1 Ex 6a, #8, L3 Ex 7b, #10, EP03 B5) */
  B.lqK = function (r, cp, opt) {
    opt = opt || {};
    var want = opt.want || r.pick(['two', 'none', 'two', 'none', 'one']), inPar = r.chance(0.35);
    var s = pickWhere(function () { return { a: inPar ? 1 : r.pick([1, 1, -1]), b: r.int(-6, 6), c: r.int(-6, 9), m: nz(r, 1, 6), q: r.int(-6, 6) }; }, function (z) { var dd = z.b - z.m; return dd % 2 === 0 && dd !== 0 && Math.abs(dd) <= 10; });
    var dd = s.b - s.m, d2 = dd * dd / 4, v = inPar ? 'c' : 'k', k0, sol, prompt, T, wr = [];
    if (inPar) {
      // x² + bx + c = mx + q  ->  x² + (b − m)x + (c − q) = 0; D = dd² − 4(c − q)
      k0 = s.q + d2;
      prompt = 'For which values of ' + t('c') + ' does the system ' + t('y=x^{2}' + (s.b ? (s.b > 0 ? '+' : '') + coefT(s.b) + 'x' : '') + '+c') + ' and ' + t('y=' + tx(lin(s.m, s.q))) + ' have ' + (want === 'two' ? '<b>two</b> solutions' : want === 'none' ? '<b>no</b> solution' : 'exactly <b>one</b> solution') + '?';
      sol = 'Substitute: ' + t('x^{2}' + (dd > 0 ? '+' : '') + coefT(dd) + 'x+(c' + (s.q ? (s.q > 0 ? '-' + s.q : '+' + (-s.q)) : '') + ')=0') + '.<br>Discriminant: ' + t(par(dd) + '^{2}-4(1)(c' + (s.q ? (s.q > 0 ? '-' + s.q : '+' + (-s.q)) : '') + ')=' + (dd * dd + 4 * s.q) + '-4c') + '.<br>';
      T = want === 'two' ? SET.below(k0, false) : want === 'none' ? SET.above(k0, false) : SET.pt(k0);
      sol += want === 'one' ? 'One solution when it is ' + t('0') + ': ' + t('c=' + vt(k0)) + '.' : (want === 'two' ? 'Two solutions when it is positive: ' : 'No solution when it is negative: ') + t(want === 'two' ? 'c<' + vt(k0) : 'c>' + vt(k0)) + '.';
    } else {
      // a x² + bx + c = mx + k -> a x² + dd x + (c − k) = 0; D = dd² − 4a(c − k) = dd² − 4ac + 4ak
      k0 = s.c - s.a * d2;
      var twoUp = s.a > 0; // two points when k > k0 (a > 0)
      prompt = 'For which values of ' + t('k') + ' does the line ' + t('y=' + coefT(s.m) + 'x+k') + ' intersect the parabola ' + t('y=' + tx(quad(s.a, s.b, s.c))) + ' at ' + (want === 'two' ? '<b>two</b> points' : want === 'none' ? '<b>no</b> points' : 'exactly <b>one</b> point') + '?';
      var cT = s.c ? '(' + s.c + '-k)' : '(-k)';
      sol = 'Substitute: ' + t(tx(quad(s.a, dd, 0)) + '+' + cT + '=0') + '.<br>Discriminant: ' + t(par(dd) + '^{2}-4(' + s.a + ')' + cT + '=' + (dd * dd - 4 * s.a * s.c) + (s.a > 0 ? '+' : '-') + '4k') + '.<br>';
      T = want === 'one' ? SET.pt(k0) : (want === 'two') === twoUp ? SET.above(k0, false) : SET.below(k0, false);
      sol += want === 'one' ? 'One point (tangent) when it is ' + t('0') + ': ' + t('k=' + vt(k0)) + '.' : (want === 'two' ? 'Two points when it is positive: ' : 'No points when it is negative: ') + t(T[0].lo === -INF ? 'k<' + vt(k0) : 'k>' + vt(k0)) + '.';
    }
    if (want !== 'one') {
      wr.push({ parts: T[0].lo === -INF ? SET.above(k0, false) : SET.below(k0, false), code: cp + 'k-dir', hint: 'Check the direction: ' + (want === 'two' ? 'two solutions need a <b>positive</b> discriminant' : 'no solution needs a <b>negative</b> discriminant') + '. Solve that inequality for ' + t(v) + ' (dividing by a negative reverses the sign).' });
      wr.push({ parts: T[0].lo === -INF ? SET.below(k0, true) : SET.above(k0, true), code: cp + 'k-incl', hint: 'At ' + t(v + '=' + vt(k0)) + ' the discriminant is ' + t('0') + ': one solution (a tangent), so that value is not included.' });
      wr.push({ parts: SET.pt(k0), code: cp + 'k-tangent', hint: 'That is the value for <b>one</b> point (a tangent). Write the inequality for ' + (want === 'two' ? 'two points' : 'no points') + '.' });
    }
    return setPart(cp, prompt + (want === 'one' ? ' Type the value, e.g. ' + t(v + '=3') + '.' : ' Write an inequality.'), T, { v: v, wrongs: wr }, sol,
      ['Substitute to get one quadratic equation in standard form; its constant term contains ' + t(v) + '.', 'Two solutions: ' + t('b^{2}-4ac>0') + '; one: ' + t('=0') + '; none: ' + t('<0') + '. Solve for ' + t(v) + '.'], 'values of a constant for tangency');
  };

  /* every slope m for which y = mx + q is tangent to y = x² + bx + c, with the points of tangency (L1 Ex 6b, #9, L3 Ex 7a, L8 #4, EP01 C2) */
  B.tangentM = function (r, cp) {
    var s = pickWhere(function () { return { b: r.int(-5, 5), sq: r.int(1, 3), q: r.int(-6, 4) }; }, function (z) { return !(z.b === 0 && z.sq === 2 && z.q === -1) && !(z.b === -2 && z.sq === 2 && z.q === 2) && !(z.b === 2 && z.sq === 2 && z.q === 3); });
    var c = s.q + s.sq * s.sq, m1 = s.b - 2 * s.sq, m2 = s.b + 2 * s.sq, Qp = quad(1, s.b, c);
    var p1 = [-s.sq, m1 * -s.sq + s.q], p2 = [s.sq, m2 * s.sq + s.q];
    var sol = 'Substitute: ' + t('x^{2}+(' + s.b + '-m)x+' + par(c - s.q) + '=0').replace('(0-m)', '(-m)') + '.<br>Tangent: one solution, so the discriminant is ' + t('0') + ': ' + t('(' + s.b + '-m)^{2}-4(1)(' + (c - s.q) + ')=0').replace('(0-m)', '(-m)') + ', so ' + t((s.b ? s.b + '-m' : '-m') + '=\\pm ' + 2 * s.sq) + ' and ' + t('m=' + m1) + ' or ' + t('m=' + m2) + '.<br>' +
      t('m=' + m1) + ': ' + t('(x+' + s.sq + ')^{2}=0') + ', ' + t('x=' + (-s.sq)) + ', point ' + t(ptT(p1[0], p1[1])) + '. ' + t('m=' + m2) + ': ' + t('(x-' + s.sq + ')^{2}=0') + ', ' + t('x=' + s.sq) + ', point ' + t(ptT(p2[0], p2[1])) + '.';
    var mChk = K.valueSet([m1, m2], { v: 'm', diag: function (A) { if (A.length === 1 && (near(A[0], m1) || near(A[0], m2))) return { code: cp + 'tan-one', hint: 'There are two tangent lines through ' + t(ptT(0, s.q)) + ': ' + t('(' + (s.b ? s.b + '-m' : '-m') + ')^{2}=' + 4 * s.sq * s.sq) + ' has two roots.' }; return null; } });
    var pChk = pairsCheck(cp, [p1, p2], { wrongs: [{ pts: [[s.sq, m1 * s.sq + s.q], [-s.sq, m2 * -s.sq + s.q]], code: cp + 'tan-pts', hint: 'Pair each slope with its own point: substitute each ' + t('m') + ' back and solve the perfect square.' }] });
    var chk = function (resp) {
      resp = resp || [];
      var a = mChk(resp[0] == null ? '' : resp[0]), b = pChk(resp[1] == null ? '' : resp[1]);
      if (a.v === 'correct' && b.v === 'correct') return ok();
      if (a.v === 'wrong') return wrong(a.code, '<b>Slopes:</b> ' + (a.hint || 'Set the discriminant equal to 0 and solve for m.'));
      if (a.v === 'form') return a;
      if (b.v === 'form') return { v: 'form', code: b.code, hint: '<b>Points:</b> ' + b.hint };
      return wrong(b.code === 'value' ? cp + 'tan-pts' : b.code, '<b>Points:</b> ' + (b.hint || 'Substitute each slope back to find its point of tangency.'));
    };
    var part = { prompt: 'The line ' + t('y=mx' + (s.q ? (s.q > 0 ? '+' : '') + s.q : '')) + ' is tangent to the parabola ' + t('y=' + tx(Qp)) + '. Determine the possible values of ' + t('m') + ' and the point of tangency for each.',
      input: { type: 'fields', fields: [{ label: 'Values of ' + t('m') + ':', mode: 'math', keys: 'u8tan', vars: ['m'], name: 'Slopes', placeholder: 'e.g. m = 4, m = -4' }, { label: 'Points:', mode: 'math', keys: 'u8tan', name: 'Points', placeholder: 'e.g. (2, 7), (-2, 7)' }] },
      check: chk, key: ['m=' + m1 + ',\\ m=' + m2, ptT(p1[0], p1[1]) + ',\\ ' + ptT(p2[0], p2[1])], answer: t('m=' + m1) + ' and ' + t('m=' + m2) + '; points ' + t(ptT(p1[0], p1[1])) + ' and ' + t(ptT(p2[0], p2[1])), solution: sol,
      hints: ['Substitute the line into the parabola. A tangent meets it once, so the discriminant is ' + t('0') + '.', 'Solve for ' + t('m') + ' (two values), then put each back to find its point.'], text: 'tangent slopes' };
    part.bad = [['m=' + m2, ptT(p2[0], p2[1])], ['m=' + m1 + ',\\ m=' + m2, ptT(s.sq, m1 * s.sq + s.q) + ',\\ ' + ptT(-s.sq, m2 * -s.sq + s.q)]];
    return part;
  };

  /* the k that gives a quadratic–quadratic system one solution, and that solution (L2 Ex 7, #8, EP02 B4, L2 nr) */
  B.qqOne = function (r, cp) {
    var s = pickWhere(function () { return { sa: r.pick([1, 2, 1]), x0: nz(r, 1, 4), a2: r.pick([-1, -2, 1, -1]), b2: r.int(-6, 8), c2: r.int(-5, 6), first: r.chance(0.5) }; }, function (z) { return z.a2 + z.sa !== 0 && !(z.sa === 2 && z.x0 === 1 && z.a2 === -1 && z.b2 === 4); });
    // P1 = (a2 + sa)x² + b1 x + k, P1 − P2 = sa(x − x0)² -> b1 = b2 − 2 sa x0, k = c2 + sa x0²
    var a1 = s.a2 + s.sa, b1 = s.b2 - 2 * s.sa * s.x0, kv = s.c2 + s.sa * s.x0 * s.x0, P2 = quad(s.a2, s.b2, s.c2), y0 = at(P2, s.x0);
    var P1k = tx(quad(a1, b1, 0)) + '+k', Dd = P.add(M(s.sa, 'x', 2), M(b1 - s.b2, 'x', 1));
    var sol = 'Subtract: ' + t(tx(Dd) + '+(k' + (s.c2 ? (s.c2 > 0 ? '-' + s.c2 : '+' + (-s.c2)) : '') + ')=0') + '.<br>One solution: the discriminant is ' + t('0') + ': ' + t(par(b1 - s.b2) + '^{2}-4(' + s.sa + ')(k' + (s.c2 ? (s.c2 > 0 ? '-' + s.c2 : '+' + (-s.c2)) : '') + ')=0') + ', so ' + t('k=' + kv) + '.<br>Then ' + t(coefT(s.sa) + '(x' + (s.x0 > 0 ? '-' + s.x0 : '+' + (-s.x0)) + ')^{2}=0') + ': ' + t('x=' + s.x0) + ', ' + t('y=' + vt(y0)) + '. The solution is ' + t(ptT(s.x0, y0)) + '.';
    var kChk = K.number(kv, function (v) { return near(v, -kv) ? { code: cp + 'qq-k', hint: 'Check the sign of ' + t('k') + '.' } : null; }), pChk = pairsCheck(cp, [[s.x0, y0]], {});
    var chk = function (resp) {
      resp = resp || [];
      var a = kChk(resp[0] == null ? '' : resp[0]), b = pChk(resp[1] == null ? '' : resp[1]);
      if (a.v === 'correct' && b.v === 'correct') return ok();
      if (a.v !== 'correct') return a.v === 'form' ? a : wrong(a.code === 'value' ? 'value' : a.code, '<b>k:</b> ' + (a.hint || 'Eliminate ' + t('y') + ' and set the discriminant equal to 0.'));
      return b.v === 'form' ? b : wrong(cp + 'qq-k', '<b>Solution:</b> right ' + t('k') + '. Put it back, solve the perfect square for ' + t('x') + ', then find ' + t('y') + '.');
    };
    var e1 = 'y=' + P1k, e2 = 'y=' + tx(P2);
    var part = { prompt: 'Determine the value of ' + t('k') + ' for which the system ' + t(s.first ? e1 : e2) + ' and ' + t(s.first ? e2 : e1) + ' has exactly one solution, and determine that solution.',
      input: { type: 'fields', fields: [{ label: t('k='), name: 'k' }, { label: 'Solution:', mode: 'math', keys: 'u8pairs', name: 'Solution', placeholder: 'e.g. (1, 3)' }] },
      check: chk, key: [String(kv), ptT(s.x0, y0)], answer: t('k=' + kv) + '; the solution is ' + t(ptT(s.x0, y0)), solution: sol,
      hints: ['Eliminate ' + t('y') + ': subtract the equations. One solution means the discriminant of what is left is ' + t('0') + '.', 'Solve for ' + t('k') + ', then solve the system with that ' + t('k') + '.'], text: 'one solution: find k' };
    part.bad = [[String(-kv), ptT(s.x0, y0)], [String(kv), ptT(-s.x0, y0)]];
    return part;
  };

  /* number problems (L3 Ex 1a, #1, EP03 A1, L8 #5): both pairs as ordered pairs */
  B.numberPair = function (r, cp) {
    var kind = r.pick(['diff', 'sum', 'sq']), s = pickWhere(function () { return { x1: r.int(2, 9), d: r.int(2, 7), sm: r.int(5, 15) }; }, function (z) { return !(z.x1 === 6 && z.d === 4) && !(z.x1 === 5 && z.sm === 11) && !(z.x1 === 2 && z.sm === 9) && !(z.x1 === 4 && z.d === 3); });
    var x1 = s.x1, x2 = -1 - x1, prompt, pts, sol, lab;
    if (kind === 'diff') {
      var S = s.d - x1 * x2; pts = [[x1, x1 + s.d], [x2, x2 + s.d]]; lab = '(smaller, larger)';
      prompt = 'The difference of two numbers is ' + t(s.d) + '. The larger number plus the square of the smaller number is ' + t(S) + '. Write a system and determine both possible pairs of numbers.';
      sol = 'Let ' + t('x') + ' be the smaller and ' + t('y') + ' the larger: ' + t('y=x+' + s.d) + ' and ' + t('y+x^{2}=' + S) + '.<br>Substitute: ' + t('x^{2}+x+' + s.d + '=' + S) + ', so ' + t('x^{2}+x-' + (S - s.d) + '=0') + ' and ' + t(facT(1, x2, x1) + '=0') + '.<br>' + t('x=' + x1) + ', ' + t('y=' + (x1 + s.d)) + '; ' + t('x=' + x2) + ', ' + t('y=' + (x2 + s.d)) + '.';
    } else if (kind === 'sum') {
      var Tt = -x1 * x2 - s.sm; pts = [[x1, s.sm - x1], [x2, s.sm - x2]]; lab = '(first, second)';
      prompt = 'The sum of two numbers is ' + t(s.sm) + '. The square of the first number minus the second number is ' + t(Tt) + '. Write a system and determine both possible pairs of numbers.';
      sol = t('x+y=' + s.sm) + ' and ' + t('x^{2}-y=' + Tt) + '.<br>' + t('y=' + s.sm + '-x') + ': ' + t('x^{2}-(' + s.sm + '-x)=' + Tt) + ', so ' + t('x^{2}+x-' + (Tt + s.sm) + '=0') + ' and ' + t(facT(1, x2, x1) + '=0') + '.<br>' + t('x=' + x1) + ', ' + t('y=' + (s.sm - x1)) + '; ' + t('x=' + x2) + ', ' + t('y=' + (s.sm - x2)) + '.';
    } else {
      var cc = s.sm + x1 * x2; if (cc <= 0) { cc = 2 + s.d; }
      var sm = cc - x1 * x2; pts = [[x1, x1 * x1 + cc], [x2, x2 * x2 + cc]]; lab = '(smaller, larger)';
      prompt = 'The sum of two numbers is ' + t(sm) + ', and the larger number is ' + t(cc) + ' more than the square of the smaller number. Write a system and determine both possible pairs of numbers.';
      sol = 'Smaller ' + t('x') + ', larger ' + t('y') + ': ' + t('x+y=' + sm) + ' and ' + t('y=x^{2}+' + cc) + '.<br>' + t('x+x^{2}+' + cc + '=' + sm) + ', so ' + t('x^{2}+x-' + (sm - cc) + '=0') + ' and ' + t(facT(1, x2, x1) + '=0') + '.<br>' + t('x=' + x1) + ', ' + t('y=' + (x1 * x1 + cc)) + '; ' + t('x=' + x2) + ', ' + t('y=' + (x2 * x2 + cc)) + '.';
    }
    sol += '<br>The pairs are ' + ptsT(pts).replace(/\(/g, '(').split(' and ').map(function (z) { return t(z); }).join(' and ') + ' (each checks in both conditions).';
    return pairsPart(cp, prompt + ' Write each pair as ' + lab + '.', pts.map(function (p) { return { x: p[0], y: p[1] }; }),
      { wrongs: [{ pts: [pts[0]], code: cp + 'sys-missing', hint: 'The quadratic has two roots, and the negative one gives a second pair that also works. Check it.' }] }, sol,
      ['Let the numbers be ' + t('x') + ' and ' + t('y') + '. Each sentence gives one equation.', 'Solve the linear equation for ' + t('y') + ', substitute, and solve the quadratic. Each root gives a pair.'], 'a number problem with a system');
  };

  /* two objects thrown at the same moment, the t²-terms cancel (L3 Ex 5, #8, EP03 A3, L8 #6, EP08 C4a) */
  B.twoBalls = function (r, cp) {
    var s = pickWhere(function () { return { ts: r.pick([1, 1.5, 2, 2.5, 3]), dv: r.pick([4, 5, 6, 8, 10, 12]), vb: r.int(15, 35), ctx: r.pick(['balls', 'fireworks', 'stones']) }; }, function (z) {
      var h0 = z.ts * z.dv, H = -5 * z.ts * z.ts + z.vb * z.ts; return h0 % 1 === 0 && h0 >= 8 && h0 <= 40 && z.vb - z.dv >= 5 && H > 5 && !(z.ts === 1.5 && z.dv === 10 && z.vb === 20) && !(z.ts === 1.5 && z.dv === 12 && z.vb === 24);
    });
    var h0 = s.ts * s.dv, va = s.vb - s.dv, H = -5 * s.ts * s.ts + s.vb * s.ts;
    var what = { balls: ['one ball is thrown upward from the ground and another from a ' + h0 + ' m balcony', 'balls'], fireworks: ['one firework rises from the ground and another from a ' + h0 + ' m roof', 'fireworks'], stones: ['one stone is tossed upward from a beach and another from the top of a ' + h0 + ' m sea wall', 'stones'] }[s.ctx];
    var ha = '-5t^{2}+' + va + 't+' + h0, hb = '-5t^{2}+' + s.vb + 't';
    var sol = t(hb + '=' + ha) + ': the ' + t('-5t^{2}') + ' terms cancel, so ' + t(s.vb + 't=' + va + 't+' + h0) + ', ' + t(s.dv + 't=' + h0) + ' and ' + t('t=' + dt(s.ts)) + ' s.<br>' + t('h=-5(' + dt(s.ts) + ')^{2}+' + s.vb + '(' + dt(s.ts) + ')=' + dt(H)) + ' m (check with the other: ' + t(dt(-5 * s.ts * s.ts + va * s.ts + h0)) + ' ✓).';
    var tChk = K.number(s.ts, function (v) { return near(v, s.dv / h0) ? { code: cp + 'balls-t', hint: 'Solve ' + t(s.dv + 't=' + h0) + ': divide by ' + t(s.dv) + '.' } : null; }), hChk = K.number(H, null);
    var chk = function (resp) {
      resp = resp || [];
      var a = tChk(resp[0] == null ? '' : resp[0]), b = hChk(resp[1] == null ? '' : resp[1]);
      if (a.v === 'correct' && b.v === 'correct') return ok();
      if (a.v === 'form') return a; if (a.v !== 'correct') return wrong(a.code === 'value' ? cp + 'balls-t' : a.code, '<b>Time:</b> ' + (a.hint || 'Set the two heights equal; the ' + t('t^{2}') + '-terms cancel.'));
      if (b.v === 'form') return b; return wrong(cp + 'balls-h', '<b>Height:</b> substitute ' + t('t=' + dt(s.ts)) + ' into either height equation.');
    };
    var part = { prompt: 'At the same moment, ' + what[0] + '. Their heights in metres after ' + t('t') + ' seconds are ' + t('h=' + hb) + ' and ' + t('h=' + ha) + '. When are the ' + what[1] + ' at the same height, and what is that height?',
      input: { type: 'fields', fields: [{ label: 'Time:', after: 's', name: 'Time' }, { label: 'Height:', after: 'm', name: 'Height' }] },
      check: chk, key: [dt(s.ts), dt(H)], answer: 'after ' + t(dt(s.ts)) + ' s, both ' + t(dt(H)) + ' m high', solution: sol,
      hints: ['Set the two expressions for ' + t('h') + ' equal: the ' + t('-5t^{2}') + ' terms cancel.', 'Solve for ' + t('t') + ', then substitute it into either equation.'], text: 'two thrown objects' };
    part.bad = [[dt(s.ts), dt(H + 5)], [dt(s.dv / h0), dt(H)]];
    return part;
  };

  /* break-even (and the maximum profit) with a linear or quadratic cost (L3 Ex 6, #7, EP03 B3, MC #16) */
  B.breakEven = function (r, cp, opt) {
    opt = opt || {};
    var s = pickWhere(function () { return { A: r.pick([1, 2, 3, 4, 0.5]), x1: r.int(2, 8), x2: r.int(10, 24), m: r.int(4, 14), qc: r.chance(0.5), c2: r.pick([1, 2]) }; }, function (z) {
      var f = z.A * z.x1 * z.x2; return f % 1 === 0 && z.A * (z.x1 + z.x2) % 1 === 0 && (z.x1 + z.x2) % 2 === 0 && f <= 400 && !(z.x1 === 3 && z.x2 === 15) && !(z.x1 === 6 && z.x2 === 50) && !(z.x1 === 2 && z.x2 === 14) && (!z.qc || z.A > z.c2);
    });
    var A = s.A, ra = s.qc ? A - s.c2 : A, f = A * s.x1 * s.x2, bR = s.m + A * (s.x1 + s.x2), Rp = P.add(M([-toFr(ra)[0], toFr(ra)[1]], 'x', 2), M(bR, 'x', 1)), Cp = s.qc ? quad(s.c2, s.m, f) : lin(s.m, f);
    var Pp = P.sub(Rp, Cp), xm = (s.x1 + s.x2) / 2, Pm = at(Pp, xm);
    var RT = P.tex(Rp, { dec: true }), CT = P.tex(Cp);
    var sol = 'Break even: ' + t('R=C') + ': ' + t(RT + '=' + CT) + ', so ' + t('0=' + P.tex(P.neg(Pp), { dec: true })) + (A !== 1 ? ' and ' + t('0=x^{2}-' + (s.x1 + s.x2) + 'x+' + s.x1 * s.x2) : '') + ': ' + t('0=' + facT(1, s.x1, s.x2)) + ', so ' + t('x=' + s.x1) + ' or ' + t('x=' + s.x2) + '.';
    var withP = opt.profit != null ? opt.profit : false;
    var prompt = 'A small business sells ' + t('x') + ' items per week. Its revenue is ' + t('R=' + RT) + ' and its cost is ' + t('C=' + CT) + ', both in dollars. Determine the break-even values of ' + t('x') + (withP ? ', and the maximum profit' : '') + '.';
    if (!withP) {
      var p = KP.valueSet(prompt, [s.x1, s.x2], { v: 'x' }, sol, ['The business breaks even when ' + t('R=C') + ': set the expressions equal.', 'Collect the terms on one side, divide by a common factor, and factor.'], 'break-even');
      p.bad = ['x=' + (-s.x1) + ',\\ x=' + (-s.x2), 'x=' + s.x1];
      return p;
    }
    sol += '<br>Profit: ' + t('P=R-C=' + P.tex(Pp, { dec: true })) + '; its maximum is at the vertex, halfway between the break-even values: ' + t('x=' + dt(xm)) + ', ' + t('P=' + dt(Pm)) + '. The maximum profit is ' + t('\\$' + dt(Pm)) + '.';
    var bChk = K.valueSet([s.x1, s.x2], { v: 'x' }), pChk = K.number(Pm, function (v) { return near(v, xm) ? { code: cp + 'be-profit', hint: 'That is the number of items. The maximum profit is ' + t('P') + ' at that ' + t('x') + '.' } : null; });
    var chk = function (resp) {
      resp = resp || [];
      var a = bChk(resp[0] == null ? '' : resp[0]), b = pChk(resp[1] == null ? '' : resp[1]);
      if (a.v === 'correct' && b.v === 'correct') return ok();
      if (a.v === 'form') return a; if (a.v !== 'correct') return wrong(a.code, '<b>Break-even:</b> ' + (a.hint || 'Set ' + t('R=C') + ' and solve.'));
      if (b.v === 'form') return b; return wrong(cp + 'be-profit', '<b>Profit:</b> ' + (b.hint || t('P=R-C') + ' is a parabola that opens down: find its vertex.'));
    };
    var part = { prompt: prompt, input: { type: 'fields', fields: [{ label: 'Break-even:', mode: 'math', keys: 'solutions', vars: ['x'], name: 'Break-even', placeholder: 'e.g. x = 3, x = 15' }, { label: 'Maximum profit:', before: '$', name: 'Profit' }] },
      check: chk, key: ['x=' + s.x1 + ',\\ x=' + s.x2, dt(Pm)], answer: t('x=' + s.x1) + ' and ' + t('x=' + s.x2) + '; maximum profit ' + t('\\$' + dt(Pm)) + ' (at ' + t('x=' + dt(xm)) + ')', solution: sol,
      hints: ['Break even: ' + t('R=C') + '. Profit: ' + t('P=R-C') + '.', 'The maximum profit is at the vertex of ' + t('P') + ', halfway between the break-even values.'], text: 'break-even and maximum profit' };
    part.bad = [['x=' + s.x1 + ',\\ x=' + s.x2, dt(xm)], ['x=' + (-s.x1) + ',\\ x=' + (-s.x2), dt(Pm)]];
    return part;
  };

  /* a rectangle from its perimeter and diagonal (or area) (L3 #3, EP03 A2) */
  B.rectSys = function (r, cp) {
    var useD = r.chance(0.65), s = pickWhere(function () { var tr = r.pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [6, 8, 10], [9, 12, 15]]); return { tr: tr, g: r.int(1, 3), w: r.int(3, 12), l: r.int(5, 20) }; }, function (z) { return z.tr[2] * z.g <= 40 && !(z.tr[0] === 8 && z.g === 1) && z.l > z.w + 1 && !(z.w === 7 && z.l === 12); });
    var w, l, prompt, sol;
    if (useD) {
      w = s.tr[0] * s.g; l = s.tr[1] * s.g; var d = s.tr[2] * s.g, Pm = 2 * (w + l), half = w + l;
      prompt = 'A rectangle has a perimeter of ' + t(Pm) + ' cm and a diagonal of ' + t(d) + ' cm. Write a system and determine the dimensions of the rectangle.';
      sol = t('2l+2w=' + Pm + '\\Rightarrow l+w=' + half) + '; Pythagoras: ' + t('l^{2}+w^{2}=' + d + '^{2}=' + d * d) + '.<br>' + t('l=' + half + '-w') + ': ' + t('(' + half + '-w)^{2}+w^{2}=' + d * d) + ', so ' + t('2w^{2}-' + 2 * half + 'w+' + (half * half - d * d) + '=0') + ', ' + t('w^{2}-' + half + 'w+' + (half * half - d * d) / 2 + '=0') + ', ' + t('(w-' + w + ')(w-' + l + ')=0') + '.<br>The rectangle is ' + t(w) + ' cm by ' + t(l) + ' cm.';
    } else {
      w = s.w; l = s.l; var Ar = w * l, Pr = 2 * (w + l);
      prompt = 'A rectangular rug has an area of ' + t(Ar) + ' dm² and a perimeter of ' + t(Pr) + ' dm. Write a system and determine its dimensions.';
      sol = t('l+w=' + (w + l)) + ' and ' + t('lw=' + Ar) + '. ' + t('w(' + (w + l) + '-w)=' + Ar) + ', so ' + t('w^{2}-' + (w + l) + 'w+' + Ar + '=0') + ' and ' + t('(w-' + w + ')(w-' + l + ')=0') + '.<br>The rug is ' + t(w) + ' dm by ' + t(l) + ' dm.';
    }
    var p = KP.valueSet(prompt + ' Type both dimensions, e.g. ' + t('8,\\ 15') + '.', [w, l], { v: 'w' }, sol, ['Use two variables, ' + t('l') + ' and ' + t('w') + '. One equation from the perimeter, one from the ' + (useD ? 'diagonal (Pythagoras)' : 'area') + '.', 'Solve the linear one for ' + t('l') + ' and substitute.'], 'a rectangle from a system');
    p.key = w + ',\\ ' + l; p.answer = t(w) + ' by ' + t(l); p.bad = [String(w), w + ',\\ ' + (l + 1)];
    return p;
  };

  /* h = −5(t − p)² + q from two data points (L3 Ex 8, #12, EP03 B4) */
  B.pqModel = function (r, cp) {
    var s = pickWhere(function () { return { p: r.pick([2, 2.5, 3, 3.5, 4, 1.5]), t1: r.int(1, 2), gap: r.int(2, 4), h1: r.int(20, 55) }; }, function (z) {
      var q = z.h1 + 5 * (z.t1 - z.p) * (z.t1 - z.p), t2 = z.t1 + z.gap, h2 = q - 5 * (t2 - z.p) * (t2 - z.p), h0 = q - 5 * z.p * z.p;
      return h2 > 3 && h0 > 0 && Math.abs(h2 - z.h1) > 0.1 && z.p !== z.t1 && z.p !== z.t1 + z.gap && !(z.p === 3 && z.h1 === 30) && !(z.p === 2.5 && z.h1 === 35) && !(z.p === 3 && z.h1 === 55);
    });
    var q = s.h1 + 5 * (s.t1 - s.p) * (s.t1 - s.p), t2 = s.t1 + s.gap, h2 = q - 5 * (t2 - s.p) * (t2 - s.p);
    var lhs = 5 * (t2 * t2 - s.t1 * s.t1), lin1 = -10 * (t2 - s.t1);   // h2 − h1 = −5(t2 − p)² + 5(t1 − p)² = −5(t2² − t1²) + 10p(t2 − t1)
    var sol = t(dt(s.h1) + '=-5(' + s.t1 + '-p)^{2}+q') + ' and ' + t(dt(h2) + '=-5(' + t2 + '-p)^{2}+q') + '.<br>Subtract the first from the second (the ' + t('p^{2}') + '- and ' + t('q') + '-terms cancel): ' + t(dt(h2 - s.h1) + '=' + (-lhs) + '+' + (-lin1) + 'p') + ', so ' + t('p=' + dt(s.p)) + '.<br>' + t('q=' + dt(s.h1) + '+5(' + s.t1 + '-' + dt(s.p) + ')^{2}=' + dt(q)) + '.';
    var pChk = K.number(s.p, null), qChk = K.number(q, function (v) { return near(v, s.h1 - 5 * (s.t1 - s.p) * (s.t1 - s.p)) ? { code: cp + 'pq-q', hint: 'Solve for ' + t('q') + ': ' + t('q=h+5(t-p)^{2}') + ' (add, don’t subtract).' } : null; });
    var chk = function (resp) {
      resp = resp || [];
      var a = pChk(resp[0] == null ? '' : resp[0]), b = qChk(resp[1] == null ? '' : resp[1]);
      if (a.v === 'correct' && b.v === 'correct') return ok();
      if (a.v === 'form') return a; if (a.v !== 'correct') return wrong('value', '<b>p:</b> write both equations and subtract them: the ' + t('p^{2}') + ' and ' + t('q') + ' terms cancel.');
      if (b.v === 'form') return b; return wrong(cp + 'pq-q', '<b>q:</b> ' + (b.hint || 'substitute ' + t('p') + ' into one of the equations.'));
    };
    var part = { prompt: 'A ball is thrown upward from a roof. Its height in metres after ' + t('t') + ' seconds is ' + t('h=-5(t-p)^{2}+q') + '. After ' + t(s.t1) + ' s it is ' + t(dt(s.h1)) + ' m above the ground, and after ' + t(t2) + ' s it is ' + t(dt(h2)) + ' m above the ground. Write and solve a system to determine ' + t('p') + ' and ' + t('q') + '.',
      input: { type: 'fields', fields: [{ label: t('p='), name: 'p' }, { label: t('q='), name: 'q' }] }, check: chk, key: [dt(s.p), dt(q)], answer: t('p=' + dt(s.p)) + ', ' + t('q=' + dt(q)), solution: sol,
      hints: ['Substitute each data point: you get two equations in ' + t('p') + ' and ' + t('q') + '.', 'Subtract them: ' + t('q') + ' and the ' + t('p^{2}') + ' terms cancel, leaving a linear equation in ' + t('p') + '.'], text: 'a model from two data points' };
    part.bad = [[dt(s.p), dt(s.h1 - 5 * (s.t1 - s.p) * (s.t1 - s.p))], [dt(s.p + 1), dt(q)]];
    return part;
  };

  /* ======================================================================================================
   * RF7 — inequalities in two variables (Lessons 4–5)
   * ====================================================================================================== */
  /* a random linear inequality Ax + By op C: boundary y = (C − Ax)/B */
  function linIneq(r) {
    return pickWhere(function () { var z = { A: nz(r, 1, 5), B: nz(r, 1, 5), x0: r.int(-4, 4), y0: r.int(-4, 4), op: r.pick(['lt', 'le', 'gt', 'ge']) }; z.C = z.A * z.x0 + z.B * z.y0; return z; },
      function (z) { return Math.abs(z.C) <= 12 && ex.gcd(Math.abs(z.A), ex.gcd(Math.abs(z.B), Math.abs(z.C))) === 1 && !(z.A === 2 && z.B === -1 && z.C === 4) && !(z.A === 3 && z.B === 2 && z.C === 6); });
  }
  function linTex(z) { return tx(P.add(M(z.A, 'x', 1), M(z.B, 'y', 1))) + OPS[z.op] + z.C; }
  /* points: is each a solution? (L4 Ex 2, #2, EP04 A2; L5 Ex 1, #1, EP05 A1) — a yes/no grid */
  B.ptsGrid = function (r, cp, opt) {
    opt = opt || {};
    var quadK = opt.kind === 'quad', z, f, show, val;
    if (quadK) {
      z = pickWhere(function () { return { a: r.pick([1, -1, 2, -2]), b: r.int(-5, 5), c: r.int(-6, 6), op: r.pick(['lt', 'le', 'gt', 'ge']) }; }, function (q) { return !(q.a === 2 && q.b === -5 && q.c === 1); });
      var Qp = quad(z.a, z.b, z.c); f = function (x, y) { return y - at(Qp, x); }; show = 'y' + OPS[z.op] + tx(Qp);
      val = function (x) { return at(Qp, x); };
    } else {
      z = linIneq(r); f = function (x, y) { return z.A * x + z.B * y - z.C; }; show = linTex(z);
    }
    var pts = pickWhere(function () {
      var out = [], bx = quadK ? r.int(-4, 4) : z.x0, by = quadK ? val(bx) : z.y0;
      if (Math.abs(by) > 12) return null;
      out.push([bx, by]);
      for (var i = 0; i < 3; i++) { var x = r.int(-4, 5), y = quadK ? val(x) + nz(r, 1, 6) : r.int(-6, 6); out.push([x, y]); }
      return out;
    }, function (L) {
      if (!L) return false;
      var keys = L.map(function (p) { return p[0] + ',' + p[1]; }); if (keys.some(function (k, i) { return keys.indexOf(k) !== i; })) return false;
      var rest = L.slice(1); if (rest.some(function (p) { return Math.abs(f(p[0], p[1])) < 1e-9 || Math.abs(p[1]) > 14; })) return false;
      var yes = rest.filter(function (p) { return holds(f(p[0], p[1]), z.op); }).length; return yes >= 1 && yes <= 2;
    });
    var order = r.shuffle(pts.map(function (p, i) { return { p: p, i: i }; })), want = {}, rows = [], lines = [];
    order.forEach(function (o, j) {
      var id = 'p' + j, v = f(o.p[0], o.p[1]), yes = holds(v, z.op); want[id] = yes ? 'y' : 'n';
      rows.push({ id: id, html: t(ptT(o.p[0], o.p[1])) });
      var lhs = quadK ? t(vt(o.p[1]) + OPS[z.op] + vt(val(o.p[0]))) : t(vt(z.A * o.p[0] + z.B * o.p[1]) + OPS[z.op] + z.C);
      lines.push(t(ptT(o.p[0], o.p[1])) + ': ' + lhs + (yes ? ' is true: a solution' : ' is false: not a solution') + (o.i === 0 ? ' (it is on the boundary, ' + (strictOp(z.op) ? 'which is dashed' : 'which is solid and included') + ')' : '') + '.');
    });
    var bId = 'p' + order.findIndex(function (o) { return o.i === 0; });
    var p = KP.grid('Determine whether each point is a solution of ' + t(show) + '.', rows, [{ id: 'y', html: 'Solution' }, { id: 'n', html: 'Not a solution' }], want,
      { why: function (row) { if (row === bId) return { code: cp + 'pt-boundary', hint: 'One point is on the boundary (both sides are equal). ' + (strictOp(z.op) ? t(OPS[z.op].trim()) + ' does not include the boundary.' : t(OPS[z.op].trim()) + ' includes the boundary.') }; return { code: cp + 'pt-row', hint: 'Substitute each point into the inequality and check whether the statement is true.' }; } },
      lines.join('<br>'), ['Substitute the ' + t('x') + '- and ' + t('y') + '-values of each point into the inequality.', 'A point that makes both sides equal is on the boundary: it is a solution only for ' + t('\\le') + ' or ' + t('\\ge') + '.'], 'points in a solution region');
    var flip = {}; Object.keys(want).forEach(function (k) { flip[k] = want[k]; }); flip[bId] = want[bId] === 'y' ? 'n' : 'y';
    var flip2 = {}; Object.keys(want).forEach(function (k) { flip2[k] = want[k] === 'y' ? 'n' : 'y'; });
    p.bad = [flip, flip2];
    return p;
  };

  /* an inequality that must be rearranged (often dividing by a negative): boundary solid or dashed, shade above or below
     (L4 Ex 5 shortcut, #6, EP04 A3, MC #14; L5 Ex 4, #2, #5, EP05 A2, MC #14) — multiple choice */
  B.bdMC = function (r, cp, opt) {
    opt = opt || {};
    var quadK = opt.kind === 'quad', show, op2, sol, revd, yForm;
    if (!quadK) {
      var z = linIneq(r); show = linTex(z); revd = z.B < 0; op2 = revd ? FLIP[z.op] : z.op;
      yForm = 'y' + OPS[op2] + tx(lin(ex.norm(-z.A, z.B), ex.norm(z.C, z.B)));
      sol = t(coefT(z.B) + 'y' + OPS[z.op] + tx(lin(-z.A, z.C))) + '; divide by ' + t(z.B) + (revd ? ' (negative: <b>reverse</b> the sign)' : '') + ': ' + t(yForm) + '.';
    } else {
      var q = pickWhere(function () { return { a: r.pick([1, -1, 2, -2, 3]), b: r.int(-6, 6), c: r.int(-7, 7), k: r.pick([-1, -2, -3, 2, 3, -1, 1]), u: r.int(-8, 8), op: r.pick(['lt', 'le', 'gt', 'ge']) }; }, function (w) { return !(w.k === 1 && w.u === 0) && !(w.k === -1 && w.a === 1 && w.c === 2); });
      var f = quad(q.a, q.b, q.c), opk = q.k > 0 ? q.op : FLIP[q.op], Lt = q.u ? P.seq([M(q.k, 'y', 1), P.num(q.u)]) : tx(M(q.k, 'y', 1)), Rt = tx(P.add(P.scale(f, q.k), P.num(q.u)));
      if (q.u !== 0 && r.chance(0.5)) Lt = q.u + (q.k > 0 ? '+' : '-') + coefT(Math.abs(q.k)) + 'y';
      show = Lt + OPS[opk] + Rt; op2 = q.op; revd = q.k < 0; yForm = 'y' + OPS[q.op] + tx(f);
      sol = (q.u ? 'Move the ' + t(q.u) + ': ' + t(coefT(q.k) + 'y' + OPS[opk] + tx(P.scale(f, q.k))) + '. ' : '') + (q.k !== 1 ? 'Divide by ' + t(q.k) + (revd ? ' (negative: <b>reverse</b> the sign)' : '') + ': ' : '') + t(yForm) + '.';
    }
    var solid = !strictOp(op2), above = upOp(op2);
    sol += '<br>' + (solid ? 'Solid' : 'Dashed') + ' boundary (' + t(OPS[op2].trim()) + '), and with ' + t('y') + ' alone on the left, ' + t(OPS[op2].trim()) + ' means the region <b>' + (above ? 'above' : 'below') + '</b> the ' + (quadK ? 'parabola' : 'line') + '.';
    var opts = [[true, true], [true, false], [false, true], [false, false]].map(function (o) {
      var right = o[0] === solid && o[1] === above, why = null;
      if (!right) why = o[1] !== above ? (revd ? 'Dividing (or multiplying) by a negative number reverses the inequality sign. ' : 'Solve for ' + t('y') + ' first: ' + t('>') + ' or ' + t('\\ge') + ' means above, ' + t('<') + ' or ' + t('\\le') + ' below. ') + 'Here ' + t(yForm) + '.' : t('\\le') + ' and ' + t('\\ge') + ' give a solid boundary; ' + t('<') + ' and ' + t('>') + ' a dashed one.';
      return { html: (o[0] ? 'Solid' : 'Dashed') + ' boundary; the region ' + (o[1] ? 'above' : 'below') + ' it', right: right, why: why, code: (o[0] ? 's' : 'd') + (o[1] ? 'a' : 'b') };
    });
    return KP.mc(r, 'The inequality ' + t(show) + ' is graphed. Which describes its graph?', opts, sol, ['Solve for ' + t('y') + '. Dividing by a negative reverses the sign.', 'Solid for ' + t('\\le') + ', ' + t('\\ge') + '; dashed for ' + t('<') + ', ' + t('>') + '. With ' + t('y') + ' alone on the left, ' + t('>') + ' means above.'], 'boundary and side', true);
  };

  /* which graph shows the inequality (L4 Ex 4–5, #3–4; L5 Ex 2–3, #3–4, L8 #9) — four graphs */
  B.whichGraph = function (r, cp, opt) {
    opt = opt || {};
    var quadK = opt.kind === 'quad', f, show, op, sol, win = { x: [-6, 6], y: [-6, 6] };
    if (!quadK) {
      var z = linIneq(r); op = z.B > 0 ? z.op : FLIP[z.op];
      var mm = -z.A / z.B, bb = z.C / z.B; f = function (x) { return mm * x + bb; };
      show = r.chance(0.5) ? linTex(z) : 'y' + OPS[op] + tx(lin(ex.norm(-z.A, z.B), ex.norm(z.C, z.B)));
      sol = (show.indexOf('y' + OPS[op]) === 0 ? '' : 'Solve for ' + t('y') + ': ' + t('y' + OPS[op] + tx(lin(ex.norm(-z.A, z.B), ex.norm(z.C, z.B)))) + (z.B < 0 ? ' (dividing by ' + t(z.B) + ' reverses the sign)' : '') + '. ') + 'The boundary has slope ' + t(vt(mm)) + ' and ' + t('y') + '-intercept ' + t(vt(bb)) + '.';
      if (Math.abs(bb) > 5) win.y = [Math.min(-6, Math.floor(bb) - 2), Math.max(6, Math.ceil(bb) + 2)];
    } else {
      var q = pickWhere(function () { return { a: r.pick([1, -1, 1, -1, 2, -2]), r1: r.int(-5, 3), w: r.int(2, 6), vform: r.chance(0.35), op: r.pick(['lt', 'le', 'gt', 'ge']) }; }, function (w) { var h = w.r1 + w.w / 2, v = -w.a * w.w * w.w / 4; return w.r1 + w.w <= 5 && Math.abs(v) <= 9 && Math.abs(w.a * w.r1 * (w.r1 + w.w)) <= 12 && (!w.vform || w.w % 2 === 0) && !(w.a === 1 && w.r1 === 1 && w.w === 4); });
      var r2 = q.r1 + q.w, Qp = P.scale(P.mul(lin(1, -q.r1), lin(1, -r2)), q.a), h = q.r1 + q.w / 2, vy = at(Qp, h); op = q.op;
      f = function (x) { return at(Qp, x); };
      show = 'y' + OPS[op] + (q.vform ? coefT(q.a) + (h ? br(lin(1, -h)) : 'x') + '^{2}' + (vy ? (vy > 0 ? '+' : '') + vt(vy) : '') : tx(Qp));
      sol = 'The boundary ' + t('y=' + tx(Qp)) + ' has ' + t('x') + '-intercepts ' + t(q.r1) + ' and ' + t(r2) + ' and vertex ' + t(ptT(h, vy)) + '.';
      win.y = [Math.min(-4, 2 * Math.floor((vy - 2) / 2)), Math.max(4, 2 * Math.ceil((vy + 2) / 2))];
      if (win.y[1] - win.y[0] > 22) win.y = [Math.max(win.y[0], -11), Math.min(win.y[1], 11)];
    }
    var solid = !strictOp(op), above = upOp(op);
    sol += ' It is ' + (solid ? 'solid' : 'dashed') + ' (' + t(OPS[op].trim()) + '), and the region is ' + (above ? 'above' : 'below') + ' it. ';
    var tp = Math.abs(f(0)) > 1e-9 ? [0, 0] : [0, f(0) + (above ? 1 : -1)];
    sol += 'Check with ' + t(ptT(tp[0], tp[1])) + ': ' + t(vt(tp[1]) + OPS[op] + vt(f(tp[0]))) + ' is ' + (holds(tp[1] - f(tp[0]), op) ? 'true, so that side is shaded.' : 'false, so the other side is shaded.');
    var opts = [[solid, above], [solid, !above], [!solid, above], [!solid, !above]].map(function (o, i) {
      var svg = regionSvg({ x: win.x, y: win.y, max: 200, curves: [{ f: f, dash: !o[0] }], shade: { f: f, side: o[1] ? 'above' : 'below' }, aria: (o[0] ? 'solid' : 'dashed') + ' boundary, shaded ' + (o[1] ? 'above' : 'below') });
      return { html: svg, right: i === 0, code: i === 0 ? 'right' : i === 1 ? 'side' : i === 2 ? 'line' : 'both', why: i === 0 ? null : (o[1] !== above ? 'Wrong side: test a point such as ' + t(ptT(tp[0], tp[1])) + ' in the inequality. ' : '') + (o[0] !== solid ? (solid ? t('\\le') + ' or ' + t('\\ge') + ': the boundary is solid.' : t('<') + ' or ' + t('>') + ': the boundary is dashed.') : '') };
    });
    var p = KP.mc(r, 'Which graph shows the solution region of ' + t(show) + '?', opts, sol, ['Graph the boundary by replacing the sign with ' + t('=') + '. Solid for ' + t('\\le') + ', ' + t('\\ge') + '; dashed for ' + t('<') + ', ' + t('>') + '.', 'Test a point that is not on the boundary: shade its side if it makes the inequality true.'], 'which graph');
    p.input.columns = 2;
    return p;
  };

  /* write the linear inequality whose region is shown (L4 Ex 7, #7, #8, EP04 B1–B2, L8 #8) */
  B.writeLin = function (r, cp, opt) {
    opt = opt || {};
    var wordsK = opt.words != null ? opt.words : r.chance(0.3), s, m, b, op, prompt, sol, pts;
    if (wordsK) {
      s = pickWhere(function () { return { a: nz(r, 1, 6), bb: nz(r, 1, 6), solid: r.chance(0.5), org: r.chance(0.5) }; }, function (z) { return z.a !== z.bb && !(z.a === -4 && z.bb === 6); });
      m = ex.norm(-s.bb, s.a); b = s.bb;
      var originBelow = b > 0, regionAbove = s.org ? !originBelow : originBelow; op = s.solid ? (regionAbove ? 'ge' : 'le') : (regionAbove ? 'gt' : 'lt');
      prompt = 'The boundary of a solution region is a ' + (s.solid ? 'solid' : 'dashed') + ' line with ' + t('x') + '-intercept ' + t(s.a) + ' and ' + t('y') + '-intercept ' + t(s.bb) + ', and the region ' + (s.org ? 'contains' : 'does <b>not</b> contain') + ' the origin. Write the inequality.';
      sol = 'Slope ' + t('\\dfrac{' + s.bb + '-0}{0-' + par(s.a) + '}=' + fr(m[0], m[1])) + ': the line is ' + t('y=' + tx(lin(m, b))) + '. The origin is ' + (originBelow ? 'below' : 'above') + ' the line (' + t('0' + (originBelow ? '<' : '>') + b) + '), so the region is ' + (regionAbove ? 'above' : 'below') + ' it: ' + t('y' + OPS[op] + tx(lin(m, b))) + '.';
      pts = [[s.a, 0], [0, s.bb]];
    } else {
      s = pickWhere(function () { var q = r.pick([1, 1, 2, 3]); return { p: nz(r, 1, 4), q: q, b: r.int(-4, 4), op: r.pick(['lt', 'le', 'gt', 'ge']) }; }, function (z) { return ex.gcd(Math.abs(z.p), z.q) === 1 && Math.abs(z.b + z.p) <= 5 && !(z.p === 2 && z.q === 3 && z.b === -1) && !(z.p === 2 && z.q === 1 && z.b === -3); });
      m = ex.norm(s.p, s.q); b = s.b; op = s.op; pts = [[0, b], [s.q, b + s.p]];
      var fx = function (x) { return rv(m) * x + b; };
      var svg = regionSvg({ x: [-6, 6], y: [-6, 6], max: 260, curves: [{ f: fx, dash: strictOp(op) }], shade: { f: fx, side: upOp(op) ? 'above' : 'below' }, points: pts.map(function (q) { return { x: q[0], y: q[1] }; }), aria: 'a shaded region bounded by a line' });
      prompt = 'The boundary passes through ' + t(ptT(pts[0][0], pts[0][1])) + ' and ' + t(ptT(pts[1][0], pts[1][1])) + '. Write the inequality whose solution region is shown.' + fig(svg);
      sol = 'Slope ' + t('\\dfrac{' + (b + s.p) + '-' + par(b) + '}{' + s.q + '-0}=' + fr(m[0], m[1])) + ', ' + t('y') + '-intercept ' + t(b) + ': ' + t('y=' + tx(lin(m, b))) + '.<br>' + (strictOp(op) ? 'Dashed' : 'Solid') + ', shaded ' + (upOp(op) ? 'above' : 'below') + ': ' + t('y' + OPS[op] + tx(lin(m, b))) + '.';
    }
    var T = P.sub(Y(), lin(m, b)), wr = [];
    if (Math.abs(m[0]) !== Math.abs(m[1])) wr.push({ T: P.sub(Y(), lin(ex.norm(m[1], m[0]), b)), code: cp + 'reg-slope', hint: 'Slope is rise over run: ' + t('m=\\dfrac{\\Delta y}{\\Delta x}') + '.' });
    wr.push({ T: P.sub(Y(), lin(ex.norm(-m[0], m[1]), b)), code: cp + 'reg-bound', hint: 'Check the sign of the slope: the line ' + (rv(m) > 0 ? 'rises' : 'falls') + ' from left to right.' });
    var keyTex = 'y' + OPS[op] + tx(lin(m, b));
    var tq = b !== 0 ? [0, 0] : [0, upOp(op) ? 1 : -1];
    sol += ' Check ' + t(ptT(tq[0], tq[1])) + ': ' + t(vt(tq[1]) + OPS[op] + vt(rv(m) * tq[0] + b)) + ' is ' + (holds(tq[1] - b, op) ? 'true: it is in the region' : 'false: it is not in the region') + ' ✓';
    return ineqPart(cp, prompt, T, op, keyTex, { wrongs: wr, sideHint: 'Right boundary, but the inequality points the wrong way: ' + (wordsK ? 'test the origin.' : 'the shaded region is ' + (upOp(op) ? 'above' : 'below') + ' the line.') }, sol,
      ['Write the equation of the boundary line from its slope and ' + t('y') + '-intercept.', 'Dashed → ' + t('<') + ' or ' + t('>') + '; solid → ' + t('\\le') + ' or ' + t('\\ge') + '. Shaded above → ' + t('y>') + ' (or ' + t('\\ge') + ').'], 'inequality from a graph');
  };

  /* write the quadratic inequality whose region is shown (L5 Ex 6, #7, #8, EP05 B2–B3, L8 #10) */
  B.writeQuad = function (r, cp) {
    var vtxK = r.chance(0.5), s = pickWhere(function () { return { a: r.pick([1, -1, 2, -2, 1, -1]), h: r.int(-3, 3), k: r.int(-6, 6), dx: r.pick([1, 2, -1, -2]), r1: r.int(-5, 2), w: r.int(2, 6), op: r.pick(['lt', 'le', 'gt', 'ge']) }; }, function (z) {
      if (vtxK) return Math.abs(z.k + z.a * z.dx * z.dx) <= 9 && z.k !== 0 && Math.abs(z.k) >= 2 && Math.abs(z.k + z.a * z.h * z.h) <= 12 && !(z.h === 2 && z.k === -3 && z.a === 1);
      var r2 = z.r1 + z.w; return r2 <= 5 && z.r1 !== 0 && r2 !== 0 && Math.abs(z.a * z.r1 * r2) <= 10 && Math.abs(z.a * z.w * z.w / 4) <= 9 && !(z.r1 === -3 && r2 === 1 && z.a === -2) && !(z.r1 === -1 && r2 === 5);
    });
    var Qp, info, sol;
    if (vtxK) {
      Qp = P.add(P.scale(P.pow(lin(1, -s.h), 2), s.a), P.num(s.k)); var px = s.h + s.dx, py = at(Qp, px);
      info = 'The boundary has vertex ' + t(ptT(s.h, s.k)) + ' and passes through ' + t(ptT(px, py)) + '.';
      sol = t('y=a' + br(lin(1, -s.h)) + '^{2}' + (s.k > 0 ? '+' : '') + s.k) + '; at ' + t(ptT(px, py)) + ': ' + t(py + '=a(' + s.dx + ')^{2}' + (s.k > 0 ? '+' : '') + s.k) + ', so ' + t('a=' + s.a) + '.<br>' + t('y=' + coefT(s.a) + br(lin(1, -s.h)) + '^{2}' + (s.k > 0 ? '+' : '') + s.k + '=' + tx(Qp)) + '.';
      var Q1 = P.add(P.pow(lin(1, -s.h), 2), P.num(s.k));
      var wrA = s.a !== 1 ? [{ T: P.sub(Y(), Q1), code: cp + 'reg-a', hint: 'Substitute the other point to find ' + t('a') + ': it is not ' + t('1') + '.' }] : [];
    } else {
      var r2 = s.r1 + s.w; Qp = P.scale(P.mul(lin(1, -s.r1), lin(1, -r2)), s.a); var yi = at(Qp, 0);
      info = 'The boundary has ' + t('x') + '-intercepts ' + t(s.r1) + ' and ' + t(r2) + ' and ' + t('y') + '-intercept ' + t(yi) + '.';
      sol = t('y=a' + facT(1, s.r1, r2)) + '; at ' + t(ptT(0, yi)) + ': ' + t(yi + '=a(' + (-s.r1) + ')(' + (-r2) + ')') + ', so ' + t('a=' + s.a) + '.<br>' + t('y=' + tx(Qp)) + '.';
      wrA = s.a !== 1 ? [{ T: P.sub(Y(), P.mul(lin(1, -s.r1), lin(1, -r2))), code: cp + 'reg-a', hint: 'Substitute the ' + t('y') + '-intercept to find ' + t('a') + ': it is not ' + t('1') + '.' }] : [];
    }
    var f = function (x) { return at(Qp, x); }, lo = -11, hi = 11, ext = [f(-6), f(6), f(0), vtxK ? s.k : f(s.r1 + s.w / 2)];
    lo = Math.max(-12, 2 * Math.floor((Math.min.apply(null, ext.concat([-2])) - 1) / 2)); hi = Math.min(12, 2 * Math.ceil((Math.max.apply(null, ext.concat([2])) + 1) / 2));
    lo = Math.max(lo, (vtxK ? s.k : f(s.r1 + s.w / 2)) - 12); hi = Math.min(hi, (vtxK ? s.k : f(s.r1 + s.w / 2)) + 12); lo = 2 * Math.floor(lo / 2); hi = 2 * Math.ceil(hi / 2);
    var svg = regionSvg({ x: [-6, 6], y: [lo, hi], max: 260, unit: 300 / Math.max(12, hi - lo) > 22 ? 22 : undefined, curves: [{ f: f, dash: strictOp(s.op) }], shade: { f: f, side: upOp(s.op) ? 'above' : 'below' }, aria: 'a region bounded by a parabola' });
    sol += '<br>' + (strictOp(s.op) ? 'Dashed' : 'Solid') + ', shaded ' + (upOp(s.op) ? 'above' : 'below') + ': ' + t('y' + OPS[s.op] + tx(Qp)) + '.';
    return ineqPart(cp, info + ' Write the inequality whose solution region is shown, in general form.' + fig(svg), P.sub(Y(), Qp), s.op, 'y' + OPS[s.op] + tx(Qp), { wrongs: wrA, general: true, ph: 'y <= x^2 - 4x + 1', example: 'y\\le x^{2}-4x+1', sideHint: 'Right boundary, but the inequality points the wrong way: the shaded region is ' + (upOp(s.op) ? 'above' : 'below') + ' the parabola.' }, sol,
      ['Write the boundary as ' + (vtxK ? t('y=a(x-p)^{2}+q') : t('y=a(x-r)(x-s)')) + ' and substitute the other point to find ' + t('a') + '.', 'Dashed → ' + t('<') + ' or ' + t('>') + '; solid → ' + t('\\le') + ' or ' + t('\\ge') + '. Shaded above → ' + t('y>') + '. Expand to general form.'], 'quadratic inequality from a graph');
  };

  /* a ticket / budget context with whole numbers (L4 Ex 7, #10, EP04 B3, L8 #11) */
  B.ticketsCtx = function (r, cp) {
    var least = r.chance(0.5), s = pickWhere(function () { return { pa: r.pick([12, 15, 16, 18, 20, 24, 8]), ps: r.pick([5, 6, 8, 10, 3, 4]), tot: r.pick([600, 720, 900, 1000, 1200, 1500, 240, 300, 480]), nA: r.int(10, 60) }; }, function (z) {
      var rest = z.tot - z.pa * z.nA; return z.pa > z.ps && rest > z.ps * 3 && rest / z.ps <= 200 && rest % z.ps !== 0 && !(z.pa === 15 && z.ps === 10 && z.tot === 1500 && z.nA === 40);
    });
    var rest = s.tot - s.pa * s.nA, q = rest / s.ps, ans = least ? Math.ceil(q) : Math.floor(q), other = least ? Math.floor(q) : Math.ceil(q), prompt, sol, ineq;
    if (least) {
      prompt = 'A school play sells adult tickets for ' + t('\\$' + s.pa) + ' and student tickets for ' + t('\\$' + s.ps) + '. It must take in at least ' + t('\\$' + s.tot) + '. Let ' + t('a') + ' be the number of adult tickets and ' + t('s') + ' the number of student tickets. If ' + t(s.nA) + ' adult tickets are sold, what is the least number of student tickets needed?';
      ineq = s.pa + 'a+' + s.ps + 's\\ge ' + s.tot; sol = t(ineq) + ', ' + t('a\\ge 0') + ', ' + t('s\\ge 0') + ', whole numbers.<br>' + t(s.pa + '(' + s.nA + ')+' + s.ps + 's\\ge ' + s.tot) + ', so ' + t(s.ps + 's\\ge ' + rest) + ' and ' + t('s\\ge ' + dt(Math.round(q * 1000) / 1000)) + '. Tickets are whole numbers: at least <b>' + ans + '</b> student tickets.';
    } else {
      prompt = 'A club has at most ' + t('\\$' + s.tot) + ' for a party. Pizzas cost ' + t('\\$' + s.pa) + ' each and veggie trays ' + t('\\$' + s.ps) + ' each. Let ' + t('p') + ' be the number of pizzas and ' + t('v') + ' the number of trays. If the club buys ' + t(s.nA) + ' pizzas, what is the greatest number of trays it can buy?';
      ineq = s.pa + 'p+' + s.ps + 'v\\le ' + s.tot; sol = t(ineq) + ', ' + t('p\\ge 0') + ', ' + t('v\\ge 0') + ', whole numbers.<br>' + t(s.pa + '(' + s.nA + ')+' + s.ps + 'v\\le ' + s.tot) + ', so ' + t(s.ps + 'v\\le ' + rest) + ' and ' + t('v\\le ' + dt(Math.round(q * 1000) / 1000)) + '. Trays are whole numbers: at most <b>' + ans + '</b> trays.';
    }
    var p = KP.number(prompt, ans, function (v) { if (v === other) return { code: cp + 'ctx-round', hint: least ? 'With ' + t(other) + ' the total is less than ' + t('\\$' + s.tot) + ': round <b>up</b> to the next whole number.' : 'With ' + t(other) + ' the total is more than ' + t('\\$' + s.tot) + ': round <b>down</b>.' }; return null; }, sol,
      ['Write the inequality, then substitute the known number.', 'Solve for the other variable. It must be a whole number: decide whether to round up or down.'], 'an inequality in context');
    p.bad = [String(other), dt(Math.round(q * 100) / 100)];
    return p;
  };

  /* a system of two linear inequalities in context: its corner (L4 Ex 8, #11, EP04 C2) */
  B.cornerCtx = function (r, cp) {
    var kind = r.pick(['tutor', 'class']), s, prompt, sol, ans, other;
    if (kind === 'tutor') {
      s = pickWhere(function () { return { p: r.pick([20, 22, 24, 25, 18]), q: r.pick([12, 14, 15, 16]), H: r.pick([20, 24, 25, 30, 18]), xs: r.int(3, 14) }; }, function (z) { return z.p > z.q && z.xs < z.H - 2 && !(z.p === 20 && z.q === 15 && z.H === 20 && z.xs === 6); });
      var T = s.p * s.xs + s.q * (s.H - s.xs); ans = s.xs; other = s.H - s.xs;
      prompt = 'Jordan earns ' + t('\\$' + s.p) + ' per hour tutoring (' + t('x') + ' hours) and ' + t('\\$' + s.q) + ' per hour lifeguarding (' + t('y') + ' hours). He can work at most ' + t(s.H) + ' hours a week and wants to earn at least ' + t('\\$' + T) + '. What is the least number of hours he can tutor and still meet both conditions?';
      sol = t('x+y\\le ' + s.H) + ', ' + t(s.p + 'x+' + s.q + 'y\\ge ' + T) + ', ' + t('x\\ge 0') + ', ' + t('y\\ge 0') + '.<br>The fewest tutoring hours is at the corner where the boundaries meet: ' + t(s.p + 'x+' + s.q + '(' + s.H + '-x)=' + T) + ', so ' + t((s.p - s.q) + 'x=' + (T - s.q * s.H)) + ', ' + t('x=' + s.xs) + ' (with ' + t('y=' + other) + ').<br>He must tutor at least <b>' + ans + '</b> hours.';
    } else {
      s = pickWhere(function () { return { pm: r.pick([6, 8, 9, 10]), pd: r.pick([12, 14, 15, 16]), H: r.pick([30, 36, 40, 45, 50]), ms: r.int(10, 35) }; }, function (z) { return z.pd > z.pm && z.ms < z.H - 4 && !(z.pm === 8 && z.pd === 12 && z.H === 40 && z.ms === 30); });
      var Tt = s.pm * s.ms + s.pd * (s.H - s.ms); ans = s.ms; other = s.H - s.ms;
      prompt = 'A fitness class has room for at most ' + t(s.H) + ' people. Members pay ' + t('\\$' + s.pm) + ' and drop-ins pay ' + t('\\$' + s.pd) + ', and the instructor needs at least ' + t('\\$' + Tt) + ' per class. Let ' + t('m') + ' be the number of members and ' + t('d') + ' the number of drop-ins. What is the greatest number of members the class can have?';
      sol = t('m+d\\le ' + s.H) + ', ' + t(s.pm + 'm+' + s.pd + 'd\\ge ' + Tt) + ', ' + t('m\\ge 0') + ', ' + t('d\\ge 0') + '.<br>The most members is at the corner where the boundaries meet: ' + t(s.pm + 'm+' + s.pd + '(' + s.H + '-m)=' + Tt) + ', so ' + t((s.pd - s.pm) + 'm=' + (s.pd * s.H - Tt)) + ', ' + t('m=' + s.ms) + ' (with ' + t('d=' + other) + ').<br>At most <b>' + ans + '</b> members.';
    }
    var p = KP.number(prompt, ans, function (v) { return v === other ? { code: cp + 'ctx-corner', hint: 'That is the other variable at the corner. The question asks for ' + (kind === 'tutor' ? 'the tutoring hours' : 'the number of members') + '.' } : null; }, sol,
      ['Write one inequality for each condition, with the restrictions.', 'The extreme value is at a corner of the region: solve the two boundary equations together.'], 'a corner of a region');
    p.bad = [String(other), String(ans + 1)];
    return p;
  };

  /* a parabolic arch: the tallest centred load (L5 Ex 8, #10, EP05 B4) — 'given' (the equation) or 'build' (width and height) */
  B.archLoad = function (r, cp, opt) {
    opt = opt || {};
    var build = opt.mode ? opt.mode === 'build' : r.chance(0.5);
    var s = pickWhere(function () { return { W: r.pick([8, 10, 12, 16]), H: r.int(4, 9), w: r.pick([2, 3, 4, 5, 6, 8]) }; }, function (z) { return z.w < z.W - 1 && !(z.W === 8 && z.H === 6 && z.w === 4) && !(z.W === 10 && z.H === 5 && z.w === 6); });
    var half = s.W / 2, a = s.H / (half * half), hmax = s.H - a * (s.w / 2) * (s.w / 2), hbad = s.H - a * s.w * s.w, af = toFr(a);
    var aT = Math.abs(a * 1000 - Math.round(a * 1000)) < 1e-6 ? dt(a) : fr(af[0], af[1]);
    var eq = 'y=-' + aT + 'x^{2}+' + s.H, prompt, sol;
    if (build) {
      prompt = 'The opening of a tunnel is a parabolic arch ' + t(s.W) + ' m wide at the road and ' + t(s.H) + ' m high in the middle. Put the origin at the centre of the road. How tall can a centred load ' + t(s.w) + ' m wide be, to the nearest hundredth of a metre?';
      sol = 'Vertex ' + t(ptT(0, s.H)) + ': ' + t('y=ax^{2}+' + s.H) + '. At ' + t(ptT(half, 0)) + ': ' + t('0=' + half * half + 'a+' + s.H) + ', so ' + t('a=-' + aT) + ' and ' + t(eq) + '.<br>';
    } else {
      prompt = 'The opening of a tunnel is the parabolic arch ' + t(eq) + ', where ' + t('x') + ' and ' + t('y') + ' are in metres and the origin is at the centre of the road. Points on or under the arch satisfy ' + t(eq.replace('=', '\\le ')) + '. How tall can a centred truck ' + t(s.w) + ' m wide be, to the nearest hundredth of a metre?';
      sol = '';
    }
    sol += 'The top corners of a centred load are at ' + t('x=\\pm ' + dt(s.w / 2)) + '. They must satisfy ' + t(eq.replace('=', '\\le ')) + ': ' + t('y\\le -' + aT + '(' + dt(s.w / 2) + ')^{2}+' + s.H + '=' + dt(Math.round(hmax * 1e6) / 1e6)) + '.<br>The load can be at most about <b>' + K.roundTo(hmax, 2).toFixed(2) + '</b> m tall.';
    var p = KP.approx(prompt, hmax, 2, { diag: function (v) { return Math.abs(v - K.roundTo(hbad, 2)) < 1e-9 ? { code: cp + 'arch-half', hint: 'A centred load ' + t(s.w) + ' m wide reaches only ' + t(dt(s.w / 2)) + ' m to each side of the centre: use ' + t('x=' + dt(s.w / 2)) + '.' } : null; }, after: 'm' }, sol,
      [build ? 'Write the arch as ' + t('y=ax^{2}+q') + ' with its vertex at the top, and use the point where it meets the road to find ' + t('a') + '.' : 'A centred load ' + t(s.w) + ' m wide has its top corners at ' + t('x=\\pm ' + dt(s.w / 2)) + '.', 'Substitute the ' + t('x') + ' of a top corner: the height must be at most the arch’s ' + t('y') + ' there.'], 'a load under an arch');
    p.bad = [K.roundTo(hbad, 2).toFixed(2), String(s.H)];
    return p;
  };

  /* ======================================================================================================
   * RF8 — quadratic inequalities in one variable (Lessons 6–7)
   * ====================================================================================================== */
  function testLine(E, r1, r2, op, v) {
    v = v || 'x';
    var a = rv(r1), b = rv(r2), tps = [Math.floor(a) - 1, near(a, b) ? null : (Math.floor(a) + 1 <= b - 1e-9 && Math.floor(a) + 1 > a + 1e-9 ? Math.floor(a) + 1 : (a + b) / 2), Math.ceil(b) + 1].filter(function (x) { return x != null; });
    return 'Test ' + tps.map(function (x) { var val = at(E, x); return t(v + '=' + vt(x)) + ': ' + t(vt(val)) + (holds(val, op) ? ' ✓' : ' ✗'); }).join('; ') + '.';
  }
  /* from the graph of the parabola (L6 Ex 1–2, #1–2, EP06 A1) */
  B.graph1 = function (r, cp) {
    var s = pickWhere(function () { return { a: r.pick([1, -1, 1, -1, 2, -2]), r1: r.int(-5, 2), w: r.int(2, 7), op: r.pick(['lt', 'le', 'gt', 'ge']) }; }, function (z) { var r2 = z.r1 + z.w; return r2 <= 5 && Math.abs(z.a * z.w * z.w / 4) <= 10 && Math.abs(z.a * z.r1 * r2) <= 12 && !(z.a === 1 && z.r1 === -3 && r2 === 4) && !(z.a === 1 && z.r1 === -1 && r2 === 5); });
    var r2 = s.r1 + s.w, Qp = P.scale(P.mul(lin(1, -s.r1), lin(1, -r2)), s.a), f = function (x) { return at(Qp, x); }, vy = f(s.r1 + s.w / 2);
    var lo = 2 * Math.floor((Math.min(vy, -2, f(-6) < vy ? -11 : vy) - 1) / 2), hi = 2 * Math.ceil((Math.max(vy, 2, f(-6) > vy ? 11 : vy) + 1) / 2); lo = Math.max(lo, -12); hi = Math.min(hi, 12);
    var svg = regionSvg({ x: [-6, 6], y: [lo, hi], max: 260, curves: [{ f: f }], aria: 'graph of the parabola' });
    var T = quadSet(s.a, s.r1, r2, s.op), pos = upOp(s.op);
    var sol = 'The ' + t('x') + '-intercepts are ' + t(s.r1) + ' and ' + t(r2) + '. ' + t(tx(Qp) + OPS[s.op] + '0') + ' where the graph is ' + (pos ? 'above' : 'below') + ' the ' + t('x') + '-axis' + (strictOp(s.op) ? '' : ' (or on it)') + ': ' + (s.a > 0 ? (pos ? 'outside' : 'between') : (pos ? 'between' : 'outside')) + ' the intercepts.<br>' + t(setTex(T)) + '.';
    return setPart(cp, 'The graph of ' + t('y=' + tx(Qp)) + ' is shown. Use it to solve ' + t(tx(Qp) + OPS[s.op] + '0') + '.' + fig(svg), T, { sideHint: t('>0') + ' means the graph is <b>above</b> the ' + t('x') + '-axis, ' + t('<0') + ' below it. Read those ' + t('x') + '-values.' }, sol,
      [t(tx(Qp) + OPS[s.op] + '0') + ' asks where the graph is ' + (pos ? 'above' : 'below') + ' the ' + t('x') + '-axis.', 'The ' + t('x') + '-intercepts are the endpoints; ' + (strictOp(s.op) ? 'they are not included.' : 'they are included.')], 'a quadratic inequality from a graph');
  };

  /* solve by roots and test points or sign analysis. mode: 'monic' | 'gcf' | 'dos' | 'dec' | 'rearr' | 'neg' | 'factored'
     (L6 Ex 4–6, #4, #5, EP06 A2, B1, B3; L7 Ex 1, #1–4, EP07 A1–A4; L8 #12–13) */
  B.solve1 = function (r, cp, opt) {
    opt = opt || {};
    var mode = opt.mode || 'monic';
    if (Array.isArray(mode)) mode = r.pick(mode);
    var s, A = 1, r1, r2, E, show, pre = '', rev = false, op = r.pick(['lt', 'le', 'gt', 'ge']), facS;
    if (mode === 'monic' || mode === 'factored' || mode === 'rearr') {
      s = pickWhere(function () { return { a: r.int(-7, 6), b: r.int(-6, 8) }; }, function (z) { return z.a < z.b && !(z.a === 0 && mode !== 'factored') && Math.abs(z.a * z.b) <= 42 && !(z.a === -2 && z.b === 5) && !(z.a === -3 && z.b === 4) && !(z.a === -1 && z.b === 5); });
      r1 = [s.a, 1]; r2 = [s.b, 1]; E = P.mul(lin(1, -s.a), lin(1, -s.b)); show = tx(E) + OPS[op] + '0';
      if (mode === 'factored') show = (r.chance(0.5) ? facT(1, r1, r2) : facT(1, r2, r1)) + OPS[op] + '0';
      if (mode === 'rearr') {
        var bb = -(s.a + s.b), cc = s.a * s.b, st = r.pick(['move', 'prod', 'sq', 'pair']);
        if (st === 'move') { var keep = r.int(-4, 4); show = 'x^{2}' + (keep ? (keep > 0 ? '+' : '') + coefT(keep) + 'x' : '') + OPS[op] + tx(lin(keep - bb, -cc)); }
        else if (st === 'prod') show = 'x' + br(lin(1, bb)) + OPS[op] + vt(-cc);
        else if (st === 'sq') { var u = r.int(-4, 4) || 2; show = br(lin(1, u)) + '^{2}' + OPS[op] + tx(lin(2 * u - bb, u * u - cc)); }
        else { var u2 = r.int(-5, 5), v2 = bb - u2; show = facT(1, -u2, -v2) + OPS[op] + vt(u2 * v2 - cc); if (u2 * v2 - cc === 0) show = br(lin(1, u2)) + br(lin(1, v2)) + OPS[op] + '0'; }
        pre = 'Rearrange so one side is ' + t('0') + ': ' + t(tx(E) + OPS[op] + '0') + '.<br>';
      }
      facS = facT(1, r1, r2);
    } else if (mode === 'gcf') {
      s = pickWhere(function () { return { k: r.pick([1, 2, 3, 4, 5]), n: nz(r, 2, 9) }; }, function (z) { return !(z.k === 1 && z.n === 9) && !(z.k === 3 && z.n === 4); });
      E = P.scale(P.mul(M(1, 'x', 1), lin(1, -s.n)), s.k); r1 = [Math.min(0, s.n), 1]; r2 = [Math.max(0, s.n), 1]; A = s.k; show = tx(E) + OPS[op] + '0'; facS = coefT(s.k) + 'x' + br(lin(1, -s.n));
    } else if (mode === 'dos') {
      s = pickWhere(function () { return { m: r.pick([1, 2, 3, 4, 5]), n: r.int(1, 9) }; }, function (z) { return ex.gcd(z.m, z.n) === 1 && !(z.m === 2 && z.n === 5) && !(z.m === 1 && z.n === 4); });
      E = P.sub(M(s.m * s.m, 'x', 2), P.num(s.n * s.n)); A = s.m * s.m; r1 = [-s.n, s.m]; r2 = [s.n, s.m]; show = tx(E) + OPS[op] + '0'; facS = facT(A, r1, r2);
      if (r.chance(0.35)) { show = 'x^{2}' + OPS[op] + vt(s.n * s.n / (s.m * s.m)); E = P.sub(M(1, 'x', 2), P.num(R([s.n * s.n, s.m * s.m]))); A = 1; facS = facT(1, r1, r2); pre = 'Rearrange: ' + t(tx(E) + OPS[op] + '0') + ' (do not just take the square root: the negative side matters).<br>'; }
    } else if (mode === 'dec') {
      s = pickWhere(function () { var a = r.pick([2, 3, 5, 6, 4]); return { a: a, p: nz(r, 1, 9), q: r.pick([2, 3, 5, 1]), r2: r.int(-6, 6) }; }, function (z) { return z.a % z.q === 0 && z.q > 1 && z.p % z.q !== 0 && ex.gcd(Math.abs(z.p), z.q) === 1 && !near(z.p / z.q, z.r2) && Math.abs(z.a * z.r2 * z.p / z.q) <= 40 && !(z.a === 2 && z.p === 1 && z.q === 2 && z.r2 === -3) && !(z.a === 2 && z.p === 3 && z.q === 2 && z.r2 === -2); });
      A = s.a; var ra = [s.p, s.q], rb = [s.r2, 1]; if (rv(ra) < rv(rb)) { r1 = ra; r2 = rb; } else { r1 = rb; r2 = ra; }
      E = P.scale(P.mul(lin(s.q, -s.p), lin(1, -s.r2)), s.a / s.q);
      show = tx(E) + OPS[op] + '0'; facS = facT(A, r1, r2);
      if (r.chance(0.5)) { var mv = P.add(M(P.coef(E, { x: 1 }), 'x', 1), P.num(P.constant(E))); show = tx(M(A, 'x', 2)) + OPS[op] + tx(P.neg(mv)); pre = 'Rearrange: ' + t(tx(E) + OPS[op] + '0') + '.<br>'; }
    } else { // neg
      s = pickWhere(function () { var k = r.pick([1, 1, 2, 3]); return { k: k, a: r.int(-6, 4), b: r.int(-3, 7), frac: k > 1 && r.chance(0.5), p: nz(r, 1, 5) }; }, function (z) { return z.a < z.b && Math.abs(z.k * z.a * z.b) <= 40 && !(z.a === -3 && z.b === 5 && z.k === 1) && !(z.a === -2 && z.b === 5 && z.k === 1); });
      if (s.frac && s.p % s.k !== 0) { var rq = [s.p, s.k]; if (rv(rq) < s.b) { r1 = rq; r2 = [s.b, 1]; } else { r1 = [s.b, 1]; r2 = rq; } if (near(rv(r1), rv(r2))) { r1 = [s.a, 1]; r2 = [s.b, 1]; } }
      else { r1 = [s.a, 1]; r2 = [s.b, 1]; }
      A = -s.k * R(r1)[1] * R(r2)[1]; E = P.scale(P.mul(lin(R(r1)[1], -R(r1)[0]), lin(R(r2)[1], -R(r2)[0])), -s.k);
      show = tx(E) + OPS[op] + '0';
      if (r.chance(0.4) && rv(P.constant(E)) !== 0 && rv(P.coef(E, { x: 1 })) !== 0) show = P.seq([P.num(P.constant(E)), M(P.coef(E, { x: 1 }), 'x', 1), M(P.coef(E, { x: 2 }), 'x', 2)]) + OPS[op] + '0';
      rev = true; facS = facT(A, r1, r2);
    }
    var T = quadSet(A, rv(r1), rv(r2), op), ra1 = rv(r1), ra2 = rv(r2), pos = A > 0 ? upOp(op) : !upOp(op);
    var sol = pre + (mode === 'neg' ? 'Multiply by ' + t('-1') + ' and reverse the sign: ' + t(tx(P.neg(E)) + OPS[FLIP[op]] + '0') + ' (or keep the original and test points).<br>' : '') +
      'Roots: ' + t(facS + '=0') + ', so ' + t('x=' + vt(ra1)) + ' or ' + t('x=' + vt(ra2)) + '.<br>' + testLine(E, ra1, ra2, op) + '<br>' +
      'The solution is ' + (pos ? 'outside' : 'between') + ' the roots, ' + (strictOp(op) ? 'not including them' : 'including them') + ': ' + t(setTex(T)) + '.';
    var wr = [];
    if (mode === 'factored' && pos) wr.push({ parts: SET.above(ra2, !strictOp(op)), code: cp + 'ineq-case', hint: 'A product is also positive when <b>both</b> factors are negative: that case gives the other piece.' });
    if (mode === 'dos') wr.push({ parts: pos ? SET.above(ra2, !strictOp(op)) : SET.below(ra2, !strictOp(op)), code: cp + 'ineq-sqrt', hint: 'Taking the square root loses the negative side: ' + t('x^{2}') + ' is also small (or large) for negative ' + t('x') + '. Find both roots and test.' });
    var prompt = 'Solve ' + t(show) + '. Write the solution in set notation.';
    return setPart(cp, prompt, T, { wrongs: wr, rev: rev, sideHint: 'Right roots, but test a value in each interval in the original inequality: ' + testLine(E, ra1, ra2, op).replace(/^Test /, '') }, sol,
      ['Move every term to one side (one side ' + t('0') + ') and factor to find the roots.', 'Test one value in each interval (or use the signs of the factors). Include the roots for ' + t('\\le') + ', ' + t('\\ge') + '.'], 'solve a quadratic inequality');
  };

  /* one or no roots: a perfect square, or no real roots (L6 Ex 7, #7, EP06 A3; L7 #5, EP07 A5; L8 #12d–e) */
  B.special1 = function (r, cp) {
    var sq = r.chance(0.6), op = r.pick(['lt', 'le', 'gt', 'ge']), E, show, T, sol, wr = [];
    if (sq) {
      var s = pickWhere(function () { return { m: r.pick([1, 1, 2, 3, 5]), n: nz(r, 1, 7), neg: r.chance(0.25) }; }, function (z) { return ex.gcd(z.m, Math.abs(z.n)) === 1 && !(z.m === 1 && Math.abs(z.n) === 4) && !(z.m === 1 && z.n === -3) && !(z.m === 2 && z.n === 3); });
      E = P.pow(lin(s.m, -s.n), 2); var h = s.n / s.m;
      if (s.neg) { E = P.neg(E); }
      show = tx(E) + OPS[op] + '0'; T = quadSet(s.neg ? -1 : 1, h, h, op);
      sol = (s.neg ? t(tx(E) + '=-' + br(lin(s.m, -s.n)) + '^{2}') + ', which is never positive. ' : t(tx(E) + '=' + br(lin(s.m, -s.n)) + '^{2}') + ', a square: never negative, and ' + t('0') + ' only at ' + t('x=' + vt(h)) + '. ') + 'So the solution is ' + t(setTex(T)) + '.';
      [SET.ne(h), SET.pt(h), SET.all(), SET.none()].forEach(function (w) { wr.push({ parts: w, code: cp + 'ineq-sq', hint: 'Think about the square ' + t(br(lin(s.m, -s.n)) + '^{2}') + ': it is never negative, and it is ' + t('0') + ' only at ' + t('x=' + vt(h)) + '. Which values make the inequality true?' }); });
    } else {
      var z = pickWhere(function () { return { a: r.pick([1, 1, 2, -1, 3]), b: r.int(-6, 6), c: r.int(-9, 9) }; }, function (q) { return q.b * q.b - 4 * q.a * q.c < 0 && !(q.a === 1 && q.b === 2 && q.c === 5) && !(q.a === 1 && q.b === -3 && q.c === 5); });
      E = quad(z.a, z.b, z.c); show = tx(E) + OPS[op] + '0'; var always = z.a > 0; // the sign everywhere
      T = (always ? upOp(op) : !upOp(op)) ? SET.all() : SET.none();
      sol = 'The discriminant is ' + t(par(z.b) + '^{2}-4(' + z.a + ')' + par(z.c) + '=' + (z.b * z.b - 4 * z.a * z.c)) + ' < 0: no real roots, so ' + t(tx(E)) + ' has one sign for every ' + t('x') + '. Test ' + t('x=0') + ': ' + t(vt(z.c) + OPS[op] + '0') + ' is ' + (holds(z.c, op) ? 'true' : 'false') + '.<br>' + (T.length ? 'All real numbers: ' + t(setTex(T)) + '.' : '<b>No solution</b>.');
    }
    return setPart(cp, 'Solve ' + t(show) + '. (If no real number works, type “no solution”; for every real number, type ' + t('\\{x\\mid x\\in\\mathbb{R}\\}') + '.)', T, { wrongs: wr }, sol,
      ['Find the roots: ' + (sq ? 'this one is a perfect square.' : 'check the discriminant first.'), 'With one root or none, the expression has the same sign everywhere (except ' + t('0') + ' at a double root): one test value decides.'], 'one or no roots');
  };

  /* the values of k for which an equation has two distinct / no real roots (L6 Ex 8a, #9, #10, EP06 B4; L7 #11, EP07 B4)
     mode: 'simple' (k² − s² ≷ 0) | 'hard' (k in two coefficients: (k − p)(k − q) ≷ 0) */
  B.kRoots = function (r, cp, opt) {
    opt = opt || {};
    var mode = opt.mode || 'simple', two = r.chance(0.5), eqT, Dt, p, q, sol, v = r.pick(['k', 'k', 'm']);
    if (mode === 'simple') {
      var s = pickWhere(function () { return { a: r.pick([1, 1, 2, 3, 4]), c: r.pick([1, 4, 9, 16, 25, 3, 12, 2, 8]) }; }, function (z) { var x = 4 * z.a * z.c, sr = Math.round(Math.sqrt(x)); return sr * sr === x && !(z.a === 1 && z.c === 9) && !(z.a === 3 && z.c === 12) && !(z.a === 1 && z.c === 16); });
      var S = Math.sqrt(4 * s.a * s.c); p = -S; q = S;
      eqT = tx(M(s.a, 'x', 2)) + '+' + v + 'x+' + s.c + '=0'; Dt = v + '^{2}-' + 4 * s.a * s.c;
      sol = t('b^{2}-4ac=' + v + '^{2}-4(' + s.a + ')(' + s.c + ')=' + Dt) + '.<br>';
    } else {
      var kind = r.pick(['shift', 'mixed']);
      if (kind === 'shift') {
        var z2 = pickWhere(function () { return { u: nz(r, 1, 5), c: r.pick([1, 4, 9, 16]) }; }, function (z) { return !(z.u === 1 && z.c === 4); });
        var S2 = 2 * Math.sqrt(z2.c); p = -S2 - z2.u; q = S2 - z2.u;
        eqT = 'x^{2}+(' + v + (z2.u > 0 ? '+' : '-') + Math.abs(z2.u) + ')x+' + z2.c + '=0'; Dt = '(' + v + (z2.u > 0 ? '+' : '-') + Math.abs(z2.u) + ')^{2}-' + 4 * z2.c;
        sol = t('b^{2}-4ac=' + Dt + '=' + tx(P.sub(P.pow(lin(1, z2.u, v), 2), P.num(4 * z2.c)))) + '.<br>';
      } else {
        var z3 = pickWhere(function () { return { u: r.pick([1, 2, 3, -1]), pp: r.int(-6, 8) }; }, function (z) { var qq = 4 * z.u - z.pp, w = -z.pp * qq / 4; return w % 1 === 0 && qq !== z.pp && w !== 0 && !(z.u === 2 && (z.pp === 2 || z.pp === 6)) && !(z.u === 1 && (z.pp === -2 || z.pp === 6)); });
        var qq = 4 * z3.u - z3.pp, w = -z3.pp * qq / 4; p = Math.min(z3.pp, qq); q = Math.max(z3.pp, qq);
        eqT = 'x^{2}+' + v + 'x+(' + tx(lin(z3.u, w, v)) + ')=0';
        Dt = v + '^{2}-4(' + tx(lin(z3.u, w, v)) + ')';
        sol = t('b^{2}-4ac=' + Dt + '=' + tx(P.add(M(1, v, 2), M(-4 * z3.u, v, 1), P.num(-4 * w)))) + '.<br>';
      }
    }
    var T = two ? SET.outside(p, q, false) : SET.between(p, q, false);
    sol += (two ? 'Two distinct real roots: ' + t('b^{2}-4ac>0') : 'No real roots: ' + t('b^{2}-4ac<0')) + '. The roots of the discriminant are ' + t(v + '=' + vt(p)) + ' and ' + t(v + '=' + vt(q)) + '; test ' + t(v + '=' + vt((p + q) / 2)) + ': the discriminant is negative between them.<br>' + t(setTex(T, v)) + '.';
    var pre = mode === 'hard' && r.chance(0.4) && eqT.indexOf('(' + v) < 0 ? 'the graph of ' + t('y=' + eqT.replace('=0', '').replace(/[()]/g, '')) + ' have ' + (two ? 'two' : 'no') + ' ' + t('x') + '-intercepts' : t(eqT) + ' have ' + (two ? '<b>two distinct real roots</b>' : '<b>no real roots</b>');
    return setPart(cp, 'For what values of ' + t(v) + ' does ' + pre + '?', T, { v: v, wrongs: [{ parts: SET.pt(p).concat(SET.pt(q)), code: cp + 'k-tangent', hint: 'Those values give a discriminant of ' + t('0') + ': <b>one</b> (double) root. Write the inequality the question asks for.' }] }, sol,
      ['Write the discriminant ' + t('b^{2}-4ac') + ' in terms of ' + t(v) + '.', (two ? 'Two distinct real roots: ' + t('b^{2}-4ac>0') : 'No real roots: ' + t('b^{2}-4ac<0')) + '. Solve that quadratic inequality in ' + t(v) + '.'], 'values of k for real roots');
  };

  /* contexts (L6 Ex 8b, #11; L7 #8–10, nr, EP07 B2–B3; L8 #13, EP08 C4b): 'interval' | 'duration' | 'rect' | 'profit' */
  B.heightCtx = function (r, cp, opt) {
    opt = opt || {};
    var mode = opt.mode || r.pick(['duration', 'rect', 'profit']), s, prompt, sol, T, p;
    if (mode === 'interval' || mode === 'profit') {
      if (mode === 'interval') {
        s = pickWhere(function () { return { h0: r.pick([0, 5, 10, 15, 20, 30]), t1: r.int(1, 3), t2: r.int(3, 7), st: r.chance(0.5) }; }, function (z) { return z.t2 > z.t1 && !(z.h0 === 10 && z.t1 === 1 && z.t2 === 5) && !(z.h0 === 30 && z.t1 === 1 && z.t2 === 4); });
        var v0 = 5 * (s.t1 + s.t2), H = s.h0 + 5 * s.t1 * s.t2, op = s.st ? 'gt' : 'ge';
        prompt = 'A ball is thrown upward' + (s.h0 ? ' from a ' + s.h0 + ' m platform' : ' from the ground') + '. Its height after ' + t('t') + ' seconds is ' + t('h=-5t^{2}+' + v0 + 't' + (s.h0 ? '+' + s.h0 : '')) + ' metres. During what time interval is the ball ' + (s.st ? 'more than' : 'at least') + ' ' + t(H) + ' m high?';
        T = SET.between(s.t1, s.t2, !s.st);
        sol = t('-5t^{2}+' + v0 + 't' + (s.h0 ? '+' + s.h0 : '') + OPS[op] + H) + ', so ' + t('-5t^{2}+' + v0 + 't-' + (H - s.h0) + OPS[op] + '0') + '. Divide by ' + t('-5') + ' (reverse): ' + t('t^{2}-' + (s.t1 + s.t2) + 't+' + s.t1 * s.t2 + OPS[FLIP[op]] + '0') + ', ' + t('(t-' + s.t1 + ')(t-' + s.t2 + ')' + OPS[FLIP[op]] + '0') + '.<br>Between the roots: ' + t(setTex(T, 't')) + ' (from ' + s.t1 + ' s to ' + s.t2 + ' s).';
        p = setPart(cp, prompt, T, { v: 't', rev: true, revHint: 'Dividing by ' + t('-5') + ' reverses the sign: the ball is high <b>between</b> the two times.' }, sol, ['Write the inequality ' + t('h' + OPS[op] + H) + ' and move every term to one side.', 'Factor, find the roots, and decide whether the solution is between or outside them.'], 'a height inequality');
        return p;
      }
      s = pickWhere(function () { return { a: r.pick([5, 2, 1, 10]), x1: r.int(6, 14), w: r.int(2, 10), V: r.pick([0, 0, 40, 60, 80, 120, 150]) }; }, function (z) { var c = z.a * z.x1 * (z.x1 + z.w) - z.V; return c > 0 && !(z.a === 5 && z.x1 === 10 && z.w === 10); });
      var x2 = s.x1 + s.w, bP = s.a * (s.x1 + x2), cP = s.a * s.x1 * x2 - s.V, opP = s.V ? 'ge' : 'gt';
      prompt = 'A food truck’s daily profit, in dollars, when it charges ' + t('x') + ' dollars per meal is ' + t('P=-' + coefT(s.a) + 'x^{2}+' + bP + 'x-' + cP) + '. For what prices ' + (s.V ? 'is the daily profit at least ' + t('\\$' + s.V) : 'does the truck make a profit') + '?';
      T = SET.between(s.x1, x2, !!s.V);
      sol = t('-' + coefT(s.a) + 'x^{2}+' + bP + 'x-' + cP + OPS[opP] + s.V) + (s.V ? ', so ' + t('-' + coefT(s.a) + 'x^{2}+' + bP + 'x-' + (cP + s.V) + '\\ge 0') : '') + '. Divide by ' + t(-s.a) + ' (reverse): ' + t('x^{2}-' + (s.x1 + x2) + 'x+' + s.x1 * x2 + OPS[FLIP[opP]] + '0') + ', ' + t('(x-' + s.x1 + ')(x-' + x2 + ')' + OPS[FLIP[opP]] + '0') + '.<br>Between the roots: ' + t(setTex(T)) + ' (prices from ' + t('\\$' + s.x1) + ' to ' + t('\\$' + x2) + ').';
      return setPart(cp, prompt, T, { v: 'x', rev: true, revHint: 'Dividing by a negative reverses the sign: the profit is high <b>between</b> the two prices.' }, sol, ['Write the inequality and move every term to one side.', 'Divide by the negative leading coefficient (reverse the sign), factor, and decide: between or outside the roots?'], 'a profit inequality');
    }
    if (mode === 'duration') {
      s = pickWhere(function () { return { v0: r.pick([20, 25, 30, 35, 40, 49]), h0: r.pick([0, 2, 5, 10, 15]), H: r.int(10, 60), g: r.pick([5, 4.9]) }; }, function (z) {
        var D = z.v0 * z.v0 - 4 * z.g * (z.H - z.h0), sd = Math.sqrt(Math.max(D, 0)); return D > 30 && Math.abs(sd - Math.round(sd)) > 1e-6 && z.H > z.h0 && !(z.v0 === 49 && z.H === 98);
      });
      var D = s.v0 * s.v0 - 4 * s.g * (s.H - s.h0), dur = Math.sqrt(D) / s.g, ta = (s.v0 - Math.sqrt(D)) / (2 * s.g), tb = (s.v0 + Math.sqrt(D)) / (2 * s.g), gT = s.g === 5 ? '5' : '4.9';
      prompt = 'A ball is kicked upward. Its height after ' + t('t') + ' seconds is ' + t('h=-' + gT + 't^{2}+' + s.v0 + 't' + (s.h0 ? '+' + s.h0 : '')) + ' metres. To the nearest hundredth of a second, for how long is the ball more than ' + t(s.H) + ' m high?';
      sol = t('-' + gT + 't^{2}+' + s.v0 + 't' + (s.h0 ? '+' + s.h0 : '') + '>' + s.H) + ', so ' + t(gT + 't^{2}-' + s.v0 + 't+' + dt(s.H - s.h0) + '<0') + '.<br>Roots: ' + t('t=\\dfrac{' + s.v0 + '\\pm\\sqrt{' + dt(D) + '}}{' + dt(2 * s.g) + '}') + ': ' + t('t\\approx ' + ta.toFixed(2)) + ' and ' + t('t\\approx ' + tb.toFixed(2)) + '. The ball is above ' + s.H + ' m between them, for ' + t('\\dfrac{\\sqrt{' + dt(D) + '}}{' + gT + '}\\approx ' + K.roundTo(dur, 2).toFixed(2)) + ' s.';
      p = KP.approx(prompt, dur, 2, { after: 's', diag: function (v) { if (Math.abs(v - K.roundTo(tb, 2)) < 1e-9 || Math.abs(v - K.roundTo(ta, 2)) < 1e-9) return { code: cp + 'ineq-time', hint: 'That is the time when it reaches ' + s.H + ' m. The question asks <b>how long</b> it stays above: subtract the two times.' }; return null; } }, sol,
        ['Write the inequality ' + t('h>' + s.H) + ' and move every term to one side.', 'Find both roots with the quadratic formula. The ball is above ' + s.H + ' m between them: subtract.'], 'how long above a height');
      p.bad = [K.roundTo(tb, 2).toFixed(2), K.roundTo(ta, 2).toFixed(2)];
      return p;
    }
    // rect: length is d more than the width; area at most / at least A (with the restriction w > 0)
    s = pickWhere(function () { return { d: r.int(2, 7), w2: r.int(3, 10), most: r.chance(0.6) }; }, function (z) { return !(z.d === 4 && z.w2 === 3) && !(z.d === 3 && z.w2 === 5); });
    var Ar = s.w2 * (s.w2 + s.d), wneg = -(s.w2 + s.d);
    prompt = 'The length of a rectangle is ' + t(s.d) + ' cm more than its width. For what widths is its area ' + (s.most ? 'at most' : 'at least') + ' ' + t(Ar) + ' cm²? Write the solution in set notation, with the restriction of the context.';
    T = s.most ? [sIv(0, s.w2, false, true)] : SET.above(s.w2, true);
    sol = 'Width ' + t('w') + ', length ' + t('w+' + s.d) + ': ' + t('w(w+' + s.d + ')' + (s.most ? '\\le ' : '\\ge ') + Ar) + ', so ' + t('w^{2}+' + s.d + 'w-' + Ar + (s.most ? '\\le 0' : '\\ge 0')) + ' and ' + t('(w+' + (s.w2 + s.d) + ')(w-' + s.w2 + ')' + (s.most ? '\\le 0' : '\\ge 0')) + '.<br>' + (s.most ? 'Between the roots: ' + t(wneg + '\\le w\\le ' + s.w2) + '. A width is positive: ' : 'Outside the roots: ' + t('w\\le ' + wneg + '\\text{ or }w\\ge ' + s.w2) + '. A width is positive: ') + t(setTex(T, 'w')) + '.';
    return setPart(cp, prompt, T, { v: 'w', wrongs: [{ parts: s.most ? SET.between(wneg, s.w2, true) : SET.outside(wneg, s.w2, true), code: cp + 'ineq-restr', hint: 'Right inequality — but a width must be positive. Apply the restriction ' + t('w>0') + '.' }, s.most ? { parts: [sIv(0, s.w2, true, true)], code: cp + 'ineq-restr', hint: 'A width of ' + t('0') + ' is not a rectangle: use ' + t('w>0') + '.' } : null] }, sol,
      ['Let the width be ' + t('w') + '; the length is ' + t('w+' + s.d) + '. Write the area inequality.', 'Solve it with roots and test points, then keep only the widths that make sense (' + t('w>0') + ').'], 'an area inequality with a restriction');
  };

  /* the product row of a sign chart (L7 Ex 3, L8 #22) — multiple choice */
  B.signRow = function (r, cp) {
    var s = pickWhere(function () { return { k: r.pick([-3, -2, -1, 2, 3, -4]), a: r.int(-6, 2), b: r.int(-2, 7) }; }, function (z) { return z.a < z.b && !(z.k === -3 && z.a === -2 && z.b === 3); });
    var E = P.scale(P.mul(lin(1, -s.a), lin(1, -s.b)), s.k), op = r.pick(['lt', 'gt', 'le', 'ge']);
    var row = s.k > 0 ? ['+', '-'] : ['-', '+'], right = row[0] + ', 0, ' + row[1] + ', 0, ' + row[0];
    var all = ['+, 0, -, 0, +', '-, 0, +, 0, -', '-, 0, -, 0, +', '+, 0, +, 0, -'];
    var T = quadSet(s.k, s.a, s.b, op), sign = function (n) { return n > 0 ? '+' : '-'; };
    var sol = t(tx(E) + '=' + facT(s.k, s.a, s.b)) + ': factors ' + t(s.k) + ', ' + t(tx(lin(1, -s.a))) + ' and ' + t(tx(lin(1, -s.b))) + '.<br>' + t('x<' + s.a) + ': ' + t('(' + sign(s.k) + ')(-)(-)=' + row[0]) + '; between: ' + t('(' + sign(s.k) + ')(+)(-)=' + row[1]) + '; ' + t('x>' + s.b) + ': ' + t('(' + sign(s.k) + ')(+)(+)=' + row[0]) + '.<br>The product row is ' + t(right.replace(/-/g, '−')) + ', so the solution of ' + t(tx(E) + OPS[op] + '0') + ' is ' + t(setTex(T)) + '.';
    var opts = all.map(function (a) { return { html: t(a.replace(/-/g, '−')), right: a === right, code: a.replace(/[^+\-0]/g, ''), why: a === right ? null : 'Multiply the signs of all three factors on each interval, including the constant ' + t(s.k) + '.' }; });
    return KP.mc(r, 'Ravi solves ' + t(tx(E) + OPS[op] + '0') + ' with a sign chart using the factors ' + t(s.k) + ', ' + t(tx(lin(1, -s.a))) + ' and ' + t(tx(lin(1, -s.b))) + '. From left to right, the product row of his chart is', opts, sol,
      ['Factor completely: a constant factor counts in the chart too.', 'On each interval, multiply the signs of the factors.'], 'sign chart', true);
  };

  /* how many integers satisfy the inequality (L6 nr, L7 nr, L8 nr, EP08 B4) */
  B.countInts = function (r, cp) {
    var s = pickWhere(function () { var q = r.pick([1, 1, 2, 3]); return { q: q, p: nz(r, 1, 9), r2: r.int(-4, 9), op: r.pick(['lt', 'le']) }; }, function (z) { return (z.q === 1 || z.p % z.q !== 0) && z.p / z.q < z.r2 - 1 && Math.abs(z.p * z.r2) <= 50 && !(z.q === 2 && z.p === -3 && z.r2 === 5); });
    var a = s.p / s.q, b = s.r2, E = P.mul(lin(s.q, -s.p), lin(1, -b)), inc = s.op === 'le';
    var n = 0; for (var x = Math.ceil(a - 1); x <= b + 1; x++) if (inc ? x >= a - 1e-9 && x <= b + 1e-9 : x > a + 1e-9 && x < b - 1e-9) n++;
    var nOther = 0; for (var y = Math.ceil(a - 1); y <= b + 1; y++) if (!inc ? y >= a - 1e-9 && y <= b + 1e-9 : y > a + 1e-9 && y < b - 1e-9) nOther++;
    var sol = t(facT(s.q, [s.p, s.q], b) + OPS[s.op] + '0') + ': between the roots, ' + t(setTex(SET.between(a, b, inc))) + '.<br>The integers from ' + t(inc ? Math.ceil(a - 1e-9) : Math.floor(a + 1e-9) + 1) + ' to ' + t(inc ? b : b - 1) + ': there are <b>' + n + '</b>.';
    var p = KP.number('How many integers satisfy ' + t(tx(E) + OPS[s.op] + '0') + '?', n, function (v) { return v === nOther || v === n + 1 || v === n - 1 ? { code: cp + 'count-ends', hint: 'Check the endpoints: ' + (inc ? t('\\le') + ' includes the integer roots.' : t('<') + ' leaves the roots out.') } : null; }, sol,
      ['Solve the inequality first (roots and test points).', 'List the integers in the solution and count them, watching the endpoints.'], 'count the integers');
    p.bad = [String(n + 1), String(Math.max(0, n - 1))];
    return p;
  };

  /* write a quadratic inequality with the given solution (L7 #7, EP06 C2, EP07 B1) */
  B.writeFromSet = function (r, cp) {
    var s = pickWhere(function () { var q = r.pick([1, 1, 2, 3, 4]); return { q: q, p: nz(r, 1, 8), r2: r.int(-7, 7), out: r.chance(0.5), st: r.chance(0.5) }; }, function (z) { return (z.q === 1 || (z.p % z.q !== 0 && ex.gcd(Math.abs(z.p), z.q) === 1)) && z.p / z.q < z.r2 && !(z.q === 1 && z.p === -2 && z.r2 === 5) && !(z.q === 1 && z.p === -3 && z.r2 === 4); });
    var a = s.p / s.q, b = s.r2, inc = !s.st, Tset = s.out ? SET.outside(a, b, inc) : SET.between(a, b, inc);
    var op = s.out ? (inc ? 'ge' : 'gt') : (inc ? 'le' : 'lt'), E = P.mul(lin(s.q, -s.p), lin(1, -b));
    var sol = 'The roots ' + t(vt(a)) + ' and ' + t(b) + ' give the factors ' + t(br(lin(s.q, -s.p))) + ' and ' + t(br(lin(1, -b))) + '. With a positive leading coefficient the product is negative between the roots and positive outside, so ' + t(OPS[op].trim()) + ':<br>' + t(facT(s.q, [s.p, s.q], b) + OPS[op] + '0') + ', that is, ' + t(tx(E) + OPS[op] + '0') + '.';
    return ineqPart(cp, 'Write a quadratic inequality with integer coefficients and a positive leading coefficient whose solution is ' + t(setTex(Tset)) + '.', E, op, tx(E) + OPS[op] + '0',
      { vars: ['x'], posLead: true, intCoef: true, ph: 'x^2 - 3x - 10 <= 0', example: 'x^{2}-3x-10\\le 0', sideHint: 'Right roots, but the inequality points the wrong way: with a positive leading coefficient, the product is negative <b>between</b> the roots.', strictHint: 'Check the endpoints: ' + (inc ? 'they are included, so use ' + t('\\le') + ' or ' + t('\\ge') + '.' : 'they are not included, so use ' + t('<') + ' or ' + t('>') + '.'), boundHint: 'Check your roots: the factor for the root ' + t(vt(a)) + ' is ' + t(br(lin(s.q, -s.p))) + '.' }, sol,
      ['Each endpoint is a root: write a factor for each one (clear any fraction).', 'Between the roots → the product is negative; outside → positive. Closed endpoints → include ' + t('=') + '.'], 'write an inequality from its solution');
  };

  /* a `bad` answer must be wrong for every version (a wrong-answer recipe can coincide with the key for some numbers) */
  Object.keys(B).forEach(function (k) {
    var f = B[k];
    B[k] = function () { var p = f.apply(null, arguments); p.bad = (p.bad || []).filter(function (b) { try { return p.check(b).v !== 'correct'; } catch (e) { return false; } }); return p; };
  });
  HW.u8assess = { B: B, pairsPart: pairsPart, setPart: setPart, ineqPart: ineqPart, SET: SET, regionSvg: regionSvg };

  /* ======================================================================================================
   * The unit test
   * ====================================================================================================== */
  var CP = 'u8t-';
  function mk(fn, o) { return function (r) { return fn(r, CP, o); }; }
  function Pt(id, outcome, level, make) { return { id: id, outcome: outcome, level: level, make: make }; }
  var QUESTIONS = [
    // ---------------- Beginning ----------------
    { num: '1', outcome: 'RF6', lesson: 'L1', stem: 'Linear–quadratic systems.', parts: [Pt('1a', 'RF6', 'BEG', mk(B.lqSolve, { mode: 'basic' })), Pt('1b', 'RF6', 'BEG', mk(B.lqCount))] },
    { num: '2', outcome: 'RF6', lesson: 'L1, L2', stem: 'Quadratic–quadratic systems.', parts: [Pt('2a', 'RF6', 'BEG', function (r) { return r.chance(0.3) ? B.qqSolve(r, CP, { mode: 'cancel' }) : B.qqSolve(r, CP, { mode: 'basic' }); }), Pt('2b', 'RF6', 'BEG', mk(B.readGraph))] },
    { num: '3', outcome: 'RF7', lesson: 'L4', stem: 'Linear inequalities in two variables.', parts: [Pt('3a', 'RF7', 'BEG', mk(B.ptsGrid, { kind: 'lin' })), Pt('3b', 'RF7', 'BEG', mk(B.bdMC, { kind: 'lin' }))] },
    { num: '4', outcome: 'RF7', lesson: 'L5', stem: 'A quadratic inequality in two variables.', parts: [Pt('4', 'RF7', 'BEG', mk(B.whichGraph, { kind: 'quad' }))] },
    { num: '5', outcome: 'RF8', lesson: 'L6', stem: 'Quadratic inequalities in one variable.', parts: [Pt('5a', 'RF8', 'BEG', mk(B.graph1)), Pt('5b', 'RF8', 'BEG', mk(B.solve1, { mode: 'monic' }))] },
    { num: '6', outcome: 'RF8', lesson: 'L7', stem: 'Sign analysis.', parts: [Pt('6', 'RF8', 'BEG', mk(B.solve1, { mode: 'factored' }))] },
    // ---------------- Progressing ----------------
    { num: '7', outcome: 'RF6', lesson: 'L1, L3', stem: 'Linear–quadratic systems.', parts: [Pt('7a', 'RF6', 'PRG', mk(B.lqSolve, { mode: 'exact' })), Pt('7b', 'RF6', 'PRG', mk(B.lqK))] },
    { num: '8', outcome: 'RF6', lesson: 'L2, L3', stem: 'Quadratic–quadratic systems.', parts: [Pt('8a', 'RF6', 'PRG', mk(B.qqSolve, { mode: 'mix' })), Pt('8b', 'RF6', 'PRG', mk(B.twoBalls))] },
    { num: '9', outcome: 'RF7', lesson: 'L4', stem: 'Linear inequalities in two variables.', parts: [Pt('9a', 'RF7', 'PRG', mk(B.writeLin)), Pt('9b', 'RF7', 'PRG', mk(B.ticketsCtx))] },
    { num: '10', outcome: 'RF7', lesson: 'L5', stem: 'A quadratic inequality from its graph.', parts: [Pt('10', 'RF7', 'PRG', mk(B.writeQuad))] },
    { num: '11', outcome: 'RF8', lesson: 'L6, L7', stem: 'Solve.', parts: [Pt('11a', 'RF8', 'PRG', mk(B.solve1, { mode: ['dec', 'rearr', 'dos'] })), Pt('11b', 'RF8', 'PRG', mk(B.solve1, { mode: 'neg' }))] },
    { num: '12', outcome: 'RF8', lesson: 'L6', stem: 'One root or none.', parts: [Pt('12', 'RF8', 'PRG', mk(B.special1))] },
    // ---------------- Mastery ----------------
    { num: '13', outcome: 'RF6', lesson: 'L3', stem: 'A problem modelled by a system.', parts: [Pt('13', 'RF6', 'MAS', function (r) { var k = r.pick(['rect', 'be', 'pq']); return k === 'rect' ? B.rectSys(r, CP) : k === 'be' ? B.breakEven(r, CP, { profit: true }) : B.pqModel(r, CP); })] },
    { num: '14', outcome: 'RF6', lesson: 'L1, L2', stem: 'Tangents and one solution.', parts: [Pt('14', 'RF6', 'MAS', function (r) { return r.chance(0.55) ? B.tangentM(r, CP) : B.qqOne(r, CP); })] },
    { num: '15', outcome: 'RF7', lesson: 'L5', stem: 'A parabolic arch.', parts: [Pt('15', 'RF7', 'MAS', mk(B.archLoad, { mode: 'build' }))] },
    { num: '16', outcome: 'RF7', lesson: 'L4', stem: 'A system of inequalities in context.', parts: [Pt('16', 'RF7', 'MAS', mk(B.cornerCtx))] },
    { num: '17', outcome: 'RF8', lesson: 'L6, L7', stem: 'A quadratic inequality in context.', parts: [Pt('17', 'RF8', 'MAS', mk(B.heightCtx))] },
    { num: '18', outcome: 'RF8', lesson: 'L6, L7', stem: 'Real roots.', parts: [Pt('18', 'RF8', 'MAS', mk(B.kRoots, { mode: 'hard' }))] }
  ];

  HW.defineTest({
    id: 'u8test', unit: 8, title: 'Unit 8 Test', outcome: 'RF6', calc: true,
    blurb: 'The Unit 8 outcomes-based test on RF6 (linear–quadratic and quadratic–quadratic systems and problems), RF7 (linear and quadratic inequalities in two variables) and RF8 (quadratic inequalities in one variable) — in Beginning, Progressing and Mastery boxes. Calculator allowed; answers exact unless a question asks to round.',
    // Short version (~half the time): a linear–quadratic and a quadratic–quadratic system, points and the boundary of a
    // linear inequality, a one-variable inequality from a graph and by test points at Beginning; exact solutions, two
    // balls, writing a linear and a quadratic inequality, two harder one-variable inequalities at Progressing; a problem
    // modelled by a system, a tunnel arch and a context inequality at Mastery.
    short: ['1a', '2a', '3', '5', '7a', '8b', '9a', '10', '11', '13', '15', '17'],
    questions: QUESTIONS
  });
})(window);
