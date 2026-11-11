/* The course: units and lessons in course order (the Math 20-1 course plan: 70 lessons in 8 units, each unit ending with
 * a review lesson). A lesson with a practice file (HW.lessons[id], js/lessons/<id>.js) is open; the rest show as
 * "coming soon". The class calendar (js/calendar.js) plans every lesson listed here, plus a unit test after each unit. */
(function (root) {
  'use strict';
  root.HW = root.HW || {};
  /* lessons that have a lesson page under lessons/ (examples + the teacher's class notes); the home page, the lesson
   * sidebar and the teaching index (lessons/index.html) link to it as lessons/u1/l7/?class=<block>. Add a lesson's id
   * here once its page lessons/uN/lM/index.html exists (until then it shows as "coming soon"). */
  root.HW.TEACHING = { base: 'lessons/', lessons: ['u1l1', 'u1l2', 'u1l3', 'u1l4', 'u1l5', 'u1l6', 'u1l7', 'u1l8', 'u1l9', 'u2l1', 'u2l2', 'u2l3', 'u2l4', 'u2l5', 'u2l6', 'u2l7', 'u3l1', 'u3l2', 'u3l3', 'u3l4', 'u3l5', 'u3l6', 'u3l7', 'u3l8', 'u3l9', 'u4l1', 'u4l2', 'u4l3', 'u4l4', 'u4l5', 'u4l6', 'u4l7', 'u4l8'] };
  root.HW.CATALOG = [
    { unit: 1, title: 'Sequences and Series', outcomes: 'RF9 · RF10', lessons: [
      { id: 'u1l1', num: '1', title: 'Patterns, Sequences and the General Term' },
      { id: 'u1l2', num: '2', title: 'Arithmetic Sequences' },
      { id: 'u1l3', num: '3', title: 'Arithmetic Sequences in Context (growth, decay, two known terms)' },
      { id: 'u1l4', num: '4', title: 'Arithmetic Series' },
      { id: 'u1l5', num: '5', title: 'Geometric Sequences' },
      { id: 'u1l6', num: '6', title: 'Geometric Growth and Decay' },
      { id: 'u1l7', num: '7', title: 'Geometric Series' },
      { id: 'u1l8', num: '8', title: 'Infinite Geometric Series' },
      { id: 'u1l9', num: '9', title: 'Unit 1 Review' }] },
    { unit: 2, title: 'Radical Expressions', outcomes: 'AN2', lessons: [
      { id: 'u2l1', num: '1', title: 'Mixed and Entire Radicals' },
      { id: 'u2l2', num: '2', title: 'Radicals with Variables and Their Restrictions' },
      { id: 'u2l3', num: '3', title: 'Adding and Subtracting Radicals' },
      { id: 'u2l4', num: '4', title: 'Multiplying Radicals' },
      { id: 'u2l5', num: '5', title: 'Dividing Radicals and Rationalizing Monomial Denominators' },
      { id: 'u2l6', num: '6', title: 'Rationalizing Binomial Denominators with Conjugates' },
      { id: 'u2l7', num: '7', title: 'Unit 2 Review' }] },
    { unit: 3, title: 'Trigonometry', outcomes: 'T1 · T2 · T3', lessons: [
      { id: 'u3l1', num: '1', title: 'Angles in Standard Position and Reference Angles' },
      { id: 'u3l2', num: '2', title: 'Trigonometric Ratios from a Point on the Terminal Arm' },
      { id: 'u3l3', num: '3', title: 'The CAST Rule: Signs and Solving for Angles' },
      { id: 'u3l4', num: '4', title: 'Exact Values from Special Triangles' },
      { id: 'u3l5', num: '5', title: 'The Sine Law' },
      { id: 'u3l6', num: '6', title: 'The Cosine Law' },
      { id: 'u3l7', num: '7', title: 'The Ambiguous Case' },
      { id: 'u3l8', num: '8', title: 'Choosing the Sine Law or the Cosine Law' },
      { id: 'u3l9', num: '9', title: 'Unit 3 Review' }] },
    { unit: 4, title: 'Factoring, Quadratic Equations and Radical Equations', outcomes: 'RF1 · RF5 · AN3', lessons: [
      { id: 'u4l1', num: '1', title: 'Factoring Review: Common Factors and x² + bx + c' },
      { id: 'u4l2', num: '2', title: 'Factoring ax² + bx + c' },
      { id: 'u4l3', num: '3', title: 'Factoring by Substitution: a(f(x))² + b(f(x)) + c' },
      { id: 'u4l4', num: '4', title: 'Differences of Squares, Including a²(f(x))² − b²(g(y))²' },
      { id: 'u4l5', num: '5', title: 'Solving Quadratic Equations by Factoring' },
      { id: 'u4l6', num: '6', title: 'Solving Radical Equations and Checking for Extraneous Roots' },
      { id: 'u4l7', num: '7', title: 'Radical Equations That Lead to Quadratics' },
      { id: 'u4l8', num: '8', title: 'Unit 4 Review' }] },
    { unit: 5, title: 'Quadratic Functions and Equations', outcomes: 'RF3 · RF4 · RF5', lessons: [
      { id: 'u5l1', num: '1', title: 'Zeros, Roots and x-Intercepts' },
      { id: 'u5l2', num: '2', title: 'Graphing y = a(x − p)² + q' },
      { id: 'u5l3', num: '3', title: 'Characteristics of a Quadratic Function in Vertex Form' },
      { id: 'u5l4', num: '4', title: 'General Form and Factored Form: Intercepts, Axis and Vertex' },
      { id: 'u5l5', num: '5', title: 'Writing a Quadratic Equation from Its Vertex and a Point' },
      { id: 'u5l6', num: '6', title: 'Completing the Square' },
      { id: 'u5l7', num: '7', title: 'The Quadratic Formula' },
      { id: 'u5l8', num: '8', title: 'The Discriminant' },
      { id: 'u5l9', num: '9', title: 'Maximum and Minimum Problems: Graphical Approach' },
      { id: 'u5l10', num: '10', title: 'Maximum and Minimum Problems: Algebraic Approach' },
      { id: 'u5l11', num: '11', title: 'Unit 5 Review' }] },
    { unit: 6, title: 'Rational Expressions and Equations', outcomes: 'AN4 · AN5 · AN6', lessons: [
      { id: 'u6l1', num: '1', title: 'Rational Expressions and Non-Permissible Values' },
      { id: 'u6l2', num: '2', title: 'Simplifying Rational Expressions by Factoring' },
      { id: 'u6l3', num: '3', title: 'Multiplying Rational Expressions' },
      { id: 'u6l4', num: '4', title: 'Dividing Rational Expressions' },
      { id: 'u6l5', num: '5', title: 'Adding and Subtracting with Monomial Denominators' },
      { id: 'u6l6', num: '6', title: 'Adding and Subtracting with Binomial and Trinomial Denominators' },
      { id: 'u6l7', num: '7', title: 'Solving Rational Equations' },
      { id: 'u6l8', num: '8', title: 'Rational Equations That Lead to Quadratics' },
      { id: 'u6l9', num: '9', title: 'Problems Involving Rational Equations (work, motion, numbers)' },
      { id: 'u6l10', num: '10', title: 'Unit 6 Review' }] },
    { unit: 7, title: 'Absolute Value and Reciprocal Functions', outcomes: 'AN1 · RF2 · RF11', lessons: [
      { id: 'u7l1', num: '1', title: 'Absolute Value of Real Numbers' },
      { id: 'u7l2', num: '2', title: 'Graphing Absolute Value Functions of Linear Functions' },
      { id: 'u7l3', num: '3', title: 'Graphing Absolute Value Functions of Quadratic Functions' },
      { id: 'u7l4', num: '4', title: 'Solving Absolute Value Equations (Linear)' },
      { id: 'u7l5', num: '5', title: 'Solving Absolute Value Equations (Quadratic)' },
      { id: 'u7l6', num: '6', title: 'Reciprocal Functions of Linear Functions' },
      { id: 'u7l7', num: '7', title: 'Reciprocal Functions of Quadratic Functions' },
      { id: 'u7l8', num: '8', title: 'Unit 7 Review' }] },
    { unit: 8, title: 'Systems of Equations and Inequalities', outcomes: 'RF6 · RF7 · RF8', lessons: [
      { id: 'u8l1', num: '1', title: 'Solving Linear–Quadratic Systems' },
      { id: 'u8l2', num: '2', title: 'Solving Quadratic–Quadratic Systems' },
      { id: 'u8l3', num: '3', title: 'Problems Involving Systems' },
      { id: 'u8l4', num: '4', title: 'Linear Inequalities in Two Variables' },
      { id: 'u8l5', num: '5', title: 'Quadratic Inequalities in Two Variables' },
      { id: 'u8l6', num: '6', title: 'Quadratic Inequalities in One Variable: Roots and Test Points' },
      { id: 'u8l7', num: '7', title: 'Quadratic Inequalities in One Variable: Sign Analysis' },
      { id: 'u8l8', num: '8', title: 'Unit 8 Review' }] }
  ];
  /* a colour for each unit (class calendar, unit headings): neighbouring units contrast, so a unit change is easy to see.
     HW.unitStyle(u) gives CSS variables: --uc (the colour), --ucl (pale tint), --ucs (soft border), --ucd (dark text),
     --uct (solid fill for white text, e.g. a unit test day). */
  var UC = { 1: '#2563eb', 2: '#ea580c', 3: '#7c3aed', 4: '#16a34a', 5: '#db2777', 6: '#0d9488', 7: '#ca8a04', 8: '#4f46e5', 9: '#dc2626', 10: '#8b5e34' };
  function mix(a, b, t) { var x = parseInt(a.slice(1), 16), y = parseInt(b.slice(1), 16), out = '#'; [16, 8, 0].forEach(function (s) { var v = Math.round(((x >> s) & 255) * (1 - t) + ((y >> s) & 255) * t); out += ('0' + v.toString(16)).slice(-2); }); return out; }
  root.HW.UNIT_COLORS = UC;
  root.HW.unitColor = function (u) { var c = UC[u] || '#24508f'; return { c: c, light: mix(c, '#ffffff', 0.87), soft: mix(c, '#ffffff', 0.55), dark: mix(c, '#000000', 0.38), solid: mix(c, '#000000', 0.12) }; };
  root.HW.unitStyle = function (u) { var x = root.HW.unitColor(u); return '--uc:' + x.c + ';--ucl:' + x.light + ';--ucs:' + x.soft + ';--ucd:' + x.dark + ';--uct:' + x.solid; };
  root.HW.OUTCOMES = {
    AN1: 'Absolute value of real numbers',
    AN2: 'Radicals and radical expressions: operations and simplifying',
    AN3: 'Radical equations',
    AN4: 'Equivalent forms of rational expressions',
    AN5: 'Operations on rational expressions',
    AN6: 'Rational equations',
    T1: 'Angles in standard position (0° to 360°)',
    T2: 'Trigonometric ratios for angles from 0° to 360°',
    T3: 'The sine law and the cosine law, including the ambiguous case',
    RF1: 'Factoring polynomial expressions',
    RF2: 'Absolute value functions',
    RF3: 'Quadratic functions in vertex form y = a(x − p)² + q',
    RF4: 'Quadratic functions in general form y = ax² + bx + c',
    RF5: 'Quadratic equations',
    RF6: 'Systems of linear–quadratic and quadratic–quadratic equations',
    RF7: 'Linear and quadratic inequalities in two variables',
    RF8: 'Quadratic inequalities in one variable',
    RF9: 'Arithmetic sequences and series',
    RF10: 'Geometric sequences and series',
    RF11: 'Reciprocal functions',
    EXT: 'Extension (not part of a unit level)',
    REV: 'Review of earlier courses (not part of a unit level)'
  };
  /* outcomes that never count toward a level, a coin or a unit grade: extension topics, and review of earlier courses
     (tag a question outcome: 'REV' or 'EXT') */
  root.HW.NO_LEVEL = { EXT: 1, REV: 1 };
})(window);
