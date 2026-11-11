/* Math 20-1 · Unit 4 (Factoring, Quadratic Equations and Radical Equations) — exit slips for Lessons 1–8 (u4l1x … u4l8x),
 * written in test mode at the end of class. NO calculator (as on the Unit 4 test). There are no older exit slips for this
 * course: each slip is written from Ryan's Unit 4 booklet (m201book/unit4/u4_lXX.tex and u4_epXX.tex), four short
 * questions (5–8 minutes): Beginning = the lesson's first-taught skill, Progressing = the typical assignment question,
 * Mastery = one of the lesson's harder assignment / extra-practice items. New numbers every time (the booklet's example
 * and assignment items are left out of the pools where they would come up often). Outcomes as the course plan tags them:
 * Lessons 1–4 RF1, Lesson 5 RF5, Lessons 6–7 AN3, Lesson 8 (review) per question.
 *   4.1  GCF, negative when the first term is negative (BEG) · factor fully: a GCF / −1 and x² + bx + c, or two variables
 *        (PRG) · grouping, with a negative second pair or a rearrangement (PRG) · every integer b (or positive k) for which
 *        x² + bx + c factors (MAS, L1 Ex 6b, #9)
 *   4.2  decomposition (BEG) · a perfect-square trinomial (BEG) · factor fully: a GCF or a negative leading coefficient, or a
 *        fractional common factor (PRG) · every integer k for which ax² + kx + c factors (MAS, EP02 C1)
 *   4.3  x⁴ + bx² + c (or x⁶, (xy)²) (BEG) · a quartic that finishes with differences of squares, or a ≠ 1 (PRG) ·
 *        a(mx + h)² + b(mx + h) + c (PRG) · two repeated binomials aA² + bAB + cB² (MAS, L3 Ex 9b, #8, EP03 C2)
 *   4.4  A² − B² (BEG) · a GCF first, or x⁴ − n⁴ (PRG) · (x + h)² − k² or k² − (x + h)² (PRG) · a²(f(x))² − b²(g(x))²
 *        (MAS, L4 Ex 7, #7f/h, #13)
 *   4.5  the zero product property (BEG) · solving after moving terms, clearing fractions or expanding (PRG) · an equation
 *        from fractional or double roots (PRG) · a frame / path / rectangle problem with an inadmissible root (MAS, L5 Ex 7,
 *        EP05 B3)
 *   4.6  the restriction of a radical (BEG) · k√(ax + b) + d = e, sometimes no solution (PRG) · a radical on each side,
 *        sometimes extraneous (PRG) · the values of c for which an equation has no solution (MAS, EP06 C2)
 *   4.7  the restrictions of √A = B (BEG) · √(px + q) = x + c (PRG) · an isolated radical, k√(x + q) = x + c, or u = √x
 *        (PRG) · two radicals, squaring twice (MAS, L7 Ex 7, #9, EP07 B2)
 *   4.8  (review) a trinomial or a difference of squares (RF1, BEG) · solve by factoring (RF5, PRG) · a radical equation that leads to a quadratic
 *        (AN3, PRG) · one root of ax² + kx + c = 0 given: the other root (RF5, MAS, EP05 C1)
 * The generators, checkers and wrong-answer codes are the Unit 4 assessment kit HW.u4assess in js/lessons/u4test.js (so
 * that file loads first; labels and partial-credit decisions are registered there); here they run with the u4x- codes.
 * Factored answers: K.factored (equal and factored completely; a format nudge when not completely factored). Roots:
 * "x = a, x = b" (± allowed) or "no solution". Restrictions: K.set. */
