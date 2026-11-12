/* Math 20-1 · Unit 6 (Rational Expressions and Equations) — exit slips for Lessons 1–10 (u6l1x … u6l10x), written in
 * test mode at the end of class. Calculator allowed (as on the Unit 6 test); answers stay exact. There are no older exit
 * slips for this course: each slip is written from Ryan's Unit 6 booklet (m201book/unit6/u6_lXX.tex and u6_epXX.tex), four
 * short questions (5–8 minutes): Beginning = the lesson's first-taught skill, Progressing = the typical assignment question,
 * Mastery = one of the lesson's harder assignment / extra-practice items. New numbers every time (the booklet's example
 * and assignment items are left out of the pools where they would come up often). Outcomes as the catalog sets them:
 * Lessons 1–2 AN4, Lessons 3–6 AN5, Lessons 7–9 AN6, Lesson 10 (review) per question.
 *   6.1  the NPVs of a monomial or linear denominator, or none (BEG) · evaluating, sometimes undefined (BEG) · the NPVs
 *        after factoring the denominator, or of a sum of two fractions (PRG) · one NPV given: the other (MAS, L1 #18)
 *   6.2  a monomial quotient with its NPVs (BEG) · simplifying by factoring: a common factor, trinomials, a ≠ 1 (PRG) ·
 *        opposite binomials (PRG) · the k that makes it simplify (MAS, L2 #9e, #19)
 *   6.3  monomial fractions multiplied (BEG) · binomial factors and common factors (PRG) · trinomials or opposite factors
 *        (PRG) · three expressions multiplied (MAS, L3 #6)
 *   6.4  the NPVs of a division, not simplified (BEG) · dividing with binomial factors (BEG) · dividing trinomials (PRG) ·
 *        three expressions multiplied and divided (MAS, L4 #7)
 *   6.5  one denominator (BEG) · monomial denominators with number numerators (BEG) · binomial numerators or a whole-number
 *        term (PRG) · the k that makes a difference a constant (MAS, L5 #12)
 *   6.6  two binomial denominators (BEG) · a common factor or a difference of squares first (PRG) · trinomial or opposite
 *        denominators (PRG) · a sum that simplifies (MAS, L6 #18–19)
 *   6.7  the NPVs of an equation (BEG) · monomial denominators (BEG) · cross-multiplying or binomial and trinomial
 *        denominators (PRG) · an equation whose only root is an NPV, or one that has a root (MAS, L7 #8)
 *   6.8  x − c/x = b and similar (BEG) · cross-multiplying to a quadratic (PRG) · an extraneous root (PRG) · exact roots by
 *        the quadratic formula, or the other root from one root (MAS, L8 #6, #11)
 *   6.9  work together (BEG) · which equation models a same-time problem (PRG, MC: recognizing the model is the skill) ·
 *        same time: speeds, wind or current (PRG) · a problem that leads to a quadratic (MAS, L9 #4, #7, #10)
 *   6.10 (review) simplifying by factoring (AN4, BEG) · dividing or adding with trinomials (AN5, PRG) · an equation with an
 *        extraneous root (AN6, PRG) · a problem that leads to a quadratic (AN6, MAS, L10 #24–27, EP10 C3–C4)
 * The generators, checkers and wrong-answer codes are the Unit 6 assessment kit HW.u6assess in js/lessons/u6test.js (so
 * that file loads first; labels and partial-credit decisions are registered there); here they run with the u6x- codes.
 * "Simplify and state the NPVs" is one part with two boxes; expressions are checked by value and for simplest form, NPVs as
 * "x ≠ a, b" (or "none"), roots as "x = a, x = b" (or "no solution"). */
