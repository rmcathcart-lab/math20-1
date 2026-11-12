/* Math 20-1 · Unit 7 (Absolute Value and Reciprocal Functions) — exit slips for Lessons 1–8 (u7l1x … u7l8x), written in
 * test mode at the end of class. There are no older exit slips for this course: each slip is written from Ryan's Unit 7
 * booklet (m201book/unit7/u7_lXX.tex and u7_epXX.tex), four short questions (5–8 minutes): Beginning = the lesson's
 * first-taught skill, Progressing = the typical assignment question, Mastery = one of the lesson's harder assignment /
 * extra-practice items. New numbers every time. Calculator allowed on every slip; answers exact where exactness is the
 * skill. Outcomes as the catalog lists them: Lesson 1 AN1, Lessons 2–5 RF2 (graphs of |f(x)| and absolute value
 * equations), Lessons 6–7 RF11, Lesson 8 (review) per question. Two-absolute-value equations (L5 §4) are left out.
 *   7.1  evaluating with absolute values: order of operations, a minus outside the bars, nested bars (BEG) · the exact
 *        distance between two fractions, decimals or radicals (PRG) · ordering expressions (PRG) · simplifying for
 *        x < 0 or on an interval, or a and b from |a| and |a − b| (MAS, L1 #13, EP01 C1–C3)
 *   7.2  the vertex and y-intercept of y = |ax + b| (BEG) · a point on y = f(x) → y = |f(x)|, or back (BEG) · the
 *        piecewise form of y = |ax + b| (PRG) · working backwards: a vertex, a y-intercept, or f from the V graph
 *        (MAS, L2 #10, #18)
 *   7.3  the invariant points of y = |f(x)|, f quadratic, or none (BEG) · the range of y = |a(x − p)² + q| (PRG) · the
 *        piecewise form of y = |ax² + bx + c| (PRG) · working backwards: k from the range, the three-point line, the
 *        middle arc, f from the W graph (MAS, L3 Ex 7, #9–11, #18)
 *   7.4  |A| = c after isolating, or no solution (BEG) · |ax + b| = cx + d with extraneous roots (PRG) · |x − a| = d from
 *        its solutions (PRG) · a number and its distance from h, or the values of k with no solution (MAS, L4 #13–14)
 *   7.5  |x² − n| = k (BEG) · |x² + bx + c| = k, isolating first (PRG) · how many solutions |f(x)| = k has (PRG) ·
 *        |A| = B with a quadratic and extraneous roots (MAS, L5 Ex 4, #7)
 *   7.6  the asymptotes and y-intercept of y = 1/(ax + b) (BEG) · a point on y = f(x) ↔ y = 1/f(x) (BEG) · the graph of
 *        y = 1/f(x) from a line (PRG, MC) · a linear f from the reciprocal's asymptote and a point, its invariant points
 *        or its y-intercept (MAS, L6 #7–8, #11)
 *   7.7  the vertical asymptotes of y = 1/f(x): two, one or none (BEG) · the turning point and its type (PRG) · the range
 *        of y = 1/f(x) (PRG) · f from the reciprocal's turning point and y-intercept or asymptotes (MAS, L7 Ex 6, #7–8)
 *   7.8  (review) evaluating for given values (AN1, BEG) · |ax + b| = cx + d, or a piecewise form (RF2, PRG) · the exact
 *        invariant points of y = 1/f(x), f quadratic (RF11, PRG) · a parameter from the reciprocal's features (RF11,
 *        MAS, L8 #26, EP08 #14)
 * The generators, checkers and wrong-answer codes are the Unit 7 assessment kit HW.u7assess in js/lessons/u7test.js (so
 * that file loads first; labels and partial-credit decisions are registered there); here they run with the u7x- codes. */