(function (root) {
  'use strict';
  var HW = root.HW, A = HW.u4assess;
  if (!A) throw new Error('js/exits/u4.js needs js/lessons/u4test.js (the Unit 4 assessment kit) loaded first');
  var B = A.B, CP = 'u4x-';
  function Q(num, outcome, level, stem, fn) { return { num: String(num), outcome: outcome, stem: stem, parts: [{ id: String(num), outcome: outcome, level: level, make: function (r) { return fn(r, CP); } }] }; }
  function opt(fn, o) { return function (r, cp) { return fn(r, cp, o); }; }

  HW.defineExit({ lesson: 'u4l1', calc: false, outcome: 'RF1',
    blurb: 'Common factors and x² + bx + c: take out the GCF, factor fully with a common factor first, factor by grouping, and find every b for which a trinomial factors.',
    questions: [Q(1, 'RF1', 'BEG', 'The greatest common factor.', B.gcf), Q(2, 'RF1', 'PRG', 'Factor fully.', opt(B.monic, { mode: 'full' })),
      Q(3, 'RF1', 'PRG', 'Grouping.', opt(B.grouping, {})), Q(4, 'RF1', 'MAS', 'When does it factor?', opt(B.allB, {}))] });

  HW.defineExit({ lesson: 'u4l2', calc: false, outcome: 'RF1',
    blurb: 'Factoring ax² + bx + c: decomposition, a perfect-square trinomial, factoring fully (a common factor, a negative or a fraction first), and every k for which ax² + kx + c factors.',
    questions: [Q(1, 'RF1', 'BEG', 'Decomposition.', B.decomp), Q(2, 'RF1', 'BEG', 'A perfect square.', B.pst),
      Q(3, 'RF1', 'PRG', 'Factor fully.', function (r, cp) { return r.chance(0.6) ? B.decomp(r, cp, { mode: r.chance(0.7) ? 'full' : 'two' }) : B.ratcoef(r, cp); }),
      Q(4, 'RF1', 'MAS', 'When does it factor?', B.allK)] });

  HW.defineExit({ lesson: 'u4l3', calc: false, outcome: 'RF1',
    blurb: 'Factoring by substitution: a trinomial in x² (or x³, xy), one that finishes with differences of squares, a repeated binomial, and two repeated binomials.',
    questions: [Q(1, 'RF1', 'BEG', 'Quadratic form.', opt(B.subQuartic, { mode: 'simple' })),
      Q(2, 'RF1', 'PRG', 'Factor fully.', function (r, cp) { return B.subQuartic(r, cp, { mode: r.chance(0.6) ? 'full' : 'dec' }); }),
      Q(3, 'RF1', 'PRG', 'A repeated binomial.', function (r, cp) { return B.subBin(r, cp, { mode: r.chance(0.3) ? 'basic' : 'gen' }); }),
      Q(4, 'RF1', 'MAS', 'Two repeated binomials.', B.subTwo)] });

  HW.defineExit({ lesson: 'u4l4', calc: false, outcome: 'RF1',
    blurb: 'Differences of squares: A² − B², a common factor first or a fourth power, the square of a binomial minus a square, and a²(f(x))² − b²(g(x))².',
    questions: [Q(1, 'RF1', 'BEG', 'A difference of squares.', B.dos),
      Q(2, 'RF1', 'PRG', 'Factor fully.', function (r, cp) { return B.dos(r, cp, { mode: r.chance(0.5) ? 'gcf' : 'quartic' }); }),
      Q(3, 'RF1', 'PRG', 'Squares of binomials.', opt(B.dosBin, { mode: 'simple' })), Q(4, 'RF1', 'MAS', 'Squares of binomials.', opt(B.dosBin, { mode: 'two' }))] });

  HW.defineExit({ lesson: 'u4l5', calc: false, outcome: 'RF5',
    blurb: 'Solving quadratic equations by factoring: the zero product property, getting to standard form first, an equation from its roots, and a problem with an inadmissible root.',
    questions: [Q(1, 'RF5', 'BEG', 'The zero product property.', B.zp), Q(2, 'RF5', 'PRG', 'Solve by factoring.', function (r, cp) { return B.solveStd(r, cp, {}); }),
      Q(3, 'RF5', 'PRG', 'An equation from its roots.', opt(B.eqFromRoots, { mode: 'frac' })), Q(4, 'RF5', 'MAS', 'A problem.', opt(B.wordFrame, {}))] });

  HW.defineExit({ lesson: 'u4l6', calc: false, outcome: 'AN3',
    blurb: 'Radical equations: the restriction, isolating and squaring (or no solution), a radical on each side with an extraneous root, and when an equation has no solution.',
    questions: [Q(1, 'AN3', 'BEG', 'The restriction.', opt(B.restr, { mode: 'one' })), Q(2, 'AN3', 'PRG', 'Solve and verify.', opt(B.radSolve1, { none: 0.35 })),
      Q(3, 'AN3', 'PRG', 'A radical on each side.', opt(B.radBoth, {})), Q(4, 'AN3', 'MAS', 'No solution.', B.noSolC)] });

  HW.defineExit({ lesson: 'u4l7', calc: false, outcome: 'AN3',
    blurb: 'Radical equations that lead to quadratics: the restrictions of √A = B, solving with an extraneous root, an isolated radical or u = √x, and two radicals squared twice.',
    questions: [Q(1, 'AN3', 'BEG', 'The restrictions.', opt(B.restr, { mode: 'eq' })), Q(2, 'AN3', 'PRG', 'Solve and verify.', opt(B.radQuad, { mode: 'basic' })),
      Q(3, 'AN3', 'PRG', 'Solve and verify.', function (r, cp) { var k = r.pick(['isolate', 'coef', 'sub']); return k === 'sub' ? B.radSub(r, cp) : B.radQuad(r, cp, { mode: k }); }),
      Q(4, 'AN3', 'MAS', 'Two radicals.', B.radTwice)] });

  HW.defineExit({ lesson: 'u4l8', calc: false, outcome: 'RF1',
    blurb: 'Unit 4 review: factoring fully (RF1), solving a quadratic equation by factoring (RF5), a radical equation with an extraneous root (AN3), and the other root of an equation from one root (RF5).',
    questions: [Q(1, 'RF1', 'BEG', 'Factor.', function (r, cp) { var k = r.pick(['monic', 'decomp', 'dos']); return k === 'monic' ? B.monic(r, cp, { mode: r.chance(0.5) ? 'basic' : 'two' }) : k === 'decomp' ? B.decomp(r, cp) : B.dos(r, cp); }),
      Q(2, 'RF5', 'PRG', 'Solve by factoring.', opt(B.solveStd, { mode: 'expand' })),
      Q(3, 'AN3', 'PRG', 'Solve and verify.', function (r, cp) { return B.radQuad(r, cp, { mode: r.chance(0.6) ? 'isolate' : 'coef' }); }),
      Q(4, 'RF5', 'MAS', 'Working backwards.', B.rootKOne)] });
})(window);