(function (root) {
  'use strict';
  var HW = root.HW, A = HW.u6assess;
  if (!A) throw new Error('js/exits/u6.js needs js/lessons/u6test.js (the Unit 6 assessment kit) loaded first');
  var B = A.B, CP = 'u6x-';
  function Q(num, outcome, level, stem, fn) { return { num: String(num), outcome: outcome, stem: stem, parts: [{ id: String(num), outcome: outcome, level: level, make: function (r) { return fn(r, CP); } }] }; }
  function opt(fn, o) { return function (r, cp) { return fn(r, cp, o); }; }

  HW.defineExit({ lesson: 'u6l1', calc: true, outcome: 'AN4',
    blurb: 'Rational expressions and non-permissible values: the NPVs of a simple denominator, evaluating (or undefined), the NPVs after factoring, and the other NPV once one is given.',
    questions: [Q(1, 'AN4', 'BEG', 'Non-permissible values.', opt(B.npv, { mode: 'lin' })), Q(2, 'AN4', 'BEG', 'Evaluate.', B.evalAt),
      Q(3, 'AN4', 'PRG', 'Factor the denominator first.', function (r, cp) { return B.npv(r, cp, { mode: r.chance(0.75) ? 'fac' : 'two' }); }), Q(4, 'AN4', 'MAS', 'Working backwards.', B.npvK)] });

  HW.defineExit({ lesson: 'u6l2', calc: true, outcome: 'AN4',
    blurb: 'Simplifying rational expressions: a quotient of monomials, factoring the numerator and the denominator, opposite binomials, and the k that makes an expression simplify.',
    questions: [Q(1, 'AN4', 'BEG', 'Simplify.', B.simpMono), Q(2, 'AN4', 'PRG', 'Simplify by factoring.', function (r, cp) { return B.simpRat(r, cp, { mode: r.pick(['gcf', 'tri', 'a', 'cubic']) }); }),
      Q(3, 'AN4', 'PRG', 'Opposite binomials.', opt(B.simpRat, { mode: 'opp' })), Q(4, 'AN4', 'MAS', 'Working backwards.', B.simpK)] });

  HW.defineExit({ lesson: 'u6l3', calc: true, outcome: 'AN5',
    blurb: 'Multiplying rational expressions: monomial fractions, binomial and common factors, trinomials or opposite factors, and three expressions.',
    questions: [Q(1, 'AN5', 'BEG', 'Multiply.', B.mulMono), Q(2, 'AN5', 'PRG', 'Multiply.', opt(B.mulRat, { mode: 'bin' })),
      Q(3, 'AN5', 'PRG', 'Multiply.', function (r, cp) { return B.mulRat(r, cp, { mode: r.chance(0.6) ? 'tri' : 'opp' }); }), Q(4, 'AN5', 'MAS', 'Three expressions.', opt(B.mixed3, { kind: 'mmm' }))] });

  HW.defineExit({ lesson: 'u6l4', calc: true, outcome: 'AN5',
    blurb: 'Dividing rational expressions: the NPVs of a division (including the divisor’s numerator), dividing with binomial factors and with trinomials, and three expressions multiplied and divided.',
    questions: [Q(1, 'AN5', 'BEG', 'Non-permissible values.', B.npvDiv), Q(2, 'AN5', 'BEG', 'Divide.', opt(B.divRat, { mode: 'bin' })),
      Q(3, 'AN5', 'PRG', 'Divide.', opt(B.divRat, { mode: 'tri' })), Q(4, 'AN5', 'MAS', 'Three expressions.', B.mixed3)] });

  HW.defineExit({ lesson: 'u6l5', calc: true, outcome: 'AN5',
    blurb: 'Adding and subtracting with monomial denominators: one denominator, number numerators over monomials, binomial numerators or a whole-number term, and the k that makes a difference a constant.',
    questions: [Q(1, 'AN5', 'BEG', 'One denominator.', B.addSame), Q(2, 'AN5', 'BEG', 'Monomial denominators.', opt(B.addMono, { mode: 'num' })),
      Q(3, 'AN5', 'PRG', 'Monomial denominators.', function (r, cp) { return B.addMono(r, cp, { mode: r.chance(0.7) ? 'bin' : 'whole' }); }), Q(4, 'AN5', 'MAS', 'Working backwards.', B.addK)] });

  HW.defineExit({ lesson: 'u6l6', calc: true, outcome: 'AN5',
    blurb: 'Adding and subtracting with binomial and trinomial denominators: two binomials, factoring first, trinomial or opposite denominators, and a sum that simplifies.',
    questions: [Q(1, 'AN5', 'BEG', 'Binomial denominators.', function (r, cp) { return B.addBin(r, cp, { mode: r.chance(0.7) ? 'lin' : 'num' }); }), Q(2, 'AN5', 'PRG', 'Factor first.', opt(B.addBin, { mode: 'gcf' })),
      Q(3, 'AN5', 'PRG', 'Trinomial or opposite denominators.', function (r, cp) { return B.addBin(r, cp, { mode: r.chance(0.6) ? 'tri' : 'opp' }); }), Q(4, 'AN5', 'MAS', 'A sum that simplifies.', opt(B.addBin, { mode: 'red' }))] });

  HW.defineExit({ lesson: 'u6l7', calc: true, outcome: 'AN6',
    blurb: 'Solving rational equations: the NPVs of an equation, monomial denominators, cross-multiplying or binomial and trinomial denominators, and an equation that may have no solution.',
    questions: [Q(1, 'AN6', 'BEG', 'Non-permissible values.', B.npvEq), Q(2, 'AN6', 'BEG', 'Solve.', B.eqMono),
      Q(3, 'AN6', 'PRG', 'Solve.', function (r, cp) { return r.chance(0.5) ? B.eqCross(r, cp, { mode: 'lin' }) : B.eqBin(r, cp, {}); }), Q(4, 'AN6', 'MAS', 'Solve, or show there is no solution.', function (r, cp) { return B.eqBin(r, cp, { none: r.chance(0.7) }); })] });

  HW.defineExit({ lesson: 'u6l8', calc: true, outcome: 'AN6',
    blurb: 'Rational equations that lead to quadratics: x − c/x = b, cross-multiplying to a quadratic, rejecting an extraneous root, and exact roots by the quadratic formula (or the other root from one root).',
    questions: [Q(1, 'AN6', 'BEG', 'Solve.', B.eqQuad), Q(2, 'AN6', 'PRG', 'Solve.', opt(B.eqCross, { mode: 'quad' })),
      Q(3, 'AN6', 'PRG', 'An extraneous root.', B.eqExtr), Q(4, 'AN6', 'MAS', 'Solve.', function (r, cp) { return r.chance(0.65) ? B.eqFormula(r, cp) : B.eqRootK(r, cp); })] });

  HW.defineExit({ lesson: 'u6l9', calc: true, outcome: 'AN6',
    blurb: 'Problems with rational equations: work together, the equation for a same-time problem, speeds with the same time (or wind and current), and a problem that leads to a quadratic.',
    questions: [Q(1, 'AN6', 'BEG', 'Work rate.', opt(B.wWork, { mode: 'together' })), Q(2, 'AN6', 'PRG', 'The model.', B.wModel),
      Q(3, 'AN6', 'PRG', 'Distance, speed and time.', function (r, cp) { return B.wSpeed(r, cp, { mode: r.chance(0.5) ? 'same' : 'wind' }); }),
      Q(4, 'AN6', 'MAS', 'A problem.', function (r, cp) { var k = r.pick(['diff', 'round', 'faster', 'pos']); return k === 'faster' ? B.wWork(r, cp, { mode: 'faster' }) : k === 'pos' ? B.wNum(r, cp, { mode: 'pos' }) : B.wSpeed(r, cp, { mode: k }); })] });

  HW.defineExit({ lesson: 'u6l10', calc: true, outcome: 'AN4',
    blurb: 'Unit 6 review: simplifying by factoring (AN4), dividing or adding with trinomials (AN5), an equation with an extraneous root (AN6), and a problem that leads to a quadratic (AN6).',
    questions: [Q(1, 'AN4', 'BEG', 'Simplify.', function (r, cp) { return B.simpRat(r, cp, { mode: r.pick(['tri', 'gcf', 'a']) }); }),
      Q(2, 'AN5', 'PRG', 'Simplify.', function (r, cp) { return r.chance(0.5) ? B.divRat(r, cp, { mode: 'tri' }) : B.addBin(r, cp, { mode: 'tri' }); }),
      Q(3, 'AN6', 'PRG', 'Solve.', B.eqExtr),
      Q(4, 'AN6', 'MAS', 'A problem.', function (r, cp) { var k = r.pick(['diff', 'faster', 'pos', 'recip']); return k === 'faster' ? B.wWork(r, cp, { mode: 'faster' }) : k === 'diff' ? B.wSpeed(r, cp, { mode: 'diff' }) : B.wNum(r, cp, { mode: k }); })] });
})(window);
