/* Math 20-1 · Unit 3 (Trigonometry) — exit slips for Lessons 1–9 (u3l1x … u3l9x), written in test mode at the end of
 * class. There were no older Math 20-1 exit slips, so each slip is written from Ryan's booklet (m201book/unit3/u3_l0N.tex
 * and u3_ep0N.tex): four short questions, about 5–8 minutes, Beginning → Progressing → Mastery, on that lesson's core
 * skills with new numbers (the lesson's examples and the assignment's own items are left out of the pools where they
 * could come up). Calculator allowed in Degree mode, except Lesson 4 (exact values: no calculator). Outcomes as the brief
 * sets them: Lesson 1 T1, Lessons 2–3 T2, Lesson 4 per question (exact angle T1, exact values T2), Lessons 5–8 T3,
 * Lesson 9 (review) per question.
 * The generators, checkers, figures and wrong-answer codes are the Unit 3 kit HW.u3tkit in js/lessons/u3test.js (so that
 * file loads first); here they run with the u3x- codes (labels and partial-credit decisions are registered there).
 *   3.1  reference angle (BEG) · the three other angles with the same reference angle (PRG) · the angle through a
 *        reflected point (PRG) · A and B in two quadrants from their sum or difference (MAS, EP01 C2)
 *   3.2  exact r from a point (BEG) · exact sin, cos, tan of a point in Quadrants II–IV (PRG) · θ to the tenth (PRG) ·
 *        (k, y) or (x, k) with a given r and quadrant: k and θ (MAS, EP02 C2)
 *   3.3  the quadrant from two signs (BEG, MC) · the other two exact ratios from one (PRG) · a·trig θ + b = c to the
 *        tenth, "no solution" possible (PRG) · A + B from cos A = cos α and sin B = sin β (MAS, L3 #17)
 *   3.4  (no calculator) an exact value, sometimes quadrantal or undefined (BEG, T2) · θ exactly from a point with radical
 *        coordinates (PRG, T1) · an equation solved exactly (PRG, T2) · a squared equation: four solutions (MAS, T2, L4 #8)
 *   3.5  a side by the sine law, full pair given (BEG) · a side when the third angle comes first (PRG) · a one-triangle
 *        SSA angle (PRG) · a height from two angles of elevation (MAS, L5 NR, EP05 B2)
 *   3.6  the third side (SAS) (BEG) · an angle from three sides (PRG) · two hikers on bearings (PRG) · the longer
 *        diagonal of a parallelogram (MAS, L6 #13)
 *   3.7  how many triangles (BEG) · every possible angle (PRG) · the lengths of a that give two triangles (PRG, L7 #4) ·
 *        both lengths of the third side (MAS, L7 #8)
 *   3.8  the most appropriate method (BEG, MC) · the area ½ab sin C (BEG) · the distance between clock-hand tips (PRG) ·
 *        two legs on bearings: the distance and the return bearing (MAS, L8 #4, L9 #14)
 *   3.9  (review) an angle from its reference angle (T1, BEG) · a·trig θ + b = c in a smaller interval (T2, PRG) · the
 *        largest angle from three sides (T3, PRG) · a quadrilateral split by a diagonal (T3, MAS, L9 #15) */
