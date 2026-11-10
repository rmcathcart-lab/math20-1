/* Math 20-1 · Unit 1 (Sequences and Series) — exit slips for Lessons 1–9 (u1l1x … u1l9x), written in test mode.
 * There were no older Math 20-1 exit slips, so each slip is written from Ryan's booklet (unit1/u1_l0N.tex and
 * u1_ep0N.tex): four short questions, about 5–8 minutes, Beginning → Progressing → Mastery, on that lesson's core
 * skills with new numbers (never the lesson's examples or the assignment's own items). Outcomes as the booklet tags
 * them: Lessons 1–4 RF9, Lessons 5–8 RF10, Lesson 9 (review) per question. Scientific calculator allowed.
 * The generators, checkers and wrong-answer codes are the Unit 1 kit HW.u1kit in js/lessons/u1test.js (so that file
 * loads first); here they run with the u1x- codes (labels and partial-credit decisions are registered there).
 *   1  classify (MC) · a term from a formula · is V a term (or none) · the first negative term (position and value)
 *   2  t_k from the first terms · general term in simplest form · number of terms · three expressions → x and d
 *   3  d from two terms · general term from two terms · simple interest · rows from two rows and the last row
 *   4  sum from the first and last terms · sum up to a last term · t_k from S_n = an² + bn · two rows → total seats
 *   5  geometric general term · exact t_k · number of terms · three expressions → x and r
 *   6  growth factor · depreciation by a percent · doubling / half-life · first full year past a target (table)
 *   7  geometric sum from t1, r, n · sum up to a last term · terms needed for a sum · bouncing ball at the kth landing
 *   8  r and S∞ or none · repeating decimal → fraction · missing t1 or r (or none) · ball bouncing forever
 *   9  (review) arithmetic means → d (RF9) · stacked cans total (RF9) · t1 from two terms, rounded (RF10) · ice
 *      thickness after k weeks (RF10) */
