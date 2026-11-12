/* Math 20-1 · Unit 5 (Quadratic Functions and Equations) — exit slips for Lessons 1–11 (u5l1x … u5l11x), written in test
 * mode at the end of class. Calculator allowed (as on the Unit 5 test); answers stay exact where exactness is the skill
 * (radical roots in simplest form, fractions in vertex form) and are rounded where the booklet rounds. There are no older
 * exit slips for this course: each slip is written from Ryan's Unit 5 booklet (m201book/unit5/u5_lXX.tex and
 * u5_epXX.tex), four short questions (5–8 minutes): Beginning = the lesson's first-taught skill, Progressing = the
 * typical assignment question, Mastery = one of the lesson's harder assignment / extra-practice items. New numbers every
 * time. Outcomes as the course plan tags them: Lesson 1 RF5, Lessons 2–3 RF3, Lesson 4 RF4, Lesson 5 RF3, Lesson 6 RF4,
 * Lessons 7–8 RF5, Lesson 9 RF4, Lesson 10 RF4 (its height question RF5), Lesson 11 (review) per question.
 *   5.1  the zeros of a function by factoring (BEG) · roots after moving terms (a cubic, a double root) (PRG) · factored
 *        form from the zeros and a point (PRG) · factored form from the zeros and the maximum, or k and the other zero
 *        (MAS, L1 #13, EP01 C2–C3)
 *   5.2  the image of y = x² after a translation (BEG) · after a stretch, a reflection and a translation (PRG) · the image
 *        of a point (PRG) · the stretch factor from a point on the image, or k on the final graph (MAS, EP02 C2, #8)
 *   5.3  the vertex from vertex form (BEG) · the range, the equation rearranged first (PRG) · the x-intercepts exactly
 *        (PRG) · values of q, q from the intercepts, or the two values of p (MAS, EP03 C1–C3)
 *   5.4  the axis x = −b/2a (BEG) · the vertex of factored form (PRG) · the vertex, range or maximum of general form
 *        (PRG) · an unknown coefficient (MAS, L4 #9, EP04 C1–C2)
 *   5.5  the equation from the vertex and a point, integer a (BEG) · a fractional a, or the y-/x-intercept as the point
 *        (PRG) · the equation of a graph (PRG) · the axis and two points, an arch, a fountain jet (MAS, L5 #8, #11, #13)
 *   5.6  completing the square, x² + bx + c (BEG) · a ≠ 1, negative or fractional (PRG) · a context maximum (PRG) · a
 *        parameter: the vertex on the x-axis, a given maximum, x² + 2mx + n (MAS, L6 #13, EP06 #6, C1)
 *   5.7  the quadratic formula, exact (BEG) · standard form first (PRG) · rounded roots (PRG) · a right triangle, a
 *        dog run, a ball, a diagonal (MAS, L7 #11–12, L11 #15)
 *   5.8  the discriminant (BEG) · the nature of the roots, rearranged (PRG) · values of k, or k for equal roots (PRG) ·
 *        a parameter in the leading coefficient, real roots with k ≠ 0, the greatest integer k (MAS, L8 #8–9, #18)
 *   5.9  the maximum height or its time from a graph (BEG) · when a ball lands, or is at a height (PRG) · a revenue
 *        problem (PRG) · whole numbers of weeks (MAS, L9 #6)
 *   5.10 the maximum or minimum value (BEG) · a number or fencing problem (PRG) · the times at a height (RF5, PRG) · a
 *        rectangle in a triangle, a wire cut into squares, a rectangle under a line (MAS, L10 #7, #10, EP10 B5)
 *   5.11 (review) the range from vertex form (RF3, BEG) · completing the square (RF4, PRG) · standard form then the
 *        quadratic formula (RF5, PRG) · an optimization problem (RF4, MAS)
 * The generators, checkers and wrong-answer codes are the Unit 5 assessment kit HW.u5assess in js/lessons/u5test.js (so
 * that file loads first; labels and partial-credit decisions are registered there); here they run with the u5x- codes. */
