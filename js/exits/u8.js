/* Math 20-1 · Unit 8 (Systems of Equations and Inequalities) — exit slips for Lessons 1–8 (u8l1x … u8l8x), written in
 * test mode at the end of class. Calculator allowed (as on the Unit 8 test); answers stay exact unless a question asks to
 * round. There are no older exit slips for this course: each slip is written from Ryan's Unit 8 booklet
 * (m201book/unit8/u8_lXX.tex and u8_epXX.tex), four short questions (5–8 minutes): Beginning = the lesson's first-taught
 * skill, Progressing = the typical assignment question, Mastery = one of the lesson's harder assignment / extra-practice
 * items. New numbers every time (the booklet's example and assignment items are left out of the pools where they would
 * come up often). Outcomes as the course plan tags them: Lessons 1–3 RF6, Lessons 4–5 RF7, Lessons 6–7 RF8, Lesson 8
 * (review) per question.
 *   8.1  a linear–quadratic system by substitution (BEG) · the number of solutions from the discriminant (BEG, MC) ·
 *        a ≠ 1, a standard-form line, a tangent or no solution (PRG) · the values of k (or c) for two / one / no points,
 *        or every tangent slope with its point (MAS, L1 Ex 6, #8–9, EP01 C2)
 *   8.2  a quadratic–quadratic system by elimination (BEG) · the x²-terms cancel: one, none or infinitely many (BEG) ·
 *        fractional coefficients, rearranged equations or a fractional root (PRG) · the k that gives one solution, and
 *        that solution (MAS, L2 Ex 7, #8, EP02 B4)
 *   8.3  a number problem, both pairs (BEG) · two balls thrown at the same moment (PRG) · break-even or a rectangle from
 *        its perimeter and diagonal (PRG) · h = −5(t − p)² + q from two data points (MAS, L3 Ex 8, #12, EP03 B4)
 *   8.4  which points are solutions (BEG) · solid/dashed and above/below once y is alone (BEG, MC) · the inequality of a
 *        shaded region or from its description (PRG) · the corner of a system of inequalities in context (MAS, L4 Ex 8,
 *        #11, EP04 C2)
 *   8.5  which points are solutions of y ≷ ax² + bx + c (BEG) · rearranging, often dividing by a negative (BEG, MC) · the
 *        inequality from a vertex and a point or the intercepts (PRG) · the tallest centred load under an arch built
 *        from its width and height (MAS, L5 #10, EP05 B4)
 *   8.6  from the graph of the parabola (BEG) · roots and test points (monic, a common factor, a difference of squares,
 *        a ≠ 1, rearranging) (PRG) · one root or none (PRG) · the values of k for two / no real roots (MAS, L6 #9–10)
 *   8.7  a factored product by case analysis (BEG) · the product row of a sign chart (PRG, MC) · a negative leading
 *        coefficient or rearranging (PRG) · how long a ball is above a height, widths with a restriction, prices that
 *        give a profit, or writing the inequality for a solution set (MAS, L7 #7–10, nr, EP07 B1–B3)
 *   8.8  (review) a system (RF6, BEG) · the inequality of a shaded region (RF7, PRG) · a one-variable inequality that needs
 *        rearranging (RF8, PRG) · every tangent slope with its point (RF6, MAS, L8 #4, EP08 B2)
 * The generators, checkers and wrong-answer codes are the Unit 8 assessment kit HW.u8assess in js/lessons/u8test.js (so
 * that file loads first; labels and partial-credit decisions are registered there); here they run with the u8x- codes.
 * Systems: ordered pairs "(3, 10), (-2, -5)" or "no solution" / "infinitely many". One-variable inequalities: set
 * notation, a plain inequality ("x < -2 or x > 3") or intervals. Two-variable inequalities: any equivalent inequality. */