(function (root) {
  'use strict';
  var HW = root.HW, S = HW.u1kit;
  if (!S) throw new Error('js/exits/u1.js needs js/lessons/u1test.js (the Unit 1 kit) loaded first');
  var B = S.build, CP = 'u1x-';
  function Q(num, outcome, level, stem, fn) { return { num: String(num), outcome: outcome, stem: stem, parts: [{ id: String(num), outcome: outcome, level: level, make: function (r) { return fn(r, CP); } }] }; }

  HW.defineExit({ lesson: 'u1l1', calc: true, outcome: 'RF9',
    blurb: 'Patterns and the general term: classify a sequence, evaluate a term from a formula, decide whether a number is a term, and find the first negative term.',
    questions: [Q(1, 'RF9', 'BEG', 'Arithmetic, geometric or neither?', B.classify), Q(2, 'RF9', 'BEG', 'A term from a formula.', B.termFromFormula),
      Q(3, 'RF9', 'PRG', 'Is it a term?', function (r, cp) { return B.isTerm(r, cp, { formula: true }); }), Q(4, 'RF9', 'MAS', 'The first negative term.', B.firstNeg)] });

  HW.defineExit({ lesson: 'u1l2', calc: true, outcome: 'RF9',
    blurb: 'Arithmetic sequences: a term from the first terms, the general term in simplest form, the number of terms, and three expressions that are consecutive terms.',
    questions: [Q(1, 'RF9', 'BEG', 'A term of an arithmetic sequence.', B.arithTk), Q(2, 'RF9', 'PRG', 'The general term.', B.arithGT),
      Q(3, 'RF9', 'PRG', 'How many terms?', B.numTerms), Q(4, 'RF9', 'MAS', 'Three consecutive terms.', B.exprArith)] });

  HW.defineExit({ lesson: 'u1l3', calc: true, outcome: 'RF9',
    blurb: 'Arithmetic sequences in context: d and the general term from two terms, simple interest, and the number of rows from two known rows.',
    questions: [Q(1, 'RF9', 'BEG', 'The common difference from two terms.', B.dFromTwo), Q(2, 'RF9', 'PRG', 'The general term from two terms.', B.gtFromTwo),
      Q(3, 'RF9', 'PRG', 'Simple interest.', B.simpleInterest), Q(4, 'RF9', 'MAS', 'How many rows?', B.rowsFromTwo)] });

  HW.defineExit({ lesson: 'u1l4', calc: true, outcome: 'RF9',
    blurb: 'Arithmetic series: a sum from the first and last terms, a sum up to a last term, a term from a formula for S_n, and a theatre’s total seats from two rows.',
    questions: [Q(1, 'RF9', 'BEG', 'A sum from the first and last terms.', B.arithSnEnds), Q(2, 'RF9', 'PRG', 'A sum up to a last term.', B.arithSumToL),
      Q(3, 'RF9', 'PRG', 'A term from the sum formula.', B.snToTk), Q(4, 'RF9', 'MAS', 'Seats in a theatre.', B.arithTwoTermsSum)] });

  HW.defineExit({ lesson: 'u1l5', calc: true, outcome: 'RF10',
    blurb: 'Geometric sequences: the general term, the exact value of a term, the number of terms, and three expressions that are consecutive terms.',
    questions: [Q(1, 'RF10', 'BEG', 'The general term.', function (r, cp) { return B.geoGT(r, cp, B.geoShared(r), true); }), Q(2, 'RF10', 'PRG', 'An exact term.', B.geoTk),
      Q(3, 'RF10', 'PRG', 'How many terms?', B.geoNumTerms), Q(4, 'RF10', 'MAS', 'Three consecutive terms.', B.exprGeo)] });

  HW.defineExit({ lesson: 'u1l6', calc: true, outcome: 'RF10',
    blurb: 'Geometric growth and decay: a growth factor, a value after depreciation, doubling or half-life, and the first full year past a target.',
    questions: [Q(1, 'RF10', 'BEG', 'The growth factor.', function (r, cp) { return B.gfactor(r, cp, { kind: 'any' }); }), Q(2, 'RF10', 'PRG', 'Depreciation.', B.decayValue),
      Q(3, 'RF10', 'PRG', 'Doubling or half-life.', B.halfLife), Q(4, 'RF10', 'MAS', 'When does it pass the target?', B.firstPast)] });

  HW.defineExit({ lesson: 'u1l7', calc: true, outcome: 'RF10',
    blurb: 'Geometric series: a sum from t1, r and n, a sum up to a last term, the number of terms for a given sum, and a bouncing ball’s total distance.',
    questions: [Q(1, 'RF10', 'BEG', 'A geometric sum.', B.geoSn), Q(2, 'RF10', 'PRG', 'A sum up to a last term.', B.geoSumToL),
      Q(3, 'RF10', 'PRG', 'How many terms?', B.geoNForSum), Q(4, 'RF10', 'MAS', 'A bouncing ball.', B.ballTotal)] });

  HW.defineExit({ lesson: 'u1l8', calc: true, outcome: 'RF10',
    blurb: 'Infinite geometric series: convergent or divergent with S∞, a repeating decimal as a fraction, a missing t1 or r, and a ball bouncing forever.',
    questions: [Q(1, 'RF10', 'BEG', 'Convergent or divergent?', B.infClassify), Q(2, 'RF10', 'PRG', 'A repeating decimal.', B.repDec),
      Q(3, 'RF10', 'PRG', 'A missing value.', B.infMissing), Q(4, 'RF10', 'MAS', 'Bouncing forever.', B.ballForever)] });

  HW.defineExit({ lesson: 'u1l9', calc: true, outcome: 'RF9',
    blurb: 'Unit 1 review: arithmetic means, a stack of cans (RF9), the first term of a geometric sequence from two terms, and ice that thickens geometrically (RF10).',
    questions: [Q(1, 'RF9', 'BEG', 'Arithmetic means.', B.means), Q(2, 'RF9', 'PRG', 'A stack of cans.', B.cansTotal),
      Q(3, 'RF10', 'PRG', 'The first term.', B.geoT1Round), Q(4, 'RF10', 'MAS', 'Ice on a lake.', B.iceK)] });
})(window);