(function (root) {
  'use strict';
  var HW = root.HW, A = HW.u5assess;
  if (!A) throw new Error('js/exits/u5.js needs js/lessons/u5test.js (the Unit 5 assessment kit) loaded first');
  var B = A.B, CP = 'u5x-';
  function Q(num, outcome, level, stem, fn) { return { num: String(num), outcome: outcome, stem: stem, parts: [{ id: String(num), outcome: outcome, level: level, make: function (r) { return fn(r, CP); } }] }; }
  function opt(fn, o) { return function (r, cp) { return fn(r, cp, o); }; }

  HW.defineExit({ lesson: 'u5l1', calc: true, outcome: 'RF5',
    blurb: 'Zeros, roots and x-intercepts: the zeros of a function by factoring, roots after moving every term to one side, a function in factored form from its zeros and a point, and from its zeros and maximum value.',
    questions: [Q(1, 'RF5', 'BEG', 'Zeros.', B.zeros), Q(2, 'RF5', 'PRG', 'Roots.', B.rootsRearr), Q(3, 'RF5', 'PRG', 'A function from its zeros.', B.fromZeros), Q(4, 'RF5', 'MAS', 'Working backwards.', B.zerosMax)] });

  HW.defineExit({ lesson: 'u5l2', calc: true, outcome: 'RF3',
    blurb: 'Graphing y = a(x − p)² + q: the image of y = x² after a translation, after a stretch, a reflection and a translation, the image of a point, and the stretch factor from a point on the image.',
    questions: [Q(1, 'RF3', 'BEG', 'A translation.', opt(B.imageEq, { mode: 'trans' })), Q(2, 'RF3', 'PRG', 'Transformations.', opt(B.imageEq, { mode: 'full' })),
      Q(3, 'RF3', 'PRG', 'The image of a point.', B.imagePt), Q(4, 'RF3', 'MAS', 'Working backwards.', B.findA)] });

  HW.defineExit({ lesson: 'u5l3', calc: true, outcome: 'RF3',
    blurb: 'Characteristics of vertex form: the vertex, the range (solving for y first), the x-intercepts as exact values, and working backwards to q or p.',
    questions: [Q(1, 'RF3', 'BEG', 'The vertex.', opt(B.vertex, { rearr: false })), Q(2, 'RF3', 'PRG', 'The range.', opt(B.range, { rearr: true })),
      Q(3, 'RF3', 'PRG', 'The x-intercepts.', B.xintVF), Q(4, 'RF3', 'MAS', 'Working backwards.', B.vfBack)] });

  HW.defineExit({ lesson: 'u5l4', calc: true, outcome: 'RF4',
    blurb: 'General and factored form: the axis x = −b/2a, the vertex of y = a(x − r)(x − s), the vertex, range or maximum of general form, and an unknown coefficient.',
    questions: [Q(1, 'RF4', 'BEG', 'The axis of symmetry.', B.axisGen), Q(2, 'RF4', 'PRG', 'Factored form.', B.vertexFac),
      Q(3, 'RF4', 'PRG', 'General form.', B.vertexGen), Q(4, 'RF4', 'MAS', 'An unknown coefficient.', B.unknownCoef)] });

  HW.defineExit({ lesson: 'u5l5', calc: true, outcome: 'RF3',
    blurb: 'Writing the equation: from the vertex and a point (an integer a, then a fraction or an intercept), from a graph, and from the axis and two points, an arch or a fountain jet.',
    questions: [Q(1, 'RF3', 'BEG', 'The vertex and a point.', opt(B.vpEq, { mode: 'int' })), Q(2, 'RF3', 'PRG', 'The vertex and a point.', opt(B.vpEq, { mode: 'frac' })),
      Q(3, 'RF3', 'PRG', 'From a graph.', B.graphEq), Q(4, 'RF3', 'MAS', 'A problem.', B.vpMas)] });

  HW.defineExit({ lesson: 'u5l6', calc: true, outcome: 'RF4',
    blurb: 'Completing the square: x² + bx + c, a leading coefficient that is not 1 (negative or a fraction), a maximum in context, and a parameter.',
    questions: [Q(1, 'RF4', 'BEG', 'Complete the square.', opt(B.cts, { mode: 'monic' })), Q(2, 'RF4', 'PRG', 'Complete the square.', B.cts),
      Q(3, 'RF4', 'PRG', 'A maximum.', B.ctsCtx), Q(4, 'RF4', 'MAS', 'A parameter.', B.ctsK)] });

  HW.defineExit({ lesson: 'u5l7', calc: true, outcome: 'RF5',
    blurb: 'The quadratic formula: exact roots in simplest form, standard form first, roots to the nearest hundredth or tenth, and a problem.',
    questions: [Q(1, 'RF5', 'BEG', 'The quadratic formula.', B.qf), Q(2, 'RF5', 'PRG', 'Standard form first.', B.qfStd),
      Q(3, 'RF5', 'PRG', 'Rounded roots.', B.qfRound), Q(4, 'RF5', 'MAS', 'A problem.', B.qfWord)] });

  HW.defineExit({ lesson: 'u5l8', calc: true, outcome: 'RF5',
    blurb: 'The discriminant: its value, the nature of the roots, the values of k for two, one or no real roots (or equal roots), and a parameter in the leading coefficient.',
    questions: [Q(1, 'RF5', 'BEG', 'The discriminant.', B.disc), Q(2, 'RF5', 'PRG', 'The nature of the roots.', opt(B.nature, { rearr: true })),
      Q(3, 'RF5', 'PRG', 'Values of k.', function (r, cp) { return r.chance(0.65) ? B.kRange(r, cp) : B.kEqual(r, cp); }), Q(4, 'RF5', 'MAS', 'A parameter.', B.discMas)] });

  HW.defineExit({ lesson: 'u5l9', calc: true, outcome: 'RF4',
    blurb: 'Maximum and minimum problems with a graphing calculator: the maximum height and its time, when a ball lands or is at a height, a revenue problem, and a maximum over whole numbers.',
    questions: [Q(1, 'RF4', 'BEG', 'A maximum.', B.ctxGraph), Q(2, 'RF4', 'PRG', 'Zeros and intersections.', B.ctxLand),
      Q(3, 'RF4', 'PRG', 'Revenue.', B.revenue), Q(4, 'RF4', 'MAS', 'Whole numbers.', B.wholeWeeks)] });

  HW.defineExit({ lesson: 'u5l10', calc: true, outcome: 'RF4',
    blurb: 'Maximum and minimum problems with algebra: the maximum or minimum value, a number or fencing problem, the times at a given height (RF5), and an optimization problem.',
    questions: [Q(1, 'RF4', 'BEG', 'The maximum or minimum.', opt(B.vertexGen, { ask: 'max' })), Q(2, 'RF4', 'PRG', 'A problem.', function (r, cp) { return r.chance(0.5) ? B.fence(r, cp) : B.numbers(r, cp); }),
      Q(3, 'RF5', 'PRG', 'At a height.', B.height), Q(4, 'RF4', 'MAS', 'Optimization.', B.optMas)] });

  HW.defineExit({ lesson: 'u5l11', calc: true, outcome: 'RF3',
    blurb: 'Unit 5 review: the range from vertex form (RF3), completing the square (RF4), standard form then the quadratic formula (RF5), and an optimization problem (RF4).',
    questions: [Q(1, 'RF3', 'BEG', 'The range.', opt(B.range, { rearr: false })), Q(2, 'RF4', 'PRG', 'Complete the square.', B.cts),
      Q(3, 'RF5', 'PRG', 'The quadratic formula.', B.qfStd), Q(4, 'RF4', 'MAS', 'Optimization.', B.optMas)] });
})(window);