(function (root) {
  'use strict';
  var HW = root.HW, A = HW.u8assess;
  if (!A) throw new Error('js/exits/u8.js needs js/lessons/u8test.js (the Unit 8 assessment kit) loaded first');
  var B = A.B, CP = 'u8x-';
  function Q(num, outcome, level, stem, fn) { return { num: String(num), outcome: outcome, stem: stem, parts: [{ id: String(num), outcome: outcome, level: level, make: function (r) { return fn(r, CP); } }] }; }
  function opt(fn, o) { return function (r, cp) { return fn(r, cp, o); }; }

  HW.defineExit({ lesson: 'u8l1', calc: true, outcome: 'RF6',
    blurb: 'Linear–quadratic systems: solve by substitution, count the solutions with the discriminant, a system with a ≠ 1 or a line in standard form (sometimes tangent or with no solution), and the constants that make a line tangent.',
    questions: [Q(1, 'RF6', 'BEG', 'Solve the system.', opt(B.lqSolve, { mode: 'basic' })), Q(2, 'RF6', 'BEG', 'How many solutions?', B.lqCount),
      Q(3, 'RF6', 'PRG', 'Solve the system.', opt(B.lqSolve, { mode: 'mix' })),
      Q(4, 'RF6', 'MAS', 'Tangents.', function (r, cp) { return r.chance(0.5) ? B.lqK(r, cp) : B.tangentM(r, cp); })] });

  HW.defineExit({ lesson: 'u8l2', calc: true, outcome: 'RF6',
    blurb: 'Quadratic–quadratic systems: solve by elimination, systems whose x²-terms cancel (one, none or infinitely many solutions), fractional coefficients or rearranged equations, and the k that gives exactly one solution.',
    questions: [Q(1, 'RF6', 'BEG', 'Solve the system.', opt(B.qqSolve, { mode: 'basic' })), Q(2, 'RF6', 'BEG', 'When the x²-terms cancel.', opt(B.qqSolve, { mode: 'cancel' })),
      Q(3, 'RF6', 'PRG', 'Solve the system.', opt(B.qqSolve, { mode: 'mix' })), Q(4, 'RF6', 'MAS', 'Exactly one solution.', B.qqOne)] });

  HW.defineExit({ lesson: 'u8l3', calc: true, outcome: 'RF6',
    blurb: 'Problems with systems: a number problem with two pairs, two objects thrown at the same moment, break-even or a rectangle from its perimeter and diagonal, and a height model from two data points.',
    questions: [Q(1, 'RF6', 'BEG', 'A number problem.', B.numberPair), Q(2, 'RF6', 'PRG', 'Two thrown objects.', B.twoBalls),
      Q(3, 'RF6', 'PRG', 'A problem.', function (r, cp) { return r.chance(0.5) ? B.breakEven(r, cp) : B.rectSys(r, cp); }), Q(4, 'RF6', 'MAS', 'A model from data.', B.pqModel)] });

  HW.defineExit({ lesson: 'u8l4', calc: true, outcome: 'RF7',
    blurb: 'Linear inequalities in two variables: which points are solutions, solid or dashed and which side once y is alone, the inequality of a shaded region, and the corner of a system of inequalities in context.',
    questions: [Q(1, 'RF7', 'BEG', 'Solutions of an inequality.', opt(B.ptsGrid, { kind: 'lin' })), Q(2, 'RF7', 'BEG', 'The boundary and the side.', opt(B.bdMC, { kind: 'lin' })),
      Q(3, 'RF7', 'PRG', 'Write the inequality.', B.writeLin), Q(4, 'RF7', 'MAS', 'A system of inequalities in context.', B.cornerCtx)] });

  HW.defineExit({ lesson: 'u8l5', calc: true, outcome: 'RF7',
    blurb: 'Quadratic inequalities in two variables: which points are solutions, rearranging to read the boundary and the side, the inequality from a vertex or intercepts, and the tallest load under a parabolic arch.',
    questions: [Q(1, 'RF7', 'BEG', 'Solutions of an inequality.', opt(B.ptsGrid, { kind: 'quad' })), Q(2, 'RF7', 'BEG', 'The boundary and the side.', opt(B.bdMC, { kind: 'quad' })),
      Q(3, 'RF7', 'PRG', 'Write the inequality.', B.writeQuad), Q(4, 'RF7', 'MAS', 'A parabolic arch.', opt(B.archLoad, { mode: 'build' }))] });

  HW.defineExit({ lesson: 'u8l6', calc: true, outcome: 'RF8',
    blurb: 'Quadratic inequalities in one variable by roots and test points: from a graph, by testing intervals, the one-root and no-root cases, and the values of k for two or no real roots.',
    questions: [Q(1, 'RF8', 'BEG', 'From a graph.', B.graph1), Q(2, 'RF8', 'PRG', 'Roots and test points.', opt(B.solve1, { mode: ['monic', 'gcf', 'dos', 'dec', 'rearr'] })),
      Q(3, 'RF8', 'PRG', 'One root or none.', B.special1), Q(4, 'RF8', 'MAS', 'Real roots.', opt(B.kRoots, { mode: 'simple' }))] });

  HW.defineExit({ lesson: 'u8l7', calc: true, outcome: 'RF8',
    blurb: 'Quadratic inequalities by sign analysis: a factored product by cases, the product row of a sign chart, a negative leading coefficient or rearranging, and a problem (height, area or profit) or writing the inequality for a solution.',
    questions: [Q(1, 'RF8', 'BEG', 'Case analysis.', opt(B.solve1, { mode: 'factored' })), Q(2, 'RF8', 'PRG', 'A sign chart.', B.signRow),
      Q(3, 'RF8', 'PRG', 'Solve.', opt(B.solve1, { mode: ['neg', 'neg', 'dec', 'rearr'] })),
      Q(4, 'RF8', 'MAS', 'A problem.', function (r, cp) { return r.chance(0.25) ? B.writeFromSet(r, cp) : B.heightCtx(r, cp, { mode: r.pick(['duration', 'rect', 'profit', 'interval']) }); })] });

  HW.defineExit({ lesson: 'u8l8', calc: true, outcome: 'RF6',
    blurb: 'Unit 8 review: a system (RF6), the inequality of a shaded region (RF7), a one-variable inequality that needs rearranging (RF8), and every tangent slope with its point of tangency (RF6).',
    questions: [Q(1, 'RF6', 'BEG', 'Solve the system.', function (r, cp) { return r.chance(0.6) ? B.lqSolve(r, cp, { mode: 'basic' }) : B.qqSolve(r, cp, { mode: 'basic' }); }),
      Q(2, 'RF7', 'PRG', 'Write the inequality.', function (r, cp) { return r.chance(0.5) ? B.writeLin(r, cp, { words: false }) : B.writeQuad(r, cp); }),
      Q(3, 'RF8', 'PRG', 'Solve.', opt(B.solve1, { mode: ['rearr', 'dec', 'neg'] })), Q(4, 'RF6', 'MAS', 'Tangent lines.', B.tangentM)] });
})(window);