(function (root) {
  'use strict';
  var HW = root.HW, S = HW.u3tkit;
  if (!S) throw new Error('js/exits/u3.js needs js/lessons/u3test.js (the Unit 3 kit) loaded first');
  var B = S.build, CP = 'u3x-';
  function Q(num, outcome, level, stem, fn, o) { return { num: String(num), outcome: outcome, stem: stem, parts: [{ id: String(num), outcome: outcome, level: level, make: function (r) { return fn(r, CP, undefined, o); } }] }; }

  HW.defineExit({ lesson: 'u3l1', calc: true, outcome: 'T1',
    blurb: 'Angles in standard position: a reference angle, the three other angles with the same reference angle, the angle through a reflected point, and two angles from their sum or difference.',
    questions: [Q(1, 'T1', 'BEG', 'A reference angle.', B.refAngle), Q(2, 'T1', 'PRG', 'The same reference angle.', B.sameRef),
      Q(3, 'T1', 'PRG', 'A reflected point.', B.reflect), Q(4, 'T1', 'MAS', 'Two angles.', B.sumAB)] });

  HW.defineExit({ lesson: 'u3l2', calc: true, outcome: 'T2',
    blurb: 'Ratios from a point on the terminal arm: the exact distance r, the exact sin, cos and tan, the angle θ to the tenth, and a missing coordinate from r.',
    questions: [Q(1, 'T2', 'BEG', 'The distance r.', B.rDist), Q(2, 'T2', 'PRG', 'The three ratios.', B.ratios),
      Q(3, 'T2', 'PRG', 'The angle.', B.thetaPt), Q(4, 'T2', 'MAS', 'A missing coordinate.', B.kFind)] });

  HW.defineExit({ lesson: 'u3l3', calc: true, outcome: 'T2',
    blurb: 'The CAST rule: a quadrant from two signs, the other two exact ratios from one, an equation solved to the tenth, and the sum of two other angles with the same ratios.',
    questions: [Q(1, 'T2', 'BEG', 'Which quadrant?', B.quadSigns), Q(2, 'T2', 'PRG', 'The other ratios.', B.otherRatios),
      Q(3, 'T2', 'PRG', 'Solve.', function (r, cp) { return B.solveLinear(r, cp, { none: true }); }), Q(4, 'T2', 'MAS', 'Two other angles.', B.sumOther)] });

  HW.defineExit({ lesson: 'u3l4', calc: false, outcome: 'T2',
    blurb: 'Exact values from the special triangles (no calculator): an exact value, an exact angle from a point, an equation solved exactly, and a squared equation with four solutions.',
    questions: [Q(1, 'T2', 'BEG', 'An exact value.', B.exactVal, { mix: true }), Q(2, 'T1', 'PRG', 'An exact angle.', B.exactAngle),
      Q(3, 'T2', 'PRG', 'Solve exactly.', B.solveExact), Q(4, 'T2', 'MAS', 'A squared equation.', B.solveExact, { sq: true })] });

  HW.defineExit({ lesson: 'u3l5', calc: true, outcome: 'T3',
    blurb: 'The sine law: a side from a full pair, a side when the third angle comes first, an angle in a one-triangle case, and a height from two angles of elevation.',
    questions: [Q(1, 'T3', 'BEG', 'A side.', B.sineSide), Q(2, 'T3', 'PRG', 'Another side.', B.sineSide, { third: true }),
      Q(3, 'T3', 'PRG', 'An angle.', function (r, cp) { return B.ssaAngle(r, cp); }), Q(4, 'T3', 'MAS', 'A height.', B.twoElev)] });

  HW.defineExit({ lesson: 'u3l6', calc: true, outcome: 'T3',
    blurb: 'The cosine law: the third side (SAS), an angle from three sides, two hikers on bearings, and the longer diagonal of a parallelogram.',
    questions: [Q(1, 'T3', 'BEG', 'A side.', B.cosSide), Q(2, 'T3', 'PRG', 'An angle.', B.cosAngle),
      Q(3, 'T3', 'PRG', 'Two hikers.', B.hikers), Q(4, 'T3', 'MAS', 'A parallelogram.', B.parallelogram)] });

  HW.defineExit({ lesson: 'u3l7', calc: true, outcome: 'T3',
    blurb: 'The ambiguous case: how many triangles, every possible angle, the lengths that give two triangles, and both lengths of the third side.',
    questions: [Q(1, 'T3', 'BEG', 'How many triangles?', B.countTri), Q(2, 'T3', 'PRG', 'Every possible angle.', function (r, cp) { return B.ambAngles(r, cp, B.ambShared(r)); }),
      Q(3, 'T3', 'PRG', 'Two triangles.', B.ambRange), Q(4, 'T3', 'MAS', 'Both triangles.', function (r, cp) { return B.ambSides(r, cp, B.ambShared(r)); })] });

  HW.defineExit({ lesson: 'u3l8', calc: true, outcome: 'T3',
    blurb: 'Choosing the sine law or the cosine law: the most appropriate method, the area of a triangle, the distance between clock-hand tips, and a trip on two bearings (distance and return bearing).',
    questions: [Q(1, 'T3', 'BEG', 'Which method?', B.method), Q(2, 'T3', 'BEG', 'An area.', B.area),
      Q(3, 'T3', 'PRG', 'Clock hands.', B.clock), Q(4, 'T3', 'MAS', 'Bearings.', B.bearing, { ret: true })] });

  HW.defineExit({ lesson: 'u3l9', calc: true, outcome: 'T1',
    blurb: 'Unit 3 review: an angle from its reference angle (T1), an equation in a smaller interval (T2), the largest angle of a triangle (T3), and a quadrilateral split by a diagonal (T3).',
    questions: [Q(1, 'T1', 'BEG', 'An angle.', B.fromRef), Q(2, 'T2', 'PRG', 'Solve.', B.solveLinear, { interval: true }),
      Q(3, 'T3', 'PRG', 'The largest angle.', B.cosAngle, { largest: true }), Q(4, 'T3', 'MAS', 'Two triangles.', B.quadDiag)] });
})(window);