(function (root) {
  'use strict';
  var HW = root.HW, A = HW.u7assess;
  if (!A) throw new Error('js/exits/u7.js needs js/lessons/u7test.js (the Unit 7 assessment kit) loaded first');
  var B = A.B, CP = 'u7x-';
  function Q(num, outcome, level, stem, fn) { return { num: String(num), outcome: outcome, stem: stem, parts: [{ id: String(num), outcome: outcome, level: level, make: function (r) { return fn(r, CP); } }] }; }
  function opt(fn, o) { return function (r, cp) { return fn(r, cp, o); }; }

  HW.defineExit({ lesson: 'u7l1', calc: true, outcome: 'AN1',
    blurb: 'Absolute value of real numbers: evaluating with the bars, the exact distance between two numbers, ordering expressions, and simplifying without absolute value symbols.',
    questions: [Q(1, 'AN1', 'BEG', 'Evaluate.', B.evalAbs), Q(2, 'AN1', 'PRG', 'A distance.', opt(B.distance, { kinds: ['frac', 'rad', 'dec'] })),
      Q(3, 'AN1', 'PRG', 'Order.', B.order), Q(4, 'AN1', 'MAS', 'Without the bars.', B.simplify)] });

  HW.defineExit({ lesson: 'u7l2', calc: true, outcome: 'RF2',
    blurb: 'Graphs of y = |f(x)| for linear f: the vertex and y-intercept, matching points, the piecewise form, and working backwards from a V.',
    questions: [Q(1, 'RF2', 'BEG', 'The V.', B.linFeat), Q(2, 'RF2', 'BEG', 'A point.', B.absPoint),
      Q(3, 'RF2', 'PRG', 'Piecewise form.', B.linPiece), Q(4, 'RF2', 'MAS', 'Working backwards.', B.linBack)] });

  HW.defineExit({ lesson: 'u7l3', calc: true, outcome: 'RF2',
    blurb: 'Graphs of y = |f(x)| for quadratic f: the invariant points, the range, the piecewise form, and working backwards from a W.',
    questions: [Q(1, 'RF2', 'BEG', 'Invariant points.', B.quadInv), Q(2, 'RF2', 'PRG', 'The range.', B.quadRange),
      Q(3, 'RF2', 'PRG', 'Piecewise form.', B.quadPiece), Q(4, 'RF2', 'MAS', 'Working backwards.', B.quadBack)] });

  HW.defineExit({ lesson: 'u7l4', calc: true, outcome: 'RF2',
    blurb: 'Absolute value equations (linear): isolating and solving |A| = c, solving |ax + b| = cx + d and rejecting extraneous roots, an equation from its solutions, and a problem.',
    questions: [Q(1, 'RF2', 'BEG', 'Solve.', B.absConst), Q(2, 'RF2', 'PRG', 'Solve and verify.', B.absLin),
      Q(3, 'RF2', 'PRG', 'An equation from its solutions.', B.fromSol),
      Q(4, 'RF2', 'MAS', 'A problem.', function (r, cp) { return r.chance(0.55) ? B.absWord(r, cp, { kinds: ['dist'] }) : B.absKnone(r, cp); })] });

  HW.defineExit({ lesson: 'u7l5', calc: true, outcome: 'RF2',
    blurb: 'Absolute value equations (quadratic): |x² − n| = k, |x² + bx + c| = k, the number of solutions, and |A| = B with a quadratic and extraneous roots.',
    questions: [Q(1, 'RF2', 'BEG', 'Solve.', opt(B.absQuadK, { modes: ['sq'] })), Q(2, 'RF2', 'PRG', 'Solve.', opt(B.absQuadK, { modes: ['gen', 'iso'] })),
      Q(3, 'RF2', 'PRG', 'How many solutions?', B.absCount), Q(4, 'RF2', 'MAS', 'Solve and verify.', B.absQuadVar)] });

  HW.defineExit({ lesson: 'u7l6', calc: true, outcome: 'RF11',
    blurb: 'Reciprocals of linear functions: the asymptotes and y-intercept, matching points, the graph of y = 1/f(x) from a line, and a linear f from its reciprocal.',
    questions: [Q(1, 'RF11', 'BEG', 'Asymptotes.', B.recLinFeat), Q(2, 'RF11', 'BEG', 'A point.', B.recPoint),
      Q(3, 'RF11', 'PRG', 'The reciprocal graph.', B.recMatch), Q(4, 'RF11', 'MAS', 'Working backwards.', B.recLinBack)] });

  HW.defineExit({ lesson: 'u7l7', calc: true, outcome: 'RF11',
    blurb: 'Reciprocals of quadratic functions: the vertical asymptotes, the turning point and its type, the range, and a quadratic f from its reciprocal.',
    questions: [Q(1, 'RF11', 'BEG', 'Vertical asymptotes.', B.recQuadVA), Q(2, 'RF11', 'PRG', 'The turning point.', B.recQuadTurn),
      Q(3, 'RF11', 'PRG', 'The range.', B.recQuadRange), Q(4, 'RF11', 'MAS', 'Working backwards.', B.recQuadBack)] });

  HW.defineExit({ lesson: 'u7l8', calc: true, outcome: 'AN1',
    blurb: 'Unit 7 review: evaluating with absolute values (AN1), an absolute value equation or piecewise form (RF2), the invariant points of a reciprocal (RF11), and a parameter from a reciprocal graph (RF11).',
    questions: [Q(1, 'AN1', 'BEG', 'Evaluate.', B.evalVar),
      Q(2, 'RF2', 'PRG', 'Absolute value.', function (r, cp) { return r.chance(0.6) ? B.absLin(r, cp) : B.quadPiece(r, cp); }),
      Q(3, 'RF11', 'PRG', 'Invariant points.', B.recQuadInv), Q(4, 'RF11', 'MAS', 'A parameter.', B.recQuadK)] });
})(window);
